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
            .BindStandard()
            .BindValue<ColorInputController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<ColorInputController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<ColorInputController>(static x => x.ValueGroup.Size)
            .BindTextFormat<ColorInputController>(static x => x.ValueGroup.TextFormat)
            .BindAppearance<ColorInputController>(static x => x.FieldGroup.Appearance)
            .BindShowPalette<ColorInputController>(static x => x.FieldGroup.ShowPalette)
            .BindShowOpacity<ColorInputController>(static x => x.FieldGroup.ShowOpacity)
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorderColor<ColorInputController>(static x => x.BorderGroup.BorderColor)
            .BindBorderThickness<ColorInputController>(static x => x.BorderGroup.BorderThickness)
            .BindBorderRadius<ColorInputController>(static x => x.BorderGroup.BorderRadius);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateBrandingGroup()], [CreateSurfacesGroup()]), CreateFormatGroup()];

    /// <summary>
    /// A handful of colours making up a theme, each labelled with what it paints rather than with what it is — a branding form, its
    /// fields outlined.
    /// </summary>
    private static ContainerComponent CreateBrandingGroup()
    {
        return DemoUI.CreateExample("Theme & series color fields",
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
                    .SetBadgeTitle("also used by the legend")
                    .SetBadgeVariant(UIBadgeVariant.Info)
                )
                .AddChild(UIText.Label("The chart's other series")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ColorInputComponent()
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.StellarRed))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.SolarGold))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                    )
                )
        );
    }

    /// <summary>
    /// The free picker is always present; <c>ShowPalette</c> adds the palette tab and segmented switcher, and <c>ShowOpacity</c> adds the alpha slider.
    /// </summary>
    private static ContainerComponent CreateSurfacesGroup()
    {
        return DemoUI.CreateExample("Palette tab & opacity slider",
            UILayout.Stack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker and palette — free colour or a named step")
                    .SetShowPalette(true)
                    .SetShowOpacity(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker only — opens directly without tabs")
                    .SetShowPalette(false)
                    .SetShowOpacity(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker only, with opacity")
                    .SetShowPalette(false)
                    .SetShowOpacity(true)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen, opacity: 128))
                )
        );
    }

    /// <summary>
    /// The text the field writes back is read by something downstream, so the reader is what chooses the format.
    /// </summary>
    /// <remarks>Written out rather than walked over the enum: the point is which reader wants which, not that there are two.</remarks>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("Color string formats",
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
