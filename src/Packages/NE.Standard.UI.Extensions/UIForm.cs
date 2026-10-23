using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What a form is assembled from beyond its fields: a field with a hint under it, and fields side by side. The read-only rows a
/// summary is made of are <see cref="UIDetails"/>.
/// </summary>
public static class UIForm
{
    /// <summary>
    /// A field with a muted line under it — what may be typed, what it is for, how much is left — or, with no <paramref name="hint"/>,
    /// the field alone in the same column, so a form writes every field one way.
    /// </summary>
    public static StackPanelComponent Field(IVisualComponent input, UIPhrase? hint = null)
    {
        ArgumentNullException.ThrowIfNull(input);
        PresetWords.RequireIfGiven(hint);

        return hint is null ? Column(input) : Column(input).AddChild(UIText.Note(hint).SetFieldNote(true));
    }

    /// <summary>The same under a line of the author's — inline links, emphasis — given the hint's role and its place under the field.</summary>
    public static StackPanelComponent Field(IVisualComponent input, ParagraphComponent hint)
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentNullException.ThrowIfNull(hint);

        return Column(input).AddChild(hint.SetDescriptionType(UITextAppearance.Caption).Muted().SetFieldNote(true));
    }

    private static StackPanelComponent Column(IVisualComponent input)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .AddChild(input);

    /// <summary>
    /// The same with the line the controller holds at <paramref name="hintPath"/> — how much is left, what the choice means — as content,
    /// drawn as written.
    /// </summary>
    public static StackPanelComponent BoundField(IVisualComponent input, string hintPath, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(hintPath);

        ParagraphComponent hint = new ParagraphComponent()
            .BindDescription(hintPath, scope)
            .SetDescriptionPlain(true)
            .AsContent(ITextComponent.DescriptionProperty);

        return Field(input, hint);
    }

    /// <summary>
    /// Fields side by side on one line — a city and its postcode, a first name and a last — in equal columns, their tops level.
    /// </summary>
    public static ContainerComponent Row(params IVisualComponent[] fields)
        => Row(16, fields);

    /// <summary>
    /// Fields side by side in equal columns, their tops level, <paramref name="spacing"/> apart. Among fields with a caption over their
    /// boxes, a control with none (a switch, a checkbox, a button) stands a caption line down, centred on a box of their size, while
    /// they stand side by side, as anything beside a captioned field does (<see cref="IVisualComponent.AlignWithFieldBoxes"/>); a control
    /// with its hint (<see cref="Field(IVisualComponent, UIPhrase)"/>) stands the control on it.
    /// </summary>
    public static ContainerComponent Row(double spacing, params IVisualComponent[] fields)
    {
        ArgumentNullException.ThrowIfNull(fields);

        // Held by the top, not centred like a plain cell: a field growing its validation line must not push its neighbour down.
        return UILayout.Columns(spacing, UIAlignment.Start, fields);
    }
}
