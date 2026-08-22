using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Views;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Base;

internal abstract class DemoView : UIViewBase
{
    /// <summary>
    /// Every demo page keeps its title band in place while the page scrolls, which is also what demonstrates
    /// the option: only the notification page overrides this, and it does so to move its toasts.
    /// </summary>
    public override UIViewOptions Options { get; } = new() { StickyHeader = true };

    protected abstract string ComponentRoute { get; }
    protected abstract DemoViewKind ViewKind { get; }
    protected abstract DemoViewKind[] AvailableKinds { get; }
    protected abstract string Header { get; }
    protected abstract string HeaderDescription { get; }

    protected override IVisualComponent? CreateHeader()
        => DemoUI.CreateHeader(Header, HeaderDescription);

    protected override IVisualComponent? CreateLeftSide()
        => DemoUI.CreateSidebar(ComponentRoute);

    protected override IVisualComponent CreateContent()
    {
        WrapPanelComponent container = new WrapPanelComponent()
            .SetPadding(UIThickness.All(24, 4, 24, 24))
            .SetHorizontalGap(16)
            .SetVerticalGap(16);

        if (AvailableKinds.Length > 1)
            _ = container.AddChild(DemoUI.CreatePageTabs(ComponentRoute, ViewKind, AvailableKinds));

        DrawContent(container);

        return container;
    }

    protected abstract void DrawContent(WrapPanelComponent container);
}
