using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose page unfolds its items before their children are in the list, through templates it holds, so the <c>OnItemUnfold</c> shorthands reach it.
/// </summary>
public interface IItemUnfoldComponent
{
    /// <summary>
    /// Writes an unfold registration on every template an item is unfolded through, now and on every one set there later.
    /// </summary>
    void OnUnfoldableItemTemplates(Action<IVisualComponent> register);
}
