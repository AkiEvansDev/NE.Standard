using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// Key chords: the view's own, compiled as events and effect interactions of its content, and every literal chord a control or a menu
/// entry carries, checked against the page's one registry (<c>shortcut-engine.ts</c>), which fires a chord claimed twice nowhere.
/// </summary>
internal sealed partial class UIViewCompilationContext
{
    private readonly List<UIShortcut> _shortcuts = [];
    private IVisualComponent? _content;

    public void AddShortcuts(IReadOnlyList<UIShortcut> shortcuts)
    {
        ArgumentNullException.ThrowIfNull(shortcuts);

        _shortcuts.AddRange(shortcuts);
    }

    /// <summary>
    /// Refuses a chord that names no key, one the browser keeps for itself, one in a template every row repeats, and one claimed twice
    /// where the page reads a chord page-wide with a control or the view's own among the claims; a context menu's entry acts on the
    /// row under the keyboard, so its chords are its own.
    /// </summary>
    private void ValidateShortcuts()
    {
        Dictionary<string, ShortcutClaim> claims = new(StringComparer.Ordinal);

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];
            ShortcutScope scope = ShortcutScopeOf(component.Id);

            if (component is IButtonComponent { Shortcut: string chord })
            {
                if (scope == ShortcutScope.Template)
                    throw new InvalidOperationException($"'{component.Id}' has the shortcut '{chord}' in a template, which every row repeats, so every row would claim it and none would fire; put it on the row's context menu, whose entry acts on the row under the keyboard.");

                ClaimShortcut(claims, chord, new ShortcutClaim($"'{component.Id}'", Entry: false), scope == ShortcutScope.Page);
            }

            if (component is IBindableItemsComponent items)
            {
                // The menu's own place: a context menu's entries act on the row under the keyboard, and are no page-wide claim.
                for (var j = 0; j < items.Items.Count; j++)
                {
                    if (items.Items[j] is IMenuItemModel entry)
                        ClaimMenuShortcuts(claims, component.Id, entry, scope);
                }
            }
        }

        for (var i = 0; i < _shortcuts.Count; i++)
            ClaimShortcut(claims, _shortcuts[i].Chord, new ShortcutClaim("the view's own shortcut", Entry: false), pageWide: true);
    }

    /// <summary>
    /// Where a component's chord is read: inside a context menu, by the row under the keyboard; inside a template (a row, a group
    /// header), by every copy; else page-wide. The nearest of the two wins, so a row's context menu is the menu's.
    /// </summary>
    private ShortcutScope ShortcutScopeOf(string componentId)
    {
        for (var id = componentId; id is not null; id = _parentByComponentId[id])
        {
            if (!_slotByRootComponentId.TryGetValue(id, out UIComponentSlot? slot))
                continue;

            if (slot.Kind == UIComponentSlotKind.ContextMenu)
                return ShortcutScope.ContextMenu;

            if (slot.Kind is UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant or UIComponentSlotKind.GroupTemplate)
                return ShortcutScope.Template;
        }

        return ShortcutScope.Page;
    }

    private static void ClaimShortcut(Dictionary<string, ShortcutClaim> claims, string chord, ShortcutClaim claim, bool pageWide)
    {
        var owner = claim.Owner;

        // Blank is no chord at all: the renderer writes none.
        if (string.IsNullOrWhiteSpace(chord))
            return;

        if (!UIKeyChord.TryParse(chord, out UIKeyChord parsed))
            throw new InvalidOperationException($"{owner} has the shortcut '{chord}', which names no key; write it as Ctrl+Shift+P, a letter, a digit, a sign such as / or a key's name such as Delete or F2.");

        // Refused, not warned of: the browser never raises these on a page, so the chord would fire nothing, ever.
        if (parsed.IsReservedByBrowser)
            throw new InvalidOperationException($"{owner} has the shortcut '{chord}', which the browser keeps for itself (a new, closed or restored tab or window, the next or previous tab, quitting; Ctrl is ⌘ on macOS) and never hands to a page.");

        if (!pageWide)
            return;

        if (claims.TryAdd(parsed.Key, claim))
            return;

        ShortcutClaim existing = claims[parsed.Key];

        // Two menu entries pass: a menu comes with what owns it, twice for two of them (two graphs' Save), and an entry's chord labels
        // a key its owner answers in its own focus. With a control or the view's own among them, the chord is the page's, and lost.
        if (existing.Entry && claim.Entry)
            return;

        throw new InvalidOperationException($"The shortcut '{chord}' is claimed by both {existing.Owner} and {owner}; the page fires a chord claimed twice for neither.");
    }

    private static void ClaimMenuShortcuts(Dictionary<string, ShortcutClaim> claims, string menuId, IMenuItemModel entry, ShortcutScope scope)
    {
        if (entry.Shortcut is string chord)
        {
            if (scope == ShortcutScope.Template)
                throw new InvalidOperationException($"'{menuId}' entry '{entry.Id}' has the shortcut '{chord}' in a template, which every row repeats, so every row would claim it and none would fire; put it on the row's context menu, whose entry acts on the row under the keyboard.");

            ClaimShortcut(claims, chord, new ShortcutClaim($"'{menuId}' entry '{entry.Id}'", Entry: true), scope == ShortcutScope.Page);
        }

        foreach (IMenuItemModel child in entry.Items)
            ClaimMenuShortcuts(claims, menuId, child, scope);
    }

    /// <summary>The view's chords that run a command, as events of its content.</summary>
    private void AddShortcutEvents(List<CompiledUIEvent> events, Dictionary<BindingTemplateKey, CompiledUIBindingTemplate> templatesByKey, Dictionary<string, ResolvedComponentContext> componentContexts, CompiledPath rootPath)
    {
        foreach (UIShortcut shortcut in _shortcuts)
        {
            if (shortcut.Action is not UIAction action)
                continue;

            IVisualComponent content = RequireContent();
            UIEvent shortcutEvent = new(ShortcutEventName(shortcut), action);

            EnsureCommandExists(content, shortcutEvent);

            events.Add(new CompiledUIEvent
            {
                Id = CreateEventId(),
                Address = new CompiledUIEventAddress(GetComponentId(content.Id), shortcutEvent.Name),
                Command = action.Command,
                Arguments = BuildActionArguments(content, action, templatesByKey, componentContexts, rootPath)
            });
        }
    }

    private IVisualComponent RequireContent()
        => _content ?? throw new InvalidOperationException("A view with shortcuts of its own needs a content region to raise them on.");

    /// <summary>The event a view's chord is raised as on its content: the chord as authored, its parts trimmed.</summary>
    private static string ShortcutEventName(UIShortcut shortcut)
        => EventNames.ShortcutPrefix + string.Join('+', shortcut.Chord.Split('+', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries));

    /// <summary>The view's chords that run an effect, as interactions on its content's event, with no round trip.</summary>
    private void AddShortcutInteractions(List<CompiledUIInteraction> interactions)
    {
        foreach (UIShortcut shortcut in _shortcuts)
        {
            if (shortcut.Effect is null)
                continue;

            IVisualComponent content = RequireContent();

            interactions.Add(BuildInteraction(content, new UIInteraction(content.Id, ShortcutEventName(shortcut), shortcut.Effect)));
        }
    }

    /// <summary>Who claims a chord page-wide, as the refusal names it, and whether it is a menu's entry.</summary>
    private readonly record struct ShortcutClaim(string Owner, bool Entry);

    private enum ShortcutScope
    {
        Page,
        ContextMenu,
        Template
    }
}
