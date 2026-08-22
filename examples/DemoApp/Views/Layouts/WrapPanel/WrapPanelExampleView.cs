using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.WrapPanel;

internal sealed class WrapPanelExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.wrap-panel.example";

    protected override string ComponentRoute => "/layouts/wrap-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.layouts.wrap-panel.header";
    protected override string HeaderDescription => "demo.layouts.wrap-panel.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateTeamGridGroup())
            .AddChild(CreateFileTilesGroup());
    }

    private static ContainerComponent CreateTeamGridGroup()
    {
        return DemoUI.CreateGroup(null, "Team grid (column spans)",
            content => content.AddChild(new WrapPanelComponent()
                .SetHorizontalGap(12)
                .SetVerticalGap(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateMemberCard("Aki Evans", "Lead · Framework", "AE", ColorName.NovaPurple).SetPlacement(1, 1, 24, 1))
                .AddChild(CreateMemberCard("Robin Hale", "Client runtime", "RH", ColorName.AstralTeal).SetPlacement(1, 1, 12, 1))
                .AddChild(CreateMemberCard("Sam Iyer", "Design system", "SI", ColorName.SolarAmber).SetPlacement(1, 1, 12, 1))
                .AddChild(CreateMemberCard("Noa Lindt", "Docs & samples", "NL", ColorName.QuantumBlue).SetPlacement(1, 1, 12, 1))
                .AddChild(CreateMemberCard("Kai Moreau", "QA", "KM", ColorName.NebulaRose).SetPlacement(1, 1, 12, 1))
            ),
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static ContainerComponent CreateMemberCard(string name, string role, string initials, ColorName avatarColor)
    {
        return new ContainerComponent()
            .SetPadding(UIThickness.Uniform(12))
            .SetBackground(UIThemeColor.Surface)
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(8))
            .AddRow(UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetSpacing(10)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateAvatar(initials, avatarColor))
                .AddChild(new TextComponent()
                    .SetTitle(name)
                    .SetTitleType(UITextAppearance.Body)
                    .SetDescription(role)
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            );
    }

    private static ContainerComponent CreateAvatar(string initials, ColorName color)
        => new ContainerComponent()
            .SetBackground(UIThemeColor.FromColorVariant(color))
            .SetBorderRadius(UICornerRadius.Uniform(999))
            .SetWidth(UILayoutLength.Absolute(36))
            .SetHeight(UILayoutLength.Absolute(36))
            .AddChild(new TextComponent()
                .SetTitle(initials)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromColorVariant(color, ColorAdjustment.Tint, 9))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1)
            );

    private static ContainerComponent CreateFileTilesGroup()
    {
        return DemoUI.CreateGroup(null, "File tiles (uniform, gap-driven)",
            content =>
            {
                WrapPanelComponent tiles = new WrapPanelComponent()
                    .SetWidth(UILayoutLength.Absolute(360))
                    .SetHorizontalGap(8)
                    .SetVerticalGap(8)
                    .SetPlacement(1, 1, 24, 1);

                (string Icon, string Name)[] files =
                [
                    (LucideIcons.FileText, "PROJECT.md"),
                    (LucideIcons.Image, "palette.png"),
                    (LucideIcons.FileText, "release-notes.md"),
                    (LucideIcons.Folder, "src"),
                    (LucideIcons.Folder, "docs"),
                    (LucideIcons.File, "NE.Standard.slnx"),
                ];

                foreach ((var icon, var name) in files)
                {
                    _ = tiles.AddChild(new TextComponent()
                        .SetIcon(icon)
                        .SetTitle(name)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetWidth(UILayoutLength.Absolute(170))
                    );
                }

                _ = content.AddChild(tiles);
            },
            static _ => { },
            contentMinHeight: 120
        );
    }
}
