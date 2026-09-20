namespace NE.Standard.UI.Abstractions.Identity;

/// <summary>
/// A compiled id backed by a bare number.
/// </summary>
public interface IUIId
{
    /// <summary>
    /// Gets the number behind the id.
    /// </summary>
    int Value { get; }
}
