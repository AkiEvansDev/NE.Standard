using System;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>What differs between the hosts of one text body — see <see cref="TextContentRendererBase.RenderTextBody"/>.</summary>
public readonly record struct WebTextBodyOptions
{
    /// <summary>Whether the host is an <c>ITextComponent</c>, carrying a description, alignment, wrap mode and selectable flag.</summary>
    public bool IncludeTextLayout { get; init; }

    /// <summary>Where a badge sits when <c>BadgePlacement</c> is unset; null writes no placement class at all.</summary>
    public UITextBadgePlacement? DefaultBadgePlacement { get; init; }

    /// <summary>Drawn beside the title and before the badge: an input's required marker.</summary>
    public Action<IHtmlElementBuilder>? Trailing { get; init; }
}
