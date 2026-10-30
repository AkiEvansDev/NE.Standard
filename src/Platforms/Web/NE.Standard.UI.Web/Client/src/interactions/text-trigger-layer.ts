// Token parsing, matching, layer synchronization, and option rendering helpers for `TextTriggerEngine`.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ActiveAttribute, BadgeClass, BadgeTitleClass, BadgeVariantInfoClass, ComponentKeyAttribute, ensureElementId,
    ListKeyboardAttribute, PointerFocusAttribute, SearchWaitingAttribute, SelectListClass, SelectListIdPrefix,
    SelectOptionClass, SelectOptionIdPrefix, SelectPopupClass, TextBadgeClass, TextBodyClass, TextDescriptionClass,
    TextHeaderClass, TextIconClass, TextTitleClass, TextTypeOverlineClass, TriggerItemsAttribute, TriggerLayerClass,
    TriggersAttribute, TriggerSearchAttribute, TriggerTokenClass
} from "../addressing/dom-attributes.ts";
import { PendingDelayMilliseconds } from "../events/pending-mark.ts";
import { stripTriggerTokenPadding, TriggerTokenPad } from "../extensions/value-readers.ts";
import { applyIconValue } from "../rendering/icon-value.ts";
import { writeBadgeWords } from "../rendering/web-dom-converters.ts";
import { isCaretField } from "./caret-fields.ts";
import { foldWords, matchesTerms, searchTerms } from "./search-terms.ts";

export const TriggerOwnerSelector = `[${TriggersAttribute}]`;
const TokenBoundaryAfter = /^[\s.,!?;:)\]}]$/;

export type TextTriggerConfig = {
    readonly prefix: string;
    readonly startOfLineOnly?: boolean;
    readonly loadsFromServer?: boolean;
};

export type TextTriggerItem = {
    readonly id: string;
    readonly title: string;
    readonly description?: string | null;
    readonly icon?: string | null;
    readonly badge?: string | null;
    readonly insertText?: string | null;
    readonly trigger?: string | null;
    readonly scope?: string | null;
    readonly loadsFromServer?: boolean;
    readonly items?: readonly TextTriggerItem[] | null;
};

export type ActiveTriggerToken = {
    readonly trigger: TextTriggerConfig;
    readonly start: number;
    readonly end: number;
    readonly query: string;
};

export type KnownTriggerToken = {
    readonly tokenText: string;
    readonly trigger: string;
    readonly scope: string;
    readonly id: string;
};

export type TriggerTokenMatch = {
    readonly start: number;
    readonly end: number;
    readonly deleteEnd: number;
    readonly text: string;
    readonly trigger: string;
    readonly scope: string;
    readonly id: string;
};

export type TriggerEventDetail = {
    readonly trigger: string;
    readonly scope: string;
    readonly value: string;
};

export type OwnerTriggerState = {
    triggers: readonly TextTriggerConfig[];
    rootItems: readonly TextTriggerItem[];
    latestItems: readonly TextTriggerItem[];
    serverScopeItems: readonly TextTriggerItem[] | null;
    serverTriggerItems: Map<string, readonly TextTriggerItem[]>;
    knownTokens: Map<string, KnownTriggerToken>;
    scope: string;
    scopeItem: TextTriggerItem | null;
    activeTrigger: string;
    lastAskedKey: string;
    dismissedStart: number;
    popup: HTMLElement | null;
    layer: HTMLElement | null;
    renderedLayerValue: string | null;
    renderedItems: Map<string, TextTriggerItem>;
};

type TriggerWait = { asked: number; timer: number | null };

const waits = new WeakMap<Element, TriggerWait>();

/** Appends `[trigger, scope, value]` after the component's own dynamic parameters for `UIAction.ArgEventValue(0..2)`. */
export function triggerEventParameters(detail: TriggerEventDetail | null | undefined, componentParameters: readonly unknown[]): readonly unknown[] | null {
    return detail !== null && detail !== undefined && typeof detail.trigger === "string" && typeof detail.scope === "string" && typeof detail.value === "string"
        ? [...componentParameters, detail.trigger, detail.scope, detail.value]
        : null;
}

