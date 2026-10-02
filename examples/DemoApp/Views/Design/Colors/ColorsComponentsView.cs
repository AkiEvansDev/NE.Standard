namespace DemoApp.Views.Design.Colors;

/// <summary>
/// The same component compositions side by side in both themes, through the per-component <c>Theme</c> override: the theme's name
/// in the page's language, the compositions a sample's own words, shown as written.
/// </summary>
internal sealed class ColorsComponentsView : ColorsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.colors.components";

    protected override string CurrentTabUrl => "/design/colors/components";

    protected override void DrawColorsContent(WrapPanelComponent container)
    {
        // Two framed panels, not groups: they keep the tight gap of a pair rather than the page's gap between groups.
        _ = container
            .SetSpacing(16)
            .AddChild(CreateThemePanel(UIThemeMode.Light))
            .AddChild(CreateThemePanel(UIThemeMode.Dark));
    }

    private static ContainerComponent CreateThemePanel(UIThemeMode mode)
    {
        StackPanelComponent stack = UILayout.Stack(16)
            .SetPlacement(1, 1, 24, 1)
            .AddChild(new TextComponent()
                .SetTitle(ThemeWord(mode == UIThemeMode.Dark))
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
            )
            .AddChild(CreateArticleCard().AsContentTree())
            .AddChild(CreateStatusCard().AsContentTree())
            .AddChild(CreateActionsCard().AsContentTree());

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
                .SetDescription("Panel release 483 — July 2026")
            )
            .SetContent(new TextComponent()
                .SetDescription("Servers filter by region, invoices download as one PDF a month, and every server shows its plan.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    private static CardComponent CreateStatusCard()
        => new CardComponent()
            .ConfigureDefaultHeader(h => h
                .SetTitle("Nightly backups")
                .SetIcon(DemoIcons.Refresh)
                .SetBadgeText("Running")
            )
            .SetContent(UILayout.Stack(12)
                .AddChild(new TextComponent()
                    .SetTitle("419 of 612 servers snapshotted, uploads in progress.")
                    .SetTitleType(UITextAppearance.Body)
                    .SetTitleWrap(true)
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
                .SetTitle("Invite staff")
                .SetDescription("Share this panel")
            )
            .SetContent(new TextComponent()
                .SetDescription("Billing can see invoices, Viewer can see servers, and an Admin can change both.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetFooter(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(UIButtons.Primary("Invite"))
                .AddChild(UIButtons.Ghost("Copy link"))
            );
}
