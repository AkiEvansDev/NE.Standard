using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Defines when a UI view is compiled.
/// </summary>
public enum UIViewCompilationMode
{
    /// <summary>
    /// The view is compiled once at application startup.
    /// </summary>
    Startup = 0,

    /// <summary>
    /// The view is compiled on first use and then cached.
    /// </summary>
    Lazy = 1
}

/// <summary>
/// Configures runtime compilation behavior for a UI view.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
public sealed class UIViewRuntimeAttribute : Attribute
{
    /// <summary>
    /// Gets or sets when the view should be compiled.
    /// </summary>
    public UIViewCompilationMode CompilationMode { get; init; } = UIViewCompilationMode.Startup;
}
