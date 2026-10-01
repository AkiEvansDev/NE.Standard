using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.Search;

/// <summary>
/// One search field and every property that can be bound to it; then a box over a catalogue the server answers for, and what the box says once an option is picked out of it.
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
    private const string KeepTextList = nameof(SearchController.KeepTextList);
    private const string ReplaceTextList = nameof(SearchController.ReplaceTextList);
    private const string MinLengthList = nameof(SearchController.MinLengthList);
    private const string ManualList = nameof(SearchController.ManualList);

    public static string ViewKey => "demo.inputs.search";

    protected override string ComponentRoute => "/inputs/search";
    protected override string Header => "demo.inputs.search.header";
    protected override string HeaderDescription => "demo.inputs.search.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new SearchComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .OnSearch(nameof(SearchController.Search))
            .BindItems($"{ResultsGroup}.{nameof(SearchResultsGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(SearchValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(SearchValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(SearchValueGroupContext.Size)}")
            .BindSearchText($"{TermGroup}.{nameof(SearchTermGroupContext.SearchText)}")
            .BindAutoSearch($"{TermGroup}.{nameof(SearchTermGroupContext.AutoSearch)}")
            .BindDebounceMilliseconds($"{TermGroup}.{nameof(SearchTermGroupContext.DebounceMilliseconds)}")
            .BindMinSearchLength($"{TermGroup}.{nameof(SearchTermGroupContext.MinSearchLength)}")
            .BindSelectionDisplayMode($"{TermGroup}.{nameof(SearchTermGroupContext.SelectionDisplayMode)}")
            .BindAppearance($"{FieldGroup}.{nameof(SearchFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(SearchFieldGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(SearchFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(SearchFieldGroupContext.SuffixIcon)}")
            .BindShowClearButton($"{FieldGroup}.{nameof(SearchFieldGroupContext.ShowClearButton)}")
            .BindShowChevron($"{FieldGroup}.{nameof(SearchFieldGroupContext.ShowChevron)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(SearchController.CycleValueOption)),
            DemoUI.CreateOptionSection(TermGroup, "Search", nameof(SearchController.CycleTermOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(SearchController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ResultsGroup, "Results", nameof(SearchController.CycleResultsOption), "The server's answer to the term, not a property: a reading of the list the search filled."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(SearchController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(SearchController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SearchController.CycleBorderOption))
        );

    // The two short groups side by side, then the two ways of asking across the page, in halves: paired, they stood alone in a row.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateCatalogueGroup()], [CreateSelectionGroup()]), CreateAskingGroup()];

    /// <summary>
    /// The ordinary case, over rich options, with the term narrowing the list as it is typed.
    /// </summary>
    private static ContainerComponent CreateCatalogueGroup()
    {
        return DemoUI.CreateExample("Search a catalogue",
            UILayout.Stack(12)
                // One box, bound to the list its name says; the shared search command is told which to answer for.
                .AddChild(new SearchComponent()
                    .BindOptions($"{ServicesList}.{nameof(SearchListContext.Results)}")
                    .BindSearchText($"{ServicesList}.{nameof(SearchListContext.SearchText)}")
                    .BindValue($"{ServicesList}.{nameof(SearchListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ServicesList))
                    .SetTitle("Service")
                    .SetPlaceholder("Search services")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("Every keystroke asks the controller for a list, and the box shows exactly what it answered: nothing is narrowed on the client."))
        );
    }

    /// <summary>
    /// When the term reaches the server at all: a floor under the term's length, and a box that waits to be asked.
    /// </summary>
    private static ContainerComponent CreateAskingGroup()
    {
        return DemoUI.CreateExample("When it asks the server",
            UILayout.Columns(24,
                new SearchComponent()
                    .BindOptions($"{MinLengthList}.{nameof(SearchListContext.Results)}")
                    .BindSearchText($"{MinLengthList}.{nameof(SearchListContext.SearchText)}")
                    .BindValue($"{MinLengthList}.{nameof(SearchListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", MinLengthList))
                    .SetTitle("Not before three letters")
                    .SetPlaceholder("Type \"dns\"")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetMinSearchLength(3)
                    .SetDebounceMilliseconds(200)
                    .SetShowClearButton(),
                // The field fills the row and the button stands at its end, level with the box rather than with the caption.
                new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new SearchComponent()
                        .BindOptions($"{ManualList}.{nameof(SearchListContext.Results)}")
                        .BindSearchText($"{ManualList}.{nameof(SearchListContext.SearchText)}")
                        .BindValue($"{ManualList}.{nameof(SearchListContext.Value)}")
                        .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ManualList))
                        .SetTitle("Only when asked")
                        .SetPlaceholder("Type, then press Search")
                        .SetPrefixIcon(DemoIcons.Search)
                        .SetAutoSearch(false)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .SetTitle("Search")
                        .SetIcon(DemoIcons.Search)
                        .OnClickLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ManualList))
                        .SetVerticalAlignment(UIAlignment.End)
                        .SetMargin(UIThickness.All(8, 0, 0, 0))
                        .SetPlacement(24, 1, 1, 1)
                    )
            ),
            columns: 24,
            note: "A floor on the term saves the server the keystrokes that could only match everything; with AutoSearch off nothing is asked until something asks it, and the button reads the same two-way SearchText the box would have sent."
        );
    }

    /// <summary>The two answers to "what should the field say once something is picked?", one under the other.</summary>
    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateExample("What the field says after the pick",
            UILayout.Stack(12)
                .AddChild(new SearchComponent()
                    .BindOptions($"{KeepTextList}.{nameof(SearchListContext.Results)}")
                    .BindSearchText($"{KeepTextList}.{nameof(SearchListContext.SearchText)}")
                    .BindValue($"{KeepTextList}.{nameof(SearchListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", KeepTextList))
                    .SetTitle("Keeps what was typed")
                    .SetPlaceholder("Try \"bill\"")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.KeepSearchInput)
                )
                // No prefix glyph: the chosen option brings its own icon into the closed field.
                .AddChild(new SearchComponent()
                    .BindOptions($"{ReplaceTextList}.{nameof(SearchListContext.Results)}")
                    .BindSearchText($"{ReplaceTextList}.{nameof(SearchListContext.SearchText)}")
                    .BindValue($"{ReplaceTextList}.{nameof(SearchListContext.Value)}")
                    .OnSearchLiteral(nameof(SearchController.SearchList), new KeyValuePair<string, object?>("list", ReplaceTextList))
                    .SetTitle("Replaced by the chosen option")
                    .SetPlaceholder("Try \"bill\"")
                    .SetSelectionDisplayMode(UISearchSelectionDisplayMode.ReplaceWithSelectedItem)
                )
                .AddChild(UIText.Note("Replaced, the closed field shows the whole option — icon, second line and badge — and turns back into a text field the moment the keyboard reaches it, the chosen text selected, so what is typed replaces it."))
        );
    }
}
