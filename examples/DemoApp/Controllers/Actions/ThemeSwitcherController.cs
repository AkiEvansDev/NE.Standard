using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One theme switcher in both its shapes, and every property that can be bound to each; the theme itself is the framework's.
/// </summary>
internal sealed partial class ThemeSwitcherController() : DemoStandardController
{
    [RecursiveMember]
    public partial ThemeSwitcherGroupContext SwitcherGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial ThemeFieldGroupContext FieldGroup { get; set; } = new();

    [UICommand]
    public void CycleSwitcherGroupOption(string id)
        => SwitcherGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldGroupOption(string id)
        => FieldGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderGroupOption(string id)
        => BorderGroup.CycleOption(id);
}
