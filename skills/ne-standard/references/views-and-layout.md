# Views and Layout Reference

Full guide: https://akievansdev.github.io/NE.Standard/views.html

## Defining a View

```csharp
public sealed class OrdersView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "orders";

    public override string? Title => "Orders";

    public override UIViewOptions Options => new()
    {
        StickyHeader = true,
        ScrollContentOnly = true,
        ShellLayout = UIShellLayout.HeaderFirst
    };

    public override IUIComponentDefinition CreateContent() => ...;
}
```

- Regions: `CreateContent()` (required), `CreateHeader()`, `CreateFooter()`, `CreateLeftSide()`, `CreateRightSide()`.
- `CreateDialogs()` returns `IEnumerable<UIDialog>` (use `UIDialogs.Create`, `UIDialogs.Form`, `UIDialogs.Confirm`, or `new UIDialog(key, content) { TitleId = ..., CloseOnBackdrop = true, CloseOnEscape = true }.OnClose(command)`).
- `CreateShortcuts()` returns `IEnumerable<UIShortcut>` (`new UIShortcut("Ctrl+S", nameof(OrdersController.Save))`).
- Authored IDs (`new StackPanelComponent("sidebar")`) persist reader state (splitter share, collapsed state, pane layout) across reloads.

## 24-Column Grid & Responsive Values

- Every `ContainerComponent` is a 24-column CSS grid:
  - `SetPlacement(column, row, columnSpan = 1, rowSpan = 1)` (1-based column and row indices; responsive overloads take `sm:`, `md:`, `xl:`, `xxl:`).
  - `SetColumn(index, UIGridUnit.Star(1))` / `SetRow(index, UIGridUnit.Auto)` / `AddRow(UIGridUnit.Star(1))`.
- Responsive values are phone-first (`base`, then `sm` ≥ 600 px, `md` ≥ 960 px, `xl` ≥ 1280 px, `xxl` ≥ 1920 px):
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
- **Phone bottom bar**: `SetWindowFoot(true)` on the bottom-most composer or bar colours the mobile system bar to match.
