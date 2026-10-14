using NE.Standard.UI.Components.BuiltIns.Inputs;

namespace NE.Standard.UI.Web.Renderers.Inputs;

/// <summary>
/// The multi-select's field and list (<see cref="MultiSelectComponentRenderer"/>), one engine driving both, with each chip its option's
/// badge: the class below says so to the engine, which draws a chip from the badge its option's row shows.
/// </summary>
public sealed class BadgeSelectComponentRenderer : MultiSelectComponentRenderer
{
    /// <summary>The root's mark beside <c>ui-multi-select</c>, which the stylesheet and the select engine read.</summary>
    public const string BadgeSelectClassName = "ui-badge-select";

    public override string ComponentTypeKey => BadgeSelectComponent.ComponentTypeKey;

    protected override bool ChipsAreBadges => true;
}
