using System;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Extensions;

/// <summary>The presets' one reading of what a component binds: whether a property is bound, and the binding that binds it.</summary>
internal static class PresetBindings
{
    /// <summary>The binding path <paramref name="path"/> names.</summary>
    public static string Path<TSource>(Expression<Func<TSource, object?>> path)
        => RecursivePath.FromExpression(path).ToString();

    /// <summary>The binding path <paramref name="path"/> names, or null where none was given.</summary>
    public static string? PathOrNull<TSource>(Expression<Func<TSource, object?>>? path)
        => path is null ? null : RecursivePath.FromExpression(path).ToString();

    /// <summary>Whether <paramref name="component"/> binds <paramref name="property"/>.</summary>
    public static bool Binds(IVisualComponent component, UIProperty property)
        => TryFind(component, property, out _);

    /// <summary>The binding <paramref name="component"/> holds for <paramref name="property"/>, where it binds one.</summary>
    public static bool TryFind(IVisualComponent component, UIProperty property, out UIBinding binding)
    {
        foreach (UIBinding candidate in component.Bindings)
        {
            if (candidate.Target.Equals(property))
            {
                binding = candidate;
                return true;
            }
        }

        binding = default;
        return false;
    }
}
