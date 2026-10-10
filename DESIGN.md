# DESIGN.md — heiznerd.is-a.dev

A single-page portfolio (Vue 3 + Vite + Tailwind 3 + GSAP 3.15) built in the visual language of gsap.com: a dark canvas, oversized grotesk headlines, pill controls, playful geometric shapes and scroll-driven storytelling. The palette is pink, violet, soft orange and rose with small touches of mint and sky.

Bilingual (VI default, EN) via `src/translations.js`. All copy lives there; components read it through the injected `lang` / `translations`.

---

## 1. Principles

1. **Motion explains structure.** Every section has one signature move (pin, morph, marquee, split text) instead of generic fade-ins.
2. **Nothing hides behind an animation.** Content is always reachable: reduced-motion shows the final state, mobile degrades pins to carousels, and fast scrolling is handled by gates and catch-up (see §6).
3. **Transform and opacity only.** Layout properties are animated only where the element count is tiny.
4. **Original shapes, borrowed grammar.** The style follows gsap.com, but all shapes are drawn in-house (`ui/shapes.js`). No GreenSock logos, art or copy.

---

## 2. Colour

Defined as CSS variables in `src/style.css` (`:root`). Hard-coded hex values in components must come from this table.

| Role | Token | Value |
|---|---|---|
| Canvas | `--c-bg` | `#0f0b13` |
| Surface 2 / 3 | `--c-bg-2` / `--c-bg-3` | `#1a1420` / `#251c2d` |
| Text | `--c-cream` | `#fff1ea` |
| Text muted (75 / 50 / 25) | `--c-cream-75/50/25` | `#c9b8bf` / `#86747f` / `#483b47` |
| Lines | `--c-line` / `--c-line-soft` | cream at 16% / 8% |
| **Primary accent** | `--c-accent` | `#ff5c93` (pink-rose) |
| Rose | `--c-rose` / `--c-magenta` | `#e0306f` / `#ff3d8b` |
| Soft orange / peach | `--c-orange` / `--c-peach` | `#ff9a5c` / `#ffb27a` |
| Pink | `--c-pink` | `#ffc2e2` |
| Violet / lilac | `--c-violet` / `--c-lilac` | `#8a5cff` / `#a78bff` |
| Mint (status, success) | `--c-mint` | `#7be3b8` |
| Sky | `--c-blue` / `--c-sky` | `#6ad0ff` / `#cdeeff` |

Gradients: `--g-accent` (pink → violet → peach, used for primary CTAs, progress and gradient text), plus `--g-orange`, `--g-pink`, `--g-lilac`, `--g-blue`, `--g-summer`.

Usage rules
- Dark text (`--c-bg`) on every pastel/accent fill; cream text on the canvas.
- Mint is reserved for "alive/ok" signals (availability dot, clock dot, live badge, copy success). Sky is decorative.
- `html` carries the canvas colour and `body` is transparent so the fixed aurora layer (`z-index: -1`) can sit between them.
- Project cards use one accent each: Danshi pink, NekoAI violet, NekoComics-V2 orange, NekoStream sky.

---

## 3. Typography

- **Sans:** Be Vietnam Pro 300–700 (full Vietnamese coverage), loaded from Google Fonts with `display=swap`.
- **Mono:** JetBrains Mono, used for eyebrows, indices, captions and the cursor-adjacent UI.
- Headlines are weight 500–600 with tight tracking (`-0.035em` to `-0.07em`) and line-height 0.84–1.05.
- Scale (`:root`): hero `clamp(5.4rem, 21.5vw, 21rem)`, section title `clamp(2.6rem, 6.2vw, 6.25rem)`, statement `clamp(1.85rem, 4.15vw, 4.35rem)`, lead `clamp(1.15rem, 1.6vw, 1.5rem)`, body `1.0625rem`, micro `0.75rem`.
- Display serif (Palatino/Georgia stack) appears only in the Rom-com "paper" stage (title card and KISS/LOVE letters).
- Do not mask-clip headlines with Vietnamese diacritics; use opacity/transform reveals (see `revealTitle`).

