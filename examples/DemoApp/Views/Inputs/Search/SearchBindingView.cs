using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Search;

internal sealed class SearchBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.search.binding";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreateBehaviorGroup())
            .AddChild(CreatePopupGroup())
            .AddChild(CreateOptionsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new SearchComponent().SetPlaceholder("Search services…").SetOptions(CreateServices()));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(SearchBindingController.ValueGroup), "Value",
            content => content.AddChild(new SearchComponent()
                .SetOptions(CreateServices())
                .BindValue(nameof(SearchValueGroupContext.Value), UIBindingScope.Relative)
                .BindSearchText(nameof(SearchValueGroupContext.SearchText), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(SearchValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(SearchBindingController.CycleValue),
                ["Search text"] = nameof(SearchBindingController.CycleSearchText),
                ["Read-only"] = nameof(SearchBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 150
        );
    }

    /// <summary>
    /// <c>MinSearchLength</c>/<c>DebounceMilliseconds</c>/<c>AutoSearch</c> only govern when a search
    /// command is dispatched, so their effect is visible on the test page rather than here — this group
    /// exists to prove they are live-bindable at all, which the log line under the title reports.
    /// </summary>
    private static ContainerComponent CreateBehaviorGroup()
    {
        return DemoUI.CreateGroup(nameof(SearchBindingController.BehaviorGroup), "Search behavior",
            content => content.AddChild(new SearchComponent()
                .SetValue("api")
                .SetOptions(CreateServices())
                .BindSelectionDisplayMode(nameof(SearchBehaviorGroupContext.SelectionDisplayMode), UIBindingScope.Relative)
                .BindAutoSearch(nameof(SearchBehaviorGroupContext.AutoSearch), UIBindingScope.Relative)
                .BindMinSearchLength(nameof(SearchBehaviorGroupContext.MinSearchLength), UIBindingScope.Relative)
                .BindDebounceMilliseconds(nameof(SearchBehaviorGroupContext.DebounceMilliseconds), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Selection mode"] = nameof(SearchBindingController.CycleSelectionDisplayMode),
                ["Auto search"] = nameof(SearchBindingController.ToggleAutoSearch),
                ["Min length"] = nameof(SearchBindingController.CycleMinSearchLength),
                ["Debounce"] = nameof(SearchBindingController.CycleDebounceMilliseconds),
            }),
            contentMinHeight: 180
        );
    }

    /// <summary>
    /// <c>AllowEmptySelection</c> is deliberately not driven here: like <c>ShowClearButton</c> on a text
    /// input, it decides whether the clear affordance is rendered *at all*
    /// (<c>SelectComponentRenderer.IsStaticallyClearable</c>), so a bound value would never take effect.
    /// The example page shows it statically instead.
    /// </summary>
    private static ContainerComponent CreatePopupGroup()
    {
        return DemoUI.CreateGroup(nameof(SearchBindingController.PopupGroup), "Popup",
            content => content.AddChild(new SearchComponent()
                .SetOptions(CreateServices())
                .BindPlaceholder(nameof(SearchPopupGroupContext.Placeholder), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Placeholder"] = nameof(SearchBindingController.CyclePlaceholder),
            }),
            contentMinHeight: 130
        );
    }

    /// <summary>
    /// A bound <c>Options</c> collection: the popup is rendered client-side after attach, and the closed
    /// trigger's content is cloned out of it. "Rename selected" mutates the option the trigger is showing
    /// a copy of, which is what proves the copy tracks the original rather than being a one-time snapshot.
    /// </summary>
    private static ContainerComponent CreateOptionsGroup()
    {
        return DemoUI.CreateGroup(nameof(SearchBindingController.OptionsGroup), "Bound options",
            content => content.AddChild(new SearchComponent()
                .SetPlaceholder("Search services…")
                .SetAllowEmptySelection(true)
                .BindValue(nameof(OptionsCollectionGroupContext.Value), UIBindingScope.Relative)
                .BindOptions(nameof(OptionsCollectionGroupContext.Options), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add"] = nameof(SearchBindingController.AddOption),
                ["Remove"] = nameof(SearchBindingController.RemoveOption),
                ["Select first"] = nameof(SearchBindingController.SelectFirst),
                ["Rename selected"] = nameof(SearchBindingController.RenameSelected),
            }),
            contentMinHeight: 190
        );
    }

    private static OptionItem[] CreateServices()
        =>
        [
            new OptionItem { Id = "api", Title = "nova-api", Description = "Public REST surface", Icon = LucideIcons.Send },
            new OptionItem { Id = "web", Title = "nova-web", Description = "Dashboard front end", Icon = LucideIcons.ExternalLink },
            new OptionItem { Id = "worker", Title = "nova-worker", Description = "Background jobs", Icon = LucideIcons.History },
        ];
}
