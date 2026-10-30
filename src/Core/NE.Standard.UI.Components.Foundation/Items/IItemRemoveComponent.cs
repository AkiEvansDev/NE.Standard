using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose page asks to remove its items — the Delete key on a row, or a tab's close — through templates it holds, so the <c>OnItemRemove</c> shorthands reach it.
/// </summary>
public interface IItemRemoveComponent
{
    /// <summary>
    /// Writes a remove registration on every template an item is removed through, now and on every one set there later.
    /// </summary>
    void OnRemovableItemTemplates(Action<IVisualComponent> register);
}
