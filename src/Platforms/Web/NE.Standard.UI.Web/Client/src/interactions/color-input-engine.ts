import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";
import { moveFocusInto, restoreFocusTo } from "./popup-focus";
import { observeComponents } from "./dom-mutations";

const RootClass = "ui-color-input";
const OpenClass = "ui-color-input--open";
const PopupClass = "ui-color-input__popup";
const TextClass = "ui-color-input__text";
const RowClass = "ui-color-input__row";
const SwatchButtonClass = "ui-color-input__swatch--button";
const ValueInputClass = "ui-color-input__value-input";
const SquareThumbClass = "ui-color-input__square-thumb";
const HueThumbClass = "ui-color-input__hue-thumb";

const ToggleAttribute = "data-ui-color-toggle";
const TabAttribute = "data-ui-color-tab";
const TabSelectedAttribute = "data-ui-color-tab-selected";
const PaneAttribute = "data-ui-color-pane";
const PaneSelectedAttribute = "data-ui-color-pane-selected";
const SquareAttribute = "data-ui-color-square";
const HueAttribute = "data-ui-color-hue";
const HexAttribute = "data-ui-color-hex";
const ChannelAttribute = "data-ui-color-channel";
const FactorAttribute = "data-ui-color-factor";
const OpacityAttribute = "data-ui-color-opacity";
const NameAttribute = "data-ui-color-name";
const NameSelectedAttribute = "data-ui-color-name-selected";
const FormatAttribute = "data-ui-color-format";
const ReadOnlyAttribute = "data-ui-color-readonly";
const VariantAttribute = "data-ui-color-variant";
const PickerOfferedAttribute = "data-ui-color-picker";
const PaletteOfferedAttribute = "data-ui-color-palette";

const PopupGap = 4;

/** What one colour input is currently showing; both the picked and the palette colour are kept. */
type ColorState = {
    pane: "picker" | "palette";
    /** Hue in degrees, saturation and value in 0..1 — the picker's own coordinates. */
    hue: number;
    saturation: number;
    value: number;
    opacity: number;
    /** The palette entry, when the colour came from there. */
    name: string | null;
    /** -10..10: the sign is the adjustment, the magnitude is the factor. */
    factor: number;
    /** Whether the control holds a colour at all. */
    held: boolean;
    /** Whether a person picked the pane; until they do it is re-derived on every read rather than remembered. */
    paneChosen: boolean;
};

export type ColorInputEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

/** The colour input's two tabs — a free picker and the palette — both views of the canonical text in the hidden input. */
export class ColorInputEngine {
    private readonly options: ColorInputEngineOptions;
    private readonly root: ParentNode;
    private readonly states = new WeakMap<HTMLElement, ColorState>();

    /** What held focus before each popup opened, so closing it can hand focus back. */
    private readonly returnFocus = new WeakMap<HTMLElement, HTMLElement>();

    private openInput: HTMLElement | null = null;
    private dragging: { input: HTMLElement; surface: "square" | "hue" } | null = null;

