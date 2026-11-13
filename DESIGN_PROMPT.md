# Claude Design Prompt: Frespresso Cafe & Resto

Copy everything below this line into Claude Design.

---

Design a complete website for **Frespresso Cafe & Resto**, an entertainment cafe in Solapur, Maharashtra, India, open since 2017. Deliver a brand logo, a small design system, and high-fidelity page designs for desktop, tablet, and mobile. I will develop the site from these designs, so keep components consistent and reusable.

## About the cafe

- A cozy, youthful hangout serving Italian coffees, pizzas, burgers, sandwiches, pastas, waffles, sundaes, and shakes (Indo-Western menu, Rs. 200 to 400 per person).
- More than a cafe: guests play in-house board games, play the guitar, read books, and celebrate small occasions.
- Known for good ambiance and seating, strong coffee options, and late-night takeaway.
- Address: Ground Floor, Orchid Complex, 70, Station Rd, opp. Mayor's Bungalow, Railway Lines, Solapur, Maharashtra 413001.
- Phone: +91 788 732 3311. Instagram: @frespressosolapur. Online ordering through Swiggy.
- Ratings: Google 4.1 (about 1,300 reviews), Swiggy 4.2, Justdial 4.0.
- Opening hours are not confirmed yet; show them as an editable text field ("Open daily, hours to be confirmed").

## Step 1: Logo (design this first)

No official logo file is available, so create an original one. Do not imitate any existing coffee brand.

- **Concept:** the name blends "fresh" and "espresso". Combine a simple coffee cup or coffee bean with a fresh element such as a leaf or rising steam. Friendly, modern, slightly playful.
- **Wordmark:** "Frespresso" as the main word, with "Cafe & Resto" as a smaller secondary line. Spell it exactly "Frespresso".
- **Deliver these variants:**
  1. Horizontal lockup (icon plus wordmark) for the header.
  2. Stacked lockup (icon above wordmark) for the footer and hero.
  3. Icon-only mark for the favicon, mobile header, and social avatar.
  4. Each in three colourways: full colour on cream, reversed on espresso brown, and single colour.
- The mark must stay legible at 32 px and work as a simple flat vector (no gradients, no fine detail).
- Present two or three distinct logo directions first, then apply the strongest one across every page.

## Step 2: Design system

- **Colours:** espresso brown `#2B1B14`, cream `#FAF3E7`, caramel accent `#C8853B`, fresh green `#3F7D58`, charcoal text `#1E1E1E`. Adjust shades if needed, but keep body text contrast at 4.5:1 or higher.
- **Typography:** a characterful serif for headings (Fraunces or Playfair Display) with a clean sans-serif for body text (Inter or Poppins).
- **Style:** warm and inviting, generous white space, large rounded image cards, soft shadows, one idea per section. A coffee house with personality, not a corporate chain.
- **Components:** header (default and scrolled states), mobile navigation drawer, footer, primary and secondary buttons, menu item card, category chips, review card, statistic counter, gallery tile, lightbox, form fields with error and success states, floating mobile call button.

## Step 3: Pages (seven)

1. **Home:** full-height hero with headline, tagline, and "View Menu" and "Get Directions" buttons; highlights strip (rating, since 2017, late-night takeaway); signature items carousel; experience teaser; review highlights; Instagram call-out; location snapshot.
2. **About:** the story since 2017, the entertainment cafe concept, a statistics row.
3. **Menu:** sticky category chips (Coffee, Shakes and Coolers, Bites, Sandwiches and Burgers, Pizza and Pasta, Waffles, Sundaes and Desserts), search field, item cards with name, short description, and price, "Order on Swiggy" button.
4. **Experience:** board games, guitar corner, books, hangouts and celebrations as alternating image and text sections.
5. **Gallery:** filterable photo grid with a lightbox view.
6. **Reviews:** rating summary from Google, Swiggy, and Justdial, review theme cards without individual names, "Write a review" button.
7. **Contact:** address, click-to-call phone, hours, map, directions button, social links, enquiry form (name, phone, message).

Sample menu items for realistic content: Cafe Mocha 180, Cafe Latte 170, Frappe Frespresso 160, Blue Valley Mojito 160, Peri Peri Fries 170, Cheese Garlic Bread 170, Tandoori Paneer Grilled Sandwich 160, Aloo Tikki Burger 120, Naughty Nutella Waffle 240, Triple Chocolate Waffle 250, Butterscotch Dynasty Sundae 200, Brownie Sunrise Sundae 220 (prices in INR).

## Where the logo must appear

- Header on every page: horizontal lockup, linking to Home; icon-only on narrow mobile widths.
- Footer on every page: stacked lockup on the espresso brown background.
- Mobile navigation drawer, top.
- Home hero: a subtle large mark or watermark, not competing with the headline.
- Favicon and social sharing image.
- Page loading screen and the enquiry form success state.

## Responsive frames

Design every page at three widths: mobile 375 px, tablet 768 px, desktop 1440 px (content width 1200 px). Mobile is single column with a hamburger drawer and 44 px minimum touch targets; tablet uses two-column grids; desktop uses three to four columns.

## Motion notes

Annotate intended animations so I can build them: scroll-reveal on sections and cards, gentle hero text entrance with slow background zoom, rising steam on the logo or hero, header shrink on scroll, count-up statistics, card hover lift and image zoom. Keep motion subtle.

## Rules

- Use neutral image placeholders with labels (for example "Interior photo", "Cafe Mocha"); do not use photos from Google, Swiggy, or social media.
- Do not invent reviewer names, awards, or facts beyond those given above.
- Keep copy short, warm, and conversational, in English.
