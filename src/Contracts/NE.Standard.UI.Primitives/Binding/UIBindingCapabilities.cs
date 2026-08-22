using System;

namespace NE.Standard.UI.Primitives.Binding;

/// <summary>
/// Describes which binding directions and update flows a UI property supports.
/// </summary>
[Flags]
public enum UIBindingCapabilities
{
    /// <summary>
    /// No binding direction is supported.
    /// </summary>
    None = 0,

    /// <summary>
    /// The property supports updates flowing from the binding source to the UI target.
    /// </summary>
    SourceToTarget = 1,

    /// <summary>
    /// The property supports updates flowing from the UI target back to the binding source.
    /// </summary>
    TargetToSource = 2,

    /// <summary>
    /// The property supports buffering target-to-source updates until an explicit submit occurs.
    /// </summary>
    SubmitBufferedTargetToSource = 4,
}
