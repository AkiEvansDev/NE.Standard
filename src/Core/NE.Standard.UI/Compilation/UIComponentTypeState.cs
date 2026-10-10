using System;
using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// What every component of a type shares in its compiled state: the slot layout, and the one value each property compiles to
/// while a component leaves it at its registered default.
/// </summary>
internal sealed class UIComponentTypeState
{
    // Process-wide like the property register it mirrors, so every view's components of a type share one layout.
    private static readonly ConcurrentDictionary<string, UIComponentTypeState> ByType = new(StringComparer.Ordinal);

    private readonly CompiledUIPropertyValue?[] _defaults;

    private UIComponentTypeState(UIPropertyDefinition[] definitions)
    {
        Definitions = definitions;
        _defaults = new CompiledUIPropertyValue?[definitions.Length];

        UIProperty[] properties = new UIProperty[definitions.Length];

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            properties[i] = definition.Property;

            // A default resolved against its view's references compiles per view, so it has no value to share.
            if (definition.DefaultValue is IUIResolvableValue)
                continue;

            _defaults[i] = new CompiledUIPropertyValue
            {
                Property = definition.Property,
                IsTranslatable = definition.IsTranslatable,
                IsBind = false,
                Value = UIPhrase.AsValue(definition.DefaultValue)
            };
        }

        Layout = new UIComponentStateLayout(properties);
    }

    /// <summary>Gets the layout every component of the type keeps its values in.</summary>
    public UIComponentStateLayout Layout { get; }

    /// <summary>Gets the type's property definitions, one per slot of <see cref="Layout"/>.</summary>
    public UIPropertyDefinition[] Definitions { get; }

    /// <summary>The shared state of a component type whose properties are the given definitions, in their order.</summary>
    public static UIComponentTypeState For(string typeKey, UIPropertyDefinition[] definitions)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(typeKey);
        ArgumentNullException.ThrowIfNull(definitions);

        if (ByType.TryGetValue(typeKey, out UIComponentTypeState? state) && state.Describes(definitions))
            return state;

        state = new UIComponentTypeState(definitions);
        ByType[typeKey] = state;

        return state;
    }

    // A type that registered more properties since its layout was made gets a new one rather than a stale one.
    private bool Describes(UIPropertyDefinition[] definitions)
    {
        if (definitions.Length != Definitions.Length)
            return false;

        for (var i = 0; i < definitions.Length; i++)
        {
            if (!ReferenceEquals(definitions[i], Definitions[i]))
                return false;
        }

        return true;
    }

    /// <summary>The definition of a property the type registers, if it registers it.</summary>
    public bool TryGetDefinition(UIProperty property, [NotNullWhen(true)] out UIPropertyDefinition? definition)
    {
        definition = Layout.TryGetSlot(property, out var slot) ? Definitions[slot] : null;

        return definition is not null;
    }

    /// <summary>The shared value of a slot whose static value is its property's registered default, as written, not content.</summary>
    public bool TryGetDefault(int slot, object? value, [NotNullWhen(true)] out CompiledUIPropertyValue? shared)
    {
        shared = _defaults[slot];

        return shared is not null && value is not IUIResolvableValue && Equals(value, Definitions[slot].DefaultValue);
    }
}
