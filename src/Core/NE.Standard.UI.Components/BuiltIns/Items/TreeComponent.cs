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

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A tree on the file list's model: thin rows with a glyph and a title, folded and unfolded by a chevron with the fold kept on
/// the client, chosen like an items view's rows, opened by a double click or Enter, renamed in place, with a menu by kind.
/// The nodes are a flat keyed list in walking order, each naming the node above it.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
public abstract partial class TreeComponent<T> : RowItemsComponentBase<T, ITreeNodeModel, DefaultRowTemplate>, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent
    where T : TreeComponent<T>, IUIComponentDefinition
{
    private const double DefaultIndent = 16;

    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(0);

    /// <summary>
    /// Gets or sets the border thickness; a tree is a list in a panel and draws no edge of its own by default.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValueMember = nameof(DefaultBorderThickness))]
    public UIThickness? BorderThickness { get; set; }

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
    /// Gets or sets whether a node can be dragged onto another: the drop writes the node's <c>DropTarget</c> and raises
    /// <c>move</c>, and the controller moves the node or leaves it — nothing moves on the client.
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
    /// Gets or sets whether a node that can unfold draws its chevron; off, the rows keep no square for one and fold from the
    /// keyboard or from a click on a node that refuses the choice.
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
        _ = SetTemplateVariantCore(TemplateNames.Node, new TreeNodeComponent(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Configures the built-in node template — its glyph, its colours, the menu every node without a kind of its own opens.
    /// </summary>
    public T ConfigureDefaultNode(Action<TreeNodeComponent> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (NodeTemplate is not TreeNodeComponent template)
            throw new InvalidOperationException($"Only {nameof(TreeNodeComponent)} template is supported.");

        configure(template);
        return Self;
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
    /// Registers the command run when a node that says it has children is unfolded before any are in the list, with the node's
    /// key as an argument: the controller adds the children under it, or clears <c>HasChildren</c>.
    /// </summary>
    public T OnNodeUnfoldWithItemKey(string command, string argumentName = "id")
        => OnNodeUnfold(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command run when a node that says it has children is unfolded before any are in the list.
    /// </summary>
    public T OnNodeUnfold(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredRowTemplate.On(EventNames.Unfold, command, arguments);
        return Self;
    }

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
    {
        _ = RequiredRowTemplate.On(EventNames.Rename, command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers the command run after a drag wrote the node's <c>DropTarget</c>, with the dragged node's key as an argument;
    /// the controller moves the node under the target, or refuses by doing nothing.
    /// </summary>
    public T OnNodeMoveWithItemKey(string command, string argumentName = "id")
        => OnNodeMove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers the command run after a drag wrote the node's <c>DropTarget</c>.
    /// </summary>
    public T OnNodeMove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredRowTemplate.On(EventNames.Move, command, arguments);
        return Self;
    }

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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tree";
}
