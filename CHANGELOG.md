# Changelog

The framework's changelog — the `core` slice. One section per release, headed `## X.Y.Z`; the tag that carries
it is `core/vX.Y.Z`. Every package in the slice carries the same version and goes out together, so a section
describes the release, not a list of packages that moved. Other slices keep their own, beside their sources:
`addons/Icons/CHANGELOG.md`, `addons/CodeInput/CHANGELOG.md`, `addons/DataGrid/CHANGELOG.md`, `addons/Charts/CHANGELOG.md` and
`addons/Graph/CHANGELOG.md`.

The release workflow cuts the matching section out to become the body of the GitHub release — a tag with no
section fails the release before anything is published.

## 1.0.0-rc.3

The third candidate: what building the data grid, the charts and the graph asked of the core — the plugin surface
opened, a table that scrolls sideways with columns pinned, hidden and rearranged, a tree that filters — what a page
costs to serve, and values that do not fit on the hub, with editors that keep their edits until they are saved
(`docs/VALUES.md`).

### Values and the wire

- **A value over 8 KB no longer closes the connection.** It is posted beside the hub to `/_ne/values`, parsed with the
  hub's own options and staged for the session, and the hub update carries its token; a 105 KB text used to end the
  connection with *The maximum message size of 32768B was exceeded*. `WebValueOptions` sets the largest value (16 MB)
  and how long a staged one waits. The other way too: a large value the server sends is staged under a token the
  client fetches before it applies the change set, in order.
- **A client that writes a value is not sent it back.** The update the write produces is withheld from the tab that
  wrote it when the controller holds exactly what it sent, and every other tab still receives it. A setter that
  changes the value, or a later write, still reaches the writer. `IUIRuntime.ProcessChangeSetFromUIAsync` takes the
  invoking handle.
- **An `OnSubmit` field keeps its edit.** It is held from its first keystroke, and a value the server pushes meanwhile
  is not written into it. `DiscardFormEffect(formId)` lets a command that replaces the value win, and a package's event
  submits its field's form with `registerEvent(name, { submitsForm: true })`; one that knows its own unsaved work calls
  `values.hold` and `values.release`.
- **An ordering comparison orders two texts as text.** `Greater`, `Less` and their `OrEqual` forms compared numbers alone,
  so a filter on a date — ISO text on both sides — matched nothing. Two values neither of which reads as a number now
  order ordinally, on the client and in `UIComparisonEvaluator` alike, where a `DateTime` reads as the text the wire
  writes for it; a number against a non-number is still false.
- **A value a client sent is the property's latest.** The runtime records it as the property's state, so a later push of
  the value the server held before still reaches the component rather than being taken for no change.

### Components

- **A split button says what it is called.** One with an icon and no title is named by its tooltip, as a button is, and a
  menu button that carries a title is called by it rather than by "More".
- **A date picker stays open until it is told it is finished**, as a date and time one does: choosing a day writes the value, and
  Done or a press outside closes the popup. The wheel over a clock column turns one reading a notch, stepping over the readings
  `Min`/`Max` rule out.
- **Enter in a search chooses the option the arrows marked**, in a key-value row and a grid cell too; a split button's label follows
  `TextAlignment` and reads from its start beside a description, as a button's does.
- **Components scroll together.** `ScrollGroup` names a group on any component, and every member scrolls with the one
  the reader scrolls, on the client alone. Components that mark the source lines they show are kept line against line
  (`data-ui-scroll-lines`, `data-ui-source-line`), the rest by the share scrolled; a package names the element it
  scrolls with `data-ui-scroll-viewport`.
- **The framework's scrollbar is one bar everywhere, and it is the framework's.** Naming `scrollbar-color`
  switches an engine to the standard scrollbar and makes it ignore `::-webkit-scrollbar` outright, so the rounded
  12px thumb the stylesheet described was never drawn: every bar on the page was the platform's own, arrow
  buttons and all, merely tinted. `scrollbar-width: thin` says it in the language the engine is listening to, the
  pseudo-elements moved behind `@supports` for an engine that has neither, and the shell's own scrolling regions
  are covered along with everything else.
- **`Muted` no longer mutes the muted.** It was a fraction of `currentColor`, so inside a region already painted
  muted it compounded to 46% — a key-value row's key at 2.75:1, under the 4.5:1 line — and over an accent it
  faded the accent itself to 3.01:1. It now measures from the ground the element sits on (`--ui-faint-base`),
  which a filled surface sets to its own ink; muting twice lands where muting once does, at 6.3:1.
- **Chrome that draws no words says what it is.** The theme switcher, a collapse toggle, a colour swatch and
  chip, a picker's toggle and a file field's pick button carry an `aria-label` from `UIStrings`, as the rest of
  the chrome already did. A screen reader had nothing to announce for 630 controls across the demo's pages.
