using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Pager;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.Pager;

/// <summary>
/// One pager over a paged list and every property that can be bound to it; then a page of cards, and the compact look a narrow
/// column wears.
/// </summary>
/// <remarks>
/// The pager is aimed at its list by the list's id and reads the list's window; the list is what pages (<c>BindSource</c> and
/// <c>SetPaging</c>), so its <c>Paging</c> is among the options too — turned off, the list scrolls and the pager hides. The fleet is
/// made up a window at a time, so every page is the source's answer, not a slice of something the page holds. A paged table, its page
/// in the address, is the large lists' page.
/// </remarks>
internal sealed class PagerView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string PagerGroup = nameof(PagerController.PagerGroup);
    private const string PreviewListId = "pager-preview-list";
    private const string CardsId = "pager-cards";
    private const string NarrowId = "pager-narrow";

    public static string ViewKey => "demo.items.pager";

    protected override string ComponentRoute => "/items/pager";
    protected override string Header => "demo.items.pager.header";
    protected override string HeaderDescription => "demo.items.pager.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/lists", "demo.nav.mechanisms.lists");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame
            .AddChild(new ItemsViewComponent(PreviewListId)
                .BindSource(nameof(PagerController.Preview))
                .SetWindowSize(5)
                .BindPaging($"{PagerGroup}.{nameof(PagerGroupContext.Paging)}")
                .SetSpacing(4)
                .VerticalScrollOnly()
                .SetMaxHeight(UILayoutLength.Absolute(260))
                .SetTemplate(ServerRow())
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new PagerComponent()
                .SetTarget(PreviewListId)
                .SetPageSizes([5, 10, 20])
                .BindMode($"{PagerGroup}.{nameof(PagerGroupContext.Mode)}")
                .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
                .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
                .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
                .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
                .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
                .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
                .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
                .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
                .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
                .SetPlacement(1, 2, 24, 1)
            ), contentMinHeight: 340);

    /// <summary>A server as a row of a list: its role's glyph, its name over where it runs, its status at the end.</summary>
    private static TextComponent ServerRow()
        => new TextComponent()
            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
            .SetIconColor(UIThemeColor.Muted)
            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
            .AsBody()
            .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
            .SetDescriptionColor(UIThemeColor.Muted)
            .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
            .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
            .SetBadgePlacement(UITextBadgePlacement.Trailing);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(PagerGroup, "Pager", nameof(PagerController.CyclePagerOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateCardsGroup(), CreateNarrowGroup()];

    /// <summary>
    /// A page of cards: the wrap lays out the window, and the pager under it turns it; the sizes are the viewer's to choose.
    /// </summary>
    private static ContainerComponent CreateCardsGroup()
    {
        return DemoUI.CreateExample("A page of cards",
            UILayout.Stack(12)
                .AddChild(new ItemsViewComponent(CardsId)
                    .BindSource(nameof(PagerController.Cards))
                    .SetWindowSize(8)
                    .SetPaging(true)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(12)
                    .SetRowHoverable(true)
                    .SetTemplate(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetWidth(UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), sm: UILayoutLength.Absolute(250)))
                        .SetContent(new TextComponent()
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .AsBody()
                            .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                            .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                        )
                    )
                )
                .AddChild(new PagerComponent()
                    .SetTarget(CardsId)
                    .SetPageSizes([8, 16, 32])
                    .SetHorizontalAlignment(UIAlignment.Center)
                ),
            note: "The pager is aimed at the list by its id (`SetTarget`) and asks the list's source for a page by offset, as the list's own window request does. It shows the first page, the last, and the ones around the one on show; an ellipsis stands for the rest. The current page is marked for a screen reader too (`aria-current`), and the pager is one stop of the Tab order that the arrows walk. Page Up and Page Down in the list turn its page, and its arrows walk the cards on both axes; the pointer's wash lies over a card's own ground. The size chosen is kept in the browser, so a reload lands on it.",
            columns: 24
        );
    }

    /// <summary>
    /// The compact look: the rows the page holds between previous and next, which is all a phone shows of any pager — a side column's
    /// list, kept to a column's width across the page.
    /// </summary>
    private static ContainerComponent CreateNarrowGroup()
    {
        return DemoUI.CreateExample("Compact",
            UILayout.Stack(8)
                .AddChild(new ItemsViewComponent(NarrowId)
                    .BindSource(nameof(PagerController.Narrow))
                    .SetWindowSize(20)
                    .SetPaging(true)
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(300))
                    .SetTemplate(ServerRow())
                )
                .AddChild(new PagerComponent()
                    .SetTarget(NarrowId)
                    .SetMode(UIPagerMode.Compact)
                    .SetHorizontalAlignment(UIAlignment.End)
                )
                .SetMaxWidth(UILayoutLength.Absolute(420))
                .SetHorizontalAlignment(UIAlignment.Start),
            columns: 24,
            note: "`SetMode(UIPagerMode.Compact)`. On a phone every pager is compact, whatever its mode says."
        );
    }
}
