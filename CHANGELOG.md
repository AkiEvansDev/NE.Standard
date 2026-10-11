# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.2

- **Breaking:** a field with no `Appearance` of its own is `Tonal` — the fill alone, rounded all round — where it was `Filled`;
  `Filled`, the fill with a line under it, is for a long, complex form and is set on purpose (`SetAppearance(UIInputAppearance.Filled)`).
- **Breaking:** the built-in tab menu and a key-value row's buttons are named by the standard actions' words: `ui.tab.pin`,
  `ui.tab.unpin`, `ui.tab.close` and `ui.tab.delete` are `ui.action.pin`, `ui.action.unpin`, `ui.action.close` and
  `ui.action.delete` (a tab's × too), and `ui.row.edit`, `ui.row.save` and `ui.row.cancel` are `ui.action.edit`, `ui.action.save`
  and `ui.action.cancel`. An application that translated or overrode the old keys writes the new ones; `ui.tab.rename` stays.
- An expander's press follows its edge: the wave was rounded a pixel more than the inside of the border, and over an open expander
  its foot was rounded too.
- A page's own drawer pin (`ButtonComponent.PinsDrawer`) held down keeps the hover's neutral wash, as the menu's own pin does; since 1.8.1 it
  also wore a toggle's selected ground, tinted in the brand's colour.
- A list nested in a row of another list found its rows again: a key a row repeats inside itself (a menu entry's submenu, a
  composite's cell) was read twice into the address, so a row's context menu with a submenu logged `items host was not found for a
  collection refill` on every load (#171).
- An expander can be quiet: `SetVariant(UIExpanderVariant.Quiet)` draws it as a line of muted words with the chevron right after
  them — no edge, fill, padding or rule — the content flush under it, for a quiet part of a page (a model's thought over its reply, a
  narrow panel's sections). It answers a pointer in its ink alone, and the keyboard's frame goes round the line, whatever its
  `Surface` (#172).
- `UIDialogs` (Extensions): a dialog headed by its mark, its title and an × that closes it — `Create(key, title, content, icon)`,
  `Content(…)` for a dialog that sets more of its own, `Header(…)` alone. The mark is the title's own icon. The × closes it as
  Escape does, raising the dialog's `OnClose`, with nothing else asked of the server; it is `UIIconButtons.Close()`, named
  `ui.action.close`.
- `CloseDialogEffect.RaisesClose`: a close of the viewer's own, raising the dialog's `OnClose`; such a close may run in an
  interaction (`CanRunInInteraction`).
- A load of another of the application's pages keeps the page drawn until the next one has painted and fades across to it
  (`@view-transition`, Chromium and Safari), so the shell does not blink between two pages; none under reduced motion.
- A link, a `NavigateEffect` or Back and Forward to another runtime of the page's route — an address differing in a parameter the
  route names in `Identity(...)` — loads no page: the page leaves the runtime it holds over the connection it has, attaches to the
  other (built if none is kept) and takes its whole state, as after a dropped connection. The values still on their way reach the
  runtime left first, its dialogs close and its background commands are cancelled, as a closed connection cancels them; nothing the
  left runtime still sends reaches the page, and the content takes no press until the other's state is in. The sides stay as they
  stand and the content starts at its top. Unsaved work is asked about first, Back and Forward stepping back onto the page's entry
  while the reader decides. An address the reader may not see — refused, redirected to another route, a controller failing to
  start — is loaded instead, so the page shows what the server renders there. Links to the same runtime and to other routes load as
  before (#174).
- A feed that cannot count reads on from its very top: a read of older rows keeps the row the reader saw where it stood, which the
  browser's own scroll anchoring does not at the top, and a read that brought rows decides again, so a reader still at the edge gets
  the next window (#175).
- Scrollbars over the content (`UITheme.OverlayScrollbars`, on by default): where a pointer hovers, a scroller keeps no room for its
  bar — a padding reads the same on both sides, and nothing narrows as a bar comes — and a thin thumb shows over its edge while the
  pointer is over it or it moves, 6px wide, darkening under the pointer as a handle to drag — a popup's list too, and a list in a
  package's modal `<dialog>`. A drag of a popup list's thumb keeps the popup open and the focus where it was; a scroller that draws
  no bar on purpose (`--ui-overlay-thumb: none`: a button group's strip, a time wheel's column) gets none. Forced colours keep the
  platform's bar. Off, the platform's thin bar as before.
- A popup list capped to a short window keeps its scroll: its own scroll placed it again, uncapped, and put it back at its top.
- A side slid out as a drawer keeps the width its root names, as pinned, under the same 85vw cap; it was 20rem whatever the side's
  width, and the panel jumped on every pin (#176).
- `UIMenuItems` and `UIIconButtons` (Extensions): the standard actions — Pin, Unpin, Open, Edit, Copy, Save, Cancel, Close and, in
  the danger colour, Delete — as a menu's entries and as icon buttons, in the framework's new words (`ui.action.*`) and its glyphs.
  Both build on `UIStandardAction` (NE.Standard.UI.Components), each action's word, glyph and danger colour in one place, which
  the built-in tab menu and a key-value row's buttons take too.
- `UIText.WithBadges` (Extensions): a title with a row of badges under it in place of a description, from a list of `BadgeItem`s
  or bound to a collection of them; an item that says it is content (`IsContent`) keeps its words as written.
- An icon-only split button centres its glyph, as an icon-only button does: the empty title kept a gap after it (#173).
- `UISurfaceStyle.Flat`: the raised panel's fill lying flat, with no shadow — an action row's ground, for a clickable surface
  holding a row of its own content (a glyph before a time) in a list; a `Raised` row casts a shadow, and a list of them floats. A
  menu on it opens its popups lifted as a raised one does; a dialog keeps its shadow, so Flat draws there as Raised (#177).
