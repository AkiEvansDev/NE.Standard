# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.5

- A select, a multi-select and a search are cleared from the keyboard: Delete on a closed field that shows its clear empties it,
  and Backspace too where the field holds one option (a multi-select's Backspace still takes its last chip, a free-text entry's
  keys stay its text's while it holds any). The clear itself takes no Tab, as a select's field is a button; the control says the
  key (`aria-keyshortcuts`), kept as a bound `ShowClearButton` changes.
- Escape nothing took — no list, popup or dialog left to close — takes the keyboard's frame off the focused control, the focus
  staying where it is: Tab goes on from there, and the next key draws the frame again. An editable field keeps its edge.
- A badge select (`BadgeSelectComponent`): a multi-select whose options are badges — a ticket's labels, a contact's tags — and
  whose chips are those badges, the remove inside each. An option is an `OptionItem` with its badge set: `BadgeText` the words,
  `BadgeStyle`, `BadgeColor`, `BadgeFill` and `BadgeIcon` the look, a `Description` under it in the list, which draws each badge at
  the start of its row; the shape `BadgeItem` gives `UIText.WithBadges` to read. Read-only, it stays a field. A chip on the first
  paint is drawn from the option's values (`BadgeRenderer.RenderBadge(badge, model, words, renderWords)`), and the page's from the
  badge its option's row draws, so a bound look reaches it.
- **Breaking** (for a package's renderer): `BadgeRenderer.IconShownAttribute` is `WebAttributes.BadgeIcon`, as the page reads it now.
- A row's own context menu is drawn when it is wanted — opened by a press, a long press or the keyboard, pressed by an entry's
  chord, shown as the row's action bar — rather than into every row (#202): it was two thirds of a feed's row, most of its
  bindings, and of a switch's work. The server leaves it in an inert template and marks its owner; the page takes a row
  template's out once and draws it from there against the row, and a row the server drew moves its own in. The menu's
  collections addressed to a row are held meanwhile, and a patch to an entry (a pin's words) is kept for the menu drawn later;
  its chords are named before it is drawn. In the demo's chat a row went from 132 elements to 45, and a switch to a
  30-message conversation from a 66–81 ms task to none over 50 ms. A named menu (a strip's, a canvas's) stays as it was.
- A pane's title row (#204): `UIPage.Header(UIHeaderSize.Pane, leading, title, description, trailing…)` and
  `BoundHeader(UIHeaderSize.Pane, …)` — the name one line in the subtitle role, cut with its whole words as its tooltip, the
  description a muted caption beside it, the far end on the same row at every width, no edge of its own; a leading Back, a round
  picture or both before the name. `ShownBelow(tier)` / `ShownFrom(tier)` show any component on one side of a breakpoint.
- A bound header's name (`UIPage.BoundHeader`) is the thing's own words, never looked up as a key that happens to match it.
- `UIButtons.Toolbar` takes any button, a menu button (`UIIconButtons.More(items)`) among them.
- More standard actions, as entries and icon buttons alike: **More** (`UIIconButtons.More(items)`, the vertical ⋮ as a menu
  button with no chevron; `UIMenuItems.More(items)`, a submenu), **Refresh**, **Search**, **Filter**, **Settings**, **Share**,
  **Download**, **Upload**, **Rename**, **Add**, **Remove**, **Send**, **Attach**, **Menu**, **Stop**, **Undo**, **Redo** and **Sign out**,
  in the framework's words in English, Russian and Chinese (`ui.action.*`). Add puts one more in a list under the plus New wears too;
  Remove takes one out under the minus and keeps it, where Delete destroys it. Three glyphs join `UIGlyphs`: `Share`, `Send`, `Rename`.
- **Breaking:** the tab menu's Rename is the standard one: its words are `ui.action.rename` (the `ui.tab.rename` key and
  `UIStrings.TabRename` are gone) and its glyph `UIGlyphs.Rename` rather than the pencil.
- Children laid in one cell stand as their order reads, the later over the earlier (#205): a pinned bar or a composer laid after an
  items view in its cell stands over the rows scrolling under it. A list with a loading ring (`LoadingLook = Indicator`) or a
  button was positioned, and painted over every static sibling whatever their order; every child placed in a container, a surface
  or a card's, an expander's or a tab's band now is, at no weight, so a component's own placement (a dialog's, a sticky
  band) stands and nothing changes at rest.
- **Breaking:** a box keeps the overlay bar's room itself (#206): on the side the bar stands, its edge is its `Padding` there or
  `--ui-scrollbar-room` (12 px, a theme's stylesheet may change it), whichever is more — a list padded 12 on both sides stays even,
  the thumb inside its padding, and one padded 4 is widened to 12. An items view, a tree, a scroll container and a text area keep it
  whether or not they hold more than they show, so their rows never narrow as they start to scroll; the root of a region that
  scrolls (or stands along a scrolling page's bar) keeps it, with no `Padding` too; a popup list keeps it only while it
  overflows, so one that fits stays even. A screen where nothing hovers keeps none. No application pads for the thumb: a
  `Padding` added only to clear the bar can be the air it wants. Every container's `Padding` is written in this one form
  (`WebCssValues.Padding`, `ResponsiveRenderer.ApplyResponsivePadding`); `.ui-popup-scroll(@padding)` takes the popup's padding.
- A container lends the free air after it to the scroller along its end (`ContainerComponent.ScrollbarAir`, per breakpoint): the
  scroller keeps none of the bar's room inside and hangs it past its box, where the thumb is drawn, so a list's rows end where the
  field over them does. It reaches the scroller through containers and stacks with no padding, border or fill of their own, and a
  framed or filled scroller keeps its room inside. `UILayout.Panes` lends the air between its panes to the list's scroller from
  `md`; with a splitter, the bar's room stands on either side of the track (it was 4 px). The overlay thumb is seen through a
  clipping box's `overflow-clip-margin`.
- The overlay bar shows while the reader scrolls — a wheel, a key, a drag of the thumb — and while the pointer nears the edge it
  stands at, then fades; no longer all the while the pointer rests over a feed being read, nor as a script scrolls (a list held at
  its end as a reply streams in).
- An items view's column can be capped: `ContentMaxWidth` (responsive) centres the rows within it inside the view, so the bar
  stands at the region's edge rather than beside the words — a conversation's or a document's column in a wide pane.
- A quiet expander's keyboard frame (`UIExpanderVariant.Quiet`, `UIPage.Fold`) stands clear of its words (#207): its header keeps
  air round them, 4 px above and below and 6 px at the sides, pulled back out by as much, so the words stay on the content's edge
  and the frame, inside the air with the button's corner, no longer touches them. A clipping component leaves a frame 6 px past
  its edge, up from 4. A quiet expander is square unless a radius is authored: the clip kept the card's curve, which cut the
  frame's corners — on both sides of a fold no wider than its words.
- An items view reports the row at its foot as well as at its top (#203): `LastVisibleKey` / `BindLastVisibleKey(path)` is the key
  of the last row whose box shows above the scroll's bottom edge, past the view's bottom `Padding`, bound one way from the page and
  written as `FirstVisibleKey` is — once the scroll settles, after the first layout, as the rows change or a filter hides some. A
  pinned bar over a messenger's feed follows it, so a pin in the last screenful shows. A view bound at both ends measures its rows once.
- **A file as a tile** (#201): `FileTileComponent` — the file kind's glyph (`UIFileGlyphs`, or its own `Icon`), the name on up to
  two lines and whole as its tooltip, and the size written by the page in the reader's language — a 6rem square unless its `Width`
  says otherwise; `Loading` turns a ring in the glyph's place, and `Clickable` / `OnClick` press it as a surface is pressed. An image
  input's shelf draws a file that is no picture in the same tile (`ui-file-tile`), whose ring now turns in the glyph's place too
  while it uploads, its name and size readable; the size follows a language switch.
- A switch to another runtime of the route paints sooner (#202): a third less of the long task it raised in a conversation of NE.Home's
  (Chromium, desktop: 139 → 92 ms and 153 → 95 ms, the median of five). An engine watching the page looks once into a host its
  rows were put in one by one, not once a row; a windowed list writes its skeleton's row and tile sizes on its spacers rather than
  on the host, whose every row an inherited property restyled on each layout; the content a switch turned inert takes its presses
  back as the snapshot lands, in one restyle with it rather than a second; a pager looks over the page once for every host found.
- A press's wave keeps moving while the page is busy (#202): a runtime's page applied after the press no longer stops it half-way.
  The wave is an element of its own while it plays, the pressed thing's last child, and only its circle's scale and its opacity
  animate, which the browser's compositor runs alone (Chromium, a 300 ms task: 21 frames drawn where none were). It looks as
  before. A table's column lines end at the last cell rather than the row's last child.
- A copy of a tab ("Duplicate tab", a window the page opens) takes a window of its own, so a `PerWindow` page no longer shares
  the original's runtime; a copy made while the original sat in the back/forward cache reloads once under its own.
- A pane's grip is named after the pane ("Move Chats", from its first title-sized text) and its keyboard lift is announced; every
  keyboard move of a row, a tab or a pane says where it landed (`ui.move.done`, the `ui.pane.*` words in English, Russian and Chinese).
- A clock column's arrows walk without choosing; Enter or Space picks the time, as the day grid's do.
- A date-time input writes its value's offset back (a fresh value the reader's), and a `Min`/`Max` carrying an offset is compared
  by instant on the page, as on the server.
- A whole-number property refuses a fraction, from a number or from text, rather than rounding it.
- A transparent `Background` writes `--ui-ground: inherit`: a chart's hollow marker or a picture's dim on it shows the ground around
  it (`WebCssValues.ThemeGround`, `WebDomConverters.ThemeGroundCss`).
- A region's root keeps the overlay bar's room once — never 12 past 12 over a list's or a tree's own, nor in a rail or a collapsed
  panel, nor in a root filling a side that scrolls alone.
- A text area in a row stands on the row's middle at its own height rather than stretching to the row's.
- A search field's pause is committed as the reader leaves, as a debounced field's is; a composition holds both.
- A converter or a DOM operation that throws is logged and passed over — the value written as it came, the property's other
  operations run — and a row that fails to draw is left out rather than stopping the patch.
- A view whose first compile failed is compiled again on the next open rather than refused until a restart.
- `PopupPlacement` is bindable and is one property on a flyout, a select and a split button.
- The plugin contract's `shortcuts.aria(chord)`: a chord in the UI Events words `aria-keyshortcuts` takes, `Control+B Meta+B` on macOS.
- New presets: `UILayout.Panes` (with `PanesListVisibility`, `PanesDetailVisibility`, `PanesPlaceholderVisibility`), `UILayout.Ends`
  and `UILayout.Board`; `UICard.Create` and `UICard.Centered`; `UIPage.Empty`, `Outcome`, `Band`, `Column` (`UIColumnWidth`),
  `Heading` and `Section(heading, …)`; `UIDialogs.Form` and `BoundConfirm`; `UIText.Person` (`UIPersonSize`); `UIDetails.Amount` and
  `Total`; `UIHeaderSize.Strip`; `UIPage.Labelled(…, wrap: true)`.
- **Breaking:** `UIButtons.Secondary` is `UIButtons.Outline`; `UIButtons.Pair`'s first parameter is `safe`.
- **Breaking:** `UIPage.Card` is `UICard.Create`; a `cref` to `UIPage.Section` names its overload.
- **Breaking:** `FlyoutPlacement` and a split button's `MenuPlacement` are `PopupPlacement` — `SetPopupPlacement`,
  `BindPopupPlacement`, `IPopupPlacementComponent.PopupPlacementProperty`.
- **Breaking:** a tabs view's `OnItemRemove(command, argumentName)` and `OnItemRename(command, argumentName)` are
  `OnItemRemoveWithItemKey` and `OnItemRenameWithItemKey`; `OnItemRemove(command)` still compiles and passes no key.
- **Breaking:** an application's tab-menu entry is raised on the tab: `UITabMenu.Entry` is the event's value and `UITabMenu.Tab` the
  current item's key — a reader of `ArgEventKey(…, 0)` or `(…, 1)` takes them instead; an entry on a disabled, loading or hidden tab
  is refused at any nesting.
- **Breaking:** a row is named by its key: a number or null where a row's key stands is refused.
- **Breaking:** the `ui:` tab commands (a move, a pin) pass the command authorization, the application's command filters and the
  controller's class-level filters.
- **Breaking:** a route's identity values are escaped as `encodeURIComponent` escapes them: a runtime kept under a value holding
  `&`, `=`, `,` or a non-ASCII character is keyed anew.
- **Breaking:** `IUIDialogService` is no platform service — nothing registers or requires it, `Context.Dialogs` sends through the
  runtime — and `StandardWebDialogService` is gone.
- **Breaking:** a platform provides `IUIDownloadStager` rather than `IUIDownloadService` (`UIStartupBase` requires it; Core
  registers `StandardDownloadStager` over the platform's `IUIDownloadAddressProvider`); `StandardDownloadService` is gone.
- **Breaking:** `SetThemeColorsEffect.Css` and `SetLanguageEffect.Href` are gone (the Web writes its own as it sends);
  `UIThemeColor.ToString()` writes no CSS.
- **Breaking:** `Spacing` and `Orientation` come from the `ISpacingComponent` and `IOrientationComponent` blocks — the names kept,
  the property keys read through the interfaces.
- **Breaking:** `SetDragHandle` is an extension over `IDraggableRowsComponent` (`NE.Standard.UI.Authoring.Components`), whose
  `DragHandle` and `DragHandlePlacement` are settable.
- **Breaking:** `UITestComponent.SetValueAsync` and `SetAsync` return `Task<UITestCommandResult>`.
- **Breaking:** the date-time input's canonical text carries the offset.
- **Breaking:** `[UIAuthorize]` roles or permissions that name nothing (`","`, `" "`) are refused rather than read as none.
- **Breaking:** a `DefaultValueMember` is type-checked (`NEUI004`), and a method one is called (`NEUI009` for a `void` one).
- **Breaking:** an event argument reading a row its component does not stand in fails at compile; `UIEventIndex`'s constructor
  takes the `UIComponentGraph`.
- **Breaking:** a text area with `SubmitOnEnter` and an `enter` interaction is refused at compile — drop one.
- **Breaking:** `ItemContext` reads an `IDictionary`-only item (an `ExpandoObject`) by camelCase and case-insensitive key too, never
  an indexer as a property `Item`, and only the exact name where two properties differ in case.
- **Breaking:** `ItemsCollectionRendererBase.ApplyHostScroll(context, host, horizontalOperations)` takes a `WebDomOperation[]`
  starting with `HostScrollXOperation`.