/** Finds the active trigger token immediately before `caret`, or `null` when the caret is not inside a trigger token. */
export function findActiveTriggerToken(text: string, caret: number, triggers: readonly TextTriggerConfig[]): ActiveTriggerToken | null {
    if (caret < 0 || caret > text.length || triggers.length === 0)
        return null;

    let tokenStart = caret;

    while (tokenStart > 0 && !/\s/.test(text[tokenStart - 1] ?? ""))
        tokenStart--;

    const token = text.slice(tokenStart, caret);

    if (token.length === 0)
        return null;

    const ordered = [...triggers].sort((left, right) => right.prefix.length - left.prefix.length);

    for (const trigger of ordered) {
        if (trigger.prefix.length === 0 || !token.startsWith(trigger.prefix))
            continue;

        if (trigger.startOfLineOnly === true && !isStartOfLine(text, tokenStart))
            continue;

        return {
            trigger,
            start: tokenStart,
            end: caret,
            query: token.slice(trigger.prefix.length)
        };
    }

    return null;
}

function isStartOfLine(text: string, index: number): boolean {
    for (let pos = index - 1; pos >= 0; pos--) {
        const ch = text[pos];

        if (ch === "\n" || ch === "\r")
            return true;

        if (ch !== " " && ch !== "\t" && ch !== TriggerTokenPad)
            return false;
    }

    return true;
}

/** Whether an item represents a category that opens a 2nd-level suggestion list rather than inserting text immediately. */
export function isCategoryTriggerItem(item: TextTriggerItem): boolean {
    return (Array.isArray(item.items) && item.items.length > 0) || item.loadsFromServer === true;
}

/** Narrows `items` to those matching `query` by title, description or badge. */
export function filterTriggerItems(items: readonly TextTriggerItem[], query: string, context: Element): TextTriggerItem[] {
    const terms = searchTerms(query, context);

    if (terms.length === 0)
        return [...items];

    return items.filter(item => {
        const haystack = foldWords(`${item.title} ${item.description ?? ""} ${item.badge ?? ""}`, context);

        return matchesTerms(haystack, terms);
    });
}

/** Collects leaf trigger items that insert a trigger-prefixed token (such as `@Grace Kim`) into `target`. */
export function collectKnownTriggerTokens(
    triggers: readonly TextTriggerConfig[],
    items: readonly TextTriggerItem[],
    target: Map<string, KnownTriggerToken>,
    parentScope = "",
    parentTrigger = ""
): void {
    for (const item of items) {
        const itemTrigger = typeof item.trigger === "string" && item.trigger.length > 0 ? item.trigger : parentTrigger;

        if (isCategoryTriggerItem(item)) {
            if (Array.isArray(item.items) && item.items.length > 0)
                collectKnownTriggerTokens(triggers, item.items, target, item.id, itemTrigger);

            continue;
        }

        const matchingTriggers = itemTrigger.length > 0
            ? triggers.filter(trigger => trigger.prefix === itemTrigger)
            : triggers;

        for (const trigger of matchingTriggers) {
            const tokenText = resolveTokenText(trigger.prefix, item);

            if (tokenText.startsWith(trigger.prefix) && tokenText.length > trigger.prefix.length) {
                target.set(tokenText, {
                    tokenText,
                    trigger: trigger.prefix,
                    scope: typeof item.scope === "string" && item.scope.length > 0 ? item.scope : parentScope,
                    id: item.id
                });
            }
        }
    }
}

export function resolveTokenText(prefix: string, item: TextTriggerItem): string {
    return typeof item.insertText === "string" && item.insertText.trim().length > 0
        ? item.insertText.trimEnd()
        : `${prefix}${item.title}`;
}

/** Finds all completed trigger tokens in `text` from `knownTokens`, longest match first at each word boundary. */
export function findTriggerTokens(
    text: string,
    triggers: readonly TextTriggerConfig[],
    knownTokens: ReadonlyMap<string, KnownTriggerToken>
): TriggerTokenMatch[] {
    if (text.length === 0 || triggers.length === 0 || knownTokens.size === 0)
        return [];

    const ordered = [...knownTokens.values()].sort((left, right) => right.tokenText.length - left.tokenText.length);
    const triggerByPrefix = new Map<string, TextTriggerConfig>(triggers.map(trigger => [trigger.prefix, trigger]));
    const matches: TriggerTokenMatch[] = [];

    for (let index = 0; index < text.length; index++) {
        if (text[index] === TriggerTokenPad)
            continue;

        const start = index > 0 && text[index - 1] === TriggerTokenPad ? index - 1 : index;

        if (start > 0 && !/\s/.test(text[start - 1] ?? ""))
            continue;

        for (const known of ordered) {
            if (!text.startsWith(known.tokenText, index))
                continue;

            const triggerConfig = triggerByPrefix.get(known.trigger);

            if (triggerConfig?.startOfLineOnly === true && !isStartOfLine(text, start))
                continue;

            const rawEnd = index + known.tokenText.length;
            const end = text[rawEnd] === TriggerTokenPad ? rawEnd + 1 : rawEnd;
            const nextChar = text[end];

            if (nextChar !== undefined && !TokenBoundaryAfter.test(nextChar))
                continue;

            const deleteEnd = nextChar === " " ? end + 1 : end;

            matches.push({
                start,
                end,
                deleteEnd,
                text: text.slice(start, end),
                trigger: known.trigger,
                scope: known.scope,
                id: known.id
            });
            index = end - 1;
            break;
        }
    }

    return matches;
}

