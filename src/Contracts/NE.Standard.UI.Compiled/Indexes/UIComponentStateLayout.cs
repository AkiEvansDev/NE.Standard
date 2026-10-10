using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// The properties a component's state holds, each at its slot; one layout is shared by every component of a type.
/// </summary>
public sealed class UIComponentStateLayout
{
    private readonly UIProperty[] _properties;
    private readonly FrozenDictionary<UIProperty, int> _slots;

    /// <summary>
    /// Creates a layout of the given properties, each at its index.
    /// </summary>
    public UIComponentStateLayout(IReadOnlyList<UIProperty> properties)
    {
        ArgumentNullException.ThrowIfNull(properties);

        _properties = new UIProperty[properties.Count];

        Dictionary<UIProperty, int> slots = new(properties.Count);

        for (var i = 0; i < properties.Count; i++)
        {
            UIProperty property = properties[i];

            if (!slots.TryAdd(property, i))
                throw new InvalidOperationException($"Property '{property.Name}' appears twice in a component state layout.");

            _properties[i] = property;
        }

        _slots = slots.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets the properties in slot order.
    /// </summary>
    public IReadOnlyList<UIProperty> Properties => _properties;

    /// <summary>
    /// Gets how many slots the layout has.
    /// </summary>
    public int Count => _properties.Length;

    /// <summary>
    /// Attempts to get the slot a property's value stands at.
    /// </summary>
    public bool TryGetSlot(UIProperty property, out int slot)
        => _slots.TryGetValue(property, out slot);
}
