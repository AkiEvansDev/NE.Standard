using System.Collections.Generic;
using NE.Standard.UI.Authoring.Views;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component carrying dialogs of its own (e.g. a package's editor opened by key); the view collects them beside its own
/// so they render the same way.
/// </summary>
public interface IDialogOwnerComponent
{
    /// <summary>Gets whether the component carries at least one dialog.</summary>
    bool HasDialogs { get; }

    /// <summary>Gets the dialogs the component carries, each keyed like a view's own.</summary>
    IReadOnlyList<UIDialog> Dialogs { get; }
}
