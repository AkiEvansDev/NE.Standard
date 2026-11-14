using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Choices.Select;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Choices.Select;

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
    private const string LabelGroup = nameof(SelectController.LabelGroup);
    private const string BorderGroup = nameof(SelectController.BorderGroup);
    private const string ActionRegionId = "demo-select-action-region";

    public static string ViewKey => "demo.choices.select";

    protected override string ComponentRoute => "/choices/select";
    protected override string Header => "demo.choices.select.header";
    protected override string HeaderDescription => "demo.choices.select.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SelectComponent()
            .BindStandard()
            .BindItems<SelectController>(static x => x.OptionsGroup.Options)
            .BindValue<SelectController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<SelectController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<SelectController>(static x => x.FieldGroup.Size)
            .BindAppearance<SelectController>(static x => x.FieldGroup.Appearance)
            .BindPlaceholder<SelectController>(static x => x.FieldGroup.Placeholder)
            .BindPrefixIcon<SelectController>(static x => x.FieldGroup.PrefixIcon)
            .BindSuffixIcon<SelectController>(static x => x.FieldGroup.SuffixIcon)
            .BindShowClearButton<SelectController>(static x => x.FieldGroup.ShowClearButton)
            .BindShowChevron<SelectController>(static x => x.FieldGroup.ShowChevron)
            .BindLabel(LabelGroup)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(OptionsGroup, "Options"),
            DemoUI.CreateOptionSection(LabelGroup, "Label"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
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
                AccessibleName = "Roster",
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
                        .SetVariant(UIButtonVariant.Primary)
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
        // Paired by height: the plain lists and field actions beside the placements and rich fields, the crowded row below.
        => DemoUI.CreateColumns([CreatePlainGroup(), CreateActionsGroup(), CreateNarrowGroup()], [CreatePlacementGroup(), CreateRichGroup()]);

    /// <summary>The ordinary case: a name per option, headed by the group each belongs to.</summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateExample("Grouped options & clear button",
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
    /// In-field leading and trailing action buttons and button-anchored flyouts inside the select trigger, behind a divider after the chevron.
    /// </summary>
    private static ContainerComponent CreateActionsGroup()
    {
        return DemoUI.CreateExample("Leading & trailing actions",
            UILayout.Stack(12)
                .AddChild(new SelectComponent(ActionRegionId)
                    .SetTitle("Primary region")
                    .SetPlaceholder("Pick a region")
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west")
                    .SetShowClearButton()
                    .AddLeadingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Refresh regions")
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTooltip("Copy region ID")
                        .InteractOn(EventNames.Click, CopyToClipboardEffect.ValueOf(ActionRegionId))
                    )
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Environment with details flyout")
                    .SetPlaceholder("Pick an environment")
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("prod")
                    .SetTrailingAction(new FlyoutComponent()
                        .SetPopupPlacement(UIPopupPlacement.BottomEnd)
                        .SetAnchor(new ButtonComponent()
                            .SetVariant(UIButtonVariant.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Shield))
                            .SetTooltip("Environment details")
                        )
                        .SetContent(new ParagraphComponent()
                            .SetWidth(UILayoutLength.Absolute(240))
                            .SetTitle("Production")
                            .SetTitleType(UITextAppearance.Subtitle)
                            .SetDescription("Deploys require two approvals and run a 10-minute canary before full rollout.")
                        )
                    )
                ),
            note: "`AddLeadingAction`, `AddTrailingAction` and `SetTrailingAction` place buttons or button-anchored `FlyoutComponent`s inside the trigger, with trailing actions separated from the clear and chevron by a divider, without toggling the dropdown when clicked."
        );
    }

    /// <summary>
    /// A select in a cell narrower than its own floor gives way to the cell, its value cut with an ellipsis, rather than running over
    /// the next field; a dialog of four fields to a row is where that happens.
    /// </summary>
    private static ContainerComponent CreateNarrowGroup()
    {
        return DemoUI.CreateExample("Compact multi-column form row",
            UILayout.Stack(12)
                .AddChild(CreateRosterRow("alex", "platform", 40, true))
                .AddChild(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Open the roster card")
                    .InteractOn(EventNames.Click, new OpenDialogEffect(SelectController.RosterKey))
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
        return DemoUI.CreateExample("Popup placement",
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
                    .SetSize(UISize.Small)
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
        return DemoUI.CreateExample("Rich options & custom item template",
            UILayout.Stack(16)
                .AddChild(DemoUI.CreateLabelled("The default row — glyph, second line and badge", new SelectComponent()
                    .SetTitle("Target environment")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an environment")
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("prod")
                    .SetShowClearButton()
                    )
                )
                .AddChild(DemoUI.CreateLabelled("A template of your own, over the same options", new SelectComponent()
                    .SetTitle("Target environment")
                    .SetWidth(UILayoutLength.Absolute(320))
                    .SetPlaceholder("Pick an environment")
                    .SetTemplate(new TextComponent()
                        .BindText()
                        .SetIconSize(UISize.Large)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetIconAlignment(UITextIconAlignment.Content)
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                        .SetBadgeAlignment(UITextBadgeAlignment.Content)
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
