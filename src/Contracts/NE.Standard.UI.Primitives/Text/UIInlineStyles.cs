using System;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// The character styles a run of inline markup can carry, combined.
/// </summary>
[Flags]
public enum UIInlineStyles
{
    /// <summary>Plain text.</summary>
    None = 0,

    /// <summary><c>**bold**</c>.</summary>
    Bold = 1,

    /// <summary><c>*italic*</c>.</summary>
    Italic = 2,

    /// <summary><c>__underline__</c>.</summary>
    Underline = 4,

    /// <summary><c>~~struck through~~</c>.</summary>
    Strikethrough = 8,

    /// <summary><c>`code`</c> — the one run whose content is literal, never markup.</summary>
    Code = 16
}
