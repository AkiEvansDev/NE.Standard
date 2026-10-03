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
var h = 2;
function te() {
	return re();
}
function ne(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = re();
	n.runtime = e, ie(e, n);
}
function re() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
		contractVersion: h,
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
			let r = ae(e, t), i = window.NEStandardUI?.runtime;
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
function ie(e, t) {
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
function ae(e, t) {
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
var oe = "data-ui-id", se = "data-ui-context", ce = "data-ui-pc", g = "data-ui-key", le = "data-ui-unselectable", ue = "data-ui-undraggable", de = "data-ui-unremovable", fe = "data-ui-unrenamable", pe = "data-ui-no-context-menu", me = "data-ui-no-row-open", he = "data-ui-no-row-drag", ge = "ui-row__grip", _e = "data-ui-row-drop", ve = "data-ui-tabs-draggable", ye = "data-ui-tabs-menu", be = "data-ui-context-menu", xe = "data-ui-context-menu-use", Se = "data-ui-action-bar", Ce = "data-ui-action-bar-key", we = "data-ui-action-bar-rest", Te = "data-ui-menu-left-out", Ee = "data-ui-in-action-bar", De = "ui-action-bar", Oe = "data-ui-row-focus", ke = "data-ui-tooltip", Ae = "data-ui-tooltip-placement", je = "data-ui-tooltip-mark", Me = "data-ui-tooltip-severity", Ne = "data-ui-tooltip-press", Pe = "data-ui-badge-text", Fe = "data-ui-badge-set", Ie = "data-ui-name", Le = "data-ui-bind-", Re = "data-ui-into-", ze = "data-ui-bind-value", Be = (e) => `data-ui-no-${e}`, Ve = "data-ui-event-boundary", He = "data-ui-image-caption", Ue = "data-ui-image-crop", We = "data-ui-image-crop-size", _ = "data-ui-items-host", Ge = "data-ui-collection-sink", Ke = "data-ui-items-query", qe = "data-ui-number-culture", Je = "data-ui-page-culture", Ye = "data-ui-pager-target", Xe = "data-ui-pager-page", Ze = "data-ui-pager-size", Qe = "data-ui-temporal-culture", $e = "data-ui-empty-template", et = "data-ui-group-template", tt = "data-ui-empty-placeholder", nt = "data-ui-group-header", rt = "data-ui-group-anchor", it = "data-ui-group", at = "data-ui-value-holder", ot = "data-ui-value-end", st = "data-ui-value-kind", ct = "items-query", lt = "data-ui-host-mode", ut = "data-ui-host-viewport", dt = "data-ui-scroll-group", ft = "data-ui-scroll-lines", pt = "data-ui-source-line", mt = "data-ui-window-spacer", ht = "data-ui-window-pending", gt = "data-ui-window-paged", _t = "data-ui-window-size", vt = "data-ui-window-offset", yt = "data-ui-window-total", bt = "data-ui-window-more-before", xt = "data-ui-window-more-after", St = "data-ui-window-group-before", Ct = "data-ui-window-aggregates", wt = "data-ui-form-id", Tt = "data-ui-forms", Et = "data-ui-visibility", Dt = "data-ui-collapsed", Ot = "data-ui-menu-group", kt = "data-ui-menu-select", At = "data-ui-menu-open", jt = "data-ui-menu-search", Mt = "data-ui-menu-searching", Nt = "data-ui-menu-unmatched", Pt = "data-ui-drawer-toggle", Ft = "data-ui-drawer-open", It = "data-ui-bottom-bar", Lt = "data-ui-region", Rt = "data-ui-menu-item-kind", zt = "ui-menu", v = "ui-menu-item", Bt = "ui-menu-item--checked", Vt = "ui-menu-item--selected", Ht = "ui-menu--rail", Ut = `[${Rt}="header"], [${Rt}="separator"]`, Wt = `[${Ot}] > .${v}`, Gt = `${Wt}, .${v}[${Rt}="check"]`, Kt = "data-ui-shortcut", qt = "data-ui-collapse-toggle", Jt = "data-ui-folding", Yt = "data-ui-column-limits", Xt = "data-ui-row-limits", Zt = "data-ui-splitter-step", Qt = "data-ui-table-column", $t = "data-ui-table-hide-below", en = "data-ui-table-starts-hidden", tn = "data-ui-table-hidden", nn = "ui-table__row", rn = "ui-table__scroll", an = "ui-table__header", on = "ui-table__resizer", sn = "ui-tree", cn = "ui-tree__row", ln = "ui-tree__row--filtered", un = "data-ui-table-last", dn = "data-ui-table-reordering", fn = "data-ui-table-dragging", pn = "data-ui-table-drop", mn = "data-ui-table-scrolled", hn = "data-ui-table-scrollbar", gn = "data-ui-no-row-select", _n = "data-ui-tree-parent", vn = "data-ui-tree-children", yn = "data-ui-tree-folder", bn = "data-ui-tree-expanded", xn = "data-ui-tree-title", Sn = "data-ui-tree-loading", Cn = "data-ui-tree-drop-target", wn = "data-ui-tree-boot", Tn = "data-ui-tree-draggable", En = "data-ui-row-editing", Dn = "data-ui-image-source", On = "data-ui-file-max-size", kn = "data-ui-file-pick", An = "data-ui-file-drop-target-id", jn = "data-ui-theme", Mn = "data-ui-theme-colors", Nn = "data-ui-words", Pn = "data-ui-language-switcher", Fn = "data-ui-language", In = "data-ui-splitting", Ln = "data-ui-keyboard-up", Rn = "data-ui-connection", zn = "data-ui-split-folded", Bn = "data-ui-pointer-focus", Vn = "data-ui-selection", Hn = "data-ui-selected", Un = "data-ui-selected-key", Wn = "data-ui-selected-keys", Gn = "data-ui-bind-selected-key", Kn = "data-ui-tabs-selected", qn = "data-ui-tab-order", Jn = "data-ui-tab-caption", Yn = "data-ui-tab-pinned", Xn = [
	Et,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Zn = "data-ui-submit-form-id", y = `[${oe}]`, Qn = "data-ui-href", $n = "ui-disabled", er = "ui-loading", tr = "ui-readonly", nr = "ui-hidden", rr = "ui-dialog__surface", ir = "ui-flyout__content", ar = "data-ui-focus-holder", or = "[role='listbox'], [role='menu'], [role='dialog']", sr = "ui-select__trigger", cr = `.${sr}`, lr = "ui-button", ur = `${lr} ui-button--ghost ui-button--small`, dr = "ui-select", fr = "ui-text-input", pr = "ui-invalid", mr = "data-ui-validation-message", hr = {
	componentId: oe,
	key: g,
	selected: Hn,
	selectedKey: Un,
	selectedKeys: Wn,
	unselectable: le,
	rowFocus: Oe,
	itemsHost: _,
	valueHolder: at,
	bindValue: ze,
	noRowOpen: me,
	noRowDrag: he,
	eventBoundary: Ve,
	focusHolder: ar,
	tooltip: ke,
	tooltipPlacement: Ae,
	contextMenu: be,
	contextMenuUse: xe,
	actionBar: Se,
	actionBarKey: Ce,
	actionBarRest: we,
	disabledClass: $n,
	loadingClass: er,
	readOnlyClass: tr,
	hiddenClass: nr,
	buttonClass: lr,
	selectClass: dr,
	textInputClass: fr,
	invalidClass: pr,
	validationMessage: mr,
	sourceLine: pt,
	popupSelector: or,
	listTriggerSelector: cr,
	tableRowClass: nn,
	tableScrollClass: rn,
	tableHeaderClass: an,
	tableResizerClass: on,
	tableHidden: tn,
	hostMode: lt,
	windowOffset: vt,
	windowTotal: yt,
	windowSize: _t,
	windowMoreAfter: xt,
	windowAggregates: Ct,
	itemsQuery: Ke,
	valueKind: st,
	itemsQueryKind: ct,
	menuItemClass: v,
	menuItemKind: Rt,
	menuItemCheckedClass: Bt
};
function b(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function gr(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var _r = 0;
function vr(e, t) {
	return e.id.length === 0 && (_r++, e.id = `${t}-${_r}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function yr(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(y) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var br = {
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
	Announce: "Announce",
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
	ConfirmLeave: "ConfirmLeave",
	ReplaceAddress: "ReplaceAddress",
	PushAddress: "PushAddress"
}, xr = class {
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
		return this.bindingsByComponentAndPropertyId.get(Wr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Wr(e, Ur(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Gr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Hr(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Hr(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Kr(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Wr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Wr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Hr(e.eventName), n = S(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Gr(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Kr(t, e.dynamicParameters ?? []), e);
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
function Sr(e) {
	return x(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Cr(e) {
	return e == null ? "OneWay" : x(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function wr(e) {
	return x(e, ["Property", "Event"]);
}
function Tr(e) {
	return e == null ? "SetProperty" : x(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Er(e) {
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
		"LikeIgnoreCase",
		"RegexEach"
	]);
}
function Dr(e) {
	return x(e, ["Ascending", "Descending"]);
}
function Or(e) {
	return x(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function kr(e) {
	return x(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ar(e) {
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
function jr(e) {
	return x(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Mr(e) {
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
function Nr(e) {
	return typeof e == "string" ? e : "";
}
function Pr(e) {
	return x(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Fr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Ir(e) {
	return x(e, ["Auto", "Smooth"]);
}
function Lr(e) {
	return x(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Rr(e) {
	return x(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function zr(e) {
	return x(e, ["Light", "Dark"]);
}
function Br(e) {
	return x(e, ["Horizontal", "Vertical"]);
}
function Vr(e) {
	return x(e, ["Polite", "Assertive"]);
}
function Hr(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Ur(e) {
	return e?.trim() ?? "";
}
function Wr(e, t) {
	return `${e}:${Ur(t)}`;
}
function Gr(e, t) {
	return `${e}:${Hr(t)}`;
}
function Kr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var qr = class {
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
		let a = S(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Le}${gr(r.propertyName)}="${b(a)}"]` : null;
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
		return yr(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${gr(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Jr(e) {
	return Qr(e, ce);
}
function Yr(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = $r(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Xr(e, t) {
	let n = Jr(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Yr(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Zr(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = $r(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Qr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function $r(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function ei(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var ti = class {
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
		let e = this.root.querySelectorAll(y), t = this.root.querySelector(`[${nt}]`) !== null;
		for (let n of e) {
			let e = C(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && ai(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return vr(e, t);
	}
	findComponentParts(e, t, n) {
		return ei(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ii(t)) ?? [];
		if (n.length > 0 && n.every((e) => Xr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Xr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Jr(n);
			if (e === 0) continue;
			let r = Yr(n, e);
			if (r.length !== e) continue;
			let i = ii(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(y);
			if (e === null || !oi(this.root, e)) return null;
			let r = C(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Yr(e, Jr(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function C(e) {
	return Qr(e, oe);
}
function ni(e) {
	let t = e.closest(y), n = t === null ? 0 : C(t);
	return n > 0 ? n : null;
}
function ri(e) {
	let t = e.closest(y), n = t === null ? 0 : C(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Yr(t, Jr(t))
	};
}
function ii(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ai(e) {
	return Jr(e) === 0;
}
function oi(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function si(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = ci(n);
	switch (li(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : ui(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : ui(r, i) ? "many" : "other";
		case "ru":
		case "uk": return di(r, i);
		case "pl": return fi(r, i);
		default: return "other";
	}
}
function ci(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function li(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function ui(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function di(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function fi(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function pi(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var mi = {
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
function hi(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return mi;
	try {
		return {
			...mi,
			...JSON.parse(t)
		};
	} catch {
		return mi;
	}
}
var gi = [
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
function _i(e, t, n) {
	if (t == null || t.trim().length === 0) return `${wi(e.getFullYear(), 4)}-${wi(e.getMonth() + 1, 2)}-${wi(e.getDate(), 2)} ${wi(e.getHours(), 2)}:${wi(e.getMinutes(), 2)}:${wi(e.getSeconds(), 2)}`;
	let r = "", i = vi(t);
	for (let a = 0; a < t.length;) {
		let o = Si(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Ci(o, e, n, i), a += o.length;
	}
	return r;
}
function vi(e) {
	for (let t = 0; t < e.length;) {
		let n = Si(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var yi = /^[-./:,]$/, bi = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function xi(e) {
	for (let t = 0; t < e.length;) {
		let n = Si(e, t);
		if (n !== null && bi.has(n) || n === null && !yi.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Si(e, t) {
	for (let n of gi) if (e.startsWith(n, t)) return n;
	return null;
}
function Ci(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return wi(t.getFullYear(), 4);
		case "yy": return wi(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return wi(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return wi(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return wi(i, 2);
		case "H": return String(i);
		case "hh": return wi(a, 2);
		case "h": return String(a);
		case "mm": return wi(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return wi(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function wi(e, t) {
	return String(e).padStart(t, "0");
}
var Ti = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ei(e) {
	let t = Ti.exec(e.trim());
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
function Di(e) {
	return Oi(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Oi(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var ki = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ai(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Si(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += ji(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function ji(e, t) {
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
function Mi(e, t, n) {
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
		let a = Si(t, e);
		if (a === null) {
			if (!Ni(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Pi(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Vi(i) : null;
}
function Ni(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return yi.test(n) ? t.position >= e.length || !yi.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Pi(e, t, n, r) {
	switch (n) {
		case "yyyy": return Fi(t, "year", Ri(e, t, 4, 4));
		case "yy": return Fi(t, "year", Ii(Ri(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Fi(t, "month", Li(zi(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Fi(t, "month", Ri(e, t, 1, 2));
		case "dddd":
		case "ddd": return zi(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Fi(t, "day", Ri(e, t, 1, 2));
		case "HH":
		case "H": return Fi(t, "hour", Ri(e, t, 1, 2));
		case "hh":
		case "h": return Fi(t, "hour12", Ri(e, t, 1, 2));
		case "mm":
		case "m": return Fi(t, "minute", Ri(e, t, 1, 2));
		case "ss":
		case "s": return Fi(t, "second", Ri(e, t, 1, 2));
		case "tt": return Bi(e, t, r);
		default: return !1;
	}
}
function Fi(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Ii(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Li(e) {
	return e === null ? null : e + 1;
}
function Ri(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function zi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Bi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Vi(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Oi(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Hi = {
	readCulture: hi,
	format: _i,
	parse: Ei,
	toDate: Di
}, Ui = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Wi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Gi(e) {
	let t = e?.trim() ?? "";
	if (!Wi.test(t)) return null;
	let n = Date.parse(Ui.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Ki(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function qi(e) {
	return e === "relative" || e === "relative-date";
}
var Ji = {
	...mi,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Yi(e, t, n, r) {
	if (t === "relative") return aa(e - r, n.language);
	if (t === "relative-date") {
		let t = Xi(e, r);
		if (t !== null) return $i(n.language).format(t, "day");
	}
	let i = n.temporal ?? Ji, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : pi(i, !1);
	return _i(new Date(e), a, i);
}
function Xi(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / ia);
	return Math.abs(i) <= 1 ? i : null;
}
function Zi(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(ea(t)) + e.slice(1);
}
var Qi = /* @__PURE__ */ new Map();
function $i(e) {
	let t = Qi.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(ea(e), { numeric: "auto" }), Qi.set(e, t)), t;
}
function ea(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var ta = 1e3, na = 60 * ta, ra = 60 * na, ia = 24 * ra;
function aa(e, t) {
	let n = $i(t), r = Math.abs(e);
	return r < 45 * ta ? n.format(0, "second") : r < 45 * na ? n.format(Math.round(e / na), "minute") : r < 22 * ra ? n.format(Math.round(e / ra), "hour") : r < 26 * ia ? n.format(Math.round(e / ia), "day") : r < 320 * ia ? n.format(Math.round(e / (30.4375 * ia)), "month") : n.format(Math.round(e / (365.25 * ia)), "year");
}
//#endregion
//#region src/runtime/words.ts
var oa = "count";
function sa(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ca(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var la = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function ua(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Gi(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && la.has(t.format));
}
function da(e) {
	if (typeof e != "object" || !e) return !1;
	if (ua(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (da(t)) return !0;
	return !1;
}
function fa(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function pa(e, t, n) {
	return sa(e) ? ga(n, e.key, e.args) : ca(e) ? ma(n, e.text) : t && typeof e == "string" ? ma(n, e) : e;
}
function ma(e, t) {
	return t.trim().length === 0 || !ha(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function ha(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function ga(e, t, n) {
	let r = n?.[oa];
	return _a(typeof r == "number" ? e.lookup(`${t}.${si(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ca(t) ? ma(e, t.text) : ga(e, t.key, t.args), e.writeMoment);
}
function _a(e, t, n, r = fa) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = va(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += ba(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function va(e, t) {
	let n = t + 1;
	for (; n < e.length && ya(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function ya(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function ba(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : sa(e) ? t === void 0 ? _a(e.key, e.args, void 0, n) : t(e) : ca(e) ? t === void 0 ? e.text : t(e) : ua(e) ? n(Gi(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var xa = 15e3, Sa = /* @__PURE__ */ new Set(), Ca = null;
function wa(e) {
	Sa.add(e), Ca === null && (Ca = setInterval(Ta, xa));
}
function Ta() {
	for (let e of [...Sa]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Sa.delete(e);
	}
	Sa.size === 0 && Ca !== null && (clearInterval(Ca), Ca = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Ea = 256, Da = 512, Oa = "script[type='application/json'][data-ui-strings]", ka = "#text", Aa = `[${Nn}*='"moment"']`, ja = class {
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
		let t = e.querySelector(Oa)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), ga(this, e, t);
	}
	translate(e, t) {
		return ga(this, e, t);
	}
	writeMoment = (e, t) => (qi(t) && this.noteRelative(), Yi(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && wa(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return pa(e, t, this);
	}
	resolveText(e) {
		return pa(e, !0, this);
	}
	write(e, t, n, r) {
		La(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		La(e, t, pa(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (sa(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ca(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		La(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Pa(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Ra(e, (e) => {
			for (let n of e.querySelectorAll(t ? Aa : `[${Nn}]`)) for (let [e, r] of Object.entries(Ia(n))) {
				if (t && !da(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && La(n, e === ka ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return pa(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Da || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && ha(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Ea) try {
			let a = await e(t, n.slice(r, r + Ea));
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
function Ma(e) {
	let t = !1;
	return Ra(e, (e) => {
		t ||= e.querySelector(Aa) !== null;
	}), t;
}
function Na(e, t) {
	e.hasAttribute("data-ui-words") && Pa(e, t, null);
}
function Pa(e, t, n) {
	let r = Ia(e), i = t ?? ka;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Nn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Nn, a);
}
function Fa(e) {
	let t = Ia(e)[ka];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Ia(e) {
	let t = e.getAttribute(Nn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function La(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ra(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Ra(n.content, t);
}
var w = new ja();
function za(e, t) {
	let n = ca(e) ? e.text : e;
	return w.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Ba = `.${$n}, .${er}, [inert]`, Va = `:scope > [${oe}]:is(${Ba}), :scope > :not([${oe}]) > [${oe}]:is(${Ba})`;
function T(e) {
	return e.closest(Ba) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function E(e) {
	return e.matches(Ba) || e.querySelector(Va) !== null;
}
function Ha(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Ua = `[${oe}], .${tr}`;
function D(e) {
	return e.closest(Ua)?.matches(`.${tr}`) === !0;
}
function Wa(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle($n, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Ga = {
	isInert: T,
	isReadOnly: D,
	setDisabled: Wa
};
//#endregion
//#region src/extensions/value-readers.ts
function Ka(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function qa(e) {
	return e == null;
}
var Ja = "data-ui-trim-input", Ya = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of eo) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(st);
		if (t === null) return Xa(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Ja) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Qa(e);
		return t === null ? null : this.read(t);
	}
};
function Xa(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Za = "input, textarea, select";
function Qa(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Za) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Za}`);
}
function $a(e) {
	return e === null ? null : Number(e);
}
var eo = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Kn)
	},
	{
		kind: "tab-order",
		read: (e) => $a(e.getAttribute(qn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Jn)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Yn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(xn)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Un)
	},
	{
		kind: "selected-keys",
		read: (e) => to(e, Wn)
	},
	{
		kind: ct,
		read: (e) => to(e, Ke)
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
function to(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function no(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var ro = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function io(e) {
	return e instanceof HTMLInputElement && ro.has(e.type);
}
function ao(e) {
	return io(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var oo = "ui-draft-dropped";
function so(e) {
	e.dispatchEvent(new Event(oo, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function co(e) {
	let t = po(e.key), n = mo(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(fo);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function lo(e, t) {
	return po(e) !== null || mo(e, t) !== 0;
}
var uo = {
	target: co,
	applyTabIndex: O
};
function O(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function fo(e) {
	return e.getClientRects().length > 0 && !T(e);
}
function po(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function mo(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function ho(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function go(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${_}][${ut}]`) : null;
}
function _o(e) {
	let t = ho(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - yo(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function vo(e, t) {
	let n = ho(e);
	n.scrollTop = n === e ? t : t + yo(e, n);
}
function yo(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/selected-key.ts
function bo(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var xo = "data-ui-bind-selected-keys", k = `.ui-items-view, .ui-table, .${sn}`, So = `.ui-items-view__item, .${nn}, .${cn}`, Co = ".ui-items-view, .ui-table", wo = {
	shift: !1,
	ctrl: !1
}, To = /* @__PURE__ */ new WeakMap();
function Eo(e, t) {
	t !== null && !To.has(e) && Do(e, t);
}
function Do(e, t) {
	let n = j(t);
	n.length > 0 && To.set(e, n);
}
function Oo(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ko(e, t) {
	let n = Oo(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Ao(e) {
	return !e.hasAttribute(gn);
}
function A(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${oe}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function jo(e) {
	switch (e.getAttribute(Vn)) {
		case "one": {
			let t = e.getAttribute(Un);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(zo(Bo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Mo(e, t) {
	let n = jo(e), r = e.getAttribute(Vn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(j(e));
		e.toggleAttribute(Hn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function No(e) {
	return e.filter((e) => e.hasAttribute(Hn));
}
function Po(e, t, n, r) {
	let i = j(n);
	if (!Lo(n)) return !1;
	switch (e.getAttribute(Vn)) {
		case "one": return bo(e, i, {
			attribute: Un,
			bindingAttribute: Gn,
			apply: (e) => Mo(e, t)
		}), !0;
		case "many": return Fo(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Fo(e, t, n, r, i) {
	let a = Bo(e);
	if (a === null) return;
	let o = zo(a), s;
	if (i.shift) {
		let r = Ro(t, t.find((t) => j(t) === To.get(e)) ?? n, n).map(j);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], To.set(e, r)) : (s = [r], To.set(e, r));
	Io(e, t, s);
}
function Io(e, t, n) {
	let r = Bo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Wn, i), Mo(e, t), r.hasAttribute(xo) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Lo(e) {
	return j(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !E(e);
}
function Ro(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => A(e) !== null && Lo(e));
}
function zo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Bo(e) {
	let t = e.closest(y);
	for (let n of e.querySelectorAll(`[${_}]`)) if (n.closest(k) === e && n.closest(y) === t) return n;
	return null;
}
function j(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Vo = {
	isSelected: (e) => e.hasAttribute(Hn),
	toggle: Ho,
	setSelected: Uo,
	setSelectedKeys: Wo
};
function Ho(e) {
	let t = e.closest(k);
	t !== null && e instanceof HTMLElement && Po(t, Go(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Uo(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(j(e));
	Wo(e, r, n);
}
function Wo(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Go(e), i = new Set(r.filter((e) => !Lo(e)).map(j)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...jo(e)].filter((e) => !a.has(e));
	Io(e, r, n ? [...o, ...a] : o);
}
function Go(e) {
	return [...e.querySelectorAll(So)].filter((t) => t.closest(k) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function Ko(e) {
	let t = e.closest(k);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(So);
	return n !== null && n.closest(k) === t ? {
		root: t,
		row: n
	} : null;
}
function qo(e) {
	return e.filter((e) => A(e) !== null && !E(e));
}
function Jo(e) {
	return Yo(e) ?? qo(e)[0] ?? null;
}
function Yo(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !E(e)) ?? null;
}
function Xo(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", vr(t, "ui-row-name"));
}
function Zo(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Oe);
	n.setAttribute(Oe, ""), e.setAttribute("aria-activedescendant", vr(n, "ui-row")), (A(n) ?? n).scrollIntoView({ block: "nearest" });
}
function Qo(e, t) {
	return lo(e, t === "grid" ? "both" : t) || t !== "horizontal" && $o(e);
}
function $o(e) {
	return e === "PageDown" || e === "PageUp";
}
function es(e, t, n, r) {
	if (!Qo(e, r)) return null;
	let i = qo(t);
	if ($o(e)) return ts(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return ns(i, n, e === "ArrowDown");
	let a = i.map((e) => A(e) ?? e), o = co({
		key: e,
		items: a,
		current: n === null ? null : A(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ts(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (A(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(_o(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (A(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function ns(e, t, n) {
	let r = t === null ? null : A(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = rs(i), o = e.map((e) => ({
		row: e,
		rect: (A(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(rs(t.rect) - a) < Math.abs(rs(e.rect) - a) ? t : e).row;
}
function rs(e) {
	return e.left + e.width / 2;
}
var is = "ui-row-press";
function as(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function os(e, t, n) {
	let r = n.hasAttribute(Oe), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = qo(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && Zo(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var ss = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), cs = /* @__PURE__ */ new Set([
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
]), ls = !1, us = !1, ds = null, fs = /* @__PURE__ */ new Set(), ps = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => ms(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => hs(e), !0), window.addEventListener("focus", (e) => gs(e.target), !0), window.addEventListener("focusin", (e) => gs(e.target), !0), window.addEventListener("focusout", (e) => xs(e.target, !1), !0));
function ms(e, t = "") {
	ls = !0, us = t === "touch";
	let n = document.activeElement;
	ds = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && xs(n, !_s(n));
}
function hs(e) {
	if (!(e instanceof KeyboardEvent && cs.has(e.key))) {
		ls = !1;
		for (let e of [...fs]) xs(e, !1);
	}
}
function gs(e) {
	ls && !_s(e) && xs(e, !0);
}
function _s(e) {
	return ao(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function vs() {
	return ls && ds instanceof HTMLElement && ds !== document.body ? ds : null;
}
function ys() {
	return ls;
}
function bs() {
	return ls && us;
}
function xs(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of fs) e.isConnected || fs.delete(e);
			fs.add(e);
		} else fs.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Bn, t);
	}
}
function M(e) {
	e.focus({ preventScroll: !0 });
}
function Ss(e) {
	xs(e, !0), e.focus({ preventScroll: !0 });
}
function Cs(e) {
	for (let t of e.querySelectorAll(ss)) if (Ha(t)) return t;
	return null;
}
var ws = {
	first: Cs,
	stops: (e) => Ts(e, document.activeElement)
};
function Ts(e, t) {
	let n = [...e.querySelectorAll(ss)].filter((e) => e === t || e.tabIndex >= 0 && Ha(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Es(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Ds(n) && Ds(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Es(e);
		return t === null || r.get(t) === e;
	});
}
function Es(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Ds(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Os(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && ks(n, a) ? i : r && ks(n, i) ? a : null;
}
function ks(e, t) {
	return e === t || Es(e) !== null && Es(e) === Es(t);
}
var As = `.${rr}, .${ir}, [${ar}]`;
function js(e) {
	let t = Ko(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(As)) && n.hasAttribute("tabindex") && Ha(n)) return n;
	return null;
}
function Ms(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Cs(e);
	return ls ? ps.add(e) : ps.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), M(r ?? e), n;
}
function Ns(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Cs(e);
	return n !== null && Ps(e, n), Ms(e, n);
}
function Ps(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Fs(e, t, n = !1) {
	if (ls) {
		O(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), M(e);
		return;
	}
	let r = t.filter(fo), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (O(t, i), M(i));
}
function Is(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Ls(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${ss}, [tabindex]`) && Ha(e)) return e;
	return n === null ? null : Rs(n);
}
function Ls(e, t) {
	for (let n = e.closest(y); n !== null; n = n.parentElement?.closest(y) ?? null) {
		let e = t.querySelectorAll(`[${oe}="${n.getAttribute(oe)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Rs(e) {
	for (let t = e.closest(y); t !== null; t = t.parentElement?.closest(y) ?? null) if (Ha(t)) return zs(t), t;
	return null;
}
function zs(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Bs(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Vs(n, t) && xs(e, !_s(e)), M(e));
}
function Vs(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (ps.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Hs = "data-ui-clear", Us = ["change", "toggle"], Ws = [
	...Us,
	"expand",
	"collapse",
	"open",
	"close"
];
function Gs(e) {
	let t = Cr(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Ks(e) {
	return Cr(e) === "OnSubmit";
}
function qs(e, t) {
	let n = e.getAttribute(ze);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Ks(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Gs(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Ks(i.mode)
		};
	}
	return null;
}
var Js = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Us) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(oo, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Hs}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || qs(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Hs}]`);
		if (t === null) return;
		let n = t.closest(y), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Ys(r) || (no(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), ao(r) && document.activeElement !== r && M(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (D(e.target) || T(e.target))) return;
		let t = qs(e.target, this.options.metadata);
		if (t !== null && (e.type !== "change" || this.options.refuses?.(e.target) !== !0)) {
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
			let r = qs(n, this.options.metadata);
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
		if (i === void 0 || !Gs(i.mode) || Ks(i.mode)) return;
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
function Ys(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Xs(e, t) {
	let n = e.closest(`[${Ve}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Zs = class {
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
}, Qs = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Hr(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Hr(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Hr(e));
	}
	markAttached(e) {
		let t = Hr(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, $s = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: S(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, ec = {
	dispatched: !1,
	success: !1
}, tc = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, nc = class {
	options;
	root;
	registry;
	requestFactory = new $s();
	turns = new Zs();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Qs(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t);
		this.shouldAttach(n) && this.attachEvent(n);
	}
	async dispatchCommandAsync(e) {
		if (this.options.dispatcher.isPending(e)) return;
		let t = this.turns.take();
		try {
			await t.ahead, await this.options.valueBinding?.whenSent();
			let n = this.options.dispatcher.dispatchAsync(e);
			t.done();
			let r = await n;
			this.options.effects.applyAll(r.command?.effects, this.options.dom), this.options.afterEffects?.();
		} finally {
			t.done();
		}
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
		if (r === null || ic(t, r.element) || Xs(t.target, r.element)) return;
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
			let t = e instanceof tc, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && T(r.domEvent.target)) return ec;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), ec;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? ac(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), ec;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return ec;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new tc(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ws.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Be(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		rc(e.preventDefault, t) && t.domEvent.preventDefault(), rc(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function rc(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function ic(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function ac(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function oc(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && sc(e, t) : cc(e, t);
}
function sc(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!oc(e[n], t[n])) return !1;
	return !0;
}
function cc(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !oc(e[n], t[n]) : !lc(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !lc(t[n])) return !1;
	return !0;
}
function lc(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
var uc = `.${rr}, .${ir}`;
function dc() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function fc(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body || pc(e)) return null;
	let n = e;
	for (; n.parentElement !== null && !pc(n.parentElement);) n = n.parentElement;
	let r = mc(n) ?? hc();
	return r !== null && M(r), r;
}
function pc(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function mc(e) {
	let t = Ts(e.closest(uc) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function hc() {
	let e = document.querySelector(`[${Lt}="content"]`);
	return e === null ? null : (zs(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var gc = class {
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
		for (let e of Us) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = yc(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && oc(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = qs(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
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
			for (let e of t.interactions) Tr(e.actionKind) === "CopyValue" && bc(e.target) && this.writeTarget(e.target, t.dynamicParameters, _c(e, n), !0);
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
		let t = this.index.getPropertyInteractions(S(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? yc(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Tr(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!bc(a)) return;
		let o = i === "CopyValue" ? _c(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = dc();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && fc(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: vc(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function _c(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function vc(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = S(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Xr(s, o)) return a === 0 ? e : {
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
function yc(e, t) {
	return JSON.stringify([
		S(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function bc(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var xc = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Sc(t, e.operator, e.value);
	}
};
function Sc(e, t, n) {
	let r = Cc(e), i = Cc(n);
	switch (Er(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return wc(r, i, (e) => e > 0);
		case "GreaterOrEqual": return wc(r, i, (e) => e >= 0);
		case "Less": return wc(r, i, (e) => e < 0);
		case "LessOrEqual": return wc(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Ec(r, i);
		case "RegexEach": return Tc(r, i);
		default: return !1;
	}
}
function Cc(e) {
	return sa(e) ? e.key : ca(e) ? e.text : e;
}
function wc(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Tc(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Ec(Cc(e), t)) : Ec(e, t);
}
function Ec(e, t) {
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
var Dc = "Value", Oc = "EndValue", kc = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	valueInteractions = /* @__PURE__ */ new Map();
	endValueInteractions = /* @__PURE__ */ new Map();
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
		return this.eventNames.has(Hr(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Mc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Hr(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Nc(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Pc(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Ac(e)) {
			let t = S(e.sourceEvent?.componentId), n = Hr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Nc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Nc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (jc(e)) {
			let t = S(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Pc(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Pc(t, n), r)), r.push(e), Tr(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Dc ? this.valueInteractions : i === Oc ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Ac(e) {
	return wr(e.sourceKind) === "Event";
}
function jc(e) {
	return wr(e.sourceKind) === "Property";
}
function Mc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Nc(e, t) {
	return `${e}:${Hr(t)}`;
}
function Pc(e, t) {
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
function Fc() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Ic(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Lc = /* @__PURE__ */ new Set([
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
function Rc(e) {
	return Lc.has(e);
}
var zc = 4, Bc = 12, Vc = /* @__PURE__ */ new Map(), Hc = !1, Uc = null, Wc = /* @__PURE__ */ new WeakMap(), Gc = "data-ui-popup-stood-in";
function Kc(e, t) {
	t === null ? Wc.delete(e) : Wc.set(e, t);
}
var qc = "--ui-popup-ground";
function Jc(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(qc).trim() : "";
	n.length === 0 ? t.style.removeProperty(qc) : t.style.setProperty(qc, n);
}
function Yc(e, t, n) {
	Vc.set(t, {
		anchor: e,
		options: n
	}), rl(), Uc?.observe(t), Zc(e, t), al(e, t, n);
}
var Xc = "data-ui-popup-lifted";
function Zc(e, t) {
	if (t.hasAttribute(Xc)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!$c(t) && e.closest(`[${Xc}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(Xc, ""), Qc(t));
}
function Qc(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function $c(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function el(e) {
	e.hasAttribute(Xc) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Vc.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Xc));
	}, N.fast));
}
function tl(e) {
	let t = Vc.get(e);
	t !== void 0 && al(t.anchor, e, t.options);
}
function nl(e) {
	e != null && (Vc.delete(e), Uc?.unobserve(e), el(e));
}
function rl() {
	Hc || (Hc = !0, document.addEventListener("scroll", il, !0), window.addEventListener("resize", il), window.visualViewport?.addEventListener("resize", il), window.visualViewport?.addEventListener("scroll", il), Uc = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Vc.get(t.target);
			e !== void 0 && al(e.anchor, t.target, e.options, !0);
		}
	}));
}
function il() {
	for (let [e, t] of Vc) {
		if (!e.isConnected) {
			nl(e);
			continue;
		}
		al(t.anchor, e, t.options);
	}
}
function al(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = ol(e), a = i !== e;
	t.hasAttribute(Gc) !== a && t.toggleAttribute(Gc, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = ll(n.boundary), f = Vc.get(t), p = r ? f?.side : void 0, m = p !== void 0 && dl(c, u, p, l, d) ? p : ul(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m);
	let ee = n.alignEntries === !0 ? yl(t, m) : vl, h = xl(c, s, u, m, l, ee), te = Sl(c, s, u, m, l, ee);
	n.arrow === !0 && (ml(m) ? te = sl(te, s.left + s.width / 2, u.width) : h = sl(h, s.top + s.height / 2, u.height));
	let ne = wl();
	h = ne.top + Ol(h - ne.top, u.height, ne.bottom - ne.top), te = Ol(te, u.width, window.innerWidth), t.style.top = `${h}px`, t.style.left = `${te}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), cl(t, s, u, m, h, te);
}
function ol(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Gc)) return e;
		let n = Wc.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function sl(e, t, n) {
	let r = t - e;
	return r < Bc ? e - (Bc - r) : r > n - Bc ? e + (r - (n - Bc)) : e;
}
function cl(e, t, n, r, i, a) {
	let o = ml(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Bc, Math.min(s, c - Bc))}px`);
}
function ll(e) {
	let t = wl(), n = {
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
function ul(e, t, n, r, i) {
	let a = gl(n);
	if (dl(e, t, n, r, i)) return n;
	if (dl(e, t, a, r, i)) return a;
	for (let a of fl(n)) if (dl(e, t, a, r, i)) return a;
	return hl(e, a, i) > hl(e, n, i) ? a : n;
}
function dl(e, t, n, r, i) {
	return hl(e, n, i) >= pl(t, n) + r;
}
function fl(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function pl(e, t) {
	return ml(t) ? e.height : e.width;
}
function ml(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function hl(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function gl(e) {
	return e.startsWith("top") ? `bottom${_l(e)}` : e.startsWith("bottom") ? `top${_l(e)}` : e.startsWith("left") ? `right${_l(e)}` : `left${_l(e)}`;
}
function _l(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var vl = {
	start: 0,
	end: 0
};
function yl(e, t) {
	let n = getComputedStyle(e);
	return ml(t) ? {
		start: bl(n.paddingLeft) + bl(n.borderLeftWidth),
		end: bl(n.paddingRight) + bl(n.borderRightWidth)
	} : {
		start: bl(n.paddingTop) + bl(n.borderTopWidth),
		end: bl(n.paddingBottom) + bl(n.borderBottomWidth)
	};
}
function bl(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function xl(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Cl(t.top, t.height, n.height, r, a);
}
function Sl(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Cl(t.left, t.width, n.width, r, a);
}
function Cl(e, t, n, r, i) {
	let a = _l(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function wl() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Tl(r))
	};
}
function Tl(e) {
	let t = document.querySelector(`[${It}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function El(e, t, n) {
	let r = e.getBoundingClientRect(), i = wl();
	e.style.left = `${Dl(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Dl(n, r.height, i.top, i.bottom)}px`;
}
function Dl(e, t, n, r) {
	return e + t <= r - zc ? e : e - t >= n + zc ? e - t : n + Ol(e - n, t, r - n);
}
function Ol(e, t, n) {
	return Math.max(zc, Math.min(e, n - t - zc));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var kl = 32;
function P(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Al(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Al(e, t, n) {
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
		if (r.size > kl) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function jl(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Ml = "data-ui-dialog", Nl = "data-ui-dialog-modal", Pl = "data-ui-dialog-backdrop", Fl = "data-ui-dialog-close-backdrop", Il = "data-ui-dialog-close-escape";
function Ll(e) {
	let t = e.querySelectorAll(`[${Ml}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Rl(e) {
	let t = Ll(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function zl(e) {
	let t = typeof document > "u" ? null : Rl(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var Bl = "data-ui-rename-field";
function Vl(e) {
	return e instanceof Element && e.closest(`[${Bl}]`) !== null;
}
function Hl(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Bl, ""), r.setAttribute(Ve, ""), r.value = e.value, Ul(r, n, t);
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
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function Ul(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Wl(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = Gl((r.left - i.left) / s - n.clientLeft), e.style.top = Gl((r.top - i.top) / s - n.clientTop), e.style.width = Gl(r.width / s), e.style.height = Gl(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Wl(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function Gl(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Kl = /* @__PURE__ */ new Set(), ql = /* @__PURE__ */ new Map(), Jl = 0, Yl = !1;
function Xl() {
	Yl || (Yl = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Vl(e.target) || $l() && e.preventDefault();
	}, !0));
}
function Zl() {
	for (let e of Kl) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Ql(e) {
	for (let t of Kl) t.hearRefusedClick(e);
}
function $l() {
	let e = [];
	for (let t of Kl) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...ql.keys()]) t.has(e) || ql.delete(e);
	for (let { popup: t } of e) ql.has(t) || ql.set(t, ++Jl);
	let n = eu(e, (e) => ql.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function eu(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var tu = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Kl.add(this), Xl();
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
		return this.options.isBehind === void 0 ? zl(e) : this.options.isBehind(e);
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
function nu(e, t) {
	return e.isConnected && !T(e) && !(t && D(e));
}
var ru = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new tu({
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
			isBehind: (e) => zl(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || ys() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : iu(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, su(t)) && !zl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = js(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && nu(n.owner, this.closesWhenReadOnly) && !zl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !nu(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), cu(e), lu(e, !0), fu(this), e.focus !== void 0 && e.focus !== !1 && Ms(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && cu(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Bs(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), lu(r, !1), nl(r.popup), this.entries.size === 0 && pu(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (nu(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !au() && ou(e);
		}
	}
};
function iu(e) {
	return e instanceof Element && e.isConnected && Ha(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function au() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Ha(e);
}
function ou(e) {
	zs(e), M(e);
}
function su(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function cu(e) {
	e.anchor !== void 0 && e.placement !== void 0 && Yc(e.anchor, e.popup, e.placement);
}
function lu(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var uu = /* @__PURE__ */ new Set(), du = null;
function fu(e) {
	uu.add(e), du === null && typeof MutationObserver == "function" && (du = new MutationObserver(() => {
		for (let e of [...uu]) e.closeStranded();
	}), du.observe(document, {
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
function pu(e) {
	uu.delete(e), !(uu.size > 0 || du === null) && (du.disconnect(), du = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var mu = "ui-flyout", hu = "ui-flyout--open", gu = "ui-flyout__anchor", _u = "data-ui-flyout-no-backdrop-close", vu = "data-ui-flyout-no-escape-close", yu = `${mu}--`, bu = "bottom-start", xu = class {
	root;
	flyouts = new ru({
		show: ({ owner: e }) => e.classList.add(hu),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? vu : _u)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${mu}`)) this.place(e);
		P(this.root, `.${mu}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${ir}`), n = e.querySelector(`:scope > .${gu}`);
		if (t === null) return;
		let r = Su(n, t);
		if (!e.classList.contains(hu)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: wu(n) ?? e,
			placement: { placement: Tu(e) },
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(hu) && (e.classList.remove(hu), Cu(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gu}`)?.closest(`.${mu}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(hu), this.place(t), this.flyouts.isOpen(t) && Cu(t, !0);
		}
	}
};
function Su(e, t) {
	if (e === null) return null;
	let n = e.querySelector(ss) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", vr(t, "ui-flyout-content")), n;
}
function Cu(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function wu(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Tu(e) {
	for (let t of e.classList) {
		if (!t.startsWith(yu)) continue;
		let e = t.slice(yu.length);
		if (Rc(e)) return e;
	}
	return bu;
}
//#endregion
//#region src/interactions/file-drop.ts
var Eu = "data-ui-file-drop-over", Du = 120, Ou = "refused", ku = !1;
function Au(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Pu();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => ju(e, t, n), !0);
	e.root.addEventListener("dragend", () => Bu(t.marked), !0), window.addEventListener("blur", () => Bu(t.marked)), e.root.addEventListener("paste", (t) => Mu(e, t), !0);
}
function ju(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Bu(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Fu(n), n.type !== "dragleave" && Bu(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || zu(r, a) : t.leaving = window.setTimeout(() => Bu(r), Du);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Iu(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && zu(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Eu;
		r.set(a, o), a.setAttribute(o, t ? Ou : "");
		return;
	}
	Bu(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Vu(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Mu(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Vu(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Nu(e, t, n) {
	for (let r = t.closest(`[${oe}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${An}="${b(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Pu() {
	if (!ku) {
		ku = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Fu(e);
		});
	}
}
function Fu(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Iu(e, t) {
	let n = Lu(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Ru(t, e)));
}
function Lu(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Ru(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function zu(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function Bu(e) {
	for (let t of [...e.keys()]) zu(e, t);
}
function Vu(e, t) {
	let n = Lu(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Ru(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Hu = "/_ne/files/upload", Uu = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], Wu = /* @__PURE__ */ new Map(), Gu = !1;
function Ku(e, t, n, r) {
	let i = Number(e.getAttribute(On)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return Wu.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of Wu.keys()) e.isConnected || Wu.delete(e);
	return Wu.set(e, c), qu(e, c), Yu(), a;
}
function qu(e, t) {
	let n = Ju(t.limit, w.language);
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
function Ju(e, t) {
	let n = e, r = "byte";
	for (let e of Uu) {
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
function Yu() {
	Gu || (Gu = !0, w.onChange(() => {
		for (let [e, t] of Wu) e.isConnected ? qu(e, t) : Wu.delete(e);
	}));
}
function Xu(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Hu), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var Zu = () => {};
function Qu(e) {
	return {
		uploadAsync: (e, t) => Xu(e, t ?? Zu),
		accepts: Vu,
		takeWithinSizeLimit: (t, n, r) => Ku(t, n, r, e)
	};
}
function $u(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var ed = "ui-open-picker";
function td(e) {
	return !e.dispatchEvent(new Event(ed, {
		bubbles: !0,
		cancelable: !0
	}));
}
function nd(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || D(n) || T(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var rd = "ui-file-input", id = "ui-file-input__row", ad = "ui-file-input__native", od = "ui-file-input__field", sd = "ui-file-input__selection", cd = "data-ui-file-dragging", ld = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, w.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(ed, (e) => nd(e, {
			rootSelector: `.${rd}`,
			nativeSelector: `.${ad}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Au({
			root: this.root,
			draggingAttribute: cd,
			resolveTarget: (e) => {
				let t = e.closest(`.${id}`)?.closest(`.${rd}`) ?? null, n = t === null ? Nu(this.root, e, `.${rd}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${ad}`) ?? null;
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
		let t = e.target.closest(`[${kn}], .${id}`);
		if (t === null || T(t) || D(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${rd}`)?.querySelector(`.${ad}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ad)) return;
		let t = e.target.closest(`.${rd}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${od}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Ku(e, t, e.querySelector(`.${ad}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Xu(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => w.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, ud(r)), this.publishSelection(e, t.selectionId);
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
		$u(e.querySelector(`.${sd}`), t);
	}
};
function ud(e) {
	return e.length === 1 ? e[0].name : () => w.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var dd = "ne-picture-as-pdf", fd = "ne-text-snippet", pd = "ne-description", md = "ne-table-chart", hd = "ne-slideshow", gd = "ne-folder-zip", _d = "ne-audio-file", vd = "ne-video-file", yd = "ne-image", bd = "ne-code", xd = "ne-draft", Sd = new Map([
	...Ed(dd, "pdf"),
	...Ed(fd, "txt", "md", "log"),
	...Ed(pd, "doc", "docx", "odt", "rtf"),
	...Ed(md, "xls", "xlsx", "ods", "csv", "tsv"),
	...Ed(hd, "ppt", "pptx", "odp", "key"),
	...Ed(gd, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Ed(_d, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Ed(vd, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Ed(yd, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Ed(bd, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Cd = /* @__PURE__ */ new Map([
	["application/pdf", dd],
	["text/csv", md],
	["application/msword", pd],
	["application/rtf", pd],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", pd],
	["application/vnd.oasis.opendocument.text", pd],
	["application/vnd.ms-excel", md],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", md],
	["application/vnd.oasis.opendocument.spreadsheet", md],
	["application/vnd.ms-powerpoint", hd],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", hd],
	["application/vnd.oasis.opendocument.presentation", hd],
	["application/zip", gd],
	["application/x-zip-compressed", gd],
	["application/x-7z-compressed", gd],
	["application/vnd.rar", gd],
	["application/x-rar-compressed", gd],
	["application/x-tar", gd],
	["application/gzip", gd],
	["application/json", bd],
	["application/xml", bd],
	["text/xml", bd],
	["text/html", bd]
]), wd = /* @__PURE__ */ new Map([
	["image", yd],
	["audio", _d],
	["video", vd],
	["text", fd]
]);
function Td(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Sd.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Cd.get(i) ?? (a < 0 ? void 0 : wd.get(i.slice(0, a))) ?? xd;
}
function Ed(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Dd = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Od(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Dd.includes(t.slice(0, n).toLowerCase());
}
function kd(e) {
	return Od(e) ? String(e) : void 0;
}
var Ad = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function jd(e) {
	let t = Fd(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Ad.some((e) => n.startsWith(e));
}
function Md(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Nd(e);
}
function Nd(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Pd(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Fd(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Id(e) {
	return Ld(e) !== null;
}
function Ld(e) {
	let t = Fd(e), n = t.toLowerCase();
	return Nd(t) || Pd(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Rd(e) {
	return Ld(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var zd = "mask:", Bd = "ui-icon--image", Vd = "ui-icon--mask";
function Hd(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(zd) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Ld(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Ud(e) {
	let t = Hd(e);
	return t === null ? "" : Wd(t.source);
}
function Wd(e) {
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
var Gd = "ui-icon", Kd = "data-ui-icon", qd = "--ui-icon-url";
function Jd(e, t) {
	e.classList.add(Gd);
	for (let t of Array.from(e.classList)) Xd(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(qd);
	let n = Zd(t);
	if (n.length === 0) {
		e.removeAttribute(Kd);
		return;
	}
	e.setAttribute(Kd, ""), e.classList.add(n);
	let r = Hd(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(qd, Wd(r.source));
}
var Yd = "ui-icon-glyph--";
function Xd(e) {
	return e === Bd || e === Vd || e.startsWith(Yd);
}
function Zd(e) {
	let t = Hd(e);
	return t === null ? Qd(e) : t.tinted ? Vd : Bd;
}
function Qd(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Yd;
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
var $d = 1024, ef = 16777216;
function tf(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function nf(e, t) {
	let n = pf(t.zoom, 1, 4), r = ff(e) / n / 2;
	return {
		x: pf(t.x, r, e.width - r),
		y: pf(t.y, r, e.height - r),
		zoom: n
	};
}
function rf(e, t) {
	let n = ff(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function af(e, t, n) {
	return t.zoom * n / ff(e);
}
function of(e, t, n, r, i) {
	let a = af(e, t, n);
	return a > 0 ? nf(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function sf(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = pf(t.zoom * r, 1, 4), o = af(e, t, n), s = af(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? nf(e, {
		...t,
		zoom: a
	}) : nf(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function cf(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function lf(e, t) {
	return Math.min(1, t * 4 / ff(e), Math.sqrt(ef / (e.width * e.height)));
}
function uf(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function df(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function ff(e) {
	return Math.min(e.width, e.height);
}
function pf(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function mf(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Ml, e.key), t.setAttribute(Nl, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Il, ""), t.setAttribute(Fl, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Pl, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? rr : `${rr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var hf = class {
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
}, gf = class {
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
		t.setAttribute(In, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, _f(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(In), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(In);
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
function _f(e, t, n, r) {
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
var vf = 100 / 3, yf = 1, bf = 2;
function xf(e, t = vf) {
	let n = e.deltaMode === yf ? vf : e.deltaMode === bf ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Sf(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Cf = {
	notch: 100,
	pixels: xf
}, wf = "ui-image-crop", Tf = "ui-image-crop-title", Ef = new hf("data-ui-image-crop-part"), Df = "data-ui-image-crop-frame", Of = 10, kf = 1.2, Af = 380, jf = 100, Mf = .92, F = null, Nf = !1, Pf = null, Ff = !1;
async function If(e, t, n, r = Jf) {
	if (F !== null || Nf) return "cancelled";
	Nf = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Nf = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Pf ??= Lf();
		let o = Pf;
		o.dialog.isConnected || document.body.append(o.dialog), F = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: tf(a),
			finish: (t) => {
				F = null, e.close(wf), a.release(), i(t);
			}
		}, w.write(o.title, null, "ui.crop.title"), w.write(o.stage, "aria-label", "ui.crop.frame"), w.write(o.zoom, "aria-label", "ui.crop.zoom"), w.write(o.cancel, null, "ui.crop.cancel"), w.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Df, n.frame), e.open(wf), Kf(o);
	});
}
function Lf() {
	let { dialog: e, surface: t } = mf({
		key: wf,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Tf,
		closesOnEscapeAndBackdrop: !1
	}), n = Ef.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Tf;
	let r = Ef.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Ef.element("canvas", "ui-image-crop__canvas"), a = Ef.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Ef.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Ef.button("ui-button--outline", "cancel"), c = Ef.button("ui-button--primary", "apply");
	t.append(n, r, o, Ef.actions(s, c));
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
		let t = Ef.pressed(e);
		t === "cancel" ? F?.finish("cancelled") : t === "apply" && Rf();
	}), e.addEventListener("keydown", (e) => zf(l, e)), o.addEventListener("input", () => Wf(l, Number(o.value))), r.addEventListener("wheel", (e) => Bf(l, e), { passive: !1 }), window.addEventListener("resize", () => qf(l)), new gf({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => F === null ? null : {
			last: t,
			start: F.view
		},
		move: (e, t, n) => {
			e.last !== null && Vf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			F !== null && (F.view = t.start, Kf(l));
		},
		pinch: (e, t) => {
			e.last = null, Hf(l, t);
		}
	}), l;
}
async function Rf() {
	let e = F;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = rf(n, a), s = uf(t.type), c = i.encodeAsync(n, o, cf(o, r.size), s);
	F = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], df(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function zf(e, t) {
	if (t.defaultPrevented || t.isComposing || F === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), F.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Of;
	switch (t.key) {
		case "ArrowLeft":
			Vf(e, -n, 0);
			break;
		case "ArrowRight":
			Vf(e, n, 0);
			break;
		case "ArrowUp":
			Vf(e, 0, -n);
			break;
		case "ArrowDown":
			Vf(e, 0, n);
			break;
		case "+":
		case "=":
			Uf(e, kf);
			break;
		case "-":
		case "_":
			Uf(e, 1 / kf);
			break;
		case "Enter":
			Rf();
			break;
		default: return;
	}
	t.preventDefault();
}
function Bf(e, t) {
	if (F === null) return;
	t.preventDefault();
	let n = xf(t, e.stage.clientHeight), r = t.ctrlKey ? jf : Af;
	Uf(e, 2 ** (-n.y / r), Gf(e, t.clientX, t.clientY));
}
function Vf(e, t, n) {
	F !== null && (F.view = of(F.source, F.view, e.frame.clientWidth, t, n), Kf(e));
}
function Hf(e, t) {
	if (F === null) return;
	let n = of(F.source, F.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	F.view = sf(F.source, n, e.frame.clientWidth, t.factor, Gf(e, t.center.x, t.center.y)), Kf(e);
}
function Uf(e, t, n) {
	F !== null && (F.view = sf(F.source, F.view, e.frame.clientWidth, t, n), Kf(e));
}
function Wf(e, t) {
	F !== null && Number.isFinite(t) && t > 0 && Uf(e, t / F.view.zoom);
}
function Gf(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Kf(e) {
	if (F === null) return;
	let t = F.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), qf(e);
}
function qf(e) {
	Ff || F === null || (Ff = !0, requestAnimationFrame(() => {
		if (Ff = !1, F === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = F.view, a = af(F.source, i, t);
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
var Jf = {
	decodeAsync: async (e, t) => {
		let n = await Yf(e);
		if (n === null) return null;
		let r = n, i = lf(r, t);
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
		}, r, Mf);
	})
};
async function Yf(e) {
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
var Xf = "ui-image-input", Zf = "ui-image-input--multiple", Qf = "ui-image-input__surface", $f = "ui-image-input__native", ep = "ui-image-input__picture", tp = "ui-image-input__text", np = "ui-image-input__selection", rp = "ui-image-input__selections", ip = "ui-image-input__tiles", ap = "ui-image-input__tile", op = "ui-image-input__remove", sp = "ui-image-input__progress", cp = "ui-image-input__tile--file", lp = "ui-image-input__file-glyph", up = "ui-image-input__file-name", dp = "SelectionId", fp = "--ui-image-progress", pp = "data-ui-image-preview", mp = "data-ui-image-dragging", hp = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Xf}`)), P(this.root, `.${Xf}`, {
			childList: !0,
			attributeFilter: [
				Dn,
				He,
				Wn
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === dp && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(ei(e.components, `.${Xf}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(ed, (e) => nd(e, {
			rootSelector: `.${Xf}`,
			nativeSelector: `.${$f}`,
			pressed: (e) => e.querySelector(`.${Qf}`)
		})), this.root.addEventListener(oo, (e) => this.handleDraftDropped(e)), Au({
			root: this.root,
			draggingAttribute: mp,
			resolveTarget: (e) => {
				let t = e.closest(`.${Qf}`), n = t?.closest(`.${Xf}`) ?? null, r = n === null ? Nu(this.root, e, `.${Xf}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Qf}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${$f}`)?.getAttribute("accept") ?? "",
					multiple: gp(i),
					refused: D(i) || T(a)
				};
			},
			onFiles: (e, t) => void (gp(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) gp(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${ep}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || xp(e, e.getAttribute("data-ui-image-caption") ?? wp(n)), Cp(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Wn);
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
		for (let t of e) gp(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${kn}]`), n = t?.closest(`.${Xf}`) ?? null;
		t === null || n === null || D(n) || T(t) || n.querySelector(`.${$f}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${op}`), n = t?.closest(`.${Xf}`) ?? null;
		if (t === null || n === null || D(n) || T(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains($f)) return;
		let t = e.target.closest(`.${Xf}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (gp(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Xf}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), $u(t.querySelector(`.${np}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Qf}`), r = e.querySelector(`.${ep}`), i = e.querySelector(`.${np}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || Ku(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(pp, ""), r.setAttribute("src", o.url), xp(e, a.name), Cp(e, !0), n.classList.add(er);
		try {
			let t = await Xu([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, $u(i, t.selectionId));
		} catch (t) {
			Sp(e), $u(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(er);
		}
	}
	async cropAsync(e, t) {
		let n = _p(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await If(this.dialogs, t, {
				frame: n,
				size: vp(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${ip}`), r = Ku(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = yp(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Xu([t], (e) => r.element.style.setProperty(fp, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(er), this.publishShelf(e);
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
		let t = e.querySelector(`.${rp}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Wn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(pp), t || xp(e, ""));
	}
};
function gp(e) {
	return e.classList.contains(Zf);
}
function _p(e) {
	let t = e.getAttribute(Ue);
	return t === "square" || t === "circle" ? t : null;
}
function vp(e) {
	let t = Number(e.getAttribute(We));
	return Number.isInteger(t) && t > 0 ? t : $d;
}
function yp(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${ap} ${er}`, n.type = "button", n.className = op, r.className = sp, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, w.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...bp(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...bp(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function bp(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(cp), e.setAttribute("title", n.name), r.className = lp, r.setAttribute("aria-hidden", "true"), Jd(r, Td(n.name, n.type)), i.className = up, i.textContent = n.name, w.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function xp(e, t) {
	let n = e.querySelector(`.${tp}`);
	n !== null && (Na(n, null), n.textContent !== t && (n.textContent = t));
}
function Sp(e) {
	let t = e.querySelector(`.${tp}`);
	t !== null && w.write(t, null, "ui.file.failed");
}
function Cp(e, t) {
	let n = e.querySelector(`.${Qf}`);
	n !== null && w.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function wp(e) {
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
var Tp = "ui-key-value-action__row", Ep = "ui-key-value-action__value", Dp = "ui-key-value-action__value-input", Op = "ui-key-value-action__edit-action", kp = "ui-text__title", Ap = "ui-row-form-", jp = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Tp}`), !1), P(this.root, `.${Tp}`, {
			childList: !0,
			attributeFilter: [En]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Pp(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Np(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${Op} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Ap}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Dp} [${ze}]:not([${wt}])`)) t.setAttribute(wt, n);
		t.setAttribute(Zn, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${wt}="${t}"], [${Zn}="${t}"]`)) n.removeAttribute(wt), n.removeAttribute(Zn);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Dp} [${ze}]`)) {
			if (ao(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		so(e), this.judge(e);
	}
	judge(e) {
		let t = Mp(e);
		for (let n of e.querySelectorAll(`.${Dp} [${ze}]`)) this.options.validation.judgeShown(n, ao(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Dp} :is(input, textarea, select)`);
		if (n !== null) {
			if (ao(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Mp(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), io(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Ip(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Op)) return;
		let { cell: n, row: r } = t, i = e.target.closest(or), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Op} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !T(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Mp(e) {
	return e.querySelector(`.${Ep} .${kp}`)?.textContent?.trim() ?? "";
}
function Np(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(`.${Dp}`)?.closest(`.${Tp}`) ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Pp(e) {
	let t = e.closest(`.${Op} button`), n = t?.closest(`.${Op}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
function Fp(e) {
	return Ip(e) !== null;
}
function Ip(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Dp}, .${Op}`), n = t?.closest(`.${Tp}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Lp = `.ui-button[${st}="pressed"]`, Rp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Lp);
		t === null || T(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, zp = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${sr}, .ui-field-box`, Bp = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Vp = `${Bp}, ${zp}, ${or}, .${ge}`, Hp = "button, a, summary, [role='button']";
function Up(e) {
	let t = [];
	for (let n of e.querySelectorAll(Vp)) if (!(n.classList.contains("ui-row__grip") || !Kp(e, n) || Gp(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Hp) ? n : null;
}
function Wp(e) {
	let t = [];
	for (let n of e.querySelectorAll(Bp)) Gp(e, n) && Kp(e, n) && t.push(n);
	return t;
}
function Gp(e, t) {
	let n = t.closest(`[${me}]`);
	return n !== null && n !== e && e.contains(n);
}
function Kp(e, t) {
	let n = t.closest(or);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function qp(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Vp);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var Jp = `${Bp}, [tabindex], [contenteditable], ${or}, [${Ve}]`, Yp = ":scope > input.ui-field, :scope > textarea.ui-field", Xp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(zp);
		if (t === null || e.target !== t && e.target.closest(Jp) !== null) return;
		let n = t.querySelector(Yp);
		if (!ao(n) || n.readOnly || T(n) || D(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
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
var Zp = "data-ui-submit-on-enter", Qp = "data-ui-runs-on-enter", $p = "enter", em = 229, tm = {
	name: $p,
	registration: { settlesValue: !0 }
}, nm = "ui-commit-in-place", rm = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(nm, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || im(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : am(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : om(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (io(t)) {
			if (e.preventDefault(), am(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || T(e) || (this.commitInPlace(e), e.dispatchEvent(new Event($p, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(wt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Zn}="${b(t)}"]`);
		n !== null && !T(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = js(e);
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
		let r = Ko(e);
		r?.root === t && r.row !== null && Zo(t, I(t, So, k), r.row), M(t);
	}
};
function im(e) {
	return e.isComposing || e.keyCode === em;
}
function am(e, t) {
	return sm(t) && e.hasAttribute(Qp);
}
function om(e, t) {
	return sm(t) && e.hasAttribute(Zp) && !e.readOnly && !T(e);
}
function sm(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var cm = "data-ui-fallback-src", lm = `img[${cm}]`, um = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(lm)) (dm(e) || e.complete && e.naturalWidth === 0) && fm(e);
		P(this.root, lm, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && dm(t) && fm(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && fm(t);
	}
};
function dm(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function fm(e) {
	let t = e.getAttribute(cm);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var pm = "data-ui-radio-value", mm = "ui-radio-group__input", hm = "ui-radio-group__dot", gm = "ui-radio-group", _m = "ui-radio-group__item", vm = "data-ui-radio-group-name", ym = "data-ui-radio-bind-value-id", bm = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${gm}`)]);
		for (let e of this.root.querySelectorAll(`.${gm}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${gm}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(xm));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [pm, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${gm}`)) {
			let n = e.getAttribute(vm);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(vm), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(vm, a);
			for (let e of I(r, `.${mm}`, `.${gm}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${gm}`)) n.has(e.getAttribute(vm) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(pm);
		for (let n of I(e, `.${mm}`, `.${gm}`)) {
			n.checked = n.value === t;
			let e = Sm(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(_m) ? [e] : [...e.querySelectorAll(`.${_m}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${mm}`) !== null) return;
		let t = e.closest(`.${gm}`), n = t?.getAttribute(vm);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = mm, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(ym);
		a !== null && r.setAttribute(ze, a);
		let o = document.createElement("span");
		o.className = hm, e.prepend(r, o), this.sync(t);
	}
};
function xm(e) {
	return e.classList.contains(gm) ? [e] : [...e.querySelectorAll(`.${gm}`)];
}
function Sm(e) {
	let t = e.closest(`.${_m}`);
	return t !== null && E(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Cm(e) {
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
function wm(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Tm(e, t) {
	return t !== null && e.length >= t;
}
function Em(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Tm(e, n) ? null : [...e, t];
}
function Dm(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Om = /[,\uFF0C\r\n]/;
function km(e) {
	return Om.test(e);
}
function Am(e) {
	return e.split(Om).map((e) => e.trim()).filter((e) => e.length > 0);
}
function jm(e) {
	let t = e.split(Om), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Mm(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Tm(a, n) ? r : i(a, t);
		if (c !== null) {
			o.push(e.text), s ??= c;
			continue;
		}
		a = t;
	}
	return {
		keys: a,
		refused: o,
		reason: s
	};
}
//#endregion
//#region src/interactions/search-terms.ts
var Nm = /\p{M}/gu;
function Pm(e, t) {
	return Fm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Fm(e, t) {
	return Rm(e, Lm(t));
}
function Im(e, t) {
	return t.every((t) => e.includes(t));
}
function Lm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Rm(e, t) {
	let n = e.normalize("NFD").replace(Nm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var zm = "data-ui-search-debounce", Bm = "data-ui-search-min-length", Vm = "data-ui-search-manual", Hm = "data-ui-search-answered", Um = "ui-search__input", Wm = "ui-select__list", Gm = "ui-select__option", Km = "ui-text__title", qm = 300, Jm = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Um) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		Ym(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(zm), i = r === null ? qm : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : qm));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Um)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute(Vm)) return;
		let n = e.getAttribute(Bm), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Ym(e) {
	if (e.hasAttribute(Hm)) return;
	let t = e.closest(`.${dr}`), n = t?.querySelector(`.${Wm}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Bm), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Pm(e.value, e) : [], o = Zm(n, (e) => a.length === 0 || Im(Fm(Xm(e), e), a));
	eh(t, n, a.length > 0 && o === 0);
}
function Xm(e) {
	return e.querySelector(`.${Km}`)?.textContent ?? e.textContent ?? "";
}
function Zm(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Qm(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Gm)) continue;
		let e = t(a);
		Qm(a, e), r ||= e, e && i++;
	}
	return n !== null && Qm(n, r), i;
}
function Qm(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function $m(e) {
	let t = e.querySelector(`.${Wm}`);
	t !== null && eh(e, t, Zm(t, (e) => e.style.display !== "none") === 0);
}
function eh(e, t, n) {
	let r = t.querySelector(`:scope > [${tt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${$e}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(tt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var th = 500, nh = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > th) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Fm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Fm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function rh(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var ih = "data-ui-select-value", ah = "data-ui-select-placement", oh = "ui-select--open", sh = "ui-select__trigger-content", ch = "data-ui-select-content", lh = "ui-select__placeholder", uh = "ui-input__affix-icon--prefix", dh = "ui-select__popup", fh = "ui-select__list", ph = "ui-select__option", mh = "ui-select__value-input", hh = "data-ui-select-clear", gh = "ui-search", _h = "ui-search__input", vh = "ui-text__title", yh = "data-ui-active", bh = "ui-multi-select", xh = "ui-multi-select__chips", Sh = "ui-multi-select__chip", Ch = "ui-multi-select__chip-label", wh = "ui-multi-select__chip-remove", Th = "data-ui-select-chip", Eh = "data-ui-select-max", Dh = "data-ui-select-free-text", Oh = "ui-multi-select__entry", kh = "data-ui-select-tag-entry", Ah = [
	ih,
	Wn,
	Eh,
	"class",
	g
];
function jh(e) {
	return e === null || D(e) || T(e);
}
function Mh(e) {
	return e.classList.contains(bh);
}
function Nh(e) {
	return e.classList.contains(gh);
}
function Ph(e) {
	return Nh(e) ? e.querySelector(`.${_h}`) : null;
}
function Fh(e) {
	return e.hasAttribute(Dh) ? e.querySelector(`:scope > .${sr} .${Oh}`) : null;
}
function Ih(e) {
	return Ph(e) ?? Fh(e);
}
function Lh(e) {
	return Fh(e) ?? e.querySelector(".ui-select__trigger");
}
function Rh(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Oh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function L(e) {
	return I(e, `.${dh} .${ph}`, `.${dr}`);
}
function zh(e) {
	return e === null ? null : e.querySelector(`.${vh}`)?.textContent ?? e.textContent;
}
function Bh(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(oe), t.removeAttribute(g), t.removeAttribute(ce), t.removeAttribute(se);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Vh = class {
	root;
	popups = new ru({
		show: ({ owner: e }) => e.classList.add(oh),
		hide: ({ owner: e }) => {
			e.classList.remove(oh), this.markActive(e, null);
			let t = e.querySelector(`.${dh}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new nh();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${dr}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Zh(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Ah,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${hh}], .${wh}`) !== null || Kh(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (jh(r)) return;
		this.releaseRefusal(r);
		let i = jm(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Rh(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented ? Rh(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(kh) !== "first-suggestion" || !L(t.select).some((e) => e.hasAttribute(yh)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Rh(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || jh(t.select) || !km(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Am(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Cm(e.getAttribute(Wn)), a = wm(e.getAttribute(Eh)), o = Mm(i, n.map((t) => ({
			text: t,
			key: qh(e, t) ?? t
		})), a, {
			key: "ui.select.full",
			args: { max: a }
		}, (t, n) => this.validation?.entryRefusal(e, t, n) ?? null);
		o.keys.length !== i.length && this.writeChosen(e, o.keys), t.value = [...o.refused, r].filter((e) => e.trim().length > 0).join(", "), o.reason !== null && this.validation !== void 0 && (this.validation.mark(e, "error", o.reason), this.refusedEntries.add(e)), this.suggest(e, t);
	}
	releaseRefusal(e) {
		this.refusedEntries.delete(e) && this.validation?.mark(e, null);
	}
	suggest(e, t) {
		Ym(t);
		let n = t.value.trim().length > 0, r = n ? L(e).filter((e) => Uh(e) && !E(e)) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(kh) === "first-suggestion" && (this.markActive(e, i), i !== null && Wh(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Mh(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(ih);
		this.decorateOptions(e);
		let n = t === null ? null : L(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${lh}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of L(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${mh}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), $m(e);
	}
	syncMultiple(e) {
		let t = Cm(e.getAttribute(Wn)), n = new Set(t), r = Tm(t, wm(e.getAttribute(Eh)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = L(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Fh(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		Yh(e, s.map((e) => ({
			key: e,
			label: Jh(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== jh(e) && (o.readOnly = jh(e));
		let c = e.querySelector(`.${lh}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${mh}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Wn, u), $m(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${sr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${sh}`), a = i?.getAttribute(ch) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(ch), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Nh(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(g);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = sh;
			let e = r.querySelector(`:scope > .${uh}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Bh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of L(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = E(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${ph}`);
		t === null || n === null || n.hasAttribute(yh) || E(n) || T(n) || n.closest(".ui-select") !== t || (Ih(t) === null && (O(L(t).filter((e) => !E(e)), n), Ss(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wh}`);
		if (t !== null) {
			let n = t.closest(`.${dr}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), jh(n) || this.removeChosen(n, t.closest(`.${Sh}`)?.getAttribute(Th) ?? null));
			return;
		}
		let n = e.target.closest(`[${hh}]`);
		if (n !== null) {
			let t = n.closest(`.${dr}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), jh(t) || (this.clearValue(t), Hh(t)));
			return;
		}
		let r = e.target.closest(`.${sr}`);
		if (r !== null) {
			let t = r.closest(`.${dr}`);
			if (jh(t)) return;
			e.preventDefault();
			let n = t === null ? null : Fh(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ph}`);
		if (i === null) return;
		let a = i.closest(`.${dr}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(L(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || this.handleEntryKey(e) || this.handleChipKey(e)) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveCurrent(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ph}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${dr}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleEntryKey(e) {
		let t = Rh(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (jh(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key === "ArrowDown" ? 1 : -1) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? L(r).find((e) => e.hasAttribute(yh) && Uh(e) && !E(e)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Am(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Am(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${xh} > .${Sh}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Th)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = Gh(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${wh}`) ?? (n === 1 ? Lh(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		Ym(t);
		let r = L(e).filter((e) => Uh(e) && !E(e) && !T(e)), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(wh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Mh(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), jh(n)) return !0;
				let r = Gh(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Th) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Th) ?? null);
				let o = a === null ? null : Gh(n).find((e) => e.getAttribute(Th) === a) ?? null;
				return o !== null && o.querySelector(`.${wh}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || jh(t)) return !1;
		e.preventDefault();
		let n = Ph(t);
		n !== null && Ym(n);
		let r = L(t).filter((e) => Uh(e) && !E(e) && !T(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = rh(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(ph))) return !1;
		let r = n.closest(`.${dr}`), i = r !== null && r === this.openSelect;
		if (r === null || jh(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Ph(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = L(r).filter((e) => !E(e) && !T(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(yh)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => zh(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (O(L(r).filter((e) => !E(e)), c), Wh(r, c), M(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Mh(t) || jh(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${xh} > .${Sh}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Th)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(_h) || !t.contains(e.target) ? null : L(t).find((e) => e.hasAttribute(yh) && !E(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Ih(e), i = Fh(e);
		r !== null && !t && Ym(r), $m(e);
		let a = e.querySelector(`.${sr}`), o = e.querySelector(`.${dh}`), s = e.querySelector(`.${fh}`) ?? o, c = e.getAttribute(ah);
		if (a === null || o === null || s === null) return;
		let l = vr(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Rc(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), Qh(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = L(e).filter((e) => !E(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && ys()) {
			O(n, null), this.markActive(e, null), Hh(e);
			return;
		}
		let i = r ?? n[0];
		O(n, i), this.markActive(e, i, ys()), Wh(e, i), M(i);
	}
	initializeSearch(e, t, n, r) {
		let i = L(e), a = i.filter((e) => Uh(e) && !E(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || ys() ? null : a[0] ?? null);
		O(i, null), this.markActive(e, o, ys()), o !== null && Wh(e, o), !bs() && (M(t), t.select());
	}
	initializeEntry(e, t) {
		O(L(e), null), this.markActive(e, t), t !== null && Wh(e, t);
	}
	moveCurrent(e, t) {
		let n = L(e).filter((e) => !E(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(yh)) ?? null, i = co({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Ih(e) === null ? (O(n, i), i.focus()) : Wh(e, i), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of L(e)) r === t ? r.setAttribute(yh, "") : r.hasAttribute(yh) && r.removeAttribute(yh), xs(r, r === t && n);
		let r = Ih(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", vr(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || E(t) || jh(e)) return;
		if (Mh(e)) {
			let r = Em(Cm(e.getAttribute(Wn)), n, wm(e.getAttribute(Eh)));
			this.markActive(e, t, ys()), r !== null && this.writeChosen(e, r);
			let i = Fh(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(ih) === n) {
			this.close();
			return;
		}
		e.setAttribute(ih, n), this.sync(e);
		let r = e.querySelector(`.${mh}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Dm(Cm(e.getAttribute(Wn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Sh}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Lh(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Wn) : e.setAttribute(Wn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${mh}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Mh(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(ih)) return;
		e.removeAttribute(ih), this.sync(e);
		let t = e.querySelector(`.${mh}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Hh(e) {
	let t = e.querySelector(`.${sr}`), n = Lh(e);
	t !== null && n !== null && !t.contains(document.activeElement) && M(n);
}
function Uh(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function Wh(e, t) {
	let n = e.querySelector(`.${fh}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function Gh(e) {
	return [...e.querySelectorAll(`.${xh} > .${Sh}`)];
}
function Kh(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Fh(t) !== null && !e.classList.contains(Oh);
}
function qh(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of L(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !E(t) && (e.toLocaleLowerCase() === n || zh(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function Jh(e, t) {
	let n = zh(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Yh(e, t) {
	let n = e.querySelector(`.${xh}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Sh}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Th) === t[n].key && e.querySelector(`.${Ch}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Xh(e.key, e.label)));
	}
}
function Xh(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Sh, n.setAttribute(Th, e), r.className = Ch, r.textContent = t, i.className = wh, i.type = "button", i.tabIndex = -1, w.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Zh(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${dr}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === ih || e.attributeName === "data-ui-selected-keys" || e.attributeName === Eh)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${dh}`)?.closest(`.${dr}`);
	n != null && t.add(n);
}
function Qh(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var $h = class {
	root;
	field = null;
	committed = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		let t = this.root === document ? window : this.root;
		t.addEventListener("focusin", (e) => this.handleFocus(e), !0), t.addEventListener("change", (e) => this.handleChange(e), !0), e.propertyPatchEngine?.addValueChangeHandler((e) => this.forgetPushed(e.components));
	}
	handleFocus(e) {
		let t = e.target;
		!ao(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
	}
	handleChange(e) {
		let t = this.field;
		if (t !== null && e.target === t) {
			if (t.value === this.committed) {
				e.stopImmediatePropagation();
				return;
			}
			this.committed = t.value;
		}
	}
	forgetPushed(e) {
		let t = this.field;
		if (t !== null) {
			for (let n of e) if (n.contains(t)) {
				this.committed = null;
				return;
			}
		}
	}
}, eg = "data-ui-input-debounce", tg = `input[${eg}], textarea[${eg}]`;
function ng(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(tg);
}
var rg = /* @__PURE__ */ new Set();
function ig() {
	for (let e of rg) if (e.waiting) return !0;
	return !1;
}
function ag() {
	for (let e of rg) e.commitAll();
}
var og = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), rg.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!ng(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(eg));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!ng(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, sg = "textarea.ui-text-area__field", cg = "data-ui-text-area-grow";
function lg() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var ug = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(sg) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(sg)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(ei(e.components, sg));
		}), P(this.root, sg, {
			childList: !0,
			attributeFilter: [cg]
		}, (e) => {
			this.fitAll(ei(e, sg));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(cg)) {
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
};
//#endregion
//#region src/interactions/range-handles.ts
function dg(e) {
	let t = fg(e.getAttribute("min"), 0), n = fg(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, fg(r, 1))
	};
}
function fg(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function pg(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function mg(e, t) {
	return hg(t.min + e * (t.max - t.min), t);
}
function hg(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, gg(t.min + r * t.step, t);
}
function gg(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(_g(t.step), _g(t.min)))));
}
function _g(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function vg(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function yg(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return bg(o, i);
	let s = (o - i.min) / i.step;
	return bg(gg(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function bg(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var xg = "ui-slider__input", Sg = "ui-slider__input--end", Cg = "ui-slider__input--held", wg = "ui-slider__value", Tg = "ui-slider__bubble", Eg = "ui-slider__track", Dg = "ui-slider__thumb-anchor", Og = "ui-slider", kg = "ui-slider--range", Ag = "ui-orientation--vertical", jg = "--ui-slider-fraction", Mg = "--ui-slider-end-fraction", Ng = 6, Pg = "Value", Fg = "EndValue", Ig = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Lg = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new gf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${kg} .${Eg}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Ig.has(e.propertyName)) return;
			let t = S(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) for (let t of n.querySelectorAll(`.${xg}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (zg(t) ? Fg : Pg) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Rg(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Rg(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Rg(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Hg(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(xg)) return;
		let t = e.target;
		if (this.cancelled.delete(t), Hg(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Bg(t);
		if (n !== null) {
			let e = Vg(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${xg}:not(.${Sg})`), r = e.querySelector(`.${Sg}`);
		if (n === null || r === null) return null;
		let i = mg(pg(e.getBoundingClientRect(), t, Ug(e), Wg(e)), dg(n)), a = vg(i, Number(n.value), Number(r.value));
		if (Hg(n)) return M(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? M(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${Eg}`);
		if (n === null) return;
		let r = mg(pg(n.getBoundingClientRect(), t, Ug(n), Wg(n)), dg(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Cg), M(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Bg(e), r = n === null ? String(t) : Vg(e, t, n);
		e.value !== r && (e.value = r, e.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	endBandDrag(e) {
		let t = e.held;
		this.letGo(e), t !== null && t.value !== (t === e.start ? e.from[0] : e.from[1]) && t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	putBandBack(e) {
		this.letGo(e);
		for (let [t, n] of [[e.start, e.from[0]], [e.end, e.from[1]]]) t.value !== n && (t.value = n, t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	letGo(e) {
		e.held?.classList.remove(Cg), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = Gg(e);
		t !== null && Yc(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Ng
		});
	}
	releaseBubble(e) {
		nl(Gg(e)?.bubble);
	}
	writeReadings(e) {
		let t = zg(e), n = e.closest(`.${Eg}`)?.parentElement ?? e.parentElement, r = t ? `.${wg}--end, .${Tg}--end` : `.${wg}:not(.${wg}--end), .${Tg}:not(.${Tg}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Eg}`)?.style.setProperty(t ? Mg : jg, String(Kg(e))), e.matches(`:active, :focus-visible, .${Cg}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Rg(e) {
	return e instanceof HTMLInputElement && e.classList.contains(xg) ? e : null;
}
function zg(e) {
	return e.classList.contains(Sg);
}
function Bg(e) {
	return e.closest(`.${kg} .${Eg}`)?.querySelector(zg(e) ? `.${xg}:not(.${Sg})` : `.${Sg}`) ?? null;
}
function Vg(e, t, n) {
	let r = Number(e.closest(`.${Og}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(yg(t, zg(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, dg(e)));
}
function Hg(e) {
	return D(e) || T(e);
}
function Ug(e) {
	return e.closest(`.${Og}`)?.classList.contains(Ag) === !0;
}
function Wg(e) {
	let t = e.querySelector(`.${Dg}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : Ug(e) ? t.height : t.width;
}
function Gg(e) {
	if (!(e instanceof Element) || !e.classList.contains(xg)) return null;
	let t = e.closest(`.${Eg}`), n = zg(e), r = t?.querySelector(n ? `.${Tg}--end` : `.${Tg}:not(.${Tg}--end)`) ?? null, i = t?.querySelector(n ? `.${Dg}--end` : `.${Dg}:not(.${Dg}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: Ug(e)
	};
}
function Kg(e) {
	let { min: t, max: n } = dg(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var qg = {
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
}, Jg = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Yg = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Xg = [
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
], Zg = [
	"n %",
	"n%",
	"%n",
	"% n"
], Qg = [
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
], $g = /[1-9]/;
function e_(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return qg;
	try {
		return {
			...qg,
			...JSON.parse(t)
		};
	} catch {
		return qg;
	}
}
function t_(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = r_(t);
	if (r === null) return i_(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = a_(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return n_(e, t) ? u_(Jg[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = a_(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return n_(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = o_(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return n_(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = a_(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return u_(n_(e, t) ? Xg[n.currencyNegativePattern] ?? "-$n" : Yg[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = a_(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return u_(n_(e, t) ? Qg[n.percentNegativePattern] ?? "-n %" : Zg[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return i_(e, n);
	}
}
function n_(e, t) {
	return e < 0 && $g.test(t);
}
function r_(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function i_(e, t) {
	let { integer: n, fraction: r } = s_(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function a_(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = o_(e, t, n);
	return n === 0 ? l_(o, r, i) : `${l_(o, r, i)}${a}${s}`;
}
function o_(e, t, n) {
	let { integer: r, fraction: i } = s_(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? c_(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function s_(e, t) {
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
function c_(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function l_(e, t, n) {
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
function u_(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var d_ = {
	readCulture: e_,
	format: t_
}, f_ = /^-?(\d+(\.\d*)?|\.\d+)$/;
function p_(e, t, n) {
	if (!f_.test(e)) return e;
	let r = n.thousands ? t : y_(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return t_(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return t_(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function m_(e, t, n) {
	return f_.test(e) ? (v_(n) ? b_(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function h_(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = v_(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!f_.test(d)) return null;
	let f = a ? b_(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function g_(e, t, n, r, i) {
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
function __(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function v_(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function y_(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function b_(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var x_ = "ui-number-input", S_ = "ui-number-input__field", C_ = "data-ui-number-no-decimals", w_ = "data-ui-number-no-negative", T_ = "data-ui-number-no-thousands", E_ = "data-ui-number-trim-zeros", D_ = "data-ui-number-step", O_ = "data-ui-number-min", k_ = "data-ui-number-max", A_ = "data-ui-number-step-direction", j_ = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${S_}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(ei(e.components, `.${S_}`));
		}), w.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${S_}`)));
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
		let t = M_(e);
		if (t !== null) return this.keptValue(t) ?? I_(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(E_) ? __(t) : t, r = e_(e), i = e === document.activeElement ? m_(n, r, L_(e)) : F_(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = M_(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(C_), r = !t.hasAttribute(w_), i = t.selectionStart ?? t.value.length, a = g_(t.value, i, e_(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = M_(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = M_(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : I_(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(E_) && !D(t) && !T(t)) {
			let e = this.values.get(t) ?? "", n = __(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = M_(e.target);
		if (t === null) return;
		let n = I_(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = M_(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = m_(t, e_(e), L_(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + A_ + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${S_}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(A_) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = M_(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(D_) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : I_(e) ?? "0") || 0) + n * t, i = e.getAttribute(O_), a = e.getAttribute(k_);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, R_(r)), this.show(e);
	}
};
function M_(e) {
	return e instanceof HTMLInputElement && e.classList.contains(S_) ? e : null;
}
function N_(e, t) {
	let n = e.classList.contains(x_) ? e.querySelector(`.${S_}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = P_(n, O_), a = P_(n, k_);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: F_(n, i, e_(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: F_(n, a, e_(n)) }
	} : null;
}
function P_(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function F_(e, t, n) {
	return p_(t, n, {
		format: L_(e),
		thousands: !e.hasAttribute(T_)
	});
}
function I_(e) {
	return h_(e.value, e_(e), L_(e));
}
function L_(e) {
	return e.closest(`.${x_}`)?.getAttribute("data-ui-number-format") ?? null;
}
function R_(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var z_ = `:scope > [${tt}], :scope > [${nt}], :scope > [${mt}]`;
function R(e) {
	let t = new Set(e.querySelectorAll(z_));
	return [...e.children].filter((e) => !t.has(e));
}
function B_(e) {
	return e === null ? [] : [e];
}
function V_(e) {
	return e.querySelector(`:scope > [${tt}]`);
}
function H_(e, t, n, r, i) {
	i ??= R(e).some((e) => !e.classList.contains(nr));
	let a = V_(e);
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
	c.setAttribute(tt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var U_ = { ok: !1 }, W_ = {
	ok: !0,
	value: null
}, G_ = null;
function K_(e) {
	G_ = e;
}
function q_(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Sr(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Sr(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return U_;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return U_;
			let t = a[u];
			if (u++, Sr(t.kind) === "Dynamic") {
				let n = Z_(e, t.componentId);
				if (!n.ok) return U_;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return U_;
				let e = iv(s, t.value);
				if (!e.ok) return U_;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return U_;
		if (l) {
			let e = ev(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? U_ : {
		ok: !0,
		value: s,
		scope: c
	};
}
function J_(e, t, n) {
	for (let r of t ?? []) {
		if (Sr(r.kind) !== "Dynamic") continue;
		let t = S(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Y_(e) {
	let t = $_(e, "IsContent");
	return t.ok && t.value === !0;
}
var X_ = /* @__PURE__ */ new Set();
function Z_(e, t) {
	let n = S(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return X_.has(n) || (X_.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), U_;
}
function Q_(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = $_(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function $_(e, t) {
	return ev(e, t, !0);
}
function ev(e, t, n) {
	if (e == null) return U_;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return U_;
	let r = e, i = tv(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? U_ : (n && G_?.(r, t), W_);
}
function tv(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = nv(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function nv(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function rv(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Sr(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Sr(e.kind) !== "Dynamic") {
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
function iv(e, t) {
	if (e == null || t == null) return U_;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : U_;
	if (typeof t != "string") return U_;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (ov(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return U_;
}
function av(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (ov(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function ov(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function sv(e) {
	let t = e.closest(y)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function cv(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = sv(e);
	if (a === void 0 && o === null) {
		for (let t of R(e)) t.classList.remove(nr);
		return;
	}
	for (let n of R(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(nr);
			continue;
		}
		n.classList.toggle(nr, !lv(a, e, i, o));
	}
}
function lv(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => mv(e, t, n)) && (r?.filters ?? []).every((e) => Sc(Q_(t, e.itemProperty), e.operator, e.value));
}
function uv(e, t, n = null) {
	return (e?.filters ?? []).some((e) => hv(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function dv(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => hv(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function fv(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => pv(n.getItemValue(e), n.getItemValue(r), t));
}
function pv(e, t, n) {
	for (let r of n) {
		let n = gv(Cc(Q_(e, r.itemProperty)), Cc(Q_(t, r.itemProperty)));
		if (n !== 0) return Dr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function mv(e, t, n) {
	if (!hv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Sc(Q_(t, e.itemProperty), e.operator, r);
}
function hv(e, t, n, r) {
	return e == null || Sc(r.get(e, []), t, n);
}
function gv(e, t) {
	if (e === t) return 0;
	let n = vv(e), r = vv(t);
	if (n !== r) return n - r;
	if (n === _v.Nothing) return 0;
	if (n === _v.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var _v = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function vv(e) {
	return e == null ? _v.Nothing : typeof e == "number" ? Number.isNaN(e) ? _v.Nothing : _v.Number : typeof e == "string" && e.trim().length === 0 ? _v.Nothing : Number.isNaN(Number(e)) ? _v.Text : _v.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function yv(e) {
	switch (e.getAttribute(lt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function bv(e) {
	let t = yv(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/items/items-source-order.ts
var xv = /* @__PURE__ */ new WeakMap();
function Sv(e, t) {
	let n = xv.get(e), r = n === void 0 ? [...t] : Cv(n, t);
	return xv.set(e, r), r;
}
function Cv(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function wv(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Tv(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Ev(e, t, n) {
	return Tv(e, t), wv(e, t, n);
}
function Dv(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Ov(e) {
	xv.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function kv(e, t, n, r, i, a = []) {
	Av(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Av(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var jv = ".ui-items-view, .ui-table", Mv = ".ui-items-view__item, .ui-table__row", Nv = "ui-row--dragging", Pv = "--ui-row-drop-offset", Fv = "move";
function Iv(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return {
		name: Fv,
		registration: {
			dynamicParameters: (e) => {
				let t = Lv(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			started: (n) => {
				let r = Lv(n.domEvent), i = r === null || !(n.domEvent.target instanceof Element) ? null : n.domEvent.target.closest(Mv), a = i?.parentElement ?? null;
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
function Lv(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
var Rv = class {
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
		let r = Bv(t.root, t.row);
		if (r === null ? !Vv(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Zo(t.root, qv(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(So), n = t?.parentElement ?? null, r = n?.closest(k) ?? null;
		return t === null || n === null || r === null || !t.matches(Mv) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || T(r) || t.hasAttribute("data-ui-undraggable") || E(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = ni(e);
		return this.services === void 0 || n === null ? !1 : dv(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, sv(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : A(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, kv(e, t.root, r, Nv, j(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = Uv(t), r = qv(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Jv(t.root, null) : Jv(t.root, i, Gv(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(So);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(So) ?? null;
		if (a ??= Kv(i, n), a === null) return null;
		let o = (A(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && Wv(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (Hv(t) !== Hv(e.row)) return null;
		let r = zv(this.orderOf(e.host), j(e.row), j(t), n);
		return r === null ? null : r + bv(e.host);
	}
	orderOf(e) {
		switch (yv(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? R(e).map(j)];
			case "windowed": return R(e).map(j);
			default: return Sv(e, R(e)).map(j);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && Jv(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, Uv(t), qv(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && as(t.row, Fv, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Av(e.root, Nv), Jv(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = Ko(e.target);
		if (t === null || !t.root.matches(jv) || t.row !== null && qp(e.target, t.row) !== null) return;
		let n = Bo(t.root), r = n === null ? [] : qv(n), i = Jo(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && as(i, Fv, { index: c });
	}
};
function zv(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function Bv(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ge}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Vv(e, t) {
	return qp(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Hv(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Uv(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function Wv(e, t, n) {
	if (Hv(e) !== Hv(t)) return !1;
	if (!n.across) return !0;
	let r = (A(e) ?? e).getBoundingClientRect(), i = (A(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Gv(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Wv(t.anchor, r, n)) return -1;
	let i = (A(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (A(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Kv(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (A(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function qv(e) {
	return R(e).filter((e) => e instanceof HTMLElement && e.matches(Mv) && A(e) !== null);
}
function Jv(e, t, n = 0) {
	let r = t === null ? null : A(t.anchor);
	for (let t of e.querySelectorAll(`[${_e}]`)) t !== r && (t.removeAttribute(_e), t.style.removeProperty(Pv));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(_e, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Pv) !== i && r.style.setProperty(Pv, i);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var z = "ui-temporal-input", Yv = "ui-calendar", Xv = `.${z}, .${Yv}`, Zv = "ui-temporal-input__value-input", Qv = "ui-temporal-input__end-value-input", $v = "data-ui-temporal-range", ey = "data-ui-temporal-end", ty = "data-ui-temporal-mode", ny = "data-ui-temporal-format", ry = "data-ui-temporal-default-format", iy = "data-ui-temporal-min", ay = "data-ui-temporal-max", oy = "data-ui-temporal-step", sy = "data-ui-temporal-step-unit", cy = "data-ui-temporal-marked-days", ly = "data-ui-temporal-marked-only", uy = "data-ui-temporal-page-culture", dy = "data-ui-temporal-months", fy = "data-ui-temporal-months-genitive", py = "data-ui-temporal-months-short", my = "data-ui-temporal-daynames", hy = "data-ui-temporal-weekdays", gy = "data-ui-temporal-first-day", _y = "data-ui-temporal-am", vy = "data-ui-temporal-pm", yy = /* @__PURE__ */ new Set([
	ny,
	ry,
	iy,
	ay,
	dy,
	_y,
	vy,
	cy,
	ly
]), by = 2e3;
function xy(e) {
	let t = e.getAttribute(ty);
	return t === "time" || t === "date-time" ? t : "date";
}
function Sy(e) {
	let t = e.getAttribute(ny);
	return t === null || t.trim().length === 0 ? e.getAttribute(ry) ?? "" : t;
}
function Cy(e) {
	let t = e.getAttribute(sy), n = Math.max(1, Math.trunc(Number(e.getAttribute(oy))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function wy(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Ty(e) {
	return {
		monthNames: Ey(e, dy),
		monthGenitiveNames: Ey(e, fy),
		abbreviatedMonthNames: Ey(e, py),
		dayNames: Ey(e, my),
		abbreviatedDayNames: Ey(e, hy),
		amDesignator: e.getAttribute(_y) ?? "AM",
		pmDesignator: e.getAttribute(vy) ?? "PM"
	};
}
function Ey(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Dy(e, t) {
	e.hasAttribute(uy) && (jy(e, fy, t.monthGenitiveNames.join("|")), jy(e, py, t.abbreviatedMonthNames.join("|")), jy(e, my, t.dayNames.join("|")), jy(e, hy, t.abbreviatedDayNames.join("|")), jy(e, dy, t.monthNames.join("|")), jy(e, _y, t.amDesignator), jy(e, vy, t.pmDesignator), jy(e, ry, Ay(xy(e), Cy(e), t)));
}
function Oy(e) {
	for (let t = 0; t < e.length;) {
		let n = Si(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function ky(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function Ay(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : pi(n, r);
}
function jy(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function My(e) {
	return e.hasAttribute($v);
}
function Ny(e) {
	return e !== null && e.hasAttribute(ey);
}
function Py(e) {
	return B(e, !1);
}
function B(e, t) {
	let n = Fy(e, t);
	return n === null ? null : qy(n.value, xy(e));
}
function Fy(e, t) {
	return e.querySelector(`.${t ? Qv : Zv}`);
}
function Iy(e, t) {
	return qy(e.getAttribute(t) ?? "", xy(e));
}
function Ly(e) {
	let t = Iy(e, iy), n = Iy(e, ay), r = (e.getAttribute(cy) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : Jy(t, "date"),
		max: n === null ? null : Jy(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(ly)
	};
}
function Ry(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function zy(e, t, n) {
	let r = Fy(e, n);
	if (r === null) return;
	let i = t === null ? "" : Jy(t, xy(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function By(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Mi(n, Sy(e), Ty(e));
	return r === null ? n : Jy(Di(r), xy(e));
}
function Vy(e) {
	if (!My(e)) return;
	let t = B(e, !1), n = B(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (zy(e, n, !1), zy(e, t, !0));
}
function Hy(e) {
	let t = Iy(e, iy), n = Iy(e, ay);
	if (t === null && n === null) return null;
	for (let r of My(e) ? [!1, !0] : [!1]) {
		let i = B(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: _i(t, Sy(e), Ty(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: _i(n, Sy(e), Ty(e)) }
		};
	}
	return null;
}
function Uy(e) {
	return Gy(e, Wy(e, /* @__PURE__ */ new Date()));
}
function Wy(e, t) {
	let n = Iy(e, iy), r = Iy(e, ay);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Gy(e, t) {
	let n = Cy(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Ky = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function qy(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Ky.exec(n);
		return e === null ? null : new Date(by, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ei(n);
	return r === null ? null : Di(r);
}
function Jy(e, t) {
	let n = `${Yy(e.getHours())}:${Yy(e.getMinutes())}:${Yy(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Yy(e.getMonth() + 1)}-${Yy(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Yy(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Xy(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = $y(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < eb(e.start).getTime() ? {
		start: $y(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: $y(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Zy(e, t, n) {
	if (t === null || n === null) return !1;
	let r = eb(e).getTime();
	return r > eb(t).getTime() && r < eb(n).getTime();
}
function Qy(e, t, n) {
	return !n && Zy(e, t.start, t.end);
}
function $y(e, t) {
	return Oi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function eb(e) {
	return Oi(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var tb = "ui-temporal-input__day", nb = "ui-temporal-input__month", rb = "data-ui-temporal-nav", ib = "data-ui-temporal-day", ab = 366;
function ob(e) {
	let t = Py(e);
	return {
		view: Db(t ?? Wy(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function sb(e, t, n, r) {
	let i = V("div", `${z}__calendar`), a = V("div", `${z}__calendar-header`), o = Ly(e), s = Eb("previous", "‹", w.text("ui.picker.previous"));
	s.disabled = cb(o, t, -1) === null, a.append(s);
	let c = Eb("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${z}__calendar-label`), a.append(c);
	let l = Eb("next", "›", w.text("ui.picker.next"));
	return l.disabled = cb(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? fb(e, t, n, r, o) : pb(t, n, o)), i;
}
function cb(e, t, n) {
	let r = t.pane === "months", i = Ab(t.view, n * (r ? 12 : 1));
	return ub(e, lb(i, r ? 4 : 7)) ? db(e, i) : null;
}
function lb(e, t) {
	return Jy(e, "date").slice(0, t);
}
function ub(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function db(e, t) {
	let n = lb(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : qy(r, "date");
	return i === null ? t : Db(i);
}
function fb(e, t, n, r, i) {
	let a = Cb(e), o = V("div", `${z}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = V("span", `${z}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = V("div", `${z}__days`), c = eb(/* @__PURE__ */ new Date()), l = My(e), u = l ? B(e, !1) : r, d = l ? B(e, !0) : null, f = Ob(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = kb(f, e), r = Jy(n, "date"), a = V("button", tb);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(ib, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${tb}--outside`), jb(n, c) && (a.classList.add(`${tb}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${tb}--marked`);
		let o = u !== null && jb(n, u), p = d !== null && jb(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${tb}--selected`), l && (o || p) && a.setAttribute("aria-description", w.text(o ? "ui.picker.start" : "ui.picker.end")), Qy(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${tb}--within`), Ry(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = V("div", `${z}__calendar-pane`);
	return p.append(o, s), p;
}
function pb(e, t, n) {
	let r = V("div", `${z}__months`);
	for (let i = 0; i < 12; i++) {
		let a = V("button", nb);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(rb, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${nb}--selected`), a.setAttribute("aria-current", "true")), ub(n, lb(Oi(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function mb(e) {
	let t = V("div", `${z}__period-caption`);
	return t.textContent = w.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function hb(e, t, n) {
	let r = Ly(e);
	if (n.startsWith("month:")) {
		let e = Oi(t.view.getFullYear(), Number(n.slice(6)), 1);
		return ub(r, lb(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = cb(r, t, -1) ?? t.view, !0;
		case "next": return t.view = cb(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function gb(e, t, n) {
	if (My(e)) {
		_b(e, t, n);
		return;
	}
	let r = vb(n, Py(e) ?? Uy(e));
	t.focusedDay = r, t.view = Db(r), zy(e, r, !1);
}
function _b(e, t, n) {
	let r = Xy({
		start: B(e, !1),
		end: B(e, !0)
	}, t.activeEnd, vb(n, Uy(e)));
	t.focusedDay = r.end ?? r.start, t.view = Db(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, zy(e, r.end, !0), zy(e, r.start, !1);
}
function vb(e, t) {
	return Oi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function yb(e, t, n) {
	let r = xb(n), i = Sb(t, n, Cb(e));
	if (i === null) return null;
	let a = Ly(e);
	if (r === 0) return bb(a, i);
	let o = i;
	for (let e = 0; e < ab; e++) {
		if (Ry(a, Jy(o, "date"))) return o;
		o = kb(o, r);
	}
	return t;
}
function bb(e, t) {
	let n = Jy(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : qy(r, "date");
	return i === null ? t : vb(i, t);
}
function xb(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Sb(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return kb(e, -1);
		case "ArrowRight": return kb(e, 1);
		case "ArrowUp": return kb(e, -7);
		case "ArrowDown": return kb(e, 7);
		case "PageUp": return Ab(e, -1);
		case "PageDown": return Ab(e, 1);
		case "Home": return kb(e, -r);
		case "End": return kb(e, 6 - r);
		default: return null;
	}
}
function Cb(e) {
	let t = Number(e.getAttribute(gy));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function wb(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${tb}`)];
	if (i.length === 0) return;
	let a = Jy(eb(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (O(i, o), r && M(o));
}
function Tb(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? B(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${tb}`)) {
		let e = qy(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${tb}--preview`, e !== null && n !== null && r !== null && Zy(e, n, kb(r, 1)));
	}
}
function Eb(e, t, n) {
	let r = V("button", `${z}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(rb, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function V(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Db(e) {
	return Oi(e.getFullYear(), e.getMonth(), 1);
}
function Ob(e, t) {
	let n = Db(e);
	return kb(n, -((n.getDay() - t + 7) % 7));
}
function kb(e, t) {
	return Oi(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Ab(e, t) {
	let n = Oi(e.getFullYear(), e.getMonth() + t, 1), r = Oi(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Oi(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function jb(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Mb = "ui-temporal-input__field", Nb = "ui-temporal-input__popup", Pb = "ui-temporal-input--open", Fb = "ui-calendar__body", H = "ui-temporal-input__time-cell", Ib = "ui-temporal-input__time-column", Lb = 140, Rb = "data-ui-temporal-toggle", zb = "data-ui-temporal-unit", Bb = "data-ui-temporal-cell", Vb = "data-ui-temporal-centred", Hb = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new ru({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(Pb), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(Pb);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(Xv)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = ei(e.components, Xv), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && Ub(e) && this.states.set(e, ob(e)), this.isShowing(e) && this.renderSurface(e);
		}), P(this.root, Xv, { attributeFilter: [...yy] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), P(this.root, Xv, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), w.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) Ub(e) && Wb(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(Xv)], t = w.temporal;
		if (t !== null && w.language !== this.drawnLanguage) {
			this.drawnLanguage = w.language;
			for (let n of e) Dy(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || Ub(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${Fb}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && Wb(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ai(Sy(t), ax()), n = xi(Sy(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${Mb}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = Fy(t, Ny(r))?.value ?? "", a = qy(i, xy(t));
				if (a !== null) {
					r.value = _i(a, Sy(t), Ty(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Mb)) return;
		let t = e.target.closest(`.${z}`), n = t === null ? null : Fy(t, Ny(e.target));
		if (t === null || n === null) return;
		let r = By(t, e.target.value), i = qy(r, xy(t)), a = i === null ? r : Jy(i, xy(t));
		if (Gb(t, a)) {
			let n = B(t, Ny(e.target));
			e.target.value = n === null ? "" : _i(n, Sy(t), Ty(t));
			return;
		}
		Ny(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Vy(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Mb)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && My(t) && (this.getState(t).activeEnd = Ny(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !My(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${ib}]`) : null, r = this.getState(t), i = n === null ? null : qy(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Tb(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${ib}], .${H}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(H) ? cx(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = Wb(e), r = qy(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, O([...n.querySelectorAll(`.${tb}`)], t), Ss(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Mb)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Rb}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${z}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${rb}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${ib}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${Bb}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${zb}]`)?.getAttribute(zb);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Bb)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (hb(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, Uy(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), My(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = qy(t, "date");
		if (n === null || D(e) || T(e) || !Ry(Ly(e), t)) return;
		let r = this.getState(e);
		Ub(e) && My(e) && !r.choosingEnd && B(e, !1) !== null && B(e, !0) !== null && (r.activeEnd = "start");
		let i = Fy(e, !1), a = `${i?.value ?? ""}|${Fy(e, !0)?.value ?? ""}`;
		gb(e, r, n), Ub(e) && `${i?.value ?? ""}|${Fy(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = My(e) && this.getState(e).activeEnd === "end", i = new Date(B(e, r) ?? Uy(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		zy(e, t, n), Vy(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Mb)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${z}`), Ny(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(H)) {
			lx(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = qy(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Jy(n, "date"));
			return;
		}
		let r = yb(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Db(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ib}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Lb)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ib}`), n = t?.getAttribute(zb) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Sf(this.wheelTurns.get(n) ?? 0, xf(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${H}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${H}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${H}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(Bb)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Vb));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(zb), i = ex(e);
		if (!(r === null || i === null || i.classList.contains(`${H}--selected`))) {
			if (i.matches(":disabled")) {
				Qb(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Bb)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${Nb}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = My(e) ? t ?? (B(e, !1) === null ? "start" : B(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = B(e, r.activeEnd === "end") ?? Py(e);
		r.pane = "days", r.view = Db(i ?? Wy(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${Rb}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => sx(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = ob(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = Wb(e);
		if (n === null) return;
		let r = Ub(e), i = xy(e), a = this.getState(e), o = Ty(e), s = My(e), c = B(e, s && a.activeEnd === "end"), l = tx(n), u = nx(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(mb(a)), r) n.append(sb(e, a, o, c));
		else {
			let t = V("div", `${z}__panes`);
			t.append(sb(e, a, o, c)), i === "date-time" && t.append(Kb(e, c)), n.append(t, ix(i));
		}
		let f = u === null ? null : n.querySelector(`[${rb}="${b(u)}"]:not(:disabled)`);
		wb(n, a, c, t || d && l === null && f === null), Tb(e, a), r || (Zb(n), Qb(n), rx(n, l)), f !== null && M(f), r || this.popups.reposition(e);
	}
};
function Ub(e) {
	return e.classList.contains(Yv);
}
function Wb(e) {
	return e.querySelector(`.${Ub(e) ? Fb : Nb}`);
}
function Gb(e, t) {
	let n = Ly(e), r = n.markedOnly ? qy(t, xy(e)) : null;
	return r !== null && !n.marked.has(Jy(r, "date"));
}
function Kb(e, t) {
	let n = Cy(e), r = V("div", `${z}__time`), i = V("div", `${z}__time-columns`);
	for (let r of qb(n)) i.append(Xb(e, r, Jb(n, r), t));
	return r.append(i), r;
}
function qb(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Jb(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Yb(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Xb(e, t, n, r) {
	let i = V("div", Ib);
	i.setAttribute(zb, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", w.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = Yb(r, t), s = t === "hour" && Oy(Sy(e)), c = Ty(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = V("button", H);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? ky(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(Bb, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${H}--selected`), px(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Zb(e) {
	let t = e.querySelector(`.${z}__calendar`), n = e.querySelector(`.${z}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Qb(e) {
	for (let t of e.querySelectorAll(`.${Ib}`)) {
		let e = t.querySelector(`.${H}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, $b(t, e), t.setAttribute(Vb, String(t.scrollTop));
	}
}
function $b(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function ex(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${H}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function tx(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(H) ? null : t.closest(`.${Ib}`)?.getAttribute(zb) ?? null;
}
function nx(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(rb) : null;
}
function rx(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${Ib}[${zb}="${t}"]`)?.querySelector(`.${H}--selected`) ?? null;
	n !== null && M(n);
}
function ix(e) {
	let t = V("div", `${z}__popup-footer`);
	return t.append(Eb("now", w.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Eb("clear", w.text("ui.picker.clear"))), t.append(Eb("done", w.text("ui.picker.done"))), t;
}
function ax() {
	return {
		year: ox("ui.picker.letter.year", ki.year),
		month: ox("ui.picker.letter.month", ki.month),
		day: ox("ui.picker.letter.day", ki.day),
		hour: ox("ui.picker.letter.hour", ki.hour),
		minute: ox("ui.picker.letter.minute", ki.minute),
		second: ox("ui.picker.letter.second", ki.second)
	};
}
function ox(e, t) {
	let n = w.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function sx(e, t) {
	for (let n of e.querySelectorAll(`.${Mb}`)) if (Ny(n) === t) return n;
	return e.querySelector(`.${Mb}`);
}
function cx(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(H) && Ss(e);
}
function lx(e) {
	let t = e.target, n = t.closest(`.${Ib}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? dx(n, e.key === "ArrowRight" ? 1 : -1) : ux(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), fx(r));
}
function ux(e, t, n) {
	return co({
		key: n,
		items: [...e.querySelectorAll(`.${H}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function dx(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Ib}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${H}--selected`) ?? r.querySelector(`.${H}:not(:disabled)`);
}
function fx(e) {
	let t = e.closest(`.${Ib}`);
	t !== null && $b(t, e);
}
function px(e, t, n, r) {
	let i = Iy(e, iy), a = Iy(e, ay);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var mx = "[data-ui-theme-switcher]", hx = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(mx) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: br.SetTheme,
				mode: gx() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function gx() {
	let e = document.documentElement.getAttribute(jn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var _x = `[${Pn}]`, vx = "ui-language-switcher__trigger", yx = "ui-language-switcher__label-text", bx = "ui-language-switcher__label-text--current", xx = "ui-language-switcher__label-text--page", Sx = "ui-language-switcher__menu", Cx = "ui-language-switcher__choice", wx = "ui-language-switcher--open", Tx = "ui.language.switch", Ex = "ui.language.current", Dx = class {
	options;
	root;
	menus = new ru({
		show: ({ owner: e }) => e.classList.add(wx),
		hide: ({ owner: e }) => e.classList.remove(wx),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), w.onChange(() => this.showLanguage(w.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cx}`), n = e.target.closest(_x);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Fn));
			return;
		}
		let r = e.target.closest(`.${vx}`);
		if (r === null || T(r)) return;
		e.preventDefault();
		let i = Ox(n);
		if (i.length === 2) {
			let e = w.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(_x);
		if (t === null) return;
		let n = Ox(t), r = e.target.closest(`.${vx}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !lo(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = co({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Cx}`);
		if (t === null || t === document.activeElement || T(t)) return;
		let n = t.closest(_x);
		n !== null && this.menus.isOpen(n) && Ss(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${Sx}`);
		if (r === null) return;
		let i = Ox(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Fs(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: br.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(_x)) {
			let n = t.querySelector(`:scope > .${vx}`);
			if (n === null) continue;
			let r = Ox(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${yx}`)) {
				let n = t.getAttribute(Fn) === e;
				t.classList.toggle(bx, n), t.classList.contains(xx) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				w.write(n, "aria-label", Tx, {
					language: kx(r, e),
					code: Ax(e),
					other: kx(r, t),
					otherCode: Ax(t)
				});
			} else w.write(n, "aria-label", Ex, {
				language: kx(r, e),
				code: Ax(e)
			});
		}
	}
};
function Ox(e) {
	return [...e.querySelectorAll(`:scope > .${Sx} > .${Cx}`)];
}
function kx(e, t) {
	let n = e.find((e) => e.getAttribute(Fn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return Ax(t);
	}
}
function Ax(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var jx = `${De}__button`, Mx = `${De}__more`, Nx = `.${v}:not(${Ut})`, Px = "ui-text__icon", Fx = `.ui-button__content .${Px}`, Ix = ".ui-button__content .ui-text__title", Lx = /* @__PURE__ */ new WeakMap();
function Rx(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Nx)) zx(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Wt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function zx(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function Bx(e, t) {
	let n = t.entries.map((e) => Vx(e, t));
	return t.more && t.openMore !== void 0 && n.push(Ux(t.openMore)), e.replaceChildren(...n), n;
}
function Vx(e, t) {
	let n = Wx(jx), r = Kx(e), i = Hx(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), T(e) && (n.classList.add($n), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), Lx.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function Hx(e) {
	let t = e.querySelector(Fx);
	if (t === null || !t.className.split(" ").some(Xd)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(Px), n.setAttribute(Kd, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(qd);
	return r.length > 0 && n.style.setProperty(qd, r), n;
}
function Ux(e) {
	let t = Wx(`${jx} ${Mx}`);
	return t.setAttribute("aria-haspopup", "menu"), w.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function Wx(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${ur}`, t.tabIndex = -1, t;
}
function Gx(e) {
	return Lx.get(e) ?? null;
}
function Kx(e) {
	return e.querySelector(Ix)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var qx = 500, Jx = 10, Yx = /* @__PURE__ */ new WeakSet();
function Xx(e) {
	return Yx.has(e);
}
var Zx = class {
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
			timer: setTimeout(() => this.fire(), qx)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > Jx && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > Jx && this.cancel();
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
		Yx.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!Yx.has(e)) {
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
}, Qx = "tabs:rename", $x = "tabs:pin", eS = "tabs:unpin", tS = "tabs:close", nS = "tabs:delete";
function rS(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function iS(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[Qx, e.rename && t.renamable],
		[$x, e.pin && !t.pinned],
		[eS, e.pin && t.pinned],
		[tS, e.close && !e.delete && n],
		[nS, e.delete && n]
	]);
}
function aS(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var oS = "data-ui-context-menu-owner", sS = be, cS = "ui-context-menu--open", lS = `.${v}:not(${Ut})`, uS = `${De}--strip`, dS = `.${De}:not(.${uS}) > .${Mx}`, fS = "input, textarea, select, [contenteditable=''], [contenteditable='true']", pS = "ui-context-menu-opening", mS = Gt, hS = class {
	root;
	closed = null;
	menus = new ru({
		show: ({ popup: e }) => e.classList.add(cS),
		hide: ({ popup: e }, t) => {
			e.classList.remove(cS), this.closed = e, t === "outside" && OS();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new Zx({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${oS}]`) !== null && e.closest(fS) === null
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
		let n = gS(t);
		n !== null && (e.preventDefault(), this.open(n.owner, n.menu, e.clientX, e.clientY, xS(e) ? t : null, t.closest(dS)));
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${uS}`)?.remove(), SS(t), i !== null && CS(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && TS(t), this.closed !== null && (Ic(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? vs(), s = {
			placement: "bottom-start",
			surface: a?.closest(".ui-action-bar") ?? void 0
		}, c = a === null ? {} : {
			anchor: a,
			placement: s
		};
		this.menus.open({
			owner: e,
			popup: t,
			...c,
			returnFocus: () => (o === null ? null : Is(o)) ?? Is(e)
		}) && (a === null && El(t, n, r), DS(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(mS) !== null || this.menus.close();
	}
};
function gS(e) {
	let t = e.closest(`[${pe}]`);
	for (let n = e.closest(`[${oS}]`); n !== null; n = n.parentElement?.closest(`[${oS}]`) ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = vS(n, e);
		if (r.length === 0 || T(n)) continue;
		if (AS(n)) return null;
		let i = r.find((t) => yS(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var _S = `[${oS}]`;
function vS(e, t) {
	let n = t.closest(`[${xe}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? kS(e, r) : null, kS(e, "")].filter((e) => e !== null);
}
function yS(e, t, n) {
	let r = new CustomEvent(pS, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function bS(e, t) {
	let n = e.closest(`[${oS}]`), r = e.closest(`[${pe}]`);
	return n === null || T(n) || AS(n) || r !== null && n.contains(r) ? null : vS(n, e).find((n) => yS(n, e, t)) ?? null;
}
function xS(e) {
	let t = e.pointerType;
	return Xx(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : bs();
}
function SS(e) {
	for (let t of e.querySelectorAll(`[${Te}]`)) t.removeAttribute(Te);
}
function CS(e, t, n) {
	let r = n.closest(`[${Se}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !vS(e, r).includes(t)) return;
	let { entries: i } = Rx(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${De} ${uS}`, a.setAttribute("role", "group"), Bx(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: wS
	}), t.insertBefore(a, t.firstElementChild);
}
function wS(e) {
	T(e) || e.click();
}
function TS(e) {
	let { entries: t } = Rx(e), n = e.querySelector(`.${zt}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) ES(e);
	let r = I(n, `.${v}`, `.${zt}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && zx(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Ut)) ? ES(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Rt);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	aS(a).forEach((e, t) => {
		a[t] === "rule" && !e && ES(i[t]);
	});
}
function ES(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Te, "");
}
function DS(e) {
	let t = e.querySelector(`.${zt}`);
	t !== null && Fs(e, I(t, lS, `.${zt}`));
}
function OS() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${ss}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function kS(e, t) {
	for (let n of e.querySelectorAll(`[${sS}]`)) if ((n.getAttribute(sS) ?? "") === t && n.closest(`[${oS}]`) === e) return n;
	return null;
}
function AS(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${g}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function jS(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function MS(e) {
	return getComputedStyle(e).display !== "none";
}
function NS(e) {
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
				if (e.overflowX !== "visible" && IS(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && IS(n, a, a + t.clientHeight, !1), LS(n)) return !0;
			}
			r = e.position;
		}
	}
	return IS(n, 0, window.innerWidth, !0), IS(n, 0, window.innerHeight, !1), LS(n);
}
function PS(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !jS(n, !1)) && (FS(e.overflowX) || FS(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function FS(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function IS(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function LS(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var RS = `[${Se}]`, zS = `[${Ml}]:not([hidden]), dialog[open]`, BS = `.${De}`, VS = `${De}--out`, HS = 6, US = "--ui-action-bar-gap", WS = 400, GS = /* @__PURE__ */ new WeakMap(), KS = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Ee,
	...Xn
], qS = class {
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
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0);
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${BS}, [data-ui-context-menu]`) !== null) return;
		let r = JS(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : ZS(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? QS(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(BS) === null && xS(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(BS);
		if (n !== null) {
			this.isHostedBar(n) && O(aC(n), t);
			return;
		}
		ys() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(YS(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(BS) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(k) && this.choose(YS(t));
			return;
		}
		let n = t.closest(BS);
		if (n !== null && t.classList.contains(jx)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(zS);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(k)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(k) && this.choose(YS(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && lC(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Is(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = aC(t), i = co({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : ZS(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = PS(e);
		if (t === void 0 || n === null || !jS(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + eC(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, tl(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		bS(e, !0) === null && this.hide(e, t);
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
				this.chosen = QS(e), this.sync();
			}
			for (let e of this.shown.values()) tl(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = bS(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = De, n.setAttribute("role", "toolbar"), w.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ve, ""), n.setAttribute(he, ""), !tC(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, iC(e)), Yc(e, n, {
			placement: $S(e),
			gap: eC(e),
			boundary: PS(e) ?? void 0
		}), n.classList.toggle(VS, NS(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: KS
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		}), GS.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : Gx(r);
		if (!tC(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = aC(t.bar), o = a.find((e) => Gx(e) === i) ?? a.find(fo) ?? null;
		o !== null && (O(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || sC(t)) return;
		if (this.menuHost = e, cC(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		nC(n.bar, !0);
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
		nC(t.bar, !1);
		let n = document.activeElement;
		!ys() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && rC(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), nl(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(VS, NS(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : aC(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function JS(e) {
	let t = e.closest(RS);
	if (t !== null) return t;
	let n = e.closest(`[${g}]`), r = e.closest(y);
	return n === null || r !== null && !r.contains(n) ? null : XS(n)[0] ?? null;
}
function YS(e) {
	if (e.matches(k)) for (let t of e.querySelectorAll(`[${Oe}]`)) {
		if (t.closest(k) !== e) continue;
		let n = XS(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(RS);
}
function XS(e) {
	let t = [...e.querySelectorAll(RS)];
	return e.matches(RS) ? [e, ...t] : t;
}
function ZS(e) {
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
		index: XS(n).indexOf(e)
	};
}
function QS(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return XS(t)[e.index] ?? null;
	return null;
}
function $S(e) {
	let t = e.getAttribute(Se);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function eC(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(US));
	return Number.isFinite(t) ? t : HS;
}
function tC(e, t, n, r) {
	let { entries: i, more: a } = Rx(t);
	if (i.length === 0 && !a) return !1;
	let o = Bx(e, {
		entries: i,
		more: a,
		role: "button",
		press: oC,
		openMore: n
	});
	return O(o, o.find((e) => !T(e)) ?? o[0] ?? null), nC(e, r), !0;
}
function nC(e, t) {
	rC(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function rC(e) {
	return aC(e).find((e) => Gx(e) === null) ?? null;
}
function iC(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function aC(e) {
	return [...e.querySelectorAll(`:scope > .${jx}`)];
}
function oC(e, t) {
	if (T(t) || sC(t)) return;
	let n = bS(t, !1);
	n === null || !n.contains(e) || T(e) || !zx(e, n) || e.click();
}
function sC(e) {
	let t = e.closest(BS), n = t === null ? void 0 : GS.get(t);
	return n !== void 0 && bs() && Date.now() - n < WS;
}
function cC(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function lC(e) {
	return e.matches(ss) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/responsive-tier.ts
var uC = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], dC = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
}, fC = `(min-width: ${dC.md}px)`;
function pC(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${dC[t]}px)`)) return t;
	return "base";
}
function mC(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function U(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function hC(e, t) {
	let n;
	for (let r of uC) {
		let i = U(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var gC = "ne.ui", _C = "boot", vC = /* @__PURE__ */ new Set(), yC = class {
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
		let r = this.resolveKey(e, _C);
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
		let n = e.getAttribute(Ie);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return vC.has(n) || (vC.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${gC}:${n}:${t}`;
	}
}, bC = "ui-menu--nested", xC = "ui-menu__submenu", SC = Ot, CC = At, wC = "data-ui-menu-flyout", TC = `[${wC}], .ui-context-menu, .${ir}`, EC = "data-ui-menu-unfolded", DC = kt, OC = "menu-open-group", kC = Be("click"), AC = class {
	root;
	store = new yC();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new ru({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(CC, ""), t.setAttribute(wC, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(CC), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(wC);
			}, N.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${zt}`)), P(this.root, `.${zt}`, {
			childList: !0,
			attributeFilter: [Dt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${SC}]`)) jC(e);
		P(this.root, `[${SC}]`, {
			childList: !0,
			attributeFilter: [CC]
		}, (e) => {
			for (let t of e) jC(t);
		}), typeof matchMedia == "function" && matchMedia(fC).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = FC(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), MC(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${SC}]`)) jC(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Vt}`), e);
		if (t !== null && !t.hasAttribute(DC)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(bC) ? null : this.store.read(e, OC), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${v}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${zt}`);
		a !== null && (FC(a) || i.hasAttribute(DC) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(bC);
		if (e.setAttribute(EC, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(CC);
			return;
		}
		if (t.hasAttribute(CC)) {
			t.removeAttribute(CC), n || this.store.write(e, OC, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, OC, t.getAttribute(g));
	}
	openInline(e) {
		e.setAttribute(CC, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${SC}][${CC}]`)) t.hasAttribute(DC) || t.removeAttribute(CC);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		MC(e), this.closeGroups(e);
		let a = n.closest(TC) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${NC(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${zt}`);
		o !== null && !ys() && Fs(o, I(o, `.${v}:not(${Ut})`, `.${zt}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${SC}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Wt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${SC}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${xC}`);
	}
};
function jC(e) {
	let t = e.querySelector(`:scope > .${v}`), n = e.closest(`.${zt}`);
	t !== null && (t.setAttribute(kC, ""), t.setAttribute(Ve, ""), t.setAttribute("aria-expanded", e.hasAttribute(CC) ? "true" : "false"), e.hasAttribute(DC) || n !== null && FC(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function MC(e) {
	for (let t of e.querySelectorAll(`[${wC}]`)) t.removeAttribute(wC);
}
function NC(e) {
	return PC(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function PC(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(fC).matches;
}
function FC(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var IC = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, LC = "\\", RC = "`", zC = "!", BC = "{", VC = "}", HC = "ui-text__fold", UC = "ui-text__fold-toggle", WC = "ui-text__fold-content", GC = 8;
function KC(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return iw(new pw(e), 0, e.length, IC.None, null, t, n), aw(t, n, IC.None, null), t;
}
function qC(e) {
	return KC(e).map((e) => QC(e) ? `${e.fold} ${qC(e.text)}` : e.text).join("");
}
function JC(e) {
	let t = "";
	for (let n of e) t += gw(n) ? LC + n : n;
	return t;
}
function YC(e, t, n = {}) {
	let r = KC(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && XC(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren($C(r, n));
}
function XC(e) {
	return e.styles === IC.None && e.url === null && !ZC(e) && !QC(e);
}
function ZC(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function QC(e) {
	return e.fold !== null && e.fold !== void 0;
}
function $C(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(ew(r, t));
	return n;
}
function ew(e, t) {
	if (ZC(e)) return nw(e.icon);
	let n = QC(e) ? tw(e, t) : document.createTextNode(e.text);
	if ((e.styles & IC.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & IC.Strikethrough) !== 0 && (n = rw("s", n)), (e.styles & IC.Underline) !== 0 && (n = rw("u", n)), (e.styles & IC.Italic) !== 0 && (n = rw("em", n)), (e.styles & IC.Bold) !== 0 && (n = rw("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", jd(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function tw(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${HC} ${HC}--static` : HC, r.className = UC, r.textContent = e.fold ?? "", i.className = WC, i.append($C(KC(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ve, ""), n.append(r, i), n);
}
function nw(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Jd(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function rw(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function iw(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === LC && c + 1 < n && gw(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = ow(e, c, n);
		if (l !== null) {
			aw(a, o, r, i), sw(s, c + 1, l, o), aw(a, o, r | IC.Code, i), c = l + 1;
			continue;
		}
		let u = uw(e, c, n);
		if (u !== null) {
			aw(a, o, r, i), iw(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), aw(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = cw(e, c, n);
		if (d !== null) {
			aw(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? dw(e, c, n) : null;
		if (f !== null) {
			aw(a, o, r, i), iw(e, f.labelStart, f.labelEnd, r, f.url, a, o), aw(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = fw(e, c, n);
		if (p !== null) {
			aw(a, o, r, i), a.push({
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
function aw(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function ow(e, t, n) {
	let r = e.text;
	if (r[t] !== RC) return null;
	let i = t + 1;
	if (i >= n || _w(r[i])) return null;
	let a = e.findClosingMarker(i, n, RC, 1);
	return a > i ? a : null;
}
function sw(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === LC && i + 1 < n && gw(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function cw(e, t, n) {
	let r = e.text;
	if (r[t] !== zC || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return lw(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function lw(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function uw(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = IC.Bold, s = 2;
	else if (i === "*") o = IC.Italic, s = 1;
	else if (i === "_" && a) o = IC.Underline, s = 2;
	else if (i === "~" && a) o = IC.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || _w(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function dw(e, t, n) {
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
function fw(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== BC || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > GC) return null;
	let c = { value: "" };
	return sw(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var pw = class {
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
		return this.closeBrackets ??= this.next("]", !0), mw(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), mw(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), mw(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return mw(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = hw(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !_w(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Od(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === LC && e[t - 1] === 0);
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
			if (this.text[r] === BC) n.push(r);
			else if (this.text[r] === VC && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || _w(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function mw(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function hw(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function gw(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === BC || e === VC || e === RC || e === LC;
}
function _w(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var vw = "ui-tooltip", yw = "ui-tooltip", bw = "ui-tooltip--visible", xw = "[aria-haspopup][aria-expanded=\"true\"]", Sw = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", Cw = "top", ww = 250, Tw = 200, Ew = 300, Dw = 7, Ow = null, kw = null, Aw = null, jw = null, Mw = null, Nw = 0, Pw = null, Fw = 0, Iw = 0, Lw = !1, Rw = /* @__PURE__ */ new Set();
function zw(e) {
	Rw.add(e);
}
function Bw(e = document) {
	if (Lw) return;
	Lw = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", Vw, !0), t.addEventListener("pointerout", Ww, !0), t.addEventListener("focusin", Kw, !0), t.addEventListener("focusout", qw, !0), t.addEventListener("keydown", Jw, !0), t.addEventListener("scroll", Uw, !0), t.addEventListener("pointerdown", Yw, !0), t.addEventListener("click", Xw, !0), window.addEventListener("blur", () => {
		jw = null, vT(!0);
	});
}
function Vw(e) {
	if (Hw(), Qw(e.target)) {
		window.clearTimeout(Fw);
		return;
	}
	let t = $w(e.target);
	t !== null && t !== kw && iT(t);
}
function Hw() {
	kw === null || kw.isConnected || (jw = null, vT(!0));
}
function Uw(e) {
	if (Hw(), kw === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(kw) || NS(kw) && (jw = null, vT(!0));
}
function Ww(e) {
	if (jw !== null || Mw !== null) return;
	let t = e.relatedTarget, n = kw ?? Pw?.target ?? null, r = n === null ? null : Gw(n);
	t instanceof Node && (r !== null && r.contains(t) || Qw(t)) || (Qw(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && vT(!1);
}
function Gw(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && eT(t) === e ? t : e;
}
function Kw(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = $w(e.target);
	t !== null && (jw = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, aT(t));
}
function qw(e) {
	$w(e.target) === kw && (jw = null, vT(!0));
}
function Jw(e) {
	e.key === "Escape" && kw !== null && (jw = null, vT(!0));
}
function Yw(e) {
	if (Qw(e.target)) return;
	let t = Zw(e.target);
	if (t !== null) {
		if (Mw === t) {
			vT(!0);
			return;
		}
		jw = null, vT(!0), aT(t), Mw = kw;
		return;
	}
	jw === null && vT(!0);
}
function Xw(e) {
	Zw(e.target) !== null && e.preventDefault();
}
function Zw(e) {
	let t = $w(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(Sw);
	return n === null || n.contains(t) ? t : null;
}
function Qw(e) {
	return Ow !== null && e instanceof Node && Ow.contains(e);
}
function $w(e) {
	if (!(e instanceof Element)) return null;
	let t = eT(e);
	for (let n of Rw) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && rT(r).length > 0) return r;
	}
	return t;
}
function eT(e) {
	let t = e.closest(`[${ke}], [${je}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function tT(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + nT(e) : rT(e);
}
function nT(e) {
	let t = "";
	for (let n of Rw) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function rT(e) {
	for (let t of Rw) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function iT(e, t) {
	if (jw === null && Mw === null) {
		if (window.clearTimeout(Fw), Pw !== null && Pw.target === e) {
			Pw.words = t;
			return;
		}
		if (window.clearTimeout(Nw), Pw = null, kw !== null) {
			vT(!0), aT(e, t);
			return;
		}
		if (Date.now() - Iw < Ew) {
			aT(e, t);
			return;
		}
		Pw = {
			target: e,
			words: t
		}, Nw = window.setTimeout(() => {
			let e = Pw;
			Pw = null, e !== null && aT(e.target, e.words);
		}, ww);
	}
}
function aT(e, t) {
	let n = (t ?? tT(e)).trim();
	if (n.length === 0 || !e.isConnected || oT(e) || NS(e)) return;
	window.clearTimeout(Nw), window.clearTimeout(Fw), Pw = null;
	let r = yT();
	YC(r, n, { staticFolds: !0 }), r.classList.add(bw), kw = e, cT(sT(e)), r.setAttribute("data-ui-tooltip-text", qC(n)), dT(r, e.getAttribute(Me)), Jc(e, r), Yc(e, r, {
		placement: _T(e),
		gap: Dw,
		arrow: !0
	});
}
function oT(e) {
	return e.matches(xw) || e.querySelector(xw) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function sT(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function cT(e) {
	Aw !== null && Aw !== e && lT();
	let t = uT(e);
	t.includes(yw) || e.setAttribute("aria-describedby", [...t, yw].join(" ")), Aw = e;
}
function lT() {
	if (Aw === null) return;
	let e = uT(Aw).filter((e) => e !== yw);
	e.length === 0 ? Aw.removeAttribute("aria-describedby") : Aw.setAttribute("aria-describedby", e.join(" ")), Aw = null;
}
function uT(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function dT(e, t) {
	t === null ? e.removeAttribute(Me) : e.setAttribute(Me, t);
}
function fT(e, t, n) {
	n?.delay === !0 && kw !== e ? iT(e, t) : aT(e, t);
}
function pT() {
	vT(!0);
}
var mT = {
	show: fT,
	hide: pT
};
function hT(e) {
	jw = e, aT(e);
}
function gT(e) {
	if (kw === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			jw = null, vT(!0);
			return;
		}
		aT(e);
	}
}
function _T(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of Rw) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Ae);
	return t !== null && Rc(t) ? t : Cw;
}
function vT(e) {
	window.clearTimeout(Nw), window.clearTimeout(Fw), Pw = null;
	let t = () => {
		kw !== null && (lT(), kw = null, Mw = null, Ow !== null && (Ow.classList.remove(bw), nl(Ow)), Iw = Date.now());
	};
	e ? t() : Fw = window.setTimeout(t, Tw);
}
function yT() {
	return Ow !== null && Ow.isConnected ? Ow : (Ow = document.createElement("div"), Ow.id = yw, Ow.className = vw, Ow.setAttribute("role", "tooltip"), Ow.setAttribute("aria-hidden", "true"), document.body.append(Ow), Ow);
}
//#endregion
//#region src/interactions/menu-engine.ts
var bT = "ui-orientation--horizontal", xT = `.${Ht} > .ui-menu__host > .ui-menu__item > .${v}`, ST = `${xT}, ${`.ui-menu[${Dt}] > .ui-menu__host > .ui-menu__item > .${v}`}`, CT = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", wT = "[role='menuitem'], [role='menuitemcheckbox']", TT = class {
	root;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), zw(ET), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(OT) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Nt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${zt}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && O(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && fo(e)) ?? t.find(fo) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${v}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			DT(e, t);
			return;
		}
		let r = this.ownItems(n), i = co({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(bT) || PC(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${zt}`);
		if (n === null) return;
		let r = this.ownItems(n), i = co({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(bT) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${v}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && O(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${v}`) : null;
		if (t === null || t === document.activeElement || !t.matches(wT) || t.matches(Ut) || !fo(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Ss(t);
	}
	ownItems(e) {
		return I(e, `.${v}:not(${Ut})`, `.${zt}`);
	}
}, ET = {
	anchor: (e) => e.closest(ST),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(CT), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(xT) && t.scrollWidth <= t.clientWidth ? null : JC(n);
	},
	placement: (e) => {
		let t = e.closest(`.${zt}`);
		return t === null ? null : NC(t);
	}
};
function DT(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(Ut) || !fo(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function OT(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function kT(e) {
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
		default: o = BT(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function AT(e, t, n = IT()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function jT(e, t = IT()) {
	let n = MT(e.code, t);
	if (!t) return [
		e.ctrl ? "Ctrl" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		e.meta ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	let r = e.ctrl && e.meta, i = e.meta || e.ctrl;
	return `${r ? "⌃" : ""}${e.alt ? "⌥" : ""}${e.shift ? "⇧" : ""}${i ? "⌘" : ""}${n}`;
}
function MT(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? PT[e] : void 0) ?? NT[e] ?? e;
}
var NT = {
	Comma: ",",
	Period: ".",
	Slash: "/",
	Backslash: "\\",
	Semicolon: ";",
	Quote: "'",
	BracketLeft: "[",
	BracketRight: "]",
	Minus: "-",
	Equal: "=",
	Backquote: "`",
	Escape: "Esc",
	ArrowUp: "Up",
	ArrowDown: "Down",
	ArrowLeft: "Left",
	ArrowRight: "Right"
}, PT = {
	Delete: "⌦",
	Backspace: "⌫",
	Enter: "↩",
	Escape: "⎋",
	Tab: "⇥",
	Home: "↖",
	End: "↘",
	PageUp: "⇞",
	PageDown: "⇟",
	ArrowUp: "↑",
	ArrowDown: "↓",
	ArrowLeft: "←",
	ArrowRight: "→"
}, FT = null;
function IT() {
	return FT === null && (FT = LT()), FT;
}
function LT() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var RT = { words(e) {
	let t = kT(e);
	return t === null ? null : jT(t);
} };
function zT(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function BT(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : VT[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : VT[t] ?? null;
}
var VT = {
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
}, HT = "shortcut:", UT = ":scope > .ui-menu-item__shortcut", WT = `[${be}]`, GT = `[${Kt}]`, KT = ".ui-text__title", qT = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), zw(rE), eE(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) $T(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Kt]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || YT(e))) return;
		let t = Rl(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !AT(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !fo(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), QT(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= AT(t, e);
		let r = n ? XT() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = gS(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(GT)].filter((t) => {
			let n = kT(t.getAttribute(Kt));
			return n !== null && AT(n, e) && !T(t) && zx(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), QT(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(GT)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = kT(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(WT) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(zT(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = kT(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = zT(e.shortcut);
		if (!this.claims.has(t)) {
			this.claims.set(t, e);
			return;
		}
		let n = this.claims.get(t);
		n !== null && s("shortcut is claimed twice and will fire nothing.", {
			shortcut: t,
			claims: [n, e]
		}), this.claims.set(t, null);
	}
};
function JT(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(HT) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function YT(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return ao(t) || t instanceof HTMLElement && t.isContentEditable;
}
function XT() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Ko(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Yo(I(t.root, So, k));
	return n === null ? t.root : ZT(n);
}
function ZT(e) {
	if (e.matches(_S)) return e;
	for (let t of e.querySelectorAll(_S)) if (t.closest(So) === e) return t;
	return e;
}
function QT(e) {
	ao(e.target) && e.target.dispatchEvent(new Event(nm, { bubbles: !0 }));
}
function $T(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && tE(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && eE(t);
}
function eE(e) {
	e instanceof HTMLElement && e.matches(GT) && tE(e);
	for (let t of e.querySelectorAll(GT)) tE(t);
}
function tE(e) {
	let t = e.querySelector(UT);
	if (t === null) return;
	let n = nE(e) ?? "";
	t.textContent !== n && (t.textContent = n);
}
function nE(e) {
	let t = e.getAttribute(Kt), n = kT(t);
	return n === null ? t?.trim() || null : jT(n);
}
var rE = {
	anchor: (e) => {
		let t = e.closest(GT);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(WT) !== null ? null : t;
	},
	words: (e) => {
		let t = nE(e), n = (e.getAttribute("aria-label") ?? e.querySelector(KT)?.textContent ?? "").trim();
		return t === null ? null : JC(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = nE(e);
		return t === null ? null : JC(`(${t})`);
	}
}, iE = 50, aE = 1, oE = 7;
function sE(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = mE(e, "data-ui-window-size") ?? 0;
	return {
		offset: mE(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : iE,
		total: mE(e, yt),
		moreAfter: e.getAttribute(xt) === "true"
	};
}
function cE(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function lE(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function uE(e, t) {
	switch (t) {
		case "first": return e.offset > 0 ? 0 : null;
		case "previous": return e.offset > 0 ? Math.max(0, (Math.ceil(e.offset / e.size) - 1) * e.size) : null;
		case "next": return e.moreAfter ? e.offset + e.count : null;
		case "last": {
			if (e.total === null) return e.moreAfter ? e.offset + e.count : null;
			let t = Math.max(0, Math.floor((e.total - 1) / e.size) * e.size);
			return e.offset < t ? t : null;
		}
		default: {
			let n = Number(t), r = lE(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === cE(e) ? null : (n - 1) * e.size;
		}
	}
}
function dE(e, t) {
	if (t <= oE) return pE(1, t);
	let n = Math.max(Math.min(e - aE, t - 2 - 2), 3), r = Math.min(Math.max(e + aE, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...pE(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function fE(e, t) {
	let n = dE(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function pE(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function mE(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/pager-engine.ts
var hE = ".ui-pager", gE = "ui-pager__button", _E = "ui-pager__number", vE = "ui-pager__pages", yE = "ui-pager__gap", bE = "ui-pager__range", xE = "ui-pager__size", SE = "ui-pager__size--open", CE = "ui-pager__size-trigger", wE = "ui-pager__size-label", TE = "ui-pager__sizes", EE = "ui-pager__size-choice", DE = [
	gE,
	_E,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], OE = "ui.pager.page", kE = "ui.pager.range", AE = "ui.pager.rows", jE = "ui.pager.size", ME = [
	vt,
	yt,
	xt,
	_t,
	gt
], NE = "page-size", PE = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new yC();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new ru({
		show: ({ owner: e }) => e.classList.add(SE),
		hide: ({ owner: e }) => e.classList.remove(SE),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), P(this.root, `${hE}, [${_}]`, {
			childList: !0,
			attributeFilter: ME,
			relevant: (e) => e.type === "attributes" || WE(e.target) || GE(e)
		}, (e) => this.syncFound(e)), w.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(hE)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(hE)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(y), n = t === null ? 0 : C(t);
		return n > 0 ? [...this.root.querySelectorAll(`${hE}[${Ye}="${b(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(Ye));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = HE(e);
			if (t !== null) return {
				component: e,
				host: t
			};
		}
		return null;
	}
	sync(e) {
		let t = this.targetOf(e), n = t?.host ?? null, r = n !== null && n.hasAttribute("data-ui-window-paged");
		if (e.hasAttribute("hidden") === r && e.toggleAttribute("hidden", !r), t === null || n === null || !r) return;
		this.restored.has(e) || (this.restored.add(e), this.restoreSize(e, t.component, n));
		let i = sE(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = e_(e), s = (e) => t_(e, "N0", o);
		this.drawNumbers(e, i, o), IE(e, i, s), LE(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${gE}[${Xe}]`)) Ga.setDisabled(t, uE(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		zE(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${vE}`);
		if (r === null) return;
		let i = cE(t), a = lE(t), o = a === null ? fE(i, t.moreAfter) : dE(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => FE(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(hE);
		if (t === null || T(e.target)) return;
		let n = e.target.closest(`.${EE}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(Ze)));
			return;
		}
		let r = e.target.closest(`.${CE}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${Xe}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = uE(sE(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), _o(e).top > 0 && vo(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(hE);
		if (t === null) return;
		let n = e.target.closest(`.${xE}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${gE}, .${CE}`), i = RE(t);
		if (r === null || !i.includes(r)) return;
		let a = co({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal",
			loop: !1
		});
		a !== null && (e.preventDefault(), O(i, a), a.focus());
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${CE}`) : null;
		if (n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) return e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0;
		if (!this.menus.isOpen(t) || !lo(e.key, "vertical")) return !1;
		let r = VE(t), i = e.target instanceof HTMLElement && r.includes(e.target) ? e.target : null, a = co({
			key: e.key,
			items: r,
			current: i,
			axis: "vertical"
		});
		return a !== null && (e.preventDefault(), a.focus()), !0;
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${EE}`) : null;
		if (t === null || t === document.activeElement || T(t)) return;
		let n = t.closest(`.${xE}`);
		n !== null && this.menus.isOpen(n) && Ss(t);
	}
	toggleSizes(e) {
		let t = e.closest(`.${xE}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${TE}`);
		if (r === null) return;
		let i = VE(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Fs(r, i, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, NE), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!BE(e, i)) {
			this.store.write(t, NE, null);
			return;
		}
		let a = sE(n);
		i !== a.size && (n.setAttribute(_t, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${xE}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = sE(r.host);
		t !== i.size && (this.store.write(r.component, NE, String(t)), r.host.setAttribute(_t, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !(e.target instanceof Element)) return;
		let t = Ko(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || T(t.root) || t.row !== null && qp(e.target, t.row) !== null) return;
		let n = HE(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = uE(sE(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = UE(e), i = Yo(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = UE(e);
		o.length > 0 && Zo(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function FE(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = yE, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = t_(e, "N0", n);
	return r.className = DE.join(" "), r.setAttribute("type", "button"), r.setAttribute(Xe, String(e)), r.textContent = i, w.write(r, "aria-label", OE, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function IE(e, t, n) {
	let r = e.querySelector(`:scope > .${bE}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? w.write(r, null, AE, {
		from: i,
		to: a
	}) : w.write(r, null, kE, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function LE(e, t, n) {
	let r = e.querySelector(`:scope > .${xE}`), i = r?.querySelector(`.${wE}`) ?? null;
	if (r !== null && i !== null) {
		w.write(i, null, jE, { size: n(t.size) });
		for (let e of VE(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function RE(e) {
	return [...e.querySelectorAll(`.${gE}, .${CE}`)];
}
function zE(e) {
	let t = RE(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	O(t, n ?? r.find(fo) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function BE(e, t) {
	let n = e.querySelector(`:scope > .${xE}`);
	return n !== null && VE(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function VE(e) {
	return [...e.querySelectorAll(`:scope > .${TE} > .${EE}`)];
}
function HE(e) {
	for (let t of e.querySelectorAll(`[${_}][${lt}="windowed"]`)) if (t.closest(y) === e) return t;
	return null;
}
function UE(e) {
	return I(e, So, k);
}
function WE(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function GE(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(hE) || t.querySelector(hE) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var KE = `.${zt}[${jt}]`, qE = ":scope > .ui-collapsible__bar", JE = ":scope > .ui-menu__host", YE = "ui-menu__item", XE = `:scope > .${v}`, ZE = ".ui-text__title", QE = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", $E = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), P(t, KE, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Dt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = eD(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(JE);
		if (n === null) return;
		let r = Pm(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: tD(n)
		}), e.setAttribute(Mt, ""), eh(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of nD(e)) {
			let e = rD(a);
			if (e === "header") {
				n !== null && aD(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			aD(a, o), r ||= o, i ||= o;
		}
		return n !== null && aD(n, r), i;
	}
	match(e, t) {
		let n = Im(iD(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(QE) : null;
		if (r === null) return n;
		if (n) return oD(r), e.removeAttribute(At), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(At, i), i;
	}
	clear(e, t) {
		oD(t), e.removeAttribute(Mt), nD(t).length > 0 && eh(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Dt);
		for (let e of t.querySelectorAll(`[${Ot}]:not([${kt}])`)) e.toggleAttribute(At, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...eD(e.target)?.querySelector(JE)?.querySelectorAll(`.ui-menu-item:not(${Ut})`) ?? []].find(fo);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function eD(e) {
	let t = e.closest(KE), n = t?.querySelector(qE) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function tD(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Ot}][${At}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function nD(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(YE));
}
function rD(e) {
	return e.querySelector(XE)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function iD(e) {
	return Fm(e.querySelector(XE)?.querySelector(ZE)?.textContent ?? "", e);
}
function aD(e, t) {
	e.toggleAttribute(Nt, !t);
}
function oD(e) {
	for (let t of e.querySelectorAll(`[${Nt}]`)) t.removeAttribute(Nt);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var sD = 120;
function cD(e) {
	return e.typing && e.tallest - e.height > sD;
}
function lD(e) {
	return ao(e) || e instanceof HTMLElement && e.isContentEditable;
}
var uD = class {
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
		let t = cD({
			height: e.height,
			tallest: this.tallest,
			typing: lD(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Ln, t);
	}
}, dD = "[data-ui-root]", fD = "a[href]", pD = "ui-collapsible", mD = "right-side", hD = "ui-side--left", gD = "ui-side--right", _D = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(fC).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pt}]`);
		if (t !== null) {
			let e = t.closest(dD), n = t.getAttribute(Pt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${qt}]`);
		if (n !== null && !e.defaultPrevented && vD(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(fD)?.closest(`[${Lt}]`), i = r?.parentElement ?? null;
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
		e.setAttribute(Ft, t), this.markToggles(e);
		let n = yD(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, ys(), performance.now() + N.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(ar, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Ms(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${dD}[${Ft}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Ft);
		if (e.removeAttribute(Ft), this.markToggles(e), t === null) return;
		let n = yD(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = e.querySelector(`[${Pt}="${b(t)}"]`);
			i !== null && n !== null && n.contains(r) ? Bs(i, n) : i !== null && M(i);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(Ft);
		for (let n of e.querySelectorAll(`[${Pt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Pt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(ar), t && e.removeAttribute("tabindex"));
	}
};
function vD(e) {
	let t = e.closest(`.${pD}`), n = t?.closest(`[${Lt}]`), r = n?.getAttribute(Lt), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(dD) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === mD ? gD : hD);
}
function yD(e, t) {
	return e.querySelector(`:scope > [${Lt}="${b(t)}"]`);
}
//#endregion
//#region src/interactions/skip-link-engine.ts
var bD = "[data-ui-root]", xD = "content", SD = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-skip-link]")?.closest(bD)?.querySelector(`:scope > [data-ui-region="${xD}"]`) ?? null;
		t !== null && (e.preventDefault(), CD(t));
	}
};
function CD(e) {
	e.hasAttribute("tabindex") || (e.setAttribute("tabindex", "-1"), e.addEventListener("blur", () => e.removeAttribute("tabindex"), { once: !0 })), e.focus();
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var wD = "ui-collapsible", TD = "ui-collapsible__content", ED = "ui-collapsible__bar", DD = "collapsed", OD = class {
	root;
	store = new yC();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${wD}`)), P(this.root, `.${wD}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, DD);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qt}]`), n = t?.closest(`.${wD}`) ?? null;
		if (t === null || n === null || vD(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Dt), i = n.querySelector(`:scope > .${TD}`);
		this.cancelFold(n);
		let a = AD(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, DD, r ? "true" : "false", r ? { attributes: { [Dt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Dt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${qt}], :scope > .${ED} > [${qt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Fc()) return;
		let i = MD(kD(e), n, AD(e, t), r);
		if (i === null) return;
		e.setAttribute(Jt, "");
		let a = {
			duration: N.normal,
			easing: N.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Jt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Jt);
			for (let e of t) e.cancel();
		}
	}
};
function kD(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function AD(e, t) {
	let n = kD(e), r = jD(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function jD(e) {
	return e === "width" ? "height" : "width";
}
function MD(e, t, n, r) {
	let i = jD(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function ND(e) {
	let t = [];
	for (let n of ID(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = ND(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = PD(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function PD(e) {
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
	if (n !== null) return FD({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return FD(r[3] === "fr" ? {
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
function FD(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function ID(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function LD(e, t = "auto") {
	return e.map((e) => RD(e, t)).join(" ");
}
function RD(e, t) {
	switch (e.kind) {
		case "px": return `${zD(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${zD(e.min)}px`}, ${zD(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${zD(e.max)}px)` : `minmax(${zD(e.min)}px, auto)`;
	}
}
function zD(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function BD(e) {
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
function VD(e, t) {
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
function HD(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = UD(r, e), o = UD(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function UD(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function WD(e, t, n, r) {
	let i = qD(e, t, n.before), a = qD(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = KD(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = QD(n.before, e) + QD(n.after, e), r = i.total + a.total;
		JD(l, e, i, t * (i.total + c) / r), JD(l, e, a, t * (a.total - c) / r);
	} else u || YD(l, i, i.total + c), d || YD(l, a, a.total - c);
	return l;
}
var GD = 120;
function KD(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < GD ? o = t < 0 ? -n : GD - n : c > 0 && c < GD && (o = t > 0 ? r : r - GD), Math.min(Math.max(o, i), a);
}
function qD(e, t, n) {
	let r = ZD(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function JD(e, t, n, r) {
	let i = QD(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function YD(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...XD(e[i])
		};
	}
}
function XD(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function ZD(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function QD(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function $D(e, t) {
	let n = ZD(t.before, e), r = n + ZD(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function eO(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function tO(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function nO(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var rO = "ui-grid-splitter", iO = "ui-container", aO = "ui-orientation--vertical", oO = 16, sO = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Yt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, cO = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Xt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, lO = class {
	root;
	store = new yC();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new gf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${rO}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${rO}`)), P(this.root, `.${rO}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${rO}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = dO(t);
			e !== null && (this.restore(e, fO(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of uC) {
			let i = r[n], a = mC(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${rO}`);
		if (t === null || this.drag.active || T(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = _O(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${rO}`), n = t === null ? null : dO(t);
		if (t === null || n === null) return;
		let r = fO(t);
		for (let e of uC) n.style.removeProperty(mC(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = WD(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(mC(e.axis.split, e.tier), LD(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of uC) {
			let a = mC(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = dO(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = fO(e), r = pC(), i = pO(t, n, r), a = i === null ? null : ND(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = VD(a, BD(t.getAttribute(n.limits))), s = mO(t, n), c = hO(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = HD(c, gO(t, n).map((e) => hO(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = dO(e);
		if (t === null) return;
		let n = fO(e), r = hO(e, n), i = mO(t, n), a = gO(t, n).map((e) => hO(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : HD(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String($D(i, o))), uO(t, n, i));
	}
};
function uO(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(rO)) continue;
		let e = getComputedStyle(r), i = nO(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(zn, i);
	}
}
function dO(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(iO) ? t : null;
}
function fO(e) {
	return e.classList.contains(aO) ? sO : cO;
}
function pO(e, t, n) {
	for (let r = uC.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(mC(t.split, uC[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function mO(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function hO(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function gO(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(rO) && fO(r) === t && n.push(r);
	return n;
}
function _O(e) {
	let t = Number(e.getAttribute(Zt));
	return Number.isFinite(t) && t > 0 ? t : oO;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var vO = "ui-split-button", yO = "ui-split-button__main", bO = "ui-split-button__toggle", xO = "ui-split-button__menu", SO = "ui-split-button--open", CO = class {
	root;
	menus = new ru({
		show: ({ owner: e }) => e.classList.add(SO),
		hide: ({ owner: e }) => e.classList.remove(SO),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = wO(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${yO}`)?.closest(`.${vO}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = wO(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = TO(t), r = e.target.closest(`.${v}`);
		n === null || r === null || !n.contains(r) || r.matches(`${Ut}, ${Gt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = TO(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: EO(e)
		}) && Fs(r, I(r, `.${v}:not(${Ut})`, `.${zt}`), t);
	}
};
function wO(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${bO}, .${yO}`), n = t?.closest(`.${vO}`) ?? null;
	return t === null || n === null || t.classList.contains(yO) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function TO(e) {
	return e.querySelector(`:scope > .${xO}`);
}
function EO(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var DO = "ui-button-group", OO = "ui-button-group__item", kO = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${DO}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), P(this.root, `.${DO}`, {
			childList: !0,
			attributeFilter: [Un]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = AO(i);
			i.toggleAttribute(Hn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		O(n, r ?? n.find(fo) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${OO}`), n = t?.closest(`.${DO}`) ?? null;
		if (t === null || n === null || t.closest(`.${DO}`) !== n || T(n)) return;
		let r = AO(t);
		r !== null && T(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${OO} > .${lr}`), n = t?.closest(`.${DO}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(AO).filter((e) => e !== null), i = co({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${OO}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		bo(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Un,
			bindingAttribute: Gn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${OO}`, `.${DO}`);
	}
};
function AO(e) {
	return e.querySelector(`:scope > .${lr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var jO = "ui-accordion", MO = "details", NO = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${jO}`)), P(this.root, `.${jO}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(jO))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${MO}`)];
	}
}, PO = "ui-tab-overflow", FO = "ui-tab-overflow__menu", IO = "ui-tab-overflow__menu--open", LO = "ui-tab-overflow__entry", RO = "ui-tab-overflow__entry--current", zO = class {
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
		this.options = e, this.list = new HO(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : BO({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return VO(e, this.options.hiddenClass, t);
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
function BO(e) {
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
function VO(e, t, n) {
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
var HO = class {
	menu;
	button = null;
	list = new ru({
		show: ({ popup: e }) => e.classList.add(IO),
		hide: ({ popup: e }) => {
			e.classList.remove(IO), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = FO, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(UO)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${RO}`);
		r !== null && O(this.entries(), r), this.button = e, Jc(e, this.menu), this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && Fs(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LO}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || T(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = co({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), O(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${LO}`) : null;
		t === null || t === document.activeElement || T(t) || (O(this.entries(), t), Ss(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${LO}`));
	}
};
function UO(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${LO} ${ur}`, t.classList.toggle(RO, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(g, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add($n), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var WO = "data-ui-caption-text", GO = ".ui-text__title";
function KO(e) {
	for (let t of e.querySelectorAll(GO)) {
		let e = t.textContent ?? "";
		t.getAttribute(WO) !== e && t.setAttribute(WO, e);
	}
}
function qO(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Fc()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: N.normal,
		easing: N.ease,
		pseudoElement: "::after"
	});
}
function JO(e) {
	e === null || typeof e.animate != "function" || Fc() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: N.fast,
		easing: N.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var YO = "ui-tabs", XO = "ui-tab-header", ZO = "ui-tab-header--selected", QO = "ui-tab-header--overflowed", $O = "ui-tabs--overflowing", ek = "ui-tabs--no-overflow", tk = "ui-tabs__strip", nk = "data-ui-tab-key", rk = "data-ui-tab-page", ik = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zO({
			rootClass: YO,
			overflowingClass: $O,
			wraps: (e) => e.classList.contains(ek),
			hiddenClass: QO,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${YO}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${YO}`, {
			childList: !0,
			attributeFilter: [Kn, ...Xn],
			relevant: (e) => !jl(e, `[${rk}]`, `.${YO}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(nk) ?? "") === t) ?? null;
		if (r !== null && !ak(r)) {
			let t = n.find(ak);
			if (t !== void 0) {
				this.select(e, t.getAttribute(nk) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(ZO)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(nk) ?? "") === t;
			e.classList.toggle(ZO, n), e.setAttribute("aria-selected", n ? "true" : "false"), KO(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(ak), a), qO(i, a), O(n.filter((e) => !e.classList.contains(QO)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(rk) ?? "") !== t, !n.hidden && i !== null && i !== a && JO(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${tk}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(nk) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(ak).map((e) => {
				let n = e.getAttribute(nk) ?? "";
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
		let t = e.target.closest(`.${PO}`), n = t?.closest(`.${YO}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${YO}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${XO}`);
		if (r === null || T(r)) return;
		let i = r.closest(`.${YO}`), a = r.getAttribute(nk);
		i !== null && a !== null && r.closest(`.${YO}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${XO}`), n = t?.closest(`.${YO}`) ?? null;
		if (t === null || n === null) return;
		let r = co({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(nk) ?? ""), r.focus());
	}
	select(e, t) {
		bo(e, t, {
			attribute: Kn,
			bindingAttribute: Gn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return I(e, `.${XO}`, `.${YO}`);
	}
	ownPages(e) {
		return I(e, `[${rk}]`, `.${YO}`);
	}
};
function ak(e) {
	return e.classList.contains(QO) || MS(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var ok = "ui-command-bar", sk = "ui-command-bar__host", ck = "ui-command-bar__item", lk = "ui-command-bar__overflow", uk = "ui-command-bar--overflowing", dk = "ui-command-bar__overflowed", fk = "ui-text__title", pk = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zO({
			rootClass: ok,
			overflowingClass: uk,
			wraps: (e) => !hk(e),
			hiddenClass: dk,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${ok}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), P(this.root, `.${ok}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = mk(e), n = e.querySelector(`:scope > .${lk}`);
		if (t === null || n === null) return;
		let r = gk(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(uk) && _k(r);
		for (let e of r) Kc(e, e.classList.contains(dk) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lk}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(ok) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = mk(e), n = t === null ? [] : gk(t).filter((e) => e.classList.contains(ck) && e.classList.contains(dk)).map((e) => e.querySelector(y) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: vk(e),
			current: !1,
			disabled: T(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !T(n) && yk(n).click();
	}
};
function mk(e) {
	return e.querySelector(`:scope > .${sk}`);
}
function hk(e) {
	let t = mk(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function gk(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(ck) ? n.querySelector(y) : null;
		e !== null && MS(e) && t.push(n);
	}
	return t;
}
function _k(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(ck) ? t ||= !r.classList.contains(dk) : t || r.classList.add(dk);
	}
}
function vk(e) {
	let t = yk(e), n = t.querySelector(`.${fk}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function yk(e) {
	return e.matches(ss) ? e : e.querySelector(ss) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var bk = "ui-breadcrumbs", xk = "ui-breadcrumbs__item", Sk = "ui-breadcrumb", Ck = "ui-breadcrumb--current", wk = "ui-hidden", Tk = "data-ui-step-collapsed", Ek = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), P(this.root, `.${bk}`, {
			childList: !0,
			attributeFilter: ["class", ...Xn]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${bk}`)) this.apply(e);
	}
	apply(e) {
		let t = I(e, `.${xk}`, `.${bk}`);
		for (let e of t) Dk(e);
		let n = t.filter((e) => !e.classList.contains(wk)).map((e) => e.querySelector(`.${Sk}`)).filter((e) => e !== null && !e.classList.contains(wk)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(Ck, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function Dk(e) {
	let t = e.querySelector(`:scope > .${Sk}`), n = t === null ? "" : Xn.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === Xn[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(Tk) : e.getAttribute(Tk) !== n && e.setAttribute(Tk, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function W(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function Ok(e) {
	return W(e).toString(16).padStart(2, "0").toUpperCase();
}
function kk(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return Ak(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function Ak(e, t, n) {
	return .2126 * jk(e) + .7152 * jk(t) + .0722 * jk(n);
}
function jk(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var Mk = "ui-color-input", Nk = "ui-color-input--open", Pk = "ui-color-input__popup", Fk = "ui-color-input__text", Ik = "ui-color-input__row", Lk = "ui-color-input__swatch--button", Rk = "ui-color-input__value-input", zk = "ui-color-input__square-thumb", Bk = "ui-color-input__hue-thumb", Vk = "data-ui-color-toggle", Hk = "data-ui-color-tab", Uk = "data-ui-color-tab-selected", Wk = "data-ui-color-pane", Gk = "data-ui-color-pane-selected", Kk = "data-ui-color-square", qk = "data-ui-color-hue", Jk = "data-ui-color-hex", Yk = "data-ui-color-channel", Xk = "data-ui-color-factor", Zk = "data-ui-color-opacity", Qk = "data-ui-color-name", $k = "data-ui-color-name-selected", eA = "data-ui-color-format", tA = "data-ui-color-variant", nA = "data-ui-color-no-picker", rA = "data-ui-color-no-palette", iA = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new ru({
		show: ({ owner: e }) => e.classList.add(Nk),
		hide: ({ owner: e }) => e.classList.remove(Nk)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Mk}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = S(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Mk}`) ?? []);
		}), P(this.root, `.${Mk}`, {
			childList: !0,
			attributeFilter: [
				eA,
				tA,
				nA,
				rA
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new gf({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${Kk}], [${qk}]`),
			begin: (e, t) => {
				let n = e.closest(`.${Mk}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(Kk) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${Rk}`)?.value ?? null
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
		let t = lA(e), n = this.states.get(e), r = n?.paneChosen === !0 ? aA(e, n.pane) : oA(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? sA(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = _A(t);
			if (i === null) return n ?? sA(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && cA(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = bA(a, o, s);
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
			...n ?? sA(r),
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
			let [e, a, o] = bA(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), pA(e, "--ui-color-input-color", t.held ? yA(n, r, i, t.opacity) : "transparent"), pA(e, "--ui-color-input-solid", yA(n, r, i, 255)), pA(e, "--ui-color-input-on-color", t.held ? kk(n, r, i, t.opacity) : "inherit"), fA(e, t.held ? dA(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${Kk}]`), o = e.querySelector(`[${qk}]`), [s, c, l] = xA(t.hue, 1, 1);
		if (pA(e, "--ui-color-input-hue", yA(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${zk}`);
			e !== null && (pA(e, "left", `${t.saturation * 100}%`), pA(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${Bk}`);
			e !== null && pA(e, "top", `${t.hue / 360 * 100}%`);
		}
		mA(e, `[${Jk}]`, vA(n, r, i)), mA(e, `[${Yk}="r"]`, String(n)), mA(e, `[${Yk}="g"]`, String(r)), mA(e, `[${Yk}="b"]`, String(i)), pA(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), hA(e, `[${Zk}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${Qk}]`)) n.getAttribute(Qk) === t.name ? n.setAttribute($k, "") : n.removeAttribute($k);
		let n = t.name === null ? null : e.querySelector(`[${Qk}="${t.name}"]`), r = n === null ? null : _A(n.style.getPropertyValue("--ui-color-input-chip").trim());
		pA(e, "--ui-color-input-base", r === null ? "transparent" : yA(r[0], r[1], r[2], 255)), hA(e, `[${Xk}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${Wk}]`)) n.getAttribute(Wk) === t.pane ? n.setAttribute(Gk, "") : n.removeAttribute(Gk);
		for (let n of e.querySelectorAll(`[${Hk}]`)) n.getAttribute(Hk) === t.pane ? n.setAttribute(Uk, "") : n.removeAttribute(Uk);
	}
	resolveRgb(e, t) {
		if (t.name === null) return xA(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${Qk}="${t.name}"]`), r = n === null ? null : _A(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? xA(t.hue, t.saturation, t.value) : gA([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Vk}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${Mk}`));
			return;
		}
		let n = e.target.closest(`[${Hk}]`), r = e.target.closest(`.${Mk}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(Hk), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${Qk}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(Qk)
			}));
			return;
		}
		let a = r.querySelector(`.${Pk}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${Mk}`);
		if (t !== null) {
			if (e.target.hasAttribute(Xk)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(Zk) && this.commit(t, (t) => ({
				...t,
				opacity: W(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${Mk}`);
		if (n === null) return;
		if (t.hasAttribute(Xk) || t.hasAttribute(Zk)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(Jk)) {
			let e = _A(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = bA(e[0], e[1], e[2]);
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
		let r = t.getAttribute(Yk);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = W(Number(t.value));
		let [l, u, d] = bA(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${Rk}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = SA((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = SA((t.x - a.left) / a.width), s = 1 - SA((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${Rk}`);
		a !== null && (a.value = uA(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		D(e) || e.querySelector(`.${Rk}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(nA) && e.hasAttribute(rA)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${Pk}`), n = e.querySelector(`[${Vk}]`);
		if (t === null) return;
		let r = e.getAttribute(tA) === "swatch" ? e.querySelector(`.${Lk}`) : e.querySelector(`.${Ik}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${Uk}]`) ?? !0
		});
	}
};
function aA(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? nA : rA))(t) ? t : t === "picker" ? "palette" : "picker";
}
function oA(e) {
	return aA(e, "picker");
}
function sA(e) {
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
function cA(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function lA(e) {
	return e.querySelector(`.${Rk}`)?.value.trim() ?? "";
}
function uA(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = vA(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${Ok(e.opacity)}`;
}
function dA(e, t, n, r, i) {
	if (e.getAttribute(eA) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = vA(t, n, r);
	return i === 255 ? a : `${a}${Ok(i)}`;
}
function fA(e, t) {
	for (let n of e.querySelectorAll(`.${Fk}`)) n.textContent !== t && (n.textContent = t);
}
function pA(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function mA(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function hA(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function gA(e, t) {
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
function _A(e) {
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
function vA(e, t, n) {
	return `#${Ok(e)}${Ok(t)}${Ok(n)}`;
}
function yA(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function bA(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function xA(e, t, n) {
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
function SA(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function CA(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var wA = "ui-table", TA = "ui-table--reorderable", EA = "ui-scroll-x--auto", DA = "ui-scroll-x--always", OA = `:scope > .${rn}`, kA = `.${on}`, AA = "ui-table__header-cell", jA = `${AA}--pinned`, MA = `${OA} > .${an} > .${AA}`, NA = `${MA}--pinned`, PA = "ui-table__host", FA = `${OA} > .${PA}`, IA = `.${wA}, .${nn}, [${Qt}]`, LA = "--ui-table-columns", RA = "--ui-table-sticky-top", zA = "--ui-table-sticky-bottom", BA = "--ui-table-sized-columns", VA = "--ui-table-pin-", HA = "--ui-table-order-", UA = 64, WA = "data-ui-table-cell-hidden", GA = "data-ui-table-cell-last", KA = "columns", qA = "hidden", JA = "order", YA = "layout", XA = 32, ZA = 16, QA = class {
	root;
	store = new yC();
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
		if (this.root = e.root ?? document, this.drag = new gf({
			root: this.root,
			resolveHandle: (e) => e.closest(kA),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new gf({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of uC) e !== "base" && matchMedia(`(min-width: ${dC[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${wA}`)), P(this.root, `.${wA}`, {
			childList: !0,
			relevant: rj
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), P(this.root, `.${wA}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(wA)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), P(this.root, `.${wA}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: ij
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(FA);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), CA(t, () => this.pin(t));
			let e = t.querySelector(OA);
			e !== null && CA(e, () => $A(t, e));
			let n = t.querySelector(FA);
			n !== null && (this.markScrollbar(t, n), CA(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, KA), r = n === null ? null : ND(n);
		r !== null && r.length !== t.length ? (this.store.write(e, KA, null), this.store.writeBoot(e, YA, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, JA);
		if (i !== null && !oj(i, t)) {
			this.store.write(e, JA, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(hn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${wA}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = aj(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(EA) || e.classList.contains(DA);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(BA);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = tO(t, n);
				e.style.setProperty(BA, LD(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${HA}${t}`, String(r[t])) : e.style.removeProperty(`${HA}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(tn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(tn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(un) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(un, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(TA)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= UA) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Qt}]`)) {
				let r = Number(t.getAttribute(Qt));
				!(r >= UA) || t.closest(`.${wA}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(WA, n.hidden.has(r)), t.toggleAttribute(GA, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(MA)) {
			let e = Number(n.getAttribute(Qt)), r = n.getAttribute($t), i = n.classList.contains(jA) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: uj(r) ? r : null,
				startsHidden: n.hasAttribute(en),
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
		for (let e of t) (n[e.key] ?? lj(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, qA) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(LA).trim(), n = t.length === 0 ? null : ND(t);
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
		n === null || i !== void 0 && n === lj(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, qA, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return aj(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(NA).length;
		if (t < 2) return;
		let n = eO(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${VA}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${wA}`)?.toggleAttribute(mn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(OA), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return tj(e) ? n.slice(1) : n;
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
		let t = e.target.closest(kA) ?? (e.shiftKey ? ej(e.target) : null);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = ZA;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${wA}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Qt)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(kA)?.closest(`.${wA}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = WD(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(XA, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, nj(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, KA, t === null ? null : LD(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(BA).trim(), n = e.getAttribute(tn), r = {};
		t.length > 0 && (r[BA] = t);
		for (let t of e.style) t.startsWith(HA) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, YA, null);
			return;
		}
		this.store.writeBoot(e, YA, {
			styles: r,
			attributes: {
				[tn]: n,
				[un]: e.getAttribute(un)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${wA}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = BD(t.getAttribute(Yt)), i = VD(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Qt)), u = this.hiddenOf(t, o), d = aj(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${AA}`), n = t?.closest(`.${wA}`) ?? null;
		return t === null || n === null || !n.classList.contains(TA) || e.closest(kA) !== null || t.classList.contains(jA) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${wA}`), r = Number(e.getAttribute(Qt));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(dn, ""), e.setAttribute(fn, ""), {
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
		for (let a of aj(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > sj(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), cj(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(pn, "after") : a.cell.setAttribute(pn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(fn), t.table.removeAttribute(dn), cj(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = aj(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, JA, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function $A(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${PA}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(RA, `${n}px`), e.style.setProperty(zA, `${r}px`);
}
function ej(e) {
	let t = e.matches(`.${AA}`) ? e.querySelector(`:scope > ${kA}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function tj(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function nj(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function rj(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(IA) || t.querySelector(IA) !== null)) return !0;
	return !1;
}
function ij(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(PA);
}
function aj(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function oj(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function sj(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function cj(e) {
	for (let t of e.querySelectorAll(`[${pn}]`)) t.removeAttribute(pn);
}
function lj(e) {
	return e.startsHidden || e.hideBelow !== null && uC.indexOf(pC()) < uC.indexOf(e.hideBelow);
}
function uj(e) {
	return e !== null && uC.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var dj = /* @__PURE__ */ new WeakMap();
function fj(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(St);
	for (let i of R(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = pj(i, a) ?? mj(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${nt}]`)) n.has(t) || t.remove();
}
function pj(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : dj.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function mj(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (gj(i, t.getAttribute(g)), dj.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function hj(e) {
	return e.find((e) => !e.classList.contains(nr));
}
function gj(e, t) {
	e.setAttribute(nt, ""), t === null ? e.removeAttribute(rt) : e.setAttribute(rt, t);
}
var _j = "bottom", vj = "pending";
function yj(e, t, n) {
	let r = e.querySelector(`:scope > [${mt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(mt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function bj(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var xj = /* @__PURE__ */ new WeakMap();
function Sj(e) {
	for (let t of e.querySelectorAll(`[${nt}]`)) t.remove();
}
function Cj(e, t, n, r, i, a) {
	let o = Sv(e, R(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = dv(i.getItemsFilterSortMetadata(t), a, sv(e));
	if (c && !l && Sj(e), o.length === 0) {
		xj.set(e, []);
		return;
	}
	let d = V_(e);
	if (!l) {
		bj(e, [...fv(o, u, r), ...B_(d)]);
		return;
	}
	Sj(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (xj.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	xj.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = fv(t, u, r));
		let n = e === "" ? void 0 : hj(t);
		if (n !== void 0) {
			let e = wj(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	bj(e, [...m, ...B_(d)]);
}
function wj(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && gj(r, n.getAttribute(g)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var Tj = "ui-tree-rules", Ej = `:scope > .${cn}:not(.${ln})`;
function Dj(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(Tj, { bubbles: !0 })), H_(e, t, n.templates, n.renderer, e.querySelector(Ej) !== null);
		return;
	}
	switch (yv(e)) {
		case "windowed":
			H_(e, t, n.templates, n.renderer), Oj(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			cv(e, t, n.metadata, n.renderer, n.state), H_(e, t, n.templates, n.renderer), Cj(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function Oj(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && fj(e, (e) => wj(r, n.renderer, e));
}
//#endregion
//#region src/interactions/table-header-group.ts
var kj = ".ui-table", Aj = `:scope > .${rn} > .${an} > [role='columnheader']`, jj = `:scope > .${on}`, Mj = "input:not([type='hidden']), button, select, textarea, a[href]", Nj = /* @__PURE__ */ new WeakMap();
function Pj(e) {
	for (let t of e.querySelectorAll(Aj)) {
		let e = Fj(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function Fj(e) {
	let t = e.querySelector(Mj);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(jj);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function Ij(e) {
	let t = Lj(e), n = Nj.get(e), r = n !== void 0 && t.includes(n) ? n : t[0];
	return r !== void 0 && (Rj(e, r), !0);
}
function Lj(e) {
	let t = [];
	for (let n of e.querySelectorAll(Aj)) {
		let e = Fj(n);
		e !== null && fo(e) && t.push({
			stop: e,
			left: n.getBoundingClientRect().left
		});
	}
	return t.sort((e, t) => e.left - t.left).map((e) => e.stop);
}
function Rj(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), Nj.set(e, t), t.focus();
}
function zj(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(kj) && Fj(t) === e ? n : null;
}
function Bj(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(), !0;
		case "ArrowUp": return !0;
	}
	if (!lo(e.key, "horizontal")) return !1;
	let r = co({
		key: e.key,
		items: Lj(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && Rj(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Vj = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Hj = ".ui-table", Uj = `:scope > [${_}], :scope > .${rn}, :scope > .${rn} > [${_}]`, Wj = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(k)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), P(this.root, k, {
			childList: !0,
			attributeFilter: [
				Vn,
				Un,
				Wn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		Mo(e, t);
		for (let t of e.querySelectorAll(Uj)) Gj(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(Hj) && Pj(e);
			for (let e of t) {
				let t = Up(e);
				t !== null && Gj(t);
				for (let t of Wp(e)) Gj(t);
			}
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, k);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (Zo(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Do(n, r);
			return;
		}
		Po(n, i, r, Oo(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(So), r = n?.closest(k) ?? null;
		return n === null || r === null || n.closest(k) !== r || !r.matches(t) || T(r) ? null : qp(e.target, n) === null && !E(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Co);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), as(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = zj(e.target);
		if (t !== null && !T(t)) {
			Bj(e, t, () => this.enterRows(t)) && e.preventDefault();
			return;
		}
		let n = Ko(e.target);
		if (n === null || n.row !== null && qp(e.target, n.row) !== null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || T(r)) return;
		let i = Jj(r);
		if (!Vj.has(e.key) && !Qo(e.key, i)) return;
		let a = this.ownItems(r), o = Jo(a), s = es(e.key, a, Yo(a), i);
		if (s !== null) {
			e.preventDefault(), Zo(r, a, s), (r.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Eo(r, o), Po(r, a, s, ko(r, e)));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(Hj) && Ij(r)) {
			e.preventDefault();
			return;
		}
		if (o === null || E(o)) return;
		let c = Up(o);
		switch (e.key) {
			case " ":
				Po(r, a, o, {
					shift: !1,
					ctrl: !0
				}) || qj(o, c);
				break;
			case "Enter":
				Kj(r, a, o, c);
				break;
			case "Delete": {
				let e = Yj(a, o);
				if (e.length === 0) return;
				for (let t of e) as(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	enterRows(e) {
		let t = this.ownItems(e), n = Yo(t) ?? es("ArrowDown", t, null, "vertical");
		e.focus({ preventScroll: !0 }), n !== null && (Zo(e, t, n), e.getAttribute("data-ui-selection") === "one" && Po(e, t, n, wo));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(k) ?? null;
		t !== null && n !== null && [...n.querySelectorAll(Uj)].includes(t) && n.focus({ preventScroll: !0 });
	}
	ownItems(e) {
		return I(e, So, k);
	}
};
function Gj(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function Kj(e, t, n, r) {
	Ao(e) && !No(t).includes(n) && Po(e, t, n, wo), qj(n, r), r === null && as(n, "open");
}
function qj(e, t) {
	t === null ? as(e, is) : t.click();
}
function Jj(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function Yj(e, t) {
	let n = No(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !E(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function Xj(e, t) {
	if (E(e)) return !1;
	let n = t?.getAttribute(yn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Zj(e, t, n) {
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
function Qj(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = $j(e, r, n);
	return i === null || !eM(e, i.parent) ? null : i;
}
function $j(e, t, n) {
	if (n === "in") {
		let n = Zj(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Zj(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: nM(e, n, t.parent, !1)
		};
	}
	let r = tM(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function eM(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function tM(e, t) {
	return e.filter((e) => e.parent === t);
}
function nM(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = tM(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function rM(e, t, n) {
	let r = tM(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? nM(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var iM = "ui-tree__row--folded", aM = "fold-hidden", oM = "fold-shown", sM = "ui-tree__row--dragging", cM = "ui-tree__loading", lM = "ui-tree__loading-ring", uM = "ui-tree-node", dM = "ui-tree-node__text", fM = "ui-tree-node__toggle", pM = "ui-tree-node__rename", mM = ".ui-text__title", hM = "data-ui-tree-drop", gM = "--ui-tree-drop-depth", _M = "--ui-tree-depth", vM = "expanded", yM = 600, bM = .25, xM = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, SM = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), CM = class {
	root;
	store = new yC();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Tj, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${sn}`) : null;
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
		}), this.layoutAll(this.root.querySelectorAll(`.${sn}`)), P(this.root, `.${sn}`, {
			childList: !0,
			attributeFilter: [
				_n,
				vn,
				bn,
				Tn
			],
			relevant: EM
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Tn), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = AM(e)?.getAttribute(_n);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = j(e), r = AM(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(vn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, ee = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), h = p && (o === null ? t[n] ?? m : o.has(n)), te = o !== null && !o.has(n);
			e.style.setProperty(_M, String(u)), e.setAttribute("aria-level", String(u + 1)), Xo(e, r?.querySelector(`:scope > .${dM}`) ?? null), e.classList.toggle(iM, !d), e.classList.toggle(ln, te), e.removeAttribute(wn), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !E(e), p ? e.setAttribute("aria-expanded", h ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Sn), h && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Sn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), h || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Sn), d && h && !te), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: h,
				authoredShown: ee
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return AM(e.row)?.hasAttribute(bn) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${cn}[${g}="${b(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, aM, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, oM, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [wn]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ni(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = sv(t);
		if (r === void 0 && i === null) return null;
		let a = dv(r, this.rules.state, i), o = uv(r, this.rules.state, i);
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
			let t = AM(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => pv(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(j(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${cM}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = j(o), c = i.getItemValue(o);
			if (c === void 0 || lv(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = AM(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(cM) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? DM();
		o.style.setProperty(_M, String(t)), o.classList.toggle(iM, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${fM}`) === null && (!r.hasAttribute("data-ui-unselectable") || qp(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || qp(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${cn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || E(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = Ko(e.target);
		if (t === null || t.row !== null && qp(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || T(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? xM[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!SM.has(e.key) && !lo(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Jo(i), o = es(e.key, i, Yo(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, ko(n, e));
			return;
		}
		if (!(a === null || E(a))) {
			switch (e.key) {
				case " ":
					Po(n, i, a, {
						shift: !1,
						ctrl: !0
					}) || qj(a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, es("ArrowDown", i, a, "vertical"), wo);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), wo);
					break;
				case "Enter":
					Kj(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = Yj(i, a);
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
		let n = this.rowsOf(e), r = Jo(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = Qj(kM(n), j(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => j(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = OM(e), n = t?.closest(".ui-tree") ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (E(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? No(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !E(e) && e.getClientRects().length > 0) : [];
		kv(e, n, t, sM, j(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(sM));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${cn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = j(t), o = (e) => n.some((t) => j(t) === e || TM(i, e, j(t))), s = Xj(t, AM(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? bM : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = kM(f), m = Number(t.style.getPropertyValue(_M)) || 0, ee = new Set(n.map(j)), h = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !ee.has(e.key)) : void 0, te = i.get(a) ?? "", ne = h === void 0 ? {
			parent: te,
			before: d === "before" ? a : nM(p, te, a, !1, ee)
		} : {
			parent: a,
			before: h.key
		}, re = ne.parent.length === 0 ? null : f.find((e) => j(e) === ne.parent) ?? null;
		return re !== null && (!Xj(re, AM(re)) || o(ne.parent)) ? null : {
			mark: d,
			place: ne,
			depth: h === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), yM)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sn}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${hM}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && TM(a, j(e), j(t)))), s = r.getAttribute(hM) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Av(t, sM), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = rM(kM(this.rowsOf(e)), t.map(j), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = AM(e)?.querySelector(`.${dM}`) ?? null;
			r !== null && (r.setAttribute(Cn, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent("move", {
				bubbles: !0,
				detail: { index: i[t] }
			})));
		});
	}
	handleDragEnd(e) {
		let t = OM(e)?.closest(".ui-tree") ?? null;
		t !== null && (Av(t, sM), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		for (let n of e.querySelectorAll(`[${hM}]`)) n !== t && (n.removeAttribute(hM), n.style.removeProperty(gM));
		if (t === null) {
			this.dropPlace = null;
			return;
		}
		t.setAttribute(hM, n), r === void 0 ? t.style.removeProperty(gM) : t.style.setProperty(gM, String(r));
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(j(n), AM(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(iM)) : [];
		this.store.writeJson(e, vM, i), this.layout(e), wM(a.filter((e) => !e.classList.contains(iM)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, vM) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Jo(r);
		Zo(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Eo(e, i), Po(e, r, t, n));
	}
	parentOf(e, t) {
		let n = AM(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => j(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${sn}`), n = AM(e), r = n?.querySelector(mM) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), Hl({
			container: n,
			title: r,
			className: pM,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(xn, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function wM(e) {
	if (!(e.length === 0 || Fc())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: N.fast,
		easing: N.enter
	});
}
function TM(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function EM(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function DM() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = cM, e.setAttribute("aria-hidden", "true"), t.className = lM, e.append(t, w.text("ui.tree.loading")), e;
}
function OM(e) {
	return e.target instanceof Element ? e.target.closest(`.${cn}`) : null;
}
function kM(e) {
	return e.map((e) => ({
		key: j(e),
		parent: AM(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: Xj(e, AM(e)),
		shown: !e.classList.contains(ln)
	}));
}
function AM(e) {
	return e.querySelector(`.${uM}`);
}
//#endregion
//#region src/interactions/tab-order.ts
function jM(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, MM(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function MM(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function NM(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", PM = "ui-tab-item", FM = "ui-tab-item__label", IM = "ui-tab-item__close", LM = "ui-tab-item__rename", RM = "ui-tab-item__caption", zM = "ui-tab-item__pin", BM = ".ui-text__title", VM = "ui-tab-item--dragging", HM = "ui-tab-item__caption--overflowed", UM = "ui-tabs-view--overflowing", WM = "ui-tabs-view--no-overflow", GM = "ui-tab-item__page", KM = "ui-tab-item--selected", qM = `.${v}`, JM = "tab-menu-entry", YM = {
	name: JM,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, XM = "--ui-tabs-view-strip", ZM = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zO({
			rootClass: G,
			overflowingClass: UM,
			wraps: (e) => e.classList.contains(WM),
			hiddenClass: HM,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(S(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => lN(e) === t.key))?.querySelector(`.${FM}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(pS, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				Kn,
				ve,
				...Xn
			],
			relevant: (e) => !jl(e, `.${GM}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(MS);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => lN(e) === r)) {
			this.select(e, lN(n[0]));
			return;
		}
		let i = e.hasAttribute(ve), a = t.find((e) => e.classList.contains(KM))?.querySelector(`.${RM}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = lN(e) === r;
			e.classList.toggle(KM, t);
			let a = e.querySelector(`.${RM}`);
			a !== null && (a.draggable = i, KO(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${FM}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${GM}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${GM}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), qO(a, s), a !== null && a !== s && JO(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${FM}`);
			t === null || e.classList.contains(HM) || (l.push(t), e === s && (u = t));
		}
		O(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !MS(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(XM, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${_}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${PO}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => lN(e) === t)?.querySelector(`.${FM}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(MS).map((e) => ({
				key: lN(e),
				title: e.querySelector(`.${FM}`)?.textContent?.trim() ?? lN(e),
				current: lN(e) === t,
				disabled: T(e.querySelector(`.${FM}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${PM}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = eN(n, r), a = nN(t), o = a.map((e) => {
			if (tN(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? MS(e) ? "shown" : "hidden";
		});
		if (aS(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: lN(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${be}="tab"]`), n = t?.parentElement ?? null, r = e.closest(qM);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => lN(e) === a.key);
		if (i.length === 0 || r.matches(`${Wt}, ${Ut}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(JM, {
			bubbles: !0,
			detail: { keys: [i, lN(o)] }
		})), !0;
		if (eN(n, o).get(i) !== !0) return !0;
		switch (i) {
			case Qx: {
				let e = o.querySelector(`.${FM}`);
				e !== null && this.startRename(e);
				break;
			}
			case $x:
			case eS:
				this.setPinned(n, o, i === $x);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${RM} > .${zM}`);
		t.toggleAttribute(Yn, n), r !== null && (r.toggleAttribute(Yn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = NM(a.map(sN));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? rN(a[a.length - 1]).after(rN(t)) : rN(s).before(rN(t)), oN([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${PO}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = iN(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || T(r)) return;
		let a = r.closest(`.${PM}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, lN(a)), document.activeElement !== r && M(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${IM}`), r = n?.closest(`.${PM}`) ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), $M(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = iN(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(BM) ?? e, r = e.closest(`.${PM}`);
		t === null || r === null || rN(r).hasAttribute("data-ui-unrenamable") || Hl({
			container: t,
			title: n,
			className: LM,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Jn, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => M(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${FM}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${FM}`)).filter((e) => e !== null), i = co({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${PM}`);
		a !== null && this.select(n, lN(a)), i.focus();
	}
	handleDragStart(e) {
		let t = aN(e);
		if (t === null) return;
		if (rN(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		kv(e, t.closest(`.${G}`) ?? t, t, VM, lN(t));
		let n = rN(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${RM}`)?.closest(`.${PM}`) ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${VM}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${RM}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = rN(r), o = t.hasAttribute("data-ui-tab-pinned") ? QM(n, a) : null, s = o ?? rN(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${VM}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = aN(e);
		if (t === null) return;
		t.classList.remove(VM);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(rN(t), n.next);
			return;
		}
		let r = rN(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		if (i === null) return;
		let a = this.ownItems(i);
		oN(a, a.indexOf(t));
	}
	select(e, t) {
		bo(e, t, {
			attribute: Kn,
			bindingAttribute: Gn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${PM}`, `.${G}`);
	}
};
function QM(e, t) {
	let n = null;
	for (let r of I(e, `.${PM}`, `.${G}`)) {
		let e = rN(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function $M(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !rN(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function eN(e, t) {
	return iS(rS(e.getAttribute(ye)), {
		pinned: t.hasAttribute(Yn),
		renamable: !rN(t).hasAttribute(fe),
		removable: e.hasAttribute("data-ui-tabs-removes") && $M(e, t)
	});
}
function tN(e) {
	let t = e.getAttribute(g);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function nN(e) {
	let t = e.querySelector(`[${_}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function rN(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function iN(e) {
	return e.closest(`.${IM}`) !== null || Vl(e) ? null : e.closest(`.${RM}`)?.querySelector(`:scope > .${FM}`) ?? null;
}
function aN(e) {
	return e.target instanceof Element ? e.target.closest(`.${RM}`)?.closest(`.${PM}`) ?? null : null;
}
function oN(e, t) {
	for (let [n, r] of jM(e.map(sN), t)) e[n].setAttribute(qn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function sN(e) {
	return {
		order: cN(e),
		pinned: e.hasAttribute(Yn)
	};
}
function cN(e) {
	let t = e.getAttribute(qn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function lN(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var uN = "button.ui-text__fold-toggle", dN = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(uN);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, fN = "ui-temporal-input__segments", pN = "ui-temporal-input__segment", mN = "ui-temporal-input__segment-literal", hN = "ui-temporal-input__segment--empty", gN = "data-ui-temporal-segment", _N = "data-ui-temporal-step-direction", vN = "data-ui-temporal-segments-of", yN = "--", bN = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${z}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ei(e.components, `.${z}`));
		}), P(this.root, `.${z}`, { attributeFilter: [...yy] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) xy(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${fN}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Sy(e), r = Ty(e), i = B(e, Ny(t));
		t.getAttribute(vN) !== n && (t.replaceChildren(...xN(n).map((e) => CN(e))), t.setAttribute(vN, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(gN);
			if (t === null) {
				n.textContent = TN(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = EN(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(hN, i === null), n.tabIndex = 0, DN(n, t, i, D(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = kN(e.target);
		if (t === null) return;
		let n = t.closest(`.${z}`), r = t.getAttribute(gN), i = ON(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), jN(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), zy(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = MN(e.key, Ty(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = kN(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = kN(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Sf(this.wheelTurn, xf(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${z}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(gN), n < 0 ? 1 : -1, ON(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${_N}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${_N}]`);
		if (t === null) return;
		let n = t.closest(`.${z}`);
		if (n === null || D(n)) return;
		e.preventDefault();
		let r = AN(n) ?? n.querySelector(`.${pN}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(gN), t.getAttribute(_N) === "up" ? 1 : -1, ON(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${pN}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${z}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = B(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = NN(t), o = wy(Cy(e), a) * n, s = a === "hour" ? 24 : 60, c = ((PN(i, a) + o) % s + s) % s;
		this.write(e, Wy(e, FN(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? FN(t, "hour", IN(l, t.getHours() >= 12)) : FN(t, NN(n), l), i);
		}
		u && jN(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, FN(r, "hour", IN(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return B(e, t) ?? Uy(e);
	}
	write(e, t, n) {
		zy(e, t, n), Vy(e), this.applySegments(e);
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
function xN(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Si(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(SN(r)), n += r.length;
	}
	return t;
}
function SN(e) {
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
function CN(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = mN, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = pN, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(gN, e.unit), t.dataset.width = String(e.width), wN(t, e.unit), t;
}
function wN(e, t) {
	if (t === "meridiem") {
		w.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = NN(t);
	w.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function TN(e, t, n, r) {
	return t && n !== null ? _i(n, e, r) : e;
}
function EN(e, t, n, r) {
	if (n === null) return yN;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : PN(n, NN(e));
	return String(i).padStart(t, "0");
}
function DN(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : PN(n, NN(t))));
}
function ON(e) {
	return Ny(e.closest(`.${fN}`));
}
function kN(e) {
	let t = e instanceof Element ? e.closest(`.${pN}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${z}`);
	return n === null || D(n) ? null : t;
}
function AN(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${pN}`) : null;
}
function jN(e, t, n) {
	co({
		key: n,
		items: [...e.querySelectorAll(`.${pN}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function MN(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function NN(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function PN(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function FN(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function IN(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var LN = "ui-timestamp", RN = "ui-timestamp__text", zN = "data-ui-timestamp-format", BN = "datetime", VN = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${LN}`), w.temporal === null), w.onTable(() => this.apply(this.root.querySelectorAll(`.${LN}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(ei(e.components, `.${LN}`))), P(this.root, `.${LN}`, {
			childList: !0,
			attributeFilter: [BN],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${LN}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: w.temporal,
			language: w.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Ki(a.getAttribute(zN)), o = Gi(a.getAttribute(BN)), s = a.querySelector(`.${RN}`);
			if (s === null || t && !HN(e, o, r)) continue;
			let c = o === null ? "" : Yi(o, e, n, r), l = e === "relative-date" ? Zi(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= qi(e) && o !== null;
		}
		i && wa(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${LN}:is([${zN}="relative"], [${zN}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function HN(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Xi(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var UN = /* @__PURE__ */ new Map();
function WN(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${_}]`)) if (t.closest(y) === e) return t;
	return null;
}
function GN(e, t, n, r) {
	let i = KN(e, t);
	return i !== null && (UN.set(e, {
		key: t,
		block: n
	}), qN(e, i, n, r), !0);
}
function KN(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function qN(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = ho(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = JN(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function JN(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function YN(e) {
	let t = UN.get(e);
	if (t === void 0) return;
	let n = KN(e, t.key);
	if (n === null) {
		UN.delete(e);
		return;
	}
	qN(e, n, t.block, "auto");
}
function XN(e) {
	UN.delete(e);
}
function ZN(e) {
	if (!(UN.size === 0 || !(e instanceof Node))) for (let t of [...UN.keys()]) (!t.isConnected || ho(t).contains(e)) && UN.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var QN = "data-ui-scroll-anchor", $N = "End", eP = 4, tP = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], nP = /* @__PURE__ */ new WeakSet();
function rP(e) {
	nP.add(e);
}
function iP(e) {
	nP.delete(e);
}
var aP = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of tP) this.root.addEventListener(e, (e) => oP(e), {
			capture: !0,
			passive: !0
		});
		P(this.root, `[${QN}="${$N}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Et]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !cP(t) || this.pinned.set(t, nP.has(t) || uP(t) && !lP(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${QN}="${$N}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), nP.has(t)) {
				this.pinned.set(t, !0), sP(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (lP(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), sP(t);
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
			if (!e.isConnected || r === null || !cP(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) nP.has(e) || this.pinned.get(e) !== !1 && !lP(e) ? sP(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function oP(e) {
	ZN(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${QN}="${$N}"]`) : null;
	t !== null && nP.delete(t);
}
function sP(e) {
	e.scrollTop = e.scrollHeight;
}
function cP(e) {
	return e.getAttribute(QN) === $N;
}
function lP(e) {
	return e.getAttribute(xt)?.toLowerCase() === "true";
}
function uP(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= eP;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var dP = `:is(.ui-surface, .ui-card)[${oe}]`, fP = "ui-surface--clickable", pP = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), P(t, dP, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(dP));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(dP) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(fP)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), _P(e, "role", gP(e) ? "group" : "button"), _P(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : hP(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = mP(e);
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
function mP(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(fP) && t.hasAttribute("tabindex") ? t : null;
}
function hP(e) {
	let t = e.closest(So);
	return t !== null && t.closest(k)?.matches(".ui-items-view, .ui-table") === !0 && Up(t) === e;
}
function gP(e) {
	for (let t of e.querySelectorAll(Vp)) if (Kp(e, t)) return !0;
	return !1;
}
function _P(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var vP = `${Bp}, [role='menu'], [role='tab']`, yP = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? bP, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(vP) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function bP(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function xP(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = CP(e, a, n), s = CP(e, a + 1, n);
	return wP(t, o.top, s.top, o.line, s.line);
}
function SP(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = CP(e, a, n), s = CP(e, a + 1, n);
	return wP(t, o.line, s.line, o.top, s.top);
}
function CP(e, t, n) {
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
function wP(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var TP = 250, EP = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(dt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < TP && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${dt}="${b(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${dt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = DP(e, "data-ui-scroll-viewport") ?? OP(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? AP(e) : null, a = i === null ? null : AP(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = SP(a, xP(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? kP(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function DP(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function OP(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : DP(e, _);
	return t === null ? null : ho(t);
}
function kP(e, t) {
	return t > 0 ? e / t : 0;
}
function AP(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${ft}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${pt}]`);
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
var jP = `.${lr}, .ui-action, .${v}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice`, MP = "ui-key-value-action__row", NP = `${jP}, ${`${So}, .${MP}`}`, PP = "ui-pressing", FP = "ui-press-held", IP = "--ui-press-x", LP = "--ui-press-y", RP = "--ui-ripple-radius", zP = "--ui-ripple-opacity", BP = class {
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
		if (t === null || typeof t.animate != "function" || Fc()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(IP, `${r}px`), t.style.setProperty(LP, `${i}px`), t.classList.add(PP, FP);
		let o = t.animate([{ [RP]: "0px" }, { [RP]: `${a}px` }], {
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
		let t = e.closest(NP);
		if (t === null || T(t)) return null;
		let n = e.closest(or);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(jP) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (qp(t, e) !== null || E(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(k), r = n !== null && !e.classList.contains(MP) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && e.hasAttribute("data-ui-unselectable");
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
		n.element.classList.remove(FP);
		let r = Math.max(0, N.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, N.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [zP]: 1 }, { [zP]: 0 }], {
			duration: N.normal,
			delay: i,
			easing: N.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(PP, FP), this.presses.get(e) === t && this.presses.delete(e);
	}
}, VP = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), HP = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], UP = `.${$n}, .${er}`, WP = RegExp(`(^|\\s)(${$n}|${er})(\\s|$)`), GP = RegExp(`(^|\\s)${tr}(\\s|$)`), KP = "[type='range']", qP = /* @__PURE__ */ new WeakSet(), JP = /* @__PURE__ */ new WeakSet();
function YP(e = document) {
	let t = e === document ? window : e;
	for (let e of HP) t.addEventListener(e, rF, !0);
	t.addEventListener("keydown", aF, !0), t.addEventListener("change", oF, !0), t.addEventListener("pointerdown", sF, !0), t.addEventListener("mousedown", sF, !0), eF(e.querySelectorAll(UP)), QP(e.querySelectorAll(`[${Qn}]`)), ZP(e.querySelectorAll(KP)), new MutationObserver((e) => {
		for (let t of e) XP(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Qn],
		attributeOldValue: !0
	});
}
function XP(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			$P(t, e.oldValue !== null);
			return;
		}
		let n = WP.test(e.oldValue ?? ""), r = t.matches(UP);
		n !== r && (tF(t, r), $P(t)), GP.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && ZP(t.querySelectorAll(KP));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(UP) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && nF(n), n.matches(UP) && tF(n, !0), eF(n.querySelectorAll(UP)), $P(n), QP(n.querySelectorAll(`[${Qn}]`)), ZP([n, ...n.querySelectorAll(KP)]));
}
function ZP(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = D(t);
		e !== qP.has(t) && (e ? (qP.add(t), t.addEventListener("touchstart", sF, { passive: !1 })) : (qP.delete(t), t.removeEventListener("touchstart", sF)));
	}
}
function QP(e) {
	for (let t of e) $P(t);
}
function $P(e, t = !1) {
	let n = e.getAttribute(Qn);
	n === null && !t || (e.matches(UP) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Od(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function eF(e) {
	for (let t of e) tF(t, !0);
}
function tF(e, t) {
	for (let n of e.children) t ? nF(n) : JP.has(n) && (JP.delete(n), n.removeAttribute("inert"));
}
function nF(e) {
	e.hasAttribute("inert") || (JP.add(e), e.setAttribute("inert", ""));
}
function rF(e) {
	e.target instanceof Element && (T(e.target) ? (e.type === "click" && Ql(e), cF(e)) : e.type === "click" && iF(e.target) && e.preventDefault());
}
function iF(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && D(e);
}
function aF(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && T(e.target)) {
			cF(e);
			return;
		}
		!VP.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && D(e.target) && e.preventDefault();
	}
}
function oF(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && D(e.target) && e.stopImmediatePropagation();
}
function sF(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !D(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function cF(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var lF = /* @__PURE__ */ new WeakMap(), uF = new ru({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = lF.get(e);
		lF.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), dF = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => uF.popupOf(r) === t;
		return lF.set(t, n.onDismiss), uF.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (lF.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && uF.reposition(r);
			},
			close: () => {
				i() && uF.close(r);
			}
		};
	},
	focusReturn: (e) => Is(e)
};
//#endregion
//#region src/items/item-rows.ts
function fF(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Q_,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Ko(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var pF = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? gF(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), _F(l, n, t);
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
		let i = hF(r.item, t, n);
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
			mF(n, e) && this.applyBoundAttribute(i, String(S(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = S(t.bindingId);
			e.push([t, `[${Le}${gr(n.propertyName)}="${b(r)}"]`]);
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
		let r = xF(t, n.templateKeyPropertyName);
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
		r !== void 0 && J_(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : q_(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = za(u, () => this.metadata.isTranslatable(a) && !Y_(l)), f = S(a.componentId), p = e.closest(`[${oe}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = yr(p, t, () => [e])[0] ?? null;
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
function mF(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = S(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function hF(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? $_(r, i.name) : iv(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return av(r, i.key, n), e;
	let a = r;
	return a[tv(a, i.name)] = n, e;
}
function gF(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function _F(e, t, n) {
	e.setAttribute(g, t), bF(e, n), yF(e, n);
}
var vF = [
	["CanSelect", le],
	["CanDrag", ue],
	["CanRemove", de],
	["CanRename", fe],
	["CanShowContextMenu", pe]
];
function yF(e, t) {
	for (let [n, r] of vF) {
		let i = $_(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function bF(e, t) {
	let n = $_(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(it, n.value) : e.removeAttribute(it);
}
function xF(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = $_(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var SF = "Group", CF = class {
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
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), P(e.root, `[${st}="${ct}"]`, { attributeFilter: [Ke] }, (e) => {
			for (let t of e) {
				let e = ni(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), P(e.root, `[${lt}="windowed"]`, { attributeFilter: [St] }, (e) => {
			for (let t of e) {
				let e = ni(t);
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
			for (let [t, n] of e) t.isConnected && Dj(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(S(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : rv(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${_}]`)) {
			if (yv(r) !== "virtualized") continue;
			let i = r.closest(y);
			i === null || !this.drawsPatchedComponent(i, S(e.reference.componentId), t) || !wF(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(C(i), t) && this.sync(r, C(i));
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
		Dj(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${g}="${b(t)}"]`)].filter((t) => this.isItemRoot(t) && Xr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${_}]`), i = r === null ? null : ni(r);
		if (r !== null && i !== null && yv(r) === "virtualized") {
			let a = e.getAttribute(g);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = TF(SF, t);
		a && bF(e, this.options.renderer.getItemValue(e)), vF.some(([e]) => TF(e, t)) && yF(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && TF(SF, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => TF(e.itemProperty, t)) || n.sorts.some((e) => TF(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${_}]`)) {
			let n = ni(t);
			n === e && this.sync(t, n);
		}
	}
};
function wF(e, t) {
	let n = Yr(e, Jr(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function TF(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var EF = "ui-table", DF = "ui-table--no-header";
function OF(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(EF)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(DF)) && (s ? o : a).push(t);
	a.forEach((e, t) => kF(e, t));
	for (let [e, n] of t) kF(e, a.length + n);
	n !== null && o.forEach((e, t) => kF(e, a.length + n + t)), AF(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function kF(e, t) {
	AF(e, "aria-rowindex", String(t + 1));
}
function AF(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var jF = 50, MF = 1, NF = .5, PF = 60, FF = "--ui-window-look", IF = "--ui-window-row", LF = "--ui-window-tile", RF = 3, zF = class {
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
			if (this.layout(t), KF(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = YF(e, vt);
		if (t !== null && cP(e) && BF(e.getAttribute("data-ui-window-more-after"))) {
			vo(e, Math.max(0, this.windowBottom(e, t) - _o(e).height));
			return;
		}
		t !== null && t !== 0 && vo(e, BF(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = GF(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : WF(n[n.length - 1]).bottom - WF(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = YF(e, vt), n = GF(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = _o(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		yv(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${_}][${lt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = go(e.target);
		if (t === null || yv(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, PF));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && KF(e) > 0) return;
		let n = GF(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = YF(e, vt), i = BF(e.getAttribute(bt)), a = BF(e.getAttribute(xt));
		if (r !== null) {
			let o = this.windowSize(e), s = _o(e), c = Math.max(1, Math.round(s.height * MF / t.itemSize), Math.floor(o * NF)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, qF(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, qF(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = _o(e), s = Math.max(1, o.height * MF), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, qF(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, qF(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = YF(e, yt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ni(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, e.setAttribute(ht, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && YF(e, "data-ui-window-total") === null && HF(e) && yj(e, vj, RF * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: JF(e),
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
			o.pending = !1, e.removeAttribute(ht), e.removeAttribute("aria-busy"), yj(e, vj, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = GF(e), r = YF(e, yt), i = YF(e, vt);
		if (OF(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			yj(e, "top", 0), yj(e, _j, 0);
			return;
		}
		if (n.length > 0) {
			let r = WF(n[n.length - 1]).bottom - WF(n[0]).top;
			if (r > 0) {
				let i = VF(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), UF(e, a > 1 ? (WF(n[n.length - 1]).top - WF(n[0]).top) / (a - 1) : r, i > 1 ? WF(n[1]).left - WF(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		yj(e, "top", a), yj(e, _j, o), YN(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(IF));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = YF(e, _t);
		return t !== null && t > 0 ? t : jF;
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
function BF(e) {
	return e !== null && e.toLowerCase() === "true";
}
function VF(e) {
	let t = WF(e[0]).top, n = 1;
	for (; n < e.length && WF(e[n]).top === t;) n++;
	return n;
}
function HF(e) {
	return getComputedStyle(e).getPropertyValue(FF).trim() === "skeleton";
}
function UF(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(IF) !== i && r.setProperty(IF, i), r.getPropertyValue(LF) !== a && (a.length === 0 ? r.removeProperty(LF) : r.setProperty(LF, a));
}
function WF(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function GF(e) {
	return [...e.children].filter((e) => e.hasAttribute(g));
}
function KF(e) {
	return GF(e).length;
}
function qF(e) {
	return e.getAttribute(g);
}
function JF(e) {
	let t = e.closest(y);
	return t === null ? [] : Yr(t, Jr(t));
}
function YF(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var XF = [
	oe,
	se,
	ce
];
function ZF(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, QF(c, e.itemRole);
	let l = eI(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = $F(l, t, n, a);
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
		d.className = l.wrapperClassName, QF(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), _F(d, r, n), c.appendChild(d);
	}
	return _F(c, r, n), o.registerItemScope(c, l, n), c;
}
function QF(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function $F(e, t, n, r) {
	let i = xF(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function eI(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of XF) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), C(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function tI(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return nI(i.renderer.renderItem(e, t, n, r), a);
	let s = ZF(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), nI(s, a);
}
function nI(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var rI = 6, iI = 60, aI = class {
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
		let n = cP(e) && uP(e);
		this.project(e, t), this.layout(e, t), n && !uP(e) && (vo(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && oc(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = R(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? os(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = hF(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = sv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = dv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => lv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => lI(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => pv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = lI(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => pv(e.item, t.item, a))), e !== "" && l.push({
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
		let t = go(e.target);
		if (t === null || yv(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, iI));
	}
	layout(e, t) {
		let n = t.projected, r = dI(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (uI(e) && a > 0) {
			let r = _o(e), c = sI(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - rI), s = Math.min(a, s + rI);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = [], d = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(lI(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), cI(t, r, null), d = !0);
				continue;
			}
			if (a !== null) {
				r.header && gj(a, r.entry.key), l.push(a), u.push([a, e]);
				continue;
			}
			let f = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			f !== null && (cI(t, r, f), l.push(f), u.push([f, e]), d = !0);
		}
		let f = new Set(l);
		for (let e of t.entries) e.element !== null && !f.has(e.element) && (e.element.remove(), e.element = null, d = !0);
		for (let t of R(e)) f.has(t) || (t.remove(), d = !0);
		for (let t of e.querySelectorAll(`:scope > [${nt}]`)) f.has(t) || (t.remove(), d = !0);
		for (let e of t.headers.values()) e.element !== null && !f.has(e.element) && (e.element = null);
		let p = fI(i, 0, o), m = fI(i, s, a);
		bj(e, [...l, ...B_(V_(e))]), yj(e, "top", p > 0 ? p - r : 0), yj(e, _j, m > 0 ? m - r : 0), H_(e, t.componentId, this.options.templates, this.options.renderer, a > 0), OF(e, u, a), (d || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return tI(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && gj(r, t.key), r;
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(lI(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (oI(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(lI(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ri(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of R(e)) {
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
function oI(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function sI(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (vo(e, i + s), i + s);
}
function cI(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = lI(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function lI(e) {
	let t = $_(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function uI(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function dI(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function fI(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var pI = "data-ui-template", mI = "default", hI = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? mI, r = this.findTemplate(e, n);
		return r === void 0 ? n === mI ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${pI}]`);
		for (let e of r) if (e.getAttribute(pI) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= gI(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, $e);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, et);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function gI(e) {
	let t = /* @__PURE__ */ new Set();
	return Ra(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(y)) {
			let n = C(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function _I(e, t) {
	let n = e.querySelector(`style[${Mn}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Mn, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var vI = "script[type='application/json'][data-ui-metadata]";
function yI(e = document) {
	let t = e.querySelector(vI);
	if (t === null) return bI();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return bI();
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
function bI() {
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
var xI = "script[type='application/json'][data-ui-hydration]";
function SI(e) {
	return e !== null && (da(e.title) || da(e.changes));
}
function CI(e = document) {
	let t = e.querySelector(xI)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t), n = e.words;
		return {
			pageId: e.pageId ?? null,
			sequence: typeof e.sequence == "number" ? e.sequence : null,
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
var wI = "reconnecting";
async function TI(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), wI;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function EI(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/reload-guard.ts
var DI = "ne-standard-ui:reloaded-view";
function OI(e, t, n) {
	if (!t) return "no-cookie";
	if (jI(n) === e) return "asked-again";
	try {
		n?.setItem(DI, e);
	} catch {}
	return "reload";
}
function kI(e) {
	try {
		e?.removeItem(DI);
	} catch {}
}
function AI() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function jI(e) {
	try {
		return e?.getItem(DI) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var MI = 2e3, NI = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? MI, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Rn, "reconnecting"), this.notice = this.notifications.show({
			message: w.text("ui.connection.reconnecting"),
			sticky: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Rn));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Rn, "lost");
	}
}, PI = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(FI(II(e)));
	}
	async dispatchAsync(e) {
		let t = II(e), n = FI(t);
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
function FI(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function II(e) {
	return e.action === void 0 ? {
		eventId: S(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var LI = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && oc(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = RI(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(zI([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(RI(e, t));
		let n = this.unplaced.get(zI(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = RI(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(zI([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = zI(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, zI(t.slice(0, e - 1)));
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
		return `${S(e.componentId)}:${e.propertyId}:${BI(t)}`;
	}
};
function RI(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function zI(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function BI(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var VI = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, HI = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, UI = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, WI = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, GI = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, KI = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, qI = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, JI = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, YI = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, XI = class {
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
var ZI = class {
	constructor() {}
	log(e, t) {}
};
ZI.instance = new ZI();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var QI = "10.0.11", q = class {
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
function $I(e, t) {
	let n = "";
	return tL(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${eL(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function eL(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function tL(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function nL(e, t, n, r, i, a) {
	let o = {}, [s, c] = oL();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${$I(i, a.logMessageContent)}.`);
	let l = tL(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function rL(e) {
	return e === void 0 ? new aL(K.Information) : e === null ? ZI.instance : e.log === void 0 ? new aL(e) : e;
}
var iL = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, aL = class {
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
function oL() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, sL(QI, cL(), uL(), lL())];
}
function sL(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function cL() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function lL() {
	if (J.isNode) return process.versions.node;
}
function uL() {
	return J.isNode ? "NodeJS" : "Browser";
}
function dL(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function fL() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var pL = class extends XI {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(fL());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new UI();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new UI();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new HI();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, tL(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new VI(await mL(i, "text") || i.statusText, i.status);
		let a = await mL(i, e.responseType);
		return new YI(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function mL(e, t) {
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
var hL = class extends XI {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new UI()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (tL(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new UI());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new YI(r.status, r.statusText, r.response || r.responseText)) : n(new VI(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new VI(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new HI());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, gL = class extends XI {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new pL(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new hL(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new UI()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, _L = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
_L.RecordSeparatorCode = 30, _L.RecordSeparator = String.fromCharCode(_L.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var vL = class {
	writeHandshakeRequest(e) {
		return _L.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (tL(e)) {
			let r = new Uint8Array(e), i = r.indexOf(_L.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(_L.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = _L.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var yL = class {
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
		return this.observers.push(e), new iL(this, e);
	}
}, bL = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			tL(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new xL(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, tL(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, xL = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, SL = 3e4, CL = 15e3, wL = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var TL = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? SL, this.keepAliveIntervalInMilliseconds = a ?? CL, this._statefulReconnectBufferSize = o ?? wL, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new vL(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new bL(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new UI("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new yL();
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
						this._logger.log(K.Error, `Invoke client method threw error: ${dL(e)}`);
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
							this._logger.log(K.Error, `Stream callback threw error: ${dL(e)}`);
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
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new UI("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
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
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${dL(t)}`);
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
}, EL = [
	0,
	2e3,
	1e4,
	3e4,
	null
], DL = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? EL : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, OL = class {};
OL.Authorization = "Authorization", OL.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var kL = class extends XI {
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
		e.headers ||= {}, this._accessToken ? e.headers[OL.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[OL.Authorization] && delete e.headers[OL.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var AL;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(AL ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var jL = class {
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
}, ML = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new jL(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, AL, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === AL.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = oL(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === AL.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new VI(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${$I(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new VI(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof HI ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? nL(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = oL();
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
			i ? i instanceof VI && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, NL = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, AL, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== AL.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = oL();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${$I(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? nL(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, PL = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, AL, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = oL();
				t[r] = i, n && (t[OL.Authorization] = `Bearer ${n}`), o && (t[OL.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === AL.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${$I(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${$I(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, FL = 100, IL = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = rL(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new kL(n.httpClient || new gL(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= AL.Binary, q.isIn(e, AL, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${AL[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new UI(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new UI(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new RL(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new UI("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < FL);
				if (r === FL && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof ML && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = oL();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new qI("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof VI && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new qI(t));
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new KI(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new UI(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new JI(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new PL(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new NL(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new ML(this._httpClient, this._logger, this._options);
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
		if (LL(t, i)) {
			if (e.transferFormats.map((e) => AL[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new WI(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${AL[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${AL[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new GI(`'${Z[i]}' is disabled by the client.`, i);
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
function LL(e, t) {
	return !e || (t & e) !== 0;
}
var RL = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new zL(), this._transportResult = new zL(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new zL(), this._transportResult.promise;
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
			this._sendBufferedData = new zL();
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
}, zL = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, BL = "json", VL = class {
	constructor() {
		this.name = BL, this.version = 2, this.transferFormat = AL.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = ZI.instance);
		let n = _L.parse(e), r = [];
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
		return _L.write(JSON.stringify(e));
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
}, HL = {
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
function UL(e) {
	let t = HL[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var WL = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), GL(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = UL(e);
			this.logger = new aL(t);
		} else this.logger = new aL(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new DL(e) : e : new DL(), this;
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
		let t = new IL(this.url, e);
		return TL.create(t, this.logger || ZI.instance, this.protocol || new VL(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function GL(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var KL = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, qL = class {
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
}, JL = class {
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
}, YL = 500;
function XL(e) {
	let { changes: t, ...n } = e;
	return n;
}
function ZL() {
	return {};
}
var QL = class {
	windowId;
	connection;
	started = !1;
	gate = new qL();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new JL(t), this.connection = new WL().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
			return t.fresh !== !0 && this.gate.markAttached(), t;
		} catch (e) {
			throw this.gate.failAttach(e), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, XL));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, XL));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, XL));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, ZL, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new KL(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, ZL));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), YL);
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
}, $L = "/_ne/values", eR = 3e4;
function tR(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function nR(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function rR(e, t = eR) {
	if (e === void 0 || !nR(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${$L}/${encodeURIComponent(n)}`, {
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
async function iR(e) {
	let t = await fetch($L, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(eR)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var aR = Promise.resolve(), oR = () => {}, sR = class {
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
		if (this.handed >= this.given) return aR;
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
		for (; this.flight !== null;) await this.flight.catch(oR);
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = tR(e.value), r = n === null ? null : iR(n);
		return r?.catch(oR), new Promise((i, a) => {
			let o = cR(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, lR(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof KL) {
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
		let t = this.transport.whenAttached().then(() => iR(e));
		return t.catch(oR), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function cR(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function lR(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var uR = "form-owner", dR = "ui-form-";
function fR(e) {
	return dR + e.replace(/[ \t\n\f\r]/g, "_");
}
function pR(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = fR(t);
	hR(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function mR(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(dR) && hR(e);
	}
}
function hR(e) {
	let t = gR();
	if (t.querySelector(`form[id="${b(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function gR() {
	let e = document.body.querySelector(`[${Tt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(Tt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var _R = document;
function vR() {
	try {
		return _R.execCommand("copy");
	} catch {
		return !1;
	}
}
function yR(e) {
	try {
		return typeof _R.execCommand == "function" && _R.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var bR = /* @__PURE__ */ new Map([
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
]), xR = [
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
	"overlay",
	"mark"
];
function SR(e) {
	return Q(e, xR);
}
var CR = [
	"small",
	"medium",
	"large"
], wR = ["default", "circle"], TR = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], ER = [
	"start",
	"center",
	"end",
	"justify"
], DR = ["nowrap", "wrap"], OR = /* @__PURE__ */ new Map([
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
	["overlay", "--ui-color-overlay"],
	["mark", "--ui-color-mark"]
]), kR = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), AR = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), jR = ["inline", "trailing"], MR = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], NR = [
	"small",
	"medium",
	"large"
], PR = [
	"small",
	"medium",
	"large"
], FR = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], IR = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], LR = ["light", "dark"], RR = [
	"start",
	"center",
	"end",
	"stretch"
], zR = ["clip", "visible"], BR = [
	"visible",
	"hidden",
	"collapsed"
], VR = [
	"background",
	"raised",
	"tinted"
], HR = ["horizontal", "vertical"], UR = [
	"none",
	"gap",
	"rule"
], WR = [
	"none",
	"one",
	"many"
], GR = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], KR = ["stack", "wrap"], qR = ["end", "start"], JR = [
	"disabled",
	"auto",
	"always"
], YR = [
	"disabled",
	"proximity",
	"mandatory"
], XR = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], ZR = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], QR = ["hex", "rgb"], $R = ["field", "swatch"], ez = [
	"fill",
	"contain",
	"cover",
	"none"
], tz = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], nz = ["default", "circle"], rz = ["uniform", "vignette"], iz = ["linear", "circular"], az = [
	"none",
	"vertical",
	"horizontal",
	"both"
], oz = [
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
], sz = [
	"None",
	"Shade",
	"Tint"
], cz = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, xR)}`],
	["themeColorClass", (e) => Bz(e)],
	["iconClass", (e) => Zd(e)],
	["iconUrlCss", (e) => Ud(e)],
	["safeUrl", (e) => kd(e)],
	["safeImageSource", (e) => Rd(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : qC(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, CR)}`],
	["iconShapeClass", (e) => Q(e, wR) === "circle" ? "ui-icon--circle" : ""],
	["textTypeClass", (e) => `ui-text-type--${Q(e, TR)}`],
	["textAppearanceClass", (e) => Yz(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, ER)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, DR)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, jR)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, IR)}`],
	["badgeTextFit", (e) => Vz(e)],
	["buttonClass", (e) => `ui-button--${Q(e, FR)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, VR)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, HR)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, UR)}`],
	["selectionModeAttribute", (e) => Q(e, WR)],
	["selectionBackgroundCss", (e) => Nz(Az(e, "background"))],
	["selectionForegroundCss", (e) => Nz(Az(e, "foreground"))],
	["selectionMarkColorCss", (e) => Nz(Az(e, "markColor"))],
	["selectionMarkCss", (e) => Mz(Az(e, "mark"))],
	["selectionFontWeightCss", (e) => jz(Az(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => Nz(Az(e, "actionBarBackground"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, KR)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, qR)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, JR)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, JR)}`],
	["hostViewport", (e) => bz(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, YR)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, MR)}`],
	["searchFieldAppearanceClass", (e) => `ui-search__field--${Q(e, MR)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, PR)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, NR)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, NR)}`],
	["textInputTypeAttribute", (e) => Q(e, XR)],
	["inputModeAttribute", (e) => Q(e, ZR)],
	["colorTextFormatAttribute", (e) => Q(e, QR)],
	["colorInputVariantAttribute", (e) => Q(e, $R)],
	["themeNameCss", (e) => Q(e, LR)],
	["alignmentCss", (e) => Q(e, RR)],
	["alignmentStretchFallbackCss", (e) => Q(e, RR) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, zR)],
	["layoutLengthCss", (e) => xz(e)],
	["thicknessCss", (e) => Cz(e)],
	["borderNoneClass", (e) => Tz(e)],
	["radiusCss", (e) => Ez(e)],
	["gridUnitCss", (e) => Dz(e)],
	["pixelsCss", (e) => aB(e)],
	["gridTemplateCss", (e) => Oz(e)],
	["colorVariantCss", (e) => $z(e)],
	["themeColorCss", (e) => Nz(e)],
	["themeInkCss", (e) => Fz(e)],
	["themeOnColorCss", (e) => Lz(e)],
	["themeColorInlineCss", (e) => Pz(e) ? "" : Nz(e)],
	["themeColorCanonical", (e) => Zz(e)],
	["textAppearanceFontSizeCss", (e) => Xz(e, "size")],
	["textAppearanceFontWeightCss", (e) => Xz(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Xz(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Xz(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => xz(U(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => xz(U(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => xz(U(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => xz(U(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => xz(U(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => Sz(U(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => Sz(U(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => Sz(U(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => Sz(U(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => Sz(U(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => Sz(U(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => Sz(U(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => Sz(U(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => Sz(U(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => Sz(U(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => Cz(U(e, "base"))],
	["responsiveThicknessSmCss", (e) => Cz(U(e, "sm"))],
	["responsiveThicknessMdCss", (e) => Cz(U(e, "md"))],
	["responsiveThicknessXlCss", (e) => Cz(U(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => Cz(U(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => wz(U(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => wz(U(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => wz(U(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => wz(U(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => wz(U(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => wz(U(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => wz(U(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => wz(U(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => wz(U(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => wz(U(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => oB(U(e, "base"))],
	["responsivePixelsSmCss", (e) => oB(U(e, "sm"))],
	["responsivePixelsMdCss", (e) => oB(U(e, "md"))],
	["responsivePixelsXlCss", (e) => oB(U(e, "xl"))],
	["responsivePixelsXxlCss", (e) => oB(U(e, "xxl"))],
	["visibilityBaseAttribute", (e) => sB(e, "base")],
	["visibilitySmAttribute", (e) => sB(e, "sm")],
	["visibilityMdAttribute", (e) => sB(e, "md")],
	["visibilityXlAttribute", (e) => sB(e, "xl")],
	["visibilityXxlAttribute", (e) => sB(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, ez)}`],
	["imageShapeClass", (e) => Q(e, nz) === "circle" ? "ui-image--circle" : ""],
	["backgroundImageCss", (e) => fz(e)],
	["backgroundImageAttribute", (e) => fz(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => Q(e, tz)],
	["backgroundImageDimCss", (e) => pz(e)],
	["backgroundImageDimModeAttribute", (e) => Q(e, rz) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => hz(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => hz(e) ? "" : void 0],
	["positiveCount", (e) => mz(e)?.toString()],
	["positiveFlagAttribute", (e) => mz(e) === void 0 ? void 0 : ""],
	["maxLinesClass", (e) => mz(e) === void 0 ? "" : "ui-text--max-lines"],
	["progressVariantClass", (e) => `ui-progress--${Q(e, iz)}`],
	["progressValueText", (e) => iB(e)],
	["textAreaResizeCss", (e) => Q(e, az)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, oz)}`],
	["popupPlacementAttribute", (e) => Q(e, oz)],
	["tabMenuEntriesAttribute", (e) => uz(e)],
	["markedDaysAttribute", (e) => dz(e)]
]), lz = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function uz(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = lz.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function dz(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function fz(e) {
	return Ud(e);
}
function pz(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function mz(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function hz(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var gz = [
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
], _z = new Map(gz.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), vz = new Map(gz.map(([e, t]) => [e, t])), yz = /* @__PURE__ */ new Map([[zR, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : yz.get(t)?.get(e)) ?? bR.get(e) ?? gr(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function bz(e) {
	return e == null || Q(e, JR) === "disabled" ? void 0 : "parent";
}
function xz(e) {
	if (e == null) return "";
	if (typeof e == "number") return aB(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? aB(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function Sz(e, t) {
	if (typeof e != "object" || !e) return xz(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? xz(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function Cz(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function wz(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return aB(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return aB(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function Tz(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function Ez(e) {
	if (e == null) return "";
	if (typeof e == "number") return aB(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? aB(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function Dz(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return aB(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function Oz(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return Dz(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return Dz(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${Dz(e[0])})` : e.map((e) => Dz(e)).join(" ");
}
function $(e, t, n) {
	return kz(U(e, t), n);
}
function kz(e, t) {
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
function Az(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function jz(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function Mz(e) {
	if (e == null) return "";
	switch (Q(e, GR)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function Nz(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Qz(e)) return $z(e);
	let t = e, n = $z(t.light), r = $z(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = OR.get(Q(o, xR));
	return s ? `var(${s})` : "";
}
function Pz(e) {
	if (typeof e != "object" || !e || Qz(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function Fz(e) {
	if (Pz(e)) {
		let t = kR.get(Q(e.style, xR));
		if (t !== void 0) return `var(${t})`;
	}
	return Nz(e);
}
var Iz = /* @__PURE__ */ new Set(["background", "surface"]);
function Lz(e) {
	if (typeof e != "object" || !e) return "";
	if (Qz(e)) return Rz(e) ? "initial" : zz(e);
	let t = e, n = zz(t.light ?? t.dark), r = zz(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && Rz(t.light ?? t.dark) && Rz(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, xR);
	if (Iz.has(i)) return "initial";
	let a = AR.get(i);
	return a ? `var(${a})` : "";
}
function Rz(e) {
	return eB(e)?.[3] === 0;
}
function zz(e) {
	let t = eB(e);
	return t === void 0 ? "" : kk(t[0], t[1], t[2], t[3]);
}
function Bz(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, xR)}`;
}
function Vz(e) {
	let t = Gz(e == null ? "" : String(e).trim(), Hz + 1);
	return t > 0 && t <= Hz ? "compact" : "";
}
var Hz = 2, Uz = /[\u0300-\uFFFF]/, Wz = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Gz(e, t) {
	if (!Uz.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of Wz.segment(e)) {
		if (n >= t) break;
		n += Kz(r) ? 2 : 1;
	}
	return n;
}
function Kz(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < qz.length; e += 2) if (t >= qz[e] && t <= qz[e + 1]) return !0;
	return !1;
}
var qz = [
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
function Jz(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Pe, Vz(n)), e.setAttribute(Fe, "");
}
function Yz(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, TR)}`;
}
function Xz(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return aB(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : aB(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : aB(e);
		}
		default: return "";
	}
}
function Zz(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = tB(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Ok(r.rgb >> 16 & 255)}${Ok(r.rgb >> 8 & 255)}${Ok(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Ok(e)}`;
	}
	let i = nB(r.name);
	return i === null ? "" : `${i}/${rB(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Qz(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function $z(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = eB(e);
	return t === void 0 ? "" : `#${Ok(t[0])}${Ok(t[1])}${Ok(t[2])}${Ok(t[3])}`;
}
function eB(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = nB(t.name), i = n ?? (r === null ? void 0 : _z.get(r));
	if (!i) return;
	let a = rB(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = W(c * (1 - o)), l = W(l * (1 - o)), u = W(u * (1 - o))) : a === "Tint" && (c = W(c + (255 - c) * o), l = W(l + (255 - l) * o), u = W(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function tB(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = xR[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function nB(e) {
	if (typeof e == "number") return vz.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function rB(e) {
	if (typeof e == "number") return sz[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function iB(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function aB(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function oB(e) {
	return e == null ? "" : aB(e);
}
function sB(e, t) {
	let n = hC(e, t);
	if (n == null) return;
	let r = Q(n, BR);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var cB = "ui-announcer", lB = 7e3, uB = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : w.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), lB), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${cB}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = cB, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, dB = "ui-notification-host", fB = "ui-notification", pB = "ui-notification--leaving", mB = "ui-notification__message", hB = "ui-notification__action", gB = "ui-notification__close", _B = 5e3, vB = 8e3, yB = "--ui-notification-lift", bB = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), xB = class {
	root;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? _B, this.ensureHost(), this.announcer = new uB(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = SR(e.severity), n = document.createElement("div");
		n.className = bB.has(t) ? `${fB} ${fB}--${t}` : fB, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = mB, typeof e.message == "string" ? r.textContent = e.message : w.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		i.type = "button", i.className = gB, w.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(wB(e.action, e.sticky === !0 ? null : () => this.dismiss(n)));
		let a = this.ensureHost();
		if (SB(a), a.append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
		let o = e.durationMs !== void 0 && e.durationMs > 0 ? e.durationMs : e.action === void 0 ? this.durationMs : vB, s = !1, c = !1, l = window.setTimeout(() => this.dismiss(n), o), u = () => window.clearTimeout(l), d = () => {
			s || c || (window.clearTimeout(l), l = window.setTimeout(() => this.dismiss(n), o));
		};
		return n.addEventListener("mouseenter", () => {
			s = !0, u();
		}), n.addEventListener("mouseleave", () => {
			s = !1, d();
		}), n.addEventListener("focusin", () => {
			c = !0, u();
		}), n.addEventListener("focusout", (e) => {
			e.relatedTarget instanceof Node && n.contains(e.relatedTarget) || (c = !1, d());
		}), n;
	}
	dismiss(e) {
		if (!(!e.isConnected || e.classList.contains(pB))) {
			if (e.classList.add(pB), this.returnFocus(e), Fc() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => CB(e), N.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(pB));
		Bs(Is(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${gB}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${dB}`), n = t ?? document.createElement("div");
		return n.classList.add(dB), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function SB(e) {
	let t = window.innerHeight - Tl(window.innerHeight);
	t > 0 ? e.style.setProperty(yB, `${Math.round(t)}px`) : e.style.removeProperty(yB);
}
function CB(e) {
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
function wB(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${hB} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : w.writeValue(n, null, e.label), n.addEventListener("click", () => {
		r || (e.run(), t !== null && (r = !0, t()));
	}), n;
}
function TB(e, t) {
	if (e == null || typeof e.id != "string" || e.id.length === 0) return;
	if (!sa(e.label) && !ca(e.label)) {
		s("a notification's action carries no words.", e);
		return;
	}
	let n = e.id;
	return {
		label: e.label,
		run: () => t(n)
	};
}
//#endregion
//#region src/effects/insert-text.ts
function EB(e, t, n) {
	let r = e.itemKey === !0 ? DB(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = OB(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	kB(i, r);
}
function DB(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function OB(e) {
	if (ao(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (ao(t)) return t;
	return null;
}
function kB(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || T(e) || D(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && yR(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function AB(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : jB(t, e.request?.parameters ?? null);
}
function jB(e, t) {
	let n = MB(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function MB(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, NB(e));
	return t.toString();
}
function NB(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function PB(e, t) {
	let n = IB([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return IB(r, t) ?? FB(t);
}
function FB(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && LB(t, e) ? t : null;
}
function IB(e, t) {
	let n = null;
	for (let r of e) if (jS(r, t)) {
		if (LB(r, t)) return r;
		n ??= r;
	}
	return n;
}
function LB(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var RB = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	runAction;
	valueReaders;
	reportTheme;
	navigate;
	address;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.runAction = e.runAction, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.address = e.address, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Fr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Fr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = AB(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Md(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = zr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(jn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = BB(e);
			t !== null && HB(t);
		}), this.register("ScrollTo", (e) => {
			let t = BB(e);
			if (t === null) return;
			let n = e.effect, r = Ir(n.behavior), i = Lr(n.block);
			t.scrollIntoView({
				behavior: VB(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = BB(e);
			if (t === null) return;
			let n = e.effect, r = WN(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Lr(n.block);
			iP(ho(r)), GN(r, n.key, i === "Unknown" ? "Start" : i, VB(Ir(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = BB(e);
			if (t === null) return;
			let n = e.effect, r = Br(n.axis) !== "Horizontal", i = PB(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Rr(n.position), u;
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
			let d = VB(Ir(n.behavior)), f = go(i);
			f !== null && XN(f), r && l === "End" && cP(i) && rP(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			zB(BB(e), null);
		}), this.register("Hide", (e) => {
			zB(BB(e), "hidden");
		}), this.register("Collapse", (e) => {
			zB(BB(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = UB(e, this.valueReaders);
			t !== null && WB(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = BB(e);
			t !== null && EB(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = BB(e);
			t !== null && !td(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Od(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!sa(t.message) && !ca(t.message)) {
				s("show notification effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("show notification effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : TB(t.action, this.runAction)
			});
		}), this.register("Announce", (e) => {
			let t = e.effect;
			if (!sa(t.message) && !ca(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Vr(t.politeness) === "Assertive" ? "assertive" : "polite");
		});
	}
	writeAddress(e, t) {
		let n = e.effect.parameters;
		if (this.address === void 0) {
			s(`${e.effect.kind} effect arrived but no address history is wired up.`, e.effect);
			return;
		}
		t(this.address, typeof n == "object" ? n : null);
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
function zB(e, t) {
	if (e !== null) for (let n of Xn) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function BB(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(S(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function VB(e) {
	return e === "Smooth" && !Fc() ? "smooth" : "auto";
}
function HB(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ss))) {
		e.focus();
		return;
	}
	let t = Cs(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function UB(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = BB(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Qa(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Ka(t.readHeld(r));
}
async function WB(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!GB(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function GB(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return vR();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var KB = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Cs(t), i = bs() && ao(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Ns(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Bs(Is(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Ml}="${b(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Pl}]`);
		if (n === null) return;
		let r = n.closest(`[${Ml}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Ml);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Zl() && !Vl(e.target) && !Fp(e.target)) {
				let n = t.getAttribute(Ml);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(y)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Ll(this.root);
	}
	trapTab(e, t) {
		let n = Ts(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Os(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, qB = "ui-leave", JB = new hf("data-ui-leave-part"), YB = "560px", XB = null, ZB = null;
function QB(e, t) {
	XB ??= $B();
	let n = XB;
	n.isConnected || document.body.append(n), eV(n, "title", w.text("ui.leave.title")), eV(n, "message", w.text("ui.leave.message")), eV(n, "stay", w.text("ui.leave.stay")), eV(n, "leave", w.text("ui.leave.confirm")), ZB = {
		dialogs: e,
		leave: t
	}, e.open(qB);
}
function $B() {
	let { dialog: e, surface: t } = mf({
		key: qB,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", YB);
	let n = JB.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = JB.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, JB.actions(JB.button("ui-button--outline", "stay"), JB.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = JB.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = ZB;
		ZB = null, n?.dialogs.close(qB), t === "leave" && n?.leave();
	}), e;
}
function eV(e, t, n) {
	let r = JB.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var tV = class {
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
		let t = nV(e, this.options.window.location.href);
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
function nV(e, t) {
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
	return Md(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var rV = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(jB(this.route, e), !1);
	}
	push(e) {
		let t = jB(this.route, e), n = this.window.location;
		this.write(t, t !== `${n.pathname}${n.search}`);
	}
	write(e, t) {
		t ? this.window.history.pushState(null, "", e) : this.window.history.replaceState(null, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location;
		if (e.pathname !== this.route) {
			this.load();
			return;
		}
		e.search !== this.search && (this.search = e.search, this.revisit(iV(e.search)));
	}
};
function iV(e) {
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
//#endregion
//#region src/updates/property-patch-engine.ts
var aV = class {
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
		!this.state.set(e, t, n, sV(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return za(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(ze), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, sV(r[0]?.component)) ? {
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
			(typeof n == "string" || ca(n) ? this.addressResolver.isTranslatable(t.reference) : sa(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Re}${gr(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of yr(e, t, () => oV(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(ze))), r = e.closest(y);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(ze)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			no(e);
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
function oV(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(y) === e) return [n];
	return [e];
}
function sV(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(y) ?? null, r = e === null ? 0 : C(e), i = n.getAttribute(g);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Yr(e, Jr(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var cV = "EndValue", lV = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Us) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = S(e.componentId), r = uV(n, e.propertyId), i = this.watchers.get(r);
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
		let n = ni(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(ot);
		for (let e of r) {
			if (t.metadata !== void 0 && t.metadata.getPropertyDefinition(e.propertyId)?.propertyName === cV !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = uV(S(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function uV(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function dV(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : C(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var fV = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, pV(t));
	}
	apply(e) {
		let t = S(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Mr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) mV(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) hV(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) gV(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) _V(n, t.key, t.newIndex);
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
function pV(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function mV(e, t) {
	typeof t.key == "string" && (hV(e, t.key), e.splice(vV(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function hV(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function gV(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		mV(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function _V(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(vV(n, e.length), 0, i);
}
function vV(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var yV = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, bV(e, "", t.map((e) => e.split("."))));
	}
	mark(e, t) {
		let n = this.byHost.get(e);
		if (n !== void 0) for (let e of t) this.markRecord(e.item, n);
	}
	markRecord(e, t) {
		if (!(typeof e != "object" || !e)) {
			if (Array.isArray(e)) {
				for (let n of e) this.markRecord(n, t);
				return;
			}
			this.records.set(e, t);
			for (let n of Object.keys(e)) {
				let r = t.members.get(n.toLowerCase());
				r != null && this.markRecord(e[n], r);
			}
		}
	}
	check(e, t) {
		let n = this.records.get(e);
		if (n === void 0 || n.members.has(t.toLowerCase())) return;
		let r = n.prefix + t, i = `${n.host}:${r}`;
		this.reported.has(i) || (this.reported.add(i), s("a row's item is read for a property the server does not send this host: nothing the compiled view has reads it. Bind it in the row's template, or name it on the host (AddItemReads, or ReadsWholeItems).", {
			host: n.host,
			path: r
		}));
	}
};
function bV(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (e.length === 0) continue;
		let t = e[0], n = t.toLowerCase(), i = r.get(n);
		i === void 0 && (i = {
			name: t,
			rest: [],
			whole: !1
		}, r.set(n, i)), e.length === 1 ? i.whole = !0 : i.rest.push(e.slice(1));
	}
	let i = /* @__PURE__ */ new Map();
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : bV(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function xV(e) {
	let t = new yV();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(S(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var SV = class {
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
};
//#endregion
//#region src/updates/collection-refill.ts
function CV(e, t) {
	let n = wV(e[t], "Reset");
	if (n === null) return null;
	let r = S(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = wV(e[s], "Insert");
		if (t === null || S(t.component?.id) !== r || !oc(i, t.component?.dynamicParameters ?? [])) break;
		if (a === null) {
			a = t.items ?? [];
			continue;
		}
		o ??= [...a];
		for (let e of t.items ?? []) o.splice(typeof e.index == "number" && e.index >= 0 && e.index < o.length ? e.index : o.length, 0, e);
		a = o;
	}
	return a === null ? null : {
		componentId: r,
		dynamicParameters: i,
		items: a,
		length: s - t
	};
}
function wV(e, t) {
	if (e === void 0 || Pr(e) !== "CollectionChange") return null;
	let n = e;
	return Mr(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var TV = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function EV(e, t, n, r) {
	return {
		action: Mr(e.action),
		component: t,
		componentId: n,
		dynamicParameters: r,
		items: (e.items ?? []).map((e) => ({
			key: e.key ?? null,
			oldKey: e.oldKey ?? null,
			index: e.index ?? null,
			item: e.item ?? null
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
var DV = [], OV = class {
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
	held = new fV();
	projections;
	moves = new SV({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = xV(e), this.projections.isEmpty || K_((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${_}]`)) {
			let e = ni(n);
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
			return n === void 0 && (n = FV(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${_}]`)) {
			let t = ri(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Pr(t) !== "CollectionChange") continue;
			let e = t;
			if (Mr(e.action) !== "Insert") continue;
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
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, PV(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of dV(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${_}]`)) {
			let t = ni(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		Dj(e, t, {
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
				let r = CV(t, e);
				if (r === null || this.namesSink(r)) {
					this.applyUpdate(n);
					continue;
				}
				e += r.length - 1, this.applyCollectionRefill(r);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Ge) === !0;
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
		this.moves.around(e, DV, () => this.refillHostRows(e, t));
	}
	refillHostRows(e, t) {
		if (yv(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = FV(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && oc(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), NV(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (Pr(e)) {
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
		let t = S(e.address?.component?.id), n = Nr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		} : i, r, e.value ?? null, !1);
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
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, EV(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Mr(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Mr(e.action) === "Move" ? jV(e.moves ?? []) : DV;
		for (let n of o) a && this.held.isWaiting(n) || this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (yv(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (Mr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				kV(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				MV(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Ov(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = yv(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : Sv(e, R(e)).findIndex((e) => e.getAttribute(g) === t);
		return n < 0 ? null : n + bv(e);
	}
	moveRow(e, t, n) {
		let r = ni(e);
		if (r === null) return;
		let i = Math.max(0, n - bv(e));
		yv(e) === "virtualized" ? this.virtualization.move(e, t, i) : MV(e, [{
			key: t,
			newIndex: i
		}]), this.syncItemsHost(e, r), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (Mr(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Mr(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${_}]`)) if (ni(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Sv(e, R(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, wv(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return tI(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = R(e), a = Sv(e, i), o = FV(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, wv(a, l, i.index ?? null)) : (Dv(a, c, l), c.replaceWith(l)));
		}
	}
};
function kV(e, t) {
	let n = R(e), r = Sv(e, n), i = FV(e, n), a = AV(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? os(a, o, n) : null;
		i.delete(t), Tv(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function AV(e) {
	let t = e.parentElement, n = t?.closest(k) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function jV(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function MV(e, t) {
	let n = R(e), r = Sv(e, n), i = FV(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Ev(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function NV(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? R(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function PV(e) {
	let t = C(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : C(n);
}
function FV(e, t = R(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(g);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function IV(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return sa(n) || ca(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: RV(t.severity)
	} : void 0;
}
function LV(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = w.resolve(sa(t) || ca(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function RV(e) {
	let t = kr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var zV = "ui-validation--warning", BV = "ui-validation--info", VV = "ui-validation-message--marker", HV = "top-end", UV = "right", WV = "--ui-validation-marker-host", GV = "ui-validation-mark", KV = "--ui-validation-presentation", qV = "--ui-validation-color", JV = "Validation", YV = /* @__PURE__ */ new Set(["Value", "EndValue"]), XV = /* @__PURE__ */ new Set(["Min", "Max"]), ZV = `input:not([type='hidden']), textarea, select, .${sr}[role='combobox'], [role='spinbutton']`, QV = {
	Error: 0,
	Warning: 1,
	Info: 2
}, $V = {
	Error: pr,
	Warning: zV,
	Info: BV
}, eH = `.${pr}, .${zV}, .${BV}`, tH = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, nH = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, rH = {
	Error: `${GV}--error`,
	Warning: `${GV}--warning`,
	Info: `${GV}--info`
}, iH = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, aH = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundRefusalByElement = /* @__PURE__ */ new WeakMap();
	boundRefused = /* @__PURE__ */ new Set();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	packageMarkByElement = /* @__PURE__ */ new WeakMap();
	renderedRead = /* @__PURE__ */ new WeakSet();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.root.addEventListener("change", (e) => {
			e.target instanceof Element && this.refusesBounds(e.target);
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(eH)), P(this.root, eH, { childList: !0 }, (e) => this.applyRenderedMessages(e)), w.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(eH)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), w.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(eH)) {
			let t = C(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.failingRulesByElement.delete(i), o = this.refusalByElement.delete(i), s = this.boundRefusalByElement.has(i), c = this.options.metadata.getValidationsForComponent(r), l = t ?? (cH(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(i));
		if (this.forgetBoundRefusal(i), c.length > 0) {
			this.touchedElements.add(i), this.evaluateAndApply(r, i, c, l);
			return;
		}
		(a || o || s) && this.applyCurrentState(r, i);
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			dH(t, lH(t) === "Error");
			let e = t.querySelector(`:scope > [${mr}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), fH(this.markerMirrors, t, e, {
				message: n,
				severity: lH(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(C(e), e) !== void 0)) return;
		let n = Fa(t), r = lH(e);
		this.boundMessageByElement.set(e, n === null ? {
			message: t.textContent ?? "",
			severity: r,
			content: !0
		} : {
			message: n,
			severity: r
		});
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === JV) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = YV.has(e.propertyName), n = XV.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(C(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(C(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = S(e.reference.componentId), n = IV(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = S(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Or(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = S(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = sa(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: RV(e.severity),
			content: e.content === !0,
			property: Nr(e.address?.property)
		}), this.touchedElements.add(a)) : this.refusalByElement.delete(a), this.applyCurrentState(t, a);
	}
	isRefused(e) {
		return this.refusalByElement.has(e) || this.boundRefusalByElement.has(e);
	}
	refusesBounds(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		return t !== null && this.judgeBounds(t.componentId, t.element);
	}
	judgeBounds(e, t) {
		let n = D(t) || T(t) ? null : oH(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return sH(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(C(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: iH[t]
		}), this.applyCurrentState(C(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(C(e))) if (RV(r.severity) === "Error" && Sc(t, r.operator, r.value) && !Sc(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Sc(t, r.operator, r.value) && (n === null || QV[RV(r.severity)] < QV[RV(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: nH[RV(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, cH(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		uH(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(LV).join("\n"), !0);
	}
	rewriteMessageLines() {
		for (let e of this.messageLines.values()) this.writeLines(e);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.boundRefusalByElement.get(t), i = this.refusalByElement.get(t), a = this.boundMessageByElement.get(t), o = this.packageMarkByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i), a !== void 0 && n.push(a), o !== void 0 && n.push(o);
		let s = this.failingRulesByElement.get(t);
		if (s !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) s.has(t) && n.push({
			message: t.message,
			severity: RV(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || QV[e.severity] < QV[c.severity]) && (c = e);
		return c;
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Or(e.trigger) === t);
		if (r.length === 0) return;
		let i = cH(e.target) ? this.options.valueReaders.readBound(e.target) : this.options.valueReaders.readHeld(n.element);
		this.evaluateAndApply(n.componentId, n.element, r, i);
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${wt}="${b(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Or(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1, this.touchedElements.has(t.element) || (this.touchedElements.add(t.element), this.applyCurrentState(t.componentId, t.element)));
		}
		return n;
	}
	focusFirstInvalid(e) {
		for (let t of this.root.querySelectorAll(`[${wt}="${b(e)}"]`)) {
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			if (e === null || !e.element.classList.contains("ui-invalid")) continue;
			let n = [...e.element.querySelectorAll(ZV)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (n !== null) return n.focus({ preventScroll: !0 }), n.scrollIntoView({
				block: "center",
				behavior: Fc() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && RV(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Sc(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function oH(e, t) {
	return N_(e, t) ?? (e.matches(Xv) ? Hy(e) : null);
}
function sH(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : sa(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function cH(e) {
	return !e.hasAttribute("data-ui-draft") && (e.hasAttribute("data-ui-value-kind") || e.matches("input, textarea, select"));
}
function lH(e) {
	return e.classList.contains(zV) ? "Warning" : e.classList.contains(BV) ? "Info" : "Error";
}
function uH(e, t, n) {
	for (let e of Object.values($V)) t.classList.toggle(e, n !== void 0 && $V[n.severity] === e);
	dH(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(qV) : r.style.setProperty(qV, `var(--ui-color-${tH[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Na(i, null), i.textContent = String(n.message ?? "")) : w.writeValue(i, null, n?.message ?? null), fH(e, r, i, n));
}
function dH(e, t) {
	for (let n of e.querySelectorAll(ZV)) {
		let r = n.closest(or);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function fH(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(KV).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(VV, o), pH(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(WV).trim()), r !== void 0 && o) {
		n.setAttribute(ke, n.textContent ?? ""), n.setAttribute(Ae, HV), n.setAttribute(Me, nH[r.severity]), t.setAttribute(je, ""), t.contains(document.activeElement) ? hT(n) : gT(n);
		return;
	}
	n.removeAttribute(ke), n.removeAttribute(Ae), n.removeAttribute(Me), t.removeAttribute(je), gT(n);
}
function pH(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : hH(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && mH(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${GV} ${rH[n.severity]}`, s.textContent = r, s.setAttribute(ke, r), s.setAttribute(Ae, UV), s.setAttribute(Me, nH[n.severity]), s.setAttribute(Ne, ""), s.parentElement !== o && (mH(s), o.append(s)), o.setAttribute(je, ""), e.set(t, s), gT(s);
}
function mH(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${GV}`) === null && t.removeAttribute(je);
}
function hH(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var gH = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, _H = "tooltip-name";
function vH(e, t, n) {
	let r = qC(e.getAttribute(ke));
	if (Na(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var yH = /* @__PURE__ */ new WeakMap(), bH = /* @__PURE__ */ new Map([["iconClass", Xd]]), xH = /* @__PURE__ */ new WeakMap(), SH = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ar(e), t);
	}
	apply(e) {
		let t = Ar(e.operation.kind), n = this.handlers.get(t);
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
			let t = Ka(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Na(e.target, null);
		}), this.register("Markup", (e) => {
			YC(e.target, qa(e.convertedValue) ? "" : Ka(e.convertedValue)), Na(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = kH(e.operation);
			if (Na(e.target, t), qa(e.value) || qa(e.convertedValue)) {
				OH(e.target, t);
				return;
			}
			DH(e.target, t, Ka(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = kH(e.operation);
			Na(e.target, t), OH(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = kH(e.operation), n = !qa(e.value) && CH(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (qa(e.convertedValue) ? "" : Ka(e.convertedValue));
			wH(e.target, EH(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !qa(e.value) && CH(e.value, e.operation.condition ?? "None") ? Ka(e.convertedValue).trim() : "";
			TH(e.target, EH(e), t, bH.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = kH(e.operation), n = !qa(e.value) && CH(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Ka(e.convertedValue).trim() : "";
				TH(e.target, EH(e), t);
			}
		}), this.register("Style", (e) => {
			let t = kH(e.operation), n = e.target;
			if (qa(e.value) || qa(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Ka(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(_H, (e) => vH(e.resolved.component, e.target, kH(e.operation))), this.register(uR, (e) => pR(e.target, e.value)), this.register("Property", (e) => {
			let t = kH(e.operation), n = e.target, r = qa(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function CH(e, t) {
	switch (jr(t)) {
		case "None": return !0;
		case "HasValue": return !qa(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !qa(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Zd(e).length > 0;
		default: return !qa(e);
	}
}
function wH(e, t, n, r, i) {
	let a = xH.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), xH.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), DH(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && OH(e, n);
}
function TH(e, t, n, r) {
	let i = yH.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), yH.set(e, i));
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
function EH(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function DH(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function OH(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function kH(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var AH = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => cz.has(e.name),
			convert: (e) => cz.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = jH(e.name), n = {
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
function jH(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var MH = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Hr(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Hr(e.domEventName) || t;
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
		return this.definitions.get(Hr(e));
	}
};
function NH(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function PH(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(is, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => NH(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => NH(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var FH = class {
	converters = new AH();
	events = new MH();
	operations = new SH();
	valueReaders;
	collectionSinks = new TV();
	rowDecorators = new gH();
	constructor(e, t, n, r) {
		PH(this.events), this.valueReaders = new Ya(r);
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
}, IH = "Submenu", LH = "ui-menu__submenu", RH = "Select", zH = {
	kind: "menu",
	decorate: BH
};
function BH(e) {
	if (!VH(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, IH);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Ot, ""), HH(e.item, "Kind") === RH && e.row.setAttribute(kt, ""), HH(e.item, "Expanded") === !0 && e.row.setAttribute(At, "");
	let r = document.createElement("div");
	r.className = LH, r.appendChild(n), _F(r, e.key, e.item), e.row.appendChild(r);
}
function VH(e) {
	let t = HH(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function HH(e, t) {
	let n = $_(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var UH = {
	kind: "grip",
	decorate: WH
};
function WH(e) {
	e.row.append(GH());
}
function GH() {
	let e = document.createElement("span");
	return e.className = ge, e.setAttribute("role", "button"), w.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function KH(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(JH(n));
	for (let t of e.querySelectorAll(`[${Je}]`)) qH(t, qe, r), qH(t, Qe, i);
}
function qH(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function JH(e) {
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
var YH = 2;
function XH(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= YH && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function ZH(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var QH = "ne.standard.ui.windowId", $H = [
	500,
	1e3,
	2e3
], eU = 3, tU = [
	["refusal", ({ root: e }) => YP(e)],
	["file input", ({ root: e, validation: t }) => new ld({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new hp({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new jp({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e }) => new rm({ root: e })],
	["field box press", ({ root: e }) => new Xp({ root: e })],
	["image fallback", ({ root: e }) => new um({ root: e })],
	["radio group sync", ({ root: e }) => new bm({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Vh({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Jm({ root: e })],
	["debounced commit", ({ root: e }) => new og({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new $h({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => lg() ? void 0 : new ug({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new Wj({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Lg({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new iA({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new Hb({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new hx({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new Dx({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new bN({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new VN({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new hS({ root: e })],
	["split button", ({ root: e }) => new CO({ root: e })],
	["toggle button", ({ root: e }) => new Rp({ root: e })],
	["button group", ({ root: e }) => new kO({ root: e })],
	["menu", ({ root: e }) => new TT({ root: e })],
	["action bar", ({ root: e }) => new qS({ root: e })],
	["collapsible", ({ root: e }) => new OD({ root: e })],
	["menu group", ({ root: e }) => new AC({ root: e })],
	["menu search", ({ root: e }) => new $E({ root: e })],
	["side drawer", ({ root: e }) => new _D({ root: e })],
	["skip link", ({ root: e }) => new SD({ root: e })],
	["screen keyboard", () => new uD()],
	["grid splitter", ({ root: e }) => new lO({ root: e })],
	["accordion", ({ root: e }) => new NO({ root: e })],
	["tabs", ({ root: e }) => new ik({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new ZM({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new pk({ root: e })],
	["breadcrumbs", ({ root: e }) => new Ek({ root: e })],
	["scroll anchor", ({ root: e }) => new aP({ root: e })],
	["surface press", ({ root: e }) => new pP({ root: e })],
	["text selection", ({ root: e }) => new yP({ root: e })],
	["scroll group", ({ root: e }) => new EP({ root: e })],
	["flyout interaction", ({ root: e }) => new xu({ root: e })],
	["text fold", ({ root: e }) => new dN({ root: e })],
	["tooltip", ({ root: e }) => Bw(e)]
], nU = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new xr(yI());
	hydration = CI();
	renderSequence = this.hydration?.sequence ?? null;
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
	connection;
	heldRuntime = null;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = oU(e.windowIdStorageKey ?? QH), this.dom = new ti(this.root), w.load(this.root), w.setLanguage(document.documentElement.lang), e.strings !== void 0 && w.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : w.loadTableAsync(this.hydration.words.href)), this.extensions = new FH(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(zH), this.extensions.registerRowDecorator(UH);
		let t = new qr(this.dom, this.metadata), n = this.extensions.operations, r = new LI(), i = new aV(t, n, this.extensions, r);
		this.reactiveSources = new lV(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new KB({ root: this.root }), this.notifications = new xB({ root: this.root });
		let a = new rV({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		});
		this.effects = new RB({
			address: a,
			dialogs: this.dialogs,
			notifications: this.notifications,
			runAction: (e) => void this.eventPipeline.dispatchCommandAsync({
				eventId: 0,
				action: e,
				dynamicParameters: []
			}).catch((e) => s("running a notification's action failed.", e)),
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e)
		});
		let o = new kc(this.metadata), u, d = new gc(o, i, new xc(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				u?.syncPropertyAsync(S(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), f = new hI(this.dom), p = new pF(this.metadata, f, this.extensions, n, r);
		this.virtualization = new aI({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new OV(this.metadata, i, r, p, f, this.dom, this.virtualization, this.extensions.collectionSinks), w.onChange(() => this.rewriteWords(i, p)), this.rewriteMoments = () => this.rewriteWords(i, p, !0), w.onMomentTick(this.rewriteMoments), new CF({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new QL(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new PI(this.transport), w.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(br.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(br.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				_I(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && _I(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let m = new sR(this.transport);
		u = new Js({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: m,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => ee.refusesBounds(e)
		}), i.setHeldTargets((e) => u?.isHeld(e) === !0), this.effects.register(br.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of u?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		}), this.leaveGuard = new tV({
			window,
			ask: async (e) => (await u?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => QB(this.dialogs, t),
			pending: () => ig() || m.isBusy,
			settle: async () => {
				ag(), await m.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(br.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Md(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let ee = new aH({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			propertyPatchEngine: i,
			updateProcessor: this.updateProcessor,
			valueReaders: this.extensions.valueReaders,
			readValue: (e) => this.readPluginValue(e)
		});
		this.engineContext = {
			root: this.root,
			dom: this.dom,
			propertyPatchEngine: i,
			effects: this.effects,
			validation: ee,
			dialogs: this.dialogs
		};
		for (let [e, t] of tU) XH(e, t, this.engineContext);
		XH("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new j_({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), XH("tree", ({ root: e, effects: t }) => new CM({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: p
			}
		}), this.engineContext), XH("items reorder", ({ root: e }) => new Rv({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), XH("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new BP({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", C(e)) || d.hasEventForComponent("click", C(e))
		}) : void 0, this.engineContext), this.eventPipeline = new nc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: d,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: ee,
			valueBinding: u
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...o.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(YM.name, YM.registration);
		let h = Iv(this.updateProcessor.moves);
		this.eventPipeline.addEvent(h.name, h.registration), this.eventPipeline.addEvent(tm.name, tm.registration), XH("shortcuts", ({ root: e, dom: t }) => new qT({
			root: e,
			viewShortcuts: JT(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), this.tables = new QA({ root: this.root }), this.windows = new zF({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), XH("pager", ({ root: e, dom: t }) => new PE({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: w,
			observeComponents: P,
			observeSize: CA,
			store: new yC(),
			numbers: d_,
			temporal: Hi,
			icons: { apply: Jd },
			badges: { writeCount: Jz },
			urls: {
				isImageSource: Id,
				asBrowserReads: Fd,
				isSafeLink: Od,
				isExternalLink: jd
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => u?.hold(e),
				release: (e) => {
					u?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(y), a = r === null ? void 0 : this.metadata.getExposedProperty(C(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: mT,
			renames: { open: Hl },
			tables: this.tables,
			rows: fF(f, p, this.virtualization),
			uploads: Qu(ee),
			selection: Vo,
			popups: dF,
			roving: uo,
			focus: ws,
			states: Ga,
			validation: ee,
			wheel: Cf,
			shortcuts: RT,
			names: hr
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
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new NI({
			root: document.documentElement,
			connection: this.transport,
			notifications: this.notifications
		});
	}
	gateInbound(e) {
		if (e === null) return;
		let t = e.then(() => void 0, () => void 0);
		this.inbound = t, t.then(() => {
			this.inbound === t && (this.inbound = null);
		});
	}
	readPluginValue(e) {
		let t = Qa(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
	}
	async navigateInPlaceAsync(e) {
		try {
			let t = await this.transport.navigateInPlaceAsync(e);
			this.effects.applyAll(t.command?.effects, this.dom), this.windows.reconsider();
		} catch (e) {
			s("telling the page's controller about the history entry failed.", e);
		}
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
		this.dom.invalidate(), w.language !== this.culturesLanguage && (this.culturesLanguage = w.language, Ra(this.root, (e) => KH(e, w.number, w.temporal)));
		let i = n ? da : void 0;
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
		Ra(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = S(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${oe}="${b(n)}"]`)) Zr(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Zr(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
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
		let t = OI(e, navigator.cookieEnabled, AI());
		if (t === "no-cookie") {
			c("the server asked for a reload, and this browser keeps no cookie the reload could write; giving up.", { view: e });
			return;
		}
		if (t === "asked-again") {
			c("the server asked for a reload again after one (another compile of the view, or a session cookie the browser does not keep); giving up.", { view: e });
			return;
		}
		s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	reloadForFreshRuntime(e) {
		if (OI(e, navigator.cookieEnabled, AI()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ne(this, this.options.handlerGlobalKey), mR(this.root), await aU();
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
		return Ma(this.root) || SI(this.hydration) || this.metadata.getWords().some((e) => da(e.key)) || da(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) XH(ZH(t), t, this.pluginContext);
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
		XH(ZH(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !nR(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), rR(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= eU) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (kI(AI()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(nR(e) ? await rR(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = cU(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? iV(window.location.search) : e.parameters,
			timeZone: EI()
		};
		return this.renderSequence = null, await TI(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, $H, iU);
	}
};
async function rU(e = {}) {
	let t = performance.now(), n = new nU(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function iU(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function aU() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function oU(e) {
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
	let n = sU();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function sU() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function cU() {
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
te(), rU().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
