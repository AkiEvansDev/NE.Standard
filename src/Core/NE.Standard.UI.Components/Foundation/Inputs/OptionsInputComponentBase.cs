using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for inputs whose value is one option out of a bound list, holding everything that is true
/// of any such control: the option collection API, the text-restricted item template, and the default
/// item/empty/group templates.
/// </summary>
/// <remarks>
/// Exists so <c>RadioGroupComponent</c> can have all of that without also inheriting the *dropdown's*
/// surface. It used to derive from <c>SelectComponent</c>, which handed it <c>Placeholder</c> and
/// <c>AllowEmptySelection</c> — a radio group has neither a trigger to show a placeholder in nor a popup
/// to clear, and its renderer draws neither, so both were declared and dead.
/// </remarks>
public abstract partial class OptionsInputComponentBase<TComponent, TItem> : InputTemplatedComponentBase<TComponent, TItem, string?>
    where TComponent : OptionsInputComponentBase<TComponent, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets the template used to render each option item.
    /// </summary>
    public virtual IVisualComponent? ItemTemplate => Template;

    /// <summary>
    /// Initializes a new options input with the default item, empty, and group templates.
    /// </summary>
    protected OptionsInputComponentBase(string? id = null) : base(id)
    {
        _ = base.SetTemplate(new DefaultTextTemplate(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Sets the template used to render each option item.
    /// </summary>
    public virtual TComponent SetItemTemplate(ITextComponent textTemplate)
        => base.SetTemplate(textTemplate);

    /// <summary>
    /// Sets the template used to render each option item, restricted to text-based templates.
    /// </summary>
    public override TComponent SetTemplate(IVisualComponent visualTemplate)
        => visualTemplate is not ITextComponent
            ? throw new InvalidOperationException($"Only {nameof(ITextComponent)} is supported.")
            : base.SetTemplate(visualTemplate);

    /// <summary>
    /// Adds a named template variant, restricted to text-based templates.
    /// </summary>
    public override TComponent AddTemplateVariant(string key, IVisualComponent visualTemplate)
        => visualTemplate is not ITextComponent
            ? throw new InvalidOperationException($"Only {nameof(ITextComponent)} is supported.")
            : base.AddTemplateVariant(key, visualTemplate);

    /// <summary>
    /// Adds a single option to the list.
    /// </summary>
    public TComponent AddOption(TItem option)
    {
        _ = AddItem(option);
        return Self;
    }

    /// <summary>
    /// Adds multiple options to the list.
    /// </summary>
    public TComponent AddOptions(IEnumerable<TItem> options)
    {
        _ = AddItems(options);
        return Self;
    }

    /// <summary>
    /// Replaces the list of options.
    /// </summary>
    public TComponent SetOptions(IEnumerable<TItem> options)
    {
        _ = SetItems(options);
        return Self;
    }

    /// <summary>
    /// Binds the list of options to a property at the given string path.
    /// </summary>
    public TComponent BindOptions(string path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
        => BindItems(path, scope, mode);
    /// <summary>
    /// Binds the list of options to a property at the given recursive path.
    /// </summary>
    public TComponent BindOptions(RecursivePath path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
        => BindItems(path, scope, mode);
}
