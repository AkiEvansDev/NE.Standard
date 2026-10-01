using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Regions;

namespace DemoApp.Views.Layouts.Expander;

/// <summary>
/// One section and every property that can be bound to it; then the jobs a section is given: an answer nobody has asked for
/// yet, the settings most people leave alone, and contents that cost something to read.
/// </summary>
/// <remarks>
/// <c>Expanded</c> is two-way, so clicking the header moves the row as well as the other way round.
/// <see cref="AccordionComponent"/> lives here rather than on a page of its own, having no properties to list.
/// </remarks>
internal sealed class ExpanderView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ExpanderGroup = nameof(ExpanderController.ExpanderGroup);
    private const string HeaderGroup = nameof(ExpanderController.HeaderGroup);
    private const string HeaderTextGroup = nameof(ExpanderController.HeaderTextGroup);
    private const string HeaderBadgeGroup = nameof(ExpanderController.HeaderBadgeGroup);
    private const string BorderGroup = nameof(ExpanderController.BorderGroup);
    private const string LoadGroup = nameof(ExpanderController.LoadGroup);

    public static string ViewKey => "demo.layouts.expander";

    protected override string ComponentRoute => "/layouts/expander";
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ExpanderComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindExpanded($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Expanded)}")
            .BindShowChevron($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.ShowChevron)}")
            .BindSurface($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Surface)}")
            .BindPadding($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Padding)}")
            .BindBackground($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Background)}")
            .BindOverflow($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .ConfigureDefaultHeader(BindHeader)
            .SetContent(new ParagraphComponent()
                .SetDescription("Snapshots are kept for 30 days, replicated once within the region, and taken each night inside the backup window.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The header's own bindings; the chevron is bound on the expander, since it says what the expander does.
    /// </summary>
    private static void BindHeader(ExpanderHeaderRegion header)
        => _ = header
            .BindIcon($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindDescription($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTextAlignment($"{HeaderGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindBadgePlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ExpanderGroup, "Expander", nameof(ExpanderController.CycleExpanderOption)),
            DemoUI.CreateOptionSection(HeaderGroup, "Layout", nameof(ExpanderController.CycleHeaderOption)),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Content", nameof(ExpanderController.CycleHeaderTextOption)),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Badge", nameof(ExpanderController.CycleHeaderBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ExpanderController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateFaqGroup(), CreateAdvancedGroup()], [CreateAccordionGroup(), CreateLoadGroup()]);

    /// <summary>
    /// The plain case: the header is a native summary, so it opens and closes with the connection down.
    /// </summary>
    private static ContainerComponent CreateFaqGroup()
    {
        return DemoUI.CreateExample("Questions and answers",
            UILayout.Stack(8)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(header => header.SetTitle("Can I change plan later?"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Yes — move between Starter, Standard, Pro and Dedicated from the panel at any time; the next invoice is prorated to the day of the change.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header.SetTitle("Where is my data stored?"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("In the region the server was created in — Amsterdam, Frankfurt, Stockholm, Ashburn or Singapore. It never leaves that region unless you move it.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(header => header.SetTitle("How are backups kept?"))
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Every server is snapshotted each night, and the snapshots are kept in object storage in the same region for 30 days.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
        );
    }

    /// <summary>
    /// The part of a form nobody touches, closed down to one line of chrome.
    /// </summary>
    private static ContainerComponent CreateAdvancedGroup()
    {
        return DemoUI.CreateExample("The part of a form nobody touches",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("Billing")
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    // A caption rather than a title: between two fields, a heading would make it a form of its own.
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Sliders)
                        .SetTitle("Advanced")
                        .SetTitleType(UITextAppearance.Caption)
                    )
                    .SetContent(UILayout.Stack(12)
                        .AddChild(new NumberInputComponent()
                            .SetTitle("Request timeout")
                            .SetSuffixText("s")
                            .SetValue(30)
                        )
                        .AddChild(new CheckboxComponent()
                            .SetTitle("Retry on 5xx")
                            .SetValue(true)
                        )
                    )
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Save")
                )
        );
    }

    /// <summary>
    /// One rule on top of the same sections: opening one closes whichever sibling was open.
    /// </summary>
    private static ContainerComponent CreateAccordionGroup()
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
                )
        );
    }

    /// <summary>
    /// A section whose contents cost something to fetch: the first open goes to the server, later ones do not; and the two events
    /// an expander raises, one per gesture, with the section's two-way write-back landed before either command runs.
    /// </summary>
    private static ContainerComponent CreateLoadGroup()
    {
        return DemoUI.CreateExample("Read when it is first opened",
            UILayout.Stack(10)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .BindExpanded(nameof(ExpanderLoadGroupContext.Expanded), UIBindingScope.Relative)
                    .OnExpand(nameof(ExpanderController.LoadLogAsync))
                    .OnCollapse(nameof(ExpanderController.RecordCollapse))
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Provisioning log")
                        .SetDescription("A few hundred kilobytes nobody asked for yet")
                        .BindBadgeText(nameof(ExpanderLoadGroupContext.State), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(ExpanderLoadGroupContext.StateStyle), UIBindingScope.Relative)
                    )
                    // Loading sits on the content: on the expander it would cover the header saying which section is busy.
                    .SetContent(new ContainerComponent()
                        .BindLoading(nameof(ExpanderLoadGroupContext.Busy), UIBindingScope.Relative)
                        .SetMinHeight(UILayoutLength.Absolute(90))
                        .AddChild(new ParagraphComponent()
                            .BindDescription(nameof(ExpanderLoadGroupContext.Log), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetPlacement(1, 1, 24, 1)
                        )
                    )
                )
                .AddChild(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    // A paragraph: the trace grows past its column, and a text row would ellipsise the end of it.
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Last four events")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .BindDescription(nameof(ExpanderLoadGroupContext.Trace), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(ExpanderController.ClearTrace))
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                        .SetTooltip("Clear the trace")
                        .SetPlacement(24, 1, 1, 1)
                    )
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ExpanderController.ForgetLog))
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTitle("Forget it, so the next open reads again")
                ),
            note: "The contents cost a request: the first open goes to the server and every later one does not, so what arrives lands in a box the reader is already looking at. Opening raises Expand and closing raises Collapse — one command per press, and the state each reads is already the new one.",
            context: LoadGroup
        );
    }
}
