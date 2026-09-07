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
var f = "data-ui-id", p = "data-ui-context", ee = "data-ui-pc", m = "data-ui-key", te = "data-ui-unselectable", ne = "data-ui-undraggable", re = "data-ui-unremovable", ie = "data-ui-unrenamable", ae = "data-ui-no-context-menu", oe = "data-ui-tabs-draggable", se = "data-ui-name", ce = "data-ui-bind-", le = "data-ui-bind-value", ue = (e) => `data-ui-no-${e}`, de = "data-ui-event-boundary", fe = "data-ui-image-caption", pe = "data-ui-items-host", me = "data-ui-items-query", he = "data-ui-empty-template", ge = "data-ui-group-template", _e = "data-ui-empty-placeholder", ve = "data-ui-group-header", ye = "data-ui-group", be = "data-ui-value-kind", xe = "data-ui-host-mode", Se = "data-ui-window-spacer", Ce = "data-ui-window-size", we = "data-ui-window-offset", Te = "data-ui-window-total", Ee = "data-ui-window-more-before", De = "data-ui-window-more-after", Oe = "data-ui-form-id", ke = "data-ui-visibility", Ae = "data-ui-collapsed", je = "data-ui-menu-group", Me = "data-ui-menu-select", Ne = "data-ui-menu-open", Pe = "data-ui-collapse-toggle", Fe = "data-ui-folding", Ie = "data-ui-column-limits", Le = "data-ui-row-limits", Re = "data-ui-splitter-step", ze = "data-ui-table-column", Be = "data-ui-tree-parent", Ve = "data-ui-tree-children", He = "data-ui-tree-expanded", Ue = "data-ui-tree-title", We = "data-ui-tree-loading", Ge = "data-ui-tree-drop-target", Ke = "data-ui-tree-draggable", qe = "data-ui-row-editing", Je = "data-ui-image-source", Ye = "data-ui-file-max-size", Xe = "data-ui-splitting", Ze = "data-ui-selection", Qe = "data-ui-selected", $e = "data-ui-selected-key", et = "data-ui-selected-keys", tt = "data-ui-bind-selected-key", nt = "data-ui-tabs-selected", rt = "data-ui-tab-order", it = "data-ui-tab-caption", at = [
	ke,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], ot = "data-ui-submit-form-id", st = `[${f}]`;
