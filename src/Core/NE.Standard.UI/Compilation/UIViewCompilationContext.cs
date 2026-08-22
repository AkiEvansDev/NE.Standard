using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Items;

namespace NE.Standard.UI.Compilation;

internal sealed class UIViewCompilationResult(
    CompiledRegion[] regions,
    CompiledDialog[] dialogs,
    UIComponentNode[] nodes,
    UIComponentState[] states,
    CompiledUIBindingSource[] bindingSources,
    CompiledUIBindingTemplate[] bindingTemplates,
    CompiledUIContext[] contexts,
    CompiledUIBinding[] bindings,
    CompiledUIInteraction[] interactions,
    CompiledUIEvent[] events,
    CompiledUIValidationRule[] validations)
{
    public CompiledRegion[] Regions { get; } = regions;
    public CompiledDialog[] Dialogs { get; } = dialogs;
    public UIComponentNode[] Nodes { get; } = nodes;
    public UIComponentState[] States { get; } = states;
    public CompiledUIBindingSource[] BindingSources { get; } = bindingSources;
    public CompiledUIBindingTemplate[] BindingTemplates { get; } = bindingTemplates;
    public CompiledUIContext[] Contexts { get; } = contexts;
    public CompiledUIBinding[] Bindings { get; } = bindings;
    public CompiledUIInteraction[] Interactions { get; } = interactions;
    public CompiledUIEvent[] Events { get; } = events;
    public CompiledUIValidationRule[] Validations { get; } = validations;
}

internal sealed partial class UIViewCompilationContext(Type? controllerType = null) : IUIReferenceResolver
{
    private readonly record struct BindingTemplateKey(UIBindingSourceId SourceId, string Template);

    private readonly struct CompiledPath(CompiledUIBindingSource source, RecursivePathTemplate template, CompiledUIBindingParameter[] parameters)
    {
        public CompiledUIBindingSource Source { get; } = source;
        public RecursivePathTemplate Template { get; } = template;
        public CompiledUIBindingParameter[] Parameters { get; } = parameters;
    }

    private readonly struct ResolvedComponentContext(CompiledUIContext context, CompiledPath path, bool definesParameter)
    {
        public CompiledUIContext Context { get; } = context;
        public CompiledPath Path { get; } = path;
        public bool DefinesParameter { get; } = definesParameter;
    }

    private readonly Dictionary<string, UIComponentId> _componentIdsByAuthoringId = new(StringComparer.Ordinal);
    private readonly Dictionary<UIComponentId, string> _authoringIdByComponentId = [];
    private readonly Dictionary<string, IVisualComponent> _components = new(StringComparer.Ordinal);
    private readonly List<IVisualComponent> _componentOrder = [];
    private readonly Dictionary<string, string?> _parentByComponentId = new(StringComparer.Ordinal);
    private readonly Dictionary<string, List<UIComponentSlot>> _slotsByOwnerComponentId = new(StringComparer.Ordinal);
    private readonly Dictionary<string, UIComponentSlot> _slotByRootComponentId = new(StringComparer.Ordinal);
    private readonly Dictionary<string, UIPropertyDefinition[]> _propertyDefinitionsCache = new(StringComparer.Ordinal);
    private readonly HashSet<Type> _initializedComponentTypes = [];
    private readonly List<CompiledRegion> _regions = [];
    private readonly List<CompiledDialog> _dialogs = [];

    /// <summary>
    /// The controller the route pairs this view with, when it has one. A route owns exactly one controller
    /// type and its compiled view is cached per route, so the pairing is stable for the life of the compile.
    /// </summary>
    private readonly Type? _controllerType = controllerType;

    public void AddRegion(UIRegion region)
    {
        ArgumentNullException.ThrowIfNull(region);
        ArgumentException.ThrowIfNullOrWhiteSpace(region.Key);
        ArgumentNullException.ThrowIfNull(region.Root);

        AddComponent(region.Root, null);

        _regions.Add(new CompiledRegion
        {
            Key = region.Key,
            RootComponentId = GetComponentId(region.Root.Id)
        });
    }

    private UIComponentId GetComponentId(string authoringComponentId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(authoringComponentId);

        return _componentIdsByAuthoringId.TryGetValue(authoringComponentId, out UIComponentId componentId)
            ? componentId
            : throw new InvalidOperationException($"Component '{authoringComponentId}' was not found.");
    }

    public void AddDialog(UIDialog dialog)
    {
        ArgumentNullException.ThrowIfNull(dialog);
        ArgumentException.ThrowIfNullOrWhiteSpace(dialog.Key);
        ArgumentNullException.ThrowIfNull(dialog.Content);

        AddComponent(dialog.Content, null);

        _dialogs.Add(new CompiledDialog
        {
            Key = dialog.Key,
            RootComponentId = GetComponentId(dialog.Content.Id),
            Surface = dialog.Surface,
            Modal = dialog.Modal,
            CloseOnBackdrop = dialog.CloseOnBackdrop,
            CloseOnEscape = dialog.CloseOnEscape
        });
    }

    public UIViewCompilationResult BuildResult()
    {
        Dictionary<string, CompiledUIBindingSource> sourcesByKey = new(StringComparer.Ordinal);
        Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey = [];
        Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId = [];
        List<CompiledUIBinding> bindings = [];

        CompiledUIBindingSource controllerSource = GetOrAddControllerSource(sourcesByKey);
        CompiledPath rootPath = new(controllerSource, RecursivePathTemplate.Empty, []);
        CompiledUIBindingTemplate rootTemplate = GetOrAddTemplate(templatesByKey, rootPath.Source, rootPath.Template);
        CompiledUIContext rootContext = GetOrAddContext(contextsByTemplateId, rootTemplate);

        Dictionary<string, ResolvedComponentContext> componentContexts = BuildComponentContexts(
            sourcesByKey,
            templatesByKey,
            contextsByTemplateId,
            rootContext,
            rootPath
        );

        UIComponentNode[] nodes = BuildNodes(componentContexts);
        UIComponentState[] states = BuildStates(templatesByKey, bindings, componentContexts, rootPath);

        AddComponentContextBindings(templatesByKey, bindings, componentContexts, rootPath);
        ValidateItemCollections(componentContexts, rootPath);

        CompiledUIInteraction[] interactions = BuildInteractions();
        CompiledUIEvent[] events = BuildEvents(templatesByKey, componentContexts, rootPath);
        CompiledUIValidationRule[] validations = BuildValidations();

        return new UIViewCompilationResult(
            [.. _regions],
            [.. _dialogs],
            nodes,
            states,
            [.. sourcesByKey.Values],
            [.. templatesByKey.Values],
            [.. contextsByTemplateId.Values],
            [.. bindings],
            interactions,
            events,
            validations
        );
    }

    UIComponentId IUIReferenceResolver.ResolveComponentId(string componentId)
        => GetComponentId(componentId);

    object IUIReferenceResolver.ResolveItemsView(UIItemsView itemsView)
        => UIItemsViewResolver.Resolve(itemsView, this);
}
