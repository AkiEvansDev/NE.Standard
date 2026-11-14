using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Expander;

/// <summary>
/// One section and every property that can be bound to it; then the jobs a section is given: an answer nobody has asked for
/// yet, the settings most people leave alone, and contents that cost something to read.
/// </summary>
/// <remarks>
/// <c>Expanded</c> is two-way, so clicking the header moves the row as well as the other way round. Sections of which one is open at a
/// time are the accordion's page.
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
            .BindStandard()
            .BindExpanded<ExpanderController>(static x => x.ExpanderGroup.Expanded)
            .BindShowChevron<ExpanderController>(static x => x.ExpanderGroup.ShowChevron)
            .BindVariant<ExpanderController>(static x => x.ExpanderGroup.Variant)
            .BindSurface<ExpanderController>(static x => x.ExpanderGroup.Surface)
            .BindPadding<ExpanderController>(static x => x.ExpanderGroup.Padding)
            .BindBackground<ExpanderController>(static x => x.ExpanderGroup.Background)
            .BindOverflow<ExpanderController>(static x => x.ExpanderGroup.Overflow)
            .BindBorder(BorderGroup)
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
            .BindTextContent(HeaderTextGroup)
            .BindDescription<ExpanderController>(static x => x.HeaderTextGroup.Description)
            .BindDescriptionType<ExpanderController>(static x => x.HeaderTextGroup.DescriptionType)
            .BindDescriptionColor<ExpanderController>(static x => x.HeaderTextGroup.DescriptionColor)
            .BindTextAlignment<ExpanderController>(static x => x.HeaderGroup.TextAlignment)
            .BindRenamable<ExpanderController>(static x => x.HeaderGroup.Renamable)
            .BindRenamedTitle<ExpanderController>(static x => x.HeaderTextGroup.Title)
            .BindBadgePlacement<ExpanderController>(static x => x.HeaderBadgeGroup.BadgePlacement)
            .BindBadgeVariant<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeVariant)
            .BindBadgeColor<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeColor)
            .BindBadgeFill<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeFill)
            .BindBadgeIcon<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeIcon)
            .BindBadgeIconColor<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeIconColor)
            .BindBadgeIconSize<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeIconSize)
            .BindBadgeTitle<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeTitle)
            .BindBadgeTitleType<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeTitleType)
            .BindBadgeTooltip<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeTooltip)
            .BindBadgeTooltipPlacement<ExpanderController>(static x => x.HeaderBadgeGroup.BadgeTooltipPlacement);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ExpanderGroup, "Expander"),
            DemoUI.CreateOptionSection(HeaderGroup, "Header layout"),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Header content"),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Header badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    // The questions over the quiet fold, as tall together as the section read on its first open beside them.
    protected override IVisualComponent[] CreateExamples()
        => [DemoUI.CreateHalf(CreateFaqGroup(), CreateAdvancedGroup()), CreateLoadGroup()];

    /// <summary>
    /// The plain case: the header is a native summary, so it opens and closes with the connection down.
    /// </summary>
    private static ContainerComponent CreateFaqGroup()
    {
        return DemoUI.CreateExample("Questions and answers",
            UILayout.Stack(8)
                .SetMaxWidth(UILayoutLength.Absolute(420))
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
    /// The part of a form nobody touches, closed down to one quiet line: muted words and a chevron, no card around the fields.
    /// </summary>
    private static ContainerComponent CreateAdvancedGroup()
    {
        return DemoUI.CreateExample("Quiet form fold (UIPage.Fold)",
            UILayout.Stack(12)
                .SetMaxWidth(UILayoutLength.Absolute(380))
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("Billing")
                )
                // The quiet variant as a fold (UIPage.Fold): the name a caption, the content a stack under it.
                .AddChild(UIPage.Fold("Advanced", false,
                        new NumberInputComponent()
                            .SetTitle("Request timeout")
                            .SetSuffixText("s")
                            .SetValue(30),
                        new CheckboxComponent()
                            .SetTitle("Retry on 5xx")
                            .SetValue(true)
                    )
                    .ConfigureDefaultHeader(header => header.SetIcon(DemoIcons.Sliders))
                    .SetHeaderAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetSize(UISize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                        .SetTooltip("Reset defaults")
                    )
                )
                .AddChild(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Save")
                )
        );
    }

    /// <summary>
    /// A section whose contents cost something to fetch: the first open goes to the server, later ones do not; and the two events
    /// an expander raises, one per gesture, with the section's two-way write-back landed before either command runs.
    /// </summary>
    private static ContainerComponent CreateLoadGroup()
    {
        return DemoUI.CreateExample("Lazy content loading (OnExpand & OnCollapse)",
            UILayout.Stack(10)
                .SetMaxWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .BindExpanded<ExpanderLoadGroupContext>(static x => x.Expanded, UIBindingScope.Relative)
                    .OnExpand(nameof(ExpanderController.LoadLogAsync))
                    .OnCollapse(nameof(ExpanderController.RecordCollapse))
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Provisioning log")
                        .SetDescription("A few hundred kilobytes nobody asked for yet")
                        .BindBadgeTitle<ExpanderLoadGroupContext>(static x => x.State, UIBindingScope.Relative)
                        .BindBadgeVariant<ExpanderLoadGroupContext>(static x => x.StateVariant, UIBindingScope.Relative)
                    )
                    // Loading sits on the content: on the expander it would cover the header saying which section is busy.
                    .SetContent(new ContainerComponent()
                        .BindLoading<ExpanderLoadGroupContext>(static x => x.Busy, UIBindingScope.Relative)
                        .SetMinHeight(UILayoutLength.Absolute(90))
                        .AddChild(new ParagraphComponent()
                            .BindDescription<ExpanderLoadGroupContext>(static x => x.Log, UIBindingScope.Relative)
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
                        .BindDescription<ExpanderLoadGroupContext>(static x => x.Trace, UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(ExpanderController.ClearTrace))
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetSize(UISize.Small)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                        .SetTooltip("Clear the trace")
                        .SetPlacement(24, 1, 1, 1)
                    )
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ExpanderController.ForgetLog))
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetSize(UISize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTitle("Forget it, so the next open reads again")
                ),
            note: "The contents cost a request: the first open goes to the server and every later one does not, so what arrives lands in a box the reader is already looking at. Opening raises Expand and closing raises Collapse — one command per press, and the state each reads is already the new one.",
            context: LoadGroup
        );
    }
}
