# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.14.0

A round of rules moved into the framework — what one component or preset had, its family now has from one contract — and of the
framework on real networks: reconnects, lost input, limits and caching.

- **Breaking:** a family's shared property comes from one contract, so the property, its key and its renderer helper are the same
  on every member: `IAccessibleNameComponent` on every input, surface, card and file tile; `ILinkableComponent` (`Url`) on menu
  items, breadcrumb items, links and file tiles; `ISelectedKeyComponent` (`SelectedKey`) on button groups, tabs and tabs views;
  `IDraggableItemsComponent`/`IItemsHostAbilitiesComponent` (`Draggable`, `Renamable`, `Removable`) on trees, tabs views, lists and
  tables; `IFileAcceptComponent`/`IFilePickerInputComponent` on file and image inputs; `IDebounceInputComponent`,
  `IMaxFileSizeComponent` and `ITextLengthComponent` with static keys; `ICalendarComponent` (`FirstDayOfWeek`, `MarkedDays`) on
  date, date-time and calendar. Names and registered keys stay; code reading a static key reads it off its contract
  (`ISelectedKeyComponent.SelectedKeyProperty`, `IDraggableItemsComponent.DraggableProperty`). `TimeInputComponent.FirstDayOfWeek`
  is gone. Sweep tests fail on a member that declares one of these by hand.
- **Breaking:** link rules reach every link: a menu entry or a breadcrumb step with a written or controller-bound `Url` and a click
  command of its own, a `LinkComponent` with a click command, or one with a control in its context menu is refused at compile (the
  press raced the navigation). A click beside an address stays allowed for the host's `OnItemClick` and for an address bound per
  entry (Relative).
- **Breaking:** a thing with no caption beside a titled field stands level with the field's box on its own, in any row that runs
  across (a horizontal stack, a grid row), per breakpoint — not only inside the presets. Only a control (input, button, switcher,
  button group, a panel of controls) moves, only beside a sibling that is itself a field with a caption row; an authored `Margin`,
  `Padding`, `AlignWithFieldBoxes = None` or a `FirstLineOnControl` panel opts out; a wrapping panel of your own implies nothing
  (`UILayout.Row` still aligns, as in 1.13). `AlignWithFieldBoxes` moved to `IVisualComponent`; the `ui-stack-panel--field-aligned`
  class is `ui-field-aligned`.
- **Breaking:** layout values are responsive: `Orientation`, `HorizontalAlignment`/`VerticalAlignment`, the button, input,
  switcher, button group and menu rail `Size`, `ItemsViewComponent.LayoutType`, `StackPanel.FirstLineOnControl` and grid tracks
  (`SetColumn`/`SetRow`/`AddRow(unit, sm:, md:, xl:, xxl:)`) take a value per breakpoint; their property types are
  `UIResponsive<…>` (a plain value still converts). A splitter or a pane container over values that change by width is refused.
- **Breaking:** one empty-state mechanism: `ConfigureDefaultEmptyTemplate` is an extension in
  `NE.Standard.UI.Components.BuiltIns.Templates` and puts the built-in template in on any items host that has none;
  `ShowEmptyTemplate = false` marks the root `data-ui-no-empty` (the `ui-<host>--no-empty` classes are gone). Every list host —
  menu, key-value list, radio group and tabs view now too — centres a fill empty state across its whole width.
- **Breaking:** one clear button: `IClearableInputComponent` (`ShowClearButton`; `SetShowClearButton()` is an extension) on text,
  number, date, date-time, select, search and multi-select; one mark (`data-ui-clearable`, replacing `ui-select--clearable` and
  `data-ui-clear-shown`) and one stylesheet rule, `.ui-field-clear-host()`, on the plugin surface. A disabled select no longer
  shows its clear. A clear asked of a date input that edits a period is a compile advisory.
- **Breaking:** client values are bounded: `WebValueOptions.MaxValueSize` defaults to 4 MB (was 16 MB); a list or document past
  `UISecurityOptions.MaxClientValueElements` (100 000) or `MaxClientValueDepth` (32) is refused as unreadable, and the hub counts
  while it reads, so such a value is never built; staged command keys are held to the same count.
