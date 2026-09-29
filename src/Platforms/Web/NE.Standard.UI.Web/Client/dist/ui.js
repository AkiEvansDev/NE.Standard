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
var ne = 2;
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
var ce = "data-ui-id", le = "data-ui-context", ue = "data-ui-pc", m = "data-ui-key", de = "data-ui-unselectable", fe = "data-ui-undraggable", pe = "data-ui-unremovable", me = "data-ui-unrenamable", he = "data-ui-no-context-menu", ge = "data-ui-no-row-open", _e = "data-ui-tabs-draggable", ve = "data-ui-tabs-menu", ye = "data-ui-context-menu", be = "data-ui-context-menu-use", xe = "data-ui-row-focus", Se = "data-ui-tooltip", Ce = "data-ui-tooltip-placement", we = "data-ui-tooltip-mark", Te = "data-ui-name", Ee = "data-ui-bind-", De = "data-ui-into-", Oe = "data-ui-bind-value", ke = (e) => `data-ui-no-${e}`, Ae = "data-ui-event-boundary", je = "data-ui-image-caption", h = "data-ui-items-host", Me = "data-ui-collection-sink", Ne = "data-ui-items-query", Pe = "data-ui-empty-template", Fe = "data-ui-group-template", Ie = "data-ui-empty-placeholder", Le = "data-ui-group-header", Re = "data-ui-group", ze = "data-ui-value-holder", Be = "data-ui-value-kind", Ve = "items-query", He = "data-ui-host-mode", Ue = "data-ui-host-viewport", We = "data-ui-scroll-group", Ge = "data-ui-scroll-lines", Ke = "data-ui-source-line", qe = "data-ui-window-spacer", Je = "data-ui-window-size", Ye = "data-ui-window-offset", Xe = "data-ui-window-total", Ze = "data-ui-window-more-before", Qe = "data-ui-window-more-after", $e = "data-ui-window-aggregates", et = "data-ui-form-id", tt = "data-ui-visibility", nt = "data-ui-collapsed", rt = "data-ui-menu-group", it = "data-ui-menu-select", at = "data-ui-menu-open", ot = "data-ui-menu-search", st = "data-ui-menu-searching", ct = "data-ui-menu-unmatched", lt = "data-ui-drawer-toggle", ut = "data-ui-drawer-open", dt = "data-ui-region", ft = "data-ui-menu-item-kind", g = "ui-menu-item", pt = "ui-menu-item--checked", mt = `[${ft}="header"], [${ft}="separator"]`, ht = `[${rt}] > .${g}`, gt = `${ht}, .${g}[${ft}="check"]`, _t = "data-ui-collapse-toggle", vt = "data-ui-folding", yt = "data-ui-column-limits", bt = "data-ui-row-limits", xt = "data-ui-splitter-step", St = "data-ui-table-column", Ct = "data-ui-table-hide-below", wt = "data-ui-table-hidden", Tt = "ui-table__row", Et = "ui-table__scroll", Dt = "ui-table__header", Ot = "ui-table__resizer", kt = "data-ui-table-last", At = "data-ui-table-reordering", jt = "data-ui-table-dragging", Mt = "data-ui-table-drop", Nt = "data-ui-table-scrolled", Pt = "data-ui-table-scrollbar", Ft = "data-ui-no-row-select", It = "data-ui-tree-parent", Lt = "data-ui-tree-children", Rt = "data-ui-tree-expanded", zt = "data-ui-tree-title", Bt = "data-ui-tree-loading", Vt = "data-ui-tree-drop-target", Ht = "data-ui-tree-boot", Ut = "data-ui-tree-draggable", Wt = "data-ui-row-editing", Gt = "data-ui-image-source", Kt = "data-ui-file-max-size", qt = "data-ui-file-pick", Jt = "data-ui-theme", Yt = "data-ui-words", Xt = "data-ui-language-switcher", Zt = "data-ui-language", Qt = "data-ui-splitting", $t = "data-ui-pointer-focus", en = "data-ui-selection", tn = "data-ui-selected", nn = "data-ui-selected-key", rn = "data-ui-selected-keys", an = "data-ui-bind-selected-key", on = "data-ui-tabs-selected", sn = "data-ui-tab-order", cn = "data-ui-tab-caption", ln = "data-ui-tab-pinned", un = [
	tt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], dn = "data-ui-submit-form-id", _ = `[${ce}]`, fn = "data-ui-href", pn = "ui-disabled", mn = "ui-loading", hn = "ui-readonly", gn = "ui-hidden", _n = "ui-dialog__surface", vn = "ui-flyout__content", yn = "data-ui-focus-holder", bn = "[role='listbox'], [role='menu'], [role='dialog']", xn = "ui-select__trigger", Sn = `.${xn}`, Cn = "ui-button", wn = "ui-select", Tn = "ui-text-input", En = "ui-invalid", Dn = {
	componentId: ce,
	key: m,
	selected: tn,
	selectedKey: nn,
	selectedKeys: rn,
	unselectable: de,
	rowFocus: xe,
	itemsHost: h,
	valueHolder: ze,
	bindValue: Oe,
	noRowOpen: ge,
	eventBoundary: Ae,
	focusHolder: yn,
	tooltip: Se,
	tooltipPlacement: Ce,
	contextMenu: ye,
	contextMenuUse: be,
	disabledClass: pn,
	loadingClass: mn,
	readOnlyClass: hn,
	hiddenClass: gn,
	buttonClass: Cn,
	selectClass: wn,
	textInputClass: Tn,
	invalidClass: En,
	sourceLine: Ke,
	popupSelector: bn,
	listTriggerSelector: Sn,
	tableRowClass: Tt,
	tableScrollClass: Et,
	tableHeaderClass: Dt,
	tableResizerClass: Ot,
	tableHidden: wt,
	hostMode: He,
	windowOffset: Ye,
	windowTotal: Xe,
	windowSize: Je,
	windowMoreAfter: Qe,
	windowAggregates: $e,
	itemsQuery: Ne,
	valueKind: Be,
	itemsQueryKind: Ve,
	menuItemClass: g,
	menuItemKind: ft,
	menuItemCheckedClass: pt
};
function On(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function kn(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var An = 0;
function jn(e, t) {
	return e.id.length === 0 && (An++, e.id = `${t}-${An}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Mn(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(_) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Nn = {
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
	DiscardForm: "DiscardForm",
	SetLanguage: "SetLanguage"
}, Pn = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(y(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${y(t.componentId)}:${e.propertyName}`, t);
		}
		for (let t of e.validations) this.addValidation(t);
	}
	getPropertyDefinition(e) {
		return this.propertyDefinitionsById.get(e);
	}
	getBindingById(e) {
		return this.bindingsById.get(e);
	}
	isTranslatable(e) {
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(y(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (y(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(tr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(tr(e, er(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(nr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(b(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(b(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(rr(e, t))?.items ?? [];
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
		let t = y(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = y(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(tr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(tr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = b(e.eventName), n = y(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(nr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = y(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = y(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = y(e.componentId);
		t > 0 && this.itemValuesByAddress.set(rr(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = y(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function v(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Fn(e) {
	return v(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function In(e) {
	return e == null ? "OneWay" : v(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Ln(e) {
	return v(e, ["Property", "Event"]);
}
function Rn(e) {
	return e == null ? "SetProperty" : v(e, ["SetProperty", "Effect"]);
}
function zn(e) {
	return v(e, [
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
function Bn(e) {
	return v(e, ["Ascending", "Descending"]);
}
function Vn(e) {
	return v(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Hn(e) {
	return v(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Un(e) {
	return typeof e == "string" ? e : v(e, [
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
function Wn(e) {
	return v(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Gn(e) {
	return v(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function y(e) {
	return e ?? 0;
}
function Kn(e) {
	return typeof e == "string" ? e : "";
}
function qn(e) {
	return v(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function Jn(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Yn(e) {
	return v(e, ["Auto", "Smooth"]);
}
function Xn(e) {
	return v(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Zn(e) {
	return v(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Qn(e) {
	return v(e, ["Light", "Dark"]);
}
function $n(e) {
	return v(e, ["Horizontal", "Vertical"]);
}
function b(e) {
	return e?.trim().toLowerCase() ?? "";
}
function er(e) {
	return e?.trim() ?? "";
}
function tr(e, t) {
	return `${e}:${er(t)}`;
}
function nr(e, t) {
	return `${e}:${b(t)}`;
}
function rr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ir = class {
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
	isTranslatable(e) {
		return this.metadata.isTranslatable(e);
	}
	hasRenderedComponent(e) {
		return this.dom.findAllComponents(y(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = y(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = y(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ee}${kn(r.propertyName)}="${On(a)}"]` : null;
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
		let n = y(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Mn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${kn(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ar(e) {
	return lr(e, ue);
}
function or(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = ur(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function sr(e, t) {
	let n = ar(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = or(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function cr(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = ur(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function lr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function ur(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function dr(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var fr = class {
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
		let e = this.root.querySelectorAll(_), t = this.root.querySelector(`[${Le}]`) !== null;
		for (let n of e) {
			let e = x(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && gr(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return jn(e, t);
	}
	findComponentParts(e, t, n) {
		return dr(this.findAllComponents(e, t), n);
	}
	findEveryComponent(e) {
		return e <= 0 ? [] : (this.stale && this.rebuild(), [...this.componentsById.get(e) ?? []]);
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.stale && this.rebuild(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			return t === void 0 ? [...this.componentsById.get(e) ?? []] : [t];
		}
		let n = this.keyedComponents(e).get(hr(t)) ?? [];
		if (n.length > 0 && n.every((e) => sr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => sr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = ar(n);
			if (e === 0) continue;
			let r = or(n, e);
			if (r.length !== e) continue;
			let i = hr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(_);
			if (e === null || !_r(this.root, e)) return null;
			let r = x(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: or(e, ar(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function x(e) {
	return lr(e, ce);
}
function pr(e) {
	let t = e.closest(_), n = t === null ? 0 : x(t);
	return n > 0 ? n : null;
}
function mr(e) {
	let t = e.closest(_), n = t === null ? 0 : x(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: or(t, ar(t))
	};
}
function hr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function gr(e) {
	return ar(e) === 0;
}
function _r(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function vr(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = yr(n);
	switch (br(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : xr(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : xr(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Sr(r, i);
		case "pl": return Cr(r, i);
		default: return "other";
	}
}
function yr(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function br(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function xr(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Sr(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Cr(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/runtime/words.ts
var wr = "count";
function Tr(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Er(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
function Dr(e, t, n) {
	return Tr(e) ? Ar(n, e.key, e.args) : Er(e) ? Or(n, e.text) : t && typeof e == "string" ? Or(n, e) : e;
}
function Or(e, t) {
	return t.trim().length === 0 || !kr(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function kr(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Ar(e, t, n) {
	let r = n?.[wr];
	return jr(typeof r == "number" ? e.lookup(`${t}.${vr(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Er(t) ? Or(e, t.text) : Ar(e, t.key, t.args));
}
function jr(e, t, n) {
	if (t == null || !e.includes("{")) return e;
	let r = "", i = 0;
	for (; i < e.length;) {
		if (e[i] === "{") {
			let a = Mr(e, i);
			if (a > 0) {
				let o = e.slice(i + 1, a);
				if (Object.hasOwn(t, o)) {
					r += Pr(t[o], n), i = a + 1;
					continue;
				}
			}
		}
		r += e[i], i++;
	}
	return r;
}
function Mr(e, t) {
	let n = t + 1;
	for (; n < e.length && Nr(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Nr(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Pr(e, t) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Tr(e) ? t === void 0 ? jr(e.key, e.args) : t(e) : Er(e) ? t === void 0 ? e.text : t(e) : String(e);
}
//#endregion
//#region src/runtime/client-strings.ts
var Fr = 256, Ir = 512, Lr = "script[type='application/json'][data-ui-strings]", Rr = "#text", zr = class {
	words = /* @__PURE__ */ new Map();
	overrides = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	changeHandlers = /* @__PURE__ */ new Set();
	currentLanguage = "";
	currentPrefixes = [];
	complete = !0;
	report = !1;
	tableLoaded = !1;
	hasStringsBlock = !1;
	asker = null;
	asked = /* @__PURE__ */ new Map();
	pending = /* @__PURE__ */ new Set();
	flushQueued = !1;
	switches = 0;
	requested = null;
	get language() {
		return this.currentLanguage;
	}
	get requestedLanguage() {
		return this.requested ?? this.currentLanguage;
	}
	setRequested(e) {
		e !== null && this.switches++, this.requested = e;
	}
	get prefixes() {
		return this.currentPrefixes;
	}
	load(e = document) {
		let t = e.querySelector(Lr)?.textContent?.trim() ?? "";
		if (t.length !== 0) {
			this.hasStringsBlock = !0;
			try {
				for (let [e, n] of Object.entries(JSON.parse(t))) typeof n == "string" && this.words.set(e, n);
			} catch (e) {
				s("client strings could not be read.", e);
			}
		}
	}
	register(e) {
		for (let [t, n] of Object.entries(e)) typeof n == "string" && this.overrides.set(t, n);
	}
	useTable(e) {
		let t = /* @__PURE__ */ new Map();
		for (let [n, r] of Object.entries(e.words ?? {})) typeof r == "string" && t.set(n, r);
		this.words = t, this.currentLanguage = e.language, this.currentPrefixes = Array.isArray(e.prefixes) ? e.prefixes.filter((e) => typeof e == "string") : [], this.complete = e.complete !== !1, this.report = e.report === !0, this.tableLoaded = !0, this.missing.clear(), this.pending.clear();
	}
	setLanguage(e) {
		this.tableLoaded || (this.currentLanguage = e);
	}
	setAsker(e) {
		this.asker = e;
	}
	async loadTableAsync(e, t = fetch) {
		let n = this.switches;
		try {
			let r = await t(e, { credentials: "same-origin" });
			if (!r.ok) throw Error(`the words answered ${r.status}.`);
			let i = await r.json();
			if (typeof i?.language != "string" || typeof i.words != "object" || i.words === null) throw Error("the words are not a table.");
			return n === this.switches && (this.useTable(i), !0);
		} catch (t) {
			return s("the page's words could not be fetched; the page keeps the words it has.", {
				href: e,
				error: t
			}), !1;
		}
	}
	async switchToAsync(e, t, n = fetch) {
		return this.switches++, await this.loadTableAsync(t ?? `/_ne/words/${encodeURIComponent(e)}.json`, n);
	}
	onChange(e) {
		return this.changeHandlers.add(e), () => this.changeHandlers.delete(e);
	}
	notifyChanged() {
		for (let e of this.changeHandlers) try {
			e();
		} catch (e) {
			s("a words change handler failed.", e);
		}
	}
	lookup(e) {
		let t = this.overrides.get(e);
		if (t !== void 0) return t;
		let n = this.words.get(e);
		return n === void 0 && this.askLater(e), n;
	}
	text(e) {
		let t = this.lookup(e);
		return t === void 0 ? (this.missing.has(e) || (this.missing.add(e), (this.hasStringsBlock ? s : l)("client string has no text; the key is shown instead.", { key: e })), e) : t;
	}
	format(e, t) {
		return this.lookup(e) === void 0 && this.text(e), Ar(this, e, t);
	}
	translate(e, t) {
		return Ar(this, e, t);
	}
	resolve(e, t) {
		return Dr(e, t, this);
	}
	resolveText(e) {
		return Dr(e, !0, this);
	}
	write(e, t, n, r) {
		Ur(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Ur(e, t, Dr(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Tr(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Er(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Ur(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Vr(e, t, n);
	}
	rewriteMarks(e) {
		Wr(e, (e) => {
			for (let t of e.querySelectorAll(`[${Yt}]`)) for (let [e, n] of Object.entries(Hr(t))) {
				let r = this.wordsOfMark(n);
				r !== null && Ur(t, e === Rr ? null : e, r);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Dr(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Ir || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && kr(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
	}
	askedIn(e) {
		let t = this.asked.get(e);
		return t === void 0 && (t = /* @__PURE__ */ new Set(), this.asked.set(e, t)), t;
	}
	async flushAsync() {
		this.flushQueued = !1;
		let e = this.asker, t = this.currentLanguage, n = [...this.pending], r = this.askedIn(t);
		if (this.pending.clear(), e === null || n.length === 0) return;
		for (let e of n) r.add(e);
		let i = !1;
		for (let r = 0; r < n.length; r += Fr) try {
			let a = await e(t, n.slice(r, r + Fr));
			if (t !== this.currentLanguage) return;
			for (let [e, t] of Object.entries(a ?? {})) typeof t == "string" && this.words.get(e) !== t && (this.words.set(e, t), i = !0);
		} catch (e) {
			l("asking the server for missing words failed; the keys show themselves.", {
				language: t,
				error: e
			});
		}
		i && this.notifyChanged();
	}
};
function Br(e, t) {
	e.hasAttribute("data-ui-words") && Vr(e, t, null);
}
function Vr(e, t, n) {
	let r = Hr(e), i = t ?? Rr;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Yt) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Yt, a);
}
function Hr(e) {
	let t = e.getAttribute(Yt);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Ur(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Wr(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Wr(n.content, t);
}
var S = new zr();
function Gr(e, t) {
	return S.resolve(e, typeof e == "string" && e.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Kr = `.${pn}, .${mn}, [inert]`, qr = `:scope > [${ce}]:is(${Kr}), :scope > :not([${ce}]) > [${ce}]:is(${Kr})`;
function C(e) {
	return e.closest(Kr) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function w(e) {
	return e.matches(Kr) || e.querySelector(qr) !== null;
}
function Jr(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Yr = `[${ce}], .${hn}`;
function T(e) {
	return e.closest(Yr)?.matches(`.${hn}`) === !0;
}
function Xr(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(pn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Zr = {
	isInert: C,
	isReadOnly: T,
	setDisabled: Xr
};
//#endregion
//#region src/extensions/value-readers.ts
function Qr(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function $r(e) {
	return e == null;
}
var ei = "data-ui-trim-input", ti = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of oi) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Be);
		if (t === null) return ni(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(ei) ? t.trim() : t;
	}
	readHeld(e) {
		let t = ii(e);
		return t === null ? null : this.read(t);
	}
};
function ni(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ri = "input, textarea, select";
function ii(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ri) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ri}`);
}
function ai(e) {
	return e === null ? null : Number(e);
}
var oi = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(on)
	},
	{
		kind: "tab-order",
		read: (e) => ai(e.getAttribute(sn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(cn)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(ln)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(zt)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(nn)
	},
	{
		kind: "selected-keys",
		read: (e) => si(e, rn)
	},
	{
		kind: Ve,
		read: (e) => si(e, Ne)
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
function si(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function ci(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var li = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function ui(e) {
	return e instanceof HTMLInputElement && li.has(e.type);
}
function di(e) {
	return ui(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var fi = "ui-draft-dropped";
function pi(e) {
	e.dispatchEvent(new Event(fi, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function mi(e) {
	let t = vi(e.key), n = yi(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(_i);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function hi(e, t) {
	return vi(e) !== null || yi(e, t) !== 0;
}
var gi = {
	target: mi,
	applyTabIndex: E
};
function E(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function _i(e) {
	return e.getClientRects().length > 0 && !C(e);
}
function vi(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function yi(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function bi(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var xi = "data-ui-bind-selected-keys", Si = ".ui-items-view, .ui-table, .ui-tree", Ci = `.ui-items-view__item, .${Tt}, .ui-tree__row`, wi = {
	shift: !1,
	ctrl: !1
}, Ti = /* @__PURE__ */ new WeakMap();
function Ei(e, t) {
	t !== null && !Ti.has(e) && Di(e, t);
}
function Di(e, t) {
	let n = Hi(t);
	n.length > 0 && Ti.set(e, n);
}
function Oi(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ki(e, t) {
	let n = Oi(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Ai(e) {
	return !e.hasAttribute(Ft);
}
function ji(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ce}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Mi(e) {
	switch (e.getAttribute(en)) {
		case "one": {
			let t = e.getAttribute(nn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Bi(Vi(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Ni(e, t) {
	let n = Mi(e), r = e.getAttribute(en), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(Hi(e));
		e.toggleAttribute(tn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Pi(e) {
	return e.filter((e) => e.hasAttribute(tn));
}
function Fi(e, t, n, r) {
	let i = Hi(n);
	if (!Ri(n)) return !1;
	switch (e.getAttribute(en)) {
		case "one": return bi(e, i, {
			attribute: nn,
			bindingAttribute: an,
			apply: (e) => Ni(e, t)
		}), !0;
		case "many": return Ii(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Ii(e, t, n, r, i) {
	let a = Vi(e);
	if (a === null) return;
	let o = Bi(a), s;
	if (i.shift) {
		let r = zi(t, t.find((t) => Hi(t) === Ti.get(e)) ?? n, n).map(Hi);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Ti.set(e, r)) : (s = [r], Ti.set(e, r));
	Li(e, t, s);
}
function Li(e, t, n) {
	let r = Vi(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(rn, i), Ni(e, t), r.hasAttribute(xi) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ri(e) {
	return Hi(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !w(e);
}
function zi(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => ji(e) !== null && Ri(e));
}
function Bi(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Vi(e) {
	for (let t of e.querySelectorAll(`[${h}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function Hi(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Ui = {
	isSelected: (e) => e.hasAttribute(tn),
	toggle: Wi,
	setSelected: Gi,
	setSelectedKeys: Ki
};
function Wi(e) {
	let t = e.closest(Si);
	t !== null && e instanceof HTMLElement && Fi(t, qi(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Gi(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(Hi(e));
	Ki(e, r, n);
}
function Ki(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = qi(e), i = new Set(r.filter((e) => !Ri(e)).map(Hi)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Mi(e)].filter((e) => !a.has(e));
	Li(e, r, n ? [...o, ...a] : o);
}
function qi(e) {
	return [...e.querySelectorAll(Ci)].filter((t) => t.closest(Si) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function Ji(e) {
	let t = e.closest(Si);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ci);
	return n !== null && n.closest(".ui-items-view, .ui-table, .ui-tree") === t ? {
		root: t,
		row: n
	} : null;
}
function Yi(e) {
	return e.filter((e) => ji(e) !== null && !w(e));
}
function Xi(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !w(e)) ?? Yi(e)[0] ?? null;
}
function Zi(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(xe);
	n.setAttribute(xe, ""), e.setAttribute("aria-activedescendant", jn(n, "ui-row")), (ji(n) ?? n).scrollIntoView({ block: "nearest" });
}
function Qi(e, t, n, r) {
	if (!hi(e, r === "grid" ? "both" : r)) return null;
	let i = Yi(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return $i(i, n, e === "ArrowDown");
	let a = i.map((e) => ji(e) ?? e), o = mi({
		key: e,
		items: a,
		current: n === null ? null : ji(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function $i(e, t, n) {
	let r = t === null ? null : ji(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ea(i), o = e.map((e) => ({
		row: e,
		rect: (ji(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(ea(t.rect) - a) < Math.abs(ea(e.rect) - a) ? t : e).row;
}
function ea(e) {
	return e.left + e.width / 2;
}
function ta(e, t) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(new Event(t, { bubbles: !0 }));
}
function na(e, t, n) {
	let r = n.hasAttribute(xe), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Yi(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && Zi(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var ra = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), ia = /* @__PURE__ */ new Set([
	"Shift",
	"Control",
	"Alt",
	"AltGraph",
	"Meta",
	"OS",
	"Hyper",
	"Super",
	"Fn",
	"FnLock",
	"Symbol",
	"SymbolLock",
	"CapsLock",
	"NumLock",
	"ScrollLock"
]), aa = !1, oa = null, sa = /* @__PURE__ */ new Set();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => ca(e.target), !0), window.addEventListener("keydown", (e) => la(e), !0), window.addEventListener("focusin", (e) => ua(e.target), !0), window.addEventListener("focusout", (e) => ma(e.target, !1), !0));
function ca(e) {
	aa = !0;
	let t = document.activeElement;
	oa = t, t instanceof Element && t !== document.body && e instanceof Node && t.contains(e) && ma(t, !da(t));
}
function la(e) {
	if (!(e instanceof KeyboardEvent && ia.has(e.key))) {
		aa = !1;
		for (let e of [...sa]) ma(e, !1);
	}
}
function ua(e) {
	aa && !da(e) && ma(e, !0);
}
function da(e) {
	return di(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function fa() {
	return aa && oa instanceof HTMLElement && oa !== document.body ? oa : null;
}
function pa() {
	return aa;
}
function ma(e, t) {
	e instanceof Element && (t ? sa.add(e) : sa.delete(e), e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute($t, t));
}
function D(e) {
	e.focus({ preventScroll: !0 });
}
function ha(e) {
	ma(e, !0), e.focus({ preventScroll: !0 });
}
function ga(e) {
	for (let t of e.querySelectorAll(ra)) if (Jr(t)) return t;
	return null;
}
var _a = `.${_n}, .${vn}, [${yn}]`;
function va(e) {
	let t = Ji(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(_a)) && n.hasAttribute("tabindex") && Jr(n)) return n;
	return null;
}
function ya(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? ga(e);
	return r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), D(r ?? e), n;
}
function ba(e, t, n = !1) {
	if (aa) {
		E(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), D(e);
		return;
	}
	let r = t.filter(_i), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (E(t, i), D(i));
}
function xa(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Sa(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${ra}, [tabindex]`) && Jr(e)) return e;
	return n === null ? null : Ca(n);
}
function Sa(e, t) {
	for (let n = e.closest(_); n !== null; n = n.parentElement?.closest(_) ?? null) {
		let e = t.querySelectorAll(`[${ce}="${n.getAttribute(ce)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Ca(e) {
	for (let t = e.closest(_); t !== null; t = t.parentElement?.closest(_) ?? null) if (Jr(t)) {
		if (!t.hasAttribute("tabindex")) {
			t.tabIndex = -1;
			let e = (n) => {
				n.target === t && (t.removeAttribute("tabindex"), t.removeEventListener("focusout", e));
			};
			t.addEventListener("focusout", e);
		}
		return t;
	}
	return null;
}
function wa(e, t) {
	e != null && t.contains(document.activeElement) && D(e);
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Ta = "data-ui-clear", Ea = ["change", "toggle"], Da = [
	...Ea,
	"expand",
	"collapse",
	"open",
	"close"
];
function Oa(e) {
	let t = In(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function ka(e) {
	return In(e) === "OnSubmit";
}
function Aa(e, t) {
	let n = e.getAttribute(Oe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && ka(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Oa(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: ka(i.mode)
		};
	}
	return null;
}
var ja = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Ea) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(fi, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Ta}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Aa(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
			n.getAttribute("data-ui-form-id") === e && (this.bufferedElements.delete(n), t.push(n));
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
		let t = e.target.closest(`[${Ta}]`);
		if (t === null) return;
		let n = t.closest(_), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Ma(r) || (ci(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), di(r) && document.activeElement !== r && D(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element)) return;
		let t = Aa(e.target, this.options.metadata);
		if (t !== null) {
			if (t.buffered) {
				this.bufferValue(e.target);
				return;
			}
			this.bufferedElements.delete(e.target), await this.syncValueAsync(e.target, t.bindingId);
		}
	}
	bufferValue(e) {
		if (e.getAttribute("data-ui-form-id") === null) {
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
			if (n.getAttribute("data-ui-form-id") !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = Aa(n, this.options.metadata);
			r !== null && t.push(this.syncValueAsync(n, r.bindingId));
		}
		await Promise.all(t);
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
		if (i === void 0 || !Oa(i.mode) || ka(i.mode)) return;
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
function Ma(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/command-turns.ts
var Na = class {
	last = Promise.resolve();
	take() {
		let e = this.last, t = () => void 0, n = new Promise((e) => {
			t = e;
		});
		return this.last = Promise.all([e, n]).then(() => void 0), {
			ahead: e,
			done: t
		};
	}
}, Pa = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = b(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = b(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(b(e));
	}
	markAttached(e) {
		let t = b(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, Fa = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: y(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Ia = {
	dispatched: !1,
	success: !1
}, La = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Ra = class {
	options;
	root;
	registry;
	requestFactory = new Fa();
	turns = new Na();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Pa(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Ba(t, r.element)) return;
		let i = t.target.closest(`[${Ae}]`);
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
			let t = e instanceof La, r = t ? e.reason : e;
			throw n.completed?.({
				...o,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && C(r.domEvent.target)) return Ia;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Ia;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Va(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), Ia;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Ia;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new La(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Da.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(ke(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		za(e.preventDefault, t) && t.domEvent.preventDefault(), za(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function za(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Ba(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Va(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Ha(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Ua(e, t) : Wa(e, t);
}
function Ua(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Ha(e[n], t[n])) return !1;
	return !0;
}
function Wa(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Ha(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Ga = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of Ea) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
	applyEditedValue(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		if (t === null) return;
		let n = Aa(e.target, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return;
		else r = this.index.getPropertyInteractions(y(n.binding.componentId), n.binding.propertyId);
		if (r.length === 0) return;
		let i = this.options.valueReaders.readBound(e.target), a = qa(r[0].source, t.dynamicParameters);
		if (!(this.heard.has(a) && Ha(this.heard.get(a), i))) {
			this.heard.set(a, i);
			for (let e of r) this.applyInteraction(e, t.dynamicParameters, !0, i);
		}
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: y(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(y(e.reference.componentId), e.reference.propertyId);
		t.length > 0 && this.heard.set(qa(e.reference, e.dynamicParameters), e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (Rn(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!Ja(i)) return;
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
			effect: Ka(r, t),
			dom: this.options.dom
		});
	}
};
function Ka(e, t) {
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
function qa(e, t) {
	return JSON.stringify([
		y(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function Ja(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Ya = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Xa(t, e.operator, e.value);
	}
};
function Xa(e, t, n) {
	switch (zn(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return Za(e, n, (e) => e > 0);
		case "GreaterOrEqual": return Za(e, n, (e) => e >= 0);
		case "Less": return Za(e, n, (e) => e < 0);
		case "LessOrEqual": return Za(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return Qa(e, n);
		default: return !1;
	}
}
function Za(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Qa(e, t) {
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
var $a = "Value", eo = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	valueInteractions = /* @__PURE__ */ new Map();
	metadata;
	constructor(e) {
		this.metadata = e;
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(b(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) ro(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(b(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(io(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(ao(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (to(e)) {
			let t = y(e.sourceEvent?.componentId), n = b(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(io(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(io(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (no(e)) {
			let t = y(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(ao(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(ao(t, n), r)), r.push(e), this.metadata.getPropertyDefinition(n)?.propertyName === $a) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function to(e) {
	return Ln(e.sourceKind) === "Event";
}
function no(e) {
	return Ln(e.sourceKind) === "Property";
}
function ro(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function io(e, t) {
	return `${e}:${b(t)}`;
}
function ao(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var oo = {
	fast: 120,
	normal: 200,
	ripple: 250,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)"
};
function so() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function co(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var lo = /* @__PURE__ */ new Set([
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
function uo(e) {
	return lo.has(e);
}
var fo = 4, po = 12, mo = /* @__PURE__ */ new Map(), ho = !1, go = null, _o = /* @__PURE__ */ new WeakMap(), vo = "data-ui-popup-stood-in";
function yo(e, t) {
	t === null ? _o.delete(e) : _o.set(e, t);
}
function bo(e, t, n) {
	mo.set(t, {
		anchor: e,
		options: n
	}), Eo(), go?.observe(t), So(t), Oo(e, t, n);
}
var xo = "data-ui-popup-lifted";
function So(e) {
	if (e.hasAttribute(xo)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	Co(e) && (e.setAttribute("popover", "manual"), e.setAttribute(xo, ""), e.showPopover());
}
function Co(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function wo(e) {
	e.hasAttribute(xo) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || mo.has(e) || (e.removeAttribute("popover"), e.removeAttribute(xo));
	}, oo.fast));
}
function To(e) {
	e != null && (mo.delete(e), go?.unobserve(e), wo(e));
}
function Eo() {
	ho || (ho = !0, document.addEventListener("scroll", Do, !0), window.addEventListener("resize", Do), go = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = mo.get(t.target);
			e !== void 0 && Oo(e.anchor, t.target, e.options);
		}
	}));
}
function Do() {
	for (let [e, t] of mo) {
		if (!e.isConnected) {
			To(e);
			continue;
		}
		Oo(t.anchor, e, t.options);
	}
}
function Oo(e, t, n) {
	if (!e.isConnected) return;
	let r = ko(e), i = r !== e;
	t.hasAttribute(vo) !== i && t.toggleAttribute(vo, i), n.minAnchorWidth === !0 && (t.style.minWidth = `${r.getBoundingClientRect().width}px`);
	let a = r.getBoundingClientRect(), o = (r === e ? n.crossAnchor ?? r : r).getBoundingClientRect(), s = t.getBoundingClientRect(), c = Mo(a, s, n), l = Ro(a, o, s, c, n.gap), u = zo(a, o, s, c, n.gap);
	n.arrow === !0 && (Po(c) ? u = Ao(u, o.left + o.width / 2, s.width) : l = Ao(l, o.top + o.height / 2, s.height)), l = Vo(l, s.height, window.innerHeight), u = Vo(u, s.width, window.innerWidth), t.style.top = `${l}px`, t.style.left = `${u}px`, t.dataset.uiPlacement !== c && (t.dataset.uiPlacement = c), jo(t, o, s, c, l, u);
}
function ko(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(vo)) return e;
		let n = _o.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Ao(e, t, n) {
	let r = t - e;
	return r < po ? e - (po - r) : r > n - po ? e + (r - (n - po)) : e;
}
function jo(e, t, n, r, i, a) {
	let o = Po(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(po, Math.min(s, c - po))}px`);
}
function Mo(e, t, n) {
	let r = n.placement, i = No(t, r) + n.gap, a = Fo(e, r), o = Io(r);
	return a >= i || Fo(e, o) <= a ? r : o;
}
function No(e, t) {
	return Po(t) ? e.height : e.width;
}
function Po(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Fo(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Io(e) {
	return e.startsWith("top") ? `bottom${Lo(e)}` : e.startsWith("bottom") ? `top${Lo(e)}` : e.startsWith("left") ? `right${Lo(e)}` : `left${Lo(e)}`;
}
function Lo(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Ro(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Bo(t.top, t.height, n.height, r);
}
function zo(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Bo(t.left, t.width, n.width, r);
}
function Bo(e, t, n, r) {
	let i = Lo(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Vo(e, t, n) {
	return Math.max(fo, Math.min(e, n - t - fo));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Ho = 32;
function O(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Uo(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Uo(e, t, n) {
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
		if (r.size > Ho) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Wo(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Go = "data-ui-dialog";
function Ko(e) {
	let t = e.querySelectorAll(`[${Go}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function qo(e) {
	let t = Ko(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function Jo(e) {
	let t = typeof document > "u" ? null : qo(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Yo = /* @__PURE__ */ new Set(), Xo = /* @__PURE__ */ new Map(), Zo = 0, Qo = !1;
function $o() {
	Qo || (Qo = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || ts() && e.preventDefault();
	}, !0));
}
function es() {
	for (let e of Yo) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function ts() {
	let e = [];
	for (let t of Yo) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...Xo.keys()]) t.has(e) || Xo.delete(e);
	for (let { popup: t } of e) Xo.has(t) || Xo.set(t, ++Zo);
	let n = ns(e, (e) => Xo.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function ns(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var rs = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Yo.add(this), $o();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = e.composedPath(), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = e.composedPath();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
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
	isBehind(e) {
		return this.options.isBehind === void 0 ? Jo(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
};
//#endregion
//#region src/interactions/owned-popup.ts
function is(e, t) {
	return e.isConnected && !C(e) && !(t && T(e));
}
var as = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new rs({
			openPopups: () => [...this.entries.values()].map((e) => e.opening.popup).filter((e) => e.isConnected),
			close: (e, t) => this.closePopup(e, t),
			canDismiss: (t, n) => {
				let r = this.entryOf(t);
				return r === null || e.canDismiss === void 0 || e.canDismiss(r.opening, n);
			},
			isInside: (e, t) => {
				let n = this.entryOf(e);
				return n === null ? t.includes(e) : this.isInside(n.opening, t);
			},
			isBehind: (e) => Jo(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0);
	}
	closePopup(e, t) {
		let n = this.entryOf(e);
		n !== null && this.close(n.opening.owner, t);
	}
	entryOf(e) {
		for (let t of this.entries.values()) if (t.opening.popup === e) return t;
		return null;
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e.popup) || t.includes(e.owner) : this.options.isInside(e, t);
	}
	handleFocusLeave(e) {
		let t = e instanceof FocusEvent ? e.relatedTarget : null;
		!(e.target instanceof Node) || pa() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : os(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, ls(t)) && !Jo(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = va(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && is(n.owner, this.closesWhenReadOnly) && !Jo(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
		}
	}
	get current() {
		let e = null;
		for (let t of this.entries.keys()) e = t;
		return e;
	}
	isOpen(e) {
		return this.entries.has(e);
	}
	popupOf(e) {
		return this.entries.get(e)?.opening.popup ?? null;
	}
	open(e) {
		if (this.entries.get(e.owner)?.opening.popup === e.popup) return this.reposition(e.owner), !0;
		if (this.close(e.owner), !is(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), us(e), ds(e, !0), ms(this), e.focus !== void 0 && e.focus !== !1 && ya(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && us(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && wa(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), ds(r, !1), To(r.popup), this.entries.size === 0 && hs(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (is(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !ss() && cs(e);
		}
	}
};
function os(e) {
	return e instanceof Element && e.isConnected && Jr(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function ss() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Jr(e);
}
function cs(e) {
	!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = -1), D(e);
}
function ls(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function us(e) {
	e.anchor !== void 0 && e.placement !== void 0 && bo(e.anchor, e.popup, e.placement);
}
function ds(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var fs = /* @__PURE__ */ new Set(), ps = null;
function ms(e) {
	fs.add(e), ps === null && typeof MutationObserver == "function" && (ps = new MutationObserver(() => {
		for (let e of [...fs]) e.closeStranded();
	}), ps.observe(document, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: [
			"class",
			"inert",
			"disabled",
			"aria-disabled"
		]
	}));
}
function hs(e) {
	fs.delete(e), !(fs.size > 0 || ps === null) && (ps.disconnect(), ps = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var gs = "ui-flyout", _s = "ui-flyout--open", vs = "ui-flyout__anchor", ys = "data-ui-flyout-no-backdrop-close", bs = "data-ui-flyout-no-escape-close", xs = 4, Ss = `${gs}--`, Cs = "bottom-start", ws = class {
	root;
	flyouts = new as({
		show: ({ owner: e }) => e.classList.add(_s),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? bs : ys)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${gs}`)) this.place(e);
		O(this.root, `.${gs}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${vn}`), n = e.querySelector(`:scope > .${vs}`);
		if (t === null) return;
		let r = Ts(n, t);
		if (!e.classList.contains(_s)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Ds(n) ?? e,
			placement: {
				placement: Os(e),
				gap: xs
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(_s) && (e.classList.remove(_s), Es(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vs}`)?.closest(`.${gs}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(_s), this.place(t), this.flyouts.isOpen(t) && Es(t, !0);
		}
	}
};
function Ts(e, t) {
	if (e === null) return null;
	let n = e.querySelector(ra) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", jn(t, "ui-flyout-content")), n;
}
function Es(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Ds(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Os(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Ss)) continue;
		let e = t.slice(Ss.length);
		if (uo(e)) return e;
	}
	return Cs;
}
//#endregion
//#region src/interactions/file-drop.ts
var ks = 120, As = "refused", js = !1;
function Ms(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	Ps();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Ns(e, t, n), !0);
	e.root.addEventListener("dragend", () => Rs(e, t.marked), !0), window.addEventListener("blur", () => Rs(e, t.marked));
}
function Ns(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Rs(e, r);
		return;
	}
	let { host: a } = i;
	if (i.refused === !0) {
		Fs(n), n.type !== "dragleave" && Rs(e, r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Ls(e, r, a) : t.leaving = window.setTimeout(() => Rs(e, r), ks);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Is(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && Ls(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? As : "");
		return;
	}
	Rs(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => zs(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function Ps() {
	if (!js) {
		js = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Fs(e);
		});
	}
}
function Fs(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Is(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function Ls(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function Rs(e, t) {
	for (let n of t) Ls(e, t, n);
}
function zs(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var Bs = "/_ne/files/upload";
function Vs(e, t) {
	let n = Number(e.getAttribute(Kt));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function Hs(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Bs), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var Us = () => {}, Ws = { uploadAsync: (e, t) => Hs(e, t ?? Us) };
function Gs(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Ks = "ui-file-input", qs = "ui-file-input__row", Js = "ui-file-input__native", Ys = "ui-file-input__field", Xs = "ui-file-input__selection", Zs = "data-ui-file-dragging", Qs = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, S.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ms({
			root: this.root,
			draggingAttribute: Zs,
			resolveTarget: (e) => {
				let t = e.closest(`.${qs}`)?.closest(`.${Ks}`) ?? null, n = t?.querySelector(`.${Js}`) ?? null;
				return t === null || n === null ? null : {
					host: t,
					accept: n.getAttribute("accept") ?? "",
					multiple: n.multiple,
					refused: n.disabled || T(t) || C(t)
				};
			},
			onFiles: (e, t) => void this.takeFilesAsync(e, t)
		});
	}
	rewriteShownWords() {
		for (let [e, t] of this.shownWords) e.isConnected ? e.value = t() : this.shownWords.delete(e);
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qt}], .${qs}`);
		if (t === null || C(t) || T(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Ks}`)?.querySelector(`.${Js}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Js)) return;
		let t = e.target.closest(`.${Ks}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Ys}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Vs(e, t);
		if (r.length === 0) {
			this.show(n, () => S.text("ui.file.oversized"));
			return;
		}
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Hs(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => S.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, $s(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => S.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		typeof t == "string" ? this.shownWords.delete(e) : this.shownWords.set(e, t), e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		Gs(e.querySelector(`.${Xs}`), t);
	}
};
function $s(e) {
	return e.length === 1 ? e[0].name : () => S.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/image-input-engine.ts
var ec = "ui-image-input", tc = "ui-image-input--multiple", nc = "ui-image-input__surface", rc = "ui-image-input__native", ic = "ui-image-input__picture", ac = "ui-image-input__text", oc = "ui-image-input__selection", sc = "ui-image-input__selections", cc = "ui-image-input__tiles", lc = "ui-image-input__tile", uc = "ui-image-input__remove", dc = "data-ui-image-preview", fc = "data-ui-image-dragging", pc = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${ec}`)), O(this.root, `.${ec}`, {
			childList: !0,
			attributeFilter: [
				Gt,
				je,
				rn
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(fi, (e) => this.handleDraftDropped(e)), Ms({
			root: this.root,
			draggingAttribute: fc,
			resolveTarget: (e) => {
				let t = e.closest(`.${nc}`), n = t?.closest(`.${ec}`) ?? null;
				return t === null || n === null ? null : {
					host: n,
					accept: n.querySelector(`.${rc}`)?.getAttribute("accept") ?? "",
					multiple: mc(n),
					refused: T(n) || C(t)
				};
			},
			onFiles: (e, t) => void (mc(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) mc(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${ic}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || gc(e, e.getAttribute("data-ui-image-caption") ?? yc(n)), vc(e, n.length > 0));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(rn);
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
		let t = e.target.closest(`[${qt}]`), n = t?.closest(`.${ec}`) ?? null;
		t === null || n === null || T(n) || C(t) || n.querySelector(`.${rc}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${uc}`), n = t?.closest(`.${ec}`) ?? null;
		if (t === null || n === null || T(n) || C(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(rc)) return;
		let t = e.target.closest(`.${ec}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (mc(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${ec}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Gs(t.querySelector(`.${oc}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${nc}`), r = e.querySelector(`.${ic}`), i = e.querySelector(`.${oc}`);
		if (n === null || r === null || Vs(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(dc, ""), r.setAttribute("src", a), gc(e, t.name), vc(e, !0), n.classList.add(mn);
		try {
			let n = await Hs([t], () => void 0);
			this.previews.get(e) === a && Gs(i, n.selectionId);
		} catch (t) {
			_c(e), Gs(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(mn);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${cc}`), r = Vs(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = hc(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Hs([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(mn), this.publishShelf(e);
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
		let t = e.querySelector(`.${sc}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(rn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(dc), t || gc(e, ""));
	}
};
function mc(e) {
	return e.classList.contains(tc);
}
function hc(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${lc} ${mn}`, n.src = i, n.alt = e.name, r.type = "button", r.className = uc, S.write(r, "aria-label", "ui.image.remove"), t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function gc(e, t) {
	let n = e.querySelector(`.${ac}`);
	n !== null && (Br(n, null), n.textContent !== t && (n.textContent = t));
}
function _c(e) {
	let t = e.querySelector(`.${ac}`);
	t !== null && S.write(t, null, "ui.file.failed");
}
function vc(e, t) {
	let n = e.querySelector(`.${nc}`);
	n !== null && S.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function yc(e) {
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
//#region src/interactions/key-value-action-engine.ts
var bc = "ui-key-value-action__row", xc = "ui-key-value-action__value", Sc = "ui-key-value-action__value-input", Cc = "ui-key-value-action__edit-action", wc = "ui-text__title", Tc = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${bc}`)), O(this.root, `.${bc}`, {
			childList: !0,
			attributeFilter: [Wt]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${Sc} [${Oe}]`)) {
			if (di(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		pi(e);
	}
	open(e) {
		let t = e.querySelector(`.${Sc} :is(input, textarea, select)`);
		if (t !== null) {
			if (di(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${xc} .${wc}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), ui(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Dc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Cc)) return;
		let { cell: n, row: r } = t, i = e.target.closest(bn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Cc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !C(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function Ec(e) {
	return Dc(e) !== null;
}
function Dc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Sc}, .${Cc}`), n = t?.closest(`.${bc}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Oc = `.ui-button[${Be}="pressed"]`, kc = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Oc);
		t === null || C(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Ac = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${xn}, .ui-field-box`, jc = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${Ac}, ${bn}`;
function Mc(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(jc);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var Nc = "button, a, input, select, textarea, label, [tabindex], [contenteditable]", Pc = ":scope > input.ui-field, :scope > textarea.ui-field", Fc = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Ac);
		if (t === null || e.target !== t && e.target.closest(Nc) !== null) return;
		let n = t.querySelector(Pc);
		if (!di(n) || n.readOnly || C(n) || T(n)) return;
		e.preventDefault(), n.focus({ preventScroll: !0 });
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function k(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var Ic = class {
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
		ui(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(et);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${dn}="${CSS.escape(t)}"]`);
		n !== null && !C(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = va(e);
		e.blur(), this.changes === t && e.value !== this.valueOnFocus && e.dispatchEvent(new Event("change", { bubbles: !0 })), this.keepKeyboard(e, n);
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = Ji(e);
		r?.root === t && r.row !== null && Zi(t, k(t, Ci, Si), r.row), D(t);
	}
}, Lc = "data-ui-fallback-src", Rc = `img[${Lc}]`, zc = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Rc)) (Bc(e) || e.complete && e.naturalWidth === 0) && Vc(e);
		O(this.root, Rc, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && Bc(t) && Vc(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Vc(t);
	}
};
function Bc(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Vc(e) {
	let t = e.getAttribute(Lc);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Hc = "data-ui-radio-value", Uc = "ui-radio-group__input", Wc = "ui-radio-group__dot", Gc = "ui-radio-group", Kc = "ui-radio-group__item", qc = "data-ui-radio-group-name", Jc = "data-ui-radio-bind-value-id", Yc = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Gc}`)]);
		for (let e of this.root.querySelectorAll(`.${Gc}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Gc}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Xc));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Hc, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Gc}`)) {
			let n = e.getAttribute(qc);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(qc), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(qc, a);
			for (let e of k(r, `.${Uc}`, `.${Gc}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Gc}`)) n.has(e.getAttribute(qc) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Hc);
		for (let n of k(e, `.${Uc}`, `.${Gc}`)) {
			n.checked = n.value === t;
			let e = Zc(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Kc) ? [e] : [...e.querySelectorAll(`.${Kc}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Uc}`) !== null) return;
		let t = e.closest(`.${Gc}`), n = t?.getAttribute(qc);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Uc, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Jc);
		a !== null && r.setAttribute(Oe, a);
		let o = document.createElement("span");
		o.className = Wc, e.prepend(r, o), this.sync(t);
	}
};
function Xc(e) {
	return e.classList.contains(Gc) ? [e] : [...e.querySelectorAll(`.${Gc}`)];
}
function Zc(e) {
	let t = e.closest(`.${Kc}`);
	return t !== null && w(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Qc(e) {
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
function $c(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function el(e, t) {
	return t !== null && e.length >= t;
}
function tl(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : el(e, n) ? null : [...e, t];
}
function nl(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var rl = /\p{M}/gu;
function il(e, t) {
	return al(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function al(e, t) {
	return cl(e, sl(t));
}
function ol(e, t) {
	return t.every((t) => e.includes(t));
}
function sl(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function cl(e, t) {
	let n = e.normalize("NFD").replace(rl, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var ll = "data-ui-search-debounce", ul = "data-ui-search-min-length", dl = "data-ui-search-manual", fl = "data-ui-search-answered", pl = "ui-search__input", ml = "ui-select__popup", hl = "ui-select__option", gl = "ui-text__title", _l = 300, vl = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pl) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		yl(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(ll), i = r === null ? _l : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : _l));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(dl)) return;
		let t = e.getAttribute(ul), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function yl(e) {
	if (e.hasAttribute(fl)) return;
	let t = e.closest(`.${wn}`), n = t?.querySelector(`.${ml}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(ul), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? il(e.value, e) : [], o = xl(n, (e) => a.length === 0 || ol(al(bl(e), e), a));
	Tl(t, n, a.length > 0 && o === 0);
}
function bl(e) {
	return e.querySelector(`.${gl}`)?.textContent ?? e.textContent ?? "";
}
function xl(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Sl(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(hl)) continue;
		let e = t(a);
		Sl(a, e), r ||= e, e && i++;
	}
	return n !== null && Sl(n, r), i;
}
function Sl(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Cl(e) {
	let t = e.querySelector(`.${ml}`);
	t !== null && Tl(e, t, xl(t, (e) => e.style.display !== "none") === 0);
}
function wl(e) {
	let t = e.querySelector(`.${ml}`);
	t !== null && xl(t, () => !0);
}
function Tl(e, t, n) {
	let r = t.querySelector(`:scope > [${Ie}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Pe}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Ie, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var El = "data-ui-select-value", Dl = "data-ui-select-placement", Ol = "ui-select--open", kl = "ui-select__trigger-content", Al = "data-ui-select-content", jl = "ui-select__placeholder", Ml = "ui-input__affix-icon--prefix", Nl = "ui-select__popup", Pl = "ui-select__option", Fl = "ui-select__value-input", Il = "data-ui-select-clear", Ll = "data-ui-select-trigger-mode", Rl = "ui-search__input", zl = "ui-search-mode--replace", Bl = "ui-text__title", Vl = "data-ui-active", Hl = "ui-multi-select", Ul = "ui-multi-select__chips", Wl = "ui-multi-select__chip", Gl = "ui-multi-select__chip-label", Kl = "ui-multi-select__chip-remove", ql = "data-ui-select-chip", Jl = "data-ui-select-max", Yl = 4, Xl = [
	El,
	rn,
	Jl,
	"class",
	m
];
function Zl(e) {
	return e === null || T(e) || C(e);
}
function Ql(e) {
	return e.classList.contains(Hl);
}
function $l(e) {
	return e.querySelector(`.${xn}`)?.getAttribute(Ll) === "input";
}
function eu(e) {
	return k(e, `.${Nl} .${Pl}`, `.${wn}`);
}
function tu(e) {
	return e === null ? null : e.querySelector(`.${Bl}`)?.textContent ?? e.textContent;
}
function nu(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ce), t.removeAttribute(m), t.removeAttribute(ue), t.removeAttribute(le);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var ru = class {
	root;
	popups = new as({
		show: ({ owner: e }) => e.classList.add(Ol),
		hide: ({ owner: e }) => {
			e.classList.remove(Ol), this.markActive(e, null);
		}
	});
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${wn}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) cu(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Xl,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Il}], .${Kl}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Ql(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(El);
		this.decorateOptions(e);
		let n = t === null ? null : eu(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = tu(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${Rl}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(zl) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && wl(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${jl}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of eu(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${Fl}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), Cl(e);
	}
	syncMultiple(e) {
		let t = Qc(e.getAttribute(rn)), n = new Set(t), r = el(t, $c(e.getAttribute(Jl)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = eu(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		ou(e, o.map((e) => ({
			key: e,
			label: au(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${jl}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${Fl}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(rn, l), Cl(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${xn}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${kl}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(Al) === i) {
			r.removeAttribute(Al);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = kl;
			let e = n.querySelector(`:scope > .${Ml}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		nu(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of eu(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = w(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Rl)) return;
		let t = e.target.closest(`.${wn}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${Pl}`);
		t === null || n === null || n.hasAttribute(Vl) || w(n) || C(n) || n.closest(".ui-select") !== t || (E(eu(t).filter((e) => !w(e)), n), $l(t) || ha(n), this.markActive(t, n, !0));
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Rl)) return;
		let t = e.target, n = t.closest(`.${wn}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(zl)) return;
		let r = n.getAttribute(El);
		r !== null && (t.value = tu(eu(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Kl}`);
		if (t !== null) {
			let n = t.closest(`.${wn}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Zl(n) || this.removeChosen(n, t.closest(`.${Wl}`)?.getAttribute(ql) ?? null));
			return;
		}
		let n = e.target.closest(`[${Il}]`);
		if (n !== null) {
			let t = n.closest(`.${wn}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Zl(t) || (this.clearValue(t), iu(t)));
			return;
		}
		let r = e.target.closest(`.${xn}`);
		if (r !== null) {
			let t = r.closest(`.${wn}`);
			if (Zl(t) || r.getAttribute(Ll) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${Pl}`);
		if (i === null) return;
		let a = i.closest(`.${wn}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Pl}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${wn}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Ql(t) || Zl(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${Ul} > .${Wl}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(ql)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Rl) || !t.contains(e.target) ? null : eu(t).find((e) => e.hasAttribute(Vl) && !w(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close(), t || (wl(e), Cl(e));
		let n = e.querySelector(`.${xn}`), r = e.querySelector(`.${Nl}`), i = e.getAttribute(Dl);
		if (n === null || r === null) return;
		n.setAttribute("aria-controls", jn(r, "ui-select-popup"));
		let a = $l(e) ? e.querySelector(`.${Rl}`) ?? n : n;
		this.popups.open({
			owner: e,
			popup: r,
			anchor: n,
			placement: {
				placement: i !== null && uo(i) ? i : "bottom-start",
				gap: Yl,
				minAnchorWidth: !0
			},
			openers: [n],
			returnFocus: () => a
		}) && this.initializeFocus(e);
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e) {
		let t = eu(e).filter((e) => !w(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true");
		if (n === void 0 && pa()) {
			E(t, null), this.markActive(e, null), iu(e);
			return;
		}
		let r = n ?? t[0];
		if (E(t, r), this.markActive(e, r, pa()), $l(e)) {
			let t = e.querySelector(`.${Rl}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		D(r);
	}
	moveFocus(e, t) {
		let n = eu(e).filter((e) => !w(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(Vl)) ?? null, i = mi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (E(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of eu(e)) r === t ? r.setAttribute(Vl, "") : r.hasAttribute(Vl) && r.removeAttribute(Vl), ma(r, r === t && n);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || w(t) || Zl(e)) return;
		if (Ql(e)) {
			let r = tl(Qc(e.getAttribute(rn)), n, $c(e.getAttribute(Jl)));
			this.markActive(e, t, pa()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(El) === n) {
			this.close();
			return;
		}
		e.setAttribute(El, n), this.sync(e);
		let r = e.querySelector(`.${Fl}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : nl(Qc(e.getAttribute(rn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Wl}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${xn}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(rn) : e.setAttribute(rn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Fl}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Ql(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(El)) return;
		e.removeAttribute(El), this.sync(e);
		let t = e.querySelector(`.${Fl}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function iu(e) {
	let t = e.querySelector($l(e) ? `.${Rl}` : `.${xn}`);
	t !== null && !t.contains(document.activeElement) && D(t);
}
function au(e, t) {
	let n = tu(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function ou(e, t) {
	let n = e.querySelector(`.${Ul}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Wl}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(ql) === t[n].key && e.querySelector(`.${Gl}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => su(e.key, e.label)));
	}
}
function su(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Wl, n.setAttribute(ql, e), r.className = Gl, r.textContent = t, i.className = Kl, i.type = "button", i.tabIndex = -1, S.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function cu(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${wn}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === El || e.attributeName === "data-ui-selected-keys" || e.attributeName === Jl)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${Nl}`)?.closest(`.${wn}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var lu = "data-ui-input-debounce", uu = `input[${lu}], textarea[${lu}]`;
function du(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(uu);
}
var fu = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!du(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(lu));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!du(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, pu = "ui-slider__input", mu = "ui-slider__value", hu = "ui-slider__bubble", gu = "ui-slider__track", _u = "ui-slider__thumb-anchor", vu = "ui-slider", yu = "ui-orientation--vertical", bu = "--ui-slider-fraction", xu = 6, Su = "Value", Cu = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), wu = class {
	options;
	root;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Cu.has(e.propertyName)) return;
			let t = y(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${pu}`);
				t !== null && (this.writeReadings(t), e.propertyName === Su && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t != null && e.value !== String(t) && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pu) || this.writeReadings(e.target);
	}
	placeBubble(e) {
		let t = Tu(e);
		t !== null && bo(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: xu
		});
	}
	releaseBubble(e) {
		To(Tu(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${gu}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${mu}, .${hu}`) ?? []) n.textContent = e.value;
		e.closest(`.${gu}`)?.style.setProperty(bu, String(Eu(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Tu(e) {
	if (!(e instanceof Element) || !e.classList.contains(pu)) return null;
	let t = e.closest(`.${gu}`), n = t?.querySelector(`.${hu}`) ?? null, r = t?.querySelector(`.${_u}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${vu}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(yu)
	};
}
function Eu(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Du = {
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
}, Ou = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], ku = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Au = [
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
], ju = [
	"n %",
	"n%",
	"%n",
	"% n"
], Mu = [
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
function Nu(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Du;
	try {
		return {
			...Du,
			...JSON.parse(t)
		};
	} catch {
		return Du;
	}
}
function Pu(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Fu(t);
	if (r === null) return Iu(e, n);
	let i = e < 0, a = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let e = Lu(a, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return i ? Bu(Ou[n.negativePattern] ?? "-n", e, "", n.negativeSign) : e;
		}
		case "F": {
			let e = Lu(a, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return i ? n.negativeSign + e : e;
		}
		case "D": {
			let e = String(Ru(a, 0)).padStart(r.precision ?? 1, "0");
			return i ? n.negativeSign + e : e;
		}
		case "C": {
			let e = Lu(a, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Bu(i ? Au[n.currencyNegativePattern] ?? "-$n" : ku[n.currencyPositivePattern] ?? "$n", e, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let e = Lu(a * 100, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Bu(i ? Mu[n.percentNegativePattern] ?? "-n %" : ju[n.percentPositivePattern] ?? "n %", e, n.percentSymbol, n.negativeSign);
		}
		default: return Iu(e, n);
	}
}
function Fu(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function Iu(e, t) {
	let n = String(Math.abs(e)).replace(".", t.decimalSeparator);
	return e < 0 ? t.negativeSign + n : n;
}
function Lu(e, t, n, r, i) {
	let a = String(Ru(e, t)).padStart(t + 1, "0"), o = a.slice(0, a.length - t), s = a.slice(a.length - t);
	return t === 0 ? zu(o, n, r) : `${zu(o, n, r)}${i}${s}`;
}
function Ru(e, t) {
	return Math.round(Number((e * 10 ** t).toPrecision(15)));
}
function zu(e, t, n) {
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
function Bu(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var Vu = {
	readCulture: Nu,
	format: Pu
}, Hu = /^-?(\d+(\.\d*)?|\.\d+)$/;
function Uu(e, t, n) {
	if (!Hu.test(e)) return e;
	let r = n.thousands ? t : Yu(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return Pu(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return Pu(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function Wu(e, t, n) {
	return Hu.test(e) ? (Ju(n) ? Xu(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Gu(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Ju(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!Hu.test(d)) return null;
	let f = a ? Xu(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Ku(e, t, n, r, i) {
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
function qu(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Ju(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Yu(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Xu(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Zu = "ui-number-input", Qu = "ui-number-input__field", $u = "data-ui-number-no-decimals", ed = "data-ui-number-no-negative", td = "data-ui-number-no-thousands", nd = "data-ui-number-trim-zeros", rd = "data-ui-number-step", id = "data-ui-number-min", ad = "data-ui-number-max", od = "data-ui-number-step-direction", sd = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Qu}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(dr(e.components, `.${Qu}`));
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
		let t = this.values.get(e) ?? e.value, n = Nu(e), r = e === document.activeElement ? Wu(t, n, ld(e)) : Uu(t, n, {
			format: ld(e),
			thousands: !e.hasAttribute(td)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = cd(e.target);
		if (t === null) return;
		let n = !t.hasAttribute($u), r = !t.hasAttribute(ed), i = t.selectionStart ?? t.value.length, a = Ku(t.value, i, Nu(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = cd(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = cd(e.target);
		if (t === null) return;
		let n = this.shown.get(t) === t.value ? null : Gu(t.value, Nu(t), ld(t));
		if (n !== null && this.values.set(t, n), t.hasAttribute(nd)) {
			let e = this.values.get(t) ?? "", n = qu(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = cd(e.target);
		if (t === null) return;
		let n = Gu(t.value, Nu(t), ld(t));
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = cd(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = Wu(t, Nu(e), ld(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + od + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Qu}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(od) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = cd(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(rd) ?? "1"), r = Gu(e.value, Nu(e), ld(e)), i = (Number(this.shown.get(e) === e.value ? this.valueOf(e) : r ?? "0") || 0) + n * t, a = e.getAttribute(id), o = e.getAttribute(ad);
		a !== null && (i = Math.max(i, Number(a))), o !== null && (i = Math.min(i, Number(o))), this.commit(e, ud(i)), this.show(e);
	}
};
function cd(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Qu) ? e : null;
}
function ld(e) {
	return e.closest(`.${Zu}`)?.getAttribute("data-ui-number-format") ?? null;
}
function ud(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/rendering/temporal-format.ts
var dd = {
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
function fd(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return dd;
	try {
		return {
			...dd,
			...JSON.parse(t)
		};
	} catch {
		return dd;
	}
}
var pd = [
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
function md(e, t, n) {
	if (t == null || t.trim().length === 0) return `${vd(e.getFullYear(), 4)}-${vd(e.getMonth() + 1, 2)}-${vd(e.getDate(), 2)} ${vd(e.getHours(), 2)}:${vd(e.getMinutes(), 2)}:${vd(e.getSeconds(), 2)}`;
	let r = "", i = hd(t);
	for (let a = 0; a < t.length;) {
		let o = gd(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += _d(o, e, n, i), a += o.length;
	}
	return r;
}
function hd(e) {
	for (let t = 0; t < e.length;) {
		let n = gd(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function gd(e, t) {
	for (let n of pd) if (e.startsWith(n, t)) return n;
	return null;
}
function _d(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return vd(t.getFullYear(), 4);
		case "yy": return vd(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return vd(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return vd(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return vd(i, 2);
		case "H": return String(i);
		case "hh": return vd(a, 2);
		case "h": return String(a);
		case "mm": return vd(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return vd(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function vd(e, t) {
	return String(e).padStart(t, "0");
}
var yd = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function bd(e) {
	let t = yd.exec(e.trim());
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
function xd(e) {
	return new Date(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
var Sd = {
	readCulture: fd,
	format: md,
	parse: bd,
	toDate: xd
}, A = "ui-temporal-input", Cd = "ui-temporal-input__value-input", wd = "ui-temporal-input__end-value-input", Td = "data-ui-temporal-range", Ed = "data-ui-temporal-end", Dd = "data-ui-temporal-mode", Od = "data-ui-temporal-format", kd = "data-ui-temporal-default-format", Ad = "data-ui-temporal-min", jd = "data-ui-temporal-max", Md = "data-ui-temporal-step", Nd = "data-ui-temporal-step-unit", Pd = /* @__PURE__ */ new Set([
	Od,
	Ad,
	jd
]), Fd = 2e3;
function Id(e) {
	let t = e.getAttribute(Dd);
	return t === "time" || t === "date-time" ? t : "date";
}
function Ld(e) {
	let t = e.getAttribute(Od);
	return t === null || t.trim().length === 0 ? e.getAttribute(kd) ?? "" : t;
}
function Rd(e) {
	let t = e.getAttribute(Nd), n = Math.max(1, Math.trunc(Number(e.getAttribute(Md))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function zd(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Bd(e) {
	return {
		monthNames: Vd(e, "data-ui-temporal-months"),
		monthGenitiveNames: Vd(e, "data-ui-temporal-months-genitive"),
		abbreviatedMonthNames: Vd(e, "data-ui-temporal-months-short"),
		dayNames: Vd(e, "data-ui-temporal-daynames"),
		abbreviatedDayNames: Vd(e, "data-ui-temporal-weekdays"),
		amDesignator: e.getAttribute("data-ui-temporal-am") ?? "AM",
		pmDesignator: e.getAttribute("data-ui-temporal-pm") ?? "PM"
	};
}
function Vd(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Hd(e) {
	return e.hasAttribute(Td);
}
function Ud(e) {
	return e !== null && e.hasAttribute(Ed);
}
function Wd(e) {
	return j(e, !1);
}
function j(e, t) {
	let n = Gd(e, t);
	return n === null ? null : tf(n.value, Id(e));
}
function Gd(e, t) {
	return e.querySelector(`.${t ? wd : Cd}`);
}
function Kd(e, t) {
	return tf(e.getAttribute(t) ?? "", Id(e));
}
function qd(e, t, n) {
	let r = Gd(e, n);
	if (r === null) return;
	let i = t === null ? "" : nf(t, Id(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Jd(e) {
	if (!Hd(e)) return;
	let t = j(e, !1), n = j(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (qd(e, n, !1), qd(e, t, !0));
}
function Yd(e) {
	Xd(e, !1), Hd(e) && Xd(e, !0);
}
function Xd(e, t) {
	let n = j(e, t);
	if (n === null) return;
	let r = Qd(e, n);
	r.getTime() !== n.getTime() && qd(e, r, t);
}
function Zd(e) {
	return $d(e, Qd(e, /* @__PURE__ */ new Date()));
}
function Qd(e, t) {
	let n = Kd(e, Ad), r = Kd(e, jd);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function $d(e, t) {
	let n = Rd(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var ef = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function tf(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = ef.exec(n);
		return e === null ? null : new Date(Fd, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = bd(n);
	return r === null ? null : xd(r);
}
function nf(e, t) {
	let n = `${rf(e.getHours())}:${rf(e.getMinutes())}:${rf(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${rf(e.getMonth() + 1)}-${rf(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function rf(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function af(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = cf(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < lf(e.start).getTime() ? {
		start: cf(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: cf(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function of(e, t, n) {
	if (t === null || n === null) return !1;
	let r = lf(e).getTime();
	return r > lf(t).getTime() && r < lf(n).getTime();
}
function sf(e, t, n) {
	return !n && of(e, t.start, t.end);
}
function cf(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function lf(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
var uf = 100 / 3, df = 1, ff = 2;
function pf(e, t = uf) {
	let n = e.deltaMode === df ? uf : e.deltaMode === ff ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function mf(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var hf = {
	notch: 100,
	pixels: pf
}, gf = "ui-temporal-input__field", _f = "ui-temporal-input__popup", vf = "ui-temporal-input--open", yf = "ui-temporal-input__day", bf = "ui-temporal-input__month", M = "ui-temporal-input__time-cell", xf = "ui-temporal-input__time-column", Sf = 4, Cf = 140, wf = "data-ui-temporal-toggle", Tf = "data-ui-temporal-first-day", Ef = "data-ui-temporal-nav", Df = "data-ui-temporal-day", Of = "data-ui-temporal-unit", kf = "data-ui-temporal-cell", Af = "data-ui-temporal-centred", jf = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	popups = new as({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(vf), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderPopup(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(vf);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${A}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = dr(e.components, `.${A}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), O(this.root, `.${A}`, { attributeFilter: [...Pd] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), O(this.root, `.${A}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0);
	}
	get openPicker() {
		return this.popups.current;
	}
	applyDisplay(e) {
		for (let t of e) {
			Yd(t);
			for (let e of t.querySelectorAll(`.${gf}`)) {
				if (e === document.activeElement && this.written.has(e)) continue;
				this.written.add(e);
				let n = Gd(t, Ud(e))?.value ?? "", r = tf(n, Id(t));
				if (r !== null) {
					e.value = md(r, Ld(t), Bd(t));
					continue;
				}
				n.length === 0 && (e.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(gf)) return;
		let t = e.target.closest(`.${A}`), n = t === null ? null : Gd(t, Ud(e.target));
		t !== null && n !== null && (Ud(e.target) && (this.getState(t).choosingEnd = !1), n.value = e.target.value.trim(), n.dispatchEvent(new Event("change", { bubbles: !0 })), Jd(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(gf)) return;
		let t = e.target.closest(`.${A}`);
		t !== null && Hd(t) && (this.getState(t).activeEnd = Ud(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Df}]`) : null;
		if (n !== null && !t.contains(n) || !Hd(t)) return;
		let r = this.getState(t), i = n === null ? null : tf(n.getAttribute(Df) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Yf(t, r));
	}
	handlePointerMove(e) {
		let t = this.openPicker, n = e.target instanceof Element ? e.target.closest(`[${Df}], .${M}`) : null;
		t === null || n === null || !t.contains(n) || n === document.activeElement || n.matches(":disabled") || (n.classList.contains(M) ? ep(n) : this.followPointer(t, n));
	}
	followPointer(e, t) {
		let n = e.querySelector(`.${_f}`), r = tf(t.getAttribute(Df) ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, E([...n.querySelectorAll(`.${yf}`)], t), ha(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(gf)) return;
		let t = e.target.closest(`.${A}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${wf}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${A}`));
			return;
		}
		let n = e.target.closest(`.${_f}`)?.closest(`.${A}`);
		if (n == null) return;
		let r = e.target.closest(`[${Ef}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Ef) ?? "");
			return;
		}
		let i = e.target.closest(`[${Df}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(Df) ?? "");
			return;
		}
		let a = e.target.closest(`[${kf}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Of}]`)?.getAttribute(Of);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(kf)));
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
				n.view = fp(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = fp(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				n.choosingEnd = !1, this.commit(e, Zd(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Hd(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = tf(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (Hd(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = Wd(e) ?? Zd(e), a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = lp(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = Zd(e), i = af({
			start: j(e, !1),
			end: j(e, !0)
		}, t.activeEnd, Zf(n, r));
		t.focusedDay = i.end ?? i.start, t.view = lp(n), t.activeEnd = i.active, t.choosingEnd = !i.complete, t.hoverDay = null, qd(e, i.end, !0), qd(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Hd(e) && this.getState(e).activeEnd === "end", i = new Date(j(e, r) ?? Zd(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		qd(e, t, n), Jd(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(gf)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${A}`), Ud(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(M)) {
			tp(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(yf)) return;
		let n = tf(e.target.getAttribute(Df) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, nf(n, "date"));
			return;
		}
		let r = cp(n, e.key, sp(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = lp(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xf}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Cf)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xf}`), n = t?.getAttribute(Of) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = mf(this.wheelTurns.get(n) ?? 0, pf(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${M}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${M}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${M}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(kf)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Af));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(Of), i = Uf(e);
		if (!(r === null || i === null || i.classList.contains(`${M}--selected`))) {
			if (i.matches(":disabled")) {
				Vf(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(kf)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${_f}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Hd(e) ? t ?? (j(e, !1) === null ? "start" : j(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = j(e, r.activeEnd === "end") ?? Wd(e);
		r.pane = "days", r.view = lp(i ?? Qd(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${wf}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: Sf
			},
			openers: a === null ? [] : [a],
			returnFocus: () => Xf(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: lp(Wd(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: Wd(e),
			activeEnd: "start",
			hoverDay: null,
			choosingEnd: !1
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${_f}`);
		if (n === null) return;
		let r = Id(e), i = this.getState(e), a = Bd(e), o = Hd(e), s = j(e, o && i.activeEnd === "end"), c = Wf(n), l = Gf(n), u = n.contains(document.activeElement);
		n.replaceChildren(), o && n.append(Jf(i));
		let d = N("div", `${A}__panes`);
		d.append(Mf(e, i, a, s)), r === "date-time" && d.append(Ff(e, s)), n.append(d, qf(r));
		let f = l === null ? null : n.querySelector(`[${Ef}="${CSS.escape(l)}"]`);
		$f(n, i, s, t || u && c === null && f === null), Yf(e, i), Bf(n), Vf(n), Kf(n, c), f !== null && D(f), this.popups.reposition(e);
	}
};
function Mf(e, t, n, r) {
	let i = N("div", `${A}__calendar`), a = N("div", `${A}__calendar-header`);
	a.append(Qf("previous", "‹", S.text("ui.picker.previous")));
	let o = Qf("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${A}__calendar-label`), a.append(o), a.append(Qf("next", "›", S.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? Nf(e, t, n, r) : Pf(t, n)), i;
}
function Nf(e, t, n, r) {
	let i = sp(e), a = N("div", `${A}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = N("span", `${A}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = N("div", `${A}__days`), s = lf(/* @__PURE__ */ new Date()), c = Hd(e), l = c ? j(e, !1) : r, u = c ? j(e, !0) : null, d = up(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = dp(d, n), i = N("button", yf);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(Df, nf(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${yf}--outside`), pp(r, s) && i.classList.add(`${yf}--today`), (l !== null && pp(r, l) || u !== null && pp(r, u)) && (i.classList.add(`${yf}--selected`), i.setAttribute("aria-selected", "true")), sf(r, {
			start: l,
			end: u
		}, t.choosingEnd) && i.classList.add(`${yf}--within`), ap(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = N("div", `${A}__calendar-pane`);
	return f.append(a, o), f;
}
function Pf(e, t) {
	let n = N("div", `${A}__months`);
	for (let r = 0; r < 12; r++) {
		let i = N("button", bf);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Ef, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${bf}--selected`), n.append(i);
	}
	return n;
}
function Ff(e, t) {
	let n = Rd(e), r = N("div", `${A}__time`), i = N("div", `${A}__time-columns`);
	for (let r of If(n)) i.append(zf(e, r, Lf(n, r), t));
	return r.append(i), r;
}
function If(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Lf(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Rf(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function zf(e, t, n, r) {
	let i = N("div", xf);
	i.setAttribute(Of, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", S.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = Rf(r, t), s = null;
	for (let c = 0; c < a; c += n) {
		let n = N("button", M);
		n.type = "button", n.tabIndex = -1, n.textContent = String(c).padStart(2, "0"), n.setAttribute(kf, String(c)), c === o && (n.classList.add(`${M}--selected`), n.setAttribute("aria-selected", "true")), op(e, t, c, r) ? n.disabled = !0 : (s === null || c === o) && (s = n), i.append(n);
	}
	return s !== null && (s.tabIndex = 0), i;
}
function Bf(e) {
	let t = e.querySelector(`.${A}__calendar`), n = e.querySelector(`.${A}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Vf(e) {
	for (let t of e.querySelectorAll(`.${xf}`)) {
		let e = t.querySelector(`.${M}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, Hf(t, e), t.setAttribute(Af, String(t.scrollTop));
	}
}
function Hf(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function Uf(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${M}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Wf(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(M) ? null : t.closest(`.${xf}`)?.getAttribute(Of) ?? null;
}
function Gf(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Ef) : null;
}
function Kf(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${xf}[${Of}="${t}"]`)?.querySelector(`.${M}--selected`) ?? null;
	n !== null && D(n);
}
function qf(e) {
	let t = N("div", `${A}__popup-footer`);
	return t.append(Qf("now", S.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Qf("clear", S.text("ui.picker.clear"))), t.append(Qf("done", S.text("ui.picker.done"))), t;
}
function Jf(e) {
	let t = N("div", `${A}__period-caption`);
	return t.textContent = S.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Yf(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? j(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${yf}`)) {
		let e = tf(t.getAttribute(Df) ?? "", "date");
		t.classList.toggle(`${yf}--preview`, e !== null && n !== null && r !== null && of(e, n, dp(r, 1)));
	}
}
function Xf(e, t) {
	for (let n of e.querySelectorAll(`.${gf}`)) if (Ud(n) === t) return n;
	return e.querySelector(`.${gf}`);
}
function Zf(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Qf(e, t, n) {
	let r = N("button", `${A}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Ef, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function N(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function $f(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${yf}`)];
	if (i.length === 0) return;
	let a = nf(lf(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(Df) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (E(i, o), r && D(o));
}
function ep(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(M) && ha(e);
}
function tp(e) {
	let t = e.target, n = t.closest(`.${xf}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? rp(n, e.key === "ArrowRight" ? 1 : -1) : np(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), ip(r));
}
function np(e, t, n) {
	return mi({
		key: n,
		items: [...e.querySelectorAll(`.${M}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function rp(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${xf}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${M}--selected`) ?? r.querySelector(`.${M}:not(:disabled)`);
}
function ip(e) {
	let t = e.closest(`.${xf}`);
	t !== null && Hf(t, e);
}
function ap(e, t) {
	let n = Kd(e, Ad), r = Kd(e, jd);
	return n !== null && t.getTime() < lf(n).getTime() || r !== null && t.getTime() > lf(r).getTime();
}
function op(e, t, n, r) {
	let i = Kd(e, Ad), a = Kd(e, jd);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function sp(e) {
	let t = Number(e.getAttribute(Tf));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function cp(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return dp(e, -1);
		case "ArrowRight": return dp(e, 1);
		case "ArrowUp": return dp(e, -7);
		case "ArrowDown": return dp(e, 7);
		case "PageUp": return fp(e, -1);
		case "PageDown": return fp(e, 1);
		case "Home": return dp(e, -r);
		case "End": return dp(e, 6 - r);
		default: return null;
	}
}
function lp(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function up(e, t) {
	let n = lp(e);
	return dp(n, -((n.getDay() - t + 7) % 7));
}
function dp(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function fp(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth() + t, 1), r = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return new Date(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function pp(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var mp = "[data-ui-theme-switcher]", hp = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(mp) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Nn.SetTheme,
				mode: gp() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function gp() {
	let e = document.documentElement.getAttribute(Jt);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var _p = `[${Xt}]`, vp = "ui-language-switcher__trigger", yp = "ui-language-switcher__label-text", bp = "ui-language-switcher__label-text--current", xp = "ui-language-switcher__label-text--page", Sp = "ui-language-switcher__menu", Cp = "ui-language-switcher__choice", wp = "ui-language-switcher--open", Tp = 4, Ep = "ui.language.switch", Dp = class {
	options;
	root;
	menus = new as({
		show: ({ owner: e }) => e.classList.add(wp),
		hide: ({ owner: e }) => e.classList.remove(wp),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), S.onChange(() => this.showLanguage(S.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cp}`), n = e.target.closest(_p);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Zt));
			return;
		}
		let r = e.target.closest(`.${vp}`);
		if (r === null || C(r)) return;
		e.preventDefault();
		let i = Op(n);
		if (i.length === 2) {
			let e = S.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(_p);
		if (t === null) return;
		let n = Op(t), r = e.target.closest(`.${vp}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !hi(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = mi({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cp}`);
		if (t === null || t === document.activeElement || C(t)) return;
		let n = t.closest(_p);
		n !== null && this.menus.isOpen(n) && ha(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${Sp}`);
		if (r === null) return;
		let i = Op(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Tp
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && ba(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Nn.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(_p)) {
			let n = t.querySelector(`:scope > .${vp}`);
			if (n === null) continue;
			for (let n of Op(t)) n.setAttribute("aria-checked", n.getAttribute("data-ui-language") === e ? "true" : "false");
			let r = e.toUpperCase();
			for (let t of n.querySelectorAll(`.${yp}`)) {
				let n = t.getAttribute(Zt) === e;
				t.classList.toggle(bp, n), t.classList.contains(xp) && t.toggleAttribute("hidden", !n), n && (r = t.textContent ?? r);
			}
			S.write(n, "aria-label", Ep, { language: r });
		}
	}
};
function Op(e) {
	return [...e.querySelectorAll(`:scope > .${Sp} > .${Cp}`)];
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var kp = "data-ui-context-menu-owner", Ap = ye, jp = "ui-context-menu--open", Mp = "ui-menu", Np = `.ui-menu-item:not(${mt})`, Pp = "ui-context-menu-opening", Fp = gt, Ip = class {
	root;
	closed = null;
	menus = new as({
		show: ({ popup: e }) => e.classList.add(jp),
		hide: ({ popup: e }, t) => {
			e.classList.remove(jp), this.closed = e, t === "outside" && Rp();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let n = t.closest(`[${he}]`), r = t.closest(`[${be}]`);
		for (let i = t.closest(`[${kp}]`); i !== null; i = i.parentElement?.closest(`[${kp}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute("data-ui-context-menu-use") ?? "" : "", o = [a.length > 0 ? zp(i, a) : null, zp(i, "")].filter((e) => e !== null);
			if (o.length === 0 || C(i)) continue;
			if (Bp(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.open(i, s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(Pp, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n, r) {
		this.menus.close(), this.closed !== null && (co(this.closed), this.closed = null);
		let i = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? fa();
		if (!this.menus.open({
			owner: e,
			popup: t,
			returnFocus: () => (i === null ? null : xa(i)) ?? xa(e)
		})) return;
		let a = t.getBoundingClientRect();
		t.style.left = `${Vo(n, a.width, window.innerWidth)}px`, t.style.top = `${Vo(r, a.height, window.innerHeight)}px`, Lp(t);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Fp) !== null || this.menus.close();
	}
};
function Lp(e) {
	let t = e.querySelector(`.${Mp}`);
	t !== null && ba(e, k(t, Np, `.${Mp}`));
}
function Rp() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${ra}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function zp(e, t) {
	for (let n of e.querySelectorAll(`[${Ap}]`)) if ((n.getAttribute(Ap) ?? "") === t && n.closest(`[${kp}]`) === e) return n;
	return null;
}
function Bp(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Vp(e) {
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
		default: o = qp(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Hp(e, t, n = Wp()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var Up = null;
function Wp() {
	return Up === null && (Up = Gp()), Up;
}
function Gp() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function Kp(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function qp(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Jp[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Jp[t] ?? null;
}
var Jp = {
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
}, Yp = "ui-menu", Xp = "ui-menu-item--selected", Zp = "ui-context-menu", Qp = "ui-orientation--horizontal", $p = "data-ui-menu-shortcut", em = "[role='menuitem'], [role='menuitemcheckbox']", tm = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(rm) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [$p, ct]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Yp}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && E(t, t.find((e) => e.classList.contains(Xp) && _i(e)) ?? t.find(_i) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${g}`), n = t?.closest(`.${Yp}`) ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			nm(e, t);
			return;
		}
		let r = this.ownItems(n), i = mi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Qp) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), E(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(`.${Yp}`) ? t : t.querySelector(`.${Yp}`);
		if (n === null) return;
		let r = this.ownItems(n), i = mi({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(Qp) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), E(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${g}`), n = t?.closest(`.${Yp}`) ?? null;
		t !== null && n !== null && E(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${g}`) : null;
		if (t === null || t === document.activeElement || !t.matches(em) || t.matches(mt) || !_i(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(`.${Yp}`)?.contains(n) === !0) && ha(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || im(e))) return;
		let t = qo(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !Hp(n.shortcut, e))) {
			if (!_i(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${$p}]`)) {
			if (e.closest(`.${Zp}`) !== null) continue;
			let t = Vp(e.getAttribute($p));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute($p)
				});
				continue;
			}
			let n = Kp(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute($p),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return k(e, `.${g}:not(${mt})`, `.${Yp}`);
	}
};
function nm(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(mt) || !_i(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function rm(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${Yp}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(Yp) || t.querySelector(`.${Yp}`) !== null)) return !0;
	return !1;
}
function im(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var am = "ne.ui", om = "boot", sm = /* @__PURE__ */ new Set(), cm = class {
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
		let r = this.resolveKey(e, om);
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
		let n = e.getAttribute(Te);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return sm.has(n) || (sm.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${am}:${n}:${t}`;
	}
}, lm = "ui-menu", um = "ui-menu--nested", dm = "ui-menu-item--selected", fm = "ui-menu__submenu", pm = rt, mm = at, hm = "data-ui-menu-flyout", gm = "data-ui-menu-unfolded", _m = it, vm = "menu-open-group", ym = class {
	root;
	store = new cm();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new as({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(mm, ""), t.setAttribute(hm, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(mm), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(hm);
			}, oo.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${lm}`)), O(this.root, `.${lm}`, {
			childList: !0,
			attributeFilter: [nt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${pm}]`)) bm(e);
		O(this.root, `[${pm}]`, {
			childList: !0,
			attributeFilter: [mm]
		}, (e) => {
			for (let t of e) bm(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Sm(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), xm(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${pm}]`)) bm(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${dm}`), e);
		if (t !== null && !t.hasAttribute(_m)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(um) ? null : this.store.read(e, vm), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${g}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			t.getAttribute("data-ui-menu-item-kind") !== "check" && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${lm}`);
		a !== null && (Sm(a) || i.hasAttribute(_m) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(um);
		if (e.setAttribute(gm, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(mm);
			return;
		}
		if (t.hasAttribute(mm)) {
			t.removeAttribute(mm), n || this.store.write(e, vm, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, vm, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(mm, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${pm}][${mm}]`)) t.hasAttribute(_m) || t.removeAttribute(mm);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (xm(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: "right-start",
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${lm}`);
		a !== null && !pa() && ba(a, k(a, `.${g}:not(${mt})`, `.${lm}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${pm}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(ht) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${pm}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${fm}`);
	}
};
function bm(e) {
	let t = e.querySelector(`:scope > .${g}`), n = e.closest(`.${lm}`);
	t !== null && (t.setAttribute("aria-expanded", e.hasAttribute(mm) ? "true" : "false"), e.hasAttribute(_m) || n !== null && Sm(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function xm(e) {
	for (let t of e.querySelectorAll(`[${hm}]`)) t.removeAttribute(hm);
}
function Sm(e) {
	return e.hasAttribute(nt);
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Cm = `.ui-menu[${ot}]`, wm = ":scope > .ui-collapsible__bar", Tm = ":scope > .ui-menu__host", Em = "ui-menu__item", Dm = `:scope > .${g}`, Om = ".ui-text__title", km = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", Am = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), O(t, Cm, {
			childList: !0,
			characterData: !0,
			attributeFilter: [nt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = jm(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(Tm);
		if (n === null) return;
		let r = il(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: Mm(n)
		}), e.setAttribute(st, ""), this.filter(n, r);
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of Nm(e)) {
			let e = Pm(a);
			if (e === "header") {
				n !== null && Im(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			Im(a, o), r ||= o, i ||= o;
		}
		return n !== null && Im(n, r), i;
	}
	match(e, t) {
		let n = ol(Fm(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(km) : null;
		if (r === null) return n;
		if (n) return Lm(r), e.removeAttribute(at), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(at, i), i;
	}
	clear(e, t) {
		Lm(t), e.removeAttribute(st);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(nt);
		for (let e of t.querySelectorAll(`[${rt}]:not([${it}])`)) e.toggleAttribute(at, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...jm(e.target)?.querySelector(Tm)?.querySelectorAll(`.ui-menu-item:not(${mt})`) ?? []].find(_i);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function jm(e) {
	let t = e.closest(Cm), n = t?.querySelector(wm) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function Mm(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${rt}][${at}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function Nm(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(Em));
}
function Pm(e) {
	return e.querySelector(Dm)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function Fm(e) {
	return al(e.querySelector(Dm)?.querySelector(Om)?.textContent ?? "", e);
}
function Im(e, t) {
	e.toggleAttribute(ct, !t);
}
function Lm(e) {
	for (let t of e.querySelectorAll(`[${ct}]`)) t.removeAttribute(ct);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Rm = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], zm = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Bm(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${zm[t]}px)`)) return t;
	return "base";
}
function Vm(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function P(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Hm(e, t) {
	let n;
	for (let r of Rm) {
		let i = P(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var Um = "[data-ui-root]", Wm = "a[href]", Gm = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${zm.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${lt}]`);
		if (t !== null) {
			let e = t.closest(Um), n = t.getAttribute(lt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(Wm)?.closest(`[${dt}]`), r = n?.parentElement ?? null;
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
		e.setAttribute(ut, t), this.markToggles(e);
		let n = Km(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, pa(), performance.now() + oo.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(yn, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (ya(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${Um}[${ut}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(ut);
		if (e.removeAttribute(ut), this.markToggles(e), t === null) return;
		let n = Km(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let n = e.querySelector(`[${lt}="${CSS.escape(t)}"]`);
			n !== null && D(n);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(ut);
		for (let n of e.querySelectorAll(`[${lt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(lt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(yn), t && e.removeAttribute("tabindex"));
	}
};
function Km(e, t) {
	return e.querySelector(`:scope > [${dt}="${CSS.escape(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var qm = "ui-collapsible", Jm = "ui-collapsible__content", Ym = "ui-collapsible__bar", Xm = "collapsed", Zm = class {
	root;
	store = new cm();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${qm}`)), O(this.root, `.${qm}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, Xm);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${_t}]`), n = t?.closest(`.${qm}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(nt), i = n.querySelector(`:scope > .${Jm}`);
		this.cancelFold(n);
		let a = $m(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Xm, r ? "true" : "false", r ? { attributes: { [nt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(nt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${_t}], :scope > .${Ym} > [${_t}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || so()) return;
		let i = th(Qm(e), n, $m(e, t), r);
		if (i === null) return;
		e.setAttribute(vt, "");
		let a = {
			duration: oo.normal,
			easing: oo.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(vt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(vt);
			for (let e of t) e.cancel();
		}
	}
};
function Qm(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function $m(e, t) {
	let n = Qm(e), r = eh(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function eh(e) {
	return e === "width" ? "height" : "width";
}
function th(e, t, n, r) {
	let i = eh(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
	if (!a && !o) return null;
	let s = r ? t : n, c = (r ? n.content : t.content) === 0, l = (t) => o ? {
		[e]: `${t.component}px`,
		[i]: `${t.componentAcross}px`
	} : { [e]: `${t.component}px` }, u = o ? {
		[e]: `${s.content}px`,
		[i]: `${s.contentAcross}px`,
		visibility: "visible"
	} : {
		[e]: `${s.content}px`,
		visibility: "visible"
	};
	return {
		component: [l(t), l(n)],
		content: [{
			...u,
			opacity: c && !r ? 0 : 1
		}, {
			...u,
			opacity: c && r ? 0 : 1
		}]
	};
}
//#endregion
//#region src/interactions/pointer-drag.ts
var nh = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), window.addEventListener("keydown", (e) => this.handleKeyDown(e), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element) || this.drag !== null) return;
		let t = this.options.resolveHandle(e.target);
		if (t === null || C(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(Qt, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 }), this.drag = {
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
		this.drag = null, t.removeAttribute(Qt), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(Qt);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
//#endregion
//#region src/interactions/grid-tracks.ts
function rh(e) {
	let t = [];
	for (let n of oh(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = rh(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = ih(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function ih(e) {
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
	if (n !== null) return ah({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return ah(r[3] === "fr" ? {
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
function ah(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function oh(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function sh(e, t = "auto") {
	return e.map((e) => ch(e, t)).join(" ");
}
function ch(e, t) {
	switch (e.kind) {
		case "px": return `${lh(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${lh(e.min)}px`}, ${lh(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${lh(e.max)}px)` : `minmax(${lh(e.min)}px, auto)`;
	}
}
function lh(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function uh(e) {
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
function dh(e, t) {
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
function fh(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = ph(r, e), o = ph(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function ph(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function mh(e, t, n, r) {
	let i = hh(e, t, n.before), a = hh(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = bh(n.before, e) + bh(n.after, e), r = i.total + a.total;
		gh(l, e, i, t * (i.total + c) / r), gh(l, e, a, t * (a.total - c) / r);
	} else u || _h(l, i, i.total + c), d || _h(l, a, a.total - c);
	return l;
}
function hh(e, t, n) {
	let r = yh(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function gh(e, t, n, r) {
	let i = bh(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function _h(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...vh(e[i])
		};
	}
}
function vh(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function yh(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function bh(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function xh(e, t) {
	let n = yh(t.before, e), r = n + yh(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Sh(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function Ch(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var wh = "ui-grid-splitter", Th = "ui-container", Eh = "ui-orientation--vertical", Dh = 16, Oh = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: yt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, kh = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: bt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Ah = class {
	root;
	store = new cm();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new nh({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${wh}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${wh}`)), O(this.root, `.${wh}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = jh(t);
			e !== null && (this.restore(e, Mh(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Rm) {
			let i = r[n], a = Vm(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wh}`);
		if (t === null || this.drag.active || C(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Lh(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${wh}`), n = t === null ? null : jh(t);
		if (t === null || n === null) return;
		let r = Mh(t);
		for (let e of Rm) n.style.removeProperty(Vm(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = mh(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Vm(e.axis.split, e.tier), sh(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Rm) {
			let a = Vm(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = jh(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Mh(e), r = Bm(), i = Nh(t, n, r), a = i === null ? null : rh(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = dh(a, uh(t.getAttribute(n.limits))), s = Ph(t, n), c = Fh(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = fh(c, Ih(t, n).map((e) => Fh(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = jh(e);
		if (t === null) return;
		let n = Mh(e), r = Fh(e, n), i = Ph(t, n), a = Ih(t, n).map((e) => Fh(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : fh(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(xh(i, o))));
	}
};
function jh(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(Th) ? t : null;
}
function Mh(e) {
	return e.classList.contains(Eh) ? Oh : kh;
}
function Nh(e, t, n) {
	for (let r = Rm.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(Vm(t.split, Rm[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function Ph(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Fh(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Ih(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(wh) && Mh(r) === t && n.push(r);
	return n;
}
function Lh(e) {
	let t = Number(e.getAttribute(xt));
	return Number.isFinite(t) && t > 0 ? t : Dh;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Rh = "ui-split-button", zh = "ui-split-button__main", Bh = "ui-split-button__toggle", Vh = "ui-split-button__menu", Hh = "ui-split-button--open", Uh = "ui-menu", Wh = 4, Gh = class {
	root;
	menus = new as({
		show: ({ owner: e }) => e.classList.add(Hh),
		hide: ({ owner: e }) => e.classList.remove(Hh),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Kh(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${zh}`)?.closest(`.${Rh}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Kh(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = qh(t), r = e.target.closest(`.${g}`);
		n === null || r === null || !n.contains(r) || r.matches(`${mt}, ${gt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = qh(e), r = n?.querySelector(`.${Uh}`) ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Wh
			},
			openers: Jh(e)
		}) && ba(r, k(r, `.${g}:not(${mt})`, `.${Uh}`), t);
	}
};
function Kh(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Bh}, .${zh}`), n = t?.closest(`.${Rh}`) ?? null;
	return t === null || n === null || t.classList.contains(zh) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function qh(e) {
	return e.querySelector(`:scope > .${Vh}`);
}
function Jh(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Yh = "ui-button-group", Xh = "ui-button-group__item", Zh = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Yh}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), O(this.root, `.${Yh}`, {
			childList: !0,
			attributeFilter: [nn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Qh(i);
			i.toggleAttribute(tn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		E(n, r ?? n.find(_i) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xh}`), n = t?.closest(`.${Yh}`) ?? null;
		if (t === null || n === null || t.closest(`.${Yh}`) !== n || C(n)) return;
		let r = Qh(t);
		r !== null && C(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xh} > .${Cn}`), n = t?.closest(`.${Yh}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Qh).filter((e) => e !== null), i = mi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Xh}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		bi(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: nn,
			bindingAttribute: an,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return k(e, `.${Xh}`, `.${Yh}`);
	}
};
function Qh(e) {
	return e.querySelector(`:scope > .${Cn}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var $h = "ui-accordion", eg = "details", tg = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${$h}`)), O(this.root, `.${$h}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains($h))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${eg}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function ng(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var rg = "ui-tab-overflow", ig = "ui-tab-overflow__menu", ag = "ui-tab-overflow__menu--open", og = "ui-tab-overflow__entry", sg = "ui-tab-overflow__entry--current", cg = class {
	options;
	list;
	fittedWidths = /* @__PURE__ */ new WeakMap();
	wraps = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) {
			let e = n.target.closest(`.${this.options.rootClass}`);
			e !== null && this.fittedWidths.get(n.target) !== n.contentRect.width && (this.fittedWidths.set(n.target, n.contentRect.width), t.add(e));
		}
		for (let e of t) this.options.refit(e);
	}) : null;
	switches = typeof MutationObserver == "function" ? new MutationObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) n.target instanceof HTMLElement && this.wraps.get(n.target) !== this.options.wraps(n.target) && t.add(n.target);
		for (let e of t) this.options.refit(e);
	}) : null;
	constructor(e) {
		this.options = e, this.list = new dg(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class"] });
		let n = this.options.wraps(e);
		if (this.wraps.set(e, n), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : lg({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return ug(e, this.options.hiddenClass, t);
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
function lg(e) {
	for (let t of e.captions) t.classList.remove(e.hiddenClass);
	let t = e.captions.map((e) => e.getBoundingClientRect().width), n = 0;
	for (let e of t) n += e;
	if (n <= e.room.clientWidth) return !1;
	e.showButton();
	let r = e.room.clientWidth - e.button.getBoundingClientRect().width, i = e.selected === null ? 0 : t[e.captions.indexOf(e.selected)] ?? 0;
	for (let n = 0; n < e.captions.length; n++) {
		let a = e.captions[n];
		a !== e.selected && (i + t[n] <= r ? i += t[n] : a.classList.add(e.hiddenClass));
	}
	return !0;
}
function ug(e, t, n) {
	for (let n of e.captions) n.classList.remove(t);
	let r = getComputedStyle(e.room), i = r.direction === "rtl", a = Number.parseFloat(r.paddingLeft) || 0, o = Number.parseFloat(r.paddingRight) || 0, s = e.room.getBoundingClientRect(), c = i ? s.right - e.room.clientLeft - o : s.left + e.room.clientLeft + a, l = e.room.clientWidth - a - o, u = e.captions.map((e) => {
		let t = e.getBoundingClientRect();
		return i ? c - t.left : t.right - c;
	});
	if (u.every((e) => e <= l)) return !1;
	n();
	let d = e.button.getBoundingClientRect(), f = getComputedStyle(e.button), p = Number.parseFloat(i ? f.marginRight : f.marginLeft) || 0, ee = (i ? c - d.right : d.left - c) - p, te = !1;
	for (let n = 0; n < e.captions.length; n++) te ||= u[n] > ee, te && e.captions[n].classList.add(t);
	return !0;
}
var dg = class {
	menu;
	button = null;
	list = new as({
		show: ({ popup: e }) => e.classList.add(ag),
		hide: ({ popup: e }) => {
			e.classList.remove(ag), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = ig, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(fg)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${sg}`);
		r !== null && E(this.entries(), r), this.button = e, this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: 4
			},
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && ba(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${og}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || C(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = mi({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), E(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${og}`) : null;
		t === null || t === document.activeElement || C(t) || (E(this.entries(), t), ha(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${og}`));
	}
};
function fg(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${og} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(sg, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(pn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var pg = "ui-tabs", mg = "ui-tab-header", hg = "ui-tab-header--selected", gg = "ui-tab-header--overflowed", _g = "ui-tabs--overflowing", vg = "ui-tabs--no-overflow", yg = "ui-tabs__strip", bg = "data-ui-tab-key", xg = "data-ui-tab-page", Sg = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new cg({
			rootClass: pg,
			overflowingClass: _g,
			wraps: (e) => e.classList.contains(vg),
			hiddenClass: gg,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${pg}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), O(this.root, `.${pg}`, {
			childList: !0,
			attributeFilter: [on, ...un],
			relevant: (e) => !Wo(e, `[${xg}]`, `.${pg}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(bg) ?? "") === t) ?? null;
		if (r !== null && !Cg(r)) {
			let t = n.find(Cg);
			if (t !== void 0) {
				this.select(e, t.getAttribute(bg) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(bg) ?? "") === t;
			e.classList.toggle(hg, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(Cg), i), E(n.filter((e) => !e.classList.contains(gg)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(xg) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${yg}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(bg) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(Cg).map((e) => {
				let n = e.getAttribute(bg) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: C(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${rg}`), n = t?.closest(`.${pg}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${pg}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${mg}`);
		if (r === null || C(r)) return;
		let i = r.closest(`.${pg}`), a = r.getAttribute(bg);
		i !== null && a !== null && r.closest(`.${pg}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mg}`), n = t?.closest(`.${pg}`) ?? null;
		if (t === null || n === null) return;
		let r = mi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(bg) ?? ""), r.focus());
	}
	select(e, t) {
		bi(e, t, {
			attribute: on,
			bindingAttribute: an,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return k(e, `.${mg}`, `.${pg}`);
	}
	ownPages(e) {
		return k(e, `[${xg}]`, `.${pg}`);
	}
};
function Cg(e) {
	return e.classList.contains(gg) || ng(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var wg = "ui-command-bar", Tg = "ui-command-bar__host", Eg = "ui-command-bar__item", Dg = "ui-command-bar__overflow", Og = "ui-command-bar--overflowing", kg = "ui-command-bar__overflowed", Ag = "ui-text__title", jg = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new cg({
			rootClass: wg,
			overflowingClass: Og,
			wraps: (e) => !Ng(e),
			hiddenClass: kg,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${wg}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), O(this.root, `.${wg}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = Mg(e), n = e.querySelector(`:scope > .${Dg}`);
		if (t === null || n === null) return;
		let r = Pg(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(Og) && Fg(r);
		for (let e of r) yo(e, e.classList.contains(kg) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dg}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(wg) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = Mg(e), n = t === null ? [] : Pg(t).filter((e) => e.classList.contains(Eg) && e.classList.contains(kg)).map((e) => e.querySelector(_) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: Ig(e),
			current: !1,
			disabled: C(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !C(n) && Lg(n).click();
	}
};
function Mg(e) {
	return e.querySelector(`:scope > .${Tg}`);
}
function Ng(e) {
	let t = Mg(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function Pg(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(Eg) ? n.querySelector(_) : null;
		e !== null && ng(e) && t.push(n);
	}
	return t;
}
function Fg(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(Eg) ? t ||= !r.classList.contains(kg) : t || r.classList.add(kg);
	}
}
function Ig(e) {
	let t = Lg(e), n = t.querySelector(`.${Ag}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function Lg(e) {
	return e.matches(ra) ? e : e.querySelector(ra) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var Rg = "ui-breadcrumbs", zg = "ui-breadcrumbs__item", Bg = "ui-breadcrumb", Vg = "ui-breadcrumb--current", Hg = "ui-hidden", Ug = "data-ui-step-collapsed", Wg = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), O(this.root, `.${Rg}`, {
			childList: !0,
			attributeFilter: ["class", ...un]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Rg}`)) this.apply(e);
	}
	apply(e) {
		let t = k(e, `.${zg}`, `.${Rg}`);
		for (let e of t) Gg(e);
		let n = t.filter((e) => !e.classList.contains(Hg)).map((e) => e.querySelector(`.${Bg}`)).filter((e) => e !== null && !e.classList.contains(Hg)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(Vg, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function Gg(e) {
	let t = e.querySelector(`:scope > .${Bg}`), n = t === null ? "" : un.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === un[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(Ug) : e.getAttribute(Ug) !== n && e.setAttribute(Ug, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function F(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function Kg(e) {
	return F(e).toString(16).padStart(2, "0").toUpperCase();
}
function qg(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return Jg(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function Jg(e, t, n) {
	return .2126 * Yg(e) + .7152 * Yg(t) + .0722 * Yg(n);
}
function Yg(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var Xg = "ui-color-input", Zg = "ui-color-input--open", Qg = "ui-color-input__popup", $g = "ui-color-input__text", e_ = "ui-color-input__row", t_ = "ui-color-input__swatch--button", n_ = "ui-color-input__value-input", r_ = "ui-color-input__square-thumb", i_ = "ui-color-input__hue-thumb", a_ = "data-ui-color-toggle", o_ = "data-ui-color-tab", s_ = "data-ui-color-tab-selected", c_ = "data-ui-color-pane", l_ = "data-ui-color-pane-selected", u_ = "data-ui-color-square", d_ = "data-ui-color-hue", f_ = "data-ui-color-hex", p_ = "data-ui-color-channel", m_ = "data-ui-color-factor", h_ = "data-ui-color-opacity", g_ = "data-ui-color-name", __ = "data-ui-color-name-selected", v_ = "data-ui-color-format", y_ = "data-ui-color-variant", b_ = "data-ui-color-no-picker", x_ = "data-ui-color-no-palette", S_ = 4, C_ = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new as({
		show: ({ owner: e }) => e.classList.add(Zg),
		hide: ({ owner: e }) => e.classList.remove(Zg)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Xg}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = y(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Xg}`) ?? []);
		}), O(this.root, `.${Xg}`, {
			childList: !0,
			attributeFilter: [
				v_,
				y_,
				b_,
				x_
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new nh({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${u_}], [${d_}]`),
			begin: (e, t) => {
				let n = e.closest(`.${Xg}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(u_) ? "square" : "hue"
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: (e, t) => this.send(t.input)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = O_(e), n = this.states.get(e), r = n?.paneChosen === !0 ? w_(e, n.pane) : T_(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? E_(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = I_(t);
			if (i === null) return n ?? E_(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && D_(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = z_(a, o, s);
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
			...n ?? E_(r),
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
			let [e, a, o] = z_(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), M_(e, "--ui-color-input-color", t.held ? R_(n, r, i, t.opacity) : "transparent"), M_(e, "--ui-color-input-solid", R_(n, r, i, 255)), M_(e, "--ui-color-input-on-color", t.held ? qg(n, r, i, t.opacity) : "inherit"), j_(e, t.held ? A_(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${u_}]`), o = e.querySelector(`[${d_}]`), [s, c, l] = B_(t.hue, 1, 1);
		if (M_(e, "--ui-color-input-hue", R_(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${r_}`);
			e !== null && (M_(e, "left", `${t.saturation * 100}%`), M_(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${i_}`);
			e !== null && M_(e, "top", `${t.hue / 360 * 100}%`);
		}
		N_(e, `[${f_}]`, L_(n, r, i)), N_(e, `[${p_}="r"]`, String(n)), N_(e, `[${p_}="g"]`, String(r)), N_(e, `[${p_}="b"]`, String(i)), M_(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), P_(e, `[${h_}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${g_}]`)) n.getAttribute(g_) === t.name ? n.setAttribute(__, "") : n.removeAttribute(__);
		let n = t.name === null ? null : e.querySelector(`[${g_}="${t.name}"]`), r = n === null ? null : I_(n.style.getPropertyValue("--ui-color-input-chip").trim());
		M_(e, "--ui-color-input-base", r === null ? "transparent" : R_(r[0], r[1], r[2], 255)), P_(e, `[${m_}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${c_}]`)) n.getAttribute(c_) === t.pane ? n.setAttribute(l_, "") : n.removeAttribute(l_);
		for (let n of e.querySelectorAll(`[${o_}]`)) n.getAttribute(o_) === t.pane ? n.setAttribute(s_, "") : n.removeAttribute(s_);
	}
	resolveRgb(e, t) {
		if (t.name === null) return B_(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${g_}="${t.name}"]`), r = n === null ? null : I_(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? B_(t.hue, t.saturation, t.value) : F_([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${a_}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${Xg}`));
			return;
		}
		let n = e.target.closest(`[${o_}]`), r = e.target.closest(`.${Xg}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(o_), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${g_}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(g_)
			}));
			return;
		}
		let a = r.querySelector(`.${Qg}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${Xg}`);
		if (t !== null) {
			if (e.target.hasAttribute(m_)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(h_) && this.commit(t, (t) => ({
				...t,
				opacity: F(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${Xg}`);
		if (n === null) return;
		if (t.hasAttribute(m_) || t.hasAttribute(h_)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(f_)) {
			let e = I_(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = z_(e[0], e[1], e[2]);
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
		let r = t.getAttribute(p_);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = F(Number(t.value));
		let [l, u, d] = z_(c.r, c.g, c.b);
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
			let e = V_((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = V_((t.x - a.left) / a.width), s = 1 - V_((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || T(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${n_}`);
		a !== null && (a.value = k_(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		T(e) || e.querySelector(`.${n_}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(b_) && e.hasAttribute(x_)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${Qg}`), n = e.querySelector(`[${a_}]`);
		if (t === null) return;
		let r = e.getAttribute(y_) === "swatch" ? e.querySelector(`.${t_}`) : e.querySelector(`.${e_}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: S_
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${s_}]`) ?? !0
		});
	}
};
function w_(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? b_ : x_))(t) ? t : t === "picker" ? "palette" : "picker";
}
function T_(e) {
	return w_(e, "picker");
}
function E_(e) {
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
function D_(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function O_(e) {
	return e.querySelector(`.${n_}`)?.value.trim() ?? "";
}
function k_(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = L_(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${Kg(e.opacity)}`;
}
function A_(e, t, n, r, i) {
	if (e.getAttribute(v_) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = L_(t, n, r);
	return i === 255 ? a : `${a}${Kg(i)}`;
}
function j_(e, t) {
	for (let n of e.querySelectorAll(`.${$g}`)) n.textContent !== t && (n.textContent = t);
}
function M_(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function N_(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function P_(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function F_(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		F(e[0] * (1 - n)),
		F(e[1] * (1 - n)),
		F(e[2] * (1 - n))
	] : [
		F(e[0] + (255 - e[0]) * n),
		F(e[1] + (255 - e[1]) * n),
		F(e[2] + (255 - e[2]) * n)
	];
}
function I_(e) {
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
function L_(e, t, n) {
	return `#${Kg(e)}${Kg(t)}${Kg(n)}`;
}
function R_(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function z_(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function B_(e, t, n) {
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
		F((o + a) * 255),
		F((s + a) * 255),
		F((c + a) * 255)
	];
}
function V_(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function H_(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var I = "ui-table", U_ = "ui-table--reorderable", W_ = "ui-scroll-x--auto", G_ = "ui-scroll-x--always", K_ = `:scope > .${Et}`, q_ = `.${Ot}`, J_ = "ui-table__header-cell", Y_ = `${J_}--pinned`, X_ = `${K_} > .${Dt} > .${J_}`, Z_ = `${X_}--pinned`, Q_ = "ui-table__host", $_ = `${K_} > .${Q_}`, ev = `.${I}, .${Tt}, [${St}]`, tv = "--ui-table-columns", nv = "--ui-table-sized-columns", rv = "--ui-table-pin-", iv = "--ui-table-order-", av = 64, ov = "data-ui-table-cell-hidden", sv = "data-ui-table-cell-last", cv = "columns", lv = "hidden", uv = "order", dv = "layout", fv = 32, pv = 16, mv = class {
	root;
	store = new cm();
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
		if (this.root = e.root ?? document, this.drag = new nh({
			root: this.root,
			resolveHandle: (e) => e.closest(q_),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new nh({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Rm) e !== "base" && matchMedia(`(min-width: ${zm[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${I}`)), O(this.root, `.${I}`, {
			childList: !0,
			relevant: gv
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), O(this.root, `.${I}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(I)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), O(this.root, `.${I}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: _v
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector($_);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), H_(t, () => this.pin(t));
			let e = t.querySelector($_);
			e !== null && (this.markScrollbar(t, e), H_(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, cv), r = n === null ? null : rh(n);
		r !== null && r.length !== t.length ? (this.store.write(e, cv, null), this.store.writeBoot(e, dv, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, uv);
		if (i !== null && !yv(i, t)) {
			this.store.write(e, uv, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Pt, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${I}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = vv(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(W_) || e.classList.contains(G_);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(nv);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Ch(t, n);
				e.style.setProperty(nv, sh(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${iv}${t}`, String(r[t])) : e.style.removeProperty(`${iv}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(wt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(wt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(kt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(kt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(U_)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= av) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${St}]`)) {
				let r = Number(t.getAttribute(St));
				!(r >= av) || t.closest(`.${I}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(ov, n.hidden.has(r)), t.toggleAttribute(sv, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(X_)) {
			let e = Number(n.getAttribute(St)), r = n.getAttribute(Ct), i = n.classList.contains(Y_) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Cv(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? Sv(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, lv) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(tv).trim(), n = t.length === 0 ? null : rh(t);
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
		n === null || i !== void 0 && n === Sv(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, lv, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return vv(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(Z_).length;
		if (t < 2) return;
		let n = Sh(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${rv}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${I}`)?.toggleAttribute(Nt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(K_);
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
		let t = e.target.closest(q_);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = pv;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${I}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(St)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(q_)?.closest(`.${I}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = mh(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(fv, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, hv(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, cv, t === null ? null : sh(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(nv).trim(), n = e.getAttribute(wt), r = {};
		t.length > 0 && (r[nv] = t);
		for (let t of e.style) t.startsWith(iv) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, dv, null);
			return;
		}
		this.store.writeBoot(e, dv, {
			styles: r,
			attributes: {
				[wt]: n,
				[kt]: e.getAttribute(kt)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${I}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = uh(t.getAttribute(yt)), i = dh(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(St)), u = this.hiddenOf(t, o), d = vv(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${J_}`), n = t?.closest(`.${I}`) ?? null;
		return t === null || n === null || !n.classList.contains(U_) || e.closest(q_) !== null || t.classList.contains(Y_) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${I}`), r = Number(e.getAttribute(St));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(At, ""), e.setAttribute(jt, ""), {
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
		for (let a of vv(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > bv(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), xv(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Mt, "after") : a.cell.setAttribute(Mt, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(jt), t.table.removeAttribute(At), xv(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = vv(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, uv, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function hv(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function gv(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(ev) || t.querySelector(ev) !== null)) return !0;
	return !1;
}
function _v(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(Q_);
}
function vv(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function yv(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function bv(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function xv(e) {
	for (let t of e.querySelectorAll(`[${Mt}]`)) t.removeAttribute(Mt);
}
function Sv(e) {
	return e.hideBelow !== null && Rm.indexOf(Bm()) < Rm.indexOf(e.hideBelow);
}
function Cv(e) {
	return e !== null && Rm.includes(e);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var L = { ok: !1 };
function wv(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Fn(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return L;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return L;
			let t = a[l];
			if (l++, Fn(t.kind) === "Dynamic") {
				let n = Ov(e, t.componentId);
				if (!n.ok) return L;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return L;
				let e = Pv(o, t.value);
				if (!e.ok) return L;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return L;
		if (c) {
			let e = Av(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? L : {
		ok: !0,
		value: o,
		scope: s
	};
}
function Tv(e, t, n) {
	for (let r of t ?? []) {
		if (Fn(r.kind) !== "Dynamic") continue;
		let t = y(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Ev(e) {
	let t = Av(e, "IsContent");
	return t.ok && t.value === !0;
}
var Dv = /* @__PURE__ */ new Set();
function Ov(e, t) {
	let n = y(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Dv.has(n) || (Dv.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), L;
}
function kv(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Av(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Av(e, t) {
	if (e == null) return L;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return L;
	let n = e, r = jv(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : L;
}
function jv(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Mv(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Mv(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Nv(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Fn(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Fn(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = y(e.componentId);
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
function Pv(e, t) {
	if (e == null || t == null) return L;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : L;
	if (typeof t != "string") return L;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Iv(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return L;
}
function Fv(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Iv(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Iv(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Lv = `:scope > [${Ie}], :scope > [${Le}], :scope > [${qe}]`;
function Rv(e) {
	let t = new Set(e.querySelectorAll(Lv));
	return [...e.children].filter((e) => !t.has(e));
}
function zv(e) {
	return e === null ? [] : [e];
}
function Bv(e) {
	return e.querySelector(`:scope > [${Ie}]`);
}
function Vv(e, t, n, r, i) {
	i ??= Rv(e).some((e) => !e.classList.contains(gn));
	let a = Bv(e);
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
	c.setAttribute(Ie, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/items-filter-sort.ts
function Hv(e) {
	let t = e.closest(_)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Uv(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Hv(e);
	if (a === void 0 && o === null) {
		for (let t of Rv(e)) t.classList.remove(gn);
		return;
	}
	for (let n of Rv(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(gn);
			continue;
		}
		n.classList.toggle(gn, !Wv(a, e, i, o));
	}
}
function Wv(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Yv(e, t, n)) && (r?.filters ?? []).every((e) => Xa(kv(t, e.itemProperty), e.operator, e.value));
}
function Gv(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Xv(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Kv(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Xv(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function qv(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Jv(n.getItemValue(e), n.getItemValue(r), t));
}
function Jv(e, t, n) {
	for (let r of n) {
		let n = Zv(kv(e, r.itemProperty), kv(t, r.itemProperty));
		if (n !== 0) return Bn(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Yv(e, t, n) {
	if (!Xv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Xa(kv(t, e.itemProperty), e.operator, r);
}
function Xv(e, t, n, r) {
	return e == null || Xa(r.get(e, []), t, n);
}
function Zv(e, t) {
	if (e === t) return 0;
	let n = $v(e), r = $v(t);
	if (n !== r) return n - r;
	if (n === Qv.Nothing) return 0;
	if (n === Qv.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Qv = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function $v(e) {
	return e == null ? Qv.Nothing : typeof e == "number" ? Number.isNaN(e) ? Qv.Nothing : Qv.Number : typeof e == "string" && e.trim().length === 0 ? Qv.Nothing : Number.isNaN(Number(e)) ? Qv.Text : Qv.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function ey(e) {
	switch (e.getAttribute(He)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
var ty = "bottom";
function ny(e, t, n) {
	let r = e.querySelector(`:scope > [${qe}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(qe, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function ry(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-source-order.ts
var iy = /* @__PURE__ */ new WeakMap();
function ay(e, t) {
	let n = iy.get(e), r = n === void 0 ? [...t] : oy(n, t);
	return iy.set(e, r), r;
}
function oy(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function sy(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function cy(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function ly(e, t, n) {
	return cy(e, t), sy(e, t, n);
}
function uy(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function dy(e) {
	iy.delete(e);
}
//#endregion
//#region src/items/items-group-renderer.ts
var fy = /* @__PURE__ */ new WeakMap();
function py(e) {
	for (let t of e.querySelectorAll(`[${Le}]`)) t.remove();
}
function my(e, t, n, r, i, a) {
	let o = ey(e) === "windowed", s = Rv(e), c = o ? s : ay(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : Kv(f, a, Hv(e));
	if (u && !d && py(e), c.length === 0) {
		fy.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Bv(e);
	if (!d) {
		ry(e, [...qv(c, p, r), ...zv(ee)]);
		return;
	}
	py(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (fy.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	fy.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = qv(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = hy(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	ry(e, [...re, ...zv(ee)]);
}
function hy(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(Le, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var gy = "ui-tree-rules", _y = "ui-tree";
function vy(e, t, n) {
	if (e.parentElement?.classList.contains(_y) === !0) {
		e.dispatchEvent(new Event(gy, { bubbles: !0 }));
		return;
	}
	switch (ey(e)) {
		case "windowed":
			Vv(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Uv(e, t, n.metadata, n.renderer, n.state), Vv(e, t, n.templates, n.renderer), my(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
function yy(e, t, n, r, i, a = []) {
	by(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function by(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/inline-rename.ts
var xy = "data-ui-rename-field";
function Sy(e) {
	return e instanceof Element && e.closest(`[${xy}]`) !== null;
}
function Cy(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(xy, ""), r.value = e.value, wy(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!e.isComposing) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.select(), !0;
}
function wy(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Ty = ".ui-items-view, .ui-table", Ey = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Dy = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${Si})[${en}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), O(this.root, Si, {
			childList: !0,
			attributeFilter: [
				en,
				nn,
				rn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		Ni(e, this.ownItems(e));
	}
	handleClick(e) {
		let t = this.resolveRow(e, Si);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (Zi(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Di(n, r);
			return;
		}
		Fi(n, i, r, Oi(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Ci), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || C(r) ? null : Mc(e.target, n) === null && !w(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Ty);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ta(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = Ji(e.target);
		if (t === null || t.row !== null && Mc(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(Ty) || C(n)) return;
		let r = Oy(n);
		if (!Ey.has(e.key) && !hi(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = Xi(i), o = Qi(e.key, i, a, r);
		if (o !== null) {
			e.preventDefault(), Zi(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Ei(n, a), Fi(n, i, o, ki(n, e)));
			return;
		}
		if (!(a === null || w(a))) {
			switch (e.key) {
				case " ":
					if (!Fi(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					Ai(n) && !Pi(i).includes(a) && Fi(n, i, a, wi), ta(a, "open");
					break;
				case "Delete": {
					let e = ky(i, a);
					if (e.length === 0) return;
					for (let t of e) ta(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return k(e, Ci, Si);
	}
};
function Oy(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function ky(e, t) {
	let n = Pi(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !w(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var R = "ui-tree", Ay = "ui-tree__row", jy = "ui-tree__row--folded", My = "ui-tree__row--filtered", Ny = "fold-hidden", Py = "fold-shown", Fy = "ui-tree__row--dragging", Iy = "ui-tree__loading", Ly = "ui-tree__loading-ring", Ry = "ui-tree-node", zy = "ui-tree-node__text", By = "ui-tree-node__toggle", Vy = "ui-tree-node__rename", Hy = ".ui-text__title", Uy = "data-ui-tree-drop", Wy = "--ui-tree-depth", Gy = "expanded", Ky = 600, qy = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Jy = class {
	root;
	store = new cm();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(gy, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${R}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(y(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => z(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${R}`)), O(this.root, `.${R}`, {
			childList: !0,
			attributeFilter: [
				It,
				Lt,
				Rt,
				Ut
			],
			relevant: Zy
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Ut), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = eb(e)?.getAttribute(It);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = z(e), r = eb(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Lt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(Wy, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(jy, !d), e.classList.toggle(My, re), e.removeAttribute(Ht), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !w(e), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Bt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Bt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Bt), d && ne && !re), s.set(n, {
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
		return eb(e.row)?.hasAttribute(Rt) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Ay}[${m}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, Ny, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, Py, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Ht]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = pr(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Hv(t);
		if (r === void 0 && i === null) return null;
		let a = Kv(r, this.rules.state, i), o = Gv(r, this.rules.state, i);
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
			let t = eb(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Jv(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(z(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Iy}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = z(o), c = i.getItemValue(o);
			if (c === void 0 || Wv(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = eb(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Iy) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Qy();
		o.style.setProperty(Wy, String(t)), o.classList.toggle(jy, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${By}`) === null && (!r.hasAttribute("data-ui-unselectable") || Mc(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Mc(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Ay}`), n = t?.closest(`.${R}`) ?? null;
		return t === null || n === null || t.closest(`.${R}`) !== n || w(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = Ji(e.target);
		if (t === null || t.row !== null && Mc(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains(R) || C(n) || !qy.has(e.key) && !hi(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = Xi(r), a = Qi(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, ki(n, e));
			return;
		}
		if (!(i === null || w(i))) {
			switch (e.key) {
				case " ":
					if (!Fi(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, Qi("ArrowDown", r, i, "vertical"), wi);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), wi);
					break;
				case "Enter":
					Ai(n) && !Pi(r).includes(i) && Fi(n, r, i, wi), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = ky(r, i);
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
		let t = $y(e), n = t?.closest(`.${R}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (w(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? Pi(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !w(e) && e.getClientRects().length > 0) : [];
		yy(e, n, t, Fy, z(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Fy));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Ay}`), a = i !== null && i.closest(`.${R}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (w(a) || n.some((t) => t === a || Xy(e, z(a), z(t)))) return;
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Ky)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${R}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Uy}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Ay) ? z(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Xy(a, z(e), z(t))));
		this.markDrop(t, null), this.springOpen(t, null), by(t, Fy), r.classList.contains(Ay) && this.expand(t, r);
		for (let e of o) {
			let t = eb(e)?.querySelector(`.${zy}`) ?? null;
			t !== null && (t.setAttribute(Vt, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = $y(e)?.closest(`.${R}`) ?? null;
		t !== null && (by(t, Fy), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Uy}]`)) n !== t && n.removeAttribute(Uy);
		t?.setAttribute(Uy, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(z(n), eb(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
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
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(jy)) : [];
		this.store.writeJson(e, Gy, i), this.layout(e), Yy(a.filter((e) => !e.classList.contains(jy)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, Gy) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Xi(r);
		Zi(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Ei(e, i), Fi(e, r, t, n));
	}
	parentOf(e, t) {
		let n = eb(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => z(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${R}`), n = eb(e), r = n?.querySelector(Hy) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), Cy({
			container: n,
			title: r,
			className: Vy,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(zt, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Ay) && n.push(e);
		return n;
	}
};
function Yy(e) {
	if (!(e.length === 0 || so())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: oo.fast,
		easing: oo.enter
	});
}
function Xy(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Zy(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(Ay) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(R) === !0);
}
function Qy() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Iy, e.setAttribute("aria-hidden", "true"), t.className = Ly, e.append(t, S.text("ui.tree.loading")), e;
}
function $y(e) {
	return e.target instanceof Element ? e.target.closest(`.${Ay}`) : null;
}
function z(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
function eb(e) {
	return e.querySelector(`.${Ry}`);
}
var tb = "tabs:rename", nb = "tabs:pin", rb = "tabs:unpin", ib = "tabs:close", ab = "tabs:delete";
function ob(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function sb(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[tb, e.rename && t.renamable],
		[nb, e.pin && !t.pinned],
		[rb, e.pin && t.pinned],
		[ib, e.close && !e.delete && n],
		[ab, e.delete && n]
	]);
}
function cb(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function lb(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, ub(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function ub(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function db(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var B = "ui-tabs-view", fb = "ui-tab-item", pb = "ui-tab-item__label", mb = "ui-tab-item__close", hb = "ui-tab-item__rename", gb = "ui-tab-item__caption", _b = "ui-tab-item__pin", vb = ".ui-text__title", yb = "ui-tab-item--dragging", bb = "ui-tab-item__caption--overflowed", xb = "ui-tabs-view--overflowing", Sb = "ui-tabs-view--no-overflow", Cb = "ui-tab-item__page", wb = "ui-tab-item--selected", Tb = ".ui-menu-item", Eb = "tab-menu-entry", Db = {
	name: Eb,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, Ob = "--ui-tabs-view-strip", kb = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new cg({
			rootClass: B,
			overflowingClass: xb,
			wraps: (e) => e.classList.contains(Sb),
			hiddenClass: bb,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(y(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => H(e) === t.key))?.querySelector(`.${pb}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Pp, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), O(this.root, `.${B}`, {
			childList: !0,
			attributeFilter: [
				on,
				_e,
				...un
			],
			relevant: (e) => !Wo(e, `.${Cb}`, `.${B}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${B}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(ng);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => H(e) === r)) {
			this.select(e, H(n[0]));
			return;
		}
		let i = e.hasAttribute(_e), a = [], o = null, s = null;
		for (let e of t) {
			let t = H(e) === r;
			e.classList.toggle(wb, t);
			let c = e.querySelector(`.${gb}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${pb}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${Cb}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${Cb}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${pb}`);
			t === null || e.classList.contains(bb) || (c.push(t), e === o && (l = t));
		}
		E(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !ng(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(Ob, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${rg}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => H(e) === t)?.querySelector(`.${pb}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(ng).map((e) => ({
				key: H(e),
				title: e.querySelector(`.${pb}`)?.textContent?.trim() ?? H(e),
				current: H(e) === t,
				disabled: C(e.querySelector(`.${pb}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${fb}`);
		if (n === null || !n.classList.contains(B) || r === null || r.closest(`.${B}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = Mb(n, r), a = Pb(t), o = a.map((e) => {
			if (Nb(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? ng(e) ? "shown" : "hidden";
		});
		if (cb(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: H(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${ye}="tab"]`), n = t?.parentElement ?? null, r = e.closest(Tb);
		if (t === null || n === null || !n.classList.contains(B) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => H(e) === a.key);
		if (i.length === 0 || r.matches(`${ht}, ${mt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(Eb, {
			bubbles: !0,
			detail: { keys: [i, H(o)] }
		})), !0;
		if (Mb(n, o).get(i) !== !0) return !0;
		switch (i) {
			case tb: {
				let e = o.querySelector(`.${pb}`);
				e !== null && this.startRename(e);
				break;
			}
			case nb:
			case rb:
				this.setPinned(n, o, i === nb);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${gb} > .${_b}`);
		t.toggleAttribute(ln, n), r !== null && (r.toggleAttribute(ln, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = db(a.map(Rb));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? V(a[a.length - 1]).after(V(t)) : V(s).before(V(t)), Lb([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${rg}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(B)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = Fb(e.target), i = r?.closest(`.${B}`) ?? null;
		if (r === null || i === null || C(r)) return;
		let a = r.closest(`.${fb}`);
		a !== null && a.closest(`.${B}`) === i && (e.preventDefault(), this.select(i, H(a)), document.activeElement !== r && D(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${mb}`), r = n?.closest(`.${fb}`) ?? null, i = r?.closest(`.${B}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), jb(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = Fb(e.target), n = t?.closest(`.${B}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(vb) ?? e, r = e.closest(`.${fb}`);
		t === null || r === null || V(r).hasAttribute("data-ui-unrenamable") || Cy({
			container: t,
			title: n,
			className: hb,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(cn, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => D(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${pb}`), n = t?.closest(`.${B}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${pb}`)).filter((e) => e !== null), i = mi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${fb}`);
		a !== null && this.select(n, H(a)), i.focus();
	}
	handleDragStart(e) {
		let t = Ib(e);
		if (t === null) return;
		if (V(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		yy(e, t.closest(`.${B}`) ?? t, t, yb, H(t));
		let n = V(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gb}`)?.closest(`.${fb}`) ?? null, n = t?.closest(`.${B}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${yb}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${gb}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = V(r), o = t.hasAttribute("data-ui-tab-pinned") ? Ab(n, a) : null, s = o ?? V(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && t.querySelector(`.${yb}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = Ib(e);
		if (t === null) return;
		t.classList.remove(yb);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(V(t), n.next);
			return;
		}
		let r = V(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${B}`);
		if (i === null) return;
		let a = this.ownItems(i);
		Lb(a, a.indexOf(t));
	}
	select(e, t) {
		bi(e, t, {
			attribute: on,
			bindingAttribute: an,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return k(e, `.${fb}`, `.${B}`);
	}
};
function Ab(e, t) {
	let n = null;
	for (let r of k(e, `.${fb}`, `.${B}`)) {
		let e = V(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function jb(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !V(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function Mb(e, t) {
	return sb(ob(e.getAttribute(ve)), {
		pinned: t.hasAttribute(ln),
		renamable: !V(t).hasAttribute(me),
		removable: e.hasAttribute("data-ui-tabs-removes") && jb(e, t)
	});
}
function Nb(e) {
	let t = e.getAttribute(m);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function Pb(e) {
	let t = e.querySelector(`[${h}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function V(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Fb(e) {
	return e.closest(`.${mb}`) !== null || Sy(e) ? null : e.closest(`.${gb}`)?.querySelector(`:scope > .${pb}`) ?? null;
}
function Ib(e) {
	return e.target instanceof Element ? e.target.closest(`.${gb}`)?.closest(`.${fb}`) ?? null : null;
}
function Lb(e, t) {
	for (let [n, r] of lb(e.map(Rb), t)) e[n].setAttribute(sn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function Rb(e) {
	return {
		order: zb(e),
		pinned: e.hasAttribute(ln)
	};
}
function zb(e) {
	let t = e.getAttribute(sn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function H(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var Bb = "button.ui-text__fold-toggle", Vb = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Bb);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, Hb = "ui-temporal-input__segments", Ub = "ui-temporal-input__segment", Wb = "ui-temporal-input__segment-literal", Gb = "ui-temporal-input__segment--empty", Kb = "data-ui-temporal-segment", qb = "data-ui-temporal-step-direction", Jb = "data-ui-temporal-segments-of", Yb = "--", Xb = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${A}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(dr(e.components, `.${A}`));
		}), O(this.root, `.${A}`, { attributeFilter: [...Pd] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Id(t) === "time" && (Yd(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${Hb}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Ld(e), r = Bd(e), i = j(e, Ud(t));
		t.getAttribute(Jb) !== n && (t.replaceChildren(...Zb(n).map((e) => $b(e))), t.setAttribute(Jb, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(Kb);
			if (t === null) {
				n.textContent = tx(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = nx(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(Gb, i === null), n.tabIndex = 0, rx(n, t, i, T(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = ax(e.target);
		if (t === null) return;
		let n = t.closest(`.${A}`), r = t.getAttribute(Kb), i = ix(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), sx(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), qd(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = cx(e.key, Bd(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = ax(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = ax(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = mf(this.wheelTurn, pf(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${A}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(Kb), n < 0 ? 1 : -1, ix(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${qb}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qb}]`);
		if (t === null) return;
		let n = t.closest(`.${A}`);
		if (n === null || T(n)) return;
		e.preventDefault();
		let r = ox(n) ?? n.querySelector(`.${Ub}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(Kb), t.getAttribute(qb) === "up" ? 1 : -1, ix(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Ub}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${A}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = j(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = lx(t), o = zd(Rd(e), a) * n, s = a === "hour" ? 24 : 60, c = ((ux(i, a) + o) % s + s) % s;
		this.write(e, dx(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? dx(t, "hour", fx(l, t.getHours() >= 12)) : dx(t, lx(n), l), i);
		}
		u && sx(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, dx(r, "hour", fx(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return j(e, t) ?? Zd(e);
	}
	write(e, t, n) {
		qd(e, Qd(e, t), n), Jd(e), this.applySegments(e);
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
function Zb(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = gd(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(Qb(r)), n += r.length;
	}
	return t;
}
function Qb(e) {
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
function $b(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = Wb, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = Ub, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(Kb, e.unit), t.dataset.width = String(e.width), ex(t, e.unit), t;
}
function ex(e, t) {
	if (t === "meridiem") {
		S.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = lx(t);
	S.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function tx(e, t, n, r) {
	return t && n !== null ? md(n, e, r) : e;
}
function nx(e, t, n, r) {
	if (n === null) return Yb;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : ux(n, lx(e));
	return String(i).padStart(t, "0");
}
function rx(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : ux(n, lx(t))));
}
function ix(e) {
	return Ud(e.closest(`.${Hb}`));
}
function ax(e) {
	let t = e instanceof Element ? e.closest(`.${Ub}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${A}`);
	return n === null || T(n) ? null : t;
}
function ox(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${Ub}`) : null;
}
function sx(e, t, n) {
	mi({
		key: n,
		items: [...e.querySelectorAll(`.${Ub}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function cx(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function lx(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function ux(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function dx(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function fx(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var px = "data-ui-scroll-anchor", mx = "End", hx = 4, gx = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), O(this.root, `[${px}="${mx}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [tt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !_x(t) || this.pinned.set(t, yx(t) && !vx(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${px}="${mx}"]`));
	}
	followEach(e) {
		for (let t of e) if (this.pinned.get(t) !== !1) {
			if (vx(t)) {
				this.pinned.set(t, !1);
				continue;
			}
			this.pinned.set(t, !0), yx(t) || (t.scrollTop = t.scrollHeight);
		}
	}
};
function _x(e) {
	return e.getAttribute(px) === mx;
}
function vx(e) {
	return e.getAttribute(Qe)?.toLowerCase() === "true";
}
function yx(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= hx;
}
//#endregion
//#region src/items/items-viewport.ts
function bx(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function xx(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${h}][${Ue}]`) : null;
}
function Sx(e) {
	let t = bx(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - wx(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Cx(e, t) {
	let n = bx(e);
	n.scrollTop = n === e ? t : t + wx(e, n);
}
function wx(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function Tx(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Dx(e, a, n), s = Dx(e, a + 1, n);
	return Ox(t, o.top, s.top, o.line, s.line);
}
function Ex(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Dx(e, a, n), s = Dx(e, a + 1, n);
	return Ox(t, o.line, s.line, o.top, s.top);
}
function Dx(e, t, n) {
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
function Ox(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var kx = 250, Ax = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(We);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < kx && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${We}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${We}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = jx(e, "data-ui-scroll-viewport") ?? Mx(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? Px(e) : null, a = i === null ? null : Px(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Ex(a, Tx(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? Nx(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function jx(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function Mx(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : jx(e, h);
	return t === null ? null : bx(t);
}
function Nx(e, t) {
	return t > 0 ? e / t : 0;
}
function Px(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Ge}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Ke}]`);
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
var Fx = `.${Cn}, .ui-action, .${g}`, Ix = gt, Lx = "ui-pressing", Rx = "--ui-press-x", zx = "--ui-press-y", Bx = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Fx);
		if (t === null || C(t) || t.matches(Ix) || so()) return;
		let n = e.target.closest(bn);
		if (n !== null && n !== t && t.contains(n)) return;
		let r = t.getBoundingClientRect();
		t.style.setProperty(Rx, `${e.clientX - r.left}px`), t.style.setProperty(zx, `${e.clientY - r.top}px`), t.classList.remove(Lx), t.offsetWidth, t.classList.add(Lx), window.setTimeout(() => t.classList.remove(Lx), oo.ripple);
	}
}, Vx = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), Hx = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], Ux = `.${pn}, .${mn}`, Wx = RegExp(`(^|\\s)(${pn}|${mn})(\\s|$)`), Gx = RegExp(`(^|\\s)${hn}(\\s|$)`), Kx = "[type='range']", qx = /* @__PURE__ */ new WeakSet(), Jx = /* @__PURE__ */ new WeakSet();
function Yx(e = document) {
	let t = e === document ? window : e;
	for (let e of Hx) t.addEventListener(e, rS, !0);
	t.addEventListener("keydown", aS, !0), t.addEventListener("pointerdown", oS, !0), t.addEventListener("mousedown", oS, !0), eS(e.querySelectorAll(Ux)), Qx(e.querySelectorAll(`[${fn}]`)), Zx(e.querySelectorAll(Kx)), new MutationObserver((e) => {
		for (let t of e) Xx(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", fn],
		attributeOldValue: !0
	});
}
function Xx(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			$x(t);
			return;
		}
		let n = Wx.test(e.oldValue ?? ""), r = t.matches(Ux);
		n !== r && (tS(t, r), $x(t)), Gx.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && Zx(t.querySelectorAll(Kx));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(Ux) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && nS(n), n.matches(Ux) && tS(n, !0), eS(n.querySelectorAll(Ux)), $x(n), Qx(n.querySelectorAll(`[${fn}]`)), Zx([n, ...n.querySelectorAll(Kx)]));
}
function Zx(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = T(t);
		e !== qx.has(t) && (e ? (qx.add(t), t.addEventListener("touchstart", oS, { passive: !1 })) : (qx.delete(t), t.removeEventListener("touchstart", oS)));
	}
}
function Qx(e) {
	for (let t of e) $x(t);
}
function $x(e) {
	let t = e.getAttribute(fn);
	t !== null && (e.matches(Ux) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : e.getAttribute("href") !== t && (e.setAttribute("href", t), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function eS(e) {
	for (let t of e) tS(t, !0);
}
function tS(e, t) {
	for (let n of e.children) t ? nS(n) : Jx.has(n) && (Jx.delete(n), n.removeAttribute("inert"));
}
function nS(e) {
	e.hasAttribute("inert") || (Jx.add(e), e.setAttribute("inert", ""));
}
function rS(e) {
	e.target instanceof Element && (C(e.target) ? sS(e) : e.type === "click" && iS(e.target) && e.preventDefault());
}
function iS(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && T(e);
}
function aS(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && C(e.target)) {
			sS(e);
			return;
		}
		!Vx.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && T(e.target) && e.preventDefault();
	}
}
function oS(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !T(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function sS(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/rendering/icon-value.ts
var cS = "mask:", lS = "ui-icon--image", uS = "ui-icon--mask";
function dS(e) {
	let t = String(e ?? "").trim(), n = !1;
	return t.startsWith(cS) && (n = !0, t = t.slice(5).trim()), fS(t) ? {
		source: t,
		tinted: n
	} : null;
}
function fS(e) {
	let t = e.toLowerCase();
	return e.startsWith("/") && e.length > 1 && e[1] !== "/" || t.startsWith("https://") || t.startsWith("http://") || t.startsWith("data:image/");
}
function pS(e) {
	let t = dS(e);
	return t === null ? "" : mS(t.source);
}
function mS(e) {
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
var hS = "ui-icon", gS = "data-ui-icon";
function _S(e, t) {
	e.classList.add(hS);
	for (let t of Array.from(e.classList)) yS(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url");
	let n = bS(t);
	if (n.length === 0) {
		e.removeAttribute(gS);
		return;
	}
	e.setAttribute(gS, ""), e.classList.add(n);
	let r = dS(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", mS(r.source));
}
var vS = "ui-icon-glyph--";
function yS(e) {
	return e === lS || e === uS || e.startsWith(vS);
}
function bS(e) {
	let t = dS(e);
	return t === null ? xS(e) : t.tinted ? uS : lS;
}
function xS(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = vS;
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
var SS = [
	"http",
	"https",
	"mailto",
	"tel"
];
function CS(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || SS.includes(t.slice(0, n).toLowerCase());
}
function wS(e) {
	return CS(e) ? String(e) : void 0;
}
function TS(e) {
	return typeof e != "string" || !e.startsWith("/") || /[\x00-\x1f\x7f]/.test(e) ? !1 : e.length === 1 || e[1] !== "/" && e[1] !== "\\";
}
function ES(e) {
	let t = String(e ?? "").trim();
	return fS(t) ? t : void 0;
}
//#endregion
//#region src/rendering/inline-markup.ts
var DS = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, OS = "\\", kS = "`", AS = "!", jS = "{", MS = "}", NS = "ui-text__fold", PS = "ui-text__fold-toggle", FS = "ui-text__fold-content", IS = 8;
function LS(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return JS(new rC(e), 0, e.length, DS.None, null, t, n), YS(t, n, DS.None, null), t;
}
function RS(e) {
	return LS(e).map((e) => HS(e) ? `${e.fold} ${RS(e.text)}` : e.text).join("");
}
function zS(e, t, n = {}) {
	let r = LS(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && BS(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(US(r, n));
}
function BS(e) {
	return e.styles === DS.None && e.url === null && !VS(e) && !HS(e);
}
function VS(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function HS(e) {
	return e.fold !== null && e.fold !== void 0;
}
function US(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(WS(r, t));
	return n;
}
function WS(e, t) {
	if (VS(e)) return KS(e.icon);
	let n = HS(e) ? GS(e, t) : document.createTextNode(e.text);
	if ((e.styles & DS.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & DS.Strikethrough) !== 0 && (n = qS("s", n)), (e.styles & DS.Underline) !== 0 && (n = qS("u", n)), (e.styles & DS.Italic) !== 0 && (n = qS("em", n)), (e.styles & DS.Bold) !== 0 && (n = qS("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", oC(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function GS(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${NS} ${NS}--static` : NS, r.className = PS, r.textContent = e.fold ?? "", i.className = FS, i.append(US(LS(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ae, ""), n.append(r, i), n);
}
function KS(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", _S(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function qS(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function JS(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === OS && c + 1 < n && sC(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = XS(e, c, n);
		if (l !== null) {
			YS(a, o, r, i), ZS(s, c + 1, l, o), YS(a, o, r | DS.Code, i), c = l + 1;
			continue;
		}
		let u = eC(e, c, n);
		if (u !== null) {
			YS(a, o, r, i), JS(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), YS(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = QS(e, c, n);
		if (d !== null) {
			YS(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? tC(e, c, n) : null;
		if (f !== null) {
			YS(a, o, r, i), JS(e, f.labelStart, f.labelEnd, r, f.url, a, o), YS(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = nC(e, c, n);
		if (p !== null) {
			YS(a, o, r, i), a.push({
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
function YS(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function XS(e, t, n) {
	let r = e.text;
	if (r[t] !== kS) return null;
	let i = t + 1;
	if (i >= n || cC(r[i])) return null;
	let a = e.findClosingMarker(i, n, kS, 1);
	return a > i ? a : null;
}
function ZS(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === OS && i + 1 < n && sC(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function QS(e, t, n) {
	let r = e.text;
	if (r[t] !== AS || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return $S(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function $S(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function eC(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = DS.Bold, s = 2;
	else if (i === "*") o = DS.Italic, s = 1;
	else if (i === "_" && a) o = DS.Underline, s = 2;
	else if (i === "~" && a) o = DS.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || cC(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function tC(e, t, n) {
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
function nC(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== jS || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > IS) return null;
	let c = { value: "" };
	return ZS(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var rC = class {
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
		return this.closeBrackets ??= this.next("]", !0), iC(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), iC(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), iC(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return iC(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = aC(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !cC(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = CS(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === OS && e[t - 1] === 0);
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
			if (this.text[r] === jS) n.push(r);
			else if (this.text[r] === MS && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || cC(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function iC(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function aC(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function oC(e) {
	let t = e.toLowerCase();
	return t.startsWith("http:") || t.startsWith("https:") || t.startsWith("mailto:") || t.startsWith("tel:");
}
function sC(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === jS || e === MS || e === kS || e === OS;
}
function cC(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var lC = "ui-tooltip", uC = "ui-tooltip--visible", dC = "[aria-haspopup][aria-expanded=\"true\"]", fC = "top", pC = 250, mC = 200, hC = 300, gC = 7, U = null, W = null, _C = null, vC = 0, yC = null, bC = 0, xC = 0, SC = !1;
function CC(e = document) {
	if (SC) return;
	SC = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", wC, !0), t.addEventListener("pointerout", EC, !0), t.addEventListener("focusin", DC, !0), t.addEventListener("focusout", OC, !0), t.addEventListener("keydown", kC, !0), t.addEventListener("scroll", TC, !0), t.addEventListener("pointerdown", (e) => {
		_C === null && !AC(e.target) && VC(!0);
	}, !0), window.addEventListener("blur", () => {
		_C = null, VC(!0);
	});
}
function wC(e) {
	if (TC(), AC(e.target)) {
		window.clearTimeout(bC);
		return;
	}
	let t = jC(e.target);
	t !== null && t !== W && MC(t);
}
function TC() {
	W === null || W.isConnected || (_C = null, VC(!0));
}
function EC(e) {
	if (_C !== null) return;
	let t = e.relatedTarget, n = W ?? yC?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || AC(t)) || (AC(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && VC(!1);
}
function DC(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = jC(e.target);
	t !== null && (_C = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, NC(t));
}
function OC(e) {
	jC(e.target) === W && (_C = null, VC(!0));
}
function kC(e) {
	e.key === "Escape" && W !== null && (_C = null, VC(!0));
}
function AC(e) {
	return U !== null && e instanceof Node && U.contains(e);
}
function jC(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Se}], [${we}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${Se}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function MC(e, t) {
	if (_C === null) {
		if (window.clearTimeout(bC), yC !== null && yC.target === e) {
			yC.words = t;
			return;
		}
		if (window.clearTimeout(vC), yC = null, W !== null) {
			VC(!0), NC(e, t);
			return;
		}
		if (Date.now() - xC < hC) {
			NC(e, t);
			return;
		}
		yC = {
			target: e,
			words: t
		}, vC = window.setTimeout(() => {
			let e = yC;
			yC = null, e !== null && NC(e.target, e.words);
		}, pC);
	}
}
function NC(e, t) {
	let n = (t ?? e.getAttribute("data-ui-tooltip") ?? "").trim();
	if (n.length === 0 || !e.isConnected || PC(e)) return;
	window.clearTimeout(vC), window.clearTimeout(bC), yC = null, W !== null && W !== e && W.removeAttribute("aria-describedby");
	let r = HC();
	zS(r, n, { staticFolds: !0 }), r.classList.add(uC), W = e, e.setAttribute("aria-describedby", r.id), r.setAttribute("data-ui-tooltip-text", RS(n)), bo(e, r, {
		placement: BC(e),
		gap: gC,
		arrow: !0
	});
}
function PC(e) {
	return e.matches(dC) || e.querySelector(dC) !== null;
}
function FC(e, t, n) {
	n?.delay === !0 && W !== e ? MC(e, t) : NC(e, t);
}
function IC() {
	VC(!0);
}
var LC = {
	show: FC,
	hide: IC
};
function RC(e) {
	_C = e, NC(e);
}
function zC(e) {
	if (W === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			_C = null, VC(!0);
			return;
		}
		NC(e);
	}
}
function BC(e) {
	let t = e.getAttribute(Ce);
	return t !== null && uo(t) ? t : fC;
}
function VC(e) {
	window.clearTimeout(vC), window.clearTimeout(bC), yC = null;
	let t = () => {
		W !== null && (W.removeAttribute("aria-describedby"), W = null, U !== null && (U.classList.remove(uC), To(U)), xC = Date.now());
	};
	e ? t() : bC = window.setTimeout(t, mC);
}
function HC() {
	return U !== null && U.isConnected ? U : (U = document.createElement("div"), U.id = "ui-tooltip", U.className = lC, U.setAttribute("role", "tooltip"), U.setAttribute("aria-hidden", "true"), document.body.append(U), U);
}
//#endregion
//#region src/interactions/popup-service.ts
var UC = /* @__PURE__ */ new WeakMap(), WC = new as({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = UC.get(e);
		UC.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), GC = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => WC.popupOf(r) === t;
		return UC.set(t, n.onDismiss), WC.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (UC.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && WC.reposition(r);
			},
			close: () => {
				i() && WC.close(r);
			}
		};
	},
	focusReturn: (e) => xa(e)
};
//#endregion
//#region src/items/item-rows.ts
function KC(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: kv,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Ji(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var qC = class {
	metadata;
	templates;
	extensions;
	operations;
	state;
	itemStackByRoot = /* @__PURE__ */ new WeakMap();
	unresolved = /* @__PURE__ */ new Set();
	translatableRowBindings = null;
	fillRow = null;
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? XC(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), ZC(l, n, t);
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
		let i = YC(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: x(r),
			item: t
		};
		return this.itemStackByRoot.set(r, i), this.fillRow?.(r), this.populateBoundElements(r, [...n, i]), r;
	}
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [t, n] of this.translatableRowBindings) for (let r of e.querySelectorAll(n)) {
			let e = this.stackOf(r);
			JC(t, e) && this.applyBoundAttribute(r, String(y(t.bindingId)), e);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = y(t.bindingId);
			e.push([t, `[${Ee}${kn(n.propertyName)}="${On(r)}"]`]);
		}
		return e;
	}
	stackOf(e) {
		let t = this.getAncestorStack(e), n = this.itemStackByRoot.get(e);
		return n === void 0 ? t : [...t, n];
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
		let r = tw(t, n.templateKeyPropertyName);
		return r !== null && this.templates.getVariantTemplate(e, r) !== void 0 ? r : n.fallbackTemplateKey ?? null;
	}
	populateBoundElements(e, t) {
		let n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
		for (let r = e; r !== null; r = n.nextNode()) {
			if (!(r instanceof Element)) continue;
			let e = r.attributes;
			for (let n = 0; n < e.length; n++) {
				let i = e[n];
				i.name.startsWith("data-ui-bind-") && this.populateBoundAttribute(r, i.value, t);
			}
		}
	}
	populateBoundAttribute(e, t, n) {
		let r = this.metadata.getBindingById(Number(t));
		r !== void 0 && Tv(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n) {
		let r = Number(t);
		if (!Number.isInteger(r) || r <= 0) return;
		let i = this.metadata.getBindingById(r), a = i === void 0 ? void 0 : this.metadata.getPropertyDefinition(i.propertyId);
		if (i === void 0 || a === void 0) return;
		let o = i.itemTemplate === null || i.itemTemplate === void 0 ? this.state.has(i, []) ? {
			ok: !0,
			value: this.state.get(i, [])
		} : { ok: !1 } : wv(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			i.optional !== !0 && !this.unresolved.has(r) && (this.unresolved.add(r), s("item binding value could not be resolved; the item has no such property.", {
				binding: i,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = Gr(o.value ?? i.fallbackValue, () => this.metadata.isTranslatable(i) && !Ev(c)), u = y(i.componentId), d = e.closest(`[${ce}="${u}"]`);
		if (d === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = Mn(d, t, () => [e])[0] ?? null;
			if (n === null) continue;
			let o = this.extensions.converters.convert(t.converter, l);
			this.operations.apply({
				resolved: {
					componentId: u,
					propertyId: i.propertyId,
					propertyName: a.propertyName,
					dynamicParameters: [],
					component: d,
					definition: a,
					address: {
						component: {
							id: u,
							dynamicParameters: []
						},
						property: a.propertyName
					},
					bindingId: r,
					bindingSelector: null
				},
				operation: t,
				target: n,
				value: l,
				convertedValue: o,
				local: !1
			});
		}
	}
};
function JC(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = y(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function YC(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Av(r, i.name) : Pv(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Fv(r, i.key, n), e;
	let a = r;
	return a[jv(a, i.name)] = n, e;
}
function XC(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function ZC(e, t, n) {
	e.setAttribute(m, t), ew(e, n), $C(e, n);
}
var QC = [
	["CanSelect", de],
	["CanDrag", fe],
	["CanRemove", pe],
	["CanRename", me],
	["CanShowContextMenu", he]
];
function $C(e, t) {
	for (let [n, r] of QC) {
		let i = Av(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function ew(e, t) {
	let n = Av(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Re, n.value) : e.removeAttribute(Re);
}
function tw(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Av(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var nw = "Group", rw = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = y(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), O(e.root, `[${Be}="${Ve}"]`, { attributeFilter: [Ne] }, (e) => {
			for (let t of e) {
				let e = pr(t);
				e !== null && this.syncComponentHosts(e);
			}
		});
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
			for (let [t, n] of e) t.isConnected && vy(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(y(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Nv(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${h}]`)) {
			if (ey(r) !== "virtualized") continue;
			let i = r.closest(_);
			i === null || !this.drawsPatchedComponent(i, y(e.reference.componentId), t) || !iw(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(x(i), t) && this.sync(r, x(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${x(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? x(e) === n.scopeComponentId : x(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		vy(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${On(t)}"]`)].filter((t) => this.isItemRoot(t) && sr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${h}]`), i = r === null ? null : pr(r);
		if (r !== null && i !== null && ey(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = aw(nw, t);
		a && ew(e, this.options.renderer.getItemValue(e)), QC.some(([e]) => aw(e, t)) && $C(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && aw(nw, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => aw(e.itemProperty, t)) || n.sorts.some((e) => aw(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${h}]`)) {
			let n = pr(t);
			n === e && this.sync(t, n);
		}
	}
};
function iw(e, t) {
	let n = or(e, ar(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function aw(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var ow = 50, sw = 1, cw = .5, lw = 60, uw = class {
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
			if (this.layout(t), hw(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = vw(e, Ye);
		if (t !== null && _x(e) && dw(e.getAttribute("data-ui-window-more-after"))) {
			Cx(e, Math.max(0, this.windowBottom(e, t) - Sx(e).height));
			return;
		}
		t !== null && t !== 0 && Cx(e, dw(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = mw(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : pw(n[n.length - 1]).bottom - pw(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = vw(e, Ye), n = mw(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Sx(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		ey(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${h}][${He}="windowed"]`)];
	}
	handleScroll(e) {
		let t = xx(e.target);
		if (t === null || ey(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, lw));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && hw(e) > 0) return;
		let n = mw(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = vw(e, Ye), i = dw(e.getAttribute(Ze)), a = dw(e.getAttribute(Qe));
		if (r !== null) {
			let o = this.windowSize(e), s = Sx(e), c = Math.max(1, Math.round(s.height * sw / t.itemSize), Math.floor(o * cw)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, gw(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, gw(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Sx(e), s = Math.max(1, o.height * sw), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, gw(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, gw(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = vw(e, Xe);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = pr(e);
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
				dynamicParameters: _w(e),
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
		let t = this.getState(e), n = mw(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			ny(e, "top", 0), ny(e, ty, 0);
			return;
		}
		if (n.length > 0) {
			let e = pw(n[n.length - 1]).bottom - pw(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / fw(n))));
		}
		let r = vw(e, Xe), i = vw(e, Ye), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		ny(e, "top", a), ny(e, ty, o);
	}
	windowSize(e) {
		let t = vw(e, Je);
		return t !== null && t > 0 ? t : ow;
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
function dw(e) {
	return e !== null && e.toLowerCase() === "true";
}
function fw(e) {
	let t = pw(e[0]).top, n = 1;
	for (; n < e.length && pw(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function pw(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function mw(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function hw(e) {
	return mw(e).length;
}
function gw(e) {
	return e.getAttribute(m);
}
function _w(e) {
	let t = e.closest(_);
	return t === null ? [] : or(t, ar(t));
}
function vw(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var yw = [
	ce,
	le,
	ue
];
function bw(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, xw(c, e.itemRole);
	let l = Cw(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = Sw(l, t, n, a);
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
		d.className = l.wrapperClassName, xw(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), ZC(d, r, n), c.appendChild(d);
	}
	return ZC(c, r, n), o.registerItemScope(c, l, n), c;
}
function xw(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function Sw(e, t, n, r) {
	let i = tw(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function Cw(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of yw) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), x(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function ww(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return Tw(i.renderer.renderItem(e, t, n, r), a);
	let s = bw(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), Tw(s, a);
}
function Tw(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var Ew = 6, Dw = 60, Ow = class {
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
		let n = _x(e) && yx(e);
		this.project(e, t), this.layout(e, t), n && !yx(e) && (Cx(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Ha(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = Rv(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? na(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = YC(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Hv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Kv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Wv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => Mw(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Jv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = Mw(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Jv(e.item, t.item, a))), e !== "" && l.push({
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
		let t = xx(e.target);
		if (t === null || ey(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, Dw));
	}
	layout(e, t) {
		let n = t.projected, r = Pw(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (Nw(e) && a > 0) {
			let r = Sx(e), c = Aw(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - Ew), s = Math.min(a, s + Ew);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(Mw(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), jw(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (jw(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of Rv(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Le}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = Fw(i, 0, o), p = Fw(i, s, a);
		ry(e, [...l, ...zv(Bv(e))]), ny(e, "top", f > 0 ? f - r : 0), ny(e, ty, p > 0 ? p - r : 0), Vv(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return ww(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(Le, ""), r);
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(Mw(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (kw(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(Mw(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = mr(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of Rv(e)) {
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
function kw(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function Aw(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (Cx(e, i + s), i + s);
}
function jw(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = Mw(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function Mw(e) {
	let t = Av(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function Nw(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function Pw(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function Fw(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var Iw = "data-ui-template", Lw = "default", Rw = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? Lw, r = this.findTemplate(e, n);
		return r === void 0 ? n === Lw ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${Iw}]`);
		for (let e of r) if (e.getAttribute(Iw) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= zw(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Pe);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Fe);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function zw(e) {
	let t = /* @__PURE__ */ new Set();
	return Wr(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(_)) {
			let n = x(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/metadata/metadata-reader.ts
var Bw = "script[type='application/json'][data-ui-metadata]";
function Vw(e = document) {
	let t = e.querySelector(Bw);
	if (t === null) return Hw();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return Hw();
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
		itemValues: r.itemValues ?? [],
		words: r.words ?? []
	};
}
function Hw() {
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
var Uw = "script[type='application/json'][data-ui-hydration]";
function Ww(e = document) {
	let t = e.querySelector(Uw)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t), n = e.words;
		return {
			pageId: e.pageId ?? null,
			view: typeof e.view == "string" ? e.view : null,
			changes: e.changes,
			words: typeof n?.language == "string" && typeof n.href == "string" ? {
				language: n.language,
				href: n.href
			} : null,
			title: e.title ?? null
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var Gw = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(Kw(qw(e)));
	}
	async dispatchAsync(e) {
		let t = qw(e), n = Kw(t);
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
function Kw(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function qw(e) {
	return {
		eventId: y(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var Jw = class {
	values = /* @__PURE__ */ new Map();
	scopes = /* @__PURE__ */ new Map();
	unplaced = /* @__PURE__ */ new Map();
	unplacedPathByEntry = /* @__PURE__ */ new Map();
	get(e, t = []) {
		return this.values.get(this.createKey(e, t))?.value;
	}
	has(e, t = []) {
		return this.values.has(this.createKey(e, t));
	}
	set(e, t, n, r = []) {
		let i = this.createKey(e, t), a = this.values.get(i);
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Ha(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = Yw(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(Xw([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(Yw(e, t));
		let n = this.unplaced.get(Xw(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = Yw(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(Xw([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = Xw(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, Xw(t.slice(0, e - 1)));
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
		return `${y(e.componentId)}:${e.propertyId}:${Zw(t)}`;
	}
};
function Yw(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function Xw(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Zw(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var Qw = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, $w = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, eT = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, tT = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, nT = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, rT = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, iT = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, aT = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, oT = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, sT = class {
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
var cT = class {
	constructor() {}
	log(e, t) {}
};
cT.instance = new cT();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var lT = "10.0.11", K = class {
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
function uT(e, t) {
	let n = "";
	return fT(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${dT(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function dT(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function fT(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function pT(e, t, n, r, i, a) {
	let o = {}, [s, c] = _T();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${uT(i, a.logMessageContent)}.`);
	let l = fT(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function mT(e) {
	return e === void 0 ? new gT(G.Information) : e === null ? cT.instance : e.log === void 0 ? new gT(e) : e;
}
var hT = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, gT = class {
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
function _T() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, vT(lT, yT(), xT(), bT())];
}
function vT(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function yT() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function bT() {
	if (q.isNode) return process.versions.node;
}
function xT() {
	return q.isNode ? "NodeJS" : "Browser";
}
function ST(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function CT() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var wT = class extends sT {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(CT());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new eT();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new eT();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new $w();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, fT(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new Qw(await TT(i, "text") || i.statusText, i.status);
		let a = await TT(i, e.responseType);
		return new oT(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function TT(e, t) {
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
var ET = class extends sT {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new eT()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (fT(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new eT());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new oT(r.status, r.statusText, r.response || r.responseText)) : n(new Qw(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new Qw(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new $w());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, DT = class extends sT {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new wT(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new ET(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new eT()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, OT = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
OT.RecordSeparatorCode = 30, OT.RecordSeparator = String.fromCharCode(OT.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var kT = class {
	writeHandshakeRequest(e) {
		return OT.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (fT(e)) {
			let r = new Uint8Array(e), i = r.indexOf(OT.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(OT.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = OT.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var AT = class {
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
		return this.observers.push(e), new hT(this, e);
	}
}, jT = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			fT(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new MT(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, fT(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, MT = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, NT = 3e4, PT = 15e3, FT = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var IT = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? NT, this.keepAliveIntervalInMilliseconds = a ?? PT, this._statefulReconnectBufferSize = o ?? FT, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new kT(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new jT(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new eT("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new AT();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${ST(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${ST(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new eT("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${ST(t)}`);
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
}, LT = [
	0,
	2e3,
	1e4,
	3e4,
	null
], RT = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? LT : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, zT = class {};
zT.Authorization = "Authorization", zT.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var BT = class extends sT {
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
		e.headers ||= {}, this._accessToken ? e.headers[zT.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[zT.Authorization] && delete e.headers[zT.Authorization];
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
var VT = class {
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
}, HT = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new VT(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = _T(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new Qw(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${uT(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new Qw(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof $w ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? pT(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = _T();
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
			i ? i instanceof Qw && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, UT = class {
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
				let [r, i] = _T();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${uT(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? pT(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, WT = class {
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
				let t = {}, [r, i] = _T();
				t[r] = i, n && (t[zT.Authorization] = `Bearer ${n}`), o && (t[zT.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${uT(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${uT(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, GT = 100, KT = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = mT(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new BT(n.httpClient || new DT(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new eT(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new eT(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new JT(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new eT("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < GT);
				if (r === GT && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof HT && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = _T();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new iT("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof Qw && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new iT(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new rT(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new eT(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new aT(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new WT(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new UT(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new HT(this._httpClient, this._logger, this._options);
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
		if (qT(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new tT(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new nT(`'${X[i]}' is disabled by the client.`, i);
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
function qT(e, t) {
	return !e || (t & e) !== 0;
}
var JT = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new YT(), this._transportResult = new YT(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new YT(), this._transportResult.promise;
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
			this._sendBufferedData = new YT();
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
}, YT = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, XT = "json", ZT = class {
	constructor() {
		this.name = XT, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = cT.instance);
		let n = OT.parse(e), r = [];
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
		return OT.write(JSON.stringify(e));
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
}, QT = {
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
function $T(e) {
	let t = QT[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var eE = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), tE(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = $T(e);
			this.logger = new gT(t);
		} else this.logger = new gT(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new RT(e) : e : new RT(), this;
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
		let t = new KT(this.url, e);
		return IT.create(t, this.logger || cT.instance, this.protocol || new ZT(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function tE(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var nE = class {
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
}, rE = class {
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
}, iE = 500;
function aE(e) {
	let { changes: t, ...n } = e;
	return n;
}
function oE() {
	return {};
}
var sE = class {
	windowId;
	connection;
	started = !1;
	gate = new nE();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new rE(t), this.connection = new eE().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, aE));
	}
	async processChangeSetAsync(e, t) {
		await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, oE, t));
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", [{ theme: e }]);
	}
	async setLanguageAsync(e) {
		return await this.invokeAsync("SetLanguageAsync", [{ language: e }]);
	}
	async translateAsync(e, t) {
		return (await this.invokeAsync("TranslateAsync", [{
			language: e,
			keys: t
		}]))?.words ?? {};
	}
	async requestItemWindowAsync(e) {
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, oE));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), iE);
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
}, cE = "/_ne/values", lE = 3e4;
function uE(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function dE(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function fE(e, t = lE) {
	if (e === void 0 || !dE(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${cE}/${encodeURIComponent(n)}`, {
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
async function pE(e) {
	let t = await fetch(cE, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(lE)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var mE = Promise.resolve(), hE = () => {}, gE = class {
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
		if (this.handed >= this.given) return mE;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = uE(e.value), r = n === null ? null : pE(n);
		return r?.catch(hE), new Promise((n, i) => {
			let a = _E(e), o = this.queue.findIndex((e) => e.field === a), s = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, vE(r));
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
function _E(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function vE(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var yE = document;
function bE() {
	try {
		return yE.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/navigation-url.ts
function xE(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = SE(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function SE(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, CE(e));
	return t.toString();
}
function CE(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/effect-registry.ts
var wE = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Jn(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Jn(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = xE(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!TS(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = Qn(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== n && document.documentElement.setAttribute(Jt, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = EE(e);
			t !== null && AE(t);
		}), this.register("ScrollTo", (e) => {
			let t = EE(e);
			if (t === null) return;
			let n = e.effect, r = Yn(n.behavior), i = Xn(n.block);
			t.scrollIntoView({
				behavior: DE(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = EE(e);
			if (t === null) return;
			let n = e.effect, r = $n(n.axis) !== "Horizontal", i = OE(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Zn(n.position), u;
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
			let d = DE(Yn(n.behavior));
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			TE(EE(e), null);
		}), this.register("Hide", (e) => {
			TE(EE(e), "hidden");
		}), this.register("Collapse", (e) => {
			TE(EE(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = jE(e, this.valueReaders);
			t !== null && ME(t).catch((e) => s("copy to clipboard failed.", e));
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
			if (!CS(t.requestPath)) {
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
function TE(e, t) {
	if (e !== null) for (let n of un) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function EE(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(y(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function DE(e) {
	return e === "Smooth" && !so() ? "smooth" : "auto";
}
function OE(e, t) {
	if (kE(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (kE(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (kE(n, t)) return n;
	return null;
}
function kE(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function AE(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ra))) {
		e.focus();
		return;
	}
	let t = ga(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function jE(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = EE(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : ii(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Qr(t.readHeld(r));
}
async function ME(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!NE(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function NE(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return bE();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var PE = "data-ui-dialog-close-backdrop", FE = "data-ui-dialog-close-escape", IE = "data-ui-dialog-backdrop", LE = class {
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
		let n = ya(t.querySelector(".ui-dialog__surface") ?? t, ga(t));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && wa(xa(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${Go}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${IE}]`);
		if (n === null) return;
		let r = n.closest(`[${Go}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(PE)) return;
		let i = r.getAttribute(Go);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(FE) && !es() && !Sy(e.target) && !Ec(e.target)) {
				let n = t.getAttribute(Go);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(_)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Ko(this.root);
	}
	trapTab(e, t) {
		let n = [...e.querySelectorAll(ra)].filter((e) => Jr(e) || e === document.activeElement);
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
}, RE = /* @__PURE__ */ new Map([
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
]), zE = [
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
function BE(e) {
	return Q(e, zE);
}
var VE = [
	"small",
	"medium",
	"large"
], HE = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], UE = [
	"start",
	"center",
	"end",
	"justify"
], WE = ["nowrap", "wrap"], GE = /* @__PURE__ */ new Map([
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
]), KE = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), qE = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), JE = ["inline", "trailing"], YE = [
	"filled",
	"outline",
	"underline",
	"ghost"
], XE = [
	"small",
	"medium",
	"large"
], ZE = [
	"small",
	"medium",
	"large"
], QE = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], $E = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface"
], eD = ["light", "dark"], tD = [
	"start",
	"center",
	"end",
	"stretch"
], nD = ["clip", "visible"], rD = [
	"visible",
	"hidden",
	"collapsed"
], iD = [
	"background",
	"raised",
	"tinted"
], aD = ["horizontal", "vertical"], oD = [
	"none",
	"gap",
	"rule"
], sD = [
	"none",
	"one",
	"many"
], cD = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], lD = ["stack", "wrap"], uD = [
	"disabled",
	"auto",
	"always"
], dD = [
	"disabled",
	"proximity",
	"mandatory"
], fD = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], pD = ["hex", "rgb"], mD = ["field", "swatch"], hD = [
	"fill",
	"contain",
	"cover",
	"none"
], gD = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], _D = ["linear", "circular"], vD = ["keep", "replace"], yD = [
	"none",
	"vertical",
	"horizontal",
	"both"
], bD = [
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
], xD = [
	"None",
	"Shade",
	"Tint"
], SD = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, zE)}`],
	["themeColorClass", (e) => qD(e)],
	["iconClass", (e) => bS(e)],
	["iconUrlCss", (e) => pS(e)],
	["safeUrl", (e) => wS(e)],
	["safeImageSource", (e) => ES(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : RS(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, VE)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, HE)}`],
	["textAppearanceClass", (e) => XD(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, UE)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, WE)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, JE)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, $E)}`],
	["badgeTextFit", (e) => JD(e)],
	["buttonClass", (e) => `ui-button--${Q(e, QE)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, iD)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, aD)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, oD)}`],
	["selectionModeAttribute", (e) => Q(e, sD)],
	["selectionBackgroundCss", (e) => VD(RD(e, "background"))],
	["selectionForegroundCss", (e) => VD(RD(e, "foreground"))],
	["selectionMarkColorCss", (e) => VD(RD(e, "markColor"))],
	["selectionMarkCss", (e) => BD(RD(e, "mark"))],
	["selectionFontWeightCss", (e) => zD(RD(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, lD)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, uD)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, uD)}`],
	["hostViewport", (e) => AD(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, dD)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, YE)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, ZE)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, XE)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, XE)}`],
	["textInputTypeAttribute", (e) => Q(e, fD)],
	["colorTextFormatAttribute", (e) => Q(e, pD)],
	["colorInputVariantAttribute", (e) => Q(e, mD)],
	["themeNameCss", (e) => Q(e, eD)],
	["alignmentCss", (e) => Q(e, tD)],
	["alignmentStretchFallbackCss", (e) => Q(e, tD) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, nD)],
	["layoutLengthCss", (e) => jD(e)],
	["thicknessCss", (e) => MD(e)],
	["borderNoneClass", (e) => ND(e)],
	["radiusCss", (e) => PD(e)],
	["gridUnitCss", (e) => FD(e)],
	["pixelsCss", (e) => oO(e)],
	["gridTemplateCss", (e) => ID(e)],
	["colorVariantCss", (e) => eO(e)],
	["themeColorCss", (e) => VD(e)],
	["themeInkCss", (e) => UD(e)],
	["themeOnColorCss", (e) => GD(e)],
	["themeColorInlineCss", (e) => HD(e) ? "" : VD(e)],
	["themeColorCanonical", (e) => QD(e)],
	["textAppearanceFontSizeCss", (e) => ZD(e, "size")],
	["textAppearanceFontWeightCss", (e) => ZD(e, "weight")],
	["textAppearanceLineHeightCss", (e) => ZD(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => ZD(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => jD(P(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => jD(P(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => jD(P(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => jD(P(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => jD(P(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => MD(P(e, "base"))],
	["responsiveThicknessSmCss", (e) => MD(P(e, "sm"))],
	["responsiveThicknessMdCss", (e) => MD(P(e, "md"))],
	["responsiveThicknessXlCss", (e) => MD(P(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => MD(P(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => sO(P(e, "base"))],
	["responsivePixelsSmCss", (e) => sO(P(e, "sm"))],
	["responsivePixelsMdCss", (e) => sO(P(e, "md"))],
	["responsivePixelsXlCss", (e) => sO(P(e, "xl"))],
	["responsivePixelsXxlCss", (e) => sO(P(e, "xxl"))],
	["visibilityBaseAttribute", (e) => cO(e, "base")],
	["visibilitySmAttribute", (e) => cO(e, "sm")],
	["visibilityMdAttribute", (e) => cO(e, "md")],
	["visibilityXlAttribute", (e) => cO(e, "xl")],
	["visibilityXxlAttribute", (e) => cO(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, hD)}`],
	["backgroundImageCss", (e) => TD(e)],
	["imageFitSizeCss", (e) => Q(e, gD)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, _D)}`],
	["progressValueText", (e) => aO(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, vD)}`],
	["textAreaResizeCss", (e) => Q(e, yD)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, bD)}`],
	["popupPlacementAttribute", (e) => Q(e, bD)],
	["tabMenuEntriesAttribute", (e) => wD(e)]
]), CD = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function wD(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = CD.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function TD(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : mS(t);
}
var ED = [
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
], DD = new Map(ED.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), OD = new Map(ED.map(([e, t]) => [e, t])), kD = /* @__PURE__ */ new Map([[nD, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : kD.get(t)?.get(e)) ?? RE.get(e) ?? kn(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function AD(e) {
	return e == null || Q(e, uD) === "disabled" ? void 0 : "parent";
}
function jD(e) {
	if (e == null) return "";
	if (typeof e == "number") return oO(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? oO(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function MD(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function ND(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function PD(e) {
	if (e == null) return "";
	if (typeof e == "number") return oO(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? oO(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function FD(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return oO(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function ID(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return FD(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return FD(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${FD(e[0])})` : e.map((e) => FD(e)).join(" ");
}
function $(e, t, n) {
	return LD(P(e, t), n);
}
function LD(e, t) {
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
function RD(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function zD(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function BD(e) {
	if (e == null) return "";
	switch (Q(e, cD)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function VD(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if ($D(e)) return eO(e);
	let t = e, n = eO(t.light), r = eO(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = GE.get(Q(o, zE));
	return s ? `var(${s})` : "";
}
function HD(e) {
	if (typeof e != "object" || !e || $D(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function UD(e) {
	if (HD(e)) {
		let t = KE.get(Q(e.style, zE));
		if (t !== void 0) return `var(${t})`;
	}
	return VD(e);
}
var WD = /* @__PURE__ */ new Set(["background", "surface"]);
function GD(e) {
	if (typeof e != "object" || !e) return "";
	if ($D(e)) return KD(e);
	let t = e, n = KD(t.light ?? t.dark), r = KD(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, zE);
	if (WD.has(i)) return "initial";
	let a = qE.get(i);
	return a ? `var(${a})` : "";
}
function KD(e) {
	let t = tO(e);
	return t === void 0 ? "" : qg(t[0], t[1], t[2], t[3]);
}
function qD(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, zE)}`;
}
function JD(e) {
	let t = e == null ? "" : String(e).trim();
	return t.length > 0 && t.length <= 2 ? "compact" : "";
}
function YD(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", JD(n));
}
function XD(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, HE)}`;
}
function ZD(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return oO(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : oO(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : oO(e);
		}
		default: return "";
	}
}
function QD(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = nO(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Kg(r.rgb >> 16 & 255)}${Kg(r.rgb >> 8 & 255)}${Kg(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Kg(e)}`;
	}
	let i = rO(r.name);
	return i === null ? "" : `${i}/${iO(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function $D(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function eO(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = tO(e);
	return t === void 0 ? "" : `#${Kg(t[0])}${Kg(t[1])}${Kg(t[2])}${Kg(t[3])}`;
}
function tO(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = rO(t.name), i = n ?? (r === null ? void 0 : DD.get(r));
	if (!i) return;
	let a = iO(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = F(c * (1 - o)), l = F(l * (1 - o)), u = F(u * (1 - o))) : a === "Tint" && (c = F(c + (255 - c) * o), l = F(l + (255 - l) * o), u = F(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function nO(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = zE[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function rO(e) {
	if (typeof e == "number") return OD.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function iO(e) {
	if (typeof e == "number") return xD[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function aO(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function oO(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function sO(e) {
	return e == null ? "" : oO(e);
}
function cO(e, t) {
	let n = Hm(e, t);
	if (n == null) return;
	let r = Q(n, rD);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var lO = "ui-notification-host", uO = "ui-notification", dO = "ui-notification--leaving", fO = "ui-notification__message", pO = "ui-notification__action", mO = "ui-notification__close", hO = 5e3, gO = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), _O = class {
	root;
	durationMs;
	host = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? hO, this.ensureHost();
	}
	show(e) {
		let t = BE(e.severity), n = document.createElement("div");
		n.className = gO.has(t) ? `${uO} ${uO}--${t}` : uO, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = fO, r.textContent = e.message, n.append(r), e.action !== void 0 && n.append(yO(e.action));
		let i = document.createElement("button");
		if (i.type = "button", i.className = mO, i.setAttribute("aria-label", S.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), this.ensureHost().append(n), e.sticky === !0) return n;
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
		if (!(!e.isConnected || e.classList.contains(dO))) {
			if (e.classList.add(dO), so() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => vO(e), oo.fast);
		}
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${lO}`), n = t ?? document.createElement("div");
		return n.classList.add(lO), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function vO(e) {
	if (!e.isConnected) return;
	let t = getComputedStyle(e), n = e.parentElement === null ? 0 : parseFloat(getComputedStyle(e.parentElement).rowGap) || 0;
	e.style.overflow = "hidden";
	let r = e.animate([{
		height: t.height,
		paddingTop: t.paddingTop,
		paddingBottom: t.paddingBottom,
		borderTopWidth: t.borderTopWidth,
		borderBottomWidth: t.borderBottomWidth,
		marginTop: "0px"
	}, {
		height: "0px",
		paddingTop: "0px",
		paddingBottom: "0px",
		borderTopWidth: "0px",
		borderBottomWidth: "0px",
		marginTop: `${-n}px`
	}], {
		duration: oo.fast,
		easing: oo.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function yO(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${pO} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var bO = class {
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = !1;
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
			let n = this.extensions.converters.convert(t.converter, a);
			for (let c of i) {
				let i = this.addressResolver.resolveOperationTargets(c, t);
				if (i.length === 0) {
					t.optional !== !0 && s("property operation target was not found.", {
						reference: e,
						operation: t
					});
					continue;
				}
				for (let s of i) {
					if (!r && !this.restoring && this.holdsProperty(s, e.propertyId)) {
						o = !0;
						continue;
					}
					this.operations.apply({
						resolved: c,
						operation: t,
						target: s,
						value: a,
						convertedValue: n,
						local: r
					});
				}
			}
		}
		!this.state.set(e, t, n, SO(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Gr(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Oe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, SO(r[0]?.component)) ? {
			reference: e,
			propertyName: r[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: this.shownValue(e, n),
			local: !0,
			components: r.map((e) => e.component)
		} : null;
	}
	rewriteWords() {
		for (let e of [...this.state.entries()]) {
			let t = e.value;
			(typeof t == "string" ? this.addressResolver.isTranslatable(e.reference) : Tr(t)) && this.applyPropertyValue(e.reference, e.dynamicParameters, t, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${De}${kn(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Mn(e, t, () => xO(e, a))) this.operations.apply({
				resolved: r,
				operation: t,
				target: o,
				value: i,
				convertedValue: n,
				local: !0
			});
		}
	}
	applyToComponent(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return !1;
		let i = this.shownValue(t, n);
		for (let e of r.definition.operations) {
			let t = this.extensions.converters.convert(e.converter, i);
			for (let n of this.addressResolver.resolveOperationTargets(r, e)) this.operations.apply({
				resolved: r,
				operation: e,
				target: n,
				value: i,
				convertedValue: t,
				local: !0
			});
		}
		return this.notifyValueChanged({
			reference: t,
			propertyName: r.propertyName,
			dynamicParameters: [],
			value: i,
			local: !0,
			components: [e]
		}), !0;
	}
	writeBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Oe))), r = e.closest(_);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Oe)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			ci(e);
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
function xO(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(_) === e) return [n];
	return [e];
}
function SO(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(_) ?? null, r = e === null ? 0 : x(e), i = n.getAttribute(m);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: or(e, ar(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var CO = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Ea) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = y(e.componentId), r = wO(n, e.propertyId), i = this.watchers.get(r);
		if (i === void 0) {
			i = /* @__PURE__ */ new Set(), this.watchers.set(r, i);
			let t = this.sourcesByComponent.get(n) ?? [];
			t.push(e), this.sourcesByComponent.set(n, t);
		}
		return i.add(t), () => {
			i?.delete(t);
		};
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = pr(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = wO(y(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function wO(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/held-collections.ts
var TO = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, EO(t));
	}
	apply(e) {
		let t = y(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Gn(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) DO(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) OO(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) kO(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) AO(n, t.key, t.newIndex);
				break;
			case "Reset": n.length = 0;
		}
	}
	get(e) {
		return this.collections.get(e);
	}
	markWaiting(e, t) {
		this.waiting.set(e, t);
	}
	isWaiting(e) {
		return this.waiting.has(e);
	}
	takeWaiting(e) {
		let t = this.waiting.get(e);
		if (t !== void 0) return this.waiting.delete(e), this.collections.get(t);
	}
};
function EO(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function DO(e, t) {
	typeof t.key == "string" && (OO(e, t.key), e.splice(jO(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function OO(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function kO(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		DO(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function AO(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(jO(n, e.length), 0, i);
}
function jO(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/updates/collection-sinks.ts
var MO = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function NO(e, t, n, r) {
	return {
		action: Gn(e.action),
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
var PO = class {
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
	held = new TO();
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${h}]`)) {
			let e = pr(n);
			e !== null && this.held.get(e) !== void 0 && (n.replaceChildren(), this.held.markWaiting(n, e), t.push([n, e]));
		}
		t.length !== 0 && queueMicrotask(() => {
			for (let [e, n] of t) {
				let t = this.held.takeWaiting(e);
				e.isConnected && t !== void 0 && this.refillHost(e, {
					componentId: n,
					dynamicParameters: [],
					items: t
				});
			}
		});
	}
	holdsCollection(e, t) {
		return t.length === 0 && this.itemsTemplates.isTemplateComponent(e);
	}
	registerServerRenderedItems(e) {
		let t = /* @__PURE__ */ new Map(), n = (e) => {
			let n = t.get(e);
			return n === void 0 && (n = VO(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = mr(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (qn(t) !== "CollectionChange") continue;
			let e = t;
			if (Gn(e.action) === "Insert") for (let t of this.findItemsHosts(y(e.component?.id), e.component?.dynamicParameters ?? [])) {
				let r = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n) {
		if (t == null) return;
		let r = e.get(t) ?? null;
		r !== null && this.readItemScope(r) === void 0 && this.itemsRenderer.registerItemScope(r, BO(r), n);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = pr(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		vy(e, t, {
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
				let r = RO(n, t[e + 1]);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Me) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.holdsCollection(e.componentId, e.dynamicParameters);
		t && this.held.hold(e.componentId, e.items);
		let n = this.findItemsHosts(e.componentId, e.dynamicParameters);
		if (n.length === 0) {
			t ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
			return;
		}
		for (let r of n) t && this.held.isWaiting(r) || this.refillHost(r, e);
	}
	refillHost(e, t) {
		if (ey(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = VO(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && Ha(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), zO(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (qn(e)) {
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
		let t = y(e.address?.component?.id), n = Kn(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		this.propertyPatchEngine.applyPropertyValue(e.content === !0 ? {
			...i,
			content: !0
		} : i, r, e.value, !1);
	}
	applyValidationUpdate(e) {
		if (y(e.address?.component?.id) <= 0) {
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
		let t = y(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, NO(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		this.forgetRowState(t, n, e);
		let a = this.holdsCollection(t, n);
		a && this.held.apply(e);
		let o = this.findItemsHosts(t, n);
		if (o.length === 0) {
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Gn(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of o) a && this.held.isWaiting(n) || this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (ey(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (Gn(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				FO(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				LO(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), dy(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (Gn(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Gn(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${h}]`)) if (pr(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = ay(e, Rv(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, sy(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return ww(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Rv(e), a = ay(e, i), o = VO(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, sy(a, l, i.index ?? null)) : (uy(a, c, l), c.replaceWith(l)));
		}
	}
};
function FO(e, t) {
	let n = Rv(e), r = ay(e, n), i = VO(e, n), a = IO(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? na(a, o, n) : null;
		i.delete(t), cy(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function IO(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function LO(e, t) {
	let n = Rv(e), r = ay(e, n), i = VO(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, ly(r, t, n.newIndex ?? null));
	}
}
function RO(e, t) {
	if (t === void 0 || qn(e) !== "CollectionChange" || qn(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (Gn(n.action) !== "Reset" || Gn(r.action) !== "Insert") return null;
	let i = y(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== y(r.component?.id) || !Ha(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function zO(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? Rv(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function BO(e) {
	let t = x(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : x(n);
}
function VO(e, t = Rv(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(m);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function HO(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Tr(n) || Er(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: WO(t.severity)
	} : void 0;
}
function UO(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = S.resolve(Tr(t) || Er(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function WO(e) {
	let t = Hn(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var GO = "ui-validation--warning", KO = "ui-validation--info", qO = "data-ui-validation-message", JO = "ui-validation-message--marker", YO = "top-end", XO = "--ui-validation-marker-host", ZO = "ui-validation-mark", QO = "--ui-validation-presentation", $O = "--ui-validation-color", ek = "Validation", tk = `input:not([type='hidden']), textarea, select, .${xn}[role='combobox'], [role='spinbutton']`, nk = {
	Error: 0,
	Warning: 1,
	Info: 2
}, rk = {
	Error: En,
	Warning: GO,
	Info: KO
}, ik = `.${En}, .${GO}, .${KO}`, ak = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, ok = {
	Error: `${ZO}--error`,
	Warning: `${ZO}--warning`,
	Info: `${ZO}--info`
}, sk = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, ck = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	packageMarkByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(ik)), O(this.root, ik, { childList: !0 }, (e) => this.applyRenderedMessages(e)), S.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(ik)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			dk(t, lk(t) === "Error");
			let e = t.querySelector(`:scope > [${qO}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && fk(this.markerMirrors, t, e, {
				message: n,
				severity: lk(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === ek) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = y(e.reference.componentId), n = HO(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = y(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Vn(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = y(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) typeof r != "string" || r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: WO(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: sk[t]
		}), this.applyCurrentState(x(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		uk(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${y(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
		if (n !== void 0) a === void 0 && (a = {
			target: r.message,
			lines: /* @__PURE__ */ new Map()
		}, this.messageLines.set(i, a)), a.lines.set(t, n);
		else {
			if (a === void 0 || !a.lines.delete(t)) return;
			a.lines.size === 0 && this.messageLines.delete(i);
		}
		this.writeLines(a);
	}
	writeLines(e) {
		for (let t of [...e.lines.keys()]) t.isConnected || e.lines.delete(t);
		this.options.propertyPatchEngine.applyPropertyValue({
			...e.target,
			content: !0
		}, [], [...e.lines.values()].map(UO).join("\n"), !0);
	}
	rewriteMessageLines() {
		for (let e of this.messageLines.values()) this.writeLines(e);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t), a = this.packageMarkByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i), a !== void 0 && n.push(a);
		let o = this.failingRulesByElement.get(t);
		if (o !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) o.has(t) && n.push({
			message: t.message,
			severity: WO(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || nk[e.severity] < nk[s.severity]) && (s = e);
		return s;
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Vn(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${et}="${On(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Vn(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && WO(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Xa(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function lk(e) {
	return e.classList.contains(GO) ? "Warning" : e.classList.contains(KO) ? "Info" : "Error";
}
function uk(e, t, n) {
	for (let e of Object.values(rk)) t.classList.toggle(e, n !== void 0 && rk[n.severity] === e);
	dk(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty($O) : r.style.setProperty($O, `var(--ui-color-${ak[n.severity]})`);
	let i = t.querySelector(`[${qO}]`);
	i !== null && (n?.content === !0 ? (Br(i, null), i.textContent = String(n.message ?? "")) : S.writeValue(i, null, n?.message ?? null), fk(e, r, i, n));
}
function dk(e, t) {
	for (let n of e.querySelectorAll(tk)) {
		let r = n.closest(bn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function fk(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(QO).trim() === "marker";
	if (n.classList.toggle(JO, a), r !== void 0 && a) {
		n.setAttribute(Se, n.textContent ?? ""), n.setAttribute(Ce, YO), t.setAttribute(we, ""), pk(e, t, r, n.textContent ?? "", i.getPropertyValue(XO).trim()), t.contains(document.activeElement) ? RC(n) : zC(n);
		return;
	}
	n.removeAttribute(Se), n.removeAttribute(Ce), t.removeAttribute(we), pk(e, t, void 0, "", ""), zC(n);
}
function pk(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : mk(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${ZO} ${ok[n.severity]}`, s.textContent = r, s.setAttribute(Se, r), s.setAttribute(Ce, YO), s.parentElement !== o && o.append(s), e.set(t, s), zC(s);
}
function mk(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var hk = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, gk = /* @__PURE__ */ new WeakMap(), _k = /* @__PURE__ */ new Map([["iconClass", yS]]), vk = /* @__PURE__ */ new WeakMap(), yk = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Un(e), t);
	}
	apply(e) {
		let t = Un(e.operation.kind), n = this.handlers.get(t);
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
			let t = Qr(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Br(e.target, null);
		}), this.register("Markup", (e) => {
			zS(e.target, $r(e.convertedValue) ? "" : Qr(e.convertedValue)), Br(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = Ek(e.operation);
			if (Br(e.target, t), $r(e.value) || $r(e.convertedValue)) {
				Tk(e.target, t);
				return;
			}
			wk(e.target, t, Qr(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = Ek(e.operation);
			Br(e.target, t), Tk(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = Ek(e.operation), n = !$r(e.value) && bk(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? ($r(e.convertedValue) ? "" : Qr(e.convertedValue));
			xk(e.target, Ck(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !$r(e.value) && bk(e.value, e.operation.condition ?? "None") ? Qr(e.convertedValue).trim() : "";
			Sk(e.target, Ck(e), t, _k.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = Ek(e.operation), n = !$r(e.value) && bk(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Qr(e.convertedValue).trim() : "";
				Sk(e.target, Ck(e), t);
			}
		}), this.register("Style", (e) => {
			let t = Ek(e.operation), n = e.target;
			if ($r(e.value) || $r(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Qr(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register("Property", (e) => {
			let t = Ek(e.operation), n = e.target, r = $r(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function bk(e, t) {
	switch (Wn(t)) {
		case "None": return !0;
		case "HasValue": return !$r(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !$r(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return bS(e).length > 0;
		default: return !$r(e);
	}
}
function xk(e, t, n, r, i) {
	let a = vk.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), vk.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), wk(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && Tk(e, n);
}
function Sk(e, t, n, r) {
	let i = gk.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), gk.set(e, i));
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
function Ck(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function wk(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Tk(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function Ek(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var Dk = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => SD.has(e.name),
			convert: (e) => SD.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = Ok(e.name), n = {
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
function Ok(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var kk = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = b(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = b(e.domEventName) || t;
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
		return this.definitions.get(b(e));
	}
};
function Ak(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function jk(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => Ak(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => Ak(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var Mk = class {
	converters = new Dk();
	events = new kk();
	operations = new yk();
	valueReaders;
	collectionSinks = new MO();
	rowDecorators = new hk();
	constructor(e, t, n, r) {
		jk(this.events), this.valueReaders = new ti(r);
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
}, Nk = "Submenu", Pk = "ui-menu__submenu", Fk = "Select", Ik = {
	kind: "menu",
	decorate: Lk
};
function Lk(e) {
	if (!Rk(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, Nk);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(rt, ""), zk(e.item, "Kind") === Fk && e.row.setAttribute(it, ""), zk(e.item, "Expanded") === !0 && e.row.setAttribute(at, "");
	let r = document.createElement("div");
	r.className = Pk, r.appendChild(n), ZC(r, e.key, e.item), e.row.appendChild(r);
}
function Rk(e) {
	let t = zk(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function zk(e, t) {
	let n = Av(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/runtime/engine-start.ts
var Bk = 2;
function Vk(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= Bk && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function Hk(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var Uk = "ne.standard.ui.windowId", Wk = [
	500,
	1e3,
	2e3
], Gk = 3, Kk = [
	["refusal", ({ root: e }) => Yx(e)],
	["file input", ({ root: e }) => new Qs({ root: e })],
	["image input", ({ root: e }) => new pc({ root: e })],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new Tc({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new Ic({ root: e })],
	["field box press", ({ root: e }) => new Fc({ root: e })],
	["image fallback", ({ root: e }) => new zc({ root: e })],
	["radio group sync", ({ root: e }) => new Yc({ root: e })],
	["select interaction", ({ root: e }) => new ru({ root: e })],
	["search input", ({ root: e }) => new vl({ root: e })],
	["debounced commit", ({ root: e }) => new fu({ root: e })],
	["items selection", ({ root: e }) => new Dy({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new wu({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["number input", ({ root: e, propertyPatchEngine: t }) => new sd({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new C_({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new jf({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new hp({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new Dp({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new Xb({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new Ip({ root: e })],
	["split button", ({ root: e }) => new Gh({ root: e })],
	["toggle button", ({ root: e }) => new kc({ root: e })],
	["button group", ({ root: e }) => new Zh({ root: e })],
	["menu", ({ root: e }) => new tm({ root: e })],
	["collapsible", ({ root: e }) => new Zm({ root: e })],
	["menu group", ({ root: e }) => new ym({ root: e })],
	["menu search", ({ root: e }) => new Am({ root: e })],
	["side drawer", ({ root: e }) => new Gm({ root: e })],
	["grid splitter", ({ root: e }) => new Ah({ root: e })],
	["accordion", ({ root: e }) => new tg({ root: e })],
	["tabs", ({ root: e }) => new Sg({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new kb({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new jg({ root: e })],
	["breadcrumbs", ({ root: e }) => new Wg({ root: e })],
	["scroll anchor", ({ root: e }) => new gx({ root: e })],
	["scroll group", ({ root: e }) => new Ax({ root: e })],
	["flyout interaction", ({ root: e }) => new ws({ root: e })],
	["text fold", ({ root: e }) => new Vb({ root: e })],
	["tooltip", ({ root: e }) => CC(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new Bx({ root: e }) : void 0]
], qk = class {
	windowId;
	options;
	root;
	metadata = new Pn(Vw());
	hydration = Ww();
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
	languageSwitches = 0;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = Zk(e.windowIdStorageKey ?? Uk), this.dom = new fr(this.root), S.load(this.root), S.setLanguage(document.documentElement.lang), e.strings !== void 0 && S.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : S.loadTableAsync(this.hydration.words.href)), this.extensions = new Mk(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(Ik);
		let t = new ir(this.dom, this.metadata), n = this.extensions.operations, r = new Jw(), i = new bO(t, n, this.extensions, r);
		this.reactiveSources = new CO(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new LE({ root: this.root }), this.notifications = new _O({ root: this.root }), this.effects = new wE({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new eo(this.metadata), o, u = new Ga(a, i, new Ya(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(y(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new Rw(this.dom), f = new qC(this.metadata, d, this.extensions, n, r);
		this.virtualization = new Ow({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new PO(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), S.onChange(() => this.rewriteWords(i, f)), new rw({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new sE(this.windowId, (e) => this.applyChanges(e), e.signalR), this.dispatcher = new Gw(this.transport), S.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Nn.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		});
		let p = new gE(this.transport);
		o = new ja({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(Nn.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new ck({
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
		for (let [e, t] of Kk) Vk(e, t, this.engineContext);
		Vk("tree", ({ root: e, effects: t }) => new Jy({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), this.eventPipeline = new Ra({
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
		this.eventPipeline.addEvent(Db.name, Db.registration), this.tables = new mv({ root: this.root }), this.windows = new uw({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: S,
			observeComponents: O,
			observeSize: H_,
			dialogs: this.dialogs,
			store: new cm(),
			numbers: Vu,
			temporal: Sd,
			icons: { apply: _S },
			badges: { writeCount: YD },
			values: {
				read: (e) => this.extensions.valueReaders.readHeld(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(_), a = r === null ? void 0 : this.metadata.getExposedProperty(x(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: LC,
			renames: { open: Cy },
			tables: this.tables,
			rows: KC(d, f, this.virtualization),
			uploads: Ws,
			selection: Ui,
			popups: GC,
			roving: gi,
			states: Zr,
			validation: ee,
			wheel: hf,
			names: Dn
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
	gateInbound(e) {
		if (e === null) return;
		let t = e.then(() => void 0, () => void 0);
		this.inbound = t, t.then(() => {
			this.inbound === t && (this.inbound = null);
		});
	}
	async switchLanguageAsync(e, t) {
		if (e === S.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		S.setRequested(e);
		try {
			if (r === null) try {
				let t = await this.transport.setLanguageAsync(e);
				r = t.href, i = t.language;
			} catch (t) {
				s("the session was not told the page's language.", {
					language: e,
					error: t
				});
			}
			if (n !== this.languageSwitches || i === S.language || !await S.switchToAsync(i, r)) return;
			S.notifyChanged();
		} finally {
			n === this.languageSwitches && S.setRequested(null);
		}
	}
	rewriteWords(e, t) {
		let n = performance.now();
		this.dom.invalidate(), S.rewriteMarks(this.root), this.rewriteStaticWords(e), e.rewriteWords(), t.rewriteRowWords(this.root);
		let r = this.hydration?.title ?? null;
		if (r !== null) {
			let e = String(S.resolve(r, !0));
			document.title !== e && (document.title = e);
		}
		S.language.length > 0 && document.documentElement.lang !== S.language && (document.documentElement.lang = S.language), d("page's words written again", n, { language: S.language });
	}
	rewriteStaticWords(e) {
		let t = this.metadata.getWords();
		if (t.length === 0) return;
		let n = [];
		Wr(this.root, (e) => {
			e !== this.root && n.push(e);
		});
		for (let r of t) {
			let t = y(r.componentId), i = {
				componentId: t,
				propertyId: r.propertyId
			}, a = r.dynamicParameters ?? [];
			for (let n of this.findWordInstances(t, a)) e.rewriteStatic(n, i, r.key);
			for (let o of n) for (let n of o.querySelectorAll(`[${ce}="${On(t)}"]`)) cr(n, a) && e.rewriteStatic(n, i, r.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => cr(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: S.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: S.text("ui.connection.reload"),
				run: () => window.location.reload()
			}
		});
	}
	reloadForView(e) {
		if (nA() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), rA(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await Xk();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
	}
	async connectAsync() {
		try {
			let e = performance.now();
			return await this.transport.startAsync(), d("SignalR connection opened", e), !0;
		} catch (e) {
			return this.loseConnection(e), !1;
		}
	}
	async hydrateAsync() {
		if (this.hydration === null) return;
		let e = performance.now(), t = this.hydration.changes;
		this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(t), await this.applyChanges(t), this.updateProcessor.initializeItemsHosts(), d("runtime hydrated from the page", e, {
			pageId: this.hydration.pageId,
			updates: t?.updates?.length ?? 0
		});
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) Vk(Hk(t), t, this.pluginContext);
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
		S.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		Vk(Hk(e), e, this.pluginContext);
	}
	applyChanges(e) {
		if (this.inbound === null && !dE(e)) {
			this.applyNow(e);
			return;
		}
		let t = (this.inbound ?? Promise.resolve()).then(() => fE(e)).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= Gk) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (iA(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(dE(e) ? await fE(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = $k(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? eA(window.location.search) : e.parameters
		};
		for (let e = 0;; e++) try {
			return await this.transport.attachAsync(t);
		} catch (t) {
			if (e >= Wk.length) return c("attaching the runtime failed after retrying; giving up.", t), null;
			s("attaching the runtime failed; retrying.", {
				attempt: e + 1,
				error: t
			}), await Yk(Wk[e]);
		}
	}
};
async function Jk(e = {}) {
	let t = performance.now(), n = new qk(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function Yk(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function Xk() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function Zk(e) {
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
	let n = Qk();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function Qk() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function $k() {
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
function eA(e) {
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
var tA = "ne-standard-ui:reloaded-view";
function nA() {
	try {
		return sessionStorage.getItem(tA);
	} catch {
		return null;
	}
}
function rA(e) {
	try {
		sessionStorage.setItem(tA, e);
	} catch {}
}
function iA() {
	try {
		sessionStorage.removeItem(tA);
	} catch {}
}
re(), Jk().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
