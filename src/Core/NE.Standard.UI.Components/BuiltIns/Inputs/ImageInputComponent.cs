using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>A picture the viewer replaces by choosing a file, shown as an avatar, a drop area, a file-input row, or a shelf of thumbnails.</summary>
/// <remarks>
/// <c>Value</c> holds the picture's URL; the chosen file uploads at once, its handle landing in <see cref="SelectionId"/>, with a
/// local preview shown until the controller replies — under <see cref="Crop"/>, once the reader has framed it. Nothing removes the picture on its own — offer a button that clears
/// <c>Value</c>. With <see cref="Multiple"/>, or as the <see cref="UIImageInputVariant.Shelf"/> variant, the control becomes a shelf of
/// pictures whose handles arrive in <see cref="SelectionIds"/>, and <c>Value</c>, <c>Caption</c> and <see cref="SelectionId"/> go unused.
/// <see cref="SelectionId"/> set null or empty clears a single picture: its preview, name and handle go, and the control shows
/// <c>Value</c> again — as setting <see cref="SelectionIds"/> empty clears a shelf.
/// Only the <see cref="UIImageInputVariant.Inline"/> variant, whose row has a line of text, reads <c>Placeholder</c>.
/// </remarks>
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IFilePickerInputComponent))]
[UIComponentPropertyDefault(nameof(IFileAcceptComponent.Accept), nameof(DefaultAccept))]
public abstract partial class ImageInputComponent<T>(string? id = null) : FieldInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IFilePickerInputComponent
    where T : ImageInputComponent<T>, IUIComponentDefinition
{
    // Pictures unless the author widens it: empty takes any file — a shelf of attachments, a picture shown as its thumbnail and any
    // other file as its kind's glyph (UIFileGlyphs) over its name and size.
    private const string DefaultAccept = "image/*";

    /// <summary>
    /// Gets or sets which of the four looks the control is drawn as.
    /// </summary>
    /// <remarks>Render-time only: the variant is how the control is built.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIImageInputVariant.Picture)]
    public UIImageInputVariant? Variant { get; set; }

    /// <summary>
    /// Gets or sets whether several pictures are taken at once, each shown as a square the viewer can remove.
    /// </summary>
    /// <remarks>
    /// Render-time only, unlike a file input's: a shelf is a different build from a picture. Read together with <see cref="UIImageInputVariant.Picture"/>;
    /// <see cref="UIImageInputVariant.Shelf"/> takes several pictures without it.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? Multiple { get; set; }

    /// <summary>
    /// Gets or sets the ids of the uploaded pictures under <see cref="Multiple"/>, one per picture in the order chosen.
    /// Written by the client as pictures land and leave; set it empty to clear the shelf.
    /// </summary>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    public IReadOnlyList<string>? SelectionIds { get; set; }

    /// <summary>
    /// Gets or sets the glyph shown while there is no picture; unset, the variant draws its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? PlaceholderIcon { get; set; }

    /// <summary>
    /// Gets or sets how the picture fills its box.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIImageFit.Cover)]
    public UIImageFit? Fit { get; set; }

    /// <summary>Gets or sets what the inline row says about the picture — its name, as the controller knows it.</summary>
    /// <remarks>Unset, it falls back to the file name from the picture's address, or nothing if the address carries none.</remarks>
    [UIComponentProperty(DefaultValue = null)]
    public string? Caption { get; set; }

    /// <summary>
    /// Gets or sets the frame a chosen picture is fitted to before it uploads: the reader moves and zooms it under a square or a
    /// circle, and the square the frame holds is what is sent.
    /// </summary>
    /// <remarks>
    /// Render-time only, as the variant is. For a single picture — the picture, avatar and inline variants; a shelf takes its pictures
    /// as they are, and a crop on one fails the render. The crop runs in the browser, so <see cref="MaxFileSize"/> weighs the
    /// cropped picture, and Cancel leaves the input as it was.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIImageCrop.None)]
    public UIImageCrop? Crop { get; set; }

    /// <summary>
    /// Gets or sets the side, in pixels, the cropped picture is written at; unset, 1024. A frame holding fewer of the picture's own
    /// pixels writes those, never scaled up.
    /// </summary>
    /// <remarks>Render-time only, as <see cref="Crop"/> is.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null, GenerateSetter = false)]
    public int? CropSize { get; set; }

    /// <summary>
    /// Sets the side, in pixels, the cropped picture is written at.
    /// </summary>
    public T SetCropSize(int cropSize)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(cropSize);

        CropSize = cropSize;
        return Self;
    }
}

/// <summary>
/// A picture the viewer replaces by choosing a file.
/// </summary>
public sealed class ImageInputComponent(string? id = null) : ImageInputComponent<ImageInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.image";
}
