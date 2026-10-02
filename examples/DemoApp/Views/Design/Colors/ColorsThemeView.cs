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
        return DemoUI.CreateGroup(ColorsGroup, "demo.colors.theme.own.title",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("demo.colors.theme.own.primary")
                    .BindValue(nameof(ReaderColorsGroupContext.Primary), UIBindingScope.Relative)
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("demo.colors.theme.own.accent")
                    .BindValue(nameof(ReaderColorsGroupContext.Accent), UIBindingScope.Relative)
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("demo.colors.theme.own.apply")
                        .OnClick(nameof(ColorsThemeController.ApplyColors))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("demo.colors.theme.own.reset")
                        .OnClick(nameof(ColorsThemeController.ResetColors))
                    )
                )
                .AddChild(UIText.Label("demo.colors.theme.own.wears"))
                .AddChild(UILayout.Row(12)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("demo.colors.theme.own.button")
                    )
                    .AddChild(new SwitchComponent()
                        .SetTitle("demo.colors.theme.own.switch")
                        .SetValue(true)
                    )
                    .AddChild(new BadgeComponent()
                        .SetText("demo.colors.theme.own.badge")
                        .SetType(UIBadgeType.Accent)
                    )
                )
            ),
            note: "demo.colors.theme.own.note",
            words: true
        );
    }

    /// <summary>
    /// One row whose background is bound: transparent, the brand's colour, and none — the component's own default.
    /// </summary>
    private static ContainerComponent CreateBackgroundGroup()
    {
        return DemoUI.CreateGroup(BackgroundGroup, "demo.colors.theme.background.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ContainerComponent()
                    .SetPadding(UIThickness.All(12, 8, 12, 8))
                    .SetBorderRadius(UICornerRadius.Uniform(12))
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .BindBackground(nameof(BackgroundGroupContext.Background), UIBindingScope.Relative)
                    .AddChild(new TextComponent()
                        .SetTitle("demo.colors.theme.background.message")
                    )
                )
            ),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["demo.colors.theme.background.next"] = nameof(ColorsThemeController.CycleBackground)
            }),
            note: "demo.colors.theme.background.note",
            words: true
        );
    }

    /// <summary>
    /// The line the controller writes on hearing a switch, in the session's language, composed by the controller rather than the page.
    /// </summary>
    private static ContainerComponent CreateHeardGroup()
    {
        return DemoUI.CreateGroup(HeardGroup, "demo.colors.theme.heard.title",
            content => content.AddChild(DemoUI.CreateStack(12)
                .AddChild(new ParagraphComponent()
                    .BindDescription(nameof(HeardGroupContext.Heard), UIBindingScope.Relative)
                )
            ),
            note: "demo.colors.theme.heard.note",
            words: true
        );
    }
}
