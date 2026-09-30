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
var m = "data-ui-id", ce = "data-ui-context", le = "data-ui-pc", h = "data-ui-key", ue = "data-ui-unselectable", de = "data-ui-undraggable", fe = "data-ui-unremovable", pe = "data-ui-unrenamable", me = "data-ui-no-context-menu", he = "data-ui-no-row-open", ge = "data-ui-no-row-drag", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-draggable", be = "data-ui-tabs-menu", xe = "data-ui-context-menu", Se = "data-ui-context-menu-use", Ce = "data-ui-row-focus", we = "data-ui-tooltip", Te = "data-ui-tooltip-placement", Ee = "data-ui-tooltip-mark", De = "data-ui-name", Oe = "data-ui-bind-", ke = "data-ui-into-", Ae = "data-ui-bind-value", je = (e) => `data-ui-no-${e}`, Me = "data-ui-event-boundary", Ne = "data-ui-image-caption", g = "data-ui-items-host", Pe = "data-ui-collection-sink", Fe = "data-ui-items-query", Ie = "data-ui-number-culture", Le = "data-ui-page-culture", Re = "data-ui-temporal-culture", ze = "data-ui-empty-template", Be = "data-ui-group-template", Ve = "data-ui-empty-placeholder", He = "data-ui-group-header", Ue = "data-ui-group", We = "data-ui-value-holder", Ge = "data-ui-value-kind", Ke = "items-query", qe = "data-ui-host-mode", Je = "data-ui-host-viewport", Ye = "data-ui-scroll-group", Xe = "data-ui-scroll-lines", Ze = "data-ui-source-line", Qe = "data-ui-window-spacer", $e = "data-ui-window-size", et = "data-ui-window-offset", tt = "data-ui-window-total", nt = "data-ui-window-more-before", rt = "data-ui-window-more-after", it = "data-ui-window-aggregates", at = "data-ui-form-id", ot = "data-ui-visibility", st = "data-ui-collapsed", ct = "data-ui-menu-group", lt = "data-ui-menu-select", ut = "data-ui-menu-open", dt = "data-ui-menu-search", ft = "data-ui-menu-searching", pt = "data-ui-menu-unmatched", mt = "data-ui-drawer-toggle", ht = "data-ui-drawer-open", gt = "data-ui-region", _t = "data-ui-menu-item-kind", vt = "ui-menu-item", yt = "ui-menu-item--checked", bt = `[${_t}="header"], [${_t}="separator"]`, xt = `[${ct}] > .${vt}`, St = `${xt}, .${vt}[${_t}="check"]`, Ct = "data-ui-collapse-toggle", wt = "data-ui-folding", Tt = "data-ui-column-limits", Et = "data-ui-row-limits", Dt = "data-ui-splitter-step", Ot = "data-ui-table-column", kt = "data-ui-table-hide-below", At = "data-ui-table-starts-hidden", jt = "data-ui-table-hidden", Mt = "ui-table__row", Nt = "ui-table__scroll", Pt = "ui-table__header", Ft = "ui-table__resizer", It = "data-ui-table-last", Lt = "data-ui-table-reordering", Rt = "data-ui-table-dragging", zt = "data-ui-table-drop", Bt = "data-ui-table-scrolled", Vt = "data-ui-table-scrollbar", Ht = "data-ui-no-row-select", Ut = "data-ui-tree-parent", Wt = "data-ui-tree-children", Gt = "data-ui-tree-folder", Kt = "data-ui-tree-expanded", qt = "data-ui-tree-title", Jt = "data-ui-tree-loading", Yt = "data-ui-tree-drop-target", Xt = "data-ui-tree-boot", Zt = "data-ui-tree-draggable", Qt = "data-ui-row-editing", $t = "data-ui-image-source", en = "data-ui-file-max-size", tn = "data-ui-file-pick", nn = "data-ui-theme", rn = "data-ui-words", an = "data-ui-language-switcher", on = "data-ui-language", sn = "data-ui-splitting", cn = "data-ui-pointer-focus", ln = "data-ui-selection", un = "data-ui-selected", dn = "data-ui-selected-key", _ = "data-ui-selected-keys", fn = "data-ui-bind-selected-key", pn = "data-ui-tabs-selected", mn = "data-ui-tab-order", hn = "data-ui-tab-caption", gn = "data-ui-tab-pinned", _n = [
	ot,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], vn = "data-ui-submit-form-id", v = `[${m}]`, yn = "data-ui-href", bn = "ui-disabled", xn = "ui-loading", Sn = "ui-readonly", Cn = "ui-hidden", wn = "ui-dialog__surface", Tn = "ui-flyout__content", En = "data-ui-focus-holder", Dn = "[role='listbox'], [role='menu'], [role='dialog']", On = "ui-select__trigger", kn = `.${On}`, An = "ui-button", jn = "ui-select", Mn = "ui-text-input", Nn = "ui-invalid", Pn = {
	componentId: m,
	key: h,
	selected: un,
	selectedKey: dn,
	selectedKeys: _,
	unselectable: ue,
	rowFocus: Ce,
	itemsHost: g,
	valueHolder: We,
	bindValue: Ae,
	noRowOpen: he,
	noRowDrag: ge,
	eventBoundary: Me,
	focusHolder: En,
	tooltip: we,
	tooltipPlacement: Te,
	contextMenu: xe,
	contextMenuUse: Se,
	disabledClass: bn,
	loadingClass: xn,
	readOnlyClass: Sn,
	hiddenClass: Cn,
	buttonClass: An,
	selectClass: jn,
	textInputClass: Mn,
	invalidClass: Nn,
	sourceLine: Ze,
	popupSelector: Dn,
	listTriggerSelector: kn,
	tableRowClass: Mt,
	tableScrollClass: Nt,
	tableHeaderClass: Pt,
	tableResizerClass: Ft,
	tableHidden: jt,
	hostMode: qe,
	windowOffset: et,
	windowTotal: tt,
	windowSize: $e,
	windowMoreAfter: rt,
	windowAggregates: it,
	itemsQuery: Fe,
	valueKind: Ge,
	itemsQueryKind: Ke,
	menuItemClass: vt,
	menuItemKind: _t,
	menuItemCheckedClass: yt
};
function Fn(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function In(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Ln = 0;
function Rn(e, t) {
	return e.id.length === 0 && (Ln++, e.id = `${t}-${Ln}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function zn(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(v) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Bn = {
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
}, Vn = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(b(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${b(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(b(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (b(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(cr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(cr(e, sr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(lr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(x(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(x(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ur(e, t))?.items ?? [];
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
		let t = b(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = b(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(cr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(cr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = x(e.eventName), n = b(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(lr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = b(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = b(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = b(e.componentId);
		t > 0 && this.itemValuesByAddress.set(ur(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = b(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function y(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Hn(e) {
	return y(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Un(e) {
	return e == null ? "OneWay" : y(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Wn(e) {
	return y(e, ["Property", "Event"]);
}
function Gn(e) {
	return e == null ? "SetProperty" : y(e, ["SetProperty", "Effect"]);
}
function Kn(e) {
	return y(e, [
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
function qn(e) {
	return y(e, ["Ascending", "Descending"]);
}
function Jn(e) {
	return y(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Yn(e) {
	return y(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Xn(e) {
	return typeof e == "string" ? e : y(e, [
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
function Zn(e) {
	return y(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Qn(e) {
	return y(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function b(e) {
	return e ?? 0;
}
function $n(e) {
	return typeof e == "string" ? e : "";
}
function er(e) {
	return y(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function tr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function nr(e) {
	return y(e, ["Auto", "Smooth"]);
}
function rr(e) {
	return y(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ir(e) {
	return y(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function ar(e) {
	return y(e, ["Light", "Dark"]);
}
function or(e) {
	return y(e, ["Horizontal", "Vertical"]);
}
function x(e) {
	return e?.trim().toLowerCase() ?? "";
}
function sr(e) {
	return e?.trim() ?? "";
}
function cr(e, t) {
	return `${e}:${sr(t)}`;
}
function lr(e, t) {
	return `${e}:${x(t)}`;
}
function ur(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var dr = class {
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
		return this.dom.findAllComponents(b(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = b(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = b(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Oe}${In(r.propertyName)}="${Fn(a)}"]` : null;
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
		let n = b(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return zn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${In(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function fr(e) {
	return gr(e, le);
}
function pr(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = _r(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function mr(e, t) {
	let n = fr(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = pr(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function hr(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = _r(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function gr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function _r(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function vr(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var yr = class {
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
		let e = this.root.querySelectorAll(v), t = this.root.querySelector(`[${He}]`) !== null;
		for (let n of e) {
			let e = S(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Cr(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Rn(e, t);
	}
	findComponentParts(e, t, n) {
		return vr(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(Sr(t)) ?? [];
		if (n.length > 0 && n.every((e) => mr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => mr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = fr(n);
			if (e === 0) continue;
			let r = pr(n, e);
			if (r.length !== e) continue;
			let i = Sr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(v);
			if (e === null || !wr(this.root, e)) return null;
			let r = S(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: pr(e, fr(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function S(e) {
	return gr(e, m);
}
function br(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return n > 0 ? n : null;
}
function xr(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: pr(t, fr(t))
	};
}
function Sr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Cr(e) {
	return fr(e) === 0;
}
function wr(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Tr(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Er(n);
	switch (Dr(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Or(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Or(r, i) ? "many" : "other";
		case "ru":
		case "uk": return kr(r, i);
		case "pl": return Ar(r, i);
		default: return "other";
	}
}
function Er(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Dr(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Or(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function kr(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Ar(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/runtime/words.ts
var jr = "count";
function Mr(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Nr(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
function Pr(e, t, n) {
	return Mr(e) ? Lr(n, e.key, e.args) : Nr(e) ? Fr(n, e.text) : t && typeof e == "string" ? Fr(n, e) : e;
}
function Fr(e, t) {
	return t.trim().length === 0 || !Ir(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Ir(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Lr(e, t, n) {
	let r = n?.[jr];
	return Rr(typeof r == "number" ? e.lookup(`${t}.${Tr(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Nr(t) ? Fr(e, t.text) : Lr(e, t.key, t.args));
}
function Rr(e, t, n) {
	if (t == null || !e.includes("{")) return e;
	let r = "", i = 0;
	for (; i < e.length;) {
		if (e[i] === "{") {
			let a = zr(e, i);
			if (a > 0) {
				let o = e.slice(i + 1, a);
				if (Object.hasOwn(t, o)) {
					r += Vr(t[o], n), i = a + 1;
					continue;
				}
			}
		}
		r += e[i], i++;
	}
	return r;
}
function zr(e, t) {
	let n = t + 1;
	for (; n < e.length && Br(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Br(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Vr(e, t) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Mr(e) ? t === void 0 ? Rr(e.key, e.args) : t(e) : Nr(e) ? t === void 0 ? e.text : t(e) : String(e);
}
//#endregion
//#region src/runtime/client-strings.ts
var Hr = 256, Ur = 512, Wr = "script[type='application/json'][data-ui-strings]", Gr = "#text", Kr = class {
	words = /* @__PURE__ */ new Map();
	overrides = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	changeHandlers = /* @__PURE__ */ new Set();
	tableHandlers = /* @__PURE__ */ new Set();
	currentLanguage = "";
	currentPrefixes = [];
	currentTemporal = null;
	currentNumber = null;
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
	get temporal() {
		return this.currentTemporal;
	}
	get number() {
		return this.currentNumber;
	}
	get prefixes() {
		return this.currentPrefixes;
	}
	load(e = document) {
		let t = e.querySelector(Wr)?.textContent?.trim() ?? "";
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
		this.words = t, this.currentLanguage = e.language, this.currentPrefixes = Array.isArray(e.prefixes) ? e.prefixes.filter((e) => typeof e == "string") : [], this.currentTemporal = typeof e.temporal == "object" && e.temporal !== null ? e.temporal : null, this.currentNumber = typeof e.number == "object" && e.number !== null ? e.number : null, this.complete = e.complete !== !1, this.report = e.report === !0, this.tableLoaded = !0, this.missing.clear(), this.pending.clear(), this.notify(this.tableHandlers, "a words table handler failed.");
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
	onTable(e) {
		return this.tableHandlers.add(e), () => this.tableHandlers.delete(e);
	}
	notifyChanged() {
		this.notify(this.changeHandlers, "a words change handler failed.");
	}
	notify(e, t) {
		for (let n of e) try {
			n();
		} catch (e) {
			s(t, e);
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
		return this.lookup(e) === void 0 && this.text(e), Lr(this, e, t);
	}
	translate(e, t) {
		return Lr(this, e, t);
	}
	resolve(e, t) {
		return Pr(e, t, this);
	}
	resolveText(e) {
		return Pr(e, !0, this);
	}
	write(e, t, n, r) {
		Xr(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Xr(e, t, Pr(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Mr(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Nr(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Xr(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Jr(e, t, n);
	}
	rewriteMarks(e) {
		Zr(e, (e) => {
			for (let t of e.querySelectorAll(`[${rn}]`)) for (let [e, n] of Object.entries(Yr(t))) {
				let r = this.wordsOfMark(n);
				r !== null && Xr(t, e === Gr ? null : e, r);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Pr(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Ur || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Ir(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Hr) try {
			let a = await e(t, n.slice(r, r + Hr));
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
function qr(e, t) {
	e.hasAttribute("data-ui-words") && Jr(e, t, null);
}
function Jr(e, t, n) {
	let r = Yr(e), i = t ?? Gr;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(rn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(rn, a);
}
function Yr(e) {
	let t = e.getAttribute(rn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Xr(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Zr(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Zr(n.content, t);
}
var C = new Kr();
function Qr(e, t) {
	return C.resolve(e, typeof e == "string" && e.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var $r = `.${bn}, .${xn}, [inert]`, ei = `:scope > [${m}]:is(${$r}), :scope > :not([${m}]) > [${m}]:is(${$r})`;
function w(e) {
	return e.closest($r) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function T(e) {
	return e.matches($r) || e.querySelector(ei) !== null;
}
function ti(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var ni = `[${m}], .${Sn}`;
function E(e) {
	return e.closest(ni)?.matches(`.${Sn}`) === !0;
}
function ri(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(bn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var ii = {
	isInert: w,
	isReadOnly: E,
	setDisabled: ri
};
//#endregion
//#region src/extensions/value-readers.ts
function ai(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function oi(e) {
	return e == null;
}
var si = "data-ui-trim-input", ci = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of pi) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ge);
		if (t === null) return li(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(si) ? t.trim() : t;
	}
	readHeld(e) {
		let t = di(e);
		return t === null ? null : this.read(t);
	}
};
function li(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ui = "input, textarea, select";
function di(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ui) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ui}`);
}
function fi(e) {
	return e === null ? null : Number(e);
}
var pi = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(pn)
	},
	{
		kind: "tab-order",
		read: (e) => fi(e.getAttribute(mn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(hn)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(gn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(qt)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(dn)
	},
	{
		kind: "selected-keys",
		read: (e) => mi(e, _)
	},
	{
		kind: Ke,
		read: (e) => mi(e, Fe)
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
function mi(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function hi(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var gi = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function _i(e) {
	return e instanceof HTMLInputElement && gi.has(e.type);
}
function vi(e) {
	return _i(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var yi = "ui-draft-dropped";
function bi(e) {
	e.dispatchEvent(new Event(yi, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function xi(e) {
	let t = Ti(e.key), n = Ei(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(wi);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Si(e, t) {
	return Ti(e) !== null || Ei(e, t) !== 0;
}
var Ci = {
	target: xi,
	applyTabIndex: D
};
function D(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function wi(e) {
	return e.getClientRects().length > 0 && !w(e);
}
function Ti(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ei(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function Di(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Oi = "data-ui-bind-selected-keys", ki = ".ui-items-view, .ui-table, .ui-tree", Ai = `.ui-items-view__item, .${Mt}, .ui-tree__row`, ji = {
	shift: !1,
	ctrl: !1
}, Mi = /* @__PURE__ */ new WeakMap();
function Ni(e, t) {
	t !== null && !Mi.has(e) && Pi(e, t);
}
function Pi(e, t) {
	let n = k(t);
	n.length > 0 && Mi.set(e, n);
}
function Fi(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Ii(e, t) {
	let n = Fi(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Li(e) {
	return !e.hasAttribute(Ht);
}
function O(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${m}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Ri(e) {
	switch (e.getAttribute(ln)) {
		case "one": {
			let t = e.getAttribute(dn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Ki(qi(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function zi(e, t) {
	let n = Ri(e), r = e.getAttribute(ln), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(k(e));
		e.toggleAttribute(un, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Bi(e) {
	return e.filter((e) => e.hasAttribute(un));
}
function Vi(e, t, n, r) {
	let i = k(n);
	if (!Wi(n)) return !1;
	switch (e.getAttribute(ln)) {
		case "one": return Di(e, i, {
			attribute: dn,
			bindingAttribute: fn,
			apply: (e) => zi(e, t)
		}), !0;
		case "many": return Hi(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Hi(e, t, n, r, i) {
	let a = qi(e);
	if (a === null) return;
	let o = Ki(a), s;
	if (i.shift) {
		let r = Gi(t, t.find((t) => k(t) === Mi.get(e)) ?? n, n).map(k);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Mi.set(e, r)) : (s = [r], Mi.set(e, r));
	Ui(e, t, s);
}
function Ui(e, t, n) {
	let r = qi(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(_, i), zi(e, t), r.hasAttribute(Oi) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Wi(e) {
	return k(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !T(e);
}
function Gi(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => O(e) !== null && Wi(e));
}
function Ki(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function qi(e) {
	for (let t of e.querySelectorAll(`[${g}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function k(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Ji = {
	isSelected: (e) => e.hasAttribute(un),
	toggle: Yi,
	setSelected: Xi,
	setSelectedKeys: Zi
};
function Yi(e) {
	let t = e.closest(ki);
	t !== null && e instanceof HTMLElement && Vi(t, Qi(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Xi(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(k(e));
	Zi(e, r, n);
}
function Zi(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Qi(e), i = new Set(r.filter((e) => !Wi(e)).map(k)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Ri(e)].filter((e) => !a.has(e));
	Ui(e, r, n ? [...o, ...a] : o);
}
function Qi(e) {
	return [...e.querySelectorAll(Ai)].filter((t) => t.closest(ki) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function $i(e) {
	let t = e.closest(ki);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ai);
	return n !== null && n.closest(".ui-items-view, .ui-table, .ui-tree") === t ? {
		root: t,
		row: n
	} : null;
}
function ea(e) {
	return e.filter((e) => O(e) !== null && !T(e));
}
function ta(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !T(e)) ?? ea(e)[0] ?? null;
}
function na(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Ce);
	n.setAttribute(Ce, ""), e.setAttribute("aria-activedescendant", Rn(n, "ui-row")), (O(n) ?? n).scrollIntoView({ block: "nearest" });
}
function ra(e, t, n, r) {
	if (!Si(e, r === "grid" ? "both" : r)) return null;
	let i = ea(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return ia(i, n, e === "ArrowDown");
	let a = i.map((e) => O(e) ?? e), o = xi({
		key: e,
		items: a,
		current: n === null ? null : O(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ia(e, t, n) {
	let r = t === null ? null : O(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = aa(i), o = e.map((e) => ({
		row: e,
		rect: (O(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(aa(t.rect) - a) < Math.abs(aa(e.rect) - a) ? t : e).row;
}
function aa(e) {
	return e.left + e.width / 2;
}
function oa(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function sa(e, t, n) {
	let r = n.hasAttribute(Ce), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = ea(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && na(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var ca = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), la = /* @__PURE__ */ new Set([
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
]), ua = !1, da = null, fa = /* @__PURE__ */ new Set();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => pa(e.target), !0), window.addEventListener("keydown", (e) => ma(e), !0), window.addEventListener("focusin", (e) => ha(e.target), !0), window.addEventListener("focusout", (e) => ya(e.target, !1), !0));
function pa(e) {
	ua = !0;
	let t = document.activeElement;
	da = t, t instanceof Element && t !== document.body && e instanceof Node && t.contains(e) && ya(t, !ga(t));
}
function ma(e) {
	if (!(e instanceof KeyboardEvent && la.has(e.key))) {
		ua = !1;
		for (let e of [...fa]) ya(e, !1);
	}
}
function ha(e) {
	ua && !ga(e) && ya(e, !0);
}
function ga(e) {
	return vi(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function _a() {
	return ua && da instanceof HTMLElement && da !== document.body ? da : null;
}
function va() {
	return ua;
}
function ya(e, t) {
	e instanceof Element && (t ? fa.add(e) : fa.delete(e), e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(cn, t));
}
function A(e) {
	e.focus({ preventScroll: !0 });
}
function ba(e) {
	ya(e, !0), e.focus({ preventScroll: !0 });
}
function xa(e) {
	for (let t of e.querySelectorAll(ca)) if (ti(t)) return t;
	return null;
}
function Sa(e, t) {
	let n = [...e.querySelectorAll(ca)].filter((e) => ti(e) || e === t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Ca(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !wa(n) && wa(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Ca(e);
		return t === null || r.get(t) === e;
	});
}
function Ca(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function wa(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Ta(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Ea(n, a) ? i : r && Ea(n, i) ? a : null;
}
function Ea(e, t) {
	return e === t || Ca(e) !== null && Ca(e) === Ca(t);
}
var Da = `.${wn}, .${Tn}, [${En}]`;
function Oa(e) {
	let t = $i(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Da)) && n.hasAttribute("tabindex") && ti(n)) return n;
	return null;
}
function ka(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? xa(e);
	return r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), A(r ?? e), n;
}
function Aa(e, t, n = !1) {
	if (ua) {
		D(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), A(e);
		return;
	}
	let r = t.filter(wi), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (D(t, i), A(i));
}
function ja(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Ma(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${ca}, [tabindex]`) && ti(e)) return e;
	return n === null ? null : Na(n);
}
function Ma(e, t) {
	for (let n = e.closest(v); n !== null; n = n.parentElement?.closest(v) ?? null) {
		let e = t.querySelectorAll(`[${m}="${n.getAttribute(m)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Na(e) {
	for (let t = e.closest(v); t !== null; t = t.parentElement?.closest(v) ?? null) if (ti(t)) {
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
function Pa(e, t) {
	e != null && t.contains(document.activeElement) && A(e);
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Fa = "data-ui-clear", Ia = ["change", "toggle"], La = [
	...Ia,
	"expand",
	"collapse",
	"open",
	"close"
];
function Ra(e) {
	let t = Un(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function za(e) {
	return Un(e) === "OnSubmit";
}
function Ba(e, t) {
	let n = e.getAttribute(Ae);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && za(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Ra(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: za(i.mode)
		};
	}
	return null;
}
var Va = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Ia) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(yi, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Fa}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Ba(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Fa}]`);
		if (t === null) return;
		let n = t.closest(v), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Ha(r) || (hi(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), vi(r) && document.activeElement !== r && A(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (E(e.target) || w(e.target))) return;
		let t = Ba(e.target, this.options.metadata);
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
			let r = Ba(n, this.options.metadata);
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
		let i = this.options.valueReaders.readBound(e), a = this.holdUnanswered(e), o = () => this.releaseUnanswered(e, a);
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
		let t = ++this.sends;
		return this.unanswered.set(e, t), t;
	}
	releaseUnanswered(e, t) {
		this.unanswered.get(e) === t && this.unanswered.delete(e);
	}
	async syncPropertyAsync(e, t, n, r) {
		let i = this.options.metadata.getBindingByComponentAndPropertyId(e, t);
		if (i === void 0 || !Ra(i.mode) || za(i.mode)) return;
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
function Ha(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/command-turns.ts
var Ua = class {
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
}, Wa = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = x(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = x(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(x(e));
	}
	markAttached(e) {
		let t = x(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, Ga = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: b(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Ka = {
	dispatched: !1,
	success: !1
}, qa = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Ja = class {
	options;
	root;
	registry;
	requestFactory = new Ga();
	turns = new Ua();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Wa(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Xa(t, r.element)) return;
		let i = t.target.closest(`[${Me}]`);
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
			let t = e instanceof qa, r = t ? e.reason : e;
			throw n.completed?.({
				...o,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && w(r.domEvent.target)) return Ka;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Ka;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Za(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), Ka;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Ka;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new qa(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !La.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(je(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Ya(e.preventDefault, t) && t.domEvent.preventDefault(), Ya(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Ya(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Xa(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Za(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Qa(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && $a(e, t) : eo(e, t);
}
function $a(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Qa(e[n], t[n])) return !1;
	return !0;
}
function eo(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Qa(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var to = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of Ia) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = Ba(e.target, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return;
		else r = this.index.getPropertyInteractions(b(n.binding.componentId), n.binding.propertyId);
		if (r.length === 0) return;
		let i = this.options.valueReaders.readBound(e.target), a = ro(r[0].source, t.dynamicParameters);
		if (!(this.heard.has(a) && Qa(this.heard.get(a), i))) {
			this.heard.set(a, i);
			for (let e of r) this.applyInteraction(e, t.dynamicParameters, !0, i);
		}
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: b(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(b(e.reference.componentId), e.reference.propertyId);
		t.length > 0 && this.heard.set(ro(e.reference, e.dynamicParameters), e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (Gn(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!io(i)) return;
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
			effect: no(r, t),
			dom: this.options.dom
		});
	}
};
function no(e, t) {
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
function ro(e, t) {
	return JSON.stringify([
		b(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function io(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var ao = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return oo(t, e.operator, e.value);
	}
};
function oo(e, t, n) {
	switch (Kn(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return so(e, n, (e) => e > 0);
		case "GreaterOrEqual": return so(e, n, (e) => e >= 0);
		case "Less": return so(e, n, (e) => e < 0);
		case "LessOrEqual": return so(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return co(e, n);
		default: return !1;
	}
}
function so(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function co(e, t) {
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
var lo = "Value", uo = class {
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
		return this.eventNames.has(x(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) mo(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(x(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(ho(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(go(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (fo(e)) {
			let t = b(e.sourceEvent?.componentId), n = x(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(ho(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(ho(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (po(e)) {
			let t = b(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(go(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(go(t, n), r)), r.push(e), this.metadata.getPropertyDefinition(n)?.propertyName === lo) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function fo(e) {
	return Wn(e.sourceKind) === "Event";
}
function po(e) {
	return Wn(e.sourceKind) === "Property";
}
function mo(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function ho(e, t) {
	return `${e}:${x(t)}`;
}
function go(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var _o = {
	fast: 120,
	normal: 200,
	ripple: 250,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)"
};
function vo() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function yo(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var bo = /* @__PURE__ */ new Set([
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
function xo(e) {
	return bo.has(e);
}
var So = 4, Co = 12, wo = /* @__PURE__ */ new Map(), To = !1, Eo = null, Do = /* @__PURE__ */ new WeakMap(), Oo = "data-ui-popup-stood-in";
function ko(e, t) {
	t === null ? Do.delete(e) : Do.set(e, t);
}
var Ao = "--ui-popup-ground";
function jo(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(Ao).trim() : "";
	n.length === 0 ? t.style.removeProperty(Ao) : t.style.setProperty(Ao, n);
}
function Mo(e, t, n) {
	wo.set(t, {
		anchor: e,
		options: n
	}), Ro(), Eo?.observe(t), Po(t), Bo(e, t, n);
}
var No = "data-ui-popup-lifted";
function Po(e) {
	if (e.hasAttribute(No)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	Fo(e) && (e.setAttribute("popover", "manual"), e.setAttribute(No, ""), e.showPopover());
}
function Fo(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function Io(e) {
	e.hasAttribute(No) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || wo.has(e) || (e.removeAttribute("popover"), e.removeAttribute(No));
	}, _o.fast));
}
function Lo(e) {
	e != null && (wo.delete(e), Eo?.unobserve(e), Io(e));
}
function Ro() {
	To || (To = !0, document.addEventListener("scroll", zo, !0), window.addEventListener("resize", zo), Eo = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = wo.get(t.target);
			e !== void 0 && Bo(e.anchor, t.target, e.options);
		}
	}));
}
function zo() {
	for (let [e, t] of wo) {
		if (!e.isConnected) {
			Lo(e);
			continue;
		}
		Bo(t.anchor, e, t.options);
	}
}
function Bo(e, t, n) {
	if (!e.isConnected) return;
	let r = Vo(e), i = r !== e;
	t.hasAttribute(Oo) !== i && t.toggleAttribute(Oo, i), n.minAnchorWidth === !0 && (t.style.minWidth = `${r.getBoundingClientRect().width}px`);
	let a = r.getBoundingClientRect(), o = (r === e ? n.crossAnchor ?? r : r).getBoundingClientRect(), s = t.getBoundingClientRect(), c = Wo(a, s, n), l = Qo(a, o, s, c, n.gap), u = $o(a, o, s, c, n.gap);
	n.arrow === !0 && (Jo(c) ? u = Ho(u, o.left + o.width / 2, s.width) : l = Ho(l, o.top + o.height / 2, s.height)), l = ts(l, s.height, window.innerHeight), u = ts(u, s.width, window.innerWidth), t.style.top = `${l}px`, t.style.left = `${u}px`, t.dataset.uiPlacement !== c && (t.dataset.uiPlacement = c), Uo(t, o, s, c, l, u);
}
function Vo(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Oo)) return e;
		let n = Do.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Ho(e, t, n) {
	let r = t - e;
	return r < Co ? e - (Co - r) : r > n - Co ? e + (r - (n - Co)) : e;
}
function Uo(e, t, n, r, i, a) {
	let o = Jo(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Co, Math.min(s, c - Co))}px`);
}
function Wo(e, t, n) {
	let r = n.placement, i = Xo(r);
	if (Go(e, t, r, n.gap)) return r;
	if (Go(e, t, i, n.gap)) return i;
	for (let i of Ko(r)) if (Go(e, t, i, n.gap)) return i;
	return Yo(e, i) > Yo(e, r) ? i : r;
}
function Go(e, t, n, r) {
	return Yo(e, n) >= qo(t, n) + r;
}
function Ko(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function qo(e, t) {
	return Jo(t) ? e.height : e.width;
}
function Jo(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Yo(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Xo(e) {
	return e.startsWith("top") ? `bottom${Zo(e)}` : e.startsWith("bottom") ? `top${Zo(e)}` : e.startsWith("left") ? `right${Zo(e)}` : `left${Zo(e)}`;
}
function Zo(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Qo(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : es(t.top, t.height, n.height, r);
}
function $o(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : es(t.left, t.width, n.width, r);
}
function es(e, t, n, r) {
	let i = Zo(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function ts(e, t, n) {
	return Math.max(So, Math.min(e, n - t - So));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var ns = 32;
function j(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = rs(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function rs(e, t, n) {
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
		if (r.size > ns) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function is(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var as = "data-ui-dialog";
function os(e) {
	let t = e.querySelectorAll(`[${as}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ss(e) {
	let t = os(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function cs(e) {
	let t = typeof document > "u" ? null : ss(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var ls = "data-ui-rename-field";
function us(e) {
	return e instanceof Element && e.closest(`[${ls}]`) !== null;
}
function ds(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(ls, ""), r.value = e.value, fs(r, n, t);
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
function fs(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var ps = /* @__PURE__ */ new Set(), ms = /* @__PURE__ */ new Map(), hs = 0, gs = !1;
function _s() {
	gs || (gs = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || us(e.target) || bs() && e.preventDefault();
	}, !0));
}
function vs() {
	for (let e of ps) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function ys(e) {
	for (let t of ps) t.hearRefusedClick(e);
}
function bs() {
	let e = [];
	for (let t of ps) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...ms.keys()]) t.has(e) || ms.delete(e);
	for (let { popup: t } of e) ms.has(t) || ms.set(t, ++hs);
	let n = xs(e, (e) => ms.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function xs(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Ss = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), ps.add(this), _s();
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
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
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
		return this.options.isBehind === void 0 ? cs(e) : this.options.isBehind(e);
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
function Cs(e, t) {
	return e.isConnected && !w(e) && !(t && E(e));
}
var ws = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Ss({
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
			isBehind: (e) => cs(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || va() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : Ts(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, Os(t)) && !cs(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Oa(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && Cs(n.owner, this.closesWhenReadOnly) && !cs(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !Cs(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), ks(e), As(e, !0), Ns(this), e.focus !== void 0 && e.focus !== !1 && ka(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && ks(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Pa(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), As(r, !1), Lo(r.popup), this.entries.size === 0 && Ps(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (Cs(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !Es() && Ds(e);
		}
	}
};
function Ts(e) {
	return e instanceof Element && e.isConnected && ti(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function Es() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ti(e);
}
function Ds(e) {
	!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = -1), A(e);
}
function Os(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function ks(e) {
	e.anchor !== void 0 && e.placement !== void 0 && Mo(e.anchor, e.popup, e.placement);
}
function As(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var js = /* @__PURE__ */ new Set(), Ms = null;
function Ns(e) {
	js.add(e), Ms === null && typeof MutationObserver == "function" && (Ms = new MutationObserver(() => {
		for (let e of [...js]) e.closeStranded();
	}), Ms.observe(document, {
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
function Ps(e) {
	js.delete(e), !(js.size > 0 || Ms === null) && (Ms.disconnect(), Ms = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Fs = "ui-flyout", Is = "ui-flyout--open", Ls = "ui-flyout__anchor", Rs = "data-ui-flyout-no-backdrop-close", zs = "data-ui-flyout-no-escape-close", Bs = 4, Vs = `${Fs}--`, Hs = "bottom-start", Us = class {
	root;
	flyouts = new ws({
		show: ({ owner: e }) => e.classList.add(Is),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? zs : Rs)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Fs}`)) this.place(e);
		j(this.root, `.${Fs}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Tn}`), n = e.querySelector(`:scope > .${Ls}`);
		if (t === null) return;
		let r = Ws(n, t);
		if (!e.classList.contains(Is)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Ks(n) ?? e,
			placement: {
				placement: qs(e),
				gap: Bs
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Is) && (e.classList.remove(Is), Gs(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ls}`)?.closest(`.${Fs}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Is), this.place(t), this.flyouts.isOpen(t) && Gs(t, !0);
		}
	}
};
function Ws(e, t) {
	if (e === null) return null;
	let n = e.querySelector(ca) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Rn(t, "ui-flyout-content")), n;
}
function Gs(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Ks(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function qs(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Vs)) continue;
		let e = t.slice(Vs.length);
		if (xo(e)) return e;
	}
	return Hs;
}
//#endregion
//#region src/interactions/file-drop.ts
var Js = 120, Ys = "refused", Xs = !1;
function Zs(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	$s();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Qs(e, t, n), !0);
	e.root.addEventListener("dragend", () => rc(e, t.marked), !0), window.addEventListener("blur", () => rc(e, t.marked));
}
function Qs(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && rc(e, r);
		return;
	}
	let { host: a } = i;
	if (i.refused === !0) {
		ec(n), n.type !== "dragleave" && rc(e, r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || nc(e, r, a) : t.leaving = window.setTimeout(() => rc(e, r), Js);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = tc(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && nc(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? Ys : "");
		return;
	}
	rc(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => ic(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function $s() {
	if (!Xs) {
		Xs = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && ec(e);
		});
	}
}
function ec(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function tc(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function nc(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function rc(e, t) {
	for (let n of t) nc(e, t, n);
}
function ic(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var ac = "/_ne/files/upload";
function oc(e, t) {
	let n = Number(e.getAttribute(en));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function sc(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", ac), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var cc = () => {}, lc = { uploadAsync: (e, t) => sc(e, t ?? cc) };
function uc(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var dc = "ui-file-input", fc = "ui-file-input__row", pc = "ui-file-input__native", mc = "ui-file-input__field", hc = "ui-file-input__selection", gc = "data-ui-file-dragging", _c = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, C.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Zs({
			root: this.root,
			draggingAttribute: gc,
			resolveTarget: (e) => {
				let t = e.closest(`.${fc}`)?.closest(`.${dc}`) ?? null, n = t?.querySelector(`.${pc}`) ?? null;
				return t === null || n === null ? null : {
					host: t,
					accept: n.getAttribute("accept") ?? "",
					multiple: n.multiple,
					refused: n.disabled || E(t) || w(t)
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
		let t = e.target.closest(`[${tn}], .${fc}`);
		if (t === null || w(t) || E(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${dc}`)?.querySelector(`.${pc}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pc)) return;
		let t = e.target.closest(`.${dc}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${mc}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = oc(e, t);
		if (r.length === 0) {
			this.show(n, () => C.text("ui.file.oversized"));
			return;
		}
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await sc(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => C.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, vc(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => C.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		typeof t == "string" ? this.shownWords.delete(e) : this.shownWords.set(e, t), e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		uc(e.querySelector(`.${hc}`), t);
	}
};
function vc(e) {
	return e.length === 1 ? e[0].name : () => C.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/image-input-engine.ts
var yc = "ui-image-input", bc = "ui-image-input--multiple", xc = "ui-image-input__surface", Sc = "ui-image-input__native", Cc = "ui-image-input__picture", wc = "ui-image-input__text", Tc = "ui-image-input__selection", Ec = "ui-image-input__selections", Dc = "ui-image-input__tiles", Oc = "ui-image-input__tile", kc = "ui-image-input__remove", Ac = "data-ui-image-preview", jc = "data-ui-image-dragging", Mc = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${yc}`)), j(this.root, `.${yc}`, {
			childList: !0,
			attributeFilter: [
				$t,
				Ne,
				_
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(yi, (e) => this.handleDraftDropped(e)), Zs({
			root: this.root,
			draggingAttribute: jc,
			resolveTarget: (e) => {
				let t = e.closest(`.${xc}`), n = t?.closest(`.${yc}`) ?? null;
				return t === null || n === null ? null : {
					host: n,
					accept: n.querySelector(`.${Sc}`)?.getAttribute("accept") ?? "",
					multiple: Nc(n),
					refused: E(n) || w(t)
				};
			},
			onFiles: (e, t) => void (Nc(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Nc(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Cc}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || Fc(e, e.getAttribute("data-ui-image-caption") ?? Rc(n)), Lc(e, n.length > 0));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(_);
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
		let t = e.target.closest(`[${tn}]`), n = t?.closest(`.${yc}`) ?? null;
		t === null || n === null || E(n) || w(t) || n.querySelector(`.${Sc}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kc}`), n = t?.closest(`.${yc}`) ?? null;
		if (t === null || n === null || E(n) || w(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Sc)) return;
		let t = e.target.closest(`.${yc}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Nc(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${yc}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), uc(t.querySelector(`.${Tc}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${xc}`), r = e.querySelector(`.${Cc}`), i = e.querySelector(`.${Tc}`);
		if (n === null || r === null || oc(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Ac, ""), r.setAttribute("src", a), Fc(e, t.name), Lc(e, !0), n.classList.add(xn);
		try {
			let n = await sc([t], () => void 0);
			this.previews.get(e) === a && uc(i, n.selectionId);
		} catch (t) {
			Ic(e), uc(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(xn);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Dc}`), r = oc(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Pc(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await sc([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(xn), this.publishShelf(e);
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
		let t = e.querySelector(`.${Ec}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(_, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Ac), t || Fc(e, ""));
	}
};
function Nc(e) {
	return e.classList.contains(bc);
}
function Pc(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${Oc} ${xn}`, n.src = i, n.alt = e.name, r.type = "button", r.className = kc, C.write(r, "aria-label", "ui.image.remove"), t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function Fc(e, t) {
	let n = e.querySelector(`.${wc}`);
	n !== null && (qr(n, null), n.textContent !== t && (n.textContent = t));
}
function Ic(e) {
	let t = e.querySelector(`.${wc}`);
	t !== null && C.write(t, null, "ui.file.failed");
}
function Lc(e, t) {
	let n = e.querySelector(`.${xc}`);
	n !== null && C.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Rc(e) {
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
var zc = "ui-key-value-action__row", Bc = "ui-key-value-action__value", Vc = "ui-key-value-action__value-input", Hc = "ui-key-value-action__edit-action", Uc = "ui-text__title", Wc = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${zc}`)), j(this.root, `.${zc}`, {
			childList: !0,
			attributeFilter: [Qt]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${Vc} [${Ae}]`)) {
			if (vi(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		bi(e);
	}
	open(e) {
		let t = e.querySelector(`.${Vc} :is(input, textarea, select)`);
		if (t !== null) {
			if (vi(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${Bc} .${Uc}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), _i(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Kc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Hc)) return;
		let { cell: n, row: r } = t, i = e.target.closest(Dn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Hc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !w(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function Gc(e) {
	return Kc(e) !== null;
}
function Kc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Vc}, .${Hc}`), n = t?.closest(`.${zc}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var qc = `.ui-button[${Ge}="pressed"]`, Jc = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(qc);
		t === null || w(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Yc = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${On}, .ui-field-box`, Xc = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${Yc}, ${Dn}, .${_e}`;
function Zc(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Xc);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var Qc = "button, a, input, select, textarea, label, [tabindex], [contenteditable]", $c = ":scope > input.ui-field, :scope > textarea.ui-field", el = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Yc);
		if (t === null || e.target !== t && e.target.closest(Qc) !== null) return;
		let n = t.querySelector($c);
		if (!vi(n) || n.readOnly || w(n) || E(n)) return;
		e.preventDefault(), n.focus({ preventScroll: !0 });
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function M(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var tl = "data-ui-submit-on-enter", nl = 229, rl = class {
	root;
	committedValue = "";
	changes = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.committedValue = e.target.value);
		}), this.root.addEventListener("change", (e) => {
			this.changes++, e.target instanceof HTMLTextAreaElement && (this.committedValue = e.target.value);
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || il(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : al(t, e) && (e.preventDefault(), this.commit(t), this.submitForm(t));
			return;
		}
		_i(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(at);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${vn}="${CSS.escape(t)}"]`);
		n !== null && !w(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Oa(e);
		e.blur(), this.changes === t && this.commit(e), this.keepKeyboard(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = $i(e);
		r?.root === t && r.row !== null && na(t, M(t, Ai, ki), r.row), A(t);
	}
};
function il(e) {
	return e.isComposing || e.keyCode === nl;
}
function al(e, t) {
	return t.key === "Enter" && !t.shiftKey && !t.ctrlKey && !t.altKey && !t.metaKey && e.hasAttribute(tl) && !e.readOnly && !w(e);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var ol = "data-ui-fallback-src", sl = `img[${ol}]`, cl = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(sl)) (ll(e) || e.complete && e.naturalWidth === 0) && ul(e);
		j(this.root, sl, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && ll(t) && ul(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && ul(t);
	}
};
function ll(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function ul(e) {
	let t = e.getAttribute(ol);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var dl = "data-ui-radio-value", fl = "ui-radio-group__input", pl = "ui-radio-group__dot", ml = "ui-radio-group", hl = "ui-radio-group__item", gl = "data-ui-radio-group-name", _l = "data-ui-radio-bind-value-id", vl = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${ml}`)]);
		for (let e of this.root.querySelectorAll(`.${ml}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${ml}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(yl));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [dl, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${ml}`)) {
			let n = e.getAttribute(gl);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(gl), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(gl, a);
			for (let e of M(r, `.${fl}`, `.${ml}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${ml}`)) n.has(e.getAttribute(gl) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(dl);
		for (let n of M(e, `.${fl}`, `.${ml}`)) {
			n.checked = n.value === t;
			let e = bl(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(hl) ? [e] : [...e.querySelectorAll(`.${hl}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${fl}`) !== null) return;
		let t = e.closest(`.${ml}`), n = t?.getAttribute(gl);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = fl, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(_l);
		a !== null && r.setAttribute(Ae, a);
		let o = document.createElement("span");
		o.className = pl, e.prepend(r, o), this.sync(t);
	}
};
function yl(e) {
	return e.classList.contains(ml) ? [e] : [...e.querySelectorAll(`.${ml}`)];
}
function bl(e) {
	let t = e.closest(`.${hl}`);
	return t !== null && T(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function xl(e) {
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
function Sl(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Cl(e, t) {
	return t !== null && e.length >= t;
}
function wl(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Cl(e, n) ? null : [...e, t];
}
function Tl(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var El = /\p{M}/gu;
function Dl(e, t) {
	return Ol(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Ol(e, t) {
	return jl(e, Al(t));
}
function kl(e, t) {
	return t.every((t) => e.includes(t));
}
function Al(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function jl(e, t) {
	let n = e.normalize("NFD").replace(El, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Ml = "data-ui-search-debounce", Nl = "data-ui-search-min-length", Pl = "data-ui-search-manual", Fl = "data-ui-search-answered", Il = "ui-search__input", Ll = "ui-select__popup", Rl = "ui-select__option", zl = "ui-text__title", Bl = 300, Vl = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Il) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		Hl(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Ml), i = r === null ? Bl : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Bl));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Pl)) return;
		let t = e.getAttribute(Nl), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Hl(e) {
	if (e.hasAttribute(Fl)) return;
	let t = e.closest(`.${jn}`), n = t?.querySelector(`.${Ll}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Nl), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Dl(e.value, e) : [], o = Wl(n, (e) => a.length === 0 || kl(Ol(Ul(e), e), a));
	Jl(t, n, a.length > 0 && o === 0);
}
function Ul(e) {
	return e.querySelector(`.${zl}`)?.textContent ?? e.textContent ?? "";
}
function Wl(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Gl(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Rl)) continue;
		let e = t(a);
		Gl(a, e), r ||= e, e && i++;
	}
	return n !== null && Gl(n, r), i;
}
function Gl(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Kl(e) {
	let t = e.querySelector(`.${Ll}`);
	t !== null && Jl(e, t, Wl(t, (e) => e.style.display !== "none") === 0);
}
function ql(e) {
	let t = e.querySelector(`.${Ll}`);
	t !== null && Wl(t, () => !0);
}
function Jl(e, t, n) {
	let r = t.querySelector(`:scope > [${Ve}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${ze}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Ve, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var Yl = "data-ui-select-value", Xl = "data-ui-select-placement", Zl = "ui-select--open", Ql = "ui-select__trigger-content", $l = "data-ui-select-content", eu = "ui-select__placeholder", tu = "ui-input__affix-icon--prefix", nu = "ui-select__popup", ru = "ui-select__option", iu = "ui-select__value-input", au = "data-ui-select-clear", ou = "data-ui-select-trigger-mode", su = "ui-search__input", cu = "ui-search-mode--replace", lu = "ui-text__title", uu = "data-ui-active", du = "ui-multi-select", fu = "ui-multi-select__chips", pu = "ui-multi-select__chip", mu = "ui-multi-select__chip-label", hu = "ui-multi-select__chip-remove", gu = "data-ui-select-chip", _u = "data-ui-select-max", vu = 4, yu = [
	Yl,
	_,
	_u,
	"class",
	h
];
function bu(e) {
	return e === null || E(e) || w(e);
}
function xu(e) {
	return e.classList.contains(du);
}
function Su(e) {
	return e.querySelector(`.${On}`)?.getAttribute(ou) === "input";
}
function Cu(e) {
	return M(e, `.${nu} .${ru}`, `.${jn}`);
}
function wu(e) {
	return e === null ? null : e.querySelector(`.${lu}`)?.textContent ?? e.textContent;
}
function Tu(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(m), t.removeAttribute(h), t.removeAttribute(le), t.removeAttribute(ce);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Eu = class {
	root;
	popups = new ws({
		show: ({ owner: e }) => e.classList.add(Zl),
		hide: ({ owner: e }) => {
			e.classList.remove(Zl), this.markActive(e, null);
		}
	});
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${jn}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ju(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: yu,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${au}], .${hu}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (xu(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(Yl);
		this.decorateOptions(e);
		let n = t === null ? null : Cu(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = wu(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${su}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(cu) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && ql(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${eu}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of Cu(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${iu}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), Kl(e);
	}
	syncMultiple(e) {
		let t = xl(e.getAttribute(_)), n = new Set(t), r = Cl(t, Sl(e.getAttribute(_u)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Cu(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		ku(e, o.map((e) => ({
			key: e,
			label: Ou(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${eu}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${iu}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(_, l), Kl(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${On}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${Ql}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(h);
		if (r !== null && i !== null && r.getAttribute($l) === i) {
			r.removeAttribute($l);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = Ql;
			let e = n.querySelector(`:scope > .${tu}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Tu(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Cu(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = T(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(su)) return;
		let t = e.target.closest(`.${jn}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${ru}`);
		t === null || n === null || n.hasAttribute(uu) || T(n) || w(n) || n.closest(".ui-select") !== t || (D(Cu(t).filter((e) => !T(e)), n), Su(t) || ba(n), this.markActive(t, n, !0));
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(su)) return;
		let t = e.target, n = t.closest(`.${jn}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(cu)) return;
		let r = n.getAttribute(Yl);
		r !== null && (t.value = wu(Cu(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hu}`);
		if (t !== null) {
			let n = t.closest(`.${jn}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), bu(n) || this.removeChosen(n, t.closest(`.${pu}`)?.getAttribute(gu) ?? null));
			return;
		}
		let n = e.target.closest(`[${au}]`);
		if (n !== null) {
			let t = n.closest(`.${jn}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), bu(t) || (this.clearValue(t), Du(t)));
			return;
		}
		let r = e.target.closest(`.${On}`);
		if (r !== null) {
			let t = r.closest(`.${jn}`);
			if (bu(t) || r.getAttribute(ou) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ru}`);
		if (i === null) return;
		let a = i.closest(`.${jn}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ru}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${jn}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !xu(t) || bu(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${fu} > .${pu}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(gu)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(su) || !t.contains(e.target) ? null : Cu(t).find((e) => e.hasAttribute(uu) && !T(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close(), t || (ql(e), Kl(e));
		let n = e.querySelector(`.${On}`), r = e.querySelector(`.${nu}`), i = e.getAttribute(Xl);
		if (n === null || r === null) return;
		n.setAttribute("aria-controls", Rn(r, "ui-select-popup"));
		let a = Su(e) ? e.querySelector(`.${su}`) ?? n : n;
		this.popups.open({
			owner: e,
			popup: r,
			anchor: n,
			placement: {
				placement: i !== null && xo(i) ? i : "bottom-start",
				gap: vu,
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
		let t = Cu(e).filter((e) => !T(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true");
		if (n === void 0 && va()) {
			D(t, null), this.markActive(e, null), Du(e);
			return;
		}
		let r = n ?? t[0];
		if (D(t, r), this.markActive(e, r, va()), Su(e)) {
			let t = e.querySelector(`.${su}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		A(r);
	}
	moveFocus(e, t) {
		let n = Cu(e).filter((e) => !T(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(uu)) ?? null, i = xi({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (D(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of Cu(e)) r === t ? r.setAttribute(uu, "") : r.hasAttribute(uu) && r.removeAttribute(uu), ya(r, r === t && n);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || T(t) || bu(e)) return;
		if (xu(e)) {
			let r = wl(xl(e.getAttribute(_)), n, Sl(e.getAttribute(_u)));
			this.markActive(e, t, va()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(Yl) === n) {
			this.close();
			return;
		}
		e.setAttribute(Yl, n), this.sync(e);
		let r = e.querySelector(`.${iu}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Tl(xl(e.getAttribute(_)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${pu}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${On}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(_) : e.setAttribute(_, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${iu}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (xu(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(Yl)) return;
		e.removeAttribute(Yl), this.sync(e);
		let t = e.querySelector(`.${iu}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Du(e) {
	let t = e.querySelector(Su(e) ? `.${su}` : `.${On}`);
	t !== null && !t.contains(document.activeElement) && A(t);
}
function Ou(e, t) {
	let n = wu(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function ku(e, t) {
	let n = e.querySelector(`.${fu}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${pu}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(gu) === t[n].key && e.querySelector(`.${mu}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Au(e.key, e.label)));
	}
}
function Au(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = pu, n.setAttribute(gu, e), r.className = mu, r.textContent = t, i.className = hu, i.type = "button", i.tabIndex = -1, C.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function ju(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${jn}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === Yl || e.attributeName === "data-ui-selected-keys" || e.attributeName === _u)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${nu}`)?.closest(`.${jn}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Mu = "data-ui-input-debounce", Nu = `input[${Mu}], textarea[${Mu}]`;
function Pu(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Nu);
}
var Fu = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Pu(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Mu));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Pu(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Iu = "textarea.ui-text-area__field", Lu = "data-ui-text-area-grow";
function Ru() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var zu = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(Iu) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(Iu)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(vr(e.components, Iu));
		}), j(this.root, Iu, {
			childList: !0,
			attributeFilter: [Lu]
		}, (e) => {
			this.fitAll(vr(e, Iu));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(Lu)) {
			e.style.removeProperty("height"), this.widths.delete(e), this.observer?.unobserve(e);
			return;
		}
		this.widths.has(e) || this.observer?.observe(e), this.widths.set(e, e.clientWidth), e.style.height = "auto";
		let t = getComputedStyle(e), n = Number.parseFloat(t.borderTopWidth) + Number.parseFloat(t.borderBottomWidth);
		e.style.height = `${e.scrollHeight + n}px`;
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected ? this.widths.get(e) !== e.clientWidth && this.fit(e) : (this.observer?.unobserve(e), this.widths.delete(e));
		}
	}
}, Bu = "ui-slider__input", Vu = "ui-slider__value", Hu = "ui-slider__bubble", Uu = "ui-slider__track", Wu = "ui-slider__thumb-anchor", Gu = "ui-slider", Ku = "ui-orientation--vertical", qu = "--ui-slider-fraction", Ju = 6, Yu = "Value", Xu = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), Zu = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Xu.has(e.propertyName)) return;
			let t = b(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Bu}`);
				t !== null && (this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === Yu && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Qu(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Bu)) return;
		let t = e.target;
		if (Qu(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	placeBubble(e) {
		let t = $u(e);
		t !== null && Mo(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Ju
		});
	}
	releaseBubble(e) {
		Lo($u(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Uu}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Vu}, .${Hu}`) ?? []) n.textContent = e.value;
		e.closest(`.${Uu}`)?.style.setProperty(qu, String(ed(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Qu(e) {
	return E(e) || w(e);
}
function $u(e) {
	if (!(e instanceof Element) || !e.classList.contains(Bu)) return null;
	let t = e.closest(`.${Uu}`), n = t?.querySelector(`.${Hu}`) ?? null, r = t?.querySelector(`.${Wu}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${Gu}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Ku)
	};
}
function ed(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var td = {
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
}, nd = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], rd = [
	"$n",
	"n$",
	"$ n",
	"n $"
], id = [
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
], ad = [
	"n %",
	"n%",
	"%n",
	"% n"
], od = [
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
], sd = /[1-9]/;
function cd(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return td;
	try {
		return {
			...td,
			...JSON.parse(t)
		};
	} catch {
		return td;
	}
}
function ld(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = dd(t);
	if (r === null) return fd(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = pd(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return ud(e, t) ? vd(nd[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = pd(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return ud(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = md(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return ud(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = pd(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return vd(ud(e, t) ? id[n.currencyNegativePattern] ?? "-$n" : rd[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = pd(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return vd(ud(e, t) ? od[n.percentNegativePattern] ?? "-n %" : ad[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return fd(e, n);
	}
}
function ud(e, t) {
	return e < 0 && sd.test(t);
}
function dd(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function fd(e, t) {
	let { integer: n, fraction: r } = hd(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function pd(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = md(e, t, n);
	return n === 0 ? _d(o, r, i) : `${_d(o, r, i)}${a}${s}`;
}
function md(e, t, n) {
	let { integer: r, fraction: i } = hd(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? gd(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function hd(e, t) {
	let [n, r = "0"] = String(e).split("e"), [i, a = ""] = n.split("."), o = `${i}${a}`.replace(/^0+/, ""), s = i.length + Number(r) + t - (i.length + a.length - o.length);
	return o.length === 0 ? {
		integer: "0",
		fraction: ""
	} : s <= 0 ? {
		integer: "0",
		fraction: `${"0".repeat(-s)}${o}`
	} : s >= o.length ? {
		integer: o + "0".repeat(s - o.length),
		fraction: ""
	} : {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function gd(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function _d(e, t, n) {
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
function vd(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var yd = {
	readCulture: cd,
	format: ld
}, bd = /^-?(\d+(\.\d*)?|\.\d+)$/;
function xd(e, t, n) {
	if (!bd.test(e)) return e;
	let r = n.thousands ? t : Dd(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return ld(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return ld(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function Sd(e, t, n) {
	return bd.test(e) ? (Ed(n) ? Od(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Cd(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Ed(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!bd.test(d)) return null;
	let f = a ? Od(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function wd(e, t, n, r, i) {
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
function Td(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Ed(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Dd(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Od(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var kd = "ui-number-input", Ad = "ui-number-input__field", jd = "data-ui-number-no-decimals", Md = "data-ui-number-no-negative", Nd = "data-ui-number-no-thousands", Pd = "data-ui-number-trim-zeros", Fd = "data-ui-number-step", Id = "data-ui-number-min", Ld = "data-ui-number-max", Rd = "data-ui-number-step-direction", zd = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Ad}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(vr(e.components, `.${Ad}`));
		}), C.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Ad}`)));
	}
	showAtRest(e) {
		for (let t of e) t !== document.activeElement && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	valueOf(e) {
		return this.keptValue(e) ?? e.value.trim();
	}
	keptValue(e) {
		return this.showsOwnText(e) ? this.values.get(e) : void 0;
	}
	showsOwnText(e) {
		return this.shown.get(e) === e.value;
	}
	readValue(e) {
		let t = Bd(e);
		if (t !== null) return this.keptValue(t) ?? Vd(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = cd(e), r = e === document.activeElement ? Sd(t, n, Hd(e)) : xd(t, n, {
			format: Hd(e),
			thousands: !e.hasAttribute(Nd)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = Bd(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(jd), r = !t.hasAttribute(Md), i = t.selectionStart ?? t.value.length, a = wd(t.value, i, cd(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Bd(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Bd(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Vd(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(Pd) && !E(t) && !w(t)) {
			let e = this.values.get(t) ?? "", n = Td(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Bd(e.target);
		if (t === null) return;
		let n = Vd(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Bd(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = Sd(t, cd(e), Hd(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Rd + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Ad}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(Rd) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = Bd(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(Fd) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Vd(e) ?? "0") || 0) + n * t, i = e.getAttribute(Id), a = e.getAttribute(Ld);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Ud(r)), this.show(e);
	}
};
function Bd(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Ad) ? e : null;
}
function Vd(e) {
	return Cd(e.value, cd(e), Hd(e));
}
function Hd(e) {
	return e.closest(`.${kd}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Ud(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Wd = `:scope > [${Ve}], :scope > [${He}], :scope > [${Qe}]`;
function N(e) {
	let t = new Set(e.querySelectorAll(Wd));
	return [...e.children].filter((e) => !t.has(e));
}
function Gd(e) {
	return e === null ? [] : [e];
}
function Kd(e) {
	return e.querySelector(`:scope > [${Ve}]`);
}
function qd(e, t, n, r, i) {
	i ??= N(e).some((e) => !e.classList.contains(Cn));
	let a = Kd(e);
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
	c.setAttribute(Ve, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var P = { ok: !1 };
function Jd(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Hn(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return P;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return P;
			let t = a[l];
			if (l++, Hn(t.kind) === "Dynamic") {
				let n = Qd(e, t.componentId);
				if (!n.ok) return P;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return P;
				let e = af(o, t.value);
				if (!e.ok) return P;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return P;
		if (c) {
			let e = ef(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? P : {
		ok: !0,
		value: o,
		scope: s
	};
}
function Yd(e, t, n) {
	for (let r of t ?? []) {
		if (Hn(r.kind) !== "Dynamic") continue;
		let t = b(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Xd(e) {
	let t = ef(e, "IsContent");
	return t.ok && t.value === !0;
}
var Zd = /* @__PURE__ */ new Set();
function Qd(e, t) {
	let n = b(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Zd.has(n) || (Zd.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), P;
}
function $d(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = ef(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function ef(e, t) {
	if (e == null) return P;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return P;
	let n = e, r = tf(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : P;
}
function tf(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = nf(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function nf(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function rf(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Hn(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Hn(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = b(e.componentId);
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
function af(e, t) {
	if (e == null || t == null) return P;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : P;
	if (typeof t != "string") return P;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (sf(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return P;
}
function of(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (sf(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function sf(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function cf(e) {
	let t = e.closest(v)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function lf(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = cf(e);
	if (a === void 0 && o === null) {
		for (let t of N(e)) t.classList.remove(Cn);
		return;
	}
	for (let n of N(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Cn);
			continue;
		}
		n.classList.toggle(Cn, !uf(a, e, i, o));
	}
}
function uf(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => hf(e, t, n)) && (r?.filters ?? []).every((e) => oo($d(t, e.itemProperty), e.operator, e.value));
}
function df(e, t, n = null) {
	return (e?.filters ?? []).some((e) => gf(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function ff(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => gf(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function pf(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => mf(n.getItemValue(e), n.getItemValue(r), t));
}
function mf(e, t, n) {
	for (let r of n) {
		let n = _f($d(e, r.itemProperty), $d(t, r.itemProperty));
		if (n !== 0) return qn(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function hf(e, t, n) {
	if (!gf(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return oo($d(t, e.itemProperty), e.operator, r);
}
function gf(e, t, n, r) {
	return e == null || oo(r.get(e, []), t, n);
}
function _f(e, t) {
	if (e === t) return 0;
	let n = yf(e), r = yf(t);
	if (n !== r) return n - r;
	if (n === vf.Nothing) return 0;
	if (n === vf.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var vf = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function yf(e) {
	return e == null ? vf.Nothing : typeof e == "number" ? Number.isNaN(e) ? vf.Nothing : vf.Number : typeof e == "string" && e.trim().length === 0 ? vf.Nothing : Number.isNaN(Number(e)) ? vf.Text : vf.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function bf(e) {
	switch (e.getAttribute(qe)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-source-order.ts
var xf = /* @__PURE__ */ new WeakMap();
function Sf(e, t) {
	let n = xf.get(e), r = n === void 0 ? [...t] : Cf(n, t);
	return xf.set(e, r), r;
}
function Cf(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function wf(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Tf(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Ef(e, t, n) {
	return Tf(e, t), wf(e, t, n);
}
function Df(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Of(e) {
	xf.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function kf(e, t, n, r, i, a = []) {
	Af(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Af(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var jf = ".ui-items-view, .ui-table", Mf = ".ui-items-view__item, .ui-table__row", Nf = "ui-row--dragging", Pf = "--ui-row-drop-offset", Ff = "move", If = {
	name: Ff,
	registration: { dynamicParameters: (e) => {
		let t = e.domEvent instanceof CustomEvent ? e.domEvent.detail?.index : void 0;
		return typeof t == "number" ? [...e.dynamicParameters, t] : null;
	} }
}, Lf = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t === null ? null : O(t.row);
		if (t === null || n === null) return;
		let r = zf(t.root, t.row);
		(r === null ? !Bf(e.target, t.row) : !r.contains(e.target)) || (r !== null && (na(t.root, Kf(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 })), n.draggable || (n.draggable = !0, this.lifted = n));
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(Ai), n = t?.parentElement ?? null, r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return t === null || n === null || r === null || !t.matches(Mf) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || w(r) || t.hasAttribute("data-ui-undraggable") || T(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = br(e);
		return this.services === void 0 || n === null ? !1 : ff(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, cf(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : O(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, kf(e, t.root, r, Nf, k(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = Hf(t), r = Kf(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Jf(t.root, null) : Jf(t.root, i, Wf(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(Ai);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(Ai) ?? null;
		if (a ??= Gf(i, n), a === null) return null;
		let o = (O(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && Uf(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (Vf(t) !== Vf(e.row)) return null;
		let r = Rf(this.orderOf(e.host), k(e.row), k(t), n);
		return r === null ? null : r + qf(e.host);
	}
	orderOf(e) {
		switch (bf(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? N(e).map(k)];
			case "windowed": return N(e).map(k);
			default: return Sf(e, N(e)).map(k);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && Jf(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, Hf(t), Kf(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && oa(t.row, Ff, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Af(e.root, Nf), Jf(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = $i(e.target);
		if (t === null || !t.root.matches(jf) || t.row !== null && Zc(e.target, t.row) !== null) return;
		let n = qi(t.root), r = n === null ? [] : Kf(n), i = ta(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && oa(i, Ff, { index: c });
	}
};
function Rf(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function zf(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Bf(e, t) {
	return Zc(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Vf(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Hf(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function Uf(e, t, n) {
	if (Vf(e) !== Vf(t)) return !1;
	if (!n.across) return !0;
	let r = (O(e) ?? e).getBoundingClientRect(), i = (O(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Wf(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Uf(t.anchor, r, n)) return -1;
	let i = (O(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (O(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Gf(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (O(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function Kf(e) {
	return N(e).filter((e) => e instanceof HTMLElement && e.matches(Mf) && O(e) !== null);
}
function qf(e) {
	let t = bf(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function Jf(e, t, n = 0) {
	let r = t === null ? null : O(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Pf));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Pf) !== i && r.style.setProperty(Pf, i);
}
//#endregion
//#region src/rendering/temporal-format.ts
function Yf(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Xf = {
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
function Zf(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Xf;
	try {
		return {
			...Xf,
			...JSON.parse(t)
		};
	} catch {
		return Xf;
	}
}
var Qf = [
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
function $f(e, t, n) {
	if (t == null || t.trim().length === 0) return `${F(e.getFullYear(), 4)}-${F(e.getMonth() + 1, 2)}-${F(e.getDate(), 2)} ${F(e.getHours(), 2)}:${F(e.getMinutes(), 2)}:${F(e.getSeconds(), 2)}`;
	let r = "", i = ep(t);
	for (let a = 0; a < t.length;) {
		let o = tp(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += np(o, e, n, i), a += o.length;
	}
	return r;
}
function ep(e) {
	for (let t = 0; t < e.length;) {
		let n = tp(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function tp(e, t) {
	for (let n of Qf) if (e.startsWith(n, t)) return n;
	return null;
}
function np(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return F(t.getFullYear(), 4);
		case "yy": return F(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return F(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return F(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return F(i, 2);
		case "H": return String(i);
		case "hh": return F(a, 2);
		case "h": return String(a);
		case "mm": return F(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return F(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function F(e, t) {
	return String(e).padStart(t, "0");
}
var rp = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function ip(e) {
	let t = rp.exec(e.trim());
	if (t === null) return null;
	let n = {
		year: Number(t[1]),
		month: Number(t[2]),
		day: Number(t[3]),
		hour: Number(t[4] ?? "0"),
		minute: Number(t[5] ?? "0"),
		second: Number(t[6] ?? "0"),
		millisecond: t[7] === void 0 ? 0 : Number(t[7].padEnd(3, "0").slice(0, 3))
	}, r = /* @__PURE__ */ new Date(0);
	return r.setUTCFullYear(n.year, n.month - 1, n.day), r.setUTCHours(n.hour, n.minute, n.second, n.millisecond), n.year >= 1 && r.getUTCFullYear() === n.year && r.getUTCMonth() === n.month - 1 && r.getUTCDate() === n.day && r.getUTCHours() === n.hour && r.getUTCMinutes() === n.minute && r.getUTCSeconds() === n.second ? n : null;
}
function ap(e) {
	return op(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function op(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var sp = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function cp(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = tp(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += lp(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function lp(e, t) {
	switch (e[0]) {
		case "y": return t.year;
		case "M": return t.month;
		case "d": return t.day;
		case "H": return t.hour;
		case "h": return t.hour.toLowerCase();
		case "m": return t.minute;
		case "s": return t.second;
		default: return e[0];
	}
}
function up(e, t, n) {
	let r = e.trim(), i = {
		position: 0,
		year: null,
		month: null,
		day: null,
		hour: null,
		hour12: null,
		minute: 0,
		second: 0,
		afternoon: null
	};
	for (let e = 0; e < t.length;) {
		let a = tp(t, e);
		if (a === null) {
			if (!dp(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!fp(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? yp(i) : null;
}
function dp(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function fp(e, t, n, r) {
	switch (n) {
		case "yyyy": return pp(t, "year", gp(e, t, 4, 4));
		case "yy": return pp(t, "year", mp(gp(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return pp(t, "month", hp(_p(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return pp(t, "month", gp(e, t, 1, 2));
		case "dddd":
		case "ddd": return _p(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return pp(t, "day", gp(e, t, 1, 2));
		case "HH":
		case "H": return pp(t, "hour", gp(e, t, 1, 2));
		case "hh":
		case "h": return pp(t, "hour12", gp(e, t, 1, 2));
		case "mm":
		case "m": return pp(t, "minute", gp(e, t, 1, 2));
		case "ss":
		case "s": return pp(t, "second", gp(e, t, 1, 2));
		case "tt": return vp(e, t, r);
		default: return !1;
	}
}
function pp(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function mp(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function hp(e) {
	return e === null ? null : e + 1;
}
function gp(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function _p(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function vp(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function yp(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > op(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var bp = {
	readCulture: Zf,
	format: $f,
	parse: ip,
	toDate: ap
}, I = "ui-temporal-input", xp = "ui-temporal-input__value-input", Sp = "ui-temporal-input__end-value-input", Cp = "data-ui-temporal-range", wp = "data-ui-temporal-end", Tp = "data-ui-temporal-mode", Ep = "data-ui-temporal-format", Dp = "data-ui-temporal-default-format", Op = "data-ui-temporal-min", kp = "data-ui-temporal-max", Ap = "data-ui-temporal-step", jp = "data-ui-temporal-step-unit", Mp = "data-ui-temporal-page-culture", Np = "data-ui-temporal-months", Pp = "data-ui-temporal-months-genitive", Fp = "data-ui-temporal-months-short", Ip = "data-ui-temporal-daynames", Lp = "data-ui-temporal-weekdays", Rp = "data-ui-temporal-am", zp = "data-ui-temporal-pm", Bp = /* @__PURE__ */ new Set([
	Ep,
	Dp,
	Op,
	kp,
	Np,
	Rp,
	zp
]), Vp = 2e3;
function Hp(e) {
	let t = e.getAttribute(Tp);
	return t === "time" || t === "date-time" ? t : "date";
}
function Up(e) {
	let t = e.getAttribute(Ep);
	return t === null || t.trim().length === 0 ? e.getAttribute(Dp) ?? "" : t;
}
function Wp(e) {
	let t = e.getAttribute(jp), n = Math.max(1, Math.trunc(Number(e.getAttribute(Ap))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Gp(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Kp(e) {
	return {
		monthNames: qp(e, Np),
		monthGenitiveNames: qp(e, Pp),
		abbreviatedMonthNames: qp(e, Fp),
		dayNames: qp(e, Ip),
		abbreviatedDayNames: qp(e, Lp),
		amDesignator: e.getAttribute(Rp) ?? "AM",
		pmDesignator: e.getAttribute(zp) ?? "PM"
	};
}
function qp(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Jp(e, t) {
	e.hasAttribute(Mp) && (Qp(e, Pp, t.monthGenitiveNames.join("|")), Qp(e, Fp, t.abbreviatedMonthNames.join("|")), Qp(e, Ip, t.dayNames.join("|")), Qp(e, Lp, t.abbreviatedDayNames.join("|")), Qp(e, Np, t.monthNames.join("|")), Qp(e, Rp, t.amDesignator), Qp(e, zp, t.pmDesignator), Qp(e, Dp, Zp(Hp(e), Wp(e), t)));
}
function Yp(e) {
	for (let t = 0; t < e.length;) {
		let n = tp(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Xp(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function Zp(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Yf(n, r);
}
function Qp(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function $p(e) {
	return e.hasAttribute(Cp);
}
function em(e) {
	return e !== null && e.hasAttribute(wp);
}
function tm(e) {
	return L(e, !1);
}
function L(e, t) {
	let n = nm(e, t);
	return n === null ? null : pm(n.value, Hp(e));
}
function nm(e, t) {
	return e.querySelector(`.${t ? Sp : xp}`);
}
function rm(e, t) {
	return pm(e.getAttribute(t) ?? "", Hp(e));
}
function im(e, t, n) {
	let r = nm(e, n);
	if (r === null) return;
	let i = t === null ? "" : mm(t, Hp(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function am(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : up(n, Up(e), Kp(e));
	return r === null ? n : mm(ap(r), Hp(e));
}
function om(e) {
	if (!$p(e)) return;
	let t = L(e, !1), n = L(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (im(e, n, !1), im(e, t, !0));
}
function sm(e) {
	E(e) || w(e) || (cm(e, !1), $p(e) && cm(e, !0));
}
function cm(e, t) {
	let n = L(e, t);
	if (n === null) return;
	let r = um(e, n);
	r.getTime() !== n.getTime() && im(e, r, t);
}
function lm(e) {
	return dm(e, um(e, /* @__PURE__ */ new Date()));
}
function um(e, t) {
	let n = rm(e, Op), r = rm(e, kp);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function dm(e, t) {
	let n = Wp(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var fm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function pm(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = fm.exec(n);
		return e === null ? null : new Date(Vp, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = ip(n);
	return r === null ? null : ap(r);
}
function mm(e, t) {
	let n = `${hm(e.getHours())}:${hm(e.getMinutes())}:${hm(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${hm(e.getMonth() + 1)}-${hm(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function hm(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function gm(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = ym(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < bm(e.start).getTime() ? {
		start: ym(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: ym(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function _m(e, t, n) {
	if (t === null || n === null) return !1;
	let r = bm(e).getTime();
	return r > bm(t).getTime() && r < bm(n).getTime();
}
function vm(e, t, n) {
	return !n && _m(e, t.start, t.end);
}
function ym(e, t) {
	return op(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function bm(e) {
	return op(e.getFullYear(), e.getMonth(), e.getDate());
}
var xm = 100 / 3, Sm = 1, Cm = 2;
function wm(e, t = xm) {
	let n = e.deltaMode === Sm ? xm : e.deltaMode === Cm ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Tm(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Em = {
	notch: 100,
	pixels: wm
}, Dm = "ui-temporal-input__field", Om = "ui-temporal-input__popup", km = "ui-temporal-input--open", Am = "ui-temporal-input__day", jm = "ui-temporal-input__month", R = "ui-temporal-input__time-cell", Mm = "ui-temporal-input__time-column", Nm = 4, Pm = 140, Fm = "data-ui-temporal-toggle", Im = "data-ui-temporal-first-day", Lm = "data-ui-temporal-nav", Rm = "data-ui-temporal-day", zm = "data-ui-temporal-unit", Bm = "data-ui-temporal-cell", Vm = "data-ui-temporal-centred", Hm = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new ws({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(km), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderPopup(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(km);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${I}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = vr(e.components, `.${I}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), j(this.root, `.${I}`, { attributeFilter: [...Bp] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), j(this.root, `.${I}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), C.onChange(() => this.applyWords());
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(`.${I}`)], t = C.temporal;
		if (t !== null && C.language !== this.drawnLanguage) {
			this.drawnLanguage = C.language;
			for (let n of e) Jp(n, t);
		}
		this.applyDisplay(e), this.openPicker !== null && this.renderPopup(this.openPicker);
	}
	get openPicker() {
		return this.popups.current;
	}
	applyDisplay(e) {
		for (let t of e) {
			sm(t);
			let e = cp(Up(t), sh());
			for (let n of t.querySelectorAll(`.${Dm}`)) {
				if (n.placeholder !== e && (n.placeholder = e), n === document.activeElement && this.written.has(n)) continue;
				this.written.add(n);
				let r = nm(t, em(n))?.value ?? "", i = pm(r, Hp(t));
				if (i !== null) {
					n.value = $f(i, Up(t), Kp(t));
					continue;
				}
				r.length === 0 && (n.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Dm)) return;
		let t = e.target.closest(`.${I}`), n = t === null ? null : nm(t, em(e.target));
		t !== null && n !== null && (em(e.target) && (this.getState(t).choosingEnd = !1), n.value = am(t, e.target.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), om(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Dm)) return;
		let t = e.target.closest(`.${I}`);
		t !== null && $p(t) && (this.getState(t).activeEnd = em(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Rm}]`) : null;
		if (n !== null && !t.contains(n) || !$p(t)) return;
		let r = this.getState(t), i = n === null ? null : pm(n.getAttribute(Rm) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, oh(t, r));
	}
	handlePointerMove(e) {
		let t = this.openPicker, n = e.target instanceof Element ? e.target.closest(`[${Rm}], .${R}`) : null;
		t === null || n === null || !t.contains(n) || n === document.activeElement || n.matches(":disabled") || (n.classList.contains(R) ? ph(n) : this.followPointer(t, n));
	}
	followPointer(e, t) {
		let n = e.querySelector(`.${Om}`), r = pm(t.getAttribute(Rm) ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, D([...n.querySelectorAll(`.${Am}`)], t), ba(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Dm)) return;
		let t = e.target.closest(`.${I}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fm}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${I}`));
			return;
		}
		let n = e.target.closest(`.${Om}`)?.closest(`.${I}`);
		if (n == null) return;
		let r = e.target.closest(`[${Lm}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(Lm) ?? "");
			return;
		}
		let i = e.target.closest(`[${Rm}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(Rm) ?? "");
			return;
		}
		let a = e.target.closest(`[${Bm}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${zm}]`)?.getAttribute(zm);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Bm)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (t.startsWith("month:")) {
			n.view = op(n.view.getFullYear(), Number(t.slice(6)), 1), n.pane = "days", this.renderPopup(e);
			return;
		}
		switch (t) {
			case "previous":
				n.view = Th(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = Th(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				n.choosingEnd = !1, this.commit(e, lm(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), $p(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = pm(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if ($p(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = tm(e) ?? lm(e), a = op(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = Sh(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = lm(e), i = gm({
			start: L(e, !1),
			end: L(e, !0)
		}, t.activeEnd, uh(n, r));
		t.focusedDay = i.end ?? i.start, t.view = Sh(n), t.activeEnd = i.active, t.choosingEnd = !i.complete, t.hoverDay = null, im(e, i.end, !0), im(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = $p(e) && this.getState(e).activeEnd === "end", i = new Date(L(e, r) ?? lm(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		im(e, t, n), om(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Dm)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${I}`), em(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(R)) {
			mh(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Am)) return;
		let n = pm(e.target.getAttribute(Rm) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, mm(n, "date"));
			return;
		}
		let r = xh(n, e.key, bh(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Sh(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Mm}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Pm)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Mm}`), n = t?.getAttribute(zm) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Tm(this.wheelTurns.get(n) ?? 0, wm(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${R}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${R}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${R}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(Bm)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Vm));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(zm), i = eh(e);
		if (!(r === null || i === null || i.classList.contains(`${R}--selected`))) {
			if (i.matches(":disabled")) {
				Qm(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Bm)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${Om}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = $p(e) ? t ?? (L(e, !1) === null ? "start" : L(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = L(e, r.activeEnd === "end") ?? tm(e);
		r.pane = "days", r.view = Sh(i ?? um(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${Fm}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: Nm
			},
			openers: a === null ? [] : [a],
			returnFocus: () => lh(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: Sh(tm(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: tm(e),
			activeEnd: "start",
			hoverDay: null,
			choosingEnd: !1
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${Om}`);
		if (n === null) return;
		let r = Hp(e), i = this.getState(e), a = Kp(e), o = $p(e), s = L(e, o && i.activeEnd === "end"), c = th(n), l = nh(n), u = n.contains(document.activeElement);
		n.replaceChildren(), o && n.append(ah(i));
		let d = z("div", `${I}__panes`);
		d.append(Um(e, i, a, s)), r === "date-time" && d.append(Km(e, s)), n.append(d, ih(r));
		let f = l === null ? null : n.querySelector(`[${Lm}="${CSS.escape(l)}"]`);
		fh(n, i, s, t || u && c === null && f === null), oh(e, i), Zm(n), Qm(n), rh(n, c), f !== null && A(f), this.popups.reposition(e);
	}
};
function Um(e, t, n, r) {
	let i = z("div", `${I}__calendar`), a = z("div", `${I}__calendar-header`);
	a.append(dh("previous", "‹", C.text("ui.picker.previous")));
	let o = dh("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${I}__calendar-label`), a.append(o), a.append(dh("next", "›", C.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? Wm(e, t, n, r) : Gm(t, n)), i;
}
function Wm(e, t, n, r) {
	let i = bh(e), a = z("div", `${I}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = z("span", `${I}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = z("div", `${I}__days`), s = bm(/* @__PURE__ */ new Date()), c = $p(e), l = c ? L(e, !1) : r, u = c ? L(e, !0) : null, d = Ch(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = wh(d, n), i = z("button", Am);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(Rm, mm(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${Am}--outside`), Eh(r, s) && i.classList.add(`${Am}--today`), (l !== null && Eh(r, l) || u !== null && Eh(r, u)) && (i.classList.add(`${Am}--selected`), i.setAttribute("aria-selected", "true")), vm(r, {
			start: l,
			end: u
		}, t.choosingEnd) && i.classList.add(`${Am}--within`), vh(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = z("div", `${I}__calendar-pane`);
	return f.append(a, o), f;
}
function Gm(e, t) {
	let n = z("div", `${I}__months`);
	for (let r = 0; r < 12; r++) {
		let i = z("button", jm);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(Lm, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${jm}--selected`), n.append(i);
	}
	return n;
}
function Km(e, t) {
	let n = Wp(e), r = z("div", `${I}__time`), i = z("div", `${I}__time-columns`);
	for (let r of qm(n)) i.append(Xm(e, r, Jm(n, r), t));
	return r.append(i), r;
}
function qm(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Jm(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Ym(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Xm(e, t, n, r) {
	let i = z("div", Mm);
	i.setAttribute(zm, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", C.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = Ym(r, t), s = t === "hour" && Yp(Up(e)), c = Kp(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = z("button", R);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Xp(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(Bm, String(u)), u === o && (n.classList.add(`${R}--selected`), n.setAttribute("aria-selected", "true")), yh(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Zm(e) {
	let t = e.querySelector(`.${I}__calendar`), n = e.querySelector(`.${I}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Qm(e) {
	for (let t of e.querySelectorAll(`.${Mm}`)) {
		let e = t.querySelector(`.${R}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, $m(t, e), t.setAttribute(Vm, String(t.scrollTop));
	}
}
function $m(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function eh(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${R}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function th(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(R) ? null : t.closest(`.${Mm}`)?.getAttribute(zm) ?? null;
}
function nh(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Lm) : null;
}
function rh(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${Mm}[${zm}="${t}"]`)?.querySelector(`.${R}--selected`) ?? null;
	n !== null && A(n);
}
function ih(e) {
	let t = z("div", `${I}__popup-footer`);
	return t.append(dh("now", C.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(dh("clear", C.text("ui.picker.clear"))), t.append(dh("done", C.text("ui.picker.done"))), t;
}
function ah(e) {
	let t = z("div", `${I}__period-caption`);
	return t.textContent = C.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function oh(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? L(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Am}`)) {
		let e = pm(t.getAttribute(Rm) ?? "", "date");
		t.classList.toggle(`${Am}--preview`, e !== null && n !== null && r !== null && _m(e, n, wh(r, 1)));
	}
}
function sh() {
	return {
		year: ch("ui.picker.letter.year", sp.year),
		month: ch("ui.picker.letter.month", sp.month),
		day: ch("ui.picker.letter.day", sp.day),
		hour: ch("ui.picker.letter.hour", sp.hour),
		minute: ch("ui.picker.letter.minute", sp.minute),
		second: ch("ui.picker.letter.second", sp.second)
	};
}
function ch(e, t) {
	let n = C.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function lh(e, t) {
	for (let n of e.querySelectorAll(`.${Dm}`)) if (em(n) === t) return n;
	return e.querySelector(`.${Dm}`);
}
function uh(e, t) {
	return op(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function dh(e, t, n) {
	let r = z("button", `${I}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Lm, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function z(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function fh(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Am}`)];
	if (i.length === 0) return;
	let a = mm(bm(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(Rm) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (D(i, o), r && A(o));
}
function ph(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(R) && ba(e);
}
function mh(e) {
	let t = e.target, n = t.closest(`.${Mm}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? gh(n, e.key === "ArrowRight" ? 1 : -1) : hh(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), _h(r));
}
function hh(e, t, n) {
	return xi({
		key: n,
		items: [...e.querySelectorAll(`.${R}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function gh(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Mm}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${R}--selected`) ?? r.querySelector(`.${R}:not(:disabled)`);
}
function _h(e) {
	let t = e.closest(`.${Mm}`);
	t !== null && $m(t, e);
}
function vh(e, t) {
	let n = rm(e, Op), r = rm(e, kp);
	return n !== null && t.getTime() < bm(n).getTime() || r !== null && t.getTime() > bm(r).getTime();
}
function yh(e, t, n, r) {
	let i = rm(e, Op), a = rm(e, kp);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function bh(e) {
	let t = Number(e.getAttribute(Im));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function xh(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return wh(e, -1);
		case "ArrowRight": return wh(e, 1);
		case "ArrowUp": return wh(e, -7);
		case "ArrowDown": return wh(e, 7);
		case "PageUp": return Th(e, -1);
		case "PageDown": return Th(e, 1);
		case "Home": return wh(e, -r);
		case "End": return wh(e, 6 - r);
		default: return null;
	}
}
function Sh(e) {
	return op(e.getFullYear(), e.getMonth(), 1);
}
function Ch(e, t) {
	let n = Sh(e);
	return wh(n, -((n.getDay() - t + 7) % 7));
}
function wh(e, t) {
	return op(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Th(e, t) {
	let n = op(e.getFullYear(), e.getMonth() + t, 1), r = op(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return op(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Eh(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var Dh = "[data-ui-theme-switcher]", Oh = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(Dh) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Bn.SetTheme,
				mode: kh() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function kh() {
	let e = document.documentElement.getAttribute(nn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var Ah = `[${an}]`, jh = "ui-language-switcher__trigger", Mh = "ui-language-switcher__label-text", Nh = "ui-language-switcher__label-text--current", Ph = "ui-language-switcher__label-text--page", Fh = "ui-language-switcher__menu", Ih = "ui-language-switcher__choice", Lh = "ui-language-switcher--open", Rh = 4, zh = "ui.language.switch", Bh = class {
	options;
	root;
	menus = new ws({
		show: ({ owner: e }) => e.classList.add(Lh),
		hide: ({ owner: e }) => e.classList.remove(Lh),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), C.onChange(() => this.showLanguage(C.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ih}`), n = e.target.closest(Ah);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(on));
			return;
		}
		let r = e.target.closest(`.${jh}`);
		if (r === null || w(r)) return;
		e.preventDefault();
		let i = Vh(n);
		if (i.length === 2) {
			let e = C.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Ah);
		if (t === null) return;
		let n = Vh(t), r = e.target.closest(`.${jh}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !Si(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = xi({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ih}`);
		if (t === null || t === document.activeElement || w(t)) return;
		let n = t.closest(Ah);
		n !== null && this.menus.isOpen(n) && ba(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${Fh}`);
		if (r === null) return;
		let i = Vh(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Rh
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Aa(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Bn.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(Ah)) {
			let n = t.querySelector(`:scope > .${jh}`);
			if (n === null) continue;
			for (let n of Vh(t)) n.setAttribute("aria-checked", n.getAttribute("data-ui-language") === e ? "true" : "false");
			let r = e.toUpperCase();
			for (let t of n.querySelectorAll(`.${Mh}`)) {
				let n = t.getAttribute(on) === e;
				t.classList.toggle(Nh, n), t.classList.contains(Ph) && t.toggleAttribute("hidden", !n), n && (r = t.textContent ?? r);
			}
			C.write(n, "aria-label", zh, { language: r });
		}
	}
};
function Vh(e) {
	return [...e.querySelectorAll(`:scope > .${Fh} > .${Ih}`)];
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var Hh = "data-ui-context-menu-owner", Uh = xe, Wh = "ui-context-menu--open", Gh = "ui-menu", Kh = `.ui-menu-item:not(${bt})`, qh = "ui-context-menu-opening", Jh = St, Yh = class {
	root;
	closed = null;
	menus = new ws({
		show: ({ popup: e }) => e.classList.add(Wh),
		hide: ({ popup: e }, t) => {
			e.classList.remove(Wh), this.closed = e, t === "outside" && Zh();
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
		let n = t.closest(`[${me}]`), r = t.closest(`[${Se}]`);
		for (let i = t.closest(`[${Hh}]`); i !== null; i = i.parentElement?.closest(`[${Hh}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute("data-ui-context-menu-use") ?? "" : "", o = [a.length > 0 ? Qh(i, a) : null, Qh(i, "")].filter((e) => e !== null);
			if (o.length === 0 || w(i)) continue;
			if ($h(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.open(i, s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(qh, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n, r) {
		this.menus.close(), this.closed !== null && (yo(this.closed), this.closed = null);
		let i = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? _a();
		if (!this.menus.open({
			owner: e,
			popup: t,
			returnFocus: () => (i === null ? null : ja(i)) ?? ja(e)
		})) return;
		let a = t.getBoundingClientRect();
		t.style.left = `${ts(n, a.width, window.innerWidth)}px`, t.style.top = `${ts(r, a.height, window.innerHeight)}px`, Xh(t);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Jh) !== null || this.menus.close();
	}
};
function Xh(e) {
	let t = e.querySelector(`.${Gh}`);
	t !== null && Aa(e, M(t, Kh, `.${Gh}`));
}
function Zh() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${ca}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Qh(e, t) {
	for (let n of e.querySelectorAll(`[${Uh}]`)) if ((n.getAttribute(Uh) ?? "") === t && n.closest(`[${Hh}]`) === e) return n;
	return null;
}
function $h(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${h}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function eg(e) {
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
		default: o = og(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function tg(e, t, n = rg()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var ng = null;
function rg() {
	return ng === null && (ng = ig()), ng;
}
function ig() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function ag(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function og(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : sg[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : sg[t] ?? null;
}
var sg = {
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
}, cg = "ui-menu", lg = "ui-menu-item--selected", ug = "ui-context-menu", dg = "ui-orientation--horizontal", fg = "data-ui-menu-shortcut", pg = "[role='menuitem'], [role='menuitemcheckbox']", mg = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(gg) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [fg, pt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${cg}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && D(t, t.find((e) => e.classList.contains(lg) && wi(e)) ?? t.find(wi) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vt}`), n = t?.closest(`.${cg}`) ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			hg(e, t);
			return;
		}
		let r = this.ownItems(n), i = xi({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(dg) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(`.${cg}`) ? t : t.querySelector(`.${cg}`);
		if (n === null) return;
		let r = this.ownItems(n), i = xi({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(dg) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vt}`), n = t?.closest(`.${cg}`) ?? null;
		t !== null && n !== null && D(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${vt}`) : null;
		if (t === null || t === document.activeElement || !t.matches(pg) || t.matches(bt) || !wi(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(`.${cg}`)?.contains(n) === !0) && ba(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || _g(e))) return;
		let t = ss(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !tg(n.shortcut, e))) {
			if (!wi(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${fg}]`)) {
			if (e.closest(`.${ug}`) !== null) continue;
			let t = eg(e.getAttribute(fg));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(fg)
				});
				continue;
			}
			let n = ag(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(fg),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return M(e, `.${vt}:not(${bt})`, `.${cg}`);
	}
};
function hg(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(bt) || !wi(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function gg(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${cg}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(cg) || t.querySelector(`.${cg}`) !== null)) return !0;
	return !1;
}
function _g(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var vg = "ne.ui", yg = "boot", bg = /* @__PURE__ */ new Set(), xg = class {
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
		let r = this.resolveKey(e, yg);
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
		let n = e.getAttribute(De);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return bg.has(n) || (bg.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${vg}:${n}:${t}`;
	}
}, Sg = "ui-menu", Cg = "ui-menu--nested", wg = "ui-menu-item--selected", Tg = "ui-menu__submenu", Eg = ct, Dg = ut, Og = "data-ui-menu-flyout", kg = "data-ui-menu-unfolded", Ag = lt, jg = "menu-open-group", Mg = class {
	root;
	store = new xg();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new ws({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(Dg, ""), t.setAttribute(Og, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(Dg), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(Og);
			}, _o.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${Sg}`)), j(this.root, `.${Sg}`, {
			childList: !0,
			attributeFilter: [st]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${Eg}]`)) Ng(e);
		j(this.root, `[${Eg}]`, {
			childList: !0,
			attributeFilter: [Dg]
		}, (e) => {
			for (let t of e) Ng(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Fg(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), Pg(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Eg}]`)) Ng(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${wg}`), e);
		if (t !== null && !t.hasAttribute(Ag)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Cg) ? null : this.store.read(e, jg), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vt}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${Sg}`);
		a !== null && (Fg(a) || i.hasAttribute(Ag) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Cg);
		if (e.setAttribute(kg, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Dg);
			return;
		}
		if (t.hasAttribute(Dg)) {
			t.removeAttribute(Dg), n || this.store.write(e, jg, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, jg, t.getAttribute(h));
	}
	openInline(e) {
		e.setAttribute(Dg, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Eg}][${Dg}]`)) t.hasAttribute(Ag) || t.removeAttribute(Dg);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (Pg(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: "right-start",
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${Sg}`);
		a !== null && !va() && Aa(a, M(a, `.${vt}:not(${bt})`, `.${Sg}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Eg}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(xt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Eg}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Tg}`);
	}
};
function Ng(e) {
	let t = e.querySelector(`:scope > .${vt}`), n = e.closest(`.${Sg}`);
	t !== null && (t.setAttribute("aria-expanded", e.hasAttribute(Dg) ? "true" : "false"), e.hasAttribute(Ag) || n !== null && Fg(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Pg(e) {
	for (let t of e.querySelectorAll(`[${Og}]`)) t.removeAttribute(Og);
}
function Fg(e) {
	return e.hasAttribute(st);
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Ig = `.ui-menu[${dt}]`, Lg = ":scope > .ui-collapsible__bar", Rg = ":scope > .ui-menu__host", zg = "ui-menu__item", Bg = `:scope > .${vt}`, Vg = ".ui-text__title", Hg = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", Ug = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), j(t, Ig, {
			childList: !0,
			characterData: !0,
			attributeFilter: [st]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = Wg(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(Rg);
		if (n === null) return;
		let r = Dl(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: Gg(n)
		}), e.setAttribute(ft, ""), Jl(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of Kg(e)) {
			let e = qg(a);
			if (e === "header") {
				n !== null && Yg(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			Yg(a, o), r ||= o, i ||= o;
		}
		return n !== null && Yg(n, r), i;
	}
	match(e, t) {
		let n = kl(Jg(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(Hg) : null;
		if (r === null) return n;
		if (n) return Xg(r), e.removeAttribute(ut), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(ut, i), i;
	}
	clear(e, t) {
		Xg(t), e.removeAttribute(ft), Kg(t).length > 0 && Jl(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(st);
		for (let e of t.querySelectorAll(`[${ct}]:not([${lt}])`)) e.toggleAttribute(ut, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...Wg(e.target)?.querySelector(Rg)?.querySelectorAll(`.ui-menu-item:not(${bt})`) ?? []].find(wi);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function Wg(e) {
	let t = e.closest(Ig), n = t?.querySelector(Lg) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function Gg(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${ct}][${ut}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function Kg(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(zg));
}
function qg(e) {
	return e.querySelector(Bg)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function Jg(e) {
	return Ol(e.querySelector(Bg)?.querySelector(Vg)?.textContent ?? "", e);
}
function Yg(e, t) {
	e.toggleAttribute(pt, !t);
}
function Xg(e) {
	for (let t of e.querySelectorAll(`[${pt}]`)) t.removeAttribute(pt);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Zg = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Qg = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function $g(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Qg[t]}px)`)) return t;
	return "base";
}
function e_(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function B(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function t_(e, t) {
	let n;
	for (let r of Zg) {
		let i = B(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var n_ = "[data-ui-root]", r_ = "a[href]", i_ = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${Qg.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mt}]`);
		if (t !== null) {
			let e = t.closest(n_), n = t.getAttribute(mt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(r_)?.closest(`[${gt}]`), r = n?.parentElement ?? null;
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
		e.setAttribute(ht, t), this.markToggles(e);
		let n = a_(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, va(), performance.now() + _o.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(En, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (ka(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${n_}[${ht}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(ht);
		if (e.removeAttribute(ht), this.markToggles(e), t === null) return;
		let n = a_(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let n = e.querySelector(`[${mt}="${CSS.escape(t)}"]`);
			n !== null && A(n);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(ht);
		for (let n of e.querySelectorAll(`[${mt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(mt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(En), t && e.removeAttribute("tabindex"));
	}
};
function a_(e, t) {
	return e.querySelector(`:scope > [${gt}="${CSS.escape(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var o_ = "ui-collapsible", s_ = "ui-collapsible__content", c_ = "ui-collapsible__bar", l_ = "collapsed", u_ = class {
	root;
	store = new xg();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${o_}`)), j(this.root, `.${o_}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, l_);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Ct}]`), n = t?.closest(`.${o_}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(st), i = n.querySelector(`:scope > .${s_}`);
		this.cancelFold(n);
		let a = f_(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, l_, r ? "true" : "false", r ? { attributes: { [st]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(st, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Ct}], :scope > .${c_} > [${Ct}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || vo()) return;
		let i = m_(d_(e), n, f_(e, t), r);
		if (i === null) return;
		e.setAttribute(wt, "");
		let a = {
			duration: _o.normal,
			easing: _o.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(wt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(wt);
			for (let e of t) e.cancel();
		}
	}
};
function d_(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function f_(e, t) {
	let n = d_(e), r = p_(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function p_(e) {
	return e === "width" ? "height" : "width";
}
function m_(e, t, n, r) {
	let i = p_(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
var h_ = class {
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
		if (t === null || w(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(sn, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 }), this.drag = {
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
		this.drag = null, t.removeAttribute(sn), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(sn);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
//#endregion
//#region src/interactions/grid-tracks.ts
function g_(e) {
	let t = [];
	for (let n of y_(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = g_(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = __(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function __(e) {
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
	if (n !== null) return v_({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return v_(r[3] === "fr" ? {
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
function v_(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function y_(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function b_(e, t = "auto") {
	return e.map((e) => x_(e, t)).join(" ");
}
function x_(e, t) {
	switch (e.kind) {
		case "px": return `${S_(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${S_(e.min)}px`}, ${S_(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${S_(e.max)}px)` : `minmax(${S_(e.min)}px, auto)`;
	}
}
function S_(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function C_(e) {
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
function w_(e, t) {
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
function T_(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = E_(r, e), o = E_(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function E_(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function D_(e, t, n, r) {
	let i = O_(e, t, n.before), a = O_(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = N_(n.before, e) + N_(n.after, e), r = i.total + a.total;
		k_(l, e, i, t * (i.total + c) / r), k_(l, e, a, t * (a.total - c) / r);
	} else u || A_(l, i, i.total + c), d || A_(l, a, a.total - c);
	return l;
}
function O_(e, t, n) {
	let r = M_(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function k_(e, t, n, r) {
	let i = N_(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function A_(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...j_(e[i])
		};
	}
}
function j_(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function M_(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function N_(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function P_(e, t) {
	let n = M_(t.before, e), r = n + M_(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function F_(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function I_(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var L_ = "ui-grid-splitter", R_ = "ui-container", z_ = "ui-orientation--vertical", B_ = 16, V_ = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Tt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, H_ = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Et,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, U_ = class {
	root;
	store = new xg();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new h_({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${L_}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${L_}`)), j(this.root, `.${L_}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = W_(t);
			e !== null && (this.restore(e, G_(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Zg) {
			let i = r[n], a = e_(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${L_}`);
		if (t === null || this.drag.active || w(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = X_(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${L_}`), n = t === null ? null : W_(t);
		if (t === null || n === null) return;
		let r = G_(t);
		for (let e of Zg) n.style.removeProperty(e_(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = D_(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(e_(e.axis.split, e.tier), b_(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Zg) {
			let a = e_(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = W_(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = G_(e), r = $g(), i = K_(t, n, r), a = i === null ? null : g_(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = w_(a, C_(t.getAttribute(n.limits))), s = q_(t, n), c = J_(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = T_(c, Y_(t, n).map((e) => J_(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = W_(e);
		if (t === null) return;
		let n = G_(e), r = J_(e, n), i = q_(t, n), a = Y_(t, n).map((e) => J_(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : T_(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(P_(i, o))));
	}
};
function W_(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(R_) ? t : null;
}
function G_(e) {
	return e.classList.contains(z_) ? V_ : H_;
}
function K_(e, t, n) {
	for (let r = Zg.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(e_(t.split, Zg[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function q_(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function J_(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Y_(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(L_) && G_(r) === t && n.push(r);
	return n;
}
function X_(e) {
	let t = Number(e.getAttribute(Dt));
	return Number.isFinite(t) && t > 0 ? t : B_;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Z_ = "ui-split-button", Q_ = "ui-split-button__main", $_ = "ui-split-button__toggle", ev = "ui-split-button__menu", tv = "ui-split-button--open", nv = "ui-menu", rv = 4, iv = class {
	root;
	menus = new ws({
		show: ({ owner: e }) => e.classList.add(tv),
		hide: ({ owner: e }) => e.classList.remove(tv),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = av(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${Q_}`)?.closest(`.${Z_}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = av(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = ov(t), r = e.target.closest(`.${vt}`);
		n === null || r === null || !n.contains(r) || r.matches(`${bt}, ${St}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = ov(e), r = n?.querySelector(`.${nv}`) ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: rv
			},
			openers: sv(e)
		}) && Aa(r, M(r, `.${vt}:not(${bt})`, `.${nv}`), t);
	}
};
function av(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${$_}, .${Q_}`), n = t?.closest(`.${Z_}`) ?? null;
	return t === null || n === null || t.classList.contains(Q_) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function ov(e) {
	return e.querySelector(`:scope > .${ev}`);
}
function sv(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var cv = "ui-button-group", lv = "ui-button-group__item", uv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${cv}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), j(this.root, `.${cv}`, {
			childList: !0,
			attributeFilter: [dn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = dv(i);
			i.toggleAttribute(un, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		D(n, r ?? n.find(wi) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lv}`), n = t?.closest(`.${cv}`) ?? null;
		if (t === null || n === null || t.closest(`.${cv}`) !== n || w(n)) return;
		let r = dv(t);
		r !== null && w(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lv} > .${An}`), n = t?.closest(`.${cv}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(dv).filter((e) => e !== null), i = xi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${lv}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Di(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: dn,
			bindingAttribute: fn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return M(e, `.${lv}`, `.${cv}`);
	}
};
function dv(e) {
	return e.querySelector(`:scope > .${An}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var fv = "ui-accordion", pv = "details", mv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${fv}`)), j(this.root, `.${fv}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(fv))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${pv}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function hv(e) {
	return getComputedStyle(e).display !== "none";
}
//#endregion
//#region src/interactions/strip-overflow.ts
var gv = "ui-tab-overflow", _v = "ui-tab-overflow__menu", vv = "ui-tab-overflow__menu--open", yv = "ui-tab-overflow__entry", bv = "ui-tab-overflow__entry--current", xv = class {
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
		this.options = e, this.list = new wv(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : Sv({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return Cv(e, this.options.hiddenClass, t);
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
function Sv(e) {
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
function Cv(e, t, n) {
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
var wv = class {
	menu;
	button = null;
	list = new ws({
		show: ({ popup: e }) => e.classList.add(vv),
		hide: ({ popup: e }) => {
			e.classList.remove(vv), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = _v, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(Tv)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${bv}`);
		r !== null && D(this.entries(), r), this.button = e, jo(e, this.menu), this.list.open({
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
		}) ? r === null && Aa(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yv}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || w(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = xi({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), D(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${yv}`) : null;
		t === null || t === document.activeElement || w(t) || (D(this.entries(), t), ba(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${yv}`));
	}
};
function Tv(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${yv} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(bv, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(h, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(bn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var Ev = "ui-tabs", Dv = "ui-tab-header", Ov = "ui-tab-header--selected", kv = "ui-tab-header--overflowed", Av = "ui-tabs--overflowing", jv = "ui-tabs--no-overflow", Mv = "ui-tabs__strip", Nv = "data-ui-tab-key", Pv = "data-ui-tab-page", Fv = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new xv({
			rootClass: Ev,
			overflowingClass: Av,
			wraps: (e) => e.classList.contains(jv),
			hiddenClass: kv,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${Ev}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), j(this.root, `.${Ev}`, {
			childList: !0,
			attributeFilter: [pn, ..._n],
			relevant: (e) => !is(e, `[${Pv}]`, `.${Ev}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(Nv) ?? "") === t) ?? null;
		if (r !== null && !Iv(r)) {
			let t = n.find(Iv);
			if (t !== void 0) {
				this.select(e, t.getAttribute(Nv) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(Nv) ?? "") === t;
			e.classList.toggle(Ov, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(Iv), i), D(n.filter((e) => !e.classList.contains(kv)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(Pv) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${Mv}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(Nv) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(Iv).map((e) => {
				let n = e.getAttribute(Nv) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: w(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gv}`), n = t?.closest(`.${Ev}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${Ev}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Dv}`);
		if (r === null || w(r)) return;
		let i = r.closest(`.${Ev}`), a = r.getAttribute(Nv);
		i !== null && a !== null && r.closest(`.${Ev}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dv}`), n = t?.closest(`.${Ev}`) ?? null;
		if (t === null || n === null) return;
		let r = xi({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(Nv) ?? ""), r.focus());
	}
	select(e, t) {
		Di(e, t, {
			attribute: pn,
			bindingAttribute: fn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return M(e, `.${Dv}`, `.${Ev}`);
	}
	ownPages(e) {
		return M(e, `[${Pv}]`, `.${Ev}`);
	}
};
function Iv(e) {
	return e.classList.contains(kv) || hv(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var Lv = "ui-command-bar", Rv = "ui-command-bar__host", zv = "ui-command-bar__item", Bv = "ui-command-bar__overflow", Vv = "ui-command-bar--overflowing", Hv = "ui-command-bar__overflowed", Uv = "ui-text__title", Wv = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new xv({
			rootClass: Lv,
			overflowingClass: Vv,
			wraps: (e) => !Kv(e),
			hiddenClass: Hv,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${Lv}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), j(this.root, `.${Lv}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = Gv(e), n = e.querySelector(`:scope > .${Bv}`);
		if (t === null || n === null) return;
		let r = qv(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(Vv) && Jv(r);
		for (let e of r) ko(e, e.classList.contains(Hv) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Bv}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(Lv) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = Gv(e), n = t === null ? [] : qv(t).filter((e) => e.classList.contains(zv) && e.classList.contains(Hv)).map((e) => e.querySelector(v) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: Yv(e),
			current: !1,
			disabled: w(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !w(n) && Xv(n).click();
	}
};
function Gv(e) {
	return e.querySelector(`:scope > .${Rv}`);
}
function Kv(e) {
	let t = Gv(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function qv(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(zv) ? n.querySelector(v) : null;
		e !== null && hv(e) && t.push(n);
	}
	return t;
}
function Jv(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(zv) ? t ||= !r.classList.contains(Hv) : t || r.classList.add(Hv);
	}
}
function Yv(e) {
	let t = Xv(e), n = t.querySelector(`.${Uv}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function Xv(e) {
	return e.matches(ca) ? e : e.querySelector(ca) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var Zv = "ui-breadcrumbs", Qv = "ui-breadcrumbs__item", $v = "ui-breadcrumb", ey = "ui-breadcrumb--current", ty = "ui-hidden", ny = "data-ui-step-collapsed", ry = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), j(this.root, `.${Zv}`, {
			childList: !0,
			attributeFilter: ["class", ..._n]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Zv}`)) this.apply(e);
	}
	apply(e) {
		let t = M(e, `.${Qv}`, `.${Zv}`);
		for (let e of t) iy(e);
		let n = t.filter((e) => !e.classList.contains(ty)).map((e) => e.querySelector(`.${$v}`)).filter((e) => e !== null && !e.classList.contains(ty)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(ey, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function iy(e) {
	let t = e.querySelector(`:scope > .${$v}`), n = t === null ? "" : _n.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === _n[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(ny) : e.getAttribute(ny) !== n && e.setAttribute(ny, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function V(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function ay(e) {
	return V(e).toString(16).padStart(2, "0").toUpperCase();
}
function oy(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return sy(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function sy(e, t, n) {
	return .2126 * cy(e) + .7152 * cy(t) + .0722 * cy(n);
}
function cy(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var ly = "ui-color-input", uy = "ui-color-input--open", dy = "ui-color-input__popup", fy = "ui-color-input__text", py = "ui-color-input__row", my = "ui-color-input__swatch--button", hy = "ui-color-input__value-input", gy = "ui-color-input__square-thumb", _y = "ui-color-input__hue-thumb", vy = "data-ui-color-toggle", yy = "data-ui-color-tab", by = "data-ui-color-tab-selected", xy = "data-ui-color-pane", Sy = "data-ui-color-pane-selected", Cy = "data-ui-color-square", wy = "data-ui-color-hue", Ty = "data-ui-color-hex", Ey = "data-ui-color-channel", Dy = "data-ui-color-factor", Oy = "data-ui-color-opacity", ky = "data-ui-color-name", Ay = "data-ui-color-name-selected", jy = "data-ui-color-format", My = "data-ui-color-variant", Ny = "data-ui-color-no-picker", Py = "data-ui-color-no-palette", Fy = 4, Iy = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new ws({
		show: ({ owner: e }) => e.classList.add(uy),
		hide: ({ owner: e }) => e.classList.remove(uy)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${ly}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = b(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${ly}`) ?? []);
		}), j(this.root, `.${ly}`, {
			childList: !0,
			attributeFilter: [
				jy,
				My,
				Ny,
				Py
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new h_({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${Cy}], [${wy}]`),
			begin: (e, t) => {
				let n = e.closest(`.${ly}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(Cy) ? "square" : "hue"
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
		let t = Vy(e), n = this.states.get(e), r = n?.paneChosen === !0 ? Ly(e, n.pane) : Ry(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? zy(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Yy(t);
			if (i === null) return n ?? zy(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && By(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Qy(a, o, s);
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
			...n ?? zy(r),
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
			let [e, a, o] = Qy(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Gy(e, "--ui-color-input-color", t.held ? Zy(n, r, i, t.opacity) : "transparent"), Gy(e, "--ui-color-input-solid", Zy(n, r, i, 255)), Gy(e, "--ui-color-input-on-color", t.held ? oy(n, r, i, t.opacity) : "inherit"), Wy(e, t.held ? Uy(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${Cy}]`), o = e.querySelector(`[${wy}]`), [s, c, l] = $y(t.hue, 1, 1);
		if (Gy(e, "--ui-color-input-hue", Zy(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${gy}`);
			e !== null && (Gy(e, "left", `${t.saturation * 100}%`), Gy(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${_y}`);
			e !== null && Gy(e, "top", `${t.hue / 360 * 100}%`);
		}
		Ky(e, `[${Ty}]`, Xy(n, r, i)), Ky(e, `[${Ey}="r"]`, String(n)), Ky(e, `[${Ey}="g"]`, String(r)), Ky(e, `[${Ey}="b"]`, String(i)), Gy(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), qy(e, `[${Oy}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${ky}]`)) n.getAttribute(ky) === t.name ? n.setAttribute(Ay, "") : n.removeAttribute(Ay);
		let n = t.name === null ? null : e.querySelector(`[${ky}="${t.name}"]`), r = n === null ? null : Yy(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Gy(e, "--ui-color-input-base", r === null ? "transparent" : Zy(r[0], r[1], r[2], 255)), qy(e, `[${Dy}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${xy}]`)) n.getAttribute(xy) === t.pane ? n.setAttribute(Sy, "") : n.removeAttribute(Sy);
		for (let n of e.querySelectorAll(`[${yy}]`)) n.getAttribute(yy) === t.pane ? n.setAttribute(by, "") : n.removeAttribute(by);
	}
	resolveRgb(e, t) {
		if (t.name === null) return $y(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${ky}="${t.name}"]`), r = n === null ? null : Yy(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? $y(t.hue, t.saturation, t.value) : Jy([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${vy}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${ly}`));
			return;
		}
		let n = e.target.closest(`[${yy}]`), r = e.target.closest(`.${ly}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(yy), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${ky}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(ky)
			}));
			return;
		}
		let a = r.querySelector(`.${dy}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${ly}`);
		if (t !== null) {
			if (e.target.hasAttribute(Dy)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(Oy) && this.commit(t, (t) => ({
				...t,
				opacity: V(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${ly}`);
		if (n === null) return;
		if (t.hasAttribute(Dy) || t.hasAttribute(Oy)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(Ty)) {
			let e = Yy(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Qy(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Ey);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = V(Number(t.value));
		let [l, u, d] = Qy(c.r, c.g, c.b);
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
			let e = eb((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = eb((t.x - a.left) / a.width), s = 1 - eb((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || E(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${hy}`);
		a !== null && (a.value = Hy(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		E(e) || e.querySelector(`.${hy}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(Ny) && e.hasAttribute(Py)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${dy}`), n = e.querySelector(`[${vy}]`);
		if (t === null) return;
		let r = e.getAttribute(My) === "swatch" ? e.querySelector(`.${my}`) : e.querySelector(`.${py}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: Fy
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${by}]`) ?? !0
		});
	}
};
function Ly(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? Ny : Py))(t) ? t : t === "picker" ? "palette" : "picker";
}
function Ry(e) {
	return Ly(e, "picker");
}
function zy(e) {
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
function By(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function Vy(e) {
	return e.querySelector(`.${hy}`)?.value.trim() ?? "";
}
function Hy(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Xy(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${ay(e.opacity)}`;
}
function Uy(e, t, n, r, i) {
	if (e.getAttribute(jy) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Xy(t, n, r);
	return i === 255 ? a : `${a}${ay(i)}`;
}
function Wy(e, t) {
	for (let n of e.querySelectorAll(`.${fy}`)) n.textContent !== t && (n.textContent = t);
}
function Gy(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function Ky(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function qy(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Jy(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		V(e[0] * (1 - n)),
		V(e[1] * (1 - n)),
		V(e[2] * (1 - n))
	] : [
		V(e[0] + (255 - e[0]) * n),
		V(e[1] + (255 - e[1]) * n),
		V(e[2] + (255 - e[2]) * n)
	];
}
function Yy(e) {
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
function Xy(e, t, n) {
	return `#${ay(e)}${ay(t)}${ay(n)}`;
}
function Zy(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Qy(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function $y(e, t, n) {
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
		V((o + a) * 255),
		V((s + a) * 255),
		V((c + a) * 255)
	];
}
function eb(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function tb(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var H = "ui-table", nb = "ui-table--reorderable", rb = "ui-scroll-x--auto", ib = "ui-scroll-x--always", ab = `:scope > .${Nt}`, ob = `.${Ft}`, sb = "ui-table__header-cell", cb = `${sb}--pinned`, lb = `${ab} > .${Pt} > .${sb}`, ub = `${lb}--pinned`, db = "ui-table__host", fb = `${ab} > .${db}`, pb = `.${H}, .${Mt}, [${Ot}]`, mb = "--ui-table-columns", hb = "--ui-table-sized-columns", gb = "--ui-table-pin-", _b = "--ui-table-order-", vb = 64, yb = "data-ui-table-cell-hidden", bb = "data-ui-table-cell-last", xb = "columns", Sb = "hidden", Cb = "order", wb = "layout", Tb = 32, Eb = 16, Db = class {
	root;
	store = new xg();
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
		if (this.root = e.root ?? document, this.drag = new h_({
			root: this.root,
			resolveHandle: (e) => e.closest(ob),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new h_({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Zg) e !== "base" && matchMedia(`(min-width: ${Qg[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${H}`)), j(this.root, `.${H}`, {
			childList: !0,
			relevant: Ab
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), j(this.root, `.${H}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(H)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), j(this.root, `.${H}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: jb
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(fb);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), tb(t, () => this.pin(t));
			let e = t.querySelector(fb);
			e !== null && (this.markScrollbar(t, e), tb(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, xb), r = n === null ? null : g_(n);
		r !== null && r.length !== t.length ? (this.store.write(e, xb, null), this.store.writeBoot(e, wb, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, Cb);
		if (i !== null && !Nb(i, t)) {
			this.store.write(e, Cb, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Vt, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${H}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = Mb(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(rb) || e.classList.contains(ib);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(hb);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = I_(t, n);
				e.style.setProperty(hb, b_(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${_b}${t}`, String(r[t])) : e.style.removeProperty(`${_b}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(jt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(jt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(It) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(It, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(nb)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= vb) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Ot}]`)) {
				let r = Number(t.getAttribute(Ot));
				!(r >= vb) || t.closest(`.${H}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(yb, n.hidden.has(r)), t.toggleAttribute(bb, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(lb)) {
			let e = Number(n.getAttribute(Ot)), r = n.getAttribute(kt), i = n.classList.contains(cb) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Lb(r) ? r : null,
				startsHidden: n.hasAttribute(At),
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
		for (let e of t) (n[e.key] ?? Ib(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, Sb) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(mb).trim(), n = t.length === 0 ? null : g_(t);
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
		n === null || i !== void 0 && n === Ib(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, Sb, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return Mb(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(ub).length;
		if (t < 2) return;
		let n = F_(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${gb}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${H}`)?.toggleAttribute(Bt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(ab), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return Ob(e) ? n.slice(1) : n;
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
		let t = e.target.closest(ob);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Eb;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${H}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Ot)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ob)?.closest(`.${H}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = D_(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(Tb, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, kb(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, xb, t === null ? null : b_(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(hb).trim(), n = e.getAttribute(jt), r = {};
		t.length > 0 && (r[hb] = t);
		for (let t of e.style) t.startsWith(_b) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, wb, null);
			return;
		}
		this.store.writeBoot(e, wb, {
			styles: r,
			attributes: {
				[jt]: n,
				[It]: e.getAttribute(It)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${H}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = C_(t.getAttribute(Tt)), i = w_(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Ot)), u = this.hiddenOf(t, o), d = Mb(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${sb}`), n = t?.closest(`.${H}`) ?? null;
		return t === null || n === null || !n.classList.contains(nb) || e.closest(ob) !== null || t.classList.contains(cb) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${H}`), r = Number(e.getAttribute(Ot));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Lt, ""), e.setAttribute(Rt, ""), {
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
		for (let a of Mb(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Pb(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), Fb(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(zt, "after") : a.cell.setAttribute(zt, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Rt), t.table.removeAttribute(Lt), Fb(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = Mb(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, Cb, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function Ob(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function kb(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function Ab(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(pb) || t.querySelector(pb) !== null)) return !0;
	return !1;
}
function jb(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(db);
}
function Mb(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function Nb(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Pb(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Fb(e) {
	for (let t of e.querySelectorAll(`[${zt}]`)) t.removeAttribute(zt);
}
function Ib(e) {
	return e.startsHidden || e.hideBelow !== null && Zg.indexOf($g()) < Zg.indexOf(e.hideBelow);
}
function Lb(e) {
	return e !== null && Zg.includes(e);
}
var Rb = "bottom";
function zb(e, t, n) {
	let r = e.querySelector(`:scope > [${Qe}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Qe, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function Bb(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var Vb = /* @__PURE__ */ new WeakMap();
function Hb(e) {
	for (let t of e.querySelectorAll(`[${He}]`)) t.remove();
}
function Ub(e, t, n, r, i, a) {
	let o = bf(e) === "windowed", s = N(e), c = o ? s : Sf(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : ff(f, a, cf(e));
	if (u && !d && Hb(e), c.length === 0) {
		Vb.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Kd(e);
	if (!d) {
		Bb(e, [...pf(c, p, r), ...Gd(ee)]);
		return;
	}
	Hb(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (Vb.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	Vb.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = pf(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = Wb(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	Bb(e, [...re, ...Gd(ee)]);
}
function Wb(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(He, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var Gb = "ui-tree-rules", Kb = "ui-tree";
function qb(e, t, n) {
	if (e.parentElement?.classList.contains(Kb) === !0) {
		e.dispatchEvent(new Event(Gb, { bubbles: !0 }));
		return;
	}
	switch (bf(e)) {
		case "windowed":
			qd(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			lf(e, t, n.metadata, n.renderer, n.state), qd(e, t, n.templates, n.renderer), Ub(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Jb = ".ui-items-view, .ui-table", Yb = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Xb = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${ki})[${ln}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), j(this.root, ki, {
			childList: !0,
			attributeFilter: [
				ln,
				dn,
				_
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		zi(e, this.ownItems(e));
	}
	handleClick(e) {
		let t = this.resolveRow(e, ki);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (na(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Pi(n, r);
			return;
		}
		Vi(n, i, r, Fi(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Ai), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || w(r) ? null : Zc(e.target, n) === null && !T(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Jb);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), oa(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = $i(e.target);
		if (t === null || t.row !== null && Zc(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(Jb) || w(n)) return;
		let r = Zb(n);
		if (!Yb.has(e.key) && !Si(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = ta(i), o = ra(e.key, i, a, r);
		if (o !== null) {
			e.preventDefault(), na(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Ni(n, a), Vi(n, i, o, Ii(n, e)));
			return;
		}
		if (!(a === null || T(a))) {
			switch (e.key) {
				case " ":
					if (!Vi(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					Li(n) && !Bi(i).includes(a) && Vi(n, i, a, ji), oa(a, "open");
					break;
				case "Delete": {
					let e = Qb(i, a);
					if (e.length === 0) return;
					for (let t of e) oa(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return M(e, Ai, ki);
	}
};
function Zb(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function Qb(e, t) {
	let n = Bi(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !T(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function $b(e, t) {
	if (T(e)) return !1;
	let n = t?.getAttribute(Gt);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
//#endregion
//#region src/interactions/tree-engine.ts
var ex = "ui-tree", tx = "ui-tree__row", nx = "ui-tree__row--folded", rx = "ui-tree__row--filtered", ix = "fold-hidden", ax = "fold-shown", ox = "ui-tree__row--dragging", sx = "ui-tree__loading", cx = "ui-tree__loading-ring", lx = "ui-tree-node", ux = "ui-tree-node__text", dx = "ui-tree-node__toggle", fx = "ui-tree-node__rename", px = ".ui-text__title", mx = "data-ui-tree-drop", hx = "--ui-tree-depth", gx = "expanded", _x = 600, vx = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), yx = class {
	root;
	store = new xg();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Gb, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${ex}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(b(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => k(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${ex}`)), j(this.root, `.${ex}`, {
			childList: !0,
			attributeFilter: [
				Ut,
				Wt,
				Kt,
				Zt
			],
			relevant: Sx
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Zt), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Tx(e)?.getAttribute(Ut);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = k(e), r = Tx(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Wt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(hx, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(nx, !d), e.classList.toggle(rx, re), e.removeAttribute(Xt), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !T(e), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Jt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Jt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Jt), d && ne && !re), s.set(n, {
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
		return Tx(e.row)?.hasAttribute(Kt) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${tx}[${h}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, ix, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, ax, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Xt]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = br(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = cf(t);
		if (r === void 0 && i === null) return null;
		let a = ff(r, this.rules.state, i), o = df(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(k)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Tx(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => mf(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(k(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${sx}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = k(o), c = i.getItemValue(o);
			if (c === void 0 || uf(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Tx(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(sx) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Cx();
		o.style.setProperty(hx, String(t)), o.classList.toggle(nx, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${dx}`) === null && (!r.hasAttribute("data-ui-unselectable") || Zc(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Zc(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${tx}`), n = t?.closest(`.${ex}`) ?? null;
		return t === null || n === null || t.closest(`.${ex}`) !== n || T(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = $i(e.target);
		if (t === null || t.row !== null && Zc(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains(ex) || w(n) || !vx.has(e.key) && !Si(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = ta(r), a = ra(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, Ii(n, e));
			return;
		}
		if (!(i === null || T(i))) {
			switch (e.key) {
				case " ":
					if (!Vi(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, ra("ArrowDown", r, i, "vertical"), ji);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), ji);
					break;
				case "Enter":
					Li(n) && !Bi(r).includes(i) && Vi(n, r, i, ji), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = Qb(r, i);
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
		let t = wx(e), n = t?.closest(`.${ex}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (T(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? Bi(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !T(e) && e.getClientRects().length > 0) : [];
		kf(e, n, t, ox, k(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(ox));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ex}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${tx}`), a = i !== null && i.closest(`.${ex}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (!$b(a, Tx(a)) || n.some((t) => t === a || xx(e, k(a), k(t)))) {
				this.markDrop(t, null), this.springOpen(t, null);
				return;
			}
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), _x)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ex}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ex}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${mx}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(tx) ? k(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && xx(a, k(e), k(t))));
		this.markDrop(t, null), this.springOpen(t, null), Af(t, ox), r.classList.contains(tx) && this.expand(t, r);
		for (let e of o) {
			let t = Tx(e)?.querySelector(`.${ux}`) ?? null;
			t !== null && (t.setAttribute(Yt, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = wx(e)?.closest(`.${ex}`) ?? null;
		t !== null && (Af(t, ox), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${mx}]`)) n !== t && n.removeAttribute(mx);
		t?.setAttribute(mx, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(k(n), Tx(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = k(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(nx)) : [];
		this.store.writeJson(e, gx, i), this.layout(e), bx(a.filter((e) => !e.classList.contains(nx)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, gx) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ta(r);
		na(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Ni(e, i), Vi(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Tx(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => k(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${ex}`), n = Tx(e), r = n?.querySelector(px) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), ds({
			container: n,
			title: r,
			className: fx,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(qt, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${g}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(tx) && n.push(e);
		return n;
	}
};
function bx(e) {
	if (!(e.length === 0 || vo())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: _o.fast,
		easing: _o.enter
	});
}
function xx(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Sx(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(tx) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(ex) === !0);
}
function Cx() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = sx, e.setAttribute("aria-hidden", "true"), t.className = cx, e.append(t, C.text("ui.tree.loading")), e;
}
function wx(e) {
	return e.target instanceof Element ? e.target.closest(`.${tx}`) : null;
}
function Tx(e) {
	return e.querySelector(`.${lx}`);
}
var Ex = "tabs:rename", Dx = "tabs:pin", Ox = "tabs:unpin", kx = "tabs:close", Ax = "tabs:delete";
function jx(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function Mx(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[Ex, e.rename && t.renamable],
		[Dx, e.pin && !t.pinned],
		[Ox, e.pin && t.pinned],
		[kx, e.close && !e.delete && n],
		[Ax, e.delete && n]
	]);
}
function Nx(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function Px(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, Fx(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function Fx(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function Ix(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var U = "ui-tabs-view", Lx = "ui-tab-item", Rx = "ui-tab-item__label", zx = "ui-tab-item__close", Bx = "ui-tab-item__rename", Vx = "ui-tab-item__caption", Hx = "ui-tab-item__pin", Ux = ".ui-text__title", Wx = "ui-tab-item--dragging", Gx = "ui-tab-item__caption--overflowed", Kx = "ui-tabs-view--overflowing", qx = "ui-tabs-view--no-overflow", Jx = "ui-tab-item__page", Yx = "ui-tab-item--selected", Xx = ".ui-menu-item", Zx = "tab-menu-entry", Qx = {
	name: Zx,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, $x = "--ui-tabs-view-strip", eS = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new xv({
			rootClass: U,
			overflowingClass: Kx,
			wraps: (e) => e.classList.contains(qx),
			hiddenClass: Gx,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(b(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => fS(e) === t.key))?.querySelector(`.${Rx}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(qh, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), j(this.root, `.${U}`, {
			childList: !0,
			attributeFilter: [
				pn,
				ye,
				..._n
			],
			relevant: (e) => !is(e, `.${Jx}`, `.${U}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${U}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(hv);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => fS(e) === r)) {
			this.select(e, fS(n[0]));
			return;
		}
		let i = e.hasAttribute(ye), a = [], o = null, s = null;
		for (let e of t) {
			let t = fS(e) === r;
			e.classList.toggle(Yx, t);
			let c = e.querySelector(`.${Vx}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${Rx}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${Jx}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${Jx}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${Rx}`);
			t === null || e.classList.contains(Gx) || (c.push(t), e === o && (l = t));
		}
		D(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !hv(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty($x, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${g}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${gv}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => fS(e) === t)?.querySelector(`.${Rx}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(hv).map((e) => ({
				key: fS(e),
				title: e.querySelector(`.${Rx}`)?.textContent?.trim() ?? fS(e),
				current: fS(e) === t,
				disabled: w(e.querySelector(`.${Rx}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${Lx}`);
		if (n === null || !n.classList.contains(U) || r === null || r.closest(`.${U}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = rS(n, r), a = aS(t), o = a.map((e) => {
			if (iS(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? hv(e) ? "shown" : "hidden";
		});
		if (Nx(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: fS(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${xe}="tab"]`), n = t?.parentElement ?? null, r = e.closest(Xx);
		if (t === null || n === null || !n.classList.contains(U) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => fS(e) === a.key);
		if (i.length === 0 || r.matches(`${xt}, ${bt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(Zx, {
			bubbles: !0,
			detail: { keys: [i, fS(o)] }
		})), !0;
		if (rS(n, o).get(i) !== !0) return !0;
		switch (i) {
			case Ex: {
				let e = o.querySelector(`.${Rx}`);
				e !== null && this.startRename(e);
				break;
			}
			case Dx:
			case Ox:
				this.setPinned(n, o, i === Dx);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${Vx} > .${Hx}`);
		t.toggleAttribute(gn, n), r !== null && (r.toggleAttribute(gn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = Ix(a.map(uS));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? oS(a[a.length - 1]).after(oS(t)) : oS(s).before(oS(t)), lS([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${gv}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(U)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = sS(e.target), i = r?.closest(`.${U}`) ?? null;
		if (r === null || i === null || w(r)) return;
		let a = r.closest(`.${Lx}`);
		a !== null && a.closest(`.${U}`) === i && (e.preventDefault(), this.select(i, fS(a)), document.activeElement !== r && A(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${zx}`), r = n?.closest(`.${Lx}`) ?? null, i = r?.closest(`.${U}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), nS(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = sS(e.target), n = t?.closest(`.${U}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Ux) ?? e, r = e.closest(`.${Lx}`);
		t === null || r === null || oS(r).hasAttribute("data-ui-unrenamable") || ds({
			container: t,
			title: n,
			className: Bx,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(hn, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => A(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rx}`), n = t?.closest(`.${U}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${Rx}`)).filter((e) => e !== null), i = xi({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${Lx}`);
		a !== null && this.select(n, fS(a)), i.focus();
	}
	handleDragStart(e) {
		let t = cS(e);
		if (t === null) return;
		if (oS(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		kf(e, t.closest(`.${U}`) ?? t, t, Wx, fS(t));
		let n = oS(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Vx}`)?.closest(`.${Lx}`) ?? null, n = t?.closest(`.${U}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Wx}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${Vx}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = oS(r), o = t.hasAttribute("data-ui-tab-pinned") ? tS(n, a) : null, s = o ?? oS(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${U}`);
		t !== null && t.querySelector(`.${Wx}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = cS(e);
		if (t === null) return;
		t.classList.remove(Wx);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(oS(t), n.next);
			return;
		}
		let r = oS(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${U}`);
		if (i === null) return;
		let a = this.ownItems(i);
		lS(a, a.indexOf(t));
	}
	select(e, t) {
		Di(e, t, {
			attribute: pn,
			bindingAttribute: fn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return M(e, `.${Lx}`, `.${U}`);
	}
};
function tS(e, t) {
	let n = null;
	for (let r of M(e, `.${Lx}`, `.${U}`)) {
		let e = oS(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function nS(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !oS(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function rS(e, t) {
	return Mx(jx(e.getAttribute(be)), {
		pinned: t.hasAttribute(gn),
		renamable: !oS(t).hasAttribute(pe),
		removable: e.hasAttribute("data-ui-tabs-removes") && nS(e, t)
	});
}
function iS(e) {
	let t = e.getAttribute(h);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function aS(e) {
	let t = e.querySelector(`[${g}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function oS(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function sS(e) {
	return e.closest(`.${zx}`) !== null || us(e) ? null : e.closest(`.${Vx}`)?.querySelector(`:scope > .${Rx}`) ?? null;
}
function cS(e) {
	return e.target instanceof Element ? e.target.closest(`.${Vx}`)?.closest(`.${Lx}`) ?? null : null;
}
function lS(e, t) {
	for (let [n, r] of Px(e.map(uS), t)) e[n].setAttribute(mn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function uS(e) {
	return {
		order: dS(e),
		pinned: e.hasAttribute(gn)
	};
}
function dS(e) {
	let t = e.getAttribute(mn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function fS(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var pS = "button.ui-text__fold-toggle", mS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(pS);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, hS = "ui-temporal-input__segments", gS = "ui-temporal-input__segment", _S = "ui-temporal-input__segment-literal", vS = "ui-temporal-input__segment--empty", yS = "data-ui-temporal-segment", bS = "data-ui-temporal-step-direction", xS = "data-ui-temporal-segments-of", SS = "--", CS = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${I}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(vr(e.components, `.${I}`));
		}), j(this.root, `.${I}`, { attributeFilter: [...Bp] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Hp(t) === "time" && (sm(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${hS}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Up(e), r = Kp(e), i = L(e, em(t));
		t.getAttribute(xS) !== n && (t.replaceChildren(...wS(n).map((e) => ES(e))), t.setAttribute(xS, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(yS);
			if (t === null) {
				n.textContent = OS(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = kS(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(vS, i === null), n.tabIndex = 0, AS(n, t, i, E(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = MS(e.target);
		if (t === null) return;
		let n = t.closest(`.${I}`), r = t.getAttribute(yS), i = jS(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), PS(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), im(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = FS(e.key, Kp(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = MS(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = MS(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Tm(this.wheelTurn, wm(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${I}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(yS), n < 0 ? 1 : -1, jS(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${bS}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${bS}]`);
		if (t === null) return;
		let n = t.closest(`.${I}`);
		if (n === null || E(n)) return;
		e.preventDefault();
		let r = NS(n) ?? n.querySelector(`.${gS}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(yS), t.getAttribute(bS) === "up" ? 1 : -1, jS(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${gS}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${I}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = L(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = IS(t), o = Gp(Wp(e), a) * n, s = a === "hour" ? 24 : 60, c = ((LS(i, a) + o) % s + s) % s;
		this.write(e, RS(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? RS(t, "hour", zS(l, t.getHours() >= 12)) : RS(t, IS(n), l), i);
		}
		u && PS(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, RS(r, "hour", zS(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return L(e, t) ?? lm(e);
	}
	write(e, t, n) {
		im(e, um(e, t), n), om(e), this.applySegments(e);
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
function wS(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = tp(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(TS(r)), n += r.length;
	}
	return t;
}
function TS(e) {
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
function ES(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = _S, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = gS, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(yS, e.unit), t.dataset.width = String(e.width), DS(t, e.unit), t;
}
function DS(e, t) {
	if (t === "meridiem") {
		C.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = IS(t);
	C.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function OS(e, t, n, r) {
	return t && n !== null ? $f(n, e, r) : e;
}
function kS(e, t, n, r) {
	if (n === null) return SS;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : LS(n, IS(e));
	return String(i).padStart(t, "0");
}
function AS(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : LS(n, IS(t))));
}
function jS(e) {
	return em(e.closest(`.${hS}`));
}
function MS(e) {
	let t = e instanceof Element ? e.closest(`.${gS}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${I}`);
	return n === null || E(n) ? null : t;
}
function NS(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${gS}`) : null;
}
function PS(e, t, n) {
	xi({
		key: n,
		items: [...e.querySelectorAll(`.${gS}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function FS(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function IS(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function LS(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function RS(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function zS(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var BS = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, VS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function HS(e) {
	let t = e?.trim() ?? "";
	if (!VS.test(t)) return null;
	let n = Date.parse(BS.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function US(e) {
	return e === "date" || e === "time" || e === "relative" ? e : "date-time";
}
var WS = {
	...Xf,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function GS(e, t, n, r) {
	if (t === "relative") return $S(e - r, n.language);
	let i = n.temporal ?? WS, a = t === "date" ? i.date : t === "time" ? i.shortTime : Yf(i, !1);
	return $f(new Date(e), a, i);
}
var KS = /* @__PURE__ */ new Map();
function qS(e) {
	let t = KS.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(JS(e), { numeric: "auto" }), KS.set(e, t)), t;
}
function JS(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var YS = 1e3, XS = 60 * YS, ZS = 60 * XS, QS = 24 * ZS;
function $S(e, t) {
	let n = qS(t), r = Math.abs(e);
	return r < 45 * YS ? n.format(0, "second") : r < 45 * XS ? n.format(Math.round(e / XS), "minute") : r < 22 * ZS ? n.format(Math.round(e / ZS), "hour") : r < 26 * QS ? n.format(Math.round(e / QS), "day") : r < 320 * QS ? n.format(Math.round(e / (30.4375 * QS)), "month") : n.format(Math.round(e / (365.25 * QS)), "year");
}
var eC = 15 * YS, tC = "ui-timestamp", nC = "ui-timestamp__text", rC = "data-ui-timestamp-format", iC = "datetime", aC = class {
	root;
	timer = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${tC}`), C.temporal === null), C.onTable(() => this.apply(this.root.querySelectorAll(`.${tC}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(vr(e.components, `.${tC}`))), j(this.root, `.${tC}`, {
			childList: !0,
			attributeFilter: [iC],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${tC}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: C.temporal,
			language: C.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = US(a.getAttribute(rC)), o = HS(a.getAttribute(iC)), s = a.querySelector(`.${nC}`);
			if (s === null || t && e !== "relative") continue;
			let c = o === null ? "" : GS(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= e === "relative" && o !== null;
		}
		i && this.timer === null && (this.timer = window.setInterval(() => this.refreshRelative(), eC));
	}
	refreshRelative() {
		let e = [...this.root.querySelectorAll(`.${tC}[${rC}="relative"]`)];
		if (e.length === 0 && this.timer !== null) {
			window.clearInterval(this.timer), this.timer = null;
			return;
		}
		this.apply(e);
	}
}, oC = "data-ui-scroll-anchor", sC = "End", cC = 4, lC = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), j(this.root, `[${oC}="${sC}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ot]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !uC(t) || this.pinned.set(t, fC(t) && !dC(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${oC}="${sC}"]`));
	}
	followEach(e) {
		for (let t of e) if (this.pinned.get(t) !== !1) {
			if (dC(t)) {
				this.pinned.set(t, !1);
				continue;
			}
			this.pinned.set(t, !0), fC(t) || (t.scrollTop = t.scrollHeight);
		}
	}
};
function uC(e) {
	return e.getAttribute(oC) === sC;
}
function dC(e) {
	return e.getAttribute(rt)?.toLowerCase() === "true";
}
function fC(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= cC;
}
//#endregion
//#region src/items/items-viewport.ts
function pC(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function mC(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${g}][${Je}]`) : null;
}
function hC(e) {
	let t = pC(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - _C(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function gC(e, t) {
	let n = pC(e);
	n.scrollTop = n === e ? t : t + _C(e, n);
}
function _C(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function vC(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = bC(e, a, n), s = bC(e, a + 1, n);
	return xC(t, o.top, s.top, o.line, s.line);
}
function yC(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = bC(e, a, n), s = bC(e, a + 1, n);
	return xC(t, o.line, s.line, o.top, s.top);
}
function bC(e, t, n) {
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
function xC(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var SC = 250, CC = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Ye);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < SC && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Ye}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Ye}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = wC(e, "data-ui-scroll-viewport") ?? TC(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? DC(e) : null, a = i === null ? null : DC(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = yC(a, vC(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? EC(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function wC(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function TC(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : wC(e, g);
	return t === null ? null : pC(t);
}
function EC(e, t) {
	return t > 0 ? e / t : 0;
}
function DC(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Xe}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Ze}]`);
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
var OC = `.${An}, .ui-action, .${vt}`, kC = St, AC = "ui-pressing", jC = "--ui-press-x", MC = "--ui-press-y", NC = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(OC);
		if (t === null || w(t) || t.matches(kC) || vo()) return;
		let n = e.target.closest(Dn);
		if (n !== null && n !== t && t.contains(n)) return;
		let r = t.getBoundingClientRect();
		t.style.setProperty(jC, `${e.clientX - r.left}px`), t.style.setProperty(MC, `${e.clientY - r.top}px`), t.classList.remove(AC), t.offsetWidth, t.classList.add(AC), window.setTimeout(() => t.classList.remove(AC), _o.ripple);
	}
}, PC = [
	"http",
	"https",
	"mailto",
	"tel"
];
function FC(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || PC.includes(t.slice(0, n).toLowerCase());
}
function IC(e) {
	return FC(e) ? String(e) : void 0;
}
var LC = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function RC(e) {
	let t = VC(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || LC.some((e) => n.startsWith(e));
}
function zC(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f]/.test(e) ? !1 : e === "/" || BC(e);
}
function BC(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function VC(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function HC(e) {
	return UC(e) !== null;
}
function UC(e) {
	let t = VC(e), n = t.toLowerCase();
	return BC(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function WC(e) {
	return UC(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/interactions/refusal-engine.ts
var GC = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), KC = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], qC = `.${bn}, .${xn}`, JC = RegExp(`(^|\\s)(${bn}|${xn})(\\s|$)`), YC = RegExp(`(^|\\s)${Sn}(\\s|$)`), XC = "[type='range']", ZC = /* @__PURE__ */ new WeakSet(), QC = /* @__PURE__ */ new WeakSet();
function $C(e = document) {
	let t = e === document ? window : e;
	for (let e of KC) t.addEventListener(e, sw, !0);
	t.addEventListener("keydown", lw, !0), t.addEventListener("change", uw, !0), t.addEventListener("pointerdown", dw, !0), t.addEventListener("mousedown", dw, !0), iw(e.querySelectorAll(qC)), nw(e.querySelectorAll(`[${yn}]`)), tw(e.querySelectorAll(XC)), new MutationObserver((e) => {
		for (let t of e) ew(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", yn],
		attributeOldValue: !0
	});
}
function ew(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			rw(t, e.oldValue !== null);
			return;
		}
		let n = JC.test(e.oldValue ?? ""), r = t.matches(qC);
		n !== r && (aw(t, r), rw(t)), YC.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && tw(t.querySelectorAll(XC));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(qC) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && ow(n), n.matches(qC) && aw(n, !0), iw(n.querySelectorAll(qC)), rw(n), nw(n.querySelectorAll(`[${yn}]`)), tw([n, ...n.querySelectorAll(XC)]));
}
function tw(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = E(t);
		e !== ZC.has(t) && (e ? (ZC.add(t), t.addEventListener("touchstart", dw, { passive: !1 })) : (ZC.delete(t), t.removeEventListener("touchstart", dw)));
	}
}
function nw(e) {
	for (let t of e) rw(t);
}
function rw(e, t = !1) {
	let n = e.getAttribute(yn);
	n === null && !t || (e.matches(qC) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !FC(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function iw(e) {
	for (let t of e) aw(t, !0);
}
function aw(e, t) {
	for (let n of e.children) t ? ow(n) : QC.has(n) && (QC.delete(n), n.removeAttribute("inert"));
}
function ow(e) {
	e.hasAttribute("inert") || (QC.add(e), e.setAttribute("inert", ""));
}
function sw(e) {
	e.target instanceof Element && (w(e.target) ? (e.type === "click" && ys(e), fw(e)) : e.type === "click" && cw(e.target) && e.preventDefault());
}
function cw(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && E(e);
}
function lw(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && w(e.target)) {
			fw(e);
			return;
		}
		!GC.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && E(e.target) && e.preventDefault();
	}
}
function uw(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && E(e.target) && e.stopImmediatePropagation();
}
function dw(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !E(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function fw(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/rendering/icon-value.ts
var pw = "mask:", mw = "ui-icon--image", hw = "ui-icon--mask";
function gw(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(pw) && (n = !0, t = t.slice(5).trim());
	let r = UC(t);
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function _w(e) {
	let t = gw(e);
	return t === null ? "" : vw(t.source);
}
function vw(e) {
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
var yw = "ui-icon", bw = "data-ui-icon";
function xw(e, t) {
	e.classList.add(yw);
	for (let t of Array.from(e.classList)) Cw(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url");
	let n = ww(t);
	if (n.length === 0) {
		e.removeAttribute(bw);
		return;
	}
	e.setAttribute(bw, ""), e.classList.add(n);
	let r = gw(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", vw(r.source));
}
var Sw = "ui-icon-glyph--";
function Cw(e) {
	return e === mw || e === hw || e.startsWith(Sw);
}
function ww(e) {
	let t = gw(e);
	return t === null ? Tw(e) : t.tinted ? hw : mw;
}
function Tw(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Sw;
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
var Ew = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Dw = "\\", Ow = "`", kw = "!", Aw = "{", jw = "}", Mw = "ui-text__fold", Nw = "ui-text__fold-toggle", Pw = "ui-text__fold-content", Fw = 8;
function Iw(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return qw(new nT(e), 0, e.length, Ew.None, null, t, n), Jw(t, n, Ew.None, null), t;
}
function Lw(e) {
	return Iw(e).map((e) => Vw(e) ? `${e.fold} ${Lw(e.text)}` : e.text).join("");
}
function Rw(e, t, n = {}) {
	let r = Iw(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && zw(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Hw(r, n));
}
function zw(e) {
	return e.styles === Ew.None && e.url === null && !Bw(e) && !Vw(e);
}
function Bw(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Vw(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Hw(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Uw(r, t));
	return n;
}
function Uw(e, t) {
	if (Bw(e)) return Gw(e.icon);
	let n = Vw(e) ? Ww(e, t) : document.createTextNode(e.text);
	if ((e.styles & Ew.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Ew.Strikethrough) !== 0 && (n = Kw("s", n)), (e.styles & Ew.Underline) !== 0 && (n = Kw("u", n)), (e.styles & Ew.Italic) !== 0 && (n = Kw("em", n)), (e.styles & Ew.Bold) !== 0 && (n = Kw("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", RC(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Ww(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Mw} ${Mw}--static` : Mw, r.className = Nw, r.textContent = e.fold ?? "", i.className = Pw, i.append(Hw(Iw(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Me, ""), n.append(r, i), n);
}
function Gw(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", xw(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Kw(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function qw(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Dw && c + 1 < n && aT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Yw(e, c, n);
		if (l !== null) {
			Jw(a, o, r, i), Xw(s, c + 1, l, o), Jw(a, o, r | Ew.Code, i), c = l + 1;
			continue;
		}
		let u = $w(e, c, n);
		if (u !== null) {
			Jw(a, o, r, i), qw(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Jw(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Zw(e, c, n);
		if (d !== null) {
			Jw(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? eT(e, c, n) : null;
		if (f !== null) {
			Jw(a, o, r, i), qw(e, f.labelStart, f.labelEnd, r, f.url, a, o), Jw(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = tT(e, c, n);
		if (p !== null) {
			Jw(a, o, r, i), a.push({
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
function Jw(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Yw(e, t, n) {
	let r = e.text;
	if (r[t] !== Ow) return null;
	let i = t + 1;
	if (i >= n || oT(r[i])) return null;
	let a = e.findClosingMarker(i, n, Ow, 1);
	return a > i ? a : null;
}
function Xw(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Dw && i + 1 < n && aT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Zw(e, t, n) {
	let r = e.text;
	if (r[t] !== kw || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Qw(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Qw(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function $w(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Ew.Bold, s = 2;
	else if (i === "*") o = Ew.Italic, s = 1;
	else if (i === "_" && a) o = Ew.Underline, s = 2;
	else if (i === "~" && a) o = Ew.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || oT(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function eT(e, t, n) {
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
function tT(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Aw || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Fw) return null;
	let c = { value: "" };
	return Xw(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var nT = class {
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
		return this.closeBrackets ??= this.next("]", !0), rT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), rT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), rT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return rT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = iT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !oT(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = FC(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Dw && e[t - 1] === 0);
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
			if (this.text[r] === Aw) n.push(r);
			else if (this.text[r] === jw && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || oT(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function rT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function iT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function aT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Aw || e === jw || e === Ow || e === Dw;
}
function oT(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var sT = "ui-tooltip", cT = "ui-tooltip", lT = "ui-tooltip--visible", uT = "[aria-haspopup][aria-expanded=\"true\"]", dT = "top", fT = 250, pT = 200, mT = 300, hT = 7, W = null, gT = null, _T = null, vT = null, yT = null, bT = 0, xT = null, ST = 0, CT = 0, wT = !1;
function TT(e = document) {
	if (wT) return;
	wT = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", ET, !0), t.addEventListener("pointerout", OT, !0), t.addEventListener("focusin", kT, !0), t.addEventListener("focusout", AT, !0), t.addEventListener("keydown", jT, !0), t.addEventListener("scroll", DT, !0), t.addEventListener("pointerdown", MT, !0), t.addEventListener("click", NT, !0), window.addEventListener("blur", () => {
		vT = null, YT(!0);
	});
}
function ET(e) {
	if (DT(), PT(e.target)) {
		window.clearTimeout(ST);
		return;
	}
	let t = FT(e.target);
	t !== null && t !== gT && IT(t);
}
function DT() {
	gT === null || gT.isConnected || (vT = null, YT(!0));
}
function OT(e) {
	if (vT !== null || yT !== null) return;
	let t = e.relatedTarget, n = gT ?? xT?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || PT(t)) || (PT(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && YT(!1);
}
function kT(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = FT(e.target);
	t !== null && (vT = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, LT(t));
}
function AT(e) {
	FT(e.target) === gT && (vT = null, YT(!0));
}
function jT(e) {
	e.key === "Escape" && gT !== null && (vT = null, YT(!0));
}
function MT(e) {
	if (PT(e.target)) return;
	let t = FT(e.target);
	if (t !== null && t.hasAttribute("data-ui-tooltip-press")) {
		if (yT === t) {
			YT(!0);
			return;
		}
		vT = null, YT(!0), LT(t), yT = gT;
		return;
	}
	vT === null && YT(!0);
}
function NT(e) {
	FT(e.target)?.hasAttribute("data-ui-tooltip-press") === !0 && e.preventDefault();
}
function PT(e) {
	return W !== null && e instanceof Node && W.contains(e);
}
function FT(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${we}], [${Ee}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${we}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function IT(e, t) {
	if (vT === null && yT === null) {
		if (window.clearTimeout(ST), xT !== null && xT.target === e) {
			xT.words = t;
			return;
		}
		if (window.clearTimeout(bT), xT = null, gT !== null) {
			YT(!0), LT(e, t);
			return;
		}
		if (Date.now() - CT < mT) {
			LT(e, t);
			return;
		}
		xT = {
			target: e,
			words: t
		}, bT = window.setTimeout(() => {
			let e = xT;
			xT = null, e !== null && LT(e.target, e.words);
		}, fT);
	}
}
function LT(e, t) {
	let n = (t ?? e.getAttribute("data-ui-tooltip") ?? "").trim();
	if (n.length === 0 || !e.isConnected || RT(e)) return;
	window.clearTimeout(bT), window.clearTimeout(ST), xT = null;
	let r = XT();
	Rw(r, n, { staticFolds: !0 }), r.classList.add(lT), gT = e, BT(zT(e)), r.setAttribute("data-ui-tooltip-text", Lw(n)), jo(e, r), Mo(e, r, {
		placement: JT(e),
		gap: hT,
		arrow: !0
	});
}
function RT(e) {
	return e.matches(uT) || e.querySelector(uT) !== null;
}
function zT(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function BT(e) {
	_T !== null && _T !== e && VT();
	let t = HT(e);
	t.includes(cT) || e.setAttribute("aria-describedby", [...t, cT].join(" ")), _T = e;
}
function VT() {
	if (_T === null) return;
	let e = HT(_T).filter((e) => e !== cT);
	e.length === 0 ? _T.removeAttribute("aria-describedby") : _T.setAttribute("aria-describedby", e.join(" ")), _T = null;
}
function HT(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function UT(e, t, n) {
	n?.delay === !0 && gT !== e ? IT(e, t) : LT(e, t);
}
function WT() {
	YT(!0);
}
var GT = {
	show: UT,
	hide: WT
};
function KT(e) {
	vT = e, LT(e);
}
function qT(e) {
	if (gT === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			vT = null, YT(!0);
			return;
		}
		LT(e);
	}
}
function JT(e) {
	let t = e.getAttribute(Te);
	return t !== null && xo(t) ? t : dT;
}
function YT(e) {
	window.clearTimeout(bT), window.clearTimeout(ST), xT = null;
	let t = () => {
		gT !== null && (VT(), gT = null, yT = null, W !== null && (W.classList.remove(lT), Lo(W)), CT = Date.now());
	};
	e ? t() : ST = window.setTimeout(t, pT);
}
function XT() {
	return W !== null && W.isConnected ? W : (W = document.createElement("div"), W.id = cT, W.className = sT, W.setAttribute("role", "tooltip"), W.setAttribute("aria-hidden", "true"), document.body.append(W), W);
}
//#endregion
//#region src/interactions/popup-service.ts
var ZT = /* @__PURE__ */ new WeakMap(), QT = new ws({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = ZT.get(e);
		ZT.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), $T = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => QT.popupOf(r) === t;
		return ZT.set(t, n.onDismiss), QT.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (ZT.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && QT.reposition(r);
			},
			close: () => {
				i() && QT.close(r);
			}
		};
	},
	focusReturn: (e) => ja(e)
};
//#endregion
//#region src/items/item-rows.ts
function eE(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: $d,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => $i(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var tE = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? iE(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), aE(l, n, t);
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
		let i = rE(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: S(r),
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
			nE(t, e) && this.applyBoundAttribute(r, String(b(t.bindingId)), e);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = b(t.bindingId);
			e.push([t, `[${Oe}${In(n.propertyName)}="${Fn(r)}"]`]);
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
		let r = lE(t, n.templateKeyPropertyName);
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
		r !== void 0 && Yd(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n) {
		let r = Number(t);
		if (!Number.isInteger(r) || r <= 0) return;
		let i = this.metadata.getBindingById(r), a = i === void 0 ? void 0 : this.metadata.getPropertyDefinition(i.propertyId);
		if (i === void 0 || a === void 0) return;
		let o = i.itemTemplate === null || i.itemTemplate === void 0 ? this.state.has(i, []) ? {
			ok: !0,
			value: this.state.get(i, [])
		} : { ok: !1 } : Jd(n, i.itemTemplate, i.itemTemplateParameters);
		if (!o.ok) {
			i.optional !== !0 && !this.unresolved.has(r) && (this.unresolved.add(r), s("item binding value could not be resolved; the item has no such property.", {
				binding: i,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = Qr(o.value ?? i.fallbackValue, () => this.metadata.isTranslatable(i) && !Xd(c)), u = b(i.componentId), d = e.closest(`[${m}="${u}"]`);
		if (d === null) {
			s("item binding component root was not found in the cloned template.", { binding: i });
			return;
		}
		for (let t of a.operations) {
			let n = zn(d, t, () => [e])[0] ?? null;
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
function nE(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = b(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function rE(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? ef(r, i.name) : af(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return of(r, i.key, n), e;
	let a = r;
	return a[tf(a, i.name)] = n, e;
}
function iE(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function aE(e, t, n) {
	e.setAttribute(h, t), cE(e, n), sE(e, n);
}
var oE = [
	["CanSelect", ue],
	["CanDrag", de],
	["CanRemove", fe],
	["CanRename", pe],
	["CanShowContextMenu", me]
];
function sE(e, t) {
	for (let [n, r] of oE) {
		let i = ef(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function cE(e, t) {
	let n = ef(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Ue, n.value) : e.removeAttribute(Ue);
}
function lE(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = ef(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var uE = "Group", dE = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = b(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), j(e.root, `[${Ge}="${Ke}"]`, { attributeFilter: [Fe] }, (e) => {
			for (let t of e) {
				let e = br(t);
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
			for (let [t, n] of e) t.isConnected && qb(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(b(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : rf(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${g}]`)) {
			if (bf(r) !== "virtualized") continue;
			let i = r.closest(v);
			i === null || !this.drawsPatchedComponent(i, b(e.reference.componentId), t) || !fE(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(S(i), t) && this.sync(r, S(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${S(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? S(e) === n.scopeComponentId : S(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		qb(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${h}="${Fn(t)}"]`)].filter((t) => this.isItemRoot(t) && mr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${g}]`), i = r === null ? null : br(r);
		if (r !== null && i !== null && bf(r) === "virtualized") {
			let a = e.getAttribute(h);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = pE(uE, t);
		a && cE(e, this.options.renderer.getItemValue(e)), oE.some(([e]) => pE(e, t)) && sE(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && pE(uE, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => pE(e.itemProperty, t)) || n.sorts.some((e) => pE(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${g}]`)) {
			let n = br(t);
			n === e && this.sync(t, n);
		}
	}
};
function fE(e, t) {
	let n = pr(e, fr(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function pE(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var mE = 50, hE = 1, gE = .5, _E = 60, vE = class {
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
			if (this.layout(t), CE(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = EE(e, et);
		if (t !== null && uC(e) && yE(e.getAttribute("data-ui-window-more-after"))) {
			gC(e, Math.max(0, this.windowBottom(e, t) - hC(e).height));
			return;
		}
		t !== null && t !== 0 && gC(e, yE(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = SE(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : xE(n[n.length - 1]).bottom - xE(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = EE(e, et), n = SE(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = hC(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		bf(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${g}][${qe}="windowed"]`)];
	}
	handleScroll(e) {
		let t = mC(e.target);
		if (t === null || bf(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, _E));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && CE(e) > 0) return;
		let n = SE(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = EE(e, et), i = yE(e.getAttribute(nt)), a = yE(e.getAttribute(rt));
		if (r !== null) {
			let o = this.windowSize(e), s = hC(e), c = Math.max(1, Math.round(s.height * hE / t.itemSize), Math.floor(o * gE)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, wE(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, wE(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = hC(e), s = Math.max(1, o.height * hE), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, wE(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, wE(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = EE(e, tt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = br(e);
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
				dynamicParameters: TE(e),
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
		let t = this.getState(e), n = SE(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			zb(e, "top", 0), zb(e, Rb, 0);
			return;
		}
		if (n.length > 0) {
			let e = xE(n[n.length - 1]).bottom - xE(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / bE(n))));
		}
		let r = EE(e, tt), i = EE(e, et), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		zb(e, "top", a), zb(e, Rb, o);
	}
	windowSize(e) {
		let t = EE(e, $e);
		return t !== null && t > 0 ? t : mE;
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
function yE(e) {
	return e !== null && e.toLowerCase() === "true";
}
function bE(e) {
	let t = xE(e[0]).top, n = 1;
	for (; n < e.length && xE(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function xE(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function SE(e) {
	return [...e.children].filter((e) => e.hasAttribute(h));
}
function CE(e) {
	return SE(e).length;
}
function wE(e) {
	return e.getAttribute(h);
}
function TE(e) {
	let t = e.closest(v);
	return t === null ? [] : pr(t, fr(t));
}
function EE(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var DE = [
	m,
	ce,
	le
];
function OE(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, kE(c, e.itemRole);
	let l = jE(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = AE(l, t, n, a);
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
		d.className = l.wrapperClassName, kE(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), aE(d, r, n), c.appendChild(d);
	}
	return aE(c, r, n), o.registerItemScope(c, l, n), c;
}
function kE(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function AE(e, t, n, r) {
	let i = lE(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function jE(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of DE) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), S(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function ME(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return NE(i.renderer.renderItem(e, t, n, r), a);
	let s = OE(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), NE(s, a);
}
function NE(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var PE = 6, FE = 60, IE = class {
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
	keysOf(e) {
		let t = this.states.get(e);
		return t === void 0 ? null : t.entries.map((e) => e.key);
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = uC(e) && fC(e);
		this.project(e, t), this.layout(e, t), n && !fC(e) && (gC(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Qa(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = N(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? sa(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = rE(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = cf(e), i = this.options.templates.getGroupTemplate(t.componentId), a = ff(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => uf(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => BE(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => mf(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = BE(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => mf(e.item, t.item, a))), e !== "" && l.push({
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
		let t = mC(e.target);
		if (t === null || bf(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, FE));
	}
	layout(e, t) {
		let n = t.projected, r = HE(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (VE(e) && a > 0) {
			let r = hC(e), c = RE(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - PE), s = Math.min(a, s + PE);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(BE(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), zE(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (zE(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of N(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${He}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = UE(i, 0, o), p = UE(i, s, a);
		Bb(e, [...l, ...Gd(Kd(e))]), zb(e, "top", f > 0 ? f - r : 0), zb(e, Rb, p > 0 ? p - r : 0), qd(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return ME(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(He, ""), r);
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(BE(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (LE(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(BE(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = xr(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of N(e)) {
			let e = t.getAttribute(h);
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
function LE(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function RE(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (gC(e, i + s), i + s);
}
function zE(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = BE(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function BE(e) {
	let t = ef(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function VE(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function HE(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function UE(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var WE = "data-ui-template", GE = "default", KE = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? GE, r = this.findTemplate(e, n);
		return r === void 0 ? n === GE ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${WE}]`);
		for (let e of r) if (e.getAttribute(WE) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= qE(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, ze);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Be);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function qE(e) {
	let t = /* @__PURE__ */ new Set();
	return Zr(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(v)) {
			let n = S(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/metadata/metadata-reader.ts
var JE = "script[type='application/json'][data-ui-metadata]";
function YE(e = document) {
	let t = e.querySelector(JE);
	if (t === null) return XE();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return XE();
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
function XE() {
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
var ZE = "script[type='application/json'][data-ui-hydration]";
function QE(e = document) {
	let t = e.querySelector(ZE)?.textContent?.trim() ?? "";
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
//#region src/transport/attach-retry.ts
var $E = "reconnecting";
async function eD(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), $E;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function tD(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var nD = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(rD(iD(e)));
	}
	async dispatchAsync(e) {
		let t = iD(e), n = rD(t);
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
function rD(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function iD(e) {
	return {
		eventId: b(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var aD = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Qa(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = oD(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(sD([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(oD(e, t));
		let n = this.unplaced.get(sD(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = oD(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(sD([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = sD(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, sD(t.slice(0, e - 1)));
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
		return `${b(e.componentId)}:${e.propertyId}:${cD(t)}`;
	}
};
function oD(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function sD(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function cD(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var lD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, uD = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, dD = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, fD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, pD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, mD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, hD = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, gD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, _D = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, vD = class {
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
var yD = class {
	constructor() {}
	log(e, t) {}
};
yD.instance = new yD();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var bD = "10.0.11", K = class {
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
function xD(e, t) {
	let n = "";
	return CD(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${SD(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function SD(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function CD(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function wD(e, t, n, r, i, a) {
	let o = {}, [s, c] = OD();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${xD(i, a.logMessageContent)}.`);
	let l = CD(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function TD(e) {
	return e === void 0 ? new DD(G.Information) : e === null ? yD.instance : e.log === void 0 ? new DD(e) : e;
}
var ED = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, DD = class {
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
function OD() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, kD(bD, AD(), MD(), jD())];
}
function kD(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function AD() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function jD() {
	if (q.isNode) return process.versions.node;
}
function MD() {
	return q.isNode ? "NodeJS" : "Browser";
}
function ND(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function PD() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var FD = class extends vD {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(PD());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new dD();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new dD();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new uD();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, CD(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new lD(await ID(i, "text") || i.statusText, i.status);
		let a = await ID(i, e.responseType);
		return new _D(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function ID(e, t) {
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
var LD = class extends vD {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new dD()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (CD(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new dD());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new _D(r.status, r.statusText, r.response || r.responseText)) : n(new lD(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new lD(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new uD());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, RD = class extends vD {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new FD(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new LD(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new dD()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, zD = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
zD.RecordSeparatorCode = 30, zD.RecordSeparator = String.fromCharCode(zD.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var BD = class {
	writeHandshakeRequest(e) {
		return zD.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (CD(e)) {
			let r = new Uint8Array(e), i = r.indexOf(zD.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(zD.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = zD.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var VD = class {
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
		return this.observers.push(e), new ED(this, e);
	}
}, HD = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			CD(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new UD(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, CD(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, UD = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, WD = 3e4, GD = 15e3, KD = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var qD = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? WD, this.keepAliveIntervalInMilliseconds = a ?? GD, this._statefulReconnectBufferSize = o ?? KD, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new BD(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new HD(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new dD("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new VD();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${ND(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${ND(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new dD("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${ND(t)}`);
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
}, JD = [
	0,
	2e3,
	1e4,
	3e4,
	null
], YD = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? JD : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, XD = class {};
XD.Authorization = "Authorization", XD.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var ZD = class extends vD {
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
		e.headers ||= {}, this._accessToken ? e.headers[XD.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[XD.Authorization] && delete e.headers[XD.Authorization];
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
var QD = class {
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
}, $D = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new QD(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = OD(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new lD(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${xD(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new lD(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof uD ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? wD(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = OD();
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
			i ? i instanceof lD && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, eO = class {
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
				let [r, i] = OD();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${xD(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? wD(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, tO = class {
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
				let t = {}, [r, i] = OD();
				t[r] = i, n && (t[XD.Authorization] = `Bearer ${n}`), o && (t[XD.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${xD(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${xD(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, nO = 100, rO = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = TD(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new ZD(n.httpClient || new RD(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new dD(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new dD(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new aO(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new dD("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < nO);
				if (r === nO && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof $D && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = OD();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new hD("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof lD && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new hD(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new mD(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new dD(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new gD(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new tO(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new eO(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new $D(this._httpClient, this._logger, this._options);
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
		if (iO(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new fD(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new pD(`'${X[i]}' is disabled by the client.`, i);
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
function iO(e, t) {
	return !e || (t & e) !== 0;
}
var aO = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new oO(), this._transportResult = new oO(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new oO(), this._transportResult.promise;
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
			this._sendBufferedData = new oO();
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
}, oO = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, sO = "json", cO = class {
	constructor() {
		this.name = sO, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = yD.instance);
		let n = zD.parse(e), r = [];
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
		return zD.write(JSON.stringify(e));
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
}, lO = {
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
function uO(e) {
	let t = lO[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var dO = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), fO(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = uO(e);
			this.logger = new DD(t);
		} else this.logger = new DD(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new YD(e) : e : new YD(), this;
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
		let t = new rO(this.url, e);
		return qD.create(t, this.logger || yD.instance, this.protocol || new cO(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function fO(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var pO = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, mO = class {
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
}, hO = class {
	apply;
	constructor(e) {
		this.apply = e;
	}
	pushed(e) {
		return (t) => queueMicrotask(() => e(t));
	}
	answered(e, t, n, r) {
		return e.then(async (e) => (await this.apply(t(e), r), n(e)));
	}
}, gO = 500;
function _O(e) {
	let { changes: t, ...n } = e;
	return n;
}
function vO() {
	return {};
}
var yO = class {
	windowId;
	connection;
	started = !1;
	gate = new mO();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new hO(t), this.connection = new dO().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
	get isReconnecting() {
		return this.connection.state === Y.Reconnecting;
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, _O));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, vO, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new pO(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, vO));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), gO);
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
}, bO = "/_ne/values", xO = 3e4;
function SO(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function CO(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function wO(e, t = xO) {
	if (e === void 0 || !CO(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${bO}/${encodeURIComponent(n)}`, {
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
async function TO(e) {
	let t = await fetch(bO, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(xO)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var EO = Promise.resolve(), DO = () => {}, OO = class {
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
		if (this.handed >= this.given) return EO;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = SO(e.value), r = n === null ? null : TO(n);
		return r?.catch(DO), new Promise((i, a) => {
			let o = kO(e), s = this.queue.findIndex((e) => e.field === o), c = [{
				resolve: i,
				reject: a
			}];
			s >= 0 && (c = [...this.queue[s].settles, ...c], this.queue.splice(s, 1)), this.queue.push({
				field: o,
				update: e,
				body: n,
				staged: r,
				before: t,
				settles: c
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, AO(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof pO) {
				this.requeue(r);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	requeue(e) {
		let t = [];
		for (let n of e) {
			let e = this.queue.findIndex((e) => e.field === n.field);
			if (e >= 0) {
				let t = this.queue[e];
				this.queue[e] = {
					...t,
					settles: [...n.settles, ...t.settles]
				};
				continue;
			}
			t.push({
				...n,
				staged: this.restage(n.body)
			});
		}
		t.length !== 0 && (this.queue.unshift(...t), this.given++);
	}
	restage(e) {
		if (e === null) return null;
		let t = this.transport.whenAttached().then(() => TO(e));
		return t.catch(DO), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function kO(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function AO(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var jO = document;
function MO() {
	try {
		return jO.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/navigation-url.ts
function NO(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = PO(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function PO(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, FO(e));
	return t.toString();
}
function FO(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/effect-registry.ts
var IO = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(tr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = tr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = NO(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!zC(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = ar(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== n && document.documentElement.setAttribute(nn, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = RO(e);
			t !== null && HO(t);
		}), this.register("ScrollTo", (e) => {
			let t = RO(e);
			if (t === null) return;
			let n = e.effect, r = nr(n.behavior), i = rr(n.block);
			t.scrollIntoView({
				behavior: zO(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = RO(e);
			if (t === null) return;
			let n = e.effect, r = or(n.axis) !== "Horizontal", i = BO(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ir(n.position), u;
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
			let d = zO(nr(n.behavior));
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			LO(RO(e), null);
		}), this.register("Hide", (e) => {
			LO(RO(e), "hidden");
		}), this.register("Collapse", (e) => {
			LO(RO(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = UO(e, this.valueReaders);
			t !== null && WO(t).catch((e) => s("copy to clipboard failed.", e));
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
			if (!FC(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Mr(t.message) && !Nr(t.message)) {
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
function LO(e, t) {
	if (e !== null) for (let n of _n) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function RO(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(b(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function zO(e) {
	return e === "Smooth" && !vo() ? "smooth" : "auto";
}
function BO(e, t) {
	if (VO(e, t)) return e;
	for (let n of e.querySelectorAll("*")) if (VO(n, t)) return n;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if (VO(n, t)) return n;
	return null;
}
function VO(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n !== "auto" && n !== "scroll" ? !1 : t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
function HO(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ca))) {
		e.focus();
		return;
	}
	let t = xa(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function UO(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = RO(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : di(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : ai(t.readHeld(r));
}
async function WO(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!GO(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function GO(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return MO();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var KO = "data-ui-dialog-close-backdrop", qO = "data-ui-dialog-close-escape", JO = "data-ui-dialog-backdrop", YO = class {
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
		let n = ka(t.querySelector(".ui-dialog__surface") ?? t, xa(t));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Pa(ja(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${as}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${JO}]`);
		if (n === null) return;
		let r = n.closest(`[${as}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(KO)) return;
		let i = r.getAttribute(as);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(qO) && !vs() && !us(e.target) && !Gc(e.target)) {
				let n = t.getAttribute(as);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(v)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return os(this.root);
	}
	trapTab(e, t) {
		let n = Sa(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Ta(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, XO = /* @__PURE__ */ new Map([
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
]), ZO = [
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
function QO(e) {
	return Q(e, ZO);
}
var $O = [
	"small",
	"medium",
	"large"
], ek = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], tk = [
	"start",
	"center",
	"end",
	"justify"
], nk = ["nowrap", "wrap"], rk = /* @__PURE__ */ new Map([
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
]), ik = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), ak = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), ok = ["inline", "trailing"], sk = [
	"filled",
	"outline",
	"underline",
	"ghost"
], ck = [
	"small",
	"medium",
	"large"
], lk = [
	"small",
	"medium",
	"large"
], uk = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], dk = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], fk = ["light", "dark"], pk = [
	"start",
	"center",
	"end",
	"stretch"
], mk = ["clip", "visible"], hk = [
	"visible",
	"hidden",
	"collapsed"
], gk = [
	"background",
	"raised",
	"tinted"
], _k = ["horizontal", "vertical"], vk = [
	"none",
	"gap",
	"rule"
], yk = [
	"none",
	"one",
	"many"
], bk = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], xk = ["stack", "wrap"], Sk = ["end", "start"], Ck = [
	"disabled",
	"auto",
	"always"
], wk = [
	"disabled",
	"proximity",
	"mandatory"
], Tk = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Ek = ["hex", "rgb"], Dk = ["field", "swatch"], Ok = [
	"fill",
	"contain",
	"cover",
	"none"
], kk = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Ak = ["linear", "circular"], jk = ["keep", "replace"], Mk = [
	"none",
	"vertical",
	"horizontal",
	"both"
], Nk = [
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
], Pk = [
	"None",
	"Shade",
	"Tint"
], Fk = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, ZO)}`],
	["themeColorClass", (e) => oA(e)],
	["iconClass", (e) => ww(e)],
	["iconUrlCss", (e) => _w(e)],
	["safeUrl", (e) => IC(e)],
	["safeImageSource", (e) => WC(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : Lw(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, $O)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, ek)}`],
	["textAppearanceClass", (e) => hA(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, tk)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, nk)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, ok)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, dk)}`],
	["badgeTextFit", (e) => sA(e)],
	["buttonClass", (e) => `ui-button--${Q(e, uk)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, gk)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, _k)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, vk)}`],
	["selectionModeAttribute", (e) => Q(e, yk)],
	["selectionBackgroundCss", (e) => eA(Zk(e, "background"))],
	["selectionForegroundCss", (e) => eA(Zk(e, "foreground"))],
	["selectionMarkColorCss", (e) => eA(Zk(e, "markColor"))],
	["selectionMarkCss", (e) => $k(Zk(e, "mark"))],
	["selectionFontWeightCss", (e) => Qk(Zk(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, xk)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, Sk)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, Ck)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, Ck)}`],
	["hostViewport", (e) => Uk(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, wk)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, sk)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, lk)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, ck)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, ck)}`],
	["textInputTypeAttribute", (e) => Q(e, Tk)],
	["colorTextFormatAttribute", (e) => Q(e, Ek)],
	["colorInputVariantAttribute", (e) => Q(e, Dk)],
	["themeNameCss", (e) => Q(e, fk)],
	["alignmentCss", (e) => Q(e, pk)],
	["alignmentStretchFallbackCss", (e) => Q(e, pk) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, mk)],
	["layoutLengthCss", (e) => Wk(e)],
	["thicknessCss", (e) => Gk(e)],
	["borderNoneClass", (e) => Kk(e)],
	["radiusCss", (e) => qk(e)],
	["gridUnitCss", (e) => Jk(e)],
	["pixelsCss", (e) => TA(e)],
	["gridTemplateCss", (e) => Yk(e)],
	["colorVariantCss", (e) => yA(e)],
	["themeColorCss", (e) => eA(e)],
	["themeInkCss", (e) => nA(e)],
	["themeOnColorCss", (e) => iA(e)],
	["themeColorInlineCss", (e) => tA(e) ? "" : eA(e)],
	["themeColorCanonical", (e) => _A(e)],
	["textAppearanceFontSizeCss", (e) => gA(e, "size")],
	["textAppearanceFontWeightCss", (e) => gA(e, "weight")],
	["textAppearanceLineHeightCss", (e) => gA(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => gA(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => Wk(B(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => Wk(B(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => Wk(B(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => Wk(B(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => Wk(B(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => Gk(B(e, "base"))],
	["responsiveThicknessSmCss", (e) => Gk(B(e, "sm"))],
	["responsiveThicknessMdCss", (e) => Gk(B(e, "md"))],
	["responsiveThicknessXlCss", (e) => Gk(B(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => Gk(B(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => EA(B(e, "base"))],
	["responsivePixelsSmCss", (e) => EA(B(e, "sm"))],
	["responsivePixelsMdCss", (e) => EA(B(e, "md"))],
	["responsivePixelsXlCss", (e) => EA(B(e, "xl"))],
	["responsivePixelsXxlCss", (e) => EA(B(e, "xxl"))],
	["visibilityBaseAttribute", (e) => DA(e, "base")],
	["visibilitySmAttribute", (e) => DA(e, "sm")],
	["visibilityMdAttribute", (e) => DA(e, "md")],
	["visibilityXlAttribute", (e) => DA(e, "xl")],
	["visibilityXxlAttribute", (e) => DA(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, Ok)}`],
	["backgroundImageCss", (e) => Rk(e)],
	["imageFitSizeCss", (e) => Q(e, kk)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, Ak)}`],
	["progressValueText", (e) => wA(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, jk)}`],
	["textAreaResizeCss", (e) => Q(e, Mk)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, Nk)}`],
	["popupPlacementAttribute", (e) => Q(e, Nk)],
	["tabMenuEntriesAttribute", (e) => Lk(e)]
]), Ik = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function Lk(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = Ik.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function Rk(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : vw(t);
}
var zk = [
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
], Bk = new Map(zk.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), Vk = new Map(zk.map(([e, t]) => [e, t])), Hk = /* @__PURE__ */ new Map([[mk, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : Hk.get(t)?.get(e)) ?? XO.get(e) ?? In(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function Uk(e) {
	return e == null || Q(e, Ck) === "disabled" ? void 0 : "parent";
}
function Wk(e) {
	if (e == null) return "";
	if (typeof e == "number") return TA(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? TA(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function Gk(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function Kk(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function qk(e) {
	if (e == null) return "";
	if (typeof e == "number") return TA(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? TA(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function Jk(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return TA(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function Yk(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return Jk(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return Jk(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${Jk(e[0])})` : e.map((e) => Jk(e)).join(" ");
}
function $(e, t, n) {
	return Xk(B(e, t), n);
}
function Xk(e, t) {
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
function Zk(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function Qk(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function $k(e) {
	if (e == null) return "";
	switch (Q(e, bk)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function eA(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (vA(e)) return yA(e);
	let t = e, n = yA(t.light), r = yA(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = rk.get(Q(o, ZO));
	return s ? `var(${s})` : "";
}
function tA(e) {
	if (typeof e != "object" || !e || vA(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function nA(e) {
	if (tA(e)) {
		let t = ik.get(Q(e.style, ZO));
		if (t !== void 0) return `var(${t})`;
	}
	return eA(e);
}
var rA = /* @__PURE__ */ new Set(["background", "surface"]);
function iA(e) {
	if (typeof e != "object" || !e) return "";
	if (vA(e)) return aA(e);
	let t = e, n = aA(t.light ?? t.dark), r = aA(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, ZO);
	if (rA.has(i)) return "initial";
	let a = ak.get(i);
	return a ? `var(${a})` : "";
}
function aA(e) {
	let t = bA(e);
	return t === void 0 ? "" : oy(t[0], t[1], t[2], t[3]);
}
function oA(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, ZO)}`;
}
function sA(e) {
	let t = dA(e == null ? "" : String(e).trim(), cA + 1);
	return t > 0 && t <= cA ? "compact" : "";
}
var cA = 2, lA = /[\u0300-\uFFFF]/, uA = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function dA(e, t) {
	if (!lA.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of uA.segment(e)) {
		if (n >= t) break;
		n += fA(r) ? 2 : 1;
	}
	return n;
}
function fA(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < pA.length; e += 2) if (t >= pA[e] && t <= pA[e + 1]) return !0;
	return !1;
}
var pA = [
	4352,
	4447,
	8986,
	8987,
	9001,
	9002,
	9193,
	9196,
	9200,
	9200,
	9203,
	9203,
	9725,
	9726,
	9748,
	9749,
	9800,
	9811,
	9855,
	9855,
	9875,
	9875,
	9889,
	9889,
	9898,
	9899,
	9917,
	9918,
	9924,
	9925,
	9934,
	9934,
	9940,
	9940,
	9962,
	9962,
	9970,
	9971,
	9973,
	9973,
	9978,
	9978,
	9981,
	9981,
	9989,
	9989,
	9994,
	9995,
	10024,
	10024,
	10060,
	10060,
	10062,
	10062,
	10067,
	10069,
	10071,
	10071,
	10133,
	10135,
	10160,
	10160,
	10175,
	10175,
	11035,
	11036,
	11088,
	11088,
	11093,
	11093,
	11904,
	12350,
	12353,
	13311,
	13312,
	19903,
	19968,
	40959,
	40960,
	42191,
	43360,
	43391,
	44032,
	55203,
	63744,
	64255,
	65040,
	65049,
	65072,
	65135,
	65280,
	65376,
	65504,
	65510,
	110592,
	111359,
	126980,
	126980,
	127183,
	127183,
	127374,
	127374,
	127377,
	127386,
	127462,
	127490,
	127504,
	127547,
	127552,
	127560,
	127568,
	127569,
	127584,
	127589,
	127744,
	128591,
	128640,
	128767,
	128992,
	129003,
	129292,
	129535,
	129648,
	129791,
	131072,
	196605,
	196608,
	262141
];
function mA(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", sA(n));
}
function hA(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, ek)}`;
}
function gA(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return TA(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : TA(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : TA(e);
		}
		default: return "";
	}
}
function _A(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = xA(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${ay(r.rgb >> 16 & 255)}${ay(r.rgb >> 8 & 255)}${ay(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${ay(e)}`;
	}
	let i = SA(r.name);
	return i === null ? "" : `${i}/${CA(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function vA(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function yA(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = bA(e);
	return t === void 0 ? "" : `#${ay(t[0])}${ay(t[1])}${ay(t[2])}${ay(t[3])}`;
}
function bA(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = SA(t.name), i = n ?? (r === null ? void 0 : Bk.get(r));
	if (!i) return;
	let a = CA(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = V(c * (1 - o)), l = V(l * (1 - o)), u = V(u * (1 - o))) : a === "Tint" && (c = V(c + (255 - c) * o), l = V(l + (255 - l) * o), u = V(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function xA(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = ZO[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function SA(e) {
	if (typeof e == "number") return Vk.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function CA(e) {
	if (typeof e == "number") return Pk[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function wA(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function TA(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function EA(e) {
	return e == null ? "" : TA(e);
}
function DA(e, t) {
	let n = t_(e, t);
	if (n == null) return;
	let r = Q(n, hk);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var OA = "ui-notification-host", kA = "ui-notification", AA = "ui-notification--leaving", jA = "ui-notification__message", MA = "ui-notification__action", NA = "ui-notification__close", PA = 5e3, FA = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), IA = class {
	root;
	durationMs;
	host = null;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? PA, this.ensureHost();
	}
	show(e) {
		let t = QO(e.severity), n = document.createElement("div");
		n.className = FA.has(t) ? `${kA} ${kA}--${t}` : kA, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = jA, typeof e.message == "string" ? r.textContent = e.message : C.writeValue(r, null, e.message), n.append(r), e.action !== void 0 && n.append(RA(e.action));
		let i = document.createElement("button");
		if (i.type = "button", i.className = NA, i.setAttribute("aria-label", C.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), this.ensureHost().append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
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
		if (!(!e.isConnected || e.classList.contains(AA))) {
			if (e.classList.add(AA), this.returnFocus(e), vo() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => LA(e), _o.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(AA));
		Pa(ja(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${NA}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${OA}`), n = t ?? document.createElement("div");
		return n.classList.add(OA), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function LA(e) {
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
		duration: _o.fast,
		easing: _o.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function RA(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${MA} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var zA = class {
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
		!this.state.set(e, t, n, VA(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Qr(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Ae), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, VA(r[0]?.component)) ? {
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
			(typeof t == "string" ? this.addressResolver.isTranslatable(e.reference) : Mr(t)) && this.applyPropertyValue(e.reference, e.dynamicParameters, t, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${ke}${In(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of zn(e, t, () => BA(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ae))), r = e.closest(v);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ae)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			hi(e);
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
function BA(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(v) === e) return [n];
	return [e];
}
function VA(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(v) ?? null, r = e === null ? 0 : S(e), i = n.getAttribute(h);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: pr(e, fr(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var HA = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Ia) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = b(e.componentId), r = UA(n, e.propertyId), i = this.watchers.get(r);
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
		let n = br(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = UA(b(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function UA(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function WA(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : S(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var GA = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, KA(t));
	}
	apply(e) {
		let t = b(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Qn(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) qA(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) JA(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) YA(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) XA(n, t.key, t.newIndex);
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
function KA(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function qA(e, t) {
	typeof t.key == "string" && (JA(e, t.key), e.splice(ZA(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function JA(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function YA(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		qA(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function XA(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(ZA(n, e.length), 0, i);
}
function ZA(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/updates/collection-sinks.ts
var QA = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function $A(e, t, n, r) {
	return {
		action: Qn(e.action),
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
var ej = class {
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
	held = new GA();
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${g}]`)) {
			let e = br(n);
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
			return n === void 0 && (n = sj(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = xr(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(t.componentId, n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (er(t) !== "CollectionChange") continue;
			let e = t;
			if (Qn(e.action) !== "Insert") continue;
			let r = b(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, oj(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of WA(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = br(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		qb(e, t, {
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
				let r = ij(n, t[e + 1]);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Pe) === !0;
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
		if (bf(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = sj(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && Qa(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), aj(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (er(e)) {
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
		let t = b(e.address?.component?.id), n = $n(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (b(e.address?.component?.id) <= 0) {
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
		let t = b(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, $A(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Qn(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of o) a && this.held.isWaiting(n) || this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (bf(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (Qn(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				tj(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				rj(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Of(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (Qn(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Qn(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${g}]`)) if (br(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Sf(e, N(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, wf(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return ME(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = N(e), a = Sf(e, i), o = sj(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, wf(a, l, i.index ?? null)) : (Df(a, c, l), c.replaceWith(l)));
		}
	}
};
function tj(e, t) {
	let n = N(e), r = Sf(e, n), i = sj(e, n), a = nj(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? sa(a, o, n) : null;
		i.delete(t), Tf(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function nj(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function rj(e, t) {
	let n = N(e), r = Sf(e, n), i = sj(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, Ef(r, t, n.newIndex ?? null));
	}
}
function ij(e, t) {
	if (t === void 0 || er(e) !== "CollectionChange" || er(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (Qn(n.action) !== "Reset" || Qn(r.action) !== "Insert") return null;
	let i = b(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== b(r.component?.id) || !Qa(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function aj(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? N(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function oj(e) {
	let t = S(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : S(n);
}
function sj(e, t = N(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(h);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function cj(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Mr(n) || Nr(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: uj(t.severity)
	} : void 0;
}
function lj(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = C.resolve(Mr(t) || Nr(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function uj(e) {
	let t = Yn(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var dj = "ui-validation--warning", fj = "ui-validation--info", pj = "data-ui-validation-message", mj = "ui-validation-message--marker", hj = "top-end", gj = "--ui-validation-marker-host", _j = "ui-validation-mark", vj = "--ui-validation-presentation", yj = "--ui-validation-color", bj = "Validation", xj = `input:not([type='hidden']), textarea, select, .${On}[role='combobox'], [role='spinbutton']`, Sj = {
	Error: 0,
	Warning: 1,
	Info: 2
}, Cj = {
	Error: Nn,
	Warning: dj,
	Info: fj
}, wj = `.${Nn}, .${dj}, .${fj}`, Tj = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, Ej = {
	Error: `${_j}--error`,
	Warning: `${_j}--warning`,
	Info: `${_j}--info`
}, Dj = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, Oj = class {
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
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(wj)), j(this.root, wj, { childList: !0 }, (e) => this.applyRenderedMessages(e)), C.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(wj)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			jj(t, kj(t) === "Error");
			let e = t.querySelector(`:scope > [${pj}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && Mj(this.markerMirrors, t, e, {
				message: n,
				severity: kj(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === bj) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = b(e.reference.componentId), n = cj(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = b(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Jn(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = b(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) typeof r != "string" || r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: uj(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: Dj[t]
		}), this.applyCurrentState(S(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		Aj(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${b(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(lj).join("\n"), !0);
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
			severity: uj(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || Sj[e.severity] < Sj[s.severity]) && (s = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Jn(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${at}="${Fn(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Jn(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && uj(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) oo(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function kj(e) {
	return e.classList.contains(dj) ? "Warning" : e.classList.contains(fj) ? "Info" : "Error";
}
function Aj(e, t, n) {
	for (let e of Object.values(Cj)) t.classList.toggle(e, n !== void 0 && Cj[n.severity] === e);
	jj(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(yj) : r.style.setProperty(yj, `var(--ui-color-${Tj[n.severity]})`);
	let i = t.querySelector(`[${pj}]`);
	i !== null && (n?.content === !0 ? (qr(i, null), i.textContent = String(n.message ?? "")) : C.writeValue(i, null, n?.message ?? null), Mj(e, r, i, n));
}
function jj(e, t) {
	for (let n of e.querySelectorAll(xj)) {
		let r = n.closest(Dn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function Mj(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(vj).trim() === "marker";
	if (n.classList.toggle(mj, a), r !== void 0 && a) {
		n.setAttribute(we, n.textContent ?? ""), n.setAttribute(Te, hj), t.setAttribute(Ee, ""), Nj(e, t, r, n.textContent ?? "", i.getPropertyValue(gj).trim()), t.contains(document.activeElement) ? KT(n) : qT(n);
		return;
	}
	n.removeAttribute(we), n.removeAttribute(Te), t.removeAttribute(Ee), Nj(e, t, void 0, "", ""), qT(n);
}
function Nj(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : Pj(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${_j} ${Ej[n.severity]}`, s.textContent = r, s.setAttribute(we, r), s.setAttribute(Te, hj), s.parentElement !== o && o.append(s), e.set(t, s), qT(s);
}
function Pj(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var Fj = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, Ij = "tooltip-name";
function Lj(e, t, n) {
	let r = Lw(e.getAttribute(we));
	if (qr(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var Rj = /* @__PURE__ */ new WeakMap(), zj = /* @__PURE__ */ new Map([["iconClass", Cw]]), Bj = /* @__PURE__ */ new WeakMap(), Vj = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Xn(e), t);
	}
	apply(e) {
		let t = Xn(e.operation.kind), n = this.handlers.get(t);
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
			let t = ai(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), qr(e.target, null);
		}), this.register("Markup", (e) => {
			Rw(e.target, oi(e.convertedValue) ? "" : ai(e.convertedValue)), qr(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = Jj(e.operation);
			if (qr(e.target, t), oi(e.value) || oi(e.convertedValue)) {
				qj(e.target, t);
				return;
			}
			Kj(e.target, t, ai(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = Jj(e.operation);
			qr(e.target, t), qj(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = Jj(e.operation), n = !oi(e.value) && Hj(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (oi(e.convertedValue) ? "" : ai(e.convertedValue));
			Uj(e.target, Gj(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !oi(e.value) && Hj(e.value, e.operation.condition ?? "None") ? ai(e.convertedValue).trim() : "";
			Wj(e.target, Gj(e), t, zj.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = Jj(e.operation), n = !oi(e.value) && Hj(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? ai(e.convertedValue).trim() : "";
				Wj(e.target, Gj(e), t);
			}
		}), this.register("Style", (e) => {
			let t = Jj(e.operation), n = e.target;
			if (oi(e.value) || oi(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = ai(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(Ij, (e) => Lj(e.resolved.component, e.target, Jj(e.operation))), this.register("Property", (e) => {
			let t = Jj(e.operation), n = e.target, r = oi(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function Hj(e, t) {
	switch (Zn(t)) {
		case "None": return !0;
		case "HasValue": return !oi(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !oi(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return ww(e).length > 0;
		default: return !oi(e);
	}
}
function Uj(e, t, n, r, i) {
	let a = Bj.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), Bj.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), Kj(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && qj(e, n);
}
function Wj(e, t, n, r) {
	let i = Rj.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), Rj.set(e, i));
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
function Gj(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function Kj(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function qj(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function Jj(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var Yj = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Fk.has(e.name),
			convert: (e) => Fk.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = Xj(e.name), n = {
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
function Xj(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var Zj = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = x(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = x(e.domEventName) || t;
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
		return this.definitions.get(x(e));
	}
};
function Qj(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function $j(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => Qj(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => Qj(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var eM = class {
	converters = new Yj();
	events = new Zj();
	operations = new Vj();
	valueReaders;
	collectionSinks = new QA();
	rowDecorators = new Fj();
	constructor(e, t, n, r) {
		$j(this.events), this.valueReaders = new ci(r);
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
}, tM = "Submenu", nM = "ui-menu__submenu", rM = "Select", iM = {
	kind: "menu",
	decorate: aM
};
function aM(e) {
	if (!oM(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, tM);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(ct, ""), sM(e.item, "Kind") === rM && e.row.setAttribute(lt, ""), sM(e.item, "Expanded") === !0 && e.row.setAttribute(ut, "");
	let r = document.createElement("div");
	r.className = nM, r.appendChild(n), aE(r, e.key, e.item), e.row.appendChild(r);
}
function oM(e) {
	let t = sM(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function sM(e, t) {
	let n = ef(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var cM = {
	kind: "grip",
	decorate: lM
};
function lM(e) {
	e.row.append(uM());
}
function uM() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), C.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function dM(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(pM(n));
	for (let t of e.querySelectorAll(`[${Le}]`)) fM(t, Ie, r), fM(t, Re, i);
}
function fM(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function pM(e) {
	return {
		monthNames: e.monthNames,
		monthGenitiveNames: e.monthGenitiveNames,
		abbreviatedMonthNames: e.abbreviatedMonthNames,
		dayNames: e.dayNames,
		abbreviatedDayNames: e.abbreviatedDayNames,
		amDesignator: e.amDesignator,
		pmDesignator: e.pmDesignator
	};
}
//#endregion
//#region src/runtime/engine-start.ts
var mM = 2;
function hM(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= mM && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function gM(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var _M = "ne.standard.ui.windowId", vM = [
	500,
	1e3,
	2e3
], yM = 3, bM = [
	["refusal", ({ root: e }) => $C(e)],
	["file input", ({ root: e }) => new _c({ root: e })],
	["image input", ({ root: e }) => new Mc({ root: e })],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new Wc({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new rl({ root: e })],
	["field box press", ({ root: e }) => new el({ root: e })],
	["image fallback", ({ root: e }) => new cl({ root: e })],
	["radio group sync", ({ root: e }) => new vl({ root: e })],
	["select interaction", ({ root: e }) => new Eu({ root: e })],
	["search input", ({ root: e }) => new Vl({ root: e })],
	["debounced commit", ({ root: e }) => new Fu({ root: e })],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => Ru() ? void 0 : new zu({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new Xb({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Zu({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new Iy({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new Hm({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new Oh({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new Bh({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new CS({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new aC({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new Yh({ root: e })],
	["split button", ({ root: e }) => new iv({ root: e })],
	["toggle button", ({ root: e }) => new Jc({ root: e })],
	["button group", ({ root: e }) => new uv({ root: e })],
	["menu", ({ root: e }) => new mg({ root: e })],
	["collapsible", ({ root: e }) => new u_({ root: e })],
	["menu group", ({ root: e }) => new Mg({ root: e })],
	["menu search", ({ root: e }) => new Ug({ root: e })],
	["side drawer", ({ root: e }) => new i_({ root: e })],
	["grid splitter", ({ root: e }) => new U_({ root: e })],
	["accordion", ({ root: e }) => new mv({ root: e })],
	["tabs", ({ root: e }) => new Fv({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new eS({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new Wv({ root: e })],
	["breadcrumbs", ({ root: e }) => new ry({ root: e })],
	["scroll anchor", ({ root: e }) => new lC({ root: e })],
	["scroll group", ({ root: e }) => new CC({ root: e })],
	["flyout interaction", ({ root: e }) => new Us({ root: e })],
	["text fold", ({ root: e }) => new mS({ root: e })],
	["tooltip", ({ root: e }) => TT(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new NC({ root: e }) : void 0]
], xM = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Vn(YE());
	hydration = QE();
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
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = TM(e.windowIdStorageKey ?? _M), this.dom = new yr(this.root), C.load(this.root), C.setLanguage(document.documentElement.lang), e.strings !== void 0 && C.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : C.loadTableAsync(this.hydration.words.href)), this.extensions = new eM(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(iM), this.extensions.registerRowDecorator(cM);
		let t = new dr(this.dom, this.metadata), n = this.extensions.operations, r = new aD(), i = new zA(t, n, this.extensions, r);
		this.reactiveSources = new HA(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new YO({ root: this.root }), this.notifications = new IA({ root: this.root }), this.effects = new IO({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new uo(this.metadata), o, u = new to(a, i, new ao(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(b(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new KE(this.dom), f = new tE(this.metadata, d, this.extensions, n, r);
		this.virtualization = new IE({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new ej(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), C.onChange(() => this.rewriteWords(i, f)), new dE({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new yO(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new nD(this.transport), C.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Bn.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		});
		let p = new OO(this.transport);
		o = new Va({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(Bn.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new Oj({
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
		for (let [e, t] of bM) hM(e, t, this.engineContext);
		hM("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new zd({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), hM("tree", ({ root: e, effects: t }) => new yx({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), hM("items reorder", ({ root: e }) => new Lf({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), this.eventPipeline = new Ja({
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
		this.eventPipeline.addEvent(Qx.name, Qx.registration), this.eventPipeline.addEvent(If.name, If.registration), this.tables = new Db({ root: this.root }), this.windows = new vE({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: C,
			observeComponents: j,
			observeSize: tb,
			dialogs: this.dialogs,
			store: new xg(),
			numbers: yd,
			temporal: bp,
			icons: { apply: xw },
			badges: { writeCount: mA },
			urls: {
				isImageSource: HC,
				asBrowserReads: VC
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(v), a = r === null ? void 0 : this.metadata.getExposedProperty(S(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: GT,
			renames: { open: ds },
			tables: this.tables,
			rows: eE(d, f, this.virtualization),
			uploads: lc,
			selection: Ji,
			popups: $T,
			roving: Ci,
			states: ii,
			validation: ee,
			wheel: Em,
			names: Pn
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
	readPluginValue(e) {
		let t = di(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
	}
	async switchLanguageAsync(e, t) {
		if (e === C.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		C.setRequested(e);
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
			if (n !== this.languageSwitches || i === C.language || !await C.switchToAsync(i, r)) return;
			C.notifyChanged();
		} finally {
			n === this.languageSwitches && C.setRequested(null);
		}
	}
	rewriteWords(e, t) {
		let n = performance.now();
		this.dom.invalidate(), C.language !== this.culturesLanguage && (this.culturesLanguage = C.language, Zr(this.root, (e) => dM(e, C.number, C.temporal))), C.rewriteMarks(this.root), this.rewriteStaticWords(e), e.rewriteWords(), t.rewriteRowWords(this.root);
		let r = this.hydration?.title ?? null;
		if (r !== null) {
			let e = String(C.resolve(r, !0));
			document.title !== e && (document.title = e);
		}
		C.language.length > 0 && document.documentElement.lang !== C.language && (document.documentElement.lang = C.language), d("page's words written again", n, { language: C.language });
	}
	rewriteStaticWords(e) {
		let t = this.metadata.getWords();
		if (t.length === 0) return;
		let n = [];
		Zr(this.root, (e) => {
			e !== this.root && n.push(e);
		});
		for (let r of t) {
			let t = b(r.componentId), i = {
				componentId: t,
				propertyId: r.propertyId
			}, a = r.dynamicParameters ?? [];
			for (let n of this.findWordInstances(t, a)) e.rewriteStatic(n, i, r.key);
			for (let o of n) for (let n of o.querySelectorAll(`[${m}="${Fn(t)}"]`)) hr(n, a) && e.rewriteStatic(n, i, r.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => hr(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: C.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: C.text("ui.connection.reload"),
				run: () => window.location.reload()
			}
		});
	}
	reloadForView(e) {
		if (AM() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), jM(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await wM();
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
		for (let t of e) hM(gM(t), t, this.pluginContext);
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
		C.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		hM(gM(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !CO(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), wO(e))).then((e) => this.applyNow(e)).catch((e) => {
			c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = n, n.then(() => {
			this.inbound === n && (this.inbound = null);
		}), n;
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
			if (e >= yM) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (MM(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(CO(e) ? await wO(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = DM(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? OM(window.location.search) : e.parameters,
			timeZone: tD()
		};
		return await eD(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, vM, CM);
	}
};
async function SM(e = {}) {
	let t = performance.now(), n = new xM(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function CM(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function wM() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function TM(e) {
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
	let n = EM();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function EM() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function DM() {
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
function OM(e) {
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
var kM = "ne-standard-ui:reloaded-view";
function AM() {
	try {
		return sessionStorage.getItem(kM);
	} catch {
		return null;
	}
}
function jM(e) {
	try {
		sessionStorage.setItem(kM, e);
	} catch {}
}
function MM() {
	try {
		sessionStorage.removeItem(kM);
	} catch {}
}
re(), SM().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
