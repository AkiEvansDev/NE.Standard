using System;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Reflection;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// Which of a host's templates a row is drawn with: the variant its key property names, else the host's fallback variant, else the
/// default template. The renderer, the runtime and the test page read it here, so a row is stamped as it was drawn.
/// </summary>
public static class ItemTemplateSelection
{
    /// <summary>
    /// Attempts to get the slot a row of the host is drawn with: its variant (<see cref="ResolveVariant"/>), else the default template.
    /// </summary>
    public static bool TryResolveSlot(UIComponentGraph graph, UIComponentId hostId, string? keyProperty, string? fallbackKey, object? item, [NotNullWhen(true)] out UIComponentSlot? slot)
        => ResolveVariant(graph, hostId, keyProperty, fallbackKey, item) is { } variant
            ? graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out slot, variant)
            : graph.TryGetSlot(hostId, UIComponentSlotKind.Template, out slot);

    /// <summary>
    /// Gets the variant a row of the host wears: the one its <paramref name="keyProperty"/> names, else <paramref name="fallbackKey"/>;
    /// null where the host has neither, and the row wears the default template.
    /// </summary>
    public static string? ResolveVariant(UIComponentGraph graph, UIComponentId hostId, string? keyProperty, string? fallbackKey, object? item)
    {
        ArgumentNullException.ThrowIfNull(graph);

        if (!string.IsNullOrWhiteSpace(keyProperty) && ReadKey(item, keyProperty) is { } key && graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, key))
            return key;

        return !string.IsNullOrWhiteSpace(fallbackKey) && graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, fallbackKey) ? fallbackKey : null;
    }

    /// <summary>
    /// Gets an item's key property as the text a variant is matched by, invariant; null where the item has none or it is blank.
    /// </summary>
    public static string? ReadKey(object? item, string keyProperty)
    {
        if (!ItemContext.TryReadPath(item, keyProperty, out var value))
            return null;

        var text = value as string ?? Convert.ToString(value, CultureInfo.InvariantCulture);

        return string.IsNullOrWhiteSpace(text) ? null : text;
    }

    /// <summary>
    /// Gets the composite slot a row wears out of <paramref name="baseKey"/>'s: the one its kind names (<c>node:folder</c>), else the
    /// slot itself (<c>node</c>).
    /// </summary>
    public static string ResolveCompositeVariant(UIComponentGraph graph, UIComponentId hostId, string baseKey, string? keyProperty, object? item)
    {
        ArgumentNullException.ThrowIfNull(graph);
        ArgumentException.ThrowIfNullOrWhiteSpace(baseKey);

        if (string.IsNullOrWhiteSpace(keyProperty) || ReadKey(item, keyProperty) is not { } kind)
            return baseKey;

        var typed = $"{baseKey}:{kind}";

        return graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, typed) ? typed : baseKey;
    }

    /// <summary>
    /// Whether the item's key property could take <paramref name="key"/>: an enum-typed one names exactly its members, any other
    /// may name anything.
    /// </summary>
    public static bool CouldName(object? item, string? keyProperty, string? key)
    {
        if (key is null || item is null || string.IsNullOrWhiteSpace(keyProperty))
            return true;

        PropertyInfo? property = ResolvePropertyPath(item, keyProperty);

        if (property is null)
            return true;

        Type type = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

        return !type.IsEnum || Enum.IsDefined(type, key);
    }

    private static PropertyInfo? ResolvePropertyPath(object item, string path)
    {
        var current = (object?)item;
        Type currentType = item.GetType();
        var start = 0;

        while (true)
        {
            var dot = path.IndexOf('.', start);
            var end = dot < 0 ? path.Length : dot;

            if (path.AsSpan(start, end - start).IsWhiteSpace())
                return null;

            var segment = start == 0 && dot < 0 ? path : path[start..end];
            PropertyInfo? property = ItemContext.ResolveProperty(currentType, segment);

            if (dot < 0)
                return property;

            if (current is not null && ItemContext.TryReadProperty(current, segment, out current) && current is not null)
            {
                currentType = current.GetType();
            }
            else if (property is not null)
            {
                current = null;
                currentType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
            }
            else
            {
                return null;
            }

            start = dot + 1;
        }
    }
}
