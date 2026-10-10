using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
public abstract partial class FileInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IMaxFileSizeComponent
    where T : FileInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the accepted file types, expressed as a comma-separated list of extensions or MIME types.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Accept { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed file size, in bytes; the client refuses a larger file before uploading it and says so on the
    /// field's validation line.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public long? MaxFileSize { get; set; }

    /// <summary>
    /// Gets or sets the id of the uploaded selection, written by the client once the files have been sent.
    /// </summary>
    /// <remarks>Bind this to read the files via <c>IUIUploadService.GetSelectionAsync</c>; <c>Value</c> only controls what the field displays.</remarks>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? SelectionId { get; set; }

    /// <summary>
    /// Gets or sets whether multiple files can be selected at once.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Multiple { get; set; }

    /// <summary>
    /// Gets or sets the id of another component whose dropped and pasted files go into this input, by the input's own
    /// <see cref="Accept"/>, <see cref="MaxFileSize"/> and <see cref="Multiple"/>.
    /// </summary>
    /// <remarks>Render-time only: the component is looked up in the same view as the page is drawn.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public string? DropTargetId { get; set; }
}

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
public sealed class FileInputComponent(string? id = null) : FileInputComponent<FileInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.file";
}
