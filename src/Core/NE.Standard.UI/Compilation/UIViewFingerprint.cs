using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// One short hash over what a compiled view renders and runs — options, regions, dialogs, components, state, templates, bindings,
/// events, interactions and validations — so a stale client or render cache entry and a new compile can be told apart.
/// </summary>
internal static class UIViewFingerprint
{
    private static readonly JsonSerializerOptions FingerprintJsonOptions = new()
    {
        NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
        ReferenceHandler = ReferenceHandler.IgnoreCycles
    };

    public static string Compute(IUIView view, UIViewCompilationResult result)
    {
        StringBuilder text = new();

        Append(text, "v", FormatValue(view.Title), FormatDictionary(view.TitleArguments), FormatValue(view.Options));

        foreach (CompiledRegion region in result.Regions)
            Append(text, "r", region.Key, region.RootComponentId.Value);

        foreach (CompiledDialog dialog in result.Dialogs)
            Append(text, "d", dialog.Key, dialog.RootComponentId.Value, FormatValue(dialog));

        foreach (UIComponentNode node in result.Nodes)
        {
            Append(text, "n", node.ComponentId.Value, node.TypeKey, node.ParentId?.Value, node.ContextId.Value, node.ContextParameterCount, node.DefinesContextParameter, node.IsContentTree);

            foreach (UIComponentSlot slot in node.Slots)
                Append(text, "s", slot.Kind, slot.Key, slot.KeyProperty, slot.RootComponentId.Value);
        }

        foreach (UIComponentState state in result.States)
        {
            IReadOnlyList<CompiledUIPropertyValue> values = state.All;

            for (var i = 0; i < values.Count; i++)
            {
                CompiledUIPropertyValue propertyValue = values[i];

                if (propertyValue.IsBind || propertyValue.Value is not null)
                    Append(text, "p", state.ComponentId.Value, propertyValue.Property.Name, propertyValue.IsBind, propertyValue.BindingId?.Value, propertyValue.IsContent, propertyValue.IsTranslatable, FormatValue(propertyValue.Value));
            }
        }

        foreach (CompiledUIBindingSource source in result.BindingSources)
            Append(text, "bs", source.Id.Value, source.Kind, source.ComponentId?.Value);

        foreach (CompiledUIBindingTemplate template in result.BindingTemplates)
            Append(text, "bt", template.Id.Value, template.SourceId.Value, template.Template);

        foreach (CompiledUIBinding binding in result.Bindings)
        {
            Append(text, "b", binding.Id.Value, binding.Kind, binding.Address.Component.Id.Value, binding.Address.Property.Name, binding.Mode,
                binding.SourceId.Value, binding.TemplateId.Value, binding.DynamicParameterComponentIds.Length, binding.Optional, binding.IsTranslatable, FormatValue(binding.TargetFallbackValue));

            AppendParameters(text, "bp", binding.Parameters);
        }

        foreach (CompiledUIEvent compiledEvent in result.Events)
        {
            Append(text, "e", compiledEvent.Id.Value, compiledEvent.Address.ComponentId.Value, compiledEvent.Address.EventName, compiledEvent.Command, compiledEvent.SubmitsForm, compiledEvent.ShowsPending);

            foreach (CompiledUIActionArgument argument in compiledEvent.Arguments)
            {
                Append(text, "ea", argument.Name, argument.Kind, argument.SourceId?.Value, argument.TemplateId?.Value, FormatValue(argument.Value));
                AppendParameters(text, "ep", argument.Parameters);
            }
        }

        foreach (CompiledUIInteraction interaction in result.Interactions)
        {
            Append(text, "i", interaction.SourceKind, interaction.ActionKind, interaction.Source?.Component.Id.Value, interaction.Source?.Property.Name,
                interaction.SourceEvent?.ComponentId.Value, interaction.SourceEvent?.EventName, interaction.Target?.Component.Id.Value, interaction.Target?.Property.Name,
                interaction.RowKey, interaction.Operator, FormatValue(interaction.Value), FormatValue(interaction.TrueValue), FormatValue(interaction.FalseValue), FormatValue(interaction.Effect));
        }

        foreach (CompiledUIValidationRule rule in result.Validations)
        {
            Append(text, "vr", rule.Target.Component.Id.Value, rule.Target.Property.Name, rule.Trigger, rule.Operator, FormatValue(rule.Value),
                rule.ValueSource?.Component.Id.Value, rule.ValueSource?.Property.Name, rule.Severity, FormatValue(rule.Message));
        }

        foreach (KeyValuePair<UIComponentId, UIPropertyAddress> target in result.ValidationMessageTargets)
            Append(text, "vm", target.Key.Value, target.Value.Component.Id.Value, target.Value.Property.Name);

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(text.ToString()));

