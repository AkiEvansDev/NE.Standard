using System;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Shell.Updates.Client;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private object? TryGetControllerValue(RecursivePath path)
        => Controller.TryGetRecursiveValue(path, out var value) ? value : null;

    private bool IsComponentInside(UIComponentId componentId, UIComponentId ancestorComponentId)
    {
        if (componentId.Equals(ancestorComponentId))
            return true;

        UIComponentId? current = componentId;

        while (current is not null)
        {
            UIComponentId currentValue = current.Value;

            if (currentValue.Equals(ancestorComponentId))
                return true;

            current = View.Graph.GetRequired(currentValue).ParentId;
        }

        return false;
    }

    private static object?[] AppendDynamicParameter(object?[] source, object? value)
    {
        var result = new object?[source.Length + 1];

        if (source.Length > 0)
            Array.Copy(source, result, source.Length);

        result[^1] = value;

        return result;
    }

    /// <summary>The first <paramref name="count"/> keys: the row's own, or an ancestor's, out of keys that name more.</summary>
    private static object?[] TakeDynamicParameters(object?[] source, int count)
        => source.Length == count ? source : source[..count];

    /// <summary>The keys a write's binding reads it by: the outer ones of the rows its field stands in, none for a Root-scoped binding.</summary>
    private static object?[] BindingKeys(ClientValueUIUpdate update, CompiledUIBinding binding)
        => TakeDynamicParameters(update.Address.Component.DynamicParameters, CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters));

    private static bool TryBuildDynamicParameters(CompiledUIBinding binding, object[] materializedParameters, out object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(binding);
        ArgumentNullException.ThrowIfNull(materializedParameters);

        dynamicParameters = [];

        // A binding under a nested items source is unaddressable from a controller change: its scope key has no materialized path.
        if (CompiledUIBindingParameterResolver.CountScope(binding.Parameters) > 0)
            return false;

        if (binding.Parameters.Length != materializedParameters.Length)
            return false;

        var dynamicCount = 0;

        for (var i = 0; i < binding.Parameters.Length; i++)
        {
            if (binding.Parameters[i].Kind == CompiledUIBindingParameterKind.Dynamic)
                dynamicCount++;
        }

        if (dynamicCount == 0)
        {
            for (var i = 0; i < binding.Parameters.Length; i++)
            {
                CompiledUIBindingParameter parameter = binding.Parameters[i];

                if (parameter.Kind == CompiledUIBindingParameterKind.Fixed && !Equals(parameter.Value, materializedParameters[i]))
                    return false;
            }

            return true;
        }

        dynamicParameters = new object?[dynamicCount];

        var dynamicIndex = 0;

        for (var i = 0; i < binding.Parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = binding.Parameters[i];

            switch (parameter.Kind)
            {
                case CompiledUIBindingParameterKind.Dynamic:
                    dynamicParameters[dynamicIndex++] = materializedParameters[i];
                    break;

                case CompiledUIBindingParameterKind.Fixed:
                    if (!Equals(parameter.Value, materializedParameters[i]))
                        return false;
                    break;

                case CompiledUIBindingParameterKind.Scope:
                default:
                    throw new UnreachableException();
            }
        }

        return true;
    }

    private static bool IsDynamicParameterPrefix(object?[] prefix, object?[] value)
    {
        if (prefix.Length > value.Length)
            return false;

        for (var i = 0; i < prefix.Length; i++)
        {
            if (!Equals(prefix[i], value[i]))
                return false;
        }

        return true;
    }
}
