using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Layouts;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>
/// Renders a key-value row's template the way a container renders, plus the editing flag the row's stylesheet reads. It
/// runs inside the list's <c>&lt;template&gt;</c>, where the flag leaves the binding the client's rows copy; a row the
/// server stamps gets the flag from the list renderer through <see cref="RenderEditing"/>.
/// </summary>
public sealed class DefaultRowTemplateRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => DefaultRowTemplate.ComponentTypeKey;

    protected override string ClassName => "ui-container";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);
        ContainerComponentRenderer.RenderTracks(context, root, ContainerComponent.ColumnsProperty, ContainerComponentRenderer.ColumnsVariable, WebAttributes.ColumnLimits);
        ContainerComponentRenderer.RenderTracks(context, root, ContainerComponent.RowsProperty, ContainerComponentRenderer.RowsVariable, WebAttributes.RowLimits);
        RenderEditing(context, root);
        ItemAbilitiesRenderer.RenderItemAbilities(context, root);
        RenderChildren(context, root);
    }

    /// <summary>The one flag that turns a row into its own editor.</summary>
    internal static void RenderEditing(WebRenderContext context, IHtmlElementBuilder root)
        => _ = RenderProperty<bool?>(context, root, DefaultRowTemplate.EditingProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute(WebAttributes.RowEditing);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.RowEditing, target: "root", condition: WebValueCondition.IsTrue)]);
}
