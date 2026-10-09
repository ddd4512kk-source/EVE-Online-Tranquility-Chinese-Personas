const dialog = document.getElementById("glossary-dialog");

if (dialog && typeof dialog.showModal === "function") {
  let active;
  document.querySelector(".bio .prose")?.addEventListener("click", (event) => {
    const link = event.target.closest("a.term-link");
    if (!link) return;
    const entry = document.getElementById(`dialog-${link.dataset.glossaryId}`);
    if (!entry) return;
    event.preventDefault();
    if (active) active.hidden = true;
    entry.hidden = false;
    active = entry;
    dialog.showModal();
  });
  dialog.querySelector(".glossary-close")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
