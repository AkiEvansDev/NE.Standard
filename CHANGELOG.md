# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.0.0

- **Breaking:** one runtime, which batches: `UIControllerUpdateMode`, `UIControllerRuntimeAttribute.UpdateMode` and
  `UIRouteDefinition.ControllerUpdateMode` are gone, and the route builder's `ControllerUpdates(mode[, interval])` is
  `FlushInterval(interval)`. A route that wants its changes out sooner sets a shorter interval.
- **Breaking:** the flush schedule: a route's or controller's `FlushInterval` shorter than `FlushSchedulerInterval` is honoured,
  the flush ticking at the shortest but never under 10 ms; `FlushSchedulerInterval = Timeout.InfiniteTimeSpan` flushes nothing on
  a schedule, and a route's interval no longer overrides it (the test host's parking); `[UIControllerRuntime]` without a
  `FlushIntervalMilliseconds` keeps the application's flush interval, where it set 50 ms whatever `FlushSchedulerInterval` said.
- **Breaking:** `IUIRuntime.FlushAsync` is removed: the one explicit flush is `IUIClientEndpoint.FlushAsync(handle)`, which goes
  through the runtime's send queue behind a set already queued, sends what it flushed to the runtime's attached pages as the
  scheduled flush does, and answers once its set is sent. `IUIRuntimeAccess` gains `WhenPostedRanAsync()`.
- **Breaking:** `IUIRuntimeAccess.InvokeAsync` returns `Task`: what the action changes reaches the pages with the next flush (the
  set it returned was always empty).
- **Breaking:** nothing waits for a state lock from inside an `InvokeAsync` action: `InvokeAsync` into any runtime — the same one,
  another, or back through another (A→B→A) — and `IUIClientEndpoint.FlushAsync`, `ProcessChangeSetAsync`,
  `RequestItemWindowAsync` or a pushed effect called from inside an action throw `InvalidOperationException` instead of waiting
  forever. Work for another runtime from an action is `Post`ed.
- **Breaking:** the shell render's `TryGetRenderRuntime`, `HearBeforeRenderAsync` and `TakeRenderKey` moved from `IUIClientEndpoint`
  to `IUIRenderEndpoint` (`IUIHost` carries both): a platform whose client draws the page from the attach needs only the first.
- An effect pushed outside a command (`SendEffectsAsync`, `SendEffectsToAllAsync`, dialogs, downloads, a session's language,
  theme or colour switch) goes out through the send queue behind the values written before it, instead of overtaking them; a
  push dropped with an overflowed queue is gone with it
  (the resync brings back state, not effects).
- `UIPersistenceOptions.MaxQueuedChangeBytesTotal` (256 MB) bounds the change sets waiting across every runtime, one whose own
  queue is empty included: the runtime whose set would cross it drops its queue for a full resync.
- Posted work (`Post`, `IUIBroadcast` posts, lifecycle hooks) gets a token cancelled when the runtime is asked to go, and
  `UIViewFilterContext.CancellationToken` is the resolution's token.
- A bound value whose reference fails to resolve is dropped (and reported to the page in Development) instead of sent raw.
- `NE.Standard.UI.Testing` stands on public seams alone: `UIStartupBuilder.Configure<TStartup>(services, configureApplication)` and
  `UINavigationAddress` are public. `UITestPage.CloseAsync()` closes a page as a closing tab does and returns once
  `OnDetachedAsync` ran.
- An uploaded file's name is cut to its last segment, without control characters, at most 255 characters; the content endpoint
  refuses a cross-site request (403).
- **Breaking:** `ShowEffect`, `HideEffect` and `CollapseEffect` are gone: a command shows, hides or collapses a component by
  writing its bound `Visibility`, which the server's gate reads for every page and a reload.
- **Breaking:** a date-time's `Min`/`Max` and a moment period's `MinDistance` are compared by instant, on the server and the page
  alike, whatever offsets the value and the bound carry — not by wall clock: text written without an offset stands in the
  server's zone.
