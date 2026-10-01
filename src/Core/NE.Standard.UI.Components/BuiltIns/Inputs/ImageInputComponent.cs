using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>A picture the viewer replaces by choosing a file, shown as an avatar, a drop area, a file-input row, or a shelf of thumbnails.</summary>
/// <remarks>
/// <c>Value</c> holds the picture's URL; the chosen file uploads at once, its handle landing in <see cref="SelectionId"/>, with a
/// local preview shown until the controller replies — under <see cref="Crop"/>, once the reader has framed it. Nothing removes the picture on its own — offer a button that clears
/// <c>Value</c>. With <see cref="Multiple"/>, or in the <see cref="UIImageInputShape.Shelf"/> shape, the control becomes a shelf of
/// pictures whose handles arrive in <see cref="SelectionIds"/>, and <c>Value</c>, <c>Caption</c> and <see cref="SelectionId"/> go unused.
/// </remarks>
public abstract partial class ImageInputComponent<T>(string? id = null) : FieldInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IMaxFileSizeComponent
    where T : ImageInputComponent<T>, IUIComponentDefinition
{
    private const string DefaultAccept = "image/*";

    /// <summary>
    /// Gets or sets which of the four shapes the control takes.
    /// </summary>
    /// <remarks>Render-time only: the shape is how the control is built.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIImageInputShape.Picture)]
    public UIImageInputShape? Shape { get; set; }

    /// <summary>
    /// Gets or sets the id of the uploaded picture, written by the client once the file has been sent.
    /// </summary>
    /// <remarks>
    /// Bind this to read the file via <c>IUIUploadService.GetSelectionAsync</c>; <c>Value</c> only says what the control shows. Set it
    /// null or empty to clear the input: the chosen picture's preview, its name and its handle go, and the control shows
    /// <c>Value</c> again — as setting <see cref="SelectionIds"/> empty clears a shelf.
    /// </remarks>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? SelectionId { get; set; }

    /// <summary>
    /// Gets or sets whether several pictures are taken at once, each shown as a square the viewer can remove.
    /// </summary>
    /// <remarks>
    /// Render-time only: a shelf is a different build from a picture. Read together with <see cref="UIImageInputShape.Picture"/>;
    /// <see cref="UIImageInputShape.Shelf"/> takes several pictures without it.
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
    /// Gets or sets the accepted file types, expressed as a comma-separated list of extensions or MIME types; pictures by default.
    /// </summary>
    /// <remarks>
    /// Empty takes any file — a shelf of attachments: a picture shows as its thumbnail, any other file as its kind's glyph
    /// (<c>UIFileGlyphs</c>) over its name.
    /// </remarks>
    [UIComponentProperty(DefaultValue = DefaultAccept)]
    public string? Accept { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed file size, in bytes; the client refuses a larger picture before uploading it and says so on
    /// the field's validation line.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public long? MaxFileSize { get; set; }

    /// <summary>
    /// Gets or sets the glyph shown while there is no picture; unset, the shape draws its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? PlaceholderIcon { get; set; }

    /// <summary>
    /// Gets or sets the id of another component whose dropped files and pasted pictures go into this input — a chat's composer —
    /// by the input's own <see cref="Accept"/>, <see cref="MaxFileSize"/> and <see cref="Multiple"/>.
    /// </summary>
    /// <remarks>Render-time only: the component is looked up in the same view as the page is drawn.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public string? DropTargetId { get; set; }

    /// <inheritdoc/>
    /// <remarks>Read by the <see cref="UIImageInputShape.Inline"/> shape, whose row has a line of text.</remarks>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public UIPhrase? Placeholder { get; set; }

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
    /// Render-time only, as the shape is. For a single picture — the picture, avatar and inline shapes; a shelf takes its pictures
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
