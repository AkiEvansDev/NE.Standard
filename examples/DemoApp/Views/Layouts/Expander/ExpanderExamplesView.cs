using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Expander;

/// <summary>
/// The three jobs a section is given: an answer nobody has asked for yet, the settings most people leave
/// alone, and a list where reading one entry should not cost the room of reading all of them.
/// </summary>
/// <remarks><see cref="AccordionComponent"/> lives here rather than on a page of its own, having no properties to list.</remarks>
internal sealed class ExpanderExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.expander.examples";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateFaqGroup(), CreateListGroup()], [CreateAccordionGroup(), CreateAdvancedGroup()]));

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
    /// A header carrying everything a text component can, because in a list the closed line is the whole entry.
    /// </summary>
    private static ContainerComponent CreateListGroup()
    {
        return DemoUI.CreateExample("A list that reads closed",
            UILayout.Stack(8)
                .SetWidth(UILayoutLength.Absolute(400))
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Star)
                        .SetTitle("Release 483")
                        .SetDescription("Panel · July 2026")
                        .SetBadgeText("Latest")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Servers filter by region, invoices download as one PDF a month, and every server shows its plan beside its status.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.History)
                        .SetTitle("Release 482")
                        .SetDescription("Panel · June 2026")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Change requests, the plan comparison and Europe North in every list.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
        );
    }
}
