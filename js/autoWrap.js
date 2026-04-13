// ── Auto Wrap ────────────────────────────────────────
// Groups consecutive sibling elements that match a
// selector into a wrapper element, so markdown files
// don't need manual <div> containers.

(function () {
  var rules = [
    {
      selector: ".list-item-block, a.list-item",
      tag: "div",
      className: "list-container",
    },
    {
      selector: ".icon-grid-cell",
      tag: "div",
      className: "icon-grid",
      attrs: { "data-center-odd": "" },
    },
    {
      selector: ".detail-grid-cell",
      tag: "div",
      className: "detail-grid",
    },
    {
      selector: ".blog-post-item",
      tag: "div",
      className: "blog-list",
    },
  ];

  function wrapGroups(rule) {
    // Only select direct children of .page-content to avoid nesting issues
    var container = document.querySelector(".page-content");
    if (!container) return;
    var els = Array.prototype.slice.call(container.children).filter(function (el) {
      return el.matches(rule.selector);
    });
    if (!els.length) return;

    // Build groups of consecutive siblings
    var groups = [];
    var cur = [els[0]];

    for (var i = 1; i < els.length; i++) {
      var prev = cur[cur.length - 1];
      // Walk forward from prev, skipping whitespace-only text nodes
      var next = prev.nextSibling;
      while (next && next.nodeType === 3 && !next.textContent.trim()) {
        next = next.nextSibling;
      }
      if (next === els[i]) {
        cur.push(els[i]);
      } else {
        groups.push(cur);
        cur = [els[i]];
      }
    }
    groups.push(cur);

    // Wrap each group
    groups.forEach(function (group) {
      // Skip if already wrapped
      if (group[0].parentElement.classList.contains(rule.className)) return;

      var wrapper = document.createElement(rule.tag);
      wrapper.className = rule.className;
      if (rule.attrs) {
        Object.keys(rule.attrs).forEach(function (k) {
          wrapper.setAttribute(k, rule.attrs[k]);
        });
      }
      group[0].parentNode.insertBefore(wrapper, group[0]);
      group.forEach(function (el) {
        wrapper.appendChild(el);
      });
    });
  }

  function init() {
    rules.forEach(wrapGroups);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.initAutoWrap = init;
})();
