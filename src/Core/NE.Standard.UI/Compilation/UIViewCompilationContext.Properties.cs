using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Shell.Data;

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
        if (mode == UIBindingMode.OnSubmit && component is IInputComponent input && !HasForm(component, input))
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeKey}' is bound '{mode}' but the component has no 'FormId', so its value could never be submitted.");
    }

    /// <summary>Whether an input belongs to a form: its <c>FormId</c> set or bound.</summary>
    private static bool HasForm(IVisualComponent component, IInputComponent input)
        => !string.IsNullOrWhiteSpace(input.FormId) || FindBinding(component, IInputComponent.FormIdProperty) is not null;

    /// <summary>
    /// Refuses a text area whose Enter submits its form (<c>SubmitOnEnter</c>, set or bound) but that also runs a command on Enter
    /// (<c>OnEnter</c>) or drives an interaction from its <c>enter</c> — one key cannot do both, and on the page the other wins — or
    /// that belongs to no form: Enter would press no button and break no line either.
    /// </summary>
    private void EnsureSubmitOnEnterIsSound(IVisualComponent component)
    {
        if (component is not IInputComponent input || !SubmitsOnEnter(component))
            return;

        if (HasEvent(component, EventNames.Enter))
            throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' both submits on Enter and runs a command on Enter ('OnEnter'); Enter does one of them, so drop 'SubmitOnEnter' or the 'OnEnter' command.");

        if (FindEnterInteractionOwner(component.Id) is { } owner)
            throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' both submits on Enter and drives an interaction of '{owner.Id}' on its 'enter'; Enter does one of them, so drop 'SubmitOnEnter' or the interaction.");

        if (!HasForm(component, input))
            throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' submits on Enter but has no 'FormId', so Enter would have no form to submit.");
    }

    /// <summary>The component holding an interaction that runs on the source's <c>enter</c> event, or null where none does.</summary>
    private IVisualComponent? FindEnterInteractionOwner(string sourceId)
    {
        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent owner = _componentOrder[i];

            for (var j = 0; j < owner.Interactions.Count; j++)
            {
                UIInteraction interaction = owner.Interactions[j];

                if (interaction.SourceKind == UIInteractionSourceKind.Event
                    && string.Equals(interaction.SourceEvent, EventNames.Enter, StringComparison.Ordinal)
                    && string.Equals(interaction.ComponentId, sourceId, StringComparison.Ordinal))
                {
                    return owner;
                }
            }
        }

        return null;
    }

    /// <summary>
    /// Refuses a file or image input whose <c>DropTargetId</c> names a component the view does not have: a misspelled id would leave the
    /// composer silently taking nothing, so it is said when the view compiles, as a misspelled effect target is.
    /// </summary>
    private void EnsureDropTargetIsInView(IVisualComponent component)
    {
        if (!TryGetPropertyDefinition(component.TypeKey, FileInputComponent.DropTargetIdProperty, out UIPropertyDefinition? definition)
            && !TryGetPropertyDefinition(component.TypeKey, ImageInputComponent.DropTargetIdProperty, out definition))
        {
            return;
        }

        if (definition.Getter(component) is string { Length: > 0 } dropTarget && !_componentIdsByAuthoringId.ContainsKey(dropTarget))
            throw new InvalidOperationException($"Component '{component.Id}' of type '{component.TypeKey}' names DropTargetId '{dropTarget}', which the view does not have.");
    }

    /// <summary>
    /// Refuses a window larger than one read may ask for: every host refuses such a read, so the view that would send it is the
    /// author's to fix, not a page that fails at its first scroll.
    /// </summary>
    private static void EnsureWindowFitsARead(IVisualComponent component)
    {
        if (component is IItemsHostComponent { WindowSize: > UIItemWindowClientRequest.MaxCount } host)
            throw new InvalidOperationException($"Component '{component.Id}' sets WindowSize {host.WindowSize}; one read takes at most {UIItemWindowClientRequest.MaxCount} rows.");
    }

    /// <summary>
    /// Refuses a pager aimed at nothing, at a component the view does not have, or at a host whose window is not a page — one holding
    /// its rows whole, or a windowed one whose scroll reads the next window; and a page size of no rows, or of more than one read takes.
    /// </summary>
    private void EnsurePagerTargetPages(IVisualComponent component)
    {
        // A pager by its type, not by a property named Target, which another component may carry for its own sake.
        if (component is not IPagerComponent || !TryGetPropertyDefinition(component.TypeKey, PagerComponent.TargetProperty, out UIPropertyDefinition? targetDefinition))
            return;

        if (TryGetPropertyDefinition(component.TypeKey, PagerComponent.PageSizesProperty, out UIPropertyDefinition? sizesDefinition) && sizesDefinition.Getter(component) is IReadOnlyList<int> sizes)
        {
            for (var i = 0; i < sizes.Count; i++)
            {
                if (sizes[i] is <= 0 or > UIItemWindowClientRequest.MaxCount)
                    throw new InvalidOperationException($"Pager '{component.Id}' offers a page size of {sizes[i]}; a page holds from one row to {UIItemWindowClientRequest.MaxCount}.");
            }
        }

        var target = targetDefinition.Getter(component) as string;

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

    /// <summary>
    /// Refuses a form nothing submits: a field bound <c>OnSubmit</c> holds its edits until its form's submit, which would never come, and
    /// a text area's Enter presses its form's button, which would not be there — a Save written <c>OnClick</c> rather than
    /// <c>OnSubmit(formId, …)</c>. A form id a component binds is the page's to make, and leaves the view unchecked.
    /// </summary>
    private void EnsureFormsAreSubmitted()
    {
        HashSet<string> submitted = new(StringComparer.Ordinal);
        HashSet<string> pressed = new(StringComparer.Ordinal);

        foreach (IVisualComponent component in _componentOrder)
        {
            if (TryGetPropertyDefinition(component.TypeKey, ButtonComponent.SubmitFormIdProperty, out UIPropertyDefinition? submit))
            {
                if (FindBinding(component, submit.Property) is not null)
                    return;

                if (submit.Getter(component) is string { Length: > 0 } formId)
                {
                    _ = submitted.Add(formId);
                    _ = pressed.Add(formId);
                }
            }

            if (component is IFormSubmittingComponent submitting && submitting.FormId is { Length: > 0 } own && SubmitsOnAnEvent(component, submitting))
                _ = submitted.Add(own);
        }

        foreach (IVisualComponent component in _componentOrder)
        {
            if (component is not IInputComponent { FormId: { Length: > 0 } formId } || FindBinding(component, IInputComponent.FormIdProperty) is not null)
                continue;

            if (SubmitsOnEnter(component) && !pressed.Contains(formId))
                throw new InvalidOperationException($"Component '{component.Id}' submits form '{formId}' on Enter, but no button submits that form, so Enter would press nothing; give the form's button OnSubmit(\"{formId}\", command).");

            if (HoldsForSubmit(component) && !submitted.Contains(formId))
                throw new InvalidOperationException($"Component '{component.Id}' holds its edits for form '{formId}' (an OnSubmit binding), but nothing submits that form, so they would never be sent; give the form's button OnSubmit(\"{formId}\", command).");
        }
    }

    /// <summary>Whether one of the component's own events submits its form (<see cref="IFormSubmittingComponent"/>): a code field's save.</summary>
    private static bool SubmitsOnAnEvent(IVisualComponent component, IFormSubmittingComponent submitting)
    {
        foreach (UIEvent registered in component.Events)
        {
            if (submitting.SubmitsForm(registered.Name))
                return true;
        }

        return false;
    }

    /// <summary>Whether a property of the component is bound <c>OnSubmit</c>, held on the page until its form is submitted.</summary>
    private static bool HoldsForSubmit(IVisualComponent component)
    {
        foreach (UIBinding binding in component.Bindings)
        {
            if (binding.Mode == UIBindingMode.OnSubmit)
                return true;
        }

        return false;
    }

    /// <summary>Whether a component says <c>SubmitOnEnter</c>, set or bound.</summary>
    private bool SubmitsOnEnter(IVisualComponent component)
        => TryGetPropertyDefinition(component.TypeKey, TextAreaComponent.SubmitOnEnterProperty, out UIPropertyDefinition? definition)
            && (definition.Getter(component) is true || FindBinding(component, definition.Property) is not null);

    private UIPropertyDefinition GetRequiredPropertyDefinition(string typeKey, UIProperty property)
        => TryGetPropertyDefinition(typeKey, property, out UIPropertyDefinition? definition)
            ? definition
            : throw new InvalidOperationException($"Property definition for '{property.Name}' was not found in component '{typeKey}'.");

    /// <summary>The definition of a property a component type registers, if it registers it.</summary>
    private bool TryGetPropertyDefinition(string typeKey, UIProperty property, [NotNullWhen(true)] out UIPropertyDefinition? definition)
        => GetTypeState(typeKey).TryGetDefinition(property, out definition);

    // Held per view, so the whole compile reads one set of a type's properties even if the type registers more meanwhile.
    private UIComponentTypeState GetTypeState(string typeKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(typeKey);

        if (_typeStates.TryGetValue(typeKey, out UIComponentTypeState? state))
            return state;

        state = UIComponentTypeState.For(typeKey, UIPropertyRegister.GetProperties(typeKey));
        _typeStates.Add(typeKey, state);

        return state;
    }
}
