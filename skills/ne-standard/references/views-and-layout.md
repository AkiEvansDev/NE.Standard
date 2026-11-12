# Views and Layout Reference

Full guide: https://akievansdev.github.io/NE.Standard/views.html

## Defining a View

```csharp
public sealed class OrdersView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "orders";

    public override string Title => "Orders";

    public override UIViewOptions Options => new()
    {
        StickyHeader = true,
        ScrollContentOnly = true,
        ShellLayout = UIShellLayout.HeaderFirst
    };

    protected override IVisualComponent CreateContent() => ...;
}
```

- Regions (`protected virtual`, except `CreateContent` which is `protected abstract`): `CreateContent()` (required, returns `IVisualComponent`), `CreateHeader()`, `CreateFooter()`, `CreateLeftSide()`, `CreateRightSide()` (each returns `IVisualComponent?`).
- `CreateDialogs()` (`protected virtual`) returns `IReadOnlyList<UIDialog>` (use `UIDialogs.Create`, `UIDialogs.Form`, `UIDialogs.Confirm`, or `new UIDialog(key, content) { TitleId = ..., CloseOnBackdrop = true, CloseOnEscape = true }.OnClose(command)`).
- `CreateShortcuts()` (`protected virtual`) returns `IReadOnlyList<UIShortcut>` (`new UIShortcut("Ctrl+S", nameof(OrdersController.Save))`).
- Authored IDs (`new StackPanelComponent("sidebar")`) persist reader state (splitter share, collapsed state, pane layout) across reloads.

## 24-Column Grid & Responsive Values

- Every `ContainerComponent` is a 24-column CSS grid:
  - `SetPlacement(column, row, columnSpan = 1, rowSpan = 1)` (1-based column and row indices; responsive overloads take `sm:`, `md:`, `xl:`, `xxl:`).
  - `SetColumn(index, UIGridUnit.Star(1))` / `SetRow(index, UIGridUnit.Auto)` / `AddRow(UIGridUnit.Star(1))`.
- Responsive values are phone-first (`base`, then `sm` ≥ 640 px, `md` ≥ 768 px, `xl` ≥ 1280 px, `xxl` ≥ 1536 px):
  `UIResponsive<T>.Create(baseValue, sm: ..., md: ..., xl: ..., xxl: ...)`.
- `StackPanelComponent`: `SetOrientation(UIOrientation.Vertical, md: UIOrientation.Horizontal)`, `SetSpacing(12)`.
- `GridSplitterComponent`: `BindPosition(c => c.SplitShare)` divides adjacent grid tracks and persists the reader's drag.
- `PaneContainerComponent`: `AddPane(key, title, content)`, `BindLayout(c => c.Layout)` lets the reader rearrange panes.

## Links, Clickable Surfaces, and Markup

- **Surface/Card as a button**: `.OnClick(nameof(Controller.Open))` or `.OnClickWithItemKey(nameof(Controller.OpenRow))` makes `SurfaceComponent` or `CardComponent` interactive automatically (`SetClickable` is not needed unless turning it off).
- **Surface/Card/Button/Action/FileTile as a link**: `.SetUrl("/path")` or `.BindUrl(c => c.Href)`.
  - A linked surface/card **cannot** also have a click command or contain interactive controls inside it (buttons, inputs, tabs, pagers, switchers, expanders, trees, selectable tables, steps, data grids, or interactive charts).
- **Text markup**:
  - `TextComponent.Description` and `ParagraphComponent.Description` support inline emphasis/code/links unless `SetDescriptionPlain(true)` is set (or `Bound*` presets are used, which always render data plain).
  - `SetDescriptionAutolinks(true)` turns bare `http(s)://` URLs into links (ideal for chat messages).
  - `SetHeadingLevel(1..6)` renders `.ui-text__title` as semantic `<h1>`–`<h6>`.
- **Phone system bars**: Mark a full-width bottom composer or bar with `.SetWindowFoot()` (`UIForm.Composer` does this by default) so the phone's system bar matches its background, automatically dimmed by `var(--ui-color-overlay)` while a modal side drawer or modal dialog is open; unpinned slide-out drawers stop at `bottom: env(safe-area-inset-bottom, 0px)` on a `1px solid var(--ui-color-border)` bottom hairline.
