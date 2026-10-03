# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.5.0

What a review of 1.4.1 asked for (GitHub issues #75–#94).

### Breaking

- **The hub never issues a session** (#77): an attach whose cookie names no session the store holds (none, unknown, expired, an
  in-memory store after a restart) gets a reload, and the page load writes the cookie. A browser keeping no cookie, or a
  cross-site frame, can no longer run a page with a controller: it reloads once and stops.
- **A connection attaches to one page** (#77): a second `AttachAsync` for another page or window is refused; attaching again to its
  own page (the client's full resync) still works.
- **Hub calls are budgeted per connection** (#77): `WebHubOptions.MaxCallsPerSecond` (100) and `MaxCallBurst` (400), about three
  times the busiest page measured; raise them for a busier one. A call past the budget fails alone; the connection stays open.
- **A `Background` command runs at most `[UICommand(MaxConcurrent = n)]` times at once per runtime, once by default** (#77), held
  on the server; set it where parallel runs are meant. A run past it is refused with "That is already running."
  (`UIStrings.CommandBusy`, `ErrorHandling.CommandBusyMessage`, `UICommandBusyException`). `IUICommandMetadata` gains
  `MaxConcurrent`.
- **An item travels without its nulls and empty collections**, at any depth, over the page and the hub, and a value update or an
  item change or move leaves out a null `value`, `index`, `key`, `oldKey` or `item` (#79). Read a missing property as null, or
  through `rows.readPath`, which now answers null for it (undefined only where a step cannot be taken); on the server a dictionary
  item reads a missing key as null.
- **A row carries only what its host reads off it** (#79): its templates' bindings (a nested row's `Parent`-scoped ones too),
  `FilterBy`/`SortBy` and query, template key, key, `Group`, `IsContent` and abilities, less a value that reads the same as an
  absent key; a nested list nothing of the row reads goes to its own host only. A package reading past its templates
  (`rows.itemOf`, `rows.readPath`) declares `ReadsWholeItems()` or `AddItemReads("Path.Inner")`; a chart, a layered graph and a
  host with no row template get theirs whole. In development, a read of a property not sent warns with the host and the path.
- **`--ui-color-border` no longer reaches a field's or a toggle's edge, a range's track or a drop edge** (#75): set `Mark` on the
  palette instead. A key-value list's unset editor is now Tonal (the look it had); set `Filled` for the line.
- **An attach that finds a runtime built since the page attached reloads the page**, once, rather than laying the new state over it
  (#78) — after an eviction, the end of its retention, a restart under a store that kept the session, or a rebuild by another
  `PerClient` tab; what was typed meanwhile is not sent. A page's first attach never counts.
- **`IUIClientEndpoint` and `IUIRuntime` gain `NavigateInPlaceAsync`** (#82); an implementation adds it. The hub's
  `NavigateInPlaceAsync` counts against the call budget.
- **`UICommandRequest.EventId` is no longer `required`** (#83): a request names an event or an offered action
  (`UICommandRequest.Action`), never both.
- **The view compiler refuses a chord** (#81) that names no key; one claimed twice page-wide on a view where a control's or the
  view's own is among the claims (two menus' entries of one chord pass); one on a control in an item template; and one the browser
  never hands a page (Ctrl+N, Ctrl+T, Ctrl+W and their Shift forms, Ctrl+Tab, Ctrl+PageUp/PageDown, Ctrl+F4, Ctrl+Q, Alt+F4 — ⌘
  on a Mac).
- **`MenuItemComponent.Shortcut` moved to `ButtonComponent`** (#81), name and binding unchanged; `WebAttributes.MenuShortcut`
  (`data-ui-menu-shortcut`) is now `WebAttributes.Shortcut` (`data-ui-shortcut`), and the client writes an entry's chord text.
- **The server holds every slider to its `Step`**, counted from `Min` (#87): a value off it — only a stale or forged write, as the
  page always lands on the step — is refused and answered with the server's value. A number input's step stays a hint.
- **A pager the view cannot drive is refused when the view compiles** (#86): aimed at nothing, at a component the view lacks, at a
  host holding its rows whole or at a window that scrolls, or with a page size of no rows.
- **`UIPage.Header` below the medium breakpoint is the phone's band** (#94; from the small breakpoint the title stood in the display
  role beside the far end), and the title and the line are each there twice, one shown either side of the medium breakpoint.
- **Enter on the keyboard's row runs its click and then its open; Space, where the host chooses nothing, runs the click** (#92),
  after the selection, as a click does. A tree's node likewise with `OnNodeClick…`; Right and Left still fold.
- **A column's resize handle, a movable caption, the rows' host and a table's scrolling box are no Tab stops** (#92), and a control
  in a part of a row that answers its own press (`data-ui-no-row-open`) is neither the row's one control nor a stop of its own.
- **A table whose rows are pressed is a `grid` of `gridcell`s to a screen reader, and an items view of pressed rows with no control
  a `listbox` of `option`s** (#92). `TableComponentRenderer.CellRole` is an instance method; a table always a grid overrides the
  new virtual `ActsAsGrid` (**New:** `ItemsCollectionRendererBase.RowsAct`).
- **The session cookie is `ne.ui.session.<application name>`**, so two applications on one host no longer sign each other out;
  `UISessionOptions.ClientKey` names it outright. A signed-in reader signs in once more after the upgrade.
- **A value past its field's `Min` or `Max` stays as typed and is refused in words, never corrected**: "At most 10.", "Not after
  30.09.2026." (`UIStrings.ValueAtMost`, `ValueAtLeast`, `ValueNotAfter`, `ValueNotBefore`). It is not sent and stops its form's
  submit; a step still stops at the bound, and the server still refuses a value past it.
- **An open key-value row shows its field's message as a line under the field**, as a form does (`UIValidationPresentation.Auto`),
  not a corner mark over the row above; only the rows below move. Closed, it keeps its dot; `ValidationInto` still sends the words
  elsewhere.
- **DataGrid: a value an error rule or a bound refuses keeps its cell's editor open**, unsent; an error rule's value used to commit.

### New

- **`UIPersistenceOptions.MaxRuntimesTotal`** (4 096; `null` or `0` for none) caps the runtimes all sessions hold together (#77):
  the one longest without a page goes first, from any session; when every one is in use the new one is refused and a warning logged.
- **Row projection** (#79): `ReadsWholeItems()`, `AddItemReads(path)` (`IItemsComponent.ItemReads`, `UIItemReads`),
  `CompiledView.ItemProjections` (`UIItemProjection`), `ServerCollectionItemChange.Projection`, `WebRenderItemValue.Projection`,
  `ServerItemJsonConverter.WriteItem`.
- **The attach of the page whose render prepared its runtime is sent only what moved since** (#79): the page presents the render's
  `sequence` (`IUIRuntime.BuildRenderSnapshotAsync`, `UIRenderSnapshot`, a `BuildAttachChangesAsync` overload taking `since`). A
  reconnect, a second tab or a reload of a kept runtime still gets the whole page.
- **`UIColorPalette.Mark`** (`--ui-color-mark`, `UIThemeColor.Mark`, #75): the text at the least opacity that reads 3:1 on the
  page, a card and a raised card — derived for each palette, an application's own included, or set outright.
- **`UIInputAppearance.Tonal`, the fill alone** (#75): the old Filled look, for a field something else frames (a card, a row,
  separators), a lone field beside its own button, a short form on a centred card, editing in place. Filled stays the default.
- **A dropped connection says so** (#78): a reconnect past 2 s sets `data-ui-connection="reconnecting"` on the document element and
  shows a quiet "Reconnecting…" (`UIStrings.ConnectionReconnecting`), both gone when it is back; given up, the attribute reads
  `lost` and the "lost — Reload" notice takes over. A blip shows nothing. `RuntimeResolution.RuntimeId`.
- **The shell's regions are landmarks** (#76): header `banner`, content `main`, footer `contentinfo`, a side `navigation` where it
  holds a menu alone (plain boxes too), else `complementary` — `UIViewOptions.LeftSideLandmark`/`RightSideLandmark`
  (`UISideLandmark`: `Auto`, `Navigation`, `Complementary`) override it. The root form is no landmark (`role="none"`).
- **"Skip to content"** (#76, `UIStrings.SkipToContent`) opens a page with a left side: out of sight until Tab reaches it, then a
  chip at the top-left corner; Enter puts the keyboard on the content, and the address keeps no `#`. A tap never shows it.
- **`AnnounceEffect(message, AnnouncePoliteness)`** (#76): "12 results", "Saved" said to a screen reader and shown to nobody,
  politely or at once, from a command or an interaction; its words translate as a notification's do.
- **Topics** (#84): `UIContext.Subscribe(topic)`/`Unsubscribe(topic)`; a runtime leaves every topic it took when it goes.
  `IUIBroadcast` (registered by the startup, in-process like `IUISessions`): `PostAsync(topic, action)` and
  `PostToUserAsync(userId, action)` run the action on each runtime as `IUIRuntimeAccess.Post` does — queued, under its lock, in
  posting order, a topic's runtimes in one order — and return how many; viewers only unless `viewersOnly: false`, never one
  starting. The `<TController>` overloads type the controller and skip (and leave out of the count) runtimes of another.
- **A page's state can live in its address** (#82): `ReplaceAddressEffect(parameters)` rewrites the query in place,
  `PushAddressEffect(parameters)` as a history entry — no reload, no new runtime, no leave guard — and a reload or a link arrives
  with it for `OnNavigatedAsync`. Back or Forward within the route runs `OnNavigatedAsync` on the same runtime, without the view
  filters; to another route, or across a parameter the route keys its runtime by (`Identity`), it loads the page. Under
  `PerClient` the state is every tab's, each keeping its own address. A session's end signs in with the address the page attached
  with.
- **A toast can carry the way back: "Message deleted — Undo"** (#83): `ShowNotificationEffect.Action`
  (`UINotificationAction(label, command, argument)`, label translated) and `Duration` (8 s with an action, 5 s without; a hover or
  the keyboard holds it). The command must be the controller's, taking the one argument, or the toast shows without its button and
  the misuse is logged; the page holds only an id, and a press runs the command once as a button would (filters, authorization,
  `MaxConcurrent`). Closing raises no command: making it final is the controller's (a soft delete).
  `IUICommandMetadata.Parameters`, `IUIReferenceResolver.OfferCommand`.
- **Key chords** (#81): `Shortcut`/`SetShortcut("Ctrl+S")` on every button (`IButtonComponent`: a button, an action, a split
  button, a menu entry, a tab caption), pressed from anywhere on the page and written after its tooltip's words, "Save (Ctrl+S)",
  and at a menu entry's end, in the platform's form (`⇧⌘S`). `UIViewBase.CreateShortcuts()` → `UIShortcut(chord, command,
  arguments)` or `UIShortcut(chord, effect)` (`IUIView.Shortcuts`), the effect run on the page (`/` → `FocusEffect(searchId)`).
- **A context menu's entry with a `Shortcut` acts** (#81) on the row under the list's keyboard cursor, else its chosen row. One
  registry for all chords: a modified chord fires inside a field unless the field takes it (what was typed is sent first), an
  unmodified key typed in a field is the field's, an open modal keeps the rest out, a chord claimed twice fires neither.
- **`NE.Standard.UI.Testing`: an application tests its pages without a browser** (#85). `UITestApp.Create<TStartup>()` builds it
  from its startup with no platform and the scheduler parked; `OpenAsync("/sign-up", session => session.SignIn("robin", roles:
  ["admin"]))` resolves, attaches and starts a page through the host's real path, a refusal landing where a browser's would
  (`UITestPage.Route`, `Address`). Find a component by id, bound path or accessible name; read its value, visibility, enabled
  state and message as the client shows them; write, press, raise an event, choose a row, press a toast's action — a submit is
  refused while a field is in error. `FlushAsync()` (a `Batch` runtime's flush), `Effects`, `EffectsOf<T>()`, `IsDialogOpen`,
  `Downloads`, `Controller<T>()`. No test framework needed; its README and *Testing an application* list what it does not model.
- **A message that stays until it is no longer true** (#88): `UIMessage.Info/Success/Warning/Danger(title, body, action,
  dismissible)` and `UIMessage.Create(severity, …, icon)` in `NE.Standard.UI.Extensions` — a Tinted surface in the severity's
  colour with the framework's mark, a title and/or a body (components in an overload), an optional action at the bottom end (beside
  the words from the medium breakpoint) and an optional × at the top end that hides it in the browser
  (`UIStrings.MessageDismiss`); text and marks read 4.5:1 and 3:1 in both themes. `UIPage.Banner(message)` lays one across the
  top of the content.
- **`SurfaceComponent.LiveRegion`** (`UILiveRegion.Status`, `Alert`, #88): a surface or a card read out when shown and as its
  words change; a message is a status for Info and Success, an alert for Warning and Danger. A clickable surface keeps its role.
- **A slider can pick a band, "from 20 to 80"** (#87): `SliderComponent.IsRange`, `EndValue` (`SetEndValue`, `BindEndValue`,
  two-way) and `MinDistance` (bindable), through `IPeriodInputComponent`; the setters and the server refuse an end below the start,
  nearer than the distance or outside `Min`/`Max`. Two handles, the band between them in the primary; a press moves the nearer, a
  drag cannot pass the other, the release sends. Each handle is a slider to a screen reader ("From", "To":
  `UIStrings.SliderFrom`/`SliderTo`) taking the arrows, Page Up/Down, Home and End; `ShowValue` writes "20 – 80"; a swipe across
  the track still scrolls a phone. `IPeriodInputComponent.MinDistanceProperty`, `WebAttributes.SliderMinDistance`,
  `WebAttributes.ValueEnd`.
- **A list or a table can be paged: "21–40 of 812"** (#86). `PagerComponent`, aimed at an items view or a table by id
  (`SetTarget("results")`), turns its page through the host's window request: `UIPagerMode.Full` (pages by number, with an
  ellipsis) or `Compact` (the rows on show), compact on a phone; `PageSizes` offers a size, kept in the browser under the list's id.
  A `nav` "Pages", `aria-current="page"`, one Tab stop the arrows walk; Page Up and Page Down turn a paged host's page and keep the
  keyboard's row in place. Words in new `UIStrings.Pager*`. `Paging` (`IItemsHostComponent.Paging`, `SetPaging(true)`) on every
  items host makes its window a page.
- **A multi-select takes the reader's own tags** (#90): `MultiSelectComponent.AllowFreeText` (authoring-only) — Enter or a comma
  makes a chip, a pasted "a, b, c" three, Backspace on an empty entry takes the last; the options are suggestions, and a tag
  naming one is that option. `TagEntry` (`UITagEntry`): `TypedText` (default) or `FirstSuggestion`, where Enter takes the first
  suggestion the text names (Escape takes its mark off).
- **`UIComparisonOperator.RegexEach`** (`RegexEach(pattern, message)`, #90): a rule each item of a list value must match. A tag it
  refuses, or one past `MaxSelected` ("No more than {max}.", `UIStrings.SelectFull`), stays in the entry, said on its line.
- **`TextInputComponent.InputMode`** (`UIInputMode`, #90) writes `inputmode` apart from `Type`: with `UIAutocomplete.OneTimeCode` a
  code stays text, its leading zeros kept, and gets the digit keyboard.
- **`ItemsViewComponent.LoadingLook`** (`UIItemsLoadingLook`, authoring-only, #90): `Skeleton`, the default, or `Indicator` for
  rows unlike each other — no rows stand in, and a small ring stands at the edge the next ones come in at, moving none.
- **Plugin surface** (contract version unchanged): `validation.judge(componentId, value)` judges a value by a component's rules
  showing nothing, `validation.refuses(field)` judges a field as a submit would, `names.validationMessage`,
  `shortcuts.words(chord)`, `PopupOptions.boundary` and `surface` (`gap` now optional); glyphs `UIGlyphs.Bold`, `Italic`,
  `Strikethrough`, `Heading`, `ListBulleted`; Less `.ui-icon-bar-surface()`, `.ui-icon-bar-button()`, `.ui-icon-bar-glyph()`,
  `.ui-keyboard-frame()`, `@ui-list-keyboard`, `.ui-field-narrow-inset()`, `--ui-field-inset`, `@ui-glyph-md-lg`, `@ui-glyph-xl`.

### Changed

- **A list-heavy page weighs a fraction of what it did** (#79): the chat demo's page went from 2.2 MB to 29 KB, its first attach
  to 0.1 KB. The socket stays uncompressed: user text beside secrets in one compressed stream is what BREACH reads.
- **What says "a control is there" reads 3:1 against the page** (WCAG 1.4.11, #75), drawn in `Mark`: a Filled field's line on
  square bottom corners, Outline's border, Underline's rule, unchecked rings, an off switch's knob, a range's track, a picture's
  dashed drop edge. Ghost and a disabled control are exempt. Under `prefers-contrast: more` every border is drawn in the mark.
- **A Filled field's focus, open list and message colour its bottom line alone**, the focus doubling it inward, with no height
  change; its sides keep the pointer's faint edge through the focus and under a message. Tonal and Outline keep their ring.
- **A warning and an info colour the field's edge as an error does**, in every appearance and through a focus; a message's edge
  and words take the severity's ink, not its fill.
- **The light theme's warning ink is a golden brown** (`UIThemeDefaults.LightPalette.WarningInk`, 138, 90, 0), still 4.5:1.
- **The shell's regions stand in the page in reading order** (#76): header, left side, content, right side, footer. Nothing moves
  on screen; in a view with a footer or a right side the components' ids shift once.
- **`UIPage.Header` keeps its far end on the title's row on a phone** (#94): the title wraps under itself, level with the far end
  and the drawer toggle, the line cut to one. Pass a phone's two or three far-end controls as they are, not in a wrapping stack.
- **A windowed items view draws unfetched rows as grey bars** in the rows' shape (#90), shimmering while it reads (still under
  reduced motion), three after the last row of a source that cannot count; it is `aria-busy` meanwhile. Tables and the grid keep
  their blank rows.
- **Page Up and Page Down walk an items view's and a table's rows** a viewport at a time, and a row scrolled to clears a sticky
  header or footer (#92).
- **Up from a table's first row reaches its header** (#92): Left and Right walk the captions, Home and End go to the ends, Shift
  with Left or Right sizes the column, Down goes back; a focused caption wears the keyboard's wash.
- **A windowed or virtualized table says where each drawn row stands** (`aria-rowindex`, `aria-rowcount`) (#92).
- **The keyboard's place wears a frame in the brand's ink, at once**, in every list — a host's row over its wash, a menu entry
  (on the page, in a popup or a context menu), the "…" and language lists, the calendar's cells, a select's current option, a
  chip, a slider's handle, an action bar's button — a chosen entry included. The pointer's wash alone still fades.
- **A multi-select's chips are reached from the keyboard** (#90): ArrowLeft from the field walks onto them, the arrows along them,
  and Delete or Backspace takes one out.
- **An interaction that hides what holds the focus hands it on** to the next control (else the one before, else the content), not
  to the page's body (#88).
- **A reload after a changed rule reads the window at the size the page last asked for** (#86), not the host's `WindowSize`; a
  paged host's first paint at a later page shows from its first row.
- **An action bar's icons show no tooltips**, a popup on a popup; `aria-label` still names each.
- **Every icon stands on whole pixels, in the middle of its box**: 16, 18 and 24 px for a small, medium and large icon button, 18
  for the theme switcher, the same steps for a field's picture icon.
- **Every popup stands 4 px off what it opens from, and a submenu level with its entry**; inside a bar or a menu the gap is kept
  off that bar or menu, on whichever side the popup flips to.
- **A context menu near a window's edge opens away from it**, as a native one does: up from the pointer or a long-pressing finger,
  leftward with no room to the right, never over the pointer.
- **A validation mark's tooltip carries its severity** in a straight bar of its ink down its leading edge; a closed key-value row's
  dot shows its words to its right, beside the value. Under forced colours the dot is drawn in the text's colour.
- **A key-value row's rules judge the value it shows** — at load, as it opens and once it closes: a saved value's warning stays on
  the closed row's dot and in its next open, a cancel judges the value restored, `Required` marks an empty row, and what the rules
  said of a draft goes with it.
- **An error in an open key-value row stops its save**, as one stops a form's submit: ✓ and Enter do not save and the focus goes
  back to the field; a warning or an info lets it through, and the controller's own message gates nothing. Enter leaves the field
  first, so a rule judged on leaving has judged the draft.
- **A closed key-value row's message shows from anywhere on its value** — a hover, or a tap on a phone — a link inside keeping
  its own press; the words go with the pointer, and a press keeps them until the next press.
- **The controllers guide has data access take an `IDbContextFactory<T>` and a context per command** (#80): `Context.Services`
  is one scope for the page's life, used at once by background commands. `UICommandConcurrencyMode.Exclusive`'s summary says one
  exclusive command of the runtime at a time, whichever it is.

### Fixed

- **One socket can no longer fill the server's memory** (#77): every attach without a cookie made a session and a runtime.
- **A row inserted and given its nested items in one round draws them once** (#93): a list sent whole takes none of that round's
  later changes, in whatever order the row and its items were filled.
- **A filter or a copy reading a period's `EndValue` hears its own field**, not the start's edit too (#87).
- **A `Blur` rule on a select, a search or a multi-select reads the component's value**, a free-text draft included; a `Required`
  one refused a field with a value chosen (#90).
- **A grid with a column chooser reads and writes its chosen rows on its rows' host**, not on the chooser menu's.
- **On a phone the toasts stand above the page's bottom bar**, not over it and their own action.
- **A blurred background picture has no sharp rim** under the surface's border.
- **A button group's icon-only segment is square**, as an icon button is.
- **An emptied number, date or time field is no value**, which an optional one takes, not a format error; a refusal no longer
  outlives its value.
- **A field commits a value once**: the browser's `change` after a debounced pause, Enter or clear no longer sends it again and
  reruns `OnChange`, which redrew a filter's list under the press and lost its click.
- **A list cleared and filled again keeps the rows it still holds**, the keyboard's row with them.
- **A message the server rendered is weighed with the rules, not written over**, and one judged before the page took its words
  table shows its words, not its key.
- **A submit refused for a rule that failed before the reader touched the field shows that field's message.**
- **A click on a list's row no longer blinks the row the keyboard last stood on.**
- **An action bar holds a finger's press for a double tap's time**, so the second tap no longer presses the icon under it.
- **Typing into an open key-value row keeps what was typed**: a change in the row no longer selects the field's text again.
- **A cancelled key-value draft is not sent**: Escape and ✗ no longer send it, a number's draft no longer returns in the closed row
  and its next open, and closing a row no longer sends its emptied field.
- **A value's text stays where it was as it becomes its editor**, in every appearance and size; a host short of room narrows it.
- **A tooltip with no link in it takes no press**, so the control under it can still be pressed.
- **A stepper's arrows stand in the middle of their field.**
- **A rename field's words stand where the title's stood**, at any zoom; a centred title's field is centred, and a long name opens
  at its start.

### Add-ons

Each keeps its own notes beside its sources.

- **DataGrid** — the framework's pager (**Breaking:** its own is gone), one Tab stop walked by rows, rows sent whole, closed cells
  judged by their editors' rules, `configureEditor` on typed columns.
- **Graph** — rename by double click or F2, a chosen node glows, conflict and target marked on the node's edge, Tonal fields.
- **CodeInput** — a Markdown field's format bar; Tonal find-panel fields.
- **Charts**, **Icons** — built on this release.

### Demo

- A chat message appears on every other open chat page; *Reaching other pages* waves to every copy of itself and notifies every
  page of the signed-in account (#84).
- The Catalogue keeps its filters, sort and "Up to €/mo" price band in the address (`?min=20&max=80`); the Inbox its open message,
  which Back closes (on a phone too); the Commands page shows both address effects (#82, #87).
- The chat's message Delete and the Files screen's tab Close have an Undo in the toast; the notification page cancels the next
  deploy with eight seconds to take it back (#83).
- Notes saves on Ctrl+S, the Inbox goes to its search on `/`, the chat's message menu answers P, E, Delete, R and C; the split
  button's "New → Server" moved from Ctrl+N, which no page can take, to Alt+N (#81).
- New or extended pages: Message, *Pager*, the slider's band, typed labels, `InputMode`, a table whose rows open on a press;
  *Large lists* pages and keeps its page in the address, its source answering a beat late so the skeleton shows; the chat's
  conversation wears the loading indicator.
- Every demo heads its pages with `UIPage.Header` (#94) and draws its focus ring in its brand's teal (`ConfigureTheme`).
- The Mechanisms pages are one behaviour to a section, with the view's and the controller's code; the Values page leads with rules
  judged in the browser, keeping `BindValidation` for a verdict only the server can give.
- The Screens section has a glyph of its own, and the Files screen fits the content's height from the medium width up (#91).
