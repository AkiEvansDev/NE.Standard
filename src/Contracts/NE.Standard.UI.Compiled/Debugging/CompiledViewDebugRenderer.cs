using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compiled.Debugging;

/// <summary>
/// Renders compiled views into a human-readable diagnostic graph.
/// </summary>
public sealed class CompiledViewDebugRenderer(CompiledViewDebugOptions? options = null)
{
    private readonly CompiledViewDebugOptions _options = options ?? CompiledViewDebugOptions.Default;

    /// <summary>
    /// Renders the specified compiled view.
    /// </summary>
    public string Render(CompiledView view)
    {
        ArgumentNullException.ThrowIfNull(view);

        StringBuilder builder = new();

        AppendSection(builder, _options.IncludeSources, () => AppendSources(builder, view));
        AppendSection(builder, _options.IncludeTemplates, () => AppendTemplates(builder, view));
        AppendSection(builder, _options.IncludeContexts, () => AppendContexts(builder, view));
        AppendSection(builder, _options.IncludeBindings, () => AppendBindings(builder, view));
        AppendSection(builder, _options.IncludeInteractions, () => AppendInteractions(builder, view));
        AppendSection(builder, _options.IncludeEvents, () => AppendEvents(builder, view));
        AppendSection(builder, _options.IncludeValidations, () => AppendValidations(builder, view));
        AppendSection(builder, _options.IncludeStateBindings, () => AppendStateBindings(builder, view));
        AppendSection(builder, _options.IncludeStaticValues, () => AppendStaticValues(builder, view));
        AppendSection(builder, _options.IncludeComponentTree, () => AppendComponentTree(builder, view));

        return builder.ToString();
    }

    private static void AppendSection(StringBuilder builder, bool enabled, Action append)
    {
        if (!enabled)
            return;

        if (builder.Length > 0)
            _ = builder.AppendLine();

        append();
    }

    private void AppendSources(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Binding sources:");

        foreach (CompiledUIBindingSource source in SortById(view.Sources.All, static s => s.Id))
        {
            _ = builder
                .Append("  ")
                .Append(source.Id)
                .Append(": ")
                .Append(source.Kind);

            if (source.ComponentId is not null)
            {
                _ = builder
                    .Append(" component=")
                    .Append(source.ComponentId.Value);
            }

            if (source.ItemsProperty is not null)
            {
                _ = builder
                    .Append(" itemsProperty=")
                    .Append(source.ItemsProperty);
            }

            _ = builder.AppendLine();
        }
    }

    private IEnumerable<T> SortById<T, TId>(IEnumerable<T> source, Func<T, TId> idSelector)
    {
        if (!_options.SortByNumericIds)
            return source.OrderBy(item => idSelector(item)?.ToString(), StringComparer.Ordinal);

        return source
            .OrderBy(item => GetIdPrefix(idSelector(item)?.ToString()), StringComparer.Ordinal)
            .ThenBy(item => GetIdNumber(idSelector(item)?.ToString()))
            .ThenBy(item => idSelector(item)?.ToString(), StringComparer.Ordinal);
    }

    private void AppendTemplates(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Binding templates:");

        foreach (CompiledUIBindingTemplate template in SortById(view.Templates.All, static t => t.Id))
        {
            CompiledUIBindingSource source = view.Sources.GetRequired(template.SourceId);

            _ = builder.Append("  ");
            _ = builder.Append(template.Id);
            _ = builder.Append(": source=");
            _ = builder.Append(template.SourceId);

            if (_options.IncludeSourceKind)
            {
                _ = builder.Append('(');
                _ = builder.Append(source.Kind);
                _ = builder.Append(')');
            }

            _ = builder.Append(" \"");
            _ = builder.Append(template.Template);
            _ = builder.Append("\" params=");
            _ = builder.Append(template.ParameterCount);
            _ = builder.AppendLine();
        }
    }

