using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private Dictionary<string, ResolvedComponentContext> BuildComponentContexts(Dictionary<string, CompiledUIBindingSource> sourcesByKey, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, CompiledUIContext rootContext, CompiledPath rootPath)
    {
        Dictionary<string, ResolvedComponentContext> result = new(StringComparer.Ordinal);

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            ResolvedComponentContext baseContext = ResolveBaseComponentContext(component, sourcesByKey, templatesByKey, contextsByTemplateId, result, rootContext, rootPath);

            // In before its explicit context is built: a Parent scope asks whether this component defines an item scope itself.
            result.Add(component.Id, baseContext);

            if (component.Context is not null)
                result[component.Id] = ApplyExplicitComponentContext(component, baseContext, templatesByKey, contextsByTemplateId, result, rootPath);
        }

        return result;
    }

    private ResolvedComponentContext ResolveBaseComponentContext(IVisualComponent component, Dictionary<string, CompiledUIBindingSource> sourcesByKey, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledUIContext rootContext, CompiledPath rootPath)
    {
        if (TryResolveBoundItemsTemplateRootContext(component, templatesByKey, contextsByTemplateId, componentContexts, rootPath, out ResolvedComponentContext boundItemsContext))
            return boundItemsContext;

        if (TryResolveComponentItemsTemplateRootContext(component, sourcesByKey, templatesByKey, contextsByTemplateId, componentContexts, out ResolvedComponentContext componentItemsContext))
            return componentItemsContext;

        return ResolveInheritedComponentContext(component, componentContexts, rootContext, rootPath);
    }

    private bool TryResolveBoundItemsTemplateRootContext(IVisualComponent component, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, out ResolvedComponentContext resolved)
    {
        if (!TryGetItemsTemplateSlotOwner(component, out IVisualComponent? owner))
        {
            resolved = default;
            return false;
        }

        if (owner is not IItemsComponent itemsComponent || !TryGetItemsBinding(itemsComponent, out UIBinding itemsBinding))
        {
            resolved = default;
            return false;
        }

        // The same path the owner's Items binding compiles to, window property included — stopping at the
        // source would address every row one property too high.
        CompiledPath itemsPath = BuildItemsBindingPath(owner, itemsBinding, componentContexts, rootPath);
        CompiledPath itemPath = AppendDynamicParameter(itemsPath, GetComponentId(component.Id));
        CompiledUIBindingTemplate compiledTemplate = GetOrAddTemplate(templatesByKey, itemPath.Source, itemPath.Template);
        CompiledUIContext context = GetOrAddContext(contextsByTemplateId, compiledTemplate);

        resolved = new ResolvedComponentContext(context, itemPath, definesParameter: true);
        return true;
    }

    private bool TryGetItemsTemplateSlotOwner(IVisualComponent component, [NotNullWhen(true)] out IVisualComponent? owner)
    {
        if (!_slotByRootComponentId.TryGetValue(component.Id, out UIComponentSlot? slot) || !IsItemsTemplateSlot(slot.Kind))
        {
            owner = null;
            return false;
        }

        owner = _components[GetAuthoringId(slot.OwnerComponentId)];
        return true;
    }

    private static bool IsItemsTemplateSlot(UIComponentSlotKind kind)
        => kind is UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant or UIComponentSlotKind.GroupTemplate;

    private string GetAuthoringId(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return _authoringIdByComponentId.TryGetValue(componentId, out var authoringId)
            ? authoringId
            : throw new InvalidOperationException($"Component '{componentId}' was not found.");
    }

    private bool TryResolveComponentItemsTemplateRootContext(IVisualComponent component, Dictionary<string, CompiledUIBindingSource> sourcesByKey, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, Dictionary<string, ResolvedComponentContext> componentContexts, out ResolvedComponentContext resolved)
    {
        if (!TryGetItemsTemplateSlotOwner(component, out IVisualComponent? owner))
        {
            resolved = default;
            return false;
        }

        if (owner is not IItemsComponent itemsComponent)
        {
            resolved = default;
            return false;
        }

        if (TryGetItemsBinding(itemsComponent, out _))
        {
            resolved = default;
            return false;
        }

        // Static items, none of them yet, are still an item scope: the template's relative bindings name an item's members, not
        // the controller's.
        CompiledUIBindingSource source = GetOrAddComponentItemsSource(sourcesByKey, owner.Id);
        CompiledPath itemsRoot = new(source, RecursivePathTemplate.Empty, GetEnclosingScopeParameters(owner, componentContexts));
        CompiledPath itemPath = AppendDynamicParameter(itemsRoot, GetComponentId(component.Id));
        CompiledUIBindingTemplate compiledTemplate = GetOrAddTemplate(templatesByKey, itemPath.Source, itemPath.Template);
        CompiledUIContext context = GetOrAddContext(contextsByTemplateId, compiledTemplate);

        resolved = new ResolvedComponentContext(context, itemPath, definesParameter: true);
        return true;
    }

    /// <summary>
    /// The keys of the item scopes <paramref name="owner"/> already sits in, carried forward so that a
    /// collection starting a source of its own still addresses like the row it is rendered in.
    /// </summary>
    private static CompiledUIBindingParameter[] GetEnclosingScopeParameters(IVisualComponent owner, Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        if (!componentContexts.TryGetValue(owner.Id, out ResolvedComponentContext ownerContext))
            return [];

        List<CompiledUIBindingParameter> parameters = [];

        foreach (CompiledUIBindingParameter parameter in ownerContext.Path.Parameters)
        {
            // Fixed parameters are literal indices the author wrote, not something the client supplies, so they play no part in an address.
            if (parameter.Kind is CompiledUIBindingParameterKind.Dynamic or CompiledUIBindingParameterKind.Scope)
                parameters.Add(CompiledUIBindingParameter.Scope(parameter.ComponentId!.Value));
        }

        return [.. parameters];
    }

    private ResolvedComponentContext ResolveInheritedComponentContext(IVisualComponent component, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledUIContext rootContext, CompiledPath rootPath)
    {
        IVisualComponent? parent = TryGetParentComponent(component);

        return parent is not null && componentContexts.TryGetValue(parent.Id, out ResolvedComponentContext parentContext)
            ? new ResolvedComponentContext(parentContext.Context, parentContext.Path, definesParameter: false)
            : new ResolvedComponentContext(rootContext, rootPath, definesParameter: false);
    }

    private ResolvedComponentContext ApplyExplicitComponentContext(IVisualComponent component, ResolvedComponentContext baseContext, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        UIBinding binding = component.Context!.Value;

        // The component's base context is registered already, so a Relative scope reads it and a Parent scope the one above it.
        CompiledPath fullPath = BuildBindingPath(component, binding, componentContexts, rootPath);
        CompiledUIBindingTemplate compiledTemplate = GetOrAddTemplate(templatesByKey, fullPath.Source, fullPath.Template);
        CompiledUIContext context = GetOrAddContext(contextsByTemplateId, compiledTemplate);

        return new ResolvedComponentContext(context, fullPath, baseContext.DefinesParameter);
    }
}
