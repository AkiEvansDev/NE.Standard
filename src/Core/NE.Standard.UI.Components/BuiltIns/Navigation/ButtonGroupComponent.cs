using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A strip of segments pressed flush against each other, one of them current — the control a view's mode is
/// switched with. Navigation, not an input: the segment chosen is a key, never a validated value.
/// </summary>
/// <remarks>
/// The segments are <see cref="IButtonModel"/>s (icon, title, tooltip, enabled) drawn by the button template as ghost
/// buttons; the strip is the field's ground with a rule between the segments, and the current one is filled primary
/// unless <c>SelectionStyle</c> says otherwise. Always horizontal.
/// </remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
public abstract partial class ButtonGroupComponent<T> : ItemsComponentBase<T, IButtonModel, IButtonComponent>, ISurfaceComponent, IBorderedComponent, ISelectionStyleComponent
    where T : ButtonGroupComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the key of the current segment; two-way, so a press writes the new key back.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? SelectedKey { get; set; }

    /// <summary>
    /// Gets or sets how much room the strip takes; every segment follows it.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonSize.Medium)]
    public UIButtonSize? Size { get; set; }

    /// <summary>
    /// Initializes the group with its segment template: a ghost button, since the strip draws the ground.
    /// </summary>
    protected ButtonGroupComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Start;
        VerticalAlignment = UIAlignment.Center;

        _ = SetTemplate(new DefaultButtonTemplate(binds: true).SetType(UIButtonType.Ghost));
    }

    /// <summary>
    /// Registers a command run when a segment is pressed, beside the key being written back.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = RequiredTemplate.OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a command run when a segment is pressed, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public T OnItemClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = RequiredTemplate.OnClickLiteral(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command that passes the clicked item as an argument.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
        => OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command run when a segment is pressed, passing the segment's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

}

/// <summary>
/// A strip of segments pressed flush against each other, one of them current.
/// </summary>
public sealed class ButtonGroupComponent(string? id = null) : ButtonGroupComponent<ButtonGroupComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.button-group";
}