    private void AppendContexts(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Contexts:");

        foreach (CompiledUIContext context in SortById(view.Contexts.All, static c => c.Id))
        {
            CompiledUIBindingTemplate template = view.Templates.GetRequired(context.TemplateId);
            CompiledUIBindingSource source = view.Sources.GetRequired(template.SourceId);

            _ = builder
                .Append("  ")
                .Append(context.Id)
                .Append(": ")
                .Append(context.TemplateId)
                .Append(" source=")
                .Append(template.SourceId);

            if (_options.IncludeSourceKind)
            {
                _ = builder
                    .Append('(')
                    .Append(source.Kind)
                    .Append(')');
            }

            _ = builder
                .Append(" \"")
                .Append(template.Template)
                .Append("\" params=")
                .Append(template.ParameterCount)
                .AppendLine();
        }
    }

    private void AppendBindings(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Bindings:");

        CompiledUIBinding[] propertyBindings = GetBindingsByKind(view, CompiledUIBindingKind.ComponentProperty);
        CompiledUIBinding[] contextBindings = GetBindingsByKind(view, CompiledUIBindingKind.ComponentContext);
        CompiledUIBinding[] collectionBindings = GetBindingsByKind(view, CompiledUIBindingKind.ComponentCollection);

        AppendBindingGroup(builder, view, nameof(CompiledUIBindingKind.ComponentProperty), propertyBindings);
        AppendBindingGroup(builder, view, nameof(CompiledUIBindingKind.ComponentContext), contextBindings);
        AppendBindingGroup(builder, view, nameof(CompiledUIBindingKind.ComponentCollection), collectionBindings);
    }

    private static CompiledUIBinding[] GetBindingsByKind(CompiledView view, CompiledUIBindingKind kind)
        => [.. view.Bindings.All
                .Where(binding => binding.Kind == kind)
                .OrderBy(static binding => GetIdPrefix(binding.Id.ToString()), StringComparer.Ordinal)
                .ThenBy(static binding => GetIdNumber(binding.Id.ToString()))
                .ThenBy(static binding => binding.Id.ToString(), StringComparer.Ordinal)
        ];

    private static string GetIdPrefix(string? id)
    {
        if (string.IsNullOrEmpty(id))
            return string.Empty;

        var i = 0;

        while (i < id.Length && !char.IsDigit(id[i]))
            i++;

        return i == 0 ? string.Empty : id[..i];
    }

    private static int GetIdNumber(string? id)
    {
        if (string.IsNullOrEmpty(id))
            return 0;

        var start = 0;

        while (start < id.Length && !char.IsDigit(id[start]))
            start++;

        return start >= id.Length
            ? 0
            : int.TryParse(id.AsSpan(start), NumberStyles.None, CultureInfo.InvariantCulture, out var value)
                ? value
                : 0;
    }

    private void AppendBindingGroup(StringBuilder builder, CompiledView view, string name, CompiledUIBinding[] bindings)
    {
        AppendIndent(builder, 1);
        _ = builder
            .Append(name)
            .AppendLine(":");

        if (bindings.Length == 0)
        {
            AppendIndent(builder, 2);
            _ = builder.AppendLine("<none>");
            return;
        }

        for (var i = 0; i < bindings.Length; i++)
            AppendBinding(builder, view, bindings[i], indent: 2);
    }

    private void AppendIndent(StringBuilder builder, int indent)
    {
        var count = indent * _options.IndentSize;

        for (var i = 0; i < count; i++)
            _ = builder.Append(' ');
    }

