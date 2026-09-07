using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateFaqGroup(), CreateAccordionGroup()],
            [CreateAdvancedGroup(), CreateListGroup()]
        ));
    }

    /// <summary>
    /// The plain case: the header is a native summary, so it opens and closes with the connection down.
    /// </summary>
    private static ContainerComponent CreateFaqGroup()
    {
        return DemoUI.CreateGroup(null, "Questions and answers",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(CreateQuestion(
                    "How does rendering work?",
                    "Views are compiled into a component graph on the server; the browser receives incremental DOM operations over SignalR and posts UI events back through the same hub.",
                    expanded: true
                ))
                .AddChild(CreateQuestion(
                    "Do I write any JavaScript?",
                    "No — pages are authored entirely in C# with a fluent API. The embedded TypeScript client is an implementation detail of the web platform.",
                    expanded: false
                ))
                .AddChild(CreateQuestion(
                    "What happens on reconnect?",
                    "The connection re-attaches to the live runtime instance and the client resynchronizes its state from the server.",
                    expanded: false
                ))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ExpanderComponent CreateQuestion(string question, string answer, bool expanded)
        => new ExpanderComponent()
            .SetExpanded(expanded)
            .ConfigureDefaultHeader(header => header.SetTitle(question))
            .SetContent(new ParagraphComponent()
                .SetDescription(answer)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
            );

    /// <summary>
    /// The part of a form nobody touches, closed down to one line of chrome.
    /// </summary>
    private static ContainerComponent CreateAdvancedGroup()
    {
        return DemoUI.CreateGroup(null, "The part of a form nobody touches",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("Payments API")
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    // A caption rather than a title: between two fields, a heading would make it a form of its own.
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Sliders)
                        .SetTitle("Advanced")
                        .SetTitleType(UITextAppearance.Caption)
                    )
                    .SetContent(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Vertical)
                        .SetSpacing(12)
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
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// One rule on top of the same sections: opening one closes whichever sibling was open.
    /// </summary>
    private static ContainerComponent CreateAccordionGroup()
    {
        return DemoUI.CreateGroup(null, "One open at a time",
            content => content.AddChild(new AccordionComponent()
                .SetWidth(UILayoutLength.Absolute(380))
                .AddChild(CreateQuestion("Storage", "Artifacts are kept for 30 days and replicated once per availability zone.", expanded: true))
                .AddChild(CreateQuestion("Quotas", "Standard tier, bursting to twice the quota for up to an hour a day.", expanded: false))
                .AddChild(CreateQuestion("Access", "Internal by default; a public endpoint needs an owner's approval.", expanded: false))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A header carrying everything a text component can, because in a list the closed line is the whole entry.
    /// </summary>
    private static ContainerComponent CreateListGroup()
    {
        return DemoUI.CreateGroup(null, "A list that reads closed",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetWidth(UILayoutLength.Absolute(400))
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Star)
                        .SetTitle("Release 2.4")
                        .SetDescription("July 2026")
                        .SetBadgeText("Latest")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Per-component theme overrides, live template-variant switching, and a redesigned colour reference.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.History)
                        .SetTitle("Release 2.3")
                        .SetDescription("June 2026")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Grouped items, empty templates and the items filter/sort pipeline.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
