# WinnickIO Website Redesign

Date: July 17, 2026

Status: Approved design

## Purpose

Rebuild `winnick.io` as a combination professional profile and broader personal site. The site must help visitors understand three things quickly:

1. Who Zak Winnick is.
2. The narrative arc of his career.
3. What he is doing now.

The site serves potential collaborators, partners, investors, professional peers, prospective employers or clients, community contacts, and people who know Zak socially. No single audience should dominate the experience.

The result must feel like Zak rather than a generic executive profile or a founder marketing page. Personality should come through naturally in the writing, visual choices, linked projects, and live posts from `zakwinnick.com`.

## Explicit Content Boundaries

- The homepage must not be dominated by Rangeway.
- Rangeway and NorCal EVs are the two subjects of the current-work section and receive equal visual weight.
- Current Heading is Zak's personal brand. It belongs in the Elsewhere section, not the current-work section.
- Personal interests should emerge naturally through the live feed and linked projects. Do not create a labeled hobbies or interests section.
- Do not include the Hawaii itinerary or other unrelated travel artifacts.
- Do not force every personal or professional detail to support a Rangeway narrative.
- Do not invent career facts, accomplishments, dates, roles, or project descriptions.

## Information Architecture

The site consists of one scrolling homepage and one separate resume page.

### Main navigation

- Profile - homepage anchor
- Now - homepage anchor
- Resume - separate page
- Elsewhere - homepage anchor

The navigation follows the compact upper-right treatment approved in the visual direction.

### Homepage sequence

1. Hero
2. Profile
3. Career narrative
4. What I'm Doing Now
5. Elsewhere
6. Latest posts
7. Connect

### Resume page sequence

1. Header and short professional summary
2. Experience
3. Education
4. Skills
5. Certifications
6. Publications

Experience remains the visually dominant section.

## Visual Direction

### Approved concept

Use the approved hybrid of the "Confident Profile" and "Quiet Editorial" studies:

- Retain Confident Profile's strong frame, direct hierarchy, orange identity rail, and compact menu.
- Use the Quiet Editorial tagline and restrained portrait treatment.
- Keep the black-and-white desert portrait as the hero image.
- The left orange rail is a graphic identity element. It may contain the `ZW` monogram but must not display `Napa, California` or other descriptive copy.

### Hero

The approved hero line is:

> Technology. Hospitality. People.

The hero pairs bold, tightly set typography with the black-and-white desert portrait in a quieter dark block. It should establish credibility and personality immediately without introducing a company-first narrative.

### Palette

Use the approved Signal Orange palette.

Light mode:

- Warm off-white primary surface - `#f7f5ef`
- Near-black text and rules - `#11130f`
- Signal Orange accent and identity rail - `#ef5b36`
- Deep green portrait field - `#263a30`

Dark mode:

- Near-black primary surface - `#151713`
- Warm off-white text - `#f2eee5`
- Brighter Signal Orange - `#ff7048`
- Separately tuned dark portrait field - `#29382f`

The site follows `prefers-color-scheme` automatically. Do not include a visible theme toggle in the initial release.

### Typography

Use Archivo Black for the graphic display system, DM Sans for body text and navigation, and Instrument Serif for reflective narrative copy. Typography must retain the approved contrast between confident profile and quiet editorial rather than reverting to the earlier serif-led magazine treatment.

### Motion

Motion should be restrained and functional:

- A short orchestrated entrance for the hero
- Modest reveal behavior for major sections
- Clear hover and focus feedback
- No continuous decorative animation
- Full `prefers-reduced-motion` support

## Content and Voice

### Homepage voice

Use candid, confident first-person language. The writing should sound like Zak speaking clearly, not a corporate biography, founder manifesto, or collection of slogans.

### Resume voice

Use neutral, factual resume language. Prefer direct action-led descriptions without conversational asides.

### Profile section

Write a concise first-person introduction covering:

- Zak as a systems-minded operator and community builder
- The intersection of technology, hospitality, operations, and people
- The common human throughline across his work

Do not turn this into a list of accomplishments or explicitly enumerate personal hobbies.

### Career narrative

Label the narrative concept "The arc, not the resume."

Summarize Zak's progression across hospitality, logistics, SaaS, fintech, healthtech, IT operations, community leadership, and infrastructure. This is a cohesive narrative overview, not an employer timeline. It ends with a prominent link to the complete resume page.

### What I'm Doing Now

Present two equal current-role blocks:

1. Rangeway - Founder and Chief Executive Officer
2. NorCal EVs - Executive Director

Each block receives a concise factual description and links to the organization's official site. Do not expand Rangeway into a larger feature, list its location formats, or give it more visual weight than NorCal EVs.

### Elsewhere

Use this exact order and public naming:

1. ZakWinnick.com - personal site
2. Current Heading - personal brand
3. NorCal EVs - community leadership
4. Bay Area Rivian Club - community involvement

Do not abbreviate Bay Area Rivian Club as `BARC` in the interface.

Approved links:

- `https://zakwinnick.com`
- `https://currentheading.com`
- `https://norcalevs.org`
- `https://bayarearivianclub.com`

### Live posts

Fetch the latest three items from:

`https://zakwinnick.com/feed.json`