    private void AppendBinding(StringBuilder builder, CompiledView view, CompiledUIBinding binding, int indent)
    {
        CompiledUIBindingTemplate template = view.Templates.GetRequired(binding.TemplateId);
        CompiledUIBindingSource source = view.Sources.GetRequired(binding.SourceId);

        AppendIndent(builder, indent);
        _ = builder.Append(binding.Id)
            .Append(": ")
            .Append(binding.Address)
            .Append(" -> source=")
            .Append(binding.SourceId);

        if (_options.IncludeSourceKind)
        {
            _ = builder
                .Append('(')
                .Append(source.Kind)
                .Append(')');
        }

        _ = builder
            .Append(" template=")
            .Append(binding.TemplateId)
            .Append(" \"")
            .Append(template.Template)
            .Append('"')
            .Append(" mode=")
            .Append(binding.Mode);

        if (binding.TargetValueType is Type targetValueType)
        {
            _ = builder
                .Append(" target=")
                .Append(targetValueType.Name);
        }

        AppendParameters(builder, binding.Parameters, binding.DynamicParameterComponentIds);

        _ = builder.AppendLine();
    }

    private static void AppendParameters(StringBuilder builder, CompiledUIBindingParameter[] parameters, UIComponentId[] dynamicParameterComponentIds)
    {
        if (parameters.Length == 0)
        {
            _ = builder.Append(" params=[]");
            return;
        }

        _ = builder.Append(" params=[");

        for (var i = 0; i < parameters.Length; i++)
        {
            if (i > 0)
                _ = builder.Append(", ");

            CompiledUIBindingParameter parameter = parameters[i];

            switch (parameter.Kind)
            {
                case CompiledUIBindingParameterKind.Dynamic:
                    _ = builder.Append("dynamic:");
                    _ = builder.Append(parameter.ComponentId?.ToString() ?? "<null>");
                    break;

                case CompiledUIBindingParameterKind.Fixed:
                    _ = builder.Append("fixed:");
                    AppendObject(builder, parameter.Value);
                    break;

                case CompiledUIBindingParameterKind.Scope:
                    _ = builder.Append("scope:");
                    _ = builder.Append(parameter.ComponentId?.ToString() ?? "<null>");
                    break;

                default:
                    _ = builder.Append("<unsupported:");
                    _ = builder.Append(parameter.Kind);
                    _ = builder.Append('>');
                    break;
            }
        }

        _ = builder.Append(']');

        if (dynamicParameterComponentIds.Length > 0)
        {
            _ = builder.Append(" dynamicIds=[");

            for (var i = 0; i < dynamicParameterComponentIds.Length; i++)
            {
                if (i > 0)
                    _ = builder.Append(", ");

                _ = builder.Append(dynamicParameterComponentIds[i]);
            }

            _ = builder.Append(']');
        }
    }

    private static void AppendInteractions(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Interactions:");

        CompiledUIInteraction[] interactions =
        [
            .. view.Interactions.All
                .OrderBy(static i => i.SourceKind == UIInteractionSourceKind.Property ? i.Source!.Value.Component.Id.ToString() : i.SourceEvent!.Value.ComponentId.ToString(), StringComparer.Ordinal)
                .ThenBy(static i => i.SourceKind == UIInteractionSourceKind.Property ? i.Source!.Value.Property.Name : i.SourceEvent!.Value.EventName, StringComparer.Ordinal)
                .ThenBy(static i => i.Target?.Component.Id.ToString() ?? string.Empty, StringComparer.Ordinal)
                .ThenBy(static i => i.Target?.Property.Name ?? string.Empty, StringComparer.Ordinal)
        ];

        if (interactions.Length == 0)
        {
            _ = builder.AppendLine("  <none>");
            return;
        }

        for (var i = 0; i < interactions.Length; i++)
        {
            CompiledUIInteraction interaction = interactions[i];

            _ = builder
                .Append("  ")
                .Append(interaction.Target is UIPropertyAddress target ? target.ToString() : $"effect:{interaction.Effect?.Kind}")
                .Append(" <= ")
                .Append(interaction.SourceKind == UIInteractionSourceKind.Property ? interaction.Source : interaction.SourceEvent)
                .Append(' ')
                .Append(interaction.Operator);

            if (interaction.Value is not null)
            {
                _ = builder.Append(' ');
                AppendObject(builder, interaction.Value);
            }

            // An effect interaction has no pair of values to choose between: it either runs or it does not.
            if (interaction.ActionKind == UIInteractionActionKind.SetProperty)
            {
                _ = builder.Append(" ? ");
                AppendObject(builder, interaction.TrueValue);
                _ = builder.Append(" : ");
                AppendObject(builder, interaction.FalseValue);
            }

            _ = builder.AppendLine();
        }
    }

