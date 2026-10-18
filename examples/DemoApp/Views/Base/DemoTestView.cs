namespace DemoApp.Views.Base;

/// <summary>
/// A page for what has no component to preview — the dialog and the notification: groups that each ask for one, and the line the
/// answer leaves on the page.
/// </summary>
internal abstract class DemoTestView : DemoView
{
    /// <summary>A button asking for one thing: <paramref name="command"/>, at the start of its row.</summary>
    protected static ButtonComponent CreateButton(string title, string command, UIButtonType type)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(type)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetTitle(title);
}
