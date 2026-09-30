namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A key-value list as the compiler checks it: whether its rows edit in place, and whether its rows' action carries a click of the
/// author's.
/// </summary>
public interface IKeyValueActionComponent : IVisualComponent
{
    /// <summary>
    /// Gets whether rows can be edited in place, the rows' action then being the pencil that opens one.
    /// </summary>
    bool? Editable { get; }

    /// <summary>
    /// Gets whether a click command was registered on the rows' action.
    /// </summary>
    bool HasActionClick { get; }
}
