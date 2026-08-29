# Product UI Philosophy

Build interfaces that feel intentionally designed by an experienced product designer, not generated from a generic AI/SaaS template.

The UI should feel like a polished production product.

Prioritize:

1. usability
2. information hierarchy
3. speed of interaction
4. visual clarity
5. consistency
6. aesthetics

A beautiful interface that makes the workflow slower is a bad interface.

## Design Skills

For substantial frontend work, use the available frontend design skill before implementation.

Use Apple design principles as a source of restraint, hierarchy, spacing, typography, interaction feedback, perceived quality, motion, and accessibility. Do not blindly imitate Apple interfaces. This is a productivity web application, not an Apple marketing page.

## Avoid Generic AI Design

Do not default to common AI-generated UI patterns.

Avoid:

- excessive cards or cards inside cards
- excessive rounded containers, pills, and badges
- unnecessary gradients, glowing elements, decorative blobs, and excessive shadows
- huge page titles and oversized empty spaces
- excessive icons and arbitrary accent colors
- wrapping every section in its own floating container
- excessive explanatory text
- repetitive dashboard grids made from identical rectangles

Do not add visual elements simply to make the interface look designed. Every element must have a purpose.

Prefer strong information hierarchy, compact productive layouts, whitespace, subtle separators, restrained borders, consistent spacing, clear typography, meaningful grouping, lists for sequential content, predictable interactions, obvious primary actions, and high information density without clutter.

## Product UX

Optimize for repeated use. The user should understand the current state within seconds. Frequently used actions should require as few interactions as reasonably possible. Important information should not be hidden behind unnecessary navigation, modals, dropdowns, or hover states. Secondary information should not compete with primary information.

Before implementing a screen, determine:

1. What is the primary task?
2. What information is most important?
3. What actions are most frequent?
4. What information is secondary?
5. What can be hidden until needed?

Design around these answers. Do not start by choosing components.

## Layout And Hierarchy

Prefer a coherent layout system over collections of independent components. Align related elements, maintain a consistent spacing rhythm, and avoid unnecessary nesting. Use typography, spacing, alignment, columns, subtle dividers, and background changes before borders, containers, or cards.

Typography should carry most of the hierarchy. Use a restrained type scale and highly readable body text. Prefer differences in size, weight, contrast, and spacing before decorative UI.

Neutral colors should dominate. Accent colors communicate action, state, priority, or selection. Do not use multiple accent colors without semantic meaning. Do not use gradients unless they have a clear design purpose.

Use restrained border radii. Large rounded rectangles should be rare. Nested rounded rectangles are prohibited unless required by an established component. Prefer subtle borders and surface differences over shadows. Use shadows only when elevation has interaction meaning.

Motion should explain state changes or provide feedback. Prefer subtle and fast transitions. Do not add entrance animation or movement merely to make the interface feel modern.

## Existing Design And References

Before modifying frontend UI:

1. inspect the existing application
2. identify established design patterns
3. inspect components and tokens
4. preserve patterns that work
5. improve inconsistencies rather than creating parallel systems

If references or screenshots exist, inspect them before designing. Treat them as direction rather than pixel-perfect requirements unless explicitly stated. Extract hierarchy, density, spacing, typography, navigation, interaction patterns, and restraint. Do not copy branding or decoration blindly.

## Implementation And Screenshot QA

For substantial UI work:

1. Understand the workflow and existing code.
2. Establish information hierarchy, layout, interaction model, component structure, and visual direction.
3. Implement in the existing stack.
4. Render and inspect the actual interface.
5. Verify hierarchy, spacing, alignment, typography, density, overflow, responsive behavior, interaction states, empty states, loading states, and error states.
6. Refine and repeat rendering until visible issues are resolved.

For meaningful visual changes, use browser screenshots when available. Ask whether the primary action is obvious, anything is louder than it deserves, there are too many containers, spacing is consistent, density is appropriate, the result resembles a real product, and anything can be removed without reducing usability.

Design through subtraction. When two solutions provide the same usability, choose the simpler one.

# Anti-AI UI Rules

This is an internal productivity tool, not a SaaS landing page or dashboard template.

## Strictly Forbidden

Do not use emojis as interface decoration. Do not put emojis in headings, status icons, or labels. Use one consistent icon library when an icon is necessary.

## Do Not Default To Cards

A card is not the default container. Before adding one, ask whether spacing, typography, alignment, a divider, or a table communicates the grouping equally well. If yes, do not use a card.

Avoid:

- rows of identical KPI cards
- cards inside cards
- dashboard grids made primarily from cards
- separate cards for every metric
- icon + number + title + subtitle metric cards
- large empty cards containing little information

Cards are the exception, not the primary layout primitive.

## Metrics

Do not represent every metric as an individual card. Prefer compact metric strips with typography, spacing, and small dividers. Icons are optional and should usually be omitted when the label already communicates the meaning.

## Information Density

This application is used repeatedly. Optimize for information density. Avoid spending 150–200px of vertical space on one number and two short labels. Prefer compact rows and sections. Show as much useful information as possible without sacrificing readability.

## Visual Hierarchy Without Containers

Build hierarchy primarily using:

1. typography
2. spacing
3. alignment
4. columns
5. subtle dividers
6. background changes
7. borders
8. containers
9. cards

Do not use rounded rectangles as the primary method of communicating hierarchy.

## Icons

Icons must communicate information or an available action. Never use an icon because an empty area looks better with one. Do not place every item inside a colored icon square. Avoid multicolored icon backgrounds unless colors communicate real semantic states. Use one consistent icon set.

## Dashboard Layout

Do not automatically translate requirements into a grid of cards. Explore metric strips, tables, split views, compact lists, timelines, grouped rows, master-detail layouts, side panels, and command surfaces. Let the workflow and information relationships determine the layout.

## Product References

Aim for the restraint and information architecture found in Linear, Attio, Stripe Dashboard, and Notion. Extract principles without copying their visual styling.

The desired result is quiet, dense, precise, professional, and fast — not playful, decorative, template-like, marketing-oriented, or AI-generated.

## Mandatory Design Critique

After rendering every substantial UI change, explicitly ask:

1. Does this look like a generic AI-generated SaaS dashboard?
2. Am I overusing cards?
3. Am I overusing rounded rectangles?
4. Are there decorative icons or emojis?
5. Could any container be removed?
6. Could information be presented more compactly?
7. Is color being used without semantic meaning?
8. Is there unnecessary empty space?

If any answer indicates a problem, revise before considering the task complete.
