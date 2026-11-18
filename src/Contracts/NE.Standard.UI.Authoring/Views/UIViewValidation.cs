using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.InteropServices;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Cascades subtree defaults, collects component-owned dialogs, and validates an authored view's regions, dialogs and layout properties.
/// </summary>
public static class UIViewValidation
{
    private const int MaxCascadeDepth = 256;

    /// <summary>
    /// Applies subtree defaults across <paramref name="view"/>, collects component-owned dialogs, validates the view, and returns the complete dialog list.
    /// </summary>
    public static UIDialog[] PrepareAndValidate(IUIView view)
    {
        ArgumentNullException.ThrowIfNull(view);

        return PrepareAndValidate(view.GetType().Name, view.Title, view.Regions, view.Dialogs);
    }

    internal static UIDialog[] PrepareAndValidate(string viewName, string title, IReadOnlyList<UIRegion> regions, IReadOnlyList<UIDialog> dialogs)
    {
        ArgumentNullException.ThrowIfNull(title);
        ArgumentNullException.ThrowIfNull(regions);
        ArgumentNullException.ThrowIfNull(dialogs);

        List<UIDialog> owned = ApplyDefaultsAndCollectDialogs(regions, dialogs);
        UIDialog[] allDialogs;

        if (owned.Count == 0)
        {
            allDialogs = [.. dialogs];
        }
        else
        {
            HashSet<string> existingKeys = [with(StringComparer.Ordinal)];

            for (var i = 0; i < dialogs.Count; i++)
            {
                if (!string.IsNullOrWhiteSpace(dialogs[i].Key))
                    _ = existingKeys.Add(dialogs[i].Key);
            }

            List<UIDialog> combined = [.. dialogs];

            for (var i = 0; i < owned.Count; i++)
            {
                if (!existingKeys.Contains(owned[i].Key))
                    combined.Add(owned[i]);
            }

            allDialogs = [.. combined];
        }

        Validate(viewName, regions, allDialogs);

        return allDialogs;
    }

    private static List<UIDialog> ApplyDefaultsAndCollectDialogs(IReadOnlyList<UIRegion> regions, IReadOnlyList<UIDialog> dialogs)
    {
        HashSet<IVisualComponent> visited = [with(ReferenceEqualityComparer.Instance)];
        List<UIDefaultsRule> activeRules = [];
        List<(UIDialog Dialog, UIDefaultsRule[] OwnerRules)> ownedDialogs = [];

        foreach (UIRegion region in regions)
        {
            if (region?.Root is not null)
                ApplySubtreeDefaults(region.Root, activeRules, visited, ownedDialogs, 1);
        }

        foreach (UIDialog dialog in dialogs)
        {
            if (dialog?.Content is not null)
                ApplySubtreeDefaults(dialog.Content, activeRules, visited, ownedDialogs, 1);
        }

        List<UIDialog> collected = [with(ownedDialogs.Count)];

        // A dialog found this way may hold a component with dialogs of its own; the list grows under the loop.
        for (var i = 0; i < ownedDialogs.Count; i++)
        {
            (UIDialog dialog, UIDefaultsRule[] ownerRules) = ownedDialogs[i];
            collected.Add(dialog);

            if (dialog.Content is null)
                continue;

            activeRules.Clear();
            activeRules.AddRange(ownerRules);
            ApplySubtreeDefaults(dialog.Content, activeRules, visited, ownedDialogs, 1);
            activeRules.Clear();
        }

        return collected;
    }

    private static void ApplySubtreeDefaults(IVisualComponent component, List<UIDefaultsRule> activeRules, HashSet<IVisualComponent> visited, List<(UIDialog Dialog, UIDefaultsRule[] OwnerRules)> ownedDialogs, int depth)
    {
        if (depth > MaxCascadeDepth || !visited.Add(component))
            return;

        if (activeRules.Count > 0 && component is IPropertyBindingComponent target)
        {
            List<UIDefaultsRule>? matching = null;

            for (var i = 0; i < activeRules.Count; i++)
            {
                UIDefaultsRule rule = activeRules[i];

                if (rule.TargetType.IsInstanceOfType(component))
                    (matching ??= []).Add(rule);
            }

            if (matching is not null)
            {
                UIPropertyRegister.EnsureRegistered(component.GetType());
                target.ApplyDefaults(CollectionsMarshal.AsSpan(matching), UIPropertyRegister.GetProperties(component.TypeKey));
            }
        }

        var priorCount = activeRules.Count;
        IReadOnlyList<UIDefaultsRule> ownDefaults = component.Defaults;

        for (var i = 0; i < ownDefaults.Count; i++)
            activeRules.Add(ownDefaults[i]);

        if (component is IDialogOwnerComponent { HasDialogs: true } owner)
        {
            UIDefaultsRule[] snapshot = activeRules.Count > 0 ? [.. activeRules] : [];

            foreach (UIDialog dialog in owner.Dialogs)
                ownedDialogs.Add((dialog, snapshot));
        }

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(component))
            ApplySubtreeDefaults(slot.Root, activeRules, visited, ownedDialogs, depth + 1);

