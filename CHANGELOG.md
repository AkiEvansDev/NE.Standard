# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.0

- An open drawer's own switch takes the place and the size of the button that opened it, and what shares its row follows, so the
  burger stays put as the drawer comes and goes; there it is called "Close the side panel" (`UIStrings.SideClose`) (#158).
- A page with a controller and nothing bound — a shell that only answers commands — renders its regions; it was served blank (#160).
- A non-modal dialog takes a press on its panel alone: its layer covered the page and took every press beside the panel (#161).
- `UITypography.ValidateFontFamily` is public, for a font list a package takes as a theme's, and refuses a list that names no family.
- `Context.Runtime.Start` starts a job the runtime owns — a reply streamed for a minute — which outlives the connection that started
  it, is cancelled when the runtime is asked to go, and hands a failure to the controller (#163). A job keeps no runtime past its
  retention, and sees the runtime's connection, not the one of the command that started it. **Breaking:** a member of
  `IUIRuntimeAccess`, which an implementation outside the framework must add.
- **Breaking:** `UIControllerBase.OnDispose` is gone; a controller releases what it owns in `Dispose(bool)`, the .NET pattern the
  analyzers' CA2213 reads (#163).
- **Breaking:** a link stands at the start of its line, as text does, not centred; `SetHorizontalAlignment(UIAlignment.Center)`
  centres it again (#163).
- `ContainerComponent.SetRow` past the rows there are says how many there are and that the first is there from the start (#163).
- **Breaking:** `UIViewOptions.SideDrawers` names the width below which the sides are drawers — `UISideDrawers.BelowMd` (the
  default, as before), `BelowXl`, `BelowXxl`, `Always` or `Never` (was `false`) — so a tablet may keep the content's whole width (#159).
- From the medium breakpoint up a reader may pin a drawer, which then stands in its column: a sidebar menu's pin at the end of its
  top row (`MenuComponent.SetDrawerPin`) or the page's own button (`ButtonComponent.SetPinsDrawer`), kept in the browser under
  the first authored id in the side (`UIStrings.SidePin`); never for a left side that is the bottom bar (#159).
- `UIViewOptions.LeftDrawerModal`/`RightDrawerModal` off leave the page beside an open drawer working: no veil, no press beside it
  closing it, Escape only from inside it (#159).
- A side's fold switch leads its top row in a column as it does in a drawer: the switch, then the search or heading, then the pin;
  a switch alone stands on that edge too, a collapsible panel's included, rather than on the inner one.
- `GridSplitterComponent.Position`: the share before the bar, 0 to 1, bound two-way so the controller keeps the viewer's division
  across devices; a value it sets moves the bar, the same share at every width. Unbound, it is the starting division: one the
  viewer left at a width stands over it there, and a reset returns to it.
- A splitter's bar follows the pointer all the way and folds a side only when it is let go under 48 px (it snapped at 120 as it
  moved); a side that narrow shows none of its panes while the bar is held. Along a folded edge the bar draws its line at that edge, and only under
  the pointer. A pane folded by one bar stays folded when a bar across the other axis moves, where it stood at no width with its
  words a letter a line.
- `PaneContainerComponent`, a container whose panes the viewer moves between their places by a grip at a pane's top (shown while
  the pointer is over that top band), two panes
  trading places with a slide; `AddPane(name, place, content)`, and `Layout` — the names in the order of their places — bound
  two-way, or kept in the browser under the container's id (`UIPaneLayout`, `UIStrings.PaneMove`).
- A sidebar folds without a jump: its open section slides shut and open with it rather than drop the entries below in place, what
  shares the switch's row keeps its width and fades rather than squeeze, and the switch and the rail's icons end where they stood.
- The docs set an application up as a class library and a web host that names it, each with its own packages (#164); a new
  guide, *Designing a page*, gathers which component for which job — a toggle's words kept to one line, a longer explanation as
  the field's hint among them (#165).
