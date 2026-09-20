using System.Collections.Generic;
using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>
/// A page that is read: a label, a display title, a byline, running text with a quotation and inline marks, a list of
/// changes, the tags, the two buttons a reader is offered, a box to subscribe from, and the way to the neighbours.
/// </summary>
internal sealed class ArticleView : DemoScreenView, IUIViewDefinition
{
    private const string SubscribeFormId = "article-subscribe";

    public static string ViewKey => "demo.screens.article";

    protected override string ComponentRoute => "/screens/article";
    protected override string Header => "demo.screens.article.header";
    protected override string HeaderDescription => "demo.screens.article.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(20,
            CreateMasthead(),
            UIText.Paragraph("For years a release meant a window: a banner the day before, a quiet hour after midnight, and a room of people watching a progress bar. Release 482 went out at twenty to ten on a Thursday morning, and the only person who noticed was the one who pressed the button."),
            UIText.Title("Why a window at all"),
            UIText.Paragraph("A window buys two things: a moment when nobody is using the thing, and permission to break it briefly. The first was never true — a service with users in three time zones has no quiet hour — and the second is the habit worth losing. If a release can break the service, the fix is not to schedule the breakage."),
            UIText.Paragraph("The rollout pauses itself if the error rate doubles in any region, and steps back on its own if the p99 crosses the gate. Nobody has to be watching, because the thing that is watching does not get bored.")
                .SetShowQuoteLine(true),
            UIText.Title("What we changed"),
            CreateChanges(),
            UIText.Paragraph("None of this is new — the pattern is described in [the rollout plan](https://example.com/docs/rollout) and in half the SRE books on the shelf. What was new for us was **doing all four at once**, and then *not* keeping the window as a comfort. The first release without one felt reckless. The fifth felt like Thursday."),
            new SeparatorComponent().SetLabel("Tags"),
            UILayout.Row(8, CreateTag("Deploys"), CreateTag("Reliability"), CreateTag("Platform")),
            CreateVote(),
            CreateSubscribe(),
            CreateNeighbours()
        )
        .SetMaxWidth(UILayoutLength.Absolute(720))
        .SetPadding(UIThickness.All(0, 8, 0, 24))
        .SetPlacement(1, 1, 24, 1);

    /// <summary>The label, the title, the byline: what a reader takes in before the first paragraph.</summary>
    private static StackPanelComponent CreateMasthead()
        => UILayout.Stack(12,
            UIText.Label("Engineering · 11 September 2026"),
            UIText.Display("Rolling out a release without a maintenance window"),
            UILayout.Row(12,
                new ImageComponent()
                    .SetSource(DemoImages.Avatar)
                    .SetAltText("Robin Hale")
                    .SetFit(UIImageFit.Cover)
                    .SetCornerRadius(UICornerRadius.Uniform(18))
                    .SetWidth(UILayoutLength.Absolute(36))
                    .SetHeight(UILayoutLength.Absolute(36)),
                UIText.Body("Robin Hale", "Platform team · six minutes to read")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetVerticalAlignment(UIAlignment.Center)
            )
        );

    /// <summary>A list that is read, not operated: one line each, a mark at the start, no selection.</summary>
    private static ItemsViewComponent CreateChanges()
        => new ItemsViewComponent()
            .SetItems(
            [
                Change("gate", "A health gate of ten minutes", "The rollout waits, and the wait is the whole of the ceremony."),
                Change("regions", "One region at a time", "A fault stays where it started, and the other two regions carry the load."),
                Change("rollback", "A rollback that needs nobody", "The p99 crossing the gate is the trigger; a person is only told afterwards."),
                Change("index", "The index rebuild off the deploy path", "What paged us on 481 now runs on its own schedule, hours away from a release.")
            ])
            .SetSpacing(8)
            .SetTemplate(new TextComponent()
                .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                .SetIconColor(UIThemeColor.Success)
                .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                .SetDescriptionColor(UIThemeColor.Muted)
            );

    private static TextItem Change(string id, string title, string description)
        => new() { Id = id, Icon = DemoIcons.Outline(DemoIcons.Check), Title = title, Description = description };

    private static BadgeComponent CreateTag(string tag)
        => new BadgeComponent().SetType(UIBadgeType.Surface).SetText(tag);

    /// <summary>The question at the foot, and the answer that replaces it.</summary>
    private static SurfaceComponent CreateVote()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(UILayout.Columns(16,
                UIText.Body(string.Empty).BindTitle(nameof(ArticleController.VoteLine)).SetVerticalAlignment(UIAlignment.Center),
                UIButtons.Toolbar(
                    UIButtons.Secondary("Yes").OnClickLiteral(nameof(ArticleController.Vote), new KeyValuePair<string, object?>("answer", "yes")),
                    UIButtons.Ghost("Not really").OnClickLiteral(nameof(ArticleController.Vote), new KeyValuePair<string, object?>("answer", "no"))
                )
                .SetHorizontalAlignment(UIAlignment.End)
            ));

    /// <summary>One field and one button, with the rules a real box has: a shape checked on blur, a taken address refused.</summary>
    private static CardComponent CreateSubscribe()
        => UIPage.Card("Get the next one by mail", "One note a month, on what the platform team learned.", UILayout.Columns(12,
            new TextInputComponent()
                .SetPlaceholder("you@company.com")
                .SetType(UITextInputType.Email)
                .SetAutocomplete(UIAutocomplete.Email)
                .SetAppearance(UIInputAppearance.Outline)
                .SetFormId(SubscribeFormId)
                .BindValue(nameof(ArticleController.SubscriberEmail))
                .BindValidation(nameof(ArticleController.SubscriberNotice))
                .Required("An address, so the note has somewhere to go.", UIValidationTrigger.Submit)
                .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
            UIButtons.Primary("Subscribe", DemoIcons.Outline(DemoIcons.Send))
                .SetHorizontalAlignment(UIAlignment.Start)
                .OnSubmit(SubscribeFormId, nameof(ArticleController.Subscribe))
        ), DemoIcons.Outline(DemoIcons.Mail));

    /// <summary>The neighbours: links, since they only go somewhere.</summary>
    private static ContainerComponent CreateNeighbours()
        => UILayout.Columns(16,
            new LinkComponent().SetIcon(DemoIcons.Outline(DemoIcons.ChevronRight)).SetTitle("The deploy calendar, and why it is on a wall").SetUrl("/screens/inbox"),
            new LinkComponent().SetTitle("Retries with jitter").SetIcon(DemoIcons.Outline(DemoIcons.ArrowRight)).SetUrl("/screens/catalogue").SetHorizontalAlignment(UIAlignment.End)
        );
}