    private static void AppendObject(StringBuilder builder, object? value)
    {
        switch (value)
        {
            case null:
                _ = builder.Append("<null>");
                break;

            case string stringValue:
                _ = builder.Append('"');
                _ = builder.Append(stringValue);
                _ = builder.Append('"');
                break;

            case bool boolValue:
                _ = builder.Append(boolValue ? "true" : "false");
                break;

            // Otherwise a bound column list reads as "UIGridUnit[]", which is the one thing about it nobody
            // needs to be told.
            case IEnumerable items:
                AppendItems(builder, items);
                break;

            default:
                _ = builder.Append(value);
                break;
        }
    }

    private static void AppendItems(StringBuilder builder, IEnumerable items)
    {
        _ = builder.Append('[');

        var first = true;

        foreach (var item in items)
        {
            if (!first)
                _ = builder.Append(", ");

            first = false;
            AppendObject(builder, item);
        }

        _ = builder.Append(']');
    }

    private void AppendEvents(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Events:");

        IReadOnlyList<CompiledUIEvent> events = view.Events.All;

        if (events.Count == 0)
        {
            _ = builder.AppendLine("  <none>");
            return;
        }

        foreach (CompiledUIEvent compiledEvent in SortById(events, static e => e.Id))
        {
            _ = builder
                .Append("  ")
                .Append(compiledEvent.Id)
                .Append(": ")
                .Append(compiledEvent.Address)
                .Append(" -> ")
                .Append(compiledEvent.Command);

            if (compiledEvent.Arguments.Length == 0)
            {
                _ = builder.AppendLine("()");
                continue;
            }

            _ = builder.Append('(');

            for (var i = 0; i < compiledEvent.Arguments.Length; i++)
            {
                if (i > 0)
                    _ = builder.Append(", ");

                AppendEventArgument(builder, view, compiledEvent.Arguments[i]);
            }

            _ = builder.AppendLine(")");
        }
    }

    private void AppendEventArgument(StringBuilder builder, CompiledView view, CompiledUIActionArgument argument)
    {
        _ = builder
            .Append(argument.Name)
            .Append(':');

        switch (argument.Kind)
        {
            case CompiledUIActionArgumentKind.Literal:
                _ = builder.Append("literal=");
                AppendObject(builder, argument.Value);
                break;

            case CompiledUIActionArgumentKind.CurrentItemKey:
                _ = builder.Append("currentItemKey");
                break;

            case CompiledUIActionArgumentKind.Binding:
                AppendEventBindingArgument(builder, view, argument);
                break;

            default:
                _ = builder
                    .Append("<unsupported:")
                    .Append(argument.Kind)
                    .Append('>');
                break;
        }
    }

    private void AppendEventBindingArgument(StringBuilder builder, CompiledView view, CompiledUIActionArgument argument)
    {
        if (argument.SourceId is null || argument.TemplateId is null)
        {
            _ = builder.Append("binding=<invalid>");
            return;
        }

        UIBindingSourceId sourceId = argument.SourceId.Value;
        UIBindingTemplateId templateId = argument.TemplateId.Value;

        CompiledUIBindingSource source = view.Sources.GetRequired(sourceId);
        CompiledUIBindingTemplate template = view.Templates.GetRequired(templateId);

        _ = builder
            .Append("binding source=")
            .Append(sourceId);

        if (_options.IncludeSourceKind)
        {
            _ = builder
                .Append('(')
                .Append(source.Kind)
                .Append(')');
        }

        _ = builder
            .Append(" template=")
            .Append(templateId)
            .Append(" \"")
            .Append(template.Template)
            .Append('"');

        AppendParameters(builder, argument.Parameters, argument.DynamicParameterComponentIds);
    }

