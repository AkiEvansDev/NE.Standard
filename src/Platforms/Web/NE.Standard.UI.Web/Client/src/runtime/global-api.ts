import { EffectRegistration } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { ValueConverterRegistration } from "../extensions/converters";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import type { WebUIRuntime } from "./web-ui-runtime";

export type WebUIPluginEventRegistration<TEvent extends Event = Event> =
    Omit<EventRegistration<TEvent>, "name">;

export type WebUIPluginConverter = ValueConverterRegistration | ((value: unknown) => unknown);

type PendingEventRegistration = {
    readonly name: string;
    readonly registration: WebUIPluginEventRegistration;
};

type PendingConverterRegistration = ValueConverterRegistration;

type PendingDomOperationRegistration = DomOperationRegistration;

type PendingEffectRegistration = EffectRegistration;

export type NEStandardUIGlobalApi = {
    runtime?: WebUIRuntime;
    registerEvent<TEvent extends Event = Event>(name: string, registration?: WebUIPluginEventRegistration<TEvent>): void;
    addEvent<TEvent extends Event = Event>(name: string, registration?: WebUIPluginEventRegistration<TEvent>): void;
    registerConverter(name: string, converter: WebUIPluginConverter): void;
    addConverter(name: string, converter: WebUIPluginConverter): void;
    registerDomOperation(registration: DomOperationRegistration): void;
    addDomOperation(registration: DomOperationRegistration): void;
    registerEffect(registration: EffectRegistration): void;
    addEffect(registration: EffectRegistration): void;
    __pendingEvents?: PendingEventRegistration[];
    __pendingConverters?: PendingConverterRegistration[];
    __pendingDomOperations?: PendingDomOperationRegistration[];
    __pendingEffects?: PendingEffectRegistration[];
};

declare global {
    interface Window {
        __neStandardUIRuntime?: WebUIRuntime;
        NEStandardUI?: Partial<NEStandardUIGlobalApi>;
    }
}

export function installGlobalApi(): NEStandardUIGlobalApi {
    return ensureGlobalApi();
}

export function exposeGlobalApi(runtime: WebUIRuntime, key = "__neStandardUIRuntime"): void {
    (window as unknown as Record<string, unknown>)[key] = runtime;

    const api = ensureGlobalApi();
    api.runtime = runtime;
    applyPendingRegistrations(runtime, api);
}

function ensureGlobalApi(): NEStandardUIGlobalApi {
    const existing = window.NEStandardUI ?? {};
    const pendingEvents = existing.__pendingEvents ?? [];
    const pendingConverters = existing.__pendingConverters ?? [];
    const pendingDomOperations = existing.__pendingDomOperations ?? [];
    const pendingEffects = existing.__pendingEffects ?? [];

    const api: NEStandardUIGlobalApi = {
        ...existing,
        __pendingEvents: pendingEvents,
        __pendingConverters: pendingConverters,
        __pendingDomOperations: pendingDomOperations,
        __pendingEffects: pendingEffects,
        registerEvent<TEvent extends Event = Event>(name: string, registration: WebUIPluginEventRegistration<TEvent> = {}): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addEvent(name, registration);
                return;
            }

            pendingEvents.push({ name, registration: registration as WebUIPluginEventRegistration });
        },
        addEvent<TEvent extends Event = Event>(name: string, registration: WebUIPluginEventRegistration<TEvent> = {}): void {
            this.registerEvent(name, registration);
        },
        registerConverter(name: string, converter: WebUIPluginConverter): void {
            const registration = createConverterRegistration(name, converter);
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addConverter(registration);
                return;
            }

            pendingConverters.push(registration);
        },
        addConverter(name: string, converter: WebUIPluginConverter): void {
            this.registerConverter(name, converter);
        },
        registerDomOperation(registration: DomOperationRegistration): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addDomOperation(registration);
                return;
            }

            pendingDomOperations.push(registration);
        },
        addDomOperation(registration: DomOperationRegistration): void {
            this.registerDomOperation(registration);
        },
        registerEffect(registration: EffectRegistration): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addEffect(registration);
                return;
            }

            pendingEffects.push(registration);
        },
        addEffect(registration: EffectRegistration): void {
            this.registerEffect(registration);
        }
    };

    window.NEStandardUI = api;

    return api;
}

function applyPendingRegistrations(runtime: WebUIRuntime, api: NEStandardUIGlobalApi): void {
    for (const event of api.__pendingEvents ?? [])
        runtime.addEvent(event.name, event.registration);

    for (const converter of api.__pendingConverters ?? [])
        runtime.addConverter(converter);

    for (const domOperation of api.__pendingDomOperations ?? [])
        runtime.addDomOperation(domOperation);

    for (const effect of api.__pendingEffects ?? [])
        runtime.addEffect(effect);

    api.__pendingEvents = [];
    api.__pendingConverters = [];
    api.__pendingDomOperations = [];
    api.__pendingEffects = [];
}

function createConverterRegistration(name: string, converter: WebUIPluginConverter): ValueConverterRegistration {
    if (typeof converter === "function") {
        return {
            name,
            convert: context => converter(context.value)
        };
    }

    return {
        ...converter,
        name
    };
}
