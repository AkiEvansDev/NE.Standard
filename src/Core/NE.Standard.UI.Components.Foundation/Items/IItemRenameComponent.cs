using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Items;

/// <summary>
/// A component whose page renames its items in place through templates it holds, so the <c>OnItemRename</c> shorthands reach it.
/// </summary>
public interface IItemRenameComponent
{
    /// <summary>
    /// Writes a rename registration on every template an item is renamed through, now and on every one set there later.
    /// </summary>
    void OnRenamableItemTemplates(Action<IVisualComponent> register);
}
