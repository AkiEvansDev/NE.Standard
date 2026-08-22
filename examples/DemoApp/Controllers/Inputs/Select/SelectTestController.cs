using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Select;

internal sealed partial class SelectSelectionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; }

    /// <summary>
    /// Reads the controller field rather than an argument: what the command sees is what proves the
    /// hidden value input's <c>change</c> — dispatched by <c>SelectInteractionEngine</c> after it writes
    /// the new key — synced before the command ran. Clearing takes the same path with an empty value.
    /// </summary>
    public void RecordChange()
        => LogEvent($"change -> \"{Value}\"");
}

internal sealed partial class SelectSubmitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Environment { get; set; }

    public void Submit()
        => LogEvent($"submitted -> \"{Environment}\"");
}

internal sealed partial class SelectTestController() : DemoController
{
    [RecursiveMember]
    public partial SelectSelectionGroupContext SelectionGroup { get; set; } = new();

    [RecursiveMember]
    public partial SelectSubmitGroupContext SubmitGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => SelectionGroup.RecordChange();

    [UICommand]
    public void Submit()
        => SubmitGroup.Submit();
}
