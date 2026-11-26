# Julius Alfeche | Portfolio

Official portfolio and interactive resume of **Julius Alfeche**, a Data and Operations Analyst based in Cebu City, Philippines.

👉 **Live site:** https://juliusalfeche.com

![Julius Alfeche | Data & Operations Analyst](assets/img/og-cover.png)

## What's on the site

- **Profile, Expertise, Projects, Endorsements, Capabilities, Experience, Education** as simple sections that open one at a time.
- **Projects** shown as a grid of cards. The whole card is a link.
- **Endorsements** in a swipeable carousel: swipe, drag with the mouse, use the arrow keys, the buttons, or tap a photo. Nothing moves by itself.
- **Light and dark theme.** Dark (the same palette as the DLBB forum and QuakesPH) is the default; the choice is remembered on the device.
- **Download Resume** (PDF), and a print layout that opens every section automatically.
- Works with the keyboard and screen readers, and respects the "reduce motion" setting.

## Security and privacy

- **No third-party requests at all.** No CDN, no web fonts, no analytics, no cookies, no trackers. Icons are inline SVG and fonts are the device's own.
- A strict **Content Security Policy** (`default-src 'none'`, scripts and styles only from this site, no inline scripts).
- All outside links use `rel="noopener noreferrer"`.
- Images are optimized (the portrait went from 1.8 MB to 28 KB).

## Project structure

```
resume/
├── index.html           the whole page
├── 404.html             friendly "page not found"
├── resume.pdf           the downloadable resume
├── CNAME                custom domain
├── robots.txt, sitemap.xml
└── assets/
    ├── css/style.css    all styling, palette at the top
    ├── js/
    │   ├── theme.js         sets the theme before the page paints
    │   ├── main.js          starts everything
    │   ├── sections.js      one-at-a-time sections, menu links, printing
    │   ├── carousel.js      the endorsements carousel
    │   ├── effects.js       count-up numbers, reveal on scroll, active menu link
    │   └── theme-toggle.js  the light/dark button
    ├── img/             portrait, logos, client photos, project cards, social cover
    └── icons/           favicon and app icons
```

## Updating the content

- **Text, projects, endorsements, jobs:** edit `index.html`. Each section is a clearly marked block.
- **Years of experience / industries:** change the `data-count` numbers in the "Highlights" list near the top. The project and endorsement counts update by themselves.
- **Colors:** change the variables at the top of `assets/css/style.css`.
- The footer year updates itself.

## Credits

Built by Julius Alfeche with plain HTML, CSS and JavaScript. No frameworks, no build step.
