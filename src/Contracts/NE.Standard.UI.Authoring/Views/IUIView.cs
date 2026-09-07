using System.Collections.Generic;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Represents an authored UI view before compilation.
/// </summary>
public interface IUIView
{
    /// <summary>
    /// Gets the view's title; <c>UIViewBase</c> defaults it to the type name unless overridden.
    /// </summary>
    string Title { get; }

    /// <summary>
    /// Gets the regions declared by the view.
    /// </summary>
    IReadOnlyList<UIRegion> Regions { get; }

    /// <summary>
    /// Gets the dialogs declared by the view.
    /// </summary>
    IReadOnlyList<UIDialog> Dialogs { get; }

    /// <summary>
    /// Gets the choices this view makes about its own shell.
    /// </summary>
    UIViewOptions Options => UIViewOptions.Default;
}