    private static void AppendValidations(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Validations:");

        CompiledUIValidationRule[] validations =
        [
            .. view.Validations.All
                .OrderBy(static v => v.Target.Component.Id.ToString(), StringComparer.Ordinal)
                .ThenBy(static v => v.Target.Property.Name, StringComparer.Ordinal)
                .ThenBy(static v => v.Trigger)
        ];

        if (validations.Length == 0)
        {
            _ = builder.AppendLine("  <none>");
            return;
        }

        for (var i = 0; i < validations.Length; i++)
        {
            CompiledUIValidationRule validation = validations[i];

            _ = builder
                .Append("  ")
                .Append(validation.Target)
                .Append(" trigger=")
                .Append(validation.Trigger)
                .Append(" rule=")
                .Append(validation.Operator);

            if (validation.Value is not null)
            {
                _ = builder.Append(' ');
                AppendObject(builder, validation.Value);
            }

            _ = builder
                .Append(" severity=")
                .Append(validation.Severity)
                .Append(" message=");
            AppendObject(builder, validation.Message);
            _ = builder.AppendLine();
        }
    }

    private void AppendStateBindings(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("State bindings:");

        var any = false;

        foreach (UIComponentNode node in SortById(view.Graph.All, static n => n.ComponentId))
        {
            if (!view.State.TryGet(node.ComponentId, out UIComponentState? state))
                continue;

            foreach (CompiledUIPropertyValue value in state.All.OrderBy(static v => v.Property.Name, StringComparer.Ordinal))
            {
                if (!value.IsBind)
                    continue;

                any = true;

                _ = builder
                    .Append("  ")
                    .Append(node.ComponentId)
                    .Append('.')
                    .Append(value.Property.Name)
                    .Append(": ");

                if (value.BindingId is null)
                {
                    _ = builder.AppendLine("<missing>");
                    continue;
                }

                UIBindingId bindingId = value.BindingId.Value;

                CompiledUIBinding binding = view.Bindings.GetRequired(bindingId);
                CompiledUIBindingTemplate template = view.Templates.GetRequired(binding.TemplateId);
                CompiledUIBindingSource source = view.Sources.GetRequired(binding.SourceId);

                _ = builder
                    .Append(bindingId)
                    .Append(" source=")
                    .Append(binding.SourceId);

                if (_options.IncludeSourceKind)
                {
                    _ = builder
                        .Append('(')
                        .Append(source.Kind)
                        .Append(')');
                }

                _ = builder
                    .Append(" \"")
                    .Append(template.Template)
                    .Append('"')
                    .Append(" mode=")
                    .Append(binding.Mode);

                AppendParameters(builder, binding.Parameters, binding.DynamicParameterComponentIds);

                _ = builder.AppendLine();
            }
        }

        if (!any)
            _ = builder.AppendLine("  <none>");
    }

