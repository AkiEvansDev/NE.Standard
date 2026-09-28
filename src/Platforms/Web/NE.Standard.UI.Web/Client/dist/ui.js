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
var ce = "data-ui-id", le = "data-ui-context", ue = "data-ui-pc", m = "data-ui-key", de = "data-ui-unselectable", fe = "data-ui-undraggable", pe = "data-ui-unremovable", me = "data-ui-unrenamable", he = "data-ui-no-context-menu", ge = "data-ui-tabs-draggable", _e = "data-ui-tabs-menu", ve = "data-ui-context-menu", ye = "data-ui-name", be = "data-ui-bind-", xe = "data-ui-bind-value", Se = (e) => `data-ui-no-${e}`, Ce = "data-ui-event-boundary", we = "data-ui-image-caption", h = "data-ui-items-host", Te = "data-ui-collection-sink", Ee = "data-ui-items-query", De = "data-ui-empty-template", Oe = "data-ui-group-template", ke = "data-ui-empty-placeholder", Ae = "data-ui-group-header", je = "data-ui-group", Me = "data-ui-value-kind", Ne = "data-ui-host-mode", Pe = "data-ui-host-viewport", Fe = "data-ui-scroll-group", Ie = "data-ui-scroll-lines", Le = "data-ui-source-line", Re = "data-ui-window-spacer", ze = "data-ui-window-size", Be = "data-ui-window-offset", Ve = "data-ui-window-total", He = "data-ui-window-more-before", Ue = "data-ui-window-more-after", We = "data-ui-form-id", Ge = "data-ui-visibility", Ke = "data-ui-collapsed", qe = "data-ui-menu-group", Je = "data-ui-menu-select", Ye = "data-ui-menu-open", Xe = "data-ui-menu-search", Ze = "data-ui-menu-searching", Qe = "data-ui-menu-unmatched", $e = "data-ui-drawer-toggle", et = "data-ui-drawer-open", tt = "data-ui-region", nt = "data-ui-menu-item-kind", rt = `[${nt}="header"], [${nt}="separator"]`, it = `[${qe}] > .ui-menu-item`, at = `${it}, .ui-menu-item[${nt}="check"]`, ot = "data-ui-collapse-toggle", st = "data-ui-folding", ct = "data-ui-column-limits", lt = "data-ui-row-limits", ut = "data-ui-splitter-step", dt = "data-ui-table-column", ft = "data-ui-table-hide-below", pt = "data-ui-table-hidden", mt = "data-ui-table-last", ht = "data-ui-table-reordering", gt = "data-ui-table-dragging", _t = "data-ui-table-drop", vt = "data-ui-table-scrolled", yt = "data-ui-table-scrollbar", bt = "data-ui-tree-parent", xt = "data-ui-tree-children", St = "data-ui-tree-expanded", Ct = "data-ui-tree-title", wt = "data-ui-tree-loading", Tt = "data-ui-tree-drop-target", Et = "data-ui-tree-boot", Dt = "data-ui-tree-draggable", Ot = "data-ui-row-editing", kt = "data-ui-image-source", At = "data-ui-file-max-size", jt = "data-ui-splitting", Mt = "data-ui-pointer-focus", Nt = "data-ui-selection", Pt = "data-ui-selected", Ft = "data-ui-selected-key", g = "data-ui-selected-keys", It = "data-ui-bind-selected-key", Lt = "data-ui-tabs-selected", Rt = "data-ui-tab-order", zt = "data-ui-tab-caption", Bt = "data-ui-tab-pinned", Vt = [
	Ge,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Ht = "data-ui-submit-form-id", Ut = `[${ce}]`;
function Wt(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Gt(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Kt = 0;
function qt(e, t) {
	return e.id.length === 0 && (Kt++, e.id = `${t}-${Kt}`), e.id;
}
//#endregion
//#region src/metadata/metadata-index.ts
var Jt = {
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
}, Yt = class {
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
		return this.bindingsByComponentAndPropertyId.get(_n(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(_n(e, gn(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(vn(e, t));
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
		return this.itemValuesByAddress.get(yn(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(_n(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(_n(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = y(e.eventName), n = v(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(vn(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(yn(t, e.dynamicParameters ?? []), e);
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
function Xt(e) {
	return _(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Zt(e) {
	return e == null ? "OneWay" : _(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Qt(e) {
	return _(e, ["Property", "Event"]);
}
function $t(e) {
	return e == null ? "SetProperty" : _(e, ["SetProperty", "Effect"]);
}
function en(e) {
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
function tn(e) {
	return _(e, ["Ascending", "Descending"]);
}
function nn(e) {
	return _(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function rn(e) {
	return _(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function an(e) {
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
function on(e) {
	return _(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function sn(e) {
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
function cn(e) {
	return typeof e == "string" ? e : "";
}
function ln(e) {
	return _(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function un(e) {
	return typeof e == "string" ? e.trim() : "";
}
function dn(e) {
	return _(e, ["Auto", "Smooth"]);
}
function fn(e) {
	return _(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function pn(e) {
	return _(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function mn(e) {
	return _(e, ["Light", "Dark"]);
}
function hn(e) {
	return _(e, ["Horizontal", "Vertical"]);
}
function y(e) {
	return e?.trim().toLowerCase() ?? "";
}
function gn(e) {
	return e?.trim() ?? "";
}
function _n(e, t) {
	return `${e}:${gn(t)}`;
}
function vn(e, t) {
	return `${e}:${y(t)}`;
}
function yn(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var bn = class {
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
		let a = v(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${be}${Gt(r.propertyName)}="${Wt(a)}"]` : null;
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
		return xn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Gt(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
function xn(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		for (let t of e.querySelectorAll(r)) if (t.closest(Ut) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Sn(e) {
	return Tn(e, ue);
}
function Cn(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = En(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function wn(e, t) {
	let n = Sn(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Cn(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Tn(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function En(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Dn(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var On = class {
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
		let e = this.root.querySelectorAll(Ut), t = this.root.querySelector(`[${Ae}]`) !== null;
		for (let n of e) {
			let e = b(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Mn(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return qt(e, t);
	}
	findComponentParts(e, t, n) {
		return Dn(this.findAllComponents(e, t), n);
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.stale && this.rebuild(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		let n = this.keyedComponents(e).get(jn(t)) ?? [];
		if (n.length > 0 && n.every((e) => wn(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => wn(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Sn(n);
			if (e === 0) continue;
			let r = Cn(n, e);
			if (r.length !== e) continue;
			let i = jn(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(Ut);
			if (e === null || !Nn(this.root, e)) return null;
			let r = b(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Cn(e, Sn(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function b(e) {
	return Tn(e, ce);
}
function kn(e) {
	let t = e.closest(Ut), n = t === null ? 0 : b(t);
	return n > 0 ? n : null;
}
function An(e) {
	let t = e.closest(Ut), n = t === null ? 0 : b(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Cn(t, Sn(t))
	};
}
function jn(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Mn(e) {
	return Sn(e) === 0;
}
function Nn(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/client-strings.ts
var Pn = "script[type='application/json'][data-ui-strings]", x = new class {
	words = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	hasStringsBlock = !1;
	load(e = document) {
		let t = e.querySelector(Pn)?.textContent?.trim() ?? "";
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
function Fn(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function S(e) {
	return e == null;
}
var In = "data-ui-trim-input", Ln = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Hn) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Me);
		if (t === null) return Rn(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(In) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Bn(e);
		return t === null ? null : this.read(t);
	}
};
function Rn(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var zn = "input, textarea, select";
function Bn(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(zn) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${zn}`);
}
function Vn(e) {
	return e === null ? null : Number(e);
}
var Hn = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Lt)
	},
	{
		kind: "tab-order",
		read: (e) => Vn(e.getAttribute(Rt))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(zt)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Bt)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Ct)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Ft)
	},
	{
		kind: "selected-keys",
		read: (e) => Un(e, g)
	},
	{
		kind: "items-query",
		read: (e) => Un(e, Ee)
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
function Un(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Wn(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/draft-events.ts
var Gn = "ui-draft-dropped";
function Kn(e) {
	e.dispatchEvent(new Event(Gn, { bubbles: !0 }));
}
//#endregion
//#region src/updates/value-binding-engine.ts
var qn = "data-ui-clear", Jn = "data-ui-form-id", Yn = ["change", "toggle"], Xn = [
	...Yn,
	"expand",
	"collapse",
	"open",
	"close"
];
function Zn(e) {
	let t = Zt(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Qn(e) {
	return Zt(e) === "OnSubmit";
}
var $n = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Yn) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Gn, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute(Jn) || this.resolveWritableBinding(e.target)?.buffered === !0 && this.bufferValue(e.target);
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
			n.getAttribute(Jn) === e && (this.bufferedElements.delete(n), t.push(n));
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
		let t = e.target.closest(`[${qn}]`);
		if (t === null) return;
		let n = t.closest(Ut), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || er(r) || (Wn(r), r.dispatchEvent(new Event("change", { bubbles: !0 })));
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
		if (e.getAttribute(Jn) === null) {
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
			if (n.getAttribute(Jn) !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
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
				buffered: e !== void 0 && Qn(e.mode)
			};
		}
		for (let t of Array.from(e.attributes)) {
			if (!t.name.startsWith("data-ui-bind-")) continue;
			let e = this.options.metadata.getBindingById(Number(t.value));
			if (e !== void 0 && Zn(e.mode)) return {
				bindingId: t.value,
				buffered: Qn(e.mode)
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
		if (i === void 0 || !Zn(i.mode) || Qn(i.mode)) return;
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
function er(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-registry.ts
var tr = class {
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
}, nr = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: v(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, rr = {
	dispatched: !1,
	success: !1
}, ir = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, ar = class {
	options;
	root;
	registry;
	requestFactory = new nr();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new tr(e.eventCatalog), this.addEvent("click");
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
		if (r === null || sr(t, r.element)) return;
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
			let t = e instanceof ir, r = t ? e.reason : e;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), rr;
		let a = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? cr(r) : null);
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a) === !1) return r.domEvent.preventDefault(), rr;
			await this.options.valueBinding?.submitFormAsync(a);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return rr;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let o = await this.options.dispatcher.dispatchAsync(i).catch((t) => {
			throw this.applyAfterEvent(e, r), new ir(t);
		});
		return this.options.effects.applyAll(o.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: o.command?.success !== !1,
			error: o.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Xn.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		or(e.preventDefault, t) && t.domEvent.preventDefault(), or(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function or(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function sr(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function cr(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var lr = class {
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
		if ($t(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!dr(i)) return;
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
			effect: ur(r, t),
			dom: this.options.dom
		});
	}
};
function ur(e, t) {
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
function dr(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var fr = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return pr(t, e.operator, e.value);
	}
};
function pr(e, t, n) {
	switch (en(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return mr(e, n, (e) => e > 0);
		case "GreaterOrEqual": return mr(e, n, (e) => e >= 0);
		case "Less": return mr(e, n, (e) => e < 0);
		case "LessOrEqual": return mr(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return hr(e, n);
		default: return !1;
	}
}
function mr(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function hr(e, t) {
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
var gr = class {
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
		for (let t of this.eventNames) yr(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(y(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(br(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(xr(e, t)) ?? [];
	}
	addInteraction(e) {
		if (_r(e)) {
			let t = v(e.sourceEvent?.componentId), n = y(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(br(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(br(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (vr(e)) {
			let t = v(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(xr(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(xr(t, n), r)), r.push(e);
			}
		}
	}
};
function _r(e) {
	return Qt(e.sourceKind) === "Event";
}
function vr(e) {
	return Qt(e.sourceKind) === "Property";
}
function yr(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function br(e, t) {
	return `${e}:${y(t)}`;
}
function xr(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Sr = /* @__PURE__ */ new Set([
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
function Cr(e) {
	return Sr.has(e);
}
var wr = 4, Tr = 12, Er = /* @__PURE__ */ new Map(), Dr = !1, Or = null;
function kr(e, t, n) {
	Er.set(t, {
		anchor: e,
		options: n
	}), Fr(), Or?.observe(t), jr(t), Lr(e, t, n);
}
var Ar = "data-ui-popup-lifted";
function jr(e) {
	e.hasAttribute(Ar) || !Mr(e) || (e.setAttribute("popover", "manual"), e.setAttribute(Ar, ""), e.showPopover());
}
function Mr(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function Nr(e) {
	e.hasAttribute(Ar) && (e.matches(":popover-open") && e.hidePopover(), e.removeAttribute("popover"), e.removeAttribute(Ar));
}
function Pr(e) {
	e != null && (Er.delete(e), Or?.unobserve(e), Nr(e));
}
function Fr() {
	Dr || (Dr = !0, document.addEventListener("scroll", Ir, !0), window.addEventListener("resize", Ir), Or = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Er.get(t.target);
			e !== void 0 && Lr(e.anchor, t.target, e.options);
		}
	}));
}
function Ir() {
	for (let [e, t] of Er) {
		if (!e.isConnected) {
			Pr(e);
			continue;
		}
		Lr(t.anchor, e, t.options);
	}
}
function Lr(e, t, n) {
	if (!e.isConnected) return;
	n.minAnchorWidth === !0 && (t.style.minWidth = `${e.getBoundingClientRect().width}px`);
	let r = e.getBoundingClientRect(), i = (n.crossAnchor ?? e).getBoundingClientRect(), a = t.getBoundingClientRect(), o = Br(r, a, n), s = Kr(r, i, a, o, n.gap), c = qr(r, i, a, o, n.gap);
	n.arrow === !0 && (Hr(o) ? c = Rr(c, i.left + i.width / 2, a.width) : s = Rr(s, i.top + i.height / 2, a.height)), s = Yr(s, a.height, window.innerHeight), c = Yr(c, a.width, window.innerWidth), t.style.top = `${s}px`, t.style.left = `${c}px`, t.dataset.uiPlacement !== o && (t.dataset.uiPlacement = o), zr(t, i, a, o, s, c);
}
function Rr(e, t, n) {
	let r = t - e;
	return r < Tr ? e - (Tr - r) : r > n - Tr ? e + (r - (n - Tr)) : e;
}
function zr(e, t, n, r, i, a) {
	let o = Hr(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Tr, Math.min(s, c - Tr))}px`);
}
function Br(e, t, n) {
	let r = n.placement, i = Vr(t, r) + n.gap, a = Ur(e, r), o = Wr(r);
	return a >= i || Ur(e, o) <= a ? r : o;
}
function Vr(e, t) {
	return Hr(t) ? e.height : e.width;
}
function Hr(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Ur(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Wr(e) {
	return e.startsWith("top") ? `bottom${Gr(e)}` : e.startsWith("bottom") ? `top${Gr(e)}` : e.startsWith("left") ? `right${Gr(e)}` : `left${Gr(e)}`;
}
function Gr(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Kr(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Jr(t.top, t.height, n.height, r);
}
function qr(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Jr(t.left, t.width, n.width, r);
}
function Jr(e, t, n, r) {
	let i = Gr(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Yr(e, t, n) {
	return Math.max(wr, Math.min(e, n - t - wr));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Xr = 32;
function C(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Zr(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Zr(e, t, n) {
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
		if (r.size > Xr) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Qr(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var $r = /* @__PURE__ */ new Set(), ei = /* @__PURE__ */ new Map(), ti = 0, ni = !1;
function ri() {
	ni || (ni = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || ai() && e.preventDefault();
	}, !0));
}
function ii() {
	for (let e of $r) for (let t of e.openPopups()) if (t.isConnected) return !0;
	return !1;
}
function ai() {
	let e = [];
	for (let t of $r) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...ei.keys()]) t.has(e) || ei.delete(e);
	for (let { popup: t } of e) ei.has(t) || ei.set(t, ++ti);
	let n = oi(e, (e) => ei.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function oi(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var si = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), $r.add(this), ri();
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
}, ci = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function li(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	return (t ?? e.querySelector(ci) ?? e).focus({ preventScroll: !0 }), n;
}
function ui(e, t) {
	e != null && t.contains(document.activeElement) && e.focus({ preventScroll: !0 });
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var di = "ui-flyout", fi = "ui-flyout--open", pi = "ui-flyout__anchor", mi = "ui-flyout__content", hi = `.${di}.${fi}`, gi = "data-ui-flyout-no-backdrop-close", _i = "data-ui-flyout-no-escape-close", vi = 4, yi = `${di}--`, bi = "bottom-start", xi = class {
	root;
	returnFocus = /* @__PURE__ */ new WeakMap();
	seenOpen = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${di}`)) this.place(e);
		C(this.root, `.${di}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new si({
			openPopups: () => this.root.querySelectorAll(hi),
			canDismiss: (e, t) => !e.hasAttribute(t === "escape" ? _i : gi),
			close: (e) => this.setOpen(e, !1)
		});
	}
	place(e) {
		let t = e.querySelector(`:scope > .${mi}`), n = e.querySelector(`:scope > .${pi}`);
		if (t === null) return;
		let r = e.classList.contains(fi);
		if (this.describeAnchor(n, t, r), !r) {
			Pr(t), this.seenOpen.has(e) && ui(this.returnFocus.get(e), e), this.seenOpen.delete(e), this.returnFocus.delete(e);
			return;
		}
		if (kr(Si(n) ?? e, t, {
			placement: Ci(e),
			gap: vi
		}), this.seenOpen.has(e)) return;
		this.seenOpen.add(e);
		let i = li(t);
		i !== null && this.returnFocus.set(e, i);
	}
	describeAnchor(e, t, n) {
		if (e === null) return;
		let r = e.querySelector(ci) ?? e;
		r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("aria-controls", qt(t, "ui-flyout-content"));
	}
	handleFocusOut(e) {
		if (!(e instanceof FocusEvent)) return;
		let t = e.target instanceof Element ? e.target.closest(hi) : null;
		if (t === null || t.hasAttribute(gi)) return;
		let n = e.relatedTarget;
		n === null || n instanceof Node && t.contains(n) || this.setOpen(t, !1);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${pi}`)?.closest(`.${di}`) ?? null;
		t !== null && this.setOpen(t, !t.classList.contains(fi));
	}
	setOpen(e, t) {
		e.classList.contains(fi) !== t && (e.classList.toggle(fi, t), this.place(e), e.dispatchEvent(new Event("toggle", { bubbles: !0 })), e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 })));
	}
};
function Si(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Ci(e) {
	for (let t of e.classList) {
		if (!t.startsWith(yi)) continue;
		let e = t.slice(yi.length);
		if (Cr(e)) return e;
	}
	return bi;
}
//#endregion
//#region src/interactions/file-drop.ts
var wi = 120, Ti = "refused";
function Ei(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Di(e, t, n), !0);
	e.root.addEventListener("dragend", () => Ai(e, t.marked), !0), window.addEventListener("blur", () => Ai(e, t.marked));
}
function Di(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Ai(e, r);
		return;
	}
	let { host: a } = i;
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || ki(e, r, a) : t.leaving = window.setTimeout(() => Ai(e, r), wi);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Oi(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && ki(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? Ti : "");
		return;
	}
	Ai(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => ji(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function Oi(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function ki(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function Ai(e, t) {
	for (let n of t) ki(e, t, n);
}
function ji(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var Mi = "/_ne/files/upload";
function Ni(e, t) {
	let n = Number(e.getAttribute(At));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function Pi(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Mi), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var Fi = () => {}, Ii = { uploadAsync: (e, t) => Pi(e, t ?? Fi) };
function Li(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Ri = "ui-file-input", zi = "ui-file-input__row", Bi = "ui-file-input__native", Vi = "ui-file-input__field", Hi = "ui-file-input__selection", Ui = "data-ui-file-pick", Wi = "data-ui-file-dragging", Gi = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ei({
			root: this.root,
			draggingAttribute: Wi,
			resolveTarget: (e) => {
				let t = e.closest(`.${zi}`)?.closest(`.${Ri}`) ?? null, n = t?.querySelector(`.${Bi}`) ?? null;
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
		let t = e.target.closest(`[${Ui}], .${zi}`);
		if (t === null || t.hasAttribute("disabled") || !t.hasAttribute(Ui) && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Ri}`)?.querySelector(`.${Bi}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Bi)) return;
		let t = e.target.closest(`.${Ri}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Vi}`);
		if (n === null) return;
		if (t.length === 0) {
			n.value = "", this.publishSelection(e, "");
			return;
		}
		let r = Ni(e, t);
		if (r.length === 0) {
			n.value = x.text("ui.file.oversized");
			return;
		}
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Pi(r, (t) => {
				this.picks.get(e) === i && (n.value = x.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			n.value = Ki(r), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			n.value = x.text("ui.file.failed"), this.publishSelection(e, "");
		}
	}
	publishSelection(e, t) {
		Li(e.querySelector(`.${Hi}`), t);
	}
};
function Ki(e) {
	return e.length === 1 ? e[0].name : x.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/items/items-empty-renderer.ts
var qi = `:scope > [${ke}], :scope > [${Ae}], :scope > [${Re}]`, Ji = "ui-hidden";
function w(e) {
	let t = new Set(e.querySelectorAll(qi));
	return [...e.children].filter((e) => !t.has(e));
}
function Yi(e) {
	return e === null ? [] : [e];
}
function Xi(e) {
	return e.querySelector(`:scope > [${ke}]`);
}
function Zi(e, t, n, r, i) {
	i ??= w(e).some((e) => !e.classList.contains(Ji));
	let a = Xi(e);
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
function Qi(e) {
	let t = na(e.key), n = ra(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(ta);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function $i(e, t) {
	return na(e) !== null || ra(e, t) !== 0;
}
var ea = {
	target: Qi,
	applyTabIndex: T
};
function T(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function ta(e) {
	return e.getClientRects().length !== 0 && !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function na(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function ra(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/row-cursor.ts
var ia = "data-ui-row-focus";
function aa(e) {
	return e.matches(".ui-disabled, [inert]") || e.querySelector(":scope > [data-ui-id][inert], :scope > :not([data-ui-id]) > [data-ui-id][inert]") !== null;
}
function oa(e) {
	return e.filter((e) => e.getClientRects().length > 0 && !aa(e));
}
function sa(e) {
	return e.find((e) => e.hasAttribute(ia)) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !aa(e)) ?? oa(e)[0] ?? null;
}
function ca(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(ia);
	n.setAttribute(ia, ""), e.setAttribute("aria-activedescendant", qt(n, "ui-row")), n.scrollIntoView({ block: "nearest" });
}
function la(e, t, n, r) {
	return $i(e, r) ? Qi({
		key: e,
		items: oa(t),
		current: n,
		axis: r,
		loop: !1
	}) : null;
}
function ua(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function da(e, t, n) {
	let r = n.hasAttribute(ia), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = oa(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && ca(e, o, s);
	};
}
//#endregion
//#region src/interactions/selected-key.ts
function fa(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var pa = "data-ui-bind-selected-keys", ma = ".ui-items-view, .ui-table, .ui-tree", ha = ".ui-items-view__item, .ui-table__row, .ui-tree__row", ga = {
	shift: !1,
	ctrl: !1
}, _a = /* @__PURE__ */ new WeakMap();
function va(e, t) {
	if (t === null || _a.has(e)) return;
	let n = ka(t);
	n.length > 0 && _a.set(e, n);
}
function ya(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ba(e) {
	switch (e.getAttribute(Nt)) {
		case "one": {
			let t = e.getAttribute(Ft);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Da(Oa(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function xa(e, t) {
	let n = ba(e), r = e.getAttribute(Nt), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(ka(e));
		e.toggleAttribute(Pt, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Sa(e) {
	return e.filter((e) => e.hasAttribute(Pt));
}
function Ca(e, t, n, r) {
	let i = ka(n);
	if (i.length === 0 || n.hasAttribute("data-ui-unselectable")) return !1;
	switch (e.getAttribute(Nt)) {
		case "one": return fa(e, i, {
			attribute: Ft,
			bindingAttribute: It,
			apply: (e) => xa(e, t)
		}), !0;
		case "many": return wa(e, t, n, i, r), !0;
		default: return !1;
	}
}
function wa(e, t, n, r, i) {
	let a = Oa(e);
	if (a === null) return;
	let o = Da(a), s;
	if (i.shift) {
		let r = Ea(t, t.find((t) => ka(t) === _a.get(e)) ?? n, n).map(ka);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], _a.set(e, r)) : (s = [r], _a.set(e, r));
	Ta(e, t, s);
}
function Ta(e, t, n) {
	let r = Oa(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(g, i), xa(e, t), r.hasAttribute(pa) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ea(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => e.getClientRects().length > 0 && !aa(e) && !e.hasAttribute("data-ui-unselectable") && ka(e).length > 0);
}
function Da(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Oa(e) {
	for (let t of e.querySelectorAll(`[${h}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function ka(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Aa = {
	isSelected: (e) => e.hasAttribute(Pt),
	toggle: ja,
	setSelected: Ma,
	setSelectedKeys: Na
};
function ja(e) {
	let t = e.closest(ma);
	t !== null && e instanceof HTMLElement && Ca(t, Pa(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Ma(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(ka(e));
	Na(e, r, n);
}
function Na(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && r.add(e);
	let i = [...ba(e)].filter((e) => !r.has(e));
	Ta(e, Pa(e), n ? [...i, ...r] : i);
}
function Pa(e) {
	return [...e.querySelectorAll(ha)].filter((t) => t.closest(ma) === e);
}
//#endregion
//#region src/interactions/image-input-engine.ts
var Fa = "ui-image-input", Ia = "ui-image-input--multiple", La = "ui-image-input__surface", Ra = "ui-image-input__native", za = "ui-image-input__picture", Ba = "ui-image-input__text", Va = "ui-image-input__selection", Ha = "ui-image-input__selections", Ua = "ui-image-input__tiles", Wa = "ui-image-input__tile", Ga = "ui-image-input__remove", Ka = "data-ui-file-pick", qa = "data-ui-image-preview", Ja = "data-ui-image-dragging", Ya = "ui-loading", Xa = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Fa}`)), C(this.root, `.${Fa}`, {
			childList: !0,
			attributeFilter: [
				kt,
				we,
				g
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Gn, (e) => this.handleDraftDropped(e)), Ei({
			root: this.root,
			draggingAttribute: Ja,
			resolveTarget: (e) => {
				let t = e.closest(`.${La}`)?.closest(`.${Fa}`) ?? null;
				return t === null || t.hasAttribute("data-ui-image-readonly") || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: t.querySelector(`.${Ra}`)?.getAttribute("accept") ?? "",
					multiple: Za(t)
				};
			},
			onFiles: (e, t) => void (Za(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Za(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${za}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || $a(e, e.getAttribute("data-ui-image-caption") ?? eo(n)));
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
		let t = e.target.closest(`[${Ka}]`), n = t?.closest(`.${Fa}`) ?? null;
		t === null || n === null || t.hasAttribute("disabled") || n.hasAttribute("data-ui-image-readonly") || n.querySelector(`.${Ra}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ga}`), n = t?.closest(`.${Fa}`) ?? null;
		if (t === null || n === null || n.hasAttribute("data-ui-image-readonly") || n.matches(".ui-disabled")) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ra)) return;
		let t = e.target.closest(`.${Fa}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Za(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Fa}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Li(t.querySelector(`.${Va}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${La}`), r = e.querySelector(`.${za}`), i = e.querySelector(`.${Va}`);
		if (n === null || r === null || Ni(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(qa, ""), r.setAttribute("src", a), $a(e, t.name), n.classList.add(Ya);
		try {
			let n = await Pi([t], () => void 0);
			this.previews.get(e) === a && Li(i, n.selectionId);
		} catch (t) {
			$a(e, x.text("ui.file.failed")), Li(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(Ya);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Ua}`), r = Ni(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Qa(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Pi([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Ya), this.publishShelf(e);
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
		let t = e.querySelector(`.${Ha}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(g, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(qa), t || $a(e, ""));
	}
};
function Za(e) {
	return e.classList.contains(Ia);
}
function Qa(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${Wa} ${Ya}`, n.src = i, n.alt = e.name, r.type = "button", r.className = Ga, r.setAttribute("aria-label", x.text("ui.image.remove")), r.title = e.name, t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function $a(e, t) {
	let n = e.querySelector(`.${Ba}`);
	n !== null && n.textContent !== t && (n.textContent = t);
}
function eo(e) {
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
var to = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function no(e) {
	return e instanceof HTMLInputElement && to.has(e.type);
}
function ro(e) {
	return no(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/own-control.ts
var io = "[role='listbox'], [role='menu'], [role='dialog']", ao = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], .ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .ui-select__trigger, .ui-field-box, ${io}`;
function oo(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ao);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/key-value-action-engine.ts
var so = "ui-key-value-action__row", co = "ui-key-value-action__value", lo = "ui-key-value-action__value-input", uo = "ui-key-value-action__edit-action", fo = "ui-text__title", po = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${so}`)), C(this.root, `.${so}`, {
			childList: !0,
			attributeFilter: [Ot]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${lo} [${xe}]`)) {
			if (ro(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Kn(e);
	}
	open(e) {
		let t = e.querySelector(`.${lo} :is(input, textarea, select)`);
		if (t !== null) {
			if (ro(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${co} .${fo}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), no(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = ho(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(uo)) return;
		let { cell: n, row: r } = t, i = e.target.closest(io), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${uo} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click());
	}
};
function mo(e) {
	return ho(e) !== null;
}
function ho(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${lo}, .${uo}`), n = t?.closest(`.${so}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var go = `.ui-button[${Me}="pressed"]`, _o = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(go);
		t === null || t.matches(":disabled, .ui-disabled") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, vo = class {
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
		no(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(We);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Ht}="${CSS.escape(t)}"]`);
		n !== null && !n.hasAttribute("inert") && !n.disabled && n.click();
	}
	leave(e) {
		let t = this.changes;
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, yo = "data-ui-fallback-src", bo = `img[${yo}]`, xo = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(bo)) (So(e) || e.complete && e.naturalWidth === 0) && Co(e);
		C(this.root, bo, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && So(t) && Co(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Co(t);
	}
};
function So(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Co(e) {
	let t = e.getAttribute(yo);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/own-descendants.ts
function wo(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var To = "data-ui-radio-value", Eo = "ui-radio-group__input", Do = "ui-radio-group__dot", Oo = "ui-radio-group", ko = "ui-radio-group__item", Ao = "data-ui-radio-group-name", jo = "data-ui-radio-bind-value-id", Mo = "data-ui-radio-disabled", No = "ui-disabled", Po = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Oo}`)]);
		for (let e of this.root.querySelectorAll(`.${Oo}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Oo}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Fo));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [
				To,
				Mo,
				"class"
			],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Oo}`)) {
			let n = e.getAttribute(Ao);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Ao), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Ao, a);
			for (let e of wo(r, `.${Eo}`, `.${Oo}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Oo}`)) n.has(e.getAttribute(Ao) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(To), n = e.hasAttribute(Mo);
		for (let r of wo(e, `.${Eo}`, `.${Oo}`)) {
			r.checked = r.value === t;
			let e = n || Io(r);
			r.disabled !== e && (r.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(ko) ? [e] : [...e.querySelectorAll(`.${ko}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Eo}`) !== null) return;
		let t = e.closest(`.${Oo}`), n = t?.getAttribute(Ao);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Eo, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(jo);
		a !== null && r.setAttribute("data-ui-bind-value", a);
		let o = document.createElement("span");
		o.className = Do, e.prepend(r, o), this.sync(t);
	}
};
function Fo(e) {
	return e.classList.contains(Oo) ? [e] : [...e.querySelectorAll(`.${Oo}`)];
}
function Io(e) {
	let t = e.closest(`.${ko}`);
	return t !== null && (t.classList.contains(No) || t.querySelector(`:scope > .${No}`) !== null);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Lo(e) {
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
function Ro(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function zo(e, t) {
	return t !== null && e.length >= t;
}
function Bo(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : zo(e, n) ? null : [...e, t];
}
function Vo(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Ho = "data-ui-search-debounce", Uo = "data-ui-search-min-length", Wo = "data-ui-search-manual", Go = "ui-search__input", Ko = "ui-select", qo = "ui-select__popup", Jo = "ui-select__option", Yo = 300, Xo = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Go) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		Zo(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Ho), i = r === null ? Yo : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Yo));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Wo)) return;
		let t = e.getAttribute(Uo), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Zo(e) {
	let t = e.closest(`.${Ko}`), n = t?.querySelector(`.${qo}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Uo), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${Jo}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	es(t, n, o && s === 0);
}
function Qo(e) {
	let t = e.querySelector(`.${qo}`);
	t !== null && es(e, t, [...t.querySelectorAll(`.${Jo}`)].filter((e) => e.style.display !== "none").length === 0);
}
function $o(e) {
	let t = e.querySelector(`.${qo}`);
	if (t !== null) for (let e of t.querySelectorAll(`.${Jo}`)) e.style.display = "";
}
function es(e, t, n) {
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
var ts = "data-ui-select-value", ns = "data-ui-select-placement", E = "ui-select", rs = "ui-select--open", is = "ui-select__trigger", as = "ui-select__trigger-content", os = "data-ui-select-content", ss = "ui-select__placeholder", cs = "ui-input__affix-icon--prefix", ls = "ui-select__popup", us = "ui-select__option", ds = "ui-select__value-input", fs = "data-ui-select-clear", ps = "data-ui-select-trigger-mode", ms = "ui-search__input", hs = "ui-search-mode--replace", gs = "ui-text__title", _s = "ui-disabled", vs = "data-ui-active", ys = "ui-multi-select", bs = "ui-multi-select__chips", xs = "ui-multi-select__chip", Ss = "ui-multi-select__chip-label", Cs = "ui-multi-select__chip-remove", ws = "data-ui-select-chip", Ts = "data-ui-select-max", Es = 4, Ds = [
	ts,
	g,
	Ts,
	"class",
	m
];
function Os(e) {
	return e?.querySelector(`.${ms}`)?.readOnly === !0 || e?.querySelector(`.${is}`)?.getAttribute("aria-readonly") === "true";
}
function ks(e) {
	return e.classList.contains(ys);
}
function As(e) {
	return wo(e, `.${ls} .${us}`, `.${E}`);
}
function js(e) {
	return e === null ? null : e.querySelector(`.${gs}`)?.textContent ?? e.textContent;
}
function Ms(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ce), t.removeAttribute(m), t.removeAttribute(ue), t.removeAttribute(le);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Ns = class {
	root;
	openSelect = null;
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${E}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Rs(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Ds,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new si({
			openPopups: () => this.openSelect === null || !this.openSelect.isConnected ? [] : [this.openSelect],
			close: () => this.close()
		});
	}
	sync(e) {
		if (ks(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(ts);
		this.decorateOptions(e);
		let n = t === null ? null : As(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = js(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${ms}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(hs) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && $o(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${ss}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of As(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${ds}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), Qo(e);
	}
	syncMultiple(e) {
		let t = Lo(e.getAttribute(g)), n = new Set(t), r = zo(t, Ro(e.getAttribute(Ts)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = As(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		Fs(e, o.map((e) => ({
			key: e,
			label: Ps(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${ss}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${ds}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(g, l), Qo(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${is}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${as}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(os) === i) {
			r.removeAttribute(os);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = as;
			let e = n.querySelector(`:scope > .${cs}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Ms(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of As(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = Ls(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ms)) return;
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
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ms)) return;
		let t = e.target, n = t.closest(`.${E}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(hs)) return;
		let r = n.getAttribute(ts);
		r !== null && (t.value = js(As(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cs}`);
		if (t !== null) {
			let n = t.closest(`.${E}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Os(n) || this.removeChosen(n, t.closest(`.${xs}`)?.getAttribute(ws) ?? null));
			return;
		}
		let n = e.target.closest(`[${fs}]`);
		if (n !== null) {
			let t = n.closest(`.${E}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Os(t) || this.clearValue(t));
			return;
		}
		let r = e.target.closest(`.${is}`);
		if (r !== null) {
			let t = r.closest(`.${E}`);
			if (Os(t) || r.getAttribute(ps) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${us}`);
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
		let t = e.target.closest(`.${us}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${E}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains(is) ? e.target : null)?.closest(`.${E}`) ?? null;
		if (t === null || !ks(t) || Os(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${bs} > .${xs}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(ws)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ms) || !t.contains(e.target) ? null : As(t).find((e) => e.hasAttribute(vs) && !Ls(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), t || ($o(e), Qo(e)), e.classList.add(rs), this.positionPopup(e), this.describeTrigger(e, !0), this.openSelect = e, this.initializeFocus(e);
		}
	}
	describeTrigger(e, t) {
		let n = e.querySelector(`.${is}`), r = e.querySelector(`.${ls}`);
		n !== null && (n.setAttribute("aria-expanded", t ? "true" : "false"), r !== null && n.setAttribute("aria-controls", qt(r, "ui-select-popup")));
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = e.querySelector(`.${ls}`);
		t !== null && ui(e.querySelector(`.${is}`), t), e.classList.remove(rs), this.markActive(e, null), this.describeTrigger(e, !1), Pr(t), this.openSelect = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${is}`), n = e.querySelector(`.${ls}`), r = e.getAttribute(ns), i = r !== null && Cr(r) ? r : "bottom-start";
		t !== null && n !== null && kr(t, n, {
			placement: i,
			gap: Es,
			minAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = As(e).filter((e) => !Ls(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		if (T(t, n), this.markActive(e, n), e.querySelector(`.${is}`)?.getAttribute(ps) === "input") {
			let t = e.querySelector(`.${ms}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		n.focus();
	}
	moveFocus(e, t) {
		let n = As(e).filter((e) => !Ls(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(vs)) ?? null, i = Qi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (T(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t) {
		for (let n of As(e)) n === t ? n.setAttribute(vs, "") : n.hasAttribute(vs) && n.removeAttribute(vs);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || Ls(t)) return;
		if (ks(e)) {
			let r = Bo(Lo(e.getAttribute(g)), n, Ro(e.getAttribute(Ts)));
			this.markActive(e, t), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(ts) === n) {
			this.close();
			return;
		}
		e.setAttribute(ts, n), this.sync(e);
		let r = e.querySelector(`.${ds}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Vo(Lo(e.getAttribute(g)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${xs}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${is}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(g) : e.setAttribute(g, JSON.stringify(t)), this.sync(e), this.openSelect === e && this.positionPopup(e), e.querySelector(`.${ds}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (ks(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(ts)) return;
		e.removeAttribute(ts), this.sync(e);
		let t = e.querySelector(`.${ds}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Ps(e, t) {
	let n = js(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Fs(e, t) {
	let n = e.querySelector(`.${bs}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${xs}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(ws) === t[n].key && e.querySelector(`.${Ss}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Is(e.key, e.label)));
	}
}
function Is(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = xs, n.setAttribute(ws, e), r.className = Ss, r.textContent = t, i.className = Cs, i.type = "button", i.tabIndex = -1, i.setAttribute("aria-label", x.format("ui.select.remove", { label: t })), n.append(r, i), n;
}
function Ls(e) {
	return e.classList.contains(_s) || e.querySelector(`:scope > .${_s}`) !== null;
}
function Rs(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains(E) && t.add(n);
			for (let e of n.querySelectorAll(`.${E}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === ts || e.attributeName === "data-ui-selected-keys" || e.attributeName === Ts)) {
		e.target instanceof HTMLElement && e.target.classList.contains(E) && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${ls}`)?.closest(`.${E}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var zs = "data-ui-input-debounce", Bs = `input[${zs}], textarea[${zs}]`;
function Vs(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Bs);
}
var Hs = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Vs(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(zs));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Vs(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Us = "ui-slider__input", Ws = "ui-slider__value", Gs = "ui-slider__bubble", Ks = "ui-slider__track", qs = "ui-slider__thumb-anchor", Js = "ui-slider", Ys = "ui-orientation--vertical", Xs = "--ui-slider-fraction", Zs = 6, Qs = "Value", $s = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), ec = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!$s.has(e.propertyName)) return;
			let t = v(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Us}`);
				t !== null && (this.writeReadings(t), e.propertyName === Qs && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t != null && e.value !== String(t) && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Us) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = tc(e);
		t !== null && kr(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Zs
		});
	}
	releaseBubble(e) {
		Pr(tc(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Ks}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Ws}, .${Gs}`) ?? []) n.textContent = e.value;
		e.closest(`.${Ks}`)?.style.setProperty(Xs, String(nc(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function tc(e) {
	if (!(e instanceof Element) || !e.classList.contains(Us)) return null;
	let t = e.closest(`.${Ks}`), n = t?.querySelector(`.${Gs}`) ?? null, r = t?.querySelector(`.${qs}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${Js}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Ys)
	};
}
function nc(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var rc = {
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
}, ic = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], ac = [
	"$n",
	"n$",
	"$ n",
	"n $"
], oc = [
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
], sc = [
	"n %",
	"n%",
	"%n",
	"% n"
], cc = [
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
function lc(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return rc;
	try {
		return {
			...rc,
			...JSON.parse(t)
		};
	} catch {
		return rc;
	}
}
function uc(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = dc(t);
	if (r === null) return fc(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = pc(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? gc(ic[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = pc(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(mc(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = pc(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return gc(i ? oc[n.currencyNegativePattern] ?? "-$n" : ac[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = pc(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return gc(i ? cc[n.percentNegativePattern] ?? "-n %" : sc[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return fc(e, n);
	}
}
function dc(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function fc(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function pc(e, t, n, r, i) {
	let a = String(mc(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? hc(o, n, r) : `${hc(o, n, r)}${i}${s}`;
}
function mc(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function hc(e, t, n) {
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
function gc(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var _c = {
	readCulture: lc,
	format: uc
}, vc = /^-?(\d+(\.\d*)?|\.\d+)$/;
function yc(e, t, n) {
	if (!vc.test(e)) return e;
	let r = n.thousands ? t : Tc(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return uc(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return uc(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function bc(e, t, n) {
	return vc.test(e) ? (wc(n) ? Ec(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function xc(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = wc(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!vc.test(d)) return null;
	let f = a ? Ec(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Sc(e, t, n, r, i) {
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
function Cc(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function wc(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Tc(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Ec(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Dc = "ui-number-input", Oc = "ui-number-input__field", kc = "data-ui-number-no-decimals", Ac = "data-ui-number-no-negative", jc = "data-ui-number-no-thousands", Mc = "data-ui-number-trim-zeros", Nc = "data-ui-number-step", Pc = "data-ui-number-min", Fc = "data-ui-number-max", Ic = "data-ui-number-step-direction", Lc = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Oc}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Dn(e.components, `.${Oc}`));
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
		let t = this.values.get(e) ?? e.value, n = lc(e), r = e === document.activeElement ? bc(t, n, zc(e)) : yc(t, n, {
			format: zc(e),
			thousands: !e.hasAttribute(jc)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = Rc(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(kc), r = !t.hasAttribute(Ac), i = t.selectionStart ?? t.value.length, a = Sc(t.value, i, lc(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Rc(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Rc(e.target);
		if (t === null) return;
		let n = this.shown.get(t) === t.value ? null : xc(t.value, lc(t), zc(t));
		if (n !== null && this.values.set(t, n), t.hasAttribute(Mc)) {
			let e = this.values.get(t) ?? "", n = Cc(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Rc(e.target);
		if (t === null) return;
		let n = xc(t.value, lc(t), zc(t));
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Rc(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = bc(t, lc(e), zc(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Ic + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Oc}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(Nc) ?? "1"), i = t.getAttribute(Ic) === "down" ? -1 : 1, a = xc(n.value, lc(n), zc(n)), o = (Number(this.shown.get(n) === n.value ? this.valueOf(n) : a ?? "0") || 0) + r * i, s = n.getAttribute(Pc), c = n.getAttribute(Fc);
		s !== null && (o = Math.max(o, Number(s))), c !== null && (o = Math.min(o, Number(c))), this.commit(n, Bc(o)), this.show(n);
	}
};
function Rc(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Oc) ? e : null;
}
function zc(e) {
	return e.closest(`.${Dc}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Bc(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var Vc = {
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
function Hc(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Vc;
	try {
		return {
			...Vc,
			...JSON.parse(t)
		};
	} catch {
		return Vc;
	}
}
var Uc = [
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
function Wc(e, t, n) {
	if (t == null || t.trim().length === 0) return `${D(e.getFullYear(), 4)}-${D(e.getMonth() + 1, 2)}-${D(e.getDate(), 2)} ${D(e.getHours(), 2)}:${D(e.getMinutes(), 2)}:${D(e.getSeconds(), 2)}`;
	let r = "", i = Gc(t);
	for (let a = 0; a < t.length;) {
		let o = Kc(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += qc(o, e, n, i), a += o.length;
	}
	return r;
}
function Gc(e) {
	for (let t = 0; t < e.length;) {
		let n = Kc(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function Kc(e, t) {
	for (let n of Uc) if (e.startsWith(n, t)) return n;
	return null;
}
function qc(e, t, n, r) {
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
var Jc = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Yc(e) {
	let t = Jc.exec(e.trim());
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
function Xc(e) {
	return new Date(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
var Zc = {
	readCulture: Hc,
	format: Wc,
	parse: Yc,
	toDate: Xc
}, O = "ui-temporal-input", Qc = "ui-temporal-input__value-input", $c = "ui-temporal-input__end-value-input", el = "data-ui-temporal-range", tl = "data-ui-temporal-end", nl = "data-ui-temporal-mode", rl = "data-ui-temporal-format", il = "data-ui-temporal-default-format", al = "data-ui-temporal-min", ol = "data-ui-temporal-max", sl = "data-ui-temporal-step", cl = "data-ui-temporal-step-unit", ll = /* @__PURE__ */ new Set([
	rl,
	al,
	ol
]), ul = 2e3;
function dl(e) {
	let t = e.getAttribute(nl);
	return t === "time" || t === "date-time" ? t : "date";
}
function fl(e) {
	let t = e.getAttribute(rl);
	return t === null || t.trim().length === 0 ? e.getAttribute(il) ?? "" : t;
}
function pl(e) {
	let t = e.getAttribute(cl), n = Math.max(1, Math.trunc(Number(e.getAttribute(sl))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function ml(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function hl(e) {
	return {
		monthNames: gl(e, "data-ui-temporal-months"),
		monthGenitiveNames: gl(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: gl(e, "data-ui-temporal-months-short"),
		dayNames: gl(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: gl(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function gl(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function _l(e) {
	return e.hasAttribute(el);
}
function vl(e) {
	return e !== null && e.hasAttribute(tl);
}
function yl(e) {
	return k(e, !1);
}
function k(e, t) {
	let n = bl(e, t);
	return n === null ? null : Al(n.value, dl(e));
}
function bl(e, t) {
	return e.querySelector(`.${t ? $c : Qc}`);
}
function xl(e, t) {
	return Al(e.getAttribute(t) ?? "", dl(e));
}
function Sl(e, t, n) {
	let r = bl(e, n);
	if (r === null) return;
	let i = t === null ? "" : jl(t, dl(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Cl(e) {
	if (!_l(e)) return;
	let t = k(e, !1), n = k(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (Sl(e, n, !1), Sl(e, t, !0));
}
function wl(e) {
	Tl(e, !1), _l(e) && Tl(e, !0);
}
function Tl(e, t) {
	let n = k(e, t);
	if (n === null) return;
	let r = Dl(e, n);
	r.getTime() !== n.getTime() && Sl(e, r, t);
}
function El(e) {
	return Ol(e, Dl(e, /* @__PURE__ */ new Date()));
}
function Dl(e, t) {
	let n = xl(e, al), r = xl(e, ol);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Ol(e, t) {
	let n = pl(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var kl = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Al(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = kl.exec(n);
		return e === null ? null : new Date(ul, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Yc(n);
	return r === null ? null : Xc(r);
}
function jl(e, t) {
	let n = `${Ml(e.getHours())}:${Ml(e.getMinutes())}:${Ml(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Ml(e.getMonth() + 1)}-${Ml(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Ml(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Nl(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Fl(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Il(e.start).getTime() ? {
		start: Fl(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Fl(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Pl(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Il(e).getTime();
	return r > Il(t).getTime() && r < Il(n).getTime();
}
function Fl(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Il(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
var Ll = 100 / 3;
function Rl(e, t, n) {
	let r = n ? t : t * Ll, i = (Math.sign(e) === Math.sign(r) ? e : 0) + r, a = Math.trunc(i / 100) || 0;
	return {
		steps: a,
		carried: i - a * 100
	};
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var zl = "ui-temporal-input__field", Bl = "ui-temporal-input__popup", Vl = "ui-temporal-input--open", Hl = "ui-temporal-input__day", Ul = "ui-temporal-input__month", A = "ui-temporal-input__time-cell", Wl = "ui-temporal-input__time-column", Gl = 4, Kl = 140, ql = "data-ui-temporal-toggle", Jl = "data-ui-temporal-first-day", Yl = "data-ui-temporal-nav", Xl = "data-ui-temporal-day", Zl = "data-ui-temporal-unit", Ql = "data-ui-temporal-cell", $l = "data-ui-temporal-centred", eu = class {
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
			let t = Dn(e.components, `.${O}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), C(this.root, `.${O}`, { attributeFilter: [...ll] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), C(this.root, `.${O}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), new si({
			openPopups: () => this.openPicker === null ? [] : [this.openPicker],
			close: () => this.close()
		});
	}
	applyDisplay(e) {
		for (let t of e) {
			wl(t);
			for (let e of t.querySelectorAll(`.${zl}`)) {
				if (e === document.activeElement && this.written.has(e)) continue;
				this.written.add(e);
				let n = bl(t, vl(e))?.value ?? "", r = Al(n, dl(t));
				if (r !== null) {
					e.value = Wc(r, fl(t), hl(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(zl)) return;
		let t = e.target.closest(`.${O}`), n = t === null ? null : bl(t, vl(e.target));
		t !== null && n !== null && (n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), Cl(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(zl)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && _l(t) && (this.getState(t).activeEnd = vl(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !_l(t) || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Xl}]`) : null;
		if (n !== null && !t.contains(n)) return;
		let r = this.getState(t), i = n === null ? null : Al(n.getAttribute(Xl) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, vu(t, r));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(zl)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ql}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${O}`));
			return;
		}
		let n = e.target.closest(`.${Bl}`)?.closest(`.${O}`);
		if (n == null) return;
		let r = e.target.closest(`[${Yl}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Yl) ?? "");
			return;
		}
		let i = e.target.closest(`[${Xl}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(Xl) ?? "");
			return;
		}
		let a = e.target.closest(`[${Ql}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Zl}]`)?.getAttribute(Zl);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Ql)));
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
				n.view = Pu(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Pu(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, El(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), _l(e) && this.commit(e, null, !0), n.activeEnd = "start", this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = Al(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (_l(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = yl(e) ?? El(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = ju(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = El(e), i = Nl({
			start: k(e, !1),
			end: k(e, !0)
		}, t.activeEnd, bu(n, r));
		t.focusedDay = i.end ?? i.start, t.view = ju(n), t.activeEnd = i.active, t.hoverDay = null, Sl(e, i.end, !0), Sl(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = _l(e) && this.getState(e).activeEnd === "end", i = new Date(k(e, r) ?? El(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Sl(e, t, n), Cl(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(zl)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${O}`), vl(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(A)) {
			Cu(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Hl)) return;
		let n = Al(e.target.getAttribute(Xl) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, jl(n, "date"));
			return;
		}
		let r = Au(n, e.key, ku(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = ju(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Wl}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Kl)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Wl}`), n = t?.getAttribute(Zl) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Rl(this.wheelTurns.get(n) ?? 0, e.deltaY, e.deltaMode === WheelEvent.DOM_DELTA_PIXEL);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${A}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${A}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${A}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(Ql)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute($l));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(Zl), i = fu(e);
		if (!(r === null || i === null || i.classList.contains(`${A}--selected`))) {
			if (i.matches(":disabled")) {
				uu(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Ql)));
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
		n.activeEnd = _l(e) ? t ?? (k(e, !1) === null ? "start" : k(e, !0) === null ? "end" : n.activeEnd) : "start", n.hoverDay = null;
		let r = k(e, n.activeEnd === "end") ?? yl(e);
		n.pane = "days", n.view = ju(r ?? Dl(e, /* @__PURE__ */ new Date())), n.focusedDay = r, e.classList.add(Vl), e.querySelector(`[${ql}]`)?.setAttribute("aria-expanded", "true"), e.querySelector(`.${Bl}`)?.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = e.querySelector(`.${Bl}`);
		for (let e of this.columnSettles.values()) window.clearTimeout(e);
		this.columnSettles.clear(), this.wheelTurns.clear(), t !== null && (ui(yu(e, this.getState(e).activeEnd === "end"), t), t.removeEventListener("wheel", this.onColumnWheel)), e.classList.remove(Vl), e.querySelector(`[${ql}]`)?.setAttribute("aria-expanded", "false"), Pr(t), this.openPicker = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${O}__row`), n = e.querySelector(`.${Bl}`);
		t !== null && n !== null && kr(t, n, {
			placement: "bottom-end",
			gap: Gl
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: ju(yl(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: yl(e),
			activeEnd: "start",
			hoverDay: null
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${Bl}`);
		if (n === null) return;
		let r = dl(e), i = this.getState(e), a = hl(e), o = _l(e), s = k(e, o && i.activeEnd === "end"), c = pu(n), l = mu(n), u = n.contains(document.activeElement);
		n.replaceChildren(), o && n.append(_u(i));
		let d = j("div", `${O}__panes`);
		d.append(tu(e, i, a, s)), r === "date-time" && d.append(iu(e, s)), n.append(d, gu(r));
		let f = l === null ? null : n.querySelector(`[${Yl}="${CSS.escape(l)}"]`);
		Su(n, i, s, t || u && c === null && f === null), vu(e, i), lu(n), uu(n), hu(n, c), f?.focus({ preventScroll: !0 }), this.positionPopup(e);
	}
};
function tu(e, t, n, r) {
	let i = j("div", `${O}__calendar`), a = j("div", `${O}__calendar-header`);
	a.append(xu("previous", "‹", x.text("ui.picker.previous")));
	let o = xu("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${O}__calendar-label`), a.append(o), a.append(xu("next", "›", x.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? nu(e, t, n, r) : ru(t, n)), i;
}
function nu(e, t, n, r) {
	let i = ku(e), a = j("div", `${O}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = j("span", `${O}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = j("div", `${O}__days`), s = Il(/* @__PURE__ */ new Date()), c = _l(e), l = c ? k(e, !1) : r, u = c ? k(e, !0) : null, d = Mu(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = Nu(d, n), i = j("button", Hl);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(Xl, jl(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${Hl}--outside`), Fu(r, s) && i.classList.add(`${Hl}--today`), (l !== null && Fu(r, l) || u !== null && Fu(r, u)) && (i.classList.add(`${Hl}--selected`), i.setAttribute("aria-selected", "true")), Pl(r, l, u) && i.classList.add(`${Hl}--within`), Du(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = j("div", `${O}__calendar-pane`);
	return f.append(a, o), f;
}
function ru(e, t) {
	let n = j("div", `${O}__months`);
	for (let r = 0; r < 12; r++) {
		let i = j("button", Ul);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Yl, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${Ul}--selected`), n.append(i);
	}
	return n;
}
function iu(e, t) {
	let n = pl(e), r = j("div", `${O}__time`), i = j("div", `${O}__time-columns`);
	for (let r of au(n)) i.append(cu(e, r, ou(n, r), t));
	return r.append(i), r;
}
function au(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function ou(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function su(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function cu(e, t, n, r) {
	let i = j("div", Wl);
	i.setAttribute(Zl, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", x.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = su(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = j("button", A);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(Ql, String(c)), c === o && (n.classList.add(`${A}--selected`), n.setAttribute("aria-selected", "true")), Ou(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function lu(e) {
	let t = e.querySelector(`.${O}__calendar`), n = e.querySelector(`.${O}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function uu(e) {
	for (let t of e.querySelectorAll(`.${Wl}`)) {
		let e = t.querySelector(`.${A}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, du(t, e), t.setAttribute($l, String(t.scrollTop));
	}
}
function du(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function fu(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${A}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function pu(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(A) ? null : t.closest(`.${Wl}`)?.getAttribute(Zl) ?? null;
}
function mu(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Yl) : null;
}
function hu(e, t) {
	t !== null && e.querySelector(`.${Wl}[${Zl}="${t}"]`)?.querySelector(`.${A}--selected`)?.focus({ preventScroll: !0 });
}
function gu(e) {
	let t = j("div", `${O}__popup-footer`);
	return t.append(xu("now", x.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(xu("clear", x.text("ui.picker.clear"))), t.append(xu("done", x.text("ui.picker.done"))), t;
}
function _u(e) {
	let t = j("div", `${O}__period-caption`);
	return t.textContent = x.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function vu(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? k(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Hl}`)) {
		let e = Al(t.getAttribute(Xl) ?? "", "date");
		t.classList.toggle(`${Hl}--preview`, e !== null && n !== null && r !== null && Pl(e, n, Nu(r, 1)));
	}
}
function yu(e, t) {
	for (let n of e.querySelectorAll(`.${zl}`)) if (vl(n) === t) return n;
	return e.querySelector(`.${zl}`);
}
function bu(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function xu(e, t, n) {
	let r = j("button", `${O}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Yl, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function j(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Su(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Hl}`)];
	if (i.length === 0) return;
	let a = jl(Il(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(Xl) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (T(i, o), r && o.focus({ preventScroll: !0 }));
}
function Cu(e) {
	let t = e.target, n = t.closest(`.${Wl}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? Tu(n, e.key === "ArrowRight" ? 1 : -1) : wu(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), Eu(r));
}
function wu(e, t, n) {
	return Qi({
		key: n,
		items: [...e.querySelectorAll(`.${A}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function Tu(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Wl}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${A}--selected`) ?? r.querySelector(`.${A}:not(:disabled)`);
}
function Eu(e) {
	let t = e.closest(`.${Wl}`);
	t !== null && du(t, e);
}
function Du(e, t) {
	let n = xl(e, al), r = xl(e, ol);
	return n !== null && t.getTime() < Il(n).getTime() || r !== null && t.getTime() > Il(r).getTime();
}
function Ou(e, t, n, r) {
	let i = xl(e, al), a = xl(e, ol);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function ku(e) {
	let t = Number(e.getAttribute(Jl));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Au(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Nu(e, -1);
		case "ArrowRight": return Nu(e, 1);
		case "ArrowUp": return Nu(e, -7);
		case "ArrowDown": return Nu(e, 7);
		case "PageUp": return Pu(e, -1);
		case "PageDown": return Pu(e, 1);
		case "Home": return Nu(e, -r);
		case "End": return Nu(e, 6 - r);
		default: return null;
	}
}
function ju(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function Mu(e, t) {
	let n = ju(e);
	return Nu(n, -((n.getDay() - t + 7) % 7));
}
function Nu(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Pu(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Fu(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var Iu = "[data-ui-theme-switcher]", Lu = "data-ui-theme", Ru = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(Iu) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Jt.SetTheme,
				mode: zu() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function zu() {
	let e = document.documentElement.getAttribute(Lu);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var Bu = "data-ui-context-menu-owner", Vu = ve, Hu = "data-ui-context-menu-use", Uu = "ui-context-menu--open", Wu = "ui-menu", Gu = `.ui-menu-item:not(${rt})`, Ku = "ui-context-menu-opening", qu = at, Ju = class {
	root;
	openMenu = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1), new si({
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
		let n = t.closest(`[${he}]`), r = t.closest(`[${Hu}]`);
		for (let i = t.closest(`[${Bu}]`); i !== null; i = i.parentElement?.closest(`[${Bu}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute(Hu) ?? "" : "", o = [a.length > 0 ? Xu(i, a) : null, Xu(i, "")].filter((e) => e !== null);
			if (o.length === 0) continue;
			if (Zu(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.close(), this.open(s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(Ku, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n) {
		this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null, e.classList.add(Uu), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${Yr(t, r.width, window.innerWidth)}px`, e.style.top = `${Yr(n, r.height, window.innerHeight)}px`, Yu(e);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(qu) !== null || this.close();
	}
	close() {
		if (this.openMenu === null) return;
		let e = this.openMenu;
		this.openMenu = null, ui(this.returnFocus, e), this.returnFocus = null, e.classList.remove(Uu);
	}
};
function Yu(e) {
	let t = e.querySelector(`.${Wu}`);
	if (t === null) return;
	let n = wo(t, Gu, `.${Wu}`), r = n.find(ta) ?? null;
	r !== null && (T(n, r), r.focus({ preventScroll: !0 }));
}
function Xu(e, t) {
	for (let n of e.querySelectorAll(`[${Vu}]`)) if ((n.getAttribute(Vu) ?? "") === t && n.closest(`[${Bu}]`) === e) return n;
	return null;
}
function Zu(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/inline-rename.ts
var Qu = "data-ui-rename-field";
function $u(e) {
	return e instanceof Element && e.closest(`[${Qu}]`) !== null;
}
function ed(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Qu, ""), r.value = e.value, td(r, n, t);
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
function td(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/dialog-engine.ts
var nd = "data-ui-dialog", rd = "data-ui-dialog-modal", id = "data-ui-dialog-close-backdrop", ad = "data-ui-dialog-close-escape", od = "data-ui-dialog-backdrop", sd = "ui-dialog__surface", cd = class {
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
		let n = li(t.querySelector(`.${sd}`) ?? t, t.querySelector(ci));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), ui(n?.isConnected === !0 ? n : null, t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${nd}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${od}]`);
		if (n === null) return;
		let r = n.closest(`[${nd}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(id)) return;
		let i = r.getAttribute(nd);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(ad) && !ii() && !$u(e.target) && !mo(e.target)) {
				let n = t.getAttribute(nd);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(rd) && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(Ut)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return ld(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(ci)].filter((e) => ta(e) || e === document.activeElement);
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
function ld(e) {
	let t = e.querySelectorAll(`[${nd}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ud(e) {
	let t = ld(e);
	return t !== null && t.hasAttribute(rd) ? t : null;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function dd(e) {
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
		default: o = _d(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function fd(e, t, n = md()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var pd = null;
function md() {
	return pd === null && (pd = hd()), pd;
}
function hd() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function gd(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function _d(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : vd[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : vd[t] ?? null;
}
var vd = {
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
}, yd = "ui-menu", bd = "ui-menu-item", xd = "ui-menu-item--selected", Sd = "ui-context-menu", Cd = "ui-orientation--horizontal", wd = "data-ui-menu-shortcut", Td = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(Dd) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [wd, Qe]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${yd}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && T(t, t.find((e) => e.classList.contains(xd) && ta(e)) ?? t.find(ta) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bd}`), n = t?.closest(`.${yd}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			Ed(e, t);
			return;
		}
		let r = this.ownItems(n), i = Qi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Cd) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), T(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bd}`), n = t?.closest(`.${yd}`) ?? null;
		t !== null && n !== null && T(this.ownItems(n), t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || Od(e))) return;
		let t = ud(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !fd(n.shortcut, e))) {
			if (!ta(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${wd}]`)) {
			if (e.closest(`.${Sd}`) !== null) continue;
			let t = dd(e.getAttribute(wd));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(wd)
				});
				continue;
			}
			let n = gd(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(wd),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return wo(e, `.${bd}:not(${rt})`, `.${yd}`);
	}
};
function Ed(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(rt) || !ta(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function Dd(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${yd}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(yd) || t.querySelector(`.${yd}`) !== null)) return !0;
	return !1;
}
function Od(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var kd = "ne.ui", Ad = "boot", jd = /* @__PURE__ */ new Set(), Md = class {
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
		let r = this.resolveKey(e, Ad);
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
			return jd.has(n) || (jd.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${kd}:${n}:${t}`;
	}
}, Nd = "ui-menu", Pd = "ui-menu--nested", Fd = "ui-menu-item", Id = "ui-menu-item--selected", Ld = "ui-menu__submenu", Rd = qe, zd = Ye, Bd = "data-ui-menu-flyout", Vd = Je, Hd = "menu-open-group", Ud = class {
	root;
	store = new Md();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), new si({
			openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
			close: () => this.closeFlyout(),
			onPress: !0,
			onWindowBlur: !0
		}), this.reconcileEach(this.root.querySelectorAll(`.${Nd}`)), C(this.root, `.${Nd}`, {
			childList: !0,
			attributeFilter: [Ke]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${Rd}]`)) Wd(e);
		C(this.root, `[${Rd}]`, {
			childList: !0,
			attributeFilter: [zd]
		}, (e) => {
			for (let t of e) Wd(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Gd(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.closeFlyout(), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Rd}]`)) Wd(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Id}`), e);
		if (t !== null && !t.hasAttribute(Vd)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Pd) ? null : this.store.read(e, Hd), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fd}`);
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
		let r = n.closest(`.${Nd}`);
		r !== null && (Gd(r) || n.hasAttribute(Vd) ? this.toggleFlyout(r, n, t) : this.toggleInline(r, n));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Pd);
		if (t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(zd);
			return;
		}
		if (t.hasAttribute(zd)) {
			t.removeAttribute(zd), n || this.store.write(e, Hd, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Hd, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(zd, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Rd}][${zd}]`)) t.hasAttribute(Vd) || t.removeAttribute(zd);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(zd, ""), r.setAttribute(Bd, ""), this.openFlyout = r, kr(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, Pr(e), e.removeAttribute(Bd), e.parentElement?.removeAttribute(zd));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Rd}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(it) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Rd}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Ld}`);
	}
};
function Wd(e) {
	let t = e.querySelector(`:scope > .${Fd}`), n = e.closest(`.${Nd}`);
	t !== null && (t.setAttribute("aria-expanded", e.hasAttribute(zd) ? "true" : "false"), e.hasAttribute(Vd) || n !== null && Gd(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Gd(e) {
	return e.hasAttribute(Ke);
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Kd = `.ui-menu[${Xe}]`, qd = ":scope > .ui-collapsible__bar", Jd = ":scope > .ui-menu__host", Yd = "ui-menu__item", Xd = ":scope > .ui-menu-item", Zd = "ui-menu-item", Qd = ".ui-text__title", $d = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", ef = /\p{M}/gu, tf = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), C(t, Kd, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ke]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = nf(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(Jd);
		if (n === null) return;
		let r = rf(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: cf(n)
		}), e.setAttribute(Ze, ""), this.filter(n, r);
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of lf(e)) {
			let e = uf(a);
			if (e === "header") {
				n !== null && ff(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			ff(a, o), r ||= o, i ||= o;
		}
		return n !== null && ff(n, r), i;
	}
	match(e, t) {
		let n = sf(df(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector($d) : null;
		if (r === null) return n;
		if (n) return pf(r), e.removeAttribute(Ye), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Ye, i), i;
	}
	clear(e, t) {
		pf(t), e.removeAttribute(Ze);
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
		let t = [...nf(e.target)?.querySelector(Jd)?.querySelectorAll(`.${Zd}:not(${rt})`) ?? []].find(ta);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function nf(e) {
	let t = e.closest(Kd), n = t?.querySelector(qd) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function rf(e, t) {
	return of(e, af(t)).split(/\s+/).filter((e) => e.length !== 0);
}
function af(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function of(e, t) {
	let n = e.normalize("NFD").replace(ef, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function sf(e, t) {
	return t.every((t) => e.includes(t));
}
function cf(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${qe}][${Ye}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function lf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(Yd));
}
function uf(e) {
	return e.querySelector(Xd)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function df(e) {
	return of(e.querySelector(Xd)?.querySelector(Qd)?.textContent ?? "", af(e));
}
function ff(e, t) {
	e.toggleAttribute(Qe, !t);
}
function pf(e) {
	for (let t of e.querySelectorAll(`[${Qe}]`)) t.removeAttribute(Qe);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var mf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], hf = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function gf(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${hf[t]}px)`)) return t;
	return "base";
}
function _f(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function M(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function vf(e, t) {
	let n;
	for (let r of mf) {
		let i = M(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var yf = "[data-ui-root]", bf = "a[href]", xf = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${hf.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${$e}]`);
		if (t !== null) {
			let e = t.closest(yf), n = t.getAttribute($e);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(bf)?.closest(`[${tt}]`), r = n?.parentElement ?? null;
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
		for (let e of document.querySelectorAll(`${yf}[${et}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(et);
		e.removeAttribute(et), this.markToggles(e), t !== null && document.activeElement !== null && e.querySelector(`:scope > [data-ui-region="${CSS.escape(t)}"]`)?.contains(document.activeElement) && e.querySelector(`[${$e}="${CSS.escape(t)}"]`)?.focus();
	}
	markToggles(e) {
		let t = e.getAttribute(et);
		for (let n of e.querySelectorAll(`[${$e}]`)) n.setAttribute("aria-expanded", String(n.getAttribute($e) === t));
	}
}, Sf = "ui-collapsible", Cf = "ui-collapsible__content", wf = "ui-collapsible__bar", Tf = "collapsed", Ef = 200, Df = "cubic-bezier(0.4, 0, 0.2, 1)", Of = class {
	root;
	store = new Md();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Sf}`)), C(this.root, `.${Sf}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, Tf);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ot}]`), n = t?.closest(`.${Sf}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(Ke), i = n.querySelector(`:scope > .${Cf}`);
		this.cancelFold(n);
		let a = Af(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Tf, r ? "true" : "false", r ? { attributes: { [Ke]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Ke, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${ot}], :scope > .${wf} > [${ot}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let i = kf(e), a = Af(e, t);
		if (n.component === a.component) return;
		e.setAttribute(st, "");
		let o = {
			duration: Ef,
			easing: Df
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
function kf(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Af(e, t) {
	let n = kf(e);
	return {
		component: e.getBoundingClientRect()[n],
		content: t?.getBoundingClientRect()[n] ?? 0
	};
}
//#endregion
//#region src/interactions/pointer-drag.ts
var jf = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), window.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), e.root.addEventListener("focusout", (e) => Mf(e.target), !0);
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
			t.setAttribute(jt, ""), t.tabIndex >= 0 && (t.setAttribute(Mt, ""), t.focus({ preventScroll: !0 })), this.drag = {
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
		this.drag = null, t.removeAttribute(jt), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (Mf(e.target), !(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(jt);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
function Mf(e) {
	e instanceof Element && e.hasAttribute("data-ui-pointer-focus") && e.removeAttribute(Mt);
}
//#endregion
//#region src/interactions/grid-tracks.ts
function Nf(e) {
	let t = [];
	for (let n of If(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Nf(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Pf(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Pf(e) {
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
	if (n !== null) return Ff({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Ff(r[3] === "fr" ? {
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
function Ff(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function If(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Lf(e, t = "auto") {
	return e.map((e) => Rf(e, t)).join(" ");
}
function Rf(e, t) {
	switch (e.kind) {
		case "px": return `${zf(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${zf(e.min)}px`}, ${zf(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${zf(e.max)}px)` : `minmax(${zf(e.min)}px, auto)`;
	}
}
function zf(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Bf(e) {
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
function Vf(e, t) {
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
function Hf(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Uf(r, e), o = Uf(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Uf(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function Wf(e, t, n, r) {
	let i = Gf(e, t, n.before), a = Gf(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = Xf(n.before, e) + Xf(n.after, e), r = i.total + a.total;
		Kf(l, e, i, t * (i.total + c) / r), Kf(l, e, a, t * (a.total - c) / r);
	} else u || qf(l, i, i.total + c), d || qf(l, a, a.total - c);
	return l;
}
function Gf(e, t, n) {
	let r = Yf(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Kf(e, t, n, r) {
	let i = Xf(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function qf(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Jf(e[i])
		};
	}
}
function Jf(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Yf(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Xf(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Zf(e, t) {
	let n = Yf(t.before, e), r = n + Yf(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Qf(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function $f(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var ep = "ui-grid-splitter", tp = "ui-container", np = "ui-orientation--vertical", rp = 16, ip = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: ct,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, ap = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: lt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, op = class {
	root;
	store = new Md();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new jf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ep}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${ep}`)), C(this.root, `.${ep}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = sp(t);
			e !== null && (this.restore(e, cp(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of mf) {
			let i = r[n], a = _f(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ep}`);
		if (t === null || this.drag.active) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = pp(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${ep}`), n = t === null ? null : sp(t);
		if (t === null || n === null) return;
		let r = cp(t);
		for (let e of mf) n.style.removeProperty(_f(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = Wf(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(_f(e.axis.split, e.tier), Lf(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of mf) {
			let a = _f(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = sp(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = cp(e), r = gf(), i = lp(t, n, r), a = i === null ? null : Nf(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Vf(a, Bf(t.getAttribute(n.limits))), s = up(t, n), c = dp(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Hf(c, fp(t, n).map((e) => dp(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = sp(e);
		if (t === null) return;
		let n = cp(e), r = dp(e, n), i = up(t, n), a = fp(t, n).map((e) => dp(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : Hf(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Zf(i, o))));
	}
};
function sp(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(tp) ? t : null;
}
function cp(e) {
	return e.classList.contains(np) ? ip : ap;
}
function lp(e, t, n) {
	for (let r = mf.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(_f(t.split, mf[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function up(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function dp(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function fp(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(ep) && cp(r) === t && n.push(r);
	return n;
}
function pp(e) {
	let t = Number(e.getAttribute(ut));
	return Number.isFinite(t) && t > 0 ? t : rp;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var mp = "ui-split-button", hp = "ui-split-button__main", gp = "ui-split-button__toggle", _p = "ui-split-button__menu", vp = "ui-split-button--open", yp = "ui-menu-item", bp = 4, xp = class {
	root;
	open = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1), new si({
			openPopups: () => this.open === null ? [] : [this.open],
			close: () => this.close()
		});
	}
	handleClick(e) {
		let t = Sp(e.target);
		if (t !== null) {
			e.preventDefault(), this.open === t ? this.close() : this.openMenu(t);
			return;
		}
		this.open !== null && e.target instanceof Element && e.target.closest(`.${hp}`)?.closest(`.${mp}`) === this.open && this.close();
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Sp(e.target);
		t !== null && this.open !== t && (e.preventDefault(), this.openMenu(t));
	}
	handleChoice(e) {
		if (this.open === null || !(e.target instanceof Element)) return;
		let t = Cp(this.open), n = e.target.closest(`.${yp}`);
		t === null || n === null || !t.contains(n) || n.matches(`${rt}, ${at}`) || this.close();
	}
	openMenu(e) {
		this.close();
		let t = Cp(e);
		if (t !== null) {
			this.open = e, e.classList.add(vp);
			for (let t of wp(e)) t.setAttribute("aria-expanded", "true");
			kr(e, t, {
				placement: "bottom-end",
				gap: bp
			}), this.returnFocus = li(t);
		}
	}
	close() {
		let e = this.open;
		if (e === null) return;
		this.open = null, e.classList.remove(vp);
		for (let t of wp(e)) t.setAttribute("aria-expanded", "false");
		let t = Cp(e);
		t !== null && (Pr(t), ui(this.returnFocus, t)), this.returnFocus = null;
	}
};
function Sp(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${gp}, .${hp}`), n = t?.closest(`.${mp}`) ?? null;
	return t === null || n === null || t.classList.contains(hp) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Cp(e) {
	return e.querySelector(`:scope > .${_p}`);
}
function wp(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Tp = "ui-button-group", Ep = "ui-button-group__item", Dp = "ui-button", Op = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Tp}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), C(this.root, `.${Tp}`, {
			childList: !0,
			attributeFilter: [Ft]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = kp(i);
			i.toggleAttribute(Pt, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		T(n, r ?? n.find(ta) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ep}`), n = t?.closest(`.${Tp}`) ?? null;
		t === null || n === null || t.closest(`.${Tp}`) !== n || n.matches(".ui-disabled") || kp(t)?.matches(".ui-disabled, :disabled") !== !0 && this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ep} > .${Dp}`), n = t?.closest(`.${Tp}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(kp).filter((e) => e !== null), i = Qi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Ep}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		fa(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Ft,
			bindingAttribute: It,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return wo(e, `.${Ep}`, `.${Tp}`);
	}
};
function kp(e) {
	return e.querySelector(`:scope > .${Dp}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Ap = "ui-accordion", jp = "details", Mp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Ap}`)), C(this.root, `.${Ap}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Ap))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${jp}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function Np(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var Pp = "ui-tab-overflow", Fp = "ui-tab-overflow__menu", Ip = "ui-tab-overflow__menu--open", Lp = "ui-tab-overflow__entry", Rp = "ui-tab-overflow__entry--current", zp = class {
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
		this.options = e, this.list = new Vp(e.pick);
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
		let r = Bp({
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
function Bp(e) {
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
var Vp = class {
	pick;
	menu;
	button = null;
	strip = null;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Fp, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("focusout", (e) => this.handleFocusOut(e)), new si({
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
		this.close(), this.menu.replaceChildren(...n.map(Hp)), this.menu.parentElement === null && document.body.appendChild(this.menu), this.button = e, this.strip = t, this.menu.classList.add(Ip), e.setAttribute("aria-expanded", "true"), kr(e, this.menu, {
			placement: "bottom-end",
			gap: 4
		});
		let r = this.menu.querySelector(`.${Rp}`) ?? this.menu.querySelector(`.${Lp}`);
		T(this.entries(), r), r?.focus({ preventScroll: !0 });
	}
	close() {
		this.button !== null && (ui(this.button, this.menu), Pr(this.menu), this.menu.classList.remove(Ip), this.button.setAttribute("aria-expanded", "false"), this.button = null, this.strip = null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lp}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.strip;
		t !== null && n !== null && r !== null && (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		let t = this.entries(), n = Qi({
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
		return Array.from(this.menu.querySelectorAll(`.${Lp}`));
	}
};
function Hp(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Lp} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(Rp, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var Up = "ui-tabs", Wp = "ui-tab-header", Gp = "ui-tab-header--selected", Kp = "ui-tab-header--overflowed", qp = "ui-tabs--overflowing", Jp = "ui-tabs--no-overflow", Yp = "ui-tabs__strip", Xp = "data-ui-tab-key", Zp = "data-ui-tab-page", Qp = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zp({
			rootClass: Up,
			overflowingClass: qp,
			wrapsClass: Jp,
			hiddenClass: Kp,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${Up}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), C(this.root, `.${Up}`, {
			childList: !0,
			attributeFilter: [Lt, ...Vt],
			relevant: (e) => !Qr(e, `[${Zp}]`, `.${Up}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(Xp) ?? "") === t) ?? null;
		if (r !== null && !Np(r)) {
			let t = n.find(Np);
			if (t !== void 0) {
				this.select(e, t.getAttribute(Xp) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(Xp) ?? "") === t;
			e.classList.toggle(Gp, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(Np), i), T(n.filter((e) => !e.classList.contains(Kp)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(Zp) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${Yp}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(Xp) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(Np).map((e) => {
				let n = e.getAttribute(Xp) ?? "";
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
		let t = e.target.closest(`.${Pp}`), n = t?.closest(`.${Up}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${Up}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Wp}`);
		if (r === null || r.matches(":disabled, .ui-disabled")) return;
		let i = r.closest(`.${Up}`), a = r.getAttribute(Xp);
		i !== null && a !== null && r.closest(`.${Up}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Wp}`), n = t?.closest(`.${Up}`) ?? null;
		if (t === null || n === null) return;
		let r = Qi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(Xp) ?? ""), r.focus());
	}
	select(e, t) {
		fa(e, t, {
			attribute: Lt,
			bindingAttribute: It,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return wo(e, `.${Wp}`, `.${Up}`);
	}
	ownPages(e) {
		return wo(e, `[${Zp}]`, `.${Up}`);
	}
}, $p = "ui-breadcrumbs", em = "ui-breadcrumbs__item", tm = "ui-breadcrumb", nm = "ui-breadcrumb--current", rm = "ui-hidden", im = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), C(this.root, `.${$p}`, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${$p}`)) this.apply(e);
	}
	apply(e) {
		let t = wo(e, `.${em}`, `.${$p}`).filter((e) => !e.classList.contains(rm)).map((e) => e.querySelector(`.${tm}`)).filter((e) => e !== null && !e.classList.contains(rm)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(nm, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
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
var am = "ui-color-input", om = "ui-color-input--open", sm = "ui-color-input__popup", cm = "ui-color-input__text", lm = "ui-color-input__row", um = "ui-color-input__swatch--button", dm = "ui-color-input__value-input", fm = "ui-color-input__square-thumb", pm = "ui-color-input__hue-thumb", mm = "data-ui-color-toggle", hm = "data-ui-color-tab", gm = "data-ui-color-tab-selected", _m = "data-ui-color-pane", vm = "data-ui-color-pane-selected", ym = "data-ui-color-square", bm = "data-ui-color-hue", xm = "data-ui-color-hex", Sm = "data-ui-color-channel", Cm = "data-ui-color-factor", wm = "data-ui-color-opacity", Tm = "data-ui-color-name", Em = "data-ui-color-name-selected", Dm = "data-ui-color-format", Om = "data-ui-color-readonly", km = "data-ui-color-variant", Am = "data-ui-color-picker", jm = "data-ui-color-palette", Mm = 4, Nm = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	returnFocus = /* @__PURE__ */ new WeakMap();
	openInput = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${am}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = v(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${am}`) ?? []);
		}), C(this.root, `.${am}`, {
			childList: !0,
			attributeFilter: [
				Dm,
				Om,
				km,
				Am,
				jm
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new jf({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${ym}], [${bm}]`),
			begin: (e, t) => {
				let n = e.closest(`.${am}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(ym) ? "square" : "hue"
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: (e, t) => this.send(t.input)
		}), new si({
			openPopups: () => this.openInput === null ? [] : [this.openInput],
			close: (e) => this.setOpen(e, !1)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = Vm(e), n = this.states.get(e), r = n?.paneChosen === !0 ? Pm(e, n.pane) : Fm(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? Im(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Ym(t);
			if (i === null) return n ?? Im(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && Lm(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Qm(a, o, s);
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
			...n ?? Im(r),
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
			let [e, a, o] = Qm(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Gm(e, "--ui-color-input-color", t.held ? Zm(n, r, i, t.opacity) : "transparent"), Gm(e, "--ui-color-input-solid", Zm(n, r, i, 255)), Gm(e, "--ui-color-input-on-color", t.held ? Rm(n, r, i, t.opacity) : "inherit"), Wm(e, t.held ? Um(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${ym}]`), o = e.querySelector(`[${bm}]`), [s, c, l] = $m(t.hue, 1, 1);
		if (Gm(e, "--ui-color-input-hue", Zm(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${fm}`);
			e !== null && (Gm(e, "left", `${t.saturation * 100}%`), Gm(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${pm}`);
			e !== null && Gm(e, "top", `${t.hue / 360 * 100}%`);
		}
		Km(e, `[${xm}]`, Xm(n, r, i)), Km(e, `[${Sm}="r"]`, String(n)), Km(e, `[${Sm}="g"]`, String(r)), Km(e, `[${Sm}="b"]`, String(i)), Gm(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), qm(e, `[${wm}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${Tm}]`)) n.getAttribute(Tm) === t.name ? n.setAttribute(Em, "") : n.removeAttribute(Em);
		let n = t.name === null ? null : e.querySelector(`[${Tm}="${t.name}"]`), r = n === null ? null : Ym(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Gm(e, "--ui-color-input-base", r === null ? "transparent" : Zm(r[0], r[1], r[2], 255)), qm(e, `[${Cm}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${_m}]`)) n.getAttribute(_m) === t.pane ? n.setAttribute(vm, "") : n.removeAttribute(vm);
		for (let n of e.querySelectorAll(`[${hm}]`)) n.getAttribute(hm) === t.pane ? n.setAttribute(gm, "") : n.removeAttribute(gm);
	}
	resolveRgb(e, t) {
		if (t.name === null) return $m(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${Tm}="${t.name}"]`), r = n === null ? null : Ym(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? $m(t.hue, t.saturation, t.value) : Jm([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mm}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${am}`));
			return;
		}
		let n = e.target.closest(`[${hm}]`), r = e.target.closest(`.${am}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(hm), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${Tm}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(Tm)
			}));
			return;
		}
		let a = r.querySelector(`.${sm}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${am}`);
		if (t !== null) {
			if (e.target.hasAttribute(Cm)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(wm) && this.commit(t, (t) => ({
				...t,
				opacity: N(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${am}`);
		if (n === null) return;
		if (t.hasAttribute(Cm) || t.hasAttribute(wm)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(xm)) {
			let e = Ym(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Qm(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Sm);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = N(Number(t.value));
		let [l, u, d] = Qm(c.r, c.g, c.b);
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
			let e = eh((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = eh((t.x - a.left) / a.width), s = 1 - eh((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || e.hasAttribute(Om)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${dm}`);
		a !== null && (a.value = Hm(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		e.hasAttribute(Om) || e.querySelector(`.${dm}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		e === null || e.hasAttribute(Om) || !e.hasAttribute(Am) && !e.hasAttribute(jm) || this.setOpen(e, !e.classList.contains(om));
	}
	setOpen(e, t) {
		let n = e.querySelector(`.${sm}`);
		if (t && e.hasAttribute(Om) || n === null) return;
		if (this.openInput !== null && this.openInput !== e && this.setOpen(this.openInput, !1), e.classList.toggle(om, t), e.querySelector(`[${mm}]`)?.setAttribute("aria-expanded", t ? "true" : "false"), !t) {
			Pr(n), this.openInput = null, ui(this.returnFocus.get(e), n), this.returnFocus.delete(e);
			return;
		}
		this.openInput = e, kr((e.getAttribute(km) === "swatch" ? e.querySelector(`.${um}`) : e.querySelector(`.${lm}`)) ?? e, n, {
			placement: "bottom-end",
			gap: Mm
		});
		let r = li(n, n.querySelector(`[${gm}]`));
		r !== null && this.returnFocus.set(e, r);
	}
};
function Pm(e, t) {
	return ((t) => e.hasAttribute(t === "picker" ? Am : jm))(t) ? t : t === "picker" ? "palette" : "picker";
}
function Fm(e) {
	return Pm(e, "picker");
}
function Im(e) {
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
function Lm(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function Rm(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return zm(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function zm(e, t, n) {
	return .2126 * Bm(e) + .7152 * Bm(t) + .0722 * Bm(n);
}
function Bm(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Vm(e) {
	return e.querySelector(`.${dm}`)?.value.trim() ?? "";
}
function Hm(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Xm(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${P(e.opacity)}`;
}
function Um(e, t, n, r, i) {
	if (e.getAttribute(Dm) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Xm(t, n, r);
	return i === 255 ? a : `${a}${P(i)}`;
}
function Wm(e, t) {
	for (let n of e.querySelectorAll(`.${cm}`)) n.textContent !== t && (n.textContent = t);
}
function Gm(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function Km(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function qm(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Jm(e, t) {
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
function Ym(e) {
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
function Xm(e, t, n) {
	return `#${P(e)}${P(t)}${P(n)}`;
}
function Zm(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Qm(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function $m(e, t, n) {
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
function eh(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function th(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var F = "ui-table", nh = "ui-table--reorderable", rh = "ui-table__scroll", ih = "ui-scroll-x--auto", ah = "ui-scroll-x--always", oh = `:scope > .${rh}`, sh = ".ui-table__resizer", ch = "ui-table__header-cell", lh = `${ch}--pinned`, uh = `${oh} > .ui-table__header > .${ch}`, dh = `${uh}--pinned`, fh = "ui-table__host", ph = `${oh} > .${fh}`, mh = `.${F}, .ui-table__row, [${dt}]`, hh = "--ui-table-columns", gh = "--ui-table-sized-columns", _h = "--ui-table-pin-", vh = "--ui-table-order-", yh = 64, bh = "data-ui-table-cell-hidden", xh = "data-ui-table-cell-last", Sh = "columns", Ch = "hidden", wh = "order", Th = "layout", Eh = 32, Dh = 16, Oh = class {
	root;
	store = new Md();
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
		if (this.root = e.root ?? document, this.drag = new jf({
			root: this.root,
			resolveHandle: (e) => e.closest(sh),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new jf({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of mf) e !== "base" && matchMedia(`(min-width: ${hf[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${F}`)), C(this.root, `.${F}`, {
			childList: !0,
			relevant: Ah
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), C(this.root, `.${F}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(F)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), C(this.root, `.${F}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: jh
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(ph);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), th(t, () => this.pin(t));
			let e = t.querySelector(ph);
			e !== null && (this.markScrollbar(t, e), th(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, Sh), r = n === null ? null : Nf(n);
		r !== null && r.length !== t.length ? (this.store.write(e, Sh, null), this.store.writeBoot(e, Th, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, wh);
		if (i !== null && !Nh(i, t)) {
			this.store.write(e, wh, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(yt, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${F}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = Mh(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(ih) || e.classList.contains(ah);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(gh);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = $f(t, n);
				e.style.setProperty(gh, Lf(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${vh}${t}`, String(r[t])) : e.style.removeProperty(`${vh}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(pt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(pt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(mt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(mt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(nh)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= yh) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${dt}]`)) {
				let r = Number(t.getAttribute(dt));
				!(r >= yh) || t.closest(`.${F}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(bh, n.hidden.has(r)), t.toggleAttribute(xh, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(uh)) {
			let e = Number(n.getAttribute(dt)), r = n.getAttribute(ft), i = n.classList.contains(lh) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Lh(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? Ih(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, Ch) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(hh).trim(), n = t.length === 0 ? null : Nf(t);
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
		n === null || i !== void 0 && n === Ih(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, Ch, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return Mh(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(dh).length;
		if (t < 2) return;
		let n = Qf(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${_h}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains(rh) || t.closest(`.${F}`)?.toggleAttribute(vt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(oh);
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
		let t = e.target.closest(sh);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Dh;
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
		let t = e.target.closest(sh)?.closest(`.${F}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Wf(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(Eh, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, kh(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, Sh, t === null ? null : Lf(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(gh).trim(), n = e.getAttribute(pt), r = {};
		t.length > 0 && (r[gh] = t);
		for (let t of e.style) t.startsWith(vh) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, Th, null);
			return;
		}
		this.store.writeBoot(e, Th, {
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
		let r = Bf(t.getAttribute(ct)), i = Vf(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(dt)), u = this.hiddenOf(t, o), d = Mh(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${ch}`), n = t?.closest(`.${F}`) ?? null;
		return t === null || n === null || !n.classList.contains(nh) || e.closest(sh) !== null || t.classList.contains(lh) || t.hasAttribute("data-ui-table-fixed") ? null : t;
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
		for (let a of Mh(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Ph(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), Fh(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(_t, "after") : a.cell.setAttribute(_t, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(gt), t.table.removeAttribute(ht), Fh(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = Mh(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, wh, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function kh(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function Ah(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(mh) || t.querySelector(mh) !== null)) return !0;
	return !1;
}
function jh(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(fh);
}
function Mh(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function Nh(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Ph(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Fh(e) {
	for (let t of e.querySelectorAll(`[${_t}]`)) t.removeAttribute(_t);
}
function Ih(e) {
	return e.hideBelow !== null && mf.indexOf(gf()) < mf.indexOf(e.hideBelow);
}
function Lh(e) {
	return e !== null && mf.includes(e);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var I = { ok: !1 };
function Rh(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => Xt(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
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
			if (c++, Xt(t.kind) === "Dynamic") {
				let n = Bh(e, t.componentId);
				if (!n.ok) return I;
				o = n.value, s = !0;
			} else {
				if (!s) return I;
				let e = Kh(o, t.value);
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
			let e = Hh(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? I : {
		ok: !0,
		value: o
	};
}
var zh = /* @__PURE__ */ new Set();
function Bh(e, t) {
	let n = v(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return zh.has(n) || (zh.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), I;
}
function Vh(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Hh(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Hh(e, t) {
	if (e == null) return I;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return I;
	let n = e, r = Uh(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : I;
}
function Uh(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Wh(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Wh(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Gh(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Xt(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Xt(e.kind) !== "Dynamic") {
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
function Kh(e, t) {
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
		for (let n of e) if (Jh(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return I;
}
function qh(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Jh(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Jh(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Yh(e) {
	let t = e.closest(Ut)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Xh(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Yh(e);
	if (a === void 0 && o === null) {
		for (let t of w(e)) t.classList.remove(Ji);
		return;
	}
	for (let n of w(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Ji);
			continue;
		}
		n.classList.toggle(Ji, !Zh(a, e, i, o));
	}
}
function Zh(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => ng(e, t, n)) && (r?.filters ?? []).every((e) => pr(Vh(t, e.itemProperty), e.operator, e.value));
}
function Qh(e, t, n = null) {
	return (e?.filters ?? []).some((e) => rg(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function $h(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => rg(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function eg(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => tg(n.getItemValue(e), n.getItemValue(r), t));
}
function tg(e, t, n) {
	for (let r of n) {
		let n = ig(Vh(e, r.itemProperty), Vh(t, r.itemProperty));
		if (n !== 0) return tn(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function ng(e, t, n) {
	if (!rg(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return pr(Vh(t, e.itemProperty), e.operator, r);
}
function rg(e, t, n, r) {
	return e == null || pr(r.get(e, []), t, n);
}
function ig(e, t) {
	if (e === t) return 0;
	let n = og(e), r = og(t);
	if (n !== r) return n - r;
	if (n === ag.Nothing) return 0;
	if (n === ag.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var ag = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function og(e) {
	return e == null ? ag.Nothing : typeof e == "number" ? Number.isNaN(e) ? ag.Nothing : ag.Number : typeof e == "string" && e.trim().length === 0 ? ag.Nothing : Number.isNaN(Number(e)) ? ag.Text : ag.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function sg(e) {
	switch (e.getAttribute(Ne)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
var cg = "bottom";
function lg(e, t, n) {
	let r = e.querySelector(`:scope > [${Re}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Re, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function ug(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var dg = /* @__PURE__ */ new WeakMap();
function fg(e, t) {
	let n = dg.get(e), r = n === void 0 ? [...t] : pg(n, t);
	return dg.set(e, r), r;
}
function pg(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function mg(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function hg(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function gg(e, t, n) {
	return hg(e, t), mg(e, t, n);
}
function _g(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function vg(e) {
	dg.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var yg = /* @__PURE__ */ new WeakMap();
function bg(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.remove();
}
function xg(e, t, n, r, i, a) {
	let o = sg(e) === "windowed", s = w(e), c = o ? s : fg(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : $h(f, a, Yh(e));
	if (u && !d && bg(e), c.length === 0) {
		yg.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Xi(e);
	if (!d) {
		ug(e, [...eg(c, p, r), ...Yi(ee)]);
		return;
	}
	bg(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (yg.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	yg.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = eg(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = Sg(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	ug(e, [...re, ...Yi(ee)]);
}
function Sg(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(Ae, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var Cg = "ui-tree-rules", wg = "ui-tree";
function Tg(e, t, n) {
	if (e.parentElement?.classList.contains(wg) === !0) {
		e.dispatchEvent(new Event(Cg, { bubbles: !0 }));
		return;
	}
	switch (sg(e)) {
		case "windowed":
			Zi(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Xh(e, t, n.metadata, n.renderer, n.state), Zi(e, t, n.templates, n.renderer), xg(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
function Eg(e, t, n, r, i, a = []) {
	Dg(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Dg(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Og = ".ui-items-view, .ui-table", kg = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Ag = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${ma})[${Nt}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), C(this.root, ma, {
			childList: !0,
			attributeFilter: [
				Nt,
				Ft,
				g
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		xa(e, this.ownItems(e));
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(ha), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || r.matches(".ui-disabled") ? null : oo(e.target, n) === null && !aa(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleClick(e) {
		let t = this.resolveRow(e, ma);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		ca(n, i, r), n.focus({ preventScroll: !0 }), !n.hasAttribute("data-ui-no-row-select") && Ca(n, i, r, ya(e)) && e.preventDefault();
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Og);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ua(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(ha);
		if (t !== null && oo(e.target, t) !== null) return;
		let n = e.target.closest(ma);
		if (n === null || !n.matches(Og) || n.matches(".ui-disabled")) return;
		let r = n.matches(".ui-orientation--horizontal") ? "both" : "vertical";
		if (!kg.has(e.key) && !$i(e.key, r)) return;
		let i = this.ownItems(n), a = sa(i), o = la(e.key, i, a, r);
		if (o !== null) {
			e.preventDefault(), ca(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && va(n, a), Ca(n, i, o, ya(e)));
			return;
		}
		if (!(a === null || aa(a))) {
			switch (e.key) {
				case " ":
					if (!Ca(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					Sa(i).includes(a) || Ca(n, i, a, ga), ua(a, "open");
					break;
				case "Delete": {
					let e = jg(i, a);
					if (e.length === 0) return;
					for (let t of e) ua(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return wo(e, ha, ma);
	}
};
function jg(e, t) {
	let n = Sa(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute(pe));
}
//#endregion
//#region src/interactions/tree-engine.ts
var L = "ui-tree", Mg = "ui-tree__row", Ng = "ui-tree__row--folded", Pg = "ui-tree__row--filtered", Fg = "fold-hidden", Ig = "fold-shown", Lg = "ui-tree__row--dragging", Rg = "ui-tree__loading", zg = "ui-tree__loading-ring", Bg = "ui-tree-node", Vg = "ui-tree-node__text", Hg = "ui-tree-node__toggle", Ug = "ui-tree-node__rename", Wg = ".ui-text__title", Gg = "data-ui-tree-drop", Kg = "--ui-tree-depth", qg = "expanded", Jg = 600, Yg = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Xg = class {
	root;
	store = new Md();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Cg, (e) => {
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
				bt,
				xt,
				St,
				Dt
			],
			relevant: Qg
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Dt), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = t_(e)?.getAttribute(bt);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = R(e), r = t_(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(xt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(Kg, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(Ng, !d), e.classList.toggle(Pg, re), e.removeAttribute(Et), e.draggable = i && !e.hasAttribute("data-ui-undraggable"), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(wt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(wt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(wt), d && ne && !re), s.set(n, {
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
		return t_(e.row)?.hasAttribute(St) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Mg}[${m}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, Fg, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, Ig, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Et]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = kn(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Yh(t);
		if (r === void 0 && i === null) return null;
		let a = $h(r, this.rules.state, i), o = Qh(r, this.rules.state, i);
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
			let t = t_(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => tg(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(R(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Rg}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = R(o), c = i.getItemValue(o);
			if (c === void 0 || Zh(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = t_(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Rg) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? $g();
		o.style.setProperty(Kg, String(t)), o.classList.toggle(Ng, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Hg}`) === null && (!r.hasAttribute("data-ui-unselectable") || oo(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || oo(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Mg}`), n = t?.closest(`.${L}`) ?? null;
		return t === null || n === null || t.closest(`.${L}`) !== n || aa(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Mg}`);
		if (t !== null && oo(e.target, t) !== null) return;
		let n = e.target.closest(`.${L}`);
		if (n === null || n.matches(".ui-disabled") || !Yg.has(e.key) && !$i(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = sa(r), a = la(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, ya(e));
			return;
		}
		if (!(i === null || aa(i))) {
			switch (e.key) {
				case " ":
					if (!Ca(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, la("ArrowDown", r, i, "vertical"), ga);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), ga);
					break;
				case "Enter":
					Sa(r).includes(i) || Ca(n, r, i, ga), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = jg(r, i);
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
		let t = e_(e), n = t?.closest(`.${L}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		let r = t.hasAttribute("data-ui-selected") ? Sa(this.rowsOf(n)).filter((e) => e !== t && e.draggable && e.getClientRects().length > 0) : [];
		Eg(e, n, t, Lg, R(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Lg));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Mg}`), a = i !== null && i.closest(`.${L}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (n.some((t) => t === a || Zg(e, R(a), R(t)))) return;
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Jg)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Gg}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Mg) ? R(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Zg(a, R(e), R(t))));
		this.markDrop(t, null), this.springOpen(t, null), Dg(t, Lg), r.classList.contains(Mg) && this.expand(t, r);
		for (let e of o) {
			let t = t_(e)?.querySelector(`.${Vg}`) ?? null;
			t !== null && (t.setAttribute(Tt, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = e_(e)?.closest(`.${L}`) ?? null;
		t !== null && (Dg(t, Lg), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Gg}]`)) n !== t && n.removeAttribute(Gg);
		t?.setAttribute(Gg, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(R(n), t_(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		i[r] = n, this.store.writeJson(e, qg, i), this.layout(e);
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, qg) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = sa(r);
		ca(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && va(e, i), Ca(e, r, t, n));
	}
	parentOf(e, t) {
		let n = t_(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => R(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${L}`), n = t_(e), r = n?.querySelector(Wg) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), ed({
			container: n,
			title: r,
			className: Ug,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Ct, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Mg) && n.push(e);
		return n;
	}
};
function Zg(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Qg(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(Mg) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(L) === !0);
}
function $g() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Rg, e.setAttribute("aria-hidden", "true"), t.className = zg, e.append(t, x.text("ui.tree.loading")), e;
}
function e_(e) {
	return e.target instanceof Element ? e.target.closest(`.${Mg}`) : null;
}
function R(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function t_(e) {
	return e.querySelector(`.${Bg}`);
}
var n_ = "tabs:rename", r_ = "tabs:pin", i_ = "tabs:unpin", a_ = "tabs:close", o_ = "tabs:delete";
function s_(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function c_(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[n_, e.rename && t.renamable],
		[r_, e.pin && !t.pinned],
		[i_, e.pin && t.pinned],
		[a_, e.close && !e.delete && n],
		[o_, e.delete && n]
	]);
}
function l_(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function u_(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, d_(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function d_(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function f_(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var z = "ui-tabs-view", p_ = "ui-tab-item", m_ = "ui-tab-item__label", h_ = "ui-tab-item__close", g_ = "ui-tab-item__rename", __ = "ui-tab-item__caption", v_ = "ui-tab-item__pin", y_ = ".ui-text__title", b_ = "ui-tab-item--dragging", x_ = "ui-tab-item__caption--overflowed", S_ = "ui-tabs-view--overflowing", C_ = "ui-tabs-view--no-overflow", w_ = "ui-tab-item__page", T_ = "ui-tab-item--selected", E_ = ".ui-menu-item", D_ = "tab-menu-entry", O_ = {
	name: D_,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, k_ = "--ui-tabs-view-strip", A_ = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zp({
			rootClass: z,
			overflowingClass: S_,
			wrapsClass: C_,
			hiddenClass: x_,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(v(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => V(e) === t.key))?.querySelector(`.${m_}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Ku, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), C(this.root, `.${z}`, {
			childList: !0,
			attributeFilter: [
				Lt,
				ge,
				...Vt
			],
			relevant: (e) => !Qr(e, `.${w_}`, `.${z}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${z}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Np);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => V(e) === r)) {
			this.select(e, V(n[0]));
			return;
		}
		let i = e.hasAttribute(ge), a = [], o = null, s = null;
		for (let e of t) {
			let t = V(e) === r;
			e.classList.toggle(T_, t);
			let c = e.querySelector(`.${__}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${m_}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${w_}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${w_}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${m_}`);
			t === null || e.classList.contains(x_) || (c.push(t), e === o && (l = t));
		}
		T(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Np(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(k_, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Pp}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => V(e) === t)?.querySelector(`.${m_}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Np).map((e) => ({
				key: V(e),
				title: e.querySelector(`.${m_}`)?.textContent?.trim() ?? V(e),
				current: V(e) === t
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${p_}`);
		if (n === null || !n.classList.contains(z) || r === null || r.closest(`.${z}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = N_(n, r), a = F_(t), o = a.map((e) => {
			if (P_(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Np(e) ? "shown" : "hidden";
		});
		if (l_(o).forEach((e, t) => {
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
		let t = e.closest(`[${ve}="tab"]`), n = t?.parentElement ?? null, r = e.closest(E_);
		if (t === null || n === null || !n.classList.contains(z) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => V(e) === a.key);
		if (i.length === 0 || r.matches(`${it}, ${rt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(D_, {
			bubbles: !0,
			detail: { keys: [i, V(o)] }
		})), !0;
		if (N_(n, o).get(i) !== !0) return !0;
		switch (i) {
			case n_: {
				let e = o.querySelector(`.${m_}`);
				e !== null && this.startRename(e);
				break;
			}
			case r_:
			case i_:
				this.setPinned(n, o, i === r_);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${__} > .${v_}`);
		t.toggleAttribute(Bt, n), r !== null && (r.toggleAttribute(Bt, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = f_(a.map(R_));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? B(a[a.length - 1]).after(B(t)) : B(s).before(B(t)), L_([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Pp}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(z)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${m_}`), i = r?.closest(`.${z}`) ?? null;
		if (r === null || i === null || r.matches(":disabled, .ui-disabled")) return;
		let a = r.closest(`.${p_}`);
		a !== null && a.closest(`.${z}`) === i && (e.preventDefault(), this.select(i, V(a)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${h_}`), r = n?.closest(`.${p_}`) ?? null, i = r?.closest(`.${z}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), M_(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${m_}`), n = t?.closest(`.${z}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(y_) ?? e, r = e.closest(`.${p_}`);
		t === null || r === null || B(r).hasAttribute("data-ui-unrenamable") || ed({
			container: t,
			title: n,
			className: g_,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(zt, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => e.focus()
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${m_}`), n = t?.closest(`.${z}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${m_}`)).filter((e) => e !== null), i = Qi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${p_}`);
		a !== null && this.select(n, V(a)), i.focus();
	}
	handleDragStart(e) {
		let t = I_(e);
		if (t === null) return;
		if (B(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Eg(e, t.closest(`.${z}`) ?? t, t, b_, V(t));
		let n = B(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${__}`)?.closest(`.${p_}`) ?? null, n = t?.closest(`.${z}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${b_}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${__}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = B(r), o = t.hasAttribute("data-ui-tab-pinned") ? j_(n, a) : null, s = o ?? B(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && t.querySelector(`.${b_}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = I_(e);
		if (t === null) return;
		t.classList.remove(b_);
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
		L_(a, a.indexOf(t));
	}
	select(e, t) {
		fa(e, t, {
			attribute: Lt,
			bindingAttribute: It,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return wo(e, `.${p_}`, `.${z}`);
	}
};
function j_(e, t) {
	let n = null;
	for (let r of wo(e, `.${p_}`, `.${z}`)) {
		let e = B(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function M_(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !B(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function N_(e, t) {
	return c_(s_(e.getAttribute(_e)), {
		pinned: t.hasAttribute(Bt),
		renamable: !B(t).hasAttribute(me),
		removable: e.hasAttribute("data-ui-tabs-removes") && M_(e, t)
	});
}
function P_(e) {
	let t = e.getAttribute(m);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function F_(e) {
	let t = e.querySelector(`[${h}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function B(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function I_(e) {
	return e.target instanceof Element ? e.target.closest(`.${__}`)?.closest(`.${p_}`) ?? null : null;
}
function L_(e, t) {
	for (let [n, r] of u_(e.map(R_), t)) e[n].setAttribute(Rt, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function R_(e) {
	return {
		order: z_(e),
		pinned: e.hasAttribute(Bt)
	};
}
function z_(e) {
	let t = e.getAttribute(Rt);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function V(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var B_ = "button.ui-text__fold-toggle", V_ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(B_);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, H_ = "ui-temporal-input__segments", U_ = "ui-temporal-input__segment", W_ = "ui-temporal-input__segment-literal", G_ = "ui-temporal-input__segment--empty", K_ = "data-ui-temporal-segment", q_ = "data-ui-temporal-step-direction", J_ = "data-ui-temporal-readonly", Y_ = "data-ui-temporal-segments-of", X_ = "--", Z_ = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Dn(e.components, `.${O}`));
		}), C(this.root, `.${O}`, { attributeFilter: [...ll] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) dl(t) === "time" && (wl(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${H_}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = fl(e), r = hl(e), i = k(e, vl(t));
		t.getAttribute(Y_) !== n && (t.replaceChildren(...Q_(n).map((e) => ev(e))), t.setAttribute(Y_, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(K_);
			if (t === null) {
				n.textContent = nv(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = rv(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(G_, i === null), n.tabIndex = e.hasAttribute(J_) ? -1 : 0, iv(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = ov(e.target);
		if (t === null) return;
		let n = t.closest(`.${O}`), r = t.getAttribute(K_), i = av(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), cv(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), Sl(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = lv(e.key, hl(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = ov(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = ov(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Rl(this.wheelTurn, e.deltaY, e.deltaMode === WheelEvent.DOM_DELTA_PIXEL);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${O}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(K_), n < 0 ? 1 : -1, av(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${q_}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${q_}]`);
		if (t === null) return;
		let n = t.closest(`.${O}`);
		if (n === null || n.hasAttribute(J_)) return;
		e.preventDefault();
		let r = sv(n) ?? n.querySelector(`.${U_}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(K_), t.getAttribute(q_) === "up" ? 1 : -1, av(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${U_}`) : null;
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
		let i = this.baseValue(e, r), a = uv(t), o = ml(pl(e), a) * n, s = a === "hour" ? 24 : 60, c = ((dv(i, a) + o) % s + s) % s;
		this.write(e, fv(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? fv(t, "hour", pv(l, t.getHours() >= 12)) : fv(t, uv(n), l), i);
		}
		u && cv(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, fv(r, "hour", pv(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return k(e, t) ?? El(e);
	}
	write(e, t, n) {
		Sl(e, Dl(e, t), n), Cl(e), this.applySegments(e);
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
function Q_(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Kc(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push($_(r)), n += r.length;
	}
	return t;
}
function $_(e) {
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
function ev(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = W_, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = U_, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(K_, e.unit), t.dataset.width = String(e.width), tv(t, e.unit), t;
}
function tv(e, t) {
	if (t === "meridiem") {
		e.setAttribute("aria-label", x.text("ui.picker.meridiem"));
		return;
	}
	let n = uv(t);
	e.setAttribute("aria-label", x.text(n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds")), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function nv(e, t, n, r) {
	return t && n !== null ? Wc(n, e, r) : e;
}
function rv(e, t, n, r) {
	if (n === null) return X_;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : dv(n, uv(e));
	return String(i).padStart(t, "0");
}
function iv(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let r = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? r % 12 == 0 ? 12 : r % 12 : dv(n, uv(t))));
}
function av(e) {
	return vl(e.closest(`.${H_}`));
}
function ov(e) {
	let t = e instanceof Element ? e.closest(`.${U_}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${O}`);
	return n === null || n.hasAttribute(J_) ? null : t;
}
function sv(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${U_}`) : null;
}
function cv(e, t, n) {
	Qi({
		key: n,
		items: [...e.querySelectorAll(`.${U_}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function lv(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function uv(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function dv(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function fv(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function pv(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var mv = "data-ui-scroll-anchor", hv = "End", gv = 4, _v = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), C(this.root, `[${mv}="${hv}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ge]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !vv(t) || this.pinned.set(t, bv(t) && !yv(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${mv}="${hv}"]`));
	}
	followEach(e) {
		for (let t of e) if (this.pinned.get(t) !== !1) {
			if (yv(t)) {
				this.pinned.set(t, !1);
				continue;
			}
			this.pinned.set(t, !0), bv(t) || (t.scrollTop = t.scrollHeight);
		}
	}
};
function vv(e) {
	return e.getAttribute(mv) === hv;
}
function yv(e) {
	return e.getAttribute(Ue)?.toLowerCase() === "true";
}
function bv(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= gv;
}
//#endregion
//#region src/items/items-viewport.ts
function xv(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Sv(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${h}][${Pe}]`) : null;
}
function Cv(e) {
	let t = xv(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Tv(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function wv(e, t) {
	let n = xv(e);
	n.scrollTop = n === e ? t : t + Tv(e, n);
}
function Tv(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function Ev(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Ov(e, a, n), s = Ov(e, a + 1, n);
	return kv(t, o.top, s.top, o.line, s.line);
}
function Dv(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Ov(e, a, n), s = Ov(e, a + 1, n);
	return kv(t, o.line, s.line, o.top, s.top);
}
function Ov(e, t, n) {
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
function kv(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var Av = 250, jv = class {
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
		if (n !== void 0 && t - n.at < Av && n.found.every((e) => e.isConnected)) return n.found;
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
		let n = Mv(e, "data-ui-scroll-viewport") ?? Nv(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? Fv(e) : null, a = i === null ? null : Fv(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Dv(a, Ev(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? Pv(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function Mv(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function Nv(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : Mv(e, h);
	return t === null ? null : xv(t);
}
function Pv(e, t) {
	return t > 0 ? e / t : 0;
}
function Fv(e) {
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
var Iv = ".ui-button, .ui-action, .ui-menu-item", Lv = at, Rv = "ui-pressing", zv = "--ui-press-x", Bv = "--ui-press-y", Vv = 250, Hv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Iv);
		if (t === null || t.matches(":disabled, .ui-disabled, [inert]") || t.matches(Lv)) return;
		let n = t.getBoundingClientRect();
		t.style.setProperty(zv, `${e.clientX - n.left}px`), t.style.setProperty(Bv, `${e.clientY - n.top}px`), t.classList.remove(Rv), t.offsetWidth, t.classList.add(Rv), window.setTimeout(() => t.classList.remove(Rv), Vv);
	}
}, Uv = "mask:", Wv = "ui-icon--image";
function Gv(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(Uv) && (n = !0, t = t.slice(5).trim()), Kv(t) ? {
		source: t,
		tinted: n
	} : null;
}
function Kv(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function qv(e) {
	let t = Gv(e);
	return t === null ? "" : Jv(t.source);
}
function Jv(e) {
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
var Yv = "ui-icon", Xv = "data-ui-icon";
function Zv(e, t) {
	let n = String(t ?? "").trim();
	e.classList.add(Yv);
	for (let t of Array.from(e.classList)) $v(t) && e.classList.remove(t);
	if ((e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url"), n.length === 0) {
		e.removeAttribute(Xv);
		return;
	}
	e.setAttribute(Xv, "");
	let r = Gv(n);
	if (r === null) {
		e.classList.add(ey(n));
		return;
	}
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", Jv(r.source)), r.tinted || e.classList.add(Wv);
}
var Qv = "ui-icon-glyph--";
function $v(e) {
	return e === "ui-icon--image" || e.startsWith(Qv);
}
function ey(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Qv;
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
var ty = [
	"http",
	"https",
	"mailto",
	"tel"
];
function ny(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || ty.includes(t.slice(0, n).toLowerCase());
}
function ry(e) {
	return ny(e) ? String(e) : void 0;
}
function iy(e) {
	return typeof e != "string" || !e.startsWith("/") || /[\x00-\x1f\x7f]/.test(e) ? !1 : e.length === 1 || e[1] !== "/" && e[1] !== "\\";
}
function ay(e) {
	let t = String(e ?? "").trim();
	return Kv(t) ? t : void 0;
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
}, oy = "\\", sy = "`", cy = "!", ly = "{", uy = "}", dy = "ui-text__fold", fy = "ui-text__fold-toggle", py = "ui-text__fold-content", my = 8;
function hy(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Ey(new Fy(e), 0, e.length, H.None, null, t, n), Dy(t, n, H.None, null), t;
}
function gy(e) {
	return hy(e).map((e) => by(e) ? `${e.fold} ${gy(e.text)}` : e.text).join("");
}
function _y(e, t, n = {}) {
	let r = hy(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && vy(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(xy(r, n));
}
function vy(e) {
	return e.styles === H.None && e.url === null && !yy(e) && !by(e);
}
function yy(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function by(e) {
	return e.fold !== null && e.fold !== void 0;
}
function xy(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Sy(r, t));
	return n;
}
function Sy(e, t) {
	if (yy(e)) return wy(e.icon);
	let n = by(e) ? Cy(e, t) : document.createTextNode(e.text);
	if ((e.styles & H.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & H.Strikethrough) !== 0 && (n = Ty("s", n)), (e.styles & H.Underline) !== 0 && (n = Ty("u", n)), (e.styles & H.Italic) !== 0 && (n = Ty("em", n)), (e.styles & H.Bold) !== 0 && (n = Ty("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Ry(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Cy(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${dy} ${dy}--static` : dy, r.className = fy, r.textContent = e.fold ?? "", i.className = py, i.append(xy(hy(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ce, ""), n.append(r, i), n);
}
function wy(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Zv(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Ty(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Ey(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === oy && c + 1 < n && zy(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Oy(e, c, n);
		if (l !== null) {
			Dy(a, o, r, i), ky(s, c + 1, l, o), Dy(a, o, r | H.Code, i), c = l + 1;
			continue;
		}
		let u = My(e, c, n);
		if (u !== null) {
			Dy(a, o, r, i), Ey(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Dy(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Ay(e, c, n);
		if (d !== null) {
			Dy(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Ny(e, c, n) : null;
		if (f !== null) {
			Dy(a, o, r, i), Ey(e, f.labelStart, f.labelEnd, r, f.url, a, o), Dy(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Py(e, c, n);
		if (p !== null) {
			Dy(a, o, r, i), a.push({
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
function Dy(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Oy(e, t, n) {
	let r = e.text;
	if (r[t] !== sy) return null;
	let i = t + 1;
	if (i >= n || By(r[i])) return null;
	let a = e.findClosingMarker(i, n, sy, 1);
	return a > i ? a : null;
}
function ky(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === oy && i + 1 < n && zy(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Ay(e, t, n) {
	let r = e.text;
	if (r[t] !== cy || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return jy(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function jy(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function My(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = H.Bold, s = 2;
	else if (i === "*") o = H.Italic, s = 1;
	else if (i === "_" && a) o = H.Underline, s = 2;
	else if (i === "~" && a) o = H.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || By(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Ny(e, t, n) {
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
function Py(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== ly || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > my) return null;
	let c = { value: "" };
	return ky(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Fy = class {
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
		return this.closeBrackets ??= this.next("]", !0), Iy(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Iy(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Iy(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Iy(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Ly(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !By(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = ny(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === oy && e[t - 1] === 0);
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
			if (this.text[r] === ly) n.push(r);
			else if (this.text[r] === uy && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || By(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Iy(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Ly(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Ry(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function zy(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === ly || e === uy || e === sy || e === oy;
}
function By(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Vy = "data-ui-tooltip", Hy = "data-ui-tooltip-placement", Uy = "data-ui-tooltip-mark", Wy = "ui-tooltip", Gy = "ui-tooltip--visible", Ky = "[aria-haspopup][aria-expanded=\"true\"]", qy = "top", Jy = 250, Yy = 200, Xy = 300, Zy = 7, U = null, W = null, Qy = null, $y = 0, eb = 0, tb = 0, nb = !1;
function rb(e = document) {
	if (nb) return;
	nb = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", ib, !0), t.addEventListener("pointerout", ob, !0), t.addEventListener("focusin", sb, !0), t.addEventListener("focusout", cb, !0), t.addEventListener("keydown", lb, !0), t.addEventListener("scroll", ab, !0), t.addEventListener("pointerdown", (e) => {
		Qy === null && !ub(e.target) && xb(!0);
	}, !0), window.addEventListener("blur", () => {
		Qy = null, xb(!0);
	});
}
function ib(e) {
	if (ab(), ub(e.target)) {
		window.clearTimeout(eb);
		return;
	}
	let t = db(e.target);
	t !== null && t !== W && fb(t);
}
function ab() {
	W === null || W.isConnected || (Qy = null, xb(!0));
}
function ob(e) {
	if (Qy !== null) return;
	let t = e.relatedTarget;
	t instanceof Node && (W !== null && W.contains(t) || ub(t)) || (ub(e.target) || db(e.target) === W) && xb(!1);
}
function sb(e) {
	let t = db(e.target);
	t !== null && (Qy = e.target instanceof Element && e.target.closest(`[${Uy}]`) !== null ? t : null, pb(t));
}
function cb(e) {
	db(e.target) === W && (Qy = null, xb(!0));
}
function lb(e) {
	e.key === "Escape" && W !== null && (Qy = null, xb(!0));
}
function ub(e) {
	return U !== null && e instanceof Node && U.contains(e);
}
function db(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Vy}], [${Uy}]`);
	if (t === null) return null;
	let n = t.hasAttribute(Vy) ? t : t.querySelector(`[${Vy}]`);
	return n === null ? null : (n.getAttribute(Vy) ?? "").trim().length > 0 ? n : null;
}
function fb(e) {
	if (Qy === null) {
		if (window.clearTimeout(eb), window.clearTimeout($y), W !== null) {
			xb(!0), pb(e);
			return;
		}
		if (Date.now() - tb < Xy) {
			pb(e);
			return;
		}
		$y = window.setTimeout(() => pb(e), Jy);
	}
}
function pb(e, t) {
	let n = (t ?? e.getAttribute(Vy) ?? "").trim();
	if (n.length === 0 || !e.isConnected || mb(e)) return;
	window.clearTimeout($y), window.clearTimeout(eb), W !== null && W !== e && W.removeAttribute("aria-describedby");
	let r = Sb();
	_y(r, n, { staticFolds: !0 }), r.classList.add(Gy), W = e, e.setAttribute("aria-describedby", r.id), r.setAttribute("data-ui-tooltip-text", gy(n)), kr(e, r, {
		placement: bb(e),
		gap: Zy,
		arrow: !0
	});
}
function mb(e) {
	return e.matches(Ky) || e.querySelector(Ky) !== null;
}
function hb(e, t) {
	pb(e, t);
}
function gb() {
	xb(!0);
}
var _b = {
	show: hb,
	hide: gb
};
function vb(e) {
	Qy = e, pb(e);
}
function yb(e) {
	if (W === e) {
		if ((e.getAttribute(Vy) ?? "").trim().length === 0) {
			Qy = null, xb(!0);
			return;
		}
		pb(e);
	}
}
function bb(e) {
	let t = e.getAttribute(Hy);
	return t !== null && Cr(t) ? t : qy;
}
function xb(e) {
	window.clearTimeout($y), window.clearTimeout(eb);
	let t = () => {
		W !== null && (W.removeAttribute("aria-describedby"), W = null, U !== null && (U.classList.remove(Gy), Pr(U)), tb = Date.now());
	};
	e ? t() : eb = window.setTimeout(t, Yy);
}
function Sb() {
	return U !== null && U.isConnected ? U : (U = document.createElement("div"), U.id = "ui-tooltip", U.className = Wy, U.setAttribute("role", "tooltip"), U.setAttribute("aria-hidden", "true"), document.body.append(U), U);
}
//#endregion
//#region src/interactions/popup-service.ts
var Cb = /* @__PURE__ */ new Map();
new si({
	openPopups: () => wb(),
	close: (e, t) => Tb(e, t),
	isInside: (e, t) => {
		let n = Cb.get(e);
		return t.includes(e) || n !== void 0 && t.includes(n.anchor);
	},
	onPress: !0
});
function wb() {
	let e = [];
	for (let t of [...Cb.keys()]) t.isConnected ? e.push(t) : Eb(t);
	return e;
}
function Tb(e, t) {
	let n = Cb.get(e);
	n !== void 0 && (Eb(e), n.options.onDismiss(t));
}
function Eb(e) {
	Cb.delete(e), Pr(e);
}
var Db = { open(e, t, n) {
	return Cb.set(t, {
		anchor: e,
		options: n
	}), kr(e, t, n), {
		reposition: () => kr(e, t, n),
		close: () => Eb(t)
	};
} };
//#endregion
//#region src/items/item-rows.ts
function Ob(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Vh,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		}
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var kb = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? jb(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), Mb(l, n, t);
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
		let i = Ab(r.item, t, n);
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
		let r = Ib(t, n.templateKeyPropertyName);
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
		} : { ok: !1 } : Rh(n, i.itemTemplate, i.itemTemplateParameters);
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
			let n = xn(u, t, () => [e])[0] ?? null;
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
function Ab(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Hh(r, i.name) : Kh(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return qh(r, i.key, n), e;
	let a = r;
	return a[Uh(a, i.name)] = n, e;
}
function jb(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function Mb(e, t, n) {
	e.setAttribute(m, t), Fb(e, n), Pb(e, n);
}
var Nb = [
	["CanSelect", de],
	["CanDrag", fe],
	["CanRemove", pe],
	["CanRename", me],
	["CanShowContextMenu", he]
];
function Pb(e, t) {
	for (let [n, r] of Nb) {
		let i = Hh(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function Fb(e, t) {
	let n = Hh(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(je, n.value) : e.removeAttribute(je);
}
function Ib(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Hh(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var Lb = "Group", Rb = class {
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
		for (let t of Yn) e.root.addEventListener(t, (e) => this.handleSourceValueEvent(e), !0);
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), C(e.root, `[${Me}="items-query"]`, { attributeFilter: [Ee] }, (e) => {
			for (let t of e) {
				let e = kn(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
	}
	handleSourceValueEvent(e) {
		if (!(e.target instanceof Element)) return;
		let t = kn(e.target), n = t === null ? void 0 : this.sources.get(t);
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
			for (let [t, n] of e) t.isConnected && Tg(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(v(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Gh(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${h}]`)) {
			if (sg(r) !== "virtualized") continue;
			let i = r.closest(Ut);
			i === null || !this.drawsPatchedComponent(i, v(e.reference.componentId), t) || !zb(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(b(i), t) && this.sync(r, b(i));
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
		Tg(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${Wt(t)}"]`)].filter((t) => this.isItemRoot(t) && wn(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${h}]`), i = r === null ? null : kn(r);
		if (r !== null && i !== null && sg(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = Bb(Lb, t);
		a && Fb(e, this.options.renderer.getItemValue(e)), Nb.some(([e]) => Bb(e, t)) && Pb(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && Bb(Lb, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => Bb(e.itemProperty, t)) || n.sorts.some((e) => Bb(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${h}]`)) {
			let n = kn(t);
			n === e && this.sync(t, n);
		}
	}
};
function zb(e, t) {
	let n = Cn(e, Sn(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function Bb(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var Vb = 50, Hb = 1, Ub = .5, Wb = 60, Gb = class {
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
			if (this.layout(t), Xb(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = $b(e, Be);
		if (t !== null && vv(e) && Kb(e.getAttribute("data-ui-window-more-after"))) {
			wv(e, Math.max(0, this.windowBottom(e, t) - Cv(e).height));
			return;
		}
		t !== null && t !== 0 && wv(e, Kb(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = Yb(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Jb(n[n.length - 1]).bottom - Jb(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = $b(e, Be), n = Yb(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Cv(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		sg(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${h}][${Ne}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Sv(e.target);
		if (t === null || sg(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, Wb));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && Xb(e) > 0) return;
		let n = Yb(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = $b(e, Be), i = Kb(e.getAttribute(He)), a = Kb(e.getAttribute(Ue));
		if (r !== null) {
			let o = this.windowSize(e), s = Cv(e), c = Math.max(1, Math.round(s.height * Hb / t.itemSize), Math.floor(o * Ub)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, Zb(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, Zb(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Cv(e), s = Math.max(1, o.height * Hb), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, Zb(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, Zb(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = $b(e, Ve);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = kn(e);
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
				dynamicParameters: Qb(e),
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
		let t = this.getState(e), n = Yb(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			lg(e, "top", 0), lg(e, cg, 0);
			return;
		}
		if (n.length > 0) {
			let e = Jb(n[n.length - 1]).bottom - Jb(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / qb(n))));
		}
		let r = $b(e, Ve), i = $b(e, Be), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		lg(e, "top", a), lg(e, cg, o);
	}
	windowSize(e) {
		let t = $b(e, ze);
		return t !== null && t > 0 ? t : Vb;
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
function Kb(e) {
	return e !== null && e.toLowerCase() === "true";
}
function qb(e) {
	let t = Jb(e[0]).top, n = 1;
	for (; n < e.length && Jb(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function Jb(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function Yb(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function Xb(e) {
	return Yb(e).length;
}
function Zb(e) {
	return e.getAttribute(m);
}
function Qb(e) {
	let t = e.closest(Ut);
	return t === null ? [] : Cn(t, Sn(t));
}
function $b(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/state/value-equality.ts
function ex(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && tx(e, t) : nx(e, t);
}
function tx(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!ex(e[n], t[n])) return !1;
	return !0;
}
function nx(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !ex(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var rx = [
	ce,
	le,
	ue
];
function ix(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, ax(c, e.itemRole);
	let l = sx(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = ox(l, t, n, a);
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
		d.className = l.wrapperClassName, ax(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), Mb(d, r, n), c.appendChild(d);
	}
	return Mb(c, r, n), o.registerItemScope(c, l, n), c;
}
function ax(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function ox(e, t, n, r) {
	let i = Ib(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function sx(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of rx) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), b(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function cx(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return lx(i.renderer.renderItem(e, t, n, r), a);
	let s = ix(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), lx(s, a);
}
function lx(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var ux = 6, dx = 60, fx = class {
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
		let n = vv(e) && bv(e);
		this.project(e, t), this.layout(e, t), n && !bv(e) && (wv(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && ex(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = w(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? da(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = Ab(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Yh(e), i = this.options.templates.getGroupTemplate(t.componentId), a = $h(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Zh(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => gx(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => tg(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = gx(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => tg(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Sv(e.target);
		if (t === null || sg(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, dx));
	}
	layout(e, t) {
		let n = t.projected, r = vx(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (_x(e) && a > 0) {
			let r = Cv(e), c = mx(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - ux), s = Math.min(a, s + ux);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(gx(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), hx(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (hx(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of w(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ae}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = yx(i, 0, o), p = yx(i, s, a);
		ug(e, [...l, ...Yi(Xi(e))]), lg(e, "top", f > 0 ? f - r : 0), lg(e, cg, p > 0 ? p - r : 0), Zi(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return cx(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(Ae, ""), r);
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(gx(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (px(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(gx(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = An(e);
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
function px(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function mx(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (wv(e, i + s), i + s);
}
function hx(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = gx(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function gx(e) {
	let t = Hh(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function _x(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function vx(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function yx(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var bx = "data-ui-template", xx = "default", Sx = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? xx, r = this.findTemplate(e, n);
		return r === void 0 ? n === xx ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${bx}]`);
		for (let e of r) if (e.getAttribute(bx) === t) return e;
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
}, Cx = "script[type='application/json'][data-ui-metadata]";
function wx(e = document) {
	let t = e.querySelector(Cx);
	if (t === null) return Tx();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return Tx();
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
function Tx() {
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
var Ex = "script[type='application/json'][data-ui-hydration]";
function Dx(e = document) {
	let t = e.querySelector(Ex)?.textContent?.trim() ?? "";
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
var Ox = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(kx(Ax(e)));
	}
	async dispatchAsync(e) {
		let t = Ax(e), n = kx(t);
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
function kx(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function Ax(e) {
	return {
		eventId: v(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var jx = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), this.values.has(i) && ex(a, n) ? !1 : (this.values.set(i, n), !0);
	}
	forgetRows(e, t, n) {
		let r = Mx(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(Nx([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(Mx(e, t));
		let n = this.unplaced.get(Nx(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = Mx(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(Nx([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = Nx(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, Nx(t.slice(0, e - 1)));
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
		return `${v(e.componentId)}:${e.propertyId}:${Px(t)}`;
	}
};
function Mx(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function Nx(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Px(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var Fx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, Ix = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Lx = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Rx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, zx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Bx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, Vx = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, Hx = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, Ux = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Wx = class {
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
var Gx = class {
	constructor() {}
	log(e, t) {}
};
Gx.instance = new Gx();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var Kx = "10.0.11", K = class {
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
function qx(e, t) {
	let n = "";
	return Yx(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${Jx(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function Jx(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function Yx(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function Xx(e, t, n, r, i, a) {
	let o = {}, [s, c] = eS();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${qx(i, a.logMessageContent)}.`);
	let l = Yx(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function Zx(e) {
	return e === void 0 ? new $x(G.Information) : e === null ? Gx.instance : e.log === void 0 ? new $x(e) : e;
}
var Qx = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, $x = class {
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
function eS() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, tS(Kx, nS(), iS(), rS())];
}
function tS(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function nS() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function rS() {
	if (q.isNode) return process.versions.node;
}
function iS() {
	return q.isNode ? "NodeJS" : "Browser";
}
function aS(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function oS() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var sS = class extends Wx {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(oS());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new Lx();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new Lx();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new Ix();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, Yx(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new Fx(await cS(i, "text") || i.statusText, i.status);
		let a = await cS(i, e.responseType);
		return new Ux(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function cS(e, t) {
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
var lS = class extends Wx {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Lx()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (Yx(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new Lx());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new Ux(r.status, r.statusText, r.response || r.responseText)) : n(new Fx(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new Fx(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new Ix());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, uS = class extends Wx {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new sS(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new lS(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Lx()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, dS = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
dS.RecordSeparatorCode = 30, dS.RecordSeparator = String.fromCharCode(dS.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var fS = class {
	writeHandshakeRequest(e) {
		return dS.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (Yx(e)) {
			let r = new Uint8Array(e), i = r.indexOf(dS.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(dS.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = dS.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var pS = class {
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
		return this.observers.push(e), new Qx(this, e);
	}
}, mS = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			Yx(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new hS(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, Yx(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, hS = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, gS = 3e4, _S = 15e3, vS = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var yS = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? gS, this.keepAliveIntervalInMilliseconds = a ?? _S, this._statefulReconnectBufferSize = o ?? vS, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new fS(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new mS(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new Lx("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new pS();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${aS(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${aS(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new Lx("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${aS(t)}`);
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
}, bS = [
	0,
	2e3,
	1e4,
	3e4,
	null
], xS = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? bS : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, SS = class {};
SS.Authorization = "Authorization", SS.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var CS = class extends Wx {
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
		e.headers ||= {}, this._accessToken ? e.headers[SS.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[SS.Authorization] && delete e.headers[SS.Authorization];
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
var wS = class {
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
}, TS = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new wS(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = eS(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new Fx(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${qx(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new Fx(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof Ix ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? Xx(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = eS();
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
			i ? i instanceof Fx && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, ES = class {
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
				let [r, i] = eS();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${qx(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? Xx(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, DS = class {
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
				let t = {}, [r, i] = eS();
				t[r] = i, n && (t[SS.Authorization] = `Bearer ${n}`), o && (t[SS.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${qx(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${qx(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, OS = 100, kS = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = Zx(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new CS(n.httpClient || new uS(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new Lx(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new Lx(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new jS(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new Lx("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < OS);
				if (r === OS && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof TS && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = eS();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Vx("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof Fx && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new Vx(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Bx(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new Lx(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new Hx(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new DS(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new ES(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new TS(this._httpClient, this._logger, this._options);
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
		if (AS(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new Rx(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new zx(`'${X[i]}' is disabled by the client.`, i);
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
function AS(e, t) {
	return !e || (t & e) !== 0;
}
var jS = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new MS(), this._transportResult = new MS(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new MS(), this._transportResult.promise;
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
			this._sendBufferedData = new MS();
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
}, MS = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, NS = "json", PS = class {
	constructor() {
		this.name = NS, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = Gx.instance);
		let n = dS.parse(e), r = [];
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
		return dS.write(JSON.stringify(e));
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
}, FS = {
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
function IS(e) {
	let t = FS[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var LS = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), RS(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = IS(e);
			this.logger = new $x(t);
		} else this.logger = new $x(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new xS(e) : e : new xS(), this;
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
		let t = new kS(this.url, e);
		return yS.create(t, this.logger || Gx.instance, this.protocol || new PS(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function RS(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var zS = class {
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
}, BS = class {
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
}, VS = 500;
function HS(e) {
	let { changes: t, ...n } = e;
	return n;
}
function US() {
	return {};
}
var WS = class {
	windowId;
	connection;
	started = !1;
	gate = new zS();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new BS(t), this.connection = new LS().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, HS));
	}
	async processChangeSetAsync(e, t) {
		await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, US, t));
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", [{ theme: e }]);
	}
	async requestItemWindowAsync(e) {
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, US));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), VS);
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
}, GS = "/_ne/values", KS = 3e4;
function qS(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function JS(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function YS(e, t = KS) {
	if (e === void 0 || !JS(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${GS}/${encodeURIComponent(n)}`, {
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
async function XS(e) {
	let t = await fetch(GS, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(KS)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var ZS = Promise.resolve(), QS = () => {}, $S = class {
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
		if (this.handed >= this.given) return ZS;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = qS(e.value), r = n === null ? null : XS(n);
		return r?.catch(QS), new Promise((n, i) => {
			let a = eC(e), o = this.queue.findIndex((e) => e.field === a), s = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, tC(r));
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
function eC(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function tC(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var nC = document;
function rC() {
	try {
		return nC.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/navigation-url.ts
function iC(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = aC(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function aC(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, oC(e));
	return t.toString();
}
function oC(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/effect-registry.ts
var sC = "data-ui-theme", cC = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(un(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = un(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = iC(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!iy(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = mn(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute(sC) !== n && document.documentElement.setAttribute(sC, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = uC(e);
			t !== null && pC(t);
		}), this.register("ScrollTo", (e) => {
			let t = uC(e);
			if (t === null) return;
			let n = e.effect, r = dn(n.behavior), i = fn(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = uC(e);
			if (t === null) return;
			let n = e.effect, r = hn(n.axis) !== "Horizontal", i = dC(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = pn(n.position), u;
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
			let d = dn(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			lC(uC(e), null);
		}), this.register("Hide", (e) => {
			lC(uC(e), "hidden");
		}), this.register("Collapse", (e) => {
			lC(uC(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = mC(e, this.valueReaders);
			t !== null && hC(t).catch((e) => s("copy to clipboard failed.", e));
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
			if (!ny(t.requestPath)) {
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
function lC(e, t) {
	if (e !== null) for (let n of Vt) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function uC(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(v(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function dC(e, t) {
	if (fC(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (fC(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (fC(n, t)) return n;
	return null;
}
function fC(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function pC(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ci))) {
		e.focus();
		return;
	}
	let t = e.querySelector(ci);
	if (t instanceof HTMLElement) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function mC(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = uC(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Bn(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Fn(t.readHeld(r));
}
async function hC(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!gC(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function gC(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return rC();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var _C = /* @__PURE__ */ new Map([
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
]), vC = [
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
function yC(e) {
	return Q(e, vC);
}
var bC = [
	"small",
	"medium",
	"large"
], xC = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], SC = [
	"start",
	"center",
	"end",
	"justify"
], CC = ["nowrap", "wrap"], wC = /* @__PURE__ */ new Map([
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
]), TC = ["inline", "trailing"], EC = [
	"filled",
	"outline",
	"underline",
	"ghost"
], DC = [
	"small",
	"medium",
	"large"
], OC = [
	"small",
	"medium",
	"large"
], kC = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], AC = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], jC = ["light", "dark"], MC = [
	"start",
	"center",
	"end",
	"stretch"
], NC = ["clip", "visible"], PC = [
	"visible",
	"hidden",
	"collapsed"
], FC = [
	"background",
	"raised",
	"tinted"
], IC = ["horizontal", "vertical"], LC = [
	"none",
	"gap",
	"rule"
], RC = [
	"none",
	"one",
	"many"
], zC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], BC = ["stack", "wrap"], VC = [
	"disabled",
	"auto",
	"always"
], HC = [
	"disabled",
	"proximity",
	"mandatory"
], UC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], WC = ["hex", "rgb"], GC = ["field", "swatch"], KC = [
	"fill",
	"contain",
	"cover",
	"none"
], qC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], JC = ["linear", "circular"], YC = ["keep", "replace"], XC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], ZC = [
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
], QC = [
	"None",
	"Shade",
	"Tint"
], $C = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, vC)}`],
	["themeColorClass", (e) => yw(e)],
	["iconClass", (e) => Aw(e)],
	["iconUrlCss", (e) => qv(e)],
	["safeUrl", (e) => ry(e)],
	["safeImageSource", (e) => ay(e)],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, bC)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, xC)}`],
	["textAppearanceClass", (e) => Sw(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, SC)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, CC)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, TC)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, AC)}`],
	["badgeTextFit", (e) => bw(e)],
	["buttonClass", (e) => `ui-button--${Q(e, kC)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, FC)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, IC)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, LC)}`],
	["selectionModeAttribute", (e) => Q(e, RC)],
	["selectionBackgroundCss", (e) => _w(mw(e, "background"))],
	["selectionForegroundCss", (e) => _w(mw(e, "foreground"))],
	["selectionMarkColorCss", (e) => _w(mw(e, "markColor"))],
	["selectionMarkCss", (e) => gw(mw(e, "mark"))],
	["selectionFontWeightCss", (e) => hw(mw(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, BC)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, VC)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, VC)}`],
	["hostViewport", (e) => sw(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, HC)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, EC)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, OC)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, DC)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, DC)}`],
	["textInputTypeAttribute", (e) => Q(e, UC)],
	["colorTextFormatAttribute", (e) => Q(e, WC)],
	["colorInputVariantAttribute", (e) => Q(e, GC)],
	["themeNameCss", (e) => Q(e, jC)],
	["alignmentCss", (e) => Q(e, MC)],
	["alignmentStretchFallbackCss", (e) => Q(e, MC) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, NC)],
	["layoutLengthCss", (e) => cw(e)],
	["thicknessCss", (e) => lw(e)],
	["radiusCss", (e) => uw(e)],
	["gridUnitCss", (e) => dw(e)],
	["pixelsCss", (e) => Mw(e)],
	["gridTemplateCss", (e) => fw(e)],
	["colorVariantCss", (e) => Ew(e)],
	["themeColorCss", (e) => _w(e)],
	["themeColorInlineCss", (e) => vw(e) ? "" : _w(e)],
	["themeColorCanonical", (e) => ww(e)],
	["textAppearanceFontSizeCss", (e) => Cw(e, "size")],
	["textAppearanceFontWeightCss", (e) => Cw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Cw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Cw(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => cw(M(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => cw(M(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => cw(M(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => cw(M(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => cw(M(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => lw(M(e, "base"))],
	["responsiveThicknessSmCss", (e) => lw(M(e, "sm"))],
	["responsiveThicknessMdCss", (e) => lw(M(e, "md"))],
	["responsiveThicknessXlCss", (e) => lw(M(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => lw(M(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => Nw(M(e, "base"))],
	["responsivePixelsSmCss", (e) => Nw(M(e, "sm"))],
	["responsivePixelsMdCss", (e) => Nw(M(e, "md"))],
	["responsivePixelsXlCss", (e) => Nw(M(e, "xl"))],
	["responsivePixelsXxlCss", (e) => Nw(M(e, "xxl"))],
	["visibilityBaseAttribute", (e) => Pw(e, "base")],
	["visibilitySmAttribute", (e) => Pw(e, "sm")],
	["visibilityMdAttribute", (e) => Pw(e, "md")],
	["visibilityXlAttribute", (e) => Pw(e, "xl")],
	["visibilityXxlAttribute", (e) => Pw(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, KC)}`],
	["backgroundImageCss", (e) => nw(e)],
	["imageFitSizeCss", (e) => Q(e, qC)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, JC)}`],
	["progressValueText", (e) => jw(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, YC)}`],
	["textAreaResizeCss", (e) => Q(e, XC)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, ZC)}`],
	["popupPlacementAttribute", (e) => Q(e, ZC)],
	["tabMenuEntriesAttribute", (e) => tw(e)]
]), ew = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function tw(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = ew.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function nw(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : Jv(t);
}
var rw = [
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
], iw = new Map(rw.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), aw = new Map(rw.map(([e, t]) => [e, t])), ow = /* @__PURE__ */ new Map([[NC, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : ow.get(t)?.get(e)) ?? _C.get(e) ?? Gt(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function sw(e) {
	return e == null || Q(e, VC) === "disabled" ? void 0 : "parent";
}
function cw(e) {
	if (e == null) return "";
	if (typeof e == "number") return Mw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Mw(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function lw(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function uw(e) {
	if (e == null) return "";
	if (typeof e == "number") return Mw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Mw(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function dw(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Mw(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function fw(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return dw(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return dw(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${dw(e[0])})` : e.map((e) => dw(e)).join(" ");
}
function $(e, t, n) {
	return pw(M(e, t), n);
}
function pw(e, t) {
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
function mw(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function hw(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function gw(e) {
	if (e == null) return "";
	switch (Q(e, zC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function _w(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Tw(e)) return Ew(e);
	let t = e, n = Ew(t.light), r = Ew(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = wC.get(Q(o, vC));
	return s ? `var(${s})` : "";
}
function vw(e) {
	if (typeof e != "object" || !e || Tw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function yw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, vC)}`;
}
function bw(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function xw(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", bw(n));
}
function Sw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, xC)}`;
}
function Cw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Mw(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Mw(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Mw(e);
		}
		default: return "";
	}
}
function ww(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Dw(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${P(r.rgb >> 16 & 255)}${P(r.rgb >> 8 & 255)}${P(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${P(e)}`;
	}
	let i = Ow(r.name);
	return i === null ? "" : `${i}/${kw(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Tw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Ew(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Ow(t.name), i = n ?? (r === null ? void 0 : iw.get(r));
	if (!i) return "";
	let a = kw(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = N(c * (1 - o)), l = N(l * (1 - o)), u = N(u * (1 - o))) : a === "Tint" && (c = N(c + (255 - c) * o), l = N(l + (255 - l) * o), u = N(u + (255 - u) * o)), `#${P(c)}${P(l)}${P(u)}${P(s)}`;
}
function Dw(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = vC[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Ow(e) {
	if (typeof e == "number") return aw.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function kw(e) {
	if (typeof e == "number") return QC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Aw(e) {
	let t = Gv(e);
	return t === null ? ey(e) : t.tinted ? "" : Wv;
}
function jw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Mw(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Nw(e) {
	return e == null ? "" : Mw(e);
}
function Pw(e, t) {
	let n = vf(e, t);
	if (n == null) return;
	let r = Q(n, PC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var Fw = "ui-notification-host", Iw = "ui-notification", Lw = "ui-notification--leaving", Rw = "ui-notification__message", zw = "ui-notification__action", Bw = "ui-notification__close", Vw = 5e3, Hw = 160, Uw = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), Ww = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? Vw, this.ensureHost();
	}
	show(e) {
		let t = yC(e.severity), n = document.createElement("div");
		n.className = Uw.has(t) ? `${Iw} ${Iw}--${t}` : Iw, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = Rw, r.textContent = e.message, n.append(r), e.action !== void 0 && n.append(Gw(e.action));
		let i = document.createElement("button");
		if (i.type = "button", i.className = Bw, i.setAttribute("aria-label", x.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), this.ensureHost().append(n), e.sticky === !0) return n;
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
		!e.isConnected || e.classList.contains(Lw) || (e.classList.add(Lw), window.setTimeout(() => e.remove(), Hw));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${Fw}`), n = t ?? document.createElement("div");
		return n.classList.add(Fw), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function Gw(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${zw} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var Kw = class {
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
		!this.state.set(e, t, n, qw(i[0]?.component)) && !this.restoring || a || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: n,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	recordSentValue(e, t, n) {
		this.state.set(e, t, n, qw(this.addressResolver.resolveProperties(e, t)[0]?.component));
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
			Wn(e);
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
function qw(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(Ut) ?? null, r = e === null ? 0 : b(e), i = n.getAttribute(m);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Cn(e, Sn(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var Jw = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = Yw(v(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = Yw(v(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function Yw(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/updates/collection-sinks.ts
var Xw = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function Zw(e, t, n, r) {
	return {
		action: sn(e.action),
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
var Qw = class {
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
			return n === void 0 && (n = aT(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = An(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (ln(t) !== "CollectionChange") continue;
			let e = t;
			if (sn(e.action) === "Insert") for (let t of this.findItemsHosts(v(e.component?.id), e.component?.dynamicParameters ?? [])) {
				let r = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = e.get(t) ?? null;
		r !== null && this.readItemScope(r) === void 0 && this.itemsRenderer.registerItemScope(r, iT(r), n);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = kn(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		Tg(e, t, {
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
				let r = nT(n, t[e + 1]);
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
		if (sg(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = aT(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && ex(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), rT(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (ln(e)) {
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
		let t = v(e.address?.component?.id), n = cn(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, Zw(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		this.forgetRowState(t, n, e);
		let a = this.findItemsHosts(t, n);
		if (a.length === 0) {
			(sn(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of a) this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (sg(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (sn(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				$w(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				tT(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), vg(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (sn(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (sn(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${h}]`)) if (kn(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = fg(e, w(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, mg(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return cx(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = w(e), a = fg(e, i), o = aT(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, mg(a, l, i.index ?? null)) : (_g(a, c, l), c.replaceWith(l)));
		}
	}
};
function $w(e, t) {
	let n = w(e), r = fg(e, n), i = aT(e, n), a = eT(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? da(a, o, n) : null;
		i.delete(t), hg(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function eT(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function tT(e, t) {
	let n = w(e), r = fg(e, n), i = aT(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, gg(r, t, n.newIndex ?? null));
	}
}
function nT(e, t) {
	if (t === void 0 || ln(e) !== "CollectionChange" || ln(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (sn(n.action) !== "Reset" || sn(r.action) !== "Insert") return null;
	let i = v(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== v(r.component?.id) || !ex(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function rT(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? w(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function iT(e) {
	let t = b(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : b(n);
}
function aT(e, t = w(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(m);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-engine.ts
var oT = "ui-invalid", sT = "ui-validation--warning", cT = "ui-validation--info", lT = "data-ui-validation-message", uT = "ui-validation-message--marker", dT = "data-ui-tooltip", fT = "data-ui-tooltip-placement", pT = "data-ui-tooltip-mark", mT = "top-end", hT = "--ui-validation-marker-host", gT = "ui-validation-mark", _T = "--ui-validation-presentation", vT = "--ui-validation-color", yT = "Validation", bT = "input:not([type='hidden']), textarea, select, .ui-select__trigger[role='combobox'], [role='spinbutton']", xT = {
	Error: 0,
	Warning: 1,
	Info: 2
}, ST = {
	Error: oT,
	Warning: sT,
	Info: cT
}, CT = `.${oT}, .${sT}, .${cT}`, wT = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, TT = {
	Error: `${gT}--error`,
	Warning: `${gT}--warning`,
	Info: `${gT}--info`
}, ET = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(CT)), C(this.root, CT, { childList: !0 }, (e) => this.applyRenderedMessages(e));
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			jT(t, OT(t) === "Error");
			let e = t.querySelector(`:scope > [${lT}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && MT(this.markerMirrors, t, e, {
				message: n,
				severity: OT(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === yT) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = v(e.reference.componentId), n = DT(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = v(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => nn(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = v(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: kT(e.severity)
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		AT(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
			severity: kT(t.severity)
		});
		let o;
		for (let e of n) (o === void 0 || xT[e.severity] < xT[o.severity]) && (o = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => nn(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${We}="${Wt(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => nn(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && kT(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) pr(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function DT(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.message == "string" ? t.message : "";
	return n.length === 0 ? void 0 : {
		message: n,
		severity: kT(t.severity)
	};
}
function OT(e) {
	return e.classList.contains(sT) ? "Warning" : e.classList.contains(cT) ? "Info" : "Error";
}
function kT(e) {
	let t = rn(e);
	return t === "Unknown" ? "Error" : t;
}
function AT(e, t, n) {
	for (let e of Object.values(ST)) t.classList.toggle(e, n !== void 0 && ST[n.severity] === e);
	jT(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(vT) : r.style.setProperty(vT, `var(--ui-color-${wT[n.severity]})`);
	let i = t.querySelector(`[${lT}]`);
	i !== null && (i.textContent = n?.message ?? "", MT(e, r, i, n));
}
function jT(e, t) {
	for (let n of e.querySelectorAll(bT)) {
		let r = n.closest(io);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function MT(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(_T).trim() === "marker";
	if (n.classList.toggle(uT, a), r !== void 0 && a) {
		n.setAttribute(dT, r.message), n.setAttribute(fT, mT), t.setAttribute(pT, ""), NT(e, t, r, i.getPropertyValue(hT).trim()), t.contains(document.activeElement) ? vb(n) : yb(n);
		return;
	}
	n.removeAttribute(dT), n.removeAttribute(fT), t.removeAttribute(pT), NT(e, t, void 0, ""), yb(n);
}
function NT(e, t, n, r) {
	let i = e.get(t), a = n === void 0 || r.length === 0 ? null : PT(t, r);
	if (n === void 0 || a === null) {
		i?.remove(), e.delete(t);
		return;
	}
	let o = i ?? document.createElement("span");
	o.className = `${gT} ${TT[n.severity]}`, o.textContent = n.message, o.setAttribute(dT, n.message), o.setAttribute(fT, mT), o.parentElement !== a && a.append(o), e.set(t, o), yb(o);
}
function PT(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var FT = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, IT = /* @__PURE__ */ new WeakMap(), LT = /* @__PURE__ */ new Map([["iconClass", $v]]), RT = /* @__PURE__ */ new WeakMap(), zT = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(an(e), t);
	}
	apply(e) {
		let t = an(e.operation.kind), n = this.handlers.get(t);
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
			let t = Fn(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t);
		}), this.register("Markup", (e) => {
			_y(e.target, S(e.convertedValue) ? "" : Fn(e.convertedValue));
		}), this.register("Attribute", (e) => {
			let t = KT(e.operation);
			if (S(e.value) || S(e.convertedValue)) {
				GT(e.target, t);
				return;
			}
			WT(e.target, t, Fn(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			GT(e.target, KT(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = KT(e.operation), n = !S(e.value) && BT(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (S(e.convertedValue) ? "" : Fn(e.convertedValue));
			VT(e.target, UT(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !S(e.value) && BT(e.value, e.operation.condition ?? "None") ? Fn(e.convertedValue).trim() : "";
			HT(e.target, UT(e), t, LT.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = KT(e.operation), n = !S(e.value) && BT(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Fn(e.convertedValue).trim() : "";
				HT(e.target, UT(e), t);
			}
		}), this.register("Style", (e) => {
			let t = KT(e.operation), n = e.target;
			if (S(e.value) || S(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Fn(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = KT(e.operation), n = e.target, r = S(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function BT(e, t) {
	switch (on(t)) {
		case "None": return !0;
		case "HasValue": return !S(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !S(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !S(e);
	}
}
function VT(e, t, n, r, i) {
	let a = RT.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), RT.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), WT(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && GT(e, n);
}
function HT(e, t, n, r) {
	let i = IT.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), IT.set(e, i));
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
function UT(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function WT(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function GT(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function KT(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var qT = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => $C.has(e.name),
			convert: (e) => $C.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = JT(e.name), n = {
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
function JT(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var YT = class {
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
function XT(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function ZT(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => XT(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => XT(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var QT = class {
	converters = new qT();
	events = new YT();
	operations = new zT();
	valueReaders;
	collectionSinks = new Xw();
	rowDecorators = new FT();
	constructor(e, t, n, r) {
		ZT(this.events), this.valueReaders = new Ln(r);
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
}, $T = "Submenu", eE = "ui-menu__submenu", tE = "Select", nE = {
	kind: "menu",
	decorate: rE
};
function rE(e) {
	if (!iE(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, $T);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(qe, ""), aE(e.item, "Kind") === tE && e.row.setAttribute(Je, ""), aE(e.item, "Expanded") === !0 && e.row.setAttribute(Ye, "");
	let r = document.createElement("div");
	r.className = eE, r.appendChild(n), Mb(r, e.key, e.item), e.row.appendChild(r);
}
function iE(e) {
	let t = aE(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function aE(e, t) {
	let n = Hh(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/runtime/engine-start.ts
var oE = 2;
function sE(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= oE && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function cE(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var lE = "ne.standard.ui.windowId", uE = [
	500,
	1e3,
	2e3
], dE = 3, fE = [
	["file input", ({ root: e }) => new Gi({ root: e })],
	["image input", ({ root: e }) => new Xa({ root: e })],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new po({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new vo({ root: e })],
	["image fallback", ({ root: e }) => new xo({ root: e })],
	["radio group sync", ({ root: e }) => new Po({ root: e })],
	["select interaction", ({ root: e }) => new Ns({ root: e })],
	["search input", ({ root: e }) => new Xo({ root: e })],
	["debounced commit", ({ root: e }) => new Hs({ root: e })],
	["items selection", ({ root: e }) => new Ag({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new ec({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["number input", ({ root: e, propertyPatchEngine: t }) => new Lc({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new Nm({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new eu({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new Ru({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new Z_({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new Ju({ root: e })],
	["split button", ({ root: e }) => new xp({ root: e })],
	["toggle button", ({ root: e }) => new _o({ root: e })],
	["button group", ({ root: e }) => new Op({ root: e })],
	["menu", ({ root: e }) => new Td({ root: e })],
	["collapsible", ({ root: e }) => new Of({ root: e })],
	["menu group", ({ root: e }) => new Ud({ root: e })],
	["menu search", ({ root: e }) => new tf({ root: e })],
	["side drawer", ({ root: e }) => new xf({ root: e })],
	["grid splitter", ({ root: e }) => new op({ root: e })],
	["accordion", ({ root: e }) => new Mp({ root: e })],
	["tabs", ({ root: e }) => new Qp({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new A_({
		root: e,
		effects: t
	})],
	["breadcrumbs", ({ root: e }) => new im({ root: e })],
	["scroll anchor", ({ root: e }) => new _v({ root: e })],
	["scroll group", ({ root: e }) => new jv({ root: e })],
	["flyout interaction", ({ root: e }) => new xi({ root: e })],
	["text fold", ({ root: e }) => new V_({ root: e })],
	["tooltip", ({ root: e }) => rb(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new Hv({ root: e }) : void 0]
], pE = class {
	windowId;
	options;
	root;
	metadata = new Yt(wx());
	hydration = Dx();
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
		this.options = e, this.root = e.root ?? document, this.windowId = _E(e.windowIdStorageKey ?? lE), this.dom = new On(this.root), x.load(this.root), e.strings !== void 0 && x.register(e.strings), this.extensions = new QT(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(nE);
		let t = new bn(this.dom, this.metadata), n = this.extensions.operations, r = new jx(), i = new Kw(t, n, this.extensions, r);
		this.reactiveSources = new Jw(i), this.dialogs = new cd({ root: this.root }), this.notifications = new Ww({ root: this.root }), this.effects = new cC({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new gr(this.metadata), o, u = new lr(a, i, new fr(), {
			effects: this.effects,
			dom: this.dom,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(v(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new Sx(this.dom), f = new kb(this.metadata, d, this.extensions, n, r);
		this.virtualization = new fx({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new Qw(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), new Rb({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			valueReaders: this.extensions.valueReaders,
			virtualization: this.virtualization
		}), this.transport = new WS(this.windowId, (e) => this.applyChanges(e), e.signalR), this.dispatcher = new Ox(this.transport);
		let p = new $S(this.transport);
		o = new $n({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordSentValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(Jt.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new ET({
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
		for (let [e, t] of fE) sE(e, t, this.engineContext);
		sE("tree", ({ root: e, effects: t }) => new Xg({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), this.eventPipeline = new ar({
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
		this.eventPipeline.addEvent(O_.name, O_.registration), this.tables = new Oh({ root: this.root }), this.windows = new Gb({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: x,
			observeComponents: C,
			observeSize: th,
			dialogs: this.dialogs,
			store: new Md(),
			numbers: _c,
			temporal: Zc,
			icons: { apply: Zv },
			badges: { writeCount: xw },
			values: {
				read: (e) => this.extensions.valueReaders.readHeld(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				}
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(Ut), a = r === null ? void 0 : this.metadata.getExposedProperty(b(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: _b,
			renames: { open: ed },
			tables: this.tables,
			rows: Ob(d, f, this.virtualization),
			uploads: Ii,
			selection: Aa,
			popups: Db,
			roving: ea
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
		if (SE() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), CE(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await gE(), this.hydrate(), this.startEnginesAwaitingHydration();
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
		for (let t of e) sE(cE(t), t, this.pluginContext);
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
		sE(cE(e), e, this.pluginContext);
	}
	applyChanges(e) {
		if (this.inbound === null && !JS(e)) {
			this.applyNow(e);
			return;
		}
		let t = (this.inbound ?? Promise.resolve()).then(() => YS(e)).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= dE) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (wE(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(JS(e) ? await YS(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = yE(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? bE(window.location.search) : e.parameters
		};
		for (let e = 0;; e++) try {
			return await this.transport.attachAsync(t);
		} catch (t) {
			if (e >= uE.length) return c("attaching the runtime failed after retrying; giving up.", t), null;
			s("attaching the runtime failed; retrying.", {
				attempt: e + 1,
				error: t
			}), await hE(uE[e]);
		}
	}
};
async function mE(e = {}) {
	let t = performance.now(), n = new pE(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function hE(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function gE() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function _E(e) {
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
	let n = vE();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function vE() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function yE() {
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
function bE(e) {
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
var xE = "ne-standard-ui:reloaded-view";
function SE() {
	try {
		return sessionStorage.getItem(xE);
	} catch {
		return null;
	}
}
function CE(e) {
	try {
		sessionStorage.setItem(xE, e);
	} catch {}
}
function wE() {
	try {
		sessionStorage.removeItem(xE);
	} catch {}
}
re(), mE().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
