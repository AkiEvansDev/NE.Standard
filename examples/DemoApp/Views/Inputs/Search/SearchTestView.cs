using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Search;

/// <summary>
/// The one scenario that puts every moving part of this component together: typing dispatches a search
/// command, the controller rebuilds a bound <c>Options</c> collection, the popup re-renders those options
/// client-side from the templates, and picking one has to show up in the closed trigger — which is
/// itself a clone of the selected option taken from that freshly-rendered popup.
/// </summary>
internal sealed class SearchTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.search.test";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChild(CreateQueryGroup());

    private static ContainerComponent CreateQueryGroup()
    {
        return DemoUI.CreateGroup(nameof(SearchTestController.QueryGroup), "Server-side search",
            content => content.AddChild(new SearchComponent()
                .SetPlaceholder("Search services…")
                .SetAllowEmptySelection(true)
                .SetMinSearchLength(1)
                .SetDebounceMilliseconds(200)
                .BindSearchText(nameof(SearchQueryGroupContext.SearchText), UIBindingScope.Relative)
                .BindValue(nameof(SearchQueryGroupContext.Value), UIBindingScope.Relative)
                .BindOptions(nameof(SearchQueryGroupContext.Options), UIBindingScope.Relative)
                .OnSearch(nameof(SearchTestController.Search))
                .OnChange(nameof(SearchTestController.RecordSelection))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }
}
