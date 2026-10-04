using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.ColorInput;
using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Inputs.ColorInput;

/// <summary>
/// One colour input and every property that can be bound to it; then a colour picked off a palette, off a wheel or typed, and the
/// control's properties saying which it offers.
/// </summary>
internal sealed class ColorInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(ColorInputController.ValueGroup);
    private const string FieldGroup = nameof(ColorInputController.FieldGroup);
    private const string ContentGroup = nameof(ColorInputController.ContentGroup);
    private const string BadgeGroup = nameof(ColorInputController.BadgeGroup);
    private const string BorderGroup = nameof(ColorInputController.BorderGroup);

    public static string ViewKey => "demo.inputs.color-input";

    protected override string ComponentRoute => "/inputs/color-input";
    protected override string Header => "demo.inputs.color-input.header";
    protected override string HeaderDescription => "demo.inputs.color-input.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new ColorInputComponent()).SetPlacement(1, 1, 24, 1)));

    private static ColorInputComponent Bind(ColorInputComponent input)
        => input
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(ColorValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(ColorValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(ColorValueGroupContext.Size)}")
            .BindTextFormat($"{ValueGroup}.{nameof(ColorValueGroupContext.TextFormat)}")
            .BindAppearance($"{FieldGroup}.{nameof(ColorFieldGroupContext.Appearance)}")
            .BindVariant($"{FieldGroup}.{nameof(ColorFieldGroupContext.Variant)}")
            .BindShowPicker($"{FieldGroup}.{nameof(ColorFieldGroupContext.ShowPicker)}")
            .BindShowPalette($"{FieldGroup}.{nameof(ColorFieldGroupContext.ShowPalette)}")
            .BindShowOpacity($"{FieldGroup}.{nameof(ColorFieldGroupContext.ShowOpacity)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(ColorInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(ColorInputController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(ColorInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(ColorInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ColorInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateBrandingGroup()], [CreateSurfacesGroup()]), CreateFormatGroup()];

    /// <summary>
    /// A handful of colours making up a theme, each labelled with what it paints rather than with what it is — a branding form, its
    /// fields outlined.
    /// </summary>
    /// <remarks>Both variants, because they are the two halves of one job: a field where the value is edited, swatches where it is chosen.</remarks>
    private static ContainerComponent CreateBrandingGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new ColorInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Brand")
                    .SetIcon(DemoIcons.Palette)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AstralTeal))
                )
                .AddChild(new ColorInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Accent")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                )
                .AddChild(new ColorInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Chart series 1")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.QuantumBlue))
                    .SetBadgeText("also used by the legend")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(UIText.Label("The chart's other series, as swatches")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(110))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.StellarRed))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(110))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(110))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(110))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                    )
                )
                .AddChild(UIText.Note("The colour a person picks has nothing to do with **which theme is live**, so the text written across a swatch is judged against *the swatch itself* — see `UIColorContrast`."))
        );
    }

    /// <summary>
    /// The three ways of choosing, switched on one at a time; all off leaves the text box.
    /// </summary>
    private static ContainerComponent CreateSurfacesGroup()
    {
        return DemoUI.CreateExample("What it offers",
            UILayout.Stack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Palette only — a fixed set to choose from")
                    .SetShowPalette(true)
                    .SetShowPicker(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker only — anywhere in the wheel")
                    .SetShowPalette(false)
                    .SetShowPicker(true)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker, with opacity")
                    .SetShowPalette(false)
                    .SetShowPicker(true)
                    .SetShowOpacity(true)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen, opacity: 128))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Neither — typed, and nothing else")
                    .SetShowPalette(false)
                    .SetShowPicker(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
        );
    }

    /// <summary>
    /// The text the field writes back is read by something downstream, so the reader is what chooses the format.
    /// </summary>
    /// <remarks>Written out rather than walked over the enum: the point is which reader wants which, not that there are two.</remarks>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("How it is written down",
            // Two to a row, each format beside its own translucent form: four at 260 left the fourth alone on a row.
            UILayout.Row(24)
                .AddChild(DemoUI.CreateLabelled("Hex — a stylesheet, a token file", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Hex)
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Hex, once it is not opaque", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Hex)
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold, opacity: 153))
                    .SetShowOpacity(true)
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Rgb — anything that parses channels", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Rgb)
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Rgb, once it is not opaque", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Rgb)
                    .SetWidth(UILayoutLength.Absolute(460))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold, opacity: 153))
                    .SetShowOpacity(true)
                    )
                ),
            columns: 24,
            note: "Opacity is not a format of its own: each of the two grows a fourth channel as soon as the colour stops being opaque."
        );
    }
}
