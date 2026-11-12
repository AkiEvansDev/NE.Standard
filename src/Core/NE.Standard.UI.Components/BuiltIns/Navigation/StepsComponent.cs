using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A sequence of numbered steps over a collection, one of them current by <c>SelectedKey</c> and the ones before it completed.
/// </summary>
/// <remarks>
/// Bound <c>SelectedKey</c> writes back when a selectable step is pressed or chosen from the keyboard; a step whose item or template
/// refuses selection (<c>CanSelect</c> or <c>Enabled</c> false) cannot be chosen.
/// </remarks>
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyBlock(typeof(ISpacingComponent))]
[UIComponentPropertyBlock(typeof(ISelectedKeyComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
[UIComponentPropertyDefault(nameof(IOrientationComponent.Orientation), nameof(DefaultOrientation))]
[UIComponentPropertyDefault(nameof(ISpacingComponent.Spacing), nameof(DefaultSpacing))]
public abstract partial class StepsComponent<T> : ItemsComponentBase<T, ITextModel, IVisualComponent>, IOrientationComponent, ISpacingComponent, IPressablePartsComponent, ISelectedKeyComponent, IItemClickComponent, IAccessibleNameComponent
    where T : StepsComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIOrientation> DefaultOrientation = UIOrientation.Horizontal;
    private static readonly UIResponsive<double> DefaultSpacing = 12d;

    /// <summary>
    /// Initializes the steps with the built-in text template.
    /// </summary>
    protected StepsComponent(string? id = null) : base(id)
    {
        SetDefaultTemplate(new DefaultTextTemplate(binds: true));
    }

    /// <summary>
    /// Configures the built-in default text template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultTemplate(Action<DefaultTextTemplate> configure)
    {
        T result = Self.ConfigureTemplate(Template as DefaultTextTemplate, configure, "template");
        MarkTemplateAuthored();
        return result;
    }

    /// <summary>
    /// Writes a click registration on the item template, now and on every one set later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);
}

/// <summary>
/// A sequence of numbered steps over a collection, one of them current by <c>SelectedKey</c> and the ones before it completed.
/// </summary>
public sealed class StepsComponent(string? id = null) : StepsComponent<StepsComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.steps";
}
