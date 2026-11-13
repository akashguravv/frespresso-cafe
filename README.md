# Frespresso Cafe & Resto website

Static, responsive seven-page website generated from the design handoff in `design/`. No framework and no runtime dependencies; Node 18+ is needed only to regenerate the pages and to run the local preview.

## Run locally

```bash
node tools/serve.js
```

Then open http://localhost:5173.

## Rebuild after changing content

```bash
node tools/build.js
```

The seven `.html` files and `css/frespresso.css` are generated. Do not edit them by hand; change the sources below and rebuild.

| To change | Edit |
|---|---|
| Business facts, hours, links, menu, ratings | `data/site.json` |
| Testimonials (Home and Reviews pages) | `data/testimonials.json` |
| Gallery photos and videos | `data/gallery.json` and files in `assets/gallery/` |
| Other page photos (hero, menu items, experience) | Files in `assets/images/`, named as listed in `assets/images/EXPECTED-FILES.txt` |
| Page layout and copy | `design/boards/*.dc.html` and `tools/build.js` |
| Additional styles and motion | `css/site.css` |
| Interactions | `js/main.js` |

## Adding testimonials

Open `data/testimonials.json`. For each of the six items, paste the review text exactly as the guest wrote it, set `rating` (1 to 5) and `date` (for example "October 2026"). Leave `name` empty to show "Google reviewer", or add the guest's name only with their consent. Items with empty text appear as a dashed placeholder card.

## Adding gallery photos and videos

1. Copy the cafe's own files into `assets/gallery/` (photos as `.jpg`, `.png` or `.webp`; videos as `.mp4`, ideally under 10 MB and under 30 seconds).
2. In `data/gallery.json`, set each item's `file` to the file name. For a video, `poster` is an optional thumbnail image.
3. Add more items by copying an existing entry. `cat` must match a filter id; videos appear under the Videos filter automatically.
4. Rebuild.

Use only photographs and videos the cafe owns or has permission to publish.

## Open items for the cafe owner

- Opening hours (`business.hours`).
- Swiggy listing URL and Google "write a review" URL (`business.swiggy_url`, `business.google_review_url`).
- Six testimonial texts.
- Photographs and short videos.
- Prices and descriptions for Mexican Pizza and White Sauce Pasta.
- Confirmation of the sample menu descriptions.
- Enquiry form endpoint: the form validates and shows a success state but does not send data anywhere yet (see `INTEGRATION HOOK` in `js/main.js`).
