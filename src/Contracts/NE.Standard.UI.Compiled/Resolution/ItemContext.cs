using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reflection;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// One item a template is resolved against: walks a compiled binding template over it, reading properties by name and
/// stepping through <c>[]</c> slots from the scope stack. The client's <c>binding-template-evaluator.ts</c> is the same walk.
/// </summary>
public sealed class ItemContext(object? item)
{
    private static readonly ConcurrentDictionary<(Type Type, string Name), PropertyInfo?> PropertyCache = new();

    public object? Item { get; } = item;

    public bool TryResolveBindingTemplate(CompiledUIBindingTemplate template, CompiledUIBindingParameter[] parameters, IReadOnlyList<UIDynamicParameterScope> scopes, out object? value)
    {
        ArgumentNullException.ThrowIfNull(template);
        ArgumentNullException.ThrowIfNull(parameters);
        ArgumentNullException.ThrowIfNull(scopes);

        return TryResolveBindingTemplate(template.Template, parameters, scopes, out value);
    }

    public bool TryResolveBindingTemplate(string template, CompiledUIBindingParameter[] parameters, IReadOnlyList<UIDynamicParameterScope> scopes, out object? value)
    {
        ArgumentNullException.ThrowIfNull(template);
        ArgumentNullException.ThrowIfNull(parameters);
        ArgumentNullException.ThrowIfNull(scopes);

        value = null;
        var current = Item;

        if (template.Length == 0 || template == ".")
        {
            value = current;
            return true;
        }

        ReadOnlySpan<char> span = template.AsSpan();
        var parameterIndex = 0;
        var i = 0;
        var expectSegment = true;

        // A failed property read is soft: a Dynamic parameter discards `current`, so only a path that ends still
        // invalid, or a Fixed parameter with nothing to resolve against, is a real failure.
        var currentValid = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                    return false;

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                    return false;

                parameterIndex = SkipScopeParameters(parameters, parameterIndex);

                if (parameterIndex >= parameters.Length)
                    return false;

                CompiledUIBindingParameter parameter = parameters[parameterIndex++];

                if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
                {
                    if (!TryResolveDynamicParameter(parameter, scopes, out current))
                        return false;

                    currentValid = true;
                }
                else
                {
                    if (!currentValid || !TryReadCollectionItem(current, parameter.Value, out current))
                        return false;
                }

                i += 2;
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
                return false;

            if (currentValid)
            {
                if (TryReadProperty(current, span[start..i].ToString(), out var read))
                    current = read;
                else
                    currentValid = false;
            }

            expectSegment = false;
        }

        if (expectSegment || SkipScopeParameters(parameters, parameterIndex) != parameters.Length || !currentValid)
            return false;

        value = current;
        return true;
    }

    /// <summary>Walks past the scope parameters, which index nothing and so own no "[]" in the template.</summary>
    private static int SkipScopeParameters(CompiledUIBindingParameter[] parameters, int index)
    {
        while (index < parameters.Length && parameters[index].Kind == CompiledUIBindingParameterKind.Scope)
            index++;

        return index;
    }

    private static bool TryResolveDynamicParameter(CompiledUIBindingParameter parameter, IReadOnlyList<UIDynamicParameterScope> scopes, out object? value)
    {
        value = null;

        if (parameter.ComponentId is not { IsEmpty: false } componentId)
            return false;

        for (var i = scopes.Count - 1; i >= 0; i--)
        {
            UIDynamicParameterScope scope = scopes[i];

            if (!scope.ComponentId.Equals(componentId))
                continue;

            value = scope.Item;
            return true;
        }

        return false;
    }

    public static bool TryReadCollectionItem(object? source, object? parameter, out object? value)
    {
        value = null;

        if (source is null || parameter is null)
            return false;

        if (parameter is int index)
        {
            if (source is IList list)
            {
                if ((uint)index >= (uint)list.Count)
                    return false;

                value = list[index];
                return true;
            }

            if (source is IReadOnlyList<object?> readOnlyList)
            {
                if ((uint)index >= (uint)readOnlyList.Count)
                    return false;

                value = readOnlyList[index];
                return true;
            }

            return false;
        }

        if (parameter is string key)
        {
            if (source is IReadOnlyDictionary<string, object?> readOnlyDictionary && readOnlyDictionary.TryGetValue(key, out var readOnlyValue))
            {
                value = readOnlyValue;
                return true;
            }

            if (source is IDictionary<string, object?> dictionary && dictionary.TryGetValue(key, out var dictionaryValue))
            {
                value = dictionaryValue;
                return true;
            }

            if (source is IEnumerable enumerable and not string)
            {
                foreach (var item in enumerable)
                {
                    // By id, typed member or dictionary entry alike: the client reads the wire form and knows no interface.
                    if (item is IBindableItem bindableItem && string.Equals(bindableItem.Id, key, StringComparison.Ordinal))
                    {
                        value = item;
                        return true;
                    }

                    if (item is not IBindableItem &&
                        TryReadProperty(item, nameof(IBindableItem.Id), out var id) &&
                        id is string itemId &&
                        string.Equals(itemId, key, StringComparison.Ordinal))
                    {
                        value = item;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public bool TryReadProperty(string propertyName, out object? value)
        => TryReadProperty(Item, propertyName, out value);

    public static bool TryReadProperty(object? item, string propertyName, out object? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyName);

        value = null;

        if (item is null)
            return false;

        if (propertyName == ".")
        {
            value = item;
            return true;
        }

        if (item is IReadOnlyDictionary<string, object?> readOnlyDictionary && TryReadDictionary(readOnlyDictionary, propertyName, out var readOnlyValue))
        {
            value = readOnlyValue;
            return true;
        }

        if (item is IDictionary<string, object?> dictionary && dictionary.TryGetValue(propertyName, out var dictionaryValue))
        {
            value = dictionaryValue;
            return true;
        }

        PropertyInfo? property = ResolveProperty(item.GetType(), propertyName);

        if (property is null)
            return false;

        value = property.GetValue(item);
        return true;
    }

    /// <summary>Reads a property out of a dictionary item by exact, then camelCase, then case-insensitive key.</summary>
    private static bool TryReadDictionary(IReadOnlyDictionary<string, object?> item, string propertyName, out object? value)
    {
        if (item.TryGetValue(propertyName, out value))
            return true;

        if (item.TryGetValue(ToCamelCase(propertyName), out value))
            return true;

        foreach (KeyValuePair<string, object?> entry in item)
        {
            if (string.Equals(entry.Key, propertyName, StringComparison.OrdinalIgnoreCase))
            {
                value = entry.Value;
                return true;
            }
        }

        value = null;
        return false;
    }

    private static string ToCamelCase(string value)
    {
        if (value.Length == 0 || !char.IsUpper(value[0]))
            return value;

        return string.Concat(char.ToLowerInvariant(value[0]).ToString(), value.AsSpan(1));
    }

    /// <summary>Caches the reflection lookup per (type, name); it runs once per bound property, per item, per render.</summary>
    private static PropertyInfo? ResolveProperty(Type type, string propertyName)
        => PropertyCache.GetOrAdd((type, propertyName), static key => FindProperty(key.Type, key.Name));

    private static PropertyInfo? FindProperty(Type type, string propertyName)
    {
        try
        {
            return type.GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
        }
        catch (AmbiguousMatchException)
        {
            // Two properties differing only in case: fall back to the exact name the caller asked for.
            return type.GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public);
        }
    }
}
