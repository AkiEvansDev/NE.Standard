using System;
using NE.Standard.UI.Compiled.Views;

namespace NE.Standard.UI.Compiled.Debugging;

/// <summary>
/// Provides debug rendering helpers for compiled views.
/// </summary>
public static class CompiledViewDebugExtensions
{
    /// <summary>
    /// Renders the compiled view as a diagnostic graph.
    /// </summary>
    public static string ToDebugGraph(this CompiledView view, CompiledViewDebugOptions? options = null)
    {
        ArgumentNullException.ThrowIfNull(view);

        return new CompiledViewDebugRenderer(options).Render(view);
    }
}
