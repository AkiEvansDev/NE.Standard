using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Search;

/// <summary>
/// A search box over a catalogue the server answers for, and what happens to the box once an option is
/// picked out of it.
/// </summary>
/// <remarks><c>SelectionDisplayMode</c> decides whether the typed term stays or the chosen option takes its place.</remarks>
internal sealed class SearchExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string ServicesList = nameof(SearchExamplesController.ServicesList);
    private const string KeepTextList = nameof(SearchExamplesController.KeepTextList);
    private const string ReplaceTextList = nameof(SearchExamplesController.ReplaceTextList);

    public static string ViewKey => "demo.inputs.search.examples";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateCatalogueGroup()],
            [CreateSelectionGroup()]
        ));
    }

    /// <summary>
    /// The ordinary case, over rich options, with the term narrowing the list as it is typed.
    /// </summary>
    private static ContainerComponent CreateCatalogueGroup()
    {
        return DemoUI.CreateGroup(null, "Search a catalogue",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(CreateSearch(ServicesList)
                    .SetTitle("Service")
                    .SetPlaceholder("Search services")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("Every keystroke asks the controller for a list; nothing is filtered on the client.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 240
        );
    }

    /// <summary>The two answers to "what should the field say once something is picked?", side by side.</summary>
    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateGroup(null, "What the field says after the pick",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(CreateSearch(KeepTextList)
                    .SetTitle("Keeps what was typed")
                    .SetPlaceholder("Try \"api\"")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.KeepSearchInput)
                )
                // No prefix glyph: the chosen option brings its own icon into the closed field.
                .AddChild(CreateSearch(ReplaceTextList)
                    .SetTitle("Replaced by the chosen option")
                    .SetPlaceholder("Try \"api\"")
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.ReplaceWithSelectedItem)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("Replaced, the closed field shows the whole option — icon, second line and badge — and turns back into a text field as soon as it is opened.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// One box, bound to the list its name says; the shared search command is told which to answer for.
    /// </summary>
    private static SearchComponent CreateSearch(string list)
        => new SearchComponent()
            .BindOptions($"{list}.{nameof(SearchExamplesListContext.Results)}")
            .BindSearchText($"{list}.{nameof(SearchExamplesListContext.SearchText)}")
            .BindValue($"{list}.{nameof(SearchExamplesListContext.Value)}")
            .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", list));
}
