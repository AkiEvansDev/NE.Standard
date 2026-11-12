# The components

Every component the framework and its add-ons ship. A built-in's page lists every property with its `Set*`/`Bind*`, its events
and its methods: `https://akievansdev.github.io/NE.Standard/components/<kebab-name>.html`, the name without `Component`
(`DateTimeInputComponent` is `date-time-input`). The index is https://akievansdev.github.io/NE.Standard/components/index.html,
with the item models and the enums on their own pages beside it.

## Layouts

- `ContainerComponent` - the 24-column grid: `SetColumn`/`SetRow`/`AddRow` (each track per breakpoint: `md:`…), a child's
  `SetPlacement`, `SetScrollbarAir`.
- `StackPanelComponent` - children along one axis (`SetOrientation(Vertical, md: Horizontal)`) with `Spacing`; `GlyphEdge` (an end
  icon or quiet words on the edge), `FirstLineOnControl` (its first child's first line on a button's middle), `FirstChildAsCaption`
  (its first child in a field's caption row: a label over a control).
- Layout values are responsive: `Orientation`, a button's or an input's `Size`, an items view's `LayoutType`, a grid's tracks,
  `HorizontalAlignment`/`VerticalAlignment` take per-breakpoint values. A control with no caption (a button, an untitled input, a
  switch, a button group, a panel of them) beside a field that is captioned itself (a titled input, a field switcher, a labelled
  panel, a field and its hint) stands level with its box automatically, in a non-wrapping stack running across or on a grid's row;
  never a card or a list, never beside a column of fields, never in a wrapping panel of your own - `UILayout.Row` does it itself
  (`AlignWithFieldBoxes`; `None` or an authored `Margin` opts out).
- `WrapPanelComponent` - children flowing onto further lines; `ItemMinWidth` keeps them in even columns.
- `ScrollContainerComponent` - scrolls its content either way; `SetScrollGroup` to scroll with another, `SetScrollFade(true)` for top/bottom edge fade masks while scrolled (shared by `ItemsViewComponent` and `TreeComponent`). Because a scrolling host is a scrollport (`overflow: hidden/auto` ignores `overflow-clip-margin`), pad inside (or on) a custom `ScrollContainerComponent` horizontally when a `GlyphEdge` band hangs a button past the edge or when `SwitchComponent` / `CheckboxComponent` (`::before` `inset: -2px -6px`) or a quiet `ExpanderComponent` (`UIPage.Fold`, `margin-left: -6px`) stands at `x = 0` (`UIDialogs.Create` / `Form` scroll bodies and unscrolled `ItemsViewComponent` hosts with both scrollbars disabled grant the `8px` reach automatically).
- `SurfaceComponent` - one framed region (fill, edge, radius; `OnClick`/`OnClickWithItemKey` makes it pressable, `OnClickShowImage`,
  `SetUrl` makes it a link; `SetClickable(false)` turns a click off; `BackgroundImage`, `BackgroundImageBlur`, `BackgroundImageDim` — `BackgroundImageDim` mixes `--ui-color-background` over the image so it adapts automatically to both Light and Dark themes; for a translucent reading column over a background-image surface in both themes, use a child `SurfaceComponent` with `SetVariant(UISurfaceVariant.Background)` and `SetColor(UIThemeColor.Create(light, dark).WithOpacity(factor))`).
- `CardComponent` - a surface with a header and footer band; `CardHeaderRegion` draws its header.
- `ExpanderComponent` - a header that folds its content; `ExpanderHeaderRegion` draws the header, and `SetHeaderAction`/`SetHeaderActions` places interactive controls outside `<summary>` at the far edge while expanded. `OnExpand`/`OnCollapse` (with
  bound or literal arguments: `OnExpandLiteral`/`OnCollapseLiteral`) on a person's fold, as on every `IExpandableComponent`.
- `AccordionComponent` - expanders of which one is open at a time.
- `CollapsiblePanelComponent` - a panel folding to an edge (a sidebar, a properties pane, a log) with its own switch; a press on
  it raises `OnExpand`/`OnCollapse`, a pushed `Expanded` neither.
- `FlyoutComponent` - a popup anchored to another component; its panel is named by the anchor's button unless `AccessibleName`
  names it; `IsOpen` two-way, `OnClose` only for a person's dismissal (the anchor, a press outside, Escape), never the page's take-down.
- `GridSplitterComponent` - a dragged track boundary; `BindPosition` keeps the share in the controller.
- `PaneContainerComponent` - panes the reader moves between places by a grip; `AddPane`, `BindLayout`.

## Contents

- `TextComponent` - an icon, a title, a description and a badge, one line each unless told to wrap; `TitleType` is its role, `SetHeadingLevel(1..6)` renders `.ui-text__title` as `<h1>`–`<h6>`, and `SetRenamable(true)` / `BindRenamedTitle` / `OnRename` (or `UIText.Editable` / `.Editable(...)`) opens its title for inline editing on double click, `F2` or `RenameItemEffect(target)`.
- `ParagraphComponent` - text meant to be read, wrapping, `MaxLines`.
- `IconComponent`, `ImageComponent`, `BadgeComponent`, `SeparatorComponent`. A picture with no picture - no address, an empty one,
  one that fails - draws a glyph (`UIGlyphs.Person` in a circle, `UIGlyphs.Image` otherwise); `IconFallback`
  replaces it, and an image tries `FallbackSource` first.
- `LinkComponent` - an address the platform opens (only safe schemes survive).
- `StatusComponent` - a page's state in place of its content (not found, refused, failed); `UIPage.Status` builds it.
- `TimestampComponent` - a moment in the reader's zone and language, a day, a time or how long ago, kept current by the page.
- `FileTileComponent` - a file as a tile: glyph, name, size; `OnClickWithItemKey(command)` for a row's tile, `SetUrl` a link to the file. The same size in any
  other text is a `UIFileSize` phrase argument.
- `KeyValueActionComponent` - key/value rows with an optional trailing action (`KeyValueActionItem`), edited in place with `EnableEditing` (an unnamed value-input template is named by `Key.Title`); `UIDetails` builds lists.

## Actions

- `ButtonComponent` - `OnClick`, `OnClickWithItemKey`, `OnClickShowingLoading`, `OnSubmit(formId, command)`,
  `OnSubmitShowingLoading(formId, command)`, `SetVariant(UIButtonVariant.*)`, `SetShortcut`, `SetUrl` (the button's look on a link).
- `ActionComponent` - a full-width row that runs a command, with a chevron and a value; the row a list jumps to (`SetUrl`: a link).
- `SplitButtonComponent` - a main press and a menu at its end.
- `CommandBarComponent` - a toolbar of button items that folds what does not fit; a standard one is
  `UIStandardAction.Delete.ToButtonItem(id, variant, iconOnly)`, as `ToMenuItem(id)` is a menu's.
- `ThemeSwitcherComponent`, `LanguageSwitcherComponent` - the reader's theme and language, as a button (`ButtonVariant`) or a
  field (`AsField()`, its box `FieldVariant`).

## Inputs

All share `Value` (two-way), `Title` (the caption above), `SetHelp`, the validation rules and `OnChange`/`OnBlur` (with bound
arguments, or literal ones: `OnChangeLiteral`/`OnBlurLiteral`). A field with a box
(`IFieldInputComponent`: text, number, select, date and time, file, colour, image) takes `Appearance`
(`UIInputAppearance.Filled`/`Outline`/`Underline`/`Ghost`); a checkbox, a switch, a radio group, a slider and a calendar have none.

- `TextInputComponent`, `TextAreaComponent` (inline `@`/`/` trigger suggestions and pill tokens via `AddTrigger`, `SetTriggerItems`/`BindTriggerItems` of `UITextTriggerItem`, `OnTriggerSearch`, `OnTriggerSelect` and `OnTriggerClick`), `NumberInputComponent`, `SliderComponent` (one value or a range; its value on `Step` from `Min`, 1 unless set).
- `CheckboxComponent`, `SwitchComponent`, `RadioGroupComponent` (`ItemMinWidth` stands its radios in even columns, as a wrap
  panel's children).
- `SelectComponent`, `MultiSelectComponent`, `SearchComponent` (a select with a popup search field; `OnSearch` asks the server, and `SetAllowFreeText()` lets `Enter` in the popup search field commit a typed value not in `Options`; all three take in-field `AddLeadingAction`, `AddTrailingAction` and `SetTrailingAction` buttons or button-anchored `FlyoutComponent`s). A
  multi-select's `SetVariant(UIMultiSelectVariant…)` draws it as `Chips` (the default), `Badges` (each option its badge, chosen
  into the field as the badge) or `Checkboxes` (a box per option in place, no list; `Orientation`/`Spacing`/`ItemMinWidth` as a radio group's;
  no free text or field actions) or `Button` (a compact button trigger with `ButtonVariant`, icon/title and an automatic chosen-count badge when `Value.Count > 0` that opens the multi-select popup and also fits in `TextInputComponent`/`TextAreaComponent` field actions; no free text or field actions of its own). `SetVariant` installs the variant's option template unless one of your own is set.
- `DateInputComponent`, `TimeInputComponent`, `DateTimeInputComponent`, `CalendarComponent` (a month in place, a day or a period).
  A period (`SetIsRange()`) keeps its ends `SetMinDistance(TimeSpan)` apart, as a range slider keeps its handles; a date's in whole days, a time's under a day.
- `ColorInputComponent` - a colour picked freely in an always-available picker (`#RRGGBB`, or `#RRGGBBAA` with `SetAllowOpacity(true)` to expose the alpha channel slider), with `ShowPalette` optionally adding a palette tab and `Picker | Palette` switcher.
- `FileInputComponent` (`UIFileInputVariant`: `Row`, `Tiles` or `Shelf`, binding `SelectionId` or `SelectionIds`), `ImageInputComponent` (`UIImageInputVariant`: `Picture`, `Avatar` or `Inline`, plus `SetMultiple(true)` for a multi-picture shelf) - upload on pick.

## Items

- `ItemsViewComponent` - a collection held whole, virtualized or windowed from a source (`BindSource`), grouped, scrolled,
  laid out any way (`Vertical`, `Horizontal`, `Wrap`, `Accordion` — single-expand coordination and connected borders across visible `ExpanderComponent` rows); `SetTemplate`, `AnchorToEnd`, `SetLoadingLook`, `SetShowEmptyTemplate(false)` (collapses the host root when empty so nested tag or attachment lists leave no parent gap).
- `TableComponent` - rows under a header, a template per column (`AddTextColumn<TRow>(caption, r => r.Prop)` or custom template), filters and sorts by rule, selection (`SelectionMode = Many` adds a leading checkbox column with `Shift+Click` range selection and a three-state select-all header box); each row named by its
  header cell, the first captioned column or `SetRowHeaderColumn(key)`.
- `TreeComponent` with `TreeNodeComponent` - thin rows with a glyph and a title over `TreeNode` items; inline rename
  (`RenameItemEffect`), moves; for a small set or folders loaded as they open (`HasChildren` + `OnItemUnfold`), never virtualized.
- `PagerComponent` - the pages of a paged list (`SetPaging(true)` on its list).

Built-in item models: `TextItem`, `TextBaseItem`, `ButtonItem`, `MenuItem`, `TabItem`, `BreadcrumbItem`, `BadgeItem`,
`OptionItem`, `UIOptionValue`, `UIValueItem`, `FileItem`, `KeyValueActionItem`, `TreeNode`. Default templates draw them:
`DefaultTextTemplate`, `DefaultButtonTemplate`, `DefaultActionTemplate`, `DefaultMenuItemTemplate`, `DefaultTabItemTemplate`,
`DefaultBreadcrumbItemTemplate`, `DefaultFileTemplate`, `DefaultGroupTemplate`, `DefaultKeyTemplate`, `DefaultValueTemplate`,
`DefaultRowTemplate`, and `DefaultEmptyTemplate` for an empty list.

## Navigation

- `MenuComponent` with `MenuItemComponent` - navigation entries and nested submenus (`SetSubmenuDepth(1..4)`, auto-sized for static items), folding to icons or standing as a rail (`UIMenuDisplay.Rail`);
  its switch raises `OnExpand`/`OnCollapse`, a section of entries opening neither.
- `TabsComponent` with `TabItemComponent` and `TabCaptionComponent` - fixed pages under captions; `TabCaptionRegion` draws a caption.
- `TabsViewComponent` - document tabs over a collection, renamed in place (`RenameItemEffect`).
- `BreadcrumbsComponent` with `BreadcrumbItemComponent` - the trail back. `StepsComponent` - numbered wizard steps over `TextItem`s, one current by `SelectedKey` and the ones before it completed, auto-switching from horizontal to vertical when container width runs short.
- `ButtonGroupComponent` - segments pressed flush, one current: a view's mode.

## Indicators

- `ProgressComponent` (linear or circular), `SpinnerComponent` (with no title or `AccessibleName`, it says "Loading"; `SetLoadingStyle(UILoadingStyle.Ring | UILoadingStyle.Dots)` on a spinner or any visual component, or globally via `theme.UseLoadingStyle(...)`).

## Add-on components

Each add-on's README (on its repository, and in the NuGet cache next to the package) is its full reference.

- CodeInput (https://github.com/AkiEvansDev/NE.Standard.UI.CodeInput): `CodeInputComponent` - a code editor field with
  highlighting, inline completions (`AddCompletion`, `SetCompletionItems`, `SetCompletionTriggers`), custom mark/span/token styles (`SetMarkStyle`, `AddSpanStyle`, `AddTokenStyle`), find and replace; `MarkdownDisplayComponent` - a Markdown document as formatted text (`SetMarkStyle`, `AddSpanStyle`, `AddTokenStyle`).
- DataGrid (https://github.com/AkiEvansDev/NE.Standard.UI.DataGrid): `DataGridComponent` - a table with typed columns, sorting,
  filters (`AddFilter<TRow>`), editing, paging, totals and export; `DataGridCellComponent` - a typed column's cell; `DataGridFilterComponent` - one
  filter of a grid.
- Charts (https://github.com/AkiEvansDev/NE.Standard.UI.Charts): `LineChartComponent`, `AreaChartComponent`, `BarChartComponent`,
  `PieChartComponent`, `ShareBarComponent` (parts of one bar against a total, with multi-column legend grid via `SetLegendColumns`), `ScatterChartComponent`, `RadarChartComponent`,
  `SparklineComponent` (a line the height of text), `GaugeComponent` (one value on an arc).
- Graph (https://akievansdev.github.io/NE.Standard.UI.Graph, components at `.../NE.Standard.UI.Graph/components/<kebab-name>.html`):
  `NodesComponent` - a canvas of typed nodes the viewer wires; `NodesParametersComponent` - a sheet's parameters beside its
  canvas (`SetCanvas(canvas)`); `LayeredGraphComponent` - the application's nodes and links laid out in layers; `ProductionGraphComponent` - resources
  and the crafts between them, planned.
- Icons (https://github.com/AkiEvansDev/NE.Standard.UI.Icons): no component - names (`MaterialIcons`) for every icon property.
