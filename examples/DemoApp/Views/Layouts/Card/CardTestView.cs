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

internal sealed class CardTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.card.test";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container.AddChild(CreateInteractionGroup());

    private static ContainerComponent CreateInteractionGroup()
    {
        return DemoUI.CreateGroup(nameof(CardTestController.InteractionGroup), "Interaction",
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindClickable(nameof(CardInteractionGroupContext.Clickable), UIBindingScope.Relative)
                .OnClick(nameof(CardTestController.RecordClick))
                .ConfigureDefaultHeader(h => h.SetTitle("Clickable card"))
                .SetContent(new TextComponent().SetDescription("Click anywhere on this card."))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Clickable"] = nameof(CardTestController.ToggleClickable),
            })
        );
    }
}
