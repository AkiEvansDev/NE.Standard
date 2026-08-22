using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="ITextModel"/>'s bound icon, title, description and badge as text.
/// </summary>
public abstract class DefaultTextTemplate<TTemplate> : TextComponent<TTemplate>
    where TTemplate : DefaultTextTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new text template, optionally binding its content to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultTextTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = Bind(IconProperty, nameof(ITextModel.Icon), UIBindingScope.Relative);
            _ = Bind(IconColorProperty, nameof(ITextModel.IconColor), UIBindingScope.Relative);
            _ = Bind(IconSizeProperty, nameof(ITextModel.IconSize), UIBindingScope.Relative);

            _ = Bind(TitleProperty, nameof(ITextModel.Title), UIBindingScope.Relative);
            _ = Bind(TitleTypeProperty, nameof(ITextModel.TitleType), UIBindingScope.Relative);
            _ = Bind(TitleColorProperty, nameof(ITextModel.TitleColor), UIBindingScope.Relative);

            _ = Bind(BadgeStyleProperty, nameof(ITextModel.BadgeStyle), UIBindingScope.Relative);
            _ = Bind(BadgePlacementProperty, nameof(ITextModel.BadgePlacement), UIBindingScope.Relative);

            _ = Bind(BadgeIconProperty, nameof(ITextModel.BadgeIcon), UIBindingScope.Relative);
            _ = Bind(BadgeIconColorProperty, nameof(ITextModel.BadgeIconColor), UIBindingScope.Relative);
            _ = Bind(BadgeIconSizeProperty, nameof(ITextModel.BadgeIconSize), UIBindingScope.Relative);

            _ = Bind(BadgeTextProperty, nameof(ITextModel.BadgeText), UIBindingScope.Relative);
            _ = Bind(BadgeTextTypeProperty, nameof(ITextModel.BadgeTextType), UIBindingScope.Relative);

            _ = Bind(TooltipProperty, nameof(ITextModel.Tooltip), UIBindingScope.Relative);
            _ = Bind(BadgeTooltipProperty, nameof(ITextModel.BadgeTooltip), UIBindingScope.Relative);

            _ = Bind(DescriptionProperty, nameof(ITextModel.Description), UIBindingScope.Relative);
            _ = Bind(DescriptionTypeProperty, nameof(ITextModel.DescriptionType), UIBindingScope.Relative);
            _ = Bind(DescriptionColorProperty, nameof(ITextModel.DescriptionColor), UIBindingScope.Relative);

            _ = Bind(TextAlignmentProperty, nameof(ITextModel.TextAlignment), UIBindingScope.Relative);
            _ = Bind(WrapModeProperty, nameof(ITextModel.WrapMode), UIBindingScope.Relative);
            _ = Bind(MaxLinesProperty, nameof(ITextModel.MaxLines), UIBindingScope.Relative);

            _ = Bind(SelectableProperty, nameof(ITextModel.Selectable), UIBindingScope.Relative);

            _ = Bind(VisibleProperty, nameof(ITextModel.Visible), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextModel.Enabled), UIBindingScope.Relative);
        }
    }
}

/// <summary>
/// The built-in template rendering an <see cref="ITextModel"/>'s bound icon, title, description and badge as text.
/// </summary>
public sealed class DefaultTextTemplate(string? itemPath = null, bool binds = false) : DefaultTextTemplate<DefaultTextTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.text.template";
}
