// Right-click menus. The menu is rendered inside the component that owns it (see
// `WebComponentRendererBase.RenderContextMenu`), so this engine only decides when to show one and where —
// the entries, their commands and their styling are the menu component's own.
//
// Placement is done here rather than through `anchored-popup.ts` because there is no anchor element: a
// context menu opens at the pointer, and the only thing to keep it inside is the viewport.

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = "data-ui-context-menu";
const OpenClass = "ui-context-menu--open";

const ViewportMargin = 4;

export type ContextMenuEngineOptions = {
    readonly root?: ParentNode;
};

export class ContextMenuEngine {
    private readonly root: ParentNode;
    private openMenu: HTMLElement | null = null;

    public constructor(options: ContextMenuEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);

        // Capture phase and composedPath, like every other popup here: a handler that re-renders during the
        // click detaches the clicked node, and contains() would then answer "outside".
        document.addEventListener("pointerdown", domEvent => this.handleOutside(domEvent), true);

        // A click *inside* closes on the click, not on the press: closing on pointerdown would take the menu
        // down before the entry it landed on had been activated.
        document.addEventListener("click", domEvent => this.handleInside(domEvent), false);
        document.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        window.addEventListener("blur", () => this.close());
    }

    private handleContextMenu(domEvent: Event): void {
        if (!(domEvent instanceof MouseEvent) || !(domEvent.target instanceof Element))
            return;

        const owner = domEvent.target.closest<HTMLElement>(`[${OwnerAttribute}]`);

        if (owner === null)
            return;

        // querySelector, not children: the menu sits inside the owner but a renderer is free to nest it.
        // Scoped to *this* owner's own menu, so a menu inside a nested owner never opens for the outer one.
        const menu = owner.querySelector<HTMLElement>(`[${MenuAttribute}]`);

        if (menu === null || menu.closest(`[${OwnerAttribute}]`) !== owner)
            return;

        domEvent.preventDefault();

        this.close();
        this.open(menu, domEvent.clientX, domEvent.clientY);
    }

    private open(menu: HTMLElement, x: number, y: number): void {
        menu.classList.add(OpenClass);
        this.openMenu = menu;

        // Measured after the class is applied, or a display:none menu measures as zero and never flips.
        const rect = menu.getBoundingClientRect();

        menu.style.left = `${clamp(x, rect.width, window.innerWidth)}px`;
        menu.style.top = `${clamp(y, rect.height, window.innerHeight)}px`;

        menu.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    }

    private handleOutside(domEvent: Event): void {
        if (this.openMenu === null || domEvent.composedPath().includes(this.openMenu))
            return;

        this.close();
    }

    private handleInside(domEvent: Event): void {
        if (this.openMenu !== null && domEvent.composedPath().includes(this.openMenu))
            this.close();
    }

    private handleKeydown(domEvent: Event): void {
        if (this.openMenu !== null && domEvent instanceof KeyboardEvent && domEvent.key === "Escape") {
            domEvent.preventDefault();
            this.close();
        }
    }

    private close(): void {
        if (this.openMenu === null)
            return;

        this.openMenu.classList.remove(OpenClass);
        this.openMenu = null;
    }
}

/** Keeps the menu inside the viewport: past the far edge it flips back by its own size rather than clipping. */
function clamp(offset: number, span: number, viewportSpan: number): number {
    return Math.max(ViewportMargin, Math.min(offset, viewportSpan - span - ViewportMargin));
}
