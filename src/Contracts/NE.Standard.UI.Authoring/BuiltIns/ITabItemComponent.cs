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
    /// Gets the tab's label — icon, title and badge — rendered inside its own tab button.
    /// </summary>
    ITextComponent? Caption { get; }

    /// <summary>
    /// Gets the content shown in the tab panel when this tab is the active one.
    /// </summary>
    IVisualComponent? Page { get; }

    /// <summary>
    /// Sets the page this tab opens.
    /// </summary>
    ITabItemComponent SetPage(IVisualComponent page);

    /// <summary>
    /// Adds a handler that invokes the specified command when this tab's close is pressed; the controller removes the tab or leaves it.
    /// </summary>
    ITabItemComponent OnRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments);

    /// <summary>
    /// Adds a handler that invokes the specified command when this tab's caption is renamed in place.
    /// </summary>
    ITabItemComponent OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments);
}
