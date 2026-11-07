using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line unless it is told to wrap.
/// </summary>
/// <remarks>
/// <c>SetWrapMode(Wrap)</c> lets the description run on, as a card's and an expander's header do by default, and <c>SetTitleWrap(true)</c>
/// the title; text clamped to a number of lines, or set off as a quotation, is <see cref="ParagraphComponent"/>.
/// </remarks>
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
[UIComponentPropertyBlock(typeof(ITextWrapComponent))]
[UIComponentPropertyBlock(typeof(IRenamableItemsComponent))]
[UIComponentPropertyBlock(typeof(IRenamableComponent))]
[UIComponentPropertyDefault(nameof(ITextWrapModel.WrapMode), nameof(DefaultWrapMode))]
public abstract partial class TextComponent<T>(string? id = null) : TextComponentBase<T>(id), ITextMarkAlignmentComponent, ITextWrapComponent, IRenamableItemsComponent, IRenamableComponent
    where T : TextComponent<T>, IUIComponentDefinition
{
    // A text stands beside something and keeps its line, so nothing it is next to moves; a paragraph's description runs.
    private const UITextWrapMode DefaultWrapMode = UITextWrapMode.NoWrap;

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back.
    /// </summary>
    public T OnRename(string command)
        => OnRename(command, []);

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back, with UI action arguments.
    /// </summary>
    /// <remarks>Optional: the two-way title already carries the new text; this is for refusing or normalizing it.</remarks>
    public T OnRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        return On(EventNames.Rename, command, arguments);
    }

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back, with literal argument values.
    /// </summary>
    public T OnRenameLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnRename(command, UIActionArgument.Literals(arguments));

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back, passing the enclosing row's item as an argument.
    /// </summary>
    public T OnRenameWithItem(string command, string argumentName = "item")
        => OnRename(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back, passing the enclosing row's key as an argument.
    /// </summary>
    public T OnRenameWithItemKey(string command, string argumentName = "id")
        => OnRename(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked after an inline rename wrote the text's new title back, with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnRenameWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnRename(command, UIAction.ArgCurrent(argumentKind, argumentName));
}

/// <summary>
/// Text content: an optional leading icon, a title, a description and a badge, each on one line unless it is told to wrap.
/// </summary>
public sealed class TextComponent(string? id = null) : TextComponent<TextComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.text";
}