function ct(e) {
	return String(e).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function lt(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var ut = 0;
function dt(e, t) {
	return e.id.length === 0 && (ut++, e.id = `${t}-${ut}`), e.id;
}
//#endregion
//#region src/metadata/metadata-index.ts
var ft = {
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
}, pt = class {
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
		return this.bindingsByComponentAndPropertyId.get(Ft(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Ft(e, Pt(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(It(e, t));
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Ft(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Ft(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = _(e.eventName), n = g(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(It(n, t), e), this.eventNames.add(t);
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
function mt(e) {
	return h(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ht(e) {
	return e == null ? "OneWay" : h(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function gt(e) {
	return h(e, ["Property", "Event"]);
}
function _t(e) {
	return e == null ? "SetProperty" : h(e, ["SetProperty", "Effect"]);
}
function vt(e) {
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
function yt(e) {
	return h(e, ["Ascending", "Descending"]);
}
function bt(e) {
	return h(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function xt(e) {
	return h(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function St(e) {
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
function Ct(e) {
	return h(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse"
	]);
}
function wt(e) {
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
function Tt(e) {
	return typeof e == "string" ? e : e?.name ?? "";
}
function Et(e) {
	return h(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function Dt(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Ot(e) {
	return h(e, ["Auto", "Smooth"]);
}
function kt(e) {
	return h(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function At(e) {
	return h(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function jt(e) {
	return h(e, ["Light", "Dark"]);
}
function Mt(e) {
	return h(e, ["Horizontal", "Vertical"]);
}
function Nt(e) {
	return { value: g(e) };
}
function _(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Pt(e) {
	return e?.trim() ?? "";
}
function Ft(e, t) {
	return `${e}:${Pt(t)}`;
}
function It(e, t) {
	return `${e}:${_(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Lt = class {
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
		let a = g(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${ce}${lt(r.propertyName)}="${ct(a)}"]` : null;
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
		return Rt(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
function Rt(e, t, n) {
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
function zt(e) {
	return Ht(e, ee);
}
function Bt(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Ut(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Vt(e, t) {
	let n = zt(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Bt(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ht(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Ut(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Wt = class {
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
		let e = this.root.querySelectorAll(st), t = this.root.querySelector(`[${ve}]`) !== null;
		for (let n of e) {
			let e = Gt(n);
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
		return (this.componentsById.get(e) ?? []).filter((e) => Vt(e, t));
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(st);
			if (e === null || !Jt(this.root, e)) return null;
			let r = Gt(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Bt(e, zt(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function Gt(e) {
	return Ht(e, f);
}
function Kt(e) {
	let t = e.closest(st), n = t === null ? 0 : Gt(t);
	return n > 0 ? n : null;
}
function qt(e) {
	return zt(e) === 0;
}
function Jt(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/client-strings.ts
var Yt = "script[type='application/json'][data-ui-strings]", v = new class {
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
function y(e) {
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
		read: (e) => e.getAttribute(nt)
	},
	{
		kind: "tab-order",
		read: (e) => en(e.getAttribute(rt))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(it)
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
		read: (e) => e.getAttribute($e)
	},
	{
		kind: "selected-keys",
		read: (e) => nn(e, et)
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
	let t = ht(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function un(e) {
	return ht(e) === "OnSubmit";
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
		let n = t.closest(st)?.querySelector(`[${le}]`);
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
			eventId: Nt(t.metadata.eventId),
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
		let c = r.element.getAttribute(ot);
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
		if (_t(e.actionKind) === "Effect") {
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
	switch (vt(t)) {
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
	return gt(e.sourceKind) === "Event";
}
function Tn(e) {
	return gt(e.sourceKind) === "Property";
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
function b(e) {
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
			b(e);
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
function x(e, t, n, r) {
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
		x(this.root, `.${ur}`, { attributeFilter: ["class"] }, (e) => {
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
			b(t), lr(this.returnFocus.get(e), e), this.returnFocus.delete(e);
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
		r.setAttribute("aria-haspopup", "dialog"), r.setAttribute("aria-expanded", n ? "true" : "false"), r.setAttribute("aria-controls", dt(t, "ui-flyout-content"));
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
function Cr(e) {
	for (let t of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(t, (t) => wr(e, t), !0);
}
function wr(e, t) {
	if (!(t instanceof DragEvent) || !(t.target instanceof Element)) return;
	let n = e.resolveTarget(t.target);
	if (n === null || !(t.dataTransfer?.types.includes("Files") ?? !1)) return;
	let { host: r } = n;
	if (t.type === "dragleave") {
		t.relatedTarget instanceof Node && r.contains(t.relatedTarget) || r.removeAttribute(e.draggingAttribute);
		return;
	}
	if (t.preventDefault(), t.type !== "drop") {
		t.dataTransfer !== null && (t.dataTransfer.dropEffect = "copy"), r.setAttribute(e.draggingAttribute, "");
		return;
	}
	r.removeAttribute(e.draggingAttribute);
	let i = [...t.dataTransfer?.files ?? []].filter((e) => Tr(n.accept, e));
	i.length !== 0 && e.onFiles(r, n.multiple ? i : [i[0]]);
}
function Tr(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var Er = "/_ne/files/upload";
function Dr(e, t) {
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
function Or(e, t) {
	return new Promise((n, r) => {
		let i = new FormData();
		for (let t of e) i.append("files", t, t.name);
		let a = new XMLHttpRequest();
		a.open("POST", Er), a.responseType = "json", a.withCredentials = !0, a.upload.addEventListener("progress", (e) => {
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
function kr(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Ar = "ui-file-input", jr = "ui-file-input__row", Mr = "ui-file-input__native", Nr = "ui-file-input__field", Pr = "ui-file-input__selection", Fr = "data-ui-file-pick", Ir = "data-ui-file-dragging", Lr = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Cr({
			root: this.root,
			draggingAttribute: Ir,
			resolveTarget: (e) => {
				let t = e.closest(`.${jr}`)?.closest(`.${Ar}`) ?? null, n = t?.querySelector(`.${Mr}`) ?? null;
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
		let t = e.target.closest(`[${Fr}]`);
		if (t === null || t.hasAttribute("disabled")) return;
		let n = t.closest(`.${Ar}`)?.querySelector(`.${Mr}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Mr)) return;
		let t = e.target.closest(`.${Ar}`);
		t !== null && await this.takeFilesAsync(t, [...e.target.files ?? []]);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Nr}`);
		if (n === null) return;
		if (t.length === 0) {
			n.value = "", this.publishSelection(e, "");
			return;
		}
		let r = Dr(e, t);
		if (r.length !== 0) try {
			let t = await Or(r, (e) => {
				n.value = v.format("ui.file.uploading", { percent: e });
			});
			n.value = Rr(r), this.publishSelection(e, t.selectionId);
		} catch (t) {
			n.value = v.text("ui.file.failed"), this.publishSelection(e, ""), s("file upload failed.", t);
		}
	}
	publishSelection(e, t) {
		kr(e.querySelector(`.${Pr}`), t);
	}
};
function Rr(e) {
	return e.length === 1 ? e[0].name : v.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/image-input-engine.ts
var zr = "ui-image-input", Br = "ui-image-input--multiple", Vr = "ui-image-input__surface", Hr = "ui-image-input__native", Ur = "ui-image-input__picture", Wr = "ui-image-input__text", Gr = "ui-image-input__selection", Kr = "ui-image-input__selections", qr = "ui-image-input__tiles", Jr = "ui-image-input__tile", Yr = "ui-image-input__remove", Xr = "data-ui-file-pick", Zr = "data-ui-image-preview", Qr = "data-ui-image-dragging", $r = "ui-loading", ei = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${zr}`)), x(this.root, `.${zr}`, {
			childList: !0,
			attributeFilter: [
				Je,
				fe,
				et
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), Cr({
			root: this.root,
			draggingAttribute: Qr,
			resolveTarget: (e) => {
				let t = e.closest(`.${Vr}`)?.closest(`.${zr}`) ?? null;
				return t === null || t.hasAttribute("data-ui-image-readonly") || t.matches(".ui-disabled") ? null : {
					host: t,
					accept: t.querySelector(`.${Hr}`)?.getAttribute("accept") ?? "",
					multiple: ti(t)
				};
			},
			onFiles: (e, t) => void (ti(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) ti(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Ur}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || ri(e, e.getAttribute("data-ui-image-caption") ?? ii(n)));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(et);
		if (t === void 0 || n === null) return;
		let r;
		try {
			r = JSON.parse(n);
		} catch {
			return;
		}
		if (!Array.isArray(r)) return;
		let i = new Set(r.filter((e) => typeof e == "string"));
		for (let n of [...t]) n.selectionId !== null && !i.has(n.selectionId) && this.dropTile(e, n);
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xr}]`), n = t?.closest(`.${zr}`) ?? null;
		t === null || n === null || t.hasAttribute("disabled") || n.hasAttribute("data-ui-image-readonly") || n.querySelector(`.${Hr}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Yr}`), n = t?.closest(`.${zr}`) ?? null;
		if (t === null || n === null || n.hasAttribute("data-ui-image-readonly") || n.matches(".ui-disabled")) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Hr)) return;
		let t = e.target.closest(`.${zr}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (ti(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Vr}`), r = e.querySelector(`.${Ur}`), i = e.querySelector(`.${Gr}`);
		if (n === null || r === null || Dr(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Zr, ""), r.setAttribute("src", a), ri(e, t.name), n.classList.add($r);
		try {
			kr(i, (await Or([t], () => void 0)).selectionId);
		} catch (t) {
			ri(e, v.text("ui.file.failed")), kr(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove($r);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${qr}`), r = Dr(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = ni(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Or([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove($r), this.publishShelf(e);
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
		let t = e.querySelector(`.${Kr}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		t !== null && t.getAttribute("data-ui-selected-keys") !== r && (t.setAttribute(et, r), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Zr), t || ri(e, ""));
	}
};
function ti(e) {
	return e.classList.contains(Br);
}
function ni(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${Jr} ${$r}`, n.src = i, n.alt = e.name, r.type = "button", r.className = Yr, r.setAttribute("aria-label", v.text("ui.image.remove")), r.title = e.name, t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function ri(e, t) {
	let n = e.querySelector(`.${Wr}`);
	n !== null && n.textContent !== t && (n.textContent = t);
}
function ii(e) {
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
var ai = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function oi(e) {
	return e instanceof HTMLInputElement && ai.has(e.type);
}
function si(e) {
	return oi(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/own-control.ts
var ci = "[role='listbox'], [role='menu'], [role='dialog']", li = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${ci}`;
function ui(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(li);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/key-value-action-engine.ts
var di = "ui-key-value-action__row", fi = "ui-key-value-action__value", pi = "ui-key-value-action__value-input", mi = "ui-key-value-action__edit-action", hi = "ui-text__title", gi = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, x(this.root, `.${di}`, { attributeFilter: [qe] }, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${pi} [${le}]`)) {
			if (si(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
	}
	open(e) {
		let t = e.querySelector(`.${pi} :is(input, textarea, select)`);
		if (t !== null) {
			if (si(t) && t.value.length === 0) {
				let n = e.querySelector(`.${fi} .${hi}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), oi(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target.closest(`.${pi}, .${mi}`), n = t?.closest(`.${di}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-row-editing") || e.key === "Enter" && t.classList.contains(mi)) return;
		let r = e.target.closest(ci);
		if (r !== null && t.contains(r) || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let i = n.querySelectorAll(`.${mi} button`), a = e.key === "Enter" ? i[0] : i[i.length - 1];
		a !== void 0 && (e.preventDefault(), e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), a.click());
	}
}, _i = class {
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
		oi(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(Oe);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${ot}="${CSS.escape(t)}"]`);
		n !== null && !n.hasAttribute("inert") && !n.disabled && n.click();
	}
	leave(e) {
		let t = this.changes;
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, vi = "data-ui-fallback-src", yi = `img[${vi}]`, bi = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(yi)) (xi(e) || e.complete && e.naturalWidth === 0) && Si(e);
		x(this.root, yi, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && xi(t) && Si(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Si(t);
	}
};
function xi(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Si(e) {
	let t = e.getAttribute(vi);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/own-descendants.ts
function S(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Ci = "data-ui-radio-value", wi = "ui-radio-group__input", Ti = "ui-radio-group__dot", Ei = "ui-radio-group", Di = "ui-radio-group__item", Oi = "data-ui-radio-group-name", ki = "data-ui-radio-bind-value-id", Ai = "data-ui-radio-disabled", ji = "ui-disabled", Mi = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Ei}`)) this.claimGroupName(e);
		for (let e of this.root.querySelectorAll(`[${Ci}]`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.target instanceof HTMLElement) {
					this.sync(t.attributeName === "class" ? t.target.closest(`.${Ei}`) : t.target);
					continue;
				}
				for (let e of t.addedNodes) e instanceof HTMLElement && (this.decorateAddedGroups(e), this.decorateAddedItems(e));
			}
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Ci, "class"],
			childList: !0,
			subtree: !0
		});
	}
	decorateAddedGroups(e) {
		let t = e.classList.contains(Ei) ? [e] : [...e.querySelectorAll(`.${Ei}`)];
		for (let e of t) this.claimGroupName(e);
	}
	claimGroupName(e) {
		let t = e.getAttribute(Oi);
		if (t === null) return;
		let n = !1;
		for (let r of this.root.querySelectorAll(`.${Ei}`)) if (r !== e && r.getAttribute(Oi) === t) {
			n = !0;
			break;
		}
		if (!n) return;
		let r = `${t}-${++this.renamed}`;
		e.setAttribute(Oi, r);
		for (let t of S(e, `.${wi}`, `.${Ei}`)) t.name = r;
		for (let e of this.root.querySelectorAll(`[${Ci}]`)) this.sync(e);
	}
	sync(e) {
		let t = e?.getAttribute(Ci);
		if (e === null || t == null) return;
		let n = e.hasAttribute(Ai);
		for (let r of S(e, `.${wi}`, `.${Ei}`)) {
			r.checked = r.value === t;
			let e = n || Ni(r);
			r.disabled !== e && (r.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Di) ? [e] : [...e.querySelectorAll(`.${Di}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${wi}`) !== null) return;
		let t = e.closest(`.${Ei}`), n = t?.getAttribute(Oi);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = wi, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(ki);
		a !== null && r.setAttribute("data-ui-bind-value", a);
		let o = document.createElement("span");
		o.className = Ti, e.prepend(r, o), this.sync(t);
	}
};
function Ni(e) {
	let t = e.closest(`.${Di}`);
	return t !== null && (t.classList.contains(ji) || t.querySelector(`:scope > .${ji}`) !== null);
}
//#endregion
//#region src/interactions/roving-focus.ts
function Pi(e) {
	let t = e.items.filter(Ii);
	if (t.length === 0) return null;
	let n = Li(e.key);
	if (n !== null) return n === "first" ? t[0] : t[t.length - 1];
	let r = Ri(e.key, e.axis);
	if (r === 0) return null;
	let i = e.current === null ? -1 : t.indexOf(e.current);
	if (i === -1) return r > 0 ? t[0] : t[t.length - 1];
	let a = i + r;
	return a >= 0 && a < t.length ? t[a] : e.loop ?? !0 ? t[(a + t.length) % t.length] : null;
}
function Fi(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Ii(e) {
	return e.getClientRects().length !== 0 && !e.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}
function Li(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ri(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var zi = "data-ui-search-debounce", Bi = "data-ui-search-min-length", Vi = "data-ui-search-manual", Hi = "ui-search__input", Ui = "ui-select", Wi = "ui-select__popup", Gi = "ui-select__option", Ki = 300, qi = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Hi)) return;
		let t = e.target;
		Ji(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(zi), i = r === null ? Ki : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), i));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Vi)) return;
		let t = e.getAttribute(Bi), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Ji(e) {
	let t = e.closest(`.${Ui}`), n = t?.querySelector(`.${Wi}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Bi), i = r === null ? 0 : Number(r), a = e.value.trim().toLowerCase(), o = a.length > 0 && a.length >= i, s = 0;
	for (let e of n.querySelectorAll(`.${Gi}`)) {
		let t = !o || (e.textContent ?? "").toLowerCase().includes(a);
		e.style.display = t ? "" : "none", t && s++;
	}
	Zi(t, n, o && s === 0);
}
function Yi(e) {
	let t = e.querySelector(`.${Wi}`);
	t !== null && Zi(e, t, [...t.querySelectorAll(`.${Gi}`)].filter((e) => e.style.display !== "none").length === 0);
}
function Xi(e) {
	let t = e.querySelector(`.${Wi}`);
	if (t !== null) for (let e of t.querySelectorAll(`.${Gi}`)) e.style.display = "";
}
function Zi(e, t, n) {
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
var Qi = "data-ui-select-value", $i = "ui-select", ea = "ui-select--open", ta = "ui-select__trigger", na = "ui-select__trigger-content", ra = "data-ui-select-content", ia = "ui-select__placeholder", aa = "ui-input__affix-icon--prefix", oa = "ui-select__popup", sa = "ui-select__option", ca = "ui-select__value-input", la = "data-ui-select-clear", ua = "data-ui-select-trigger-mode", da = "ui-search__input", fa = "ui-text__title", pa = "ui-disabled", ma = "data-ui-active", ha = 4, ga = /* @__PURE__ */ new Set([
	"aria-selected",
	"aria-disabled",
	ma,
	"tabindex",
	"style"
]);
function _a(e) {
	return e?.querySelector(`.${da}`)?.readOnly === !0;
}
function va(e) {
	return S(e, `.${oa} .${sa}`, `.${$i}`);
}
function ya(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(f), t.removeAttribute(m), t.removeAttribute(ee), t.removeAttribute(p);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var ba = class {
	root;
	openSelect = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${$i}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) {
				if (t.type === "attributes" && t.attributeName === Qi) {
					t.target instanceof HTMLElement && this.sync(t.target);
					continue;
				}
				if (t.type === "attributes" && ga.has(t.attributeName ?? "")) continue;
				let e = (t.target instanceof HTMLElement ? t.target : t.target.parentElement)?.closest(`.${oa}`)?.closest(`.${$i}`);
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
		let t = e.getAttribute(Qi);
		this.decorateOptions(e);
		let n = t === null ? null : va(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = n === null ? null : n.querySelector(`.${fa}`)?.textContent ?? n.textContent;
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${da}`);
		a !== null && (document.activeElement !== a && (a.value = i ?? ""), Xi(e));
		let o = e.querySelector(`.${ia}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of va(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${ca}`);
		s !== null && t !== null && (s.value = t), Yi(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${ta}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${na}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(ra) === i) {
			r.removeAttribute(ra);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = na;
			let e = n.querySelector(`:scope > .${aa}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		ya(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e) {
		for (let t of va(e)) {
			t.hasAttribute("role") || t.setAttribute("role", "option");
			let e = xa(t), n = e ? "true" : "false";
			t.getAttribute("aria-disabled") !== n && t.setAttribute("aria-disabled", n), (e ? t.tabIndex !== -1 : !t.hasAttribute("tabindex")) && (t.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(da)) return;
		let t = e.target.closest(`.${$i}`);
		t !== null && t !== this.openSelect && this.toggle(t);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${la}]`);
		if (t !== null) {
			let n = t.closest(`.${$i}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), _a(n) || this.clearValue(n));
			return;
		}
		let n = e.target.closest(`.${ta}`);
		if (n !== null) {
			let t = n.closest(`.${$i}`);
			if (_a(t) || n.getAttribute(ua) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let r = e.target.closest(`.${sa}`);
		if (r === null) return;
		let i = r.closest(`.${$i}`);
		i !== null && this.choose(i, r);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sa}`);
		if (t === null) return;
		let n = t.closest(`.${$i}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	toggle(e) {
		if (e !== null) {
			if (this.openSelect === e) {
				this.close();
				return;
			}
			this.close(), e.classList.add(ea), this.positionPopup(e), this.describeTrigger(e, !0), this.openSelect = e, this.initializeFocus(e);
		}
	}
	describeTrigger(e, t) {
		let n = e.querySelector(`.${ta}`), r = e.querySelector(`.${oa}`);
		n !== null && (n.setAttribute("aria-expanded", t ? "true" : "false"), r !== null && n.setAttribute("aria-controls", dt(r, "ui-select-popup")));
	}
	close() {
		if (this.openSelect === null) return;
		let e = this.openSelect, t = e.querySelector(`.${oa}`);
		t !== null && lr(e.querySelector(`.${ta}`), t), e.classList.remove(ea), this.markActive(e, null), this.describeTrigger(e, !1), b(t), this.openSelect = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${ta}`), n = e.querySelector(`.${oa}`);
		t !== null && n !== null && In(t, n, {
			placement: "bottom-start",
			gap: ha,
			matchAnchorWidth: !0
		});
	}
	initializeFocus(e) {
		let t = va(e).filter((e) => !xa(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true") ?? t[0];
		if (Fi(t, n), this.markActive(e, n), e.querySelector(`.${ta}`)?.getAttribute(ua) === "input") {
			let t = e.querySelector(`.${da}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		n.focus();
	}
	moveFocus(e, t) {
		let n = va(e).filter((e) => !xa(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(ma)) ?? null, i = Pi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Fi(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t) {
		for (let n of va(e)) n === t ? n.setAttribute(ma, "") : n.hasAttribute(ma) && n.removeAttribute(ma);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || xa(t)) return;
		if (e.getAttribute(Qi) === n) {
			this.close();
			return;
		}
		e.setAttribute(Qi, n), this.sync(e);
		let r = e.querySelector(`.${ca}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	clearValue(e) {
		if (!e.hasAttribute(Qi)) return;
		e.removeAttribute(Qi), this.sync(e);
		let t = e.querySelector(`.${ca}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function xa(e) {
	return e.classList.contains(pa) || e.querySelector(`:scope > .${pa}`) !== null;
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Sa = "data-ui-input-debounce", Ca = `input[${Sa}], textarea[${Sa}]`;
function wa(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Ca);
}
var Ta = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!wa(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Sa));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!wa(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Ea = "ui-slider__input", Da = "ui-slider__value", Oa = "ui-slider__bubble", ka = "ui-slider__track", Aa = "ui-slider__thumb-anchor", ja = "ui-slider", Ma = "ui-orientation--vertical", Na = "--ui-slider-fraction", Pa = 6, Fa = "Value", Ia = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (e.propertyName !== Fa) return;
			let t = g(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) this.reportClamped(n.querySelector(`.${Ea}`), e.value);
		});
	}
	reportClamped(e, t) {
		e !== null && t != null && e.value !== String(t) && (this.writeReadings(e), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ea) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = La(e);
		t !== null && In(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Pa
		});
	}
	releaseBubble(e) {
		b(La(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${ka}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Da}, .${Oa}`) ?? []) n.textContent = e.value;
		e.closest(`.${ka}`)?.style.setProperty(Na, String(Ra(e))), this.placeBubble(e);
	}
};
function La(e) {
	if (!(e instanceof Element) || !e.classList.contains(Ea)) return null;
	let t = e.closest(`.${ka}`), n = t?.querySelector(`.${Oa}`) ?? null, r = t?.querySelector(`.${Aa}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${ja}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Ma)
	};
}
function Ra(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/interactions/number-input-engine.ts
var za = "ui-number-input__field", Ba = "data-ui-number-no-decimals", Va = "data-ui-number-no-negative", Ha = "data-ui-number-no-thousands", Ua = "data-ui-number-trim-zeros", Wa = "data-ui-number-step", Ga = "data-ui-number-min", Ka = "data-ui-number-max", qa = "data-ui-number-step-direction", Ja = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.applyDisplayFormatting(this.root.querySelectorAll(`.${za}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyDisplayFormatting(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${za}`) ?? []);
		});
	}
	applyDisplayFormatting(e) {
		for (let t of e) t === document.activeElement || t.hasAttribute(Ha) || t.value.length === 0 || (t.value = Qa(t.value));
	}
	handleInput(e) {
		let t = Ya(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Ba), r = !t.hasAttribute(Va), i = t.selectionStart ?? t.value.length, a = Xa(t.value, i, n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Ya(e.target);
		t !== null && t.value.includes(",") && (t.value = t.value.replace(/,/g, ""));
	}
	handleBlur(e) {
		let t = Ya(e.target);
		t !== null && this.commitFormatting(t);
	}
	commitFormatting(e) {
		let t = e.value;
		if (e.hasAttribute(Ua)) {
			let n = Za(t);
			n !== t && (t = n, e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
		!e.hasAttribute(Ha) && t.length > 0 && (e.value = Qa(t));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + qa + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${za}`) ?? null;
		if (n === null) return;
		e.preventDefault();
		let r = Number(n.getAttribute(Wa) ?? "1"), i = t.getAttribute(qa) === "down" ? -1 : 1, a = (Number(n.value.replace(/,/g, "")) || 0) + r * i, o = n.getAttribute(Ga), s = n.getAttribute(Ka);
		o !== null && (a = Math.max(a, Number(o))), s !== null && (a = Math.min(a, Number(s))), n.value = $a(a), n.dispatchEvent(new Event("change", { bubbles: !0 })), this.commitFormatting(n);
	}
};
function Ya(e) {
	return e instanceof HTMLInputElement && e.classList.contains(za) ? e : null;
}
function Xa(e, t, n, r) {
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
function Za(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Qa(e) {
	let t = e.startsWith("-"), [n, r] = (t ? e.slice(1) : e).split("."), i = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return (t ? "-" : "") + i + (r === void 0 ? "" : "." + r);
}
function $a(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var eo = [
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
function to(e, t, n) {
	if (t == null || t.trim().length === 0) return `${C(e.getFullYear(), 4)}-${C(e.getMonth() + 1, 2)}-${C(e.getDate(), 2)} ${C(e.getHours(), 2)}:${C(e.getMinutes(), 2)}:${C(e.getSeconds(), 2)}`;
	let r = "", i = no(t);
	for (let a = 0; a < t.length;) {
		let o = ro(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += io(o, e, n, i), a += o.length;
	}
	return r;
}
function no(e) {
	for (let t = 0; t < e.length;) {
		let n = ro(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function ro(e, t) {
	for (let n of eo) if (e.startsWith(n, t)) return n;
	return null;
}
function io(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return C(t.getFullYear(), 4);
		case "yy": return C(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return C(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return C(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return C(i, 2);
		case "H": return String(i);
		case "hh": return C(a, 2);
		case "h": return String(a);
		case "mm": return C(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return C(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function C(e, t) {
	return String(e).padStart(t, "0");
}
//#endregion
//#region src/interactions/temporal-dom.ts
var w = "ui-temporal-input", ao = "ui-temporal-input__value-input", oo = "ui-temporal-input__end-value-input", so = "data-ui-temporal-range", co = "data-ui-temporal-mode", lo = "data-ui-temporal-format", uo = "data-ui-temporal-default-format", fo = "data-ui-temporal-min", po = "data-ui-temporal-max", mo = "data-ui-temporal-step", ho = "data-ui-temporal-step-unit", go = /* @__PURE__ */ new Set([
	lo,
	fo,
	po
]), _o = 2e3;
function vo(e) {
	let t = e.getAttribute(co);
	return t === "time" || t === "date-time" ? t : "date";
}
function yo(e) {
	let t = e.getAttribute(lo);
	return t === null || t.trim().length === 0 ? e.getAttribute(uo) ?? "" : t;
}
function bo(e) {
	let t = e.getAttribute(ho), n = Math.max(1, Math.trunc(Number(e.getAttribute(mo))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function xo(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function So(e) {
	return {
		monthNames: Co(e, "data-ui-temporal-months"),
		monthGenitiveNames: Co(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: Co(e, "data-ui-temporal-months-short"),
		dayNames: Co(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: Co(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function Co(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function T(e) {
	return e.hasAttribute(so);
}
function wo(e) {
	return e !== null && e.hasAttribute("data-ui-temporal-end");
}
function To(e) {
	return E(e, !1);
}
function E(e, t) {
	let n = Eo(e, t);
	return n === null ? null : Lo(n.value, vo(e));
}
function Eo(e, t) {
	return e.querySelector(`.${t ? oo : ao}`);
}
function Do(e, t) {
	return Lo(e.getAttribute(t) ?? "", vo(e));
}
function Oo(e, t, n) {
	let r = Eo(e, n);
	if (r === null) return;
	let i = t === null ? "" : Ro(t, vo(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function ko(e) {
	if (!T(e)) return;
	let t = E(e, !1), n = E(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (Oo(e, n, !1), Oo(e, t, !0));
}
function Ao(e) {
	jo(e, !1), T(e) && jo(e, !0);
}
function jo(e, t) {
	let n = E(e, t);
	if (n === null) return;
	let r = No(e, n);
	r.getTime() !== n.getTime() && Oo(e, r, t);
}
function Mo(e) {
	return Po(e, No(e, /* @__PURE__ */ new Date()));
}
function No(e, t) {
	let n = Do(e, fo), r = Do(e, po);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Po(e, t) {
	let n = bo(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Fo = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?/, Io = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Lo(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Io.exec(n);
		return e === null ? null : new Date(_o, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Fo.exec(n);
	return r === null ? null : new Date(Number(r[1]), Number(r[2]) - 1, Number(r[3]), Number(r[4] ?? "0"), Number(r[5] ?? "0"), Number(r[6] ?? "0"));
}
function Ro(e, t) {
	let n = `${zo(e.getHours())}:${zo(e.getMinutes())}:${zo(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${zo(e.getMonth() + 1)}-${zo(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function zo(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Bo(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Ho(n, e.start);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Uo(e.start).getTime() ? {
		start: Ho(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Ho(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Vo(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Uo(e).getTime();
	return r > Uo(t).getTime() && r < Uo(n).getTime();
}
function Ho(e, t) {
	return t === null ? new Date(e.getFullYear(), e.getMonth(), e.getDate()) : new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Uo(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Wo = "ui-temporal-input__field", Go = "ui-temporal-input__popup", Ko = "ui-temporal-input--open", D = "ui-temporal-input__day", qo = "ui-temporal-input__month", O = "ui-temporal-input__time-cell", Jo = "ui-temporal-input__time-column", Yo = 4, Xo = 140, Zo = "data-ui-temporal-toggle", Qo = "data-ui-temporal-first-day", $o = "data-ui-temporal-nav", es = "data-ui-temporal-day", ts = "data-ui-temporal-unit", ns = "data-ui-temporal-cell", rs = "data-ui-temporal-centred", is = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	openPicker = null;
	columnSettle = 0;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${w}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyDisplay(this.options.dom?.findComponentParts(t, e.dynamicParameters, ".ui-temporal-input") ?? []);
		}), x(this.root, `.${w}`, { attributeFilter: [...go] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), new or({
			root: this.root,
			openPopups: () => this.openPicker === null ? [] : [this.openPicker],
			close: () => this.close()
		});
	}
	applyDisplay(e) {
		for (let t of e) {
			Ao(t);
			for (let e of t.querySelectorAll(`.${Wo}`)) {
				if (e === document.activeElement) continue;
				let n = Cs(t, wo(e))?.value ?? "", r = Lo(n, vo(t));
				if (r !== null) {
					e.value = to(r, yo(t), So(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Wo)) return;
		let t = e.target.closest(`.${w}`), n = t === null ? null : Cs(t, wo(e.target));
		t !== null && n !== null && (n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), ko(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Wo)) return;
		let t = e.target.closest(`.${w}`);
		t !== null && T(t) && (this.getState(t).activeEnd = wo(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !T(t) || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${es}]`) : null;
		if (n !== null && !t.contains(n)) return;
		let r = this.getState(t), i = n === null ? null : Lo(n.getAttribute(es) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, xs(t, r));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Wo)) return;
		let t = e.target.closest(`.${w}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Zo}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${w}`));
			return;
		}
		let n = e.target.closest(`.${Go}`)?.closest(`.${w}`);
		if (n == null) return;
		let r = e.target.closest(`[${$o}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute($o) ?? "");
			return;
		}
		let i = e.target.closest(`[${es}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(es) ?? "");
			return;
		}
		let a = e.target.closest(`[${ns}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${ts}]`)?.getAttribute(ts);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(ns)));
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
				n.view = Rs(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Rs(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				this.commit(e, Mo(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), T(e) && this.commit(e, null, !0), n.activeEnd = "start", this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = Lo(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (T(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = To(e) ?? Mo(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = Is(a), this.commit(e, a), vo(e) === "date" && this.close();
	}
	choosePeriodDay(e, t, n) {
		let r = Mo(e), i = Bo({
			start: E(e, !1),
			end: E(e, !0)
		}, t.activeEnd, ws(n, r));
		if (t.focusedDay = i.end ?? i.start, t.view = Is(n), t.activeEnd = i.active, t.hoverDay = null, Oo(e, i.end, !0), Oo(e, i.start, !1), this.applyDisplay([e]), i.complete && vo(e) === "date") {
			this.close();
			return;
		}
		this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = T(e) && this.getState(e).activeEnd === "end", i = new Date(E(e, r) ?? Mo(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Oo(e, t, n), ko(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Wo)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${w}`), wo(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(O)) {
			Ds(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(D)) return;
		let n = Lo(e.target.getAttribute(es) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Ro(n, "date"));
			return;
		}
		let r = Ps(n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Is(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jo}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettle), this.columnSettle = window.setTimeout(() => this.chooseCentredTime(t), Xo));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(rs));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(ts), i = gs(e);
		if (!(r === null || i === null || i.classList.contains(`${O}--selected`))) {
			if (i.matches(":disabled")) {
				ms(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(ns)));
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
		n.activeEnd = T(e) ? t ?? (E(e, !1) === null ? "start" : E(e, !0) === null ? "end" : n.activeEnd) : "start", n.hoverDay = null;
		let r = E(e, n.activeEnd === "end") ?? To(e);
		n.pane = "days", n.view = Is(r ?? No(e, /* @__PURE__ */ new Date())), n.focusedDay = r, e.classList.add(Ko), e.querySelector(`[${Zo}]`)?.setAttribute("aria-expanded", "true"), this.openPicker = e, this.renderPopup(e, !0);
	}
	close() {
		if (this.openPicker === null) return;
		let e = this.openPicker, t = e.querySelector(`.${Go}`);
		window.clearTimeout(this.columnSettle), t !== null && lr(Ss(e, this.getState(e).activeEnd === "end"), t), e.classList.remove(Ko), e.querySelector(`[${Zo}]`)?.setAttribute("aria-expanded", "false"), b(t), this.openPicker = null;
	}
	positionPopup(e) {
		let t = e.querySelector(`.${w}__row`), n = e.querySelector(`.${Go}`);
		t !== null && n !== null && In(t, n, {
			placement: "bottom-end",
			gap: Yo
		});
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: Is(To(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: To(e),
			activeEnd: "start",
			hoverDay: null
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${Go}`);
		if (n === null) return;
		let r = vo(e), i = this.getState(e), a = So(e), o = T(e), s = E(e, o && i.activeEnd === "end"), c = _s(n);
		n.replaceChildren(), o && n.append(bs(i));
		let l = k("div", `${w}__panes`);
		l.append(as(e, i, a, s)), r === "date-time" && l.append(cs(e, s)), n.append(l, ys(r, o)), Es(n, i, s, t), xs(e, i), ps(n), ms(n), vs(n, c), this.positionPopup(e);
	}
};
function as(e, t, n, r) {
	let i = k("div", `${w}__calendar`), a = k("div", `${w}__calendar-header`);
	a.append(Ts("previous", "‹", v.text("ui.picker.previous")));
	let o = Ts("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${w}__calendar-label`), a.append(o), a.append(Ts("next", "›", v.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? os(e, t, n, r) : ss(t, n)), i;
}
function os(e, t, n, r) {
	let i = Ns(e), a = k("div", `${w}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = k("span", `${w}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = k("div", `${w}__days`), s = Fs(/* @__PURE__ */ new Date()), c = T(e), l = c ? E(e, !1) : r, u = c ? E(e, !0) : null, d = Ls(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = A(d, n), i = k("button", D);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(es, Ro(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${D}--outside`), zs(r, s) && i.classList.add(`${D}--today`), (l !== null && zs(r, l) || u !== null && zs(r, u)) && (i.classList.add(`${D}--selected`), i.setAttribute("aria-selected", "true")), Vo(r, l, u) && i.classList.add(`${D}--within`), js(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = k("div", `${w}__calendar-pane`);
	return f.append(a, o), f;
}
function ss(e, t) {
	let n = k("div", `${w}__months`);
	for (let r = 0; r < 12; r++) {
		let i = k("button", qo);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute($o, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${qo}--selected`), n.append(i);
	}
	return n;
}
function cs(e, t) {
	let n = bo(e), r = k("div", `${w}__time`), i = k("div", `${w}__time-columns`);
	for (let r of ls(n)) i.append(fs(e, r, us(n, r), t));
	return r.append(i), r;
}
function ls(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function us(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function ds(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function fs(e, t, n, r) {
	let i = k("div", Jo);
	i.setAttribute(ts, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", v.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = ds(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = k("button", O);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(ns, String(c)), c === o && (n.classList.add(`${O}--selected`), n.setAttribute("aria-selected", "true")), Ms(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function ps(e) {
	let t = e.querySelector(`.${w}__calendar`), n = e.querySelector(`.${w}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function ms(e) {
	for (let t of e.querySelectorAll(`.${Jo}`)) {
		let e = t.querySelector(`.${O}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, hs(t, e), t.setAttribute(rs, String(t.scrollTop));
	}
}
function hs(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function gs(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${O}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function _s(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(O) ? null : t.closest(`.${Jo}`)?.getAttribute(ts) ?? null;
}
function vs(e, t) {
	t !== null && e.querySelector(`.${Jo}[${ts}="${t}"]`)?.querySelector(`.${O}--selected`)?.focus({ preventScroll: !0 });
}
function ys(e, t) {
	let n = k("div", `${w}__popup-footer`);
	return n.append(Ts("now", v.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), n.append(Ts("clear", v.text("ui.picker.clear"))), (e === "date-time" || t) && n.append(Ts("done", v.text("ui.picker.done"))), n;
}
function bs(e) {
	let t = k("div", `${w}__period-caption`);
	return t.textContent = v.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function xs(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? E(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${D}`)) {
		let e = Lo(t.getAttribute(es) ?? "", "date");
		t.classList.toggle(`${D}--preview`, e !== null && n !== null && r !== null && Vo(e, n, A(r, 1)));
	}
}
function Ss(e, t) {
	for (let n of e.querySelectorAll(`.${Wo}`)) if (wo(n) === t) return n;
	return e.querySelector(`.${Wo}`);
}
function Cs(e, t) {
	return e.querySelector(`.${t ? oo : ao}`);
}
function ws(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Ts(e, t, n) {
	let r = k("button", `${w}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute($o, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function k(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Es(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${D}`)];
	if (i.length === 0) return;
	let a = Ro(Fs(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(es) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (o.tabIndex = 0, r && o.focus({ preventScroll: !0 }));
}
function Ds(e) {
	let t = e.target, n = t.closest(`.${Jo}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? ks(n, e.key === "ArrowRight" ? 1 : -1) : Os(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), As(r));
}
function Os(e, t, n) {
	return Pi({
		key: n,
		items: [...e.querySelectorAll(`.${O}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function ks(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Jo}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${O}--selected`) ?? r.querySelector(`.${O}:not(:disabled)`);
}
function As(e) {
	let t = e.closest(`.${Jo}`);
	t !== null && hs(t, e);
}
function js(e, t) {
	let n = Do(e, fo), r = Do(e, po);
	return n !== null && t.getTime() < Fs(n).getTime() || r !== null && t.getTime() > Fs(r).getTime();
}
function Ms(e, t, n, r) {
	let i = Do(e, fo), a = Do(e, po);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function Ns(e) {
	let t = Number(e.getAttribute(Qo));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Ps(e, t) {
	switch (t) {
		case "ArrowLeft": return A(e, -1);
		case "ArrowRight": return A(e, 1);
		case "ArrowUp": return A(e, -7);
		case "ArrowDown": return A(e, 7);
		case "PageUp": return Rs(e, -1);
		case "PageDown": return Rs(e, 1);
		case "Home": return A(e, -e.getDay());
		case "End": return A(e, 6 - e.getDay());
		default: return null;
	}
}
function Fs(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
function Is(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function Ls(e, t) {
	let n = Is(e);
	return A(n, -((n.getDay() - t + 7) % 7));
}
function A(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Rs(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function zs(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var Bs = "[data-ui-theme-switcher]", Vs = "data-ui-theme", Hs = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(Bs) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: ft.SetTheme,
				mode: Us() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function Us() {
	let e = document.documentElement.getAttribute(Vs);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var Ws = "data-ui-context-menu-owner", Gs = "data-ui-context-menu", Ks = "ui-context-menu--open", qs = "[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]", Js = class {
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
		let t = e.target.closest(`[${Ws}]`);
		if (t === null) return;
		let n = t.querySelector(`[${Gs}]`);
		n === null || n.closest(`[${Ws}]`) !== t || Ys(t) || (e.preventDefault(), this.close(), this.open(n, e.clientX, e.clientY));
	}
	open(e, t, n) {
		e.classList.add(Ks), this.openMenu = e;
		let r = e.getBoundingClientRect();
		e.style.left = `${Xn(t, r.width, window.innerWidth)}px`, e.style.top = `${Xn(n, r.height, window.innerHeight)}px`, e.querySelector(sr)?.focus({ preventScroll: !0 });
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(qs) !== null || this.close();
	}
	close() {
		this.openMenu !== null && (this.openMenu.classList.remove(Ks), this.openMenu = null);
	}
};
function Ys(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/dialog-engine.ts
var Xs = "data-ui-dialog", Zs = "data-ui-dialog-modal", Qs = "data-ui-dialog-close-backdrop", $s = "data-ui-dialog-close-escape", ec = "data-ui-dialog-backdrop", tc = "ui-dialog__surface", nc = class {
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
		return this.root.querySelector(`[${Xs}="${t}"]`);
	}
	focusInitial(e) {
		let t = e.querySelector(sr);
		if (t !== null) {
			t.focus();
			return;
		}
		e.querySelector(`.${tc}`)?.focus();
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${ec}]`);
		if (n === null) return;
		let r = n.closest(`[${Xs}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(Qs)) return;
		let i = r.getAttribute(Xs);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute($s) && !ir()) {
				let n = t.getAttribute(Xs);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute(Zs) && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(st)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return rc(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(sr)].filter((e) => Ii(e) || e === document.activeElement);
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
function rc(e) {
	let t = e.querySelectorAll(`[${Xs}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ic(e) {
	let t = rc(e);
	return t !== null && t.hasAttribute(Zs) ? t : null;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function ac(e) {
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
		default: o = dc(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function oc(e, t, n = cc()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var sc = null;
function cc() {
	return sc === null && (sc = lc()), sc;
}
function lc() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function uc(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function dc(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : fc[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : fc[t] ?? null;
}
var fc = {
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
}, pc = "ui-menu", mc = "ui-menu-item", hc = "ui-menu-item--selected", gc = "ui-context-menu", _c = "ui-orientation--horizontal", vc = "data-ui-menu-item-kind", yc = `[${vc}="header"], [${vc}="separator"]`, bc = "data-ui-menu-shortcut", xc = class {
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
			attributeFilter: [bc]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${pc}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && Fi(t, t.find((e) => e.classList.contains(hc)) ?? t.find(Ii) ?? t[0]);
		}
	}
	handleNavigationKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mc}`), n = t?.closest(`.${pc}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n), i = Pi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(_c) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), Fi(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mc}`), n = t?.closest(`.${pc}`) ?? null;
		t !== null && n !== null && Fi(this.ownItems(n), t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || Sc(e))) return;
		let t = ic(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !oc(n.shortcut, e))) {
			if (!Ii(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${bc}]`)) {
			if (e.closest(`.${gc}`) !== null) continue;
			let t = ac(e.getAttribute(bc));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(bc)
				});
				continue;
			}
			let n = uc(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(bc),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return S(e, `.${mc}:not(${yc})`, `.${pc}`);
	}
};
function Sc(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var Cc = "ne.ui", wc = "boot", Tc = /* @__PURE__ */ new Set(), Ec = class {
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
		let r = this.resolveKey(e, wc);
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
			return Tc.has(n) || (Tc.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Cc}:${n}:${t}`;
	}
}, Dc = "ui-menu", Oc = "ui-menu--nested", kc = "ui-menu-item", Ac = "ui-menu-item--selected", jc = "ui-menu__item", Mc = "ui-menu__submenu", Nc = je, Pc = Ne, Fc = "data-ui-menu-flyout", Ic = Me, Lc = "data-ui-menu-item-kind", Rc = "menu-open-group", zc = class {
	root;
	store = new Ec();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	openFlyout = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), new or({
			root: this.root,
			openPopups: () => this.openFlyout?.parentElement === null || this.openFlyout === null ? [] : [this.openFlyout.parentElement],
			close: () => this.closeFlyout()
		}), this.reconcileEach(this.root.querySelectorAll(`.${Dc}`)), x(this.root, `.${Dc}`, {
			childList: !0,
			attributeFilter: [Ae]
		}, (e) => this.reconcileEach(e));
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Bc(t), n = this.seenCollapsed.get(t);
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
		let t = this.groupOf(e.querySelector(`.${Ac}`), e);
		if (t !== null && !t.hasAttribute(Ic)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Oc) ? null : this.store.read(e, Rc), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kc}`);
		if (t !== null && this.openFlyout !== null && this.openFlyout.contains(t)) {
			t.getAttribute(Lc) !== "check" && this.closeFlyout();
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
		let r = n.closest(`.${Dc}`);
		r !== null && (Bc(r) || n.hasAttribute(Ic) ? this.toggleFlyout(r, n, t) : this.toggleInline(r, n));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Oc);
		if (t.hasAttribute(Pc)) {
			t.removeAttribute(Pc), n || this.store.write(e, Rc, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Rc, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(Pc, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Nc}][${Pc}]`)) t.hasAttribute(Ic) || t.removeAttribute(Pc);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.openFlyout === r;
		this.closeFlyout(), !i && (this.closeGroups(e), t.setAttribute(Pc, ""), r.setAttribute(Fc, ""), this.openFlyout = r, In(n, r, {
			placement: "right-start",
			gap: 4
		}));
	}
	closeFlyout() {
		let e = this.openFlyout;
		e !== null && (this.openFlyout = null, b(e), e.removeAttribute(Fc), e.parentElement?.removeAttribute(Pc));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Nc}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		let t = e.closest(`.${jc}`);
		return t !== null && t.hasAttribute(Nc) ? t : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Nc}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Mc}`);
	}
};
function Bc(e) {
	return e.hasAttribute(Ae);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var Vc = "ui-collapsible", Hc = "ui-collapsible__content", Uc = "collapsed", Wc = 200, Gc = "cubic-bezier(0.4, 0, 0.2, 1)", Kc = class {
	root;
	store = new Ec();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Vc}`)), x(this.root, `.${Vc}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, Uc);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pe}]`), n = t?.closest(`.${Vc}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(Ae), i = n.querySelector(`:scope > .${Hc}`);
		this.cancelFold(n);
		let a = Jc(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Uc, r ? "true" : "false", r ? { attributes: { [Ae]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Ae, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Pe}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let i = qc(e), a = Jc(e, t);
		if (n.component === a.component) return;
		e.setAttribute(Fe, "");
		let o = {
			duration: Wc,
			easing: Gc
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
function qc(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Jc(e, t) {
	let n = qc(e);
	return {
		component: e.getBoundingClientRect()[n],
		content: t?.getBoundingClientRect()[n] ?? 0
	};
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Yc = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Xc = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Zc(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Xc[t]}px)`)) return t;
	return "base";
}
function Qc(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function j(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function $c(e, t) {
	let n;
	for (let r of Yc) {
		let i = j(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/pointer-drag.ts
var el = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0);
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
			t.setAttribute(Xe, ""), t.focus({ preventScroll: !0 }), this.drag = {
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
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r } = this.drag;
		this.drag = null, this.options.move(n, 0), t.removeAttribute(Xe);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
//#endregion
//#region src/interactions/grid-tracks.ts
function tl(e) {
	let t = [];
	for (let n of il(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = tl(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = nl(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function nl(e) {
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
	if (n !== null) return rl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return rl(r[3] === "fr" ? {
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
function rl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function il(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function al(e) {
	return e.map(ol).join(" ");
}
function ol(e) {
	switch (e.kind) {
		case "px": return `${sl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${sl(e.min)}px`}, ${sl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? "auto" : `fit-content(${sl(e.max)}px)` : `minmax(${sl(e.min)}px, auto)`;
	}
}
function sl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function cl(e) {
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
function ll(e, t) {
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
function ul(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = dl(r, e), o = dl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function dl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function fl(e, t, n, r) {
	let i = pl(e, t, n.before), a = pl(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = vl(n.before, e) + vl(n.after, e), r = i.total + a.total;
		ml(l, e, i, t * (i.total + c) / r), ml(l, e, a, t * (a.total - c) / r);
	} else u || hl(l, i, i.total + c), d || hl(l, a, a.total - c);
	return l;
}
function pl(e, t, n) {
	let r = _l(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function ml(e, t, n, r) {
	let i = vl(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function hl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...gl(e[i])
		};
	}
}
function gl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function _l(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function vl(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function yl(e, t) {
	let n = _l(t.before, e), r = n + _l(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var bl = "ui-grid-splitter", xl = "ui-container", Sl = "ui-orientation--vertical", Cl = 16, wl = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Ie,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Tl = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Le,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, El = class {
	root;
	store = new Ec();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new u();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new el({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${bl}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${bl}`)), x(this.root, `.${bl}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Dl(t);
			e !== null && (this.restore(e, Ol(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Yc) {
			let i = r[n], a = Qc(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bl}`);
		if (t === null || this.drag.active) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Nl(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${bl}`), n = t === null ? null : Dl(t);
		if (t === null || n === null) return;
		let r = Ol(t);
		for (let e of Yc) n.style.removeProperty(Qc(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = fl(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Qc(e.axis.split, e.tier), al(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Yc) {
			let a = Qc(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Dl(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Ol(e), r = Zc(), i = kl(t, n, r), a = i === null ? null : tl(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = ll(a, cl(t.getAttribute(n.limits))), s = Al(t, n), c = jl(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = ul(c, Ml(t, n).map((e) => jl(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = Dl(e);
		if (t === null) return;
		let n = Ol(e), r = jl(e, n), i = Al(t, n), a = Ml(t, n).map((e) => jl(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : ul(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(yl(i, o))));
	}
};
function Dl(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(xl) ? t : null;
}
function Ol(e) {
	return e.classList.contains(Sl) ? wl : Tl;
}
function kl(e, t, n) {
	for (let r = Yc.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(Qc(t.split, Yc[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function Al(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function jl(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Ml(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(bl) && Ol(r) === t && n.push(r);
	return n;
}
function Nl(e) {
	let t = Number(e.getAttribute(Re));
	return Number.isFinite(t) && t > 0 ? t : Cl;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Pl = "ui-split-button", Fl = "ui-split-button__main", Il = "ui-split-button__toggle", Ll = "ui-split-button__menu", Rl = "ui-split-button--open", zl = "ui-menu-item", Bl = "data-ui-menu-item-kind", Vl = 4, Hl = class {
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
		let t = Ul(e.target);
		if (t !== null) {
			e.preventDefault(), this.open === t ? this.close() : this.openMenu(t);
			return;
		}
		this.open !== null && e.target instanceof Element && e.target.closest(`.${Fl}`)?.closest(`.${Pl}`) === this.open && this.close();
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Ul(e.target);
		t !== null && this.open !== t && (e.preventDefault(), this.openMenu(t));
	}
	handleChoice(e) {
		if (this.open === null || !(e.target instanceof Element)) return;
		let t = Wl(this.open), n = e.target.closest(`.${zl}`);
		t === null || n === null || !t.contains(n) || n.matches(`[${Bl}="header"], [${Bl}="separator"], [${Bl}="check"]`) || n.parentElement?.hasAttribute("data-ui-menu-group") === !0 || this.close();
	}
	openMenu(e) {
		this.close();
		let t = Wl(e);
		if (t !== null) {
			this.open = e, e.classList.add(Rl);
			for (let t of Gl(e)) t.setAttribute("aria-expanded", "true");
			In(e, t, {
				placement: "bottom-end",
				gap: Vl
			}), this.returnFocus = cr(t);
		}
	}
	close() {
		let e = this.open;
		if (e === null) return;
		this.open = null, e.classList.remove(Rl);
		for (let t of Gl(e)) t.setAttribute("aria-expanded", "false");
		let t = Wl(e);
		t !== null && (b(t), lr(this.returnFocus, t)), this.returnFocus = null;
	}
};
function Ul(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Il}, .${Fl}`), n = t?.closest(`.${Pl}`) ?? null;
	return t === null || n === null || t.classList.contains(Fl) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Wl(e) {
	return e.querySelector(`:scope > .${Ll}`);
}
function Gl(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/selected-key.ts
function Kl(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/button-group-engine.ts
var ql = "ui-button-group", Jl = "ui-button-group__item", Yl = "ui-button", Xl = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${ql}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), x(this.root, `.${ql}`, {
			childList: !0,
			attributeFilter: [$e]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Zl(i);
			i.toggleAttribute(Qe, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		Fi(n, r ?? n.find(Ii) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jl}`), n = t?.closest(`.${ql}`) ?? null;
		t === null || n === null || t.closest(`.${ql}`) !== n || n.matches(".ui-disabled") || Zl(t)?.matches(".ui-disabled, :disabled") !== !0 && this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jl} > .${Yl}`), n = t?.closest(`.${ql}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Zl).filter((e) => e !== null), i = Pi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Jl}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Kl(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: $e,
			bindingAttribute: tt,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return S(e, `.${Jl}`, `.${ql}`);
	}
};
function Zl(e) {
	return e.querySelector(`:scope > .${Yl}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Ql = "ui-accordion", $l = "details", eu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Ql}`)), x(this.root, `.${Ql}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Ql))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${$l}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function tu(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var nu = "ui-tab-overflow", ru = "ui-tab-overflow__menu", iu = "ui-tab-overflow__menu--open", au = "ui-tab-overflow__entry", ou = "ui-tab-overflow__entry--current";
function su(e) {
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
var cu = class {
	pick;
	menu;
	button = null;
	strip = null;
	constructor(e, t) {
		this.pick = t, this.menu = document.createElement("div"), this.menu.className = ru, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), new or({
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
		this.close(), this.menu.replaceChildren(...n.map(lu)), this.menu.parentElement === null && document.body.appendChild(this.menu), this.button = e, this.strip = t, this.menu.classList.add(iu), e.setAttribute("aria-expanded", "true"), In(e, this.menu, {
			placement: "bottom-end",
			gap: 4
		}), (this.menu.querySelector(`.${ou}`) ?? this.menu.querySelector(`.${au}`))?.focus({ preventScroll: !0 });
	}
	close() {
		this.button !== null && (b(this.menu), this.menu.classList.remove(iu), this.button.setAttribute("aria-expanded", "false"), this.button = null, this.strip = null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${au}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.strip;
		t !== null && n !== null && r !== null && (this.close(), this.pick(r, n));
	}
};
function lu(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${au} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(ou, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var M = "ui-tabs", uu = "ui-tab-header", du = "ui-tab-header--selected", fu = "ui-tab-header--overflowed", pu = "ui-tabs--overflowing", mu = "ui-tabs--no-overflow", hu = "ui-tabs__strip", gu = "data-ui-tab-key", _u = "data-ui-tab-page", vu = class {
	root;
	overflow;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${M}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new cu(this.root, (e, t) => this.select(e, t)), this.applyAll(this.root.querySelectorAll(`.${M}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), x(this.root, `.${M}`, { attributeFilter: [nt, ...at] }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(gu) ?? "") === t) ?? null;
		if (r !== null && !tu(r)) {
			let t = n.find(tu);
			if (t !== void 0) {
				this.select(e, t.getAttribute(gu) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(gu) ?? "") === t;
			e.classList.toggle(du, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(tu), i), Fi(n.filter((e) => !e.classList.contains(fu)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(_u) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${hu}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		if (r === null || i === null) return;
		if (e.classList.contains(mu)) {
			for (let e of t) e.classList.remove(fu);
			e.classList.remove(pu);
			return;
		}
		this.resizes?.observe(r), e.classList.add(pu);
		let a = su({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: fu
		});
		e.classList.toggle(pu, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownHeaders(e).filter(tu).map((e) => {
			let t = e.getAttribute(gu) ?? "";
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
		let t = e.target.closest(`.${nu}`), n = t?.closest(`.${M}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${M}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${uu}`);
		if (r === null || r.matches(":disabled, .ui-disabled")) return;
		let i = r.closest(`.${M}`), a = r.getAttribute(gu);
		i !== null && a !== null && r.closest(`.${M}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${uu}`), n = t?.closest(`.${M}`) ?? null;
		if (t === null || n === null) return;
		let r = Pi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(gu) ?? ""), r.focus());
	}
	select(e, t) {
		Kl(e, t, {
			attribute: nt,
			bindingAttribute: tt,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return S(e, `.${uu}`, `.${M}`);
	}
	ownPages(e) {
		return S(e, `[${_u}]`, `.${M}`);
	}
}, yu = "ui-breadcrumbs", bu = "ui-breadcrumbs__item", xu = "ui-breadcrumb", Su = "ui-breadcrumb--current", Cu = "ui-hidden", wu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), x(this.root, `.${yu}`, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${yu}`)) this.apply(e);
	}
	apply(e) {
		let t = S(e, `.${bu}`, `.${yu}`).filter((e) => !e.classList.contains(Cu)).map((e) => e.querySelector(`.${xu}`)).filter((e) => e !== null && !e.classList.contains(Cu)), n = t.length === 0 ? null : t[t.length - 1];
		for (let e of t) {
			let t = e === n;
			e.classList.toggle(Su, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
}, Tu = "ui-color-input", Eu = "ui-color-input--open", Du = "ui-color-input__popup", Ou = "ui-color-input__text", ku = "ui-color-input__row", Au = "ui-color-input__swatch--button", ju = "ui-color-input__value-input", Mu = "ui-color-input__square-thumb", Nu = "ui-color-input__hue-thumb", Pu = "data-ui-color-toggle", Fu = "data-ui-color-tab", Iu = "data-ui-color-tab-selected", Lu = "data-ui-color-pane", Ru = "data-ui-color-pane-selected", zu = "data-ui-color-square", Bu = "data-ui-color-hue", Vu = "data-ui-color-hex", Hu = "data-ui-color-channel", Uu = "data-ui-color-factor", Wu = "data-ui-color-opacity", Gu = "data-ui-color-name", Ku = "data-ui-color-name-selected", qu = "data-ui-color-format", Ju = "data-ui-color-readonly", Yu = "data-ui-color-variant", Xu = "data-ui-color-picker", Zu = "data-ui-color-palette", Qu = 4, $u = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	returnFocus = /* @__PURE__ */ new WeakMap();
	openInput = null;
	dragging = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Tu}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Tu}`) ?? []);
		}), x(this.root, `.${Tu}`, {
			childList: !0,
			attributeFilter: [
				qu,
				Ju,
				Yu,
				Xu,
				Zu
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
		let t = sd(e), n = this.states.get(e), r = n?.paneChosen === !0 ? ed(e, n.pane) : td(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? nd(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = hd(t);
			if (i === null) return n ?? nd(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && rd(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = yd(a, o, s);
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
			...n ?? nd(r),
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
			let [e, a, o] = yd(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		this.states.set(e, t), dd(e, "--ui-color-input-color", t.held ? vd(n, r, i, t.opacity) : "transparent"), dd(e, "--ui-color-input-solid", vd(n, r, i, 255)), dd(e, "--ui-color-input-on-color", t.held ? id(n, r, i, t.opacity) : "inherit"), ud(e, t.held ? ld(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), this.applyPalette(e, t), this.applyPanes(e, t);
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${zu}]`), o = e.querySelector(`[${Bu}]`), [s, c, l] = bd(t.hue, 1, 1);
		if (dd(e, "--ui-color-input-hue", vd(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${Mu}`);
			e !== null && (dd(e, "left", `${t.saturation * 100}%`), dd(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${Nu}`);
			e !== null && dd(e, "top", `${t.hue / 360 * 100}%`);
		}
		fd(e, `[${Vu}]`, gd(n, r, i)), fd(e, `[${Hu}="r"]`, String(n)), fd(e, `[${Hu}="g"]`, String(r)), fd(e, `[${Hu}="b"]`, String(i)), dd(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), pd(e, `[${Wu}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${Gu}]`)) n.getAttribute(Gu) === t.name ? n.setAttribute(Ku, "") : n.removeAttribute(Ku);
		let n = t.name === null ? null : e.querySelector(`[${Gu}="${t.name}"]`), r = n === null ? null : hd(n.style.getPropertyValue("--ui-color-input-chip").trim());
		dd(e, "--ui-color-input-base", r === null ? "transparent" : vd(r[0], r[1], r[2], 255)), pd(e, `[${Uu}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${Lu}]`)) n.getAttribute(Lu) === t.pane ? n.setAttribute(Ru, "") : n.removeAttribute(Ru);
		for (let n of e.querySelectorAll(`[${Fu}]`)) n.getAttribute(Fu) === t.pane ? n.setAttribute(Iu, "") : n.removeAttribute(Iu);
	}
	resolveRgb(e, t) {
		if (t.name === null) return bd(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${Gu}="${t.name}"]`), r = n === null ? null : hd(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? bd(t.hue, t.saturation, t.value) : md([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pu}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${Tu}`));
			return;
		}
		let n = e.target.closest(`[${Fu}]`), r = e.target.closest(`.${Tu}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(Fu), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${Gu}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(Gu)
			}));
			return;
		}
		let a = r.querySelector(`.${Du}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${Tu}`);
		if (t !== null) {
			if (e.target.hasAttribute(Uu)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}));
				return;
			}
			e.target.hasAttribute(Wu) && this.commit(t, (t) => ({
				...t,
				opacity: N(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}));
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${Tu}`);
		if (n === null) return;
		if (t.hasAttribute(Vu)) {
			let e = hd(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = yd(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Hu);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = N(Number(t.value));
		let [l, u, d] = yd(c.r, c.g, c.b);
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
		let t = e.target.closest(`[${zu}]`), n = t === null ? e.target.closest(`[${Bu}]`) : null, r = t ?? n;
		if (r === null) return;
		let i = r.closest(`.${Tu}`);
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
		let { input: t, surface: n } = this.dragging, r = t.querySelector(n === "square" ? `[${zu}]` : `[${Bu}]`);
		if (r === null) return;
		let i = r.getBoundingClientRect();
		if (n === "hue") {
			let n = xd((e.clientY - i.top) / i.height);
			this.commit(t, (e) => ({
				...e,
				hue: n * 360,
				name: null
			}));
			return;
		}
		let a = xd((e.clientX - i.left) / i.width), o = 1 - xd((e.clientY - i.top) / i.height);
		this.commit(t, (e) => ({
			...e,
			saturation: a,
			value: o,
			name: null
		}));
	}
	commit(e, t) {
		let n = this.states.get(e);
		if (n === void 0 || e.hasAttribute(Ju)) return;
		let r = {
			...t(n),
			held: !0
		};
		this.applyState(e, r);
		let i = e.querySelector(`.${ju}`);
		i !== null && (i.value = cd(r, this.resolveRgb(e, r)), i.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	toggle(e) {
		e === null || e.hasAttribute(Ju) || !e.hasAttribute(Xu) && !e.hasAttribute(Zu) || this.setOpen(e, !e.classList.contains(Eu));
	}
	setOpen(e, t) {
		let n = e.querySelector(`.${Du}`);
		if (t && e.hasAttribute(Ju) || n === null) return;
		if (this.openInput !== null && this.openInput !== e && this.setOpen(this.openInput, !1), e.classList.toggle(Eu, t), e.querySelector(`[${Pu}]`)?.setAttribute("aria-expanded", t ? "true" : "false"), !t) {
			b(n), this.openInput = null, lr(this.returnFocus.get(e), n), this.returnFocus.delete(e);
			return;
		}
		this.openInput = e, In((e.getAttribute(Yu) === "swatch" ? e.querySelector(`.${Au}`) : e.querySelector(`.${ku}`)) ?? e, n, {
			placement: "bottom-end",
			gap: Qu
		});
		let r = cr(n, n.querySelector(`[${Iu}]`));
		r !== null && this.returnFocus.set(e, r);
	}
};
function ed(e, t) {
	return ((t) => e.hasAttribute(t === "picker" ? Xu : Zu))(t) ? t : t === "picker" ? "palette" : "picker";
}
function td(e) {
	return ed(e, "picker");
}
function nd(e) {
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
function rd(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function id(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return ad(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function ad(e, t, n) {
	return .2126 * od(e) + .7152 * od(t) + .0722 * od(n);
}
function od(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function sd(e) {
	return e.querySelector(`.${ju}`)?.value.trim() ?? "";
}
function cd(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = gd(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${_d(e.opacity)}`;
}
function ld(e, t, n, r, i) {
	if (e.getAttribute(qu) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = gd(t, n, r);
	return i === 255 ? a : `${a}${_d(i)}`;
}
function ud(e, t) {
	for (let n of e.querySelectorAll(`.${Ou}`)) n.textContent !== t && (n.textContent = t);
}
function dd(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function fd(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function pd(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function md(e, t) {
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
function hd(e) {
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
function gd(e, t, n) {
	return `#${_d(e)}${_d(t)}${_d(n)}`;
}
function _d(e) {
	return N(e).toString(16).padStart(2, "0").toUpperCase();
}
function vd(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function yd(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function bd(e, t, n) {
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
function N(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function xd(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var Sd = "ui-table", Cd = ".ui-table__resizer", wd = "--ui-table-columns", Td = "--ui-table-sized-columns", Ed = "columns", Dd = 32, Od = 16, kd = class {
	root;
	store = new Ec();
	restored = /* @__PURE__ */ new WeakSet();
	warner = new u();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new el({
			root: this.root,
			resolveHandle: (e) => e.closest(Cd),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Sd}`)), x(this.root, `.${Sd}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		let t = this.store.read(e, Ed);
		t !== null && e.style.getPropertyValue(Td).length === 0 && e.style.setProperty(Td, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Cd);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Od;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Cd)?.closest(`.${Sd}`) ?? null;
		t !== null && (t.style.removeProperty(Td), this.store.write(t, Ed, null));
	}
	apply(e, t) {
		let n = fl(e.tracks.map((t, n) => n === e.index || n === e.index + 1 ? {
			...t,
			min: Math.max(Dd, t.min ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.index + 1]
		}, t);
		return n !== null && (e.table.style.setProperty(Td, al(n)), !0);
	}
	remember(e) {
		let t = e.style.getPropertyValue(Td).trim();
		if (t.length === 0) {
			this.store.write(e, Ed, null);
			return;
		}
		this.store.write(e, Ed, t, { styles: { [Td]: t } });
	}
	resolveContext(e) {
		let t = e.closest(`.${Sd}`);
		if (t === null) return null;
		let n = t.style.getPropertyValue(Td).trim() || t.style.getPropertyValue(wd).trim(), r = n.length === 0 ? null : tl(n);
		if (r === null) return this.warner.warn(t, "the table's track list could not be read.", { template: n }), null;
		let i = ll(r, cl(t.getAttribute(Ie))), a = getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat).filter((e) => Number.isFinite(e)), o = Number(e.getAttribute(ze));
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
function Ad(e, t, n, r, i) {
	jd(t, r), n.classList.add(r), e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function jd(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/inline-rename.ts
function Md(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.value = e.value, Nd(r, n, t);
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
function Nd(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t);
	e.style.left = `${r.left - i.left}px`, e.style.top = `${r.top - i.top}px`, e.style.width = `${r.width}px`, e.style.height = `${r.height}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/row-cursor.ts
var Pd = "data-ui-row-focus", Fd = 0;
function Id(e) {
	return e.matches(".ui-disabled, [inert]") || e.querySelector(":scope > [data-ui-id][inert], :scope > :not([data-ui-id]) > [data-ui-id][inert]") !== null;
}
function Ld(e) {
	return e.filter((e) => e.getClientRects().length > 0 && !Id(e));
}
function Rd(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !Id(e)) ?? Ld(e)[0] ?? null;
}
function zd(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Pd);
	n.setAttribute(Pd, ""), n.id.length === 0 && (n.id = `ui-row-${++Fd}`), e.setAttribute("aria-activedescendant", n.id), n.scrollIntoView({ block: "nearest" });
}
function Bd(e, t, n, r) {
	return Pi({
		key: e,
		items: Ld(t),
		current: n,
		axis: r,
		loop: !1
	});
}
function Vd(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function Hd(e, t, n) {
	let r = n.hasAttribute(Pd), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Ld(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && zd(e, o, s);
	};
}
//#endregion
//#region src/interactions/tree-engine.ts
var P = "ui-tree", Ud = "ui-tree__row", Wd = "ui-tree__row--folded", Gd = "ui-tree__row--dragging", Kd = "ui-tree__loading", qd = "ui-tree__loading-ring", Jd = "ui-tree-node", Yd = "ui-tree-node__text", Xd = "ui-tree-node__toggle", Zd = "ui-tree-node__rename", Qd = ".ui-text__title", $d = "data-ui-tree-drop", ef = "--ui-tree-depth", tf = "expanded", nf = class {
	root;
	store = new Ec();
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(g(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => of(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${P}`)), x(this.root, `.${P}`, {
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
			let t = sf(e)?.getAttribute(Be);
			t != null && t.length > 0 && i.add(t);
		}
		let a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = of(e), o = sf(e), s = o?.getAttribute("data-ui-tree-parent") ?? "", c = s.length > 0 ? a.get(s) : void 0, l = c === void 0 ? 0 : c.depth + 1, u = c === void 0 || c.shown && c.expanded, d = o?.hasAttribute(Ve) === !0, f = d || i.has(n), p = f && (t[n] ?? o?.hasAttribute("data-ui-tree-expanded") === !0);
			e.style.setProperty(ef, String(l)), e.setAttribute("aria-level", String(l + 1)), e.classList.toggle(Wd, !u), e.draggable = r && !e.hasAttribute("data-ui-undraggable"), f ? e.setAttribute("aria-expanded", p ? "true" : "false") : e.removeAttribute("aria-expanded"), (i.has(n) || !d) && e.removeAttribute(We), p && u && d && !i.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(We, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), p || this.requested.delete(e), this.placeLoadingRow(e, l + 1, e.hasAttribute(We), u && p), a.set(n, {
				row: e,
				depth: l,
				shown: u,
				expanded: p
			});
		}
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Kd) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? rf();
		o.style.setProperty(ef, String(t)), o.classList.toggle(Wd, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Xd}`) === null && (!r.hasAttribute("data-ui-unselectable") || ui(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, !1), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || ui(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Ud}`), n = t?.closest(`.${P}`) ?? null;
		return t === null || n === null || t.closest(`.${P}`) !== n || Id(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ud}`);
		if (t !== null && ui(e.target, t) !== null) return;
		let n = e.target.closest(`.${P}`);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.rowsOf(n), i = Rd(r), a = Bd(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, !0);
			return;
		}
		if (!(i === null || Id(i))) {
			switch (e.key) {
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, Bd("ArrowDown", r, i, "vertical"), !0);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), !0);
					break;
				case "Enter":
					i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete":
					if (i.hasAttribute("data-ui-unremovable") || n.hasAttribute("data-ui-tree-unremovable")) return;
					i.dispatchEvent(new Event("remove", { bubbles: !0 }));
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = af(e), n = t?.closest(`.${P}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tree-draggable") || Ad(e, n, t, Gd, of(t));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${P}`), n = t?.querySelector(`.${Gd}`) ?? null, r = t === null ? null : this.hostOf(t);
		if (t === null || n === null || r === null) return;
		let i = e.target.closest(`.${Ud}`), a = i !== null && i.closest(`.${P}`) === t ? i : r;
		a === n || a !== r && this.isUnder(t, a, n) || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${P}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && this.markDrop(t, null);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${P}`), n = t?.querySelector(`.${Gd}`) ?? null, r = t?.querySelector(`[${$d}]`) ?? null;
		if (t === null || n === null || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Ud) ? of(r) : "", a = sf(n)?.querySelector(`.${Yd}`) ?? null;
		this.markDrop(t, null), n.classList.remove(Gd), a !== null && (a.setAttribute(Ge, i), a.dispatchEvent(new Event("change", { bubbles: !0 })), n.dispatchEvent(new Event("move", { bubbles: !0 })));
	}
	handleDragEnd(e) {
		let t = af(e), n = t?.closest(`.${P}`) ?? null;
		t?.classList.remove(Gd), n !== null && this.markDrop(n, null);
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${$d}]`)) n !== t && n.removeAttribute($d);
		t?.setAttribute($d, "");
	}
	isUnder(e, t, n) {
		let r = of(n);
		for (let n = this.parentOf(e, t); n !== null; n = this.parentOf(e, n)) if (of(n) === r) return !0;
		return !1;
	}
	toggle(e, t) {
		let n = of(t);
		if (n.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let r = this.foldOf(e);
		r[n] = t.getAttribute("aria-expanded") !== "true", this.store.writeJson(e, tf, r), this.layout(e);
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, tf) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		t !== null && (zd(e, this.rowsOf(e), t), n && e.getAttribute("data-ui-selection") === "one" && !t.hasAttribute("data-ui-unselectable") && Kl(e, of(t), {
			attribute: $e,
			bindingAttribute: tt,
			apply: () => {}
		}));
	}
	parentOf(e, t) {
		let n = sf(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => of(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${P}`), n = sf(e), r = n?.querySelector(Qd) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, !1), Md({
			container: n,
			title: r,
			className: Zd,
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
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Ud) && n.push(e);
		return n;
	}
};
function rf() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Kd, e.setAttribute("aria-hidden", "true"), t.className = qd, e.append(t, v.text("ui.tree.loading")), e;
}
function af(e) {
	return e.target instanceof Element ? e.target.closest(`.${Ud}`) : null;
}
function of(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function sf(e) {
	return e.querySelector(`.${Jd}`);
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var F = "ui-tabs-view", cf = "ui-tab-item", lf = "ui-tab-item__label", uf = "ui-tab-item__close", df = "ui-tab-item__rename", ff = "ui-tab-item__caption", pf = ".ui-text__title", mf = "ui-tab-item--dragging", hf = "ui-tab-item__caption--overflowed", gf = "ui-tabs-view--overflowing", _f = "ui-tabs-view--no-overflow", vf = "ui-tab-item__page", yf = "ui-tab-item--selected", bf = "data-ui-tabs-renamable", xf = class {
	root;
	overflow;
	dragStart = null;
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		for (let t of e) {
			let e = t.target.closest(`.${F}`);
			e !== null && this.apply(e);
		}
	}) : null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.overflow = new cu(this.root, (e, t) => this.select(e, t)), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(g(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => I(e) === t.key))?.querySelector(`.${lf}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), x(this.root, `.${F}`, {
			childList: !0,
			attributeFilter: [nt, ...at]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${F}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(tu);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => I(e) === r)) {
			this.select(e, I(n[0]));
			return;
		}
		let i = e.hasAttribute(oe), a = [], o = null;
		for (let e of t) {
			let t = I(e) === r;
			e.classList.toggle(yf, t);
			let s = e.querySelector(`.${ff}`);
			s !== null && (s.draggable = i, n.includes(e) && (a.push(s), t && (o = s))), e.querySelector(`.${lf}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${vf}`)) n.hidden = !t;
		}
		this.fitCaptions(e, a, o);
		let s = [], c = null;
		for (let e of a) {
			let t = e.querySelector(`.${lf}`);
			t === null || e.classList.contains(hf) || (s.push(t), e === o && (c = t));
		}
		Fi(s, c);
	}
	fitCaptions(e, t, n) {
		let r = e.querySelector(`:scope > [${pe}]`), i = e.querySelector(`:scope > .${nu}`);
		if (r === null || i === null) return;
		if (e.classList.contains(_f)) {
			for (let e of t) e.classList.remove(hf);
			e.classList.remove(gf);
			return;
		}
		this.resizes?.observe(r), e.classList.add(gf);
		let a = su({
			captions: t,
			selected: n,
			width: r.clientWidth,
			buttonWidth: i.getBoundingClientRect().width,
			hiddenClass: hf
		});
		e.classList.toggle(gf, a), !a && this.overflow.isOpenFor(e) && this.overflow.close();
	}
	toggleOverflow(e, t) {
		if (this.overflow.isOpenFor(e)) {
			this.overflow.close();
			return;
		}
		let n = e.getAttribute("data-ui-tabs-selected") ?? "", r = this.ownItems(e).filter(tu).map((e) => ({
			key: I(e),
			title: e.querySelector(`.${lf}`)?.textContent?.trim() ?? I(e),
			current: I(e) === n
		}));
		this.overflow.open(t, e, r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${nu}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(F)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${lf}`), i = r?.closest(`.${F}`) ?? null;
		if (r === null || i === null || r.matches(":disabled, .ui-disabled")) return;
		let a = r.closest(`.${cf}`);
		a !== null && a.closest(`.${F}`) === i && (e.preventDefault(), this.select(i, I(a)));
	}
	handleClose(e, t) {
		let n = t.closest(`.${uf}`), r = n?.closest(`.${cf}`) ?? null, i = r?.closest(`.${F}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), i.hasAttribute("data-ui-tabs-unremovable") || Sf(r).hasAttribute("data-ui-unremovable") || r.hasAttribute("data-ui-unremovable") || r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lf}`), n = t?.closest(`.${F}`) ?? null;
		t === null || n === null || !n.hasAttribute(bf) || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(pf) ?? e, r = e.closest(`.${cf}`);
		t === null || r === null || Sf(r).hasAttribute("data-ui-unrenamable") || Md({
			container: t,
			title: n,
			className: df,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(it, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			done: () => e.focus()
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lf}`), n = t?.closest(`.${F}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute(bf)) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${lf}`)).filter((e) => e !== null), i = Pi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${cf}`);
		a !== null && this.select(n, I(a)), i.focus();
	}
	handleDragStart(e) {
		let t = wf(e);
		if (t === null) return;
		if (Sf(t).hasAttribute("data-ui-undraggable")) {
			e.preventDefault();
			return;
		}
		Ad(e, t.closest(`.${F}`) ?? t, t, mf, I(t));
		let n = Sf(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ff}`)?.closest(`.${cf}`) ?? null, n = t?.closest(`.${F}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${mf}`);
		if (r === null || r === t) return;
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move");
		let i = t.querySelector(`.${ff}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = e.clientX < i.left + i.width / 2, o = Sf(r), s = Sf(t);
		s.parentElement?.insertBefore(o, a ? s : s.nextElementSibling);
	}
	handleDragEnd(e) {
		let t = wf(e);
		if (t === null) return;
		t.classList.remove(mf);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Sf(t), n.next);
			return;
		}
		this.commitOrder(t);
	}
	commitOrder(e) {
		let t = Sf(e), n = Tf(Cf(t.previousElementSibling)), r = Tf(Cf(t.nextElementSibling)), i = n === null && r === null ? 0 : n === null ? r - 1 : r === null ? n + 1 : (n + r) / 2;
		Tf(e) !== i && (e.setAttribute(rt, String(i)), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	select(e, t) {
		Kl(e, t, {
			attribute: nt,
			bindingAttribute: tt,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return S(e, `.${cf}`, `.${F}`);
	}
};
function Sf(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Cf(e) {
	return e === null ? null : e.matches(`.${cf}`) ? e : e.querySelector(`.${cf}`);
}
function wf(e) {
	return e.target instanceof Element ? e.target.closest(`.${ff}`)?.closest(`.${cf}`) ?? null : null;
}
function Tf(e) {
	let t = e?.getAttribute("data-ui-tab-order") ?? null;
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function I(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var Ef = "button.ui-text__fold-toggle", Df = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Ef);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, Of = "ui-temporal-input__segments", kf = "ui-temporal-input__segment", Af = "ui-temporal-input__segment-literal", jf = "ui-temporal-input__segment--empty", Mf = "data-ui-temporal-segment", Nf = "data-ui-temporal-step-direction", Pf = "data-ui-temporal-readonly", Ff = "data-ui-temporal-segments-of", If = "--", Lf = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${w}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = g(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, ".ui-temporal-input") ?? []);
		}), x(this.root, `.${w}`, { attributeFilter: [...go] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("wheel", (e) => this.handleWheel(e), {
			capture: !0,
			passive: !1
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) vo(t) === "time" && (Ao(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${Of}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = yo(e), r = So(e), i = E(e, wo(t));
		t.getAttribute(Ff) !== n && (t.replaceChildren(...Rf(n).map((e) => Bf(e))), t.setAttribute(Ff, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(Mf);
			if (t === null) {
				n.textContent = Vf(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = Hf(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(jf, i === null), n.tabIndex = e.hasAttribute(Pf) ? -1 : 0, Uf(n, t, i);
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = Gf(e.target);
		if (t === null) return;
		let n = t.closest(`.${w}`), r = t.getAttribute(Mf), i = Wf(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), qf(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), Oo(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = Jf(e.key, So(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleWheel(e) {
		if (!(e instanceof WheelEvent)) return;
		let t = Gf(e.target);
		if (t === null || t !== document.activeElement) return;
		e.preventDefault();
		let n = t.closest(`.${w}`);
		this.resetBuffer(n), this.applyStep(n, t.getAttribute(Mf), e.deltaY < 0 ? 1 : -1, Wf(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${Nf}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Nf}]`);
		if (t === null) return;
		let n = t.closest(`.${w}`);
		if (n === null || n.hasAttribute(Pf)) return;
		e.preventDefault();
		let r = Kf(n) ?? n.querySelector(`.${kf}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(Mf), t.getAttribute(Nf) === "up" ? 1 : -1, Wf(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${kf}`) : null;
		if (t === null) return;
		let n = t.closest(`.${w}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = E(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = Yf(t), o = xo(bo(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Xf(i, a) + o) % s + s) % s;
		this.write(e, Zf(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Zf(t, "hour", Qf(l, t.getHours() >= 12)) : Zf(t, Yf(n), l), i);
		}
		u && qf(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, Zf(r, "hour", Qf(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return E(e, t) ?? Mo(e);
	}
	write(e, t, n) {
		Oo(e, No(e, t), n), ko(e), this.applySegments(e);
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
function Rf(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = ro(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(zf(r)), n += r.length;
	}
	return t;
}
function zf(e) {
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
function Bf(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = Af, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = kf, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(Mf, e.unit), t.dataset.width = String(e.width), t;
}
function Vf(e, t, n, r) {
	return t && n !== null ? to(n, e, r) : e;
}
function Hf(e, t, n, r) {
	if (n === null) return If;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : Xf(n, Yf(e));
	return String(i).padStart(t, "0");
}
function Uf(e, t, n) {
	if (t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(Xf(n, Yf(t))));
}
function Wf(e) {
	return wo(e.closest(`.${Of}`));
}
function Gf(e) {
	let t = e instanceof Element ? e.closest(`.${kf}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${w}`);
	return n === null || n.hasAttribute(Pf) ? null : t;
}
function Kf(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${kf}`) : null;
}
function qf(e, t, n) {
	Pi({
		key: n,
		items: [...e.querySelectorAll(`.${kf}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function Jf(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function Yf(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function Xf(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Zf(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Qf(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var $f = "data-ui-scroll-anchor", ep = 4, tp = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), x(this.root, `[${$f}="End"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ke]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !np(t) || this.pinned.set(t, rp(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${$f}="End"]`));
	}
	followEach(e) {
		for (let t of e) this.pinned.get(t) !== !1 && (this.pinned.set(t, !0), rp(t) || (t.scrollTop = t.scrollHeight));
	}
};
function np(e) {
	return e.getAttribute($f) === "End";
}
function rp(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= ep;
}
//#endregion
//#region src/interactions/press-ripple-engine.ts
var ip = ".ui-button, .ui-action, .ui-menu-item", ap = "ui-pressing", op = "--ui-press-x", sp = "--ui-press-y", cp = 250, lp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(ip);
		if (t === null || t.matches(":disabled, .ui-disabled, [inert]")) return;
		let n = t.getBoundingClientRect();
		t.style.setProperty(op, `${e.clientX - n.left}px`), t.style.setProperty(sp, `${e.clientY - n.top}px`), t.classList.remove(ap), t.offsetWidth, t.classList.add(ap), window.setTimeout(() => t.classList.remove(ap), cp);
	}
}, up = "mask:", dp = "ui-icon--image";
function fp(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(up) && (n = !0, t = t.slice(5).trim()), pp(t) ? {
		source: t,
		tinted: n
	} : null;
}
function pp(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function mp(e) {
	let t = fp(e);
	return t === null ? "" : hp(t.source);
}
function hp(e) {
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
var gp = "ui-icon-glyph--";
function _p(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = gp;
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
var L = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, vp = "\\", yp = "`", bp = "!", xp = "{", Sp = "}", Cp = "ui-text__fold", wp = "ui-text__fold-toggle", Tp = "ui-text__fold-content";
function Ep(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Lp(e, 0, e.length, L.None, null, t, n), Rp(t, n, L.None, null), t;
}
function Dp(e) {
	return Ep(e).map((e) => jp(e) ? `${e.fold} ${Dp(e.text)}` : e.text).join("");
}
function Op(e, t, n = {}) {
	let r = Ep(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && kp(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Mp(r, n));
}
function kp(e) {
	return e.styles === L.None && e.url === null && !Ap(e) && !jp(e);
}
function Ap(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function jp(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Mp(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Np(r, t));
	return n;
}
function Np(e, t) {
	if (Ap(e)) return Fp(e.icon);
	let n = jp(e) ? Pp(e, t) : document.createTextNode(e.text);
	if ((e.styles & L.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & L.Strikethrough) !== 0 && (n = Ip("s", n)), (e.styles & L.Underline) !== 0 && (n = Ip("u", n)), (e.styles & L.Italic) !== 0 && (n = Ip("em", n)), (e.styles & L.Bold) !== 0 && (n = Ip("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Yp(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Pp(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Cp} ${Cp}--static` : Cp, r.className = wp, r.textContent = e.fold ?? "", i.className = Tp, i.append(Mp(Ep(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(de, ""), n.append(r, i), n);
}
function Fp(e) {
	let t = document.createElement("i");
	return t.className = `ui-icon ui-text__icon-inline ${_p(e)}`.trim(), t.setAttribute("data-ui-icon", ""), t.setAttribute("aria-hidden", "true"), t;
}
function Ip(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Lp(e, t, n, r, i, a, o) {
	let s = t;
	for (; s < n;) {
		let t = e[s];
		if (t === vp && s + 1 < n && Xp(e[s + 1])) {
			o.value += e[s + 1], s += 2;
			continue;
		}
		let c = zp(e, s, n);
		if (c !== null) {
			Rp(a, o, r, i), Bp(e, s + 1, c, o), Rp(a, o, r | L.Code, i), s = c + 1;
			continue;
		}
		let l = Wp(e, s, n);
		if (l !== null) {
			Rp(a, o, r, i), Lp(e, s + l.markerLength, l.contentEnd, r | l.style, i, a, o), Rp(a, o, r | l.style, i), s = l.contentEnd + l.markerLength;
			continue;
		}
		let u = Vp(e, s, n);
		if (u !== null) {
			Rp(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: u.name
			}), s = u.iconEnd;
			continue;
		}
		let d = i === null ? Kp(e, s, n) : null;
		if (d !== null) {
			Rp(a, o, r, i), Lp(e, d.labelStart, d.labelEnd, r, d.url, a, o), Rp(a, o, r, d.url), s = d.linkEnd;
			continue;
		}
		let f = Jp(e, s, n);
		if (f !== null) {
			Rp(a, o, r, i), a.push({
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
function Rp(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function zp(e, t, n) {
	if (e[t] !== yp) return null;
	let r = t + 1;
	if (r >= n || Zp(e[r])) return null;
	let i = Gp(e, r, n, yp, 1);
	return i > r ? i : null;
}
function Bp(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === vp && i + 1 < n && Xp(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Vp(e, t, n) {
	if (e[t] !== bp || t + 1 >= n || e[t + 1] !== "[") return null;
	let r = t + 2, i = Hp(e, r, n);
	if (i <= r) return null;
	let a = e.slice(r, i);
	return Up(a) ? {
		name: a,
		iconEnd: i + 1
	} : null;
}
function Hp(e, t, n) {
	for (let r = t; r < n; r++) {
		if (e[r] === vp) {
			r++;
			continue;
		}
		if (e[r] === "]") return r;
	}
	return -1;
}
function Up(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Wp(e, t, n) {
	let r = e[t];
	if (r !== "*" && r !== "_" && r !== "~") return null;
	let i = t + 1 < n && e[t + 1] === r, a, o;
	if (r === "*" && i) a = L.Bold, o = 2;
	else if (r === "*") a = L.Italic, o = 1;
	else if (r === "_" && i) a = L.Underline, o = 2;
	else if (r === "~" && i) a = L.Strikethrough, o = 2;
	else return null;
	let s = t + o;
	if (s >= n || Zp(e[s])) return null;
	let c = Gp(e, s, n, r, o);
	return c > s ? {
		style: a,
		markerLength: o,
		contentEnd: c
	} : null;
}
function Gp(e, t, n, r, i) {
	for (let a = t; a + i <= n; a++) {
		if (e[a] === vp) {
			a++;
			continue;
		}
		if (e[a] === r && !(i === 2 && (a + 1 >= n || e[a + 1] !== r)) && !(i === 1 && a + 1 < n && e[a + 1] === r) && a > t && !Zp(e[a - 1])) return a;
	}
	return -1;
}
function Kp(e, t, n) {
	if (e[t] !== "[") return null;
	let r = Hp(e, t + 1, n);
	if (r < 0 || r + 1 >= n || e[r + 1] !== "(") return null;
	let i = e.indexOf(")", r + 2);
	if (i < 0 || i >= n) return null;
	let a = e.slice(r + 2, i).trim();
	if (!qp(a)) return null;
	let o = t + 1, s = r;
	return s > o ? {
		labelStart: o,
		labelEnd: s,
		url: a,
		linkEnd: i + 1
	} : null;
}
function qp(e) {
	if (e == null || e.trim().length === 0) return !1;
	for (let t of e) {
		let e = t.codePointAt(0) ?? 0;
		if (e < 32 || e === 127 || Zp(t)) return !1;
	}
	if (e[0] === "/" || e[0] === "#" || e[0] === "?" || e[0] === ".") return !0;
	let t = e.indexOf(":");
	if (t < 0) return !0;
	let n = e.slice(0, t).toLowerCase();
	return n === "http" || n === "https" || n === "mailto" || n === "tel";
}
function Jp(e, t, n) {
	if (e[t] !== "[") return null;
	let r = Hp(e, t + 1, n);
	if (r <= t + 1 || r + 1 >= n || e[r + 1] !== xp) return null;
	for (let n = t + 1; n < r; n++) if (e[n] === vp) n++;
	else if (e[n] === "[") return null;
	let i = r + 2, a = -1, o = 1;
	for (let t = i; t < n && a < 0; t++) {
		if (e[t] === vp) {
			t++;
			continue;
		}
		e[t] === xp ? o++ : e[t] === Sp && --o === 0 && (a = t);
	}
	if (a <= i) return null;
	let s = { value: "" };
	return Bp(e, t + 1, r, s), {
		caption: s.value,
		contentStart: i,
		contentEnd: a
	};
}
function Yp(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function Xp(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === xp || e === Sp || e === yp || e === vp;
}
function Zp(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Qp = "data-ui-tooltip", $p = "data-ui-tooltip-placement", em = "ui-tooltip", tm = "ui-tooltip--visible", nm = "top", rm = 250, im = 200, am = 300, om = 7, R = null, z = null, sm = 0, cm = 0, lm = 0, um = !1;
function dm(e = document) {
	if (um) return;
	um = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", fm, !0), t.addEventListener("pointerout", pm, !0), t.addEventListener("focusin", mm, !0), t.addEventListener("focusout", hm, !0), t.addEventListener("keydown", gm, !0), t.addEventListener("pointerdown", (e) => {
		_m(e.target) || Sm(!0);
	}, !0), window.addEventListener("blur", () => Sm(!0));
}
function fm(e) {
	if (_m(e.target)) {
		window.clearTimeout(cm);
		return;
	}
	let t = vm(e.target);
	t !== null && t !== z && ym(t);
}
function pm(e) {
	let t = e.relatedTarget;
	t instanceof Node && (z !== null && z.contains(t) || _m(t)) || (_m(e.target) || vm(e.target) === z) && Sm(!1);
}
function mm(e) {
	let t = vm(e.target);
	t !== null && bm(t);
}
function hm(e) {
	vm(e.target) === z && Sm(!0);
}
function gm(e) {
	e.key === "Escape" && z !== null && Sm(!0);
}
function _m(e) {
	return R !== null && e instanceof Node && R.contains(e);
}
function vm(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Qp}]`);
	return t === null ? null : (t.getAttribute(Qp) ?? "").trim().length > 0 ? t : null;
}
function ym(e) {
	if (window.clearTimeout(cm), window.clearTimeout(sm), z !== null) {
		Sm(!0), bm(e);
		return;
	}
	if (Date.now() - lm < am) {
		bm(e);
		return;
	}
	sm = window.setTimeout(() => bm(e), rm);
}
function bm(e) {
	let t = (e.getAttribute(Qp) ?? "").trim();
	if (t.length === 0 || !e.isConnected) return;
	window.clearTimeout(sm), window.clearTimeout(cm);
	let n = Cm();
	Op(n, t, { staticFolds: !0 }), n.classList.add(tm), z = e, e.setAttribute("aria-describedby", n.id), n.setAttribute("data-ui-tooltip-text", Dp(t)), In(e, n, {
		placement: xm(e),
		gap: om
	});
}
function xm(e) {
	let t = e.getAttribute($p);
	return t !== null && An(t) ? t : nm;
}
function Sm(e) {
	window.clearTimeout(sm), window.clearTimeout(cm);
	let t = () => {
		z !== null && (z.removeAttribute("aria-describedby"), z = null, R !== null && (R.classList.remove(tm), b(R)), lm = Date.now());
	};
	e ? t() : cm = window.setTimeout(t, im);
}
function Cm() {
	return R !== null && R.isConnected ? R : (R = document.createElement("div"), R.id = "ui-tooltip", R.className = em, R.setAttribute("role", "tooltip"), R.setAttribute("aria-hidden", "true"), document.body.append(R), R);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var B = { ok: !1 };
function wm(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r
	};
	let a = (n ?? []).filter((e) => mt(e.kind) !== "Scope"), o = r, s = !0, c = 0, l = 0, u = !0;
	for (; l < i.length;) {
		let t = i[l];
		if (t === ".") {
			if (u) return B;
			u = !0, l++;
			continue;
		}
		if (t === "[") {
			if (l + 1 >= i.length || i[l + 1] !== "]" || c >= a.length) return B;
			let t = a[c];
			if (c++, mt(t.kind) === "Dynamic") {
				let n = Em(e, t.componentId);
				if (!n.ok) return B;
				o = n.value, s = !0;
			} else {
				if (!s) return B;
				let e = jm(o, t.value);
				if (!e.ok) return B;
				o = e.value;
			}
			l += 2, u = !1;
			continue;
		}
		let n = l;
		for (; l < i.length && i[l] !== "." && i[l] !== "[";) l++;
		if (l === n) return B;
		if (s) {
			let e = Dm(o, i.slice(n, l));
			e.ok ? o = e.value : s = !1;
		}
		u = !1;
	}
	return u || c !== a.length || !s ? B : {
		ok: !0,
		value: o
	};
}
var Tm = /* @__PURE__ */ new Set();
function Em(e, t) {
	let n = g(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Tm.has(n) || (Tm.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), B;
}
function Dm(e, t) {
	if (e == null) return B;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return B;
	let n = e, r = Om(n, t);
	return Object.prototype.hasOwnProperty.call(n, r) ? {
		ok: !0,
		value: n[r]
	} : B;
}
function Om(e, t) {
	if (Object.prototype.hasOwnProperty.call(e, t)) return t;
	let n = km(t);
	if (Object.prototype.hasOwnProperty.call(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function km(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Am(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => mt(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, mt(e.kind) !== "Dynamic") {
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
function jm(e, t) {
	if (e == null || t == null) return B;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : B;
	if (typeof t != "string") return B;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.prototype.hasOwnProperty.call(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Nm(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return B;
}
function Mm(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Nm(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.prototype.hasOwnProperty.call(r, t) ? (r[t] = n, !0) : !1;
}
function Nm(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Pm = `:scope > [${_e}], :scope > [${ve}], :scope > [${Se}]`, Fm = "ui-hidden";
function V(e) {
	let t = new Set(e.querySelectorAll(Pm));
	return [...e.children].filter((e) => !t.has(e));
}
function Im(e) {
	return e === null ? [] : [e];
}
function Lm(e) {
	return e.querySelector(`:scope > [${_e}]`);
}
function Rm(e, t, n, r, i) {
	i ??= V(e).some((e) => !e.classList.contains(Fm));
	let a = Lm(e);
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
function zm(e) {
	let t = e.closest(st)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Bm(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = zm(e);
	if (a !== void 0 || o !== null) for (let n of V(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Fm);
			continue;
		}
		n.classList.toggle(Fm, !Vm(a, e, i, o));
	}
}
function Vm(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Gm(e, t, n)) && (r?.filters ?? []).every((e) => xn(qm(t, e.itemProperty), e.operator, e.value));
}
function Hm(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Km(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Um(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Wm(n.getItemValue(e), n.getItemValue(r), t));
}
function Wm(e, t, n) {
	for (let r of n) {
		let n = Jm(qm(e, r.itemProperty), qm(t, r.itemProperty));
		if (n !== 0) return yt(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Gm(e, t, n) {
	if (!Km(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return xn(qm(t, e.itemProperty), e.operator, r);
}
function Km(e, t, n, r) {
	return e == null || xn(r.get(e, []), t, n);
}
function qm(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Dm(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Jm(e, t) {
	if (e === t) return 0;
	if (e == null) return -1;
	if (t == null) return 1;
	if (typeof e == "number" && typeof t == "number") return e - t;
	let n = Number(e), r = Number(t);
	return !Number.isNaN(n) && !Number.isNaN(r) ? n - r : String(e).localeCompare(String(t));
}
//#endregion
//#region src/items/items-host-mode.ts
function Ym(e) {
	switch (e.getAttribute(xe)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-dom-order.ts
function Xm(e, t) {
	let n = e.firstElementChild;
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var Zm = /* @__PURE__ */ new WeakMap();
function Qm(e, t) {
	let n = Zm.get(e), r = n === void 0 ? [...t] : $m(n, t);
	return Zm.set(e, r), r;
}
function $m(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function eh(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function th(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function nh(e, t, n) {
	return th(e, t), eh(e, t, n);
}
function rh(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function ih(e) {
	Zm.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var ah = /* @__PURE__ */ new WeakMap();
function oh(e) {
	for (let t of e.querySelectorAll(`[${ve}]`)) t.remove();
}
function sh(e, t, n, r, i, a) {
	let o = Ym(e) === "windowed", s = V(e), c = o ? s : Qm(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : Hm(f, a, zm(e));
	if (u && !d && oh(e), c.length === 0) {
		ah.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Lm(e);
	if (!d) {
		Xm(e, [...Um(c, p, r), ...Im(ee)]);
		return;
	}
	oh(e);
	let m = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = m.get(t);
		n === void 0 ? m.set(t, [e]) : n.push(e);
	}
	let te = (ah.get(e) ?? []).filter((e) => m.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		te.includes(t) || te.push(t);
	}
	ah.set(e, te);
	let ne = [];
	for (let e of te) {
		let t = m.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = Um(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = ch(l, r, t[0]);
				e !== null && ne.push(e);
			}
			ne.push(...t);
		}
	}
	Xm(e, [...ne, ...Im(ee)]);
}
function ch(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(ve, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
function lh(e, t, n) {
	switch (Ym(e)) {
		case "windowed":
			Rm(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Bm(e, t, n.metadata, n.renderer, n.state), Rm(e, t, n.templates, n.renderer), sh(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/items/items-template-renderer.ts
var uh = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? fh(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null) : o;
		l !== o && this.moveItemScope(o, l), ph(l, n, t);
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
		let i = dh(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: Gt(r),
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
		let r = _h(t, n.templateKeyPropertyName);
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
		} : { ok: !1 } : wm(n, i.itemTemplate, i.itemTemplateParameters);
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
			let n = Rt(u, t, () => [e])[0] ?? null;
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
function dh(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Dm(r, i.name) : jm(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Mm(r, i.key, n), e;
	let a = r;
	return a[Om(a, i.name)] = n, e;
}
function fh(e, t, n) {
	let r = document.createElement(t);
	return n !== null && (r.className = n), r.appendChild(e), r;
}
function ph(e, t, n) {
	e.setAttribute(m, t), gh(e, n), hh(e, n);
}
var mh = [
	["CanSelect", te],
	["CanDrag", ne],
	["CanRemove", re],
	["CanRename", ie],
	["CanShowContextMenu", ae]
];
function hh(e, t) {
	for (let [n, r] of mh) {
		let i = Dm(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function gh(e, t) {
	let n = Dm(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ye, n.value) : e.removeAttribute(ye);
}
function _h(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Dm(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var vh = "Group", yh = class {
	sources = /* @__PURE__ */ new Map();
	options;
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = g(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && (e.reactiveSources.watch(t.source, i), this.sources.set(g(t.source.componentId), { reference: t.source }));
		}
		for (let t of sn) e.root.addEventListener(t, (e) => this.handleSourceValueEvent(e), !0);
		x(e.root, `[${me}]`, { attributeFilter: [me] }, (e) => {
			for (let t of e) {
				let e = Kt(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
	}
	handleSourceValueEvent(e) {
		if (!(e.target instanceof Element)) return;
		let t = Kt(e.target), n = t === null ? void 0 : this.sources.get(t);
		n !== void 0 && this.options.propertyPatchEngine.applyPropertyValue(n.reference, [], this.options.valueReaders.readBound(e.target), !0);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(g(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Am(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${pe}]`)) Ym(r) === "virtualized" && this.options.virtualization.updateValue(r, n, t.steps, e.value) && lh(r, Kt(r) ?? 0, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${ct(t)}"]`)].filter((t) => this.isItemRoot(t) && Vt(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${pe}]`), i = r === null ? null : Kt(r);
		if (r !== null && i !== null && Ym(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && lh(r, i, this.options);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = bh(vh, t);
		a && gh(e, this.options.renderer.getItemValue(e)), mh.some(([e]) => bh(e, t)) && hh(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || lh(r, i, this.options));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && bh(vh, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => bh(e.itemProperty, t)) || n.sorts.some((e) => bh(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${pe}]`)) {
			let n = Kt(t);
			n === e && lh(t, n, this.options);
		}
	}
};
function bh(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
var xh = "bottom";
function Sh(e, t, n) {
	let r = e.querySelector(`:scope > [${Se}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Se, t), r.style.flex = "0 0 auto"), t === "top" ? e.firstChild !== r && e.insertBefore(r, e.firstChild) : e.lastChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-window-engine.ts
var Ch = 50, wh = 1, Th = .5, Eh = 60, Dh = class {
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
			if (this.layout(t), Mh(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = Fh(e, we);
		t !== null && (e.scrollTop = Oh(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.realign(e);
	}
	realign(e) {
		let t = Fh(e, we), n = jh(e);
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
		if (!(t instanceof Element) || Ym(t) !== "windowed") return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, Eh));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		let n = jh(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = Fh(e, we), i = Oh(e.getAttribute(Ee)), a = Oh(e.getAttribute(De));
		if (r !== null) {
			let o = this.windowSize(e), s = Math.max(1, Math.round(e.clientHeight * wh / t.itemSize), Math.floor(o * Th)), c = Math.floor(e.scrollTop / t.itemSize), l = Math.ceil((e.scrollTop + e.clientHeight) / t.itemSize);
			if (l < r || c > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, c, o), null, !1);
				return;
			}
			if (c - s <= r && i) {
				this.requestAsync(e, "Before", 0, Nh(n[0]), !0);
				return;
			}
			if (l + s >= r + n.length && a) {
				this.requestAsync(e, "After", 0, Nh(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Math.max(1, e.clientHeight * wh), s = e.scrollHeight - e.scrollTop - e.clientHeight;
		if (e.scrollTop <= o && i) {
			this.requestAsync(e, "Before", 0, Nh(n[0]), !0);
			return;
		}
		s <= o && a && this.requestAsync(e, "After", 0, Nh(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = Fh(e, Te);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Kt(e);
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
				dynamicParameters: Ph(e),
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
		let t = this.getState(e), n = jh(e);
		if (n.length > 0) {
			let e = Ah(n[n.length - 1]).bottom - Ah(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / kh(n))));
		}
		let r = Fh(e, Te), i = Fh(e, we), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		Sh(e, "top", a), Sh(e, xh, o);
	}
	windowSize(e) {
		let t = Fh(e, Ce);
		return t !== null && t > 0 ? t : Ch;
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
function Oh(e) {
	return e !== null && e.toLowerCase() === "true";
}
function kh(e) {
	let t = Ah(e[0]).top, n = 1;
	for (; n < e.length && Ah(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function Ah(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function jh(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function Mh(e) {
	return jh(e).length;
}
function Nh(e) {
	return e.getAttribute(m);
}
function Ph(e) {
	let t = e.closest(st);
	return t === null ? [] : Bt(t, zt(t));
}
function Fh(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Ih = ".ui-items-view, .ui-table, .ui-tree", Lh = ".ui-items-view__item, .ui-table__row, .ui-tree__row", Rh = ".ui-items-view, .ui-table", zh = "data-ui-bind-selected-keys", Bh = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${Ih})[${Ze}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), x(this.root, Ih, {
			childList: !0,
			attributeFilter: [
				Ze,
				$e,
				et
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.readKeys(e);
		for (let n of this.ownItems(e)) n.toggleAttribute(Qe, t.has(n.getAttribute("data-ui-key") ?? ""));
		let n = e.getAttribute(Ze);
		(n === "one" || n === "many") && (e.tabIndex = 0);
	}
	readKeys(e) {
		switch (e.getAttribute(Ze)) {
			case "one": {
				let t = e.getAttribute($e);
				return new Set(t === null || t.length === 0 ? [] : [t]);
			}
			case "many": return new Set(this.readKeyList(this.hostOf(e)));
			default: return /* @__PURE__ */ new Set();
		}
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Lh), r = n?.closest(Ih) ?? null;
		return n === null || r === null || n.closest(Ih) !== r || !r.matches(t) || r.matches(".ui-disabled") ? null : ui(e.target, n) === null && !Id(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleClick(e) {
		let t = this.resolveRow(e, Ih);
		if (t === null) return;
		let { root: n, item: r } = t;
		zd(n, this.ownItems(n), r), !r.hasAttribute("data-ui-unselectable") && this.choose(n, r) && e.preventDefault();
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Rh);
		t !== null && (e.preventDefault(), Vd(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Lh);
		if (t !== null && ui(e.target, t) !== null) return;
		let n = e.target.closest(Rh);
		if (n === null || n.matches(".ui-disabled")) return;
		let r = this.ownItems(n), i = Rd(r), a = Bd(e.key, r, i, n.matches(".ui-orientation--horizontal") ? "both" : "vertical");
		if (a !== null) {
			e.preventDefault(), zd(n, r, a), n.getAttribute("data-ui-selection") === "one" && !a.hasAttribute("data-ui-unselectable") && this.selectOne(n, a.getAttribute("data-ui-key") ?? "");
			return;
		}
		if (!(i === null || Id(i))) {
			switch (e.key) {
				case " ":
					if (i.hasAttribute("data-ui-unselectable") || !this.choose(n, i)) return;
					break;
				case "Enter":
					Vd(i, "open");
					break;
				case "Delete":
					if (i.hasAttribute("data-ui-unremovable")) return;
					Vd(i, "remove");
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	choose(e, t) {
		let n = t.getAttribute(m);
		if (n === null || n.length === 0) return !1;
		switch (e.getAttribute(Ze)) {
			case "one": return this.selectOne(e, n), !0;
			case "many": return this.toggleOne(e, n), !0;
			default: return !1;
		}
	}
	selectOne(e, t) {
		Kl(e, t, {
			attribute: $e,
			bindingAttribute: tt,
			apply: (e) => this.apply(e)
		});
	}
	toggleOne(e, t) {
		let n = this.hostOf(e);
		if (n === null) return;
		let r = this.readKeyList(n), i = r.indexOf(t);
		i >= 0 ? r.splice(i, 1) : r.push(t), n.setAttribute(et, JSON.stringify(r)), this.apply(e), n.hasAttribute(zh) && n.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	readKeyList(e) {
		let t = e?.getAttribute("data-ui-selected-keys") ?? null;
		if (t === null || t.length === 0) return [];
		try {
			let e = JSON.parse(t);
			return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
		} catch {
			return [];
		}
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${pe}]`);
	}
	ownItems(e) {
		return S(e, Lh, Ih);
	}
};
//#endregion
//#region src/state/value-equality.ts
function Vh(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Hh(e, t) : Uh(e, t);
}
function Hh(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Vh(e[n], t[n])) return !1;
	return !0;
}
function Uh(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Vh(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var Wh = [
	f,
	p,
	ee
];
function Gh(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, Kh(c, e.itemRole);
	let l = Jh(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = qh(l, t, n, a);
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
		d.className = l.wrapperClassName, Kh(d, l.wrapperRole), d.appendChild(u), ph(d, r, n), c.appendChild(d);
	}
	return ph(c, r, n), o.registerItemScope(c, l, n), c;
}
function Kh(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function qh(e, t, n, r) {
	let i = _h(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function Jh(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of Wh) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), Gt(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function Yh(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e)?.composite;
	return a == null ? i.renderer.renderItem(e, t, n, r) : Gh(a, e, t, n, r, i.templates, i.renderer);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var Xh = 6, Zh = 60, Qh = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = np(e) && rp(e);
		this.project(e, t), this.layout(e, t), n && !rp(e) && (e.scrollTop = e.scrollHeight, this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return;
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Vh(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = V(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Hd(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = dh(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = zm(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Hm(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Vm(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => eg(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Wm(e.item, t.item, a))), t.projected = o.map((e) => ({
				id: e.key,
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = eg(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Wm(e.item, t.item, a))), e !== "" && l.push({
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
		if (!(t instanceof Element) || Ym(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, Zh));
	}
	layout(e, t) {
		let n = t.projected, r = ng(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (tg(e) && a > 0) {
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
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - Xh), s = Math.min(a, s + Xh);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(eg(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), $h(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && ($h(t, r, d), l.push(d), u = !0);
		}
		for (let t of V(e)) l.includes(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${ve}]`)) l.includes(t) || (t.remove(), u = !0);
		let d = rg(i, 0, o), f = rg(i, s, a);
		Xm(e, [...l, ...Im(Lm(e))]), Sh(e, "top", d > 0 ? d - r : 0), Sh(e, xh, f > 0 ? f - r : 0), Rm(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return Yh(e.componentId, t.item, t.key, n, this.options);
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
			let n = t[c], r = n.header ? e.headers.get(eg(n.entry)) : n.entry, l = r?.element;
			if (r == null || l == null) continue;
			let u = l.getBoundingClientRect().height;
			u <= 0 || (r.height = u, n.header ? (o += u, s++) : (i += u, a++));
		}
		a > 0 && (e.itemEstimate = i / a), s > 0 && (e.headerEstimate = o / s);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(eg(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Kt(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = [], i = /* @__PURE__ */ new Map();
		for (let t of V(e)) {
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
function $h(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = eg(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function eg(e) {
	let t = Dm(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function tg(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function ng(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function rg(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var ig = "data-ui-template", ag = "default", og = class {
	dom;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? ag, r = this.findTemplate(e, n);
		return r === void 0 ? n === ag ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${ig}]`);
		for (let e of r) if (e.getAttribute(ig) === t) return e;
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
}, sg = "script[type='application/json'][data-ui-metadata]";
function cg(e = document) {
	let t = e.querySelector(sg);
	if (t === null) return lg();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return lg();
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
function lg() {
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
var ug = "script[type='application/json'][data-ui-hydration]";
function dg(e = document) {
	let t = e.querySelector(ug)?.textContent?.trim() ?? "";
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
var fg = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(pg(mg(e)));
	}
	async dispatchAsync(e) {
		let t = mg(e), n = pg(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		try {
			return await this.transport.processEventAsync(t);
		} finally {
			this.pendingKeys.delete(n);
		}
	}
};
function pg(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function mg(e) {
	return {
		eventId: Nt(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var hg = class {
	values = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t));
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n) {
		let r = this.createKey(e, t), i = this.values.get(r);
		return this.values.has(r) && Vh(i, n) ? !1 : (this.values.set(r, n), !0);
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
		return `${g(e.componentId)}:${e.propertyId}:${gg(t)}`;
	}
};
function gg(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var _g = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, vg = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, H = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, yg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, bg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, xg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, Sg = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, Cg = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, wg = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Tg = class {
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
}, U;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(U ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var Eg = class {
	constructor() {}
	log(e, t) {}
};
Eg.instance = new Eg();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var Dg = "10.0.11", W = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, G = class e {
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
function Og(e, t) {
	let n = "";
	return Ag(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${kg(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function kg(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function Ag(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function jg(e, t, n, r, i, a) {
	let o = {}, [s, c] = Fg();
	o[s] = c, e.log(U.Trace, `(${t} transport) sending data. ${Og(i, a.logMessageContent)}.`);
	let l = Ag(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(U.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function Mg(e) {
	return e === void 0 ? new Pg(U.Information) : e === null ? Eg.instance : e.log === void 0 ? new Pg(e) : e;
}
var Ng = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, Pg = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${U[e]}: ${t}`;
			switch (e) {
				case U.Critical:
				case U.Error:
					this.out.error(n);
					break;
				case U.Warning:
					this.out.warn(n);
					break;
				case U.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function Fg() {
	let e = "X-SignalR-User-Agent";
	return G.isNode && (e = "User-Agent"), [e, Ig(Dg, Lg(), zg(), Rg())];
}
function Ig(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function Lg() {
	if (G.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function Rg() {
	if (G.isNode) return process.versions.node;
}
function zg() {
	return G.isNode ? "NodeJS" : "Browser";
}
function Bg(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function Vg() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var Hg = class extends Tg {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || G.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(Vg());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new H();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new H();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(U.Warning, "Timeout from HTTP request."), n = new vg();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, Ag(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(U.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new _g(await Ug(i, "text") || i.statusText, i.status);
		let a = await Ug(i, e.responseType);
		return new wg(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return G.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function Ug(e, t) {
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
var Wg = class extends Tg {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new H()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (Ag(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new H());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new wg(r.status, r.statusText, r.response || r.responseText)) : n(new _g(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(U.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new _g(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(U.Warning, "Timeout from HTTP request."), n(new vg());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, Gg = class extends Tg {
	constructor(e) {
		if (super(), typeof fetch < "u" || G.isNode) this._httpClient = new Hg(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new Wg(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new H()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, K = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
K.RecordSeparatorCode = 30, K.RecordSeparator = String.fromCharCode(K.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var Kg = class {
	writeHandshakeRequest(e) {
		return K.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (Ag(e)) {
			let r = new Uint8Array(e), i = r.indexOf(K.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(K.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = K.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var qg = class {
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
		return this.observers.push(e), new Ng(this, e);
	}
}, Jg = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			Ag(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new Yg(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, Ag(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, Yg = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, Xg = 3e4, Zg = 15e3, Qg = 1e5, J;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(J ||= {});
var $g = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(U.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, W.isRequired(e, "connection"), W.isRequired(t, "logger"), W.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? Xg, this.keepAliveIntervalInMilliseconds = a ?? Zg, this._statefulReconnectBufferSize = o ?? Qg, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new Kg(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = J.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: q.Ping });
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
		this._connectionState = J.Connecting, this._logger.log(U.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), G.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = J.Connected, this._connectionStarted = !0, this._logger.log(U.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = J.Disconnected, this._logger.log(U.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(U.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(U.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new Jg(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(U.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === J.Disconnected) return this._logger.log(U.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === J.Disconnecting) return this._logger.log(U.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = J.Disconnecting, this._logger.log(U.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(U.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === J.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new H("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new qg();
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
						this._logger.log(U.Error, `Invoke client method threw error: ${Bg(e)}`);
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
							this._logger.log(U.Error, `Stream callback threw error: ${Bg(e)}`);
						}
					}
					break;
				}
				case q.Ping: break;
				case q.Close: {
					this._logger.log(U.Information, "Close message received from server.");
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
				default: this._logger.log(U.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(U.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(U.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(U.Debug, "Server handshake complete."), this._handshakeResolver(), n;
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
			this._logger.log(U.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(U.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(U.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(U.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(U.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(U.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(U.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new H("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === J.Disconnecting ? this._completeClose(e) : this._connectionState === J.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === J.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = J.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), G.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(U.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(U.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = J.Reconnecting, e ? this._logger.log(U.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(U.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(U.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== J.Reconnecting) {
				this._logger.log(U.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(U.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== J.Reconnecting) {
				this._logger.log(U.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = J.Connected, this._logger.log(U.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(U.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(U.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== J.Reconnecting) {
					this._logger.log(U.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === J.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(U.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(U.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(U.Error, `Stream 'error' callback called with '${e}' threw error: ${Bg(t)}`);
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
}, e_ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], t_ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? e_ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, n_ = class {};
n_.Authorization = "Authorization", n_.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var r_ = class extends Tg {
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
		e.headers ||= {}, this._accessToken ? e.headers[n_.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[n_.Authorization] && delete e.headers[n_.Authorization];
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
var i_ = class {
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
}, a_ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new i_(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (W.isRequired(e, "url"), W.isRequired(t, "transferFormat"), W.isIn(t, X, "transferFormat"), this._url = e, this._logger.log(U.Trace, "(LongPolling transport) Connecting."), t === X.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = Fg(), i = {
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
		this._logger.log(U.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(U.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new _g(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(U.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(U.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(U.Trace, `(LongPolling transport) data received. ${Og(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(U.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(U.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new _g(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof vg ? this._logger.log(U.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(U.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(U.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? jg(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(U.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(U.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = Fg();
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
			i ? i instanceof _g && (i.statusCode === 404 ? this._logger.log(U.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(U.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(U.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(U.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(U.Trace, e), this.onclose(this._closeError);
		}
	}
}, o_ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return W.isRequired(e, "url"), W.isRequired(t, "transferFormat"), W.isIn(t, X, "transferFormat"), this._logger.log(U.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== X.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (G.isBrowser || G.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = Fg();
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
						this._logger.log(U.Trace, `(SSE transport) data received. ${Og(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(U.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? jg(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, s_ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		W.isRequired(e, "url"), W.isRequired(t, "transferFormat"), W.isIn(t, X, "transferFormat"), this._logger.log(U.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (G.isNode || G.isReactNative) {
				let t = {}, [r, i] = Fg();
				t[r] = i, n && (t[n_.Authorization] = `Bearer ${n}`), o && (t[n_.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === X.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(U.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(U.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(U.Trace, `(WebSockets transport) data received. ${Og(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(U.Trace, `(WebSockets transport) sending data. ${Og(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(U.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, c_ = 100, l_ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, W.isRequired(t, "url"), this._logger = Mg(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (G.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!G.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : G.isNode && !n.WebSocket && r && (n.WebSocket = r), !G.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : G.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new r_(n.httpClient || new Gg(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= X.Binary, W.isIn(e, X, "transferFormat"), this._logger.log(U.Debug, `Starting connection with transfer format '${X[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(U.Error, e), await this._stopPromise, Promise.reject(new H(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(U.Error, e), Promise.reject(new H(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new d_(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(U.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(U.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(U.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(U.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new H("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < c_);
				if (r === c_ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof a_ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(U.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(U.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = Fg();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(U.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new Sg("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof _g && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(U.Error, t), Promise.reject(new Sg(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(U.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(U.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new xg(`${n.transport} failed: ${e}`, Y[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(U.Debug, e), Promise.reject(new H(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new Cg(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Y.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new s_(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Y.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new o_(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Y.LongPolling: return new a_(this._httpClient, this._logger, this._options);
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
		if (i == null) return this._logger.log(U.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (u_(t, i)) {
			if (e.transferFormats.map((e) => X[e]).indexOf(n) >= 0) {
				if (i === Y.WebSockets && !this._options.WebSocket || i === Y.ServerSentEvents && !this._options.EventSource) return this._logger.log(U.Debug, `Skipping transport '${Y[i]}' because it is not supported in your environment.'`), new yg(`'${Y[i]}' is not supported in your environment.`, i);
				this._logger.log(U.Debug, `Selecting transport '${Y[i]}'.`);
				try {
					return this.features.reconnect = i === Y.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(U.Debug, `Skipping transport '${Y[i]}' because it does not support the requested transfer format '${X[n]}'.`), /* @__PURE__ */ Error(`'${Y[i]}' does not support ${X[n]}.`);
		}
		return this._logger.log(U.Debug, `Skipping transport '${Y[i]}' because it was disabled by the client.`), new bg(`'${Y[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(U.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(U.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(U.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(U.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(U.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(U.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(U.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!G.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(U.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function u_(e, t) {
	return !e || (t & e) !== 0;
}
var d_ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new f_(), this._transportResult = new f_(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new f_(), this._transportResult.promise;
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
			this._sendBufferedData = new f_();
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
}, f_ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, p_ = "json", m_ = class {
	constructor() {
		this.name = p_, this.version = 2, this.transferFormat = X.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = Eg.instance);
		let n = K.parse(e), r = [];
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
					t.log(U.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return K.write(JSON.stringify(e));
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
}, h_ = {
	trace: U.Trace,
	debug: U.Debug,
	info: U.Information,
	information: U.Information,
	warn: U.Warning,
	warning: U.Warning,
	error: U.Error,
	critical: U.Critical,
	none: U.None
};
function g_(e) {
	let t = h_[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var __ = class {
	configureLogging(e) {
		if (W.isRequired(e, "logging"), v_(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = g_(e);
			this.logger = new Pg(t);
		} else this.logger = new Pg(e);
		return this;
	}
	withUrl(e, t) {
		return W.isRequired(e, "url"), W.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return W.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new t_(e) : e : new t_(), this;
	}
	withServerTimeout(e) {
		return W.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return W.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new l_(this.url, e);
		return $g.create(t, this.logger || Eg.instance, this.protocol || new m_(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function v_(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/signalr-transport.ts
var y_ = class {
	windowId;
	connection;
	started = !1;
	currentState = "Disconnected";
	attached;
	markAttached = () => {};
	constructor(e, t = {}) {
		this.windowId = e, this.attached = this.createAttachGate(), this.connection = new __().withUrl(t.hubUrl ?? "/_ui/hub").withAutomaticReconnect([...t.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(U.Warning).build();
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
		return await this.attached, await this.invokeCoreAsync(e, ...t);
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
}, b_ = class {
	transport;
	constructor(e) {
		this.transport = e;
	}
	async dispatchAsync(e) {
		return await this.transport.processChangeSetAsync({ updates: [e] });
	}
}, x_ = "data-ui-theme", S_ = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Dt(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Dt(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = N_(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = jt(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute(x_) !== n && document.documentElement.setAttribute(x_, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = w_(e);
			t !== null && D_(t);
		}), this.register("ScrollTo", (e) => {
			let t = w_(e);
			if (t === null) return;
			let n = e.effect, r = Ot(n.behavior), i = kt(n.block);
			t.scrollIntoView({
				behavior: r === "Smooth" ? "smooth" : "auto",
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = w_(e);
			if (t === null) return;
			let n = e.effect, r = Mt(n.axis) !== "Horizontal", i = T_(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = At(n.position), u;
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
			let d = Ot(n.behavior) === "Smooth" ? "smooth" : "auto";
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			C_(w_(e), null);
		}), this.register("Hide", (e) => {
			C_(w_(e), "hidden");
		}), this.register("Collapse", (e) => {
			C_(w_(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = O_(e, this.valueReaders);
			t !== null && j_(t).catch((e) => s("copy to clipboard failed.", e));
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
function C_(e, t) {
	if (e !== null) for (let n of at) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function w_(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(g(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function T_(e, t) {
	if (E_(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (E_(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (E_(n, t)) return n;
	return null;
}
function E_(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function D_(e) {
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
function O_(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = w_(e);
	if (r === null) return null;
	if (t === void 0) return s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null;
	let i = A_(r);
	return i === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Xt(t.read(i));
}
var k_ = "input, textarea, select";
function A_(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(k_) ? e : e.querySelector(`[${be}], ${k_}`);
}
async function j_(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!M_(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function M_(e) {
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
function N_(e) {
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
var P_ = [
	"http",
	"https",
	"mailto",
	"tel"
];
function F_(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) if (e <= " " || e === "") return !1;
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || P_.includes(t.slice(0, n).toLowerCase());
}
function I_(e) {
	return F_(e) ? String(e) : void 0;
}
function L_(e) {
	let t = String(e ?? "").trim();
	return pp(t) ? t : void 0;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var R_ = /* @__PURE__ */ new Map([
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
]), z_ = [
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
function B_(e) {
	return Z(e, z_);
}
var V_ = [
	"small",
	"medium",
	"large"
], H_ = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], U_ = [
	"start",
	"center",
	"end",
	"justify"
], W_ = [
	"nowrap",
	"wrap",
	"wrap-ellipsis"
], G_ = /* @__PURE__ */ new Map([
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
]), K_ = ["inline", "trailing"], q_ = [
	"filled",
	"outline",
	"underline",
	"ghost"
], J_ = [
	"small",
	"medium",
	"large"
], Y_ = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], X_ = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], Z_ = ["light", "dark"], Q_ = [
	"start",
	"center",
	"end",
	"stretch"
], $_ = ["clip", "visible"], ev = [
	"visible",
	"hidden",
	"collapsed"
], tv = [
	"background",
	"raised",
	"tinted"
], nv = ["horizontal", "vertical"], rv = [
	"none",
	"gap",
	"rule"
], iv = [
	"none",
	"one",
	"many"
], av = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], ov = ["stack", "wrap"], sv = [
	"disabled",
	"auto",
	"always"
], cv = [
	"disabled",
	"proximity",
	"mandatory"
], lv = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], uv = ["hex", "rgb"], dv = ["field", "swatch"], fv = [
	"fill",
	"contain",
	"cover",
	"none"
], pv = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], mv = ["linear", "circular"], hv = ["keep", "replace"], gv = [
	"none",
	"vertical",
	"horizontal",
	"both"
], _v = [
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
], vv = [
	"None",
	"Shade",
	"Tint"
], yv = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Z(e, z_)}`],
	["themeColorClass", (e) => Iv(e)],
	["iconClass", (e) => Kv(e)],
	["iconUrlCss", (e) => mp(e)],
	["safeUrl", (e) => I_(e)],
	["safeImageSource", (e) => L_(e)],
	["iconSizeClass", (e) => `ui-icon-size--${Z(e, V_)}`],
	["textTypeClass", (e) => `ui-text-type--${Z(e, H_)}`],
	["textAppearanceClass", (e) => Rv(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Z(e, U_)}`],
	["textWrapClass", (e) => `ui-text--${Z(e, W_)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Z(e, K_)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Z(e, X_)}`],
	["badgeTextFit", (e) => Lv(e)],
	["buttonClass", (e) => `ui-button--${Z(e, Y_)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Z(e, tv)}`],
	["orientationClass", (e) => `ui-orientation--${Z(e, nv)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Z(e, rv)}`],
	["selectionModeAttribute", (e) => Z(e, iv)],
	["selectionBackgroundCss", (e) => Pv(jv(e, "background"))],
	["selectionForegroundCss", (e) => Pv(jv(e, "foreground"))],
	["selectionMarkColorCss", (e) => Pv(jv(e, "markColor"))],
	["selectionMarkCss", (e) => Nv(jv(e, "mark"))],
	["selectionFontWeightCss", (e) => Mv(jv(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Z(e, ov)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Z(e, sv)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Z(e, sv)}`],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Z(e, cv)}`],
	["inputAppearanceClass", (e) => `ui-input--${Z(e, q_)}`],
	["buttonSizeClass", (e) => `ui-button--${Z(e, J_)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Z(e, J_)}`],
	["textInputTypeAttribute", (e) => Z(e, lv)],
	["colorTextFormatAttribute", (e) => Z(e, uv)],
	["colorInputVariantAttribute", (e) => Z(e, dv)],
	["themeNameCss", (e) => Z(e, Z_)],
	["alignmentCss", (e) => Z(e, Q_)],
	["alignmentStretchFallbackCss", (e) => Z(e, Q_) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Z(e, $_)],
	["layoutLengthCss", (e) => Tv(e)],
	["thicknessCss", (e) => Ev(e)],
	["radiusCss", (e) => Dv(e)],
	["gridUnitCss", (e) => Ov(e)],
	["pixelsCss", (e) => $(e)],
	["gridTemplateCss", (e) => kv(e)],
	["colorVariantCss", (e) => Hv(e)],
	["themeColorCss", (e) => Pv(e)],
	["themeColorInlineCss", (e) => Fv(e) ? "" : Pv(e)],
	["themeColorCanonical", (e) => Bv(e)],
	["textAppearanceFontSizeCss", (e) => zv(e, "size")],
	["textAppearanceFontWeightCss", (e) => zv(e, "weight")],
	["textAppearanceLineHeightCss", (e) => zv(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => zv(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => Tv(j(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => Tv(j(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => Tv(j(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => Tv(j(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => Tv(j(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => Ev(j(e, "base"))],
	["responsiveThicknessSmCss", (e) => Ev(j(e, "sm"))],
	["responsiveThicknessMdCss", (e) => Ev(j(e, "md"))],
	["responsiveThicknessXlCss", (e) => Ev(j(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => Ev(j(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => Jv(j(e, "base"))],
	["responsivePixelsSmCss", (e) => Jv(j(e, "sm"))],
	["responsivePixelsMdCss", (e) => Jv(j(e, "md"))],
	["responsivePixelsXlCss", (e) => Jv(j(e, "xl"))],
	["responsivePixelsXxlCss", (e) => Jv(j(e, "xxl"))],
	["visibilityBaseAttribute", (e) => Yv(e, "base")],
	["visibilitySmAttribute", (e) => Yv(e, "sm")],
	["visibilityMdAttribute", (e) => Yv(e, "md")],
	["visibilityXlAttribute", (e) => Yv(e, "xl")],
	["visibilityXxlAttribute", (e) => Yv(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Z(e, fv)}`],
	["backgroundImageCss", (e) => bv(e)],
	["imageFitSizeCss", (e) => Z(e, pv)],
	["progressVariantClass", (e) => `ui-progress--${Z(e, mv)}`],
	["progressValueText", (e) => qv(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Z(e, hv)}`],
	["textAreaResizeCss", (e) => Z(e, gv)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Z(e, _v)}`],
	["popupPlacementAttribute", (e) => Z(e, _v)]
]);
function bv(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : hp(t);
}
var xv = [
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
], Sv = new Map(xv.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), Cv = new Map(xv.map(([e, t]) => [e, t])), wv = /* @__PURE__ */ new Map([[$_, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Z(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : wv.get(t)?.get(e)) ?? R_.get(e) ?? lt(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function Tv(e) {
	if (e == null) return "";
	if (typeof e == "number") return $(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? $(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function Ev(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function Dv(e) {
	if (e == null) return "";
	if (typeof e == "number") return $(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? $(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function Ov(e) {
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
function kv(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return Ov(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return Ov(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${Ov(e[0])})` : e.map((e) => Ov(e)).join(" ");
}
function Q(e, t, n) {
	return Av(j(e, t), n);
}
function Av(e, t) {
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
function jv(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function Mv(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function Nv(e) {
	if (e == null) return "";
	switch (Z(e, av)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function Pv(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Vv(e)) return Hv(e);
	let t = e, n = Hv(t.light), r = Hv(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = G_.get(Z(o, z_));
	return s ? `var(${s})` : "";
}
function Fv(e) {
	if (typeof e != "object" || !e || Vv(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function Iv(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Z(n, z_)}`;
}
function Lv(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function Rv(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Z(n, H_)}`;
}
function zv(e, t) {
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
function Bv(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Uv(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Zv(r.rgb >> 16 & 255)}${Zv(r.rgb >> 8 & 255)}${Zv(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Zv(e)}`;
	}
	let i = Wv(r.name);
	return i === null ? "" : `${i}/${Gv(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Vv(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Hv(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Wv(t.name), i = n ?? (r === null ? void 0 : Sv.get(r));
	if (!i) return "";
	let a = Gv(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = Xv(c * (1 - o)), l = Xv(l * (1 - o)), u = Xv(u * (1 - o))) : a === "Tint" && (c = Xv(c + (255 - c) * o), l = Xv(l + (255 - l) * o), u = Xv(u + (255 - u) * o)), `#${Zv(c)}${Zv(l)}${Zv(u)}${Zv(s)}`;
}
function Uv(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = z_[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Wv(e) {
	if (typeof e == "number") return Cv.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Gv(e) {
	if (typeof e == "number") return vv[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Kv(e) {
	let t = fp(e);
	return t === null ? _p(e) : t.tinted ? "" : dp;
}
function qv(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function $(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Jv(e) {
	return e == null ? "" : $(e);
}
function Yv(e, t) {
	let n = $c(e, t);
	if (n == null) return;
	let r = Z(n, ev);
	return r === "visible" ? void 0 : r;
}
function Xv(e) {
	return Math.min(255, Math.max(0, Math.round(e)));
}
function Zv(e) {
	return Xv(e).toString(16).padStart(2, "0").toUpperCase();
}
//#endregion
//#region src/interactions/notification-engine.ts
var Qv = "ui-notification-host", $v = "ui-notification", ey = "ui-notification--leaving", ty = "ui-notification__message", ny = "ui-notification__close", ry = 5e3, iy = 160, ay = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), oy = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? ry;
	}
	show(e) {
		let t = B_(e.severity), n = document.createElement("div");
		n.className = ay.has(t) ? `${$v} ${$v}--${t}` : $v, n.setAttribute("role", t === "danger" ? "alert" : "status"), n.setAttribute("aria-live", t === "danger" ? "assertive" : "polite");
		let r = document.createElement("span");
		r.className = ty, r.textContent = e.message;
		let i = document.createElement("button");
		i.type = "button", i.className = ny, i.setAttribute("aria-label", v.text("ui.notification.close")), i.textContent = "×", i.addEventListener("click", () => this.dismiss(n)), n.append(r, i), this.ensureHost().append(n);
		let a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		return n.addEventListener("mouseenter", () => window.clearTimeout(a)), n.addEventListener("mouseleave", () => {
			a = window.setTimeout(() => this.dismiss(n), this.durationMs);
		}), n;
	}
	dismiss(e) {
		!e.isConnected || e.classList.contains(ey) || (e.classList.add(ey), window.setTimeout(() => {
			e.remove(), this.host !== null && this.host.childElementCount === 0 && (this.host.remove(), this.host = null);
		}, iy));
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${Qv}`);
		if (t !== null) return this.host = t, t;
		let n = document.createElement("div");
		return n.className = Qv, e.append(n), this.host = n, n;
	}
}, sy = class {
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
}, cy = class {
	watchers = /* @__PURE__ */ new Map();
	constructor(e) {
		e.addValueChangeHandler((e) => this.notify(e));
	}
	watch(e, t) {
		let n = ly(g(e.componentId), e.propertyId), r = this.watchers.get(n);
		return r === void 0 && (r = /* @__PURE__ */ new Set(), this.watchers.set(n, r)), r.add(t), () => {
			r?.delete(t);
		};
	}
	notify(e) {
		let t = ly(g(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function ly(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/updates/collection-sinks.ts
var uy = class {
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
function dy(e, t, n, r) {
	return {
		action: wt(e.action),
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
var fy = class {
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
			let t = Kt(e);
			if (t !== null) for (let n of this.metadata.getItemValues(t)) this.registerItemValue(e, n.key, n.item);
		}
		for (let t of e?.updates ?? []) {
			if (Et(t) !== "CollectionChange") continue;
			let e = t;
			if (wt(e.action) !== "Insert") continue;
			let n = this.findItemsHost(g(e.component?.id), e.component?.dynamicParameters ?? []);
			if (n !== null) for (let t of e.items ?? []) this.registerItemValue(n, t.key, t.item);
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = vy(e, t);
		r !== null && this.itemsRenderer.registerItemScope(r, _y(r), n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${pe}]`)) {
			let t = Kt(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		lh(e, t, {
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
			let n = t[e], r = hy(n, t[e + 1]);
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
		if (Ym(t) === "virtualized") {
			this.virtualization.refill(t, e.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			}))), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(t), r = /* @__PURE__ */ new Map();
		for (let e of V(t)) {
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
			if (r.delete(a), o !== null && Vh(this.readItemValue(o), t.item)) {
				i.push(o);
				continue;
			}
			let c = this.renderItemElement(e.componentId, t.item, a, n);
			o?.remove(), c !== null && i.push(c);
		}
		for (let e of r.values()) e.remove();
		gy(t, i), this.syncItemsHost(t, e.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (Et(e)) {
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
		let t = g(e.address?.component?.id), n = Tt(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, dy(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		let a = this.findItemsHost(t, n);
		if (a === null) {
			(wt(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		if (Ym(a) === "virtualized") {
			this.applyVirtualizedCollectionChange(a, e), this.syncItemsHost(a, t), this.dom.invalidate();
			return;
		}
		switch (wt(e.action)) {
			case "Insert":
				this.applyCollectionInsert(a, t, e.items ?? []);
				break;
			case "Remove":
				py(a, e.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(a, t, e.items ?? []);
				break;
			case "Move":
				my(a, e.moves ?? []);
				break;
			case "Reset":
				a.replaceChildren(), ih(a);
				break;
			default:
				s("collection update action is not supported.", e);
				return;
		}
		this.syncItemsHost(a, t), this.dom.invalidate();
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (wt(t.action)) {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = Qm(e, V(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, eh(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return Yh(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Qm(e, V(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", a);
				continue;
			}
			let o = vy(e, a.oldKey ?? n), c = this.renderItemElement(t, a.item, n, r);
			c !== null && (o === null ? e.insertBefore(c, eh(i, c, a.index ?? null)) : (rh(i, o, c), o.replaceWith(c)));
		}
	}
};
function py(e, t) {
	let n = Qm(e, V(e)), r = e.parentElement, i = r === null ? [] : V(e).filter((e) => e instanceof HTMLElement);
	for (let a of t) {
		let t = a.key === null || a.key === void 0 ? null : vy(e, a.key);
		if (t === null) {
			s("collection remove did not resolve an item.", a);
			continue;
		}
		let o = r !== null && t instanceof HTMLElement ? Hd(r, i, t) : null;
		th(n, t), t.remove(), i = i.filter((e) => e !== t), o?.();
	}
}
function my(e, t) {
	let n = Qm(e, V(e));
	for (let r of t) {
		let t = r.key === null || r.key === void 0 ? null : vy(e, r.key);
		if (t === null) {
			s("collection move did not resolve an item.", r);
			continue;
		}
		e.insertBefore(t, nh(n, t, r.newIndex ?? null));
	}
}
function hy(e, t) {
	if (t === void 0 || Et(e) !== "CollectionChange" || Et(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (wt(n.action) !== "Reset" || wt(r.action) !== "Insert") return null;
	let i = g(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== g(r.component?.id) || !Vh(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function gy(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? V(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function _y(e) {
	let t = Gt(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : Gt(n);
}
function vy(e, t) {
	return e.querySelector(`:scope > [${m}="${ct(t)}"]`);
}
//#endregion
//#region src/interactions/validation-engine.ts
var yy = "ui-invalid", by = "ui-validation--warning", xy = "ui-validation--info", Sy = "data-ui-validation-message", Cy = "--ui-validation-color", wy = "Validation", Ty = {
	Error: 0,
	Warning: 1,
	Info: 2
}, Ey = {
	Error: yy,
	Warning: by,
	Info: xy
}, Dy = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, Oy = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0);
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === wy) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = g(e.reference.componentId), n = ky(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = g(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => bt(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = g(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: Ay(e.severity)
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	applyCurrentState(e, t) {
		jy(t, this.resolveDisplay(e, t));
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i);
		let a = this.failingRulesByElement.get(t);
		if (a !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) a.has(t) && n.push({
			message: t.message,
			severity: Ay(t.severity)
		});
		let o;
		for (let e of n) (o === void 0 || Ty[e.severity] < Ty[o.severity]) && (o = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => bt(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${Oe}="${ct(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => bt(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && Ay(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) xn(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function ky(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.message == "string" ? t.message : "";
	return n.length === 0 ? void 0 : {
		message: n,
		severity: Ay(t.severity)
	};
}
function Ay(e) {
	let t = xt(e);
	return t === "Unknown" ? "Error" : t;
}
function jy(e, t) {
	for (let n of Object.values(Ey)) e.classList.toggle(n, t !== void 0 && Ey[t.severity] === n);
	let n = e;
	t === void 0 ? n.style.removeProperty(Cy) : n.style.setProperty(Cy, `var(--ui-color-${Dy[t.severity]})`);
	let r = e.querySelector(`[${Sy}]`);
	r !== null && (r.textContent = t?.message ?? "");
}
//#endregion
//#region src/items/row-decorators.ts
var My = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, Ny = /* @__PURE__ */ new WeakMap(), Py = /* @__PURE__ */ new WeakMap(), Fy = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(St(e), t);
	}
	apply(e) {
		let t = St(e.operation.kind), n = this.handlers.get(t);
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
			Op(e.target, y(e.convertedValue) ? "" : Xt(e.convertedValue));
		}), this.register("Attribute", (e) => {
			let t = Hy(e.operation);
			if (y(e.value) || y(e.convertedValue)) {
				Vy(e.target, t);
				return;
			}
			By(e.target, t, Xt(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			Vy(e.target, Hy(e.operation));
		}), this.register("ToggleAttribute", (e) => {
			let t = Hy(e.operation), n = !y(e.value) && Iy(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (y(e.convertedValue) ? "" : Xt(e.convertedValue));
			Ly(e.target, zy(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !y(e.value) && Iy(e.value, e.operation.condition ?? "None") ? Xt(e.convertedValue).trim() : "";
			Ry(e.target, zy(e), t);
		}), this.register("ToggleClass", (e) => {
			let t = Hy(e.operation), n = !y(e.value) && Iy(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Xt(e.convertedValue).trim() : "";
				Ry(e.target, zy(e), t);
			}
		}), this.register("Style", (e) => {
			let t = Hy(e.operation), n = e.target;
			if (y(e.value) || y(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Xt(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = Hy(e.operation), n = e.target;
			n[t] !== e.convertedValue && (n[t] = e.convertedValue);
		});
	}
};
function Iy(e, t) {
	switch (Ct(t)) {
		case "None": return !0;
		case "HasValue": return !y(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !y(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		default: return !y(e);
	}
}
function Ly(e, t, n, r, i) {
	let a = Py.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), Py.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), By(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && Vy(e, n);
}
function Ry(e, t, n) {
	let r = Ny.get(e);
	r === void 0 && (r = /* @__PURE__ */ new Map(), Ny.set(e, r));
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
function zy(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function By(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Vy(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function Hy(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var Uy = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => yv.has(e.name),
			convert: (e) => yv.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = Wy(e.name), n = {
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
function Wy(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var Gy = class {
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
function Ky(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function qy(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => Ky(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => Ky(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var Jy = class {
	converters = new Uy();
	events = new Gy();
	operations = new Fy();
	valueReaders;
	collectionSinks = new uy();
	rowDecorators = new My();
	constructor(e, t, n, r) {
		qy(this.events), this.valueReaders = new Qt(r);
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
}, Yy = "Submenu", Xy = "ui-menu__submenu", Zy = "Select", Qy = {
	kind: "menu",
	decorate: $y
};
function $y(e) {
	if (!eb(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, Yy);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(je, ""), tb(e.item, "Kind") === Zy && e.row.setAttribute(Me, ""), tb(e.item, "Expanded") === !0 && e.row.setAttribute(Ne, "");
	let r = document.createElement("div");
	r.className = Xy, r.appendChild(n), ph(r, e.key, e.item), e.row.appendChild(r);
}
function eb(e) {
	let t = tb(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function tb(e, t) {
	let n = Dm(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/interactions/element-size.ts
function nb(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/rendering/number-format.ts
var rb = {
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
}, ib = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], ab = [
	"$n",
	"n$",
	"$ n",
	"n $"
], ob = [
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
], sb = [
	"n %",
	"n%",
	"%n",
	"% n"
], cb = [
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
function lb(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return rb;
	try {
		return {
			...rb,
			...JSON.parse(t)
		};
	} catch {
		return rb;
	}
}
function ub(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = db(t);
	if (r === null) return fb(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = pb(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? gb(ib[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = pb(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(mb(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = pb(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return gb(i ? ob[n.currencyNegativePattern] ?? "-$n" : ab[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = pb(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return gb(i ? cb[n.percentNegativePattern] ?? "-n %" : sb[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return fb(e, n);
	}
}
function db(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function fb(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function pb(e, t, n, r, i) {
	let a = String(mb(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? hb(o, n, r) : `${hb(o, n, r)}${i}${s}`;
}
function mb(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function hb(e, t, n) {
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
function gb(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var _b = {
	readCulture: lb,
	format: ub
}, vb = "ne.standard.ui.windowId", yb = [
	({ root: e }) => new Lr({ root: e }),
	({ root: e }) => new ei({ root: e }),
	({ root: e, dom: t, propertyPatchEngine: n }) => new gi({
		root: e,
		dom: t,
		propertyPatchEngine: n
	}),
	({ root: e }) => new _i({ root: e }),
	({ root: e }) => new bi({ root: e }),
	({ root: e }) => new Mi({ root: e }),
	({ root: e }) => new ba({ root: e }),
	({ root: e }) => new qi({ root: e }),
	({ root: e }) => new Ta({ root: e }),
	({ root: e }) => new Bh({ root: e }),
	({ root: e, propertyPatchEngine: t, dom: n }) => new Ia({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new Ja({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new $u({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new is({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e, effects: t, dom: n }) => new Hs({
		root: e,
		effects: t,
		dom: n
	}),
	({ root: e, propertyPatchEngine: t, dom: n }) => new Lf({
		root: e,
		propertyPatchEngine: t,
		dom: n
	}),
	({ root: e }) => new Js({ root: e }),
	({ root: e }) => new Hl({ root: e }),
	({ root: e }) => new Xl({ root: e }),
	({ root: e }) => new xc({ root: e }),
	({ root: e }) => new Kc({ root: e }),
	({ root: e }) => new zc({ root: e }),
	({ root: e }) => new El({ root: e }),
	({ root: e }) => new kd({ root: e }),
	({ root: e }) => new eu({ root: e }),
	({ root: e }) => new vu({ root: e }),
	({ root: e, effects: t }) => new xf({
		root: e,
		effects: t
	}),
	({ root: e, effects: t }) => new nf({
		root: e,
		effects: t
	}),
	({ root: e }) => new wu({ root: e }),
	({ root: e }) => new tp({ root: e }),
	({ root: e }) => new br({ root: e }),
	({ root: e }) => new Df({ root: e }),
	({ root: e }) => dm(e),
	({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new lp({ root: e }) : void 0
], bb = class {
	windowId;
	options;
	root;
	metadata = new pt(cg());
	hydration = dg();
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
		this.options = e, this.root = e.root ?? document, this.windowId = Sb(e.windowIdStorageKey ?? vb), this.dom = new Wt(this.root), v.load(this.root), e.strings !== void 0 && v.register(e.strings), this.extensions = new Jy(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(Qy);
		let t = new Lt(this.dom, this.metadata), n = this.extensions.operations, r = new hg(), i = new sy(t, n, this.extensions, r);
		this.reactiveSources = new cy(i), this.dialogs = new nc({ root: this.root }), this.notifications = new oy({ root: this.root }), this.effects = new S_({
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
		}), d = new og(this.dom), f = new uh(this.metadata, d, this.extensions, n, r);
		this.virtualization = new Qh({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new fy(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), new yh({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			valueReaders: this.extensions.valueReaders,
			virtualization: this.virtualization
		}), this.transport = new y_(this.windowId, e.signalR), this.dispatcher = new fg(this.transport);
		let p = new b_(this.transport);
		o = new dn({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			applyChanges: (e) => this.applyChanges(e),
			valueReaders: this.extensions.valueReaders
		});
		let ee = new Oy({
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
		for (let e of yb) e(this.engineContext);
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
		this.windows = new Dh({
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
		if (Eb() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), Db(e), window.location.reload();
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
		v.register(e);
	}
	addEngine(e) {
		e({
			...this.engineContext,
			strings: v,
			observeComponents: x,
			observeSize: nb,
			dialogs: this.dialogs,
			store: new Ec(),
			numbers: _b
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
			parameters: wb(window.location.search)
		});
		if (e.reload === !0) {
			this.reloadForView(this.hydration?.view ?? "");
			return;
		}
		Ob(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(e.initialChanges), this.applyChanges(e.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), l("runtime attached.", {
			windowId: this.windowId,
			instanceId: this.instanceId
		});
	}
};
async function xb(e = {}) {
	let t = new bb(e);
	return await t.startAsync(), t;
}
function Sb(e) {
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
	let n = Cb();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function Cb() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function wb(e) {
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
var Tb = "ne-standard-ui:reloaded-view";
function Eb() {
	try {
		return sessionStorage.getItem(Tb);
	} catch {
		return null;
	}
}
function Db(e) {
	try {
		sessionStorage.setItem(Tb, e);
	} catch {}
}
function Ob() {
	try {
		sessionStorage.removeItem(Tb);
	} catch {}
}
t(), xb().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
