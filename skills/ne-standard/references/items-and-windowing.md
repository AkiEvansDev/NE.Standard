# Items, Lists, Tables, Trees, and Windowed Sources Reference

Full guide: https://akievansdev.github.io/NE.Standard/items.html

## Items Hosts & Templates

- Hosts: `ItemsViewComponent`, `TableComponent`, `TreeComponent`, `TabsViewComponent`, `MenuComponent`, `BreadcrumbsComponent`, `StepsComponent`, `ButtonGroupComponent`, `SelectComponent`, `MultiSelectComponent`, `SearchComponent`, `RadioGroupComponent`, `KeyValueActionComponent`.
- Bind collection: `.BindItems<OrdersController>(c => c.Orders)` (or `.SetItems(...)` for static items).
- Custom row template (remember `UIBindingScope.Relative`!):
  ```csharp
  new ItemsViewComponent()
      .BindItems<OrdersController>(c => c.Orders)
      .SetTemplate(new SurfaceComponent()
          .AddChild(new TextComponent()
              .BindTitle<OrderItem>(x => x.Title, UIBindingScope.Relative)
          )
      )
  ```
- Polymorphic templates: `.SetTemplateKeyProperty<OrderItem>(x => x.Kind)` + `.AddTemplateVariant("invoice", ...)` (every variant must be non-null).
- Empty states: `.SetEmptyTemplate(UIPage.Empty(UIGlyphs.Inbox, "No orders", "Create an order to get started"))`, `.ConfigureDefaultEmptyTemplate(...)`, or `.SetShowEmptyTemplate(false)` (collapses the host root when empty so nested tag/attachment lists leave no parent gap).
- Accordion over a dynamic collection: `.SetLayoutType(UIItemsLayoutType.Accordion)` on `ItemsViewComponent` with an `ExpanderComponent` row template coordinates single-expand and connected borders/corners across visible rows on the client without controller `Expanded`/`BorderThickness`/`BorderRadius` state.

## Filtering, Sorting, Selection, and Row Events

- Client/server rules on the host:
  - `.FilterBy<OrderItem>(x => x.Status, UIComparisonOperator.Equal, "Open")` (or bound filter value via `FilterBy` / `DataGridComponent.AddFilter<TRow>`; `UIComparisonOperator.In` also checks intersection when the item property is a collection of strings or `IBindableItem`s against a `MultiSelectComponent`'s `ValueProperty`).
  - `.SortBy<OrderItem>(x => x.CreatedAt, UIItemsSortDirection.Descending)`.
  - `.AddItemReads<OrderItem>(x => x.ExtraField)` ensures custom properties needed by the client are projected.
- Selection: `.SetSelectionMode(UISelectionMode.One | Many)` + `.BindSelectedKey(c => c.SelectedId)` / `.BindSelectedKeys(c => c.SelectedIds)`.
- Standard row event blocks (`OnItemClick*`, `OnItemOpen*`, `OnItemRemove*`, `OnItemMove*`, `OnItemRename*`, `OnItemUnfold*`), each with 5 overloads (any inline rename via `.SetRenamable(true)`/`.BindRenamable(...)`, `OnItemRename*`, `UITabMenuEntries.Rename`, or `RenameItemEffect` also requires a writable `.BindRenamedTitle(...)`):
  - `OnItemOpen(command)`
  - `OnItemOpenLiteral(command, args...)`
  - `OnItemOpenWithItem(command)`
  - `OnItemOpenWithItemKey(command)`
  - `OnItemOpenWith(command, UIAction.Arg...)`

## Tables (`TableComponent`)

- Add columns with `.AddColumn(key, caption, template, width)` or the typed shorthand `.AddTextColumn<OrderItem>("Customer", x => x.CustomerName, width: UIGridUnit.Star(1))`.
- Accessibility: every row is named by its first captioned column or `.SetRowHeaderColumn(columnKey)`.

## Windowed / Virtualized Data (`UIItemSourceBase<TItem>`)

For large datasets or chat/activity streams that should not sit in memory all at once:

```csharp
public sealed class OrderSource : UIItemSourceBase<OrderItem>
{
    protected override async ValueTask<UIItemWindow<OrderItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        // Query slice using request.Offset, request.Count, and request.Query (filters/sorts)
        return new UIItemWindow<OrderItem>(items, request.Offset, totalCount, hasMoreBefore, hasMoreAfter);
    }
}
```

- Bind on `ItemsViewComponent`: `.BindSource<OrdersController>(c => c.OrderSource)`.
- Mutate the active window from the server using protected methods on `UIItemSourceBase<TItem>` — **never** mutate `Items` directly:
  - `Append(item)` / `Prepend(item)` / `Insert(item, sourceIndex)`
  - `Replace(item)` (updates an item in-place if currently in the window)
  - `Move(item, oldIndex, newIndex)`
  - `Remove(key, sourceIndex?)`
  - `Invalidate()` (forces the client to re-request the window from its current edge, including `AnchorToEnd` chat views).
- Use `.SetAnchorToEnd(true)` for chat/log views that start at the bottom and load older history when scrolling up.
- Use `.SetLoadingLook(UIItemsLoadingLook.Indicator)` when rows have variable heights.
