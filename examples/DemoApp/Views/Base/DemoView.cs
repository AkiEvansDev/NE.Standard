using System.Collections.Generic;

namespace DemoApp.Views.Base;

internal abstract class DemoView : UIViewBase
{
    /// <summary>
    /// The title band and the sidebar stand, the sidebar from the top of the page; the content scrolls by itself; on a phone the
    /// sidebar is a drawer the header opens, the framework's default. Only the notification page overrides it.
    /// </summary>
    public override UIViewOptions Options { get; } = new() { StickyHeader = true, ScrollContentOnly = true, ShellLayout = UIShellLayout.FullHeightSides };

    protected abstract string ComponentRoute { get; }
    protected abstract DemoViewKind ViewKind { get; }
    protected abstract DemoViewKind[] AvailableKinds { get; }
    protected abstract string Header { get; }
    protected abstract string HeaderDescription { get; }

    /// <summary>The tab's name: the page's header, and which of its pages when there are several — a key, so it follows a switch.</summary>
    public override string Title
        => ViewKind is DemoViewKind.Main or DemoViewKind.Test ? "demo.title" : "demo.title.kind";

    /// <summary>The header and the page's kind, each a key.</summary>
    public override IReadOnlyDictionary<string, object?>? TitleArguments
        => ViewKind is DemoViewKind.Main or DemoViewKind.Test
            ? new Dictionary<string, object?> { ["page"] = new UIPhrase(Header) }
            : new Dictionary<string, object?> { ["page"] = new UIPhrase(Header), ["kind"] = new UIPhrase(DemoUI.KindKey(ViewKind)) };

    protected override IVisualComponent? CreateHeader()
        => DemoUI.CreateHeader(Header, HeaderDescription);

    protected override IVisualComponent? CreateLeftSide()
        => DemoUI.CreateSidebar(ComponentRoute);

    protected override IVisualComponent CreateContent()
    {
        // Groups have no inline padding of their own: 40 between two side by side, and 12 + 16 + 12 between two lines of them.
        WrapPanelComponent container = new WrapPanelComponent()
            .SetPadding(UIThickness.All(24, 4, 24, 24))
            .SetSpacing(40)
            .SetLineSpacing(16);

        // A component with one kind has no other page to switch to, so a strip of one link would be a label, not navigation.
        if (AvailableKinds.Length > 1)
            _ = container.AddChild(DemoUI.CreatePageTabs(ComponentRoute, ViewKind, AvailableKinds));

        DrawContent(container);

        return container;
    }

    protected abstract void DrawContent(WrapPanelComponent container);
}