export function ensureTokenPadding(field: HTMLInputElement | HTMLTextAreaElement, state: OwnerTriggerState): void {
    const raw = field.value;

    if (raw.length === 0)
        return;

    const clean = stripTriggerTokenPadding(raw);
    const cleanMatches = findTriggerTokens(clean, state.triggers, state.knownTokens);

    let target = "";

    if (cleanMatches.length === 0) {
        target = clean;
    }
    else {
        let cursor = 0;

        for (const match of cleanMatches) {
            if (match.start > cursor)
                target += clean.slice(cursor, match.start);

            target += `${TriggerTokenPad}${match.text}${TriggerTokenPad}`;
            cursor = match.end;
        }

        if (cursor < clean.length)
            target += clean.slice(cursor);
    }

    if (target === raw)
        return;

    const selStart = field.selectionStart;
    const selEnd = field.selectionEnd;

    field.value = target;

    if (typeof selStart === "number" && typeof selEnd === "number") {
        const nextStart = mapIndexToPadded(raw, cleanMatches, selStart);
        const nextEnd = selEnd === selStart ? nextStart : mapIndexToPadded(raw, cleanMatches, selEnd);

        if (document.activeElement === field || (field as { selection?: unknown }).selection !== undefined) {
            try {
                field.setSelectionRange?.(nextStart, nextEnd);
            }
            catch {
                // Input type does not support selection range.
            }
        }
    }
}

function mapIndexToPadded(raw: string, cleanMatches: readonly TriggerTokenMatch[], rawIndex: number): number {
    let cleanIndex = 0;
    const clamped = Math.max(0, Math.min(raw.length, rawIndex));

    for (let i = 0; i < clamped; i++) {
        if (raw[i] !== TriggerTokenPad)
            cleanIndex++;
    }

    let padCount = 0;

    for (const match of cleanMatches) {
        if (cleanIndex > match.start)
            padCount++;

        if (cleanIndex >= match.end)
            padCount++;
    }

    return cleanIndex + padCount;
}

export function findTokenElementAtPoint(layer: HTMLElement, clientX: number, clientY: number): HTMLElement | null {
    for (const tokenEl of layer.querySelectorAll<HTMLElement>(`.${TriggerTokenClass}`)) {
        const rect = tokenEl.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0 && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom)
            return tokenEl;
    }

    return null;
}

export function syncLayerMetrics(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, layer: HTMLElement): void {
    const ownerRect = owner.getBoundingClientRect();
    const fieldRect = field.getBoundingClientRect();
    const borderLeft = field.clientLeft ?? 0;
    const borderTop = field.clientTop ?? 0;
    const width = field.clientWidth > 0 ? field.clientWidth : fieldRect.width;
    const height = field.clientHeight > 0 ? field.clientHeight : fieldRect.height;

    layer.style.left = `${fieldRect.left - ownerRect.left + borderLeft}px`;
    layer.style.top = `${fieldRect.top - ownerRect.top + borderTop}px`;
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;

    if (typeof window !== "undefined" && typeof window.getComputedStyle === "function") {
        const computed = window.getComputedStyle(field);
        layer.style.paddingTop = computed.paddingTop ?? "";
        layer.style.paddingRight = computed.paddingRight ?? "";
        layer.style.paddingBottom = computed.paddingBottom ?? "";
        layer.style.paddingLeft = computed.paddingLeft ?? "";
        layer.style.font = computed.font ?? "";
        layer.style.letterSpacing = computed.letterSpacing ?? "";
        layer.style.lineHeight = computed.lineHeight ?? "";
        layer.style.textAlign = computed.textAlign ?? "";
    }

    layer.scrollTop = field.scrollTop;
    layer.scrollLeft = field.scrollLeft;
}

export function ensureLayer(owner: HTMLElement, state: OwnerTriggerState): HTMLElement {
    if (state.layer !== null && state.layer.parentElement === owner)
        return state.layer;

    const layer = document.createElement("div");
    layer.className = TriggerLayerClass;
    layer.setAttribute("aria-hidden", "true");
    owner.appendChild(layer);
    state.layer = layer;

    return layer;
}

