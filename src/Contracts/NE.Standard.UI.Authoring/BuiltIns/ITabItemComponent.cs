using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents one tab of a tabs view: a caption and the page it opens.
/// </summary>
public interface ITabItemComponent : IVisualComponent
{
    /// <summary>
    /// Gets the caption.
    /// </summary>
    ITextComponent? Caption { get; }

    /// <summary>
    /// Gets the page this tab opens.
    /// </summary>
    IVisualComponent? Page { get; }

    /// <summary>
    /// Sets the page this tab opens.
    /// </summary>
    ITabItemComponent SetPage(IVisualComponent page);

    /// <summary>
    /// Adds a handler that invokes the specified command when this tab's close button is pressed.
    /// </summary>
    ITabItemComponent OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments);

    /// <summary>
    /// Adds a handler that invokes the specified command when this tab's caption is renamed in place.
    /// </summary>
    ITabItemComponent OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments);
}
