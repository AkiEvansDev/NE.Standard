using System.Collections.Generic;
using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// The language switcher, and every kind of word a switch writes again where it stands: a key and content, which no switch touches, a
/// key a command set, a phrase with a count and one with a name, phrases in options and in a field, the framework's own words, a
/// rule's message, rows built after the page loaded and a moment inside a sentence — one to a section.
/// </summary>
/// <remarks>The demo carries whole zh-Hans and Russian tables of its own (<see cref="DemoTranslations"/>); the framework ships English only.</remarks>
internal sealed class WordsView : DemoMechanismView, IUIViewDefinition
{
    private const string Words = "demo.language.";

    public static string ViewKey => "demo.mechanisms.words";

    protected override string ComponentRoute => "/mechanisms/words";
    protected override string Header => "demo.mechanisms.words.header";
    protected override string HeaderDescription => "demo.mechanisms.words.description";

    // Read across, two to a row: switching, then the kinds of words from the plainest to a moment, then a switch from the server.
    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(
            CreateSwitcherGroup(),
            CreateContentGroup(),
            CreateCommandKeyGroup(),
            CreateCountGroup(),
            CreateNameGroup(),
            CreatePhraseGroup(),
            CreateFieldWordsGroup(),
            CreateChromeGroup(),
            CreateRulesGroup(),
            CreateRowsGroup(),
            CreateMomentGroup(),
            CreateCommandGroup()
        );

    private static ContainerComponent CreateSwitcherGroup()
        => DemoUI.CreateExample(Words + "group.switcher",
            UILayout.Row(12)
                .AddChild(new LanguageSwitcherComponent())
                .AddChild(new LanguageSwitcherComponent()
                    .SetDisplay(UILanguageDisplay.Name)
                    .SetIcon(DemoIcons.Outline(DemoIcons.MessageSquare))
                    .SetType(UIButtonType.Outline)
                    .SetLanguages(["en", "zh-Hans"])
                )
                .AddChild(new LanguageSwitcherComponent().SetLanguages(["en"])),
            note: Words + "note.switcher"
        );

    /// <summary>A string with the demo's prefix is a key; marked content, it is shown as written. Without the prefix it is content everywhere.</summary>
    private static ContainerComponent CreateContentGroup()
        => DemoUI.CreateExample(Words + "group.content",
            UILayout.Row(24)
                .AddChild(new TextComponent().SetTitle("demo.language.cards"))
                .AddChild(new TextComponent().SetTitle("demo.language.cards").AsContent(ITextBaseComponent.TitleProperty)),
            note: Words + "note.content"
        );

    private static ContainerComponent CreateCommandKeyGroup()
        => DemoUI.CreateExample(Words + "group.command-key",
            UILayout.Row(8)
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindText(nameof(WordsController.Label))
                )
                .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetTitle("demo.language.cards").OnClick(nameof(WordsController.ShowCards)))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetTitle("demo.language.decks").OnClick(nameof(WordsController.ShowDecks))),
            note: Words + "note.command-key",
            controller: [DemoCode.Of<WordsController>(nameof(WordsController.Label), nameof(WordsController.ShowCards), nameof(WordsController.ShowDecks))]
        );

    private static ContainerComponent CreateCountGroup()
        => DemoUI.CreateExample(Words + "group.count",
            UILayout.Row(8)
                .AddChild(new TextComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .BindTitle(nameof(WordsController.Files))
                )
                .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Remove).SetTooltip("demo.language.remove-file").OnClick(nameof(WordsController.RemoveFile)))
                .AddChild(new ButtonComponent().SetType(UIButtonType.Ghost).SetIcon(DemoIcons.Add).SetTooltip("demo.language.add-file").OnClick(nameof(WordsController.AddFile))),
            note: Words + "note.count",
            controller: [DemoCode.Of<WordsController>("_files", nameof(WordsController.Files), nameof(WordsController.AddFile), nameof(WordsController.RemoveFile), "FilesPhrase")]
        );

    private static ContainerComponent CreateNameGroup()
        => DemoUI.CreateExample(Words + "group.name",
            new TextComponent().BindTitle(nameof(WordsController.Greeting)),
            note: Words + "note.name",
            controller: [DemoCode.Of<WordsController>(nameof(WordsController.Greeting), "OnAttachedAsync", "GreetingFor", "OnLanguageChangedAsync")]
        );

    private static ContainerComponent CreatePhraseGroup()
        => DemoUI.CreateExample(Words + "group.phrases",
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
            note: Words + "note.phrases"
        );

    private static ContainerComponent CreateFieldWordsGroup()
        => DemoUI.CreateExample(Words + "group.field",
            new TextInputComponent()
                .SetTitle(UIPhrase.Of("demo.inputs.text-input.name.title"))
                .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.name.placeholder"))
                .SetHelp(UIPhrase.Of("demo.inputs.text-input.name.help", ("max", 32)))
                .SetMaxLength(32),
            note: Words + "note.field"
        );

    private static ContainerComponent CreateChromeGroup()
        => DemoUI.CreateExample(Words + "group.chrome",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent().SetShowClearButton().SetPlaceholder("demo.language.placeholder"))
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
                .AddChild(new ColorInputComponent()),
            note: Words + "note.chrome"
        );

    private static ContainerComponent CreateRulesGroup()
        => DemoUI.CreateExample(Words + "group.rules",
            new TextInputComponent()
                .SetTitle("demo.language.name")
                .Required("demo.language.name-required")
                .Regex("^.{0,12}$", UIPhrase.Of("demo.language.name-max", ("max", 12))),
            note: Words + "note.rules"
        );

    /// <summary>Every row's select shares its options from the root: a row added later is drawn with them, and its words switch with the rest.</summary>
    private static ContainerComponent CreateRowsGroup()
        => DemoUI.CreateExample(Words + "group.rows",
            UILayout.Stack(12)
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
                        .SetType(UIButtonType.Outline)
                        .SetIcon(DemoIcons.Add)
                        .SetTitle("demo.language.add-effect")
                        .OnClick(nameof(WordsController.AddEffect))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Add)
                        .SetTitle("demo.language.add-school")
                        .OnClick(nameof(WordsController.AddSchool))
                    )
                ),
            note: Words + "note.rows",
            controller: [DemoCode.Of<LanguageEffectItem>(), DemoCode.Of<WordsController>("_rows", nameof(WordsController.Effects), nameof(WordsController.Schools), nameof(WordsController.AddEffect), nameof(WordsController.AddSchool))]
        );

    private static ContainerComponent CreateMomentGroup()
        => DemoUI.CreateExample(Words + "group.moment",
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
            note: Words + "note.moment",
            context: nameof(WordsController.MomentGroup),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                [Words + "back-up"] = nameof(WordsController.BackUpNow)
            }),
            // The actions' column would leave the two entries too narrow for their descriptions.
            controlsBelow: true,
            controller: [DemoCode.Of<MomentWordsGroupContext>(), DemoCode.Of<WordsController>(nameof(WordsController.MomentGroup), nameof(WordsController.BackUpNow))]
        );

    private static ContainerComponent CreateCommandGroup()
        => DemoUI.CreateExample(Words + "group.command",
            new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetTitle("demo.language.switch-from-command")
                .OnClick(nameof(WordsController.SwitchFromCommandAsync)),
            note: Words + "note.command",
            controller: [DemoCode.Of<WordsController>(nameof(WordsController.SwitchFromCommandAsync))]
        );
}
