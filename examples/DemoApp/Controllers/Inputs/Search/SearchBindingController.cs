using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.Search;

internal sealed partial class SearchValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "api";

    [RecursiveMember]
    public partial string? SearchText { get; set; }

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    // Ends on null deliberately: clearing back to no selection is its own case, and it used to be
    // unreachable because Search rendered no clear affordance at all.
    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, "api", "web", "worker", null));

    public void CycleSearchText()
        => SetLastChange(nameof(SearchText), SearchText = CycleValue(SearchText, null, "nova", "web"));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

internal sealed partial class SearchBehaviorGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISearchSelectionDisplayMode SelectionDisplayMode { get; set; } = UISearchSelectionDisplayMode.KeepSearchInput;

    [RecursiveMember]
    public partial bool AutoSearch { get; set; } = true;

    [RecursiveMember]
    public partial int MinSearchLength { get; set; }

    [RecursiveMember]
    public partial int DebounceMilliseconds { get; set; }

    public void CycleSelectionDisplayMode()
        => SetLastChange(nameof(SelectionDisplayMode), SelectionDisplayMode = CycleEnum(SelectionDisplayMode));

    public void ToggleAutoSearch()
        => SetLastChange(nameof(AutoSearch), AutoSearch = !AutoSearch);

    public void CycleMinSearchLength()
        => SetLastChange(nameof(MinSearchLength), MinSearchLength = CycleValue(MinSearchLength, 0, 2, 4));

    public void CycleDebounceMilliseconds()
        => SetLastChange(nameof(DebounceMilliseconds), DebounceMilliseconds = CycleValue(DebounceMilliseconds, 0, 200, 800));
}

internal sealed partial class SearchPopupGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Placeholder { get; set; } = "Search services…";

    public void CyclePlaceholder()
        => SetLastChange(nameof(Placeholder), Placeholder = CycleValue(Placeholder, "Search services…", "Type a service name…", null));
}

internal sealed partial class SearchBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial SearchValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SearchBehaviorGroupContext BehaviorGroup { get; set; } = new();

    [RecursiveMember]
    public partial SearchPopupGroupContext PopupGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionsCollectionGroupContext OptionsGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void CycleSearchText()
        => ValueGroup.CycleSearchText();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CycleSelectionDisplayMode()
        => BehaviorGroup.CycleSelectionDisplayMode();

    [UICommand]
    public void ToggleAutoSearch()
        => BehaviorGroup.ToggleAutoSearch();

    [UICommand]
    public void CycleMinSearchLength()
        => BehaviorGroup.CycleMinSearchLength();

    [UICommand]
    public void CycleDebounceMilliseconds()
        => BehaviorGroup.CycleDebounceMilliseconds();

    [UICommand]
    public void CyclePlaceholder()
        => PopupGroup.CyclePlaceholder();

    [UICommand]
    public void AddOption()
        => OptionsGroup.AddOption();

    [UICommand]
    public void RemoveOption()
        => OptionsGroup.RemoveOption();

    [UICommand]
    public void RenameSelected()
        => OptionsGroup.RenameSelected();

    [UICommand]
    public void SelectFirst()
        => OptionsGroup.SelectFirst();
}
