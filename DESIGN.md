---
version: beta
name: ion-inf Student Software Utility
colors:
  primary: "#1d1d1f"
  background: "#0b0b0c"
  canvas: "#f5f5f7"
  surface: "#ffffff"
  text: "#1d1d1f"
  textMuted: "#68686d"
  border: "#d8d8dc"
  focus: "#0071e3"
  brandText: "#b74500"
  portraitBackdrop: "#ffd8c2"
typography:
  body: "16px / 1.5 system sans-serif"
  helper: "13–14px / 1.5"
  title: "36px mobile, up to 56px desktop"
spacing:
  small: 8px
  medium: 16px
  large: 24px
  section: 32px
rounded:
  control: 9px
  panel: 12px
  canvas: 18px
---

## Surface contract

Public student utility plus sequential documentation, not a marketing page and not an internal dashboard. Primary outcome: find the correct supported installer, complete the steps, run a first Python file. Python → PyCharm is the default course order. LibreOffice is for selected lessons.

Preserve the identity: @ion_inf, direct help to @im_ion, supplied portrait, orange handwritten “Собрано Ионом” with a small vector heart. Keep the portrait subordinate to the task. One circular peach background is enough; no floating card, layered decorative arcs or overlapping priority row.

## First screen

Compact sticky navigation; constrained content width (1160px usable). Desktop introduction uses two columns; on phones the 100px portrait stays beside the title rather than above the software list. At 375 × 667 the whole Python install button is visible without scrolling. Program descriptions stay visible at every width.

All three programs use the same flat row, separating line, version, purpose and explicitly named action. No Py/PC letter tiles. At 700px and narrower the action occupies its own full-width row with min-width:0; no minimum column that overflows at 601/640px. Native scrollbar is retained.

## Instruction pattern

One shared expansion controller. Explicit OS choice, requirements before the download, explicit Mac chip for non-universal files, consistent name/version/size/type/architecture and official fallback. Download opens separately so the current step remains available.

One reading step at a time; PyCharm sections are installation, first project, settings and first run. Desktop uses a step list; mobile a labelled native select. Back/next work across chapter boundaries. Session storage and stable hash URLs preserve progress. Reset is explicit. Python's final step continues to PyCharm with the same OS. PyCharm readiness requires the student's three explicit confirmations; the site never claims it detected software.

Screenshots are the teacher's unchanged source images with coordinate-based SVG marks. Exact OS/version is adjacent to each image, including direct-linked steps. Old Windows screenshots are labelled as references when reading Mac instructions. LibreOffice remains text-only until real screenshots are supplied. Missing image has local retry; scripts unavailable means complete generated HTML instructions and official links for all three programs.

## Readability and interaction

Body 16px; helper 13–14px; no 10px labels. Secondary text #68686d and dark-orange handwriting meet normal-text contrast on the canvas. Graphite primary controls; opaque #0071e3 focus outline. Selected choices use graphite, not blue focus styling. Never remove native focus without a visible replacement on interactive elements.

No entrance animation. All deliberate scrolling uses the same reduced-motion-aware helper. Sticky header height is observed so its variable height under text zoom is reflected in scroll offset. Image dialog supports Escape, focus return, original-size scrolling and a caption. Keyboard and image/error actions must not lose the current step.

## Delivery and visual verification

Small WebP portrait variants with explicit dimensions and srcset; 2.3KB local Cyrillic signature subset; guide images only when their step is rendered. Hashed assets get immutable caching, HTML revalidates. No SPA fallback for missing files.

Required browser widths: 320,375,390,600,601,640,680,700,768,840,841,1024,1440. Check actual bounds and clipping, not merely page width. Inspect saved viewport screenshots at 375 × 667, 390 × 844, 1440 × 900 and the 601px boundary. Include 200% text/reflow, image failure, JS-off, history, dialog, keyboard and reduced motion.

The compact utility contract takes precedence over the old oversized portrait, hidden scrollbar and LibreOffice-elevated composition. No generic SaaS card grid, decorative icon tiles, gradients, fake screenshots or marketing copy.
