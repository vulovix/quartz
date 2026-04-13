// ── Navigation ───────────────────────────────────────
// Hamburger toggle for mobile menu.

(function () {
  var menuOpen = false;
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  var hbLine1 = document.getElementById("hb-line1");
  var hbLine2 = document.getElementById("hb-line2");
  var hbLine3 = document.getElementById("hb-line3");

  function toggleMenu(open) {
    menuOpen = open;
    if (mobileMenu) mobileMenu.classList.toggle("hidden", !open);
    if (hbLine1 && hbLine2 && hbLine3) {
      hbLine1.style.transform = open ? "translateY(5px) rotate(45deg)" : "";
      hbLine2.style.opacity = open ? "0" : "";
      hbLine3.style.transform = open ? "translateY(-5px) rotate(-45deg)" : "";
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu(!menuOpen);
    });
  }

  document.addEventListener("click", function (e) {
    if (menuOpen && mobileMenu && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();
