/* ── Photo Gallery (lightbox) ─────────────────────── */
(function () {
  var lightbox, lbPlace, lbCountry, lbDesc, lbImgWrap;

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.className = "lightbox hidden";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
      '<button class="lightbox-close pressable" aria-label="Close">\u2715</button>' +
      '<div class="lightbox-inner">' +
      '<div class="lightbox-img-wrap"></div>' +
      '<div class="lightbox-caption">' +
      '<div><span class="lb-place"></span><span class="lb-country"></span></div>' +
      '<p class="lb-desc"></p>' +
      "</div>" +
      "</div>";
    document.body.appendChild(lightbox);

    lbPlace = lightbox.querySelector(".lb-place");
    lbCountry = lightbox.querySelector(".lb-country");
    lbDesc = lightbox.querySelector(".lb-desc");
    lbImgWrap = lightbox.querySelector(".lightbox-img-wrap");

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox || lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(card) {
    ensureLightbox();
    var slides = card.querySelector(".photo-card-slides");
    if (!slides) return;

    lbImgWrap.innerHTML = "";
    var clone = slides.querySelector(".carousel").cloneNode(true);
    lbImgWrap.appendChild(clone);
    if (typeof window.initCarousel === "function") {
      window.initCarousel(clone);
    }

    lbPlace.textContent = card.dataset.place || "";
    lbCountry.textContent = card.dataset.country || "";
    lbDesc.textContent = card.dataset.description || "";

    // Constrain lightbox width for portrait/square ratios
    var lbInner = lightbox.querySelector(".lightbox-inner");
    var aspect = card.dataset.aspect;
    if (aspect) {
      var parts = aspect.split("/");
      var w = parseFloat(parts[0]);
      var h = parseFloat(parts[1]);
      if (w && h && h > w) {
        // portrait: cap height to viewport, derive max-width from ratio
        lbInner.style.maxWidth = "min(860px, calc((100vh - 6rem) * " + w / h + "))";
      } else {
        lbInner.style.maxWidth = "";
      }
    } else {
      lbInner.style.maxWidth = "";
    }

    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function initPhotoGallery() {
    document.querySelectorAll(".photo-card").forEach(function (card) {
      if (card._galleryBound) return;
      card._galleryBound = true;
      card.addEventListener("click", function () {
        openLightbox(card);
      });
    });
  }

  initPhotoGallery();
  window.initPhotoGallery = initPhotoGallery;
})();
