using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// The "configure the built-in default template, or throw" shape every component with a swappable built-in
/// template repeats.
/// </summary>
public static class TemplateConfigurationExtensions
{
    /// <summary>
    /// Configures <paramref name="current"/> when it is a <typeparamref name="TTemplate"/>, throwing when a different one was set.
    /// </summary>
    public static T ConfigureTemplate<T, TTemplate>(this T component, TTemplate? current, Action<TTemplate> configure, string what)
        where T : IVisualComponent
        where TTemplate : class
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (current is not TTemplate template)
            throw new InvalidOperationException($"Only {typeof(TTemplate).Name} {what} is supported.");

        configure(template);
        return component;
    }
}
