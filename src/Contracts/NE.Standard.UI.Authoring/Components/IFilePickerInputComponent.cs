using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

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
    /// Gets the registered property key for <see cref="SelectionIds"/>.
    /// </summary>
    static UIProperty SelectionIdsProperty { get; } = new(nameof(SelectionIds));

    /// <summary>
    /// Gets the registered property key for <see cref="PlaceholderIcon"/>.
    /// </summary>
    static UIProperty PlaceholderIconProperty { get; } = new(nameof(PlaceholderIcon));

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
    /// Gets the ids of the uploaded files on a shelf (<c>UIFileInputVariant.Tiles</c>, <c>UIFileInputVariant.Shelf</c>, or an image
    /// input with <c>Multiple</c>), one per file in the order chosen. Written by the client as files land and leave; set it empty to
    /// clear the shelf.
    /// </summary>
    [UIComponentProperty(
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    IReadOnlyList<string>? SelectionIds { get; }

    /// <summary>
    /// Gets the glyph shown while there is no picture or on a tile shelf's add button; unset, the variant draws its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    string? PlaceholderIcon { get; }

    /// <summary>
    /// Gets the id of another component whose dropped and pasted files go into this input — a chat's composer — by the input's own
    /// <see cref="IFileAcceptComponent.Accept"/>, <see cref="IMaxFileSizeComponent.MaxFileSize"/> and <c>Multiple</c>.
    /// </summary>
    /// <remarks>Render-time only: the component is looked up in the same view as the page is drawn.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    string? DropTargetId { get; }
}
