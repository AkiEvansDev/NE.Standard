# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.6.0

What NE.Home asked for on 1.5.0 (GitHub issues #95–#101).

- **A Raised surface with a colour of its own hands its popups the neutral raised step** (#95). A context menu opened from a
  primary bubble was drawn on the primary, 8 % lifted, while its entries kept the page's ink.
- **Discarding a form discards what was said of it** (#96). `DiscardFormEffect` takes the page rules', the bounds' and the
  runtime's messages off every field of the form, whether the discard changed its value or not, and the form stands as unvisited;
  the controller's bound message and a package's mark stay.
- **A field's file-drop mark is seen** (#97). On a field another input takes files for (`DropTargetId`), the dashed edge is drawn
  on the field's box, which painted over the root's; the mark is in the inks (`PrimaryInk`, `DangerInk`), 3:1 on a field's fill.
- **New: a file tree's default dress** (#98). A tree node that says whether it is a folder (`IsFolder` true or false) and names no
  icon of its own shows a folder, open while unfolded, in a golden yellow, or a page in the title's ink; the node's own `Icon`,
  or an `IconColor` other than the default, wins. **Breaking:** such a node drew no icon before.
- **`Virtualized()` on a Wrap host keeps only the lines in view** (#99), as many tiles to a line as fit it, where it kept every
  row. A virtualized host also lays out again when its size changes without a scroll — a flyout opened over it, a wider window.
- **A click on a list's row marks the pointer before the row cursor moves** (#100), so a list holding the focus under the
  keyboard's last word draws no keyboard wash on the pressed row.
- **A row can be dragged again, and a press no longer flashes the keyboard's wash on the cursor's row.** Since 1.5.0 a press
  in a list's, a table's or a tree's rows focused the box the rows stand in, which handed the focus back to the host mid-press:
  the browser cancelled every row's drag — reordering and dragging between hosts alike — and the row the cursor stood on lit for
  a moment. The box no longer takes a press's focus.
- **A dragged row's picture carries no blot.** The press's wave, fading as the drag began, was drawn into the picture the browser
  drags as a dark patch behind the row's words; it now goes at once.
- **An empty list's words stand off its edge**, as an empty tree's and table's do, so the dashed edge a drop draws around an empty
  list no longer touches them.
- **NE.Colors 2.0.0.** **Breaking:** `ColorName.NebulaGold` is `NebulaLemon` (same number and value, so stored colours read back
  the same; source naming it changes). `SolarGold` and `PulsarMagenta` come with words in every table, and `ColorVariant` gains
  `Nearest` and `ToNearestNamed`; its own `IsLight()` now judges by WCAG contrast. **Breaking:** `UIColorContrast.IsLight` is
  gone — `ColorVariant.IsLight()` answers alike, and hid it at every `variant.IsLight()` call; `IsLightOverWhite` (which now asks
  `IsLight()` of the colour laid over white) and `Ratio` stay. **Breaking:** the name's word key is `ui.color.name.nebula-lemon`
  (was `ui.color.name.nebula-gold`), and `ui.color.name.solar-gold` and `ui.color.name.pulsar-magenta` are new: an application
  translating the palette into a language of its own renames the one and adds the two.
- **The default theme's Warning is `SolarGold`**, in both themes, where it was the lemon `NebulaGold`; the light page's warning ink
  is the same gold shaded 5, which reads 4.5:1 on a tinted badge and replaces a hand-written golden brown.
- **The colour input's palette is a chart**: a column per family around the hue wheel, the neutrals last, a row per step the
  names give (the deep one, Nebula, Lunar), and the eight bright ones in hue order below — where every family broke across rows.
- **Selected text is brighter**: the brand's ink at 48 %, where the fill at 32 % was all but unseen on a dark page.
- **New: dragging items from one host to another.** A list, a table or a tree offers its rows as a kind
  (`SetDragKind("card")`, `SetDragEffects(...)`, `IDragSourceComponent`); any component takes a kind (`OnDrop("card", command)`,
  extra arguments beside it, or `OnDropLiteral` with literal ones), and its command receives a `UIDrop`: the kind, the source's
  id, the keys (the chosen rows where the dragged one is chosen), the index in a list or the folder of a tree, and `UIDropEffect` —
  a move between hosts of one kind, a copy into anything else, Ctrl (⌥ on a Mac) for a copy. Between two lists or tables of the
  kind, neither virtualized nor windowed, the rows move at once and come back unless the answer keeps them. From the keyboard:
  Ctrl+X (move) or Ctrl+C (copy) on a row, ⌘ on a Mac, and Ctrl+V on a target, which decides as a drop does — a cut pasted into a
  component of another kind is a copy; inside a text field Ctrl+V is the field's own paste. A kind is lower-case letters, digits
  and hyphens; one spelt otherwise, or one no component of the view offers (a source whose `DragEffects` is `None` offers
  nothing), is refused when the view compiles. `UIDrop.Read` refuses a drop with an unknown effect, a negative index, or no keys
  (or a null one). `EventNames.DropPrefix`.
- **An address the application has not is answered with a 404.** The not-found page standing in for it was sent as a 200,
  for a page and a missing file alike; asked for by its own address it is still found.
- **A picture that fails, or has no source, shows the framework's stand-in** — a picture's glyph on the wash, a person's on a
  round one — where it had no `FallbackSource` of its own (or that failed too), never the browser's broken mark.
- **New: `ItemsViewComponent.Padding`** (#101), inside the scroll and bindable, so rows run on under what stands over a list's
  foot; a list held at its end stays there as the padding changes. A list with a Padding drops the step of room an end-anchored
  list keeps past its last row.
