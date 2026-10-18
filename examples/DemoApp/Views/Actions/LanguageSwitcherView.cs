using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// One language switcher in both its shapes, the button and the field, and every property that can be bound to each.
/// </summary>
/// <remarks>
/// Pressing it switches the whole page, not the preview, and tells the session: the language is the reader's. The examples set the
/// button in a public page's head and at a sign-in card's foot, and the field in a form's language and region section; the settings
/// screen holds the field beside the theme's.
/// </remarks>
internal sealed class LanguageSwitcherView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SwitcherGroup = nameof(LanguageSwitcherController.SwitcherGroup);
    private const string BorderGroup = nameof(LanguageSwitcherController.BorderGroup);
    private const string FieldGroup = nameof(LanguageSwitcherController.FieldGroup);

    public static string ViewKey => "demo.actions.language-switcher";

    protected override string ComponentRoute => "/actions/language-switcher";
    protected override string Header => "demo.actions.language-switcher.header";
    protected override string HeaderDescription => "demo.actions.language-switcher.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    // The languages offered and what the button shows of them are decided once at render, so each answer is drawn; the field takes the
    // standard rows and its own, not the button's.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("Button, two languages: a press switches to the other", frame => frame.AddChild(CreateButton().SetLanguages(["en", "ru"]))),
            ("Button, every language by its name: a press opens the list", frame => frame.AddChild(CreateButton().SetDisplay(UILanguageDisplay.Name))),
            ("Field: the list, for a settings form", frame => frame.AddChild(CreateField()))
        );

    private static LanguageSwitcherComponent CreateButton()
        => BindStandard(new LanguageSwitcherComponent())
            .BindIcon($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Icon)}")
            .BindIconSize($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.IconSize)}")
            .BindType($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Type)}")
            .BindSize($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Size)}")
            .BindPadding($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Padding)}")
            .BindTooltip($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.TooltipPlacement)}")
            .BindBackground($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Background)}")
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1);

    private static LanguageSwitcherComponent CreateField()
        => BindStandard(new LanguageSwitcherComponent().AsField())
            .BindIcon($"{SwitcherGroup}.{nameof(LanguageSwitcherGroupContext.Icon)}")
            .BindAppearance($"{FieldGroup}.{nameof(SwitcherFieldGroupContext.Appearance)}")
            .SetWidth(UILayoutLength.Absolute(280))
            .SetPlacement(1, 1, 24, 1);

    private static LanguageSwitcherComponent BindStandard(LanguageSwitcherComponent switcher)
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
            DemoUI.CreateOptionSection(SwitcherGroup, "Language switcher"),
            DemoUI.CreateOptionSection(BorderGroup, "Border"),
            DemoUI.CreateOptionSection(FieldGroup, "Field")
        );

    // The head across the page, as a head is; the sign-in card beside the form, the two about as tall.
    protected override IVisualComponent[] CreateExamples()
        => [CreateHeadGroup(), CreateSignInGroup(), CreateSettingsGroup()];

    /// <summary>Two languages: the public status page's head, where a press goes straight to the other one.</summary>
    private static ContainerComponent CreateHeadGroup()
    {
        return DemoUI.CreateExample("Two languages, one press",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.All(16, 8, 8, 8))
                .SetContent(UILayout.Ends(
                    UIText.Body("Orvane status", "status.orvane.example"),
                    new LanguageSwitcherComponent()
                        .SetLanguages(["en", "zh-Hans"])
                        .SetTooltip("Switch the language")
                    )
                ),
            columns: 24,
            note: "Languages narrows the offer to two, so a press switches straight to the other and the code shows which is on. The page is rewritten in place and the session keeps the choice for the next page; numbers and dates keep their culture until then. Offered one language, the button is not drawn: there is nothing to switch."
        );
    }

    /// <summary>Every language, by its name: a sign-in card's foot, where a reader with no settings yet picks one from the list.</summary>
    private static ContainerComponent CreateSignInGroup()
    {
        return DemoUI.CreateExample("More than two open a list",
            new CardComponent()
                .SetMaxWidth(UILayoutLength.Absolute(400))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Sign in")
                    .SetDescription("The Orvane Cloud admin panel, for its staff.")
                )
                .SetContent(UILayout.Stack(12,
                    new TextInputComponent()
                        .SetTitle("Work mail")
                        .SetPlaceholder("robin@orvane.example"),
                    UIButtons.Primary("Continue")
                    )
                )
                .SetFooter(UILayout.Ends(
                    UIButtons.Link("status.orvane.example"),
                    new LanguageSwitcherComponent()
                        .SetDisplay(UILanguageDisplay.Name)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Region))
                    )
                ),
            note: "With every language the translator lists, a press opens the list, each named in itself and never translated. Display(Name) shows the page's language by its name, the glyph before it."
        );
    }

    /// <summary>
    /// A settings form's language and region section: the language as a field, beside the time zone and the week's first day.
    /// </summary>
    /// <remarks>The theme has a form of its own on its page, and the settings screen holds the two together.</remarks>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("In a settings form",
            UICard.Create("Language and region", "How words, times and dates read to you.", UILayout.Stack(16,
                UIForm.Field(new LanguageSwitcherComponent().AsField(), "The page is rewritten in place; nothing typed is lost."),
                UIForm.Row(
                    new SelectComponent()
                        .SetTitle("Time zone")
                        .SetOptions(
                        [
                            new OptionItem { Id = "europe-amsterdam", Title = "Amsterdam (UTC+2)" },
                            new OptionItem { Id = "europe-stockholm", Title = "Stockholm (UTC+2)" },
                            new OptionItem { Id = "america-ashburn", Title = "Ashburn (UTC−4)" },
                            new OptionItem { Id = "asia-singapore", Title = "Singapore (UTC+8)" }
                        ])
                        .SetValue("europe-amsterdam"),
                    new SelectComponent()
                        .SetTitle("Weeks start on")
                        .SetOptions(
                        [
                            new OptionItem { Id = "monday", Title = "Monday" },
                            new OptionItem { Id = "sunday", Title = "Sunday" }
                        ])
                        .SetValue("monday")
                )
            ), DemoIcons.Outline(DemoIcons.Region))
            .SetMaxWidth(UILayoutLength.Absolute(520)),
            note: "AsField() draws the switcher as a form's field: its caption (\"Language\" unless set), a box in the form's appearance, Tonal unless set, and the list, whatever the number of languages. The current choice is the session's, and a choice switches as the button does — no command, no binding, no save."
        );
    }
}
