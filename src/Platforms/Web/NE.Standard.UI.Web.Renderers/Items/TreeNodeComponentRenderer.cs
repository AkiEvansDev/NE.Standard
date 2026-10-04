using System;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>
/// Renders a tree node's face: the node's facts as attributes the tree engine reads, the chevron, and the text body beside it.
/// </summary>
public sealed class TreeNodeComponentRenderer : TextContentRendererBase
{
    private const string ToggleClassName = "ui-tree-node__toggle";
    private const string TextClassName = "ui-tree-node__text";

    private static readonly WebDomOperation[] ParentIdOperations = [WebDomOperation.Attribute(WebAttributes.TreeParent)];
    private static readonly WebDomOperation[] FolderOperations = [WebDomOperation.Attribute(WebAttributes.TreeFolder)];
    private static readonly WebDomOperation[] RenamedTitleOperations = [WebDomOperation.Attribute(WebAttributes.TreeTitle)];
    private static readonly WebDomOperation[] DropTargetOperations = [WebDomOperation.Attribute(WebAttributes.TreeDropTarget, target: "." + TextClassName)];

    public override string ComponentTypeKey => TreeNodeComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.TreeNode;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        _ = RenderProperty<string?>(context, root, TreeNodeComponent.ParentIdProperty, static (target, value) =>
        {
            if (!string.IsNullOrEmpty(value))
                _ = target.Attribute(WebAttributes.TreeParent, value);
        }, ParentIdOperations);

        RenderFlagAttribute(context, root, TreeNodeComponent.HasChildrenProperty, WebAttributes.TreeChildren);

        // Three ways, so a word: absent leaves it to whether the node holds children.
        _ = RenderProperty<bool?>(context, root, TreeNodeComponent.IsFolderProperty, static (target, value) =>
        {
            if (value is bool folder)
                _ = target.Attribute(WebAttributes.TreeFolder, folder ? "true" : "false");
        }, FolderOperations);
        RenderFlagAttribute(context, root, TreeNodeComponent.ExpandedProperty, WebAttributes.TreeExpanded);

        // The one writable value on the node's root: what a rename wrote, read back by kind.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TreeTitle);
        _ = RenderProperty<string?>(context, root, TreeNodeComponent.RenamedTitleProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.TreeTitle, value);
        }, RenamedTitleOperations);

        _ = root.Element("button", toggle =>
        {
            _ = toggle.Class(ToggleClassName);
            _ = toggle.Attribute("type", "button");
            // The row is what the keyboard walks; the chevron is reached through it.
            _ = toggle.Attribute("tabindex", "-1");
            WebWords.Write(context, toggle, "aria-label", UIStrings.TreeToggle);
            // A press folds the node and nothing else — never the click of the row it sits in.
            _ = toggle.Attribute(WebAttributes.EventBoundary);
        });

        _ = root.Element("span", text =>
        {
            _ = text.Class(TextClassName);

            // The drop target is the text's own writable value: the root already carries the renamed title.
            _ = text.Attribute(WebAttributes.ValueKind, WebValueKinds.TreeDropTarget);
            _ = RenderProperty<string?>(context, text, TreeNodeComponent.DropTargetProperty, static (target, value) =>
            {
                if (!string.IsNullOrEmpty(value))
                    _ = target.Attribute(WebAttributes.TreeDropTarget, value);
            }, DropTargetOperations);

            RenderTextBody(context, root, text, new WebTextBodyOptions
            {
                DefaultBadgePlacement = UITextBadgePlacement.Trailing
            });
        });
    }
}
