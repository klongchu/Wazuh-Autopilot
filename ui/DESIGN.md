# Console design system

Written for engineers adding or changing screens in `ui/`. It describes what the
console already does, so that a new page looks like it belongs without anyone
having to read every existing page first.

The console is an operations tool for a SOC. People read it for hours, often on
a wall display or a second monitor, and act on it under time pressure. That
drives every decision below: dense but scannable, calm by default, colour
reserved for things that need a decision.

---

## 1. Tokens, not hex

Every colour is a CSS custom property in `src/index.css`, declared as a
space-separated RGB triple so Tailwind can apply alpha to it:

```css
--accent: 255 129 39;      /* → bg-accent/10, text-accent, border-accent/30 */
```

`tailwind.config.js` maps each token to a utility via `rgb(var(--x) / <alpha-value>)`.
Never write a hex value or `text-[#ff8127]` in a component: the light theme
would not follow.

| Token | Use |
|---|---|
| `bg` | app background behind the shell |
| `deep` | recessed surfaces: inputs, sidebar rail, code blocks |
| `card` | panel surface |
| `card2` | raised surface inside a card: chips, hover rows, kbd |
| `line` | all borders and dividers |
| `fg` | primary text |
| `muted` | secondary text, labels, table headers |
| `subtle` | tertiary text: metadata, placeholders, axis ticks |
| `accent` | brand orange; the single primary action on a screen |
| `danger` `warn` `success` `info` | status semantics |
| `accent-fg` | text/icon sitting **on** a solid accent fill |
| `*-text` | text-safe variant of each status hue (see §2) |

### The `*-text` rule

The base status hues are tuned for **fills and borders**, where WCAG only asks
for 3:1. As text on a card they fail 4.5:1 in the light theme. So:

- fill or border → `bg-danger/10`, `border-danger/30`
- the label inside it → `text-danger-text`

Both themes define `--danger-text`; in dark mode it equals the base hue, in
light mode it is darkened. Writing `text-danger` on a light background is a bug.

## 2. Contrast floors

- Body and metadata text: **4.5:1** against its actual surface. `--subtle` is
  the lowest-contrast text token and is set to clear it — do not go below it.
- Borders, icons, chart strokes, the toggle knob: **3:1**.
- Check against the real surface. `text-subtle` on `card2` is not the same
  measurement as on `card`.

## 3. Type scale

Semantic steps in **rem**, in `tailwind.config.js`, so text follows the
browser's font size (WCAG 1.4.4):

| Class | Size | Use |
|---|---|---|
| `text-micro` | 11px | chips, dense metadata, axis ticks |
| `text-meta` | 12px | secondary labels, inline code |
| `text-caption` | 13px | nav items, compact table rows |
| `text-sm` | 14px | body default, table cells, inputs |
| `text-title-sm` | 15px | card titles |
| `text-base` | 16px | modal titles |
| `text-page` | 22px | page titles |

**Never use `text-[Npx]`.** An arbitrary pixel size freezes that text when a
user enlarges type. If you need a step that does not exist, add it to the scale.

Weights: 400 for body, 500 for titles, labels and buttons. Nothing bolder —
600 exists in the font but reads as shouting at these sizes.

## 4. Spacing, radius, density

- Spacing uses Tailwind's 4px scale. Inside a card: `p-4`; between cards:
  `gap-4`; page padding: `px-5 py-4` (`px-3` below `md`).
- Radius: `rounded-xl` (14px) for cards and panels, `rounded-lg` for controls,
  `rounded-md` for chips, `rounded` for inline code. Nothing is fully round
  except avatars and status dots.
- Table rows are `py-2.5`. This console is deliberately dense; resist adding
  air to tables, add it between sections instead.

## 5. Shared component classes

`@layer components` in `src/index.css` is the single source for control
skins. Use these instead of restyling a button inline:

`.card` `.input` `.textarea` `.label` `.btn` `.btn-primary` `.btn-secondary`
`.btn-ghost` `.btn-danger` `.btn-success` `.btn-sm` `.icon-btn` `.btn-bare`
`.th` `.td` `.chip` `.kbd` `.section-label` `.focus-ring` `.skip-link`

Two to know about:

- **`.focus-ring`** — a visible `focus-visible` ring. Baked into `.btn`,
  `.icon-btn` and `.btn-bare`.
- **`.btn-bare`** — for a button that carries its own skin (a tab, a segmented
  option, a sort header, a clickable list row). It adds only the focus ring, a
  pressed state and disabled handling. **Every `<button>` gets one of the `.btn-*`
  classes or `.btn-bare`** — a focusable control with no focus ring is a defect.

Also: every `<button>` that is not submitting a form needs `type="button"`.

## 6. Sizing and touch targets

Controls use `min-h-*`, never a fixed `h-*`: fixed height clips its own label
when text is enlarged. `.input` and `.btn` are `min-h-9` (36px), comfortable
with a mouse at desk density.

