using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.TextArea;

/// <summary>
/// The multi-line field's own surface: its starting height, whether it may be resized, and its empty hint.
/// </summary>
internal sealed partial class TextAreaFieldGroupContext : FieldChromeGroupContext
{
    [RecursiveMember]
    public partial int? Rows { get; set; } = 3;

    [RecursiveMember]
    public partial UITextAreaResizeMode? Resize { get; set; } = UITextAreaResizeMode.Vertical;

    public TextAreaFieldGroupContext() : base("What changed, and why")
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddOption(nameof(Rows), CycleRows, () => Rows);
        AddOption(nameof(Resize), CycleResize, () => Resize);
    }

    public void CycleRows()
        => SetLastChange(nameof(Rows), Rows = CycleValue(Rows, 3, 6, 1, null));

    public void CycleResize()
        => SetLastChange(nameof(Resize), Resize = CycleEnum(Resize));
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class TextAreaMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextAreaValueGroupContext ValueGroup { get; set; } = new("Rolls the new checkout flow out behind a flag.", "Reverts the timeout change from 2.3.");

    [RecursiveMember]
    public partial TextAreaFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Release notes");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

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
