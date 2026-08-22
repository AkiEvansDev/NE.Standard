//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region src/runtime/global-api.ts
function t() {
	return r();
}
function n(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = r();
	n.runtime = e, i(e, n);
}
function r() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], o = {
		...e,
		__pendingEvents: t,
		__pendingConverters: n,
		__pendingDomOperations: r,
		__pendingEffects: i,
		registerEvent(e, n = {}) {
			let r = window.NEStandardUI?.runtime;
			if (r !== void 0) {
				r.addEvent(e, n);
				return;
			}
			t.push({
				name: e,
				registration: n
			});
		},
		addEvent(e, t = {}) {
			this.registerEvent(e, t);
		},
		registerConverter(e, t) {
			let r = a(e, t), i = window.NEStandardUI?.runtime;
			if (i !== void 0) {
				i.addConverter(r);
				return;
			}
			n.push(r);
		},
		addConverter(e, t) {
			this.registerConverter(e, t);
		},
		registerDomOperation(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addDomOperation(e);
				return;
			}
			r.push(e);
		},
		addDomOperation(e) {
			this.registerDomOperation(e);
		},
		registerEffect(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEffect(e);
				return;
			}
			i.push(e);
		},
		addEffect(e) {
			this.registerEffect(e);
		}
	};
	return window.NEStandardUI = o, o;
}
function i(e, t) {
	for (let n of t.__pendingEvents ?? []) e.addEvent(n.name, n.registration);
	for (let n of t.__pendingConverters ?? []) e.addConverter(n);
	for (let n of t.__pendingDomOperations ?? []) e.addDomOperation(n);
	for (let n of t.__pendingEffects ?? []) e.addEffect(n);
	t.__pendingEvents = [], t.__pendingConverters = [], t.__pendingDomOperations = [], t.__pendingEffects = [];
}
function a(e, t) {
	return typeof t == "function" ? {
		name: e,
		convert: (e) => t(e.value)
	} : {
		...t,
		name: e
	};
}
//#endregion
//#region src/runtime/logger.ts
var o = "NE.Standard.UI";
function s(e, t) {
	u(console.warn, e, t);
}
function c(e, t) {
	u(console.error, e, t);
}
function l(e, t) {
	u(console.debug, e, t);
}
function u(e, t, n) {
	n === void 0 ? e(`${o} ${t}`) : e(`${o} ${t}`, n);
}
//#endregion
//#region src/addressing/dom-attributes.ts
var d = "data-ui-id", f = "data-ui-pc", p = "data-ui-key", ee = "data-ui-name", te = "data-ui-bind-", ne = "data-ui-items-host", re = "data-ui-empty-template", ie = "data-ui-group-template", ae = "data-ui-empty-placeholder", oe = "data-ui-group-header", se = "data-ui-group", ce = "data-ui-windowed", le = "data-ui-window-spacer", ue = "data-ui-form-id", de = "data-ui-hidden", fe = "data-ui-submit-form-id", pe = `[${d}]`;
function me(e) {
	return String(e).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function he(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
//#endregion
//#region src/metadata/metadata-index.ts
var ge = class {
	metadata;
	propertyDefinitionsById = /* @__PURE__ */ new Map();
	bindingsById = /* @__PURE__ */ new Map();
	bindingsByComponentAndPropertyId = /* @__PURE__ */ new Map();
	bindingsByComponentAndPropertyName = /* @__PURE__ */ new Map();
	eventsByComponentAndName = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	itemsTemplatesByComponentId = /* @__PURE__ */ new Map();
	itemsFilterSortByComponentId = /* @__PURE__ */ new Map();
	itemValuesByComponentId = /* @__PURE__ */ new Map();
	validationsByComponentId = /* @__PURE__ */ new Map();
	constructor(e) {
		this.metadata = e;
		for (let t of e.propertyDefinitions) this.addPropertyDefinition(t);
		for (let t of e.bindings) this.addBinding(t);
		for (let t of e.events) this.addEvent(t);
		for (let t of e.items) this.addItemsTemplate(t);
		for (let t of e.itemsFilterSort) this.addItemsFilterSort(t);
		for (let t of e.itemValues ?? []) this.addItemValues(t);
		for (let t of e.validations) this.addValidation(t);
	}
	getPropertyDefinition(e) {
		return this.propertyDefinitionsById.get(e);
	}
	getBindingById(e) {
		return this.bindingsById.get(e);
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (h(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Fe(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Fe(e, Pe(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ie(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(g(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(g(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e) {
		return this.itemValuesByComponentId.get(e)?.items ?? [];
	}
	getValidationsForComponent(e) {
		return this.validationsByComponentId.get(e) ?? [];
	}
	addPropertyDefinition(e) {
		e.propertyId.trim().length !== 0 && this.propertyDefinitionsById.set(e.propertyId, e);
	}
	addBinding(e) {
		let t = h(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = h(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Fe(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Fe(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = g(e.eventName), n = h(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ie(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = h(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = h(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = h(e.componentId);
		t > 0 && this.itemValuesByComponentId.set(t, e);
	}
	addValidation(e) {
		let t = h(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function m(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function _e(e) {
	return m(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ve(e) {
	return m(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ye(e) {
	return m(e, ["Property", "Event"]);
}
function be(e) {
	return e == null ? "SetProperty" : m(e, ["SetProperty", "Effect"]);
}
function xe(e) {
	return m(e, [
		"Required",
		"Equal",
		"NotEqual",
		"Greater",
		"GreaterOrEqual",
		"Less",
		"LessOrEqual",
		"Like",
		"In",
		"Regex",
		"LikeIgnoreCase"
	]);
}
function Se(e) {
	return m(e, ["Ascending", "Descending"]);
}
function Ce(e) {
	return m(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function we(e) {
	return m(e, [
		"Text",
		"Attribute",
		"RemoveAttribute",
		"ToggleAttribute",
		"Class",
		"ToggleClass",
		"Style",
		"Data",
		"Property"
	]);
}
function Te(e) {
	return m(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function Ee(e) {
	return m(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function h(e) {
	return typeof e == "number" ? e : e?.value ?? 0;
}
function De(e) {
	return m(e.kind, [
		"Value",
		"ContextRebuild",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function Oe(e) {
	return m(e, [
		"Navigate",
		"Focus",
		"ScrollTo",
		"Show",
		"Hide",
		"OpenDialog",
		"CloseDialog",
		"ShowNotification",
		"DownloadFile",
		"Scroll"
	]);
}
function ke(e) {
	return m(e, ["Auto", "Smooth"]);
}
function Ae(e) {
	return m(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function je(e) {
	return m(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Me(e) {
	return m(e, ["Horizontal", "Vertical"]);
}
function Ne(e) {
	return { value: h(e) };
}
function g(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Pe(e) {
	return e?.trim() ?? "";
}
function Fe(e, t) {
	return `${e}:${Pe(t)}`;
}
function Ie(e, t) {
	return `${e}:${g(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Le = class {
	dom;
	metadata;
	constructor(e, t) {
		this.dom = e, this.metadata = t;
	}
	getPropertyName(e) {
		return this.metadata.getPropertyDefinition(e)?.propertyName;
	}
	hasRenderedComponent(e) {
		return this.dom.findAllComponents(h(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = h(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = h(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${te}${he(r.propertyName)}="${me(a)}"]` : null;
		return i.map((i) => ({
			componentId: n,
			propertyId: e.propertyId,
			propertyName: r.propertyName,
			dynamicParameters: t,
			component: i,
			definition: r,
			bindingId: a,
			bindingSelector: o,
			address: {
				component: {
					id: n,
					dynamicParameters: [...t]
				},
				property: { name: r.propertyName }
			}
		}));
	}
	resolveOperationTarget(e, t) {
		let n = t.target;
		return n === "root" ? e.component : n != null && n.trim().length > 0 ? e.component.querySelector(n) : e.bindingSelector === null || e.component.matches(e.bindingSelector) ? e.component : e.component.querySelector(e.bindingSelector);
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Re(e) {
	return Ve(e, f);
}
function ze(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = He(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Be(e, t) {
	let n = Re(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ze(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ve(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function He(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Ue = class {
	root;
	componentsById = /* @__PURE__ */ new Map();
	staticComponentsById = /* @__PURE__ */ new Map();
	constructor(e) {
		this.root = e, this.rebuild();
	}
	rebuild() {
		this.componentsById.clear(), this.staticComponentsById.clear();
		let e = this.root.querySelectorAll(pe);
		for (let t of e) {
			let e = _(t);
			if (e <= 0) continue;
			let n = this.componentsById.get(e);
			n === void 0 && (n = [], this.componentsById.set(e, n)), n.push(t), !this.staticComponentsById.has(e) && Ge(t) && this.staticComponentsById.set(e, t);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		return (this.componentsById.get(e) ?? []).filter((e) => Be(e, t));
	}
	resolveNearestComponent(e, t) {
		let n = e;
		for (; n !== null;) {
			let e = n.closest(pe);
			if (e === null || !Ke(this.root, e)) return null;
			let r = _(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ze(e, Re(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function _(e) {
	return Ve(e, d);
}
function We(e) {
	let t = e.closest(pe), n = t === null ? 0 : _(t);
	return n > 0 ? n : null;
}
function Ge(e) {
	return Re(e) === 0;
}
function Ke(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/extensions/value-readers.ts
function qe(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function v(e) {
	return Je(e);
}
function Je(e) {
	return e == null;
}
function Ye(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	if (e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) return e.value;
	if (e instanceof HTMLDetailsElement) return e.open;
	if (e.classList.contains("ui-flyout")) return e.classList.contains("ui-flyout--open");
	if (e.classList.contains("ui-tabs") || e.classList.contains("ui-tabs-view")) return e.getAttribute("data-ui-tabs-selected");
	if (e.classList.contains("ui-tab-item")) {
		let t = e.getAttribute("data-ui-tab-order");
		return t === null ? null : Number(t);
	}
	if (e.classList.contains("ui-tab-item__label")) return e.getAttribute("data-ui-tab-caption");
	let t = e.querySelector("input[type=\"radio\"]:checked");
	return t === null ? null : t.value;
}
function Xe(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
var Ze = "data-ui-trim-input";
function Qe(e) {
	let t = Ye(e);
	return typeof t == "string" && e.hasAttribute(Ze) ? t.trim() : t;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var $e = "data-ui-bind-value", et = "data-ui-clear", tt = "data-ui-form-id", nt = ["change", "toggle"];
function rt(e) {
	let t = ve(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function it(e) {
	return ve(e) === "OnSubmit";
}
var at = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of nt) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("click", (e) => this.handleClear(e), !0);
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${et}]`);
		if (t === null) return;
		let n = t.closest(pe)?.querySelector(`[${$e}]`);
		n != null && (Xe(n), n.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.resolveWritableBinding(e.target);
		if (t !== null) {
			if (t.buffered) {
				this.bufferValue(e.target);
				return;
			}
			await this.syncValueAsync(e.target, t.bindingId);
		}
	}
	bufferValue(e) {
		if (e.getAttribute(tt) === null) {
			s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName });
			return;
		}
		this.bufferedElements.add(e);
	}
	async submitFormAsync(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (n.getAttribute(tt) !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = this.resolveWritableBinding(n);
			r !== null && t.push(this.syncValueAsync(n, r.bindingId));
		}
		await Promise.all(t);
	}
	resolveWritableBinding(e) {
		let t = e.getAttribute($e);
		if (t !== null) {
			let e = this.options.metadata.getBindingById(Number(t));
			return {
				bindingId: t,
				buffered: e !== void 0 && it(e.mode)
			};
		}
		for (let t of Array.from(e.attributes)) {
			if (!t.name.startsWith("data-ui-bind-")) continue;
			let e = this.options.metadata.getBindingById(Number(t.value));
			if (e !== void 0 && rt(e.mode)) return {
				bindingId: t.value,
				buffered: it(e.mode)
			};
		}
		return null;
	}
	async syncValueAsync(e, t) {
		let n = this.options.metadata.getBindingById(Number(t)), r = n === void 0 ? void 0 : this.options.metadata.getPropertyDefinition(n.propertyId)?.propertyName;
		if (r === void 0) {
			s("value binding engine: binding metadata not found.", { bindingIdText: t });
			return;
		}
		let i = this.options.dom.resolveNearestComponent(e, () => !0);
		if (i === null) return;
		let a = this.dispatchAndApplyAsync(e, r, i);
		this.pendingSyncByComponent.set(i.element, a);
		try {
			await a;
		} finally {
			this.pendingSyncByComponent.get(i.element) === a && this.pendingSyncByComponent.delete(i.element);
		}
	}
	async dispatchAndApplyAsync(e, t, n) {
		let r = await this.options.dispatcher.dispatchAsync({
			componentId: n.componentId,
			propertyName: t,
			dynamicParameters: n.dynamicParameters,
			value: Qe(e)
		});
		this.options.updateProcessor.applyChangeSet(r);
	}
	async whenSettled(e) {
		await this.pendingSyncByComponent.get(e);
	}
}, ot = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = g(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = g(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
			...t,
			name: n,
			domEventName: r
		};
		return this.registrations.set(n, i), (t.domEventName !== void 0 || t.attach !== void 0) && this.catalog.register({
			name: n,
			domEventName: t.domEventName,
			attach: t.attach
		}), i;
	}
	get(e) {
		return this.registrations.get(g(e));
	}
	markAttached(e) {
		let t = g(e);
		return this.attachedEvents.has(t) ? !1 : (this.attachedEvents.add(t), !0);
	}
}, st = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: Ne(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, ct = class {
	options;
	root;
	registry;
	requestFactory = new st();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new ot(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t);
		this.shouldAttach(n) && this.attachEvent(n);
	}
	shouldAttach(e) {
		return this.options.metadata.hasServerEvent(e.name) || this.options.interactionEngine.hasEvent(e.name) || this.options.interactionEngine.hasEvent(`before-${e.name}`) || this.options.interactionEngine.hasEvent(`after-${e.name}`);
	}
	attachEvent(e) {
		if (!this.registry.markAttached(e.name)) return;
		let t = (t) => {
			this.handleDomEventAsync(e.name, t).catch((e) => {
				c("event pipeline failed.", e);
			});
		}, n = this.options.eventCatalog.get(e.name);
		n === void 0 ? this.root.addEventListener(e.domEventName, t, !0) : n.attach({
			root: this.root,
			dispatch: t
		});
	}
	async handleDomEventAsync(e, t) {
		if (!(t.target instanceof Element)) return;
		let n = this.registry.get(e);
		if (n === void 0) return;
		let r = this.options.dom.resolveNearestComponent(t.target, (t) => this.shouldHandleComponent(e, t));
		if (r === null) return;
		let i = {
			domEvent: t,
			metadata: this.options.metadata.getEvent(r.componentId, e),
			component: r.element,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters
		};
		this.applyDomPolicy(n, i);
		let a = this.requestFactory.create(n, i);
		if (a === null) {
			this.options.interactionEngine.applyEvent({
				name: e,
				componentId: i.componentId,
				dynamicParameters: i.dynamicParameters,
				domEvent: t
			});
			return;
		}
		if (this.options.dispatcher.isPending(a)) {
			t.preventDefault();
			return;
		}
		let o = r.element.getAttribute(fe);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) {
				t.preventDefault();
				return;
			}
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(e, r.element) || this.options.dispatcher.isPending(a)) return;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: i.componentId,
			dynamicParameters: i.dynamicParameters,
			domEvent: t
		});
		let s = await this.options.dispatcher.dispatchAsync(a);
		this.options.applyChanges(s.changes), this.options.effects.applyAll(s.command?.effects, this.options.dom), this.options.afterEffects?.(), this.options.interactionEngine.applyEvent({
			name: `after-${e}`,
			componentId: i.componentId,
			dynamicParameters: i.dynamicParameters,
			domEvent: t
		});
	}
	async isRefusedValueEventAsync(e, t) {
		return nt.includes(e) ? (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0) : !1;
	}
	shouldHandleComponent(e, t) {
		return this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		lt(e.preventDefault, t) && t.domEvent.preventDefault(), lt(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function lt(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var ut = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
	}
	hasEvent(e) {
		return this.index.hasEvent(e);
	}
	hasEventForComponent(e, t) {
		return this.index.hasEventForComponent(e, t);
	}
	applyEvent(e) {
		let t = this.index.getEventInteractions(e.componentId, e.name);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !0);
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: h(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(h(e.reference.componentId), e.reference.propertyId);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (be(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!ft(i)) return;
		let a = this.evaluator.evaluate(e, r);
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(i, t, a, n);
		} finally {
			this.applyDepth--;
		}
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: dt(r, t),
			dom: this.options.dom
		});
	}
};
function dt(e, t) {
	if (t.length === 0) return e;
	let n = e.target;
	return n === void 0 || (n.dynamicParameters?.length ?? 0) > 0 ? e : {
		...e,
		target: {
			...n,
			dynamicParameters: t
		}
	};
}
function ft(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var pt = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return mt(t, e.operator, e.value);
	}
};
function mt(e, t, n) {
	switch (xe(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return Number(e) > Number(n);
		case "GreaterOrEqual": return Number(e) >= Number(n);
		case "Less": return Number(e) < Number(n);
		case "LessOrEqual": return Number(e) <= Number(n);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return ht(e, n);
		default: return !1;
	}
}
function ht(e, t) {
	try {
		return new RegExp(String(t ?? "")).test(String(e ?? ""));
	} catch (e) {
		return s("invalid interaction regex pattern.", {
			pattern: String(t ?? ""),
			error: e
		}), !1;
	}
}
//#endregion
//#region src/interactions/interaction-index.ts
var gt = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(g(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) yt(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(g(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(bt(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(xt(e, t)) ?? [];
	}
	addInteraction(e) {
		if (_t(e)) {
			let t = h(e.sourceEvent?.componentId), n = g(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(bt(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(bt(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (vt(e)) {
			let t = h(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(xt(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(xt(t, n), r)), r.push(e);
			}
		}
	}
};
function _t(e) {
	return ye(e.sourceKind) === "Event";
}
function vt(e) {
	return ye(e.sourceKind) === "Property";
}
function yt(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function bt(e, t) {
	return `${e}:${g(t)}`;
}
function xt(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/interactions/anchored-popup.ts
var St = 4, Ct = /* @__PURE__ */ new Map(), wt = !1, Tt = null;
function Et(e, t, n) {
	Ct.set(t, {
		anchor: e,
		options: n
	}), Ot(), Tt?.observe(t), At(e, t, n);
}
function Dt(e) {
	e != null && (Ct.delete(e), Tt?.unobserve(e));
}
function Ot() {
	wt || (wt = !0, document.addEventListener("scroll", kt, !0), window.addEventListener("resize", kt), Tt = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Ct.get(t.target);
			e !== void 0 && At(e.anchor, t.target, e.options);
		}
	}));
}
function kt() {
	for (let [e, t] of Ct) {
		if (!e.isConnected) {
			Dt(e);
			continue;
		}
		At(t.anchor, e, t.options);
	}
}
function At(e, t, n) {
	n.matchAnchorWidth === !0 && (t.style.width = `${e.getBoundingClientRect().width}px`);
	let r = e.getBoundingClientRect(), i = (n.crossAnchor ?? e).getBoundingClientRect(), a = t.getBoundingClientRect(), o = jt(r, a, n);
	t.style.top = `${Bt(Lt(r, i, a, o, n.gap), a.height, window.innerHeight)}px`, t.style.left = `${Bt(Rt(r, i, a, o, n.gap), a.width, window.innerWidth)}px`;
}
function jt(e, t, n) {
	let r = n.placement, i = Mt(t, r) + n.gap, a = Pt(e, r), o = Ft(r);
	return a >= i || Pt(e, o) <= a ? r : o;
}
function Mt(e, t) {
	return Nt(t) ? e.height : e.width;
}
function Nt(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Pt(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Ft(e) {
	return e.startsWith("top") ? `bottom${It(e)}` : e.startsWith("bottom") ? `top${It(e)}` : e.startsWith("left") ? `right${It(e)}` : `left${It(e)}`;
}
function It(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Lt(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : zt(t.top, t.height, n.height, r);
}
function Rt(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : zt(t.left, t.width, n.width, r);
}
function zt(e, t, n, r) {
	let i = It(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Bt(e, t, n) {
	return Math.max(St, Math.min(e, n - t - St));
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Vt = "ui-flyout", Ht = "ui-flyout--open", Ut = "ui-flyout__anchor", Wt = "ui-flyout__content", Gt = `.${Vt}.${Ht}`, Kt = "data-ui-flyout-no-backdrop-close", qt = "data-ui-flyout-no-escape-close", Jt = 4, Yt = `${Vt}--`, Xt = "bottom-start", Zt = new Set([
	"top-start",
	"top",
	"top-end",
	"bottom-start",
	"bottom",
	"bottom-end",
	"left-start",
	"left",
	"left-end",
	"right-start",
	"right",
	"right-end"
]), Qt = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(Gt)) this.place(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) t.type !== "attributes" || t.attributeName !== "class" || t.target instanceof HTMLElement && t.target.classList.contains(Vt) && this.place(t.target);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: ["class"],
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), document.addEventListener("click", (e) => this.handleOutsideClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Wt}`), n = e.querySelector(`:scope > .${Ut}`);
		if (t !== null) {
			if (!e.classList.contains(Ht)) {
				Dt(t);
				return;
			}
			Et(n ?? e, t, {
				placement: $t(e),
				gap: Jt
			});
		}
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ut}`)?.closest(`.${Vt}`) ?? null;
		t !== null && this.setOpen(t, !t.classList.contains(Ht));
	}
	handleOutsideClick(e) {
		let t = e.composedPath();
		for (let e of this.root.querySelectorAll(Gt)) t.includes(e) || e.hasAttribute(Kt) || this.setOpen(e, !1);
	}
	handleKeydown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.key !== "Escape")) for (let t of this.root.querySelectorAll(Gt)) t.hasAttribute(qt) || (e.preventDefault(), this.setOpen(t, !1));
	}
	setOpen(e, t) {
		e.classList.contains(Ht) !== t && (e.classList.toggle(Ht, t), this.place(e), e.dispatchEvent(new Event("toggle", { bubbles: !0 })), e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 })));
	}
};
function $t(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Yt)) continue;
		let e = t.slice(Yt.length);
		if (Zt.has(e)) return e;
	}
	return Xt;
}
//#endregion
//#region src/interactions/file-input-engine.ts
var en = "ui-file-input", tn = "ui-file-input__native", nn = "ui-file-input__field", rn = "ui-file-input__selection", an = "data-ui-file-pick", on = "/_ne/files/upload", sn = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0);
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${an}]`);
		if (t === null || t.hasAttribute("disabled")) return;
		let n = t.closest(`.${en}`)?.querySelector(`.${tn}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(tn)) return;
		let t = e.target, n = t.closest(`.${en}`), r = n?.querySelector(`.${nn}`);
		if (n == null || r == null) return;
		let i = t.files;
		if (i === null || i.length === 0) {
			r.value = "", this.publishSelection(n, "");
			return;
		}
		try {
			let e = await cn(i, (e) => {
				r.value = `Uploading... ${e}%`;
			});
			r.value = ln(i), this.publishSelection(n, e.selectionId);
		} catch (e) {
			r.value = "Upload failed.", this.publishSelection(n, ""), s("file upload failed.", e);
		}
	}
	publishSelection(e, t) {
		let n = e.querySelector(`.${rn}`);
		n === null || n.value === t || (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function cn(e, t) {
	return new Promise((n, r) => {
		let i = new FormData();
		for (let t = 0; t < e.length; t++) i.append("files", e[t], e[t].name);
		let a = new XMLHttpRequest();
		a.open("POST", on), a.responseType = "json", a.withCredentials = !0, a.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && t(Math.round(e.loaded / e.total * 100));
		}), a.addEventListener("load", () => {
			if (a.status < 200 || a.status >= 300) {
				r(/* @__PURE__ */ Error(`Upload failed with status ${a.status}.`));
				return;
			}
			let e = a.response?.selectionId;
			if (e === void 0 || e.length === 0) {
				r(/* @__PURE__ */ Error("Upload response carried no selection id."));
				return;
			}
			n({ selectionId: e });
		}), a.addEventListener("error", () => r(/* @__PURE__ */ Error("Upload failed."))), a.addEventListener("abort", () => r(/* @__PURE__ */ Error("Upload was aborted."))), a.send(i);
	});
}
function ln(e) {
	return e === null || e.length === 0 ? "" : e.length === 1 ? e[0].name : `${e.length} files`;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var un = "data-ui-fallback-src", dn = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
	}
	handleError(e) {
		let t = e.target;
		if (!(t instanceof HTMLImageElement)) return;
		let n = t.getAttribute(un);
		n !== null && (t.removeAttribute(un), t.src = n);
	}
}, fn = "data-ui-radio-value", pn = "ui-radio-group__input", mn = "ui-radio-group__dot", hn = "ui-radio-group", gn = "ui-radio-group__item", _n = "data-ui-radio-group-name", vn = "data-ui-radio-bind-value-id", yn = "data-ui-radio-disabled", bn = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`[${fn}]`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.target instanceof HTMLElement) {
					this.sync(t.target);
					continue;
				}
				for (let e of t.addedNodes) e instanceof HTMLElement && this.decorateAddedItems(e);
			}
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [fn],
			childList: !0,
			subtree: !0
		});
	}
	sync(e) {
		let t = e.getAttribute(fn);
		if (t !== null) for (let n of e.querySelectorAll(`.${pn}`)) n.checked = n.value === t;
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(gn) ? [e] : [...e.querySelectorAll(`.${gn}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${pn}`) !== null) return;
		let t = e.closest(`.${hn}`), n = t?.getAttribute(_n);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = pn, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(vn);
		a !== null && r.setAttribute("data-ui-bind-value", a), t.hasAttribute(yn) && (r.disabled = !0);
		let o = document.createElement("span");
		o.className = mn, e.prepend(r, o), this.sync(t);
	}
}, xn = "data-ui-search-debounce", Sn = "data-ui-search-min-length", Cn = "data-ui-search-manual", wn = "ui-search__input", Tn = "ui-select", En = "ui-select__popup", Dn = "ui-select__option", On = 300, kn = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(wn)) return;
		let t = e.target;
		An(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(xn), i = r === null ? On : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), i));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Cn)) return;
		let t = e.getAttribute(Sn), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function An(e) {
	let t = e.closest(`.${Tn}`), n = t?.querySelector(`.${En}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Sn), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${Dn}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	Mn(t, n, o && s === 0);
}
function jn(e) {
	let t = e.querySelector(`.${En}`);
	if (t !== null) {
		for (let e of t.querySelectorAll(`.${Dn}`)) e.style.display = "";
		Mn(e, t, !1);
	}
}
function Mn(e, t, n) {
	let r = t.querySelector(`:scope > [${ae}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${re}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(ae, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var Nn = "data-ui-select-value", Pn = "ui-select", Fn = "ui-select--open", In = "ui-select__trigger", Ln = "ui-select__trigger-content", Rn = "ui-select__placeholder", zn = "ui-input__affix-icon--prefix", Bn = "ui-select__popup", y = "ui-select__option", Vn = "ui-select__value-input", Hn = "data-ui-select-clear", Un = "ui-select__clear", Wn = "ui-search__input", Gn = "ui-text__title", Kn = 4, qn = new Set([
	"aria-selected",
	"tabindex",
	"style"
]);
function Jn(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(d), t.removeAttribute(p), t.removeAttribute(f), t.removeAttribute("data-ui-context");
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Yn = class {
	root;
	openSelect = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Pn}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.attributeName === Nn) {
					t.target instanceof HTMLElement && this.sync(t.target);
					continue;
				}
				if (t.type === "attributes" && qn.has(t.attributeName ?? "")) continue;
				let e = (t.target instanceof HTMLElement ? t.target : t.target.parentElement)?.closest(`.${Bn}`)?.closest(`.${Pn}`);
				e != null && this.sync(e);
			}
		}).observe(this.root, {
			attributes: !0,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), document.addEventListener("click", (e) => this.handleOutsideClick(e), !0);
	}
	sync(e) {
		let t = e.getAttribute(Nn);
		this.decorateOptions(e);
		let n = t === null ? null : e.querySelector(`.${Bn} .${y}[data-ui-key="${me(t)}"]`), r = n !== null, i = n === null ? null : n.querySelector(`.${Gn}`)?.textContent ?? n.textContent;
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${Wn}`);
		a !== null && (document.activeElement !== a && (a.value = i ?? ""), jn(e));
		let o = e.querySelector(`.${Rn}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of e.querySelectorAll(`.${y}`)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${Vn}`);
		s !== null && t !== null && (s.value = t);
		let c = e.querySelector(`.${Un}`);
		c !== null && (c.style.display = t === null ? "none" : "inline-flex");
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${In}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${Ln}`);
		if (t === null) {
			r?.remove();
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = Ln;
			let e = n.querySelector(`:scope > .${zn}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let i = t.cloneNode(!0);
		Jn(i), r.replaceChildren(...i.childNodes);
	}
	decorateOptions(e) {
		for (let t of e.querySelectorAll(`.${Bn} .${y}`)) t.hasAttribute("role") || t.setAttribute("role", "option"), t.hasAttribute("tabindex") || (t.tabIndex = 0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Hn}]`);
		if (t !== null) {
			let n = t.closest(`.${Pn}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), this.clearValue(n));
			return;
		}
		let n = e.target.closest(`.${In}`);
		if (n !== null) {
			let t = n.closest(`.${Pn}`);
			if (n.dataset.uiSelectTriggerMode === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let r = e.target.closest(`.${y}`);
		if (r === null) return;
		let i = r.closest(`.${Pn}`);
		i !== null && this.choose(i, r);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent)) return;
		if (e.key === "Escape" && this.openSelect !== null) {
			e.preventDefault(), this.close();
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`);
		if (t === null) return;
		let n = t.closest(`.${Pn}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOutsideClick(e) {
		this.openSelect !== null && (e.composedPath().includes(this.openSelect) || this.close());
	}
	toggle(e) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), e.classList.add(Fn), this.positionPopup(e), e.querySelector(`.${In}`)?.setAttribute("aria-expanded", "true"), this.openSelect = e, this.initializeFocus(e);
		}
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = document.activeElement instanceof Node && e.contains(document.activeElement) && document.activeElement.classList.contains(y);
		e.classList.remove(Fn), e.querySelector(`.${In}`)?.setAttribute("aria-expanded", "false"), Dt(e.querySelector(`.${Bn}`)), this.openSelect = null, t && e.querySelector(`.${In}`)?.focus();
	}
	positionPopup(e) {
		let t = e.querySelector(`.${In}`), n = e.querySelector(`.${Bn}`);
		t !== null && n !== null && Et(t, n, {
			placement: "bottom-start",
			gap: Kn,
			matchAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = [...e.querySelectorAll(`.${y}`)];
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		for (let e of t) e.tabIndex = e === n ? 0 : -1;
		n.focus();
	}
	moveFocus(e, t) {
		let n = [...e.querySelectorAll(`.${y}`)];
		if (n.length === 0) return;
		let r = n.findIndex((e) => e === document.activeElement), i = Math.max(0, Math.min(n.length - 1, (r === -1 ? 0 : r) + t));
		for (let e of n) e.tabIndex = -1;
		let a = n[i];
		a.tabIndex = 0, a.focus();
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0) return;
		e.setAttribute(Nn, n), this.sync(e);
		let r = e.querySelector(`.${Vn}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	clearValue(e) {
		e.removeAttribute(Nn), this.sync(e);
		let t = e.querySelector(`.${Vn}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Xn = "ui-slider__input", Zn = "ui-slider__value", Qn = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = h(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) this.reportClamped(n.querySelector(`.${Xn}`), e.value);
		});
	}
	reportClamped(e, t) {
		if (e === null || t == null || e.value === String(t)) return;
		let n = e.parentElement?.querySelector(`.${Zn}`);
		n != null && (n.textContent = e.value), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Xn)) return;
		let t = e.target.parentElement?.querySelector(`.${Zn}`);
		t != null && (t.textContent = e.target.value);
	}
}, $n = "ui-number-input__field", er = "data-ui-number-no-decimals", tr = "data-ui-number-no-negative", nr = "data-ui-number-no-thousands", rr = "data-ui-number-trim-zeros", ir = "data-ui-number-step", ar = "data-ui-number-min", or = "data-ui-number-max", sr = "data-ui-number-step-direction", cr = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.applyDisplayFormatting(this.root.querySelectorAll(`.${$n}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = h(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) this.applyDisplayFormatting(n.querySelectorAll(`.${$n}`));
		});
	}
	applyDisplayFormatting(e) {
		for (let t of e) t === document.activeElement || t.hasAttribute(nr) || t.value.length === 0 || (t.value = fr(t.value));
	}
	handleInput(e) {
		let t = lr(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(er), r = !t.hasAttribute(tr), i = t.selectionStart ?? t.value.length, a = ur(t.value, i, n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = lr(e.target);
		t !== null && t.value.includes(",") && (t.value = t.value.replace(/,/g, ""));
	}
	handleBlur(e) {
		let t = lr(e.target);
		t !== null && this.commitFormatting(t);
	}
	commitFormatting(e) {
		let t = e.value;
		if (e.hasAttribute(rr)) {
			let n = dr(t);
			n !== t && (t = n, e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
		!e.hasAttribute(nr) && t.length > 0 && (e.value = fr(t));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-number-step-direction]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${$n}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(ir) ?? "1"), i = t.getAttribute(sr) === "down" ? -1 : 1, a = (Number(n.value.replace(/,/g, "")) || 0) + r * i, o = n.getAttribute(ar), s = n.getAttribute(or);
		o !== null && (a = Math.max(a, Number(o))), s !== null && (a = Math.min(a, Number(s))), n.value = pr(a), n.dispatchEvent(new Event("change", { bubbles: !0 })), this.commitFormatting(n);
	}
};
function lr(e) {
	return e instanceof HTMLInputElement && e.classList.contains($n) ? e : null;
}
function ur(e, t, n, r) {
	let i = "", a = 0, o = !1, s = !1;
	for (let c = 0; c < e.length; c++) {
		let l = e[c], u = !1;
		l >= "0" && l <= "9" ? u = !0 : l === "-" && r && !s && i.length === 0 ? (u = !0, s = !0) : l === "." && n && !o && (u = !0, o = !0), u && (i += l), c < t && u && a++;
	}
	return {
		value: i,
		cursor: a
	};
}
function dr(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function fr(e) {
	let t = e.startsWith("-"), [n, r] = (t ? e.slice(1) : e).split("."), i = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return (t ? "-" : "") + i + (r === void 0 ? "" : "." + r);
}
function pr(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var mr = [
	"MMMM",
	"dddd",
	"yyyy",
	"MMM",
	"ddd",
	"dd",
	"MM",
	"yy",
	"HH",
	"hh",
	"mm",
	"ss",
	"tt",
	"d",
	"M",
	"H",
	"h",
	"m",
	"s"
];
function hr(e, t, n) {
	if (t == null || t.trim().length === 0) return `${b(e.getFullYear(), 4)}-${b(e.getMonth() + 1, 2)}-${b(e.getDate(), 2)} ${b(e.getHours(), 2)}:${b(e.getMinutes(), 2)}:${b(e.getSeconds(), 2)}`;
	let r = "", i = gr(t);
	for (let a = 0; a < t.length;) {
		let o = _r(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += vr(o, e, n, i), a += o.length;
	}
	return r;
}
function gr(e) {
	for (let t = 0; t < e.length;) {
		let n = _r(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function _r(e, t) {
	for (let n of mr) if (e.startsWith(n, t)) return n;
	return null;
}
function vr(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return b(t.getFullYear(), 4);
		case "yy": return b(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return b(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return b(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return b(i, 2);
		case "H": return String(i);
		case "hh": return b(a, 2);
		case "h": return String(a);
		case "mm": return b(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return b(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function b(e, t) {
	return String(e).padStart(t, "0");
}
//#endregion
//#region src/interactions/temporal-dom.ts
var x = "ui-temporal-input", yr = "ui-temporal-input__value-input", br = "data-ui-temporal-mode", xr = "data-ui-temporal-format", Sr = "data-ui-temporal-min", Cr = "data-ui-temporal-max", wr = "data-ui-temporal-step-unit", Tr = new Set([
	xr,
	Sr,
	Cr
]), Er = 2e3;
function S(e) {
	let t = e.getAttribute(br);
	return t === "time" || t === "date-time" ? t : "date";
}
function Dr(e) {
	let t = e.getAttribute(xr);
	return t === null || t.trim().length === 0 ? e.getAttribute("data-ui-temporal-default-format") ?? "" : t;
}
function Or(e) {
	let t = e.getAttribute(wr), n = Math.max(1, Math.trunc(Number(e.getAttribute("data-ui-temporal-step"))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function kr(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Ar(e) {
	return {
		monthNames: jr(e, "data-ui-temporal-months"),
		monthGenitiveNames: jr(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: jr(e, "data-ui-temporal-months-short"),
		dayNames: jr(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: jr(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function jr(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function C(e) {
	let t = e.querySelector(`.${yr}`);
	return t === null ? null : zr(t.value, S(e));
}
function Mr(e, t) {
	return zr(e.getAttribute(t) ?? "", S(e));
}
function Nr(e, t) {
	let n = e.querySelector(`.${yr}`);
	n !== null && (n.value = t === null ? "" : Br(t, S(e)), n.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Pr(e) {
	return Ir(e, Fr(e, /* @__PURE__ */ new Date()));
}
function Fr(e, t) {
	let n = Mr(e, Sr), r = Mr(e, Cr);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Ir(e, t) {
	let n = Or(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Lr = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?/, Rr = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function zr(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Rr.exec(n);
		return e === null ? null : new Date(Er, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Lr.exec(n);
	return r === null ? null : new Date(Number(r[1]), Number(r[2]) - 1, Number(r[3]), Number(r[4] ?? "0"), Number(r[5] ?? "0"), Number(r[6] ?? "0"));
}
function Br(e, t) {
	let n = `${Vr(e.getHours())}:${Vr(e.getMinutes())}:${Vr(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Vr(e.getMonth() + 1)}-${Vr(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Vr(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Hr = "ui-temporal-input__field", Ur = "ui-temporal-input__popup", Wr = "ui-temporal-input--open", Gr = "ui-temporal-input__day", Kr = "ui-temporal-input__month", qr = "ui-temporal-input__time-cell", Jr = 4, Yr = 6, Xr = "data-ui-temporal-toggle", Zr = "data-ui-temporal-first-day", Qr = "data-ui-temporal-nav", $r = "data-ui-temporal-day", ei = "data-ui-temporal-unit", ti = "data-ui-temporal-cell", ni = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	openPicker = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${x}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = h(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) this.applyDisplay(n instanceof HTMLElement && n.classList.contains("ui-temporal-input") ? [n] : n.querySelectorAll(`.${x}`));
		}), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) t.type !== "attributes" || !Tr.has(t.attributeName ?? "") || !(t.target instanceof HTMLElement) || !t.target.classList.contains("ui-temporal-input") || (this.applyDisplay([t.target]), t.target === this.openPicker && this.renderPopup(t.target));
		}).observe(this.root, {
			attributes: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), document.addEventListener("click", (e) => this.handleOutsideClick(e), !0);
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = t.querySelector(`.${Hr}`);
			if (e === null || e === document.activeElement) continue;
			let n = t.querySelector(".ui-temporal-input__value-input")?.value ?? "", r = zr(n, S(t));
			if (r !== null) {
				e.value = hr(r, Dr(t), Ar(t));
				continue;
			}
			n.length === 0 && (e.value = "");
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Hr)) return;
		let t = e.target.closest(`.${x}`)?.querySelector(`.${yr}`);
		t != null && (t.value = e.target.value.trim(), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Hr)) return;
		let t = e.target.closest(`.${x}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xr}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${x}`));
			return;
		}
		let n = e.target.closest(`.${Ur}`)?.closest(`.${x}`);
		if (n == null) return;
		let r = e.target.closest(`[${Qr}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Qr) ?? "");
			return;
		}
		let i = e.target.closest(`[${$r}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute($r) ?? "");
			return;
		}
		let a = e.target.closest(`[${ti}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${ei}]`)?.getAttribute(ei);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(ti)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (t.startsWith("month:")) {
			n.view = new Date(n.view.getFullYear(), Number(t.slice(6)), 1), n.pane = "days", this.renderPopup(e);
			return;
		}
		if (t.startsWith("unit:")) {
			n.timeUnit = t.slice(5), this.renderPopup(e);
			return;
		}
		switch (t) {
			case "previous":
				n.view = Ci(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Ci(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, Pr(e));
				return;
			case "clear":
				this.commit(e, null), this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = zr(t, "date");
		if (n === null) return;
		let r = C(e) ?? Pr(e), i = new Date(n.getFullYear(), n.getMonth(), n.getDate(), r.getHours(), r.getMinutes(), r.getSeconds());
		this.getState(e).focusedDay = i, this.commit(e, i), S(e) === "date" && this.close();
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = new Date(C(e) ?? Pr(e));
		t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n);
		let i = si(Or(e)), a = i.indexOf(t), o = a === i.length - 1;
		o || (this.getState(e).timeUnit = i[a + 1]), this.commit(e, r), o && this.close();
	}
	commit(e, t) {
		Nr(e, t), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent)) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Hr)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${x}`));
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.key === "Escape") {
			e.preventDefault(), this.close();
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains(qr)) {
			mi(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Gr)) return;
		let n = zr(e.target.getAttribute($r) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Br(n, "date"));
			return;
		}
		let r = yi(n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = xi(r), this.renderPopup(t, !0);
	}
	handleOutsideClick(e) {
		this.openPicker !== null && (e.composedPath().includes(this.openPicker) || this.close());
	}
	toggle(e) {
		if (e === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let t = this.getState(e), n = C(e);
		t.pane = "days", t.view = xi(n ?? Fr(e, /* @__PURE__ */ new Date())), t.focusedDay = n, e.classList.add(Wr), e.querySelector(`[${Xr}]`)?.setAttribute("aria-expanded", "true"), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = document.activeElement instanceof Node && e.querySelector(`.${Ur}`)?.contains(document.activeElement) === !0;
		e.classList.remove(Wr), e.querySelector(`[${Xr}]`)?.setAttribute("aria-expanded", "false"), Dt(e.querySelector(`.${Ur}`)), this.openPicker = null, t && e.querySelector(`.${Hr}`)?.focus({ preventScroll: !0 });
	}
	positionPopup(e) {
		let t = e.querySelector(`.${x}__row`), n = e.querySelector(`[${Xr}]`), r = e.querySelector(`.${Ur}`);
		t !== null && r !== null && Et(t, r, {
			placement: "bottom-end",
			gap: Jr,
			crossAnchor: n ?? void 0
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: xi(C(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			timeUnit: "hour",
			focusedDay: C(e)
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${Ur}`);
		if (n === null) return;
		let r = S(e), i = this.getState(e), a = Ar(e), o = C(e);
		n.replaceChildren();
		let s = T("div", `${x}__panes`);
		s.append(ri(e, i, a, o)), r === "date-time" && s.append(oi(e, i, o)), n.append(s, fi(r)), pi(n, i, o, t), this.positionPopup(e);
	}
};
function ri(e, t, n, r) {
	let i = T("div", `${x}__calendar`), a = T("div", `${x}__calendar-header`);
	a.append(w("previous", "‹"));
	let o = w("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${x}__calendar-label`), a.append(o), a.append(w("next", "›")), i.append(a), i.append(t.pane === "days" ? ii(e, t, n, r) : ai(t, n)), i;
}
function ii(e, t, n, r) {
	let i = vi(e), a = T("div", `${x}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = T("span", `${x}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = T("div", `${x}__days`), s = bi(/* @__PURE__ */ new Date()), c = r === null ? null : bi(r), l = Si(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = E(l, n), i = T("button", Gr);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute($r, Br(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${Gr}--outside`), wi(r, s) && i.classList.add(`${Gr}--today`), c !== null && wi(r, c) && (i.classList.add(`${Gr}--selected`), i.setAttribute("aria-selected", "true")), gi(e, r) && (i.disabled = !0), o.append(i);
	}
	let u = T("div", `${x}__calendar-pane`);
	return u.append(a, o), u;
}
function ai(e, t) {
	let n = T("div", `${x}__months`);
	for (let r = 0; r < 12; r++) {
		let i = T("button", Kr);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Qr, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${Kr}--selected`), n.append(i);
	}
	return n;
}
function oi(e, t, n) {
	let r = Or(e), i = si(r), a = i.includes(t.timeUnit) ? t.timeUnit : i[0], o = T("div", `${x}__time`), s = T("div", `${x}__time-header`);
	for (let e of i) {
		if (s.childElementCount > 0) {
			let e = T("span", `${x}__time-separator`);
			e.textContent = ":", s.append(e);
		}
		let t = w(`unit:${e}`, li(n, e));
		t.classList.add(`${x}__time-segment`), e === a && t.classList.add(`${x}__time-segment--selected`), s.append(t);
	}
	return o.append(s, di(e, a, ci(r, a), n)), o;
}
function si(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function ci(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function li(e, t) {
	let n = ui(e, t);
	return n === null ? "--" : String(n).padStart(2, "0");
}
function ui(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function di(e, t, n, r) {
	let i = T("div", `${x}__time-grid`);
	i.setAttribute(ei, t);
	let a = t === "hour" ? 24 : 60, o = ui(r, t);
	i.style.gridTemplateColumns = `repeat(${Math.min(Yr, Math.ceil(a / n))}, minmax(2rem, 1fr))`;
	for (let s = 0; s < a; s += n) {
		let n = T("button", qr);
		n.type = "button", n.textContent = String(s).padStart(2, "0"), n.setAttribute(ti, String(s)), s === o && (n.classList.add(`${qr}--selected`), n.setAttribute("aria-selected", "true")), _i(e, t, s, r) && (n.disabled = !0), i.append(n);
	}
	return i;
}
function fi(e) {
	let t = T("div", `${x}__popup-footer`);
	return t.append(w("now", e === "date" ? "Today" : "Now")), t.append(w("clear", "Clear")), e === "date-time" && t.append(w("done", "Done")), t;
}
function w(e, t) {
	let n = T("button", `${x}__nav`);
	return n.type = "button", n.textContent = t, n.setAttribute(Qr, e), n;
}
function T(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function pi(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Gr}`)];
	if (i.length === 0) return;
	let a = Br(bi(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute($r) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (o.tabIndex = 0, r && o.focus({ preventScroll: !0 }));
}
function mi(e) {
	let t = hi(e.key);
	if (t === 0) return;
	let n = e.target, r = [...n.closest(`[${ei}]`)?.querySelectorAll(`.${qr}`) ?? []], i = r.indexOf(n);
	i !== -1 && (e.preventDefault(), r[Math.max(0, Math.min(r.length - 1, i + t))].focus());
}
function hi(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -6;
		case "ArrowDown": return Yr;
		default: return 0;
	}
}
function gi(e, t) {
	let n = Mr(e, Sr), r = Mr(e, Cr);
	return n !== null && t.getTime() < bi(n).getTime() || r !== null && t.getTime() > bi(r).getTime();
}
function _i(e, t, n, r) {
	let i = Mr(e, Sr), a = Mr(e, Cr);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function vi(e) {
	let t = Number(e.getAttribute(Zr));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function yi(e, t) {
	switch (t) {
		case "ArrowLeft": return E(e, -1);
		case "ArrowRight": return E(e, 1);
		case "ArrowUp": return E(e, -7);
		case "ArrowDown": return E(e, 7);
		case "PageUp": return Ci(e, -1);
		case "PageDown": return Ci(e, 1);
		case "Home": return E(e, -e.getDay());
		case "End": return E(e, 6 - e.getDay());
		default: return null;
	}
}
function bi(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
function xi(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function Si(e, t) {
	let n = xi(e);
	return E(n, -((n.getDay() - t + 7) % 7));
}
function E(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Ci(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function wi(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var Ti = "data-ui-context-menu-owner", Ei = "data-ui-context-menu", Di = "ui-context-menu--open", Oi = 4, ki = class {
	root;
	openMenu = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), document.addEventListener("pointerdown", (e) => this.handleOutside(e), !0), document.addEventListener("click", (e) => this.handleInside(e), !1), document.addEventListener("keydown", (e) => this.handleKeydown(e), !0), window.addEventListener("blur", () => this.close());
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Ti}]`);
		if (t === null) return;
		let n = t.querySelector(`[${Ei}]`);
		n === null || n.closest(`[${Ti}]`) !== t || (e.preventDefault(), this.close(), this.open(n, e.clientX, e.clientY));
	}
	open(e, t, n) {
		e.classList.add(Di), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${Ai(t, r.width, window.innerWidth)}px`, e.style.top = `${Ai(n, r.height, window.innerHeight)}px`, e.querySelector("a, button")?.focus({ preventScroll: !0 });
	}
	handleOutside(e) {
		this.openMenu === null || e.composedPath().includes(this.openMenu) || this.close();
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && this.close();
	}
	handleKeydown(e) {
		this.openMenu !== null && e instanceof KeyboardEvent && e.key === "Escape" && (e.preventDefault(), this.close());
	}
	close() {
		this.openMenu !== null && (this.openMenu.classList.remove(Di), this.openMenu = null);
	}
};
function Ai(e, t, n) {
	return Math.max(Oi, Math.min(e, n - t - Oi));
}
//#endregion
//#region src/interactions/roving-focus.ts
function ji(e) {
	let t = e.items.filter(Ni);
	if (t.length === 0) return null;
	let n = Pi(e.key);
	if (n !== null) return n === "first" ? t[0] : t[t.length - 1];
	let r = Fi(e.key, e.axis);
	if (r === 0) return null;
	let i = e.current === null ? -1 : t.indexOf(e.current);
	if (i === -1) return r > 0 ? t[0] : t[t.length - 1];
	let a = i + r;
	return a >= 0 && a < t.length ? t[a] : e.loop ?? !0 ? t[(a + t.length) % t.length] : null;
}
function Mi(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Ni(e) {
	return e.getClientRects().length === 0 ? !1 : !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function Pi(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Fi(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ii(e) {
	let t = (e ?? "").split("+").map((e) => e.trim()).filter((e) => e.length > 0);
	if (t.length === 0) return null;
	let n = !1, r = !1, i = !1, a = !1, o = null;
	for (let e of t) switch (e.toLowerCase()) {
		case "ctrl":
		case "control":
			n = !0;
			break;
		case "shift":
			r = !0;
			break;
		case "alt":
		case "option":
			i = !0;
			break;
		case "meta":
		case "cmd":
		case "command":
		case "win":
			a = !0;
			break;
		default:
			o = zi(e);
			break;
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Li(e, t) {
	return t.code === e.code && t.ctrlKey === e.ctrl && t.shiftKey === e.shift && t.altKey === e.alt && t.metaKey === e.meta;
}
function Ri(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function zi(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Bi[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Bi[t] ?? null;
}
var Bi = {
	",": "Comma",
	".": "Period",
	"/": "Slash",
	"\\": "Backslash",
	";": "Semicolon",
	"'": "Quote",
	"[": "BracketLeft",
	"]": "BracketRight",
	"-": "Minus",
	"=": "Equal",
	"`": "Backquote",
	Delete: "Delete",
	Backspace: "Backspace",
	Enter: "Enter",
	Escape: "Escape",
	Esc: "Escape",
	Space: "Space",
	Tab: "Tab",
	Insert: "Insert",
	Home: "Home",
	End: "End",
	Pageup: "PageUp",
	Pagedown: "PageDown",
	Up: "ArrowUp",
	Down: "ArrowDown",
	Left: "ArrowLeft",
	Right: "ArrowRight",
	Arrowup: "ArrowUp",
	Arrowdown: "ArrowDown",
	Arrowleft: "ArrowLeft",
	Arrowright: "ArrowRight"
}, Vi = "ui-menu", Hi = "ui-menu-item", Ui = "ui-menu-item--selected", Wi = "ui-context-menu", Gi = "ui-orientation--horizontal", Ki = "data-ui-menu-item-kind", qi = `[${Ki}="header"], [${Ki}="separator"]`, Ji = "data-ui-menu-shortcut", Yi = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.applyTabStops(), this.root instanceof Node && new MutationObserver(() => {
			this.shortcutsStale = !0, this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Ji]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Vi}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && Mi(t, t.find((e) => e.classList.contains(Ui)) ?? t.find(Ni) ?? t[0]);
		}
	}
	handleKeydown(e) {
		!(e instanceof KeyboardEvent) || e.defaultPrevented || this.handleNavigation(e) || this.handleShortcut(e);
	}
	handleNavigation(e) {
		if (!(e.target instanceof Element)) return !1;
		let t = e.target.closest(`.${Hi}`), n = t?.closest(`.${Vi}`) ?? null;
		if (t === null || n === null) return !1;
		let r = this.ownItems(n), i = ji({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Gi) ? "horizontal" : "vertical"
		});
		return i === null ? !1 : (e.preventDefault(), Mi(r, i), i.focus(), !0);
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hi}`), n = t?.closest(`.${Vi}`) ?? null;
		t !== null && n !== null && Mi(this.ownItems(n), t);
	}
	handleShortcut(e) {
		if (this.shortcutsStale && this.rebuildShortcuts(), !(this.shortcuts.size === 0 || Xi(e))) {
			for (let t of this.shortcuts.values()) if (!(t === null || !Li(t.shortcut, e))) {
				if (t.element.getClientRects().length === 0 || t.element.matches(":disabled, .ui-disabled")) return;
				e.preventDefault(), t.element.click();
				return;
			}
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${Ji}]`)) {
			if (e.closest(`.${Wi}`) !== null) continue;
			let t = Ii(e.getAttribute(Ji));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(Ji)
				});
				continue;
			}
			let n = Ri(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(Ji),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return [...e.querySelectorAll(`.${Hi}:not(${qi})`)].filter((t) => t.closest(`.${Vi}`) === e);
	}
};
function Xi(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var Zi = "ne.ui", Qi = /* @__PURE__ */ new Set(), $i = class {
	read(e, t) {
		let n = this.resolveKey(e, t);
		if (n === null) return null;
		try {
			return window.localStorage.getItem(n);
		} catch (e) {
			return s("reading client state failed.", {
				key: n,
				error: e
			}), null;
		}
	}
	write(e, t, n) {
		let r = this.resolveKey(e, t);
		if (r !== null) try {
			n === null ? window.localStorage.removeItem(r) : window.localStorage.setItem(r, n);
		} catch (e) {
			s("writing client state failed.", {
				key: r,
				error: e
			});
		}
	}
	readJson(e, t) {
		let n = this.read(e, t);
		if (n === null) return null;
		try {
			return JSON.parse(n);
		} catch {
			return this.write(e, t, null), null;
		}
	}
	writeJson(e, t, n) {
		this.write(e, t, n == null ? null : JSON.stringify(n));
	}
	resolveKey(e, t) {
		let n = e.getAttribute(ee);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Qi.has(n) || (Qi.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Zi}:${n}:${t}`;
	}
}, ea = "ui-menu", ta = "ui-menu-item", na = "ui-menu-item--selected", ra = "ui-menu--collapsed", ia = "ui-menu__item", aa = "ui-menu__submenu", oa = "data-ui-menu-group", D = "data-ui-menu-open", sa = "data-ui-menu-flyout", ca = "data-ui-menu-collapse", la = "data-ui-key", ua = "menu-collapsed", da = "menu-open-group", fa = class {
	root;
	store = new $i();
	restored = /* @__PURE__ */ new WeakSet();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.restoreAll(), this.root instanceof Node && new MutationObserver(() => this.restoreAll()).observe(this.root, {
			childList: !0,
			subtree: !0
		});
	}
	restoreAll() {
		for (let e of this.root.querySelectorAll(`.${ea}`)) this.restored.has(e) || (this.restored.add(e), this.restore(e));
	}
	restore(e) {
		e.querySelector(`[${ca}]`) !== null && this.applyCollapsed(e, this.store.read(e, ua) === "true"), e.classList.contains(ra) || this.openResolvedGroup(e);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${na}`), e);
		if (t !== null) {
			this.openInline(t);
			return;
		}
		let n = this.store.read(e, da), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ca}]`);
		if (t !== null) {
			let n = t.closest(`.${ea}`);
			n !== null && (e.preventDefault(), this.toggleCollapsed(n));
			return;
		}
		let n = e.target.closest(`.${ta}`);
		if (n !== null && this.openFlyout !== null && this.openFlyout.contains(n)) {
			this.closeFlyout();
			return;
		}
		if (n === null) {
			this.closeFlyout();
			return;
		}
		let r = this.ownGroupOf(n);
		if (r === null) {
			this.closeFlyout();
			return;
		}
		e.preventDefault();
		let i = r.closest(`.${ea}`);
		i !== null && (i.classList.contains(ra) ? this.toggleFlyout(i, r, n) : this.toggleInline(i, r));
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && this.closeFlyout();
	}
	toggleCollapsed(e) {
		let t = !e.classList.contains(ra);
		this.applyCollapsed(e, t), this.store.write(e, ua, t ? "true" : "false"), t || this.openResolvedGroup(e);
	}
	applyCollapsed(e, t) {
		e.classList.toggle(ra, t);
		for (let n of e.querySelectorAll(`[${ca}]`)) n.setAttribute("aria-expanded", t ? "false" : "true");
		this.closeFlyout(), this.closeGroups(e);
	}
	toggleInline(e, t) {
		if (t.hasAttribute(D)) {
			t.removeAttribute(D), this.store.write(e, da, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), this.store.write(e, da, t.getAttribute(la));
	}
	openInline(e) {
		e.setAttribute(D, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${oa}][${D}]`)) t.removeAttribute(D);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(D, ""), r.setAttribute(sa, ""), this.openFlyout = r, Et(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, Dt(e), e.removeAttribute(sa), e.parentElement?.removeAttribute(D));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${oa}]`)) if (n.getAttribute(la) === t) return n;
		return null;
	}
	ownGroupOf(e) {
		let t = e.closest(`.${ia}`);
		return t !== null && t.hasAttribute(oa) ? t : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${oa}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${aa}`);
	}
}, pa = "ui-tabs", ma = "ui-tab-header", ha = "ui-tab-header--selected", ga = "data-ui-tabs-selected", _a = "data-ui-tab-key", va = "data-ui-tab-page", ya = "data-ui-bind-selected-key", ba = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${pa}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) t.type === "attributes" && t.attributeName === ga && t.target instanceof HTMLElement && this.apply(t.target);
		}).observe(this.root, {
			attributes: !0,
			subtree: !0,
			attributeFilter: [ga]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute(ga) ?? "", n = this.ownHeaders(e), r = null;
		for (let e of n) {
			let n = (e.getAttribute(_a) ?? "") === t;
			e.classList.toggle(ha, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (r = e);
		}
		Mi(n, r);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(va) ?? "") !== t;
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ma}`);
		if (t === null || t.matches(":disabled, .ui-disabled")) return;
		let n = t.closest(`.${pa}`), r = t.getAttribute(_a);
		n === null || r === null || t.closest(`.${pa}`) !== n || (e.preventDefault(), this.select(n, r));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ma}`), n = t?.closest(`.${pa}`) ?? null;
		if (t === null || n === null) return;
		let r = ji({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(_a) ?? ""), r.focus());
	}
	select(e, t) {
		t.length === 0 || e.getAttribute(ga) === t || (e.setAttribute(ga, t), this.apply(e), e.hasAttribute(ya) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	ownHeaders(e) {
		return [...e.querySelectorAll(`.${ma}`)].filter((t) => t.closest(`.${pa}`) === e);
	}
	ownPages(e) {
		return [...e.querySelectorAll(`[${va}]`)].filter((t) => t.closest(`.${pa}`) === e);
	}
}, xa = "ui-breadcrumbs", Sa = "ui-breadcrumbs__item", Ca = "ui-breadcrumb", wa = "ui-breadcrumb--current", Ta = "ui-hidden", Ea = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), this.root instanceof Node && new MutationObserver(() => this.applyAll()).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: ["class"]
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${xa}`)) this.apply(e);
	}
	apply(e) {
		let t = [...e.querySelectorAll(`.${Sa}`)].filter((t) => t.closest(`.${xa}`) === e && !t.classList.contains(Ta)).map((e) => e.querySelector(`.${Ca}`)).filter((e) => e !== null && !e.classList.contains(Ta)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(wa, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
}, O = "ui-tabs-view", k = "ui-tab-item", Da = "ui-tab-item__label", Oa = "ui-tab-item__close", ka = "ui-tab-item__rename", Aa = "ui-tab-item__caption", ja = ".ui-button-content__title", Ma = "ui-tab-item--dragging", Na = "ui-tab-item__page", Pa = "ui-tab-item--selected", Fa = "data-ui-key", Ia = "data-ui-tab-caption", La = "data-ui-tabs-renamable", Ra = "data-ui-tabs-reorderable", za = "data-ui-tab-order", Ba = "data-ui-tabs-selected", Va = "data-ui-bind-selected-key", Ha = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root instanceof Node && new MutationObserver(() => this.applyAll()).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Ba]
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${O}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		if (t.length === 0) return;
		let n = e.getAttribute(Ba) ?? "";
		if (!t.some((e) => A(e) === n)) {
			this.select(e, A(t[0]));
			return;
		}
		let r = e.hasAttribute(Ra), i = [], a = null;
		for (let e of t) {
			let t = A(e) === n;
			e.classList.toggle(Pa, t);
			let o = e.querySelector(`.${Aa}`);
			o !== null && (o.draggable = r);
			let s = e.querySelector(`.${Da}`);
			s !== null && (s.setAttribute("aria-selected", t ? "true" : "false"), i.push(s), t && (a = s));
			for (let n of e.querySelectorAll(`.${Na}`)) n.hidden = !t;
		}
		Mi(i, a);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Da}`), n = t?.closest(`.${O}`) ?? null;
		if (t === null || n === null || t.matches(":disabled, .ui-disabled")) return;
		let r = t.closest(`.${k}`);
		r === null || r.closest(`.${O}`) !== n || (e.preventDefault(), this.select(n, A(r)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Oa}`), r = n?.closest(`.${k}`) ?? null;
		return n === null || r === null ? !1 : (e.preventDefault(), e.stopPropagation(), r.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Da}`), n = t?.closest(`.${O}`) ?? null;
		t === null || n === null || !n.hasAttribute(La) || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(ja) ?? e;
		if (t === null || t.querySelector(`.${ka}`) !== null) return;
		let r = document.createElement("input");
		r.type = "text", r.className = ka, r.value = e.getAttribute(Ia) ?? n.textContent?.trim() ?? "", Wa(r, n, t);
		let i = !1, a = (t) => {
			if (i) return;
			i = !0;
			let a = r.value.trim();
			r.remove(), n.style.visibility = "", t && a.length > 0 && a !== (e.getAttribute(Ia) ?? "") && (e.setAttribute(Ia, a), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }))), e.focus();
		};
		r.addEventListener("keydown", (e) => {
			if (e.key === "Enter") a(!0);
			else if (e.key === "Escape") a(!1);
			else return;
			e.preventDefault(), e.stopPropagation();
		}), r.addEventListener("blur", () => a(!0)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.select();
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Da}`), n = t?.closest(`.${O}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map((e) => e.querySelector(`.${Da}`)).filter((e) => e !== null), i = ji({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${k}`);
		a !== null && this.select(n, A(a)), i.focus();
	}
	handleDragStart(e) {
		let t = Ua(e);
		t !== null && (t.classList.add(Ma), e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", A(t))));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Aa}`)?.closest(`.${k}`) ?? null, n = t?.closest(`.${O}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Ma}`);
		if (r === null || r === t) return;
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move");
		let i = t.querySelector(`.${Aa}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = e.clientX < i.left + i.width / 2;
		t.parentElement?.insertBefore(r, a ? t : t.nextElementSibling);
	}
	handleDragEnd(e) {
		let t = Ua(e);
		t !== null && (t.classList.remove(Ma), this.commitOrder(t));
	}
	commitOrder(e) {
		let t = Ga(e.previousElementSibling), n = Ga(e.nextElementSibling), r = t === null && n === null ? 0 : t === null ? n - 1 : n === null ? t + 1 : (t + n) / 2;
		Ga(e) !== r && (e.setAttribute(za, String(r)), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	select(e, t) {
		t.length === 0 || e.getAttribute(Ba) === t || (e.setAttribute(Ba, t), this.apply(e), e.hasAttribute(Va) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	ownItems(e) {
		return [...e.querySelectorAll(`.${k}`)].filter((t) => t.closest(`.${O}`) === e);
	}
};
function Ua(e) {
	return e.target instanceof Element ? e.target.closest(`.${Aa}`)?.closest(`.${k}`) ?? null : null;
}
function Wa(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t);
	e.style.left = `${r.left - i.left}px`, e.style.top = `${r.top - i.top}px`, e.style.width = `${r.width}px`, e.style.height = `${r.height}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
function Ga(e) {
	let t = e?.getAttribute(za) ?? null;
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function A(e) {
	return e.closest(`[${Fa}]`)?.getAttribute(Fa) ?? "";
}
//#endregion
//#region src/interactions/time-segment-engine.ts
var Ka = "ui-temporal-input__segments", j = "ui-temporal-input__segment", qa = "ui-temporal-input__segment-literal", Ja = "ui-temporal-input__segment--empty", Ya = "data-ui-temporal-segment", Xa = "data-ui-temporal-step-direction", Za = "data-ui-temporal-readonly", Qa = "data-ui-temporal-segments-of", $a = "--", eo = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${x}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = h(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) this.applyAll(n instanceof HTMLElement && n.classList.contains("ui-temporal-input") ? [n] : n.querySelectorAll(`.${x}`));
		}), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) t.type !== "attributes" || !Tr.has(t.attributeName ?? "") || t.target instanceof HTMLElement && t.target.classList.contains("ui-temporal-input") && this.applyAll([t.target]);
		}).observe(this.root, {
			attributes: !0,
			subtree: !0
		}), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("wheel", (e) => this.handleWheel(e), {
			capture: !0,
			passive: !1
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) S(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		let t = e.querySelector(`.${Ka}`);
		if (t === null) return;
		let n = Dr(e), r = Ar(e), i = C(e);
		t.getAttribute(Qa) !== n && (t.replaceChildren(...to(n).map((e) => ro(e))), t.setAttribute(Qa, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(Ya);
			if (t === null) {
				n.textContent = io(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = ao(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(Ja, i === null), n.tabIndex = e.hasAttribute(Za) ? -1 : 0, oo(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent)) return;
		let t = so(e.target);
		if (t === null) return;
		let n = t.closest(`.${x}`), r = t.getAttribute(Ya);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), lo(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), Nr(n, null), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = uo(e.key, Ar(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key));
	}
	handleWheel(e) {
		if (!(e instanceof WheelEvent)) return;
		let t = so(e.target);
		if (t === null || t !== document.activeElement) return;
		e.preventDefault();
		let n = t.closest(`.${x}`);
		this.resetBuffer(n), this.applyStep(n, t.getAttribute(Ya), e.deltaY < 0 ? 1 : -1);
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${Xa}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xa}]`);
		if (t === null) return;
		let n = t.closest(`.${x}`);
		if (n === null || n.hasAttribute(Za)) return;
		e.preventDefault();
		let r = co(n) ?? n.querySelector(`.${j}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(Ya), t.getAttribute(Xa) === "up" ? 1 : -1));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${j}`) : null;
		if (t === null) return;
		let n = t.closest(`.${x}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n) {
		if (t === "meridiem") {
			let t = C(e);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm");
			return;
		}
		let r = this.baseValue(e), i = fo(t), a = kr(Or(e), i) * n, o = i === "hour" ? 24 : 60, s = ((po(r, i) + a) % o + o) % o;
		this.write(e, mo(r, i, s));
	}
	applyDigit(e, t, n, r) {
		let i = this.editState(e), a = n === "hour" ? 23 : n === "hour12" ? 12 : 59, o = +(n === "hour12"), s = (i.unit === n ? i.buffer : "") + r;
		Number(s) > a && (s = r);
		let c = Number(s), l = s.length >= 2 || c * 10 > a;
		if (i.unit = n, i.buffer = l ? "" : s, c >= o) {
			let t = this.baseValue(e);
			this.write(e, n === "hour12" ? mo(t, "hour", ho(c, t.getHours() >= 12)) : mo(t, fo(n), c));
		}
		l && lo(e, t, "ArrowRight");
	}
	applyMeridiem(e, t) {
		let n = this.baseValue(e);
		this.write(e, mo(n, "hour", ho(n.getHours() % 12 == 0 ? 12 : n.getHours() % 12, t === "pm")));
	}
	baseValue(e) {
		return C(e) ?? Pr(e);
	}
	write(e, t) {
		Nr(e, Fr(e, t)), this.applySegments(e);
	}
	editState(e) {
		let t = this.edits.get(e);
		return t === void 0 && (t = {
			unit: null,
			buffer: ""
		}, this.edits.set(e, t)), t;
	}
	resetBuffer(e) {
		let t = this.editState(e);
		t.unit = null, t.buffer = "";
	}
};
function to(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = _r(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(no(r)), n += r.length;
	}
	return t;
}
function no(e) {
	switch (e) {
		case "HH": return {
			kind: "segment",
			unit: "hour",
			width: 2
		};
		case "H": return {
			kind: "segment",
			unit: "hour",
			width: 1
		};
		case "hh": return {
			kind: "segment",
			unit: "hour12",
			width: 2
		};
		case "h": return {
			kind: "segment",
			unit: "hour12",
			width: 1
		};
		case "mm": return {
			kind: "segment",
			unit: "minute",
			width: 2
		};
		case "m": return {
			kind: "segment",
			unit: "minute",
			width: 1
		};
		case "ss": return {
			kind: "segment",
			unit: "second",
			width: 2
		};
		case "s": return {
			kind: "segment",
			unit: "second",
			width: 1
		};
		case "tt": return {
			kind: "segment",
			unit: "meridiem",
			width: 0
		};
		default: return {
			kind: "literal",
			token: e,
			formatted: !0
		};
	}
}
function ro(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = qa, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = j, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(Ya, e.unit), t.dataset.width = String(e.width), t;
}
function io(e, t, n, r) {
	return t && n !== null ? hr(n, e, r) : e;
}
function ao(e, t, n, r) {
	if (n === null) return $a;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : po(n, fo(e));
	return String(i).padStart(t, "0");
}
function oo(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(po(n, fo(t))));
}
function so(e) {
	let t = e instanceof Element ? e.closest(`.${j}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${x}`);
	return n === null || n.hasAttribute(Za) ? null : t;
}
function co(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${j}`) : null;
}
function lo(e, t, n) {
	let r = [...e.querySelectorAll(`.${j}`)], i = r.indexOf(t);
	i !== -1 && r[n === "Home" ? 0 : n === "End" ? r.length - 1 : Math.max(0, Math.min(r.length - 1, i + (n === "ArrowRight" ? 1 : -1)))].focus();
}
function uo(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function fo(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function po(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function mo(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function ho(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var go = "data-ui-scroll-anchor", _o = "End", vo = 4, yo = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), new MutationObserver(() => this.followContent()).observe(this.root, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !bo(t) || this.pinned.set(t, xo(t));
	}
	followContent() {
		for (let e of this.root.querySelectorAll(`[${go}="${_o}"]`)) this.pinned.get(e) !== !1 && (this.pinned.set(e, !0), xo(e) || (e.scrollTop = e.scrollHeight));
	}
};
function bo(e) {
	return e.getAttribute(go) === _o;
}
function xo(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= vo;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var So = `:scope > [${ae}], :scope > [${oe}], :scope > [${le}]`, Co = "ui-hidden";
function M(e) {
	let t = new Set(e.querySelectorAll(So));
	return [...e.children].filter((e) => !t.has(e));
}
function wo(e) {
	return e.querySelector(`:scope > [${ae}]`);
}
function To(e, t, n, r) {
	let i = M(e).some((e) => !e.classList.contains(Co)), a = wo(e);
	if (i) {
		a?.remove();
		return;
	}
	if (a !== null) return;
	let o = n.getEmptyTemplate(t);
	if (o === void 0) return;
	let s = r.renderFromTemplate(o, null);
	if (s === null) return;
	let c = document.createElement("div");
	c.setAttribute(ae, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var N = { ok: !1 };
function Eo(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => _e(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
	for (; l < i.length;) {
		let t = i[l];
		if (t === ".") {
			if (u) return N;
			u = !0, l++;
			continue;
		}
		if (t === "[") {
			if (l + 1 >= i.length || i[l + 1] !== "]" || c >= a.length) return N;
			let t = a[c];
			if (c++, _e(t.kind) === "Dynamic") o = Oo(e, t.componentId, r), s = !0;
			else {
				if (!s) return N;
				let e = Mo(o, t.value);
				if (!e.ok) return N;
				o = e.value;
			}
			l += 2, u = !1;
			continue;
		}
		let n = l;
		for (; l < i.length && i[l] !== "." && i[l] !== "[";) l++;
		if (l === n) return N;
		if (s) {
			let e = ko(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? N : {
		ok: !0,
		value: o
	};
}
var Do = /* @__PURE__ */ new Set();
function Oo(e, t, n) {
	let r = h(t);
	if (r > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === r) return e[t].item;
	}
	return Do.has(r) || (Do.add(r), s("an item scope a binding parameter names is not on the stack; falling back to the innermost item.", {
		targetId: r,
		stack: e
	})), n;
}
function ko(e, t) {
	if (e == null) return N;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return N;
	let n = e, r = Ao(n, t);
	return Object.prototype.hasOwnProperty.call(n, r) ? {
		ok: !0,
		value: n[r]
	} : N;
}
function Ao(e, t) {
	if (Object.prototype.hasOwnProperty.call(e, t)) return t;
	let n = jo(t);
	if (Object.prototype.hasOwnProperty.call(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function jo(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Mo(e, t) {
	if (e == null || t == null) return N;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : N;
	if (typeof t != "string") return N;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.prototype.hasOwnProperty.call(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (No(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return N;
}
function No(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Po(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t);
	if (a !== void 0) for (let n of M(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Co);
			continue;
		}
		let o = a.filters.every((t) => Lo(t, e, i));
		n.classList.toggle(Co, !o);
	}
}
function Fo(e, t) {
	return e.sorts.filter((e) => Ro(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
}
function Io(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => {
		let i = n.getItemValue(e), a = n.getItemValue(r);
		for (let e of t) {
			let t = Bo(zo(i, e.itemProperty), zo(a, e.itemProperty));
			if (t !== 0) return Se(e.direction) === "Descending" ? -t : t;
		}
		return 0;
	});
}
function Lo(e, t, n) {
	if (!Ro(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return mt(zo(t, e.itemProperty), e.operator, r);
}
function Ro(e, t, n, r) {
	return e == null ? !0 : mt(r.get(e, []), t, n);
}
function zo(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = ko(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Bo(e, t) {
	if (e === t) return 0;
	if (e == null) return -1;
	if (t == null) return 1;
	if (typeof e == "number" && typeof t == "number") return e - t;
	let n = Number(e), r = Number(t);
	return !Number.isNaN(n) && !Number.isNaN(r) ? n - r : String(e).localeCompare(String(t));
}
//#endregion
//#region src/items/items-group-renderer.ts
var Vo = /* @__PURE__ */ new WeakMap();
function Ho(e, t, n, r, i, a) {
	let o = M(e), s = n.getGroupTemplate(t), c = !e.hasAttribute("data-ui-windowed") && s !== void 0 && o.some((e) => e.hasAttribute("data-ui-group")), l = e.hasAttribute("data-ui-windowed") ? void 0 : i.getItemsFilterSortMetadata(t), u = l === void 0 ? [] : Fo(l, a);
	if (!c && u.length === 0) return;
	if (o.length === 0) {
		Vo.set(e, []);
		return;
	}
	let d = wo(e);
	if (!c) {
		Uo(e, [...Io(o, u, r), ...Wo(d)]);
		return;
	}
	for (let t of e.querySelectorAll(`[${oe}]`)) t.remove();
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (Vo.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	Vo.set(e, p);
	let ee = [];
	for (let e of p) {
		let t = f.get(e);
		if (!(t === void 0 || t.length === 0)) {
			if (u.length > 0 && (t = Io(t, u, r)), t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = Go(s, r, t[0]);
				e !== null && ee.push(e);
			}
			ee.push(...t);
		}
	}
	Uo(e, [...ee, ...Wo(d)]);
}
function Uo(e, t) {
	let n = e.children;
	n.length === t.length && t.every((e, t) => n[t] === e) || e.replaceChildren(...t);
}
function Wo(e) {
	return e === null ? [] : [e];
}
function Go(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(oe, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
function Ko(e, t, n) {
	if (e.hasAttribute("data-ui-windowed")) {
		To(e, t, n.templates, n.renderer);
		return;
	}
	Po(e, t, n.metadata, n.renderer, n.state), To(e, t, n.templates, n.renderer), Ho(e, t, n.templates, n.renderer, n.metadata, n.state);
}
//#endregion
//#region src/items/items-template-renderer.ts
var qo = class {
	metadata;
	templates;
	extensions;
	operations;
	state;
	itemStackByRoot = /* @__PURE__ */ new WeakMap();
	constructor(e, t, n, r, i) {
		this.metadata = e, this.templates = t, this.extensions = n, this.operations = r, this.state = i;
	}
	renderItem(e, t, n, r = []) {
		let i = this.resolveVariantKey(e, t), a = this.templates.getTemplate(e, i);
		if (a === void 0) return s("item template was not found.", {
			itemsViewComponentId: e,
			variantKey: i
		}), null;
		let o = this.renderFromTemplate(a, t, r);
		if (o === null) return null;
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? Jo(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null) : o;
		return l !== o && this.moveItemScope(o, l), Yo(l, n, t), l;
	}
	moveItemScope(e, t) {
		let n = this.itemStackByRoot.get(e);
		n !== void 0 && (this.itemStackByRoot.delete(e), this.itemStackByRoot.set(t, n));
	}
	getItemValue(e) {
		return this.itemStackByRoot.get(e)?.item;
	}
	getItemScope(e) {
		return this.itemStackByRoot.get(e);
	}
	registerItemScope(e, t, n) {
		this.itemStackByRoot.set(e, {
			scopeComponentId: t,
			item: n
		});
	}
	updateItemValue(e, t, n) {
		let r = this.itemStackByRoot.get(e);
		if (r === void 0) return;
		if (t.length === 0) {
			this.itemStackByRoot.set(e, {
				scopeComponentId: r.scopeComponentId,
				item: n
			});
			return;
		}
		let i = r.item;
		for (let e = 0; e < t.length - 1; e++) {
			let n = ko(i, t[e]);
			if (!n.ok) return;
			i = n.value;
		}
		if (typeof i != "object" || !i) return;
		let a = i;
		a[Ao(a, t[t.length - 1])] = n;
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: _(r),
			item: t
		};
		return this.itemStackByRoot.set(r, i), this.populateBoundElements(r, [...n, i]), r;
	}
	getAncestorStack(e) {
		let t = [], n = e.parentElement;
		for (; n !== null;) {
			let e = this.itemStackByRoot.get(n);
			e !== void 0 && t.push(e), n = n.parentElement;
		}
		return t.reverse();
	}
	resolveVariantKey(e, t) {
		let n = this.metadata.getItemsTemplateMetadata(e);
		return n === void 0 ? null : Qo(t, n.templateKeyPropertyName) ?? Qo(t, n.fallbackTemplateKeyPropertyName);
	}
	populateBoundElements(e, t) {
		let n = [e, ...e.querySelectorAll("*")];
		for (let e of n) for (let n of Array.from(e.attributes)) n.name.startsWith("data-ui-bind-") && this.applyBoundAttribute(e, n.value, t);
	}
	applyBoundAttribute(e, t, n) {
		let r = Number(t);
		if (!Number.isInteger(r) || r <= 0) return;
		let i = this.metadata.getBindingById(r), a = i === void 0 ? void 0 : this.metadata.getPropertyDefinition(i.propertyId);
		if (i === void 0 || a === void 0) return;
		let o = i.itemTemplate === null || i.itemTemplate === void 0 ? this.state.has(i, []) ? {
			ok: !0,
			value: this.state.get(i, [])
		} : { ok: !1 } : Eo(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			s("item binding value could not be resolved.", {
				binding: i,
				stack: n
			});
			return;
		}
		let c = h(i.componentId), l = e.closest(`[${d}="${c}"]`);
		if (l === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = Zo(e, l, t);
			if (n === null) continue;
			let s = this.extensions.converters.convert(t.converter, o.value);
			this.operations.apply({
				resolved: {
					componentId: c,
					propertyId: i.propertyId,
					propertyName: a.propertyName,
					dynamicParameters: [],
					component: l,
					definition: a,
					address: {
						component: {
							id: c,
							dynamicParameters: []
						},
						property: { name: a.propertyName }
					},
					bindingId: r,
					bindingSelector: null
				},
				operation: t,
				target: n,
				value: o.value,
				convertedValue: s,
				local: !1
			});
		}
	}
};
function Jo(e, t, n) {
	let r = document.createElement(t);
	return n !== null && (r.className = n), r.appendChild(e), r;
}
function Yo(e, t, n) {
	e.setAttribute(p, t), Xo(e, n);
}
function Xo(e, t) {
	let n = ko(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(se, n.value) : e.removeAttribute(se);
}
function Zo(e, t, n) {
	return n.target === "root" ? t : n.target !== null && n.target !== void 0 && n.target.trim().length > 0 ? t.querySelector(n.target) : e;
}
function Qo(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = ko(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var $o = "Group", es = class {
	options;
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = h(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(h(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : ts(t);
		if (n !== null) for (let t of this.resolveItemRoots(e, n)) this.applyItemValue(t, n, e.value);
	}
	resolveItemRoots(e, t) {
		let n = [];
		for (let r of e.components) {
			let e = this.findItemRoot(r, t.scopeComponentId);
			e !== null && !n.includes(e) && n.push(e);
		}
		return n.length > 0 ? n : this.findAddressedItemRoots(e.dynamicParameters);
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${p}="${me(t)}"]`)].filter((t) => this.isItemRoot(t) && Be(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		t.exact && this.options.renderer.updateItemValue(e, t.segments, n), ns($o, t) && Xo(e, this.options.renderer.getItemValue(e));
		let r = e.closest(`[${ne}]`), i = r === null ? null : We(r);
		r === null || i === null || !this.feedsRule(i, t) || Ko(r, i, this.options);
	}
	findItemRoot(e, t) {
		let n = e;
		for (; n !== null;) {
			let e = this.options.renderer.getItemScope(n);
			if (e !== void 0 && (t <= 0 || e.scopeComponentId === t) && this.isItemRoot(n)) return n;
			n = n.parentElement;
		}
		return null;
	}
	isItemRoot(e) {
		return this.options.renderer.getItemScope(e) !== void 0 && e.parentElement?.hasAttribute("data-ui-items-host") === !0 && !e.hasAttribute("data-ui-group-header");
	}
	feedsRule(e, t) {
		if (this.options.templates.getGroupTemplate(e) !== void 0 && ns($o, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => ns(e.itemProperty, t)) || n.sorts.some((e) => ns(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${ne}]`)) {
			let n = We(t);
			n === e && Ko(t, n, this.options);
		}
	}
};
function ts(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => _e(e.kind) !== "Scope"), r = [], i = 0, a = 0, o = 0;
	for (; o < t.length;) {
		let e = t[o];
		if (e === ".") {
			o++;
			continue;
		}
		if (e === "[") {
			if (o + 1 >= t.length || t[o + 1] !== "]" || a >= n.length) return null;
			let e = n[a];
			if (a++, o += 2, _e(e.kind) !== "Dynamic") return {
				segments: r,
				exact: !1,
				scopeComponentId: i
			};
			r = [], i = h(e.componentId);
			continue;
		}
		let s = o;
		for (; o < t.length && t[o] !== "." && t[o] !== "[";) o++;
		r.push(t.slice(s, o));
	}
	return {
		segments: r,
		exact: !0,
		scopeComponentId: i
	};
}
function ns(e, t) {
	let n = t.segments.join(".");
	return n.length === 0 ? !0 : e === n || e.startsWith(`${n}.`);
}
var rs = "bottom";
function P(e, t, n) {
	let r = e.querySelector(`:scope > [${le}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(le, t), r.style.flex = "0 0 auto"), t === "top" ? e.firstChild !== r && e.insertBefore(r, e.firstChild) : e.lastChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-window-engine.ts
var is = "data-ui-window-size", as = "data-ui-window-offset", os = "data-ui-window-total", ss = "data-ui-window-more-before", cs = "data-ui-window-more-after", ls = 50, us = 32, ds = 1, fs = .5, ps = 60, ms = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	start() {
		for (let e of this.hosts()) {
			if (this.layout(e), _s(e) === 0) {
				this.requestAsync(e, "Start", 0, null, !1);
				continue;
			}
			this.revealWindow(e);
		}
	}
	revealWindow(e) {
		let t = F(e, as);
		t === null || t <= 0 || (e.scrollTop = hs(e.getAttribute(cs)) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${ne}][${ce}]`)];
	}
	handleScroll(e) {
		let t = e.target;
		if (!(t instanceof Element) || !t.hasAttribute("data-ui-windowed")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, ps));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		let n = gs(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = F(e, as), i = hs(e.getAttribute(ss)), a = hs(e.getAttribute(cs));
		if (r !== null) {
			let o = this.windowSize(e), s = Math.max(1, Math.round(e.clientHeight * ds / t.itemSize), Math.floor(o * fs)), c = Math.floor(e.scrollTop / t.itemSize), l = Math.ceil((e.scrollTop + e.clientHeight) / t.itemSize);
			if (l < r || c > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, c, o), null, !1);
				return;
			}
			if (c - s <= r && i) {
				this.requestAsync(e, "Before", 0, vs(n[0]), !0);
				return;
			}
			if (l + s >= r + n.length && a) {
				this.requestAsync(e, "After", 0, vs(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Math.max(1, e.clientHeight * ds), s = e.scrollHeight - e.scrollTop - e.clientHeight;
		if (e.scrollTop <= o && i) {
			this.requestAsync(e, "Before", 0, vs(n[0]), !0);
			return;
		}
		s <= o && a && this.requestAsync(e, "After", 0, vs(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = F(e, os);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = We(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		try {
			let o = await this.options.requestWindow({
				componentId: a,
				dynamicParameters: ys(e),
				anchor: t,
				offset: n,
				key: r ?? void 0,
				count: this.windowSize(e),
				extend: i
			});
			this.options.applyChanges(o);
		} catch (e) {
			s("reading an item window failed.", {
				componentId: a,
				anchor: t,
				error: e
			});
		} finally {
			o.pending = !1, this.layout(e), o.restless && (o.restless = !1, this.considerRequest(e));
		}
	}
	layout(e) {
		let t = this.getState(e), n = gs(e);
		if (n.length > 0) {
			let e = 0;
			for (let t of n) e += t.getBoundingClientRect().height;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / n.length)));
		}
		let r = F(e, os), i = F(e, as), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		P(e, "top", a), P(e, rs, o);
	}
	windowSize(e) {
		let t = F(e, is);
		return t !== null && t > 0 ? t : ls;
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			pending: !1,
			restless: !1,
			itemSize: us,
			scheduled: 0
		}, this.states.set(e, t)), t;
	}
};
function hs(e) {
	return e !== null && e.toLowerCase() === "true";
}
function gs(e) {
	return [...e.children].filter((e) => e.hasAttribute(p));
}
function _s(e) {
	return gs(e).length;
}
function vs(e) {
	return e.getAttribute(p);
}
function ys(e) {
	let t = e.closest("[data-ui-id]");
	return t === null ? [] : ze(t, Re(t));
}
function F(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var bs = "data-ui-virtualized", xs = "data-ui-offscreen", Ss = 32, Cs = 6, ws = 60, Ts = class {
	root;
	sizes = /* @__PURE__ */ new WeakMap();
	scheduled = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	sync() {
		for (let e of this.root.querySelectorAll(`[${ne}]`)) e.hasAttribute(bs) ? this.layout(e) : Es(e);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !t.hasAttribute(bs) || this.scheduled.get(t) === void 0 && this.scheduled.set(t, window.setTimeout(() => {
			this.scheduled.delete(t), this.layout(t);
		}, ws));
	}
	layout(e) {
		if (e.querySelector(":scope > [data-ui-group-header]") !== null) {
			Es(e);
			return;
		}
		let t = M(e).filter((e) => !e.classList.contains(Co));
		if (t.length === 0) {
			P(e, "top", 0), P(e, rs, 0);
			return;
		}
		let n = this.measure(e, t), r = Math.max(0, Math.floor(e.scrollTop / n) - Cs), i = Math.min(t.length, Math.ceil((e.scrollTop + e.clientHeight) / n) + Cs);
		for (let e = 0; e < t.length; e++) {
			let n = e < r || e >= i;
			n !== t[e].hasAttribute(xs) && (n ? t[e].setAttribute(xs, "") : t[e].removeAttribute(xs));
		}
		P(e, "top", r * n), P(e, rs, (t.length - i) * n);
	}
	measure(e, t) {
		let n = t.find((e) => !e.hasAttribute(xs)), r = n === void 0 ? 0 : Math.round(n.getBoundingClientRect().height);
		return r > 0 ? (this.sizes.set(e, r), r) : this.sizes.get(e) ?? Ss;
	}
};
function Es(e) {
	let t = e.querySelectorAll(`:scope > [${xs}]`);
	if (t.length !== 0) {
		P(e, "top", 0), P(e, rs, 0);
		for (let e of t) e.removeAttribute(xs);
	}
}
//#endregion
//#region src/items/items-template-registry.ts
var Ds = "data-ui-template", Os = "default", ks = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? Os, r = this.findTemplate(e, n);
		return r === void 0 ? n === Os ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${Ds}]`);
		for (let e of r) if (e.getAttribute(Ds) === t) return e;
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, re);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, ie);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
}, As = "script[type='application/json'][data-ui-metadata]";
function js(e = document) {
	let t = e.querySelector(As);
	if (t === null) return Ms();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return Ms();
	let r = JSON.parse(n);
	return {
		propertyDefinitions: r.propertyDefinitions ?? [],
		bindings: r.bindings ?? [],
		events: r.events ?? [],
		interactions: r.interactions ?? [],
		validations: r.validations ?? [],
		items: r.items ?? [],
		itemsFilterSort: r.itemsFilterSort ?? [],
		itemValues: r.itemValues ?? []
	};
}
function Ms() {
	return {
		propertyDefinitions: [],
		bindings: [],
		events: [],
		interactions: [],
		validations: [],
		items: [],
		itemsFilterSort: [],
		itemValues: []
	};
}
//#endregion
//#region src/transport/command-dispatcher.ts
var Ns = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(Ps(Fs(e)));
	}
	async dispatchAsync(e) {
		let t = Fs(e), n = Ps(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		try {
			return await this.transport.processEventAsync(t);
		} finally {
			this.pendingKeys.delete(n);
		}
	}
};
function Ps(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function Fs(e) {
	return {
		eventId: Ne(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var Is = class {
	values = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t));
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n) {
		let r = this.createKey(e, t), i = this.values.get(r);
		return this.values.has(r) && Rs(i, n) ? !1 : (this.values.set(r, n), !0);
	}
	delete(e, t = []) {
		return this.values.delete(this.createKey(e, t));
	}
	deleteComponent(e) {
		let t = `${e}:`;
		for (let e of this.values.keys()) e.startsWith(t) && this.values.delete(e);
	}
	clear() {
		this.values.clear();
	}
	createKey(e, t) {
		return `${h(e.componentId)}:${e.propertyId}:${Ls(t)}`;
	}
};
function Ls(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
function Rs(e, t) {
	return Object.is(e, t) ? !0 : e instanceof Date && t instanceof Date ? e.getTime() === t.getTime() : !1;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var I = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, zs = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, L = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Bs = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Vs = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Hs = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, Us = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, Ws = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, Gs = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Ks = class {
	get(e, t) {
		return this.send({
			...t,
			method: "GET",
			url: e
		});
	}
	post(e, t) {
		return this.send({
			...t,
			method: "POST",
			url: e
		});
	}
	delete(e, t) {
		return this.send({
			...t,
			method: "DELETE",
			url: e
		});
	}
	getCookieString(e) {
		return "";
	}
}, R;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(R ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var qs = class {
	constructor() {}
	log(e, t) {}
};
qs.instance = new qs();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var Js = "10.0.0", z = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, B = class e {
	static get isBrowser() {
		return !e.isNode && typeof window == "object" && typeof window.document == "object";
	}
	static get isWebWorker() {
		return !e.isNode && typeof self == "object" && "importScripts" in self;
	}
	static get isReactNative() {
		return !e.isNode && typeof window == "object" && window.document === void 0;
	}
	static get isNode() {
		return typeof process < "u" && process.release && process.release.name === "node";
	}
};
function Ys(e, t) {
	let n = "";
	return V(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${Xs(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function Xs(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function V(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function Zs(e, t, n, r, i, a) {
	let o = {}, [s, c] = tc();
	o[s] = c, e.log(R.Trace, `(${t} transport) sending data. ${Ys(i, a.logMessageContent)}.`);
	let l = V(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(R.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function Qs(e) {
	return e === void 0 ? new ec(R.Information) : e === null ? qs.instance : e.log === void 0 ? new ec(e) : e;
}
var $s = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, ec = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${R[e]}: ${t}`;
			switch (e) {
				case R.Critical:
				case R.Error:
					this.out.error(n);
					break;
				case R.Warning:
					this.out.warn(n);
					break;
				case R.Information:
					this.out.info(n);
					break;
				default:
					this.out.log(n);
					break;
			}
		}
	}
};
function tc() {
	let e = "X-SignalR-User-Agent";
	return B.isNode && (e = "User-Agent"), [e, nc(Js, rc(), ac(), ic())];
}
function nc(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, t && t !== "" ? i += `${t}; ` : i += "Unknown OS; ", i += `${n}`, r ? i += `; ${r}` : i += "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function rc() {
	if (B.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function ic() {
	if (B.isNode) return process.versions.node;
}
function ac() {
	return B.isNode ? "NodeJS" : "Browser";
}
function oc(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function sc() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var cc = class extends Ks {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || B.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), typeof fetch > "u" ? this._fetchType = t("node-fetch") : this._fetchType = fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(sc());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new L();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new L();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(R.Warning, "Timeout from HTTP request."), n = new zs();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, V(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
		let i;
		try {
			i = await this._fetchType(e.url, {
				body: e.content,
				cache: "no-cache",
				credentials: e.withCredentials === !0 ? "include" : "same-origin",
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					...e.headers
				},
				method: e.method,
				mode: "cors",
				redirect: "follow",
				signal: t.signal
			});
		} catch (e) {
			throw n || (this._logger.log(R.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new I(await lc(i, "text") || i.statusText, i.status);
		let a = await lc(i, e.responseType);
		return new Gs(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return B.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function lc(e, t) {
	let n;
	switch (t) {
		case "arraybuffer":
			n = e.arrayBuffer();
			break;
		case "text":
			n = e.text();
			break;
		case "blob":
		case "document":
		case "json": throw Error(`${t} is not supported.`);
		default:
			n = e.text();
			break;
	}
	return n;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js
var uc = class extends Ks {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new L()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 ? !0 : e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (V(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new L());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new Gs(r.status, r.statusText, r.response || r.responseText)) : n(new I(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(R.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new I(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(R.Warning, "Timeout from HTTP request."), n(new zs());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, dc = class extends Ks {
	constructor(e) {
		if (super(), typeof fetch < "u" || B.isNode) this._httpClient = new cc(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new uc(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new L()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, H = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
H.RecordSeparatorCode = 30, H.RecordSeparator = String.fromCharCode(H.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var fc = class {
	writeHandshakeRequest(e) {
		return H.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (V(e)) {
			let r = new Uint8Array(e), i = r.indexOf(H.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(H.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = H.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, U;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(U ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var pc = class {
	constructor() {
		this.observers = [];
	}
	next(e) {
		for (let t of this.observers) t.next(e);
	}
	error(e) {
		for (let t of this.observers) t.error && t.error(e);
	}
	complete() {
		for (let e of this.observers) e.complete && e.complete();
	}
	subscribe(e) {
		return this.observers.push(e), new $s(this, e);
	}
}, mc = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			V(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new hc(t, this._totalMessageCount, e, r));
		}
		try {
			this._reconnectInProgress || await this._connection.send(t);
		} catch {
			this._disconnected();
		}
		await n;
	}
	_ack(e) {
		let t = -1;
		for (let n = 0; n < this._messages.length; n++) {
			let r = this._messages[n];
			if (r._id <= e.sequenceId) t = n, V(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === U.Sequence ? (this._waitForSequenceMessage = !1, !0) : !1;
		if (!this._isInvocationMessage(e)) return !0;
		let t = this._nextReceivingSequenceId;
		return this._nextReceivingSequenceId++, t <= this._latestReceivedSequenceId ? (t === this._latestReceivedSequenceId && this._ackTimer(), !1) : (this._latestReceivedSequenceId = t, this._ackTimer(), !0);
	}
	_resetSequence(e) {
		if (e.sequenceId > this._nextReceivingSequenceId) {
			this._connection.stop(/* @__PURE__ */ Error("Sequence ID greater than amount of messages we've received."));
			return;
		}
		this._nextReceivingSequenceId = e.sequenceId;
	}
	_disconnected() {
		this._reconnectInProgress = !0, this._waitForSequenceMessage = !0;
	}
	async _resend() {
		let e = this._messages.length === 0 ? this._totalMessageCount + 1 : this._messages[0]._id;
		await this._connection.send(this._protocol.writeMessage({
			type: U.Sequence,
			sequenceId: e
		}));
		let t = this._messages;
		for (let e of t) await this._connection.send(e._message);
		this._reconnectInProgress = !1;
	}
	_dispose(e) {
		e ??= /* @__PURE__ */ Error("Unable to reconnect to server.");
		for (let t of this._messages) t._rejector(e);
	}
	_isInvocationMessage(e) {
		switch (e.type) {
			case U.Invocation:
			case U.StreamItem:
			case U.Completion:
			case U.StreamInvocation:
			case U.CancelInvocation: return !0;
			case U.Close:
			case U.Sequence:
			case U.Ping:
			case U.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: U.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, hc = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, gc = 30 * 1e3, _c = 15 * 1e3, vc = 1e5, W;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(W ||= {});
var yc = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(R.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, z.isRequired(e, "connection"), z.isRequired(t, "logger"), z.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? gc, this.keepAliveIntervalInMilliseconds = a ?? _c, this._statefulReconnectBufferSize = o ?? vc, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new fc(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = W.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: U.Ping });
	}
	get state() {
		return this._connectionState;
	}
	get connectionId() {
		return this.connection && this.connection.connectionId || null;
	}
	get baseUrl() {
		return this.connection.baseUrl || "";
	}
	set baseUrl(e) {
		if (this._connectionState !== W.Disconnected && this._connectionState !== W.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== W.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = W.Connecting, this._logger.log(R.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), B.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = W.Connected, this._connectionStarted = !0, this._logger.log(R.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = W.Disconnected, this._logger.log(R.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
		}
	}
	async _startInternal() {
		this._stopDuringStartError = void 0, this._receivedHandshakeResponse = !1;
		let e = new Promise((e, t) => {
			this._handshakeResolver = e, this._handshakeRejecter = t;
		});
		await this.connection.start(this._protocol.transferFormat);
		try {
			let t = this._protocol.version;
			this.connection.features.reconnect || (t = 1);
			let n = {
				protocol: this._protocol.name,
				version: t
			};
			if (this._logger.log(R.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(R.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new mc(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(R.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
		}
	}
	async stop() {
		let e = this._startPromise;
		this.connection.features.reconnect = !1, this._stopPromise = this._stopInternal(), await this._stopPromise;
		try {
			await e;
		} catch {}
	}
	_stopInternal(e) {
		if (this._connectionState === W.Disconnected) return this._logger.log(R.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === W.Disconnecting) return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = W.Disconnecting, this._logger.log(R.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(R.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === W.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new L("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new pc();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			} else e && (e.type === U.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
		}, a = this._sendWithProtocol(i).catch((e) => {
			o.error(e), delete this._callbacks[i.invocationId];
		}), this._launchStreams(n, a), o;
	}
	_sendMessage(e) {
		return this._resetKeepAliveInterval(), this.connection.send(e);
	}
	_sendWithProtocol(e) {
		return this._messageBuffer ? this._messageBuffer._send(e) : this._sendMessage(this._protocol.writeMessage(e));
	}
	send(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._sendWithProtocol(this._createInvocation(e, t, !0, r));
		return this._launchStreams(n, i), i;
	}
	invoke(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createInvocation(e, t, !1, r);
		return new Promise((e, t) => {
			this._callbacks[i.invocationId] = (n, r) => {
				if (r) {
					t(r);
					return;
				} else n && (n.type === U.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
			};
			let r = this._sendWithProtocol(i).catch((e) => {
				t(e), delete this._callbacks[i.invocationId];
			});
			this._launchStreams(n, r);
		});
	}
	on(e, t) {
		!e || !t || (e = e.toLowerCase(), this._methods[e] || (this._methods[e] = []), this._methods[e].indexOf(t) === -1 && this._methods[e].push(t));
	}
	off(e, t) {
		if (!e) return;
		e = e.toLowerCase();
		let n = this._methods[e];
		if (n) if (t) {
			let r = n.indexOf(t);
			r !== -1 && (n.splice(r, 1), n.length === 0 && delete this._methods[e]);
		} else delete this._methods[e];
	}
	onclose(e) {
		e && this._closedCallbacks.push(e);
	}
	onreconnecting(e) {
		e && this._reconnectingCallbacks.push(e);
	}
	onreconnected(e) {
		e && this._reconnectedCallbacks.push(e);
	}
	_processIncomingData(e) {
		if (this._cleanupTimeout(), this._receivedHandshakeResponse ||= (e = this._processHandshakeResponse(e), !0), e) {
			let t = this._protocol.parseMessages(e, this._logger);
			for (let e of t) if (!(this._messageBuffer && !this._messageBuffer._shouldProcessMessage(e))) switch (e.type) {
				case U.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(R.Error, `Invoke client method threw error: ${oc(e)}`);
					});
					break;
				case U.StreamItem:
				case U.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === U.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(R.Error, `Stream callback threw error: ${oc(e)}`);
						}
					}
					break;
				}
				case U.Ping: break;
				case U.Close: {
					this._logger.log(R.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case U.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case U.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default:
					this._logger.log(R.Warning, `Invalid message type: ${e.type}.`);
					break;
			}
		}
		this._resetTimeoutPeriod();
	}
	_processHandshakeResponse(e) {
		let t, n;
		try {
			[n, t] = this._handshakeProtocol.parseHandshakeResponse(e);
		} catch (e) {
			let t = "Error parsing handshake response: " + e;
			this._logger.log(R.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(R.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		} else this._logger.log(R.Debug, "Server handshake complete.");
		return this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === W.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === W.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(R.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(R.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(R.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(R.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(R.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(R.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(R.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new L("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === W.Disconnecting ? this._completeClose(e) : this._connectionState === W.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === W.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = W.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), B.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(R.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(R.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = W.Reconnecting, e ? this._logger.log(R.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(R.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(R.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== W.Reconnecting) {
				this._logger.log(R.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(R.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== W.Reconnecting) {
				this._logger.log(R.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = W.Connected, this._logger.log(R.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(R.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(R.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== W.Reconnecting) {
					this._logger.log(R.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === W.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(R.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(R.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(R.Error, `Stream 'error' callback called with '${e}' threw error: ${oc(t)}`);
			}
		});
	}
	_cleanupPingTimer() {
		this._pingServerHandle &&= (clearTimeout(this._pingServerHandle), void 0);
	}
	_cleanupTimeout() {
		this._timeoutHandle && clearTimeout(this._timeoutHandle);
	}
	_createInvocation(e, t, n, r) {
		if (n) return r.length === 0 ? {
			target: e,
			arguments: t,
			type: U.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: U.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: U.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: U.Invocation
			};
		}
	}
	_launchStreams(e, t) {
		if (e.length !== 0) {
			t ||= Promise.resolve();
			for (let n in e) e[n].subscribe({
				complete: () => {
					t = t.then(() => this._sendWithProtocol(this._createCompletionMessage(n)));
				},
				error: (e) => {
					let r;
					r = e instanceof Error ? e.message : e && e.toString ? e.toString() : "Unknown error", t = t.then(() => this._sendWithProtocol(this._createCompletionMessage(n, r)));
				},
				next: (e) => {
					t = t.then(() => this._sendWithProtocol(this._createStreamItemMessage(n, e)));
				}
			});
		}
	}
	_replaceStreamingParams(e) {
		let t = [], n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this._isObservable(i)) {
				let a = this._invocationId;
				this._invocationId++, t[a] = i, n.push(a.toString()), e.splice(r, 1);
			}
		}
		return [t, n];
	}
	_isObservable(e) {
		return e && e.subscribe && typeof e.subscribe == "function";
	}
	_createStreamInvocation(e, t, n) {
		let r = this._invocationId;
		return this._invocationId++, n.length === 0 ? {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			type: U.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: U.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: U.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: U.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: U.Completion
		} : {
			invocationId: e,
			result: n,
			type: U.Completion
		};
	}
	_createCloseMessage() {
		return { type: U.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, bc = [
	0,
	2e3,
	1e4,
	3e4,
	null
], xc = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? bc : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, G = class {};
G.Authorization = "Authorization", G.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var Sc = class extends Ks {
	constructor(e, t) {
		super(), this._innerClient = e, this._accessTokenFactory = t;
	}
	async send(e) {
		let t = !0;
		this._accessTokenFactory && (!this._accessToken || e.url && e.url.indexOf("/negotiate?") > 0) && (t = !1, this._accessToken = await this._accessTokenFactory()), this._setAuthorizationHeader(e);
		let n = await this._innerClient.send(e);
		return t && n.statusCode === 401 && this._accessTokenFactory ? (this._accessToken = await this._accessTokenFactory(), this._setAuthorizationHeader(e), await this._innerClient.send(e)) : n;
	}
	_setAuthorizationHeader(e) {
		e.headers ||= {}, this._accessToken ? e.headers[G.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[G.Authorization] && delete e.headers[G.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, K;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(K ||= {});
var q;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var Cc = class {
	constructor() {
		this._isAborted = !1, this.onabort = null;
	}
	abort() {
		this._isAborted || (this._isAborted = !0, this.onabort && this.onabort());
	}
	get signal() {
		return this;
	}
	get aborted() {
		return this._isAborted;
	}
}, wc = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new Cc(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (z.isRequired(e, "url"), z.isRequired(t, "transferFormat"), z.isIn(t, q, "transferFormat"), this._url = e, this._logger.log(R.Trace, "(LongPolling transport) Connecting."), t === q.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = tc(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === q.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(R.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(R.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new I(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(R.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(R.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(R.Trace, `(LongPolling transport) data received. ${Ys(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(R.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(R.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new I(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof zs ? this._logger.log(R.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(R.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(R.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? Zs(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(R.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(R.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = tc();
			e[t] = n;
			let r = {
				headers: {
					...e,
					...this._options.headers
				},
				timeout: this._options.timeout,
				withCredentials: this._options.withCredentials
			}, i;
			try {
				await this._httpClient.delete(this._url, r);
			} catch (e) {
				i = e;
			}
			i ? i instanceof I && (i.statusCode === 404 ? this._logger.log(R.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(R.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(R.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(R.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(R.Trace, e), this.onclose(this._closeError);
		}
	}
}, Tc = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return z.isRequired(e, "url"), z.isRequired(t, "transferFormat"), z.isIn(t, q, "transferFormat"), this._logger.log(R.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== q.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (B.isBrowser || B.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = tc();
				n[r] = i, a = new this._options.EventSource(e, {
					withCredentials: this._options.withCredentials,
					headers: {
						...n,
						...this._options.headers
					}
				});
			}
			try {
				a.onmessage = (e) => {
					if (this.onreceive) try {
						this._logger.log(R.Trace, `(SSE transport) data received. ${Ys(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(R.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? Zs(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, Ec = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		z.isRequired(e, "url"), z.isRequired(t, "transferFormat"), z.isIn(t, q, "transferFormat"), this._logger.log(R.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (B.isNode || B.isReactNative) {
				let t = {}, [r, i] = tc();
				t[r] = i, n && (t[G.Authorization] = `Bearer ${n}`), o && (t[G.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === q.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(R.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(R.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(R.Trace, `(WebSockets transport) data received. ${Ys(e.data, this._logMessageContent)}.`), this.onreceive) try {
					this.onreceive(e.data);
				} catch (e) {
					this._close(e);
					return;
				}
			}, a.onclose = (e) => {
				if (s) this._close(e);
				else {
					let t = null;
					t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.", i(Error(t));
				}
			};
		});
	}
	send(e) {
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(R.Trace, `(WebSockets transport) sending data. ${Ys(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(R.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, Dc = 100, Oc = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, z.isRequired(t, "url"), this._logger = Qs(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent === void 0 ? !1 : n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 ? !0 : n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 100 * 1e3 : n.timeout;
		let r = null, i = null;
		if (B.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!B.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : B.isNode && !n.WebSocket && r && (n.WebSocket = r), !B.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : B.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new Sc(n.httpClient || new dc(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= q.Binary, z.isIn(e, q, "transferFormat"), this._logger.log(R.Debug, `Starting connection with transfer format '${q[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(R.Error, e), await this._stopPromise, Promise.reject(new L(e));
		} else if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(R.Error, e), Promise.reject(new L(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new Ac(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(R.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		this._connectionState = "Disconnecting", this._stopPromise = new Promise((e) => {
			this._stopPromiseResolver = e;
		}), await this._stopInternal(e), await this._stopPromise;
	}
	async _stopInternal(e) {
		this._stopError = e;
		try {
			await this._startInternalPromise;
		} catch {}
		if (this.transport) {
			try {
				await this.transport.stop();
			} catch (e) {
				this._logger.log(R.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(R.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) if (this._options.transport === K.WebSockets) this.transport = this._constructTransport(K.WebSockets), await this._startTransport(t, e);
			else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new L("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < Dc);
				if (r === Dc && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof wc && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(R.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(R.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = tc();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(R.Debug, `Sending negotiation request: ${i}.`);
		try {
			let e = await this._httpClient.post(i, {
				content: "",
				headers: {
					...t,
					...this._options.headers
				},
				timeout: this._options.timeout,
				withCredentials: this._options.withCredentials
			});
			if (e.statusCode !== 200) return Promise.reject(/* @__PURE__ */ Error(`Unexpected status code returned from negotiate '${e.statusCode}'`));
			let n = JSON.parse(e.content);
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Us("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof I && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(R.Error, t), Promise.reject(new Us(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(R.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
			return;
		}
		let a = [], o = n.availableTransports || [], s = n;
		for (let n of o) {
			let o = this._resolveTransportOrError(n, t, r, s?.useStatefulReconnect === !0);
			if (o instanceof Error) a.push(`${n.transport} failed:`), a.push(o);
			else if (this._isITransport(o)) {
				if (this.transport = o, !s) {
					try {
						s = await this._getNegotiationResponse(e);
					} catch (e) {
						return Promise.reject(e);
					}
					i = this._createConnectUrl(e, s.connectionToken);
				}
				try {
					await this._startTransport(i, r), this.connectionId = s.connectionId;
					return;
				} catch (e) {
					if (this._logger.log(R.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Hs(`${n.transport} failed: ${e}`, K[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(R.Debug, e), Promise.reject(new L(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new Ws(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case K.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new Ec(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case K.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new Tc(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case K.LongPolling: return new wc(this._httpClient, this._logger, this._options);
			default: throw Error(`Unknown transport: ${e}.`);
		}
	}
	_startTransport(e, t) {
		return this.transport.onreceive = this.onreceive, this.features.reconnect ? this.transport.onclose = async (n) => {
			let r = !1;
			if (this.features.reconnect) try {
				this.features.disconnected(), await this.transport.connect(e, t), await this.features.resend();
			} catch {
				r = !0;
			}
			else {
				this._stopConnection(n);
				return;
			}
			r && this._stopConnection(n);
		} : this.transport.onclose = (e) => this._stopConnection(e), this.transport.connect(e, t);
	}
	_resolveTransportOrError(e, t, n, r) {
		let i = K[e.transport];
		if (i == null) return this._logger.log(R.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (kc(t, i)) if (e.transferFormats.map((e) => q[e]).indexOf(n) >= 0) {
			if (i === K.WebSockets && !this._options.WebSocket || i === K.ServerSentEvents && !this._options.EventSource) return this._logger.log(R.Debug, `Skipping transport '${K[i]}' because it is not supported in your environment.'`), new Bs(`'${K[i]}' is not supported in your environment.`, i);
			this._logger.log(R.Debug, `Selecting transport '${K[i]}'.`);
			try {
				return this.features.reconnect = i === K.WebSockets ? r : void 0, this._constructTransport(i);
			} catch (e) {
				return e;
			}
		} else return this._logger.log(R.Debug, `Skipping transport '${K[i]}' because it does not support the requested transfer format '${q[n]}'.`), /* @__PURE__ */ Error(`'${K[i]}' does not support ${q[n]}.`);
		else return this._logger.log(R.Debug, `Skipping transport '${K[i]}' because it was disabled by the client.`), new Vs(`'${K[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(R.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(R.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(R.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(R.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(R.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(R.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(R.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!B.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(R.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function kc(e, t) {
	return !e || (t & e) !== 0;
}
var Ac = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new jc(), this._transportResult = new jc(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new jc(), this._transportResult.promise;
	}
	stop() {
		return this._executing = !1, this._sendBufferedData.resolve(), this._sendLoopPromise;
	}
	_bufferData(e) {
		if (this._buffer.length && typeof this._buffer[0] != typeof e) throw Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof e}`);
		this._buffer.push(e), this._sendBufferedData.resolve();
	}
	async _sendLoop() {
		for (;;) {
			if (await this._sendBufferedData.promise, !this._executing) {
				this._transportResult && this._transportResult.reject("Connection stopped.");
				break;
			}
			this._sendBufferedData = new jc();
			let t = this._transportResult;
			this._transportResult = void 0;
			let n = typeof this._buffer[0] == "string" ? this._buffer.join("") : e._concatBuffers(this._buffer);
			this._buffer.length = 0;
			try {
				await this._transport.send(n), t.resolve();
			} catch (e) {
				t.reject(e);
			}
		}
	}
	static _concatBuffers(e) {
		let t = e.map((e) => e.byteLength).reduce((e, t) => e + t), n = new Uint8Array(t), r = 0;
		for (let t of e) n.set(new Uint8Array(t), r), r += t.byteLength;
		return n.buffer;
	}
}, jc = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, Mc = "json", Nc = class {
	constructor() {
		this.name = Mc, this.version = 2, this.transferFormat = q.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = qs.instance);
		let n = H.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case U.Invocation:
					this._isInvocationMessage(n);
					break;
				case U.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case U.Completion:
					this._isCompletionMessage(n);
					break;
				case U.Ping: break;
				case U.Close: break;
				case U.Ack:
					this._isAckMessage(n);
					break;
				case U.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(R.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return H.write(JSON.stringify(e));
	}
	_isInvocationMessage(e) {
		this._assertNotEmptyString(e.target, "Invalid payload for Invocation message."), e.invocationId !== void 0 && this._assertNotEmptyString(e.invocationId, "Invalid payload for Invocation message.");
	}
	_isStreamItemMessage(e) {
		if (this._assertNotEmptyString(e.invocationId, "Invalid payload for StreamItem message."), e.item === void 0) throw Error("Invalid payload for StreamItem message.");
	}
	_isCompletionMessage(e) {
		if (e.result && e.error) throw Error("Invalid payload for Completion message.");
		!e.result && e.error && this._assertNotEmptyString(e.error, "Invalid payload for Completion message."), this._assertNotEmptyString(e.invocationId, "Invalid payload for Completion message.");
	}
	_isAckMessage(e) {
		if (typeof e.sequenceId != "number") throw Error("Invalid SequenceId for Ack message.");
	}
	_isSequenceMessage(e) {
		if (typeof e.sequenceId != "number") throw Error("Invalid SequenceId for Sequence message.");
	}
	_assertNotEmptyString(e, t) {
		if (typeof e != "string" || e === "") throw Error(t);
	}
}, Pc = {
	trace: R.Trace,
	debug: R.Debug,
	info: R.Information,
	information: R.Information,
	warn: R.Warning,
	warning: R.Warning,
	error: R.Error,
	critical: R.Critical,
	none: R.None
};
function Fc(e) {
	let t = Pc[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var Ic = class {
	configureLogging(e) {
		if (z.isRequired(e, "logging"), Lc(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = Fc(e);
			this.logger = new ec(t);
		} else this.logger = new ec(e);
		return this;
	}
	withUrl(e, t) {
		return z.isRequired(e, "url"), z.isNotEmpty(e, "url"), this.url = e, typeof t == "object" ? this.httpConnectionOptions = {
			...this.httpConnectionOptions,
			...t
		} : this.httpConnectionOptions = {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return z.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return e ? Array.isArray(e) ? this.reconnectPolicy = new xc(e) : this.reconnectPolicy = e : this.reconnectPolicy = new xc(), this;
	}
	withServerTimeout(e) {
		return z.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return z.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new Oc(this.url, e);
		return yc.create(t, this.logger || qs.instance, this.protocol || new Nc(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function Lc(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/signalr-transport.ts
var Rc = class {
	tabId;
	connection;
	started = !1;
	currentState = "Disconnected";
	constructor(e, t = {}) {
		this.tabId = e, this.connection = new Ic().withUrl(t.hubUrl ?? "/_ui/hub").withAutomaticReconnect([...t.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(R.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get state() {
		return this.currentState;
	}
	onChanges(e) {
		this.connection.on("ui.changes", (t) => e(t));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", (t) => e(t));
	}
	onReconnecting(e) {
		this.connection.onreconnecting((t) => {
			this.currentState = "Reconnecting", e(t);
		});
	}
	onReconnected(e) {
		this.connection.onreconnected(() => {
			this.currentState = "Connected", Promise.resolve(e()).catch((e) => {
				c("reattach after reconnect failed.", e);
			});
		});
	}
	onClosed(e) {
		this.connection.onclose((t) => {
			this.currentState = "Disconnected", this.started = !1, e(t);
		});
	}
	async startAsync() {
		if (!(this.started || this.connection.state !== W.Disconnected)) try {
			this.currentState = "Connecting", await this.connection.start(), this.started = !0, this.currentState = "Connected", l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				tabId: this.tabId
			});
		} catch (e) {
			throw this.started = !1, this.currentState = "Disconnected", c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== W.Disconnected && (await this.connection.stop(), this.started = !1, this.currentState = "Disconnected");
	}
	async attachAsync(e) {
		return await this.invokeAsync("AttachAsync", e);
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", e);
	}
	async processChangeSetAsync(e) {
		return await this.invokeAsync("ProcessChangeSetAsync", e);
	}
	async requestItemWindowAsync(e) {
		return await this.invokeAsync("RequestItemWindowAsync", e);
	}
	async invokeAsync(e, ...t) {
		await this.ensureConnectedAsync();
		try {
			return await this.connection.invoke(e, ...t);
		} catch (t) {
			throw c("SignalR invocation failed.", {
				methodName: e,
				error: t
			}), t;
		}
	}
	async ensureConnectedAsync() {
		if (this.connection.state !== W.Connected) {
			if (this.connection.state === W.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, zc = class {
	transport;
	constructor(e) {
		this.transport = e;
	}
	async dispatchAsync(e) {
		return await this.transport.processChangeSetAsync({ updates: [e] });
	}
}, Bc = "input, select, textarea, button, a[href], [tabindex]:not([tabindex=\"-1\"])", Vc = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Oe(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Oe(e.effect?.kind), n = this.handlers.get(t);
		if (n === void 0) {
			s("client effect kind is not supported.", {
				kind: e.effect?.kind,
				effect: e.effect
			});
			return;
		}
		n(e);
	}
	registerDefaults() {
		this.register("Navigate", (e) => {
			let t = Kc(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("Focus", (e) => {
			let t = Hc(e);
			t !== null && Gc(t);
		}), this.register("ScrollTo", (e) => {
			let t = Hc(e);
			if (t === null) return;
			let n = e.effect, r = ke(n.behavior), i = Ae(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = Hc(e);
			if (t === null) return;
			let n = e.effect, r = Me(n.axis) !== "Horizontal", i = Uc(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = je(n.position), u;
			switch (l) {
				case "Start":
					u = 0;
					break;
				case "End":
					u = o;
					break;
				case "Offset":
					u = n.offset ?? 0;
					break;
				case "PageBack":
					u = c - a;
					break;
				case "PageForward":
					u = c + a;
					break;
				default:
					s("scroll effect carries an unsupported position.", e.effect);
					return;
			}
			u = Math.max(0, Math.min(o, u));
			let d = ke(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			Hc(e)?.removeAttribute(de);
		}), this.register("Hide", (e) => {
			Hc(e)?.setAttribute(de, "");
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("CloseDialog", (e) => {
			this.applyDialogEffect(e, "CloseDialog", (e, t) => e.close(t));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (t.message === void 0 || t.message.length === 0) {
				s("show notification effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("show notification effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.show({
				message: t.message,
				severity: t.severity
			});
		});
	}
	applyDialogEffect(e, t, n) {
		let r = e.effect.dialogKey;
		if (r === void 0 || r.length === 0) {
			s(`${t} effect carries no dialog key.`, e.effect);
			return;
		}
		if (this.dialogs === void 0) {
			s(`${t} effect arrived but no dialog engine is wired up.`, r);
			return;
		}
		n(this.dialogs, r);
	}
};
function Hc(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(h(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function Uc(e, t) {
	if (Wc(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (Wc(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (Wc(n, t)) return n;
	return null;
}
function Wc(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function Gc(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Bc))) {
		e.focus();
		return;
	}
	let t = e.querySelector(Bc);
	if (t instanceof HTMLElement) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function Kc(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = e.request?.parameters;
	if (n == null) return t;
	let r = new URLSearchParams();
	for (let [e, t] of Object.entries(n)) if (t != null) {
		if (Array.isArray(t)) {
			for (let n of t) r.append(e, String(n));
			continue;
		}
		r.append(e, String(t));
	}
	let i = r.toString();
	return i.length === 0 ? t : `${t}?${i}`;
}
//#endregion
//#region src/interactions/dialog-engine.ts
var qc = "data-ui-dialog", Jc = "data-ui-dialog-modal", Yc = "data-ui-dialog-close-backdrop", Xc = "data-ui-dialog-close-escape", Zc = "data-ui-dialog-backdrop", Qc = "ui-dialog__surface", $c = [
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"button:not([disabled])",
	"a[href]",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(", "), el = class {
	root;
	returnFocusByKey = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		let n = document.activeElement;
		return n instanceof HTMLElement && this.returnFocusByKey.set(e, n), t.removeAttribute("hidden"), this.focusInitial(t), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		t.setAttribute("hidden", "");
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), n !== void 0 && n.isConnected && n.focus(), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${qc}="${t}"]`);
	}
	focusInitial(e) {
		let t = e.querySelector($c);
		if (t !== null) {
			t.focus();
			return;
		}
		e.querySelector(`.${Qc}`)?.focus();
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Zc}]`);
		if (n === null) return;
		let r = n.closest(`[${qc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(Yc)) return;
		let i = r.getAttribute(qc);
		i !== null && this.close(i);
	}
	handleKeydown(e) {
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(Xc)) {
				let n = t.getAttribute(qc);
				n !== null && (e.preventDefault(), this.close(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(Jc) && this.trapTab(t, e);
		}
	}
	getTopmostOpen() {
		let e = [...this.root.querySelectorAll(`[${qc}]:not([hidden])`)];
		return e.length === 0 ? null : e[e.length - 1];
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll($c)].filter((e) => e.offsetParent !== null || e === document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = n[0], i = n[n.length - 1], a = document.activeElement;
		if (!t.shiftKey && a === i) {
			t.preventDefault(), r.focus();
			return;
		}
		t.shiftKey && (a === r || !e.contains(a)) && (t.preventDefault(), i.focus());
	}
}, tl = new Map([
	["Default", "default"],
	["Primary", "primary"],
	["Accent", "accent"],
	["Background", "background"],
	["Surface", "surface"],
	["OnPrimary", "on-primary"],
	["OnAccent", "on-accent"],
	["OnBackground", "on-background"],
	["OnSurface", "on-surface"],
	["Info", "info"],
	["Warning", "warning"],
	["Success", "success"],
	["Danger", "danger"],
	["OnInfo", "on-info"],
	["OnWarning", "on-warning"],
	["OnSuccess", "on-success"],
	["OnDanger", "on-danger"],
	["Muted", "muted"],
	["Selected", "selected"],
	["FocusRing", "focus-ring"],
	["Border", "border"],
	["Shadow", "shadow"],
	["Overlay", "overlay"],
	["Small", "small"],
	["Medium", "medium"],
	["Large", "large"],
	["Display", "display"],
	["Title", "title"],
	["Subtitle", "subtitle"],
	["Body", "body"],
	["Caption", "caption"],
	["Overline", "overline"],
	["Start", "start"],
	["Center", "center"],
	["End", "end"],
	["Justify", "justify"],
	["NoWrap", "nowrap"],
	["Wrap", "wrap"],
	["WrapEllipsis", "wrap-ellipsis"],
	["Inline", "inline"],
	["Trailing", "trailing"],
	["Outline", "outline"],
	["Ghost", "ghost"],
	["Link", "link"],
	["Light", "light"],
	["Dark", "dark"],
	["Auto", "auto"],
	["Disabled", "disabled"],
	["Always", "always"],
	["Proximity", "proximity"],
	["Mandatory", "mandatory"],
	["Stretch", "stretch"],
	["Horizontal", "horizontal"],
	["Vertical", "vertical"],
	["Text", "text"],
	["Card", "card"],
	["Circle", "circle"],
	["KeepSearchInput", "keep"],
	["ReplaceWithSelectedItem", "replace"],
	["None", "none"],
	["Both", "both"],
	["BottomStart", "bottom-start"],
	["Bottom", "bottom"],
	["BottomEnd", "bottom-end"],
	["TopStart", "top-start"],
	["Top", "top"],
	["TopEnd", "top-end"],
	["LeftStart", "left-start"],
	["Left", "left"],
	["LeftEnd", "left-end"],
	["RightStart", "right-start"],
	["Right", "right"],
	["RightEnd", "right-end"],
	["Hidden", "hidden"],
	["Show", "visible"]
]), nl = [
	"default",
	"primary",
	"accent",
	"background",
	"surface",
	"on-primary",
	"on-accent",
	"on-background",
	"on-surface",
	"info",
	"warning",
	"success",
	"danger",
	"on-info",
	"on-warning",
	"on-success",
	"on-danger",
	"muted",
	"selected",
	"focus-ring",
	"border",
	"shadow",
	"overlay"
];
function rl(e) {
	return J(e, nl);
}
var il = [
	"small",
	"medium",
	"large"
], al = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], ol = [
	"start",
	"center",
	"end",
	"justify"
], sl = [
	"nowrap",
	"wrap",
	"wrap-ellipsis"
], cl = new Map([
	["primary", "--ui-color-primary"],
	["accent", "--ui-color-accent"],
	["background", "--ui-color-background"],
	["surface", "--ui-color-surface"],
	["on-primary", "--ui-color-on-primary"],
	["on-accent", "--ui-color-on-accent"],
	["on-background", "--ui-color-on-background"],
	["on-surface", "--ui-color-on-surface"],
	["info", "--ui-color-info"],
	["warning", "--ui-color-warning"],
	["success", "--ui-color-success"],
	["danger", "--ui-color-danger"],
	["on-info", "--ui-color-on-info"],
	["on-warning", "--ui-color-on-warning"],
	["on-success", "--ui-color-on-success"],
	["on-danger", "--ui-color-on-danger"],
	["selected", "--ui-color-selected"],
	["focus-ring", "--ui-color-focus-ring"],
	["border", "--ui-color-border"],
	["shadow", "--ui-color-shadow"],
	["overlay", "--ui-color-overlay"]
]), ll = ["inline", "trailing"], ul = ["filled", "underline"], dl = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link"
], fl = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], pl = [
	"light",
	"dark",
	"auto"
], ml = [
	"start",
	"center",
	"end",
	"stretch"
], hl = ["hidden", "visible"], gl = ["horizontal", "vertical"], _l = ["stack", "wrap"], vl = [
	"disabled",
	"auto",
	"always"
], yl = [
	"disabled",
	"proximity",
	"mandatory"
], bl = [
	"text",
	"card",
	"circle"
], xl = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Sl = [
	"default",
	"fill",
	"contain",
	"cover",
	"none"
], Cl = ["linear", "circular"], wl = ["keep", "replace"], Tl = [
	"none",
	"vertical",
	"horizontal",
	"both"
], El = [
	"bottom-start",
	"bottom",
	"bottom-end",
	"top-start",
	"top",
	"top-end",
	"left-start",
	"left",
	"left-end",
	"right-start",
	"right",
	"right-end"
], Dl = [
	"None",
	"Shade",
	"Tint"
], Ol = new Map([
	["colorClass", (e) => `ui-color--${J(e, nl)}`],
	["themeColorClass", (e) => zl(e)],
	["iconClass", (e) => Kl(e)],
	["iconSizeClass", (e) => `ui-icon-size--${J(e, il)}`],
	["textTypeClass", (e) => `ui-text-type--${J(e, al)}`],
	["textAppearanceClass", (e) => Bl(e)],
	["textAlignmentClass", (e) => `ui-text--align-${J(e, ol)}`],
	["textWrapClass", (e) => `ui-text--${J(e, sl)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${J(e, ll)}`],
	["buttonContentBadgePlacementClass", (e) => `ui-button-content__badge--${J(e, ll)}`],
	["buttonContentTextAlignmentClass", (e) => `ui-button-content--align-${J(e, ol)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${J(e, fl)}`],
	["buttonClass", (e) => `ui-button--${J(e, dl)}`],
	["orientationClass", (e) => `ui-orientation--${J(e, gl)}`],
	["itemsViewLayoutClass", (e) => `ui-items-view--${J(e, _l)}`],
	["scrollXClass", (e) => `ui-scroll-x--${J(e, vl)}`],
	["scrollYClass", (e) => `ui-scroll-y--${J(e, vl)}`],
	["scrollSnapClass", (e) => `ui-scroll-snap--${J(e, yl)}`],
	["skeletonVariantClass", (e) => `ui-preview-${J(e, bl)}`],
	["inputAppearanceClass", (e) => `ui-input--${J(e, ul)}`],
	["inputBadgePlacementClass", (e) => `ui-input__badge--${J(e, ll)}`],
	["textInputTypeAttribute", (e) => J(e, xl)],
	["themeNameCss", (e) => J(e, pl)],
	["alignmentCss", (e) => J(e, ml)],
	["alignmentStretchFallbackCss", (e) => J(e, ml) === "stretch" ? "start" : ""],
	["overflowCss", (e) => J(e, hl)],
	["layoutLengthCss", (e) => Ml(e)],
	["thicknessCss", (e) => Nl(e)],
	["radiusCss", (e) => Pl(e)],
	["gridUnitCss", (e) => Fl(e)],
	["pixelsCss", (e) => X(e)],
	["gridTemplateCss", (e) => Il(e)],
	["colorVariantCss", (e) => Ul(e)],
	["themeColorCss", (e) => Rl(e)],
	["textAppearanceFontSizeCss", (e) => Vl(e, "size")],
	["textAppearanceFontWeightCss", (e) => Vl(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Vl(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Vl(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => Ml(Z(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => Ml(Z(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => Ml(Z(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => Ml(Z(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => Ml(Z(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => Nl(Z(e, "base"))],
	["responsiveThicknessSmCss", (e) => Nl(Z(e, "sm"))],
	["responsiveThicknessMdCss", (e) => Nl(Z(e, "md"))],
	["responsiveThicknessXlCss", (e) => Nl(Z(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => Nl(Z(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => Yl(Z(e, "base"))],
	["responsivePixelsSmCss", (e) => Yl(Z(e, "sm"))],
	["responsivePixelsMdCss", (e) => Yl(Z(e, "md"))],
	["responsivePixelsXlCss", (e) => Yl(Z(e, "xl"))],
	["responsivePixelsXxlCss", (e) => Yl(Z(e, "xxl"))],
	["visibleHiddenBaseAttribute", (e) => Xl(e, "base")],
	["visibleHiddenSmAttribute", (e) => Xl(e, "sm")],
	["visibleHiddenMdAttribute", (e) => Xl(e, "md")],
	["visibleHiddenXlAttribute", (e) => Xl(e, "xl")],
	["visibleHiddenXxlAttribute", (e) => Xl(e, "xxl")],
	["gridPlacementBaseColumnCss", (e) => Y(e, "base", "column")],
	["gridPlacementBaseRowCss", (e) => Y(e, "base", "row")],
	["gridPlacementBaseColumnSpanCss", (e) => Y(e, "base", "columnSpan")],
	["gridPlacementBaseRowSpanCss", (e) => Y(e, "base", "rowSpan")],
	["gridPlacementSmColumnCss", (e) => Y(e, "sm", "column")],
	["gridPlacementSmRowCss", (e) => Y(e, "sm", "row")],
	["gridPlacementSmColumnSpanCss", (e) => Y(e, "sm", "columnSpan")],
	["gridPlacementSmRowSpanCss", (e) => Y(e, "sm", "rowSpan")],
	["gridPlacementMdColumnCss", (e) => Y(e, "md", "column")],
	["gridPlacementMdRowCss", (e) => Y(e, "md", "row")],
	["gridPlacementMdColumnSpanCss", (e) => Y(e, "md", "columnSpan")],
	["gridPlacementMdRowSpanCss", (e) => Y(e, "md", "rowSpan")],
	["gridPlacementXlColumnCss", (e) => Y(e, "xl", "column")],
	["gridPlacementXlRowCss", (e) => Y(e, "xl", "row")],
	["gridPlacementXlColumnSpanCss", (e) => Y(e, "xl", "columnSpan")],
	["gridPlacementXlRowSpanCss", (e) => Y(e, "xl", "rowSpan")],
	["gridPlacementXxlColumnCss", (e) => Y(e, "xxl", "column")],
	["gridPlacementXxlRowCss", (e) => Y(e, "xxl", "row")],
	["gridPlacementXxlColumnSpanCss", (e) => Y(e, "xxl", "columnSpan")],
	["gridPlacementXxlRowSpanCss", (e) => Y(e, "xxl", "rowSpan")],
	["imageFitClass", (e) => `ui-image-fit--${J(e, Sl)}`],
	["progressVariantClass", (e) => `ui-progress--${J(e, Cl)}`],
	["progressPercentText", (e) => `${Jl(e)}%`],
	["searchSelectionModeClass", (e) => `ui-search-mode--${J(e, wl)}`],
	["textAreaResizeCss", (e) => J(e, Tl)],
	["flyoutPlacementClass", (e) => `ui-flyout--${J(e, El)}`]
]), kl = [
	[
		0,
		"IronFog",
		120,
		120,
		120
	],
	[
		1,
		"SilverNight",
		100,
		120,
		140
	],
	[
		2,
		"BronzeDusk",
		140,
		120,
		120
	],
	[
		10,
		"StellarRed",
		180,
		40,
		40
	],
	[
		11,
		"NebulaRose",
		240,
		80,
		120
	],
	[
		12,
		"LunarPink",
		240,
		140,
		180
	],
	[
		20,
		"SolarAmber",
		200,
		100,
		40
	],
	[
		21,
		"NebulaGold",
		240,
		240,
		80
	],
	[
		22,
		"LunarYellow",
		240,
		240,
		160
	],
	[
		30,
		"EclipseOlive",
		100,
		120,
		60
	],
	[
		31,
		"NebulaLime",
		160,
		180,
		80
	],
	[
		32,
		"LunarSage",
		200,
		220,
		160
	],
	[
		40,
		"AuroraGreen",
		40,
		120,
		40
	],
	[
		41,
		"NebulaMint",
		100,
		160,
		100
	],
	[
		42,
		"LunarFern",
		140,
		180,
		140
	],
	[
		50,
		"AstralTeal",
		0,
		110,
		100
	],
	[
		51,
		"NebulaCyan",
		40,
		180,
		180
	],
	[
		52,
		"LunarMoss",
		120,
		200,
		200
	],
	[
		60,
		"QuantumBlue",
		40,
		80,
		160
	],
	[
		61,
		"NebulaAqua",
		80,
		140,
		200
	],
	[
		62,
		"LunarAzure",
		160,
		180,
		220
	],
	[
		70,
		"NovaPurple",
		80,
		60,
		180
	],
	[
		71,
		"NebulaViolet",
		160,
		100,
		200
	],
	[
		72,
		"LunarLavender",
		180,
		160,
		220
	],
	[
		80,
		"Comet",
		80,
		200,
		80
	],
	[
		81,
		"Flare",
		220,
		80,
		80
	],
	[
		82,
		"Ember",
		220,
		120,
		80
	],
	[
		83,
		"Photon",
		240,
		220,
		120
	],
	[
		84,
		"Vortex",
		180,
		140,
		250
	],
	[
		85,
		"Halo",
		180,
		180,
		250
	]
], Al = new Map(kl.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), jl = new Map(kl.map(([e, t]) => [e, t]));
function J(e, t) {
	return typeof e == "string" ? tl.get(e) ?? Ql(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function Ml(e) {
	if (e == null) return "";
	if (typeof e == "number") return X(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "auto" : n === "Absolute" || n === 1 ? X(r) : "";
}
function Nl(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function Pl(e) {
	if (e == null) return "";
	if (typeof e == "number") return X(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? X(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function Fl(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue;
	return n === "Absolute" || n === 1 ? X(r) : n === "Star" || n === 0 ? Fl(r) : n === "Auto" || n === 2 ? i == null ? "auto" : `minmax(${i}px, auto)` : "";
}
function Il(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return Fl(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return Fl(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${Fl(e[0])})` : e.map((e) => Fl(e)).join(" ");
}
function Y(e, t, n) {
	return Ll(Z(e, t), n);
}
function Ll(e, t) {
	if (e == null) return "";
	if (typeof e != "object") return String(e);
	let n = e;
	switch (t) {
		case "column": return String(n.column ?? "");
		case "row": return String(n.row ?? "");
		case "columnSpan": return String(n.columnSpan ?? "");
		case "rowSpan": return String(n.rowSpan ?? "");
		default: return "";
	}
}
function Rl(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Hl(e)) return Ul(e);
	let t = e, n = Ul(t.light), r = Ul(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = cl.get(J(o, nl));
	return s ? `var(${s})` : "";
}
function zl(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${J(n, nl)}`;
}
function Bl(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${J(n, al)}`;
}
function Vl(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return X(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : X(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : X(e);
		}
		default: return "";
	}
}
function Hl(e) {
	return typeof e != "object" || !e ? !1 : e.name !== void 0;
}
function Ul(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = Wl(t.name), r = n === null ? void 0 : Al.get(n);
	if (!r) return "";
	let i = Gl(t.adjustment), a = (t.factor ?? 0) / 10, o = t.opacity ?? 255, [s, c, l] = r;
	return i === "Shade" ? (s = Q(s * (1 - a)), c = Q(c * (1 - a)), l = Q(l * (1 - a))) : i === "Tint" && (s = Q(s + (255 - s) * a), c = Q(c + (255 - c) * a), l = Q(l + (255 - l) * a)), `#${Zl(s)}${Zl(c)}${Zl(l)}${Zl(o)}`;
}
function Wl(e) {
	if (typeof e == "number") return jl.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Gl(e) {
	if (typeof e == "number") return Dl[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Kl(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = "ui-icon-glyph--";
	for (let e of t) {
		if (ql(e)) {
			n += e.toLowerCase();
			continue;
		}
		(e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
function ql(e) {
	let t = e.charCodeAt(0);
	return t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122;
}
function Jl(e) {
	let t = typeof e == "number" ? e : Number(e ?? 0);
	return Math.round(Math.min(100, Math.max(0, t)));
}
function X(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Yl(e) {
	return e == null ? "" : X(e);
}
function Z(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	if (n === void 0 || !("base" in n || "Base" in n)) return t === "base" ? e : void 0;
	let r = t.charAt(0).toUpperCase() + t.slice(1);
	return n[t] ?? n[r];
}
function Xl(e, t) {
	return Z(e, t) === !1 ? "" : void 0;
}
function Q(e) {
	return Math.min(255, Math.max(0, Math.round(e)));
}
function Zl(e) {
	return Q(e).toString(16).padStart(2, "0").toUpperCase();
}
function Ql(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
//#endregion
//#region src/interactions/notification-engine.ts
var $l = "ui-notification-host", eu = "ui-notification", tu = "ui-notification--leaving", nu = "ui-notification__message", ru = "ui-notification__close", iu = 5e3, au = 160, ou = new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), su = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? iu;
	}
	show(e) {
		let t = rl(e.severity), n = document.createElement("div");
		n.className = ou.has(t) ? `${eu} ${eu}--${t}` : eu, n.setAttribute("role", t === "danger" ? "alert" : "status"), n.setAttribute("aria-live", t === "danger" ? "assertive" : "polite");
		let r = document.createElement("span");
		r.className = nu, r.textContent = e.message;
		let i = document.createElement("button");
		i.type = "button", i.className = ru, i.setAttribute("aria-label", "Close"), i.textContent = "×", i.addEventListener("click", () => this.dismiss(n)), n.append(r, i), this.ensureHost().append(n);
		let a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		return n.addEventListener("mouseenter", () => window.clearTimeout(a)), n.addEventListener("mouseleave", () => {
			a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		}), n;
	}
	dismiss(e) {
		!e.isConnected || e.classList.contains(tu) || (e.classList.add(tu), window.setTimeout(() => {
			e.remove(), this.host !== null && this.host.childElementCount === 0 && (this.host.remove(), this.host = null);
		}, au));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${$l}`);
		if (t !== null) return this.host = t, t;
		let n = document.createElement("div");
		return n.className = $l, e.append(n), this.host = n, n;
	}
}, cu = class {
	addressResolver;
	operations;
	extensions;
	state;
	valueChangeHandlers = /* @__PURE__ */ new Set();
	constructor(e, t, n, r) {
		this.addressResolver = e, this.operations = t, this.extensions = n, this.state = r;
	}
	addValueChangeHandler(e) {
		return this.valueChangeHandlers.add(e), () => this.valueChangeHandlers.delete(e);
	}
	applyPropertyValue(e, t, n, r) {
		let i = this.addressResolver.resolveProperties(e, t);
		if (i.length === 0) this.addressResolver.hasRenderedComponent(e) && s("property address could not be resolved.", {
			reference: e,
			dynamicParameters: t,
			value: n,
			local: r
		});
		else for (let t of i[0].definition.operations) {
			let a = this.extensions.converters.convert(t.converter, n);
			for (let o of i) {
				let i = this.addressResolver.resolveOperationTarget(o, t);
				if (i === null) {
					s("property operation target was not found.", {
						reference: e,
						operation: t
					});
					continue;
				}
				this.operations.apply({
					resolved: o,
					operation: t,
					target: i,
					value: n,
					convertedValue: a,
					local: r
				});
			}
		}
		this.state.set(e, t, n) && this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: n,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	notifyValueChanged(e) {
		for (let t of this.valueChangeHandlers) t(e);
	}
}, lu = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = uu(h(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = uu(h(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function uu(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var du = [
	d,
	"data-ui-context",
	f
];
function fu(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName;
	let l = pu(c, e, t, a);
	for (let l of e.slots) {
		let e = a.getVariantTemplate(t, l.variantKey);
		if (e === void 0) {
			s("composite item slot template was not found.", {
				componentId: t,
				variantKey: l.variantKey
			});
			continue;
		}
		let u = o.renderFromTemplate(e, n, i);
		if (u === null) continue;
		let d = document.createElement(l.wrapperElementName);
		d.className = l.wrapperClassName, d.appendChild(u), Yo(d, r, n), c.appendChild(d);
	}
	return Yo(c, r, n), o.registerItemScope(c, l, n), c;
}
function pu(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of du) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), _(a);
}
//#endregion
//#region src/updates/update-processor.ts
var mu = class {
	metadata;
	propertyPatchEngine;
	state;
	itemsRenderer;
	itemsTemplates;
	dom;
	validationHandlers = [];
	applyingChangeSet = !1;
	domRebuildPending = !1;
	constructor(e, t, n, r, i, a) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a;
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${ne}]`)) {
			let t = We(e);
			t !== null && (this.registerServerRenderedItems(e, t), this.syncItemsHost(e, t));
		}
	}
	registerServerRenderedItems(e, t) {
		for (let n of this.metadata.getItemValues(t)) {
			let t = e.querySelector(`:scope > [${p}="${me(n.key)}"]`);
			t !== null && this.itemsRenderer.registerItemScope(t, vu(t), n.item);
		}
	}
	syncItemsHost(e, t) {
		Ko(e, t, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer,
			state: this.state
		});
	}
	applyChangeSet(e) {
		let t = e?.updates;
		if (!(t === void 0 || t.length === 0)) {
			this.applyingChangeSet = !0;
			try {
				for (let e of t) this.applyUpdate(e);
			} finally {
				this.applyingChangeSet = !1;
			}
			this.domRebuildPending && (this.domRebuildPending = !1, this.dom.rebuild());
		}
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	applyUpdate(e) {
		switch (De(e)) {
			case "Value":
				this.applyValueUpdate(e);
				return;
			case "Validation":
				this.applyValidationUpdate(e);
				return;
			case "ContextRebuild":
				this.applyComponentStateReset(e.component?.id), l("context rebuild update is not implemented by the update processor yet.", e);
				return;
			case "CollectionChange":
				this.applyCollectionChangeUpdate(e);
				return;
			case "FullResync":
				this.state.clear(), s("full resync update is not implemented by the update processor yet.", e);
				return;
			default:
				s("server update is not supported by update processor yet.", e);
				return;
		}
	}
	applyValueUpdate(e) {
		let t = h(e.address?.component?.id), n = e.address?.property?.name ?? "", r = e.address?.component?.dynamicParameters ?? [];
		if (t <= 0 || n.length === 0) {
			s("value update has an invalid address.", e);
			return;
		}
		let i = this.metadata.getBindingByComponentAndPropertyName(t, n);
		if (i === void 0) {
			this.metadata.hasComponentBindings(t) ? l("no rendered binding for this property; nothing to patch.", {
				componentId: t,
				propertyName: n
			}) : s(`binding metadata was not found for component ${t} (${n}).`, e);
			return;
		}
		this.propertyPatchEngine.applyPropertyValue(i, r, e.value, !1);
	}
	applyValidationUpdate(e) {
		if (h(e.address?.component?.id) <= 0) {
			s("validation update has an invalid address.", e);
			return;
		}
		for (let t of this.validationHandlers) t(e);
	}
	applyComponentStateReset(e) {
		let t = h(e);
		t > 0 && this.state.deleteComponent(t);
	}
	applyCollectionChangeUpdate(e) {
		let t = h(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = this.findItemsHost(t, e.component?.dynamicParameters ?? []);
		if (n === null) {
			s("items host was not found for a collection change update.", e);
			return;
		}
		switch (Ee(e.action)) {
			case "Insert":
				this.applyCollectionInsert(n, t, e.items ?? []);
				break;
			case "Remove":
				hu(n, e.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(n, t, e.items ?? []);
				break;
			case "Move":
				gu(n, e.moves ?? []);
				break;
			case "Reset":
				n.replaceChildren();
				break;
			default:
				s("collection update action is not supported.", e);
				return;
		}
		this.syncItemsHost(n, t), this.applyingChangeSet ? this.domRebuildPending = !0 : this.dom.rebuild();
	}
	findItemsHost(e, t) {
		return this.dom.findComponent(e, t)?.querySelector("[data-ui-items-host]") ?? null;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", i);
				continue;
			}
			let a = this.renderItemElement(t, i.item, n, r);
			a !== null && _u(e, a, i.index ?? null);
		}
	}
	renderItemElement(e, t, n, r) {
		let i = this.metadata.getItemsTemplateMetadata(e)?.composite;
		return i == null ? this.itemsRenderer.renderItem(e, t, n, r) : fu(i, e, t, n, r, this.itemsTemplates, this.itemsRenderer);
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let a = yu(e, i.oldKey ?? n), o = this.renderItemElement(t, i.item, n, r);
			o !== null && (a === null ? _u(e, o, i.index ?? null) : a.replaceWith(o));
		}
	}
};
function hu(e, t) {
	for (let n of t) n.key === null || n.key === void 0 ? s("collection remove carried no item key.", n) : yu(e, n.key)?.remove();
}
function gu(e, t) {
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : yu(e, n.key);
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let r = M(e).filter((e) => e !== t);
		e.insertBefore(t, r[n.newIndex ?? r.length] ?? null);
	}
}
function _u(e, t, n) {
	let r = M(e);
	e.insertBefore(t, n === null ? null : r[n] ?? null);
}
function vu(e) {
	let t = _(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : _(n);
}
function yu(e, t) {
	return e.querySelector(`:scope > [${p}="${me(t)}"]`);
}
//#endregion
//#region src/interactions/validation-engine.ts
var bu = "ui-invalid", xu = "data-ui-validation-message", Su = "ui-color--", Cu = "--ui-validation-color", wu = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	serverRefusalByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyChangeTrigger(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0);
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyChangeTrigger(e) {
		let t = h(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Ce(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = h(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.serverRefusalByElement.delete(i) : (this.serverRefusalByElement.set(i, {
			message: r,
			severity: e.severity ?? "Danger"
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.serverRefusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		let n = this.serverRefusalByElement.get(t);
		if (n !== void 0) {
			Tu(t, n);
			return;
		}
		let r = this.failingRulesByElement.get(t), i = r === void 0 ? void 0 : this.options.metadata.getValidationsForComponent(e).find((e) => r.has(e));
		Tu(t, i === void 0 ? void 0 : {
			message: i.message,
			severity: i.severity
		});
	}
	applyInputTrigger(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		if (t === null) return;
		let n = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Ce(e.trigger) === "Change");
		n.length !== 0 && this.evaluateAndApply(t.componentId, t.element, n, Qe(e.target));
	}
	applyBlurTrigger(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		if (t === null) return;
		let n = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Ce(e.trigger) === "Blur");
		n.length !== 0 && this.evaluateAndApply(t.componentId, t.element, n, Qe(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${ue}="${me(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			this.serverRefusalByElement.has(t.element) && (n = !1);
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Ce(e.trigger) === "Submit");
			r.length !== 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, Qe(e)), (this.failingRulesByElement.get(t.element)?.size ?? 0) > 0 && (n = !1));
		}
		return n;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) mt(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function Tu(e, t) {
	e.classList.toggle(bu, t !== void 0), Eu(e, t), Ou(e, t);
	let n = e.querySelector(`[${xu}]`);
	n !== null && (n.textContent = t?.message ?? "", Eu(n, t));
}
function Eu(e, t) {
	for (let t of [...e.classList]) t.startsWith(Su) && e.classList.remove(t);
	if (t === void 0) return;
	let n = Du(t);
	n !== void 0 && e.classList.add(n);
}
function Du(e) {
	return Ol.get("colorClass")(e.severity);
}
function Ou(e, t) {
	let n = e, r = t === void 0 ? void 0 : Du(t);
	if (r === void 0) {
		n.style.removeProperty(Cu);
		return;
	}
	let i = r.slice(10);
	n.style.setProperty(Cu, `var(--ui-color-${i})`);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var ku = /* @__PURE__ */ new WeakMap(), Au = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(we(e), t);
	}
	apply(e) {
		let t = we(e.operation.kind), n = this.handlers.get(t);
		if (n === void 0) {
			s("DOM operation kind is not supported.", {
				kind: e.operation.kind,
				operation: e.operation
			});
			return;
		}
		n(e);
	}
	registerDefaults() {
		this.register("Text", (e) => {
			e.target.textContent = qe(e.convertedValue);
		}), this.register("Attribute", (e) => {
			let t = $(e.operation);
			if (v(e.convertedValue)) {
				e.target.removeAttribute(t);
				return;
			}
			e.target.setAttribute(t, qe(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			e.target.removeAttribute($(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = $(e.operation);
			!Je(e.value) && ju(e.value, e.operation.condition ?? "HasValue") ? e.target.setAttribute(t, v(e.convertedValue) ? "" : qe(e.convertedValue)) : e.target.removeAttribute(t);
		}), this.register("Class", (e) => {
			let t = !Je(e.value) && ju(e.value, e.operation.condition ?? "None") ? qe(e.convertedValue).trim() : "";
			Mu(e.target, Nu(e), t);
		}), this.register("ToggleClass", (e) => {
			let t = $(e.operation), n = !Je(e.value) && ju(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? qe(e.convertedValue).trim() : "";
				Mu(e.target, Nu(e), t);
			}
		}), this.register("Style", (e) => {
			let t = $(e.operation), n = e.target;
			if (v(e.value) || v(e.convertedValue) || e.convertedValue === "") {
				n.style.removeProperty(t);
				return;
			}
			n.style.setProperty(t, qe(e.convertedValue));
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = $(e.operation);
			e.target[t] = e.convertedValue;
		});
	}
};
function ju(e, t) {
	switch (Te(t)) {
		case "None": return !0;
		case "HasValue": return !v(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !v(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !v(e);
	}
}
function Mu(e, t, n) {
	let r = ku.get(e);
	r === void 0 && (r = /* @__PURE__ */ new Map(), ku.set(e, r));
	let i = r.get(t);
	if (i !== void 0 && i.length > 0 && e.classList.remove(i), n.length === 0) {
		r.delete(t);
		return;
	}
	e.classList.add(n), r.set(t, n);
}
function Nu(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function $(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var Pu = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Ol.has(e.name),
			convert: (e) => Ol.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = Fu(e.name), n = {
			name: t,
			canConvert: e.canConvert ?? ((e) => e.name === t),
			convert: e.convert
		};
		this.converters.set(t, n);
	}
	convert(e, t) {
		let n = e?.trim();
		if (n === void 0 || n.length === 0) return t;
		let r = this.converters.get(n), i = {
			name: n,
			value: t
		};
		if (r !== void 0 && r.canConvert(i)) return r.convert(i);
		let a = this.converters.get("*");
		return a !== void 0 && a.canConvert(i) ? a.convert(i) : (s("converter was not found.", { converter: n }), t);
	}
};
function Fu(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var Iu = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = g(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = g(e.domEventName) || t;
		this.definitions.set(t, {
			name: t,
			domEventName: n,
			attach: e.attach ?? ((e) => e.root.addEventListener(n, e.dispatch, !0))
		});
	}
	registerNative(e, t = e) {
		this.register({
			name: e,
			domEventName: t
		});
	}
	get(e) {
		return this.definitions.get(g(e));
	}
};
function Lu(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.registerNative("expand"), e.registerNative("collapse"), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename");
}
//#endregion
//#region src/extensions/extension-registry.ts
var Ru = class {
	converters = new Pu();
	events = new Iu();
	operations = new Au();
	constructor(e, t, n) {
		Lu(this.events);
		for (let t of e ?? []) this.converters.register(t);
		for (let e of t ?? []) this.events.register(e);
		for (let e of n ?? []) this.operations.register(e.kind, e.handler);
	}
	registerConverter(e) {
		this.converters.register(e);
	}
	registerEvent(e) {
		this.events.register(e);
	}
	registerDomOperation(e) {
		this.operations.register(e.kind, e.handler);
	}
}, zu = "ne.standard.ui.tabId", Bu = class {
	options;
	tabId;
	root;
	metadata = new ge(js());
	dom;
	transport;
	dispatcher;
	updateProcessor;
	eventPipeline;
	extensions;
	dialogs;
	windows;
	virtualization;
	notifications;
	effects;
	reactiveSources;
	attachTask = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.tabId = Hu(e.tabIdStorageKey ?? zu), this.dom = new Ue(this.root), this.virtualization = new Ts({ root: this.root }), this.extensions = new Ru(e.converters, e.eventDefinitions, e.domOperations);
		let t = new Le(this.dom, this.metadata), n = this.extensions.operations, r = new Is(), i = new cu(t, n, this.extensions, r);
		this.reactiveSources = new lu(i), this.dialogs = new el({ root: this.root }), this.notifications = new su({ root: this.root }), this.effects = new Vc({
			dialogs: this.dialogs,
			notifications: this.notifications
		});
		let a = new gt(this.metadata), o = new ut(a, i, new pt(), {
			effects: this.effects,
			dom: this.dom
		}), u = new ks(this.dom), d = new qo(this.metadata, u, this.extensions, n, r);
		this.updateProcessor = new mu(this.metadata, i, r, d, u, this.dom), new es({
			root: this.root,
			metadata: this.metadata,
			templates: u,
			renderer: d,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources
		}), this.transport = new Rc(this.tabId, e.signalR), this.dispatcher = new Ns(this.transport);
		let f = new zc(this.transport), p = new at({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: f,
			updateProcessor: this.updateProcessor
		}), ee = new wu({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			propertyPatchEngine: i,
			updateProcessor: this.updateProcessor
		});
		new sn({ root: this.root }), new dn({ root: this.root }), new bn({ root: this.root }), new Yn({ root: this.root }), new kn({ root: this.root }), new Qn({
			root: this.root,
			propertyPatchEngine: i,
			dom: this.dom
		}), new cr({
			root: this.root,
			propertyPatchEngine: i,
			dom: this.dom
		}), new ni({
			root: this.root,
			propertyPatchEngine: i,
			dom: this.dom
		}), new eo({
			root: this.root,
			propertyPatchEngine: i,
			dom: this.dom
		}), new ki({ root: this.root }), new Yi({ root: this.root }), new fa({ root: this.root }), new ba({ root: this.root }), new Ha({ root: this.root }), new Ea({ root: this.root }), new yo({ root: this.root }), new Qt({ root: this.root }), this.eventPipeline = new ct({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			applyChanges: (e) => this.applyChanges(e),
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: o,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: ee,
			valueBinding: p
		});
		for (let e of new Set([...this.metadata.getEventNames(), ...a.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.windows = new ms({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e),
			applyChanges: (e) => this.applyChanges(e)
		}), this.transport.onChanges((e) => this.applyChanges(e)), this.transport.onCommandResult((e) => {
			this.applyChanges(e.changes), this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider();
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e);
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => {
			e !== void 0 && c("SignalR connection closed.", e);
		});
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		n(this, this.options.handlerGlobalKey), await this.transport.startAsync(), await this.attachAsync();
	}
	addEvent(e, t = {}) {
		this.eventPipeline.addEvent(e, t);
	}
	addConverter(e) {
		this.extensions.registerConverter(e);
	}
	addDomOperation(e) {
		this.extensions.registerDomOperation(e);
	}
	addEffect(e) {
		this.effects.register(e.kind, e.handler);
	}
	applyChanges(e) {
		this.updateProcessor.applyChangeSet(e), this.windows.sync(), this.virtualization.sync();
	}
	async attachAsync() {
		if (this.attachTask !== null) return this.attachTask;
		this.attachTask = this.attachCoreAsync();
		try {
			await this.attachTask;
		} finally {
			this.attachTask = null;
		}
	}
	async attachCoreAsync() {
		let e = await this.transport.attachAsync({
			clientTabId: this.tabId,
			route: window.location.pathname,
			parameters: Wu(window.location.search)
		});
		this.dom.rebuild(), this.applyChanges(e.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), this.virtualization.sync(), l("runtime attached.", {
			tabId: this.tabId,
			instanceId: this.instanceId
		});
	}
};
async function Vu(e = {}) {
	let t = new Bu(e);
	return await t.startAsync(), t;
}
function Hu(e) {
	let t = null;
	try {
		t = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	try {
		let n = t?.getItem(e);
		if (n != null && n.length > 0) return n;
	} catch (e) {
		s("reading the tab id failed.", e);
	}
	let n = Uu();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function Uu() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function Wu(e) {
	let t = new URLSearchParams(e);
	if ([...t.keys()].length === 0) return null;
	let n = {};
	return t.forEach((e, t) => {
		if (Object.prototype.hasOwnProperty.call(n, t)) {
			let r = n[t];
			n[t] = Array.isArray(r) ? [...r, e] : [r, e];
			return;
		}
		n[t] = e;
	}), n;
}
t(), Vu().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
