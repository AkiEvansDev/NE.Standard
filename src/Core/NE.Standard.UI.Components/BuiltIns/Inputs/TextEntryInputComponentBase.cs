using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// Shared base class for free-form text-entry fields (<see cref="TextInputComponent{T}"/> and <see cref="TextAreaComponent{T}"/>) carrying
/// leading/trailing field actions and Enter/Escape keyboard events.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IFieldInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(ITextEntryInputComponent))]
[UIComponentPropertyBlock(typeof(IDebounceInputComponent))]
[UIComponentPropertyBlock(typeof(ITextLengthComponent))]
public abstract partial class TextEntryInputComponentBase<T> : InputComponentBase<T, string?>, IBorderedComponent, IFieldInputComponent, IPlaceholderInputComponent, ITextEntryInputComponent, IDebounceInputComponent, ITextLengthComponent, ICaretFieldComponent
    where T : TextEntryInputComponentBase<T>, IUIComponentDefinition
{
    private protected readonly FieldActions Actions;

    protected TextEntryInputComponentBase(string? id = null) : base(id)
    {
        Actions = new FieldActions(RegionEntries);
    }

    /// <summary>
    /// Gets the controls at the start of the field, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> LeadingActions => Actions.Leading;

    /// <summary>
    /// Gets the controls at the end of the field, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> TrailingActions => Actions.Trailing;

    /// <summary>
    /// Gets the leading action flagged in the field (<see cref="AddLeadingAction(IButtonComponent, bool)"/>), first at its start and
    /// kept there under <see cref="ActionsBelow"/>.
    /// </summary>
    public IButtonComponent? LeadingInFieldAction => Actions.LeadingInField;

    /// <summary>
    /// Gets the trailing action flagged in the field (<see cref="AddTrailingAction(IButtonComponent, bool)"/>), last at its end and
    /// kept there under <see cref="ActionsBelow"/>.
    /// </summary>
    public IButtonComponent? TrailingInFieldAction => Actions.TrailingInField;

    /// <summary>
    /// Gets or sets the width tier below which the actions stand in a row under the field; unset, they stand beside the text at every width.
    /// </summary>
    /// <remarks>Render-time only. The same components move, so a flyout or a split button among them keeps its one popup.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public UIResponsiveTier? ActionsBelow { get; set; }

    /// <summary>
    /// Adds a button at the start of the field, after those added before.
    /// </summary>
    public T AddLeadingAction(IButtonComponent action)
        => AddLeadingAction(action, false);

    /// <summary>
    /// Adds a flyout at the start of the field, after the actions added before.
    /// </summary>
    public T AddLeadingAction(FlyoutComponent flyout)
        => AddLeadingAction(flyout, false);

    /// <summary>
    /// Adds a button-variant multi-select at the start of the field, after the actions added before.
    /// </summary>
    public T AddLeadingAction(IMultiSelectComponent select)
        => AddLeadingAction(select, false);

    /// <summary>
    /// Adds a button at the start of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddLeadingAction(IButtonComponent action, bool inField)
    {
        Actions.AddLeading(action, inField);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the start of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddLeadingAction(FlyoutComponent flyout, bool inField)
    {
        Actions.AddLeading(flyout, inField);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the start of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddLeadingAction(IMultiSelectComponent select, bool inField)
    {
        Actions.AddLeading(select, inField);
        return Self;
    }

    /// <summary>
    /// Adds a button at the start of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddLeadingAction(IButtonComponent action, UIAlignment belowAt)
    {
        Actions.AddLeading(action, belowAt);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the start of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddLeadingAction(FlyoutComponent flyout, UIAlignment belowAt)
    {
        Actions.AddLeading(flyout, belowAt);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the start of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddLeadingAction(IMultiSelectComponent select, UIAlignment belowAt)
    {
        Actions.AddLeading(select, belowAt);
        return Self;
    }

    /// <summary>
    /// Adds a button at the end of the field, after those added before.
    /// </summary>
    public T AddTrailingAction(IButtonComponent action)
        => AddTrailingAction(action, false);

    /// <summary>
    /// Adds a flyout at the end of the field, after the actions added before.
    /// </summary>
    public T AddTrailingAction(FlyoutComponent flyout)
        => AddTrailingAction(flyout, false);

    /// <summary>
    /// Adds a button-variant multi-select at the end of the field, after the actions added before.
    /// </summary>
    public T AddTrailingAction(IMultiSelectComponent select)
        => AddTrailingAction(select, false);

    /// <summary>
    /// Adds a button at the end of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddTrailingAction(IButtonComponent action, bool inField)
    {
        Actions.AddTrailing(action, inField);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the end of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddTrailingAction(FlyoutComponent flyout, bool inField)
    {
        Actions.AddTrailing(flyout, inField);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the end of the field; <paramref name="inField"/> keeps it beside the text under <see cref="ActionsBelow"/>.
    /// </summary>
    public T AddTrailingAction(IMultiSelectComponent select, bool inField)
    {
        Actions.AddTrailing(select, inField);
        return Self;
    }

    /// <summary>
    /// Adds a button at the end of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddTrailingAction(IButtonComponent action, UIAlignment belowAt)
    {
        Actions.AddTrailing(action, belowAt);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the end of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddTrailingAction(FlyoutComponent flyout, UIAlignment belowAt)
    {
        Actions.AddTrailing(flyout, belowAt);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the end of the field standing at <paramref name="belowAt"/> of the row under it (<see cref="ActionsBelow"/>).
    /// </summary>
    public T AddTrailingAction(IMultiSelectComponent select, UIAlignment belowAt)
    {
        Actions.AddTrailing(select, belowAt);
        return Self;
    }

    /// <summary>
    /// Runs <paramref name="command"/> on Enter after the value has reached the server.
    /// </summary>
    public T OnEnter(string command)
        => On(EventNames.Enter, command);

    /// <summary>
    /// Runs <paramref name="command"/> on Enter with UI action arguments.
    /// </summary>
    public T OnEnter(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Enter, command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> on Enter with literal argument values.
    /// </summary>
    public T OnEnterLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Enter, command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> on Escape as a cancel, reverting uncommitted edits.
    /// </summary>
    public T OnEscape(string command)
        => On(EventNames.Escape, command);

    /// <summary>
    /// Runs <paramref name="command"/> on Escape with UI action arguments.
    /// </summary>
    public T OnEscape(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Escape, command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> on Escape with literal argument values.
    /// </summary>
    public T OnEscapeLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Escape, command, arguments);

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
        => Actions.SnapshotWith(base.SnapshotAuthoredState());
}
