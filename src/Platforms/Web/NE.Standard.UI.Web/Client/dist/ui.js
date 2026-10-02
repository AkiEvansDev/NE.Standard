//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), t = "NE.Standard.UI", n = "ne.ui:log", r = {
	debug: 0,
	warn: 1,
	error: 2,
	silent: 3
}, i = m();
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
	r[i] <= r.warn && ee(console.warn, e, t);
}
function c(e, t) {
	r[i] <= r.error && ee(console.error, e, t);
}
function l(e, t) {
	r[i] <= r.debug && ee(console.debug, e, t);
}
function u() {
	return r[i] <= r.debug;
}
function d(e, t, n) {
	r[i] <= r.debug && ee(console.debug, `${e} in ${f(performance.now() - t)}.`, n);
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
function m() {
	try {
		let e = localStorage.getItem(n);
		if (e !== null && e in r) return e;
	} catch {}
	return "warn";
}
function ee(e, n, r) {
	r === void 0 ? e(`${t} ${n}`) : e(`${t} ${n}`, r);
}
//#endregion
//#region src/runtime/global-api.ts
var te = 2;
function ne() {
	return ie();
}
function re(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ie();
	n.runtime = e, ae(e, n);
}
function ie() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
		contractVersion: te,
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
			let r = oe(e, t), i = window.NEStandardUI?.runtime;
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
function ae(e, t) {
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
function oe(e, t) {
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
var h = "data-ui-id", se = "data-ui-context", ce = "data-ui-pc", g = "data-ui-key", le = "data-ui-unselectable", ue = "data-ui-undraggable", de = "data-ui-unremovable", fe = "data-ui-unrenamable", pe = "data-ui-no-context-menu", me = "data-ui-no-row-open", he = "data-ui-no-row-drag", ge = "ui-row__grip", _e = "data-ui-row-drop", ve = "data-ui-tabs-draggable", ye = "data-ui-tabs-menu", be = "data-ui-context-menu", xe = "data-ui-context-menu-use", Se = "data-ui-action-bar", Ce = "data-ui-action-bar-key", we = "data-ui-action-bar-rest", Te = "data-ui-menu-left-out", Ee = "data-ui-in-action-bar", De = "ui-action-bar", Oe = "data-ui-row-focus", ke = "data-ui-tooltip", Ae = "data-ui-tooltip-placement", je = "data-ui-tooltip-mark", Me = "data-ui-badge-text", Ne = "data-ui-badge-set", Pe = "data-ui-name", Fe = "data-ui-bind-", Ie = "data-ui-into-", Le = "data-ui-bind-value", Re = (e) => `data-ui-no-${e}`, ze = "data-ui-event-boundary", Be = "data-ui-image-caption", Ve = "data-ui-image-crop", He = "data-ui-image-crop-size", _ = "data-ui-items-host", Ue = "data-ui-collection-sink", We = "data-ui-items-query", Ge = "data-ui-number-culture", Ke = "data-ui-page-culture", qe = "data-ui-temporal-culture", Je = "data-ui-empty-template", Ye = "data-ui-group-template", Xe = "data-ui-empty-placeholder", Ze = "data-ui-group-header", Qe = "data-ui-group-anchor", $e = "data-ui-group", et = "data-ui-value-holder", tt = "data-ui-value-kind", nt = "items-query", rt = "data-ui-host-mode", it = "data-ui-host-viewport", at = "data-ui-scroll-group", ot = "data-ui-scroll-lines", st = "data-ui-source-line", ct = "data-ui-window-spacer", lt = "data-ui-window-size", ut = "data-ui-window-offset", dt = "data-ui-window-total", ft = "data-ui-window-more-before", pt = "data-ui-window-more-after", mt = "data-ui-window-group-before", ht = "data-ui-window-aggregates", gt = "data-ui-form-id", _t = "data-ui-forms", vt = "data-ui-visibility", yt = "data-ui-collapsed", bt = "data-ui-menu-group", xt = "data-ui-menu-select", St = "data-ui-menu-open", Ct = "data-ui-menu-search", wt = "data-ui-menu-searching", Tt = "data-ui-menu-unmatched", Et = "data-ui-drawer-toggle", Dt = "data-ui-drawer-open", Ot = "data-ui-bottom-bar", kt = "data-ui-region", At = "data-ui-menu-item-kind", v = "ui-menu", y = "ui-menu-item", jt = "ui-menu-item--checked", Mt = "ui-menu-item--selected", Nt = "ui-menu--rail", Pt = `[${At}="header"], [${At}="separator"]`, Ft = `[${bt}] > .${y}`, It = `${Ft}, .${y}[${At}="check"]`, Lt = "data-ui-collapse-toggle", Rt = "data-ui-folding", zt = "data-ui-column-limits", Bt = "data-ui-row-limits", Vt = "data-ui-splitter-step", Ht = "data-ui-table-column", Ut = "data-ui-table-hide-below", Wt = "data-ui-table-starts-hidden", Gt = "data-ui-table-hidden", Kt = "ui-table__row", qt = "ui-table__scroll", Jt = "ui-table__header", Yt = "ui-table__resizer", Xt = "ui-tree", Zt = "ui-tree__row", Qt = "ui-tree__row--filtered", $t = "data-ui-table-last", en = "data-ui-table-reordering", tn = "data-ui-table-dragging", nn = "data-ui-table-drop", rn = "data-ui-table-scrolled", an = "data-ui-table-scrollbar", on = "data-ui-no-row-select", sn = "data-ui-tree-parent", cn = "data-ui-tree-children", ln = "data-ui-tree-folder", un = "data-ui-tree-expanded", dn = "data-ui-tree-title", fn = "data-ui-tree-loading", pn = "data-ui-tree-drop-target", mn = "data-ui-tree-boot", hn = "data-ui-tree-draggable", gn = "data-ui-row-editing", _n = "data-ui-image-source", vn = "data-ui-file-max-size", yn = "data-ui-file-pick", bn = "data-ui-file-drop-target-id", xn = "data-ui-theme", Sn = "data-ui-theme-colors", Cn = "data-ui-words", wn = "data-ui-language-switcher", Tn = "data-ui-language", En = "data-ui-splitting", Dn = "data-ui-keyboard-up", On = "data-ui-split-folded", kn = "data-ui-pointer-focus", An = "data-ui-selection", jn = "data-ui-selected", Mn = "data-ui-selected-key", Nn = "data-ui-selected-keys", Pn = "data-ui-bind-selected-key", Fn = "data-ui-tabs-selected", In = "data-ui-tab-order", Ln = "data-ui-tab-caption", Rn = "data-ui-tab-pinned", zn = [
	vt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Bn = "data-ui-submit-form-id", b = `[${h}]`, Vn = "data-ui-href", Hn = "ui-disabled", Un = "ui-loading", Wn = "ui-readonly", Gn = "ui-hidden", Kn = "ui-dialog__surface", qn = "ui-flyout__content", Jn = "data-ui-focus-holder", Yn = "[role='listbox'], [role='menu'], [role='dialog']", Xn = "ui-select__trigger", Zn = `.${Xn}`, Qn = "ui-button", $n = `${Qn} ui-button--ghost ui-button--small`, er = "ui-select", tr = "ui-text-input", nr = "ui-invalid", rr = {
	componentId: h,
	key: g,
	selected: jn,
	selectedKey: Mn,
	selectedKeys: Nn,
	unselectable: le,
	rowFocus: Oe,
	itemsHost: _,
	valueHolder: et,
	bindValue: Le,
	noRowOpen: me,
	noRowDrag: he,
	eventBoundary: ze,
	focusHolder: Jn,
	tooltip: ke,
	tooltipPlacement: Ae,
	contextMenu: be,
	contextMenuUse: xe,
	actionBar: Se,
	actionBarKey: Ce,
	actionBarRest: we,
	disabledClass: Hn,
	loadingClass: Un,
	readOnlyClass: Wn,
	hiddenClass: Gn,
	buttonClass: Qn,
	selectClass: er,
	textInputClass: tr,
	invalidClass: nr,
	sourceLine: st,
	popupSelector: Yn,
	listTriggerSelector: Zn,
	tableRowClass: Kt,
	tableScrollClass: qt,
	tableHeaderClass: Jt,
	tableResizerClass: Yt,
	tableHidden: Gt,
	hostMode: rt,
	windowOffset: ut,
	windowTotal: dt,
	windowSize: lt,
	windowMoreAfter: pt,
	windowAggregates: ht,
	itemsQuery: We,
	valueKind: tt,
	itemsQueryKind: nt,
	menuItemClass: y,
	menuItemKind: At,
	menuItemCheckedClass: jt
};
function ir(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function ar(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var or = 0;
function sr(e, t) {
	return e.id.length === 0 && (or++, e.id = `${t}-${or}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function cr(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(b) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var lr = {
	Navigate: "Navigate",
	Focus: "Focus",
	ScrollTo: "ScrollTo",
	ScrollToItem: "ScrollToItem",
	Show: "Show",
	Hide: "Hide",
	Collapse: "Collapse",
	OpenDialog: "OpenDialog",
	CloseDialog: "CloseDialog",
	ShowNotification: "ShowNotification",
	DownloadFile: "DownloadFile",
	Scroll: "Scroll",
	SetTheme: "SetTheme",
	SetThemeColors: "SetThemeColors",
	RenameTab: "RenameTab",
	RenameNode: "RenameNode",
	CopyToClipboard: "CopyToClipboard",
	InsertText: "InsertText",
	DiscardForm: "DiscardForm",
	OpenPicker: "OpenPicker",
	SetLanguage: "SetLanguage",
	ConfirmLeave: "ConfirmLeave"
}, ur = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(S(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${S(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(S(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (S(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Mr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Mr(e, jr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Nr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Ar(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Ar(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Pr(e, t))?.items ?? [];
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
		let t = S(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = S(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Mr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Mr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Ar(e.eventName), n = S(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Nr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = S(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = S(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = S(e.componentId);
		t > 0 && this.itemValuesByAddress.set(Pr(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = S(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function x(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function dr(e) {
	return x(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function fr(e) {
	return e == null ? "OneWay" : x(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function pr(e) {
	return x(e, ["Property", "Event"]);
}
function mr(e) {
	return e == null ? "SetProperty" : x(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function hr(e) {
	return x(e, [
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
function gr(e) {
	return x(e, ["Ascending", "Descending"]);
}
function _r(e) {
	return x(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function vr(e) {
	return x(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function yr(e) {
	return typeof e == "string" ? e : x(e, [
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
function br(e) {
	return x(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function xr(e) {
	return x(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function S(e) {
	return e ?? 0;
}
function Sr(e) {
	return typeof e == "string" ? e : "";
}
function Cr(e) {
	return x(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function wr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Tr(e) {
	return x(e, ["Auto", "Smooth"]);
}
function Er(e) {
	return x(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Dr(e) {
	return x(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Or(e) {
	return x(e, ["Light", "Dark"]);
}
function kr(e) {
	return x(e, ["Horizontal", "Vertical"]);
}
function Ar(e) {
	return e?.trim().toLowerCase() ?? "";
}
function jr(e) {
	return e?.trim() ?? "";
}
function Mr(e, t) {
	return `${e}:${jr(t)}`;
}
function Nr(e, t) {
	return `${e}:${Ar(t)}`;
}
function Pr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Fr = class {
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
		return this.dom.findAllComponents(S(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = S(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = S(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Fe}${ar(r.propertyName)}="${ir(a)}"]` : null;
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
		let n = S(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return cr(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${ar(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ir(e) {
	return Br(e, ce);
}
function Lr(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Vr(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Rr(e, t) {
	let n = Ir(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Lr(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function zr(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = Vr(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Br(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Vr(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Hr(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Ur = class {
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
		let e = this.root.querySelectorAll(b), t = this.root.querySelector(`[${Ze}]`) !== null;
		for (let n of e) {
			let e = C(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && qr(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return sr(e, t);
	}
	findComponentParts(e, t, n) {
		return Hr(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(Kr(t)) ?? [];
		if (n.length > 0 && n.every((e) => Rr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Rr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Ir(n);
			if (e === 0) continue;
			let r = Lr(n, e);
			if (r.length !== e) continue;
			let i = Kr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(b);
			if (e === null || !Jr(this.root, e)) return null;
			let r = C(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Lr(e, Ir(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function C(e) {
	return Br(e, h);
}
function Wr(e) {
	let t = e.closest(b), n = t === null ? 0 : C(t);
	return n > 0 ? n : null;
}
function Gr(e) {
	let t = e.closest(b), n = t === null ? 0 : C(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Lr(t, Ir(t))
	};
}
function Kr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function qr(e) {
	return Ir(e) === 0;
}
function Jr(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Yr(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Xr(n);
	switch (Zr(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Qr(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Qr(r, i) ? "many" : "other";
		case "ru":
		case "uk": return $r(r, i);
		case "pl": return ei(r, i);
		default: return "other";
	}
}
function Xr(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Zr(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Qr(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function $r(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function ei(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ti(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var ni = {
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
function ri(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return ni;
	try {
		return {
			...ni,
			...JSON.parse(t)
		};
	} catch {
		return ni;
	}
}
var ii = [
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
function ai(e, t, n) {
	if (t == null || t.trim().length === 0) return `${fi(e.getFullYear(), 4)}-${fi(e.getMonth() + 1, 2)}-${fi(e.getDate(), 2)} ${fi(e.getHours(), 2)}:${fi(e.getMinutes(), 2)}:${fi(e.getSeconds(), 2)}`;
	let r = "", i = oi(t);
	for (let a = 0; a < t.length;) {
		let o = ui(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += di(o, e, n, i), a += o.length;
	}
	return r;
}
function oi(e) {
	for (let t = 0; t < e.length;) {
		let n = ui(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var si = /^[-./:,]$/, ci = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function li(e) {
	for (let t = 0; t < e.length;) {
		let n = ui(e, t);
		if (n !== null && ci.has(n) || n === null && !si.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function ui(e, t) {
	for (let n of ii) if (e.startsWith(n, t)) return n;
	return null;
}
function di(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return fi(t.getFullYear(), 4);
		case "yy": return fi(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return fi(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return fi(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return fi(i, 2);
		case "H": return String(i);
		case "hh": return fi(a, 2);
		case "h": return String(a);
		case "mm": return fi(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return fi(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function fi(e, t) {
	return String(e).padStart(t, "0");
}
var pi = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function mi(e) {
	let t = pi.exec(e.trim());
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
function hi(e) {
	return gi(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function gi(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var _i = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function vi(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = ui(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += yi(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function yi(e, t) {
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
function bi(e, t, n) {
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
		let a = ui(t, e);
		if (a === null) {
			if (!xi(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Si(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? ki(i) : null;
}
function xi(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return si.test(n) ? t.position >= e.length || !si.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Si(e, t, n, r) {
	switch (n) {
		case "yyyy": return Ci(t, "year", Ei(e, t, 4, 4));
		case "yy": return Ci(t, "year", wi(Ei(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Ci(t, "month", Ti(Di(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Ci(t, "month", Ei(e, t, 1, 2));
		case "dddd":
		case "ddd": return Di(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Ci(t, "day", Ei(e, t, 1, 2));
		case "HH":
		case "H": return Ci(t, "hour", Ei(e, t, 1, 2));
		case "hh":
		case "h": return Ci(t, "hour12", Ei(e, t, 1, 2));
		case "mm":
		case "m": return Ci(t, "minute", Ei(e, t, 1, 2));
		case "ss":
		case "s": return Ci(t, "second", Ei(e, t, 1, 2));
		case "tt": return Oi(e, t, r);
		default: return !1;
	}
}
function Ci(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function wi(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ti(e) {
	return e === null ? null : e + 1;
}
function Ei(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Di(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Oi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function ki(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > gi(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Ai = {
	readCulture: ri,
	format: ai,
	parse: mi,
	toDate: hi
}, ji = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Mi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ni(e) {
	let t = e?.trim() ?? "";
	if (!Mi.test(t)) return null;
	let n = Date.parse(ji.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Pi(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Fi(e) {
	return e === "relative" || e === "relative-date";
}
var Ii = {
	...ni,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Li(e, t, n, r) {
	if (t === "relative") return qi(e - r, n.language);
	if (t === "relative-date") {
		let t = Ri(e, r);
		if (t !== null) return Vi(n.language).format(t, "day");
	}
	let i = n.temporal ?? Ii, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ti(i, !1);
	return ai(new Date(e), a, i);
}
function Ri(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Ki);
	return Math.abs(i) <= 1 ? i : null;
}
function zi(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Hi(t)) + e.slice(1);
}
var Bi = /* @__PURE__ */ new Map();
function Vi(e) {
	let t = Bi.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Hi(e), { numeric: "auto" }), Bi.set(e, t)), t;
}
function Hi(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Ui = 1e3, Wi = 60 * Ui, Gi = 60 * Wi, Ki = 24 * Gi;
function qi(e, t) {
	let n = Vi(t), r = Math.abs(e);
	return r < 45 * Ui ? n.format(0, "second") : r < 45 * Wi ? n.format(Math.round(e / Wi), "minute") : r < 22 * Gi ? n.format(Math.round(e / Gi), "hour") : r < 26 * Ki ? n.format(Math.round(e / Ki), "day") : r < 320 * Ki ? n.format(Math.round(e / (30.4375 * Ki)), "month") : n.format(Math.round(e / (365.25 * Ki)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Ji = "count";
function Yi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Xi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Zi = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Qi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Ni(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Zi.has(t.format));
}
function $i(e) {
	if (typeof e != "object" || !e) return !1;
	if (Qi(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if ($i(t)) return !0;
	return !1;
}
function ea(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function ta(e, t, n) {
	return Yi(e) ? ia(n, e.key, e.args) : Xi(e) ? na(n, e.text) : t && typeof e == "string" ? na(n, e) : e;
}
function na(e, t) {
	return t.trim().length === 0 || !ra(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function ra(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function ia(e, t, n) {
	let r = n?.[Ji];
	return aa(typeof r == "number" ? e.lookup(`${t}.${Yr(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Xi(t) ? na(e, t.text) : ia(e, t.key, t.args), e.writeMoment);
}
function aa(e, t, n, r = ea) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = oa(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += ca(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function oa(e, t) {
	let n = t + 1;
	for (; n < e.length && sa(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function sa(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function ca(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Yi(e) ? t === void 0 ? aa(e.key, e.args, void 0, n) : t(e) : Xi(e) ? t === void 0 ? e.text : t(e) : Qi(e) ? n(Ni(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var la = 15e3, ua = /* @__PURE__ */ new Set(), da = null;
function fa(e) {
	ua.add(e), da === null && (da = setInterval(pa, la));
}
function pa() {
	for (let e of [...ua]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || ua.delete(e);
	}
	ua.size === 0 && da !== null && (clearInterval(da), da = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var ma = 256, ha = 512, ga = "script[type='application/json'][data-ui-strings]", _a = "#text", va = `[${Cn}*='"moment"']`, ya = class {
	words = /* @__PURE__ */ new Map();
	overrides = /* @__PURE__ */ new Map();
	missing = /* @__PURE__ */ new Set();
	changeHandlers = /* @__PURE__ */ new Set();
	tableHandlers = /* @__PURE__ */ new Set();
	momentHandlers = /* @__PURE__ */ new Set();
	relativeWritten = !1;
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
		let t = e.querySelector(ga)?.textContent?.trim() ?? "";
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
	onMomentTick(e) {
		return this.momentHandlers.add(e), () => this.momentHandlers.delete(e);
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
		return this.lookup(e) === void 0 && this.text(e), ia(this, e, t);
	}
	translate(e, t) {
		return ia(this, e, t);
	}
	writeMoment = (e, t) => (Fi(t) && this.noteRelative(), Li(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && fa(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return ta(e, t, this);
	}
	resolveText(e) {
		return ta(e, !0, this);
	}
	write(e, t, n, r) {
		wa(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		wa(e, t, ta(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Yi(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Xi(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		wa(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Sa(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Ta(e, (e) => {
			for (let n of e.querySelectorAll(t ? va : `[${Cn}]`)) for (let [e, r] of Object.entries(Ca(n))) {
				if (t && !$i(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && wa(n, e === _a ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return ta(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > ha || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && ra(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += ma) try {
			let a = await e(t, n.slice(r, r + ma));
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
function ba(e) {
	let t = !1;
	return Ta(e, (e) => {
		t ||= e.querySelector(va) !== null;
	}), t;
}
function xa(e, t) {
	e.hasAttribute("data-ui-words") && Sa(e, t, null);
}
function Sa(e, t, n) {
	let r = Ca(e), i = t ?? _a;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Cn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Cn, a);
}
function Ca(e) {
	let t = e.getAttribute(Cn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function wa(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ta(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Ta(n.content, t);
}
var w = new ya();
function Ea(e, t) {
	let n = Xi(e) ? e.text : e;
	return w.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Da = `.${Hn}, .${Un}, [inert]`, Oa = `:scope > [${h}]:is(${Da}), :scope > :not([${h}]) > [${h}]:is(${Da})`;
function T(e) {
	return e.closest(Da) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function E(e) {
	return e.matches(Da) || e.querySelector(Oa) !== null;
}
function ka(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Aa = `[${h}], .${Wn}`;
function D(e) {
	return e.closest(Aa)?.matches(`.${Wn}`) === !0;
}
function ja(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(Hn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Ma = {
	isInert: T,
	isReadOnly: D,
	setDisabled: ja
};
//#endregion
//#region src/extensions/value-readers.ts
function Na(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Pa(e) {
	return e == null;
}
var Fa = "data-ui-trim-input", Ia = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Va) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(tt);
		if (t === null) return La(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Fa) ? t.trim() : t;
	}
	readHeld(e) {
		let t = za(e);
		return t === null ? null : this.read(t);
	}
};
function La(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Ra = "input, textarea, select";
function za(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Ra) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Ra}`);
}
function Ba(e) {
	return e === null ? null : Number(e);
}
var Va = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Fn)
	},
	{
		kind: "tab-order",
		read: (e) => Ba(e.getAttribute(In))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Ln)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Rn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(dn)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Mn)
	},
	{
		kind: "selected-keys",
		read: (e) => Ha(e, Nn)
	},
	{
		kind: nt,
		read: (e) => Ha(e, We)
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
function Ha(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Ua(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var Wa = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function Ga(e) {
	return e instanceof HTMLInputElement && Wa.has(e.type);
}
function Ka(e) {
	return Ga(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var qa = "ui-draft-dropped";
function Ja(e) {
	e.dispatchEvent(new Event(qa, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function Ya(e) {
	let t = $a(e.key), n = eo(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(Qa);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Xa(e, t) {
	return $a(e) !== null || eo(e, t) !== 0;
}
var Za = {
	target: Ya,
	applyTabIndex: O
};
function O(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Qa(e) {
	return e.getClientRects().length > 0 && !T(e);
}
function $a(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function eo(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function to(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var no = "data-ui-bind-selected-keys", k = `.ui-items-view, .ui-table, .${Xt}`, ro = `.ui-items-view__item, .${Kt}, .${Zt}`, io = ".ui-items-view, .ui-table", ao = {
	shift: !1,
	ctrl: !1
}, oo = /* @__PURE__ */ new WeakMap();
function so(e, t) {
	t !== null && !oo.has(e) && co(e, t);
}
function co(e, t) {
	let n = j(t);
	n.length > 0 && oo.set(e, n);
}
function lo(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function uo(e, t) {
	let n = lo(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function fo(e) {
	return !e.hasAttribute(on);
}
function A(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${h}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function po(e) {
	switch (e.getAttribute(An)) {
		case "one": {
			let t = e.getAttribute(Mn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(xo(So(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function mo(e, t) {
	let n = po(e), r = e.getAttribute(An), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(j(e));
		e.toggleAttribute(jn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function ho(e) {
	return e.filter((e) => e.hasAttribute(jn));
}
function go(e, t, n, r) {
	let i = j(n);
	if (!yo(n)) return !1;
	switch (e.getAttribute(An)) {
		case "one": return to(e, i, {
			attribute: Mn,
			bindingAttribute: Pn,
			apply: (e) => mo(e, t)
		}), !0;
		case "many": return _o(e, t, n, i, r), !0;
		default: return !1;
	}
}
function _o(e, t, n, r, i) {
	let a = So(e);
	if (a === null) return;
	let o = xo(a), s;
	if (i.shift) {
		let r = bo(t, t.find((t) => j(t) === oo.get(e)) ?? n, n).map(j);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], oo.set(e, r)) : (s = [r], oo.set(e, r));
	vo(e, t, s);
}
function vo(e, t, n) {
	let r = So(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Nn, i), mo(e, t), r.hasAttribute(no) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function yo(e) {
	return j(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !E(e);
}
function bo(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => A(e) !== null && yo(e));
}
function xo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function So(e) {
	for (let t of e.querySelectorAll(`[${_}]`)) if (t.closest(k) === e) return t;
	return null;
}
function j(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Co = {
	isSelected: (e) => e.hasAttribute(jn),
	toggle: wo,
	setSelected: To,
	setSelectedKeys: Eo
};
function wo(e) {
	let t = e.closest(k);
	t !== null && e instanceof HTMLElement && go(t, Do(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function To(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(j(e));
	Eo(e, r, n);
}
function Eo(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Do(e), i = new Set(r.filter((e) => !yo(e)).map(j)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...po(e)].filter((e) => !a.has(e));
	vo(e, r, n ? [...o, ...a] : o);
}
function Do(e) {
	return [...e.querySelectorAll(ro)].filter((t) => t.closest(k) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function Oo(e) {
	let t = e.closest(k);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(ro);
	return n !== null && n.closest(k) === t ? {
		root: t,
		row: n
	} : null;
}
function ko(e) {
	return e.filter((e) => A(e) !== null && !E(e));
}
function Ao(e) {
	return jo(e) ?? ko(e)[0] ?? null;
}
function jo(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !E(e)) ?? null;
}
function Mo(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", sr(t, "ui-row-name"));
}
function No(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Oe);
	n.setAttribute(Oe, ""), e.setAttribute("aria-activedescendant", sr(n, "ui-row")), (A(n) ?? n).scrollIntoView({ block: "nearest" });
}
function Po(e, t, n, r) {
	if (!Xa(e, r === "grid" ? "both" : r)) return null;
	let i = ko(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Fo(i, n, e === "ArrowDown");
	let a = i.map((e) => A(e) ?? e), o = Ya({
		key: e,
		items: a,
		current: n === null ? null : A(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Fo(e, t, n) {
	let r = t === null ? null : A(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Io(i), o = e.map((e) => ({
		row: e,
		rect: (A(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Io(t.rect) - a) < Math.abs(Io(e.rect) - a) ? t : e).row;
}
function Io(e) {
	return e.left + e.width / 2;
}
function Lo(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Ro(e, t, n) {
	let r = n.hasAttribute(Oe), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = ko(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && No(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var zo = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Bo = /* @__PURE__ */ new Set([
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
]), Vo = !1, Ho = !1, Uo = null, Wo = /* @__PURE__ */ new Set(), Go = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Ko(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => qo(e), !0), window.addEventListener("focusin", (e) => Jo(e.target), !0), window.addEventListener("focusout", (e) => $o(e.target, !1), !0));
function Ko(e, t = "") {
	Vo = !0, Ho = t === "touch";
	let n = document.activeElement;
	Uo = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && $o(n, !Yo(n));
}
function qo(e) {
	if (!(e instanceof KeyboardEvent && Bo.has(e.key))) {
		Vo = !1;
		for (let e of [...Wo]) $o(e, !1);
	}
}
function Jo(e) {
	Vo && !Yo(e) && $o(e, !0);
}
function Yo(e) {
	return Ka(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Xo() {
	return Vo && Uo instanceof HTMLElement && Uo !== document.body ? Uo : null;
}
function Zo() {
	return Vo;
}
function Qo() {
	return Vo && Ho;
}
function $o(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Wo) e.isConnected || Wo.delete(e);
			Wo.add(e);
		} else Wo.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(kn, t);
	}
}
function M(e) {
	e.focus({ preventScroll: !0 });
}
function es(e) {
	$o(e, !0), e.focus({ preventScroll: !0 });
}
function ts(e) {
	for (let t of e.querySelectorAll(zo)) if (ka(t)) return t;
	return null;
}
var ns = {
	first: ts,
	stops: (e) => rs(e, document.activeElement)
};
function rs(e, t) {
	let n = [...e.querySelectorAll(zo)].filter((e) => e === t || e.tabIndex >= 0 && ka(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = is(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !as(n) && as(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = is(e);
		return t === null || r.get(t) === e;
	});
}
function is(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function as(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function os(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && ss(n, a) ? i : r && ss(n, i) ? a : null;
}
function ss(e, t) {
	return e === t || is(e) !== null && is(e) === is(t);
}
var cs = `.${Kn}, .${qn}, [${Jn}]`;
function ls(e) {
	let t = Oo(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(cs)) && n.hasAttribute("tabindex") && ka(n)) return n;
	return null;
}
function us(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? ts(e);
	return Vo ? Go.add(e) : Go.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), M(r ?? e), n;
}
function ds(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? ts(e);
	return n !== null && fs(e, n), us(e, n);
}
function fs(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function ps(e, t, n = !1) {
	if (Vo) {
		O(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), M(e);
		return;
	}
	let r = t.filter(Qa), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (O(t, i), M(i));
}
function ms(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : hs(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${zo}, [tabindex]`) && ka(e)) return e;
	return n === null ? null : gs(n);
}
function hs(e, t) {
	for (let n = e.closest(b); n !== null; n = n.parentElement?.closest(b) ?? null) {
		let e = t.querySelectorAll(`[${h}="${n.getAttribute(h)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function gs(e) {
	for (let t = e.closest(b); t !== null; t = t.parentElement?.closest(b) ?? null) if (ka(t)) return _s(t), t;
	return null;
}
function _s(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function vs(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (ys(n, t) && $o(e, !Yo(e)), M(e));
}
function ys(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Go.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var bs = "data-ui-clear", xs = ["change", "toggle"], Ss = [
	...xs,
	"expand",
	"collapse",
	"open",
	"close"
];
function Cs(e) {
	let t = fr(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function ws(e) {
	return fr(e) === "OnSubmit";
}
function Ts(e, t) {
	let n = e.getAttribute(Le);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && ws(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Cs(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: ws(i.mode)
		};
	}
	return null;
}
var Es = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of xs) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(qa, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${bs}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Ts(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${bs}]`);
		if (t === null) return;
		let n = t.closest(b), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Ds(r) || (Ua(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ka(r) && document.activeElement !== r && M(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (D(e.target) || T(e.target))) return;
		let t = Ts(e.target, this.options.metadata);
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
			let r = Ts(n, this.options.metadata);
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
		if (i === void 0 || !Cs(i.mode) || ws(i.mode)) return;
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
function Ds(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Os(e, t) {
	let n = e.closest(`[${ze}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var ks = class {
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
}, As = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Ar(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Ar(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Ar(e));
	}
	markAttached(e) {
		let t = Ar(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, js = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: S(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Ms = {
	dispatched: !1,
	success: !1
}, Ns = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Ps = class {
	options;
	root;
	registry;
	requestFactory = new js();
	turns = new ks();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new As(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Is(t, r.element) || Os(t.target, r.element)) return;
		let i = {
			domEvent: t,
			metadata: this.options.metadata.getEvent(r.componentId, e),
			component: r.element,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters
		}, a = n.dynamicParameters === void 0 ? i : {
			...i,
			dynamicParameters: n.dynamicParameters(i) ?? i.dynamicParameters
		};
		try {
			n.started?.(a);
			let t = await this.runAsync(e, n, r.element, a);
			n.completed?.({
				...a,
				...t
			});
		} catch (e) {
			let t = e instanceof Ns, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && T(r.domEvent.target)) return Ms;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Ms;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Ls(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Ms;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Ms;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Ns(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ss.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Re(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Fs(e.preventDefault, t) && t.domEvent.preventDefault(), Fs(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Fs(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Is(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Ls(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Rs(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && zs(e, t) : Bs(e, t);
}
function zs(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Rs(e[n], t[n])) return !1;
	return !0;
}
function Bs(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Rs(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Vs = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	moved = /* @__PURE__ */ new Set();
	frameRequested = !1;
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of xs) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
		e.hasCopyValues && i.addEventListener("input", (e) => this.queueMoved(e), !0);
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
		let t = this.resolveEdited(e.target);
		if (t === null) return;
		let n = this.options.valueReaders.readBound(e.target), r = Ws(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Rs(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Ts(e, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(S(n.binding.componentId), n.binding.propertyId);
		return r.length === 0 ? null : {
			interactions: r,
			dynamicParameters: t.dynamicParameters
		};
	}
	queueMoved(e) {
		e.target instanceof Element && (this.moved.add(e.target), !this.frameRequested && (this.frameRequested = !0, requestAnimationFrame(this.applyMoved)));
	}
	applyMoved = () => {
		this.frameRequested = !1;
		for (let e of this.moved) {
			let t = e.isConnected ? this.resolveEdited(e) : null;
			if (t === null) continue;
			let n = this.options.valueReaders.readBound(e);
			for (let e of t.interactions) mr(e.actionKind) === "CopyValue" && Gs(e.target) && this.writeTarget(e.target, t.dynamicParameters, Hs(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: S(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(S(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Ws(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = mr(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!Gs(a)) return;
		let o = i === "CopyValue" ? Hs(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
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
			effect: Us(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Hs(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Us(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = S(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Rr(s, o)) return a === 0 ? e : {
			...e,
			target: {
				...r,
				dynamicParameters: o
			}
		};
	}
	return {
		...e,
		target: {
			...r,
			dynamicParameters: t
		}
	};
}
function Ws(e, t) {
	return JSON.stringify([
		S(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function Gs(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Ks = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return qs(t, e.operator, e.value);
	}
};
function qs(e, t, n) {
	let r = Js(e), i = Js(n);
	switch (hr(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Ys(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Ys(r, i, (e) => e >= 0);
		case "Less": return Ys(r, i, (e) => e < 0);
		case "LessOrEqual": return Ys(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Xs(r, i);
		default: return !1;
	}
}
function Js(e) {
	return Yi(e) ? e.key : Xi(e) ? e.text : e;
}
function Ys(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Xs(e, t) {
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
var Zs = "Value", Qs = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	valueInteractions = /* @__PURE__ */ new Map();
	metadata;
	copiesValues = !1;
	constructor(e) {
		this.metadata = e;
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	get hasCopyValues() {
		return this.copiesValues;
	}
	hasEvent(e) {
		return this.eventNames.has(Ar(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) tc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Ar(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(nc(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(rc(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if ($s(e)) {
			let t = S(e.sourceEvent?.componentId), n = Ar(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(nc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(nc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (ec(e)) {
			let t = S(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(rc(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(rc(t, n), r)), r.push(e), mr(e.actionKind) === "CopyValue" && (this.copiesValues = !0), this.metadata.getPropertyDefinition(n)?.propertyName === Zs) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function $s(e) {
	return pr(e.sourceKind) === "Event";
}
function ec(e) {
	return pr(e.sourceKind) === "Property";
}
function tc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function nc(e, t) {
	return `${e}:${Ar(t)}`;
}
function rc(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var N = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function ic() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function ac(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var oc = /* @__PURE__ */ new Set([
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
function sc(e) {
	return oc.has(e);
}
var cc = 4, lc = 12, uc = /* @__PURE__ */ new Map(), dc = !1, fc = null, pc = /* @__PURE__ */ new WeakMap(), mc = "data-ui-popup-stood-in";
function hc(e, t) {
	t === null ? pc.delete(e) : pc.set(e, t);
}
var gc = "--ui-popup-ground";
function _c(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(gc).trim() : "";
	n.length === 0 ? t.style.removeProperty(gc) : t.style.setProperty(gc, n);
}
function vc(e, t, n) {
	uc.set(t, {
		anchor: e,
		options: n
	}), Ec(), fc?.observe(t), bc(e, t), Oc(e, t, n);
}
var yc = "data-ui-popup-lifted";
function bc(e, t) {
	if (t.hasAttribute(yc)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!Sc(t) && e.closest(`[${yc}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(yc, ""), xc(t));
}
function xc(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function Sc(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function Cc(e) {
	e.hasAttribute(yc) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || uc.has(e) || (e.removeAttribute("popover"), e.removeAttribute(yc));
	}, N.fast));
}
function wc(e) {
	let t = uc.get(e);
	t !== void 0 && Oc(t.anchor, e, t.options);
}
function Tc(e) {
	e != null && (uc.delete(e), fc?.unobserve(e), Cc(e));
}
function Ec() {
	dc || (dc = !0, document.addEventListener("scroll", Dc, !0), window.addEventListener("resize", Dc), window.visualViewport?.addEventListener("resize", Dc), window.visualViewport?.addEventListener("scroll", Dc), fc = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = uc.get(t.target);
			e !== void 0 && Oc(e.anchor, t.target, e.options, !0);
		}
	}));
}
function Dc() {
	for (let [e, t] of uc) {
		if (!e.isConnected) {
			Tc(e);
			continue;
		}
		Oc(t.anchor, e, t.options);
	}
}
function Oc(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = kc(e), a = i !== e;
	t.hasAttribute(mc) !== a && t.toggleAttribute(mc, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = t.getBoundingClientRect(), l = Mc(n.boundary), u = uc.get(t), d = r ? u?.side : void 0, f = d !== void 0 && Pc(o, c, d, n.gap, l) ? d : Nc(o, c, n, l);
	u !== void 0 && (u.side = f);
	let p = Vc(o, s, c, f, n.gap), m = Hc(o, s, c, f, n.gap);
	n.arrow === !0 && (Lc(f) ? m = Ac(m, s.left + s.width / 2, c.width) : p = Ac(p, s.top + s.height / 2, c.height));
	let ee = Wc();
	p = ee.top + Kc(p - ee.top, c.height, ee.bottom - ee.top), m = Kc(m, c.width, window.innerWidth), t.style.top = `${p}px`, t.style.left = `${m}px`, t.dataset.uiPlacement !== f && (t.dataset.uiPlacement = f), jc(t, s, c, f, p, m);
}
function kc(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(mc)) return e;
		let n = pc.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Ac(e, t, n) {
	let r = t - e;
	return r < lc ? e - (lc - r) : r > n - lc ? e + (r - (n - lc)) : e;
}
function jc(e, t, n, r, i, a) {
	let o = Lc(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(lc, Math.min(s, c - lc))}px`);
}
function Mc(e) {
	let t = Wc(), n = {
		left: 0,
		top: t.top,
		right: window.innerWidth,
		bottom: t.bottom
	};
	if (e === void 0 || !e.isConnected) return n;
	let r = e.getBoundingClientRect(), i = r.left + e.clientLeft, a = r.top + e.clientTop;
	return {
		left: Math.max(n.left, i),
		top: Math.max(n.top, a),
		right: Math.min(n.right, i + e.clientWidth),
		bottom: Math.min(n.bottom, a + e.clientHeight)
	};
}
function Nc(e, t, n, r) {
	let i = n.placement, a = zc(i);
	if (Pc(e, t, i, n.gap, r)) return i;
	if (Pc(e, t, a, n.gap, r)) return a;
	for (let a of Fc(i)) if (Pc(e, t, a, n.gap, r)) return a;
	return Rc(e, a, r) > Rc(e, i, r) ? a : i;
}
function Pc(e, t, n, r, i) {
	return Rc(e, n, i) >= Ic(t, n) + r;
}
function Fc(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Ic(e, t) {
	return Lc(t) ? e.height : e.width;
}
function Lc(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Rc(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function zc(e) {
	return e.startsWith("top") ? `bottom${Bc(e)}` : e.startsWith("bottom") ? `top${Bc(e)}` : e.startsWith("left") ? `right${Bc(e)}` : `left${Bc(e)}`;
}
function Bc(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Vc(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Uc(t.top, t.height, n.height, r);
}
function Hc(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Uc(t.left, t.width, n.width, r);
}
function Uc(e, t, n, r) {
	let i = Bc(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Wc() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Gc(r))
	};
}
function Gc(e) {
	let t = document.querySelector(`[${Ot}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Kc(e, t, n) {
	return Math.max(cc, Math.min(e, n - t - cc));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var qc = 32;
function P(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Jc(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Jc(e, t, n) {
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
		if (r.size > qc) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Yc(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Xc = "data-ui-dialog", Zc = "data-ui-dialog-modal", Qc = "data-ui-dialog-backdrop", $c = "data-ui-dialog-close-backdrop", el = "data-ui-dialog-close-escape";
function tl(e) {
	let t = e.querySelectorAll(`[${Xc}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function nl(e) {
	let t = tl(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function rl(e) {
	let t = typeof document > "u" ? null : nl(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var il = "data-ui-rename-field";
function al(e) {
	return e instanceof Element && e.closest(`[${il}]`) !== null;
}
function ol(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(il, ""), r.setAttribute(ze, ""), r.value = e.value, sl(r, n, t);
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
function sl(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var cl = /* @__PURE__ */ new Set(), ll = /* @__PURE__ */ new Map(), ul = 0, dl = !1;
function fl() {
	dl || (dl = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || al(e.target) || hl() && e.preventDefault();
	}, !0));
}
function pl() {
	for (let e of cl) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function ml(e) {
	for (let t of cl) t.hearRefusedClick(e);
}
function hl() {
	let e = [];
	for (let t of cl) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...ll.keys()]) t.has(e) || ll.delete(e);
	for (let { popup: t } of e) ll.has(t) || ll.set(t, ++ul);
	let n = gl(e, (e) => ll.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function gl(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var _l = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), cl.add(this), fl();
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
		return this.options.isBehind === void 0 ? rl(e) : this.options.isBehind(e);
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
function vl(e, t) {
	return e.isConnected && !T(e) && !(t && D(e));
}
var yl = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new _l({
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
			isBehind: (e) => rl(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || Zo() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : bl(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, Cl(t)) && !rl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = ls(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && vl(n.owner, this.closesWhenReadOnly) && !rl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !vl(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), wl(e), Tl(e, !0), Ol(this), e.focus !== void 0 && e.focus !== !1 && us(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && wl(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && vs(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), Tl(r, !1), Tc(r.popup), this.entries.size === 0 && kl(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (vl(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !xl() && Sl(e);
		}
	}
};
function bl(e) {
	return e instanceof Element && e.isConnected && ka(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function xl() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ka(e);
}
function Sl(e) {
	_s(e), M(e);
}
function Cl(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function wl(e) {
	e.anchor !== void 0 && e.placement !== void 0 && vc(e.anchor, e.popup, e.placement);
}
function Tl(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var El = /* @__PURE__ */ new Set(), Dl = null;
function Ol(e) {
	El.add(e), Dl === null && typeof MutationObserver == "function" && (Dl = new MutationObserver(() => {
		for (let e of [...El]) e.closeStranded();
	}), Dl.observe(document, {
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
function kl(e) {
	El.delete(e), !(El.size > 0 || Dl === null) && (Dl.disconnect(), Dl = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Al = "ui-flyout", jl = "ui-flyout--open", Ml = "ui-flyout__anchor", Nl = "data-ui-flyout-no-backdrop-close", Pl = "data-ui-flyout-no-escape-close", Fl = 4, Il = `${Al}--`, Ll = "bottom-start", Rl = class {
	root;
	flyouts = new yl({
		show: ({ owner: e }) => e.classList.add(jl),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Pl : Nl)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Al}`)) this.place(e);
		P(this.root, `.${Al}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${qn}`), n = e.querySelector(`:scope > .${Ml}`);
		if (t === null) return;
		let r = zl(n, t);
		if (!e.classList.contains(jl)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Vl(n) ?? e,
			placement: {
				placement: Hl(e),
				gap: Fl
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(jl) && (e.classList.remove(jl), Bl(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ml}`)?.closest(`.${Al}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(jl), this.place(t), this.flyouts.isOpen(t) && Bl(t, !0);
		}
	}
};
function zl(e, t) {
	if (e === null) return null;
	let n = e.querySelector(zo) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", sr(t, "ui-flyout-content")), n;
}
function Bl(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Vl(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Hl(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Il)) continue;
		let e = t.slice(Il.length);
		if (sc(e)) return e;
	}
	return Ll;
}
//#endregion
//#region src/interactions/file-drop.ts
var Ul = "data-ui-file-drop-over", Wl = 120, Gl = "refused", Kl = !1;
function ql(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Zl();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Jl(e, t, n), !0);
	e.root.addEventListener("dragend", () => ru(t.marked), !0), window.addEventListener("blur", () => ru(t.marked)), e.root.addEventListener("paste", (t) => Yl(e, t), !0);
}
function Jl(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && ru(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Ql(n), n.type !== "dragleave" && ru(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || nu(r, a) : t.leaving = window.setTimeout(() => ru(r), Wl);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = $l(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && nu(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Ul;
		r.set(a, o), a.setAttribute(o, t ? Gl : "");
		return;
	}
	ru(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => iu(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Yl(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => iu(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Xl(e, t, n) {
	for (let r = t.closest(`[${h}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${bn}="${ir(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Zl() {
	if (!Kl) {
		Kl = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Ql(e);
		});
	}
}
function Ql(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function $l(e, t) {
	let n = eu(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => tu(t, e)));
}
function eu(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function tu(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function nu(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function ru(e) {
	for (let t of [...e.keys()]) nu(e, t);
}
function iu(e, t) {
	let n = eu(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : tu(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var au = "/_ne/files/upload", ou = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], su = /* @__PURE__ */ new Map(), cu = !1;
function lu(e, t, n, r) {
	let i = Number(e.getAttribute(vn)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return su.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of su.keys()) e.isConnected || su.delete(e);
	return su.set(e, c), uu(e, c), fu(), a;
}
function uu(e, t) {
	let n = du(t.limit, w.language);
	t.validation.mark(e, "error", t.names === null ? {
		key: "ui.file.oversized",
		args: { limit: n }
	} : {
		key: "ui.file.leftout",
		args: {
			limit: n,
			names: t.names.join(", ")
		}
	});
}
function du(e, t) {
	let n = e, r = "byte";
	for (let e of ou) {
		if (n < 1024) break;
		n /= 1024, r = e;
	}
	let i = {
		style: "unit",
		unit: r,
		unitDisplay: r === "byte" ? "long" : "short",
		maximumFractionDigits: 1
	};
	try {
		return new Intl.NumberFormat(t.length > 0 ? t : void 0, i).format(n);
	} catch {
		return new Intl.NumberFormat(void 0, i).format(n);
	}
}
function fu() {
	cu || (cu = !0, w.onChange(() => {
		for (let [e, t] of su) e.isConnected ? uu(e, t) : su.delete(e);
	}));
}
function pu(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", au), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var mu = () => {};
function hu(e) {
	return {
		uploadAsync: (e, t) => pu(e, t ?? mu),
		accepts: iu,
		takeWithinSizeLimit: (t, n, r) => lu(t, n, r, e)
	};
}
function gu(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var _u = "ui-open-picker";
function vu(e) {
	return !e.dispatchEvent(new Event(_u, {
		bubbles: !0,
		cancelable: !0
	}));
}
function yu(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || D(n) || T(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var bu = "ui-file-input", xu = "ui-file-input__row", Su = "ui-file-input__native", Cu = "ui-file-input__field", wu = "ui-file-input__selection", Tu = "data-ui-file-dragging", Eu = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, w.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(_u, (e) => yu(e, {
			rootSelector: `.${bu}`,
			nativeSelector: `.${Su}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), ql({
			root: this.root,
			draggingAttribute: Tu,
			resolveTarget: (e) => {
				let t = e.closest(`.${xu}`)?.closest(`.${bu}`) ?? null, n = t === null ? Xl(this.root, e, `.${bu}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Su}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || D(r) || T(r)
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
		let t = e.target.closest(`[${yn}], .${xu}`);
		if (t === null || T(t) || D(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${bu}`)?.querySelector(`.${Su}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Su)) return;
		let t = e.target.closest(`.${bu}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Cu}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = lu(e, t, e.querySelector(`.${Su}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await pu(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => w.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Du(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => w.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		if (typeof t == "string") this.shownWords.delete(e);
		else {
			for (let e of this.shownWords.keys()) e.isConnected || this.shownWords.delete(e);
			this.shownWords.set(e, t);
		}
		e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		gu(e.querySelector(`.${wu}`), t);
	}
};
function Du(e) {
	return e.length === 1 ? e[0].name : () => w.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Ou = "ne-picture-as-pdf", ku = "ne-text-snippet", Au = "ne-description", ju = "ne-table-chart", Mu = "ne-slideshow", Nu = "ne-folder-zip", Pu = "ne-audio-file", Fu = "ne-video-file", Iu = "ne-image", Lu = "ne-code", Ru = "ne-draft", zu = new Map([
	...Uu(Ou, "pdf"),
	...Uu(ku, "txt", "md", "log"),
	...Uu(Au, "doc", "docx", "odt", "rtf"),
	...Uu(ju, "xls", "xlsx", "ods", "csv", "tsv"),
	...Uu(Mu, "ppt", "pptx", "odp", "key"),
	...Uu(Nu, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Uu(Pu, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Uu(Fu, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Uu(Iu, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Uu(Lu, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Bu = /* @__PURE__ */ new Map([
	["application/pdf", Ou],
	["text/csv", ju],
	["application/msword", Au],
	["application/rtf", Au],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Au],
	["application/vnd.oasis.opendocument.text", Au],
	["application/vnd.ms-excel", ju],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ju],
	["application/vnd.oasis.opendocument.spreadsheet", ju],
	["application/vnd.ms-powerpoint", Mu],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Mu],
	["application/vnd.oasis.opendocument.presentation", Mu],
	["application/zip", Nu],
	["application/x-zip-compressed", Nu],
	["application/x-7z-compressed", Nu],
	["application/vnd.rar", Nu],
	["application/x-rar-compressed", Nu],
	["application/x-tar", Nu],
	["application/gzip", Nu],
	["application/json", Lu],
	["application/xml", Lu],
	["text/xml", Lu],
	["text/html", Lu]
]), Vu = /* @__PURE__ */ new Map([
	["image", Iu],
	["audio", Pu],
	["video", Fu],
	["text", ku]
]);
function Hu(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : zu.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Bu.get(i) ?? (a < 0 ? void 0 : Vu.get(i.slice(0, a))) ?? Ru;
}
function Uu(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Wu = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Gu(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Wu.includes(t.slice(0, n).toLowerCase());
}
function Ku(e) {
	return Gu(e) ? String(e) : void 0;
}
var qu = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Ju(e) {
	let t = Qu(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || qu.some((e) => n.startsWith(e));
}
function Yu(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Xu(e);
}
function Xu(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Zu(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Qu(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function $u(e) {
	return ed(e) !== null;
}
function ed(e) {
	let t = Qu(e), n = t.toLowerCase();
	return Xu(t) || Zu(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function td(e) {
	return ed(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var nd = "mask:", rd = "ui-icon--image", id = "ui-icon--mask";
function ad(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(nd) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? ed(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function od(e) {
	let t = ad(e);
	return t === null ? "" : sd(t.source);
}
function sd(e) {
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
var cd = "ui-icon", ld = "data-ui-icon", ud = "--ui-icon-url";
function dd(e, t) {
	e.classList.add(cd);
	for (let t of Array.from(e.classList)) pd(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(ud);
	let n = md(t);
	if (n.length === 0) {
		e.removeAttribute(ld);
		return;
	}
	e.setAttribute(ld, ""), e.classList.add(n);
	let r = ad(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(ud, sd(r.source));
}
var fd = "ui-icon-glyph--";
function pd(e) {
	return e === rd || e === id || e.startsWith(fd);
}
function md(e) {
	let t = ad(e);
	return t === null ? hd(e) : t.tinted ? id : rd;
}
function hd(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = fd;
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
var gd = 1024, _d = 16777216;
function vd(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function yd(e, t) {
	let n = kd(t.zoom, 1, 4), r = Od(e) / n / 2;
	return {
		x: kd(t.x, r, e.width - r),
		y: kd(t.y, r, e.height - r),
		zoom: n
	};
}
function bd(e, t) {
	let n = Od(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function xd(e, t, n) {
	return t.zoom * n / Od(e);
}
function Sd(e, t, n, r, i) {
	let a = xd(e, t, n);
	return a > 0 ? yd(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function Cd(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = kd(t.zoom * r, 1, 4), o = xd(e, t, n), s = xd(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? yd(e, {
		...t,
		zoom: a
	}) : yd(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function wd(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Td(e, t) {
	return Math.min(1, t * 4 / Od(e), Math.sqrt(_d / (e.width * e.height)));
}
function Ed(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Dd(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Od(e) {
	return Math.min(e.width, e.height);
}
function kd(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Ad(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Xc, e.key), t.setAttribute(Zc, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(el, ""), t.setAttribute($c, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Qc, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? Kn : `${Kn} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var jd = class {
	partAttribute;
	constructor(e) {
		this.partAttribute = e;
	}
	element(e, t, n) {
		let r = document.createElement(e);
		return r.className = t, n !== void 0 && r.setAttribute(this.partAttribute, n), r;
	}
	button(e, t) {
		let n = this.element("button", `ui-button ${e}`, t);
		return n.type = "button", n;
	}
	actions(...e) {
		let t = this.element("div", "ui-dialog__actions");
		return t.append(...e), t;
	}
	find(e, t) {
		return e.querySelector(`[${this.partAttribute}="${t}"]`);
	}
	pressed(e) {
		return e.target instanceof Element ? e.target.closest(`[${this.partAttribute}]`)?.getAttribute(this.partAttribute) ?? null : null;
	}
}, Md = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), window.addEventListener("keydown", (e) => this.handleKeyDown(e), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		if (this.drag !== null) {
			this.takeSecondPointer(this.drag, e.target, e);
			return;
		}
		let t = this.options.resolveHandle(e.target);
		if (t === null || T(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(En, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
		let r = {
			x: e.clientX,
			y: e.clientY
		};
		this.drag = {
			handle: t,
			context: n,
			origin: this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(n)],
			originPoint: r,
			pointerId: e.pointerId,
			point: r,
			second: null
		};
	}
	takeSecondPointer(e, t, n) {
		if (!(this.options.pinch === void 0 || e.second !== null || n.pointerId === e.pointerId || !e.handle.contains(t))) {
			n.preventDefault();
			try {
				e.handle.setPointerCapture(n.pointerId);
			} catch {}
			e.second = {
				pointerId: n.pointerId,
				point: {
					x: n.clientX,
					y: n.clientY
				}
			};
		}
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || this.drag === null) return;
		let t = this.drag, n = {
			x: e.clientX,
			y: e.clientY
		};
		if (t.second !== null && (e.pointerId === t.pointerId || e.pointerId === t.second.pointerId)) {
			let r = t.point, i = t.second.point;
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Nd(r, i, t.point, t.second.point));
			return;
		}
		if (e.pointerId !== t.pointerId) return;
		let { context: r, origin: i } = t, a = this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(r)] - i;
		t.point = n, this.options.move(r, a, n);
	}
	handlePointerEnd(e) {
		if (!(e instanceof PointerEvent) || this.drag === null) return;
		let t = this.drag;
		if (t.second !== null && (e.pointerId === t.pointerId || e.pointerId === t.second.pointerId)) {
			e.pointerId === t.pointerId && (t.pointerId = t.second.pointerId, t.point = t.second.point), t.second = null, t.originPoint = t.point, t.origin = this.options.coordinate?.(t.context) === "clientY" ? t.point.y : t.point.x;
			return;
		}
		if (e.pointerId !== t.pointerId) return;
		let { handle: n, context: r } = t;
		this.drag = null, n.removeAttribute(En), this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(En);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		if (this.options.cancel !== void 0) {
			this.options.cancel(t, n);
			return;
		}
		this.options.move(n, 0, i), this.options.end(t, n);
	}
};
function Nd(e, t, n, r) {
	let i = Math.hypot(t.x - e.x, t.y - e.y), a = Math.hypot(r.x - n.x, r.y - n.y), o = {
		x: (n.x + r.x) / 2,
		y: (n.y + r.y) / 2
	};
	return {
		factor: i > 0 && a > 0 ? a / i : 1,
		center: o,
		shift: {
			x: o.x - (e.x + t.x) / 2,
			y: o.y - (e.y + t.y) / 2
		}
	};
}
var Pd = 100 / 3, Fd = 1, Id = 2;
function Ld(e, t = Pd) {
	let n = e.deltaMode === Fd ? Pd : e.deltaMode === Id ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Rd(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var zd = {
	notch: 100,
	pixels: Ld
}, Bd = "ui-image-crop", Vd = "ui-image-crop-title", Hd = new jd("data-ui-image-crop-part"), Ud = "data-ui-image-crop-frame", Wd = 10, Gd = 1.2, Kd = 380, qd = 100, Jd = .92, F = null, Yd = !1, Xd = null, Zd = !1;
async function Qd(e, t, n, r = df) {
	if (F !== null || Yd) return "cancelled";
	Yd = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Yd = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Xd ??= $d();
		let o = Xd;
		o.dialog.isConnected || document.body.append(o.dialog), F = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: vd(a),
			finish: (t) => {
				F = null, e.close(Bd), a.release(), i(t);
			}
		}, w.write(o.title, null, "ui.crop.title"), w.write(o.stage, "aria-label", "ui.crop.frame"), w.write(o.zoom, "aria-label", "ui.crop.zoom"), w.write(o.cancel, null, "ui.crop.cancel"), w.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Ud, n.frame), e.open(Bd), lf(o);
	});
}
function $d() {
	let { dialog: e, surface: t } = Ad({
		key: Bd,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Vd,
		closesOnEscapeAndBackdrop: !1
	}), n = Hd.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Vd;
	let r = Hd.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Hd.element("canvas", "ui-image-crop__canvas"), a = Hd.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Hd.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Hd.button("ui-button--outline", "cancel"), c = Hd.button("ui-button--primary", "apply");
	t.append(n, r, o, Hd.actions(s, c));
	let l = {
		dialog: e,
		title: n,
		stage: r,
		canvas: i,
		frame: a,
		zoom: o,
		cancel: s,
		apply: c
	};
	return e.addEventListener("click", (e) => {
		let t = Hd.pressed(e);
		t === "cancel" ? F?.finish("cancelled") : t === "apply" && ef();
	}), e.addEventListener("keydown", (e) => tf(l, e)), o.addEventListener("input", () => sf(l, Number(o.value))), r.addEventListener("wheel", (e) => nf(l, e), { passive: !1 }), window.addEventListener("resize", () => uf(l)), new Md({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => F === null ? null : {
			last: t,
			start: F.view
		},
		move: (e, t, n) => {
			e.last !== null && rf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			F !== null && (F.view = t.start, lf(l));
		},
		pinch: (e, t) => {
			e.last = null, af(l, t);
		}
	}), l;
}
async function ef() {
	let e = F;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = bd(n, a), s = Ed(t.type), c = i.encodeAsync(n, o, wd(o, r.size), s);
	F = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Dd(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function tf(e, t) {
	if (t.defaultPrevented || t.isComposing || F === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), F.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Wd;
	switch (t.key) {
		case "ArrowLeft":
			rf(e, -n, 0);
			break;
		case "ArrowRight":
			rf(e, n, 0);
			break;
		case "ArrowUp":
			rf(e, 0, -n);
			break;
		case "ArrowDown":
			rf(e, 0, n);
			break;
		case "+":
		case "=":
			of(e, Gd);
			break;
		case "-":
		case "_":
			of(e, 1 / Gd);
			break;
		case "Enter":
			ef();
			break;
		default: return;
	}
	t.preventDefault();
}
function nf(e, t) {
	if (F === null) return;
	t.preventDefault();
	let n = Ld(t, e.stage.clientHeight), r = t.ctrlKey ? qd : Kd;
	of(e, 2 ** (-n.y / r), cf(e, t.clientX, t.clientY));
}
function rf(e, t, n) {
	F !== null && (F.view = Sd(F.source, F.view, e.frame.clientWidth, t, n), lf(e));
}
function af(e, t) {
	if (F === null) return;
	let n = Sd(F.source, F.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	F.view = Cd(F.source, n, e.frame.clientWidth, t.factor, cf(e, t.center.x, t.center.y)), lf(e);
}
function of(e, t, n) {
	F !== null && (F.view = Cd(F.source, F.view, e.frame.clientWidth, t, n), lf(e));
}
function sf(e, t) {
	F !== null && Number.isFinite(t) && t > 0 && of(e, t / F.view.zoom);
}
function cf(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function lf(e) {
	if (F === null) return;
	let t = F.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), uf(e);
}
function uf(e) {
	Zd || F === null || (Zd = !0, requestAnimationFrame(() => {
		if (Zd = !1, F === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = F.view, a = xd(F.source, i, t);
		F.imaging.paint(e.canvas, F.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: F.source.width * a,
			height: F.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var df = {
	decodeAsync: async (e, t) => {
		let n = await ff(e);
		if (n === null) return null;
		let r = n, i = Td(r, t);
		if (i < 1) try {
			let e = await createImageBitmap(r, {
				resizeWidth: Math.max(1, Math.round(r.width * i)),
				resizeHeight: Math.max(1, Math.round(r.height * i)),
				resizeQuality: "high"
			});
			r.close(), r = e;
		} catch {}
		return {
			width: r.width,
			height: r.height,
			image: r,
			release: () => r.close()
		};
	},
	paint: (e, t, n) => {
		let r = window.devicePixelRatio || 1, i = Math.max(1, Math.round(n.stageWidth * r)), a = Math.max(1, Math.round(n.stageHeight * r));
		e.width !== i && (e.width = i), e.height !== a && (e.height = a);
		let o = e.getContext("2d");
		o !== null && (o.clearRect(0, 0, i, a), o.imageSmoothingQuality = "high", o.drawImage(t.image, n.left * r, n.top * r, n.width * r, n.height * r));
	},
	encodeAsync: (e, t, n, r) => new Promise((i) => {
		let a = document.createElement("canvas");
		a.width = n, a.height = n;
		let o = a.getContext("2d");
		if (o === null) {
			i(null);
			return;
		}
		o.imageSmoothingQuality = "high", o.drawImage(e.image, t.x, t.y, t.side, t.side, 0, 0, n, n), a.toBlob((e) => {
			a.width = 0, a.height = 0, i(e);
		}, r, Jd);
	})
};
async function ff(e) {
	try {
		return await createImageBitmap(e, { imageOrientation: "from-image" });
	} catch {}
	let t = URL.createObjectURL(e);
	try {
		let e = new Image();
		return e.src = t, await e.decode(), e.naturalWidth > 0 && e.naturalHeight > 0 ? await createImageBitmap(e) : null;
	} catch {
		return null;
	} finally {
		URL.revokeObjectURL(t);
	}
}
//#endregion
//#region src/interactions/image-input-engine.ts
var pf = "ui-image-input", mf = "ui-image-input--multiple", hf = "ui-image-input__surface", gf = "ui-image-input__native", _f = "ui-image-input__picture", vf = "ui-image-input__text", yf = "ui-image-input__selection", bf = "ui-image-input__selections", xf = "ui-image-input__tiles", Sf = "ui-image-input__tile", Cf = "ui-image-input__remove", wf = "ui-image-input__progress", Tf = "ui-image-input__tile--file", Ef = "ui-image-input__file-glyph", Df = "ui-image-input__file-name", Of = "SelectionId", kf = "--ui-image-progress", Af = "data-ui-image-preview", jf = "data-ui-image-dragging", Mf = class {
	root;
	validation;
	dialogs;
	cropImaging;
	cropping = /* @__PURE__ */ new WeakSet();
	unreadable = /* @__PURE__ */ new WeakSet();
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${pf}`)), P(this.root, `.${pf}`, {
			childList: !0,
			attributeFilter: [
				_n,
				Be,
				Nn
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Of && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Hr(e.components, `.${pf}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(_u, (e) => yu(e, {
			rootSelector: `.${pf}`,
			nativeSelector: `.${gf}`,
			pressed: (e) => e.querySelector(`.${hf}`)
		})), this.root.addEventListener(qa, (e) => this.handleDraftDropped(e)), ql({
			root: this.root,
			draggingAttribute: jf,
			resolveTarget: (e) => {
				let t = e.closest(`.${hf}`), n = t?.closest(`.${pf}`) ?? null, r = n === null ? Xl(this.root, e, `.${pf}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${hf}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${gf}`)?.getAttribute("accept") ?? "",
					multiple: Nf(i),
					refused: D(i) || T(a)
				};
			},
			onFiles: (e, t) => void (Nf(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Nf(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${_f}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Rf(e, e.getAttribute("data-ui-image-caption") ?? Vf(n)), Bf(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Nn);
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
	clearAll(e) {
		for (let t of e) Nf(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${yn}]`), n = t?.closest(`.${pf}`) ?? null;
		t === null || n === null || D(n) || T(t) || n.querySelector(`.${gf}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cf}`), n = t?.closest(`.${pf}`) ?? null;
		if (t === null || n === null || D(n) || T(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(gf)) return;
		let t = e.target.closest(`.${pf}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Nf(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${pf}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), gu(t.querySelector(`.${yf}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${hf}`), r = e.querySelector(`.${_f}`), i = e.querySelector(`.${yf}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || lu(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Af, ""), r.setAttribute("src", o.url), Rf(e, a.name), Bf(e, !0), n.classList.add(Un);
		try {
			let t = await pu([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, gu(i, t.selectionId));
		} catch (t) {
			zf(e), gu(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(Un);
		}
	}
	async cropAsync(e, t) {
		let n = Pf(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Qd(this.dialogs, t, {
				frame: n,
				size: Ff(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${xf}`), r = lu(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = If(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await pu([t], (e) => r.element.style.setProperty(kf, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Un), this.publishShelf(e);
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
		let t = e.querySelector(`.${bf}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Nn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Af), t || Rf(e, ""));
	}
};
function Nf(e) {
	return e.classList.contains(mf);
}
function Pf(e) {
	let t = e.getAttribute(Ve);
	return t === "square" || t === "circle" ? t : null;
}
function Ff(e) {
	let t = Number(e.getAttribute(He));
	return Number.isInteger(t) && t > 0 ? t : gd;
}
function If(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${Sf} ${Un}`, n.type = "button", n.className = Cf, r.className = wf, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, w.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Lf(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Lf(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Lf(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(Tf), e.setAttribute("title", n.name), r.className = Ef, r.setAttribute("aria-hidden", "true"), dd(r, Hu(n.name, n.type)), i.className = Df, i.textContent = n.name, w.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function Rf(e, t) {
	let n = e.querySelector(`.${vf}`);
	n !== null && (xa(n, null), n.textContent !== t && (n.textContent = t));
}
function zf(e) {
	let t = e.querySelector(`.${vf}`);
	t !== null && w.write(t, null, "ui.file.failed");
}
function Bf(e, t) {
	let n = e.querySelector(`.${hf}`);
	n !== null && w.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Vf(e) {
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
var Hf = "ui-key-value-action__row", Uf = "ui-key-value-action__value", Wf = "ui-key-value-action__value-input", Gf = "ui-key-value-action__edit-action", Kf = "ui-text__title", qf = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Hf}`), !1), P(this.root, `.${Hf}`, {
			childList: !0,
			attributeFilter: [gn]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? this.open(n, t) : this.close(n);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${Wf} [${Le}]`)) {
			if (Ka(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ja(e);
	}
	open(e, t) {
		let n = e.querySelector(`.${Wf} :is(input, textarea, select)`);
		if (n !== null) {
			if (Ka(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = e.querySelector(`.${Uf} .${Kf}`)?.textContent?.trim() ?? "";
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Ga(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Yf(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Gf)) return;
		let { cell: n, row: r } = t, i = e.target.closest(Yn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Gf} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !T(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function Jf(e) {
	return Yf(e) !== null;
}
function Yf(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Wf}, .${Gf}`), n = t?.closest(`.${Hf}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Xf = `.ui-button[${tt}="pressed"]`, Zf = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Xf);
		t === null || T(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Qf = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Xn}, .ui-field-box`, $f = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", ep = `${$f}, ${Qf}, ${Yn}, .${ge}`, tp = "button, a, summary, [role='button']";
function np(e) {
	let t = [];
	for (let n of e.querySelectorAll(ep)) if (!(n.classList.contains("ui-row__grip") || !rp(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(tp) ? n : null;
}
function rp(e, t) {
	let n = t.closest(Yn);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function ip(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ep);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var ap = `${$f}, [tabindex], [contenteditable], ${Yn}, [${ze}]`, op = ":scope > input.ui-field, :scope > textarea.ui-field", sp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Qf);
		if (t === null || e.target !== t && e.target.closest(ap) !== null) return;
		let n = t.querySelector(op);
		if (!Ka(n) || n.readOnly || T(n) || D(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function I(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var cp = "data-ui-submit-on-enter", lp = "data-ui-runs-on-enter", up = "enter", dp = 229, fp = {
	name: up,
	registration: { settlesValue: !0 }
}, pp = class {
	root;
	committedValue = "";
	changes = 0;
	edited = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.committedValue = e.target.value);
		}), this.root.addEventListener("input", (e) => {
			e.target !== null && this.edited.add(e.target);
		}, !0), this.root.addEventListener("change", (e) => {
			this.changes++, e.target !== null && this.edited.delete(e.target), e.target instanceof HTMLTextAreaElement && (this.committedValue = e.target.value);
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || mp(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : hp(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : gp(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (Ga(t)) {
			if (e.preventDefault(), hp(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || T(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(up, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(gt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Bn}="${ir(t)}"]`);
		n !== null && !T(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = ls(e);
		e.blur(), this.changes === t && this.commit(e), this.keepKeyboard(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = Oo(e);
		r?.root === t && r.row !== null && No(t, I(t, ro, k), r.row), M(t);
	}
};
function mp(e) {
	return e.isComposing || e.keyCode === dp;
}
function hp(e, t) {
	return _p(t) && e.hasAttribute(lp);
}
function gp(e, t) {
	return _p(t) && e.hasAttribute(cp) && !e.readOnly && !T(e);
}
function _p(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var vp = "data-ui-fallback-src", yp = `img[${vp}]`, bp = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(yp)) (xp(e) || e.complete && e.naturalWidth === 0) && Sp(e);
		P(this.root, yp, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && xp(t) && Sp(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Sp(t);
	}
};
function xp(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Sp(e) {
	let t = e.getAttribute(vp);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Cp = "data-ui-radio-value", wp = "ui-radio-group__input", Tp = "ui-radio-group__dot", Ep = "ui-radio-group", Dp = "ui-radio-group__item", Op = "data-ui-radio-group-name", kp = "data-ui-radio-bind-value-id", Ap = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Ep}`)]);
		for (let e of this.root.querySelectorAll(`.${Ep}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Ep}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(jp));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Cp, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Ep}`)) {
			let n = e.getAttribute(Op);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Op), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Op, a);
			for (let e of I(r, `.${wp}`, `.${Ep}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Ep}`)) n.has(e.getAttribute(Op) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Cp);
		for (let n of I(e, `.${wp}`, `.${Ep}`)) {
			n.checked = n.value === t;
			let e = Mp(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Dp) ? [e] : [...e.querySelectorAll(`.${Dp}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${wp}`) !== null) return;
		let t = e.closest(`.${Ep}`), n = t?.getAttribute(Op);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = wp, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(kp);
		a !== null && r.setAttribute(Le, a);
		let o = document.createElement("span");
		o.className = Tp, e.prepend(r, o), this.sync(t);
	}
};
function jp(e) {
	return e.classList.contains(Ep) ? [e] : [...e.querySelectorAll(`.${Ep}`)];
}
function Mp(e) {
	let t = e.closest(`.${Dp}`);
	return t !== null && E(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Np(e) {
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
function Pp(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Fp(e, t) {
	return t !== null && e.length >= t;
}
function Ip(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Fp(e, n) ? null : [...e, t];
}
function Lp(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var Rp = /\p{M}/gu;
function zp(e, t) {
	return Bp(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Bp(e, t) {
	return Up(e, Hp(t));
}
function Vp(e, t) {
	return t.every((t) => e.includes(t));
}
function Hp(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Up(e, t) {
	let n = e.normalize("NFD").replace(Rp, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Wp = "data-ui-search-debounce", Gp = "data-ui-search-min-length", Kp = "data-ui-search-manual", qp = "data-ui-search-answered", Jp = "ui-search__input", Yp = "ui-select__list", Xp = "ui-select__option", Zp = "ui-text__title", Qp = 300, $p = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Jp) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		em(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Wp), i = r === null ? Qp : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Qp));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Jp)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute(Kp)) return;
		let n = e.getAttribute(Gp), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function em(e) {
	if (e.hasAttribute(qp)) return;
	let t = e.closest(`.${er}`), n = t?.querySelector(`.${Yp}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Gp), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? zp(e.value, e) : [], o = nm(n, (e) => a.length === 0 || Vp(Bp(tm(e), e), a));
	am(t, n, a.length > 0 && o === 0);
}
function tm(e) {
	return e.querySelector(`.${Zp}`)?.textContent ?? e.textContent ?? "";
}
function nm(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && rm(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Xp)) continue;
		let e = t(a);
		rm(a, e), r ||= e, e && i++;
	}
	return n !== null && rm(n, r), i;
}
function rm(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function im(e) {
	let t = e.querySelector(`.${Yp}`);
	t !== null && am(e, t, nm(t, (e) => e.style.display !== "none") === 0);
}
function am(e, t, n) {
	let r = t.querySelector(`:scope > [${Xe}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Je}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Xe, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var om = 500, sm = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > om) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Bp(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Bp(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function cm(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var lm = "data-ui-select-value", um = "data-ui-select-placement", dm = "ui-select--open", fm = "ui-select__trigger-content", pm = "data-ui-select-content", mm = "ui-select__placeholder", hm = "ui-input__affix-icon--prefix", gm = "ui-select__popup", _m = "ui-select__list", vm = "ui-select__option", ym = "ui-select__value-input", bm = "data-ui-select-clear", xm = "ui-search", Sm = "ui-search__input", Cm = "ui-text__title", wm = "data-ui-active", Tm = "ui-multi-select", Em = "ui-multi-select__chips", Dm = "ui-multi-select__chip", Om = "ui-multi-select__chip-label", km = "ui-multi-select__chip-remove", Am = "data-ui-select-chip", jm = "data-ui-select-max", Mm = 4, Nm = [
	lm,
	Nn,
	jm,
	"class",
	g
];
function Pm(e) {
	return e === null || D(e) || T(e);
}
function Fm(e) {
	return e.classList.contains(Tm);
}
function Im(e) {
	return e.classList.contains(xm);
}
function Lm(e) {
	return Im(e) ? e.querySelector(`.${Sm}`) : null;
}
function Rm(e) {
	return I(e, `.${gm} .${vm}`, `.${er}`);
}
function zm(e) {
	return e === null ? null : e.querySelector(`.${Cm}`)?.textContent ?? e.textContent;
}
function Bm(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(h), t.removeAttribute(g), t.removeAttribute(ce), t.removeAttribute(se);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Vm = class {
	root;
	popups = new yl({
		show: ({ owner: e }) => e.classList.add(dm),
		hide: ({ owner: e }) => {
			e.classList.remove(dm), this.markActive(e, null);
			let t = e.querySelector(`.${gm}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new sm();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${er}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Jm(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Nm,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${bm}], .${km}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Fm(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(lm);
		this.decorateOptions(e);
		let n = t === null ? null : Rm(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${mm}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Rm(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${ym}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), im(e);
	}
	syncMultiple(e) {
		let t = Np(e.getAttribute(Nn)), n = new Set(t), r = Fp(t, Pp(e.getAttribute(jm)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Rm(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		Km(e, o.map((e) => ({
			key: e,
			label: Gm(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${mm}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${ym}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(Nn, l), im(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Xn}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${fm}`), a = i?.getAttribute(pm) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(pm), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Im(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(g);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = fm;
			let e = r.querySelector(`:scope > .${hm}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Bm(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Rm(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = E(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${vm}`);
		t === null || n === null || n.hasAttribute(wm) || E(n) || T(n) || n.closest(".ui-select") !== t || (Im(t) || (O(Rm(t).filter((e) => !E(e)), n), es(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${km}`);
		if (t !== null) {
			let n = t.closest(`.${er}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Pm(n) || this.removeChosen(n, t.closest(`.${Dm}`)?.getAttribute(Am) ?? null));
			return;
		}
		let n = e.target.closest(`[${bm}]`);
		if (n !== null) {
			let t = n.closest(`.${er}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Pm(t) || (this.clearValue(t), Hm(t)));
			return;
		}
		let r = e.target.closest(`.${Xn}`);
		if (r !== null) {
			let t = r.closest(`.${er}`);
			if (Pm(t)) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${vm}`);
		if (i === null) return;
		let a = i.closest(`.${er}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveCurrent(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vm}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${er}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Pm(t)) return !1;
		e.preventDefault();
		let n = Lm(t);
		n !== null && em(n);
		let r = Rm(t).filter((e) => Um(e) && !E(e) && !T(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = cm(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(vm))) return !1;
		let r = n.closest(`.${er}`), i = r !== null && r === this.openSelect;
		if (r === null || Pm(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Lm(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Rm(r).filter((e) => !E(e) && !T(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(wm)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => zm(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (O(Rm(r).filter((e) => !E(e)), c), Wm(r, c), M(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Fm(t) || Pm(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${Em} > .${Dm}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Am)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Sm) || !t.contains(e.target) ? null : Rm(t).find((e) => e.hasAttribute(wm) && !E(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Lm(e);
		r !== null && !t && em(r), im(e);
		let i = e.querySelector(`.${Xn}`), a = e.querySelector(`.${gm}`), o = e.querySelector(`.${_m}`) ?? a, s = e.getAttribute(um);
		if (i === null || a === null || o === null) return;
		let c = sr(o, "ui-select-list");
		if (i.setAttribute("aria-controls", c), r?.setAttribute("aria-controls", c), this.popups.open({
			owner: e,
			popup: a,
			anchor: i,
			placement: {
				placement: s !== null && sc(s) ? s : "bottom-start",
				gap: Mm,
				minAnchorWidth: !0
			},
			openers: r === null ? [i] : [i, r],
			returnFocus: () => i
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			this.initializeSearch(e, r, n, t), Ym(a);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Rm(e).filter((e) => !E(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Zo()) {
			O(n, null), this.markActive(e, null), Hm(e);
			return;
		}
		let i = r ?? n[0];
		O(n, i), this.markActive(e, i, Zo()), Wm(e, i), M(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Rm(e), a = i.filter((e) => Um(e) && !E(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Zo() ? null : a[0] ?? null);
		O(i, null), this.markActive(e, o, Zo()), o !== null && Wm(e, o), !Qo() && (M(t), t.select());
	}
	moveCurrent(e, t) {
		let n = Rm(e).filter((e) => !E(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(wm)) ?? null, i = Ya({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Im(e) ? Wm(e, i) : (O(n, i), i.focus()), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of Rm(e)) r === t ? r.setAttribute(wm, "") : r.hasAttribute(wm) && r.removeAttribute(wm), $o(r, r === t && n);
		let r = Lm(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", sr(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || E(t) || Pm(e)) return;
		if (Fm(e)) {
			let r = Ip(Np(e.getAttribute(Nn)), n, Pp(e.getAttribute(jm)));
			this.markActive(e, t, Zo()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(lm) === n) {
			this.close();
			return;
		}
		e.setAttribute(lm, n), this.sync(e);
		let r = e.querySelector(`.${ym}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Lp(Np(e.getAttribute(Nn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Dm}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${Xn}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Nn) : e.setAttribute(Nn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${ym}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Fm(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(lm)) return;
		e.removeAttribute(lm), this.sync(e);
		let t = e.querySelector(`.${ym}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Hm(e) {
	let t = e.querySelector(`.${Xn}`);
	t !== null && !t.contains(document.activeElement) && M(t);
}
function Um(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function Wm(e, t) {
	let n = e.querySelector(`.${_m}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function Gm(e, t) {
	let n = zm(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Km(e, t) {
	let n = e.querySelector(`.${Em}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Dm}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Am) === t[n].key && e.querySelector(`.${Om}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => qm(e.key, e.label)));
	}
}
function qm(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Dm, n.setAttribute(Am, e), r.className = Om, r.textContent = t, i.className = km, i.type = "button", i.tabIndex = -1, w.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Jm(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${er}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === lm || e.attributeName === "data-ui-selected-keys" || e.attributeName === jm)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${gm}`)?.closest(`.${er}`);
	n != null && t.add(n);
}
function Ym(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Xm = "data-ui-input-debounce", Zm = `input[${Xm}], textarea[${Xm}]`;
function Qm(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Zm);
}
var $m = /* @__PURE__ */ new Set();
function eh() {
	for (let e of $m) if (e.waiting) return !0;
	return !1;
}
function th() {
	for (let e of $m) e.commitAll();
}
var nh = class {
	root;
	timers = /* @__PURE__ */ new Map();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), $m.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!Qm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Xm));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Qm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, rh = "textarea.ui-text-area__field", ih = "data-ui-text-area-grow";
function ah() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var oh = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(rh) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(rh)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Hr(e.components, rh));
		}), P(this.root, rh, {
			childList: !0,
			attributeFilter: [ih]
		}, (e) => {
			this.fitAll(Hr(e, rh));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(ih)) {
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
}, sh = "ui-slider__input", ch = "ui-slider__value", lh = "ui-slider__bubble", uh = "ui-slider__track", dh = "ui-slider__thumb-anchor", fh = "ui-slider", ph = "ui-orientation--vertical", mh = "--ui-slider-fraction", hh = 6, gh = "Value", _h = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), vh = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!_h.has(e.propertyName)) return;
			let t = S(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${sh}`);
				t !== null && (this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === gh && this.reportClamped(t, e.value));
			}
		});
	}
	notePress(e) {
		let t = yh(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = yh(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = yh(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || bh(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(sh)) return;
		let t = e.target;
		if (this.cancelled.delete(t), bh(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	placeBubble(e) {
		let t = xh(e);
		t !== null && vc(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: hh
		});
	}
	releaseBubble(e) {
		Tc(xh(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${uh}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${ch}, .${lh}`) ?? []) n.textContent = e.value;
		e.closest(`.${uh}`)?.style.setProperty(mh, String(Sh(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function yh(e) {
	return e instanceof HTMLInputElement && e.classList.contains(sh) ? e : null;
}
function bh(e) {
	return D(e) || T(e);
}
function xh(e) {
	if (!(e instanceof Element) || !e.classList.contains(sh)) return null;
	let t = e.closest(`.${uh}`), n = t?.querySelector(`.${lh}`) ?? null, r = t?.querySelector(`.${dh}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${fh}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(ph)
	};
}
function Sh(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Ch = {
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
}, wh = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Th = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Eh = [
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
], Dh = [
	"n %",
	"n%",
	"%n",
	"% n"
], Oh = [
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
], kh = /[1-9]/;
function Ah(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Ch;
	try {
		return {
			...Ch,
			...JSON.parse(t)
		};
	} catch {
		return Ch;
	}
}
function jh(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Nh(t);
	if (r === null) return Ph(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = Fh(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return Mh(e, t) ? Bh(wh[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = Fh(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return Mh(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = Ih(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return Mh(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = Fh(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Bh(Mh(e, t) ? Eh[n.currencyNegativePattern] ?? "-$n" : Th[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = Fh(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Bh(Mh(e, t) ? Oh[n.percentNegativePattern] ?? "-n %" : Dh[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return Ph(e, n);
	}
}
function Mh(e, t) {
	return e < 0 && kh.test(t);
}
function Nh(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function Ph(e, t) {
	let { integer: n, fraction: r } = Lh(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function Fh(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = Ih(e, t, n);
	return n === 0 ? zh(o, r, i) : `${zh(o, r, i)}${a}${s}`;
}
function Ih(e, t, n) {
	let { integer: r, fraction: i } = Lh(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? Rh(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function Lh(e, t) {
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
function Rh(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function zh(e, t, n) {
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
function Bh(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var Vh = {
	readCulture: Ah,
	format: jh
}, Hh = /^-?(\d+(\.\d*)?|\.\d+)$/;
function Uh(e, t, n) {
	if (!Hh.test(e)) return e;
	let r = n.thousands ? t : Yh(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return jh(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return jh(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function Wh(e, t, n) {
	return Hh.test(e) ? (Jh(n) ? Xh(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Gh(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Jh(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!Hh.test(d)) return null;
	let f = a ? Xh(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Kh(e, t, n, r, i) {
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
function qh(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Jh(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Yh(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Xh(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Zh = "ui-number-input", Qh = "ui-number-input__field", $h = "data-ui-number-no-decimals", eg = "data-ui-number-no-negative", tg = "data-ui-number-no-thousands", ng = "data-ui-number-trim-zeros", rg = "data-ui-number-step", ig = "data-ui-number-min", ag = "data-ui-number-max", og = "data-ui-number-step-direction", sg = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Qh}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Hr(e.components, `.${Qh}`));
		}), w.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Qh}`)));
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
		let t = cg(e);
		if (t !== null) return this.keptValue(t) ?? lg(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(ng) ? qh(t) : t, r = Ah(e), i = e === document.activeElement ? Wh(n, r, ug(e)) : Uh(n, r, {
			format: ug(e),
			thousands: !e.hasAttribute(tg)
		});
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = cg(e.target);
		if (t === null) return;
		let n = !t.hasAttribute($h), r = !t.hasAttribute(eg), i = t.selectionStart ?? t.value.length, a = Kh(t.value, i, Ah(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = cg(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = cg(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : lg(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(ng) && !D(t) && !T(t)) {
			let e = this.values.get(t) ?? "", n = qh(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = cg(e.target);
		if (t === null) return;
		let n = lg(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = cg(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = Wh(t, Ah(e), ug(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + og + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Qh}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(og) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = cg(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(rg) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : lg(e) ?? "0") || 0) + n * t, i = e.getAttribute(ig), a = e.getAttribute(ag);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, dg(r)), this.show(e);
	}
};
function cg(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Qh) ? e : null;
}
function lg(e) {
	return Gh(e.value, Ah(e), ug(e));
}
function ug(e) {
	return e.closest(`.${Zh}`)?.getAttribute("data-ui-number-format") ?? null;
}
function dg(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var fg = `:scope > [${Xe}], :scope > [${Ze}], :scope > [${ct}]`;
function L(e) {
	let t = new Set(e.querySelectorAll(fg));
	return [...e.children].filter((e) => !t.has(e));
}
function pg(e) {
	return e === null ? [] : [e];
}
function mg(e) {
	return e.querySelector(`:scope > [${Xe}]`);
}
function hg(e, t, n, r, i) {
	i ??= L(e).some((e) => !e.classList.contains(Gn));
	let a = mg(e);
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
	c.setAttribute(Xe, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var gg = { ok: !1 };
function _g(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => dr(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return gg;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return gg;
			let t = a[l];
			if (l++, dr(t.kind) === "Dynamic") {
				let n = xg(e, t.componentId);
				if (!n.ok) return gg;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return gg;
				let e = Dg(o, t.value);
				if (!e.ok) return gg;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return gg;
		if (c) {
			let e = Cg(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? gg : {
		ok: !0,
		value: o,
		scope: s
	};
}
function vg(e, t, n) {
	for (let r of t ?? []) {
		if (dr(r.kind) !== "Dynamic") continue;
		let t = S(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function yg(e) {
	let t = Cg(e, "IsContent");
	return t.ok && t.value === !0;
}
var bg = /* @__PURE__ */ new Set();
function xg(e, t) {
	let n = S(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return bg.has(n) || (bg.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), gg;
}
function Sg(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Cg(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Cg(e, t) {
	if (e == null) return gg;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return gg;
	let n = e, r = wg(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : gg;
}
function wg(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Tg(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Tg(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Eg(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => dr(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, dr(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = S(e.componentId);
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
function Dg(e, t) {
	if (e == null || t == null) return gg;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : gg;
	if (typeof t != "string") return gg;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (kg(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return gg;
}
function Og(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (kg(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function kg(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Ag(e) {
	let t = e.closest(b)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function jg(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Ag(e);
	if (a === void 0 && o === null) {
		for (let t of L(e)) t.classList.remove(Gn);
		return;
	}
	for (let n of L(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Gn);
			continue;
		}
		n.classList.toggle(Gn, !Mg(a, e, i, o));
	}
}
function Mg(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Lg(e, t, n)) && (r?.filters ?? []).every((e) => qs(Sg(t, e.itemProperty), e.operator, e.value));
}
function Ng(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Rg(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Pg(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Rg(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Fg(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Ig(n.getItemValue(e), n.getItemValue(r), t));
}
function Ig(e, t, n) {
	for (let r of n) {
		let n = zg(Js(Sg(e, r.itemProperty)), Js(Sg(t, r.itemProperty)));
		if (n !== 0) return gr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Lg(e, t, n) {
	if (!Rg(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return qs(Sg(t, e.itemProperty), e.operator, r);
}
function Rg(e, t, n, r) {
	return e == null || qs(r.get(e, []), t, n);
}
function zg(e, t) {
	if (e === t) return 0;
	let n = Vg(e), r = Vg(t);
	if (n !== r) return n - r;
	if (n === Bg.Nothing) return 0;
	if (n === Bg.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Bg = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Vg(e) {
	return e == null ? Bg.Nothing : typeof e == "number" ? Number.isNaN(e) ? Bg.Nothing : Bg.Number : typeof e == "string" && e.trim().length === 0 ? Bg.Nothing : Number.isNaN(Number(e)) ? Bg.Text : Bg.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function Hg(e) {
	switch (e.getAttribute(rt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function Ug(e) {
	let t = Hg(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/items/items-source-order.ts
var Wg = /* @__PURE__ */ new WeakMap();
function Gg(e, t) {
	let n = Wg.get(e), r = n === void 0 ? [...t] : Kg(n, t);
	return Wg.set(e, r), r;
}
function Kg(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function qg(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Jg(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Yg(e, t, n) {
	return Jg(e, t), qg(e, t, n);
}
function Xg(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Zg(e) {
	Wg.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function Qg(e, t, n, r, i, a = []) {
	$g(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function $g(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var e_ = ".ui-items-view, .ui-table", t_ = ".ui-items-view__item, .ui-table__row", n_ = "ui-row--dragging", r_ = "--ui-row-drop-offset", i_ = "move";
function a_(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return {
		name: i_,
		registration: {
			dynamicParameters: (e) => {
				let t = o_(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			started: (n) => {
				let r = o_(n.domEvent), i = r === null || !(n.domEvent.target instanceof Element) ? null : n.domEvent.target.closest(t_), a = i?.parentElement ?? null;
				if (e === void 0 || r === null || i === null || a === null || !a.hasAttribute("data-ui-items-host")) return;
				let o = e.ahead(a, j(i), r);
				o !== null && t.set(n.domEvent, o);
			},
			completed: (n) => {
				let r = t.get(n.domEvent);
				r !== void 0 && e?.settle(r);
			}
		}
	};
}
function o_(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
var s_ = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t === null ? null : A(t.row);
		if (t === null || n === null) return;
		let r = l_(t.root, t.row);
		if (r === null ? !u_(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (No(t.root, g_(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(ro), n = t?.parentElement ?? null, r = n?.closest(k) ?? null;
		return t === null || n === null || r === null || !t.matches(t_) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || T(r) || t.hasAttribute("data-ui-undraggable") || E(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = Wr(e);
		return this.services === void 0 || n === null ? !1 : Pg(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, Ag(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : A(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, Qg(e, t.root, r, n_, j(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = f_(t), r = g_(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? __(t.root, null) : __(t.root, i, m_(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(ro);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(ro) ?? null;
		if (a ??= h_(i, n), a === null) return null;
		let o = (A(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && p_(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (d_(t) !== d_(e.row)) return null;
		let r = c_(this.orderOf(e.host), j(e.row), j(t), n);
		return r === null ? null : r + Ug(e.host);
	}
	orderOf(e) {
		switch (Hg(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? L(e).map(j)];
			case "windowed": return L(e).map(j);
			default: return Gg(e, L(e)).map(j);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && __(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, f_(t), g_(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Lo(t.row, i_, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && ($g(e.root, n_), __(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = Oo(e.target);
		if (t === null || !t.root.matches(e_) || t.row !== null && ip(e.target, t.row) !== null) return;
		let n = So(t.root), r = n === null ? [] : g_(n), i = Ao(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && Lo(i, i_, { index: c });
	}
};
function c_(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function l_(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ge}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function u_(e, t) {
	return ip(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function d_(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function f_(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function p_(e, t, n) {
	if (d_(e) !== d_(t)) return !1;
	if (!n.across) return !0;
	let r = (A(e) ?? e).getBoundingClientRect(), i = (A(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function m_(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !p_(t.anchor, r, n)) return -1;
	let i = (A(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (A(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function h_(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (A(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function g_(e) {
	return L(e).filter((e) => e instanceof HTMLElement && e.matches(t_) && A(e) !== null);
}
function __(e, t, n = 0) {
	let r = t === null ? null : A(t.anchor);
	for (let t of e.querySelectorAll(`[${_e}]`)) t !== r && (t.removeAttribute(_e), t.style.removeProperty(r_));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(_e, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(r_) !== i && r.style.setProperty(r_, i);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var R = "ui-temporal-input", v_ = "ui-calendar", y_ = `.${R}, .${v_}`, b_ = "ui-temporal-input__value-input", x_ = "ui-temporal-input__end-value-input", S_ = "data-ui-temporal-range", C_ = "data-ui-temporal-end", w_ = "data-ui-temporal-mode", T_ = "data-ui-temporal-format", E_ = "data-ui-temporal-default-format", D_ = "data-ui-temporal-min", O_ = "data-ui-temporal-max", k_ = "data-ui-temporal-step", A_ = "data-ui-temporal-step-unit", j_ = "data-ui-temporal-marked-days", M_ = "data-ui-temporal-marked-only", N_ = "data-ui-temporal-page-culture", P_ = "data-ui-temporal-months", F_ = "data-ui-temporal-months-genitive", I_ = "data-ui-temporal-months-short", L_ = "data-ui-temporal-daynames", R_ = "data-ui-temporal-weekdays", z_ = "data-ui-temporal-first-day", B_ = "data-ui-temporal-am", V_ = "data-ui-temporal-pm", H_ = /* @__PURE__ */ new Set([
	T_,
	E_,
	D_,
	O_,
	P_,
	B_,
	V_,
	j_,
	M_
]), U_ = 2e3;
function W_(e) {
	let t = e.getAttribute(w_);
	return t === "time" || t === "date-time" ? t : "date";
}
function G_(e) {
	let t = e.getAttribute(T_);
	return t === null || t.trim().length === 0 ? e.getAttribute(E_) ?? "" : t;
}
function K_(e) {
	let t = e.getAttribute(A_), n = Math.max(1, Math.trunc(Number(e.getAttribute(k_))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function q_(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function J_(e) {
	return {
		monthNames: Y_(e, P_),
		monthGenitiveNames: Y_(e, F_),
		abbreviatedMonthNames: Y_(e, I_),
		dayNames: Y_(e, L_),
		abbreviatedDayNames: Y_(e, R_),
		amDesignator: e.getAttribute(B_) ?? "AM",
		pmDesignator: e.getAttribute(V_) ?? "PM"
	};
}
function Y_(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function X_(e, t) {
	e.hasAttribute(N_) && (ev(e, F_, t.monthGenitiveNames.join("|")), ev(e, I_, t.abbreviatedMonthNames.join("|")), ev(e, L_, t.dayNames.join("|")), ev(e, R_, t.abbreviatedDayNames.join("|")), ev(e, P_, t.monthNames.join("|")), ev(e, B_, t.amDesignator), ev(e, V_, t.pmDesignator), ev(e, E_, $_(W_(e), K_(e), t)));
}
function Z_(e) {
	for (let t = 0; t < e.length;) {
		let n = ui(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Q_(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function $_(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ti(n, r);
}
function ev(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function tv(e) {
	return e.hasAttribute(S_);
}
function nv(e) {
	return e !== null && e.hasAttribute(C_);
}
function rv(e) {
	return z(e, !1);
}
function z(e, t) {
	let n = iv(e, t);
	return n === null ? null : _v(n.value, W_(e));
}
function iv(e, t) {
	return e.querySelector(`.${t ? x_ : b_}`);
}
function av(e, t) {
	return _v(e.getAttribute(t) ?? "", W_(e));
}
function ov(e) {
	let t = av(e, D_), n = av(e, O_), r = (e.getAttribute(j_) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : vv(t, "date"),
		max: n === null ? null : vv(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(M_)
	};
}
function sv(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function cv(e, t, n) {
	let r = iv(e, n);
	if (r === null) return;
	let i = t === null ? "" : vv(t, W_(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function lv(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : bi(n, G_(e), J_(e));
	return r === null ? n : vv(hi(r), W_(e));
}
function uv(e) {
	if (!tv(e)) return;
	let t = z(e, !1), n = z(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (cv(e, n, !1), cv(e, t, !0));
}
function dv(e) {
	D(e) || T(e) || (fv(e, !1), tv(e) && fv(e, !0));
}
function fv(e, t) {
	let n = z(e, t);
	if (n === null) return;
	let r = mv(e, n);
	r.getTime() !== n.getTime() && cv(e, r, t);
}
function pv(e) {
	return hv(e, mv(e, /* @__PURE__ */ new Date()));
}
function mv(e, t) {
	let n = av(e, D_), r = av(e, O_);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function hv(e, t) {
	let n = K_(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var gv = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function _v(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = gv.exec(n);
		return e === null ? null : new Date(U_, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = mi(n);
	return r === null ? null : hi(r);
}
function vv(e, t) {
	let n = `${yv(e.getHours())}:${yv(e.getMinutes())}:${yv(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${yv(e.getMonth() + 1)}-${yv(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function yv(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function bv(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Cv(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < wv(e.start).getTime() ? {
		start: Cv(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Cv(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function xv(e, t, n) {
	if (t === null || n === null) return !1;
	let r = wv(e).getTime();
	return r > wv(t).getTime() && r < wv(n).getTime();
}
function Sv(e, t, n) {
	return !n && xv(e, t.start, t.end);
}
function Cv(e, t) {
	return gi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function wv(e) {
	return gi(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var Tv = "ui-temporal-input__day", Ev = "ui-temporal-input__month", Dv = "data-ui-temporal-nav", Ov = "data-ui-temporal-day", kv = 366;
function Av(e) {
	let t = rv(e);
	return {
		view: Zv(t ?? mv(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function jv(e, t, n, r) {
	let i = B("div", `${R}__calendar`), a = B("div", `${R}__calendar-header`), o = ov(e), s = Xv("previous", "‹", w.text("ui.picker.previous"));
	s.disabled = Mv(o, t, -1) === null, a.append(s);
	let c = Xv("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${R}__calendar-label`), a.append(c);
	let l = Xv("next", "›", w.text("ui.picker.next"));
	return l.disabled = Mv(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Iv(e, t, n, r, o) : Lv(t, n, o)), i;
}
function Mv(e, t, n) {
	let r = t.pane === "months", i = ey(t.view, n * (r ? 12 : 1));
	return Pv(e, Nv(i, r ? 4 : 7)) ? Fv(e, i) : null;
}
function Nv(e, t) {
	return vv(e, "date").slice(0, t);
}
function Pv(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function Fv(e, t) {
	let n = Nv(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : _v(r, "date");
	return i === null ? t : Zv(i);
}
function Iv(e, t, n, r, i) {
	let a = qv(e), o = B("div", `${R}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = B("span", `${R}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = B("div", `${R}__days`), c = wv(/* @__PURE__ */ new Date()), l = tv(e), u = l ? z(e, !1) : r, d = l ? z(e, !0) : null, f = Qv(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = $v(f, e), r = vv(n, "date"), a = B("button", Tv);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(Ov, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${Tv}--outside`), ty(n, c) && (a.classList.add(`${Tv}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${Tv}--marked`);
		let o = u !== null && ty(n, u), p = d !== null && ty(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${Tv}--selected`), l && (o || p) && a.setAttribute("aria-description", w.text(o ? "ui.picker.start" : "ui.picker.end")), Sv(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${Tv}--within`), sv(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = B("div", `${R}__calendar-pane`);
	return p.append(o, s), p;
}
function Lv(e, t, n) {
	let r = B("div", `${R}__months`);
	for (let i = 0; i < 12; i++) {
		let a = B("button", Ev);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(Dv, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Ev}--selected`), a.setAttribute("aria-current", "true")), Pv(n, Nv(gi(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function Rv(e) {
	let t = B("div", `${R}__period-caption`);
	return t.textContent = w.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function zv(e, t, n) {
	let r = ov(e);
	if (n.startsWith("month:")) {
		let e = gi(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Pv(r, Nv(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = Mv(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Mv(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Bv(e, t, n) {
	if (tv(e)) {
		Vv(e, t, n);
		return;
	}
	let r = Hv(n, rv(e) ?? pv(e));
	t.focusedDay = r, t.view = Zv(r), cv(e, r, !1);
}
function Vv(e, t, n) {
	let r = bv({
		start: z(e, !1),
		end: z(e, !0)
	}, t.activeEnd, Hv(n, pv(e)));
	t.focusedDay = r.end ?? r.start, t.view = Zv(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, cv(e, r.end, !0), cv(e, r.start, !1);
}
function Hv(e, t) {
	return gi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Uv(e, t, n) {
	let r = Gv(n), i = Kv(t, n, qv(e));
	if (i === null) return null;
	let a = ov(e);
	if (r === 0) return Wv(a, i);
	let o = i;
	for (let e = 0; e < kv; e++) {
		if (sv(a, vv(o, "date"))) return o;
		o = $v(o, r);
	}
	return t;
}
function Wv(e, t) {
	let n = vv(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : _v(r, "date");
	return i === null ? t : Hv(i, t);
}
function Gv(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Kv(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return $v(e, -1);
		case "ArrowRight": return $v(e, 1);
		case "ArrowUp": return $v(e, -7);
		case "ArrowDown": return $v(e, 7);
		case "PageUp": return ey(e, -1);
		case "PageDown": return ey(e, 1);
		case "Home": return $v(e, -r);
		case "End": return $v(e, 6 - r);
		default: return null;
	}
}
function qv(e) {
	let t = Number(e.getAttribute(z_));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Jv(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Tv}`)];
	if (i.length === 0) return;
	let a = vv(wv(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (O(i, o), r && M(o));
}
function Yv(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? z(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Tv}`)) {
		let e = _v(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${Tv}--preview`, e !== null && n !== null && r !== null && xv(e, n, $v(r, 1)));
	}
}
function Xv(e, t, n) {
	let r = B("button", `${R}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Dv, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function B(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Zv(e) {
	return gi(e.getFullYear(), e.getMonth(), 1);
}
function Qv(e, t) {
	let n = Zv(e);
	return $v(n, -((n.getDay() - t + 7) % 7));
}
function $v(e, t) {
	return gi(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function ey(e, t) {
	let n = gi(e.getFullYear(), e.getMonth() + t, 1), r = gi(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return gi(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function ty(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var ny = "ui-temporal-input__field", ry = "ui-temporal-input__popup", iy = "ui-temporal-input--open", ay = "ui-calendar__body", V = "ui-temporal-input__time-cell", oy = "ui-temporal-input__time-column", sy = 4, cy = 140, ly = "data-ui-temporal-toggle", uy = "data-ui-temporal-unit", dy = "data-ui-temporal-cell", fy = "data-ui-temporal-centred", py = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new yl({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(iy), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(iy);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(y_)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Hr(e.components, y_), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && my(e) && this.states.set(e, Av(e)), this.isShowing(e) && this.renderSurface(e);
		}), P(this.root, y_, { attributeFilter: [...H_] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), P(this.root, y_, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), w.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) my(e) && hy(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(y_)], t = w.temporal;
		if (t !== null && w.language !== this.drawnLanguage) {
			this.drawnLanguage = w.language;
			for (let n of e) X_(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || my(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${ay}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && hy(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			dv(t);
			let e = vi(G_(t), Ay()), n = li(G_(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${ny}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = iv(t, nv(r))?.value ?? "", a = _v(i, W_(t));
				if (a !== null) {
					r.value = ai(a, G_(t), J_(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ny)) return;
		let t = e.target.closest(`.${R}`), n = t === null ? null : iv(t, nv(e.target));
		if (t === null || n === null) return;
		let r = lv(t, e.target.value), i = _v(r, W_(t)), a = i === null ? r : vv(mv(t, i), W_(t));
		if (gy(t, a)) {
			let n = z(t, nv(e.target));
			e.target.value = n === null ? "" : ai(n, G_(t), J_(t));
			return;
		}
		nv(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), uv(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ny)) return;
		let t = e.target.closest(`.${R}`);
		t !== null && tv(t) && (this.getState(t).activeEnd = nv(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !tv(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Ov}]`) : null, r = this.getState(t), i = n === null ? null : _v(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Yv(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${Ov}], .${V}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(V) ? Ny(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = hy(e), r = _v(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, O([...n.querySelectorAll(`.${Tv}`)], t), es(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ny)) return;
		let t = e.target.closest(`.${R}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ly}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${R}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${Dv}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${Ov}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${dy}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${uy}]`)?.getAttribute(uy);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(dy)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (zv(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, pv(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), tv(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = _v(t, "date");
		if (n === null || D(e) || T(e) || !sv(ov(e), t)) return;
		let r = this.getState(e);
		my(e) && tv(e) && !r.choosingEnd && z(e, !1) !== null && z(e, !0) !== null && (r.activeEnd = "start");
		let i = iv(e, !1), a = `${i?.value ?? ""}|${iv(e, !0)?.value ?? ""}`;
		Bv(e, r, n), my(e) && `${i?.value ?? ""}|${iv(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = tv(e) && this.getState(e).activeEnd === "end", i = new Date(z(e, r) ?? pv(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		cv(e, t, n), uv(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(ny)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${R}`), nv(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(V)) {
			Py(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = _v(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, vv(n, "date"));
			return;
		}
		let r = Uv(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Zv(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oy}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, cy)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oy}`), n = t?.getAttribute(uy) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Rd(this.wheelTurns.get(n) ?? 0, Ld(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${V}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${V}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${V}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(dy)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(fy));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(uy), i = Ty(e);
		if (!(r === null || i === null || i.classList.contains(`${V}--selected`))) {
			if (i.matches(":disabled")) {
				Cy(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(dy)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${ry}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = tv(e) ? t ?? (z(e, !1) === null ? "start" : z(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = z(e, r.activeEnd === "end") ?? rv(e);
		r.pane = "days", r.view = Zv(i ?? mv(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${ly}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: sy
			},
			openers: a === null ? [] : [a],
			returnFocus: () => My(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Av(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = hy(e);
		if (n === null) return;
		let r = my(e), i = W_(e), a = this.getState(e), o = J_(e), s = tv(e), c = z(e, s && a.activeEnd === "end"), l = Ey(n), u = Dy(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Rv(a)), r) n.append(jv(e, a, o, c));
		else {
			let t = B("div", `${R}__panes`);
			t.append(jv(e, a, o, c)), i === "date-time" && t.append(_y(e, c)), n.append(t, ky(i));
		}
		let f = u === null ? null : n.querySelector(`[${Dv}="${ir(u)}"]:not(:disabled)`);
		Jv(n, a, c, t || d && l === null && f === null), Yv(e, a), r || (Sy(n), Cy(n), Oy(n, l)), f !== null && M(f), r || this.popups.reposition(e);
	}
};
function my(e) {
	return e.classList.contains(v_);
}
function hy(e) {
	return e.querySelector(`.${my(e) ? ay : ry}`);
}
function gy(e, t) {
	let n = ov(e), r = n.markedOnly ? _v(t, W_(e)) : null;
	return r !== null && !n.marked.has(vv(r, "date"));
}
function _y(e, t) {
	let n = K_(e), r = B("div", `${R}__time`), i = B("div", `${R}__time-columns`);
	for (let r of vy(n)) i.append(xy(e, r, yy(n, r), t));
	return r.append(i), r;
}
function vy(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function yy(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function by(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function xy(e, t, n, r) {
	let i = B("div", oy);
	i.setAttribute(uy, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", w.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = by(r, t), s = t === "hour" && Z_(G_(e)), c = J_(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = B("button", V);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Q_(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(dy, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${V}--selected`), Ry(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Sy(e) {
	let t = e.querySelector(`.${R}__calendar`), n = e.querySelector(`.${R}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Cy(e) {
	for (let t of e.querySelectorAll(`.${oy}`)) {
		let e = t.querySelector(`.${V}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, wy(t, e), t.setAttribute(fy, String(t.scrollTop));
	}
}
function wy(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function Ty(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${V}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Ey(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(V) ? null : t.closest(`.${oy}`)?.getAttribute(uy) ?? null;
}
function Dy(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Dv) : null;
}
function Oy(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${oy}[${uy}="${t}"]`)?.querySelector(`.${V}--selected`) ?? null;
	n !== null && M(n);
}
function ky(e) {
	let t = B("div", `${R}__popup-footer`);
	return t.append(Xv("now", w.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Xv("clear", w.text("ui.picker.clear"))), t.append(Xv("done", w.text("ui.picker.done"))), t;
}
function Ay() {
	return {
		year: jy("ui.picker.letter.year", _i.year),
		month: jy("ui.picker.letter.month", _i.month),
		day: jy("ui.picker.letter.day", _i.day),
		hour: jy("ui.picker.letter.hour", _i.hour),
		minute: jy("ui.picker.letter.minute", _i.minute),
		second: jy("ui.picker.letter.second", _i.second)
	};
}
function jy(e, t) {
	let n = w.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function My(e, t) {
	for (let n of e.querySelectorAll(`.${ny}`)) if (nv(n) === t) return n;
	return e.querySelector(`.${ny}`);
}
function Ny(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(V) && es(e);
}
function Py(e) {
	let t = e.target, n = t.closest(`.${oy}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? Iy(n, e.key === "ArrowRight" ? 1 : -1) : Fy(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), Ly(r));
}
function Fy(e, t, n) {
	return Ya({
		key: n,
		items: [...e.querySelectorAll(`.${V}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function Iy(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${oy}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${V}--selected`) ?? r.querySelector(`.${V}:not(:disabled)`);
}
function Ly(e) {
	let t = e.closest(`.${oy}`);
	t !== null && wy(t, e);
}
function Ry(e, t, n, r) {
	let i = av(e, D_), a = av(e, O_);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var zy = "[data-ui-theme-switcher]", By = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(zy) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: lr.SetTheme,
				mode: Vy() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function Vy() {
	let e = document.documentElement.getAttribute(xn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var Hy = `[${wn}]`, Uy = "ui-language-switcher__trigger", Wy = "ui-language-switcher__label-text", Gy = "ui-language-switcher__label-text--current", Ky = "ui-language-switcher__label-text--page", qy = "ui-language-switcher__menu", Jy = "ui-language-switcher__choice", Yy = "ui-language-switcher--open", Xy = 4, Zy = "ui.language.switch", Qy = "ui.language.current", $y = class {
	options;
	root;
	menus = new yl({
		show: ({ owner: e }) => e.classList.add(Yy),
		hide: ({ owner: e }) => e.classList.remove(Yy),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), w.onChange(() => this.showLanguage(w.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jy}`), n = e.target.closest(Hy);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Tn));
			return;
		}
		let r = e.target.closest(`.${Uy}`);
		if (r === null || T(r)) return;
		e.preventDefault();
		let i = eb(n);
		if (i.length === 2) {
			let e = w.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Hy);
		if (t === null) return;
		let n = eb(t), r = e.target.closest(`.${Uy}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !Xa(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = Ya({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jy}`);
		if (t === null || t === document.activeElement || T(t)) return;
		let n = t.closest(Hy);
		n !== null && this.menus.isOpen(n) && es(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${qy}`);
		if (r === null) return;
		let i = eb(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Xy
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && ps(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: lr.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(Hy)) {
			let n = t.querySelector(`:scope > .${Uy}`);
			if (n === null) continue;
			let r = eb(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${Wy}`)) {
				let n = t.getAttribute(Tn) === e;
				t.classList.toggle(Gy, n), t.classList.contains(Ky) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				w.write(n, "aria-label", Zy, {
					language: tb(r, e),
					code: nb(e),
					other: tb(r, t),
					otherCode: nb(t)
				});
			} else w.write(n, "aria-label", Qy, {
				language: tb(r, e),
				code: nb(e)
			});
		}
	}
};
function eb(e) {
	return [...e.querySelectorAll(`:scope > .${qy} > .${Jy}`)];
}
function tb(e, t) {
	let n = e.find((e) => e.getAttribute(Tn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return nb(t);
	}
}
function nb(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/rendering/inline-markup.ts
var rb = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, ib = "\\", ab = "`", ob = "!", sb = "{", cb = "}", lb = "ui-text__fold", ub = "ui-text__fold-toggle", db = "ui-text__fold-content", fb = 8;
function pb(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Tb(new Pb(e), 0, e.length, rb.None, null, t, n), Eb(t, n, rb.None, null), t;
}
function mb(e) {
	return pb(e).map((e) => yb(e) ? `${e.fold} ${mb(e.text)}` : e.text).join("");
}
function hb(e) {
	let t = "";
	for (let n of e) t += Lb(n) ? ib + n : n;
	return t;
}
function gb(e, t, n = {}) {
	let r = pb(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && _b(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(bb(r, n));
}
function _b(e) {
	return e.styles === rb.None && e.url === null && !vb(e) && !yb(e);
}
function vb(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function yb(e) {
	return e.fold !== null && e.fold !== void 0;
}
function bb(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(xb(r, t));
	return n;
}
function xb(e, t) {
	if (vb(e)) return Cb(e.icon);
	let n = yb(e) ? Sb(e, t) : document.createTextNode(e.text);
	if ((e.styles & rb.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & rb.Strikethrough) !== 0 && (n = wb("s", n)), (e.styles & rb.Underline) !== 0 && (n = wb("u", n)), (e.styles & rb.Italic) !== 0 && (n = wb("em", n)), (e.styles & rb.Bold) !== 0 && (n = wb("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Ju(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Sb(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${lb} ${lb}--static` : lb, r.className = ub, r.textContent = e.fold ?? "", i.className = db, i.append(bb(pb(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(ze, ""), n.append(r, i), n);
}
function Cb(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", dd(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function wb(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Tb(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === ib && c + 1 < n && Lb(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Db(e, c, n);
		if (l !== null) {
			Eb(a, o, r, i), Ob(s, c + 1, l, o), Eb(a, o, r | rb.Code, i), c = l + 1;
			continue;
		}
		let u = jb(e, c, n);
		if (u !== null) {
			Eb(a, o, r, i), Tb(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Eb(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = kb(e, c, n);
		if (d !== null) {
			Eb(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Mb(e, c, n) : null;
		if (f !== null) {
			Eb(a, o, r, i), Tb(e, f.labelStart, f.labelEnd, r, f.url, a, o), Eb(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Nb(e, c, n);
		if (p !== null) {
			Eb(a, o, r, i), a.push({
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
function Eb(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Db(e, t, n) {
	let r = e.text;
	if (r[t] !== ab) return null;
	let i = t + 1;
	if (i >= n || Rb(r[i])) return null;
	let a = e.findClosingMarker(i, n, ab, 1);
	return a > i ? a : null;
}
function Ob(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === ib && i + 1 < n && Lb(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function kb(e, t, n) {
	let r = e.text;
	if (r[t] !== ob || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Ab(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Ab(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function jb(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = rb.Bold, s = 2;
	else if (i === "*") o = rb.Italic, s = 1;
	else if (i === "_" && a) o = rb.Underline, s = 2;
	else if (i === "~" && a) o = rb.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Rb(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Mb(e, t, n) {
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
function Nb(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== sb || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > fb) return null;
	let c = { value: "" };
	return Ob(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Pb = class {
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
		return this.closeBrackets ??= this.next("]", !0), Fb(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Fb(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Fb(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Fb(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Ib(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Rb(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Gu(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === ib && e[t - 1] === 0);
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
			if (this.text[r] === sb) n.push(r);
			else if (this.text[r] === cb && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Rb(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Fb(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Ib(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Lb(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === sb || e === cb || e === ab || e === ib;
}
function Rb(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/action-bar.ts
var zb = `${De}__button`, Bb = `${De}__more`, Vb = `.${y}:not(${Pt})`, Hb = "ui-text__icon", Ub = `.ui-button__content .${Hb}`, Wb = ".ui-button__content .ui-text__title", Gb = /* @__PURE__ */ new WeakMap();
function Kb(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Vb)) qb(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Ft) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function qb(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function Jb(e, t) {
	let n = t.entries.map((e) => Yb(e, t));
	return t.more && t.openMore !== void 0 && n.push(Zb(t.openMore)), e.replaceChildren(...n), n;
}
function Yb(e, t) {
	let n = Qb(zb), r = ex(e), i = Xb(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), T(e) && (n.classList.add(Hn), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), Gb.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function Xb(e) {
	let t = e.querySelector(Ub);
	if (t === null || !t.className.split(" ").some(pd)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(Hb), n.setAttribute(ld, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(ud);
	return r.length > 0 && n.style.setProperty(ud, r), n;
}
function Zb(e) {
	let t = Qb(`${zb} ${Bb}`);
	return t.setAttribute("aria-haspopup", "menu"), w.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function Qb(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${$n}`, t.tabIndex = -1, t;
}
function $b(e) {
	return Gb.get(e) ?? null;
}
function ex(e) {
	return e.querySelector(Wb)?.textContent?.trim() ?? "";
}
var tx = {
	anchor: (e) => e.closest(`.${zb}`),
	words: (e) => {
		let t = $b(e), n = t === null ? w.text("ui.actionbar.more") : ex(t);
		return n.length === 0 ? null : hb(n);
	}
}, nx = 500, rx = 10, ix = /* @__PURE__ */ new WeakSet();
function ax(e) {
	return ix.has(e);
}
var ox = class {
	opensMenu;
	press = null;
	answered = null;
	openedAt = null;
	slid = !1;
	constructor(e) {
		this.opensMenu = e.opensMenu, e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.openedAt = null, this.slid = !1, this.press !== null) {
			this.cancel();
			return;
		}
		if (t.pointerType !== "touch" || !(e.target instanceof Element) || !this.opensMenu(e.target)) return;
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0;
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fire(), nx)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > rx && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > rx && this.cancel();
	}
	cancel() {
		this.press !== null && (clearTimeout(this.press.timer), this.press = null);
	}
	fire() {
		let e = this.press;
		if (this.press = null, e === null || !e.target.isConnected) return;
		let t = new MouseEvent("contextmenu", {
			bubbles: !0,
			cancelable: !0,
			button: 2,
			clientX: e.x,
			clientY: e.y
		});
		ix.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!ix.has(e)) {
			if (this.answered !== null && e.target instanceof Node && this.answered.contains(e.target)) {
				e.preventDefault(), e.stopImmediatePropagation();
				return;
			}
			this.cancel();
		}
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, sx = "tabs:rename", cx = "tabs:pin", lx = "tabs:unpin", ux = "tabs:close", dx = "tabs:delete";
function fx(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function px(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[sx, e.rename && t.renamable],
		[cx, e.pin && !t.pinned],
		[lx, e.pin && t.pinned],
		[ux, e.close && !e.delete && n],
		[dx, e.delete && n]
	]);
}
function mx(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var hx = "data-ui-context-menu-owner", gx = be, _x = "ui-context-menu--open", vx = `.${y}:not(${Pt})`, yx = `${De}--strip`, bx = `.${De}:not(.${yx}) > .${Bb}`, xx = {
	placement: "bottom-start",
	gap: 4
}, Sx = "input, textarea, select, [contenteditable=''], [contenteditable='true']", Cx = "ui-context-menu-opening", wx = It, Tx = class {
	root;
	closed = null;
	menus = new yl({
		show: ({ popup: e }) => e.classList.add(_x),
		hide: ({ popup: e }, t) => {
			e.classList.remove(_x), this.closed = e, t === "outside" && Ix();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new ox({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${hx}]`) !== null && e.closest(Sx) === null
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
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
		let n = t.closest(`[${pe}]`);
		for (let r = t.closest(`[${hx}]`); r !== null; r = r.parentElement?.closest(`[${hx}]`) ?? null) {
			if (n !== null && r.contains(n)) return;
			let i = Ex(r, t);
			if (i.length === 0 || T(r)) continue;
			if (Rx(r)) return;
			let a = i.find((e) => Dx(e, t, !1));
			if (a !== void 0) {
				e.preventDefault(), this.open(r, a, e.clientX, e.clientY, kx(e) ? t : null, t.closest(bx));
				return;
			}
		}
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${yx}`)?.remove(), Ax(t), i !== null && jx(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && Nx(t), this.closed !== null && (ac(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Xo(), s = a === null ? {} : {
			anchor: a,
			placement: xx
		};
		if (this.menus.open({
			owner: e,
			popup: t,
			...s,
			returnFocus: () => (o === null ? null : ms(o)) ?? ms(e)
		})) {
			if (a === null) {
				let e = t.getBoundingClientRect();
				t.style.left = `${Kc(n, e.width, window.innerWidth)}px`, t.style.top = `${Kc(r, e.height, window.innerHeight)}px`;
			}
			Fx(t);
		}
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(wx) !== null || this.menus.close();
	}
};
function Ex(e, t) {
	let n = t.closest(`[${xe}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? Lx(e, r) : null, Lx(e, "")].filter((e) => e !== null);
}
function Dx(e, t, n) {
	let r = new CustomEvent(Cx, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function Ox(e, t) {
	let n = e.closest(`[${hx}]`), r = e.closest(`[${pe}]`);
	return n === null || T(n) || Rx(n) || r !== null && n.contains(r) ? null : Ex(n, e).find((n) => Dx(n, e, t)) ?? null;
}
function kx(e) {
	let t = e.pointerType;
	return ax(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Qo();
}
function Ax(e) {
	for (let t of e.querySelectorAll(`[${Te}]`)) t.removeAttribute(Te);
}
function jx(e, t, n) {
	let r = n.closest(`[${Se}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !Ex(e, r).includes(t)) return;
	let { entries: i } = Kb(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${De} ${yx}`, a.setAttribute("role", "group"), Jb(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: Mx
	}), t.insertBefore(a, t.firstElementChild);
}
function Mx(e) {
	T(e) || e.click();
}
function Nx(e) {
	let { entries: t } = Kb(e), n = e.querySelector(`.${v}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) Px(e);
	let r = I(n, `.${y}`, `.${v}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && qb(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Pt)) ? Px(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(At);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	mx(a).forEach((e, t) => {
		a[t] === "rule" && !e && Px(i[t]);
	});
}
function Px(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Te, "");
}
function Fx(e) {
	let t = e.querySelector(`.${v}`);
	t !== null && ps(e, I(t, vx, `.${v}`));
}
function Ix() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${zo}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Lx(e, t) {
	for (let n of e.querySelectorAll(`[${gx}]`)) if ((n.getAttribute(gx) ?? "") === t && n.closest(`[${hx}]`) === e) return n;
	return null;
}
function Rx(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${g}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function zx(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function Bx(e) {
	return getComputedStyle(e).display !== "none";
}
function Vx(e) {
	let t = e.getBoundingClientRect(), n = {
		left: t.left,
		top: t.top,
		right: t.right,
		bottom: t.bottom
	}, r = getComputedStyle(e).position;
	for (let t = e.parentElement; t !== null && r !== "fixed"; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (r !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (e.overflowX !== "visible" || e.overflowY !== "visible") {
				let r = t.getBoundingClientRect(), i = r.left + t.clientLeft, a = r.top + t.clientTop;
				if (e.overflowX !== "visible" && Wx(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Wx(n, a, a + t.clientHeight, !1), Gx(n)) return !0;
			}
			r = e.position;
		}
	}
	return Wx(n, 0, window.innerWidth, !0), Wx(n, 0, window.innerHeight, !1), Gx(n);
}
function Hx(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (Ux(e.overflowX) || Ux(e.overflowY)) return n;
			t = e.position;
		}
	}
	return null;
}
function Ux(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function Wx(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Gx(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Kx = "ui-tooltip", qx = "ui-tooltip", Jx = "ui-tooltip--visible", Yx = "[aria-haspopup][aria-expanded=\"true\"]", Xx = "top", Zx = 250, Qx = 200, $x = 300, eS = 7, tS = null, H = null, nS = null, rS = null, iS = null, aS = 0, oS = null, sS = 0, cS = 0, lS = !1, uS = /* @__PURE__ */ new Set();
function dS(e) {
	uS.add(e);
}
function fS(e = document) {
	if (lS) return;
	lS = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", pS, !0), t.addEventListener("pointerout", gS, !0), t.addEventListener("focusin", _S, !0), t.addEventListener("focusout", vS, !0), t.addEventListener("keydown", yS, !0), t.addEventListener("scroll", hS, !0), t.addEventListener("pointerdown", bS, !0), t.addEventListener("click", xS, !0), window.addEventListener("blur", () => {
		rS = null, BS(!0);
	});
}
function pS(e) {
	if (mS(), SS(e.target)) {
		window.clearTimeout(sS);
		return;
	}
	let t = CS(e.target);
	t !== null && t !== H && DS(t);
}
function mS() {
	H === null || H.isConnected || (rS = null, BS(!0));
}
function hS(e) {
	if (mS(), H === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(H) || Vx(H) && (rS = null, BS(!0));
}
function gS(e) {
	if (rS !== null || iS !== null) return;
	let t = e.relatedTarget, n = H ?? oS?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || SS(t)) || (SS(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && BS(!1);
}
function _S(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = CS(e.target);
	t !== null && (rS = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, OS(t));
}
function vS(e) {
	CS(e.target) === H && (rS = null, BS(!0));
}
function yS(e) {
	e.key === "Escape" && H !== null && (rS = null, BS(!0));
}
function bS(e) {
	if (SS(e.target)) return;
	let t = CS(e.target);
	if (t !== null && t.hasAttribute("data-ui-tooltip-press")) {
		if (iS === t) {
			BS(!0);
			return;
		}
		rS = null, BS(!0), OS(t), iS = H;
		return;
	}
	rS === null && BS(!0);
}
function xS(e) {
	CS(e.target)?.hasAttribute("data-ui-tooltip-press") === !0 && e.preventDefault();
}
function SS(e) {
	return tS !== null && e instanceof Node && tS.contains(e);
}
function CS(e) {
	if (!(e instanceof Element)) return null;
	let t = wS(e);
	for (let n of uS) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && ES(r).length > 0) return r;
	}
	return t;
}
function wS(e) {
	let t = e.closest(`[${ke}], [${je}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${ke}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function TS(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t : ES(e);
}
function ES(e) {
	for (let t of uS) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function DS(e, t) {
	if (rS === null && iS === null) {
		if (window.clearTimeout(sS), oS !== null && oS.target === e) {
			oS.words = t;
			return;
		}
		if (window.clearTimeout(aS), oS = null, H !== null) {
			BS(!0), OS(e, t);
			return;
		}
		if (Date.now() - cS < $x) {
			OS(e, t);
			return;
		}
		oS = {
			target: e,
			words: t
		}, aS = window.setTimeout(() => {
			let e = oS;
			oS = null, e !== null && OS(e.target, e.words);
		}, Zx);
	}
}
function OS(e, t) {
	let n = (t ?? TS(e)).trim();
	if (n.length === 0 || !e.isConnected || kS(e) || Vx(e)) return;
	window.clearTimeout(aS), window.clearTimeout(sS), oS = null;
	let r = VS();
	gb(r, n, { staticFolds: !0 }), r.classList.add(Jx), H = e, jS(AS(e)), r.setAttribute("data-ui-tooltip-text", mb(n)), _c(e, r), vc(e, r, {
		placement: zS(e),
		gap: eS,
		arrow: !0
	});
}
function kS(e) {
	return e.matches(Yx) || e.querySelector(Yx) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function AS(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function jS(e) {
	nS !== null && nS !== e && MS();
	let t = NS(e);
	t.includes(qx) || e.setAttribute("aria-describedby", [...t, qx].join(" ")), nS = e;
}
function MS() {
	if (nS === null) return;
	let e = NS(nS).filter((e) => e !== qx);
	e.length === 0 ? nS.removeAttribute("aria-describedby") : nS.setAttribute("aria-describedby", e.join(" ")), nS = null;
}
function NS(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function PS(e, t, n) {
	n?.delay === !0 && H !== e ? DS(e, t) : OS(e, t);
}
function FS() {
	BS(!0);
}
var IS = {
	show: PS,
	hide: FS
};
function LS(e) {
	rS = e, OS(e);
}
function RS(e) {
	if (H === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			rS = null, BS(!0);
			return;
		}
		OS(e);
	}
}
function zS(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of uS) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Ae);
	return t !== null && sc(t) ? t : Xx;
}
function BS(e) {
	window.clearTimeout(aS), window.clearTimeout(sS), oS = null;
	let t = () => {
		H !== null && (MS(), H = null, iS = null, tS !== null && (tS.classList.remove(Jx), Tc(tS)), cS = Date.now());
	};
	e ? t() : sS = window.setTimeout(t, Qx);
}
function VS() {
	return tS !== null && tS.isConnected ? tS : (tS = document.createElement("div"), tS.id = qx, tS.className = Kx, tS.setAttribute("role", "tooltip"), tS.setAttribute("aria-hidden", "true"), document.body.append(tS), tS);
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var HS = `[${Se}]`, US = `[${Xc}]:not([hidden]), dialog[open]`, WS = `.${De}`, GS = `${De}--out`, KS = 6, qS = "--ui-action-bar-gap", JS = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Ee,
	...zn
], YS = class {
	root;
	shown = /* @__PURE__ */ new Map();
	chosen = null;
	identity = null;
	scopeObserver = null;
	pendingTap = null;
	cameFrom = null;
	menuHost = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e)), this.root.addEventListener("pointerup", (e) => this.handlePointerUp(e)), this.root.addEventListener("pointercancel", () => {
			this.pendingTap = null;
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0), dS(tx);
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${WS}, [data-ui-context-menu]`) !== null) return;
		let r = XS(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : $S(r)
			};
			return;
		}
		if ((t.button ?? 0) !== 0) {
			r !== this.chosen && this.choose(null);
			return;
		}
		r !== null && r === this.chosen ? this.askAgain(r) : this.choose(r);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? eC(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(WS) === null && kx(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(WS);
		if (n !== null) {
			this.isHostedBar(n) && O(sC(n), t);
			return;
		}
		Zo() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(ZS(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(WS) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(k) && this.choose(ZS(t));
			return;
		}
		let n = t.closest(WS);
		if (n !== null && t.classList.contains(zb)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(US);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(k)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(k) && this.choose(ZS(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && uC(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : ms(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = sC(t), i = Ya({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : $S(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = Hx(e);
		if (t === void 0 || n === null || !zx(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + nC(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, wc(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		Ox(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver(() => this.scopeChanged()), this.scopeObserver.observe(this.identity.scope, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}));
	}
	scopeChanged() {
		let e = this.identity;
		if (e !== null) {
			if (this.chosen === null || !this.chosen.isConnected) {
				if (!e.scope.isConnected) {
					this.choose(null);
					return;
				}
				this.chosen = eC(e), this.sync();
			}
			for (let e of this.shown.values()) wc(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = Ox(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = De, n.setAttribute("role", "toolbar"), w.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(ze, ""), n.setAttribute(he, ""), !rC(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, oC(e)), vc(e, n, {
			placement: tC(e),
			gap: nC(e),
			boundary: Hx(e) ?? void 0
		}), n.classList.toggle(GS, Vx(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: JS
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		});
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : $b(r);
		if (!rC(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = sC(t.bar), o = a.find((e) => $b(e) === i) ?? a.find(Qa) ?? null;
		o !== null && (O(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0) return;
		if (this.menuHost = e, lC(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		iC(n.bar, !0);
		let r = new MutationObserver(() => {
			n.menu.classList.contains("ui-context-menu--open") || (r.disconnect(), this.closeMore(e));
		});
		r.observe(n.menu, {
			attributes: !0,
			attributeFilter: ["class"]
		});
	}
	closeMore(e) {
		if (this.menuHost !== e) return;
		this.menuHost = null, this.sync();
		let t = this.shown.get(e);
		if (t === void 0) return;
		iC(t.bar, !1);
		let n = document.activeElement;
		!Zo() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && aC(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), Tc(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(GS, Vx(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : sC(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function XS(e) {
	let t = e.closest(HS);
	if (t !== null) return t;
	let n = e.closest(`[${g}]`), r = e.closest(b);
	return n === null || r !== null && !r.contains(n) ? null : QS(n)[0] ?? null;
}
function ZS(e) {
	if (e.matches(k)) for (let t of e.querySelectorAll(`[${Oe}]`)) {
		if (t.closest(k) !== e) continue;
		let n = QS(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(HS);
}
function QS(e) {
	let t = [...e.querySelectorAll(HS)];
	return e.matches(HS) ? [e, ...t] : t;
}
function $S(e) {
	let t = e.getAttribute(Ce);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Ce,
		key: t,
		index: 0
	};
	let n = e.closest(`[${g}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: g,
		key: r,
		index: QS(n).indexOf(e)
	};
}
function eC(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return QS(t)[e.index] ?? null;
	return null;
}
function tC(e) {
	let t = e.getAttribute(Se);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function nC(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(qS));
	return Number.isFinite(t) ? t : KS;
}
function rC(e, t, n, r) {
	let { entries: i, more: a } = Kb(t);
	if (i.length === 0 && !a) return !1;
	let o = Jb(e, {
		entries: i,
		more: a,
		role: "button",
		press: cC,
		openMore: n
	});
	return O(o, o.find((e) => !T(e)) ?? o[0] ?? null), iC(e, r), !0;
}
function iC(e, t) {
	aC(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function aC(e) {
	return sC(e).find((e) => $b(e) === null) ?? null;
}
function oC(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function sC(e) {
	return [...e.querySelectorAll(`:scope > .${zb}`)];
}
function cC(e, t) {
	if (T(t)) return;
	let n = Ox(t, !1);
	n === null || !n.contains(e) || T(e) || !qb(e, n) || e.click();
}
function lC(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function uC(e) {
	return e.matches(zo) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function dC(e) {
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
		default: o = _C(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function fC(e, t, n = mC()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var pC = null;
function mC() {
	return pC === null && (pC = hC()), pC;
}
function hC() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function gC(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function _C(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : vC[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : vC[t] ?? null;
}
var vC = {
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
}, yC = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], bC = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
}, xC = `(min-width: ${bC.md}px)`;
function SC(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${bC[t]}px)`)) return t;
	return "base";
}
function CC(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function U(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function wC(e, t) {
	let n;
	for (let r of yC) {
		let i = U(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var TC = "ne.ui", EC = "boot", DC = /* @__PURE__ */ new Set(), OC = class {
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
		let r = this.resolveKey(e, EC);
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
		let n = e.getAttribute(Pe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return DC.has(n) || (DC.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${TC}:${n}:${t}`;
	}
}, kC = "ui-menu--nested", AC = "ui-menu__submenu", jC = bt, MC = St, NC = "data-ui-menu-flyout", PC = "data-ui-menu-unfolded", FC = xt, IC = "menu-open-group", LC = Re("click"), RC = class {
	root;
	store = new OC();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new yl({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(MC, ""), t.setAttribute(NC, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(MC), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(NC);
			}, N.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${v}`)), P(this.root, `.${v}`, {
			childList: !0,
			attributeFilter: [yt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${jC}]`)) zC(e);
		P(this.root, `[${jC}]`, {
			childList: !0,
			attributeFilter: [MC]
		}, (e) => {
			for (let t of e) zC(t);
		}), typeof matchMedia == "function" && matchMedia(xC).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = UC(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), BC(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${jC}]`)) zC(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Mt}`), e);
		if (t !== null && !t.hasAttribute(FC)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(kC) ? null : this.store.read(e, IC), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${v}`);
		a !== null && (UC(a) || i.hasAttribute(FC) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(kC);
		if (e.setAttribute(PC, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(MC);
			return;
		}
		if (t.hasAttribute(MC)) {
			t.removeAttribute(MC), n || this.store.write(e, IC, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, IC, t.getAttribute(g));
	}
	openInline(e) {
		e.setAttribute(MC, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${jC}][${MC}]`)) t.hasAttribute(FC) || t.removeAttribute(MC);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (BC(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${VC(e)}-start`,
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${v}`);
		a !== null && !Zo() && ps(a, I(a, `.${y}:not(${Pt})`, `.${v}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${jC}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Ft) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${jC}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${AC}`);
	}
};
function zC(e) {
	let t = e.querySelector(`:scope > .${y}`), n = e.closest(`.${v}`);
	t !== null && (t.setAttribute(LC, ""), t.setAttribute(ze, ""), t.setAttribute("aria-expanded", e.hasAttribute(MC) ? "true" : "false"), e.hasAttribute(FC) || n !== null && UC(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function BC(e) {
	for (let t of e.querySelectorAll(`[${NC}]`)) t.removeAttribute(NC);
}
function VC(e) {
	return HC(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function HC(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(xC).matches;
}
function UC(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/interactions/menu-engine.ts
var WC = "ui-context-menu", GC = "ui-orientation--horizontal", KC = `.${Nt} > .ui-menu__host > .ui-menu__item > .${y}`, qC = `${KC}, ${`.ui-menu[${yt}] > .ui-menu__host > .ui-menu__item > .${y}`}`, JC = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", YC = "data-ui-menu-shortcut", XC = "[role='menuitem'], [role='menuitemcheckbox']", ZC = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), dS(QC), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(ew) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [YC, Tt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${v}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && O(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && Qa(e)) ?? t.find(Qa) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			$C(e, t);
			return;
		}
		let r = this.ownItems(n), i = Ya({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(GC) || HC(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${v}`);
		if (n === null) return;
		let r = this.ownItems(n), i = Ya({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(GC) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && O(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${y}`) : null;
		if (t === null || t === document.activeElement || !t.matches(XC) || t.matches(Pt) || !Qa(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && es(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || tw(e))) return;
		let t = nl(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !fC(n.shortcut, e))) {
			if (!Qa(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${YC}]`)) {
			if (e.closest(`.${WC}`) !== null) continue;
			let t = dC(e.getAttribute(YC));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(YC)
				});
				continue;
			}
			let n = gC(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(YC),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return I(e, `.${y}:not(${Pt})`, `.${v}`);
	}
}, QC = {
	anchor: (e) => e.closest(qC),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(JC), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(KC) && t.scrollWidth <= t.clientWidth ? null : hb(n);
	},
	placement: (e) => {
		let t = e.closest(`.${v}`);
		return t === null ? null : VC(t);
	}
};
function $C(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(Pt) || !Qa(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function ew(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
function tw(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return Ka(t) || t instanceof HTMLElement && t.isContentEditable;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var nw = `.${v}[${Ct}]`, rw = ":scope > .ui-collapsible__bar", iw = ":scope > .ui-menu__host", aw = "ui-menu__item", ow = `:scope > .${y}`, sw = ".ui-text__title", cw = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", lw = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), P(t, nw, {
			childList: !0,
			characterData: !0,
			attributeFilter: [yt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = uw(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(iw);
		if (n === null) return;
		let r = zp(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: dw(n)
		}), e.setAttribute(wt, ""), am(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of fw(e)) {
			let e = pw(a);
			if (e === "header") {
				n !== null && hw(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			hw(a, o), r ||= o, i ||= o;
		}
		return n !== null && hw(n, r), i;
	}
	match(e, t) {
		let n = Vp(mw(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(cw) : null;
		if (r === null) return n;
		if (n) return gw(r), e.removeAttribute(St), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(St, i), i;
	}
	clear(e, t) {
		gw(t), e.removeAttribute(wt), fw(t).length > 0 && am(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(yt);
		for (let e of t.querySelectorAll(`[${bt}]:not([${xt}])`)) e.toggleAttribute(St, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...uw(e.target)?.querySelector(iw)?.querySelectorAll(`.ui-menu-item:not(${Pt})`) ?? []].find(Qa);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function uw(e) {
	let t = e.closest(nw), n = t?.querySelector(rw) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function dw(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${bt}][${St}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function fw(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(aw));
}
function pw(e) {
	return e.querySelector(ow)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function mw(e) {
	return Bp(e.querySelector(ow)?.querySelector(sw)?.textContent ?? "", e);
}
function hw(e, t) {
	e.toggleAttribute(Tt, !t);
}
function gw(e) {
	for (let t of e.querySelectorAll(`[${Tt}]`)) t.removeAttribute(Tt);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var _w = 120;
function vw(e) {
	return e.typing && e.tallest - e.height > _w;
}
function yw(e) {
	return Ka(e) || e instanceof HTMLElement && e.isContentEditable;
}
var bw = class {
	width = 0;
	tallest = 0;
	constructor() {
		let e = window.visualViewport;
		e != null && (e.addEventListener("resize", () => this.update()), document.addEventListener("focusin", () => this.update(), !0), document.addEventListener("focusout", () => queueMicrotask(() => this.update()), !0), this.update());
	}
	update() {
		let e = window.visualViewport;
		if (e == null) return;
		e.width !== this.width && (this.width = e.width, this.tallest = 0), this.tallest = Math.max(this.tallest, e.height);
		let t = vw({
			height: e.height,
			tallest: this.tallest,
			typing: yw(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Dn, t);
	}
}, xw = "[data-ui-root]", Sw = "a[href]", Cw = "ui-collapsible", ww = "right-side", Tw = "ui-side--left", Ew = "ui-side--right", Dw = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(xC).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Et}]`);
		if (t !== null) {
			let e = t.closest(xw), n = t.getAttribute(Et);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Lt}]`);
		if (n !== null && !e.defaultPrevented && Ow(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(Sw)?.closest(`[${kt}]`), i = r?.parentElement ?? null;
		r != null && i?.getAttribute("data-ui-drawer-open") === r.getAttribute("data-ui-region") && this.close(i);
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && this.closeAll();
	}
	toggle(e, t) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		e.setAttribute(Dt, t), this.markToggles(e);
		let n = kw(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, Zo(), performance.now() + N.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(Jn, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (us(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${xw}[${Dt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Dt);
		if (e.removeAttribute(Dt), this.markToggles(e), t === null) return;
		let n = kw(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = e.querySelector(`[${Et}="${ir(t)}"]`);
			i !== null && n !== null && n.contains(r) ? vs(i, n) : i !== null && M(i);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(Dt);
		for (let n of e.querySelectorAll(`[${Et}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Et) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(Jn), t && e.removeAttribute("tabindex"));
	}
};
function Ow(e) {
	let t = e.closest(`.${Cw}`), n = t?.closest(`[${kt}]`), r = n?.getAttribute(kt), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(xw) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === ww ? Ew : Tw);
}
function kw(e, t) {
	return e.querySelector(`:scope > [${kt}="${ir(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var Aw = "ui-collapsible", jw = "ui-collapsible__content", Mw = "ui-collapsible__bar", Nw = "collapsed", Pw = class {
	root;
	store = new OC();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Aw}`)), P(this.root, `.${Aw}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, Nw);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Lt}]`), n = t?.closest(`.${Aw}`) ?? null;
		if (t === null || n === null || Ow(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(yt), i = n.querySelector(`:scope > .${jw}`);
		this.cancelFold(n);
		let a = Iw(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Nw, r ? "true" : "false", r ? { attributes: { [yt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(yt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Lt}], :scope > .${Mw} > [${Lt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || ic()) return;
		let i = Rw(Fw(e), n, Iw(e, t), r);
		if (i === null) return;
		e.setAttribute(Rt, "");
		let a = {
			duration: N.normal,
			easing: N.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Rt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Rt);
			for (let e of t) e.cancel();
		}
	}
};
function Fw(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Iw(e, t) {
	let n = Fw(e), r = Lw(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function Lw(e) {
	return e === "width" ? "height" : "width";
}
function Rw(e, t, n, r) {
	let i = Lw(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
//#region src/interactions/grid-tracks.ts
function zw(e) {
	let t = [];
	for (let n of Hw(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = zw(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Bw(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Bw(e) {
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
	if (n !== null) return Vw({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Vw(r[3] === "fr" ? {
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
function Vw(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Hw(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Uw(e, t = "auto") {
	return e.map((e) => Ww(e, t)).join(" ");
}
function Ww(e, t) {
	switch (e.kind) {
		case "px": return `${Gw(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Gw(e.min)}px`}, ${Gw(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Gw(e.max)}px)` : `minmax(${Gw(e.min)}px, auto)`;
	}
}
function Gw(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Kw(e) {
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
function qw(e, t) {
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
function Jw(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Yw(r, e), o = Yw(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Yw(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function Xw(e, t, n, r) {
	let i = $w(e, t, n.before), a = $w(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Qw(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = iT(n.before, e) + iT(n.after, e), r = i.total + a.total;
		eT(l, e, i, t * (i.total + c) / r), eT(l, e, a, t * (a.total - c) / r);
	} else u || tT(l, i, i.total + c), d || tT(l, a, a.total - c);
	return l;
}
var Zw = 120;
function Qw(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < Zw ? o = t < 0 ? -n : Zw - n : c > 0 && c < Zw && (o = t > 0 ? r : r - Zw), Math.min(Math.max(o, i), a);
}
function $w(e, t, n) {
	let r = rT(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function eT(e, t, n, r) {
	let i = iT(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function tT(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...nT(e[i])
		};
	}
}
function nT(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function rT(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function iT(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function aT(e, t) {
	let n = rT(t.before, e), r = n + rT(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function oT(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function sT(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function cT(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var lT = "ui-grid-splitter", uT = "ui-container", dT = "ui-orientation--vertical", fT = 16, pT = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: zt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, mT = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Bt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, hT = class {
	root;
	store = new OC();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Md({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${lT}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${lT}`)), P(this.root, `.${lT}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${lT}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = _T(t);
			e !== null && (this.restore(e, vT(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of yC) {
			let i = r[n], a = CC(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lT}`);
		if (t === null || this.drag.active || T(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = CT(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${lT}`), n = t === null ? null : _T(t);
		if (t === null || n === null) return;
		let r = vT(t);
		for (let e of yC) n.style.removeProperty(CC(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = Xw(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(CC(e.axis.split, e.tier), Uw(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of yC) {
			let a = CC(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = _T(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = vT(e), r = SC(), i = yT(t, n, r), a = i === null ? null : zw(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = qw(a, Kw(t.getAttribute(n.limits))), s = bT(t, n), c = xT(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Jw(c, ST(t, n).map((e) => xT(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = _T(e);
		if (t === null) return;
		let n = vT(e), r = xT(e, n), i = bT(t, n), a = ST(t, n).map((e) => xT(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : Jw(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(aT(i, o))), gT(t, n, i));
	}
};
function gT(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(lT)) continue;
		let e = getComputedStyle(r), i = cT(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(On, i);
	}
}
function _T(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(uT) ? t : null;
}
function vT(e) {
	return e.classList.contains(dT) ? pT : mT;
}
function yT(e, t, n) {
	for (let r = yC.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(CC(t.split, yC[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function bT(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function xT(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function ST(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(lT) && vT(r) === t && n.push(r);
	return n;
}
function CT(e) {
	let t = Number(e.getAttribute(Vt));
	return Number.isFinite(t) && t > 0 ? t : fT;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var wT = "ui-split-button", TT = "ui-split-button__main", ET = "ui-split-button__toggle", DT = "ui-split-button__menu", OT = "ui-split-button--open", kT = 4, AT = class {
	root;
	menus = new yl({
		show: ({ owner: e }) => e.classList.add(OT),
		hide: ({ owner: e }) => e.classList.remove(OT),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = jT(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${TT}`)?.closest(`.${wT}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = jT(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = MT(t), r = e.target.closest(`.${y}`);
		n === null || r === null || !n.contains(r) || r.matches(`${Pt}, ${It}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = MT(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: kT
			},
			openers: NT(e)
		}) && ps(r, I(r, `.${y}:not(${Pt})`, `.${v}`), t);
	}
};
function jT(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${ET}, .${TT}`), n = t?.closest(`.${wT}`) ?? null;
	return t === null || n === null || t.classList.contains(TT) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function MT(e) {
	return e.querySelector(`:scope > .${DT}`);
}
function NT(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var PT = "ui-button-group", FT = "ui-button-group__item", IT = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${PT}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), P(this.root, `.${PT}`, {
			childList: !0,
			attributeFilter: [Mn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = LT(i);
			i.toggleAttribute(jn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		O(n, r ?? n.find(Qa) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${FT}`), n = t?.closest(`.${PT}`) ?? null;
		if (t === null || n === null || t.closest(`.${PT}`) !== n || T(n)) return;
		let r = LT(t);
		r !== null && T(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${FT} > .${Qn}`), n = t?.closest(`.${PT}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(LT).filter((e) => e !== null), i = Ya({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${FT}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		to(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Mn,
			bindingAttribute: Pn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${FT}`, `.${PT}`);
	}
};
function LT(e) {
	return e.querySelector(`:scope > .${Qn}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var RT = "ui-accordion", zT = "details", BT = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${RT}`)), P(this.root, `.${RT}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(RT))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${zT}`)];
	}
}, VT = "ui-tab-overflow", HT = "ui-tab-overflow__menu", UT = "ui-tab-overflow__menu--open", WT = "ui-tab-overflow__entry", GT = "ui-tab-overflow__entry--current", KT = class {
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
		this.options = e, this.list = new YT(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : qT({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return JT(e, this.options.hiddenClass, t);
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
function qT(e) {
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
function JT(e, t, n) {
	for (let n of e.captions) n.classList.remove(t);
	let r = getComputedStyle(e.room), i = r.direction === "rtl", a = Number.parseFloat(r.paddingLeft) || 0, o = Number.parseFloat(r.paddingRight) || 0, s = e.room.getBoundingClientRect(), c = i ? s.right - e.room.clientLeft - o : s.left + e.room.clientLeft + a, l = e.room.clientWidth - a - o, u = e.captions.map((e) => {
		let t = e.getBoundingClientRect();
		return i ? c - t.left : t.right - c;
	});
	if (u.every((e) => e <= l)) return !1;
	n();
	let d = e.button.getBoundingClientRect(), f = getComputedStyle(e.button), p = Number.parseFloat(i ? f.marginRight : f.marginLeft) || 0, m = (i ? c - d.right : d.left - c) - p, ee = !1;
	for (let n = 0; n < e.captions.length; n++) ee ||= u[n] > m, ee && e.captions[n].classList.add(t);
	return !0;
}
var YT = class {
	menu;
	button = null;
	list = new yl({
		show: ({ popup: e }) => e.classList.add(UT),
		hide: ({ popup: e }) => {
			e.classList.remove(UT), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = HT, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(XT)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${GT}`);
		r !== null && O(this.entries(), r), this.button = e, _c(e, this.menu), this.list.open({
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
		}) ? r === null && ps(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${WT}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || T(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = Ya({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), O(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${WT}`) : null;
		t === null || t === document.activeElement || T(t) || (O(this.entries(), t), es(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${WT}`));
	}
};
function XT(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${WT} ${$n}`, t.classList.toggle(GT, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(g, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Hn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var ZT = "data-ui-caption-text", QT = ".ui-text__title";
function $T(e) {
	for (let t of e.querySelectorAll(QT)) {
		let e = t.textContent ?? "";
		t.getAttribute(ZT) !== e && t.setAttribute(ZT, e);
	}
}
function eE(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || ic()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: N.normal,
		easing: N.ease,
		pseudoElement: "::after"
	});
}
function tE(e) {
	e === null || typeof e.animate != "function" || ic() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: N.fast,
		easing: N.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var nE = "ui-tabs", rE = "ui-tab-header", iE = "ui-tab-header--selected", aE = "ui-tab-header--overflowed", oE = "ui-tabs--overflowing", sE = "ui-tabs--no-overflow", cE = "ui-tabs__strip", lE = "data-ui-tab-key", uE = "data-ui-tab-page", dE = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new KT({
			rootClass: nE,
			overflowingClass: oE,
			wraps: (e) => e.classList.contains(sE),
			hiddenClass: aE,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${nE}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${nE}`, {
			childList: !0,
			attributeFilter: [Fn, ...zn],
			relevant: (e) => !Yc(e, `[${uE}]`, `.${nE}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(lE) ?? "") === t) ?? null;
		if (r !== null && !fE(r)) {
			let t = n.find(fE);
			if (t !== void 0) {
				this.select(e, t.getAttribute(lE) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(iE)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(lE) ?? "") === t;
			e.classList.toggle(iE, n), e.setAttribute("aria-selected", n ? "true" : "false"), $T(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(fE), a), eE(i, a), O(n.filter((e) => !e.classList.contains(aE)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(uE) ?? "") !== t, !n.hidden && i !== null && i !== a && tE(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${cE}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(lE) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(fE).map((e) => {
				let n = e.getAttribute(lE) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: T(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${VT}`), n = t?.closest(`.${nE}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${nE}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${rE}`);
		if (r === null || T(r)) return;
		let i = r.closest(`.${nE}`), a = r.getAttribute(lE);
		i !== null && a !== null && r.closest(`.${nE}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${rE}`), n = t?.closest(`.${nE}`) ?? null;
		if (t === null || n === null) return;
		let r = Ya({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(lE) ?? ""), r.focus());
	}
	select(e, t) {
		to(e, t, {
			attribute: Fn,
			bindingAttribute: Pn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return I(e, `.${rE}`, `.${nE}`);
	}
	ownPages(e) {
		return I(e, `[${uE}]`, `.${nE}`);
	}
};
function fE(e) {
	return e.classList.contains(aE) || Bx(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var pE = "ui-command-bar", mE = "ui-command-bar__host", hE = "ui-command-bar__item", gE = "ui-command-bar__overflow", _E = "ui-command-bar--overflowing", vE = "ui-command-bar__overflowed", yE = "ui-text__title", bE = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new KT({
			rootClass: pE,
			overflowingClass: _E,
			wraps: (e) => !SE(e),
			hiddenClass: vE,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${pE}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), P(this.root, `.${pE}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = xE(e), n = e.querySelector(`:scope > .${gE}`);
		if (t === null || n === null) return;
		let r = CE(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(_E) && wE(r);
		for (let e of r) hc(e, e.classList.contains(vE) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gE}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(pE) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = xE(e), n = t === null ? [] : CE(t).filter((e) => e.classList.contains(hE) && e.classList.contains(vE)).map((e) => e.querySelector(b) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: TE(e),
			current: !1,
			disabled: T(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !T(n) && EE(n).click();
	}
};
function xE(e) {
	return e.querySelector(`:scope > .${mE}`);
}
function SE(e) {
	let t = xE(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function CE(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(hE) ? n.querySelector(b) : null;
		e !== null && Bx(e) && t.push(n);
	}
	return t;
}
function wE(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(hE) ? t ||= !r.classList.contains(vE) : t || r.classList.add(vE);
	}
}
function TE(e) {
	let t = EE(e), n = t.querySelector(`.${yE}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function EE(e) {
	return e.matches(zo) ? e : e.querySelector(zo) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var DE = "ui-breadcrumbs", OE = "ui-breadcrumbs__item", kE = "ui-breadcrumb", AE = "ui-breadcrumb--current", jE = "ui-hidden", ME = "data-ui-step-collapsed", NE = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), P(this.root, `.${DE}`, {
			childList: !0,
			attributeFilter: ["class", ...zn]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${DE}`)) this.apply(e);
	}
	apply(e) {
		let t = I(e, `.${OE}`, `.${DE}`);
		for (let e of t) PE(e);
		let n = t.filter((e) => !e.classList.contains(jE)).map((e) => e.querySelector(`.${kE}`)).filter((e) => e !== null && !e.classList.contains(jE)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(AE, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function PE(e) {
	let t = e.querySelector(`:scope > .${kE}`), n = t === null ? "" : zn.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === zn[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(ME) : e.getAttribute(ME) !== n && e.setAttribute(ME, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function W(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function FE(e) {
	return W(e).toString(16).padStart(2, "0").toUpperCase();
}
function IE(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return LE(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function LE(e, t, n) {
	return .2126 * RE(e) + .7152 * RE(t) + .0722 * RE(n);
}
function RE(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var zE = "ui-color-input", BE = "ui-color-input--open", VE = "ui-color-input__popup", HE = "ui-color-input__text", UE = "ui-color-input__row", WE = "ui-color-input__swatch--button", GE = "ui-color-input__value-input", KE = "ui-color-input__square-thumb", qE = "ui-color-input__hue-thumb", JE = "data-ui-color-toggle", YE = "data-ui-color-tab", XE = "data-ui-color-tab-selected", ZE = "data-ui-color-pane", QE = "data-ui-color-pane-selected", $E = "data-ui-color-square", eD = "data-ui-color-hue", tD = "data-ui-color-hex", nD = "data-ui-color-channel", rD = "data-ui-color-factor", iD = "data-ui-color-opacity", aD = "data-ui-color-name", oD = "data-ui-color-name-selected", sD = "data-ui-color-format", cD = "data-ui-color-variant", lD = "data-ui-color-no-picker", uD = "data-ui-color-no-palette", dD = 4, fD = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new yl({
		show: ({ owner: e }) => e.classList.add(BE),
		hide: ({ owner: e }) => e.classList.remove(BE)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${zE}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = S(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${zE}`) ?? []);
		}), P(this.root, `.${zE}`, {
			childList: !0,
			attributeFilter: [
				sD,
				cD,
				lD,
				uD
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Md({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${$E}], [${eD}]`),
			begin: (e, t) => {
				let n = e.closest(`.${zE}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute($E) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${GE}`)?.value ?? null
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: (e, t) => this.send(t.input),
			cancel: (e, t) => this.restore(t)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = _D(e), n = this.states.get(e), r = n?.paneChosen === !0 ? pD(e, n.pane) : mD(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? hD(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = TD(t);
			if (i === null) return n ?? hD(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && gD(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = OD(a, o, s);
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
			...n ?? hD(r),
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
			let [e, a, o] = OD(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), xD(e, "--ui-color-input-color", t.held ? DD(n, r, i, t.opacity) : "transparent"), xD(e, "--ui-color-input-solid", DD(n, r, i, 255)), xD(e, "--ui-color-input-on-color", t.held ? IE(n, r, i, t.opacity) : "inherit"), bD(e, t.held ? yD(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${$E}]`), o = e.querySelector(`[${eD}]`), [s, c, l] = kD(t.hue, 1, 1);
		if (xD(e, "--ui-color-input-hue", DD(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${KE}`);
			e !== null && (xD(e, "left", `${t.saturation * 100}%`), xD(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${qE}`);
			e !== null && xD(e, "top", `${t.hue / 360 * 100}%`);
		}
		SD(e, `[${tD}]`, ED(n, r, i)), SD(e, `[${nD}="r"]`, String(n)), SD(e, `[${nD}="g"]`, String(r)), SD(e, `[${nD}="b"]`, String(i)), xD(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), CD(e, `[${iD}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${aD}]`)) n.getAttribute(aD) === t.name ? n.setAttribute(oD, "") : n.removeAttribute(oD);
		let n = t.name === null ? null : e.querySelector(`[${aD}="${t.name}"]`), r = n === null ? null : TD(n.style.getPropertyValue("--ui-color-input-chip").trim());
		xD(e, "--ui-color-input-base", r === null ? "transparent" : DD(r[0], r[1], r[2], 255)), CD(e, `[${rD}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${ZE}]`)) n.getAttribute(ZE) === t.pane ? n.setAttribute(QE, "") : n.removeAttribute(QE);
		for (let n of e.querySelectorAll(`[${YE}]`)) n.getAttribute(YE) === t.pane ? n.setAttribute(XE, "") : n.removeAttribute(XE);
	}
	resolveRgb(e, t) {
		if (t.name === null) return kD(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${aD}="${t.name}"]`), r = n === null ? null : TD(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? kD(t.hue, t.saturation, t.value) : wD([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${JE}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${zE}`));
			return;
		}
		let n = e.target.closest(`[${YE}]`), r = e.target.closest(`.${zE}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(YE), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${aD}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(aD)
			}));
			return;
		}
		let a = r.querySelector(`.${VE}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${zE}`);
		if (t !== null) {
			if (e.target.hasAttribute(rD)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(iD) && this.commit(t, (t) => ({
				...t,
				opacity: W(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${zE}`);
		if (n === null) return;
		if (t.hasAttribute(rD) || t.hasAttribute(iD)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(tD)) {
			let e = TD(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = OD(e[0], e[1], e[2]);
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
		let r = t.getAttribute(nD);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = W(Number(t.value));
		let [l, u, d] = OD(c.r, c.g, c.b);
		this.commit(n, (e) => ({
			...e,
			hue: l,
			saturation: u,
			value: d,
			name: null
		}));
	}
	restore(e) {
		e.stateBefore !== void 0 && this.applyState(e.input, e.stateBefore);
		let t = e.input.querySelector(`.${GE}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = AD((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = AD((t.x - a.left) / a.width), s = 1 - AD((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || D(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${GE}`);
		a !== null && (a.value = vD(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		D(e) || e.querySelector(`.${GE}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(lD) && e.hasAttribute(uD)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${VE}`), n = e.querySelector(`[${JE}]`);
		if (t === null) return;
		let r = e.getAttribute(cD) === "swatch" ? e.querySelector(`.${WE}`) : e.querySelector(`.${UE}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: dD
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${XE}]`) ?? !0
		});
	}
};
function pD(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? lD : uD))(t) ? t : t === "picker" ? "palette" : "picker";
}
function mD(e) {
	return pD(e, "picker");
}
function hD(e) {
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
function gD(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function _D(e) {
	return e.querySelector(`.${GE}`)?.value.trim() ?? "";
}
function vD(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = ED(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${FE(e.opacity)}`;
}
function yD(e, t, n, r, i) {
	if (e.getAttribute(sD) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = ED(t, n, r);
	return i === 255 ? a : `${a}${FE(i)}`;
}
function bD(e, t) {
	for (let n of e.querySelectorAll(`.${HE}`)) n.textContent !== t && (n.textContent = t);
}
function xD(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function SD(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function CD(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function wD(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		W(e[0] * (1 - n)),
		W(e[1] * (1 - n)),
		W(e[2] * (1 - n))
	] : [
		W(e[0] + (255 - e[0]) * n),
		W(e[1] + (255 - e[1]) * n),
		W(e[2] + (255 - e[2]) * n)
	];
}
function TD(e) {
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
function ED(e, t, n) {
	return `#${FE(e)}${FE(t)}${FE(n)}`;
}
function DD(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function OD(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function kD(e, t, n) {
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
		W((o + a) * 255),
		W((s + a) * 255),
		W((c + a) * 255)
	];
}
function AD(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function jD(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var MD = "ui-table", ND = "ui-table--reorderable", PD = "ui-scroll-x--auto", FD = "ui-scroll-x--always", ID = `:scope > .${qt}`, LD = `.${Yt}`, RD = "ui-table__header-cell", zD = `${RD}--pinned`, BD = `${ID} > .${Jt} > .${RD}`, VD = `${BD}--pinned`, HD = "ui-table__host", UD = `${ID} > .${HD}`, WD = `.${MD}, .${Kt}, [${Ht}]`, GD = "--ui-table-columns", KD = "--ui-table-sized-columns", qD = "--ui-table-pin-", JD = "--ui-table-order-", YD = 64, XD = "data-ui-table-cell-hidden", ZD = "data-ui-table-cell-last", QD = "columns", $D = "hidden", eO = "order", tO = "layout", nO = 32, rO = 16, iO = class {
	root;
	store = new OC();
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
		if (this.root = e.root ?? document, this.drag = new Md({
			root: this.root,
			resolveHandle: (e) => e.closest(LD),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new Md({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of yC) e !== "base" && matchMedia(`(min-width: ${bC[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${MD}`)), P(this.root, `.${MD}`, {
			childList: !0,
			relevant: sO
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), P(this.root, `.${MD}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(MD)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), P(this.root, `.${MD}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: cO
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(UD);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), jD(t, () => this.pin(t));
			let e = t.querySelector(UD);
			e !== null && (this.markScrollbar(t, e), jD(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, QD), r = n === null ? null : zw(n);
		r !== null && r.length !== t.length ? (this.store.write(e, QD, null), this.store.writeBoot(e, tO, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, eO);
		if (i !== null && !uO(i, t)) {
			this.store.write(e, eO, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(an, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${MD}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = lO(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(PD) || e.classList.contains(FD);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(KD);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = sT(t, n);
				e.style.setProperty(KD, Uw(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${JD}${t}`, String(r[t])) : e.style.removeProperty(`${JD}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Gt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Gt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute($t) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute($t, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(ND)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= YD) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Ht}]`)) {
				let r = Number(t.getAttribute(Ht));
				!(r >= YD) || t.closest(`.${MD}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(XD, n.hidden.has(r)), t.toggleAttribute(ZD, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(BD)) {
			let e = Number(n.getAttribute(Ht)), r = n.getAttribute(Ut), i = n.classList.contains(zD) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: mO(r) ? r : null,
				startsHidden: n.hasAttribute(Wt),
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
		for (let e of t) (n[e.key] ?? pO(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, $D) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(GD).trim(), n = t.length === 0 ? null : zw(t);
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
		n === null || i !== void 0 && n === pO(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, $D, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return lO(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(VD).length;
		if (t < 2) return;
		let n = oT(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${qD}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${MD}`)?.toggleAttribute(rn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(ID), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return aO(e) ? n.slice(1) : n;
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
		let t = e.target.closest(LD);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = rO;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${MD}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Ht)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(LD)?.closest(`.${MD}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Xw(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(nO, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, oO(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, QD, t === null ? null : Uw(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(KD).trim(), n = e.getAttribute(Gt), r = {};
		t.length > 0 && (r[KD] = t);
		for (let t of e.style) t.startsWith(JD) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, tO, null);
			return;
		}
		this.store.writeBoot(e, tO, {
			styles: r,
			attributes: {
				[Gt]: n,
				[$t]: e.getAttribute($t)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${MD}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = Kw(t.getAttribute(zt)), i = qw(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Ht)), u = this.hiddenOf(t, o), d = lO(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${RD}`), n = t?.closest(`.${MD}`) ?? null;
		return t === null || n === null || !n.classList.contains(ND) || e.closest(LD) !== null || t.classList.contains(zD) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${MD}`), r = Number(e.getAttribute(Ht));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(en, ""), e.setAttribute(tn, ""), {
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
		for (let a of lO(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > dO(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), fO(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(nn, "after") : a.cell.setAttribute(nn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(tn), t.table.removeAttribute(en), fO(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = lO(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, eO, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function aO(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function oO(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function sO(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(WD) || t.querySelector(WD) !== null)) return !0;
	return !1;
}
function cO(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(HD);
}
function lO(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function uO(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function dO(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function fO(e) {
	for (let t of e.querySelectorAll(`[${nn}]`)) t.removeAttribute(nn);
}
function pO(e) {
	return e.startsHidden || e.hideBelow !== null && yC.indexOf(SC()) < yC.indexOf(e.hideBelow);
}
function mO(e) {
	return e !== null && yC.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var hO = /* @__PURE__ */ new WeakMap();
function gO(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(mt);
	for (let i of L(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = _O(i, a) ?? vO(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ze}]`)) n.has(t) || t.remove();
}
function _O(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : hO.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function vO(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (bO(i, t.getAttribute(g)), hO.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function yO(e) {
	return e.find((e) => !e.classList.contains(Gn));
}
function bO(e, t) {
	e.setAttribute(Ze, ""), t === null ? e.removeAttribute(Qe) : e.setAttribute(Qe, t);
}
var xO = "bottom";
function SO(e, t, n) {
	let r = e.querySelector(`:scope > [${ct}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(ct, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function CO(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var wO = /* @__PURE__ */ new WeakMap();
function TO(e) {
	for (let t of e.querySelectorAll(`[${Ze}]`)) t.remove();
}
function EO(e, t, n, r, i, a) {
	let o = Gg(e, L(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Pg(i.getItemsFilterSortMetadata(t), a, Ag(e));
	if (c && !l && TO(e), o.length === 0) {
		wO.set(e, []);
		return;
	}
	let d = mg(e);
	if (!l) {
		CO(e, [...Fg(o, u, r), ...pg(d)]);
		return;
	}
	TO(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (wO.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	wO.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = Fg(t, u, r));
		let n = e === "" ? void 0 : yO(t);
		if (n !== void 0) {
			let e = DO(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	CO(e, [...m, ...pg(d)]);
}
function DO(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && bO(r, n.getAttribute(g)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var OO = "ui-tree-rules", kO = `:scope > .${Zt}:not(.${Qt})`;
function AO(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(OO, { bubbles: !0 })), hg(e, t, n.templates, n.renderer, e.querySelector(kO) !== null);
		return;
	}
	switch (Hg(e)) {
		case "windowed":
			hg(e, t, n.templates, n.renderer), jO(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			jg(e, t, n.metadata, n.renderer, n.state), hg(e, t, n.templates, n.renderer), EO(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function jO(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && gO(e, (e) => DO(r, n.renderer, e));
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var MO = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), NO = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(k)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), P(this.root, k, {
			childList: !0,
			attributeFilter: [
				An,
				Mn,
				Nn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		if (mo(e, t), e.matches(".ui-items-view, .ui-table")) for (let e of t) {
			let t = np(e);
			t !== null && t.getAttribute("tabindex") !== "-1" && t.setAttribute("tabindex", "-1");
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, k);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (No(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			co(n, r);
			return;
		}
		go(n, i, r, lo(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(ro), r = n?.closest(k) ?? null;
		return n === null || r === null || n.closest(k) !== r || !r.matches(t) || T(r) ? null : ip(e.target, n) === null && !E(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, io);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Lo(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = Oo(e.target);
		if (t === null || t.row !== null && ip(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(".ui-items-view, .ui-table") || T(n)) return;
		let r = PO(n);
		if (!MO.has(e.key) && !Xa(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = Ao(i), o = Po(e.key, i, jo(i), r);
		if (o !== null) {
			e.preventDefault(), No(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && so(n, a), go(n, i, o, uo(n, e)));
			return;
		}
		if (a === null || E(a)) return;
		let s = np(a);
		switch (e.key) {
			case " ":
				if (!go(n, i, a, {
					shift: !1,
					ctrl: !0
				})) {
					if (s === null) return;
					s.click();
				}
				break;
			case "Enter":
				fo(n) && !ho(i).includes(a) && go(n, i, a, ao), s === null ? Lo(a, "open") : s.click();
				break;
			case "Delete": {
				let e = FO(i, a);
				if (e.length === 0) return;
				for (let t of e) Lo(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	ownItems(e) {
		return I(e, ro, k);
	}
};
function PO(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function FO(e, t) {
	let n = ho(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !E(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function IO(e, t) {
	if (E(e)) return !1;
	let n = t?.getAttribute(ln);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function LO(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return null;
	let i = e[r].parent;
	if (!n) return i.length === 0 ? null : e.find((e) => e.key === i)?.parent ?? "";
	for (let t = r - 1; t >= 0; t--) {
		let n = e[t];
		if (n.parent === i) return n.takesDrop ? n.key : null;
		if (n.key === i) return null;
	}
	return null;
}
function RO(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = zO(e, r, n);
	return i === null || !BO(e, i.parent) ? null : i;
}
function zO(e, t, n) {
	if (n === "in") {
		let n = LO(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = LO(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: HO(e, n, t.parent, !1)
		};
	}
	let r = VO(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function BO(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function VO(e, t) {
	return e.filter((e) => e.parent === t);
}
function HO(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = VO(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function UO(e, t, n) {
	let r = VO(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? HO(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
	for (let e of t) {
		let t = r.indexOf(e);
		t >= 0 && r.splice(t, 1);
		let n = a === null ? -1 : r.indexOf(a), i = s === null ? n >= 0 ? n : r.length : r.indexOf(s) + 1;
		r.splice(i, 0, e), o.push(i), s = e;
	}
	return o;
}
//#endregion
//#region src/interactions/tree-engine.ts
var WO = "ui-tree__row--folded", GO = "fold-hidden", KO = "fold-shown", qO = "ui-tree__row--dragging", JO = "ui-tree__loading", YO = "ui-tree__loading-ring", XO = "ui-tree-node", ZO = "ui-tree-node__text", QO = "ui-tree-node__toggle", $O = "ui-tree-node__rename", ek = ".ui-text__title", tk = "data-ui-tree-drop", nk = "--ui-tree-drop-depth", rk = "--ui-tree-depth", ik = "expanded", ak = 600, ok = .25, sk = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, ck = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), lk = class {
	root;
	store = new OC();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(OO, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${Xt}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(S(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => j(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${Xt}`)), P(this.root, `.${Xt}`, {
			childList: !0,
			attributeFilter: [
				sn,
				cn,
				un,
				hn
			],
			relevant: fk
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(hn), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = gk(e)?.getAttribute(sn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = j(e), r = gk(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(cn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, ee = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), te = p && (o === null ? t[n] ?? m : o.has(n)), ne = o !== null && !o.has(n);
			e.style.setProperty(rk, String(u)), e.setAttribute("aria-level", String(u + 1)), Mo(e, r?.querySelector(`:scope > .${ZO}`) ?? null), e.classList.toggle(WO, !d), e.classList.toggle(Qt, ne), e.removeAttribute(mn), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !E(e), p ? e.setAttribute("aria-expanded", te ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(fn), te && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(fn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), te || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(fn), d && te && !ne), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: te,
				authoredShown: ee
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return gk(e.row)?.hasAttribute(un) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Zt}[${g}="${ir(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, GO, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, KO, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [mn]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Wr(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Ag(t);
		if (r === void 0 && i === null) return null;
		let a = Pg(r, this.rules.state, i), o = Ng(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(j)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = gk(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Ig(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(j(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${JO}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = j(o), c = i.getItemValue(o);
			if (c === void 0 || Mg(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = gk(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(JO) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? pk();
		o.style.setProperty(rk, String(t)), o.classList.toggle(WO, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${QO}`) === null && (!r.hasAttribute("data-ui-unselectable") || ip(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || ip(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Zt}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || E(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = Oo(e.target);
		if (t === null || t.row !== null && ip(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || T(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? sk[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!ck.has(e.key) && !Xa(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Ao(i), o = Po(e.key, i, jo(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, uo(n, e));
			return;
		}
		if (!(a === null || E(a))) {
			switch (e.key) {
				case " ":
					if (!go(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Po("ArrowDown", i, a, "vertical"), ao);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), ao);
					break;
				case "Enter":
					fo(n) && !ho(i).includes(a) && go(n, i, a, ao), a.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = FO(i, a);
					if (e.length === 0) return;
					for (let t of e) t.dispatchEvent(new Event("remove", { bubbles: !0 }));
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Ao(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = RO(hk(n), j(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => j(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = mk(e), n = t?.closest(".ui-tree") ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (E(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? ho(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !E(e) && e.getClientRects().length > 0) : [];
		Qg(e, n, t, qO, j(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(qO));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xt}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Zt}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
			mark: "",
			place: {
				parent: "",
				before: null
			}
		} : this.dropAt(t, a, n, e.clientY);
		if (o === null) {
			this.markDrop(t, null), this.springOpen(t, null);
			return;
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a ?? r, o.mark, o.depth), this.dropPlace = o.place, this.springOpen(t, a !== null && o.mark === "" ? a : null);
	}
	dropAt(e, t, n, r) {
		let i = this.parentKeysOf(e), a = j(t), o = (e) => n.some((t) => j(t) === e || dk(i, e, j(t))), s = IO(t, gk(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? ok : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = hk(f), m = Number(t.style.getPropertyValue(rk)) || 0, ee = new Set(n.map(j)), te = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !ee.has(e.key)) : void 0, ne = i.get(a) ?? "", re = te === void 0 ? {
			parent: ne,
			before: d === "before" ? a : HO(p, ne, a, !1, ee)
		} : {
			parent: a,
			before: te.key
		}, ie = re.parent.length === 0 ? null : f.find((e) => j(e) === re.parent) ?? null;
		return ie !== null && (!IO(ie, gk(ie)) || o(re.parent)) ? null : {
			mark: d,
			place: re,
			depth: te === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), ak)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xt}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xt}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${tk}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && dk(a, j(e), j(t)))), s = r.getAttribute(tk) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), $g(t, qO), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = UO(hk(this.rowsOf(e)), t.map(j), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = gk(e)?.querySelector(`.${ZO}`) ?? null;
			r !== null && (r.setAttribute(pn, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent("move", {
				bubbles: !0,
				detail: { index: i[t] }
			})));
		});
	}
	handleDragEnd(e) {
		let t = mk(e)?.closest(".ui-tree") ?? null;
		t !== null && ($g(t, qO), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		for (let n of e.querySelectorAll(`[${tk}]`)) n !== t && (n.removeAttribute(tk), n.style.removeProperty(nk));
		if (t === null) {
			this.dropPlace = null;
			return;
		}
		t.setAttribute(tk, n), r === void 0 ? t.style.removeProperty(nk) : t.style.setProperty(nk, String(r));
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(j(n), gk(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = j(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(WO)) : [];
		this.store.writeJson(e, ik, i), this.layout(e), uk(a.filter((e) => !e.classList.contains(WO)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, ik) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Ao(r);
		No(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && so(e, i), go(e, r, t, n));
	}
	parentOf(e, t) {
		let n = gk(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => j(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${Xt}`), n = gk(e), r = n?.querySelector(ek) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), ol({
			container: n,
			title: r,
			className: $O,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(dn, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${_}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function uk(e) {
	if (!(e.length === 0 || ic())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: N.fast,
		easing: N.enter
	});
}
function dk(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function fk(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function pk() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = JO, e.setAttribute("aria-hidden", "true"), t.className = YO, e.append(t, w.text("ui.tree.loading")), e;
}
function mk(e) {
	return e.target instanceof Element ? e.target.closest(`.${Zt}`) : null;
}
function hk(e) {
	return e.map((e) => ({
		key: j(e),
		parent: gk(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: IO(e, gk(e)),
		shown: !e.classList.contains(Qt)
	}));
}
function gk(e) {
	return e.querySelector(`.${XO}`);
}
//#endregion
//#region src/interactions/tab-order.ts
function _k(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, vk(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function vk(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function yk(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", bk = "ui-tab-item", xk = "ui-tab-item__label", Sk = "ui-tab-item__close", Ck = "ui-tab-item__rename", wk = "ui-tab-item__caption", Tk = "ui-tab-item__pin", Ek = ".ui-text__title", Dk = "ui-tab-item--dragging", Ok = "ui-tab-item__caption--overflowed", kk = "ui-tabs-view--overflowing", Ak = "ui-tabs-view--no-overflow", jk = "ui-tab-item__page", Mk = "ui-tab-item--selected", Nk = `.${y}`, Pk = "tab-menu-entry", Fk = {
	name: Pk,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, Ik = "--ui-tabs-view-strip", Lk = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new KT({
			rootClass: G,
			overflowingClass: kk,
			wraps: (e) => e.classList.contains(Ak),
			hiddenClass: Ok,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(S(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => Yk(e) === t.key))?.querySelector(`.${xk}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Cx, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				Fn,
				ve,
				...zn
			],
			relevant: (e) => !Yc(e, `.${jk}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Bx);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => Yk(e) === r)) {
			this.select(e, Yk(n[0]));
			return;
		}
		let i = e.hasAttribute(ve), a = t.find((e) => e.classList.contains(Mk))?.querySelector(`.${wk}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = Yk(e) === r;
			e.classList.toggle(Mk, t);
			let a = e.querySelector(`.${wk}`);
			a !== null && (a.draggable = i, $T(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${xk}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${jk}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${jk}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), eE(a, s), a !== null && a !== s && tE(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${xk}`);
			t === null || e.classList.contains(Ok) || (l.push(t), e === s && (u = t));
		}
		O(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Bx(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(Ik, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${_}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${VT}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => Yk(e) === t)?.querySelector(`.${xk}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Bx).map((e) => ({
				key: Yk(e),
				title: e.querySelector(`.${xk}`)?.textContent?.trim() ?? Yk(e),
				current: Yk(e) === t,
				disabled: T(e.querySelector(`.${xk}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${bk}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = Bk(n, r), a = Hk(t), o = a.map((e) => {
			if (Vk(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Bx(e) ? "shown" : "hidden";
		});
		if (mx(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: Yk(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${be}="tab"]`), n = t?.parentElement ?? null, r = e.closest(Nk);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => Yk(e) === a.key);
		if (i.length === 0 || r.matches(`${Ft}, ${Pt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(Pk, {
			bubbles: !0,
			detail: { keys: [i, Yk(o)] }
		})), !0;
		if (Bk(n, o).get(i) !== !0) return !0;
		switch (i) {
			case sx: {
				let e = o.querySelector(`.${xk}`);
				e !== null && this.startRename(e);
				break;
			}
			case cx:
			case lx:
				this.setPinned(n, o, i === cx);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${wk} > .${Tk}`);
		t.toggleAttribute(Rn, n), r !== null && (r.toggleAttribute(Rn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = yk(a.map(qk));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Uk(a[a.length - 1]).after(Uk(t)) : Uk(s).before(Uk(t)), Kk([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${VT}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = Wk(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || T(r)) return;
		let a = r.closest(`.${bk}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, Yk(a)), document.activeElement !== r && M(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Sk}`), r = n?.closest(`.${bk}`) ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), zk(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = Wk(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Ek) ?? e, r = e.closest(`.${bk}`);
		t === null || r === null || Uk(r).hasAttribute("data-ui-unrenamable") || ol({
			container: t,
			title: n,
			className: Ck,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Ln, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => M(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xk}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${xk}`)).filter((e) => e !== null), i = Ya({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${bk}`);
		a !== null && this.select(n, Yk(a)), i.focus();
	}
	handleDragStart(e) {
		let t = Gk(e);
		if (t === null) return;
		if (Uk(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Qg(e, t.closest(`.${G}`) ?? t, t, Dk, Yk(t));
		let n = Uk(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wk}`)?.closest(`.${bk}`) ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Dk}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${wk}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Uk(r), o = t.hasAttribute("data-ui-tab-pinned") ? Rk(n, a) : null, s = o ?? Uk(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${Dk}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = Gk(e);
		if (t === null) return;
		t.classList.remove(Dk);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Uk(t), n.next);
			return;
		}
		let r = Uk(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		if (i === null) return;
		let a = this.ownItems(i);
		Kk(a, a.indexOf(t));
	}
	select(e, t) {
		to(e, t, {
			attribute: Fn,
			bindingAttribute: Pn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${bk}`, `.${G}`);
	}
};
function Rk(e, t) {
	let n = null;
	for (let r of I(e, `.${bk}`, `.${G}`)) {
		let e = Uk(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function zk(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !Uk(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function Bk(e, t) {
	return px(fx(e.getAttribute(ye)), {
		pinned: t.hasAttribute(Rn),
		renamable: !Uk(t).hasAttribute(fe),
		removable: e.hasAttribute("data-ui-tabs-removes") && zk(e, t)
	});
}
function Vk(e) {
	let t = e.getAttribute(g);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function Hk(e) {
	let t = e.querySelector(`[${_}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function Uk(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Wk(e) {
	return e.closest(`.${Sk}`) !== null || al(e) ? null : e.closest(`.${wk}`)?.querySelector(`:scope > .${xk}`) ?? null;
}
function Gk(e) {
	return e.target instanceof Element ? e.target.closest(`.${wk}`)?.closest(`.${bk}`) ?? null : null;
}
function Kk(e, t) {
	for (let [n, r] of _k(e.map(qk), t)) e[n].setAttribute(In, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function qk(e) {
	return {
		order: Jk(e),
		pinned: e.hasAttribute(Rn)
	};
}
function Jk(e) {
	let t = e.getAttribute(In);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function Yk(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var Xk = "button.ui-text__fold-toggle", Zk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Xk);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, Qk = "ui-temporal-input__segments", $k = "ui-temporal-input__segment", eA = "ui-temporal-input__segment-literal", tA = "ui-temporal-input__segment--empty", nA = "data-ui-temporal-segment", rA = "data-ui-temporal-step-direction", iA = "data-ui-temporal-segments-of", aA = "--", oA = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${R}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Hr(e.components, `.${R}`));
		}), P(this.root, `.${R}`, { attributeFilter: [...H_] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) W_(t) === "time" && (dv(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${Qk}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = G_(e), r = J_(e), i = z(e, nv(t));
		t.getAttribute(iA) !== n && (t.replaceChildren(...sA(n).map((e) => lA(e))), t.setAttribute(iA, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(nA);
			if (t === null) {
				n.textContent = dA(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = fA(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(tA, i === null), n.tabIndex = 0, pA(n, t, i, D(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = hA(e.target);
		if (t === null) return;
		let n = t.closest(`.${R}`), r = t.getAttribute(nA), i = mA(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), _A(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), cv(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = vA(e.key, J_(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = hA(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = hA(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Rd(this.wheelTurn, Ld(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${R}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(nA), n < 0 ? 1 : -1, mA(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${rA}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${rA}]`);
		if (t === null) return;
		let n = t.closest(`.${R}`);
		if (n === null || D(n)) return;
		e.preventDefault();
		let r = gA(n) ?? n.querySelector(`.${$k}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(nA), t.getAttribute(rA) === "up" ? 1 : -1, mA(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${$k}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${R}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = z(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = yA(t), o = q_(K_(e), a) * n, s = a === "hour" ? 24 : 60, c = ((bA(i, a) + o) % s + s) % s;
		this.write(e, xA(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? xA(t, "hour", SA(l, t.getHours() >= 12)) : xA(t, yA(n), l), i);
		}
		u && _A(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, xA(r, "hour", SA(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return z(e, t) ?? pv(e);
	}
	write(e, t, n) {
		cv(e, mv(e, t), n), uv(e), this.applySegments(e);
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
function sA(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = ui(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(cA(r)), n += r.length;
	}
	return t;
}
function cA(e) {
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
function lA(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = eA, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = $k, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(nA, e.unit), t.dataset.width = String(e.width), uA(t, e.unit), t;
}
function uA(e, t) {
	if (t === "meridiem") {
		w.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = yA(t);
	w.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function dA(e, t, n, r) {
	return t && n !== null ? ai(n, e, r) : e;
}
function fA(e, t, n, r) {
	if (n === null) return aA;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : bA(n, yA(e));
	return String(i).padStart(t, "0");
}
function pA(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : bA(n, yA(t))));
}
function mA(e) {
	return nv(e.closest(`.${Qk}`));
}
function hA(e) {
	let t = e instanceof Element ? e.closest(`.${$k}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${R}`);
	return n === null || D(n) ? null : t;
}
function gA(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${$k}`) : null;
}
function _A(e, t, n) {
	Ya({
		key: n,
		items: [...e.querySelectorAll(`.${$k}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function vA(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function yA(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function bA(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function xA(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function SA(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var CA = "ui-timestamp", wA = "ui-timestamp__text", TA = "data-ui-timestamp-format", EA = "datetime", DA = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${CA}`), w.temporal === null), w.onTable(() => this.apply(this.root.querySelectorAll(`.${CA}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Hr(e.components, `.${CA}`))), P(this.root, `.${CA}`, {
			childList: !0,
			attributeFilter: [EA],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${CA}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: w.temporal,
			language: w.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Pi(a.getAttribute(TA)), o = Ni(a.getAttribute(EA)), s = a.querySelector(`.${wA}`);
			if (s === null || t && !OA(e, o, r)) continue;
			let c = o === null ? "" : Li(o, e, n, r), l = e === "relative-date" ? zi(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= Fi(e) && o !== null;
		}
		i && fa(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${CA}:is([${TA}="relative"], [${TA}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function OA(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Ri(t, n) !== null;
}
//#endregion
//#region src/items/items-viewport.ts
function kA(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function AA(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${_}][${it}]`) : null;
}
function jA(e) {
	let t = kA(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - NA(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function MA(e, t) {
	let n = kA(e);
	n.scrollTop = n === e ? t : t + NA(e, n);
}
function NA(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/items/item-reveal.ts
var PA = /* @__PURE__ */ new Map();
function FA(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${_}]`)) if (t.closest(b) === e) return t;
	return null;
}
function IA(e, t, n, r) {
	let i = LA(e, t);
	return i !== null && (PA.set(e, {
		key: t,
		block: n
	}), RA(e, i, n, r), !0);
}
function LA(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function RA(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = kA(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = zA(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function zA(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function BA(e) {
	let t = PA.get(e);
	if (t === void 0) return;
	let n = LA(e, t.key);
	if (n === null) {
		PA.delete(e);
		return;
	}
	RA(e, n, t.block, "auto");
}
function VA(e) {
	PA.delete(e);
}
function HA(e) {
	if (!(PA.size === 0 || !(e instanceof Node))) for (let t of [...PA.keys()]) (!t.isConnected || kA(t).contains(e)) && PA.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var UA = "data-ui-scroll-anchor", WA = "End", GA = 4, KA = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], qA = /* @__PURE__ */ new WeakSet();
function JA(e) {
	qA.add(e);
}
function YA(e) {
	qA.delete(e);
}
var XA = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of KA) this.root.addEventListener(e, (e) => ZA(e), {
			capture: !0,
			passive: !0
		});
		P(this.root, `[${UA}="${WA}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [vt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !$A(t) || this.pinned.set(t, qA.has(t) || tj(t) && !ej(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${UA}="${WA}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), qA.has(t)) {
				this.pinned.set(t, !0), QA(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (ej(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), QA(t);
			}
		}
	}
	watchRows(e) {
		if (this.resizes === null) return;
		let t = this.watched.get(e), n = /* @__PURE__ */ new Set();
		for (let r of e.children) r.hasAttribute("data-ui-window-spacer") || (n.add(r), t?.has(r) !== !0 && this.resizes.observe(r));
		for (let e of t ?? []) n.has(e) || this.forget(e);
		this.watched.set(e, n);
	}
	handleResize(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = n.target, r = e.parentElement;
			if (!e.isConnected || r === null || !$A(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) qA.has(e) || this.pinned.get(e) !== !1 && !ej(e) ? QA(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function ZA(e) {
	HA(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${UA}="${WA}"]`) : null;
	t !== null && qA.delete(t);
}
function QA(e) {
	e.scrollTop = e.scrollHeight;
}
function $A(e) {
	return e.getAttribute(UA) === WA;
}
function ej(e) {
	return e.getAttribute(pt)?.toLowerCase() === "true";
}
function tj(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= GA;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var nj = `:is(.ui-surface, .ui-card)[${h}]`, rj = "ui-surface--clickable", ij = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), P(t, nj, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(nj));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(nj) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(rj)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), cj(e, "role", sj(e) ? "group" : "button"), cj(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : oj(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = aj(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.spaceOn = t);
	}
	handleKeyUp(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== " " || this.spaceOn === null) return;
		let t = this.spaceOn;
		this.spaceOn = null, e.target === t && (e.preventDefault(), t.click());
	}
};
function aj(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(rj) && t.hasAttribute("tabindex") ? t : null;
}
function oj(e) {
	let t = e.closest(ro);
	return t !== null && t.closest(k)?.matches(".ui-items-view, .ui-table") === !0 && np(t) === e;
}
function sj(e) {
	for (let t of e.querySelectorAll(ep)) if (rp(e, t)) return !0;
	return !1;
}
function cj(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var lj = `${$f}, [role='menu'], [role='tab']`, uj = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? dj, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(lj) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function dj(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function fj(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = mj(e, a, n), s = mj(e, a + 1, n);
	return hj(t, o.top, s.top, o.line, s.line);
}
function pj(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = mj(e, a, n), s = mj(e, a + 1, n);
	return hj(t, o.line, s.line, o.top, s.top);
}
function mj(e, t, n) {
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
function hj(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var gj = 250, _j = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(at);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < gj && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${at}="${ir(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${at}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = vj(e, "data-ui-scroll-viewport") ?? yj(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? xj(e) : null, a = i === null ? null : xj(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = pj(a, fj(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? bj(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function vj(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function yj(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : vj(e, _);
	return t === null ? null : kA(t);
}
function bj(e, t) {
	return t > 0 ? e / t : 0;
}
function xj(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${ot}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${st}]`);
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
var Sj = `.${Qn}, .ui-action, .${y}, .ui-select__option, .ui-language-switcher__choice`, Cj = "ui-key-value-action__row", wj = `${Sj}, ${`${ro}, .${Cj}`}`, Tj = "ui-pressing", Ej = "ui-press-held", Dj = "--ui-press-x", Oj = "--ui-press-y", kj = "--ui-ripple-radius", Aj = "--ui-ripple-opacity", jj = class {
	clicks;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.cancelAll(), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		if (t === null || typeof t.animate != "function" || ic()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(Dj, `${r}px`), t.style.setProperty(Oj, `${i}px`), t.classList.add(Tj, Ej);
		let o = t.animate([{ [kj]: "0px" }, { [kj]: `${a}px` }], {
			duration: N.ripple,
			easing: N.ease,
			fill: "forwards"
		});
		this.presses.set(e.pointerId, {
			element: t,
			started: performance.now(),
			grow: o,
			fade: null
		});
	}
	pressedElement(e) {
		let t = e.closest(wj);
		if (t === null || T(t)) return null;
		let n = e.closest(Yn);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(Sj) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (ip(t, e) !== null || E(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(k), r = n !== null && !e.classList.contains(Cj) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && e.hasAttribute("data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : A(e);
	}
	raisesClick(e, t) {
		for (let n = t; n !== null; n = n.parentElement) {
			if (n.hasAttribute("data-ui-id") && this.clicks(n)) return !0;
			if (n === e) return !1;
		}
		return !1;
	}
	release(e, t) {
		e instanceof PointerEvent && this.end(e.pointerId, t);
	}
	cancelAll() {
		for (let e of [...this.presses.keys()]) this.end(e, !0);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		n.element.classList.remove(Ej);
		let r = Math.max(0, N.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, N.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [Aj]: 1 }, { [Aj]: 0 }], {
			duration: N.normal,
			delay: i,
			easing: N.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(Tj, Ej), this.presses.get(e) === t && this.presses.delete(e);
	}
}, Mj = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), Nj = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], Pj = `.${Hn}, .${Un}`, Fj = RegExp(`(^|\\s)(${Hn}|${Un})(\\s|$)`), Ij = RegExp(`(^|\\s)${Wn}(\\s|$)`), Lj = "[type='range']", Rj = /* @__PURE__ */ new WeakSet(), zj = /* @__PURE__ */ new WeakSet();
function Bj(e = document) {
	let t = e === document ? window : e;
	for (let e of Nj) t.addEventListener(e, Jj, !0);
	t.addEventListener("keydown", Xj, !0), t.addEventListener("change", Zj, !0), t.addEventListener("pointerdown", Qj, !0), t.addEventListener("mousedown", Qj, !0), Gj(e.querySelectorAll(Pj)), Uj(e.querySelectorAll(`[${Vn}]`)), Hj(e.querySelectorAll(Lj)), new MutationObserver((e) => {
		for (let t of e) Vj(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Vn],
		attributeOldValue: !0
	});
}
function Vj(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			Wj(t, e.oldValue !== null);
			return;
		}
		let n = Fj.test(e.oldValue ?? ""), r = t.matches(Pj);
		n !== r && (Kj(t, r), Wj(t)), Ij.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && Hj(t.querySelectorAll(Lj));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(Pj) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && qj(n), n.matches(Pj) && Kj(n, !0), Gj(n.querySelectorAll(Pj)), Wj(n), Uj(n.querySelectorAll(`[${Vn}]`)), Hj([n, ...n.querySelectorAll(Lj)]));
}
function Hj(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = D(t);
		e !== Rj.has(t) && (e ? (Rj.add(t), t.addEventListener("touchstart", Qj, { passive: !1 })) : (Rj.delete(t), t.removeEventListener("touchstart", Qj)));
	}
}
function Uj(e) {
	for (let t of e) Wj(t);
}
function Wj(e, t = !1) {
	let n = e.getAttribute(Vn);
	n === null && !t || (e.matches(Pj) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Gu(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function Gj(e) {
	for (let t of e) Kj(t, !0);
}
function Kj(e, t) {
	for (let n of e.children) t ? qj(n) : zj.has(n) && (zj.delete(n), n.removeAttribute("inert"));
}
function qj(e) {
	e.hasAttribute("inert") || (zj.add(e), e.setAttribute("inert", ""));
}
function Jj(e) {
	e.target instanceof Element && (T(e.target) ? (e.type === "click" && ml(e), $j(e)) : e.type === "click" && Yj(e.target) && e.preventDefault());
}
function Yj(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && D(e);
}
function Xj(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && T(e.target)) {
			$j(e);
			return;
		}
		!Mj.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && D(e.target) && e.preventDefault();
	}
}
function Zj(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && D(e.target) && e.stopImmediatePropagation();
}
function Qj(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !D(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function $j(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var eM = /* @__PURE__ */ new WeakMap(), tM = new yl({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = eM.get(e);
		eM.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), nM = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => tM.popupOf(r) === t;
		return eM.set(t, n.onDismiss), tM.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (eM.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && tM.reposition(r);
			},
			close: () => {
				i() && tM.close(r);
			}
		};
	},
	focusReturn: (e) => ms(e)
};
//#endregion
//#region src/items/item-rows.ts
function rM(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Sg,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Oo(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var iM = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? sM(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), cM(l, n, t);
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
		let i = oM(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: C(r),
			item: t
		};
		return this.itemStackByRoot.set(r, i), this.fillRow?.(r), this.populateBoundElements(r, [...n, i]), r;
	}
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e, t) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [n, r] of this.translatableRowBindings) for (let i of e.querySelectorAll(r)) {
			let e = this.stackOf(i);
			aM(n, e) && this.applyBoundAttribute(i, String(S(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = S(t.bindingId);
			e.push([t, `[${Fe}${ar(n.propertyName)}="${ir(r)}"]`]);
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
		let r = fM(t, n.templateKeyPropertyName);
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
		r !== void 0 && vg(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : _g(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item has no such property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Ea(u, () => this.metadata.isTranslatable(a) && !yg(l)), f = S(a.componentId), p = e.closest(`[${h}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = cr(p, t, () => [e])[0] ?? null;
			if (n === null) continue;
			let r = this.extensions.converters.convert(t.converter, d);
			this.operations.apply({
				resolved: {
					componentId: f,
					propertyId: a.propertyId,
					propertyName: o.propertyName,
					dynamicParameters: [],
					component: p,
					definition: o,
					address: {
						component: {
							id: f,
							dynamicParameters: []
						},
						property: o.propertyName
					},
					bindingId: i,
					bindingSelector: null
				},
				operation: t,
				target: n,
				value: d,
				convertedValue: r,
				local: !1
			});
		}
	}
};
function aM(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = S(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function oM(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Cg(r, i.name) : Dg(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Og(r, i.key, n), e;
	let a = r;
	return a[wg(a, i.name)] = n, e;
}
function sM(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function cM(e, t, n) {
	e.setAttribute(g, t), dM(e, n), uM(e, n);
}
var lM = [
	["CanSelect", le],
	["CanDrag", ue],
	["CanRemove", de],
	["CanRename", fe],
	["CanShowContextMenu", pe]
];
function uM(e, t) {
	for (let [n, r] of lM) {
		let i = Cg(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function dM(e, t) {
	let n = Cg(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute($e, n.value) : e.removeAttribute($e);
}
function fM(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Cg(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var pM = "Group", mM = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = S(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), P(e.root, `[${tt}="${nt}"]`, { attributeFilter: [We] }, (e) => {
			for (let t of e) {
				let e = Wr(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), P(e.root, `[${rt}="windowed"]`, { attributeFilter: [mt] }, (e) => {
			for (let t of e) {
				let e = Wr(t);
				e !== null && this.sync(t, e);
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
			for (let [t, n] of e) t.isConnected && AO(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(S(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Eg(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${_}]`)) {
			if (Hg(r) !== "virtualized") continue;
			let i = r.closest(b);
			i === null || !this.drawsPatchedComponent(i, S(e.reference.componentId), t) || !hM(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(C(i), t) && this.sync(r, C(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${C(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? C(e) === n.scopeComponentId : C(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		AO(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${g}="${ir(t)}"]`)].filter((t) => this.isItemRoot(t) && Rr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${_}]`), i = r === null ? null : Wr(r);
		if (r !== null && i !== null && Hg(r) === "virtualized") {
			let a = e.getAttribute(g);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = gM(pM, t);
		a && dM(e, this.options.renderer.getItemValue(e)), lM.some(([e]) => gM(e, t)) && uM(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && gM(pM, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => gM(e.itemProperty, t)) || n.sorts.some((e) => gM(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${_}]`)) {
			let n = Wr(t);
			n === e && this.sync(t, n);
		}
	}
};
function hM(e, t) {
	let n = Lr(e, Ir(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function gM(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var _M = 50, vM = 1, yM = .5, bM = 60, xM = class {
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
			if (this.layout(t), EM(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = kM(e, ut);
		if (t !== null && $A(e) && SM(e.getAttribute("data-ui-window-more-after"))) {
			MA(e, Math.max(0, this.windowBottom(e, t) - jA(e).height));
			return;
		}
		t !== null && t !== 0 && MA(e, SM(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = TM(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : wM(n[n.length - 1]).bottom - wM(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = kM(e, ut), n = TM(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = jA(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Hg(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${_}][${rt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = AA(e.target);
		if (t === null || Hg(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, bM));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && EM(e) > 0) return;
		let n = TM(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = kM(e, ut), i = SM(e.getAttribute(ft)), a = SM(e.getAttribute(pt));
		if (r !== null) {
			let o = this.windowSize(e), s = jA(e), c = Math.max(1, Math.round(s.height * vM / t.itemSize), Math.floor(o * yM)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, DM(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, DM(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = jA(e), s = Math.max(1, o.height * vM), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, DM(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, DM(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = kM(e, dt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Wr(e);
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
				dynamicParameters: OM(e),
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
		let t = this.getState(e), n = TM(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			SO(e, "top", 0), SO(e, xO, 0);
			return;
		}
		if (n.length > 0) {
			let e = wM(n[n.length - 1]).bottom - wM(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / CM(n))));
		}
		let r = kM(e, dt), i = kM(e, ut), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		SO(e, "top", a), SO(e, xO, o), BA(e);
	}
	windowSize(e) {
		let t = kM(e, lt);
		return t !== null && t > 0 ? t : _M;
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
function SM(e) {
	return e !== null && e.toLowerCase() === "true";
}
function CM(e) {
	let t = wM(e[0]).top, n = 1;
	for (; n < e.length && wM(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function wM(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function TM(e) {
	return [...e.children].filter((e) => e.hasAttribute(g));
}
function EM(e) {
	return TM(e).length;
}
function DM(e) {
	return e.getAttribute(g);
}
function OM(e) {
	let t = e.closest(b);
	return t === null ? [] : Lr(t, Ir(t));
}
function kM(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var AM = [
	h,
	se,
	ce
];
function jM(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, MM(c, e.itemRole);
	let l = PM(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = NM(l, t, n, a);
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
		d.className = l.wrapperClassName, MM(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), cM(d, r, n), c.appendChild(d);
	}
	return cM(c, r, n), o.registerItemScope(c, l, n), c;
}
function MM(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function NM(e, t, n, r) {
	let i = fM(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function PM(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of AM) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), C(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function FM(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return IM(i.renderer.renderItem(e, t, n, r), a);
	let s = jM(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), IM(s, a);
}
function IM(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var LM = 6, RM = 60, zM = class {
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
		let n = $A(e) && tj(e);
		this.project(e, t), this.layout(e, t), n && !tj(e) && (MA(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Rs(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = L(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Ro(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = oM(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Ag(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Pg(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Mg(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => UM(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Ig(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = UM(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Ig(e.item, t.item, a))), e !== "" && l.push({
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
		let t = AA(e.target);
		if (t === null || Hg(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, RM));
	}
	layout(e, t) {
		let n = t.projected, r = GM(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (WM(e) && a > 0) {
			let r = jA(e), c = VM(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - LM), s = Math.min(a, s + LM);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(UM(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), HM(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				r.header && bO(a, r.entry.key), l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (HM(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of L(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ze}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = KM(i, 0, o), p = KM(i, s, a);
		CO(e, [...l, ...pg(mg(e))]), SO(e, "top", f > 0 ? f - r : 0), SO(e, xO, p > 0 ? p - r : 0), hg(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return FM(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && bO(r, t.key), r;
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(UM(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (BM(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(UM(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Gr(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of L(e)) {
			let e = t.getAttribute(g);
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
function BM(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function VM(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (MA(e, i + s), i + s);
}
function HM(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = UM(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function UM(e) {
	let t = Cg(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function WM(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function GM(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function KM(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var qM = "data-ui-template", JM = "default", YM = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? JM, r = this.findTemplate(e, n);
		return r === void 0 ? n === JM ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${qM}]`);
		for (let e of r) if (e.getAttribute(qM) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= XM(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Je);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Ye);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function XM(e) {
	let t = /* @__PURE__ */ new Set();
	return Ta(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(b)) {
			let n = C(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function ZM(e, t) {
	let n = e.querySelector(`style[${Sn}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Sn, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var QM = "script[type='application/json'][data-ui-metadata]";
function $M(e = document) {
	let t = e.querySelector(QM);
	if (t === null) return eN();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return eN();
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
function eN() {
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
var tN = "script[type='application/json'][data-ui-hydration]";
function nN(e) {
	return e !== null && ($i(e.title) || $i(e.changes));
}
function rN(e = document) {
	let t = e.querySelector(tN)?.textContent?.trim() ?? "";
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
var iN = "reconnecting";
async function aN(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), iN;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function oN(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var sN = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(cN(lN(e)));
	}
	async dispatchAsync(e) {
		let t = lN(e), n = cN(t);
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
function cN(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function lN(e) {
	return {
		eventId: S(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var uN = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Rs(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = dN(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(fN([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(dN(e, t));
		let n = this.unplaced.get(fN(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = dN(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(fN([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = fN(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, fN(t.slice(0, e - 1)));
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
		return `${S(e.componentId)}:${e.propertyId}:${pN(t)}`;
	}
};
function dN(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function fN(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function pN(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var mN = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, hN = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, gN = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, _N = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, vN = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, yN = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, bN = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, xN = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, SN = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, CN = class {
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
}, K;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(K ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var wN = class {
	constructor() {}
	log(e, t) {}
};
wN.instance = new wN();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var TN = "10.0.11", q = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, J = class e {
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
function EN(e, t) {
	let n = "";
	return ON(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${DN(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function DN(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function ON(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function kN(e, t, n, r, i, a) {
	let o = {}, [s, c] = NN();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${EN(i, a.logMessageContent)}.`);
	let l = ON(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(K.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function AN(e) {
	return e === void 0 ? new MN(K.Information) : e === null ? wN.instance : e.log === void 0 ? new MN(e) : e;
}
var jN = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, MN = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${K[e]}: ${t}`;
			switch (e) {
				case K.Critical:
				case K.Error:
					this.out.error(n);
					break;
				case K.Warning:
					this.out.warn(n);
					break;
				case K.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function NN() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, PN(TN, FN(), LN(), IN())];
}
function PN(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function FN() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function IN() {
	if (J.isNode) return process.versions.node;
}
function LN() {
	return J.isNode ? "NodeJS" : "Browser";
}
function RN(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function zN() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var BN = class extends CN {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(zN());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new gN();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new gN();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new hN();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, ON(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(K.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new mN(await VN(i, "text") || i.statusText, i.status);
		let a = await VN(i, e.responseType);
		return new SN(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function VN(e, t) {
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
var HN = class extends CN {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new gN()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (ON(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new gN());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new SN(r.status, r.statusText, r.response || r.responseText)) : n(new mN(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new mN(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new hN());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, UN = class extends CN {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new BN(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new HN(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new gN()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, WN = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
WN.RecordSeparatorCode = 30, WN.RecordSeparator = String.fromCharCode(WN.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var GN = class {
	writeHandshakeRequest(e) {
		return WN.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (ON(e)) {
			let r = new Uint8Array(e), i = r.indexOf(WN.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(WN.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = WN.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var KN = class {
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
		return this.observers.push(e), new jN(this, e);
	}
}, qN = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			ON(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new JN(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, ON(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === Y.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: Y.Sequence,
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
			case Y.Invocation:
			case Y.StreamItem:
			case Y.Completion:
			case Y.StreamInvocation:
			case Y.CancelInvocation: return !0;
			case Y.Close:
			case Y.Sequence:
			case Y.Ping:
			case Y.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: Y.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, JN = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, YN = 3e4, XN = 15e3, ZN = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var QN = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? YN, this.keepAliveIntervalInMilliseconds = a ?? XN, this._statefulReconnectBufferSize = o ?? ZN, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new GN(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
		if (this._connectionState !== X.Disconnected && this._connectionState !== X.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== X.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = X.Connecting, this._logger.log(K.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), J.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = X.Connected, this._connectionStarted = !0, this._logger.log(K.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = X.Disconnected, this._logger.log(K.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(K.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(K.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new qN(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(K.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === X.Disconnected) return this._logger.log(K.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === X.Disconnecting) return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new gN("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new KN();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === Y.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === Y.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case Y.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(K.Error, `Invoke client method threw error: ${RN(e)}`);
					});
					break;
				case Y.StreamItem:
				case Y.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === Y.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(K.Error, `Stream callback threw error: ${RN(e)}`);
						}
					}
					break;
				}
				case Y.Ping: break;
				case Y.Close: {
					this._logger.log(K.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case Y.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case Y.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(K.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(K.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(K.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(K.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === X.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === X.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(K.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(K.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(K.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(K.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(K.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(K.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new gN("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = X.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), J.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(K.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(K.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = X.Reconnecting, e ? this._logger.log(K.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(K.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(K.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== X.Reconnecting) {
				this._logger.log(K.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(K.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== X.Reconnecting) {
				this._logger.log(K.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = X.Connected, this._logger.log(K.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(K.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(K.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== X.Reconnecting) {
					this._logger.log(K.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === X.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(K.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(K.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${RN(t)}`);
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
			type: Y.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: Y.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: Y.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: Y.Invocation
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
			type: Y.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: Y.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: Y.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: Y.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: Y.Completion
		} : {
			invocationId: e,
			result: n,
			type: Y.Completion
		};
	}
	_createCloseMessage() {
		return { type: Y.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, $N = [
	0,
	2e3,
	1e4,
	3e4,
	null
], eP = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? $N : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, tP = class {};
tP.Authorization = "Authorization", tP.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var nP = class extends CN {
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
		e.headers ||= {}, this._accessToken ? e.headers[tP.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[tP.Authorization] && delete e.headers[tP.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var rP;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(rP ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var iP = class {
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
}, aP = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new iP(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, rP, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === rP.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = NN(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === rP.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new mN(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${EN(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new mN(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof hN ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? kN(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = NN();
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
			i ? i instanceof mN && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(K.Trace, e), this.onclose(this._closeError);
		}
	}
}, oP = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, rP, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== rP.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = NN();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${EN(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(K.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? kN(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, sP = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, rP, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = NN();
				t[r] = i, n && (t[tP.Authorization] = `Bearer ${n}`), o && (t[tP.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === rP.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${EN(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${EN(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(K.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, cP = 100, lP = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = AN(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new nP(n.httpClient || new UN(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= rP.Binary, q.isIn(e, rP, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${rP[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new gN(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new gN(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new dP(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(K.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(K.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === Z.WebSockets) this.transport = this._constructTransport(Z.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new gN("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < cP);
				if (r === cP && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof aP && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = NN();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(K.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new bN("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof mN && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new bN(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(K.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new yN(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new gN(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new xN(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new sP(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new oP(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new aP(this._httpClient, this._logger, this._options);
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
		let i = Z[e.transport];
		if (i == null) return this._logger.log(K.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (uP(t, i)) {
			if (e.transferFormats.map((e) => rP[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new _N(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${rP[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${rP[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new vN(`'${Z[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(K.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(K.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(K.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(K.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(K.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(K.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(K.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!J.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(K.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function uP(e, t) {
	return !e || (t & e) !== 0;
}
var dP = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new fP(), this._transportResult = new fP(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new fP(), this._transportResult.promise;
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
			this._sendBufferedData = new fP();
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
}, fP = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, pP = "json", mP = class {
	constructor() {
		this.name = pP, this.version = 2, this.transferFormat = rP.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = wN.instance);
		let n = WN.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case Y.Invocation:
					this._isInvocationMessage(n);
					break;
				case Y.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case Y.Completion:
					this._isCompletionMessage(n);
					break;
				case Y.Ping: break;
				case Y.Close: break;
				case Y.Ack:
					this._isAckMessage(n);
					break;
				case Y.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(K.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return WN.write(JSON.stringify(e));
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
}, hP = {
	trace: K.Trace,
	debug: K.Debug,
	info: K.Information,
	information: K.Information,
	warn: K.Warning,
	warning: K.Warning,
	error: K.Error,
	critical: K.Critical,
	none: K.None
};
function gP(e) {
	let t = hP[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var _P = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), vP(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = gP(e);
			this.logger = new MN(t);
		} else this.logger = new MN(e);
		return this;
	}
	withUrl(e, t) {
		return q.isRequired(e, "url"), q.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return q.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new eP(e) : e : new eP(), this;
	}
	withServerTimeout(e) {
		return q.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return q.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new lP(this.url, e);
		return QN.create(t, this.logger || wN.instance, this.protocol || new mP(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function vP(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var yP = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, bP = class {
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
}, xP = class {
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
}, SP = 500;
function CP(e) {
	let { changes: t, ...n } = e;
	return n;
}
function wP() {
	return {};
}
var TP = class {
	windowId;
	connection;
	started = !1;
	gate = new bP();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new xP(t), this.connection = new _P().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(K.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.connection.state === X.Reconnecting;
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
		if (!(this.started || this.connection.state !== X.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== X.Disconnected && (await this.connection.stop(), this.started = !1);
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, CP));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, CP));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, wP, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new yP(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", [{ theme: e }]);
	}
	async setThemeColorsAsync(e) {
		return (await this.invokeAsync("SetThemeColorsAsync", [{ colors: e }]))?.css ?? "";
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, wP));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), SP);
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
		if (this.connection.state !== X.Connected) {
			if (this.connection.state === X.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, EP = "/_ne/values", DP = 3e4;
function OP(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function kP(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function AP(e, t = DP) {
	if (e === void 0 || !kP(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${EP}/${encodeURIComponent(n)}`, {
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
async function jP(e) {
	let t = await fetch(EP, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(DP)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var MP = Promise.resolve(), NP = () => {}, PP = class {
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
		if (this.handed >= this.given) return MP;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	get isBusy() {
		return this.flight !== null || this.queue.length > 0;
	}
	async whenAnsweredAsync() {
		for (; this.flight !== null;) await this.flight.catch(NP);
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = OP(e.value), r = n === null ? null : jP(n);
		return r?.catch(NP), new Promise((i, a) => {
			let o = FP(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, IP(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof yP) {
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
		let t = this.transport.whenAttached().then(() => jP(e));
		return t.catch(NP), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function FP(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function IP(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var LP = "form-owner", RP = "ui-form-";
function zP(e) {
	return RP + e.replace(/[ \t\n\f\r]/g, "_");
}
function BP(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = zP(t);
	HP(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function VP(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(RP) && HP(e);
	}
}
function HP(e) {
	let t = UP();
	if (t.querySelector(`form[id="${ir(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function UP() {
	let e = document.body.querySelector(`[${_t}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(_t, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var WP = document;
function GP() {
	try {
		return WP.execCommand("copy");
	} catch {
		return !1;
	}
}
function KP(e) {
	try {
		return typeof WP.execCommand == "function" && WP.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/insert-text.ts
function qP(e, t, n) {
	let r = e.itemKey === !0 ? JP(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = YP(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	XP(i, r);
}
function JP(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function YP(e) {
	if (Ka(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Ka(t)) return t;
	return null;
}
function XP(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || T(e) || D(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && KP(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function ZP(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = QP(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function QP(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, $P(e));
	return t.toString();
}
function $P(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function eF(e, t) {
	let n = nF([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return nF(r, t) ?? tF(t);
}
function tF(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && rF(t, e) ? t : null;
}
function nF(e, t) {
	let n = null;
	for (let r of e) if (zx(r, t)) {
		if (rF(r, t)) return r;
		n ??= r;
	}
	return n;
}
function rF(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var iF = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	navigate;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(wr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = wr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = ZP(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Yu(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Or(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(xn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = oF(e);
			t !== null && cF(t);
		}), this.register("ScrollTo", (e) => {
			let t = oF(e);
			if (t === null) return;
			let n = e.effect, r = Tr(n.behavior), i = Er(n.block);
			t.scrollIntoView({
				behavior: sF(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = oF(e);
			if (t === null) return;
			let n = e.effect, r = FA(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Er(n.block);
			YA(kA(r)), IA(r, n.key, i === "Unknown" ? "Start" : i, sF(Tr(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = oF(e);
			if (t === null) return;
			let n = e.effect, r = kr(n.axis) !== "Horizontal", i = eF(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Dr(n.position), u;
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
			let d = sF(Tr(n.behavior)), f = AA(i);
			f !== null && VA(f), r && l === "End" && $A(i) && JA(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			aF(oF(e), null);
		}), this.register("Hide", (e) => {
			aF(oF(e), "hidden");
		}), this.register("Collapse", (e) => {
			aF(oF(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = lF(e, this.valueReaders);
			t !== null && uF(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = oF(e);
			t !== null && qP(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = oF(e);
			t !== null && !vu(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Gu(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Yi(t.message) && !Xi(t.message)) {
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
function aF(e, t) {
	if (e !== null) for (let n of zn) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function oF(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(S(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function sF(e) {
	return e === "Smooth" && !ic() ? "smooth" : "auto";
}
function cF(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(zo))) {
		e.focus();
		return;
	}
	let t = ts(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function lF(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = oF(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : za(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Na(t.readHeld(r));
}
async function uF(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!dF(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function dF(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return GP();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var fF = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = ts(t), i = Qo() && Ka(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = ds(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && vs(ms(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Xc}="${ir(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Qc}]`);
		if (n === null) return;
		let r = n.closest(`[${Xc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Xc);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !pl() && !al(e.target) && !Jf(e.target)) {
				let n = t.getAttribute(Xc);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(b)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return tl(this.root);
	}
	trapTab(e, t) {
		let n = rs(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = os(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, pF = "ui-leave", mF = new jd("data-ui-leave-part"), hF = "560px", gF = null, _F = null;
function vF(e, t) {
	gF ??= yF();
	let n = gF;
	n.isConnected || document.body.append(n), bF(n, "title", w.text("ui.leave.title")), bF(n, "message", w.text("ui.leave.message")), bF(n, "stay", w.text("ui.leave.stay")), bF(n, "leave", w.text("ui.leave.confirm")), _F = {
		dialogs: e,
		leave: t
	}, e.open(pF);
}
function yF() {
	let { dialog: e, surface: t } = Ad({
		key: pF,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", hF);
	let n = mF.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = mF.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, mF.actions(mF.button("ui-button--outline", "stay"), mF.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = mF.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = _F;
		_F = null, n?.dialogs.close(pF), t === "leave" && n?.leave();
	}), e;
}
function bF(e, t, n) {
	let r = mF.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var xF = class {
	options;
	holds = !1;
	guards = !1;
	asking = !1;
	deciding = !1;
	released = !1;
	beforeUnload = (e) => {
		(this.holds || this.options.pending()) && e.preventDefault();
	};
	constructor(e) {
		this.options = e, e.window.addEventListener("click", (e) => this.handlePress(e)), e.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.rearm();
		});
	}
	get holdsUnsavedWork() {
		return this.holds;
	}
	set(e) {
		this.holds !== e && (this.holds = e, e && (this.guards = !0), this.guards && !this.released && this.options.window.addEventListener("beforeunload", this.beforeUnload));
	}
	navigate(e) {
		if (this.deciding || this.released || !this.holds && !this.options.pending()) {
			this.leave(e);
			return;
		}
		this.decideAsync(e);
	}
	confirm(e) {
		this.options.confirm(e, () => this.leave(e));
	}
	leave(e) {
		this.release(), this.options.window.location.assign(e);
	}
	release() {
		this.released = !0, this.options.window.removeEventListener("beforeunload", this.beforeUnload);
	}
	rearm() {
		this.released = !1, this.guards && this.options.window.addEventListener("beforeunload", this.beforeUnload);
	}
	handlePress(e) {
		if (this.released || !this.holds && !this.options.pending()) return;
		let t = SF(e, this.options.window.location.href);
		t !== null && (e.preventDefault(), this.decideAsync(t));
	}
	async decideAsync(e) {
		if (this.asking) return;
		this.asking = !0;
		let t;
		try {
			this.holds || await this.options.settle(), t = await this.options.ask(e);
		} catch (t) {
			s("the controller could not be asked about leaving the page; the page asks the reader itself.", t), this.confirm(e);
			return;
		} finally {
			this.asking = !1;
		}
		this.deciding = !0;
		try {
			this.options.apply(t);
		} finally {
			this.deciding = !1;
		}
	}
};
function SF(e, t) {
	if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return null;
	let n = e.target, r = typeof n?.closest == "function" ? n.closest("a[href]") : null;
	if (r === null || r.hasAttribute("download")) return null;
	let i = r.getAttribute("target");
	if (i !== null && i !== "" && i.toLowerCase() !== "_self") return null;
	let a, o;
	try {
		o = new URL(t), a = new URL(r.getAttribute("href") ?? "", o);
	} catch {
		return null;
	}
	if (a.origin !== o.origin || a.hash.length > 0 && a.pathname === o.pathname && a.search === o.search) return null;
	let s = `${a.pathname}${a.search}${a.hash}`;
	return Yu(s) ? s : null;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var CF = /* @__PURE__ */ new Map([
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
]), wF = [
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
function TF(e) {
	return Q(e, wF);
}
var EF = [
	"small",
	"medium",
	"large"
], DF = ["default", "circle"], OF = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], kF = [
	"start",
	"center",
	"end",
	"justify"
], AF = ["nowrap", "wrap"], jF = /* @__PURE__ */ new Map([
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
]), MF = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), NF = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), PF = ["inline", "trailing"], FF = [
	"filled",
	"outline",
	"underline",
	"ghost"
], IF = [
	"small",
	"medium",
	"large"
], LF = [
	"small",
	"medium",
	"large"
], RF = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], zF = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], BF = ["light", "dark"], VF = [
	"start",
	"center",
	"end",
	"stretch"
], HF = ["clip", "visible"], UF = [
	"visible",
	"hidden",
	"collapsed"
], WF = [
	"background",
	"raised",
	"tinted"
], GF = ["horizontal", "vertical"], KF = [
	"none",
	"gap",
	"rule"
], qF = [
	"none",
	"one",
	"many"
], JF = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], YF = ["stack", "wrap"], XF = ["end", "start"], ZF = [
	"disabled",
	"auto",
	"always"
], QF = [
	"disabled",
	"proximity",
	"mandatory"
], $F = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], eI = ["hex", "rgb"], tI = ["field", "swatch"], nI = [
	"fill",
	"contain",
	"cover",
	"none"
], rI = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], iI = ["default", "circle"], aI = ["uniform", "vignette"], oI = ["linear", "circular"], sI = [
	"none",
	"vertical",
	"horizontal",
	"both"
], cI = [
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
], lI = [
	"None",
	"Shade",
	"Tint"
], uI = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, wF)}`],
	["themeColorClass", (e) => HI(e)],
	["iconClass", (e) => md(e)],
	["iconUrlCss", (e) => od(e)],
	["safeUrl", (e) => Ku(e)],
	["safeImageSource", (e) => td(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : mb(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, EF)}`],
	["iconShapeClass", (e) => Q(e, DF) === "circle" ? "ui-icon--circle" : ""],
	["textTypeClass", (e) => `ui-text-type--${Q(e, OF)}`],
	["textAppearanceClass", (e) => ZI(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, kF)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, AF)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, PF)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, zF)}`],
	["badgeTextFit", (e) => UI(e)],
	["buttonClass", (e) => `ui-button--${Q(e, RF)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, WF)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, GF)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, KF)}`],
	["selectionModeAttribute", (e) => Q(e, qF)],
	["selectionBackgroundCss", (e) => FI(MI(e, "background"))],
	["selectionForegroundCss", (e) => FI(MI(e, "foreground"))],
	["selectionMarkColorCss", (e) => FI(MI(e, "markColor"))],
	["selectionMarkCss", (e) => PI(MI(e, "mark"))],
	["selectionFontWeightCss", (e) => NI(MI(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, YF)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, XF)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, ZF)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, ZF)}`],
	["hostViewport", (e) => SI(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, QF)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, FF)}`],
	["searchFieldAppearanceClass", (e) => `ui-search__field--${Q(e, FF)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, LF)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, IF)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, IF)}`],
	["textInputTypeAttribute", (e) => Q(e, $F)],
	["colorTextFormatAttribute", (e) => Q(e, eI)],
	["colorInputVariantAttribute", (e) => Q(e, tI)],
	["themeNameCss", (e) => Q(e, BF)],
	["alignmentCss", (e) => Q(e, VF)],
	["alignmentStretchFallbackCss", (e) => Q(e, VF) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, HF)],
	["layoutLengthCss", (e) => CI(e)],
	["thicknessCss", (e) => TI(e)],
	["borderNoneClass", (e) => DI(e)],
	["radiusCss", (e) => OI(e)],
	["gridUnitCss", (e) => kI(e)],
	["pixelsCss", (e) => sL(e)],
	["gridTemplateCss", (e) => AI(e)],
	["colorVariantCss", (e) => tL(e)],
	["themeColorCss", (e) => FI(e)],
	["themeInkCss", (e) => LI(e)],
	["themeOnColorCss", (e) => zI(e)],
	["themeColorInlineCss", (e) => II(e) ? "" : FI(e)],
	["themeColorCanonical", (e) => $I(e)],
	["textAppearanceFontSizeCss", (e) => QI(e, "size")],
	["textAppearanceFontWeightCss", (e) => QI(e, "weight")],
	["textAppearanceLineHeightCss", (e) => QI(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => QI(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => CI(U(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => CI(U(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => CI(U(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => CI(U(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => CI(U(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => wI(U(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => wI(U(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => wI(U(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => wI(U(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => wI(U(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => wI(U(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => wI(U(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => wI(U(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => wI(U(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => wI(U(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => TI(U(e, "base"))],
	["responsiveThicknessSmCss", (e) => TI(U(e, "sm"))],
	["responsiveThicknessMdCss", (e) => TI(U(e, "md"))],
	["responsiveThicknessXlCss", (e) => TI(U(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => TI(U(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => EI(U(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => EI(U(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => EI(U(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => EI(U(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => EI(U(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => EI(U(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => EI(U(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => EI(U(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => EI(U(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => EI(U(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => cL(U(e, "base"))],
	["responsivePixelsSmCss", (e) => cL(U(e, "sm"))],
	["responsivePixelsMdCss", (e) => cL(U(e, "md"))],
	["responsivePixelsXlCss", (e) => cL(U(e, "xl"))],
	["responsivePixelsXxlCss", (e) => cL(U(e, "xxl"))],
	["visibilityBaseAttribute", (e) => lL(e, "base")],
	["visibilitySmAttribute", (e) => lL(e, "sm")],
	["visibilityMdAttribute", (e) => lL(e, "md")],
	["visibilityXlAttribute", (e) => lL(e, "xl")],
	["visibilityXxlAttribute", (e) => lL(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, nI)}`],
	["imageShapeClass", (e) => Q(e, iI) === "circle" ? "ui-image--circle" : ""],
	["backgroundImageCss", (e) => mI(e)],
	["backgroundImageAttribute", (e) => mI(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => Q(e, rI)],
	["backgroundImageDimCss", (e) => hI(e)],
	["backgroundImageDimModeAttribute", (e) => Q(e, aI) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => _I(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => _I(e) ? "" : void 0],
	["positiveCount", (e) => gI(e)?.toString()],
	["positiveFlagAttribute", (e) => gI(e) === void 0 ? void 0 : ""],
	["maxLinesClass", (e) => gI(e) === void 0 ? "" : "ui-text--max-lines"],
	["progressVariantClass", (e) => `ui-progress--${Q(e, oI)}`],
	["progressValueText", (e) => oL(e)],
	["textAreaResizeCss", (e) => Q(e, sI)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, cI)}`],
	["popupPlacementAttribute", (e) => Q(e, cI)],
	["tabMenuEntriesAttribute", (e) => fI(e)],
	["markedDaysAttribute", (e) => pI(e)]
]), dI = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function fI(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = dI.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function pI(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function mI(e) {
	return od(e);
}
function hI(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function gI(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function _I(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var vI = [
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
], yI = new Map(vI.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), bI = new Map(vI.map(([e, t]) => [e, t])), xI = /* @__PURE__ */ new Map([[HF, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : xI.get(t)?.get(e)) ?? CF.get(e) ?? ar(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function SI(e) {
	return e == null || Q(e, ZF) === "disabled" ? void 0 : "parent";
}
function CI(e) {
	if (e == null) return "";
	if (typeof e == "number") return sL(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? sL(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function wI(e, t) {
	if (typeof e != "object" || !e) return CI(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? CI(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function TI(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function EI(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return sL(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return sL(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function DI(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function OI(e) {
	if (e == null) return "";
	if (typeof e == "number") return sL(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? sL(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function kI(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return sL(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function AI(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return kI(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return kI(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${kI(e[0])})` : e.map((e) => kI(e)).join(" ");
}
function $(e, t, n) {
	return jI(U(e, t), n);
}
function jI(e, t) {
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
function MI(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function NI(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function PI(e) {
	if (e == null) return "";
	switch (Q(e, JF)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function FI(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (eL(e)) return tL(e);
	let t = e, n = tL(t.light), r = tL(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = jF.get(Q(o, wF));
	return s ? `var(${s})` : "";
}
function II(e) {
	if (typeof e != "object" || !e || eL(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function LI(e) {
	if (II(e)) {
		let t = MF.get(Q(e.style, wF));
		if (t !== void 0) return `var(${t})`;
	}
	return FI(e);
}
var RI = /* @__PURE__ */ new Set(["background", "surface"]);
function zI(e) {
	if (typeof e != "object" || !e) return "";
	if (eL(e)) return BI(e) ? "initial" : VI(e);
	let t = e, n = VI(t.light ?? t.dark), r = VI(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && BI(t.light ?? t.dark) && BI(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, wF);
	if (RI.has(i)) return "initial";
	let a = NF.get(i);
	return a ? `var(${a})` : "";
}
function BI(e) {
	return nL(e)?.[3] === 0;
}
function VI(e) {
	let t = nL(e);
	return t === void 0 ? "" : IE(t[0], t[1], t[2], t[3]);
}
function HI(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, wF)}`;
}
function UI(e) {
	let t = qI(e == null ? "" : String(e).trim(), WI + 1);
	return t > 0 && t <= WI ? "compact" : "";
}
var WI = 2, GI = /[\u0300-\uFFFF]/, KI = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function qI(e, t) {
	if (!GI.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of KI.segment(e)) {
		if (n >= t) break;
		n += JI(r) ? 2 : 1;
	}
	return n;
}
function JI(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < YI.length; e += 2) if (t >= YI[e] && t <= YI[e + 1]) return !0;
	return !1;
}
var YI = [
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
function XI(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Me, UI(n)), e.setAttribute(Ne, "");
}
function ZI(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, OF)}`;
}
function QI(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return sL(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : sL(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : sL(e);
		}
		default: return "";
	}
}
function $I(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = rL(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${FE(r.rgb >> 16 & 255)}${FE(r.rgb >> 8 & 255)}${FE(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${FE(e)}`;
	}
	let i = iL(r.name);
	return i === null ? "" : `${i}/${aL(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function eL(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function tL(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = nL(e);
	return t === void 0 ? "" : `#${FE(t[0])}${FE(t[1])}${FE(t[2])}${FE(t[3])}`;
}
function nL(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = iL(t.name), i = n ?? (r === null ? void 0 : yI.get(r));
	if (!i) return;
	let a = aL(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = W(c * (1 - o)), l = W(l * (1 - o)), u = W(u * (1 - o))) : a === "Tint" && (c = W(c + (255 - c) * o), l = W(l + (255 - l) * o), u = W(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function rL(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = wF[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function iL(e) {
	if (typeof e == "number") return bI.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function aL(e) {
	if (typeof e == "number") return lI[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function oL(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function sL(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function cL(e) {
	return e == null ? "" : sL(e);
}
function lL(e, t) {
	let n = wC(e, t);
	if (n == null) return;
	let r = Q(n, UF);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var uL = "ui-notification-host", dL = "ui-notification", fL = "ui-notification--leaving", pL = "ui-notification__message", mL = "ui-notification__action", hL = "ui-notification__close", gL = 5e3, _L = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), vL = class {
	root;
	durationMs;
	host = null;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? gL, this.ensureHost();
	}
	show(e) {
		let t = TF(e.severity), n = document.createElement("div");
		n.className = _L.has(t) ? `${dL} ${dL}--${t}` : dL, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = pL, typeof e.message == "string" ? r.textContent = e.message : w.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		if (i.type = "button", i.className = hL, w.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(bL(e.action)), this.ensureHost().append(n), n.addEventListener("focusin", (e) => {
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
		if (!(!e.isConnected || e.classList.contains(fL))) {
			if (e.classList.add(fL), this.returnFocus(e), ic() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => yL(e), N.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(fL));
		vs(ms(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${hL}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${uL}`), n = t ?? document.createElement("div");
		return n.classList.add(uL), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function yL(e) {
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
		duration: N.fast,
		easing: N.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function bL(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${mL} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var xL = class {
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
		!this.state.set(e, t, n, CL(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Ea(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Le), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, CL(r[0]?.component)) ? {
			reference: e,
			propertyName: r[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: this.shownValue(e, n),
			local: !0,
			components: r.map((e) => e.component)
		} : null;
	}
	rewriteWords(e) {
		for (let t of [...this.state.entries()]) {
			let n = t.value;
			(typeof n == "string" || Xi(n) ? this.addressResolver.isTranslatable(t.reference) : Yi(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Ie}${ar(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of cr(e, t, () => SL(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Le))), r = e.closest(b);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Le)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			Ua(e);
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
function SL(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(b) === e) return [n];
	return [e];
}
function CL(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(b) ?? null, r = e === null ? 0 : C(e), i = n.getAttribute(g);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Lr(e, Ir(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var wL = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of xs) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = S(e.componentId), r = TL(n, e.propertyId), i = this.watchers.get(r);
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
		let n = Wr(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = TL(S(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function TL(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function EL(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : C(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var DL = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, OL(t));
	}
	apply(e) {
		let t = S(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), xr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) kL(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) AL(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) jL(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) ML(n, t.key, t.newIndex);
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
function OL(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function kL(e, t) {
	typeof t.key == "string" && (AL(e, t.key), e.splice(NL(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function AL(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function jL(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		kL(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function ML(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(NL(n, e.length), 0, i);
}
function NL(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/pending-moves.ts
var PL = class {
	mover;
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.mover = e;
	}
	ahead(e, t, n) {
		let r = this.mover.indexOf(e, t);
		if (r === null) return null;
		let i = {
			host: e,
			key: t,
			index: n
		}, a = this.waiting.get(e);
		return a === void 0 && (a = [], this.waiting.set(e, a)), this.mover.move(e, t, n), a.push({
			move: i,
			from: r
		}), i;
	}
	settle(e) {
		let t = this.waiting.get(e.host), n = t?.findIndex((t) => t.move === e) ?? -1;
		if (!(t === void 0 || n < 0)) {
			if (!e.host.isConnected) {
				t.splice(n, 1);
				return;
			}
			this.rebase(e.host, t, () => t.splice(n, 1));
		}
	}
	around(e, t, n) {
		let r = this.waiting.get(e);
		if (r === void 0 || r.length === 0) {
			n();
			return;
		}
		this.rebase(e, r, () => {
			n();
			for (let e of t) {
				let t = r.findIndex((t) => t.move.key === e);
				t >= 0 && r.splice(t, 1);
			}
		});
	}
	rebase(e, t, n) {
		for (let n = t.length - 1; n >= 0; n--) this.mover.move(e, t[n].move.key, t[n].from);
		n();
		for (let n = 0; n < t.length;) {
			let r = t[n], i = this.mover.indexOf(e, r.move.key);
			if (i === null) {
				t.splice(n, 1);
				continue;
			}
			r.from = i, this.mover.move(e, r.move.key, r.move.index), n++;
		}
		t.length === 0 && this.waiting.delete(e);
	}
}, FL = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function IL(e, t, n, r) {
	return {
		action: xr(e.action),
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
var LL = [], RL = class {
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
	pageHandlers = [];
	held = new DL();
	moves = new PL({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${_}]`)) {
			let e = Wr(n);
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
			return n === void 0 && (n = KL(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${_}]`)) {
			let t = Gr(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(t.componentId, n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (Cr(t) !== "CollectionChange") continue;
			let e = t;
			if (xr(e.action) !== "Insert") continue;
			let r = S(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, GL(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of EL(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${_}]`)) {
			let t = Wr(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		AO(e, t, {
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
				let r = UL(n, t[e + 1]);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Ue) === !0;
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
		this.moves.around(e, LL, () => this.refillHostRows(e, t));
	}
	refillHostRows(e, t) {
		if (Hg(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = KL(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && Rs(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), WL(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	addPageHandler(e) {
		this.pageHandlers.push(e);
	}
	applyUpdate(e) {
		switch (Cr(e)) {
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
			case "Page":
				for (let t of this.pageHandlers) t(e);
				return;
			default:
				s("server update is not supported by update processor yet.", e);
				return;
		}
	}
	applyValueUpdate(e) {
		let t = S(e.address?.component?.id), n = Sr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (S(e.address?.component?.id) <= 0) {
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
		let t = S(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, IL(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (xr(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = xr(e.action) === "Move" ? VL(e.moves ?? []) : LL;
		for (let n of o) a && this.held.isWaiting(n) || this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (Hg(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (xr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				zL(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				HL(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Zg(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = Hg(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : Gg(e, L(e)).findIndex((e) => e.getAttribute(g) === t);
		return n < 0 ? null : n + Ug(e);
	}
	moveRow(e, t, n) {
		let r = Wr(e);
		if (r === null) return;
		let i = Math.max(0, n - Ug(e));
		Hg(e) === "virtualized" ? this.virtualization.move(e, t, i) : HL(e, [{
			key: t,
			newIndex: i
		}]), this.syncItemsHost(e, r), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (xr(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (xr(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${_}]`)) if (Wr(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Gg(e, L(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, qg(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return FM(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = L(e), a = Gg(e, i), o = KL(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, qg(a, l, i.index ?? null)) : (Xg(a, c, l), c.replaceWith(l)));
		}
	}
};
function zL(e, t) {
	let n = L(e), r = Gg(e, n), i = KL(e, n), a = BL(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Ro(a, o, n) : null;
		i.delete(t), Jg(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function BL(e) {
	let t = e.parentElement, n = t?.closest(k) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function VL(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function HL(e, t) {
	let n = L(e), r = Gg(e, n), i = KL(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Yg(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function UL(e, t) {
	if (t === void 0 || Cr(e) !== "CollectionChange" || Cr(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (xr(n.action) !== "Reset" || xr(r.action) !== "Insert") return null;
	let i = S(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== S(r.component?.id) || !Rs(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function WL(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? L(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function GL(e) {
	let t = C(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : C(n);
}
function KL(e, t = L(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(g);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function qL(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Yi(n) || Xi(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: YL(t.severity)
	} : void 0;
}
function JL(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = w.resolve(Yi(t) || Xi(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function YL(e) {
	let t = vr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var XL = "ui-validation--warning", ZL = "ui-validation--info", QL = "data-ui-validation-message", $L = "ui-validation-message--marker", eR = "top-end", tR = "--ui-validation-marker-host", nR = "ui-validation-mark", rR = "--ui-validation-presentation", iR = "--ui-validation-color", aR = "Validation", oR = `input:not([type='hidden']), textarea, select, .${Xn}[role='combobox'], [role='spinbutton']`, sR = {
	Error: 0,
	Warning: 1,
	Info: 2
}, cR = {
	Error: nr,
	Warning: XL,
	Info: ZL
}, lR = `.${nr}, .${XL}, .${ZL}`, uR = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, dR = {
	Error: `${nR}--error`,
	Warning: `${nR}--warning`,
	Info: `${nR}--info`
}, fR = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, pR = class {
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
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(lR)), P(this.root, lR, { childList: !0 }, (e) => this.applyRenderedMessages(e)), w.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(lR)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			gR(t, mR(t) === "Error");
			let e = t.querySelector(`:scope > [${QL}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && _R(this.markerMirrors, t, e, {
				message: n,
				severity: mR(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === aR) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = S(e.reference.componentId), n = qL(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = S(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => _r(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = S(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = Yi(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: YL(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(a)) : this.refusalByElement.delete(a), this.applyCurrentState(t, a);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: fR[t]
		}), this.applyCurrentState(C(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		hR(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${S(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(JL).join("\n"), !0);
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
			severity: YL(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || sR[e.severity] < sR[s.severity]) && (s = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => _r(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${gt}="${ir(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => _r(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	focusFirstInvalid(e) {
		for (let t of this.root.querySelectorAll(`[${gt}="${ir(e)}"]`)) {
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			if (e === null || !e.element.classList.contains("ui-invalid")) continue;
			let n = [...e.element.querySelectorAll(oR)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (n !== null) return n.focus({ preventScroll: !0 }), n.scrollIntoView({
				block: "center",
				behavior: ic() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && YL(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) qs(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function mR(e) {
	return e.classList.contains(XL) ? "Warning" : e.classList.contains(ZL) ? "Info" : "Error";
}
function hR(e, t, n) {
	for (let e of Object.values(cR)) t.classList.toggle(e, n !== void 0 && cR[n.severity] === e);
	gR(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(iR) : r.style.setProperty(iR, `var(--ui-color-${uR[n.severity]})`);
	let i = t.querySelector(`:scope > [${QL}]`) ?? t.querySelector(`[${QL}]`);
	i !== null && (n?.content === !0 ? (xa(i, null), i.textContent = String(n.message ?? "")) : w.writeValue(i, null, n?.message ?? null), _R(e, r, i, n));
}
function gR(e, t) {
	for (let n of e.querySelectorAll(oR)) {
		let r = n.closest(Yn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function _R(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(rR).trim() === "marker";
	if (n.classList.toggle($L, a), r !== void 0 && a) {
		n.setAttribute(ke, n.textContent ?? ""), n.setAttribute(Ae, eR), t.setAttribute(je, ""), vR(e, t, r, n.textContent ?? "", i.getPropertyValue(tR).trim()), t.contains(document.activeElement) ? LS(n) : RS(n);
		return;
	}
	n.removeAttribute(ke), n.removeAttribute(Ae), t.removeAttribute(je), vR(e, t, void 0, "", ""), RS(n);
}
function vR(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : yR(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${nR} ${dR[n.severity]}`, s.textContent = r, s.setAttribute(ke, r), s.setAttribute(Ae, eR), s.parentElement !== o && o.append(s), e.set(t, s), RS(s);
}
function yR(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var bR = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, xR = "tooltip-name";
function SR(e, t, n) {
	let r = mb(e.getAttribute(ke));
	if (xa(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var CR = /* @__PURE__ */ new WeakMap(), wR = /* @__PURE__ */ new Map([["iconClass", pd]]), TR = /* @__PURE__ */ new WeakMap(), ER = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(yr(e), t);
	}
	apply(e) {
		let t = yr(e.operation.kind), n = this.handlers.get(t);
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
			let t = Na(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), xa(e.target, null);
		}), this.register("Markup", (e) => {
			gb(e.target, Pa(e.convertedValue) ? "" : Na(e.convertedValue)), xa(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = NR(e.operation);
			if (xa(e.target, t), Pa(e.value) || Pa(e.convertedValue)) {
				MR(e.target, t);
				return;
			}
			jR(e.target, t, Na(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = NR(e.operation);
			xa(e.target, t), MR(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = NR(e.operation), n = !Pa(e.value) && DR(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (Pa(e.convertedValue) ? "" : Na(e.convertedValue));
			OR(e.target, AR(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !Pa(e.value) && DR(e.value, e.operation.condition ?? "None") ? Na(e.convertedValue).trim() : "";
			kR(e.target, AR(e), t, wR.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = NR(e.operation), n = !Pa(e.value) && DR(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Na(e.convertedValue).trim() : "";
				kR(e.target, AR(e), t);
			}
		}), this.register("Style", (e) => {
			let t = NR(e.operation), n = e.target;
			if (Pa(e.value) || Pa(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Na(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(xR, (e) => SR(e.resolved.component, e.target, NR(e.operation))), this.register(LP, (e) => BP(e.target, e.value)), this.register("Property", (e) => {
			let t = NR(e.operation), n = e.target, r = Pa(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function DR(e, t) {
	switch (br(t)) {
		case "None": return !0;
		case "HasValue": return !Pa(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Pa(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return md(e).length > 0;
		default: return !Pa(e);
	}
}
function OR(e, t, n, r, i) {
	let a = TR.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), TR.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), jR(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && MR(e, n);
}
function kR(e, t, n, r) {
	let i = CR.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), CR.set(e, i));
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
function AR(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function jR(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function MR(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function NR(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var PR = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => uI.has(e.name),
			convert: (e) => uI.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = FR(e.name), n = {
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
function FR(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var IR = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Ar(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Ar(e.domEventName) || t;
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
		return this.definitions.get(Ar(e));
	}
};
function LR(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function RR(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => LR(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => LR(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var zR = class {
	converters = new PR();
	events = new IR();
	operations = new ER();
	valueReaders;
	collectionSinks = new FL();
	rowDecorators = new bR();
	constructor(e, t, n, r) {
		RR(this.events), this.valueReaders = new Ia(r);
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
}, BR = "Submenu", VR = "ui-menu__submenu", HR = "Select", UR = {
	kind: "menu",
	decorate: WR
};
function WR(e) {
	if (!GR(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, BR);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(bt, ""), KR(e.item, "Kind") === HR && e.row.setAttribute(xt, ""), KR(e.item, "Expanded") === !0 && e.row.setAttribute(St, "");
	let r = document.createElement("div");
	r.className = VR, r.appendChild(n), cM(r, e.key, e.item), e.row.appendChild(r);
}
function GR(e) {
	let t = KR(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function KR(e, t) {
	let n = Cg(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var qR = {
	kind: "grip",
	decorate: JR
};
function JR(e) {
	e.row.append(YR());
}
function YR() {
	let e = document.createElement("span");
	return e.className = ge, e.setAttribute("role", "button"), w.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function XR(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(QR(n));
	for (let t of e.querySelectorAll(`[${Ke}]`)) ZR(t, Ge, r), ZR(t, qe, i);
}
function ZR(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function QR(e) {
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
var $R = 2;
function ez(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= $R && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function tz(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var nz = "ne.standard.ui.windowId", rz = [
	500,
	1e3,
	2e3
], iz = 3, az = [
	["refusal", ({ root: e }) => Bj(e)],
	["file input", ({ root: e, validation: t }) => new Eu({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Mf({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new qf({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new pp({ root: e })],
	["field box press", ({ root: e }) => new sp({ root: e })],
	["image fallback", ({ root: e }) => new bp({ root: e })],
	["radio group sync", ({ root: e }) => new Ap({ root: e })],
	["select interaction", ({ root: e }) => new Vm({ root: e })],
	["search input", ({ root: e }) => new $p({ root: e })],
	["debounced commit", ({ root: e }) => new nh({ root: e })],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => ah() ? void 0 : new oh({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new NO({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new vh({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new fD({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new py({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new By({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new $y({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new oA({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new DA({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new Tx({ root: e })],
	["split button", ({ root: e }) => new AT({ root: e })],
	["toggle button", ({ root: e }) => new Zf({ root: e })],
	["button group", ({ root: e }) => new IT({ root: e })],
	["menu", ({ root: e }) => new ZC({ root: e })],
	["action bar", ({ root: e }) => new YS({ root: e })],
	["collapsible", ({ root: e }) => new Pw({ root: e })],
	["menu group", ({ root: e }) => new RC({ root: e })],
	["menu search", ({ root: e }) => new lw({ root: e })],
	["side drawer", ({ root: e }) => new Dw({ root: e })],
	["screen keyboard", () => new bw()],
	["grid splitter", ({ root: e }) => new hT({ root: e })],
	["accordion", ({ root: e }) => new BT({ root: e })],
	["tabs", ({ root: e }) => new dE({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new Lk({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new bE({ root: e })],
	["breadcrumbs", ({ root: e }) => new NE({ root: e })],
	["scroll anchor", ({ root: e }) => new XA({ root: e })],
	["surface press", ({ root: e }) => new ij({ root: e })],
	["text selection", ({ root: e }) => new uj({ root: e })],
	["scroll group", ({ root: e }) => new _j({ root: e })],
	["flyout interaction", ({ root: e }) => new Rl({ root: e })],
	["text fold", ({ root: e }) => new Zk({ root: e })],
	["tooltip", ({ root: e }) => fS(e)]
], oz = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new ur($M());
	hydration = rN();
	rewriteMoments;
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
	leaveGuard;
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = uz(e.windowIdStorageKey ?? nz), this.dom = new Ur(this.root), w.load(this.root), w.setLanguage(document.documentElement.lang), e.strings !== void 0 && w.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : w.loadTableAsync(this.hydration.words.href)), this.extensions = new zR(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(UR), this.extensions.registerRowDecorator(qR);
		let t = new Fr(this.dom, this.metadata), n = this.extensions.operations, r = new uN(), i = new xL(t, n, this.extensions, r);
		this.reactiveSources = new wL(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new fF({ root: this.root }), this.notifications = new vL({ root: this.root }), this.effects = new iF({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e)
		});
		let a = new Qs(this.metadata), o, u = new Vs(a, i, new Ks(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(S(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new YM(this.dom), f = new iM(this.metadata, d, this.extensions, n, r);
		this.virtualization = new zM({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new RL(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), w.onChange(() => this.rewriteWords(i, f)), this.rewriteMoments = () => this.rewriteWords(i, f, !0), w.onMomentTick(this.rewriteMoments), new mM({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new TP(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new sN(this.transport), w.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(lr.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(lr.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				ZM(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && ZM(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let p = new PP(this.transport);
		o = new Es({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(lr.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		}), this.leaveGuard = new xF({
			window,
			ask: async (e) => (await o?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => vF(this.dialogs, t),
			pending: () => eh() || p.isBusy,
			settle: async () => {
				th(), await p.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(lr.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Yu(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let m = new pR({
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
			effects: this.effects,
			validation: m,
			dialogs: this.dialogs
		};
		for (let [e, t] of az) ez(e, t, this.engineContext);
		ez("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new sg({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), ez("tree", ({ root: e, effects: t }) => new lk({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), ez("items reorder", ({ root: e }) => new s_({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), ez("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new jj({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", C(e)) || u.hasEventForComponent("click", C(e))
		}) : void 0, this.engineContext), this.eventPipeline = new Ps({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: u,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: m,
			valueBinding: o
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...a.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(Fk.name, Fk.registration);
		let ee = a_(this.updateProcessor.moves);
		this.eventPipeline.addEvent(ee.name, ee.registration), this.eventPipeline.addEvent(fp.name, fp.registration), this.tables = new iO({ root: this.root }), this.windows = new xM({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: w,
			observeComponents: P,
			observeSize: jD,
			store: new OC(),
			numbers: Vh,
			temporal: Ai,
			icons: { apply: dd },
			badges: { writeCount: XI },
			urls: {
				isImageSource: $u,
				asBrowserReads: Qu,
				isSafeLink: Gu,
				isExternalLink: Ju
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
				let r = e.closest(b), a = r === null ? void 0 : this.metadata.getExposedProperty(C(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: IS,
			renames: { open: ol },
			tables: this.tables,
			rows: rM(d, f, this.virtualization),
			uploads: hu(m),
			selection: Co,
			popups: nM,
			roving: Za,
			focus: ns,
			states: Ma,
			validation: m,
			wheel: zd,
			names: rr
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
		let t = za(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
	}
	async switchLanguageAsync(e, t) {
		if (e === w.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		w.setRequested(e);
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
			if (n !== this.languageSwitches || i === w.language || !await w.switchToAsync(i, r)) return;
			w.notifyChanged();
		} finally {
			n === this.languageSwitches && w.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), w.language !== this.culturesLanguage && (this.culturesLanguage = w.language, Ta(this.root, (e) => XR(e, w.number, w.temporal)));
		let i = n ? $i : void 0;
		w.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(w.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		w.language.length > 0 && document.documentElement.lang !== w.language && (document.documentElement.lang = w.language), d(n ? "page's moments written again" : "page's words written again", r, { language: w.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Ta(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = S(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${h}="${ir(n)}"]`)) zr(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => zr(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: w.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: w.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		if (hz() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), gz(e), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		re(this, this.options.handlerGlobalKey), VP(this.root), await lz();
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
		this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(t), await this.applyChanges(t), this.updateProcessor.initializeItemsHosts(), this.holdsPaintedMoment() && this.rewriteMoments(), d("runtime hydrated from the page", e, {
			pageId: this.hydration.pageId,
			updates: t?.updates?.length ?? 0
		});
	}
	holdsPaintedMoment() {
		return ba(this.root) || nN(this.hydration) || this.metadata.getWords().some((e) => $i(e.key)) || $i(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) ez(tz(t), t, this.pluginContext);
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
		w.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		ez(tz(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !kP(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), AP(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= iz) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (_z(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(kP(e) ? await AP(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = fz(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? pz(window.location.search) : e.parameters,
			timeZone: oN()
		};
		return await aN(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, rz, cz);
	}
};
async function sz(e = {}) {
	let t = performance.now(), n = new oz(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function cz(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function lz() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function uz(e) {
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
	let n = dz();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function dz() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function fz() {
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
function pz(e) {
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
var mz = "ne-standard-ui:reloaded-view";
function hz() {
	try {
		return sessionStorage.getItem(mz);
	} catch {
		return null;
	}
}
function gz(e) {
	try {
		sessionStorage.setItem(mz, e);
	} catch {}
}
function _z() {
	try {
		sessionStorage.removeItem(mz);
	} catch {}
}
ne(), sz().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
