using System;
using System.Collections.Concurrent;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Navigation;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// The kind of component an effect can act on: a chooser opens from a file or image input, a row is shown in a list, a rename opens in a
/// tree or a tabs view, text goes into a field the reader types into (<see cref="ICaretFieldComponent"/>). The compiler holds an interaction's effect to it and the runtime a command's, so a
/// wrong target fails where the author sees it rather than as a warning in the browser's console.
/// </summary>
/// <remarks>
/// Read by what the type is, not its key: a component derived from one (a data grid from a table) takes the same effects. The compiler
/// learns each type it meets (<see cref="Learn"/>); the runtime reads that by type key, with no lock and no reflection per command.
/// </remarks>
internal static class UIEffectTargets
{
    private static readonly ConcurrentDictionary<string, Takes> ByTypeKey = new(StringComparer.Ordinal);
    private static readonly ConcurrentDictionary<Type, Takes> ByType = new();

    [Flags]
    private enum Takes
    {
        None = 0,
        Picker = 1,
        Rows = 2,
        NodeRename = 4,
        TabRename = 8,
        Text = 16
    }

    /// <summary>
    /// Learns what effects a component's type takes, once per type, for the runtime to read by its key; refuses a second type under the
    /// key that takes other effects, which the key could not tell apart.
    /// </summary>
    public static void Learn(IVisualComponent component)
    {
        ArgumentNullException.ThrowIfNull(component);

        Type type = component.GetType();
        Takes takes = ByType.GetOrAdd(type, TakesOf);
        Takes known = ByTypeKey.GetOrAdd(component.TypeKey, takes);

        // Equal flags agree (a grid over other rows); differing ones would hold one type's effects to the other's.
        if (known != takes)
            throw new InvalidOperationException($"Type key '{component.TypeKey}' names component types that take different effects, '{type.Name}' among them; give each type a key of its own.");
    }

    /// <summary>
    /// Refuses <paramref name="effect"/> aimed at a component of a kind it cannot act on; any other effect passes, and so does a type the
    /// compiler never met, which no view holds.
    /// </summary>
    public static void EnsureFits(ClientEffect effect, string componentId, string typeKey)
    {
        ArgumentNullException.ThrowIfNull(effect);

        if (!ByTypeKey.TryGetValue(typeKey, out Takes takes))
            return;

        var needs = effect switch
        {
            OpenPickerEffect when !takes.HasFlag(Takes.Picker) => "a file or an image input, whose chooser it opens",
            ScrollToItemEffect when !takes.HasFlag(Takes.Rows) => "a list, a table or a tree, whose row it shows",
            RenameNodeEffect when !takes.HasFlag(Takes.NodeRename) => "a tree, whose node it renames",
            RenameTabEffect when !takes.HasFlag(Takes.TabRename) => "a tabs view, whose caption it renames",
            InsertTextEffect when !takes.HasFlag(Takes.Text) => "a field the reader types into (ICaretFieldComponent), whose caret it inserts at",
            _ => null
        };

        if (needs is not null)
            throw new InvalidOperationException($"Client effect kind '{effect.Kind}' names '{componentId}' ({typeKey}), but it acts on {needs}.");
    }

    private static Takes TakesOf(Type type)
    {
        Takes takes = Takes.None;

        if (DerivesFrom(type, typeof(FileInputComponent<>)) || DerivesFrom(type, typeof(ImageInputComponent<>)))
            takes |= Takes.Picker;

        if (typeof(IItemsComponent).IsAssignableFrom(type))
            takes |= Takes.Rows;

        if (DerivesFrom(type, typeof(TreeComponent<>)))
            takes |= Takes.NodeRename;

        if (DerivesFrom(type, typeof(TabsViewComponent<>)))
            takes |= Takes.TabRename;

        if (typeof(ICaretFieldComponent).IsAssignableFrom(type))
            takes |= Takes.Text;

        return takes;
    }

    private static bool DerivesFrom(Type type, Type genericBase)
    {
        for (Type? current = type; current is not null; current = current.BaseType)
        {
            if (current.IsGenericType && current.GetGenericTypeDefinition() == genericBase)
                return true;
        }

        return false;
    }
}