Use all categories. For each item, display the best available combination of:

- Title, when present
- Publication date
- First usable image, when present
- Restrained plain-text excerpt
- Link to the original post

The feed must not inject unsanitized HTML into the page.

### Connect

Include all approved contact and social links:

- Email - `mailto:zak@winnick.io`
- LinkedIn - `https://www.linkedin.com/in/zakwinnick`
- X - `https://x.com/ZakWinnick`
- Instagram - `https://instagram.com/zakwinnick`

Use the corresponding Font Awesome icon for each item. Email may use the Font Awesome envelope icon; the social networks use their Font Awesome brand icons.

All four Connect items receive equal visual weight.

The resume remains available in the main menu and at the end of the career narrative. It is not presented as a social link.

## Resume Source and Content

Use `/Users/zakwinnick/Downloads/Profile.pdf`, a LinkedIn-generated resume export dated July 17, 2026, as the source of truth for the initial resume page.

Include the complete LinkedIn-derived content:

- Experience and quantified accomplishments
- Education
- Skills
- Certifications
- Publications

### Approved employer links

- Rangeway - `https://rangeway.co/`
- NorCal EVs - `https://norcalevs.org/`
- Curai Health - `https://curaihealth.com/`
- Octane - `https://octane.co/`
- CommentSold - `https://commentsold.com/`
- Sensei - `https://sensei.com/`
- Castlerock Asset Management - `https://www.castlerockam.com/`
- GEODIS - `https://geodis.com/`

Every employer name on the resume page links to its approved official URL.

## Technical Architecture

Keep the site framework-free and static. The initial implementation uses:

- `index.html` for the homepage
- `resume.html` for the complete resume
- One shared CSS file
- One shared JavaScript file
- Existing image assets, including the approved black-and-white portrait
- Font Awesome loaded as a shared icon dependency

Do not introduce a package manager, runtime framework, server, database, or build system unless implementation reveals a concrete requirement that static files cannot satisfy.

### Theme behavior

Define theme tokens with CSS custom properties and override them inside `@media (prefers-color-scheme: dark)`. Light and dark surfaces must be designed independently enough to preserve contrast and the approved tone.

### Feed behavior

The browser fetches the approved JSON Feed directly. The feed currently permits cross-origin requests.

Required states:

- Loading: reserve stable layout space without a distracting spinner
- Success: render the latest three valid items
- Partial item: omit unavailable image or title without breaking the card
- Empty feed: show a direct link to ZakWinnick.com
- Network or parsing failure: show the same simple fallback link

Use safe DOM construction and plain-text extraction. Do not assign feed `content_html` directly to `innerHTML`.

### External links

External links open separately and include `rel="noopener noreferrer"`. Internal navigation and the resume page use normal same-site navigation.

## Responsive Behavior

- Desktop retains the orange identity rail and split hero.
- Tablet preserves the overall hierarchy while tightening the navigation and content grid.
- Mobile narrows the rail, stacks the hero copy and portrait, and converts multi-column sections into readable single-column sequences.
- The resume remains comfortably readable at narrow widths; dates, employer names, and descriptions must not overlap or become miniature.
- The exact Elsewhere order remains unchanged at every breakpoint.

## Accessibility

- Semantic header, navigation, main, section, article, and footer landmarks
- One logical `h1` per page and sequential heading levels
- Skip link
- Visible keyboard focus states
- Descriptive portrait alternative text
- Decorative graphics hidden from assistive technology
- WCAG AA contrast for text and controls in both themes
- Keyboard-accessible navigation and links
- `prefers-reduced-motion` support
- Font Awesome icons paired with readable labels rather than used as the only accessible name

## Performance

- Optimize the hero portrait for its rendered size while retaining the original source asset
- Lazy-load feed images
- Reserve image dimensions to reduce layout shift
- Keep animation CSS-first and limited
- Avoid unnecessary third-party JavaScript
- Keep the feed failure path fast and silent

## Verification

Verify before release:

1. Light mode and dark mode at desktop, tablet, and mobile widths
2. System theme changes without a page reload when supported by the browser
3. Keyboard navigation, skip link, and visible focus states
4. Reduced-motion behavior
5. Feed loading, success, missing-title, missing-image, empty, malformed, and network-failure states
6. All internal anchors and the resume-page transition
7. All approved employer, project, social, and contact links
8. Font Awesome icons render without replacing accessible labels
9. No Hawaii content or rejected redesign copy remains
10. Rangeway and NorCal EVs have equal prominence in the current-work section

## Out of Scope

- Publishing or redesigning ZakWinnick.com
- A content management system
- Manual light/dark theme controls
- A downloadable PDF resume generated by this site
- A dedicated interests or hobbies section
- Hawaii trip content
- Additional pages beyond the homepage and resume
- Deployment until Zak approves the completed local implementation

## Approval Record

Zak approved:

- The profile-led narrative architecture
- The Confident Profile and Quiet Editorial visual hybrid
- The Signal Orange palette
- Automatic light and dark mode
- The black-and-white desert portrait
- The homepage and resume voice split
- The complete resume scope
- The exact Elsewhere order and naming
- The live JSON Feed integration
- The complete Connect link set and Font Awesome requirement
- The technical behavior described above
