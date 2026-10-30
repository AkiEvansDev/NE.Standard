using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose items are clicked through templates it holds, so the <c>OnItemClick</c> shorthands reach it.
/// </summary>
public interface IItemClickComponent
{
    /// <summary>
    /// Writes a click registration on every template an item is clicked through, now and on every one set there later.
    /// </summary>
    void OnClickableItemTemplates(Action<IVisualComponent> register);
}
