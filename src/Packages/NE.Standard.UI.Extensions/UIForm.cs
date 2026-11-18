using System;
using System.Linq.Expressions;
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

    /// <summary>Places <paramref name="input"/> above an optional muted <paramref name="hint"/> line.</summary>
    public static StackPanelComponent Field(IVisualComponent input, UIPhrase? hint = null)
    {
        ArgumentNullException.ThrowIfNull(input);
        PresetWords.RequireIfGiven(hint);

        return hint is null ? Column(input) : Column(input).AddChild(UIText.Note(hint).SetFieldNote(true));
    }

    /// <summary>Places <paramref name="input"/> above a custom <paramref name="hint"/> paragraph styled in the field-note role.</summary>
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

    /// <summary>Places <paramref name="input"/> above a plain content hint bound at <paramref name="hintPath"/>.</summary>
    public static StackPanelComponent BoundField<TSource>(IVisualComponent input, Expression<Func<TSource, object?>> hintPath, UIBindingScope scope = UIBindingScope.Root)
        => BoundField(input, PresetBindings.Path(hintPath), scope);

    /// <summary>A field with a muted line bound at <paramref name="hintPath"/>, drawn as written.</summary>
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

    /// <summary>Places <paramref name="fields"/> side by side in equal top-aligned columns, <paramref name="spacing"/> apart.</summary>
    /// <remarks>Uncaptioned controls align with sibling field boxes while side by side (<see cref="IVisualComponent.AlignWithFieldBoxes"/>).</remarks>
    public static ContainerComponent Row(double spacing, params IVisualComponent[] fields)
    {
        ArgumentNullException.ThrowIfNull(fields);

        // Held by the top, not centred like a plain cell: a field growing its validation line must not push its neighbour down.
        return UILayout.Columns(spacing, UIAlignment.Start, fields);
    }

    /// <summary>Builds a borderless window-foot composer surface holding <paramref name="textArea"/> and optional upper <paramref name="banners"/>.</summary>
    /// <remarks>
    /// Defaults <paramref name="textArea"/> to a ghost field auto-growing from one to six rows with its outer focus halo suppressed. On
    /// phones with many actions, fold secondary actions into <see cref="UIIconButtons.More()"/> or call <c>SetActionsBelow</c> without <c>inField</c>.
    /// </remarks>
    public static SurfaceComponent Composer(TextAreaComponent textArea, params IVisualComponent[] banners)
        => Composer(textArea, attachments: null, banners);

    /// <summary>Builds a borderless window-foot composer surface with an optional <paramref name="attachments"/> shelf above <paramref name="banners"/> and <paramref name="textArea"/>.</summary>
    /// <remarks>
    /// Configures <paramref name="attachments"/> as <see cref="UIFileInputVariant.Shelf"/>, accepts drops across the whole composer
    /// unless <see cref="FileInputComponent{T}.DropTargetId"/> is set, and shares <see cref="IInputComponent.FormId"/> between the two inputs.
    /// </remarks>
    public static SurfaceComponent Composer(TextAreaComponent textArea, FileInputComponent? attachments, params IVisualComponent[] banners)
    {
        ArgumentNullException.ThrowIfNull(textArea);
        ArgumentNullException.ThrowIfNull(banners);

        SurfaceComponent composer = new();
        StackPanelComponent stack = UILayout.Stack(0);

        if (attachments is not null)
        {
            _ = attachments.SetVariant(UIFileInputVariant.Shelf);

            if (attachments.Margin is null && !PresetBindings.Binds(attachments, IVisualComponent.MarginProperty))
                _ = attachments.SetMargin(UIThickness.Uniform(8));

            if (attachments.DropTargetId is null && !PresetBindings.Binds(attachments, FileInputComponent.DropTargetIdProperty))
                _ = attachments.SetDropTargetId(composer.Id);

            if (textArea.FormId is not null && attachments.FormId is null && !PresetBindings.Binds(attachments, IInputComponent.FormIdProperty))
                _ = attachments.SetFormId(textArea.FormId);
            else if (attachments.FormId is not null && textArea.FormId is null && !PresetBindings.Binds(textArea, IInputComponent.FormIdProperty))
                _ = textArea.SetFormId(attachments.FormId);

            _ = stack.AddChild(attachments);
        }

        foreach (IVisualComponent banner in banners)
        {
            ArgumentNullException.ThrowIfNull(banner);
            _ = stack.AddChild(ComposerBanner(banner));
        }

        if (textArea.Appearance is null && !PresetBindings.Binds(textArea, IFieldInputComponent.AppearanceProperty))
            _ = textArea.SetAppearance(UIInputAppearance.Ghost);

        if (textArea.Rows is null && !PresetBindings.Binds(textArea, TextAreaComponent.RowsProperty))
            _ = textArea.SetRows(1);

        if (textArea.MaxRows is null && !PresetBindings.Binds(textArea, TextAreaComponent.MaxRowsProperty))
            _ = textArea.SetAutoGrow(Math.Max(ComposerDefaultMaxRows, textArea.Rows ?? 1));

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
