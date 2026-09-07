using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents a selectable option item.
/// </summary>
public interface IOptionModel : ITextModel, IBindableGroup
{
    /// <summary>
    /// Gets whether this option's key is currently among the chosen ones.
    /// </summary>
    bool? Selected { get; }
}
