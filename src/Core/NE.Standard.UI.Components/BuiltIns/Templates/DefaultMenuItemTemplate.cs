using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IMenuItemModel"/> as a menu entry.
/// </summary>
public abstract class DefaultMenuItemTemplate<TTemplate> : MenuItemComponent<TTemplate>
    where TTemplate : DefaultMenuItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new menu entry template, optionally binding its label to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultMenuItemTemplate(string? itemPath = null, bool binds = false, UIMenuItemKind kind = UIMenuItemKind.Item) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (!binds)
            return;

        _ = this.BindItemState();

        if (kind == UIMenuItemKind.Separator)
            return;

        if (kind == UIMenuItemKind.Header)
        {
            BindEntryLabel(description: false);
            return;
        }

        if (kind == UIMenuItemKind.Select)
        {
            BindEntryLabel(description: true);
            _ = BindValue(nameof(IMenuItemModel.Value), UIBindingScope.Relative, optional: true);
            return;
        }

        if (kind == UIMenuItemKind.Check)
        {
            _ = this.BindText();
            _ = BindShortcut(nameof(IMenuItemModel.Shortcut), UIBindingScope.Relative, optional: true);
            _ = BindInActionBar(nameof(IMenuItemModel.InActionBar), UIBindingScope.Relative, optional: true);
            _ = BindChecked(nameof(IMenuItemModel.Checked), UIBindingScope.Relative, optional: true);
            return;
        }

        _ = this.BindText();

        // Kind is not bound: the menu picks this variant by it, so the variant sets it statically.
        _ = BindUrl(nameof(IMenuItemModel.Url), UIBindingScope.Relative, optional: true);
        _ = BindSelected(nameof(IMenuItemModel.Selected), UIBindingScope.Relative, optional: true);
        _ = BindShortcut(nameof(IMenuItemModel.Shortcut), UIBindingScope.Relative, optional: true);
        _ = BindInActionBar(nameof(IMenuItemModel.InActionBar), UIBindingScope.Relative, optional: true);
    }

    private void BindEntryLabel(bool description)
    {
        _ = BindIcon(nameof(ITextBaseModel.Icon), UIBindingScope.Relative, optional: true);
        _ = BindIconColor(nameof(ITextBaseModel.IconColor), UIBindingScope.Relative, optional: true);
        _ = BindIconSize(nameof(ITextBaseModel.IconSize), UIBindingScope.Relative, optional: true);
        _ = BindTitle(nameof(ITextBaseModel.Title), UIBindingScope.Relative, optional: true);
        _ = BindTitleType(nameof(ITextBaseModel.TitleType), UIBindingScope.Relative, optional: true);
        _ = BindTitleColor(nameof(ITextBaseModel.TitleColor), UIBindingScope.Relative, optional: true);
        _ = BindTextAlignment(nameof(ITextModel.TextAlignment), UIBindingScope.Relative, optional: true);

        _ = BindTooltip(nameof(ITooltipModel.Tooltip), UIBindingScope.Relative, optional: true);
        _ = BindTooltipPlacement(nameof(ITooltipModel.TooltipPlacement), UIBindingScope.Relative, optional: true);

        if (!description)
            return;

        _ = BindDescription(nameof(ITextModel.Description), UIBindingScope.Relative, optional: true);
        _ = BindDescriptionType(nameof(ITextModel.DescriptionType), UIBindingScope.Relative, optional: true);
        _ = BindDescriptionColor(nameof(ITextModel.DescriptionColor), UIBindingScope.Relative, optional: true);
    }
}

/// <summary>
/// The built-in template rendering an <see cref="IMenuItemModel"/> as a menu entry.
/// </summary>
public sealed class DefaultMenuItemTemplate(string? itemPath = null, bool binds = false, UIMenuItemKind kind = UIMenuItemKind.Item) : DefaultMenuItemTemplate<DefaultMenuItemTemplate>(itemPath, binds, kind), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.menu-item.template";

    internal static DefaultMenuItemTemplate ForKind(UIMenuItemKind kind)
        => new DefaultMenuItemTemplate(binds: true, kind: kind).SetKind(kind);
}
