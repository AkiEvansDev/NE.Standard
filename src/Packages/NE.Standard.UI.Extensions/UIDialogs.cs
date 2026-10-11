using System;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A dialog headed by its mark, its title and an × that closes it: the × closes it on the page as Escape does, with nothing asked of
/// the server but the dialog's own <c>OnClose</c>, and the title names the dialog for a screen reader.
/// </summary>
public static class UIDialogs
{
    /// <summary>A dialog with its header over <paramref name="content"/>, named by its title; the rest of the dialog keeps its defaults.</summary>
    public static UIDialog Create(string key, string title, IVisualComponent content, string? icon = null)
        => new() { Key = key, Label = title, Content = Content(key, title, content, icon) };

    /// <summary>
    /// The header over <paramref name="content"/>, for a dialog that sets more of its own (a width, a sheet, no backdrop close):
    /// <c>new UIDialog { Key = key, Label = title, Content = UIDialogs.Content(key, title, body), Width = … }</c>.
    /// </summary>
    public static StackPanelComponent Content(string key, string title, IVisualComponent content, string? icon = null)
    {
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16, Header(key, title, icon), content);
    }

    /// <summary>The header alone: the mark where one is given, the title, and the × at the far end, on one line.</summary>
    public static ContainerComponent Header(string key, string title, string? icon = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        ButtonComponent close = UIIconButtons.Close()
            .SetSize(UIButtonSize.Small)
            .SetMargin(UIThickness.All(8, 0, 0, 0))
            .SetPlacement(24, 1, 1, 1);

        // A close the viewer makes, as Escape's: the dialog's OnClose hears it.
        _ = close.InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true });

        // The mark is the title's own, on its line: one line of words needs no column of its own for it.
        return new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(UIText.Title(title).SetIcon(icon).SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 23, 1))
            .AddChild(close);
    }
}
