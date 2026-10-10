import { EffectRegistration } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { ValueConverterRegistration } from "../extensions/converters";
import { ValueReaderRegistration } from "../extensions/value-readers";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { getLogLevel, LogLevel, setLogLevel } from "./logger";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import type { PluginEngine, WebUIRuntime } from "./web-ui-runtime";

export type WebUIPluginEventRegistration<TEvent extends Event = Event> =
    Omit<EventRegistration<TEvent>, "name">;

type WebUIPluginConverter = ValueConverterRegistration | ((value: unknown) => unknown);

/** A registration a package made before the runtime existed, applied once it does. */
type PendingRegistration = {
    readonly apply: (runtime: WebUIRuntime) => void;
    /** An engine's goes after every other kind: it may write the words a package registered as it starts. */
    readonly engine: boolean;
};

/** The plugin contract's version (`ContractVersion` in plugin/ne-standard-ui.d.ts); plugin-api-check.ts holds the two equal. */
const PluginContractVersion = 4;

export type NEStandardUIGlobalApi = {
    readonly contractVersion: typeof PluginContractVersion;
    runtime?: WebUIRuntime;
    registerEvent<TEvent extends Event = Event>(name: string, registration?: WebUIPluginEventRegistration<TEvent>): void;
    registerConverter(name: string, converter: WebUIPluginConverter): void;
    registerDomOperation(registration: DomOperationRegistration): void;
    registerEffect(registration: EffectRegistration): void;
    registerValueReader(registration: ValueReaderRegistration): void;
    registerCollectionSink(registration: CollectionSinkRegistration): void;
    registerStrings(words: Readonly<Record<string, string>>): void;
    registerEngine(start: PluginEngine): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    __pending?: PendingRegistration[];
};

declare global {
    // oxlint-disable-next-line typescript/consistent-type-definitions -- only an interface merges into lib.dom's Window
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
    const pending = existing.__pending ?? [];

    // Applied on the runtime where there is one, else held until `exposeGlobalApi` hands it over.
    const register = (apply: (runtime: WebUIRuntime) => void, engine = false): void => {
        const runtime = window.NEStandardUI?.runtime;

        if (runtime !== undefined)
            apply(runtime);
        else
            pending.push({ apply, engine });
    };

    const api: NEStandardUIGlobalApi = {
        ...existing,
        contractVersion: PluginContractVersion,
        __pending: pending,
        registerEvent<TEvent extends Event = Event>(name: string, registration: WebUIPluginEventRegistration<TEvent> = {}): void {
            register(runtime => runtime.addEvent(name, registration));
        },
        registerConverter(name: string, converter: WebUIPluginConverter): void {
            const registration = createConverterRegistration(name, converter);

            register(runtime => runtime.addConverter(registration));
        },
        registerDomOperation(registration: DomOperationRegistration): void {
            register(runtime => runtime.addDomOperation(registration));
        },
        registerEffect(registration: EffectRegistration): void {
            register(runtime => runtime.addEffect(registration));
        },
        registerValueReader(registration: ValueReaderRegistration): void {
            register(runtime => runtime.addValueReader(registration));
        },
        registerCollectionSink(registration: CollectionSinkRegistration): void {
            register(runtime => runtime.addCollectionSink(registration));
        },
        registerStrings(words: Readonly<Record<string, string>>): void {
            register(runtime => runtime.addStrings(words));
        },
        registerEngine(start: PluginEngine): void {
            register(runtime => runtime.addEngine(start), true);
        },
        // The console switch: the client says nothing below a warning until someone here asks it to.
        setLogLevel(level: LogLevel): void {
            setLogLevel(level);
        },
        getLogLevel(): LogLevel {
            return getLogLevel();
        }
    };

    window.NEStandardUI = api;

    return api;
}

function applyPendingRegistrations(runtime: WebUIRuntime, api: NEStandardUIGlobalApi): void {
    const pending = api.__pending ?? [];

    api.__pending = [];

    for (const registration of pending) {
        if (!registration.engine)
            registration.apply(runtime);
    }

    // Last, after the words: an engine may write them as it starts.
    for (const registration of pending) {
        if (registration.engine)
            registration.apply(runtime);
    }
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
