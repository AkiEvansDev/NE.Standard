using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A multi-select whose options are badges — a ticket's labels, a contact's tags — chosen into the field as the badges themselves.
/// </summary>
/// <remarks>
/// An option is its badge: its <c>BadgeText</c> the words, its style, colour, fill and icon the look, a <c>Description</c> under it what
/// it means — the shape <see cref="Models.BadgeItem"/> gives a row of badges to read. The list draws each badge at the start of its row,
/// and the field each chosen one with its remove inside it; in the field, an option with no badge words stands as a badge of its title.
/// Leave <c>Title</c> unset where the badge is the option's name: a title stands before the badge on its row, so the same words would
/// read twice. It is for an option whose badge is not its name — a priority's <c>P1</c> badge before "Critical".
/// </remarks>
public sealed class BadgeSelectComponent : MultiSelectComponent<BadgeSelectComponent>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the input with the badge row template: the badge inline on the row's first line, after a title only where the option
    /// has one, the description under it.
    /// </summary>
    public BadgeSelectComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultTextTemplate(binds: true)
            .SetIconAlignment(UITextIconAlignment.Content)
            .SetBadgePlacement(UITextBadgePlacement.Inline)
        );
    }

    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.badge-select";
}
