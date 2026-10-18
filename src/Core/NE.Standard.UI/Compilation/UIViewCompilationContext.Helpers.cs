using System;
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
        var id = ++_componentId;
        return new UIComponentId(id);
    }

    private UIBindingSourceId CreateSourceId()
    {
        var id = ++_sourceId;
        return new UIBindingSourceId(id);
    }

    private UIBindingTemplateId CreateTemplateId()
    {
        var id = ++_templateId;
        return new UIBindingTemplateId(id);
    }

    private UIContextId CreateContextId()
    {
        var id = ++_contextId;
        return new UIContextId(id);
    }

    private UIBindingId CreateBindingId()
    {
        var id = ++_bindingId;
        return new UIBindingId(id);
    }

    private UIEventId CreateEventId()
    {
        var id = ++_eventId;
        return new UIEventId(id);
    }

    private static CompiledPath AppendPath(CompiledPath basePath, RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (path.Count == 0)
            return basePath;

        (RecursivePathTemplate template, var parameters) = RecursivePathTemplate.FromPath(path);

        CompiledUIBindingParameter[] combinedParameters = new CompiledUIBindingParameter[basePath.Parameters.Length + parameters.Length];

        if (basePath.Parameters.Length > 0)
            Array.Copy(basePath.Parameters, combinedParameters, basePath.Parameters.Length);

        for (var i = 0; i < parameters.Length; i++)
            combinedParameters[basePath.Parameters.Length + i] = CompiledUIBindingParameter.Fixed(parameters[i]);

        return new CompiledPath(basePath.Source, basePath.Template.Append(template), combinedParameters);
    }

    private static CompiledPath AppendDynamicParameter(CompiledPath path, UIComponentId componentId)
    {
        CompiledUIBindingParameter[] parameters = new CompiledUIBindingParameter[path.Parameters.Length + 1];

        if (path.Parameters.Length > 0)
            Array.Copy(path.Parameters, parameters, path.Parameters.Length);

        parameters[^1] = CompiledUIBindingParameter.Dynamic(componentId);

        return new CompiledPath(path.Source, path.Template.AppendParameter(), parameters);
    }

    private static UIComponentId[] GetDynamicParameterComponentIds(CompiledUIBindingParameter[] parameters)
        => CompiledUIBindingParameterResolver.GetDynamicComponentIds(parameters);
}
