namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>When a toggled attribute or class applies, judged on the property's value.</summary>
public enum WebValueCondition
{
    /// <summary>Always.</summary>
    None = 0,

    /// <summary>The value is not null.</summary>
    HasValue = 1,

    /// <summary>The value reads as text that is not blank.</summary>
    HasText = 2,

    /// <summary>The value is <see langword="true"/>.</summary>
    IsTrue = 3,

    /// <summary>The value is <see langword="false"/>.</summary>
    IsFalse = 4,

    /// <summary>
    /// The value names an icon — a glyph name with a letter or digit, or a picture the page may load
    /// (<see cref="Theming.WebIconValue.Names"/>); a name from data with neither (an emoji, a stray symbol) does not.
    /// </summary>
    DrawsIcon = 5
}