export function ensurePopup(owner: HTMLElement, state: OwnerTriggerState): HTMLElement {
    if (state.popup !== null && state.popup.parentElement === owner)
        return state.popup;

    const popup = document.createElement("div");
    popup.className = `${SelectPopupClass} ${SelectListClass}`;
    popup.setAttribute("role", "listbox");
    ensureElementId(popup, SelectListIdPrefix);
    owner.appendChild(popup);
    state.popup = popup;

    return popup;
}

export function setActiveOption(popup: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement | null, active: HTMLElement | null, keyboard: boolean): void {
    for (const option of optionsOf(popup)) {
        const isCurrent = option === active;
        option.toggleAttribute(ActiveAttribute, isCurrent);
        option.toggleAttribute(PointerFocusAttribute, isCurrent && !keyboard);
        if (field !== null && isCurrent)
            field.setAttribute("aria-activedescendant", ensureElementId(option, SelectOptionIdPrefix));
    }

    popup.toggleAttribute(ListKeyboardAttribute, keyboard && active !== null);
    if (field !== null && active === null)
        field.removeAttribute("aria-activedescendant");
}

export function optionsOf(popup: HTMLElement): HTMLElement[] {
    return Array.from(popup.querySelectorAll<HTMLElement>(`:scope > .${SelectOptionClass}`));
}

export function currentOption(options: readonly HTMLElement[]): HTMLElement | null {
    return options.find(option => option.hasAttribute(ActiveAttribute)) ?? options[0] ?? null;
}

export function createInitialTriggerState(owner: HTMLElement): OwnerTriggerState {
    const triggers = parseTriggers(owner.getAttribute(TriggersAttribute));
    const items = parseTriggerItems(owner.getAttribute(TriggerItemsAttribute));
    const knownTokens = new Map<string, KnownTriggerToken>();
    collectKnownTriggerTokens(triggers, items, knownTokens);

    return {
        triggers,
        rootItems: items,
        latestItems: items,
        serverScopeItems: null,
        serverTriggerItems: new Map(),
        knownTokens,
        scope: "",
        scopeItem: null,
        activeTrigger: "",
        lastAskedKey: "",
        dismissedStart: -1,
        popup: null,
        layer: null,
        renderedLayerValue: null,
        renderedItems: new Map()
    };
}

export function resolveFieldAndOwner(target: EventTarget | null): { owner: HTMLElement; field: HTMLInputElement | HTMLTextAreaElement } | null {
    if (!isCaretField(target))
        return null;

    const owner = target.closest<HTMLElement>(TriggerOwnerSelector);

    return owner === null ? null : { owner, field: target };
}

export function fieldOf(owner: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
    const candidate = owner.querySelector("input, textarea");

    return isCaretField(candidate) ? candidate : null;
}

export function resolveVisibleItems(owner: HTMLElement, state: OwnerTriggerState, token: ActiveTriggerToken, serverBacked: boolean): readonly TextTriggerItem[] {
    if (state.scope.length > 0) {
        if (state.scopeItem !== null && Array.isArray(state.scopeItem.items) && state.scopeItem.items.length > 0)
            return filterTriggerItems(state.scopeItem.items, token.query, owner);

        const scopedFromRoot = state.latestItems.filter(item => item.scope === state.scope);
        const source = state.serverScopeItems ?? (scopedFromRoot.length > 0 ? scopedFromRoot : []);

        return serverBacked && owner.hasAttribute(TriggerSearchAttribute)
            ? source
            : filterTriggerItems(source, token.query, owner);
    }

    const serverAnswered = token.trigger.loadsFromServer === true && owner.hasAttribute(TriggerSearchAttribute)
        ? state.serverTriggerItems.get(token.trigger.prefix)
        : undefined;
    const baseSource = serverAnswered ?? (state.rootItems.length > 0 ? state.rootItems : state.latestItems);
    const allowUntagged = serverAnswered !== undefined || state.triggers.length <= 1 || token.trigger.loadsFromServer !== true;
    const forTrigger = baseSource.filter(item =>
        ((allowUntagged && (item.trigger === undefined || item.trigger === null || item.trigger.length === 0)) || item.trigger === token.trigger.prefix)
        && (item.scope === undefined || item.scope === null || item.scope.length === 0)
    );

    return serverBacked && owner.hasAttribute(TriggerSearchAttribute) && !forTrigger.some(isCategoryTriggerItem)
        ? forTrigger
        : filterTriggerItems(forTrigger, token.query, owner);
}

