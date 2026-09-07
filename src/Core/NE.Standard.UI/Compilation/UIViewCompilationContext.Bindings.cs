using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Data;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private UIComponentState[] BuildStates(Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, List<CompiledUIBinding> bindings, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        UIComponentState[] states = new UIComponentState[_componentOrder.Count];

        for (var i = 0; i < _componentOrder.Count; i++)
            states[i] = BuildState(_componentOrder[i], templatesByKey, bindings, componentContexts, rootPath);

        return states;
    }

    private UIComponentState BuildState(IVisualComponent component, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, List<CompiledUIBinding> bindings, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        ValidateItemsView(component);

        UIPropertyDefinition[] definitions = GetPropertyDefinitions(component.TypeKey);
        List<CompiledUIPropertyValue> values = new(definitions.Length);

        foreach (UIPropertyDefinition definition in definitions)
        {
            UIBinding? sourceBinding = FindBinding(component, definition.Property);

            if (sourceBinding is not null)
            {
                EnsureBindableTarget(component, definition.Property, sourceBinding.Value.Mode);

                CompiledPath fullPath = definition.Property.Equals(IItemsComponent.ItemsProperty)
                    ? BuildItemsBindingPath(component, sourceBinding.Value, componentContexts, rootPath)
                    : BuildBindingPath(component, sourceBinding.Value, componentContexts, rootPath);

                // An items collection is one binding, not two — compiling it again as a scalar property would
                // send a value the client has no binding metadata for.
                CompiledUIBindingKind kind = definition.Property.Equals(IItemsComponent.ItemsProperty)
                    ? CompiledUIBindingKind.ComponentCollection
                    : CompiledUIBindingKind.ComponentProperty;

                CompiledUIBinding compiledBinding = AddBinding(
                    bindings,
                    templatesByKey,
                    kind,
                    component.Id,
                    definition.Property,
                    sourceBinding.Value.Mode,
                    fullPath,
                    definition.ValueType,
                    definition.Getter(component) ?? definition.DefaultValue
                );

                values.Add(new CompiledUIPropertyValue
                {
                    Property = definition.Property,
                    IsTranslatable = definition.IsTranslatable,
                    IsBind = true,
                    BindingId = compiledBinding.Id
                });

                continue;
            }

            if (TryBuildWindowGeometryPath(component, definition.Property, componentContexts, rootPath, out CompiledPath geometryPath))
            {
                CompiledUIBinding geometryBinding = AddBinding(
                    bindings,
                    templatesByKey,
                    CompiledUIBindingKind.ComponentProperty,
                    component.Id,
                    definition.Property,
                    UIBindingMode.OneWay,
                    geometryPath,
                    definition.ValueType
                );

                values.Add(new CompiledUIPropertyValue
                {
                    Property = definition.Property,
                    IsTranslatable = definition.IsTranslatable,
                    IsBind = true,
                    BindingId = geometryBinding.Id
                });

                continue;
            }

            var value = definition.Getter(component) ?? definition.DefaultValue;

            values.Add(new CompiledUIPropertyValue
            {
                Property = definition.Property,
                IsTranslatable = definition.IsTranslatable,
                IsBind = false,
                Value = CompilePropertyValue(value)
            });
        }

        return new UIComponentState(GetComponentId(component.Id), [.. values]);
    }

    private static UIBinding? FindBinding(IVisualComponent component, UIProperty property)
    {
        UIBinding? result = null;

        foreach (UIBinding binding in component.Bindings)
        {
            if (!binding.Target.Equals(property))
                continue;

            if (result is not null)
                throw new InvalidOperationException($"Property '{property.Name}' on component '{component.Id}' has multiple bindings.");

            result = binding;
        }

        return result;
    }

    private CompiledPath BuildBindingPath(IVisualComponent component, UIBinding binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        CompiledPath basePath = GetBindingScopeBasePath(component, binding.Scope, componentContexts, rootPath);
        return AppendPath(basePath, binding.Source);
    }

    private CompiledPath BuildBindingPath(IVisualComponent component, UIBindingPath binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        CompiledPath basePath = GetBindingScopeBasePath(component, binding.Scope, componentContexts, rootPath);
        return AppendPath(basePath, binding.Path);
    }

    private CompiledPath GetBindingScopeBasePath(IVisualComponent component, UIBindingScope scope, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        if (scope == UIBindingScope.Root)
            return rootPath;

        IVisualComponent? target = component;

        if (scope == UIBindingScope.Parent)
            target = TryGetEnclosingContextComponent(target, componentContexts);

        if (target is null)
            return rootPath;

        return componentContexts.TryGetValue(target.Id, out ResolvedComponentContext context)
            ? context.Path
            : rootPath;
    }

    private IVisualComponent? TryGetEnclosingContextComponent(IVisualComponent? target, Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        while (target is not null && !DefinesOwnContext(target, componentContexts))
            target = TryGetParentComponent(target);

        return TryGetParentComponent(target);
    }

    private static bool DefinesOwnContext(IVisualComponent component, Dictionary<string, ResolvedComponentContext> componentContexts)
        => componentContexts.TryGetValue(component.Id, out ResolvedComponentContext context) && context.DefinesParameter;

    private CompiledUIBinding AddBinding(List<CompiledUIBinding> bindings, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, CompiledUIBindingKind kind, string componentId, UIProperty property, UIBindingMode mode, CompiledPath fullPath, Type? targetValueType = null, object? targetFallbackValue = null)
    {
        CompiledUIBindingTemplate template = GetOrAddTemplate(templatesByKey, fullPath.Source, fullPath.Template);

        CompiledUIBinding binding = new()
        {
            Id = CreateBindingId(),
            Kind = kind,
            Address = new(GetComponentId(componentId), property),
            SourceId = fullPath.Source.Id,
            TemplateId = template.Id,
            Mode = mode,
            Parameters = fullPath.Parameters,
            DynamicParameterComponentIds = GetDynamicParameterComponentIds(fullPath.Parameters),
            TargetValueType = targetValueType,
            TargetFallbackValue = targetFallbackValue
        };

        bindings.Add(binding);

        return binding;
    }

    /// <summary>
    /// Synthesizes the binding for a windowed host's window geometry (offset, total count, has-more flags)
    /// from its items source.
    /// </summary>
    private bool TryBuildWindowGeometryPath(IVisualComponent component, UIProperty property, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, out CompiledPath path)
    {
        path = default;

        if (!IsWindowedItemsHost(component) || component is not IItemsComponent itemsComponent)
            return false;

        var member = ResolveWindowGeometryMember(property);

        if (member is null || !TryGetItemsBinding(itemsComponent, out UIBinding itemsBinding))
            return false;

        CompiledPath sourcePath = BuildBindingPath(component, itemsBinding, componentContexts, rootPath);

        path = AppendPath(sourcePath, RecursivePath.Parse(member));

        return true;
    }

    private static string? ResolveWindowGeometryMember(UIProperty property)
    {
        if (property.Equals(IItemsHostComponent.WindowOffsetProperty))
            return nameof(UIItemSourceBase.Offset);

        if (property.Equals(IItemsHostComponent.WindowTotalCountProperty))
            return nameof(UIItemSourceBase.TotalCount);

        if (property.Equals(IItemsHostComponent.WindowHasMoreBeforeProperty))
            return nameof(UIItemSourceBase.HasMoreBefore);

        if (property.Equals(IItemsHostComponent.WindowHasMoreAfterProperty))
            return nameof(UIItemSourceBase.HasMoreAfter);

        return null;
    }

    private object? CompilePropertyValue(object? value)
        => value switch
        {
            IUIResolvableValue resolvable => resolvable.Resolve(this),
            _ => value
        };

    /// <summary>
    /// Checks that every item collection can be addressed.
    /// </summary>
    private void ValidateItemCollections(Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            if (component is not IItemsComponent itemsComponent)
                continue;

            if (!TryGetItemsBinding(itemsComponent, out UIBinding itemsBinding))
            {
                EnsureWindowedHostBindsASource(component);
                EnsureStaticItemsAreBindable(component, itemsComponent);
                continue;
            }

            EnsureWindowedHostHasNoStaticItems(component, itemsComponent);
            EnsureWindowedSourceIsAnItemSource(component, BuildBindingPath(component, itemsBinding, componentContexts, rootPath));
            EnsureBoundItemsAreBindable(component, BuildItemsBindingPath(component, itemsBinding, componentContexts, rootPath));
        }
    }

    /// <summary>
    /// The path a component's <c>Items</c> binding compiles to; a windowed host also appends the property that
    /// holds its realized window.
    /// </summary>
    private CompiledPath BuildItemsBindingPath(IVisualComponent component, UIBinding binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        CompiledPath path = BuildBindingPath(component, binding, componentContexts, rootPath);

        return IsWindowedItemsHost(component)
            ? AppendPath(path, RecursivePath.Parse(UIItemSourceBase.WindowProperty))
            : path;
    }

    private static bool IsWindowedItemsHost(IVisualComponent component)
        => component is IItemsHostComponent { HostMode: UIItemsHostMode.Windowed };

    private static bool TryGetItemsBinding(IItemsComponent component, out UIBinding binding)
    {
        foreach (UIBinding current in component.Bindings)
        {
            if (current.Target.Equals(IItemsComponent.ItemsProperty))
            {
                binding = current;
                return true;
            }
        }

        binding = default;
        return false;
    }
}
