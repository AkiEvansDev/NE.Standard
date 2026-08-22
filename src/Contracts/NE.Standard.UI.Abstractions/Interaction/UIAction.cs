using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Linq;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Represents a UI command invocation with optional named arguments.
/// </summary>
public sealed class UIAction
{
    /// <summary>
    /// Creates an action invoking the given command with no arguments.
    /// </summary>
    public UIAction(string command) : this(command, null) { }

    /// <summary>
    /// Creates an action invoking the given command with the given named arguments.
    /// </summary>
    public UIAction(string command, IReadOnlyDictionary<string, UIActionArgument>? arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        Command = command;
        Arguments = arguments is null || arguments.Count == 0
            ? FrozenDictionary<string, UIActionArgument>.Empty
            : arguments.ToFrozenDictionary(StringComparer.Ordinal);
    }

    /// <summary>
    /// Gets the command name.
    /// </summary>
    public string Command { get; }

    /// <summary>
    /// Gets the named action arguments.
    /// </summary>
    public IReadOnlyDictionary<string, UIActionArgument> Arguments { get; }

    /// <summary>
    /// Creates a literal action argument entry.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> Arg(string name, object? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new KeyValuePair<string, UIActionArgument>(name, UIActionArgument.Literal(value));
    }

    /// <summary>
    /// Creates an action argument entry resolved from the current item.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgCurrentItem(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new KeyValuePair<string, UIActionArgument>(name, UIActionArgument.CurrentItem());
    }

    /// <summary>
    /// Creates an action argument entry resolved from the current item key.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgCurrentItemKey(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return new KeyValuePair<string, UIActionArgument>(name, UIActionArgument.CurrentItemKey());
    }

    /// <summary>
    /// Creates an action argument entry resolved from a binding path relative to the root context.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgRoot(string name, string path)
        => ArgBinding(name, path, UIBindingScope.Root);

    /// <summary>
    /// Creates an action argument entry resolved from a binding path relative to the parent context.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgParent(string name, string path)
        => ArgBinding(name, path, UIBindingScope.Parent);

    /// <summary>
    /// Creates an action argument entry resolved from a binding path relative to the current context.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgRelative(string name, string path)
        => ArgBinding(name, path, UIBindingScope.Relative);

    /// <summary>
    /// Creates an action argument entry resolved from a binding path.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgBinding(string name, string path, UIBindingScope scope = UIBindingScope.Relative)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        return ArgBinding(name, RecursivePath.Parse(path), scope);
    }

    /// <summary>
    /// Creates an action argument entry resolved from a binding path.
    /// </summary>
    public static KeyValuePair<string, UIActionArgument> ArgBinding(string name, RecursivePath path, UIBindingScope scope = UIBindingScope.Relative)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(path);

        return new KeyValuePair<string, UIActionArgument>(name, UIActionArgument.Bind(new UIBindingPath(path, scope)));
    }

    public override string ToString()
        => Arguments.Count == 0
            ? Command
            : $"{Command}({string.Join(", ", Arguments.Select(a => $"{a.Key}:{a.Value}"))})";
}
