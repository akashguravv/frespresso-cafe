# Website Development Prompt: Frespresso Cafe & Resto

## 1. Role and goal

Act as a senior front-end developer and UI designer. Design and build a complete, production-ready, multi-page marketing website for **Frespresso Cafe & Resto**, an entertainment cafe in Solapur, Maharashtra. The site must be clean, smoothly scrollable, visually attractive, lightly animated, and fully responsive on mobile, tablet, and desktop.

The primary business goals of the site are, in order:

1. Make a visitor want to come in (ambiance, food, and experience).
2. Let a visitor see the menu and prices quickly.
3. Make it effortless to call, get directions, or order online.

## 2. Business facts (use exactly; do not invent others)

| Item | Value |
|---|---|
| Name | Frespresso Cafe & Resto (also written "Cafe Frespresso") |
| Type | Entertainment cafe, Indo-Western menu |
| Established | 2017 |
| Address | Ground Floor, Orchid Complex, 70, Station Rd, opp. Mayor's Bungalow, Railway Lines, Solapur, Maharashtra 413001 |
| Phone | +91 788 732 3311 |
| Price per person | Rs. 200 to 400 |
| Hours | **To be confirmed by owner.** Sources disagree: Google lists opening at 10 am; the cafe's social pages state 11:00 am to 11:00 pm; takeaway is reported as available until 3:00 am. Keep hours in one config location so they are easy to correct. |
| Ratings | Google 4.1 (about 1,300 reviews), Swiggy 4.2, Justdial 4.0 |
| Social | Instagram: @frespressosolapur; Facebook: Frespresso Solapur |
| Online ordering | Available on Swiggy (link out) |

