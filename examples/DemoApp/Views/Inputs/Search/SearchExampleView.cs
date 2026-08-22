using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Search;

internal sealed class SearchExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.search.example";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateServiceGroup())
            .AddChild(CreateSelectionModeGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>
    /// The ordinary case. Options render their full item template — icon, title, description — which is
    /// the reason this is a custom popup rather than a native control.
    /// </summary>
    private static ContainerComponent CreateServiceGroup()
    {
        return DemoUI.CreateGroup(null, "Find a service",
            content => content.AddChild(new SearchComponent()
                .SetPlaceholder("Search services…")
                .SetOptions(CreateServices())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 130
        );
    }

    /// <summary>
    /// The two selection-display modes side by side, both starting with a value already selected — the
    /// difference only exists once something is picked: one keeps the typed-in search box, the other
    /// replaces it with the selected option's own template.
    /// </summary>
    private static ContainerComponent CreateSelectionModeGroup()
    {
        return DemoUI.CreateGroup(null, "Selection display",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(16)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new SearchComponent()
                    .SetTitle("Keeps the search input")
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.KeepSearchInput)
                    .SetValue("api")
                    .SetOptions(CreateServices())
                )
                .AddChild(new SearchComponent()
                    .SetTitle("Replaces it with the selection")
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.ReplaceWithSelectedItem)
                    .SetValue("api")
                    .SetOptions(CreateServices())
                )
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(16)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new SearchComponent()
                    .SetTitle("Clearable")
                    .SetAllowEmptySelection(true)
                    .SetValue("web")
                    .SetOptions(CreateServices())
                )
                .AddChild(new SearchComponent()
                    .SetTitle("Read-only")
                    .SetIsReadOnly(true)
                    .SetValue("api")
                    .SetOptions(CreateServices())
                )
                .AddChild(new SearchComponent()
                    .SetTitle("Required")
                    .SetPlaceholder("Pick a service…")
                    .SetOptions(CreateServices())
                    .Required("Pick a service to continue.")
                )
            ),
            static _ => { },
            contentMinHeight: 300
        );
    }


    private static OptionItem[] CreateServices()
        =>
        [
            Option("api", "nova-api", "Public REST surface", LucideIcons.Send),
            Option("web", "nova-web", "Dashboard front end", LucideIcons.ExternalLink),
            Option("worker", "nova-worker", "Background jobs", LucideIcons.History),
            Option("gateway", "nova-gateway", "Edge routing", LucideIcons.Upload),
        ];

    private static OptionItem Option(string id, string title, string description, string icon)
        => new()
        {
            Id = id,
            Title = title,
            Description = description,
            Icon = icon
        };
}
