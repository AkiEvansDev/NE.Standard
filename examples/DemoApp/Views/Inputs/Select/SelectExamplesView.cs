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

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreatePlainGroup(), CreateHelpGroup()], [CreateRichGroup(), CreatePlacementGroup()]));

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
