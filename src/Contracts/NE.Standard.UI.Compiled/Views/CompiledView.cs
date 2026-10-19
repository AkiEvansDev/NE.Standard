using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// Represents a compiled UI view with component graph, state, bindings, events, interactions, and validations.
/// </summary>
public sealed class CompiledView
{
    // The dialogs' titles, gathered at the first ask (NamesDialog).
    private HashSet<UIComponentId>? _dialogTitles;

    /// <summary>
    /// Gets the view title.
    /// </summary>
    public required string Title { get; init; }

    /// <summary>
    /// Gets the arguments of the title's slots, or <see langword="null"/> when it has none.
    /// </summary>
    public IReadOnlyDictionary<string, object?>? TitleArguments { get; init; }

    /// <summary>
    /// Gets the choices the view makes about its own shell.
    /// </summary>
    public UIViewOptions Options { get; init; } = UIViewOptions.Default;

    /// <summary>
    /// Gets compiled regions declared by the view.
    /// </summary>
    public required CompiledRegion[] Regions { get; init; }

    /// <summary>
    /// Gets compiled dialogs declared by the view.
    /// </summary>
    public required CompiledDialog[] Dialogs { get; init; }

    /// <summary>
    /// Gets the compiled component graph.
    /// </summary>
    public required UIComponentGraph Graph { get; init; }

    /// <summary>
    /// Gets compiled component state.
    /// </summary>
    public required UIComponentStateIndex State { get; init; }

    /// <summary>
    /// Gets compiled binding sources.
    /// </summary>
    public required UICompiledBindingSourceIndex Sources { get; init; }

    /// <summary>
    /// Gets compiled binding templates.
    /// </summary>
    public required UICompiledBindingTemplateIndex Templates { get; init; }

    /// <summary>
    /// Gets compiled component contexts.
    /// </summary>
    public required UIComponentContextIndex Contexts { get; init; }

    /// <summary>
    /// Gets compiled bindings.
    /// </summary>
    public required UICompiledBindingIndex Bindings { get; init; }

    /// <summary>
    /// Gets compiled client-side interactions.
    /// </summary>
    public required UIInteractionIndex Interactions { get; init; }

    /// <summary>
    /// Gets compiled UI events.
    /// </summary>
    public required UIEventIndex Events { get; init; }

    /// <summary>
    /// Gets compiled validation rules.
    /// </summary>
    public required UIValidationIndex Validations { get; init; }

    /// <summary>
    /// Gets what the page reads off each items host's rows, so a row carries that alone.
    /// </summary>
    public UIItemProjectionIndex ItemProjections { get; init; } = UIItemProjectionIndex.Empty;

    /// <summary>What compiled but is not what the author meant, for the host to log, each of its kind.</summary>
    public IReadOnlyList<UICompileWarning> Warnings { get; init; } = [];

    /// <summary>
    /// One short hash over what a page's client holds of this compile (components, bindings, events and interactions by id),
    /// so pages from different compiles of the same view are told apart.
    /// </summary>
    public required string Fingerprint { get; init; }

    /// <summary>The view's region under <paramref name="key"/>, or <see langword="null"/> where the view declares none.</summary>
    public CompiledRegion? FindRegion(string key)
    {
        foreach (CompiledRegion region in Regions)
        {
            if (string.Equals(region.Key, key, StringComparison.Ordinal))
                return region;
        }

        return null;
    }

    /// <summary>The view's dialog under <paramref name="key"/>, or <see langword="null"/> where the view declares none.</summary>
    public CompiledDialog? FindDialog(string key)
        => CompiledDialog.Find(Dialogs, key);

    /// <summary>Whether the component is a dialog's title, which the dialog's panel names in <c>aria-labelledby</c>.</summary>
    /// <remarks>Asked for every component a page renders, so the titles are gathered once per compile, not scanned per component.</remarks>
    public bool NamesDialog(UIComponentId componentId)
    {
        if (Dialogs.Length == 0)
            return false;

        // A race builds the same set twice, and either is right.
        _dialogTitles ??= GatherDialogTitles();

        return _dialogTitles.Contains(componentId);
    }

    private HashSet<UIComponentId> GatherDialogTitles()
    {
        HashSet<UIComponentId> titles = [];

        foreach (CompiledDialog dialog in Dialogs)
        {
            if (dialog.TitleComponentId is UIComponentId title)
                _ = titles.Add(title);
        }

        return titles;
    }
}
