using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// The same component compositions side by side in both themes, through the per-component <c>Theme</c> override.
/// </summary>
internal sealed class ColorsComponentsView : ColorsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.colors.components";

    protected override string CurrentTabUrl => "/design/colors/components";

    protected override void DrawColorsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateThemePanel(UIThemeMode.Light))
            .AddChild(CreateThemePanel(UIThemeMode.Dark));
    }

    private static ContainerComponent CreateThemePanel(UIThemeMode mode)
    {
        StackPanelComponent stack = UILayout.Stack(16)
            .SetPlacement(1, 1, 24, 1)
            .AddChild(new TextComponent()
                .SetTitle(mode.ToString())
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
            )
            .AddChild(CreateArticleCard())
            .AddChild(CreateStatusCard())
            .AddChild(CreateActionsCard());

        return new ContainerComponent()
            .SetTheme(mode)
            .SetBackground(UIThemeColor.Background)
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(10))
            .SetPadding(UIThickness.Uniform(20))
            .SetPlacement(1, 1, 24, 1, xl: UIGridPlacement.At(1, 1, 12, 1))
            .AddRow(UIGridUnit.Auto())
            .AddChild(stack);
    }

    private static CardComponent CreateArticleCard()
        => new CardComponent()
            .ConfigureDefaultHeader(h => h
                .SetTitle("Release notes")
                .SetDescription("Version 2.4 — July 2026")
            )
            .SetContent(new TextComponent()
                .SetDescription("Grouped items, template variants and per-component theme overrides are now available to every view.")
                .SetDescriptionType(UITextAppearance.Body)
            );

    private static CardComponent CreateStatusCard()
        => new CardComponent()
            .ConfigureDefaultHeader(h => h
                .SetTitle("Nightly build")
                .SetIcon(DemoIcons.Refresh)
                .SetBadgeText("Running")
            )
            .SetContent(UILayout.Stack(12)
                .AddChild(new TextComponent()
                    .SetTitle("Test suite 419/419, packaging in progress.")
                    .SetTitleType(UITextAppearance.Body)
                    .SetDescription("Started 12 minutes ago")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new ProgressComponent()
                    .SetValue(70)
                    .SetShowValue(true)
                )
            );

    private static CardComponent CreateActionsCard()
        => new CardComponent()
            .ConfigureDefaultHeader(h => h
                .SetTitle("Invite your team")
                .SetDescription("Share this workspace")
            )
            .SetContent(new TextComponent()
                .SetDescription("Members can view every board and edit the ones you assign to them.")
                .SetDescriptionType(UITextAppearance.Body)
            )
            .SetFooter(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(UIButtons.Primary("Invite"))
                .AddChild(UIButtons.Ghost("Copy link"))
            );
}
