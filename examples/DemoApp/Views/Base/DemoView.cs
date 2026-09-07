using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Base;

internal abstract class DemoView : UIViewBase
{
    /// <summary>
    /// The title band and the sidebar stand; the content scrolls by itself. Only the notification page overrides it.
    /// </summary>
    public override UIViewOptions Options { get; } = new() { StickyHeader = true, ScrollContentOnly = true };

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
            .SetSpacing(16);

        // Drawn even for a component with one page, or its content would start higher than its neighbours'.
        if (AvailableKinds.Length > 0)
            _ = container.AddChild(DemoUI.CreatePageTabs(ComponentRoute, ViewKind, AvailableKinds));

        DrawContent(container);

        return container;
    }

    protected abstract void DrawContent(WrapPanelComponent container);
}
