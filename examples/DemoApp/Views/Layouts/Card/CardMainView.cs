using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Card;

/// <summary>
/// One card, and every property that can be bound to it.
/// </summary>
/// <remarks>The content and footer regions are set rather than bound: they are what the card holds, not something about it.</remarks>
internal sealed class CardMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string CardGroup = nameof(CardMainController.CardGroup);
    private const string HeaderGroup = nameof(CardMainController.HeaderGroup);
    private const string HeaderTextGroup = nameof(CardMainController.HeaderTextGroup);
    private const string HeaderBadgeGroup = nameof(CardMainController.HeaderBadgeGroup);
    private const string BorderGroup = nameof(CardMainController.BorderGroup);

    public static string ViewKey => "demo.layouts.card.main";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new CardComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{CardGroup}.{nameof(CardSurfaceGroupContext.Surface)}")
            .BindClickable($"{CardGroup}.{nameof(CardSurfaceGroupContext.Clickable)}")
            .BindPadding($"{CardGroup}.{nameof(CardSurfaceGroupContext.Padding)}")
            .BindBackground($"{CardGroup}.{nameof(CardSurfaceGroupContext.Background)}")
            .BindBackgroundImage($"{CardGroup}.{nameof(CardSurfaceGroupContext.BackgroundImage)}")
            .BindBackgroundImageFit($"{CardGroup}.{nameof(CardSurfaceGroupContext.BackgroundImageFit)}")
            .BindOverflow($"{CardGroup}.{nameof(CardSurfaceGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .ConfigureDefaultHeader(BindHeader)
            .SetContent(new ParagraphComponent()
                .SetDescription("All checks passed. Two approvals, no requested changes — ready to merge.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetFooter(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("Merge")
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("View diff")
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The header's own bindings; a region is bound by its full path like anything else.
    /// </summary>
    private static void BindHeader(CardHeaderRegion header)
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
            DemoUI.CreateOptionSection(CardGroup, "Card", nameof(CardMainController.CycleCardOption)),
            DemoUI.CreateOptionSection(HeaderGroup, "Layout", nameof(CardMainController.CycleHeaderOption)),
            DemoUI.CreateOptionSection(HeaderTextGroup, "Content", nameof(CardMainController.CycleHeaderTextOption)),
            DemoUI.CreateOptionSection(HeaderBadgeGroup, "Badge", nameof(CardMainController.CycleHeaderBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(CardMainController.CycleBorderOption))
        );
}
