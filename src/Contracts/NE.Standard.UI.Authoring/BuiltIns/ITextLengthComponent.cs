using System;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A text component that limits how many characters the viewer may type.
/// </summary>
public interface ITextLengthComponent
{
    /// <summary>
    /// Gets or sets the maximum number of characters allowed.
    /// </summary>
    int? MaxLength { get; set; }
}

/// <summary>
/// The validated setter <see cref="ITextLengthComponent"/> components share.
/// </summary>
public static class TextLengthComponentExtensions
{
    /// <summary>
    /// Sets the maximum number of characters allowed.
    /// </summary>
    public static T SetMaxLength<T>(this T component, int maxLength) where T : ITextLengthComponent
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxLength);

        component.MaxLength = maxLength;
        return component;
    }
}
