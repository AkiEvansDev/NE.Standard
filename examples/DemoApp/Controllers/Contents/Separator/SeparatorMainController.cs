using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Contents.Separator;

/// <summary>
/// One rule, and every property that can be bound to it.
/// </summary>
internal sealed partial class SeparatorMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial SeparatorGroupContext SeparatorGroup { get; set; } = new();

    [UICommand]
    public void CycleSeparatorGroupOption(string id)
        => SeparatorGroup.CycleOption(id);
}
