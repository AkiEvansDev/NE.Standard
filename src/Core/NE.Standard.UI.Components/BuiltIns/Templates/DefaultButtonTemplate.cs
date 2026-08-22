using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IButtonModel"/>'s bound icon, title, description and badge as a button.
/// </summary>
public abstract class DefaultButtonTemplate<TTemplate> : ButtonComponent<TTemplate>
    where TTemplate : DefaultButtonTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new button template, optionally binding its content to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultButtonTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        ButtonContentRegion content = new();

        if (binds)
        {
            _ = content
                .Bind(ButtonContentRegion.IconProperty, nameof(ITextModel.Icon), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.IconColorProperty, nameof(ITextModel.IconColor), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.IconSizeProperty, nameof(ITextModel.IconSize), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.TitleProperty, nameof(ITextModel.Title), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.TitleTypeProperty, nameof(ITextModel.TitleType), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.TitleColorProperty, nameof(ITextModel.TitleColor), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.BadgePlacementProperty, nameof(ITextModel.BadgePlacement), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeStyleProperty, nameof(ITextModel.BadgeStyle), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.BadgeIconProperty, nameof(ITextModel.BadgeIcon), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeIconColorProperty, nameof(ITextModel.BadgeIconColor), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeIconSizeProperty, nameof(ITextModel.BadgeIconSize), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.BadgeTextProperty, nameof(ITextModel.BadgeText), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeTextTypeProperty, nameof(ITextModel.BadgeTextType), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.TooltipProperty, nameof(ITextModel.Tooltip), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeTooltipProperty, nameof(ITextModel.BadgeTooltip), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.DescriptionProperty, nameof(ITextModel.Description), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.DescriptionTypeProperty, nameof(ITextModel.DescriptionType), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.DescriptionColorProperty, nameof(ITextModel.DescriptionColor), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.TextAlignmentProperty, nameof(ITextModel.TextAlignment), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.WrapModeProperty, nameof(ITextModel.WrapMode), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.MaxLinesProperty, nameof(ITextModel.MaxLines), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.SelectableProperty, nameof(ITextModel.Selectable), UIBindingScope.Relative);

            _ = Bind(VisibleProperty, nameof(ITextModel.Visible), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextModel.Enabled), UIBindingScope.Relative);

            // IButtonModel adds Type on top of ITextModel — every CommandBar/KeyValueAction item this
            // template renders is button-shaped, so it's always safe to bind, unlike the ITextModel-only
            // properties above, which have to hold for any item this template might be pointed at.
            _ = Bind(TypeProperty, nameof(IButtonModel.Type), UIBindingScope.Relative);
        }

        _ = SetContent(content);
    }
}

/// <summary>
/// The built-in template rendering an <see cref="IButtonModel"/>'s bound icon, title, description and badge as a button.
/// </summary>
public sealed class DefaultButtonTemplate(string? itemPath = null, bool binds = false) : DefaultButtonTemplate<DefaultButtonTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.button.template";
}
