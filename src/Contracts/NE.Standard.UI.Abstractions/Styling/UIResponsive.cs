using System.Diagnostics.CodeAnalysis;
using System.Globalization;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a value that can vary per breakpoint: a required <see cref="Base"/> plus optional wider-breakpoint overrides.
/// </summary>
/// <remarks>
/// Mobile-first cascade: an unset breakpoint falls back to the next narrower one that is set, down to <see cref="Base"/>.
/// </remarks>
/// <param name="Base">The value every breakpoint falls back to.</param>
/// <param name="Sm">The value from the small breakpoint up.</param>
/// <param name="Md">The value from the medium breakpoint up.</param>
/// <param name="Xl">The value from the extra-large breakpoint up.</param>
/// <param name="Xxl">The value from the widest breakpoint up.</param>
[SuppressMessage("Design", "CA1000:Do not declare static members on generic types", Justification = "Create/FromValue are the value type's own construction API (same role as UIGridPlacement.At/UIThemeColor.Create), not something meant to be discovered without already knowing the element type at the call site.")]
public readonly record struct UIResponsive<T>(T Base, T? Sm, T? Md, T? Xl, T? Xxl)
    where T : struct
{
    /// <summary>
    /// Creates a uniform responsive value with no breakpoint overrides; reachable implicitly from a plain <typeparamref name="T"/>.
    /// </summary>
    public static UIResponsive<T> FromValue(T value)
        => new(value, null, null, null, null);

    /// <summary>
    /// Creates a uniform responsive value with no breakpoint overrides — see <see cref="FromValue"/>.
    /// </summary>
    [SuppressMessage("Usage", "CA2225:Operator overloads have named alternates", Justification = "FromValue is the named alternate; the analyzer's exact-name convention (FromT) reads worse for a generic type parameter than the descriptive name actually used here.")]
    public static implicit operator UIResponsive<T>(T value)
        => FromValue(value);

    /// <summary>
    /// Creates a responsive value with an explicit base value and optional per-breakpoint overrides.
    /// </summary>
    public static UIResponsive<T> Create(T value, T? sm = null, T? md = null, T? xl = null, T? xxl = null)
        => new(value, sm, md, xl, xxl);

    public override string ToString()
    {
        var result = string.Create(CultureInfo.InvariantCulture, $"{Base}");

        if (Sm is T sm)
            result += string.Create(CultureInfo.InvariantCulture, $" sm:{sm}");

        if (Md is T md)
            result += string.Create(CultureInfo.InvariantCulture, $" md:{md}");

        if (Xl is T xl)
            result += string.Create(CultureInfo.InvariantCulture, $" xl:{xl}");

        if (Xxl is T xxl)
            result += string.Create(CultureInfo.InvariantCulture, $" xxl:{xxl}");

        return result;
    }
}
