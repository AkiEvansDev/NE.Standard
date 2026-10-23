using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The one way every items host words its empty state: the built-in <see cref="DefaultEmptyTemplate"/>, configured in place.
/// </summary>
public static class EmptyTemplateExtensions
{
    /// <summary>
    /// Configures the built-in default empty template, putting it in where the host has none, and throwing if a different template has
    /// been set.
    /// </summary>
    /// <remarks>
    /// On demand on every host, so a menu or a key-value list that starts with none (an empty context menu says nothing) and a list that
    /// starts with one are worded alike.
    /// </remarks>
    public static T ConfigureDefaultEmptyTemplate<T>(this T component, Action<DefaultEmptyTemplate> configure)
        where T : TemplatedComponentBase<T>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(component);

        if (!component.HasEmptyTemplate)
            _ = component.SetEmptyTemplate(new DefaultEmptyTemplate());

        return component.ConfigureTemplate(component.EmptyTemplate as DefaultEmptyTemplate, configure, "template");
    }
}
