# WinnickIO Authored Redesign Specification

**Date:** July 18, 2026  
**Status:** Approved visual direction; pending written-spec review  
**Scope:** Replace the rejected bold implementation with the approved authored homepage and editorial résumé design.

## Objective

WinnickIO is Zak Winnick’s professional profile and broader personal website. It should explain who Zak is, show the arc of his career, identify what he is doing now, and connect visitors to his other work and writing.

The site must feel specifically authored by Zak rather than assembled from contemporary portfolio conventions. It must remain professional without becoming generic, overly corporate, or Rangeway-heavy.

## Design Correction

The rejected implementation failed because it used:

- Viewport-scale display headlines
- A portrait that overlapped and clipped the headline
- A wide orange rail with `ZW` lettering
- Repeated numbered sections
- Repeated eyebrow-plus-marketing-headline formulas
- Symmetrical card grids throughout
- Uniform spacing and visual weight for unrelated content
- Fixed-ratio feed-image crops and later dark letterboxing
- Generic transition copy that did not sound authored

The approved direction is a **Quiet Editorial Profile** with an authored, intentionally uneven lower page.

## Site Architecture

The site remains framework-free and GitHub Pages-compatible:

- `index.html` — homepage
- `resume.html` — complete résumé
- `styles.css` — shared visual system and responsive behavior
- `site.js` — safe feed rendering, navigation behavior if needed, and dynamic copyright year
- `feed.js` — JSON Feed loading and normalization
- `favicon.svg` — Signal Orange identity mark

Preserve `hawaii.html`, but do not link to it or include Hawaii content anywhere in the redesigned site.

## Shared Visual System

### Typography

- Use **DM Sans** for navigation, labels, headings, metadata, and body copy.
- Use **Instrument Serif** for the tagline, narrative introductions, and selected story-like passages.
- Remove Archivo Black from the primary hierarchy.
- Headings use moderate weight and restrained scale. No heading should behave like a poster or fill the viewport.

Recommended desktop scale:

- Homepage name heading: 64–72px maximum
- Section headings: 36–52px
- Serif tagline: 30–40px
- Narrative leads: 34–50px depending on available width
- Body copy: 16–20px

Mobile headings must remain restrained rather than expanding proportionally to the viewport.

### Color and Theme

Theme follows `prefers-color-scheme` automatically. There is no manual toggle.

Light mode:

- Background: `#f7f5ef`
- Foreground: `#1f211d`
- Muted text: `#62645c`
- Signal Orange: `#ef5b36`

Dark mode:

- Warm charcoal background: `#23231f`
- Slightly raised surface: `#292925`
- Soft cream foreground: `#f1ede4`
- Muted text: `#bcb8ae`
- Signal Orange: `#ff7048`

Use Signal Orange selectively for the edge accent, links, active navigation, small labels, and thin rules. Avoid large orange panels.

### Identity Accent

- Retain a thin 8–12px Signal Orange rail at the left edge.
- Remove visible `ZW` lettering from the rail.
- Align all content to a centered shared container rather than offsetting it around a wide rail.

### Links

- Important editorial links may use Signal Orange text with a thin dashed orange underline.
- External links open in a new tab and use `rel="noopener noreferrer"`.
- Focus states must remain clear and keyboard accessible.

## Shared Header

Use a compact header inside the main content container:

- `Zak Winnick` at left
- `Profile`, `Now`, `Résumé`, and `Elsewhere` at right
- Active-page state uses Signal Orange
- Navigation must not float over or detach from the content grid

On small screens, allow the navigation to wrap naturally. Do not introduce a menu button unless the links cannot remain readable and accessible.

## Homepage

### Hero

The approved hero is a clean, non-overlapping two-column composition.

Text column:

1. `Operator · Community builder · Technologist`
2. Main heading: `Zak Winnick`
3. Serif supporting line: `Technology. Hospitality. People.`
4. `I’ve spent my career making complex systems work better for the people who depend on them.`
5. Link to the Profile section

Portrait column:

- Use `images/profile-bw.jpg`.
- Portrait occupies approximately 40% of the hero.
- It is smaller and visually secondary to the text while remaining meaningful.
- Preserve a subtle offset orange outline.
- Never overlap, clip, blend, label, or number the portrait.

