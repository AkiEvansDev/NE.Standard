using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Assets;
using NE.Standard.UI.Web.Html;

namespace NE.Standard.UI.Web.Hosting;

public static class WebShellRenderer
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string NotificationsAttribute = "data-ui-notifications";
    private const string ScrollContentAttribute = "data-ui-scroll-content";
    private const string FullHeightSidesAttribute = "data-ui-full-height-sides";
    private const string SideDrawersAttribute = "data-ui-side-drawers";
    private const string DrawerBackdropClass = "ui-shell__drawer-backdrop";

    // An icon of no bytes: the browser shows its own blank and fetches nothing.
    private const string EmptyIcon = "data:,";

    private static readonly JsonSerializerOptions MetadataJsonOptions = WebWireJson.CreateOptions();

    // The theme's stylesheet once per theme rather than once a page: a theme is an immutable record the application holds for good.
    private static readonly ConditionalWeakTable<UITheme, string> ThemeCss = [];

    /// <summary>The document as a string; a response is better served by <see cref="Render(WebShellContext, TextWriter)"/>.</summary>
    public static string Render(WebShellContext context)
    {
        using StringWriter writer = new();

        Render(context, writer);

        return writer.ToString();
    }

    /// <summary>Writes the document into <paramref name="writer"/>, the page's own markup included without a copy of it.</summary>
    public static void Render(WebShellContext context, TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(writer);

        HtmlContentBuilder html = new();

        _ = html.Raw("<!doctype html>");
        _ = html.Element("html", document => RenderDocument(document, context));

        html.WriteTo(writer);
    }

    private static void RenderDocument(IHtmlElementBuilder document, WebShellContext context)
    {
        _ = document.Attribute("lang", context.Language);
        _ = document.Attribute(WebAttributes.Theme, WebCssValues.RootThemeName(context.ThemeMode));
        _ = document.Attribute(NotificationsAttribute, context.NotificationPlacement.ToString().ToLowerInvariant());

        if (context.Theme.PressRipple)
            _ = document.Attribute(WebAttributes.PressRipple);

        // The address the page registers the framework's worker by, or, where the application's own worker imports it, waits for.
        if (context.ServiceWorker != WebServiceWorkerMode.Off)
        {
            _ = document.Attribute(WebAttributes.ServiceWorker, StandardWebAssetDescriptors.Worker.ResolveVersionedPublicPath());

            if (context.ServiceWorker == WebServiceWorkerMode.Imported)
                _ = document.Attribute(WebAttributes.ServiceWorkerImported);
        }

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

        // The tab's name and the history entry's: without one a browser shows the address.
        if (context.Title is not null)
            _ = head.Element("title", title => title.Text(context.Title));

        // Always named: without a link a browser asks for /favicon.ico, which an application serving none answers with a 404.
        _ = head.Element("link", link =>
        {
            _ = link.Attribute("rel", "icon");
            _ = link.Attribute("href", string.IsNullOrWhiteSpace(context.Icon) ? EmptyIcon : context.Icon);
        });

        if (context.HasManifest)
        {
            _ = head.Element("link", link =>
            {
                _ = link.Attribute("rel", "manifest");
                _ = link.Attribute("href", WebManifestEndpoint.Path);
            });
        }

        _ = head.Element("style", style => style.Raw(ThemeCss.GetValue(context.Theme, WebThemeCssBuilder.Build)));

        // The reader's own, after the application's and apart from it: that one stays the same text for every reader. Colours and
        // numbers alone, so nothing in it needs escaping.
        if (WebThemeColorsCss.For(context.Theme, context.ThemeColors) is { Length: > 0 } colors)
        {
            _ = head.Element("style", style =>
            {
                _ = style.Attribute(WebAttributes.ThemeColors);
                _ = style.Raw(colors);
            });
        }
        // The view's own, beside the theme's: a number the options checked, so nothing in it needs escaping.
        _ = head.Element("style", style => style.Raw(string.Create(CultureInfo.InvariantCulture, $":root{{--ui-notification-width:{context.NotificationWidth}px}}")));

        // A face is otherwise asked for only once a rule using it is matched, after its stylesheet: a glyph face is `font-display:
        // block`, so every icon would be a blank box for that extra round trip. `crossorigin`, as a font is always fetched in CORS
        // mode: a preload without it is not the request the `@font-face` makes, and the face would download twice.
        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.Font))
        {
            if (!IsDrawnWith(asset, context.Theme))
                continue;

            _ = head.Element("link", link =>
            {
                _ = link.Attribute("rel", "preload");
                _ = link.Attribute("href", ResolvePublicPath(asset));
                _ = link.Attribute("as", "font");
                _ = link.Attribute("type", "font/woff2");
                _ = link.Attribute("crossorigin");
            });
        }

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

    /// <summary>The assets of one kind, in the order the context holds them: the registry's, sorted once (<see cref="WebShellContext.Assets"/>).</summary>
    private static IEnumerable<WebAssetDescriptor> EnumerateAssets(WebShellContext context, UIWebAssetKind kind)
    {
        foreach (WebAssetDescriptor asset in context.Assets)
        {
            if (asset.Kind == kind)
                yield return asset;
        }
    }

    // Inter is only the default theme's face: a theme naming another never draws with it, and a preload would fetch it for nothing.
    private static bool IsDrawnWith(WebAssetDescriptor font, UITheme theme)
        => !string.Equals(font.Key, StandardWebAssetDescriptors.Font.Key, StringComparison.Ordinal)
        || NamesFamily(theme.Typography.FontFamily, "Inter");

    // An entry of the family list, not a substring: "Interstate" is another face. A theme's family holds no quotes to strip.
    private static bool NamesFamily(string families, string family)
    {
        foreach (var entry in families.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        {
            if (string.Equals(entry, family, StringComparison.OrdinalIgnoreCase))
                return true;
        }

        return false;
    }

    private static string ResolvePublicPath(WebAssetDescriptor asset)
        => asset.ResolveVersionedPublicPath();

    private static void RenderBody(IHtmlElementBuilder body, WebShellContext context)
    {
        // The page's form, so a password field with no FormId stands in a form beside its login, as a browser and a password manager
        // expect. `dialog` makes a submission a no-op, never a navigation carrying the fields in the address, and `novalidate` keeps
        // the browser's own checks and bubbles off: the framework's buttons are all `type="button"`, and Enter is the field keys engine's.
        // `role="none"`: the whole page is no form to a screen reader, whose list of landmarks would open with an unnamed one.
        _ = body.Element("form", root =>
        {
            _ = root.Attribute("id", context.RootElementId);
            _ = root.Attribute(WebAttributes.Root);
            _ = root.Attribute("method", "dialog");
            _ = root.Attribute("novalidate");
            _ = root.Attribute("role", "none");

            if (context.StandInNavigation is UINavigationRequest standIn)
                _ = root.Attribute(WebAttributes.Navigation, JsonSerializer.Serialize(new { route = standIn.Route, parameters = standIn.Parameters }, MetadataJsonOptions));

            if (context.ScrollContentOnly)
                _ = root.Attribute(ScrollContentAttribute);

            if (context.ShellLayout == UIShellLayout.FullHeightSides)
                _ = root.Attribute(FullHeightSidesAttribute);

            if (context.SideDrawers)
                _ = root.Attribute(SideDrawersAttribute);

            if (context.Content is not null)
                _ = root.Content(context.Content);

            // What an open drawer dims the page under, and a press on it closes the drawer; the stylesheet shows it only then.
            if (context.SideDrawers)
                _ = root.Element("div", backdrop => backdrop.Class(DrawerBackdropClass).Attribute(WebAttributes.DrawerBackdrop));
        });

        RenderForms(body, context);
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

    /// <summary>
    /// A hidden form per FormId, which its fields join by <c>form</c>: beside the root, since a form inside the root's form is dropped by
    /// the parser, and in the markup, since a browser reads a page's forms as it loads. Each submits nowhere, as the root does.
    /// </summary>
    private static void RenderForms(IHtmlElementBuilder body, WebShellContext context)
    {
        if (context.FormIds.Count == 0)
            return;

        _ = body.Element("div", holder =>
        {
            _ = holder.Attribute(WebAttributes.FormsHolder);
            _ = holder.Attribute("hidden");

            foreach (var formId in context.FormIds)
            {
                _ = holder.Element("form", form =>
                {
                    _ = form.Attribute("id", WebForms.ElementId(formId));
                    _ = form.Attribute("method", "dialog");
                    _ = form.Attribute("novalidate");
                });
            }
        });
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
            _ = script.Attribute(WebAttributes.Metadata);
            _ = script.Raw(json);
        });
    }

    private static void RenderStrings(IHtmlElementBuilder body, WebShellContext context)
    {
        var json = context.StringsJson;

        if (string.IsNullOrEmpty(json))
        {
            if (context.Strings is null || context.Strings.Count == 0)
                return;

            json = SerializeStrings(context.Strings);
        }

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute(WebAttributes.Strings);
            _ = script.Raw(json);
        });
    }

    /// <summary>The words as the page carries them, for a caller that keeps the result per language (<see cref="WebShellContext.StringsJson"/>).</summary>
    public static string SerializeStrings(IReadOnlyDictionary<string, string> strings)
    {
        ArgumentNullException.ThrowIfNull(strings);

        return JsonSerializer.Serialize(strings, MetadataJsonOptions);
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
            _ = script.Attribute(WebAttributes.Hydration);
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
            propertyDefinitions = metadata.PropertyDefinitions.Select(static property => Written(
                ("propertyId", property.PropertyId),
                ("componentTypeKey", property.ComponentTypeKey),
                ("propertyName", property.PropertyName),
                ("operations", property.Operations.Select(static operation => Written(
                    ("kind", operation.Kind),
                    ("target", operation.Target),
                    ("name", operation.Name),
                    ("converter", operation.Converter),
                    ("condition", operation.Condition?.ToString()),
                    ("value", operation.Value),
                    ("optional", operation.Optional ? true : null)
                ))),
                ("translatable", property.Translatable ? true : null)
            )),
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
                ("optional", binding.Optional ? true : null),
                ("fallbackValue", binding.FallbackValue),
                ("content", binding.Content ? true : null)
            )),
            items = metadata.ItemsTemplates.Select(static itemsTemplate => Written(
                ("componentId", itemsTemplate.ComponentId.Value),
                ("templateKeyPropertyName", itemsTemplate.TemplateKeyPropertyName),
                ("fallbackTemplateKey", itemsTemplate.FallbackTemplateKey),
                ("itemWrapperElementName", itemsTemplate.ItemWrapperElementName),
                ("itemWrapperClassName", itemsTemplate.ItemWrapperClassName),
                ("itemWrapperRole", itemsTemplate.ItemWrapperRole),
                ("announcesSelection", itemsTemplate.AnnouncesSelection ? true : null),
                ("rowDecorator", itemsTemplate.RowDecorator),
                ("itemPaths", itemsTemplate.ItemPaths),
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
                        ("variantKeyPropertyName", slot.VariantKeyPropertyName),
                        ("wrapperAttributes", slot.WrapperAttributes)
                    )))
                    )
                )
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
            exposedProperties = metadata.ExposedProperties.Select(static property => Written(
                ("componentId", property.ComponentId.Value),
                ("propertyId", property.PropertyId),
                ("content", property.Content ? true : null)
            )),
            validationTargets = metadata.ValidationTargets.Select(static target => new
            {
                componentId = target.ComponentId.Value,
                message = new
                {
                    componentId = target.Message.ComponentId.Value,
                    propertyId = target.Message.PropertyId
                }
            }),
            // Each item written as a change carries it, so a row the page reconciles reads the same either way.
            itemValues = metadata.ItemValues.Select(static itemValues => Written(
                ("componentId", itemValues.ComponentId.Value),
                ("dynamicParameters", itemValues.DynamicParameters.Count == 0 ? null : itemValues.DynamicParameters),
                ("items", itemValues.Items)
            )),
            // The key as it came: a string, or a phrase in its own wire shape.
            words = metadata.Words.Select(static word => Written(
                ("componentId", word.ComponentId.Value),
                ("propertyId", word.PropertyId),
                ("dynamicParameters", word.DynamicParameters.Count == 0 ? null : word.DynamicParameters),
                ("key", word.Key)
            )),
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
