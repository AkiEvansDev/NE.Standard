using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Toggle;

/// <summary>
/// The controller both toggle pages run on; a checkbox and a switch are the same component drawn differently.
/// </summary>
/// <remarks>The label sample is passed in, being the one thing the two pages do not share.</remarks>
internal abstract partial class ToggleMainController(string sampleTitle, string sampleDescription) : DemoStandardController
{
    [RecursiveMember]
    public partial ToggleValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new(sampleTitle, sampleDescription);

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}

internal sealed partial class CheckboxMainController() : ToggleMainController("Require review before deploy", "Every merge waits for a second pair of eyes.");

internal sealed partial class SwitchMainController() : ToggleMainController("Ship on merge", "A green build goes straight to production.");
