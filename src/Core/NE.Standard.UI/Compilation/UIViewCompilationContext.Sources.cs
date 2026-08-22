using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private CompiledUIBindingSource GetOrAddControllerSource(Dictionary<string, CompiledUIBindingSource> sourcesByKey)
    {
        const string Key = "controller";

        if (sourcesByKey.TryGetValue(Key, out CompiledUIBindingSource? existing))
            return existing;

        CompiledUIBindingSource source = new()
        {
            Id = CreateSourceId(),
            Kind = CompiledUIBindingSourceKind.Controller
        };

        sourcesByKey.Add(Key, source);

        return source;
    }

    private CompiledUIBindingSource GetOrAddComponentItemsSource(Dictionary<string, CompiledUIBindingSource> sourcesByKey, string componentId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        var key = $"items:{componentId}";

        if (sourcesByKey.TryGetValue(key, out CompiledUIBindingSource? existing))
            return existing;

        CompiledUIBindingSource source = new()
        {
            Id = CreateSourceId(),
            Kind = CompiledUIBindingSourceKind.ComponentItems,
            ComponentId = GetComponentId(componentId),
            ItemsProperty = IItemsComponent.ItemsProperty.Name
        };

        sourcesByKey.Add(key, source);

        return source;
    }

    private CompiledUIBindingTemplate GetOrAddTemplate(Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, CompiledUIBindingSource source, RecursivePathTemplate template)
    {
        BindingTemplateKey key = new(source.Id, template.Template);

        if (templatesByKey.TryGetValue(key, out CompiledUIBindingTemplate? existing))
            return existing;

        CompiledUIBindingTemplate compiledTemplate = new()
        {
            Id = CreateTemplateId(),
            SourceId = source.Id,
            Template = template.Template,
            ParameterCount = template.ParameterCount
        };

        templatesByKey.Add(key, compiledTemplate);

        return compiledTemplate;
    }

    private CompiledUIContext GetOrAddContext(Dictionary<UIBindingTemplateId, CompiledUIContext> contextsByTemplateId, CompiledUIBindingTemplate template)
    {
        if (contextsByTemplateId.TryGetValue(template.Id, out CompiledUIContext? existing))
            return existing;

        CompiledUIContext context = new()
        {
            Id = CreateContextId(),
            TemplateId = template.Id
        };

        contextsByTemplateId.Add(template.Id, context);

        return context;
    }
}
