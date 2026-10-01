using System;
using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Timestamp;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Timestamp;

/// <summary>
/// One timestamp and every property that can be bound to it; then a moment where the panel shows one: the five formats of a value
/// the controller stamps, a feed kept current, and the quiet line under a record.
/// </summary>
/// <remarks>
/// The page writes the moment in the reader's zone and language; the server's first paint is UTC and says so. A moment standing in
/// words is the Words page's.
/// </remarks>
internal sealed class TimestampView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TimestampGroup = nameof(TimestampController.TimestampGroup);
    private const string StampGroup = nameof(TimestampController.StampGroup);
    private const string ActivityGroup = nameof(TimestampController.ActivityGroup);
    private static readonly DateTimeOffset Opened = new(2026, 9, 30, 9, 14, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset Resolved = new(2026, 9, 30, 11, 2, 0, TimeSpan.Zero);

    public static string ViewKey => "demo.contents.timestamp";

    protected override string ComponentRoute => "/contents/timestamp";
    protected override string Header => "demo.contents.timestamp.header";
    protected override string HeaderDescription => "demo.contents.timestamp.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/words", "demo.nav.mechanisms.words");

    // Format is read once at render, so each of the five is drawn, all bound to the one moment.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(440,
            ("DateTime — the day and the time of day", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.DateTime)))),
            ("Date — the day alone", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Date)))),
            ("Time — the time of day alone", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Time)))),
            ("Relative — how long ago, kept current", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Relative)))),
            ("RelativeDate — the day as a messenger heads it", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.RelativeDate))))
        );

    private static TimestampComponent Bind(TimestampComponent timestamp)
        => timestamp
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{TimestampGroup}.{nameof(TimestampGroupContext.Value)}")
            .BindTextType($"{TimestampGroup}.{nameof(TimestampGroupContext.TextType)}")
            .BindColor($"{TimestampGroup}.{nameof(TimestampGroupContext.Color)}")
            .BindTooltip($"{TimestampGroup}.{nameof(TimestampGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{TimestampGroup}.{nameof(TimestampGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TimestampGroup, "Timestamp", nameof(TimestampController.CycleTimestampOption), "Value steps through now, yesterday, in two hours, a fixed day, none and five minutes ago, each read at the press.")
        );

    protected override IVisualComponent[] CreateExamples()
        // The five ways beside the feed and the record stacked, as tall together: paired, the record stood alone in a row of its own.
        => [CreateStampGroup(), DemoUI.CreateHalf(CreateFeedGroup(), CreateRecordGroup())];

    /// <summary>
    /// One value of the controller's, written five ways; a press stamps it again and every one follows.
    /// </summary>
    private static ContainerComponent CreateStampGroup()
    {
        return DemoUI.CreateExample("One moment, five ways",
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
                )
                .AddChild(UIPage.Labelled("RelativeDate", new TimestampComponent()
                    .SetFormat(UITimestampFormat.RelativeDate)
                    .BindValue(nameof(StampGroupContext.Moment), UIBindingScope.Relative)
                    )
                ),
            note: "The page writes each in your own time zone and language, and the relative one again every fifteen seconds: it opens on \"5 minutes ago\" and moves on by itself. RelativeDate names the day as a messenger's day header does — \"Today\", \"Yesterday\", \"Tomorrow\", else the date. Stamp now, or switch the language in the header, and all five follow.",
            context: StampGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Stamp now"] = nameof(TimestampController.StampNow)
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
