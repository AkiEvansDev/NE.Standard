using System;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>A tree on the file list's model: thin rows with a glyph and title, folded by a chevron kept on the client.</summary>
/// <remarks>
/// Selected and pressed like an items view, opened by double click or Enter, renamed in place, with a menu by kind. Nodes are a flat
/// keyed list in walking order, each naming the node above it. A <c>Draggable</c> node drops onto a folder (<c>IsFolder</c>, else a
/// node holding children), between two nodes or onto the tree's own ground: the move writes <c>DropTarget</c> and raises <c>move</c>
/// with the node's place in that folder (<c>OnItemMoveWithItemKey</c>); the controller moves the node, since nothing moves on
/// the client. <c>Renamable</c> renames by F2 or a <c>RenameItemEffect</c>; <c>Removable</c> gates the Delete key's <c>remove</c>.
/// On a node's click the selection follows the press first; a press on the chevron only folds. Enter on a node presses it and then
/// opens it, as on an items view's row; Space presses it in a tree that chooses nothing.
/// </remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyDefault(nameof(IRowHoverableComponent.RowHoverable), nameof(DefaultRowHoverable))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IDragSourceComponent))]
[UIComponentPropertyBlock(typeof(IItemsHostAbilitiesComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class TreeComponent<T> : RowItemsComponentBase<T, ITreeNodeModel, DefaultRowTemplate>, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IDragSourceComponent, IEmptyStateComponent, IPressablePartsComponent, IItemsHostAbilitiesComponent, IItemMoveComponent, IItemRenameComponent, IItemUnfoldComponent, IAccessibleNameComponent
    where T : TreeComponent<T>, IUIComponentDefinition
{
    private const double DefaultIndent = 16;

    // Rows highlight under the pointer, as a file list's do.
    private const bool DefaultRowHoverable = true;

    /// <summary>
    /// Gets or sets how far each level steps in from the one above, in pixels.
    /// </summary>
    [UIComponentProperty(DefaultValue = DefaultIndent)]
    public double? Indent { get; set; }

    /// <summary>
    /// Gets or sets whether a double click renames the node rather than opening it; Enter opens either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? RenameOnDoubleClick { get; set; }

    /// <summary>
    /// Gets or sets whether a node that can unfold draws its chevron; off, folding still works from the keyboard (arrows), and a
    /// click folds only an unselectable node.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Gets the node template a node is drawn with when no variant matches its kind.
    /// </summary>
    public TreeNodeComponent? NodeTemplate => GetTemplateVariant(TemplateNames.Node) as TreeNodeComponent;

    /// <summary>
    /// Initializes a tree with the built-in node and empty templates and the row template every row is a copy of.
    /// </summary>
    protected TreeComponent(string? id = null) : base(id)
    {
        SetDefaultTemplateVariant(TemplateNames.Row, new DefaultRowTemplate());
        _ = DeclareCompositeSlot(TemplateNames.Node, nameof(ITreeNodeModel.Kind));
        SetDefaultTemplateVariant(TemplateNames.Node, new TreeNodeComponent(binds: true));
        SetDefaultEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Configures the built-in node template — its glyph, its colours, the menu every node without a kind of its own opens.
    /// </summary>
    public T ConfigureDefaultNode(Action<TreeNodeComponent> configure)
    {
        T result = Self.ConfigureTemplate(NodeTemplate, configure, "template");
        MarkTemplateVariantAuthored(TemplateNames.Node);
        return result;
    }

    /// <summary>
    /// Sets the node template a node is drawn with when no variant matches its kind.
    /// </summary>
    public T SetNodeTemplate(TreeNodeComponent template)
        => SetTemplateVariantCore(TemplateNames.Node, template);

    /// <summary>
    /// Adds the node template the nodes of <paramref name="kind"/> are drawn with — a folder's face and menu beside a file's.
    /// </summary>
    public T AddNodeKind(string kind, TreeNodeComponent template)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(kind);

        return SetTemplateVariantCore($"{TemplateNames.Node}:{kind}", template);
    }

    /// <summary>
    /// Adds a bound node template for <paramref name="kind"/> and lets <paramref name="configure"/> shape it.
    /// </summary>
    public T AddNodeKind(string kind, Action<TreeNodeComponent> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        TreeNodeComponent template = new(binds: true);

        configure(template);

        return AddNodeKind(kind, template);
    }

    /// <summary>
    /// Writes an unfold registration on the row template, now and on every one set later: a node that says it has children, unfolded
    /// before any are in the list.
    /// </summary>
    /// <remarks>The controller adds children or clears <c>HasChildren</c>.</remarks>
    public void OnUnfoldableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

    /// <summary>
    /// Writes a rename registration on the row template, now and on every one set later: raised after a rename wrote the node's
    /// <c>RenamedTitle</c> back.
    /// </summary>
    public void OnRenamableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

    /// <summary>
    /// Writes a move registration on the row template, now and on every one set later: a node dropped onto a folder or between two
    /// nodes, or moved by Alt with an arrow, raised after its <c>DropTarget</c> was written.
    /// </summary>
    /// <remarks>
    /// The index counts the nodes of the folder it lands in, in their order, the node itself taken out first, as
    /// <c>RecursiveCollection.Move</c> counts; a drop onto a folder puts it after the folder's last node. The controller moves the node
    /// or refuses by doing nothing.
    /// </remarks>
    public void OnMovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));
}

/// <summary>
/// A tree on the file list's model, over a flat keyed list of nodes in walking order.
/// </summary>
public sealed class TreeComponent(string? id = null) : TreeComponent<TreeComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tree";
}
