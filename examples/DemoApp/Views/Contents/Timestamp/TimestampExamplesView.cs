using System;
using System.Collections.Generic;
using DemoApp.Controllers.Contents.Timestamp;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Timestamp;

/// <summary>
/// A moment where the panel shows one: the four formats of a value the controller stamps, a feed kept current, and the quiet line
/// under a record.
/// </summary>
internal sealed class TimestampExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string StampGroup = nameof(TimestampExamplesController.StampGroup);
    private const string ActivityGroup = nameof(TimestampExamplesController.ActivityGroup);

    private static readonly DateTimeOffset Opened = new(2026, 9, 30, 9, 14, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset Resolved = new(2026, 9, 30, 11, 2, 0, TimeSpan.Zero);

    public static string ViewKey => "demo.contents.timestamp.examples";

    protected override string ComponentRoute => "/contents/timestamp";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.timestamp.header";
    protected override string HeaderDescription => "demo.contents.timestamp.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateStampGroup(), CreateRecordGroup()], [CreateFeedGroup()]));

    /// <summary>
    /// One value of the controller's, written four ways; a press stamps it again and every one follows.
    /// </summary>
    private static ContainerComponent CreateStampGroup()
    {
        return DemoUI.CreateExample("One moment, four ways",
            UILayout.Stack(12)
                .AddChild(UIPage.Labelled("DateTime", new TimestampComponent()
                    .BindValue(nameof(StampGroupContext.Moment), UIBindingScope.Relative)
                    )
                )
                .AddChild(UIPage.Labelled("Date", new TimestampComponent()
                    .SetFormat(UITimestampFormat.Date)
                    .BindValue(nameof(StampGroupContext.Moment), UIBindingScope.Relative)
                    )
                )
                .AddChild(UIPage.Labelled("Time", new TimestampComponent()
                    .SetFormat(UITimestampFormat.Time)
                    .BindValue(nameof(StampGroupContext.Moment), UIBindingScope.Relative)
                    )
                )
                .AddChild(UIPage.Labelled("Relative", new TimestampComponent()
                    .SetFormat(UITimestampFormat.Relative)
                    .BindValue(nameof(StampGroupContext.Moment), UIBindingScope.Relative)
                    )
                ),
            note: "The page writes each in your own time zone and language, and the relative one again every fifteen seconds: it opens on \"5 minutes ago\" and moves on by itself. Stamp now, or switch the language in the header, and all four follow.",
            context: StampGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Stamp now"] = nameof(TimestampExamplesController.StampNow)
            })
        );
    }

    /// <summary>
    /// A feed: each row says what happened and how long ago, a coming expiry included, read off the controller's rows.
    /// </summary>
    private static ContainerComponent CreateFeedGroup()
    {
        return DemoUI.CreateExample("What happened, and when",
            new ItemsViewComponent()
                .BindItems(nameof(ActivityGroupContext.Entries), UIBindingScope.Relative)
                .SetSpacing(12)
                .SetTemplate(UILayout.Split(
                    new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted),
                    new TimestampComponent()
                        .SetFormat(UITimestampFormat.Relative)
                        .BindValue(nameof(DemoActivityItem.At), UIBindingScope.Relative)
                        .SetTextType(UITextAppearance.Caption)
                        .SetColor(UIThemeColor.Muted)
                        .SetHorizontalAlignment(UIAlignment.End)
                        .SetVerticalAlignment(UIAlignment.Start),
                    sideSpan: 6,
                    spacing: 12
                    )
                ),
            note: "A moment ahead reads as one: the certificate expires \"in 3 days\".",
            context: ActivityGroup
        );
    }

    /// <summary>
    /// The quiet line under a record: fixed moments, small and muted, one with its full date in a tooltip.
    /// </summary>
    private static ContainerComponent CreateRecordGroup()
    {
        return DemoUI.CreateExample("Under a record",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Alert)
                    .SetTitle("Slow API in Europe West")
                    .SetDescription("A full database disk on db-eu-west-2; the follow-ups are in the incident report.")
                )
                .SetContent(UILayout.Stack(8)
                    .AddChild(UILayout.Row(8)
                        .AddChild(new TextComponent()
                            .SetTitle("Opened")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new TimestampComponent()
                            .SetValue(Opened)
                            .SetTextType(UITextAppearance.Caption)
                        )
                    )
                    .AddChild(UILayout.Row(8)
                        .AddChild(new TextComponent()
                            .SetTitle("Resolved")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new TimestampComponent()
                            .SetValue(Resolved)
                            .SetFormat(UITimestampFormat.Time)
                            .SetTextType(UITextAppearance.Caption)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                            .SetTooltip("The health check was green again from here.")
                        )
                    )
                    .AddChild(UILayout.Row(8)
                        .AddChild(new TextComponent()
                            .SetTitle("Report due")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new TimestampComponent()
                            .SetValue(Resolved.AddDays(2))
                            .SetFormat(UITimestampFormat.Date)
                            .SetTextType(UITextAppearance.Caption)
                        )
                    )
                ),
            note: "Fixed moments in UTC, each shown where you are: the incident opened at 09:14 UTC, whatever your clock says it was."
        );
    }
}
