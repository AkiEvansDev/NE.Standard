using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// What the framework takes as a row's key and as a path's parameter — the one statement of both rules.
/// </summary>
public static class UIRowKeys
{
    /// <summary>
    /// Whether a value can address a row: an <see cref="int"/>, a string, or null.
    /// </summary>
    public static bool IsKey(object? value)
        => value is null or int or string;

    /// <summary>
    /// Whether a value can stand for a path's index or key: an <see cref="int"/> or a string.
    /// </summary>
    public static bool IsPathParameter([NotNullWhen(true)] object? value)
        => value is int or string;
}
