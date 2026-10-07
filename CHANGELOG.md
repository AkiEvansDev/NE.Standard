# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.7.0

- **A notification reaches a reader who is not looking at the page** (#107): `ShowSystemNotificationEffect` shows the operating
  system's notification while the page is off screen and its toast while it is on screen (`When`, `Fallback`); a click brings the
  page forward and runs its `Action`. `AddSystemNotifications()` serves the framework's service worker, which a phone's browser
  needs, and `WebEndpointOptions.Manifest` a web app manifest, which an iPhone needs. One replacing another of its `Tag` is shown
  again, not swapped in silently. A toast takes a title over its message.
- **A page tells its runtime whether it is on screen, and what the browser lets it notify** (#107): `HasVisibleViewers` beside
  `HasViewers`, `UIContext.NotificationPermission` and `OnNotificationPermissionChangedAsync`, and `RequestNotificationPermissionEffect`
  to ask, raised in the reader's press. **Breaking:** `IUIBroadcast.PostAsync`/`PostToUserAsync` take `UIViewers` (`All`,
  `Connected` by default, `Visible`) in place of `bool viewersOnly`; `viewersOnly: false` is `UIViewers.All`. The test package's
  page goes off screen and back (`HideAsync`, `ShowAsync`) and reports a permission; a session sets its browser's
  (`WithNotificationPermission`).

- **An attach and a session the page stored wait for a command too.** `OnNavigatedAsync` and `OnAttachedAsync` on an attach — a
  reload while the old connection's command still runs, another tab under `PerClient` — and the hooks of a language or theme the page
  switched ran beside an exclusive command's body; they now run between exclusive commands, as posted work has since 1.6.1. A back or
  forward, which runs in a command's turn, is unchanged.
- **Posted work and lifecycle hooks run outside the runtime's lock, as a command's body does** (#109). A `Post`, a broadcast,
  `OnAttachedAsync`, `OnNavigatedAsync` or `OnDetachedAsync` that awaited `Context.Runtime.InvokeAsync` on its own runtime deadlocked
  it for good; it now works as it does inside a command. Like a command, they still hold the command's turn, and a value, a
  `Background` command or an outside `InvokeAsync` can land beside them.
- **One runtime held long no longer stops every other runtime's flush** (#108). A flush pass waits for a runtime at most one
  interval; a slower one finishes on its own.
- **An item source's window is guarded against a read applied beside `Append`/`Prepend`/`Remove`/`Invalidate`** (#110), and an
  appended key the window already holds — a read brought it first — replaces that row instead of throwing "Duplicate recursive item id".
- **A session's end is finished whatever fails** (#111): its other tabs are sent away before its files are removed, on no caller's
  token, so a closed tab or a throwing file store no longer leaves them open; the idle sweep ends every session it removed when one
  fails; a runtime whose initialization failed no longer reports a posted detach to its handler a second time; a session ended
  while it signs out is not brought back by the move to memory.
- **A row's abilities are refused on the server** (#117): a move, removal or rename, a renamed title, a tree node's new folder,
  and a choice of a row its template or its own item refuses — a Root-bound ability included — as #7 refuses a closed component.
  A table's and a tree's choice is checked now too; a drop is the command's to check.
- **A tab's drag and pin tell the server where the tab goes, and the server writes the orders** (#117): a drop raises the tab's
  `move` with its place, as a row's, and a pin `tab-pin`, the framework's own commands (`UIBuiltInCommands`), so a tab its item or
  template may not drag is refused like any row and goes back to its place. **Breaking:** a page's own write of a tab's `Order` is
  refused; the orders still land on the item through the template's two-way binding.
- **A row template's value bound at the root reaches its first paint** (#117): a Root-bound ability on a nested list's template
  was painted only after the attach.
- **A text field's `MaxLength` is held on the server** (#113): a longer value is answered with the server's, save one shortening
  a value the controller set longer.
- **The server's large values have an allowance of their own** (#113): `WebValueOptions.MaxOutgoingStagedBytesPerSession` (32 MB)
  and `MaxOutgoingStagedBytesTotal` (256 MB); a value past them travels inline. A re-attach releases what the connection's last
  attach staged, and each tab's read of a staged value is its own.
- **Every upload and staged value costs a fixed kilobyte plus its name against its allowance** (#114), so empty files and 1-byte
  values are no longer free; expiry no longer scans the store, and the default file store is indexed by session.
- **Under `IdentitySource = Claims`, `/_ne/files`, `/_ne/values` and `/_ne/content` see the host's sign-out at once** (#115).
- **Back/Forward within a route runs the view filters with the entry's parameters** (#116), in the `Attach` phase, and loads the
  address when they refuse. New, off by default: `UISecurityOptions.RecheckRouteOnActivity` re-checks the route's rules against the
  store on value writes and window reads, once per `TouchResolution`.
- **The default error page no longer shows a `?message=` from its address** (#118) unless `IncludeExceptionDetail` is on.
- **A toast's Undo refused as busy, or whose wait was cancelled, can be pressed again within its window** (#112): the offer is
  spent only once its run is admitted, the toast stays until the server takes a press, and two presses still run it once. New:
  `UICommandExecutionResult.Refused` tells a command the server turned away before it ran from one that ran and failed.
  `UICommandExecutionResult` is a record now, so a copy made `with` one part replaced carries every other.
- **Values given together no longer close the connection** (#119): a change set stays under 24 KB, the rest following in the
  next, and a command given after them waits for the last. A value the server closed the connection over twice is dropped rather
  than resent in a loop.
- **A value typed during a reconnect survives a re-attach that fails once** (#120): calls wait for the retry instead of failing,
  and fail only once the page gives the connection up.
- **A reload the guard gave up on shows the lost-connection notice with its Reload** (#121), and the gate stays shut on a
  `reload` answer as on `fresh`. A pushed command result that throws no longer leaves its button "already pending", and a
  re-attach no longer asks an empty windowed list for its first rows twice.
- **On a phone the connection notices stand at the bottom** whatever corner the view asked for. A page not on https (localhost
  aside) reports its notification permission `Unsupported`, not the `Denied` Chromium names it there. A tabs view's caption takes
  the press wave as a whole, not on its label alone, and a split button's part its own, not the whole pill over one part's wash.
  A checkbox, a switch and a radio answer a hover and a press on their box, as nothing did before.
- **Removed tab strips and command bars are let go by their `ResizeObserver`, and an image input's preview URLs are revoked once
  the input is gone** (#122).
- **A wrapped tab's template `CanDrag`/`CanRename` is honoured by the tab strip** (#123).