- **`ButtonComponent.OnClickWithLoading` is `OnClickShowingLoading`.** `With` names an argument the command
  receives everywhere else in this API (`OnItemClickWithItem`), and nothing is passed here.
- **The core's glyphs are one set at one scale.** They were already drawn in CSS so a host need install no icon
  pack, but split across two files and sized at each call site: one chevron was written seven ways, four of them
  in `em`, so the same wedge came out 7.7px in a number input's stepper and 12px in a menu — and a mask on a
  fraction of a pixel puts every edge between device pixels, which is why the stepper's two arrows did not match
  each other. One file now holds the set and one rem scale sizes it (`@ui-glyph-xs/sm/md/lg`, 8/10/12/16px), so
  every mark lands on whole pixels.
- **A field being edited says it is wrong with its edge, not with a dot.** The mark at a field's corner sat on
  top of whatever the control keeps there — a stepper's arrows, a picker's toggle — and read as part of it. The
  edge already wears the severity's colour and the whole control speaks the message in a tooltip, so the dot is
  left to the value's own line, where it is the only thing saying a closed row has something to answer.
- **A clear button clears a field nobody binds.** A filter box whose only reader was a rule on a list kept its text
  when its clear was pressed; the affordance now falls back to the field's own control.
- **A tooltip's arrow points at a small mark.** Over a validation dot the arrow stopped an inset short of the dot; the
  tooltip now moves so the arrow reaches the centre. A period's calendar toggle stands at the field's end, as on a
  single-moment field.
- **Chrome is never selectable.** A button's label, a tab's caption, a menu entry, a table header, a select's option and
  a breadcrumb no longer select on a press or a drag, even where the text inside them is `Selectable`; a loading button
  no longer flashes its ripple behind the label; a picture input's placeholder is an outlined frame. The button group
  is listed under Actions.
- **A loading button without an icon dims its label**, in place of a veil that Chrome painted behind the words rather
  than over them; a button label with a description reads from its start beside its icon; a dragged tab stays where
  it is dropped; `ImageInputComponent.MaxFileSize` refuses an oversized picture before it is uploaded.
- **A tree filters and sorts.** `FilterBy` on a tree keeps a matching node with its ancestors and holds those folders
  open while the box holds a word; `SortBy` orders every folder's children alike. The viewer's fold is painted by the
  boot script before the first frame. A menu bound inside a node — the entries travelling with the node — gets its
  rows: a composite's typed variant is now worn by the item's own kind (`DeclareCompositeSlot`), which also mends a
  collection bound inside a key-value list's typed editor.
- A table scrolls sideways as a whole: with `HorizontalScroll` on, the root is the scroller of both axes, the header sticks
  to its top, and the host names the root as its viewport (`data-ui-host-viewport`) for the window and virtualization
  engines, which read the scroll through it. A column may be pinned (`UITableColumn.Pinned`, `pinned:` on `AddColumn` and
  `AddTextColumn`; leading columns only): sticky at the sum of the pinned widths before it, which the columns engine keeps
  in `--ui-table-pin-N` on the root through every resize, on an opaque ground with the row's wash over it; the last pinned
  column draws the edge the rest scroll under, with a shadow once they have (`data-ui-table-scrolled`).
- A popup declares its own ground (`--ui-surface-fill` on `.ui-popup-surface()`), so a field inside one — a colour picker's
  hex and RGB boxes, a temporal picker's segments, a package's fields in a flyout — steps off the popup rather than off the
  page behind it. `TableComponent.AddColumn(UITableColumn, IVisualComponent)` is virtual: every verb that adds a column
  ends there, so a derived table hears about all of them.
- A column hides below a viewport tier — `HideColumnBelow(key, UIResponsiveTier.Md)`, `UITableColumn.HideBelow` — and a
  viewer may hide or show one through the columns engine, now on the plugin surface as `tables` (`isColumnHidden`,
  `setColumnHidden`). A hidden column keeps its track at zero, so every index stays true; the root lists the hidden
  indices (`data-ui-table-hidden`) and the stylesheet puts their cells out of sight. The viewer's choices are kept in the
  browser beside the widths, painted before the first frame with them; stored widths for a different column count are
  forgotten. `UIResponsiveTier` names the tiers of `UIResponsive<T>` on their own.
- **Regions, tab stops and two half pixels.** A flyout's content and a tab's page lay their content out on the
  twenty-four columns like a card does; every items host is a tab stop whatever its selection mode; a badge with an
  icon no longer ends on a half pixel, and an items host holding only its empty state no longer scrolls by one.
- **`UITextWrapMode.WrapEllipsis` is gone** (breaking). It was `Wrap` with `MaxLines` defaulting to two; `MaxLines`
  clamps a wrapping paragraph on its own, an ellipsis on the last line it keeps, so a clamped paragraph is now
  `SetMaxLines(n)` with the default wrap mode. The `ui-text--wrap-ellipsis` class and the `wrap-ellipsis` token went
  with it.
