using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for single-region components with border/background/padding styling (Button, Card, Expander).
/// </summary>
public abstract partial class BorderedRegionComponentBase<TComponent>(string? id = null) : RegionContainerComponentBase<TComponent>(id), IBorderedComponent
    where TComponent : BorderedRegionComponentBase<TComponent>, IUIComponentDefinition
{
    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(1);

    /// <summary>
    /// Gets or sets the inner padding around the content region, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIResponsive<UIThickness>? Padding { get; set; }

    /// <summary>
    /// Gets or sets the background color.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIThemeColor? Background { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValue = null)]
    public UIThemeColor? BorderColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValueMember = nameof(DefaultBorderThickness))]
    public UIThickness? BorderThickness { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValue = null)]
    public UICornerRadius? BorderRadius { get; set; }

    /// <summary>
    /// Gets the content region.
    /// </summary>
    public virtual IVisualComponent? Content => GetRegionOrDefault(RegionNames.Content);

    /// <summary>
    /// Sets the content region.
    /// </summary>
    public virtual TComponent SetContent(IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        SetRegion(RegionNames.Content, content);
        return Self;
    }
}
