using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A moment shown in the reader's own time zone and language — a day, a time, both, or how long ago — formatted by the page, so a
/// relative one stays current without the server sending it again.
/// </summary>
/// <remarks>
/// The first paint is in UTC, which the page replaces as soon as it starts: one render of a view is shared by every reader, so it
/// cannot carry any one reader's zone.
/// </remarks>
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class TimestampComponent<T> : VisualComponentBase<T>, ITooltipComponent
    where T : TimestampComponent<T>, IUIComponentDefinition
{
    private static readonly UITextAppearance DefaultTextType = UITextAppearance.Body;
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets or sets the moment shown; an offset it carries says which instant it is, never the zone it is shown in.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public DateTimeOffset? Value { get; set; }

    /// <summary>
    /// Gets or sets how the moment is shown; default <see cref="UITimestampFormat.DateTime"/>.
    /// </summary>
    /// <remarks>Render-time only: the page reads it once to know how to write the moment.</remarks>
    [UIComponentProperty(DefaultValue = UITimestampFormat.DateTime, IsBindable = false)]
    public UITimestampFormat? Format { get; set; }

    /// <summary>
    /// Gets or sets the text style the moment is written in.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultTextType))]
    public UITextAppearance? TextType { get; set; }

    /// <summary>
    /// Gets or sets the text colour; unset resolves to <c>color: inherit</c>.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Initializes the timestamp stretched across its column and centred in its row, as text is.
    /// </summary>
    protected TimestampComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// A moment shown in the reader's own time zone and language, formatted by the page.
/// </summary>
public sealed class TimestampComponent(string? id = null) : TimestampComponent<TimestampComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.timestamp";
}
