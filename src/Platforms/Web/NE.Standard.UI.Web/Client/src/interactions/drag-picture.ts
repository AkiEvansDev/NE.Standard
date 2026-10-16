// A dragged element's picture, drawn by the page: a copy that follows the pointer in the top layer, whole and opaque. The browser's
// own is the operating system's to draw, and Windows fades one wider than about 300 px into nothing towards its edges, after Chrome
// has dimmed all of it — a row's far end was gone; a pane carried by its grip (pane-container-engine.ts) is the pane itself and shows
// neither. The copy wears its look inline, frozen from the element as it stands, and none of its marks: no rule and no engine that
// looks for a row finds it.

import { PressWaveClass } from "./press-wave.ts";

/** The picture's frame: the ground, corners and elevation of something lifted off the page (core/runtime.less). */
const PictureClass = "ui-drag-picture";

// On a part of the copy whose `::before` or `::after` draws something (an icon's mask, a box's tick): the rule written for it.
const PartAttribute = "data-ui-drag-part";
const Pseudos = ["::before", "::after"] as const;

// A transparent pixel in place of the browser's picture: made ahead of the first drag, which takes no picture still loading.
const BlankPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// The marks a copy keeps: the ones a picture or a drawing is made of. A class, an id or a data mark would let a rule or an engine
// take it for the element it copies.
const KeptAttributes = new Set([
    "src", "srcset", "sizes", "alt", "width", "height", "type", "viewbox", "preserveaspectratio", "href", "xlink:href", "d", "points",
    "cx", "cy", "r", "rx", "ry", "x", "y", "x1", "y1", "x2", "y2", "fill", "stroke", "stroke-width", "transform"
]);

let blank: HTMLImageElement | null = null;
let finishShown: (() => void) | null = null;

if (typeof Image === "function")
    blankPixel();

/**
 * Gives a starting drag the page's own picture of the element, held where the press took it. Where the page cannot lift one into the
 * top layer, the browser's, offset from the element's own box: its default measures all it paints, a press's wave included, and
 * lifted the picture off the pointer.
 */
export function giveDragPicture(domEvent: DragEvent, dataTransfer: DataTransfer, element: HTMLElement): void {
    const bounds = element.getBoundingClientRect();
    const offsetX = domEvent.clientX - bounds.left;
    const offsetY = domEvent.clientY - bounds.top;
    const pixel = blankPixel();

    finishShown?.();

    if (pixel === null || typeof element.showPopover !== "function") {
        dataTransfer.setDragImage(element, offsetX, offsetY);
        return;
    }

    dataTransfer.setDragImage(pixel, 0, 0);
    show(element, bounds, offsetX, offsetY);

    // A listener after this one may still refuse the drag, which then neither drops nor ends.
    setTimeout(() => {
        if (domEvent.defaultPrevented)
            finishShown?.();
    }, 0);
}

function blankPixel(): HTMLImageElement | null {
    if (blank === null && typeof Image === "function") {
        blank = new Image(1, 1);
        blank.src = BlankPixel;
    }

    return blank;
}

function show(element: HTMLElement, bounds: DOMRect, offsetX: number, offsetY: number): void {
    const picture = document.createElement("div");
    const copy = element.cloneNode(true) as HTMLElement;
    const rules: string[] = [];

    picture.className = PictureClass;
    picture.setAttribute("popover", "manual");
    picture.setAttribute("aria-hidden", "true");
    picture.inert = true;
    picture.style.width = `${bounds.width}px`;
    picture.style.height = `${bounds.height}px`;

    freeze(element, copy, rules);

    // In the frame rather than where the element stood among its siblings, and at full strength: it is what is carried.
    for (const [name, value] of [["position", "relative"], ["inset", "auto"], ["margin", "0"], ["transform", "none"], ["translate", "none"], ["opacity", "1"]])
        copy.style.setProperty(name, value);

    if (rules.length > 0) {
        const sheet = document.createElement("style");

        sheet.textContent = rules.join("\n");
        picture.append(sheet);
    }

    picture.append(copy);

    const follow = (domEvent: DragEvent): void => place(picture, domEvent.clientX - offsetX, domEvent.clientY - offsetY);
    // Out of the window the pointer is the operating system's: the picture waits off sight until it comes back.
    const leave = (domEvent: DragEvent): void => {
        if (domEvent.relatedTarget === null)
            picture.style.visibility = "hidden";
    };
    const enter = (): void => {
        picture.style.visibility = "";
    };
    // Dropped on the page, or ended at the element: a drop that redraws its list may have taken the element out of the page first.
    const finish = (): void => {
        document.removeEventListener("dragover", follow, true);
        document.removeEventListener("dragleave", leave, true);
        document.removeEventListener("dragenter", enter, true);
        document.removeEventListener("drop", finish, true);
        document.removeEventListener("dragend", finish, true);
        element.removeEventListener("dragend", finish);
        picture.remove();

        if (finishShown === finish)
            finishShown = null;
    };

    document.addEventListener("dragover", follow, true);
    document.addEventListener("dragleave", leave, true);
    document.addEventListener("dragenter", enter, true);
    document.addEventListener("drop", finish, true);
    document.addEventListener("dragend", finish, true);
    element.addEventListener("dragend", finish);
    finishShown = finish;

    place(picture, bounds.left, bounds.top);
    document.body.append(picture);
    picture.showPopover();
}

