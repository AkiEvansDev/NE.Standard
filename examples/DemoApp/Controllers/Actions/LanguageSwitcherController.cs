using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// The language switcher drawn as a button: the glyph before the language, and the button it is drawn in.
/// </summary>
/// <remarks>
/// Whether the button shows the language's code or its name, and which languages it offers, are decided once at render, so they are no
/// rows: the preview draws both answers.
/// </remarks>
internal sealed partial class LanguageSwitcherGroupContext : SwitcherButtonGroupContext
{
    private const string SampleTooltip = "Switch the language";

    [RecursiveMember]
    public partial string? Icon { get; set; }

    public LanguageSwitcherGroupContext()
    {
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddButtonOptions(SampleTooltip);
    }

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.Region));
}

/// <summary>
/// One language switcher in both its shapes, and every property that can be bound to each; the language itself is the session's.
/// </summary>
internal sealed partial class LanguageSwitcherController() : DemoStandardController
{
    [RecursiveMember]
    public partial LanguageSwitcherGroupContext SwitcherGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial SwitcherFieldGroupContext FieldGroup { get; set; } = new();

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
