# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.7.1

- A checkbox, a switch and a radio answer a hover more quietly: off, the ring goes halfway to the ink rather than all the way (a
  white ring on a dark theme); on, the fill leans less toward it.
- A list, a table or a tree pressed again after the focus had gone elsewhere no longer flashes the keyboard's wash on its last
  cursor row (#134): the press marks the host as the pointer's before the browser focuses it.
- `UIControllerBase.OnVisibilityChangedAsync` runs when a runtime goes on or off screen — a page's report, an attach or a detach;
  `UITestPage.HideAsync`/`ShowAsync` return once it ran (#126).
- `IUINotifier.NotifyUserAsync` sends a system notification to a user's pages, decided per browser across every route: the pages
  on screen while one is, else one page off screen (#127). A runtime's send to all keeps the same rule, so two hidden tabs of it
  no longer both sound.
- **Breaking:** a click on a system notification with an `Address` brings the tab that showed it to that address, through its
  unsaved-work guard; a tab already there runs the `Action` (#127).
- `UIViewOptions.RailBottomBar`, on by default: off, a left side that is a rail alone stays a drawer on a phone, its rail drawn
  there as a list (#128).
- `ButtonComponent.OpensDrawer` (`SetOpensDrawer(UISide.Left)`): a page's own button for a side's drawer; the shell then draws
  none for that side, so a header collapsed on a phone leaves no band (#133). A drawer's buttons name it (`aria-controls`), and
  closing it gives the keyboard back to the button that opened it.
- An open side drawer closes when a menu entry in it is pressed, a command's as well as a link's; a group's own entry, a check and
  a popup menu's entry leave it open.
- `ShowFocusEdge` on field inputs: off, a field its container and caret already frame (a chat's composer) draws no focus edge
  (#130). **Breaking** only for a type implementing `IFieldInputComponent` itself.
- `OnEscape` on text inputs and text areas: Escape cancels — the field goes back to its last committed value and leaves, then the
  command runs (#135).
- An avatar image input on a touch screen wears a light veil with the pencil centred, not a corner mark on the face (#131).
- An overlay over a list keeps clear of its scrollbar with `VerticalScroll = Always`, now documented (#129).
- **Breaking:** `BorderThickness` and `BorderRadius` (`IBorderedComponent`) are responsive, `UIResponsive<UIThickness>?` and
  `UIResponsive<UICornerRadius>?`, so a frame can run edge to edge on a phone:
  `SetBorderThickness(UIThickness.Uniform(0), md: UIThickness.Uniform(1))`. Plain values still set and bind as before (#132).
- **Breaking:** Surface, Card, Expander, the key-value list, the table and the tree register no default `BorderThickness`; the
  stylesheet draws the same edge, and reading the property on a new one gives `null`.
- A negative `BorderRadius` is refused when the view compiles, at every breakpoint, as a negative `BorderThickness` already was.
- An accordion's sections share one edge between them, as intended: a default thickness on every section drew both.
- **Breaking:** a placement's tier variables use the common suffix naming, `--ui-placement-column-md` (was
  `--ui-placement-md-column`), and so do row and the spans; they are reset and fenced like every responsive value, and
  `.ui-responsive-reset-infix` is gone.
- **Breaking:** `ImageComponent.CornerRadius` is `UIResponsive<UICornerRadius>?`, written as `--ui-border-radius` tiers; a circle
  shape wins over it without `!important`.
- **Breaking:** `WebDomConverters`' per-tier converter constants are `WebResponsiveConverters` families.
- `UIResponsive<T>.Get`/`Resolve`, `ResponsiveRenderer.ApplyResponsiveRadius`, `WebResponsiveCss.TierName` and the size, padding
  and placement variable constants; the Less mixins `.ui-responsive-chain`, `.ui-responsive-layout-reset`, `.ui-responsive-bands`,
  `.ui-placement-span`, `.ui-placement-span-basis`.
- A page attaching again on its own connection (a full resync, a lost staged value) in another on-screen state no longer leaves
  its runtime counted on screen (`HasVisibleViewers`, `UIViewers.Visible`, `OnVisibilityChangedAsync`).
- **Breaking:** a `ShowSystemNotificationEffect` with `When = Always` sent to all of a runtime's pages reaches one page — the first
  on screen, else one off screen — as `NotifyUserAsync` does; it sounded once per tab.
- `UIContext.SendEffectsAsync` sends through the runtime, so a `NavigateEffect` pushed outside a command carries the page's
  unsaved-work state ahead of it. **Breaking:** an implementer of `IUIRuntimeAccess` adds `SendEffectsToAsync(pages, effects)`.
- `OnNotificationPermissionChangedAsync` runs as posted work, as `OnVisibilityChangedAsync` does: a page's report never waits for a
  command's turn.
- A toast raised while the page is off screen waits until it is shown, its time starting there.
- The notification service worker opens only an address the page's own route check accepts (`/\host` and control characters
  refused).
