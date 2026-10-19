# The components

Every component the framework and its add-ons ship. A built-in's page lists every property with its `Set*`/`Bind*`, its events
and its methods: `https://akievansdev.github.io/NE.Standard/components/<kebab-name>.html`, the name without `Component`
(`DateTimeInputComponent` is `date-time-input`). The index is https://akievansdev.github.io/NE.Standard/components/index.html,
with the item models and the enums on their own pages beside it.

## Layouts

- `ContainerComponent` - the 24-column grid: `SetColumn`/`SetRow`/`AddRow`, a child's `SetPlacement`, `SetScrollbarAir`.
- `StackPanelComponent` - children along one axis with `Spacing`; `GlyphEdge` (an end icon or quiet words on the edge),
  `AlignWithFieldBoxes` (level with captioned fields' boxes), `FirstLineOnControl` (its first child's first line on a button's middle),
  `FirstChildAsCaption` (its first child in a field's caption row: a label over a control).
- `WrapPanelComponent` - children flowing onto further lines; `ItemMinWidth` keeps them in even columns.
- `ScrollContainerComponent` - scrolls its content either way; `SetScrollGroup` to scroll with another.
- `SurfaceComponent` - one framed region (fill, edge, radius; `OnClick`/`OnClickWithItemKey` makes it pressable, `OnClickShowImage`,
  `SetUrl` makes it a link; `SetClickable(false)` turns a click off).
- `CardComponent` - a surface with a header and footer band; `CardHeaderRegion` draws its header.
- `ExpanderComponent` - a header that folds its content; `ExpanderHeaderRegion` draws the header.
- `AccordionComponent` - expanders of which one is open at a time.
- `CollapsiblePanelComponent` - a panel folding to an edge (a sidebar, a properties pane, a log) with its own switch.
- `FlyoutComponent` - a popup anchored to another component.
- `GridSplitterComponent` - a dragged track boundary; `BindPosition` keeps the share in the controller.
- `PaneContainerComponent` - panes the reader moves between places by a grip; `AddPane`, `BindLayout`.

## Contents

- `TextComponent` - an icon, a title, a description and a badge, one line each unless told to wrap; `TitleType` is its role.
- `ParagraphComponent` - text meant to be read, wrapping, `MaxLines`.
- `IconComponent`, `ImageComponent`, `BadgeComponent`, `SeparatorComponent`. A picture with no picture - no address, an empty one,
  one that fails - draws a glyph (`UIGlyphs.Person` in a circle, `UIGlyphs.Image` otherwise); `FallbackIcon`/`IconFallback`
  replaces it, and an image tries `FallbackSource` first.
- `LinkComponent` - an address the platform opens (only safe schemes survive).
- `StatusComponent` - a page's state in place of its content (not found, refused, failed); `UIPage.Status` builds it.
- `TimestampComponent` - a moment in the reader's zone and language, a day, a time or how long ago, kept current by the page.
- `FileTileComponent` - a file as a tile: glyph, name, size; `OnClickWithItemKey(command)` for a row's tile. The same size in any
  other text is a `UIFileSize` phrase argument.
- `KeyValueActionComponent` - key/value rows with an optional trailing action (`KeyValueActionItem`); `UIDetails` builds lists.

## Actions

- `ButtonComponent` - `OnClick`, `OnClickWithItemKey`, `OnClickShowingLoading`, `OnSubmit(formId, command)`,
  `OnSubmitShowingLoading(formId, command)`, `SetType(UIButtonType.*)`, `SetShortcut`, `SetUrl` (the button's look on a link).
- `ActionComponent` - a full-width row that runs a command, with a chevron and a value; the row a list jumps to (`SetUrl`: a link).
- `SplitButtonComponent` - a main press and a menu at its end.
- `CommandBarComponent` - a toolbar of button items that folds what does not fit; a standard one is
  `UIStandardAction.Delete.ToButtonItem(id, type, iconOnly)`, as `ToMenuItem(id)` is a menu's.
- `ThemeSwitcherComponent`, `LanguageSwitcherComponent` - the reader's theme and language, as a button or a field.

## Inputs

All share `Value` (two-way), `Title` (the caption above), `SetHelp`, the validation rules and `OnChange`/`OnBlur` (with bound
arguments, or literal ones: `OnChangeLiteral`/`OnBlurLiteral`). A field with a box
(`IFieldInputComponent`: text, number, select, date and time, file, colour, image) takes `Appearance`
(`UIInputAppearance.Filled`/`Outline`/`Underline`/`Ghost`/`Tonal`); a checkbox, a switch, a radio group, a slider and a calendar have none.

- `TextInputComponent`, `TextAreaComponent`, `NumberInputComponent`, `SliderComponent` (one value or a range).
- `CheckboxComponent`, `SwitchComponent`, `RadioGroupComponent`.
- `SelectComponent`, `MultiSelectComponent`, `BadgeSelectComponent` (badges chosen into the field), `SearchComponent` (a select
  with a search field; `OnSearch` asks the server).
- `DateInputComponent`, `TimeInputComponent`, `DateTimeInputComponent`, `CalendarComponent` (a month in place, a day or a period).
- `ColorInputComponent` - a palette colour or one picked freely.
- `FileInputComponent`, `ImageInputComponent` - upload on pick, `SelectionId`; the image input is an avatar, a drop area, a row
  or a shelf of thumbnails.

## Items

- `ItemsViewComponent` - a collection held whole, virtualized or windowed from a source (`BindSource`), grouped, scrolled,
  laid out any way; `SetTemplate`, `AnchorToEnd`, `SetLoadingLook`.
- `TableComponent` - rows under a header, a template per column, filters and sorts by rule, selection.
- `TreeComponent` with `TreeNodeComponent` - thin rows with a glyph and a title over `TreeNode` items; inline rename
  (`RenameNodeEffect`), moves; for a small set or folders loaded as they open (`HasChildren` + `OnNodeUnfold`), never virtualized.
- `PagerComponent` - the pages of a paged list (`SetPaging(true)` on its list).

Built-in item models: `TextItem`, `TextBaseItem`, `ButtonItem`, `MenuItem`, `TabItem`, `BreadcrumbItem`, `BadgeItem`,
`OptionItem`, `UIOptionValue`, `UIValueItem`, `FileItem`, `KeyValueActionItem`, `TreeNode`. Default templates draw them:
`DefaultTextTemplate`, `DefaultButtonTemplate`, `DefaultActionTemplate`, `DefaultMenuItemTemplate`, `DefaultTabItemTemplate`,
`DefaultBreadcrumbItemTemplate`, `DefaultFileTemplate`, `DefaultGroupTemplate`, `DefaultKeyTemplate`, `DefaultValueTemplate`,
`DefaultRowTemplate`, and `DefaultEmptyTemplate` for an empty list.

## Navigation

- `MenuComponent` with `MenuItemComponent` - navigation entries, folding to icons or standing as a rail (`UIMenuDisplay.Rail`).
- `TabsComponent` with `TabItemComponent` and `TabCaptionComponent` - fixed pages under captions; `TabCaptionRegion` draws a caption.
- `TabsViewComponent` - document tabs over a collection, renamed in place (`RenameTabEffect`).
- `BreadcrumbsComponent` with `BreadcrumbItemComponent` - the trail back.
- `ButtonGroupComponent` - segments pressed flush, one current: a view's mode.

## Indicators

- `ProgressComponent` (linear or circular), `SpinnerComponent`.

## Add-on components

Each add-on's README (on its repository, and in the NuGet cache next to the package) is its full reference.

- CodeInput (https://github.com/AkiEvansDev/NE.Standard.UI.CodeInput): `CodeInputComponent` - a code editor field with
  highlighting, completions, find and replace; `MarkdownDisplayComponent` - a Markdown document as formatted text.
- DataGrid (https://github.com/AkiEvansDev/NE.Standard.UI.DataGrid): `DataGridComponent` - a table with typed columns, sorting,
  filters, editing, paging, totals and export; `DataGridCellComponent` - a typed column's cell; `DataGridFilterComponent` - one
  filter of a grid.
- Charts (https://github.com/AkiEvansDev/NE.Standard.UI.Charts): `LineChartComponent`, `AreaChartComponent`, `BarChartComponent`,
  `PieChartComponent`, `ShareBarComponent` (parts of one bar against a total), `ScatterChartComponent`, `RadarChartComponent`,
  `SparklineComponent` (a line the height of text), `GaugeComponent` (one value on an arc).
- Graph (https://akievansdev.github.io/NE.Standard.UI.Graph, components at `.../NE.Standard.UI.Graph/components/<kebab-name>.html`):
  `NodesComponent` - a canvas of typed nodes the viewer wires; `NodesParametersComponent` - a sheet's parameters beside its
  canvas; `LayeredGraphComponent` - the application's nodes and links laid out in layers; `ProductionGraphComponent` - resources
  and the crafts between them, planned.
- Icons (https://github.com/AkiEvansDev/NE.Standard.UI.Icons): no component - names (`MaterialIcons`) for every icon property.
