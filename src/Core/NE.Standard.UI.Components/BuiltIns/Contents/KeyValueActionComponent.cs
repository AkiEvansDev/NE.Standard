using System;
using System.Collections.Generic;
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
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
public abstract partial class KeyValueActionComponent<T> : RowItemsComponentBase<T, IKeyValueActionModel, DefaultRowTemplate>, IOverflowComponent, IBorderedComponent, ISurfaceStyleComponent, IRowHoverableComponent
    where T : KeyValueActionComponent<T>, IUIComponentDefinition
{
    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(1);

    /// <summary>
    /// Gets or sets the border thickness; the list draws an edge by default.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValueMember = nameof(DefaultBorderThickness))]
    public UIThickness? BorderThickness { get; set; }

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
    /// Gets whether rows can be edited in place: set by <see cref="EnableEditing"/>, read by the renderer to lay the input and
    /// the save/cancel pair into every row.
    /// </summary>
    /// <remarks>Render-time only: it is how the list is built.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, GenerateSetter = false, DefaultValue = false)]
    public bool? Editable { get; private set; }

    /// <summary>
    /// Gets the input a row's value becomes while it is edited, when no typed variant is named by the row.
    /// </summary>
    public IInputComponent? ValueInputTemplate => GetTemplateVariant(TemplateNames.ValueInput) as IInputComponent;

    /// <summary>The argument the edit and save commands receive the row's key under.</summary>
    private const string EditArgumentName = "id";

    // UIStrings keys, spelled here because the words are the framework's and the component cannot reach the shell's constants.
    private const string RowEditKey = "ui.row.edit";
    private const string RowSaveKey = "ui.row.save";
    private const string RowCancelKey = "ui.row.cancel";

    /// <summary>
    /// Initializes the component with its default row, key, value and action templates.
    /// </summary>
    protected KeyValueActionComponent(string? id = null) : base(id)
    {
        // A list of rows is as tall as its rows: stretched to a taller cell it would hang its last row's rule mid-air.
        VerticalAlignment = UIAlignment.Start;

        _ = SetRowTemplate(new DefaultRowTemplate());
        _ = SetKeyTemplate(new DefaultKeyTemplate(binds: true));
        _ = SetValueTemplate(new DefaultValueTemplate(binds: true));
        _ = SetActionTemplate(new DefaultActionTemplate(binds: true));
    }

    /// <summary>
    /// Configures the default key template.
    /// </summary>
    public T ConfigureDefaultKeyTemplate(Action<DefaultKeyTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (KeyTemplate is not DefaultKeyTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultKeyTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the default value template.
    /// </summary>
    public T ConfigureDefaultValueTemplate(Action<DefaultValueTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (ValueTemplate is not DefaultValueTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultValueTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the default action template.
    /// </summary>
    public T ConfigureDefaultActionTemplate(Action<DefaultActionTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (ActionTemplate is not DefaultActionTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultActionTemplate)} template is supported.");

        configure(template);
        return Self;
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

        // A field in a row is a filled box inside the row unless the author said otherwise — the settings editor's shape — set back by
        // its own padding so its text starts where the value's did (the owner's call, 2026-09-07, after a ghost and a rule were tried).
        if (template is IFieldInputComponent { Appearance: null } field)
            field.Appearance = UIInputAppearance.Filled;

        // Spelled out: the raw Bind is one-way whatever the property declares, and a draft that never came back would be no draft.
        return template.Bind(IInputComponent.ValueProperty, nameof(IKeyValueActionModel.EditValue), UIBindingScope.Relative, UIBindingMode.TwoWay);
    }

    /// <summary>
    /// Lets a row become the input that edits its value. The pencil at the row's end opens it — through
    /// <paramref name="editCommand"/> when one is given, so the controller seeds the draft, or on the client alone with the
    /// value's text as the draft — and the pair that replaces it saves through <paramref name="saveCommand"/> (the row's
    /// key as <c>id</c>) or cancels without a round trip. A text input stands in until a value-input template is set.
    /// </summary>
    public T EnableEditing(string saveCommand, string? editCommand = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(saveCommand);

        DefaultRowTemplate row = RowTemplate ?? throw new InvalidOperationException($"'{TypeKey}' has no row template to edit through.");

        _ = row.Bind(DefaultRowTemplate.EditingProperty, nameof(IKeyValueActionModel.ShowInput), UIBindingScope.Relative, UIBindingMode.TwoWay);

        if (ValueInputTemplate is null)
            _ = SetValueInputTemplate(new TextInputComponent());

        // The words are the framework's own keys: the page translates them the way it translates any title.
        ButtonComponent pencil = new ButtonComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetTitle(RowEditKey);

        if (editCommand is null)
            _ = row.InteractOn(pencil.Id, EventNames.Click, DefaultRowTemplate.EditingProperty, true);
        else
            _ = pencil.OnClick(editCommand, UIAction.ArgCurrentItemKey(EditArgumentName));

        ButtonComponent save = new ButtonComponent()
            .SetType(UIButtonType.Primary)
            .SetSize(UIButtonSize.Small)
            .SetTitle(RowSaveKey)
            .OnClick(saveCommand, UIAction.ArgCurrentItemKey(EditArgumentName));

        ButtonComponent cancel = new ButtonComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetTitle(RowCancelKey);

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
        _ = GetRequiredActionTemplate().OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with UI action arguments.
    /// </summary>
    public T OnActionClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredActionTemplate().OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with literal argument values.
    /// </summary>
    public T OnActionClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = GetRequiredActionTemplate().OnClickLiteral(command, arguments);
        return Self;
    }

    /// <summary>
    /// Gets the action template as an <see cref="IButtonComponent"/>, throwing if it does not implement it.
    /// </summary>
    private IButtonComponent GetRequiredActionTemplate()
        => ActionTemplate is IButtonComponent buttonTemplate
            ? buttonTemplate
            : throw new InvalidOperationException($"The action template of '{TypeKey}' must inherit from '{nameof(IButtonComponent)}' to configure item click actions.");
}

/// <summary>
/// A list of key/value rows, each with an optional trailing action, e.g. a settings or detail list.
/// </summary>
public sealed class KeyValueActionComponent(string? id = null) : KeyValueActionComponent<KeyValueActionComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.key-value-action";
}
