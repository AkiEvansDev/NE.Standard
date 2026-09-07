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
/// The face of one tree node: the chevron, the glyph and the title, drawn once per node from an <see cref="ITreeNodeModel"/>.
/// A tree has one by default and one per <see cref="ITreeNodeModel.Kind"/> where the kinds differ — in their menu, say.
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
    /// Gets or sets the key of the node this one was dropped on, written by a drag; empty for the tree's own ground.
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
        // A row is pointed at, not read out of: selecting its text fights the click that chooses it.
        Selectable = false;

        if (!binds)
            return;

        _ = this.BindText();
        _ = Bind(VisibilityProperty, nameof(ITreeNodeModel.Visibility), UIBindingScope.Relative);
        _ = Bind(EnabledProperty, nameof(ITreeNodeModel.Enabled), UIBindingScope.Relative);
        _ = Bind(ParentIdProperty, nameof(ITreeNodeModel.ParentId), UIBindingScope.Relative);
        _ = Bind(HasChildrenProperty, nameof(ITreeNodeModel.HasChildren), UIBindingScope.Relative);
        _ = Bind(ExpandedProperty, nameof(ITreeNodeModel.Expanded), UIBindingScope.Relative);
        // Two-way onto the title itself, as a tab's caption is: the node shows the new name at once and the controller judges it on
        // `rename`. Spelled out: the raw Bind is one-way whatever the property declares.
        _ = Bind(RenamedTitleProperty, nameof(ITreeNodeModel.Title), UIBindingScope.Relative, UIBindingMode.TwoWay);
        _ = Bind(DropTargetProperty, nameof(ITreeNodeModel.DropTarget), UIBindingScope.Relative, UIBindingMode.TwoWay);
    }
}

/// <summary>
/// The face of one tree node: the chevron, the glyph and the title.
/// </summary>
public sealed class TreeNodeComponent(bool binds = false, string? id = null) : TreeNodeComponent<TreeNodeComponent>(binds, id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tree-node";
}
