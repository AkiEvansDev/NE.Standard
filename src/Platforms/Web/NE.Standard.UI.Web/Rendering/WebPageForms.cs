using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

/// <summary>
/// The <c>FormId</c>s a view's fields and submit buttons name as written, for the shell's hidden forms (<see cref="WebForms"/>):
/// read off the compiled state once per view, so a page served from the render cache knows them as well as one rendered anew.
/// </summary>
internal static class WebPageForms
{
    private static readonly ConditionalWeakTable<CompiledView, string[]> Forms = [];

    public static IReadOnlyList<string> Of(CompiledView view)
    {
        ArgumentNullException.ThrowIfNull(view);

        return Forms.GetValue(view, Collect);
    }

    // A component in an item template is in the state once, so its rows share the form; a bound FormId is known only to a render
    // with values, and the client makes its form (`ensureFormOwners`).
    private static string[] Collect(CompiledView view)
    {
        SortedDictionary<string, string>? forms = null;

        foreach (UIComponentState state in view.State.All)
        {
            Add(state, IInputComponent.FormIdProperty, ref forms);
            Add(state, ButtonComponent.SubmitFormIdProperty, ref forms);
        }

        return forms is null ? [] : [.. forms.Values];
    }

    // Keyed by the form's element id: two FormIds the id spells alike are one form to the browser.
    private static void Add(UIComponentState state, UIProperty property, ref SortedDictionary<string, string>? forms)
    {
        if (!state.TryGet(property, out CompiledUIPropertyValue? value) || value.IsBind || value.Value is not string formId || string.IsNullOrWhiteSpace(formId))
            return;

        forms ??= new SortedDictionary<string, string>(StringComparer.Ordinal);
        _ = forms.TryAdd(WebForms.ElementId(formId), formId);
    }
}
