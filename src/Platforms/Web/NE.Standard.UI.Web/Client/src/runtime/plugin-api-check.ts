// Holds the runtime's real types to the contract in Client/plugin/ne-standard-ui.d.ts, both ways: what the runtime hands a
// package is assignable to the contract, and what the contract lets in is what the runtime takes. Compiled by `tsc --noEmit`;
// nothing imports it, so it bundles to nothing.

import type * as Contract from "ne-standard-ui";
import type { DomRegistry } from "../addressing/dom-registry";
import type { DialogEngine } from "../interactions/dialog-engine";
import type { observeSize } from "../interactions/element-size";
import type { numberFormatting } from "../rendering/number-format";
import type { temporalFormatting } from "../rendering/temporal-format";
import type { ClientStore } from "../state/client-store";
import type { CollectionChange, CollectionSinkRegistration } from "../updates/collection-sinks";
import type { EffectContext, EffectRegistration } from "../effects/effect-registry";
import type { EventCompletionContext, EventDispatchContext } from "../events/event-descriptor";
import type { EventAttachContext } from "../extensions/events";
import type { ValueConverterContext, ValueConverterRegistration } from "../extensions/converters";
import type { ValueReaderRegistration, ValueReading } from "../extensions/value-readers";
import type { observeComponents } from "../interactions/dom-mutations";
import type { FileUploads } from "../interactions/file-upload";
import type { ItemSelection } from "../interactions/row-selection";
import type { TableColumns } from "../interactions/table-columns-engine";
import type { Tooltips } from "../interactions/tooltip-engine";
import type { InlineRenameOptions, InlineRenames } from "../interactions/inline-rename";
import type { PopupOptions, Popups } from "../interactions/popup-service";
import type { rovingFocus } from "../interactions/roving-focus";
import type { ItemRows } from "../items/item-rows";
import type { ItemWindows } from "../items/items-window-engine";
import type { DomOperationContext, DomOperationRegistration } from "../updates/dom-operation-registry";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import type { ClientStrings } from "./client-strings";
import type { NEStandardUIGlobalApi, WebUIPluginEventRegistration } from "./global-api";
import type { Badges, Icons, PluginEngineContext, PropertyWriting } from "./web-ui-runtime";

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
    Assignable<typeof temporalFormatting, Contract.TemporalFormatting>,
    Assignable<Icons, Contract.Icons>,
    Assignable<Badges, Contract.Badges>,
    Assignable<ValueReading, Contract.ValueReading>,
    Assignable<PropertyWriting, Contract.PropertyWriting>,
    Assignable<ItemWindows, Contract.ItemWindows>,
    Assignable<Tooltips, Contract.Tooltips>,
    Assignable<InlineRenames, Contract.InlineRenames>,
    Assignable<Popups, Contract.Popups>,
    Assignable<typeof rovingFocus, Contract.RovingFocus>,
    Assignable<FileUploads, Contract.FileUploads>,
    Assignable<TableColumns, Contract.TableColumns>,
    Assignable<ItemRows, Contract.ItemRows>,
    Assignable<ItemSelection, Contract.ItemSelection>,
    Assignable<CollectionChange, Contract.CollectionChange>,
    Assignable<DomOperationContext, Contract.DomOperationContext>,
    Assignable<EffectContext, Contract.EffectContext>,
    Assignable<EventDispatchContext, Contract.EventDispatchContext>,
    Assignable<EventCompletionContext, Contract.EventCompletionContext>,
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
    Assignable<Contract.InlineRenameOptions, InlineRenameOptions>,
    Assignable<Contract.PopupOptions, PopupOptions>,
    Assignable<Contract.EventRegistration, WebUIPluginEventRegistration>,
    Assignable<Contract.PluginEngine, Parameters<NEStandardUIGlobalApi["registerEngine"]>[0]>
];
