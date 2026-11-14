using System;
using System.Collections.Generic;
using System.Linq;

namespace DemoApp.Controllers.Base;

/// <summary>
/// Row or node selection options: the mode, the chosen key or keys, and how a chosen row looks.
/// </summary>
internal sealed partial class SelectionGroupContext : DemoGroupContext
{
    private readonly string[] _keySteps;
    private readonly string[][] _keysSteps;

    [RecursiveMember]
    public partial UISelectionMode? SelectionMode { get; set; }

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? SelectedKeys { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    public SelectionGroupContext(string[] keySteps, string[][] keysSteps, UISelectionMode? selectionMode = null, string? selectedKey = null)
    {
        _keySteps = keySteps;
        _keysSteps = keysSteps;
        SelectionMode = selectionMode;
        SelectedKey = selectedKey;

        AddOption(nameof(SelectionMode), CycleSelectionMode, () => SelectionMode);
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectedKeys), CycleSelectedKeys, () => SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
    }

    // The mode picks which of the two key rows the host reads; the other shows a value nothing looks at. A tree's arrows choose a
    // row only with One.
    public void CycleSelectionMode()
        => SetLastChange(nameof(SelectionMode), SelectionMode = CycleEnum(SelectionMode));

    public void CycleSelectedKey()
    {
        SelectedKey = CycleValue(SelectedKey, [null, .. _keySteps]);

        if (SelectedKey is not null && SelectionMode != UISelectionMode.One)
            SelectionMode = UISelectionMode.One;

        SetLastChange(nameof(SelectedKey), SelectedKey);
    }

    public void CycleSelectedKeys()
    {
        SelectedKeys = NextSelectedKeys(SelectedKeys);

        if (SelectedKeys is not null && SelectionMode != UISelectionMode.Many)
            SelectionMode = UISelectionMode.Many;

        SetLastChange(nameof(SelectedKeys), SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
    }

    // By what a step holds, not by reference: a list is a new one on every write, the view's own as the viewer chooses included.
    private string[]? NextSelectedKeys(IReadOnlyList<string>? current)
    {
        if (current is null)
            return _keysSteps[0];

        var index = Array.FindIndex(_keysSteps, step => step.SequenceEqual(current));

        return index < 0 ? _keysSteps[0] : index + 1 < _keysSteps.Length ? _keysSteps[index + 1] : null;
    }

    // A mark on the left, a solid ground, and a ground with its own ink: the three shapes the object has.
    public void CycleSelectionStyle()
    {
        SelectionStyle = CycleValue(SelectionStyle, null, UISelectionStyle.Marked(UISelectionMark.Left), UISelectionStyle.Ground(UIThemeColor.Accent), new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null));

        if (SelectionStyle is not null)
        {
            if (SelectionMode is null or UISelectionMode.None)
                SelectionMode = UISelectionMode.One;

            if (SelectionMode == UISelectionMode.One && SelectedKey is null && _keySteps.Length > 0)
                SelectedKey = _keySteps[0];
            else if (SelectionMode == UISelectionMode.Many && (SelectedKeys is null || SelectedKeys.Count == 0) && _keysSteps.Length > 0)
                SelectedKeys = _keysSteps[0];
        }

        SetLastChange(nameof(SelectionStyle), SelectionStyle);
    }
}

/// <summary>
/// Row drag-reordering options: whether rows move by dragging, whether only a grip drags them, and which side the grip stands on.
/// </summary>
internal sealed partial class ReorderGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Draggable { get; set; }

    [RecursiveMember]
    public partial bool DragHandle { get; set; }

    [RecursiveMember]
    public partial UIDragHandlePlacement? DragHandlePlacement { get; set; }

    public ReorderGroupContext()
    {
        AddOption(nameof(Draggable), ToggleDraggable, () => Draggable);
        AddOption(nameof(DragHandle), ToggleDragHandle, () => DragHandle);
        AddOption(nameof(DragHandlePlacement), CycleDragHandlePlacement, () => DragHandlePlacement);
    }

    // The drop asks; the group holding the rows moves the row in its answer (MoveByKey).
    public void ToggleDraggable()
        => SetLastChange(nameof(Draggable), Draggable = !Draggable);

    // Read with Draggable: turning the grip on turns dragging on with it.
    public void ToggleDragHandle()
    {
        DragHandle = !DragHandle;

        if (DragHandle)
            Draggable = true;

        SetLastChange(nameof(DragHandle), DragHandle);
    }

    // Where the grip stands, End unset; setting a placement brings DragHandle and Draggable on with it.
    public void CycleDragHandlePlacement()
    {
        DragHandlePlacement = CycleEnum(DragHandlePlacement);

        if (DragHandlePlacement is not null)
        {
            Draggable = true;
            DragHandle = true;
        }

        SetLastChange(nameof(DragHandlePlacement), DragHandlePlacement);
    }
}
