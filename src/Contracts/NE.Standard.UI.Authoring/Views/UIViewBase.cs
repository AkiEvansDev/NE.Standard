using System.Collections.Generic;
using System.Runtime.InteropServices;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Base class for UI views composed from standard layout regions and dialogs, built lazily and cached.
/// </summary>
public abstract class UIViewBase : IUIView
{
    private UIRegion[]? _regions;
    private UIDialog[]? _dialogs;
    private UIShortcut[]? _shortcuts;

    /// <inheritdoc />
    public virtual string Title => GetType().Name;

    /// <inheritdoc />
    public virtual IReadOnlyDictionary<string, object?>? TitleArguments => null;

    /// <inheritdoc />
    public virtual UIViewOptions Options => UIViewOptions.Default;

    /// <inheritdoc />
    public IReadOnlyList<UIRegion> Regions
    {
        get
        {
            EnsureBuilt();
            return _regions!;
        }
    }

    /// <inheritdoc />
    public IReadOnlyList<UIDialog> Dialogs
    {
        get
        {
            EnsureBuilt();
            return _dialogs!;
        }
    }

    /// <inheritdoc />
    public IReadOnlyList<UIShortcut> Shortcuts => _shortcuts ??= [.. CreateShortcuts()];

    /// <summary>
    /// Creates the header region content.
    /// </summary>
    protected virtual IVisualComponent? CreateHeader() => null;

    /// <summary>
    /// Creates the footer region content.
    /// </summary>
    protected virtual IVisualComponent? CreateFooter() => null;

    /// <summary>
    /// Creates the left-side region content.
    /// </summary>
    protected virtual IVisualComponent? CreateLeftSide() => null;

    /// <summary>
    /// Creates the right-side region content.
    /// </summary>
    protected virtual IVisualComponent? CreateRightSide() => null;

    /// <summary>
    /// Creates the required content region.
    /// </summary>
    protected abstract IVisualComponent CreateContent();

    /// <summary>
    /// Creates dialogs declared by the view.
    /// </summary>
    protected virtual IReadOnlyList<UIDialog> CreateDialogs() => [];

    /// <summary>
    /// Creates the view's own key chords: <c>new UIShortcut("/", new FocusEffect(SearchId))</c>, compiled into the view as its events
    /// are; a chord claimed twice, or one the browser keeps for itself, is refused when the view compiles.
    /// </summary>
    protected virtual IReadOnlyList<UIShortcut> CreateShortcuts() => [];

    private const int MaxCascadeDepth = 256;

    private void EnsureBuilt()
    {
        if (_regions is not null && _dialogs is not null)
            return;

        UIViewBuildContext context = new();

        // The order the page reads in, which the shell's DOM follows: a screen reader and Tab reach the content before the right side and
        // the footer. The grid places each region by name, so the order moves nothing on screen.
        context.AddRegion(RegionNames.Header, CreateHeader());
        context.AddRegion(RegionNames.LeftSide, CreateLeftSide());
        context.AddRegion(RegionNames.Content, CreateContent());
        context.AddRegion(RegionNames.RightSide, CreateRightSide());
        context.AddRegion(RegionNames.Footer, CreateFooter());
        context.AddDialogs(CreateDialogs());
        context.AddDialogs(ApplyDefaultsAndCollectDialogs(context));

        _regions = [.. context.Regions];
        _dialogs = [.. context.Dialogs];

        // Validation reads the regions back through the properties, so it runs after they're set, and clears them on failure
        // so a later read can't return an unvalidated tree.
        try
        {
            UIViewValidation.Validate(this);
        }
        catch
        {
            _regions = null;
            _dialogs = null;
            throw;
        }
    }

    // Cascades SetDefaults once as the view tree is built so component-owned dialogs added by a rule are collected and layout validation sees final values.
    private static List<UIDialog> ApplyDefaultsAndCollectDialogs(UIViewBuildContext context)
    {
        HashSet<IVisualComponent> visited = [with(ReferenceEqualityComparer.Instance)];
        List<UIDefaultsRule> activeRules = [];
        List<(UIDialog Dialog, UIDefaultsRule[] OwnerRules)> ownedDialogs = [];

        foreach (UIRegion region in context.Regions)
            ApplySubtreeDefaults(region.Root, activeRules, visited, ownedDialogs, 1);

        foreach (UIDialog dialog in context.Dialogs)
        {
            if (dialog.Content is not null)
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
}
