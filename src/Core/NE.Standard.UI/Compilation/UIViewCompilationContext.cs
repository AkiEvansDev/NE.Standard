using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Compilation;

internal sealed class UIViewCompilationResult(CompiledRegion[] regions, CompiledDialog[] dialogs, UIComponentNode[] nodes, UIComponentState[] states, CompiledUIBindingSource[] bindingSources, CompiledUIBindingTemplate[] bindingTemplates, CompiledUIContext[] contexts, CompiledUIBinding[] bindings, CompiledUIInteraction[] interactions, Dictionary<UIPropertyAddress, object?> firstPaint, CompiledUIEvent[] events, CompiledUIValidationRule[] validations, KeyValuePair<UIComponentId, UIPropertyAddress>[] validationMessageTargets, UICompileWarning[] warnings)
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
    public Dictionary<UIPropertyAddress, object?> FirstPaint { get; } = firstPaint;
    public CompiledUIEvent[] Events { get; } = events;
    public CompiledUIValidationRule[] Validations { get; } = validations;
    public KeyValuePair<UIComponentId, UIPropertyAddress>[] ValidationMessageTargets { get; } = validationMessageTargets;
    public UICompileWarning[] Warnings { get; } = warnings;
}

internal sealed partial class UIViewCompilationContext(Type? controllerType = null) : IUIReferenceResolver
{
    // What compiled but is not what the author meant; the host logs these, it does not stop for them.
    private readonly List<UICompileWarning> _warnings = [];

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
    private readonly Dictionary<string, UIComponentTypeState> _typeStates = new(StringComparer.Ordinal);
    private readonly List<CompiledRegion> _regions = [];
    private readonly List<CompiledDialog> _dialogs = [];

    /// <summary>
    /// The controller the route pairs this view with, when it has one.
    /// </summary>
    private readonly Type? _controllerType = controllerType;

    public void AddRegion(UIRegion region)
    {
        ArgumentNullException.ThrowIfNull(region);
        ArgumentException.ThrowIfNullOrWhiteSpace(region.Key);
        ArgumentNullException.ThrowIfNull(region.Root);

        AddComponent(region.Root, null);

        // The view's own chords are raised on its content (AddShortcutEvents).
        if (string.Equals(region.Key, RegionNames.Content, StringComparison.Ordinal))
            _content = region.Root;

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

    /// <summary>The component an authored reference names; AddComponent registers the id and the component together, so one lookup answers both.</summary>
    private IVisualComponent GetComponent(string authoringComponentId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(authoringComponentId);

        return _components.TryGetValue(authoringComponentId, out IVisualComponent? component)
            ? component
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
            Placement = dialog.Placement,
            Width = dialog.Width,
            MinWidth = dialog.MinWidth,
            MaxWidth = dialog.MaxWidth,
            Height = dialog.Height,
            MinHeight = dialog.MinHeight,
            MaxHeight = dialog.MaxHeight,
            HorizontalAlignment = dialog.HorizontalAlignment,
            VerticalAlignment = dialog.VerticalAlignment,
            Margin = dialog.Margin,
            Modal = dialog.Modal,
            CloseOnBackdrop = dialog.CloseOnBackdrop,
            CloseOnEscape = dialog.CloseOnEscape,
            Label = dialog.Label,
            TitleComponentId = dialog.TitleId is null ? null : ResolveDialogTitle(dialog, dialog.TitleId)
        });
    }

    /// <summary>
    /// The component naming a dialog: one inside its content and in no template, since the panel names it by the one element it draws
    /// (<c>aria-labelledby</c>).
    /// </summary>
    private UIComponentId ResolveDialogTitle(UIDialog dialog, string titleId)
    {
        if (!_componentIdsByAuthoringId.TryGetValue(titleId, out UIComponentId componentId))
            throw new InvalidOperationException($"Dialog '{dialog.Key}' is named by '{titleId}', which the view does not hold; give TitleId a component inside the dialog's content.");

        for (var current = titleId; current is not null; current = _parentByComponentId[current])
        {
            if (_slotByRootComponentId.TryGetValue(current, out UIComponentSlot? slot) && slot.Kind is not (UIComponentSlotKind.Child or UIComponentSlotKind.Region))
                throw new InvalidOperationException($"Dialog '{dialog.Key}' is named by '{titleId}', which stands in a template and is drawn once a row or not at all; name it by a component drawn once.");

            if (string.Equals(current, dialog.Content.Id, StringComparison.Ordinal))
                return componentId;
        }

        throw new InvalidOperationException($"Dialog '{dialog.Key}' is named by '{titleId}', which stands outside the dialog; give TitleId a component inside the dialog's content.");
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

        Dictionary<string, ResolvedComponentContext> componentContexts = BuildComponentContexts(sourcesByKey, templatesByKey, contextsByTemplateId, rootContext, rootPath);

        UIComponentNode[] nodes = BuildNodes(componentContexts);

        // Once every region and dialog is registered: a click interaction inside a link may be written anywhere in the view.
        ValidateLinks();

        UIComponentState[] states = BuildStates(templatesByKey, bindings, componentContexts, rootPath);

        ValidateItemCollections(componentContexts, rootPath);
        ValidateSelectionBindings();
        WarnOnClearOfAPeriod();
        ValidateShortcuts();
        EnsureFormsAreSubmitted();

        CompiledUIInteraction[] interactions = BuildInteractions();
        CompiledUIEvent[] events = BuildEvents(templatesByKey, componentContexts, rootPath);
        CompiledUIValidationRule[] validations = BuildValidations(componentContexts);
        KeyValuePair<UIComponentId, UIPropertyAddress>[] validationMessageTargets = BuildValidationMessageTargets();

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
            BuildFirstPaint(),
            events,
            validations,
            validationMessageTargets,
            [.. _warnings]
        );
    }

    UIComponentId IUIReferenceResolver.ResolveComponentId(string componentId)
        => GetComponentId(componentId);

    object IUIReferenceResolver.ResolveItemsView(UIItemsView itemsView)
        => UIItemsViewResolver.Resolve(itemsView, this);

    /// <summary>Refuses an interaction's dialog key the view does not declare: the press would open or close nothing.</summary>
    void IUIReferenceResolver.EnsureDialogDeclared(string dialogKey)
    {
        if (CompiledDialog.Find(_dialogs, dialogKey) is null)
            throw new InvalidOperationException($"An interaction names dialog '{dialogKey}', which the view does not declare; declare it in CreateDialogs or name one that is.");
    }
}