---

## 4. Layout, shape and spacing

- Container: `max-width 1440px`, gutter `clamp(20px, 6.6vw, 96px)`, section padding `clamp(96px, 14vw, 200px)`.
- Radii: 10 / 16 / 24 / 36 px, and full pill (`999px`). Cards are 24–36 px, buttons are pills.
- Fixed header 76 px (64 px under 900 px) that hides on scroll-down and returns on scroll-up or focus.
- Breakpoint: **900 px**. Above it, pins and horizontal scrub run; below it, pins degrade to stacks and snap carousels.
- `main` uses `overflow-x: clip` (not `hidden`) so decorative shapes can bleed off the edge without breaking pinning.

Section order (`HomeView.vue`): Hero → About → Rom-com corner → Tech marquee → Skills → Motto → Timeline → Projects → Thanks banner → Contact → Footer.

---

## 5. Component map

| Area | File | Signature motion |
|---|---|---|
| Intro | `IntroScreen.vue` | Letter rise, counter and progress bar, curtain wipe up |
| Header | `Navbar.vue` | Hide/show on scroll direction, language toggle, calendar popover, circular-reveal mobile menu |
| Command palette | `CommandPalette.vue` | Ctrl/Cmd+K, focus-trapped combobox, jumps through ScrollSmoother |
| Hero | `Hero.vue` | Split wordmark with a bouncing "i" dot, shapes with pointer parallax, scramble-text role rotator |
| About | `About.vue` | Scroll-scrubbed word-by-word statement, stat cards with count-up, interest chips link to Rom-com |
| Rom-com corner | `Quintet.vue` | **Pinned scrub opening** (paper title, brush strokes, five wedding portraits, KISS→LOVE), hover/Tab picker, polaroid "Moments", falling petals |
| Tech marquee | `TechMarquee.vue` | Two lanes, scroll-velocity speed, direction flip and skew |
| Skills | `Skills.vue` | Sticker-style role labels, built-up shape composition, shapes **morph** (circle → category shape) while scrolling |
| Motto | `Motto.vue` | Pinned horizontal scroll with per-letter bounce and velocity lean |
| Timeline | `Timeline.vue` | Pinned horizontal scrub on desktop, scroll-snap rail on mobile, prev/next and arrow keys |
| Projects | `Projects.vue` + `ProjectArt.vue` | Stacking pinned cards, each with its own looping micro-animation (osu! hits, chat bubbles, comic panels, terminal) |
| Install chip | `ui/CopyCommand.vue` | Clipboard copy with `aria-live` feedback |
| Contact | `Contact.vue` | Split-text headline, sticker cards, row fills on hover, live GitHub activity |
| Footer | `Footer.vue` | Giant wordmark rising with scrub |
| Ambient | `AmbientBackground.vue` | Fixed aurora of pink/violet/orange/rose/sky blobs: drift, scroll travel, pointer lean |
| Side rails | `SideRails.vue` | Left vertical ticker and right progress rail with section index and a star that spins with scroll speed (≥ 1240 px, fine pointers) |
| Margin shapes | `ui/MarginShapes.vue` | Edge shapes with real parallax via ScrollSmoother `data-speed`, plus spin/float loops |
| Cursor | `CustomCursor.vue` | Following ring with state labels, confetti burst on every click (fine pointers only) |
| Progress | `ScrollProgress.vue` | Top bar; turns orange while a gate is holding the page |

Shared pieces: `ui/Shape.vue` + `ui/shapes.js` (19 original SVG paths and the palette table), `ui/BraceLabel.vue` (`{ label }` motif from gsap.com), `directives/magnetic.js` (`v-magnetic`).

---

## 6. Motion system

**Stack.** `gsap@3.15.0` (pinned) with ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, MorphSVG, ScrambleText and CustomEase, all registered once in `src/lib/gsap.js`.

