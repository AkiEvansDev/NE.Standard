using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;

namespace DemoApp.Controllers.Choices.MultiSelect;

/// <summary>
/// The multi-select's own surface: the select's field, with a chip per chosen option inside it.
/// </summary>
internal sealed partial class MultiSelectFieldGroupContext : OptionsFieldGroupContext
{
    public MultiSelectFieldGroupContext() : base("Pick regions", DemoIcons.Navigation, DemoIcons.Filter)
    {
        AddAppearanceOption();
        AddSizeOption();
        AddPlaceholderOption();
        AddAffixIconOptions();
        AddAdornmentOptions();
    }
}

/// <summary>
/// What the preview is drawn as, and the layout the checkboxes alone read.
/// </summary>
/// <remarks>
/// <c>Variant</c> is decided at render, so the row shows one of three previews bound to the same rows rather than rebinding one.
/// </remarks>
internal sealed partial class MultiSelectVariantGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIMultiSelectVariant Variant { get; set; }

    [RecursiveMember]
    public partial UIButtonVariant? ButtonVariant { get; set; }

    [RecursiveMember]
    public partial UIVisibility ChipsVisibility { get; set; }

    [RecursiveMember]
    public partial UIVisibility BadgesVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIVisibility CheckboxesVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIVisibility ButtonVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; } = UIOrientation.Vertical;

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    public MultiSelectVariantGroupContext()
    {
        AddOption(nameof(Variant), CycleVariant, () => Variant);
        AddOption(nameof(ButtonVariant), CycleButtonVariant, () => ButtonVariant);
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
    }

    public void CycleVariant()
    {
        SetVariant(CycleEnum(Variant));
        SetLastChange(nameof(Variant), Variant);
    }

    public void CycleButtonVariant()
    {
        ButtonVariant = CycleEnum(ButtonVariant);

        if (ButtonVariant is not null && Variant != UIMultiSelectVariant.Button)
            SetVariant(UIMultiSelectVariant.Button);

        SetLastChange(nameof(ButtonVariant), ButtonVariant);
    }

    private void SetVariant(UIMultiSelectVariant variant)
    {
        Variant = variant;
        ChipsVisibility = Shown(UIMultiSelectVariant.Chips);
        BadgesVisibility = Shown(UIMultiSelectVariant.Badges);
        CheckboxesVisibility = Shown(UIMultiSelectVariant.Checkboxes);
        ButtonVisibility = Shown(UIMultiSelectVariant.Button);
    }

    private UIVisibility Shown(UIMultiSelectVariant variant)
        => Variant == variant ? UIVisibility.Visible : UIVisibility.Collapsed;

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    // Unset is the stylesheet's own gap for the orientation; the rest are what an author would write.
    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 24d));
}

/// <summary>
/// The regions on offer, each carrying its code as a badge: the badges variant chooses the badge, the chips and the checkboxes show it
/// beside the name. A row redraws every badge with the next fill.
/// </summary>
/// <remarks>A chosen option's badge chip is a copy of its row's badge, so the fill row redraws the chips as well as the list.</remarks>
internal sealed partial class MultiSelectOptionsGroupContext : OptionListGroupContext
{
    private static readonly UIBadgeFill?[] FillSteps = [UIBadgeFill.Tinted, UIBadgeFill.Filled, UIBadgeFill.Outline, null];

    public MultiSelectOptionsGroupContext()
    {
        foreach (OptionItem option in Options)
        {
            option.BadgeTitle = option.Id;
            option.BadgeVariant = UIBadgeVariant.Info;
            option.BadgeFill = UIBadgeFill.Tinted;
        }

        AddOption("Fill", CycleFill, () => Options.Count > 0 ? Options[0].BadgeFill : null);
    }

    public void CycleFill()
    {
        if (Options.Count == 0)
            return;

        UIBadgeFill? fill = FillSteps[(Array.IndexOf(FillSteps, Options[0].BadgeFill) + 1) % FillSteps.Length];

        foreach (OptionItem option in Options)
            option.BadgeFill = fill;
    }
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class MultiSelectController() : DemoStandardController
{
    [RecursiveMember]
    public partial MultiSelectVariantGroupContext VariantGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionKeysValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial MultiSelectFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial MultiSelectOptionsGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Regions");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
