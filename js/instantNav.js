// ── Instant Navigation ───────────────────────────────
// Intercepts same-origin link clicks, fetches the new
// page, and swaps only the scroll-area + nav active state.
// Keeps nav, footer, scripts, and audio player alive.

(function () {
  var scrollArea = document.querySelector(".scroll-area");
  if (!scrollArea) return;

  var parser = new DOMParser();
  var cache = {};

  // Resolve all nav links to absolute so they survive pushState URL changes
  document.querySelectorAll(".nav-logo, .nav-link, .mobile-nav-item").forEach(function (el) {
    var raw = el.getAttribute("href");
    if (raw)
      try {
        el.setAttribute("href", new URL(raw, location.href).href);
      } catch (e) {}
  });

  function isSameOrigin(url) {
    try {
      var u = new URL(url, location.href);
      return u.origin === location.origin;
    } catch (e) {
      return false;
    }
  }

  function isNavigable(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    var url = new URL(a.href, location.href);
    if (url.hash && url.pathname === location.pathname) return false;
    return isSameOrigin(a.href);
  }

  function updateNav(doc) {
    // Resolve nav links from the fetched doc (they're relative to the target page)
    var newLinks = doc.querySelectorAll(".nav-link");
    var curLinks = document.querySelectorAll(".nav-link");
    curLinks.forEach(function (link, i) {
      var newLink = newLinks[i];
      if (newLink) {
        link.classList.toggle("active", newLink.classList.contains("active"));
      }
    });

    var newMobile = doc.querySelectorAll(".mobile-nav-item");
    var curMobile = document.querySelectorAll(".mobile-nav-item");
    curMobile.forEach(function (link, i) {
      var newLink = newMobile[i];
      if (newLink) {
        link.classList.toggle("active", newLink.classList.contains("active"));
      }
    });
  }

  function reinitContent() {
    if (window.initAutoWrap) initAutoWrap();
    if (window.initCarouselsIn) initCarouselsIn(scrollArea);
    if (window.initDetailGrids) initDetailGrids();
    if (window.initPulses) initPulses();
    if (window.initPhotoGallery) initPhotoGallery();
    if (window.initAlbumPlayer) initAlbumPlayer();
    if (window.initTrackPlayer) initTrackPlayer();
  }

  function navigate(url) {
    var key = url.replace(/#.*/, "");

    function apply(html) {
      var doc = parser.parseFromString(html, "text/html");

      var newScroll = doc.querySelector(".scroll-area");
      if (!newScroll) {
        location.href = url;
        return;
      }

      // Resolve relative URLs to absolute using the target page as base
      newScroll.querySelectorAll("[href]").forEach(function (el) {
        var raw = el.getAttribute("href");
        if (raw)
          try {
            el.setAttribute("href", new URL(raw, key).href);
          } catch (e) {}
      });
      newScroll.querySelectorAll("[src]").forEach(function (el) {
        var raw = el.getAttribute("src");
        if (raw)
          try {
            el.setAttribute("src", new URL(raw, key).href);
          } catch (e) {}
      });

      // Push state before swapping so the URL is correct
      if (location.href !== url) {
        history.pushState({}, "", url);
      }

      // Swap content
      scrollArea.innerHTML = newScroll.innerHTML;

      // Update title
      var newTitle = doc.querySelector("title");
      if (newTitle) document.title = newTitle.textContent;

      // Update meta description
      var newDesc = doc.querySelector('meta[name="description"]');
      var curDesc = document.querySelector('meta[name="description"]');
      if (curDesc && newDesc) curDesc.setAttribute("content", newDesc.getAttribute("content"));

      // Update nav
      updateNav(doc);

      // Scroll to top
      scrollArea.scrollTop = 0;

      // Re-init components
      reinitContent();
    }

    if (cache[key]) {
      apply(cache[key]);
      return;
    }

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (html) {
        cache[key] = html;
        apply(html);
      })
      .catch(function () {
        location.href = url;
      });
  }

  // Intercept clicks
  document.addEventListener("click", function (e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest("a");
    if (!isNavigable(a)) return;
    e.preventDefault();
    navigate(a.href);
  });

  // Handle back/forward
  window.addEventListener("popstate", function () {
    navigate(location.href);
  });

  // Prefetch on hover
  document.addEventListener(
    "mouseover",
    function (e) {
      var a = e.target.closest("a");
      if (!isNavigable(a)) return;
      var key = a.href.replace(/#.*/, "");
      if (cache[key]) return;
      fetch(a.href)
        .then(function (res) {
          if (res.ok) return res.text();
        })
        .then(function (html) {
          if (html) cache[key] = html;
        })
        .catch(function () {});
    },
    { passive: true },
  );
})();
