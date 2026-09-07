# Changelog

The framework's changelog — the `core` slice. One section per release, headed `## X.Y.Z`; the tag that carries
it is `core/vX.Y.Z`. Every package in the slice carries the same version and goes out together, so a section
describes the release, not a list of packages that moved. Other slices keep their own — the icon sets in
`addons/Icons/CHANGELOG.md`, the code input in `addons/CodeInput/CHANGELOG.md`.

The release workflow cuts the matching section out to become the body of the GitHub release — a tag with no
section fails the release before anything is published.

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
  drags), `Tree` (a flat keyed list folded on the client, a template per node kind, children asked for once
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