On mobile, render the text first and the portrait second at a natural proportion.

### Profile

Use a plain `Profile` heading followed by:

> I’m a systems-minded operator and community builder who has spent more than two decades working at the intersection of technology, hospitality, and the people who rely on both.

Supporting line:

> I’m drawn to complicated environments, practical solutions, and work that makes someone’s day run a little better.

Do not place a career-path banner or decorative strip under this section.

### Career

Use a straightforward `Career` heading and present the narrative as authored prose. Do not use a numbered section, card, or invented marketing headline.

Opening line:

> Most of my work has happened behind the scenes, in the systems nobody notices until they stop working.

Follow with the approved career narrative covering hospitality, logistics, SaaS, fintech, healthtech, IT operations, identity, security, compliance, property technology, infrastructure, and community leadership.

End with a link to `resume.html`.

Do not include the `Hospitality → Logistics → SaaS → Fintech → Healthtech → Infrastructure` banner.

### Right Now

This is the only homepage section where a side-by-side comparison is useful. Keep the roles open and lightly separated rather than enclosing them in product cards.

Section introduction:

> My current work sits in two different parts of the EV world: the places drivers stop, and the community they find along the way.

Rangeway:

- Context: `Building the places`
- Role: `Founder & Chief Executive Officer`
- Description: `I’m building a hospitality-driven premium EV charging network around reliability, comfort, and the real needs of long-distance drivers.`
- Link: `https://rangeway.co/`

NorCal EVs:

- Context: `Bringing together the people`
- Role: `Executive Director`
- Description: `I lead Northern California’s community for EV owners across every brand, creating events, education, and connections that make EV ownership more useful and welcoming.`
- Link: `https://norcalevs.org/`

Rangeway and NorCal EVs must retain equal visual weight.

### Elsewhere

Present Elsewhere as connected prose rather than cards or a numbered directory. Preserve this public order:

1. ZakWinnick.com
2. Current Heading
3. NorCal EVs
4. Bay Area Rivian Club

Approved copy:

> I write short posts, photos, and longer stories at ZakWinnick.com. Current Heading is my personal brand and home for independent projects. I serve as Executive Director of NorCal EVs, Northern California’s community for EV owners across every brand. I also serve on the board of the Bay Area Rivian Club, helping create drives, meetups, hands-on learning, and service projects for local Rivian owners.

Links:

- `https://zakwinnick.com`
- `https://currentheading.com`
- `https://norcalevs.org`
- `https://bayarearivianclub.com`

The wording and sequence must make NorCal EVs clearly more prominent than Bay Area Rivian Club.

### ZakWinnick.com Feed

Load the newest three items from:

`https://zakwinnick.com/feed.json`

Requirements:

- Include the newest three posts regardless of category.
- Use an asymmetric layout: one feature post and two smaller posts.
- Every post must display its image when the feed item contains one.
- Render images at their natural proportions.
- Do not use fixed-ratio `cover` crops.
- Do not add dark image backgrounds, letterboxing, or artificial padding.
- Apply sensible maximum heights without hiding any part of an image.
- Keep the existing safe DOM-rendering requirement: use `createElement`, `textContent`, URL validation, and no feed `innerHTML` assignment.
- Preserve the direct ZakWinnick.com fallback on feed failure or an empty feed.

The section heading is `From ZakWinnick.com`.

- `ZakWinnick.com` is Signal Orange with a thin dashed orange underline.
- It links to `https://zakwinnick.com/` in a new tab.
- `See everything I’ve posted` also links to the site in a new tab.

### Connect

Use the line:

> The internet is better when it leads to people.

Show four equal, compact icon links using Font Awesome:

- Email — `mailto:zak@winnick.io` — envelope icon
- LinkedIn — `https://www.linkedin.com/in/zakwinnick` — LinkedIn icon
- X — `https://x.com/ZakWinnick` — X icon
- Instagram — `https://instagram.com/zakwinnick` — Instagram icon

Icons require accessible names and decorative icon markup must be hidden from assistive technology.

### Homepage Footer

The footer contains only:

