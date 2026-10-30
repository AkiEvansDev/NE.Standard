using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input whose value is entered and displayed as formatted text, so parsing it needs the component's own
/// format and culture, not just the target type.
/// </summary>
public interface IFormattedInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Format"/>.
    /// </summary>
    static UIProperty FormatProperty { get; } = new(nameof(Format));

    /// <summary>
    /// Gets the registered property key for <see cref="DisplayFormat"/>.
    /// </summary>
    static UIProperty DisplayFormatProperty { get; } = new(nameof(DisplayFormat));

    /// <summary>
    /// Gets the registered property key for <see cref="Culture"/>.
    /// </summary>
    static UIProperty CultureProperty { get; } = new(nameof(Culture));

    /// <summary>
    /// Gets the registered property key for <see cref="FormatMessage"/>.
    /// </summary>
    static UIProperty FormatMessageProperty { get; } = new(nameof(FormatMessage));

    /// <summary>
    /// Gets the format string the server parses typed text against.
    /// </summary>
    /// <remarks>
    /// Render-time only: the runtime reads it once off the compiled state while normalizing what the user typed. A temporal field reads
    /// text in the format it shows on the page and sends the value; this is a further shape it accepts, read on the server.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    string? Format { get; }

    /// <summary>
    /// Gets the format string used to display the value; a temporal field reads what is typed in it by this format too, and without
    /// one shows the application's (<c>yyyy-MM-dd</c> and <c>HH:mm</c> unless it follows the culture), or its own
    /// <see cref="Culture"/>'s where it names one.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    string? DisplayFormat { get; }

    /// <summary>
    /// Gets the culture used to parse and format the value; a temporal field that names one shows its date and time patterns.
    /// </summary>
    /// <remarks>Render-time only: it resolves a culture pack server-side that no client-side converter could reproduce.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    string? Culture { get; }

    /// <summary>
    /// Gets the message shown when what the user typed cannot be read as <see cref="Format"/>.
    /// </summary>
    /// <remarks>
    /// Unbindable: the runtime reads it once off the compiled state while rejecting a value. The page translates it as it does a
    /// label; <c>AsContent</c> keeps it as written.
    /// </remarks>
    [Translatable]
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    UIPhrase? FormatMessage { get; }
}
