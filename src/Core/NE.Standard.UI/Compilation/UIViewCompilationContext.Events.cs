using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private CompiledUIEvent[] BuildEvents(Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        List<CompiledUIEvent> events = [];

        EnsureDropKindsAreOffered();

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            for (var j = 0; j < component.Events.Count; j++)
            {
                UIEvent sourceEvent = component.Events[j];
                EnsureServerEventAllowed(sourceEvent.Name);
                EnsureCommandFits(component, sourceEvent);

                events.Add(new CompiledUIEvent
                {
                    Id = CreateEventId(),
                    Address = new CompiledUIEventAddress(GetComponentId(component.Id), sourceEvent.Name),
                    Command = sourceEvent.Action.Command,
                    Arguments = BuildActionArguments(component, sourceEvent.Action, templatesByKey, componentContexts, rootPath),
                    SubmitsForm = component is IFormSubmittingComponent submitting && submitting.SubmitsForm(sourceEvent.Name),
                    ShowsPending = CommandShowsPending(sourceEvent.Action.Command)
                });
            }
        }

        AddShortcutEvents(events, templatesByKey, componentContexts, rootPath);

        return [.. events];
    }

    /// <summary>
    /// Refuses a component taking a kind of item no component of the view offers (<c>OnDrop</c> without a <c>DragKind</c>), which no
    /// drag could ever reach — a drag never crosses views, and a source letting no effect through offers nothing — and a kind that is
    /// not lower-case letters, digits and hyphens.
    /// </summary>
    private void EnsureDropKindsAreOffered()
    {
        HashSet<string> offered = new(StringComparer.Ordinal);

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            if (_componentOrder[i] is IDragSourceComponent { DragKind: string kind, DragEffects: not UIDragEffects.None })
                _ = offered.Add(EnsureDragKind(_componentOrder[i], kind));
        }

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            for (var j = 0; j < component.Events.Count; j++)
            {
                var name = component.Events[j].Name;

                if (!name.StartsWith(EventNames.DropPrefix, StringComparison.Ordinal))
                    continue;

                var kind = EnsureDragKind(component, name[EventNames.DropPrefix.Length..]);

                if (!offered.Contains(kind))
                    throw new InvalidOperationException($"Component '{component.Id}' takes '{kind}' dropped on it (OnDrop), but no component of the view offers that kind; give the list the items come from SetDragKind(\"{kind}\").");
            }
        }
    }

    private static string EnsureDragKind(IVisualComponent component, string kind)
    {
        foreach (var letter in kind)
        {
            if (letter is not ((>= 'a' and <= 'z') or (>= '0' and <= '9') or '-'))
                throw new InvalidOperationException($"Component '{component.Id}' names the drag kind '{kind}'; a kind is lower-case letters, digits and hyphens.");
        }

        return kind.Length > 0 ? kind : throw new InvalidOperationException($"Component '{component.Id}' names an empty drag kind.");
    }

    private static void EnsureServerEventAllowed(string eventName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        if (!IsLocalLifecycleEvent(eventName))
            return;

        throw new InvalidOperationException($"Event '{eventName}' is reserved for local interactions and cannot be registered as a server UI event.");
    }

    private static bool IsLocalLifecycleEvent(string eventName)
        => eventName.StartsWith(EventNames.BeforePrefix, StringComparison.Ordinal)
        || eventName.StartsWith(EventNames.AfterPrefix, StringComparison.Ordinal);

    /// <summary>
    /// Refuses an event whose command the controller does not declare, or which leaves a parameter the command cannot run without
    /// unsupplied — otherwise it compiles, ships, and fails only when someone presses that button.
    /// </summary>
    private void EnsureCommandFits(IVisualComponent component, UIEvent sourceEvent)
    {
        if (_controllerType is null || !typeof(UIControllerBase).IsAssignableFrom(_controllerType))
            return;

        // The framework's own command runs in the runtime, not on the controller.
        if (UIBuiltInCommands.IsBuiltIn(sourceEvent.Action.Command))
            return;

        if (UIControllerBase.FindCommand(_controllerType, sourceEvent.Action.Command) is not UICommandDescriptor command)
        {
            throw new InvalidOperationException(
                $"Component '{component.Id}' runs command '{sourceEvent.Action.Command}' on '{sourceEvent.Name}', but controller " +
                $"'{_controllerType.Name}' has no [UICommand] method of that name."
            );
        }

        EnsureArgumentsFit(component, sourceEvent, command);
    }

    /// <summary>
    /// Refuses an event that supplies nothing for a value-type parameter of its command, which every press would fail on; warns of an
    /// argument the command has no parameter for, which it never sees (a command filter may still read it, so it is no refusal) —
    /// unless the framework offers it beside the author's own (<see cref="UIActionArgument.Offered"/>).
    /// </summary>
    private void EnsureArgumentsFit(IVisualComponent component, UIEvent sourceEvent, UICommandDescriptor command)
    {
        IReadOnlyDictionary<string, UIActionArgument> arguments = sourceEvent.Action.Arguments;

        foreach (var parameter in command.RequiredParameters)
        {
            if (!arguments.ContainsKey(parameter))
                throw new InvalidOperationException($"Component '{component.Id}' runs command '{command.Name}' on '{sourceEvent.Name}' with no argument '{parameter}', a value the command cannot run without; pass it, or give the parameter a default or a nullable type.");
        }

        foreach (KeyValuePair<string, UIActionArgument> argument in arguments)
        {
            if (!argument.Value.Offered && !command.Parameters.Contains(argument.Key, StringComparer.Ordinal))
                _warnings.Add(new(UICompileWarningKind.Advisory, $"Component '{component.Id}' passes argument '{argument.Key}' to command '{command.Name}' on '{sourceEvent.Name}', which has no parameter of that name; the command never sees it."));
        }
    }

    private CompiledUIActionArgument[] BuildActionArguments(IVisualComponent component, UIAction action, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        if (action.Arguments.Count == 0)
            return [];

        CompiledUIActionArgument[] result = new CompiledUIActionArgument[action.Arguments.Count];
        var index = 0;

        foreach (KeyValuePair<string, UIActionArgument> pair in action.Arguments)
        {
            result[index++] = BuildActionArgument(component, pair.Key, pair.Value, templatesByKey, componentContexts, rootPath);
        }

        return result;
    }

    private CompiledUIActionArgument BuildActionArgument(IVisualComponent component, string name, UIActionArgument argument, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return argument.Kind switch
        {
            UIActionArgumentKind.Literal => new CompiledUIActionArgument
            {
                Name = name,
                Kind = CompiledUIActionArgumentKind.Literal,
                Value = argument.Value
            },
            UIActionArgumentKind.EventKey => new CompiledUIActionArgument
            {
                Name = name,
                Kind = CompiledUIActionArgumentKind.EventKey,
                Value = argument.Value
            },
            // The value stands right after the keys the component's address needs, one per item scope it stands in.
            UIActionArgumentKind.EventValue => new CompiledUIActionArgument
            {
                Name = name,
                Kind = CompiledUIActionArgumentKind.EventKey,
                Value = CountItemScopes(component, componentContexts)
            },
            UIActionArgumentKind.CurrentItem => BuildBindingActionArgument(component, name, argument.Kind, UIBindingPath.Relative(RecursivePath.Empty), CompiledUIActionArgumentKind.Binding, templatesByKey, componentContexts, rootPath),
            UIActionArgumentKind.CurrentItemKey => BuildBindingActionArgument(component, name, argument.Kind, UIBindingPath.Relative(RecursivePath.Empty), CompiledUIActionArgumentKind.CurrentItemKey, templatesByKey, componentContexts, rootPath),
            UIActionArgumentKind.GroupKey => BuildBindingActionArgument(component, name, argument.Kind, UIBindingPath.Relative(RecursivePath.Empty), CompiledUIActionArgumentKind.GroupKey, templatesByKey, componentContexts, rootPath),
            UIActionArgumentKind.Binding => BuildBindingActionArgument(component, name, argument.Kind, argument.Binding ?? throw new InvalidOperationException($"Action argument '{name}' has no binding."), CompiledUIActionArgumentKind.Binding, templatesByKey, componentContexts, rootPath),
            _ => throw new UnreachableException()
        };
    }

    /// <summary>How many item scopes the component stands in, itself included: the keys its address needs, as the runtime counts them.</summary>
    private int CountItemScopes(IVisualComponent component, Dictionary<string, ResolvedComponentContext> componentContexts)
        => ItemScopesOf(component.Id, componentContexts).Count;

    private CompiledUIActionArgument BuildBindingActionArgument(IVisualComponent component, string name, UIActionArgumentKind authored, UIBindingPath binding, CompiledUIActionArgumentKind kind, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        // An argument is read once as the command runs, where a fixed index or key resolves; only a binding kept live is refused it.
        CompiledPath fullPath = BuildBindingPath(component, binding, componentContexts, rootPath);

        EnsureArgumentResolves(component, name, authored, binding, fullPath);

        CompiledUIBindingTemplate template = GetOrAddTemplate(templatesByKey, fullPath.Source, fullPath.Template);

        return new CompiledUIActionArgument
        {
            Name = name,
            Kind = kind,
            SourceId = fullPath.Source.Id,
            TemplateId = template.Id,
            Parameters = fullPath.Parameters,
            DynamicParameterComponentIds = GetDynamicParameterComponentIds(fullPath.Parameters)
        };
    }

    /// <summary>
    /// Refuses an argument no press could read: an item's key where the component stands in no row, the current item where it has
    /// neither a row nor a context (it would be the controller), or a path the types it walks lack or the server cannot read off them
    /// — each failed only in the log.
    /// </summary>
    private void EnsureArgumentResolves(IVisualComponent component, string name, UIActionArgumentKind kind, UIBindingPath binding, CompiledPath path)
    {
        if (kind is UIActionArgumentKind.CurrentItemKey or UIActionArgumentKind.GroupKey && path.Parameters.Length == 0)
            throw new InvalidOperationException($"Component '{component.Id}' passes argument '{name}' as {kind}, but stands in no row: an item's key is read off the row a control in an item template is drawn for.");

        if (kind == UIActionArgumentKind.CurrentItem && path.Source.Kind == CompiledUIBindingSourceKind.Controller && path.Template.Parts.Length == 0)
            throw new InvalidOperationException($"Component '{component.Id}' passes argument '{name}' as {kind}, but stands in no row and binds no context, so the item would be the controller itself.");

        if (kind != UIActionArgumentKind.Binding)
            return;

        if (FindMissingControllerProperty(path) is (string property, Type owner))
        {
            var hint = binding.Scope == UIBindingScope.Parent
                ? " Inside an item template a control's own row is Relative (UIAction.ArgRelative, ArgCurrentItemKey); Parent is the scope around the row."
                : string.Empty;

            throw new InvalidOperationException($"Component '{component.Id}' passes argument '{name}' from '{path.Template.Template}', but '{owner.Name}' has no public property '{property}', so every press would fail.{hint}");
        }

        if (FindUnreadControllerSegment(path) is (string segment, Type reader))
            throw new InvalidOperationException($"Component '{component.Id}' passes argument '{name}' from '{path.Template.Template}', but the server reads '{segment}' through '{reader.Name}', where it is no [RecursiveMember] of a RecursiveObservable, so every press would fail.");

        if (FindMissingStaticItemProperty(path) is (string itemProperty, string host))
            throw new InvalidOperationException($"Component '{component.Id}' passes argument '{name}' from '{path.Template.Template}', but no item '{host}' holds has a public property '{itemProperty}', so every press would fail.");
    }

    /// <summary>Whether the command's press shows it is working; a built-in command, or one with no controller to read, does.</summary>
    private bool CommandShowsPending(string command)
        => _controllerType is null || !typeof(UIControllerBase).IsAssignableFrom(_controllerType) || UIControllerBase.ShowsPending(_controllerType, command);
}
