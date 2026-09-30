using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>A picture over a hidden native picker; under <c>Multiple</c>, or in the <c>Shelf</c> shape, the surface is a shelf of pictures instead.</summary>
/// <remarks><c>Value</c> paints the picture and the upload rides back on its own hidden input, as <c>SelectionId</c> or, under <c>Multiple</c>, <c>SelectionIds</c> as a JSON list.</remarks>
public sealed class ImageInputComponentRenderer : TextContentRendererBase
{
    private const string MultipleClassName = "ui-image-input--multiple";
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string PlaceholderAttribute = "data-ui-image-placeholder";

    // The pick stays focusable while read-only, as a read-only field does, but says it does nothing; every shape's pick is the one
    // [data-ui-file-pick], and the thumbnails-only shelf has none.
    private static readonly WebDomOperation[] ReadOnlyOperations =
    [
        NativeInputRendererBase.ReadOnlyMarkOperation,
        WebDomOperation.ToggleAttribute("aria-disabled", target: $"[{WebAttributes.FilePick}]", condition: WebValueCondition.IsTrue, value: "true", optional: true)
    ];

    public override string ComponentTypeKey => ImageInputComponent.ComponentTypeKey;

    protected override string ClassName => "ui-image-input";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        // Render-time only: the shape, and whether it is a shelf, are how the control is built.
        _ = ResolveRenderValue(context, ImageInputComponent.ShapeProperty, out UIImageInputShape? shape, out _);
        _ = ResolveRenderValue(context, ImageInputComponent.MultipleProperty, out bool? multiple, out _);
        _ = root.Class(WebClassNames.ImageInputShape(shape ?? UIImageInputShape.Picture));

        RenderInputAppearance(context, root);

        // Only the inline row is a single-line field; Picture and Avatar keep the caption on top since it would crowd a drop
        // area or circle with no room for it.
        RenderInputHeader(context, root, titleCanGoInside: shape == UIImageInputShape.Inline);

        NativeInputRendererBase.RenderMaxFileSize(context, root, ImageInputComponent.MaxFileSizeProperty);
        NativeInputRendererBase.RenderDropTargetId(context, root, ImageInputComponent.DropTargetIdProperty);

        // The thumbnails-only shelf is a shelf whatever Multiple says: a row of one picture is not what it is for.
        if (multiple == true || shape == UIImageInputShape.Shelf)
        {
            _ = root.Class(MultipleClassName);
            IHtmlElementBuilder? add = RenderShelf(context, root, withPick: shape != UIImageInputShape.Shelf);
            RenderNative(context, root, add, multiple: true);
            RenderSelections(context, root);
        }
        else
        {
            (IHtmlElementBuilder surface, IHtmlElementBuilder picture) = RenderSurface(context, root, shape ?? UIImageInputShape.Picture);
            RenderNative(context, root, surface, multiple: false);
            RenderValues(context, root, picture);
        }

