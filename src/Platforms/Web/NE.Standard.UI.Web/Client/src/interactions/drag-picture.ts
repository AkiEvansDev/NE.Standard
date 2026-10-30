// A dragged element's picture, drawn by the page: a copy that follows the pointer in the top layer, whole and opaque. The browser's
// own is the operating system's to draw, and Windows fades one wider than about 300 px into nothing towards its edges, after Chrome
// has dimmed all of it — a row's far end was gone; a pane carried by its grip (pane-container-engine.ts) is the pane itself and shows
// neither. The copy wears its look inline, frozen from the element as it stands, and none of its marks: no rule and no engine that
// looks for a row finds it.

import { DragPartAttribute, DragPictureClass, PressWaveClass } from "../addressing/dom-attributes.ts";

const Pseudos = ["::before", "::after"] as const;

// A transparent pixel in place of the browser's picture: made ahead of the first drag, which takes no picture still loading.
const BlankPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// A compact pill's room around a sub-part lifted out of a full-width row (a tree node's icon and title).
const CompactPadX = 8;
const CompactPadY = 4;
const CompactMaxWidth = "240px";

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
 * Gives a starting drag the page's own picture of the element (or a compact part inside it, such as a tree node's label), held where
 * the press took it. Where the page cannot lift one into the top layer, the browser's, offset from the picture's own box: its default
 * measures all it paints, a press's wave included, and lifted the picture off the pointer.
 */
export function giveDragPicture(domEvent: DragEvent, dataTransfer: DataTransfer, element: HTMLElement, pictureSource: HTMLElement = element): void {
    const pixel = blankPixel();

    finishShown?.();

    if (pictureSource === element) {
        const bounds = element.getBoundingClientRect();
        const offsetX = domEvent.clientX - bounds.left;
        const offsetY = domEvent.clientY - bounds.top;

        if (pixel === null || typeof element.showPopover !== "function") {
            dataTransfer.setDragImage(element, offsetX, offsetY);
            return;
        }

        dataTransfer.setDragImage(pixel, 0, 0);
        show(element, element, bounds.left, bounds.top, bounds.width, bounds.height, false, offsetX, offsetY);
    }
    else {
        const previousFlex = pictureSource.style.flex;
        const previousWidth = pictureSource.style.width;
        const previousMaxWidth = pictureSource.style.maxWidth;

        // A stretched row part (`flex: 1`) is measured and frozen at its own content width so the pill carries only the label, not the row's tail.
        try {
            pictureSource.style.flex = "0 0 auto";
            pictureSource.style.width = "max-content";
            pictureSource.style.maxWidth = CompactMaxWidth;

            const bounds = pictureSource.getBoundingClientRect();
            const width = bounds.width + CompactPadX * 2;
            const height = bounds.height + CompactPadY * 2;
            const naturalLeft = bounds.left - CompactPadX;
            const naturalTop = bounds.top - CompactPadY;
            const offsetX = clamp(domEvent.clientX - naturalLeft, CompactPadX, Math.max(CompactPadX, width - CompactPadX));
            const offsetY = clamp(domEvent.clientY - naturalTop, CompactPadY, Math.max(CompactPadY, height - CompactPadY));

            if (pixel === null || typeof element.showPopover !== "function") {
                dataTransfer.setDragImage(pictureSource, clamp(domEvent.clientX - bounds.left, 0, bounds.width), clamp(domEvent.clientY - bounds.top, 0, bounds.height));
                return;
            }

            dataTransfer.setDragImage(pixel, 0, 0);
            show(element, pictureSource, domEvent.clientX - offsetX, domEvent.clientY - offsetY, width, height, true, offsetX, offsetY);
        }
        finally {
            pictureSource.style.flex = previousFlex;
            pictureSource.style.width = previousWidth;
            pictureSource.style.maxWidth = previousMaxWidth;
        }
    }

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

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function show(element: HTMLElement, source: HTMLElement, left: number, top: number, width: number, height: number, compact: boolean, offsetX: number, offsetY: number): void {
    const picture = document.createElement("div");
    const copy = source.cloneNode(true) as HTMLElement;
    const rules: string[] = [];

    picture.className = DragPictureClass;
    picture.setAttribute("popover", "manual");
    picture.setAttribute("aria-hidden", "true");
    picture.inert = true;
    picture.style.width = `${width}px`;
    picture.style.height = `${height}px`;

    if (compact)
        picture.style.padding = `${CompactPadY}px ${CompactPadX}px`;

    freeze(source, copy, rules);

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

    place(picture, left, top);
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

/** A subgrid's tracks and `normal` gap are its parents', which the copy stands without (a table's row) or un-subgrids into its own grid. */
function unSubgrid(source: Element, target: CSSStyleDeclaration, axis: "columns" | "rows"): void {
    if (!target.getPropertyValue(`grid-template-${axis}`).startsWith("subgrid"))
        return;

    target.setProperty(`grid-template-${axis}`, resolvedTracks(source, axis).join(" "));

    const gapProperty = axis === "columns" ? "column-gap" : "row-gap";
    const ownGap = target.getPropertyValue(gapProperty);

    if (ownGap === "normal" || ownGap === "") {
        const gap = resolvedGap(source.parentElement, axis, gapProperty);

        if (gap !== null)
            target.setProperty(gapProperty, gap);
    }
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

/** A subgrid whose own gap is `normal` lays out across the gap of the ancestor grid that defines its tracks. */
function resolvedGap(element: Element | null, axis: "columns" | "rows", gapProperty: string): string | null {
    for (let current = element; current !== null; current = current.parentElement) {
        const style = getComputedStyle(current);
        const gap = style.getPropertyValue(gapProperty);

        if (gap !== "normal" && gap !== "")
            return gap;

        if (!style.getPropertyValue(`grid-template-${axis}`).startsWith("subgrid"))
            return null;
    }

    return null;
}

function freezePseudos(source: Element, copy: Element, rules: string[]): void {
    for (const pseudo of Pseudos) {
        const style = getComputedStyle(source, pseudo);

        if (style.content === undefined || style.content === "none" || style.content === "normal")
            continue;

        if (!copy.hasAttribute(DragPartAttribute))
            copy.setAttribute(DragPartAttribute, String(rules.length));

        const declarations: string[] = [];

        copyStyle(style, (name, value) => declarations.push(`${name}: ${value};`));
        rules.push(`.${DragPictureClass} [${DragPartAttribute}="${copy.getAttribute(DragPartAttribute)}"]${pseudo} { ${declarations.join(" ")} }`);
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
