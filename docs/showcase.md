---
title: Quartz Theme Showcase
hide_nav: true
---

## Components

Every component this theme ships, demonstrated with sample content. Drop any of these `:::` blocks into a markdown file — no HTML required.


### Section Heading

Section headings with an optional subtitle.

::: section-heading
    Section Title

::: section-heading subtitle="With a subtitle"
    Another Section

**Code:**
```markdown
::: section-heading
    Section Title

::: section-heading subtitle="With a subtitle"
    Another Section
```

---

### Link Item

Navigational list items with an arrow. Consecutive items auto-group into a styled container.

::: link-item title="External Link" url="https://example.com"
    Opens in the same tab with an arrow indicator

::: link-item title="Another Link" url="#"
    Supports any URL — relative or absolute

::: link-item title="Third Item" url="#"
    Items group automatically into a bordered list

**Code:**
```markdown
::: link-item title="External Link" url="https://example.com"
    Opens in the same tab with an arrow indicator

::: link-item title="Another Link" url="#"
    Supports any URL — relative or absolute

::: link-item title="Third Item" url="#"
    Items group automatically into a bordered list
```

---

### Icon Item

Icon + text cells arranged in a 2-column grid. Uses SVG icons defined in `data/icons.yml` or loads SVG files directly from your `docs_dir` when an `.svg` path is provided.

::: icon-item icon="assets/svg/wrench.svg" name="Build & Performance"
    If it's slow, I fix it. If the build takes too long, I fix that too.

::: icon-item icon="code" name="Code"
    For programming, development, or technical topics.

::: icon-item icon="heart" name="Heart"
    Health, passion, or things you care about.

::: icon-item icon="mountain" name="Mountain"
    Outdoor activity, adventure, or big challenges.

::: icon-item icon="music" name="Music"
    Audio, production, or creative expression.

::: icon-item icon="bar-chart" name="Bar Chart"
    Analytics, data, or measurement.

**Code:**
```markdown
::: icon-item icon="assets/svg/wrench.svg" name="Build & Performance"
    If it's slow, I fix it. If the build takes too long, I fix that too.

::: icon-item icon="code" name="Code"
    For programming, development, or technical topics.

::: icon-item icon="heart" name="Heart"
    Health, passion, or things you care about.

::: icon-item icon="mountain" name="Mountain"
    Outdoor activity, adventure, or big challenges.

::: icon-item icon="music" name="Music"
    Audio, production, or creative expression.

::: icon-item icon="bar-chart" name="Bar Chart"
    Analytics, data, or measurement.
```

---

### Detail Cell

A 2×2 grid of cells that expand to reveal detail text on click. Wrapper and detail panel are injected automatically.

::: detail-cell slug="acme" name="Acme Corp" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=ACME"
    Worked with the Acme team on a dashboard rebuild. Migrated legacy views to a modern stack and cut load times in half. Delivered over a six-month engagement with a two-week sprint cycle.

::: detail-cell slug="globex" name="Globex" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=GLOBEX"
    Embedded with the Globex product team to build a configuration platform for enterprise clients. Shipped four major releases and improved bundle performance by 40%.

::: detail-cell slug="initech" name="Initech" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=INITECH"
    Short engagement focused on Core Web Vitals. Audited the render pipeline, removed blocking scripts, and pushed the Lighthouse score from 54 to 91 on mobile.

::: detail-cell slug="umbrella" name="Umbrella" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=UMBRELLA"
    Part of the web player team — live stream and VOD playback across a multilingual platform. Built adaptive bitrate switching and a rewritten controls UI.

**Code:**
```markdown
::: detail-cell slug="acme" name="Acme Corp" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=ACME"
    Worked with the Acme team on a dashboard rebuild. Migrated legacy views to a modern stack and cut load times in half. Delivered over a six-month engagement with a two-week sprint cycle.

::: detail-cell slug="globex" name="Globex" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=GLOBEX"
    Embedded with the Globex product team to build a configuration platform for enterprise clients. Shipped four major releases and improved bundle performance by 40%.

::: detail-cell slug="initech" name="Initech" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=INITECH"
    Short engagement focused on Core Web Vitals. Audited the render pipeline, removed blocking scripts, and pushed the Lighthouse score from 54 to 91 on mobile.

::: detail-cell slug="umbrella" name="Umbrella" logo="https://placehold.co/200x80/1a1a1a/ffffff?text=UMBRELLA"
    Part of the web player team — live stream and VOD playback across a multilingual platform. Built adaptive bitrate switching and a rewritten controls UI.
```

---

### Accordion

Expandable cards with an image carousel and description text. The first item shows the attention-pulse animation.

::: accordion id="demo-alpha" title="Project Alpha" subtitle="A design system for modern teams" pulse="child=.expand-icon style=ripple"
    ![Design tokens](https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=450&fit=crop)
    ![Component explorer](https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=450&fit=crop)

    A headless component library with zero default CSS. Built in TypeScript, fully tree-shakeable, and tested end-to-end with Playwright.

    Used in production across three separate codebases. Designed for teams who want full control over their UI.

::: accordion id="demo-beta" title="Project Beta" subtitle="E-commerce storefront"
    ![Storefront](https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=450&fit=crop)
    ![Packaging](https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&h=450&fit=crop)
    ![Brand](https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&h=450&fit=crop)

    Full-stack build — Next.js storefront, Stripe checkout, and a headless CMS. Achieves a 99 Lighthouse performance score on mobile.

