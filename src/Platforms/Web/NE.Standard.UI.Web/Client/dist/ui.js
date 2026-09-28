//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), t = "NE.Standard.UI", n = "ne.ui:log", r = {
	debug: 0,
	warn: 1,
	error: 2,
	silent: 3
}, i = ee();
function a(e) {
	i = e;
	try {
		e === "warn" ? localStorage.removeItem(n) : localStorage.setItem(n, e);
	} catch {}
}
function o() {
	return i;
}
function s(e, t) {
	r[i] <= r.warn && te(console.warn, e, t);
}
function c(e, t) {
	r[i] <= r.error && te(console.error, e, t);
}
function l(e, t) {
	r[i] <= r.debug && te(console.debug, e, t);
}
function u() {
	return r[i] <= r.debug;
}
function d(e, t, n) {
	r[i] <= r.debug && te(console.debug, `${e} in ${f(performance.now() - t)}.`, n);
}
function f(e) {
	return `${e.toFixed(1)} ms`;
}
var p = class {
	warned = /* @__PURE__ */ new WeakSet();
	warn(e, t, n) {
		this.warned.has(e) || (this.warned.add(e), s(t, {
			subject: e,
			...n === void 0 ? {} : { data: n }
		}));
	}
};
function ee() {
	try {
		let e = localStorage.getItem(n);
		if (e !== null && e in r) return e;
	} catch {}
	return "warn";
}
function te(e, n, r) {
	r === void 0 ? e(`${t} ${n}`) : e(`${t} ${n}`, r);
}
//#endregion
//#region src/runtime/global-api.ts
var ne = 1;
function re() {
	return ae();
}
function ie(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ae();
	n.runtime = e, oe(e, n);
}
function ae() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
		contractVersion: ne,
		__pendingEvents: t,
		__pendingConverters: n,
		__pendingDomOperations: r,
		__pendingEffects: i,
		__pendingValueReaders: s,
		__pendingCollectionSinks: c,
		__pendingStrings: l,
		__pendingEngines: u,
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
		registerConverter(e, t) {
			let r = se(e, t), i = window.NEStandardUI?.runtime;
			if (i !== void 0) {
				i.addConverter(r);
				return;
			}
			n.push(r);
		},
		registerDomOperation(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addDomOperation(e);
				return;
			}
			r.push(e);
		},
		registerEffect(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEffect(e);
				return;
			}
			i.push(e);
		},
		registerValueReader(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addValueReader(e);
				return;
			}
			s.push(e);
		},
		registerCollectionSink(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addCollectionSink(e);
				return;
			}
			c.push(e);
		},
		registerStrings(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addStrings(e);
				return;
			}
			l.push(e);
		},
		registerEngine(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEngine(e);
				return;
			}
			u.push(e);
		},
		setLogLevel(e) {
			a(e);
		},
		getLogLevel() {
			return o();
		}
	};
	return window.NEStandardUI = d, d;
}
function oe(e, t) {
	for (let n of t.__pendingEvents ?? []) e.addEvent(n.name, n.registration);
	for (let n of t.__pendingConverters ?? []) e.addConverter(n);
	for (let n of t.__pendingDomOperations ?? []) e.addDomOperation(n);
	for (let n of t.__pendingEffects ?? []) e.addEffect(n);
	for (let n of t.__pendingValueReaders ?? []) e.addValueReader(n);
	for (let n of t.__pendingCollectionSinks ?? []) e.addCollectionSink(n);
	for (let n of t.__pendingStrings ?? []) e.addStrings(n);
	for (let n of t.__pendingEngines ?? []) e.addEngine(n);
	t.__pendingEvents = [], t.__pendingConverters = [], t.__pendingDomOperations = [], t.__pendingEffects = [], t.__pendingValueReaders = [], t.__pendingCollectionSinks = [], t.__pendingStrings = [], t.__pendingEngines = [];
}
function se(e, t) {
	return typeof t == "function" ? {
		name: e,
		convert: (e) => t(e.value)
	} : {
		...t,
		name: e
	};
}
//#endregion
//#region src/addressing/dom-attributes.ts
var ce = "data-ui-id", le = "data-ui-context", ue = "data-ui-pc", m = "data-ui-key", de = "data-ui-unselectable", fe = "data-ui-undraggable", pe = "data-ui-unremovable", me = "data-ui-unrenamable", he = "data-ui-no-context-menu", ge = "data-ui-tabs-draggable", _e = "data-ui-tabs-menu", ve = "data-ui-context-menu", ye = "data-ui-name", be = "data-ui-bind-", xe = "data-ui-bind-value", Se = (e) => `data-ui-no-${e}`, Ce = "data-ui-event-boundary", we = "data-ui-image-caption", h = "data-ui-items-host", Te = "data-ui-collection-sink", Ee = "data-ui-items-query", De = "data-ui-empty-template", Oe = "data-ui-group-template", ke = "data-ui-empty-placeholder", Ae = "data-ui-group-header", je = "data-ui-group", Me = "data-ui-value-kind", Ne = "data-ui-host-mode", Pe = "data-ui-host-viewport", Fe = "data-ui-scroll-group", Ie = "data-ui-scroll-lines", Le = "data-ui-source-line", Re = "data-ui-window-spacer", ze = "data-ui-window-size", Be = "data-ui-window-offset", Ve = "data-ui-window-total", He = "data-ui-window-more-before", Ue = "data-ui-window-more-after", We = "data-ui-form-id", Ge = "data-ui-visibility", Ke = "data-ui-collapsed", qe = "data-ui-menu-group", Je = "data-ui-menu-select", Ye = "data-ui-menu-open", Xe = "data-ui-menu-search", Ze = "data-ui-menu-searching", Qe = "data-ui-menu-unmatched", $e = "data-ui-drawer-toggle", et = "data-ui-drawer-open", tt = "data-ui-region", nt = "data-ui-menu-item-kind", rt = `[${nt}="header"], [${nt}="separator"]`, it = `[${qe}] > .ui-menu-item`, at = `${it}, .ui-menu-item[${nt}="check"]`, ot = "data-ui-collapse-toggle", st = "data-ui-folding", ct = "data-ui-column-limits", lt = "data-ui-row-limits", ut = "data-ui-splitter-step", dt = "data-ui-table-column", ft = "data-ui-table-hide-below", pt = "data-ui-table-hidden", mt = "data-ui-table-last", ht = "data-ui-table-reordering", gt = "data-ui-table-dragging", _t = "data-ui-table-drop", vt = "data-ui-table-scrolled", yt = "data-ui-tree-parent", bt = "data-ui-tree-children", xt = "data-ui-tree-expanded", St = "data-ui-tree-title", Ct = "data-ui-tree-loading", wt = "data-ui-tree-drop-target", Tt = "data-ui-tree-boot", Et = "data-ui-tree-draggable", Dt = "data-ui-row-editing", Ot = "data-ui-image-source", kt = "data-ui-file-max-size", At = "data-ui-splitting", jt = "data-ui-pointer-focus", Mt = "data-ui-selection", Nt = "data-ui-selected", Pt = "data-ui-selected-key", g = "data-ui-selected-keys", Ft = "data-ui-bind-selected-key", It = "data-ui-tabs-selected", Lt = "data-ui-tab-order", Rt = "data-ui-tab-caption", zt = "data-ui-tab-pinned", Bt = [
	Ge,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Vt = "data-ui-submit-form-id", Ht = `[${ce}]`;
function Ut(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Wt(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Gt = 0;
function Kt(e, t) {
	return e.id.length === 0 && (Gt++, e.id = `${t}-${Gt}`), e.id;
}
//#endregion
//#region src/metadata/metadata-index.ts
var qt = {
	Navigate: "Navigate",
	Focus: "Focus",
	ScrollTo: "ScrollTo",
	Show: "Show",
	Hide: "Hide",
	Collapse: "Collapse",
	OpenDialog: "OpenDialog",
	CloseDialog: "CloseDialog",
	ShowNotification: "ShowNotification",
	DownloadFile: "DownloadFile",
	Scroll: "Scroll",
	SetTheme: "SetTheme",
	RenameTab: "RenameTab",
	RenameNode: "RenameNode",
	CopyToClipboard: "CopyToClipboard",
	DiscardForm: "DiscardForm"
}, Jt = class {
	propertyDefinitionsById = /* @__PURE__ */ new Map();
	bindingsById = /* @__PURE__ */ new Map();
	bindingsByComponentAndPropertyId = /* @__PURE__ */ new Map();
	bindingsByComponentAndPropertyName = /* @__PURE__ */ new Map();
	eventsByComponentAndName = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	itemsTemplatesByComponentId = /* @__PURE__ */ new Map();
	itemsFilterSortByComponentId = /* @__PURE__ */ new Map();
	itemValuesByAddress = /* @__PURE__ */ new Map();
	validationsByComponentId = /* @__PURE__ */ new Map();
	validationTargetsByComponentId = /* @__PURE__ */ new Map();
	exposedProperties = /* @__PURE__ */ new Map();
	metadata;
	constructor(e) {
		this.metadata = e;
		for (let t of e.propertyDefinitions) this.addPropertyDefinition(t);
		for (let t of e.bindings) this.addBinding(t);
		for (let t of e.events) this.addEvent(t);
		for (let t of e.items) this.addItemsTemplate(t);
		for (let t of e.itemsFilterSort) this.addItemsFilterSort(t);
		for (let t of e.itemValues ?? []) this.addItemValues(t);
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(v(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${v(t.componentId)}:${e.propertyName}`, t);
		}
		for (let t of e.validations) this.addValidation(t);
	}
	getPropertyDefinition(e) {
		return this.propertyDefinitionsById.get(e);
	}
	getBindingById(e) {
		return this.bindingsById.get(e);
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (v(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(gn(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(gn(e, hn(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(_n(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(y(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(y(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(vn(e, t))?.items ?? [];
	}
	getValidationsForComponent(e) {
		return this.validationsByComponentId.get(e) ?? [];
	}
	getExposedProperty(e, t) {
		return this.exposedProperties.get(`${e}:${t}`);
	}
	getValidationTarget(e) {
		return this.validationTargetsByComponentId.get(e);
	}
	addPropertyDefinition(e) {
		e.propertyId.trim().length !== 0 && this.propertyDefinitionsById.set(e.propertyId, e);
	}
	addBinding(e) {
		let t = v(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = v(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(gn(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(gn(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = y(e.eventName), n = v(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(_n(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = v(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = v(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = v(e.componentId);
		t > 0 && this.itemValuesByAddress.set(vn(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = v(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function _(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Yt(e) {
	return _(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Xt(e) {
	return e == null ? "OneWay" : _(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Zt(e) {
	return _(e, ["Property", "Event"]);
}
function Qt(e) {
	return e == null ? "SetProperty" : _(e, ["SetProperty", "Effect"]);
}
function $t(e) {
	return _(e, [
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
function en(e) {
	return _(e, ["Ascending", "Descending"]);
}
function tn(e) {
	return _(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function nn(e) {
	return _(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function rn(e) {
	return typeof e == "string" ? e : _(e, [
		"Text",
		"Attribute",
		"RemoveAttribute",
		"ToggleAttribute",
		"Class",
		"ToggleClass",
		"Style",
		"Data",
		"Property",
		"Markup"
	]);
}
function an(e) {
	return _(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function on(e) {
	return _(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function v(e) {
	return e ?? 0;
}
function sn(e) {
	return typeof e == "string" ? e : "";
}
function cn(e) {
	return _(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function ln(e) {
	return typeof e == "string" ? e.trim() : "";
}
function un(e) {
	return _(e, ["Auto", "Smooth"]);
}
function dn(e) {
	return _(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function fn(e) {
	return _(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function pn(e) {
	return _(e, ["Light", "Dark"]);
}
function mn(e) {
	return _(e, ["Horizontal", "Vertical"]);
}
function y(e) {
	return e?.trim().toLowerCase() ?? "";
}
function hn(e) {
	return e?.trim() ?? "";
}
function gn(e, t) {
	return `${e}:${hn(t)}`;
}
function _n(e, t) {
	return `${e}:${y(t)}`;
}
function vn(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var yn = class {
	dom;
	metadata;
	constructor(e, t) {
		this.dom = e, this.metadata = t;
	}
	getBindingById(e) {
		return this.metadata.getBindingById(e);
	}
	getPropertyName(e) {
		return this.metadata.getPropertyDefinition(e)?.propertyName;
	}
	hasRenderedComponent(e) {
		return this.dom.findAllComponents(v(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = v(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = v(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${be}${Wt(r.propertyName)}="${Ut(a)}"]` : null;
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
				property: r.propertyName
			}
		}));
	}
	resolvePropertyOn(e, t) {
		let n = v(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
		return n <= 0 || r === void 0 ? null : {
			componentId: n,
			propertyId: t.propertyId,
			propertyName: r.propertyName,
			dynamicParameters: [],
			component: e,
			definition: r,
			bindingId: 0,
			bindingSelector: null,
			address: {
				component: {
					id: n,
					dynamicParameters: []
				},
				property: r.propertyName
			}
		};
	}
	resolveOperationTargets(e, t) {
		return bn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Wt(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
function bn(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		for (let t of e.querySelectorAll(r)) if (t.closest(Ht) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/addressing/dynamic-parameters.ts
function xn(e) {
	return wn(e, ue);
}
function Sn(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Tn(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Cn(e, t) {
	let n = xn(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Sn(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function wn(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Tn(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function En(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Dn = class {
	root;
	componentsById = /* @__PURE__ */ new Map();
	staticComponentsById = /* @__PURE__ */ new Map();
	keyedComponentsById = /* @__PURE__ */ new Map();
	stale = !1;
	constructor(e) {
		this.root = e, this.rebuild();
	}
	invalidate() {
		this.stale = !0;
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear();
		let e = this.root.querySelectorAll(Ht), t = this.root.querySelector(`[${Ae}]`) !== null;
		for (let n of e) {
			let e = b(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && jn(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Kt(e, t);
	}
	findComponentParts(e, t, n) {
		return En(this.findAllComponents(e, t), n);
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.stale && this.rebuild(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		let n = this.keyedComponents(e).get(An(t)) ?? [];
		if (n.length > 0 && n.every((e) => Cn(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Cn(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = xn(n);
			if (e === 0) continue;
			let r = Sn(n, e);
			if (r.length !== e) continue;
			let i = An(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(Ht);
			if (e === null || !Mn(this.root, e)) return null;
			let r = b(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Sn(e, xn(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function b(e) {
	return wn(e, ce);
}
function On(e) {
	let t = e.closest(Ht), n = t === null ? 0 : b(t);
	return n > 0 ? n : null;
}
function kn(e) {
	let t = e.closest(Ht), n = t === null ? 0 : b(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Sn(t, xn(t))
	};
}
function An(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function jn(e) {
	return xn(e) === 0;
}
function Mn(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/client-strings.ts
var Nn = "script[type='application/json'][data-ui-strings]", x = new class {
	words = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	hasStringsBlock = !1;
	load(e = document) {
		let t = e.querySelector(Nn)?.textContent?.trim() ?? "";
		if (t.length !== 0) {
			this.hasStringsBlock = !0;
			try {
				this.register(JSON.parse(t));
			} catch (e) {
				s("client strings could not be read.", e);
			}
		}
	}
	register(e) {
		for (let [t, n] of Object.entries(e)) typeof n == "string" && this.words.set(t, n);
	}
	text(e) {
		let t = this.words.get(e);
		return t === void 0 ? (this.missing.has(e) || (this.missing.add(e), (this.hasStringsBlock ? s : l)("client string has no text; the key is shown instead.", { key: e })), e) : t;
	}
	format(e, t) {
		return this.text(e).replace(/\{([a-z]+)\}/g, (e, n) => {
			let r = t[n];
			return r === void 0 ? e : String(r);
		});
	}
}();
//#endregion
//#region src/extensions/value-readers.ts
function Pn(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function S(e) {
	return e == null;
}
var Fn = "data-ui-trim-input", In = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Vn) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Me);
		if (t === null) return Ln(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Fn) ? t.trim() : t;
	}
	readHeld(e) {
		let t = zn(e);
		return t === null ? null : this.read(t);
	}
};
function Ln(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Rn = "input, textarea, select";
function zn(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Rn) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Rn}`);
}
function Bn(e) {
	return e === null ? null : Number(e);
}
var Vn = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(It)
	},
	{
		kind: "tab-order",
		read: (e) => Bn(e.getAttribute(Lt))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Rt)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(zt)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(St)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Pt)
	},
	{
		kind: "selected-keys",
		read: (e) => Hn(e, g)
	},
	{
		kind: "items-query",
		read: (e) => Hn(e, Ee)
	},
	{
		kind: "checked-radio",
		read: (e) => e.querySelector("input[type=\"radio\"]:checked")?.value ?? null
	},
	{
		kind: "pressed",
		read: (e) => e.getAttribute("aria-pressed") === "true"
	}
];
function Hn(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Un(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/draft-events.ts
var Wn = "ui-draft-dropped";
function Gn(e) {
	e.dispatchEvent(new Event(Wn, { bubbles: !0 }));
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Kn = "data-ui-clear", qn = "data-ui-form-id", Jn = ["change", "toggle"], Yn = [
	...Jn,
	"expand",
	"collapse",
	"open",
	"close"
];
function Xn(e) {
	let t = Xt(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Zn(e) {
	return Xt(e) === "OnSubmit";
}
var Qn = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Jn) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Wn, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute(qn) || this.resolveWritableBinding(e.target)?.buffered === !0 && this.bufferValue(e.target);
	}
	releaseDropped(e) {
		if (e.target instanceof Element) for (let t of [...this.bufferedElements]) (e.target.contains(t) || !t.isConnected) && this.bufferedElements.delete(t);
	}
	releaseForm(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (!n.isConnected) {
				this.bufferedElements.delete(n);
				continue;
			}
			n.getAttribute(qn) === e && (this.bufferedElements.delete(n), t.push(n));
		}
		return t;
	}
	hold(e) {
		this.pruneDetached(), this.bufferedElements.add(e);
	}
	release(e) {
		return this.bufferedElements.delete(e);
	}
	isHeld(e) {
		return this.bufferedElements.has(e) || this.unanswered.has(e);
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Kn}]`);
		if (t === null) return;
		let n = t.closest(Ht), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || $n(r) || (Un(r), r.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.resolveWritableBinding(e.target);
		if (t !== null) {
			if (t.buffered) {
				this.bufferValue(e.target);
				return;
			}
			this.bufferedElements.delete(e.target), await this.syncValueAsync(e.target, t.bindingId);
		}
	}
	bufferValue(e) {
		if (e.getAttribute(qn) === null) {
			s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName });
			return;
		}
		this.bufferedElements.has(e) || this.pruneDetached(), this.bufferedElements.add(e);
	}
	pruneDetached() {
		for (let e of this.bufferedElements) e.isConnected || this.bufferedElements.delete(e);
	}
	async submitFormAsync(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (n.getAttribute(qn) !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = this.resolveWritableBinding(n);
			r !== null && t.push(this.syncValueAsync(n, r.bindingId));
		}
		await Promise.all(t);
	}
	resolveWritableBinding(e) {
		let t = e.getAttribute(xe);
		if (t !== null) {
			let e = this.options.metadata.getBindingById(Number(t));
			return {
				bindingId: t,
				buffered: e !== void 0 && Zn(e.mode)
			};
		}
		for (let t of Array.from(e.attributes)) {
			if (!t.name.startsWith("data-ui-bind-")) continue;
			let e = this.options.metadata.getBindingById(Number(t.value));
			if (e !== void 0 && Xn(e.mode)) return {
				bindingId: t.value,
				buffered: Zn(e.mode)
			};
		}
		return null;
	}
	async syncValueAsync(e, t) {
		let n = this.options.metadata.getBindingById(Number(t)), r = n === void 0 ? void 0 : this.options.metadata.getPropertyDefinition(n.propertyId)?.propertyName;
		if (n === void 0 || r === void 0) {
			s("value binding engine: binding metadata not found.", { bindingIdText: t });
			return;
		}
		let i = this.options.dom.resolveNearestComponent(e, () => !0);
		if (i === null) return;
		let a = this.dispatchAndApplyAsync(e, r, i, n);
		this.pendingSyncByComponent.set(i.element, a);
		try {
			await a;
		} finally {
			this.pendingSyncByComponent.get(i.element) === a && this.pendingSyncByComponent.delete(i.element);
		}
	}
	async dispatchAndApplyAsync(e, t, n, r) {
		let i = this.options.valueReaders.readBound(e), a = !1, o = () => {
			a || (a = !0, this.releaseUnanswered(e));
		};
		this.holdUnanswered(e);
		try {
			await this.options.dispatcher.dispatchAsync({
				componentId: n.componentId,
				propertyName: t,
				dynamicParameters: n.dynamicParameters,
				value: i
			}, () => {
				o(), this.options.recordSent(r, n.dynamicParameters, i);
			});
		} finally {
			o();
		}
	}
	holdUnanswered(e) {
		this.unanswered.set(e, (this.unanswered.get(e) ?? 0) + 1);
	}
	releaseUnanswered(e) {
		let t = this.unanswered.get(e) ?? 0;
		t <= 1 ? this.unanswered.delete(e) : this.unanswered.set(e, t - 1);
	}
	async syncPropertyAsync(e, t, n, r) {
		let i = this.options.metadata.getBindingByComponentAndPropertyId(e, t);
		if (i === void 0 || !Xn(i.mode) || Zn(i.mode)) return;
		let a = this.options.metadata.getPropertyDefinition(t)?.propertyName;
		a !== void 0 && await this.options.dispatcher.dispatchAsync({
			componentId: e,
			propertyName: a,
			dynamicParameters: n,
			value: r
		}, () => this.options.recordSent({
			componentId: e,
			propertyId: t
		}, n, r));
	}
	async whenSettled(e) {
		await this.pendingSyncByComponent.get(e);
	}
	whenSent() {
		return this.options.dispatcher.whenSent();
	}
};
function $n(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-registry.ts
var er = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = y(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = y(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(y(e));
	}
	markAttached(e) {
		let t = y(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, tr = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: v(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, nr = {
	dispatched: !1,
	success: !1
}, rr = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, ir = class {
	options;
	root;
	registry;
	requestFactory = new tr();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new er(e.eventCatalog), this.addEvent("click");
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
		let r = this.options.dom.resolveNearestComponent(t.target, (t, n) => this.shouldHandleComponent(e, t, n));
		if (r === null || or(t, r.element)) return;
		let i = t.target.closest(`[${Ce}]`);
		if (i !== null && i !== r.element && r.element.contains(i)) return;
		let a = {
			domEvent: t,
			metadata: this.options.metadata.getEvent(r.componentId, e),
			component: r.element,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters
		}, o = n.dynamicParameters === void 0 ? a : {
			...a,
			dynamicParameters: n.dynamicParameters(a) ?? a.dynamicParameters
		};
		try {
			let t = await this.runAsync(e, n, r.element, o);
			n.completed?.({
				...o,
				...t
			});
		} catch (e) {
			let t = e instanceof rr, r = t ? e.reason : e;
			throw n.completed?.({
				...o,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		this.applyDomPolicy(t, r);
		let i = this.requestFactory.create(t, r);
		if (i === null) return this.options.interactionEngine.applyEvent({
			name: e,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		}), {
			dispatched: !1,
			success: !0
		};
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), nr;
		let a = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? sr(r) : null);
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a) === !1) return r.domEvent.preventDefault(), nr;
			await this.options.valueBinding?.submitFormAsync(a);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return nr;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let o = await this.options.dispatcher.dispatchAsync(i).catch((t) => {
			throw this.applyAfterEvent(e, r), new rr(t);
		});
		return this.options.effects.applyAll(o.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: o.command?.success !== !1,
			error: o.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Yn.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
	}
	applyAfterEvent(e, t) {
		this.options.interactionEngine.applyEvent({
			name: `after-${e}`,
			componentId: t.componentId,
			dynamicParameters: t.dynamicParameters,
			domEvent: t.domEvent
		});
	}
	shouldHandleComponent(e, t, n) {
		return n.hasAttribute(Se(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		ar(e.preventDefault, t) && t.domEvent.preventDefault(), ar(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function ar(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function or(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function sr(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var cr = class {
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
				componentId: v(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(v(e.reference.componentId), e.reference.propertyId);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (Qt(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!ur(i)) return;
		let a = this.evaluator.evaluate(e, r);
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(i, t, a, n);
		} finally {
			this.applyDepth--;
		}
		n && this.options.writeBack?.(i, t, a);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: lr(r, t),
			dom: this.options.dom
		});
	}
};
function lr(e, t) {
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
function ur(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var dr = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return fr(t, e.operator, e.value);
	}
};
function fr(e, t, n) {
	switch ($t(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return pr(e, n, (e) => e > 0);
		case "GreaterOrEqual": return pr(e, n, (e) => e >= 0);
		case "Less": return pr(e, n, (e) => e < 0);
		case "LessOrEqual": return pr(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return mr(e, n);
		default: return !1;
	}
}
function pr(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function mr(e, t) {
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
var hr = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(y(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) vr(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(y(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(yr(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(br(e, t)) ?? [];
	}
	addInteraction(e) {
		if (gr(e)) {
			let t = v(e.sourceEvent?.componentId), n = y(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(yr(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(yr(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (_r(e)) {
			let t = v(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(br(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(br(t, n), r)), r.push(e);
			}
		}
	}
};
function gr(e) {
	return Zt(e.sourceKind) === "Event";
}
function _r(e) {
	return Zt(e.sourceKind) === "Property";
}
function vr(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function yr(e, t) {
	return `${e}:${y(t)}`;
}
function br(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/interactions/anchored-popup.ts
var xr = /* @__PURE__ */ new Set([
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
]);
function Sr(e) {
	return xr.has(e);
}
var Cr = 4, wr = 12, Tr = /* @__PURE__ */ new Map(), Er = !1, Dr = null;
function Or(e, t, n) {
	Tr.set(t, {
		anchor: e,
		options: n
	}), Pr(), Dr?.observe(t), Ar(t), Ir(e, t, n);
}
var kr = "data-ui-popup-lifted";
function Ar(e) {
	e.hasAttribute(kr) || !jr(e) || (e.setAttribute("popover", "manual"), e.setAttribute(kr, ""), e.showPopover());
}
function jr(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function Mr(e) {
	e.hasAttribute(kr) && (e.matches(":popover-open") && e.hidePopover(), e.removeAttribute("popover"), e.removeAttribute(kr));
}
function Nr(e) {
	e != null && (Tr.delete(e), Dr?.unobserve(e), Mr(e));
}
function Pr() {
	Er || (Er = !0, document.addEventListener("scroll", Fr, !0), window.addEventListener("resize", Fr), Dr = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Tr.get(t.target);
			e !== void 0 && Ir(e.anchor, t.target, e.options);
		}
	}));
}
function Fr() {
	for (let [e, t] of Tr) {
		if (!e.isConnected) {
			Nr(e);
			continue;
		}
		Ir(t.anchor, e, t.options);
	}
}
function Ir(e, t, n) {
	if (!e.isConnected) return;
	n.minAnchorWidth === !0 && (t.style.minWidth = `${e.getBoundingClientRect().width}px`);
	let r = e.getBoundingClientRect(), i = (n.crossAnchor ?? e).getBoundingClientRect(), a = t.getBoundingClientRect(), o = zr(r, a, n), s = Gr(r, i, a, o, n.gap), c = Kr(r, i, a, o, n.gap);
	n.arrow === !0 && (Vr(o) ? c = Lr(c, i.left + i.width / 2, a.width) : s = Lr(s, i.top + i.height / 2, a.height)), s = Jr(s, a.height, window.innerHeight), c = Jr(c, a.width, window.innerWidth), t.style.top = `${s}px`, t.style.left = `${c}px`, t.dataset.uiPlacement !== o && (t.dataset.uiPlacement = o), Rr(t, i, a, o, s, c);
}
function Lr(e, t, n) {
	let r = t - e;
	return r < wr ? e - (wr - r) : r > n - wr ? e + (r - (n - wr)) : e;
}
function Rr(e, t, n, r, i, a) {
	let o = Vr(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(wr, Math.min(s, c - wr))}px`);
}
function zr(e, t, n) {
	let r = n.placement, i = Br(t, r) + n.gap, a = Hr(e, r), o = Ur(r);
	return a >= i || Hr(e, o) <= a ? r : o;
}
function Br(e, t) {
	return Vr(t) ? e.height : e.width;
}
function Vr(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Hr(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Ur(e) {
	return e.startsWith("top") ? `bottom${Wr(e)}` : e.startsWith("bottom") ? `top${Wr(e)}` : e.startsWith("left") ? `right${Wr(e)}` : `left${Wr(e)}`;
}
function Wr(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Gr(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : qr(t.top, t.height, n.height, r);
}
function Kr(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : qr(t.left, t.width, n.width, r);
}
function qr(e, t, n, r) {
	let i = Wr(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Jr(e, t, n) {
	return Math.max(Cr, Math.min(e, n - t - Cr));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Yr = 32;
function C(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Xr(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
		a !== null && r(a);
	});
	return i.observe(e, {
		subtree: !0,
		childList: n.childList ?? !1,
		characterData: n.characterData ?? !1,
		attributes: n.attributeFilter !== void 0,
		...n.attributeFilter === void 0 ? {} : { attributeFilter: [...n.attributeFilter] }
	}), i;
}
function Xr(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t) {
		let t = i.target instanceof Element ? i.target : i.target.parentElement;
		if (t === null) continue;
		let a = t.closest(n);
		if (a !== null) {
			r.add(a);
			continue;
		}
		for (let e of t.querySelectorAll(n)) r.add(e);
		if (r.size > Yr) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Zr(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Qr = /* @__PURE__ */ new Set(), $r = /* @__PURE__ */ new Map(), ei = 0, ti = !1;
function ni() {
	ti || (ti = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || ii() && e.preventDefault();
	}, !0));
}
function ri() {
	for (let e of Qr) for (let t of e.openPopups()) if (t.isConnected) return !0;
	return !1;
}
function ii() {
	let e = [];
	for (let t of Qr) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...$r.keys()]) t.has(e) || $r.delete(e);
	for (let { popup: t } of e) $r.has(t) || $r.set(t, ++ei);
	let n = ai(e, (e) => $r.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function ai(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var oi = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Qr.add(this), ni();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = e.composedPath();
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : this.options.onPress === !0 && this.dismiss(e, "outside");
	}
	handleClick(e) {
		let t = e.composedPath();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	dismiss(e, t) {
		return this.options.canDismiss?.(e, t) !== !1 && (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, si = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function ci(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	return (t ?? e.querySelector(si) ?? e).focus({ preventScroll: !0 }), n;
}
function li(e, t) {
	e != null && t.contains(document.activeElement) && e.focus({ preventScroll: !0 });
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var ui = "ui-flyout", di = "ui-flyout--open", fi = "ui-flyout__anchor", pi = "ui-flyout__content", mi = `.${ui}.${di}`, hi = "data-ui-flyout-no-backdrop-close", gi = "data-ui-flyout-no-escape-close", _i = 4, vi = `${ui}--`, yi = "bottom-start", bi = class {
	root;
	returnFocus = /* @__PURE__ */ new WeakMap();
	seenOpen = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${ui}`)) this.place(e);
		C(this.root, `.${ui}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new oi({
			openPopups: () => this.root.querySelectorAll(mi),
			canDismiss: (e, t) => !e.hasAttribute(t === "escape" ? gi : hi),
			close: (e) => this.setOpen(e, !1)
		});
	}
	place(e) {
		let t = e.querySelector(`:scope > .${pi}`), n = e.querySelector(`:scope > .${fi}`);
		if (t === null) return;
		let r = e.classList.contains(di);
		if (this.describeAnchor(n, t, r), !r) {
			Nr(t), this.seenOpen.has(e) && li(this.returnFocus.get(e), e), this.seenOpen.delete(e), this.returnFocus.delete(e);
			return;
		}
		if (Or(xi(n) ?? e, t, {
			placement: Si(e),
			gap: _i
		}), this.seenOpen.has(e)) return;
		this.seenOpen.add(e);
		let i = ci(t);
		i !== null && this.returnFocus.set(e, i);
	}
	describeAnchor(e, t, n) {
		if (e === null) return;
		let r = e.querySelector(si) ?? e;
		r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("aria-controls", Kt(t, "ui-flyout-content"));
	}
	handleFocusOut(e) {
		if (!(e instanceof FocusEvent)) return;
		let t = e.target instanceof Element ? e.target.closest(mi) : null;
		if (t === null || t.hasAttribute(hi)) return;
		let n = e.relatedTarget;
		n === null || n instanceof Node && t.contains(n) || this.setOpen(t, !1);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fi}`)?.closest(`.${ui}`) ?? null;
		t !== null && this.setOpen(t, !t.classList.contains(di));
	}
	setOpen(e, t) {
		e.classList.contains(di) !== t && (e.classList.toggle(di, t), this.place(e), e.dispatchEvent(new Event("toggle", { bubbles: !0 })), e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 })));
	}
};
function xi(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Si(e) {
	for (let t of e.classList) {
		if (!t.startsWith(vi)) continue;
		let e = t.slice(vi.length);
		if (Sr(e)) return e;
	}
	return yi;
}
//#endregion
//#region src/interactions/file-drop.ts
var Ci = 120, wi = "refused";
function Ti(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Ei(e, t, n), !0);
	e.root.addEventListener("dragend", () => ki(e, t.marked), !0), window.addEventListener("blur", () => ki(e, t.marked));
}
function Ei(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && ki(e, r);
		return;
	}
	let { host: a } = i;
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Oi(e, r, a) : t.leaving = window.setTimeout(() => ki(e, r), Ci);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Di(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && Oi(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? wi : "");
		return;
	}
	ki(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Ai(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function Di(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function Oi(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function ki(e, t) {
	for (let n of t) Oi(e, t, n);
}
function Ai(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var ji = "/_ne/files/upload";
function Mi(e, t) {
	let n = Number(e.getAttribute(kt));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function Ni(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", ji), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && t(Math.round(e.loaded / e.total * 100));
		}), c.addEventListener("load", () => {
			if (c.status < 200 || c.status >= 300) {
				r(/* @__PURE__ */ Error(`Upload failed with status ${c.status}.`));
				return;
			}
			let e = c.response?.selectionId;
			if (e === void 0 || e.length === 0) {
				r(/* @__PURE__ */ Error("Upload response carried no selection id."));
				return;
			}
			d(`uploaded ${s} file(s), ${o} bytes,`, a), n({ selectionId: e });
		}), c.addEventListener("error", () => r(/* @__PURE__ */ Error("Upload failed."))), c.addEventListener("abort", () => r(/* @__PURE__ */ Error("Upload was aborted."))), c.send(i);
	});
}
var Pi = () => {}, Fi = { uploadAsync: (e, t) => Ni(e, t ?? Pi) };
function Ii(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Li = "ui-file-input", Ri = "ui-file-input__row", zi = "ui-file-input__native", Bi = "ui-file-input__field", Vi = "ui-file-input__selection", Hi = "data-ui-file-pick", Ui = "data-ui-file-dragging", Wi = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ti({
			root: this.root,
			draggingAttribute: Ui,
			resolveTarget: (e) => {
				let t = e.closest(`.${Ri}`)?.closest(`.${Li}`) ?? null, n = t?.querySelector(`.${zi}`) ?? null;
				return t === null || n === null || n.disabled || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: n.getAttribute("accept") ?? "",
					multiple: n.multiple
				};
			},
			onFiles: (e, t) => void this.takeFilesAsync(e, t)
		});
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Hi}], .${Ri}`);
		if (t === null || t.hasAttribute("disabled") || !t.hasAttribute(Hi) && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Li}`)?.querySelector(`.${zi}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(zi)) return;
		let t = e.target.closest(`.${Li}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Bi}`);
		if (n === null) return;
		if (t.length === 0) {
			n.value = "", this.publishSelection(e, "");
			return;
		}
		let r = Mi(e, t);
		if (r.length === 0) {
			n.value = x.text("ui.file.oversized");
			return;
		}
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Ni(r, (t) => {
				this.picks.get(e) === i && (n.value = x.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			n.value = Gi(r), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			n.value = x.text("ui.file.failed"), this.publishSelection(e, "");
		}
	}
	publishSelection(e, t) {
		Ii(e.querySelector(`.${Vi}`), t);
	}
};
function Gi(e) {
	return e.length === 1 ? e[0].name : x.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Ki = `:scope > [${ke}], :scope > [${Ae}], :scope > [${Re}]`, qi = "ui-hidden";
function w(e) {
	let t = new Set(e.querySelectorAll(Ki));
	return [...e.children].filter((e) => !t.has(e));
}
function Ji(e) {
	return e === null ? [] : [e];
}
function Yi(e) {
	return e.querySelector(`:scope > [${ke}]`);
}
function Xi(e, t, n, r, i) {
	i ??= w(e).some((e) => !e.classList.contains(qi));
	let a = Yi(e);
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
	c.setAttribute(ke, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/interactions/roving-focus.ts
function Zi(e) {
	let t = ta(e.key), n = na(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(ea);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Qi(e, t) {
	return ta(e) !== null || na(e, t) !== 0;
}
var $i = {
	target: Zi,
	applyTabIndex: T
};
function T(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function ea(e) {
	return e.getClientRects().length !== 0 && !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function ta(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function na(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/row-cursor.ts
var ra = "data-ui-row-focus";
function ia(e) {
	return e.matches(".ui-disabled, [inert]") || e.querySelector(":scope > [data-ui-id][inert], :scope > :not([data-ui-id]) > [data-ui-id][inert]") !== null;
}
function aa(e) {
	return e.filter((e) => e.getClientRects().length > 0 && !ia(e));
}
function oa(e) {
	return e.find((e) => e.hasAttribute(ra)) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !ia(e)) ?? aa(e)[0] ?? null;
}
function sa(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(ra);
	n.setAttribute(ra, ""), e.setAttribute("aria-activedescendant", Kt(n, "ui-row")), n.scrollIntoView({ block: "nearest" });
}
function ca(e, t, n, r) {
	return Qi(e, r) ? Zi({
		key: e,
		items: aa(t),
		current: n,
		axis: r,
		loop: !1
	}) : null;
}
function la(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function ua(e, t, n) {
	let r = n.hasAttribute(ra), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = aa(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && sa(e, o, s);
	};
}
//#endregion
//#region src/interactions/selected-key.ts
function da(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var fa = "data-ui-bind-selected-keys", pa = ".ui-items-view, .ui-table, .ui-tree", ma = ".ui-items-view__item, .ui-table__row, .ui-tree__row", ha = {
	shift: !1,
	ctrl: !1
}, ga = /* @__PURE__ */ new WeakMap();
function _a(e, t) {
	if (t === null || ga.has(e)) return;
	let n = Oa(t);
	n.length > 0 && ga.set(e, n);
}
function va(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ya(e) {
	switch (e.getAttribute(Mt)) {
		case "one": {
			let t = e.getAttribute(Pt);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Ea(Da(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function ba(e, t) {
	let n = ya(e), r = e.getAttribute(Mt), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(Oa(e));
		e.toggleAttribute(Nt, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function xa(e) {
	return e.filter((e) => e.hasAttribute(Nt));
}
function Sa(e, t, n, r) {
	let i = Oa(n);
	if (i.length === 0 || n.hasAttribute("data-ui-unselectable")) return !1;
	switch (e.getAttribute(Mt)) {
		case "one": return da(e, i, {
			attribute: Pt,
			bindingAttribute: Ft,
			apply: (e) => ba(e, t)
		}), !0;
		case "many": return Ca(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Ca(e, t, n, r, i) {
	let a = Da(e);
	if (a === null) return;
	let o = Ea(a), s;
	if (i.shift) {
		let r = Ta(t, t.find((t) => Oa(t) === ga.get(e)) ?? n, n).map(Oa);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], ga.set(e, r)) : (s = [r], ga.set(e, r));
	wa(e, t, s);
}
function wa(e, t, n) {
	let r = Da(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(g, i), ba(e, t), r.hasAttribute(fa) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ta(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => e.getClientRects().length > 0 && !ia(e) && !e.hasAttribute("data-ui-unselectable") && Oa(e).length > 0);
}
function Ea(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Da(e) {
	for (let t of e.querySelectorAll(`[${h}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function Oa(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var ka = {
	isSelected: (e) => e.hasAttribute(Nt),
	toggle: Aa,
	setSelected: ja,
	setSelectedKeys: Ma
};
function Aa(e) {
	let t = e.closest(pa);
	t !== null && e instanceof HTMLElement && Sa(t, Na(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function ja(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(Oa(e));
	Ma(e, r, n);
}
function Ma(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && r.add(e);
	let i = [...ya(e)].filter((e) => !r.has(e));
	wa(e, Na(e), n ? [...i, ...r] : i);
}
function Na(e) {
	return [...e.querySelectorAll(ma)].filter((t) => t.closest(pa) === e);
}
//#endregion
//#region src/interactions/image-input-engine.ts
var Pa = "ui-image-input", Fa = "ui-image-input--multiple", Ia = "ui-image-input__surface", La = "ui-image-input__native", Ra = "ui-image-input__picture", za = "ui-image-input__text", Ba = "ui-image-input__selection", Va = "ui-image-input__selections", Ha = "ui-image-input__tiles", Ua = "ui-image-input__tile", Wa = "ui-image-input__remove", Ga = "data-ui-file-pick", Ka = "data-ui-image-preview", qa = "data-ui-image-dragging", Ja = "ui-loading", Ya = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Pa}`)), C(this.root, `.${Pa}`, {
			childList: !0,
			attributeFilter: [
				Ot,
				we,
				g
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Wn, (e) => this.handleDraftDropped(e)), Ti({
			root: this.root,
			draggingAttribute: qa,
			resolveTarget: (e) => {
				let t = e.closest(`.${Ia}`)?.closest(`.${Pa}`) ?? null;
				return t === null || t.hasAttribute("data-ui-image-readonly") || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: t.querySelector(`.${La}`)?.getAttribute("accept") ?? "",
					multiple: Xa(t)
				};
			},
			onFiles: (e, t) => void (Xa(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Xa(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Ra}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || Qa(e, e.getAttribute("data-ui-image-caption") ?? $a(n)));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(g);
		if (this.seenKeys.get(e) === n || (this.seenKeys.set(e, n), t === void 0 || n === null)) return;
		let r = this.published.get(e) ?? [], i = r.indexOf(n);
		if (i >= 0) {
			r.splice(0, i + 1);
			return;
		}
		let a;
		try {
			a = JSON.parse(n);
		} catch {
			return;
		}
		if (!Array.isArray(a)) return;
		let o = new Set(a.filter((e) => typeof e == "string"));
		for (let n of [...t]) n.selectionId !== null && !o.has(n.selectionId) && this.dropTile(e, n);
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Ga}]`), n = t?.closest(`.${Pa}`) ?? null;
		t === null || n === null || t.hasAttribute("disabled") || n.hasAttribute("data-ui-image-readonly") || n.querySelector(`.${La}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Wa}`), n = t?.closest(`.${Pa}`) ?? null;
		if (t === null || n === null || n.hasAttribute("data-ui-image-readonly") || n.matches(".ui-disabled")) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(La)) return;
		let t = e.target.closest(`.${Pa}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Xa(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Pa}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Ii(t.querySelector(`.${Ba}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Ia}`), r = e.querySelector(`.${Ra}`), i = e.querySelector(`.${Ba}`);
		if (n === null || r === null || Mi(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Ka, ""), r.setAttribute("src", a), Qa(e, t.name), n.classList.add(Ja);
		try {
			let n = await Ni([t], () => void 0);
			this.previews.get(e) === a && Ii(i, n.selectionId);
		} catch (t) {
			Qa(e, x.text("ui.file.failed")), Ii(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(Ja);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Ha}`), r = Mi(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Za(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Ni([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Ja), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove();
	}
	publishShelf(e) {
		let t = e.querySelector(`.${Va}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(g, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Ka), t || Qa(e, ""));
	}
};
function Xa(e) {
	return e.classList.contains(Fa);
}
function Za(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${Ua} ${Ja}`, n.src = i, n.alt = e.name, r.type = "button", r.className = Wa, r.setAttribute("aria-label", x.text("ui.image.remove")), r.title = e.name, t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function Qa(e, t) {
	let n = e.querySelector(`.${za}`);
	n !== null && n.textContent !== t && (n.textContent = t);
}
function $a(e) {
	if (e.length === 0 || e.startsWith("data:") || e.startsWith("blob:")) return "";
	let t = e.split(/[?#]/, 1)[0] ?? "", n = t.slice(t.lastIndexOf("/") + 1);
	if (!n.includes(".")) return "";
	try {
		return decodeURIComponent(n);
	} catch {
		return n;
	}
}
//#endregion
//#region src/interactions/caret-fields.ts
var eo = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function to(e) {
	return e instanceof HTMLInputElement && eo.has(e.type);
}
function no(e) {
	return to(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/own-control.ts
var ro = "[role='listbox'], [role='menu'], [role='dialog']", io = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], .ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .ui-select__trigger, .ui-field-box, ${ro}`;
function ao(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(io);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/key-value-action-engine.ts
var oo = "ui-key-value-action__row", so = "ui-key-value-action__value", co = "ui-key-value-action__value-input", lo = "ui-key-value-action__edit-action", uo = "ui-text__title", fo = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${oo}`)), C(this.root, `.${oo}`, {
			childList: !0,
			attributeFilter: [Dt]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${co} [${xe}]`)) {
			if (no(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Gn(e);
	}
	open(e) {
		let t = e.querySelector(`.${co} :is(input, textarea, select)`);
		if (t !== null) {
			if (no(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${so} .${uo}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), to(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = mo(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(lo)) return;
		let { cell: n, row: r } = t, i = e.target.closest(ro), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${lo} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click());
	}
};
function po(e) {
	return mo(e) !== null;
}
function mo(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${co}, .${lo}`), n = t?.closest(`.${oo}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var ho = `.ui-button[${Me}="pressed"]`, go = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ho);
		t === null || t.matches(":disabled, .ui-disabled") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, _o = class {
	root;
	valueOnFocus = "";
	changes = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.valueOnFocus = e.target.value);
		}), this.root.addEventListener("change", () => this.changes++, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement && e.key === "Escape") {
			e.preventDefault(), this.leave(t);
			return;
		}
		to(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(We);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Vt}="${CSS.escape(t)}"]`);
		n !== null && !n.hasAttribute("inert") && !n.disabled && n.click();
	}
	leave(e) {
		let t = this.changes;
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, vo = "data-ui-fallback-src", yo = `img[${vo}]`, bo = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(yo)) (xo(e) || e.complete && e.naturalWidth === 0) && So(e);
		C(this.root, yo, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && xo(t) && So(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && So(t);
	}
};
function xo(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function So(e) {
	let t = e.getAttribute(vo);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/own-descendants.ts
function Co(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var wo = "data-ui-radio-value", To = "ui-radio-group__input", Eo = "ui-radio-group__dot", Do = "ui-radio-group", Oo = "ui-radio-group__item", ko = "data-ui-radio-group-name", Ao = "data-ui-radio-bind-value-id", jo = "data-ui-radio-disabled", Mo = "ui-disabled", No = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Do}`)]);
		for (let e of this.root.querySelectorAll(`.${Do}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Do}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Po));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [
				wo,
				jo,
				"class"
			],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Do}`)) {
			let n = e.getAttribute(ko);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(ko), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(ko, a);
			for (let e of Co(r, `.${To}`, `.${Do}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Do}`)) n.has(e.getAttribute(ko) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(wo), n = e.hasAttribute(jo);
		for (let r of Co(e, `.${To}`, `.${Do}`)) {
			r.checked = r.value === t;
			let e = n || Fo(r);
			r.disabled !== e && (r.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Oo) ? [e] : [...e.querySelectorAll(`.${Oo}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${To}`) !== null) return;
		let t = e.closest(`.${Do}`), n = t?.getAttribute(ko);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = To, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Ao);
		a !== null && r.setAttribute("data-ui-bind-value", a);
		let o = document.createElement("span");
		o.className = Eo, e.prepend(r, o), this.sync(t);
	}
};
function Po(e) {
	return e.classList.contains(Do) ? [e] : [...e.querySelectorAll(`.${Do}`)];
}
function Fo(e) {
	let t = e.closest(`.${Oo}`);
	return t !== null && (t.classList.contains(Mo) || t.querySelector(`:scope > .${Mo}`) !== null);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Io(e) {
	if (e === null || e.length === 0) return [];
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return [];
	}
	if (!Array.isArray(t)) return [];
	let n = [];
	for (let e of t) typeof e == "string" && e.length > 0 && !n.includes(e) && n.push(e);
	return n;
}
function Lo(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Ro(e, t) {
	return t !== null && e.length >= t;
}
function zo(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Ro(e, n) ? null : [...e, t];
}
function Bo(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Vo = "data-ui-search-debounce", Ho = "data-ui-search-min-length", Uo = "data-ui-search-manual", Wo = "ui-search__input", Go = "ui-select", Ko = "ui-select__popup", qo = "ui-select__option", Jo = 300, Yo = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Wo) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		Xo(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Vo), i = r === null ? Jo : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Jo));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Uo)) return;
		let t = e.getAttribute(Ho), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Xo(e) {
	let t = e.closest(`.${Go}`), n = t?.querySelector(`.${Ko}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Ho), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${qo}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	$o(t, n, o && s === 0);
}
function Zo(e) {
	let t = e.querySelector(`.${Ko}`);
	t !== null && $o(e, t, [...t.querySelectorAll(`.${qo}`)].filter((e) => e.style.display !== "none").length === 0);
}
function Qo(e) {
	let t = e.querySelector(`.${Ko}`);
	if (t !== null) for (let e of t.querySelectorAll(`.${qo}`)) e.style.display = "";
}
function $o(e, t, n) {
	let r = t.querySelector(`:scope > [${ke}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${De}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(ke, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var es = "data-ui-select-value", ts = "data-ui-select-placement", E = "ui-select", ns = "ui-select--open", rs = "ui-select__trigger", is = "ui-select__trigger-content", as = "data-ui-select-content", os = "ui-select__placeholder", ss = "ui-input__affix-icon--prefix", cs = "ui-select__popup", ls = "ui-select__option", us = "ui-select__value-input", ds = "data-ui-select-clear", fs = "data-ui-select-trigger-mode", ps = "ui-search__input", ms = "ui-search-mode--replace", hs = "ui-text__title", gs = "ui-disabled", _s = "data-ui-active", vs = "ui-multi-select", ys = "ui-multi-select__chips", bs = "ui-multi-select__chip", xs = "ui-multi-select__chip-label", Ss = "ui-multi-select__chip-remove", Cs = "data-ui-select-chip", ws = "data-ui-select-max", Ts = 4, Es = [
	es,
	g,
	ws,
	"class",
	m
];
function Ds(e) {
	return e?.querySelector(`.${ps}`)?.readOnly === !0 || e?.querySelector(`.${rs}`)?.getAttribute("aria-readonly") === "true";
}
function Os(e) {
	return e.classList.contains(vs);
}
function ks(e) {
	return Co(e, `.${cs} .${ls}`, `.${E}`);
}
function As(e) {
	return e === null ? null : e.querySelector(`.${hs}`)?.textContent ?? e.textContent;
}
function js(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ce), t.removeAttribute(m), t.removeAttribute(ue), t.removeAttribute(le);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Ms = class {
	root;
	openSelect = null;
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${E}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Ls(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Es,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new oi({
			openPopups: () => this.openSelect === null || !this.openSelect.isConnected ? [] : [this.openSelect],
			close: () => this.close()
		});
	}
	sync(e) {
		if (Os(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(es);
		this.decorateOptions(e);
		let n = t === null ? null : ks(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = As(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${ps}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(ms) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && Qo(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${os}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of ks(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${us}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), Zo(e);
	}
	syncMultiple(e) {
		let t = Io(e.getAttribute(g)), n = new Set(t), r = Ro(t, Lo(e.getAttribute(ws)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = ks(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		Ps(e, o.map((e) => ({
			key: e,
			label: Ns(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${os}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${us}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(g, l), Zo(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${rs}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${is}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(as) === i) {
			r.removeAttribute(as);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = is;
			let e = n.querySelector(`:scope > .${ss}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		js(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of ks(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = Is(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ps)) return;
		let t = e.target.closest(`.${E}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handleFocusOut(e) {
		let t = this.openSelect;
		if (t === null || !(e instanceof FocusEvent) || !(e.target instanceof Node) || !t.contains(e.target)) return;
		let n = e.relatedTarget;
		n instanceof Node && !t.contains(n) && this.close();
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ps)) return;
		let t = e.target, n = t.closest(`.${E}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(ms)) return;
		let r = n.getAttribute(es);
		r !== null && (t.value = As(ks(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ss}`);
		if (t !== null) {
			let n = t.closest(`.${E}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Ds(n) || this.removeChosen(n, t.closest(`.${bs}`)?.getAttribute(Cs) ?? null));
			return;
		}
		let n = e.target.closest(`[${ds}]`);
		if (n !== null) {
			let t = n.closest(`.${E}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Ds(t) || this.clearValue(t));
			return;
		}
		let r = e.target.closest(`.${rs}`);
		if (r !== null) {
			let t = r.closest(`.${E}`);
			if (Ds(t) || r.getAttribute(fs) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ls}`);
		if (i === null) return;
		let a = i.closest(`.${E}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (this.openSelect !== null && !this.openSelect.isConnected && this.close(), (e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ls}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${E}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains(rs) ? e.target : null)?.closest(`.${E}`) ?? null;
		if (t === null || !Os(t) || Ds(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${ys} > .${bs}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Cs)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ps) || !t.contains(e.target) ? null : ks(t).find((e) => e.hasAttribute(_s) && !Is(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), t || (Qo(e), Zo(e)), e.classList.add(ns), this.positionPopup(e), this.describeTrigger(e, !0), this.openSelect = e, this.initializeFocus(e);
		}
	}
	describeTrigger(e, t) {
		let n = e.querySelector(`.${rs}`), r = e.querySelector(`.${cs}`);
		n !== null && (n.setAttribute("aria-expanded", t ? "true" : "false"), r !== null && n.setAttribute("aria-controls", Kt(r, "ui-select-popup")));
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = e.querySelector(`.${cs}`);
		t !== null && li(e.querySelector(`.${rs}`), t), e.classList.remove(ns), this.markActive(e, null), this.describeTrigger(e, !1), Nr(t), this.openSelect = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${rs}`), n = e.querySelector(`.${cs}`), r = e.getAttribute(ts), i = r !== null && Sr(r) ? r : "bottom-start";
		t !== null && n !== null && Or(t, n, {
			placement: i,
			gap: Ts,
			minAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = ks(e).filter((e) => !Is(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		if (T(t, n), this.markActive(e, n), e.querySelector(`.${rs}`)?.getAttribute(fs) === "input") {
			let t = e.querySelector(`.${ps}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		n.focus();
	}
	moveFocus(e, t) {
		let n = ks(e).filter((e) => !Is(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(_s)) ?? null, i = Zi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (T(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t) {
		for (let n of ks(e)) n === t ? n.setAttribute(_s, "") : n.hasAttribute(_s) && n.removeAttribute(_s);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || Is(t)) return;
		if (Os(e)) {
			let r = zo(Io(e.getAttribute(g)), n, Lo(e.getAttribute(ws)));
			this.markActive(e, t), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(es) === n) {
			this.close();
			return;
		}
		e.setAttribute(es, n), this.sync(e);
		let r = e.querySelector(`.${us}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Bo(Io(e.getAttribute(g)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${bs}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${rs}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(g) : e.setAttribute(g, JSON.stringify(t)), this.sync(e), this.openSelect === e && this.positionPopup(e), e.querySelector(`.${us}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Os(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(es)) return;
		e.removeAttribute(es), this.sync(e);
		let t = e.querySelector(`.${us}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Ns(e, t) {
	let n = As(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Ps(e, t) {
	let n = e.querySelector(`.${ys}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${bs}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Cs) === t[n].key && e.querySelector(`.${xs}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Fs(e.key, e.label)));
	}
}
function Fs(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = bs, n.setAttribute(Cs, e), r.className = xs, r.textContent = t, i.className = Ss, i.type = "button", i.tabIndex = -1, i.setAttribute("aria-label", x.format("ui.select.remove", { label: t })), n.append(r, i), n;
}
function Is(e) {
	return e.classList.contains(gs) || e.querySelector(`:scope > .${gs}`) !== null;
}
function Ls(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains(E) && t.add(n);
			for (let e of n.querySelectorAll(`.${E}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === es || e.attributeName === "data-ui-selected-keys" || e.attributeName === ws)) {
		e.target instanceof HTMLElement && e.target.classList.contains(E) && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${cs}`)?.closest(`.${E}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Rs = "data-ui-input-debounce", zs = `input[${Rs}], textarea[${Rs}]`;
function Bs(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(zs);
}
var Vs = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Bs(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Rs));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Bs(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Hs = "ui-slider__input", Us = "ui-slider__value", Ws = "ui-slider__bubble", Gs = "ui-slider__track", Ks = "ui-slider__thumb-anchor", qs = "ui-slider", Js = "ui-orientation--vertical", Ys = "--ui-slider-fraction", Xs = 6, Zs = "Value", Qs = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), $s = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Qs.has(e.propertyName)) return;
			let t = v(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Hs}`);
				t !== null && (this.writeReadings(t), e.propertyName === Zs && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t != null && e.value !== String(t) && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Hs) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = ec(e);
		t !== null && Or(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Xs
		});
	}
	releaseBubble(e) {
		Nr(ec(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Gs}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Us}, .${Ws}`) ?? []) n.textContent = e.value;
		e.closest(`.${Gs}`)?.style.setProperty(Ys, String(tc(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function ec(e) {
	if (!(e instanceof Element) || !e.classList.contains(Hs)) return null;
	let t = e.closest(`.${Gs}`), n = t?.querySelector(`.${Ws}`) ?? null, r = t?.querySelector(`.${Ks}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${qs}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Js)
	};
}
function tc(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var nc = {
	decimalSeparator: ".",
	groupSeparator: ",",
	groupSizes: [3],
	negativeSign: "-",
	negativePattern: 1,
	decimalDigits: 2,
	currencySymbol: "¤",
	currencyDecimalSeparator: ".",
	currencyGroupSeparator: ",",
	currencyGroupSizes: [3],
	currencyDecimalDigits: 2,
	currencyPositivePattern: 0,
	currencyNegativePattern: 0,
	percentSymbol: "%",
	percentDecimalSeparator: ".",
	percentGroupSeparator: ",",
	percentGroupSizes: [3],
	percentDecimalDigits: 2,
	percentPositivePattern: 0,
	percentNegativePattern: 0
}, rc = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], ic = [
	"$n",
	"n$",
	"$ n",
	"n $"
], ac = [
	"($n)",
	"-$n",
	"$-n",
	"$n-",
	"(n$)",
	"-n$",
	"n-$",
	"n$-",
	"-n $",
	"-$ n",
	"n $-",
	"$ n-",
	"$ -n",
	"n- $",
	"($ n)",
	"(n $)",
	"$- n"
], oc = [
	"n %",
	"n%",
	"%n",
	"% n"
], sc = [
	"-n %",
	"-n%",
	"-%n",
	"%-n",
	"%n-",
	"n-%",
	"n%-",
	"-% n",
	"n %-",
	"% n-",
	"% -n",
	"n- %"
];
function cc(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return nc;
	try {
		return {
			...nc,
			...JSON.parse(t)
		};
	} catch {
		return nc;
	}
}
function lc(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = uc(t);
	if (r === null) return dc(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = fc(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? hc(rc[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = fc(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(pc(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = fc(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return hc(i ? ac[n.currencyNegativePattern] ?? "-$n" : ic[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = fc(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return hc(i ? sc[n.percentNegativePattern] ?? "-n %" : oc[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return dc(e, n);
	}
}
function uc(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function dc(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function fc(e, t, n, r, i) {
	let a = String(pc(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? mc(o, n, r) : `${mc(o, n, r)}${i}${s}`;
}
function pc(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function mc(e, t, n) {
	if (t.length === 0 || n.length === 0) return e;
	let r = [], i = e.length, a = 0;
	for (; i > 0;) {
		let n = t[Math.min(a, t.length - 1)];
		if (n <= 0) {
			r.unshift(e.slice(0, i));
			break;
		}
		let o = Math.max(0, i - n);
		r.unshift(e.slice(o, i)), i = o, a++;
	}
	return r.join(n);
}
function hc(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var gc = {
	readCulture: cc,
	format: lc
}, _c = /^-?(\d+(\.\d*)?|\.\d+)$/;
function vc(e, t, n) {
	if (!_c.test(e)) return e;
	let r = n.thousands ? t : wc(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return lc(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return lc(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function yc(e, t, n) {
	return _c.test(e) ? (Cc(n) ? Tc(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function bc(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Cc(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!_c.test(d)) return null;
	let f = a ? Tc(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function xc(e, t, n, r, i) {
	let a = /* @__PURE__ */ new Set([
		"-",
		"−",
		n.negativeSign
	]), o = "", s = 0, c = !1;
	for (let l = 0; l < e.length; l++) {
		let u = e[l], d = !1;
		u >= "0" && u <= "9" || a.has(u) && i && o.length === 0 ? d = !0 : u === n.decimalSeparator && r && !c && (d = !0, c = !0), d && (o += a.has(u) ? "-" : u), l < t && d && s++;
	}
	return {
		value: o,
		cursor: s
	};
}
function Sc(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Cc(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function wc(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Tc(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Ec = "ui-number-input", Dc = "ui-number-input__field", Oc = "data-ui-number-no-decimals", kc = "data-ui-number-no-negative", Ac = "data-ui-number-no-thousands", jc = "data-ui-number-trim-zeros", Mc = "data-ui-number-step", Nc = "data-ui-number-min", Pc = "data-ui-number-max", Fc = "data-ui-number-step-direction", Ic = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Dc}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(En(e.components, `.${Dc}`));
		});
	}
	showAtRest(e) {
		for (let t of e) t !== document.activeElement && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	valueOf(e) {
		let t = this.values.get(e);
		return t !== void 0 && this.shown.get(e) === e.value ? t : e.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = cc(e), r = e === document.activeElement ? yc(t, n, Rc(e)) : vc(t, n, {
			format: Rc(e),
			thousands: !e.hasAttribute(Ac)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = Lc(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Oc), r = !t.hasAttribute(kc), i = t.selectionStart ?? t.value.length, a = xc(t.value, i, cc(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Lc(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Lc(e.target);
		if (t === null) return;
		let n = this.shown.get(t) === t.value ? null : bc(t.value, cc(t), Rc(t));
		if (n !== null && this.values.set(t, n), t.hasAttribute(jc)) {
			let e = this.values.get(t) ?? "", n = Sc(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Lc(e.target);
		if (t === null) return;
		let n = bc(t.value, cc(t), Rc(t));
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Lc(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = yc(t, cc(e), Rc(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Fc + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Dc}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(Mc) ?? "1"), i = t.getAttribute(Fc) === "down" ? -1 : 1, a = bc(n.value, cc(n), Rc(n)), o = (Number(this.shown.get(n) === n.value ? this.valueOf(n) : a ?? "0") || 0) + r * i, s = n.getAttribute(Nc), c = n.getAttribute(Pc);
		s !== null && (o = Math.max(o, Number(s))), c !== null && (o = Math.min(o, Number(c))), this.commit(n, zc(o)), this.show(n);
	}
};
function Lc(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Dc) ? e : null;
}
function Rc(e) {
	return e.closest(`.${Ec}`)?.getAttribute("data-ui-number-format") ?? null;
}
function zc(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var Bc = {
	monthNames: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	monthGenitiveNames: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	abbreviatedMonthNames: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	],
	dayNames: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	abbreviatedDayNames: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	amDesignator: "AM",
	pmDesignator: "PM"
};
function Vc(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Bc;
	try {
		return {
			...Bc,
			...JSON.parse(t)
		};
	} catch {
		return Bc;
	}
}
var Hc = [
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
function Uc(e, t, n) {
	if (t == null || t.trim().length === 0) return `${D(e.getFullYear(), 4)}-${D(e.getMonth() + 1, 2)}-${D(e.getDate(), 2)} ${D(e.getHours(), 2)}:${D(e.getMinutes(), 2)}:${D(e.getSeconds(), 2)}`;
	let r = "", i = Wc(t);
	for (let a = 0; a < t.length;) {
		let o = Gc(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Kc(o, e, n, i), a += o.length;
	}
	return r;
}
function Wc(e) {
	for (let t = 0; t < e.length;) {
		let n = Gc(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function Gc(e, t) {
	for (let n of Hc) if (e.startsWith(n, t)) return n;
	return null;
}
function Kc(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return D(t.getFullYear(), 4);
		case "yy": return D(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return D(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return D(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return D(i, 2);
		case "H": return String(i);
		case "hh": return D(a, 2);
		case "h": return String(a);
		case "mm": return D(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return D(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function D(e, t) {
	return String(e).padStart(t, "0");
}
var qc = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Jc(e) {
	let t = qc.exec(e.trim());
	if (t === null) return null;
	let n = {
		year: Number(t[1]),
		month: Number(t[2]),
		day: Number(t[3]),
		hour: Number(t[4] ?? "0"),
		minute: Number(t[5] ?? "0"),
		second: Number(t[6] ?? "0"),
		millisecond: t[7] === void 0 ? 0 : Math.trunc(Number(`0.${t[7]}`) * 1e3)
	}, r = new Date(Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second, n.millisecond));
	return r.getUTCFullYear() === n.year && r.getUTCMonth() === n.month - 1 && r.getUTCDate() === n.day && r.getUTCHours() === n.hour && r.getUTCMinutes() === n.minute && r.getUTCSeconds() === n.second ? n : null;
}
function Yc(e) {
	return new Date(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
var Xc = {
	readCulture: Vc,
	format: Uc,
	parse: Jc,
	toDate: Yc
}, O = "ui-temporal-input", Zc = "ui-temporal-input__value-input", Qc = "ui-temporal-input__end-value-input", $c = "data-ui-temporal-range", el = "data-ui-temporal-end", tl = "data-ui-temporal-mode", nl = "data-ui-temporal-format", rl = "data-ui-temporal-default-format", il = "data-ui-temporal-min", al = "data-ui-temporal-max", ol = "data-ui-temporal-step", sl = "data-ui-temporal-step-unit", cl = /* @__PURE__ */ new Set([
	nl,
	il,
	al
]), ll = 2e3;
function ul(e) {
	let t = e.getAttribute(tl);
	return t === "time" || t === "date-time" ? t : "date";
}
function dl(e) {
	let t = e.getAttribute(nl);
	return t === null || t.trim().length === 0 ? e.getAttribute(rl) ?? "" : t;
}
function fl(e) {
	let t = e.getAttribute(sl), n = Math.max(1, Math.trunc(Number(e.getAttribute(ol))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function pl(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function ml(e) {
	return {
		monthNames: hl(e, "data-ui-temporal-months"),
		monthGenitiveNames: hl(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: hl(e, "data-ui-temporal-months-short"),
		dayNames: hl(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: hl(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function hl(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function gl(e) {
	return e.hasAttribute($c);
}
function _l(e) {
	return e !== null && e.hasAttribute(el);
}
function vl(e) {
	return k(e, !1);
}
function k(e, t) {
	let n = yl(e, t);
	return n === null ? null : kl(n.value, ul(e));
}
function yl(e, t) {
	return e.querySelector(`.${t ? Qc : Zc}`);
}
function bl(e, t) {
	return kl(e.getAttribute(t) ?? "", ul(e));
}
function xl(e, t, n) {
	let r = yl(e, n);
	if (r === null) return;
	let i = t === null ? "" : Al(t, ul(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Sl(e) {
	if (!gl(e)) return;
	let t = k(e, !1), n = k(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (xl(e, n, !1), xl(e, t, !0));
}
function Cl(e) {
	wl(e, !1), gl(e) && wl(e, !0);
}
function wl(e, t) {
	let n = k(e, t);
	if (n === null) return;
	let r = El(e, n);
	r.getTime() !== n.getTime() && xl(e, r, t);
}
function Tl(e) {
	return Dl(e, El(e, /* @__PURE__ */ new Date()));
}
function El(e, t) {
	let n = bl(e, il), r = bl(e, al);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Dl(e, t) {
	let n = fl(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Ol = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function kl(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Ol.exec(n);
		return e === null ? null : new Date(ll, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Jc(n);
	return r === null ? null : Yc(r);
}
function Al(e, t) {
	let n = `${jl(e.getHours())}:${jl(e.getMinutes())}:${jl(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${jl(e.getMonth() + 1)}-${jl(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function jl(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Ml(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Pl(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Fl(e.start).getTime() ? {
		start: Pl(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Pl(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Nl(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Fl(e).getTime();
	return r > Fl(t).getTime() && r < Fl(n).getTime();
}
function Pl(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Fl(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
var Il = 100 / 3;
function Ll(e, t, n) {
	let r = n ? t : t * Il, i = (Math.sign(e) === Math.sign(r) ? e : 0) + r, a = Math.trunc(i / 100) || 0;
	return {
		steps: a,
		carried: i - a * 100
	};
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Rl = "ui-temporal-input__field", zl = "ui-temporal-input__popup", Bl = "ui-temporal-input--open", Vl = "ui-temporal-input__day", Hl = "ui-temporal-input__month", A = "ui-temporal-input__time-cell", Ul = "ui-temporal-input__time-column", Wl = 4, Gl = 140, Kl = "data-ui-temporal-toggle", ql = "data-ui-temporal-first-day", Jl = "data-ui-temporal-nav", Yl = "data-ui-temporal-day", Xl = "data-ui-temporal-unit", Zl = "data-ui-temporal-cell", Ql = "data-ui-temporal-centred", $l = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	openPicker = null;
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = En(e.components, `.${O}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), C(this.root, `.${O}`, { attributeFilter: [...cl] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), C(this.root, `.${O}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), new oi({
			openPopups: () => this.openPicker === null ? [] : [this.openPicker],
			close: () => this.close()
		});
	}
	applyDisplay(e) {
		for (let t of e) {
			Cl(t);
			for (let e of t.querySelectorAll(`.${Rl}`)) {
				if (e === document.activeElement && this.written.has(e)) continue;
				this.written.add(e);
				let n = yl(t, _l(e))?.value ?? "", r = kl(n, ul(t));
				if (r !== null) {
					e.value = Uc(r, dl(t), ml(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Rl)) return;
		let t = e.target.closest(`.${O}`), n = t === null ? null : yl(t, _l(e.target));
		t !== null && n !== null && (n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), Sl(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Rl)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && gl(t) && (this.getState(t).activeEnd = _l(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !gl(t) || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Yl}]`) : null;
		if (n !== null && !t.contains(n)) return;
		let r = this.getState(t), i = n === null ? null : kl(n.getAttribute(Yl) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, _u(t, r));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Rl)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Kl}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${O}`));
			return;
		}
		let n = e.target.closest(`.${zl}`)?.closest(`.${O}`);
		if (n == null) return;
		let r = e.target.closest(`[${Jl}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Jl) ?? "");
			return;
		}
		let i = e.target.closest(`[${Yl}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(Yl) ?? "");
			return;
		}
		let a = e.target.closest(`[${Zl}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Xl}]`)?.getAttribute(Xl);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Zl)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (t.startsWith("month:")) {
			n.view = new Date(n.view.getFullYear(), Number(t.slice(6)), 1), n.pane = "days", this.renderPopup(e);
			return;
		}
		switch (t) {
			case "previous":
				n.view = Nu(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Nu(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, Tl(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), gl(e) && this.commit(e, null, !0), n.activeEnd = "start", this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = kl(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (gl(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = vl(e) ?? Tl(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = Au(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = Tl(e), i = Ml({
			start: k(e, !1),
			end: k(e, !0)
		}, t.activeEnd, yu(n, r));
		t.focusedDay = i.end ?? i.start, t.view = Au(n), t.activeEnd = i.active, t.hoverDay = null, xl(e, i.end, !0), xl(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = gl(e) && this.getState(e).activeEnd === "end", i = new Date(k(e, r) ?? Tl(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		xl(e, t, n), Sl(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Rl)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${O}`), _l(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(A)) {
			Su(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Vl)) return;
		let n = kl(e.target.getAttribute(Yl) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Al(n, "date"));
			return;
		}
		let r = ku(n, e.key, Ou(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Au(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ul}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Gl)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ul}`), n = t?.getAttribute(Xl) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Ll(this.wheelTurns.get(n) ?? 0, e.deltaY, e.deltaMode === WheelEvent.DOM_DELTA_PIXEL);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${A}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${A}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${A}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(Zl)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Ql));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(Xl), i = du(e);
		if (!(r === null || i === null || i.classList.contains(`${A}--selected`))) {
			if (i.matches(":disabled")) {
				lu(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Zl)));
		}
	}
	toggle(e, t) {
		if (e === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let n = this.getState(e);
		n.activeEnd = gl(e) ? t ?? (k(e, !1) === null ? "start" : k(e, !0) === null ? "end" : n.activeEnd) : "start", n.hoverDay = null;
		let r = k(e, n.activeEnd === "end") ?? vl(e);
		n.pane = "days", n.view = Au(r ?? El(e, /* @__PURE__ */ new Date())), n.focusedDay = r, e.classList.add(Bl), e.querySelector(`[${Kl}]`)?.setAttribute("aria-expanded", "true"), e.querySelector(`.${zl}`)?.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = e.querySelector(`.${zl}`);
		for (let e of this.columnSettles.values()) window.clearTimeout(e);
		this.columnSettles.clear(), this.wheelTurns.clear(), t !== null && (li(vu(e, this.getState(e).activeEnd === "end"), t), t.removeEventListener("wheel", this.onColumnWheel)), e.classList.remove(Bl), e.querySelector(`[${Kl}]`)?.setAttribute("aria-expanded", "false"), Nr(t), this.openPicker = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${O}__row`), n = e.querySelector(`.${zl}`);
		t !== null && n !== null && Or(t, n, {
			placement: "bottom-end",
			gap: Wl
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: Au(vl(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: vl(e),
			activeEnd: "start",
			hoverDay: null
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${zl}`);
		if (n === null) return;
		let r = ul(e), i = this.getState(e), a = ml(e), o = gl(e), s = k(e, o && i.activeEnd === "end"), c = fu(n), l = pu(n), u = n.contains(document.activeElement);
		n.replaceChildren(), o && n.append(gu(i));
		let d = j("div", `${O}__panes`);
		d.append(eu(e, i, a, s)), r === "date-time" && d.append(ru(e, s)), n.append(d, hu(r));
		let f = l === null ? null : n.querySelector(`[${Jl}="${CSS.escape(l)}"]`);
		xu(n, i, s, t || u && c === null && f === null), _u(e, i), cu(n), lu(n), mu(n, c), f?.focus({ preventScroll: !0 }), this.positionPopup(e);
	}
};
function eu(e, t, n, r) {
	let i = j("div", `${O}__calendar`), a = j("div", `${O}__calendar-header`);
	a.append(bu("previous", "‹", x.text("ui.picker.previous")));
	let o = bu("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${O}__calendar-label`), a.append(o), a.append(bu("next", "›", x.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? tu(e, t, n, r) : nu(t, n)), i;
}
function tu(e, t, n, r) {
	let i = Ou(e), a = j("div", `${O}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = j("span", `${O}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = j("div", `${O}__days`), s = Fl(/* @__PURE__ */ new Date()), c = gl(e), l = c ? k(e, !1) : r, u = c ? k(e, !0) : null, d = ju(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = Mu(d, n), i = j("button", Vl);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(Yl, Al(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${Vl}--outside`), Pu(r, s) && i.classList.add(`${Vl}--today`), (l !== null && Pu(r, l) || u !== null && Pu(r, u)) && (i.classList.add(`${Vl}--selected`), i.setAttribute("aria-selected", "true")), Nl(r, l, u) && i.classList.add(`${Vl}--within`), Eu(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = j("div", `${O}__calendar-pane`);
	return f.append(a, o), f;
}
function nu(e, t) {
	let n = j("div", `${O}__months`);
	for (let r = 0; r < 12; r++) {
		let i = j("button", Hl);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Jl, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${Hl}--selected`), n.append(i);
	}
	return n;
}
function ru(e, t) {
	let n = fl(e), r = j("div", `${O}__time`), i = j("div", `${O}__time-columns`);
	for (let r of iu(n)) i.append(su(e, r, au(n, r), t));
	return r.append(i), r;
}
function iu(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function au(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function ou(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function su(e, t, n, r) {
	let i = j("div", Ul);
	i.setAttribute(Xl, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", x.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = ou(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = j("button", A);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(Zl, String(c)), c === o && (n.classList.add(`${A}--selected`), n.setAttribute("aria-selected", "true")), Du(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function cu(e) {
	let t = e.querySelector(`.${O}__calendar`), n = e.querySelector(`.${O}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function lu(e) {
	for (let t of e.querySelectorAll(`.${Ul}`)) {
		let e = t.querySelector(`.${A}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, uu(t, e), t.setAttribute(Ql, String(t.scrollTop));
	}
}
function uu(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function du(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${A}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function fu(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(A) ? null : t.closest(`.${Ul}`)?.getAttribute(Xl) ?? null;
}
function pu(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Jl) : null;
}
function mu(e, t) {
	t !== null && e.querySelector(`.${Ul}[${Xl}="${t}"]`)?.querySelector(`.${A}--selected`)?.focus({ preventScroll: !0 });
}
function hu(e) {
	let t = j("div", `${O}__popup-footer`);
	return t.append(bu("now", x.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(bu("clear", x.text("ui.picker.clear"))), t.append(bu("done", x.text("ui.picker.done"))), t;
}
function gu(e) {
	let t = j("div", `${O}__period-caption`);
	return t.textContent = x.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function _u(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? k(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Vl}`)) {
		let e = kl(t.getAttribute(Yl) ?? "", "date");
		t.classList.toggle(`${Vl}--preview`, e !== null && n !== null && r !== null && Nl(e, n, Mu(r, 1)));
	}
}
function vu(e, t) {
	for (let n of e.querySelectorAll(`.${Rl}`)) if (_l(n) === t) return n;
	return e.querySelector(`.${Rl}`);
}
function yu(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function bu(e, t, n) {
	let r = j("button", `${O}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Jl, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function j(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function xu(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Vl}`)];
	if (i.length === 0) return;
	let a = Al(Fl(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(Yl) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (T(i, o), r && o.focus({ preventScroll: !0 }));
}
function Su(e) {
	let t = e.target, n = t.closest(`.${Ul}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? wu(n, e.key === "ArrowRight" ? 1 : -1) : Cu(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), Tu(r));
}
function Cu(e, t, n) {
	return Zi({
		key: n,
		items: [...e.querySelectorAll(`.${A}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function wu(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Ul}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${A}--selected`) ?? r.querySelector(`.${A}:not(:disabled)`);
}
function Tu(e) {
	let t = e.closest(`.${Ul}`);
	t !== null && uu(t, e);
}
function Eu(e, t) {
	let n = bl(e, il), r = bl(e, al);
	return n !== null && t.getTime() < Fl(n).getTime() || r !== null && t.getTime() > Fl(r).getTime();
}
function Du(e, t, n, r) {
	let i = bl(e, il), a = bl(e, al);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function Ou(e) {
	let t = Number(e.getAttribute(ql));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function ku(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Mu(e, -1);
		case "ArrowRight": return Mu(e, 1);
		case "ArrowUp": return Mu(e, -7);
		case "ArrowDown": return Mu(e, 7);
		case "PageUp": return Nu(e, -1);
		case "PageDown": return Nu(e, 1);
		case "Home": return Mu(e, -r);
		case "End": return Mu(e, 6 - r);
		default: return null;
	}
}
function Au(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function ju(e, t) {
	let n = Au(e);
	return Mu(n, -((n.getDay() - t + 7) % 7));
}
function Mu(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Nu(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Pu(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var Fu = "[data-ui-theme-switcher]", Iu = "data-ui-theme", Lu = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(Fu) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: qt.SetTheme,
				mode: Ru() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function Ru() {
	let e = document.documentElement.getAttribute(Iu);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var zu = "data-ui-context-menu-owner", Bu = ve, Vu = "data-ui-context-menu-use", Hu = "ui-context-menu--open", Uu = "ui-menu", Wu = `.ui-menu-item:not(${rt})`, Gu = "ui-context-menu-opening", Ku = at, qu = class {
	root;
	openMenu = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1), new oi({
			openPopups: () => this.openMenu === null ? [] : [this.openMenu],
			close: () => this.close(),
			onPress: !0,
			onWindowBlur: !0
		});
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let n = t.closest(`[${he}]`), r = t.closest(`[${Vu}]`);
		for (let i = t.closest(`[${zu}]`); i !== null; i = i.parentElement?.closest(`[${zu}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute(Vu) ?? "" : "", o = [a.length > 0 ? Yu(i, a) : null, Yu(i, "")].filter((e) => e !== null);
			if (o.length === 0) continue;
			if (Xu(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.close(), this.open(s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(Gu, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n) {
		this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null, e.classList.add(Hu), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${Jr(t, r.width, window.innerWidth)}px`, e.style.top = `${Jr(n, r.height, window.innerHeight)}px`, Ju(e);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Ku) !== null || this.close();
	}
	close() {
		if (this.openMenu === null) return;
		let e = this.openMenu;
		this.openMenu = null, li(this.returnFocus, e), this.returnFocus = null, e.classList.remove(Hu);
	}
};
function Ju(e) {
	let t = e.querySelector(`.${Uu}`);
	if (t === null) return;
	let n = Co(t, Wu, `.${Uu}`), r = n.find(ea) ?? null;
	r !== null && (T(n, r), r.focus({ preventScroll: !0 }));
}
function Yu(e, t) {
	for (let n of e.querySelectorAll(`[${Bu}]`)) if ((n.getAttribute(Bu) ?? "") === t && n.closest(`[${zu}]`) === e) return n;
	return null;
}
function Xu(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/inline-rename.ts
var Zu = "data-ui-rename-field";
function Qu(e) {
	return e instanceof Element && e.closest(`[${Zu}]`) !== null;
}
function $u(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Zu, ""), r.value = e.value, ed(r, n, t);
	let i = !1, a = (t) => {
		if (i) return;
		i = !0;
		let a = r.value.trim();
		r.remove(), n.style.visibility = "", t && (a.length > 0 || e.allowEmpty === !0) && a !== e.value && e.commit(a), e.done?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!e.isComposing) {
			if (e.key === "Enter") a(!0);
			else if (e.key === "Escape") a(!1);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.select(), !0;
}
function ed(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/dialog-engine.ts
var td = "data-ui-dialog", nd = "data-ui-dialog-modal", rd = "data-ui-dialog-close-backdrop", id = "data-ui-dialog-close-escape", ad = "data-ui-dialog-backdrop", od = "ui-dialog__surface", sd = class {
	root;
	returnFocusByKey = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = ci(t.querySelector(`.${od}`) ?? t, t.querySelector(si));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), li(n?.isConnected === !0 ? n : null, t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${td}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${ad}]`);
		if (n === null) return;
		let r = n.closest(`[${td}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(rd)) return;
		let i = r.getAttribute(td);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(id) && !ri() && !Qu(e.target) && !po(e.target)) {
				let n = t.getAttribute(td);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(nd) && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(Ht)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return cd(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(si)].filter((e) => ea(e) || e === document.activeElement);
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
};
function cd(e) {
	let t = e.querySelectorAll(`[${td}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ld(e) {
	let t = cd(e);
	return t !== null && t.hasAttribute(nd) ? t : null;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function ud(e) {
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
		default: o = gd(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function dd(e, t, n = pd()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var fd = null;
function pd() {
	return fd === null && (fd = md()), fd;
}
function md() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function hd(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function gd(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : _d[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : _d[t] ?? null;
}
var _d = {
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
}, vd = "ui-menu", yd = "ui-menu-item", bd = "ui-menu-item--selected", xd = "ui-context-menu", Sd = "ui-orientation--horizontal", Cd = "data-ui-menu-shortcut", wd = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(Ed) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Cd, Qe]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${vd}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && T(t, t.find((e) => e.classList.contains(bd) && ea(e)) ?? t.find(ea) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yd}`), n = t?.closest(`.${vd}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			Td(e, t);
			return;
		}
		let r = this.ownItems(n), i = Zi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Sd) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), T(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yd}`), n = t?.closest(`.${vd}`) ?? null;
		t !== null && n !== null && T(this.ownItems(n), t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || Dd(e))) return;
		let t = ld(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !dd(n.shortcut, e))) {
			if (!ea(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${Cd}]`)) {
			if (e.closest(`.${xd}`) !== null) continue;
			let t = ud(e.getAttribute(Cd));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(Cd)
				});
				continue;
			}
			let n = hd(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(Cd),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return Co(e, `.${yd}:not(${rt})`, `.${vd}`);
	}
};
function Td(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(rt) || !ea(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function Ed(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${vd}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(vd) || t.querySelector(`.${vd}`) !== null)) return !0;
	return !1;
}
function Dd(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var Od = "ne.ui", kd = "boot", Ad = /* @__PURE__ */ new Set(), jd = class {
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
	write(e, t, n, r) {
		let i = this.resolveKey(e, t);
		if (i !== null) {
			try {
				n === null ? window.localStorage.removeItem(i) : window.localStorage.setItem(i, n);
			} catch (e) {
				s("writing client state failed.", {
					key: i,
					error: e
				});
			}
			(r !== void 0 || n === null) && this.writeBoot(e, t, n === null ? null : r ?? null);
		}
	}
	writeBoot(e, t, n) {
		let r = this.resolveKey(e, kd);
		if (r !== null) try {
			let e = window.localStorage.getItem(r), i = e === null ? {} : JSON.parse(e);
			n === null ? delete i[t] : i[t] = n, Object.keys(i).length === 0 ? window.localStorage.removeItem(r) : window.localStorage.setItem(r, JSON.stringify(i));
		} catch (e) {
			s("writing client boot state failed.", {
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
		let n = e.getAttribute(ye);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Ad.has(n) || (Ad.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Od}:${n}:${t}`;
	}
}, Md = "ui-menu", Nd = "ui-menu--nested", Pd = "ui-menu-item", Fd = "ui-menu-item--selected", Id = "ui-menu__submenu", Ld = qe, Rd = Ye, zd = "data-ui-menu-flyout", Bd = Je, Vd = "menu-open-group", Hd = class {
	root;
	store = new jd();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), new oi({
			openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
			close: () => this.closeFlyout(),
			onPress: !0,
			onWindowBlur: !0
		}), this.reconcileEach(this.root.querySelectorAll(`.${Md}`)), C(this.root, `.${Md}`, {
			childList: !0,
			attributeFilter: [Ke]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${Ld}]`)) Ud(e);
		C(this.root, `[${Ld}]`, {
			childList: !0,
			attributeFilter: [Rd]
		}, (e) => {
			for (let t of e) Ud(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Wd(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.closeFlyout(), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Ld}]`)) Ud(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Fd}`), e);
		if (t !== null && !t.hasAttribute(Bd)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Nd) ? null : this.store.read(e, Vd), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Pd}`);
		if (t !== null && this.openFlyout !== null && this.openFlyout.contains(t)) {
			t.getAttribute("data-ui-menu-item-kind") !== "check" && this.closeFlyout();
			return;
		}
		if (t === null) {
			this.closeFlyout();
			return;
		}
		let n = this.ownGroupOf(t);
		if (n === null) {
			this.closeFlyout();
			return;
		}
		e.preventDefault();
		let r = n.closest(`.${Md}`);
		r !== null && (Wd(r) || n.hasAttribute(Bd) ? this.toggleFlyout(r, n, t) : this.toggleInline(r, n));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Nd);
		if (t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Rd);
			return;
		}
		if (t.hasAttribute(Rd)) {
			t.removeAttribute(Rd), n || this.store.write(e, Vd, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Vd, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(Rd, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Ld}][${Rd}]`)) t.hasAttribute(Bd) || t.removeAttribute(Rd);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(Rd, ""), r.setAttribute(zd, ""), this.openFlyout = r, Or(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, Nr(e), e.removeAttribute(zd), e.parentElement?.removeAttribute(Rd));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Ld}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(it) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Ld}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Id}`);
	}
};
function Ud(e) {
	let t = e.querySelector(`:scope > .${Pd}`), n = e.closest(`.${Md}`);
	t !== null && (t.setAttribute("aria-expanded", e.hasAttribute(Rd) ? "true" : "false"), e.hasAttribute(Bd) || n !== null && Wd(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Wd(e) {
	return e.hasAttribute(Ke);
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Gd = `.ui-menu[${Xe}]`, Kd = ":scope > .ui-collapsible__bar", qd = ":scope > .ui-menu__host", Jd = "ui-menu__item", Yd = ":scope > .ui-menu-item", Xd = "ui-menu-item", Zd = ".ui-text__title", Qd = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", $d = /\p{M}/gu, ef = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), C(t, Gd, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ke]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = tf(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(qd);
		if (n === null) return;
		let r = nf(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: sf(n)
		}), e.setAttribute(Ze, ""), this.filter(n, r);
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of cf(e)) {
			let e = lf(a);
			if (e === "header") {
				n !== null && df(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			df(a, o), r ||= o, i ||= o;
		}
		return n !== null && df(n, r), i;
	}
	match(e, t) {
		let n = of(uf(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(Qd) : null;
		if (r === null) return n;
		if (n) return ff(r), e.removeAttribute(Ye), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Ye, i), i;
	}
	clear(e, t) {
		ff(t), e.removeAttribute(Ze);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Ke);
		for (let e of t.querySelectorAll(`[${qe}]:not([${Je}])`)) e.toggleAttribute(Ye, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...tf(e.target)?.querySelector(qd)?.querySelectorAll(`.${Xd}:not(${rt})`) ?? []].find(ea);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function tf(e) {
	let t = e.closest(Gd), n = t?.querySelector(Kd) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function nf(e, t) {
	return af(e, rf(t)).split(/\s+/).filter((e) => e.length !== 0);
}
function rf(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function af(e, t) {
	let n = e.normalize("NFD").replace($d, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function of(e, t) {
	return t.every((t) => e.includes(t));
}
function sf(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${qe}][${Ye}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function cf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(Jd));
}
function lf(e) {
	return e.querySelector(Yd)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function uf(e) {
	return af(e.querySelector(Yd)?.querySelector(Zd)?.textContent ?? "", rf(e));
}
function df(e, t) {
	e.toggleAttribute(Qe, !t);
}
function ff(e) {
	for (let t of e.querySelectorAll(`[${Qe}]`)) t.removeAttribute(Qe);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var pf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], mf = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function hf(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${mf[t]}px)`)) return t;
	return "base";
}
function gf(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function M(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function _f(e, t) {
	let n;
	for (let r of pf) {
		let i = M(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var vf = "[data-ui-root]", yf = "a[href]", bf = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${mf.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${$e}]`);
		if (t !== null) {
			let e = t.closest(vf), n = t.getAttribute($e);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(yf)?.closest(`[${tt}]`), r = n?.parentElement ?? null;
		n != null && r?.getAttribute("data-ui-drawer-open") === n.getAttribute("data-ui-region") && this.close(r);
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && this.closeAll();
	}
	toggle(e, t) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		e.setAttribute(et, t), this.markToggles(e), e.querySelector(`:scope > [${tt}="${CSS.escape(t)}"] :is(a[href], button, input, [tabindex="0"])`)?.focus();
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${vf}[${et}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(et);
		e.removeAttribute(et), this.markToggles(e), t !== null && document.activeElement !== null && e.querySelector(`:scope > [data-ui-region="${CSS.escape(t)}"]`)?.contains(document.activeElement) && e.querySelector(`[${$e}="${CSS.escape(t)}"]`)?.focus();
	}
	markToggles(e) {
		let t = e.getAttribute(et);
		for (let n of e.querySelectorAll(`[${$e}]`)) n.setAttribute("aria-expanded", String(n.getAttribute($e) === t));
	}
}, xf = "ui-collapsible", Sf = "ui-collapsible__content", Cf = "ui-collapsible__bar", wf = "collapsed", Tf = 200, Ef = "cubic-bezier(0.4, 0, 0.2, 1)", Df = class {
	root;
	store = new jd();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${xf}`)), C(this.root, `.${xf}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, wf);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ot}]`), n = t?.closest(`.${xf}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(Ke), i = n.querySelector(`:scope > .${Sf}`);
		this.cancelFold(n);
		let a = kf(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, wf, r ? "true" : "false", r ? { attributes: { [Ke]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Ke, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${ot}], :scope > .${Cf} > [${ot}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let i = Of(e), a = kf(e, t);
		if (n.component === a.component) return;
		e.setAttribute(st, "");
		let o = {
			duration: Tf,
			easing: Ef
		}, s = [e.animate([{ [i]: `${n.component}px` }, { [i]: `${a.component}px` }], o)];
		if (t !== null) {
			let e = `${r ? n.content : a.content}px`, c = (r ? a.content : n.content) === 0;
			s.push(t.animate([{
				[i]: e,
				opacity: c && !r ? 0 : 1,
				visibility: "visible"
			}, {
				[i]: e,
				opacity: c && r ? 0 : 1,
				visibility: "visible"
			}], o));
		}
		this.folds.set(e, s), Promise.allSettled(s.map((e) => e.finished)).then(() => {
			this.folds.get(e) === s && (this.folds.delete(e), e.removeAttribute(st));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(st);
			for (let e of t) e.cancel();
		}
	}
};
function Of(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function kf(e, t) {
	let n = Of(e);
	return {
		component: e.getBoundingClientRect()[n],
		content: t?.getBoundingClientRect()[n] ?? 0
	};
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Af = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), window.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), e.root.addEventListener("focusout", (e) => jf(e.target), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element) || this.drag !== null) return;
		let t = this.options.resolveHandle(e.target);
		if (t === null) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(At, ""), t.tabIndex >= 0 && (t.setAttribute(jt, ""), t.focus({ preventScroll: !0 })), this.drag = {
				handle: t,
				context: n,
				origin: this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(n)],
				originPoint: {
					x: e.clientX,
					y: e.clientY
				},
				pointerId: e.pointerId
			};
		}
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { context: t, origin: n } = this.drag, r = this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(t)] - n;
		this.options.move(t, r, {
			x: e.clientX,
			y: e.clientY
		});
	}
	handlePointerEnd(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { handle: t, context: n } = this.drag;
		this.drag = null, t.removeAttribute(At), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (jf(e.target), !(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(At);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
function jf(e) {
	e instanceof Element && e.hasAttribute("data-ui-pointer-focus") && e.removeAttribute(jt);
}
//#endregion
//#region src/interactions/grid-tracks.ts
function Mf(e) {
	let t = [];
	for (let n of Ff(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Mf(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Nf(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Nf(e) {
	if (e === "auto" || e === "max-content") return {
		kind: "auto",
		value: 0
	};
	let t = /^fit-content\(\s*([\d.]+)px\s*\)$/.exec(e);
	if (t !== null) return {
		kind: "auto",
		value: 0,
		max: Number(t[1])
	};
	let n = /^minmax\(\s*([\d.]+)px\s*,\s*auto\s*\)$/.exec(e);
	if (n !== null) return Pf({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Pf(r[3] === "fr" ? {
		kind: "star",
		value: Number(r[2])
	} : {
		kind: "px",
		value: Number(r[2])
	}, Number(r[1]));
	let i = /^([\d.]+)px$/.exec(e);
	if (i !== null) return {
		kind: "px",
		value: Number(i[1])
	};
	let a = /^([\d.]+)fr$/.exec(e);
	return a === null ? null : {
		kind: "star",
		value: Number(a[1])
	};
}
function Pf(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Ff(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function If(e, t = "auto") {
	return e.map((e) => Lf(e, t)).join(" ");
}
function Lf(e, t) {
	switch (e.kind) {
		case "px": return `${Rf(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Rf(e.min)}px`}, ${Rf(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Rf(e.max)}px)` : `minmax(${Rf(e.min)}px, auto)`;
	}
}
function Rf(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function zf(e) {
	if (e === null || e.length === 0) return [];
	let t = [];
	for (let n of e.split(" ")) {
		let [e, r, i] = n.split(":"), a = Number(e);
		!Number.isInteger(a) || a < 1 || t.push({
			index: a - 1,
			...r !== void 0 && r.length > 0 ? { min: Number(r) } : {},
			...i !== void 0 && i.length > 0 ? { max: Number(i) } : {}
		});
	}
	return t;
}
function Bf(e, t) {
	let n = [...e];
	for (let e of t) {
		let t = n[e.index];
		t !== void 0 && (n[e.index] = {
			...t,
			...e.min === void 0 ? {} : { min: e.min },
			...e.max === void 0 ? {} : { max: e.max }
		});
	}
	return n;
}
function Vf(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Hf(r, e), o = Hf(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Hf(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function Uf(e, t, n, r) {
	let i = Wf(e, t, n.before), a = Wf(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = Yf(n.before, e) + Yf(n.after, e), r = i.total + a.total;
		Gf(l, e, i, t * (i.total + c) / r), Gf(l, e, a, t * (a.total - c) / r);
	} else u || Kf(l, i, i.total + c), d || Kf(l, a, a.total - c);
	return l;
}
function Wf(e, t, n) {
	let r = Jf(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
	for (let t = 0; t < n.length; t++) {
		let r = e[n[t]], s = i[t];
		s <= 0 || (r.min !== void 0 && (a = Math.max(a, r.min / s)), r.max !== void 0 && (o = Math.min(o, r.max / s)));
	}
	return {
		indices: n,
		total: r,
		shares: i,
		min: a,
		max: Math.max(a, o)
	};
}
function Gf(e, t, n, r) {
	let i = Yf(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Kf(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...qf(e[i])
		};
	}
}
function qf(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Jf(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Yf(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Xf(e, t) {
	let n = Jf(t.before, e), r = n + Jf(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Zf(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function Qf(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var $f = "ui-grid-splitter", ep = "ui-container", tp = "ui-orientation--vertical", np = 16, rp = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: ct,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, ip = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: lt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, ap = class {
	root;
	store = new jd();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Af({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${$f}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${$f}`)), C(this.root, `.${$f}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = op(t);
			e !== null && (this.restore(e, sp(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of pf) {
			let i = r[n], a = gf(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$f}`);
		if (t === null || this.drag.active) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = fp(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "Home":
				a = -i;
				break;
			case "End":
				a = i;
				break;
			default: return;
		}
		e.preventDefault(), this.apply(n, a) && (this.remember(n), this.reportPosition(t));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$f}`), n = t === null ? null : op(t);
		if (t === null || n === null) return;
		let r = sp(t);
		for (let e of pf) n.style.removeProperty(gf(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = Uf(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(gf(e.axis.split, e.tier), If(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of pf) {
			let a = gf(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = op(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = sp(e), r = hf(), i = cp(t, n, r), a = i === null ? null : Mf(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Bf(a, zf(t.getAttribute(n.limits))), s = lp(t, n), c = up(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Vf(c, dp(t, n).map((e) => up(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r
		};
	}
	reportPosition(e) {
		let t = op(e);
		if (t === null) return;
		let n = sp(e), r = up(e, n), i = lp(t, n), a = dp(t, n).map((e) => up(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : Vf(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Xf(i, o))));
	}
};
function op(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(ep) ? t : null;
}
function sp(e) {
	return e.classList.contains(tp) ? rp : ip;
}
function cp(e, t, n) {
	for (let r = pf.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(gf(t.split, pf[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function lp(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function up(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function dp(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains($f) && sp(r) === t && n.push(r);
	return n;
}
function fp(e) {
	let t = Number(e.getAttribute(ut));
	return Number.isFinite(t) && t > 0 ? t : np;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var pp = "ui-split-button", mp = "ui-split-button__main", hp = "ui-split-button__toggle", gp = "ui-split-button__menu", _p = "ui-split-button--open", vp = "ui-menu-item", yp = 4, bp = class {
	root;
	open = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1), new oi({
			openPopups: () => this.open === null ? [] : [this.open],
			close: () => this.close()
		});
	}
	handleClick(e) {
		let t = xp(e.target);
		if (t !== null) {
			e.preventDefault(), this.open === t ? this.close() : this.openMenu(t);
			return;
		}
		this.open !== null && e.target instanceof Element && e.target.closest(`.${mp}`)?.closest(`.${pp}`) === this.open && this.close();
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = xp(e.target);
		t !== null && this.open !== t && (e.preventDefault(), this.openMenu(t));
	}
	handleChoice(e) {
		if (this.open === null || !(e.target instanceof Element)) return;
		let t = Sp(this.open), n = e.target.closest(`.${vp}`);
		t === null || n === null || !t.contains(n) || n.matches(`${rt}, ${at}`) || this.close();
	}
	openMenu(e) {
		this.close();
		let t = Sp(e);
		if (t !== null) {
			this.open = e, e.classList.add(_p);
			for (let t of Cp(e)) t.setAttribute("aria-expanded", "true");
			Or(e, t, {
				placement: "bottom-end",
				gap: yp
			}), this.returnFocus = ci(t);
		}
	}
	close() {
		let e = this.open;
		if (e === null) return;
		this.open = null, e.classList.remove(_p);
		for (let t of Cp(e)) t.setAttribute("aria-expanded", "false");
		let t = Sp(e);
		t !== null && (Nr(t), li(this.returnFocus, t)), this.returnFocus = null;
	}
};
function xp(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${hp}, .${mp}`), n = t?.closest(`.${pp}`) ?? null;
	return t === null || n === null || t.classList.contains(mp) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Sp(e) {
	return e.querySelector(`:scope > .${gp}`);
}
function Cp(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var wp = "ui-button-group", Tp = "ui-button-group__item", Ep = "ui-button", Dp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${wp}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), C(this.root, `.${wp}`, {
			childList: !0,
			attributeFilter: [Pt]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Op(i);
			i.toggleAttribute(Nt, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		T(n, r ?? n.find(ea) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Tp}`), n = t?.closest(`.${wp}`) ?? null;
		t === null || n === null || t.closest(`.${wp}`) !== n || n.matches(".ui-disabled") || Op(t)?.matches(".ui-disabled, :disabled") !== !0 && this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Tp} > .${Ep}`), n = t?.closest(`.${wp}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Op).filter((e) => e !== null), i = Zi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Tp}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		da(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Pt,
			bindingAttribute: Ft,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Co(e, `.${Tp}`, `.${wp}`);
	}
};
function Op(e) {
	return e.querySelector(`:scope > .${Ep}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var kp = "ui-accordion", Ap = "details", jp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${kp}`)), C(this.root, `.${kp}`, { childList: !0 }, (e) => this.normalizeAll(e));
	}
	normalizeAll(e) {
		for (let t of e) {
			let e = !1;
			for (let n of this.sectionsOf(t)) n.open && (e ? n.open = !1 : e = !0);
		}
	}
	handleSummaryClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("summary")?.parentElement;
		!(t instanceof HTMLDetailsElement) || t.open || this.closeSiblings(t);
	}
	handleToggle(e) {
		let t = e.target;
		!(t instanceof HTMLDetailsElement) || !t.open || this.closeSiblings(t);
	}
	closeSiblings(e) {
		let t = e.parentElement;
		if (!(t === null || !t.classList.contains(kp))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${Ap}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function Mp(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var Np = "ui-tab-overflow", Pp = "ui-tab-overflow__menu", Fp = "ui-tab-overflow__menu--open", Ip = "ui-tab-overflow__entry", Lp = "ui-tab-overflow__entry--current", Rp = class {
	options;
	list;
	fittedWidths = /* @__PURE__ */ new WeakMap();
	wraps = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${this.options.rootClass}`);
			e !== null && this.fittedWidths.get(t.target) !== t.contentRect.width && (this.fittedWidths.set(t.target, t.contentRect.width), this.options.refit(e));
		}
	}) : null;
	switches = typeof MutationObserver == "function" ? new MutationObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) n.target instanceof HTMLElement && this.wraps.get(n.target) !== n.target.classList.contains(this.options.wrapsClass) && t.add(n.target);
		for (let e of t) this.options.refit(e);
	}) : null;
	constructor(e) {
		this.options = e, this.list = new Bp(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class"] });
		let n = e.classList.contains(this.options.wrapsClass);
		if (this.wraps.set(e, n), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.add(this.options.overflowingClass);
		let r = zp({
			captions: t.captions,
			selected: t.selected,
			width: t.room.clientWidth,
			buttonWidth: t.button.getBoundingClientRect().width,
			hiddenClass: this.options.hiddenClass
		});
		e.classList.toggle(this.options.overflowingClass, r), r || this.closeListOf(e);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		if (this.list.isOpenFor(e)) {
			this.list.close();
			return;
		}
		this.list.open(t, e, n());
	}
};
function zp(e) {
	for (let t of e.captions) t.classList.remove(e.hiddenClass);
	let t = e.captions.map((e) => e.getBoundingClientRect().width), n = 0;
	for (let e of t) n += e;
	if (n <= e.width) return !1;
	let r = e.width - e.buttonWidth, i = e.selected === null ? 0 : t[e.captions.indexOf(e.selected)] ?? 0;
	for (let n = 0; n < e.captions.length; n++) {
		let a = e.captions[n];
		a !== e.selected && (i + t[n] <= r ? i += t[n] : a.classList.add(e.hiddenClass));
	}
	return !0;
}
var Bp = class {
	pick;
	menu;
	button = null;
	strip = null;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Pp, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("focusout", (e) => this.handleFocusOut(e)), new oi({
			openPopups: () => this.button === null ? [] : [this.menu],
			close: () => this.close(),
			isInside: (e, t) => t.includes(this.menu) || this.button !== null && t.includes(this.button),
			onWindowBlur: !0
		});
	}
	isOpenFor(e) {
		return this.strip === e;
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(Vp)), this.menu.parentElement === null && document.body.appendChild(this.menu), this.button = e, this.strip = t, this.menu.classList.add(Fp), e.setAttribute("aria-expanded", "true"), Or(e, this.menu, {
			placement: "bottom-end",
			gap: 4
		});
		let r = this.menu.querySelector(`.${Lp}`) ?? this.menu.querySelector(`.${Ip}`);
		T(this.entries(), r), r?.focus({ preventScroll: !0 });
	}
	close() {
		this.button !== null && (li(this.button, this.menu), Nr(this.menu), this.menu.classList.remove(Fp), this.button.setAttribute("aria-expanded", "false"), this.button = null, this.strip = null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ip}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.strip;
		t !== null && n !== null && r !== null && (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		let t = this.entries(), n = Zi({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), T(t, n), n.focus());
	}
	handleFocusOut(e) {
		let t = e.relatedTarget;
		!(t instanceof Node) || this.menu.contains(t) || this.button?.contains(t) === !0 || this.close();
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${Ip}`));
	}
};
function Vp(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Ip} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(Lp, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var Hp = "ui-tabs", Up = "ui-tab-header", Wp = "ui-tab-header--selected", Gp = "ui-tab-header--overflowed", Kp = "ui-tabs--overflowing", qp = "ui-tabs--no-overflow", Jp = "ui-tabs__strip", Yp = "data-ui-tab-key", Xp = "data-ui-tab-page", Zp = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Rp({
			rootClass: Hp,
			overflowingClass: Kp,
			wrapsClass: qp,
			hiddenClass: Gp,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${Hp}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), C(this.root, `.${Hp}`, {
			childList: !0,
			attributeFilter: [It, ...Bt],
			relevant: (e) => !Zr(e, `[${Xp}]`, `.${Hp}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(Yp) ?? "") === t) ?? null;
		if (r !== null && !Mp(r)) {
			let t = n.find(Mp);
			if (t !== void 0) {
				this.select(e, t.getAttribute(Yp) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(Yp) ?? "") === t;
			e.classList.toggle(Wp, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(Mp), i), T(n.filter((e) => !e.classList.contains(Gp)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(Xp) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${Jp}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(Yp) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(Mp).map((e) => {
				let n = e.getAttribute(Yp) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Np}`), n = t?.closest(`.${Hp}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${Hp}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Up}`);
		if (r === null || r.matches(":disabled, .ui-disabled")) return;
		let i = r.closest(`.${Hp}`), a = r.getAttribute(Yp);
		i !== null && a !== null && r.closest(`.${Hp}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Up}`), n = t?.closest(`.${Hp}`) ?? null;
		if (t === null || n === null) return;
		let r = Zi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(Yp) ?? ""), r.focus());
	}
	select(e, t) {
		da(e, t, {
			attribute: It,
			bindingAttribute: Ft,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return Co(e, `.${Up}`, `.${Hp}`);
	}
	ownPages(e) {
		return Co(e, `[${Xp}]`, `.${Hp}`);
	}
}, Qp = "ui-breadcrumbs", $p = "ui-breadcrumbs__item", em = "ui-breadcrumb", tm = "ui-breadcrumb--current", nm = "ui-hidden", rm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), C(this.root, `.${Qp}`, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Qp}`)) this.apply(e);
	}
	apply(e) {
		let t = Co(e, `.${$p}`, `.${Qp}`).filter((e) => !e.classList.contains(nm)).map((e) => e.querySelector(`.${em}`)).filter((e) => e !== null && !e.classList.contains(nm)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(tm, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
//#endregion
//#region src/rendering/color-bytes.ts
function N(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function P(e) {
	return N(e).toString(16).padStart(2, "0").toUpperCase();
}
//#endregion
//#region src/interactions/color-input-engine.ts
var im = "ui-color-input", am = "ui-color-input--open", om = "ui-color-input__popup", sm = "ui-color-input__text", cm = "ui-color-input__row", lm = "ui-color-input__swatch--button", um = "ui-color-input__value-input", dm = "ui-color-input__square-thumb", fm = "ui-color-input__hue-thumb", pm = "data-ui-color-toggle", mm = "data-ui-color-tab", hm = "data-ui-color-tab-selected", gm = "data-ui-color-pane", _m = "data-ui-color-pane-selected", vm = "data-ui-color-square", ym = "data-ui-color-hue", bm = "data-ui-color-hex", xm = "data-ui-color-channel", Sm = "data-ui-color-factor", Cm = "data-ui-color-opacity", wm = "data-ui-color-name", Tm = "data-ui-color-name-selected", Em = "data-ui-color-format", Dm = "data-ui-color-readonly", Om = "data-ui-color-variant", km = "data-ui-color-picker", Am = "data-ui-color-palette", jm = 4, Mm = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	returnFocus = /* @__PURE__ */ new WeakMap();
	openInput = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${im}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = v(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${im}`) ?? []);
		}), C(this.root, `.${im}`, {
			childList: !0,
			attributeFilter: [
				Em,
				Dm,
				Om,
				km,
				Am
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Af({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${vm}], [${ym}]`),
			begin: (e, t) => {
				let n = e.closest(`.${im}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(vm) ? "square" : "hue"
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: (e, t) => this.send(t.input)
		}), new oi({
			openPopups: () => this.openInput === null ? [] : [this.openInput],
			close: (e) => this.setOpen(e, !1)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = Bm(e), n = this.states.get(e), r = n?.paneChosen === !0 ? Nm(e, n.pane) : Pm(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? Fm(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Jm(t);
			if (i === null) return n ?? Fm(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && Im(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Zm(a, o, s);
			return {
				pane: r,
				hue: l,
				saturation: u,
				value: d,
				opacity: c,
				name: null,
				factor: 0,
				held: !0,
				paneChosen: n?.paneChosen === !0
			};
		}
		let i = t.split("/"), a = Number(i[2] ?? "0") * (i[1] === "Shade" ? -1 : 1), o = Number(i[3] ?? "255");
		return {
			...n ?? Fm(r),
			pane: r,
			name: i[0],
			factor: a,
			opacity: o,
			held: !0
		};
	}
	applyState(e, t) {
		let [n, r, i] = this.resolveRgb(e, t);
		if (t.name !== null) {
			let [e, a, o] = Zm(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Wm(e, "--ui-color-input-color", t.held ? Xm(n, r, i, t.opacity) : "transparent"), Wm(e, "--ui-color-input-solid", Xm(n, r, i, 255)), Wm(e, "--ui-color-input-on-color", t.held ? Lm(n, r, i, t.opacity) : "inherit"), Um(e, t.held ? Hm(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${vm}]`), o = e.querySelector(`[${ym}]`), [s, c, l] = Qm(t.hue, 1, 1);
		if (Wm(e, "--ui-color-input-hue", Xm(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${dm}`);
			e !== null && (Wm(e, "left", `${t.saturation * 100}%`), Wm(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${fm}`);
			e !== null && Wm(e, "top", `${t.hue / 360 * 100}%`);
		}
		Gm(e, `[${bm}]`, Ym(n, r, i)), Gm(e, `[${xm}="r"]`, String(n)), Gm(e, `[${xm}="g"]`, String(r)), Gm(e, `[${xm}="b"]`, String(i)), Wm(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), Km(e, `[${Cm}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${wm}]`)) n.getAttribute(wm) === t.name ? n.setAttribute(Tm, "") : n.removeAttribute(Tm);
		let n = t.name === null ? null : e.querySelector(`[${wm}="${t.name}"]`), r = n === null ? null : Jm(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Wm(e, "--ui-color-input-base", r === null ? "transparent" : Xm(r[0], r[1], r[2], 255)), Km(e, `[${Sm}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${gm}]`)) n.getAttribute(gm) === t.pane ? n.setAttribute(_m, "") : n.removeAttribute(_m);
		for (let n of e.querySelectorAll(`[${mm}]`)) n.getAttribute(mm) === t.pane ? n.setAttribute(hm, "") : n.removeAttribute(hm);
	}
	resolveRgb(e, t) {
		if (t.name === null) return Qm(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${wm}="${t.name}"]`), r = n === null ? null : Jm(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? Qm(t.hue, t.saturation, t.value) : qm([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${pm}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${im}`));
			return;
		}
		let n = e.target.closest(`[${mm}]`), r = e.target.closest(`.${im}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(mm), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${wm}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(wm)
			}));
			return;
		}
		let a = r.querySelector(`.${om}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${im}`);
		if (t !== null) {
			if (e.target.hasAttribute(Sm)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(Cm) && this.commit(t, (t) => ({
				...t,
				opacity: N(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${im}`);
		if (n === null) return;
		if (t.hasAttribute(Sm) || t.hasAttribute(Cm)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(bm)) {
			let e = Jm(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Zm(e[0], e[1], e[2]);
			this.commit(n, (t) => ({
				...t,
				hue: r,
				saturation: i,
				value: a,
				opacity: e[3],
				name: null
			}));
			return;
		}
		let r = t.getAttribute(xm);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = N(Number(t.value));
		let [l, u, d] = Zm(c.r, c.g, c.b);
		this.commit(n, (e) => ({
			...e,
			hue: l,
			saturation: u,
			value: d,
			name: null
		}));
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = $m((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = $m((t.x - a.left) / a.width), s = 1 - $m((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || e.hasAttribute(Dm)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${um}`);
		a !== null && (a.value = Vm(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		e.hasAttribute(Dm) || e.querySelector(`.${um}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		e === null || e.hasAttribute(Dm) || !e.hasAttribute(km) && !e.hasAttribute(Am) || this.setOpen(e, !e.classList.contains(am));
	}
	setOpen(e, t) {
		let n = e.querySelector(`.${om}`);
		if (t && e.hasAttribute(Dm) || n === null) return;
		if (this.openInput !== null && this.openInput !== e && this.setOpen(this.openInput, !1), e.classList.toggle(am, t), e.querySelector(`[${pm}]`)?.setAttribute("aria-expanded", t ? "true" : "false"), !t) {
			Nr(n), this.openInput = null, li(this.returnFocus.get(e), n), this.returnFocus.delete(e);
			return;
		}
		this.openInput = e, Or((e.getAttribute(Om) === "swatch" ? e.querySelector(`.${lm}`) : e.querySelector(`.${cm}`)) ?? e, n, {
			placement: "bottom-end",
			gap: jm
		});
		let r = ci(n, n.querySelector(`[${hm}]`));
		r !== null && this.returnFocus.set(e, r);
	}
};
function Nm(e, t) {
	return ((t) => e.hasAttribute(t === "picker" ? km : Am))(t) ? t : t === "picker" ? "palette" : "picker";
}
function Pm(e) {
	return Nm(e, "picker");
}
function Fm(e) {
	return {
		pane: e,
		hue: 0,
		saturation: 1,
		value: 1,
		opacity: 255,
		name: null,
		factor: 0,
		held: !1,
		paneChosen: !1
	};
}
function Im(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function Lm(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return Rm(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function Rm(e, t, n) {
	return .2126 * zm(e) + .7152 * zm(t) + .0722 * zm(n);
}
function zm(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Bm(e) {
	return e.querySelector(`.${um}`)?.value.trim() ?? "";
}
function Vm(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Ym(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${P(e.opacity)}`;
}
function Hm(e, t, n, r, i) {
	if (e.getAttribute(Em) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Ym(t, n, r);
	return i === 255 ? a : `${a}${P(i)}`;
}
function Um(e, t) {
	for (let n of e.querySelectorAll(`.${sm}`)) n.textContent !== t && (n.textContent = t);
}
function Wm(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function Gm(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function Km(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function qm(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		N(e[0] * (1 - n)),
		N(e[1] * (1 - n)),
		N(e[2] * (1 - n))
	] : [
		N(e[0] + (255 - e[0]) * n),
		N(e[1] + (255 - e[1]) * n),
		N(e[2] + (255 - e[2]) * n)
	];
}
function Jm(e) {
	let t = e.trim().replace(/^#/, "");
	return /^[0-9a-fA-F]+$/.test(t) ? t.length === 3 ? [
		parseInt(t[0] + t[0], 16),
		parseInt(t[1] + t[1], 16),
		parseInt(t[2] + t[2], 16),
		255
	] : t.length !== 6 && t.length !== 8 ? null : [
		parseInt(t.slice(0, 2), 16),
		parseInt(t.slice(2, 4), 16),
		parseInt(t.slice(4, 6), 16),
		t.length === 8 ? parseInt(t.slice(6, 8), 16) : 255
	] : null;
}
function Ym(e, t, n) {
	return `#${P(e)}${P(t)}${P(n)}`;
}
function Xm(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Zm(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function Qm(e, t, n) {
	let r = n * t, i = r * (1 - Math.abs(e / 60 % 2 - 1)), a = n - r, [o, s, c] = e < 60 ? [
		r,
		i,
		0
	] : e < 120 ? [
		i,
		r,
		0
	] : e < 180 ? [
		0,
		r,
		i
	] : e < 240 ? [
		0,
		i,
		r
	] : e < 300 ? [
		i,
		0,
		r
	] : [
		r,
		0,
		i
	];
	return [
		N((o + a) * 255),
		N((s + a) * 255),
		N((c + a) * 255)
	];
}
function $m(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function eh(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var F = "ui-table", th = "ui-table--reorderable", nh = "ui-table__scroll", rh = "ui-scroll-x--auto", ih = "ui-scroll-x--always", ah = `:scope > .${nh}`, oh = ".ui-table__resizer", sh = "ui-table__header-cell", ch = `${sh}--pinned`, lh = `${ah} > .ui-table__header > .${sh}`, uh = `${lh}--pinned`, dh = `.${F}, .ui-table__row, [${dt}]`, fh = "--ui-table-columns", ph = "--ui-table-sized-columns", mh = "--ui-table-pin-", hh = "--ui-table-order-", gh = 64, _h = "data-ui-table-cell-hidden", vh = "data-ui-table-cell-last", yh = "columns", bh = "hidden", xh = "order", Sh = "layout", Ch = 32, wh = 16, Th = class {
	root;
	store = new jd();
	restored = /* @__PURE__ */ new WeakSet();
	widths = /* @__PURE__ */ new WeakMap();
	orders = /* @__PURE__ */ new WeakMap();
	hiddenChoices = /* @__PURE__ */ new WeakMap();
	columnStates = /* @__PURE__ */ new WeakMap();
	stampedStates = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	reorder;
	moved = !1;
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.drag = new Af({
			root: this.root,
			resolveHandle: (e) => e.closest(oh),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new Af({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of pf) e !== "base" && matchMedia(`(min-width: ${mf[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${F}`)), C(this.root, `.${F}`, {
			childList: !0,
			relevant: Dh
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), C(this.root, `.${F}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(F)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		});
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t), this.layout(t), eh(t, () => this.pin(t)));
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, yh), r = n === null ? null : Mf(n);
		r !== null && r.length !== t.length ? (this.store.write(e, yh, null), this.store.writeBoot(e, Sh, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, xh);
		if (i !== null && !kh(i, t)) {
			this.store.write(e, xh, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${F}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = Oh(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(rh) || e.classList.contains(ih);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(ph);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Qf(t, n);
				e.style.setProperty(ph, If(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${hh}${t}`, String(r[t])) : e.style.removeProperty(`${hh}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(pt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(pt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(mt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(mt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(th)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= gh) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${dt}]`)) {
				let r = Number(t.getAttribute(dt));
				!(r >= gh) || t.closest(`.${F}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(_h, n.hidden.has(r)), t.toggleAttribute(vh, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(lh)) {
			let e = Number(n.getAttribute(dt)), r = n.getAttribute(ft), i = n.classList.contains(ch) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Nh(r) ? r : null,
				anchored: i,
				cell: n
			});
		}
		return t;
	}
	placesOf(e, t) {
		let n = [];
		for (let e of t) n[e.index] = e.index;
		let r = this.orders.get(e) ?? null;
		if (r === null) return n;
		let i = new Map(t.map((e) => [e.key, e])), a = t.filter((e) => !e.anchored).map((e) => e.index), o = 0;
		for (let e of r) {
			let t = i.get(e);
			t !== void 0 && !t.anchored && (n[t.index] = a[o++]);
		}
		return n;
	}
	hiddenOf(e, t = this.columnsOf(e)) {
		let n = this.choicesOf(e), r = /* @__PURE__ */ new Set();
		for (let e of t) (n[e.key] ?? Mh(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, bh) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(fh).trim(), n = t.length === 0 ? null : Mf(t);
		return n === null && this.warner.warn(e, "the table's track list could not be read.", { template: t }), n;
	}
	isColumnHidden(e, t) {
		if (!(e instanceof HTMLElement)) return !1;
		let n = this.columnsOf(e), r = n.find((e) => e.key === t);
		return r !== void 0 && this.hiddenOf(e, n).has(r.index);
	}
	setColumnHidden(e, t, n) {
		if (!(e instanceof HTMLElement)) return;
		let r = { ...this.choicesOf(e) }, i = this.columnsOf(e).find((e) => e.key === t);
		n === null || i !== void 0 && n === Mh(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, bh, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return Oh(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(uh).length;
		if (t < 2) return;
		let n = Zf(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${mh}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains(nh) || t.closest(`.${F}`)?.toggleAttribute(vt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(ah);
		return t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(oh);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = wh;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${F}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(dt)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(oh)?.closest(`.${F}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Uf(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(Ch, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, Eh(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, yh, t === null ? null : If(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(ph).trim(), n = e.getAttribute(pt), r = {};
		t.length > 0 && (r[ph] = t);
		for (let t of e.style) t.startsWith(hh) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, Sh, null);
			return;
		}
		this.store.writeBoot(e, Sh, {
			styles: r,
			attributes: {
				[pt]: n,
				[mt]: e.getAttribute(mt)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${F}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = zf(t.getAttribute(ct)), i = Bf(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(dt)), u = this.hiddenOf(t, o), d = Oh(s), f = (s[l] ?? -1) + 1;
		for (; f < d.length && u.has(d[f]);) f++;
		let p = f < d.length ? d[f] : -1;
		return !Number.isInteger(l) || l < 0 || p < 0 || c.length < i.length ? (this.warner.warn(t, "the handle's column could not be found in its table.", {
			index: l,
			tracks: i.length,
			sizes: c.length
		}), null) : {
			table: t,
			index: l,
			after: p,
			tracks: i,
			sizes: c,
			floors: a
		};
	}
	resolveCaption(e) {
		let t = e.closest(`.${sh}`), n = t?.closest(`.${F}`) ?? null;
		return t === null || n === null || !n.classList.contains(th) || e.closest(oh) !== null || t.classList.contains(ch) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${F}`), r = Number(e.getAttribute(dt));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(ht, ""), e.setAttribute(gt, ""), {
			table: n,
			index: r,
			origin: t,
			places: i,
			from: a,
			target: a
		});
	}
	movableColumns(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = new Map(t.map((e) => [e.index, e])), i = [];
		for (let a of Oh(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Ah(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), jh(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(_t, "after") : a.cell.setAttribute(_t, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(gt), t.table.removeAttribute(ht), jh(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = Oh(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
		if (o < 0) return;
		a.splice(o, 1);
		let s = n === null ? -1 : a.indexOf(n);
		a.splice(s < 0 ? a.length : s, 0, t);
		let c = [], l = 0;
		for (let e = 0; e < r.length; e++) {
			let t = i.get(e);
			c.push(t?.anchored === !0 ? t.key : i.get(a[l++])?.key ?? "");
		}
		let u = c.every((e, t) => e === i.get(t)?.key);
		this.orders.set(e, u ? null : c), this.store.write(e, xh, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function Eh(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function Dh(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(dh) || t.querySelector(dh) !== null)) return !0;
	return !1;
}
function Oh(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function kh(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Ah(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function jh(e) {
	for (let t of e.querySelectorAll(`[${_t}]`)) t.removeAttribute(_t);
}
function Mh(e) {
	return e.hideBelow !== null && pf.indexOf(hf()) < pf.indexOf(e.hideBelow);
}
function Nh(e) {
	return e !== null && pf.includes(e);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var I = { ok: !1 };
function Ph(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => Yt(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
	for (; l < i.length;) {
		let t = i[l];
		if (t === ".") {
			if (u) return I;
			u = !0, l++;
			continue;
		}
		if (t === "[") {
			if (l + 1 >= i.length || i[l + 1] !== "]" || c >= a.length) return I;
			let t = a[c];
			if (c++, Yt(t.kind) === "Dynamic") {
				let n = Ih(e, t.componentId);
				if (!n.ok) return I;
				o = n.value, s = !0;
			} else {
				if (!s) return I;
				let e = Hh(o, t.value);
				if (!e.ok) return I;
				o = e.value;
			}
			l += 2, u = !1;
			continue;
		}
		let n = l;
		for (; l < i.length && i[l] !== "." && i[l] !== "[";) l++;
		if (l === n) return I;
		if (s) {
			let e = Rh(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? I : {
		ok: !0,
		value: o
	};
}
var Fh = /* @__PURE__ */ new Set();
function Ih(e, t) {
	let n = v(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Fh.has(n) || (Fh.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), I;
}
function Lh(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Rh(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Rh(e, t) {
	if (e == null) return I;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return I;
	let n = e, r = zh(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : I;
}
function zh(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Bh(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Bh(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Vh(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Yt(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Yt(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = v(e.componentId);
			continue;
		}
		let l = c;
		for (; c < t.length && t[c] !== "." && t[c] !== "[";) c++;
		let u = t.slice(l, c);
		r.push({
			kind: "property",
			name: u
		}), a || i.push(u);
	}
	return {
		steps: r,
		ruleSegments: i,
		scopeComponentId: o
	};
}
function Hh(e, t) {
	if (e == null || t == null) return I;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : I;
	if (typeof t != "string") return I;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Wh(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return I;
}
function Uh(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Wh(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Wh(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Gh(e) {
	let t = e.closest(Ht)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function Kh(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Gh(e);
	if (a === void 0 && o === null) {
		for (let t of w(e)) t.classList.remove(qi);
		return;
	}
	for (let n of w(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(qi);
			continue;
		}
		n.classList.toggle(qi, !qh(a, e, i, o));
	}
}
function qh(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Qh(e, t, n)) && (r?.filters ?? []).every((e) => fr(Lh(t, e.itemProperty), e.operator, e.value));
}
function Jh(e, t, n = null) {
	return (e?.filters ?? []).some((e) => $h(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Yh(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => $h(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Xh(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Zh(n.getItemValue(e), n.getItemValue(r), t));
}
function Zh(e, t, n) {
	for (let r of n) {
		let n = eg(Lh(e, r.itemProperty), Lh(t, r.itemProperty));
		if (n !== 0) return en(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Qh(e, t, n) {
	if (!$h(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return fr(Lh(t, e.itemProperty), e.operator, r);
}
function $h(e, t, n, r) {
	return e == null || fr(r.get(e, []), t, n);
}
function eg(e, t) {
	if (e === t) return 0;
	let n = ng(e), r = ng(t);
	if (n !== r) return n - r;
	if (n === tg.Nothing) return 0;
	if (n === tg.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var tg = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function ng(e) {
	return e == null ? tg.Nothing : typeof e == "number" ? Number.isNaN(e) ? tg.Nothing : tg.Number : typeof e == "string" && e.trim().length === 0 ? tg.Nothing : Number.isNaN(Number(e)) ? tg.Text : tg.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function rg(e) {
	switch (e.getAttribute(Ne)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
var ig = "bottom";
function ag(e, t, n) {
	let r = e.querySelector(`:scope > [${Re}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Re, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function og(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var sg = /* @__PURE__ */ new WeakMap();
function cg(e, t) {
	let n = sg.get(e), r = n === void 0 ? [...t] : lg(n, t);
	return sg.set(e, r), r;
}
function lg(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function ug(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function dg(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function fg(e, t, n) {
	return dg(e, t), ug(e, t, n);
}
function pg(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function mg(e) {
	sg.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var hg = /* @__PURE__ */ new WeakMap();
function gg(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.remove();
}
function _g(e, t, n, r, i, a) {
	let o = rg(e) === "windowed", s = w(e), c = o ? s : cg(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : Yh(f, a, Gh(e));
	if (u && !d && gg(e), c.length === 0) {
		hg.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Yi(e);
	if (!d) {
		og(e, [...Xh(c, p, r), ...Ji(ee)]);
		return;
	}
	gg(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (hg.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	hg.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = Xh(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = vg(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	og(e, [...re, ...Ji(ee)]);
}
function vg(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(Ae, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var yg = "ui-tree-rules", bg = "ui-tree";
function xg(e, t, n) {
	if (e.parentElement?.classList.contains(bg) === !0) {
		e.dispatchEvent(new Event(yg, { bubbles: !0 }));
		return;
	}
	switch (rg(e)) {
		case "windowed":
			Xi(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Kh(e, t, n.metadata, n.renderer, n.state), Xi(e, t, n.templates, n.renderer), _g(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
function Sg(e, t, n, r, i, a = []) {
	Cg(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Cg(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var wg = ".ui-items-view, .ui-table", Tg = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Eg = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${pa})[${Mt}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), C(this.root, pa, {
			childList: !0,
			attributeFilter: [
				Mt,
				Pt,
				g
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		ba(e, this.ownItems(e));
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(ma), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || r.matches(".ui-disabled") ? null : ao(e.target, n) === null && !ia(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleClick(e) {
		let t = this.resolveRow(e, pa);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		sa(n, i, r), n.focus({ preventScroll: !0 }), !n.hasAttribute("data-ui-no-row-select") && Sa(n, i, r, va(e)) && e.preventDefault();
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, wg);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), la(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(ma);
		if (t !== null && ao(e.target, t) !== null) return;
		let n = e.target.closest(pa);
		if (n === null || !n.matches(wg) || n.matches(".ui-disabled")) return;
		let r = n.matches(".ui-orientation--horizontal") ? "both" : "vertical";
		if (!Tg.has(e.key) && !Qi(e.key, r)) return;
		let i = this.ownItems(n), a = oa(i), o = ca(e.key, i, a, r);
		if (o !== null) {
			e.preventDefault(), sa(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && _a(n, a), Sa(n, i, o, va(e)));
			return;
		}
		if (!(a === null || ia(a))) {
			switch (e.key) {
				case " ":
					if (!Sa(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					xa(i).includes(a) || Sa(n, i, a, ha), la(a, "open");
					break;
				case "Delete": {
					let e = Dg(i, a);
					if (e.length === 0) return;
					for (let t of e) la(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return Co(e, ma, pa);
	}
};
function Dg(e, t) {
	let n = xa(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute(pe));
}
//#endregion
//#region src/interactions/tree-engine.ts
var L = "ui-tree", Og = "ui-tree__row", kg = "ui-tree__row--folded", Ag = "ui-tree__row--filtered", jg = "fold-hidden", Mg = "fold-shown", Ng = "ui-tree__row--dragging", Pg = "ui-tree__loading", Fg = "ui-tree__loading-ring", Ig = "ui-tree-node", Lg = "ui-tree-node__text", Rg = "ui-tree-node__toggle", zg = "ui-tree-node__rename", Bg = ".ui-text__title", Vg = "data-ui-tree-drop", Hg = "--ui-tree-depth", Ug = "expanded", Wg = 600, Gg = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Kg = class {
	root;
	store = new jd();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(yg, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${L}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(v(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => R(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${L}`)), C(this.root, `.${L}`, {
			childList: !0,
			attributeFilter: [
				yt,
				bt,
				xt,
				Et
			],
			relevant: Jg
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Et), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Zg(e)?.getAttribute(yt);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = R(e), r = Zg(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(bt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(Hg, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(kg, !d), e.classList.toggle(Ag, re), e.removeAttribute(Tt), e.draggable = i && !e.hasAttribute("data-ui-undraggable"), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Ct), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Ct, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Ct), d && ne && !re), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: ne,
				authoredShown: te
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return Zg(e.row)?.hasAttribute(xt) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Og}[${m}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, jg, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, Mg, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Tt]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = On(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Gh(t);
		if (r === void 0 && i === null) return null;
		let a = Yh(r, this.rules.state, i), o = Jh(r, this.rules.state, i);
		return o || a.length > 0 ? {
			config: r,
			query: i,
			filtering: o,
			sorts: a
		} : null;
	}
	orderRows(e, t) {
		let n = this.rowsOf(e);
		if (t.sorts.length === 0 || this.rules === void 0) return n;
		let r = this.rules.renderer, i = new Set(n.map(R)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Zg(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Zh(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(R(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Pg}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = R(o), c = i.getItemValue(o);
			if (c === void 0 || qh(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Zg(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Pg) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Yg();
		o.style.setProperty(Hg, String(t)), o.classList.toggle(kg, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Rg}`) === null && (!r.hasAttribute("data-ui-unselectable") || ao(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || ao(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Og}`), n = t?.closest(`.${L}`) ?? null;
		return t === null || n === null || t.closest(`.${L}`) !== n || ia(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Og}`);
		if (t !== null && ao(e.target, t) !== null) return;
		let n = e.target.closest(`.${L}`);
		if (n === null || n.matches(".ui-disabled") || !Gg.has(e.key) && !Qi(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = oa(r), a = ca(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, va(e));
			return;
		}
		if (!(i === null || ia(i))) {
			switch (e.key) {
				case " ":
					if (!Sa(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, ca("ArrowDown", r, i, "vertical"), ha);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), ha);
					break;
				case "Enter":
					xa(r).includes(i) || Sa(n, r, i, ha), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = Dg(r, i);
					if (e.length === 0) return;
					for (let t of e) t.dispatchEvent(new Event("remove", { bubbles: !0 }));
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = Xg(e), n = t?.closest(`.${L}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		let r = t.hasAttribute("data-ui-selected") ? xa(this.rowsOf(n)).filter((e) => e !== t && e.draggable && e.getClientRects().length > 0) : [];
		Sg(e, n, t, Ng, R(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Ng));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Og}`), a = i !== null && i.closest(`.${L}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (n.some((t) => t === a || qg(e, R(a), R(t)))) return;
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Wg)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Vg}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Og) ? R(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && qg(a, R(e), R(t))));
		this.markDrop(t, null), this.springOpen(t, null), Cg(t, Ng), r.classList.contains(Og) && this.expand(t, r);
		for (let e of o) {
			let t = Zg(e)?.querySelector(`.${Lg}`) ?? null;
			t !== null && (t.setAttribute(wt, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = Xg(e)?.closest(`.${L}`) ?? null;
		t !== null && (Cg(t, Ng), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Vg}]`)) n !== t && n.removeAttribute(Vg);
		t?.setAttribute(Vg, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(R(n), Zg(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = R(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n, this.store.writeJson(e, Ug, i), this.layout(e);
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, Ug) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = oa(r);
		sa(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && _a(e, i), Sa(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Zg(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => R(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${L}`), n = Zg(e), r = n?.querySelector(Bg) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), $u({
			container: n,
			title: r,
			className: zg,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(St, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Og) && n.push(e);
		return n;
	}
};
function qg(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Jg(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(Og) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(L) === !0);
}
function Yg() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Pg, e.setAttribute("aria-hidden", "true"), t.className = Fg, e.append(t, x.text("ui.tree.loading")), e;
}
function Xg(e) {
	return e.target instanceof Element ? e.target.closest(`.${Og}`) : null;
}
function R(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function Zg(e) {
	return e.querySelector(`.${Ig}`);
}
var Qg = "tabs:rename", $g = "tabs:pin", e_ = "tabs:unpin", t_ = "tabs:close", n_ = "tabs:delete";
function r_(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function i_(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[Qg, e.rename && t.renamable],
		[$g, e.pin && !t.pinned],
		[e_, e.pin && t.pinned],
		[t_, e.close && !e.delete && n],
		[n_, e.delete && n]
	]);
}
function a_(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function o_(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, s_(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function s_(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function c_(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var z = "ui-tabs-view", l_ = "ui-tab-item", u_ = "ui-tab-item__label", d_ = "ui-tab-item__close", f_ = "ui-tab-item__rename", p_ = "ui-tab-item__caption", m_ = "ui-tab-item__pin", h_ = ".ui-text__title", g_ = "ui-tab-item--dragging", __ = "ui-tab-item__caption--overflowed", v_ = "ui-tabs-view--overflowing", y_ = "ui-tabs-view--no-overflow", b_ = "ui-tab-item__page", x_ = "ui-tab-item--selected", S_ = ".ui-menu-item", C_ = "tab-menu-entry", w_ = {
	name: C_,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, T_ = "--ui-tabs-view-strip", E_ = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Rp({
			rootClass: z,
			overflowingClass: v_,
			wrapsClass: y_,
			hiddenClass: __,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(v(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => V(e) === t.key))?.querySelector(`.${u_}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Gu, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), C(this.root, `.${z}`, {
			childList: !0,
			attributeFilter: [
				It,
				ge,
				...Bt
			],
			relevant: (e) => !Zr(e, `.${b_}`, `.${z}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${z}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Mp);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => V(e) === r)) {
			this.select(e, V(n[0]));
			return;
		}
		let i = e.hasAttribute(ge), a = [], o = null, s = null;
		for (let e of t) {
			let t = V(e) === r;
			e.classList.toggle(x_, t);
			let c = e.querySelector(`.${p_}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${u_}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${b_}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${b_}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${u_}`);
			t === null || e.classList.contains(__) || (c.push(t), e === o && (l = t));
		}
		T(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Mp(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(T_, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Np}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => V(e) === t)?.querySelector(`.${u_}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Mp).map((e) => ({
				key: V(e),
				title: e.querySelector(`.${u_}`)?.textContent?.trim() ?? V(e),
				current: V(e) === t
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${l_}`);
		if (n === null || !n.classList.contains(z) || r === null || r.closest(`.${z}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = k_(n, r), a = j_(t), o = a.map((e) => {
			if (A_(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Mp(e) ? "shown" : "hidden";
		});
		if (a_(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: V(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${ve}="tab"]`), n = t?.parentElement ?? null, r = e.closest(S_);
		if (t === null || n === null || !n.classList.contains(z) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => V(e) === a.key);
		if (i.length === 0 || r.matches(`${it}, ${rt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(C_, {
			bubbles: !0,
			detail: { keys: [i, V(o)] }
		})), !0;
		if (k_(n, o).get(i) !== !0) return !0;
		switch (i) {
			case Qg: {
				let e = o.querySelector(`.${u_}`);
				e !== null && this.startRename(e);
				break;
			}
			case $g:
			case e_:
				this.setPinned(n, o, i === $g);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${p_} > .${m_}`);
		t.toggleAttribute(zt, n), r !== null && (r.toggleAttribute(zt, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = c_(a.map(P_));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? B(a[a.length - 1]).after(B(t)) : B(s).before(B(t)), N_([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Np}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(z)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${u_}`), i = r?.closest(`.${z}`) ?? null;
		if (r === null || i === null || r.matches(":disabled, .ui-disabled")) return;
		let a = r.closest(`.${l_}`);
		a !== null && a.closest(`.${z}`) === i && (e.preventDefault(), this.select(i, V(a)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${d_}`), r = n?.closest(`.${l_}`) ?? null, i = r?.closest(`.${z}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), O_(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${u_}`), n = t?.closest(`.${z}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(h_) ?? e, r = e.closest(`.${l_}`);
		t === null || r === null || B(r).hasAttribute("data-ui-unrenamable") || $u({
			container: t,
			title: n,
			className: f_,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Rt, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => e.focus()
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${u_}`), n = t?.closest(`.${z}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${u_}`)).filter((e) => e !== null), i = Zi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${l_}`);
		a !== null && this.select(n, V(a)), i.focus();
	}
	handleDragStart(e) {
		let t = M_(e);
		if (t === null) return;
		if (B(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Sg(e, t.closest(`.${z}`) ?? t, t, g_, V(t));
		let n = B(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${p_}`)?.closest(`.${l_}`) ?? null, n = t?.closest(`.${z}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${g_}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${p_}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = B(r), o = t.hasAttribute("data-ui-tab-pinned") ? D_(n, a) : null, s = o ?? B(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && t.querySelector(`.${g_}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = M_(e);
		if (t === null) return;
		t.classList.remove(g_);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(B(t), n.next);
			return;
		}
		let r = B(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${z}`);
		if (i === null) return;
		let a = this.ownItems(i);
		N_(a, a.indexOf(t));
	}
	select(e, t) {
		da(e, t, {
			attribute: It,
			bindingAttribute: Ft,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Co(e, `.${l_}`, `.${z}`);
	}
};
function D_(e, t) {
	let n = null;
	for (let r of Co(e, `.${l_}`, `.${z}`)) {
		let e = B(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function O_(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !B(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function k_(e, t) {
	return i_(r_(e.getAttribute(_e)), {
		pinned: t.hasAttribute(zt),
		renamable: !B(t).hasAttribute(me),
		removable: e.hasAttribute("data-ui-tabs-removes") && O_(e, t)
	});
}
function A_(e) {
	let t = e.getAttribute(m);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function j_(e) {
	let t = e.querySelector(`[${h}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function B(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function M_(e) {
	return e.target instanceof Element ? e.target.closest(`.${p_}`)?.closest(`.${l_}`) ?? null : null;
}
function N_(e, t) {
	for (let [n, r] of o_(e.map(P_), t)) e[n].setAttribute(Lt, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function P_(e) {
	return {
		order: F_(e),
		pinned: e.hasAttribute(zt)
	};
}
function F_(e) {
	let t = e.getAttribute(Lt);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function V(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var I_ = "button.ui-text__fold-toggle", L_ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(I_);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, R_ = "ui-temporal-input__segments", z_ = "ui-temporal-input__segment", B_ = "ui-temporal-input__segment-literal", V_ = "ui-temporal-input__segment--empty", H_ = "data-ui-temporal-segment", U_ = "data-ui-temporal-step-direction", W_ = "data-ui-temporal-readonly", G_ = "data-ui-temporal-segments-of", K_ = "--", q_ = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(En(e.components, `.${O}`));
		}), C(this.root, `.${O}`, { attributeFilter: [...cl] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) ul(t) === "time" && (Cl(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${R_}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = dl(e), r = ml(e), i = k(e, _l(t));
		t.getAttribute(G_) !== n && (t.replaceChildren(...J_(n).map((e) => X_(e))), t.setAttribute(G_, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(H_);
			if (t === null) {
				n.textContent = Q_(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = $_(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(V_, i === null), n.tabIndex = e.hasAttribute(W_) ? -1 : 0, ev(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = nv(e.target);
		if (t === null) return;
		let n = t.closest(`.${O}`), r = t.getAttribute(H_), i = tv(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), iv(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), xl(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = av(e.key, ml(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = nv(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = nv(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Ll(this.wheelTurn, e.deltaY, e.deltaMode === WheelEvent.DOM_DELTA_PIXEL);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${O}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(H_), n < 0 ? 1 : -1, tv(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${U_}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${U_}]`);
		if (t === null) return;
		let n = t.closest(`.${O}`);
		if (n === null || n.hasAttribute(W_)) return;
		e.preventDefault();
		let r = rv(n) ?? n.querySelector(`.${z_}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(H_), t.getAttribute(U_) === "up" ? 1 : -1, tv(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${z_}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${O}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = k(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = ov(t), o = pl(fl(e), a) * n, s = a === "hour" ? 24 : 60, c = ((sv(i, a) + o) % s + s) % s;
		this.write(e, cv(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? cv(t, "hour", lv(l, t.getHours() >= 12)) : cv(t, ov(n), l), i);
		}
		u && iv(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, cv(r, "hour", lv(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return k(e, t) ?? Tl(e);
	}
	write(e, t, n) {
		xl(e, El(e, t), n), Sl(e), this.applySegments(e);
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
function J_(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Gc(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(Y_(r)), n += r.length;
	}
	return t;
}
function Y_(e) {
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
function X_(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = B_, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = z_, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(H_, e.unit), t.dataset.width = String(e.width), Z_(t, e.unit), t;
}
function Z_(e, t) {
	if (t === "meridiem") {
		e.setAttribute("aria-label", x.text("ui.picker.meridiem"));
		return;
	}
	let n = ov(t);
	e.setAttribute("aria-label", x.text(n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds")), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function Q_(e, t, n, r) {
	return t && n !== null ? Uc(n, e, r) : e;
}
function $_(e, t, n, r) {
	if (n === null) return K_;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : sv(n, ov(e));
	return String(i).padStart(t, "0");
}
function ev(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let r = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? r % 12 == 0 ? 12 : r % 12 : sv(n, ov(t))));
}
function tv(e) {
	return _l(e.closest(`.${R_}`));
}
function nv(e) {
	let t = e instanceof Element ? e.closest(`.${z_}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${O}`);
	return n === null || n.hasAttribute(W_) ? null : t;
}
function rv(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${z_}`) : null;
}
function iv(e, t, n) {
	Zi({
		key: n,
		items: [...e.querySelectorAll(`.${z_}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function av(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function ov(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function sv(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function cv(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function lv(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var uv = "data-ui-scroll-anchor", dv = "End", fv = 4, pv = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), C(this.root, `[${uv}="${dv}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ge]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !mv(t) || this.pinned.set(t, gv(t) && !hv(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${uv}="${dv}"]`));
	}
	followEach(e) {
		for (let t of e) if (this.pinned.get(t) !== !1) {
			if (hv(t)) {
				this.pinned.set(t, !1);
				continue;
			}
			this.pinned.set(t, !0), gv(t) || (t.scrollTop = t.scrollHeight);
		}
	}
};
function mv(e) {
	return e.getAttribute(uv) === dv;
}
function hv(e) {
	return e.getAttribute(Ue)?.toLowerCase() === "true";
}
function gv(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= fv;
}
//#endregion
//#region src/items/items-viewport.ts
function _v(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function vv(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${h}][${Pe}]`) : null;
}
function yv(e) {
	let t = _v(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - xv(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function bv(e, t) {
	let n = _v(e);
	n.scrollTop = n === e ? t : t + xv(e, n);
}
function xv(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function Sv(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = wv(e, a, n), s = wv(e, a + 1, n);
	return Tv(t, o.top, s.top, o.line, s.line);
}
function Cv(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = wv(e, a, n), s = wv(e, a + 1, n);
	return Tv(t, o.line, s.line, o.top, s.top);
}
function wv(e, t, n) {
	return t < 0 ? {
		line: 1,
		top: 0
	} : t >= e.count ? {
		line: n,
		top: e.scrollHeight
	} : {
		line: e.line(t),
		top: e.top(t)
	};
}
function Tv(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var Ev = 250, Dv = class {
	root;
	driven = /* @__PURE__ */ new WeakMap();
	viewports = /* @__PURE__ */ new WeakMap();
	members = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	handleScroll(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = this.driven.get(t);
		if (n !== void 0 && (this.driven.delete(t), Math.abs(t.scrollTop - n) <= 1)) return;
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Fe);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < Ev && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Fe}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Fe}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = Ov(e, "data-ui-scroll-viewport") ?? kv(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? jv(e) : null, a = i === null ? null : jv(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Cv(a, Sv(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? Av(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function Ov(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function kv(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : Ov(e, h);
	return t === null ? null : _v(t);
}
function Av(e, t) {
	return t > 0 ? e / t : 0;
}
function jv(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Ie}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Le}]`);
	if (i.length === 0) return null;
	let a = (e) => Number.parseInt(i[e].getAttribute("data-ui-source-line") ?? "1", 10) || 1;
	return {
		count: i.length,
		line: a,
		top: (e) => n(i[e]),
		endLine: a(i.length - 1) + 1,
		scrollHeight: e.scrollHeight
	};
}
//#endregion
//#region src/interactions/press-ripple-engine.ts
var Mv = ".ui-button, .ui-action, .ui-menu-item", Nv = at, Pv = "ui-pressing", Fv = "--ui-press-x", Iv = "--ui-press-y", Lv = 250, Rv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Mv);
		if (t === null || t.matches(":disabled, .ui-disabled, [inert]") || t.matches(Nv)) return;
		let n = t.getBoundingClientRect();
		t.style.setProperty(Fv, `${e.clientX - n.left}px`), t.style.setProperty(Iv, `${e.clientY - n.top}px`), t.classList.remove(Pv), t.offsetWidth, t.classList.add(Pv), window.setTimeout(() => t.classList.remove(Pv), Lv);
	}
}, zv = "mask:", Bv = "ui-icon--image";
function Vv(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(zv) && (n = !0, t = t.slice(5).trim()), Hv(t) ? {
		source: t,
		tinted: n
	} : null;
}
function Hv(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function Uv(e) {
	let t = Vv(e);
	return t === null ? "" : Wv(t.source);
}
function Wv(e) {
	let t = "";
	for (let n of e) {
		let e = n.codePointAt(0) ?? 0;
		if (e < 32 || e === 127 || n === " ") {
			t += "%20";
			continue;
		}
		switch (n) {
			case "\"":
				t += "%22";
				break;
			case "'":
				t += "%27";
				break;
			case "\\":
				t += "%5C";
				break;
			case "(":
				t += "%28";
				break;
			case ")":
				t += "%29";
				break;
			case "<":
				t += "%3C";
				break;
			case ">":
				t += "%3E";
				break;
			default: t += n;
		}
	}
	return `url("${t}")`;
}
var Gv = "ui-icon", Kv = "data-ui-icon";
function qv(e, t) {
	let n = String(t ?? "").trim();
	e.classList.add(Gv);
	for (let t of Array.from(e.classList)) Yv(t) && e.classList.remove(t);
	if ((e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url"), n.length === 0) {
		e.removeAttribute(Kv);
		return;
	}
	e.setAttribute(Kv, "");
	let r = Vv(n);
	if (r === null) {
		e.classList.add(Xv(n));
		return;
	}
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", Wv(r.source)), r.tinted || e.classList.add(Bv);
}
var Jv = "ui-icon-glyph--";
function Yv(e) {
	return e === "ui-icon--image" || e.startsWith(Jv);
}
function Xv(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Jv;
	for (let e of t) {
		let t = e.charCodeAt(0);
		if (t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122) {
			n += e.toLowerCase();
			continue;
		}
		(e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/url-safety.ts
var Zv = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Qv(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Zv.includes(t.slice(0, n).toLowerCase());
}
function $v(e) {
	return Qv(e) ? String(e) : void 0;
}
function ey(e) {
	return typeof e != "string" || !e.startsWith("/") || /[\x00-\x1f\x7f]/.test(e) ? !1 : e.length === 1 || e[1] !== "/" && e[1] !== "\\";
}
function ty(e) {
	let t = String(e ?? "").trim();
	return Hv(t) ? t : void 0;
}
//#endregion
//#region src/rendering/inline-markup.ts
var H = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, ny = "\\", ry = "`", iy = "!", ay = "{", oy = "}", sy = "ui-text__fold", cy = "ui-text__fold-toggle", ly = "ui-text__fold-content", uy = 8;
function dy(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Sy(new jy(e), 0, e.length, H.None, null, t, n), Cy(t, n, H.None, null), t;
}
function fy(e) {
	return dy(e).map((e) => gy(e) ? `${e.fold} ${fy(e.text)}` : e.text).join("");
}
function py(e, t, n = {}) {
	let r = dy(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && my(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(_y(r, n));
}
function my(e) {
	return e.styles === H.None && e.url === null && !hy(e) && !gy(e);
}
function hy(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function gy(e) {
	return e.fold !== null && e.fold !== void 0;
}
function _y(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(vy(r, t));
	return n;
}
function vy(e, t) {
	if (hy(e)) return by(e.icon);
	let n = gy(e) ? yy(e, t) : document.createTextNode(e.text);
	if ((e.styles & H.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & H.Strikethrough) !== 0 && (n = xy("s", n)), (e.styles & H.Underline) !== 0 && (n = xy("u", n)), (e.styles & H.Italic) !== 0 && (n = xy("em", n)), (e.styles & H.Bold) !== 0 && (n = xy("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Py(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function yy(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${sy} ${sy}--static` : sy, r.className = cy, r.textContent = e.fold ?? "", i.className = ly, i.append(_y(dy(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ce, ""), n.append(r, i), n);
}
function by(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", qv(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function xy(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Sy(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === ny && c + 1 < n && Fy(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = wy(e, c, n);
		if (l !== null) {
			Cy(a, o, r, i), Ty(s, c + 1, l, o), Cy(a, o, r | H.Code, i), c = l + 1;
			continue;
		}
		let u = Oy(e, c, n);
		if (u !== null) {
			Cy(a, o, r, i), Sy(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Cy(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Ey(e, c, n);
		if (d !== null) {
			Cy(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? ky(e, c, n) : null;
		if (f !== null) {
			Cy(a, o, r, i), Sy(e, f.labelStart, f.labelEnd, r, f.url, a, o), Cy(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Ay(e, c, n);
		if (p !== null) {
			Cy(a, o, r, i), a.push({
				text: s.slice(p.contentStart, p.contentEnd),
				styles: r,
				url: i,
				fold: p.caption
			}), c = p.contentEnd + 1;
			continue;
		}
		o.value += t, c++;
	}
}
function Cy(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function wy(e, t, n) {
	let r = e.text;
	if (r[t] !== ry) return null;
	let i = t + 1;
	if (i >= n || Iy(r[i])) return null;
	let a = e.findClosingMarker(i, n, ry, 1);
	return a > i ? a : null;
}
function Ty(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === ny && i + 1 < n && Fy(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Ey(e, t, n) {
	let r = e.text;
	if (r[t] !== iy || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Dy(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Dy(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Oy(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = H.Bold, s = 2;
	else if (i === "*") o = H.Italic, s = 1;
	else if (i === "_" && a) o = H.Underline, s = 2;
	else if (i === "~" && a) o = H.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Iy(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function ky(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i < 0 || i + 1 >= n || r[i + 1] !== "(") return null;
	let a = e.findClosingParen(i + 2, n);
	if (a < 0) return null;
	let o = e.readLinkUrl(i, a);
	if (o === null) return null;
	let s = t + 1, c = i;
	return c > s ? {
		labelStart: s,
		labelEnd: c,
		url: o,
		linkEnd: a + 1
	} : null;
}
function Ay(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== ay || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > uy) return null;
	let c = { value: "" };
	return Ty(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var jy = class {
	text;
	escaped = null;
	closeBrackets = null;
	openBrackets = null;
	closeParens = null;
	braceMatches = null;
	braceDepths = null;
	closers = [
		null,
		null,
		null,
		null,
		null
	];
	linkLabel = -1;
	linkUrl = null;
	constructor(e) {
		this.text = e;
	}
	findClosingBracket(e, t) {
		return this.closeBrackets ??= this.next("]", !0), My(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), My(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), My(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return My(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Ny(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Iy(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Qv(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === ny && e[t - 1] === 0);
			this.escaped = e;
		}
		return this.escaped[e] === 1;
	}
	next(e, t) {
		let n = new Int32Array(this.text.length + 1);
		n[this.text.length] = -1;
		for (let r = this.text.length - 1; r >= 0; r--) n[r] = this.text[r] === e && (!t || !this.isEscaped(r)) ? r : n[r + 1];
		return n;
	}
	braces() {
		if (this.braceMatches !== null) return this.braceMatches;
		let e = new Int32Array(this.text.length).fill(-1), t = new Int32Array(this.text.length), n = [];
		for (let r = 0; r < this.text.length; r++) if (!this.isEscaped(r)) {
			if (this.text[r] === ay) n.push(r);
			else if (this.text[r] === oy && n.length > 0) {
				let i = n.pop();
				if (e[i] = r, t[i]++, n.length > 0) {
					let e = n[n.length - 1];
					t[e] = Math.max(t[e], t[i]);
				}
			}
		}
		return this.braceDepths = t, this.braceMatches = e, e;
	}
	buildClosers(e, t) {
		let n = new Int32Array(this.text.length + 1);
		n[this.text.length] = -1;
		for (let r = this.text.length - 1; r >= 0; r--) n[r] = this.isCloser(r, e, t) ? r : n[r + 1];
		return n;
	}
	isCloser(e, t, n) {
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Iy(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function My(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Ny(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Py(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function Fy(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === ay || e === oy || e === ry || e === ny;
}
function Iy(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Ly = "data-ui-tooltip", Ry = "data-ui-tooltip-placement", zy = "data-ui-tooltip-mark", By = "ui-tooltip", Vy = "ui-tooltip--visible", Hy = "[aria-haspopup][aria-expanded=\"true\"]", Uy = "top", Wy = 250, Gy = 200, Ky = 300, qy = 7, U = null, W = null, Jy = null, Yy = 0, Xy = 0, Zy = 0, Qy = !1;
function $y(e = document) {
	if (Qy) return;
	Qy = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", eb, !0), t.addEventListener("pointerout", nb, !0), t.addEventListener("focusin", rb, !0), t.addEventListener("focusout", ib, !0), t.addEventListener("keydown", ab, !0), t.addEventListener("scroll", tb, !0), t.addEventListener("pointerdown", (e) => {
		Jy === null && !ob(e.target) && _b(!0);
	}, !0), window.addEventListener("blur", () => {
		Jy = null, _b(!0);
	});
}
function eb(e) {
	if (tb(), ob(e.target)) {
		window.clearTimeout(Xy);
		return;
	}
	let t = sb(e.target);
	t !== null && t !== W && cb(t);
}
function tb() {
	W === null || W.isConnected || (Jy = null, _b(!0));
}
function nb(e) {
	if (Jy !== null) return;
	let t = e.relatedTarget;
	t instanceof Node && (W !== null && W.contains(t) || ob(t)) || (ob(e.target) || sb(e.target) === W) && _b(!1);
}
function rb(e) {
	let t = sb(e.target);
	t !== null && (Jy = e.target instanceof Element && e.target.closest(`[${zy}]`) !== null ? t : null, lb(t));
}
function ib(e) {
	sb(e.target) === W && (Jy = null, _b(!0));
}
function ab(e) {
	e.key === "Escape" && W !== null && (Jy = null, _b(!0));
}
function ob(e) {
	return U !== null && e instanceof Node && U.contains(e);
}
function sb(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Ly}], [${zy}]`);
	if (t === null) return null;
	let n = t.hasAttribute(Ly) ? t : t.querySelector(`[${Ly}]`);
	return n === null ? null : (n.getAttribute(Ly) ?? "").trim().length > 0 ? n : null;
}
function cb(e) {
	if (Jy === null) {
		if (window.clearTimeout(Xy), window.clearTimeout(Yy), W !== null) {
			_b(!0), lb(e);
			return;
		}
		if (Date.now() - Zy < Ky) {
			lb(e);
			return;
		}
		Yy = window.setTimeout(() => lb(e), Wy);
	}
}
function lb(e, t) {
	let n = (t ?? e.getAttribute(Ly) ?? "").trim();
	if (n.length === 0 || !e.isConnected || ub(e)) return;
	window.clearTimeout(Yy), window.clearTimeout(Xy), W !== null && W !== e && W.removeAttribute("aria-describedby");
	let r = vb();
	py(r, n, { staticFolds: !0 }), r.classList.add(Vy), W = e, e.setAttribute("aria-describedby", r.id), r.setAttribute("data-ui-tooltip-text", fy(n)), Or(e, r, {
		placement: gb(e),
		gap: qy,
		arrow: !0
	});
}
function ub(e) {
	return e.matches(Hy) || e.querySelector(Hy) !== null;
}
function db(e, t) {
	lb(e, t);
}
function fb() {
	_b(!0);
}
var pb = {
	show: db,
	hide: fb
};
function mb(e) {
	Jy = e, lb(e);
}
function hb(e) {
	if (W === e) {
		if ((e.getAttribute(Ly) ?? "").trim().length === 0) {
			Jy = null, _b(!0);
			return;
		}
		lb(e);
	}
}
function gb(e) {
	let t = e.getAttribute(Ry);
	return t !== null && Sr(t) ? t : Uy;
}
function _b(e) {
	window.clearTimeout(Yy), window.clearTimeout(Xy);
	let t = () => {
		W !== null && (W.removeAttribute("aria-describedby"), W = null, U !== null && (U.classList.remove(Vy), Nr(U)), Zy = Date.now());
	};
	e ? t() : Xy = window.setTimeout(t, Gy);
}
function vb() {
	return U !== null && U.isConnected ? U : (U = document.createElement("div"), U.id = "ui-tooltip", U.className = By, U.setAttribute("role", "tooltip"), U.setAttribute("aria-hidden", "true"), document.body.append(U), U);
}
//#endregion
//#region src/interactions/popup-service.ts
var yb = /* @__PURE__ */ new Map();
new oi({
	openPopups: () => bb(),
	close: (e, t) => xb(e, t),
	isInside: (e, t) => {
		let n = yb.get(e);
		return t.includes(e) || n !== void 0 && t.includes(n.anchor);
	},
	onPress: !0
});
function bb() {
	let e = [];
	for (let t of [...yb.keys()]) t.isConnected ? e.push(t) : Sb(t);
	return e;
}
function xb(e, t) {
	let n = yb.get(e);
	n !== void 0 && (Sb(e), n.options.onDismiss(t));
}
function Sb(e) {
	yb.delete(e), Nr(e);
}
var Cb = { open(e, t, n) {
	return yb.set(t, {
		anchor: e,
		options: n
	}), Or(e, t, n), {
		reposition: () => Or(e, t, n),
		close: () => Sb(t)
	};
} };
//#endregion
//#region src/items/item-rows.ts
function wb(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Lh,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		}
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var Tb = class {
	metadata;
	templates;
	extensions;
	operations;
	state;
	itemStackByRoot = /* @__PURE__ */ new WeakMap();
	unresolved = /* @__PURE__ */ new Set();
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? Db(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), Ob(l, n, t);
		let u = c?.rowDecorator ?? null;
		return u !== null && u.length > 0 && this.decorateRow(u, l, t, n, e, r), l;
	}
	decorateRow(e, t, n, r, i, a) {
		let o = this.extensions.rowDecorators.get(e);
		if (o === void 0) {
			s("row decorator is not registered.", {
				kind: e,
				componentId: i
			});
			return;
		}
		o({
			row: t,
			item: n,
			key: r,
			componentId: i,
			ancestors: a,
			templates: this.templates,
			renderer: this
		});
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
		let i = Eb(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: b(r),
			item: t
		};
		return this.itemStackByRoot.set(r, i), this.populateBoundElements(r, [...n, i]), r;
	}
	populateElement(e, t, n, r) {
		this.populateBoundElements(e, [...r, {
			scopeComponentId: n,
			item: t
		}]);
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
		if (n === void 0) return null;
		let r = Mb(t, n.templateKeyPropertyName);
		return r !== null && this.templates.getVariantTemplate(e, r) !== void 0 ? r : n.fallbackTemplateKey ?? null;
	}
	populateBoundElements(e, t) {
		let n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
		for (let r = e; r !== null; r = n.nextNode()) {
			if (!(r instanceof Element)) continue;
			let e = r.attributes;
			for (let n = 0; n < e.length; n++) {
				let i = e[n];
				i.name.startsWith("data-ui-bind-") && this.applyBoundAttribute(r, i.value, t);
			}
		}
	}
	applyBoundAttribute(e, t, n) {
		let r = Number(t);
		if (!Number.isInteger(r) || r <= 0) return;
		let i = this.metadata.getBindingById(r), a = i === void 0 ? void 0 : this.metadata.getPropertyDefinition(i.propertyId);
		if (i === void 0 || a === void 0) return;
		let o = i.itemTemplate === null || i.itemTemplate === void 0 ? this.state.has(i, []) ? {
			ok: !0,
			value: this.state.get(i, [])
		} : { ok: !1 } : Ph(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			i.optional !== !0 && !this.unresolved.has(r) && (this.unresolved.add(r), s("item binding value could not be resolved; the item has no such property.", {
				binding: i,
				stack: n
			}));
			return;
		}
		let c = o.value ?? i.fallbackValue, l = v(i.componentId), u = e.closest(`[${ce}="${l}"]`);
		if (u === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = bn(u, t, () => [e])[0] ?? null;
			if (n === null) continue;
			let o = this.extensions.converters.convert(t.converter, c);
			this.operations.apply({
				resolved: {
					componentId: l,
					propertyId: i.propertyId,
					propertyName: a.propertyName,
					dynamicParameters: [],
					component: u,
					definition: a,
					address: {
						component: {
							id: l,
							dynamicParameters: []
						},
						property: a.propertyName
					},
					bindingId: r,
					bindingSelector: null
				},
				operation: t,
				target: n,
				value: c,
				convertedValue: o,
				local: !1
			});
		}
	}
};
function Eb(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Rh(r, i.name) : Hh(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Uh(r, i.key, n), e;
	let a = r;
	return a[zh(a, i.name)] = n, e;
}
function Db(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function Ob(e, t, n) {
	e.setAttribute(m, t), jb(e, n), Ab(e, n);
}
var kb = [
	["CanSelect", de],
	["CanDrag", fe],
	["CanRemove", pe],
	["CanRename", me],
	["CanShowContextMenu", he]
];
function Ab(e, t) {
	for (let [n, r] of kb) {
		let i = Rh(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function jb(e, t) {
	let n = Rh(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(je, n.value) : e.removeAttribute(je);
}
function Mb(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Rh(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var Nb = "Group", Pb = class {
	sources = /* @__PURE__ */ new Map();
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = v(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && (e.reactiveSources.watch(t.source, i), this.sources.set(v(t.source.componentId), { reference: t.source }));
		}
		for (let t of Jn) e.root.addEventListener(t, (e) => this.handleSourceValueEvent(e), !0);
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), C(e.root, `[${Me}="items-query"]`, { attributeFilter: [Ee] }, (e) => {
			for (let t of e) {
				let e = On(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
	}
	handleSourceValueEvent(e) {
		if (!(e.target instanceof Element)) return;
		let t = On(e.target), n = t === null ? void 0 : this.sources.get(t);
		n !== void 0 && this.options.propertyPatchEngine.applyPropertyValue(n.reference, [], this.options.valueReaders.readBound(e.target), !0);
	}
	handleDragStart(e) {
		this.dragged = e.target instanceof Element ? e.target : null, window.setTimeout(() => {
			e.defaultPrevented && this.land();
		});
	}
	land() {
		this.dragged = null, this.deferred.size !== 0 && window.setTimeout(() => {
			let e = [...this.deferred];
			this.deferred.clear();
			for (let [t, n] of e) t.isConnected && xg(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(v(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Vh(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${h}]`)) {
			if (rg(r) !== "virtualized") continue;
			let i = r.closest(Ht);
			i === null || !this.drawsPatchedComponent(i, v(e.reference.componentId), t) || !Fb(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(b(i), t) && this.sync(r, b(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${b(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? b(e) === n.scopeComponentId : b(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
		}
		return this.drawnByHost.set(r, a), a;
	}
	redrawsVirtualized(e, t) {
		return t.steps.length === 0 || this.feedsRule(e, t);
	}
	sync(e, t) {
		if (this.dragged !== null && e.contains(this.dragged)) {
			this.deferred.set(e, t);
			return;
		}
		xg(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${Ut(t)}"]`)].filter((t) => this.isItemRoot(t) && Cn(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${h}]`), i = r === null ? null : On(r);
		if (r !== null && i !== null && rg(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = Ib(Nb, t);
		a && jb(e, this.options.renderer.getItemValue(e)), kb.some(([e]) => Ib(e, t)) && Ab(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && Ib(Nb, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => Ib(e.itemProperty, t)) || n.sorts.some((e) => Ib(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${h}]`)) {
			let n = On(t);
			n === e && this.sync(t, n);
		}
	}
};
function Fb(e, t) {
	let n = Sn(e, xn(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function Ib(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var Lb = 50, Rb = 1, zb = .5, Bb = 60, Vb = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	started = !1;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	start() {
		let e = !this.started;
		this.started = !0;
		for (let t of this.hosts()) {
			if (this.layout(t), Kb(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = Yb(e, Be);
		if (t !== null && mv(e) && Hb(e.getAttribute("data-ui-window-more-after"))) {
			bv(e, Math.max(0, this.windowBottom(e, t) - yv(e).height));
			return;
		}
		t !== null && t !== 0 && bv(e, Hb(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = Gb(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Wb(n[n.length - 1]).bottom - Wb(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = Yb(e, Be), n = Gb(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = yv(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		rg(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${h}][${Ne}="windowed"]`)];
	}
	handleScroll(e) {
		let t = vv(e.target);
		if (t === null || rg(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, Bb));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && Kb(e) > 0) return;
		let n = Gb(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = Yb(e, Be), i = Hb(e.getAttribute(He)), a = Hb(e.getAttribute(Ue));
		if (r !== null) {
			let o = this.windowSize(e), s = yv(e), c = Math.max(1, Math.round(s.height * Rb / t.itemSize), Math.floor(o * zb)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, qb(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, qb(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = yv(e), s = Math.max(1, o.height * Rb), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, qb(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, qb(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = Yb(e, Ve);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = On(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: Jb(e),
				anchor: t,
				offset: n,
				key: r ?? void 0,
				count: this.windowSize(e),
				extend: i
			});
		} catch (e) {
			s("reading an item window failed.", {
				componentId: a,
				anchor: t,
				error: e
			});
		} finally {
			o.pending = !1, this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = Gb(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			ag(e, "top", 0), ag(e, ig, 0);
			return;
		}
		if (n.length > 0) {
			let e = Wb(n[n.length - 1]).bottom - Wb(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / Ub(n))));
		}
		let r = Yb(e, Ve), i = Yb(e, Be), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		ag(e, "top", a), ag(e, ig, o);
	}
	windowSize(e) {
		let t = Yb(e, ze);
		return t !== null && t > 0 ? t : Lb;
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			pending: !1,
			restless: !1,
			itemSize: 32,
			scheduled: 0
		}, this.states.set(e, t)), t;
	}
};
function Hb(e) {
	return e !== null && e.toLowerCase() === "true";
}
function Ub(e) {
	let t = Wb(e[0]).top, n = 1;
	for (; n < e.length && Wb(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function Wb(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function Gb(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function Kb(e) {
	return Gb(e).length;
}
function qb(e) {
	return e.getAttribute(m);
}
function Jb(e) {
	let t = e.closest(Ht);
	return t === null ? [] : Sn(t, xn(t));
}
function Yb(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/state/value-equality.ts
function Xb(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Zb(e, t) : Qb(e, t);
}
function Zb(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Xb(e[n], t[n])) return !1;
	return !0;
}
function Qb(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Xb(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var $b = [
	ce,
	le,
	ue
];
function ex(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, tx(c, e.itemRole);
	let l = rx(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = nx(l, t, n, a);
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
		d.className = l.wrapperClassName, tx(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), Ob(d, r, n), c.appendChild(d);
	}
	return Ob(c, r, n), o.registerItemScope(c, l, n), c;
}
function tx(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function nx(e, t, n, r) {
	let i = Mb(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function rx(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of $b) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), b(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function ix(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return ax(i.renderer.renderItem(e, t, n, r), a);
	let s = ex(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), ax(s, a);
}
function ax(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var ox = 6, sx = 60, cx = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	itemsOf(e) {
		let t = this.states.get(e);
		if (t === void 0) return null;
		let n = [];
		for (let e of t.projected) e.header || n.push(e.entry.item);
		return n;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = mv(e) && gv(e);
		this.project(e, t), this.layout(e, t), n && !gv(e) && (bv(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Xb(t.item, n)) {
				i.push(t);
				continue;
			}
			t !== void 0 && (t.element?.remove(), a.push(e)), i.push({
				key: e,
				item: n,
				element: null,
				height: t?.height ?? null
			});
		}
		for (let e of r.values()) e.element?.remove(), a.push(e.key);
		return n.entries = i, a;
	}
	insert(e, t, n, r) {
		let i = this.getState(e);
		if (i === null) return;
		let a = {
			key: t,
			item: n,
			element: null,
			height: null
		}, o = r === null || r > i.entries.length ? i.entries.length : r;
		i.entries.splice(o, 0, a);
	}
	remove(e, t) {
		let n = this.getState(e), r = n === null ? -1 : n.entries.findIndex((e) => e.key === t);
		if (n === null || r < 0) return;
		let i = n.entries[r].element, a = e.parentElement, o = w(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? ua(a, o, i) : null;
		i?.remove(), n.entries.splice(r, 1), s?.();
	}
	replace(e, t, n, r, i) {
		let a = this.getState(e), o = a === null ? -1 : a.entries.findIndex((e) => e.key === t);
		if (a !== null) {
			if (o < 0) {
				this.insert(e, n, r, i);
				return;
			}
			a.entries[o].element?.remove(), a.entries[o] = {
				key: n,
				item: r,
				element: null,
				height: a.entries[o].height
			};
		}
	}
	move(e, t, n) {
		let r = this.getState(e), i = r === null ? -1 : r.entries.findIndex((e) => e.key === t);
		if (r === null || i < 0) return;
		let [a] = r.entries.splice(i, 1), o = n === null || n > r.entries.length ? r.entries.length : n;
		r.entries.splice(o, 0, a);
	}
	reset(e) {
		let t = this.getState(e);
		if (t !== null) {
			for (let e of t.entries) e.element?.remove();
			t.entries = [];
		}
	}
	updateValue(e, t, n, r) {
		let i = this.getState(e), a = i?.entries.find((e) => e.key === t);
		return i === null || a === void 0 ? !1 : (a.item = Eb(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Gh(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Yh(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => qh(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => fx(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Zh(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = fx(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Zh(e.item, t.item, a))), e !== "" && l.push({
				entry: t[0],
				header: !0
			});
			for (let e of t) l.push({
				entry: e,
				header: !1
			});
		}
		t.projected = l;
		for (let e of [...t.headers.keys()]) s.has(e) || (t.headers.get(e)?.element?.remove(), t.headers.delete(e));
	}
	handleScroll(e) {
		let t = vv(e.target);
		if (t === null || rg(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, sx));
	}
	layout(e, t) {
		let n = t.projected, r = mx(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (px(e) && a > 0) {
			let r = yv(e), c = ux(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - ox), s = Math.min(a, s + ox);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(fx(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), dx(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (dx(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of w(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ae}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = hx(i, 0, o), p = hx(i, s, a);
		og(e, [...l, ...Ji(Yi(e))]), ag(e, "top", f > 0 ? f - r : 0), ag(e, ig, p > 0 ? p - r : 0), Xi(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return ix(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(Ae, ""), r);
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(fx(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (lx(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(fx(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = kn(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of w(e)) {
			let e = t.getAttribute(m);
			e !== null && a.set(e, t);
		}
		let o = this.options.metadata.getItemValues(r, n.dynamicParameters);
		if (o.length > 0) for (let e of o) i.push({
			key: e.key,
			item: e.item,
			element: a.get(e.key) ?? null,
			height: null
		});
		else for (let [e, t] of a) i.push({
			key: e,
			item: this.options.renderer.getItemValue(t),
			element: t,
			height: null
		});
		let c = {
			componentId: r,
			entries: i,
			projected: [],
			headers: /* @__PURE__ */ new Map(),
			groupOrder: [],
			itemEstimate: 32,
			headerEstimate: 32,
			itemHeights: {
				sum: 0,
				count: 0
			},
			headerHeights: {
				sum: 0,
				count: 0
			},
			laidOut: null,
			pitches: [],
			scheduled: 0,
			first: -1,
			last: -1
		};
		return this.states.set(e, c), c;
	}
};
function lx(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function ux(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (bv(e, i + s), i + s);
}
function dx(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = fx(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function fx(e) {
	let t = Rh(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function px(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function mx(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function hx(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var gx = "data-ui-template", _x = "default", vx = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? _x, r = this.findTemplate(e, n);
		return r === void 0 ? n === _x ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${gx}]`);
		for (let e of r) if (e.getAttribute(gx) === t) return e;
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, De);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Oe);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
}, yx = "script[type='application/json'][data-ui-metadata]";
function bx(e = document) {
	let t = e.querySelector(yx);
	if (t === null) return xx();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return xx();
	let r = JSON.parse(n);
	return {
		propertyDefinitions: r.propertyDefinitions ?? [],
		bindings: r.bindings ?? [],
		events: r.events ?? [],
		interactions: r.interactions ?? [],
		validations: r.validations ?? [],
		validationTargets: r.validationTargets ?? [],
		exposedProperties: r.exposedProperties ?? [],
		items: r.items ?? [],
		itemsFilterSort: r.itemsFilterSort ?? [],
		itemValues: r.itemValues ?? []
	};
}
function xx() {
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
//#region src/runtime/web-hydration.ts
var Sx = "script[type='application/json'][data-ui-hydration]";
function Cx(e = document) {
	let t = e.querySelector(Sx)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t);
		return {
			pageId: e.pageId ?? null,
			view: typeof e.view == "string" ? e.view : null,
			changes: e.changes
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var wx = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(Tx(Ex(e)));
	}
	async dispatchAsync(e) {
		let t = Ex(e), n = Tx(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		let r = this.nextRequestId++, i = this.expect(r);
		try {
			let e = await this.transport.processEventAsync({
				...t,
				requestId: r
			});
			return e.accepted === !0 ? await i : e;
		} finally {
			this.awaited.delete(r), this.pendingKeys.delete(n);
		}
	}
	expect(e) {
		let t = new Promise((t, n) => this.awaited.set(e, {
			resolve: t,
			reject: n
		}));
		return t.catch(() => {}), t;
	}
	settle(e) {
		let t = e.requestId;
		if (t === void 0) return !1;
		let n = this.awaited.get(t);
		return n !== void 0 && (this.awaited.delete(t), n.resolve(e), !0);
	}
	release(e) {
		let t = [...this.awaited.values()];
		this.awaited.clear();
		for (let n of t) n.reject(e);
	}
};
function Tx(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function Ex(e) {
	return {
		eventId: v(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var Dx = class {
	values = /* @__PURE__ */ new Map();
	scopes = /* @__PURE__ */ new Map();
	unplaced = /* @__PURE__ */ new Map();
	unplacedPathByEntry = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t));
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n, r = []) {
		let i = this.createKey(e, t), a = this.values.get(i);
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), this.values.has(i) && Xb(a, n) ? !1 : (this.values.set(i, n), !0);
	}
	forgetRows(e, t, n) {
		let r = Ox(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(kx([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(Ox(e, t));
		let n = this.unplaced.get(kx(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = Ox(i.host, i.hostParameters), a = this.rowState(t, i.key);
			r === 0 && a.entries.add(e), n !== null && a.innerScopes.add(n), n = t;
		}
	}
	forgetRow(e, t) {
		let n = this.scopes.get(e), r = n?.get(t);
		if (n !== void 0 && r !== void 0) {
			n.delete(t);
			for (let e of r.entries) this.values.delete(e), this.removeUnplaced(e);
			for (let e of r.innerScopes) this.forgetScope(e);
		}
	}
	forgetScope(e) {
		let t = this.scopes.get(e);
		if (t !== void 0) {
			for (let n of [...t.keys()]) this.forgetRow(e, n);
			this.scopes.delete(e);
		}
	}
	recordUnplaced(e, t) {
		let n = this.unplacedNode(kx([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = kx(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, kx(t.slice(0, e - 1)));
		n.entries.add(e), this.unplacedPathByEntry.set(e, r);
	}
	unplacedNode(e, t) {
		let n = this.unplaced.get(e);
		return n === void 0 && (n = {
			parent: t,
			entries: /* @__PURE__ */ new Set(),
			children: /* @__PURE__ */ new Set()
		}, this.unplaced.set(e, n)), n;
	}
	removeUnplaced(e) {
		let t = this.unplacedPathByEntry.get(e);
		t !== void 0 && (this.unplacedPathByEntry.delete(e), this.unplaced.get(t)?.entries.delete(e), this.pruneUnplaced(t));
	}
	pruneUnplaced(e) {
		let t = e;
		for (; t !== null;) {
			let e = this.unplaced.get(t);
			if (e === void 0 || e.entries.size > 0 || e.children.size > 0 || e.parent === null) return;
			this.unplaced.delete(t), this.unplaced.get(e.parent)?.children.delete(t), t = e.parent;
		}
	}
	forgetUnplaced(e) {
		let t = this.unplaced.get(e);
		if (t !== void 0) {
			for (let e of t.entries) this.values.delete(e), this.unplacedPathByEntry.delete(e);
			t.entries.clear();
			for (let e of [...t.children]) this.forgetUnplaced(e);
			this.pruneUnplaced(e);
		}
	}
	rowState(e, t) {
		let n = this.scopes.get(e);
		n === void 0 && (n = /* @__PURE__ */ new Map(), this.scopes.set(e, n));
		let r = n.get(t);
		return r === void 0 && (r = {
			entries: /* @__PURE__ */ new Set(),
			innerScopes: /* @__PURE__ */ new Set()
		}, n.set(t, r)), r;
	}
	createKey(e, t) {
		return `${v(e.componentId)}:${e.propertyId}:${Ax(t)}`;
	}
};
function Ox(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function kx(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Ax(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var jx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, Mx = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Nx = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Px = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Fx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Ix = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, Lx = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, Rx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, zx = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Bx = class {
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
}, G;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(G ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var Vx = class {
	constructor() {}
	log(e, t) {}
};
Vx.instance = new Vx();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var Hx = "10.0.11", K = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, q = class e {
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
function Ux(e, t) {
	let n = "";
	return Gx(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${Wx(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function Wx(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function Gx(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function Kx(e, t, n, r, i, a) {
	let o = {}, [s, c] = Xx();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${Ux(i, a.logMessageContent)}.`);
	let l = Gx(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(G.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function qx(e) {
	return e === void 0 ? new Yx(G.Information) : e === null ? Vx.instance : e.log === void 0 ? new Yx(e) : e;
}
var Jx = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, Yx = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${G[e]}: ${t}`;
			switch (e) {
				case G.Critical:
				case G.Error:
					this.out.error(n);
					break;
				case G.Warning:
					this.out.warn(n);
					break;
				case G.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function Xx() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, Zx(Hx, Qx(), eS(), $x())];
}
function Zx(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function Qx() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function $x() {
	if (q.isNode) return process.versions.node;
}
function eS() {
	return q.isNode ? "NodeJS" : "Browser";
}
function tS(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function nS() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var rS = class extends Bx {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(nS());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new Nx();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new Nx();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new Mx();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, Gx(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(G.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new jx(await iS(i, "text") || i.statusText, i.status);
		let a = await iS(i, e.responseType);
		return new zx(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function iS(e, t) {
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
		default: n = e.text();
	}
	return n;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js
var aS = class extends Bx {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Nx()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (Gx(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new Nx());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new zx(r.status, r.statusText, r.response || r.responseText)) : n(new jx(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new jx(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new Mx());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, oS = class extends Bx {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new rS(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new aS(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Nx()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, sS = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
sS.RecordSeparatorCode = 30, sS.RecordSeparator = String.fromCharCode(sS.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var cS = class {
	writeHandshakeRequest(e) {
		return sS.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (Gx(e)) {
			let r = new Uint8Array(e), i = r.indexOf(sS.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(sS.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = sS.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var lS = class {
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
		return this.observers.push(e), new Jx(this, e);
	}
}, uS = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			Gx(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new dS(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, Gx(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === J.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: J.Sequence,
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
			case J.Invocation:
			case J.StreamItem:
			case J.Completion:
			case J.StreamInvocation:
			case J.CancelInvocation: return !0;
			case J.Close:
			case J.Sequence:
			case J.Ping:
			case J.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: J.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, dS = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, fS = 3e4, pS = 15e3, mS = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var hS = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? fS, this.keepAliveIntervalInMilliseconds = a ?? pS, this._statefulReconnectBufferSize = o ?? mS, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new cS(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
		if (this._connectionState !== Y.Disconnected && this._connectionState !== Y.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== Y.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = Y.Connecting, this._logger.log(G.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), q.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = Y.Connected, this._connectionStarted = !0, this._logger.log(G.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = Y.Disconnected, this._logger.log(G.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(G.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(G.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new uS(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(G.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === Y.Disconnected) return this._logger.log(G.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === Y.Disconnecting) return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new Nx("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new lS();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === J.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				}
				n && (n.type === J.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
		if (n) {
			if (t) {
				let r = n.indexOf(t);
				r !== -1 && (n.splice(r, 1), n.length === 0 && delete this._methods[e]);
			} else delete this._methods[e];
		}
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
				case J.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(G.Error, `Invoke client method threw error: ${tS(e)}`);
					});
					break;
				case J.StreamItem:
				case J.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === J.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(G.Error, `Stream callback threw error: ${tS(e)}`);
						}
					}
					break;
				}
				case J.Ping: break;
				case J.Close: {
					this._logger.log(G.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case J.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case J.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(G.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(G.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(G.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(G.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === Y.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === Y.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(G.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(G.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(G.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(G.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(G.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(G.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new Nx("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), q.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(G.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(G.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = Y.Reconnecting, e ? this._logger.log(G.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(G.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(G.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== Y.Reconnecting) {
				this._logger.log(G.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(G.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== Y.Reconnecting) {
				this._logger.log(G.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = Y.Connected, this._logger.log(G.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(G.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(G.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== Y.Reconnecting) {
					this._logger.log(G.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === Y.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(G.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(G.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${tS(t)}`);
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
			type: J.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: J.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: J.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: J.Invocation
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
			type: J.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: J.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: J.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: J.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: J.Completion
		} : {
			invocationId: e,
			result: n,
			type: J.Completion
		};
	}
	_createCloseMessage() {
		return { type: J.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, gS = [
	0,
	2e3,
	1e4,
	3e4,
	null
], _S = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? gS : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, vS = class {};
vS.Authorization = "Authorization", vS.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var yS = class extends Bx {
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
		e.headers ||= {}, this._accessToken ? e.headers[vS.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[vS.Authorization] && delete e.headers[vS.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, X;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(X ||= {});
var Z;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(Z ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var bS = class {
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
}, xS = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new bS(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = Xx(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === Z.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(G.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new jx(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${Ux(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new jx(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof Mx ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? Kx(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = Xx();
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
			i ? i instanceof jx && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(G.Trace, e), this.onclose(this._closeError);
		}
	}
}, SS = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._logger.log(G.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== Z.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (q.isBrowser || q.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = Xx();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${Ux(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(G.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? Kx(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, CS = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._logger.log(G.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (q.isNode || q.isReactNative) {
				let t = {}, [r, i] = Xx();
				t[r] = i, n && (t[vS.Authorization] = `Bearer ${n}`), o && (t[vS.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === Z.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(G.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(G.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${Ux(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${Ux(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(G.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, wS = 100, TS = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = qx(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new yS(n.httpClient || new oS(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new Nx(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new Nx(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new DS(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(G.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(G.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === X.WebSockets) this.transport = this._constructTransport(X.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new Nx("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < wS);
				if (r === wS && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof xS && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = Xx();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(G.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Lx("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof jx && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new Lx(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(G.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Ix(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new Nx(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new Rx(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new CS(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new SS(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new xS(this._httpClient, this._logger, this._options);
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
		let i = X[e.transport];
		if (i == null) return this._logger.log(G.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (ES(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new Px(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new Fx(`'${X[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(G.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(G.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(G.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(G.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(G.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(G.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(G.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!q.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(G.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function ES(e, t) {
	return !e || (t & e) !== 0;
}
var DS = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new OS(), this._transportResult = new OS(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new OS(), this._transportResult.promise;
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
			this._sendBufferedData = new OS();
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
}, OS = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, kS = "json", AS = class {
	constructor() {
		this.name = kS, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = Vx.instance);
		let n = sS.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case J.Invocation:
					this._isInvocationMessage(n);
					break;
				case J.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case J.Completion:
					this._isCompletionMessage(n);
					break;
				case J.Ping: break;
				case J.Close: break;
				case J.Ack:
					this._isAckMessage(n);
					break;
				case J.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(G.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return sS.write(JSON.stringify(e));
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
}, jS = {
	trace: G.Trace,
	debug: G.Debug,
	info: G.Information,
	information: G.Information,
	warn: G.Warning,
	warning: G.Warning,
	error: G.Error,
	critical: G.Critical,
	none: G.None
};
function MS(e) {
	let t = jS[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var NS = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), PS(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = MS(e);
			this.logger = new Yx(t);
		} else this.logger = new Yx(e);
		return this;
	}
	withUrl(e, t) {
		return K.isRequired(e, "url"), K.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return K.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new _S(e) : e : new _S(), this;
	}
	withServerTimeout(e) {
		return K.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return K.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new TS(this.url, e);
		return hS.create(t, this.logger || Vx.instance, this.protocol || new AS(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function PS(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var FS = class {
	gate;
	pending = !1;
	open = () => {};
	fail = () => {};
	closedBy = null;
	constructor() {
		this.gate = this.arm();
	}
	get failure() {
		return this.closedBy;
	}
	wait() {
		return this.gate;
	}
	markAttached() {
		this.pending = !1, this.open();
	}
	rearm() {
		this.closedBy !== null || this.pending || (this.gate = this.arm());
	}
	failAttach(e) {
		this.closedBy === null && (this.pending = !1, this.fail(e), this.gate = this.arm());
	}
	close(e) {
		if (this.closedBy !== null) return;
		this.closedBy = e, this.pending = !1, this.fail(e);
		let t = Promise.reject(e);
		t.catch(() => {}), this.gate = t;
	}
	arm() {
		let e = new Promise((e, t) => {
			this.open = e, this.fail = t;
		});
		return this.pending = !0, e.catch(() => {}), e;
	}
}, IS = class {
	apply;
	constructor(e) {
		this.apply = e;
	}
	pushed(e) {
		return (t) => queueMicrotask(() => e(t));
	}
	answered(e, t, n, r) {
		return e.then(async (e) => (r?.(), await this.apply(t(e)), n(e)));
	}
}, LS = 500;
function RS(e) {
	let { changes: t, ...n } = e;
	return n;
}
function zS() {
	return {};
}
var BS = class {
	windowId;
	connection;
	started = !1;
	gate = new FS();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new IS(t), this.connection = new NS().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(G.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t) => e(t)));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t) => e(t)));
	}
	onReconnecting(e) {
		this.connection.onreconnecting((t) => {
			this.gate.rearm(), e(t);
		});
	}
	onReconnected(e) {
		this.connection.onreconnected(() => {
			Promise.resolve(e()).catch((e) => {
				c("reattach after reconnect failed.", e);
			});
		});
	}
	onClosed(e) {
		this.connection.onclose((t) => {
			this.started = !1, e(t);
		});
	}
	async startAsync() {
		if (!(this.started || this.connection.state !== Y.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== Y.Disconnected && (await this.connection.stop(), this.started = !1);
	}
	close(e) {
		this.gate.close(e), this.stopAsync().catch((e) => s("stopping the lost connection failed.", e));
	}
	async attachAsync(e) {
		try {
			let t = await this.invokeCoreAsync("AttachAsync", [e]);
			return this.gate.markAttached(), t;
		} catch (e) {
			throw this.gate.failAttach(e), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, RS));
	}
	async processChangeSetAsync(e, t) {
		await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, zS, t));
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", [{ theme: e }]);
	}
	async requestItemWindowAsync(e) {
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, zS));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), LS);
		try {
			await this.gate.wait();
		} finally {
			window.clearTimeout(r);
		}
		return await this.invokeCoreAsync(e, t, n);
	}
	async invokeCoreAsync(e, t, n) {
		let r = this.gate.failure;
		if (r !== null) throw r;
		await this.ensureConnectedAsync();
		let i = u() ? performance.now() : -1, a = this.connection.invoke(e, ...t), o = await (n === void 0 ? a : n(a));
		return i >= 0 && d(`${e} answered`, i), o;
	}
	async ensureConnectedAsync() {
		if (this.connection.state !== Y.Connected) {
			if (this.connection.state === Y.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, VS = "/_ne/values", HS = 3e4;
function US(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function WS(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function GS(e, t = HS) {
	if (e === void 0 || !WS(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${VS}/${encodeURIComponent(n)}`, {
			credentials: "same-origin",
			signal: AbortSignal.timeout(t)
		});
		if (!r.ok) throw Error(`Fetching a staged value failed with status ${r.status}.`);
		let { valueToken: i, ...a } = e;
		return {
			...a,
			value: await r.json()
		};
	}));
	return {
		...e,
		updates: n
	};
}
async function KS(e) {
	let t = await fetch(VS, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(HS)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var qS = Promise.resolve(), JS = () => {}, YS = class {
	transport;
	queue = [];
	flight = null;
	given = 0;
	handed = 0;
	sentWaiters = [];
	constructor(e) {
		this.transport = e;
	}
	whenSent() {
		if (this.handed >= this.given) return qS;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = US(e.value), r = n === null ? null : KS(n);
		return r?.catch(JS), new Promise((n, i) => {
			let a = XS(e), o = this.queue.findIndex((e) => e.field === a), s = [{
				resolve: n,
				reject: i
			}];
			o >= 0 && (s = [...this.queue[o].settles, ...s], this.queue.splice(o, 1)), this.queue.push({
				field: a,
				update: e,
				staged: r,
				before: t,
				settles: s
			}), this.pump();
		});
	}
	pump() {
		if (this.flight !== null || this.queue.length === 0) return;
		let e = this.sendBatchAsync();
		this.flight = e, e.finally(() => {
			this.flight === e && (this.flight = null), this.pump();
		});
	}
	async sendBatchAsync() {
		let e = this.queue.splice(0), t = this.given, n = [], r = [];
		for (let t of e) {
			if (t.staged === null) {
				n.push(t.update), r.push(t);
				continue;
			}
			try {
				let e = t.update;
				n.push({
					componentId: e.componentId,
					propertyName: e.propertyName,
					dynamicParameters: e.dynamicParameters,
					valueToken: await t.staged
				}), r.push(t);
			} catch (e) {
				for (let n of t.settles) n.reject(e);
			}
		}
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, ZS(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function XS(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function ZS(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var QS = document;
function $S() {
	try {
		return QS.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/navigation-url.ts
function eC(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = tC(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function tC(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, nC(e));
	return t.toString();
}
function nC(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/effect-registry.ts
var rC = "data-ui-theme", iC = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(ln(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = ln(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
		if (n === void 0) {
			s("client effect kind is not supported.", {
				kind: e.effect?.kind,
				effect: e.effect
			});
			return;
		}
		try {
			n(e);
		} catch (n) {
			c(`the ${t} effect failed.`, {
				effect: e.effect,
				error: n
			});
		}
	}
	registerDefaults() {
		this.register("Navigate", (e) => {
			let t = eC(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!ey(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = pn(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute(rC) !== n && document.documentElement.setAttribute(rC, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = oC(e);
			t !== null && lC(t);
		}), this.register("ScrollTo", (e) => {
			let t = oC(e);
			if (t === null) return;
			let n = e.effect, r = un(n.behavior), i = dn(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = oC(e);
			if (t === null) return;
			let n = e.effect, r = mn(n.axis) !== "Horizontal", i = sC(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = fn(n.position), u;
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
			let d = un(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			aC(oC(e), null);
		}), this.register("Hide", (e) => {
			aC(oC(e), "hidden");
		}), this.register("Collapse", (e) => {
			aC(oC(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = uC(e, this.valueReaders);
			t !== null && dC(t).catch((e) => s("copy to clipboard failed.", e));
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
			if (!Qv(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
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
function aC(e, t) {
	if (e !== null) for (let n of Bt) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function oC(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(v(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function sC(e, t) {
	if (cC(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (cC(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (cC(n, t)) return n;
	return null;
}
function cC(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function lC(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(si))) {
		e.focus();
		return;
	}
	let t = e.querySelector(si);
	if (t instanceof HTMLElement) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function uC(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = oC(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : zn(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Pn(t.readHeld(r));
}
async function dC(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!fC(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function fC(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return $S();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var pC = /* @__PURE__ */ new Map([
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
	["Raised", "raised"],
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
]), mC = [
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
function hC(e) {
	return Q(e, mC);
}
var gC = [
	"small",
	"medium",
	"large"
], _C = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], vC = [
	"start",
	"center",
	"end",
	"justify"
], yC = ["nowrap", "wrap"], bC = /* @__PURE__ */ new Map([
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
]), xC = ["inline", "trailing"], SC = [
	"filled",
	"outline",
	"underline",
	"ghost"
], CC = [
	"small",
	"medium",
	"large"
], wC = [
	"small",
	"medium",
	"large"
], TC = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], EC = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], DC = ["light", "dark"], OC = [
	"start",
	"center",
	"end",
	"stretch"
], kC = ["clip", "visible"], AC = [
	"visible",
	"hidden",
	"collapsed"
], jC = [
	"background",
	"raised",
	"tinted"
], MC = ["horizontal", "vertical"], NC = [
	"none",
	"gap",
	"rule"
], PC = [
	"none",
	"one",
	"many"
], FC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], IC = ["stack", "wrap"], LC = [
	"disabled",
	"auto",
	"always"
], RC = [
	"disabled",
	"proximity",
	"mandatory"
], zC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], BC = ["hex", "rgb"], VC = ["field", "swatch"], HC = [
	"fill",
	"contain",
	"cover",
	"none"
], UC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], WC = ["linear", "circular"], GC = ["keep", "replace"], KC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], qC = [
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
], JC = [
	"None",
	"Shade",
	"Tint"
], YC = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, mC)}`],
	["themeColorClass", (e) => hw(e)],
	["iconClass", (e) => Ew(e)],
	["iconUrlCss", (e) => Uv(e)],
	["safeUrl", (e) => $v(e)],
	["safeImageSource", (e) => ty(e)],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, gC)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, _C)}`],
	["textAppearanceClass", (e) => vw(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, vC)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, yC)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, xC)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, EC)}`],
	["badgeTextFit", (e) => gw(e)],
	["buttonClass", (e) => `ui-button--${Q(e, TC)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, jC)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, MC)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, NC)}`],
	["selectionModeAttribute", (e) => Q(e, PC)],
	["selectionBackgroundCss", (e) => pw(uw(e, "background"))],
	["selectionForegroundCss", (e) => pw(uw(e, "foreground"))],
	["selectionMarkColorCss", (e) => pw(uw(e, "markColor"))],
	["selectionMarkCss", (e) => fw(uw(e, "mark"))],
	["selectionFontWeightCss", (e) => dw(uw(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, IC)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, LC)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, LC)}`],
	["hostViewport", (e) => rw(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, RC)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, SC)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, wC)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, CC)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, CC)}`],
	["textInputTypeAttribute", (e) => Q(e, zC)],
	["colorTextFormatAttribute", (e) => Q(e, BC)],
	["colorInputVariantAttribute", (e) => Q(e, VC)],
	["themeNameCss", (e) => Q(e, DC)],
	["alignmentCss", (e) => Q(e, OC)],
	["alignmentStretchFallbackCss", (e) => Q(e, OC) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, kC)],
	["layoutLengthCss", (e) => iw(e)],
	["thicknessCss", (e) => aw(e)],
	["radiusCss", (e) => ow(e)],
	["gridUnitCss", (e) => sw(e)],
	["pixelsCss", (e) => Ow(e)],
	["gridTemplateCss", (e) => cw(e)],
	["colorVariantCss", (e) => Sw(e)],
	["themeColorCss", (e) => pw(e)],
	["themeColorInlineCss", (e) => mw(e) ? "" : pw(e)],
	["themeColorCanonical", (e) => bw(e)],
	["textAppearanceFontSizeCss", (e) => yw(e, "size")],
	["textAppearanceFontWeightCss", (e) => yw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => yw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => yw(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => iw(M(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => iw(M(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => iw(M(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => iw(M(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => iw(M(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => aw(M(e, "base"))],
	["responsiveThicknessSmCss", (e) => aw(M(e, "sm"))],
	["responsiveThicknessMdCss", (e) => aw(M(e, "md"))],
	["responsiveThicknessXlCss", (e) => aw(M(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => aw(M(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => kw(M(e, "base"))],
	["responsivePixelsSmCss", (e) => kw(M(e, "sm"))],
	["responsivePixelsMdCss", (e) => kw(M(e, "md"))],
	["responsivePixelsXlCss", (e) => kw(M(e, "xl"))],
	["responsivePixelsXxlCss", (e) => kw(M(e, "xxl"))],
	["visibilityBaseAttribute", (e) => Aw(e, "base")],
	["visibilitySmAttribute", (e) => Aw(e, "sm")],
	["visibilityMdAttribute", (e) => Aw(e, "md")],
	["visibilityXlAttribute", (e) => Aw(e, "xl")],
	["visibilityXxlAttribute", (e) => Aw(e, "xxl")],
	["gridPlacementBaseColumnCss", (e) => $(e, "base", "column")],
	["gridPlacementBaseRowCss", (e) => $(e, "base", "row")],
	["gridPlacementBaseColumnSpanCss", (e) => $(e, "base", "columnSpan")],
	["gridPlacementBaseRowSpanCss", (e) => $(e, "base", "rowSpan")],
	["gridPlacementSmColumnCss", (e) => $(e, "sm", "column")],
	["gridPlacementSmRowCss", (e) => $(e, "sm", "row")],
	["gridPlacementSmColumnSpanCss", (e) => $(e, "sm", "columnSpan")],
	["gridPlacementSmRowSpanCss", (e) => $(e, "sm", "rowSpan")],
	["gridPlacementMdColumnCss", (e) => $(e, "md", "column")],
	["gridPlacementMdRowCss", (e) => $(e, "md", "row")],
	["gridPlacementMdColumnSpanCss", (e) => $(e, "md", "columnSpan")],
	["gridPlacementMdRowSpanCss", (e) => $(e, "md", "rowSpan")],
	["gridPlacementXlColumnCss", (e) => $(e, "xl", "column")],
	["gridPlacementXlRowCss", (e) => $(e, "xl", "row")],
	["gridPlacementXlColumnSpanCss", (e) => $(e, "xl", "columnSpan")],
	["gridPlacementXlRowSpanCss", (e) => $(e, "xl", "rowSpan")],
	["gridPlacementXxlColumnCss", (e) => $(e, "xxl", "column")],
	["gridPlacementXxlRowCss", (e) => $(e, "xxl", "row")],
	["gridPlacementXxlColumnSpanCss", (e) => $(e, "xxl", "columnSpan")],
	["gridPlacementXxlRowSpanCss", (e) => $(e, "xxl", "rowSpan")],
	["imageFitClass", (e) => `ui-image-fit--${Q(e, HC)}`],
	["backgroundImageCss", (e) => QC(e)],
	["imageFitSizeCss", (e) => Q(e, UC)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, WC)}`],
	["progressValueText", (e) => Dw(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, GC)}`],
	["textAreaResizeCss", (e) => Q(e, KC)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, qC)}`],
	["popupPlacementAttribute", (e) => Q(e, qC)],
	["tabMenuEntriesAttribute", (e) => ZC(e)]
]), XC = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function ZC(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = XC.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function QC(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : Wv(t);
}
var $C = [
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
], ew = new Map($C.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), tw = new Map($C.map(([e, t]) => [e, t])), nw = /* @__PURE__ */ new Map([[kC, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : nw.get(t)?.get(e)) ?? pC.get(e) ?? Wt(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function rw(e) {
	return e == null || Q(e, LC) === "disabled" ? void 0 : "parent";
}
function iw(e) {
	if (e == null) return "";
	if (typeof e == "number") return Ow(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Ow(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function aw(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function ow(e) {
	if (e == null) return "";
	if (typeof e == "number") return Ow(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Ow(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function sw(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Ow(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function cw(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return sw(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return sw(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${sw(e[0])})` : e.map((e) => sw(e)).join(" ");
}
function $(e, t, n) {
	return lw(M(e, t), n);
}
function lw(e, t) {
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
function uw(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function dw(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function fw(e) {
	if (e == null) return "";
	switch (Q(e, FC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function pw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (xw(e)) return Sw(e);
	let t = e, n = Sw(t.light), r = Sw(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = bC.get(Q(o, mC));
	return s ? `var(${s})` : "";
}
function mw(e) {
	if (typeof e != "object" || !e || xw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function hw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, mC)}`;
}
function gw(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function _w(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", gw(n));
}
function vw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, _C)}`;
}
function yw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Ow(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Ow(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Ow(e);
		}
		default: return "";
	}
}
function bw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Cw(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${P(r.rgb >> 16 & 255)}${P(r.rgb >> 8 & 255)}${P(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${P(e)}`;
	}
	let i = ww(r.name);
	return i === null ? "" : `${i}/${Tw(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function xw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Sw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = ww(t.name), i = n ?? (r === null ? void 0 : ew.get(r));
	if (!i) return "";
	let a = Tw(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = N(c * (1 - o)), l = N(l * (1 - o)), u = N(u * (1 - o))) : a === "Tint" && (c = N(c + (255 - c) * o), l = N(l + (255 - l) * o), u = N(u + (255 - u) * o)), `#${P(c)}${P(l)}${P(u)}${P(s)}`;
}
function Cw(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = mC[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function ww(e) {
	if (typeof e == "number") return tw.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Tw(e) {
	if (typeof e == "number") return JC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Ew(e) {
	let t = Vv(e);
	return t === null ? Xv(e) : t.tinted ? "" : Bv;
}
function Dw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Ow(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function kw(e) {
	return e == null ? "" : Ow(e);
}
function Aw(e, t) {
	let n = _f(e, t);
	if (n == null) return;
	let r = Q(n, AC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var jw = "ui-notification-host", Mw = "ui-notification", Nw = "ui-notification--leaving", Pw = "ui-notification__message", Fw = "ui-notification__action", Iw = "ui-notification__close", Lw = 5e3, Rw = 160, zw = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), Bw = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? Lw, this.ensureHost();
	}
	show(e) {
		let t = hC(e.severity), n = document.createElement("div");
		n.className = zw.has(t) ? `${Mw} ${Mw}--${t}` : Mw, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = Pw, r.textContent = e.message, n.append(r), e.action !== void 0 && n.append(Vw(e.action));
		let i = document.createElement("button");
		if (i.type = "button", i.className = Iw, i.setAttribute("aria-label", x.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), this.ensureHost().append(n), e.sticky === !0) return n;
		let a = !1, o = !1, s = window.setTimeout(() => this.dismiss(n), this.durationMs), c = () => window.clearTimeout(s), l = () => {
			a || o || (window.clearTimeout(s), s = window.setTimeout(() => this.dismiss(n), this.durationMs));
		};
		return n.addEventListener("mouseenter", () => {
			a = !0, c();
		}), n.addEventListener("mouseleave", () => {
			a = !1, l();
		}), n.addEventListener("focusin", () => {
			o = !0, c();
		}), n.addEventListener("focusout", (e) => {
			e.relatedTarget instanceof Node && n.contains(e.relatedTarget) || (o = !1, l());
		}), n;
	}
	dismiss(e) {
		!e.isConnected || e.classList.contains(Nw) || (e.classList.add(Nw), window.setTimeout(() => e.remove(), Rw));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${jw}`), n = t ?? document.createElement("div");
		return n.classList.add(jw), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function Vw(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Fw} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var Hw = class {
	addressResolver;
	operations;
	extensions;
	state;
	valueChangeHandlers = /* @__PURE__ */ new Set();
	isHeld = () => !1;
	restoring = !1;
	constructor(e, t, n, r) {
		this.addressResolver = e, this.operations = t, this.extensions = n, this.state = r;
	}
	setHeldTargets(e) {
		this.isHeld = e;
	}
	addValueChangeHandler(e) {
		return this.valueChangeHandlers.add(e), () => this.valueChangeHandlers.delete(e);
	}
	applyPropertyValue(e, t, n, r) {
		let i = this.addressResolver.resolveProperties(e, t), a = !1;
		if (i.length === 0) {
			if (this.addressResolver.hasRenderedComponent(e)) {
				let i = {
					reference: e,
					dynamicParameters: t,
					value: n,
					local: r
				};
				t.length > 0 && typeof e.itemTemplate == "string" ? l("item-scoped property address names a template variant that does not draw this row.", i) : s("property address could not be resolved.", i);
			}
		} else for (let t of i[0].definition.operations) {
			let o = this.extensions.converters.convert(t.converter, n);
			for (let c of i) {
				let i = this.addressResolver.resolveOperationTargets(c, t);
				if (i.length === 0) {
					t.optional !== !0 && s("property operation target was not found.", {
						reference: e,
						operation: t
					});
					continue;
				}
				for (let e of i) {
					if (!r && !this.restoring && this.isHeld(e)) {
						a = !0;
						continue;
					}
					this.operations.apply({
						resolved: c,
						operation: t,
						target: e,
						value: n,
						convertedValue: o,
						local: r
					});
				}
			}
		}
		!this.state.set(e, t, n, Uw(i[0]?.component)) && !this.restoring || a || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: n,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	recordSentValue(e, t, n) {
		this.state.set(e, t, n, Uw(this.addressResolver.resolveProperties(e, t)[0]?.component));
	}
	applyToComponent(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return !1;
		for (let e of r.definition.operations) {
			let t = this.extensions.converters.convert(e.converter, n);
			for (let i of this.addressResolver.resolveOperationTargets(r, e)) this.operations.apply({
				resolved: r,
				operation: e,
				target: i,
				value: n,
				convertedValue: t,
				local: !0
			});
		}
		return this.notifyValueChanged({
			reference: t,
			propertyName: r.propertyName,
			dynamicParameters: [],
			value: n,
			local: !0,
			components: [e]
		}), !0;
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(xe)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			Un(e);
			return;
		}
		this.restoring = !0;
		try {
			this.applyPropertyValue(r, t, this.state.get(r, t), !1);
		} finally {
			this.restoring = !1;
		}
	}
	notifyValueChanged(e) {
		for (let t of this.valueChangeHandlers) try {
			t(e);
		} catch (t) {
			c("a value-change handler failed.", {
				change: e,
				error: t
			});
		}
	}
};
function Uw(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(Ht) ?? null, r = e === null ? 0 : b(e), i = n.getAttribute(m);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Sn(e, xn(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var Ww = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = Gw(v(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = Gw(v(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function Gw(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/updates/collection-sinks.ts
var Kw = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function qw(e, t, n, r) {
	return {
		action: on(e.action),
		component: t,
		componentId: n,
		dynamicParameters: r,
		items: (e.items ?? []).map((e) => ({
			key: e.key ?? null,
			oldKey: e.oldKey ?? null,
			index: e.index ?? null,
			item: e.item
		})),
		moves: (e.moves ?? []).map((e) => ({
			key: e.key ?? null,
			oldIndex: e.oldIndex ?? null,
			newIndex: e.newIndex ?? null
		}))
	};
}
//#endregion
//#region src/updates/update-processor.ts
var Jw = class {
	metadata;
	propertyPatchEngine;
	state;
	itemsRenderer;
	itemsTemplates;
	dom;
	virtualization;
	sinks;
	validationHandlers = [];
	fullResyncHandlers = [];
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s;
	}
	registerServerRenderedItems(e) {
		let t = /* @__PURE__ */ new Map(), n = (e) => {
			let n = t.get(e);
			return n === void 0 && (n = tT(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = kn(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (cn(t) !== "CollectionChange") continue;
			let e = t;
			if (on(e.action) === "Insert") for (let t of this.findItemsHosts(v(e.component?.id), e.component?.dynamicParameters ?? [])) {
				let r = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = e.get(t) ?? null;
		r !== null && this.readItemScope(r) === void 0 && this.itemsRenderer.registerItemScope(r, eT(r), n);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = On(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		xg(e, t, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer,
			state: this.state,
			virtualization: this.virtualization
		});
	}
	applyChangeSet(e) {
		let t = e?.updates;
		if (t === void 0 || t.length === 0) return;
		let n = u() ? performance.now() : -1;
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = Qw(n, t[e + 1]);
				if (r === null || this.namesSink(r)) {
					this.applyUpdate(n);
					continue;
				}
				e++, this.applyCollectionRefill(r);
			} catch (e) {
				c("applying an update failed.", {
					update: n,
					error: e
				});
			}
		}
		n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Te) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.findItemsHosts(e.componentId, e.dynamicParameters);
		if (t.length === 0) {
			s("items host was not found for a collection refill.", e.items);
			return;
		}
		for (let n of t) this.refillHost(n, e);
	}
	refillHost(e, t) {
		if (rg(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = tT(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && Xb(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), $w(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (cn(e)) {
			case "Value":
				this.applyValueUpdate(e);
				return;
			case "Validation":
				this.applyValidationUpdate(e);
				return;
			case "CollectionChange":
				this.applyCollectionChangeUpdate(e);
				return;
			case "FullResync":
				this.applyFullResync();
				return;
			default:
				s("server update is not supported by update processor yet.", e);
				return;
		}
	}
	applyValueUpdate(e) {
		let t = v(e.address?.component?.id), n = sn(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (v(e.address?.component?.id) <= 0) {
			s("validation update has an invalid address.", e);
			return;
		}
		for (let t of this.validationHandlers) t(e);
	}
	applyFullResync() {
		this.state.clear(), l("full resync requested; re-attaching.");
		for (let e of this.fullResyncHandlers) queueMicrotask(e);
	}
	applyCollectionChangeUpdate(e) {
		let t = v(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, qw(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		this.forgetRowState(t, n, e);
		let a = this.findItemsHosts(t, n);
		if (a.length === 0) {
			(on(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of a) this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (rg(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (on(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				Yw(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				Zw(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), mg(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (on(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (on(t.action)) {
			case "Insert":
				for (let n of t.items ?? []) n.key !== null && n.key !== void 0 && this.virtualization.insert(e, n.key, n.item, n.index ?? null);
				break;
			case "Remove":
				for (let n of t.items ?? []) n.key !== null && n.key !== void 0 && this.virtualization.remove(e, n.key);
				break;
			case "Replace":
				for (let n of t.items ?? []) n.key !== null && n.key !== void 0 && this.virtualization.replace(e, n.oldKey ?? n.key, n.key, n.item, n.index ?? null);
				break;
			case "Move":
				for (let n of t.moves ?? []) n.key !== null && n.key !== void 0 && this.virtualization.move(e, n.key, n.newIndex ?? null);
				break;
			case "Reset":
				this.virtualization.reset(e);
				break;
			default: s("collection update action is not supported.", t);
		}
	}
	readItemValue(e) {
		return this.readItemScope(e)?.item;
	}
	findItemsHosts(e, t) {
		let n = [];
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${h}]`)) if (On(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = cg(e, w(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, ug(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return ix(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = w(e), a = cg(e, i), o = tT(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, ug(a, l, i.index ?? null)) : (pg(a, c, l), c.replaceWith(l)));
		}
	}
};
function Yw(e, t) {
	let n = w(e), r = cg(e, n), i = tT(e, n), a = Xw(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? ua(a, o, n) : null;
		i.delete(t), dg(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function Xw(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Zw(e, t) {
	let n = w(e), r = cg(e, n), i = tT(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, fg(r, t, n.newIndex ?? null));
	}
}
function Qw(e, t) {
	if (t === void 0 || cn(e) !== "CollectionChange" || cn(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (on(n.action) !== "Reset" || on(r.action) !== "Insert") return null;
	let i = v(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== v(r.component?.id) || !Xb(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function $w(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? w(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function eT(e) {
	let t = b(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : b(n);
}
function tT(e, t = w(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(m);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-engine.ts
var nT = "ui-invalid", rT = "ui-validation--warning", iT = "ui-validation--info", aT = "data-ui-validation-message", oT = "ui-validation-message--marker", sT = "data-ui-tooltip", cT = "data-ui-tooltip-placement", lT = "data-ui-tooltip-mark", uT = "top-end", dT = "--ui-validation-marker-host", fT = "ui-validation-mark", pT = "--ui-validation-presentation", mT = "--ui-validation-color", hT = "Validation", gT = "input:not([type='hidden']), textarea, select, .ui-select__trigger[role='combobox'], [role='spinbutton']", _T = {
	Error: 0,
	Warning: 1,
	Info: 2
}, vT = {
	Error: nT,
	Warning: rT,
	Info: iT
}, yT = `.${nT}, .${rT}, .${iT}`, bT = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, xT = {
	Error: `${fT}--error`,
	Warning: `${fT}--warning`,
	Info: `${fT}--info`
}, ST = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(yT)), C(this.root, yT, { childList: !0 }, (e) => this.applyRenderedMessages(e));
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			DT(t, wT(t) === "Error");
			let e = t.querySelector(`:scope > [${aT}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && OT(this.markerMirrors, t, e, {
				message: n,
				severity: wT(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === hT) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = v(e.reference.componentId), n = CT(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = v(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => tn(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = v(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: TT(e.severity)
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		ET(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${v(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
		if (n !== void 0) a === void 0 && (a = /* @__PURE__ */ new Map(), this.messageLines.set(i, a)), a.set(t, n.message);
		else {
			if (a === void 0 || !a.delete(t)) return;
			a.size === 0 && this.messageLines.delete(i);
		}
		for (let e of [...a.keys()]) e.isConnected || a.delete(e);
		this.options.propertyPatchEngine.applyPropertyValue(r.message, [], [...a.values()].join("\n"), !0);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i);
		let a = this.failingRulesByElement.get(t);
		if (a !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) a.has(t) && n.push({
			message: t.message,
			severity: TT(t.severity)
		});
		let o;
		for (let e of n) (o === void 0 || _T[e.severity] < _T[o.severity]) && (o = e);
		return o;
	}
	applyInputTrigger(e) {
		this.applyEventTrigger(e, "Change");
	}
	applyBlurTrigger(e) {
		this.applyEventTrigger(e, "Blur");
	}
	applyEventTrigger(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = this.options.dom.resolveNearestComponent(e.target, () => !0);
		if (n === null) return;
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => tn(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${We}="${Ut(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => tn(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && TT(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) fr(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function CT(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.message == "string" ? t.message : "";
	return n.length === 0 ? void 0 : {
		message: n,
		severity: TT(t.severity)
	};
}
function wT(e) {
	return e.classList.contains(rT) ? "Warning" : e.classList.contains(iT) ? "Info" : "Error";
}
function TT(e) {
	let t = nn(e);
	return t === "Unknown" ? "Error" : t;
}
function ET(e, t, n) {
	for (let e of Object.values(vT)) t.classList.toggle(e, n !== void 0 && vT[n.severity] === e);
	DT(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(mT) : r.style.setProperty(mT, `var(--ui-color-${bT[n.severity]})`);
	let i = t.querySelector(`[${aT}]`);
	i !== null && (i.textContent = n?.message ?? "", OT(e, r, i, n));
}
function DT(e, t) {
	for (let n of e.querySelectorAll(gT)) {
		let r = n.closest(ro);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function OT(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(pT).trim() === "marker";
	if (n.classList.toggle(oT, a), r !== void 0 && a) {
		n.setAttribute(sT, r.message), n.setAttribute(cT, uT), t.setAttribute(lT, ""), kT(e, t, r, i.getPropertyValue(dT).trim()), t.contains(document.activeElement) ? mb(n) : hb(n);
		return;
	}
	n.removeAttribute(sT), n.removeAttribute(cT), t.removeAttribute(lT), kT(e, t, void 0, ""), hb(n);
}
function kT(e, t, n, r) {
	let i = e.get(t), a = n === void 0 || r.length === 0 ? null : AT(t, r);
	if (n === void 0 || a === null) {
		i?.remove(), e.delete(t);
		return;
	}
	let o = i ?? document.createElement("span");
	o.className = `${fT} ${xT[n.severity]}`, o.textContent = n.message, o.setAttribute(sT, n.message), o.setAttribute(cT, uT), o.parentElement !== a && a.append(o), e.set(t, o), hb(o);
}
function AT(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var jT = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, MT = /* @__PURE__ */ new WeakMap(), NT = /* @__PURE__ */ new Map([["iconClass", Yv]]), PT = /* @__PURE__ */ new WeakMap(), FT = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(rn(e), t);
	}
	apply(e) {
		let t = rn(e.operation.kind), n = this.handlers.get(t);
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
			let t = Pn(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t);
		}), this.register("Markup", (e) => {
			py(e.target, S(e.convertedValue) ? "" : Pn(e.convertedValue));
		}), this.register("Attribute", (e) => {
			let t = HT(e.operation);
			if (S(e.value) || S(e.convertedValue)) {
				VT(e.target, t);
				return;
			}
			BT(e.target, t, Pn(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			VT(e.target, HT(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = HT(e.operation), n = !S(e.value) && IT(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (S(e.convertedValue) ? "" : Pn(e.convertedValue));
			LT(e.target, zT(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !S(e.value) && IT(e.value, e.operation.condition ?? "None") ? Pn(e.convertedValue).trim() : "";
			RT(e.target, zT(e), t, NT.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = HT(e.operation), n = !S(e.value) && IT(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Pn(e.convertedValue).trim() : "";
				RT(e.target, zT(e), t);
			}
		}), this.register("Style", (e) => {
			let t = HT(e.operation), n = e.target;
			if (S(e.value) || S(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Pn(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = HT(e.operation), n = e.target, r = S(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function IT(e, t) {
	switch (an(t)) {
		case "None": return !0;
		case "HasValue": return !S(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !S(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !S(e);
	}
}
function LT(e, t, n, r, i) {
	let a = PT.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), PT.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), BT(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && VT(e, n);
}
function RT(e, t, n, r) {
	let i = MT.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), MT.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	if (a === n) {
		n.length > 0 && !e.classList.contains(n) && e.classList.add(n);
		return;
	}
	if (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0) {
		i.delete(t);
		return;
	}
	e.classList.add(n), i.set(t, n);
}
function zT(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function BT(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function VT(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function HT(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var UT = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => YC.has(e.name),
			convert: (e) => YC.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = WT(e.name), n = {
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
function WT(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var GT = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = y(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = y(e.domEventName) || t;
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
		return this.definitions.get(y(e));
	}
};
function KT(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function qT(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => KT(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => KT(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var JT = class {
	converters = new UT();
	events = new GT();
	operations = new FT();
	valueReaders;
	collectionSinks = new Kw();
	rowDecorators = new jT();
	constructor(e, t, n, r) {
		qT(this.events), this.valueReaders = new In(r);
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
	registerValueReader(e) {
		this.valueReaders.register(e);
	}
	registerCollectionSink(e) {
		this.collectionSinks.register(e);
	}
	registerRowDecorator(e) {
		this.rowDecorators.register(e);
	}
}, YT = "Submenu", XT = "ui-menu__submenu", ZT = "Select", QT = {
	kind: "menu",
	decorate: $T
};
function $T(e) {
	if (!eE(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, YT);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(qe, ""), tE(e.item, "Kind") === ZT && e.row.setAttribute(Je, ""), tE(e.item, "Expanded") === !0 && e.row.setAttribute(Ye, "");
	let r = document.createElement("div");
	r.className = XT, r.appendChild(n), Ob(r, e.key, e.item), e.row.appendChild(r);
}
function eE(e) {
	let t = tE(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function tE(e, t) {
	let n = Rh(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/runtime/engine-start.ts
var nE = 2;
function rE(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= nE && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function iE(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var aE = "ne.standard.ui.windowId", oE = [
	500,
	1e3,
	2e3
], sE = 3, cE = [
	["file input", ({ root: e }) => new Wi({ root: e })],
	["image input", ({ root: e }) => new Ya({ root: e })],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new fo({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new _o({ root: e })],
	["image fallback", ({ root: e }) => new bo({ root: e })],
	["radio group sync", ({ root: e }) => new No({ root: e })],
	["select interaction", ({ root: e }) => new Ms({ root: e })],
	["search input", ({ root: e }) => new Yo({ root: e })],
	["debounced commit", ({ root: e }) => new Vs({ root: e })],
	["items selection", ({ root: e }) => new Eg({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new $s({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["number input", ({ root: e, propertyPatchEngine: t }) => new Ic({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new Mm({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new $l({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new Lu({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new q_({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new qu({ root: e })],
	["split button", ({ root: e }) => new bp({ root: e })],
	["toggle button", ({ root: e }) => new go({ root: e })],
	["button group", ({ root: e }) => new Dp({ root: e })],
	["menu", ({ root: e }) => new wd({ root: e })],
	["collapsible", ({ root: e }) => new Df({ root: e })],
	["menu group", ({ root: e }) => new Hd({ root: e })],
	["menu search", ({ root: e }) => new ef({ root: e })],
	["side drawer", ({ root: e }) => new bf({ root: e })],
	["grid splitter", ({ root: e }) => new ap({ root: e })],
	["accordion", ({ root: e }) => new jp({ root: e })],
	["tabs", ({ root: e }) => new Zp({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new E_({
		root: e,
		effects: t
	})],
	["breadcrumbs", ({ root: e }) => new rm({ root: e })],
	["scroll anchor", ({ root: e }) => new pv({ root: e })],
	["scroll group", ({ root: e }) => new Dv({ root: e })],
	["flyout interaction", ({ root: e }) => new bi({ root: e })],
	["text fold", ({ root: e }) => new L_({ root: e })],
	["tooltip", ({ root: e }) => $y(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new Rv({ root: e }) : void 0]
], lE = class {
	windowId;
	options;
	root;
	metadata = new Jt(bx());
	hydration = Cx();
	dom;
	transport;
	dispatcher;
	updateProcessor;
	eventPipeline;
	extensions;
	engineContext;
	pluginContext;
	dialogs;
	windows;
	tables;
	virtualization;
	notifications;
	effects;
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	inbound = null;
	enginesAwaitingHydration = [];
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = pE(e.windowIdStorageKey ?? aE), this.dom = new Dn(this.root), x.load(this.root), e.strings !== void 0 && x.register(e.strings), this.extensions = new JT(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(QT);
		let t = new yn(this.dom, this.metadata), n = this.extensions.operations, r = new Dx(), i = new Hw(t, n, this.extensions, r);
		this.reactiveSources = new Ww(i), this.dialogs = new sd({ root: this.root }), this.notifications = new Bw({ root: this.root }), this.effects = new iC({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new hr(this.metadata), o, u = new cr(a, i, new dr(), {
			effects: this.effects,
			dom: this.dom,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(v(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new vx(this.dom), f = new Tb(this.metadata, d, this.extensions, n, r);
		this.virtualization = new cx({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new Jw(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), new Pb({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			valueReaders: this.extensions.valueReaders,
			virtualization: this.virtualization
		}), this.transport = new BS(this.windowId, (e) => this.applyChanges(e), e.signalR), this.dispatcher = new wx(this.transport);
		let p = new YS(this.transport);
		o = new Qn({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordSentValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(qt.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new ST({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			propertyPatchEngine: i,
			updateProcessor: this.updateProcessor,
			valueReaders: this.extensions.valueReaders
		});
		this.engineContext = {
			root: this.root,
			dom: this.dom,
			propertyPatchEngine: i,
			effects: this.effects
		};
		for (let [e, t] of cE) rE(e, t, this.engineContext);
		rE("tree", ({ root: e, effects: t }) => new Kg({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), this.eventPipeline = new ir({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: u,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: ee,
			valueBinding: o
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...a.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(w_.name, w_.registration), this.tables = new Th({ root: this.root }), this.windows = new Vb({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: x,
			observeComponents: C,
			observeSize: eh,
			dialogs: this.dialogs,
			store: new jd(),
			numbers: gc,
			temporal: Xc,
			icons: { apply: qv },
			badges: { writeCount: _w },
			values: {
				read: (e) => this.extensions.valueReaders.readHeld(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				}
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(Ht), a = r === null ? void 0 : this.metadata.getExposedProperty(b(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: pb,
			renames: { open: $u },
			tables: this.tables,
			rows: wb(d, f, this.virtualization),
			uploads: Fi,
			selection: ka,
			popups: Cb,
			roving: $i
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			Promise.resolve(this.applyChanges(t)).then(() => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			});
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed.")));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: x.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: x.text("ui.connection.reload"),
				run: () => window.location.reload()
			}
		});
	}
	reloadForView(e) {
		if (vE() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), yE(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await fE(), this.hydrate(), this.startEnginesAwaitingHydration();
		try {
			let e = performance.now();
			await this.transport.startAsync(), d("SignalR connection opened", e);
		} catch (e) {
			this.loseConnection(e);
			return;
		}
		await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`);
	}
	hydrate() {
		if (this.hydration === null) return;
		let e = performance.now();
		this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(this.hydration.changes), this.applyChanges(this.hydration.changes), this.updateProcessor.initializeItemsHosts(), d("runtime hydrated from the page", e, {
			pageId: this.hydration.pageId,
			updates: this.hydration.changes?.updates?.length ?? 0
		});
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) rE(iE(t), t, this.pluginContext);
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
	addValueReader(e) {
		this.extensions.registerValueReader(e);
	}
	addCollectionSink(e) {
		this.extensions.registerCollectionSink(e);
	}
	addStrings(e) {
		x.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		rE(iE(e), e, this.pluginContext);
	}
	applyChanges(e) {
		if (this.inbound === null && !WS(e)) {
			this.applyNow(e);
			return;
		}
		let t = (this.inbound ?? Promise.resolve()).then(() => GS(e)).then((e) => this.applyNow(e)).catch((e) => {
			c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = t, t.then(() => {
			this.inbound === t && (this.inbound = null);
		}), t;
	}
	applyNow(e) {
		this.updateProcessor.applyChangeSet(e), this.windows.sync();
	}
	async attachAsync() {
		if (this.attachTask !== null) return this.reattachRequested = !0, this.attachTask;
		this.attachTask = this.attachRepeatedlyAsync();
		try {
			await this.attachTask;
		} finally {
			this.attachTask = null;
		}
	}
	async attachRepeatedlyAsync() {
		for (let e = 1;; e++) {
			if (this.reattachRequested = !1, !await this.attachCoreAsync() || !this.reattachRequested) return;
			if (e >= sE) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = this.holdInbound(), t = performance.now();
		try {
			let n = await this.attachWithRetryAsync(), r = performance.now();
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (bE(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
				windowId: this.windowId,
				instanceId: this.instanceId,
				answered: f(r - t),
				updates: n.initialChanges?.updates?.length ?? 0
			}), !0);
		} finally {
			e.release();
		}
	}
	holdInbound() {
		let e = this.inbound ?? Promise.resolve(), t = () => {}, n = new Promise((e) => {
			t = e;
		}), r = e.then(() => n);
		return this.inbound = r, r.then(() => {
			this.inbound === r && (this.inbound = null);
		}), {
			previous: e,
			release: t
		};
	}
	async applyAttachChangesAsync(e) {
		try {
			this.applyNow(WS(e) ? await GS(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = hE(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? gE(window.location.search) : e.parameters
		};
		for (let e = 0;; e++) try {
			return await this.transport.attachAsync(t);
		} catch (t) {
			if (e >= oE.length) return c("attaching the runtime failed after retrying; giving up.", t), null;
			s("attaching the runtime failed; retrying.", {
				attempt: e + 1,
				error: t
			}), await dE(oE[e]);
		}
	}
};
async function uE(e = {}) {
	let t = performance.now(), n = new lE(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function dE(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function fE() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function pE(e) {
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
	let n = mE();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function mE() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function hE() {
	let e = document.querySelector("[data-ui-root]")?.getAttribute("data-ui-navigation");
	if (e == null) return null;
	try {
		let t = JSON.parse(e);
		return typeof t.route == "string" ? {
			route: t.route,
			parameters: typeof t.parameters == "object" ? t.parameters : null
		} : null;
	} catch {
		return null;
	}
}
function gE(e) {
	let t = new URLSearchParams(e);
	if ([...t.keys()].length === 0) return null;
	let n = {};
	return t.forEach((e, t) => {
		if (Object.hasOwn(n, t)) {
			let r = n[t];
			n[t] = Array.isArray(r) ? [...r, e] : [r, e];
			return;
		}
		n[t] = e;
	}), n;
}
var _E = "ne-standard-ui:reloaded-view";
function vE() {
	try {
		return sessionStorage.getItem(_E);
	} catch {
		return null;
	}
}
function yE(e) {
	try {
		sessionStorage.setItem(_E, e);
	} catch {}
}
function bE() {
	try {
		sessionStorage.removeItem(_E);
	} catch {}
}
re(), uE().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
