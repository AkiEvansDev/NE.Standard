using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an input the viewer types free text into: what is typed can be trimmed, Escape can cancel the edit, and character
/// triggers (such as <c>@</c> or <c>/</c>) can open a suggestion popup at the caret.
/// </summary>
public interface ITextEntryInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="TrimInput"/>.
    /// </summary>
    static UIProperty TrimInputProperty { get; } = new(nameof(TrimInput));

    /// <summary>
    /// Gets the registered property key for <see cref="CancelOnEscape"/>.
    /// </summary>
    static UIProperty CancelOnEscapeProperty { get; } = new(nameof(CancelOnEscape));

    /// <summary>
    /// Gets the registered property key for <see cref="Triggers"/>.
    /// </summary>
    static UIProperty TriggersProperty { get; } = new(nameof(Triggers));

    /// <summary>
    /// Gets the registered property key for <see cref="TriggerItems"/>.
    /// </summary>
    static UIProperty TriggerItemsProperty { get; } = new(nameof(TriggerItems));

    /// <summary>
    /// Gets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? TrimInput { get; set; }

    /// <summary>
    /// Gets whether Escape is the field's cancel where it has an <c>OnEscape</c> command: it goes back to its last committed value
    /// and runs the command. Off, Escape commits and leaves as in a field without one; bound, a field cancels only while it holds an
    /// edit.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? CancelOnEscape { get; }

    /// <summary>
    /// Gets or sets the character triggers (such as <c>@</c> or <c>/</c>) that open the field's suggestion popup while typing.
    /// </summary>
    /// <remarks>Render-time only.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null, GenerateSetter = false)]
    IReadOnlyList<UITextTrigger>? Triggers { get; set; }

    /// <summary>
    /// Gets or sets the suggestion items offered when one of <see cref="Triggers"/> is active; an item with child <c>Items</c> or
    /// <c>LoadsFromServer</c> steps into a second-level list before inserting text.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    IReadOnlyList<UITextTriggerItem>? TriggerItems { get; set; }
}