::: accordion id="demo-gamma" title="Project Gamma" subtitle="Horizontal — 4/3 aspect" aspect="4/3"
    ![Architecture](https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop)
    ![Detail](https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop)

    Wider ratio for presentation decks, dashboards, or any content where landscape images need more vertical room than 16/9 provides.

::: accordion id="demo-delta" title="Project Delta" subtitle="Vertical — 3/4 aspect" aspect="3/4"
    ![Portrait shoot](https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop)
    ![Studio](https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=800&fit=crop)

    Tall ratio for portrait photography, mobile screenshots, or editorial layouts where the subject fills a vertical frame.

    Works well for fashion shoots, product close-ups, and any content originally captured in portrait mode.

**Code:**
```markdown
::: accordion id="demo-alpha" title="Project Alpha" subtitle="A design system for modern teams" pulse="child=.expand-icon style=ripple"
    ![Design tokens](https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=450&fit=crop)
    ![Component explorer](https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=450&fit=crop)

    A headless component library with zero default CSS...

::: accordion id="demo-beta" title="Project Beta" subtitle="E-commerce storefront"
    ![Storefront](https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=450&fit=crop) ...
```

---

### Photo Card

Image cards with a thumbnail, metadata, and a hidden carousel for lightbox viewing.

::: photo-card id="demo-alps" place="Swiss Alps" country="Switzerland" year="2024" description="First light breaking over the Bernese Oberland at 3,200m."
    ![Mountain at dawn](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=900&fit=crop)
    ![Alpine lake](https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&h=900&fit=crop)
    ![Golden meadow](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=900&fit=crop)

::: photo-card id="demo-kyoto" place="Kyoto" country="Japan" year="2023" description="Fushimi Inari at dusk — after the last tourist buses leave."
    ![Torii gates](https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&h=900&fit=crop)
    ![Bamboo grove](https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1400&h=900&fit=crop)

::: photo-card id="demo-patagonia" place="Patagonia" country="Argentina" year="2023" aspect="3/2" description="Horizontal — wide landscapes and open skies."
    ![Torres del Paine](https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&h=900&fit=crop)
    ![Glacial lake](https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=1400&h=900&fit=crop)

::: photo-card id="demo-portrait" place="Marrakech" country="Morocco" year="2024" aspect="2/3" description="Vertical — portrait orientation for tall subjects."
    ![Street alley](https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900&h=1400&fit=crop)
    ![Doorway](https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=900&h=1400&fit=crop)

**Code:**
```markdown
::: photo-card id="demo-alps" place="Swiss Alps" country="Switzerland" year="2024" description="First light breaking over the Bernese Oberland at 3,200m."
    ![Mountain at dawn](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=900&fit=crop)
    ![Alpine lake](https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&h=900&fit=crop)

::: photo-card id="demo-patagonia" place="Patagonia" country="Argentina" year="2023" aspect="3/2" description="Horizontal — wide landscapes and open skies."
    ![Torres del Paine](https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&h=900&fit=crop) ...
```

---

### Album Card

Music player with track list, play/pause controls, and a mini player bar. Tracks use `title | duration | src` format.

::: album-card id="demo-album" title="Demo Tape" artist="Showcase" year="2026" cover="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
    First Light | 3:12 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
    Warm Up | 2:48 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
    Deep Focus | 4:05 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3

**Code:**
```markdown
::: album-card id="demo-album" title="Demo Tape" artist="Showcase" year="2026" cover="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
    First Light | 3:12 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
    Warm Up | 2:48 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
    Deep Focus | 4:05 | https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3
```

---

### Track Card

A single-track inline player with cover art, title, artist, play/pause, seekable progress bar, and time display.

::: track-card id="demo-track-1" title="Golden Hour" artist="Showcase" cover="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

::: track-card id="demo-track-2" title="Night Drive" artist="Showcase" cover="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"

::: track-card id="demo-track-3" title="Morning Light" artist="Showcase" cover="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"

**Code:**
```markdown
::: track-card id="demo-track-1" title="Golden Hour" artist="Showcase" cover="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

::: track-card id="demo-track-2" title="Night Drive" artist="Showcase" cover="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
```

---

### Blog Post

Linked post previews that auto-group into a post list.

::: blog-post slug="css-in-2026" title="CSS in 2026 Is Kind of Amazing" date="Feb 5, 2026"
    @property, anchor positioning, and color-mix() that actually works — the platform has quietly become the tool I wanted five years ago.

::: blog-post slug="component-apis" title="The Component API I Keep Coming Back To" date="Mar 18, 2026"
    After years of building React component libraries, I've settled on a handful of patterns that make consumer code genuinely nicer to write.

::: blog-post slug="build-times" title="I Spent a Week Obsessing Over Build Times" date="Apr 3, 2026"
    Webpack to Vite, Vite to custom esbuild pipelines — here's what actually moved the needle.

**Code:**
```markdown
::: blog-post slug="css-in-2026" title="CSS in 2026 Is Kind of Amazing" date="Feb 5, 2026"
    @property, anchor positioning, and color-mix() that actually works — the platform has quietly become the tool I wanted five years ago.

::: blog-post slug="component-apis" title="The Component API I Keep Coming Back To" date="Mar 18, 2026"
    After years of building React component libraries, I've settled on a handful of patterns that make consumer code genuinely nicer to write.
```

---