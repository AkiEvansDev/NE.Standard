using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reflection;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

public sealed class ItemContext(object? item)
{
    private static readonly ConcurrentDictionary<(Type Type, string Name), PropertyInfo?> PropertyCache = new();

    public object? Item { get; } = item;

    public bool TryResolveBindingTemplate(CompiledUIBindingTemplate template, CompiledUIBindingParameter[] parameters, IReadOnlyList<WebDynamicParameterScope> scopes, out object? value)
    {
        ArgumentNullException.ThrowIfNull(template);
        ArgumentNullException.ThrowIfNull(parameters);
        ArgumentNullException.ThrowIfNull(scopes);

        return TryResolveBindingTemplate(template.Template, parameters, scopes, out value);
    }

    public bool TryResolveBindingTemplate(string template, CompiledUIBindingParameter[] parameters, IReadOnlyList<WebDynamicParameterScope> scopes, out object? value)
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

        // A failed property read is soft. A Dynamic parameter resolves from the scope stack and ignores
        // `current` entirely, so every segment read before one is discarded the moment it resolves — the
        // "Groups" in "Groups[].SubItems" exists because the template is a straight-line string, never because
        // its value is used. Only a path that ends still invalid, or a Fixed parameter with nothing to resolve
        // against, is a real failure. Mirrors binding-template-evaluator.ts; see docs/PROJECT.md §4.
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

    /// <summary>
    /// Walks past the parameters that carry an enclosing item scope's key: they make a component addressable
    /// and index nothing, so no "[]" in the template belongs to them. Mirrors binding-template-evaluator.ts.
    /// </summary>
    private static int SkipScopeParameters(CompiledUIBindingParameter[] parameters, int index)
    {
        while (index < parameters.Length && parameters[index].Kind == CompiledUIBindingParameterKind.Scope)
            index++;

        return index;
    }

    private static bool TryResolveDynamicParameter(CompiledUIBindingParameter parameter, IReadOnlyList<WebDynamicParameterScope> scopes, out object? value)
    {
        value = null;

        if (parameter.ComponentId is not { IsEmpty: false } componentId)
            return false;

        for (var i = scopes.Count - 1; i >= 0; i--)
        {
            WebDynamicParameterScope scope = scopes[i];

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
                    if (item is IBindableItem bindableItem && string.Equals(bindableItem.Id, key, StringComparison.Ordinal))
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

        if (item is IReadOnlyDictionary<string, object?> readOnlyDictionary && readOnlyDictionary.TryGetValue(propertyName, out var readOnlyValue))
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

    /// <summary>
    /// Caches the reflection lookup per (type, name). This runs once per bound property, per item, per render
    /// — an uncached <c>GetProperty</c> made a long static list pay for the same lookup on every row.
    /// </summary>
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
            // Two properties differing only in case. Case-sensitive is the only defensible answer, and it is
            // what the caller asked for before the IgnoreCase fallback widened it.
            return type.GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public);
        }
    }
}
