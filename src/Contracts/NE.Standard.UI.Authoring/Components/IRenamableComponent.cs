using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The root of an item's row whose title a rename writes back: a tree node's, a tab's.
/// </summary>
public interface IRenamableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="RenamedTitle"/>.
    /// </summary>
    static UIProperty RenamedTitleProperty { get; } = new(nameof(RenamedTitle));

    /// <summary>
    /// Gets the title as a rename wrote it back; the row's own text draws the title.
    /// </summary>
    /// <remarks>The server refuses its write where the row's <c>CanRename</c> is false.</remarks>
    [UIComponentProperty(BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultBindingScope = UIBindingScope.Relative, DefaultValue = null)]
    string? RenamedTitle { get; }
}
