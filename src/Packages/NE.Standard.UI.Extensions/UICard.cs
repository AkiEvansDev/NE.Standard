using System;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A card with its name in the header band — a part of a page that stands on its own: a session, a settings group, a summary — and
/// one card alone on an otherwise empty page.
/// </summary>
public static class UICard
{
    /// <summary>Builds a card with an optional header title, description, leading icon and trailing header actions around <paramref name="content"/>.</summary>
    public static CardComponent Create(UIPhrase? title, UIPhrase? description, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
    {
        PresetWords.RequireIfGiven(title);
        PresetWords.RequireIfGiven(description);

        return Create(header =>
        {
            if (title is not null)
                _ = header.SetTitle(title);

            if (description is not null)
                _ = header.SetDescription(description);
        }, content, icon, trailing);
    }

    /// <summary>Builds a card whose header title and optional description are bound as content at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static CardComponent BoundCreate<TSource>(Expression<Func<TSource, object?>> titlePath, Expression<Func<TSource, object?>>? descriptionPath, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => BoundCreate(PresetBindings.Path(titlePath), PresetBindings.PathOrNull(descriptionPath), UIBindingScope.Root, content, icon, trailing);

    /// <summary>Builds a card whose header title and optional description are bound as content in <paramref name="scope"/>.</summary>
    public static CardComponent BoundCreate<TSource>(Expression<Func<TSource, object?>> titlePath, Expression<Func<TSource, object?>>? descriptionPath, UIBindingScope scope, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => BoundCreate(PresetBindings.Path(titlePath), PresetBindings.PathOrNull(descriptionPath), scope, content, icon, trailing);

    /// <summary>Builds a card whose header title and optional description are bound as content at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static CardComponent BoundCreate(string titlePath, string? descriptionPath, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => BoundCreate(titlePath, descriptionPath, UIBindingScope.Root, content, icon, trailing);

    /// <summary>Builds a card whose header title and optional description are bound as content in <paramref name="scope"/>.</summary>
    public static CardComponent BoundCreate(string titlePath, string? descriptionPath, UIBindingScope scope, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        if (descriptionPath is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        return Create(header =>
        {
            _ = header.BindTitle(titlePath, scope).AsContent(ITextBaseComponent.TitleProperty);

            if (descriptionPath is not null)
                _ = header.BindDescription(descriptionPath, scope).SetDescriptionPlain(true).AsContent(ITextComponent.DescriptionProperty);
        }, content, icon, trailing);
    }

    /// <summary>The card, its words written into the default header beside the mark, the content, and the trailing at the header's end.</summary>
    private static CardComponent Create(Action<CardHeaderRegion> words, IVisualComponent content, string? icon, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(content);
        ArgumentNullException.ThrowIfNull(trailing);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        CardComponent card = new CardComponent()
            .ConfigureDefaultHeader(header =>
            {
                words(header);

                if (icon is not null)
                    _ = header.SetIcon(icon);
            })
            .SetContent(content);

        if (trailing.Length == 0)
            return card;

        // One stands as it is; more stand in a row with a toolbar's air.
        return card.SetHeaderAction(trailing.Length == 1 ? trailing[0] : new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .SetVerticalAlignment(UIAlignment.Center)
            .AddChildren(trailing)
        );
    }

    /// <summary>Centers a standalone <paramref name="card"/> in a <see cref="UIColumnWidth.Form"/> column on an otherwise empty page.</summary>
    /// <remarks>Padded 24 px from the top on phones and 96 px from <see cref="UIResponsiveTier.Md"/>.</remarks>
    public static ContainerComponent Centered(IVisualComponent card)
    {
        ArgumentNullException.ThrowIfNull(card);

        return new ContainerComponent()
            .SetPadding(UIResponsive<UIThickness>.Create(UIThickness.All(0, 24, 0, 24), md: UIThickness.All(0, 96, 0, 24)))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetWidth(UILayoutLength.Fill())
                .SetMaxWidth(UILayoutLength.Absolute(UIPage.Pixels(UIColumnWidth.Form)))
                .SetHorizontalAlignment(UIAlignment.Center)
                .AddChild(card)
                .SetPlacement(1, 1, 24, 1)
            );
    }
}