function place(picture: HTMLElement, left: number, top: number): void {
    picture.style.transform = `translate(${left}px, ${top}px)`;
}

/**
 * Writes the element's computed look onto its copy inline, part by part, and takes off every mark a rule or an engine reads; what a
 * part draws before or after itself goes into `rules`, aimed at the part by a number of its own.
 */
function freeze(source: Element, copy: Element, rules: string[]): void {
    const target = (copy as Partial<ElementCSSInlineStyle>).style;

    if (target !== undefined) {
        copyStyle(getComputedStyle(source), (name, value) => target.setProperty(name, value));
        unSubgrid(source, target, "columns");
        unSubgrid(source, target, "rows");
    }

    for (const name of copy.getAttributeNames()) {
        if (name !== "style" && !KeptAttributes.has(name.toLowerCase()))
            copy.removeAttribute(name);
    }

    freezePseudos(source, copy, rules);

    if (source instanceof HTMLInputElement && copy instanceof HTMLInputElement) {
        copy.value = source.value;
        copy.checked = source.checked;
    }

    // From the end, so a wave taken out of the copy leaves the parts before it paired; a press's wave is no part of what was pressed.
    for (let index = source.children.length - 1; index >= 0; index--) {
        const sourceChild = source.children[index];
        const copyChild = copy.children[index];

        if (sourceChild.classList.contains(PressWaveClass))
            copyChild.remove();
        else
            freeze(sourceChild, copyChild, rules);
    }
}

/** A subgrid's tracks are its parents', which the copy stands without (a table's row): it takes the ones it spans, in pixels. */
function unSubgrid(source: Element, target: CSSStyleDeclaration, axis: "columns" | "rows"): void {
    if (target.getPropertyValue(`grid-template-${axis}`).startsWith("subgrid"))
        target.setProperty(`grid-template-${axis}`, resolvedTracks(source, axis).join(" "));
}

/** The tracks a grid lays out on, a subgrid's taken from the grid above it by the lines it is placed on. */
function resolvedTracks(element: Element, axis: "columns" | "rows"): string[] {
    const style = getComputedStyle(element);
    const value = style.getPropertyValue(`grid-template-${axis}`);

    if (!value.startsWith("subgrid"))
        return value.split(/\s+/).filter(track => /^-?[\d.]+px$/.test(track));

    if (element.parentElement === null)
        return [];

    const tracks = resolvedTracks(element.parentElement, axis);
    const line = axis === "columns" ? "column" : "row";
    const start = Number.parseInt(style.getPropertyValue(`grid-${line}-start`), 10);
    const end = Number.parseInt(style.getPropertyValue(`grid-${line}-end`), 10);
    // Lines counted from the end are negative; an unnumbered placement takes them all.
    const from = Number.isNaN(start) ? 0 : start > 0 ? start - 1 : tracks.length + start + 1;
    const to = Number.isNaN(end) ? tracks.length : end > 0 ? end - 1 : tracks.length + end + 1;

    return tracks.slice(from, to);
}

function freezePseudos(source: Element, copy: Element, rules: string[]): void {
    for (const pseudo of Pseudos) {
        const style = getComputedStyle(source, pseudo);

        if (style.content === undefined || style.content === "none" || style.content === "normal")
            continue;

        if (!copy.hasAttribute(PartAttribute))
            copy.setAttribute(PartAttribute, String(rules.length));

        const declarations: string[] = [];

        copyStyle(style, (name, value) => declarations.push(`${name}: ${value};`));
        rules.push(`.${PictureClass} [${PartAttribute}="${copy.getAttribute(PartAttribute)}"]${pseudo} { ${declarations.join(" ")} }`);
    }
}

/** Each property the style computes, its custom properties left out: their values are already folded into the ones they set. */
function copyStyle(style: CSSStyleDeclaration, write: (name: string, value: string) => void): void {
    for (let index = 0; index < style.length; index++) {
        const name = style[index];

        if (!name.startsWith("--"))
            write(name, style.getPropertyValue(name));
    }
}
