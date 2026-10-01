using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Icon;

/// <summary>
/// One glyph, and every property that can be bound to it.
/// </summary>
internal sealed partial class IconController() : DemoStandardController
{
    [RecursiveMember]
    public partial IconGroupContext IconGroup { get; set; } = new();

    [UICommand]
    public void CycleIconOption(string id)
        => IconGroup.CycleOption(id);
}
