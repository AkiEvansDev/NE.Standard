using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>A tree on the file list's model: thin rows with a glyph and title, folded by a chevron kept on the client.</summary>
/// <remarks>
/// Selected and pressed like an items view, opened by double click or Enter, renamed in place, with a menu by kind. Nodes are a flat
/// keyed list in walking order, each naming the node above it.
/// </remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyDefault(nameof(IBorderedComponent.BorderThickness), nameof(DefaultBorderThickness))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
public abstract partial class TreeComponent<T> : RowItemsComponentBase<T, ITreeNodeModel, DefaultRowTemplate>, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IEmptyStateComponent
    where T : TreeComponent<T>, IUIComponentDefinition
{
    private const double DefaultIndent = 16;

    // A tree is a list in a panel and draws no edge of its own.
    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(0);

    /// <summary>
    /// Gets or sets how far each level steps in from the one above, in pixels.
    /// </summary>
    [UIComponentProperty(DefaultValue = DefaultIndent)]
    public double? Indent { get; set; }

    /// <summary>
    /// Gets or sets whether a node's title can be renamed in place: F2, or a <c>RenameNodeEffect</c> from a menu.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Renamable { get; set; }

    /// <summary>
    /// Gets or sets whether a double click renames the node rather than opening it; Enter opens either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? RenameOnDoubleClick { get; set; }

    /// <summary>
    /// Gets or sets whether a node can be dragged onto a folder (<c>IsFolder</c>, else a node holding children), between two nodes or
    /// onto the tree's own ground, or moved by Alt with an arrow: the move writes <c>DropTarget</c> and raises <c>move</c> with the
    /// node's place in that folder (<see cref="OnNodeMoveWithItemKey"/>); the controller moves the node, since nothing moves on the
    /// client.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Draggable { get; set; }

    /// <summary>
    /// Gets or sets whether the Delete key raises <c>remove</c> on the keyboard's node at all; a single node refuses it with
    /// the item's <c>CanRemove</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? Removable { get; set; }

    /// <summary>
    /// Gets or sets whether a node that can unfold draws its chevron; off, folding still works from the keyboard (arrows), and a
    /// click folds only an unselectable node.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowFoldChevron { get; set; }

    /// <summary>
    /// Whether rows highlight under the pointer — on by default, as a file list's are.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IRowHoverableComponent), DefaultValue = true)]
    public bool? RowHoverable { get; set; }

    /// <summary>
    /// Gets the node template a node is drawn with when no variant matches its kind.
    /// </summary>
    public TreeNodeComponent? NodeTemplate => GetTemplateVariant(TemplateNames.Node) as TreeNodeComponent;

    /// <summary>
    /// Initializes a tree with the built-in node and empty templates and the row template every row is a copy of.
    /// </summary>
    protected TreeComponent(string? id = null) : base(id)
    {
        _ = SetRowTemplate(new DefaultRowTemplate());
        _ = DeclareCompositeSlot(TemplateNames.Node, nameof(ITreeNodeModel.Kind));
        _ = SetTemplateVariantCore(TemplateNames.Node, new TreeNodeComponent(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Configures the built-in node template — its glyph, its colours, the menu every node without a kind of its own opens.
    /// </summary>
    public T ConfigureDefaultNode(Action<TreeNodeComponent> configure)
        => Self.ConfigureTemplate(NodeTemplate, configure, "template");

    /// <summary>
    /// Configures the built-in default empty template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultEmptyTemplate(Action<DefaultEmptyTemplate> configure)
        => Self.ConfigureTemplate(EmptyTemplate as DefaultEmptyTemplate, configure, "template");

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
    /// Registers the command a press on a node runs, with the node's key as an argument.
    /// </summary>
    public T OnNodeClickWithItemKey(string command, string argumentName = "id")
        => OnNodeClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command a press on a node runs, with the node's item as an argument.
    /// </summary>
    public T OnNodeClickWithItem(string command, string argumentName = "item")
        => OnNodeClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers the command a press on a node runs, after the selection has followed the press; a press on the chevron only folds,
    /// and Enter opens rather than presses, as in an items view.
    /// </summary>
    public T OnNodeClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowClick(command, arguments);

    /// <summary>
    /// Registers the command a press on a node runs, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnNodeClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnNodeClick(command, UIAction.ArgCurrent(argumentKind, argumentName));

    /// <summary>
    /// Registers the command a double click or Enter on a node runs, with the node's key as an argument.
    /// </summary>
    public T OnNodeOpenWithItemKey(string command, string argumentName = "id")
        => OnNodeOpen(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command a double click or Enter on a node runs.
    /// </summary>
    public T OnNodeOpen(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowOpen(command, arguments);

    /// <summary>
    /// Registers the command run when an unfold-capable node with no children yet is unfolded, with the node's key as an
    /// argument; the controller adds children or clears <c>HasChildren</c>.
    /// </summary>
    public T OnNodeUnfoldWithItemKey(string command, string argumentName = "id")
        => OnNodeUnfold(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command run when a node that says it has children is unfolded before any are in the list.
    /// </summary>
    public T OnNodeUnfold(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowTemplate(row => _ = row.On(EventNames.Unfold, command, arguments));

    /// <summary>
    /// Registers the command run after a rename wrote the node's <c>RenamedTitle</c> back, with the node's key as an argument.
    /// </summary>
    /// <remarks>Optional: the two-way title already carries the new text; this is for refusing or normalizing it.</remarks>
    public T OnNodeRenameWithItemKey(string command, string argumentName = "id")
        => OnNodeRename(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command run after a rename wrote the node's <c>RenamedTitle</c> back.
    /// </summary>
    public T OnNodeRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowTemplate(row => _ = row.On(EventNames.Rename, command, arguments));

    /// <summary>
    /// Registers the command a node moved to another place raises — dropped onto a folder or between two nodes, or moved by Alt with an
    /// arrow — with the node's key and the index it takes among the nodes of the folder it lands in, which its <c>DropTarget</c> names;
    /// the controller moves the node or refuses by doing nothing.
    /// </summary>
    /// <remarks>
    /// The index counts that folder's own nodes in their order, the node itself taken out first, as <c>RecursiveCollection.Move</c>
    /// counts; a drop onto a folder puts it after the folder's last node.
    /// </remarks>
    public T OnNodeMoveWithItemKey(string command, string keyArgumentName = "id", string indexArgumentName = "index")
        => OnNodeMove(command, UIAction.ArgCurrentItemKey(keyArgumentName), UIAction.ArgEventValue(indexArgumentName));

    /// <summary>
    /// Registers the command a node moved to another place raises, after its <c>DropTarget</c> was written; <c>UIAction.ArgEventValue</c>
    /// reads the index it takes among that folder's nodes.
    /// </summary>
    public T OnNodeMove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowTemplate(row => _ = row.On(EventNames.Move, command, arguments));

    /// <summary>
    /// Registers the command the Delete key runs on the node the keyboard is on, with the node's key as an argument; a node
    /// whose <c>CanRemove</c> is false raises nothing.
    /// </summary>
    public T OnNodeRemoveWithItemKey(string command, string argumentName = "id")
        => OnNodeRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command the Delete key runs on the node the keyboard is on.
    /// </summary>
    public T OnNodeRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnRowRemove(command, arguments);
}

/// <summary>
/// A tree on the file list's model, over a flat keyed list of nodes in walking order.
/// </summary>
public sealed class TreeComponent(string? id = null) : TreeComponent<TreeComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.tree";
}
