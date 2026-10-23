using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IFilePickerInputComponent))]
public abstract partial class FileInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IFilePickerInputComponent
    where T : FileInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether multiple files can be selected at once.
    /// </summary>
    /// <remarks>
    /// Bindable, unlike an image input's: here it is the native picker's own flag, there it decides whether the control is built as a
    /// shelf.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Multiple { get; set; }
}

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
public sealed class FileInputComponent(string? id = null) : FileInputComponent<FileInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.file";
}
