using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component whose title an inline rename writes back: a standalone text's, a tree node's, a tab's.
/// </summary>
public interface IRenamableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="RenamedTitle"/>.
    /// </summary>
    static UIProperty RenamedTitleProperty { get; } = new(nameof(RenamedTitle));

    /// <summary>
    /// Gets the title as a rename wrote it back; the component's own text draws the title.
    /// </summary>
    /// <remarks>The server refuses its write where the component's <c>Renamable</c> or its row's <c>CanRename</c> is false.</remarks>
    [UIComponentProperty(BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultBindingScope = UIBindingScope.Relative, DefaultValue = null)]
    string? RenamedTitle { get; }
}
