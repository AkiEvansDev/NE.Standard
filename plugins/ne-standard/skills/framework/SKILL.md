---
name: framework
description: The map of NE.Standard, the server-driven UI framework for .NET (packages NE.Standard.UI*), with the API that carries each capability and the guide that explains it. Use it whenever you write or change an application on NE.Standard - a view (UIViewBase), a controller (UIControllerBase, [RecursiveMember], [UICommand]), a binding, a component, a preset (UIPage, UILayout, UIButtons, UIForm, UIDialogs...), an interaction or a client effect, a dialog or a toast, a list or a windowed item source, a route or a navigation, sign-in and [UIAuthorize], uploads and downloads, words and languages, the theme, the web host, an add-on (icons, CodeInput, DataGrid, Charts, Graph), or a test with NE.Standard.UI.Testing. Read it before writing a helper, a component, a layout or a workaround of your own - the framework very likely has it already.
---

# NE.Standard: what the framework already has

A second way to do something the framework does is a defect: before writing a helper, a layout, a busy flag, a dialog or a
JavaScript snippet of your own, find it here. Every line names the real API and the guide page that explains it.

**Where the details are**

- The guides: https://akievansdev.github.io/NE.Standard (each page below is linked as `guide.html`).
- One page per component, with every property, its `Set*`/`Bind*`, its events and methods:
  `https://akievansdev.github.io/NE.Standard/components/<kebab-name>.html` (`TextInputComponent` is `text-input`). The full
  catalogue, add-ons included, is [components.md](components.md) beside this file.
