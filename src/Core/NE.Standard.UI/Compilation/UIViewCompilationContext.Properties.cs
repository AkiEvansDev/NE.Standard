using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;

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
    /// Refuses a text area whose Enter submits its form (<c>SubmitOnEnter</c>, set or bound) but that also runs a command on Enter
    /// (<c>OnEnter</c>) — one key cannot do both — or that belongs to no form: Enter would press no button and break no line either.
    /// </summary>
    private void EnsureSubmitOnEnterIsSound(IVisualComponent component)
    {
        if (component is not IInputComponent input || !SubmitsOnEnter(component))
            return;

        for (var i = 0; i < component.Events.Count; i++)
        {
            if (string.Equals(component.Events[i].Name, EventNames.Enter, StringComparison.Ordinal))
                throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' both submits on Enter and runs a command on Enter ('OnEnter'); Enter does one of them, so drop 'SubmitOnEnter' or the 'OnEnter' command.");
        }

        if (string.IsNullOrWhiteSpace(input.FormId) && FindBinding(component, IInputComponent.FormIdProperty) is null)
            throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' submits on Enter but has no 'FormId', so Enter would have no form to submit.");
    }

    /// <summary>
    /// Refuses a file or image input whose <c>DropTargetId</c> names a component the view does not have: a misspelled id would leave the
    /// composer silently taking nothing, so it is said when the view compiles, as a misspelled effect target is.
    /// </summary>
    private void EnsureDropTargetIsInView(IVisualComponent component)
    {
        UIPropertyDefinition[] definitions = GetPropertyDefinitions(component.TypeKey);

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            if (!definition.Property.Equals(FileInputComponent.DropTargetIdProperty) && !definition.Property.Equals(ImageInputComponent.DropTargetIdProperty))
                continue;

            if (definition.Getter(component) is string { Length: > 0 } dropTarget && !_componentIdsByAuthoringId.ContainsKey(dropTarget))
                throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' names DropTargetId '{dropTarget}', which the view does not have.");

            return;
        }
    }

    /// <summary>
    /// Refuses a pager aimed at nothing, at a component the view does not have, or at a host whose window is not a page — one holding
    /// its rows whole, or a windowed one whose scroll reads the next window; and a page size of no rows.
    /// </summary>
    private void EnsurePagerTargetPages(IVisualComponent component)
    {
        UIPropertyDefinition[] definitions = GetPropertyDefinitions(component.TypeKey);
        string? target = null;
        var isPager = false;

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            if (definition.Property.Equals(PagerComponent.TargetProperty))
            {
                isPager = true;
                target = definition.Getter(component) as string;
            }
            else if (definition.Property.Equals(PagerComponent.PageSizesProperty) && definition.Getter(component) is IReadOnlyList<int> sizes)
            {
                for (var j = 0; j < sizes.Count; j++)
                {
                    if (sizes[j] <= 0)
                        throw new InvalidOperationException($"Pager '{component.Id}' offers a page size of {sizes[j]}; a page holds one row or more.");
                }
            }
        }

        if (!isPager)
            return;

        if (string.IsNullOrWhiteSpace(target))
            throw new InvalidOperationException($"Pager '{component.Id}' names no Target; aim it at the items view or table it pages with SetTarget(id).");

        if (!_components.TryGetValue(target, out IVisualComponent? host))
            throw new InvalidOperationException($"Pager '{component.Id}' names Target '{target}', which the view does not have.");

        if (host is not IItemsHostComponent itemsHost)
            throw new InvalidOperationException($"Pager '{component.Id}' names Target '{target}', a '{host.TypeKey}', which has no window to page; aim it at an items view or a table.");

        if (itemsHost.HostMode != UIItemsHostMode.Windowed)
            throw new InvalidOperationException($"Pager '{component.Id}' names Target '{target}', which holds its rows whole ({itemsHost.HostMode}); a pager turns the pages of a source: bind the host with BindSource(...) and SetPaging(true).");

        if (itemsHost.Paging != true && FindBinding(host, IItemsHostComponent.PagingProperty) is null)
            throw new InvalidOperationException($"Pager '{component.Id}' names Target '{target}', whose window is not a page: its scroll reads the next window. Say SetPaging(true) on it, or bind Paging.");
    }

    /// <summary>Whether a component says <c>SubmitOnEnter</c>, set or bound.</summary>
    private bool SubmitsOnEnter(IVisualComponent component)
    {
        UIPropertyDefinition[] definitions = GetPropertyDefinitions(component.TypeKey);

        for (var i = 0; i < definitions.Length; i++)
        {
            UIPropertyDefinition definition = definitions[i];

            if (definition.Property.Equals(TextAreaComponent.SubmitOnEnterProperty))
                return definition.Getter(component) is true || FindBinding(component, definition.Property) is not null;
        }

        return false;
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
