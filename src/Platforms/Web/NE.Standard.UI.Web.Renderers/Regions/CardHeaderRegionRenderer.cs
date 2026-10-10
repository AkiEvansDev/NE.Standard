using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Regions;

public sealed class CardHeaderRegionRenderer : TextRegionRendererBase
{
    /// <summary>
    /// The operation that keeps the card's header band in step with whether its text shows anything (<c>card-header.ts</c>): with
    /// nothing to show, and no control beside it, the band is gone.
    /// </summary>
    public const string ShownOperationKind = "card-header-shown";

    private static readonly WebDomOperation ShownOperation = WebDomOperation.Custom(ShownOperationKind);

    public override string ComponentTypeKey => CardHeaderRegion.ComponentTypeKey;

    protected override string ClassName => "ui-card__header-text";

    protected override WebDomOperation? PartsShownOperation => ShownOperation;
}
