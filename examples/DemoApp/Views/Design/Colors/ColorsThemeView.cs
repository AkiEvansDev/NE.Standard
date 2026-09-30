using System.Collections.Generic;
using DemoApp.Controllers.Design.Colors;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// The theme as a reader holds it: their own primary and accent over the application's palette, a background bound off, and what the
/// controller hears when the theme or the language moves.
/// </summary>
internal sealed class ColorsThemeView : ColorsViewBase, IUIViewDefinition
{
    private const string ColorsGroup = nameof(ColorsThemeController.ColorsGroup);
    private const string BackgroundGroup = nameof(ColorsThemeController.BackgroundGroup);
    private const string HeardGroup = nameof(ColorsThemeController.HeardGroup);

    public static string ViewKey => "demo.design.colors.theme";

    protected override string CurrentTabUrl => "/design/colors/theme";

    protected override void DrawColorsContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateColorsGroup()], [CreateBackgroundGroup(), CreateHeardGroup()]));

    /// <summary>
    /// The reader picks a primary and an accent; Apply makes them the session's, Reset returns to the application's palette.
    /// </summary>
    private static ContainerComponent CreateColorsGroup()
    {
        return DemoUI.CreateGroup(ColorsGroup, "Your own colours",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Primary")
                    .BindValue(nameof(ReaderColorsGroupContext.Primary), UIBindingScope.Relative)
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Accent")
                    .BindValue(nameof(ReaderColorsGroupContext.Accent), UIBindingScope.Relative)
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("Apply")
                        .OnClick(nameof(ColorsThemeController.ApplyColors))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Reset")
                        .OnClick(nameof(ColorsThemeController.ResetColors))
                    )
                )
                .AddChild(UIText.Label("What wears them"))
                .AddChild(UILayout.Row(12)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("A primary button")
                    )
                    .AddChild(new SwitchComponent()
                        .SetTitle("A switch")
                        .SetValue(true)
                    )
                    .AddChild(new BadgeComponent()
                        .SetText("accent")
                        .SetType(UIBadgeType.Accent)
                    )
                )
            ),
            note: "Pick a pale yellow for the primary and Apply: the button's text still reads, since what stands on the colour is derived by the palette's own rule and held to contrast. "
                + "The colours are the session's: open another page, or reload, and they are there; Reset returns to the application's palette."
        );
    }

    /// <summary>
    /// One row whose background is bound: transparent, the brand's colour, and none — the component's own default.
    /// </summary>
    private static ContainerComponent CreateBackgroundGroup()
    {
        return DemoUI.CreateGroup(BackgroundGroup, "A background bound off and on",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ContainerComponent()
                    .SetPadding(UIThickness.All(12, 8, 12, 8))
                    .SetBorderRadius(UICornerRadius.Uniform(12))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .BindBackground(nameof(BackgroundGroupContext.Background), UIBindingScope.Relative)
                    .AddChild(new TextComponent()
                        .SetTitle("See you at eight 🎉")
                    )
                )
            ),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Next background"] = nameof(ColorsThemeController.CycleBackground)
            }),
            note: "A chat message as a bubble or bare, one block for both: `UIThemeColor.Transparent` switches the fill off and the text takes the page's ink; `Primary` fills it and the text takes the colour's own ink; `null` removes the binding's colour, back to the default."
        );
    }

    /// <summary>
    /// The line the controller writes on hearing a switch, in the session's language, composed by the controller rather than the page.
    /// </summary>
    private static ContainerComponent CreateHeardGroup()
    {
        return DemoUI.CreateGroup(HeardGroup, "What the controller heard",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(HeardGroupContext.Heard), UIBindingScope.Relative)
                )
            ),
            note: "Switch the theme or the language in the header: `OnThemeChangedAsync` and `OnLanguageChangedAsync` write this line, through the translator, in the session's language. "
                + "Switch the language on another page and come back: the page kept its runtime, and the line is already in the new language before it paints."
        );
    }
}