A `@media (pointer: coarse)` block raises `.btn`, `.icon-btn` and `.input` to
44px and `.btn-sm` to 40px, so touch devices meet WCAG 2.5.5 without
compressing the desktop layout. An icon-only control should be `.icon-btn`, or
use negative margin to enlarge its hit area without moving anything:
`className="-m-2 p-2"`.

## 7. Component library

`src/components/ui.tsx` is the shared library. Check it before building
anything: it already has `Card`, `CardHeader`, `PageHeader`, `PageBody`,
`Badge`, `SeverityBadge`, `StatusBadge`, `DeltaChip`, `Kv`, `Segmented`,
`Tabs`, `Modal`, `Drawer`, `ConfirmDialog`, `Spinner`, `Skeleton`,
`SkeletonRows`, `EmptyState`, `ErrorState`, `Async`, `DataTable`, `JsonView`,
`Markdown`, `Field`, `NumberInput`, `Toggle`, `Select`, `TagInput`,
`RoundIcon`.

Patterns worth following:

- **`Async`** wraps a TanStack query and renders the loading, error and empty
  branches for you. Use it rather than hand-rolling `isLoading ? … : …` — that
  is how pages end up with three different spinners.
- **`DataTable`** gives sortable headers (`aria-sort`), consistent `.th`/`.td`
  padding, and keyboard-operable rows. Pass `rowLabel` whenever you pass
  `onRowClick`, so the row has an accessible name.
- **`Field`** owns the label, hint and error for one control. Pass `error` and
  it wires `aria-invalid`, `aria-describedby` and a `role="alert"` message to
  the child automatically.
- **`NumberInput`** instead of `<input type="number">`: it clamps to `min`/`max`
  on blur. A bare number input only validates on form submit, and these fields
  are not in forms.
- **`useDialog`** gives any overlay the four behaviours a modal owes the user:
  Esc closes, Tab stays inside, the page behind does not scroll, and focus
  returns to whatever opened it. Mark the element that should take initial
  focus with `data-autofocus`.

## 8. Screen states

Every data surface handles four states, in this order of design attention:

1. **Loading** — `Skeleton`/`SkeletonRows` shaped like the content that is
   coming. Spinners only for actions in flight, inside the button.
2. **Empty** — say *why* it is empty and what to do. "No alerts match these
   filters" with a **Clear filters** button, not "No rows". An empty state with
   no action is an unfinished empty state.
3. **Error** — `ErrorState` with the message and a **Retry**.
4. **Loaded**.

Toasts (`src/lib/toast.tsx`): success and info auto-dismiss after 4s; **errors
stay until dismissed** and are announced assertively, because they usually
carry a reason the user has to read.

## 9. Interaction and keyboard

- Every interactive element shows hover, focus-visible, active and disabled.
  Disabled is `opacity-50` plus `cursor-not-allowed` — and if a button is
  disabled because input is missing, say what is missing nearby. Silent
  disabling is the single most common usability bug in this codebase's history.
- Anything clickable must be reachable by Tab and operable with Enter/Space. A
  `<div onClick>` is a bug; a clickable table row needs `tabIndex`, `role` and
  a key handler (`DataTable` does this for you).
- Tabs follow the ARIA tab pattern: `role="tablist"`/`role="tab"`, roving
  `tabIndex`, arrow keys, Home/End.
- Dropdowns close on Escape and on outside click, and their trigger carries
  `aria-expanded` and `aria-haspopup`.
- Tab state that a user might want to link to or reload into belongs in the URL
  (`useTabParam`), not in `useState`.

## 10. Motion

Entry only, 150–180ms, `cubic-bezier(0.22, 1, 0.36, 1)`: `animate-fadeIn` for
backdrops, `animate-popIn` for modals, `animate-slideInRight` for drawers.
Always pair with `motion-reduce:animate-none`. Nothing loops except a spinner,
a skeleton shimmer, and the live-event pulse ring.

## 11. Page anatomy

```
PageHeader   title, optional subtitle, right slot (filters + the one primary action)
PageBody     the content, scrolled by <main>
```

`PageHeader` also sets the browser tab title, so pass a plain string `title`
(or `documentTitle` when the title is a node).

Each page has **one** primary action, styled `.btn-primary`. If a page seems to
need two, one of them is secondary. If it needs none, do not invent one.

The app shell owns scrolling: `<main>` is the scroll container, the header and
sidebar are fixed. Do not set `height: 100%` on page content or add a second
scroll region inside a page without a reason.

## 12. Accessibility checklist before you open a PR

- [ ] Both themes: switch to light and re-read every new piece of text.
- [ ] Tab through the screen. Is every control reachable, is focus always
      visible, and does Tab order match reading order?
- [ ] Any new overlay: Esc closes, focus is trapped, focus returns on close.
- [ ] Zoom text to 200%. Nothing clipped, nothing overlapping.
- [ ] 320px wide. No horizontal scroll.
- [ ] No `text-[Npx]`, no hex colours, no `text-danger` used as text, no
      `<button>` without a focus ring, no fixed `h-*` on a control with a label.
