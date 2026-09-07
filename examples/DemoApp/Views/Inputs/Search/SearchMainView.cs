using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Inputs.Search;

/// <summary>
/// One search field, and every property that can be bound to it.
/// </summary>
/// <remarks>The option list is what the server answered through <c>OnSearch</c>, not a client-side filter.</remarks>
internal sealed class SearchMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(SearchMainController.ValueGroup);
    private const string TermGroup = nameof(SearchMainController.TermGroup);
    private const string FieldGroup = nameof(SearchMainController.FieldGroup);
    private const string ResultsGroup = nameof(SearchMainController.ResultsGroup);
    private const string ContentGroup = nameof(SearchMainController.ContentGroup);
    private const string BadgeGroup = nameof(SearchMainController.BadgeGroup);
    private const string BorderGroup = nameof(SearchMainController.BorderGroup);

    public static string ViewKey => "demo.inputs.search.main";

    protected override string ComponentRoute => "/inputs/search";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
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
            .OnSearch(nameof(SearchMainController.Search))
            .BindItems($"{ResultsGroup}.{nameof(SearchResultsGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(SearchValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(SearchValueGroupContext.IsReadOnly)}")
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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(SearchMainController.CycleValueOption)),
            DemoUI.CreateOptionSection(TermGroup, "Search", nameof(SearchMainController.CycleTermOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(SearchMainController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ResultsGroup, "Results", nameof(SearchMainController.CycleResultsOption), "The server's answer to the term, not a property: a reading of the list the search filled."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(SearchMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(SearchMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SearchMainController.CycleBorderOption))
        );
}
