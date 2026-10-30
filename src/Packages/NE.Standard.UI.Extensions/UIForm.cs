using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What a form is assembled from beyond its fields: a field with a hint under it, fields side by side, and a chat or comment composer
/// panel. The read-only rows a summary is made of are <see cref="UIDetails"/>.
/// </summary>
public static class UIForm
{
    private const int ComposerDefaultMaxRows = 6;
    private static readonly UIThickness ComposerBannerMargin = UIThickness.All(12, 8, 4, 8);

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

    /// <summary>
    /// A composer panel — a chat's or a comment box's — holding a <paramref name="textArea"/> and optional upper
    /// <paramref name="banners"/> (a reply or an edit quote from <see cref="UIText.Quote(UIPhrase, UIPhrase, UIThemeColor?, string?, string?)"/> or
    /// <see cref="UIText.BoundQuote"/>) inside a calm borderless surface that acts as the window's foot: the field grows up to six lines
    /// from a single line unless given its own rows, drops its own focus ring and border so the panel stays quiet, and moves its actions
    /// onto a bar below the words on a phone unless given its own <see cref="TextAreaComponent{T}.ActionsBelow"/>.
    /// </summary>
    public static SurfaceComponent Composer(TextAreaComponent textArea, params IVisualComponent[] banners)
        => Composer(textArea, attachments: null, banners);

    /// <summary>
    /// The same with an optional <paramref name="attachments"/> shelf above the banners and the <paramref name="textArea"/>: the
    /// <see cref="FileInputComponent"/> is set to <see cref="UIFileInputVariant.Shelf"/>, accepts drops across the whole composer
    /// panel unless given its own <see cref="FileInputComponent{T}.DropTargetId"/>, and shares a <see cref="IInputComponent.FormId"/>
    /// with the <paramref name="textArea"/> when either declares one.
    /// </summary>
    public static SurfaceComponent Composer(TextAreaComponent textArea, FileInputComponent? attachments, params IVisualComponent[] banners)
    {
        ArgumentNullException.ThrowIfNull(textArea);
        ArgumentNullException.ThrowIfNull(banners);

        SurfaceComponent composer = new();
        StackPanelComponent stack = UILayout.Stack(0);

        if (attachments is not null)
        {
            _ = attachments.SetVariant(UIFileInputVariant.Shelf);

            if (attachments.Margin is null)
                _ = attachments.SetMargin(UIThickness.Uniform(8));

            if (attachments.DropTargetId is null)
                _ = attachments.SetDropTargetId(composer.Id);

            if (textArea.FormId is not null && attachments.FormId is null)
                _ = attachments.SetFormId(textArea.FormId);
            else if (attachments.FormId is not null && textArea.FormId is null)
                _ = textArea.SetFormId(attachments.FormId);

            _ = stack.AddChild(attachments);
        }

        foreach (IVisualComponent banner in banners)
        {
            ArgumentNullException.ThrowIfNull(banner);
            _ = stack.AddChild(ComposerBanner(banner));
        }

        if (textArea.Appearance is null)
            _ = textArea.SetAppearance(UIInputAppearance.Ghost);

        if (textArea.Rows is null)
            _ = textArea.SetRows(1);

        if (textArea.MaxRows is null)
            _ = textArea.SetAutoGrow(Math.Max(ComposerDefaultMaxRows, textArea.Rows ?? 1));

        if (textArea.ActionsBelow is null)
            _ = textArea.SetActionsBelow(UIResponsiveTier.Md);

        _ = stack.AddChild(textArea
            .SetShowFocusEdge(false)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
        );

        return composer
            .SetSurface(UISurfaceStyle.Surface)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetPadding(UIThickness.Uniform(0))
            .SetOverflow(UIOverflow.Hidden)
            .SetWindowFoot(true)
            .SetContent(stack);
    }

    private static IVisualComponent ComposerBanner(IVisualComponent banner)
    {
        if (banner.Margin is not null)
            return banner;

        if (banner is SurfaceComponent surface)
            return surface.SetMargin(ComposerBannerMargin);

        StackPanelComponent cell = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetMargin(ComposerBannerMargin)
            .AddChild(banner);

        return UILayout.FollowVisibility(cell, banner);
    }
}
