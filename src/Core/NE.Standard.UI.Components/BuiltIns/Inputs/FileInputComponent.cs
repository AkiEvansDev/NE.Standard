using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A file input that lets the user select one or more files to upload, drawn as a single-line row, a drop area of tiles, or a tiles-only shelf.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IFieldInputComponent))]
[UIComponentPropertyBlock(typeof(IAffixedInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IFilePickerInputComponent))]
public abstract partial class FileInputComponent<T>(string? id = null) : InputComponentBase<T, string?>(id), IBorderedComponent, IFieldInputComponent, IAffixedInputComponent, IPlaceholderInputComponent, IFilePickerInputComponent
    where T : FileInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets which of the three looks the control is drawn as: a single-line row, a drop area of square tiles, or a tiles-only shelf.
    /// </summary>
    /// <remarks>Render-time only: the variant is how the control is built.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIFileInputVariant.Row)]
    public UIFileInputVariant? Variant { get; set; }

    /// <summary>
    /// Gets or sets whether multiple files can be selected at once on the <see cref="UIFileInputVariant.Row"/> variant.
    /// </summary>
    /// <remarks>
    /// Bindable on the row variant, where it is the native picker's own flag; <see cref="UIFileInputVariant.Tiles"/> and
    /// <see cref="UIFileInputVariant.Shelf"/> always take several files.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Multiple { get; set; }

    /// <summary>
    /// Only the single-line row takes its caption inside, as its renderer draws it; tiles and a shelf keep it on top whatever
    /// <c>TitlePlacement</c> asks.
    /// </summary>
    public override UISize? CaptionRowBox(UIResponsiveTier tier)
        => InputCaptionRow.Box(this, tier, honoursInside: (Variant ?? UIFileInputVariant.Row) == UIFileInputVariant.Row);
}

/// <summary>
/// A file input that lets the user select one or more files to upload.
/// </summary>
public sealed class FileInputComponent(string? id = null) : FileInputComponent<FileInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.file";
}
