using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Select;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// What a dropdown is used for: a list of plain names, a list where every option carries a glyph, a second
/// line and a badge, and a template written by hand for the ones where the default's order is wrong.
/// </summary>
/// <remarks>The closed trigger draws the chosen option through the same template the list used, so it stays rich.</remarks>
internal sealed class SelectExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.select.examples";

    protected override string ComponentRoute => "/inputs/select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";

    /// <summary>
    /// The roster card's dialog, as wide as the one the issue came from: four fields to a row leave each cell narrower than a select's
    /// own floor, and the selects give way to the cell.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = SelectExamplesController.RosterKey,
                Label = "Roster",
                Width = UILayoutLength.Absolute(820),
                // A dialog is a sample as a whole, its copy shown as written: content for the unkeyed report.
                Content = UILayout.Stack(16)
                    .AsContentTree()
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Edit the roster card")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Two people on the incident rota, each a row of four fields.")
                    )
                    .AddChild(CreateRosterRow("robin", "platform", 32, true))
                    .AddChild(CreateRosterRow("sam", "billing", 16, false))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("Done")
                        .SetHorizontalAlignment(UIAlignment.End)
                        .OnClick(nameof(SelectExamplesController.CloseRoster))
                    )
            }
        ];

    /// <summary>One person's row: two selects, a number and a switch, in four equal cells.</summary>
    private static ContainerComponent CreateRosterRow(string person, string team, decimal hours, bool onCall)
        => UIForm.Row(
            new SelectComponent()
                .SetTitle("Engineer")
                .SetHelp("Who is paged first when the rota reaches this row.")
                .SetOptions(Engineers())
                .SetValue(person),
            new SelectComponent()
                .SetTitle("Team")
                .SetHelp("Whose services the engineer answers for.")
                .SetOptions(
                [
                    new OptionItem { Id = "platform", Title = "Platform infrastructure" },
                    new OptionItem { Id = "billing", Title = "Billing and invoicing" }
                ])
                .SetValue(team),
            new NumberInputComponent()
                .SetTitle("Hours a week")
                .SetHelp("Counted against the rota's cap.")
                .SetRange(0, 60)
                .SetValue(hours),
            new SwitchComponent()
                .SetTitle("On call")
                .SetValue(onCall)
        );

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreatePlainGroup(), CreateHelpGroup(), CreateNarrowGroup()], [CreateRichGroup(), CreatePlacementGroup(), CreatePhraseGroup()]));

        _ = container.AddChild(CreateTemplateGroup());
    }

    /// <summary>
    /// The caption's badge as a help mark says what the choice is for, as its tooltip; the caption stays one line with it.
    /// </summary>
    private static ContainerComponent CreateHelpGroup()
    {
        return DemoUI.CreateExample("A help badge on the caption",
            UILayout.Stack(12)
                .AddChild(new SelectComponent()
                    .SetTitle("Region")
                    .SetHelp("Where the server runs; moving it later takes a snapshot and a restore.")
                    .SetOptions(RegionOptions())
                    .SetValue("eu-central")
                    .Required("A server runs somewhere.", UIValidationTrigger.Submit)
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Maintenance window")
                    .SetHelp("Resizes and kernel updates wait for it; an incident does not. Times are in UTC.")
                    .SetOptions(
                    [
                        new OptionItem { Id = "night", Title = "Sundays, 02:00–04:00" },
                        new OptionItem { Id = "morning", Title = "Tuesdays, 06:00–08:00" }
                    ])
                    .SetValue("night")
                ),
            note: "The badge is a stop of its own, named by its words; hover, press or tab to it. A caption inside the box makes it no stop, since the box is one control."
        );
    }

    /// <summary>The ordinary case: a name per option, headed by the group each belongs to.</summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateExample("A list of names",
            UILayout.Stack(12)
                .AddChild(new SelectComponent()
                    .SetTitle("Region")
                    .SetPlaceholder("Pick a region")
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west")
                    .SetShowClearButton()
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetPlaceholder("Pick a region")
                    .SetOptions(RegionOptions())
                )
        );
    }

    /// <summary>
    /// A select at the far end of a row opens its list from its own end edge, so the list grows back over the row rather than off it;
    /// a list wider than the field keeps its options whole.
    /// </summary>
    private static ContainerComponent CreatePlacementGroup()
    {
        return DemoUI.CreateExample("Where the list opens",
            UILayout.Stack(12)
                .AddChild(new SelectComponent()
                    .SetTitle("From the end edge")
                    .SetPopupPlacement(UIPopupPlacement.BottomEnd)
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west")
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetHorizontalAlignment(UIAlignment.End)
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Small, above")
                    .SetSize(UIInputSize.Small)
                    .SetPopupPlacement(UIPopupPlacement.TopStart)
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west")
                    .SetWidth(UILayoutLength.Absolute(120))
                )
        );
    }

    /// <summary>
    /// The same control over options carrying every text surface, with no template of its own.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateExample("An option with more than a name",
            UILayout.Stack(12)
                .AddChild(new SelectComponent()
                    .SetTitle("Target environment")
                    .SetPlaceholder("Pick an environment")
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("prod")
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("The trigger shows the chosen option through the list's own template — icon, second line and badge included."))
        );
    }

    /// <summary>
    /// A template of the author's own: it binds the same item properties through <c>BindText</c> and then says how a row is drawn.
    /// </summary>
    /// <remarks>A literal here wins wherever the item says nothing, and a template of your own starts from a bare <c>TextComponent</c>.</remarks>
    private static ContainerComponent CreateTemplateGroup()
    {
        return DemoUI.CreateExample("A template of your own",
            UILayout.Row(32)
                .AddChild(UIPage.Labelled("The default row, over the same options", new SelectComponent()
                    .SetTitle("On call")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an engineer")
                    .SetOptions(Engineers())
                    .SetValue("robin")
                    )
                )
                .AddChild(UIPage.Labelled("A template of your own", new SelectComponent()
                    .SetTitle("On call")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an engineer")
                    .SetTemplate(new TextComponent()
                        .BindText()
                        .SetIconSize(UIIconSize.Large)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                    .SetOptions(Engineers())
                    .SetValue("robin")
                    )
                ),
            columns: 24,
            note: "Side by side, because the template only reads as a choice against the row it replaces — a larger glyph, the second line quietened, the badge moved to the far end."
        );
    }

    /// <summary>
    /// A select in a cell narrower than its own floor gives way to the cell, its value cut with an ellipsis, rather than running over
    /// the next field; a dialog of four fields to a row is where that happens.
    /// </summary>
    private static ContainerComponent CreateNarrowGroup()
    {
        return DemoUI.CreateExample("Four fields to a row",
            UILayout.Stack(12)
                .AddChild(CreateRosterRow("alex", "platform", 40, true))
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Open the roster card")
                    .OnClick(nameof(SelectExamplesController.OpenRoster))
                ),
            note: "`UIForm.Row(select, select, number, switch)`: each select's floor is 12rem or its cell, whichever is less, so neither covers its neighbour's help badge. The dialog is 820px wide, the width the row first broke at."
        );
    }

    /// <summary>
    /// Words that are phrases: a heading with a count, and options whose titles carry a city and a count, each written in the page's
    /// language and its plural form.
    /// </summary>
    private static ContainerComponent CreatePhraseGroup()
    {
        return DemoUI.CreateExample("Options that are phrases",
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
            note: "Switch the language in the header: the heading, the caption, every option and the closed trigger are written again, each count in its language's plural form (1 server, 3 servers; in Russian 1 сервер, 3 сервера, 5 серверов)."
        );
    }

    private static OptionItem[] RegionOptions()
        => [
            new() { Id = "eu-west", Title = "Amsterdam", Group = "Europe" },
            new() { Id = "eu-central", Title = "Frankfurt", Group = "Europe" },
            new() { Id = "us-east", Title = "Ashburn", Group = "Americas" },
            new() { Id = "ap-south", Title = "Singapore", Group = "Asia Pacific" }
        ];

    private static OptionItem[] Engineers()
        => [
            new() { Id = "robin", Icon = DemoIcons.UserRound, Title = "Robin", Description = "Admin · until 18:00" },
            new() { Id = "sam", Icon = DemoIcons.UserRound, Title = "Sam", Description = "Owner · until 22:00" },
            new() { Id = "alex", Icon = DemoIcons.UserRound, Title = "Alex", Description = "Admin · night shift" }
        ];
}
