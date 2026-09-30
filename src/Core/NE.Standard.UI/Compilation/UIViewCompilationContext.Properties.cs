using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Components.BuiltIns.Inputs;
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

        // An OnSubmit value is buffered on the client until a shared FormId submits it; without one it would never be sent.
        if (mode == UIBindingMode.OnSubmit
            && component is IInputComponent input
            && string.IsNullOrWhiteSpace(input.FormId)
            && FindBinding(component, IInputComponent.FormIdProperty) is null)
        {
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeKey}' is bound '{mode}' but the component has no 'FormId', so its value could never be submitted.");
        }
    }

    /// <summary>
    /// Refuses a text area whose Enter submits its form (<c>SubmitOnEnter</c>, set or bound) but that belongs to no form: Enter would
    /// press no button and break no line either.
    /// </summary>
    private void EnsureSubmitOnEnterHasForm(IVisualComponent component)
    {
        if (component is not IInputComponent input
            || !string.IsNullOrWhiteSpace(input.FormId)
            || FindBinding(component, IInputComponent.FormIdProperty) is not null)
        {
            return;
        }

        UIPropertyDefinition[] definitions = GetPropertyDefinitions(component.TypeKey);

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            if (!definition.Property.Equals(TextAreaComponent.SubmitOnEnterProperty))
                continue;

            if (definition.Getter(component) is true || FindBinding(component, definition.Property) is not null)
                throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' submits on Enter but has no 'FormId', so Enter would have no form to submit.");

            return;
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
}
