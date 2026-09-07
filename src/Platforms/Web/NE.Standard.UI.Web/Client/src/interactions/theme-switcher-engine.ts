import { DomRegistry } from "../addressing/dom-registry";
import { EffectRegistry } from "../effects/effect-registry";
import { ClientEffectKinds } from "../metadata/metadata-index";

export type ThemeSwitcherEngineOptions = {
    readonly root?: ParentNode;
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
};

const SwitcherSelector = "[data-ui-theme-switcher]";
const ThemeAttribute = "data-ui-theme";

/** Reads the theme the page is resolved to and raises the effect that puts it in the other one. */
export class ThemeSwitcherEngine {
    private readonly options: ThemeSwitcherEngineOptions;
    private readonly root: ParentNode;

    public constructor(options: ThemeSwitcherEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("click", event => this.handleClick(event as MouseEvent));
    }

    private handleClick(event: MouseEvent): void {
        const target = event.target instanceof Element ? event.target.closest(SwitcherSelector) : null;

        if (target === null || target.hasAttribute("disabled"))
            return;

        event.preventDefault();

        this.options.effects.apply({
            effect: { kind: ClientEffectKinds.SetTheme, mode: resolvedTheme() === "dark" ? "Light" : "Dark" },
            dom: this.options.dom
        });
    }
}

/** What the page is actually painted in; `auto` is a real value, so the platform has to be asked. */
function resolvedTheme(): "light" | "dark" {
    const declared = document.documentElement.getAttribute(ThemeAttribute);

    if (declared === "light" || declared === "dark")
        return declared;

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches === true ? "dark" : "light";
}