**Structure**
- `index.html` provides `#smooth-wrapper > #smooth-content > #app`. Anything `position: fixed` (header, cursor, rails, aurora, intro) is teleported to `<body>` from `App.vue`.
- `ScrollSmoother.create({ smooth: 0.6, effects: true, smoothTouch: false })` runs before the app mounts so every ScrollTrigger is created after it.
- Components use `useGsap(rootRef, setup)` (`composables/useGsap.js`): `gsap.context` scoped to the component and a `gsap.matchMedia`. Everything reverts on unmount, so route changes never leak triggers.
- `MEDIA` presets: `motion`, `reduce`, `desktop` (≥ 900 px and motion allowed), `mobile`, `fine` (hover + fine pointer).

**Tokens**
- Eases: `hz.out` (default, expo-like), `hz.inOut`.
- Default duration 0.7 s. Scrub values are 0.2–0.3 so the page feels attached to the scroll.
- Reveals trigger early (`top 92%`–`99%`) with `once: true`.

**Handling fast scrolling**
- **Pins are the real stoppers.** Rom-com, Motto, Timeline and Projects scrub against scroll position, so they cannot be outrun.
- **Section gates** (`composables/useGate.js`, `lib/gsap.js`): on About, Skills, Projects and Contact, arriving faster than 1500 px/s makes the page glide to the heading and hold for 0.7 s. Desktop and fine pointers only. The scroll bar flashes orange as the cue. A timer always releases the lock.
- **Catch-up:** when scrolling stops, any entrance tween still playing speeds up to 2.6×.
- Scroll locks are keyed (`intro`, `ui`, `gate`) so one owner can never release another's lock.

**Reduced motion / touch.** No smoother, pins, cursor, aurora motion or rails. Final states render statically; the Rom-com stage hides the title card, KISS/LOVE and strokes and shows the finished collage. Touch devices use native scroll and carousels.

**Performance notes.** Animations touch transform/opacity (plus `flex-grow`-free hovers). Off-screen loops (petals, project art) pause via ScrollTrigger toggles. Images are lazy-loaded with intrinsic sizes. Heavy WebGL was removed entirely.

---

## 7. Content and assets

- Projects shown: Danshi (Full-Core Dev), NekoAI (Designer, Frontend), NekoComics-V2 (Designer, Backend, Audit, Core Dev; "Reborn from NekoComics"), NekoStream CLI, plus the NekoTech LLC work role.
- Removed on request: the Làng Băng VN role and the "active" badge. Birth date, birth milestone and age in the About copy were removed for privacy.
- GitHub handle is `heiznerd`; the activity feed reads `/users/heiznerd/events/public`.
- `public/quintet/`: `wedding-*` (picker portraits), `moment-*` (polaroids), `sticker-*` (contact stickers). These are fan-supplied artwork; the credit line in the Rom-com section states that rights remain with the original artists, Negi Haruba and Kodansha. Replace or remove them if a rights holder asks.
- `7654678563731311894.dcf4908b3299.mp4` is a reference clip for the Rom-com opening and is not part of the shipped site.

---

## 8. Accessibility

- Skip link, landmarks, one `h1`, labelled sections.
- Visible focus rings everywhere (`:focus-visible`), keyboard-operable picker, timeline, palette and menu.
- Decorative layers are `aria-hidden`; the custom cursor never replaces the native one and is off for touch and reduced motion.
- Copy button announces success via a polite live region.
- Contrast: cream on canvas; dark text on pastel fills. Mono micro text is kept at ≥ 0.7 rem.

---

## 9. Extending the design

1. New colour? Add a token in `:root` first, then use the variable.
2. New shape? Add one single-path entry to `SHAPES` in `ui/shapes.js` so MorphSVG/DrawSVG keep working.
3. New section? Create the component with `useGsap`, give it one signature move, and add `MarginShapes` if its edges look empty.
4. If a reveal can be missed by fast scrolling, tie it to scrub or a pin instead of a timed `once` trigger.
5. Add both language strings to `translations.js` for every new piece of copy.
6. Verify at 1440 / 390 px, in VI and EN, and with `prefers-reduced-motion`.

Verification checklist: `npm run build` passes, console is clean, `document.documentElement.scrollWidth <= innerWidth`, no content hidden in the reduced-motion render.
