// ── Expandable List Items ────────────────────────────
// Delegated click on [data-expand] toggles .open on
// the target detail panel and inits carousels inside.

(function () {
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-expand]");
    if (!trigger) return;

    var detail = document.getElementById(trigger.dataset.expand);
    if (!detail) return;

    var isOpen = detail.classList.toggle("open");
    trigger.classList.toggle("expanded", isOpen);
    if (isOpen && typeof initCarouselsIn === "function") {
      initCarouselsIn(detail);
    }
  });
})();
