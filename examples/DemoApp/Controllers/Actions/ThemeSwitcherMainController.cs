using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One theme switcher, and every property that can be bound to it; the theme itself is the framework's.
/// </summary>
internal sealed partial class ThemeSwitcherMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ThemeSwitcherGroupContext SwitcherGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleSwitcherGroupOption(string id)
        => SwitcherGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderGroupOption(string id)
        => BorderGroup.CycleOption(id);
}
