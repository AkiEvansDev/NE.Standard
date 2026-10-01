using System.Collections.Generic;
using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// The language switcher, and every kind of word a switch writes again where it stands: a static key, a value a command set, a phrase
/// with a count and one with a name, rows built after the page loaded, the chrome's own words, a validation message and the tab's
/// title; options and a field's words as phrases, a moment inside a sentence; and content, which no switch touches.
/// </summary>
/// <remarks>The demo carries whole zh-Hans and Russian tables of its own (<see cref="DemoTranslations"/>); the framework ships English only.</remarks>
internal sealed class WordsView : DemoMechanismView, IUIViewDefinition
{
    private const string MomentGroup = nameof(WordsController.MomentGroup);

    public static string ViewKey => "demo.mechanisms.words";

    protected override string ComponentRoute => "/mechanisms/words";
    protected override string Header => "demo.mechanisms.words.header";
    protected override string HeaderDescription => "demo.mechanisms.words.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        // Paired by height, so no group stands beside a hole: the switcher first, the rest two of a size to a row.
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSwitcherGroup(), CreateValueGroup(), CreatePhraseGroup(), CreateRowsGroup()],
            [CreateContentGroup(), CreateChromeGroup(), CreateMomentGroup(), CreateFieldWordsGroup()]
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
                    .OnClick(nameof(WordsController.SwitchFromCommandAsync))
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
                    .AddChild(new BadgeComponent().BindText(nameof(WordsController.Label)))
                    .AddChild(new ButtonComponent().OnClick(nameof(WordsController.ShowCards)).SetType(UIButtonType.Ghost).SetTitle("demo.language.cards"))
                    .AddChild(new ButtonComponent().OnClick(nameof(WordsController.ShowDecks)).SetType(UIButtonType.Ghost).SetTitle("demo.language.decks"))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new TextComponent().BindTitle(nameof(WordsController.Files)))
                    .AddChild(new ButtonComponent().OnClick(nameof(WordsController.RemoveFile)).SetType(UIButtonType.Ghost).SetTitle("−").SetAccessibleName("demo.language.remove-file"))
                    .AddChild(new ButtonComponent().OnClick(nameof(WordsController.AddFile)).SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Add).SetTooltip("demo.language.add-file"))
                )
                .AddChild(new TextComponent().BindTitle(nameof(WordsController.Greeting)))
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
                    .BindItems(nameof(WordsController.Effects))
                    .SetSpacing(8)
                    .SetTemplate(UILayout.Columns(8,
                        new TextComponent()
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetVerticalAlignment(UIAlignment.Center),
                        new SelectComponent()
                            .BindOptions(nameof(WordsController.Schools), UIBindingScope.Root)
                            .BindValue(nameof(LanguageEffectItem.School), UIBindingScope.Relative)
                    ))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(WordsController.AddEffect))
                        .SetType(UIButtonType.Outline)
                        .SetIcon(DemoIcons.Add)
                        .SetTitle("demo.language.add-effect")
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(WordsController.AddSchool))
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

    /// <summary>
    /// Every word of the field a phrase: the caption, the placeholder and the help badge's words are keys the page translates, the help
    /// with a number in its slot.
    /// </summary>
    private static ContainerComponent CreateFieldWordsGroup()
    {
        return DemoUI.CreateExample("demo.language.group.field",
            new TextInputComponent()
                .SetTitle(UIPhrase.Of("demo.inputs.text-input.name.title"))
                .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.name.placeholder"))
                .SetHelp(UIPhrase.Of("demo.inputs.text-input.name.help", ("max", 32)))
                .SetMaxLength(32),
            note: "demo.language.note.field"
        );
    }

    /// <summary>
    /// Words that are phrases: a heading with a count, and options whose titles carry a city and a count, each written in the page's
    /// language and its plural form.
    /// </summary>
    private static ContainerComponent CreatePhraseGroup()
    {
        return DemoUI.CreateExample("demo.language.group.phrases",
            UILayout.Stack(12)
                .AddChild(new TextComponent()
                    .SetTitle(UIPhrase.Of("demo.inputs.select.regions.heading", ("count", 4)))
                    .SetTitleType(UITextAppearance.Subtitle)
                )
                .AddChild(new SelectComponent()
                    .SetTitle(UIPhrase.Of("demo.inputs.select.regions.title"))
                    .SetOptions(
                    [
                        new OptionItem { Id = "eu-west", Title = UIPhrase.Of("demo.inputs.select.regions.servers", ("region", "Amsterdam"), ("count", 1)) },
                        new OptionItem { Id = "eu-central", Title = UIPhrase.Of("demo.inputs.select.regions.servers", ("region", "Frankfurt"), ("count", 3)) },
                        new OptionItem { Id = "us-east", Title = UIPhrase.Of("demo.inputs.select.regions.servers", ("region", "Ashburn"), ("count", 5)) },
                        new OptionItem { Id = "ap-south", Title = UIPhrase.Of("demo.inputs.select.regions.servers", ("region", "Singapore"), ("count", 22)) }
                    ])
                    .SetValue("eu-central")
                ),
            note: "demo.language.note.phrases"
        );
    }

    /// <summary>
    /// A moment inside a sentence: an action's description is a phrase whose argument is a moment, and so is a toast's message.
    /// </summary>
    private static ContainerComponent CreateMomentGroup()
    {
        return DemoUI.CreateExample("demo.language.group.moment",
            UILayout.Stack(4)
                .AddChild(new ActionComponent()
                    .SetIcon(DemoIcons.Mail)
                    .SetTitle("Release notes for 1.4")
                    .BindDescription(nameof(MomentWordsGroupContext.Sent), UIBindingScope.Relative)
                )
                .AddChild(new ActionComponent()
                    .SetIcon(DemoIcons.Clock)
                    .SetTitle("Maintenance window")
                    .BindDescription(nameof(MomentWordsGroupContext.Starts), UIBindingScope.Relative)
                ),
            note: "demo.language.note.moment",
            context: MomentGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["demo.language.back-up"] = nameof(WordsController.BackUpNow)
            })
        );
    }
}
