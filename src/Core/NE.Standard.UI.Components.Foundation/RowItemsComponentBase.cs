using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// An items component whose item is a row of named slots laid out by the renderer, rendered as a <typeparamref name="TRow"/>
/// the derived component installs.
/// </summary>
public abstract class RowItemsComponentBase<TComponent, TItem, TRow>(string? id = null) : ItemsComponentBase<TComponent, TItem>(id), IItemClickComponent, IItemOpenComponent, IItemRemoveComponent
    where TComponent : RowItemsComponentBase<TComponent, TItem, TRow>, IUIComponentDefinition
    where TItem : class
    where TRow : VisualComponentBase<TRow>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the template used to render each row's overall layout.
    /// </summary>
    public TRow? RowTemplate => GetTemplateVariant(TemplateNames.Row) as TRow;

    /// <summary>
    /// Sets the row template.
    /// </summary>
    public TComponent SetRowTemplate(TRow template)
        => SetTemplateVariantCore(TemplateNames.Row, template);

    /// <summary>
    /// Writes a row event on the row template and on every one <see cref="SetRowTemplate"/> sets later.
    /// </summary>
    protected TComponent OnRowTemplate(Action<TRow> register)
        => OnTemplate(TemplateNames.Row, register);

    /// <summary>
    /// Writes a click registration on the row template, now and on every one <see cref="SetRowTemplate"/> sets later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

    /// <summary>
    /// Writes an open registration on the row template, now and on every one <see cref="SetRowTemplate"/> sets later.
    /// </summary>
    public void OnOpenableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

    /// <summary>
    /// Writes a remove registration on the row template, now and on every one <see cref="SetRowTemplate"/> sets later.
    /// </summary>
    /// <remarks>The Delete key raises it only on a row that may be removed; the controller removes the row or leaves it.</remarks>
    public void OnRemovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

    /// <summary>
    /// The row template, which a registration that configures the row in hand needs.
    /// </summary>
    protected TRow RequiredRowTemplate
        => RowTemplate ?? throw new InvalidOperationException($"The row template of '{TypeKey}' is not configured.");
}