- **Breaking:** a select's, a radio group's and a multi-select's written value is refused for a disabled option, a key no option
  holds (but a free-text multi-select's tag) and past `MaxSelected`.
- **Breaking:** a number input's `AllowNegative(false)`/`AllowDecimals(false)` refuse a negative or fractional value on the server;
  on the page its stepper and arrow keys respect them (no step below 0; whole numbers, in the direction stepped).
- **Breaking:** a choice, a host's row event, or an event in a row naming a key the host's rows do not hold is refused, as is an
  event or a write with fewer row keys than its component stands in; `ArgCurrentItem`/`ArgCurrentItemKey` on declared rows refuse
  a key no row has. Rows declared with `SetItems` are gated (Enabled, Visibility, CanSelect, …) as bound rows are.
- **Breaking:** a window request for a hidden host is refused (a disabled or loading host is shown, and gets its rows). A viewer's
  query naming a property or operator the host does not offer, or any `Regex`, is refused as the page writes it and answered with
  the server's value; a query the controller sets is never refused. A package offers its terms through `IItemsQueryTermsComponent`
  (`UIItemsQueryTerms`, new).
- **Breaking:** a command raised in a row template a host picks by the row's item names a row that template draws, and a menu
  entry's event names an entry the menu offers, enabled and shown: a forged entry naming a caption, a rule, a select, a check, a
  group, the tab strip's own keys or an entry opening others is refused.
- **Breaking:** a view whose static configuration breaks a setter's rule no longer compiles when it is written on the properties
  (an object initializer) past the setters — bounds out of order or a value outside them, a fractional bound of a whole-number
  input, a period's end before its start or nearer than its least distance, a date period's distance with a part of a day, a
  slider step of zero, a `MaxSelected`, `MaxLength` or `MaxFileSize` below one, a progress's `Min`, `Max` and `Value` out of
  order. A component takes part through `IConfigurationValidatedComponent` (new). A number input with `SetAllowDecimals(false)`
  refuses a fractional `Min`/`Max` at the setters too.
- **Breaking:** a slider's `Step` defaults to 1, as the browser draws it, at compile and in the server's gate (a bound step the
  controller leaves null too): its value and end lie on the step counted from `Min`, and its `MinDistance` may not exceed
  `Max − Min`. A slider meant to land on fractions sets its Step (`SetStep(0.1m)`). The setters hold an end to a step only once
  one is set (`SetValue(0.5m).SetStep(0.5m)` is accepted), and a bound `Min`, `Max` or `Step` holds nothing at authoring.
- **Breaking:** a time input's `MinDistance` is under a day (both ends lie in one day).
- `IClientWriteCheckComponent` and `UIClientWriteCheck` (new): a component holds the page's writes to its own two-way properties to
  what it offers; the server refuses the rest and answers with its value.
- A setter that throws refuses its own value only: the rest of the change set applies, and the controller's handler hears the
  exception after the turn.
- A call that fails with nothing else saying so reaches the person: a failed value write or window of rows shows the handler's
  effects or the default failure notification (`NotifyOnCommandFailure`) on the page that asked, and on the page a failed press,
  value, window, page turn, toast action or interaction write shows one toast, *Something went wrong. Please try again.*
  (`UIStrings.CommandFailed`, `ui.command.failed`), once per burst.
- Layout validation also checks an items view's `Padding` and an image's `BorderRadius`.
- **Breaking:** a component's look is its `Variant`: a button's and a badge's `Type` is `Variant` (`SetVariant`, `BindVariant`), so
  are `IButtonModel.Type` and `ButtonItem.Type`, and a text's and a `BadgeItem`'s `BadgeStyle` is `BadgeVariant`; the enums are
  `UIButtonVariant` and `UIBadgeVariant`, `UIStandardAction.ButtonType` is `ButtonVariant`, `UIDialogs`' `confirmType` and `type`
  are `confirmVariant` and `variant`, and a badge's classes are `ui-badge-variant--*` (`WebClassNames.BadgeVariant`). A theme or
  language switcher's button look, `Type`, is `ButtonVariant` (its `Variant` picks button or field), and its field skin,
  `Appearance`, is `FieldVariant` (`SetFieldVariant`, `BindFieldVariant`, `ISwitcherComponent.FieldVariantProperty`);
  `TextContentRendererBase.RenderFieldAppearance` takes the property it reads. `WebClassNames.ButtonClass` is `ButtonVariant`.
- **Breaking:** a component's own words are its `Title`: `BadgeComponent.Text` and `TextType` are `Title` and `TitleType`, and the
  `Label` of `SeparatorComponent`, `ProgressComponent` and `SpinnerComponent` is `Title`, drawn in `ui-separator__title`,
  `ui-progress__title` and `ui-spinner__title`. A text's and a `BadgeItem`'s `BadgeText` and `BadgeTextType` are `BadgeTitle` and
  `BadgeTitleType`, and a text's mark is `data-ui-text-badge-title`. A badge's words are drawn in `ui-badge__title` with
  `data-ui-badge-title` (`WebAttributes.BadgeTitle`), by `WebBadgeRenderOptions.TitleProperty`/`TitleTypeProperty` and the
  converter `WebDomConverters.BadgeTitleFit` (were `ui-badge__text`, `BadgeText`, `TextProperty`, `TextTypeProperty` and
  `BadgeTextFit`).
- **Breaking:** a record's words are its `Title` and a preset's second line its `description`: `UIStandardAction`'s `Word` and
  `Glyph` are `Title` and `Icon`; `UIDialogs.Confirm`'s `body` and `confirmWord` are `description` and `confirmTitle`; the `body`
  of `UIMessage` and the `line` of `UIPage.Empty`/`Outcome`/`Status` and `UIText.Quote`/`Person` are `description` (`bodyPath`
  and `linePath` are `descriptionPath`).
- **Breaking:** a dialog with no title of its own is named by `UIDialog.AccessibleName`, a `UIPhrase` as a component's is (was
  the string `Label`); `CompiledDialog.Label` is `AccessibleName` too.
- **Breaking:** a toast's button words are `UINotificationAction.Title` (`title` on the wire, was `Label`) and a system
  notification's "Open" words `ShowSystemNotificationEffect.AddressTitle` (`addressTitle`); `UIPersonSize` is gone,
  `UIText.Person`/`BoundPerson` take `UISize` (`Small` 32 px, `Medium` 40 px, `Large` 48 px, new).
