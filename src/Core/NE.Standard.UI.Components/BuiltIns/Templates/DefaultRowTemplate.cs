using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The identity of a composite row — a key-value list's, a table's, a tree's: the element a click on the whole row is attached
/// to, and the one that says what its host may do with the item (<see cref="IItemAbilitiesComponent"/>, bound to the item).
/// </summary>
[UIComponentPropertyBlock(typeof(IItemAbilitiesComponent))]
public abstract partial class DefaultRowTemplate<TTemplate> : ContainerComponent<TTemplate>, IItemAbilitiesComponent
    where TTemplate : DefaultRowTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether the row is its own editor right now; two-way, bound to the item's <c>ShowInput</c> by an editable list.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public bool? Editing { get; set; }

    /// <summary>
    /// Initializes a row bound to its item's abilities; an item without them leaves every flag unset.
    /// </summary>
    protected DefaultRowTemplate() : base()
    {
        _ = this.BindItemAbilities();
    }

    /// <summary>
    /// Registers a command invoked when the row is clicked.
    /// </summary>
    public TTemplate OnClick(string command)
        => On(EventNames.Click, command);

    /// <summary>
    /// Registers a command invoked when the row is clicked, with arguments.
    /// </summary>
    public TTemplate OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);

    /// <summary>
    /// Registers a command invoked when the row is clicked, with literal arguments.
    /// </summary>
    public TTemplate OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);
}

/// <summary>
/// The identity of a composite row.
/// </summary>
public sealed class DefaultRowTemplate : DefaultRowTemplate<DefaultRowTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.row.template";
}
