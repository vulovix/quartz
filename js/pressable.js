// ── Pressable Ripple ─────────────────────────────────
// Delegated pointerdown handler that spawns an expanding
// ripple circle inside any .pressable element.

(function () {
  document.addEventListener("pointerdown", function (e) {
    var target = e.target.closest(".pressable");
    if (!target) return;

    var rect = target.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;

    var ripple = document.createElement("span");
    ripple.className = "pressable-ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";

    target.appendChild(ripple);
    ripple.addEventListener(
      "animationend",
      function () {
        ripple.remove();
      },
      { once: true },
    );
  });
})();
