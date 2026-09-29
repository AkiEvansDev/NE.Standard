using DemoApp.Controllers.Actions;
using DemoApp.Views.Base;

namespace DemoApp.Views.Actions;

/// <summary>
/// The language switcher, and every kind of word a switch writes again where it stands: a static key, a value a command set, a phrase
/// with a count and one with a name, rows built after the page loaded, the chrome's own words, a validation message and the tab's
/// title; and content, which no switch touches.
/// </summary>
/// <remarks>The demo carries whole zh-Hans and Russian tables of its own (<see cref="DemoTranslations"/>); the framework ships English only.</remarks>
internal sealed class LanguageSwitcherMainView : DemoView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.language-switcher.main";

    protected override string ComponentRoute => "/actions/language-switcher";
    protected override DemoViewKind ViewKind => DemoViewKind.Main;
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main];
    protected override string Header => "demo.actions.language-switcher.header";
    protected override string HeaderDescription => "demo.actions.language-switcher.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSwitcherGroup(), CreateValueGroup(), CreateChromeGroup()],
            [CreateRowsGroup(), CreateContentGroup()]
            )
        );
    }

    private static ContainerComponent CreateSwitcherGroup()
    {
        return DemoUI.CreateGroup(null, "demo.language.group.switcher",
            content => content.AddChild(UILayout.Row(12)
                .AddChild(new LanguageSwitcherComponent())
                .AddChild(new LanguageSwitcherComponent()
                    .SetDisplay(UILanguageDisplay.Name)
                    .SetIcon(DemoIcons.Outline(DemoIcons.MessageSquare))
                    .SetType(UIButtonType.Outline)
                    .SetLanguages(["en", "zh-Hans"])
                )
                .AddChild(new LanguageSwitcherComponent().SetLanguages(["en"]))
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(LanguageSwitcherMainController.SwitchFromCommandAsync))
                    .SetType(UIButtonType.Ghost)
                    .SetTitle("demo.language.switch-from-command")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "demo.language.note.switcher"
        );
    }

    /// <summary>A static key, a key a command sets, a count and a name: each switches in place, none by a round trip of its own.</summary>
    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(null, "demo.language.group.values",
            content => content.AddChild(UILayout.Stack(12)
                .AddChild(new TextComponent().SetTitle("demo.language.static"))
                .AddChild(UILayout.Row(8)
                    .AddChild(new BadgeComponent().BindText(nameof(LanguageSwitcherMainController.Label)))
                    .AddChild(new ButtonComponent().OnClick(nameof(LanguageSwitcherMainController.ShowCards)).SetType(UIButtonType.Ghost).SetTitle("demo.language.cards"))
                    .AddChild(new ButtonComponent().OnClick(nameof(LanguageSwitcherMainController.ShowDecks)).SetType(UIButtonType.Ghost).SetTitle("demo.language.decks"))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new TextComponent().BindTitle(nameof(LanguageSwitcherMainController.Files)))
                    .AddChild(new ButtonComponent().OnClick(nameof(LanguageSwitcherMainController.RemoveFile)).SetType(UIButtonType.Ghost).SetTitle("−").SetAccessibleName("demo.language.remove-file"))
                    .AddChild(new ButtonComponent().OnClick(nameof(LanguageSwitcherMainController.AddFile)).SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Add).SetTooltip("demo.language.add-file"))
                )
                .AddChild(new TextComponent().BindTitle(nameof(LanguageSwitcherMainController.Greeting)))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "demo.language.note.values"
        );
    }

    /// <summary>
    /// Rows the page builds after it loaded, each with a select whose options every row shares from the root: a row added later is
    /// drawn with them, and its words switch with the rest.
    /// </summary>
    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(null, "demo.language.group.rows",
            content => content.AddChild(UILayout.Stack(12)
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(LanguageSwitcherMainController.Effects))
                    .SetSpacing(8)
                    .SetTemplate(UILayout.Columns(8,
                        new TextComponent()
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetVerticalAlignment(UIAlignment.Center),
                        new SelectComponent()
                            .BindOptions(nameof(LanguageSwitcherMainController.Schools), UIBindingScope.Root)
                            .BindValue(nameof(LanguageEffectItem.School), UIBindingScope.Relative)
                    ))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(LanguageSwitcherMainController.AddEffect))
                        .SetType(UIButtonType.Outline)
                        .SetIcon(DemoIcons.Add)
                        .SetTitle("demo.language.add-effect")
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(LanguageSwitcherMainController.AddSchool))
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Add)
                        .SetTitle("demo.language.add-school")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "demo.language.note.rows"
        );
    }

    /// <summary>
    /// The chrome's own words — a clear button's name, a select's placeholder, a chip's remove, a palette colour's name — and a
    /// field's validation messages, a key and a phrase with its limit, switch with the page.
    /// </summary>
    private static ContainerComponent CreateChromeGroup()
    {
        return DemoUI.CreateGroup(null, "demo.language.group.chrome",
            content => content.AddChild(UILayout.Stack(12)
                .AddChild(new TextInputComponent().SetShowClearButton().SetPlaceholder("demo.language.placeholder"))
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.language.name")
                    .Required("demo.language.name-required")
                    .Regex("^.{0,12}$", UIPhrase.Of("demo.language.name-max", ("max", 12)))
                )
                .AddChild(new ColorInputComponent())
                .AddChild(new SelectComponent()
                    .SetShowClearButton()
                    .SetOptions(
                    [
                        new OptionItem { Id = "fire", Title = "demo.language.school.fire" },
                        new OptionItem { Id = "frost", Title = "demo.language.school.frost" }
                    ])
                )
                .AddChild(new MultiSelectComponent()
                    .SetValue(["arcane"])
                    .SetOptions(
                    [
                        new OptionItem { Id = "fire", Title = "demo.language.school.fire" },
                        new OptionItem { Id = "arcane", Title = "demo.language.school.arcane" }
                    ])
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "demo.language.note.chrome"
        );
    }

    /// <summary>
    /// A key of the table, shown once looked up and once as content, which is never looked up — the way to show a string that has
    /// the demo's prefix as written; without the prefix a string is content everywhere.
    /// </summary>
    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(null, "demo.language.group.content",
            content => content.AddChild(UILayout.Row(24)
                .AddChild(new TextComponent().SetTitle("demo.language.cards"))
                .AddChild(new TextComponent().SetTitle("demo.language.cards").AsContent(ITextBaseComponent.TitleProperty))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "demo.language.note.content"
        );
    }
}