- **An icon-only button is named by its tooltip.** A button-shaped control with an icon and no title now carries its
  `Tooltip` as `aria-label`; a titled one keeps its title as the name. Nothing is invented: a control with neither
  stays as it was.
- **Several fields can send their words to one place.** `ValidationInto` targets collect a line per field: a field put
  right takes only its own line away, and a paragraph shows the lines one under the other. Two fixes came with it: a
  patch to an unbound property no longer lands on the component's root (the element holding a validation target is
  marked `data-ui-into-<property>`), and a paragraph's author-written newline now breaks the line as documented.
- **A grid splitter placed wrong fails the view's compilation.** A star track (it would share the room it divides),
  the container's first or last track (nothing to move on one side) or a row the container never defined is refused
  with the splitter and the container named, instead of a warning in the browser's console. Two authoring interfaces
  carry what the compiler reads: `IGridTracksComponent` (a container's `Columns`/`Rows`) and `IGridSplitterComponent`
  (`Orientation`).
- **A cancelled picture is gone.** A key-value row closing tells what is inside it that the draft is dropped
  (`ui-draft-dropped`); the picture input lets its preview go, shows the controller's picture again and hands the
  controller an empty handle, so the next save cannot take the picture that was cancelled.
- **A button stays down.** `Pressed` on a button, two-way, makes it a toggle: `aria-pressed`, flipped by a press and sent
  back, worn with the selected ground. Unset, it is an ordinary button.
- **Every input takes a `Size`, and a field its caption inside.** `UIInputSize` (`Small`, `Medium`, `Large`) is on every
  input, a toggle's box and a slider's handle stepped with it; `TitlePlacement` puts a field's caption at the leading edge
  of its own box (`UIInputTitlePlacement.Inside`); a select opens where `PopupPlacement` says. The image input is a field
  like the others — the same appearances, the same hover, the caption inside.
- **A dialog's panel is placed with a component's words**: `Width` to `MaxHeight`, the two alignments and `Margin`, per
  tier, with `Placement` kept as the shortcut for a sheet; a centred dialog on a phone is the screen less a thin margin.
- **A viewer arranges a table's columns by dragging a caption** (`ReorderableColumns`), kept in the browser beside the
  widths. A column's width is a floor and a share, so the columns fill the table and a hidden one's room goes to the rest,
  and a sortable column sorted neither way wears a mark of its own.
- **`BadgeComponent.Style` is `Type`** (breaking), as a button's is, and `OnItemClickWith` is on every items component
  templated on a button — `CommandBar`, `Breadcrumbs`, `ButtonGroup`.
- A ghost field's focus is the wash a ghost button answers with rather than a ring, and a box field's ring is its outline,
  inside the border. A circular progress centres in the width it is stretched to; a radio's dot stands before its text and
  its read-only state is live; pinned tabs stay the strip's head.

### Runtime, hosting and compilation

- **A windowed host's read and a value update allocate far less.** A lookup by controller path no longer builds a path
  template each time — one is kept per path shape — and a window read asks once per change whether collections are bound
  under its rows, reads each row one segment below its collection (`RecursiveObservable.TryGetRecursiveValue(PathSegment)`)
  and shares one visited set across a range. A hundred-row read went from 186 KB to 45 KB, a batch value update from
  2.2 KB to 1.0 KB.
- **Two renders of one page landing together no longer fail the second.** On Windows the render cache's replace of a file a
  reader still holds is refused while the replaced one is pending its delete; the cache now counts that as written — the first
  render is the same render — instead of answering the request with an error.
- **A page costs less to serve.** The render cache holds its entries in memory as well as on disk, so a page
  load no longer reads the whole cached shape off the file system only to drop it: a page with no controller is
  about twice as fast, one with a controller about 15% faster. A property's DOM operations reach the metadata as
  a span, so the collection expression every renderer writes stays on the stack rather than allocating an array
  per property per component. Measured on the demo in Release: a static route went from 2 050 to 3 475 requests
  a second, `/inputs/text-input` from 239 to 275 at eight threads.
- **A runtime the render built for a client that never arrives is dropped in half a minute**, not in ten
  (`UIPersistenceOptions.UnclaimedRenderRetention`). A page render reads its values off a runtime of its own and
  hands it to the attach that follows; one nothing claimed — a crawler, a health check, a tab closed before it
  connected — used to be kept as long as a real client's, at a controller's worth of memory each. A thousand such
  renders held about 700 MB for ten minutes.
- **The scheduler's tasks no longer queue behind one another.** The flush runs every 50 ms and the session, file
  and runtime sweeps run over whole stores, and waiting for them in turn made a slow sweep delay the flush for
  every session in the process. A task still running when its turn comes round is skipped rather than run twice.
- **Two options the builder quietly dropped are carried again**: `MaxParallelFlushes` and `ErrorPageMessage` were
  missing from the copy the application is built with, so setting either did nothing. Every option of all five
  option objects is now driven through a real build and read back by a test.
- **A bound path that names nothing is a compile warning.** The compiler already walked the controller's types;
  when the walk stops on a property no type on the way has, it says so instead of leaving the author a component
  that silently keeps what it was authored with. Only a path written from the controller root is judged — a
  default template binds a whole model contract relative to an item, and an item carrying part of it is normal.
- **The client's console is quiet.** It wrote three debug lines on every page load with no way to turn them off;
  it now says nothing below a warning, and `window.NEStandardUI.setLogLevel("debug")` turns it back on for as
  long as the browser keeps the setting. On the server, rendering a route and a runtime's comings and goings
  moved from Information to Debug: they are diagnostics, and the host already logs the request.
- **Work that takes a while can say so while it works.** A client effect used to travel only as a command's answer, so a
  long command — a network of nodes running one at a time, an import — said everything it had to say at the end.
  `UIContext.SendEffectsAsync(effects)` pushes effects to the connection outside any answer: they are resolved against the
  runtime exactly as a command's own are and sent through the update sink, which works whatever a route's update mode is.
- **Hydration waits for the page's package modules**, and a package's engines start after it; a component that takes its
  collection as values is refilled on attach; every built-in template binding is optional, so a row lacking a path is
  drawn without a warning.
- A dispatcher's queue leaves with its drain and the host disposes it, a direct runtime drains its item windows and wakes
  on a resync, a failed attach fails fast, and a cleanup pass skips a runtime whose command is still running.

### The plugin surface

- **The core's own marks are the `ne-` icon pack.** `UIGlyphs` names every one, a renderer draws it through
  `IconValueRenderer.RenderIcon` and the browser through `icons.apply`, with no icon pack installed — what a package's
  chrome is drawn with.
- **The contract has a Less half.** `Client/plugin/ne-standard-ui.less` — the tokens and the mixins (glyphs, motion,
  elevation, responsive, placement, focus, popup, field, selected, text, arc) — is generated on every build and copied
  into a package byte for byte, like `ne-standard-ui.d.ts`; a test refuses a copy that differs.
- **The engine context grew.** `icons`; `values` — a value read as the framework reads it, off the element a composed
  control marks (`data-ui-value-holder`), and `hold`/`release` for an editor's unsaved work; `badges.writeCount`;
  `properties.set` on a core component a package's renderer exposed (`RenderRegion`); `rows` — the item a row stands for,
  `readPath`, a template variant drawn when it is wanted; `selection`; `popups`; `roving`; `renames`; `dom.ensureId`;
  `temporal.parse`/`toDate`.
- On the server, for a package's renderer: `ReadRenderValue`, `ResolveCulture`, `ResolveItems`, `RenderTemplateVariant`,
  `RenderContextMenuRegion` for a further, named right-click menu, `ThemeColorRenderer.SeriesColorCss`,
  `WebPackageClient.AddPackageClient`, `WebPackageRegistration.GetOrAdd`, `UIChoice`/`UIChoices` and `UINaming.Humanize`;
  an effect aimed at one component derives `TargetedClientEffect`.
- `dom.insertText` is gone from the plugin surface: nothing called it. `window.NEStandardUI` loses the `add*` twins of its
  `register*` methods, which the contract never declared and nothing called.
- **A component that takes its collection as values hears a change to one of its items.** A chart's points and a
  canvas's nodes reach the browser through the collection sink rather than as rows, and a change to a property of one
  item used to go only to the components inside an item template — of which such a component has none, so the value
  never arrived. A component says so with `IItemValuesComponent.TakesItemValues`, and every change to one of its items
  is sent as a replace of that item.
- **A package can show the page's tooltip with words of its own.** A component that draws its own picture has an element
  per point but wants to speak about an x — a chart naming every series at the hour under the pointer. The plugin surface
  gained `tooltips.show(target, words)` and `hide()`, and a tooltip keeps the lines the words were written with, so there
  is still one tooltip on the page rather than a package's own beside it.
- **A command can read a key the event itself named.** A component that draws its own picture raises its own events, and
  what one means may be more than one key — the point pressed in a chart and the series it belongs to. The client could
  already name those keys; a command now reads them by their place in the chain with
  `UIAction.ArgEventKey(name, index)`, beside the item-scope arguments it already had.
- **A package hears what became of the command its event raised.** `completed` on a registered event is told whether a
  command ran at all, whether it answered successfully and what it said — so a component that sends a value can wait for it
  to land rather than assume it did. The node canvas marked a sheet saved the moment it sent it; now a failed save leaves
  the canvas unsaved, which is what the viewer needs to know.
- **The plugin surface: a package may send a file.** `uploads` on `PluginEngineContext` hands a package's engine the
  framework's own multipart POST and answers with the selection id a controller reads the file back by
  (`IUIUploadService.GetSelectionAsync`). It is the one thing the node canvas asked the surface for: without it a package
  would copy the endpoint's path and its answer's shape, and the copy would drift from the original on the first change.
- **The plugin surface, opened a little further for the data grid.** A package's engine gets `temporal` beside
  `numbers` — the temporal formatter and the culture pack off `data-ui-temporal-culture`, which
  `TemporalCultureRenderer` writes once on a root; the table's `AddColumn` and `AddTextColumn` are virtual and its
  header cell renders through `RenderHeaderCellContent`, `RenderCaption` and `RenderResizer`; a table that says
  `PublishItemValues` hands the client its static rows' values with no rule to read them. Two things found on the
  way: a client-built row warned once per row for every ability binding its item lacked (once per binding now), and a
  table row with a two-line cell in it overflowed its one-line height (`grid-auto-rows: max-content` on the host). For
  the grid's editor: a composite slot's wrapper carries attributes on both sides (`WrapperAttributes`), and an element
  inside a row may keep a double click for itself (`data-ui-no-row-open`); a derived table may put a column back with
  more said about it (`ReplaceColumn`). And a defect the grid's filter row exposed: the client took a component's items
  host as the first one under its root, so a component with another items component before its host — a select in a
  grid's filter band — registered no row values and answered no client rule; it takes its own host now, and a DOM
  operation's named target is the component's own part the same way. For the grid's pager: a windowed host marked
  `data-ui-window-paged` is read by a pager, never by its scroll, and a package asks for a window by offset through
  `windows` on its engine context; the table's `ConfigureHost` hook writes on the host. For the grid's footer: a window
  may carry `Aggregates` — what the source computed over every item its query leaves, by property — kept on the source
  and bound by the compiler to the host's `WindowAggregates`, carried as `data-ui-window-aggregates`.
- A composite row — every table row — went through no row decorator at all; it does now, so what a renderer puts beside a
  server-rendered row reaches a row the client builds.

### Presets and the demo

- **The demo's two overlay pages are at their own address.** `/overlays/dialog` and `/overlays/notification`
  answered 404; a component's first page is its own route now, whichever kind it is.
- **`NE.Standard.UI.Extensions` is no longer empty.** Presets over the components — a text in a role, a page's header
  band, section and card, a stack, a row, equal columns, a main part with a side part, a button per type, the pair at
  a form's foot, a field with a hint, a read-only details list — and the three rules a component is shown, hidden or
  enabled by from another component's value (`ShownWhen`, `HiddenWhen`, `EnabledWhen`). Nothing in it is a component:
  no renderer, no stylesheet, a server-only package.
- **The demo has six screens.** Pieces of an application rather than of a component, first in the sidebar: a
  sign-up, a checkout, workspace settings, a catalogue narrowed in the browser by four rules and three sorts, an inbox
  and an article — written on the presets, and the component pages point at them.
- **The security screens are back.** The Screens section gained the sign-in page, an account page behind
  `[UIAuthorize]` with a permission-gated command, an admin console behind a role, and the forbidden page, with an
  `[AuditCommand]` filter writing the trail both pages show.

## 1.0.0-rc.2

The second candidate: four passes by the owner over the first one, then a read back over everything they
touched. No new component and no new concept — what changed is how the ones already here behave under a real
pointer and a real keyboard.

- **Rows are chosen the way a file manager's are.** A plain press takes one row, Ctrl adds or removes one,
  Shift takes the range from the anchor — from the row the cursor stood on when no press has set one, so a
  list reached with Tab extends properly. Enter opens the row the cursor is on and leaves a chosen group
  standing, which is the group Delete reads. A press on a row hands the focus to its host, so the arrows carry
  on from there, and the keyboard's row is washed only while that host holds the focus.
- **A tab may be pinned** (`TabItem.Pinned`): it wears a pin in place of its close, and a drag leaves it where
  it is. A tree drags every chosen node with the one under the pointer, but never one folded out of sight.
- **A message a controller puts on an input is a mark inside a grid.** In a table's cell or a key-value row a
  line under the field would grow the whole row, so the message becomes a dot at the field's corner that speaks
  in a tooltip — including one that arrives already rendered, which used to stay a line until the next patch.
  `ValidationPresentation` asks for one or the other anywhere. A field's own tooltip is no longer lost when
  such a mark clears.
- **A key-value list edits in place.** The pencil opens the row, the editor is a filled box set back so its
  text starts where the value's did, and a typed input per row (`InputTemplate`) means the draft comes back as
  the input sent it. The pages moved under Items, where rows of a collection belong.
- **A field of a box kind draws its focus ring over its own content**, so an editor with a gutter of its own no
  longer shows the ring broken along that edge.
- **A field says what a browser may fill into it** (`TextInputComponent.Autocomplete`, `UIAutocomplete`), and a
  password field is no longer wrapped in a form of its own. That wrapper silenced a console warning and cost
  more than it was worth: a password manager saw a form with a password and no name in it and remembered the
  password with no login against it.
- **`WrapPanel` flows its children** (`UIItemsLayoutType.Wrap` on an items view), a slider's readings follow a
  pushed value, a file field opens on any press and lets go of its drop mark when the drag leaves the window,
  an image input keeps its shelf, and `PressRipple` is on by default.
- **A tab's page fills the room the strip leaves it**, so an editor in a tab reaches the bottom of its pane
  instead of stopping at a row count; a page with more content than that still grows.
- **A file a field cannot take is refused while it is still in the air**: the drop mark goes to the colour of a
  refusal and the browser draws its "no drop" cursor, where the field's rule is written in types rather than in
  file extensions, which a drag does not carry.
- **The documentation site reads like one.** Every page can be filtered from the sidebar, which opens on the
  page you are on; a property has an anchor of its own; a phone gets the navigation behind a button instead of
  in front of the content, and a property table scrolls inside its own box; the footer names the release the
  site was built from. The colour vocabulary is written down in the theming guide, and the reference links to
  `NE.Colors` for what each name is.

## 1.0.0-rc.1

The release candidate. The framework, the icon sets and the code input go out on one number from here, so
what a project installs is one decision rather than three.

- **The client's tests run from the project file, not from `npm run build`.** Nine of them read the parity
  corpora shared with the .NET tests, and those live under `eng/`, which is not part of a published tree — so
  `dotnet build` on a clone of this repository failed on nine missing files before it reached the bundle. The
  tests now run the way the .NET tests do, where the sources sit next to them; `npm run build` type-checks
  and bundles, and a clone builds.

## 1.0.0-preview.2

The second preview. Twelve more built-in components, one vocabulary across every host that shows rows, the
framework's own chrome translatable, and a client surface a component package can plug into — the first of
those, [`NE.Standard.UI.CodeInput`](https://github.com/AkiEvansDev/NE.Standard.UI.CodeInput), releases
alongside this one.

- **Twelve new components.** `Table` (columns as templates over the author's own rows, widths the viewer
  drags and an order the viewer arranges), `Tree` (a flat keyed list folded on the client, a template per node kind, children asked for once
  per unfold), `SplitButton`, `ButtonGroup`, `GridSplitter`, `ImageInput`, `ColorInput`, `Paragraph`,
  `Surface`, `Accordion`, `CollapsiblePanel` and `ThemeSwitcher`.
- **The plugin surface, opened for the next packages.** A component may take its bound collection as values
  through a client sink; a two-way value may be an object; a component registers its own dialogs; every items
  component has a viewer's `Query` beside its authored rules; the table's renderer and column are open to
  derive from; a series palette, tooltips on SVG shapes, and a number culture pack the client formats by.
- **Every host that shows rows speaks one vocabulary.** A host has one mode — plain, virtualized or windowed
  — and a virtualized one draws only the rows in view; the items view, the table and the tree share a keyboard
  row cursor; and what may be done to a row is the row's own bound property (`CanSelect`, `CanDrag`,
  `CanRemove`, `CanRename`, `CanShowContextMenu`), so a list can refuse one row what it allows the next.
- **A period on the temporal inputs.** A second field and `EndValue` beside `Value`, both ends chosen on one
  calendar, an end before the start swapping with it.
- **A sentence can fold.** `[caption]{text}` in the inline markup keeps its caption in the line and opens the
  text below it; a paragraph can set its description off with a quote line.
- **The framework's own words are translation keys.** Everything the library's chrome writes for itself is a
  `UIStrings` key with an English floor, translated through the application's own source; the client's share
  travels in the page. A new control's chrome word is a constant, never a literal.
- **New effects**: a copy to the clipboard, a collapse, a theme switch, and the tab and tree renames.
- **Validation has three severities** and a message the controller can write.
- **The application serves its own content.** `IUIContentProvider` answers by key, so a picture or a file a
  view shows comes from the application rather than from a URL it had to publish; the upload endpoint honours
  the default policy, and `IUIAuthorizationService` is the seam an application implements to answer for a
  view.
- **Sessions outlast the window.** The session cookie may carry a lifetime and it slides; an application's own
  endpoint can read the session behind the request.
- **Assets are cached by version**, and the version is a hash of the asset's content rather than a number that
  changes with the process.
- **A package brings its own client engine and words.** `window.NEStandardUI.registerEngine(start)` starts a
  package's engine after the built-in ones, with what a built-in engine gets plus the page's words and
  `observeComponents`; an `IUIStringsSource` registered as a service adds the words a package's chrome writes
  to the translator's English floor and to the page's `data-ui-strings` block, so an application translates
  them exactly as it translates the framework's own.
- **A field that is a box takes the chrome by class.** `ui-field-box` — `TextContentRendererBase.FieldBoxClassName` —
  gives a renderer outside the framework's stylesheet the field ground, the four appearances and the states,
  and `--ui-field-fill` says what the field paints at the moment; the text area wears it too.
- **A DOM operation may be a package's own.** `WebDomOperation.Kind` is the kind's name, and
  `WebDomOperation.Custom(kind, …)` names one the package's client registered through `registerDomOperation`.
- **The client's plugin contract is a file.** `Client/plugin/ne-standard-ui.d.ts` declares what a package's
  client may reach; a package keeps a copy, and the build refuses a copy that drifted.
- **The reference is generated now.** [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard)
  carries a page per built-in component, read off the compiled components and their XML summaries, beside the
  hand-written guides.
- **What moved, and will keep moving while this is a preview:** the default not-found and error views ship
  from the core and `IUIDefaultErrorPagesProvider` is gone; a tab's `Closable` and `Reorderable` folded into
  the shared `CanRemove` and `Draggable`; virtualization is a host mode rather than
  `IVirtualizedItemsComponent`; `ItemContext` and the dynamic-parameter scope moved into
  `NE.Standard.UI.Compiled`; `UIApplication` is built in the host's own container.

### Review before the freeze

A final pass before the Web/framework freeze: nine independent read-only reviews, deduplicated and worked off
in one session.

**Breaking renames and removals:**

- The authoring foundation is a package of its own: `NE.Standard.UI.Components.Foundation` (the component
  bases, the template bindings, the input extension methods) under `NE.Standard.UI.Components`, and
  `NE.Standard.UI.Web.Renderers.Foundation` (`WebComponentRendererBase` and the shared helpers) under
  `NE.Standard.UI.Web.Renderers`. `.Required()`/`.OnChange()` and the other input extensions now live in
  `NE.Standard.UI.Components.Foundation.Inputs`, and `RowItemsComponentBase` takes the row template's type as a
  third parameter. A component package references the two foundations only.
- `UIViewBase` and `IUIViewDefinition` are both `NE.Standard.UI.Authoring.Views` now (from
  `NE.Standard.UI.Components.Views` and `NE.Standard.UI.Views`): one `using` per view file instead of two.
- `TabsView.OnItemClose` → `OnItemRemove` (the event `close` → `remove`; `ITabItemComponent.OnClose` →
  `OnRemove`), matching the verb `CanRemove`/`Removable` already use and Tree/Table raise.
- `TabItemComponent.RenamedCaption` → `RenamedTitle`, the tree's name for the same write-back.
- `ICollapsibleComponent.Collapsed` → `Expanded` (default `true`), the polarity `Expander`/`TreeNode` already
  use; the DOM attribute stays `data-ui-collapsed`.
- `UIRuntimeLifetime.PerTab` → `PerWindow`, `UIInstance.TabId` → `WindowId`,
  `UserSessionInitData.ClientTabId` → `ClientWindowId` — a window is one top-level surface showing one address
  (a browser tab or a desktop window), the neutral term a second platform needs.
- `UIItemsFilter` constructors now default to `LikeIgnoreCase`, matching `FilterBy`.
- Removed: `Card.SetHeader`/`Expander.SetHeader`, `OnChangeLiteral`/`OnBlurLiteral`,
  `InteractOnFocus`/`InteractOnBlur`, `UICompiledBindingSourceIndex.TryGetByComponentId`.

**New API:**

- `IVisualComponent.On(eventName, command, args)` — a general escape hatch for wiring an arbitrary event.
- `ItemsView.OnItemClick`/`WithItem`/`WithItemKey`, `OnItemOpen(WithItemKey)`, `OnItemRemove(WithItemKey)` and
  `RowHoverable`, matching Table/Tree.
- `UIDialog.OnClose(command, args)` — raised only when the viewer dismisses the dialog (Escape/backdrop).
- `TabsView.OnItemRename(command, argumentName)` convenience.
- `OnItemClickWithItem`/`OnItemClickLiteral` on Breadcrumbs/ButtonGroup/Menu/SplitButton.
- `UINavigationRequest.TryGetParameter(name, out string?)` / `TryGetParameter<T>`.
- `UITheme.PressRipple` — an opt-in press ripple on buttons, actions and menu entries (`data-ui-press-ripple`).
- `IItemAbilitiesComponent` and the `TreeNode` properties default their `Bind*` sugar to `Relative`.

**Notable fixes:**

- The error page's `message` carries the exception text only under `IncludeExceptionDetail`.
- `WebUrlSafety` gates every bound `href`/`src`/background `url()` on both the render and the patch path.
- `ArgCurrentItemKey` is verified against the collection it addresses; an unknown key is refused.
- `UITypography.Validate` refuses control characters and `< > { } ; " '` in `FontFamily`.
- `X-Content-Type-Options: nosniff` on the framework's responses, and the upload POST refuses a cross-site
  `Origin`/`Sec-Fetch-Site`.
- `ITranslator` registered in DI now wins over the built one; `UICommandInvoker` refuses undefined enum values;
  the runtime logs resolver/handler failures instead of swallowing them.
- `StandardUploadService`/`StandardDownloadService` moved into Core; a platform supplies only
  `IUIDownloadAddressProvider`. `UIContentAddress` is an instance the platform registers, not a static prefix.
  `UserSessionStoreExtensions.SetThemeModeAsync` is the theme persistence the hub calls.
- The client's `Property` DOM operation compares before writing, so a bound value replayed mid-typing no longer
  moves the caret to the end; `isComposing`/`defaultPrevented` guards across the keydown handlers that lacked
  them; Ctrl matches Cmd on a Mac for menu shortcuts; the cursor moves to the neighbour when its row is removed;
  a cancelled tab drag restores the order; the window engine realigns instead of scrolling on a re-attach;
  `pointer-drag` Escape cancels; `file-drop` reacts to `Files` only; the boot patch allows only
  `data-`/`aria-`/`class`/`hidden` attributes and `--` styles.
- `.ui-action` takes the button's corners, a horizontal menu's entries are square, and `.ui-button--surface`
  mixes its hover/active wash into its own fill.
- A bound menu's rows built by the client carry their sub-entries (`WebRenderItemsTemplateMetadata.RowDecorator`);
  a menu shortcut yields to a field that took the chord and stops at an open modal dialog; a page rendered from
  another compile of its view reloads at the attach instead of being fed updates it cannot address, and a page
  that reconnects after a restart gets its values back.

## 1.0.0-preview.1

Where this changelog starts: the first release cut after the packaging was settled. **The framework is
published now**, as a pre-release, instead of the two loose packages that used to go out on their own.

- **Twelve packages, one version.** The number lives once, as `<CoreVersion>` in the repository's
  `Directory.Build.props`, and `Release` refuses a tag that disagrees with it. There is no per-package number
  to forget and no way to install a mismatched pair.
- **The icon sets moved to a public face of their own**,
  [`NE.Standard.UI.Icons`](https://github.com/AkiEvansDev/NE.Standard.UI.Icons), on their own version and
  under MIT. They are still developed alongside the framework, so a set and the renderer it plugs into never
  drift apart; only the release is separate.
- **The package called `NE.Standard` is gone from this repository.** It was a library of general-purpose
  helpers that nothing under `src/` referenced, and it now lives on its own as
  [`NE.Common`](https://www.nuget.org/packages/NE.Common), MIT, with its own version line. It was never part
  of the framework, and a noncommercial licence on a bag of `string` and `DateTime` extensions helped
  nobody.
- **`NE.Standard.UI.Extensions`** is reserved for presets over the components, and is empty in this release.
- **The demo builds against the packages.** In the mirror `examples/DemoApp.Web` restores `NE.Standard.*` from
  nuget.org rather than referencing sources, so cloning it gives you a working application and the build here
  is a real test of what was published.
- **The licence is the [Prosperity Public License 3.0.0](LICENSE.md)**, not MIT: free for noncommercial use,
  with a thirty-day trial for commercial use. Personal projects, research, education, charities and public
  institutions are not commercial use.
- **Installs from nuget.org** — `dotnet add package NE.Standard.UI.Web --prerelease`, no credentials and no
  feed to add first.
- **The packages point only at the public mirror**, `github.com/AkiEvansDev/NE.Standard`. No commit hash
  travels in a nuspec or in an assembly's informational version: the sources live in a private repository, and
  a hash out of it resolves to nothing against the URL the packages carry.
- **`UIComparisonEvaluator` is public**, so an in-memory item source applying a `UIItemsQuery` by hand answers
  `Like`, `Required` and the rest the same way the server and the client do.
- **Fixed: a windowed filter's `Less` and `LessOrEqual` matched rows they should have excluded.** A value that
  is not a number compared through a sentinel that read as "smaller than everything", so `"abc" < 1` was true
  on the server and false in the browser. It converts to `NaN` now, as JavaScript does.
- **Documentation is at [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard).**
  Hand-written pages today; the generated API reference is still to come.
- **The packages published under the old scheme are unlisted on nuget.org** — `NE.Standard` 1.0.0 and
  `NE.Standard.UI.Generators` 1.0.0. They were cut while the packaging was still being settled, and
  `NE.Standard.UI.Generators` 1.0.0 would otherwise outrank every `1.0.0-preview` that follows it.
