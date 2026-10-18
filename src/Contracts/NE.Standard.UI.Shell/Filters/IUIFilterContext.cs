using System;

namespace NE.Standard.UI.Shell.Filters;

/// <summary>
/// What every filter is given: the services of the scope it runs in.
/// </summary>
public interface IUIFilterContext
{
    /// <summary>
    /// Gets the services of the scope the filter runs in.
    /// </summary>
    IServiceProvider Services { get; }
}
