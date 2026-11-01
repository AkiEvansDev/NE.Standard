using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Indicators;

public sealed class SpinnerComponentRenderer : WebComponentRendererBase
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string TitleAttribute = "data-ui-spinner-title";

    private static readonly WebDomOperation[] TitleOperations =
    [
        WebDomOperation.Text(),
        WebDomOperation.ToggleAttribute(TitleAttribute, target: "root", condition: WebValueCondition.HasText),
        new WebDomOperation
        {
            Kind = DefaultWordsOperationKind,
            Name = "aria-label",
            Target = $":scope[{TextContentRendererBase.LabelledAttribute}]",
            Condition = WebValueCondition.IsFalse,
            Value = UIStrings.SpinnerLoading,
            Optional = true
        }
    ];

    public override string ComponentTypeKey => SpinnerComponent.ComponentTypeKey;

    // The ring takes a glyph's size classes, one per breakpoint.
    private static readonly TierClassFamily<UISize> SizeFamily = new(WebAttributes.TierSize, WebDomConverters.IconSizeClass, WebDomConverters.IconSizeTierClasses, WebClassNames.IconSize);

    protected override string ClassName => "ui-spinner";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // A status: the words beside the ring are read out when the spinner appears or they change. With no words of its own it is
        // called what it shows; its AccessibleName outranks both.
        _ = root.Attribute("role", "status");

        if (!HasWords(context, IAccessibleNameComponent.AccessibleNameProperty))
        {
            _ = root.Attribute(TextContentRendererBase.LabelledAttribute);
            _ = ResolveRenderValue(context, SpinnerComponent.TitleProperty, out string? initialTitle, out _);

            if (string.IsNullOrWhiteSpace(initialTitle))
                WebWords.Write(context, root, "aria-label", UIStrings.SpinnerLoading);
        }

        RenderAccessibleName(context, root);

        _ = root.Element("span", ring =>
        {
            _ = ring.Class("ui-spinner__ring");

            TierClassRenderer.Render(context, ring, SpinnerComponent.SizeProperty, SizeFamily);
            ThemeColorRenderer.RenderThemeColor(context, ring, SpinnerComponent.ColorProperty);
        });

        _ = root.Element("span", title =>
        {
            _ = title.Class("ui-spinner__title");

            _ = RenderProperty<string?>(context, title, SpinnerComponent.TitleProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = root.Attribute(TitleAttribute);
                    _ = target.Text(value);
                }
            }, TitleOperations);
        });
    }
}
