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

  // Handle pre-opened accordions
  document.addEventListener("DOMContentLoaded", function () {
    var expandedTriggers = document.querySelectorAll("[data-expand].expanded");
    for (var i = 0; i < expandedTriggers.length; i++) {
      var trigger = expandedTriggers[i];
      var detail = document.getElementById(trigger.dataset.expand);
      if (detail && detail.classList.contains("open") && typeof initCarouselsIn === "function") {
        initCarouselsIn(detail);
      }
    }
  });
})();
