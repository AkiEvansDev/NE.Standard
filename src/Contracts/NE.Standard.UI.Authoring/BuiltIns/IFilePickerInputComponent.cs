using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input that uploads the files the viewer picks as they are picked, and hands the controller the upload's handle.
/// </summary>
public interface IFilePickerInputComponent : IInputComponent, IFileAcceptComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="SelectionId"/>.
    /// </summary>
    static UIProperty SelectionIdProperty { get; } = new(nameof(SelectionId));

    /// <summary>
    /// Gets the registered property key for <see cref="DropTargetId"/>.
    /// </summary>
    static UIProperty DropTargetIdProperty { get; } = new(nameof(DropTargetId));

    /// <summary>
    /// Gets the id of the uploaded selection, written by the client once the files have been sent.
    /// </summary>
    /// <remarks>Bind this to read the files via <c>IUIUploadService.GetSelectionAsync</c>; <c>Value</c> only says what the control shows.</remarks>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    string? SelectionId { get; }

    /// <summary>
    /// Gets the id of another component whose dropped and pasted files go into this input — a chat's composer — by the input's own
    /// <see cref="IFileAcceptComponent.Accept"/>, <see cref="IMaxFileSizeComponent.MaxFileSize"/> and <c>Multiple</c>.
    /// </summary>
    /// <remarks>Render-time only: the component is looked up in the same view as the page is drawn.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    string? DropTargetId { get; }
}