        if (activeRules.Count > priorCount)
            activeRules.RemoveRange(priorCount, activeRules.Count - priorCount);
    }

    private static void Validate(string viewName, IReadOnlyList<UIRegion> regions, IReadOnlyList<UIDialog> dialogs)
    {
        var hasContent = false;
        HashSet<string> dialogKeys = [with(StringComparer.Ordinal)];

        foreach (UIRegion region in regions)
        {
            ArgumentNullException.ThrowIfNull(region);
            ArgumentException.ThrowIfNullOrWhiteSpace(region.Key);
            ArgumentNullException.ThrowIfNull(region.Root);

            if (!IsKnownRegion(region.Key))
                throw new InvalidOperationException($"View '{viewName}' declared unsupported region '{region.Key}'.");

            if (string.Equals(region.Key, RegionNames.Content, StringComparison.Ordinal))
                hasContent = true;

            ValidateLayout(viewName, region.Root);
        }

        if (!hasContent)
            throw new InvalidOperationException($"View '{viewName}' must declare a '{RegionNames.Content}' region.");

        foreach (UIDialog dialog in dialogs)
        {
            ArgumentNullException.ThrowIfNull(dialog);
            ArgumentException.ThrowIfNullOrWhiteSpace(dialog.Key);
            ArgumentNullException.ThrowIfNull(dialog.Content);

            if (!dialogKeys.Add(dialog.Key))
                throw new InvalidOperationException($"View '{viewName}' declared duplicate dialog '{dialog.Key}'.");

            ValidateDialogLayout(viewName, dialog);
            ValidateLayout(viewName, dialog.Content);
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
    private static void ValidateLayout(string viewName, IVisualComponent root)
    {
        foreach (IVisualComponent component in UIComponentTree.EnumerateDescendants(root))
        {
            var owner = $"Component '{component.Id}' in view '{viewName}'";

            ValidateResponsive(owner, nameof(IVisualComponent.Placement), component.Placement, static placement => placement.Validate());
            ValidateLengths(owner, component.Width, component.MinWidth, component.MaxWidth, component.Height, component.MinHeight, component.MaxHeight);

            // A padding, a border and a corner hold no negative side; a margin may, which is why Margin is not checked here.
            if (component is ISurfaceComponent surface)
            {
                ValidateResponsive(owner, nameof(ISurfaceComponent.Padding), surface.Padding, static padding => padding.Validate());
                ValidateBackgroundImage(owner, surface);
            }

            else
            {
                ValidateResponsive(owner, nameof(ISurfaceComponent.Padding), ReadOwnProperty<UIThickness>(component, nameof(ISurfaceComponent.Padding)), static padding => padding.Validate());
            }

            if (component is IBorderedComponent bordered)
            {
                ValidateResponsive(owner, nameof(IBorderedComponent.BorderThickness), bordered.BorderThickness, static thickness => thickness.Validate());
                ValidateResponsive(owner, nameof(IBorderedComponent.BorderRadius), bordered.BorderRadius, static radius => radius.Validate());
            }
            else
            {
                ValidateResponsive(owner, nameof(IBorderedComponent.BorderRadius), ReadOwnProperty<UICornerRadius>(component, nameof(IBorderedComponent.BorderRadius)), static radius => radius.Validate());
            }
        }
    }

    /// <summary>
    /// A padding or a corner a component declares of its own, past the shared interfaces — a list's rows' padding, an image's corners —
    /// read by its name, since this contract cannot name the component; none where it declares no such property.
    /// </summary>
    private static UIResponsive<T>? ReadOwnProperty<T>(IVisualComponent component, string name)
        where T : struct
    {
        UIPropertyRegister.EnsureRegistered(component.GetType());

        return UIPropertyRegister.TryGet(component.TypeKey, new UIProperty(name), out UIPropertyDefinition? definition)
            ? definition.Getter(component) as UIResponsive<T>?
            : null;
    }

    private static void ValidateResponsive<T>(string owner, string property, UIResponsive<T>? value, Action<T> validate)
        where T : struct
    {
        if (value is not UIResponsive<T> responsive)
            return;

        try
        {
            for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
            {
                if (responsive.Get(tier) is T tierValue)
                    validate(tierValue);
            }
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

    // A bound value is clamped where it is drawn instead: it comes from the reader (a slider), and refusing it would end the page.
    private static void ValidateBackgroundImage(string owner, ISurfaceComponent surface)
    {
        if (surface.BackgroundImageDim is double dim && !(dim >= 0 && dim <= 1))
            throw new InvalidOperationException($"{owner} has an invalid {nameof(ISurfaceComponent.BackgroundImageDim)} '{dim.ToString(CultureInfo.InvariantCulture)}': it must be a number from 0 to 1.");

        if (surface.BackgroundImageBlur is double blur && !(blur >= 0 && double.IsFinite(blur)))
            throw new InvalidOperationException($"{owner} has an invalid {nameof(ISurfaceComponent.BackgroundImageBlur)} '{blur.ToString(CultureInfo.InvariantCulture)}': it must be a finite number of zero or more.");
    }

    private static void ValidateDialogLayout(string viewName, UIDialog dialog)
        => ValidateLengths($"Dialog '{dialog.Key}' in view '{viewName}'", dialog.Width, dialog.MinWidth, dialog.MaxWidth, dialog.Height, dialog.MinHeight, dialog.MaxHeight);
}
