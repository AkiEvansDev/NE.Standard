# Controllers, Binding, Validation, and Forms Reference

Full guides:
- https://akievansdev.github.io/NE.Standard/controllers.html
- https://akievansdev.github.io/NE.Standard/binding.html

## Controllers and Observable State

```csharp
public sealed partial class OrdersController : UIControllerBase
{
    [RecursiveMember]
    public partial string Filter { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<OrderItem> Orders { get; } = [];
}
```

- `[RecursiveMember]` on a `partial` property generates change notifications and path segments.
- Nested `RecursiveObservable` properties form dotted paths (`Filter.Status`).
- **Collections**: always `RecursiveCollection<T>` with `[RecursiveMember(false)]` and `{ get; } = []`. Never replace the collection instance; mutate in place (`Add`, `Remove(key)`, `Move(key, index)`, `TryGet(key, out item)`, `Clear`).
- **Collection items**: inherit `RecursiveObservable, IBindableItem`. `Id` must be `[RecursiveMember(false)]` and init-only (`public string Id { get; init; }`). Never change an item's `Id`.

## Commands and Arguments

- Mark methods with `[UICommand]` (options: `ConcurrencyMode = UICommandConcurrency.Exclusive | Background`, `MaxConcurrent = n`).
- Allowed return types: `void`, `Task`, `UICommandResult`, `Task<UICommandResult>`.
- Return effects via `UICommandResult.Ok(new ShowNotificationEffect(...))` or `UICommandResult.Fail("error", ...)`.
- **Passing arguments from the view**:
  - Literal: `UIAction.Arg("literal")` (or `.OnClickLiteral(nameof(Controller.Run), "literal")`).
  - Current row key / item: `UIAction.ArgCurrentItemKey()`, `UIAction.ArgCurrentItem()`, or shorthand `.OnClickWithItemKey(nameof(Controller.Delete))`.
  - Bound value from scope: `UIAction.ArgRoot<OrdersController>(c => c.Filter)`, `UIAction.ArgRelative<OrderItem>(x => x.Status)`, `UIAction.ArgParent<OrderGroup>(g => g.Id)`.
  - Event payload: `UIAction.ArgEventValue("value")`.
- **Compile-time verification**: the view compiler rejects paths that do not exist on the target type, row arguments used outside an item template, or missing required value-type parameters.

## Lifecycle Hooks & Runtime Access

- Hooks: `OnInitializeAsync`, `OnNavigatedAsync(UINavigationRequest)`, `OnAttachedAsync`, `OnDetachedAsync`, `OnVisibilityChangedAsync`, `OnLanguageChangedAsync`, `OnThemeChangedAsync`, `OnNotificationPermissionChangedAsync`, `OnLeaveRequestedAsync` (with `HoldsUnsavedWork`), `OnNotify(RecursiveChange)`.
- `Context.Runtime`:
  - `InvokeAsync(Func<Task>)`: acquire the runtime lock from an external callback and flush changes (throws if called inside a running command).
  - `Post(Func<ValueTask>)`: queue work between exclusive commands.
  - `Start(Func<CancellationToken, Task>)`: start a background task owned by the runtime.
- Cross-session pub/sub: `Context.Subscribe("topic")` + `IUIBroadcast.PostAsync("topic", payload)` / `PostToUserAsync(userId, payload)`.

## Binding Modes and Scopes

- Prefer typed lambdas: `.BindValue<OrdersController>(c => c.Filter)` or inside a row `.BindTitle<OrderItem>(x => x.Name, scope: UIBindingScope.Relative)`.
- Scopes:
  - `UIBindingScope.Root` (default for almost all properties).
  - `UIBindingScope.Relative` (required inside item templates for row properties, except item capability bindings like `CanSelect`/`CanDrag`/`CanRemove`/`CanRename`/`Expanded` which default to `Relative`).
  - `UIBindingScope.Parent` (steps out one `BindContext` or item template level).
- Modes: `OneWay`, `TwoWay` (default for input `Value`), `OneWayToSource`, `OnSubmit` (buffered in browser until form submit).

## Validation and Forms

- Input validation rules (evaluated in browser and enforced on server):
  - `.Required(message?)`, `.Regex(pattern, message?)`, `.RegexEach(pattern, message?)`
  - `.Validate(trigger, UIComparisonOperator, value, message, severity)`
  - `.ValidateAgainst(otherInputOrId, UIComparisonOperator.Equal, message)` (cross-field validation, e.g. password confirmation)
  - `.ValidationInto(targetComponentOrId)` routes validation display to another component.
  - `.BindValidation(c => c.FieldValidation)` pushes server-side `UIValidationMessage` state.
- **Forms**:
  - Give inputs `.SetFormId("edit")` (or use `UIDialogs.Form("edit", ...)` which sets the form ID automatically).
  - Submit with `ButtonComponent.OnSubmit("edit", nameof(Controller.Save))` or `OnSubmitShowingLoading("edit", nameof(Controller.Save))`.
  - Discard buffered `OnSubmit` edits with `new DiscardFormEffect("edit")`.
  - Every `formId` referenced by inputs must have a submitting button or event in the view, or compilation fails.
