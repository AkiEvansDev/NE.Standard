namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines shape tokens used by UI components.
/// </summary>
public sealed record UIShape
{
    /// <summary>
    /// The corner radius applied to cards.
    /// </summary>
    public UICornerRadius CardRadius { get; init; } = UICornerRadius.Uniform(8d);

    /// <summary>
    /// The corner radius applied to buttons.
    /// </summary>
    public UICornerRadius ButtonRadius { get; init; } = UICornerRadius.Uniform(6d);

    /// <summary>
    /// The corner radius applied to inputs.
    /// </summary>
    public UICornerRadius InputRadius { get; init; } = UICornerRadius.Uniform(6d);

    /// <summary>
    /// The corner radius applied to row-shaped controls — a key/value list, an action row.
    /// </summary>
    public UICornerRadius RowRadius { get; init; } = UICornerRadius.Uniform(0d);

    /// <summary>
    /// Gets the corner radius of a notification; square by default, like a row.
    /// </summary>
    public UICornerRadius NotificationRadius { get; init; } = UICornerRadius.Uniform(0d);

    /// <summary>
    /// Validates that all shape values are non-negative.
    /// </summary>
    public void Validate()
    {
        CardRadius.Validate();
        ButtonRadius.Validate();
        InputRadius.Validate();
        RowRadius.Validate();
        NotificationRadius.Validate();
    }
}
