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
                    : BuildBindingPath(component, sourceBinding.Value, componentContexts, rootPath, includeSelfContext: true);

                // An items collection is one binding, not two. It used to be compiled here as an ordinary
                // property *and* again by the collection pass, and the property copy made the runtime push the
                // whole collection as a scalar value update — which no renderer registers a property for, so
                // the client received a value it had no binding metadata for and warned on every attach.
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
                    definition.ValueType
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

    private CompiledPath BuildBindingPath(IVisualComponent component, UIBinding binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, bool includeSelfContext)
    {
        CompiledPath basePath = GetBindingScopeBasePath(component, binding.Scope, componentContexts, rootPath, includeSelfContext);
        return AppendPath(basePath, binding.Source);
    }

    private CompiledPath BuildBindingPath(IVisualComponent component, UIBindingPath binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, bool includeSelfContext)
    {
        CompiledPath basePath = GetBindingScopeBasePath(component, binding.Scope, componentContexts, rootPath, includeSelfContext);
        return AppendPath(basePath, binding.Path);
    }

    private CompiledPath GetBindingScopeBasePath(IVisualComponent component, UIBindingScope scope, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, bool includeSelfContext)
    {
        if (scope == UIBindingScope.Root)
            return rootPath;

        IVisualComponent? target = includeSelfContext ? component : TryGetParentComponent(component);

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

    private CompiledUIBinding AddBinding(List<CompiledUIBinding> bindings, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, CompiledUIBindingKind kind, string componentId, UIProperty property, UIBindingMode mode, CompiledPath fullPath, Type? targetValueType = null)
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
            TargetValueType = targetValueType
        };

        bindings.Add(binding);

        return binding;
    }

    /// <summary>
    /// Binds a windowed host's geometry — where its window starts, how much there is, whether either side has
    /// more — to the source that knows. Synthesized rather than authored: the numbers live on the source, the
    /// client needs them to draw a scrollbar over items it does not hold, and nobody should have to wire that
    /// up by hand.
    /// </summary>
    private bool TryBuildWindowGeometryPath(IVisualComponent component, UIProperty property, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath, out CompiledPath path)
    {
        path = default;

        if (!IsWindowedItemsHost(component) || component is not IItemsComponent itemsComponent)
            return false;

        var member = ResolveWindowGeometryMember(property);

        if (member is null || !TryGetItemsBinding(itemsComponent, out UIBinding itemsBinding))
            return false;

        CompiledPath sourcePath = BuildBindingPath(component, itemsBinding, componentContexts, rootPath, includeSelfContext: true);

        path = AppendPath(sourcePath, RecursivePath.Parse(member));

        return true;
    }

    private static string? ResolveWindowGeometryMember(UIProperty property)
    {
        if (property.Equals(ISourceItemsComponent.WindowOffsetProperty))
            return nameof(UIItemSourceBase.Offset);

        if (property.Equals(ISourceItemsComponent.WindowTotalCountProperty))
            return nameof(UIItemSourceBase.TotalCount);

        if (property.Equals(ISourceItemsComponent.WindowHasMoreBeforeProperty))
            return nameof(UIItemSourceBase.HasMoreBefore);

        if (property.Equals(ISourceItemsComponent.WindowHasMoreAfterProperty))
            return nameof(UIItemSourceBase.HasMoreAfter);

        return null;
    }

    private object? CompilePropertyValue(object? value)
        => value switch
        {
            IUIResolvableValue resolvable => resolvable.Resolve(this),
            _ => value
        };

    private void AddComponentContextBindings(Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, List<CompiledUIBinding> bindings, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            if (component.Context is null)
                continue;

            ResolvedComponentContext baseContext = ResolveBaseComponentContextForExisting(component, componentContexts, rootPath);
            CompiledPath fullPath = BuildContextPath(component, component.Context.Value, baseContext, componentContexts, rootPath);

            _ = AddBinding(
                bindings,
                templatesByKey,
                CompiledUIBindingKind.ComponentContext,
                component.Id,
                new UIProperty(nameof(IBindableComponent.Context)),
                component.Context.Value.Mode,
                fullPath
            );
        }
    }

    /// <summary>
    /// Checks that every item collection can be addressed. The binding itself is compiled by
    /// <see cref="BuildState"/>, which sees the <c>Items</c> property like any other.
    /// </summary>
    private void ValidateItemCollections(Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            if (component is not IItemsComponent itemsComponent)
                continue;

            EnsureVirtualizationIsLayableOut(component);

            if (!TryGetItemsBinding(itemsComponent, out UIBinding itemsBinding))
            {
                EnsureWindowedHostBindsASource(component);
                EnsureStaticItemsAreBindable(component, itemsComponent);
                continue;
            }

            EnsureWindowedHostHasNoStaticItems(component, itemsComponent);
            EnsureWindowedSourceIsAnItemSource(component, BuildBindingPath(component, itemsBinding, componentContexts, rootPath, includeSelfContext: true));
            EnsureBoundItemsAreBindable(component, BuildItemsBindingPath(component, itemsBinding, componentContexts, rootPath));
        }
    }

    /// <summary>
    /// The path a component's <c>Items</c> binding compiles to. A windowed host names the <em>source</em>; the
    /// property holding its realized window is appended here, so an author never writes it and the name cannot
    /// drift from the type that declares it.
    /// </summary>
    private CompiledPath BuildItemsBindingPath(IVisualComponent component, UIBinding binding, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        CompiledPath path = BuildBindingPath(component, binding, componentContexts, rootPath, includeSelfContext: true);

        return IsWindowedItemsHost(component)
            ? AppendPath(path, RecursivePath.Parse(UIItemSourceBase.WindowProperty))
            : path;
    }

    private static bool IsWindowedItemsHost(IVisualComponent component)
        => component is ISourceItemsComponent { IsWindowed: true };

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
