using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.Json;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Html;

namespace NE.Standard.UI.Web.Hosting;

public static class WebShellRenderer
{
    private static readonly JsonSerializerOptions MetadataJsonOptions = WebWireJson.CreateOptions();

    public static string Render(WebShellContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        HtmlContentBuilder html = new();

        _ = html.Raw("<!doctype html>");
        _ = html.Element("html", document => RenderDocument(document, context));

        using StringWriter writer = new();
        html.WriteTo(writer);
        return writer.ToString();
    }

    private static void RenderDocument(IHtmlElementBuilder document, WebShellContext context)
    {
        _ = document.Attribute("lang", context.Language);
        _ = document.Attribute("data-ui-theme", WebCssValues.ThemeName(context.ThemeMode));
        _ = document.Attribute("data-ui-notifications", context.NotificationPlacement.ToString().ToLowerInvariant());

        _ = document.Element("head", head => RenderHead(head, context));
        _ = document.Element("body", body => RenderBody(body, context));
    }

    private static void RenderHead(IHtmlElementBuilder head, WebShellContext context)
    {
        _ = head.Element("meta", meta => meta.Attribute("charset", "utf-8"));
        _ = head.Element("meta", meta =>
        {
            _ = meta.Attribute("name", "viewport");
            _ = meta.Attribute("content", "width=device-width, initial-scale=1");
        });

        _ = head.Element("style", style => style.Raw(WebThemeCssBuilder.Build(context.Theme)));

        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.Css))
        {
            _ = head.Element("link", link =>
            {
                _ = link.Attribute("rel", "stylesheet");
                _ = link.Attribute("href", ResolvePublicPath(asset));
            });
        }
    }

    private static IOrderedEnumerable<WebAssetDescriptor> EnumerateAssets(WebShellContext context, UIWebAssetKind kind)
        => context.Assets
            .Where(asset => asset.Kind == kind)
            .OrderBy(static asset => asset.Order)
            .ThenBy(static asset => asset.Key, StringComparer.Ordinal);

    private static string ResolvePublicPath(WebAssetDescriptor asset)
    {
        asset.Validate();

        var path = !string.IsNullOrWhiteSpace(asset.PublicPath)
            ? asset.PublicPath
            : asset.Source;

        var version = ResolveAssetVersion(asset);

        return path.Contains('?', StringComparison.Ordinal)
            ? string.Create(CultureInfo.InvariantCulture, $"{path}&v={version}")
            : string.Create(CultureInfo.InvariantCulture, $"{path}?v={version}");
    }

    private static string ResolveAssetVersion(WebAssetDescriptor asset)
    {
        if (!string.IsNullOrWhiteSpace(asset.Version))
            return asset.Version;

        return asset.SourceKind switch
        {
            UIWebAssetSourceKind.File => ResolveFileAssetVersion(asset),
            UIWebAssetSourceKind.EmbeddedResource => ResolveEmbeddedAssetVersion(asset),
            UIWebAssetSourceKind.Url => "external",
            _ => throw new UnreachableException()
        };
    }

    private static string ResolveFileAssetVersion(WebAssetDescriptor asset)
    {
        var filePath = asset.ResolveFilePath();

        return File.Exists(filePath)
            ? File.GetLastWriteTimeUtc(filePath).Ticks.ToString(CultureInfo.InvariantCulture)
            : asset.Source.GetHashCode(StringComparison.Ordinal).ToString(CultureInfo.InvariantCulture);
    }

    private static string ResolveEmbeddedAssetVersion(WebAssetDescriptor asset)
    {
        var assemblyName = asset.ResourceAssemblyName ?? string.Empty;

        return HashCode.Combine(
            asset.Source,
            assemblyName,
            asset.Key,
            asset.Kind
        ).ToString(CultureInfo.InvariantCulture);
    }

    private static void RenderBody(IHtmlElementBuilder body, WebShellContext context)
    {
        _ = body.Element("div", root =>
        {
            _ = root.Attribute("id", context.RootElementId);
            _ = root.Attribute("data-ui-root");
            _ = root.Raw(context.Content);
        });

        RenderMetadata(body, context);

        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.JavaScript))
        {
            _ = body.Element("script", script =>
            {
                _ = script.Attribute("type", "module");
                _ = script.Attribute("src", ResolvePublicPath(asset));
            });
        }
    }

    private static void RenderMetadata(IHtmlElementBuilder body, WebShellContext context)
    {
        var json = context.MetadataJson;

        if (string.IsNullOrWhiteSpace(json))
        {
            if (context.Metadata is null)
                return;

            json = SerializeMetadata(context.Metadata);
        }

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute("data-ui-metadata");
            _ = script.Raw(json);
        });
    }

    public static string SerializeMetadata(WebRenderMetadata metadata)
    {
        ArgumentNullException.ThrowIfNull(metadata);

        metadata.Validate();

        var model = new
        {
            propertyDefinitions = metadata.PropertyDefinitions.Select(static property => new
            {
                propertyId = property.PropertyId,
                componentTypeKey = property.ComponentTypeKey,
                propertyName = property.PropertyName,
                operations = property.Operations.Select(static operation => new
                {
                    kind = operation.Kind.ToString(),
                    target = operation.Target,
                    name = operation.Name,
                    converter = operation.Converter,
                    condition = operation.Condition?.ToString()
                })
            }),
            bindings = metadata.Bindings.Select(static binding => new
            {
                bindingId = binding.BindingId.Value,
                kind = binding.Kind.ToString(),
                mode = binding.Mode.ToString(),
                componentId = binding.ComponentId.Value,
                propertyId = binding.PropertyId,
                dynamicParameterComponentIds = binding.DynamicParameterComponentIds.Select(static id => id.Value),
                itemTemplate = binding.ItemTemplate,
                itemTemplateParameters = binding.ItemTemplateParameters?.Select(static parameter => new
                {
                    kind = parameter.Kind.ToString(),
                    componentId = parameter.ComponentId?.Value,
                    value = parameter.Value
                })
            }),
            items = metadata.ItemsTemplates.Select(static itemsTemplate => new
            {
                componentId = itemsTemplate.ComponentId.Value,
                templateKeyPropertyName = itemsTemplate.TemplateKeyPropertyName,
                fallbackTemplateKeyPropertyName = itemsTemplate.FallbackTemplateKeyPropertyName,
                itemWrapperElementName = itemsTemplate.ItemWrapperElementName,
                itemWrapperClassName = itemsTemplate.ItemWrapperClassName,
                composite = itemsTemplate.Composite is null ? null : new
                {
                    itemElementName = itemsTemplate.Composite.ItemElementName,
                    itemClassName = itemsTemplate.Composite.ItemClassName,
                    hostSlotVariantKey = itemsTemplate.Composite.HostSlotVariantKey,
                    slots = itemsTemplate.Composite.Slots.Select(static slot => new
                    {
                        variantKey = slot.VariantKey,
                        wrapperElementName = slot.WrapperElementName,
                        wrapperClassName = slot.WrapperClassName
                    })
                }
            }),
            events = metadata.Events.Select(static compiledEvent => new
            {
                eventId = compiledEvent.EventId.Value,
                componentId = compiledEvent.Address.ComponentId.Value,
                eventName = compiledEvent.Address.EventName,
                dynamicParameterComponentIds = compiledEvent.DynamicParameterComponentIds.Select(static id => id.Value)
            }),
            interactions = metadata.Interactions.Select(static interaction => new
            {
                sourceKind = interaction.SourceKind.ToString(),
                source = interaction.Source is null
                    ? null
                    : new
                    {
                        componentId = interaction.Source.ComponentId.Value,
                        propertyId = interaction.Source.PropertyId,
                        dynamicParameterComponentIds = interaction.Source.DynamicParameterComponentIds.Select(static id => id.Value)
                    },
                sourceEvent = interaction.SourceEvent is null
                    ? null
                    : new
                    {
                        componentId = interaction.SourceEvent.Value.ComponentId.Value,
                        eventName = interaction.SourceEvent.Value.EventName
                    },
                target = interaction.Target is null
                    ? null
                    : new
                    {
                        componentId = interaction.Target.ComponentId.Value,
                        propertyId = interaction.Target.PropertyId,
                        dynamicParameterComponentIds = interaction.Target.DynamicParameterComponentIds.Select(static id => id.Value)
                    },
                actionKind = interaction.ActionKind.ToString(),
                effect = interaction.Effect,
                @operator = interaction.Operator.ToString(),
                value = interaction.Value,
                trueValue = interaction.TrueValue,
                falseValue = interaction.FalseValue
            }),
            validations = metadata.Validations.Select(static validation => new
            {
                target = new
                {
                    componentId = validation.Target.ComponentId.Value,
                    propertyId = validation.Target.PropertyId
                },
                trigger = validation.Trigger.ToString(),
                @operator = validation.Operator.ToString(),
                value = validation.Value,
                severity = validation.Severity.ToString(),
                message = validation.Message
            }),
            itemValues = metadata.ItemValues.Select(static itemValues => new
            {
                componentId = itemValues.ComponentId.Value,
                items = itemValues.Items.Select(static item => new
                {
                    key = item.Key,
                    item = item.Item
                })
            }),
            itemsFilterSort = metadata.ItemsFilterSort.Select(static itemsFilterSort => new
            {
                componentId = itemsFilterSort.ComponentId.Value,
                filters = itemsFilterSort.Filters.Select(static filter => new
                {
                    itemProperty = filter.ItemProperty,
                    @operator = filter.Operator.ToString(),
                    value = filter.Value,
                    source = filter.Source is null
                        ? null
                        : new
                        {
                            componentId = filter.Source.ComponentId.Value,
                            propertyId = filter.Source.PropertyId
                        },
                    activeOperator = filter.ActiveOperator.ToString(),
                    activeValue = filter.ActiveValue
                }),
                sorts = itemsFilterSort.Sorts.Select(static sort => new
                {
                    itemProperty = sort.ItemProperty,
                    direction = sort.Direction.ToString(),
                    priority = sort.Priority,
                    source = sort.Source is null
                        ? null
                        : new
                        {
                            componentId = sort.Source.ComponentId.Value,
                            propertyId = sort.Source.PropertyId
                        },
                    activeOperator = sort.ActiveOperator.ToString(),
                    activeValue = sort.ActiveValue
                })
            })
        };

        return JsonSerializer.Serialize(model, MetadataJsonOptions);
    }
}
