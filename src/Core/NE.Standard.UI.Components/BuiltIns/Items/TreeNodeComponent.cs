using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// The face of one tree node — chevron, glyph and title — drawn once per node from an <see cref="ITreeNodeModel"/>. A tree
/// has one by default and one per differing <see cref="ITreeNodeModel.Kind"/>.
/// </summary>
public abstract partial class TreeNodeComponent<T> : TextComponent<T>
    where T : TreeNodeComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the key of the node above this one; the tree derives the depth and the fold from it.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    public string? ParentId { get; set; }

    /// <summary>
    /// Gets or sets whether the node has children even when none are in the list yet.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    public bool? HasChildren { get; set; }

    /// <summary>
    /// Gets or sets whether the node is a folder a drag drops onto: unset for a node holding children, true even while empty, false
    /// for none.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    public bool? IsFolder { get; set; }

    /// <summary>
    /// Gets or sets whether the node starts unfolded.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    public bool? Expanded { get; set; }

    /// <summary>
    /// Gets or sets the title as a rename wrote it back; the text body itself draws the title.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultBindingScope = UIBindingScope.Relative,
        DefaultValue = null)]
    public string? RenamedTitle { get; set; }

    /// <summary>
    /// Gets or sets the key of the folder this one was moved into, written by a move; empty for the tree's top level.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultBindingScope = UIBindingScope.Relative,
        DefaultValue = null)]
    public string? DropTarget { get; set; }

    /// <summary>
    /// Initializes a node with a row's text defaults, bound to the node model when <paramref name="binds"/> is set.
    /// </summary>
    protected TreeNodeComponent(bool binds = false, string? id = null) : base(id)
    {
        IconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
        TitleType = UITextAppearance.Body;
        TitleColor = UIThemeColor.FromStyle(UIColorStyle.OnBackground);
        BadgePlacement = UITextBadgePlacement.Trailing;

        if (!binds)
            return;

        _ = this.BindText();
        _ = this.BindItemState();
        _ = Bind(ParentIdProperty, nameof(ITreeNodeModel.ParentId), UIBindingScope.Relative, optional: true);
        _ = Bind(HasChildrenProperty, nameof(ITreeNodeModel.HasChildren), UIBindingScope.Relative, optional: true);
        _ = Bind(IsFolderProperty, nameof(ITreeNodeModel.IsFolder), UIBindingScope.Relative, optional: true);
        _ = Bind(ExpandedProperty, nameof(ITreeNodeModel.Expanded), UIBindingScope.Relative, optional: true);
        // Two-way, as both properties declare, like a tab's caption: a rename shows the new name at once.
        _ = Bind(RenamedTitleProperty, nameof(ITreeNodeModel.Title), UIBindingScope.Relative, optional: true);
        _ = Bind(DropTargetProperty, nameof(ITreeNodeModel.DropTarget), UIBindingScope.Relative, optional: true);
    }
}

/// <summary>
/// The face of one tree node: the chevron, the glyph and the title.
/// </summary>
public sealed class TreeNodeComponent(bool binds = false, string? id = null) : TreeNodeComponent<TreeNodeComponent>(binds, id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tree-node";
}
