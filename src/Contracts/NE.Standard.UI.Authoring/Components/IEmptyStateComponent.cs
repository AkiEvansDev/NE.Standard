using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A collection host that draws its empty template while it holds nothing (an items view, a table, a tree); off, an empty host draws
/// no empty state at all, as a short list under a row should not say "nothing" under every row.
/// </summary>
public interface IEmptyStateComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ShowEmptyTemplate"/>.
    /// </summary>
    static UIProperty ShowEmptyTemplateProperty { get; } = new(nameof(ShowEmptyTemplate));

    /// <summary>
    /// Gets whether the empty template is drawn while the host holds nothing; on by default.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? ShowEmptyTemplate { get; }
}
