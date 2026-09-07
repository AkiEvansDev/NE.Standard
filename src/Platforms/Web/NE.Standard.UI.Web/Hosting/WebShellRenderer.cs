using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using NE.Standard.UI.Primitives.Binding;
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
        _ = document.Attribute(WebAttributes.Theme, WebCssValues.RootThemeName(context.ThemeMode));
        _ = document.Attribute("data-ui-notifications", context.NotificationPlacement.ToString().ToLowerInvariant());

        if (context.Theme.PressRipple)
            _ = document.Attribute(WebAttributes.PressRipple);

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

        // Classic, blocking, and in the head: the boot script must run before the body paints; a module would arrive too late.
        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.HeadScript))
            _ = head.Element("script", script => script.Attribute("src", ResolvePublicPath(asset)));
    }

    private static IOrderedEnumerable<WebAssetDescriptor> EnumerateAssets(WebShellContext context, UIWebAssetKind kind)
        => context.Assets
            .Where(asset => asset.Kind == kind)
            .OrderBy(static asset => asset.Order)
            .ThenBy(static asset => asset.Key, StringComparer.Ordinal);

    private static string ResolvePublicPath(WebAssetDescriptor asset)
        => asset.ResolveVersionedPublicPath();

    private static void RenderBody(IHtmlElementBuilder body, WebShellContext context)
    {
        _ = body.Element("div", root =>
        {
            _ = root.Attribute("id", context.RootElementId);
            _ = root.Attribute("data-ui-root");

            if (context.ScrollContentOnly)
                _ = root.Attribute("data-ui-scroll-content");

            _ = root.Raw(context.Content);
        });

        RenderMetadata(body, context);
        RenderStrings(body, context);
        RenderHydration(body, context);

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

    private static void RenderStrings(IHtmlElementBuilder body, WebShellContext context)
    {
        if (context.Strings is null || context.Strings.Count == 0)
            return;

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute("data-ui-strings");
            _ = script.Raw(JsonSerializer.Serialize(context.Strings, MetadataJsonOptions));
        });
    }

    /// <summary>
    /// Before the scripts, so the runtime finds it as soon as it starts — and after the content, so what it
    /// patches is already in the document.
    /// </summary>
    private static void RenderHydration(IHtmlElementBuilder body, WebShellContext context)
    {
        if (string.IsNullOrWhiteSpace(context.HydrationJson))
            return;

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute("data-ui-hydration");
            _ = script.Raw(context.HydrationJson);
        });
    }

    /// <summary>
    /// A wire object carrying only the fields that have something in them; used for the framework's own shapes, never an author's items.
    /// </summary>
    private static Dictionary<string, object?> Written(params ReadOnlySpan<(string Name, object? Value)> fields)
    {
        Dictionary<string, object?> written = new(fields.Length, StringComparer.Ordinal);

        foreach ((var name, var value) in fields)
        {
            if (value is not null)
                written[name] = value;
        }

        return written;
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
                operations = property.Operations.Select(static operation => Written(
                    ("kind", operation.Kind),
                    ("target", operation.Target),
                    ("name", operation.Name),
                    ("converter", operation.Converter),
                    ("condition", operation.Condition?.ToString()),
                    ("value", operation.Value),
                    ("optional", operation.Optional ? true : null)
                ))
            }),
            // No `kind`: nothing on the client reads it. `mode` only when it is not the default.
            bindings = metadata.Bindings.Select(static binding => Written(
                ("bindingId", binding.BindingId.Value),
                ("componentId", binding.ComponentId.Value),
                ("propertyId", binding.PropertyId),
                ("mode", binding.Mode == UIBindingMode.OneWay ? null : binding.Mode.ToString()),
                ("dynamicParameterComponentIds", binding.DynamicParameterComponentIds.Count == 0
                    ? null
                    : binding.DynamicParameterComponentIds.Select(static id => id.Value)),
                ("itemTemplate", binding.ItemTemplate),
                ("itemTemplateParameters", binding.ItemTemplateParameters?.Select(static parameter => Written(
                    ("kind", parameter.Kind.ToString()),
                    ("componentId", parameter.ComponentId?.Value),
                    ("value", parameter.Value)
                ))),
                ("fallbackValue", binding.FallbackValue)
            )),
            items = metadata.ItemsTemplates.Select(static itemsTemplate => Written(
                ("componentId", itemsTemplate.ComponentId.Value),
                ("templateKeyPropertyName", itemsTemplate.TemplateKeyPropertyName),
                ("fallbackTemplateKey", itemsTemplate.FallbackTemplateKey),
                ("itemWrapperElementName", itemsTemplate.ItemWrapperElementName),
                ("itemWrapperClassName", itemsTemplate.ItemWrapperClassName),
                ("rowDecorator", itemsTemplate.RowDecorator),
                ("composite", itemsTemplate.Composite is null ? null : Written(
                    ("itemElementName", itemsTemplate.Composite.ItemElementName),
                    ("itemClassName", itemsTemplate.Composite.ItemClassName),
                    ("itemRole", itemsTemplate.Composite.ItemRole),
                    ("hostSlotVariantKey", itemsTemplate.Composite.HostSlotVariantKey),
                    ("slots", itemsTemplate.Composite.Slots.Select(static slot => Written(
                        ("variantKey", slot.VariantKey),
                        ("wrapperElementName", slot.WrapperElementName),
                        ("wrapperClassName", slot.WrapperClassName),
                        ("wrapperRole", slot.WrapperRole),
                        ("variantKeyPropertyName", slot.VariantKeyPropertyName)
                    )))
                ))
            )),
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
