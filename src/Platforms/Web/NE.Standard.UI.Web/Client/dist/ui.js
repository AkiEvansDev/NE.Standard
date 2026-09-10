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
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], o = e.__pendingValueReaders ?? [], s = e.__pendingCollectionSinks ?? [], c = e.__pendingStrings ?? [], l = e.__pendingEngines ?? [], u = {
		...e,
		__pendingEvents: t,
		__pendingConverters: n,
		__pendingDomOperations: r,
		__pendingEffects: i,
		__pendingValueReaders: o,
		__pendingCollectionSinks: s,
		__pendingStrings: c,
		__pendingEngines: l,
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
		},
		registerValueReader(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addValueReader(e);
				return;
			}
			o.push(e);
		},
		addValueReader(e) {
			this.registerValueReader(e);
		},
		registerCollectionSink(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addCollectionSink(e);
				return;
			}
			s.push(e);
		},
		addCollectionSink(e) {
			this.registerCollectionSink(e);
		},
		registerStrings(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addStrings(e);
				return;
			}
			c.push(e);
		},
		addStrings(e) {
			this.registerStrings(e);
		},
		registerEngine(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEngine(e);
				return;
			}
			l.push(e);
		},
		addEngine(e) {
			this.registerEngine(e);
		}
	};
	return window.NEStandardUI = u, u;
}
function i(e, t) {
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
	d(console.warn, e, t);
}
function c(e, t) {
	d(console.error, e, t);
}
function l(e, t) {
	d(console.debug, e, t);
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
function d(e, t, n) {
	n === void 0 ? e(`${o} ${t}`) : e(`${o} ${t}`, n);
}
//#endregion
//#region src/addressing/dom-attributes.ts
var f = "data-ui-id", p = "data-ui-context", ee = "data-ui-pc", m = "data-ui-key", te = "data-ui-unselectable", ne = "data-ui-undraggable", re = "data-ui-unremovable", ie = "data-ui-unrenamable", ae = "data-ui-no-context-menu", oe = "data-ui-tabs-draggable", se = "data-ui-name", ce = "data-ui-bind-", le = "data-ui-bind-value", ue = (e) => `data-ui-no-${e}`, de = "data-ui-event-boundary", fe = "data-ui-image-caption", pe = "data-ui-items-host", me = "data-ui-items-query", he = "data-ui-empty-template", ge = "data-ui-group-template", _e = "data-ui-empty-placeholder", ve = "data-ui-group-header", ye = "data-ui-group", be = "data-ui-value-kind", xe = "data-ui-host-mode", Se = "data-ui-window-spacer", Ce = "data-ui-window-size", we = "data-ui-window-offset", Te = "data-ui-window-total", Ee = "data-ui-window-more-before", De = "data-ui-window-more-after", Oe = "data-ui-form-id", ke = "data-ui-visibility", Ae = "data-ui-collapsed", je = "data-ui-menu-group", Me = "data-ui-menu-select", Ne = "data-ui-menu-open", Pe = "data-ui-collapse-toggle", Fe = "data-ui-folding", Ie = "data-ui-column-limits", Le = "data-ui-row-limits", Re = "data-ui-splitter-step", ze = "data-ui-table-column", Be = "data-ui-tree-parent", Ve = "data-ui-tree-children", He = "data-ui-tree-expanded", Ue = "data-ui-tree-title", We = "data-ui-tree-loading", Ge = "data-ui-tree-drop-target", Ke = "data-ui-tree-draggable", qe = "data-ui-row-editing", Je = "data-ui-image-source", Ye = "data-ui-file-max-size", Xe = "data-ui-splitting", Ze = "data-ui-pointer-focus", Qe = "data-ui-selection", $e = "data-ui-selected", et = "data-ui-selected-key", tt = "data-ui-selected-keys", nt = "data-ui-bind-selected-key", rt = "data-ui-tabs-selected", it = "data-ui-tab-order", at = "data-ui-tab-caption", ot = [
	ke,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], st = "data-ui-submit-form-id", ct = `[${f}]`;
function lt(e) {
	return String(e).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function ut(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var dt = 0;
function ft(e, t) {
	return e.id.length === 0 && (dt++, e.id = `${t}-${dt}`), e.id;
}
//#endregion
//#region src/metadata/metadata-index.ts
var pt = {
	Navigate: "Navigate",
	Focus: "Focus",
	ScrollTo: "ScrollTo",
	Show: "Show",
	Hide: "Hide",
	OpenDialog: "OpenDialog",
	CloseDialog: "CloseDialog",
	ShowNotification: "ShowNotification",
	DownloadFile: "DownloadFile",
	Scroll: "Scroll",
	SetTheme: "SetTheme",
	RenameTab: "RenameTab",
	RenameNode: "RenameNode",
	CopyToClipboard: "CopyToClipboard"
}, mt = class {
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
	metadata;
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
		for (let t of this.metadata.bindings) if (g(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(It(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(It(e, Ft(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Lt(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(_(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(_(e))?.has(t) === !0;
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
		let t = g(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = g(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(It(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(It(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = _(e.eventName), n = g(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Lt(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = g(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = g(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = g(e.componentId);
		t > 0 && this.itemValuesByComponentId.set(t, e);
	}
	addValidation(e) {
		let t = g(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function h(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function ht(e) {
	return h(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function gt(e) {
	return e == null ? "OneWay" : h(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function _t(e) {
	return h(e, ["Property", "Event"]);
}
function vt(e) {
	return e == null ? "SetProperty" : h(e, ["SetProperty", "Effect"]);
}
function yt(e) {
	return h(e, [
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
function bt(e) {
	return h(e, ["Ascending", "Descending"]);
}
function xt(e) {
	return h(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function St(e) {
	return h(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ct(e) {
	return typeof e == "string" ? e : h(e, [
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
function wt(e) {
	return h(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function Tt(e) {
	return h(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function g(e) {
	return typeof e == "number" ? e : e?.value ?? 0;
}
function Et(e) {
	return typeof e == "string" ? e : e?.name ?? "";
}
function Dt(e) {
	return h(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function Ot(e) {
	return typeof e == "string" ? e.trim() : "";
}
function kt(e) {
	return h(e, ["Auto", "Smooth"]);
}
function At(e) {
	return h(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function jt(e) {
	return h(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Mt(e) {
	return h(e, ["Light", "Dark"]);
}
function Nt(e) {
	return h(e, ["Horizontal", "Vertical"]);
}
function Pt(e) {
	return { value: g(e) };
}
function _(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Ft(e) {
	return e?.trim() ?? "";
}
function It(e, t) {
	return `${e}:${Ft(t)}`;
}
function Lt(e, t) {
	return `${e}:${_(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Rt = class {
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
		return this.dom.findAllComponents(g(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = g(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = g(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${ce}${ut(r.propertyName)}="${lt(a)}"]` : null;
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
	resolveOperationTargets(e, t) {
		return zt(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
function zt(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		let t = e.querySelector(r);
		return t === null ? [] : [t];
	}
	return n();
}
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Bt(e) {
	return Ut(e, ee);
}
function Vt(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Wt(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Ht(e, t) {
	let n = Bt(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Vt(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ut(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Wt(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Gt = class {
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
		let e = this.root.querySelectorAll(ct), t = this.root.querySelector(`[${ve}]`) !== null;
		for (let n of e) {
			let e = Kt(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && qt(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	findComponentParts(e, t, n) {
		let r = [];
		for (let i of this.findAllComponents(e, t)) i instanceof HTMLElement && i.matches(n) ? r.push(i) : r.push(...i.querySelectorAll(n));
		return r;
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.stale && this.rebuild(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		return (this.componentsById.get(e) ?? []).filter((e) => Ht(e, t));
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(ct);
			if (e === null || !Jt(this.root, e)) return null;
			let r = Kt(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Vt(e, Bt(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function Kt(e) {
	return Ut(e, f);
}
function v(e) {
	let t = e.closest(ct), n = t === null ? 0 : Kt(t);
	return n > 0 ? n : null;
}
function qt(e) {
	return Bt(e) === 0;
}
function Jt(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/client-strings.ts
var Yt = "script[type='application/json'][data-ui-strings]", y = new class {
	words = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	hasStringsBlock = !1;
	load(e = document) {
		let t = e.querySelector(Yt)?.textContent?.trim() ?? "";
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
function Xt(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function b(e) {
	return e == null;
}
var Zt = "data-ui-trim-input", Qt = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of tn) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(be);
		if (t === null) return $t(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Zt) ? t.trim() : t;
	}
};
function $t(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
function en(e) {
	return e === null ? null : Number(e);
}
var tn = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(rt)
	},
	{
		kind: "tab-order",
		read: (e) => en(e.getAttribute(it))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(at)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Ue)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(et)
	},
	{
		kind: "selected-keys",
		read: (e) => nn(e, tt)
	},
	{
		kind: "items-query",
		read: (e) => nn(e, me)
	},
	{
		kind: "checked-radio",
		read: (e) => e.querySelector("input[type=\"radio\"]:checked")?.value ?? null
	}
];
function nn(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function rn(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/updates/value-binding-engine.ts
var an = "data-ui-clear", on = "data-ui-form-id", sn = ["change", "toggle"], cn = [
	...sn,
	"expand",
	"collapse",
	"open",
	"close"
];
function ln(e) {
	let t = gt(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function un(e) {
	return gt(e) === "OnSubmit";
}
var dn = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of sn) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("click", (e) => this.handleClear(e), !0);
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${an}]`);
		if (t === null) return;
		let n = t.closest(ct)?.querySelector(`[${le}]`);
		n != null && (rn(n), n.dispatchEvent(new Event("change", { bubbles: !0 })));
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
		if (e.getAttribute(on) === null) {
			s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName });
			return;
		}
		this.bufferedElements.add(e);
	}
	async submitFormAsync(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (n.getAttribute(on) !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = this.resolveWritableBinding(n);
			r !== null && t.push(this.syncValueAsync(n, r.bindingId));
		}
		await Promise.all(t);
	}
	resolveWritableBinding(e) {
		let t = e.getAttribute(le);
		if (t !== null) {
			let e = this.options.metadata.getBindingById(Number(t));
			return {
				bindingId: t,
				buffered: e !== void 0 && un(e.mode)
			};
		}
		for (let t of Array.from(e.attributes)) {
			if (!t.name.startsWith("data-ui-bind-")) continue;
			let e = this.options.metadata.getBindingById(Number(t.value));
			if (e !== void 0 && ln(e.mode)) return {
				bindingId: t.value,
				buffered: un(e.mode)
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
			value: this.options.valueReaders.readBound(e)
		});
		this.options.applyChanges(r);
	}
	async syncPropertyAsync(e, t, n, r) {
		let i = this.options.metadata.getBindingByComponentAndPropertyId(e, t);
		if (i === void 0 || !ln(i.mode) || un(i.mode)) return;
		let a = this.options.metadata.getPropertyDefinition(t)?.propertyName;
		if (a === void 0) return;
		let o = await this.options.dispatcher.dispatchAsync({
			componentId: e,
			propertyName: a,
			dynamicParameters: n,
			value: r
		});
		this.options.applyChanges(o);
	}
	async whenSettled(e) {
		await this.pendingSyncByComponent.get(e);
	}
}, fn = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = _(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = _(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(_(e));
	}
	markAttached(e) {
		let t = _(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, pn = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: Pt(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, mn = class {
	options;
	root;
	registry;
	requestFactory = new pn();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new fn(e.eventCatalog), this.addEvent("click");
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
		if (r === null || gn(t, r.element)) return;
		let i = t.target.closest(`[${de}]`);
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
		this.applyDomPolicy(n, o);
		let s = this.requestFactory.create(n, o);
		if (s === null) {
			this.options.interactionEngine.applyEvent({
				name: e,
				componentId: o.componentId,
				dynamicParameters: o.dynamicParameters,
				domEvent: t
			});
			return;
		}
		if (this.options.dispatcher.isPending(s)) {
			t.preventDefault();
			return;
		}
		let c = r.element.getAttribute(st);
		if (c !== null) {
			if (this.options.validationEngine?.runSubmitValidation(c) === !1) {
				t.preventDefault();
				return;
			}
			await this.options.valueBinding?.submitFormAsync(c);
		}
		if (await this.isRefusedValueEventAsync(n, r.element) || this.options.dispatcher.isPending(s)) return;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: o.componentId,
			dynamicParameters: o.dynamicParameters,
			domEvent: t
		});
		let l = await this.options.dispatcher.dispatchAsync(s);
		this.options.applyChanges(l.changes), this.options.effects.applyAll(l.command?.effects, this.options.dom), this.options.afterEffects?.(), this.options.interactionEngine.applyEvent({
			name: `after-${e}`,
			componentId: o.componentId,
			dynamicParameters: o.dynamicParameters,
			domEvent: t
		});
	}
	async isRefusedValueEventAsync(e, t) {
		return !cn.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
	}
	shouldHandleComponent(e, t, n) {
		return n.hasAttribute(ue(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		hn(e.preventDefault, t) && t.domEvent.preventDefault(), hn(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function hn(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function gn(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var _n = class {
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
				componentId: g(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(g(e.reference.componentId), e.reference.propertyId);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (vt(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!yn(i)) return;
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
			effect: vn(r, t),
			dom: this.options.dom
		});
	}
};
function vn(e, t) {
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
function yn(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var bn = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return xn(t, e.operator, e.value);
	}
};
function xn(e, t, n) {
	switch (yt(t)) {
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
		case "Regex": return Sn(e, n);
		default: return !1;
	}
}
function Sn(e, t) {
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
var Cn = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(_(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) En(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(_(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Dn(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(On(e, t)) ?? [];
	}
	addInteraction(e) {
		if (wn(e)) {
			let t = g(e.sourceEvent?.componentId), n = _(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Dn(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Dn(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Tn(e)) {
			let t = g(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(On(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(On(t, n), r)), r.push(e);
			}
		}
	}
};
function wn(e) {
	return _t(e.sourceKind) === "Event";
}
function Tn(e) {
	return _t(e.sourceKind) === "Property";
}
function En(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Dn(e, t) {
	return `${e}:${_(t)}`;
}
function On(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/interactions/anchored-popup.ts
var kn = /* @__PURE__ */ new Set([
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
function An(e) {
	return kn.has(e);
}
var jn = 4, Mn = 12, Nn = /* @__PURE__ */ new Map(), Pn = !1, Fn = null;
function In(e, t, n) {
	Nn.set(t, {
		anchor: e,
		options: n
	}), Ln(), Fn?.observe(t), zn(e, t, n);
}
function x(e) {
	e != null && (Nn.delete(e), Fn?.unobserve(e));
}
function Ln() {
	Pn || (Pn = !0, document.addEventListener("scroll", Rn, !0), window.addEventListener("resize", Rn), Fn = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Nn.get(t.target);
			e !== void 0 && zn(e.anchor, t.target, e.options);
		}
	}));
}
function Rn() {
	for (let [e, t] of Nn) {
		if (!e.isConnected) {
			x(e);
			continue;
		}
		zn(t.anchor, e, t.options);
	}
}
function zn(e, t, n) {
	n.matchAnchorWidth === !0 && (t.style.width = `${e.getBoundingClientRect().width}px`);
	let r = e.getBoundingClientRect(), i = (n.crossAnchor ?? e).getBoundingClientRect(), a = t.getBoundingClientRect(), o = Vn(r, a, n), s = Xn(qn(r, i, a, o, n.gap), a.height, window.innerHeight), c = Xn(Jn(r, i, a, o, n.gap), a.width, window.innerWidth);
	t.style.top = `${s}px`, t.style.left = `${c}px`, t.dataset.uiPlacement = o, Bn(t, i, a, o, s, c);
}
function Bn(e, t, n, r, i, a) {
	let o = Un(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Mn, Math.min(s, c - Mn))}px`);
}
function Vn(e, t, n) {
	let r = n.placement, i = Hn(t, r) + n.gap, a = Wn(e, r), o = Gn(r);
	return a >= i || Wn(e, o) <= a ? r : o;
}
function Hn(e, t) {
	return Un(t) ? e.height : e.width;
}
function Un(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Wn(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Gn(e) {
	return e.startsWith("top") ? `bottom${Kn(e)}` : e.startsWith("bottom") ? `top${Kn(e)}` : e.startsWith("left") ? `right${Kn(e)}` : `left${Kn(e)}`;
}
function Kn(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function qn(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Yn(t.top, t.height, n.height, r);
}
function Jn(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Yn(t.left, t.width, n.width, r);
}
function Yn(e, t, n, r) {
	let i = Kn(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Xn(e, t, n) {
	return Math.max(jn, Math.min(e, n - t - jn));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Zn = 32;
function S(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((n) => {
		let i = Qn(e, n, t);
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
function Qn(e, t, n) {
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
		if (r.size > Zn) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var $n = /* @__PURE__ */ new Set(), er = /* @__PURE__ */ new Map(), tr = 0, nr = !1;
function rr() {
	nr || (nr = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || ar() && e.preventDefault();
	}, !0));
}
function ir() {
	for (let e of $n) for (let t of e.openPopups()) if (t.isConnected) return !0;
	return !1;
}
function ar() {
	let e = [];
	for (let t of $n) for (let n of t.openPopups()) e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...er.keys()]) t.has(e) || er.delete(e);
	for (let { popup: t } of e) er.has(t) || er.set(t, ++tr);
	e.sort((e, t) => (er.get(t.popup) ?? 0) - (er.get(e.popup) ?? 0));
	for (let { instance: t, popup: n } of e) if (t.dismiss(n, "escape")) return !0;
	return !1;
}
var or = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), $n.add(this), rr();
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
}, sr = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function cr(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	return (t ?? e.querySelector(sr) ?? e).focus({ preventScroll: !0 }), n;
}
function lr(e, t) {
	e != null && t.contains(document.activeElement) && e.focus({ preventScroll: !0 });
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var ur = "ui-flyout", dr = "ui-flyout--open", fr = "ui-flyout__anchor", pr = "ui-flyout__content", mr = `.${ur}.${dr}`, hr = "data-ui-flyout-no-backdrop-close", gr = "data-ui-flyout-no-escape-close", _r = 4, vr = `${ur}--`, yr = "bottom-start", br = class {
	root;
	returnFocus = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${ur}`)) this.place(e);
		S(this.root, `.${ur}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), new or({
			root: this.root,
			openPopups: () => this.root.querySelectorAll(mr),
			canDismiss: (e, t) => !e.hasAttribute(t === "escape" ? gr : hr),
			close: (e) => this.setOpen(e, !1)
		});
	}
	place(e) {
		let t = e.querySelector(`:scope > .${pr}`), n = e.querySelector(`:scope > .${fr}`);
		if (t === null) return;
		let r = e.classList.contains(dr);
		if (this.describeAnchor(n, t, r), !r) {
			x(t), lr(this.returnFocus.get(e), e), this.returnFocus.delete(e);
			return;
		}
		In(xr(n) ?? e, t, {
			placement: Sr(e),
			gap: _r
		});
		let i = cr(t);
		i !== null && this.returnFocus.set(e, i);
	}
	describeAnchor(e, t, n) {
		if (e === null) return;
		let r = e.querySelector(sr) ?? e;
		r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("aria-controls", ft(t, "ui-flyout-content"));
	}
	handleFocusOut(e) {
		if (!(e instanceof FocusEvent)) return;
		let t = e.target instanceof Element ? e.target.closest(mr) : null;
		if (t === null || t.hasAttribute(hr)) return;
		let n = e.relatedTarget;
		n === null || n instanceof Node && t.contains(n) || this.setOpen(t, !1);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fr}`)?.closest(`.${ur}`) ?? null;
		t !== null && this.setOpen(t, !t.classList.contains(dr));
	}
	setOpen(e, t) {
		e.classList.contains(dr) !== t && (e.classList.toggle(dr, t), this.place(e), e.dispatchEvent(new Event("toggle", { bubbles: !0 })), e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 })));
	}
};
function xr(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Sr(e) {
	for (let t of e.classList) {
		if (!t.startsWith(vr)) continue;
		let e = t.slice(vr.length);
		if (An(e)) return e;
	}
	return yr;
}
//#endregion
//#region src/interactions/file-drop.ts
var Cr = 120, wr = "refused";
function Tr(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Er(e, t, n), !0);
	e.root.addEventListener("dragend", () => kr(e, t.marked), !0), window.addEventListener("blur", () => kr(e, t.marked));
}
function Er(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && kr(e, r);
		return;
	}
	let { host: a } = i;
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Or(e, r, a) : t.leaving = window.setTimeout(() => kr(e, r), Cr);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Dr(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && Or(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? wr : "");
		return;
	}
	kr(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Ar(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function Dr(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function Or(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function kr(e, t) {
	for (let n of t) Or(e, t, n);
}
function Ar(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var jr = "/_ne/files/upload";
function Mr(e, t) {
	let n = Number(e.getAttribute(Ye));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function Nr(e, t) {
	return new Promise((n, r) => {
		let i = new FormData();
		for (let t of e) i.append("files", t, t.name);
		let a = new XMLHttpRequest();
		a.open("POST", jr), a.responseType = "json", a.withCredentials = !0, a.upload.addEventListener("progress", (e) => {
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
function Pr(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Fr = "ui-file-input", Ir = "ui-file-input__row", Lr = "ui-file-input__native", Rr = "ui-file-input__field", zr = "ui-file-input__selection", Br = "data-ui-file-pick", Vr = "data-ui-file-dragging", Hr = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Tr({
			root: this.root,
			draggingAttribute: Vr,
			resolveTarget: (e) => {
				let t = e.closest(`.${Ir}`)?.closest(`.${Fr}`) ?? null, n = t?.querySelector(`.${Lr}`) ?? null;
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
		let t = e.target.closest(`[${Br}], .${Ir}`);
		if (t === null || t.hasAttribute("disabled") || !t.hasAttribute(Br) && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Fr}`)?.querySelector(`.${Lr}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Lr)) return;
		let t = e.target.closest(`.${Fr}`);
		t !== null && await this.takeFilesAsync(t, [...e.target.files ?? []]);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Rr}`);
		if (n === null) return;
		if (t.length === 0) {
			n.value = "", this.publishSelection(e, "");
			return;
		}
		let r = Mr(e, t);
		if (r.length !== 0) try {
			let t = await Nr(r, (e) => {
				n.value = y.format("ui.file.uploading", { percent: e });
			});
			n.value = Ur(r), this.publishSelection(e, t.selectionId);
		} catch (t) {
			n.value = y.text("ui.file.failed"), this.publishSelection(e, ""), s("file upload failed.", t);
		}
	}
	publishSelection(e, t) {
		Pr(e.querySelector(`.${zr}`), t);
	}
};
function Ur(e) {
	return e.length === 1 ? e[0].name : y.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/image-input-engine.ts
var Wr = "ui-image-input", Gr = "ui-image-input--multiple", Kr = "ui-image-input__surface", qr = "ui-image-input__native", Jr = "ui-image-input__picture", Yr = "ui-image-input__text", Xr = "ui-image-input__selection", Zr = "ui-image-input__selections", Qr = "ui-image-input__tiles", $r = "ui-image-input__tile", ei = "ui-image-input__remove", ti = "data-ui-file-pick", ni = "data-ui-image-preview", ri = "data-ui-image-dragging", ii = "ui-loading", ai = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Wr}`)), S(this.root, `.${Wr}`, {
			childList: !0,
			attributeFilter: [
				Je,
				fe,
				tt
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), Tr({
			root: this.root,
			draggingAttribute: ri,
			resolveTarget: (e) => {
				let t = e.closest(`.${Kr}`)?.closest(`.${Wr}`) ?? null;
				return t === null || t.hasAttribute("data-ui-image-readonly") || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: t.querySelector(`.${qr}`)?.getAttribute("accept") ?? "",
					multiple: oi(t)
				};
			},
			onFiles: (e, t) => void (oi(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) oi(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Jr}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || ci(e, e.getAttribute("data-ui-image-caption") ?? li(n)));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(tt);
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
		let t = e.target.closest(`[${ti}]`), n = t?.closest(`.${Wr}`) ?? null;
		t === null || n === null || t.hasAttribute("disabled") || n.hasAttribute("data-ui-image-readonly") || n.querySelector(`.${qr}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ei}`), n = t?.closest(`.${Wr}`) ?? null;
		if (t === null || n === null || n.hasAttribute("data-ui-image-readonly") || n.matches(".ui-disabled")) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qr)) return;
		let t = e.target.closest(`.${Wr}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (oi(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Kr}`), r = e.querySelector(`.${Jr}`), i = e.querySelector(`.${Xr}`);
		if (n === null || r === null || Mr(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(ni, ""), r.setAttribute("src", a), ci(e, t.name), n.classList.add(ii);
		try {
			Pr(i, (await Nr([t], () => void 0)).selectionId);
		} catch (t) {
			ci(e, y.text("ui.file.failed")), Pr(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(ii);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Qr}`), r = Mr(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = si(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Nr([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(ii), this.publishShelf(e);
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
		let t = e.querySelector(`.${Zr}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(tt, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(ni), t || ci(e, ""));
	}
};
function oi(e) {
	return e.classList.contains(Gr);
}
function si(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${$r} ${ii}`, n.src = i, n.alt = e.name, r.type = "button", r.className = ei, r.setAttribute("aria-label", y.text("ui.image.remove")), r.title = e.name, t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function ci(e, t) {
	let n = e.querySelector(`.${Yr}`);
	n !== null && n.textContent !== t && (n.textContent = t);
}
function li(e) {
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
var ui = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function di(e) {
	return e instanceof HTMLInputElement && ui.has(e.type);
}
function fi(e) {
	return di(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/own-control.ts
var pi = "[role='listbox'], [role='menu'], [role='dialog']", mi = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${pi}`;
function hi(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(mi);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/key-value-action-engine.ts
var gi = "ui-key-value-action__row", _i = "ui-key-value-action__value", vi = "ui-key-value-action__value-input", yi = "ui-key-value-action__edit-action", bi = "ui-text__title", xi = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, S(this.root, `.${gi}`, { attributeFilter: [qe] }, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${vi} [${le}]`)) {
			if (fi(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
	}
	open(e) {
		let t = e.querySelector(`.${vi} :is(input, textarea, select)`);
		if (t !== null) {
			if (fi(t) && t.value.length === 0) {
				let n = e.querySelector(`.${_i} .${bi}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), di(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target.closest(`.${vi}, .${yi}`), n = t?.closest(`.${gi}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-row-editing") || e.key === "Enter" && t.classList.contains(yi)) return;
		let r = e.target.closest(pi);
		if (r !== null && t.contains(r) || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let i = n.querySelectorAll(`.${yi} button`), a = e.key === "Enter" ? i[0] : i[i.length - 1];
		a !== void 0 && (e.preventDefault(), e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), a.click());
	}
}, Si = class {
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
		di(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(Oe);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${st}="${CSS.escape(t)}"]`);
		n !== null && !n.hasAttribute("inert") && !n.disabled && n.click();
	}
	leave(e) {
		let t = this.changes;
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, Ci = "data-ui-fallback-src", wi = `img[${Ci}]`, Ti = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(wi)) (Ei(e) || e.complete && e.naturalWidth === 0) && Di(e);
		S(this.root, wi, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && Ei(t) && Di(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Di(t);
	}
};
function Ei(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Di(e) {
	let t = e.getAttribute(Ci);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/own-descendants.ts
function C(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Oi = "data-ui-radio-value", ki = "ui-radio-group__input", Ai = "ui-radio-group__dot", ji = "ui-radio-group", Mi = "ui-radio-group__item", Ni = "data-ui-radio-group-name", Pi = "data-ui-radio-bind-value-id", Fi = "data-ui-radio-disabled", Ii = "ui-disabled", Li = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${ji}`)) this.claimGroupName(e);
		for (let e of this.root.querySelectorAll(`[${Oi}]`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.target instanceof HTMLElement) {
					this.sync(t.attributeName === "class" ? t.target.closest(`.${ji}`) : t.target);
					continue;
				}
				for (let e of t.addedNodes) e instanceof HTMLElement && (this.decorateAddedGroups(e), this.decorateAddedItems(e));
			}
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Oi, "class"],
			childList: !0,
			subtree: !0
		});
	}
	decorateAddedGroups(e) {
		let t = e.classList.contains(ji) ? [e] : [...e.querySelectorAll(`.${ji}`)];
		for (let e of t) this.claimGroupName(e);
	}
	claimGroupName(e) {
		let t = e.getAttribute(Ni);
		if (t === null) return;
		let n = !1;
		for (let r of this.root.querySelectorAll(`.${ji}`)) if (r !== e && r.getAttribute(Ni) === t) {
			n = !0;
			break;
		}
		if (!n) return;
		let r = `${t}-${++this.renamed}`;
		e.setAttribute(Ni, r);
		for (let t of C(e, `.${ki}`, `.${ji}`)) t.name = r;
		for (let e of this.root.querySelectorAll(`[${Oi}]`)) this.sync(e);
	}
	sync(e) {
		let t = e?.getAttribute(Oi);
		if (e === null || t == null) return;
		let n = e.hasAttribute(Fi);
		for (let r of C(e, `.${ki}`, `.${ji}`)) {
			r.checked = r.value === t;
			let e = n || Ri(r);
			r.disabled !== e && (r.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Mi) ? [e] : [...e.querySelectorAll(`.${Mi}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${ki}`) !== null) return;
		let t = e.closest(`.${ji}`), n = t?.getAttribute(Ni);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = ki, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Pi);
		a !== null && r.setAttribute("data-ui-bind-value", a);
		let o = document.createElement("span");
		o.className = Ai, e.prepend(r, o), this.sync(t);
	}
};
function Ri(e) {
	let t = e.closest(`.${Mi}`);
	return t !== null && (t.classList.contains(Ii) || t.querySelector(`:scope > .${Ii}`) !== null);
}
//#endregion
//#region src/interactions/roving-focus.ts
function zi(e) {
	let t = e.items.filter(Vi);
	if (t.length === 0) return null;
	let n = Hi(e.key);
	if (n !== null) return n === "first" ? t[0] : t[t.length - 1];
	let r = Ui(e.key, e.axis);
	if (r === 0) return null;
	let i = e.current === null ? -1 : t.indexOf(e.current);
	if (i === -1) return r > 0 ? t[0] : t[t.length - 1];
	let a = i + r;
	return a >= 0 && a < t.length ? t[a] : e.loop ?? !0 ? t[(a + t.length) % t.length] : null;
}
function Bi(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Vi(e) {
	return e.getClientRects().length !== 0 && !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function Hi(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ui(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Wi = "data-ui-search-debounce", Gi = "data-ui-search-min-length", Ki = "data-ui-search-manual", qi = "ui-search__input", Ji = "ui-select", Yi = "ui-select__popup", Xi = "ui-select__option", Zi = 300, Qi = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qi)) return;
		let t = e.target;
		$i(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Wi), i = r === null ? Zi : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), i));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Ki)) return;
		let t = e.getAttribute(Gi), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function $i(e) {
	let t = e.closest(`.${Ji}`), n = t?.querySelector(`.${Yi}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Gi), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${Xi}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	na(t, n, o && s === 0);
}
function ea(e) {
	let t = e.querySelector(`.${Yi}`);
	t !== null && na(e, t, [...t.querySelectorAll(`.${Xi}`)].filter((e) => e.style.display !== "none").length === 0);
}
function ta(e) {
	let t = e.querySelector(`.${Yi}`);
	if (t !== null) for (let e of t.querySelectorAll(`.${Xi}`)) e.style.display = "";
}
function na(e, t, n) {
	let r = t.querySelector(`:scope > [${_e}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${he}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(_e, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var ra = "data-ui-select-value", w = "ui-select", ia = "ui-select--open", aa = "ui-select__trigger", oa = "ui-select__trigger-content", sa = "data-ui-select-content", ca = "ui-select__placeholder", la = "ui-input__affix-icon--prefix", ua = "ui-select__popup", da = "ui-select__option", fa = "ui-select__value-input", pa = "data-ui-select-clear", ma = "data-ui-select-trigger-mode", ha = "ui-search__input", ga = "ui-text__title", _a = "ui-disabled", va = "data-ui-active", ya = 4, ba = /* @__PURE__ */ new Set([
	"aria-selected",
	"aria-disabled",
	va,
	"tabindex",
	"style"
]);
function xa(e) {
	return e?.querySelector(`.${ha}`)?.readOnly === !0;
}
function Sa(e) {
	return C(e, `.${ua} .${da}`, `.${w}`);
}
function Ca(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(f), t.removeAttribute(m), t.removeAttribute(ee), t.removeAttribute(p);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var wa = class {
	root;
	openSelect = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${w}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "childList") {
					for (let e of t.addedNodes) if (e instanceof HTMLElement) {
						e.classList.contains(w) && this.sync(e);
						for (let t of e.querySelectorAll(`.${w}`)) this.sync(t);
					}
				}
				if (t.type === "attributes" && t.attributeName === ra) {
					t.target instanceof HTMLElement && this.sync(t.target);
					continue;
				}
				if (t.type === "attributes" && ba.has(t.attributeName ?? "")) continue;
				let e = (t.target instanceof HTMLElement ? t.target : t.target.parentElement)?.closest(`.${ua}`)?.closest(`.${w}`);
				e != null && this.sync(e);
			}
		}).observe(this.root, {
			attributes: !0,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), new or({
			root: this.root,
			openPopups: () => this.openSelect === null ? [] : [this.openSelect],
			close: () => this.close()
		});
	}
	sync(e) {
		let t = e.getAttribute(ra);
		this.decorateOptions(e);
		let n = t === null ? null : Sa(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = n === null ? null : n.querySelector(`.${ga}`)?.textContent ?? n.textContent;
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${ha}`);
		a !== null && (document.activeElement !== a && (a.value = i ?? ""), ta(e));
		let o = e.querySelector(`.${ca}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of Sa(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${fa}`);
		s !== null && t !== null && (s.value = t), ea(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${aa}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${oa}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(sa) === i) {
			r.removeAttribute(sa);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = oa;
			let e = n.querySelector(`:scope > .${la}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Ca(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e) {
		for (let t of Sa(e)) {
			t.hasAttribute("role") || t.setAttribute("role", "option");
			let e = Ta(t), n = e ? "true" : "false";
			t.getAttribute("aria-disabled") !== n && t.setAttribute("aria-disabled", n), (e ? t.tabIndex !== -1 : !t.hasAttribute("tabindex")) && (t.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ha)) return;
		let t = e.target.closest(`.${w}`);
		t !== null && t !== this.openSelect && this.toggle(t);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${pa}]`);
		if (t !== null) {
			let n = t.closest(`.${w}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), xa(n) || this.clearValue(n));
			return;
		}
		let n = e.target.closest(`.${aa}`);
		if (n !== null) {
			let t = n.closest(`.${w}`);
			if (xa(t) || n.getAttribute(ma) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let r = e.target.closest(`.${da}`);
		if (r === null) return;
		let i = r.closest(`.${w}`);
		i !== null && this.choose(i, r);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${da}`);
		if (t === null) return;
		let n = t.closest(`.${w}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	toggle(e) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), e.classList.add(ia), this.positionPopup(e), this.describeTrigger(e, !0), this.openSelect = e, this.initializeFocus(e);
		}
	}
	describeTrigger(e, t) {
		let n = e.querySelector(`.${aa}`), r = e.querySelector(`.${ua}`);
		n !== null && (n.setAttribute("aria-expanded", t ? "true" : "false"), r !== null && n.setAttribute("aria-controls", ft(r, "ui-select-popup")));
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = e.querySelector(`.${ua}`);
		t !== null && lr(e.querySelector(`.${aa}`), t), e.classList.remove(ia), this.markActive(e, null), this.describeTrigger(e, !1), x(t), this.openSelect = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${aa}`), n = e.querySelector(`.${ua}`);
		t !== null && n !== null && In(t, n, {
			placement: "bottom-start",
			gap: ya,
			matchAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = Sa(e).filter((e) => !Ta(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		if (Bi(t, n), this.markActive(e, n), e.querySelector(`.${aa}`)?.getAttribute(ma) === "input") {
			let t = e.querySelector(`.${ha}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		n.focus();
	}
	moveFocus(e, t) {
		let n = Sa(e).filter((e) => !Ta(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(va)) ?? null, i = zi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Bi(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t) {
		for (let n of Sa(e)) n === t ? n.setAttribute(va, "") : n.hasAttribute(va) && n.removeAttribute(va);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || Ta(t)) return;
		if (e.getAttribute(ra) === n) {
			this.close();
			return;
		}
		e.setAttribute(ra, n), this.sync(e);
		let r = e.querySelector(`.${fa}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	clearValue(e) {
		if (!e.hasAttribute(ra)) return;
		e.removeAttribute(ra), this.sync(e);
		let t = e.querySelector(`.${fa}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Ta(e) {
	return e.classList.contains(_a) || e.querySelector(`:scope > .${_a}`) !== null;
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Ea = "data-ui-input-debounce", Da = `input[${Ea}], textarea[${Ea}]`;
function Oa(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Da);
}
var ka = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Oa(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Ea));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Oa(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Aa = "ui-slider__input", ja = "ui-slider__value", Ma = "ui-slider__bubble", Na = "ui-slider__track", Pa = "ui-slider__thumb-anchor", Fa = "ui-slider", Ia = "ui-orientation--vertical", La = "--ui-slider-fraction", Ra = 6, za = "Value", Ba = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), Va = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Ba.has(e.propertyName)) return;
			let t = g(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Aa}`);
				t !== null && (this.writeReadings(t), e.propertyName === za && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t != null && e.value !== String(t) && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Aa) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = Ha(e);
		t !== null && In(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Ra
		});
	}
	releaseBubble(e) {
		x(Ha(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Na}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${ja}, .${Ma}`) ?? []) n.textContent = e.value;
		e.closest(`.${Na}`)?.style.setProperty(La, String(Ua(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Ha(e) {
	if (!(e instanceof Element) || !e.classList.contains(Aa)) return null;
	let t = e.closest(`.${Na}`), n = t?.querySelector(`.${Ma}`) ?? null, r = t?.querySelector(`.${Pa}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${Fa}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Ia)
	};
}
function Ua(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Wa = "ui-number-input__field", Ga = "data-ui-number-no-decimals", Ka = "data-ui-number-no-negative", qa = "data-ui-number-no-thousands", Ja = "data-ui-number-trim-zeros", Ya = "data-ui-number-step", Xa = "data-ui-number-min", Za = "data-ui-number-max", Qa = "data-ui-number-step-direction", $a = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.applyDisplayFormatting(this.root.querySelectorAll(`.${Wa}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyDisplayFormatting(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Wa}`) ?? []);
		});
	}
	applyDisplayFormatting(e) {
		for (let t of e) t === document.activeElement || t.hasAttribute(qa) || t.value.length === 0 || (t.value = ro(t.value));
	}
	handleInput(e) {
		let t = eo(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Ga), r = !t.hasAttribute(Ka), i = t.selectionStart ?? t.value.length, a = to(t.value, i, n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = eo(e.target);
		t !== null && t.value.includes(",") && (t.value = t.value.replace(/,/g, ""));
	}
	handleBlur(e) {
		let t = eo(e.target);
		t !== null && this.commitFormatting(t);
	}
	commitFormatting(e) {
		let t = e.value;
		if (e.hasAttribute(Ja)) {
			let n = no(t);
			n !== t && (t = n, e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
		!e.hasAttribute(qa) && t.length > 0 && (e.value = ro(t));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Qa + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Wa}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(Ya) ?? "1"), i = t.getAttribute(Qa) === "down" ? -1 : 1, a = (Number(n.value.replace(/,/g, "")) || 0) + r * i, o = n.getAttribute(Xa), s = n.getAttribute(Za);
		o !== null && (a = Math.max(a, Number(o))), s !== null && (a = Math.min(a, Number(s))), n.value = io(a), n.dispatchEvent(new Event("change", { bubbles: !0 })), this.commitFormatting(n);
	}
};
function eo(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Wa) ? e : null;
}
function to(e, t, n, r) {
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
function no(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function ro(e) {
	let t = e.startsWith("-"), [n, r] = (t ? e.slice(1) : e).split("."), i = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return (t ? "-" : "") + i + (r === void 0 ? "" : "." + r);
}
function io(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var ao = [
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
function oo(e, t, n) {
	if (t == null || t.trim().length === 0) return `${T(e.getFullYear(), 4)}-${T(e.getMonth() + 1, 2)}-${T(e.getDate(), 2)} ${T(e.getHours(), 2)}:${T(e.getMinutes(), 2)}:${T(e.getSeconds(), 2)}`;
	let r = "", i = so(t);
	for (let a = 0; a < t.length;) {
		let o = co(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += lo(o, e, n, i), a += o.length;
	}
	return r;
}
function so(e) {
	for (let t = 0; t < e.length;) {
		let n = co(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function co(e, t) {
	for (let n of ao) if (e.startsWith(n, t)) return n;
	return null;
}
function lo(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return T(t.getFullYear(), 4);
		case "yy": return T(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return T(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return T(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return T(i, 2);
		case "H": return String(i);
		case "hh": return T(a, 2);
		case "h": return String(a);
		case "mm": return T(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return T(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function T(e, t) {
	return String(e).padStart(t, "0");
}
//#endregion
//#region src/interactions/temporal-dom.ts
var E = "ui-temporal-input", uo = "ui-temporal-input__value-input", fo = "ui-temporal-input__end-value-input", po = "data-ui-temporal-range", mo = "data-ui-temporal-mode", ho = "data-ui-temporal-format", go = "data-ui-temporal-default-format", _o = "data-ui-temporal-min", vo = "data-ui-temporal-max", yo = "data-ui-temporal-step", bo = "data-ui-temporal-step-unit", xo = /* @__PURE__ */ new Set([
	ho,
	_o,
	vo
]), So = 2e3;
function Co(e) {
	let t = e.getAttribute(mo);
	return t === "time" || t === "date-time" ? t : "date";
}
function wo(e) {
	let t = e.getAttribute(ho);
	return t === null || t.trim().length === 0 ? e.getAttribute(go) ?? "" : t;
}
function To(e) {
	let t = e.getAttribute(bo), n = Math.max(1, Math.trunc(Number(e.getAttribute(yo))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Eo(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Do(e) {
	return {
		monthNames: Oo(e, "data-ui-temporal-months"),
		monthGenitiveNames: Oo(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: Oo(e, "data-ui-temporal-months-short"),
		dayNames: Oo(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: Oo(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function Oo(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function D(e) {
	return e.hasAttribute(po);
}
function ko(e) {
	return e !== null && e.hasAttribute("data-ui-temporal-end");
}
function Ao(e) {
	return O(e, !1);
}
function O(e, t) {
	let n = jo(e, t);
	return n === null ? null : Ho(n.value, Co(e));
}
function jo(e, t) {
	return e.querySelector(`.${t ? fo : uo}`);
}
function Mo(e, t) {
	return Ho(e.getAttribute(t) ?? "", Co(e));
}
function No(e, t, n) {
	let r = jo(e, n);
	if (r === null) return;
	let i = t === null ? "" : Uo(t, Co(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Po(e) {
	if (!D(e)) return;
	let t = O(e, !1), n = O(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (No(e, n, !1), No(e, t, !0));
}
function Fo(e) {
	Io(e, !1), D(e) && Io(e, !0);
}
function Io(e, t) {
	let n = O(e, t);
	if (n === null) return;
	let r = Ro(e, n);
	r.getTime() !== n.getTime() && No(e, r, t);
}
function Lo(e) {
	return zo(e, Ro(e, /* @__PURE__ */ new Date()));
}
function Ro(e, t) {
	let n = Mo(e, _o), r = Mo(e, vo);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function zo(e, t) {
	let n = To(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Bo = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?/, Vo = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Ho(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Vo.exec(n);
		return e === null ? null : new Date(So, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Bo.exec(n);
	return r === null ? null : new Date(Number(r[1]), Number(r[2]) - 1, Number(r[3]), Number(r[4] ?? "0"), Number(r[5] ?? "0"), Number(r[6] ?? "0"));
}
function Uo(e, t) {
	let n = `${Wo(e.getHours())}:${Wo(e.getMinutes())}:${Wo(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Wo(e.getMonth() + 1)}-${Wo(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Wo(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Go(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = qo(n, e.start);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Jo(e.start).getTime() ? {
		start: qo(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: qo(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Ko(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Jo(e).getTime();
	return r > Jo(t).getTime() && r < Jo(n).getTime();
}
function qo(e, t) {
	return t === null ? new Date(e.getFullYear(), e.getMonth(), e.getDate()) : new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Jo(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Yo = "ui-temporal-input__field", Xo = "ui-temporal-input__popup", Zo = "ui-temporal-input--open", Qo = "ui-temporal-input__day", $o = "ui-temporal-input__month", k = "ui-temporal-input__time-cell", es = "ui-temporal-input__time-column", ts = 4, ns = 140, rs = "data-ui-temporal-toggle", is = "data-ui-temporal-first-day", as = "data-ui-temporal-nav", os = "data-ui-temporal-day", ss = "data-ui-temporal-unit", cs = "data-ui-temporal-cell", ls = "data-ui-temporal-centred", us = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	openPicker = null;
	columnSettle = 0;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${E}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyDisplay(this.options.dom?.findComponentParts(t, e.dynamicParameters, ".ui-temporal-input") ?? []);
		}), S(this.root, `.${E}`, { attributeFilter: [...xo] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), new or({
			root: this.root,
			openPopups: () => this.openPicker === null ? [] : [this.openPicker],
			close: () => this.close()
		});
	}
	applyDisplay(e) {
		for (let t of e) {
			Fo(t);
			for (let e of t.querySelectorAll(`.${Yo}`)) {
				if (e === document.activeElement) continue;
				let n = ks(t, ko(e))?.value ?? "", r = Ho(n, Co(t));
				if (r !== null) {
					e.value = oo(r, wo(t), Do(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Yo)) return;
		let t = e.target.closest(`.${E}`), n = t === null ? null : ks(t, ko(e.target));
		t !== null && n !== null && (n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), Po(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Yo)) return;
		let t = e.target.closest(`.${E}`);
		t !== null && D(t) && (this.getState(t).activeEnd = ko(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !D(t) || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${os}]`) : null;
		if (n !== null && !t.contains(n)) return;
		let r = this.getState(t), i = n === null ? null : Ho(n.getAttribute(os) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Ds(t, r));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Yo)) return;
		let t = e.target.closest(`.${E}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${rs}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${E}`));
			return;
		}
		let n = e.target.closest(`.${Xo}`)?.closest(`.${E}`);
		if (n == null) return;
		let r = e.target.closest(`[${as}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(as) ?? "");
			return;
		}
		let i = e.target.closest(`[${os}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(os) ?? "");
			return;
		}
		let a = e.target.closest(`[${cs}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${ss}]`)?.getAttribute(ss);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(cs)));
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
				n.view = Gs(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Gs(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, Lo(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), D(e) && this.commit(e, null, !0), n.activeEnd = "start", this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = Ho(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (D(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = Ao(e) ?? Lo(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = Hs(a), this.commit(e, a), Co(e) === "date" && this.close();
	}
	choosePeriodDay(e, t, n) {
		let r = Lo(e), i = Go({
			start: O(e, !1),
			end: O(e, !0)
		}, t.activeEnd, As(n, r));
		if (t.focusedDay = i.end ?? i.start, t.view = Hs(n), t.activeEnd = i.active, t.hoverDay = null, No(e, i.end, !0), No(e, i.start, !1), this.applyDisplay([e]), i.complete && Co(e) === "date") {
			this.close();
			return;
		}
		this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = D(e) && this.getState(e).activeEnd === "end", i = new Date(O(e, r) ?? Lo(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		No(e, t, n), Po(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Yo)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${E}`), ko(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(k)) {
			Ns(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Qo)) return;
		let n = Ho(e.target.getAttribute(os) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Uo(n, "date"));
			return;
		}
		let r = Bs(n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Hs(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${es}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettle), this.columnSettle = window.setTimeout(() => this.chooseCentredTime(t), ns));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(ls));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(ss), i = Ss(e);
		if (!(r === null || i === null || i.classList.contains(`${k}--selected`))) {
			if (i.matches(":disabled")) {
				bs(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(cs)));
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
		n.activeEnd = D(e) ? t ?? (O(e, !1) === null ? "start" : O(e, !0) === null ? "end" : n.activeEnd) : "start", n.hoverDay = null;
		let r = O(e, n.activeEnd === "end") ?? Ao(e);
		n.pane = "days", n.view = Hs(r ?? Ro(e, /* @__PURE__ */ new Date())), n.focusedDay = r, e.classList.add(Zo), e.querySelector(`[${rs}]`)?.setAttribute("aria-expanded", "true"), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = e.querySelector(`.${Xo}`);
		window.clearTimeout(this.columnSettle), t !== null && lr(Os(e, this.getState(e).activeEnd === "end"), t), e.classList.remove(Zo), e.querySelector(`[${rs}]`)?.setAttribute("aria-expanded", "false"), x(t), this.openPicker = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${E}__row`), n = e.querySelector(`.${Xo}`);
		t !== null && n !== null && In(t, n, {
			placement: "bottom-end",
			gap: ts
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: Hs(Ao(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: Ao(e),
			activeEnd: "start",
			hoverDay: null
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${Xo}`);
		if (n === null) return;
		let r = Co(e), i = this.getState(e), a = Do(e), o = D(e), s = O(e, o && i.activeEnd === "end"), c = Cs(n);
		n.replaceChildren(), o && n.append(Es(i));
		let l = A("div", `${E}__panes`);
		l.append(ds(e, i, a, s)), r === "date-time" && l.append(ms(e, s)), n.append(l, Ts(r, o)), Ms(n, i, s, t), Ds(e, i), ys(n), bs(n), ws(n, c), this.positionPopup(e);
	}
};
function ds(e, t, n, r) {
	let i = A("div", `${E}__calendar`), a = A("div", `${E}__calendar-header`);
	a.append(js("previous", "‹", y.text("ui.picker.previous")));
	let o = js("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${E}__calendar-label`), a.append(o), a.append(js("next", "›", y.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? fs(e, t, n, r) : ps(t, n)), i;
}
function fs(e, t, n, r) {
	let i = zs(e), a = A("div", `${E}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = A("span", `${E}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = A("div", `${E}__days`), s = Vs(/* @__PURE__ */ new Date()), c = D(e), l = c ? O(e, !1) : r, u = c ? O(e, !0) : null, d = Us(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = Ws(d, n), i = A("button", Qo);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(os, Uo(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${Qo}--outside`), Ks(r, s) && i.classList.add(`${Qo}--today`), (l !== null && Ks(r, l) || u !== null && Ks(r, u)) && (i.classList.add(`${Qo}--selected`), i.setAttribute("aria-selected", "true")), Ko(r, l, u) && i.classList.add(`${Qo}--within`), Ls(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = A("div", `${E}__calendar-pane`);
	return f.append(a, o), f;
}
function ps(e, t) {
	let n = A("div", `${E}__months`);
	for (let r = 0; r < 12; r++) {
		let i = A("button", $o);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(as, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${$o}--selected`), n.append(i);
	}
	return n;
}
function ms(e, t) {
	let n = To(e), r = A("div", `${E}__time`), i = A("div", `${E}__time-columns`);
	for (let r of hs(n)) i.append(vs(e, r, gs(n, r), t));
	return r.append(i), r;
}
function hs(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function gs(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function _s(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function vs(e, t, n, r) {
	let i = A("div", es);
	i.setAttribute(ss, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", y.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = _s(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = A("button", k);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(cs, String(c)), c === o && (n.classList.add(`${k}--selected`), n.setAttribute("aria-selected", "true")), Rs(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function ys(e) {
	let t = e.querySelector(`.${E}__calendar`), n = e.querySelector(`.${E}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function bs(e) {
	for (let t of e.querySelectorAll(`.${es}`)) {
		let e = t.querySelector(`.${k}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, xs(t, e), t.setAttribute(ls, String(t.scrollTop));
	}
}
function xs(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function Ss(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${k}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Cs(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(k) ? null : t.closest(`.${es}`)?.getAttribute(ss) ?? null;
}
function ws(e, t) {
	t !== null && e.querySelector(`.${es}[${ss}="${t}"]`)?.querySelector(`.${k}--selected`)?.focus({ preventScroll: !0 });
}
function Ts(e, t) {
	let n = A("div", `${E}__popup-footer`);
	return n.append(js("now", y.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), n.append(js("clear", y.text("ui.picker.clear"))), (e === "date-time" || t) && n.append(js("done", y.text("ui.picker.done"))), n;
}
function Es(e) {
	let t = A("div", `${E}__period-caption`);
	return t.textContent = y.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Ds(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? O(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Qo}`)) {
		let e = Ho(t.getAttribute(os) ?? "", "date");
		t.classList.toggle(`${Qo}--preview`, e !== null && n !== null && r !== null && Ko(e, n, Ws(r, 1)));
	}
}
function Os(e, t) {
	for (let n of e.querySelectorAll(`.${Yo}`)) if (ko(n) === t) return n;
	return e.querySelector(`.${Yo}`);
}
function ks(e, t) {
	return e.querySelector(`.${t ? fo : uo}`);
}
function As(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function js(e, t, n) {
	let r = A("button", `${E}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(as, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function A(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Ms(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Qo}`)];
	if (i.length === 0) return;
	let a = Uo(Vs(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(os) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (o.tabIndex = 0, r && o.focus({ preventScroll: !0 }));
}
function Ns(e) {
	let t = e.target, n = t.closest(`.${es}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? Fs(n, e.key === "ArrowRight" ? 1 : -1) : Ps(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), Is(r));
}
function Ps(e, t, n) {
	return zi({
		key: n,
		items: [...e.querySelectorAll(`.${k}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function Fs(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${es}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${k}--selected`) ?? r.querySelector(`.${k}:not(:disabled)`);
}
function Is(e) {
	let t = e.closest(`.${es}`);
	t !== null && xs(t, e);
}
function Ls(e, t) {
	let n = Mo(e, _o), r = Mo(e, vo);
	return n !== null && t.getTime() < Vs(n).getTime() || r !== null && t.getTime() > Vs(r).getTime();
}
function Rs(e, t, n, r) {
	let i = Mo(e, _o), a = Mo(e, vo);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function zs(e) {
	let t = Number(e.getAttribute(is));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Bs(e, t) {
	switch (t) {
		case "ArrowLeft": return Ws(e, -1);
		case "ArrowRight": return Ws(e, 1);
		case "ArrowUp": return Ws(e, -7);
		case "ArrowDown": return Ws(e, 7);
		case "PageUp": return Gs(e, -1);
		case "PageDown": return Gs(e, 1);
		case "Home": return Ws(e, -e.getDay());
		case "End": return Ws(e, 6 - e.getDay());
		default: return null;
	}
}
function Vs(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
function Hs(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function Us(e, t) {
	let n = Hs(e);
	return Ws(n, -((n.getDay() - t + 7) % 7));
}
function Ws(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Gs(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Ks(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var qs = "[data-ui-theme-switcher]", Js = "data-ui-theme", Ys = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(qs) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: pt.SetTheme,
				mode: Xs() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function Xs() {
	let e = document.documentElement.getAttribute(Js);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var Zs = "data-ui-context-menu-owner", Qs = "data-ui-context-menu", $s = "ui-context-menu--open", ec = "[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]", tc = class {
	root;
	openMenu = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), document.addEventListener("click", (e) => this.handleInside(e), !1), new or({
			root: this.root,
			openPopups: () => this.openMenu === null ? [] : [this.openMenu],
			close: () => this.close(),
			onPress: !0,
			onWindowBlur: !0
		});
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Zs}]`);
		if (t === null) return;
		let n = t.querySelector(`[${Qs}]`);
		n === null || n.closest(`[${Zs}]`) !== t || nc(t) || (e.preventDefault(), this.close(), this.open(n, e.clientX, e.clientY));
	}
	open(e, t, n) {
		e.classList.add($s), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${Xn(t, r.width, window.innerWidth)}px`, e.style.top = `${Xn(n, r.height, window.innerHeight)}px`, e.querySelector(sr)?.focus({ preventScroll: !0 });
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(ec) !== null || this.close();
	}
	close() {
		this.openMenu !== null && (this.openMenu.classList.remove($s), this.openMenu = null);
	}
};
function nc(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/dialog-engine.ts
var rc = "data-ui-dialog", ic = "data-ui-dialog-modal", ac = "data-ui-dialog-close-backdrop", oc = "data-ui-dialog-close-escape", sc = "data-ui-dialog-backdrop", cc = "ui-dialog__surface", lc = class {
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
		return this.root.querySelector(`[${rc}="${t}"]`);
	}
	focusInitial(e) {
		let t = e.querySelector(sr);
		if (t !== null) {
			t.focus();
			return;
		}
		e.querySelector(`.${cc}`)?.focus();
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${sc}]`);
		if (n === null) return;
		let r = n.closest(`[${rc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(ac)) return;
		let i = r.getAttribute(rc);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(oc) && !ir()) {
				let n = t.getAttribute(rc);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(ic) && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(ct)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return uc(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(sr)].filter((e) => Vi(e) || e === document.activeElement);
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
function uc(e) {
	let t = e.querySelectorAll(`[${rc}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function dc(e) {
	let t = uc(e);
	return t !== null && t.hasAttribute(ic) ? t : null;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function fc(e) {
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
		default: o = vc(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function pc(e, t, n = hc()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var mc = null;
function hc() {
	return mc === null && (mc = gc()), mc;
}
function gc() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function _c(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function vc(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : yc[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : yc[t] ?? null;
}
var yc = {
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
}, bc = "ui-menu", xc = "ui-menu-item", Sc = "ui-menu-item--selected", Cc = "ui-context-menu", wc = "ui-orientation--horizontal", Tc = "data-ui-menu-item-kind", Ec = `[${Tc}="header"], [${Tc}="separator"]`, Dc = "data-ui-menu-shortcut", Oc = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleNavigationKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.applyTabStops(), this.root instanceof Node && new MutationObserver(() => {
			this.shortcutsStale = !0, this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Dc]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${bc}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && Bi(t, t.find((e) => e.classList.contains(Sc)) ?? t.find(Vi) ?? t[0]);
		}
	}
	handleNavigationKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xc}`), n = t?.closest(`.${bc}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n), i = zi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(wc) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), Bi(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xc}`), n = t?.closest(`.${bc}`) ?? null;
		t !== null && n !== null && Bi(this.ownItems(n), t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || kc(e))) return;
		let t = dc(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !pc(n.shortcut, e))) {
			if (!Vi(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${Dc}]`)) {
			if (e.closest(`.${Cc}`) !== null) continue;
			let t = fc(e.getAttribute(Dc));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(Dc)
				});
				continue;
			}
			let n = _c(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(Dc),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return C(e, `.${xc}:not(${Ec})`, `.${bc}`);
	}
};
function kc(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var Ac = "ne.ui", jc = "boot", Mc = /* @__PURE__ */ new Set(), Nc = class {
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
		let r = this.resolveKey(e, jc);
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
		let n = e.getAttribute(se);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Mc.has(n) || (Mc.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Ac}:${n}:${t}`;
	}
}, Pc = "ui-menu", Fc = "ui-menu--nested", Ic = "ui-menu-item", Lc = "ui-menu-item--selected", Rc = "ui-menu__item", zc = "ui-menu__submenu", Bc = je, Vc = Ne, Hc = "data-ui-menu-flyout", Uc = Me, Wc = "data-ui-menu-item-kind", Gc = "menu-open-group", Kc = class {
	root;
	store = new Nc();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), new or({
			root: this.root,
			openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
			close: () => this.closeFlyout()
		}), this.reconcileEach(this.root.querySelectorAll(`.${Pc}`)), S(this.root, `.${Pc}`, {
			childList: !0,
			attributeFilter: [Ae]
		}, (e) => this.reconcileEach(e));
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = qc(t), n = this.seenCollapsed.get(t);
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
		let t = this.groupOf(e.querySelector(`.${Lc}`), e);
		if (t !== null && !t.hasAttribute(Uc)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Fc) ? null : this.store.read(e, Gc), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ic}`);
		if (t !== null && this.openFlyout !== null && this.openFlyout.contains(t)) {
			t.getAttribute(Wc) !== "check" && this.closeFlyout();
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
		let r = n.closest(`.${Pc}`);
		r !== null && (qc(r) || n.hasAttribute(Uc) ? this.toggleFlyout(r, n, t) : this.toggleInline(r, n));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Fc);
		if (t.hasAttribute(Vc)) {
			t.removeAttribute(Vc), n || this.store.write(e, Gc, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Gc, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(Vc, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Bc}][${Vc}]`)) t.hasAttribute(Uc) || t.removeAttribute(Vc);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(Vc, ""), r.setAttribute(Hc, ""), this.openFlyout = r, In(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, x(e), e.removeAttribute(Hc), e.parentElement?.removeAttribute(Vc));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Bc}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		let t = e.closest(`.${Rc}`);
		return t !== null && t.hasAttribute(Bc) ? t : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Bc}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${zc}`);
	}
};
function qc(e) {
	return e.hasAttribute(Ae);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var Jc = "ui-collapsible", Yc = "ui-collapsible__content", Xc = "collapsed", Zc = 200, Qc = "cubic-bezier(0.4, 0, 0.2, 1)", $c = class {
	root;
	store = new Nc();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Jc}`)), S(this.root, `.${Jc}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, Xc);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pe}]`), n = t?.closest(`.${Jc}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(Ae), i = n.querySelector(`:scope > .${Yc}`);
		this.cancelFold(n);
		let a = tl(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Xc, r ? "true" : "false", r ? { attributes: { [Ae]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Ae, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Pe}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let i = el(e), a = tl(e, t);
		if (n.component === a.component) return;
		e.setAttribute(Fe, "");
		let o = {
			duration: Zc,
			easing: Qc
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
			this.folds.get(e) === s && (this.folds.delete(e), e.removeAttribute(Fe));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Fe);
			for (let e of t) e.cancel();
		}
	}
};
function el(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function tl(e, t) {
	let n = el(e);
	return {
		component: e.getBoundingClientRect()[n],
		content: t?.getBoundingClientRect()[n] ?? 0
	};
}
//#endregion
//#region src/rendering/responsive-tier.ts
var nl = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], rl = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function il(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${rl[t]}px)`)) return t;
	return "base";
}
function al(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function j(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function ol(e, t) {
	let n;
	for (let r of nl) {
		let i = j(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/pointer-drag.ts
var sl = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), e.root.addEventListener("focusout", (e) => cl(e.target), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.options.resolveHandle(e.target);
		if (t === null) return;
		let n = this.options.begin(t);
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(Xe, ""), t.setAttribute(Ze, ""), t.focus({ preventScroll: !0 }), this.drag = {
				handle: t,
				context: n,
				origin: e[this.options.coordinate(n)],
				pointerId: e.pointerId
			};
		}
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { context: t, origin: n } = this.drag;
		this.options.move(t, e[this.options.coordinate(t)] - n);
	}
	handlePointerEnd(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { handle: t, context: n } = this.drag;
		this.drag = null, t.removeAttribute(Xe), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (cl(e.target), !(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r } = this.drag;
		this.drag = null, this.options.move(n, 0), t.removeAttribute(Xe);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
function cl(e) {
	e instanceof Element && e.hasAttribute("data-ui-pointer-focus") && e.removeAttribute(Ze);
}
//#endregion
//#region src/interactions/grid-tracks.ts
function ll(e) {
	let t = [];
	for (let n of fl(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = ll(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = ul(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function ul(e) {
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
	if (n !== null) return dl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return dl(r[3] === "fr" ? {
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
function dl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function fl(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function pl(e) {
	return e.map(ml).join(" ");
}
function ml(e) {
	switch (e.kind) {
		case "px": return `${hl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${hl(e.min)}px`}, ${hl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? "auto" : `fit-content(${hl(e.max)}px)` : `minmax(${hl(e.min)}px, auto)`;
	}
}
function hl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function gl(e) {
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
function _l(e, t) {
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
function vl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = yl(r, e), o = yl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function yl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function bl(e, t, n, r) {
	let i = xl(e, t, n.before), a = xl(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = El(n.before, e) + El(n.after, e), r = i.total + a.total;
		Sl(l, e, i, t * (i.total + c) / r), Sl(l, e, a, t * (a.total - c) / r);
	} else u || Cl(l, i, i.total + c), d || Cl(l, a, a.total - c);
	return l;
}
function xl(e, t, n) {
	let r = Tl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Sl(e, t, n, r) {
	let i = El(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Cl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...wl(e[i])
		};
	}
}
function wl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Tl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function El(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Dl(e, t) {
	let n = Tl(t.before, e), r = n + Tl(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var Ol = "ui-grid-splitter", kl = "ui-container", Al = "ui-orientation--vertical", jl = 16, Ml = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Ie,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Nl = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Le,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Pl = class {
	root;
	store = new Nc();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new u();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new sl({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Ol}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${Ol}`)), S(this.root, `.${Ol}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Fl(t);
			e !== null && (this.restore(e, Il(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of nl) {
			let i = r[n], a = al(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ol}`);
		if (t === null || this.drag.active) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Vl(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${Ol}`), n = t === null ? null : Fl(t);
		if (t === null || n === null) return;
		let r = Il(t);
		for (let e of nl) n.style.removeProperty(al(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = bl(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(al(e.axis.split, e.tier), pl(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of nl) {
			let a = al(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Fl(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Il(e), r = il(), i = Ll(t, n, r), a = i === null ? null : ll(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = _l(a, gl(t.getAttribute(n.limits))), s = Rl(t, n), c = zl(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = vl(c, Bl(t, n).map((e) => zl(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = Fl(e);
		if (t === null) return;
		let n = Il(e), r = zl(e, n), i = Rl(t, n), a = Bl(t, n).map((e) => zl(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : vl(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Dl(i, o))));
	}
};
function Fl(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(kl) ? t : null;
}
function Il(e) {
	return e.classList.contains(Al) ? Ml : Nl;
}
function Ll(e, t, n) {
	for (let r = nl.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(al(t.split, nl[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function Rl(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function zl(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Bl(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(Ol) && Il(r) === t && n.push(r);
	return n;
}
function Vl(e) {
	let t = Number(e.getAttribute(Re));
	return Number.isFinite(t) && t > 0 ? t : jl;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Hl = "ui-split-button", Ul = "ui-split-button__main", Wl = "ui-split-button__toggle", Gl = "ui-split-button__menu", Kl = "ui-split-button--open", ql = "ui-menu-item", Jl = "data-ui-menu-item-kind", Yl = 4, Xl = class {
	root;
	open = null;
	returnFocus = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1), new or({
			root: this.root,
			openPopups: () => this.open === null ? [] : [this.open],
			close: () => this.close()
		});
	}
	handleClick(e) {
		let t = Zl(e.target);
		if (t !== null) {
			e.preventDefault(), this.open === t ? this.close() : this.openMenu(t);
			return;
		}
		this.open !== null && e.target instanceof Element && e.target.closest(`.${Ul}`)?.closest(`.${Hl}`) === this.open && this.close();
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Zl(e.target);
		t !== null && this.open !== t && (e.preventDefault(), this.openMenu(t));
	}
	handleChoice(e) {
		if (this.open === null || !(e.target instanceof Element)) return;
		let t = Ql(this.open), n = e.target.closest(`.${ql}`);
		t === null || n === null || !t.contains(n) || n.matches(`[${Jl}="header"], [${Jl}="separator"], [${Jl}="check"]`) || n.parentElement?.hasAttribute("data-ui-menu-group") === !0 || this.close();
	}
	openMenu(e) {
		this.close();
		let t = Ql(e);
		if (t !== null) {
			this.open = e, e.classList.add(Kl);
			for (let t of $l(e)) t.setAttribute("aria-expanded", "true");
			In(e, t, {
				placement: "bottom-end",
				gap: Yl
			}), this.returnFocus = cr(t);
		}
	}
	close() {
		let e = this.open;
		if (e === null) return;
		this.open = null, e.classList.remove(Kl);
		for (let t of $l(e)) t.setAttribute("aria-expanded", "false");
		let t = Ql(e);
		t !== null && (x(t), lr(this.returnFocus, t)), this.returnFocus = null;
	}
};
function Zl(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Wl}, .${Ul}`), n = t?.closest(`.${Hl}`) ?? null;
	return t === null || n === null || t.classList.contains(Ul) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Ql(e) {
	return e.querySelector(`:scope > .${Gl}`);
}
function $l(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/selected-key.ts
function eu(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/button-group-engine.ts
var tu = "ui-button-group", nu = "ui-button-group__item", ru = "ui-button", iu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${tu}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), S(this.root, `.${tu}`, {
			childList: !0,
			attributeFilter: [et]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = au(i);
			i.toggleAttribute($e, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		Bi(n, r ?? n.find(Vi) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nu}`), n = t?.closest(`.${tu}`) ?? null;
		t === null || n === null || t.closest(`.${tu}`) !== n || n.matches(".ui-disabled") || au(t)?.matches(".ui-disabled, :disabled") !== !0 && this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nu} > .${ru}`), n = t?.closest(`.${tu}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(au).filter((e) => e !== null), i = zi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${nu}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		eu(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: et,
			bindingAttribute: nt,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return C(e, `.${nu}`, `.${tu}`);
	}
};
function au(e) {
	return e.querySelector(`:scope > .${ru}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var ou = "ui-accordion", su = "details", cu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${ou}`)), S(this.root, `.${ou}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(ou))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${su}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function lu(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var uu = "ui-tab-overflow", du = "ui-tab-overflow__menu", fu = "ui-tab-overflow__menu--open", pu = "ui-tab-overflow__entry", mu = "ui-tab-overflow__entry--current";
function hu(e) {
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
var gu = class {
	pick;
	menu;
	button = null;
	strip = null;
	constructor(e, t) {
		this.pick = t, this.menu = document.createElement("div"), this.menu.className = du, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), new or({
			root: e,
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
		this.close(), this.menu.replaceChildren(...n.map(_u)), this.menu.parentElement === null && document.body.appendChild(this.menu), this.button = e, this.strip = t, this.menu.classList.add(fu), e.setAttribute("aria-expanded", "true"), In(e, this.menu, {
			placement: "bottom-end",
			gap: 4
		}), (this.menu.querySelector(`.${mu}`) ?? this.menu.querySelector(`.${pu}`))?.focus({ preventScroll: !0 });
	}
	close() {
		this.button !== null && (x(this.menu), this.menu.classList.remove(fu), this.button.setAttribute("aria-expanded", "false"), this.button = null, this.strip = null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${pu}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.strip;
		t !== null && n !== null && r !== null && (this.close(), this.pick(r, n));
	}
};
function _u(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${pu} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(mu, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var M = "ui-tabs", vu = "ui-tab-header", yu = "ui-tab-header--selected", bu = "ui-tab-header--overflowed", xu = "ui-tabs--overflowing", Su = "ui-tabs--no-overflow", Cu = "ui-tabs__strip", wu = "data-ui-tab-key", Tu = "data-ui-tab-page", Eu = class {
	root;
	overflow;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${M}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new gu(this.root, (e, t) => this.select(e, t)), this.applyAll(this.root.querySelectorAll(`.${M}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), S(this.root, `.${M}`, {
			childList: !0,
			attributeFilter: [rt, ...ot]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(wu) ?? "") === t) ?? null;
		if (r !== null && !lu(r)) {
			let t = n.find(lu);
			if (t !== void 0) {
				this.select(e, t.getAttribute(wu) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(wu) ?? "") === t;
			e.classList.toggle(yu, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(lu), i), Bi(n.filter((e) => !e.classList.contains(bu)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(Tu) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${Cu}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		if (r === null || i === null) return;
		if (e.classList.contains(Su)) {
			for (let e of t) e.classList.remove(bu);
			e.classList.remove(xu);
			return;
		}
		this.resizes?.observe(r), e.classList.add(xu);
		let a = hu({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: bu
		});
		e.classList.toggle(xu, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownHeaders(e).filter(lu).map((e) => {
			let t = e.getAttribute(wu) ?? "";
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
		let t = e.target.closest(`.${uu}`), n = t?.closest(`.${M}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${M}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${vu}`);
		if (r === null || r.matches(":disabled, .ui-disabled")) return;
		let i = r.closest(`.${M}`), a = r.getAttribute(wu);
		i !== null && a !== null && r.closest(`.${M}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vu}`), n = t?.closest(`.${M}`) ?? null;
		if (t === null || n === null) return;
		let r = zi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(wu) ?? ""), r.focus());
	}
	select(e, t) {
		eu(e, t, {
			attribute: rt,
			bindingAttribute: nt,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return C(e, `.${vu}`, `.${M}`);
	}
	ownPages(e) {
		return C(e, `[${Tu}]`, `.${M}`);
	}
}, Du = "ui-breadcrumbs", Ou = "ui-breadcrumbs__item", ku = "ui-breadcrumb", Au = "ui-breadcrumb--current", ju = "ui-hidden", Mu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), S(this.root, `.${Du}`, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Du}`)) this.apply(e);
	}
	apply(e) {
		let t = C(e, `.${Ou}`, `.${Du}`).filter((e) => !e.classList.contains(ju)).map((e) => e.querySelector(`.${ku}`)).filter((e) => e !== null && !e.classList.contains(ju)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(Au, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
}, Nu = "ui-color-input", Pu = "ui-color-input--open", Fu = "ui-color-input__popup", Iu = "ui-color-input__text", Lu = "ui-color-input__row", Ru = "ui-color-input__swatch--button", zu = "ui-color-input__value-input", Bu = "ui-color-input__square-thumb", Vu = "ui-color-input__hue-thumb", Hu = "data-ui-color-toggle", Uu = "data-ui-color-tab", Wu = "data-ui-color-tab-selected", Gu = "data-ui-color-pane", Ku = "data-ui-color-pane-selected", qu = "data-ui-color-square", Ju = "data-ui-color-hue", Yu = "data-ui-color-hex", Xu = "data-ui-color-channel", Zu = "data-ui-color-factor", Qu = "data-ui-color-opacity", $u = "data-ui-color-name", ed = "data-ui-color-name-selected", td = "data-ui-color-format", nd = "data-ui-color-readonly", rd = "data-ui-color-variant", id = "data-ui-color-picker", ad = "data-ui-color-palette", od = 4, sd = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	returnFocus = /* @__PURE__ */ new WeakMap();
	openInput = null;
	dragging = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Nu}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Nu}`) ?? []);
		}), S(this.root, `.${Nu}`, {
			childList: !0,
			attributeFilter: [
				td,
				nd,
				rd,
				id,
				ad
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), document.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), document.addEventListener("pointerup", () => this.dragging = null, !0), new or({
			root: this.root,
			openPopups: () => this.openInput === null ? [] : [this.openInput],
			close: (e) => this.setOpen(e, !1)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = hd(e), n = this.states.get(e), r = n?.paneChosen === !0 ? cd(e, n.pane) : ld(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? ud(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Sd(t);
			if (i === null) return n ?? ud(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && dd(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Ed(a, o, s);
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
			...n ?? ud(r),
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
			let [e, a, o] = Ed(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		this.states.set(e, t), N(e, "--ui-color-input-color", t.held ? Td(n, r, i, t.opacity) : "transparent"), N(e, "--ui-color-input-solid", Td(n, r, i, 255)), N(e, "--ui-color-input-on-color", t.held ? fd(n, r, i, t.opacity) : "inherit"), vd(e, t.held ? _d(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), this.applyPalette(e, t), this.applyPanes(e, t);
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${qu}]`), o = e.querySelector(`[${Ju}]`), [s, c, l] = Dd(t.hue, 1, 1);
		if (N(e, "--ui-color-input-hue", Td(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${Bu}`);
			e !== null && (N(e, "left", `${t.saturation * 100}%`), N(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${Vu}`);
			e !== null && N(e, "top", `${t.hue / 360 * 100}%`);
		}
		yd(e, `[${Yu}]`, Cd(n, r, i)), yd(e, `[${Xu}="r"]`, String(n)), yd(e, `[${Xu}="g"]`, String(r)), yd(e, `[${Xu}="b"]`, String(i)), N(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), bd(e, `[${Qu}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${$u}]`)) n.getAttribute($u) === t.name ? n.setAttribute(ed, "") : n.removeAttribute(ed);
		let n = t.name === null ? null : e.querySelector(`[${$u}="${t.name}"]`), r = n === null ? null : Sd(n.style.getPropertyValue("--ui-color-input-chip").trim());
		N(e, "--ui-color-input-base", r === null ? "transparent" : Td(r[0], r[1], r[2], 255)), bd(e, `[${Zu}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${Gu}]`)) n.getAttribute(Gu) === t.pane ? n.setAttribute(Ku, "") : n.removeAttribute(Ku);
		for (let n of e.querySelectorAll(`[${Uu}]`)) n.getAttribute(Uu) === t.pane ? n.setAttribute(Wu, "") : n.removeAttribute(Wu);
	}
	resolveRgb(e, t) {
		if (t.name === null) return Dd(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${$u}="${t.name}"]`), r = n === null ? null : Sd(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? Dd(t.hue, t.saturation, t.value) : xd([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Hu}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${Nu}`));
			return;
		}
		let n = e.target.closest(`[${Uu}]`), r = e.target.closest(`.${Nu}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(Uu), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${$u}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute($u)
			}));
			return;
		}
		let a = r.querySelector(`.${Fu}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${Nu}`);
		if (t !== null) {
			if (e.target.hasAttribute(Zu)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}));
				return;
			}
			e.target.hasAttribute(Qu) && this.commit(t, (t) => ({
				...t,
				opacity: P(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}));
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${Nu}`);
		if (n === null) return;
		if (t.hasAttribute(Yu)) {
			let e = Sd(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Ed(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Xu);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = P(Number(t.value));
		let [l, u, d] = Ed(c.r, c.g, c.b);
		this.commit(n, (e) => ({
			...e,
			hue: l,
			saturation: u,
			value: d,
			name: null
		}));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qu}]`), n = t === null ? e.target.closest(`[${Ju}]`) : null, r = t ?? n;
		if (r === null) return;
		let i = r.closest(`.${Nu}`);
		i !== null && (e.preventDefault(), this.dragging = {
			input: i,
			surface: t === null ? "hue" : "square"
		}, this.applyPointer(e));
	}
	handlePointerMove(e) {
		e instanceof PointerEvent && this.dragging !== null && this.applyPointer(e);
	}
	applyPointer(e) {
		if (this.dragging === null) return;
		let { input: t, surface: n } = this.dragging, r = t.querySelector(n === "square" ? `[${qu}]` : `[${Ju}]`);
		if (r === null) return;
		let i = r.getBoundingClientRect();
		if (n === "hue") {
			let n = Od((e.clientY - i.top) / i.height);
			this.commit(t, (e) => ({
				...e,
				hue: n * 360,
				name: null
			}));
			return;
		}
		let a = Od((e.clientX - i.left) / i.width), o = 1 - Od((e.clientY - i.top) / i.height);
		this.commit(t, (e) => ({
			...e,
			saturation: a,
			value: o,
			name: null
		}));
	}
	commit(e, t) {
		let n = this.states.get(e);
		if (n === void 0 || e.hasAttribute(nd)) return;
		let r = {
			...t(n),
			held: !0
		};
		this.applyState(e, r);
		let i = e.querySelector(`.${zu}`);
		i !== null && (i.value = gd(r, this.resolveRgb(e, r)), i.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	toggle(e) {
		e === null || e.hasAttribute(nd) || !e.hasAttribute(id) && !e.hasAttribute(ad) || this.setOpen(e, !e.classList.contains(Pu));
	}
	setOpen(e, t) {
		let n = e.querySelector(`.${Fu}`);
		if (t && e.hasAttribute(nd) || n === null) return;
		if (this.openInput !== null && this.openInput !== e && this.setOpen(this.openInput, !1), e.classList.toggle(Pu, t), e.querySelector(`[${Hu}]`)?.setAttribute("aria-expanded", t ? "true" : "false"), !t) {
			x(n), this.openInput = null, lr(this.returnFocus.get(e), n), this.returnFocus.delete(e);
			return;
		}
		this.openInput = e, In((e.getAttribute(rd) === "swatch" ? e.querySelector(`.${Ru}`) : e.querySelector(`.${Lu}`)) ?? e, n, {
			placement: "bottom-end",
			gap: od
		});
		let r = cr(n, n.querySelector(`[${Wu}]`));
		r !== null && this.returnFocus.set(e, r);
	}
};
function cd(e, t) {
	return ((t) => e.hasAttribute(t === "picker" ? id : ad))(t) ? t : t === "picker" ? "palette" : "picker";
}
function ld(e) {
	return cd(e, "picker");
}
function ud(e) {
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
function dd(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function fd(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return pd(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function pd(e, t, n) {
	return .2126 * md(e) + .7152 * md(t) + .0722 * md(n);
}
function md(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function hd(e) {
	return e.querySelector(`.${zu}`)?.value.trim() ?? "";
}
function gd(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Cd(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${wd(e.opacity)}`;
}
function _d(e, t, n, r, i) {
	if (e.getAttribute(td) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Cd(t, n, r);
	return i === 255 ? a : `${a}${wd(i)}`;
}
function vd(e, t) {
	for (let n of e.querySelectorAll(`.${Iu}`)) n.textContent !== t && (n.textContent = t);
}
function N(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function yd(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function bd(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function xd(e, t) {
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
function Sd(e) {
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
function Cd(e, t, n) {
	return `#${wd(e)}${wd(t)}${wd(n)}`;
}
function wd(e) {
	return P(e).toString(16).padStart(2, "0").toUpperCase();
}
function Td(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Ed(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function Dd(e, t, n) {
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
function P(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function Od(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var kd = "ui-table", Ad = ".ui-table__resizer", jd = "--ui-table-columns", Md = "--ui-table-sized-columns", Nd = "columns", Pd = 32, Fd = 16, Id = class {
	root;
	store = new Nc();
	restored = /* @__PURE__ */ new WeakSet();
	warner = new u();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new sl({
			root: this.root,
			resolveHandle: (e) => e.closest(Ad),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${kd}`)), S(this.root, `.${kd}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		let t = this.store.read(e, Nd);
		t !== null && e.style.getPropertyValue(Md).length === 0 && e.style.setProperty(Md, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Ad);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Fd;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Ad)?.closest(`.${kd}`) ?? null;
		t !== null && (t.style.removeProperty(Md), this.store.write(t, Nd, null));
	}
	apply(e, t) {
		let n = bl(e.tracks.map((t, n) => n === e.index || n === e.index + 1 ? {
			...t,
			min: Math.max(Pd, t.min ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.index + 1]
		}, t);
		return n !== null && (e.table.style.setProperty(Md, pl(n)), !0);
	}
	remember(e) {
		let t = e.style.getPropertyValue(Md).trim();
		if (t.length === 0) {
			this.store.write(e, Nd, null);
			return;
		}
		this.store.write(e, Nd, t, { styles: { [Md]: t } });
	}
	resolveContext(e) {
		let t = e.closest(`.${kd}`);
		if (t === null) return null;
		let n = t.style.getPropertyValue(Md).trim() || t.style.getPropertyValue(jd).trim(), r = n.length === 0 ? null : ll(n);
		if (r === null) return this.warner.warn(t, "the table's track list could not be read.", { template: n }), null;
		let i = _l(r, gl(t.getAttribute(Ie))), a = getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat).filter((e) => Number.isFinite(e)), o = Number(e.getAttribute(ze));
		return !Number.isInteger(o) || o < 0 || o >= i.length - 1 || a.length < i.length ? (this.warner.warn(t, "the handle's column could not be found in its table.", {
			index: o,
			tracks: i.length,
			sizes: a.length
		}), null) : {
			table: t,
			index: o,
			tracks: i,
			sizes: a
		};
	}
};
//#endregion
//#region src/interactions/drag-marks.ts
function Ld(e, t, n, r, i, a = []) {
	Rd(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Rd(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/inline-rename.ts
function zd(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.value = e.value, Bd(r, n, t);
	let i = !1, a = (t) => {
		if (i) return;
		i = !0;
		let a = r.value.trim();
		r.remove(), n.style.visibility = "", t && a.length > 0 && a !== e.value && e.commit(a), e.done?.();
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
function Bd(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t);
	e.style.left = `${r.left - i.left}px`, e.style.top = `${r.top - i.top}px`, e.style.width = `${r.width}px`, e.style.height = `${r.height}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/row-cursor.ts
var Vd = "data-ui-row-focus", Hd = 0;
function Ud(e) {
	return e.matches(".ui-disabled, [inert]") || e.querySelector(":scope > [data-ui-id][inert], :scope > :not([data-ui-id]) > [data-ui-id][inert]") !== null;
}
function Wd(e) {
	return e.filter((e) => e.getClientRects().length > 0 && !Ud(e));
}
function Gd(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !Ud(e)) ?? Wd(e)[0] ?? null;
}
function Kd(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Vd);
	n.setAttribute(Vd, ""), n.id.length === 0 && (n.id = `ui-row-${++Hd}`), e.setAttribute("aria-activedescendant", n.id), n.scrollIntoView({ block: "nearest" });
}
function qd(e, t, n, r) {
	return zi({
		key: e,
		items: Wd(t),
		current: n,
		axis: r,
		loop: !1
	});
}
function Jd(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function Yd(e, t, n) {
	let r = n.hasAttribute(Vd), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Wd(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && Kd(e, o, s);
	};
}
//#endregion
//#region src/interactions/row-selection.ts
var Xd = "data-ui-bind-selected-keys", Zd = {
	shift: !1,
	ctrl: !1
}, Qd = /* @__PURE__ */ new WeakMap();
function $d(e, t) {
	if (t === null || Qd.has(e)) return;
	let n = df(t);
	n.length > 0 && Qd.set(e, n);
}
function ef(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function tf(e) {
	switch (e.getAttribute(Qe)) {
		case "one": {
			let t = e.getAttribute(et);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(lf(uf(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function nf(e, t) {
	let n = tf(e);
	for (let e of t) e.toggleAttribute($e, n.has(df(e)));
}
function rf(e) {
	return e.filter((e) => e.hasAttribute($e));
}
function af(e, t, n, r) {
	let i = df(n);
	if (i.length === 0 || n.hasAttribute("data-ui-unselectable")) return !1;
	switch (e.getAttribute(Qe)) {
		case "one": return eu(e, i, {
			attribute: et,
			bindingAttribute: nt,
			apply: (e) => nf(e, t)
		}), !0;
		case "many": return of(e, t, n, i, r), !0;
		default: return !1;
	}
}
function of(e, t, n, r, i) {
	let a = uf(e);
	if (a === null) return;
	let o = lf(a), s;
	if (i.shift) {
		let r = cf(t, t.find((t) => df(t) === Qd.get(e)) ?? n, n).map(df);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Qd.set(e, r)) : (s = [r], Qd.set(e, r));
	sf(e, t, s);
}
function sf(e, t, n) {
	let r = uf(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(tt, i), nf(e, t), r.hasAttribute(Xd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function cf(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => e.getClientRects().length > 0 && !Ud(e) && !e.hasAttribute("data-ui-unselectable") && df(e).length > 0);
}
function lf(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function uf(e) {
	return e.querySelector(`:scope > [${pe}]`);
}
function df(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var ff = ".ui-items-view, .ui-table, .ui-tree", pf = ".ui-items-view__item, .ui-table__row, .ui-tree__row", mf = ".ui-items-view, .ui-table", hf = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${ff})[${Qe}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), S(this.root, ff, {
			childList: !0,
			attributeFilter: [
				Qe,
				et,
				tt
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		nf(e, this.ownItems(e));
		let t = e.getAttribute(Qe);
		(t === "one" || t === "many") && (e.tabIndex = 0);
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(pf), r = n?.closest(ff) ?? null;
		return n === null || r === null || n.closest(ff) !== r || !r.matches(t) || r.matches(".ui-disabled") ? null : hi(e.target, n) === null && !Ud(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleClick(e) {
		let t = this.resolveRow(e, ff);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		Kd(n, i, r), n.focus({ preventScroll: !0 }), af(n, i, r, ef(e)) && e.preventDefault();
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, mf);
		t !== null && (e.preventDefault(), Jd(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(pf);
		if (t !== null && hi(e.target, t) !== null) return;
		let n = e.target.closest(mf);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.ownItems(n), i = Gd(r), a = qd(e.key, r, i, n.matches(".ui-orientation--horizontal") ? "both" : "vertical");
		if (a !== null) {
			e.preventDefault(), Kd(n, r, a), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && $d(n, i), af(n, r, a, ef(e)));
			return;
		}
		if (!(i === null || Ud(i))) {
			switch (e.key) {
				case " ":
					if (!af(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					rf(r).includes(i) || af(n, r, i, Zd), Jd(i, "open");
					break;
				case "Delete": {
					let e = gf(r, i);
					if (e.length === 0) return;
					for (let t of e) Jd(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return C(e, pf, ff);
	}
};
function gf(e, t) {
	let n = rf(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute(re));
}
//#endregion
//#region src/interactions/tree-engine.ts
var F = "ui-tree", _f = "ui-tree__row", vf = "ui-tree__row--folded", yf = "ui-tree__row--dragging", bf = "ui-tree__loading", xf = "ui-tree__loading-ring", Sf = "ui-tree-node", Cf = "ui-tree-node__text", wf = "ui-tree-node__toggle", Tf = "ui-tree-node__rename", Ef = ".ui-text__title", Df = "data-ui-tree-drop", Of = "--ui-tree-depth", kf = "expanded", Af = 600, jf = class {
	root;
	store = new Nc();
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(g(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => Pf(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${F}`)), S(this.root, `.${F}`, {
			childList: !0,
			attributeFilter: [
				Be,
				Ve,
				He,
				Ke
			]
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.rowsOf(e), r = e.hasAttribute(Ke), i = /* @__PURE__ */ new Set();
		for (let e of n) {
			let t = Ff(e)?.getAttribute(Be);
			t != null && t.length > 0 && i.add(t);
		}
		let a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Pf(e), o = Ff(e), s = o?.getAttribute("data-ui-tree-parent") ?? "", c = s.length > 0 ? a.get(s) : void 0, l = c === void 0 ? 0 : c.depth + 1, u = c === void 0 || c.shown && c.expanded, d = o?.hasAttribute(Ve) === !0, f = d || i.has(n), p = f && (t[n] ?? o?.hasAttribute("data-ui-tree-expanded") === !0);
			e.style.setProperty(Of, String(l)), e.setAttribute("aria-level", String(l + 1)), e.classList.toggle(vf, !u), e.draggable = r && !e.hasAttribute("data-ui-undraggable"), f ? e.setAttribute("aria-expanded", p ? "true" : "false") : e.removeAttribute("aria-expanded"), (i.has(n) || !d) && e.removeAttribute(We), p && u && d && !i.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(We, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), p || this.requested.delete(e), this.placeLoadingRow(e, l + 1, e.hasAttribute(We), u && p), a.set(n, {
				row: e,
				depth: l,
				shown: u,
				expanded: p
			});
		}
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(bf) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Mf();
		o.style.setProperty(Of, String(t)), o.classList.toggle(vf, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${wf}`) === null && (!r.hasAttribute("data-ui-unselectable") || hi(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || hi(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${_f}`), n = t?.closest(`.${F}`) ?? null;
		return t === null || n === null || t.closest(`.${F}`) !== n || Ud(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_f}`);
		if (t !== null && hi(e.target, t) !== null) return;
		let n = e.target.closest(`.${F}`);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.rowsOf(n), i = Gd(r), a = qd(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, ef(e));
			return;
		}
		if (!(i === null || Ud(i))) {
			switch (e.key) {
				case " ":
					if (!af(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, qd("ArrowDown", r, i, "vertical"), Zd);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), Zd);
					break;
				case "Enter":
					rf(r).includes(i) || af(n, r, i, Zd), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = gf(r, i);
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
		let t = Nf(e), n = t?.closest(`.${F}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		let r = t.hasAttribute("data-ui-selected") ? rf(this.rowsOf(n)).filter((e) => e !== t && e.draggable && e.getClientRects().length > 0) : [];
		Ld(e, n, t, yf, Pf(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(yf));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${F}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${_f}`), a = i !== null && i.closest(`.${F}`) === t ? i : r;
		a !== r && n.some((e) => e === a || this.isUnder(t, a, e)) || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a));
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Af)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${F}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${F}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Df}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(_f) ? Pf(r) : "", a = n.filter((e) => !n.some((n) => n !== e && this.isUnder(t, e, n)));
		this.markDrop(t, null), this.springOpen(t, null), Rd(t, yf), r.classList.contains(_f) && this.expand(t, r);
		for (let e of a) {
			let t = Ff(e)?.querySelector(`.${Cf}`) ?? null;
			t !== null && (t.setAttribute(Ge, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = Nf(e)?.closest(`.${F}`) ?? null;
		t !== null && (Rd(t, yf), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Df}]`)) n !== t && n.removeAttribute(Df);
		t?.setAttribute(Df, "");
	}
	isUnder(e, t, n) {
		let r = Pf(n);
		for (let n = this.parentOf(e, t); n !== null; n = this.parentOf(e, n)) if (Pf(n) === r) return !0;
		return !1;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = Pf(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n, this.store.writeJson(e, kf, i), this.layout(e);
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, kf) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Gd(r);
		Kd(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && $d(e, i), af(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Ff(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => Pf(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${F}`), n = Ff(e), r = n?.querySelector(Ef) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), zd({
			container: n,
			title: r,
			className: Tf,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Ue, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${pe}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(_f) && n.push(e);
		return n;
	}
};
function Mf() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = bf, e.setAttribute("aria-hidden", "true"), t.className = xf, e.append(t, y.text("ui.tree.loading")), e;
}
function Nf(e) {
	return e.target instanceof Element ? e.target.closest(`.${_f}`) : null;
}
function Pf(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function Ff(e) {
	return e.querySelector(`.${Sf}`);
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var I = "ui-tabs-view", If = "ui-tab-item", Lf = "ui-tab-item__label", Rf = "ui-tab-item__close", zf = "ui-tab-item__rename", Bf = "ui-tab-item__caption", Vf = ".ui-text__title", Hf = "ui-tab-item--dragging", Uf = "ui-tab-item__caption--overflowed", Wf = "ui-tabs-view--overflowing", Gf = "ui-tabs-view--no-overflow", Kf = "ui-tab-item__page", qf = "ui-tab-item--selected", Jf = "data-ui-tabs-renamable", Yf = "--ui-tabs-view-strip", Xf = class {
	root;
	overflow;
	dragStart = null;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${I}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new gu(this.root, (e, t) => this.select(e, t)), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(g(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => L(e) === t.key))?.querySelector(`.${Lf}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), S(this.root, `.${I}`, {
			childList: !0,
			attributeFilter: [
				rt,
				oe,
				...ot
			]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${I}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(lu);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => L(e) === r)) {
			this.select(e, L(n[0]));
			return;
		}
		let i = e.hasAttribute(oe), a = [], o = null, s = null;
		for (let e of t) {
			let t = L(e) === r;
			e.classList.toggle(qf, t);
			let c = e.querySelector(`.${Bf}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${Lf}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${Kf}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${Kf}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${Lf}`);
			t === null || e.classList.contains(Uf) || (c.push(t), e === o && (l = t));
		}
		Bi(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !lu(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(Yf, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${pe}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${uu}`);
		if (r === null || i === null) return;
		if (this.resizes?.observe(r), e.classList.contains(Gf)) {
			for (let e of t) e.classList.remove(Uf);
			e.classList.remove(Wf);
			return;
		}
		e.classList.add(Wf);
		let a = hu({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: Uf
		});
		e.classList.toggle(Wf, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownItems(e).filter(lu).map((e) => ({
			key: L(e),
			title: e.querySelector(`.${Lf}`)?.textContent?.trim() ?? L(e),
			current: L(e) === n
		}));
		this.overflow.open(t, e, r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${uu}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(I)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Lf}`), i = r?.closest(`.${I}`) ?? null;
		if (r === null || i === null || r.matches(":disabled, .ui-disabled")) return;
		let a = r.closest(`.${If}`);
		a !== null && a.closest(`.${I}`) === i && (e.preventDefault(), this.select(i, L(a)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Rf}`), r = n?.closest(`.${If}`) ?? null, i = r?.closest(`.${I}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), i.hasAttribute("data-ui-tabs-unremovable") || Zf(r).hasAttribute("data-ui-unremovable") || r.hasAttribute("data-ui-unremovable") || r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lf}`), n = t?.closest(`.${I}`) ?? null;
		t === null || n === null || !n.hasAttribute(Jf) || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Vf) ?? e, r = e.closest(`.${If}`);
		t === null || r === null || Zf(r).hasAttribute("data-ui-unrenamable") || zd({
			container: t,
			title: n,
			className: zf,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(at, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => e.focus()
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lf}`), n = t?.closest(`.${I}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute(Jf)) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${Lf}`)).filter((e) => e !== null), i = zi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${If}`);
		a !== null && this.select(n, L(a)), i.focus();
	}
	handleDragStart(e) {
		let t = $f(e);
		if (t === null) return;
		if (Zf(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Ld(e, t.closest(`.${I}`) ?? t, t, Hf, L(t));
		let n = Zf(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Bf}`)?.closest(`.${If}`) ?? null, n = t?.closest(`.${I}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Hf}`);
		if (r === null || r === t) return;
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move");
		let i = t.querySelector(`.${Bf}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = e.clientX < i.left + i.width / 2, o = Zf(r), s = Zf(t);
		s.parentElement?.insertBefore(o, a ? s : s.nextElementSibling);
	}
	handleDragEnd(e) {
		let t = $f(e);
		if (t === null) return;
		t.classList.remove(Hf);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Zf(t), n.next);
			return;
		}
		this.commitOrder(t);
	}
	commitOrder(e) {
		let t = Zf(e), n = ep(Qf(t.previousElementSibling)), r = ep(Qf(t.nextElementSibling)), i = n === null && r === null ? 0 : n === null ? r - 1 : r === null ? n + 1 : (n + r) / 2;
		ep(e) !== i && (e.setAttribute(it, String(i)), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	select(e, t) {
		eu(e, t, {
			attribute: rt,
			bindingAttribute: nt,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return C(e, `.${If}`, `.${I}`);
	}
};
function Zf(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Qf(e) {
	return e === null ? null : e.matches(`.${If}`) ? e : e.querySelector(`.${If}`);
}
function $f(e) {
	return e.target instanceof Element ? e.target.closest(`.${Bf}`)?.closest(`.${If}`) ?? null : null;
}
function ep(e) {
	let t = e?.getAttribute("data-ui-tab-order") ?? null;
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function L(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var tp = "button.ui-text__fold-toggle", np = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(tp);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, rp = "ui-temporal-input__segments", ip = "ui-temporal-input__segment", ap = "ui-temporal-input__segment-literal", op = "ui-temporal-input__segment--empty", sp = "data-ui-temporal-segment", cp = "data-ui-temporal-step-direction", lp = "data-ui-temporal-readonly", up = "data-ui-temporal-segments-of", dp = "--", fp = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${E}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, ".ui-temporal-input") ?? []);
		}), S(this.root, `.${E}`, { attributeFilter: [...xo] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("wheel", (e) => this.handleWheel(e), {
			capture: !0,
			passive: !1
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Co(t) === "time" && (Fo(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${rp}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = wo(e), r = Do(e), i = O(e, ko(t));
		t.getAttribute(up) !== n && (t.replaceChildren(...pp(n).map((e) => hp(e))), t.setAttribute(up, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(sp);
			if (t === null) {
				n.textContent = gp(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = _p(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(op, i === null), n.tabIndex = e.hasAttribute(lp) ? -1 : 0, vp(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = bp(e.target);
		if (t === null) return;
		let n = t.closest(`.${E}`), r = t.getAttribute(sp), i = yp(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), Sp(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), No(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = Cp(e.key, Do(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleWheel(e) {
		if (!(e instanceof WheelEvent)) return;
		let t = bp(e.target);
		if (t === null || t !== document.activeElement) return;
		e.preventDefault();
		let n = t.closest(`.${E}`);
		this.resetBuffer(n), this.applyStep(n, t.getAttribute(sp), e.deltaY < 0 ? 1 : -1, yp(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${cp}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${cp}]`);
		if (t === null) return;
		let n = t.closest(`.${E}`);
		if (n === null || n.hasAttribute(lp)) return;
		e.preventDefault();
		let r = xp(n) ?? n.querySelector(`.${ip}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(sp), t.getAttribute(cp) === "up" ? 1 : -1, yp(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${ip}`) : null;
		if (t === null) return;
		let n = t.closest(`.${E}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = O(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = wp(t), o = Eo(To(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Tp(i, a) + o) % s + s) % s;
		this.write(e, Ep(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Ep(t, "hour", Dp(l, t.getHours() >= 12)) : Ep(t, wp(n), l), i);
		}
		u && Sp(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, Ep(r, "hour", Dp(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return O(e, t) ?? Lo(e);
	}
	write(e, t, n) {
		No(e, Ro(e, t), n), Po(e), this.applySegments(e);
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
function pp(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = co(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(mp(r)), n += r.length;
	}
	return t;
}
function mp(e) {
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
function hp(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = ap, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = ip, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(sp, e.unit), t.dataset.width = String(e.width), t;
}
function gp(e, t, n, r) {
	return t && n !== null ? oo(n, e, r) : e;
}
function _p(e, t, n, r) {
	if (n === null) return dp;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : Tp(n, wp(e));
	return String(i).padStart(t, "0");
}
function vp(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(Tp(n, wp(t))));
}
function yp(e) {
	return ko(e.closest(`.${rp}`));
}
function bp(e) {
	let t = e instanceof Element ? e.closest(`.${ip}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${E}`);
	return n === null || n.hasAttribute(lp) ? null : t;
}
function xp(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${ip}`) : null;
}
function Sp(e, t, n) {
	zi({
		key: n,
		items: [...e.querySelectorAll(`.${ip}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function Cp(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function wp(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function Tp(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Ep(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Dp(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var Op = "data-ui-scroll-anchor", kp = 4, Ap = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), S(this.root, `[${Op}="End"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ke]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !jp(t) || this.pinned.set(t, Mp(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${Op}="End"]`));
	}
	followEach(e) {
		for (let t of e) this.pinned.get(t) !== !1 && (this.pinned.set(t, !0), Mp(t) || (t.scrollTop = t.scrollHeight));
	}
};
function jp(e) {
	return e.getAttribute(Op) === "End";
}
function Mp(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= kp;
}
//#endregion
//#region src/interactions/press-ripple-engine.ts
var Np = ".ui-button, .ui-action, .ui-menu-item", Pp = "ui-pressing", Fp = "--ui-press-x", Ip = "--ui-press-y", Lp = 250, Rp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Np);
		if (t === null || t.matches(":disabled, .ui-disabled, [inert]")) return;
		let n = t.getBoundingClientRect();
		t.style.setProperty(Fp, `${e.clientX - n.left}px`), t.style.setProperty(Ip, `${e.clientY - n.top}px`), t.classList.remove(Pp), t.offsetWidth, t.classList.add(Pp), window.setTimeout(() => t.classList.remove(Pp), Lp);
	}
}, zp = "mask:", Bp = "ui-icon--image";
function Vp(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(zp) && (n = !0, t = t.slice(5).trim()), Hp(t) ? {
		source: t,
		tinted: n
	} : null;
}
function Hp(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function Up(e) {
	let t = Vp(e);
	return t === null ? "" : Wp(t.source);
}
function Wp(e) {
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
var Gp = "ui-icon-glyph--";
function Kp(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Gp;
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
//#region src/rendering/inline-markup.ts
var R = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, qp = "\\", Jp = "`", Yp = "!", Xp = "{", Zp = "}", Qp = "ui-text__fold", $p = "ui-text__fold-toggle", em = "ui-text__fold-content";
function tm(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return fm(e, 0, e.length, R.None, null, t, n), pm(t, n, R.None, null), t;
}
function nm(e) {
	return tm(e).map((e) => om(e) ? `${e.fold} ${nm(e.text)}` : e.text).join("");
}
function rm(e, t, n = {}) {
	let r = tm(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && im(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(sm(r, n));
}
function im(e) {
	return e.styles === R.None && e.url === null && !am(e) && !om(e);
}
function am(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function om(e) {
	return e.fold !== null && e.fold !== void 0;
}
function sm(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(cm(r, t));
	return n;
}
function cm(e, t) {
	if (am(e)) return um(e.icon);
	let n = om(e) ? lm(e, t) : document.createTextNode(e.text);
	if ((e.styles & R.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & R.Strikethrough) !== 0 && (n = dm("s", n)), (e.styles & R.Underline) !== 0 && (n = dm("u", n)), (e.styles & R.Italic) !== 0 && (n = dm("em", n)), (e.styles & R.Bold) !== 0 && (n = dm("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", wm(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function lm(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Qp} ${Qp}--static` : Qp, r.className = $p, r.textContent = e.fold ?? "", i.className = em, i.append(sm(tm(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(de, ""), n.append(r, i), n);
}
function um(e) {
	let t = document.createElement("i");
	return t.className = `ui-icon ui-text__icon-inline ${Kp(e)}`.trim(), t.setAttribute("data-ui-icon", ""), t.setAttribute("aria-hidden", "true"), t;
}
function dm(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function fm(e, t, n, r, i, a, o) {
	let s = t;
	for (; s < n;) {
		let t = e[s];
		if (t === qp && s + 1 < n && Tm(e[s + 1])) {
			o.value += e[s + 1], s += 2;
			continue;
		}
		let c = mm(e, s, n);
		if (c !== null) {
			pm(a, o, r, i), hm(e, s + 1, c, o), pm(a, o, r | R.Code, i), s = c + 1;
			continue;
		}
		let l = ym(e, s, n);
		if (l !== null) {
			pm(a, o, r, i), fm(e, s + l.markerLength, l.contentEnd, r | l.style, i, a, o), pm(a, o, r | l.style, i), s = l.contentEnd + l.markerLength;
			continue;
		}
		let u = gm(e, s, n);
		if (u !== null) {
			pm(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: u.name
			}), s = u.iconEnd;
			continue;
		}
		let d = i === null ? xm(e, s, n) : null;
		if (d !== null) {
			pm(a, o, r, i), fm(e, d.labelStart, d.labelEnd, r, d.url, a, o), pm(a, o, r, d.url), s = d.linkEnd;
			continue;
		}
		let f = Cm(e, s, n);
		if (f !== null) {
			pm(a, o, r, i), a.push({
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
function pm(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function mm(e, t, n) {
	if (e[t] !== Jp) return null;
	let r = t + 1;
	if (r >= n || Em(e[r])) return null;
	let i = bm(e, r, n, Jp, 1);
	return i > r ? i : null;
}
function hm(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === qp && i + 1 < n && Tm(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function gm(e, t, n) {
	if (e[t] !== Yp || t + 1 >= n || e[t + 1] !== "[") return null;
	let r = t + 2, i = _m(e, r, n);
	if (i <= r) return null;
	let a = e.slice(r, i);
	return vm(a) ? {
		name: a,
		iconEnd: i + 1
	} : null;
}
function _m(e, t, n) {
	for (let r = t; r < n; r++) {
		if (e[r] === qp) {
			r++;
			continue;
		}
		if (e[r] === "]") return r;
	}
	return -1;
}
function vm(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function ym(e, t, n) {
	let r = e[t];
	if (r !== "*" && r !== "_" && r !== "~") return null;
	let i = t + 1 < n && e[t + 1] === r, a, o;
	if (r === "*" && i) a = R.Bold, o = 2;
	else if (r === "*") a = R.Italic, o = 1;
	else if (r === "_" && i) a = R.Underline, o = 2;
	else if (r === "~" && i) a = R.Strikethrough, o = 2;
	else return null;
	let s = t + o;
	if (s >= n || Em(e[s])) return null;
	let c = bm(e, s, n, r, o);
	return c > s ? {
		style: a,
		markerLength: o,
		contentEnd: c
	} : null;
}
function bm(e, t, n, r, i) {
	for (let a = t; a + i <= n; a++) {
		if (e[a] === qp) {
			a++;
			continue;
		}
		if (e[a] === r && !(i === 2 && (a + 1 >= n || e[a + 1] !== r)) && !(i === 1 && a + 1 < n && e[a + 1] === r) && a > t && !Em(e[a - 1])) return a;
	}
	return -1;
}
function xm(e, t, n) {
	if (e[t] !== "[") return null;
	let r = _m(e, t + 1, n);
	if (r < 0 || r + 1 >= n || e[r + 1] !== "(") return null;
	let i = e.indexOf(")", r + 2);
	if (i < 0 || i >= n) return null;
	let a = e.slice(r + 2, i).trim();
	if (!Sm(a)) return null;
	let o = t + 1, s = r;
	return s > o ? {
		labelStart: o,
		labelEnd: s,
		url: a,
		linkEnd: i + 1
	} : null;
}
function Sm(e) {
	if (e == null || e.trim().length === 0) return !1;
	for (let t of e) {
		let e = t.codePointAt(0) ?? 0;
		if (e < 32 || e === 127 || Em(t)) return !1;
	}
	if (e[0] === "/" || e[0] === "#" || e[0] === "?" || e[0] === ".") return !0;
	let t = e.indexOf(":");
	if (t < 0) return !0;
	let n = e.slice(0, t).toLowerCase();
	return n === "http" || n === "https" || n === "mailto" || n === "tel";
}
function Cm(e, t, n) {
	if (e[t] !== "[") return null;
	let r = _m(e, t + 1, n);
	if (r <= t + 1 || r + 1 >= n || e[r + 1] !== Xp) return null;
	for (let n = t + 1; n < r; n++) if (e[n] === qp) n++;
	else if (e[n] === "[") return null;
	let i = r + 2, a = -1, o = 1;
	for (let t = i; t < n && a < 0; t++) {
		if (e[t] === qp) {
			t++;
			continue;
		}
		e[t] === Xp ? o++ : e[t] === Zp && --o === 0 && (a = t);
	}
	if (a <= i) return null;
	let s = { value: "" };
	return hm(e, t + 1, r, s), {
		caption: s.value,
		contentStart: i,
		contentEnd: a
	};
}
function wm(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function Tm(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Xp || e === Zp || e === Jp || e === qp;
}
function Em(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Dm = "data-ui-tooltip", Om = "data-ui-tooltip-placement", km = "ui-tooltip", Am = "ui-tooltip--visible", jm = "top", Mm = 250, Nm = 200, Pm = 300, Fm = 7, z = null, B = null, Im = 0, Lm = 0, Rm = 0, zm = !1;
function Bm(e = document) {
	if (zm) return;
	zm = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", Vm, !0), t.addEventListener("pointerout", Hm, !0), t.addEventListener("focusin", Um, !0), t.addEventListener("focusout", Wm, !0), t.addEventListener("keydown", Gm, !0), t.addEventListener("pointerdown", (e) => {
		Km(e.target) || Zm(!0);
	}, !0), window.addEventListener("blur", () => Zm(!0));
}
function Vm(e) {
	if (Km(e.target)) {
		window.clearTimeout(Lm);
		return;
	}
	let t = qm(e.target);
	t !== null && t !== B && Jm(t);
}
function Hm(e) {
	let t = e.relatedTarget;
	t instanceof Node && (B !== null && B.contains(t) || Km(t)) || (Km(e.target) || qm(e.target) === B) && Zm(!1);
}
function Um(e) {
	let t = qm(e.target);
	t !== null && Ym(t);
}
function Wm(e) {
	qm(e.target) === B && Zm(!0);
}
function Gm(e) {
	e.key === "Escape" && B !== null && Zm(!0);
}
function Km(e) {
	return z !== null && e instanceof Node && z.contains(e);
}
function qm(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Dm}]`);
	return t === null ? null : (t.getAttribute(Dm) ?? "").trim().length > 0 ? t : null;
}
function Jm(e) {
	if (window.clearTimeout(Lm), window.clearTimeout(Im), B !== null) {
		Zm(!0), Ym(e);
		return;
	}
	if (Date.now() - Rm < Pm) {
		Ym(e);
		return;
	}
	Im = window.setTimeout(() => Ym(e), Mm);
}
function Ym(e) {
	let t = (e.getAttribute(Dm) ?? "").trim();
	if (t.length === 0 || !e.isConnected) return;
	window.clearTimeout(Im), window.clearTimeout(Lm);
	let n = Qm();
	rm(n, t, { staticFolds: !0 }), n.classList.add(Am), B = e, e.setAttribute("aria-describedby", n.id), n.setAttribute("data-ui-tooltip-text", nm(t)), In(e, n, {
		placement: Xm(e),
		gap: Fm
	});
}
function Xm(e) {
	let t = e.getAttribute(Om);
	return t !== null && An(t) ? t : jm;
}
function Zm(e) {
	window.clearTimeout(Im), window.clearTimeout(Lm);
	let t = () => {
		B !== null && (B.removeAttribute("aria-describedby"), B = null, z !== null && (z.classList.remove(Am), x(z)), Rm = Date.now());
	};
	e ? t() : Lm = window.setTimeout(t, Nm);
}
function Qm() {
	return z !== null && z.isConnected ? z : (z = document.createElement("div"), z.id = "ui-tooltip", z.className = km, z.setAttribute("role", "tooltip"), z.setAttribute("aria-hidden", "true"), document.body.append(z), z);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var V = { ok: !1 };
function $m(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => ht(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
	for (; l < i.length;) {
		let t = i[l];
		if (t === ".") {
			if (u) return V;
			u = !0, l++;
			continue;
		}
		if (t === "[") {
			if (l + 1 >= i.length || i[l + 1] !== "]" || c >= a.length) return V;
			let t = a[c];
			if (c++, ht(t.kind) === "Dynamic") {
				let n = th(e, t.componentId);
				if (!n.ok) return V;
				o = n.value, s = !0;
			} else {
				if (!s) return V;
				let e = oh(o, t.value);
				if (!e.ok) return V;
				o = e.value;
			}
			l += 2, u = !1;
			continue;
		}
		let n = l;
		for (; l < i.length && i[l] !== "." && i[l] !== "[";) l++;
		if (l === n) return V;
		if (s) {
			let e = nh(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? V : {
		ok: !0,
		value: o
	};
}
var eh = /* @__PURE__ */ new Set();
function th(e, t) {
	let n = g(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return eh.has(n) || (eh.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), V;
}
function nh(e, t) {
	if (e == null) return V;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return V;
	let n = e, r = rh(n, t);
	return Object.prototype.hasOwnProperty.call(n, r) ? {
		ok: !0,
		value: n[r]
	} : V;
}
function rh(e, t) {
	if (Object.prototype.hasOwnProperty.call(e, t)) return t;
	let n = ih(t);
	if (Object.prototype.hasOwnProperty.call(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function ih(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function ah(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => ht(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, ht(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = g(e.componentId);
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
function oh(e, t) {
	if (e == null || t == null) return V;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : V;
	if (typeof t != "string") return V;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.prototype.hasOwnProperty.call(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (ch(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return V;
}
function sh(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (ch(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.prototype.hasOwnProperty.call(r, t) ? (r[t] = n, !0) : !1;
}
function ch(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var lh = `:scope > [${_e}], :scope > [${ve}], :scope > [${Se}]`, uh = "ui-hidden";
function H(e) {
	let t = new Set(e.querySelectorAll(lh));
	return [...e.children].filter((e) => !t.has(e));
}
function dh(e) {
	return e === null ? [] : [e];
}
function fh(e) {
	return e.querySelector(`:scope > [${_e}]`);
}
function ph(e, t, n, r, i) {
	i ??= H(e).some((e) => !e.classList.contains(uh));
	let a = fh(e);
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
	c.setAttribute(_e, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/items-filter-sort.ts
function mh(e) {
	let t = e.closest(ct)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function hh(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = mh(e);
	if (a !== void 0 || o !== null) for (let n of H(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(uh);
			continue;
		}
		n.classList.toggle(uh, !gh(a, e, i, o));
	}
}
function gh(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => bh(e, t, n)) && (r?.filters ?? []).every((e) => xn(Sh(t, e.itemProperty), e.operator, e.value));
}
function _h(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => xh(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function vh(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => yh(n.getItemValue(e), n.getItemValue(r), t));
}
function yh(e, t, n) {
	for (let r of n) {
		let n = Ch(Sh(e, r.itemProperty), Sh(t, r.itemProperty));
		if (n !== 0) return bt(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function bh(e, t, n) {
	if (!xh(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return xn(Sh(t, e.itemProperty), e.operator, r);
}
function xh(e, t, n, r) {
	return e == null || xn(r.get(e, []), t, n);
}
function Sh(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = nh(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Ch(e, t) {
	if (e === t) return 0;
	if (e == null) return -1;
	if (t == null) return 1;
	if (typeof e == "number" && typeof t == "number") return e - t;
	let n = Number(e), r = Number(t);
	return !Number.isNaN(n) && !Number.isNaN(r) ? n - r : String(e).localeCompare(String(t));
}
//#endregion
//#region src/items/items-host-mode.ts
function wh(e) {
	switch (e.getAttribute(xe)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-dom-order.ts
function Th(e, t) {
	let n = e.firstElementChild;
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var Eh = /* @__PURE__ */ new WeakMap();
function Dh(e, t) {
	let n = Eh.get(e), r = n === void 0 ? [...t] : Oh(n, t);
	return Eh.set(e, r), r;
}
function Oh(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function kh(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Ah(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function jh(e, t, n) {
	return Ah(e, t), kh(e, t, n);
}
function Mh(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Nh(e) {
	Eh.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var Ph = /* @__PURE__ */ new WeakMap();
function Fh(e) {
	for (let t of e.querySelectorAll(`[${ve}]`)) t.remove();
}
function Ih(e, t, n, r, i, a) {
	let o = wh(e) === "windowed", s = H(e), c = o ? s : Dh(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : _h(f, a, mh(e));
	if (u && !d && Fh(e), c.length === 0) {
		Ph.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = fh(e);
	if (!d) {
		Th(e, [...vh(c, p, r), ...dh(ee)]);
		return;
	}
	Fh(e);
	let m = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = m.get(t);
		n === void 0 ? m.set(t, [e]) : n.push(e);
	}
	let te = (Ph.get(e) ?? []).filter((e) => m.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		te.includes(t) || te.push(t);
	}
	Ph.set(e, te);
	let ne = [];
	for (let e of te) {
		let t = m.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = vh(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = Lh(l, r, t[0]);
				e !== null && ne.push(e);
			}
			ne.push(...t);
		}
	}
	Th(e, [...ne, ...dh(ee)]);
}
function Lh(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(ve, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
function Rh(e, t, n) {
	switch (wh(e)) {
		case "windowed":
			ph(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			hh(e, t, n.metadata, n.renderer, n.state), ph(e, t, n.templates, n.renderer), Ih(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/items/items-template-renderer.ts
var zh = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? Vh(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null) : o;
		l !== o && this.moveItemScope(o, l), Hh(l, n, t);
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
		let i = Bh(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: Kt(r),
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
		let r = Kh(t, n.templateKeyPropertyName);
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
		} : { ok: !1 } : $m(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			s("item binding value could not be resolved.", {
				binding: i,
				stack: n
			});
			return;
		}
		let c = o.value ?? i.fallbackValue, l = g(i.componentId), u = e.closest(`[${f}="${l}"]`);
		if (u === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = zt(u, t, () => [e])[0] ?? null;
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
function Bh(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? nh(r, i.name) : oh(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return sh(r, i.key, n), e;
	let a = r;
	return a[rh(a, i.name)] = n, e;
}
function Vh(e, t, n) {
	let r = document.createElement(t);
	return n !== null && (r.className = n), r.appendChild(e), r;
}
function Hh(e, t, n) {
	e.setAttribute(m, t), Gh(e, n), Wh(e, n);
}
var Uh = [
	["CanSelect", te],
	["CanDrag", ne],
	["CanRemove", re],
	["CanRename", ie],
	["CanShowContextMenu", ae]
];
function Wh(e, t) {
	for (let [n, r] of Uh) {
		let i = nh(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function Gh(e, t) {
	let n = nh(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ye, n.value) : e.removeAttribute(ye);
}
function Kh(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = nh(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var qh = "Group", Jh = class {
	sources = /* @__PURE__ */ new Map();
	options;
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = g(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && (e.reactiveSources.watch(t.source, i), this.sources.set(g(t.source.componentId), { reference: t.source }));
		}
		for (let t of sn) e.root.addEventListener(t, (e) => this.handleSourceValueEvent(e), !0);
		S(e.root, `[${me}]`, { attributeFilter: [me] }, (e) => {
			for (let t of e) {
				let e = v(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
	}
	handleSourceValueEvent(e) {
		if (!(e.target instanceof Element)) return;
		let t = v(e.target), n = t === null ? void 0 : this.sources.get(t);
		n !== void 0 && this.options.propertyPatchEngine.applyPropertyValue(n.reference, [], this.options.valueReaders.readBound(e.target), !0);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(g(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : ah(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${pe}]`)) wh(r) === "virtualized" && this.options.virtualization.updateValue(r, n, t.steps, e.value) && Rh(r, v(r) ?? 0, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${lt(t)}"]`)].filter((t) => this.isItemRoot(t) && Ht(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${pe}]`), i = r === null ? null : v(r);
		if (r !== null && i !== null && wh(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && Rh(r, i, this.options);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = Yh(qh, t);
		a && Gh(e, this.options.renderer.getItemValue(e)), Uh.some(([e]) => Yh(e, t)) && Wh(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || Rh(r, i, this.options));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && Yh(qh, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => Yh(e.itemProperty, t)) || n.sorts.some((e) => Yh(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${pe}]`)) {
			let n = v(t);
			n === e && Rh(t, n, this.options);
		}
	}
};
function Yh(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
var Xh = "bottom";
function Zh(e, t, n) {
	let r = e.querySelector(`:scope > [${Se}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Se, t), r.style.flex = "0 0 auto"), t === "top" ? e.firstChild !== r && e.insertBefore(r, e.firstChild) : e.lastChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-window-engine.ts
var Qh = 50, $h = 1, eg = .5, tg = 60, ng = class {
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
			if (this.layout(t), sg(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = ug(e, we);
		t !== null && (e.scrollTop = rg(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.realign(e);
	}
	realign(e) {
		let t = ug(e, we), n = og(e);
		if (t === null || n.length === 0) return;
		let r = this.getState(e), i = Math.floor(e.scrollTop / r.itemSize);
		Math.ceil((e.scrollTop + e.clientHeight) / r.itemSize) >= t && i <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${pe}][${xe}="windowed"]`)];
	}
	handleScroll(e) {
		let t = e.target;
		if (!(t instanceof Element) || wh(t) !== "windowed") return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, tg));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		let n = og(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = ug(e, we), i = rg(e.getAttribute(Ee)), a = rg(e.getAttribute(De));
		if (r !== null) {
			let o = this.windowSize(e), s = Math.max(1, Math.round(e.clientHeight * $h / t.itemSize), Math.floor(o * eg)), c = Math.floor(e.scrollTop / t.itemSize), l = Math.ceil((e.scrollTop + e.clientHeight) / t.itemSize);
			if (l < r || c > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, c, o), null, !1);
				return;
			}
			if (c - s <= r && i) {
				this.requestAsync(e, "Before", 0, cg(n[0]), !0);
				return;
			}
			if (l + s >= r + n.length && a) {
				this.requestAsync(e, "After", 0, cg(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Math.max(1, e.clientHeight * $h), s = e.scrollHeight - e.scrollTop - e.clientHeight;
		if (e.scrollTop <= o && i) {
			this.requestAsync(e, "Before", 0, cg(n[0]), !0);
			return;
		}
		s <= o && a && this.requestAsync(e, "After", 0, cg(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = ug(e, Te);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = v(e);
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
				dynamicParameters: lg(e),
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
		let t = this.getState(e), n = og(e);
		if (n.length > 0) {
			let e = ag(n[n.length - 1]).bottom - ag(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / ig(n))));
		}
		let r = ug(e, Te), i = ug(e, we), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		Zh(e, "top", a), Zh(e, Xh, o);
	}
	windowSize(e) {
		let t = ug(e, Ce);
		return t !== null && t > 0 ? t : Qh;
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
function rg(e) {
	return e !== null && e.toLowerCase() === "true";
}
function ig(e) {
	let t = ag(e[0]).top, n = 1;
	for (; n < e.length && ag(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function ag(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function og(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function sg(e) {
	return og(e).length;
}
function cg(e) {
	return e.getAttribute(m);
}
function lg(e) {
	let t = e.closest(ct);
	return t === null ? [] : Vt(t, Bt(t));
}
function ug(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/state/value-equality.ts
function dg(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && fg(e, t) : pg(e, t);
}
function fg(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!dg(e[n], t[n])) return !1;
	return !0;
}
function pg(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !dg(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var mg = [
	f,
	p,
	ee
];
function hg(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, gg(c, e.itemRole);
	let l = vg(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = _g(l, t, n, a);
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
		d.className = l.wrapperClassName, gg(d, l.wrapperRole), d.appendChild(u), Hh(d, r, n), c.appendChild(d);
	}
	return Hh(c, r, n), o.registerItemScope(c, l, n), c;
}
function gg(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function _g(e, t, n, r) {
	let i = Kh(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function vg(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of mg) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), Kt(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function yg(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e)?.composite;
	return a == null ? i.renderer.renderItem(e, t, n, r) : hg(a, e, t, n, r, i.templates, i.renderer);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var bg = 6, xg = 60, Sg = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = jp(e) && Mp(e);
		this.project(e, t), this.layout(e, t), n && !Mp(e) && (e.scrollTop = e.scrollHeight, this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return;
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && dg(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = H(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Yd(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = Bh(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = mh(e), i = this.options.templates.getGroupTemplate(t.componentId), a = _h(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => gh(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => wg(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => yh(e.item, t.item, a))), t.projected = o.map((e) => ({
				id: e.key,
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = wg(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => yh(e.item, t.item, a))), e !== "" && l.push({
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
		let t = e.target;
		if (!(t instanceof Element) || wh(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, xg));
	}
	layout(e, t) {
		let n = t.projected, r = Eg(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (Tg(e) && a > 0) {
			let t = e.scrollTop, n = t + e.clientHeight, r = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let c = r + i[e];
				if (o === a && c > t && (o = e), r >= n) {
					s = e;
					break;
				}
				r = c;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - bg), s = Math.min(a, s + bg);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(wg(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), Cg(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (Cg(t, r, d), l.push(d), u = !0);
		}
		for (let t of H(e)) l.includes(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${ve}]`)) l.includes(t) || (t.remove(), u = !0);
		let d = Dg(i, 0, o), f = Dg(i, s, a);
		Th(e, [...l, ...dh(fh(e))]), Zh(e, "top", d > 0 ? d - r : 0), Zh(e, Xh, f > 0 ? f - r : 0), ph(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return yg(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(ve, ""), r);
	}
	measure(e, t, n, r) {
		let i = 0, a = 0, o = 0, s = 0;
		for (let c = n; c < r && c < t.length; c++) {
			let n = t[c], r = n.header ? e.headers.get(wg(n.entry)) : n.entry, l = r?.element;
			if (r == null || l == null) continue;
			let u = l.getBoundingClientRect().height;
			u <= 0 || (r.height = u, n.header ? (o += u, s++) : (i += u, a++));
		}
		a > 0 && (e.itemEstimate = i / a), s > 0 && (e.headerEstimate = o / s);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(wg(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = v(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = [], i = /* @__PURE__ */ new Map();
		for (let t of H(e)) {
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
function Cg(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = wg(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function wg(e) {
	let t = nh(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function Tg(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function Eg(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function Dg(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var Og = "data-ui-template", kg = "default", Ag = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? kg, r = this.findTemplate(e, n);
		return r === void 0 ? n === kg ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${Og}]`);
		for (let e of r) if (e.getAttribute(Og) === t) return e;
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, he);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, ge);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
}, jg = "script[type='application/json'][data-ui-metadata]";
function Mg(e = document) {
	let t = e.querySelector(jg);
	if (t === null) return Ng();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return Ng();
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
function Ng() {
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
var Pg = "script[type='application/json'][data-ui-hydration]";
function Fg(e = document) {
	let t = e.querySelector(Pg)?.textContent?.trim() ?? "";
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
var Ig = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(Lg(Rg(e)));
	}
	async dispatchAsync(e) {
		let t = Rg(e), n = Lg(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		try {
			return await this.transport.processEventAsync(t);
		} finally {
			this.pendingKeys.delete(n);
		}
	}
};
function Lg(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function Rg(e) {
	return {
		eventId: Pt(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var zg = class {
	values = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t));
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n) {
		let r = this.createKey(e, t), i = this.values.get(r);
		return this.values.has(r) && dg(i, n) ? !1 : (this.values.set(r, n), !0);
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
		return `${g(e.componentId)}:${e.propertyId}:${Bg(t)}`;
	}
};
function Bg(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var Vg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, Hg = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, U = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Ug = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Wg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Gg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, Kg = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, qg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, Jg = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Yg = class {
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
}, W;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(W ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var Xg = class {
	constructor() {}
	log(e, t) {}
};
Xg.instance = new Xg();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var Zg = "10.0.11", G = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, K = class e {
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
function Qg(e, t) {
	let n = "";
	return e_(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${$g(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function $g(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function e_(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function t_(e, t, n, r, i, a) {
	let o = {}, [s, c] = a_();
	o[s] = c, e.log(W.Trace, `(${t} transport) sending data. ${Qg(i, a.logMessageContent)}.`);
	let l = e_(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(W.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function n_(e) {
	return e === void 0 ? new i_(W.Information) : e === null ? Xg.instance : e.log === void 0 ? new i_(e) : e;
}
var r_ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, i_ = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${W[e]}: ${t}`;
			switch (e) {
				case W.Critical:
				case W.Error:
					this.out.error(n);
					break;
				case W.Warning:
					this.out.warn(n);
					break;
				case W.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function a_() {
	let e = "X-SignalR-User-Agent";
	return K.isNode && (e = "User-Agent"), [e, o_(Zg, s_(), l_(), c_())];
}
function o_(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function s_() {
	if (K.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function c_() {
	if (K.isNode) return process.versions.node;
}
function l_() {
	return K.isNode ? "NodeJS" : "Browser";
}
function u_(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function d_() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var f_ = class extends Yg {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || K.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(d_());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new U();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new U();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(W.Warning, "Timeout from HTTP request."), n = new Hg();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, e_(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(W.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new Vg(await p_(i, "text") || i.statusText, i.status);
		let a = await p_(i, e.responseType);
		return new Jg(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return K.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function p_(e, t) {
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
var m_ = class extends Yg {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new U()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (e_(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new U());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new Jg(r.status, r.statusText, r.response || r.responseText)) : n(new Vg(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(W.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new Vg(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(W.Warning, "Timeout from HTTP request."), n(new Hg());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, h_ = class extends Yg {
	constructor(e) {
		if (super(), typeof fetch < "u" || K.isNode) this._httpClient = new f_(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new m_(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new U()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, g_ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
g_.RecordSeparatorCode = 30, g_.RecordSeparator = String.fromCharCode(g_.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var __ = class {
	writeHandshakeRequest(e) {
		return g_.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (e_(e)) {
			let r = new Uint8Array(e), i = r.indexOf(g_.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(g_.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = g_.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var v_ = class {
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
		return this.observers.push(e), new r_(this, e);
	}
}, y_ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			e_(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new b_(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, e_(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === q.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: q.Sequence,
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
			case q.Invocation:
			case q.StreamItem:
			case q.Completion:
			case q.StreamInvocation:
			case q.CancelInvocation: return !0;
			case q.Close:
			case q.Sequence:
			case q.Ping:
			case q.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: q.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, b_ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, x_ = 3e4, S_ = 15e3, C_ = 1e5, J;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(J ||= {});
var w_ = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(W.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, G.isRequired(e, "connection"), G.isRequired(t, "logger"), G.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? x_, this.keepAliveIntervalInMilliseconds = a ?? S_, this._statefulReconnectBufferSize = o ?? C_, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new __(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = J.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: q.Ping });
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
		if (this._connectionState !== J.Disconnected && this._connectionState !== J.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== J.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = J.Connecting, this._logger.log(W.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), K.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = J.Connected, this._connectionStarted = !0, this._logger.log(W.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = J.Disconnected, this._logger.log(W.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(W.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(W.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new y_(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(W.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === J.Disconnected) return this._logger.log(W.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === J.Disconnecting) return this._logger.log(W.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = J.Disconnecting, this._logger.log(W.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(W.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === J.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new U("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new v_();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === q.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === q.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case q.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(W.Error, `Invoke client method threw error: ${u_(e)}`);
					});
					break;
				case q.StreamItem:
				case q.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === q.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(W.Error, `Stream callback threw error: ${u_(e)}`);
						}
					}
					break;
				}
				case q.Ping: break;
				case q.Close: {
					this._logger.log(W.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case q.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case q.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(W.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(W.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(W.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(W.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === J.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === J.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(W.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(W.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(W.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(W.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(W.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(W.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(W.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new U("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === J.Disconnecting ? this._completeClose(e) : this._connectionState === J.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === J.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = J.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), K.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(W.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(W.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = J.Reconnecting, e ? this._logger.log(W.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(W.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(W.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== J.Reconnecting) {
				this._logger.log(W.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(W.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== J.Reconnecting) {
				this._logger.log(W.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = J.Connected, this._logger.log(W.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(W.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(W.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== J.Reconnecting) {
					this._logger.log(W.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === J.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(W.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(W.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(W.Error, `Stream 'error' callback called with '${e}' threw error: ${u_(t)}`);
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
			type: q.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: q.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: q.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: q.Invocation
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
			type: q.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: q.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: q.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: q.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: q.Completion
		} : {
			invocationId: e,
			result: n,
			type: q.Completion
		};
	}
	_createCloseMessage() {
		return { type: q.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, T_ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], E_ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? T_ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, D_ = class {};
D_.Authorization = "Authorization", D_.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var O_ = class extends Yg {
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
		e.headers ||= {}, this._accessToken ? e.headers[D_.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[D_.Authorization] && delete e.headers[D_.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Y;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Y ||= {});
var X;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(X ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var k_ = class {
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
}, A_ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new k_(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (G.isRequired(e, "url"), G.isRequired(t, "transferFormat"), G.isIn(t, X, "transferFormat"), this._url = e, this._logger.log(W.Trace, "(LongPolling transport) Connecting."), t === X.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = a_(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === X.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(W.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(W.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new Vg(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(W.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(W.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(W.Trace, `(LongPolling transport) data received. ${Qg(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(W.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(W.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new Vg(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof Hg ? this._logger.log(W.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(W.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(W.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? t_(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(W.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(W.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = a_();
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
			i ? i instanceof Vg && (i.statusCode === 404 ? this._logger.log(W.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(W.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(W.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(W.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(W.Trace, e), this.onclose(this._closeError);
		}
	}
}, j_ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return G.isRequired(e, "url"), G.isRequired(t, "transferFormat"), G.isIn(t, X, "transferFormat"), this._logger.log(W.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== X.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (K.isBrowser || K.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = a_();
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
						this._logger.log(W.Trace, `(SSE transport) data received. ${Qg(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(W.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? t_(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, M_ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		G.isRequired(e, "url"), G.isRequired(t, "transferFormat"), G.isIn(t, X, "transferFormat"), this._logger.log(W.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (K.isNode || K.isReactNative) {
				let t = {}, [r, i] = a_();
				t[r] = i, n && (t[D_.Authorization] = `Bearer ${n}`), o && (t[D_.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === X.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(W.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(W.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(W.Trace, `(WebSockets transport) data received. ${Qg(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(W.Trace, `(WebSockets transport) sending data. ${Qg(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(W.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, N_ = 100, P_ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, G.isRequired(t, "url"), this._logger = n_(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (K.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!K.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : K.isNode && !n.WebSocket && r && (n.WebSocket = r), !K.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : K.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new O_(n.httpClient || new h_(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= X.Binary, G.isIn(e, X, "transferFormat"), this._logger.log(W.Debug, `Starting connection with transfer format '${X[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(W.Error, e), await this._stopPromise, Promise.reject(new U(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(W.Error, e), Promise.reject(new U(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new I_(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(W.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(W.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(W.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(W.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === Y.WebSockets) this.transport = this._constructTransport(Y.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new U("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < N_);
				if (r === N_ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof A_ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(W.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(W.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = a_();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(W.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Kg("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof Vg && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(W.Error, t), Promise.reject(new Kg(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(W.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(W.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Gg(`${n.transport} failed: ${e}`, Y[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(W.Debug, e), Promise.reject(new U(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new qg(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Y.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new M_(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Y.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new j_(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Y.LongPolling: return new A_(this._httpClient, this._logger, this._options);
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
		let i = Y[e.transport];
		if (i == null) return this._logger.log(W.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (F_(t, i)) {
			if (e.transferFormats.map((e) => X[e]).indexOf(n) >= 0) {
				if (i === Y.WebSockets && !this._options.WebSocket || i === Y.ServerSentEvents && !this._options.EventSource) return this._logger.log(W.Debug, `Skipping transport '${Y[i]}' because it is not supported in your environment.'`), new Ug(`'${Y[i]}' is not supported in your environment.`, i);
				this._logger.log(W.Debug, `Selecting transport '${Y[i]}'.`);
				try {
					return this.features.reconnect = i === Y.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(W.Debug, `Skipping transport '${Y[i]}' because it does not support the requested transfer format '${X[n]}'.`), /* @__PURE__ */ Error(`'${Y[i]}' does not support ${X[n]}.`);
		}
		return this._logger.log(W.Debug, `Skipping transport '${Y[i]}' because it was disabled by the client.`), new Wg(`'${Y[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(W.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(W.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(W.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(W.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(W.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(W.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(W.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!K.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(W.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function F_(e, t) {
	return !e || (t & e) !== 0;
}
var I_ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new L_(), this._transportResult = new L_(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new L_(), this._transportResult.promise;
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
			this._sendBufferedData = new L_();
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
}, L_ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, R_ = "json", z_ = class {
	constructor() {
		this.name = R_, this.version = 2, this.transferFormat = X.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = Xg.instance);
		let n = g_.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case q.Invocation:
					this._isInvocationMessage(n);
					break;
				case q.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case q.Completion:
					this._isCompletionMessage(n);
					break;
				case q.Ping: break;
				case q.Close: break;
				case q.Ack:
					this._isAckMessage(n);
					break;
				case q.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(W.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return g_.write(JSON.stringify(e));
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
}, B_ = {
	trace: W.Trace,
	debug: W.Debug,
	info: W.Information,
	information: W.Information,
	warn: W.Warning,
	warning: W.Warning,
	error: W.Error,
	critical: W.Critical,
	none: W.None
};
function V_(e) {
	let t = B_[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var H_ = class {
	configureLogging(e) {
		if (G.isRequired(e, "logging"), U_(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = V_(e);
			this.logger = new i_(t);
		} else this.logger = new i_(e);
		return this;
	}
	withUrl(e, t) {
		return G.isRequired(e, "url"), G.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return G.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new E_(e) : e : new E_(), this;
	}
	withServerTimeout(e) {
		return G.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return G.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new P_(this.url, e);
		return w_.create(t, this.logger || Xg.instance, this.protocol || new z_(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function U_(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/signalr-transport.ts
var W_ = 500, G_ = class {
	windowId;
	connection;
	started = !1;
	currentState = "Disconnected";
	attached;
	markAttached = () => {};
	constructor(e, t = {}) {
		this.windowId = e, this.attached = this.createAttachGate(), this.connection = new H_().withUrl(t.hubUrl ?? "/_ui/hub").withAutomaticReconnect([...t.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(W.Warning).build();
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
		if (!(this.started || this.connection.state !== J.Disconnected)) try {
			this.currentState = "Connecting", await this.connection.start(), this.started = !0, this.currentState = "Connected", l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, this.currentState = "Disconnected", c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== J.Disconnected && (await this.connection.stop(), this.started = !1, this.currentState = "Disconnected");
	}
	async attachAsync(e) {
		let t = await this.invokeCoreAsync("AttachAsync", e);
		return this.markAttached(), t;
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
		let n = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), W_);
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
		return new Promise((e) => {
			this.markAttached = e;
		});
	}
	async ensureConnectedAsync() {
		if (this.connection.state !== J.Connected) {
			if (this.connection.state === J.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, K_ = class {
	transport;
	constructor(e) {
		this.transport = e;
	}
	async dispatchAsync(e) {
		return await this.transport.processChangeSetAsync({ updates: [e] });
	}
}, q_ = "data-ui-theme", J_ = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ot(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Ot(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = av(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = Mt(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute(q_) !== n && document.documentElement.setAttribute(q_, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = X_(e);
			t !== null && $_(t);
		}), this.register("ScrollTo", (e) => {
			let t = X_(e);
			if (t === null) return;
			let n = e.effect, r = kt(n.behavior), i = At(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = X_(e);
			if (t === null) return;
			let n = e.effect, r = Nt(n.axis) !== "Horizontal", i = Z_(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = jt(n.position), u;
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
			let d = kt(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			Y_(X_(e), null);
		}), this.register("Hide", (e) => {
			Y_(X_(e), "hidden");
		}), this.register("Collapse", (e) => {
			Y_(X_(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = ev(e, this.valueReaders);
			t !== null && rv(t).catch((e) => s("copy to clipboard failed.", e));
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
function Y_(e, t) {
	if (e !== null) for (let n of ot) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function X_(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(g(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function Z_(e, t) {
	if (Q_(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (Q_(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (Q_(n, t)) return n;
	return null;
}
function Q_(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function $_(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(sr))) {
		e.focus();
		return;
	}
	let t = e.querySelector(sr);
	if (t instanceof HTMLElement) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function ev(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = X_(e);
	if (r === null) return null;
	if (t === void 0) return s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null;
	let i = nv(r);
	return i === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Xt(t.read(i));
}
var tv = "input, textarea, select";
function nv(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(tv) ? e : e.querySelector(`[${be}], ${tv}`);
}
async function rv(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!iv(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function iv(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return document.execCommand("copy");
	} catch {
		return !1;
	} finally {
		t.remove();
	}
}
function av(e) {
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
//#region src/rendering/url-safety.ts
var ov = [
	"http",
	"https",
	"mailto",
	"tel"
];
function sv(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) if (e <= " " || e === "") return !1;
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || ov.includes(t.slice(0, n).toLowerCase());
}
function cv(e) {
	return sv(e) ? String(e) : void 0;
}
function lv(e) {
	let t = String(e ?? "").trim();
	return Hp(t) ? t : void 0;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var uv = /* @__PURE__ */ new Map([
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
]), dv = [
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
function fv(e) {
	return Z(e, dv);
}
var pv = [
	"small",
	"medium",
	"large"
], mv = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], hv = [
	"start",
	"center",
	"end",
	"justify"
], gv = [
	"nowrap",
	"wrap",
	"wrap-ellipsis"
], _v = /* @__PURE__ */ new Map([
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
]), vv = ["inline", "trailing"], yv = [
	"filled",
	"outline",
	"underline",
	"ghost"
], bv = [
	"small",
	"medium",
	"large"
], xv = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], Sv = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], Cv = ["light", "dark"], wv = [
	"start",
	"center",
	"end",
	"stretch"
], Tv = ["clip", "visible"], Ev = [
	"visible",
	"hidden",
	"collapsed"
], Dv = [
	"background",
	"raised",
	"tinted"
], Ov = ["horizontal", "vertical"], kv = [
	"none",
	"gap",
	"rule"
], Av = [
	"none",
	"one",
	"many"
], jv = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], Mv = ["stack", "wrap"], Nv = [
	"disabled",
	"auto",
	"always"
], Pv = [
	"disabled",
	"proximity",
	"mandatory"
], Fv = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Iv = ["hex", "rgb"], Lv = ["field", "swatch"], Rv = [
	"fill",
	"contain",
	"cover",
	"none"
], zv = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Bv = ["linear", "circular"], Vv = ["keep", "replace"], Hv = [
	"none",
	"vertical",
	"horizontal",
	"both"
], Uv = [
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
], Wv = [
	"None",
	"Shade",
	"Tint"
], Gv = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Z(e, dv)}`],
	["themeColorClass", (e) => cy(e)],
	["iconClass", (e) => vy(e)],
	["iconUrlCss", (e) => Up(e)],
	["safeUrl", (e) => cv(e)],
	["safeImageSource", (e) => lv(e)],
	["iconSizeClass", (e) => `ui-icon-size--${Z(e, pv)}`],
	["textTypeClass", (e) => `ui-text-type--${Z(e, mv)}`],
	["textAppearanceClass", (e) => uy(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Z(e, hv)}`],
	["textWrapClass", (e) => `ui-text--${Z(e, gv)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Z(e, vv)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Z(e, Sv)}`],
	["badgeTextFit", (e) => ly(e)],
	["buttonClass", (e) => `ui-button--${Z(e, xv)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Z(e, Dv)}`],
	["orientationClass", (e) => `ui-orientation--${Z(e, Ov)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Z(e, kv)}`],
	["selectionModeAttribute", (e) => Z(e, Av)],
	["selectionBackgroundCss", (e) => oy(ry(e, "background"))],
	["selectionForegroundCss", (e) => oy(ry(e, "foreground"))],
	["selectionMarkColorCss", (e) => oy(ry(e, "markColor"))],
	["selectionMarkCss", (e) => ay(ry(e, "mark"))],
	["selectionFontWeightCss", (e) => iy(ry(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Z(e, Mv)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Z(e, Nv)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Z(e, Nv)}`],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Z(e, Pv)}`],
	["inputAppearanceClass", (e) => `ui-input--${Z(e, yv)}`],
	["buttonSizeClass", (e) => `ui-button--${Z(e, bv)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Z(e, bv)}`],
	["textInputTypeAttribute", (e) => Z(e, Fv)],
	["colorTextFormatAttribute", (e) => Z(e, Iv)],
	["colorInputVariantAttribute", (e) => Z(e, Lv)],
	["themeNameCss", (e) => Z(e, Cv)],
	["alignmentCss", (e) => Z(e, wv)],
	["alignmentStretchFallbackCss", (e) => Z(e, wv) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Z(e, Tv)],
	["layoutLengthCss", (e) => Zv(e)],
	["thicknessCss", (e) => Qv(e)],
	["radiusCss", (e) => $v(e)],
	["gridUnitCss", (e) => ey(e)],
	["pixelsCss", (e) => $(e)],
	["gridTemplateCss", (e) => ty(e)],
	["colorVariantCss", (e) => my(e)],
	["themeColorCss", (e) => oy(e)],
	["themeColorInlineCss", (e) => sy(e) ? "" : oy(e)],
	["themeColorCanonical", (e) => fy(e)],
	["textAppearanceFontSizeCss", (e) => dy(e, "size")],
	["textAppearanceFontWeightCss", (e) => dy(e, "weight")],
	["textAppearanceLineHeightCss", (e) => dy(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => dy(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => Zv(j(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => Zv(j(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => Zv(j(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => Zv(j(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => Zv(j(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => Qv(j(e, "base"))],
	["responsiveThicknessSmCss", (e) => Qv(j(e, "sm"))],
	["responsiveThicknessMdCss", (e) => Qv(j(e, "md"))],
	["responsiveThicknessXlCss", (e) => Qv(j(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => Qv(j(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => by(j(e, "base"))],
	["responsivePixelsSmCss", (e) => by(j(e, "sm"))],
	["responsivePixelsMdCss", (e) => by(j(e, "md"))],
	["responsivePixelsXlCss", (e) => by(j(e, "xl"))],
	["responsivePixelsXxlCss", (e) => by(j(e, "xxl"))],
	["visibilityBaseAttribute", (e) => xy(e, "base")],
	["visibilitySmAttribute", (e) => xy(e, "sm")],
	["visibilityMdAttribute", (e) => xy(e, "md")],
	["visibilityXlAttribute", (e) => xy(e, "xl")],
	["visibilityXxlAttribute", (e) => xy(e, "xxl")],
	["gridPlacementBaseColumnCss", (e) => Q(e, "base", "column")],
	["gridPlacementBaseRowCss", (e) => Q(e, "base", "row")],
	["gridPlacementBaseColumnSpanCss", (e) => Q(e, "base", "columnSpan")],
	["gridPlacementBaseRowSpanCss", (e) => Q(e, "base", "rowSpan")],
	["gridPlacementSmColumnCss", (e) => Q(e, "sm", "column")],
	["gridPlacementSmRowCss", (e) => Q(e, "sm", "row")],
	["gridPlacementSmColumnSpanCss", (e) => Q(e, "sm", "columnSpan")],
	["gridPlacementSmRowSpanCss", (e) => Q(e, "sm", "rowSpan")],
	["gridPlacementMdColumnCss", (e) => Q(e, "md", "column")],
	["gridPlacementMdRowCss", (e) => Q(e, "md", "row")],
	["gridPlacementMdColumnSpanCss", (e) => Q(e, "md", "columnSpan")],
	["gridPlacementMdRowSpanCss", (e) => Q(e, "md", "rowSpan")],
	["gridPlacementXlColumnCss", (e) => Q(e, "xl", "column")],
	["gridPlacementXlRowCss", (e) => Q(e, "xl", "row")],
	["gridPlacementXlColumnSpanCss", (e) => Q(e, "xl", "columnSpan")],
	["gridPlacementXlRowSpanCss", (e) => Q(e, "xl", "rowSpan")],
	["gridPlacementXxlColumnCss", (e) => Q(e, "xxl", "column")],
	["gridPlacementXxlRowCss", (e) => Q(e, "xxl", "row")],
	["gridPlacementXxlColumnSpanCss", (e) => Q(e, "xxl", "columnSpan")],
	["gridPlacementXxlRowSpanCss", (e) => Q(e, "xxl", "rowSpan")],
	["imageFitClass", (e) => `ui-image-fit--${Z(e, Rv)}`],
	["backgroundImageCss", (e) => Kv(e)],
	["imageFitSizeCss", (e) => Z(e, zv)],
	["progressVariantClass", (e) => `ui-progress--${Z(e, Bv)}`],
	["progressValueText", (e) => yy(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Z(e, Vv)}`],
	["textAreaResizeCss", (e) => Z(e, Hv)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Z(e, Uv)}`],
	["popupPlacementAttribute", (e) => Z(e, Uv)]
]);
function Kv(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : Wp(t);
}
var qv = [
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
], Jv = new Map(qv.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), Yv = new Map(qv.map(([e, t]) => [e, t])), Xv = /* @__PURE__ */ new Map([[Tv, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Z(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : Xv.get(t)?.get(e)) ?? uv.get(e) ?? ut(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function Zv(e) {
	if (e == null) return "";
	if (typeof e == "number") return $(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? $(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function Qv(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function $v(e) {
	if (e == null) return "";
	if (typeof e == "number") return $(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? $(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function ey(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return $(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function ty(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return ey(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return ey(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${ey(e[0])})` : e.map((e) => ey(e)).join(" ");
}
function Q(e, t, n) {
	return ny(j(e, t), n);
}
function ny(e, t) {
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
function ry(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function iy(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function ay(e) {
	if (e == null) return "";
	switch (Z(e, jv)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function oy(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (py(e)) return my(e);
	let t = e, n = my(t.light), r = my(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = _v.get(Z(o, dv));
	return s ? `var(${s})` : "";
}
function sy(e) {
	if (typeof e != "object" || !e || py(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function cy(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Z(n, dv)}`;
}
function ly(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function uy(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Z(n, mv)}`;
}
function dy(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return $(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : $(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : $(e);
		}
		default: return "";
	}
}
function fy(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = hy(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Cy(r.rgb >> 16 & 255)}${Cy(r.rgb >> 8 & 255)}${Cy(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Cy(e)}`;
	}
	let i = gy(r.name);
	return i === null ? "" : `${i}/${_y(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function py(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function my(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = gy(t.name), i = n ?? (r === null ? void 0 : Jv.get(r));
	if (!i) return "";
	let a = _y(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = Sy(c * (1 - o)), l = Sy(l * (1 - o)), u = Sy(u * (1 - o))) : a === "Tint" && (c = Sy(c + (255 - c) * o), l = Sy(l + (255 - l) * o), u = Sy(u + (255 - u) * o)), `#${Cy(c)}${Cy(l)}${Cy(u)}${Cy(s)}`;
}
function hy(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = dv[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function gy(e) {
	if (typeof e == "number") return Yv.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function _y(e) {
	if (typeof e == "number") return Wv[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function vy(e) {
	let t = Vp(e);
	return t === null ? Kp(e) : t.tinted ? "" : Bp;
}
function yy(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function $(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function by(e) {
	return e == null ? "" : $(e);
}
function xy(e, t) {
	let n = ol(e, t);
	if (n == null) return;
	let r = Z(n, Ev);
	return r === "visible" ? void 0 : r;
}
function Sy(e) {
	return Math.min(255, Math.max(0, Math.round(e)));
}
function Cy(e) {
	return Sy(e).toString(16).padStart(2, "0").toUpperCase();
}
//#endregion
//#region src/interactions/notification-engine.ts
var wy = "ui-notification-host", Ty = "ui-notification", Ey = "ui-notification--leaving", Dy = "ui-notification__message", Oy = "ui-notification__close", ky = 5e3, Ay = 160, jy = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), My = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? ky;
	}
	show(e) {
		let t = fv(e.severity), n = document.createElement("div");
		n.className = jy.has(t) ? `${Ty} ${Ty}--${t}` : Ty, n.setAttribute("role", t === "danger" ? "alert" : "status"), n.setAttribute("aria-live", t === "danger" ? "assertive" : "polite");
		let r = document.createElement("span");
		r.className = Dy, r.textContent = e.message;
		let i = document.createElement("button");
		i.type = "button", i.className = Oy, i.setAttribute("aria-label", y.text("ui.notification.close")), i.textContent = "×", i.addEventListener("click", () => this.dismiss(n)), n.append(r, i), this.ensureHost().append(n);
		let a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		return n.addEventListener("mouseenter", () => window.clearTimeout(a)), n.addEventListener("mouseleave", () => {
			a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		}), n;
	}
	dismiss(e) {
		!e.isConnected || e.classList.contains(Ey) || (e.classList.add(Ey), window.setTimeout(() => {
			e.remove(), this.host !== null && this.host.childElementCount === 0 && (this.host.remove(), this.host = null);
		}, Ay));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${wy}`);
		if (t !== null) return this.host = t, t;
		let n = document.createElement("div");
		return n.className = wy, e.append(n), this.host = n, n;
	}
}, Ny = class {
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
			let a = this.extensions.converters.convert(t.converter, n);
			for (let o of i) {
				let i = this.addressResolver.resolveOperationTargets(o, t);
				if (i.length === 0) {
					t.optional !== !0 && s("property operation target was not found.", {
						reference: e,
						operation: t
					});
					continue;
				}
				for (let e of i) this.operations.apply({
					resolved: o,
					operation: t,
					target: e,
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
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(le)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		this.state.has(r, t) ? this.applyPropertyValue(r, t, this.state.get(r, t), !1) : rn(e);
	}
	notifyValueChanged(e) {
		for (let t of this.valueChangeHandlers) t(e);
	}
}, Py = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = Fy(g(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = Fy(g(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function Fy(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/updates/collection-sinks.ts
var Iy = class {
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
function Ly(e, t, n, r) {
	return {
		action: Tt(e.action),
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
var Ry = class {
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
		for (let e of this.dom.root.querySelectorAll(`[${pe}]`)) {
			let t = v(e);
			if (t !== null) for (let n of this.metadata.getItemValues(t)) this.registerItemValue(e, n.key, n.item);
		}
		for (let t of e?.updates ?? []) {
			if (Dt(t) !== "CollectionChange") continue;
			let e = t;
			if (Tt(e.action) !== "Insert") continue;
			let n = this.findItemsHost(g(e.component?.id), e.component?.dynamicParameters ?? []);
			if (n !== null) for (let t of e.items ?? []) this.registerItemValue(n, t.key, t.item);
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = Wy(e, t);
		r !== null && this.itemsRenderer.registerItemScope(r, Uy(r), n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${pe}]`)) {
			let t = v(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		Rh(e, t, {
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
			let n = t[e], r = Vy(n, t[e + 1]);
			if (r === null) {
				this.applyUpdate(n);
				continue;
			}
			this.applyCollectionRefill(r), e++;
		}
	}
	applyCollectionRefill(e) {
		let t = this.findItemsHost(e.componentId, e.dynamicParameters);
		if (t === null) {
			s("items host was not found for a collection refill.", e.items);
			return;
		}
		if (wh(t) === "virtualized") {
			this.virtualization.refill(t, e.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			}))), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(t), r = /* @__PURE__ */ new Map();
		for (let e of H(t)) {
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
			if (r.delete(a), o !== null && dg(this.readItemValue(o), t.item)) {
				i.push(o);
				continue;
			}
			let c = this.renderItemElement(e.componentId, t.item, a, n);
			o?.remove(), c !== null && i.push(c);
		}
		for (let e of r.values()) e.remove();
		Hy(t, i), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (Dt(e)) {
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
		let t = g(e.address?.component?.id), n = Et(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (g(e.address?.component?.id) <= 0) {
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
		let t = g(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, Ly(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		let a = this.findItemsHost(t, n);
		if (a === null) {
			(Tt(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		if (wh(a) === "virtualized") {
			this.applyVirtualizedCollectionChange(a, e), this.syncItemsHost(a, t), this.dom.invalidate();
			return;
		}
		switch (Tt(e.action)) {
			case "Insert":
				this.applyCollectionInsert(a, t, e.items ?? []);
				break;
			case "Remove":
				zy(a, e.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(a, t, e.items ?? []);
				break;
			case "Move":
				By(a, e.moves ?? []);
				break;
			case "Reset":
				a.replaceChildren(), Nh(a);
				break;
			default:
				s("collection update action is not supported.", e);
				return;
		}
		this.syncItemsHost(a, t), this.dom.invalidate();
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Tt(t.action)) {
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
		return this.dom.findComponent(e, t)?.querySelector("[data-ui-items-host]") ?? null;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Dh(e, H(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, kh(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return yg(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Dh(e, H(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", a);
				continue;
			}
			let o = Wy(e, a.oldKey ?? n), c = this.renderItemElement(t, a.item, n, r);
			c !== null && (o === null ? e.insertBefore(c, kh(i, c, a.index ?? null)) : (Mh(i, o, c), o.replaceWith(c)));
		}
	}
};
function zy(e, t) {
	let n = Dh(e, H(e)), r = e.parentElement, i = r === null ? [] : H(e).filter((e) => e instanceof HTMLElement);
	for (let a of t) {
		let t = a.key === null || a.key === void 0 ? null : Wy(e, a.key);
		if (t === null) {
			s("collection remove did not resolve an item.", a);
			continue;
		}
		let o = r !== null && t instanceof HTMLElement ? Yd(r, i, t) : null;
		Ah(n, t), t.remove(), i = i.filter((e) => e !== t), o?.();
	}
}
function By(e, t) {
	let n = Dh(e, H(e));
	for (let r of t) {
		let t = r.key === null || r.key === void 0 ? null : Wy(e, r.key);
		if (t === null) {
			s("collection move did not resolve an item.", r);
			continue;
		}
		e.insertBefore(t, jh(n, t, r.newIndex ?? null));
	}
}
function Vy(e, t) {
	if (t === void 0 || Dt(e) !== "CollectionChange" || Dt(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (Tt(n.action) !== "Reset" || Tt(r.action) !== "Insert") return null;
	let i = g(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== g(r.component?.id) || !dg(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function Hy(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? H(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function Uy(e) {
	let t = Kt(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : Kt(n);
}
function Wy(e, t) {
	return e.querySelector(`:scope > [${m}="${lt(t)}"]`);
}
//#endregion
//#region src/interactions/validation-engine.ts
var Gy = "ui-invalid", Ky = "ui-validation--warning", qy = "ui-validation--info", Jy = "data-ui-validation-message", Yy = "ui-validation-message--marker", Xy = "data-ui-tooltip", Zy = "data-ui-validation-tooltip", Qy = "--ui-validation-presentation", $y = "--ui-validation-color", eb = "Validation", tb = {
	Error: 0,
	Warning: 1,
	Info: 2
}, nb = {
	Error: Gy,
	Warning: Ky,
	Info: qy
}, rb = `.${Gy}, .${Ky}, .${qy}`, ib = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, ab = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(rb)), S(this.root, rb, { childList: !0 }, (e) => this.applyRenderedMessages(e));
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			let e = t.querySelector(`:scope > [${Jy}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && ub(t, e, {
				message: n,
				severity: sb(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === eb) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = g(e.reference.componentId), n = ob(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = g(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => xt(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = g(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: cb(e.severity)
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		lb(t, this.resolveDisplay(e, t));
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i);
		let a = this.failingRulesByElement.get(t);
		if (a !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) a.has(t) && n.push({
			message: t.message,
			severity: cb(t.severity)
		});
		let o;
		for (let e of n) (o === void 0 || tb[e.severity] < tb[o.severity]) && (o = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => xt(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${Oe}="${lt(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => xt(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && cb(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) xn(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function ob(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.message == "string" ? t.message : "";
	return n.length === 0 ? void 0 : {
		message: n,
		severity: cb(t.severity)
	};
}
function sb(e) {
	return e.classList.contains(Ky) ? "Warning" : e.classList.contains(qy) ? "Info" : "Error";
}
function cb(e) {
	let t = St(e);
	return t === "Unknown" ? "Error" : t;
}
function lb(e, t) {
	for (let n of Object.values(nb)) e.classList.toggle(n, t !== void 0 && nb[t.severity] === n);
	let n = e;
	t === void 0 ? n.style.removeProperty($y) : n.style.setProperty($y, `var(--ui-color-${ib[t.severity]})`);
	let r = e.querySelector(`[${Jy}]`);
	r !== null && (r.textContent = t?.message ?? "", ub(n, r, t));
}
function ub(e, t, n) {
	let r = n !== void 0 && getComputedStyle(t).getPropertyValue(Qy).trim() === "marker";
	if (t.classList.toggle(Yy, r), r) {
		t.setAttribute(Xy, n.message), (!e.hasAttribute(Xy) || e.getAttribute(Zy) === e.getAttribute(Xy)) && (e.setAttribute(Xy, n.message), e.setAttribute(Zy, n.message));
		return;
	}
	t.removeAttribute(Xy), e.hasAttribute(Zy) && (e.getAttribute(Zy) === e.getAttribute(Xy) && e.removeAttribute(Xy), e.removeAttribute(Zy));
}
//#endregion
//#region src/items/row-decorators.ts
var db = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, fb = /* @__PURE__ */ new WeakMap(), pb = /* @__PURE__ */ new WeakMap(), mb = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ct(e), t);
	}
	apply(e) {
		let t = Ct(e.operation.kind), n = this.handlers.get(t);
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
			let t = Xt(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t);
		}), this.register("Markup", (e) => {
			rm(e.target, b(e.convertedValue) ? "" : Xt(e.convertedValue));
		}), this.register("Attribute", (e) => {
			let t = xb(e.operation);
			if (b(e.value) || b(e.convertedValue)) {
				bb(e.target, t);
				return;
			}
			yb(e.target, t, Xt(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			bb(e.target, xb(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = xb(e.operation), n = !b(e.value) && hb(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (b(e.convertedValue) ? "" : Xt(e.convertedValue));
			gb(e.target, vb(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !b(e.value) && hb(e.value, e.operation.condition ?? "None") ? Xt(e.convertedValue).trim() : "";
			_b(e.target, vb(e), t);
		}), this.register("ToggleClass", (e) => {
			let t = xb(e.operation), n = !b(e.value) && hb(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Xt(e.convertedValue).trim() : "";
				_b(e.target, vb(e), t);
			}
		}), this.register("Style", (e) => {
			let t = xb(e.operation), n = e.target;
			if (b(e.value) || b(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Xt(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = xb(e.operation), n = e.target, r = b(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function hb(e, t) {
	switch (wt(t)) {
		case "None": return !0;
		case "HasValue": return !b(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !b(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !b(e);
	}
}
function gb(e, t, n, r, i) {
	let a = pb.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), pb.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), yb(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && bb(e, n);
}
function _b(e, t, n) {
	let r = fb.get(e);
	r === void 0 && (r = /* @__PURE__ */ new Map(), fb.set(e, r));
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
function vb(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function yb(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function bb(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function xb(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var Sb = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Gv.has(e.name),
			convert: (e) => Gv.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = Cb(e.name), n = {
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
function Cb(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var wb = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = _(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = _(e.domEventName) || t;
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
		return this.definitions.get(_(e));
	}
};
function Tb(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function Eb(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => Tb(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => Tb(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var Db = class {
	converters = new Sb();
	events = new wb();
	operations = new mb();
	valueReaders;
	collectionSinks = new Iy();
	rowDecorators = new db();
	constructor(e, t, n, r) {
		Eb(this.events), this.valueReaders = new Qt(r);
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
}, Ob = "Submenu", kb = "ui-menu__submenu", Ab = "Select", jb = {
	kind: "menu",
	decorate: Mb
};
function Mb(e) {
	if (!Nb(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, Ob);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(je, ""), Pb(e.item, "Kind") === Ab && e.row.setAttribute(Me, ""), Pb(e.item, "Expanded") === !0 && e.row.setAttribute(Ne, "");
	let r = document.createElement("div");
	r.className = kb, r.appendChild(n), Hh(r, e.key, e.item), e.row.appendChild(r);
}
function Nb(e) {
	let t = Pb(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function Pb(e, t) {
	let n = nh(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/interactions/element-size.ts
function Fb(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/rendering/number-format.ts
var Ib = {
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
}, Lb = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Rb = [
	"$n",
	"n$",
	"$ n",
	"n $"
], zb = [
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
], Bb = [
	"n %",
	"n%",
	"%n",
	"% n"
], Vb = [
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
function Hb(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Ib;
	try {
		return {
			...Ib,
			...JSON.parse(t)
		};
	} catch {
		return Ib;
	}
}
function Ub(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Wb(t);
	if (r === null) return Gb(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = Kb(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? Yb(Lb[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = Kb(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(qb(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = Kb(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Yb(i ? zb[n.currencyNegativePattern] ?? "-$n" : Rb[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = Kb(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Yb(i ? Vb[n.percentNegativePattern] ?? "-n %" : Bb[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return Gb(e, n);
	}
}
function Wb(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function Gb(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function Kb(e, t, n, r, i) {
	let a = String(qb(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? Jb(o, n, r) : `${Jb(o, n, r)}${i}${s}`;
}
function qb(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function Jb(e, t, n) {
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
function Yb(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var Xb = {
	readCulture: Hb,
	format: Ub
}, Zb = "ne.standard.ui.windowId", Qb = [
	({ root: e }) => new Hr({ root: e }),
	({ root: e }) => new ai({ root: e }),
	({ root: e, dom: t, propertyPatchEngine: n }) => new xi({
		root: e,
		dom: t,
		propertyPatchEngine: n
	}),
	({ root: e }) => new Si({ root: e }),
	({ root: e }) => new Ti({ root: e }),
	({ root: e }) => new Li({ root: e }),
	({ root: e }) => new wa({ root: e }),
	({ root: e }) => new Qi({ root: e }),
	({ root: e }) => new ka({ root: e }),
	({ root: e }) => new hf({ root: e }),
	({ root: e, propertyPatchEngine: t, dom: n }) => new Va({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new $a({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new sd({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new us({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, effects: t, dom: n }) => new Ys({
		root: e,
		effects: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new fp({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e }) => new tc({ root: e }),
	({ root: e }) => new Xl({ root: e }),
	({ root: e }) => new iu({ root: e }),
	({ root: e }) => new Oc({ root: e }),
	({ root: e }) => new $c({ root: e }),
	({ root: e }) => new Kc({ root: e }),
	({ root: e }) => new Pl({ root: e }),
	({ root: e }) => new Id({ root: e }),
	({ root: e }) => new cu({ root: e }),
	({ root: e }) => new Eu({ root: e }),
	({ root: e, effects: t }) => new Xf({
		root: e,
		effects: t
	}),
	({ root: e, effects: t }) => new jf({
		root: e,
		effects: t
	}),
	({ root: e }) => new Mu({ root: e }),
	({ root: e }) => new Ap({ root: e }),
	({ root: e }) => new br({ root: e }),
	({ root: e }) => new np({ root: e }),
	({ root: e }) => Bm(e),
	({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new Rp({ root: e }) : void 0
], $b = class {
	windowId;
	options;
	root;
	metadata = new mt(Mg());
	hydration = Fg();
	dom;
	transport;
	dispatcher;
	updateProcessor;
	eventPipeline;
	extensions;
	engineContext;
	dialogs;
	windows;
	virtualization;
	notifications;
	effects;
	reactiveSources;
	attachTask = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = tx(e.windowIdStorageKey ?? Zb), this.dom = new Gt(this.root), y.load(this.root), e.strings !== void 0 && y.register(e.strings), this.extensions = new Db(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(jb);
		let t = new Rt(this.dom, this.metadata), n = this.extensions.operations, r = new zg(), i = new Ny(t, n, this.extensions, r);
		this.reactiveSources = new Py(i), this.dialogs = new lc({ root: this.root }), this.notifications = new My({ root: this.root }), this.effects = new J_({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new Cn(this.metadata), o, u = new _n(a, i, new bn(), {
			effects: this.effects,
			dom: this.dom,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(g(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new Ag(this.dom), f = new zh(this.metadata, d, this.extensions, n, r);
		this.virtualization = new Sg({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new Ry(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), new Jh({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			valueReaders: this.extensions.valueReaders,
			virtualization: this.virtualization
		}), this.transport = new G_(this.windowId, e.signalR), this.dispatcher = new Ig(this.transport);
		let p = new K_(this.transport);
		o = new dn({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			applyChanges: (e) => this.applyChanges(e),
			valueReaders: this.extensions.valueReaders
		});
		let ee = new ab({
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
		for (let e of Qb) e(this.engineContext);
		this.eventPipeline = new mn({
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
		this.windows = new ng({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e),
			applyChanges: (e) => this.applyChanges(e)
		}), this.transport.onChanges((e) => this.applyChanges(e)), this.transport.onCommandResult((e) => {
			this.applyChanges(e.changes), this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider();
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
		if (ax() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), ox(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		n(this, this.options.handlerGlobalKey), this.hydrate(), await this.transport.startAsync(), await this.attachAsync();
	}
	hydrate() {
		this.hydration !== null && (this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(this.hydration.changes), this.applyChanges(this.hydration.changes), this.updateProcessor.initializeItemsHosts(), l("runtime hydrated from the page.", { pageId: this.hydration.pageId }));
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
		y.register(e);
	}
	addEngine(e) {
		e({
			...this.engineContext,
			strings: y,
			observeComponents: S,
			observeSize: Fb,
			dialogs: this.dialogs,
			store: new Nc(),
			numbers: Xb
		});
	}
	applyChanges(e) {
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
		let e = await this.transport.attachAsync({
			clientWindowId: this.windowId,
			route: window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: rx(window.location.search)
		});
		if (e.reload === !0) {
			this.reloadForView(this.hydration?.view ?? "");
			return;
		}
		sx(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(e.initialChanges), this.applyChanges(e.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), l("runtime attached.", {
			windowId: this.windowId,
			instanceId: this.instanceId
		});
	}
};
async function ex(e = {}) {
	let t = new $b(e);
	return await t.startAsync(), t;
}
function tx(e) {
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
	let n = nx();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function nx() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function rx(e) {
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
var ix = "ne-standard-ui:reloaded-view";
function ax() {
	try {
		return sessionStorage.getItem(ix);
	} catch {
		return null;
	}
}
function ox(e) {
	try {
		sessionStorage.setItem(ix, e);
	} catch {}
}
function sx() {
	try {
		sessionStorage.removeItem(ix);
	} catch {}
}
t(), ex().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
