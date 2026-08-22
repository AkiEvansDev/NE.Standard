using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private void EnsureBindableTarget(IVisualComponent component, UIProperty property, UIBindingMode mode)
    {
        var typeKey = component.TypeKey;
        UIPropertyDefinition definition = GetRequiredPropertyDefinition(typeKey, property);

        if (!definition.IsBindable)
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeKey}' does not support binding.");

        if (!mode.IsSupportedBy(definition.BindingCapabilities))
            throw new InvalidOperationException($"Binding mode '{mode}' is not supported for property '{property.Name}' on component type '{typeKey}'.");

        // An OnSubmit value is held on the client until the form it belongs to is submitted, and a form is a
        // FormId shared with a submit button. Without one the value would be buffered and never sent, which
        // reads exactly like a broken binding.
        if (mode == UIBindingMode.OnSubmit
            && component is IInputComponent input
            && string.IsNullOrWhiteSpace(input.FormId)
            && FindBinding(component, IInputComponent.FormIdProperty) is null)
        {
            throw new InvalidOperationException(
                $"Property '{property.Name}' on component type '{typeKey}' is bound '{mode}' but the component has no 'FormId', so its value could never be submitted."
            );
        }
    }

    private UIPropertyDefinition GetRequiredPropertyDefinition(string typeKey, UIProperty property)
    {
        UIPropertyDefinition[] definitions = GetPropertyDefinitions(typeKey);

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            if (definition.Property.Equals(property))
                return definition;
        }

        throw new InvalidOperationException($"Property definition for '{property.Name}' was not found in component '{typeKey}'.");
    }

    private UIPropertyDefinition[] GetPropertyDefinitions(string typeKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(typeKey);

        if (_propertyDefinitionsCache.TryGetValue(typeKey, out UIPropertyDefinition[]? definitions))
            return definitions;

        definitions = UIPropertyRegister.GetProperties(typeKey);
        _propertyDefinitionsCache.Add(typeKey, definitions);

        return definitions;
    }

    private void EnsurePropertyDefinitionsInitialized(IVisualComponent component)
    {
        Type componentType = component.GetType();

        if (!_initializedComponentTypes.Add(componentType))
            return;

        List<Type> hierarchy = [];

        for (Type? current = componentType; current is not null && current != typeof(object); current = current.BaseType)
            hierarchy.Add(current);

        for (var i = hierarchy.Count - 1; i >= 0; i--)
            RuntimeHelpers.RunClassConstructor(hierarchy[i].TypeHandle);
    }
}
