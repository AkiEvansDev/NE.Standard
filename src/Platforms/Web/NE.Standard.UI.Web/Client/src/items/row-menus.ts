// A row's own context menu, drawn into its owner when it is wanted — opened, pressed by an entry's chord, shown as the row's action
// bar — rather than into every row as it is built: in a feed it was two thirds of a row's markup and most of its bindings. The server
// leaves it in an inert template (`data-ui-context-menu-template`, the owner's id) and marks the owner (`data-ui-context-menu-later`).
// A row template's one is taken out of the row template once, before any row is cloned from it, and stands in the page beside the
// outermost template, so no row clones it and a language switch still rewrites its words; a row the server drew keeps its own,
// painted with its values, and moves it in. The menu's collections addressed to a row meanwhile are held (`HeldCollections`), and
// the menu is drawn with them; drawn, it stays while its row does, as one drawn with the row did.

// `node --test` loads this module as it is: `.ts` on the value imports, `import type` on the rest.
import { ComponentSelector, ContextMenuLaterAttribute, ContextMenuTemplateAttribute, ItemsHostAttribute, ShortcutAttribute } from "../addressing/dom-attributes.ts";
import { findOwningComponentId, readComponentId } from "../addressing/dom-registry.ts";
import { forEachSubtree } from "../runtime/client-strings.ts";
import { logWarn } from "../runtime/logger.ts";
import { tryReadItemProperty } from "./binding-template-evaluator.ts";
import type { HeldRow } from "./held-collections";

const MenuTemplateSelector = `template[${ContextMenuTemplateAttribute}]`;
const OwnMenuTemplateSelector = `:scope > ${MenuTemplateSelector}`;

export type RowMenusOptions = {
    readonly root: ParentNode;
    /** Clones a waiting menu's template against the item scopes its owner stands in (`ItemsTemplateRenderer.renderPart`). */
    readonly render: (template: HTMLTemplateElement, owner: Element) => Element | null;
    /** A menu just drawn into its owner: its collections drawn from what is held for them, and the page's index told. */
    readonly drawn: (menu: Element) => void;
    /** Every held row with its component, for the chords a waiting menu's bound entries carry. */
    readonly heldRows: (visit: (componentId: number, row: HeldRow) => void) => void;
};

export class RowMenus {
    private readonly options: RowMenusOptions;

    // A row template's waiting menu, by its owner's component id: one for every row built from that template.
    private readonly shared = new Map<number, HTMLTemplateElement>();
    // The components a waiting menu declares, with the items components whose rows its owner stands in, outermost first.
    private readonly components = new Map<number, readonly number[]>();
    // The waiting menu each of those components stands in, by its owner's id: two menus in one row hold entries keyed alike.
    private readonly menuOf = new Map<number, number>();
    // The owners whose menu's components are known: every row's copy of one declares the same.
    private readonly declared = new Set<number>();
    // The templates taken in already: one taken out of its row template stands beside it then, among rows it no longer stands in.
    private readonly taken = new WeakSet<HTMLTemplateElement>();
    // The chords a waiting menu's entries carry as written: a static entry's.
    private readonly writtenChords = new Set<string>();

    private scanned = false;
    // Bumped as a held row changes, so the chords are read again.
    private heldVersion = 0;
    private chordsVersion = -1;
    private readonly chordSet = new Set<string>();

    public constructor(options: RowMenusOptions) {
        this.options = options;
    }

    /**
     * Takes every waiting menu out of the page's row templates before a row is cloned from one, and learns what the menus declare;
     * once, and again where an owner finds no menu (content the page took in since).
     */
    public scan(): void {
        if (this.scanned)
            return;

        this.scanned = true;
        this.scanContainer(this.options.root, [], null);
    }

    /** Whether a component stands in a waiting menu, whose collections addressed to a row are held for it. */
    public holds(componentId: number): boolean {
        this.scan();

        return this.components.has(componentId);
    }

    /** Whether two components stand in one waiting menu: a patch to an entry's part is its list's entry's. */
    public inOneMenu(componentId: number, otherComponentId: number): boolean {
        this.scan();

        const menu = this.menuOf.get(componentId);

        return menu !== undefined && menu === this.menuOf.get(otherComponentId);
    }

    /** The components of the waiting menu a component stands in, itself among them; none for one in no waiting menu. */
    public menuComponentsOf(componentId: number): number[] {
        this.scan();

        const menu = this.menuOf.get(componentId);
        const components: number[] = [];

        if (menu === undefined)
            return components;

        for (const [component, owner] of this.menuOf) {
            if (owner === menu)
                components.push(component);
        }

        return components;
    }

    /** Whether a waiting menu's component stands in the rows of `hostComponentId`, so goes with them. */
    public standsInRowsOf(componentId: number, hostComponentId: number): boolean {
        this.scan();

        return this.components.get(componentId)?.includes(hostComponentId) === true;
    }

    /** A held row changed: the chords are read again. */
    public heldChanged(): void {
        this.heldVersion++;
    }

    /** What the chords' version stands at, so a registry built on them knows to read them again. */
    public get version(): number {
        return this.heldVersion;
    }

