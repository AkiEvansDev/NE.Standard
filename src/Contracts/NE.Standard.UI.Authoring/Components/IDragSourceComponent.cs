using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A host whose items are dragged out of it, offered as a kind: a component taking that kind (<c>OnDrop</c>) receives them, whatever
/// it is — another list, a tree, a field.
/// </summary>
public interface IDragSourceComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="DragKind"/>.
    /// </summary>
    static UIProperty DragKindProperty { get; } = new(nameof(DragKind));

    /// <summary>
    /// Gets the registered property key for <see cref="DragEffects"/>.
    /// </summary>
    static UIProperty DragEffectsProperty { get; } = new(nameof(DragEffects));

    /// <summary>
    /// Gets the kind the host's items are offered as, dragged or cut out of it — lower-case letters, digits and hyphens — or null
    /// for none. A tree's folder goes with what it holds.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    string? DragKind { get; }

    /// <summary>
    /// Gets what a drop may do with the items: move them out of the host, copy them, or either, the drop deciding.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIDragEffects.All)]
    UIDragEffects? DragEffects { get; }
}
