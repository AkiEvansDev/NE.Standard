using System;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>What differs between the hosts of one text body — see <see cref="TextContentRendererBase.RenderTextBody"/>.</summary>
public readonly record struct WebTextBodyOptions
{
    /// <summary>Whether the host is an <c>ITextComponent</c>, carrying a description, alignment and wrap mode.</summary>
    public bool IncludeTextLayout { get; init; }

    /// <summary>Where a badge sits when <c>BadgePlacement</c> is unset; null writes no placement class at all.</summary>
    public UITextBadgePlacement? DefaultBadgePlacement { get; init; }

    /// <summary>Drawn beside the title and before the badge: an input's required marker.</summary>
    public Action<IHtmlElementBuilder>? Trailing { get; init; }

    /// <summary>
    /// Whether the title is a field's caption, which a live title change also writes into the field's accessible name; its badge's
    /// tooltip then carries what a <see cref="ReachableBadge"/> takes, one list for every caption of the type.
    /// </summary>
    public bool NamesField { get; init; }

    /// <summary>
    /// Whether a badge with a tooltip is a tab stop of its own, named by the words and showing them on a press and on focus — in a field's
    /// caption that stands outside any control (above the field, a checkbox's label), never inside a button or a field's box, where a
    /// nested tab stop is invalid. Only with <see cref="NamesField"/>. A help badge (<c>SetHelp</c>'s) there shows its words on a press
    /// but is no stop: they describe the field instead.
    /// </summary>
    public bool ReachableBadge { get; init; }

    /// <summary>
    /// Whether the host may be named by its tooltip while it shows no title — a button: a title that arrives takes that name off,
    /// since the words it shows name the host then (<see cref="TextContentRendererBase.TooltipNamedAttribute"/>).
    /// </summary>
    public bool TooltipNamesHost { get; init; }

    /// <summary>
    /// Whether the root wears the text's alignment as a button's (<c>ui-button--align-*</c>), placing its label box by it — with
    /// <see cref="IncludeTextLayout"/>.
    /// </summary>
    public bool AlignsRoot { get; init; }

    /// <summary>
    /// One more operation after each part's own (the icon, the title, the description, the badge's icon and text): what the text showing
    /// anything decides around it — a card's header band, gone with nothing to show. Null for none.
    /// </summary>
    public WebDomOperation? PartsShownOperation { get; init; }
}
