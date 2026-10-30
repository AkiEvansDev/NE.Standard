using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a button-like visual component that can invoke UI commands.
/// </summary>
public interface IButtonComponent : ITextComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Variant"/>.
    /// </summary>
    static UIProperty VariantProperty { get; } = new UIProperty(nameof(Variant));

    /// <summary>
    /// Gets the button's visual variant — Primary, Accent, Danger, Outline, Ghost, Link, or Surface.
    /// </summary>
    UIButtonVariant? Variant { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="Size"/>.
    /// </summary>
    static UIProperty SizeProperty { get; } = new UIProperty(nameof(Size));

    /// <summary>
    /// Gets how much room the button takes, optionally per breakpoint.
    /// </summary>
    UIResponsive<UISize>? Size { get; }

    /// <summary>
    /// Gets the registered property key for <see cref="Shortcut"/>.
    /// </summary>
    static UIProperty ShortcutProperty { get; } = new UIProperty(nameof(Shortcut));

    /// <summary>
    /// Gets the key chord that presses the control from anywhere on the page, written as <c>Ctrl+Shift+P</c>; a context menu's entry
    /// presses it for the row under the keyboard.
    /// </summary>
    string? Shortcut { get; }

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
