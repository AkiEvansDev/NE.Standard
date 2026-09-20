//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), t = "NE.Standard.UI", n = "ne.ui:log", r = {
	debug: 0,
	warn: 1,
	error: 2,
	silent: 3
}, i = d();
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
	r[i] <= r.warn && f(console.warn, e, t);
}
function c(e, t) {
	r[i] <= r.error && f(console.error, e, t);
}
function l(e, t) {
	r[i] <= r.debug && f(console.debug, e, t);
}
var u = class {
	warned = /* @__PURE__ */ new WeakSet();
	warn(e, t, n) {
		this.warned.has(e) || (this.warned.add(e), s(t, {
			subject: e,
			...n === void 0 ? {} : { data: n }
		}));
	}
};
function d() {
	try {
		let e = localStorage.getItem(n);
		if (e !== null && e in r) return e;
	} catch {}
	return "warn";
}
function f(e, n, r) {
	r === void 0 ? e(`${t} ${n}`) : e(`${t} ${n}`, r);
}
//#endregion
//#region src/runtime/global-api.ts
function p() {
	return te();
}
function ee(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = te();
	n.runtime = e, ne(e, n);
}
function te() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
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
			let r = re(e, t), i = window.NEStandardUI?.runtime;
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
function ne(e, t) {
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
function re(e, t) {
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
var ie = "data-ui-id", ae = "data-ui-context", oe = "data-ui-pc", m = "data-ui-key", se = "data-ui-unselectable", ce = "data-ui-undraggable", le = "data-ui-unremovable", ue = "data-ui-unrenamable", de = "data-ui-no-context-menu", fe = "data-ui-tabs-draggable", pe = "data-ui-name", me = "data-ui-bind-", he = "data-ui-bind-value", ge = (e) => `data-ui-no-${e}`, _e = "data-ui-event-boundary", ve = "data-ui-image-caption", h = "data-ui-items-host", ye = "data-ui-collection-sink", be = "data-ui-items-query", xe = "data-ui-empty-template", Se = "data-ui-group-template", Ce = "data-ui-empty-placeholder", we = "data-ui-group-header", Te = "data-ui-group", Ee = "data-ui-value-kind", De = "data-ui-host-mode", Oe = "data-ui-host-viewport", ke = "data-ui-scroll-group", Ae = "data-ui-scroll-lines", je = "data-ui-source-line", Me = "data-ui-window-spacer", Ne = "data-ui-window-size", Pe = "data-ui-window-offset", Fe = "data-ui-window-total", Ie = "data-ui-window-more-before", Le = "data-ui-window-more-after", Re = "data-ui-form-id", ze = "data-ui-visibility", Be = "data-ui-collapsed", Ve = "data-ui-menu-group", He = "data-ui-menu-select", Ue = "data-ui-menu-open", We = "data-ui-menu-item-kind", Ge = `[${Ve}] > .ui-menu-item, .ui-menu-item[${We}="check"]`, Ke = "data-ui-collapse-toggle", qe = "data-ui-folding", Je = "data-ui-column-limits", Ye = "data-ui-row-limits", Xe = "data-ui-splitter-step", Ze = "data-ui-table-column", Qe = "data-ui-table-hide-below", $e = "data-ui-table-hidden", et = "data-ui-table-last", tt = "data-ui-table-reordering", nt = "data-ui-table-dragging", rt = "data-ui-table-drop", it = "data-ui-table-scrolled", at = "data-ui-tree-parent", ot = "data-ui-tree-children", st = "data-ui-tree-expanded", ct = "data-ui-tree-title", lt = "data-ui-tree-loading", ut = "data-ui-tree-drop-target", dt = "data-ui-tree-boot", ft = "data-ui-tree-draggable", pt = "data-ui-row-editing", mt = "data-ui-image-source", ht = "data-ui-file-max-size", gt = "data-ui-splitting", _t = "data-ui-pointer-focus", vt = "data-ui-selection", yt = "data-ui-selected", bt = "data-ui-selected-key", xt = "data-ui-selected-keys", St = "data-ui-bind-selected-key", Ct = "data-ui-tabs-selected", wt = "data-ui-tab-order", Tt = "data-ui-tab-caption", Et = [
	ze,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Dt = "data-ui-submit-form-id", Ot = `[${ie}]`;
function kt(e) {
	return String(e).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function At(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var jt = 0;
function Mt(e, t) {
	return e.id.length === 0 && (jt++, e.id = `${t}-${jt}`), e.id;
}
//#endregion
//#region src/metadata/metadata-index.ts
var Nt = {
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
}, Pt = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(_(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${_(t.componentId)}:${e.propertyName}`, t);
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
		for (let t of this.metadata.bindings) if (_(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(nn(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(nn(e, tn(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(rn(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(v(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(v(e))?.has(t) === !0;
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
		let t = _(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = _(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(nn(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(nn(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = v(e.eventName), n = _(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(rn(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = _(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = _(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = _(e.componentId);
		t > 0 && this.itemValuesByComponentId.set(t, e);
	}
	addValidation(e) {
		let t = _(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function g(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Ft(e) {
	return g(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function It(e) {
	return e == null ? "OneWay" : g(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Lt(e) {
	return g(e, ["Property", "Event"]);
}
function Rt(e) {
	return e == null ? "SetProperty" : g(e, ["SetProperty", "Effect"]);
}
function zt(e) {
	return g(e, [
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
function Bt(e) {
	return g(e, ["Ascending", "Descending"]);
}
function Vt(e) {
	return g(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Ht(e) {
	return g(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ut(e) {
	return typeof e == "string" ? e : g(e, [
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
function Wt(e) {
	return g(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function Gt(e) {
	return g(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function _(e) {
	return typeof e == "number" ? e : e?.value ?? 0;
}
function Kt(e) {
	return typeof e == "string" ? e : e?.name ?? "";
}
function qt(e) {
	return g(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function Jt(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Yt(e) {
	return g(e, ["Auto", "Smooth"]);
}
function Xt(e) {
	return g(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Zt(e) {
	return g(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Qt(e) {
	return g(e, ["Light", "Dark"]);
}
function $t(e) {
	return g(e, ["Horizontal", "Vertical"]);
}
function en(e) {
	return { value: _(e) };
}
function v(e) {
	return e?.trim().toLowerCase() ?? "";
}
function tn(e) {
	return e?.trim() ?? "";
}
function nn(e, t) {
	return `${e}:${tn(t)}`;
}
function rn(e, t) {
	return `${e}:${v(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var an = class {
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
		return this.dom.findAllComponents(_(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = _(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = _(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${me}${At(r.propertyName)}="${kt(a)}"]` : null;
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
	resolvePropertyOn(e, t) {
		let n = _(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
				property: { name: r.propertyName }
			}
		};
	}
	resolveOperationTargets(e, t) {
		return on(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${At(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
function on(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		for (let t of e.querySelectorAll(r)) if (t.closest(Ot) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/addressing/dynamic-parameters.ts
function sn(e) {
	return un(e, oe);
}
function cn(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = dn(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function ln(e, t) {
	let n = sn(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = cn(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function un(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function dn(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function fn(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var pn = class {
	root;
	componentsById = /* @__PURE__ */ new Map();
	staticComponentsById = /* @__PURE__ */ new Map();
	stale = !1;
	constructor(e) {
		this.root = e, this.rebuild();
	}
	invalidate() {
		this.stale = !0;
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear();
		let e = this.root.querySelectorAll(Ot), t = this.root.querySelector(`[${we}]`) !== null;
		for (let n of e) {
			let e = mn(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && hn(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Mt(e, t);
	}
	findComponentParts(e, t, n) {
		return fn(this.findAllComponents(e, t), n);
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.stale && this.rebuild(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		return (this.componentsById.get(e) ?? []).filter((e) => ln(e, t));
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(Ot);
			if (e === null || !gn(this.root, e)) return null;
			let r = mn(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: cn(e, sn(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function mn(e) {
	return un(e, ie);
}
function y(e) {
	let t = e.closest(Ot), n = t === null ? 0 : mn(t);
	return n > 0 ? n : null;
}
function hn(e) {
	return sn(e) === 0;
}
function gn(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/client-strings.ts
var _n = "script[type='application/json'][data-ui-strings]", b = new class {
	words = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	hasStringsBlock = !1;
	load(e = document) {
		let t = e.querySelector(_n)?.textContent?.trim() ?? "";
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
function vn(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function x(e) {
	return e == null;
}
var yn = "data-ui-trim-input", bn = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Tn) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ee);
		if (t === null) return xn(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(yn) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Cn(e);
		return t === null ? null : this.read(t);
	}
};
function xn(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Sn = "input, textarea, select";
function Cn(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Sn) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Sn}`);
}
function wn(e) {
	return e === null ? null : Number(e);
}
var Tn = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Ct)
	},
	{
		kind: "tab-order",
		read: (e) => wn(e.getAttribute(wt))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Tt)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(ct)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(bt)
	},
	{
		kind: "selected-keys",
		read: (e) => En(e, xt)
	},
	{
		kind: "items-query",
		read: (e) => En(e, be)
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
function En(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Dn(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/draft-events.ts
var On = "ui-draft-dropped";
function kn(e) {
	e.dispatchEvent(new Event(On, { bubbles: !0 }));
}
//#endregion
//#region src/updates/value-binding-engine.ts
var An = "data-ui-clear", jn = "data-ui-form-id", Mn = ["change", "toggle"], Nn = [
	...Mn,
	"expand",
	"collapse",
	"open",
	"close"
];
function Pn(e) {
	let t = It(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Fn(e) {
	return It(e) === "OnSubmit";
}
var In = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Mn) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(On, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute(jn) || this.resolveWritableBinding(e.target)?.buffered === !0 && this.bufferValue(e.target);
	}
	releaseDropped(e) {
		if (e.target instanceof Element) for (let t of [...this.bufferedElements]) e.target.contains(t) && this.bufferedElements.delete(t);
	}
	releaseForm(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) n.getAttribute(jn) === e && (this.bufferedElements.delete(n), t.push(n));
		return t;
	}
	hold(e) {
		this.bufferedElements.add(e);
	}
	release(e) {
		return this.bufferedElements.delete(e);
	}
	isHeld(e) {
		return this.bufferedElements.has(e);
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${An}]`);
		if (t === null) return;
		let n = t.closest(Ot), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r != null && (Dn(r), r.dispatchEvent(new Event("change", { bubbles: !0 })));
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
		if (e.getAttribute(jn) === null) {
			s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName });
			return;
		}
		this.bufferedElements.add(e);
	}
	async submitFormAsync(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (n.getAttribute(jn) !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = this.resolveWritableBinding(n);
			r !== null && t.push(this.syncValueAsync(n, r.bindingId));
		}
		await Promise.all(t);
	}
	resolveWritableBinding(e) {
		let t = e.getAttribute(he);
		if (t !== null) {
			let e = this.options.metadata.getBindingById(Number(t));
			return {
				bindingId: t,
				buffered: e !== void 0 && Fn(e.mode)
			};
		}
		for (let t of Array.from(e.attributes)) {
			if (!t.name.startsWith("data-ui-bind-")) continue;
			let e = this.options.metadata.getBindingById(Number(t.value));
			if (e !== void 0 && Pn(e.mode)) return {
				bindingId: t.value,
				buffered: Fn(e.mode)
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
		let i = this.options.valueReaders.readBound(e), a = await this.options.dispatcher.dispatchAsync({
			componentId: n.componentId,
			propertyName: t,
			dynamicParameters: n.dynamicParameters,
			value: i
		});
		this.options.recordSent(r, n.dynamicParameters, i), await this.options.applyChanges(a);
	}
	async syncPropertyAsync(e, t, n, r) {
		let i = this.options.metadata.getBindingByComponentAndPropertyId(e, t);
		if (i === void 0 || !Pn(i.mode) || Fn(i.mode)) return;
		let a = this.options.metadata.getPropertyDefinition(t)?.propertyName;
		if (a === void 0) return;
		let o = await this.options.dispatcher.dispatchAsync({
			componentId: e,
			propertyName: a,
			dynamicParameters: n,
			value: r
		});
		this.options.recordSent({
			componentId: e,
			propertyId: t
		}, n, r), await this.options.applyChanges(o);
	}
	async whenSettled(e) {
		await this.pendingSyncByComponent.get(e);
	}
}, Ln = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = v(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = v(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(v(e));
	}
	markAttached(e) {
		let t = v(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, Rn = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: en(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, zn = {
	dispatched: !1,
	success: !1
}, Bn = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Vn = class {
	options;
	root;
	registry;
	requestFactory = new Rn();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Ln(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Un(t, r.element)) return;
		let i = t.target.closest(`[${_e}]`);
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
			let t = e instanceof Bn, r = t ? e.reason : e;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), zn;
		let a = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Wn(r) : null);
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a) === !1) return r.domEvent.preventDefault(), zn;
			await this.options.valueBinding?.submitFormAsync(a);
		}
		if (await this.isRefusedValueEventAsync(t, n) || this.options.dispatcher.isPending(i)) return zn;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let o = await this.options.dispatcher.dispatchAsync(i).catch((e) => {
			throw new Bn(e);
		});
		return await this.options.applyChanges(o.changes), this.options.effects.applyAll(o.command?.effects, this.options.dom), this.options.afterEffects?.(), this.options.interactionEngine.applyEvent({
			name: `after-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		}), {
			dispatched: !0,
			success: o.command?.success !== !1,
			error: o.command?.message ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Nn.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
	}
	shouldHandleComponent(e, t, n) {
		return n.hasAttribute(ge(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Hn(e.preventDefault, t) && t.domEvent.preventDefault(), Hn(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Hn(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Un(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Wn(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Gn = class {
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
				componentId: _(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(_(e.reference.componentId), e.reference.propertyId);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (Rt(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!qn(i)) return;
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
			effect: Kn(r, t),
			dom: this.options.dom
		});
	}
};
function Kn(e, t) {
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
function qn(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Jn = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Yn(t, e.operator, e.value);
	}
};
function Yn(e, t, n) {
	switch (zt(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return Xn(e, n, (e) => e > 0);
		case "GreaterOrEqual": return Xn(e, n, (e) => e >= 0);
		case "Less": return Xn(e, n, (e) => e < 0);
		case "LessOrEqual": return Xn(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return Zn(e, n);
		default: return !1;
	}
}
function Xn(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Zn(e, t) {
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
var Qn = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(v(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) tr(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(v(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(nr(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(rr(e, t)) ?? [];
	}
	addInteraction(e) {
		if ($n(e)) {
			let t = _(e.sourceEvent?.componentId), n = v(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(nr(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(nr(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (er(e)) {
			let t = _(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(rr(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(rr(t, n), r)), r.push(e);
			}
		}
	}
};
function $n(e) {
	return Lt(e.sourceKind) === "Event";
}
function er(e) {
	return Lt(e.sourceKind) === "Property";
}
function tr(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function nr(e, t) {
	return `${e}:${v(t)}`;
}
function rr(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/interactions/anchored-popup.ts
var ir = /* @__PURE__ */ new Set([
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
function ar(e) {
	return ir.has(e);
}
var or = 4, sr = 12, cr = /* @__PURE__ */ new Map(), lr = !1, ur = null;
function S(e, t, n) {
	cr.set(t, {
		anchor: e,
		options: n
	}), hr(), ur?.observe(t), fr(t), _r(e, t, n);
}
var dr = "data-ui-popup-lifted";
function fr(e) {
	e.hasAttribute(dr) || !pr(e) || (e.setAttribute("popover", "manual"), e.setAttribute(dr, ""), e.showPopover());
}
function pr(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function mr(e) {
	e.hasAttribute(dr) && (e.matches(":popover-open") && e.hidePopover(), e.removeAttribute("popover"), e.removeAttribute(dr));
}
function C(e) {
	e != null && (cr.delete(e), ur?.unobserve(e), mr(e));
}
function hr() {
	lr || (lr = !0, document.addEventListener("scroll", gr, !0), window.addEventListener("resize", gr), ur = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = cr.get(t.target);
			e !== void 0 && _r(e.anchor, t.target, e.options);
		}
	}));
}
function gr() {
	for (let [e, t] of cr) {
		if (!e.isConnected) {
			C(e);
			continue;
		}
		_r(t.anchor, e, t.options);
	}
}
function _r(e, t, n) {
	n.minAnchorWidth === !0 && (t.style.minWidth = `${e.getBoundingClientRect().width}px`);
	let r = e.getBoundingClientRect(), i = (n.crossAnchor ?? e).getBoundingClientRect(), a = t.getBoundingClientRect(), o = br(r, a, n), s = Er(r, i, a, o, n.gap), c = Dr(r, i, a, o, n.gap);
	n.arrow === !0 && (Sr(o) ? c = vr(c, i.left + i.width / 2, a.width) : s = vr(s, i.top + i.height / 2, a.height)), s = kr(s, a.height, window.innerHeight), c = kr(c, a.width, window.innerWidth), t.style.top = `${s}px`, t.style.left = `${c}px`, t.dataset.uiPlacement = o, yr(t, i, a, o, s, c);
}
function vr(e, t, n) {
	let r = t - e;
	return r < sr ? e - (sr - r) : r > n - sr ? e + (r - (n - sr)) : e;
}
function yr(e, t, n, r, i, a) {
	let o = Sr(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(sr, Math.min(s, c - sr))}px`);
}
function br(e, t, n) {
	let r = n.placement, i = xr(t, r) + n.gap, a = Cr(e, r), o = wr(r);
	return a >= i || Cr(e, o) <= a ? r : o;
}
function xr(e, t) {
	return Sr(t) ? e.height : e.width;
}
function Sr(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Cr(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function wr(e) {
	return e.startsWith("top") ? `bottom${Tr(e)}` : e.startsWith("bottom") ? `top${Tr(e)}` : e.startsWith("left") ? `right${Tr(e)}` : `left${Tr(e)}`;
}
function Tr(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Er(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Or(t.top, t.height, n.height, r);
}
function Dr(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Or(t.left, t.width, n.width, r);
}
function Or(e, t, n, r) {
	let i = Tr(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function kr(e, t, n) {
	return Math.max(or, Math.min(e, n - t - or));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Ar = 32;
function w(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((n) => {
		let i = jr(e, n, t);
		i !== null && r(i);
	});
	return i.observe(e, {
		subtree: !0,
		childList: n.childList ?? !1,
		characterData: n.characterData ?? !1,
		attributes: n.attributeFilter !== void 0,
		...n.attributeFilter === void 0 ? {} : { attributeFilter: [...n.attributeFilter] }
	}), i;
}
function jr(e, t, n) {
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
		if (r.size > Ar) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Mr = /* @__PURE__ */ new Set(), Nr = /* @__PURE__ */ new Map(), Pr = 0, Fr = !1;
function Ir() {
	Fr || (Fr = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || Rr() && e.preventDefault();
	}, !0));
}
function Lr() {
	for (let e of Mr) for (let t of e.openPopups()) if (t.isConnected) return !0;
	return !1;
}
function Rr() {
	let e = [];
	for (let t of Mr) for (let n of t.openPopups()) e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...Nr.keys()]) t.has(e) || Nr.delete(e);
	for (let { popup: t } of e) Nr.has(t) || Nr.set(t, ++Pr);
	e.sort((e, t) => (Nr.get(t.popup) ?? 0) - (Nr.get(e.popup) ?? 0));
	for (let { instance: t, popup: n } of e) if (t.dismiss(n, "escape")) return !0;
	return !1;
}
var zr = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Mr.add(this), Ir();
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
}, Br = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function Vr(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	return (t ?? e.querySelector(Br) ?? e).focus({ preventScroll: !0 }), n;
}
function Hr(e, t) {
	e != null && t.contains(document.activeElement) && e.focus({ preventScroll: !0 });
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Ur = "ui-flyout", Wr = "ui-flyout--open", Gr = "ui-flyout__anchor", Kr = "ui-flyout__content", qr = `.${Ur}.${Wr}`, Jr = "data-ui-flyout-no-backdrop-close", Yr = "data-ui-flyout-no-escape-close", Xr = 4, Zr = `${Ur}--`, Qr = "bottom-start", $r = class {
	root;
	returnFocus = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Ur}`)) this.place(e);
		w(this.root, `.${Ur}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new zr({
			openPopups: () => this.root.querySelectorAll(qr),
			canDismiss: (e, t) => !e.hasAttribute(t === "escape" ? Yr : Jr),
			close: (e) => this.setOpen(e, !1)
		});
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Kr}`), n = e.querySelector(`:scope > .${Gr}`);
		if (t === null) return;
		let r = e.classList.contains(Wr);
		if (this.describeAnchor(n, t, r), !r) {
			C(t), Hr(this.returnFocus.get(e), e), this.returnFocus.delete(e);
			return;
		}
		S(ei(n) ?? e, t, {
			placement: ti(e),
			gap: Xr
		});
		let i = Vr(t);
		i !== null && this.returnFocus.set(e, i);
	}
	describeAnchor(e, t, n) {
		if (e === null) return;
		let r = e.querySelector(Br) ?? e;
		r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("aria-controls", Mt(t, "ui-flyout-content"));
	}
	handleFocusOut(e) {
		if (!(e instanceof FocusEvent)) return;
		let t = e.target instanceof Element ? e.target.closest(qr) : null;
		if (t === null || t.hasAttribute(Jr)) return;
		let n = e.relatedTarget;
		n === null || n instanceof Node && t.contains(n) || this.setOpen(t, !1);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Gr}`)?.closest(`.${Ur}`) ?? null;
		t !== null && this.setOpen(t, !t.classList.contains(Wr));
	}
	setOpen(e, t) {
		e.classList.contains(Wr) !== t && (e.classList.toggle(Wr, t), this.place(e), e.dispatchEvent(new Event("toggle", { bubbles: !0 })), e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 })));
	}
};
function ei(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function ti(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Zr)) continue;
		let e = t.slice(Zr.length);
		if (ar(e)) return e;
	}
	return Qr;
}
//#endregion
//#region src/interactions/file-drop.ts
var ni = 120, ri = "refused";
function ii(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => ai(e, t, n), !0);
	e.root.addEventListener("dragend", () => ci(e, t.marked), !0), window.addEventListener("blur", () => ci(e, t.marked));
}
function ai(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && ci(e, r);
		return;
	}
	let { host: a } = i;
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || si(e, r, a) : t.leaving = window.setTimeout(() => ci(e, r), ni);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = oi(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && si(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? ri : "");
		return;
	}
	ci(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => li(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function oi(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function si(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function ci(e, t) {
	for (let n of t) si(e, t, n);
}
function li(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var ui = "/_ne/files/upload";
function di(e, t) {
	let n = Number(e.getAttribute(ht));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function fi(e, t) {
	return new Promise((n, r) => {
		let i = new FormData();
		for (let t of e) i.append("files", t, t.name);
		let a = new XMLHttpRequest();
		a.open("POST", ui), a.responseType = "json", a.withCredentials = !0, a.upload.addEventListener("progress", (e) => {
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
var pi = () => {}, mi = { uploadAsync: (e, t) => fi(e, t ?? pi) };
function hi(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var gi = "ui-file-input", _i = "ui-file-input__row", vi = "ui-file-input__native", yi = "ui-file-input__field", bi = "ui-file-input__selection", xi = "data-ui-file-pick", Si = "data-ui-file-dragging", Ci = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), ii({
			root: this.root,
			draggingAttribute: Si,
			resolveTarget: (e) => {
				let t = e.closest(`.${_i}`)?.closest(`.${gi}`) ?? null, n = t?.querySelector(`.${vi}`) ?? null;
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
		let t = e.target.closest(`[${xi}], .${_i}`);
		if (t === null || t.hasAttribute("disabled") || !t.hasAttribute(xi) && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${gi}`)?.querySelector(`.${vi}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(vi)) return;
		let t = e.target.closest(`.${gi}`);
		t !== null && await this.takeFilesAsync(t, [...e.target.files ?? []]);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${yi}`);
		if (n === null) return;
		if (t.length === 0) {
			n.value = "", this.publishSelection(e, "");
			return;
		}
		let r = di(e, t);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await fi(r, (t) => {
				this.picks.get(e) === i && (n.value = b.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			n.value = wi(r), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			n.value = b.text("ui.file.failed"), this.publishSelection(e, "");
		}
	}
	publishSelection(e, t) {
		hi(e.querySelector(`.${bi}`), t);
	}
};
function wi(e) {
	return e.length === 1 ? e[0].name : b.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/roving-focus.ts
function Ti(e) {
	let t = e.items.filter(Oi);
	if (t.length === 0) return null;
	let n = ki(e.key);
	if (n !== null) return n === "first" ? t[0] : t[t.length - 1];
	let r = Ai(e.key, e.axis);
	if (r === 0) return null;
	let i = e.current === null ? -1 : t.indexOf(e.current);
	if (i === -1) return r > 0 ? t[0] : t[t.length - 1];
	let a = i + r;
	return a >= 0 && a < t.length ? t[a] : e.loop ?? !0 ? t[(a + t.length) % t.length] : null;
}
var Ei = {
	target: Ti,
	applyTabIndex: Di
};
function Di(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Oi(e) {
	return e.getClientRects().length !== 0 && !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function ki(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ai(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/row-cursor.ts
var ji = "data-ui-row-focus";
function Mi(e) {
	return e.matches(".ui-disabled, [inert]") || e.querySelector(":scope > [data-ui-id][inert], :scope > :not([data-ui-id]) > [data-ui-id][inert]") !== null;
}
function Ni(e) {
	return e.filter((e) => e.getClientRects().length > 0 && !Mi(e));
}
function Pi(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !Mi(e)) ?? Ni(e)[0] ?? null;
}
function Fi(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(ji);
	n.setAttribute(ji, ""), e.setAttribute("aria-activedescendant", Mt(n, "ui-row")), n.scrollIntoView({ block: "nearest" });
}
function Ii(e, t, n, r) {
	return Ti({
		key: e,
		items: Ni(t),
		current: n,
		axis: r,
		loop: !1
	});
}
function Li(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function Ri(e, t, n) {
	let r = n.hasAttribute(ji), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Ni(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && Fi(e, o, s);
	};
}
//#endregion
//#region src/interactions/selected-key.ts
function zi(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Bi = "data-ui-bind-selected-keys", Vi = ".ui-items-view, .ui-table, .ui-tree", Hi = ".ui-items-view__item, .ui-table__row, .ui-tree__row", Ui = {
	shift: !1,
	ctrl: !1
}, Wi = /* @__PURE__ */ new WeakMap();
function Gi(e, t) {
	if (t === null || Wi.has(e)) return;
	let n = na(t);
	n.length > 0 && Wi.set(e, n);
}
function Ki(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function qi(e) {
	switch (e.getAttribute(vt)) {
		case "one": {
			let t = e.getAttribute(bt);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(ea(ta(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Ji(e, t) {
	let n = qi(e);
	for (let e of t) e.toggleAttribute(yt, n.has(na(e)));
}
function Yi(e) {
	return e.filter((e) => e.hasAttribute(yt));
}
function Xi(e, t, n, r) {
	let i = na(n);
	if (i.length === 0 || n.hasAttribute("data-ui-unselectable")) return !1;
	switch (e.getAttribute(vt)) {
		case "one": return zi(e, i, {
			attribute: bt,
			bindingAttribute: St,
			apply: (e) => Ji(e, t)
		}), !0;
		case "many": return Zi(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Zi(e, t, n, r, i) {
	let a = ta(e);
	if (a === null) return;
	let o = ea(a), s;
	if (i.shift) {
		let r = $i(t, t.find((t) => na(t) === Wi.get(e)) ?? n, n).map(na);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Wi.set(e, r)) : (s = [r], Wi.set(e, r));
	Qi(e, t, s);
}
function Qi(e, t, n) {
	let r = ta(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(xt, i), Ji(e, t), r.hasAttribute(Bi) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function $i(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => e.getClientRects().length > 0 && !Mi(e) && !e.hasAttribute("data-ui-unselectable") && na(e).length > 0);
}
function ea(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function ta(e) {
	for (let t of e.querySelectorAll(`[${h}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function na(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var ra = {
	isSelected: (e) => e.hasAttribute(yt),
	toggle: ia,
	setSelected: aa
};
function ia(e) {
	let t = e.closest(Vi);
	t !== null && e instanceof HTMLElement && Xi(t, oa(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function aa(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = na(e);
		t.length > 0 && r.add(t);
	}
	let i = [...qi(e)].filter((e) => !r.has(e));
	Qi(e, oa(e), n ? [...i, ...r] : i);
}
function oa(e) {
	return [...e.querySelectorAll(Hi)].filter((t) => t.closest(Vi) === e);
}
//#endregion
//#region src/interactions/image-input-engine.ts
var sa = "ui-image-input", ca = "ui-image-input--multiple", la = "ui-image-input__surface", ua = "ui-image-input__native", da = "ui-image-input__picture", fa = "ui-image-input__text", pa = "ui-image-input__selection", ma = "ui-image-input__selections", ha = "ui-image-input__tiles", ga = "ui-image-input__tile", _a = "ui-image-input__remove", va = "data-ui-file-pick", ya = "data-ui-image-preview", ba = "data-ui-image-dragging", xa = "ui-loading", Sa = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${sa}`)), w(this.root, `.${sa}`, {
			childList: !0,
			attributeFilter: [
				mt,
				ve,
				xt
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(On, (e) => this.handleDraftDropped(e)), ii({
			root: this.root,
			draggingAttribute: ba,
			resolveTarget: (e) => {
				let t = e.closest(`.${la}`)?.closest(`.${sa}`) ?? null;
				return t === null || t.hasAttribute("data-ui-image-readonly") || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: t.querySelector(`.${ua}`)?.getAttribute("accept") ?? "",
					multiple: Ca(t)
				};
			},
			onFiles: (e, t) => void (Ca(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Ca(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${da}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || Ta(e, e.getAttribute("data-ui-image-caption") ?? Ea(n)));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(xt);
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
		let t = e.target.closest(`[${va}]`), n = t?.closest(`.${sa}`) ?? null;
		t === null || n === null || t.hasAttribute("disabled") || n.hasAttribute("data-ui-image-readonly") || n.querySelector(`.${ua}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_a}`), n = t?.closest(`.${sa}`) ?? null;
		if (t === null || n === null || n.hasAttribute("data-ui-image-readonly") || n.matches(".ui-disabled")) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ua)) return;
		let t = e.target.closest(`.${sa}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Ca(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${sa}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), hi(t.querySelector(`.${pa}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${la}`), r = e.querySelector(`.${da}`), i = e.querySelector(`.${pa}`);
		if (n === null || r === null || di(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(ya, ""), r.setAttribute("src", a), Ta(e, t.name), n.classList.add(xa);
		try {
			let n = await fi([t], () => void 0);
			this.previews.get(e) === a && hi(i, n.selectionId);
		} catch (t) {
			Ta(e, b.text("ui.file.failed")), hi(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(xa);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${ha}`), r = di(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = wa(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await fi([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(xa), this.publishShelf(e);
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
		let t = e.querySelector(`.${ma}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(xt, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(ya), t || Ta(e, ""));
	}
};
function Ca(e) {
	return e.classList.contains(ca);
}
function wa(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${ga} ${xa}`, n.src = i, n.alt = e.name, r.type = "button", r.className = _a, r.setAttribute("aria-label", b.text("ui.image.remove")), r.title = e.name, t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function Ta(e, t) {
	let n = e.querySelector(`.${fa}`);
	n !== null && n.textContent !== t && (n.textContent = t);
}
function Ea(e) {
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
var Da = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function Oa(e) {
	return e instanceof HTMLInputElement && Da.has(e.type);
}
function ka(e) {
	return Oa(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/own-control.ts
var Aa = "[role='listbox'], [role='menu'], [role='dialog']", ja = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], .ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .ui-select__trigger, .ui-field-box, ${Aa}`;
function Ma(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ja);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/key-value-action-engine.ts
var Na = "ui-key-value-action__row", Pa = "ui-key-value-action__value", Fa = "ui-key-value-action__value-input", Ia = "ui-key-value-action__edit-action", La = "ui-text__title", Ra = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Na}`)), w(this.root, `.${Na}`, {
			childList: !0,
			attributeFilter: [pt]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${Fa} [${he}]`)) {
			if (ka(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		kn(e);
	}
	open(e) {
		let t = e.querySelector(`.${Fa} :is(input, textarea, select)`);
		if (t !== null) {
			if (ka(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${Pa} .${La}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), Oa(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target.closest(`.${Fa}, .${Ia}`), n = t?.closest(`.${Na}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-row-editing") || e.key === "Enter" && t.classList.contains(Ia)) return;
		let r = e.target.closest(Aa), i = t.querySelector("[role='listbox']");
		if (r !== null && t.contains(r) || i !== null && i.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let a = n.querySelectorAll(`.${Ia} button`), o = e.key === "Enter" ? a[0] : a[a.length - 1];
		o !== void 0 && (e.preventDefault(), e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), o.click());
	}
}, za = `.ui-button[${Ee}="pressed"]`, Ba = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(za);
		t === null || t.matches(":disabled, .ui-disabled") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Va = class {
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
		Oa(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(Re);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Dt}="${CSS.escape(t)}"]`);
		n !== null && !n.hasAttribute("inert") && !n.disabled && n.click();
	}
	leave(e) {
		let t = this.changes;
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, Ha = "data-ui-fallback-src", Ua = `img[${Ha}]`, Wa = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Ua)) (Ga(e) || e.complete && e.naturalWidth === 0) && Ka(e);
		w(this.root, Ua, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && Ga(t) && Ka(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Ka(t);
	}
};
function Ga(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Ka(e) {
	let t = e.getAttribute(Ha);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/own-descendants.ts
function T(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var qa = "data-ui-radio-value", Ja = "ui-radio-group__input", Ya = "ui-radio-group__dot", Xa = "ui-radio-group", Za = "ui-radio-group__item", Qa = "data-ui-radio-group-name", $a = "data-ui-radio-bind-value-id", eo = "data-ui-radio-disabled", to = "ui-disabled", no = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Xa}`)) this.claimGroupName(e);
		for (let e of this.root.querySelectorAll(`.${Xa}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.target instanceof HTMLElement) {
					this.sync(t.target.closest(`.${Xa}`));
					continue;
				}
				for (let e of t.addedNodes) e instanceof HTMLElement && (this.decorateAddedGroups(e), this.decorateAddedItems(e));
			}
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [
				qa,
				eo,
				"class"
			],
			childList: !0,
			subtree: !0
		});
	}
	decorateAddedGroups(e) {
		let t = e.classList.contains(Xa) ? [e] : [...e.querySelectorAll(`.${Xa}`)];
		for (let e of t) this.claimGroupName(e);
	}
	claimGroupName(e) {
		let t = e.getAttribute(Qa);
		if (t === null) return;
		let n = !1;
		for (let r of this.root.querySelectorAll(`.${Xa}`)) if (r !== e && r.getAttribute(Qa) === t) {
			n = !0;
			break;
		}
		if (!n) return;
		let r = `${t}-${++this.renamed}`;
		e.setAttribute(Qa, r);
		for (let t of T(e, `.${Ja}`, `.${Xa}`)) t.name = r;
		for (let e of this.root.querySelectorAll(`.${Xa}`)) this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(qa), n = e.hasAttribute(eo);
		for (let r of T(e, `.${Ja}`, `.${Xa}`)) {
			r.checked = r.value === t;
			let e = n || ro(r);
			r.disabled !== e && (r.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Za) ? [e] : [...e.querySelectorAll(`.${Za}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Ja}`) !== null) return;
		let t = e.closest(`.${Xa}`), n = t?.getAttribute(Qa);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Ja, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute($a);
		a !== null && r.setAttribute("data-ui-bind-value", a);
		let o = document.createElement("span");
		o.className = Ya, e.prepend(r, o), this.sync(t);
	}
};
function ro(e) {
	let t = e.closest(`.${Za}`);
	return t !== null && (t.classList.contains(to) || t.querySelector(`:scope > .${to}`) !== null);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var io = "data-ui-search-debounce", ao = "data-ui-search-min-length", oo = "data-ui-search-manual", so = "ui-search__input", co = "ui-select", lo = "ui-select__popup", uo = "ui-select__option", fo = 300, po = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(so) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		mo(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(io), i = r === null ? fo : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : fo));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(oo)) return;
		let t = e.getAttribute(ao), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function mo(e) {
	let t = e.closest(`.${co}`), n = t?.querySelector(`.${lo}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(ao), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${uo}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	_o(t, n, o && s === 0);
}
function ho(e) {
	let t = e.querySelector(`.${lo}`);
	t !== null && _o(e, t, [...t.querySelectorAll(`.${uo}`)].filter((e) => e.style.display !== "none").length === 0);
}
function go(e) {
	let t = e.querySelector(`.${lo}`);
	if (t !== null) for (let e of t.querySelectorAll(`.${uo}`)) e.style.display = "";
}
function _o(e, t, n) {
	let r = t.querySelector(`:scope > [${Ce}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${xe}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Ce, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var vo = "data-ui-select-value", yo = "data-ui-select-placement", E = "ui-select", bo = "ui-select--open", xo = "ui-select__trigger", So = "ui-select__trigger-content", Co = "data-ui-select-content", wo = "ui-select__placeholder", To = "ui-input__affix-icon--prefix", Eo = "ui-select__popup", Do = "ui-select__option", Oo = "ui-select__value-input", ko = "data-ui-select-clear", Ao = "data-ui-select-trigger-mode", jo = "ui-search__input", Mo = "ui-search-mode--replace", No = "ui-text__title", Po = "ui-disabled", Fo = "data-ui-active", Io = 4, Lo = /* @__PURE__ */ new Set([
	"aria-selected",
	"aria-disabled",
	Fo,
	"tabindex",
	"style"
]);
function Ro(e) {
	return e?.querySelector(`.${jo}`)?.readOnly === !0;
}
function zo(e) {
	return T(e, `.${Eo} .${Do}`, `.${E}`);
}
function Bo(e) {
	return e === null ? null : e.querySelector(`.${No}`)?.textContent ?? e.textContent;
}
function Vo(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ie), t.removeAttribute(m), t.removeAttribute(oe), t.removeAttribute(ae);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Ho = class {
	root;
	openSelect = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${E}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "childList") {
					for (let e of t.addedNodes) if (e instanceof HTMLElement) {
						e.classList.contains(E) && this.sync(e);
						for (let t of e.querySelectorAll(`.${E}`)) this.sync(t);
					}
				}
				if (t.type === "attributes" && t.attributeName === vo) {
					t.target instanceof HTMLElement && this.sync(t.target);
					continue;
				}
				if (t.type === "attributes" && Lo.has(t.attributeName ?? "")) continue;
				let e = (t.target instanceof HTMLElement ? t.target : t.target.parentElement)?.closest(`.${Eo}`)?.closest(`.${E}`);
				e != null && this.sync(e);
			}
		}).observe(this.root, {
			attributes: !0,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), new zr({
			openPopups: () => this.openSelect === null ? [] : [this.openSelect],
			close: () => this.close()
		});
	}
	sync(e) {
		let t = e.getAttribute(vo);
		this.decorateOptions(e);
		let n = t === null ? null : zo(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = Bo(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${jo}`);
		if (a !== null) {
			let t = document.activeElement === a;
			e.classList.contains(Mo) && (!t || a.value.length === 0) && (a.value = i ?? "", t && a.select()), go(e);
		}
		let o = e.querySelector(`.${wo}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of zo(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${Oo}`);
		s !== null && t !== null && (s.value = t), ho(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${xo}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${So}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(Co) === i) {
			r.removeAttribute(Co);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = So;
			let e = n.querySelector(`:scope > .${To}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Vo(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e) {
		for (let t of zo(e)) {
			t.hasAttribute("role") || t.setAttribute("role", "option");
			let e = Uo(t), n = e ? "true" : "false";
			t.getAttribute("aria-disabled") !== n && t.setAttribute("aria-disabled", n), (e ? t.tabIndex !== -1 : !t.hasAttribute("tabindex")) && (t.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(jo)) return;
		let t = e.target.closest(`.${E}`);
		t !== null && t !== this.openSelect && this.toggle(t);
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(jo)) return;
		let t = e.target, n = t.closest(`.${E}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(Mo)) return;
		let r = n.getAttribute(vo);
		r !== null && (t.value = Bo(zo(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ko}]`);
		if (t !== null) {
			let n = t.closest(`.${E}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Ro(n) || this.clearValue(n));
			return;
		}
		let n = e.target.closest(`.${xo}`);
		if (n !== null) {
			let t = n.closest(`.${E}`);
			if (Ro(t) || n.getAttribute(Ao) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let r = e.target.closest(`.${Do}`);
		if (r === null) return;
		let i = r.closest(`.${E}`);
		i !== null && this.choose(i, r);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Do}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${E}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(jo) || !t.contains(e.target) ? null : zo(t).find((e) => e.hasAttribute(Fo) && !Uo(e) && e.style.display !== "none") ?? null;
	}
	toggle(e) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), e.classList.add(bo), this.positionPopup(e), this.describeTrigger(e, !0), this.openSelect = e, this.initializeFocus(e);
		}
	}
	describeTrigger(e, t) {
		let n = e.querySelector(`.${xo}`), r = e.querySelector(`.${Eo}`);
		n !== null && (n.setAttribute("aria-expanded", t ? "true" : "false"), r !== null && n.setAttribute("aria-controls", Mt(r, "ui-select-popup")));
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = e.querySelector(`.${Eo}`);
		t !== null && Hr(e.querySelector(`.${xo}`), t), e.classList.remove(bo), this.markActive(e, null), this.describeTrigger(e, !1), C(t), this.openSelect = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${xo}`), n = e.querySelector(`.${Eo}`), r = e.getAttribute(yo), i = r !== null && ar(r) ? r : "bottom-start";
		t !== null && n !== null && S(t, n, {
			placement: i,
			gap: Io,
			minAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = zo(e).filter((e) => !Uo(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		if (Di(t, n), this.markActive(e, n), e.querySelector(`.${xo}`)?.getAttribute(Ao) === "input") {
			let t = e.querySelector(`.${jo}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		n.focus();
	}
	moveFocus(e, t) {
		let n = zo(e).filter((e) => !Uo(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(Fo)) ?? null, i = Ti({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Di(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t) {
		for (let n of zo(e)) n === t ? n.setAttribute(Fo, "") : n.hasAttribute(Fo) && n.removeAttribute(Fo);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || Uo(t)) return;
		if (e.getAttribute(vo) === n) {
			this.close();
			return;
		}
		e.setAttribute(vo, n), this.sync(e);
		let r = e.querySelector(`.${Oo}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	clearValue(e) {
		if (!e.hasAttribute(vo)) return;
		e.removeAttribute(vo), this.sync(e);
		let t = e.querySelector(`.${Oo}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Uo(e) {
	return e.classList.contains(Po) || e.querySelector(`:scope > .${Po}`) !== null;
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Wo = "data-ui-input-debounce", Go = `input[${Wo}], textarea[${Wo}]`;
function Ko(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Go);
}
var qo = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Ko(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Wo));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Ko(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Jo = "ui-slider__input", Yo = "ui-slider__value", Xo = "ui-slider__bubble", Zo = "ui-slider__track", Qo = "ui-slider__thumb-anchor", $o = "ui-slider", es = "ui-orientation--vertical", ts = "--ui-slider-fraction", ns = 6, rs = "Value", is = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), as = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!is.has(e.propertyName)) return;
			let t = _(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Jo}`);
				t !== null && (this.writeReadings(t), e.propertyName === rs && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t != null && e.value !== String(t) && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Jo) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = os(e);
		t !== null && S(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: ns
		});
	}
	releaseBubble(e) {
		C(os(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Zo}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Yo}, .${Xo}`) ?? []) n.textContent = e.value;
		e.closest(`.${Zo}`)?.style.setProperty(ts, String(ss(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function os(e) {
	if (!(e instanceof Element) || !e.classList.contains(Jo)) return null;
	let t = e.closest(`.${Zo}`), n = t?.querySelector(`.${Xo}`) ?? null, r = t?.querySelector(`.${Qo}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${$o}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(es)
	};
}
function ss(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/interactions/number-input-engine.ts
var cs = "ui-number-input__field", ls = "data-ui-number-no-decimals", us = "data-ui-number-no-negative", ds = "data-ui-number-no-thousands", fs = "data-ui-number-trim-zeros", ps = "data-ui-number-step", ms = "data-ui-number-min", hs = "data-ui-number-max", gs = "data-ui-number-step-direction", _s = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.applyDisplayFormatting(this.root.querySelectorAll(`.${cs}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyDisplayFormatting(fn(e.components, `.${cs}`));
		});
	}
	applyDisplayFormatting(e) {
		for (let t of e) t === document.activeElement || t.hasAttribute(ds) || t.value.length === 0 || (t.value = xs(t.value));
	}
	handleInput(e) {
		let t = vs(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(ls), r = !t.hasAttribute(us), i = t.selectionStart ?? t.value.length, a = ys(t.value, i, n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = vs(e.target);
		t !== null && t.value.includes(",") && (t.value = t.value.replace(/,/g, ""));
	}
	handleBlur(e) {
		let t = vs(e.target);
		t !== null && this.commitFormatting(t);
	}
	commitFormatting(e) {
		let t = e.value;
		if (e.hasAttribute(fs)) {
			let n = bs(t);
			n !== t && (t = n, e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
		!e.hasAttribute(ds) && t.length > 0 && (e.value = xs(t));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + gs + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${cs}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(ps) ?? "1"), i = t.getAttribute(gs) === "down" ? -1 : 1, a = (Number(n.value.replace(/,/g, "")) || 0) + r * i, o = n.getAttribute(ms), s = n.getAttribute(hs);
		o !== null && (a = Math.max(a, Number(o))), s !== null && (a = Math.min(a, Number(s))), n.value = Ss(a), n.dispatchEvent(new Event("change", { bubbles: !0 })), this.commitFormatting(n);
	}
};
function vs(e) {
	return e instanceof HTMLInputElement && e.classList.contains(cs) ? e : null;
}
function ys(e, t, n, r) {
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
function bs(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function xs(e) {
	let t = e.startsWith("-"), [n, r] = (t ? e.slice(1) : e).split("."), i = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return (t ? "-" : "") + i + (r === void 0 ? "" : "." + r);
}
function Ss(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var Cs = {
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
function ws(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Cs;
	try {
		return {
			...Cs,
			...JSON.parse(t)
		};
	} catch {
		return Cs;
	}
}
var Ts = [
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
function Es(e, t, n) {
	if (t == null || t.trim().length === 0) return `${D(e.getFullYear(), 4)}-${D(e.getMonth() + 1, 2)}-${D(e.getDate(), 2)} ${D(e.getHours(), 2)}:${D(e.getMinutes(), 2)}:${D(e.getSeconds(), 2)}`;
	let r = "", i = Ds(t);
	for (let a = 0; a < t.length;) {
		let o = Os(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += ks(o, e, n, i), a += o.length;
	}
	return r;
}
function Ds(e) {
	for (let t = 0; t < e.length;) {
		let n = Os(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function Os(e, t) {
	for (let n of Ts) if (e.startsWith(n, t)) return n;
	return null;
}
function ks(e, t, n, r) {
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
var As = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function js(e) {
	let t = As.exec(e.trim());
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
function Ms(e) {
	return new Date(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
var Ns = {
	readCulture: ws,
	format: Es,
	parse: js,
	toDate: Ms
}, O = "ui-temporal-input", Ps = "ui-temporal-input__value-input", Fs = "ui-temporal-input__end-value-input", Is = "data-ui-temporal-range", Ls = "data-ui-temporal-mode", Rs = "data-ui-temporal-format", zs = "data-ui-temporal-default-format", Bs = "data-ui-temporal-min", Vs = "data-ui-temporal-max", Hs = "data-ui-temporal-step", Us = "data-ui-temporal-step-unit", Ws = /* @__PURE__ */ new Set([
	Rs,
	Bs,
	Vs
]), Gs = 2e3;
function Ks(e) {
	let t = e.getAttribute(Ls);
	return t === "time" || t === "date-time" ? t : "date";
}
function qs(e) {
	let t = e.getAttribute(Rs);
	return t === null || t.trim().length === 0 ? e.getAttribute(zs) ?? "" : t;
}
function Js(e) {
	let t = e.getAttribute(Us), n = Math.max(1, Math.trunc(Number(e.getAttribute(Hs))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Ys(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Xs(e) {
	return {
		monthNames: Zs(e, "data-ui-temporal-months"),
		monthGenitiveNames: Zs(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: Zs(e, "data-ui-temporal-months-short"),
		dayNames: Zs(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: Zs(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function Zs(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Qs(e) {
	return e.hasAttribute(Is);
}
function $s(e) {
	return e !== null && e.hasAttribute("data-ui-temporal-end");
}
function ec(e) {
	return k(e, !1);
}
function k(e, t) {
	let n = tc(e, t);
	return n === null ? null : dc(n.value, Ks(e));
}
function tc(e, t) {
	return e.querySelector(`.${t ? Fs : Ps}`);
}
function nc(e, t) {
	return dc(e.getAttribute(t) ?? "", Ks(e));
}
function rc(e, t, n) {
	let r = tc(e, n);
	if (r === null) return;
	let i = t === null ? "" : fc(t, Ks(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function ic(e) {
	if (!Qs(e)) return;
	let t = k(e, !1), n = k(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (rc(e, n, !1), rc(e, t, !0));
}
function ac(e) {
	oc(e, !1), Qs(e) && oc(e, !0);
}
function oc(e, t) {
	let n = k(e, t);
	if (n === null) return;
	let r = cc(e, n);
	r.getTime() !== n.getTime() && rc(e, r, t);
}
function sc(e) {
	return lc(e, cc(e, /* @__PURE__ */ new Date()));
}
function cc(e, t) {
	let n = nc(e, Bs), r = nc(e, Vs);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function lc(e, t) {
	let n = Js(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var uc = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function dc(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = uc.exec(n);
		return e === null ? null : new Date(Gs, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = js(n);
	return r === null ? null : Ms(r);
}
function fc(e, t) {
	let n = `${pc(e.getHours())}:${pc(e.getMinutes())}:${pc(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${pc(e.getMonth() + 1)}-${pc(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function pc(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function mc(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = gc(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < _c(e.start).getTime() ? {
		start: gc(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: gc(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function hc(e, t, n) {
	if (t === null || n === null) return !1;
	let r = _c(e).getTime();
	return r > _c(t).getTime() && r < _c(n).getTime();
}
function gc(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function _c(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var vc = "ui-temporal-input__field", yc = "ui-temporal-input__popup", bc = "ui-temporal-input--open", xc = "ui-temporal-input__day", Sc = "ui-temporal-input__month", A = "ui-temporal-input__time-cell", Cc = "ui-temporal-input__time-column", wc = 4, Tc = 140, Ec = 100, Dc = Ec / 3, Oc = "data-ui-temporal-toggle", kc = "data-ui-temporal-first-day", Ac = "data-ui-temporal-nav", jc = "data-ui-temporal-day", Mc = "data-ui-temporal-unit", Nc = "data-ui-temporal-cell", Pc = "data-ui-temporal-centred", Fc = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	openPicker = null;
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = fn(e.components, `.${O}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), w(this.root, `.${O}`, { attributeFilter: [...Ws] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), w(this.root, `.${O}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("wheel", (e) => this.handleColumnWheel(e), {
			capture: !0,
			passive: !1
		}), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), new zr({
			openPopups: () => this.openPicker === null ? [] : [this.openPicker],
			close: () => this.close()
		});
	}
	applyDisplay(e) {
		for (let t of e) {
			ac(t);
			for (let e of t.querySelectorAll(`.${vc}`)) {
				if (e === document.activeElement && this.written.has(e)) continue;
				this.written.add(e);
				let n = el(t, $s(e))?.value ?? "", r = dc(n, Ks(t));
				if (r !== null) {
					e.value = Es(r, qs(t), Xs(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(vc)) return;
		let t = e.target.closest(`.${O}`), n = t === null ? null : el(t, $s(e.target));
		t !== null && n !== null && (n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), ic(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(vc)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && Qs(t) && (this.getState(t).activeEnd = $s(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !Qs(t) || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${jc}]`) : null;
		if (n !== null && !t.contains(n)) return;
		let r = this.getState(t), i = n === null ? null : dc(n.getAttribute(jc) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Qc(t, r));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(vc)) return;
		let t = e.target.closest(`.${O}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Oc}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${O}`));
			return;
		}
		let n = e.target.closest(`.${yc}`)?.closest(`.${O}`);
		if (n == null) return;
		let r = e.target.closest(`[${Ac}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Ac) ?? "");
			return;
		}
		let i = e.target.closest(`[${jc}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(jc) ?? "");
			return;
		}
		let a = e.target.closest(`[${Nc}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Mc}]`)?.getAttribute(Mc);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Nc)));
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
				n.view = hl(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = hl(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, sc(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Qs(e) && this.commit(e, null, !0), n.activeEnd = "start", this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = dc(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (Qs(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = ec(e) ?? sc(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = fl(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = sc(e), i = mc({
			start: k(e, !1),
			end: k(e, !0)
		}, t.activeEnd, tl(n, r));
		t.focusedDay = i.end ?? i.start, t.view = fl(n), t.activeEnd = i.active, t.hoverDay = null, rc(e, i.end, !0), rc(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Qs(e) && this.getState(e).activeEnd === "end", i = new Date(k(e, r) ?? sc(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		rc(e, t, n), ic(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(vc)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${O}`), $s(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(A)) {
			il(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(xc)) return;
		let n = dc(e.target.getAttribute(jc) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, fc(n, "date"));
			return;
		}
		let r = dl(n, e.key, ul(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = fl(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cc}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Tc)));
	}
	handleColumnWheel(e) {
		if (!(e instanceof WheelEvent) || this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cc}`), n = t?.getAttribute(Mc) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let r = e.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? e.deltaY : e.deltaY * Dc, i = this.wheelTurns.get(n) ?? 0, a = (Math.sign(i) === Math.sign(r) ? i : 0) + r, o = Math.trunc(a / Ec);
		if (this.wheelTurns.set(n, a - o * Ec), o === 0) return;
		let s = [...t.querySelectorAll(`.${A}`)].filter((e) => !e.disabled), c = s.findIndex((e) => e.classList.contains(`${A}--selected`)), l = s[Math.min(s.length - 1, Math.max(0, Math.max(0, c) + o))];
		l !== void 0 && !l.classList.contains(`${A}--selected`) && this.chooseTime(this.openPicker, n, Number(l.getAttribute(Nc)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Pc));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(Mc), i = qc(e);
		if (!(r === null || i === null || i.classList.contains(`${A}--selected`))) {
			if (i.matches(":disabled")) {
				Gc(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Nc)));
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
		n.activeEnd = Qs(e) ? t ?? (k(e, !1) === null ? "start" : k(e, !0) === null ? "end" : n.activeEnd) : "start", n.hoverDay = null;
		let r = k(e, n.activeEnd === "end") ?? ec(e);
		n.pane = "days", n.view = fl(r ?? cc(e, /* @__PURE__ */ new Date())), n.focusedDay = r, e.classList.add(bc), e.querySelector(`[${Oc}]`)?.setAttribute("aria-expanded", "true"), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = e.querySelector(`.${yc}`);
		for (let e of this.columnSettles.values()) window.clearTimeout(e);
		this.columnSettles.clear(), this.wheelTurns.clear(), t !== null && Hr($c(e, this.getState(e).activeEnd === "end"), t), e.classList.remove(bc), e.querySelector(`[${Oc}]`)?.setAttribute("aria-expanded", "false"), C(t), this.openPicker = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${O}__row`), n = e.querySelector(`.${yc}`);
		t !== null && n !== null && S(t, n, {
			placement: "bottom-end",
			gap: wc
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: fl(ec(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: ec(e),
			activeEnd: "start",
			hoverDay: null
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${yc}`);
		if (n === null) return;
		let r = Ks(e), i = this.getState(e), a = Xs(e), o = Qs(e), s = k(e, o && i.activeEnd === "end"), c = Jc(n);
		n.replaceChildren(), o && n.append(Zc(i));
		let l = j("div", `${O}__panes`);
		l.append(Ic(e, i, a, s)), r === "date-time" && l.append(zc(e, s)), n.append(l, Xc(r)), rl(n, i, s, t), Qc(e, i), Wc(n), Gc(n), Yc(n, c), this.positionPopup(e);
	}
};
function Ic(e, t, n, r) {
	let i = j("div", `${O}__calendar`), a = j("div", `${O}__calendar-header`);
	a.append(nl("previous", "‹", b.text("ui.picker.previous")));
	let o = nl("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${O}__calendar-label`), a.append(o), a.append(nl("next", "›", b.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? Lc(e, t, n, r) : Rc(t, n)), i;
}
function Lc(e, t, n, r) {
	let i = ul(e), a = j("div", `${O}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = j("span", `${O}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = j("div", `${O}__days`), s = _c(/* @__PURE__ */ new Date()), c = Qs(e), l = c ? k(e, !1) : r, u = c ? k(e, !0) : null, d = pl(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = ml(d, n), i = j("button", xc);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(jc, fc(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${xc}--outside`), gl(r, s) && i.classList.add(`${xc}--today`), (l !== null && gl(r, l) || u !== null && gl(r, u)) && (i.classList.add(`${xc}--selected`), i.setAttribute("aria-selected", "true")), hc(r, l, u) && i.classList.add(`${xc}--within`), cl(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = j("div", `${O}__calendar-pane`);
	return f.append(a, o), f;
}
function Rc(e, t) {
	let n = j("div", `${O}__months`);
	for (let r = 0; r < 12; r++) {
		let i = j("button", Sc);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Ac, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${Sc}--selected`), n.append(i);
	}
	return n;
}
function zc(e, t) {
	let n = Js(e), r = j("div", `${O}__time`), i = j("div", `${O}__time-columns`);
	for (let r of Bc(n)) i.append(Uc(e, r, Vc(n, r), t));
	return r.append(i), r;
}
function Bc(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Vc(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Hc(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Uc(e, t, n, r) {
	let i = j("div", Cc);
	i.setAttribute(Mc, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", b.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = Hc(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = j("button", A);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(Nc, String(c)), c === o && (n.classList.add(`${A}--selected`), n.setAttribute("aria-selected", "true")), ll(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function Wc(e) {
	let t = e.querySelector(`.${O}__calendar`), n = e.querySelector(`.${O}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Gc(e) {
	for (let t of e.querySelectorAll(`.${Cc}`)) {
		let e = t.querySelector(`.${A}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, Kc(t, e), t.setAttribute(Pc, String(t.scrollTop));
	}
}
function Kc(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function qc(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${A}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Jc(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(A) ? null : t.closest(`.${Cc}`)?.getAttribute(Mc) ?? null;
}
function Yc(e, t) {
	t !== null && e.querySelector(`.${Cc}[${Mc}="${t}"]`)?.querySelector(`.${A}--selected`)?.focus({ preventScroll: !0 });
}
function Xc(e) {
	let t = j("div", `${O}__popup-footer`);
	return t.append(nl("now", b.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(nl("clear", b.text("ui.picker.clear"))), t.append(nl("done", b.text("ui.picker.done"))), t;
}
function Zc(e) {
	let t = j("div", `${O}__period-caption`);
	return t.textContent = b.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Qc(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? k(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${xc}`)) {
		let e = dc(t.getAttribute(jc) ?? "", "date");
		t.classList.toggle(`${xc}--preview`, e !== null && n !== null && r !== null && hc(e, n, ml(r, 1)));
	}
}
function $c(e, t) {
	for (let n of e.querySelectorAll(`.${vc}`)) if ($s(n) === t) return n;
	return e.querySelector(`.${vc}`);
}
function el(e, t) {
	return e.querySelector(`.${t ? Fs : Ps}`);
}
function tl(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function nl(e, t, n) {
	let r = j("button", `${O}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Ac, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function j(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function rl(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${xc}`)];
	if (i.length === 0) return;
	let a = fc(_c(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(jc) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (Di(i, o), r && o.focus({ preventScroll: !0 }));
}
function il(e) {
	let t = e.target, n = t.closest(`.${Cc}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? ol(n, e.key === "ArrowRight" ? 1 : -1) : al(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), sl(r));
}
function al(e, t, n) {
	return Ti({
		key: n,
		items: [...e.querySelectorAll(`.${A}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function ol(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Cc}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${A}--selected`) ?? r.querySelector(`.${A}:not(:disabled)`);
}
function sl(e) {
	let t = e.closest(`.${Cc}`);
	t !== null && Kc(t, e);
}
function cl(e, t) {
	let n = nc(e, Bs), r = nc(e, Vs);
	return n !== null && t.getTime() < _c(n).getTime() || r !== null && t.getTime() > _c(r).getTime();
}
function ll(e, t, n, r) {
	let i = nc(e, Bs), a = nc(e, Vs);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function ul(e) {
	let t = Number(e.getAttribute(kc));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function dl(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return ml(e, -1);
		case "ArrowRight": return ml(e, 1);
		case "ArrowUp": return ml(e, -7);
		case "ArrowDown": return ml(e, 7);
		case "PageUp": return hl(e, -1);
		case "PageDown": return hl(e, 1);
		case "Home": return ml(e, -r);
		case "End": return ml(e, 6 - r);
		default: return null;
	}
}
function fl(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function pl(e, t) {
	let n = fl(e);
	return ml(n, -((n.getDay() - t + 7) % 7));
}
function ml(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function hl(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function gl(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var _l = "[data-ui-theme-switcher]", vl = "data-ui-theme", yl = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(_l) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Nt.SetTheme,
				mode: bl() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function bl() {
	let e = document.documentElement.getAttribute(vl);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var xl = "data-ui-context-menu-owner", Sl = "data-ui-context-menu", Cl = "data-ui-context-menu-use", wl = "ui-context-menu--open", Tl = Ge, El = class {
	root;
	openMenu = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1), new zr({
			openPopups: () => this.openMenu === null ? [] : [this.openMenu],
			close: () => this.close(),
			onPress: !0,
			onWindowBlur: !0
		});
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xl}]`);
		if (t === null) return;
		let n = e.target.closest(`[${Cl}]`), r = n !== null && t.contains(n) ? n.getAttribute(Cl) ?? "" : "", i = Dl(t, r) ?? (r.length > 0 ? Dl(t, "") : null);
		i === null || Ol(t) || (e.preventDefault(), this.close(), this.open(i, e.clientX, e.clientY));
	}
	open(e, t, n) {
		this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null, e.classList.add(wl), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${kr(t, r.width, window.innerWidth)}px`, e.style.top = `${kr(n, r.height, window.innerHeight)}px`, e.querySelector(Br)?.focus({ preventScroll: !0 });
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Tl) !== null || this.close();
	}
	close() {
		if (this.openMenu === null) return;
		let e = this.openMenu;
		this.openMenu = null, Hr(this.returnFocus, e), this.returnFocus = null, e.classList.remove(wl);
	}
};
function Dl(e, t) {
	for (let n of e.querySelectorAll(`[${Sl}]`)) if ((n.getAttribute(Sl) ?? "") === t && n.closest(`[${xl}]`) === e) return n;
	return null;
}
function Ol(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/dialog-engine.ts
var kl = "data-ui-dialog", Al = "data-ui-dialog-modal", jl = "data-ui-dialog-close-backdrop", Ml = "data-ui-dialog-close-escape", Nl = "data-ui-dialog-backdrop", Pl = "ui-dialog__surface", Fl = class {
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
		let n = Vr(t.querySelector(`.${Pl}`) ?? t, t.querySelector(Br));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), Hr(n?.isConnected === !0 ? n : null, t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${kl}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Nl}]`);
		if (n === null) return;
		let r = n.closest(`[${kl}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(jl)) return;
		let i = r.getAttribute(kl);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(Ml) && !Lr()) {
				let n = t.getAttribute(kl);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(Al) && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(Ot)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Il(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(Br)].filter((e) => Oi(e) || e === document.activeElement);
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
function Il(e) {
	let t = e.querySelectorAll(`[${kl}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Ll(e) {
	let t = Il(e);
	return t !== null && t.hasAttribute(Al) ? t : null;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Rl(e) {
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
		default: o = Wl(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function zl(e, t, n = Vl()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var Bl = null;
function Vl() {
	return Bl === null && (Bl = Hl()), Bl;
}
function Hl() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function Ul(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Wl(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Gl[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Gl[t] ?? null;
}
var Gl = {
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
}, Kl = "ui-menu", ql = "ui-menu-item", Jl = "ui-menu-item--selected", Yl = "ui-context-menu", Xl = "ui-orientation--horizontal", Zl = `[${We}="header"], [${We}="separator"]`, Ql = "data-ui-menu-shortcut", $l = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleNavigationKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(eu) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Ql]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Kl}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && Di(t, t.find((e) => e.classList.contains(Jl)) ?? t.find(Oi) ?? t[0]);
		}
	}
	handleNavigationKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ql}`), n = t?.closest(`.${Kl}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n), i = Ti({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Xl) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), Di(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ql}`), n = t?.closest(`.${Kl}`) ?? null;
		t !== null && n !== null && Di(this.ownItems(n), t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || tu(e))) return;
		let t = Ll(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !zl(n.shortcut, e))) {
			if (!Oi(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${Ql}]`)) {
			if (e.closest(`.${Yl}`) !== null) continue;
			let t = Rl(e.getAttribute(Ql));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(Ql)
				});
				continue;
			}
			let n = Ul(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(Ql),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return T(e, `.${ql}:not(${Zl})`, `.${Kl}`);
	}
};
function eu(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${Kl}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(Kl) || t.querySelector(`.${Kl}`) !== null)) return !0;
	return !1;
}
function tu(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var nu = "ne.ui", ru = "boot", iu = /* @__PURE__ */ new Set(), au = class {
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
		let r = this.resolveKey(e, ru);
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
		let n = e.getAttribute(pe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return iu.has(n) || (iu.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${nu}:${n}:${t}`;
	}
}, ou = "ui-menu", su = "ui-menu--nested", cu = "ui-menu-item", lu = "ui-menu-item--selected", uu = "ui-menu__item", du = "ui-menu__submenu", fu = Ve, pu = Ue, mu = "data-ui-menu-flyout", hu = He, gu = "menu-open-group", _u = class {
	root;
	store = new au();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), new zr({
			openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
			close: () => this.closeFlyout()
		}), this.reconcileEach(this.root.querySelectorAll(`.${ou}`)), w(this.root, `.${ou}`, {
			childList: !0,
			attributeFilter: [Be]
		}, (e) => this.reconcileEach(e));
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = vu(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.closeFlyout(), this.closeGroups(e), t || this.openResolvedGroup(e);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${lu}`), e);
		if (t !== null && !t.hasAttribute(hu)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(su) ? null : this.store.read(e, gu), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cu}`);
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
		let r = n.closest(`.${ou}`);
		r !== null && (vu(r) || n.hasAttribute(hu) ? this.toggleFlyout(r, n, t) : this.toggleInline(r, n));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(su);
		if (t.hasAttribute(pu)) {
			t.removeAttribute(pu), n || this.store.write(e, gu, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, gu, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(pu, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${fu}][${pu}]`)) t.hasAttribute(hu) || t.removeAttribute(pu);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(pu, ""), r.setAttribute(mu, ""), this.openFlyout = r, S(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, C(e), e.removeAttribute(mu), e.parentElement?.removeAttribute(pu));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${fu}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		let t = e.closest(`.${uu}`);
		return t !== null && t.hasAttribute(fu) ? t : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${fu}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${du}`);
	}
};
function vu(e) {
	return e.hasAttribute(Be);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var yu = "ui-collapsible", bu = "ui-collapsible__content", xu = "collapsed", Su = 200, Cu = "cubic-bezier(0.4, 0, 0.2, 1)", wu = class {
	root;
	store = new au();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${yu}`)), w(this.root, `.${yu}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, xu);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Ke}]`), n = t?.closest(`.${yu}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(Be), i = n.querySelector(`:scope > .${bu}`);
		this.cancelFold(n);
		let a = Eu(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, xu, r ? "true" : "false", r ? { attributes: { [Be]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Be, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Ke}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let i = Tu(e), a = Eu(e, t);
		if (n.component === a.component) return;
		e.setAttribute(qe, "");
		let o = {
			duration: Su,
			easing: Cu
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
			this.folds.get(e) === s && (this.folds.delete(e), e.removeAttribute(qe));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(qe);
			for (let e of t) e.cancel();
		}
	}
};
function Tu(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Eu(e, t) {
	let n = Tu(e);
	return {
		component: e.getBoundingClientRect()[n],
		content: t?.getBoundingClientRect()[n] ?? 0
	};
}
//#endregion
//#region src/rendering/responsive-tier.ts
var M = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Du = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Ou(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Du[t]}px)`)) return t;
	return "base";
}
function ku(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function N(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Au(e, t) {
	let n;
	for (let r of M) {
		let i = N(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/pointer-drag.ts
var ju = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), e.root.addEventListener("focusout", (e) => Mu(e.target), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
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
			t.setAttribute(gt, ""), t.tabIndex >= 0 && (t.setAttribute(_t, ""), t.focus({ preventScroll: !0 })), this.drag = {
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
		this.drag = null, t.removeAttribute(gt), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (Mu(e.target), !(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(gt);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
function Mu(e) {
	e instanceof Element && e.hasAttribute("data-ui-pointer-focus") && e.removeAttribute(_t);
}
//#endregion
//#region src/interactions/grid-tracks.ts
function Nu(e) {
	let t = [];
	for (let n of Iu(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Nu(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Pu(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Pu(e) {
	if (e === "auto") return {
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
	if (n !== null) return Fu({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Fu(r[3] === "fr" ? {
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
function Fu(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Iu(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Lu(e) {
	return e.map(Ru).join(" ");
}
function Ru(e) {
	switch (e.kind) {
		case "px": return `${zu(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${zu(e.min)}px`}, ${zu(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? "auto" : `fit-content(${zu(e.max)}px)` : `minmax(${zu(e.min)}px, auto)`;
	}
}
function zu(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Bu(e) {
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
function Vu(e, t) {
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
function Hu(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Uu(r, e), o = Uu(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Uu(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function Wu(e, t, n, r) {
	let i = Gu(e, t, n.before), a = Gu(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = Xu(n.before, e) + Xu(n.after, e), r = i.total + a.total;
		Ku(l, e, i, t * (i.total + c) / r), Ku(l, e, a, t * (a.total - c) / r);
	} else u || qu(l, i, i.total + c), d || qu(l, a, a.total - c);
	return l;
}
function Gu(e, t, n) {
	let r = Yu(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Ku(e, t, n, r) {
	let i = Xu(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function qu(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Ju(e[i])
		};
	}
}
function Ju(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Yu(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Xu(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Zu(e, t) {
	let n = Yu(t.before, e), r = n + Yu(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Qu(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function $u(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var ed = "ui-grid-splitter", td = "ui-container", nd = "ui-orientation--vertical", rd = 16, id = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Je,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, ad = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Ye,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, od = class {
	root;
	store = new au();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new u();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new ju({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ed}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${ed}`)), w(this.root, `.${ed}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = sd(t);
			e !== null && (this.restore(e, cd(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of M) {
			let i = r[n], a = ku(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ed}`);
		if (t === null || this.drag.active) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = pd(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${ed}`), n = t === null ? null : sd(t);
		if (t === null || n === null) return;
		let r = cd(t);
		for (let e of M) n.style.removeProperty(ku(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = Wu(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(ku(e.axis.split, e.tier), Lu(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of M) {
			let a = ku(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = sd(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = cd(e), r = Ou(), i = ld(t, n, r), a = i === null ? null : Nu(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Vu(a, Bu(t.getAttribute(n.limits))), s = ud(t, n), c = dd(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Hu(c, fd(t, n).map((e) => dd(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = sd(e);
		if (t === null) return;
		let n = cd(e), r = dd(e, n), i = ud(t, n), a = fd(t, n).map((e) => dd(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : Hu(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Zu(i, o))));
	}
};
function sd(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(td) ? t : null;
}
function cd(e) {
	return e.classList.contains(nd) ? id : ad;
}
function ld(e, t, n) {
	for (let r = M.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(ku(t.split, M[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function ud(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function dd(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function fd(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(ed) && cd(r) === t && n.push(r);
	return n;
}
function pd(e) {
	let t = Number(e.getAttribute(Xe));
	return Number.isFinite(t) && t > 0 ? t : rd;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var md = "ui-split-button", hd = "ui-split-button__main", gd = "ui-split-button__toggle", _d = "ui-split-button__menu", vd = "ui-split-button--open", yd = "ui-menu-item", bd = 4, xd = class {
	root;
	open = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1), new zr({
			openPopups: () => this.open === null ? [] : [this.open],
			close: () => this.close()
		});
	}
	handleClick(e) {
		let t = Sd(e.target);
		if (t !== null) {
			e.preventDefault(), this.open === t ? this.close() : this.openMenu(t);
			return;
		}
		this.open !== null && e.target instanceof Element && e.target.closest(`.${hd}`)?.closest(`.${md}`) === this.open && this.close();
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Sd(e.target);
		t !== null && this.open !== t && (e.preventDefault(), this.openMenu(t));
	}
	handleChoice(e) {
		if (this.open === null || !(e.target instanceof Element)) return;
		let t = Cd(this.open), n = e.target.closest(`.${yd}`);
		t === null || n === null || !t.contains(n) || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"], [data-ui-menu-item-kind=\"check\"]") || n.parentElement?.hasAttribute("data-ui-menu-group") === !0 || this.close();
	}
	openMenu(e) {
		this.close();
		let t = Cd(e);
		if (t !== null) {
			this.open = e, e.classList.add(vd);
			for (let t of wd(e)) t.setAttribute("aria-expanded", "true");
			S(e, t, {
				placement: "bottom-end",
				gap: bd
			}), this.returnFocus = Vr(t);
		}
	}
	close() {
		let e = this.open;
		if (e === null) return;
		this.open = null, e.classList.remove(vd);
		for (let t of wd(e)) t.setAttribute("aria-expanded", "false");
		let t = Cd(e);
		t !== null && (C(t), Hr(this.returnFocus, t)), this.returnFocus = null;
	}
};
function Sd(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${gd}, .${hd}`), n = t?.closest(`.${md}`) ?? null;
	return t === null || n === null || t.classList.contains(hd) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Cd(e) {
	return e.querySelector(`:scope > .${_d}`);
}
function wd(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Td = "ui-button-group", Ed = "ui-button-group__item", Dd = "ui-button", Od = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Td}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), w(this.root, `.${Td}`, {
			childList: !0,
			attributeFilter: [bt]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = kd(i);
			i.toggleAttribute(yt, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		Di(n, r ?? n.find(Oi) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ed}`), n = t?.closest(`.${Td}`) ?? null;
		t === null || n === null || t.closest(`.${Td}`) !== n || n.matches(".ui-disabled") || kd(t)?.matches(".ui-disabled, :disabled") !== !0 && this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ed} > .${Dd}`), n = t?.closest(`.${Td}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(kd).filter((e) => e !== null), i = Ti({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Ed}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		zi(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: bt,
			bindingAttribute: St,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return T(e, `.${Ed}`, `.${Td}`);
	}
};
function kd(e) {
	return e.querySelector(`:scope > .${Dd}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Ad = "ui-accordion", jd = "details", Md = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Ad}`)), w(this.root, `.${Ad}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Ad))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${jd}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function Nd(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var Pd = "ui-tab-overflow", Fd = "ui-tab-overflow__menu", Id = "ui-tab-overflow__menu--open", Ld = "ui-tab-overflow__entry", Rd = "ui-tab-overflow__entry--current";
function zd(e) {
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
var Bd = class {
	pick;
	menu;
	button = null;
	strip = null;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Fd, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), new zr({
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
		this.close(), this.menu.replaceChildren(...n.map(Vd)), this.menu.parentElement === null && document.body.appendChild(this.menu), this.button = e, this.strip = t, this.menu.classList.add(Id), e.setAttribute("aria-expanded", "true"), S(e, this.menu, {
			placement: "bottom-end",
			gap: 4
		}), (this.menu.querySelector(`.${Rd}`) ?? this.menu.querySelector(`.${Ld}`))?.focus({ preventScroll: !0 });
	}
	close() {
		this.button !== null && (C(this.menu), this.menu.classList.remove(Id), this.button.setAttribute("aria-expanded", "false"), this.button = null, this.strip = null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ld}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.strip;
		t !== null && n !== null && r !== null && (this.close(), this.pick(r, n));
	}
};
function Vd(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Ld} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(Rd, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var Hd = "ui-tabs", Ud = "ui-tab-header", Wd = "ui-tab-header--selected", Gd = "ui-tab-header--overflowed", Kd = "ui-tabs--overflowing", qd = "ui-tabs--no-overflow", Jd = "ui-tabs__strip", Yd = "data-ui-tab-key", Xd = "data-ui-tab-page", Zd = class {
	root;
	overflow;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${Hd}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new Bd((e, t) => this.select(e, t)), this.applyAll(this.root.querySelectorAll(`.${Hd}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), w(this.root, `.${Hd}`, {
			childList: !0,
			attributeFilter: [Ct, ...Et]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(Yd) ?? "") === t) ?? null;
		if (r !== null && !Nd(r)) {
			let t = n.find(Nd);
			if (t !== void 0) {
				this.select(e, t.getAttribute(Yd) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(Yd) ?? "") === t;
			e.classList.toggle(Wd, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(Nd), i), Di(n.filter((e) => !e.classList.contains(Gd)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(Xd) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${Jd}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		if (r === null || i === null) return;
		if (e.classList.contains(qd)) {
			for (let e of t) e.classList.remove(Gd);
			e.classList.remove(Kd);
			return;
		}
		this.resizes?.observe(r), e.classList.add(Kd);
		let a = zd({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: Gd
		});
		e.classList.toggle(Kd, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownHeaders(e).filter(Nd).map((e) => {
			let t = e.getAttribute(Yd) ?? "";
			return {
				key: t,
				title: e.textContent?.trim() ?? t,
				current: t === n
			};
		});
		this.overflow.open(t, e, r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Pd}`), n = t?.closest(`.${Hd}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${Hd}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Ud}`);
		if (r === null || r.matches(":disabled, .ui-disabled")) return;
		let i = r.closest(`.${Hd}`), a = r.getAttribute(Yd);
		i !== null && a !== null && r.closest(`.${Hd}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ud}`), n = t?.closest(`.${Hd}`) ?? null;
		if (t === null || n === null) return;
		let r = Ti({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(Yd) ?? ""), r.focus());
	}
	select(e, t) {
		zi(e, t, {
			attribute: Ct,
			bindingAttribute: St,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return T(e, `.${Ud}`, `.${Hd}`);
	}
	ownPages(e) {
		return T(e, `[${Xd}]`, `.${Hd}`);
	}
}, Qd = "ui-breadcrumbs", $d = "ui-breadcrumbs__item", ef = "ui-breadcrumb", tf = "ui-breadcrumb--current", nf = "ui-hidden", rf = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), w(this.root, `.${Qd}`, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Qd}`)) this.apply(e);
	}
	apply(e) {
		let t = T(e, `.${$d}`, `.${Qd}`).filter((e) => !e.classList.contains(nf)).map((e) => e.querySelector(`.${ef}`)).filter((e) => e !== null && !e.classList.contains(nf)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(tf, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
//#endregion
//#region src/rendering/color-bytes.ts
function P(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function F(e) {
	return P(e).toString(16).padStart(2, "0").toUpperCase();
}
//#endregion
//#region src/interactions/color-input-engine.ts
var af = "ui-color-input", of = "ui-color-input--open", sf = "ui-color-input__popup", cf = "ui-color-input__text", lf = "ui-color-input__row", uf = "ui-color-input__swatch--button", df = "ui-color-input__value-input", ff = "ui-color-input__square-thumb", pf = "ui-color-input__hue-thumb", mf = "data-ui-color-toggle", hf = "data-ui-color-tab", gf = "data-ui-color-tab-selected", _f = "data-ui-color-pane", vf = "data-ui-color-pane-selected", yf = "data-ui-color-square", bf = "data-ui-color-hue", xf = "data-ui-color-hex", Sf = "data-ui-color-channel", Cf = "data-ui-color-factor", wf = "data-ui-color-opacity", Tf = "data-ui-color-name", Ef = "data-ui-color-name-selected", Df = "data-ui-color-format", Of = "data-ui-color-readonly", kf = "data-ui-color-variant", Af = "data-ui-color-picker", jf = "data-ui-color-palette", Mf = 4, Nf = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	returnFocus = /* @__PURE__ */ new WeakMap();
	openInput = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${af}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = _(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${af}`) ?? []);
		}), w(this.root, `.${af}`, {
			childList: !0,
			attributeFilter: [
				Df,
				Of,
				kf,
				Af,
				jf
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new ju({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${yf}], [${bf}]`),
			begin: (e, t) => {
				let n = e.closest(`.${af}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(yf) ? "square" : "hue"
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: () => void 0
		}), new zr({
			openPopups: () => this.openInput === null ? [] : [this.openInput],
			close: (e) => this.setOpen(e, !1)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = Vf(e), n = this.states.get(e), r = n?.paneChosen === !0 ? Pf(e, n.pane) : Ff(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? If(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Yf(t);
			if (i === null) return n ?? If(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && Lf(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Qf(a, o, s);
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
			...n ?? If(r),
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
			let [e, a, o] = Qf(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Gf(e, "--ui-color-input-color", t.held ? Zf(n, r, i, t.opacity) : "transparent"), Gf(e, "--ui-color-input-solid", Zf(n, r, i, 255)), Gf(e, "--ui-color-input-on-color", t.held ? Rf(n, r, i, t.opacity) : "inherit"), Wf(e, t.held ? Uf(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${yf}]`), o = e.querySelector(`[${bf}]`), [s, c, l] = $f(t.hue, 1, 1);
		if (Gf(e, "--ui-color-input-hue", Zf(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${ff}`);
			e !== null && (Gf(e, "left", `${t.saturation * 100}%`), Gf(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${pf}`);
			e !== null && Gf(e, "top", `${t.hue / 360 * 100}%`);
		}
		Kf(e, `[${xf}]`, Xf(n, r, i)), Kf(e, `[${Sf}="r"]`, String(n)), Kf(e, `[${Sf}="g"]`, String(r)), Kf(e, `[${Sf}="b"]`, String(i)), Gf(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), qf(e, `[${wf}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${Tf}]`)) n.getAttribute(Tf) === t.name ? n.setAttribute(Ef, "") : n.removeAttribute(Ef);
		let n = t.name === null ? null : e.querySelector(`[${Tf}="${t.name}"]`), r = n === null ? null : Yf(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Gf(e, "--ui-color-input-base", r === null ? "transparent" : Zf(r[0], r[1], r[2], 255)), qf(e, `[${Cf}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${_f}]`)) n.getAttribute(_f) === t.pane ? n.setAttribute(vf, "") : n.removeAttribute(vf);
		for (let n of e.querySelectorAll(`[${hf}]`)) n.getAttribute(hf) === t.pane ? n.setAttribute(gf, "") : n.removeAttribute(gf);
	}
	resolveRgb(e, t) {
		if (t.name === null) return $f(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${Tf}="${t.name}"]`), r = n === null ? null : Yf(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? $f(t.hue, t.saturation, t.value) : Jf([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mf}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${af}`));
			return;
		}
		let n = e.target.closest(`[${hf}]`), r = e.target.closest(`.${af}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(hf), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${Tf}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(Tf)
			}));
			return;
		}
		let a = r.querySelector(`.${sf}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${af}`);
		if (t !== null) {
			if (e.target.hasAttribute(Cf)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}));
				return;
			}
			e.target.hasAttribute(wf) && this.commit(t, (t) => ({
				...t,
				opacity: P(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}));
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${af}`);
		if (n === null) return;
		if (t.hasAttribute(xf)) {
			let e = Yf(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Qf(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Sf);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = P(Number(t.value));
		let [l, u, d] = Qf(c.r, c.g, c.b);
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
			let e = ep((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}));
			return;
		}
		let o = ep((t.x - a.left) / a.width), s = 1 - ep((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}));
	}
	commit(e, t) {
		let n = this.states.get(e);
		if (n === void 0 || e.hasAttribute(Of)) return;
		let r = {
			...t(n),
			held: !0
		};
		this.applyState(e, r);
		let i = e.querySelector(`.${df}`);
		i !== null && (i.value = Hf(r, this.resolveRgb(e, r)), i.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	toggle(e) {
		e === null || e.hasAttribute(Of) || !e.hasAttribute(Af) && !e.hasAttribute(jf) || this.setOpen(e, !e.classList.contains(of));
	}
	setOpen(e, t) {
		let n = e.querySelector(`.${sf}`);
		if (t && e.hasAttribute(Of) || n === null) return;
		if (this.openInput !== null && this.openInput !== e && this.setOpen(this.openInput, !1), e.classList.toggle(of, t), e.querySelector(`[${mf}]`)?.setAttribute("aria-expanded", t ? "true" : "false"), !t) {
			C(n), this.openInput = null, Hr(this.returnFocus.get(e), n), this.returnFocus.delete(e);
			return;
		}
		this.openInput = e, S((e.getAttribute(kf) === "swatch" ? e.querySelector(`.${uf}`) : e.querySelector(`.${lf}`)) ?? e, n, {
			placement: "bottom-end",
			gap: Mf
		});
		let r = Vr(n, n.querySelector(`[${gf}]`));
		r !== null && this.returnFocus.set(e, r);
	}
};
function Pf(e, t) {
	return ((t) => e.hasAttribute(t === "picker" ? Af : jf))(t) ? t : t === "picker" ? "palette" : "picker";
}
function Ff(e) {
	return Pf(e, "picker");
}
function If(e) {
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
function Lf(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function Rf(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return zf(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function zf(e, t, n) {
	return .2126 * Bf(e) + .7152 * Bf(t) + .0722 * Bf(n);
}
function Bf(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Vf(e) {
	return e.querySelector(`.${df}`)?.value.trim() ?? "";
}
function Hf(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Xf(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${F(e.opacity)}`;
}
function Uf(e, t, n, r, i) {
	if (e.getAttribute(Df) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Xf(t, n, r);
	return i === 255 ? a : `${a}${F(i)}`;
}
function Wf(e, t) {
	for (let n of e.querySelectorAll(`.${cf}`)) n.textContent !== t && (n.textContent = t);
}
function Gf(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function Kf(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function qf(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Jf(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		P(e[0] * (1 - n)),
		P(e[1] * (1 - n)),
		P(e[2] * (1 - n))
	] : [
		P(e[0] + (255 - e[0]) * n),
		P(e[1] + (255 - e[1]) * n),
		P(e[2] + (255 - e[2]) * n)
	];
}
function Yf(e) {
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
function Xf(e, t, n) {
	return `#${F(e)}${F(t)}${F(n)}`;
}
function Zf(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Qf(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function $f(e, t, n) {
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
		P((o + a) * 255),
		P((s + a) * 255),
		P((c + a) * 255)
	];
}
function ep(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function tp(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var np = "ui-table", rp = "ui-table--reorderable", ip = "ui-table__scroll", ap = `:scope > .${ip}`, op = ".ui-table__resizer", sp = "ui-table__header-cell", cp = `${sp}--pinned`, lp = `${ap} > .ui-table__header > .${sp}`, up = `${lp}--pinned`, dp = "--ui-table-columns", fp = "--ui-table-sized-columns", pp = "--ui-table-pin-", mp = "--ui-table-order-", hp = "columns", gp = "hidden", _p = "order", vp = "layout", yp = 32, bp = 16, xp = class {
	root;
	store = new au();
	restored = /* @__PURE__ */ new WeakSet();
	widths = /* @__PURE__ */ new WeakMap();
	orders = /* @__PURE__ */ new WeakMap();
	warner = new u();
	drag;
	reorder;
	moved = !1;
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.drag = new ju({
			root: this.root,
			resolveHandle: (e) => e.closest(op),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new ju({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of M) e !== "base" && matchMedia(`(min-width: ${Du[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${np}`)), w(this.root, `.${np}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t), this.layout(t), tp(t, () => this.pin(t)));
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, hp), r = n === null ? null : Nu(n);
		r !== null && r.length !== t.length ? (this.store.write(e, hp, null), this.store.writeBoot(e, vp, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, _p);
		if (i !== null && !wp(i, t)) {
			this.store.write(e, _p, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${np}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = Cp(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t);
		if (a === null && n.size === 0 && !o) e.style.removeProperty(fp);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = $u(t, n);
				e.style.setProperty(fp, Lu(i.map((e) => r[e])));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${mp}${t}`, String(r[t])) : e.style.removeProperty(`${mp}${t}`);
		let s = [...n].sort((e, t) => e - t).join(" ");
		s.length === 0 ? e.removeAttribute($e) : e.getAttribute("data-ui-table-hidden") !== s && e.setAttribute($e, s);
		let c = [...i].reverse().find((e) => !n.has(e));
		if (c === void 0 ? e.removeAttribute(et) : e.getAttribute("data-ui-table-last") !== String(c) && e.setAttribute(et, String(c)), e.classList.contains(rp)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(lp)) {
			let e = Number(n.getAttribute(Ze)), r = n.getAttribute(Qe), i = n.classList.contains(cp) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Op(r) ? r : null,
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
		let n = this.store.readJson(e, gp) ?? {}, r = /* @__PURE__ */ new Set();
		for (let e of t) (n[e.key] ?? Dp(e)) && r.add(e.index);
		return r;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(dp).trim(), n = t.length === 0 ? null : Nu(t);
		return n === null && this.warner.warn(e, "the table's track list could not be read.", { template: t }), n;
	}
	isColumnHidden(e, t) {
		if (!(e instanceof HTMLElement)) return !1;
		let n = this.columnsOf(e), r = n.find((e) => e.key === t);
		return r !== void 0 && this.hiddenOf(e, n).has(r.index);
	}
	setColumnHidden(e, t, n) {
		if (!(e instanceof HTMLElement)) return;
		let r = this.store.readJson(e, gp) ?? {}, i = this.columnsOf(e).find((e) => e.key === t);
		n === null || i !== void 0 && n === Dp(i) ? delete r[t] : r[t] = n, this.store.writeJson(e, gp, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return Cp(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(up).length;
		if (t < 2) return;
		let n = Qu(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${pp}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains(ip) || t.closest(`.${np}`)?.toggleAttribute(it, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(ap);
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
		let t = e.target.closest(op);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = bp;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${np}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Ze)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(op)?.closest(`.${np}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Wu(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(yp, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, Sp(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, hp, t === null ? null : Lu(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(fp).trim(), n = e.getAttribute($e), r = {};
		t.length > 0 && (r[fp] = t);
		for (let t of e.style) t.startsWith(mp) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, vp, null);
			return;
		}
		this.store.writeBoot(e, vp, {
			styles: r,
			attributes: {
				[$e]: n,
				[et]: e.getAttribute(et)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${np}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = Bu(t.getAttribute(Je)), i = Vu(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Ze)), u = this.hiddenOf(t, o), d = Cp(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${sp}`), n = t?.closest(`.${np}`) ?? null;
		return t === null || n === null || !n.classList.contains(rp) || e.closest(op) !== null || t.classList.contains(cp) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${np}`), r = Number(e.getAttribute(Ze));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(tt, ""), e.setAttribute(nt, ""), {
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
		for (let a of Cp(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Tp(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), Ep(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(rt, "after") : a.cell.setAttribute(rt, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(nt), t.table.removeAttribute(tt), Ep(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = Cp(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, _p, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function Sp(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function Cp(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function wp(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Tp(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Ep(e) {
	for (let t of e.querySelectorAll(`[${rt}]`)) t.removeAttribute(rt);
}
function Dp(e) {
	return e.hideBelow !== null && M.indexOf(Ou()) < M.indexOf(e.hideBelow);
}
function Op(e) {
	return e !== null && M.includes(e);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var I = { ok: !1 };
function kp(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => Ft(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
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
			if (c++, Ft(t.kind) === "Dynamic") {
				let n = jp(e, t.componentId);
				if (!n.ok) return I;
				o = n.value, s = !0;
			} else {
				if (!s) return I;
				let e = Lp(o, t.value);
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
			let e = Np(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? I : {
		ok: !0,
		value: o
	};
}
var Ap = /* @__PURE__ */ new Set();
function jp(e, t) {
	let n = _(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Ap.has(n) || (Ap.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), I;
}
function Mp(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Np(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Np(e, t) {
	if (e == null) return I;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return I;
	let n = e, r = Pp(n, t);
	return Object.prototype.hasOwnProperty.call(n, r) ? {
		ok: !0,
		value: n[r]
	} : I;
}
function Pp(e, t) {
	if (Object.prototype.hasOwnProperty.call(e, t)) return t;
	let n = Fp(t);
	if (Object.prototype.hasOwnProperty.call(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Fp(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Ip(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Ft(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Ft(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = _(e.componentId);
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
function Lp(e, t) {
	if (e == null || t == null) return I;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : I;
	if (typeof t != "string") return I;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.prototype.hasOwnProperty.call(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (zp(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return I;
}
function Rp(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (zp(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.prototype.hasOwnProperty.call(r, t) ? (r[t] = n, !0) : !1;
}
function zp(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Bp = `:scope > [${Ce}], :scope > [${we}], :scope > [${Me}]`, Vp = "ui-hidden";
function L(e) {
	let t = new Set(e.querySelectorAll(Bp));
	return [...e.children].filter((e) => !t.has(e));
}
function Hp(e) {
	return e === null ? [] : [e];
}
function Up(e) {
	return e.querySelector(`:scope > [${Ce}]`);
}
function Wp(e, t, n, r, i) {
	i ??= L(e).some((e) => !e.classList.contains(Vp));
	let a = Up(e);
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
	c.setAttribute(Ce, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/items-filter-sort.ts
function Gp(e) {
	let t = e.closest(Ot)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Kp(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Gp(e);
	if (a !== void 0 || o !== null) for (let n of L(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Vp);
			continue;
		}
		n.classList.toggle(Vp, !qp(a, e, i, o));
	}
}
function qp(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Qp(e, t, n)) && (r?.filters ?? []).every((e) => Yn(Mp(t, e.itemProperty), e.operator, e.value));
}
function Jp(e, t, n = null) {
	return (e?.filters ?? []).some((e) => $p(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Yp(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => $p(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Xp(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Zp(n.getItemValue(e), n.getItemValue(r), t));
}
function Zp(e, t, n) {
	for (let r of n) {
		let n = em(Mp(e, r.itemProperty), Mp(t, r.itemProperty));
		if (n !== 0) return Bt(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Qp(e, t, n) {
	if (!$p(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Yn(Mp(t, e.itemProperty), e.operator, r);
}
function $p(e, t, n, r) {
	return e == null || Yn(r.get(e, []), t, n);
}
function em(e, t) {
	if (e === t) return 0;
	if (e == null) return -1;
	if (t == null) return 1;
	if (typeof e == "number" && typeof t == "number") return e - t;
	let n = Number(e), r = Number(t);
	return !Number.isNaN(n) && !Number.isNaN(r) ? n - r : String(e).localeCompare(String(t));
}
//#endregion
//#region src/items/items-host-mode.ts
function tm(e) {
	switch (e.getAttribute(De)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-dom-order.ts
function nm(e, t) {
	let n = e.firstElementChild;
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var rm = /* @__PURE__ */ new WeakMap();
function im(e, t) {
	let n = rm.get(e), r = n === void 0 ? [...t] : am(n, t);
	return rm.set(e, r), r;
}
function am(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function om(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function sm(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function cm(e, t, n) {
	return sm(e, t), om(e, t, n);
}
function lm(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function um(e) {
	rm.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var dm = /* @__PURE__ */ new WeakMap();
function fm(e) {
	for (let t of e.querySelectorAll(`[${we}]`)) t.remove();
}
function pm(e, t, n, r, i, a) {
	let o = tm(e) === "windowed", s = L(e), c = o ? s : im(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : Yp(f, a, Gp(e));
	if (u && !d && fm(e), c.length === 0) {
		dm.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Up(e);
	if (!d) {
		nm(e, [...Xp(c, p, r), ...Hp(ee)]);
		return;
	}
	fm(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (dm.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	dm.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = Xp(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = mm(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	nm(e, [...re, ...Hp(ee)]);
}
function mm(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(we, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var hm = "ui-tree-rules", gm = "ui-tree";
function _m(e, t, n) {
	if (e.parentElement?.classList.contains(gm) === !0) {
		e.dispatchEvent(new Event(hm, { bubbles: !0 }));
		return;
	}
	switch (tm(e)) {
		case "windowed":
			Wp(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Kp(e, t, n.metadata, n.renderer, n.state), Wp(e, t, n.templates, n.renderer), pm(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
function vm(e, t, n, r, i, a = []) {
	ym(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function ym(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/inline-rename.ts
function bm(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.value = e.value, xm(r, n, t);
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
function xm(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Sm = ".ui-items-view, .ui-table", Cm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${Vi})[${vt}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), w(this.root, Vi, {
			childList: !0,
			attributeFilter: [
				vt,
				bt,
				xt
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		Ji(e, this.ownItems(e));
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Hi), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || r.matches(".ui-disabled") ? null : Ma(e.target, n) === null && !Mi(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleClick(e) {
		let t = this.resolveRow(e, Vi);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		Fi(n, i, r), n.focus({ preventScroll: !0 }), !n.hasAttribute("data-ui-no-row-select") && Xi(n, i, r, Ki(e)) && e.preventDefault();
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Sm);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Li(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Hi);
		if (t !== null && Ma(e.target, t) !== null) return;
		let n = e.target.closest(Sm);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.ownItems(n), i = Pi(r), a = Ii(e.key, r, i, n.matches(".ui-orientation--horizontal") ? "both" : "vertical");
		if (a !== null) {
			e.preventDefault(), Fi(n, r, a), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Gi(n, i), Xi(n, r, a, Ki(e)));
			return;
		}
		if (!(i === null || Mi(i))) {
			switch (e.key) {
				case " ":
					if (!Xi(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					Yi(r).includes(i) || Xi(n, r, i, Ui), Li(i, "open");
					break;
				case "Delete": {
					let e = wm(r, i);
					if (e.length === 0) return;
					for (let t of e) Li(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return T(e, Hi, Vi);
	}
};
function wm(e, t) {
	let n = Yi(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute(le));
}
//#endregion
//#region src/interactions/tree-engine.ts
var R = "ui-tree", Tm = "ui-tree__row", Em = "ui-tree__row--folded", Dm = "ui-tree__row--filtered", Om = "fold-hidden", km = "fold-shown", Am = "ui-tree__row--dragging", jm = "ui-tree__loading", Mm = "ui-tree__loading-ring", Nm = "ui-tree-node", Pm = "ui-tree-node__text", Fm = "ui-tree-node__toggle", Im = "ui-tree-node__rename", Lm = ".ui-text__title", Rm = "data-ui-tree-drop", zm = "--ui-tree-depth", Bm = "expanded", Vm = 600, Hm = class {
	root;
	store = new au();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(hm, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${R}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(_(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => z(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${R}`)), w(this.root, `.${R}`, {
			childList: !0,
			attributeFilter: [
				at,
				ot,
				st,
				ft
			]
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(ft), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Gm(e)?.getAttribute(at);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = z(e), r = Gm(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(ot) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(zm, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(Em, !d), e.classList.toggle(Dm, re), e.removeAttribute(dt), e.draggable = i && !e.hasAttribute("data-ui-undraggable"), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(lt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(lt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(lt), d && ne && !re), s.set(n, {
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
		return Gm(e.row)?.hasAttribute(st) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Tm}[${m}="${CSS.escape(e)}"]`);
		this.store.writeBoot(e, Om, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, km, i.length === 0 ? null : this.bootPatch(i, "shown"));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [dt]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = y(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Gp(t);
		if (r === void 0 && i === null) return null;
		let a = Yp(r, this.rules.state, i), o = Jp(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(z)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Gm(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Zp(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(z(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${jm}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = z(o), c = i.getItemValue(o);
			if (c === void 0 || qp(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Gm(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(jm) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Um();
		o.style.setProperty(zm, String(t)), o.classList.toggle(Em, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Fm}`) === null && (!r.hasAttribute("data-ui-unselectable") || Ma(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Ma(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Tm}`), n = t?.closest(`.${R}`) ?? null;
		return t === null || n === null || t.closest(`.${R}`) !== n || Mi(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Tm}`);
		if (t !== null && Ma(e.target, t) !== null) return;
		let n = e.target.closest(`.${R}`);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.rowsOf(n), i = Pi(r), a = Ii(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, Ki(e));
			return;
		}
		if (!(i === null || Mi(i))) {
			switch (e.key) {
				case " ":
					if (!Xi(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, Ii("ArrowDown", r, i, "vertical"), Ui);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), Ui);
					break;
				case "Enter":
					Yi(r).includes(i) || Xi(n, r, i, Ui), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = wm(r, i);
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
		let t = Wm(e), n = t?.closest(`.${R}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		let r = t.hasAttribute("data-ui-selected") ? Yi(this.rowsOf(n)).filter((e) => e !== t && e.draggable && e.getClientRects().length > 0) : [];
		vm(e, n, t, Am, z(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Am));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Tm}`), a = i !== null && i.closest(`.${R}`) === t ? i : r;
		a !== r && n.some((e) => e === a || this.isUnder(t, a, e)) || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a));
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Vm)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Rm}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Tm) ? z(r) : "", a = n.filter((e) => !n.some((n) => n !== e && this.isUnder(t, e, n)));
		this.markDrop(t, null), this.springOpen(t, null), ym(t, Am), r.classList.contains(Tm) && this.expand(t, r);
		for (let e of a) {
			let t = Gm(e)?.querySelector(`.${Pm}`) ?? null;
			t !== null && (t.setAttribute(ut, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = Wm(e)?.closest(`.${R}`) ?? null;
		t !== null && (ym(t, Am), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Rm}]`)) n !== t && n.removeAttribute(Rm);
		t?.setAttribute(Rm, "");
	}
	isUnder(e, t, n) {
		let r = z(n);
		for (let n = this.parentOf(e, t); n !== null; n = this.parentOf(e, n)) if (z(n) === r) return !0;
		return !1;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = z(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n, this.store.writeJson(e, Bm, i), this.layout(e);
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, Bm) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Pi(r);
		Fi(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Gi(e, i), Xi(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Gm(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => z(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${R}`), n = Gm(e), r = n?.querySelector(Lm) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), bm({
			container: n,
			title: r,
			className: Im,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(ct, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Tm) && n.push(e);
		return n;
	}
};
function Um() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = jm, e.setAttribute("aria-hidden", "true"), t.className = Mm, e.append(t, b.text("ui.tree.loading")), e;
}
function Wm(e) {
	return e.target instanceof Element ? e.target.closest(`.${Tm}`) : null;
}
function z(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function Gm(e) {
	return e.querySelector(`.${Nm}`);
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var B = "ui-tabs-view", Km = "ui-tab-item", qm = "ui-tab-item__label", Jm = "ui-tab-item__close", Ym = "ui-tab-item__rename", Xm = "ui-tab-item__caption", Zm = ".ui-text__title", Qm = "ui-tab-item--dragging", $m = "ui-tab-item__caption--overflowed", eh = "ui-tabs-view--overflowing", th = "ui-tabs-view--no-overflow", nh = "ui-tab-item__page", rh = "ui-tab-item--selected", ih = "data-ui-tabs-renamable", ah = "--ui-tabs-view-strip", oh = class {
	root;
	overflow;
	dragStart = null;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${B}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new Bd((e, t) => this.select(e, t)), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(_(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => fh(e) === t.key))?.querySelector(`.${qm}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), w(this.root, `.${B}`, {
			childList: !0,
			attributeFilter: [
				Ct,
				fe,
				...Et
			]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${B}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Nd);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => fh(e) === r)) {
			this.select(e, fh(n[0]));
			return;
		}
		let i = e.hasAttribute(fe), a = [], o = null, s = null;
		for (let e of t) {
			let t = fh(e) === r;
			e.classList.toggle(rh, t);
			let c = e.querySelector(`.${Xm}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${qm}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${nh}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${nh}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${qm}`);
			t === null || e.classList.contains($m) || (c.push(t), e === o && (l = t));
		}
		Di(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Nd(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(ah, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Pd}`);
		if (r === null || i === null) return;
		if (this.resizes?.observe(r), e.classList.contains(th)) {
			for (let e of t) e.classList.remove($m);
			e.classList.remove(eh);
			return;
		}
		e.classList.add(eh);
		let a = zd({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: $m
		});
		e.classList.toggle(eh, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownItems(e).filter(Nd).map((e) => ({
			key: fh(e),
			title: e.querySelector(`.${qm}`)?.textContent?.trim() ?? fh(e),
			current: fh(e) === n
		}));
		this.overflow.open(t, e, r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Pd}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(B)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${qm}`), i = r?.closest(`.${B}`) ?? null;
		if (r === null || i === null || r.matches(":disabled, .ui-disabled")) return;
		let a = r.closest(`.${Km}`);
		a !== null && a.closest(`.${B}`) === i && (e.preventDefault(), this.select(i, fh(a)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Jm}`), r = n?.closest(`.${Km}`) ?? null, i = r?.closest(`.${B}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), i.hasAttribute("data-ui-tabs-unremovable") || ch(r).hasAttribute("data-ui-unremovable") || r.hasAttribute("data-ui-unremovable") || r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qm}`), n = t?.closest(`.${B}`) ?? null;
		t === null || n === null || !n.hasAttribute(ih) || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Zm) ?? e, r = e.closest(`.${Km}`);
		t === null || r === null || ch(r).hasAttribute("data-ui-unrenamable") || bm({
			container: t,
			title: n,
			className: Ym,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Tt, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => e.focus()
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qm}`), n = t?.closest(`.${B}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute(ih)) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${qm}`)).filter((e) => e !== null), i = Ti({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${Km}`);
		a !== null && this.select(n, fh(a)), i.focus();
	}
	handleDragStart(e) {
		let t = uh(e);
		if (t === null) return;
		if (ch(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		vm(e, t.closest(`.${B}`) ?? t, t, Qm, fh(t));
		let n = ch(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xm}`)?.closest(`.${Km}`) ?? null, n = t?.closest(`.${B}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Qm}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${Xm}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = ch(r), o = t.hasAttribute("data-ui-tab-pinned") ? sh(n, a) : null, s = o ?? ch(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && t.querySelector(`.${Qm}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = uh(e);
		if (t === null) return;
		t.classList.remove(Qm);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(ch(t), n.next);
			return;
		}
		let r = ch(t);
		(n === null || r.parentNode !== n.parent || r.nextSibling !== n.next) && this.commitOrder(t);
	}
	commitOrder(e) {
		let t = ch(e), n = dh(lh(t.previousElementSibling)), r = dh(lh(t.nextElementSibling)), i = n === null && r === null ? 0 : n === null ? r - 1 : r === null ? n + 1 : (n + r) / 2;
		e.setAttribute(wt, String(i)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	select(e, t) {
		zi(e, t, {
			attribute: Ct,
			bindingAttribute: St,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return T(e, `.${Km}`, `.${B}`);
	}
};
function sh(e, t) {
	let n = null;
	for (let r of T(e, `.${Km}`, `.${B}`)) {
		let e = ch(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function ch(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function lh(e) {
	return e === null ? null : e.matches(`.${Km}`) ? e : e.querySelector(`.${Km}`);
}
function uh(e) {
	return e.target instanceof Element ? e.target.closest(`.${Xm}`)?.closest(`.${Km}`) ?? null : null;
}
function dh(e) {
	let t = e?.getAttribute("data-ui-tab-order") ?? null;
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function fh(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var ph = "button.ui-text__fold-toggle", mh = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ph);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, hh = "ui-temporal-input__segments", gh = "ui-temporal-input__segment", _h = "ui-temporal-input__segment-literal", vh = "ui-temporal-input__segment--empty", yh = "data-ui-temporal-segment", bh = "data-ui-temporal-step-direction", xh = "data-ui-temporal-readonly", Sh = "data-ui-temporal-segments-of", Ch = "--", wh = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(fn(e.components, `.${O}`));
		}), w(this.root, `.${O}`, { attributeFilter: [...Ws] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("wheel", (e) => this.handleWheel(e), {
			capture: !0,
			passive: !1
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Ks(t) === "time" && (ac(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${hh}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = qs(e), r = Xs(e), i = k(e, $s(t));
		t.getAttribute(Sh) !== n && (t.replaceChildren(...Th(n).map((e) => Dh(e))), t.setAttribute(Sh, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(yh);
			if (t === null) {
				n.textContent = Oh(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = kh(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(vh, i === null), n.tabIndex = e.hasAttribute(xh) ? -1 : 0, Ah(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = Mh(e.target);
		if (t === null) return;
		let n = t.closest(`.${O}`), r = t.getAttribute(yh), i = jh(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), Ph(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), rc(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = Fh(e.key, Xs(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleWheel(e) {
		if (!(e instanceof WheelEvent)) return;
		let t = Mh(e.target);
		if (t === null || t !== document.activeElement) return;
		e.preventDefault();
		let n = t.closest(`.${O}`);
		this.resetBuffer(n), this.applyStep(n, t.getAttribute(yh), e.deltaY < 0 ? 1 : -1, jh(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${bh}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${bh}]`);
		if (t === null) return;
		let n = t.closest(`.${O}`);
		if (n === null || n.hasAttribute(xh)) return;
		e.preventDefault();
		let r = Nh(n) ?? n.querySelector(`.${gh}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(yh), t.getAttribute(bh) === "up" ? 1 : -1, jh(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${gh}`) : null;
		if (t === null) return;
		let n = t.closest(`.${O}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = k(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = Ih(t), o = Ys(Js(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Lh(i, a) + o) % s + s) % s;
		this.write(e, Rh(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Rh(t, "hour", zh(l, t.getHours() >= 12)) : Rh(t, Ih(n), l), i);
		}
		u && Ph(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, Rh(r, "hour", zh(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return k(e, t) ?? sc(e);
	}
	write(e, t, n) {
		rc(e, cc(e, t), n), ic(e), this.applySegments(e);
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
function Th(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Os(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(Eh(r)), n += r.length;
	}
	return t;
}
function Eh(e) {
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
function Dh(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = _h, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = gh, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(yh, e.unit), t.dataset.width = String(e.width), t;
}
function Oh(e, t, n, r) {
	return t && n !== null ? Es(n, e, r) : e;
}
function kh(e, t, n, r) {
	if (n === null) return Ch;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : Lh(n, Ih(e));
	return String(i).padStart(t, "0");
}
function Ah(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(Lh(n, Ih(t))));
}
function jh(e) {
	return $s(e.closest(`.${hh}`));
}
function Mh(e) {
	let t = e instanceof Element ? e.closest(`.${gh}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${O}`);
	return n === null || n.hasAttribute(xh) ? null : t;
}
function Nh(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${gh}`) : null;
}
function Ph(e, t, n) {
	Ti({
		key: n,
		items: [...e.querySelectorAll(`.${gh}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function Fh(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function Ih(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function Lh(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Rh(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function zh(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var Bh = "data-ui-scroll-anchor", Vh = 4, Hh = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), w(this.root, `[${Bh}="End"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ze]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !Uh(t) || this.pinned.set(t, Wh(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${Bh}="End"]`));
	}
	followEach(e) {
		for (let t of e) this.pinned.get(t) !== !1 && (this.pinned.set(t, !0), Wh(t) || (t.scrollTop = t.scrollHeight));
	}
};
function Uh(e) {
	return e.getAttribute(Bh) === "End";
}
function Wh(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= Vh;
}
//#endregion
//#region src/items/items-viewport.ts
function Gh(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Kh(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${h}][${Oe}]`) : null;
}
function qh(e) {
	let t = Gh(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Yh(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Jh(e, t) {
	let n = Gh(e);
	n.scrollTop = n === e ? t : t + Yh(e, n);
}
function Yh(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function Xh(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Qh(e, a, n), s = Qh(e, a + 1, n);
	return $h(t, o.top, s.top, o.line, s.line);
}
function Zh(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Qh(e, a, n), s = Qh(e, a + 1, n);
	return $h(t, o.line, s.line, o.top, s.top);
}
function Qh(e, t, n) {
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
function $h(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var eg = 250, tg = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(ke);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < eg && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${ke}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${ke}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = ng(e, "data-ui-scroll-viewport") ?? rg(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? ag(e) : null, a = i === null ? null : ag(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Zh(a, Xh(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? ig(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function ng(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function rg(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : ng(e, h);
	return t === null ? null : Gh(t);
}
function ig(e, t) {
	return t > 0 ? e / t : 0;
}
function ag(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Ae}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${je}]`);
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
var og = ".ui-button, .ui-action, .ui-menu-item", sg = Ge, cg = "ui-pressing", lg = "--ui-press-x", ug = "--ui-press-y", dg = 250, fg = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(og);
		if (t === null || t.matches(":disabled, .ui-disabled, [inert]") || t.matches(sg)) return;
		let n = t.getBoundingClientRect();
		t.style.setProperty(lg, `${e.clientX - n.left}px`), t.style.setProperty(ug, `${e.clientY - n.top}px`), t.classList.remove(cg), t.offsetWidth, t.classList.add(cg), window.setTimeout(() => t.classList.remove(cg), dg);
	}
}, pg = "mask:", mg = "ui-icon--image";
function hg(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(pg) && (n = !0, t = t.slice(5).trim()), gg(t) ? {
		source: t,
		tinted: n
	} : null;
}
function gg(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function _g(e) {
	let t = hg(e);
	return t === null ? "" : vg(t.source);
}
function vg(e) {
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
var yg = "ui-icon", bg = "data-ui-icon";
function xg(e, t) {
	let n = String(t ?? "").trim();
	if (e.classList.add(yg), n.length === 0) return;
	e.setAttribute(bg, "");
	let r = hg(n);
	if (r === null) {
		e.classList.add(Cg(n));
		return;
	}
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", vg(r.source)), r.tinted || e.classList.add(mg);
}
var Sg = "ui-icon-glyph--";
function Cg(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Sg;
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
var wg = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Tg(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || wg.includes(t.slice(0, n).toLowerCase());
}
function Eg(e) {
	return Tg(e) ? String(e) : void 0;
}
function Dg(e) {
	let t = String(e ?? "").trim();
	return gg(t) ? t : void 0;
}
//#endregion
//#region src/rendering/inline-markup.ts
var V = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Og = "\\", kg = "`", Ag = "!", jg = "{", Mg = "}", Ng = "ui-text__fold", Pg = "ui-text__fold-toggle", Fg = "ui-text__fold-content";
function Ig(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return qg(e, 0, e.length, V.None, null, t, n), Jg(t, n, V.None, null), t;
}
function Lg(e) {
	return Ig(e).map((e) => Vg(e) ? `${e.fold} ${Lg(e.text)}` : e.text).join("");
}
function Rg(e, t, n = {}) {
	let r = Ig(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && zg(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Hg(r, n));
}
function zg(e) {
	return e.styles === V.None && e.url === null && !Bg(e) && !Vg(e);
}
function Bg(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Vg(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Hg(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Ug(r, t));
	return n;
}
function Ug(e, t) {
	if (Bg(e)) return Gg(e.icon);
	let n = Vg(e) ? Wg(e, t) : document.createTextNode(e.text);
	if ((e.styles & V.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & V.Strikethrough) !== 0 && (n = Kg("s", n)), (e.styles & V.Underline) !== 0 && (n = Kg("u", n)), (e.styles & V.Italic) !== 0 && (n = Kg("em", n)), (e.styles & V.Bold) !== 0 && (n = Kg("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", i_(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Wg(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Ng} ${Ng}--static` : Ng, r.className = Pg, r.textContent = e.fold ?? "", i.className = Fg, i.append(Hg(Ig(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(_e, ""), n.append(r, i), n);
}
function Gg(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", xg(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Kg(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function qg(e, t, n, r, i, a, o) {
	let s = t;
	for (; s < n;) {
		let t = e[s];
		if (t === Og && s + 1 < n && a_(e[s + 1])) {
			o.value += e[s + 1], s += 2;
			continue;
		}
		let c = Yg(e, s, n);
		if (c !== null) {
			Jg(a, o, r, i), Xg(e, s + 1, c, o), Jg(a, o, r | V.Code, i), s = c + 1;
			continue;
		}
		let l = e_(e, s, n);
		if (l !== null) {
			Jg(a, o, r, i), qg(e, s + l.markerLength, l.contentEnd, r | l.style, i, a, o), Jg(a, o, r | l.style, i), s = l.contentEnd + l.markerLength;
			continue;
		}
		let u = Zg(e, s, n);
		if (u !== null) {
			Jg(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: u.name
			}), s = u.iconEnd;
			continue;
		}
		let d = i === null ? n_(e, s, n) : null;
		if (d !== null) {
			Jg(a, o, r, i), qg(e, d.labelStart, d.labelEnd, r, d.url, a, o), Jg(a, o, r, d.url), s = d.linkEnd;
			continue;
		}
		let f = r_(e, s, n);
		if (f !== null) {
			Jg(a, o, r, i), a.push({
				text: e.slice(f.contentStart, f.contentEnd),
				styles: r,
				url: i,
				fold: f.caption
			}), s = f.contentEnd + 1;
			continue;
		}
		o.value += t, s++;
	}
}
function Jg(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Yg(e, t, n) {
	if (e[t] !== kg) return null;
	let r = t + 1;
	if (r >= n || o_(e[r])) return null;
	let i = t_(e, r, n, kg, 1);
	return i > r ? i : null;
}
function Xg(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Og && i + 1 < n && a_(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Zg(e, t, n) {
	if (e[t] !== Ag || t + 1 >= n || e[t + 1] !== "[") return null;
	let r = t + 2, i = Qg(e, r, n);
	if (i <= r) return null;
	let a = e.slice(r, i);
	return $g(a) ? {
		name: a,
		iconEnd: i + 1
	} : null;
}
function Qg(e, t, n) {
	for (let r = t; r < n; r++) {
		if (e[r] === Og) {
			r++;
			continue;
		}
		if (e[r] === "]") return r;
	}
	return -1;
}
function $g(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function e_(e, t, n) {
	let r = e[t];
	if (r !== "*" && r !== "_" && r !== "~") return null;
	let i = t + 1 < n && e[t + 1] === r, a, o;
	if (r === "*" && i) a = V.Bold, o = 2;
	else if (r === "*") a = V.Italic, o = 1;
	else if (r === "_" && i) a = V.Underline, o = 2;
	else if (r === "~" && i) a = V.Strikethrough, o = 2;
	else return null;
	let s = t + o;
	if (s >= n || o_(e[s])) return null;
	let c = t_(e, s, n, r, o);
	return c > s ? {
		style: a,
		markerLength: o,
		contentEnd: c
	} : null;
}
function t_(e, t, n, r, i) {
	for (let a = t; a + i <= n; a++) {
		if (e[a] === Og) {
			a++;
			continue;
		}
		if (e[a] === r && !(i === 2 && (a + 1 >= n || e[a + 1] !== r)) && !(i === 1 && a + 1 < n && e[a + 1] === r) && a > t && !o_(e[a - 1])) return a;
	}
	return -1;
}
function n_(e, t, n) {
	if (e[t] !== "[") return null;
	let r = Qg(e, t + 1, n);
	if (r < 0 || r + 1 >= n || e[r + 1] !== "(") return null;
	let i = e.indexOf(")", r + 2);
	if (i < 0 || i >= n) return null;
	let a = e.slice(r + 2, i).trim();
	if (!Tg(a)) return null;
	let o = t + 1, s = r;
	return s > o ? {
		labelStart: o,
		labelEnd: s,
		url: a,
		linkEnd: i + 1
	} : null;
}
function r_(e, t, n) {
	if (e[t] !== "[") return null;
	let r = Qg(e, t + 1, n);
	if (r <= t + 1 || r + 1 >= n || e[r + 1] !== jg) return null;
	for (let n = t + 1; n < r; n++) if (e[n] === Og) n++;
	else if (e[n] === "[") return null;
	let i = r + 2, a = -1, o = 1;
	for (let t = i; t < n && a < 0; t++) {
		if (e[t] === Og) {
			t++;
			continue;
		}
		e[t] === jg ? o++ : e[t] === Mg && --o === 0 && (a = t);
	}
	if (a <= i) return null;
	let s = { value: "" };
	return Xg(e, t + 1, r, s), {
		caption: s.value,
		contentStart: i,
		contentEnd: a
	};
}
function i_(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function a_(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === jg || e === Mg || e === kg || e === Og;
}
function o_(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var s_ = "data-ui-tooltip", c_ = "data-ui-tooltip-placement", l_ = "data-ui-tooltip-mark", u_ = "ui-tooltip", d_ = "ui-tooltip--visible", f_ = "[aria-haspopup][aria-expanded=\"true\"]", p_ = "top", m_ = 250, h_ = 200, g_ = 300, __ = 7, H = null, U = null, v_ = null, y_ = 0, b_ = 0, x_ = 0, S_ = !1;
function C_(e = document) {
	if (S_) return;
	S_ = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", w_, !0), t.addEventListener("pointerout", T_, !0), t.addEventListener("focusin", E_, !0), t.addEventListener("focusout", D_, !0), t.addEventListener("keydown", O_, !0), t.addEventListener("pointerdown", (e) => {
		v_ === null && !k_(e.target) && B_(!0);
	}, !0), window.addEventListener("blur", () => {
		v_ = null, B_(!0);
	});
}
function w_(e) {
	if (k_(e.target)) {
		window.clearTimeout(b_);
		return;
	}
	let t = A_(e.target);
	t !== null && t !== U && j_(t);
}
function T_(e) {
	if (v_ !== null) return;
	let t = e.relatedTarget;
	t instanceof Node && (U !== null && U.contains(t) || k_(t)) || (k_(e.target) || A_(e.target) === U) && B_(!1);
}
function E_(e) {
	let t = A_(e.target);
	t !== null && (v_ = e.target instanceof Element && e.target.closest(`[${l_}]`) !== null ? t : null, M_(t));
}
function D_(e) {
	A_(e.target) === U && (v_ = null, B_(!0));
}
function O_(e) {
	e.key === "Escape" && U !== null && (v_ = null, B_(!0));
}
function k_(e) {
	return H !== null && e instanceof Node && H.contains(e);
}
function A_(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${s_}], [${l_}]`);
	if (t === null) return null;
	let n = t.hasAttribute(s_) ? t : t.querySelector(`[${s_}]`);
	return n === null ? null : (n.getAttribute(s_) ?? "").trim().length > 0 ? n : null;
}
function j_(e) {
	if (v_ === null) {
		if (window.clearTimeout(b_), window.clearTimeout(y_), U !== null) {
			B_(!0), M_(e);
			return;
		}
		if (Date.now() - x_ < g_) {
			M_(e);
			return;
		}
		y_ = window.setTimeout(() => M_(e), m_);
	}
}
function M_(e, t) {
	let n = (t ?? e.getAttribute(s_) ?? "").trim();
	if (n.length === 0 || !e.isConnected || N_(e)) return;
	window.clearTimeout(y_), window.clearTimeout(b_);
	let r = V_();
	Rg(r, n, { staticFolds: !0 }), r.classList.add(d_), U = e, e.setAttribute("aria-describedby", r.id), r.setAttribute("data-ui-tooltip-text", Lg(n)), S(e, r, {
		placement: z_(e),
		gap: __,
		arrow: !0
	});
}
function N_(e) {
	return e.matches(f_) || e.querySelector(f_) !== null;
}
function P_(e, t) {
	M_(e, t);
}
function F_() {
	B_(!0);
}
var I_ = {
	show: P_,
	hide: F_
};
function L_(e) {
	v_ = e, M_(e);
}
function R_(e) {
	if (U === e) {
		if ((e.getAttribute(s_) ?? "").trim().length === 0) {
			v_ = null, B_(!0);
			return;
		}
		M_(e);
	}
}
function z_(e) {
	let t = e.getAttribute(c_);
	return t !== null && ar(t) ? t : p_;
}
function B_(e) {
	window.clearTimeout(y_), window.clearTimeout(b_);
	let t = () => {
		U !== null && (U.removeAttribute("aria-describedby"), U = null, H !== null && (H.classList.remove(d_), C(H)), x_ = Date.now());
	};
	e ? t() : b_ = window.setTimeout(t, h_);
}
function V_() {
	return H !== null && H.isConnected ? H : (H = document.createElement("div"), H.id = "ui-tooltip", H.className = u_, H.setAttribute("role", "tooltip"), H.setAttribute("aria-hidden", "true"), document.body.append(H), H);
}
//#endregion
//#region src/interactions/popup-service.ts
var H_ = /* @__PURE__ */ new Map();
new zr({
	openPopups: () => H_.keys(),
	close: (e, t) => U_(e, t),
	isInside: (e, t) => t.includes(e) || t.includes(H_.get(e).anchor),
	onPress: !0
});
function U_(e, t) {
	let n = H_.get(e);
	n !== void 0 && (W_(e), n.options.onDismiss(t));
}
function W_(e) {
	H_.delete(e), C(e);
}
var G_ = { open(e, t, n) {
	return H_.set(t, {
		anchor: e,
		options: n
	}), S(e, t, n), {
		reposition: () => S(e, t, n),
		close: () => W_(t)
	};
} };
//#endregion
//#region src/items/item-rows.ts
function K_(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Mp,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		}
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var q_ = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? Y_(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null) : o;
		l !== o && this.moveItemScope(o, l), X_(l, n, t);
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
		let i = J_(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: mn(r),
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
		let r = ev(t, n.templateKeyPropertyName);
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
		} : { ok: !1 } : kp(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			i.optional !== !0 && !this.unresolved.has(r) && (this.unresolved.add(r), s("item binding value could not be resolved; the item has no such property.", {
				binding: i,
				stack: n
			}));
			return;
		}
		let c = o.value ?? i.fallbackValue, l = _(i.componentId), u = e.closest(`[${ie}="${l}"]`);
		if (u === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = on(u, t, () => [e])[0] ?? null;
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
function J_(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Np(r, i.name) : Lp(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Rp(r, i.key, n), e;
	let a = r;
	return a[Pp(a, i.name)] = n, e;
}
function Y_(e, t, n) {
	let r = document.createElement(t);
	return n !== null && (r.className = n), r.appendChild(e), r;
}
function X_(e, t, n) {
	e.setAttribute(m, t), $_(e, n), Q_(e, n);
}
var Z_ = [
	["CanSelect", se],
	["CanDrag", ce],
	["CanRemove", le],
	["CanRename", ue],
	["CanShowContextMenu", de]
];
function Q_(e, t) {
	for (let [n, r] of Z_) {
		let i = Np(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function $_(e, t) {
	let n = Np(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Te, n.value) : e.removeAttribute(Te);
}
function ev(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Np(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var tv = "Group", nv = class {
	sources = /* @__PURE__ */ new Map();
	options;
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = _(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && (e.reactiveSources.watch(t.source, i), this.sources.set(_(t.source.componentId), { reference: t.source }));
		}
		for (let t of Mn) e.root.addEventListener(t, (e) => this.handleSourceValueEvent(e), !0);
		w(e.root, `[${be}]`, { attributeFilter: [be] }, (e) => {
			for (let t of e) {
				let e = y(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
	}
	handleSourceValueEvent(e) {
		if (!(e.target instanceof Element)) return;
		let t = y(e.target), n = t === null ? void 0 : this.sources.get(t);
		n !== void 0 && this.options.propertyPatchEngine.applyPropertyValue(n.reference, [], this.options.valueReaders.readBound(e.target), !0);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(_(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Ip(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${h}]`)) tm(r) === "virtualized" && this.options.virtualization.updateValue(r, n, t.steps, e.value) && _m(r, y(r) ?? 0, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${kt(t)}"]`)].filter((t) => this.isItemRoot(t) && ln(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${h}]`), i = r === null ? null : y(r);
		if (r !== null && i !== null && tm(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && _m(r, i, this.options);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = rv(tv, t);
		a && $_(e, this.options.renderer.getItemValue(e)), Z_.some(([e]) => rv(e, t)) && Q_(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || _m(r, i, this.options));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && rv(tv, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => rv(e.itemProperty, t)) || n.sorts.some((e) => rv(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${h}]`)) {
			let n = y(t);
			n === e && _m(t, n, this.options);
		}
	}
};
function rv(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
var iv = "bottom";
function av(e, t, n) {
	let r = e.querySelector(`:scope > [${Me}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Me, t), r.style.flexShrink = "0"), t === "top" ? e.firstChild !== r && e.insertBefore(r, e.firstChild) : e.lastChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-window-engine.ts
var ov = 50, sv = 1, cv = .5, lv = 60, uv = class {
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
			if (this.layout(t), hv(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = vv(e, Pe);
		t !== null && t !== 0 && Jh(e, dv(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.realign(e);
	}
	realign(e) {
		let t = vv(e, Pe), n = mv(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = qh(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		tm(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${h}][${De}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Kh(e.target);
		if (t === null || tm(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, lv));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && hv(e) > 0) return;
		let n = mv(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = vv(e, Pe), i = dv(e.getAttribute(Ie)), a = dv(e.getAttribute(Le));
		if (r !== null) {
			let o = this.windowSize(e), s = qh(e), c = Math.max(1, Math.round(s.height * sv / t.itemSize), Math.floor(o * cv)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, gv(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, gv(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = qh(e), s = Math.max(1, o.height * sv), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, gv(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, gv(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = vv(e, Fe);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = y(e);
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
				dynamicParameters: _v(e),
				anchor: t,
				offset: n,
				key: r ?? void 0,
				count: this.windowSize(e),
				extend: i
			});
			await this.options.applyChanges(o);
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
		let t = this.getState(e), n = mv(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			av(e, "top", 0), av(e, iv, 0);
			return;
		}
		if (n.length > 0) {
			let e = pv(n[n.length - 1]).bottom - pv(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / fv(n))));
		}
		let r = vv(e, Fe), i = vv(e, Pe), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		av(e, "top", a), av(e, iv, o);
	}
	windowSize(e) {
		let t = vv(e, Ne);
		return t !== null && t > 0 ? t : ov;
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
function dv(e) {
	return e !== null && e.toLowerCase() === "true";
}
function fv(e) {
	let t = pv(e[0]).top, n = 1;
	for (; n < e.length && pv(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function pv(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function mv(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function hv(e) {
	return mv(e).length;
}
function gv(e) {
	return e.getAttribute(m);
}
function _v(e) {
	let t = e.closest(Ot);
	return t === null ? [] : cn(t, sn(t));
}
function vv(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/state/value-equality.ts
function yv(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && bv(e, t) : xv(e, t);
}
function bv(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!yv(e[n], t[n])) return !1;
	return !0;
}
function xv(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !yv(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var Sv = [
	ie,
	ae,
	oe
];
function Cv(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, wv(c, e.itemRole);
	let l = Ev(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = Tv(l, t, n, a);
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
		d.className = l.wrapperClassName, wv(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), X_(d, r, n), c.appendChild(d);
	}
	return X_(c, r, n), o.registerItemScope(c, l, n), c;
}
function wv(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function Tv(e, t, n, r) {
	let i = ev(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function Ev(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of Sv) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), mn(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function Dv(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return i.renderer.renderItem(e, t, n, r);
	let s = Cv(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), s;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var Ov = 6, kv = 60, Av = class {
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
		let n = Uh(e) && Wh(e);
		this.project(e, t), this.layout(e, t), n && !Wh(e) && (Jh(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return;
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && yv(t.item, n)) {
				i.push(t);
				continue;
			}
			t?.element?.remove(), i.push({
				key: e,
				item: n,
				element: null,
				height: t?.height ?? null
			});
		}
		for (let e of r.values()) e.element?.remove();
		n.entries = i;
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
		let i = n.entries[r].element, a = e.parentElement, o = L(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Ri(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = J_(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Gp(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Yp(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => qp(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => Mv(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Zp(e.item, t.item, a))), t.projected = o.map((e) => ({
				id: e.key,
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = Mv(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Zp(e.item, t.item, a))), e !== "" && l.push({
				id: ` ${e}`,
				entry: t[0],
				header: !0
			});
			for (let e of t) l.push({
				id: e.key,
				entry: e,
				header: !1
			});
		}
		t.projected = l;
		for (let e of [...t.headers.keys()]) s.has(e) || (t.headers.get(e)?.element?.remove(), t.headers.delete(e));
	}
	handleScroll(e) {
		let t = Kh(e.target);
		if (t === null || tm(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, kv));
	}
	layout(e, t) {
		let n = t.projected, r = Pv(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (Nv(e) && a > 0) {
			let t = qh(e), n = t.top, r = n + t.height, c = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = c + i[e];
				if (o === a && t > n && (o = e), c >= r) {
					s = e;
					break;
				}
				c = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - Ov), s = Math.min(a, s + Ov);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(Mv(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), jv(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (jv(t, r, d), l.push(d), u = !0);
		}
		for (let t of L(e)) l.includes(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${we}]`)) l.includes(t) || (t.remove(), u = !0);
		let d = Fv(i, 0, o), f = Fv(i, s, a);
		nm(e, [...l, ...Hp(Up(e))]), av(e, "top", d > 0 ? d - r : 0), av(e, iv, f > 0 ? f - r : 0), Wp(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return Dv(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(we, ""), r);
	}
	measure(e, t, n, r) {
		let i = 0, a = 0, o = 0, s = 0;
		for (let c = n; c < r && c < t.length; c++) {
			let n = t[c], r = n.header ? e.headers.get(Mv(n.entry)) : n.entry, l = r?.element;
			if (r == null || l == null) continue;
			let u = l.getBoundingClientRect().height;
			u <= 0 || (r.height = u, n.header ? (o += u, s++) : (i += u, a++));
		}
		a > 0 && (e.itemEstimate = i / a), s > 0 && (e.headerEstimate = o / s);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(Mv(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = y(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = [], i = /* @__PURE__ */ new Map();
		for (let t of L(e)) {
			let e = t.getAttribute(m);
			e !== null && i.set(e, t);
		}
		let a = this.options.metadata.getItemValues(n);
		if (a.length > 0) for (let e of a) r.push({
			key: e.key,
			item: e.item,
			element: i.get(e.key) ?? null,
			height: null
		});
		else for (let [e, t] of i) r.push({
			key: e,
			item: this.options.renderer.getItemValue(t),
			element: t,
			height: null
		});
		let o = {
			componentId: n,
			entries: r,
			projected: [],
			headers: /* @__PURE__ */ new Map(),
			groupOrder: [],
			itemEstimate: 32,
			headerEstimate: 32,
			scheduled: 0,
			first: -1,
			last: -1
		};
		return this.states.set(e, o), o;
	}
};
function jv(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = Mv(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function Mv(e) {
	let t = Np(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function Nv(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function Pv(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function Fv(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var Iv = "data-ui-template", Lv = "default", Rv = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? Lv, r = this.findTemplate(e, n);
		return r === void 0 ? n === Lv ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${Iv}]`);
		for (let e of r) if (e.getAttribute(Iv) === t) return e;
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, xe);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Se);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
}, zv = "script[type='application/json'][data-ui-metadata]";
function Bv(e = document) {
	let t = e.querySelector(zv);
	if (t === null) return Vv();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return Vv();
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
function Vv() {
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
var Hv = "script[type='application/json'][data-ui-hydration]";
function Uv(e = document) {
	let t = e.querySelector(Hv)?.textContent?.trim() ?? "";
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
var Wv = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(Gv(Kv(e)));
	}
	async dispatchAsync(e) {
		let t = Kv(e), n = Gv(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		try {
			return await this.transport.processEventAsync(t);
		} finally {
			this.pendingKeys.delete(n);
		}
	}
};
function Gv(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function Kv(e) {
	return {
		eventId: en(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var qv = class {
	values = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t));
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n) {
		let r = this.createKey(e, t), i = this.values.get(r);
		return this.values.has(r) && yv(i, n) ? !1 : (this.values.set(r, n), !0);
	}
	clear() {
		this.values.clear();
	}
	createKey(e, t) {
		return `${_(e.componentId)}:${e.propertyId}:${Jv(t)}`;
	}
};
function Jv(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var Yv = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, Xv = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, W = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Zv = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Qv = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, $v = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, ey = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, ty = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, ny = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, ry = class {
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
var iy = class {
	constructor() {}
	log(e, t) {}
};
iy.instance = new iy();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var ay = "10.0.11", K = class {
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
function oy(e, t) {
	let n = "";
	return cy(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${sy(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function sy(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function cy(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function ly(e, t, n, r, i, a) {
	let o = {}, [s, c] = py();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${oy(i, a.logMessageContent)}.`);
	let l = cy(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function uy(e) {
	return e === void 0 ? new fy(G.Information) : e === null ? iy.instance : e.log === void 0 ? new fy(e) : e;
}
var dy = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, fy = class {
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
function py() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, my(ay, hy(), _y(), gy())];
}
function my(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function hy() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function gy() {
	if (q.isNode) return process.versions.node;
}
function _y() {
	return q.isNode ? "NodeJS" : "Browser";
}
function vy(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function yy() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var by = class extends ry {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(yy());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new W();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new W();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new Xv();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, cy(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new Yv(await xy(i, "text") || i.statusText, i.status);
		let a = await xy(i, e.responseType);
		return new ny(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function xy(e, t) {
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
var Sy = class extends ry {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new W()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (cy(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new W());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new ny(r.status, r.statusText, r.response || r.responseText)) : n(new Yv(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new Yv(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new Xv());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, Cy = class extends ry {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new by(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new Sy(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new W()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, wy = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
wy.RecordSeparatorCode = 30, wy.RecordSeparator = String.fromCharCode(wy.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var Ty = class {
	writeHandshakeRequest(e) {
		return wy.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (cy(e)) {
			let r = new Uint8Array(e), i = r.indexOf(wy.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(wy.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = wy.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var Ey = class {
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
		return this.observers.push(e), new dy(this, e);
	}
}, Dy = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			cy(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new Oy(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, cy(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, Oy = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, ky = 3e4, Ay = 15e3, jy = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var My = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? ky, this.keepAliveIntervalInMilliseconds = a ?? Ay, this._statefulReconnectBufferSize = o ?? jy, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new Ty(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new Dy(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new W("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new Ey();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${vy(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${vy(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new W("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${vy(t)}`);
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
}, Ny = [
	0,
	2e3,
	1e4,
	3e4,
	null
], Py = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? Ny : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, Fy = class {};
Fy.Authorization = "Authorization", Fy.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var Iy = class extends ry {
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
		e.headers ||= {}, this._accessToken ? e.headers[Fy.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[Fy.Authorization] && delete e.headers[Fy.Authorization];
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
var Ly = class {
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
}, Ry = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new Ly(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = py(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new Yv(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${oy(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new Yv(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof Xv ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? ly(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = py();
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
			i ? i instanceof Yv && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, zy = class {
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
				let [r, i] = py();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${oy(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? ly(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, By = class {
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
				let t = {}, [r, i] = py();
				t[r] = i, n && (t[Fy.Authorization] = `Bearer ${n}`), o && (t[Fy.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${oy(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${oy(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, Vy = 100, Hy = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = uy(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new Iy(n.httpClient || new Cy(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new W(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new W(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new Wy(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new W("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < Vy);
				if (r === Vy && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof Ry && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = py();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new ey("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof Yv && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new ey(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new $v(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new W(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new ty(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new By(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new zy(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new Ry(this._httpClient, this._logger, this._options);
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
		if (Uy(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new Zv(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new Qv(`'${X[i]}' is disabled by the client.`, i);
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
function Uy(e, t) {
	return !e || (t & e) !== 0;
}
var Wy = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new Gy(), this._transportResult = new Gy(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new Gy(), this._transportResult.promise;
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
			this._sendBufferedData = new Gy();
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
}, Gy = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, Ky = "json", qy = class {
	constructor() {
		this.name = Ky, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = iy.instance);
		let n = wy.parse(e), r = [];
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
		return wy.write(JSON.stringify(e));
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
}, Jy = {
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
function Yy(e) {
	let t = Jy[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var Xy = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), Zy(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = Yy(e);
			this.logger = new fy(t);
		} else this.logger = new fy(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new Py(e) : e : new Py(), this;
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
		let t = new Hy(this.url, e);
		return My.create(t, this.logger || iy.instance, this.protocol || new qy(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function Zy(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/signalr-transport.ts
var Qy = 500, $y = class {
	windowId;
	connection;
	started = !1;
	currentState = "Disconnected";
	attached;
	markAttached = () => {};
	failAttachGate = () => {};
	constructor(e, t = {}) {
		this.windowId = e, this.attached = this.createAttachGate(), this.connection = new Xy().withUrl(t.hubUrl ?? "/_ui/hub").withAutomaticReconnect([...t.reconnectDelays ?? [
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
			this.currentState = "Reconnecting", this.attached = this.createAttachGate(), e(t);
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
		if (!(this.started || this.connection.state !== Y.Disconnected)) try {
			this.currentState = "Connecting", await this.connection.start(), this.started = !0, this.currentState = "Connected", l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, this.currentState = "Disconnected", c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== Y.Disconnected && (await this.connection.stop(), this.started = !1, this.currentState = "Disconnected");
	}
	async attachAsync(e) {
		try {
			let t = await this.invokeCoreAsync("AttachAsync", e);
			return this.markAttached(), t;
		} catch (e) {
			throw this.failAttachGate(e), this.attached = this.createAttachGate(), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", e);
	}
	async processChangeSetAsync(e) {
		return await this.invokeAsync("ProcessChangeSetAsync", e);
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", { theme: e });
	}
	async requestItemWindowAsync(e) {
		return await this.invokeAsync("RequestItemWindowAsync", e);
	}
	async invokeAsync(e, ...t) {
		let n = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), Qy);
		try {
			await this.attached;
		} finally {
			window.clearTimeout(n);
		}
		return await this.invokeCoreAsync(e, ...t);
	}
	async invokeCoreAsync(e, ...t) {
		return await this.ensureConnectedAsync(), await this.connection.invoke(e, ...t);
	}
	createAttachGate() {
		let e = new Promise((e, t) => {
			this.markAttached = e, this.failAttachGate = t;
		});
		return e.catch(() => {}), e;
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
}, eb = "/_ne/values";
function tb(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function nb(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function rb(e) {
	if (e === void 0 || !nb(e)) return e;
	let t = await Promise.all((e.updates ?? []).map(async (e) => {
		let t = e.valueToken;
		if (typeof t != "string") return e;
		let n = await fetch(`${eb}/${encodeURIComponent(t)}`, { credentials: "same-origin" });
		if (!n.ok) throw Error(`Fetching a staged value failed with status ${n.status}.`);
		let { valueToken: r, ...i } = e;
		return {
			...i,
			value: await n.json()
		};
	}));
	return {
		...e,
		updates: t
	};
}
async function ib(e) {
	let t = await fetch(eb, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin"
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var ab = class {
	transport;
	constructor(e) {
		this.transport = e;
	}
	async dispatchAsync(e) {
		let t = tb(e.value);
		if (t === null) return await this.transport.processChangeSetAsync({ updates: [e] });
		let n = await ib(t);
		return await this.transport.processChangeSetAsync({ updates: [{
			componentId: e.componentId,
			propertyName: e.propertyName,
			dynamicParameters: e.dynamicParameters,
			valueToken: n
		}] });
	}
}, ob = document;
function sb() {
	try {
		return ob.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/effect-registry.ts
var cb = "data-ui-theme", lb = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Jt(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Jt(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = vb(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = Qt(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute(cb) !== n && document.documentElement.setAttribute(cb, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = db(e);
			t !== null && mb(t);
		}), this.register("ScrollTo", (e) => {
			let t = db(e);
			if (t === null) return;
			let n = e.effect, r = Yt(n.behavior), i = Xt(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = db(e);
			if (t === null) return;
			let n = e.effect, r = $t(n.axis) !== "Horizontal", i = fb(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Zt(n.position), u;
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
			let d = Yt(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			ub(db(e), null);
		}), this.register("Hide", (e) => {
			ub(db(e), "hidden");
		}), this.register("Collapse", (e) => {
			ub(db(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = hb(e, this.valueReaders);
			t !== null && gb(t).catch((e) => s("copy to clipboard failed.", e));
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
function ub(e, t) {
	if (e !== null) for (let n of Et) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function db(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(_(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function fb(e, t) {
	if (pb(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (pb(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (pb(n, t)) return n;
	return null;
}
function pb(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function mb(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Br))) {
		e.focus();
		return;
	}
	let t = e.querySelector(Br);
	if (t instanceof HTMLElement) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function hb(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = db(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Cn(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : vn(t.readHeld(r));
}
async function gb(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!_b(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function _b(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return sb();
	} finally {
		t.remove();
	}
}
function vb(e) {
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
//#region src/rendering/web-dom-converters.ts
var yb = /* @__PURE__ */ new Map([
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
]), bb = [
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
function xb(e) {
	return Q(e, bb);
}
var Sb = [
	"small",
	"medium",
	"large"
], Cb = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], wb = [
	"start",
	"center",
	"end",
	"justify"
], Tb = ["nowrap", "wrap"], Eb = /* @__PURE__ */ new Map([
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
]), Db = ["inline", "trailing"], Ob = [
	"filled",
	"outline",
	"underline",
	"ghost"
], kb = [
	"small",
	"medium",
	"large"
], Ab = [
	"small",
	"medium",
	"large"
], jb = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], Mb = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], Nb = ["light", "dark"], Pb = [
	"start",
	"center",
	"end",
	"stretch"
], Fb = ["clip", "visible"], Ib = [
	"visible",
	"hidden",
	"collapsed"
], Lb = [
	"background",
	"raised",
	"tinted"
], Rb = ["horizontal", "vertical"], zb = [
	"none",
	"gap",
	"rule"
], Bb = [
	"none",
	"one",
	"many"
], Vb = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], Hb = ["stack", "wrap"], Ub = [
	"disabled",
	"auto",
	"always"
], Wb = [
	"disabled",
	"proximity",
	"mandatory"
], Gb = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Kb = ["hex", "rgb"], qb = ["field", "swatch"], Jb = [
	"fill",
	"contain",
	"cover",
	"none"
], Yb = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Xb = ["linear", "circular"], Zb = ["keep", "replace"], Qb = [
	"none",
	"vertical",
	"horizontal",
	"both"
], $b = [
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
], ex = [
	"None",
	"Shade",
	"Tint"
], tx = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, bb)}`],
	["themeColorClass", (e) => yx(e)],
	["iconClass", (e) => Ax(e)],
	["iconUrlCss", (e) => _g(e)],
	["safeUrl", (e) => Eg(e)],
	["safeImageSource", (e) => Dg(e)],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, Sb)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, Cb)}`],
	["textAppearanceClass", (e) => Sx(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, wb)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, Tb)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, Db)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, Mb)}`],
	["badgeTextFit", (e) => bx(e)],
	["buttonClass", (e) => `ui-button--${Q(e, jb)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, Lb)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, Rb)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, zb)}`],
	["selectionModeAttribute", (e) => Q(e, Bb)],
	["selectionBackgroundCss", (e) => _x(mx(e, "background"))],
	["selectionForegroundCss", (e) => _x(mx(e, "foreground"))],
	["selectionMarkColorCss", (e) => _x(mx(e, "markColor"))],
	["selectionMarkCss", (e) => gx(mx(e, "mark"))],
	["selectionFontWeightCss", (e) => hx(mx(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, Hb)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, Ub)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, Ub)}`],
	["hostViewport", (e) => sx(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, Wb)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, Ob)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, Ab)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, kb)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, kb)}`],
	["textInputTypeAttribute", (e) => Q(e, Gb)],
	["colorTextFormatAttribute", (e) => Q(e, Kb)],
	["colorInputVariantAttribute", (e) => Q(e, qb)],
	["themeNameCss", (e) => Q(e, Nb)],
	["alignmentCss", (e) => Q(e, Pb)],
	["alignmentStretchFallbackCss", (e) => Q(e, Pb) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, Fb)],
	["layoutLengthCss", (e) => cx(e)],
	["thicknessCss", (e) => lx(e)],
	["radiusCss", (e) => ux(e)],
	["gridUnitCss", (e) => dx(e)],
	["pixelsCss", (e) => Mx(e)],
	["gridTemplateCss", (e) => fx(e)],
	["colorVariantCss", (e) => Ex(e)],
	["themeColorCss", (e) => _x(e)],
	["themeColorInlineCss", (e) => vx(e) ? "" : _x(e)],
	["themeColorCanonical", (e) => wx(e)],
	["textAppearanceFontSizeCss", (e) => Cx(e, "size")],
	["textAppearanceFontWeightCss", (e) => Cx(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Cx(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Cx(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => cx(N(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => cx(N(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => cx(N(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => cx(N(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => cx(N(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => lx(N(e, "base"))],
	["responsiveThicknessSmCss", (e) => lx(N(e, "sm"))],
	["responsiveThicknessMdCss", (e) => lx(N(e, "md"))],
	["responsiveThicknessXlCss", (e) => lx(N(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => lx(N(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => Nx(N(e, "base"))],
	["responsivePixelsSmCss", (e) => Nx(N(e, "sm"))],
	["responsivePixelsMdCss", (e) => Nx(N(e, "md"))],
	["responsivePixelsXlCss", (e) => Nx(N(e, "xl"))],
	["responsivePixelsXxlCss", (e) => Nx(N(e, "xxl"))],
	["visibilityBaseAttribute", (e) => Px(e, "base")],
	["visibilitySmAttribute", (e) => Px(e, "sm")],
	["visibilityMdAttribute", (e) => Px(e, "md")],
	["visibilityXlAttribute", (e) => Px(e, "xl")],
	["visibilityXxlAttribute", (e) => Px(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, Jb)}`],
	["backgroundImageCss", (e) => nx(e)],
	["imageFitSizeCss", (e) => Q(e, Yb)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, Xb)}`],
	["progressValueText", (e) => jx(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, Zb)}`],
	["textAreaResizeCss", (e) => Q(e, Qb)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, $b)}`],
	["popupPlacementAttribute", (e) => Q(e, $b)]
]);
function nx(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : vg(t);
}
var rx = [
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
], ix = new Map(rx.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), ax = new Map(rx.map(([e, t]) => [e, t])), ox = /* @__PURE__ */ new Map([[Fb, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : ox.get(t)?.get(e)) ?? yb.get(e) ?? At(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function sx(e) {
	return e == null || Q(e, Ub) === "disabled" ? void 0 : "parent";
}
function cx(e) {
	if (e == null) return "";
	if (typeof e == "number") return Mx(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Mx(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function lx(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function ux(e) {
	if (e == null) return "";
	if (typeof e == "number") return Mx(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Mx(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function dx(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Mx(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function fx(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return dx(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return dx(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${dx(e[0])})` : e.map((e) => dx(e)).join(" ");
}
function $(e, t, n) {
	return px(N(e, t), n);
}
function px(e, t) {
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
function mx(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function hx(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function gx(e) {
	if (e == null) return "";
	switch (Q(e, Vb)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function _x(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Tx(e)) return Ex(e);
	let t = e, n = Ex(t.light), r = Ex(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = Eb.get(Q(o, bb));
	return s ? `var(${s})` : "";
}
function vx(e) {
	if (typeof e != "object" || !e || Tx(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function yx(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, bb)}`;
}
function bx(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function xx(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", bx(n));
}
function Sx(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, Cb)}`;
}
function Cx(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Mx(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Mx(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Mx(e);
		}
		default: return "";
	}
}
function wx(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Dx(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${F(r.rgb >> 16 & 255)}${F(r.rgb >> 8 & 255)}${F(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${F(e)}`;
	}
	let i = Ox(r.name);
	return i === null ? "" : `${i}/${kx(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Tx(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Ex(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Ox(t.name), i = n ?? (r === null ? void 0 : ix.get(r));
	if (!i) return "";
	let a = kx(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = P(c * (1 - o)), l = P(l * (1 - o)), u = P(u * (1 - o))) : a === "Tint" && (c = P(c + (255 - c) * o), l = P(l + (255 - l) * o), u = P(u + (255 - u) * o)), `#${F(c)}${F(l)}${F(u)}${F(s)}`;
}
function Dx(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = bb[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Ox(e) {
	if (typeof e == "number") return ax.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function kx(e) {
	if (typeof e == "number") return ex[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Ax(e) {
	let t = hg(e);
	return t === null ? Cg(e) : t.tinted ? "" : mg;
}
function jx(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Mx(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Nx(e) {
	return e == null ? "" : Mx(e);
}
function Px(e, t) {
	let n = Au(e, t);
	if (n == null) return;
	let r = Q(n, Ib);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var Fx = "ui-notification-host", Ix = "ui-notification", Lx = "ui-notification--leaving", Rx = "ui-notification__message", zx = "ui-notification__close", Bx = 5e3, Vx = 160, Hx = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), Ux = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? Bx;
	}
	show(e) {
		let t = xb(e.severity), n = document.createElement("div");
		n.className = Hx.has(t) ? `${Ix} ${Ix}--${t}` : Ix, n.setAttribute("role", t === "danger" ? "alert" : "status"), n.setAttribute("aria-live", t === "danger" ? "assertive" : "polite");
		let r = document.createElement("span");
		r.className = Rx, r.textContent = e.message;
		let i = document.createElement("button");
		i.type = "button", i.className = zx, i.setAttribute("aria-label", b.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(r, i), this.ensureHost().append(n);
		let a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		return n.addEventListener("mouseenter", () => window.clearTimeout(a)), n.addEventListener("mouseleave", () => {
			a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		}), n;
	}
	dismiss(e) {
		!e.isConnected || e.classList.contains(Lx) || (e.classList.add(Lx), window.setTimeout(() => {
			e.remove(), this.host !== null && this.host.childElementCount === 0 && (this.host.remove(), this.host = null);
		}, Vx));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${Fx}`);
		if (t !== null) return this.host = t, t;
		let n = document.createElement("div");
		return n.className = Fx, e.append(n), this.host = n, n;
	}
}, Wx = class {
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
		!this.state.set(e, t, n) && !this.restoring || a || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: n,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	recordSentValue(e, t, n) {
		this.state.set(e, t, n);
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(he)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			Dn(e);
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
		for (let t of this.valueChangeHandlers) t(e);
	}
}, Gx = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = Kx(_(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = Kx(_(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function Kx(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/updates/collection-sinks.ts
var qx = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	has(e) {
		return this.handlers.has(e);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function Jx(e, t, n, r) {
	return {
		action: Gt(e.action),
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
var Yx = class {
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
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = y(e);
			if (t !== null) for (let n of this.metadata.getItemValues(t)) this.registerItemValue(e, n.key, n.item);
		}
		for (let t of e?.updates ?? []) {
			if (qt(t) !== "CollectionChange") continue;
			let e = t;
			if (Gt(e.action) !== "Insert") continue;
			let n = this.findItemsHost(_(e.component?.id), e.component?.dynamicParameters ?? []);
			if (n !== null) for (let t of e.items ?? []) this.registerItemValue(n, t.key, t.item);
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = tS(e, t);
		r !== null && this.itemsRenderer.registerItemScope(r, eS(r), n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = y(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		_m(e, t, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer,
			state: this.state,
			virtualization: this.virtualization
		});
	}
	applyChangeSet(e) {
		let t = e?.updates;
		if (t !== void 0 && t.length !== 0) for (let e = 0; e < t.length; e++) {
			let n = t[e], r = Qx(n, t[e + 1]);
			if (r === null || this.namesSink(r)) {
				this.applyUpdate(n);
				continue;
			}
			this.applyCollectionRefill(r), e++;
		}
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(ye) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.findItemsHost(e.componentId, e.dynamicParameters);
		if (t === null) {
			s("items host was not found for a collection refill.", e.items);
			return;
		}
		if (tm(t) === "virtualized") {
			this.virtualization.refill(t, e.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			}))), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(t), r = /* @__PURE__ */ new Map();
		for (let e of L(t)) {
			let t = e.getAttribute(m);
			t !== null && r.set(t, e);
		}
		let i = [];
		for (let t of e.items) {
			let a = t.key ?? null;
			if (a === null) {
				s("collection insert carried no item key.", t);
				continue;
			}
			let o = r.get(a) ?? null;
			if (r.delete(a), o !== null && yv(this.readItemValue(o), t.item)) {
				i.push(o);
				continue;
			}
			let c = this.renderItemElement(e.componentId, t.item, a, n);
			o?.remove(), c !== null && i.push(c);
		}
		for (let e of r.values()) e.remove();
		$x(t, i), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (qt(e)) {
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
		let t = _(e.address?.component?.id), n = Kt(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (_(e.address?.component?.id) <= 0) {
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
		let t = _(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, Jx(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		let a = this.findItemsHost(t, n);
		if (a === null) {
			(Gt(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		if (tm(a) === "virtualized") {
			this.applyVirtualizedCollectionChange(a, e), this.syncItemsHost(a, t), this.dom.invalidate();
			return;
		}
		switch (Gt(e.action)) {
			case "Insert":
				this.applyCollectionInsert(a, t, e.items ?? []);
				break;
			case "Remove":
				Xx(a, e.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(a, t, e.items ?? []);
				break;
			case "Move":
				Zx(a, e.moves ?? []);
				break;
			case "Reset":
				a.replaceChildren(), um(a);
				break;
			default:
				s("collection update action is not supported.", e);
				return;
		}
		this.syncItemsHost(a, t), this.dom.invalidate();
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Gt(t.action)) {
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
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t.item;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n)?.item;
	}
	findItemsHost(e, t) {
		let n = this.dom.findComponent(e, t);
		if (n === null) return null;
		for (let t of n.querySelectorAll(`[${h}]`)) if (y(t) === e) return t;
		return null;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = im(e, L(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, om(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return Dv(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = im(e, L(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", a);
				continue;
			}
			let o = tS(e, a.oldKey ?? n), c = this.renderItemElement(t, a.item, n, r);
			c !== null && (o === null ? e.insertBefore(c, om(i, c, a.index ?? null)) : (lm(i, o, c), o.replaceWith(c)));
		}
	}
};
function Xx(e, t) {
	let n = im(e, L(e)), r = e.parentElement, i = r === null ? [] : L(e).filter((e) => e instanceof HTMLElement);
	for (let a of t) {
		let t = a.key === null || a.key === void 0 ? null : tS(e, a.key);
		if (t === null) {
			s("collection remove did not resolve an item.", a);
			continue;
		}
		let o = r !== null && t instanceof HTMLElement ? Ri(r, i, t) : null;
		sm(n, t), t.remove(), i = i.filter((e) => e !== t), o?.();
	}
}
function Zx(e, t) {
	let n = im(e, L(e));
	for (let r of t) {
		let t = r.key === null || r.key === void 0 ? null : tS(e, r.key);
		if (t === null) {
			s("collection move did not resolve an item.", r);
			continue;
		}
		e.insertBefore(t, cm(n, t, r.newIndex ?? null));
	}
}
function Qx(e, t) {
	if (t === void 0 || qt(e) !== "CollectionChange" || qt(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (Gt(n.action) !== "Reset" || Gt(r.action) !== "Insert") return null;
	let i = _(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== _(r.component?.id) || !yv(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function $x(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? L(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function eS(e) {
	let t = mn(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : mn(n);
}
function tS(e, t) {
	return e.querySelector(`:scope > [${m}="${kt(t)}"]`);
}
//#endregion
//#region src/interactions/validation-engine.ts
var nS = "ui-invalid", rS = "ui-validation--warning", iS = "ui-validation--info", aS = "data-ui-validation-message", oS = "ui-validation-message--marker", sS = "data-ui-tooltip", cS = "data-ui-tooltip-placement", lS = "data-ui-tooltip-mark", uS = "top-end", dS = "--ui-validation-marker-host", fS = "ui-validation-mark", pS = "--ui-validation-presentation", mS = "--ui-validation-color", hS = "Validation", gS = {
	Error: 0,
	Warning: 1,
	Info: 2
}, _S = {
	Error: nS,
	Warning: rS,
	Info: iS
}, vS = `.${nS}, .${rS}, .${iS}`, yS = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, bS = {
	Error: `${fS}--error`,
	Warning: `${fS}--warning`,
	Info: `${fS}--info`
}, xS = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(vS)), w(this.root, vS, { childList: !0 }, (e) => this.applyRenderedMessages(e));
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			let e = t.querySelector(`:scope > [${aS}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && ES(this.markerMirrors, t, e, {
				message: n,
				severity: CS(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === hS) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = _(e.reference.componentId), n = SS(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = _(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Vt(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = _(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: wS(e.severity)
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		TS(this.markerMirrors, t, n), this.writeMessageElsewhere(e, n);
	}
	writeMessageElsewhere(e, t) {
		let n = this.options.metadata.getValidationTarget(e);
		if (n === void 0) return;
		let r = `${_(n.message.componentId)}:${n.message.propertyId}`, i = this.messageLines.get(r);
		if (t !== void 0) i === void 0 && (i = /* @__PURE__ */ new Map(), this.messageLines.set(r, i)), i.set(e, t.message);
		else {
			if (i === void 0 || !i.delete(e)) return;
			i.size === 0 && this.messageLines.delete(r);
		}
		for (let e of [...i.keys()]) this.root.querySelector(`[data-ui-id="${e}"]`) === null && i.delete(e);
		this.options.propertyPatchEngine.applyPropertyValue(n.message, [], [...i.values()].join("\n"), !0);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i);
		let a = this.failingRulesByElement.get(t);
		if (a !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) a.has(t) && n.push({
			message: t.message,
			severity: wS(t.severity)
		});
		let o;
		for (let e of n) (o === void 0 || gS[e.severity] < gS[o.severity]) && (o = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Vt(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${Re}="${kt(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Vt(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && wS(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Yn(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function SS(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.message == "string" ? t.message : "";
	return n.length === 0 ? void 0 : {
		message: n,
		severity: wS(t.severity)
	};
}
function CS(e) {
	return e.classList.contains(rS) ? "Warning" : e.classList.contains(iS) ? "Info" : "Error";
}
function wS(e) {
	let t = Ht(e);
	return t === "Unknown" ? "Error" : t;
}
function TS(e, t, n) {
	for (let e of Object.values(_S)) t.classList.toggle(e, n !== void 0 && _S[n.severity] === e);
	let r = t;
	n === void 0 ? r.style.removeProperty(mS) : r.style.setProperty(mS, `var(--ui-color-${yS[n.severity]})`);
	let i = t.querySelector(`[${aS}]`);
	i !== null && (i.textContent = n?.message ?? "", ES(e, r, i, n));
}
function ES(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(pS).trim() === "marker";
	if (n.classList.toggle(oS, a), r !== void 0 && a) {
		n.setAttribute(sS, r.message), n.setAttribute(cS, uS), t.setAttribute(lS, ""), DS(e, t, r, i.getPropertyValue(dS).trim()), t.contains(document.activeElement) ? L_(n) : R_(n);
		return;
	}
	n.removeAttribute(sS), n.removeAttribute(cS), t.removeAttribute(lS), DS(e, t, void 0, ""), R_(n);
}
function DS(e, t, n, r) {
	let i = e.get(t), a = n === void 0 || r.length === 0 ? null : OS(t, r);
	if (n === void 0 || a === null) {
		i?.remove(), e.delete(t);
		return;
	}
	let o = i ?? document.createElement("span");
	o.className = `${fS} ${bS[n.severity]}`, o.textContent = n.message, o.setAttribute(sS, n.message), o.setAttribute(cS, uS), o.parentElement !== a && a.append(o), e.set(t, o), R_(o);
}
function OS(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var kS = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, AS = /* @__PURE__ */ new WeakMap(), jS = /* @__PURE__ */ new WeakMap(), MS = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ut(e), t);
	}
	apply(e) {
		let t = Ut(e.operation.kind), n = this.handlers.get(t);
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
			let t = vn(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t);
		}), this.register("Markup", (e) => {
			Rg(e.target, x(e.convertedValue) ? "" : vn(e.convertedValue));
		}), this.register("Attribute", (e) => {
			let t = zS(e.operation);
			if (x(e.value) || x(e.convertedValue)) {
				RS(e.target, t);
				return;
			}
			LS(e.target, t, vn(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			RS(e.target, zS(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = zS(e.operation), n = !x(e.value) && NS(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (x(e.convertedValue) ? "" : vn(e.convertedValue));
			PS(e.target, IS(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !x(e.value) && NS(e.value, e.operation.condition ?? "None") ? vn(e.convertedValue).trim() : "";
			FS(e.target, IS(e), t);
		}), this.register("ToggleClass", (e) => {
			let t = zS(e.operation), n = !x(e.value) && NS(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? vn(e.convertedValue).trim() : "";
				FS(e.target, IS(e), t);
			}
		}), this.register("Style", (e) => {
			let t = zS(e.operation), n = e.target;
			if (x(e.value) || x(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = vn(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = zS(e.operation), n = e.target, r = x(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function NS(e, t) {
	switch (Wt(t)) {
		case "None": return !0;
		case "HasValue": return !x(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !x(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !x(e);
	}
}
function PS(e, t, n, r, i) {
	let a = jS.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), jS.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), LS(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && RS(e, n);
}
function FS(e, t, n) {
	let r = AS.get(e);
	r === void 0 && (r = /* @__PURE__ */ new Map(), AS.set(e, r));
	let i = r.get(t);
	if (i === n) {
		n.length > 0 && !e.classList.contains(n) && e.classList.add(n);
		return;
	}
	if (i !== void 0 && i.length > 0 && e.classList.remove(i), n.length === 0) {
		r.delete(t);
		return;
	}
	e.classList.add(n), r.set(t, n);
}
function IS(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function LS(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function RS(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function zS(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var BS = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => tx.has(e.name),
			convert: (e) => tx.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = VS(e.name), n = {
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
function VS(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var HS = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = v(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = v(e.domEventName) || t;
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
		return this.definitions.get(v(e));
	}
};
function US(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function WS(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => US(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => US(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var GS = class {
	converters = new BS();
	events = new HS();
	operations = new MS();
	valueReaders;
	collectionSinks = new qx();
	rowDecorators = new kS();
	constructor(e, t, n, r) {
		WS(this.events), this.valueReaders = new bn(r);
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
}, KS = "Submenu", qS = "ui-menu__submenu", JS = "Select", YS = {
	kind: "menu",
	decorate: XS
};
function XS(e) {
	if (!ZS(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, KS);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Ve, ""), QS(e.item, "Kind") === JS && e.row.setAttribute(He, ""), QS(e.item, "Expanded") === !0 && e.row.setAttribute(Ue, "");
	let r = document.createElement("div");
	r.className = qS, r.appendChild(n), X_(r, e.key, e.item), e.row.appendChild(r);
}
function ZS(e) {
	let t = QS(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function QS(e, t) {
	let n = Np(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/rendering/number-format.ts
var $S = {
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
}, eC = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], tC = [
	"$n",
	"n$",
	"$ n",
	"n $"
], nC = [
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
], rC = [
	"n %",
	"n%",
	"%n",
	"% n"
], iC = [
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
function aC(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return $S;
	try {
		return {
			...$S,
			...JSON.parse(t)
		};
	} catch {
		return $S;
	}
}
function oC(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = sC(t);
	if (r === null) return cC(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = lC(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? fC(eC[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = lC(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(uC(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = lC(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return fC(i ? nC[n.currencyNegativePattern] ?? "-$n" : tC[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = lC(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return fC(i ? iC[n.percentNegativePattern] ?? "-n %" : rC[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return cC(e, n);
	}
}
function sC(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function cC(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function lC(e, t, n, r, i) {
	let a = String(uC(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? dC(o, n, r) : `${dC(o, n, r)}${i}${s}`;
}
function uC(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function dC(e, t, n) {
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
function fC(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var pC = {
	readCulture: aC,
	format: oC
}, mC = "ne.standard.ui.windowId", hC = [
	500,
	1e3,
	2e3
], gC = [
	({ root: e }) => new Ci({ root: e }),
	({ root: e }) => new Sa({ root: e }),
	({ root: e, dom: t, propertyPatchEngine: n }) => new Ra({
		root: e,
		dom: t,
		propertyPatchEngine: n
	}),
	({ root: e }) => new Va({ root: e }),
	({ root: e }) => new Wa({ root: e }),
	({ root: e }) => new no({ root: e }),
	({ root: e }) => new Ho({ root: e }),
	({ root: e }) => new po({ root: e }),
	({ root: e }) => new qo({ root: e }),
	({ root: e }) => new Cm({ root: e }),
	({ root: e, propertyPatchEngine: t, dom: n }) => new as({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t }) => new _s({
		root: e,
		propertyPatchEngine: t
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new Nf({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t }) => new Fc({
		root: e,
		propertyPatchEngine: t
	}),
	({ root: e, effects: t, dom: n }) => new yl({
		root: e,
		effects: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t }) => new wh({
		root: e,
		propertyPatchEngine: t
	}),
	({ root: e }) => new El({ root: e }),
	({ root: e }) => new xd({ root: e }),
	({ root: e }) => new Ba({ root: e }),
	({ root: e }) => new Od({ root: e }),
	({ root: e }) => new $l({ root: e }),
	({ root: e }) => new wu({ root: e }),
	({ root: e }) => new _u({ root: e }),
	({ root: e }) => new od({ root: e }),
	({ root: e }) => new Md({ root: e }),
	({ root: e }) => new Zd({ root: e }),
	({ root: e, effects: t }) => new oh({
		root: e,
		effects: t
	}),
	({ root: e }) => new rf({ root: e }),
	({ root: e }) => new Hh({ root: e }),
	({ root: e }) => new tg({ root: e }),
	({ root: e }) => new $r({ root: e }),
	({ root: e }) => new mh({ root: e }),
	({ root: e }) => C_(e),
	({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new fg({ root: e }) : void 0
], _C = class {
	windowId;
	options;
	root;
	metadata = new Pt(Bv());
	hydration = Uv();
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
	inbound = null;
	enginesAwaitingHydration = [];
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = xC(e.windowIdStorageKey ?? mC), this.dom = new pn(this.root), b.load(this.root), e.strings !== void 0 && b.register(e.strings), this.extensions = new GS(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(YS);
		let t = new an(this.dom, this.metadata), n = this.extensions.operations, r = new qv(), i = new Wx(t, n, this.extensions, r);
		this.reactiveSources = new Gx(i), this.dialogs = new Fl({ root: this.root }), this.notifications = new Ux({ root: this.root }), this.effects = new lb({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new Qn(this.metadata), o, u = new Gn(a, i, new Jn(), {
			effects: this.effects,
			dom: this.dom,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(_(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new Rv(this.dom), f = new q_(this.metadata, d, this.extensions, n, r);
		this.virtualization = new Av({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new Yx(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), new nv({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			valueReaders: this.extensions.valueReaders,
			virtualization: this.virtualization
		}), this.transport = new $y(this.windowId, e.signalR), this.dispatcher = new Wv(this.transport);
		let p = new ab(this.transport);
		o = new In({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			applyChanges: (e) => this.applyChanges(e),
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordSentValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(Nt.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new xS({
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
		for (let e of gC) e(this.engineContext);
		new Hm({
			root: this.root,
			effects: this.effects,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.eventPipeline = new Vn({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			applyChanges: (e) => this.applyChanges(e),
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: u,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: ee,
			valueBinding: o
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...a.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.tables = new xp({ root: this.root }), this.windows = new uv({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e),
			applyChanges: (e) => this.applyChanges(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: b,
			observeComponents: w,
			observeSize: tp,
			dialogs: this.dialogs,
			store: new au(),
			numbers: pC,
			temporal: Ns,
			icons: { apply: xg },
			badges: { writeCount: xx },
			values: {
				read: (e) => this.extensions.valueReaders.readHeld(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				}
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(Ot), a = r === null ? void 0 : this.metadata.getExposedProperty(mn(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: I_,
			renames: { open: bm },
			tables: this.tables,
			rows: K_(d, f, this.virtualization),
			uploads: mi,
			selection: ra,
			popups: G_,
			roving: Ei
		}, this.transport.onChanges((e) => this.applyChanges(e)), this.transport.onCommandResult((e) => {
			Promise.resolve(this.applyChanges(e.changes)).then(() => {
				this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider();
			});
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e);
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => {
			e !== void 0 && c("SignalR connection closed.", e);
		});
	}
	reloadForView(e) {
		if (TC() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), EC(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ee(this, this.options.handlerGlobalKey), await bC(), this.hydrate(), this.startEnginesAwaitingHydration(), await this.transport.startAsync(), await this.attachAsync();
	}
	hydrate() {
		this.hydration !== null && (this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(this.hydration.changes), this.applyChanges(this.hydration.changes), this.updateProcessor.initializeItemsHosts(), l("runtime hydrated from the page.", { pageId: this.hydration.pageId }));
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) t(this.pluginContext);
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
		b.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		e(this.pluginContext);
	}
	applyChanges(e) {
		if (this.inbound === null && !nb(e)) {
			this.applyNow(e);
			return;
		}
		let t = (this.inbound ?? Promise.resolve()).then(() => rb(e)).then((e) => this.applyNow(e)).catch((e) => {
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
		if (this.attachTask !== null) return this.attachTask;
		this.attachTask = this.attachCoreAsync();
		try {
			await this.attachTask;
		} finally {
			this.attachTask = null;
		}
	}
	async attachCoreAsync() {
		let e = await this.attachWithRetryAsync();
		if (e !== null) {
			if (e.reload === !0) {
				this.reloadForView(this.hydration?.view ?? "");
				return;
			}
			DC(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(e.initialChanges), await this.applyChanges(e.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), l("runtime attached.", {
				windowId: this.windowId,
				instanceId: this.instanceId
			});
		}
	}
	async attachWithRetryAsync() {
		let e = {
			clientWindowId: this.windowId,
			route: window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: CC(window.location.search)
		};
		for (let t = 0;; t++) try {
			return await this.transport.attachAsync(e);
		} catch (e) {
			if (t >= hC.length) return c("attaching the runtime failed after retrying; giving up until the next reconnect.", e), null;
			s("attaching the runtime failed; retrying.", {
				attempt: t + 1,
				error: e
			}), await yC(hC[t]);
		}
	}
};
async function vC(e = {}) {
	let t = new _C(e);
	return await t.startAsync(), t;
}
function yC(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function bC() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function xC(e) {
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
	let n = SC();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function SC() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function CC(e) {
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
var wC = "ne-standard-ui:reloaded-view";
function TC() {
	try {
		return sessionStorage.getItem(wC);
	} catch {
		return null;
	}
}
function EC(e) {
	try {
		sessionStorage.setItem(wC, e);
	} catch {}
}
function DC() {
	try {
		sessionStorage.removeItem(wC);
	} catch {}
}
p(), vC().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
