using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.Select;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// One dropdown and every property that can be bound to it; then a list of names, where the list opens, options that carry more than a name, and a row too narrow for its selects.
/// </summary>
/// <remarks>The options are a bound collection, so the Options section moves the list rather than stepping a value. A help badge on the caption is shown once, on the text input's page.</remarks>
internal sealed class SelectView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(SelectController.ValueGroup);
    private const string FieldGroup = nameof(SelectController.FieldGroup);
    private const string OptionsGroup = nameof(SelectController.OptionsGroup);
    private const string ContentGroup = nameof(SelectController.ContentGroup);
    private const string BadgeGroup = nameof(SelectController.BadgeGroup);
    private const string BorderGroup = nameof(SelectController.BorderGroup);

    public static string ViewKey => "demo.inputs.select";

    protected override string ComponentRoute => "/inputs/select";
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SelectComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindItems($"{OptionsGroup}.{nameof(OptionListGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(OptionValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(OptionValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(OptionValueGroupContext.Size)}")
            .BindAppearance($"{FieldGroup}.{nameof(SelectFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(SelectFieldGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(SelectFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(SelectFieldGroupContext.SuffixIcon)}")
            .BindShowClearButton($"{FieldGroup}.{nameof(SelectFieldGroupContext.ShowClearButton)}")
            .BindShowChevron($"{FieldGroup}.{nameof(SelectFieldGroupContext.ShowChevron)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(SelectController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(SelectController.CycleFieldOption)),
            DemoUI.CreateOptionSection(OptionsGroup, "Options", nameof(SelectController.CycleOptionsOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(SelectController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(SelectController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SelectController.CycleBorderOption))
        );

    /// <summary>
    /// The roster card's dialog: four fields to a row leave each cell narrower than a select's own floor, and the selects give way
    /// to the cell.
    /// </summary>
    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => [
            new UIDialog
            {
                Key = SelectController.RosterKey,
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
                        .OnClick(nameof(SelectController.CloseRoster))
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

    protected override IVisualComponent[] CreateExamples()
        // Paired by height: the plain lists beside the placements, the crowded row beside the two rich fields.
        => DemoUI.CreateColumns([CreatePlainGroup(), CreateNarrowGroup()], [CreatePlacementGroup(), CreateRichGroup()]);

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
                    .OnClick(nameof(SelectController.OpenRoster))
                ),
            note: "`UIForm.Row(select, select, number, switch)`: each select's floor is 12rem or its cell, whichever is less, so neither covers its neighbour's help badge. The card opens the same rows in an 820px dialog, two of them."
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
    /// Options carrying every text surface, drawn by the default row and then by a template of the author's own, which binds the same
    /// item properties through <c>BindText</c> and then says how a row is drawn.
    /// </summary>
    /// <remarks>A literal in the template wins wherever the item says nothing; a template of your own starts from a bare <c>TextComponent</c>.</remarks>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateExample("An option with more than a name",
            UILayout.Stack(16)
                .AddChild(UIPage.Labelled("The default row — glyph, second line and badge", new SelectComponent()
                    .SetTitle("Target environment")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an environment")
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("prod")
                    .SetShowClearButton()
                    )
                )
                .AddChild(UIPage.Labelled("A template of your own, over the same options", new SelectComponent()
                    .SetTitle("Target environment")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an environment")
                    .SetTemplate(new TextComponent()
                        .BindText()
                        .SetIconSize(UIIconSize.Large)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("prod")
                    )
                ),
            note: "The closed field draws the chosen option through the list's own template, so it stays whole. One over the other at one width, because the template only reads as a choice against the row it replaces — a larger glyph, the second line quietened, the badge moved to the far end."
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
