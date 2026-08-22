using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Resolves authoring-time component and property references to compiled runtime addresses.
/// </summary>
public interface IUIReferenceResolver
{
    /// <summary>
    /// Resolves a property reference to a compiled property address.
    /// </summary>
    UIPropertyAddress ResolveProperty(UIPropertyReference reference)
        => new(ResolveComponent(reference.Component), reference.Property);

    /// <summary>
    /// Resolves a component reference to a compiled component address.
    /// </summary>
    UIComponentAddress ResolveComponent(UIComponentReference reference)
        => new(ResolveComponentId(reference.Id), reference.DynamicParameters);

    /// <summary>
    /// Resolves an authoring component id to a compiled component id.
    /// </summary>
    UIComponentId ResolveComponentId(string componentId);

    /// <summary>
    /// Resolves an items view to the runtime representation supported by the current host.
    /// </summary>
    object ResolveItemsView(UIItemsView itemsView)
        => itemsView;
}
