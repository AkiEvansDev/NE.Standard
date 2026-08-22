using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// Builds and validates concrete parameters for compiled binding templates.
/// </summary>
public static class CompiledUIBindingParameterResolver
{
    /// <summary>
    /// Builds concrete template parameters from fixed and dynamic parameter definitions.
    /// </summary>
    /// <remarks>
    /// Scope parameters consume a runtime value but fill no template slot, so the result is shorter than
    /// <paramref name="parameters"/> whenever the path sits inside an item scope belonging to another source.
    /// </remarks>
    public static object[] Build(CompiledUIBindingParameter[] parameters, object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        var dynamicCount = CountDynamic(parameters);

        if (dynamicCount != dynamicParameters.Length)
            throw new ArgumentException($"Expected {dynamicCount} dynamic parameters, but got {dynamicParameters.Length}.", nameof(dynamicParameters));

        var result = new object[CountSlots(parameters)];
        var dynamicIndex = 0;
        var resultIndex = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = parameters[i];

            switch (parameter.Kind)
            {
                case CompiledUIBindingParameterKind.Fixed:
                    result[resultIndex++] = parameter.Value ?? throw new InvalidOperationException($"Fixed parameter #{i} is null.");
                    break;

                case CompiledUIBindingParameterKind.Dynamic:
                    var dynamicValue = dynamicParameters[dynamicIndex++];

                    if (dynamicValue is not int and not string)
                        throw new InvalidOperationException($"Dynamic parameter #{i} must be int or string.");

                    result[resultIndex++] = dynamicValue;
                    break;

                case CompiledUIBindingParameterKind.Scope:
                    if (dynamicParameters[dynamicIndex++] is not int and not string)
                        throw new InvalidOperationException($"Scope parameter #{i} must be int or string.");

                    break;

                default:
                    throw new UnreachableException();
            }
        }

        return result;
    }

    /// <summary>
    /// Gets component ids that provide dynamic parameters.
    /// </summary>
    public static UIComponentId[] GetDynamicComponentIds(CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);

        if (parameters.Length == 0)
            return [];

        List<UIComponentId> result = [];

        for (var i = 0; i < parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = parameters[i];

            if (parameter.Kind is not CompiledUIBindingParameterKind.Dynamic and not CompiledUIBindingParameterKind.Scope)
                continue;

            if (parameter.ComponentId is not { IsEmpty: false } componentId)
                throw new InvalidOperationException($"Dynamic parameter #{i} has invalid component id.");

            result.Add(componentId);
        }

        return [.. result];
    }

    /// <summary>
    /// Validates that dynamic parameter component ids match the compiled parameter definitions.
    /// </summary>
    public static void ValidateDynamicComponentIds(string owner, CompiledUIBindingParameter[] parameters, UIComponentId[] dynamicParameterComponentIds)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(owner);
        ArgumentNullException.ThrowIfNull(parameters);
        ArgumentNullException.ThrowIfNull(dynamicParameterComponentIds);

        var dynamicCount = CountDynamic(parameters);

        if (dynamicCount != dynamicParameterComponentIds.Length)
            throw new InvalidOperationException($"{owner} has {dynamicCount} dynamic parameters, but {dynamicParameterComponentIds.Length} dynamic parameter component ids.");

        var dynamicIndex = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = parameters[i];

            switch (parameter.Kind)
            {
                case CompiledUIBindingParameterKind.Fixed:
                    if (parameter.Value is not int and not string)
                        throw new InvalidOperationException($"{owner} fixed parameter #{i} must be int or string.");
                    break;

                case CompiledUIBindingParameterKind.Dynamic:
                case CompiledUIBindingParameterKind.Scope:
                    if (parameter.ComponentId is not { IsEmpty: false } componentId)
                        throw new InvalidOperationException($"{owner} dynamic parameter #{i} has invalid component id.");

                    UIComponentId expectedComponentId = dynamicParameterComponentIds[dynamicIndex++];

                    if (!componentId.Equals(expectedComponentId))
                        throw new InvalidOperationException($"{owner} dynamic parameter #{i} component id mismatch. Expected '{componentId}', got '{expectedComponentId}'.");

                    break;

                default:
                    throw new UnreachableException();
            }
        }
    }

    /// <summary>
    /// Counts the runtime-provided parameters in a compiled parameter list — the arity of its address.
    /// </summary>
    public static int CountDynamic(CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);

        var count = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            if (parameters[i].Kind is CompiledUIBindingParameterKind.Dynamic or CompiledUIBindingParameterKind.Scope)
                count++;
        }

        return count;
    }

    /// <summary>
    /// Counts the parameters that fill a template slot — every kind except scope.
    /// </summary>
    public static int CountSlots(CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);
        return parameters.Length - CountScope(parameters);
    }

    /// <summary>
    /// Counts the parameters that carry an enclosing scope's key without indexing the path.
    /// </summary>
    public static int CountScope(CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);

        var count = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            if (parameters[i].Kind == CompiledUIBindingParameterKind.Scope)
                count++;
        }

        return count;
    }
}
