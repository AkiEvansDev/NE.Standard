using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents a selectable option item.
/// </summary>
public interface IOptionModel : ITextModel, IBindableGroup
{
    /// <summary>
    /// Gets whether the option is selected.
    /// </summary>
    bool? Selected { get; }
}
