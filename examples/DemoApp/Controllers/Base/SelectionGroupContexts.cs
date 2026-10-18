using System;
using System.Collections.Generic;
using System.Linq;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A section whose host chooses rows: the mode, the chosen key or keys, and how a chosen row looks. A page registers the rows
/// where its own order puts them (<see cref="AddSelectionOptions"/>).
/// </summary>
internal abstract partial class SelectionGroupContext(string[] keySteps, string[][] keysSteps) : DemoGroupContext
{
    [RecursiveMember]
    public partial UISelectionMode? SelectionMode { get; set; }

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? SelectedKeys { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    protected void AddSelectionOptions()
    {
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
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, [null, .. keySteps]));

    public void CycleSelectedKeys()
        => SetLastChange(nameof(SelectedKeys), SelectedKeys = NextSelectedKeys(SelectedKeys));

    // By what a step holds, not by reference: a list is a new one on every write, the view's own as the viewer chooses included.
    private string[]? NextSelectedKeys(IReadOnlyList<string>? current)
    {
        if (current is null)
            return keysSteps[0];

        var index = Array.FindIndex(keysSteps, step => step.SequenceEqual(current));

        return index < 0 ? keysSteps[0] : index + 1 < keysSteps.Length ? keysSteps[index + 1] : null;
    }

    // A mark on the left, a solid ground, and a ground with its own ink: the three shapes the object has.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null, UISelectionStyle.Marked(UISelectionMark.Left), UISelectionStyle.Ground(UIThemeColor.Accent), new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null)));
}

/// <summary>
/// A selection section whose host also lets its rows be dragged into another order (<see cref="AddDragOptions"/>).
/// </summary>
internal abstract partial class DraggableSelectionGroupContext(string[] keySteps, string[][] keysSteps) : SelectionGroupContext(keySteps, keysSteps)
{
    [RecursiveMember]
    public partial bool Draggable { get; set; }

    [RecursiveMember]
    public partial bool DragHandle { get; set; }

    [RecursiveMember]
    public partial UIDragHandlePlacement? DragHandlePlacement { get; set; }

    protected void AddDragOptions()
    {
        AddOption(nameof(Draggable), ToggleDraggable, () => Draggable);
        AddOption(nameof(DragHandle), ToggleDragHandle, () => DragHandle);
        AddOption(nameof(DragHandlePlacement), CycleDragHandlePlacement, () => DragHandlePlacement);
    }

    // The drop asks; the group holding the rows moves the row in its answer (MoveByKey).
    public void ToggleDraggable()
        => SetLastChange(nameof(Draggable), Draggable = !Draggable);

    // Read with Draggable: the grip is shown only while both are on.
    public void ToggleDragHandle()
        => SetLastChange(nameof(DragHandle), DragHandle = !DragHandle);

    // Where the grip stands, End unset; read with DragHandle on.
    public void CycleDragHandlePlacement()
        => SetLastChange(nameof(DragHandlePlacement), DragHandlePlacement = CycleEnum(DragHandlePlacement));
}
