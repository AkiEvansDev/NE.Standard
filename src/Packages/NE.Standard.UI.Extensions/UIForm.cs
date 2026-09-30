using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What a form is assembled from beyond its fields: a field with a hint under it, and fields side by side. The read-only rows a
/// summary is made of are <see cref="UIDetails"/>.
/// </summary>
public static class UIForm
{
    /// <summary>A field with a muted line under it: what may be typed, what it is for, how much is left.</summary>
    public static StackPanelComponent Field(IVisualComponent input, string hint)
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentException.ThrowIfNullOrWhiteSpace(hint);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .AddChild(input)
            .AddChild(UIText.Note(hint));
    }

    /// <summary>
    /// Fields side by side on one line — a city and its postcode, a first name and a last — in equal columns, their tops level.
    /// </summary>
    public static ContainerComponent Row(params IVisualComponent[] fields)
        => Row(16, fields);

    /// <summary>Fields side by side in equal columns, their tops level, <paramref name="spacing"/> apart.</summary>
    public static ContainerComponent Row(double spacing, params IVisualComponent[] fields)
        // Held by the top, not centred like a plain cell: a field growing its validation line must not push its neighbour down.
        => UILayout.Columns(spacing, UIAlignment.Start, fields);
}
