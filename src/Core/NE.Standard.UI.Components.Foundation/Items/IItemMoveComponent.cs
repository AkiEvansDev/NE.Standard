using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose page moves its items to another place — a drag, or Alt with an arrow — through templates it holds, so the <c>OnItemMove</c> shorthands reach it.
/// </summary>
public interface IItemMoveComponent
{
    /// <summary>
    /// Writes a move registration on every template an item is moved through, now and on every one set there later.
    /// </summary>
    void OnMovableItemTemplates(Action<IVisualComponent> register);
}
