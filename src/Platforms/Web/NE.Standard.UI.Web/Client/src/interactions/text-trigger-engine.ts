// Inline trigger suggestions (`@`, `/`) for a text input or text area (`ITextEntryInputComponent`): typing a trigger prefix at the
// start of a word (or start of a line when `startOfLineOnly` is set) opens an anchored suggestion listbox while the caret stays in
// the field. Selecting a category item (`items` or `loadsFromServer`) switches the popup into that category's 2nd-level scope —
// narrowing its child `items` on the client or raising `trigger-search` for the server to populate `TriggerItems` — while selecting
// a leaf item inserts its text in place of the `@query` token and raises `trigger-select`. Completed trigger tokens in the field
// render a pill in `.ui-text-trigger__layer`, step up on hover, delete as a whole on Backspace/Delete, and raise `trigger-click`
// when `OnTriggerClick` is registered.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ComponentKeyAttribute, FieldBoxClass, SearchDebounceAttribute, SelectOpenClass, SelectOptionClass, SelectPopupClass,
    TextInputRowClass, TriggerClickAttribute, TriggerItemsAttribute, TriggersAttribute, TriggerSearchAttribute,
    TriggerTokenClass, TriggerTokenHoveredAttribute
} from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { TriggerTokenPad } from "../extensions/value-readers.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { CommitPauses } from "./debounced-commit-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { observeSize } from "./element-size.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { OwnedPopups } from "./owned-popup.ts";
import {
    awaitTriggerAnswer, collectKnownTriggerTokens, createInitialTriggerState, createTriggerOption, currentOption,
    ensureLayer, ensurePopup, ensureTokenPadding, fieldOf, findActiveTriggerToken,
    findTokenElementAtPoint, findTriggerTokens, isCategoryTriggerItem, optionsOf, parseTriggerItems, parseTriggers,
    replaceFieldRange, resolveFieldAndOwner, resolveTokenText, resolveVisibleItems, setActiveOption, settleTriggerAnswer,
    syncLayerMetrics, triggerEventParameters, TriggerOwnerSelector
} from "./text-trigger-layer.ts";
import type {
    OwnerTriggerState, TextTriggerItem, TriggerEventDetail, TriggerTokenMatch
} from "./text-trigger-layer.ts";

export { stripTriggerTokenPadding, TriggerTokenPad } from "../extensions/value-readers.ts";
export {
    collectKnownTriggerTokens, filterTriggerItems, findActiveTriggerToken, findTriggerTokens, isCategoryTriggerItem,
    triggerEventParameters
} from "./text-trigger-layer.ts";
export type { KnownTriggerToken, TextTriggerItem, TriggerTokenMatch } from "./text-trigger-layer.ts";

const DefaultSearchDebounceMilliseconds = 220;

const TriggerSearchEventName = "trigger-search";
const TriggerSelectEventName = "trigger-select";
const TriggerClickEventName = "trigger-click";

export const TriggerSearchEvent: { readonly name: string; readonly registration: Omit<EventRegistration<CustomEvent<TriggerEventDetail>>, "name"> } = {
    name: TriggerSearchEventName,
    registration: {
        dynamicParameters: context => triggerEventParameters(context.domEvent.detail, context.dynamicParameters),
        started: context => awaitTriggerAnswer(context.domEvent.target),
        completed: context => settleTriggerAnswer(context.domEvent.target)
    }
};

export const TriggerSelectEvent: { readonly name: string; readonly registration: Omit<EventRegistration<CustomEvent<TriggerEventDetail>>, "name"> } = {
    name: TriggerSelectEventName,
    registration: {
        dynamicParameters: context => triggerEventParameters(context.domEvent.detail, context.dynamicParameters)
    }
};

export const TriggerClickEvent: { readonly name: string; readonly registration: Omit<EventRegistration<CustomEvent<TriggerEventDetail>>, "name"> } = {
    name: TriggerClickEventName,
    registration: {
        dynamicParameters: context => triggerEventParameters(context.domEvent.detail, context.dynamicParameters)
    }
};

export type TextTriggerEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchTarget;
};

export class TextTriggerEngine {
    private readonly root: ParentNode;
    private readonly pauses: CommitPauses;
    private readonly states = new WeakMap<HTMLElement, OwnerTriggerState>();
    private readonly sizedFields = new WeakSet<Element>();

