// What a component's own renderer puts beside a row that the row's template cannot — a menu's sub-entries under its entry — has a
// client half here: a row the client builds goes through the decorator the items template metadata names, by kind, after its template.

import type { ItemStackEntry } from "./binding-template-evaluator";
import type { ItemsTemplateRegistry } from "./items-template-registry";
import type { ItemsTemplateRenderer } from "./items-template-renderer";

export type RowDecoratorContext = {
    /** The row as the host will hold it: the wrapper when the component has one, the template's root otherwise. */
    readonly row: Element;
    readonly item: unknown;
    readonly key: string;
    /** The items component the row belongs to, whose variant templates a decorator draws from. */
    readonly componentId: number;
    readonly ancestors: readonly ItemStackEntry[];
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
};

export type RowDecorator = (context: RowDecoratorContext) => void;

export type RowDecoratorRegistration = {
    readonly kind: string;
    readonly decorate: RowDecorator;
};

export class RowDecoratorRegistry {
    private readonly decorators = new Map<string, RowDecorator>();

    public register(registration: RowDecoratorRegistration): void {
        this.decorators.set(registration.kind, registration.decorate);
    }

    public get(kind: string): RowDecorator | undefined {
        return this.decorators.get(kind);
    }
}
