using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// Preset extensions for configuring the expanded modal presentation of an <see cref="IExpandableInputComponent"/>.
/// </summary>
public static class FieldExpandExtensions
{
    private const int DialogHorizontalChrome = 32;

    /// <summary>
    /// Sizes the expanded dialog to <paramref name="width"/> from the breakpoint that fits it (<c>Md</c>, or <c>Xl</c> for
    /// <see cref="UIColumnWidth.Wide"/>) and fills the screen below that tier, matching <see cref="UIDialogs"/>.
    /// </summary>
    public static TBuilder SetWidth<TBuilder>(this TBuilder builder, UIColumnWidth width)
        where TBuilder : IUIExpandedFieldBuilder<TBuilder>
    {
        ArgumentNullException.ThrowIfNull(builder);

        UILayoutLength surface = UILayoutLength.Absolute(UIPage.Pixels(width) + DialogHorizontalChrome);
        UIResponsive<UILayoutLength> responsive = width == UIColumnWidth.Wide
            ? UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), xl: surface)
            : UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: surface);

        return builder.SetWidth(responsive);
    }
}