export function replaceFieldRange(field: HTMLInputElement | HTMLTextAreaElement, start: number, end: number, replacement: string): void {
    field.focus();

    if (typeof field.setRangeText === "function") {
        field.setRangeText(replacement, start, end, "end");
    }
    else {
        const before = field.value.slice(0, start);
        const after = field.value.slice(end);
        const nextCaret = start + replacement.length;
        field.value = before + replacement + after;
        field.setSelectionRange?.(nextCaret, nextCaret);
    }

    field.dispatchEvent(new Event("input", { bubbles: true }));
}

export function createTriggerOption(item: TextTriggerItem): HTMLElement {
    const option = document.createElement("div");
    option.className = SelectOptionClass;
    option.setAttribute("role", "option");
    option.setAttribute("tabindex", "-1");
    option.setAttribute(ComponentKeyAttribute, item.id);
    ensureElementId(option, SelectOptionIdPrefix);

    if (typeof item.icon === "string" && item.icon.trim().length > 0) {
        const icon = document.createElement("span");
        icon.className = TextIconClass;
        applyIconValue(icon, item.icon);
        option.appendChild(icon);
    }

    const body = document.createElement("div");
    body.className = TextBodyClass;

    const header = document.createElement("div");
    header.className = TextHeaderClass;

    const title = document.createElement("span");
    title.className = TextTitleClass;
    title.textContent = item.title;
    header.appendChild(title);

    if (typeof item.badge === "string" && item.badge.trim().length > 0) {
        const badge = document.createElement("span");
        badge.className = `${TextBadgeClass} ${BadgeClass} ${BadgeVariantInfoClass} ${TextTypeOverlineClass}`;
        writeBadgeWords(badge, item.badge);

        const badgeTitle = document.createElement("span");
        badgeTitle.className = BadgeTitleClass;
        badgeTitle.textContent = item.badge;
        badge.appendChild(badgeTitle);
        header.appendChild(badge);
    }

    body.appendChild(header);

    if (typeof item.description === "string" && item.description.trim().length > 0) {
        const description = document.createElement("span");
        description.className = TextDescriptionClass;
        description.textContent = item.description;
        body.appendChild(description);
    }

    option.appendChild(body);

    return option;
}

export function parseTriggers(raw: string | null): readonly TextTriggerConfig[] {
    if (raw === null || raw.trim().length === 0)
        return [];

    try {
        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed))
            return [];

        return parsed.filter((entry): entry is TextTriggerConfig =>
            typeof entry === "object"
            && entry !== null
            && typeof (entry as { prefix?: unknown }).prefix === "string"
            && ((entry as { prefix: string }).prefix.length > 0)
        );
    }
    catch {
        return [];
    }
}

export function parseTriggerItems(raw: string | null): readonly TextTriggerItem[] {
    if (raw === null || raw.trim().length === 0)
        return [];

    try {
        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed))
            return [];

        return parsed.filter((entry): entry is TextTriggerItem =>
            typeof entry === "object"
            && entry !== null
            && typeof (entry as { id?: unknown }).id === "string"
            && typeof (entry as { title?: unknown }).title === "string"
        );
    }
    catch {
        return [];
    }
}

export function awaitTriggerAnswer(target: EventTarget | null): void {
    if (!(target instanceof Element))
        return;

    const owner = target.closest<HTMLElement>(TriggerOwnerSelector);

    if (owner === null)
        return;

    const wait = waits.get(owner) ?? { asked: 0, timer: null };
    waits.set(owner, wait);

    if (wait.asked++ > 0)
        return;

    const popup = owner.querySelector<HTMLElement>(`:scope > .${SelectPopupClass}`);
    popup?.setAttribute("aria-busy", "true");

    wait.timer = window.setTimeout(() => {
        wait.timer = null;
        owner.setAttribute(SearchWaitingAttribute, "");
    }, PendingDelayMilliseconds);
}

export function settleTriggerAnswer(target: EventTarget | null): void {
    if (!(target instanceof Element))
        return;

    const owner = target.closest<HTMLElement>(TriggerOwnerSelector);

    if (owner === null)
        return;

    const wait = waits.get(owner);

    if (wait === undefined || --wait.asked > 0)
        return;

    waits.delete(owner);

    if (wait.timer !== null)
        window.clearTimeout(wait.timer);

    const popup = owner.querySelector<HTMLElement>(`:scope > .${SelectPopupClass}`);
    popup?.removeAttribute("aria-busy");
    owner.removeAttribute(SearchWaitingAttribute);
}
