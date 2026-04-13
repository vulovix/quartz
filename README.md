# Quartz

Build your website using markown only.

## Installation

Install this theme as a Git submodule so your content and theme stay in separate repos. The theme auto-updates independently.

**1. Add as submodule**

```bash
git submodule add https://github.com/vulovix/quartz quartz
git submodule update --init
```

**2. Configure `mkdocs.yml`**

```yaml
site_name: Your Name
site_description: Your tagline

plugins:
  - search
  - macros:
      module_name: macros   # your root-level macros.py

theme:
  name: null
  custom_dir: quartz/
  locale: en
  static_templates:
    - 404.html

hooks:
  - quartz/hooks.py   # theme hooks
  - hooks.py                # your overrides (optional)
```

**3. Update the submodule later**

```bash
git submodule update --remote
```

---

### SEO & Meta Reference

The theme automatically generates a full set of SEO tags from `mkdocs.yml`. Here's what it reads and what gets output — configure the YAML and the `<head>` takes care of itself.

#### `mkdocs.yml` config

**Required**

`site_name`
:   `<title>`, `og:site_name`, `og:title`, `twitter:title`, JSON-LD `name`
:   e.g. `IVAN VULOVIĆ`

`site_description`
:   `<meta description>`, `og:description`, `twitter:description`, JSON-LD `description`
:   e.g. `JavaScript Developer`

`site_url`
:   `<link canonical>`, `og:url`, JSON-LD `url`, SearchAction target
:   e.g. `https://example.com`

**Recommended**

`site_author`
:   `<meta name="author">`
:   e.g. `Ivan Vulović`

`extra.og_image`
:   `og:image` + `width` / `height` / `type` / `alt`, `twitter:image` + `alt`, JSON-LD `image`
:   e.g. `https://example.com/assets/og.png`

`extra.keywords`
:   `<meta name="keywords">`
:   e.g. `JavaScript, Developer, Frontend`

`extra.author.name`
:   JSON-LD `Person → name`
:   e.g. `Ivan Vulović`

`extra.author.url`
:   JSON-LD `Person → url`
:   e.g. `https://example.com`

**Optional**

`extra.twitter_handle`
:   `twitter:site`, `twitter:creator`

`extra.locale`
:   `og:locale` — defaults to `en`

#### Per-page front matter

Individual pages can override the global description:

```yaml
---
description: Custom description for this page only.
---
```

This feeds `og:description` and `twitter:description` for that page while the rest falls back to `site_description`.

#### Generated `<head>` tags

The theme outputs the following tags automatically:

**Core SEO**

`<title>`
:   homepage: `site_name · site_description`
:   other pages: `Page Title · site_name`

`<meta name="description">`
:   from `site_description` or page front matter

`<meta name="keywords">`
:   from `extra.keywords`

`<meta name="author">`
:   from `site_author`

`<meta name="robots" content="index, follow">`
:   always output

`<meta name="generator" content="MkDocs">`
:   always output

`<link rel="canonical">`
:   from `site_url` + page path

**Open Graph**

`og:type`
:   `website`

`og:locale`
:   from `extra.locale`

`og:site_name`, `og:title`, `og:description`, `og:url`
:   mapped from metadata

`og:image`
:   from `extra.og_image` (1200×630 PNG recommended)

`og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`
:   generated automatically

**Twitter Card**

`twitter:card`
:   `summary_large_image` when `extra.og_image` is set, otherwise `summary`

`twitter:title`, `twitter:description`
:   mapped from metadata

`twitter:image`, `twitter:image:alt`
:   mapped from `og:image` metadata

`twitter:site`, `twitter:creator`
:   from `extra.twitter_handle`

**JSON-LD Structured Data**

`@type`
:   `WebSite` on homepage, `WebPage` on other pages

`name`, `description`, `url`, `image`
:   mapped from metadata

`author`
:   `Person` with `name` and `url` from `extra.author`

`potentialAction`
:   `SearchAction` on homepage (enables Google sitelinks search box)

**Icons & PWA**

`<link rel="icon">`
:   `assets/favicon.ico` (16×16 + 32×32)

`<link rel="icon" type="image/png">`
:   `assets/icon-192.png`

`<link rel="apple-touch-icon">`
:   `assets/apple-touch-icon.png` (180×180)

`<link rel="manifest">`
:   `assets/manifest.json`

**Theme color**

Light/Dark mode
:   `#ffffff` / `#111111` (via `prefers-color-scheme` media queries)

#### Required files in `docs/assets/`

`favicon.ico`
:   16×16 + 32×32
:   Browser tab icon

`icon-192.png`
:   192×192
:   PWA icon, Android shortcut

`icon-512.png`
:   512×512
:   PWA splash, install prompt

`icon-192-maskable.png`
:   192×192
:   PWA adaptive icon (safe zone)

`icon-512-maskable.png`
:   512×512
:   PWA adaptive icon (safe zone)

`apple-touch-icon.png`
:   180×180
:   iOS home screen

`og.png`
:   1200×630
:   Social share preview (OG + Twitter)

`screenshot-wide.png`
:   1920×1080
:   PWA install prompt (desktop)

`screenshot-narrow.png`
:   390×844
:   PWA install prompt (mobile)

`manifest.json`
:   —
:   Web app manifest (icons + screenshots)

#### Minimal example

```yaml
site_name: Your Name
site_description: Your tagline
site_url: https://yoursite.com
site_author: Your Name

extra:
  og_image: https://yoursite.com/assets/og.png
  twitter_handle: yourhandle
  locale: en
  keywords: Your, Keywords, Here
  author:
    name: Your Name
    url: https://yoursite.com
```

---

### Extending Macros

Create `macros.py` at the repo root. Import the theme's macros and add your own on top — both sets work side by side.

```python
# macros.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "quartz"))

from macros import define_env as _theme_env

def define_env(env):
    _theme_env(env)          # registers all theme macros

    @env.macro
    def book(title, author, url="#"):
        return (
            f'<a href="{url}" class="book-badge pressable">'
            f'<span class="book-title">{title}</span>'
            f'<span class="book-author">{author}</span>'
            f'</a>'
        )

    @env.macro
    def period(start, end="present"):
        return f'<span class="period">{start} – {end}</span>'
```

**`book(title, author, url)`** — linked book badge:

{{ book("Sapiens", "Yuval Noah Harari", "https://example.com") }}

**`period(start, end)`** — styled date range:

{{ period("2022", "2024") }} Senior Engineer at Acme

{{ period("2024") }} Freelance

---

### Extending Hooks

Create `hooks.py` at the repo root and register it in `mkdocs.yml` alongside the theme's hook file. Each file runs independently for each event.

```yaml
hooks:
  - quartz/hooks.py
  - hooks.py
```

**Example — disable the injected `/showcase/` page:**

```python
# hooks.py
def on_files(files, config):
    files._files = [f for f in files._files if f.src_path != "showcase.md"]
    return files
```

**Example — inject custom data into every page:**

```python
# hooks.py
def on_page_context(context, page, config, nav):
    context["team"] = ["Alice", "Bob", "Carol"]
    return context
```

Then in any markdown page:

{% raw %}
```markdown
{% for member in team %}
- {{ member }}
{% endfor %}

The team: {{ team | join(", ") }}
```
{% endraw %}

Any MkDocs event (`on_page_markdown`, `on_post_build`, etc.) can be defined here.

---

## Components

Done with installation? Visit /showcase route and learn more about components you can use.