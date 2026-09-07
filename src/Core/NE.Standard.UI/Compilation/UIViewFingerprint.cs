using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// One short hash over what a page's client holds of a compiled view — the components with their slots, the bindings, the events
/// and the interactions, by id — so a page and a compile that disagree are told apart: the render cache keys on it, and an attach
/// presenting another one is sent to reload instead of being fed updates its ids cannot address.
/// </summary>
internal static class UIViewFingerprint
{
    public static string Compute(UIComponentNode[] nodes, CompiledUIBinding[] bindings, CompiledUIEvent[] events, CompiledUIInteraction[] interactions)
    {
        StringBuilder text = new();

        foreach (UIComponentNode node in nodes)
        {
            Append(text, "n", node.ComponentId.Value, node.TypeKey, node.ParentId?.Value, node.ContextId.Value, node.ContextParameterCount);

            foreach (UIComponentSlot slot in node.Slots)
                Append(text, "s", slot.Kind, slot.Key, slot.RootComponentId.Value);
        }

        foreach (CompiledUIBinding binding in bindings)
        {
            Append(text, "b", binding.Id.Value, binding.Kind, binding.Address.Component.Id.Value, binding.Address.Property.Name, binding.Mode,
                binding.SourceId.Value, binding.TemplateId.Value, binding.DynamicParameterComponentIds.Length);
        }

        foreach (CompiledUIEvent compiledEvent in events)
            Append(text, "e", compiledEvent.Id.Value, compiledEvent.Address.ComponentId.Value, compiledEvent.Address.EventName, compiledEvent.Command);

        foreach (CompiledUIInteraction interaction in interactions)
        {
            Append(text, "i", interaction.SourceKind, interaction.ActionKind, interaction.Source?.Component.Id.Value, interaction.Source?.Property.Name,
                interaction.SourceEvent?.ComponentId.Value, interaction.SourceEvent?.EventName, interaction.Target?.Component.Id.Value, interaction.Target?.Property.Name);
        }

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(text.ToString()));

        return Convert.ToHexStringLower(hash.AsSpan(0, 8));
    }

    private static void Append(StringBuilder text, string tag, params object?[] parts)
    {
        _ = text.Append(tag);

        foreach (var part in parts)
            _ = text.Append('|').Append(Convert.ToString(part, CultureInfo.InvariantCulture));

        _ = text.Append('\n');
    }
}
