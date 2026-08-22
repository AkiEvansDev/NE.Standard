using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Views;

/// <summary>
/// Base class for UI views composed from standard layout regions and dialogs.
/// Regions and dialogs are built lazily on first access and then cached.
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

        _regions = [.. context.Regions];
        _dialogs = [.. context.Dialogs];

        UIViewValidation.Validate(this);
    }
}
