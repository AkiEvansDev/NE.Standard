using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Resolution;

/// <summary>
/// Resolves compiled UI action arguments for command execution.
/// </summary>
public static class CompiledUIActionArgumentResolver
{
    /// <summary>
    /// Resolves an action argument using runtime dynamic binding parameters, the argument taking the chain's first keys.
    /// </summary>
    public static CompiledUIActionArgumentResolution Resolve(CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, object?[] dynamicParameters)
        => Resolve(argument, sources, templates, dynamicParameters, null);

    /// <summary>Resolves an action argument using runtime dynamic binding parameters.</summary>
    /// <remarks>
    /// <paramref name="scopes"/> names the item scope each key of <paramref name="dynamicParameters"/> belongs to, outermost first:
    /// the argument takes the keys of the scopes it reads wherever they stand in the chain — the middle key of three for a value of
    /// the middle row. Without it, or when it does not name every scope the argument reads, the argument takes the chain's first keys.
    /// </remarks>
    public static CompiledUIActionArgumentResolution Resolve(CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, object?[] dynamicParameters, IReadOnlyList<UIComponentId>? scopes)
    {
        ArgumentNullException.ThrowIfNull(argument);
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(templates);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        return argument.Kind switch
        {
            // An event key addresses nothing: what is compiled is its place in the chain, and the runtime reads the chain itself.
            CompiledUIActionArgumentKind.Literal or CompiledUIActionArgumentKind.EventKey => new CompiledUIActionArgumentResolution(argument, null, null, argument.Value),
            CompiledUIActionArgumentKind.Binding or CompiledUIActionArgumentKind.CurrentItemKey or CompiledUIActionArgumentKind.GroupKey => ResolveBindingArgument(argument, sources, templates, dynamicParameters, scopes),
            _ => throw new UnreachableException()
        };
    }

    private static CompiledUIActionArgumentResolution ResolveBindingArgument(CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, object?[] dynamicParameters, IReadOnlyList<UIComponentId>? scopes)
    {
        if (argument.SourceId is not { IsEmpty: false } sourceId)
            throw new InvalidOperationException($"Argument '{argument.Name}' has invalid source id.");

        if (argument.TemplateId is not { IsEmpty: false } templateId)
            throw new InvalidOperationException($"Argument '{argument.Name}' has invalid template id.");

        CompiledUIBindingSource source = sources.GetRequired(sourceId);

        var parameters = CompiledUIBindingParameterResolver.Build(argument.Parameters, SelectKeys(argument.Parameters, dynamicParameters, scopes));
        RecursivePath path = templates.Materialize(templateId, parameters);

        return new CompiledUIActionArgumentResolution(argument, source, path, null);
    }

    /// <summary>The keys of the scopes the argument reads, in its own order; the chain's first keys when a scope cannot be placed.</summary>
    private static object?[] SelectKeys(CompiledUIBindingParameter[] parameters, object?[] dynamicParameters, IReadOnlyList<UIComponentId>? scopes)
    {
        var required = CompiledUIBindingParameterResolver.CountDynamic(parameters);

        if (scopes is not null && scopes.Count == dynamicParameters.Length)
        {
            var keys = new object?[required];
            var at = 0;

            foreach (CompiledUIBindingParameter parameter in parameters)
            {
                if (parameter.Kind is not (CompiledUIBindingParameterKind.Dynamic or CompiledUIBindingParameterKind.Scope))
                    continue;

                var index = parameter.ComponentId is UIComponentId scope ? IndexOf(scopes, scope) : -1;

                if (index < 0)
                    return FirstKeys(dynamicParameters, required);

                keys[at++] = dynamicParameters[index];
            }

            return keys;
        }

        return FirstKeys(dynamicParameters, required);
    }

    private static int IndexOf(IReadOnlyList<UIComponentId> scopes, UIComponentId scope)
    {
        for (var i = 0; i < scopes.Count; i++)
        {
            if (scopes[i] == scope)
                return i;
        }

        return -1;
    }

    private static object?[] FirstKeys(object?[] dynamicParameters, int required)
        => required < dynamicParameters.Length ? dynamicParameters[..required] : dynamicParameters;
}
