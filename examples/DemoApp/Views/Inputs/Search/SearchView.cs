using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Search;

/// <summary>
/// One search field and every property that can be bound to it; then a box over a catalogue the server answers for, and what the field keeps once an option is picked out of it.
/// </summary>
/// <remarks>The option list is exactly what the server answered through <c>OnSearch</c>; the client narrows nothing.</remarks>
internal sealed class SearchView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(SearchController.ValueGroup);
    private const string TermGroup = nameof(SearchController.TermGroup);
    private const string FieldGroup = nameof(SearchController.FieldGroup);
    private const string ResultsGroup = nameof(SearchController.ResultsGroup);
    private const string ContentGroup = nameof(SearchController.ContentGroup);
    private const string BadgeGroup = nameof(SearchController.BadgeGroup);
    private const string BorderGroup = nameof(SearchController.BorderGroup);
    private const string ServicesList = nameof(SearchController.ServicesList);
    private const string PickList = nameof(SearchController.PickList);
    private const string FreeTextList = nameof(SearchController.FreeTextList);
    private const string MinLengthList = nameof(SearchController.MinLengthList);
    private const string ManualList = nameof(SearchController.ManualList);

    public static string ViewKey => "demo.inputs.search";

    protected override string ComponentRoute => "/inputs/search";
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SearchComponent()
            .BindStandard()
            .OnSearch(nameof(SearchController.Search))
            .BindItems<SearchController>(static x => x.ResultsGroup.Options)
            .BindValue<SearchController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<SearchController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<SearchController>(static x => x.ValueGroup.Size)
            .BindSearchText<SearchController>(static x => x.TermGroup.SearchText)
            .BindAutoSearch<SearchController>(static x => x.TermGroup.AutoSearch)
            .BindDebounceMilliseconds<SearchController>(static x => x.TermGroup.DebounceMilliseconds)
            .BindMinSearchLength<SearchController>(static x => x.TermGroup.MinSearchLength)
            .BindSearchFieldAppearance<SearchController>(static x => x.TermGroup.SearchFieldAppearance)
            .BindAppearance<SearchController>(static x => x.FieldGroup.Appearance)
            .BindPlaceholder<SearchController>(static x => x.FieldGroup.Placeholder)
            .BindPrefixIcon<SearchController>(static x => x.FieldGroup.PrefixIcon)
            .BindSuffixIcon<SearchController>(static x => x.FieldGroup.SuffixIcon)
            .BindShowClearButton<SearchController>(static x => x.FieldGroup.ShowClearButton)
            .BindShowChevron<SearchController>(static x => x.FieldGroup.ShowChevron)
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(TermGroup, "Search"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(ResultsGroup, "Results", "The server's answer to the term, not a property: a reading of the list the search filled."),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    // The short groups side by side, then the two ways of asking across the page.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateCatalogueGroup(), CreateFreeTextGroup()], [CreatePickGroup()]), CreateAskingGroup()];

    /// <summary>
    /// The ordinary case, over rich options, with the term narrowing the list as it is typed.
    /// </summary>
    private static ContainerComponent CreateCatalogueGroup()
    {
        return DemoUI.CreateExample("Search a catalogue",
            UILayout.Stack(12)
                // One box, bound to the list its name says; the shared search command is told which to answer for.
                .AddChild(new SearchComponent()
                    .BindOptions<SearchController>(static x => x.ServicesList.Results)
                    .BindSearchText<SearchController>(static x => x.ServicesList.SearchText)
                    .BindValue<SearchController>(static x => x.ServicesList.Value)
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ServicesList))
                    .SetTitle("Service")
                    .SetPlaceholder("Search services")
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("Every keystroke asks the controller for a list, and the box shows exactly what it answered: nothing is narrowed on the client."))
        );
    }

    /// <summary>
    /// Autocomplete: the server answers with suggestions as the reader types, and Enter commits either a picked suggestion or the reader's own text.
    /// </summary>
    private static ContainerComponent CreateFreeTextGroup()
    {
        return DemoUI.CreateExample("Free text with suggestions",
            UILayout.Stack(12)
                .AddChild(new SearchComponent()
                    .SetAllowFreeText()
                    .BindOptions<SearchController>(static x => x.FreeTextList.Results)
                    .BindSearchText<SearchController>(static x => x.FreeTextList.SearchText)
                    .BindValue<SearchController>(static x => x.FreeTextList.Value)
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", FreeTextList))
                    .SetTitle("Endpoint")
                    .SetPlaceholder("Pick a service or type a host")
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("With SetAllowFreeText(), the suggestions follow the term from the server, an arrow picks one, and Enter with none marked commits the typed text itself."))
        );
    }

    /// <summary>
    /// When the term reaches the server at all: a floor under the term's length, and a box that waits to be asked.
    /// </summary>
    private static ContainerComponent CreateAskingGroup()
    {
        return DemoUI.CreateExample("Server query debounce & MinLength",
            UILayout.Columns(24,
                new SearchComponent()
                    .BindOptions<SearchController>(static x => x.MinLengthList.Results)
                    .BindSearchText<SearchController>(static x => x.MinLengthList.SearchText)
                    .BindValue<SearchController>(static x => x.MinLengthList.Value)
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", MinLengthList))
                    .SetTitle("Not before three letters")
                    .SetPlaceholder("Type \"dns\"")
                    .SetMinSearchLength(3)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton(),
                new SearchComponent()
                    .BindOptions<SearchController>(static x => x.ManualList.Results)
                    .BindSearchText<SearchController>(static x => x.ManualList.SearchText)
                    .BindValue<SearchController>(static x => x.ManualList.Value)
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ManualList))
                    .SetTitle("Only when asked")
                    .SetPlaceholder("Type, then press Enter")
                    .SetAutoSearch(false)
            ),
            columns: 24,
            note: "A floor on the term saves the server the keystrokes that could only match everything; with AutoSearch off nothing is asked until the reader presses Enter in the field, which asks at once on any search, past its debounce."
        );
    }

    /// <summary>What the closed field shows and what the open one keeps: the pick drawn whole, and the term typed to find it.</summary>
    private static ContainerComponent CreatePickGroup()
    {
        return DemoUI.CreateExample("Selected Value vs typed Text",
            UILayout.Stack(12)
                // No prefix glyph: the chosen option brings its own icon into the closed field.
                .AddChild(new SearchComponent()
                    .BindOptions<SearchController>(static x => x.PickList.Results)
                    .BindSearchText<SearchController>(static x => x.PickList.SearchText)
                    .BindValue<SearchController>(static x => x.PickList.Value)
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", PickList))
                    .SetTitle("Service")
                    .SetPlaceholder("Pick a service")
                    .SetShowClearButton()
                )
                // What the box holds, read off its two bindings: the term is the field's, the value the option's key.
                .AddChild(UILayout.Columns(12,
                        new TextComponent()
                            .SetTitle("Term")
                            .SetTitleType(UITextAppearance.Caption)
                            .BindDescription<SearchController>(static x => x.PickList.SearchText)
                            .SetDescriptionType(UITextAppearance.Body),
                        new TextComponent()
                            .SetTitle("Value")
                            .SetTitleType(UITextAppearance.Caption)
                            .BindDescription<SearchController>(static x => x.PickList.Value)
                            .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(UIText.Note("Try \"bill\". Closed, the field shows the chosen option whole — icon, second line and badge — as a select does. Open it again: the term that found it is still there, selected, so typing replaces it, and the list is still the answer to it."))
        );
    }
}