    public constructor(options: ColorInputEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // A pushed value is a new colour to read: the swatch, the text and the picker all come from it.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            this.applyAll(this.options.dom?.findComponentParts(componentId, change.dynamicParameters, `.${RootClass}`) ?? []);
        });

        // The text format is an attribute on the root, so a bound change to it arrives as a mutation, not a value change.
        observeComponents(
            this.root,
            `.${RootClass}`,
            { childList: true, attributeFilter: [FormatAttribute, ReadOnlyAttribute, VariantAttribute, PickerOfferedAttribute, PaletteOfferedAttribute] },
            inputs => this.applyAll(inputs));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        this.root.addEventListener("change", domEvent => this.handleFieldChange(domEvent), true);
        this.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);

        document.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);
        document.addEventListener("pointerup", () => this.dragging = null, true);

        // Waits for the click, not the press: a selection dragged out of a field is still work in the popup.
        new PopupDismissal({
            root: this.root,
            openPopups: () => this.openInput === null ? [] : [this.openInput],
            close: input => this.setOpen(input, false)
        });
    }

    private applyAll(inputs: Iterable<HTMLElement>): void {
        for (const input of inputs)
            this.applyState(input, this.readState(input));
    }

    /** The state the canonical value describes, or what the control already had if it has not changed. */
    private readState(input: HTMLElement): ColorState {
        const canonical = readValue(input);
        const existing = this.states.get(input);
        const pane = existing?.paneChosen === true ? offeredPane(input, existing.pane) : defaultPane(input);

        // A semantic role reads as nothing held; only `held` moves, so the picker keeps the coordinates it stood on.
        if (canonical.length === 0 || canonical.startsWith("@"))
            return { ...(existing ?? emptyState(pane)), pane, held: false };

        if (canonical.startsWith("#")) {
            const rgba = parseHex(canonical);

            if (rgba === null)
                return existing ?? emptyState(pane);

            const [red, green, blue, alpha] = rgba;

            // The trip through hex is lossy, so a colour the control already stands on keeps the coordinates it was picked at.
            if (existing !== undefined && existing.name === null && sameRgb(this.resolveRgb(input, existing), [red, green, blue]))
                return { ...existing, pane, opacity: alpha, held: true };

            const [hue, saturation, value] = rgbToHsv(red, green, blue);

            return { pane, hue, saturation, value, opacity: alpha, name: null, factor: 0, held: true, paneChosen: existing?.paneChosen === true };
        }

        const parts = canonical.split("/");
        const factor = Number(parts[2] ?? "0") * (parts[1] === "Shade" ? -1 : 1);
        const opacity = Number(parts[3] ?? "255");

        return { ...(existing ?? emptyState(pane)), pane, name: parts[0], factor, opacity, held: true };
    }

    /** Draws the state everywhere it shows, without writing the value back. */
    private applyState(input: HTMLElement, state: ColorState): void {
        const [red, green, blue] = this.resolveRgb(input, state);

        // A palette colour has no hue until it is resolved, and the picker tab has to open on the colour actually held.
        if (state.name !== null) {
            const [hue, saturation, value] = rgbToHsv(red, green, blue);

            state = { ...state, hue, saturation, value };
        }

        this.states.set(input, state);

        // On the root rather than the swatch: the swatch, the thumbs and the text across it all read the same colour.
        writeStyle(input, "--ui-color-input-color", state.held ? toRgbaCss(red, green, blue, state.opacity) : "transparent");
        writeStyle(input, "--ui-color-input-solid", toRgbaCss(red, green, blue, 255));
        writeStyle(input, "--ui-color-input-on-color", state.held ? onColor(red, green, blue, state.opacity) : "inherit");
        writeTexts(input, state.held ? describe(input, red, green, blue, state.opacity) : "");

        this.applyPicker(input, state, red, green, blue);
        this.applyPalette(input, state);
        this.applyPanes(input, state);
    }

    private applyPicker(input: HTMLElement, state: ColorState, red: number, green: number, blue: number): void {
        const square = input.querySelector<HTMLElement>(`[${SquareAttribute}]`);
        const hue = input.querySelector<HTMLElement>(`[${HueAttribute}]`);

        const [hueRed, hueGreen, hueBlue] = hsvToRgb(state.hue, 1, 1);

        writeStyle(input, "--ui-color-input-hue", toRgbaCss(hueRed, hueGreen, hueBlue, 255));

        if (square !== null) {
            const thumb = square.querySelector<HTMLElement>(`.${SquareThumbClass}`);

            if (thumb !== null) {
                writeStyle(thumb, "left", `${state.saturation * 100}%`);
                writeStyle(thumb, "top", `${(1 - state.value) * 100}%`);
            }
        }

        if (hue !== null) {
            const thumb = hue.querySelector<HTMLElement>(`.${HueThumbClass}`);

            if (thumb !== null)
                writeStyle(thumb, "top", `${(state.hue / 360) * 100}%`);
        }

        writeField(input, `[${HexAttribute}]`, toHex(red, green, blue));
        writeField(input, `[${ChannelAttribute}="r"]`, String(red));
        writeField(input, `[${ChannelAttribute}="g"]`, String(green));
        writeField(input, `[${ChannelAttribute}="b"]`, String(blue));

        // How far along its track the opacity slider is filled: CSS cannot style the part left of the thumb.
        writeStyle(input, "--ui-color-input-opacity-fill", `${(state.opacity / 255) * 100}%`);
        writeSlider(input, `[${OpacityAttribute}]`, state.opacity);
    }

    private applyPalette(input: HTMLElement, state: ColorState): void {
        for (const chip of input.querySelectorAll<HTMLElement>(`[${NameAttribute}]`)) {
            if (chip.getAttribute(NameAttribute) === state.name)
                chip.setAttribute(NameSelectedAttribute, "");
            else
                chip.removeAttribute(NameSelectedAttribute);
        }

        // The palette entry before any shade or tint: what the factor slider's track runs through.
        const chip = state.name === null ? null : input.querySelector<HTMLElement>(`[${NameAttribute}="${state.name}"]`);
        const base = chip === null ? null : parseHex(chip.style.getPropertyValue("--ui-color-input-chip").trim());

        writeStyle(input, "--ui-color-input-base", base === null ? "transparent" : toRgbaCss(base[0], base[1], base[2], 255));
        writeSlider(input, `[${FactorAttribute}]`, state.factor);
    }

    private applyPanes(input: HTMLElement, state: ColorState): void {
        for (const pane of input.querySelectorAll<HTMLElement>(`[${PaneAttribute}]`)) {
            if (pane.getAttribute(PaneAttribute) === state.pane)
                pane.setAttribute(PaneSelectedAttribute, "");
            else
                pane.removeAttribute(PaneSelectedAttribute);
        }

        for (const tab of input.querySelectorAll<HTMLElement>(`[${TabAttribute}]`)) {
            if (tab.getAttribute(TabAttribute) === state.pane)
                tab.setAttribute(TabSelectedAttribute, "");
            else
                tab.removeAttribute(TabSelectedAttribute);
        }
    }

    /** The colour a state resolves to; a palette entry's shade/tint maths must match `ColorVariant`. */
    private resolveRgb(input: HTMLElement, state: ColorState): [number, number, number] {
        if (state.name === null)
            return hsvToRgb(state.hue, state.saturation, state.value);

        const chip = input.querySelector<HTMLElement>(`[${NameAttribute}="${state.name}"]`);
        const base = chip === null ? null : parseHex(chip.style.getPropertyValue("--ui-color-input-chip").trim());

        if (base === null)
            return hsvToRgb(state.hue, state.saturation, state.value);

        return adjust([base[0], base[1], base[2]], state.factor);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${ToggleAttribute}]`);

        if (toggle !== null) {
            domEvent.preventDefault();
            this.toggle(toggle.closest<HTMLElement>(`.${RootClass}`));
            return;
        }

        const tab = domEvent.target.closest<HTMLElement>(`[${TabAttribute}]`);
        const input = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (input === null)
            return;

        if (tab !== null) {
            domEvent.preventDefault();

            const pane = tab.getAttribute(TabAttribute);
            const state = this.states.get(input);

            if (state !== undefined && (pane === "picker" || pane === "palette"))
                this.applyState(input, { ...state, pane, paneChosen: true });

            return;
        }

        const chip = domEvent.target.closest<HTMLElement>(`[${NameAttribute}]`);

        if (chip !== null) {
            domEvent.preventDefault();
            this.commit(input, state => ({ ...state, name: chip.getAttribute(NameAttribute) }));
            return;
        }

        // Anywhere on the control opens it, not just the button; inside the popup is where the picking happens.
        const popup = input.querySelector<HTMLElement>(`.${PopupClass}`);

        if (popup === null || !domEvent.composedPath().includes(popup)) {
            domEvent.preventDefault();
            this.toggle(input);
        }
    }

    /** Live while a slider moves: a colour that only appears on release cannot be judged. */
    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement))
            return;

        const input = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (input === null)
            return;

        if (domEvent.target.hasAttribute(FactorAttribute)) {
            this.commit(input, state => ({ ...state, factor: Number(domEvent.target instanceof HTMLInputElement ? domEvent.target.value : 0) }));
            return;
        }

        if (domEvent.target.hasAttribute(OpacityAttribute))
            this.commit(input, state => ({ ...state, opacity: clampByte(Number(domEvent.target instanceof HTMLInputElement ? domEvent.target.value : 255)) }));
    }

    private handleFieldChange(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement))
            return;

        const field = domEvent.target;
        const input = field.closest<HTMLElement>(`.${RootClass}`);

        if (input === null)
            return;

        if (field.hasAttribute(HexAttribute)) {
            const rgba = parseHex(field.value);

            if (rgba === null) {
                this.applyAll([input]);
                return;
            }

            const [hue, saturation, value] = rgbToHsv(rgba[0], rgba[1], rgba[2]);

            this.commit(input, state => ({ ...state, hue, saturation, value, opacity: rgba[3], name: null }));
            return;
        }

        const channel = field.getAttribute(ChannelAttribute);

        if (channel === null)
            return;

        const state = this.states.get(input);

        if (state === undefined)
            return;

        const [red, green, blue] = this.resolveRgb(input, state);
        const channels: Record<string, number> = { r: red, g: green, b: blue };

        channels[channel] = clampByte(Number(field.value));

        const [hue, saturation, value] = rgbToHsv(channels["r"], channels["g"], channels["b"]);

        this.commit(input, current => ({ ...current, hue, saturation, value, name: null }));
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || !(domEvent.target instanceof Element))
            return;

        const square = domEvent.target.closest<HTMLElement>(`[${SquareAttribute}]`);
        const hue = square === null ? domEvent.target.closest<HTMLElement>(`[${HueAttribute}]`) : null;
        const surface = square ?? hue;

        if (surface === null)
            return;

        const input = surface.closest<HTMLElement>(`.${RootClass}`);

        if (input === null)
            return;

        domEvent.preventDefault();

        this.dragging = { input, surface: square === null ? "hue" : "square" };
        this.applyPointer(domEvent);
    }

    private handlePointerMove(domEvent: Event): void {
        if (domEvent instanceof PointerEvent && this.dragging !== null)
            this.applyPointer(domEvent);
    }

    private applyPointer(domEvent: PointerEvent): void {
        if (this.dragging === null)
            return;

        const { input, surface } = this.dragging;
        const element = input.querySelector<HTMLElement>(surface === "square" ? `[${SquareAttribute}]` : `[${HueAttribute}]`);

        if (element === null)
            return;

        const rect = element.getBoundingClientRect();

        if (surface === "hue") {
            const ratio = clampRatio((domEvent.clientY - rect.top) / rect.height);

            this.commit(input, state => ({ ...state, hue: ratio * 360, name: null }));
            return;
        }

        const saturation = clampRatio((domEvent.clientX - rect.left) / rect.width);
        const value = 1 - clampRatio((domEvent.clientY - rect.top) / rect.height);

        this.commit(input, state => ({ ...state, saturation, value, name: null }));
    }

    /** Draws the new state and writes it back through the hidden input's ordinary two-way change. */
    private commit(input: HTMLElement, next: (state: ColorState) => ColorState): void {
        const state = this.states.get(input);

        if (state === undefined || input.hasAttribute(ReadOnlyAttribute))
            return;

        // Picking is what makes a control that held nothing hold something, so the flag is set once here.
        const updated = { ...next(state), held: true };

        this.applyState(input, updated);

        const valueInput = input.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput === null)
            return;

        valueInput.value = toCanonical(updated, this.resolveRgb(input, updated));
        valueInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private toggle(input: HTMLElement | null): void {
        // Nothing to open once the control offers neither pane.
        if (input === null || input.hasAttribute(ReadOnlyAttribute))
            return;

        if (!input.hasAttribute(PickerOfferedAttribute) && !input.hasAttribute(PaletteOfferedAttribute))
            return;

        this.setOpen(input, !input.classList.contains(OpenClass));
    }

    private setOpen(input: HTMLElement, open: boolean): void {
        const popup = input.querySelector<HTMLElement>(`.${PopupClass}`);

        if (open && input.hasAttribute(ReadOnlyAttribute))
            return;

        if (popup === null)
            return;

        if (this.openInput !== null && this.openInput !== input)
            this.setOpen(this.openInput, false);

        input.classList.toggle(OpenClass, open);
        input.querySelector<HTMLElement>(`[${ToggleAttribute}]`)?.setAttribute("aria-expanded", open ? "true" : "false");

        if (!open) {
            releaseAnchoredPopup(popup);
            this.openInput = null;
            restoreFocusTo(this.returnFocus.get(input), popup);
            this.returnFocus.delete(input);
            return;
        }

        this.openInput = input;

        // Anchored to the variant that is showing, not the root, which also holds the label and any stretched height.
        const anchor = input.getAttribute(VariantAttribute) === "swatch"
            ? input.querySelector<HTMLElement>(`.${SwatchButtonClass}`)
            : input.querySelector<HTMLElement>(`.${RowClass}`);

        placeAnchoredPopup(anchor ?? input, popup, { placement: "bottom-end", gap: PopupGap });

        // Focus follows the popup open, landing on the tab that is showing, and comes back when it closes.
        const previous = moveFocusInto(popup, popup.querySelector<HTMLElement>(`[${TabSelectedAttribute}]`));

        if (previous !== null)
            this.returnFocus.set(input, previous);
    }
}

// Both panes are always in the DOM, so a pane the root no longer offers hands over to the other one.
function offeredPane(input: HTMLElement, preferred: "picker" | "palette"): "picker" | "palette" {
    const offers = (pane: "picker" | "palette") =>
        input.hasAttribute(pane === "picker" ? PickerOfferedAttribute : PaletteOfferedAttribute);

    if (offers(preferred))
        return preferred;

    return preferred === "picker" ? "palette" : "picker";
}

// The picker unless it is not offered.
function defaultPane(input: HTMLElement): "picker" | "palette" {
    return offeredPane(input, "picker");
}

function emptyState(pane: "picker" | "palette"): ColorState {
    return { pane, hue: 0, saturation: 1, value: 1, opacity: 255, name: null, factor: 0, held: false, paneChosen: false };
}

function sameRgb(left: readonly number[], right: readonly number[]): boolean {
    return left[0] === right[0] && left[1] === right[1] && left[2] === right[2];
}

/** What reads on top of the colour, by WCAG relative luminance — the same test as `UIColorContrast.IsLight`. */
function onColor(red: number, green: number, blue: number, opacity: number): string {
    // Judged on what is behind the text: the swatch composites the colour over a white checkerboard.
    const alpha = opacity / 255;
    const over = (channel: number) => (channel * alpha) + (255 * (1 - alpha));

    return relativeLuminance(over(red), over(green), over(blue)) > 0.1791
        ? "var(--ui-color-on-light)"
        : "var(--ui-color-on-dark)";
}

function relativeLuminance(red: number, green: number, blue: number): number {
    return (0.2126 * linearChannel(red)) + (0.7152 * linearChannel(green)) + (0.0722 * linearChannel(blue));
}

function linearChannel(channel: number): number {
    const value = channel / 255;

    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function readValue(input: HTMLElement): string {
    return input.querySelector<HTMLInputElement>(`.${ValueInputClass}`)?.value.trim() ?? "";
}

/** The canonical text the server reads back: a palette colour keeps its name, a picked one travels as hex. */
function toCanonical(state: ColorState, rgb: [number, number, number]): string {
    if (state.name !== null) {
        const adjustment = state.factor === 0 ? "None" : (state.factor < 0 ? "Shade" : "Tint");

        return `${state.name}/${adjustment}/${Math.abs(state.factor)}/${state.opacity}`;
    }

    const hex = toHex(rgb[0], rgb[1], rgb[2]);

    return state.opacity === 255 ? hex : `${hex}${toHexByte(state.opacity)}`;
}

function describe(input: HTMLElement, red: number, green: number, blue: number, opacity: number): string {
    if (input.getAttribute(FormatAttribute) === "rgb") {
        return opacity === 255
            ? `rgb(${red}, ${green}, ${blue})`
            : `rgba(${red}, ${green}, ${blue}, ${(opacity / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
    }

    const hex = toHex(red, green, blue);

    return opacity === 255 ? hex : `${hex}${toHexByte(opacity)}`;
}

/** Written only when it differs: an unconditional `textContent` write is a mutation that wakes this engine's own observer. */
function writeTexts(input: HTMLElement, value: string): void {
    for (const element of input.querySelectorAll<HTMLElement>(`.${TextClass}`)) {
        if (element.textContent !== value)
            element.textContent = value;
    }
}

function writeStyle(element: HTMLElement | null, property: string, value: string): void {
    if (element !== null && element.style.getPropertyValue(property) !== value)
        element.style.setProperty(property, value);
}

function writeField(input: HTMLElement, selector: string, value: string): void {
    const field = input.querySelector<HTMLInputElement>(selector);

    // Not while it is being typed into: rewriting the field under the caret makes a hex impossible to type.
    if (field !== null && field !== document.activeElement && field.value !== value)
        field.value = value;
}

// Every match, not the first: each pane draws its own opacity slider.
function writeSlider(input: HTMLElement, selector: string, value: number): void {
    for (const slider of input.querySelectorAll<HTMLInputElement>(selector)) {
        if (slider !== document.activeElement && slider.value !== String(value))
            slider.value = String(value);
    }
}

/** Shade and tint, exactly as `ColorVariant.ToColor` computes them. */
function adjust(rgb: [number, number, number], factor: number): [number, number, number] {
    if (factor === 0)
        return rgb;

    const normalized = Math.abs(factor) / 10;

    return factor < 0
        ? [clampByte(rgb[0] * (1 - normalized)), clampByte(rgb[1] * (1 - normalized)), clampByte(rgb[2] * (1 - normalized))]
        : [
            clampByte(rgb[0] + ((255 - rgb[0]) * normalized)),
            clampByte(rgb[1] + ((255 - rgb[1]) * normalized)),
            clampByte(rgb[2] + ((255 - rgb[2]) * normalized))
        ];
}

function parseHex(text: string): [number, number, number, number] | null {
    const digits = text.trim().replace(/^#/, "");

    if (!/^[0-9a-fA-F]+$/.test(digits))
        return null;

    if (digits.length === 3) {
        return [
            parseInt(digits[0] + digits[0], 16),
            parseInt(digits[1] + digits[1], 16),
            parseInt(digits[2] + digits[2], 16),
            255
        ];
    }

    if (digits.length !== 6 && digits.length !== 8)
        return null;

    return [
        parseInt(digits.slice(0, 2), 16),
        parseInt(digits.slice(2, 4), 16),
        parseInt(digits.slice(4, 6), 16),
        digits.length === 8 ? parseInt(digits.slice(6, 8), 16) : 255
    ];
}

function toHex(red: number, green: number, blue: number): string {
    return `#${toHexByte(red)}${toHexByte(green)}${toHexByte(blue)}`;
}

function toHexByte(value: number): string {
    return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}

function toRgbaCss(red: number, green: number, blue: number, opacity: number): string {
    return `rgba(${red}, ${green}, ${blue}, ${(opacity / 255).toFixed(3)})`;
}

function rgbToHsv(red: number, green: number, blue: number): [number, number, number] {
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
        if (max === r)
            hue = ((g - b) / delta) % 6;
        else if (max === g)
            hue = ((b - r) / delta) + 2;
        else
            hue = ((r - g) / delta) + 4;

        hue *= 60;

        if (hue < 0)
            hue += 360;
    }

    return [hue, max === 0 ? 0 : delta / max, max];
}

function hsvToRgb(hue: number, saturation: number, value: number): [number, number, number] {
    const chroma = value * saturation;
    const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const match = value - chroma;

    const [r, g, b] = hue < 60 ? [chroma, secondary, 0]
        : hue < 120 ? [secondary, chroma, 0]
            : hue < 180 ? [0, chroma, secondary]
                : hue < 240 ? [0, secondary, chroma]
                    : hue < 300 ? [secondary, 0, chroma]
                        : [chroma, 0, secondary];

    return [clampByte((r + match) * 255), clampByte((g + match) * 255), clampByte((b + match) * 255)];
}

function clampByte(value: number): number {
    return Number.isFinite(value) ? Math.min(255, Math.max(0, Math.round(value))) : 0;
}

function clampRatio(value: number): number {
    return Math.min(1, Math.max(0, value));
}
