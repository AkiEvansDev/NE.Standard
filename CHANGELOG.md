# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.7.2

- `CheckboxComponent` (and `SwitchComponent`) take `IconAlignment`/`BadgeAlignment`, and `RadioGroupComponent` gains
  `SetIconAlignment`/`SetBadgeAlignment` for its default option template. A radio option's icon now stands on its title's line by
  default, as a checkbox's does, and its badge at the title line's end.
- `TextInputComponent`/`TextAreaComponent.CancelOnEscape`, bindable: off, a field with `OnEscape` commits and leaves on Escape
  and runs nothing, so a form's composer cancels only while it holds an edit (#136).
- A system notification's fallback toast leads to its `Address` with an "Open" button, or `ShowSystemNotificationEffect.AddressLabel`'s
  words, through the page's navigation; a page already there shows the `Action`'s button (#137).
- A toast's close button stands on its first line, beside the title (#138).
- A rail kept a phone's drawer (`RailBottomBar = false`) carries its `ShowCollapseToggle` switch and toggle content there, the switch
  over the button that opened the drawer and putting it away; the wide rail shows neither, and its row leaves no gap. A menu's own
  toggle content starts at the row's start; only a search is inset to the entries' glyphs (#139).
- A toast's Undo answers `Refused` on a Direct route and from a detached run too; a press its filters or roles refuse once the
  offer was taken, and one no longer on offer, answer not refused, so the button no longer stays live for nothing (#141).
- A command's own `UIContext.UpdateSessionAsync` re-checks and reaches every page of the session as `UpdateUserSessionsAsync` does:
  a tab whose route the new session fails ends, every tab holds the new roles, and the commanding tab is sent away by its
  command's own answer — the invoke's, or a background command's pushed result — so nothing reaches it ahead of that answer (#142).
- The hub's theme, colour and language switches no longer bring back a session idle past its timeout; a page ended on the sign-in
  route reloads it instead of returning to itself (#142).
- **Breaking:** a command's arguments take `RecursiveValueCoercion`, as a bound value does: `DateOnly`, `TimeOnly`, phrases, colours,
  lists and models read; `"1,5"` to a `decimal` is refused, no longer fifteen (#143).
- **Breaking:** moment text is read in the wire's shapes only (`UIWrittenMoment`): a zone after a `DateTime` is dropped, not shifted
  into the server's; `"09/29/2026"` is refused; a `TimeOnly` takes `H:mm[:ss[.f]]`; a `DateTimeOffset` keeps its offset (#143).
- A return address writes `true`/`false` and an object as its JSON, as the page writes them (#143).
- A source's write is read by its input's format, held from its writer as an inline write is, and refused on the field when
  unreadable; value writes and window reads run for the tab that sent them; a scheduled flush holds its runtime (#144).
- A Direct runtime runs a source's write and a window re-read outside its send order, so a source awaiting `InvokeAsync` on its
  runtime no longer stops it for good (#144).
- The server refuses moving a pinned tab and keeps a moved tab after the pinned ones, as the page does (#144).
- A download taken as the orphan sweep runs answers nothing rather than failing (#144).
- A value pushed to the page writes what its first paint writes (#140): an image fit's `Fill` and `None` by name, a collapsible's
  switch its `aria-expanded`, a field with no placeholder its blank one (its clear button stays away), a badge tinted only by a
  colour that draws one, a pause, a step, an indent, a stacking order and a count held to the first paint's guards, `aria-pressed`
  and `aria-checked` for no value, a progress reading without its trailing zeros, a flag a boolean switches written empty.
- A property name outside ASCII binds on the page: the client's kebab case reads Unicode letters as the server's does (#140).
- `WebDomOperation`'s `Text`, `Markup`, `Attribute`, `RemoveAttribute`, `Class` and `Style` take `optional`, and
  `Attribute(…, convertsNull: true)` lets its converter decide a null value too, rather than null removing the attribute (#140).
- **Breaking:** `ClientValueUIUpdate.DynamicParameters` is gone: `Address` carries the keys of every row the field stands in, and
  the runtime takes those its binding reads (`UICompiledBindingIndex.ResolveWrite`). A row template's field bound in the default
  (Root) scope writes its one value — it threw before — and the writer's other rows hear it (#145).
- A test page does with a change set what the page does (#146): a push into a held `OnSubmit` field waits behind the edit, and
  `DiscardFormEffect` puts the server's value back and clears what was said of the form; a refusal goes once the controller gives
  its property again; a number or temporal value past `Min`/`Max` stays in the field, refused in words, unsent, and refuses the
  submit, while a slider or calendar moved past them, a negative number where none is taken and a fraction where whole numbers
  are throw; a reset and its inserts keep the rows they resend unchanged, and a `Replace` of a row no longer there lands at its
  index; an address opened reads its query as the host does (`+` a space, a repeated key a list).
- `IFormSubmittingComponent`: a component whose own event submits its form says so, compiled into `CompiledUIEvent.SubmitsForm`,
  and a test page submits the form for it as for a submit button (#146).
- A field's rules read its value as its binding sends it (#149): a number field's invariant number, not its culture's grouped
  text ("1,500", "12,5", "50 %" no longer fail a numeric rule), a date's canonical moment, not its display format; a range's or a
  period's rules judge its start, once per submit, so its end no longer clears the start's failure; a stepper's step and a clear
  run the field's `Change` rules.
- **Breaking:** `WebAttributes.Draft` (`data-ui-draft`) is gone: a rule no longer reads the control an event came from (#149).
- Escape is the nearest thing's first (#148): a popup, a dialog, a side drawer and an action bar leave it to a key-value row's open
  editor, a rename field, a field with `OnEscape`, an input method's composition (Safari's too) and an element a package marks
  `data-ui-owns-keys` (`names.ownsKeys`), closing only a popup that element holds itself — a row editor's Escape in a flyout
  cancels the draft rather than closing the flyout and sending it. A package's native modal `<dialog>` stands over the framework's
  popups and dialogs, which leave its Escape and Tab to it.
- A side drawer closes on the first Escape, from a field in it too, as a dialog does, and not under a modal dialog opened from it;
  a focus a write hides inside an open drawer stays in the drawer (#148).
- A long press on a checkbox, a radio or a slider in a row opens the row's menu, as a right press does; a field and any editable
  region keep theirs (#148).
- A table or grid with `ShowContextMenu = false`, and a row template with `CanShowContextMenu = false`, refuse a nested
  component's menu in their rows, as an items view does (#148).
- A list reached by Tab shows the action bar of its cursor's row, the row Enter acts on (#148).
- A dialog, a popup, a context menu, an action bar or a toast that closes gives the focus back to its opener even where the page
  redrew that opener meanwhile (#148).
- A table's pinned columns, sticky header and a grid's totals paint the ground the table stands on — a raised table's, a card's,
  a dialog's — not the page's (#155).
- A warning or an info colours a checkbox's and a switch's edge as an error does, and a radio group's message its rings; the pointer
  no longer takes a marked edge away. A slider's message colours its fill and handle, its free track keeping its colour, and an
  edge round the whole track, which shows at the minimum too; its words stand under it at the title's start (#155).
- A search's field in its list is drawn by the field appearances' own rules: Filled's focus is its line, not a ring round a
  squared field; Outline keeps its inset; Underline's rule takes the focus; each answers the pointer (#155).
- **Breaking:** `WebClassNames.SearchFieldAppearance` and `WebDomConverters.SearchFieldAppearanceClass` are gone: the search field
  stands under `ui-search__head`, which wears `WebClassNames.InputAppearance` (#155).
- A file or picture dragged over a field wears every drop target's edge; a filled split button darkens under the pointer in a dark
  palette as a filled button does; the keyboard's frame marks a table's header stop, a colour picker's sliders, chips and swatch
  and the crop zoom; a colour picker's hex and channel fields answer the pointer and the focus; a key-value list's row hover
  skips disabled rows and nested lists; a button group's chosen segment hands its ink on to muted words (#155).
- The plugin stylesheet gains `.ui-filled-ground()`, `.ui-popup-list()`, `.ui-choice-entry()` and `.ui-link-underline()`, and
  writes `@media @{…}` throughout, as less 4.9 asks (#155).
- A row's refusals flipped live reach every element carrying its key — a table's cells, a menu's submenu — and a virtualized row
  too, so a re-enabled context menu opens on a cell (#147).
- A row drawn anew — a `Replace`, a refill, a virtualized row redrawn or replaced — keeps the keyboard's cursor and a focus inside
  it; a virtualized table's removed cursor row names its successor on the table, not its scroll box (#147).
- **Breaking:** a group header the page draws is a wrapper around its template, as the server's is, drawn under the rows around
  its list; an empty state too. The stylesheet's rule for a header drawn without its wrapper is gone (#147).
- A pushed change set and a Show, Hide or Collapse effect hand on the focus of what they hid, and a `hidden` Visibility hands it on
  once its fade ends — an interaction's write too (#147).
- `ScrollTo`, `Focus`, `ScrollToItem` and `Scroll` let go of a list held at its end or on a row around their target (#147).
- A virtualized table counts its rows, not its group headers, in `aria-rowindex`/`aria-rowcount`, as a windowed one does (#147).
- A tabs strip whose key names no tab shows its first tab and writes that key back, as the tabs view and the first paint do (#150).
- A select's type-ahead, the option it opens on and Enter from its search skip the options its filter left out (#150).
- A slider and a colour input pushed on a package's clone write that clone alone (#150).
- A time picker's clock judges its cells against the moment a press would commit, and its AM/PM step stays inside Min/Max (#150).
- A language switcher's and a pager's list is one Tab stop, opened on its choice, closed by Tab, as a strip's overflow is (#150).
- A search's least length is read trimmed, and a number it cannot read as none, for the server's search and its own narrowing
  alike; a menu's search reads an entry's words as a select's does (#150).
- A picture upload failing after another took its place leaves that one's name and handle alone (#150).
- A list's, a select's or a multi-select's `FilterBy` reading a field set at authoring time and bound to nothing filters from the
  start, by the value the field shows; it read no value until the reader edited the field (#150).
- A package's `registerEvent` with `attach`, `domEventName` or `options` for an event the view declares is heard its own way;
  `EventAttachContext.options` carries the listener options (#151).
- A command whose keys pass 8 KB — a drop of many rows — stages them beside the hub, as a large value does, rather than close the
  connection (#151).
- A window read cut by a dropped connection is asked again once the page is attached (#151).
- A select's options are first painted out of the Tab order, `role="option"` on client-built ones too; a radio group's client-built
  row gets its radio as a rendered one does (#151).
- An unreadable boot record is replaced on the next write; a notification's action pressed twice while a value is in flight is
  refused, not failed (#151).
- An input's shared properties are blocks of their interfaces (#156): `ISizedInputComponent`, `IFieldInputComponent`,
  `IAffixedInputComponent`, `IPlaceholderInputComponent`, `IMarkedDaysComponent`, and the new `ITextEntryInputComponent`
  (`TrimInput`, `CancelOnEscape`) — so the select, search and multi-select can no longer drift from the field bases.
- **Breaking:** `IButtonTemplatedItemsComponent` and `ButtonTemplatedItemsExtensions` are gone, and the instance `OnItemClick*`
  of the items view, menu and split button are extensions now: `IItemClickComponent.OnClickableItemTemplates` and
  `ItemClickComponentExtensions` (`NE.Standard.UI.Components.BuiltIns.Items`) give every one the plain, `Literal`, `WithItem`,
  `WithItemKey` and `With` forms; `OnNodeClickLiteral` and `OnRowClickWith` are added (#156).
- A built-in template's bindings are all optional, a tree node's too, so an item lacking a member no longer warns;
  the new `DefaultTemplateBindings.BindItemState` binds `Visibility` and `Enabled` (#156).
- **Breaking:** `UIComponentSlotKind` moved to `NE.Standard.UI.Abstractions.Identity`; `UIComponentTree.EnumerateSlots` is the one
  walk of a component's slots, which the compiler builds its graph from (#156).
- An effect no longer sends `canRunInInteraction`; a notification's `Resolve` copies the effect whole, so an option added later is
  kept (#156).
- A colour's text on the page judges a translucent colour over white in whole levels, as the server does (#156).
- `WebNumberFormat.Format(double, …)` writes a number as the page does, by the shortest digits that read back as it, past a
  decimal's range too (a logarithmic axis); `UITemporalPattern.ValidateTokens` refuses a pattern's quotes and stray letters alone,
  for a pattern that is only written (#152).
- `--ui-color-series-count` is one count for both modes, the shorter run (`WebThemeCssBuilder.SeriesCount`), so a series keeps its
  colour across a mode switch and a package's redraw cycles as the server's first frame does (#152).
- The plugin surface reads a numeric text as the server's invariant culture does (`numbers.parseInvariant`), matches a chord as the
  framework's shortcuts do (`shortcuts.matches`) and tells a composing key apart (`shortcuts.isComposing`) (#152, #153).
- Safari's Enter that ends an input method's composition is the composition's in every engine: a search's Enter, a menu's, a
  tree's and a select's keys, a shortcut, a rename field and a type-ahead no longer act on it (#153).
- `UIScriptNumber` (`NE.Standard.UI.Primitives.Text`) is the one port of JavaScript's `String(number)`: `TryRead` reads a number as
  the page holds it, `Format` writes it; a word's slot and a rule's text comparison use it, so a `decimal` or a `long` past a
  double's digits compares as the page reads it (#152).
- One root `WebClient.targets` builds every client, the add-ons' and the icon font's too (`BuildsWebClient`, `WebClientOutput`);
  `SkipWebClientBuild` skips them all (#153).
- A key landing in a field that takes typing is the field's (`isFieldKey`): no list, table, tree, tab strip or menu around it acts on
  a caret's arrow, Home, End, Page key, Space or a word's jump; Tab and the Escape or single-line Enter that let go of it still do.
- A field let go by Enter or Escape in a grid's cell hands the keyboard back to that cell, the cursor standing on it.
- **Breaking:** the plugin contract is version 4. `rows.isKeyTarget` answers false in a row's own control (a field, a button) and
  in a box marked `names.ownsKeys` (`data-ui-owns-keys`), which owns every key while the focus is inside it. New:
  `shortcuts.isFieldKey`, `focus.giveBack`, `values.whenSettled`, `names.cellFocus`, an event registration's `started`, and a
  grid's cell cursor for a package — `rows.cellsOf`, `rows.moveCursor`, `names.cellKey` (`ui-cell-key`, carrying a `CellKey`); and
  what a package needs to follow the keyboard standard — `typeAhead`, a list of choices (`popups.openList` with
  `ChoiceListOptions`, `popups.listKey`, `popups.followPointer`), `closesOnTab` on `popups.open`, `shortcuts.isPlainKey`,
  `shortcuts.isEscapeClaimed`, `focus.trapTab`;
  the contract's `RovingFocus` states the standard by kind; `sheetOnPhone` on `popups.open`/`openList`, a package's list shown as
  the phone's sheet; `colors`, the theme's series colours counted and cycled as a chart's and a graph's own copies did.
- A compiled view holds about 40% less: a component's state stands in one slot layout per component type
  (`UIComponentStateLayout`, `UIComponentState.Layout`) instead of a frozen dictionary per component, and a property left at its
  default shares one compiled value per type. A state read takes about half the time.
- The render cache keeps a view with a controller as its init bindings alone, the one thing its page reads off it, and holds and
  stores the rest as UTF-8, written into the response's pipe as it is: a held page is half the memory and a third quicker to write,
  and a read off the disk a fifth of the time.
- **Breaking:** `WebCachedViewRender.Html` and `MetadataJson` are UTF-8 (`ReadOnlyMemory<byte>`), empty in an entry without its page
  (`HasPage`, built by `WebCachedViewRender.InitBindingsOnly`); `WebShellContext.MetadataJson` is UTF-8 too. The meter's
  `ne.ui.web.render_cache.held.length` (characters) is `ne.ui.web.render_cache.held.size` (bytes).
- The demos run on Workstation GC, for their footprint; the GC mode is the host application's choice (`ServerGarbageCollection`).
- One keyboard rule across the page's widgets (`isPlainKey`): a plain arrow navigates, Alt+arrows are a move's or the browser's
  Back and Forward, a key composing a character is no widget's — tabs, a tabs view, a button group, the pager, the popup lists,
  menus, time segments, a splitter, a split button and a date field's Down no longer take a chord.
- The pager's buttons walk round past their ends, as a toolbar's; lists, trees, a select's list, calendars and time columns stop.
- A select's and a multi-select's open list takes Home, End, PageUp and PageDown; Alt+Up chooses the current option and closes
  it, Alt+Down opens it; Tab closes it choosing nothing.
- A tree takes PageUp and PageDown; a number field's PageUp and PageDown step by ten; a splitter's and a column handle's move a
  tenth of the room, and Enter on them puts the authored layout back, as a double-click does.
- A calendar turns a year with Shift+PageUp/PageDown; its month pane is one Tab stop, walked by the arrows, Home and End.
- Menus, context menus and the popup choice lists (language, page size, "…") reach an entry by its first letters.
- A menu's group opens with Right (Down in a horizontal menu, Up on the bottom bar) and closes with Left back to its entry; an
  inline open group's entries are in the menu's walk and its one Tab stop; Space presses an entry on its release; Up from the
  first entry of a menu with a search goes back to its field.
- Tab in an open list or menu — a select's, a context menu and its flyouts, a split button's, the choice lists — closes it and goes
  on from its opener (a package's popup: `closesOnTab` on `popups.open`).
- Escape is spent by each step of its chain: a tooltip on screen takes the first one, a side drawer leaves it to an open popup, an
  action bar spends the one it hides on, a toast holding the keyboard closes on it, the item clipboard takes it only while holding rows.
- The side drawer open over its backdrop is a modal dialog: `role="dialog"`, `aria-modal`, Tab kept inside it, named by its page's
  own name, else "Side panel" (`UIStrings.SidePanel`).
- Shift+F10 or the Menu key on a list opens the menu of the row under the keyboard's cursor, under that row; it opened none.
- One rule puts every menu away — a context menu, a split button's list, a flyout and a drawer: a press on an entry that runs
  something. A caption, a rule or the menu's padding no longer closes a context menu or a flyout, nor a group's entry a flyout, nor a
  disabled entry a split button's list.
- A page's chord on a caret's chord (Ctrl+Left, Ctrl+Backspace…) or on a field's own select-all, clipboard, undo or redo (Ctrl+A,
  C, V, X, Z, Y, Ctrl+Insert; ⌘ on macOS) no longer fires from a field: the key is the field's.
- Home, End and the page keys reach a virtualized list's, table's or wrap's real ends, the rows drawn as they are reached; in a
  windowed host Home and End scroll to the source's ends and land once that window is read. The clock's columns take PageUp and
  PageDown, a column's height at a time.
- A virtualized or windowed host keeps the keyboard's cursor on a row scrolled out of view or taken off the page by a window read:
  the row takes it back when drawn again, and an arrow carries on from it; a row whose cursor moved meanwhile takes nothing back. A
  filter that hides the cursor's row moves the cursor to the nearest row it shows.
- Shift with an arrow, a page key, Home, End or a press extends over a virtualized host's rows drawn or not, not only the drawn ones.
- A virtualized table draws only the rows in view, as a virtualized list does; it drew every row.
- An arrow, a page key, Home or End in a date or date-time field's popup calendar keeps the keyboard on the day it reaches, and Enter
  on a day keeps the popup open, as a press does: the redraw's dropped focus closed the popup as a field's let-go would.
- Every cell of a table says where its column stands among the columns shown (`aria-colindex`, `aria-colcount` on the table), so a
  reader hears a moved column at its new place and counts no hidden one.
- Shift+Backspace on a column's caption puts the authored widths back, as a double-click on its handle does.
- Delete raises only a removal the application wired (`data-ui-rows-remove`); in a list, a table or a tree with none the key is
  the page's. A removable, unpinned tab of a tabs view closes with Delete, as its cross does.
- A tabs view's movable, unpinned tab, and a horizontal or wrapping list's row, move with Alt+Left/Right; a wrap's row moves a line
  with Alt+Up/Down.
- **Breaking:** a table's column moves with Alt+Left/Right on its caption, as a row and a node move; Ctrl+Left/Right no longer
  moves it.
- The command bar is a toolbar (`role="toolbar"`): one Tab stop, the arrows along it round past its ends, Home and End; a field or
  a split button in it keeps its own keys.
- A key-value row's Save or Cancel gives the keyboard back to the row's Edit; F2 opens a closed row of a list that edits in place.
- In a list or a table, only the cursor row's controls are Tab stops; the cursor follows the keyboard into a row's control.
- A month chosen in a calendar's month pane opens its days on the day the keyboard was on, held to the month and the bounds.
- A badge's fill, `UIBadgeFill { Filled, Tinted, Outline }`: `BadgeComponent.Fill` and `IBadgeModel.BadgeFill`, so every text
  body's badge (a text's, a button's, a caption's, a menu entry's, a tab's, a tree node's, a checkbox's and radio's, `BadgeItem`)
  and `BadgeRenderer.RenderCountBadge(…, fill)` take it, bound or pushed. Unset keeps today's: a style fills, a colour tints.
  Tinted works for a style too; Filled with a raw colour writes its words by the colour's lightness; Outline is a 1 px edge inside
  the badge in the colour with its words in the ink lifted for a card; a Surface badge tinted or outlined takes the words around
  it; `Plain` ignores the fill. **Breaking:** a model implementing `IBadgeModel` itself (or `ITextBaseModel`, `ITreeNodeModel`,
  `ITabItemModel`) declares `BadgeFill`.
- A badge's words sit level between its edges wherever the badge stands: their baseline is held a whole pixel below its top (at a
  whole device-pixel ratio), as the browser rounds the baseline and the edges each on its own and a centred one fell a pixel low at
  some positions; its height keeps the parity of its capitals' height, where that whole pixel lands nearest their centre, and it has
  no block padding, so an icon given its own size sets the height alone.
- **Breaking:** a table acting as a grid — its rows chosen or pressed (`role="grid"`) — walks its cells: the root names the
  cursor's cell (`aria-activedescendant`, `data-ui-cell-focus`), Left and Right move along the row through every cell, Home and End
  go to the row's ends and Ctrl+Home and Ctrl+End to the first and last row, Up and Down keep the column, and the header is entered
  and left in the cursor's column. Enter and Space press a cell's one control, F2 moves the focus into the cell, and Enter on a
  cell with nothing of its own is the row's, as before; a package that edits a cell takes Enter, F2 or a typed character first
  (`ui-cell-key`). The row keeps the keyboard's wash and the cell wears its frame. A table that is only read keeps its row cursor.
- **Breaking:** a badge's colour no longer writes `color`, `--ui-badge-tint` and `ui-badge--tinted`; it writes `--ui-badge-color`,
  `--ui-badge-ink` (a theme colour's alone) and `--ui-badge-on` with `ui-badge--colored`, and the fill picks among them. A colour
  on a `Surface` badge drops its edge, as on any other style.
- A menu on a phone is a sheet from the bottom: below the small breakpoint (640 px) a context menu, a split button's menu, a tab
  strip's and a command bar's "…", the language and page size lists, a collapsed menu's group, and a select's and a multi-select's
  list open as one sheet along the bottom rather than beside their opener —
  full width, its top corners rounded, at most three quarters of the screen high, entries a finger's height, over a dimmed page a
  press on closes it, above the bottom bar and any dialog. It is modal: the keyboard goes in, the page beside it is hidden from a
  screen reader, Escape closes it and the keyboard goes back to its opener; every key of the lists' standard keeps working. A
  search's and a free-text multi-select's list, the pickers, a flyout, tooltips and the action bar stay beside their opener.
- A sheet has a grab handle and is swiped down to close: it follows the finger, closes past a third of its height or on a flick,
  and springs back short of both. A dialog shown as a bottom sheet that the viewer may dismiss takes the handle
  and the swipe too, and slides down as it closes.
- A list opened from a sheet's entry — a select group's choices — stands over the sheet at its height, sliding in from the side
  as the sheet slides out, a row on top naming the entry it came from; that row, Escape or Left slide it back with the keyboard on
  the entry (`UIStrings.SheetBack` names the row). A group's inline block stays inline.
- A dialog shown as a bottom sheet rounds its top corners by the theme's card radius, as a list's sheet does; a sheet at another
  edge stays square.
- A badge in a raw colour, tinted, outlined or plain, writes its words in that colour shaded to read 4.5:1 over its tint or none on
  the page, a card and a raised card, in both themes and on an application's own: darkened in a light theme, lifted in a dark one,
  its hue kept (`.ui-raw-ink()`; the theme's `--ui-ink-luminance-max`/`-min`). A light colour on a light page (#F2C94C was 1.3:1)
  and a dark one on a dark page no longer fade out. `WebCssValues.RoleInk` and the `roleInkCss` converter are what a badge writes
  inline; `UIColorContrast.Luminance` and `UIColorContrast.Composite` are new.
- A phone's sheet slides up as it opens, and a nested list slides in from the side and back, where an engine drew the list before
  it became a sheet; a closing sheet no longer shows for a moment in its plain look at the top-left corner: a lifted popup leaves the
  top layer once its exit has ended, not after a fixed time. A sheet sliding out takes no press.
- On touch, a part that both drags and has a context menu — a tab, a tree row, a list's row — opens its menu when held still, also
  where the browser's own drag starts first (Android); moving on without lifting closes the menu and the drag goes on, and a lift
  where it began leaves the menu open.
- On a phone what stands beside the drawer's button starts 8 px after it (a page header's name at 52 px, not 68); the band
  carrying the buttons is marked `data-ui-drawer-toggles` instead of found by `:has()`.
- **Breaking:** the default face is Geist (Vercel's Geist Sans, OFL 1.1, Latin and Cyrillic), not Inter: `UITypography.FontFamily`
  defaults to `"Geist"`, served at `/_ne/fonts/geist.woff2` and preloaded while the theme names it; Inter is no longer shipped, so an
  application that drew with it names it in its theme and serves it itself.
- A theme's text roles are written at the size nearest the authored one whose capitals stand an even number of whole pixels tall,
  by the new `UITypography.CapHeight` (the face's capital height over its size, Geist's 0.71; 0 and 1 refused) — Body 14.085 px,
  Subtitle 16.901, Caption and Overline 11.268 — so words centred in a control or a badge stand on the same middle as its icons.
  Line heights stay as authored.
- An empty field's placeholder no longer sets a small field's text a pixel low (an input is one line tall), and an underlined
  field's stepper is centred on its box.
- A button holding an open popup the pointer is in, a clickable surface under a control of its own and a tab's caption under a press
  on its close stay quiet by marks the client writes (`data-ui-popup-hover`, and `data-ui-inner-pointer` with `hover` or `press`),
  not by `:has()`: Chrome on Android no longer re-checks the page on every move over a list. `@ui-button-live` in the plugin stylesheet
  reads the first, so a package's popup quiets its owner when it opens through `popups.open`.
- A field's focus edge, a list's entry under a resting pointer kept quiet while the keyboard is on another, and a multi-select chip's
  keyboard frame read one mark the client writes, not a `:has()`: `data-ui-focus-within` (`pointer` or `keyboard`), on the focused
  element's ancestors up to its component root. The plugin stylesheet's `@ui-field-focus` and `.ui-entry-quiet()`
  read it, and `@ui-keyboard-within` names its keyboard half. A submenu's root class is `WebClassNames.MenuNested`.
- **Breaking:** `.ui-entry-quiet()` goes on the list or an element between it and the list's component root, where the mark reaches;
  on a wrapper above that root (a popup around a menu) it no longer quiets anything.
- What a text, a button and a card lay out by is written on the element styled or its root, not read off a part by `:has()`: a text
  body's root wears whether its badge shows (`data-ui-text-badge-icon`, `data-ui-text-badge-text`) beside its title, description
  and icon marks, the body where (`ui-text--badge-trailing`, `-inline`) and its description's role
  (`ui-text--description-<role>`); markup holding a fold marks its element (`data-ui-folds`); a button wears its label's alignment
  (`ui-button--align-*`); a required caption's row, an action bar's icon entry (`ui-action-bar__button--icon`) and a card's header
  (`ui-card__header--content`, `--action`, `--empty`) say so on themselves. Each is written by the operation of the property that
  decides it, first paint and patch alike; the card's header text ends each part's operations with `card-header-shown`
  (`WebTextBodyOptions.PartsShownOperation`).
- A theme's `FontFamily` is a family list: each name is quoted on its own and a generic family (`sans-serif`, `system-ui`, …) left
  bare, where the whole list was one quoted name the browser never found (`"Geist, sans-serif"`).
- **Breaking:** `TextContentRendererBase.RenderDescription` takes the text body it stands in, which wears its role; a hand-built
  `.ui-button` no longer moves its label by a `.ui-text--align-*` inside it — the button wears `ui-button--align-*` itself.
- What a list's row is styled by is a mark, not a `:has()` over its parts, so a press in a list no longer re-styles the page on
  Chrome for Android: a row whose template root is disabled or loading carries `data-ui-row-idle` (`WebAttributes.RowIdle`, written
  by the render and kept by the `row-idle` operation that ends Enabled's and Loading's, by a row the client builds and by
  `states.setDisabled`), the row an action bar stands over `data-ui-row-bar`, a table with a pinned column `ui-table--pinned`, a
  windowed list's root its host's `data-ui-window-pending`, an open key-value row's input cell `data-ui-boxed-editor` while its
  editor draws a box, and a validation dot's cell and a field speaking in a mark `data-ui-tooltip-mark`.
- **Breaking:** the plugin stylesheet's `.ui-row-bar(@host; @row; @via)` takes no `@bar`: it reads the row's `data-ui-row-bar`. Its
  `@ui-row-live` reads `data-ui-row-idle`, so a row a package draws itself carries that mark to stay quiet while its template is off.
- What the shell is, the stylesheet reads off marks the page is rendered with, not a `:has()` over its regions: the document carries
  `data-ui-scroll-content` beside the root, and the root `data-ui-left-bar` where the left side is the phone's bottom bar (a page's
  own button for that side goes) and `data-ui-content-fills` where the content's root fills the height (a messenger keeps its own
  scroll on a phone), a bound `Height` by its value and kept as it changes.
- What an input is styled by is its own state or a mark, not a `:has()` over its parts: a toggle's guard stands on its input, a
  radio option off by its template reads its row's `data-ui-row-idle`, as a full multi-select's refused option does to dim only where
  its template does not, a read-only file field its root's `ui-readonly`; an image input shows its picture by its root's source or
  preview mark, a shelf holding a square carries `data-ui-image-tiles`; the opacity slider's row is
  `ui-color-input__slider--opacity`, a temporal row holding its calendar's toggle `ui-temporal-input__row--picker`; a
  multi-select's chips host says a chip stands (`data-ui-select-chips`, the render and the client) and a free-text field's
  placeholder follows its entry; a select's list carries `data-ui-list-keyboard` while the keyboard holds its current option, a
  field under a drop `data-ui-drop-boxed` where it draws a box, and a tooltip with a link `ui-tooltip--linked`.
- What a menu, a trail, a command bar and a tab strip are styled by is a mark, not a `:has()` over their parts: a group holding
  the current entry carries `data-ui-menu-holds-current` (the render, then the `menu-current` operation after an entry's Selected
  and the group engine as rows come and go), a caption's or a rule's row `data-ui-menu-passive`, an entry showing a value or a
  chord `data-ui-menu-item-value` or `data-ui-menu-item-shortcut`, the popup a menu fills (a right-click menu's host, a split
  button's list) its Surface's word in `data-ui-menu-surface` (the `menu-surface` operation after Surface), a trail's step wrapper
  the tiers it is collapsed in and those it is the last shown step in (`data-ui-step-collapsed`, `data-ui-step-end`, rendered and
  kept by the engine) and a tabs view none of whose tabs closes `data-ui-tabs-none-removable`. A trail's text separator no longer
  stands after its last shown step when the steps after it are collapsed.
- No stylesheet the framework or a package ships uses `:has()`, and a test holds every built one to it; a table's caption carries
  `data-ui-inner-pointer` while its column's edge has the pointer, and the plugin surface's `names` gains `textDescription`.
- A chosen row of a table with pinned columns and grips at the start no longer keeps a row line under its grip alone.
- A submenu opened from a split button's list stands 4 px off that list, as from a context menu or a menu button's flyout, rather
  than over its edge.
- A checkbox's, a switch's and a radio option's hidden input stands in its own box: a press on one far down a scrolled page no
  longer scrolls the shell's root to an input placed by a far ancestor, nor jumps back when it goes (a row editor's switch).
- A list, a table, a tree and a data grid reached by Tab show the keyboard's cursor at once — on its last place, else the chosen
  row, else the first — rather than nothing until the first arrow.
- **Breaking:** the shell no longer renders a "Skip to content" link before its regions (it stood over the menu on the first Tab);
  the landmarks are the way past a side. `UIStrings.SkipToContent`, `WebAttributes.SkipLink` and the plugin stylesheet's
  `@ui-z-skip-link` are gone.
- A checkbox or a switch with no words is its box alone: no gap is kept for its empty text, so it stands centred or flush where
  it is aligned. A badge shown alone counts as words and keeps the gap.
- **Breaking:** `TextContentRendererBase.IconOnlyButtonAttribute` is gone (`WebAttributes.TextIcon`, which it named), and so are
  `WebClassNames.TextBadgePlacement` and `WebDomConverters.TextBadgePlacementClass`: a badge's placement is written on its text body
  alone (`ui-text--badge-trailing`, `-inline`).
- `UIPluralRules.FormKey` writes a plural form's key (`files.few`); `CompiledView.FindRegion`, `UIComponentGraph.GetItemScopes` and
  `WebResponsiveCss.TierWord` are the one lookup of a view's region, a component's row scopes and a tier's word.
- In a test, a dialog the controller opens or closes through the dialog service is listed in the page's `Effects`, as the browser
  runs it; `UITestPage.Words` writes a number and a flag as the page does (`1.5`, `true`), and a field's bounds compare numbers as
  the page does, any numeric type included.
- **Breaking:** a view whose items host sets `WindowSize`, or whose pager offers a page size, past 1000 rows fails its compile,
  and the web hub no longer clamps a window read to 1000 rows: it refuses one, as every other host does.
- A TabsView switch fades the shown page's content in, not the page, whose top edge is the strip's rule: the whole rule no longer
  blinks.
- A chosen row's action bar and its right-click menu answer the pointer again: the row's quiet-button rules stop at the floating
  layers a row holds (its bar, a menu, a control's popup), which they had taken every hover off.
- An Underline field's focus and open list double its rule inward in the brand's colour, as Filled's line does: recoloured at one
  pixel, the focused rule read dimmer than the rule at rest on a dark page.
- A number's and a clock's step arrows answer a press with the pressed wash under the ink, stronger than their hover, and a finger
  sees it; an expander's header inks its chevron under a press and takes the press's wave across its band.
- The theme switcher and the language switcher name themselves on hover, by their own words, where the author gives no tooltip.
- Every caret field's placeholder wears the muted ink a select's placeholder does: a text, number or area field showed the
  browser's own grey beside a select's.
- A horizontal Items view stands its rows 16 px apart, at the top, level with their group's caption: they ran their words together
  and centred far under the caption.
- **Breaking:** `ItemsViewComponent.Spacing` registers no default (it was 0): unset, the stylesheet decides by the shape — none down
  a column or a wrap, 16 px across.
- A horizontal radio group with grouped options gives each group's caption a line of its own over its options, its rule back, and
  stands its lines as close as a column's options.
- A single-choice tree, items view or table shows the keyboard's frame on its row as every other list does.
- A colour input's swatch says it is open (`aria-expanded`) rather than the hidden field's pipette, and answers the pointer and a
  press as a filled button does, with the press's wave.
- On a phone's sheet: a multi-select's option keeps its check on its words' line at a finger's height, a menu's link entries are a
  finger's height too, the page sizes start at the sheet's edge, a nested menu stands in the sheet's padding on both sides, and a
  Small select's list takes the list's own type rather than caption print.
- A command bar that wraps keeps its lines together in its middle rather than spreading them over its height.
- A side sheet with a width wider than a phone stops at 85% of the screen, as the side drawer does, leaving a strip of the page to
  tap.
- A flyout opened by a press takes the focus on its panel, as the side drawer does: its first field no longer lit its edge or raised
  a phone's keyboard. A key still gives the focus to its first control.
- The keyboard's frame marks every plain pressable, as it marks a list's entry: a button (in the words' own ink on a filled one), an
  action, a link (round its words), an expander's header, a clickable card, a breadcrumb, the page switchers and a collapsible's
  switch; a checkbox, a switch and a radio option wear it round their whole row, box and words. Only a focus a key gave draws it,
  and a panel that clips its children leaves it its 4 px reach (`overflow-clip-margin`), so it is never cut.
- The keyboard's frame is one shape everywhere: a 2 px line whose corners are the theme's button radius
  (`@ui-keyboard-frame-radius`), on a row, a cell, an entry, a calendar's day, a button, a card, a toggle's row, a link and an
  expander's header alike; a host with no corner takes the frame's while framed, a card's insets it
  (`.ui-keyboard-frame-inside()`, `.ui-keyboard-frame-outside()`). An expander's rule under its header is its content's top edge
  now, coming with the content as it unfolds.
- **Breaking:** the plugin stylesheet's `.ui-keyboard-frame()` and `.ui-entry-keyboard()` round the element they frame to the
  frame's corner while framed; `@takes: false` keeps the element's own.
- A popup with no room on either side of its axis takes the larger side, capped to its room and scrolling inside, rather than being
  clamped over the anchor it opened from (a long code panel on a phone).
- On a touch screen a finger held still on a control with a tooltip and no context menu shows its words until the next press, and
  the release presses nothing; the page header's one cut line on a phone (`UIPage.Header`) carries its whole description as its
  tooltip.
- `SplitButtonComponent.MenuPlacement` says where the menu opens against the button, below from its end by default.
- A vertical menu where some entries carry an icon keeps the icon's room on the others, so every entry's words start on one edge
  (`data-ui-menu-icons` on the host, kept as icons and rows change).
- `ParagraphComponent.FieldNote` (set by `UIForm.Field`) starts a note under a field where the field's words and its message do.
- The menu's search (`MenuComponent.SetSearch`) is a Tonal field, not an Underline one.
- The page's tooltip shows nothing for an anchor not laid out, and goes once its anchor leaves the page (a redraw on a phone). The
  plugin surface shows a package's words as written (`tooltips.show(target, words, { plain: true })`) and makes a caption or a value
  safe among words a tooltip reads as inline markup (`tooltips.escape(text)`).
- A checkbox, switch or radio answers a hover more quietly: its ring goes a quarter of the way to the ink, a chosen box leans 5 %
  toward it; a press goes twice as far.
- A list's current entry the pointer stood on no longer wears the keyboard's frame while its popup fades out after a press outside.
