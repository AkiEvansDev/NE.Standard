using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A picture the viewer replaces by choosing a file, shown as an avatar, a drop area, or a file-input row. <c>Value</c>
/// holds the picture's URL; the chosen file uploads at once, its handle landing in <see cref="SelectionId"/>, with a local
/// preview shown until the controller replies.
/// </summary>
/// <remarks>
/// Nothing removes the picture on its own — offer a button that clears <c>Value</c>. With <see cref="Multiple"/> the control
/// becomes a shelf of pictures whose handles arrive in <see cref="SelectionIds"/>, and <c>Value</c>, <c>Caption</c> and
/// <see cref="SelectionId"/> go unused.
/// </remarks>
public abstract partial class ImageInputComponent<T>(string? id = null) : FieldInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IMaxFileSizeComponent
    where T : ImageInputComponent<T>, IUIComponentDefinition
{
    private const string DefaultAccept = "image/*";

    /// <summary>
    /// Gets or sets which of the three shapes the control takes.
    /// </summary>
    /// <remarks>Render-time only: the shape is how the control is built.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UIImageInputShape.Picture)]
    public UIImageInputShape? Shape { get; set; }

    /// <summary>
    /// Gets or sets the id of the uploaded picture, written by the client once the file has been sent.
    /// </summary>
    /// <remarks>Bind this to read the file via <c>IUIUploadService.GetSelectionAsync</c>; <c>Value</c> only says what the control shows.</remarks>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? SelectionId { get; set; }

    /// <summary>
    /// Gets or sets whether several pictures are taken at once, each shown as a square the viewer can remove.
    /// </summary>
    /// <remarks>Render-time only: a shelf is a different build from a picture. Read together with <see cref="UIImageInputShape.Picture"/>.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = false)]
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
    [UIComponentProperty(DefaultValue = DefaultAccept)]
    public string? Accept { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed file size, in bytes; the client refuses a larger picture before uploading it.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public long? MaxFileSize { get; set; }

    /// <summary>
    /// Gets or sets the glyph shown while there is no picture; unset, the shape draws its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? PlaceholderIcon { get; set; }

    /// <inheritdoc/>
    /// <remarks>Read by the <see cref="UIImageInputShape.Inline"/> shape, whose row has a line of text.</remarks>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets how the picture fills its box.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIImageFit.Cover)]
    public UIImageFit? Fit { get; set; }

    /// <summary>
    /// Gets or sets what the inline row says about the picture — its name, as the controller knows it. Unset, it falls back
    /// to the file name from the picture's address, or nothing if the address carries none.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Caption { get; set; }
}

/// <summary>
/// A picture the viewer replaces by choosing a file.
/// </summary>
public sealed class ImageInputComponent(string? id = null) : ImageInputComponent<ImageInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.image";
}
