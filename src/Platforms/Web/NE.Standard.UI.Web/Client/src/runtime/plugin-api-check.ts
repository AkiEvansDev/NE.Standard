// Holds the runtime's real types to the contract in Client/plugin/ne-standard-ui.d.ts, both ways: what the runtime hands a package
// is assignable to what the contract declares, and what the contract lets a package hand in is what the runtime takes. Compiled by
// `tsc --noEmit`; nothing imports it, so it bundles to nothing.

import type * as Contract from "ne-standard-ui";
import type { DomRegistry } from "../addressing/dom-registry";
import type { DialogEngine } from "../interactions/dialog-engine";
import type { observeSize } from "../interactions/element-size";
import type { numberFormatting } from "../rendering/number-format";
import type { ClientStore } from "../state/client-store";
import type { CollectionChange, CollectionSinkRegistration } from "../updates/collection-sinks";
import type { EffectContext, EffectRegistration } from "../effects/effect-registry";
import type { EventDispatchContext } from "../events/event-descriptor";
import type { EventAttachContext } from "../extensions/events";
import type { ValueConverterContext, ValueConverterRegistration } from "../extensions/converters";
import type { ValueReaderRegistration } from "../extensions/value-readers";
import type { observeComponents } from "../interactions/dom-mutations";
import type { DomOperationContext, DomOperationRegistration } from "../updates/dom-operation-registry";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import type { ClientStrings } from "./client-strings";
import type { NEStandardUIGlobalApi, WebUIPluginEventRegistration } from "./global-api";
import type { PluginEngineContext } from "./web-ui-runtime";

type Assignable<TFrom extends TTo, TTo> = TFrom extends TTo ? true : never;

/** What the runtime hands a package: each real shape is assignable to the declared one. */
export type HandedOut = [
    Assignable<NEStandardUIGlobalApi, Contract.GlobalApi>,
    Assignable<PluginEngineContext, Contract.PluginEngineContext>,
    Assignable<DomRegistry, Contract.DomRegistry>,
    Assignable<PropertyPatchEngine, Contract.PropertyPatchEngine>,
    Assignable<PropertyValueChange, Contract.PropertyValueChange>,
    Assignable<ClientStrings, Contract.ClientStrings>,
    Assignable<typeof observeComponents, Contract.ObserveComponents>,
    Assignable<typeof observeSize, Contract.ObserveSize>,
    Assignable<DialogEngine, Contract.Dialogs>,
    Assignable<ClientStore, Contract.ClientStore>,
    Assignable<typeof numberFormatting, Contract.NumberFormatting>,
    Assignable<CollectionChange, Contract.CollectionChange>,
    Assignable<DomOperationContext, Contract.DomOperationContext>,
    Assignable<EffectContext, Contract.EffectContext>,
    Assignable<EventDispatchContext, Contract.EventDispatchContext>,
    Assignable<EventAttachContext, Contract.EventAttachContext>,
    Assignable<ValueConverterContext, Contract.ValueConverterContext>
];

/** What a package hands in: each declared registration is assignable to the one the runtime takes. */
export type HandedIn = [
    Assignable<Contract.DomOperationRegistration, DomOperationRegistration>,
    Assignable<Contract.EffectRegistration, EffectRegistration>,
    Assignable<Contract.ValueReaderRegistration, ValueReaderRegistration>,
    Assignable<Contract.CollectionSinkRegistration, CollectionSinkRegistration>,
    Assignable<Contract.ValueConverterRegistration, ValueConverterRegistration>,
    Assignable<Contract.EventRegistration, WebUIPluginEventRegistration>,
    Assignable<Contract.PluginEngine, Parameters<NEStandardUIGlobalApi["registerEngine"]>[0]>
];
