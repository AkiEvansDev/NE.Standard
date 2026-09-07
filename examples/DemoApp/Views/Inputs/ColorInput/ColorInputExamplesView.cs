using System;
using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.ColorInput;

/// <summary>
/// A colour is picked off a palette, off a wheel or typed, and the control's properties say which it offers.
/// </summary>
internal sealed class ColorInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.color-input.examples";

    protected override string ComponentRoute => "/inputs/color-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.color-input.header";
    protected override string HeaderDescription => "demo.inputs.color-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBrandingGroup(), CreateSurfacesGroup(), CreateStateGroup()],
            [CreateVariantGroup(), CreateFormatGroup()]
        ));
    }

    /// <summary>
    /// A handful of colours making up a theme, each labelled with what it paints rather than with what it is.
    /// </summary>
    private static ContainerComponent CreateBrandingGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Brand")
                    .SetIcon(DemoIcons.Palette)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AstralTeal))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Accent")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Chart series 1")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.QuantumBlue))
                    .SetBadgeText("also used by the legend")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// <c>Variant</c> is how the control looks closed: a field for a form, a swatch for a dense row of colours.
    /// </summary>
    private static ContainerComponent CreateVariantGroup()
    {
        return DemoUI.CreateGroup(null, "Variant",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateStack(16);

                foreach (UIColorInputVariant variant in Enum.GetValues<UIColorInputVariant>())
                {
                    _ = stack.AddChild(new ColorInputComponent()
                        .SetTitle(variant.ToString())
                        .SetVariant(variant)
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.StellarRed))
                    );
                }

                _ = content.AddChild(stack);
            },
            contentMinHeight: 260
        );
    }

    /// <summary>
    /// The three ways of choosing, switched on one at a time; all off leaves the text box.
    /// </summary>
    private static ContainerComponent CreateSurfacesGroup()
    {
        return DemoUI.CreateGroup(null, "What it offers",
            content => content.AddChild(DemoUI.CreateStack(16)
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
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// <c>TextFormat</c> decides how the colour is written down, and how opacity is written with it.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "How it is written down",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateStack(16);

                foreach (UIColorTextFormat format in Enum.GetValues<UIColorTextFormat>())
                {
                    _ = stack
                        .AddChild(new ColorInputComponent()
                            .SetTitle($"{format}, opaque")
                            .SetTextFormat(format)
                            .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold))
                        )
                        .AddChild(new ColorInputComponent()
                            .SetTitle($"{format}, with an alpha")
                            .SetTextFormat(format)
                            .SetShowOpacity(true)
                            .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold, opacity: 153))
                        );
                }

                _ = content.AddChild(stack);
            },
            contentMinHeight: 340
        );
    }

    /// <summary>The field's own surface, and the states.</summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance and states",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                    .SetIsReadOnly(true)
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                    .SetEnabled(false)
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Nothing chosen yet")
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The colour a person picks has nothing to do with **which theme is live**, so the text written across a swatch is judged against *the swatch itself* — see `UIColorContrast`.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 380
        );
    }
}
