using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A list of key/value rows, each with an optional trailing action, e.g. a settings or detail list.
/// </summary>
/// <remarks>
/// A row host as a table is: one Tab stop whose arrows walk the rows. Enter on the keyboard's row clicks it and opens it — or presses
/// the row's one control, its action —, a double click opens it, Delete raises the removal <c>OnItemRemove</c> wired, and F2 opens a
/// row of a list that edits in place.
/// </remarks>
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultVerticalAlignment))]
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class KeyValueActionComponent<T> : RowItemsComponentBase<T, IKeyValueActionModel, DefaultRowTemplate>, IOverflowComponent, IBorderedComponent, ISurfaceStyleComponent, IRowHoverableComponent, IKeyValueActionComponent, IEmptyStateComponent, IAccessibleNameComponent
    where T : KeyValueActionComponent<T>, IUIComponentDefinition
{
    // A list of rows is as tall as its rows: stretched to a taller cell it would hang its last row's rule mid-air.
    private static readonly UIResponsive<UIAlignment> DefaultVerticalAlignment = UIAlignment.Start;

    /// <summary>The argument the edit and save commands receive the row's key under.</summary>
    private const string EditArgumentName = "id";

    /// <summary>
    /// Gets or sets whether separator lines are shown between rows.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowRowSeparators { get; set; }

    /// <summary>
    /// Gets or sets whether the value column stretches to fill the remaining row width.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? StretchValue { get; set; }

    /// <summary>
    /// Gets or sets whether the action column is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowActions { get; set; }

    /// <summary>
    /// Gets the template used to render each row's key content.
    /// </summary>
    public ITextComponent? KeyTemplate => GetTemplateVariant(TemplateNames.Key) as ITextComponent;
    /// <summary>
    /// Gets the template used to render each row's value content.
    /// </summary>
    public ITextComponent? ValueTemplate => GetTemplateVariant(TemplateNames.Value) as ITextComponent;
    /// <summary>
    /// Gets the template used to render each row's action content.
    /// </summary>
    public IButtonComponent? ActionTemplate => GetTemplateVariant(TemplateNames.Action) as IButtonComponent;

    /// <summary>
    /// Gets whether rows can be edited in place, set by <see cref="EnableEditing"/> and read by the renderer to lay the input
    /// and save/cancel pair into each row.
    /// </summary>
    /// <remarks>Render-time only: it is how the list is built.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = false)]
    public bool? Editable { get; private set; }

    /// <summary>
    /// Gets whether a click command was registered on the rows' action (<see cref="OnActionClick(string)"/> and its siblings); with
    /// <see cref="EnableEditing"/> too the view is refused when it compiles, the action then being the pencil.
    /// </summary>
    public bool HasActionClick { get; private set; }

    /// <summary>
    /// Gets the input a row's value becomes while it is edited, when no typed variant is named by the row.
    /// </summary>
    public IInputComponent? ValueInputTemplate => GetTemplateVariant(TemplateNames.ValueInput) as IInputComponent;

    /// <summary>
    /// Initializes the component with its default row, key, value and action templates.
    /// </summary>
    protected KeyValueActionComponent(string? id = null) : base(id)
    {
        SetDefaultTemplateVariant(TemplateNames.Row, new DefaultRowTemplate());
        _ = DeclareCompositeSlot(TemplateNames.ValueInput, nameof(IKeyValueActionModel.InputTemplate));
        SetDefaultTemplateVariant(TemplateNames.Key, new DefaultKeyTemplate(binds: true));
        SetDefaultTemplateVariant(TemplateNames.Value, new DefaultValueTemplate(binds: true));
        SetDefaultTemplateVariant(TemplateNames.Action, new DefaultActionTemplate(binds: true));
        // No empty template until ConfigureDefaultEmptyTemplate asks for one: a detail list in a card has nothing to say while empty.
    }

    /// <summary>
    /// Configures the default key template.
    /// </summary>
    public T ConfigureDefaultKeyTemplate(Action<DefaultKeyTemplate> configure)
    {
        T result = Self.ConfigureTemplate(KeyTemplate as DefaultKeyTemplate, configure, "template");
        MarkTemplateVariantAuthored(TemplateNames.Key);
        return result;
    }

    /// <summary>
    /// Configures the default value template.
    /// </summary>
    public T ConfigureDefaultValueTemplate(Action<DefaultValueTemplate> configure)
    {
        T result = Self.ConfigureTemplate(ValueTemplate as DefaultValueTemplate, configure, "template");
        MarkTemplateVariantAuthored(TemplateNames.Value);
        return result;
    }

    /// <summary>
    /// Configures the default action template.
    /// </summary>
    public T ConfigureDefaultActionTemplate(Action<DefaultActionTemplate> configure)
    {
        T result = Self.ConfigureTemplate(ActionTemplate as DefaultActionTemplate, configure, "template");
        MarkTemplateVariantAuthored(TemplateNames.Action);
        return result;
    }

    /// <summary>
    /// Sets the key template.
    /// </summary>
    public T SetKeyTemplate(ITextComponent template)
        => SetTemplateVariantCore(TemplateNames.Key, template);
    /// <summary>
    /// Sets the value template.
    /// </summary>
    public T SetValueTemplate(ITextComponent template)
        => SetTemplateVariantCore(TemplateNames.Value, template);
    /// <summary>
    /// Sets the action template.
    /// </summary>
    public T SetActionTemplate(IButtonComponent template)
        => SetTemplateVariantCore(TemplateNames.Action, template);
    /// <summary>
    /// Sets the input every edited row opens with unless it names a typed variant; its value is bound to the row's draft.
    /// </summary>
    public T SetValueInputTemplate<TInput>(TInput template)
        where TInput : VisualComponentBase<TInput>, IInputComponent, IUIComponentDefinition
        => SetTemplateVariantCore(TemplateNames.ValueInput, BindDraft(template));

    /// <summary>
    /// Adds a typed input a row opens with when its <c>InputTemplate</c> names <paramref name="key"/>; its value is bound to the row's draft.
    /// </summary>
    public T AddValueInputTemplate<TInput>(string key, TInput template)
        where TInput : VisualComponentBase<TInput>, IInputComponent, IUIComponentDefinition
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return SetTemplateVariantCore($"{TemplateNames.ValueInput}:{key}", BindDraft(template));
    }

    private static TInput BindDraft<TInput>(TInput template)
        where TInput : VisualComponentBase<TInput>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(template);

        // A field in a row is the row's next line rather than a box on it, as a grid's cell editor is: Ghost unless the author says.
        if (template is IFieldInputComponent { Appearance: null } field)
            field.Appearance = UIInputAppearance.Ghost;

        // A field with no name of its own is named by the row's key, which stands beside it unlinked: a field with no caption is a
        // bare role. A name said with the template wins over this; one said after it is outranked by the binding already set.
        if (template is IAccessibleNameComponent { AccessibleName: null } && IsUnnamed(template))
            _ = template.Bind(IAccessibleNameComponent.AccessibleNameProperty, $"{nameof(IKeyValueActionModel.Key)}.{nameof(ITextBaseModel.Title)}", UIBindingScope.Relative);

        // Spelled out rather than left to the input's own default: a draft that never came back would be no draft.
        return template.Bind(IInputComponent.ValueProperty, nameof(IKeyValueActionModel.EditValue), UIBindingScope.Relative, UIBindingMode.TwoWay);
    }

    private static bool IsUnnamed(IVisualComponent template)
    {
        if (template is ITextBaseComponent { Title: not null })
            return false;

        foreach (UIBinding binding in template.Bindings)
        {
            if (binding.Target == IAccessibleNameComponent.AccessibleNameProperty || binding.Target == ITextBaseComponent.TitleProperty)
                return false;
        }

        return true;
    }

    /// <summary>
    /// Lets a row become editable in place: a pencil button opens it, optionally seeding the draft through
    /// <paramref name="editCommand"/>, and a save/cancel pair replaces it.
    /// </summary>
    /// <remarks>
    /// Saving goes through <paramref name="saveCommand"/> with the row's key as <c>id</c>; canceling needs no round trip; a
    /// text input is the default until a value-input template is set.
    /// </remarks>
    public T EnableEditing(string saveCommand, string? editCommand = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(saveCommand);

        DefaultRowTemplate row = RowTemplate ?? throw new InvalidOperationException($"'{TypeKey}' has no row template to edit through.");

        _ = row.Bind(DefaultRowTemplate.EditingProperty, nameof(IKeyValueActionModel.ShowInput), UIBindingScope.Relative, UIBindingMode.TwoWay);

        if (ValueInputTemplate is null)
            _ = SetValueInputTemplate(new TextInputComponent());

        // The standard actions' words, the framework's own keys: the page translates them the way it translates any title.
        ButtonComponent pencil = new ButtonComponent()
            .SetVariant(UIButtonVariant.Ghost)
            .SetSize(UISize.Small)
            .SetTitle(UIStandardAction.Edit.Title);

        if (editCommand is null)
            _ = row.InteractOn(pencil.Id, EventNames.Click, DefaultRowTemplate.EditingProperty, true);
        else
            _ = pencil.OnClick(editCommand, UIAction.Offered(UIAction.ArgCurrentItemKey(EditArgumentName)));

        ButtonComponent save = new ButtonComponent()
            .SetVariant(UIButtonVariant.Primary)
            .SetSize(UISize.Small)
            .SetTitle(UIStandardAction.Save.Title)
            .OnClick(saveCommand, UIAction.Offered(UIAction.ArgCurrentItemKey(EditArgumentName)));

        ButtonComponent cancel = new ButtonComponent()
            .SetVariant(UIButtonVariant.Ghost)
            .SetSize(UISize.Small)
            .SetTitle(UIStandardAction.Cancel.Title);

        _ = row.InteractOn(cancel.Id, EventNames.Click, DefaultRowTemplate.EditingProperty, false);

        _ = SetTemplateVariantCore(TemplateNames.Action, pencil);
        _ = SetTemplateVariantCore(TemplateNames.EditAction, new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .AddChild(save)
            .AddChild(cancel)
        );

        Editable = true;

        return Self;
    }

    /// <summary>
    /// Registers an action click command that passes the current item as an argument.
    /// </summary>
    public T OnActionClickWithItem(string command, string argumentName = "item")
        => OnActionClick(command, UIAction.ArgCurrentItem(argumentName));
    /// <summary>
    /// Registers an action click command that passes the current item's key as an argument.
    /// </summary>
    public T OnActionClickWithItemKey(string command, string argumentName = "id")
        => OnActionClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers an action click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnActionClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnActionClick(command, UIAction.ArgCurrent(argumentKind, argumentName));

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked.
    /// </summary>
    public T OnActionClick(string command)
    {
        HasActionClick = true;
        return OnTemplate<IButtonComponent>(TemplateNames.Action, action => _ = action.OnClick(command));
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with UI action arguments.
    /// </summary>
    public T OnActionClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        HasActionClick = true;
        return OnTemplate<IButtonComponent>(TemplateNames.Action, action => _ = action.OnClick(command, arguments));
    }

    /// <summary>
    /// Runs a client effect when the action of the row whose key is <paramref name="key"/> is clicked, with no round trip; the other
    /// rows keep the command <c>OnActionClick</c> gave them.
    /// </summary>
    public T OnActionClick(string key, ClientEffect effect)
    {
        HasActionClick = true;
        return OnTemplate<IButtonComponent>(TemplateNames.Action, action => _ = action.InteractOnRow(EventNames.Click, key, effect));
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with literal argument values.
    /// </summary>
    public T OnActionClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        HasActionClick = true;
        return OnTemplate<IButtonComponent>(TemplateNames.Action, action => _ = action.OnClickLiteral(command, arguments));
    }
}

/// <summary>
/// A list of key/value rows, each with an optional trailing action, e.g. a settings or detail list.
/// </summary>
public sealed class KeyValueActionComponent(string? id = null) : KeyValueActionComponent<KeyValueActionComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.key-value-action";
}