**Positioning statement (from the cafe's own description):** an entertainment cafe serving Italian coffees, pizzas, burgers, sandwiches, pastas, waffles, and a wide range of beverages, where guests can play in-house board games, play the guitar, read books, and explore their talent.

**What guests praise:** delicious food (paneer makhani, grilled sandwiches, sundaes), wide Indo-Western variety, good interior and seating, best coffee options, late-night takeaway.

### Menu data (seed content)

Prices in INR. Items without a price must render as "Ask in cafe" rather than a made-up figure.

- **Coffee:** Cafe Mocha (250 ml, serves 2) 180; Cafe Latte (250 ml, serves 2) 170; Frappe Frespresso 160; Vanilla Cappuccino; Hazelnut Coffee
- **Shakes and coolers:** Blue Valley Mojito 160; Oreo Choco Freak; Butterscotch Freak Shake
- **Bites:** Peri Peri Fries 170; Cheese Garlic Bread 170; Chilly Garlic Pops 150; Cheese Toast
- **Sandwiches and burgers:** Tandoori Paneer Grilled Sandwich 160; Aloo Tikki Burger 120
- **Pizza and pasta:** Mexican Pizza; White Sauce Pasta
- **Waffles:** Naughty Nutella Waffle 240 onwards; Triple Chocolate Waffle 250
- **Sundaes and desserts:** Butterscotch Dynasty Sundae 200; Brownie Sunrise Sundae 220; Mango Majestic Sundae (summer exclusive) 150; Sizzling Brownie with Oreo KitKat
- **Also served:** rice bowls, paneer makhani (prices to be supplied)

Store all menu data in a single `data/menu.json` file so the owner can update it without touching markup.

## 3. Pages (7 maximum)

1. **Home** - full-height hero with headline, short tagline, and two calls to action ("View Menu", "Get Directions"); highlights strip (rating, since 2017, late-night takeaway); signature items carousel; "more than a cafe" experience teaser; review excerpts; Instagram call-out; location snapshot.
2. **About** - the story since 2017, the entertainment cafe concept, what makes the space different, a short stats row (years open, review count, rating).
3. **Menu** - category tabs or sticky category chips, item cards with name, short description, and price; a live text search/filter; "Order on Swiggy" button.
4. **Experience** - board games, guitar corner, books, hangouts, and small celebrations; each as an alternating image and text section.
5. **Gallery** - responsive masonry or grid of interior, food, and drink photos with a keyboard-accessible lightbox and category filter.
6. **Reviews** - aggregate ratings from Google, Swiggy, and Justdial; short paraphrased review themes; a link to write a Google review. Do not invent reviewer names or attribute quotes to individuals.
7. **Contact** - address, click-to-call phone, hours, embedded Google Map, directions button, social links, and a simple enquiry form (name, phone, message) with client-side validation. The form must not submit to any backend yet; show a success state and leave a clearly marked hook for integration.

Shared across all pages: sticky header with logo and navigation (hamburger drawer on mobile), footer with address, hours, phone, social links, and quick links, plus a floating "Call" button on mobile.

## 4. Visual design direction

- **Mood:** warm, cozy, youthful, and energetic. A coffee house with personality, not a corporate chain.
- **Palette:** espresso brown `#2B1B14`, cream `#FAF3E7`, caramel accent `#C8853B`, a fresh green secondary `#3F7D58` (a nod to the "fresh" in the name), and charcoal text `#1E1E1E`. Define all colours as CSS custom properties.
- **Typography:** a characterful display serif for headings (for example Playfair Display or Fraunces) paired with a clean sans-serif for body text (for example Inter or Poppins), loaded from Google Fonts with `display=swap`.
- **Layout:** generous white space, a 12-column grid on desktop, large rounded image cards, soft shadows, and clear section rhythm. One idea per section.
- **Imagery:** use clearly named placeholder images in `assets/images/` (for example `hero.jpg`, `menu-cafe-mocha.jpg`) with correct aspect ratios, so real photographs can be dropped in later. Do not hotlink images from Google, Justdial, Swiggy, or social media.
- **Logo:** no official logo file is available, so use the original logo produced in the design phase (see `DESIGN_PROMPT.md`); if none is supplied, create an original flat SVG logo combining a coffee cup or bean with a fresh leaf or steam element and the wordmark "Frespresso" with "Cafe & Resto" beneath. Store it in `assets/icons/` as `logo-horizontal.svg`, `logo-stacked.svg`, and `logo-icon.svg`, each with light and dark colourways.
- **Logo placement:** horizontal lockup in the header of every page, linked to Home (icon-only below 400 px width); stacked lockup in the footer; top of the mobile navigation drawer; a subtle mark in the Home hero; favicon and Open Graph sharing image; page loading screen. Every logo instance needs an accessible name ("Frespresso Cafe & Resto, home").

## 5. Animation and interaction

Animations must feel smooth and purposeful, never distracting.

- Scroll-reveal for sections and cards (fade and slide up, staggered) using `IntersectionObserver`.
- Hero: gentle text entrance and a subtle parallax or slow zoom on the background image; an animated steam or floating coffee-bean accent in SVG or CSS.
- Header shrinks and gains a background on scroll; active navigation link is highlighted.
- Count-up animation on statistics (rating, reviews, years).
- Hover states on cards and buttons (lift, image zoom, underline sweep).
- Smooth scrolling for in-page anchors and a back-to-top button.
- Soft page transition on load.
- Animate only `transform` and `opacity`, target 60 fps, and fully honour `prefers-reduced-motion: reduce`.

## 6. Responsive requirements

Build mobile-first with these breakpoints:

| View | Width | Key behaviour |
|---|---|---|
| Mobile | up to 767 px | Single column, hamburger drawer, floating call button, minimum 44 px touch targets |
| Tablet | 768 to 1023 px | Two-column grids, condensed navigation |
| Desktop | 1024 px and above | Full navigation, three to four column grids, maximum content width 1200 px |

Use fluid typography with `clamp()`, responsive images with `srcset` and `loading="lazy"`, and no horizontal scrolling at any width from 320 px upward.

## 7. Technical requirements

- **Stack:** semantic HTML5, modern CSS (custom properties, Grid, Flexbox), and vanilla JavaScript (ES2020 modules). No framework and no build step, so the site can be hosted on any static host. No jQuery.
- **Structure:**

```text
Fresspresso_cafe/
  index.html
  about.html
  menu.html
  experience.html
  gallery.html
  reviews.html
  contact.html
  css/        (base.css, components.css, pages.css)
  js/         (main.js, menu.js, gallery.js, contact.js)
  data/       (menu.json, site.json)
  assets/     (images/, icons/, fonts/)
```

- **Shared content:** keep name, address, phone, hours, and social links in `data/site.json` and render the header and footer from one shared script so they stay consistent on every page.
- **Accessibility (WCAG 2.1 AA):** semantic landmarks, one `h1` per page, alt text on all images, visible focus styles, full keyboard operation for navigation, tabs, and lightbox, ARIA only where needed, and a colour contrast ratio of at least 4.5:1 for body text.
- **SEO:** unique title and meta description per page, Open Graph tags, a `Restaurant` JSON-LD schema block with address, phone, price range, and hours, plus `sitemap.xml` and `robots.txt`.
- **Performance:** Lighthouse scores of 90 or above for Performance, Accessibility, Best Practices, and SEO on mobile; compressed images; deferred scripts; no layout shift from images or fonts.
- **Security:** no inline event handlers, no API keys or secrets in the code, external links use `rel="noopener noreferrer"`, form input is validated and never injected into the page as HTML.
- **Code quality:** consistent naming (BEM for CSS classes), no dead code, and a short `README.md` explaining how to run the site and how to update the menu, hours, and images.

## 8. Content rules

- Write short, warm, conversational copy in English. Keep paragraphs under three lines.
- Use only the facts in Section 2. Where information is missing (hours, logo, photos, some prices, email address), insert a clearly marked `TODO` in the data file rather than inventing details.
- Do not copy review text or descriptions verbatim from third-party sites; paraphrase themes.

## 9. Deliverables and acceptance criteria

1. All seven pages built, linked, and working when served from a simple local static server.
2. No console errors; all navigation, menu filtering, gallery lightbox, and form validation function correctly.
3. Verified at 375 px, 768 px, and 1440 px widths with no overflow or broken layouts.
4. Animations run smoothly and are disabled under reduced-motion settings.
5. A final list of every `TODO` that requires input from the cafe owner.
