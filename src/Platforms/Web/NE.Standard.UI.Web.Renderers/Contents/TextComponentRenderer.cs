using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public class TextComponentRenderer : TextContentRendererBase
{
    private static readonly WebDomOperation[] RenamableOperations =
    [
        WebDomOperation.ToggleAttribute(WebAttributes.TextRenamable, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute(WebAttributes.NoRowOpen, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute("tabindex", condition: WebValueCondition.IsTrue, value: "0")
    ];

    private static readonly WebDomOperation[] ContainedRenamableOperations =
    [
        WebDomOperation.ToggleAttribute(WebAttributes.TextRenamable, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute(WebAttributes.NoRowOpen, condition: WebValueCondition.IsTrue)
    ];

    private static readonly WebDomOperation[] RenamedTitleOperations = [WebDomOperation.Attribute(WebAttributes.TextRenamedTitle, converter: WebDomConverters.NonBlankText)];

    public override string ComponentTypeKey => TextComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Text;

    /// <summary>Whether the component is reading words on the page rather than a control's or a section's header.</summary>
    protected virtual bool IsReadingWords => true;

    /// <summary>Whether the text sits inside an interactive control that already takes focus (a tab button, an expander summary).</summary>
    protected virtual bool InsideFocusableControl => false;

    /// <summary>Where the text's badge stands when the component does not set <c>BadgePlacement</c>.</summary>
    protected virtual UITextBadgePlacement DefaultBadgePlacement => UITextBadgePlacement.Inline;

    /// <summary>What the region's owner keeps in step with whether the text shows anything (<see cref="WebTextBodyOptions.PartsShownOperation"/>).</summary>
    protected virtual WebDomOperation? PartsShownOperation => null;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Reading words: the reader may select them where they stand on the page, not in a row, a menu or a control.
        if (IsReadingWords)
            _ = root.Class(WebClassNames.ContentText);

        RenderTooltip(context, root);
        RenderTextWrap(context, root);
        RenderRename(context, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = DefaultBadgePlacement,
            PartsShownOperation = PartsShownOperation
        });
    }

    private void RenderRename(WebRenderContext context, IHtmlElementBuilder root)
    {
        var contained = InsideFocusableControl || InsideInteractiveAncestor(context);
        var ownerTypeKey = contained && !InsideFocusableControl ? $"{ComponentTypeKey}.contained" : ComponentTypeKey;

        _ = RenderProperty<bool?>(context, root, ownerTypeKey, TextComponent.RenamableProperty, (element, renamable) =>
        {
            if (renamable == true)
            {
                _ = element
                    .Attribute(WebAttributes.TextRenamable, string.Empty)
                    .Attribute(WebAttributes.NoRowOpen, string.Empty);

                if (!contained)
                    _ = element.Attribute("tabindex", "0");
            }
        }, contained ? ContainedRenamableOperations : RenamableOperations);

        _ = ResolveRenderValue(context, IRenamableComponent.RenamedTitleProperty, out string? renamedTitle, out CompiledUIBinding? binding);

        if (!string.IsNullOrWhiteSpace(renamedTitle)
            || binding is not null
            || context.Metadata.IsExposed(new UIPropertyAddress(context.Node.ComponentId, IRenamableComponent.RenamedTitleProperty)))
        {
            _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TextTitle);
            _ = RenderProperty<string?>(context, root, IRenamableComponent.RenamedTitleProperty, static (element, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = element.Attribute(WebAttributes.TextRenamedTitle, value);
            }, RenamedTitleOperations);
        }
    }

    private static bool InsideInteractiveAncestor(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;
        UIComponentNode current = context.Node;

        while (current.ParentId is UIComponentId parentId && view.Graph.TryGet(parentId, out UIComponentNode? parent))
        {
            UIComponentSlot? slot = FindParentSlot(parent, current.ComponentId);

            if (slot is { Kind: UIComponentSlotKind.ContextMenu }
                || (slot is { Kind: UIComponentSlotKind.Region, Key: RegionNames.Content }
                    && (parent.TypeKey == FlyoutComponent.ComponentTypeKey || parent.TypeKey == SplitButtonComponent.ComponentTypeKey)))
            {
                return false;
            }

            if (parent.TypeKey == ButtonComponent.ComponentTypeKey
                || parent.TypeKey == ActionComponent.ComponentTypeKey
                || parent.TypeKey == LinkComponent.ComponentTypeKey
                || parent.TypeKey == MenuItemComponent.ComponentTypeKey
                || parent.TypeKey == BreadcrumbItemComponent.ComponentTypeKey
                || parent.TypeKey == TabCaptionRegion.ComponentTypeKey
                || parent.TypeKey == TreeNodeComponent.ComponentTypeKey)
            {
                return true;
            }

            if ((parent.TypeKey == ExpanderComponent.ComponentTypeKey || parent.TypeKey == TabItemComponent.ComponentTypeKey)
                && slot is { Kind: UIComponentSlotKind.Region, Key: RegionNames.Header })
            {
                return true;
            }

            if ((parent.TypeKey == SelectComponent.ComponentTypeKey
                    || parent.TypeKey == MultiSelectComponent.ComponentTypeKey
                    || parent.TypeKey == SearchComponent.ComponentTypeKey)
                && slot is { Kind: UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant })
            {
                return true;
            }

            if (parent.TypeKey == ItemsViewComponent.ComponentTypeKey
                && slot is { Kind: UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant }
                && IsInteractiveItemsView(view, parent))
            {
                return true;
            }

            if ((parent.TypeKey == SurfaceComponent.ComponentTypeKey
                    || parent.TypeKey == CardComponent.ComponentTypeKey
                    || parent.TypeKey == FileTileComponent.ComponentTypeKey)
                && IsInteractiveSurface(view, parent))
            {
                return true;
            }

            current = parent;
        }

        return false;
    }

    private static UIComponentSlot? FindParentSlot(UIComponentNode parent, UIComponentId childId)
    {
        foreach (UIComponentSlot slot in parent.Slots)
        {
            if (slot.RootComponentId == childId)
                return slot;
        }

        return null;
    }

    private static bool IsInteractiveItemsView(CompiledView view, UIComponentNode itemsView)
    {
        if (view.State.TryGetValue(itemsView.ComponentId, ISelectableItemsComponent.SelectionModeProperty, out CompiledUIPropertyValue? mode)
            && mode is not null
            && (mode.IsBind || mode.Value is UISelectionMode.One or UISelectionMode.Many))
        {
            return true;
        }

        return ItemsViewRowsAct(view, itemsView);
    }

    private static bool ItemsViewRowsAct(CompiledView view, UIComponentNode itemsView)
    {
        foreach (UIComponentSlot slot in itemsView.Slots)
        {
            if (slot.Kind is UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant && RaisesRowCommand(view, slot.RootComponentId))
                return true;
        }

        return false;
    }

    private static bool RaisesRowCommand(CompiledView view, UIComponentId componentId)
        => view.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Click), out _)
            || view.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Open), out _)
            || view.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Remove), out _);

    private static bool IsInteractiveSurface(CompiledView view, UIComponentNode surface)
    {
        if (view.State.TryGetValue(surface.ComponentId, ILinkableComponent.UrlProperty, out CompiledUIPropertyValue? url)
            && url is not null
            && (url.IsBind || (url.Value is string text && !string.IsNullOrWhiteSpace(text))))
        {
            return true;
        }

        return view.State.TryGetValue(surface.ComponentId, IClickableComponent.ClickableProperty, out CompiledUIPropertyValue? clickable)
            && clickable is not null
            && (clickable.IsBind || clickable.Value is true);
    }
}
