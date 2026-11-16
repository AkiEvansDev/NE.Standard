using System;
using System.Buffers;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
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
    private const string LoadingStyleAttribute = "data-ui-loading-style";
    private const string ScrollContentAttribute = "data-ui-scroll-content";
    private const string FullHeightSidesAttribute = "data-ui-full-height-sides";
    private const string LeftBarAttribute = "data-ui-left-bar";
    private const string DrawerBackdropClass = "ui-shell__drawer-backdrop";

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

        if (context.Theme.OverlayScrollbars)
            _ = document.Attribute(WebAttributes.OverlayScrollbars);

        if (context.Theme.LoadingStyle == UILoadingStyle.Dots)
            _ = document.Attribute(LoadingStyleAttribute, WebCssValues.LoadingStyle(UILoadingStyle.Dots));

        // On the document as on the root: the document's own gutter goes with it.
        if (context.ScrollContentOnly)
            _ = document.Attribute(ScrollContentAttribute);

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
            // Cover: without it env(safe-area-inset-*) is zero, and the shell's parts at the window's edges cannot keep clear of a
            // phone's system bars.
            _ = meta.Attribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
        });

        // The tab's name and the history entry's: without one a browser shows the address.
        if (context.Title is not null)
            _ = head.Element("title", title => title.Text(context.Title));

        // Always named: without a link a browser asks for /favicon.ico, which an application serving none answers with a 404.
        var icon = string.IsNullOrWhiteSpace(context.Icon)
            ? StandardWebAssetDescriptors.Icon.ResolveVersionedPublicPath()
            : context.Icon;

        _ = head.Element("link", link =>
        {
            _ = link.Attribute("rel", "icon");
            _ = link.Attribute("href", icon);

            if (IsSvgIcon(icon))
                _ = link.Attribute("type", "image/svg+xml");
        });

        if (context.HasManifest)
        {
            _ = head.Element("link", link =>
            {
                _ = link.Attribute("rel", "manifest");
                _ = link.Attribute("href", WebManifestEndpoint.Path);
            });
        }

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

        // An asset rather than a block: the same text for every reader, cached for good, where the document is private and revalidated.
        _ = head.Element("link", link =>
        {
            _ = link.Attribute("rel", "stylesheet");
            _ = link.Attribute("href", WebThemeStylesheet.For(context.Theme).ResolveVersionedPublicPath());
            _ = link.Attribute(WebAttributes.ThemeStylesheet);
        });

        // The reader's own, right after the application's and apart from it, so it wins with the same selectors. Colours and numbers
        // alone, so nothing in it needs escaping.
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

        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.Css))
        {
            _ = head.Element("link", link =>
            {
                _ = link.Attribute("rel", "stylesheet");
                _ = link.Attribute("href", ResolvePublicPath(asset));
            });
        }

        // Ahead of the boot script, which writes every moment by it as the parser hands the body over.
        if (!string.IsNullOrEmpty(context.TemporalJson))
        {
            _ = head.Element("script", script =>
            {
                _ = script.Attribute("type", "application/json");
                _ = script.Attribute(WebAttributes.Temporal);
                _ = script.Raw(context.TemporalJson);
            });
        }

        // Classic, blocking, and in the head: the boot script must run before the body paints; a module would arrive too late.
        foreach (WebAssetDescriptor asset in EnumerateAssets(context, UIWebAssetKind.HeadScript))
            _ = head.Element("script", script => script.Attribute("src", ResolvePublicPath(asset)));
    }

    private static bool IsSvgIcon(string href)
        => href.StartsWith(StandardWebAssetDescriptors.Icon.PublicPath!, StringComparison.Ordinal)
        || href.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)
        || href.Contains(".svg?", StringComparison.OrdinalIgnoreCase)
        || href.StartsWith("data:image/svg+xml", StringComparison.OrdinalIgnoreCase);

    /// <summary>The assets of one kind, in the order the context holds them: the registry's, sorted once (<see cref="WebShellContext.Assets"/>).</summary>
    private static IEnumerable<WebAssetDescriptor> EnumerateAssets(WebShellContext context, UIWebAssetKind kind)
    {
        foreach (WebAssetDescriptor asset in context.Assets)
        {
            if (asset.Kind == kind)
                yield return asset;
        }
    }

    // Geist is only the default theme's face: a theme naming another never draws with it, and a preload would fetch it for nothing.
    private static bool IsDrawnWith(WebAssetDescriptor font, UITheme theme)
        => !string.Equals(font.Key, StandardWebAssetDescriptors.Font.Key, StringComparison.Ordinal)
        || NamesFamily(theme.Typography.FontFamily, "Geist");

    // An entry of the family list, not a substring: "Geist Mono" is another face. A theme's family holds no quotes to strip.
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
                _ = root.Attribute(WebAttributes.Navigation, JsonSerializer.Serialize(new { route = standIn.Route, parameters = standIn.Parameters }, WebWireJson.Options));

            if (context.ScrollContentOnly)
                _ = root.Attribute(ScrollContentAttribute);

            if (context.ShellLayout == UIShellLayout.FullHeightSides)
                _ = root.Attribute(FullHeightSidesAttribute);

            // The width below which the sides are drawers, which the stylesheet's bands and the drawers' engine read off the root.
            if (SideDrawersValue(context.SideDrawers) is string drawers)
            {
                _ = root.Attribute(WebAttributes.SideDrawers, drawers);

                if (ModelessDrawers(context) is string modeless)
                    _ = root.Attribute(WebAttributes.DrawerModeless, modeless);
            }

            // The view's facts the stylesheet reads off the root: the bottom bar never moves after the first paint; the content-fills
            // mark follows the content root's Height on the page (content-fills.ts).
            if (context.BottomBar)
                _ = root.Attribute(LeftBarAttribute);

            if (context.ContentFills)
                _ = root.Attribute(WebAttributes.ContentFills);

            if (context.Content is not null)
                _ = root.Content(context.Content);

            // What an open drawer dims the page under, and a press on it closes the drawer; the stylesheet shows it only then.
            if (context.SideDrawers != UISideDrawers.Never)
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

    /// <summary>The root's word for the width below which the sides are drawers; none where they never are.</summary>
    private static string? SideDrawersValue(UISideDrawers drawers)
        => drawers switch
        {
            UISideDrawers.BelowMd => "md",
            UISideDrawers.BelowXl => "xl",
            UISideDrawers.BelowXxl => "xxl",
            UISideDrawers.Always => "always",
            _ => null
        };

    /// <summary>The sides whose open drawer leaves the page as it is: no veil, and a press beside it reaches the page.</summary>
    private static string? ModelessDrawers(WebShellContext context)
        => (context.LeftDrawerModal, context.RightDrawerModal) switch
        {
            (false, false) => $"{RegionNames.LeftSide} {RegionNames.RightSide}",
            (false, true) => RegionNames.LeftSide,
            (true, false) => RegionNames.RightSide,
            _ => null
        };

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
        IHtmlContent json;

        if (!context.MetadataJson.IsEmpty)
            json = new Utf8HtmlContent(context.MetadataJson);
        else if (context.Metadata is not null)
            json = new Utf8HtmlContent(SerializeMetadataToUtf8(context.Metadata));
        else
            return;

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute(WebAttributes.Metadata);
            _ = script.Content(json);
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

        return JsonSerializer.Serialize(strings, WebWireJson.Options);
    }

    /// <summary>
    /// Before the scripts, so the runtime finds it as soon as it starts — and after the content, so what it
    /// patches is already in the document.
    /// </summary>
    private static void RenderHydration(IHtmlElementBuilder body, WebShellContext context)
    {
        IHtmlContent json;

        if (!context.HydrationJsonUtf8.IsEmpty)
            json = new Utf8HtmlContent(context.HydrationJsonUtf8);
        else if (!string.IsNullOrWhiteSpace(context.HydrationJson))
            json = new RawHtmlContent(context.HydrationJson);
        else
            return;

        _ = body.Element("script", script =>
        {
            _ = script.Attribute("type", "application/json");
            _ = script.Attribute(WebAttributes.Hydration);
            _ = script.Content(json);
        });
    }

    /// <summary>Serializes render metadata as a JSON string.</summary>
    public static string SerializeMetadata(WebRenderMetadata metadata)
        => Encoding.UTF8.GetString(SerializeMetadataToUtf8(metadata));

    /// <summary>Serializes render metadata directly to UTF-8 JSON bytes without intermediate object graphs or strings.</summary>
    public static byte[] SerializeMetadataToUtf8(WebRenderMetadata metadata)
    {
        ArgumentNullException.ThrowIfNull(metadata);

        metadata.Validate();

        ArrayBufferWriter<byte> buffer = new(4096);

        using (Utf8JsonWriter writer = new(buffer))
            WriteMetadata(writer, metadata);

        return buffer.WrittenSpan.ToArray();
    }

    private static void WriteMetadata(Utf8JsonWriter writer, WebRenderMetadata metadata)
    {
        writer.WriteStartObject();

        WritePropertyDefinitions(writer, metadata.PropertyDefinitions);
        WriteBindings(writer, metadata.Bindings);
        WriteItemsTemplates(writer, metadata.ItemsTemplates);
        WriteEvents(writer, metadata.Events);
        WriteInteractions(writer, metadata.Interactions);
        WriteValidations(writer, metadata.Validations);
        WriteExposedProperties(writer, metadata.ExposedProperties);
        WriteValidationTargets(writer, metadata.ValidationTargets);
        WriteItemValues(writer, metadata.ItemValues);
        WriteWords(writer, metadata.Words);
        WriteCompileWarnings(writer, metadata.CompileWarnings);
        WriteItemsFilterSort(writer, metadata.ItemsFilterSort);

        writer.WriteEndObject();
    }

    private static void WritePropertyDefinitions(Utf8JsonWriter writer, IReadOnlyList<WebRenderPropertyDefinitionMetadata> definitions)
    {
        writer.WriteStartArray("propertyDefinitions");

        for (var i = 0; i < definitions.Count; i++)
        {
            WebRenderPropertyDefinitionMetadata property = definitions[i];

            writer.WriteStartObject();
            writer.WriteString("propertyId", property.PropertyId);
            writer.WriteString("componentTypeKey", property.ComponentTypeKey);
            writer.WriteString("propertyName", property.PropertyName);
            WriteOperations(writer, property.Operations);

            if (property.Translatable)
                writer.WriteBoolean("translatable", true);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteOperations(Utf8JsonWriter writer, IReadOnlyList<WebDomOperation> operations)
    {
        writer.WriteStartArray("operations");

        for (var i = 0; i < operations.Count; i++)
        {
            WebDomOperation operation = operations[i];

            writer.WriteStartObject();
            writer.WriteString("kind", operation.Kind);
            WriteOptionalString(writer, "target", operation.Target);
            WriteOptionalString(writer, "name", operation.Name);
            WriteOptionalString(writer, "converter", operation.Converter);

            if (operation.Condition is { } condition)
                writer.WriteString("condition", condition.ToString());

            WriteOptionalString(writer, "value", operation.Value);

            if (operation.Optional)
                writer.WriteBoolean("optional", true);

            if (operation.ConvertsNull)
                writer.WriteBoolean("convertsNull", true);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteOptionalString(Utf8JsonWriter writer, string propertyName, string? value)
    {
        if (value is not null)
            writer.WriteString(propertyName, value);
    }

    private static void WriteBindings(Utf8JsonWriter writer, IReadOnlyList<WebRenderBindingMetadata> bindings)
    {
        // No `kind`: nothing on the client reads it. `mode` only when it is not the default.
        writer.WriteStartArray("bindings");

        for (var i = 0; i < bindings.Count; i++)
        {
            WebRenderBindingMetadata binding = bindings[i];

            writer.WriteStartObject();
            writer.WriteNumber("bindingId", binding.BindingId.Value);
            writer.WriteNumber("componentId", binding.ComponentId.Value);
            writer.WriteString("propertyId", binding.PropertyId);

            if (binding.Mode != UIBindingMode.OneWay)
                writer.WriteString("mode", binding.Mode.ToString());

            if (binding.DynamicParameterComponentIds.Count > 0)
            {
                writer.WritePropertyName("dynamicParameterComponentIds");
                WriteComponentIds(writer, binding.DynamicParameterComponentIds);
            }

            WriteOptionalString(writer, "itemTemplate", binding.ItemTemplate);

            if (binding.ItemTemplateParameters is { } parameters)
            {
                writer.WriteStartArray("itemTemplateParameters");

                for (var j = 0; j < parameters.Count; j++)
                {
                    WebRenderBindingParameterMetadata parameter = parameters[j];

                    writer.WriteStartObject();
                    writer.WriteString("kind", parameter.Kind.ToString());

                    if (parameter.ComponentId is { } componentId)
                        writer.WriteNumber("componentId", componentId.Value);

                    if (parameter.Value is not null)
                    {
                        writer.WritePropertyName("value");
                        WriteWireValue(writer, parameter.Value);
                    }

                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
            }

            if (binding.Optional)
                writer.WriteBoolean("optional", true);

            if (binding.FallbackValue is not null)
            {
                writer.WritePropertyName("fallbackValue");
                WriteWireValue(writer, binding.FallbackValue);
            }

            if (binding.Content)
                writer.WriteBoolean("content", true);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteComponentIds(Utf8JsonWriter writer, IReadOnlyList<UIComponentId> ids)
    {
        writer.WriteStartArray();

        for (var i = 0; i < ids.Count; i++)
            writer.WriteNumberValue(ids[i].Value);

        writer.WriteEndArray();
    }

    private static void WriteWireValue(Utf8JsonWriter writer, object? value)
    {
        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        JsonSerializer.Serialize(writer, value, value.GetType(), WebWireJson.Options);
    }

    private static void WriteItemsTemplates(Utf8JsonWriter writer, IReadOnlyList<WebRenderItemsTemplateMetadata> templates)
    {
        writer.WriteStartArray("items");

        for (var i = 0; i < templates.Count; i++)
        {
            WebRenderItemsTemplateMetadata itemsTemplate = templates[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", itemsTemplate.ComponentId.Value);
            WriteOptionalString(writer, "templateKeyPropertyName", itemsTemplate.TemplateKeyPropertyName);
            WriteOptionalString(writer, "fallbackTemplateKey", itemsTemplate.FallbackTemplateKey);
            WriteOptionalString(writer, "itemWrapperElementName", itemsTemplate.ItemWrapperElementName);
            WriteOptionalString(writer, "itemWrapperClassName", itemsTemplate.ItemWrapperClassName);
            WriteOptionalString(writer, "itemWrapperRole", itemsTemplate.ItemWrapperRole);

            if (itemsTemplate.AnnouncesSelection)
                writer.WriteBoolean("announcesSelection", true);

            WriteOptionalString(writer, "rowDecorator", itemsTemplate.RowDecorator);

            if (itemsTemplate.ItemPaths is { } itemPaths)
            {
                writer.WriteStartArray("itemPaths");

                for (var j = 0; j < itemPaths.Count; j++)
                    writer.WriteStringValue(itemPaths[j]);

                writer.WriteEndArray();
            }

            if (itemsTemplate.Composite is { } composite)
            {
                writer.WriteStartObject("composite");
                WriteOptionalString(writer, "itemElementName", composite.ItemElementName);
                WriteOptionalString(writer, "itemClassName", composite.ItemClassName);
                WriteOptionalString(writer, "itemRole", composite.ItemRole);
                WriteOptionalString(writer, "hostSlotVariantKey", composite.HostSlotVariantKey);
                writer.WriteStartArray("slots");

                for (var j = 0; j < composite.Slots.Count; j++)
                {
                    WebRenderItemsCompositeSlotMetadata slot = composite.Slots[j];

                    writer.WriteStartObject();
                    WriteOptionalString(writer, "variantKey", slot.VariantKey);
                    WriteOptionalString(writer, "wrapperElementName", slot.WrapperElementName);
                    WriteOptionalString(writer, "wrapperClassName", slot.WrapperClassName);
                    WriteOptionalString(writer, "wrapperRole", slot.WrapperRole);
                    WriteOptionalString(writer, "variantKeyPropertyName", slot.VariantKeyPropertyName);

                    if (slot.WrapperAttributes is { } attributes)
                    {
                        writer.WriteStartObject("wrapperAttributes");

                        foreach (KeyValuePair<string, string> pair in attributes)
                            writer.WriteString(pair.Key, pair.Value);

                        writer.WriteEndObject();
                    }

                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
                writer.WriteEndObject();
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteEvents(Utf8JsonWriter writer, IReadOnlyList<WebRenderEventMetadata> events)
    {
        // `showsPending` only when a command turned the mark off.
        writer.WriteStartArray("events");

        for (var i = 0; i < events.Count; i++)
        {
            WebRenderEventMetadata compiledEvent = events[i];

            writer.WriteStartObject();
            writer.WriteNumber("eventId", compiledEvent.EventId.Value);
            writer.WriteNumber("componentId", compiledEvent.Address.ComponentId.Value);
            writer.WriteString("eventName", compiledEvent.Address.EventName);
            writer.WritePropertyName("dynamicParameterComponentIds");
            WriteComponentIds(writer, compiledEvent.DynamicParameterComponentIds);

            if (!compiledEvent.ShowsPending)
                writer.WriteBoolean("showsPending", false);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteInteractions(Utf8JsonWriter writer, IReadOnlyList<WebRenderInteractionMetadata> interactions)
    {
        writer.WriteStartArray("interactions");

        for (var i = 0; i < interactions.Count; i++)
        {
            WebRenderInteractionMetadata interaction = interactions[i];

            writer.WriteStartObject();
            writer.WriteString("sourceKind", interaction.SourceKind.ToString());
            writer.WritePropertyName("source");
            WritePropertyReferenceOrNull(writer, interaction.Source);

            // A row's own interaction names its row with the event, and only then: every other event interaction stays its size.
            if (interaction.SourceEvent is { } sourceEvent)
            {
                writer.WriteStartObject("sourceEvent");
                writer.WriteNumber("componentId", sourceEvent.ComponentId.Value);
                writer.WriteString("eventName", sourceEvent.EventName);

                if (interaction.RowKey is not null)
                {
                    writer.WritePropertyName("rowKey");
                    WriteWireValue(writer, interaction.RowKey);
                }

                writer.WriteEndObject();
            }
            else
            {
                writer.WriteNull("sourceEvent");
            }

            writer.WritePropertyName("target");
            WritePropertyReferenceOrNull(writer, interaction.Target);
            writer.WriteString("actionKind", interaction.ActionKind.ToString());
            writer.WritePropertyName("effect");
            WriteWireValue(writer, interaction.Effect);
            writer.WriteString("operator", interaction.Operator.ToString());
            writer.WritePropertyName("value");
            WriteWireValue(writer, interaction.Value);
            writer.WritePropertyName("trueValue");
            WriteWireValue(writer, interaction.TrueValue);
            writer.WritePropertyName("falseValue");
            WriteWireValue(writer, interaction.FalseValue);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WritePropertyReferenceOrNull(Utf8JsonWriter writer, WebRenderPropertyMetadata? reference)
    {
        if (reference is null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartObject();
        writer.WriteNumber("componentId", reference.ComponentId.Value);
        writer.WriteString("propertyId", reference.PropertyId);
        writer.WritePropertyName("dynamicParameterComponentIds");
        WriteComponentIds(writer, reference.DynamicParameterComponentIds);
        writer.WriteEndObject();
    }

    private static void WriteValidations(Utf8JsonWriter writer, IReadOnlyList<WebRenderValidationMetadata> validations)
    {
        writer.WriteStartArray("validations");

        for (var i = 0; i < validations.Count; i++)
        {
            WebRenderValidationMetadata validation = validations[i];

            writer.WriteStartObject();
            writer.WriteStartObject("target");
            writer.WriteNumber("componentId", validation.Target.ComponentId.Value);
            writer.WriteString("propertyId", validation.Target.PropertyId);
            writer.WriteEndObject();
            writer.WriteString("trigger", validation.Trigger.ToString());
            writer.WriteString("operator", validation.Operator.ToString());
            writer.WritePropertyName("value");
            WriteWireValue(writer, validation.Value);

            if (validation.ValueSource is { } source)
            {
                writer.WriteStartObject("valueSource");
                writer.WriteNumber("componentId", source.Value);
                writer.WriteEndObject();
            }
            else
            {
                writer.WriteNull("valueSource");
            }

            writer.WriteString("severity", validation.Severity.ToString());
            writer.WritePropertyName("message");
            WriteWireValue(writer, validation.Message);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteExposedProperties(Utf8JsonWriter writer, IReadOnlyList<WebRenderPropertyMetadata> exposed)
    {
        writer.WriteStartArray("exposedProperties");

        for (var i = 0; i < exposed.Count; i++)
        {
            WebRenderPropertyMetadata property = exposed[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", property.ComponentId.Value);
            writer.WriteString("propertyId", property.PropertyId);

            if (property.Content)
                writer.WriteBoolean("content", true);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteValidationTargets(Utf8JsonWriter writer, IReadOnlyList<WebRenderValidationTargetMetadata> targets)
    {
        writer.WriteStartArray("validationTargets");

        for (var i = 0; i < targets.Count; i++)
        {
            WebRenderValidationTargetMetadata target = targets[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", target.ComponentId.Value);
            writer.WriteStartObject("message");
            writer.WriteNumber("componentId", target.Message.ComponentId.Value);
            writer.WriteString("propertyId", target.Message.PropertyId);
            writer.WriteEndObject();
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteItemValues(Utf8JsonWriter writer, IReadOnlyList<WebRenderItemValuesMetadata> itemValues)
    {
        // Each item written as a change carries it, so a row the page reconciles reads the same either way.
        writer.WriteStartArray("itemValues");

        for (var i = 0; i < itemValues.Count; i++)
        {
            WebRenderItemValuesMetadata entry = itemValues[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", entry.ComponentId.Value);

            if (entry.DynamicParameters.Count > 0)
            {
                writer.WritePropertyName("dynamicParameters");
                WriteWireValue(writer, entry.DynamicParameters);
            }

            writer.WritePropertyName("items");
            WriteWireValue(writer, entry.Items);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteWords(Utf8JsonWriter writer, IReadOnlyList<WebRenderWordMetadata> words)
    {
        // The key as it came: a string, or a phrase in its own wire shape.
        writer.WriteStartArray("words");

        for (var i = 0; i < words.Count; i++)
        {
            WebRenderWordMetadata word = words[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", word.ComponentId.Value);
            writer.WriteString("propertyId", word.PropertyId);

            if (word.DynamicParameters.Count > 0)
            {
                writer.WritePropertyName("dynamicParameters");
                WriteWireValue(writer, word.DynamicParameters);
            }

            writer.WritePropertyName("key");
            WriteWireValue(writer, word.Key);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteCompileWarnings(Utf8JsonWriter writer, IReadOnlyList<string> warnings)
    {
        if (warnings.Count == 0)
        {
            writer.WriteNull("compileWarnings");
            return;
        }

        writer.WriteStartArray("compileWarnings");

        for (var i = 0; i < warnings.Count; i++)
            writer.WriteStringValue(warnings[i]);

        writer.WriteEndArray();
    }

    private static void WriteItemsFilterSort(Utf8JsonWriter writer, IReadOnlyList<WebRenderItemsFilterSortMetadata> list)
    {
        writer.WriteStartArray("itemsFilterSort");

        for (var i = 0; i < list.Count; i++)
        {
            WebRenderItemsFilterSortMetadata itemsFilterSort = list[i];

            writer.WriteStartObject();
            writer.WriteNumber("componentId", itemsFilterSort.ComponentId.Value);
            writer.WriteStartArray("filters");

            for (var j = 0; j < itemsFilterSort.Filters.Count; j++)
            {
                WebRenderItemsFilterMetadata filter = itemsFilterSort.Filters[j];

                writer.WriteStartObject();
                writer.WriteString("itemProperty", filter.ItemProperty);
                writer.WriteString("operator", filter.Operator.ToString());
                writer.WritePropertyName("value");
                WriteWireValue(writer, filter.Value);
                writer.WritePropertyName("source");
                WriteSimplePropertyReferenceOrNull(writer, filter.Source);
                writer.WriteString("activeOperator", filter.ActiveOperator.ToString());
                writer.WritePropertyName("activeValue");
                WriteWireValue(writer, filter.ActiveValue);
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
            writer.WriteStartArray("sorts");

            for (var j = 0; j < itemsFilterSort.Sorts.Count; j++)
            {
                WebRenderItemsSortMetadata sort = itemsFilterSort.Sorts[j];

                writer.WriteStartObject();
                writer.WriteString("itemProperty", sort.ItemProperty);
                writer.WriteString("direction", sort.Direction.ToString());
                writer.WriteNumber("priority", sort.Priority);
                writer.WritePropertyName("source");
                WriteSimplePropertyReferenceOrNull(writer, sort.Source);
                writer.WriteString("activeOperator", sort.ActiveOperator.ToString());
                writer.WritePropertyName("activeValue");
                WriteWireValue(writer, sort.ActiveValue);
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteSimplePropertyReferenceOrNull(Utf8JsonWriter writer, WebRenderPropertyMetadata? reference)
    {
        if (reference is null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartObject();
        writer.WriteNumber("componentId", reference.ComponentId.Value);
        writer.WriteString("propertyId", reference.PropertyId);
        writer.WriteEndObject();
    }
}
