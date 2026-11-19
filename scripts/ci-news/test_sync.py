"""订阅队列、滚动补丁和通过复核的交付边界。"""

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import sync


class NewsSyncTests(unittest.TestCase):
    def test_claude_failure_reports_both_streams_without_token(self):
        script = ("import os, sys; print('subscription error', os.environ['CLAUDE_CODE_OAUTH_TOKEN']);"
                  "print('container diagnostic', file=sys.stderr); sys.exit(1)")
        with patch.dict(os.environ, CLAUDE_CODE_OAUTH_TOKEN="secret-for-test"):
            with self.assertRaises(ValueError) as error:
                sync.claude_output([sys.executable, "-c", script], "")
        self.assertIn("subscription error", str(error.exception))
        self.assertIn("container diagnostic", str(error.exception))
        self.assertNotIn("secret-for-test", str(error.exception))

    def test_real_framework_with_offline_draft_and_report(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(
                os.environ, EVE_TRANSLATOR_JOBS=tmp, PYTHONUTF8="1"):
            def agent(prompt):
                material = json.loads(prompt.split("只输出 JSON。\n")[-1])
                if "report_format" in material:
                    self.assertIn("12:00 UTC", material["preview"])
                    return json.dumps(dict(material["report_format"], verdict="pass", findings=[],
                                           reviewer_context="offline-reviewer"))
                corrected = "validation" in material
                if corrected:
                    self.assertIn("check", material["validation"])
                    material = material["materials"]
                body = "飞行测试于12:00 UTC开始。" if corrected else "飞行测试开始。"
                return json.dumps([{"id": block["id"], "zh": zh} for block, zh in
                                   zip(material["blocks"], ["飞行测试", body], strict=True)])

            with patch.object(sync, "claude", side_effect=agent) as calls:
                result = sync.translate("# Flight test\n\nThe flight test starts at 12:00 UTC.\n", "offline")
                self.assertEqual(result, "# 飞行测试\n\n飞行测试于12:00 UTC开始。")
                self.assertEqual(calls.call_count, 3)

    def test_baseline_pending_and_rollover(self):
        state = sync.discover(None, ["old"], "v1", "one")
        self.assertEqual(state["pending"], [])
        state = sync.discover(state, ["b", "a"], "v1", "two")
        self.assertEqual(state["pending"], ["a", "b", "v1"])
        state = sync.discover(state, ["b", "old"], "v2", "two")
        self.assertEqual(state["pending"], ["a", "b", "v1", "v2"])

    def test_source_links(self):
        rss = "<rss><channel><item><link>{}</link></item></channel></rss>"
        self.assertEqual(sync.feed_slugs(rss.format(sync.ccp.page_url("new"))), ["new"])
        with self.assertRaises(ValueError):
            sync.feed_slugs(rss.format("https://example.org/news/view/new"))
        with self.assertRaises(ValueError):
            sync.current_patch("<a>Patch Notes</a>")

    def test_stale_official_section_falls_back_to_translation(self):
        first = "# Version\n\nIntro\n\n## Patch Notes for 2026-11-20.1\n\nOne"
        zh = {"intro": "# 版本\n\n前言", "2026-11-20.1": "原官译"}
        slug = "patch-notes-version-24-02"
        with patch.object(sync, "proofread", side_effect=lambda text, source: text):
            text, origin, hashes = sync.patch_translation(slug, first, {}, None, zh)
            self.assertEqual(origin, "official")
            page = "---\ntitle: 标题\n---\n" + text.split("\n", 1)[1]
            changed = first.replace("One", "Two")
            translated, origin, _ = sync.patch_translation(
                slug, changed, hashes, page, zh, translator=lambda *args: "# 标题\n\n新译文")
            self.assertEqual(origin, "site")
            self.assertIn("新译文", translated)
            self.assertNotIn("原官译", translated)

    def test_patch_incremental_and_editorial_changes(self):
        first = "# Version\n\nIntro\n\n## **Patch Notes for 2026-11-20.1**\n\nOne"
        second = first + "\n\n## Patch Notes for 2026-11-20.2\n\nTwo"
        slug = "patch-notes-version-24-02"
        calls = []

        def translate(source, label):
            calls.append(label)
            return "# 测试\n\n段落 " + source.splitlines()[-1]

        text, origin, hashes = sync.patch_translation(slug, first, {}, None, translator=translate)
        self.assertEqual(origin, "site")
        body = text.split("\n", 1)[1].replace("段落 One", "人工校订")
        page = "---\ntitle: 标题\n---\n" + body
        calls.clear()
        text, _, _ = sync.patch_translation(slug, second, hashes, page, translator=translate)
        self.assertEqual(calls, [slug + "-2026-11-20.2"])
        self.assertIn("人工校订", text)
        calls.clear()
        sync.patch_translation(slug, first.replace("One", "Corrected"), hashes, page, translator=translate)
        self.assertEqual(calls, [slug + "-2026-11-20.1"])

    def test_patch_demotes_inner_h2(self):
        source = "# Version\n\nIntro\n\n## **Patch Notes for 2026-11-20.1**\n\n## Defect Fixes:\n\n### Graphics:\n\n- Fixed"
        rendered, _, _ = sync.patch_translation(
            "patch-notes-version-24-02", source, {}, None,
            translator=lambda text, label: "# 标题\n\n" + ("前言" if label.endswith("intro") else "## 缺陷修复：\n\n### 画面：\n\n- 已修复"),
        )
        self.assertIn("## **2026-11-20.1补丁说明**", rendered)
        self.assertIn("### 缺陷修复：", rendered)
        self.assertIn("#### 画面：", rendered)
        self.assertNotIn("\n## 缺陷修复：", rendered)

    def test_review_gate(self):
        with tempfile.TemporaryDirectory() as temp:
            draft = Path(temp) / "translation.md"
            draft.write_text("# 飞行\n\n译文", "utf-8")
            for labels in (["已复核"], ["复核后修订"], ["待复核"], ["已复核", "部分译文"]):
                def command(name, *args, **kwargs):
                    return {"prepare": {"job": "sample"}, "check": {}, "review": {},
                            "status": {"phase": "passed"}, "render": {
                                "file": str(draft), "delivery": {"labels": labels, "skipped_checks": []}
                            }}[name]
                with self.subTest(labels=labels), patch.object(sync, "framework", command), \
                        patch.object(sync, "claude") as agent:
                    if labels in (["已复核"], ["复核后修订"]):
                        self.assertIn("译文", sync.translate("source", "test"))
                    else:
                        with self.assertRaises(ValueError):
                            sync.translate("source", "test")
                    self.assertEqual(agent.call_count, 2)


if __name__ == "__main__":
    unittest.main()