- **Exact signatures of the version you build against** are in the packages themselves: every package ships its XML docs and
  README in the NuGet cache, `~/.nuget/packages/<package id, lower case>/<version>/lib/net10.0/<Package.Id>.xml` and
  `.../<version>/README.md` (the version is the one in the project's `Directory.Packages.props`). Grep the XML for a member
  (`M:NE.Standard.UI.Extensions.UILayout.Panes`) instead of guessing an overload.
- When an API here and the package disagree, the package wins: this map follows the framework's newest release.

## The model

You write a **view** (a component tree in fluent C#) and a **controller** (an observable object graph with commands). The
framework compiles the pair once, renders it, and keeps the page and the controller in sync both ways over SignalR. The client
holds no application state and decides nothing; state survives a reload exactly when it is in the controller.

- An application is a class library on the platform-free packages (views, controllers, routes, words, services) plus a web host
  project that only hosts it: [getting-started.html](https://akievansdev.github.io/NE.Standard/getting-started.html).
- **Every package brings its namespaces as global usings** - an explicit `using` of one fails the build (IDE0005 under
  warnings-as-errors). `NEStandardUIImplicitUsings=false` turns them off. Package author namespaces (compiled view, web render
  contracts, renderer foundation) are not global: [packages.html](https://akievansdev.github.io/NE.Standard/packages.html).
- Library: `NE.Standard.UI` (engine, built-in components, generators), optional `NE.Standard.UI.Extensions` (presets),
  `NE.Standard.UI.Testing` in the test project. Host: `NE.Standard.UI.Web` + `NE.Standard.UI.Web.Renderers`. An add-on is the
  same two halves. `dotnet list App package --include-transitive` must show no `NE.Standard.UI.Web*` in the library.

## Startup and the web host

- `AppStartup : UIStartupBase` - `ConfigureServices(services)` for the application's services, `ConfigureApplication(application)`
  for routes and options. `AppWebStartup : WebStartupBase<AppStartup>` - `services.AddStandardRenderers()` and each add-on's
  `Add*()`.
- `Program.cs`: `WebStartupBuilder.Configure<AppWebStartup, AppStartup>(builder.Services)`, then `app.UseStaticFiles()`,
  `app.UseRouting()`, `await app.MapStandardUIWebAsync()` - in that order, never `MapStaticAssets()`.
- `UIApplicationBuilder`: `Route`, `SignInView`, `ForbiddenView`, `NotFoundView`, `ErrorView`, `ConfigureSecurity`,
  `ConfigureSessions`, `ConfigurePersistence`, `ConfigureErrorHandling`, `ConfigureLocalization`, `AddLocalizationSource`,
  `AddFrameworkWords`, `ConfigureTemporal`, `ConfigureTheme`, `ConfigureFiles`, `AddViewFilter`, `AddCommandFilter`.
- Behind a proxy `UseForwardedHeaders` runs before the framework; `WebEndpointOptions` (`RequireAuthorization`,
  `AuthorizationPolicy`), `WebResponseCompressionOptions`, `WebViewRenderCacheOptions`, `WebValueOptions`, assets through
  `IWebAssetRegistry`, content scoped to a user through `IUIContentProvider`:
  [web-hosting.html](https://akievansdev.github.io/NE.Standard/web-hosting.html).

## Views

[views.html](https://akievansdev.github.io/NE.Standard/views.html)

- `sealed class XView : UIViewBase, IUIViewDefinition` with `static string ViewKey`; regions `CreateContent()` (required),
  `CreateHeader()`, `CreateFooter()`, `CreateLeftSide()`, `CreateRightSide()`; `Title`; `Options` (`UIViewOptions`:
  `StickyHeader`, `ScrollContentOnly`, `ShellLayout`, `SideDrawers`, `LeftDrawerModal`/`RightDrawerModal`,
  `NotificationPlacement`, `NotificationWidth`).
- `CreateDialogs()` returns `UIDialog`s (`Key`, `Content`, `CloseOnBackdrop`, `CloseOnEscape`, placement as a sheet);
  `CreateShortcuts()` returns `UIShortcut("Ctrl+S", command or effect)`; a button's own chord is `SetShortcut`.
- Fluent naming: `Set*` a value fixed in the view, `Bind*` a controller path, `On*` an event to a command, `Configure(...)` for
  the rare rest, `AddChild`/`AddChildren` on containers. An authored id (`new StackPanelComponent("sidebar")`) is what remembers a
  reader's own state across reloads.
- Layout: a 24-column grid per container (`SetPlacement(column, row, span, rows)`, `SetColumn`/`SetRow`/`AddRow` with
  `UIGridUnit.Absolute/Star/Auto`), responsive values `UIResponsive<T>.Create(base, sm:, md:, xl:, xxl:)` written phone first.
  `GridSplitterComponent` lets the reader re-divide tracks (`BindPosition` keeps the share per person), `PaneContainerComponent`
  lets them move whole panes (`AddPane`, `BindLayout`).
- `SetContextMenu(menu)` on any component (press-and-hold on a phone), `SetClickable(true)` on a surface or card, `SetVisibility`,
  `SetTheme`, `TextSelectable`, inline text markup in a text's words (`SetDescriptionAutolinks(true)` links bare http(s)
  addresses, for a chat's messages; `SetDescriptionPlain(true)` shows the words as written).
- `WindowFoot` (`SetWindowFoot(true)`) on the composer or the last row at a window's bottom edge colours the phone's system bar.

## Controllers and state

[controllers.html](https://akievansdev.github.io/NE.Standard/controllers.html)

- `sealed partial class XController : UIControllerBase`. `[RecursiveMember] public partial T Name { get; set; }` generates the
  notifying setter and the binding segment; a nested `RecursiveObservable` property makes a path (`"Group.Striped"`).
- Collections are `RecursiveCollection<T>` under `[RecursiveMember(false)]` with no setter, mutated in place. An item is a
  `RecursiveObservable, IBindableItem` whose `Id` is `[RecursiveMember(false)]`, init-only: never re-key an item.
- `[UICommand]` (optional name, `ConcurrencyMode = Exclusive | Background`, `MaxConcurrent`) returns `void`, `Task`,
  `UICommandResult` or `Task<UICommandResult>`; `UICommandResult.Ok(effects)` / `Fail(error, effects)`. Arguments come from the
  event: `UIAction.Arg`, `ArgCurrentItem`, `ArgCurrentItemKey`, `ArgGroupKey`, `ArgRoot/ArgParent/ArgRelative`, `ArgEventValue`.
  A background command must not read-modify-write state another command writes.
- Hooks: `OnInitializeAsync`, `OnNavigatedAsync(UINavigationRequest)`, `OnAttachedAsync`, `OnDetachedAsync`,
  `OnVisibilityChangedAsync`, `OnLanguageChangedAsync`, `OnThemeChangedAsync`, `OnNotificationPermissionChangedAsync`,
  `OnLeaveRequestedAsync` with `HoldsUnsavedWork` (the leave guard), `OnNotify(RecursiveChange)` to react to a change.
- `Context` (`UIContext`): `Dialogs`, `Downloads`, `Uploads`, `Translate`, `Services` (the page's scope: take an
  `IDbContextFactory<T>`, a context per command), `Logger`, `Route`, `Handle`, `Connection`, `TimeZone`, `ToLocalTime`,
  `StartOfDayUtc`, `GetSessionAsync`, `SignInAsync`, `SignOutAsync`, `UpdateSessionAsync`, `SendEffectsAsync`,
  `SendEffectsToAllAsync`, `Subscribe`/`Unsubscribe(topic)`, `Runtime`.
- `Context.Runtime` (`IUIRuntimeAccess`): `InvokeAsync` (run under this runtime's lock and flush), `Post` (queue between
  exclusive commands), `Start` (a long job the runtime owns, outliving the press), `SendEffectsToAllAsync`, `SendEffectsToAsync`.
- Another person's page is reached through `IUIBroadcast.PostAsync(topic, ...)` / `PostToUserAsync(userId, ...)`, a topic the
  controller subscribed to: chat rooms, a ticket, a dashboard.
- `[UIControllerRuntime(UpdateMode = Batch | Direct)]`; lifetime `UIPersistenceOptions.Lifetime` (`PerPage`, `PerWindow` default,
  `PerClient`) through `ConfigurePersistence`.

## Binding, validation and forms

[binding.html](https://akievansdev.github.io/NE.Standard/binding.html)

- Paths are `RecursivePath` (`Lines[0].Price`); write `nameof(...)` for a property. Scopes `UIBindingScope.Root` (the default of
  every `Bind*`), `Relative` (inside an item template - pass it explicitly), `Parent`; `BindContext` moves a subtree's root.
- Modes `OneWay`, `TwoWay` (an input's `Value` by default), `OneWayToSource`, `OnSubmit` (buffered until
  `ButtonComponent.OnSubmit(formId, command)`; `DiscardFormEffect(formId)` drops the edits).
- Rules on an input: `Required`, `Regex`, `RegexEach`, `Validate(trigger, operator, value, message)` with `UIValidationTrigger`
  and `UIValidationSeverity`; the server's verdict is `BindValidation` to a `UIValidationMessage`. Keep submit enabled.
- The server refuses a value outside an input's `Min`/`Max`/`Step`, a write to a read-only or hidden input and a command from a
  disabled, loading or hidden component - but permissions still belong in the command.

## Interactions: one component reacting to another, on the page

[interactions-and-effects.html](https://akievansdev.github.io/NE.Standard/interactions-and-effects.html). These run in the
browser with no round trip; reach for them before a command that only flips a flag.

- **The call is made on the target; the id argument names the source.** Written the other way round it compiles and does
  nothing.
- `Interact(source, target, UIComparisonOperator, value, whenTrue, whenFalse)` - a property written from another's value
  (`Required`, `Equal`, `NotEqual`, `Greater`..., `Like`, `In`, `Regex`, `LikeIgnoreCase`).
- `InteractCopyValue(sourceId, target)` - follow a slider or a field live, every input.
- `InteractBefore`/`InteractAfter(eventName, target, value)`, `InteractBeforeClick`/`InteractAfterClick`,
  `InteractOnHoverStart`/`InteractOnHoverEnd`, `InteractOn(eventName, target, value)`; event names from `EventNames`.
- Busy while a round trip runs: `ShowLoadingDuring(eventName)`, `ButtonComponent.OnClickShowingLoading(command)` (also refuses a
  second press). Never a hand-made busy flag for one command.
- An interaction may run a client-only effect: `InteractOn(event, effect)`, `Interact(source, effect, ...)` - only effects with
  `CanRunInInteraction` (focus, scroll, copy, insert text, theme, language, rename, picker, lightbox, back).
- Presets over them: `ShownWhen`, `HiddenWhen`, `EnabledWhen` (another component's value), `ShownFrom`/`ShownBelow` (a breakpoint).
- Components that scroll together share `SetScrollGroup("name")`.

## Client effects: what a command asks the page to do

Returned in `UICommandResult.Ok([...])`, pushed with `Context.SendEffectsAsync`, or run by an interaction where allowed:
`NavigateEffect`, `NavigateBackEffect(fallback)`, `ReplaceAddressEffect`/`PushAddressEffect` (state in the address, no reload),
`ConfirmLeaveEffect`, `FocusEffect`, `ScrollToEffect`, `ScrollEffect`, `ScrollToItemEffect(listId, key)`, `ShowEffect`,
`HideEffect`, `CollapseEffect`, `DiscardFormEffect`, `OpenDialogEffect`/`CloseDialogEffect(key)`, `ShowNotificationEffect`,
`ShowSystemNotificationEffect`, `AnnounceEffect` (screen reader only), `DownloadFileEffect`, `SetThemeEffect`,
`SetThemeColorsEffect`, `SetLanguageEffect`, `RenameTabEffect`, `RenameNodeEffect`, `CopyToClipboardEffect`, `InsertTextEffect`,
`OpenPickerEffect`, `ShowImageEffect` (lightbox; `OnClickShowImage` on a surface). `ClientEffectKinds` lists the kinds.

## Presets (NE.Standard.UI.Extensions)

[extensions.html](https://akievansdev.github.io/NE.Standard/extensions.html). A preset holds a look in one place - use it
rather than rebuilding the arrangement with your own widths and spacings. Each returns an ordinary built-in component.

- `UIPage` - `Header`, `BoundHeader` (a band led by `UIIconButtons.Back()`), `Section`, `Heading`, `Fold`, `Labelled`, `Band`,
  `Column` (`UIColumnWidth.Reading/Form/Wide`), `Banner`, `Empty` (nothing chosen or made yet), `Outcome` (what a submit came
  to), `Status` (not found, refused, failed). `UIHeaderSize` sizes a header.
- `UILayout` - `Stack`, `Row`, `Columns`, `Split`, `Sidebar`, `Board`, `Ends`, and `Panes` - a list beside the thing chosen in
  it (chats and a conversation, a tree and a note), one at a time on a phone:
  `UILayout.Panes(list, detail, nameof(Controller.Panes), placeholder: UIPage.Empty(...), splitter: true)` over a controller
  property `[RecursiveMember] public partial UIPanesState Panes { get; set; } = new();`. The page calls `Panes.ShowDetail()`
  (an item chosen), `Panes.ShowList()` (back, the chosen one still beside it from md), `Panes.ShowNothing()` (back, nothing
  chosen); `DetailInFront` and `Chosen` read the state and `ListVisibility`/`DetailVisibility`/`PlaceholderVisibility` bind
  anything else that switches with it (`"Panes.ListVisibility"`). The splitter's `Share` is seeded with `SeedShare(stored)` and
  `ShareChanged` (subscribed once) fires on any change but the seed - the reader moving it - with no share path watched in `OnNotify`. `PanesListVisibility`/
  `PanesDetailVisibility`/`PanesPlaceholderVisibility` are the values the state holds, for a part that follows a pane.
- `UIButtons` - `Primary`, `Accent`, `Danger`, `Ghost`, `Outline`, `Link`, `Icon`, `Pair` (a form's foot), `Toolbar`.
- `UIIconButtons` / `UIMenuItems` - the standard actions with their glyph and words: `Add`, `Attach`, `Back`, `Cancel`, `Close`,
  `Copy`, `Delete`, `Done`, `Download`, `Edit`, `Filter`, `Menu`, `More`, `New`, `Open`, `Pin`, `Redo`, `Refresh`, `Remove`,
  `Rename`, `Save`, `Search`, `Send`, `Settings`, `Share`, `SignOut`, `Stop`, `Undo`, `Unpin`, `Upload`.
- `UIText` - `Display`, `Title`, `Subtitle`, `Body`, `Caption`, `Label`, `Note`, `Paragraph`, `Quote`, `Person` (`UIPersonSize`),
  `WithBadges`; and on any text `AsDisplay`, `AsTitle`, `AsSubtitle`, `AsBody`, `AsCaption`, `AsOverline`, `Muted`
  (`TextPresetExtensions`).
- `UIForm` - `Field(input, hint)`, `Row(fields)`. `UIDetails` - `List`, `Row`, `Amount`, `Total` (names and values to read).
- `UICard` - `Create`, `Centered` (one card alone: sign-in, refusal). `UIMessage` - `Create`, `Info`, `Success`, `Warning`,
  `Danger` (`UIMessageSeverity`): a message that stays while true.
- `UIDialogs` - `Create`, `Header`, `Content`, `Form`, `Confirm`, `BoundConfirm`.
- `StatePresetExtensions` (`ShownWhen`, `HiddenWhen`, `EnabledWhen`) and `ResponsivePresetExtensions` (`ShownFrom`, `ShownBelow`).

## Built-in components

The whole catalogue with a link per page is [components.md](components.md). In short: layouts (`ContainerComponent`,
`StackPanelComponent`, `WrapPanelComponent`, `ScrollContainerComponent`, `SurfaceComponent`, `CardComponent`, `ExpanderComponent`,
`AccordionComponent`, `CollapsiblePanelComponent`, `FlyoutComponent`, `GridSplitterComponent`, `PaneContainerComponent`), contents
(`TextComponent`, `ParagraphComponent`, `IconComponent`, `ImageComponent`, `BadgeComponent`, `LinkComponent`, `StatusComponent`,
`TimestampComponent`, `FileTileComponent`, `KeyValueActionComponent`, `SeparatorComponent`), actions (`ButtonComponent`,
`ActionComponent`, `SplitButtonComponent`, `CommandBarComponent`, `ThemeSwitcherComponent`, `LanguageSwitcherComponent`), inputs
(text, area, number, slider, switch, checkbox, radio, select, multi-select, badge select, search, date, time, date-time,
calendar, colour, file, image), items (`ItemsViewComponent`, `TableComponent`, `TreeComponent`, `PagerComponent`), navigation
(`MenuComponent`, `TabsComponent`, `TabsViewComponent`, `BreadcrumbsComponent`, `ButtonGroupComponent`), indicators
(`ProgressComponent`, `SpinnerComponent`).

## Items, lists and windowed sources

[items.html](https://akievansdev.github.io/NE.Standard/items.html)

- `SetItems` (static) or `BindItems(path)` over a `RecursiveCollection<T>`; every item is keyed. Templates through
  `SetTemplate` with `Relative` bindings; built-in models (`TextItem`, `MenuItem`, `TreeNode`, `TabItem`, `BadgeItem`,
  `OptionItem`, `FileItem`...) and default templates.
- Grouping, filtering and sorting rules, selection (`SelectedKey`, `SelectedKeys`), item abilities (`CanSelect`, `CanDrag`,
  `Renamable`...), moving rows (`OnItemMoveWithItemKey`), drag and drop between lists, virtualized hosting, the empty template
  (`ConfigureDefaultEmptyTemplate`, or `SetEmptyTemplate(UIPage.Empty(...))`, centred in a list given the region's height), a
  navigation rail per breakpoint (`SetDisplay(UIMenuDisplay.Rail, xl: UIMenuDisplay.List)`: one menu, a list in a phone's drawer
  or the bottom bar).
- A collection too large to hold: `UIItemSourceBase<TItem>` with `GetWindowAsync(UIItemWindowRequest)` answering
  `UIItemWindow<TItem>` (`Offset`, `TotalCount`, `HasMoreBefore/After`); the subclass writes the window with its protected
  `Append`, `Prepend`, `Remove`, `Invalidate`, and `LoadWindowAsync` reads one on the server; `UIItemsQuery` carries the host's filters and sorts; `UIComparisonEvaluator` for an in-memory scan;
  `SetLoadingLook(UIItemsLoadingLook.Indicator)` for rows of uneven height. `AnchorToEnd` for a conversation.

## Dialogs, notifications and failures

[dialogs-and-notifications.html](https://akievansdev.github.io/NE.Standard/dialogs-and-notifications.html)

- A dialog is declared by the view (`CreateDialogs`, or `UIDialogs.*`) and opened by key (`OpenDialogEffect`); `Context.Dialogs`
  (`ShowAsync`/`HideAsync`) for one that stands open while a command works.
- A toast is `ShowNotificationEffect(message or UIPhrase, UIColorStyle)` with an optional action; off screen,
  `ShowSystemNotificationEffect`. In-page messages are `UIMessage`/`UIPage.Banner`; a status on an item is a badge.
- A failed or refused command gets a toast by itself (`UIErrorHandlingOptions` through `ConfigureErrorHandling`:
  `CommandRefusedMessage`, `CommandFailedMessage`, `ErrorRoute`, `NotFoundRoute`, `IncludeExceptionDetail`): do not re-check a
  role in the command just to answer gracefully.

## Routing and navigation

[routing.html](https://akievansdev.github.io/NE.Standard/routing.html)

- `application.Route<TView>(path)`, `Route<TView, TController>(path, route => route.Require(rule).AllowAnonymous().Identity("id")
  .CompilationMode(UIViewCompilationMode.Lazy).ControllerUpdates(mode))`.
- Parameters arrive in `OnNavigatedAsync` (`navigation.TryGetParameter`); a page's state in its address is
  `ReplaceAddressEffect`/`PushAddressEffect`; `Identity(...)` names the parameters that make another runtime.
- `IUIViewFilter` (`AddViewFilter`, runs twice per page load - test `context.Phase`), `IUICommandFilter` (`AddCommandFilter`);
  `NotFoundView`, `ErrorView`.

## Authorization and sessions

[security.html](https://akievansdev.github.io/NE.Standard/security.html)

- The framework keeps its own session (`UserSessionState`: `UserId`, `Roles`, `Permissions`, `Language`, `ThemeMode`,
  `TimeZone`) in `IUserSessionStore`; the default is in memory - `services.AddSignedInUserSessionStore<TStore>()` keeps signed-in
  sessions in the application's store, `AddUserSessionStore<TStore>()` all of them. `ConfigureSessions` (`IdleTimeout`,
  `ClientKeyLifetime`...).
- Sign in from the page's own command: `await Context.SignInAsync(userId, roles, permissions)`, then answer in place or navigate;
  `Context.SignOutAsync()` then a `NavigateEffect`. Read `returnUrl` once and accept it only if `UIRoutePath.IsLocal`.
- `[UIAuthorize("Admin,Support", Permissions = "billing.view", RolesMode = UIAccessMode.Any)]` and `[UIAllowAnonymous]` on a
  view, a controller or a command; `route.Require(new UIAccessRule { ... })` closes a route. Behind a login set
  `ConfigureSecurity(o => o.DefaultPolicy = UIAuthorizationDefault.Authenticated)` so a forgotten attribute closes a page.
- `SignInView<TView, TController>(route)` and `ForbiddenView<TView>(route)` route refusals (`UnauthorizedAccessException` to sign
  in with `returnUrl`, `UIForbiddenAccessException` to forbidden with `deniedUrl`). A command is checked against the store, so a
  revoked role holds from the next command.
- Ending others' sessions: `IUISessions.EndUserSessionsAsync`, `EndSessionAsync`, `UpdateUserSessionsAsync`. Host identity
  instead: `IdentitySource = UIIdentitySource.Claims`, `IUserClaimsMapper`, `HttpContext.EndUISessionAsync()` at the host's
  sign-out; the seam for custom rules is `IUIAuthorizationService`.

## Files

[files.html](https://akievansdev.github.io/NE.Standard/files.html)

- `FileInputComponent`/`ImageInputComponent` upload on pick and bind `SelectionId` (variants `Picture`, `Avatar`, `Inline`,
  `Shelf`); read the bytes with `Context.Uploads.GetSelectionAsync`; limits in `ConfigureFiles`, enforced on the server. Give a
  picker the composer's `SetFormId`: the form's `OnSubmit` then waits for its uploads in flight, so the file is never missed.
- A download is `Context.Downloads.DownloadAsync(Context.Handle, name, type, bytes or stream)` (single-use, sends a
  `DownloadFileEffect`); content kept around (avatars) is `IUIContentProvider` with `IUIContentAddressResolver`.

## Words and languages

[localization.html](https://akievansdev.github.io/NE.Standard/localization.html)

- A value on a `[Translatable]` property is a key; content shown as written is marked so (`AsContent`, `IsContent` on items).
  Arguments and plurals are a `UIPhrase` (`UIPhrase.Of("key", ("count", n))`, `key.one`/`key.other`), never a string you build.
- `application.AddLocalizationSource(dictionary or ITranslationSource)`, `ConfigureLocalization` (`DefaultLanguage`,
  `KeyPrefixes`, missing words), `Context.Translate`, `SetLanguageEffect`, `LanguageSwitcherComponent`; the framework's own words
  are `UIStrings`; dates and numbers through `ConfigureTemporal`, `Context.ToLocalTime`.

## Theme and design

[theming.html](https://akievansdev.github.io/NE.Standard/theming.html) and
[design.html](https://akievansdev.github.io/NE.Standard/design.html)

- `application.ConfigureTheme(theme => theme.ConfigureLightPalette(p => p with { Primary = new ColorVariant(ColorName.X) }) ...)`
  - `UITheme`, `UIColorPalette`, `UITypography`, `UIShape`; colours by role (`UIThemeColor.Primary`, `Accent`, `Success`,
  `Warning`, `Danger`, `Info`, `Muted`), never a raw colour for chrome. Reader's mode and colours: `SetThemeEffect`,
  `SetThemeColorsEffect`, `ThemeSwitcherComponent`.
- The design rules in short: start from the phone; one primary action per area; text by role (`TitleType`), not size; the
  container gives the air (`Spacing` 4/8/12/16/24); a card frames one thing; an empty region is `UIPage.Empty`; check both themes.

## Tests without a browser

[testing.html](https://akievansdev.github.io/NE.Standard/testing.html)

- `await using UITestApp app = UITestApp.Create<AppStartup>(configureServices: ..., configureApplication: ...)`;
  `UITestPage page = await app.OpenAsync("/route", session => session.SignIn("id", roles: ["admin"]))`.
- Find with `page.Component(id)`, `ComponentBoundTo(path)`, `ComponentNamed(name)`, `Rows`, `Row(key)`, `ContextMenu`; act with
  `SetValueAsync`, `ClickAsync` (`UITestCommandResult.Sent`); read `Value`, `Title`, `IsVisible`, `IsEnabled`,
  `ValidationMessage`, `page.Effects`, `EffectsOf<T>()`, `IsDialogOpen`, `Address`, `Downloads`, `Controller<T>()`;
  `page.FlushAsync()` delivers what a batch runtime holds.

## Add-ons

[addons.html](https://akievansdev.github.io/NE.Standard/addons.html). Each is a library half and a host half, registered in the
web startup next to `AddStandardRenderers()`; each README in the NuGet cache is its full reference.

- **Icons** - `NE.Standard.UI.Icons.Material` / `.Web.Icons.Material`: `MaterialIcons.Save`, `MaterialIcons.Outlined(...)`;
  host `services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, names...)` - only registered names
  draw, a misspelt one fails at startup; `MapUIGlyph` draws the framework's own glyphs from the set.
- **CodeInput** - `CodeInputComponent` (`SetLanguage(UICodeLanguages.Json)`, `SetRows`, `BindValue`, Ctrl+S raises `save`) and
  `MarkdownDisplayComponent`; host `services.AddCodeInput()`.
- **DataGrid** - `DataGridComponent` (a `TableComponent` with `AddTextColumn`, `AddEnumColumn<T>`, `AddNumberColumn`,
  `AddMoneyColumn`, `AddDateColumn`, `AddBooleanColumn`, sorting, filters, editing, paging, totals, CSV export),
  `DataGridCellComponent`, `DataGridFilterComponent`; host `services.AddDataGrid()`.
- **Charts** - `LineChartComponent`, `AreaChartComponent`, `BarChartComponent`, `PieChartComponent`, `ShareBarComponent`,
  `ScatterChartComponent`, `RadarChartComponent`, `SparklineComponent`, `GaugeComponent` over keyed collections (`BindItems`,
  `SetX`, `SetXAxis(UIChartAxis.Time(...))`, `AddSeries`); host `services.AddCharts()`.
- **Graph** - `NodesComponent` (a node network whose kinds are C# classes, `SetCatalog`, `UINodeCatalog.FromTypes`,
  `UINodeKinds.Common`), `NodesParametersComponent`, `LayeredGraphComponent`, `ProductionGraphComponent`; host
  `services.AddGraph()`; `NE.Standard.UI.Graph.Calculator` (`CalculatorNodes.Kinds`) and `NE.Standard.UI.Graph.Image`
  (`ImageNodes.Kinds`, `AddGraphImages()`, `IUINodeImageStore`). Its own site: https://akievansdev.github.io/NE.Standard.UI.Graph.

## Traps worth knowing

- An item template binds `UIBindingScope.Relative`; the default `Root` inside a row is almost never meant.
- A view compiles once and is shared: per-request content goes through the controller, never by building the view differently.
- Don't keep a page's state anywhere but the controller; don't hand-roll a busy flag, a confirm dialog, a toast, a list/detail
  switch, a back button or an empty state - the presets and effects above are those.
- Change an item in place rather than rebuilding a collection, so a reader's selection and scroll survive a push.
- Found a gap or a bug in the framework? Write down the workaround in the application and report it upstream rather than
  patching around it silently.
