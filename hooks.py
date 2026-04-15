"""MkDocs event hooks – custom block generators."""

import json
import re
import yaml
from html import escape
from pathlib import Path
from mkdocs.structure.files import File


def on_files(files, config):
    """Inject showcase.md from the theme into the site."""
    theme_docs = Path(__file__).parent / "docs"
    showcase = theme_docs / "showcase.md"
    if showcase.exists():
        files.append(File(
            path="showcase.md",
            src_dir=str(theme_docs),
            dest_dir=config["site_dir"],
            use_directory_urls=config["use_directory_urls"],
        ))
    return files


def on_config(config):
    """Register custom block generators into the customblocks extension."""

    # Load icon SVG paths for icon-item blocks
    config_dir = Path(config["config_file_path"]).parent
    icons_file = config_dir / "data" / "icons.yml"
    icons = {}
    if icons_file.exists():
        with open(icons_file) as f:
            icons = yaml.safe_load(f) or {}

    def _svg(name):
        path = icons.get(name, "")
        return f"""<svg viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">{path}</svg>"""

    # ── Generators ──────────────────────────────────────────

    def section_heading(ctx, subtitle=""):
        content = ctx.content.strip()
        sub = ""
        if subtitle:
            sub = f""" <span style="opacity: var(--opacity-secondary)">{subtitle}</span>"""
        return f"""<p class="section-label">{content}{sub}</p>"""

    def link_item(ctx, title="", url="#"):
        sub = escape(ctx.content.strip())
        return f"""\
<a href="{escape(url)}" class="list-item pressable">
  <div>
    <h4 class="project-title">{escape(title)}</h4>
    <p class="project-sub">{sub}</p>
  </div>
  <span class="link-list-arrow">&#8599;</span>
</a>"""

    def icon_item(ctx, icon="", name=""):
        desc = escape(ctx.content.strip())
        
        icon_html = ""
        if "/" in icon or icon.endswith(".svg"):
            config_dir = Path(config["config_file_path"]).parent
            icon_path = config_dir / icon.lstrip("/")
            if icon_path.exists():
                with open(icon_path, "r") as f:
                    icon_html = f.read()
            else:
                icon_html = f'<img src="{escape(icon)}" alt="{escape(name)}" />'
        else:
            icon_html = _svg(icon)

        return f"""\
<div class="icon-grid-cell">
  <div class="icon-grid-icon">{icon_html}</div>
  <div class="icon-grid-info">
    <p class="icon-grid-name">{name}</p>
    <p class="icon-grid-desc">{desc}</p>
  </div>
</div>"""

    def detail_cell(ctx, slug="", name="", logo="", open=""):
        blurb = escape(ctx.content.strip()).replace("\n", "&#10;")
        open_attr = ' data-open="true"' if open.lower() == "true" else ""
        return f"""\
<div class="detail-grid-cell pressable"
  data-slug="{escape(slug)}"
  data-name="{escape(name)}"
  data-blurb="{blurb}"{open_attr}
  role="button" tabindex="0">
  <img src="{escape(logo)}" alt="{escape(name)}"
    class="detail-grid-logo" loading="lazy" draggable="false" />
</div>"""

    _IMG_RE = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$")

    def accordion(ctx, id="", title="", subtitle="", pulse="", aspect="", open=""):
        content = ctx.content.strip()
        images = []
        text_lines = []
        for line in content.split("\n"):
            m = _IMG_RE.match(line.strip())
            if m:
                images.append((m.group(1), m.group(2)))
            else:
                text_lines.append(line)

        imgs_html = "".join(f'<img src="{escape(src)}" alt="{escape(alt)}" draggable="false" loading="lazy" />' for alt, src in images)
        paragraphs = "".join(f"<p>{escape(p.strip())}</p>" for p in "\n".join(text_lines).split("\n\n") if p.strip())

        detail_id = f"project-{escape(id)}"
        trigger_id = f"{detail_id}-trigger"

        pulse_attrs = ""
        if pulse:
            parts = pulse.split()
            pulse_attrs = ' data-pulse=""'
            for p in parts:
                if p.startswith("child="):
                    pulse_attrs += f""" data-pulse-child="{escape(p[6:])}" """
                elif p.startswith("style="):
                    pulse_attrs += f""" data-pulse-style="{escape(p[6:])}" """
            pulse_attrs = pulse_attrs.rstrip()

        carousel_style = f" style=\"aspect-ratio:{aspect}\"" if aspect else ""
        
        trigger_classes = "list-item list-item-expandable pressable"
        detail_classes = "list-item-detail"
        
        if open.lower() == "true":
            trigger_classes += " expanded"
            detail_classes += " open"

        return f"""\
<div class="list-item-block">
  <div id="{trigger_id}" class="{trigger_classes}"
    data-expand="{detail_id}"{pulse_attrs}>
    <div>
      <h4 class="project-title">{title}</h4>
      <p class="project-sub">{subtitle}</p>
    </div>
    <svg class="expand-icon"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
  <div id="{detail_id}" class="{detail_classes}">
    <div class="project-detail-body">
      <div class="carousel"{carousel_style} data-carousel="">
        <div class="carousel-track">{imgs_html}</div>
        <div class="carousel-dots"></div>
      </div>
      <div class="project-text">{paragraphs}</div>
    </div>
  </div>
</div>"""

    def photo_card(ctx, id="", place="", country="", year="", description="", aspect=""):
        content = ctx.content.strip()
        images = []
        for line in content.split("\n"):
            m = _IMG_RE.match(line.strip())
            if m:
                images.append((m.group(1), m.group(2)))

        if not images:
            return "<div><!-- photo-card: no images --></div>"

        first_alt, first_src = images[0]
        thumb_src = first_src.replace("w=1400&h=900", "w=900&h=600")
        count = len(images)
        badge = f"""<span class="photo-count-badge">{count}</span>""" if count > 1 else ""

        slides = "".join(
            f"""<img src="{escape(src)}" alt="{escape(alt)}" draggable="false" loading="lazy" />"""
            for alt, src in images
        )

        aspect_style = f" style=\"aspect-ratio:{aspect}\"" if aspect else ""
        aspect_data = f" data-aspect=\"{escape(aspect)}\"" if aspect else ""
        return f"""\
<div class="photo-card pressable"
  data-photo-id="{escape(id)}"
  data-place="{escape(place)}"
  data-country="{escape(country)}"
  data-description="{escape(description)}"{aspect_data}>
  <div class="photo-card-img-wrap"{aspect_style}>
    <img src="{escape(thumb_src)}" alt="{escape(first_alt)}" loading="lazy" draggable="false" />
    {badge}
  </div>
  <div class="photo-card-info">
    <div class="photo-card-header">
      <div>
        <h3 class="photo-card-place">{escape(place)}</h3>
        <p class="photo-card-country">{escape(country)}</p>
      </div>
      <span class="photo-card-year">{escape(year)}</span>
    </div>
    <p class="photo-card-desc">{escape(description)}</p>
  </div>
  <div class="photo-card-slides hidden">
    <div class="carousel"{aspect_style} data-carousel="">
      <div class="carousel-track">{slides}</div>
      <div class="carousel-dots"></div>
    </div>
  </div>
</div>"""

    def album_card(ctx, id="", title="", artist="", year="", cover=""):
        content = ctx.content.strip()
        # Parse tracks: "title | duration | src" per line
        tracks = []
        for line in content.split("\n"):
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 3:
                tracks.append({"title": parts[0], "duration": parts[1], "src": parts[2]})

        tracks_json = escape(json.dumps(
            [{"title": t["title"], "src": t["src"]} for t in tracks]
        ))

        track_rows = []
        for i, t in enumerate(tracks):
            track_rows.append(f"""\
<div class="track-row list-item pressable"
  data-album="{escape(id)}" data-index="{i}" data-src="{escape(t["src"])}">
  <div class="track-row-left">
    <span class="track-num">{i + 1}</span>
    <span class="track-play-icon hidden">
      <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"></polygon></svg>
    </span>
    <span class="track-pause-icon hidden">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </span>
    <span class="track-title">{escape(t["title"])}</span>
  </div>
  <span class="track-duration">{escape(t["duration"])}</span>
</div>""")
        joined_tracks = "".join(track_rows)

        return f"""\
<div class="list-container" data-album="{escape(id)}">
  <script type="application/json" class="album-tracks-data">{tracks_json}</script>
  <div class="album-header">
    <img src="{escape(cover)}" alt="{escape(title)}" class="album-cover" />
    <div class="album-header-info">
      <h3 class="album-title">{escape(title)}</h3>
      <p class="album-artist">{escape(artist)}</p>
    </div>
    <span class="album-year">{escape(year)}</span>
  </div>
  {joined_tracks}
  <div class="mini-player hidden" data-album="{escape(id)}">
    <div class="mini-player-info">
      <span class="mini-player-title"></span>
    </div>
    <div class="mini-player-controls">
      <button class="mini-prev pressable" aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="19,20 9,12 19,4"></polygon>
          <rect x="5" y="4" width="2" height="16"></rect>
        </svg>
      </button>
      <button class="mini-playpause pressable" aria-label="Play/Pause">
        <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
        <svg class="icon-pause hidden" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <button class="mini-next pressable" aria-label="Next">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,4 15,12 5,20"></polygon>
          <rect x="17" y="4" width="2" height="16"></rect>
        </svg>
      </button>
    </div>
    <div class="mini-player-progress">
      <div class="mini-progress-bar">
        <div class="mini-progress-fill"></div>
      </div>
      <div class="mini-progress-times">
        <span class="mini-time-current">0:00</span>
        <span class="mini-time-total">0:00</span>
      </div>
    </div>
  </div>
</div>"""

    def blog_post(ctx, slug="", title="", date=""):
        excerpt = escape(ctx.content.strip())
        return f"""\
<a href="/writing/{escape(slug)}/" class="blog-post-item">
  <span class="blog-post-date">{escape(date)}</span>
  <div class="blog-post-main">
    <span class="blog-post-title">{escape(title)}</span>
    <span class="blog-post-excerpt">{excerpt}</span>
  </div>
</a>"""

    config.setdefault("mdx_configs", {}).setdefault("customblocks", {})
    config["mdx_configs"]["customblocks"]["generators"] = {
        "section-heading": section_heading,
        "link-item": link_item,
        "icon-item": icon_item,
        "detail-cell": detail_cell,
        "accordion": accordion,
        "photo-card": photo_card,
        "album-card": album_card,
        "blog-post": blog_post,
    }
    return config
