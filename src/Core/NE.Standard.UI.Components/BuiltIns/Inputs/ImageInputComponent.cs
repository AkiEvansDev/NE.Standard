using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A picture the viewer replaces by choosing a file: an avatar, a large picture over a drop area, or a row like the
/// file input's. <c>Value</c> is the picture shown — a URL the controller owns; the chosen file is uploaded at once
/// and its handle written to <see cref="SelectionId"/>, the way a file input's is, while the file itself is shown as
/// a local preview until the controller answers with a picture of its own.
/// </summary>
/// <remarks>
/// Nothing on the control removes the one picture: a controller that offers that puts a button beside it and clears <c>Value</c>.
/// With <see cref="Multiple"/> the control is a shelf of the pictures chosen, each with a cross that takes it away, and their
/// handles arrive in <see cref="SelectionIds"/>; <c>Value</c>, <c>Caption</c> and <see cref="SelectionId"/> stay unused then.
/// </remarks>
public abstract partial class ImageInputComponent<T>(string? id = null) : TextInputComponentBase<T, string?>(id), IPlaceholderInputComponent
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
    /// Gets or sets whether several pictures are taken at once, each shown as a square the viewer can take away again.
    /// </summary>
    /// <remarks>Render-time only: a shelf is a different build from a picture. Read with the <see cref="UIImageInputShape.Picture"/> shape.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    public bool? Multiple { get; set; }

    /// <summary>
    /// Gets or sets the ids of the uploaded pictures under <see cref="Multiple"/>, one selection per picture, in the order chosen;
    /// written by the client as pictures land and leave. Set it empty to clear the shelf.
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
    /// Gets or sets what the inline row says about the picture the controller gave — its name, as the controller knows it.
    /// Unset, the row reads the file name off the picture's address, and nothing when the address carries none.
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
