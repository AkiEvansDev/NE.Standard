using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;

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
    private const string MinLengthList = nameof(SearchExamplesController.MinLengthList);
    private const string ManualList = nameof(SearchExamplesController.ManualList);

    public static string ViewKey => "demo.inputs.search.examples";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateCatalogueGroup(), CreateAskingGroup()], [CreateSelectionGroup()]));

    /// <summary>
    /// The ordinary case, over rich options, with the term narrowing the list as it is typed.
    /// </summary>
    private static ContainerComponent CreateCatalogueGroup()
    {
        return DemoUI.CreateExample("Search a catalogue",
            UILayout.Stack(12)
                // One box, bound to the list its name says; the shared search command is told which to answer for.
                .AddChild(new SearchComponent()
                    .BindOptions($"{ServicesList}.{nameof(SearchExamplesListContext.Results)}")
                    .BindSearchText($"{ServicesList}.{nameof(SearchExamplesListContext.SearchText)}")
                    .BindValue($"{ServicesList}.{nameof(SearchExamplesListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", ServicesList))
                    .SetTitle("Service")
                    .SetPlaceholder("Search services")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("Every keystroke asks the controller for a list; nothing is filtered on the client."))
        );
    }

    /// <summary>
    /// When the term reaches the server at all: a floor under the term's length, and a box that waits to be asked.
    /// </summary>
    private static ContainerComponent CreateAskingGroup()
    {
        return DemoUI.CreateExample("When it asks the server",
            UILayout.Stack(12)
                .AddChild(new SearchComponent()
                    .BindOptions($"{MinLengthList}.{nameof(SearchExamplesListContext.Results)}")
                    .BindSearchText($"{MinLengthList}.{nameof(SearchExamplesListContext.SearchText)}")
                    .BindValue($"{MinLengthList}.{nameof(SearchExamplesListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", MinLengthList))
                    .SetTitle("Not before three letters")
                    .SetPlaceholder("Type \"dns\"")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetMinSearchLength(3)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(UILayout.Row(24)
                    .AddChild(new SearchComponent()
                        .BindOptions($"{ManualList}.{nameof(SearchExamplesListContext.Results)}")
                        .BindSearchText($"{ManualList}.{nameof(SearchExamplesListContext.SearchText)}")
                        .BindValue($"{ManualList}.{nameof(SearchExamplesListContext.Value)}")
                        .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", ManualList))
                        .SetTitle("Only when asked")
                        .SetPlaceholder("Type, then press Search")
                        .SetPrefixIcon(DemoIcons.Search)
                        .SetAutoSearch(false)
                    )
                    .AddChild(new ButtonComponent()
                        .SetTitle("Search")
                        .SetIcon(DemoIcons.Search)
                        .OnClickLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", ManualList))
                        .SetVerticalAlignment(UIAlignment.End)
                    )
                )
                .AddChild(UIText.Note("A floor on the term saves the server the keystrokes that could only match everything; with AutoSearch off nothing is asked until something asks it, and the button reads the same two-way SearchText the box would have sent."))
        );
    }

    /// <summary>The two answers to "what should the field say once something is picked?", one under the other.</summary>
    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateExample("What the field says after the pick",
            UILayout.Stack(12)
                .AddChild(new SearchComponent()
                    .BindOptions($"{KeepTextList}.{nameof(SearchExamplesListContext.Results)}")
                    .BindSearchText($"{KeepTextList}.{nameof(SearchExamplesListContext.SearchText)}")
                    .BindValue($"{KeepTextList}.{nameof(SearchExamplesListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", KeepTextList))
                    .SetTitle("Keeps what was typed")
                    .SetPlaceholder("Try \"bill\"")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.KeepSearchInput)
                )
                // No prefix glyph: the chosen option brings its own icon into the closed field.
                .AddChild(new SearchComponent()
                    .BindOptions($"{ReplaceTextList}.{nameof(SearchExamplesListContext.Results)}")
                    .BindSearchText($"{ReplaceTextList}.{nameof(SearchExamplesListContext.SearchText)}")
                    .BindValue($"{ReplaceTextList}.{nameof(SearchExamplesListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchExamplesController.Search), new KeyValuePair<string, object?>("list", ReplaceTextList))
                    .SetTitle("Replaced by the chosen option")
                    .SetPlaceholder("Try \"bill\"")
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.ReplaceWithSelectedItem)
                )
                .AddChild(UIText.Note("Replaced, the closed field shows the whole option — icon, second line and badge — and turns back into a text field the moment the keyboard reaches it, the chosen text selected, so what is typed replaces it."))
        );
    }
}
