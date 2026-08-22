using System;
using System.Threading;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private int _componentId;
    private int _sourceId;
    private int _templateId;
    private int _contextId;
    private int _bindingId;
    private int _eventId;

    private UIComponentId CreateComponentId()
    {
        var id = Interlocked.Increment(ref _componentId);
        return new UIComponentId(id);
    }

    private UIBindingSourceId CreateSourceId()
    {
        var id = Interlocked.Increment(ref _sourceId);
        return new UIBindingSourceId(id);
    }

    private UIBindingTemplateId CreateTemplateId()
    {
        var id = Interlocked.Increment(ref _templateId);
        return new UIBindingTemplateId(id);
    }

    private UIContextId CreateContextId()
    {
        var id = Interlocked.Increment(ref _contextId);
        return new UIContextId(id);
    }

    private UIBindingId CreateBindingId()
    {
        var id = Interlocked.Increment(ref _bindingId);
        return new UIBindingId(id);
    }

    private UIEventId CreateEventId()
    {
        var id = Interlocked.Increment(ref _eventId);
        return new UIEventId(id);
    }

    private static CompiledPath AppendPath(CompiledPath basePath, RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (path.Count == 0)
            return basePath;

        (RecursivePathTemplate template, var parameters) = RecursivePathTemplate.FromPath(path);

        var combinedTemplate = CombineTemplate(basePath.Template.Template, template.Template);
        CompiledUIBindingParameter[] combinedParameters = new CompiledUIBindingParameter[basePath.Parameters.Length + parameters.Length];

        if (basePath.Parameters.Length > 0)
            Array.Copy(basePath.Parameters, combinedParameters, basePath.Parameters.Length);

        for (var i = 0; i < parameters.Length; i++)
            combinedParameters[basePath.Parameters.Length + i] = CompiledUIBindingParameter.Fixed(parameters[i]);

        return new CompiledPath(basePath.Source, RecursivePathTemplate.Parse(combinedTemplate), combinedParameters);
    }

    private static string CombineTemplate(string left, string right)
    {
        if (left.Length == 0)
            return right;

        if (right.Length == 0)
            return left;

        if (right[0] == '[')
            return left + right;

        return $"{left}.{right}";
    }

    private static CompiledPath AppendDynamicParameter(CompiledPath path, UIComponentId componentId)
    {
        var template = AppendParameter(path.Template.Template);
        CompiledUIBindingParameter[] parameters = new CompiledUIBindingParameter[path.Parameters.Length + 1];

        if (path.Parameters.Length > 0)
            Array.Copy(path.Parameters, parameters, path.Parameters.Length);

        parameters[^1] = CompiledUIBindingParameter.Dynamic(componentId);

        return new CompiledPath(path.Source, RecursivePathTemplate.Parse(template), parameters);
    }

    private static string AppendParameter(string template)
        => template.Length == 0 ? "[]" : $"{template}[]";

    private static UIComponentId[] GetDynamicParameterComponentIds(CompiledUIBindingParameter[] parameters)
        => CompiledUIBindingParameterResolver.GetDynamicComponentIds(parameters);
}
