using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Expander;

internal sealed class ExpanderExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.expander.example";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateFaqGroup())
            .AddChild(CreateChangelogGroup());
    }

    private static ContainerComponent CreateFaqGroup()
    {
        return DemoUI.CreateGroup(null, "FAQ (native toggling)",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetWidth(UILayoutLength.Absolute(420))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateFaqItem(
                    "How does rendering work?",
                    "Views are compiled into a component graph on the server; the browser receives incremental DOM operations over SignalR and posts UI events back through the same hub.",
                    expanded: true
                ))
                .AddChild(CreateFaqItem(
                    "Do I write any JavaScript?",
                    "No — pages are authored entirely in C# with a fluent API. The embedded TypeScript client is an implementation detail of the web platform.",
                    expanded: false
                ))
                .AddChild(CreateFaqItem(
                    "What happens on reconnect?",
                    "The SignalR connection re-attaches to the live runtime instance and the client resynchronizes its state from the server.",
                    expanded: false
                ))
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    private static ExpanderComponent CreateFaqItem(string question, string answer, bool expanded)
        => new ExpanderComponent()
            .SetExpanded(expanded)
            .ConfigureDefaultHeader(h => h.SetTitle(question))
            .SetContent(new TextComponent()
                .SetDescription(answer)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
            );

    private static ContainerComponent CreateChangelogGroup()
    {
        return DemoUI.CreateGroup(null, "Header variants",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetWidth(UILayoutLength.Absolute(380))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new ExpanderComponent()
                    .SetExpanded(true)
                    .ConfigureDefaultHeader(h => h
                        .SetTitle("Release 2.4")
                        .SetDescription("July 2026")
                        .SetIcon(LucideIcons.Star)
                        .SetBadgeText("Latest")
                    )
                    .SetContent(new TextComponent()
                        .SetDescription("Per-component theme overrides, live template-variant switching, and a redesigned color reference.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetExpanded(false)
                    .ConfigureDefaultHeader(h => h
                        .SetTitle("Release 2.3")
                        .SetDescription("June 2026 · no chevron")
                        .SetShowChevron(false)
                    )
                    .SetContent(new TextComponent()
                        .SetDescription("Grouped items, empty templates and the items filter/sort pipeline.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }
}
