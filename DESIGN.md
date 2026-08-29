---
version: alpha
name: ion-inf Student Software Utility
colors:
  primary: "#1d1d1f"
  background: "#0b0b0c"
  canvas: "#f5f5f7"
  surface: "#ffffff"
  surfaceSubtle: "#f0f0f2"
  text: "#1d1d1f"
  textMuted: "#68686d"
  border: "#d8d8dc"
  focus: "#0071e3"
  brandAccent: "#e25d00"
  portraitBackdrop: "#ffd8c2"
typography:
  body-md:
    fontFamily: SF Pro Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  title-lg:
    fontFamily: SF Pro Display
    fontSize: 68px
    fontWeight: 600
    lineHeight: 1.15
rounded:
  sm: 10px
  md: 18px
spacing:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 24px
  xl: 40px
components:
  app-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  software-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  install-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  os-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textMuted}"
    rounded: "{rounded.sm}"
  divider:
    backgroundColor: "{colors.border}"
  focus-ring:
    backgroundColor: "{colors.focus}"
  step-marker:
    backgroundColor: "{colors.surfaceSubtle}"
    textColor: "{colors.textMuted}"
  portrait-stage:
    backgroundColor: "{colors.portraitBackdrop}"
    textColor: "{colors.text}"
  personal-signature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.brandAccent}"
---

## Overview

ion-inf is a compact student utility, not a marketing site. The default screen combines a quiet software list with one restrained personal-brand portrait. LibreOffice installation is progressive disclosure: the operating-system choice does not exist visually until the student clicks “Установить”. The visual direction is Apple-inspired restraint based on the latest user reference, without copying Apple interface chrome or adding promotional claims.

## Colors

The page uses a near-black outer background with one warm-white application canvas. Graphite is the primary action and text color. Saturated blue is reserved for keyboard focus. Warm orange is the single personal-brand accent and appears only in the portrait composition and signature; it never replaces the graphite primary action. Python and PyCharm use neutral disabled styling.

## Typography

Use the system San Francisco stack with Helvetica and Arial fallbacks. The page title reaches 68px on wide desktop and 37px on mobile. Software names are 17–20px, body text is 14–19px, and helper text is never smaller than 11px. Hierarchy comes from weight, contrast, and spacing.

## Layout

- Desktop: one rounded light application canvas inset 8px from the dark browser background. An 88px translucent top bar holds the text signature @im_ion and direct Telegram help. Native scroll remains available, but browser scrollbar chrome is visually hidden.
- The introduction is a restrained two-column composition: task copy and the handwritten line “Собрано Ионом ♥” on the left, a supplied cutout portrait over a layered orange backdrop on the right. There is no biography card, facts, metrics, or secondary CTA.
- Content expands up to 1640px with 40px outer padding.
- Default screen: title, one-line description, personal signature, portrait, and a flat software list separated by hairline rules.
- The LibreOffice row is the one elevated white surface. It overlaps the lower edge of the portrait stage so the portrait sits slightly behind the utility layer; upcoming software remains flat.
- LibreOffice expansion sits directly below its row and splits into a 34% OS column and 66% instruction column.
- Mobile: the same top bar becomes compact; the introduction and portrait stack before the software list; software rows remain flat; the expanded installer becomes one vertical flow.
- The page must not require horizontal scrolling at 375px.

## Elevation & Depth

Depth comes from four ordered layers: two fine broken circular arcs, one round orange backdrop disc, the transparent portrait, and the LibreOffice row in front. Every backdrop contour is geometrically circular; ellipses are prohibited. One restrained shadow may belong to the portrait stack and one to the primary LibreOffice row; the expanded installer remains nearly flat. No gradients, glow, floating dots, or extra decorative objects. The top bar may use restrained system-style backdrop blur.

## Shapes

Use 10–13px radii for controls, 18px for the two primary surfaces, and 22px only for the outer application canvas. Do not put every row in a rounded card. No nested decorative cards.

## Components

- Primary button: 44px minimum height, graphite fill, white text, clear hover/pressed/focus states.
- Software row: flat row with a bottom divider. Python and PyCharm are inert and say “Скоро”.
- OS option: full-width semantic button with a single 1px contour. Selection uses a graphite contour; keyboard focus replaces it with one blue contour. Never combine border and outline into a double frame.
- Instruction area: direct official download link followed by four real screenshots for Windows. The first screenshot points to the browser downloads button; macOS uses architecture selection and a compact text-first installation sequence.
- Top bar: text-only @im_ion signature and one black help button that opens Telegram directly. The @ character is visually muted; the portrait belongs to the page introduction rather than navigation.
- Portrait stage: the supplied transparent portrait sits over one perfectly round pale-orange disc. Behind it, two low-contrast interrupted arcs are drawn from true circles at different radii. The round disc covers the visible silhouette, and the LibreOffice row overlaps the lower edge. It has no card, ellipse, glow, gradient, caption, biography, facts, or statistics.
- Personal signature: the handwritten text uses the locally bundled `Bad Script` Cyrillic font in the brighter `brandAccent` color and ends with one small vector heart. The heart is part of the signature, not an emoji decoration or separate icon badge.

## Do's and Don'ts

Do:

- Make “Установить” the only primary action on the default screen.
- Keep the OS choice hidden until installation is expanded.
- Use spacing, typography, columns, and dividers for hierarchy.
- Keep Telegram support accessible without a promotional help card.
- Treat Apple Silicon as M1 and newer, including M5.
- Keep the personal-brand treatment to the portrait and the exact line “Собрано Ионом ♥”.
- Keep orange limited to the portrait layers, signature, and vector heart.

Don't:

- Add a marketing pitch, biography card, personal facts, follower or student counters, metric cards, badges without semantic meaning, emojis, gradients, glows, floating dots, or large rounded containers.
- Show Windows/macOS controls on the default screen.
- Add a sidebar or a separate Telegram navigation item.
- Put each step in its own card.
- Use orange for primary controls, software status, or unrelated interface decoration.
- Add a separate decorative laptop artwork or imply Apple affiliation; the laptop visible in the supplied portrait is the only permitted device image.