    /// <summary>
    /// The other half of a component's compiled state: what the author set outright rather than bound. A
    /// property that renders wrongly is as often a literal the compiler kept as a binding it resolved, and
    /// this section is where the difference is visible. <c>(translatable)</c> marks a value that goes through
    /// the translator before it is rendered.
    /// </summary>
    private void AppendStaticValues(StringBuilder builder, CompiledView view)
    {
        _ = builder.AppendLine("Static values:");

        var any = false;

        foreach (UIComponentNode node in SortById(view.Graph.All, static n => n.ComponentId))
        {
            if (!view.State.TryGet(node.ComponentId, out UIComponentState? state))
                continue;

            foreach (CompiledUIPropertyValue value in state.All.OrderBy(static v => v.Property.Name, StringComparer.Ordinal))
            {
                if (value.IsBind)
                    continue;

                // Compiled state carries every property of every component, set or not, so the unset ones are
                // the bulk of it — and a page of "<null>" buries the handful of values the reader came for.
                if (value.Value is null && !_options.IncludeUnsetStaticValues)
                    continue;

                any = true;

                _ = builder
                    .Append("  ")
                    .Append(node.ComponentId)
                    .Append('.')
                    .Append(value.Property.Name)
                    .Append(": ");

                AppendObject(builder, value.Value);

                if (value.IsTranslatable)
                    _ = builder.Append(" (translatable)");

                _ = builder.AppendLine();
            }
        }

        if (!any)
            _ = builder.AppendLine("  <none>");
    }

    private void AppendComponentTree(StringBuilder builder, CompiledView view)
    {
        _ = builder
            .Append("<view title=\"")
            .Append(view.Title)
            .AppendLine("\">");

        for (var i = 0; i < view.Regions.Length; i++)
        {
            CompiledRegion region = view.Regions[i];

            AppendIndent(builder, 1);
            _ = builder
                .Append("<region key=\"")
                .Append(region.Key)
                .AppendLine("\">");

            AppendComponentSubtree(builder, view, region.RootComponentId, 2, []);

            AppendIndent(builder, 1);
            _ = builder.AppendLine("</region>");
        }

        for (var i = 0; i < view.Dialogs.Length; i++)
        {
            CompiledDialog dialog = view.Dialogs[i];

            AppendIndent(builder, 1);
            _ = builder
                .Append("<dialog key=\"")
                .Append(dialog.Key)
                .Append("\" modal=\"")
                .Append(dialog.Modal)
                .Append("\" closeOnBackdrop=\"")
                .Append(dialog.CloseOnBackdrop)
                .Append("\" closeOnEscape=\"")
                .Append(dialog.CloseOnEscape)
                .AppendLine("\">");

            AppendComponentSubtree(builder, view, dialog.RootComponentId, 2, []);

            AppendIndent(builder, 1);
            _ = builder.AppendLine("</dialog>");
        }

        _ = builder.AppendLine("</view>");
    }

    private void AppendComponentSubtree(StringBuilder builder, CompiledView view, UIComponentId componentId, int indent, HashSet<UIComponentId> visited)
    {
        UIComponentNode node = view.Graph.GetRequired(componentId);

        AppendIndent(builder, indent);
        AppendComponentStartTag(builder, view, node);

        if (!visited.Add(componentId))
        {
            _ = builder.AppendLine(">");
            AppendIndent(builder, indent + 1);
            _ = builder.AppendLine("<cycle />");
            AppendIndent(builder, indent);
            _ = builder
                .Append("</")
                .Append(componentId)
                .AppendLine(">");
            return;
        }

        var hasChildren = node.Children.Length > 0;
        var hasNonChildSlots = HasNonChildSlots(node);

        if (!hasChildren && !hasNonChildSlots)
        {
            _ = builder.AppendLine(" />");
            _ = visited.Remove(componentId);
            return;
        }

        _ = builder.AppendLine(">");

        AppendChildren(builder, view, node, indent + 1, visited);
        AppendSlotGroups(builder, view, node, indent + 1, visited);

        AppendIndent(builder, indent);
        _ = builder
            .Append("</")
            .Append(node.ComponentId)
            .AppendLine(">");

        _ = visited.Remove(componentId);
    }

