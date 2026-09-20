using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What a form is assembled from beyond its fields: a field with a hint under it, fields side by side, and the read-only
/// rows a summary is made of.
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

    /// <summary>Fields side by side on one line — a city and its postcode, a first name and a last — in equal columns.</summary>
    public static ContainerComponent Row(params IVisualComponent[] fields)
        => UILayout.Columns(16, fields);
}
