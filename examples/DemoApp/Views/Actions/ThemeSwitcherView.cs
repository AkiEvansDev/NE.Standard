using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// One theme switcher in both its shapes, the button and the field, and every property that can be bound to each.
/// </summary>
/// <remarks>
/// Pressing it switches the whole page, not the preview: the theme is the document's state. The examples set the field in a settings
/// form beside the language's; what a controller hears of a switch is the Colors page's theme tab.
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
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1);

    private static ThemeSwitcherComponent CreateField()
        => BindStandard(new ThemeSwitcherComponent().AsField())
            .BindAppearance($"{FieldGroup}.{nameof(ThemeFieldGroupContext.Appearance)}")
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
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SwitcherGroup, "Theme switcher", nameof(ThemeSwitcherController.CycleSwitcherGroupOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ThemeSwitcherController.CycleBorderGroupOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(ThemeSwitcherController.CycleFieldGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateSettingsGroup()];

    /// <summary>A settings form's display section: the theme and the language as fields, each with its note, as any other field.</summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("In a settings form",
            UICard.Create("Display", "How the pages look to you.", UIForm.Row(
                UIForm.Field(new ThemeSwitcherComponent().AsField(), "System follows the device, light or dark as it is set."),
                UIForm.Field(new LanguageSwitcherComponent().AsField(), "The page is rewritten in place; nothing typed is lost.")
            ))
            .SetMaxWidth(UILayoutLength.Absolute(640)),
            note: "AsField() draws either switcher as a field: its caption, a box in the form's appearance, Tonal unless set, and the list. The current choice is the page's to show — the theme from the page's own, the language from the session's — and a choice switches as the button does."
        );
    }
}
