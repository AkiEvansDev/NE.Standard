using System;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// One value a field may hold: the raw wire value (an enum member's name, <c>true</c>/<c>false</c>) and the caption
/// the page shows for it.
/// </summary>
public sealed record UIChoice
{
    public UIChoice(string value, string caption)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        ArgumentNullException.ThrowIfNull(caption);

        Value = value;
        Caption = caption;
    }

    public string Value { get; }

    public string Caption { get; }
}
