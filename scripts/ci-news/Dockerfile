FROM node:22-bookworm-slim AS cli
RUN npm install --prefix /opt/claude @anthropic-ai/claude-code@2.1.330

FROM python:3.12-slim-bookworm
ARG AGENT_UID=1001
RUN apt-get update && apt-get install -y --no-install-recommends bubblewrap curl git libatomic1 libstdc++6 \
    && bwrap --version \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -M -d /tmp/claude-home -u "$AGENT_UID" translator
COPY --from=cli /usr/local/bin/node /usr/local/bin/node
COPY --from=cli /opt/claude /opt/claude
ENV HOME=/tmp/claude-home PYTHONDONTWRITEBYTECODE=1 PYTHONUTF8=1 CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1
WORKDIR /framework
ENTRYPOINT ["/opt/claude/node_modules/.bin/claude", "-p", "--no-session-persistence"]