- **Breaking:** `UISecurityOptions.RecheckRouteOnActivity` is on by default (a rule check on activity, never a store read), so a
  revoked right stops value writes too.
- **Breaking:** a `Background` command lives on its tab's stay on the runtime, not on its connection: a dropped connection no longer
  cancels it, and the page attaching again from the same tab is pushed its result; it is cancelled when the tab goes to another
  runtime, when the tab has been away past `DisconnectedRetention`, or when the runtime goes.
- **Breaking:** served content and uploads are always sandboxed: `WebEndpointOptions.InertContent` is replaced by
  `InlinePassiveContent`, which shows a PDF, a raster image, plain text, audio or video inline; HTML, XML, SVG and scripts stay
  attachments under a sandbox CSP.
- **Breaking:** the error page shows a failure's text only from a `UIErrorDetail` handed over in-process (with
  `IncludeExceptionDetail`); a `?message=` in the address is never shown, and `ErrorPageMessage` is no longer passed as a parameter.
- **Breaking:** a view nesting more than 256 components deep is refused at compile (about 1 800 levels used to overflow the stack
  and end the process). A queue with no byte bound counts joined change sets toward `MaxQueuedChangeSets`.
- A dropped page keeps reconnecting with jittered backoff (up to 30 s) for as long as the server keeps its runtime (the attach answer
  carries `DisconnectedRetention`), and retries at once when the browser comes online or the page becomes visible; SignalR stateful
  reconnect is on, so a short blip keeps calls, pushes and background commands. A press held more than 10 s across a drop is dropped
  and the reader is told.
- Unsaved input is carried over a forced reload (the runtime gone, a lost connection) in the tab's `sessionStorage` for 30 minutes
  and written back into its fields; passwords (marked `data-ui-secret` by what they are), one-time codes, card fields and uploads
  are never kept.
- A value re-sent after a drop, or carried over a reload, no longer silently overwrites another writer's change: the field keeps the
  reader's words, held and marked "Changed elsewhere meanwhile", and they go with the reader's next edit of it; a submit of its form
  is refused and takes the reader to the field. Words still being typed into a focused field survive the reconnect's snapshot.
- Added: `IShortcutOwnerComponent`; `ICaptionRowComponent`/`UIFieldBoxes`; `UIPage.BoundFold`, `UIPage.BoundStatus`,
  `UICard.BoundCreate` and `StatusComponent(icon, tone)`; marked days on the date-time input; `FileTileComponent.Url` (a tile links
  to its file); `ServerChangeSet.Append`; `UIPersistenceOptions.MaxQueuedChangeBytes` (8 MB) and `SendTimeout` (30 s);
  `UISessionOptions.MaxUnclaimedSessions` (100 000); metrics `ne.ui.runtimes.evicted`, `ne.ui.runtimes.refused`, `ne.ui.resyncs`,
  `ne.ui.values.refused`, `ne.ui.sessions.evicted`, `ne.ui.web.attaches` and the command outcome `cancelled`.
- Changed: the theme's stylesheet is a versioned immutable asset (`/_ne/css/ui-theme.css?v=…`), linked where its inline block was;
  the reader's own colours stay inline right after it and still change live. A runtime's pages are sent to at once, each with a
  send timeout, so one stalled tab no longer holds the others; queued sets for the same pages join, a later value replacing an
  earlier one; at the process cap a runtime no tab ever presented is evicted first, and unclaimed sessions are capped. A session
  cookie written over plain HTTP outside Development is logged once. `docs/PROJECT.md` has a Deployment section: sticky sessions, a
  shared session store, sizing, the headers to set.
- Fixed: colour and image inputs are named by their caption and carry its required state and validation; a read-only image input's
  native picker is disabled; a split button fades its label while pending; a key-value list's empty state spans the row; a tab
  strip's last quiet action and a toast's close stand their glyph on the band's edge; a popup inside something moved by
  `translate`, `scale` or `rotate` is lifted into the top layer; a table with no column paints; a progress with no reading writes no
  value; an inline style value that would end its declaration or open a comment is left out; `values.write` lands a bound value
  where a push does (on a text input's field, not its label).
