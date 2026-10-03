namespace DemoApp.Views.Base;

/// <summary>
/// A piece of a real application rather than a component's page: a form, a catalogue, an inbox, built from many components
/// at once and from the presets in <c>NE.Standard.UI.Extensions</c>.
/// </summary>
internal abstract class DemoScreenView : DemoView
{
    /// <summary>
    /// The screen's height where it takes the content region's rather than its own content's: a messenger or an editor, whose panes
    /// scroll inside themselves and keep the composer or the status line in sight. Never shorter than a pane's header, a few rows and
    /// its foot; below that the region scrolls. Unset, the screen is as tall as its content.
    /// </summary>
    protected virtual UIResponsive<UILayoutLength>? ScreenHeight => null;

    // The screen is a sample as a whole, its copy and its data shown as written: content for the unkeyed report.
    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        if (ScreenHeight is { } height)
            _ = container.SetHeight(height).SetMinHeight(UILayoutLength.Absolute(360));

        _ = container.AsContentTree().AddChild(CreateScreen());
    }

    protected abstract IVisualComponent CreateScreen();
}
