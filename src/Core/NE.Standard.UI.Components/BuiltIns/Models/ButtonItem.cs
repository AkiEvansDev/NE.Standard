using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model describing a button item's text and style for use in lists/collections bound to <see cref="IButtonModel"/>.
/// </summary>
public partial class ButtonItem : TextItem, IButtonModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial UIButtonType? Type { get; set; } = UIButtonType.Primary;

    // TextBaseItem's IconColor/TitleColor defaults (Primary/OnBackground) target a standalone item sitting
    // on the page background. Inside a button they would fight the button's own fill, so both are reset to
    // Default here — which resolves to `color: inherit` and lets the glyph and title follow the button.

    /// <summary>
    /// Initializes a new button item with icon/title colors that inherit the button's own contrast color.
    /// </summary>
    public ButtonItem()
    {
        IconColor = UIThemeColor.Default;
        TitleColor = UIThemeColor.Default;
    }
}
