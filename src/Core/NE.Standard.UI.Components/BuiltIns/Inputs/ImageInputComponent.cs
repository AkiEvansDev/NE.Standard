using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>A picture the viewer replaces by choosing a file, shown as an avatar, a drop area, or a file-input row.</summary>
/// <remarks>
/// <c>Value</c> holds the picture's URL; the chosen file uploads at once, its handle landing in <c>SelectionId</c>, with a
/// local preview shown until the controller replies — under <see cref="Crop"/>, once the reader has framed it. Nothing removes the picture on its own — offer a button that clears
/// <c>Value</c>. With <see cref="Multiple"/>, the control becomes a shelf of pictures whose handles arrive in <c>SelectionIds</c>, and
/// <c>Value</c>, <c>Caption</c> and <c>SelectionId</c> go unused; for a shelf of arbitrary files, use <see cref="FileInputComponent{T}"/>
/// with <see cref="UIFileInputVariant.Tiles"/> or <see cref="UIFileInputVariant.Shelf"/>.
/// <c>SelectionId</c> set null or empty clears a single picture: its preview, name and handle go, and the control shows
/// <c>Value</c> again — as setting <c>SelectionIds</c> empty clears a shelf.
/// Only the <see cref="UIImageInputVariant.Inline"/> variant, whose row has a line of text, reads <c>Placeholder</c>.
/// </remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IFieldInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IFilePickerInputComponent))]
[UIComponentPropertyDefault(nameof(IFileAcceptComponent.Accept), nameof(DefaultAccept))]
public abstract partial class ImageInputComponent<T>(string? id = null) : InputComponentBase<T, string?>(id), IBorderedComponent, IFieldInputComponent, IPlaceholderInputComponent, IFilePickerInputComponent
    where T : ImageInputComponent<T>, IUIComponentDefinition
{
    // Pictures unless the author widens it.
    private const string DefaultAccept = "image/*";

    /// <summary>
    /// Gets or sets which of the three looks the control is drawn as.
    /// </summary>
    /// <remarks>Render-time only: the variant is how the control is built.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIImageInputVariant.Picture)]
    public UIImageInputVariant? Variant { get; set; }

    /// <summary>
    /// Gets or sets whether several pictures are taken at once, each shown as a square the viewer can remove.
    /// </summary>
    /// <remarks>
    /// Render-time only, unlike a file input's row: a shelf is a different build from a picture. Read together with <see cref="UIImageInputVariant.Picture"/>.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? Multiple { get; set; }

    /// <summary>
    /// Gets or sets how the picture fills its box.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIImageFit.Cover)]
    public UIImageFit? Fit { get; set; }

    /// <summary>Gets or sets what the inline row says about the picture — its name, as the controller knows it.</summary>
    /// <remarks>Unset, it falls back to the file name from the picture's address, or nothing if the address carries none.</remarks>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Caption { get; set; }

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

    /// <summary>
    /// Only the inline row takes its caption inside, as its renderer draws it; a picture, an avatar and a shelf keep it on top whatever
    /// <c>TitlePlacement</c> asks.
    /// </summary>
    public override UISize? CaptionRowBox(UIResponsiveTier tier)
        => InputCaptionRow.Box(this, tier, honoursInside: Variant == UIImageInputVariant.Inline);
}

/// <summary>
/// A picture the viewer replaces by choosing a file.
/// </summary>
public sealed class ImageInputComponent(string? id = null) : ImageInputComponent<ImageInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.image";
}
