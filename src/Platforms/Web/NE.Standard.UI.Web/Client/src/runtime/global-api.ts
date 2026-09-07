import { EffectRegistration } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { ValueConverterRegistration } from "../extensions/converters";
import { ValueReaderRegistration } from "../extensions/value-readers";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import type { PluginEngine, WebUIRuntime } from "./web-ui-runtime";

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

type PendingValueReaderRegistration = ValueReaderRegistration;

type PendingCollectionSinkRegistration = CollectionSinkRegistration;

type PendingStringsRegistration = Readonly<Record<string, string>>;

type PendingEngineRegistration = PluginEngine;

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
    registerValueReader(registration: ValueReaderRegistration): void;
    addValueReader(registration: ValueReaderRegistration): void;
    registerCollectionSink(registration: CollectionSinkRegistration): void;
    addCollectionSink(registration: CollectionSinkRegistration): void;
    registerStrings(words: Readonly<Record<string, string>>): void;
    addStrings(words: Readonly<Record<string, string>>): void;
    registerEngine(start: PluginEngine): void;
    addEngine(start: PluginEngine): void;
    __pendingEvents?: PendingEventRegistration[];
    __pendingConverters?: PendingConverterRegistration[];
    __pendingDomOperations?: PendingDomOperationRegistration[];
    __pendingEffects?: PendingEffectRegistration[];
    __pendingValueReaders?: PendingValueReaderRegistration[];
    __pendingCollectionSinks?: PendingCollectionSinkRegistration[];
    __pendingStrings?: PendingStringsRegistration[];
    __pendingEngines?: PendingEngineRegistration[];
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
    const pendingValueReaders = existing.__pendingValueReaders ?? [];
    const pendingCollectionSinks = existing.__pendingCollectionSinks ?? [];
    const pendingStrings = existing.__pendingStrings ?? [];
    const pendingEngines = existing.__pendingEngines ?? [];

    const api: NEStandardUIGlobalApi = {
        ...existing,
        __pendingEvents: pendingEvents,
        __pendingConverters: pendingConverters,
        __pendingDomOperations: pendingDomOperations,
        __pendingEffects: pendingEffects,
        __pendingValueReaders: pendingValueReaders,
        __pendingCollectionSinks: pendingCollectionSinks,
        __pendingStrings: pendingStrings,
        __pendingEngines: pendingEngines,
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
        },
        registerValueReader(registration: ValueReaderRegistration): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addValueReader(registration);
                return;
            }

            pendingValueReaders.push(registration);
        },
        addValueReader(registration: ValueReaderRegistration): void {
            this.registerValueReader(registration);
        },
        registerCollectionSink(registration: CollectionSinkRegistration): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addCollectionSink(registration);
                return;
            }

            pendingCollectionSinks.push(registration);
        },
        addCollectionSink(registration: CollectionSinkRegistration): void {
            this.registerCollectionSink(registration);
        },
        registerStrings(words: Readonly<Record<string, string>>): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addStrings(words);
                return;
            }

            pendingStrings.push(words);
        },
        addStrings(words: Readonly<Record<string, string>>): void {
            this.registerStrings(words);
        },
        registerEngine(start: PluginEngine): void {
            const runtime = window.NEStandardUI?.runtime;

            if (runtime !== undefined) {
                runtime.addEngine(start);
                return;
            }

            pendingEngines.push(start);
        },
        addEngine(start: PluginEngine): void {
            this.registerEngine(start);
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

    for (const reader of api.__pendingValueReaders ?? [])
        runtime.addValueReader(reader);

    for (const sink of api.__pendingCollectionSinks ?? [])
        runtime.addCollectionSink(sink);

    for (const words of api.__pendingStrings ?? [])
        runtime.addStrings(words);

    // Last, after the words: an engine may write them as it starts.
    for (const start of api.__pendingEngines ?? [])
        runtime.addEngine(start);

    api.__pendingEvents = [];
    api.__pendingConverters = [];
    api.__pendingDomOperations = [];
    api.__pendingEffects = [];
    api.__pendingValueReaders = [];
    api.__pendingCollectionSinks = [];
    api.__pendingStrings = [];
    api.__pendingEngines = [];
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
