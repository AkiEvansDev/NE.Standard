using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
public abstract partial class FileInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id), IPlaceholderInputComponent
    where T : FileInputComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the accepted file types, expressed as a comma-separated list of extensions or MIME types.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Accept { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed file size, in bytes.
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
    /// Sets the maximum allowed file size, in bytes.
    /// </summary>
    public T SetMaxFileSize(long maxFileSize)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxFileSize);
        MaxFileSize = maxFileSize;
        return Self;
    }
}

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
public sealed class FileInputComponent(string? id = null) : FileInputComponent<FileInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.file";
}
