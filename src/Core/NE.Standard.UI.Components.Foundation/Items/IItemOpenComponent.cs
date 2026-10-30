using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose page opens its items — Enter on the keyboard's row, or a double click — through templates it holds, so the <c>OnItemOpen</c> shorthands reach it.
/// </summary>
public interface IItemOpenComponent
{
    /// <summary>
    /// Writes an open registration on every template an item is opened through, now and on every one set there later.
    /// </summary>
    void OnOpenableItemTemplates(Action<IVisualComponent> register);
}
