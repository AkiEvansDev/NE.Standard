using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
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

    /// <inheritdoc />
    public virtual string Title => GetType().Name;

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

    private void EnsureBuilt()
    {
        if (_regions is not null && _dialogs is not null)
            return;

        UIViewBuildContext context = new();

        context.AddRegion(RegionNames.Header, CreateHeader());
        context.AddRegion(RegionNames.Footer, CreateFooter());
        context.AddRegion(RegionNames.LeftSide, CreateLeftSide());
        context.AddRegion(RegionNames.RightSide, CreateRightSide());
        context.AddRegion(RegionNames.Content, CreateContent());
        context.AddDialogs(CreateDialogs());
        context.AddDialogs(CollectComponentDialogs(context));

        _regions = [.. context.Regions];
        _dialogs = [.. context.Dialogs];

        // Validation reads the regions back through the properties, so it runs after they are set — and lets go of them when
        // it refuses, or the next read would hand out a tree that was never validated.
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

    // A component's dialogs are the view's: rendered in the shell like a declared one, opened by key from either side.
    private static List<UIDialog> CollectComponentDialogs(UIViewBuildContext context)
    {
        List<UIDialog> dialogs = [];

        foreach (UIRegion region in context.Regions)
            CollectComponentDialogs(region.Root, dialogs);

        foreach (UIDialog dialog in context.Dialogs)
            CollectComponentDialogs(dialog.Content, dialogs);

        // A dialog found this way may hold a component with dialogs of its own; the list grows under the loop.
        for (var i = 0; i < dialogs.Count; i++)
            CollectComponentDialogs(dialogs[i].Content, dialogs);

        return dialogs;
    }

    private static void CollectComponentDialogs(IVisualComponent root, List<UIDialog> dialogs)
    {
        foreach (IVisualComponent component in UIComponentTree.EnumerateDescendants(root))
        {
            if (component is IDialogOwnerComponent { HasDialogs: true } owner)
                dialogs.AddRange(owner.Dialogs);
        }
    }
}
