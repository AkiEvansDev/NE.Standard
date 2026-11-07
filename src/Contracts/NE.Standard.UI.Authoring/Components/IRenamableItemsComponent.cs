using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component or host whose title the reader renames in place — a standalone text's, a tree's nodes, a strip's tabs.
/// </summary>
public interface IRenamableItemsComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Renamable"/>.
    /// </summary>
    static UIProperty RenamableProperty { get; } = new(nameof(Renamable));

    /// <summary>
    /// Gets whether the component's or host's own gesture renames a title in place — F2 or double click; in a host, an item that says
    /// <c>CanRename</c> false keeps its title, while a rename the application asks for (<c>RenameItemEffect</c>, a menu's entry) opens
    /// the field either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? Renamable { get; }
}
