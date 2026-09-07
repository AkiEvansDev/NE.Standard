namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// Provides standard template names used by built-in UI components.
/// </summary>
public static class TemplateNames
{
    /// <summary>
    /// The template variant used to render an item's key.
    /// </summary>
    public const string Key = "key";

    /// <summary>
    /// The template variant used to render an item's value.
    /// </summary>
    public const string Value = "value";

    /// <summary>
    /// The template variant used to render an item's action.
    /// </summary>
    public const string Action = "action";

    /// <summary>
    /// The template variant used to render an item's row.
    /// </summary>
    public const string Row = "row";

    /// <summary>
    /// The input a row's value becomes while the row is being edited; a typed variant is <c>value-input:&lt;key&gt;</c>.
    /// </summary>
    public const string ValueInput = "value-input";

    /// <summary>
    /// The save and cancel pair that stands in for a row's action while the row is being edited.
    /// </summary>
    public const string EditAction = "edit-action";

    /// <summary>
    /// A tree node's face; a variant per kind of node is <c>node:&lt;kind&gt;</c>.
    /// </summary>
    public const string Node = "node";
}