`© [dynamic year] Zak Winnick`

Do not repeat `Technology. Hospitality. People.` or add other footer content.

## Résumé Page

### Layout

Use the same header, theme, typography, edge accent, and dynamic copyright footer as the homepage.

The résumé is an editorial document:

- Restrained `Résumé` heading
- Short serif professional summary
- Narrow date/location metadata column
- Wide company, role, narrative, and accomplishment column
- Thin rules between roles
- No role cards
- Employer links use Signal Orange with a thin dashed underline

### Experience

Retain all eight approved entries and all previously approved employer links:

- Rangeway — `https://rangeway.co/`
- NorCal EVs — `https://norcalevs.org/`
- Curai Health — `https://curaihealth.com/`
- Octane — `https://octane.co/`
- CommentSold — `https://commentsold.com/`
- Sensei — `https://sensei.com/`
- Castlerock Asset Management — `https://www.castlerockam.com/`
- GEODIS — `https://geodis.com/`

The Castlerock narrative must name and link the two approved properties:

> Led IT across a hospitality portfolio that included The Westin Nashville and The Bobby Hotel (now The Nash), covering guest-facing systems, infrastructure, and corporate operations.

- The Westin Nashville — `https://westinnashville.com`
- The Bobby Hotel (now The Nash) — `https://www.opalcollection.com/nashville/`

### Education

- College of the Canyons — `https://canyons.edu`
- Broadcast Journalism

The institution link opens in a new tab and uses the approved dashed-link treatment.

### Skills

Use this exact alphabetical order:

1. Community & Nonprofit Leadership
2. Device Lifecycle Management
3. EV Charging Infrastructure
4. Event & Program Development
5. Identity & Access Management
6. IT Operations
7. Network & Property Technology
8. Operational Leadership
9. SaaS Administration
10. Security & Compliance
11. Site Development & Utility Coordination
12. Systems Integration
13. Vendor & Partner Management
14. Workflow Automation

### Certifications

Use this exact order:

1. Creating EV Charging Hubs: Innovative Design
2. FastTrack EV Charging Certification
3. Master Electric Vehicle Tech: Software Skills
4. Plug Into The Future — EV Charging Essentials
5. Fora Certified Travel Advisor

The first four items are alphabetical; Fora remains intentionally last.

### Publications

All titles are linked, open in new tabs, and use the approved dashed-link treatment:

1. The Westin Nashville Depends on Voxer for Reliable Communication  
   `https://www.voxer.com/assets/images/Westin-Case-Study.pdf`
2. Rivian Clubs of America Podcast  
   `https://podcast.rivianclubs.org`
3. Trail Marker Podcast from Rangeway  
   `https://podcast.rangeway.co`

### Résumé Footer

The footer contains only:

`© [dynamic year] Zak Winnick`

## Responsive Behavior

- Desktop hero uses separate text and portrait columns.
- Mobile hero stacks text above portrait.
- Role comparisons, feed layout, career entries, and supporting résumé sections collapse to a single readable column.
- Preserve full feed images at every breakpoint.
- Maintain a minimum 44px interactive target where practical.
- Avoid horizontal overflow at all supported widths.

## Accessibility and Motion

- One `h1` per page
- Semantic landmarks and heading order
- Skip link on both pages
- Descriptive portrait alt text
- Visible `:focus-visible` treatment
- Accessible social-link names
- Decorative icons use `aria-hidden="true"`
- `prefers-reduced-motion` disables nonessential motion
- Text and interactive elements meet WCAG AA contrast
- Site content remains available when JavaScript is disabled; only the feed and dynamic year may degrade

## Verification

Implementation verification must include:

- Automated contracts for exact homepage order, wording, link targets, résumé entries, skills, certifications, and publications
- Feed normalization and failure tests
- Safe feed-rendering assertions
- Light and dark system-theme checks
- Desktop and mobile layout checks
- Full-image feed rendering without crop or letterbox
- Dynamic year verification
- Navigation, employer, property, education, publication, Elsewhere, post, and social-link checks

## Publishing Boundary

Complete and verify the redesign locally. Do not deploy or publish until Zak explicitly approves the implemented result.
