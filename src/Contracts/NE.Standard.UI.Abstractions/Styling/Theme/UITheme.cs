using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines theme tokens used by the UI runtime.
/// </summary>
public sealed record UITheme
{
    // Required rather than defaulted: light and dark differ by definition, so start from UIThemeDefaults and adjust with `with`.
    /// <summary>
    /// The color palette used in light mode.
    /// </summary>
    public required UIColorPalette Light { get; init; }

    /// <summary>
    /// The color palette used in dark mode.
    /// </summary>
    public required UIColorPalette Dark { get; init; }

    /// <summary>
    /// The typography tokens used by text components.
    /// </summary>
    public UITypography Typography { get; init; } = new();

    /// <summary>
    /// The shape tokens used by UI components.
    /// </summary>
    public UIThemeShape Shape { get; init; } = new();

    /// <summary>
    /// Whether a keyboard focus ring is drawn on everything that takes focus; off by default since it can land oddly over
    /// controls with their own "current" state.
    /// </summary>
    public bool FocusRing { get; init; }

    /// <summary>Whether a press on a button, action row or menu entry answers with a wash spreading from the pointer; off by default.</summary>
    /// <remarks>Ignored by platforms that can't animate and by reduced-motion viewers.</remarks>
    public bool PressRipple { get; init; }

    /// <summary>
    /// Whether, where a pointer hovers, a scroller shows a thin thumb over its edge only while the reader scrolls it or the pointer nears
    /// that edge, a scroller's padding on that side at least its room; on by default. Off, every scroller wears the platform's thin
    /// bar in the room it keeps.
    /// </summary>
    public bool OverlayScrollbars { get; init; } = true;

    /// <summary>The colour of a focused or open field's edge, outlined, filled or underlined alike; neutral by default.</summary>
    public UIMarkTone FieldFocus { get; init; } = UIMarkTone.Neutral;

    /// <summary>
    /// The colour of the line that says chosen — a tab's, a menu's or a list's current entry, a chosen node — and of the line or
    /// edge that says where a dragged thing would land; the brand's by default.
    /// </summary>
    public UIMarkTone SelectionMark { get; init; }

    /// <summary>
    /// The default indicator shown by spinners and loading components across the application; the turning ring by default.
    /// </summary>
    public UILoadingStyle LoadingStyle { get; init; }

    /// <summary>
    /// Validates all theme token groups.
    /// </summary>
    public void Validate()
    {
        Light.Validate();
        Dark.Validate();
        Typography.Validate();
        Shape.Validate();
    }
}