        RenderValidationMessage(context, root);
    }

    /// <summary>The button the viewer presses or drops on: the picture, the glyph shown without one, the text of the inline row, the pencil.</summary>
    private (IHtmlElementBuilder Surface, IHtmlElementBuilder Picture) RenderSurface(WebRenderContext context, IHtmlElementBuilder root, UIImageInputShape shape)
    {
        IHtmlElementBuilder? surfaceElement = null;
        IHtmlElementBuilder? pictureElement = null;

        _ = root.Element("button", surface =>
        {
            surfaceElement = surface;
            _ = surface.Class($"{ClassName}__surface");
            _ = surface.Attribute("type", "button");
            _ = surface.Attribute(WebAttributes.FilePick);

            BorderStyleRenderer.RenderBorderStyle(context, surface);

            // The row's own caption, as FileInput's row carries its; Picture and Avatar never reach here since RenderInputHeader
            // above kept their caption on the root.
            if (shape == UIImageInputShape.Inline)
                RenderInputHeaderInside(context, root, surface);

            _ = ResolveRenderValue(context, IInputComponent.ValueProperty, out string? value, out _);
            WebWords.Write(context, surface, "aria-label", string.IsNullOrEmpty(value) ? UIStrings.ImageChoose : UIStrings.ImageChange);

            _ = surface.Element("img", picture =>
            {
                pictureElement = picture;
                _ = picture.Class($"{ClassName}__picture");
                _ = picture.Attribute("alt", string.Empty);

                _ = RenderProperty<UIImageFit?>(context, picture, ImageInputComponent.FitProperty, static (target, fit) =>
                {
                    if (fit is UIImageFit resolved)
                        _ = target.Class(WebClassNames.ImageFit(resolved));
                }, [WebDomOperation.Class(target: $".{ClassName}__picture", converter: WebDomConverters.ImageFitClass)]);
            });

            RenderPlaceholderGlyph(context, root, surface);

            // On the root, where the engine watches attributes: the caption outranks the name read off the address.
            _ = RenderProperty<string?>(context, root, ImageInputComponent.CaptionProperty, static (target, caption) =>
            {
                if (!string.IsNullOrEmpty(caption))
                    _ = target.Attribute(WebAttributes.ImageCaption, caption);
            }, [WebDomOperation.Attribute(WebAttributes.ImageCaption)]);

            RenderPlaceholderText(context, surface);

            _ = surface.Element("span", edit =>
            {
                _ = edit.Class($"{ClassName}__edit");
                _ = edit.Attribute("aria-hidden", "true");
            });

            _ = surface.Element("span", pick => pick.Class($"{ClassName}__pick"));
        });

        // The tree is written out only once the whole component is built, so the value writes onto these after their callbacks returned.
        return (surfaceElement!, pictureElement!);
    }

    /// <summary>
    /// The shelf the viewer drops on: the squares the engine keeps and, <paramref name="withPick"/>, the square that opens the picker
    /// and the words while it is empty — the thumbnails-only shelf draws neither, its chooser opened from elsewhere.
    /// </summary>
    private IHtmlElementBuilder? RenderShelf(WebRenderContext context, IHtmlElementBuilder root, bool withPick)
    {
        IHtmlElementBuilder? addElement = null;

        _ = root.Element("div", surface =>
        {
            _ = surface.Class($"{ClassName}__surface");

            BorderStyleRenderer.RenderBorderStyle(context, surface);

            _ = surface.Element("span", tiles => tiles.Class($"{ClassName}__tiles"));

            if (!withPick)
                return;

            _ = surface.Element("button", add =>
            {
                addElement = add;
                _ = add.Class($"{ClassName}__add");
                _ = add.Attribute("type", "button");
                _ = add.Attribute(WebAttributes.FilePick);
                WebWords.Write(context, add, "aria-label", UIStrings.ImageChoose);

                RenderPlaceholderGlyph(context, root, add);
            });

            RenderPlaceholderText(context, surface);
        });

        return addElement;
    }

    /// <summary>The stand-in glyph: the shape's own drawn one until an icon is named; the attribute on the root is what the stylesheet reads.</summary>
    private void RenderPlaceholderGlyph(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder parent)
    {
        _ = parent.Element("span", placeholder =>
        {
            _ = placeholder.Class($"{ClassName}__placeholder");
            _ = placeholder.Class("ui-icon");

            _ = RenderProperty<string?>(context, placeholder, ImageInputComponent.PlaceholderIconProperty, (target, icon) =>
            {
                if (!IconValueRenderer.Draws(icon))
                    return;

                _ = root.Attribute(WebAttributes.Icon);
                IconValueRenderer.RenderIconValue(target, icon);
            }, [
                .. IconValueRenderer.Operations,
                WebDomOperation.ToggleAttribute(WebAttributes.Icon, target: "root", condition: WebValueCondition.DrawsIcon)
            ]);
        });
    }

    /// <summary>The line of text the inline row and the empty shelf read; the placeholder rides on it as an attribute.</summary>
    private void RenderPlaceholderText(WebRenderContext context, IHtmlElementBuilder parent)
    {
        _ = parent.Element("span", text =>
        {
            _ = text.Class($"{ClassName}__text");

            _ = RenderProperty<string?>(context, text, IPlaceholderInputComponent.PlaceholderProperty, static (target, placeholder) =>
            {
                if (!string.IsNullOrEmpty(placeholder))
                    _ = target.Attribute(PlaceholderAttribute, placeholder);
            }, [WebDomOperation.Attribute(PlaceholderAttribute)]);
        });
    }

    /// <summary>The native picker, present but hidden: only a real file input opens the OS dialog.</summary>
    private void RenderNative(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder? pick, bool multiple)
    {
        NativeInputRendererBase.RenderFilePicker(context, root, $"{ClassName}__native", ImageInputComponent.AcceptProperty, native =>
        {
            if (multiple)
                _ = native.Attribute("multiple");
        });

        // Read-only is the root's mark: the engine refuses press and drop, the stylesheet cues the pointer; the pick stays focusable,
        // like a read-only field, and says it does nothing.
        _ = RenderProperty<bool?>(context, root, IInputComponent.IsReadOnlyProperty, (target, value) =>
        {
            if (value != true)
                return;

            _ = target.Class(WebClassNames.ReadOnly);
            _ = pick?.Attribute("aria-disabled", "true");
        }, ReadOnlyOperations);
    }

    /// <summary>The picture's URL and the upload's handle, each on a hidden input the value engine writes and reads.</summary>
    private void RenderValues(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder picture)
    {
        NativeInputRendererBase.RenderHiddenValueInput(context, root, $"{ClassName}__value", valueInput =>
        {
            // One registration, two targets: the hidden input holds the URL, the picture shows it.
            _ = RenderProperty<string?>(context, valueInput, IInputComponent.ValueProperty, (target, value) =>
            {
                if (!WebUrlSafety.IsSafeImageSource(value))
                    return;

                _ = target.Attribute("value", value);
                _ = root.Attribute(WebAttributes.ImageSource, value);

                // The picture itself too, or the placeholder glyph stands in for it until the engine copies the source over.
                _ = picture.Attribute("src", value);
            }, [
                WebDomOperation.Property("value", converter: WebDomConverters.SafeImageSource),
                WebDomOperation.Attribute(WebAttributes.ImageSource, target: "root", converter: WebDomConverters.SafeImageSource)
            ]);
        });

        // The picture's URL above is the component's value; the handle is a second one beside it.
        NativeInputRendererBase.RenderSelectionInput(context, root, $"{ClassName}__selection", ImageInputComponent.SelectionIdProperty, holdsValue: false);
    }

    /// <summary>
    /// The shelf's handles: a JSON list of selected keys, on a hidden input the value engine reads and on the root, where it
    /// removes squares when the controller drops their handles.
    /// </summary>
    private void RenderSelections(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = ResolveRenderValue(context, ImageInputComponent.SelectionIdsProperty, out IReadOnlyList<string>? _, out CompiledUIBinding? binding);

        _ = root.Element("input", selections =>
        {
            _ = selections.Class($"{ClassName}__selections");
            _ = selections.Attribute("type", "hidden");
            _ = selections.Attribute(WebAttributes.ValueKind, WebValueKinds.SelectedKeys);
            NativeInputRendererBase.RenderFieldName(context, selections, "selections");

            _ = RenderProperty<IReadOnlyList<string>?>(context, selections, ImageInputComponent.SelectionIdsProperty, (target, value) =>
            {
                var json = JsonSerializer.Serialize(value ?? []);

                _ = target.Attribute(WebAttributes.SelectedKeys, json);
                _ = root.Attribute(WebAttributes.SelectedKeys, json);
            }, [
                WebDomOperation.Attribute(WebAttributes.SelectedKeys),
                WebDomOperation.Attribute(WebAttributes.SelectedKeys, target: "root")
            ]);

            if (binding is not null)
                _ = selections.Attribute(WebAttributes.BindValue, binding.Id.Value.ToString(CultureInfo.InvariantCulture));
        });
    }
}
