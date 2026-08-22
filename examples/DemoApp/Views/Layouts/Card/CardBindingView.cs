using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Card;

internal sealed class CardBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.card.binding";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateContentGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new CardComponent()
            .ConfigureDefaultHeader(h => h.SetTitle("Card title"))
            .SetContent(new TextComponent().SetTitle("Card content."))
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(CardBindingController.ContentGroup), "Content",
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .ConfigureDefaultHeader(h => h
                    .SetTitle("Card title")
                    .SetDescription("Supporting description")
                    .BindIcon(nameof(CardContentGroupContext.HeaderIcon), UIBindingScope.Relative)
                    .BindBadgeText(nameof(CardContentGroupContext.HeaderBadge), UIBindingScope.Relative)
                    .BindSelectable(nameof(CardContentGroupContext.HeaderSelectable), UIBindingScope.Relative)
                )
                .SetContent(new TextComponent().SetTitle("Card content."))
                .SetFooter(new TextComponent().SetTitle("Card footer.").SetTitleType(UITextAppearance.Caption).SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted)))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Header icon"] = nameof(CardBindingController.ToggleHeaderIcon),
                ["Header badge"] = nameof(CardBindingController.ToggleHeaderBadge),
                ["Header selectable"] = nameof(CardBindingController.ToggleHeaderSelectable),
            })
        );
    }
}
