using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A page's state standing in for its content — not found, refused, failed: the mark on a faint disc of its tone, the title and the
/// muted line under it, centred, and the ways on from it in a row under the words. The framework's own not-found and error pages
/// are drawn with it.
/// </summary>
public abstract class StatusComponent<T> : StackPanelComponent<T>
    where T : StatusComponent<T>, IUIComponentDefinition
{
    /// <summary>The column the words keep to, however wide the page: a line a reader takes in at once.</summary>
    private const double MaxColumnWidth = 480;

    /// <summary>The glyph's size; the disc round it is twice that.</summary>
    private const double MarkSize = 32;

    private StackPanelComponent? _actions;

    /// <summary>
    /// Initializes the status with its mark in <paramref name="tone"/>'s colour, its title and, where given, the line under it.
    /// </summary>
    protected StatusComponent(string icon, UIColorStyle tone, string title, string? description = null) : base()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        Mark = new IconComponent()
            .SetIcon(icon)
            .SetShape(UIIconShape.Circle)
            .SetWidth(UILayoutLength.Absolute(MarkSize))
            .SetColor(UIThemeColor.FromStyle(tone))
            .SetHorizontalAlignment(UIAlignment.Center);

        Words = new TextComponent()
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Title)
            .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.OnBackground))
            .SetDescriptionType(UITextAppearance.Body)
            .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            .SetTextAlignment(UITextAlignment.Center)
            .SetWrapMode(UITextWrapMode.Wrap);

        if (description is not null)
            _ = Words.SetDescription(description);

        _ = SetOrientation(UIOrientation.Vertical)
            .SetSpacing(16)
            .SetWidth(UILayoutLength.Fill())
            .SetMaxWidth(UILayoutLength.Absolute(MaxColumnWidth))
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChild(Mark)
            .AddChild(Words);
    }

    /// <summary>The mark over the words, for a page that binds or restyles it.</summary>
    public IconComponent Mark { get; }

    /// <summary>The title and the line under it, for a page that binds the line to what its controller says.</summary>
    public TextComponent Words { get; }

    /// <summary>
    /// Adds a way on from the status — a button — to the row under the words, the safe one first; the row wraps on a phone.
    /// </summary>
    public T AddAction(IVisualComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        if (_actions is null)
        {
            // Made with the first action, so a status with none leaves no empty row and no spacing after its words.
            _actions = new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetSpacing(8)
                .SetWrap(true);

            _ = AddChild(_actions);
        }

        _ = _actions.AddChild(action);

        return (T)this;
    }
}

/// <summary>
/// A page's state standing in for its content — not found, refused, failed.
/// </summary>
public sealed class StatusComponent(string icon, UIColorStyle tone, string title, string? description = null) : StatusComponent<StatusComponent>(icon, tone, title, description), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.status";
}
