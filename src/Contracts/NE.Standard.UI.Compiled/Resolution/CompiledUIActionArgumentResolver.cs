using System;
using System.Diagnostics;
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
    /// Resolves an action argument using runtime dynamic binding parameters.
    /// </summary>
    public static CompiledUIActionArgumentResolution Resolve(CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(argument);
        ArgumentNullException.ThrowIfNull(sources);
        ArgumentNullException.ThrowIfNull(templates);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        return argument.Kind switch
        {
            CompiledUIActionArgumentKind.Literal => new CompiledUIActionArgumentResolution(argument, null, null, argument.Value),
            CompiledUIActionArgumentKind.Binding => ResolveBindingArgument(argument, sources, templates, dynamicParameters),
            CompiledUIActionArgumentKind.CurrentItemKey => new CompiledUIActionArgumentResolution(argument, null, null, null),
            _ => throw new UnreachableException()
        };
    }

    private static CompiledUIActionArgumentResolution ResolveBindingArgument(CompiledUIActionArgument argument, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, object?[] dynamicParameters)
    {
        if (argument.SourceId is not { IsEmpty: false } sourceId)
            throw new InvalidOperationException($"Argument '{argument.Name}' has invalid source id.");

        if (argument.TemplateId is not { IsEmpty: false } templateId)
            throw new InvalidOperationException($"Argument '{argument.Name}' has invalid template id.");

        CompiledUIBindingSource source = sources.GetRequired(sourceId);

        var requiredDynamicCount = CompiledUIBindingParameterResolver.CountDynamic(argument.Parameters);
        var effectiveDynamicParameters = requiredDynamicCount < dynamicParameters.Length
            ? dynamicParameters[..requiredDynamicCount]
            : dynamicParameters;

        var parameters = CompiledUIBindingParameterResolver.Build(argument.Parameters, effectiveDynamicParameters);
        RecursivePath path = templates.Materialize(templateId, parameters);

        return new CompiledUIActionArgumentResolution(argument, source, path, null);
    }
}