        return Convert.ToHexStringLower(hash.AsSpan(0, 8));
    }

    private static void AppendParameters(StringBuilder text, string tag, CompiledUIBindingParameter[] parameters)
    {
        for (var i = 0; i < parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = parameters[i];
            Append(text, tag, parameter.Kind, parameter.ComponentId?.Value, FormatValue(parameter.Value));
        }
    }

    private static void Append(StringBuilder text, string tag, params object?[] parts)
    {
        _ = text.Append(tag);

        foreach (var part in parts)
            _ = text.Append('|').Append(Convert.ToString(part, CultureInfo.InvariantCulture));

        _ = text.Append('\n');
    }

    private static string FormatValue(object? value)
    {
        switch (value)
        {
            case null:
                return string.Empty;

            case string text:
                return $"s:{text.Length.ToString(CultureInfo.InvariantCulture)}:{text}";

            case bool flag:
                return flag ? "b:1" : "b:0";

            case Enum enumValue:
                return $"e:{enumValue.GetType().FullName}:{enumValue}";

            case UIPhrase phrase:
                return phrase.IsText
                    ? $"pt:{phrase.Key.Length.ToString(CultureInfo.InvariantCulture)}:{phrase.Key}"
                    : $"pk:{phrase.Key}:{FormatDictionary(phrase.Arguments)}";

            case IFormattable formattable:
                return $"f:{value.GetType().Name}:{formattable.ToString(null, CultureInfo.InvariantCulture)}";

            case IReadOnlyDictionary<string, object?> map:
                return FormatDictionary(map);

            case IEnumerable items:
                return FormatEnumerable(items);

            default:
                try
                {
                    return $"j:{value.GetType().FullName}:{JsonSerializer.Serialize(value, value.GetType(), FingerprintJsonOptions)}";
                }
                catch (Exception exception) when (exception is JsonException or NotSupportedException or ArgumentException)
                {
                    return $"o:{value.GetType().FullName}:{Convert.ToString(value, CultureInfo.InvariantCulture)}";
                }
        }
    }

    private static string FormatDictionary(IReadOnlyDictionary<string, object?>? arguments)
    {
        if (arguments is not { Count: > 0 })
            return string.Empty;

        var keys = new string[arguments.Count];
        var index = 0;

        foreach (var key in arguments.Keys)
            keys[index++] = key;

        Array.Sort(keys, StringComparer.Ordinal);

        StringBuilder builder = new("{");

        for (var i = 0; i < keys.Length; i++)
        {
            if (i > 0)
                _ = builder.Append(',');

            var key = keys[i];
            _ = builder.Append(key.Length.ToString(CultureInfo.InvariantCulture)).Append(':').Append(key).Append('=').Append(FormatValue(arguments[key]));
        }

        return builder.Append('}').ToString();
    }

    private static string FormatEnumerable(IEnumerable items)
    {
        StringBuilder list = new("[");
        var first = true;

        foreach (var item in items)
        {
            if (!first)
                _ = list.Append(',');

            first = false;
            _ = list.Append(FormatValue(item));
        }

        return list.Append(']').ToString();
    }
}
