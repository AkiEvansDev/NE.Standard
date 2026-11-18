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

        UIDialog[] dialogs = UIViewValidation.PrepareAndValidate(GetType().Name, Title, context.Regions, context.Dialogs);
        _regions = [.. context.Regions];
        _dialogs = dialogs;
    }
}
