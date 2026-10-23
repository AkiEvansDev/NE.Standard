namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A control that answers the chords its own menus (its regions) label in its own focus — a graph canvas's Save, its node's Duplicate —
/// so a copy of it in every row keeps them: the compile takes those entries' chords as the control's, not refused as a row's repeated
/// claim.
/// </summary>
public interface IShortcutOwnerComponent : IVisualComponent;
