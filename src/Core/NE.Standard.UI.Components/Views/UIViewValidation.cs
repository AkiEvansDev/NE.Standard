using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.Views;

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
        }

        if (!hasContent)
            throw new InvalidOperationException($"View '{view.GetType().Name}' must declare a '{RegionNames.Content}' region.");

        foreach (UIDialog dialog in view.Dialogs)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(dialog.Key);
            ArgumentNullException.ThrowIfNull(dialog.Content);

            if (!dialogKeys.Add(dialog.Key))
                throw new InvalidOperationException($"View '{view.GetType().Name}' declared duplicate dialog '{dialog.Key}'.");
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
}
