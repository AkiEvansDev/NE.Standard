using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a component that decides where the two marks at the ends of its text body sit — the leading
/// icon and the trailing badge.
/// </summary>
public interface ITextMarkAlignmentComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="IconAlignment"/>.
    /// </summary>
    static UIProperty IconAlignmentProperty { get; } = new UIProperty(nameof(IconAlignment));

    /// <summary>
    /// Gets the registered property key for <see cref="BadgeAlignment"/>.
    /// </summary>
    static UIProperty BadgeAlignmentProperty { get; } = new UIProperty(nameof(BadgeAlignment));

    /// <summary>
    /// Gets where the leading icon sits against the text beside it: <c>Content</c> (the default) centres it
    /// across title and description, while <c>Title</c> keeps it on the title's own line.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UITextIconAlignment.Content)]
    UITextIconAlignment? IconAlignment { get; }

    /// <summary>
    /// Gets where a trailing badge sits against the text beside it: <c>Title</c> (the default) keeps it at
    /// the far end of the title's own line, while <c>Content</c> centres it against title and description.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UITextBadgeAlignment.Title)]
    UITextBadgeAlignment? BadgeAlignment { get; }
}
