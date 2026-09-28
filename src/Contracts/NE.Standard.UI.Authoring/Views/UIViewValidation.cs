using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Authoring.Views;

internal static class UIViewValidation
{
    public static void Validate(UIViewBase view)
    {
        ArgumentNullException.ThrowIfNull(view);
        ArgumentNullException.ThrowIfNull(view.Title);

        var hasContent = false;
        HashSet<string> dialogKeys = new(StringComparer.Ordinal);

        foreach (UIRegion region in view.Regions)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(region.Key);
            ArgumentNullException.ThrowIfNull(region.Root);

            if (!IsKnownRegion(region.Key))
                throw new InvalidOperationException($"View '{view.GetType().Name}' declared unsupported region '{region.Key}'.");

            if (string.Equals(region.Key, RegionNames.Content, StringComparison.Ordinal))
                hasContent = true;

            ValidateLayout(view, region.Root);
        }

        if (!hasContent)
            throw new InvalidOperationException($"View '{view.GetType().Name}' must declare a '{RegionNames.Content}' region.");

        foreach (UIDialog dialog in view.Dialogs)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(dialog.Key);
            ArgumentNullException.ThrowIfNull(dialog.Content);

            if (!dialogKeys.Add(dialog.Key))
                throw new InvalidOperationException($"View '{view.GetType().Name}' declared duplicate dialog '{dialog.Key}'.");

            ValidateDialogLayout(view, dialog);
            ValidateLayout(view, dialog.Content);
        }
    }

    private static bool IsKnownRegion(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return string.Equals(key, RegionNames.Header, StringComparison.Ordinal)
            || string.Equals(key, RegionNames.Content, StringComparison.Ordinal)
            || string.Equals(key, RegionNames.Footer, StringComparison.Ordinal)
            || string.Equals(key, RegionNames.LeftSide, StringComparison.Ordinal)
            || string.Equals(key, RegionNames.RightSide, StringComparison.Ordinal);
    }

    // The value types' own rules, applied here since a component's setters take any value and a bad one only fails in the page.
    private static void ValidateLayout(UIViewBase view, IVisualComponent root)
    {
        foreach (IVisualComponent component in UIComponentTree.EnumerateDescendants(root))
        {
            var owner = $"Component '{component.Id}' in view '{view.GetType().Name}'";

            ValidateResponsive(owner, nameof(IVisualComponent.Placement), component.Placement, static placement => placement.Validate());
            ValidateLengths(owner, component.Width, component.MinWidth, component.MaxWidth, component.Height, component.MinHeight, component.MaxHeight);

            // A padding and a border hold no negative side; a margin may, which is why Margin is not checked here.
            if (component is ISurfaceComponent surface)
                ValidateResponsive(owner, nameof(ISurfaceComponent.Padding), surface.Padding, static padding => padding.Validate());

            if (component is IBorderedComponent { BorderThickness: UIThickness border })
                ValidateResponsive<UIThickness>(owner, nameof(IBorderedComponent.BorderThickness), UIResponsive<UIThickness>.FromValue(border), static thickness => thickness.Validate());
        }
    }

    private static void ValidateResponsive<T>(string owner, string property, UIResponsive<T>? value, Action<T> validate)
        where T : struct
    {
        if (value is not UIResponsive<T> responsive)
            return;

        try
        {
            validate(responsive.Base);

            if (responsive.Sm is T sm)
                validate(sm);

            if (responsive.Md is T md)
                validate(md);

            if (responsive.Xl is T xl)
                validate(xl);

            if (responsive.Xxl is T xxl)
                validate(xxl);
        }
        catch (ArgumentException exception)
        {
            throw new InvalidOperationException($"{owner} has an invalid {property} '{responsive}': {exception.Message}", exception);
        }
    }

    private static void ValidateLengths(string owner, UIResponsive<UILayoutLength>? width, UIResponsive<UILayoutLength>? minWidth, UIResponsive<UILayoutLength>? maxWidth, UIResponsive<UILayoutLength>? height, UIResponsive<UILayoutLength>? minHeight, UIResponsive<UILayoutLength>? maxHeight)
    {
        ValidateResponsive(owner, nameof(IVisualComponent.Width), width, static length => length.Validate());
        ValidateResponsive(owner, nameof(IVisualComponent.MinWidth), minWidth, static length => length.Validate());
        ValidateResponsive(owner, nameof(IVisualComponent.MaxWidth), maxWidth, static length => length.Validate());
        ValidateResponsive(owner, nameof(IVisualComponent.Height), height, static length => length.Validate());
        ValidateResponsive(owner, nameof(IVisualComponent.MinHeight), minHeight, static length => length.Validate());
        ValidateResponsive(owner, nameof(IVisualComponent.MaxHeight), maxHeight, static length => length.Validate());
    }

    private static void ValidateDialogLayout(UIViewBase view, UIDialog dialog)
        => ValidateLengths($"Dialog '{dialog.Key}' in view '{view.GetType().Name}'", dialog.Width, dialog.MinWidth, dialog.MaxWidth, dialog.Height, dialog.MinHeight, dialog.MaxHeight);
}
