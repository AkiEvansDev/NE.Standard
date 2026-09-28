namespace DemoApp.Views.Base;

internal abstract class DemoView : UIViewBase
{
    /// <summary>
    /// The title band and the sidebar stand, the sidebar from the top of the page; the content scrolls by itself; on a phone the
    /// sidebar is a drawer the header opens. Only the notification page overrides it.
    /// </summary>
    public override UIViewOptions Options { get; } = new() { StickyHeader = true, ScrollContentOnly = true, ShellLayout = UIShellLayout.FullHeightSides, SideDrawers = true };

    protected abstract string ComponentRoute { get; }
    protected abstract DemoViewKind ViewKind { get; }
    protected abstract DemoViewKind[] AvailableKinds { get; }
    protected abstract string Header { get; }
    protected abstract string HeaderDescription { get; }

    /// <summary>The tab's name: the page's header, and which of its pages when there are several.</summary>
    /// <remarks>The header's words rather than its key: the host translates a title whole, and a key with words after it is no key.</remarks>
    public override string Title
        => ViewKind is DemoViewKind.Main or DemoViewKind.Test ? $"{DemoTranslations.Text(Header)} · NE.Standard" : $"{DemoTranslations.Text(Header)} · {ViewKind} · NE.Standard";

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
