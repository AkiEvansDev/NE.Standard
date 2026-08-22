using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private CompiledUIEvent[] BuildEvents(Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        List<CompiledUIEvent> events = [];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            for (var j = 0; j < component.Events.Count; j++)
            {
                UIEvent sourceEvent = component.Events[j];
                EnsureServerEventAllowed(sourceEvent.Name);

                events.Add(new CompiledUIEvent
                {
                    Id = CreateEventId(),
                    Address = new CompiledUIEventAddress(GetComponentId(component.Id), sourceEvent.Name),
                    Command = sourceEvent.Action.Command,
                    Arguments = BuildActionArguments(component, sourceEvent.Action, templatesByKey, componentContexts, rootPath)
                });
            }
        }

        return [.. events];
    }

    private static void EnsureServerEventAllowed(string eventName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);

        if (!IsLocalLifecycleEvent(eventName))
            return;

        throw new InvalidOperationException($"Event '{eventName}' is reserved for local interactions and cannot be registered as a server UI event.");
    }

    private static bool IsLocalLifecycleEvent(string eventName)
        => eventName.StartsWith("before-", StringComparison.Ordinal)
        || eventName.StartsWith("after-", StringComparison.Ordinal);

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
            UIActionArgumentKind.CurrentItem => BuildBindingActionArgument(component, name, UIBindingPath.Relative(RecursivePath.Empty), templatesByKey, componentContexts, rootPath),
            UIActionArgumentKind.CurrentItemKey => new CompiledUIActionArgument
            {
                Name = name,
                Kind = CompiledUIActionArgumentKind.CurrentItemKey
            },
            UIActionArgumentKind.Binding => BuildBindingActionArgument(component, name, argument.Binding ?? throw new InvalidOperationException($"Action argument '{name}' has no binding."), templatesByKey, componentContexts, rootPath),
            _ => throw new UnreachableException()
        };
    }

    private CompiledUIActionArgument BuildBindingActionArgument(IVisualComponent component, string name, UIBindingPath binding, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        CompiledPath fullPath = BuildBindingPath(component, binding, componentContexts, rootPath, includeSelfContext: true);
        CompiledUIBindingTemplate template = GetOrAddTemplate(templatesByKey, fullPath.Source, fullPath.Template);

        return new CompiledUIActionArgument
        {
            Name = name,
            Kind = CompiledUIActionArgumentKind.Binding,
            SourceId = fullPath.Source.Id,
            TemplateId = template.Id,
            Parameters = fullPath.Parameters,
            DynamicParameterComponentIds = GetDynamicParameterComponentIds(fullPath.Parameters)
        };
    }
}