    private readonly popups = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(SelectOpenClass),
        hide: ({ owner }, reason) => {
            owner.classList.remove(SelectOpenClass);
            const field = fieldOf(owner);
            field?.removeAttribute("aria-activedescendant");
            const state = this.states.get(owner);

            if (state !== undefined) {
                if (reason === "escape" && field !== null) {
                    const caret = field.selectionStart ?? field.value.length;
                    const token = findActiveTriggerToken(field.value, caret, state.triggers);

                    state.dismissedStart = token?.start ?? caret;
                }

                state.scope = "";
                state.scopeItem = null;
                state.serverScopeItems = null;
                state.lastAskedKey = "";
            }
        },
        closesOnTab: true,
        sheetOnPhone: false
    });

    public constructor(options: TextTriggerEngineOptions = {}) {
        this.root = options.root ?? document;
        this.pauses = new CommitPauses(this.root);

        // Capture phase so Enter, Tab, Escape, ArrowUp/ArrowDown, Backspace and Delete run ahead of FieldKeysEngine.
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent), true);
        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("compositionend", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keyup", domEvent => this.handleCaretMove(domEvent as KeyboardEvent), true);
        this.root.addEventListener("pointerdown", domEvent => this.handlePopupPointerDown(domEvent), true);
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent as PointerEvent), true);
        this.root.addEventListener("pointerout", domEvent => this.handlePointerOut(domEvent as PointerEvent), true);
        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

        observeComponents(this.root, TriggerOwnerSelector, {
            childList: true,
            addedOnly: true,
            attributeFilter: [TriggersAttribute, TriggerItemsAttribute],
            relevant: mutation => {
                if (mutation.type === "attributes")
                    return true;

                if (mutation.type === "childList") {
                    const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

                    return target !== null && target.closest(TriggerOwnerSelector) === null;
                }

                return false;
            }
        }, owners => {
            for (const owner of owners)
                this.handleOwnerMutation(owner);
        });

        options.propertyPatchEngine?.addValueChangeHandler(change => {
            for (const owner of componentParts(change.components, TriggerOwnerSelector))
                this.handleValuePatch(owner);
        });

        for (const owner of this.root.querySelectorAll<HTMLElement>(TriggerOwnerSelector))
            this.handleOwnerMutation(owner);
    }

    private handleValuePatch(owner: HTMLElement): void {
        const field = fieldOf(owner);

        if (field === null)
            return;

        const state = this.ensureState(owner);
        state.renderedLayerValue = null;
        this.syncTokenLayer(owner, field, state);

        if (field.value.length === 0 || document.activeElement !== field) {
            state.dismissedStart = -1;
            this.popups.close(owner);
        }
    }

    private handleInput(domEvent: Event): void {
        if ((domEvent as Partial<InputEvent>).isComposing === true)
            return;

        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const state = this.ensureState(pair.owner);
        state.dismissedStart = -1;
        this.evaluate(pair.owner, pair.field, state, true);
    }

    private handleCaretMove(domEvent: KeyboardEvent): void {
        if (domEvent.key !== "ArrowLeft" && domEvent.key !== "ArrowRight" && domEvent.key !== "Home" && domEvent.key !== "End")
            return;

        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const state = this.ensureState(pair.owner);
        this.evaluate(pair.owner, pair.field, state, false);
    }

    private handleClick(domEvent: Event): void {
        if (domEvent.target instanceof Element) {
            const option = domEvent.target.closest<HTMLElement>(`.${SelectOptionClass}`);
            const owner = option?.closest<HTMLElement>(TriggerOwnerSelector) ?? null;

            if (option !== null && owner !== null && this.popups.isOpen(owner)) {
                const field = fieldOf(owner);

                if (field !== null) {
                    domEvent.preventDefault();
                    domEvent.stopImmediatePropagation();
                    this.chooseOption(owner, field, option);
                    return;
                }
            }
        }

        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const { owner, field } = pair;
        const state = this.ensureState(owner);
        this.evaluate(owner, field, state, false);

        if (owner.hasAttribute(TriggerClickAttribute) && !field.readOnly && !isReadOnly(owner) && !isInert(owner)) {
            const clicked = this.resolveClickedToken(field, state, domEvent as MouseEvent);

            if (clicked !== null) {
                field.dispatchEvent(new CustomEvent<TriggerEventDetail>(TriggerClickEventName, {
                    bubbles: true,
                    detail: {
                        trigger: clicked.trigger,
                        scope: clicked.scope,
                        value: clicked.id
                    }
                }));
            }
        }
    }

    private resolveClickedToken(
        field: HTMLInputElement | HTMLTextAreaElement,
        state: OwnerTriggerState,
        domEvent: MouseEvent
    ): TriggerTokenMatch | null {
        const tokens = findTriggerTokens(field.value, state.triggers, state.knownTokens);

        if (tokens.length === 0)
            return null;

        if (state.layer !== null) {
            const hoveredElement = (typeof domEvent.clientX === "number" && typeof domEvent.clientY === "number" && (domEvent.clientX !== 0 || domEvent.clientY !== 0))
                ? findTokenElementAtPoint(state.layer, domEvent.clientX, domEvent.clientY)
                : state.layer.querySelector<HTMLElement>(`.${TriggerTokenClass}[${TriggerTokenHoveredAttribute}]`);

            if (hoveredElement !== null) {
                const tokenElements = Array.from(state.layer.querySelectorAll<HTMLElement>(`.${TriggerTokenClass}`));
                const tokenIndex = tokenElements.indexOf(hoveredElement);

                if (tokenIndex >= 0 && tokenIndex < tokens.length)
                    return tokens[tokenIndex];

                const key = hoveredElement.getAttribute(ComponentKeyAttribute);
                const byKey = tokens.find(token => token.id === key);

                if (byKey !== undefined)
                    return byKey;
            }
        }

        const selectionStart = field.selectionStart ?? -1;
        const selectionEnd = field.selectionEnd ?? selectionStart;

        if (selectionStart >= 0 && selectionStart === selectionEnd) {
            const byCaret = tokens.find(token => selectionStart >= token.start && selectionStart <= token.end);

            if (byCaret !== undefined)
                return byCaret;
        }

        return null;
    }

    private handlePopupPointerDown(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const popup = domEvent.target.closest<HTMLElement>(`.${SelectPopupClass}`);
        const owner = popup?.closest<HTMLElement>(TriggerOwnerSelector) ?? null;

        // Keep the keyboard focus and caret inside the text field when clicking an option in the trigger popup.
        if (popup !== null && owner !== null && this.popups.isOpen(owner))
            domEvent.preventDefault();
    }

    private handlePointerMove(domEvent: PointerEvent): void {
        if (domEvent.target instanceof Element) {
            const option = domEvent.target.closest<HTMLElement>(`.${SelectOptionClass}`);
            const popupOwner = option?.closest<HTMLElement>(TriggerOwnerSelector) ?? null;

            if (option !== null && popupOwner !== null && this.popups.isOpen(popupOwner)) {
                const popupState = this.states.get(popupOwner);

                if (popupState?.popup !== null && popupState?.popup !== undefined)
                    setActiveOption(popupState.popup, fieldOf(popupOwner), option, false);

                return;
            }
        }

        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const state = this.ensureState(pair.owner);

        if (state.layer === null || state.layer.hidden)
            return;

        const hit = findTokenElementAtPoint(state.layer, domEvent.clientX, domEvent.clientY);

        for (const tokenEl of state.layer.querySelectorAll<HTMLElement>(`.${TriggerTokenClass}`))
            tokenEl.toggleAttribute(TriggerTokenHoveredAttribute, tokenEl === hit);

        pair.field.toggleAttribute(TriggerTokenHoveredAttribute, hit !== null);
    }

    private handlePointerOut(domEvent: PointerEvent): void {
        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        pair.field.removeAttribute(TriggerTokenHoveredAttribute);
        const state = this.states.get(pair.owner);

        if (state?.layer !== null && state?.layer !== undefined) {
            for (const tokenEl of state.layer.querySelectorAll<HTMLElement>(`.${TriggerTokenClass}[${TriggerTokenHoveredAttribute}]`))
                tokenEl.removeAttribute(TriggerTokenHoveredAttribute);
        }
    }

    private handleScroll(domEvent: Event): void {
        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const state = this.states.get(pair.owner);

        if (state?.layer !== null && state?.layer !== undefined && !state.layer.hidden) {
            state.layer.scrollTop = pair.field.scrollTop;
            state.layer.scrollLeft = pair.field.scrollLeft;
        }
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || isComposing(domEvent))
            return;

        const pair = resolveFieldAndOwner(domEvent.target);

        if (pair === null)
            return;

        const { owner, field } = pair;
        const state = this.ensureState(owner);
        const isOpen = this.popups.isOpen(owner) && state.popup !== null;

        // Backspace on an empty query inside a 2nd-level scope steps back to the 1st-level root list instead of deleting `@`.
        if (domEvent.key === "Backspace" && isPlainKey(domEvent) && state.scope.length > 0) {
            const caret = field.selectionStart ?? field.value.length;
            const token = findActiveTriggerToken(field.value, caret, state.triggers);

            if (token !== null && token.query.length === 0) {
                domEvent.preventDefault();
                domEvent.stopImmediatePropagation();
                state.scope = "";
                state.scopeItem = null;
                state.serverScopeItems = null;
                state.lastAskedKey = "";
                this.evaluate(owner, field, state, false);
                return;
            }
        }

        // Atomic token deletion: Backspace or Delete on a completed trigger token removes the whole token in one step.
        if ((domEvent.key === "Backspace" || domEvent.key === "Delete") && isPlainKey(domEvent) && !field.readOnly && !isReadOnly(owner) && !isInert(owner)) {
            const selectionStart = field.selectionStart ?? field.value.length;
            const selectionEnd = field.selectionEnd ?? selectionStart;

            if (selectionStart === selectionEnd) {
                const tokens = findTriggerTokens(field.value, state.triggers, state.knownTokens);
                const hit = domEvent.key === "Backspace"
                    ? tokens.find(token => selectionStart === token.deleteEnd || (selectionStart > token.start && selectionStart <= token.end))
                    : tokens.find(token => selectionStart >= token.start && selectionStart < token.end);

                if (hit !== undefined) {
                    domEvent.preventDefault();
                    domEvent.stopImmediatePropagation();
                    replaceFieldRange(field, hit.start, hit.deleteEnd, "");
                    return;
                }
            }
        }

        // Skip synthetic thin-space pill padding (`U+2009`) when stepping the caret horizontally with ArrowLeft / ArrowRight.
        if ((domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight") && isPlainKey(domEvent)) {
            const selectionStart = field.selectionStart ?? -1;
            const selectionEnd = field.selectionEnd ?? selectionStart;

            if (selectionStart >= 0 && selectionStart === selectionEnd) {
                if (domEvent.key === "ArrowLeft" && selectionStart > 0 && field.value[selectionStart - 1] === TriggerTokenPad) {
                    domEvent.preventDefault();
                    const nextCaret = Math.max(0, selectionStart - 2);
                    field.setSelectionRange?.(nextCaret, nextCaret);
                    this.evaluate(owner, field, state, false);
                    return;
                }

                if (domEvent.key === "ArrowRight" && selectionStart < field.value.length && field.value[selectionStart] === TriggerTokenPad) {
                    domEvent.preventDefault();
                    const nextCaret = Math.min(field.value.length, selectionStart + 2);
                    field.setSelectionRange?.(nextCaret, nextCaret);
                    this.evaluate(owner, field, state, false);
                    return;
                }
            }
        }

        if (!isOpen || state.popup === null)
            return;

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && isPlainKey(domEvent)) {
            const options = optionsOf(state.popup);

            if (options.length === 0)
                return;

            domEvent.preventDefault();
            domEvent.stopImmediatePropagation();

            const current = currentOption(options);
            const currentIndex = current === null ? -1 : options.indexOf(current);
            const nextIndex = domEvent.key === "ArrowDown"
                ? (currentIndex + 1) % options.length
                : (currentIndex <= 0 ? options.length - 1 : currentIndex - 1);

            const next = options[nextIndex] ?? null;

            if (next !== null) {
                setActiveOption(state.popup, field, next, true);
                next.scrollIntoView?.({ block: "nearest" });
            }

            return;
        }

        if ((domEvent.key === "Enter" || domEvent.key === "Tab") && isPlainKey(domEvent)) {
            const options = optionsOf(state.popup);
            const current = currentOption(options);

            if (current !== null) {
                domEvent.preventDefault();
                domEvent.stopImmediatePropagation();
                this.chooseOption(owner, field, current);
                return;
            }
        }

        if (domEvent.key === "Escape" && isPlainKey(domEvent)) {
            const caret = field.selectionStart ?? field.value.length;
            const token = findActiveTriggerToken(field.value, caret, state.triggers);

            domEvent.preventDefault();
            domEvent.stopImmediatePropagation();
            state.dismissedStart = token?.start ?? caret;
            this.popups.close(owner);
        }
    }

    private handleOwnerMutation(owner: HTMLElement): void {
        const state = this.ensureState(owner);
        state.triggers = parseTriggers(owner.getAttribute(TriggersAttribute));

        const items = parseTriggerItems(owner.getAttribute(TriggerItemsAttribute));
        state.latestItems = items;

        const activeRootTrigger = state.scope.length === 0
            ? state.triggers.find(trigger => trigger.prefix === state.activeTrigger) ?? null
            : null;

        if (state.scope.length > 0 && state.scopeItem?.loadsFromServer === true) {
            state.serverScopeItems = items;
            collectKnownTriggerTokens(state.triggers, items, state.knownTokens, state.scope, state.activeTrigger);
        }
        else if (activeRootTrigger?.loadsFromServer === true) {
            state.serverTriggerItems.set(activeRootTrigger.prefix, items);
            collectKnownTriggerTokens(state.triggers, items, state.knownTokens, "", activeRootTrigger.prefix);
        }
        else if (state.scope.length === 0) {
            state.rootItems = items;
            collectKnownTriggerTokens(state.triggers, items, state.knownTokens);
        }
        else {
            collectKnownTriggerTokens(state.triggers, items, state.knownTokens, state.scope, state.activeTrigger);
        }

        const field = fieldOf(owner);
        state.renderedLayerValue = null;

        if (field !== null) {
            this.syncTokenLayer(owner, field, state);

            if (document.activeElement === field || this.popups.isOpen(owner))
                this.evaluate(owner, field, state, false);
        }
    }

    private evaluate(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, state: OwnerTriggerState, fromInput: boolean): void {
        this.syncTokenLayer(owner, field, state);

        if (field.readOnly || isReadOnly(owner) || isInert(owner)) {
            this.popups.close(owner);
            return;
        }

        const caret = field.selectionStart ?? field.value.length;
        const selectionEnd = field.selectionEnd ?? caret;

        if (caret !== selectionEnd) {
            this.popups.close(owner);
            return;
        }

        const token = findActiveTriggerToken(field.value, caret, state.triggers);

        if (token === null) {
            state.dismissedStart = -1;
            this.popups.close(owner);
            return;
        }

        if (!fromInput && findTriggerTokens(field.value, state.triggers, state.knownTokens).some(match => token.start >= match.start && caret <= match.end)) {
            this.popups.close(owner);
            return;
        }

        if (state.dismissedStart === token.start)
            return;

        if (state.activeTrigger !== token.trigger.prefix) {
            state.activeTrigger = token.trigger.prefix;
            state.scope = "";
            state.scopeItem = null;
            state.serverScopeItems = null;
            state.lastAskedKey = "";
        }

        const serverBacked = state.scope.length > 0
            ? state.scopeItem?.loadsFromServer === true
            : token.trigger.loadsFromServer === true;

        if (serverBacked && owner.hasAttribute(TriggerSearchAttribute)) {
            const askKey = `${token.trigger.prefix}|${state.scope}|${token.query}`;

            if (fromInput && askKey !== state.lastAskedKey) {
                state.lastAskedKey = askKey;
                this.scheduleSearch(owner, field, token.trigger.prefix, state.scope, token.query, token.query.length === 0);
            }
        }

        const visibleItems = resolveVisibleItems(owner, state, token, serverBacked);

        if (visibleItems.length === 0 && !serverBacked) {
            this.popups.close(owner);
            return;
        }

        this.renderPopup(owner, field, state, visibleItems);
    }

    private syncTokenLayer(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, state: OwnerTriggerState): void {
        ensureTokenPadding(field, state);

        if (state.renderedLayerValue === field.value && state.layer !== null)
            return;

        state.renderedLayerValue = field.value;
        const tokens = findTriggerTokens(field.value, state.triggers, state.knownTokens);

        if (tokens.length === 0) {
            if (state.layer !== null) {
                state.layer.hidden = true;
                state.layer.replaceChildren();
            }

            field.removeAttribute(TriggerTokenHoveredAttribute);
            return;
        }

        const layer = ensureLayer(owner, state);

        if (!this.sizedFields.has(field)) {
            this.sizedFields.add(field);
            observeSize(field, () => {
                if (state.layer !== null && !state.layer.hidden)
                    syncLayerMetrics(owner, field, state.layer);
            });
        }

        layer.hidden = false;
        layer.replaceChildren();

        let cursor = 0;

        for (const match of tokens) {
            if (match.start > cursor)
                layer.appendChild(document.createTextNode(field.value.slice(cursor, match.start)));

            const span = document.createElement("span");
            span.className = TriggerTokenClass;
            span.setAttribute(ComponentKeyAttribute, match.id);
            span.textContent = match.text;
            layer.appendChild(span);

            cursor = match.end;
        }

        if (cursor < field.value.length)
            layer.appendChild(document.createTextNode(field.value.slice(cursor)));

        syncLayerMetrics(owner, field, layer);
    }

    private renderPopup(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, state: OwnerTriggerState, items: readonly TextTriggerItem[]): void {
        const popup = ensurePopup(owner, state);
        state.renderedItems.clear();

        const optionElements = items.map(item => {
            state.renderedItems.set(item.id, item);
            return createTriggerOption(item);
        });

        popup.replaceChildren(...optionElements);
        setActiveOption(popup, field, optionElements[0] ?? null, true);

        if (!this.popups.isOpen(owner)) {
            const anchor = owner.querySelector<HTMLElement>(`.${TextInputRowClass}, .${FieldBoxClass}`) ?? field;

            this.popups.open({
                owner,
                popup,
                anchor,
                placement: { placement: "bottom-start" },
                openers: [field],
                namedBy: owner,
                focus: false,
                returnFocus: () => field
            });
        }
    }

    private chooseOption(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, option: HTMLElement): void {
        const state = this.states.get(owner);
        const key = option.getAttribute(ComponentKeyAttribute);

        if (state === undefined || key === null)
            return;

        const item = state.renderedItems.get(key);

        if (item === undefined)
            return;

        const caret = field.selectionStart ?? field.value.length;
        const token = findActiveTriggerToken(field.value, caret, state.triggers);

        if (token === null) {
            this.popups.close(owner);
            return;
        }

        if (isCategoryTriggerItem(item)) {
            state.scope = item.id;
            state.scopeItem = item;
            state.serverScopeItems = null;
            state.lastAskedKey = "";

            replaceFieldRange(field, token.start, token.end, token.trigger.prefix);

            if (item.loadsFromServer === true && owner.hasAttribute(TriggerSearchAttribute) && state.lastAskedKey.length === 0) {
                state.lastAskedKey = `${token.trigger.prefix}|${item.id}|`;
                this.scheduleSearch(owner, field, token.trigger.prefix, item.id, "", true);
            }

            this.evaluate(owner, field, state, false);
            return;
        }

        const activeScope = state.scope;
        const insertText = typeof item.insertText === "string" && item.insertText.length > 0
            ? item.insertText
            : `${token.trigger.prefix}${item.title} `;
        const tokenText = resolveTokenText(token.trigger.prefix, item);

        if (tokenText.startsWith(token.trigger.prefix) && tokenText.length > token.trigger.prefix.length) {
            state.knownTokens.set(tokenText, {
                tokenText,
                trigger: token.trigger.prefix,
                scope: activeScope,
                id: item.id
            });
        }

        const paddedInsert = insertText.startsWith(tokenText) && state.knownTokens.has(tokenText)
            ? `${TriggerTokenPad}${tokenText}${TriggerTokenPad}${insertText.slice(tokenText.length)}`
            : insertText;

        replaceFieldRange(field, token.start, token.end, paddedInsert);
        this.syncTokenLayer(owner, field, state);
        this.popups.close(owner);

        field.dispatchEvent(new CustomEvent<TriggerEventDetail>(TriggerSelectEventName, {
            bubbles: true,
            detail: {
                trigger: token.trigger.prefix,
                scope: activeScope,
                value: item.id
            }
        }));
    }

    private scheduleSearch(owner: HTMLElement, field: HTMLInputElement | HTMLTextAreaElement, trigger: string, scope: string, query: string, immediate: boolean): void {
        const dispatch = (): void => {
            field.dispatchEvent(new CustomEvent<TriggerEventDetail>(TriggerSearchEventName, {
                bubbles: true,
                detail: { trigger, scope, value: query }
            }));
        };

        if (immediate) {
            this.pauses.drop(field);
            dispatch();
            return;
        }

        const debounceAttr = field.getAttribute(SearchDebounceAttribute) ?? owner.getAttribute(SearchDebounceAttribute);
        const debounce = debounceAttr === null ? DefaultSearchDebounceMilliseconds : Number(debounceAttr);

        this.pauses.wait(field, Number.isFinite(debounce) && debounce >= 0 ? debounce : DefaultSearchDebounceMilliseconds, dispatch);
    }

    private ensureState(owner: HTMLElement): OwnerTriggerState {
        let state = this.states.get(owner);

        if (state === undefined) {
            state = createInitialTriggerState(owner);
            this.states.set(owner, state);
        }

        return state;
    }
}