    private void AppendComponentStartTag(StringBuilder builder, CompiledView view, UIComponentNode node)
    {
        CompiledUIContext context = view.Contexts.GetRequired(node.ContextId);
        CompiledUIBindingTemplate contextTemplate = view.Templates.GetRequired(context.TemplateId);
        CompiledUIBindingSource source = view.Sources.GetRequired(contextTemplate.SourceId);

        _ = builder
            .Append('<')
            .Append(node.ComponentId)
            .Append(" id=\"")
            .Append(node.AuthoringId)
            .Append('"')
            .Append(" type=\"")
            .Append(node.TypeKey)
            .Append('"');

        if (_options.IncludeParent && node.ParentId is not null)
        {
            _ = builder
                .Append(" parent=\"")
                .Append(node.ParentId.Value)
                .Append('"');
        }

        _ = builder
            .Append(" context=\"")
            .Append(node.ContextId)
            .Append('"')
            .Append(" source=\"")
            .Append(contextTemplate.SourceId)
            .Append('"');

        if (_options.IncludeSourceKind)
        {
            _ = builder
                .Append(" sourceKind=\"")
                .Append(source.Kind)
                .Append('"');
        }

        if (_options.IncludeContextPath)
        {
            _ = builder
                .Append(" path=\"")
                .Append(contextTemplate.Template)
                .Append('"');
        }

        if (_options.IncludeContextParameterCount)
        {
            _ = builder
                .Append(" pc=\"")
                .Append(node.ContextParameterCount)
                .Append('"');
        }

        if (_options.IncludeContextParameterMarker && node.DefinesContextParameter)
            _ = builder.Append(" param=\"true\"");
    }

    private static bool HasNonChildSlots(UIComponentNode node)
    {
        for (var i = 0; i < node.Slots.Length; i++)
        {
            if (node.Slots[i].Kind != UIComponentSlotKind.Child)
                return true;
        }

        return false;
    }

    private void AppendChildren(StringBuilder builder, CompiledView view, UIComponentNode node, int indent, HashSet<UIComponentId> visited)
    {
        for (var i = 0; i < node.Children.Length; i++)
            AppendComponentSubtree(builder, view, node.Children[i], indent, visited);
    }

    private void AppendSlotGroups(StringBuilder builder, CompiledView view, UIComponentNode node, int indent, HashSet<UIComponentId> visited)
    {
        for (var i = 0; i < node.Slots.Length; i++)
        {
            UIComponentSlot slot = node.Slots[i];

            if (slot.Kind == UIComponentSlotKind.Child)
                continue;

            AppendIndent(builder, indent);
            AppendSlotStartTag(builder, slot);
            _ = builder.AppendLine(">");

            AppendComponentSubtree(builder, view, slot.RootComponentId, indent + 1, visited);

            AppendIndent(builder, indent);
            AppendSlotEndTag(builder, slot);
            _ = builder.AppendLine();
        }
    }

    private void AppendSlotStartTag(StringBuilder builder, UIComponentSlot slot)
    {
        _ = builder
            .Append('<')
            .Append(GetSlotTagName(slot.Kind));

        if (slot.Key is not null)
        {
            _ = builder
                .Append(" key=\"")
                .Append(slot.Key)
                .Append('"');
        }

        if (_options.IncludeSlotRootAndOwner)
        {
            _ = builder
                .Append(" root=\"")
                .Append(slot.RootComponentId)
                .Append('"')
                .Append(" owner=\"")
                .Append(slot.OwnerComponentId)
                .Append('"');
        }
    }

    private static string GetSlotTagName(UIComponentSlotKind kind)
        => kind switch
        {
            UIComponentSlotKind.Region => "region",
            UIComponentSlotKind.Template => "template",
            UIComponentSlotKind.TemplateVariant => "template",
            UIComponentSlotKind.EmptyTemplate => "empty-template",
            UIComponentSlotKind.GroupTemplate => "group-template",
            UIComponentSlotKind.ContextMenu => "context-menu",
            UIComponentSlotKind.Child => "child",
            _ => "slot"
        };

    private static void AppendSlotEndTag(StringBuilder builder, UIComponentSlot slot)
    {
        _ = builder
            .Append("</")
            .Append(GetSlotTagName(slot.Kind))
            .Append('>');
    }
}
