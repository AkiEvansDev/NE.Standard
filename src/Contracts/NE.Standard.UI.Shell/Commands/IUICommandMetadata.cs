using System.Collections.Generic;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Provides metadata used to authorize and execute a UI command.
/// </summary>
public interface IUICommandMetadata
{
    /// <summary>
    /// Gets the command name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Gets how concurrent command invocations are handled.
    /// </summary>
    UICommandConcurrencyMode ConcurrencyMode { get; }

    /// <summary>
    /// Gets whether the command can be executed without authorization, or <see langword="null"/> when it
    /// carries no authorization attribute of its own and follows the route it is invoked on.
    /// </summary>
    bool? AllowAnonymous { get; }

    /// <summary>
    /// Gets access rules required to execute the command.
    /// </summary>
    IReadOnlyList<UIAccessRule> AccessRules { get; }
}
