using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Accordion;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Accordion;

/// <summary>
/// One accordion and every property that can be bound to it; then the jobs it is given: a thing's facts one at a time, sections
/// whose headers say what is inside, and a task set up in steps.
/// </summary>
/// <remarks>
/// The sections are expanders, each with its own page; what the accordion adds is the rule that opening one closes the others, kept on
/// the page, and the shared edges that make them one block.
/// </remarks>
internal sealed class AccordionView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string AccordionGroup = nameof(AccordionController.AccordionGroup);
    private const string BorderGroup = nameof(AccordionController.BorderGroup);
    private const string StepsGroup = nameof(AccordionController.StepsGroup);

    public static string ViewKey => "demo.layouts.accordion";

    protected override string ComponentRoute => "/layouts/accordion";
    protected override string Header => "demo.layouts.accordion.header";
    protected override string HeaderDescription => "demo.layouts.accordion.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new AccordionComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindPadding($"{AccordionGroup}.{nameof(AccordionSurfaceGroupContext.Padding)}")
            .BindBackground($"{AccordionGroup}.{nameof(AccordionSurfaceGroupContext.Background)}")
            .BindOverflow($"{AccordionGroup}.{nameof(AccordionSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            // Set rather than bound: the sections are what the accordion holds, not something about it.
            .AddChild(new ExpanderComponent()
                .SetExpanded(true)
                .ConfigureDefaultHeader(header => header.SetTitle("Network"))
                .SetContent(new ParagraphComponent()
                    .SetDescription("A public address in eu-west and a private one on the customer's network; 1 Gbit/s, 5 TB of traffic a month included.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
            )
            .AddChild(new ExpanderComponent()
                .SetExpanded(false)
                .ConfigureDefaultHeader(header => header.SetTitle("Firewall"))
                .SetContent(new ParagraphComponent()
                    .SetDescription("Four rules: HTTPS from anywhere, SSH from the office only, the database port from the API servers, nothing else in.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
            )
            .AddChild(new ExpanderComponent()
                .SetExpanded(false)
                .ConfigureDefaultHeader(header => header.SetTitle("Monitoring"))
                .SetContent(new ParagraphComponent()
                    .SetDescription("A health check every 30 seconds; three failures in a row page whoever is on call.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetWrapMode(UITextWrapMode.Wrap)
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(AccordionGroup, "Accordion", nameof(AccordionController.CycleAccordionOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(AccordionController.CycleBorderOption))
        );

    // The two read-only ones side by side; the steps across the page, with their line under them.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateOneOpenGroup()], [CreateSummaryGroup()]), CreateStepsGroup()];

    /// <summary>
    /// The plain case: a server's facts, each a section, the one being read open and the rest closed by it.
    /// </summary>
    private static ContainerComponent CreateOneOpenGroup()
    {
        return DemoUI.CreateExample("One open at a time",
            new AccordionComponent()
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(header => header.SetTitle("Disk"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("80 GB on the Standard plan, replicated once within the region.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header.SetTitle("Plan"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Standard: 2 vCPU and 4 GB of memory, €18 a month for each seat.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header.SetTitle("Snapshots"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Kept for 30 days; restoring one over a running server needs an admin.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                ),
            note: "Open another section and the open one closes, on the page with no round trip: the sections are expanders, and the rule is the accordion's. Closing the open one leaves none open."
        );
    }

    /// <summary>
    /// Headers that carry a line and a badge, so a closed section still says what is in it and which one needs reading.
    /// </summary>
    private static ContainerComponent CreateSummaryGroup()
    {
        return DemoUI.CreateExample("Headers that say what is inside",
            new AccordionComponent()
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Outline(DemoIcons.FileText))
                        .SetTitle("Billing")
                        .SetDescription("The September invoice is 14 days overdue")
                        .SetBadgeText("Past due")
                        .SetBadgeStyle(UIBadgeType.Warning)
                    )
                    .SetContent(UIDetails.List(("Invoice", "September, SUB-000003"), ("Amount", "€464.64 with VAT"), ("Reminder", "Sent on 8 October")))
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Outline(DemoIcons.Server))
                        .SetTitle("Servers")
                        .SetDescription("Pro, all in eu-west")
                        .SetBadgeText("6 running")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(UIDetails.List(("api", "2 servers"), ("web", "2 servers"), ("db", "2 servers")))
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Outline(DemoIcons.Groups))
                        .SetTitle("Access")
                        .SetDescription("Who at the customer may sign in")
                        .SetBadgeText("3 people")
                        .SetBadgeStyle(UIBadgeType.Surface)
                    )
                    .SetContent(UIDetails.List(("Owner", "ops@bramble.example"), ("Billing", "accounts@bramble.example"), ("Viewer", "studio@bramble.example")))
                ),
            note: "Bramble Studio's account, one section a subject. Each header's line and badge say what is inside while it is closed, so the one that needs reading is found without opening the others."
        );
    }

    /// <summary>
    /// A task set up in steps: each section's <c>Expanded</c> is bound, Next opens the following one from the controller, and a header
    /// pressed to go back writes its section back.
    /// </summary>
    private static ContainerComponent CreateStepsGroup()
    {
        return DemoUI.CreateExample("A release set up in steps",
            new AccordionComponent()
                .SetWidth(UILayoutLength.Absolute(480))
                .SetMaxWidth(UILayoutLength.Fill())
                .AddChild(new ExpanderComponent()
                    .BindExpanded(nameof(ReleaseStepsGroupContext.ImageOpen), UIBindingScope.Relative)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("1 · Image")
                        .SetDescription("billing:2.5.0")
                    )
                    .SetContent(UILayout.Stack(12)
                        .AddChild(new SelectComponent()
                            .SetTitle("Image")
                            .SetOptions(
                            [
                                new OptionItem { Id = "billing:2.5.0", Title = "billing:2.5.0 · built today" },
                                new OptionItem { Id = "billing:2.4.1", Title = "billing:2.4.1 · running now" }
                            ])
                            .SetValue("billing:2.5.0")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(AccordionController.OpenRegions))
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetHorizontalAlignment(UIAlignment.Start)
                            .SetTitle("Next")
                        )
                    )
                )
                .AddChild(new ExpanderComponent()
                    .BindExpanded(nameof(ReleaseStepsGroupContext.RegionsOpen), UIBindingScope.Relative)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("2 · Regions")
                        .SetDescription("Three of five")
                    )
                    .SetContent(UILayout.Stack(12)
                        .AddChild(new CheckboxComponent().SetTitle("Europe West").SetValue(true))
                        .AddChild(new CheckboxComponent().SetTitle("Europe Central").SetValue(true))
                        .AddChild(new CheckboxComponent().SetTitle("US East").SetValue(true))
                        .AddChild(new CheckboxComponent().SetTitle("Europe North"))
                        .AddChild(new CheckboxComponent().SetTitle("Asia South"))
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(AccordionController.OpenWindow))
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetHorizontalAlignment(UIAlignment.Start)
                            .SetTitle("Next")
                        )
                    )
                )
                .AddChild(new ExpanderComponent()
                    .BindExpanded(nameof(ReleaseStepsGroupContext.WindowOpen), UIBindingScope.Relative)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("3 · Window")
                        .SetDescription("Tonight, 02:00 UTC")
                    )
                    .SetContent(UILayout.Stack(12)
                        .AddChild(new SelectComponent()
                            .SetTitle("Release window")
                            .SetOptions(
                            [
                                new OptionItem { Id = "tonight", Title = "Tonight, 02:00–04:00 UTC" },
                                new OptionItem { Id = "saturday", Title = "Saturday, 02:00–04:00 UTC" }
                            ])
                            .SetValue("tonight")
                        )
                        .AddChild(new ButtonComponent()
                            .OnClick(nameof(AccordionController.ScheduleRelease))
                            .SetType(UIButtonType.Primary)
                            .SetSize(UIButtonSize.Small)
                            .SetHorizontalAlignment(UIAlignment.Start)
                            .SetTitle("Schedule the release")
                        )
                    )
                ),
            columns: 24,
            note: "Each section's Expanded is bound. Next closes its step and opens the following one from the controller; a header pressed to go back opens its own step, the accordion closes the rest on the page, and every section writes its state back.",
            context: StepsGroup
        );
    }
}
