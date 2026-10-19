using System;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// What <see cref="UILayout.Panes"/> shows: which side is in front below the medium breakpoint, whether something is chosen, and
/// the splitter's share. A controller holds one as an observable member and moves it by <see cref="ShowDetail"/>,
/// <see cref="ShowList"/> and <see cref="ShowNothing"/>; the three visibilities follow together.
/// </summary>
public sealed partial class UIPanesState : RecursiveObservable
{
    private static readonly PathSegment ShareSegment = PathSegment.ForProperty(nameof(Share));

    private double? _share;

    /// <summary>
    /// Creates the state with the list in front; something <paramref name="chosen"/> stands beside it from the medium breakpoint,
    /// nothing chosen leaves the placeholder there.
    /// </summary>
    public UIPanesState(bool chosen = false)
    {
        Show(detailInFront: false, chosen);
    }

    private void Show(bool detailInFront, bool chosen)
    {
        DetailInFront = detailInFront;
        Chosen = chosen;
        ListVisibility = UILayout.PanesListVisibility(detailInFront);
        DetailVisibility = UILayout.PanesDetailVisibility(detailInFront, chosen);
        PlaceholderVisibility = UILayout.PanesPlaceholderVisibility(chosen);
    }

    /// <summary>Raised when the share changes but by <see cref="SeedShare"/>: the splitter moved, for a page that keeps it per person.</summary>
    public event EventHandler? ShareChanged;

    /// <summary>Gets whether the detail stands in the list's place below the medium breakpoint.</summary>
    public bool DetailInFront { get; private set; }

    /// <summary>Gets whether something is chosen: the detail beside the list from the medium breakpoint, not the placeholder.</summary>
    public bool Chosen { get; private set; }

    /// <summary>Gets the list's visibility (<see cref="UILayout.PanesListVisibility"/>).</summary>
    [RecursiveMember]
    public partial UIResponsive<UIVisibility> ListVisibility { get; private set; }

    /// <summary>Gets the detail's visibility (<see cref="UILayout.PanesDetailVisibility"/>).</summary>
    [RecursiveMember]
    public partial UIResponsive<UIVisibility> DetailVisibility { get; private set; }

    /// <summary>Gets the placeholder's visibility (<see cref="UILayout.PanesPlaceholderVisibility"/>).</summary>
    [RecursiveMember]
    public partial UIResponsive<UIVisibility> PlaceholderVisibility { get; private set; }

    /// <summary>
    /// Gets or sets where the splitter stands, the list's share from 0 to 1 (<c>GridSplitterComponent.Position</c>); unset, the
    /// viewer's own division or the preset's. The splitter writes it back.
    /// </summary>
    [RecursiveMember(false)]
    public double? Share
    {
        get => _share;
        set
        {
            if (SetRecursiveProperty(ref _share, value, ShareSegment))
                ShareChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    /// <summary>Sets the share a page keeps for the person, without raising <see cref="ShareChanged"/>: what was read is not a move to store.</summary>
    public void SeedShare(double? share)
        => _ = SetRecursiveProperty(ref _share, share, ShareSegment);

    /// <summary>Brings the chosen thing to the front: in the list's place below the medium breakpoint, beside it from there.</summary>
    public void ShowDetail()
        => Show(detailInFront: true, chosen: true);

    /// <summary>Goes back to the list below the medium breakpoint; the chosen thing still stands beside it from there.</summary>
    public void ShowList()
        => Show(detailInFront: false, chosen: true);

    /// <summary>Goes back to the list with nothing chosen: the placeholder beside it from the medium breakpoint.</summary>
    public void ShowNothing()
        => Show(detailInFront: false, chosen: false);
}