- **Breaking:** a control's accessible-name words are `UIStrings.*Name` (`ui.<control>.name`): `BreadcrumbsLabel`, `PagerLabel`,
  `SplitterLabel`, `LightboxLabel` and `ActionBarLabel` are `BreadcrumbsName`, `PagerName`, `SplitterName`, `LightboxName` and
  `ActionBarName`, so an application overriding `ui.pager.label` overrides `ui.pager.name`. `UIStrings.PickerPrevious` and
  `PickerNext`, which nothing wrote, are gone: a calendar's arrows say what they turn — *Previous month*/*Next month* in the days,
  *Previous year*/*Next year* in the months (`PickerPreviousMonth`, `PickerNextMonth`, `PickerPreviousYear`, `PickerNextYear`, new).
- **Breaking:** `IconComponent.FallbackIcon` and `ImageComponent.FallbackIcon` are `IconFallback`, the name a text and a badge use;
  the attribute is `data-ui-icon-fallback`.
- **Breaking:** one shape, `UIShape` (`Default`, `Circle`, `NE.Standard.UI.Primitives.Styling`), in place of `UIImageShape` and
  `UIIconShape`; the theme's corner-radius record that held the name is `UIThemeShape` (`UITheme.Shape`, `UseShape` and
  `ConfigureShape` keep their names).
- **Breaking:** one rename effect, `RenameItemEffect(hostId, key)` (kind `RenameItem`), for any `IItemRenameComponent` host, in
  place of `RenameTabEffect` and `RenameNodeEffect` (`RenameTab`, `RenameNode`); aimed at a host that renames nothing, it is
  refused at compile.
- **Breaking:** one size scale, `UISize` (Small, Medium, Large), in place of `UIButtonSize`, `UIInputSize` and `UIIconSize`. A
  spinner's `Size` is responsive (`SetSize(UISize.Small, md: UISize.Large)`).
- **Breaking:** `UIMessageSeverity` is gone: `UIMessage`, `UIPage.Status` and `UIPage.Outcome` take a `UIColorStyle` tone, the
  scale a badge's colour and a toast take — Info, Success, Warning or Danger, any other refused (`ArgumentOutOfRangeException`) —
  and `ShowNotificationEffect.Severity` is `Tone` (`tone` on the wire).
- **Breaking:** `ActionComponent.TrailingText` and `ImageInputComponent.Caption` are `UIPhrase`, translated as any component's
  words; a string set there is still the author's text.
- **Breaking:** `TreeComponent.ShowFoldChevron` is `ShowChevron`, the name the expander, the select and the action use.
- **Breaking:** namespaces: a property block several components take is in `NE.Standard.UI.Authoring.Components`
  (`IAccessibleNameComponent`, `IBorderedComponent`, `ISwitcherComponent`, `ITooltipComponent` and the rest moved from
  `Authoring.BuiltIns`), one built-in's own contract in `NE.Standard.UI.Authoring.BuiltIns` (`IPagerComponent`,
  `IMultiSelectComponent`, `IKeyValueActionComponent`, `ISplitButtonComponent`, `IGridSplitterComponent` and
  `IGridTracksComponent` moved from `Authoring.Components`); both are global usings.
- **Breaking:** `IAccessibleNameComponent.AccessibleName` has a setter, and `IPropertyBindingComponent` (on every component)
  binds a property by its key, as the component's own binder does — a wrapper's hand. `UIPage.Labelled` names a control that has
  no visible name or `AccessibleName` of its own by its label, `BoundLabelled` binds its name to the label's path, and
  `KeyValueActionComponent` binds an unnamed value-input template's `AccessibleName` to `Key.Title`; an author's own name or
  title, said at the component, wins.
- **Breaking:** the plugin Less's `@ui-picture-plate`, `.ui-picture-glyph()`, `.ui-picture-veil()`, `.ui-picture-glass()` and
  `.ui-picture-corner-mark()` are `@ui-image-plate`, `.ui-image-glyph()`, `.ui-image-veil()`, `.ui-image-glass()` and
  `.ui-image-corner-mark()`, and `@ui-severity-stroke` is `@ui-accent-stroke`. New in it: the glyph steps `@ui-glyph-xxl` (28px)
  and `@ui-glyph-xxxl` (32px) and `@ui-chosen-weight`.
- **Breaking:** an item's events are `OnItem*` on every host: a table's and a key–value list's `OnRowClick*`, `OnRowOpen*`,
  `OnRowRemove*` and `OnRowMove*`, and a tree's `OnNodeClick*`, `OnNodeOpen*`, `OnNodeRemove*`, `OnNodeMove*`, `OnNodeUnfold*` and
  `OnNodeRename*`, are `OnItemClick*` and so on; a tab strip's menu entry is `TabsViewComponent.OnItemMenuEntry`/
  `OnItemMenuEntryLiteral` (was `OnTabMenuEntry`), raised as `item-menu-entry` (`EventNames.ItemMenuEntry`, was `TabMenuEntry`,
  `tab-menu-entry`).
- **Breaking:** the row events are blocks, as the click is: `IItemClickComponent`, `IItemOpenComponent`, `IItemRemoveComponent`,
  `IItemMoveComponent`, `IItemRenameComponent` and `IItemUnfoldComponent`, each with one extension class
  (`ItemClickComponentExtensions`, `ItemOpenComponentExtensions`, …) in place of the instance methods on `ItemsViewComponent`,
  `TableComponent`, `TreeComponent`, `TabsViewComponent` and `RowItemsComponentBase`. The twelve stand in
  `NE.Standard.UI.Components.Foundation.Items`, a global using of the foundation package. The names and arguments stay; every
  family has the five forms (plain, `Literal`, `WithItem`, `WithItemKey`, `With`), and move's forms that name the item pass its
  index too.
- The key–value list is a row host: one Tab stop with the row cursor; Enter, double click and Delete as on a table, F2 opening the
  keyboard's row's editor; `OnItemOpen*` and `OnItemRemove*` reach it. Enter on a closed row of a list that edits in place presses
  its Edit, the one control the row shows, as F2 does; a hidden action button (`ShowActions` off) is no row's one control, so
  Enter there clicks and opens the row.
- **Breaking:** `RenamedTitle` is one block, `IRenamableComponent`, a tree node's and a tab's; its key is
  `IRenamableComponent.RenamedTitleProperty`, and a tab's binds relative to its row by default, as a node's does.
- **Breaking:** an event a catalogue marks `ownTarget` belongs to the component its target stands in — the target's nearest
  component must be the one the pipeline resolved — so a fold and an open, a row's `move`, `remove`, `rename` and `unfold` and an
  item menu's entry are their component's own: an expander or a panel folded or a flyout opened inside a component with the same
  event, or a list, a tree or a tab strip in another host's row template that does not hear one, no longer runs the outer
  component's command. A package may raise its own event on a part of its component.
- **Breaking:** the fold events are one family over the new `IExpandableComponent`, which `ExpanderComponent` and every
  `ICollapsibleComponent` are: `OnExpand`, `OnCollapse`, `OnExpandLiteral` and `OnCollapseLiteral` moved from `ExpanderComponent` to
  `ExpandableComponentExtensions` (`NE.Standard.UI.Authoring.Components`). A `CollapsiblePanelComponent`'s and a `MenuComponent`'s
  fold now raise them when a person presses the switch; a menu section opening is an entry's fold, not the menu's.
  `SetExpanded()`/`SetCollapsed()` work on every `IExpandableComponent`, whose `Expanded` is settable.
- **Breaking:** an expander raises `OnExpand`/`OnCollapse` on a person's press alone: a pushed `Expanded`, an accordion closing the
  other expanders, a toggle the server pushed after a press whose own toggle went unheard and a press on a control in its header
  raise neither.
- **Breaking:** a flyout's `OnClose` runs only for a person's dismissal — the anchor pressed, a press outside, Escape, the keyboard
  leaving — not when the page takes it down (its anchor scrolled out of sight, its owner gone, a list's refill); `IsOpen` is
  still told.
- A package's registration of a built-in event keeps its `ownTarget` (`EventRegistration.ownTarget`, new); a package registering
  an event name another package registered is refused, said in the console, the first kept.
- `MinDistance` on `DateInputComponent`, `TimeInputComponent`, `DateTimeInputComponent` and `CalendarComponent`
  (`SetMinDistance(TimeSpan)`/`BindMinDistance`): a period's ends are held that far apart — a date's and a calendar's in whole
  days — at authoring, on the page (the days too near the start are not on offer for the end; the clock, the time segments and a
  typed end are held to it) and by the server on every write. A period never offers a start so near `Max` (or an end so near
  `Min`) that no other end fits, and a held end never lands on an unmarked day under `MarkedDaysOnly`; an hour typed past `Max`
  stays as typed and is refused in words, as without a distance. **Breaking:** `PeriodInputComponentBase.ValidatePeriod` takes
  the least distance.
- A typed value a temporal field refuses — a day not on offer under `MarkedDaysOnly`, a period's end or start nearer
  than its least distance — stays as typed, as a number past its bound does, and says why on the field's line, naming the nearest
  end or start it takes (`UIStrings.ValueDayNotOffered`, `ValueEndTooNear`, `ValueStartTooNear`, new), until a value is taken.
- **Breaking:** the input bases hold logic alone: `TextInputComponentBase`, `FieldInputComponentBase` and
  `AffixedInputComponentBase` are gone, and a field takes the `IBorderedComponent`, `IFieldInputComponent` and
  `IAffixedInputComponent` blocks itself over `InputComponentBase`. `MinMaxInputComponentBase` is `BoundedInputComponentBase`
  (`Min`, `Max` and their setters), under `PeriodInputComponentBase` (`IsRange`, `EndValue`, `MinDistance`), under
  `TemporalInputComponentBase`, which carries a temporal field's look blocks — those three and `IFormattedInputComponent`
  (`Format`, `DisplayFormat`, `Culture`, `FormatMessage`). `CalendarComponent` stands on `PeriodInputComponentBase`.
- **Breaking:** the select family (`SelectComponent`, `MultiSelectComponent`, …) is an `IBorderedComponent`, its border values
  validated as every bordered component's are; the generator refuses a `[UIComponentPropertyBlock(typeof(I))]` on a type that
  does not implement `I` (NEUI017).
- **Breaking:** `BadgeSelectComponent` and `BadgeSelectComponentRenderer` are gone, with the `standard.input.badge-select` type key:
  a multi-select draws its options as badges with `SetVariant(UIMultiSelectVariant.Badges)` (`ui-badge-select` on the page as
  before). `MultiSelectComponentRenderer` is sealed and holds `BadgeSelectClassName`; `SetAllowFreeText` takes a `bool`.
- A multi-select's look is its `Variant` (`UIMultiSelectVariant`: `Chips`, the default, `Badges`, `Checkboxes`), decided at render;
  `SetVariant` installs the variant's option template unless one of the author's own is set.
- `UIMultiSelectVariant.Checkboxes` draws every option as a checkbox in place — no field, no list — laid out by the multi-select's
  new `Orientation` and `Spacing` as a radio group's radios are, the unchecked boxes off once it holds `MaxSelected`; one Tab stop,
  the arrows between the boxes, Space to check. The value, the cap and the server's gate are the chips'. It takes no free text:
  `SetVariant(Checkboxes)` with free text and `SetAllowFreeText()` under `Checkboxes` throw `ArgumentException`, and
  `ValidateConfiguration` refuses the pair written on the properties, on every platform.
- `ItemMinWidth` is a block of its own (`IEvenColumnsComponent`) that a radio group and a multi-select's checkboxes take beside the
  wrap panel: set, the options stand in even columns, a wrapped one under the one above. **Breaking:** the wrap panel's
  `ui-wrap-panel--columns` and `--ui-wrap-panel-item-min-width` are `ui-even-columns` and `--ui-item-min-width`
  (`WebClassNames.EvenColumns`), and its key is `IEvenColumnsComponent.ItemMinWidthProperty`.
- A date-time input's clock hour or day partly inside `Min`/`Max` lands on the nearest allowed moment instead of committing one the
  server refuses; an in-place calendar's caption and hover band follow what the next press does once its period is complete. An
  empty picker held to a `Min` off its `Step`'s grid opens on the next step up rather than the one just below `Min`, and an empty
  time input reads its bounds at all: it opened below `Min`, or always on `Max`.
- A slider whose value the browser clamped at first paint, or after a pushed `Min`, `Max` or `Step`, reports the clamped value to
  the server.
- `values.isRefused(element)` on the plugin surface: whether a number field or a temporal control refuses what it holds by its own
  bounds and format, as the server would.
- `SetTrimInput()` is one extension over `ITextEntryInputComponent`, whose `TrimInput` is settable.
- `TooltipPlain` belongs to the tooltip block (`ITooltipComponent.TooltipPlainProperty`, which `ITextBaseComponent` now extends),
  so a badge, an icon, an image, a timestamp and a switcher show a person's words as written too.
- `InputCaptionRow` is public, the one rule for whether an input has a caption row: a text area, a multi-select
  drawn as checkboxes and an image input other than its inline row keep one whatever `TitlePlacement` asks, as they are drawn, so
  a button beside one stands level with its box.
- A button's and a switcher's `BackgroundImage` is drawn (it was ignored); a switcher drawn as a field carries its border on its
  box.
- **Breaking:** `UIStrings.TreeToggle`, `UIStrings.TableResizeColumn` and `UIStrings.RowDrag` are removed: the tree's chevron, the
  table's column resizer and a row's grip, the server's and a client-built row's, are hidden from a screen reader (`aria-hidden`)
  rather than named; the keyboard's move is the row's Alt+arrows.
- **Breaking (markup):** the tabs view's `role="tablist"` moved off `.ui-tabs-view__host` onto a new, empty
  `.ui-tabs-view__tablist` that owns the tabs (`aria-owns`); a tab's label and page get ids and point at each other, in a static
  Tabs too (`aria-controls`/`aria-labelledby`).
- **Breaking:** `UIStrings.SidePanel` (`ui.side.panel`) is removed: the shell's side landmarks, and an open drawer, with no name of
  their own are *Left panel* and *Right panel* (`UIStrings.LeftPanel`, `UIStrings.RightPanel`, new), where both were *Side panel*;
  a side whose menu has an `AccessibleName` is named by that menu (`aria-labelledby`, `WebAttributes.MenuNameId`, new), a pushed
  name included.
- Tree, items view, table, tabs view, menu, command bar, progress and spinner take `AccessibleName`; an untitled spinner is named
  *Loading* (`UIStrings.SpinnerLoading`, new).
- Every list and menu a control opens is named for a screen reader by what opened it (`aria-labelledby`): a flyout's panel by its
  anchor's button; a date, time or colour input's popup and a select's, multi-select's and search's listbox by the field's
  caption; the theme and language switchers' lists, a tab strip's and a command bar's "…" list, a split button's list, a submenu
  by its group's entry, a context menu opened from a bar's "more". `FlyoutComponent` takes `AccessibleName` to name its panel
  otherwise, and a name pushed on an open panel names it at once. The row of a bar's icons atop a context menu is *Actions*.
- A menu entry drawn on the page that acts and goes nowhere is a button (`role="button"`): an anchor without an address has no
  role of its own. One with an address is the anchor's link; a template's bound address is each row's own, and the entry it stamps
  carries `data-ui-menu-entry-acting` (`WebAttributes.MenuEntryActing`), by which the client gives and takes the button's role as
  the row's address comes and goes; in a popup menu every entry keeps its menu role.
- A row's repeated control names its row: a tab's close *Close Inbox* (`UIStrings.TabsClose`), a gallery square's ×
  *Remove cat.png* (`UIStrings.ShelfRemove`) and a toast's × *Close Saved* (`UIStrings.NotificationClose`), new; the inline rename
  field (a tree node's, a tab's, a package's) is named *Rename*.
- A table's rows are named by a header cell (`role="rowheader"`) a screen reader says as it moves between rows: the first column
  with a caption, in a table of more than one column, or the one `SetRowHeaderColumn(key)` marks (`UITableColumn.IsRowHeader`).
- The rows of a windowed or virtualized items view say their place and the count (`aria-posinset`/`aria-setsize`), those the
  server draws and those the client draws.
- A list's and a read-only table's keyboard cursor holds the focus on its row (roving tabindex) — an items view that is no
  listbox, a wrap list by its tile, a table, the key–value list — and the row wears the keyboard's wash and frame on its own
  focus; a listbox, a grid and a tree keep the focus on the root, naming the row. Each host is still one Tab stop.
- No `aria-required` or `aria-readonly` on a `role="group"` (a period's row, a range slider, a calendar's body, a checkbox
  multi-select): a read-only checkbox multi-select marks each box `aria-readonly`, following a pushed `IsReadOnly`. A progress bar named by its `AccessibleName`
  keeps that name when its title is pushed.
- A Warning toast speaks at once as a Danger one does (`role="alert"`), as a Warning message always did: one
  `UIColorStyle.IsUrgent()` says which tones are urgent.
- **Breaking:** right-to-left is out of scope, and its residue is gone: the lightbox, reorder, overlay scrollbar, strip fit,
  column reorder and action bar read no page direction; the stylesheets' `:dir(rtl)` rules (lightbox, sheet carousel, row drop
  line, scroll room) and the `--ui-scroll-room-left` custom property are gone.
- Toasts stand above a native modal `<dialog>`, and a tooltip of a control inside one shows over it.
- Forced colours: toast tone bars, toggle keyboard focus, every focused field, badges and chips, empty badges and menu dots stay
  visible.
- `WebClassNames` gains a constant for every class the client finds an element by (`ColorInputRow`, `TabItemLabel`,
  `MenuItemWrapper` for `ui-menu__item`, …); `WebIconValue.ImageClassName`/`MaskClassName` are `WebClassNames.IconImage`/`IconMask`,
  their values unchanged.
- A built-in effect no longer carries `canRunInInteraction` on the wire (it travelled with Scroll, ScrollTo, ScrollToItem,
  SetTheme, SetThemeColors, SetLanguage and DiscardForm).
- A text field's `MaxLength` counts a line break once, as the browser's `maxlength` does: a text area at its limit was refused.
- A small text area's message and note start where its words do; a Surface split button no longer washes twice under the pointer.
- A toast's shadow lies under the whole stack: it covered the edge of the toast beside it.
- A switch to another runtime that fails offers a reload instead of leaving the page inert; a reconnecting or closed-connection
  handler that throws no longer keeps the next ones from being told; words the server failed to give are asked for once more
  after 5 s.
- `ITextComponent` gains `HeadingLevel` (`1..6`): a `TextComponent` with a heading level draws its `.ui-text__title` as `<h1>`–`<h6>`
  (`UIPage.Header` sets level 1, `UIPage.Section` and `UIPage.Heading` default to level 2 unless the author set a level).
- Generated `Bind*` methods on `[UIComponentProperty]` properties take `bool optional = false`, matching `Bind(property, path, scope, mode, optional)`.
- **Breaking:** `RecursiveMemberGenerator` reports `NEUIR010` (`Error`) on public mutable properties (`set` accessor) of
  `RecursiveObservable` subclasses that lack `[RecursiveMember]`.
- Cross-component interactions (`Interact`, `InteractCopyValue`, `InteractBefore*`, `InteractAfter*`, `ShowLoadingDuring`,
  `InteractOn*`), `ValidationInto`, `ValidateAgainst`, `ShownWhen`/`HiddenWhen`/`EnabledWhen`, `UIComponentReference`,
  `UIPropertyReference`, and targeted client effects (`FocusEffect`, `ScrollToEffect`, `ScrollToItemEffect`, `ScrollEffect`,
  `RenameItemEffect`, `InsertTextEffect`, `OpenPickerEffect`, `CopyToClipboardEffect.ValueOf`) accept a component reference
  (`IVisualComponent` / `IBindableComponent` / `IInputComponent`) directly beside a string id.
- **Breaking:** `UIViewCompiler` refuses a standard `EventNames` event registered (`.On(...)` or `.InteractOn(...)`) on a component
  whose contract never raises it (`change` on a non-input, `expand`/`collapse` on a non-expandable component, `search` on a
  non-search input, `enter`/`escape` on a non-text-entry input, `click` on a non-clickable component, or an item event outside its
  item template).
- Static `ComponentItems` hosts whose items are never filtered, sorted or grouped on the client no longer emit client binding
  metadata for their declared rows, cutting `/navigation/menu`'s inline metadata from 1 262 KB to 227 KB.
- Client `LikeIgnoreCase` comparison uses invariant `.toLowerCase()` (matching the server's `OrdinalIgnoreCase`) rather than
  locale-dependent `.toLocaleLowerCase()`, and client numeric comparison rejects `0x`/`0b`/`0o` prefixes as `decimal.TryParse` does.
- `UIRuntimeStore.GetOrAdd` detaches a connection displaced from a previous runtime key on the displaced runtime itself; a runtime's
  `Post` queue is bounded (`MaxPostedWork = 1024`) and drops work posted after disposal is requested.
- Typed bindings (`Bind*<TSource>(Expression<Func<TSource, object?>>, scope, mode, optional)` generated beside every string `Bind*`,
  `BindContext<TSource>`, `Bind<TSource>`, `BindOptions<TSource>`, `SplitButtonComponent.BindItems<TSource>`,
  `ItemsViewComponent.BindSource<TSource>`, `TableComponent.BindSource<TSource>` and `AddTextColumn<TRow>`, and
  `UIAction.ArgRoot<TSource>` / `ArgParent<TSource>` / `ArgRelative<TSource>` / `ArgBinding<TSource>`) translate a member/indexer
  expression to a `RecursivePath` once at view build via `RecursivePath.FromExpression`.
- **Breaking:** `VisualComponentBase<TSelf>.SetDefaults<TDescendant>(Action<TDescendant>)` declares property defaults over a
  component's subtree and any dialog attached to it (`AddDialog`), applied at compile time to descendants assignable to `TDescendant`
  unless the descendant sets the property itself (nearest ancestor wins); `[UIComponentProperty]` defaults live in metadata
  (`[UIComponentProperty(DefaultValue = ...)]` / `[UIComponentPropertyDefault]`) rather than component constructors
  (`UIComponentPropertyGenerator` reports `NEUI018` (`Error`) on constructor assignments to component properties), and settable
  value-type component properties are nullable (`T?`, unset until authored).
- `SearchComponent.SetAllowFreeText(bool)` (`AllowFreeText`): an autocomplete mode where pressing `Enter` in the popup search field
  commits the trimmed typed text (or a matching enabled option's key) into `Value` and closes the popup while the popup list suggests
  matching options answered by the server (`OnSearch`) or narrowed on the client; picking an option writes its key into `Value`, and
  the server's option gate accepts any string except a disabled option's key when `AllowFreeText` is true.
- `StepsComponent` (`ISelectedKeyComponent`, `IItemClickComponent`, `IOrientationComponent`, `ISpacingComponent`,
  `IPressablePartsComponent`, `IAccessibleNameComponent`): a numbered wizard step indicator over static or bound items
  (`DefaultTextTemplate` over `TextItem`, wrapped by `StepsComponentRenderer`: step number or check glyph for completed steps, title,
  description, optional badge and connector line), marking steps before `SelectedKey` as completed (`data-ui-step-completed`), the
  active step as current (`aria-current="step"`), and later steps as upcoming (`OnItemClick` and keyboard navigation skip disabled or
  `CanSelect = false` steps; the server gate refuses unknown, disabled or unselectable step keys), with horizontal strips
  automatically switching to vertical layout when the container lacks room for every step. Shown on `/screens/checkout` and
  `/navigation/steps`.
- **Breaking:** Antigravity-inspired visual and palette redesign: `UIThemeDefaults.DarkPalette` uses `Background` `#202020`, `Surface` `#262626`, `OnBackground`/`OnSurface` `#DCDCDC`, `Border` (`Border1`) `#343434`, `Mark` (`Border2`) `#404040` (`#C8C8C4` on `LightPalette`), and `DisabledOpacity` `102` (40%), with `UIColorPalette.Mark` as an explicit `ColorVariant` and a default 8-colour `UIColorPalette.Series` categorical palette (`QuantumBlue`, `BronzeDusk`, `NebulaMint`, `NebulaRose`, `NovaPurple`, `AstralTeal`, `LunarLavender`, `NebulaViolet`); `UISurfaceStyle` collapses to `Background`, `Surface` (replacing `Raised` and `Flat`: keeps the default 1 px `--ui-color-border` edge while dropping `Raised`'s shadow, whereas `UIButtonVariant.Surface` has a transparent default border) and `Tinted`; three degrees of text/icon intensity (`@ui-text-muted` 64% on dark / 70% on light, `@ui-text-ink`, `--ui-text-selected` `#F0F0F0` on dark) and placeholder ink at 48% on dark / 54% on light (`--ui-text-placeholder-share`), unified `Hover = Keyboard Focus` under `@media (forced-colors: none)` with `UITheme.KeyboardMark` (`--ui-mark-keyboard`) removed, a 2 px outer focus halo (`--ui-input-focus-ring`) on `Filled` and `Outline` fields, `--ui-icon-scale` (`1.125`) across icons and glyphs, `UIFileInputVariant` (`Row`, `Tiles`, `Shelf`) on `FileInputComponent`, `UIExpanderVariant.Quiet` header alignment, instant toggle check state without pre-check flash, edge-placed dialogs drawing only their inner border, `UINotificationAction.Variant` defaulting to `UIButtonVariant.Surface` (was `Ghost`), `IPlaceholderInputComponent.Placeholder` gaining a setter, selection side strips kept only on `Tabs`/`TabsView`, horizontal `Menu`, `Rail` and quotes, and `UIColorInputVariant` and `ColorInputComponent.ShowPicker` removed in favour of one unified `ColorInputComponent` field with left swatch trigger, an always-available colour picker, and `ShowPalette` optionally adding a palette tab and right-aligned segmented `Picker | Palette` popup switcher (enforced on the server via `IClientWriteCheckComponent`).
- `UIForm.Composer(textArea, attachments?, banners)`: a calm chat/thread composer panel preset combining a borderless `SurfaceComponent` (`SetWindowFoot`), an optional shelf `FileInputComponent` wired to accept file drops across the whole panel and share the text area's `FormId`, optional reply/edit banners (`UIText.Quote`/`BoundQuote`), and a ghost `TextAreaComponent` (`SetShowFocusEdge(false)`, `SetAutoGrow(6)`, `SetActionsBelow(UIResponsiveTier.Md)`).
- Inline trigger suggestions (`@`, `/`) on `ITextEntryInputComponent` (`TextInputComponent` and `TextAreaComponent`): `AddTrigger`, `SetTriggers`, `SetTriggerItems`/`BindTriggerItems` (`UITextTrigger`, `UITextTriggerItem`), `OnTriggerSearch` (`EventNames.TriggerSearch`), `OnTriggerSelect` (`EventNames.TriggerSelect`) and `OnTriggerClick` (`EventNames.TriggerClick`), with `UIAction.ArgEventValue(name, index)` for indexed dynamic event parameters. A category item (`Items` or `LoadsFromServer = true`) steps into a second-level suggestion scope (narrowed on the client or loaded from the server via `OnTriggerSearch`, with `Backspace` on an empty query stepping back to the root categories), while a leaf item replaces the active `@query` token at the caret; completed trigger tokens render as inline pills (`var(--ui-wash-hover)` at rest, `var(--ui-wash-active)` on hover), delete as a single unit on `Backspace`/`Delete`, and raise `trigger-click` when `OnTriggerClick` is registered.
- `TableComponent` draws its own leading checkbox column under `SelectionMode = UISelectionMode.Many` (`TableComponent.SelectionColumnKey = "selection"`, `SelectAllRegionName = "select-all"`, `UIStrings.TableSelectAll` / `TableSelectRow`), with a three-state select-all checkbox in the header (across `HeldRows` under `Virtualized()` too), `Shift+Click` range selection on row checkboxes, and row checkboxes named after each row's header cell (moved from `DataGridComponent`).
- **Breaking:** plugin contract `ContractVersion = 4`: `temporal.pad`, `dom.ownDescendants`, and `EngineDisposable` on `registerEngine`; `ui.js` ships minified, and `RenderPatchParityTests` (`render-patch-corpus.json`) holds every `RenderProperty` site's first paint to its live patch operations.
- `UIThemeShape.RowRadius` defaults to `UICornerRadius.Uniform(6d)` (unifying `TableComponent`, `KeyValueActionComponent`, `TreeComponent` and `TabsComponent` outer corners with fields and buttons while `NotificationRadius` stays `0d`); `FileInputComponent` (`UIFileInputVariant.Tiles`) uses `UIStrings.FileChoose` (`ui.file.choose`), an outlined document dropzone glyph, and a soft surface hover wash on file tiles; `FileInputComponent` and inline `ImageInputComponent` compact `...` pickers share `.ui-field-stepper()` geometry; `UIMultiSelectVariant.Badges` chip remove buttons transition opacity without a circular hover fill; range `DateInputComponent`, `DateTimeInputComponent` and `CalendarComponent` display the active `Start`/`End` step caption in the bottom-left footer; and `UIMessage` defaults `action.Size` to `UISize.Small` with single-line vertical centering.
- `MenuComponent` supports nested submenus up to `MenuComponent.MaxSubmenuDepth` (`4`, `DefaultSubmenuDepth = 1`), auto-sized from authored `Items` (`ItemsComponentBase.OnItemsChanged()`) or set explicitly with `SetSubmenuDepth(depth)` for bound items, with docked submenu elevation (`.ui-elevation-2-docked(left|right)` in the plugin Less); `TreeComponent` and `TabsViewComponent` paint committed inline renames optimistically before the round trip answers, and `TreeComponent` draws a compact single-row drag ghost; background commands deliver their queued answers even if a later route check refuses the connection; `UIColorPalette.ResolvePrimaryMark()` (`--ui-color-primary-mark`) lifts custom dark primaries to at least `2.4:1` on dark grounds for `Brand` `FieldFocus` and `SelectionMark` while keeping default `AstralTeal` (`#006E64`) raw; `.ui-notification--primary` uses `--ui-color-primary-ink`; and labelled toggles (`CheckboxComponent`, `SwitchComponent`, `RadioGroupComponent`, `UIMultiSelectVariant.Checkboxes`) draw a row-1 outer hover/keyboard-focus contour wash alongside stepped box, ring, switch-knob and checked-primary indicators.
