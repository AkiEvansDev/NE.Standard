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
    protected abstract string Header { get; }
    protected abstract string HeaderDescription { get; }

    /// <summary>The tab's name: the page's header, a key, so it follows a switch.</summary>
    public override string Title => "demo.title";

    /// <summary>The header, as a key.</summary>
    public override IReadOnlyDictionary<string, object?>? TitleArguments
        => new Dictionary<string, object?> { ["page"] = new UIPhrase(Header) };

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

        DrawContent(container);

        return container;
    }

    protected abstract void DrawContent(WrapPanelComponent container);
}
