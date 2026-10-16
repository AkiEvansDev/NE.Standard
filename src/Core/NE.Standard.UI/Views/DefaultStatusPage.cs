using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Views;

/// <summary>
/// The default not-found and error pages' frame: their status in the middle of the window, which they have to themselves.
/// </summary>
internal static class DefaultStatusPage
{
    public static ContainerComponent Create(StatusComponent status)
        => new ContainerComponent()
            .SetHeight(UILayoutLength.Fill())
            .SetPadding(UIThickness.Uniform(24))
            .AddChild(status.SetPlacement(1, 1, 24, 1));

    /// <summary>The way back to the application's root, raising <paramref name="command"/>.</summary>
    public static ButtonComponent HomeButton(string command)
        => new ButtonComponent()
            .SetTitle(UIStrings.StatusHome)
            .SetType(UIButtonType.Primary)
            .OnClick(command);
}
