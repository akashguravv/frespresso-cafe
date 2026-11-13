# Frespresso Cafe & Resto: design handoff

This is the design source for the Frespresso website: an entertainment cafe on Station Road, Solapur, open since 2017.
Live canvas: https://claude.ai/artifact/QeQWg8VCuHJyraDse3seom

## Folder map

| Path | What it is |
|---|---|
| `assets/frespresso.css` | **The design system as code.** Tokens are CSS custom properties, and every component is a `.fx-*` class. Port it or reuse it as is. |
| `assets/logo/` | Logo SVGs: `icon`, `horizontal` and `stacked`, each in `color` (for cream backgrounds), `reversed` (for espresso backgrounds) and `mono`. Also `favicon.svg`. |
| `content/site-content.json` | All business facts, the menu, ratings and navigation. Use it as the single source of truth for copy. |
| `boards/*.dc.html` | High-fidelity design boards (see below). |
| `boards/canvas.json` | The canvas layout index (design tool only). |

### Reading the boards
Each `.dc.html` file is HTML plus a small template layer:
- `{{value}}` is a data binding.
- `<sc-for>` is a loop and `<sc-if>` is a condition.
- `<dc-import name="X">` embeds `X.dc.html`, the way a child component would.
- `class Component extends DCLogic` holds the state and handlers. The Menu filter, Gallery lightbox and Contact validation logic in these files can be reused.
- `data-motion="…"` attributes mark the animation hooks.

The markup and class names are the spec. Ignore `support.js`, which belongs to the design tool.

| Board | Purpose |
|---|---|
| `Main` | Logo directions A, B and C. **A, "Leaf Steam", is the chosen one.** |
| `LogoSystem` | Lockups × colourways, favicon, avatar, clear space, OG image, loader |
| `Logo` | Logo component (props: `variant`, `tone`, `size`) |
| `DesignSystem` | Colour, type scale, spacing, radius, shadow, grid, buttons |
| `Components` | Header states, drawer, FAB, loader, form success, cards, chips, rating, stat, tile, lightbox, form fields, footer |
| `Motion` | Animation table: triggers, properties and timings |
| `Header`, `Footer` | Shared layout components used by every page |
| `Home`, `About`, `Menu`, `Experience`, `Gallery`, `Reviews`, `Contact` | Pages. The base file is the desktop design and is fluid. The `-Tablet` (768) and `-Mobile` (375) files only wrap the same page at that width. |

## Tokens (from `frespresso.css`)
- **Colour:**
  - espresso `#2B1B14`, cream `#FAF3E7` (and `#F3E8D6`, `#E9DCC6`), card `#FFFDF9`
  - caramel `#C8853B`, used for fills only. Caramel text uses `#8E5419`.
  - green `#3F7D58`, used for the logo and icons. Green text and bands use `#2F6145`.
  - charcoal text `#1E1E1E`, muted text `#5E5048`, lines `#E2D5C0`
  - error `#B3261E`
  - All text pairs meet 4.5:1 contrast or better.
- **Type:**
  - Headings: Fraunces 600, with italic `<em>` accents in caramel.
  - Body: Inter.
  - Sizes (desktop / tablet / mobile): Display 84/60/44, H1 60/46/38, H2 44/36/30, H3 24/24/21, Lead 20/18/17, Body 16.
- **Space:** 8-point scale. Section padding is 112 / 88 / 64.
- **Radius:** 10, 16, 24, 32 and pill.
- **Shadows:** `--sh-1` at rest, `--sh-2` on hover.
- **Layout:** content width 1200 on desktop. Margins are 32 on tablet and 16 on mobile. Use 3–4 columns on desktop, 2 on tablet and 1 on mobile.
- **Touch targets:** at least 44 px.
- **Breakpoints:** the CSS uses `@container page (max-width:1100px)` and `(max-width:640px)` on `.fx-page`, so the design frames can preview at their own width. **In production, use `@media` with the same values.**

## Pages and sections
1. **Home:**
   - Full-height hero with a subtle watermark of the logo mark, "View Menu" and "Get Directions"
   - Highlights strip: 4.1 on Google, since 2017, late-night takeaway
   - Signature items carousel
   - Experience teaser
   - Rating cards and review theme cards
   - Instagram band
   - Location snapshot
2. **About:** story since 2017, concept cards and a statistics row that counts up.
3. **Menu:**
   - Category chips that stick under the header
   - Search field, with an empty state when nothing matches
   - Row cards showing name, description and price
   - "Order on Swiggy" band
4. **Experience:** board games, guitar corner, books, and hangouts and celebrations, in alternating image and text sections, plus an enquiry call to action.
5. **Gallery:** filter chips, a masonry grid, and a lightbox with previous, next, close, Esc and swipe.
6. **Reviews:**
   - Google, Swiggy and Justdial ratings, with an editable "as of" date
   - Four theme cards, with no reviewer names or quotes
   - "Write a review" button
7. **Contact:**
   - Address, click-to-call phone and hours
   - Map placeholder, directions button and social links
   - Enquiry form (name, phone, message): checks run on submit, then error states, then a success state showing the logo

**Global elements:**
- The header shows the horizontal lockup. On mobile it shows the icon only.
- The header shrinks after 24 px of scroll.
- From 1100 px down, a hamburger opens the right-hand drawer.
- The footer shows the stacked reversed lockup.
- On mobile, a floating call button (`.fx-fab`) sits at the bottom right.
- A loading screen shows on the first visit only.

## Motion (summary; full table in `boards/Motion.dc.html`)
- **Scroll reveal:** sections 600 ms, cards 550 ms, staggered 80 ms apart. Easing `cubic-bezier(.2,.7,.2,1)`.
- **Hero:** text staggers in over 700 ms, and the background slowly zooms from 1.08 to 1.0 over 12 s.
- **Steam:** the logo wisp (`.fx-steam`) rises in a 2.4 s loop.
- **Header:** shrinks over 300 ms.
- **Statistics:** count up over 1.2 s.
- **Cards:** lift −6 px on hover, with the image zooming to 1.05.
- **Reduced motion:** honour `prefers-reduced-motion` by keeping fades only.

## Open items (do not invent them)
- Opening hours. Show the placeholder "Open daily, hours to be confirmed".
- Pizza and Pasta menu items.
- Confirmation of the menu descriptions, which are sample copy.
- Swiggy, Google Maps and Google review URLs.
- The "ratings as of" date.
- Real photography. Every image is a labelled placeholder, so use only the cafe's own photos.
- Outline the wordmark text in the logo SVGs, or load Fraunces and Inter, before shipping.

## Accessibility
- Use real `<a>`, `<button>`, `<input>` and `<label>` elements.
- Give icon-only buttons an `aria-label`.
- Mark decorative SVGs `aria-hidden`.
- Show a caramel focus ring.
- In the lightbox and drawer, trap focus and close on Esc.
