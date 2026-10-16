using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template drawing an <see cref="IFileModel"/> as a file's tile: its name, size, type, glyph and whether it is still
/// being written, each bound to the item.
/// </summary>
/// <remarks>A press is the page's to add: <c>SetClickable(true)</c> and <c>OnClick</c> with the item's id as an argument.</remarks>
public abstract class DefaultFileTemplate<TTemplate> : FileTileComponent<TTemplate>
    where TTemplate : DefaultFileTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new file template bound to the item it draws.
    /// </summary>
    protected DefaultFileTemplate()
    {
        _ = Bind(FileNameProperty, nameof(IFileModel.FileName), UIBindingScope.Relative);
        _ = Bind(FileSizeProperty, nameof(IFileModel.FileSize), UIBindingScope.Relative, optional: true);
        _ = Bind(ContentTypeProperty, nameof(IFileModel.ContentType), UIBindingScope.Relative, optional: true);
        _ = Bind(IconProperty, nameof(IFileModel.Icon), UIBindingScope.Relative, optional: true);
        _ = Bind(IVisualComponent.LoadingProperty, nameof(IFileModel.Loading), UIBindingScope.Relative, optional: true);
    }
}

/// <summary>
/// The built-in template drawing an <see cref="IFileModel"/> as a file's tile.
/// </summary>
public sealed class DefaultFileTemplate : DefaultFileTemplate<DefaultFileTemplate>, IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.file.template";
}
