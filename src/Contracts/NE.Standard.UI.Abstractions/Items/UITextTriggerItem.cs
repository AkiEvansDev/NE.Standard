using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// One suggestion in a text field's trigger popup: a leaf item that inserts text at the caret, or a category item that steps into a
/// second-level list (either its own <see cref="Items"/> on the client or a server list loaded via <see cref="LoadsFromServer"/>).
/// </summary>
public sealed record UITextTriggerItem
{
    /// <summary>
    /// Creates a trigger suggestion from its key and title.
    /// </summary>
    public UITextTriggerItem(string id, string title, string? description = null, string? icon = null, string? badge = null, string? insertText = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        Id = id;
        Title = title;
        Description = description;
        Icon = icon;
        Badge = badge;
        InsertText = insertText;
    }

    /// <summary>
    /// Gets the item's key — sent to <c>OnTriggerSelect</c> when a leaf is chosen, or as the <c>scope</c> argument to
    /// <c>OnTriggerSearch</c> when a category is chosen.
    /// </summary>
    public string Id { get; }

    /// <summary>
    /// Gets the primary label shown in the popup and matched by client-side filtering.
    /// </summary>
    public string Title { get; }

    /// <summary>
    /// Gets the secondary description shown beside or below the title.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Description { get; init; }

    /// <summary>
    /// Gets the glyph name (<c>UIGlyphs</c>) drawn before the title.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Icon { get; init; }

    /// <summary>
    /// Gets the short tag drawn at the trailing edge of the row.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Badge { get; init; }

    /// <summary>
    /// Gets the text inserted in place of the active <c>trigger + query</c> token when this leaf is chosen; <see langword="null"/>
    /// inserts <c>"{trigger}{Title} "</c>.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? InsertText { get; init; }

    /// <summary>
    /// Gets the trigger prefix (such as <c>@</c> or <c>/</c>) this item belongs to; <see langword="null"/> offers it under every trigger
    /// on the field.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Trigger { get; init; }

    /// <summary>
    /// Gets the category scope id this item belongs to when returned from the server; <see langword="null"/> places it at the root or in
    /// the currently active server scope.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Scope { get; init; }

    /// <summary>
    /// Gets whether choosing this item steps into a second-level scope (<see cref="Id"/>) and queries the server
    /// (<c>OnTriggerSearch</c>) for its options instead of inserting text.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool LoadsFromServer { get; init; }

    /// <summary>
    /// Gets the second-level options shown and filtered on the client when this category item is chosen.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<UITextTriggerItem>? Items { get; init; }
}