    /** The chords the waiting menus' entries carry, written or bound: a key none names never asks a menu to be drawn. */
    public chords(): ReadonlySet<string> {
        this.scan();

        if (this.chordsVersion === this.heldVersion)
            return this.chordSet;

        this.chordsVersion = this.heldVersion;
        this.chordSet.clear();

        for (const chord of this.writtenChords)
            this.chordSet.add(chord);

        this.options.heldRows((componentId, row) => {
            if (this.components.has(componentId))
                addItemChords(row.item, this.chordSet);
        });

        return this.chordSet;
    }

    /** Draws the owner's waiting menu into it and answers it; null where the owner has none waiting. */
    public draw(owner: HTMLElement): HTMLElement | null {
        if (!owner.hasAttribute(ContextMenuLaterAttribute))
            return null;

        this.scan();

        const menu = this.drawFrom(owner) ?? this.drawAfterRescan(owner);

        // Asked once: a menu that cannot be drawn is not looked for at every press.
        owner.removeAttribute(ContextMenuLaterAttribute);

        if (menu === null) {
            logWarn("a row's context menu waits in no template.", { owner });
            return null;
        }

        this.options.drawn(menu);

        return menu as HTMLElement;
    }

    private drawAfterRescan(owner: HTMLElement): Element | null {
        this.scanned = false;
        this.scan();

        return this.drawFrom(owner);
    }

    private drawFrom(owner: HTMLElement): Element | null {
        // A row the server drew holds its own, painted with its values: moved in where it waits, the owner's last child.
        const own = owner.querySelector<HTMLTemplateElement>(OwnMenuTemplateSelector);

        if (own !== null) {
            const menu = own.content.firstElementChild;

            own.replaceWith(own.content);

            return menu;
        }

        const template = this.shared.get(readComponentId(owner));
        const menu = template === undefined ? null : this.options.render(template, owner);

        if (menu !== null)
            owner.appendChild(menu);

        return menu;
    }

    /** Every template under `container`: a waiting menu is taken in, any other is looked into as what its component's rows declare. */
    private scanContainer(container: ParentNode, hosts: readonly number[], outermost: HTMLTemplateElement | null): void {
        for (const template of [...container.querySelectorAll<HTMLTemplateElement>("template")]) {
            if (this.taken.has(template))
                continue;

            const above = [...hosts, ...rowHostsAbove(template)];

            if (template.hasAttribute(ContextMenuTemplateAttribute)) {
                this.takeMenu(template, above, outermost);
                continue;
            }

            // A row's template, an empty state's or a group's: what it declares stands in the rows of the component it is under.
            const host = template.parentElement === null ? 0 : readComponentId(template.parentElement);

            this.scanContainer(template.content, host > 0 ? [...above, host] : above, outermost ?? template);
        }
    }

    private takeMenu(template: HTMLTemplateElement, hosts: readonly number[], outermost: HTMLTemplateElement | null): void {
        const ownerId = Number(template.getAttribute(ContextMenuTemplateAttribute));
        const declares = !this.declared.has(ownerId);

        this.taken.add(template);
        this.declared.add(ownerId);

        // A drawn row's own entries may carry chords of their own (painted from its item); the components are its template's.
        forEachSubtree(template.content, subtree => {
            if (declares) {
                for (const element of subtree.querySelectorAll(ComponentSelector)) {
                    this.components.set(readComponentId(element), hosts);
                    this.menuOf.set(readComponentId(element), ownerId);
                }
            }

            for (const element of subtree.querySelectorAll(`[${ShortcutAttribute}]`)) {
                const chord = element.getAttribute(ShortcutAttribute)?.trim() ?? "";

                if (chord.length > 0)
                    this.writtenChords.add(chord);
            }
        });

        // A drawn row's own stays in its owner, for that row alone.
        if (template.parentElement?.hasAttribute(ContextMenuLaterAttribute) === true && outermost === null)
            return;

        // Out of the row template, beside the outermost one on the page: no row clones it, and a language switch reaches its words.
        if (outermost !== null)
            outermost.after(template);

        if (Number.isInteger(ownerId) && ownerId > 0)
            this.shared.set(ownerId, template);
    }
}

/** The items components whose rows an element stands in within its own tree, outermost first. */
function rowHostsAbove(element: Element): number[] {
    const hosts: number[] = [];

    for (let host = element.parentElement?.closest(`[${ItemsHostAttribute}]`) ?? null; host !== null; host = host.parentElement?.closest(`[${ItemsHostAttribute}]`) ?? null) {
        const componentId = findOwningComponentId(host);

        if (componentId !== null)
            hosts.unshift(componentId);
    }

    return hosts;
}

/** A held entry's chord, and its sub-entries' — a submenu's entry presses as well. */
function addItemChords(item: unknown, chords: Set<string>): void {
    const shortcut = tryReadItemProperty(item, "Shortcut");

    if (shortcut.ok && typeof shortcut.value === "string" && shortcut.value.trim().length > 0)
        chords.add(shortcut.value.trim());

    const items = tryReadItemProperty(item, "Items");

    if (items.ok && Array.isArray(items.value)) {
        for (const child of items.value)
            addItemChords(child, chords);
    }
}
