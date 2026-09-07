using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents a button-like visual component that can invoke UI commands.
/// </summary>
public interface IButtonComponent : ITextComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Type"/>.
    /// </summary>
    static UIProperty TypeProperty { get; } = new UIProperty(nameof(Type));

    /// <summary>
    /// Gets the button's visual variant — Primary, Accent, Danger, Outline, Ghost, Link, or Surface.
    /// </summary>
    UIButtonType? Type { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="Size"/>.
    /// </summary>
    static UIProperty SizeProperty { get; } = new UIProperty(nameof(Size));

    /// <summary>
    /// Gets how much room the button takes.
    /// </summary>
    UIButtonSize? Size { get; }

    /// <summary>
    /// Adds a click handler that invokes the specified command.
    /// </summary>
    IButtonComponent OnClick(string command);

    /// <summary>
    /// Adds a click handler that invokes the specified command with UI action arguments.
    /// </summary>
    IButtonComponent OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments);

    /// <summary>
    /// Adds a click handler that invokes the specified command with literal argument values.
    /// </summary>
    IButtonComponent OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments);
}
