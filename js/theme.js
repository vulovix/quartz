// ── Theme Toggle ─────────────────────────────────────
// Toggles .dark on <html>, persists to localStorage.

(function () {
  function toggleTheme() {
    var doc = document.documentElement;

    // Add transition class before toggling
    doc.classList.add("theme-transition");

    var isDark = doc.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Remove transition class after the animation completes
    setTimeout(function () {
      doc.classList.remove("theme-transition");
    }, 300);
  }

  var btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", toggleTheme);

  document.addEventListener("keydown", function (e) {
    var isTyping = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    if (e.key.toLowerCase() === "d" && !isTyping) {
      toggleTheme();
    }
  });
})();
