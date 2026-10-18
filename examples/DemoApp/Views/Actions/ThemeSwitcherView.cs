using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// One theme switcher in both its shapes, the button and the field, and every property that can be bound to each.
/// </summary>
/// <remarks>
/// Pressing it switches the whole page, not the preview: the theme is the document's state. The examples set the button in a page's
/// head and at a sidebar's foot, and the field among a form's display preferences; what a controller hears of a switch is the Colors
/// page's theme tab.
/// </remarks>
internal sealed class ThemeSwitcherView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SwitcherGroup = nameof(ThemeSwitcherController.SwitcherGroup);
    private const string BorderGroup = nameof(ThemeSwitcherController.BorderGroup);
    private const string FieldGroup = nameof(ThemeSwitcherController.FieldGroup);

    public static string ViewKey => "demo.actions.theme-switcher";

    protected override string ComponentRoute => "/actions/theme-switcher";
    protected override string Header => "demo.actions.theme-switcher.header";
    protected override string HeaderDescription => "demo.actions.theme-switcher.description";
    protected override (string Route, string Label)? ComposedIn => ("/design/colors/theme", "demo.nav.design.colors");

    // The shape is decided once at render, so both are drawn; the field takes the standard rows and its own, not the button's.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(300,
            ("Button: a press flips light and dark", frame => frame.AddChild(CreateButton())),
            ("Field: Light, Dark or System, for a settings form", frame => frame.AddChild(CreateField()))
        );

    private static ThemeSwitcherComponent CreateButton()
        => BindStandard(new ThemeSwitcherComponent())
            .BindLightIcon($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.LightIcon)}")
            .BindDarkIcon($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.DarkIcon)}")
            .BindIconSize($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.IconSize)}")
            .BindType($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Type)}")
            .BindSize($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Size)}")
            .BindPadding($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Padding)}")
            .BindTooltip($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.TooltipPlacement)}")
            .BindBackground($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Background)}")
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1);

    private static ThemeSwitcherComponent CreateField()
        => BindStandard(new ThemeSwitcherComponent().AsField())
            .BindAppearance($"{FieldGroup}.{nameof(SwitcherFieldGroupContext.Appearance)}")
            .SetWidth(UILayoutLength.Absolute(280))
            .SetPlacement(1, 1, 24, 1);

    private static ThemeSwitcherComponent BindStandard(ThemeSwitcherComponent switcher)
        => switcher
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(SwitcherGroup, "Theme switcher"),
            DemoUI.CreateOptionSection(BorderGroup, "Border"),
            DemoUI.CreateOptionSection(FieldGroup, "Field")
        );

    // The head across the page, as a head is; the sidebar's foot beside the form, the two about as tall.
    protected override IVisualComponent[] CreateExamples()
        => [CreateHeadGroup(), CreateSidebarGroup(), CreateSettingsGroup()];

    /// <summary>The button where a reader looks for it: at the end of the panel's top bar, among the bar's other icons.</summary>
    private static ContainerComponent CreateHeadGroup()
    {
        return DemoUI.CreateExample("In a page's head",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.All(16, 8, 8, 8))
                .SetContent(UILayout.Ends(
                    UIText.Body("Orvane Cloud", "Admin panel"),
                    UIIconButtons.Search(),
                    new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bell))
                        .SetTooltip("Notifications")
                        .SetBadgeText("3")
                        .SetBadgeStyle(UIBadgeType.Danger),
                    new ThemeSwitcherComponent()
                        .SetLightIcon(DemoIcons.Outline(DemoIcons.LightMode))
                        .SetDarkIcon(DemoIcons.Outline(DemoIcons.DarkMode))
                        .SetTooltip("Switch the theme")
                    )
                ),
            columns: 24,
            note: "A ghost button by default, as the bar's other icons are. A press switches the whole page, not the bar: the theme is the document's, and the session keeps it for the next page. Each glyph offers the theme it names — the sun while the page is dark."
        );
    }

    /// <summary>The button small at the end of the signed-in person's row, at the foot of a narrow sidebar.</summary>
    private static ContainerComponent CreateSidebarGroup()
    {
        return DemoUI.CreateExample("At a sidebar's foot",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.Uniform(8))
                .SetWidth(UILayoutLength.Absolute(260))
                .SetContent(UILayout.Stack(8,
                    new MenuComponent().SetItems([
                        new MenuItem { Id = "servers", Title = "Servers", Icon = DemoIcons.Outline(DemoIcons.Server), Selected = true },
                        new MenuItem { Id = "regions", Title = "Regions", Icon = DemoIcons.Outline(DemoIcons.Region) },
                        new MenuItem { Id = "invoices", Title = "Invoices", Icon = DemoIcons.Outline(DemoIcons.FileText) },
                        new MenuItem { Id = "settings", Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings) }
                    ]),
                    new SeparatorComponent(),
                    UILayout.Ends(
                        UIText.Person(DemoImages.Avatar, "Robin Hale", "Admin", UIPersonSize.Small),
                        new ThemeSwitcherComponent()
                            .SetSize(UIButtonSize.Small)
                            .SetIconSize(UIIconSize.Small)
                            .SetLightIcon(DemoIcons.LightMode)
                            .SetDarkIcon(DemoIcons.DarkMode)
                            .SetTooltip("Switch the theme")
                        )
                    )
                ),
            note: "Small, in a row of its own size: Size is the button's box, IconSize the glyph inside it. The glyphs are any icon, here the filled drawings rather than the outlined ones the head wears."
        );
    }

    /// <summary>
    /// A settings form's display section: the theme as a field among the other ways the panel looks to its reader, each with its note.
    /// </summary>
    /// <remarks>The language has a form of its own on its page, and the settings screen holds the two together.</remarks>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("Beside the other display preferences",
            UICard.Create("Display", "How the panel looks to you.", UILayout.Stack(16,
                UIForm.Field(new ThemeSwitcherComponent().AsField(), "System follows the device, light or dark as it is set."),
                new RadioGroupComponent()
                    .SetTitle("Rows")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(
                    [
                        new OptionItem { Id = "comfortable", Title = "Comfortable" },
                        new OptionItem { Id = "compact", Title = "Compact" }
                    ])
                    .SetValue("comfortable"),
                new SwitchComponent()
                    .SetTitle("Reduce motion")
                    .SetDescription("Panels open without sliding.")
                    .SetDescriptionColor(UIThemeColor.Muted)
            ), DemoIcons.Outline(DemoIcons.Palette))
            .SetMaxWidth(UILayoutLength.Absolute(480)),
            note: "AsField() draws the switcher as a form's field: its caption (\"Theme\" unless set), a box in the form's appearance, Tonal unless set, and the list of Light, Dark and System. The current choice is the page's to show, and a choice switches as the button does — no command, no binding, no save."
        );
    }
}
