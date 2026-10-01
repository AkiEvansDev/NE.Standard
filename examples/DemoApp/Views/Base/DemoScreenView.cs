namespace DemoApp.Views.Base;

/// <summary>
/// A piece of a real application rather than a component's page: a form, a catalogue, an inbox, built from many components
/// at once and from the presets in <c>NE.Standard.UI.Extensions</c>.
/// </summary>
internal abstract class DemoScreenView : DemoView
{
    /// <summary>
    /// Whether the screen takes the content region's height rather than its own content's: a messenger, whose panes scroll inside
    /// themselves and keep the composer in sight. Never shorter than a pane's header, a few rows and its composer; below that the
    /// region scrolls.
    /// </summary>
    protected virtual bool FillsHeight => false;

    // The screen is a sample as a whole, its copy and its data shown as written: content for the unkeyed report.
    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        if (FillsHeight)
            _ = container.SetHeight(UILayoutLength.Fill()).SetMinHeight(UILayoutLength.Absolute(360));

        _ = container.AsContentTree().AddChild(CreateScreen());
    }

    protected abstract IVisualComponent CreateScreen();
}
