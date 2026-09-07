using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Expander;

/// <summary>
/// One section, and every property that can be bound to it.
/// </summary>
/// <remarks><c>Expanded</c> is two-way, so clicking the header moves the row as well as the other way round.</remarks>
internal sealed class ExpanderMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ExpanderGroup = nameof(ExpanderMainController.ExpanderGroup);
    private const string HeaderGroup = nameof(ExpanderMainController.HeaderGroup);
    private const string HeaderTextGroup = nameof(ExpanderMainController.HeaderTextGroup);
    private const string HeaderBadgeGroup = nameof(ExpanderMainController.HeaderBadgeGroup);
    private const string BorderGroup = nameof(ExpanderMainController.BorderGroup);

    public static string ViewKey => "demo.layouts.expander.main";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ExpanderComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindExpanded($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Expanded)}")
            .BindShowChevron($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.ShowChevron)}")
            .BindSurface($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Surface)}")
            .BindPadding($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Padding)}")
            .BindBackground($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Background)}")
            .BindOverflow($"{ExpanderGroup}.{nameof(ExpanderSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .ConfigureDefaultHeader(BindHeader)
            .SetContent(new ParagraphComponent()
                .SetDescription("Artifacts are kept for 30 days, replicated once per availability zone, and may burst to twice the standard quota.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The header's own bindings; the chevron is bound on the expander, since it says what the expander does.
    /// </summary>
    private static void BindHeader(ExpanderHeaderRegion header)
        => _ = header
            .BindIcon($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{HeaderTextGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{HeaderTextGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindDescription($"{HeaderTextGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{HeaderTextGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTextAlignment($"{HeaderGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindSelectable($"{HeaderGroup}.{nameof(TextLayoutGroupContext.Selectable)}")
            .BindBadgePlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{HeaderBadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ExpanderGroup, "Expander", nameof(ExpanderMainController.CycleExpanderOption)),
            DemoUI.CreateOptionSection(HeaderGroup, "Layout", nameof(ExpanderMainController.CycleHeaderOption)),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Content", nameof(ExpanderMainController.CycleHeaderTextOption)),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Badge", nameof(ExpanderMainController.CycleHeaderBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ExpanderMainController.CycleBorderOption))
        );
}