/// <summary>
/// The fluent shorthands <see cref="ITextEntryInputComponent"/> inputs share.
/// </summary>
public static class TextEntryInputComponentExtensions
{
    /// <summary>
    /// Enables trimming leading and trailing whitespace from the input.
    /// </summary>
    public static T SetTrimInput<T>(this T component) where T : ITextEntryInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);

        component.TrimInput = true;
        return component;
    }

    /// <summary>
    /// Adds a character trigger (such as <c>@</c> or <c>/</c>) that opens the suggestion popup while typing.
    /// </summary>
    public static T AddTrigger<T>(this T component, string prefix, bool startOfLineOnly = false, bool loadsFromServer = false) where T : ITextEntryInputComponent
        => component.AddTrigger(new UITextTrigger(prefix, startOfLineOnly, loadsFromServer));

    /// <summary>
    /// Adds a character trigger that opens the suggestion popup while typing.
    /// </summary>
    public static T AddTrigger<T>(this T component, UITextTrigger trigger) where T : ITextEntryInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentNullException.ThrowIfNull(trigger);

        List<UITextTrigger> list = component.Triggers is { Count: > 0 } existing ? [.. existing] : [];

        for (var i = 0; i < list.Count; i++)
        {
            if (string.Equals(list[i].Prefix, trigger.Prefix, StringComparison.Ordinal))
                throw new ArgumentException($"Trigger '{trigger.Prefix}' is already registered on '{component.Id}'.", nameof(trigger));
        }

        list.Add(trigger);
        component.Triggers = list;
        return component;
    }

    /// <summary>
    /// Sets the character triggers that open the suggestion popup while typing.
    /// </summary>
    public static T SetTriggers<T>(this T component, params UITextTrigger[] triggers) where T : ITextEntryInputComponent
        => component.SetTriggers((IEnumerable<UITextTrigger>)triggers);

    /// <summary>
    /// Sets the character triggers that open the suggestion popup while typing.
    /// </summary>
    public static T SetTriggers<T>(this T component, IEnumerable<UITextTrigger> triggers) where T : ITextEntryInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentNullException.ThrowIfNull(triggers);

        List<UITextTrigger> list = [.. triggers];

        ValidateTriggers(list, component.Id);
        component.Triggers = list;
        return component;
    }

    /// <summary>
    /// Validates that a trigger list contains no null entries or duplicate prefixes.
    /// </summary>
    public static void ValidateTriggers(IReadOnlyList<UITextTrigger>? triggers, string componentId)
    {
        if (triggers is not { Count: > 0 })
            return;

        HashSet<string> seen = new(StringComparer.Ordinal);

        for (var i = 0; i < triggers.Count; i++)
        {
            UITextTrigger trigger = triggers[i];
            ArgumentNullException.ThrowIfNull(trigger);

            if (!seen.Add(trigger.Prefix))
                throw new ArgumentException($"Trigger '{trigger.Prefix}' is registered more than once on '{componentId}'.", nameof(triggers));
        }
    }

    /// <summary>
    /// Sets the suggestion items offered when a trigger is active.
    /// </summary>
    public static T SetTriggerItems<T>(this T component, params UITextTriggerItem[] items) where T : ITextEntryInputComponent
        => component.SetTriggerItems((IEnumerable<UITextTriggerItem>)items);

    /// <summary>
    /// Sets the suggestion items offered when a trigger is active.
    /// </summary>
    public static T SetTriggerItems<T>(this T component, IEnumerable<UITextTriggerItem> items) where T : ITextEntryInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentNullException.ThrowIfNull(items);

        List<UITextTriggerItem> list = [.. items];

        ValidateTriggerItems(list, component.Id);
        component.TriggerItems = list;
        return component;
    }

    /// <summary>
    /// Validates that a trigger item tree contains no null entries or duplicate ids within the same trigger and scope.
    /// </summary>
    public static void ValidateTriggerItems(IReadOnlyList<UITextTriggerItem>? items, string componentId)
    {
        if (items is not { Count: > 0 })
            return;

        HashSet<(string Trigger, string Scope, string Id)> seen = [];

        for (var i = 0; i < items.Count; i++)
        {
            UITextTriggerItem item = items[i];
            ArgumentNullException.ThrowIfNull(item);

            if (!seen.Add((item.Trigger ?? string.Empty, item.Scope ?? string.Empty, item.Id)))
                throw new ArgumentException($"Trigger item '{item.Id}' is registered more than once on '{componentId}'.", nameof(items));

            if (item.Items is { Count: > 0 } children)
                ValidateTriggerItems(children, componentId);
        }
    }

    /// <summary>
    /// Runs <paramref name="command"/> when a server-backed trigger or category asks for suggestions; offers <c>trigger</c>,
    /// <c>scope</c>, and <c>query</c> to the command's parameters.
    /// </summary>
    public static T OnTriggerSearch<T>(this T component, string command) where T : ITextEntryInputComponent
        => component.OnTriggerSearch(command, []);

    /// <summary>
    /// Runs <paramref name="command"/> when a server-backed trigger or category asks for suggestions, offering <c>trigger</c>,
    /// <c>scope</c>, and <c>query</c> beside the arguments given.
    /// </summary>
    public static T OnTriggerSearch<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments) where T : ITextEntryInputComponent
        => OnTriggerEvent(component, EventNames.TriggerSearch, "query", command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> when a server-backed trigger or category asks for suggestions, offering <c>trigger</c>,
    /// <c>scope</c>, and <c>query</c> beside the literal arguments given.
    /// </summary>
    public static T OnTriggerSearchLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments) where T : ITextEntryInputComponent
        => component.OnTriggerSearch(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Runs <paramref name="command"/> when a leaf suggestion is chosen from the trigger popup; offers <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> to the command's parameters.
    /// </summary>
    public static T OnTriggerSelect<T>(this T component, string command) where T : ITextEntryInputComponent
        => component.OnTriggerSelect(command, []);

    /// <summary>
    /// Runs <paramref name="command"/> when a leaf suggestion is chosen from the trigger popup, offering <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> beside the arguments given.
    /// </summary>
    public static T OnTriggerSelect<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments) where T : ITextEntryInputComponent
        => OnTriggerEvent(component, EventNames.TriggerSelect, "key", command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> when a leaf suggestion is chosen from the trigger popup, offering <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> beside the literal arguments given.
    /// </summary>
    public static T OnTriggerSelectLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments) where T : ITextEntryInputComponent
        => component.OnTriggerSelect(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Runs <paramref name="command"/> when an inserted trigger token in the field is clicked; offers <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> to the command's parameters.
    /// </summary>
    public static T OnTriggerClick<T>(this T component, string command) where T : ITextEntryInputComponent
        => component.OnTriggerClick(command, []);

    /// <summary>
    /// Runs <paramref name="command"/> when an inserted trigger token in the field is clicked, offering <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> beside the arguments given.
    /// </summary>
    public static T OnTriggerClick<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments) where T : ITextEntryInputComponent
        => OnTriggerEvent(component, EventNames.TriggerClick, "key", command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> when an inserted trigger token in the field is clicked, offering <c>trigger</c>, <c>scope</c>,
    /// and <c>key</c> beside the literal arguments given.
    /// </summary>
    public static T OnTriggerClickLiteral<T>(this T component, string command, params KeyValuePair<string, object?>[] arguments) where T : ITextEntryInputComponent
        => component.OnTriggerClick(command, UIActionArgument.Literals(arguments));

    private static T OnTriggerEvent<T>(T component, string eventName, string thirdArgumentName, string command, KeyValuePair<string, UIActionArgument>[] arguments) where T : ITextEntryInputComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentNullException.ThrowIfNull(arguments);

        _ = component.On(eventName, command, [UIAction.Offered(UIAction.ArgEventValue("trigger", 0)), UIAction.Offered(UIAction.ArgEventValue("scope", 1)), UIAction.Offered(UIAction.ArgEventValue(thirdArgumentName, 2)), .. arguments]);
        return component;
    }
}
