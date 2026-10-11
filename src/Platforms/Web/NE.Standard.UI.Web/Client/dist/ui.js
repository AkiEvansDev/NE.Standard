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
	r[i] <= r.warn && h(console.warn, e, t);
}
function c(e, t) {
	r[i] <= r.error && h(console.error, e, t);
}
function l(e, t) {
	r[i] <= r.debug && h(console.debug, e, t);
}
function u() {
	return r[i] <= r.debug;
}
function d(e, t, n) {
	r[i] <= r.debug && h(console.debug, `${e} in ${f(performance.now() - t)}.`, n);
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
function h(e, n, r) {
	r === void 0 ? e(`${t} ${n}`) : e(`${t} ${n}`, r);
}
//#endregion
//#region src/runtime/global-api.ts
var ee = 4;
function g() {
	return ne();
}
function te(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ne();
	n.runtime = e, re(e, n);
}
function ne() {
	let e = window.NEStandardUI ?? {}, t = e.__pending ?? [], n = (e, n = !1) => {
		let r = window.NEStandardUI?.runtime;
		r === void 0 ? t.push({
			apply: e,
			engine: n
		}) : e(r);
	}, r = {
		...e,
		contractVersion: ee,
		__pending: t,
		registerEvent(e, t = {}) {
			n((n) => n.addEvent(e, t));
		},
		registerConverter(e, t) {
			let r = ie(e, t);
			n((e) => e.addConverter(r));
		},
		registerDomOperation(e) {
			n((t) => t.addDomOperation(e));
		},
		registerEffect(e) {
			n((t) => t.addEffect(e));
		},
		registerValueReader(e) {
			n((t) => t.addValueReader(e));
		},
		registerCollectionSink(e) {
			n((t) => t.addCollectionSink(e));
		},
		registerStrings(e) {
			n((t) => t.addStrings(e));
		},
		registerEngine(e) {
			n((t) => t.addEngine(e), !0);
		},
		setLogLevel(e) {
			a(e);
		},
		getLogLevel() {
			return o();
		}
	};
	return window.NEStandardUI = r, r;
}
function re(e, t) {
	let n = t.__pending ?? [];
	t.__pending = [];
	for (let t of n) t.engine || t.apply(e);
	for (let t of n) t.engine && t.apply(e);
}
function ie(e, t) {
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
var ae = "data-ui-id", oe = "data-ui-context", se = "data-ui-pc", _ = "data-ui-key", ce = "data-ui-unselectable", le = "data-ui-undraggable", ue = "data-ui-unremovable", de = "data-ui-unrenamable", fe = "data-ui-no-context-menu", pe = "data-ui-no-row-open", me = "data-ui-no-row-drag", he = "data-ui-drag-kind", ge = "data-ui-drag-source", _e = "data-ui-item-drop-over", ve = "data-ui-drop-boxed", ye = "ui-row__grip", be = "data-ui-row-drop", xe = "data-ui-tabs-none-removable", Se = "data-ui-tabs-draggable", Ce = "data-ui-tabs-menu", we = "data-ui-context-menu", Te = "data-ui-context-menu-owner", Ee = "data-ui-context-menu-use", De = "data-ui-action-bar", Oe = "data-ui-action-bar-key", ke = "data-ui-action-bar-rest", Ae = "data-ui-menu-left-out", je = "data-ui-in-action-bar", Me = "ui-action-bar", Ne = "data-ui-row-focus", Pe = "data-ui-row-cursor-waits", Fe = "data-ui-tab-out", Ie = "data-ui-cell-focus", Le = "ui-cell-key", Re = "data-ui-tooltip", ze = "data-ui-tooltip-placement", Be = "data-ui-tooltip-mark", Ve = "data-ui-tooltip-severity", He = "data-ui-tooltip-press", Ue = "data-ui-badge-text", We = "data-ui-badge-set", Ge = "data-ui-folds", Ke = "data-ui-name", qe = "data-ui-bind-", Je = "data-ui-into-", Ye = "data-ui-bind-value", Xe = (e) => `data-ui-no-${e}`, Ze = "data-ui-event-boundary", Qe = "data-ui-image-caption", $e = "data-ui-image-crop", et = "data-ui-image-crop-size", tt = "ui-image", nt = "data-ui-fallback-src", rt = "data-ui-image-failed", v = "data-ui-items-host", it = "data-ui-collection-sink", at = "data-ui-items-query", ot = "data-ui-number-culture", st = "data-ui-page-culture", ct = "data-ui-pager-target", lt = "data-ui-pager-page", ut = "data-ui-pager-size", dt = "data-ui-temporal-culture", ft = "data-ui-temporal", pt = "ui-timestamp", mt = "ui-timestamp__text", ht = "data-ui-timestamp-format", gt = "data-ui-empty-template", _t = "data-ui-group-template", vt = "data-ui-empty-placeholder", yt = "data-ui-group-header", bt = "data-ui-group-anchor", xt = "data-ui-group", St = "data-ui-value-holder", Ct = "data-ui-value-end", wt = "data-ui-value-kind", Tt = "items-query", Et = "data-ui-host-mode", Dt = "data-ui-host-viewport", Ot = "data-ui-scroll-group", kt = "data-ui-scroll-lines", At = "data-ui-source-line", jt = "data-ui-window-spacer", Mt = "data-ui-window-pending", Nt = "data-ui-window-paged", Pt = "data-ui-window-size", Ft = "data-ui-window-offset", It = "data-ui-window-total", Lt = "data-ui-window-more-before", Rt = "data-ui-window-more-after", zt = "data-ui-window-group-before", Bt = "data-ui-window-aggregates", Vt = "data-ui-form-id", Ht = "data-ui-forms", Ut = "data-ui-visibility", Wt = "data-ui-collapsed", Gt = "data-ui-menu-group", Kt = "data-ui-menu-select", qt = "data-ui-menu-open", Jt = "data-ui-menu-holds-current", Yt = "data-ui-menu-icons", Xt = "data-ui-menu-passive", Zt = "data-ui-menu-item-shortcut", Qt = "data-ui-menu-surface", $t = "data-ui-menu-search", en = "data-ui-menu-searching", tn = "data-ui-menu-unmatched", nn = "data-ui-drawer-toggle", rn = "data-ui-drawer-open", an = "data-ui-drawer-switch", on = "data-ui-drawer-switch-row", sn = "data-ui-side-drawers", cn = "data-ui-drawer-pin";
function ln(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var un = "data-ui-bottom-bar", dn = "data-ui-rail-drawer", fn = "data-ui-content-fills", pn = "data-ui-region", mn = "data-ui-menu-item-kind", hn = "ui-menu", y = "ui-menu-item", gn = "ui-menu-item--checked", _n = "ui-menu-item--selected", vn = "ui-menu--rail", yn = "ui-menu--nested", bn = `[${mn}="header"], [${mn}="separator"]`, xn = `[${Gt}] > .${y}`, Sn = `.${y}:not(${bn})`, Cn = `${xn}, .${y}[${mn}="check"]`, wn = "data-ui-shortcut", Tn = "data-ui-collapse-toggle", En = "data-ui-folding", Dn = "data-ui-column-limits", On = "data-ui-row-limits", kn = "data-ui-splitter-step", An = "data-ui-splitter-position", jn = "data-ui-pane-layout", Mn = "data-ui-pane", Nn = "data-ui-table-column", Pn = "data-ui-table-hide-below", Fn = "data-ui-table-starts-hidden", In = "data-ui-table-hidden", Ln = "ui-table__row", Rn = "ui-table__scroll", zn = "ui-table__header", Bn = "ui-table__resizer", Vn = "ui-tree", Hn = "ui-tree__row", Un = "ui-tree-node", Wn = "data-ui-tree-drop", Gn = "ui-tree__row--filtered", Kn = "data-ui-table-last", qn = "data-ui-table-reordering", Jn = "data-ui-table-dragging", Yn = "data-ui-table-drop", Xn = "data-ui-table-scrolled", Zn = "data-ui-table-scrollbar", Qn = "data-ui-no-row-select", $n = "data-ui-tree-parent", er = "data-ui-tree-children", tr = "data-ui-tree-folder", nr = "data-ui-tree-expanded", rr = "data-ui-tree-title", ir = "data-ui-tree-loading", ar = "data-ui-tree-drop-target", or = "data-ui-tree-boot", sr = "data-ui-tree-draggable", cr = "data-ui-row-editing", lr = "data-ui-boxed-editor", ur = "data-ui-row-idle", dr = "data-ui-step-collapsed", fr = "data-ui-step-end", pr = "data-ui-row-bar", mr = "data-ui-image-source", hr = "data-ui-file-max-size", gr = "data-ui-file-pick", _r = "data-ui-file-drop-target-id", vr = "data-ui-service-worker", yr = "data-ui-theme", br = "data-ui-theme-colors", xr = "data-ui-words", Sr = "#text", Cr = "data-ui-language-switcher", wr = "data-ui-language", Tr = "data-ui-splitting", Er = "data-ui-keyboard-up", Dr = "data-ui-connection", Or = "data-ui-split-folded", kr = "data-ui-split-edge", Ar = "data-ui-pointer-focus", jr = "data-ui-focus-within", Mr = "data-ui-popup-hover", Nr = "data-ui-inner-pointer", Pr = "data-ui-selection", Fr = "data-ui-selected", Ir = "data-ui-selected-key", Lr = "data-ui-selected-keys", Rr = "data-ui-bind-selected-key", zr = "data-ui-tabs-selected", Br = "data-ui-tab-caption", Vr = "data-ui-tab-pinned", Hr = [
	Ut,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Ur = "data-ui-submit-form-id", b = `[${ae}]`, Wr = "data-ui-href", Gr = "ui-disabled", Kr = "ui-loading", qr = "ui-readonly", Jr = "ui-hidden", Yr = "ui-dialog__surface", Xr = "ui-flyout__content", Zr = `.ui-context-menu, .ui-split-button__menu, .${Xr}`, Qr = "data-ui-focus-holder", $r = "data-ui-owns-keys", ei = "[role='listbox'], [role='menu'], [role='dialog']", ti = "ui-select__trigger", ni = `.${ti}`, ri = "ui-button", ii = `${ri} ui-button--ghost ui-button--small`, ai = "ui-select", oi = "data-ui-text-title", si = "data-ui-text-description", ci = "data-ui-text-icon", li = "data-ui-text-badge-icon", ui = "data-ui-text-badge-text", di = "ui-card__header--empty", fi = "ui-text-input", pi = "ui-invalid", mi = "data-ui-validation-message", hi = {
	componentId: ae,
	key: _,
	selected: Fr,
	selectedKey: Ir,
	selectedKeys: Lr,
	unselectable: ce,
	rowFocus: Ne,
	cellFocus: Ie,
	cellKey: Le,
	itemsHost: v,
	valueHolder: St,
	bindValue: Ye,
	noRowOpen: pe,
	noRowDrag: me,
	eventBoundary: Ze,
	focusHolder: Qr,
	ownsKeys: $r,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: we,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: Gr,
	loadingClass: Kr,
	readOnlyClass: qr,
	hiddenClass: Jr,
	buttonClass: ri,
	selectClass: ai,
	textInputClass: fi,
	invalidClass: pi,
	validationMessage: mi,
	sourceLine: At,
	textDescription: si,
	popupSelector: ei,
	listTriggerSelector: ni,
	tableRowClass: Ln,
	tableScrollClass: Rn,
	tableHeaderClass: zn,
	tableResizerClass: Bn,
	tableHidden: In,
	hostMode: Et,
	windowOffset: Ft,
	windowTotal: It,
	windowSize: Pt,
	windowMoreAfter: Rt,
	windowAggregates: Bt,
	itemsQuery: at,
	valueKind: wt,
	itemsQueryKind: Tt,
	menuItemClass: y,
	menuItemKind: mn,
	menuItemCheckedClass: gn
};
function x(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function gi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var _i = 0;
function vi(e, t) {
	return e.id.length === 0 && (_i++, e.id = `${t}-${_i}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function yi(e, t, n) {
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
var bi = {
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
	PushAddress: "PushAddress",
	RequestNotificationPermission: "RequestNotificationPermission",
	ShowSystemNotification: "ShowSystemNotification"
}, xi = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(C(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${C(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(C(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (C(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Wi(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Wi(e, Ui(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Gi(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Hi(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Hi(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Ki(e, t))?.items ?? [];
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
		let t = C(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = C(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Wi(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Wi(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Hi(e.eventName), n = C(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Gi(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = C(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = C(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = C(e.componentId);
		t > 0 && this.itemValuesByAddress.set(Ki(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = C(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function S(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Si(e) {
	return S(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Ci(e) {
	return e == null ? "OneWay" : S(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function wi(e) {
	return S(e, ["Property", "Event"]);
}
function Ti(e) {
	return e == null ? "SetProperty" : S(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Ei(e) {
	return S(e, [
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
function Di(e) {
	return S(e, ["Ascending", "Descending"]);
}
function Oi(e) {
	return S(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ki(e) {
	return S(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ai(e) {
	return typeof e == "string" ? e : S(e, [
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
function ji(e) {
	return S(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Mi(e) {
	return S(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function C(e) {
	return e ?? 0;
}
function Ni(e) {
	return typeof e == "string" ? e : "";
}
function Pi(e) {
	return S(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Fi(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Ii(e) {
	return S(e, ["Auto", "Smooth"]);
}
function Li(e) {
	return S(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Ri(e) {
	return S(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function zi(e) {
	return S(e, ["Light", "Dark"]);
}
function Bi(e) {
	return S(e, ["Horizontal", "Vertical"]);
}
function Vi(e) {
	return S(e, ["Polite", "Assertive"]);
}
function Hi(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Ui(e) {
	return e?.trim() ?? "";
}
function Wi(e, t) {
	return `${e}:${Ui(t)}`;
}
function Gi(e, t) {
	return `${e}:${Hi(t)}`;
}
function Ki(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var qi = class {
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
		return this.dom.findAllComponents(C(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = C(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = C(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${qe}${gi(r.propertyName)}="${x(a)}"]` : null;
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
		let n = C(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return yi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${gi(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ji(e) {
	return Qi(e, se);
}
function Yi(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = ea(r);
		if (e !== void 0) {
			let t = r.closest($i);
			(t === null || t !== i) && n.push(e), i = t;
		}
		r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Xi(e, t) {
	let n = Ji(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Yi(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Zi(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = ea(r);
		if (e !== void 0) {
			let a = r.closest($i);
			if (a === null || a !== i) {
				if (e !== String(t[n] ?? "")) return !1;
				n--;
			}
			i = a;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Qi(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var $i = `[${v}]`;
function ea(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function ta(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var na = class {
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
		let e = this.root.querySelectorAll(b), t = this.root.querySelector(`[${yt}]`) !== null;
		for (let n of e) {
			let e = w(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && oa(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return vi(e, t);
	}
	findComponentParts(e, t, n) {
		return ta(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(aa(t)) ?? [];
		if (n.length > 0 && n.every((e) => Xi(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Xi(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Ji(n);
			if (e === 0) continue;
			let r = Yi(n, e);
			if (r.length !== e) continue;
			let i = aa(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(b);
			if (e === null || !sa(this.root, e)) return null;
			let r = w(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Yi(e, Ji(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function w(e) {
	return Qi(e, ae);
}
function ra(e) {
	let t = e.closest(b), n = t === null ? 0 : w(t);
	return n > 0 ? n : null;
}
function ia(e) {
	let t = e.closest(b), n = t === null ? 0 : w(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Yi(t, Ji(t))
	};
}
function aa(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function oa(e) {
	return Ji(e) === 0;
}
function sa(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function ca(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = la(n);
	switch (ua(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : da(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : da(r, i) ? "many" : "other";
		case "ru":
		case "uk": return fa(r, i);
		case "pl": return pa(r, i);
		default: return "other";
	}
}
function la(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function ua(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function da(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function fa(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function pa(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ma(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var ha = {
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
function ga(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return ha;
	try {
		return {
			...ha,
			...JSON.parse(t)
		};
	} catch {
		return ha;
	}
}
var _a = [
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
function va(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Ta(e.getFullYear(), 4)}-${Ta(e.getMonth() + 1, 2)}-${Ta(e.getDate(), 2)} ${Ta(e.getHours(), 2)}:${Ta(e.getMinutes(), 2)}:${Ta(e.getSeconds(), 2)}`;
	let r = "", i = ya(t);
	for (let a = 0; a < t.length;) {
		let o = Ca(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += wa(o, e, n, i), a += o.length;
	}
	return r;
}
function ya(e) {
	for (let t = 0; t < e.length;) {
		let n = Ca(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var ba = /^[-./:,]$/, xa = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Sa(e) {
	for (let t = 0; t < e.length;) {
		let n = Ca(e, t);
		if (n !== null && xa.has(n) || n === null && !ba.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Ca(e, t) {
	for (let n of _a) if (e.startsWith(n, t)) return n;
	return null;
}
function wa(e, t, n, r) {
	let i = t.getHours(), a = Wa(i);
	switch (e) {
		case "yyyy": return Ta(t.getFullYear(), 4);
		case "yy": return Ta(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Ta(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Ta(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Ta(i, 2);
		case "H": return String(i);
		case "hh": return Ta(a, 2);
		case "h": return String(a);
		case "mm": return Ta(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Ta(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Ta(e, t) {
	return String(e).padStart(t, "0");
}
var Ea = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Da(e) {
	let t = Ea.exec(e.trim());
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
function Oa(e) {
	return ka(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function ka(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Aa = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function ja(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Ca(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += Ma(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function Ma(e, t) {
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
function Na(e, t, n) {
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
		let a = Ca(t, e);
		if (a === null) {
			if (!Pa(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Fa(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Ha(i) : null;
}
function Pa(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return ba.test(n) ? t.position >= e.length || !ba.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Fa(e, t, n, r) {
	switch (n) {
		case "yyyy": return Ia(t, "year", za(e, t, 4, 4));
		case "yy": return Ia(t, "year", La(za(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Ia(t, "month", Ra(Ba(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Ia(t, "month", za(e, t, 1, 2));
		case "dddd":
		case "ddd": return Ba(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Ia(t, "day", za(e, t, 1, 2));
		case "HH":
		case "H": return Ia(t, "hour", za(e, t, 1, 2));
		case "hh":
		case "h": return Ia(t, "hour12", za(e, t, 1, 2));
		case "mm":
		case "m": return Ia(t, "minute", za(e, t, 1, 2));
		case "ss":
		case "s": return Ia(t, "second", za(e, t, 1, 2));
		case "tt": return Va(e, t, r);
		default: return !1;
	}
}
function Ia(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function La(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ra(e) {
	return e === null ? null : e + 1;
}
function za(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Ba(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Va(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ha(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > ka(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Ua = {
	readCulture: ga,
	format: va,
	parse: Da,
	toDate: Oa
};
function Wa(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Ga = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Ka = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function qa(e) {
	let t = e?.trim() ?? "";
	if (!Ka.test(t)) return null;
	let n = Date.parse(Ga.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Ja(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Ya(e) {
	return e === "relative" || e === "relative-date";
}
var Xa = {
	...ha,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Za(e, t, n, r) {
	if (t === "relative") return co(e - r, n.language);
	if (t === "relative-date") {
		let t = $a(e, r);
		if (t !== null) return no(n.language).format(t, "day");
	}
	let i = n.temporal ?? Xa, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ma(i, !1);
	return va(new Date(e), a, i);
}
function Qa(e, t, n, r) {
	let i = Za(e, t, n, r);
	return t === "relative-date" ? eo(i, n.language) : i;
}
function $a(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / so);
	return Math.abs(i) <= 1 ? i : null;
}
function eo(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(ro(t)) + e.slice(1);
}
var to = /* @__PURE__ */ new Map();
function no(e) {
	let t = to.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(ro(e), { numeric: "auto" }), to.set(e, t)), t;
}
function ro(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var io = 1e3, ao = 60 * io, oo = 60 * ao, so = 24 * oo;
function co(e, t) {
	let n = no(t), r = Math.abs(e);
	return r < 45 * io ? n.format(0, "second") : r < 45 * ao ? n.format(Math.round(e / ao), "minute") : r < 22 * oo ? n.format(Math.round(e / oo), "hour") : r < 26 * so ? n.format(Math.round(e / so), "day") : r < 320 * so ? n.format(Math.round(e / (30.4375 * so)), "month") : n.format(Math.round(e / (365.25 * so)), "year");
}
//#endregion
//#region src/runtime/words.ts
var lo = "count";
function uo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function fo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var po = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function mo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && qa(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && po.has(t.format));
}
function ho(e) {
	if (typeof e != "object" || !e) return !1;
	if (mo(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (ho(t)) return !0;
	return !1;
}
function go(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function _o(e, t, n) {
	return uo(e) ? bo(n, e.key, e.args) : fo(e) ? vo(n, e.text) : t && typeof e == "string" ? vo(n, e) : e;
}
function vo(e, t) {
	return t.trim().length === 0 || !yo(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function yo(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function bo(e, t, n) {
	let r = n?.[lo];
	return xo(typeof r == "number" ? e.lookup(`${t}.${ca(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => fo(t) ? vo(e, t.text) : bo(e, t.key, t.args), e.writeMoment);
}
function xo(e, t, n, r = go) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = So(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += wo(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function So(e, t) {
	let n = t + 1;
	for (; n < e.length && Co(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Co(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function wo(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : uo(e) ? t === void 0 ? xo(e.key, e.args, void 0, n) : t(e) : fo(e) ? t === void 0 ? e.text : t(e) : mo(e) ? n(qa(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var To = `script[type='application/json'][${ft}]`;
function Eo(e) {
	let t = e.querySelector(To)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/relative-clock.ts
var Do = 15e3, Oo = /* @__PURE__ */ new Set(), ko = null;
function Ao(e) {
	Oo.add(e), ko === null && (ko = setInterval(jo, Do));
}
function jo() {
	for (let e of [...Oo]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Oo.delete(e);
	}
	Oo.size === 0 && ko !== null && (clearInterval(ko), ko = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Mo = 256, No = 512, Po = "script[type='application/json'][data-ui-strings]", Fo = `[${xr}*='"moment"']`, Io = class {
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
		this.tableLoaded || (this.currentTemporal = Eo(e) ?? this.currentTemporal);
		let t = e.querySelector(Po)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), bo(this, e, t);
	}
	translate(e, t) {
		return bo(this, e, t);
	}
	writeMoment = (e, t) => (Ya(t) && this.noteRelative(), Za(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Ao(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return _o(e, t, this);
	}
	resolveText(e) {
		return _o(e, !0, this);
	}
	write(e, t, n, r) {
		Ho(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Ho(e, t, _o(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (uo(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = fo(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Ho(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		zo(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Uo(e, (e) => {
			for (let n of e.querySelectorAll(t ? Fo : `[${xr}]`)) for (let [e, r] of Object.entries(Vo(n))) {
				if (t && !ho(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Ho(n, e === "#text" ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return _o(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > No || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && yo(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Mo) try {
			let a = await e(t, n.slice(r, r + Mo));
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
function Lo(e) {
	let t = !1;
	return Uo(e, (e) => {
		t ||= e.querySelector(Fo) !== null;
	}), t;
}
function Ro(e, t) {
	e.hasAttribute("data-ui-words") && zo(e, t, null);
}
function zo(e, t, n) {
	let r = Vo(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(xr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(xr, a);
}
function Bo(e) {
	let t = Vo(e)[Sr];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Vo(e) {
	let t = e.getAttribute(xr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Ho(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Uo(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Uo(n.content, t);
}
var T = new Io();
function Wo(e, t) {
	let n = fo(e) ? e.text : e;
	return T.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Go = "row-idle";
function Ko(e) {
	let t = e.parentElement;
	t !== null && (Xo(t) ? qo(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Xo(t.parentElement) && qo(t.parentElement));
}
function qo(e) {
	let t = Jo(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(ur, t);
}
function Jo(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (Yo(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && Yo(e)) return !0;
	}
	return !1;
}
function Yo(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Xo(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Zo = `.${Gr}, .${Kr}, [inert]`;
function Qo(e) {
	return `:scope > [${ae}]:is(${e}), :scope > :not([${ae}]) > [${ae}]:is(${e})`;
}
var $o = Qo(Zo), es = /* @__PURE__ */ new Map();
function E(e) {
	return e.closest(Zo) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function D(e) {
	return e.matches(Zo) || e.querySelector($o) !== null;
}
function ts(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = es.get(t);
	return n === void 0 && (n = Qo(`[${t}]`), es.set(t, n)), e.querySelector(n) !== null;
}
function ns(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var rs = `[${ae}], .${qr}`;
function O(e) {
	return e.closest(rs)?.matches(`.${qr}`) === !0;
}
function is(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(Gr, t), Ko(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var as = {
	isInert: E,
	isReadOnly: O,
	setDisabled: is
};
//#endregion
//#region src/interactions/grid-tracks.ts
function os(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function ss(e) {
	let t = [];
	for (let n of us(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = ss(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = cs(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function cs(e) {
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
	if (n !== null) return ls({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return ls(r[3] === "fr" ? {
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
function ls(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function us(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function ds(e, t = "auto") {
	return e.map((e) => fs(e, t)).join(" ");
}
function fs(e, t) {
	switch (e.kind) {
		case "px": return `${ps(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${ps(e.min)}px`}, ${ps(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${ps(e.max)}px)` : `minmax(${ps(e.min)}px, auto)`;
	}
}
function ps(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ms(e) {
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
function hs(e, t) {
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
function gs(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = _s(r, e), o = _s(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function _s(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var vs = {
	sliver: 120,
	passFloors: !1
};
function ys(e, t, n, r, i = vs) {
	let a = Ss(e, t, n.before), o = Ss(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = xs(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = Ds(n.before, e) + Ds(n.after, e), r = a.total + o.total;
		Cs(d, e, a, t * (a.total + u) / r), Cs(d, e, o, t * (o.total - u) / r);
	} else f || ws(d, a, a.total + u), p || ws(d, o, o.total - u);
	return i.passFloors && (bs(d, a, a.total + u), bs(d, o, o.total - u)), d;
}
function bs(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function xs(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function Ss(e, t, n) {
	let r = Es(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Cs(e, t, n, r) {
	let i = Ds(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function ws(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Ts(e[i])
		};
	}
}
function Ts(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Es(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Ds(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Os(e, t) {
	return Math.round(ks(e, t) * 100);
}
function ks(e, t) {
	let n = Es(t.before, e), r = n + Es(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function As(e, t, n) {
	let r = Es(t.before, e);
	return (r + Es(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function js(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function Ms(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Ns = /* @__PURE__ */ new Set();
function Ps(e, t, n, r) {
	let i = Ss(e, t, n.before), a = Ss(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Fs(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = Ss(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Is(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Ls(e, t, n, r = Ns) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Rs(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function zs(e) {
	return e == null;
}
var Bs = "data-ui-trim-input", Vs = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Gs) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(wt);
		if (t === null) return Hs(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Bs) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Ws(e);
		return t === null ? null : this.read(t);
	}
};
function Hs(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Us = "input, textarea, select";
function Ws(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Us) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Us}`);
}
var Gs = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => js(e.getAttribute(An))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(jn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(zr)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Br)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Vr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(rr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Ir)
	},
	{
		kind: "selected-keys",
		read: (e) => Ks(e, Lr)
	},
	{
		kind: Tt,
		read: (e) => Ks(e, at)
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
function Ks(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function qs(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Js(e) {
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
		default: o = sc(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Ys(e, t, n = tc()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Xs(e, t = tc()) {
	let n = Zs(e.code, t);
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
function Zs(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? $s[e] : void 0) ?? Qs[e] ?? e;
}
var Qs = {
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
}, $s = {
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
}, ec = null;
function tc() {
	return ec === null && (ec = nc()), ec;
}
function nc() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var rc = {
	words(e) {
		let t = Js(e);
		return t === null ? null : Xs(t);
	},
	matches(e, t) {
		let n = Js(t);
		return n !== null && Ys(n, e);
	},
	isComposing: k
}, ic = 229;
function k(e) {
	return e.isComposing || e.keyCode === ic;
}
function A(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !k(e);
}
var ac = class {
	held = null;
	hold(e) {
		this.held = e;
	}
	release(e, t = () => !0) {
		if (!(e instanceof KeyboardEvent) || e.key !== " " || this.held === null) return;
		let n = this.held;
		this.held = null, !(e.target !== n || !t(n)) && (e.preventDefault(), n.click());
	}
};
function oc(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function sc(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : cc[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : cc[t] ?? null;
}
var cc = {
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
}, lc = "data-ui-rename-field";
function uc(e) {
	return e instanceof Element && e.closest(`[${lc}]`) !== null;
}
function dc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(lc, ""), r.setAttribute(Ze, ""), r.value = e.value, fc(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!k(e)) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function fc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = pc(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = mc((r.left - i.left) / s - n.clientLeft), e.style.top = mc((r.top - i.top) / s - n.clientTop), e.style.width = mc(r.width / s), e.style.height = mc(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function pc(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function mc(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var hc = "data-ui-runs-on-escape", gc = "ui-key-value-action__row", _c = "ui-key-value-action__value-input", vc = "ui-key-value-action__edit-action";
function yc(e) {
	return k(e) || bc(e.target) !== null;
}
function bc(e) {
	return e instanceof Element ? uc(e) || xc(e) ? e : e.closest("[data-ui-owns-keys]") ?? Sc(e)?.cell ?? null : null;
}
function xc(e) {
	return e instanceof Element && e.hasAttribute(hc) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !E(e);
}
function Sc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${_c}, .${vc}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var Cc = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), wc = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"PageUp",
	"PageDown",
	"Backspace",
	"Delete"
]), Tc = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), Ec = /^F\d{1,2}$/;
function Dc(e) {
	return e instanceof HTMLInputElement && Cc.has(e.type);
}
function Oc(e) {
	return Dc(e) || e instanceof HTMLTextAreaElement;
}
function kc(e) {
	return Oc(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Ac(e) {
	let t = e.target;
	if (!kc(t)) return !1;
	if (k(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || Ec.test(n) || e.altKey ? !1 : n === "Enter" ? !Dc(t) : e.ctrlKey || e.metaKey ? wc.has(n) || Tc.has(e.code) : !0;
}
var jc = {
	...rc,
	isFieldKey: Ac,
	isPlainKey: A,
	isEscapeClaimed: yc
}, Mc = "ui-draft-dropped";
function Nc(e) {
	e.dispatchEvent(new Event(Mc, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Pc = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${ti}, .ui-field-box`, Fc = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Ic = `${Fc}, ${Pc}, ${ei}, .${ye}`, Lc = "button, a, summary, [role='button']";
function Rc(e) {
	let t = [];
	for (let n of e.querySelectorAll(Ic)) if (!(n.classList.contains("ui-row__grip") || !Vc(e, n) || Bc(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Lc) ? n : null;
}
function zc(e) {
	let t = [];
	for (let n of e.querySelectorAll(Fc)) Bc(e, n) && Vc(e, n) && t.push(n);
	return t;
}
function Bc(e, t) {
	let n = t.closest(`[${pe}]`);
	return n !== null && n !== e && e.contains(n);
}
function Vc(e, t) {
	let n = t.closest(ei);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Hc(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Ic);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Uc(e) {
	let t = qc(e.key), n = Jc(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(M);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Wc(e, t) {
	return qc(e) !== null || Jc(e, t) !== 0;
}
var Gc = {
	target: Uc,
	applyTabIndex: j
};
function j(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Kc(e, t) {
	t !== null && (j(e, t), t.focus());
}
function M(e) {
	return e.getClientRects().length > 0 && !E(e);
}
function qc(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Jc(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Yc(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Xc(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${v}][${Dt}]`) : null;
}
function Zc(e) {
	let t = Yc(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - $c(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Qc(e, t) {
	let n = Yc(e);
	n.scrollTop = n === e ? t : t + $c(e, n);
}
function $c(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function el(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function tl(e) {
	if (e === null || e.length === 0) return [];
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return [];
	}
	if (!Array.isArray(t)) return [];
	let n = /* @__PURE__ */ new Set();
	for (let e of t) typeof e == "string" && e.length > 0 && n.add(e);
	return [...n];
}
function nl(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function rl(e, t) {
	return t !== null && e.length >= t;
}
function il(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : rl(e, n) ? null : [...e, t];
}
function al(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var ol = /[,\uFF0C\r\n]/;
function sl(e) {
	return ol.test(e);
}
function cl(e) {
	return e.split(ol).map((e) => e.trim()).filter((e) => e.length > 0);
}
function ll(e) {
	let t = e.split(ol), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function ul(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = rl(a, n) ? r : i(a, t);
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
//#region src/interactions/own-descendants.ts
function dl(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function fl(e) {
	return dl(e, Sn, `.${hn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function pl(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function ml(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var hl = "data-ui-bind-selected-keys", N = `.ui-items-view, .ui-table, .${Vn}`, gl = `.ui-items-view__item, .${Ln}, .${Hn}`, _l = ".ui-items-view, .ui-table", vl = {
	shift: !1,
	ctrl: !1
}, yl = /* @__PURE__ */ new WeakMap();
function bl(e, t) {
	t !== null && !yl.has(e) && xl(e, t);
}
function xl(e, t) {
	let n = F(t);
	n.length > 0 && yl.set(e, n);
}
function Sl(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Cl(e, t) {
	let n = Sl(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function wl(e) {
	return !e.hasAttribute(Qn);
}
function P(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ae}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Tl(e) {
	switch (e.getAttribute(Pr)) {
		case "one": {
			let t = e.getAttribute(Ir);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Pl(Fl(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function El(e, t) {
	let n = Tl(e), r = e.getAttribute(Pr), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(F(e));
		e.toggleAttribute(Fr, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Dl(e) {
	return e.filter((e) => e.hasAttribute(Fr));
}
function Ol(e, t, n, r, i) {
	let a = F(n);
	if (!jl(n)) return !1;
	switch (e.getAttribute(Pr)) {
		case "one": return pl(e, a, {
			attribute: Ir,
			bindingAttribute: Rr,
			apply: (e) => El(e, t)
		}), !0;
		case "many": return kl(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function kl(e, t, n, r, i, a) {
	let o = Fl(e);
	if (o === null) return;
	let s = Pl(o), c;
	if (i.shift) {
		let o = yl.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => F(e) === o) ?? n, d = l === null ? Nl(t, u, n).map(F) : Ml(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], yl.set(e, r)) : (c = [r], yl.set(e, r));
	Al(e, t, c);
}
function Al(e, t, n) {
	let r = Fl(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Lr, i), El(e, t), r.hasAttribute(hl) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function jl(e) {
	return F(e).length > 0 && !ts(e, "data-ui-unselectable") && !D(e);
}
function Ml(e, t) {
	let n = new Map(t.map((e) => [F(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || P(t) !== null && jl(t);
	});
}
function Nl(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => P(e) !== null && jl(e));
}
function Pl(e) {
	return tl(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Fl(e) {
	let t = e.closest(b);
	for (let n of e.querySelectorAll(`[${v}]`)) if (n.closest(N) === e && n.closest(b) === t) return n;
	return null;
}
function F(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Il = {
	isSelected: (e) => e.hasAttribute(Fr),
	toggle: Ll,
	setSelected: Rl,
	setSelectedKeys: zl
};
function Ll(e) {
	let t = e.closest(N);
	t !== null && e instanceof HTMLElement && Ol(t, Bl(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Rl(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(F(e));
	zl(e, r, n);
}
function zl(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Bl(e), i = new Set(r.filter((e) => !jl(e)).map(F)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Tl(e)].filter((e) => !a.has(e));
	Al(e, r, n ? [...o, ...a] : o);
}
function Bl(e) {
	return dl(e, gl, N);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Vl = "--ui-table-order-";
function Hl(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Ul = "ui-table", Wl = `[${Nn}]:not(.${Bn})`, Gl = `.${Ln} > [aria-colspan]:not([${Nn}])`;
function Kl(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	ql(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Wl}${o}, ${Gl}${o}`)) {
		if (t.closest(`.${Ul}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			ql(t, "aria-colindex", "1"), ql(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Nn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : ql(t, "aria-colindex", n);
	}
}
function ql(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var Jl = ".ui-table[role='grid']", Yl = "gridcell", Xl = "aria-colspan", Zl = /* @__PURE__ */ new WeakMap();
function Ql(e) {
	let t = e.closest(N);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(gl);
	return n !== null && n.closest(N) === t ? {
		root: t,
		row: n
	} : null;
}
function $l(e) {
	return e.target instanceof Element && !Ac(e) ? eu(e.target) : null;
}
function eu(e) {
	let t = Ql(e);
	if (t === null || t.row !== null && Hc(e, t.row) !== null) return null;
	let n = e.closest(`[${$r}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function tu(e) {
	return e.filter((e) => P(e) !== null && !D(e));
}
function nu(e) {
	return ru(e) ?? tu(e)[0] ?? null;
}
function ru(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !D(e)) ?? null;
}
function iu(e) {
	return ru(Bl(e));
}
function au(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = nu(t);
	n !== null && su(e, t, n);
}
function ou(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", vi(t, "ui-row-name"));
}
function su(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = cu(e, n, r);
	i && ((P(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && mu(e, n, a));
}
function cu(e, t, n) {
	let r = lu(e) ? uu(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(N) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", vi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(Nn);
	return i !== null && Zl.set(e, i), e.setAttribute("aria-activedescendant", vi(r, "ui-cell")), r;
}
function lu(e) {
	return e.matches(Jl);
}
function uu(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Yl) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = du(t, n.getAttribute(Nn));
		if (e !== null) return e;
	}
	let r = fu(e, t), i = Zl.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Nn) === i);
	if (a !== void 0) return a;
	let o = Hl(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Nn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function du(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && pu(n)) return n;
	return null;
}
function fu(e, t) {
	let n = Hl(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && pu(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function pu(e) {
	return e.getAttribute("role") === Yl && !e.hasAttribute("data-ui-owns-keys");
}
function mu(e, t, n) {
	let r = e.querySelector(`:scope > .${Rn}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += hu(c.left, c.right, o, s);
}
function hu(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function gu(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function _u(e) {
	return Zl.get(e) ?? null;
}
function vu(e, t, n, r) {
	if (n !== null && xu(n)) return null;
	let i = fu(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Nn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function yu(e, t, n, r) {
	let i = bu(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? uu(e, t, null) : i[a];
}
function bu(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && xu(e));
}
function xu(e) {
	return pu(e) && e.hasAttribute(Xl) && !e.hasAttribute("data-ui-table-column");
}
function Su(e) {
	let t = bu(e);
	return t[t.length - 1] ?? null;
}
function Cu(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Yl ? n : null;
}
function wu(e, t = null) {
	let n = e.closest(N);
	n !== null && e instanceof HTMLElement && su(n, Bl(n), e, t);
}
function Tu(e, t) {
	let n = new CustomEvent(Le, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			cell: e,
			key: t.key,
			keyboard: t
		}
	});
	return e.dispatchEvent(n), n.defaultPrevented;
}
function Eu(e, t) {
	return Wc(e, t === "grid" ? "both" : t) || t !== "horizontal" && Du(e);
}
function Du(e) {
	return e === "PageDown" || e === "PageUp";
}
function Ou(e, t, n, r) {
	if (!Eu(e, r)) return null;
	let i = tu(t);
	if (Du(e)) return ku(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Au(i, n, e === "ArrowDown");
	let a = i.map((e) => P(e) ?? e), o = Uc({
		key: e,
		items: a,
		current: n === null ? null : P(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ku(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (P(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Zc(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (P(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Au(e, t, n) {
	let r = t === null ? null : P(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ju(i), o = e.map((e) => ({
		row: e,
		rect: (P(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(ju(t.rect) - a) < Math.abs(ju(e.rect) - a) ? t : e).row;
}
function ju(e) {
	return e.left + e.width / 2;
}
var Mu = "ui-row-press";
function Nu(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Pu(e, t, n) {
	let r = n.hasAttribute(Ne), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Fu(t, o, a);
		n !== null && su(e, o, n);
	};
}
function Fu(e, t, n) {
	let r = tu(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function Iu(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || P(n) !== null) return;
	let r = Fu(t, t, t.indexOf(n));
	if (r !== null) {
		su(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(Ne), gu(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant");
}
function Lu(e) {
	let t = e.parentElement, n = t?.closest(N) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Ru(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(_)
	} : null;
}
function zu(e, t, n) {
	let r = Lu(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Pe, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Hu(r, t);
	}
}
function Bu(e, t) {
	let n = Lu(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Hu(n, t));
}
function Vu(e) {
	return e.getAttribute(Pe);
}
function Hu(e, t) {
	t.setAttribute(Ne, ""), cu(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Uu = "data-ui-active", Wu = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Gu = /* @__PURE__ */ new Set([
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
]), Ku = !1, qu = !1, Ju = null, Yu = /* @__PURE__ */ new Set(), Xu = [], Zu = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Qu(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => $u(e), !0), window.addEventListener("focus", (e) => ed(e.target), !0), window.addEventListener("focusin", (e) => ed(e.target), !0), window.addEventListener("focusout", (e) => td(e), !0));
function Qu(e, t = "") {
	Ku = !0, qu = t === "touch";
	let n = document.activeElement;
	Ju = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && od(n, !nd(n)), sd(n);
}
function $u(e) {
	if (!(e instanceof KeyboardEvent && Gu.has(e.key))) {
		Ku = !1;
		for (let e of [...Yu]) od(e, !1);
		sd(document.activeElement);
	}
}
function ed(e) {
	Ku && !nd(e) && od(e, !0), e === document.activeElement && sd(document.activeElement);
}
function td(e) {
	e.target instanceof Element && e.target.hasAttribute(Uu) || od(e.target, !1), e.relatedTarget === null && queueMicrotask(() => sd(document.activeElement));
}
function nd(e) {
	return Oc(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function rd() {
	return Ku && Ju instanceof HTMLElement && Ju !== document.body ? Ju : null;
}
function id() {
	return Ku;
}
function ad() {
	return Ku && qu;
}
function od(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Yu) e.isConnected || Yu.delete(e);
			Yu.add(e);
		} else Yu.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Ar, t), e === document.activeElement && sd(e);
	}
}
function sd(e) {
	let t = e === null || e === document.body || nd(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : cd(e);
	for (let e of Xu) n.includes(e) || e.removeAttribute(jr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(jr, t);
	Xu = n;
}
function cd(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !ld(n))); n = n.parentElement);
	return t;
}
function ld(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Pc) ?? null) !== null;
}
function I(e) {
	ed(e), ud(e);
}
function ud(e) {
	sd(e), e.focus({ preventScroll: !0 }), sd(document.activeElement);
}
function dd(e) {
	od(e, !0), ud(e);
}
function fd(e) {
	for (let t of e.querySelectorAll(Wu)) if (ns(t)) return t;
	return null;
}
var pd = {
	first: fd,
	stops: (e) => md(e, document.activeElement),
	giveBack: (e) => Sd(e),
	trapTab: _d
};
function md(e, t) {
	let n = [...e.querySelectorAll(Wu)].filter((e) => e === t || e.tabIndex >= 0 && ns(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = hd(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !gd(n) && gd(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = hd(e);
		return t === null || r.get(t) === e;
	});
}
function hd(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function gd(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function _d(e, t) {
	let n = md(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = vd(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function vd(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && yd(n, a) ? i : r && yd(n, i) ? a : null;
}
function yd(e, t) {
	return e === t || hd(e) !== null && hd(e) === hd(t);
}
var bd = `.${Yr}, .${Xr}, [${Qr}]`;
function xd(e) {
	let t = Ql(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(bd)) && n.hasAttribute("tabindex") && ns(n)) return n;
	return null;
}
function Sd(e, t = xd(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Ql(e);
	r?.root === t && r.row !== null && su(t, Bl(t), r.row, Cu(r.row, e)), I(t);
}
function Cd(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? fd(e);
	return Ku ? Zu.add(e) : Zu.delete(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), I(r ?? e), n;
}
function wd(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? fd(e);
	return n !== null && Td(e, n), Cd(e, n);
}
function Td(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Ed(e, t, n = !1) {
	if (Ku) {
		j(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), I(e);
		return;
	}
	let r = t.filter(M), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (j(t, i), I(i));
}
function Dd(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Od(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Wu}, [tabindex]`) && ns(e)) return e;
	return n === null ? null : kd(n);
}
function Od(e, t) {
	if (t === null) return null;
	for (let n = e.closest(b); n !== null; n = n.parentElement?.closest(b) ?? null) {
		let e = t.findEveryComponent(w(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function kd(e) {
	for (let t = e.closest(b); t !== null; t = t.parentElement?.closest(b) ?? null) if (ns(t)) return Ad(t), t;
	return null;
}
function Ad(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function jd(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Md(n, t) && od(e, !nd(e)), I(e));
}
function Md(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Zu.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Nd = "data-ui-clear", Pd = ["change", "toggle"], Fd = [
	...Pd,
	"expand",
	"collapse",
	"open",
	"close"
];
function Id(e) {
	let t = Ci(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Ld(e) {
	return Ci(e) === "OnSubmit";
}
function Rd(e, t) {
	let n = e.getAttribute(Ye);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Ld(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Id(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Ld(i.mode)
		};
	}
	return null;
}
var zd = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Pd) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Mc, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Nd}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Rd(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Nd}]`);
		if (t === null) return;
		let n = t.closest(b), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Bd(r) || (qs(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Oc(r) && document.activeElement !== r && I(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (O(e.target) || E(e.target))) return;
		let t = Rd(e.target, this.options.metadata);
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
			let r = Rd(n, this.options.metadata);
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
		if (i === void 0 || !Id(i.mode) || Ld(i.mode)) return;
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
function Bd(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Vd(e, t) {
	let n = e.closest(`[${Ze}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Hd = class {
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
}, Ud = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Hi(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Hi(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Hi(e));
	}
	isAttached(e) {
		return this.attachments.has(Hi(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Hi(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Wd = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: C(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Gd = {
	dispatched: !1,
	success: !1
}, Kd = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, qd = class {
	options;
	root;
	registry;
	requestFactory = new Wd();
	turns = new Hd();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Ud(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t), r = t.attach !== void 0 || t.domEventName !== void 0 || t.options !== void 0;
		this.shouldAttach(n) && (r || !this.registry.isAttached(n.name)) && this.attachEvent(n);
	}
	async dispatchCommandAsync(e) {
		if (this.options.dispatcher.isPending(e)) return !1;
		let t = this.turns.take();
		try {
			if (await t.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(e)) return !1;
			let n = this.options.dispatcher.dispatchAsync(e);
			t.done();
			let r = await n;
			return this.options.effects.applyAll(r.command?.effects, this.options.dom), this.options.afterEffects?.(), r.refused !== !0;
		} finally {
			t.done();
		}
	}
	shouldAttach(e) {
		return this.options.metadata.hasServerEvent(e.name) || this.options.interactionEngine.hasEvent(e.name) || this.options.interactionEngine.hasEvent(`before-${e.name}`) || this.options.interactionEngine.hasEvent(`after-${e.name}`);
	}
	attachEvent(e) {
		let t = this.registry.attach(e.name), n = (n) => {
			this.registry.isCurrent(e.name, t) && this.handleDomEventAsync(e.name, n).catch((e) => {
				c("event pipeline failed.", e);
			});
		}, r = this.options.eventCatalog.get(e.name), i = {
			root: this.root,
			dispatch: n,
			options: e.options
		};
		r === void 0 ? this.root.addEventListener(e.domEventName, n, {
			capture: !0,
			...e.options
		}) : r.attach(i);
	}
	async handleDomEventAsync(e, t) {
		if (!(t.target instanceof Element)) return;
		let n = this.registry.get(e);
		if (n === void 0) return;
		let r = this.options.dom.resolveNearestComponent(t.target, (t, n) => this.shouldHandleComponent(e, t, n));
		if (r === null || Yd(t, r.element) || Vd(t.target, r.element)) return;
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
			let t = e instanceof Kd, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && E(r.domEvent.target)) return Gd;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Gd;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Xd(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Gd;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Gd;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Kd(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Fd.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Xe(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Jd(e.preventDefault, t) && t.domEvent.preventDefault(), Jd(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Jd(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Yd(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Xd(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Zd(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Qd(e, t) : $d(e, t);
}
function Qd(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Zd(e[n], t[n])) return !1;
	return !0;
}
function $d(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Zd(e[n], t[n]) : !ef(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !ef(t[n])) return !1;
	return !0;
}
function ef(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function tf() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function nf(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (rf(e)) return af(e, () => nf(e)), null;
	let n = e;
	for (; n.parentElement !== null && !rf(n.parentElement);) n = n.parentElement;
	let r = cf(n) ?? lf(n) ?? uf();
	return r !== null && I(r), r;
}
function rf(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function af(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => of(t) && sf(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function of(e) {
	return e.transitionProperty === "visibility";
}
function sf(e) {
	return e.effect?.target ?? null;
}
function cf(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Wu) ?? null;
	return t !== null && rf(t) ? t : null;
}
function lf(e) {
	let t = md(e.closest(bd) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function uf() {
	let e = document.querySelector(`[${pn}="content"]`);
	return e === null ? null : (Ad(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var df = class {
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
		for (let e of Pd) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = mf(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Zd(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Rd(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(C(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) Ti(e.actionKind) === "CopyValue" && hf(e.target) && this.writeTarget(e.target, t.dynamicParameters, ff(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: C(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(C(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? mf(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Ti(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!hf(a)) return;
		let o = i === "CopyValue" ? ff(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = tf();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && nf(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: pf(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function ff(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function pf(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = C(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Xi(s, o)) return a === 0 ? e : {
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
function mf(e, t) {
	return JSON.stringify([
		C(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function hf(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var gf = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return _f(t, e.operator, e.value);
	}
};
function _f(e, t, n) {
	let r = vf(e), i = vf(n);
	switch (Ei(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return yf(r, i, (e) => e > 0);
		case "GreaterOrEqual": return yf(r, i, (e) => e >= 0);
		case "Less": return yf(r, i, (e) => e < 0);
		case "LessOrEqual": return yf(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return xf(r, i);
		case "RegexEach": return bf(r, i);
		default: return !1;
	}
}
function vf(e) {
	return uo(e) ? e.key : fo(e) ? e.text : e;
}
function yf(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function bf(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => xf(vf(e), t)) : xf(e, t);
}
function xf(e, t) {
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
var Sf = "Value", Cf = "EndValue", wf = "Pressed", Tf = class {
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
		return this.eventNames.has(Hi(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Of(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Hi(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(kf(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Af(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Ef(e)) {
			let t = C(e.sourceEvent?.componentId), n = Hi(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(kf(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(kf(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Df(e)) {
			let t = C(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Af(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Af(t, n), r)), r.push(e), Ti(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Sf || i === wf ? this.valueInteractions : i === Cf ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Ef(e) {
	return wi(e.sourceKind) === "Event";
}
function Df(e) {
	return wi(e.sourceKind) === "Property";
}
function Of(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function kf(e, t) {
	return `${e}:${Hi(t)}`;
}
function Af(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var L = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function jf() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Mf(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Nf(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Pf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Ff = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function If(e) {
	return `(min-width: ${Ff[e]}px)`;
}
var Lf = If("sm");
function Rf(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(If(t))) return t;
	return "base";
}
function zf(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Bf(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Vf(e, t) {
	return Hf(t, (t) => Bf(e, t));
}
function Hf(e, t) {
	for (let n = Pf.indexOf(e); n >= 0; n--) {
		let e = t(Pf[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Uf = /* @__PURE__ */ new Set([
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
function Wf(e) {
	return Uf.has(e);
}
var Gf = 4, Kf = 12, qf = /* @__PURE__ */ new Map(), Jf = !1, Yf = null, Xf = /* @__PURE__ */ new WeakMap(), Zf = "data-ui-popup-stood-in";
function Qf(e, t) {
	t === null ? Xf.delete(e) : Xf.set(e, t);
}
var $f = "--ui-popup-ground";
function ep(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue($f).trim() : "";
	n.length === 0 ? t.style.removeProperty($f) : t.style.setProperty($f, n);
}
function tp(e, t, n) {
	qf.set(t, {
		anchor: e,
		options: n
	}), mp(), Yf?.observe(t), sp(e, t), gp(e, t, n);
}
var np = "data-ui-popup-lifted", rp = "data-ui-sheet";
function ip() {
	return typeof matchMedia == "function" && !matchMedia(Lf).matches;
}
function ap(e) {
	return e.hasAttribute(rp);
}
function op(e) {
	if (e.hasAttribute(np)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(np, ""), cp(e);
}
function sp(e, t) {
	(t.hasAttribute(np) || lp(t) || e.closest(`[${np}]`) !== null) && op(t);
}
function cp(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function lp(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var up = L.normal * 5;
function dp(e, t) {
	e.hasAttribute(np) && (e.matches(":popover-open") && e.hidePopover(), Nf(e, up, () => {
		e.matches(":popover-open") || qf.has(e) || (e.removeAttribute("popover"), e.removeAttribute(np), t?.());
	}));
}
function fp(e) {
	let t = qf.get(e);
	t !== void 0 && gp(t.anchor, e, t.options);
}
function pp(e) {
	e != null && (qf.delete(e), Yf?.unobserve(e), dp(e));
}
function mp() {
	Jf || (Jf = !0, document.addEventListener("scroll", (e) => hp(e.target), !0), window.addEventListener("resize", () => hp(null)), window.visualViewport?.addEventListener("resize", () => hp(null)), window.visualViewport?.addEventListener("scroll", () => hp(null)), Yf = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = qf.get(t.target);
			e !== void 0 && gp(e.anchor, t.target, e.options, !0);
		}
	}));
}
function hp(e) {
	for (let [t, n] of qf) {
		if (!t.isConnected) {
			pp(t);
			continue;
		}
		e instanceof Node && t.contains(e) || gp(n.anchor, t, n.options);
	}
}
function gp(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = bp(e), a = i !== e;
	t.hasAttribute(Zf) !== a && t.toggleAttribute(Zf, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(_p) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	yp(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = Cp(n.boundary), p = qf.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Tp(l, d, m, u, f) ? m : wp(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Tp(l, d, h, u, f) || (vp(t, h, kp(l, h, f) - u - Gf), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let ee = n.alignEntries === !0 ? Np(t, h) : Mp, g = Fp(l, c, d, h, u, ee), te = Ip(l, c, d, h, u, ee);
	n.arrow === !0 && (Op(h) ? te = xp(te, c.left + c.width / 2, d.width) : g = xp(g, c.top + c.height / 2, d.height));
	let ne = Rp();
	g = ne.top + Hp(g - ne.top, d.height, ne.bottom - ne.top), te = Hp(te, d.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${te}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Sp(t, c, d, h, g, te);
}
var _p = "data-ui-popup-capped";
function vp(e, t, n) {
	let r = Op(t);
	e.setAttribute(_p, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function yp(e) {
	if (e.hasAttribute(_p)) {
		e.removeAttribute(_p);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function bp(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Zf)) return e;
		let n = Xf.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function xp(e, t, n) {
	let r = t - e;
	return r < Kf ? e - (Kf - r) : r > n - Kf ? e + (r - (n - Kf)) : e;
}
function Sp(e, t, n, r, i, a) {
	let o = Op(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Kf, Math.min(s, c - Kf))}px`);
}
function Cp(e) {
	let t = Rp(), n = {
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
function wp(e, t, n, r, i) {
	let a = Ap(n);
	if (Tp(e, t, n, r, i)) return n;
	if (Tp(e, t, a, r, i)) return a;
	for (let a of Ep(n)) if (Tp(e, t, a, r, i)) return a;
	return kp(e, a, i) > kp(e, n, i) ? a : n;
}
function Tp(e, t, n, r, i) {
	return kp(e, n, i) >= Dp(t, n) + r;
}
function Ep(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Dp(e, t) {
	return Op(t) ? e.height : e.width;
}
function Op(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function kp(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Ap(e) {
	return e.startsWith("top") ? `bottom${jp(e)}` : e.startsWith("bottom") ? `top${jp(e)}` : e.startsWith("left") ? `right${jp(e)}` : `left${jp(e)}`;
}
function jp(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Mp = {
	start: 0,
	end: 0
};
function Np(e, t) {
	let n = getComputedStyle(e);
	return Op(t) ? {
		start: Pp(n.paddingLeft) + Pp(n.borderLeftWidth),
		end: Pp(n.paddingRight) + Pp(n.borderRightWidth)
	} : {
		start: Pp(n.paddingTop) + Pp(n.borderTopWidth),
		end: Pp(n.paddingBottom) + Pp(n.borderBottomWidth)
	};
}
function Pp(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Fp(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Lp(t.top, t.height, n.height, r, a);
}
function Ip(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Lp(t.left, t.width, n.width, r, a);
}
function Lp(e, t, n, r, i) {
	let a = jp(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Rp() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, zp(r))
	};
}
function zp(e) {
	let t = document.querySelector(`[${un}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Bp(e, t, n) {
	if (ap(e)) return;
	let r = e.getBoundingClientRect(), i = Rp();
	e.style.left = `${Vp(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Vp(n, r.height, i.top, i.bottom)}px`;
}
function Vp(e, t, n, r) {
	return e + t <= r - Gf ? e : e - t >= n + Gf ? e - t : n + Hp(e - n, t, r - n);
}
function Hp(e, t, n) {
	return Math.max(Gf, Math.min(e, n - t - Gf));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Up = 32;
function R(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Wp(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Wp(e, t, n) {
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
		if (r.size > Up) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Gp(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Kp = "data-ui-dialog", qp = "data-ui-dialog-modal", Jp = "data-ui-dialog-backdrop", Yp = "data-ui-dialog-close-backdrop", Xp = "data-ui-dialog-close-escape", Zp = `[${Kp}]:not([hidden]), dialog[open]`, Qp = "dialog:modal";
function $p(e) {
	let t = e.querySelectorAll(`[${Kp}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function em(e) {
	let t = e.querySelectorAll(Qp);
	if (t.length > 0) return t[t.length - 1];
	let n = $p(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function tm(e) {
	let t = typeof document > "u" ? null : em(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var nm = /* @__PURE__ */ new Set(), rm = null;
function im(e) {
	rm = e;
}
function am(e) {
	let t = e.composedPath(), n = rm?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var om = /* @__PURE__ */ new Map(), sm = 0, cm = !1;
function lm() {
	cm || (cm = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || k(e) || fm(bc(e.target)) && e.preventDefault();
	}, !0));
}
function um() {
	for (let e of nm) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function dm(e) {
	for (let t of nm) t.hearRefusedClick(e);
}
function fm(e) {
	let t = [];
	for (let e of nm) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...om.keys()]) n.has(e) || om.delete(e);
	for (let { popup: e } of t) om.has(e) || om.set(e, ++sm);
	let r = pm(t, (e) => om.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function pm(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var mm = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), nm.add(this), lm();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = am(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = am(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = am(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? tm(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, hm = /\p{M}/gu, gm = ".ui-text__title";
function _m(e, t) {
	return vm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function vm(e, t) {
	return xm(e, bm(t));
}
function ym(e, t) {
	return t.every((t) => e.includes(t));
}
function bm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function xm(e, t) {
	let n = e.normalize("NFD").replace(hm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Sm(e) {
	return e.querySelector(gm)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Cm = class {
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
		if (t === null || E(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(Tr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, wm(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Tr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || k(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Tr);
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
function wm(e, t, n, r) {
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
function Tm() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
//#endregion
//#region src/interactions/sheet-swipe.ts
var Em = "data-ui-sheet-dragging", Dm = "--ui-sheet-drag", Om = 6, km = 24, Am = 1 / 3, jm = .5;
function Mm(e, t, n) {
	return e > t * Am || n > jm && e > Om;
}
function Nm(e, t, n) {
	let r = null;
	e.style.removeProperty(Dm), e.removeAttribute(Em);
	let i = (n) => {
		if (r = null, !n.isPrimary || n.button !== 0 || t.scrollTop > 0 || n.pointerType !== "touch" && n.clientY - e.getBoundingClientRect().top > km) return;
		let i = {
			y: n.clientY,
			time: n.timeStamp
		};
		r = {
			pointerId: n.pointerId,
			startX: n.clientX,
			startY: n.clientY,
			moving: !1,
			previous: i,
			last: i
		};
	}, a = (t) => {
		if (r === null || t.pointerId !== r.pointerId) return;
		let n = t.clientY - r.startY, i = Math.abs(t.clientX - r.startX);
		if (!r.moving) {
			if (i > Om && i > Math.abs(n) || n < -6) {
				r = null;
				return;
			}
			if (n <= Om) return;
			r.moving = !0, e.setAttribute(Em, ""), Pm(e, t.pointerId);
		}
		r.previous = r.last, r.last = {
			y: t.clientY,
			time: t.timeStamp
		}, e.style.setProperty(Dm, `${Math.max(0, n)}px`);
	}, o = (t) => {
		if (r === null || t.pointerId !== r.pointerId) return;
		let i = r;
		if (r = null, !i.moving) return;
		Tm(), e.removeAttribute(Em);
		let a = Math.max(0, t.clientY - i.startY), o = i.last.time - i.previous.time, s = o > 0 ? (i.last.y - i.previous.y) / o : 0;
		t.type === "pointerup" && Mm(a, e.getBoundingClientRect().height, s) ? n() : e.style.setProperty(Dm, "0px");
	}, s = (e) => {
		let t = e.touches[0];
		r !== null && e.cancelable && t !== void 0 && (r.moving || t.clientY > r.startY) && e.preventDefault();
	};
	return e.addEventListener("pointerdown", i), e.addEventListener("pointermove", a), e.addEventListener("pointerup", o), e.addEventListener("pointercancel", o), e.addEventListener("touchmove", s, { passive: !1 }), () => {
		r = null, e.removeAttribute(Em), e.removeEventListener("pointerdown", i), e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", o), e.removeEventListener("pointercancel", o), e.removeEventListener("touchmove", s);
	};
}
function Pm(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Fm = "data-ui-sheet-covered", Im = "ui-sheet-scrim", Lm = "data-ui-sheet-scrim-leaving", Rm = 400, zm = "ui-sheet__back", Bm = "ui.sheet.back", Vm = [], Hm = null, Um = !1, Wm = !1;
function Gm(e, t) {
	if (Km(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : Km(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = ap(e);
	e.setAttribute(rp, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Mf(e));
	let a = null;
	e.querySelector(`:scope > .${zm}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Fm, ""), a = qm(t), e.prepend(a)), Jm(), op(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Nm(e, e, () => Ym(e))
	};
	Vm.push(o), Xm(), queueMicrotask(() => Qm(o));
}
function Km(e) {
	return Vm.find((t) => t.popup === e) ?? null;
}
function qm(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Sm(e.anchor).trim();
	return t.type = "button", t.className = zm, t.tabIndex = -1, t.textContent = n, T.write(t, "aria-label", Bm, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Jm() {
	Hm === null && (Hm = document.createElement("div"), Hm.className = Im, Hm.setAttribute("aria-hidden", "true"), Hm.addEventListener("mousedown", (e) => e.preventDefault())), Hm.parentElement === null && document.body.appendChild(Hm), Hm.removeAttribute(Lm), op(Hm);
}
function Ym(e) {
	for (let t = Km(e); t !== null; t = t.parent) t.opening.close();
}
function Xm() {
	Um || (Um = !0, window.addEventListener("pointerdown", () => {
		Wm = !0;
	}, !0), window.addEventListener("pointerup", Zm, !0), window.addEventListener("pointercancel", Zm, !0), window.addEventListener("keydown", (e) => {
		let t = Vm.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && _d(t.popup, e);
	}, !0), matchMedia(Lf).addEventListener("change", () => {
		for (let e of Vm.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function Zm() {
	if (Wm = !1, Hm?.hasAttribute(Lm) !== !0) return;
	let e = () => {
		Hm?.hasAttribute(Lm) === !0 && Vm.length === 0 && (Hm.removeAttribute(Lm), Hm.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Rm);
}
function Qm(e) {
	if (!Vm.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), I(t)), e.hidden = $m(t);
}
function $m(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Hm || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function eh(e) {
	let t = Km(e);
	if (t !== null) {
		for (let e of [...Vm].reverse()) if (e === t || th(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function th(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function nh(e) {
	let t = Km(e);
	if (t !== null) {
		for (let e of Vm.filter((e) => e.parent === t)) e.opening.close(), nh(e.popup);
		eh(e), Vm.splice(Vm.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Fm), Vm.length === 0 && rh(), dp(e, () => {
			Km(e) === null && (e.removeAttribute(rp), e.removeAttribute(Fm), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function rh() {
	Hm?.matches(":popover-open") === !0 && (Wm ? Hm.setAttribute(Lm, "") : Hm.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function ih(e, t) {
	return e.isConnected && !E(e) && !(t && O(e));
}
var ah = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new mm({
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
			isBehind: (e) => tm(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && sh(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && ph(this.options.closesOnTab, t)).map(({ opening: e }) => ({
			owner: e.owner,
			popup: e.popup
		}));
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
		if (!(e.target instanceof Node) || id() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		lh(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, fh(t)) && !tm(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!lh(e)) return;
		let t = xd(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && ih(n.owner, this.closesWhenReadOnly) && !tm(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !ih(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), mh(e, !0), wh(this), yh(e), e.focus !== void 0 && e.focus !== !1 && Cd(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (ap(e.popup) || ph(this.options.sheetOnPhone, e) && ip()) {
			Gm(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !ph(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && tp(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), bh(r.popup), eh(r.popup), r.popup.contains(document.activeElement) && jd(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), mh(r, !1), ap(r.popup) ? nh(r.popup) : pp(r.popup), this.entries.size === 0 && Th(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (ih(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !uh() && dh(e);
		}
	}
}, oh = /* @__PURE__ */ new Set();
function sh(e) {
	oh.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !k(e) && e.target instanceof Node && ch(e.target);
	}, !0), oh.add(e);
}
function ch(e) {
	let t = [...oh].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of pm(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function lh(e) {
	return e instanceof Element && e.isConnected && ns(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function uh() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ns(e);
}
function dh(e) {
	Ad(e), I(e);
}
function fh(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function ph(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function mh(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var hh = /* @__PURE__ */ new Map(), gh = /* @__PURE__ */ new Set(), _h = /* @__PURE__ */ new WeakSet(), vh = [];
function yh(e) {
	let { popup: t } = e;
	hh.set(t, e.owner), !_h.has(t) && (_h.add(t), t.addEventListener("pointerenter", () => {
		hh.has(t) && (gh.add(t), xh());
	}), t.addEventListener("pointerleave", () => {
		gh.delete(t) && xh();
	}));
}
function bh(e) {
	hh.delete(e), gh.delete(e) && xh();
}
function xh() {
	let e = /* @__PURE__ */ new Set();
	for (let t of gh) {
		let n = hh.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of vh) e.has(t) || t.removeAttribute(Mr);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(Mr, "");
	vh = [...e];
}
var Sh = /* @__PURE__ */ new Set(), Ch = null;
function wh(e) {
	Sh.add(e), Ch === null && typeof MutationObserver == "function" && (Ch = new MutationObserver(() => {
		for (let e of [...Sh]) e.closeStranded();
	}), Ch.observe(document, {
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
function Th(e) {
	Sh.delete(e), !(Sh.size > 0 || Ch === null) && (Ch.disconnect(), Ch = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Eh = "ui-flyout", Dh = "ui-flyout--open", Oh = "ui-flyout__anchor", kh = "data-ui-flyout-no-backdrop-close", Ah = "data-ui-flyout-no-escape-close", jh = `${Eh}--`, Mh = "bottom-start", Nh = class {
	root;
	flyouts = new ah({
		show: ({ owner: e }) => e.classList.add(Dh),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Ah : kh)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Eh}`)) this.place(e);
		R(this.root, `.${Eh}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Xr}`), n = e.querySelector(`:scope > .${Oh}`);
		if (t === null) return;
		let r = Ph(n, t);
		if (!e.classList.contains(Dh)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Ih(n) ?? e,
			placement: { placement: Lh(e) },
			openers: r === null ? [] : [r],
			focus: !id() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Dh) && (e.classList.remove(Dh), Fh(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Oh}`)?.closest(`.${Eh}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Dh), this.place(t), this.flyouts.isOpen(t) && Fh(t, !0);
		}
	}
};
function Ph(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Wu) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", vi(t, "ui-flyout-content")), n;
}
function Fh(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Ih(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Lh(e) {
	for (let t of e.classList) {
		if (!t.startsWith(jh)) continue;
		let e = t.slice(jh.length);
		if (Wf(e)) return e;
	}
	return Mh;
}
//#endregion
//#region src/interactions/drag-marks.ts
var Rh = `:scope > :is(${Pc}, .ui-image-input__surface)`;
function zh(e, t, n, r, i, a = [], o = "move") {
	Bh(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Vh(e, i, o);
}
function Bh(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Vh(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function Hh(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Uh(e, t) {
	let n = t && e.querySelector(Rh) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ve, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Wh = "data-ui-file-drop-over", Gh = 120, Kh = "refused", qh = !1;
function Jh(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Qh();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Yh(e, t, n), !0);
	e.root.addEventListener("dragend", () => ig(t.marked), !0), window.addEventListener("blur", () => ig(t.marked)), e.root.addEventListener("paste", (t) => Xh(e, t), !0);
}
function Yh(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && ig(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		$h(n), n.type !== "dragleave" && ig(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || rg(r, a) : t.leaving = window.setTimeout(() => ig(r), Gh);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = eg(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && rg(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Wh;
		r.set(a, o), a.setAttribute(o, t ? Kh : ""), Uh(a, o === Wh);
		return;
	}
	ig(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => ag(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Xh(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => ag(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Zh(e, t, n) {
	for (let r = t.closest(`[${ae}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${_r}="${x(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Qh() {
	if (!qh) {
		qh = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && $h(e);
		});
	}
}
function $h(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function eg(e, t) {
	let n = tg(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => ng(t, e)));
}
function tg(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function ng(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function rg(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Uh(t, !1);
}
function ig(e) {
	for (let t of [...e.keys()]) rg(e, t);
}
function ag(e, t) {
	let n = tg(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : ng(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var og = "/_ne/files/upload", sg = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], cg = /* @__PURE__ */ new Map(), lg = !1;
function ug(e, t, n, r) {
	let i = Number(e.getAttribute(hr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return cg.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of cg.keys()) e.isConnected || cg.delete(e);
	return cg.set(e, c), dg(e, c), pg(), a;
}
function dg(e, t) {
	let n = fg(t.limit, T.language);
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
function fg(e, t) {
	let n = e, r = "byte";
	for (let e of sg) {
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
function pg() {
	lg || (lg = !0, T.onChange(() => {
		for (let [e, t] of cg) e.isConnected ? dg(e, t) : cg.delete(e);
	}));
}
function mg(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", og), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var hg = () => {};
function gg(e) {
	return {
		uploadAsync: (e, t) => mg(e, t ?? hg),
		accepts: ag,
		takeWithinSizeLimit: (t, n, r) => ug(t, n, r, e)
	};
}
function _g(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var vg = "ui-open-picker";
function yg(e) {
	return !e.dispatchEvent(new Event(vg, {
		bubbles: !0,
		cancelable: !0
	}));
}
function bg(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || O(n) || E(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var xg = "ui-file-input", Sg = "ui-file-input__row", Cg = "ui-file-input__native", wg = "ui-file-input__field", Tg = "ui-file-input__selection", Eg = "data-ui-file-dragging", Dg = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, T.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(vg, (e) => bg(e, {
			rootSelector: `.${xg}`,
			nativeSelector: `.${Cg}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Jh({
			root: this.root,
			draggingAttribute: Eg,
			resolveTarget: (e) => {
				let t = e.closest(`.${Sg}`)?.closest(`.${xg}`) ?? null, n = t === null ? Zh(this.root, e, `.${xg}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Cg}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || O(r) || E(r)
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
		let t = e.target.closest(`[${gr}], .${Sg}`);
		if (t === null || E(t) || O(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${xg}`)?.querySelector(`.${Cg}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cg)) return;
		let t = e.target.closest(`.${xg}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${wg}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = ug(e, t, e.querySelector(`.${Cg}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await mg(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => T.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Og(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => T.text("ui.file.failed")), this.publishSelection(e, "");
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
		_g(e.querySelector(`.${Tg}`), t);
	}
};
function Og(e) {
	return e.length === 1 ? e[0].name : () => T.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var kg = "ne-picture-as-pdf", Ag = "ne-text-snippet", jg = "ne-description", Mg = "ne-table-chart", Ng = "ne-slideshow", Pg = "ne-folder-zip", Fg = "ne-audio-file", Ig = "ne-video-file", Lg = "ne-image", Rg = "ne-code", zg = "ne-draft", Bg = new Map([
	...Wg(kg, "pdf"),
	...Wg(Ag, "txt", "md", "log"),
	...Wg(jg, "doc", "docx", "odt", "rtf"),
	...Wg(Mg, "xls", "xlsx", "ods", "csv", "tsv"),
	...Wg(Ng, "ppt", "pptx", "odp", "key"),
	...Wg(Pg, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Wg(Fg, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Wg(Ig, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Wg(Lg, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Wg(Rg, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Vg = /* @__PURE__ */ new Map([
	["application/pdf", kg],
	["text/csv", Mg],
	["application/msword", jg],
	["application/rtf", jg],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", jg],
	["application/vnd.oasis.opendocument.text", jg],
	["application/vnd.ms-excel", Mg],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Mg],
	["application/vnd.oasis.opendocument.spreadsheet", Mg],
	["application/vnd.ms-powerpoint", Ng],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Ng],
	["application/vnd.oasis.opendocument.presentation", Ng],
	["application/zip", Pg],
	["application/x-zip-compressed", Pg],
	["application/x-7z-compressed", Pg],
	["application/vnd.rar", Pg],
	["application/x-rar-compressed", Pg],
	["application/x-tar", Pg],
	["application/gzip", Pg],
	["application/json", Rg],
	["application/xml", Rg],
	["text/xml", Rg],
	["text/html", Rg]
]), Hg = /* @__PURE__ */ new Map([
	["image", Lg],
	["audio", Fg],
	["video", Ig],
	["text", Ag]
]);
function Ug(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Bg.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Vg.get(i) ?? (a < 0 ? void 0 : Hg.get(i.slice(0, a))) ?? zg;
}
function Wg(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Gg = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Kg(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Gg.includes(t.slice(0, n).toLowerCase());
}
function qg(e) {
	return Kg(e) ? String(e) : void 0;
}
var Jg = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Yg(e) {
	let t = $g(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Jg.some((e) => n.startsWith(e));
}
function Xg(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Zg(e);
}
function Zg(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Qg(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function $g(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function e_(e) {
	return t_(e) !== null;
}
function t_(e) {
	let t = $g(e), n = t.toLowerCase();
	return Zg(t) || Qg(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function n_(e) {
	return t_(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var r_ = "mask:", i_ = "ui-icon--image", a_ = "ui-icon--mask";
function o_(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(r_) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? t_(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function s_(e) {
	let t = o_(e);
	return t === null ? "" : c_(t.source);
}
function c_(e) {
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
var l_ = "ui-icon", u_ = "data-ui-icon", d_ = "--ui-icon-url";
function f_(e, t) {
	e.classList.add(l_);
	for (let t of Array.from(e.classList)) m_(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(d_);
	let n = h_(t);
	if (n.length === 0) {
		e.removeAttribute(u_);
		return;
	}
	e.setAttribute(u_, ""), e.classList.add(n);
	let r = o_(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(d_, c_(r.source));
}
var p_ = "ui-icon-glyph--";
function m_(e) {
	return e === i_ || e === a_ || e.startsWith(p_);
}
function h_(e) {
	let t = o_(e);
	return t === null ? g_(e) : t.tinted ? a_ : i_;
}
function g_(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = p_;
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
var __ = 1024, v_ = 16777216;
function y_(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function b_(e, t) {
	let n = A_(t.zoom, 1, 4), r = k_(e) / n / 2;
	return {
		x: A_(t.x, r, e.width - r),
		y: A_(t.y, r, e.height - r),
		zoom: n
	};
}
function x_(e, t) {
	let n = k_(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function S_(e, t, n) {
	return t.zoom * n / k_(e);
}
function C_(e, t, n, r, i) {
	let a = S_(e, t, n);
	return a > 0 ? b_(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function w_(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = A_(t.zoom * r, 1, 4), o = S_(e, t, n), s = S_(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? b_(e, {
		...t,
		zoom: a
	}) : b_(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function T_(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function E_(e, t) {
	return Math.min(1, t * 4 / k_(e), Math.sqrt(v_ / (e.width * e.height)));
}
function D_(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function O_(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function k_(e) {
	return Math.min(e.width, e.height);
}
function A_(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function j_(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Kp, e.key), t.setAttribute(qp, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Xp, ""), t.setAttribute(Yp, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Jp, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? Yr : `${Yr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var M_ = class {
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
}, N_ = 100 / 3, P_ = 1, F_ = 2;
function I_(e, t = N_) {
	let n = e.deltaMode === P_ ? N_ : e.deltaMode === F_ ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function L_(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var R_ = {
	notch: 100,
	pixels: I_
}, z_ = "ui-image-crop", B_ = "ui-image-crop-title", V_ = new M_("data-ui-image-crop-part"), H_ = "data-ui-image-crop-frame", U_ = 10, W_ = 1.2, G_ = 380, K_ = 100, q_ = .92, z = null, J_ = !1, Y_ = null, X_ = !1;
async function Z_(e, t, n, r = lv) {
	if (z !== null || J_) return "cancelled";
	J_ = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		J_ = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Y_ ??= Q_();
		let o = Y_;
		o.dialog.isConnected || document.body.append(o.dialog), z = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: y_(a),
			finish: (t) => {
				z = null, e.close(z_), a.release(), i(t);
			}
		}, T.write(o.title, null, "ui.crop.title"), T.write(o.stage, "aria-label", "ui.crop.frame"), T.write(o.zoom, "aria-label", "ui.crop.zoom"), T.write(o.cancel, null, "ui.crop.cancel"), T.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(H_, n.frame), e.open(z_), sv(o);
	});
}
function Q_() {
	let { dialog: e, surface: t } = j_({
		key: z_,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: B_,
		closesOnEscapeAndBackdrop: !1
	}), n = V_.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = B_;
	let r = V_.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = V_.element("canvas", "ui-image-crop__canvas"), a = V_.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = V_.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = V_.button("ui-button--outline", "cancel"), c = V_.button("ui-button--primary", "apply");
	t.append(n, r, o, V_.actions(s, c));
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
		let t = V_.pressed(e);
		t === "cancel" ? z?.finish("cancelled") : t === "apply" && $_();
	}), e.addEventListener("keydown", (e) => ev(l, e)), o.addEventListener("input", () => av(l, Number(o.value))), r.addEventListener("wheel", (e) => tv(l, e), { passive: !1 }), window.addEventListener("resize", () => cv(l)), new Cm({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => z === null ? null : {
			last: t,
			start: z.view
		},
		move: (e, t, n) => {
			e.last !== null && nv(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			z !== null && (z.view = t.start, sv(l));
		},
		pinch: (e, t) => {
			e.last = null, rv(l, t);
		}
	}), l;
}
async function $_() {
	let e = z;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = x_(n, a), s = D_(t.type), c = i.encodeAsync(n, o, T_(o, r.size), s);
	z = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], O_(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function ev(e, t) {
	if (t.defaultPrevented || k(t) || z === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), z.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : U_;
	switch (t.key) {
		case "ArrowLeft":
			nv(e, -n, 0);
			break;
		case "ArrowRight":
			nv(e, n, 0);
			break;
		case "ArrowUp":
			nv(e, 0, -n);
			break;
		case "ArrowDown":
			nv(e, 0, n);
			break;
		case "+":
		case "=":
			iv(e, W_);
			break;
		case "-":
		case "_":
			iv(e, 1 / W_);
			break;
		case "Enter":
			$_();
			break;
		default: return;
	}
	t.preventDefault();
}
function tv(e, t) {
	if (z === null) return;
	t.preventDefault();
	let n = I_(t, e.stage.clientHeight), r = t.ctrlKey ? K_ : G_;
	iv(e, 2 ** (-n.y / r), ov(e, t.clientX, t.clientY));
}
function nv(e, t, n) {
	z !== null && (z.view = C_(z.source, z.view, e.frame.clientWidth, t, n), sv(e));
}
function rv(e, t) {
	if (z === null) return;
	let n = C_(z.source, z.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	z.view = w_(z.source, n, e.frame.clientWidth, t.factor, ov(e, t.center.x, t.center.y)), sv(e);
}
function iv(e, t, n) {
	z !== null && (z.view = w_(z.source, z.view, e.frame.clientWidth, t, n), sv(e));
}
function av(e, t) {
	z !== null && Number.isFinite(t) && t > 0 && iv(e, t / z.view.zoom);
}
function ov(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function sv(e) {
	if (z === null) return;
	let t = z.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), cv(e);
}
function cv(e) {
	X_ || z === null || (X_ = !0, requestAnimationFrame(() => {
		if (X_ = !1, z === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = z.view, a = S_(z.source, i, t);
		z.imaging.paint(e.canvas, z.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: z.source.width * a,
			height: z.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var lv = {
	decodeAsync: async (e, t) => {
		let n = await uv(e);
		if (n === null) return null;
		let r = n, i = E_(r, t);
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
		}, r, q_);
	})
};
async function uv(e) {
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
var dv = "ui-image-input", fv = "ui-image-input--multiple", pv = "ui-image-input__surface", mv = "ui-image-input__native", hv = "ui-image-input__picture", gv = "ui-image-input__text", _v = "ui-image-input__selection", vv = "ui-image-input__selections", yv = "ui-image-input__tiles", bv = "ui-image-input__tile", xv = "ui-image-input__remove", Sv = "ui-image-input__progress", Cv = "ui-image-input__tile--file", wv = "ui-image-input__file-glyph", Tv = "ui-image-input__file-name", Ev = "ui-image-input__file-size", Dv = "SelectionId", Ov = "--ui-image-progress", kv = "data-ui-image-preview", Av = "data-ui-image-dragging", jv = "data-ui-image-tiles", Mv = class {
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
	holding = /* @__PURE__ */ new Set();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${dv}`)), R(this.root, `.${dv}`, {
			childList: !0,
			attributeFilter: [
				mr,
				Qe,
				Lr
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Dv && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(ta(e.components, `.${dv}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(vg, (e) => bg(e, {
			rootSelector: `.${dv}`,
			nativeSelector: `.${mv}`,
			pressed: (e) => e.querySelector(`.${pv}`)
		})), this.root.addEventListener(Mc, (e) => this.handleDraftDropped(e)), Jh({
			root: this.root,
			draggingAttribute: Av,
			resolveTarget: (e) => {
				let t = e.closest(`.${pv}`), n = t?.closest(`.${dv}`) ?? null, r = n === null ? Zh(this.root, e, `.${dv}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${pv}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${mv}`)?.getAttribute("accept") ?? "",
					multiple: Nv(i),
					refused: O(i) || E(a)
				};
			},
			onFiles: (e, t) => void (Nv(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Nv(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${hv}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || zv(e, e.getAttribute("data-ui-image-caption") ?? Hv(n)), Vv(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Lr);
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
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Nv(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${gr}]`), n = t?.closest(`.${dv}`) ?? null;
		t === null || n === null || O(n) || E(t) || n.querySelector(`.${mv}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xv}`), n = t?.closest(`.${dv}`) ?? null;
		if (t === null || n === null || O(n) || E(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(mv)) return;
		let t = e.target.closest(`.${dv}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Nv(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${dv}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), _g(t.querySelector(`.${_v}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${pv}`), r = e.querySelector(`.${hv}`), i = e.querySelector(`.${_v}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || ug(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(kv, ""), r.setAttribute("src", o.url), zv(e, a.name), Vv(e, !0), n.classList.add(Kr);
		try {
			let t = await mg([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, _g(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (Bv(e), _g(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(Kr);
		}
	}
	async cropAsync(e, t) {
		let n = Fv(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Z_(this.dialogs, t, {
				frame: n,
				size: Iv(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${yv}`), r = ug(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Lv(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await mg([t], (e) => r.element.style.setProperty(Ov, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Kr), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Pv(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove(), Pv(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${vv}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Lr, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(kv), t || zv(e, ""));
	}
};
function Nv(e) {
	return e.classList.contains(fv);
}
function Pv(e, t) {
	e.hasAttribute(jv) !== t.length > 0 && e.toggleAttribute(jv, t.length > 0);
}
function Fv(e) {
	let t = e.getAttribute($e);
	return t === "square" || t === "circle" ? t : null;
}
function Iv(e) {
	let t = Number(e.getAttribute(et));
	return Number.isInteger(t) && t > 0 ? t : __;
}
function Lv(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${bv} ${Kr}`, n.type = "button", n.className = xv, r.className = Sv, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, T.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Rv(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Rv(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Rv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Cv), e.setAttribute("title", n.name), r.className = wv, r.setAttribute("aria-hidden", "true"), f_(r, Ug(n.name, n.type)), i.className = Tv, i.textContent = n.name, a.className = Ev, a.textContent = fg(n.size, T.language), T.write(t, "aria-label", "ui.file.remove"), [
		r,
		i,
		a
	];
}
function zv(e, t) {
	let n = e.querySelector(`.${gv}`);
	n !== null && (Ro(n, null), n.textContent !== t && (n.textContent = t));
}
function Bv(e) {
	let t = e.querySelector(`.${gv}`);
	t !== null && T.write(t, null, "ui.file.failed");
}
function Vv(e, t) {
	let n = e.querySelector(`.${pv}`);
	n !== null && T.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Hv(e) {
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
var Uv = "ui-key-value-action__value", Wv = "ui-key-value-action--editable", Gv = "ui-text__title", Kv = "ui-row-form-", qv = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", Jv = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${gc}`), !1), R(this.root, `.${gc}`, {
			childList: !0,
			attributeFilter: [cr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && $v(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Qv(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), Yv(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${vc} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Kv}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${_c} [${Ye}]:not([${Vt}])`)) t.setAttribute(Vt, n);
		t.setAttribute(Ur, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Vt}="${t}"], [${Ur}="${t}"]`)) n.removeAttribute(Vt), n.removeAttribute(Ur);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${_c} [${Ye}]`)) {
			if (Oc(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Nc(e), this.judge(e);
	}
	judge(e) {
		let t = Zv(e);
		for (let n of e.querySelectorAll(`.${_c} [${Ye}]`)) this.options.validation.judgeShown(n, Oc(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${_c} :is(input, textarea, select)`);
		if (n !== null) {
			if (Oc(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Zv(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Dc(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && A(e)) {
			Xv(e);
			return;
		}
		if (e.defaultPrevented || k(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Sc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(ei), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${vc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !E(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Yv(e) {
	for (let t of e.querySelectorAll(`:scope > .${_c}`)) {
		let e = t.querySelector(qv) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(lr, e);
	}
}
function Xv(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${gc}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Wv}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Wu) ?? null;
	n === null || E(n) || (e.preventDefault(), n.click());
}
function Zv(e) {
	return e.querySelector(`.${Uv} .${Gv}`)?.textContent?.trim() ?? "";
}
function Qv(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function $v(e) {
	let t = e.closest(`.${vc} button`), n = t?.closest(`.${vc}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var ey = `.ui-button[${wt}="pressed"]`, ty = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ey);
		t === null || E(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, ny = `${Fc}, [tabindex], [contenteditable], ${ei}, [${Ze}]`, ry = ":scope > input.ui-field, :scope > textarea.ui-field", iy = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Pc);
		if (t === null || e.target !== t && e.target.closest(ny) !== null) return;
		let n = t.querySelector(ry);
		if (!Oc(n) || n.readOnly || E(n) || O(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, ay = "data-ui-input-debounce", oy = `input[${ay}], textarea[${ay}]`;
function sy(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(oy);
}
var cy = /* @__PURE__ */ new Set();
function ly() {
	for (let e of cy) if (e.waiting) return !0;
	return !1;
}
function uy() {
	for (let e of cy) e.commitAll();
}
function dy(e) {
	for (let t of cy) t.drop(e);
}
var fy = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), cy.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!sy(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!sy(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(ay));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!sy(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, py = "data-ui-submit-on-enter", my = "data-ui-runs-on-enter", hy = "enter", gy = "escape", _y = {
	name: hy,
	registration: { settlesValue: !0 }
}, vy = "ui-commit-in-place", yy = class {
	root;
	committedValue = "";
	changes = 0;
	edited = /* @__PURE__ */ new WeakSet();
	focusedField = null;
	lastCommitted = "";
	propertyPatchEngine;
	constructor(e = {}) {
		this.root = e.root ?? document, this.propertyPatchEngine = e.propertyPatchEngine, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.committedValue = e.target.value, this.focusedField = e.target, this.lastCommitted = e.target.value);
		}), this.root.addEventListener("input", (e) => {
			e.target !== null && this.edited.add(e.target);
		}, !0), this.root.addEventListener("change", (e) => {
			this.changes++, e.target !== null && this.edited.delete(e.target), e.target === this.focusedField && this.focusedField !== null && (this.lastCommitted = this.focusedField.value), e.target instanceof HTMLTextAreaElement && (this.committedValue = e.target.value);
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(vy, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || k(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), xc(t) ? this.runEscape(t, e) : this.leave(t)) : by(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : xy(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (Dc(t)) {
			if (e.preventDefault(), by(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && xc(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || E(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(hy, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		dy(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = xd(e);
		e.blur(), Sd(e, n), e.dispatchEvent(new Event(gy, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(Vt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Ur}="${x(t)}"]`);
		n !== null && !E(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = xd(e);
		e.blur(), this.changes === t && this.commit(e), Sd(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function by(e, t) {
	return Sy(t) && e.hasAttribute(my);
}
function xy(e, t) {
	return Sy(t) && e.hasAttribute(py) && !e.readOnly && !E(e);
}
function Sy(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var Cy = `img.${tt}`, wy = "%238c8c8c", Ty = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${wy}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${wy}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${wy}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, Ey = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${wy}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${wy}'/%3E%3C/svg%3E`, Dy = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Cy)) (Oy(e) || e.complete && e.naturalWidth === 0) && Ay(e);
		R(this.root, Cy, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !ky(t) && t.removeAttribute(rt), Oy(t) && Ay(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(Cy) && Ay(t);
	}
};
function Oy(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function ky(e) {
	let t = e.getAttribute("src");
	return t === Ty || t === Ey;
}
function Ay(e) {
	let t = e.getAttribute(nt);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	ky(e) || (e.setAttribute(rt, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? Ey : Ty));
}
//#endregion
//#region src/items/radio-row-decorator.ts
var jy = "ui-radio-group__input", My = "ui-radio-group__dot", Ny = {
	kind: "radio",
	decorate: Py
};
function Py(e) {
	let t = document.createElement("input");
	t.className = jy, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = My, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Fy = "data-ui-radio-value", Iy = "ui-radio-group", Ly = "ui-radio-group__item", Ry = "data-ui-radio-group-name", zy = "data-ui-radio-bind-value-id", By = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Iy}`)]);
		for (let e of this.root.querySelectorAll(`.${Iy}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Iy}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Vy));
			for (let e of new Set(t.map((e) => e.closest(`.${Iy}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Fy, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Iy}`)) {
			let n = e.getAttribute(Ry);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Ry), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Ry, a);
			for (let e of dl(r, `.${jy}`, `.${Iy}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Iy}`)) n.has(e.getAttribute(Ry) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Fy), n = e.getAttribute(Ry), r = e.getAttribute(zy);
		for (let i of dl(e, `.${jy}`, `.${Iy}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Ye, r), i.checked = i.value === t;
			let e = Hy(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Vy(e) {
	return e.classList.contains(Iy) ? [e] : [...e.querySelectorAll(`.${Iy}`)];
}
function Hy(e) {
	let t = e.closest(`.${Ly}`);
	return t !== null && D(t);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Uy = "data-ui-search-debounce", Wy = "data-ui-search-min-length", Gy = "data-ui-search-manual", Ky = "data-ui-search-answered", qy = "ui-search__input", Jy = "ui-select__list", Yy = "ui-select__option", Xy = 300, Zy = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qy) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		$y(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Uy), i = r === null ? Xy : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Xy));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || k(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qy)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(Gy)) && Qy(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Qy(e) {
	let t = Number(e.getAttribute(Wy) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function $y(e) {
	if (e.hasAttribute(Ky)) return;
	let t = e.closest(`.${ai}`), n = t?.querySelector(`.${Jy}`);
	if (t == null || n == null) return;
	let r = Qy(e) ? _m(e.value, e) : [], i = eb(n, (e) => r.length === 0 || ym(vm(Sm(e), e), r));
	rb(t, n, r.length > 0 && i === 0);
}
function eb(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && tb(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Yy)) continue;
		let e = t(a);
		tb(a, e), r ||= e, e && i++;
	}
	return n !== null && tb(n, r), i;
}
function tb(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function nb(e) {
	let t = e.querySelector(`.${Jy}`);
	t !== null && rb(e, t, eb(t, (e) => e.style.display !== "none") === 0);
}
function rb(e, t, n) {
	let r = t.querySelector(`:scope > [${vt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${gt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(vt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var ib = 500, ab = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > ib) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += vm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (vm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function ob(e) {
	return k(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var sb = "data-ui-select-value", cb = "data-ui-select-placement", lb = "ui-select--open", ub = "ui-select__trigger-content", db = "data-ui-select-content", fb = "ui-select__placeholder", pb = "ui-input__affix-icon--prefix", mb = "ui-select__popup", hb = "ui-select__list", gb = "ui-select__option", _b = "ui-select__value-input", vb = "data-ui-select-clear", yb = "ui-search", bb = "ui-search__input", xb = "data-ui-active", Sb = "data-ui-list-keyboard", Cb = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), wb = "ui-multi-select", Tb = "ui-multi-select__chips", Eb = "ui-multi-select__chip", Db = "ui-multi-select__chip-label", Ob = "ui-multi-select__chip-remove", kb = "data-ui-select-chip", Ab = "data-ui-select-chips", jb = "data-ui-select-max", Mb = "data-ui-select-free-text", Nb = "ui-multi-select__entry", Pb = "data-ui-select-tag-entry", Fb = [
	sb,
	Lr,
	jb,
	"class",
	_
];
function Ib(e) {
	return e === null || O(e) || E(e);
}
function Lb(e) {
	return e.classList.contains(wb);
}
function Rb(e) {
	return e.classList.contains(yb);
}
function zb(e) {
	return Rb(e) ? e.querySelector(`.${bb}`) : null;
}
function Bb(e) {
	return e.hasAttribute(Mb) ? e.querySelector(`:scope > .${ti} .${Nb}`) : null;
}
function Vb(e) {
	return zb(e) ?? Bb(e);
}
function Hb(e) {
	return Bb(e) ?? e.querySelector(".ui-select__trigger");
}
function Ub(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Nb) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function Wb(e) {
	return dl(e, `.${mb} .${gb}`, `.${ai}`);
}
function Gb(e) {
	let t = Wb(e).filter((e) => !D(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(xb)) ?? null;
}
function Kb(e) {
	for (let t of dl(e, `.${hb}`, `.${ai}`)) {
		let e = t.querySelector(`:scope > .${gb}[${xb}]:not([${Ar}])`) !== null;
		t.hasAttribute(Sb) !== e && t.toggleAttribute(Sb, e);
	}
}
function qb(e) {
	return e === null ? null : Sm(e);
}
function Jb(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ae), t.removeAttribute(_), t.removeAttribute(se), t.removeAttribute(oe);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Yb = class {
	root;
	popups = new ah({
		show: ({ owner: e }) => e.classList.add(lb),
		hide: ({ owner: e }) => {
			e.classList.remove(lb), this.markActive(e, null);
			let t = e.querySelector(`.${mb}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => Vb(e) === null
	});
	typeAhead = new ab();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${ai}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ox(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Fb,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${vb}], .${Ob}`) !== null || tx(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Ib(r)) return;
		this.releaseRefusal(r);
		let i = ll(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Ub(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !k(e) ? Ub(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Pb) !== "first-suggestion" || !Wb(t.select).some((e) => e.hasAttribute(xb)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Ub(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Ib(t.select) || !sl(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, cl(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = tl(e.getAttribute(Lr)), a = nl(e.getAttribute(jb)), o = ul(i, n.map((t) => ({
			text: t,
			key: nx(e, t) ?? t
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
		$y(t);
		let n = t.value.trim().length > 0, r = n ? Zb(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Pb) === "first-suggestion" && (this.markActive(e, i), i !== null && $b(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Kb(e), Lb(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(sb);
		this.decorateOptions(e);
		let n = t === null ? null : Wb(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${fb}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Wb(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${_b}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), nb(e);
	}
	syncMultiple(e) {
		let t = tl(e.getAttribute(Lr)), n = new Set(t), r = rl(t, nl(e.getAttribute(jb)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Wb(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Bb(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		ix(e, s.map((e) => ({
			key: e,
			label: rx(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Ib(e) && (o.readOnly = Ib(e));
		let c = e.querySelector(`.${fb}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${_b}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Lr, u), nb(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${ti}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${ub}`), a = i?.getAttribute(db) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(db), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Rb(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(_);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = ub;
			let e = r.querySelector(`:scope > .${pb}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Jb(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Wb(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = D(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${gb}`);
		t === null || n === null || n.hasAttribute(xb) || D(n) || E(n) || n.closest(".ui-select") !== t || (Vb(t) === null && (j(Wb(t).filter((e) => !D(e)), n), dd(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ob}`);
		if (t !== null) {
			let n = t.closest(`.${ai}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Ib(n) || this.removeChosen(n, t.closest(`.${Eb}`)?.getAttribute(kb) ?? null));
			return;
		}
		let n = e.target.closest(`[${vb}]`);
		if (n !== null) {
			let t = n.closest(`.${ai}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Ib(t) || (this.clearValue(t), Xb(t)));
			return;
		}
		let r = e.target.closest(`.${ti}`);
		if (r !== null) {
			let t = r.closest(`.${ai}`);
			if (Ib(t)) return;
			e.preventDefault();
			let n = t === null ? null : Bb(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${gb}`);
		if (i === null) return;
		let a = i.closest(`.${ai}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(Wb(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || (this.openSelect !== null && Kb(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gb}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${ai}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && A(e, { alt: !0 })) {
			e.preventDefault();
			let n = Gb(t);
			return n !== null && !Lb(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !Cb.has(e.key) || !A(e) || (e.key === "Home" || e.key === "End") && Oc(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = Ub(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Ib(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? Zb(r).find((e) => e.hasAttribute(xb)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, cl(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, cl(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Tb} > .${Eb}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(kb)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = ex(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Ob}`) ?? (n === 1 ? Hb(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		$y(t);
		let r = Zb(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Ob) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Lb(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Ib(n)) return !0;
				let r = ex(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(kb) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(kb) ?? null);
				let o = a === null ? null : ex(n).find((e) => e.getAttribute(kb) === a) ?? null;
				return o !== null && o.querySelector(`.${Ob}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Ib(t)) return !1;
		e.preventDefault();
		let n = zb(t);
		n !== null && $y(n);
		let r = Zb(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = ob(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(gb))) return !1;
		let r = n.closest(`.${ai}`), i = r !== null && r === this.openSelect;
		if (r === null || Ib(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = zb(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Zb(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(xb)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => qb(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (j(Wb(r).filter((e) => !D(e)), c), $b(r, c), I(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Lb(t) || Ib(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Tb} > .${Eb}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(kb)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(bb) || !t.contains(e.target) ? null : Zb(t).find((e) => e.hasAttribute(xb)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Vb(e), i = Bb(e);
		r !== null && !t && $y(r), nb(e);
		let a = e.querySelector(`.${ti}`), o = e.querySelector(`.${mb}`), s = e.querySelector(`.${hb}`) ?? o, c = e.getAttribute(cb);
		if (a === null || o === null || s === null) return;
		let l = vi(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Wf(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), sx(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Zb(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && id()) {
			j(n, null), this.markActive(e, null), Xb(e);
			return;
		}
		let i = r ?? n[0];
		j(n, i), this.markActive(e, i, id()), $b(e, i), I(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Wb(e), a = Zb(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || id() ? null : a[0] ?? null);
		j(i, null), this.markActive(e, o, id()), o !== null && $b(e, o), !ad() && (I(t), t.select());
	}
	initializeEntry(e, t) {
		j(Wb(e), null), this.markActive(e, t), t !== null && $b(e, t);
	}
	moveCurrent(e, t) {
		let n = Wb(e).filter((e) => !D(e)), r = Ou(t, n, Gb(e), "vertical");
		r !== null && (Vb(e) === null ? Kc(n, r) : $b(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of Wb(e)) r === t ? r.setAttribute(xb, "") : r.hasAttribute(xb) && r.removeAttribute(xb), od(r, r === t && n);
		Kb(e);
		let r = Vb(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", vi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || D(t) || Ib(e)) return;
		if (Lb(e)) {
			let r = il(tl(e.getAttribute(Lr)), n, nl(e.getAttribute(jb)));
			this.markActive(e, t, id()), r !== null && this.writeChosen(e, r);
			let i = Bb(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(sb) === n) {
			this.close();
			return;
		}
		e.setAttribute(sb, n), this.sync(e);
		let r = e.querySelector(`.${_b}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : al(tl(e.getAttribute(Lr)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Eb}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Hb(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Lr) : e.setAttribute(Lr, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${_b}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Lb(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(sb)) return;
		e.removeAttribute(sb), this.sync(e);
		let t = e.querySelector(`.${_b}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Xb(e) {
	let t = e.querySelector(`.${ti}`), n = Hb(e);
	t !== null && n !== null && !t.contains(document.activeElement) && I(n);
}
function Zb(e) {
	return Wb(e).filter((e) => Qb(e) && !D(e) && !E(e));
}
function Qb(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function $b(e, t) {
	let n = e.querySelector(`.${hb}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function ex(e) {
	return [...e.querySelectorAll(`.${Tb} > .${Eb}`)];
}
function tx(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Bb(t) !== null && !e.classList.contains(Nb);
}
function nx(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of Wb(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !D(t) && (e.toLocaleLowerCase() === n || qb(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function rx(e, t) {
	let n = qb(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function ix(e, t) {
	let n = e.querySelector(`.${Tb}`);
	if (n === null) return;
	n.hasAttribute(Ab) !== t.length > 0 && n.toggleAttribute(Ab, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${Eb}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(kb) === t[n].key && e.querySelector(`.${Db}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => ax(e.key, e.label)));
	}
}
function ax(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Eb, n.setAttribute(kb, e), r.className = Db, r.textContent = t, i.className = Ob, i.type = "button", i.tabIndex = -1, T.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function ox(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${ai}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === sb || e.attributeName === "data-ui-selected-keys" || e.attributeName === jb)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${mb}`)?.closest(`.${ai}`);
	n != null && t.add(n);
}
function sx(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var cx = class {
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
		!Oc(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, lx = "textarea.ui-text-area__field", ux = "data-ui-text-area-grow";
function dx() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var fx = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(lx) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(lx)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(ta(e.components, lx));
		}), R(this.root, lx, {
			childList: !0,
			attributeFilter: [ux]
		}, (e) => {
			this.fitAll(ta(e, lx));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(ux)) {
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
function px(e) {
	let t = mx(e.getAttribute("min"), 0), n = mx(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, mx(r, 1))
	};
}
function mx(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function hx(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function gx(e, t) {
	return _x(t.min + e * (t.max - t.min), t);
}
function _x(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, vx(t.min + r * t.step, t);
}
function vx(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(yx(t.step), yx(t.min)))));
}
function yx(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function bx(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function xx(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return Sx(o, i);
	let s = (o - i.min) / i.step;
	return Sx(vx(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function Sx(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Cx = "ui-slider__input", wx = "ui-slider__input--end", Tx = "ui-slider__input--held", Ex = "ui-slider__value", Dx = "ui-slider__bubble", Ox = "ui-slider__track", kx = "ui-slider__thumb-anchor", Ax = "ui-slider", jx = "ui-slider--range", Mx = "ui-orientation--vertical", Nx = "--ui-slider-fraction", Px = "--ui-slider-end-fraction", Fx = 6, Ix = "Value", Lx = "EndValue", Rx = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), zx = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Cm({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${jx} .${Ox}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (Rx.has(e.propertyName)) for (let t of ta(e.components, `.${Cx}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Vx(t) ? Lx : Ix) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Bx(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Bx(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Bx(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Wx(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cx)) return;
		let t = e.target;
		if (this.cancelled.delete(t), Wx(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Hx(t);
		if (n !== null) {
			let e = Ux(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Cx}:not(.${wx})`), r = e.querySelector(`.${wx}`);
		if (n === null || r === null) return null;
		let i = gx(hx(e.getBoundingClientRect(), t, Gx(e), Kx(e)), px(n)), a = bx(i, Number(n.value), Number(r.value));
		if (Wx(n)) return I(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? I(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${Ox}`);
		if (n === null) return;
		let r = gx(hx(n.getBoundingClientRect(), t, Gx(n), Kx(n)), px(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Tx), I(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Hx(e), r = n === null ? String(t) : Ux(e, t, n);
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
		e.held?.classList.remove(Tx), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = qx(e);
		t !== null && tp(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Fx
		});
	}
	releaseBubble(e) {
		pp(qx(e)?.bubble);
	}
	writeReadings(e) {
		let t = Vx(e), n = e.closest(`.${Ox}`)?.parentElement ?? e.parentElement, r = t ? `.${Ex}--end, .${Dx}--end` : `.${Ex}:not(.${Ex}--end), .${Dx}:not(.${Dx}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Ox}`)?.style.setProperty(t ? Px : Nx, String(Jx(e))), e.matches(`:active, :focus-visible, .${Tx}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Bx(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Cx) ? e : null;
}
function Vx(e) {
	return e.classList.contains(wx);
}
function Hx(e) {
	return e.closest(`.${jx} .${Ox}`)?.querySelector(Vx(e) ? `.${Cx}:not(.${wx})` : `.${wx}`) ?? null;
}
function Ux(e, t, n) {
	let r = Number(e.closest(`.${Ax}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(xx(t, Vx(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, px(e)));
}
function Wx(e) {
	return O(e) || E(e);
}
function Gx(e) {
	return e.closest(`.${Ax}`)?.classList.contains(Mx) === !0;
}
function Kx(e) {
	let t = e.querySelector(`.${kx}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : Gx(e) ? t.height : t.width;
}
function qx(e) {
	if (!(e instanceof Element) || !e.classList.contains(Cx)) return null;
	let t = e.closest(`.${Ox}`), n = Vx(e), r = t?.querySelector(n ? `.${Dx}--end` : `.${Dx}:not(.${Dx}--end)`) ?? null, i = t?.querySelector(n ? `.${kx}--end` : `.${kx}:not(.${kx}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: Gx(e)
	};
}
function Jx(e) {
	let { min: t, max: n } = px(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Yx = {
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
}, Xx = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Zx = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Qx = [
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
], $x = [
	"n %",
	"n%",
	"%n",
	"% n"
], eS = [
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
], tS = /[1-9]/;
function nS(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Yx;
	try {
		return {
			...Yx,
			...JSON.parse(t)
		};
	} catch {
		return Yx;
	}
}
function rS(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = aS(t);
	if (r === null) return oS(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = sS(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return iS(e, t) ? fS(Xx[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = sS(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return iS(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = cS(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return iS(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = sS(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return fS(iS(e, t) ? Qx[n.currencyNegativePattern] ?? "-$n" : Zx[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = sS(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return fS(iS(e, t) ? eS[n.percentNegativePattern] ?? "-n %" : $x[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return oS(e, n);
	}
}
function iS(e, t) {
	return e < 0 && tS.test(t);
}
function aS(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function oS(e, t) {
	let { integer: n, fraction: r } = lS(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function sS(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = cS(e, t, n);
	return n === 0 ? dS(o, r, i) : `${dS(o, r, i)}${a}${s}`;
}
function cS(e, t, n) {
	let { integer: r, fraction: i } = lS(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? uS(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function lS(e, t) {
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
function uS(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function dS(e, t, n) {
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
function fS(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var pS = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function mS(e) {
	if (!pS.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var hS = {
	readCulture: nS,
	format: rS,
	parseInvariant: mS
}, gS = /^-?(\d+(\.\d*)?|\.\d+)$/;
function _S(e, t, n) {
	if (!gS.test(e)) return e;
	let r = n.thousands ? t : CS(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return rS(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return rS(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function vS(e, t, n) {
	return gS.test(e) ? (SS(n) ? wS(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function yS(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = SS(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!gS.test(d)) return null;
	let f = a ? wS(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function bS(e, t, n, r, i) {
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
function xS(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function SS(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function CS(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function wS(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var TS = "ui-number-input", ES = "ui-number-input__field", DS = "data-ui-number-no-decimals", OS = "data-ui-number-no-negative", kS = "data-ui-number-no-thousands", AS = "data-ui-number-trim-zeros", jS = "data-ui-number-step", MS = "data-ui-number-min", NS = "data-ui-number-max", PS = "data-ui-number-step-direction", FS = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), IS = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${ES}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(ta(e.components, `.${ES}`));
		}), T.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${ES}`)));
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
		let t = LS(e);
		if (t !== null) return this.keptValue(t) ?? VS(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(AS) ? xS(t) : t, r = nS(e), i = e === document.activeElement ? vS(n, r, HS(e)) : BS(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = LS(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(DS), r = !t.hasAttribute(OS), i = t.selectionStart ?? t.value.length, a = bS(t.value, i, nS(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = LS(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = LS(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : VS(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(AS) && !O(t) && !E(t)) {
			let e = this.values.get(t) ?? "", n = xS(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = LS(e.target);
		if (t === null) return;
		let n = VS(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = LS(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = vS(t, nS(e), HS(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + PS + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${ES}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(PS) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = FS.get(e.key);
		if (t === void 0 || !A(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = LS(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(jS) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : VS(e) ?? "0") || 0) + n * t, i = e.getAttribute(MS), a = e.getAttribute(NS);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, US(r)), this.show(e);
	}
};
function LS(e) {
	return e instanceof HTMLInputElement && e.classList.contains(ES) ? e : null;
}
function RS(e, t) {
	let n = e.classList.contains(TS) ? e.querySelector(`.${ES}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = zS(n, MS), a = zS(n, NS);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: BS(n, i, nS(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: BS(n, a, nS(n)) }
	} : null;
}
function zS(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function BS(e, t, n) {
	return _S(t, n, {
		format: HS(e),
		thousands: !e.hasAttribute(kS)
	});
}
function VS(e) {
	return yS(e.value, nS(e), HS(e));
}
function HS(e) {
	return e.closest(`.${TS}`)?.getAttribute("data-ui-number-format") ?? null;
}
function US(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function WS(e, t) {
	let n = /* @__PURE__ */ new WeakMap();
	return {
		started: (t) => {
			let r = e(t.domEvent);
			r !== null && n.set(t.domEvent, r);
		},
		completed: (e) => {
			let r = n.get(e.domEvent);
			r !== void 0 && (n.delete(e.domEvent), t(r));
		}
	};
}
//#endregion
//#region src/items/items-host-mode.ts
function B(e) {
	switch (e.getAttribute(Et)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function GS(e) {
	let t = B(e) === "windowed" ? KS(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function KS(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function qS(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var JS = "application/x-ne-items", YS = null, XS = null;
function ZS(e, t, n) {
	let r = e.getAttribute(he), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(F),
		effects: i,
		source: e.getAttribute(ge)
	};
}
function QS(e, t) {
	let n = Dl(t);
	return n.includes(e) ? n.filter((t) => t === e || eC(t)) : [e];
}
function $S(e) {
	return !ts(e, "data-ui-undraggable") && !D(e);
}
function eC(e) {
	return $S(e) && P(e) !== null;
}
function tC(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function nC(e, t, n = null) {
	YS = t, XS = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(JS, t.kind);
}
function rC(e) {
	return YS !== null && e.dataTransfer?.types.includes(JS) === !0 ? YS : null;
}
function iC() {
	let e = XS;
	YS = null, XS = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var aC = `:scope > [${vt}], :scope > [${yt}], :scope > [${jt}]`;
function V(e) {
	let t = new Set(e.querySelectorAll(aC));
	return [...e.children].filter((e) => !t.has(e));
}
function oC(e) {
	return e === null ? [] : [e];
}
function sC(e) {
	return e.querySelector(`:scope > [${vt}]`);
}
function cC(e, t, n, r, i) {
	i ??= V(e).some((e) => !e.classList.contains(Jr));
	let a = sC(e);
	if (i) {
		a?.remove();
		return;
	}
	if (a !== null) return;
	let o = n.getEmptyTemplate(t);
	if (o === void 0) return;
	let s = r.renderFromTemplate(o, null, r.getAncestorStack(e));
	if (s === null) return;
	let c = document.createElement("div");
	c.setAttribute(vt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var lC = { ok: !1 }, uC = {
	ok: !0,
	value: null
}, dC = null;
function fC(e) {
	dC = e;
}
function pC(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Si(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Si(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return lC;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return lC;
			let t = a[u];
			if (u++, Si(t.kind) === "Dynamic") {
				let n = _C(e, t.componentId);
				if (!n.ok) return lC;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return lC;
				let e = wC(s, t.value);
				if (!e.ok) return lC;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return lC;
		if (l) {
			let e = bC(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? lC : {
		ok: !0,
		value: s,
		scope: c
	};
}
function mC(e, t, n) {
	for (let r of t ?? []) {
		if (Si(r.kind) !== "Dynamic") continue;
		let t = C(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function hC(e) {
	let t = yC(e, "IsContent");
	return t.ok && t.value === !0;
}
var gC = /* @__PURE__ */ new Set();
function _C(e, t) {
	let n = C(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return gC.has(n) || (gC.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), lC;
}
function vC(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = yC(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function yC(e, t) {
	return bC(e, t, !0);
}
function bC(e, t, n) {
	if (e == null) return lC;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return lC;
	let r = e, i = xC(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? lC : (n && dC?.(r, t), uC);
}
function xC(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = SC(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function SC(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function CC(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Si(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Si(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = C(e.componentId);
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
function wC(e, t) {
	if (e == null || t == null) return lC;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : lC;
	if (typeof t != "string") return lC;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (EC(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return lC;
}
function TC(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (EC(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function EC(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function DC(e) {
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
function OC(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = DC(e);
	if (a === void 0 && o === null) {
		for (let t of V(e)) t.classList.remove(Jr);
		return;
	}
	for (let n of V(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Jr);
			continue;
		}
		n.classList.toggle(Jr, !kC(a, e, i, o));
	}
}
function kC(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => PC(e, t, n)) && (r?.filters ?? []).every((e) => _f(vC(t, e.itemProperty), e.operator, e.value));
}
function AC(e, t, n = null) {
	return (e?.filters ?? []).some((e) => FC(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function jC(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => FC(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function MC(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => NC(n.getItemValue(e), n.getItemValue(r), t));
}
function NC(e, t, n) {
	for (let r of n) {
		let n = IC(vf(vC(e, r.itemProperty)), vf(vC(t, r.itemProperty)));
		if (n !== 0) return Di(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function PC(e, t, n) {
	if (!FC(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return _f(vC(t, e.itemProperty), e.operator, r);
}
function FC(e, t, n, r) {
	return e == null || _f(r.get(e, []), t, n);
}
function IC(e, t) {
	if (e === t) return 0;
	let n = RC(e), r = RC(t);
	if (n !== r) return n - r;
	if (n === LC.Nothing) return 0;
	if (n === LC.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var LC = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function RC(e) {
	return e == null ? LC.Nothing : typeof e == "number" ? Number.isNaN(e) ? LC.Nothing : LC.Number : typeof e == "string" && e.trim().length === 0 ? LC.Nothing : Number.isNaN(Number(e)) ? LC.Text : LC.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var zC = /* @__PURE__ */ new WeakMap();
function BC(e, t) {
	let n = zC.get(e), r = n === void 0 ? [...t] : VC(n, t);
	return zC.set(e, r), r;
}
function VC(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function HC(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function UC(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function WC(e, t, n) {
	return UC(e, t), HC(e, t, n);
}
function GC(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function KC(e) {
	zC.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var qC = "ui-tab-item";
function JC(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function YC(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? JC(e).parentElement : null;
}
function XC(e, t) {
	return ts(JC(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var ZC = ".ui-items-view__item, .ui-table__row", QC = "ui-row--dragging", $C = "--ui-row-drop-offset", ew = "move", tw = ".ui-items-view--wrap", nw = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function rw(e, t) {
	Nu(e, ew, { index: t });
}
function iw(e) {
	return {
		name: ew,
		registration: {
			dynamicParameters: (e) => {
				let t = aw(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...WS((t) => e === void 0 ? null : ow(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function aw(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function ow(e, t) {
	let n = aw(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = YC(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(ZC), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, F(i), n);
	return o === null ? null : { pending: o };
}
var sw = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : P(t.row);
		if (t === null || n === null) return;
		let r = fw(t.root, t.row);
		if (r === null ? !pw(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (su(t.root, yw(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(gl), n = t?.parentElement ?? null, r = n?.closest(N) ?? null;
		if (t === null || n === null || r === null || !t.matches(ZC) || !n.hasAttribute("data-ui-items-host") || E(r) || !eC(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = ra(e);
		return this.services === void 0 || n === null ? !1 : jC(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, DC(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : P(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = ZS(t.root, n, QS(t.row, yw(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => P(e) ?? e);
		zh(e, t.root, r, QC, F(t.row), a, tC(i, t.moves)), nC(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = hw(t.root, t.host), r = yw(t.host), i = uw(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? bw(t.root, null) : bw(t.root, i, _w(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (mw(t) !== mw(e.row)) return null;
		let r = cw(dw(e.host, this.services?.keysOf), F(e.row), F(t), n);
		return r === null ? null : r + GS(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && Hh(e, t.host) && bw(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = uw(t.host, e.target, e, hw(t.root, t.host), yw(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && rw(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Bh(e.root, QC), bw(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !A(e, { alt: !0 }) || !nw.has(e.key) || !(e.target instanceof Element)) return;
		let t = $l(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Fl(t.root), r = n === null ? null : hw(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = yw(n), o = nu(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(tw) ? Au(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && rw(o, l);
	}
};
function cw(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = lw(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function lw(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function uw(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(gl);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(gl) ?? null;
	if (a ??= vw(i, n), a === null) return null;
	let o = (P(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && gw(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function dw(e, t) {
	switch (B(e)) {
		case "virtualized": return [...t?.(e) ?? V(e).map(F)];
		case "windowed": return V(e).map(F);
		default: return BC(e, V(e)).map(F);
	}
}
function fw(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ye}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function pw(e, t) {
	return Hc(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function mw(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function hw(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function gw(e, t, n) {
	if (mw(e) !== mw(t)) return !1;
	if (!n.across) return !0;
	let r = (P(e) ?? e).getBoundingClientRect(), i = (P(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function _w(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !gw(t.anchor, r, n)) return -1;
	let i = (P(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (P(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function vw(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (P(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function yw(e) {
	return V(e).filter((e) => e instanceof HTMLElement && e.matches(gl) && P(e) !== null);
}
function bw(e, t, n = 0) {
	let r = t === null ? null : P(t.anchor);
	for (let t of e.querySelectorAll(`[${be}]`)) t !== r && (t.removeAttribute(be), t.style.removeProperty($C));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(be, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue($C) !== i && r.style.setProperty($C, i);
}
function xw(e) {
	e.classList.remove(QC), e.querySelector(`:scope > [${ae}]`)?.classList.remove(QC);
}
//#endregion
//#region src/interactions/tree-drop.ts
var Sw = "--ui-tree-drop-depth";
function Cw(e) {
	return e.querySelector(`.${Un}`);
}
function ww(e, t) {
	if (D(e)) return !1;
	let n = t?.getAttribute(tr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Tw(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || ww(n, Cw(n));
}
function Ew(e, t) {
	let n = Cw(e);
	if (ww(e, n)) return F(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return Tw(r, t) ? r : null;
}
function Dw(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${Wn}]`)) n !== t && (n.removeAttribute(Wn), n.style.removeProperty(Sw));
	t !== null && (t.setAttribute(Wn, n), r === void 0 ? t.style.removeProperty(Sw) : t.style.setProperty(Sw, String(r)));
}
function Ow(e, t, n) {
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
function kw(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = Aw(e, r, n);
	return i === null || !jw(e, i.parent) ? null : i;
}
function Aw(e, t, n) {
	if (n === "in") {
		let n = Ow(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Ow(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: Nw(e, n, t.parent, !1)
		};
	}
	let r = Mw(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function jw(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function Mw(e, t) {
	return e.filter((e) => e.parent === t);
}
function Nw(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = Mw(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function Pw(e, t, n) {
	let r = Mw(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? Nw(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
	for (let e of t) {
		let t = r.indexOf(e);
		t >= 0 && r.splice(t, 1);
		let n = a === null ? -1 : r.indexOf(a), i = s === null ? n >= 0 ? n : r.length : r.indexOf(s) + 1;
		r.splice(i, 0, e), o.push(i), s = e;
	}
	return o;
}
//#endregion
//#region src/interactions/item-drag-engine.ts
var Fw = "drop:", Iw = "ui-row--cut", Lw = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Rw = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, zw = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function Bw(e) {
	return {
		dynamicParameters: (e) => {
			let t = Vw(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...WS((t) => Hw(e, t), (t) => e?.settle(t))
	};
}
function Vw(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function Hw(e, t) {
	let n = Vw(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var Uw = class {
	root;
	options;
	marked = null;
	clipboard = null;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = rC(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = Ww(t, r, Gw(e)), a = i === null ? null : this.landingOf(r, n, e);
		return i === null || a === null ? null : {
			drag: t,
			target: r,
			effect: i,
			landing: a
		};
	}
	targetOf(e, t) {
		if (e.root.contains(t)) return null;
		let n = this.options.targetOf(t, e.kind);
		return n === null || E(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Fl(e) : null;
		if (r !== null) {
			let i = yw(r), a = hw(e, r), o = dw(r, this.options.keysOf), s = t !== null && n !== null ? uw(r, t, n, a, i) : Kw(i);
			return {
				index: ((s === null ? null : lw(o, F(s.anchor), s.side)) ?? o.length) + GS(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(_e, "") : bw(e, s, _w(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = qw(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Fl(e) : Jw(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Dw(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(_e, ""), Uh(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(_e), Uh(e, !1), e.matches(".ui-items-view, .ui-table") ? bw(e, null) : e.classList.contains("ui-tree") && Dw(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && Hh(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), iC(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && B(e.host) === "plain" && B(r.list) === "plain", a = {
			drop: {
				kind: e.kind,
				source: e.source,
				keys: e.keys,
				index: r.index,
				folder: r.folder,
				effect: n
			},
			transfer: i && r.list !== null && r.index !== null ? {
				source: e.host,
				target: r.list,
				keys: e.keys,
				index: r.index
			} : null
		};
		t.dispatchEvent(new CustomEvent(Fw + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), iC();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !k(e) && (e.preventDefault(), this.letGo());
				return;
			}
			kc(e.target) || (Ys(zw, e) ? this.paste(e, e.target) : Ys(Lw, e) ? this.take(e, e.target, !0) : Ys(Rw, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (P(e) ?? e).classList.remove(Iw);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : Ww(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Ql(t), a = i === null ? null : Fl(i.root);
		if (i === null || a === null || E(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = yw(a), s = i.row ?? nu(o), c = s === null || !eC(s) ? null : ZS(i.root, a, QS(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (P(e) ?? e).classList.add(Iw);
	}
};
function Ww(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function Gw(e) {
	return tc() ? e.altKey : e.ctrlKey;
}
function Kw(e) {
	let t = ru(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function qw(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Ew(n, (t) => Jw(e, t));
}
function Jw(e, t) {
	return e.querySelector(`.${Hn}[${_}="${x(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function Yw(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = $w(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < eT(e.start).getTime() ? {
		start: $w(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: $w(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Xw(e, t, n) {
	if (t === null || n === null) return !1;
	let r = eT(e).getTime();
	return r > eT(t).getTime() && r < eT(n).getTime();
}
function Zw(e, t, n) {
	return !n && Xw(e, t.start, t.end);
}
function Qw(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function $w(e, t) {
	return ka(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function eT(e) {
	return ka(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var H = "ui-temporal-input", tT = "ui-calendar", nT = `.${H}, .${tT}`, rT = "ui-temporal-input__value-input", iT = "ui-temporal-input__end-value-input", aT = "data-ui-temporal-range", oT = "data-ui-temporal-end", sT = "data-ui-temporal-mode", cT = "data-ui-temporal-format", lT = "data-ui-temporal-default-format", uT = "data-ui-temporal-min", dT = "data-ui-temporal-max", fT = "data-ui-temporal-step", pT = "data-ui-temporal-step-unit", mT = "data-ui-temporal-marked-days", hT = "data-ui-temporal-marked-only", gT = "data-ui-temporal-page-culture", _T = "data-ui-temporal-months", vT = "data-ui-temporal-months-genitive", yT = "data-ui-temporal-months-short", bT = "data-ui-temporal-daynames", xT = "data-ui-temporal-weekdays", ST = "data-ui-temporal-first-day", CT = "data-ui-temporal-am", wT = "data-ui-temporal-pm", TT = /* @__PURE__ */ new Set([
	cT,
	lT,
	uT,
	dT,
	_T,
	CT,
	wT,
	mT,
	hT
]), ET = 2e3;
function DT(e) {
	let t = e.getAttribute(sT);
	return t === "time" || t === "date-time" ? t : "date";
}
function OT(e) {
	let t = e.getAttribute(cT);
	return t === null || t.trim().length === 0 ? e.getAttribute(lT) ?? "" : t;
}
function kT(e) {
	let t = e.getAttribute(pT), n = Math.max(1, Math.trunc(Number(e.getAttribute(fT))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function AT(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function jT(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function MT(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function NT(e) {
	return {
		monthNames: PT(e, _T),
		monthGenitiveNames: PT(e, vT),
		abbreviatedMonthNames: PT(e, yT),
		dayNames: PT(e, bT),
		abbreviatedDayNames: PT(e, xT),
		amDesignator: e.getAttribute(CT) ?? "AM",
		pmDesignator: e.getAttribute(wT) ?? "PM"
	};
}
function PT(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function FT(e, t) {
	e.hasAttribute(gT) && (zT(e, vT, t.monthGenitiveNames.join("|")), zT(e, yT, t.abbreviatedMonthNames.join("|")), zT(e, bT, t.dayNames.join("|")), zT(e, xT, t.abbreviatedDayNames.join("|")), zT(e, _T, t.monthNames.join("|")), zT(e, CT, t.amDesignator), zT(e, wT, t.pmDesignator), zT(e, lT, RT(DT(e), kT(e), t)));
}
function IT(e) {
	for (let t = 0; t < e.length;) {
		let n = Ca(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function LT(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Wa(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function RT(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ma(n, r);
}
function zT(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function BT(e) {
	return e.hasAttribute(aT);
}
function VT(e) {
	return e !== null && e.hasAttribute(oT);
}
function HT(e) {
	return U(e, !1);
}
function U(e, t) {
	let n = UT(e, t);
	return n === null ? null : tE(n.value, DT(e));
}
function UT(e, t) {
	return e.querySelector(`.${t ? iT : rT}`);
}
function WT(e, t) {
	return tE(e.getAttribute(t) ?? "", DT(e));
}
function GT(e) {
	let t = WT(e, uT), n = WT(e, dT), r = (e.getAttribute(mT) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : nE(t, "date"),
		max: n === null ? null : nE(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(hT)
	};
}
function KT(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function qT(e, t, n) {
	let r = UT(e, n);
	if (r === null) return;
	let i = t === null ? "" : nE(t, DT(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function JT(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Na(n, OT(e), NT(e));
	return r === null ? n : nE(Oa(r), DT(e));
}
function YT(e) {
	if (!BT(e)) return;
	let t = {
		start: U(e, !1),
		end: U(e, !0)
	}, n = Qw(t);
	n !== t && (qT(e, n.start, !1), qT(e, n.end, !0));
}
function XT(e) {
	let t = WT(e, uT), n = WT(e, dT);
	if (t === null && n === null) return null;
	for (let r of BT(e) ? [!1, !0] : [!1]) {
		let i = U(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: va(t, OT(e), NT(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: va(n, OT(e), NT(e)) }
		};
	}
	return null;
}
function ZT(e) {
	return $T(e, QT(e, /* @__PURE__ */ new Date()));
}
function QT(e, t) {
	let n = WT(e, uT), r = WT(e, dT);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function $T(e, t) {
	let n = kT(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var eE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function tE(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = eE.exec(n);
		return e === null ? null : new Date(ET, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Da(n);
	return r === null ? null : Oa(r);
}
function nE(e, t) {
	let n = `${rE(e.getHours())}:${rE(e.getMinutes())}:${rE(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${rE(e.getMonth() + 1)}-${rE(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function rE(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var iE = "ui-temporal-input__day", aE = "ui-temporal-input__month", oE = 3, sE = "data-ui-temporal-nav", cE = "data-ui-temporal-day", lE = 366;
function uE(e) {
	let t = HT(e);
	return {
		view: PE(t ?? QT(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function dE(e, t, n, r) {
	let i = NE("div", `${H}__calendar`), a = NE("div", `${H}__calendar-header`), o = GT(e), s = ME("previous", "‹", T.text("ui.picker.previous"));
	s.disabled = fE(o, t, -1) === null, a.append(s);
	let c = ME("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${H}__calendar-label`), a.append(c);
	let l = ME("next", "›", T.text("ui.picker.next"));
	return l.disabled = fE(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? gE(e, t, n, r, o) : _E(t, n, o)), i;
}
function fE(e, t, n) {
	let r = t.pane === "months", i = LE(t.view, n * (r ? 12 : 1));
	return mE(e, pE(i, r ? 4 : 7)) ? hE(e, i) : null;
}
function pE(e, t) {
	return nE(e, "date").slice(0, t);
}
function mE(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function hE(e, t) {
	let n = pE(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : tE(r, "date");
	return i === null ? t : PE(i);
}
function gE(e, t, n, r, i) {
	let a = kE(e), o = NE("div", `${H}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = NE("span", `${H}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = NE("div", `${H}__days`), c = eT(/* @__PURE__ */ new Date()), l = BT(e), u = l ? U(e, !1) : r, d = l ? U(e, !0) : null, f = FE(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = IE(f, e), r = nE(n, "date"), a = NE("button", iE);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(cE, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${iE}--outside`), RE(n, c) && (a.classList.add(`${iE}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${iE}--marked`);
		let o = u !== null && RE(n, u), p = d !== null && RE(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${iE}--selected`), l && (o || p) && a.setAttribute("aria-description", T.text(o ? "ui.picker.start" : "ui.picker.end")), Zw(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${iE}--within`), KT(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = NE("div", `${H}__calendar-pane`);
	return p.append(o, s), p;
}
function _E(e, t, n) {
	let r = NE("div", `${H}__months`);
	for (let i = 0; i < 12; i++) {
		let a = NE("button", aE);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(sE, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${aE}--selected`), a.setAttribute("aria-current", "true")), mE(n, pE(ka(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return j(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function vE(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : yE(t, r % oE);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function yE(e, t) {
	switch (e) {
		case "ArrowLeft": return {
			offset: -1,
			step: -1
		};
		case "ArrowRight": return {
			offset: 1,
			step: 1
		};
		case "ArrowUp": return {
			offset: -3,
			step: -3
		};
		case "ArrowDown": return {
			offset: oE,
			step: oE
		};
		case "Home": return {
			offset: -t,
			step: 1
		};
		case "End": return {
			offset: 2 - t,
			step: -1
		};
		default: return null;
	}
}
function bE(e) {
	let t = NE("div", `${H}__period-caption`);
	return t.textContent = T.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function xE(e, t, n) {
	let r = GT(e);
	if (n.startsWith("month:")) {
		let i = ka(t.view.getFullYear(), Number(n.slice(6)), 1);
		return mE(r, pE(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = EE(r, TE(i, t.focusedDay ?? HT(e) ?? QT(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = fE(r, t, -1) ?? t.view, !0;
		case "next": return t.view = fE(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function SE(e, t, n) {
	if (BT(e)) {
		CE(e, t, n);
		return;
	}
	let r = $w(n, HT(e) ?? ZT(e));
	t.focusedDay = r, t.view = PE(r), qT(e, r, !1);
}
function CE(e, t, n) {
	let r = Yw({
		start: U(e, !1),
		end: U(e, !0)
	}, t.activeEnd, $w(n, ZT(e)));
	t.focusedDay = r.end ?? r.start, t.view = PE(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, qT(e, r.end, !0), qT(e, r.start, !1);
}
function wE(e, t, n, r = !1) {
	let i = DE(n), a = OE(t, n, kE(e), r);
	if (a === null) return null;
	let o = GT(e);
	if (i === 0) return EE(o, a);
	let s = a;
	for (let e = 0; e < lE; e++) {
		if (KT(o, nE(s, "date"))) return s;
		s = IE(s, i);
	}
	return t;
}
function TE(e, t) {
	let n = ka(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return ka(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function EE(e, t) {
	let n = nE(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : tE(r, "date");
	return i === null ? t : $w(i, t);
}
function DE(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function OE(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return IE(e, -1);
		case "ArrowRight": return IE(e, 1);
		case "ArrowUp": return IE(e, -7);
		case "ArrowDown": return IE(e, 7);
		case "PageUp": return LE(e, r ? -12 : -1);
		case "PageDown": return LE(e, r ? 12 : 1);
		case "Home": return IE(e, -i);
		case "End": return IE(e, 6 - i);
		default: return null;
	}
}
function kE(e) {
	let t = Number(e.getAttribute(ST));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function AE(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${iE}`)];
	if (i.length === 0) return;
	let a = nE(eT(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (j(i, o), r && I(o));
}
function jE(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? U(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${iE}`)) {
		let e = tE(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${iE}--preview`, e !== null && n !== null && r !== null && Xw(e, n, IE(r, 1)));
	}
}
function ME(e, t, n) {
	let r = NE("button", `${H}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(sE, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function NE(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function PE(e) {
	return ka(e.getFullYear(), e.getMonth(), 1);
}
function FE(e, t) {
	let n = PE(e);
	return IE(n, -((n.getDay() - t + 7) % 7));
}
function IE(e, t) {
	return ka(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function LE(e, t) {
	let n = ka(e.getFullYear(), e.getMonth() + t, 1), r = ka(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return ka(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function RE(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var zE = "ui-temporal-input__field", BE = "ui-temporal-input__popup", VE = "ui-temporal-input--open", HE = "ui-calendar__body", UE = "ui-temporal-input__time-cell", WE = "ui-temporal-input__time-column", GE = 140, KE = "data-ui-temporal-toggle", qE = "data-ui-temporal-unit", JE = "data-ui-temporal-cell", YE = "data-ui-temporal-centred", XE = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new ah({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(VE), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(VE);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(nT)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = ta(e.components, nT), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && ZE(e) && this.states.set(e, uE(e)), this.isShowing(e) && this.renderSurface(e);
		}), R(this.root, nT, { attributeFilter: [...TT] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), R(this.root, nT, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), T.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) ZE(e) && QE(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(nT)], t = T.temporal;
		if (t !== null && T.language !== this.drawnLanguage) {
			this.drawnLanguage = T.language;
			for (let n of e) FT(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || ZE(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${HE}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && QE(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = ja(OT(t), dD()), n = Sa(OT(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${zE}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = UT(t, VT(r))?.value ?? "", a = tE(i, DT(t));
				if (a !== null) {
					r.value = va(a, OT(t), NT(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(zE)) return;
		let t = e.target.closest(`.${H}`), n = t === null ? null : UT(t, VT(e.target));
		if (t === null || n === null) return;
		let r = JT(t, e.target.value), i = tE(r, DT(t)), a = i === null ? r : nE(i, DT(t));
		if ($E(t, a)) {
			let n = U(t, VT(e.target));
			e.target.value = n === null ? "" : va(n, OT(t), NT(t));
			return;
		}
		VT(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), YT(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(zE)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && BT(t) && (this.getState(t).activeEnd = VT(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !BT(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${cE}]`) : null, r = this.getState(t), i = n === null ? null : tE(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, jE(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${cE}], .${UE}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(UE) ? mD(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = QE(e), r = tE(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, j([...n.querySelectorAll(`.${iE}`)], t), dd(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(zE)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${KE}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${H}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${sE}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${cE}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${JE}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${qE}]`)?.getAttribute(qE);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(JE)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (xE(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, ZT(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), BT(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = tE(t, "date");
		if (n === null || O(e) || E(e) || !KT(GT(e), t)) return;
		let r = this.getState(e);
		ZE(e) && BT(e) && !r.choosingEnd && U(e, !1) !== null && U(e, !0) !== null && (r.activeEnd = "start");
		let i = UT(e, !1), a = `${i?.value ?? ""}|${UT(e, !0)?.value ?? ""}`;
		SE(e, r, n), ZE(e) && `${i?.value ?? ""}|${UT(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = BT(e) && this.getState(e).activeEnd === "end", i = MT(U(e, r) ?? ZT(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		qT(e, t, n), YT(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e)) return;
		if (e.key === "ArrowDown" && A(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(zE)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${H}`), VT(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(UE)) {
			A(e) && gD(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			A(e) && hD(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !A(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = tE(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, nE(n, "date"));
			return;
		}
		let r = wE(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = PE(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${WE}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, GE)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${WE}`), n = t?.getAttribute(qE) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = L_(this.wheelTurns.get(n) ?? 0, I_(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${UE}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${UE}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${UE}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(JE)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(YE));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(qE), i = oD(e);
		if (!(r === null || i === null || i.classList.contains(`${UE}--selected`))) {
			if (i.matches(":disabled")) {
				iD(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(JE)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${BE}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = BT(e) ? t ?? (U(e, !1) === null ? "start" : U(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = U(e, r.activeEnd === "end") ?? HT(e);
		r.pane = "days", r.view = PE(i ?? QT(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${KE}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => pD(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = uE(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = QE(e);
		if (n === null) return;
		let r = ZE(e), i = DT(e), a = this.getState(e), o = NT(e), s = BT(e), c = U(e, s && a.activeEnd === "end"), l = sD(n), u = cD(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(bE(a)), r) n.append(dE(e, a, o, c));
		else {
			let t = NE("div", `${H}__panes`);
			t.append(dE(e, a, o, c)), i === "date-time" && t.append(eD(e, c)), n.append(t, uD(i));
		}
		let f = u === null ? null : n.querySelector(`[${sE}="${x(u)}"]:not(:disabled)`);
		AE(n, a, c, t || d && l === null && f === null), jE(e, a), r || (rD(n), iD(n), lD(n, l)), f !== null && I(f), r || this.popups.reposition(e);
	}
};
function ZE(e) {
	return e.classList.contains(tT);
}
function QE(e) {
	return e.querySelector(`.${ZE(e) ? HE : BE}`);
}
function $E(e, t) {
	let n = GT(e), r = n.markedOnly ? tE(t, DT(e)) : null;
	return r !== null && !n.marked.has(nE(r, "date"));
}
function eD(e, t) {
	let n = kT(e), r = NE("div", `${H}__time`), i = NE("div", `${H}__time-columns`);
	for (let r of tD(n)) i.append(nD(e, r, AT(n, r), t));
	return r.append(i), r;
}
function tD(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function nD(e, t, n, r) {
	let i = NE("div", WE);
	i.setAttribute(qE, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", T.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : jT(r, t), s = t === "hour" && IT(OT(e)), c = NT(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = NE("button", UE);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? LT(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(JE, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${UE}--selected`), bD(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function rD(e) {
	let t = e.querySelector(`.${H}__calendar`), n = e.querySelector(`.${H}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function iD(e) {
	for (let t of e.querySelectorAll(`.${WE}`)) {
		let e = t.querySelector(`.${UE}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, aD(t, e), t.setAttribute(YE, String(t.scrollTop));
	}
}
function aD(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function oD(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${UE}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function sD(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(UE) ? null : t.closest(`.${WE}`)?.getAttribute(qE) ?? null;
}
function cD(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(sE) : null;
}
function lD(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${WE}[${qE}="${t}"]`)?.querySelector(`.${UE}--selected`) ?? null;
	n !== null && I(n);
}
function uD(e) {
	let t = NE("div", `${H}__popup-footer`);
	return t.append(ME("now", T.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(ME("clear", T.text("ui.picker.clear"))), t.append(ME("done", T.text("ui.picker.done"))), t;
}
function dD() {
	return {
		year: fD("ui.picker.letter.year", Aa.year),
		month: fD("ui.picker.letter.month", Aa.month),
		day: fD("ui.picker.letter.day", Aa.day),
		hour: fD("ui.picker.letter.hour", Aa.hour),
		minute: fD("ui.picker.letter.minute", Aa.minute),
		second: fD("ui.picker.letter.second", Aa.second)
	};
}
function fD(e, t) {
	let n = T.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function pD(e, t) {
	for (let n of e.querySelectorAll(`.${zE}`)) if (VT(n) === t) return n;
	return e.querySelector(`.${zE}`);
}
function mD(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(UE) && dd(e);
}
function hD(e, t) {
	if (!Wc(e.key, "both")) return;
	e.preventDefault();
	let n = vE(t, e.key);
	Kc([...n?.parentElement?.children ?? []], n);
}
function gD(e) {
	let t = e.target, n = t.closest(`.${WE}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? vD(n, e.key === "ArrowRight" ? 1 : -1) : _D(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), yD(r));
}
function _D(e, t, n) {
	let r = [...e.querySelectorAll(`.${UE}`)];
	return n === "PageUp" || n === "PageDown" ? Ou(n, r.filter(M), t, "vertical") ?? t : Uc({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function vD(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${WE}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${UE}--selected`) ?? r.querySelector(`.${UE}:not(:disabled)`);
}
function yD(e) {
	let t = e.closest(`.${WE}`);
	t !== null && aD(t, e);
}
function bD(e, t, n, r) {
	let i = WT(e, uT), a = WT(e, dT);
	if (i === null && a === null) return !1;
	let o = MT(r ?? ZT(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var xD = "[data-ui-theme-switcher]", SD = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(xD) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: bi.SetTheme,
				mode: CD() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function CD() {
	let e = document.documentElement.getAttribute(yr);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/popup-list.ts
var wD = new ab();
function TD(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(M) ?? null);
	o !== null && j(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Ed(t.popup, n, i), s;
}
function ED(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = ob(e);
	if (r !== null) return e.preventDefault(), Kc(t, OD(t, n, r)), !0;
	if (!Wc(e.key, "vertical") || !A(e)) return !1;
	let i = Uc({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Kc(t, i), !0;
}
var DD = {
	character: ob,
	entry: OD
};
function OD(e, t, n) {
	let r = e.filter(M), i = r[0]?.parentElement;
	return i == null ? null : wD.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Sm,
		context: i
	});
}
function kD(e, t) {
	e === document.activeElement || !M(e) || (j(t, e), dd(e));
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var AD = `[${Cr}]`, jD = "ui-language-switcher__trigger", MD = "ui-language-switcher__label-text", ND = "ui-language-switcher__label-text--current", PD = "ui-language-switcher__label-text--page", FD = "ui-language-switcher__menu", ID = "ui-language-switcher__choice", LD = "ui-language-switcher--open", RD = "ui.language.switch", zD = "ui.language.current", BD = class {
	options;
	root;
	menus = new ah({
		show: ({ owner: e }) => e.classList.add(LD),
		hide: ({ owner: e }) => e.classList.remove(LD),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), T.onChange(() => this.showLanguage(T.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ID}`), n = e.target.closest(AD);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(wr));
			return;
		}
		let r = e.target.closest(`.${jD}`);
		if (r === null || E(r)) return;
		e.preventDefault();
		let i = VD(n);
		if (i.length === 2) {
			let e = T.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(AD);
		if (t === null) return;
		let n = VD(t), r = e.target.closest(`.${jD}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e)) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(t) && ED(e, n);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ID}`), n = t?.closest(AD) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && kD(t, VD(n));
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${FD}`);
		if (r === null) return;
		let i = VD(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		TD(this.menus, {
			owner: e,
			popup: r,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: bi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(AD)) {
			let n = t.querySelector(`:scope > .${jD}`);
			if (n === null) continue;
			let r = VD(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${MD}`)) {
				let n = t.getAttribute(wr) === e;
				t.classList.toggle(ND, n), t.classList.contains(PD) && t.toggleAttribute("hidden", !n);
			}
			let i = t.getAttribute(Re) === n.getAttribute("aria-label"), a = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [o, s] = r.length === 2 ? [RD, {
				language: HD(r, e),
				code: UD(e),
				other: HD(r, a),
				otherCode: UD(a)
			}] : [zD, {
				language: HD(r, e),
				code: UD(e)
			}];
			T.write(n, "aria-label", o, s), i && T.write(t, Re, o, s);
		}
	}
};
function VD(e) {
	return [...e.querySelectorAll(`:scope > .${FD} > .${ID}`)];
}
function HD(e, t) {
	let n = e.find((e) => e.getAttribute(wr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return UD(t);
	}
}
function UD(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var WD = `${Me}__button`, GD = `${Me}__more`, KD = `${WD}--icon`, qD = "ui-text__icon", JD = `.ui-button__content .${qD}`, YD = ".ui-button__content .ui-text__title", XD = /* @__PURE__ */ new WeakMap();
function ZD(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Sn)) QD(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(xn) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function QD(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function $D(e, t) {
	let n = t.entries.map((e) => eO(e, t));
	return t.more && t.openMore !== void 0 && n.push(nO(t.openMore)), e.replaceChildren(...n), n;
}
function eO(e, t) {
	let n = rO(WD), r = aO(e), i = tO(e);
	return i === null ? n.textContent = r : (n.classList.add(KD), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), E(e) && (n.classList.add(Gr), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), XD.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function tO(e) {
	let t = e.querySelector(JD);
	if (t === null || !t.className.split(" ").some(m_)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(qD), n.setAttribute(u_, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(d_);
	return r.length > 0 && n.style.setProperty(d_, r), n;
}
function nO(e) {
	let t = rO(`${WD} ${GD}`);
	return t.setAttribute("aria-haspopup", "menu"), T.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function rO(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${ii}`, t.tabIndex = -1, t;
}
function iO(e) {
	return XD.get(e) ?? null;
}
function aO(e) {
	return e.querySelector(YD)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var oO = 500, sO = 10, cO = /* @__PURE__ */ new WeakSet();
function lO(e) {
	return cO.has(e);
}
var uO = class {
	opensMenu;
	closeMenu;
	press = null;
	answered = null;
	openedAt = null;
	slid = !1;
	dragging = !1;
	constructor(e) {
		this.opensMenu = e.opensMenu, this.closeMenu = e.closeMenu ?? (() => void 0), e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), e.root.addEventListener("dragend", () => this.endDrag(), !0), e.root.addEventListener("drop", () => this.endDrag(), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.openedAt = null, this.slid = !1, this.dragging = !1, this.press !== null) {
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
			timer: setTimeout(() => this.fireHeld(), oO)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > sO && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > sO && this.cancel();
	}
	leaveMenuToDrag() {
		this.dragging = !1, this.openedAt = null, this.closeMenu();
	}
	cancel() {
		this.press !== null && (clearTimeout(this.press.timer), this.press = null);
	}
	fireHeld() {
		let e = this.press;
		this.press = null, e !== null && this.fire(e);
	}
	fire(e) {
		if (!e.target.isConnected) return;
		let t = new MouseEvent("contextmenu", {
			bubbles: !0,
			cancelable: !0,
			button: 2,
			clientX: e.x,
			clientY: e.y
		});
		cO.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!cO.has(e)) {
			if (this.answered !== null && e.target instanceof Node && this.answered.contains(e.target)) {
				e.preventDefault(), e.stopImmediatePropagation();
				return;
			}
			this.cancel();
		}
	}
	handleDragStart(e) {
		let t = this.press, n = e.target;
		t === null || !(n instanceof Node) || !(n.contains(t.target) || t.target.contains(n)) || setTimeout(() => {
			e.defaultPrevented || (this.press === t && this.cancel(), this.fire(t), this.dragging = this.openedAt !== null);
		});
	}
	handleDragOver(e) {
		let t = e, n = this.openedAt;
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > sO && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, dO = [
	If("md"),
	If("xl"),
	If("xxl")
], fO = {
	md: If("md"),
	xl: If("xl"),
	xxl: If("xxl")
}, pO = If("md");
function mO(e, t) {
	return hO(e) && !(e.hasAttribute(ln(t)) && !_O(e, t) && gO(pO));
}
function hO(e) {
	let t = e.getAttribute(sn);
	if (t === null) return !1;
	let n = fO[t];
	return n === void 0 || !gO(n);
}
function gO(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function _O(e, t) {
	return e.querySelector(`:scope > [${pn}="${x(t)}"][${un}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var vO = "ne.ui", yO = "boot", bO = /* @__PURE__ */ new Set(), xO = class {
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
		let r = this.resolveKey(e, yO);
		if (r !== null) try {
			let e = SO(window.localStorage.getItem(r));
			n === null ? delete e[t] : e[t] = n, Object.keys(e).length === 0 ? window.localStorage.removeItem(r) : window.localStorage.setItem(r, JSON.stringify(e));
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
		let n = e.getAttribute(Ke);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return bO.has(n) || (bO.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${vO}:${n}:${t}`;
	}
};
function SO(e) {
	if (e === null) return {};
	try {
		let t = JSON.parse(e);
		return typeof t == "object" && t && !Array.isArray(t) ? t : {};
	} catch {
		return {};
	}
}
//#endregion
//#region src/updates/menu-current.ts
var CO = "menu-current", wO = `[${Gt}]`;
function TO(e) {
	for (let t = e.closest(wO); t !== null; t = t.parentElement?.closest(wO) ?? null) DO(t);
}
function EO(e) {
	for (let t of e.querySelectorAll(wO)) DO(t);
	TO(e);
}
function DO(e) {
	let t = e.querySelector(`.${_n}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(Jt, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var OO = "menu-icons", kO = "ui-menu__host", AO = `:scope > :not([${Xt}]) > .${y}[${ci}]`;
function jO(e) {
	let t = e.closest(`.${kO}`);
	t !== null && NO(t);
}
function MO(e) {
	for (let t of e.querySelectorAll(`.${kO}`)) NO(t);
}
function NO(e) {
	let t = e.querySelector(AO) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(Yt, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var PO = "ui-menu__submenu", FO = Gt, IO = qt, LO = "data-ui-menu-flyout", RO = `[${LO}], ${Zr}`, zO = "data-ui-menu-unfolded", BO = Kt, VO = "data-ui-menu-rail-list", HO = "left-side", UO = "[data-ui-root]", WO = "menu-open-group", GO = L.normal * 5, KO = Xe("click"), qO = class {
	root;
	store = new xO();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new ah({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(IO, ""), t.setAttribute(LO, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(IO), queueMicrotask(() => Nf(t, GO, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(LO);
			}));
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
		let t = this.root.querySelectorAll(`.${hn}`);
		QO(t), this.reconcileEach(t);
		for (let e of t) EO(e), MO(e);
		R(this.root, `.${hn}`, {
			childList: !0,
			attributeFilter: [Wt]
		}, (e) => {
			QO(e), this.reconcileEach(e);
			for (let t of e) EO(t), MO(t);
		});
		for (let e of this.root.querySelectorAll(`[${FO}]`)) JO(e);
		if (R(this.root, `[${FO}]`, {
			childList: !0,
			attributeFilter: [IO]
		}, (e) => {
			for (let t of e) JO(t);
		}), typeof matchMedia == "function") for (let e of dO) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		R(this.root, UO, { attributeFilter: [ln(HO)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${dn}] .${hn}`);
		QO(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = ik(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), YO(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(zO, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${FO}]`)) JO(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${_n}`), e);
		if (t !== null && !t.hasAttribute(BO)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, WO), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			$O(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${hn}`);
		a !== null && (rk(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(yn);
		if (e.setAttribute(zO, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(IO);
			return;
		}
		if (t.hasAttribute(IO)) {
			t.removeAttribute(IO), n || this.store.write(e, WO, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, WO, t.getAttribute(_));
	}
	openInline(e) {
		e.setAttribute(IO, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${FO}][${IO}]`)) t.hasAttribute(BO) || t.removeAttribute(IO);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		YO(e), this.closeGroups(e);
		let a = n.closest(RO) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${XO(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${hn}`);
		o !== null && !id() && Ed(o, ek(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${FO}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(xn) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${FO}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${PO}`);
	}
};
function JO(e) {
	let t = e.querySelector(`:scope > .${y}`);
	t !== null && (t.setAttribute(KO, ""), t.setAttribute(Ze, ""), t.setAttribute("aria-expanded", e.hasAttribute(IO) ? "true" : "false"), rk(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function YO(e) {
	for (let t of e.querySelectorAll(`[${LO}]`)) t.removeAttribute(LO);
}
function XO(e) {
	return ZO(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function ZO(e) {
	let t = e.closest(`[${un}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && mO(t.parentElement, HO);
}
function QO(e) {
	for (let t of e) {
		let e = t.closest(`[${dn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(VO) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && mO(e.parentElement, HO);
		t.classList.toggle(vn, !n), t.toggleAttribute(VO, n);
	}
}
function $O(e) {
	let t = e.closest(`.${y}`);
	return t !== null && t.matches(Sn) && !t.matches(Cn) && !E(t);
}
function ek(e) {
	let t = [];
	for (let n of fl(e)) {
		t.push(n);
		let e = n.matches(xn) ? n.parentElement : null, r = e === null || !e.hasAttribute(IO) || rk(e) ? null : e.querySelector(`:scope > .${PO} > .${hn}`);
		r !== null && t.push(...ek(r));
	}
	return t;
}
function tk(e) {
	let t = nk(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || rk(t) ? e : tk(n);
}
function nk(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(PO) && t.parentElement?.hasAttribute(FO) === !0 ? t.parentElement : null;
}
function rk(e) {
	let t = e.closest(`.${hn}`);
	return e.hasAttribute(BO) || t !== null && ik(t);
}
function ik(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var ak = "tabs:rename", ok = "tabs:pin", sk = "tabs:unpin", ck = "tabs:close", lk = "tabs:delete";
function uk(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function dk(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[ak, e.rename && t.renamable],
		[ok, e.pin && !t.pinned],
		[sk, e.pin && t.pinned],
		[ck, e.close && !e.delete && n],
		[lk, e.delete && n]
	]);
}
function fk(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var pk = we, mk = "ui-context-menu--open", hk = `${Me}--strip`, gk = `.${Me}:not(.${hk}) > .${GD}`, _k = "ui-context-menu-opening", vk = class {
	root;
	components;
	closed = null;
	menus = new ah({
		show: ({ popup: e }) => e.classList.add(mk),
		hide: ({ popup: e }, t) => {
			e.classList.remove(mk), this.closed = e, t === "outside" && Pk();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new uO({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !kc(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !id() && !lO(e), n = (t ? xk() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = yk(n);
		r !== null && (e.preventDefault(), this.open(r.owner, r.menu, e.clientX, e.clientY, Dk(e) ? n : null, n.closest(gk), t ? Sk(n) : null));
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${hk}`)?.remove(), Ok(t), i !== null && kk(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && jk(t), this.closed !== null && (Mf(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? rd(), c = a ?? o, l = {
			placement: "bottom-start",
			surface: a?.closest(".ui-action-bar") ?? void 0
		}, u = c === null ? {} : {
			anchor: c,
			placement: l
		};
		this.menus.open({
			owner: e,
			popup: t,
			...u,
			returnFocus: () => (s === null ? null : Dd(s, this.components)) ?? Dd(e, this.components)
		}) && (c === null && Bp(t, n, r), Nk(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && $O(e.target) && this.menus.close();
	}
};
function yk(e) {
	let t = e.closest(`[${fe}]`);
	for (let n = e.closest(`[${Te}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = wk(n, e);
		if (r.length === 0 || E(n)) continue;
		if (Ik(n)) return null;
		let i = r.find((t) => Tk(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var bk = `[${Te}]`;
function xk() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Ql(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? iu(t.root);
	return n === null ? t.root : Ck(n);
}
function Sk(e) {
	let t = e.closest(gl);
	return t === null ? e : P(t) ?? t;
}
function Ck(e) {
	if (e.matches(bk)) return e;
	for (let t of e.querySelectorAll(bk)) if (t.closest(gl) === e) return t;
	return e;
}
function wk(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? Fk(e, r) : null, Fk(e, "")].filter((e) => e !== null);
}
function Tk(e, t, n) {
	let r = new CustomEvent(_k, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function Ek(e, t) {
	let n = e.closest(`[${Te}]`), r = e.closest(`[${fe}]`);
	return n === null || E(n) || Ik(n) || r !== null && n.contains(r) ? null : wk(n, e).find((n) => Tk(n, e, t)) ?? null;
}
function Dk(e) {
	let t = e.pointerType;
	return lO(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : ad();
}
function Ok(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function kk(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !wk(e, r).includes(t)) return;
	let { entries: i } = ZD(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${hk}`, a.setAttribute("role", "group"), $D(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: Ak
	}), t.insertBefore(a, t.firstElementChild);
}
function Ak(e) {
	E(e) || e.click();
}
function jk(e) {
	let { entries: t } = ZD(e), n = e.querySelector(`.${hn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) Mk(e);
	let r = dl(n, `.${y}`, `.${hn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && QD(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(bn)) ? Mk(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(mn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	fk(a).forEach((e, t) => {
		a[t] === "rule" && !e && Mk(i[t]);
	});
}
function Mk(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function Nk(e) {
	let t = e.querySelector(`.${hn}`);
	t !== null && Ed(e, ek(t));
}
function Pk() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Wu}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Fk(e, t) {
	for (let n of e.querySelectorAll(`[${pk}]`)) if ((n.getAttribute(pk) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	return null;
}
function Ik(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${v}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return ts(n, "data-ui-no-context-menu") || t.closest(b)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function Lk(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function Rk(e) {
	return getComputedStyle(e).display !== "none";
}
function zk(e) {
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
				if (e.overflowX !== "visible" && Hk(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Hk(n, a, a + t.clientHeight, !1), Uk(n)) return !0;
			}
			r = e.position;
		}
	}
	return Hk(n, 0, window.innerWidth, !0), Hk(n, 0, window.innerHeight, !1), Uk(n);
}
function Bk(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !Lk(n, !1)) && (Vk(e.overflowX) || Vk(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function Vk(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function Hk(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Uk(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var Wk = `[${De}]`, Gk = `.${Me}`, Kk = `${Me}--out`, qk = `.ui-items-view__item, .${Ln}`, Jk = "ui-tree__node", Yk = 6, Xk = "--ui-action-bar-gap", Zk = 400, Qk = /* @__PURE__ */ new WeakMap(), $k = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...Hr
], eA = class {
	root;
	components;
	shown = /* @__PURE__ */ new Map();
	chosen = null;
	identity = null;
	scopeObserver = null;
	pendingTap = null;
	cameFrom = null;
	menuHost = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e)), this.root.addEventListener("pointerup", (e) => this.handlePointerUp(e)), this.root.addEventListener("pointercancel", () => {
			this.pendingTap = null;
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0);
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${Gk}, [data-ui-context-menu]`) !== null) return;
		let r = tA(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : iA(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? aA(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(Gk) === null && Dk(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(Gk);
		if (n !== null) {
			this.isHostedBar(n) && j(pA(n), t);
			return;
		}
		id() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(nA(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(Gk) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(N) && this.choose(nA(t));
			return;
		}
		let n = t.closest(Gk);
		if (n !== null && t.classList.contains(WD)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (yc(e)) return;
			let n = t.closest(Zp);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(N)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(N) && this.choose(nA(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && _A(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Dd(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = pA(t), i = Uc({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Kc(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : iA(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = Bk(e);
		if (t === void 0 || n === null || !Lk(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + sA(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, fp(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		Ek(e, !0) === null && this.hide(e, t);
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
				this.chosen = aA(e), this.sync();
			}
			for (let e of this.shown.values()) fp(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = Ek(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), T.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ze, ""), n.setAttribute(me, ""), !lA(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, fA(e)), tp(e, n, {
			placement: oA(e),
			gap: sA(e),
			boundary: Bk(e) ?? void 0
		}), n.classList.toggle(Kk, zk(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: $k
		});
		let i = cA(e);
		i?.setAttribute(pr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), Qk.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : iO(r);
		if (!lA(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = pA(t.bar);
		Kc(a, a.find((e) => iO(e) === i) ?? a.find(M) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || hA(t)) return;
		if (this.menuHost = e, gA(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		uA(n.bar, !0);
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
		uA(t.bar, !1);
		let n = document.activeElement;
		!id() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && dA(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), pp(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(pr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(Kk, zk(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : pA(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function tA(e) {
	let t = e.closest(Wk);
	if (t !== null) return t;
	let n = e.closest(`[${_}]`), r = e.closest(b);
	return n === null || r !== null && !r.contains(n) ? null : rA(n)[0] ?? null;
}
function nA(e) {
	if (e instanceof HTMLElement && e.matches(N)) {
		let t = iu(e), n = t === null ? void 0 : rA(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(Wk);
}
function rA(e) {
	let t = [...e.querySelectorAll(Wk)];
	return e.matches(Wk) ? [e, ...t] : t;
}
function iA(e) {
	let t = e.getAttribute(Oe);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Oe,
		key: t,
		index: 0
	};
	let n = e.closest(`[${_}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: _,
		key: r,
		index: rA(n).indexOf(e)
	};
}
function aA(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return rA(t)[e.index] ?? null;
	return null;
}
function oA(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function sA(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(Xk));
	return Number.isFinite(t) ? t : Yk;
}
function cA(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(qk)) return t;
	let n = t.parentElement;
	return t.classList.contains(Jk) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function lA(e, t, n, r) {
	let { entries: i, more: a } = ZD(t);
	if (i.length === 0 && !a) return !1;
	let o = $D(e, {
		entries: i,
		more: a,
		role: "button",
		press: mA,
		openMore: n
	});
	return j(o, o.find((e) => !E(e)) ?? o[0] ?? null), uA(e, r), !0;
}
function uA(e, t) {
	dA(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function dA(e) {
	return pA(e).find((e) => iO(e) === null) ?? null;
}
function fA(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function pA(e) {
	return [...e.querySelectorAll(`:scope > .${WD}`)];
}
function mA(e, t) {
	if (E(t) || hA(t)) return;
	let n = Ek(t, !1);
	n === null || !n.contains(e) || E(e) || !QD(e, n) || e.click();
}
function hA(e) {
	let t = e.closest(Gk), n = t === null ? void 0 : Qk.get(t);
	return n !== void 0 && ad() && Date.now() - n < Zk;
}
function gA(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function _A(e) {
	return e.matches(Wu) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/inline-markup.ts
var vA = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, yA = "\\", bA = "`", xA = "!", SA = "{", CA = "}", wA = "ui-text__fold", TA = "ui-text__fold-toggle", EA = "ui-text__fold-content", DA = 8;
function OA(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return BA(new YA(e), 0, e.length, vA.None, null, t, n), VA(t, n, vA.None, null), t;
}
function kA(e) {
	return OA(e).map((e) => PA(e) ? `${e.fold} ${kA(e.text)}` : e.text).join("");
}
function AA(e) {
	let t = "";
	for (let n of e) t += QA(n) ? yA + n : n;
	return t;
}
function jA(e, t, n = {}) {
	let r = OA(t), i = r.some(PA);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ge, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && MA(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(FA(r, n));
}
function MA(e) {
	return e.styles === vA.None && e.url === null && !NA(e) && !PA(e);
}
function NA(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function PA(e) {
	return e.fold !== null && e.fold !== void 0;
}
function FA(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(IA(r, t));
	return n;
}
function IA(e, t) {
	if (NA(e)) return RA(e.icon);
	let n = PA(e) ? LA(e, t) : document.createTextNode(e.text);
	if ((e.styles & vA.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & vA.Strikethrough) !== 0 && (n = zA("s", n)), (e.styles & vA.Underline) !== 0 && (n = zA("u", n)), (e.styles & vA.Italic) !== 0 && (n = zA("em", n)), (e.styles & vA.Bold) !== 0 && (n = zA("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Yg(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function LA(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${wA} ${wA}--static` : wA, r.className = TA, r.textContent = e.fold ?? "", i.className = EA, i.append(FA(OA(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ze, ""), n.append(r, i), n);
}
function RA(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", f_(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function zA(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function BA(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === yA && c + 1 < n && QA(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = HA(e, c, n);
		if (l !== null) {
			VA(a, o, r, i), UA(s, c + 1, l, o), VA(a, o, r | vA.Code, i), c = l + 1;
			continue;
		}
		let u = KA(e, c, n);
		if (u !== null) {
			VA(a, o, r, i), BA(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), VA(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = WA(e, c, n);
		if (d !== null) {
			VA(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? qA(e, c, n) : null;
		if (f !== null) {
			VA(a, o, r, i), BA(e, f.labelStart, f.labelEnd, r, f.url, a, o), VA(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = JA(e, c, n);
		if (p !== null) {
			VA(a, o, r, i), a.push({
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
function VA(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function HA(e, t, n) {
	let r = e.text;
	if (r[t] !== bA) return null;
	let i = t + 1;
	if (i >= n || $A(r[i])) return null;
	let a = e.findClosingMarker(i, n, bA, 1);
	return a > i ? a : null;
}
function UA(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === yA && i + 1 < n && QA(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function WA(e, t, n) {
	let r = e.text;
	if (r[t] !== xA || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return GA(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function GA(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function KA(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = vA.Bold, s = 2;
	else if (i === "*") o = vA.Italic, s = 1;
	else if (i === "_" && a) o = vA.Underline, s = 2;
	else if (i === "~" && a) o = vA.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || $A(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function qA(e, t, n) {
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
function JA(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== SA || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > DA) return null;
	let c = { value: "" };
	return UA(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var YA = class {
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
		return this.closeBrackets ??= this.next("]", !0), XA(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), XA(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), XA(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return XA(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = ZA(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !$A(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Kg(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === yA && e[t - 1] === 0);
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
			if (this.text[r] === SA) n.push(r);
			else if (this.text[r] === CA && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || $A(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function XA(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function ZA(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function QA(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === SA || e === CA || e === bA || e === yA;
}
function $A(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var ej = "ui-tooltip", tj = "ui-tooltip", nj = "ui-tooltip--visible", rj = "ui-tooltip--linked", ij = "[aria-haspopup][aria-expanded=\"true\"]", aj = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", oj = "top", sj = 250, cj = 200, lj = 300, uj = 7, dj = null, W = null, fj = null, pj = null, mj = null, hj = 0, gj = null, _j = 0, vj = 0, yj = !1, bj = /* @__PURE__ */ new Set();
function xj(e) {
	bj.add(e);
}
function Sj(e = document) {
	if (yj) return;
	yj = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", Cj, !0), t.addEventListener("pointerout", Ej, !0), t.addEventListener("focusin", Oj, !0), t.addEventListener("focusout", kj, !0), t.addEventListener("scroll", Tj, !0), t.addEventListener("pointerdown", jj, !0), t.addEventListener("pointermove", zj, !0), t.addEventListener("pointerup", Rj, !0), t.addEventListener("pointercancel", Rj, !0), t.addEventListener("contextmenu", Vj, !0), t.addEventListener("click", Uj, !0), window.addEventListener("click", Hj, !0), window.addEventListener("keydown", Aj, !0), window.addEventListener("blur", () => {
		pj = null, pM(!0);
	});
}
function Cj(e) {
	if (wj(), Gj(e.target)) {
		window.clearTimeout(_j);
		return;
	}
	let t = Kj(e.target);
	t !== null && t !== W && Zj(t);
}
function wj() {
	W === null || W.isConnected || (pj = null, pM(!0));
}
function Tj(e) {
	if (wj(), W === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(W) || zk(W) && (pj = null, pM(!0));
}
function Ej(e) {
	if (pj !== null || mj !== null) return;
	let t = e.relatedTarget, n = W ?? gj?.target ?? null, r = n === null ? null : Dj(n);
	t instanceof Node && (r !== null && r.contains(t) || Gj(t)) || (Gj(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && pM(!1);
}
function Dj(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && qj(t) === e ? t : e;
}
function Oj(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = Kj(e.target);
	t !== null && (pj = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, Qj(t));
}
function kj(e) {
	Kj(e.target) === W && (pj = null, pM(!0));
}
function Aj(e) {
	e.key !== "Escape" || W === null || e.defaultPrevented || (yc(e) || e.preventDefault(), pj = null, pM(!0));
}
function jj(e) {
	if (Rj(), Ij = null, Gj(e.target)) return;
	Lj(e);
	let t = Wj(e.target);
	if (t !== null) {
		if (mj === t) {
			pM(!0);
			return;
		}
		pj = null, pM(!0), Qj(t), mj = W;
		return;
	}
	pj === null && pM(!0);
}
var Mj = 500, Nj = 10, Pj = `[${Te}]`, Fj = null, Ij = null;
function Lj(e) {
	let t = e;
	if (t.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest(Pj) !== null || kc(e.target)) return;
	let n = Kj(e.target);
	n === null || n.hasAttribute("data-ui-tooltip-press") || (Fj = {
		pointerId: t.pointerId ?? 0,
		x: t.clientX ?? 0,
		y: t.clientY ?? 0,
		target: n,
		timer: window.setTimeout(Bj, Mj)
	});
}
function Rj() {
	Fj !== null && (window.clearTimeout(Fj.timer), Fj = null);
}
function zj(e) {
	let t = e;
	Fj !== null && t.pointerId === Fj.pointerId && Math.hypot((t.clientX ?? Fj.x) - Fj.x, (t.clientY ?? Fj.y) - Fj.y) > Nj && Rj();
}
function Bj() {
	let e = Fj?.target ?? null;
	Fj = null, e !== null && (pj = null, pM(!0), Qj(e), mj = W, Ij = W);
}
function Vj(e) {
	if (Fj !== null && e.target instanceof Node && Fj.target.contains(e.target)) {
		e.preventDefault(), window.clearTimeout(Fj.timer), Bj();
		return;
	}
	Ij !== null && e.target instanceof Node && Ij.contains(e.target) && e.preventDefault();
}
function Hj(e) {
	Ij === null || !(e.target instanceof Node) || !Ij.contains(e.target) || (Ij = null, e.preventDefault(), e.stopImmediatePropagation());
}
function Uj(e) {
	Wj(e.target) !== null && e.preventDefault();
}
function Wj(e) {
	let t = Kj(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(aj);
	return n === null || n.contains(t) ? t : null;
}
function Gj(e) {
	return dj !== null && e instanceof Node && dj.contains(e);
}
function Kj(e) {
	if (!(e instanceof Element)) return null;
	let t = qj(e);
	for (let n of bj) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && Xj(r).length > 0) return r;
	}
	return t;
}
function qj(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function Jj(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + Yj(e) : Xj(e);
}
function Yj(e) {
	let t = "";
	for (let n of bj) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function Xj(e) {
	for (let t of bj) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function Zj(e, t) {
	if (pj === null && mj === null) {
		if (window.clearTimeout(_j), gj !== null && gj.target === e) {
			gj.words = t;
			return;
		}
		if (window.clearTimeout(hj), gj = null, W !== null) {
			pM(!0), Qj(e, t);
			return;
		}
		if (Date.now() - vj < lj) {
			Qj(e, t);
			return;
		}
		gj = {
			target: e,
			words: t
		}, hj = window.setTimeout(() => {
			let e = gj;
			gj = null, e !== null && Qj(e.target, e.words);
		}, sj);
	}
}
function Qj(e, t) {
	let n = (t ?? Jj(e)).trim();
	if (n.length === 0 || !e.isConnected || !Rk(e) || tM(e) || zk(e)) return;
	window.clearTimeout(hj), window.clearTimeout(_j), gj = null;
	let r = mM();
	jA(r, n, { staticFolds: !0 }), r.classList.toggle(rj, r.querySelector("a[href]") !== null), r.classList.add(nj), W = e, rM(nM(e)), r.setAttribute("data-ui-tooltip-text", kA(n)), oM(r, e.getAttribute(Ve)), ep(e, r), tp(e, r, {
		placement: fM(e),
		gap: uj,
		arrow: !0
	}), eM();
}
var $j = null;
function eM() {
	typeof MutationObserver > "u" || ($j ??= new MutationObserver(wj), $j.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function tM(e) {
	return e.matches(ij) || e.querySelector(ij) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function nM(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function rM(e) {
	fj !== null && fj !== e && iM();
	let t = aM(e);
	t.includes(tj) || e.setAttribute("aria-describedby", [...t, tj].join(" ")), fj = e;
}
function iM() {
	if (fj === null) return;
	let e = aM(fj).filter((e) => e !== tj);
	e.length === 0 ? fj.removeAttribute("aria-describedby") : fj.setAttribute("aria-describedby", e.join(" ")), fj = null;
}
function aM(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function oM(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function sM(e, t, n) {
	let r = n?.plain === !0 ? AA(t) : t;
	n?.delay === !0 && W !== e ? Zj(e, r) : Qj(e, r);
}
function cM() {
	pM(!0);
}
var lM = {
	show: sM,
	hide: cM,
	escape: AA
};
function uM(e) {
	pj = e, Qj(e);
}
function dM(e) {
	if (W === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			pj = null, pM(!0);
			return;
		}
		Qj(e);
	}
}
function fM(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of bj) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Wf(t) ? t : oj;
}
function pM(e) {
	window.clearTimeout(hj), window.clearTimeout(_j), gj = null;
	let t = () => {
		W !== null && (iM(), W = null, mj = null, $j?.disconnect(), dj !== null && (dj.classList.remove(nj), pp(dj)), vj = Date.now());
	};
	e ? t() : _j = window.setTimeout(t, cj);
}
function mM() {
	return dj !== null && dj.isConnected ? dj : (dj = document.createElement("div"), dj.id = tj, dj.className = ej, dj.setAttribute("role", "tooltip"), dj.setAttribute("aria-hidden", "true"), document.body.append(dj), dj);
}
//#endregion
//#region src/interactions/menu-engine.ts
var hM = "ui-orientation--horizontal", gM = `.${vn} > .ui-menu__host > .ui-menu__item > .${y}`, _M = `${gM}, ${`.ui-menu[${Wt}] > .ui-menu__host > .ui-menu__item > .${y}`}`, vM = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", yM = "[role='menuitem'], [role='menuitemcheckbox']", bM = class {
	root;
	tabStopsScheduled = !1;
	space = new ac();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, M), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), xj(wM), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(TM) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [tn, qt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${hn}`)) {
			if (tk(e) !== e) continue;
			let t = ek(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && M(e));
			j(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && M(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(M) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Ac(e) || k(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = tk(n), i = ek(r), a = ob(e);
		if (a !== null) {
			e.preventDefault(), Kc(i, OD(i, t, a));
			return;
		}
		let o = r.classList.contains(hM) || ZO(r) ? "horizontal" : "vertical";
		if (!A(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(M) ? CM(r) : null, c = s ?? Uc({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && j(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : XO(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(xn) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Kc([], xM(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !rk(a) ? a : SM(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), rk(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !A(e, { shift: !0 }) || t.matches(bn) || !M(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${hn}`);
		if (n === null) return;
		let r = ek(n), i = ob(e);
		if (i !== null) {
			e.preventDefault(), Kc(r, OD(r, null, i));
			return;
		}
		let a = A(e) ? Uc({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(hM) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Kc(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && j(ek(tk(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${y}`) : null;
		if (t === null || t === document.activeElement || !t.matches(yM) || t.matches(bn) || !M(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && dd(t);
	}
};
function xM(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${hn}`);
	return t === null ? null : ek(t).find(M) ?? null;
}
function SM(e) {
	let t = e.closest(`.${hn}`), n = t === null ? null : nk(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function CM(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var wM = {
	anchor: (e) => e.closest(_M),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(vM), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(gM) && t.scrollWidth <= t.clientWidth ? null : AA(n);
	},
	placement: (e) => {
		let t = e.closest(`.${hn}`);
		return t === null ? null : XO(t);
	}
};
function TM(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var EM = "shortcut:", DM = ":scope > .ui-menu-item__shortcut", OM = `[${we}]`, kM = `[${wn}]`, AM = ".ui-text__title", jM = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), xj(RM), FM(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) PM(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [wn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Ac(e))) return;
		let t = em(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Ys(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !M(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), NM(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Ys(t, e);
		let r = n ? xk() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = yk(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(kM)].filter((t) => {
			let n = Js(t.getAttribute(wn));
			return n !== null && Ys(n, e) && !E(t) && QD(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), NM(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(kM)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Js(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(OM) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(oc(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Js(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = oc(e.shortcut);
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
function MM(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(EM) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function NM(e) {
	Oc(e.target) && e.target.dispatchEvent(new Event(vy, { bubbles: !0 }));
}
function PM(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && IM(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && FM(t);
}
function FM(e) {
	e instanceof HTMLElement && e.matches(kM) && IM(e);
	for (let t of e.querySelectorAll(kM)) IM(t);
}
function IM(e) {
	let t = e.querySelector(DM);
	if (t === null) return;
	let n = LM(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(Zt, n.length > 0);
}
function LM(e) {
	let t = e.getAttribute(wn), n = Js(t);
	return n === null ? t?.trim() || null : Xs(n);
}
var RM = {
	anchor: (e) => {
		let t = e.closest(kM);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(OM) !== null ? null : t;
	},
	words: (e) => {
		let t = LM(e), n = (e.getAttribute("aria-label") ?? e.querySelector(AM)?.textContent ?? "").trim();
		return t === null ? null : AA(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = LM(e);
		return t === null ? null : AA(`(${t})`);
	}
}, zM = 50, BM = 1, VM = 7;
function HM(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = KS(e, "data-ui-window-size") ?? 0;
	return {
		offset: KS(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : zM,
		total: KS(e, It),
		moreAfter: qS(e, Rt)
	};
}
function UM(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function WM(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function GM(e, t) {
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
			let n = Number(t), r = WM(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === UM(e) ? null : (n - 1) * e.size;
		}
	}
}
function KM(e, t) {
	if (t <= VM) return JM(1, t);
	let n = Math.max(Math.min(e - BM, t - 2 - 2), 3), r = Math.min(Math.max(e + BM, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...JM(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function qM(e, t) {
	let n = KM(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function JM(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var YM = ".ui-pager", XM = "ui-pager__button", ZM = "ui-pager__number", QM = "ui-pager__pages", $M = "ui-pager__gap", eN = "ui-pager__range", tN = "ui-pager__size", nN = "ui-pager__size--open", rN = "ui-pager__size-trigger", iN = "ui-pager__size-label", aN = "ui-pager__sizes", oN = "ui-pager__size-choice", sN = [
	XM,
	ZM,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], cN = "ui.pager.page", lN = "ui.pager.range", uN = "ui.pager.rows", dN = "ui.pager.size", fN = [
	Ft,
	It,
	Rt,
	Pt,
	Nt
], pN = "page-size", mN = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new xO();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new ah({
		show: ({ owner: e }) => e.classList.add(nN),
		hide: ({ owner: e }) => e.classList.remove(nN),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), R(this.root, `${YM}, [${v}]`, {
			childList: !0,
			attributeFilter: fN,
			relevant: (e) => e.type === "attributes" || CN(e.target) || wN(e)
		}, (e) => this.syncFound(e)), T.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(YM)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(YM)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(b), n = t === null ? 0 : w(t);
		return n > 0 ? [...this.root.querySelectorAll(`${YM}[${ct}="${x(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ct));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = SN(e);
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
		let i = HM(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = nS(e), s = (e) => rS(e, "N0", o);
		this.drawNumbers(e, i, o), gN(e, i, s), _N(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${XM}[${lt}]`)) as.setDisabled(t, GM(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		yN(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${QM}`);
		if (r === null) return;
		let i = UM(t), a = WM(t), o = a === null ? qM(i, t.moreAfter) : KM(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => hN(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(YM);
		if (t === null || E(e.target)) return;
		let n = e.target.closest(`.${oN}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(ut)));
			return;
		}
		let r = e.target.closest(`.${rN}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${lt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = GM(HM(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Zc(e).top > 0 && Qc(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(YM);
		if (t === null) return;
		let n = e.target.closest(`.${tN}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${XM}, .${rN}`), i = vN(t);
		if (r === null || !i.includes(r) || !A(e)) return;
		let a = Uc({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Kc(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${rN}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && ED(e, xN(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${oN}`) : null, n = t?.closest(`.${tN}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && kD(t, xN(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${tN}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${aN}`);
		if (r === null) return;
		let i = xN(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		TD(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, pN), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!bN(e, i)) {
			this.store.write(t, pN, null);
			return;
		}
		let a = HM(n);
		i !== a.size && (n.setAttribute(Pt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${tN}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = HM(r.host);
		t !== i.size && (this.store.write(r.component, pN, String(t)), r.host.setAttribute(Pt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !A(e) || !(e.target instanceof Element)) return;
		let t = $l(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || E(t.root)) return;
		let n = SN(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = GM(HM(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Bl(e), i = ru(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = Bl(e);
		o.length > 0 && su(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function hN(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = $M, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = rS(e, "N0", n);
	return r.className = sN.join(" "), r.setAttribute("type", "button"), r.setAttribute(lt, String(e)), r.textContent = i, T.write(r, "aria-label", cN, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function gN(e, t, n) {
	let r = e.querySelector(`:scope > .${eN}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? T.write(r, null, uN, {
		from: i,
		to: a
	}) : T.write(r, null, lN, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function _N(e, t, n) {
	let r = e.querySelector(`:scope > .${tN}`), i = r?.querySelector(`.${iN}`) ?? null;
	if (r !== null && i !== null) {
		T.write(i, null, dN, { size: n(t.size) });
		for (let e of xN(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function vN(e) {
	return [...e.querySelectorAll(`.${XM}, .${rN}`)];
}
function yN(e) {
	let t = vN(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	j(t, n ?? r.find(M) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function bN(e, t) {
	let n = e.querySelector(`:scope > .${tN}`);
	return n !== null && xN(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function xN(e) {
	return [...e.querySelectorAll(`:scope > .${aN} > .${oN}`)];
}
function SN(e) {
	for (let t of e.querySelectorAll(`[${v}][${Et}="windowed"]`)) if (t.closest(b) === e) return t;
	return null;
}
function CN(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function wN(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(YM) || t.querySelector(YM) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var TN = `.${hn}[${$t}]`, EN = ":scope > .ui-collapsible__bar", DN = ":scope > .ui-menu__host", ON = "ui-menu__item", kN = `:scope > .${y}`, AN = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", jN = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), R(t, TN, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Wt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = MN(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(DN);
		if (n === null) return;
		let r = _m(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: NN(n)
		}), e.setAttribute(en, ""), rb(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of PN(e)) {
			let e = FN(a);
			if (e === "header") {
				n !== null && LN(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			LN(a, o), r ||= o, i ||= o;
		}
		return n !== null && LN(n, r), i;
	}
	match(e, t) {
		let n = ym(IN(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(AN) : null;
		if (r === null) return n;
		if (n) return RN(r), e.removeAttribute(qt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(qt, i), i;
	}
	clear(e, t) {
		RN(t), e.removeAttribute(en), PN(t).length > 0 && rb(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Wt);
		for (let e of t.querySelectorAll(`[${Gt}]:not([${Kt}])`)) e.toggleAttribute(qt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !A(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = MN(e.target), n = t === null ? void 0 : ek(t).find(M);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function MN(e) {
	let t = e.closest(TN), n = t?.querySelector(EN) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function NN(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Gt}][${qt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function PN(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(ON));
}
function FN(e) {
	return e.querySelector(kN)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function IN(e) {
	let t = e.querySelector(kN);
	return t === null ? "" : vm(Sm(t), e);
}
function LN(e, t) {
	e.toggleAttribute(tn, !t);
}
function RN(e) {
	for (let t of e.querySelectorAll(`[${tn}]`)) t.removeAttribute(tn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var zN = 120;
function BN(e) {
	return e.typing && e.tallest - e.height > zN;
}
var VN = class {
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
		let t = BN({
			height: e.height,
			tallest: this.tallest,
			typing: kc(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Er, t);
	}
}, HN = "[data-ui-root]", UN = "a[href]", WN = "ui-collapsible", GN = "ui-collapsible__bar", KN = "right-side", qN = "ui-side--left", JN = "ui-side--right", YN = "pinned", XN = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new xO();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of dO) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(HN)) rP(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${nn}]`);
		if (t !== null) {
			let e = t.closest(HN), n = t.getAttribute(nn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${cn}]`);
		if (n !== null) {
			let e = n.closest(HN), t = n.getAttribute(cn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(ln(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Tn}]`);
		if (r !== null && !e.defaultPrevented && eP(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${UN}, .${y}`), a = i?.closest(`[${pn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && tP(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || yc(e) || um()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && _d(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${HN}[${rn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = iP(t, n);
			r !== null && !tm(r) && e.push({
				shell: t,
				drawer: r,
				modal: nP(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${HN}[${rn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = iP(e, t), r = this.openers.get(e);
			n === null || !mO(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = iP(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !mO(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(rn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, nP(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, id(), performance.now() + L.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Qr, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", T.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = ZN(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", T.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(GN) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(an), i.removeAttribute(on);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(an, ""), i.setAttribute(on, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = $N(r.left - e.offsetLeft, e.clientWidth - a.width), c = $N(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Cd(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = iP(e, t);
		if (i === null || _O(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(ln(t), n), rP(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && I(n);
		}
		let o = i.querySelector(`[${Ke}]`);
		o !== null && this.store.write(o, YN, n ? "true" : null, n ? {
			root: !0,
			attributes: { [ln(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${HN}[${rn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(rn);
		if (e.removeAttribute(rn), this.markToggles(e), n === null) return;
		let r = iP(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? jd(t, r) : t !== null && I(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${nn}="${x(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(rn);
		for (let n of e.querySelectorAll(`[${nn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(nn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Qr), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function ZN(e) {
	for (let t of e.querySelectorAll(`[${Tn}]`)) if (eP(t) && t.checkVisibility() && QN(t.closest(`.${WN}`), e)) return t;
	return null;
}
function QN(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function $N(e, t) {
	return Math.max(0, Math.min(e, t));
}
function eP(e) {
	let t = e.closest(`.${WN}`), n = t?.closest(`[${pn}]`), r = n?.getAttribute(pn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(HN) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === KN ? JN : qN);
}
function tP(e) {
	return !e.classList.contains("ui-menu-item") || $O(e) && e.closest(Zr) === null;
}
function nP(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function rP(e) {
	for (let t of e.querySelectorAll(`[${cn}]`)) {
		let n = String(e.hasAttribute(ln(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function iP(e, t) {
	return e.querySelector(`:scope > [${pn}="${x(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var aP = "ui-collapsible", oP = "ui-collapsible__content", sP = "ui-collapsible__bar", cP = "ui-collapsible__bar-content", lP = "collapsed", uP = class {
	root;
	store = new xO();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${aP}`)), R(this.root, `.${aP}`, {
			childList: !0,
			attributeFilter: [Wt]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(Wt));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, lP);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Tn}]`), n = t?.closest(`.${aP}`) ?? null;
		if (t === null || n === null || eP(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Wt), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = fP(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, lP, r ? "true" : "false", r ? { attributes: { [Wt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Wt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${oP}`),
			bar: e.querySelector(`:scope > .${sP} > .${cP}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Tn}], :scope > .${sP} > [${Tn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || jf()) return;
		let i = mP(dP(e), n, fP(e, t), r);
		if (i === null) return;
		e.setAttribute(En, ""), e.offsetWidth;
		let a = {
			duration: L.normal,
			easing: L.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(En));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(En);
			for (let e of t) e.cancel();
		}
	}
};
function dP(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function fP(e, t) {
	let n = dP(e), r = pP(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0,
		bar: t.bar?.getBoundingClientRect()[n] ?? 0,
		toggleX: o.left - i.left,
		toggleY: o.top - i.top
	};
}
function pP(e) {
	return e === "width" ? "height" : "width";
}
function mP(e, t, n, r) {
	let i = pP(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
	}, d = {
		[e]: `${s.bar}px`,
		flexShrink: 0
	}, f = (e) => `translate(${e.toggleX - s.toggleX}px, ${e.toggleY - s.toggleY}px)`, p = Math.abs(t.toggleX - n.toggleX) >= .5 || Math.abs(t.toggleY - n.toggleY) >= .5;
	return {
		component: [l(t), l(n)],
		content: [{
			...u,
			opacity: c && !r ? 0 : 1
		}, {
			...u,
			opacity: c && r ? 0 : 1
		}],
		bar: [{
			...d,
			opacity: +!!r
		}, {
			...d,
			opacity: +!r
		}],
		toggle: p ? [{ transform: f(t) }, { transform: f(n) }] : null
	};
}
//#endregion
//#region src/interactions/element-size.ts
function hP(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var gP = "ui-grid-splitter", _P = "ui-container", vP = "ui-orientation--vertical", yP = 16, bP = {
	sliver: 0,
	passFloors: !0
}, xP = {
	sliver: 48,
	passFloors: !0
}, SP = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Dn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, CP = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: On,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, wP = class {
	root;
	store = new xO();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Cm({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${gP}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, bP) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${gP}`)), R(this.root, `.${gP}`, { childList: !0 }, (e) => this.prepareEach(e)), R(this.root, `.${gP}`, { attributeFilter: [An] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = DP(t);
			e !== null && (this.restore(e, OP(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Pf) {
			let i = r[n], a = zf(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = FP(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && AP(n.container, n.axis, n.tier) !== void 0)) return;
		let r = As(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, hP(e, () => {
			!e.isConnected || FP(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) FP(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Rf();
		for (let t of this.root.querySelectorAll(`.${gP}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !A(e)) return;
		let t = e.target.closest(`.${gP}`);
		if (t === null || this.drag.active || E(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = LP(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = os(r, i) * PP(e.key, n.axis);
				break;
			case "Home":
				a = -i;
				break;
			case "End":
				a = i;
				break;
			default: return;
		}
		e.preventDefault(), this.apply(n, a) && (this.remember(n), this.reportPosition(t), this.writeBack(t, n));
	}
	reset(e, t = !0) {
		let n = DP(e);
		if (n === null) return;
		let r = OP(e);
		for (let e of Pf) n.style.removeProperty(zf(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(An), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = IP(ks(jP(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(An, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${gP}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : Ps(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, bP);
	}
	apply(e, t, n = xP) {
		let r = ys(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(zf(e.axis.split, e.tier), ds(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Pf) {
			let a = zf(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = DP(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = OP(e), r = Rf(), i = kP(t, n, r), a = i === null ? null : ss(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = hs(a, ms(t.getAttribute(n.limits))), s = jP(t, n), c = MP(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = gs(c, NP(t, n).map((e) => MP(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r
		};
	}
	reportPosition(e, t) {
		let n = DP(e);
		if (n === null) return;
		let r = OP(e), i = MP(e, r), a = jP(n, r), o = NP(n, r).map((e) => MP(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : gs(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Os(a, s)));
		let c = TP(a, s.before) ? "before" : TP(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(kr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(kr, c), EP(n, t === void 0 ? null : {
			axis: r,
			tracks: Fs(t, a, s, 48)
		});
	}
};
function TP(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function EP(e, t) {
	let n = [SP, CP].filter((t) => NP(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: jP(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(gP) ? OP(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Ls(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Or, a);
	}
}
function DP(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(_P) ? t : null;
}
function OP(e) {
	return e.classList.contains(vP) ? SP : CP;
}
function kP(e, t, n) {
	let r = AP(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function AP(e, t, n) {
	return Hf(n, (n) => e.style.getPropertyValue(zf(t.split, n)).trim() || void 0);
}
function jP(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function MP(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function NP(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(gP) && OP(r) === t && n.push(r);
	return n;
}
function PP(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function FP(e) {
	return js(e.getAttribute(An));
}
function IP(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function LP(e) {
	let t = Number(e.getAttribute(kn));
	return Number.isFinite(t) && t > 0 ? t : yP;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var RP = "ui-pane-container", zP = "ui-pane-container__place", BP = "ui-pane-container__pane", VP = "ui-pane-container__grip", HP = "data-ui-pane-lifted", UP = "data-ui-pane-target", WP = "data-ui-pane-moving", GP = "data-ui-pane-near", KP = "panes", qP = ",", JP = 32, YP = class {
	root;
	store = new xO();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Cm({
			root: this.root,
			resolveHandle: (e) => ZP(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.arrangeEach(this.root.querySelectorAll(`.${RP}`), !1), R(this.root, `.${RP}`, {
			childList: !0,
			attributeFilter: [jn],
			relevant: $P
		}, (e) => this.arrangeEach(eF(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			e && (this.restored.add(n), this.restore(n)), n.hasAttribute(WP) || aF(n, rF(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, KP);
		t !== null && e.setAttribute(jn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || nF(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(HP, ""), i.setAttribute(WP, ""), {
			container: i,
			pane: n,
			origin: r,
			start: t,
			target: null
		};
	}
	dropStaleHold() {
		let e = this.held;
		e === null || e.pane.isConnected || (this.held = null, this.settle(e));
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, uF(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(UP), t?.setAttribute(UP, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${BP}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) {
			this.putBack(e);
			return;
		}
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		r !== null && i.set(r, n), oF(i, !0), this.keep(e.container);
	}
	putBack(e) {
		this.settle(e), sF(e.pane), e.container.isConnected && aF(e.container, rF(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(UP), e.pane.removeAttribute(HP), e.container.removeAttribute(WP);
	}
	keep(e) {
		let t = iF(e);
		e.setAttribute(jn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, KP, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !A(e)) return;
		this.dropStaleHold();
		let t = ZP(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.held = this.lift(t, {
				x: 0,
				y: 0
			});
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = XP[e.key];
		if (r !== void 0) {
			e.preventDefault(), this.mark(n, dF(n.container, n.origin, n.target ?? n.origin, r) ?? n.target);
			return;
		}
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null, this.put(n), t.focus({ preventScroll: !0 });
			return;
		}
		e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n));
	}
	handleFocusOut(e) {
		let t = this.held;
		t === null || !(e.target instanceof Element) || e.target.parentElement !== t.pane || (this.held = null, this.putBack(t));
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? QP(e.target) : null;
		this.markNear(t !== null && e.clientY - t.getBoundingClientRect().top < JP ? t : null);
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(GP), e?.setAttribute(GP, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, XP = {
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	},
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	}
};
function ZP(e) {
	let t = e.closest(`.${VP}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(RP) === !0 ? t : null;
}
function QP(e) {
	let t = e.closest(`.${BP}`);
	return t?.parentElement?.parentElement?.classList.contains(RP) === !0 ? t : null;
}
function $P(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(RP);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(RP) || t.querySelector(`.${RP}`) !== null)) return !0;
	return !1;
}
function eF(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${RP}`)) t.add(e);
	}
	return t;
}
function tF(e) {
	return Array.from(e.querySelectorAll(`:scope > .${zP}`));
}
function nF(e) {
	return tF(e).filter((e) => e.getClientRects().length > 0);
}
function rF(e) {
	return e.getAttribute(jn);
}
function iF(e) {
	return tF(e).map((e) => e.querySelector(`:scope > .${BP}`)?.getAttribute("data-ui-pane") ?? "").join(qP);
}
function aF(e, t, n) {
	let r = tF(e), i = lF(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${BP}`), n = t?.getAttribute(Mn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && oF(o, n);
}
function oF(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || jf()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? cF(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: L.normal + 60,
			easing: L.ease
		});
	}
}
function sF(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || jf() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: L.normal,
		easing: L.ease
	});
}
function cF(e, t) {
	let n = e.left - t.left, r = e.top - t.top;
	return Math.abs(n) < .5 && Math.abs(r) < .5 && Math.abs(t.width - e.width) < .5 && Math.abs(t.height - e.height) < .5 ? null : [{
		transform: `translate(${n}px, ${r}px)`,
		width: `${e.width}px`,
		height: `${e.height}px`
	}, {
		transform: "none",
		width: `${t.width}px`,
		height: `${t.height}px`
	}];
}
function lF(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(qP).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function uF(e, t, n) {
	for (let r of nF(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function dF(e, t, n, r) {
	let i = nF(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = pF(fF(a), i.map((e) => e.place === t || e.place === n ? null : fF(e.box)), r);
	return o === null ? null : i[o].place;
}
function fF(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function pF(e, t, n) {
	let r = null, i = Infinity;
	return t.forEach((t, a) => {
		if (t === null) return;
		let o = (t.x - e.x) * n.x + (t.y - e.y) * n.y, s = Math.abs((t.x - e.x) * n.y - (t.y - e.y) * n.x);
		if (o <= .5) return;
		let c = o + s * 2;
		c < i && (i = c, r = a);
	}), r;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var mF = "ui-split-button", hF = "ui-split-button__main", gF = "ui-split-button__toggle", _F = "ui-split-button__menu", vF = "ui-split-button--open", yF = class {
	root;
	menus = new ah({
		show: ({ owner: e }) => e.classList.add(vF),
		hide: ({ owner: e }) => e.classList.remove(vF),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = bF(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${hF}`)?.closest(`.${mF}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !A(e)) return;
		let t = bF(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = xF(t), r = e.target.closest(`.${y}`);
		n !== null && r !== null && n.contains(r) && $O(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = xF(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Wf(i) ? i : "bottom-end" },
			openers: SF(e)
		}) && Ed(r, ek(r), t);
	}
};
function bF(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${gF}, .${hF}`), n = t?.closest(`.${mF}`) ?? null;
	return t === null || n === null || t.classList.contains(hF) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function xF(e) {
	return e.querySelector(`:scope > .${_F}`);
}
function SF(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var CF = "ui-button-group", wF = "ui-button-group__item", TF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${CF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), R(this.root, `.${CF}`, {
			childList: !0,
			attributeFilter: [Ir]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = EF(i);
			i.toggleAttribute(Fr, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		j(n, r ?? n.find(M) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wF}`), n = t?.closest(`.${CF}`) ?? null;
		if (t === null || n === null || t.closest(`.${CF}`) !== n || E(n)) return;
		let r = EF(t);
		r !== null && E(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wF} > .${ri}`), n = t?.closest(`.${CF}`) ?? null;
		if (t === null || n === null || !A(e)) return;
		let r = this.ownItems(n).map(EF).filter((e) => e !== null), i = Uc({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${wF}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		pl(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Ir,
			bindingAttribute: Rr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return dl(e, `.${wF}`, `.${CF}`);
	}
};
function EF(e) {
	return e.querySelector(`:scope > .${ri}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var DF = "ui-accordion", OF = "details", kF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${DF}`)), R(this.root, `.${DF}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(DF))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${OF}`)];
	}
}, AF = "ui-tab-overflow", jF = "ui-tab-overflow__menu", MF = "ui-tab-overflow__menu--open", NF = "ui-tab-overflow__entry", PF = "ui-tab-overflow__entry--current", FF = class {
	options;
	list;
	fittedWidths = /* @__PURE__ */ new WeakMap();
	wraps = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e, t) => {
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (!r.target.isConnected) {
				t.unobserve(r.target);
				continue;
			}
			let e = r.target.closest(`.${this.options.rootClass}`);
			e !== null && this.fittedWidths.get(r.target) !== r.contentRect.width && (this.fittedWidths.set(r.target, r.contentRect.width), n.add(e));
		}
		for (let e of n) this.options.refit(e);
	}) : null;
	switches = typeof MutationObserver == "function" ? new MutationObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) n.target instanceof HTMLElement && this.wraps.get(n.target) !== this.options.wraps(n.target) && t.add(n.target);
		for (let e of t) this.options.refit(e);
	}) : null;
	constructor(e) {
		this.options = e, this.list = new RF(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : IF({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return LF(e, this.options.hiddenClass, t);
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
function IF(e) {
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
function LF(e, t, n) {
	for (let n of e.captions) n.classList.remove(t);
	let r = getComputedStyle(e.room), i = r.direction === "rtl", a = Number.parseFloat(r.paddingLeft) || 0, o = Number.parseFloat(r.paddingRight) || 0, s = e.room.getBoundingClientRect(), c = i ? s.right - e.room.clientLeft - o : s.left + e.room.clientLeft + a, l = e.room.clientWidth - a - o, u = e.captions.map((e) => {
		let t = e.getBoundingClientRect();
		return i ? c - t.left : t.right - c;
	});
	if (u.every((e) => e <= l)) return !1;
	n();
	let d = e.button.getBoundingClientRect(), f = getComputedStyle(e.button), p = Number.parseFloat(i ? f.marginRight : f.marginLeft) || 0, m = (i ? c - d.right : d.left - c) - p, h = !1;
	for (let n = 0; n < e.captions.length; n++) h ||= u[n] > m, h && e.captions[n].classList.add(t);
	return !0;
}
var RF = class {
	menu;
	button = null;
	list = new ah({
		show: ({ popup: e }) => e.classList.add(MF),
		hide: ({ popup: e }) => {
			e.classList.remove(MF), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = jF, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(zF)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${PF}`);
		this.button = e, ep(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		TD(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${NF}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || E(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || ED(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${NF}`) : null;
		t !== null && kD(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${NF}`));
	}
};
function zF(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${NF} ${ii}`, t.classList.toggle(PF, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(_, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Gr), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var BF = "data-ui-caption-text", VF = ".ui-text__title";
function HF(e) {
	for (let t of e.querySelectorAll(VF)) {
		let e = t.textContent ?? "";
		t.getAttribute(BF) !== e && t.setAttribute(BF, e);
	}
}
function UF(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || jf()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: L.normal,
		easing: L.ease,
		pseudoElement: "::after"
	});
}
function WF(e) {
	if (!(e === null || jf())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: L.fast,
		easing: L.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var GF = "ui-tabs", KF = "ui-tab-header", qF = "ui-tab-header--selected", JF = "ui-tab-header--overflowed", YF = "ui-tabs--overflowing", XF = "ui-tabs--no-overflow", ZF = "ui-tabs__strip", QF = "data-ui-tab-key", $F = "data-ui-tab-page", eI = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new FF({
			rootClass: GF,
			overflowingClass: YF,
			wraps: (e) => e.classList.contains(XF),
			hiddenClass: JF,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${GF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), R(this.root, `.${GF}`, {
			childList: !0,
			attributeFilter: [zr, ...Hr],
			relevant: (e) => !Gp(e, `[${$F}]`, `.${GF}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(tI), i = ml(r, t, (e) => e.getAttribute(QF) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(qF)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(QF) ?? "") === t;
			e.classList.toggle(qF, n), e.setAttribute("aria-selected", n ? "true" : "false"), HF(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), UF(a, o), j(n.filter((e) => !e.classList.contains(JF)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute($F) ?? "") !== t, !n.hidden && a !== null && a !== o && WF(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${ZF}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(QF) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(tI).map((e) => {
				let n = e.getAttribute(QF) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: E(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${AF}`), n = t?.closest(`.${GF}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${GF}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${KF}`);
		if (r === null || E(r)) return;
		let i = r.closest(`.${GF}`), a = r.getAttribute(QF);
		i !== null && a !== null && r.closest(`.${GF}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ac(e) || !A(e)) return;
		let t = e.target.closest(`.${KF}`), n = t?.closest(`.${GF}`) ?? null;
		if (t === null || n === null) return;
		let r = Uc({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(QF) ?? ""), r.focus());
	}
	select(e, t) {
		pl(e, t, {
			attribute: zr,
			bindingAttribute: Rr,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return dl(e, `.${KF}`, `.${GF}`);
	}
	ownPages(e) {
		return dl(e, `[${$F}]`, `.${GF}`);
	}
};
function tI(e) {
	return e.classList.contains(JF) || Rk(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function nI(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function rI(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function iI(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var aI = "ui-command-bar", oI = "ui-command-bar__host", sI = "ui-command-bar__item", cI = "ui-command-bar__overflow", lI = "ui-command-bar--overflowing", uI = "ui-command-bar__overflowed", dI = "ui-orientation--vertical", fI = "ui-text__title", pI = `${Wu}, [${Fe}]`, mI = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new FF({
			rootClass: aI,
			overflowingClass: lI,
			wraps: (e) => !vI(e),
			hiddenClass: uI,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${aI}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), R(this.root, `.${aI}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = hI(e), n = e.querySelector(`:scope > .${cI}`);
		if (t === null || n === null) return;
		let r = yI(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(lI) && bI(r);
		for (let e of r) Qf(e, e.classList.contains(uI) ? n : null);
		e.classList.contains(dI) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), gI(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cI}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(aI) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !A(e) || Ac(e)) return;
		let t = e.target.closest(`.${aI}`), n = t === null ? [] : _I(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Uc({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(dI) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), gI(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${aI}`) ?? null;
		t !== null && n !== null && _I(n).includes(t) && gI(n, t);
	}
	entriesOf(e) {
		let t = hI(e), n = t === null ? [] : yI(t).filter((e) => e.classList.contains(sI) && e.classList.contains(uI)).map((e) => e.querySelector(b) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: xI(e),
			current: !1,
			disabled: E(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !E(n) && SI(n).click();
	}
};
function hI(e) {
	return e.querySelector(`:scope > .${oI}`);
}
function gI(e, t) {
	let n = _I(e), r = n.find((e) => e.tabIndex >= 0 && M(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(M) ?? null;
	for (let e of n) e === i ? rI(e) : nI(e);
}
function _I(e) {
	let t = hI(e), n = [];
	for (let e of t === null ? [] : yI(t)) if (!(!e.classList.contains(sI) || e.classList.contains(uI))) for (let t of e.querySelectorAll(pI)) iI(t) && Vc(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${cI}`);
	return r !== null && e.classList.contains(lI) && n.push(r), n;
}
function vI(e) {
	let t = hI(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function yI(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(sI) ? n.querySelector(b) : null;
		e !== null && Rk(e) && t.push(n);
	}
	return t;
}
function bI(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(sI) ? t ||= !r.classList.contains(uI) : t || r.classList.add(uI);
	}
}
function xI(e) {
	let t = SI(e), n = t.querySelector(`.${fI}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function SI(e) {
	return e.matches(Wu) ? e : e.querySelector(Wu) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var CI = "ui-breadcrumbs", wI = "ui-breadcrumbs__item", TI = "ui-breadcrumb", EI = "ui-breadcrumb--current", DI = "ui-hidden", OI = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), R(this.root, `.${CI}`, {
			childList: !0,
			attributeFilter: ["class", ...Hr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${CI}`)) this.apply(e);
	}
	apply(e) {
		let t = dl(e, `.${wI}`, `.${CI}`);
		kI(t);
		let n = t.filter((e) => !e.classList.contains(DI)).map((e) => e.querySelector(`.${TI}`)).filter((e) => e !== null && !e.classList.contains(DI)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(EI, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function kI(e) {
	let t = Pf.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Pf.map((e, t) => AI(r, t));
		if (jI(r, dr, Pf.filter((e, t) => i[t])), jI(r, fr, Pf.filter((e, n) => !t[n])), !r.classList.contains(DI)) for (let e = 0; e < Pf.length; e++) t[e] ||= !i[e];
	}
}
function AI(e, t) {
	for (let n of e.children) if (n.getAttribute(Hr[t]) === "collapsed") return !0;
	return !1;
}
function jI(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/rendering/color-bytes.ts
function G(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function MI(e) {
	return G(e).toString(16).padStart(2, "0").toUpperCase();
}
function NI(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (PI(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function PI(e, t, n) {
	return .2126 * FI(e) + .7152 * FI(t) + .0722 * FI(n);
}
function FI(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var II = "ui-color-input", LI = "ui-color-input--open", RI = "ui-color-input__popup", zI = "ui-color-input__text", BI = "ui-color-input__row", VI = "ui-color-input__swatch--button", HI = "ui-color-input__value-input", UI = "ui-color-input__square-thumb", WI = "ui-color-input__hue-thumb", GI = "data-ui-color-toggle", KI = "data-ui-color-tab", qI = "data-ui-color-tab-selected", JI = "data-ui-color-pane", YI = "data-ui-color-pane-selected", XI = "data-ui-color-square", ZI = "data-ui-color-hue", QI = "data-ui-color-hex", $I = "data-ui-color-channel", eL = "data-ui-color-factor", tL = "data-ui-color-opacity", nL = "data-ui-color-name", rL = "data-ui-color-name-selected", iL = "data-ui-color-format", aL = "data-ui-color-variant", oL = "data-ui-color-no-picker", sL = "data-ui-color-no-palette", cL = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new ah({
		show: ({ owner: e }) => e.classList.add(LI),
		hide: ({ owner: e }) => e.classList.remove(LI)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${II}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ta(e.components, `.${II}`));
		}), R(this.root, `.${II}`, {
			childList: !0,
			attributeFilter: [
				iL,
				aL,
				oL,
				sL
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Cm({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${XI}], [${ZI}]`),
			begin: (e, t) => {
				let n = e.closest(`.${II}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(XI) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${HI}`)?.value ?? null
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
		let t = pL(e), n = this.states.get(e), r = n?.paneChosen === !0 ? lL(e, n.pane) : uL(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? dL(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = xL(t);
			if (i === null) return n ?? dL(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && fL(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = wL(a, o, s);
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
			...n ?? dL(r),
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
			let [e, a, o] = wL(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), _L(e, "--ui-color-input-color", t.held ? CL(n, r, i, t.opacity) : "transparent"), _L(e, "--ui-color-input-solid", CL(n, r, i, 255)), _L(e, "--ui-color-input-on-color", t.held ? NI(n, r, i, t.opacity) : "inherit"), gL(e, t.held ? hL(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${XI}]`), o = e.querySelector(`[${ZI}]`), [s, c, l] = TL(t.hue, 1, 1);
		if (_L(e, "--ui-color-input-hue", CL(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${UI}`);
			e !== null && (_L(e, "left", `${t.saturation * 100}%`), _L(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${WI}`);
			e !== null && _L(e, "top", `${t.hue / 360 * 100}%`);
		}
		vL(e, `[${QI}]`, SL(n, r, i)), vL(e, `[${$I}="r"]`, String(n)), vL(e, `[${$I}="g"]`, String(r)), vL(e, `[${$I}="b"]`, String(i)), _L(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), yL(e, `[${tL}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${nL}]`)) n.getAttribute(nL) === t.name ? n.setAttribute(rL, "") : n.removeAttribute(rL);
		let n = t.name === null ? null : e.querySelector(`[${nL}="${t.name}"]`), r = n === null ? null : xL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		_L(e, "--ui-color-input-base", r === null ? "transparent" : CL(r[0], r[1], r[2], 255)), yL(e, `[${eL}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${JI}]`)) n.getAttribute(JI) === t.pane ? n.setAttribute(YI, "") : n.removeAttribute(YI);
		for (let n of e.querySelectorAll(`[${KI}]`)) n.getAttribute(KI) === t.pane ? n.setAttribute(qI, "") : n.removeAttribute(qI);
	}
	resolveRgb(e, t) {
		if (t.name === null) return TL(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${nL}="${t.name}"]`), r = n === null ? null : xL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? TL(t.hue, t.saturation, t.value) : bL([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${GI}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${II}`));
			return;
		}
		let n = e.target.closest(`[${KI}]`), r = e.target.closest(`.${II}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(KI), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${nL}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(nL)
			}));
			return;
		}
		let a = r.querySelector(`.${RI}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${II}`);
		if (t !== null) {
			if (e.target.hasAttribute(eL)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(tL) && this.commit(t, (t) => ({
				...t,
				opacity: G(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${II}`);
		if (n === null) return;
		if (t.hasAttribute(eL) || t.hasAttribute(tL)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(QI)) {
			let e = xL(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = wL(e[0], e[1], e[2]);
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
		let r = t.getAttribute($I);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = G(Number(t.value));
		let [l, u, d] = wL(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${HI}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = EL((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = EL((t.x - a.left) / a.width), s = 1 - EL((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || O(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${HI}`);
		a !== null && (a.value = mL(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		O(e) || e.querySelector(`.${HI}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(oL) && e.hasAttribute(sL)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${RI}`);
		if (t === null) return;
		let n = e.getAttribute(aL) === "swatch", r = n ? e.querySelector(`.${VI}`) : e.querySelector(`.${BI}`), i = n ? r : r?.querySelector(`[${GI}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${qI}]`) ?? !0
		});
	}
};
function lL(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? oL : sL))(t) ? t : t === "picker" ? "palette" : "picker";
}
function uL(e) {
	return lL(e, "picker");
}
function dL(e) {
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
function fL(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function pL(e) {
	return e.querySelector(`.${HI}`)?.value.trim() ?? "";
}
function mL(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = SL(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${MI(e.opacity)}`;
}
function hL(e, t, n, r, i) {
	if (e.getAttribute(iL) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = SL(t, n, r);
	return i === 255 ? a : `${a}${MI(i)}`;
}
function gL(e, t) {
	for (let n of e.querySelectorAll(`.${zI}`)) n.textContent !== t && (n.textContent = t);
}
function _L(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function vL(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function yL(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function bL(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		G(e[0] * (1 - n)),
		G(e[1] * (1 - n)),
		G(e[2] * (1 - n))
	] : [
		G(e[0] + (255 - e[0]) * n),
		G(e[1] + (255 - e[1]) * n),
		G(e[2] + (255 - e[2]) * n)
	];
}
function xL(e) {
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
function SL(e, t, n) {
	return `#${MI(e)}${MI(t)}${MI(n)}`;
}
function CL(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function wL(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function TL(e, t, n) {
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
		G((o + a) * 255),
		G((s + a) * 255),
		G((c + a) * 255)
	];
}
function EL(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var DL = `:is(.ui-surface, .ui-card)[${ae}]`, OL = "ui-surface--clickable", kL = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new ac();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), PL(t, ["hover", "press"], (e) => NL(e.closest(Ic))), R(t, DL, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(DL));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(DL) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(OL)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), IL(e, "role", ML(e) ? "group" : "button"), IL(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : jL(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = AL(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function AL(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !A(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(OL) && t.hasAttribute("tabindex") ? t : null;
}
function jL(e) {
	let t = e.closest(gl);
	return t !== null && t.closest(N)?.matches(".ui-items-view, .ui-table") === !0 && Rc(t) === e;
}
function ML(e) {
	for (let t of e.querySelectorAll(Ic)) if (Vc(e, t)) return !0;
	return !1;
}
function NL(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${OL}`) ?? null; n !== null; n = n.parentElement?.closest(`.${OL}`) ?? null) t.push(n);
	return t;
}
function PL(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || FL(t, e, !1);
		for (let t of a) FL(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function FL(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), IL(e, Nr, r.length === 0 ? null : r.sort().join(" "));
}
function IL(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var LL = "ui-table", RL = "ui-table--reorderable", zL = "ui-scroll-x--auto", BL = "ui-scroll-x--always", VL = `:scope > .${Rn}`, HL = `.${Bn}`, UL = "ui-table__header-cell", WL = `${UL}--pinned`, GL = `${VL} > .${zn} > .${UL}`, KL = `${GL}--pinned`, qL = "ui-table__host", JL = `${VL} > .${qL}`, YL = `.${LL}, .${Ln}, [${Nn}]`, XL = "--ui-table-columns", ZL = "--ui-table-sticky-top", QL = "--ui-table-sticky-bottom", $L = "--ui-table-sized-columns", eR = "--ui-table-pin-", tR = 64, nR = "data-ui-table-cell-hidden", rR = "data-ui-table-cell-last", iR = "columns", aR = "hidden", oR = "order", sR = "layout", cR = 32, lR = 16, uR = class {
	root;
	store = new xO();
	restored = /* @__PURE__ */ new WeakSet();
	widths = /* @__PURE__ */ new WeakMap();
	orders = /* @__PURE__ */ new WeakMap();
	hiddenChoices = /* @__PURE__ */ new WeakMap();
	columnStates = /* @__PURE__ */ new WeakMap();
	stampedStates = /* @__PURE__ */ new WeakMap();
	indexedStates = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	reorder;
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.drag = new Cm({
			root: this.root,
			resolveHandle: (e) => e.closest(HL),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new Cm({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), PL(this.root, ["hover", "press"], (e) => {
			let t = e.closest(HL)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Pf) e !== "base" && matchMedia(If(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${LL}`)), R(this.root, `.${LL}`, {
			childList: !0,
			relevant: hR
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), R(this.root, `.${LL}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(LL)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), R(this.root, `.${LL}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: gR
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(JL);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), hP(t, () => this.pin(t));
			let e = t.querySelector(VL);
			e !== null && hP(e, () => dR(t, e));
			let n = t.querySelector(JL);
			n !== null && (this.markScrollbar(t, n), hP(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, iR), r = n === null ? null : ss(n);
		r !== null && r.length !== t.length ? (this.store.write(e, iR, null), this.store.writeBoot(e, sR, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, oR);
		if (i !== null && !vR(i, t)) {
			this.store.write(e, oR, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Zn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${LL}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = _R(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(zL) || e.classList.contains(BL);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty($L);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Is(t, n);
				e.style.setProperty($L, ds(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Vl}${t}`, String(r[t])) : e.style.removeProperty(`${Vl}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(In) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(In, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Kn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Kn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(RL)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= tR) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Nn}]`)) {
				let r = Number(t.getAttribute(Nn));
				!(r >= tR) || t.closest(`.${LL}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(nR, n.hidden.has(r)), t.toggleAttribute(rR, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Kl(e, _R(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(GL)) {
			let e = Number(n.getAttribute(Nn)), r = n.getAttribute(Pn), i = n.classList.contains(WL) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: SR(r) ? r : null,
				startsHidden: n.hasAttribute(Fn),
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
		for (let e of t) (n[e.key] ?? xR(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, aR) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(XL).trim(), n = t.length === 0 ? null : ss(t);
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
		n === null || i !== void 0 && n === xR(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, aR, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return _R(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(KL).length;
		if (t < 2) return;
		let n = Ms(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${eR}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${LL}`)?.toggleAttribute(Xn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(VL), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return pR(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && A(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(HL), n = t ?? (e.shiftKey ? fR(e.target) : null);
		if (n === null || this.drag.active || !A(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? os(lR, i.sizes.reduce((e, t) => e + t, 0)) : lR;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${LL}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Nn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || (e.preventDefault(), !(s < 0 || s >= i.length) && (this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(HL) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${LL}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = ys(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(cR, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, mR(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, iR, t === null ? null : ds(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue($L).trim(), n = e.getAttribute(In), r = {};
		t.length > 0 && (r[$L] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, sR, null);
			return;
		}
		this.store.writeBoot(e, sR, {
			styles: r,
			attributes: {
				[In]: n,
				[Kn]: e.getAttribute(Kn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${LL}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = ms(t.getAttribute(Dn)), i = hs(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Nn)), u = this.hiddenOf(t, o), d = _R(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${UL}`), n = t?.closest(`.${LL}`) ?? null;
		return t === null || n === null || !n.classList.contains(RL) || e.closest(HL) !== null || t.classList.contains(WL) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${LL}`), r = Number(e.getAttribute(Nn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(qn, ""), e.setAttribute(Jn, ""), {
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
		for (let a of _R(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > yR(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), bR(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Yn, "after") : a.cell.setAttribute(Yn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Jn), t.table.removeAttribute(qn), bR(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Tm(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = _R(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, oR, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function dR(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${qL}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(ZL, `${n}px`), e.style.setProperty(QL, `${r}px`);
}
function fR(e) {
	let t = e.matches(`.${UL}`) ? e.querySelector(`:scope > ${HL}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function pR(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function mR(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function hR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(YL) || t.querySelector(YL) !== null)) return !0;
	return !1;
}
function gR(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(qL);
}
function _R(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function vR(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function yR(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function bR(e) {
	for (let t of e.querySelectorAll(`[${Yn}]`)) t.removeAttribute(Yn);
}
function xR(e) {
	return e.startsHidden || e.hideBelow !== null && Pf.indexOf(Rf()) < Pf.indexOf(e.hideBelow);
}
function SR(e) {
	return e !== null && Pf.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var CR = /* @__PURE__ */ new WeakMap();
function wR(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(zt);
	for (let i of V(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = TR(i, a) ?? ER(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${yt}]`)) n.has(t) || t.remove();
}
function TR(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : CR.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function ER(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (AR(i, t.getAttribute(_)), CR.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function DR(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t(n), i = r.get(e);
		i === void 0 ? r.set(e, [n]) : i.push(n);
	}
	let i = n.filter((e) => r.has(e)), a = new Set(i);
	for (let e of r.keys()) a.has(e) || i.push(e);
	return {
		buckets: r,
		order: i
	};
}
function OR(e) {
	return e.find((e) => !e.classList.contains(Jr));
}
function kR(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return AR(o, r), o.appendChild(a), o;
}
function AR(e, t) {
	e.setAttribute(yt, ""), t === null ? e.removeAttribute(bt) : e.setAttribute(bt, t);
}
var jR = "bottom", MR = "pending";
function NR(e, t, n) {
	let r = e.querySelector(`:scope > [${jt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(jt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function PR(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var FR = /* @__PURE__ */ new WeakMap();
function IR(e) {
	for (let t of e.querySelectorAll(`:scope > [${yt}]`)) t.remove();
}
function LR(e, t, n, r, i, a) {
	let o = BC(e, V(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = jC(i.getItemsFilterSortMetadata(t), a, DC(e));
	if (c && !l && IR(e), o.length === 0) {
		FR.set(e, []);
		return;
	}
	let d = sC(e);
	if (!l) {
		PR(e, [...MC(o, u, r), ...oC(d)]);
		return;
	}
	IR(e);
	let { buckets: f, order: p } = DR(o, (e) => e.getAttribute("data-ui-group") ?? "", FR.get(e) ?? []), m = r.getAncestorStack(e);
	FR.set(e, p);
	let h = [];
	for (let e of p) {
		let t = f.get(e);
		u.length > 0 && (t = MC(t, u, r));
		let n = e === "" ? void 0 : OR(t);
		if (n !== void 0) {
			let e = kR(s, r, r.getItemValue(n), n.getAttribute(_), m);
			e !== null && h.push(e);
		}
		h.push(...t);
	}
	PR(e, [...h, ...oC(d)]);
}
//#endregion
//#region src/items/items-host-sync.ts
var RR = "ui-tree-rules", zR = `:scope > .${Hn}:not(.${Gn})`;
function BR(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(RR, { bubbles: !0 })), cC(e, t, n.templates, n.renderer, e.querySelector(zR) !== null);
		return;
	}
	switch (B(e)) {
		case "windowed":
			cC(e, t, n.templates, n.renderer), HR(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			OC(e, t, n.metadata, n.renderer, n.state), VR(e), cC(e, t, n.templates, n.renderer), LR(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function VR(e) {
	let t = Lu(e);
	t !== null && Iu(t, V(e).filter((e) => e instanceof HTMLElement));
}
function HR(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	wR(e, (e) => kR(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(_), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var UR = ".ui-table", WR = `:scope > .${Rn} > .${zn} > [role='columnheader']`, GR = `:scope > .${Bn}`, KR = "input:not([type='hidden']), button, select, textarea, a[href]", qR = /* @__PURE__ */ new WeakMap();
function JR(e) {
	for (let t of e.querySelectorAll(WR)) {
		let e = YR(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function YR(e) {
	let t = e.querySelector(KR);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(GR);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function XR(e, t = null) {
	let n = ZR(e), r = qR.get(e), i = n.find((e) => t !== null && $R(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (QR(e, i), !0);
}
function ZR(e) {
	let t = Hl(e), n = [];
	for (let r of e.querySelectorAll(WR)) {
		let e = YR(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && M(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function QR(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), qR.set(e, t), t.focus();
}
function $R(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function ez(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(UR) && YR(t) === e ? n : null;
}
function tz(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n($R(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Wc(e.key, "horizontal")) return !1;
	let r = Uc({
		key: e.key,
		items: ZR(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && QR(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var nz = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), rz = ".ui-table", iz = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), az = `:scope > [${v}], :scope > .${Rn}, :scope > .${Rn} > [${v}]`, oz = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(N)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), R(this.root, N, {
			childList: !0,
			attributeFilter: [
				Pr,
				Ir,
				Lr,
				Mt
			]
		}, (e) => this.applyAll(e)), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [Ne]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = Bl(e);
		El(e, t);
		for (let t of e.querySelectorAll(az)) cz(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(rz) && JR(e);
		for (let n of t) {
			let t = Rc(n);
			t !== null && cz(t);
			for (let e of zc(n)) cz(e);
			sz(e, n, n.hasAttribute(Ne));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = Fl(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = KS(r, It) !== null, a = n === "first" ? GS(r) === 0 && !qS(r, "data-ui-window-more-before") : !qS(r, Rt);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Ou(n === "first" ? "Home" : "End", t, null, gz(e));
		o !== null && (su(e, t, o), e.getAttribute("data-ui-selection") === "one" && Ol(e, t, o, vl));
	}
	handleClick(e) {
		let t = this.resolveRow(e, N);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Bl(n);
		if (su(n, i, r, e.target instanceof Element ? Cu(r, e.target) : null), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			xl(n, r);
			return;
		}
		Ol(n, i, r, Sl(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(gl), r = n?.closest(N) ?? null;
		return n === null || r === null || n.closest(N) !== r || !r.matches(t) || E(r) ? null : Hc(e.target, n) === null && !D(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Fl(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, _l);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Nu(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Ac(e)) return;
		let t = ez(e.target);
		if (t !== null && !E(t)) {
			tz(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = $l(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || E(r) || lu(r) && lz(e) && this.handleCellKey(r, e)) return;
		let i = gz(r);
		if (!nz.has(e.key) && !Eu(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Bl(r), o = nu(a), s = Ou(e.key, a, ru(a), i);
		if (s !== null) {
			e.preventDefault(), su(r, a, s, e.key === "ArrowUp" && !e.shiftKey && lu(r) ? Su(s) : null), dz(r, a, o, s, Cl(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(rz) && XR(r, _u(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || D(o)) return;
		let c = Rc(o);
		switch (e.key) {
			case " ":
				fz(r, a, o, c);
				break;
			case "Enter":
				mz(r, a, o, c);
				break;
			case "Delete":
				if (!pz(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Bl(e), r = ru(n);
		if (r === null || D(r)) return !1;
		let i = gu(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = vu(e, r, i, t.key);
				return o !== null && su(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? yu(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), su(e, n, r, o), !0);
			}
			default: return i !== null && uz(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Fl(e) : null;
		if (n === null || B(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? GS(n) === 0 && !qS(n, "data-ui-window-more-before") : !qS(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Qc(n, r ? 0 : Zc(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Fl(e);
		if (n === void 0 || r === null) return;
		let i = Vu(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? ru(Bl(e)) : null, o = i ?? (a === null ? null : F(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Fl(e), n = Vu(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Bl(e), r = ru(n) ?? Ou("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (su(e, n, r, du(r, t)), e.getAttribute("data-ui-selection") === "one" && Ol(e, n, r, vl));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(N) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(az)].includes(t)) {
			I(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(N) && e.target.matches(".ui-items-view, .ui-table") && !E(e.target) && !id()) {
			au(e.target, Bl(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(gl) : null, i = r?.closest(N) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || Hc(e.target, r) === null || su(i, Bl(i), r, e.target instanceof Element ? Cu(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(N) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && od(n, !0);
			for (let e of n.querySelectorAll(az)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) cz(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(gl)) continue;
			let n = e.closest(N);
			n !== null && n.matches(".ui-items-view, .ui-table") && sz(n, e, e.hasAttribute(Ne));
		}
	}
};
function sz(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(N) === e && rI(n);
		return;
	}
	for (let n of t.querySelectorAll(Wu)) n.tabIndex >= 0 && n.parentElement?.closest(N) === e && Vc(t, n) && nI(n);
}
function cz(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function lz(e) {
	return iz.has(e.key) || ob(e) !== null;
}
function uz(e, t) {
	let n = t.key, r = ob(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && Tu(e, t)) return !0;
	let a = Rc(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !xu(e))) return !1;
	let o = fd(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function dz(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && bl(e, n), Ol(e, t, r, i, a));
}
function fz(e, t, n, r) {
	Ol(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || hz(n, r);
}
function pz(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = _z(t, n);
	for (let e of r) Nu(e, "remove");
	return r.length > 0;
}
function mz(e, t, n, r) {
	wl(e) && !Dl(t).includes(n) && Ol(e, t, n, vl), hz(n, r), r === null && Nu(n, "open");
}
function hz(e, t) {
	t === null ? Nu(e, Mu) : t.click();
}
function gz(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function _z(e, t) {
	let n = Dl(e);
	return (n.includes(t) ? n : [t]).filter((e) => !ts(e, "data-ui-unremovable") && !D(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var vz = "ui-tree__row--folded", yz = "fold-hidden", bz = "fold-shown", xz = "ui-tree__row--dragging", Sz = "ui-tree__loading", Cz = "ui-tree__loading-ring", wz = "ui-tree-node__text", Tz = "ui-tree-node__toggle", Ez = "ui-tree-node__rename", Dz = ".ui-text__title", Oz = Wn, kz = "--ui-tree-depth", Az = "expanded", jz = 600, Mz = .25, Nz = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, Pz = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Fz = class {
	root;
	store = new xO();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(RR, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${Vn}`) : null;
			t !== null && (this.layout(t), Iu(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => F(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${Vn}`)), R(this.root, `.${Vn}`, {
			childList: !0,
			attributeFilter: [
				$n,
				er,
				nr,
				sr
			],
			relevant: Rz
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Cw(e)?.getAttribute($n);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = F(e), r = Cw(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(er) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ee = p && (o === null ? t[n] ?? m : o.has(n)), g = o !== null && !o.has(n);
			e.style.setProperty(kz, String(u)), e.setAttribute("aria-level", String(u + 1)), ou(e, r?.querySelector(`:scope > .${wz}`) ?? null), e.classList.toggle(vz, !d), e.classList.toggle(Gn, g), e.removeAttribute(or), e.draggable = i && $S(e), p ? e.setAttribute("aria-expanded", ee ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(ir), ee && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(ir, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ee || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(ir), d && ee && !g), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: ee,
				authoredShown: h
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return Cw(e.row)?.hasAttribute(nr) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Hn}[${_}="${x(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, yz, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, bz, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [or]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ra(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = DC(t);
		if (r === void 0 && i === null) return null;
		let a = jC(r, this.rules.state, i), o = AC(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(F)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Cw(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => NC(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(F(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Sz}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = F(o), c = i.getItemValue(o);
			if (c === void 0 || kC(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Cw(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Sz) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? zz();
		o.style.setProperty(kz, String(t)), o.classList.toggle(vz, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Tz}`) === null && (!ts(r, "data-ui-unselectable") || Hc(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Hc(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Nu(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Hn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || D(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || E(t) || id() || au(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || !(e.target instanceof Element)) return;
		let t = $l(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || E(n)) return;
		let r = e.altKey && A(e, { alt: !0 }) ? Nz[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!Pz.has(e.key) && !Eu(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = nu(i), o = Ou(e.key, i, ru(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Cl(n, e));
			return;
		}
		if (!(a === null || D(a))) {
			switch (e.key) {
				case " ":
					fz(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Ou("ArrowDown", i, a, "vertical"), vl);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), vl);
					break;
				case "Enter":
					mz(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !pz(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = nu(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = kw(Vz(n), F(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => F(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !ts(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = Bz(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(sr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (D(t)) {
			e.preventDefault();
			return;
		}
		let a = QS(t, this.rowsOf(n)), o = ZS(n, i, a);
		r ? zh(e, n, t, xz, F(t), a.filter((e) => e !== t), tC(o, !0)) : Vh(e, F(t), tC(o, !1)), nC(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(xz));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Vn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Hn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = F(t), o = (e) => n.some((t) => F(t) === e || Lz(i, e, F(t))), s = ww(t, Cw(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? Mz : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = Vz(f), m = Number(t.style.getPropertyValue(kz)) || 0, h = new Set(n.map(F)), ee = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, g = i.get(a) ?? "", te = ee === void 0 ? {
			parent: g,
			before: d === "before" ? a : Nw(p, g, a, !1, h)
		} : {
			parent: a,
			before: ee.key
		};
		return !Tw(te.parent, (e) => f.find((t) => F(t) === e) ?? null) || o(te.parent) ? null : {
			mark: d,
			place: te,
			depth: ee === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), jz)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Vn}`);
		t !== null && Hh(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Vn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Oz}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Lz(a, F(e), F(t)))), s = r.getAttribute(Oz) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Bh(t, xz), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = Pw(Vz(this.rowsOf(e)), t.map(F), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = Cw(e)?.querySelector(`.${wz}`) ?? null;
			r !== null && (r.setAttribute(ar, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), rw(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = Bz(e)?.closest(".ui-tree") ?? null;
		t !== null && (Bh(t, xz), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Dw(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(F(n), Cw(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = F(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(vz)) : [];
		this.store.writeJson(e, Az, i), this.layout(e), Iz(a.filter((e) => !e.classList.contains(vz)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, Az) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = nu(r);
		su(e, r, t), n !== null && dz(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = Cw(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => F(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${Vn}`), n = Cw(e), r = n?.querySelector(Dz) ?? null;
		t === null || n === null || r === null || ts(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), dc({
			container: n,
			title: r,
			className: Ez,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(rr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${v}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function Iz(e) {
	if (!(e.length === 0 || jf())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: L.fast,
		easing: L.enter
	});
}
function Lz(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Rz(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function zz() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Sz, e.setAttribute("aria-hidden", "true"), t.className = Cz, e.append(t, T.text("ui.tree.loading")), e;
}
function Bz(e) {
	return e.target instanceof Element ? e.target.closest(`.${Hn}`) : null;
}
function Vz(e) {
	return e.map((e) => ({
		key: F(e),
		parent: Cw(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: ww(e, Cw(e)),
		shown: !e.classList.contains(Gn)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var Hz = {
	visibilityState: () => document.visibilityState,
	notificationPermission: Wz
};
function Uz(e) {
	return e !== "hidden";
}
function Wz() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var Gz = 200;
function Kz(e = Hz) {
	return {
		visible: Uz(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var qz = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? Hz, this.settleMilliseconds = e.settleMilliseconds ?? Gz;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = Kz(this.source), this.held;
	}
	changed() {
		clearTimeout(this.timer), this.timer = setTimeout(() => this.send(), this.settleMilliseconds);
	}
	start() {
		document.addEventListener("visibilitychange", () => this.changed()), navigator.permissions?.query({ name: "notifications" }).then((e) => e.addEventListener("change", () => this.changed())).catch(() => void 0);
	}
	send() {
		let e = this.held;
		if (e === null) return;
		let t = Kz(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function Jz(e) {
	return {
		permission: Wz,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function Yz(e, t, n = Jz()) {
	if (n.permission() !== "granted") return !1;
	let r = {
		address: e.address,
		windowId: e.windowId,
		bringTo: e.bringTo,
		action: e.action
	}, i = {
		body: e.body,
		tag: e.tag,
		renotify: e.tag.length > 0 && !e.silent,
		icon: e.icon,
		silent: e.silent,
		requireInteraction: e.requireInteraction,
		data: r
	};
	try {
		let r = await n.registration();
		if (r !== void 0) return await r.showNotification(e.title, i), !0;
		let a = n.create(e.title, i);
		return a.addEventListener("click", () => {
			n.focus(), a.close(), t();
		}), !0;
	} catch {
		return !1;
	}
}
function Xz(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && Zz(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function Zz(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function Qz(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var K = "ui-tabs-view", $z = "ui-tab-item__label", eB = "ui-tab-item__close", tB = "ui-tab-item__rename", nB = "ui-tab-item__caption", rB = "ui-tab-item__pin", iB = ".ui-text__title", aB = "ui-tab-item--dragging", oB = "ui-tab-item__caption--overflowed", sB = "ui-tabs-view--overflowing", cB = "ui-tabs-view--no-overflow", lB = "ui-tab-item__page", uB = "ui-tab-item--selected", dB = `.${y}`, fB = "tab-menu-entry", pB = {
	name: fB,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, mB = "tab-pin";
function hB(e) {
	return {
		name: mB,
		registration: WS((e) => YC(e.target), e)
	};
}
var gB = "--ui-tabs-view-strip", _B = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new FF({
			rootClass: K,
			overflowingClass: sB,
			wraps: (e) => e.classList.contains(cB),
			hiddenClass: oB,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => OB(e) === t.key))?.querySelector(`.${$z}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(_k, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), PL(this.root, ["press"], (e) => {
			let t = e.closest(`.${eB}`)?.closest(`.${nB}`) ?? null;
			return t === null ? [] : [t];
		}), R(this.root, `.${K}`, {
			childList: !0,
			attributeFilter: [
				zr,
				Se,
				ue,
				...Hr
			],
			relevant: (e) => !Gp(e, `.${lB}`, `.${K}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${K}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		yB(e, t);
		let n = t.filter(Rk), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = ml(n, r, OB);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(Se), o = t.find((e) => e.classList.contains(uB))?.querySelector(`.${nB}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = OB(e) === r;
			e.classList.toggle(uB, t);
			let i = e.querySelector(`.${nB}`);
			i !== null && (i.draggable = a, HF(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${$z}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${lB}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${lB}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), UF(o, c), o !== null && o !== c && WF(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${$z}`);
			t === null || e.classList.contains(oB) || (u.push(t), e === c && (d = t));
		}
		j(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && I(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Rk(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(gB, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${v}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${AF}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => OB(e) === t)?.querySelector(`.${$z}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Rk).map((e) => ({
				key: OB(e),
				title: e.querySelector(`.${$z}`)?.textContent?.trim() ?? OB(e),
				current: OB(e) === t,
				disabled: E(e.querySelector(`.${$z}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${qC}`);
		if (n === null || !n.classList.contains(K) || r === null || r.closest(`.${K}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = SB(n, r), a = wB(t), o = a.map((e) => {
			if (CB(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Rk(e) ? "shown" : "hidden";
		});
		if (fk(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: OB(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${we}="tab"]`), n = t?.parentElement ?? null, r = e.closest(dB);
		if (t === null || n === null || !n.classList.contains(K) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => OB(e) === a.key);
		if (i.length === 0 || r.matches(`${xn}, ${bn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(fB, {
			bubbles: !0,
			detail: { keys: [i, OB(o)] }
		})), !0;
		if (SB(n, o).get(i) !== !0) return !0;
		switch (i) {
			case ak: {
				let e = o.querySelector(`.${$z}`);
				e !== null && this.startRename(e);
				break;
			}
			case ok:
			case sk:
				this.setPinned(n, o, i === ok);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${nB} > .${rB}`);
		t.toggleAttribute(Vr, n), r !== null && (r.toggleAttribute(Vr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = Qz(a.map(DB));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? JC(a[a.length - 1]).after(JC(t)) : JC(s).before(JC(t)), t.dispatchEvent(new Event(mB, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${AF}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(K)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = TB(e.target), i = r?.closest(`.${K}`) ?? null;
		if (r === null || i === null || E(r)) return;
		let a = r.closest(`.${qC}`);
		a !== null && a.closest(`.${K}`) === i && (e.preventDefault(), this.select(i, OB(a)), document.activeElement !== r && I(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${eB}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${K}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), bB(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = TB(e.target), n = t?.closest(`.${K}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(iB) ?? e, r = e.closest(`.${qC}`);
		t === null || r === null || XC(r, "data-ui-unrenamable") || dc({
			container: t,
			title: n,
			className: tB,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Br, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => I(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ac(e)) return;
		let t = e.target.closest(`.${$z}`), n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${qC}`);
		if (r === null || r.closest(`.${K}`) !== n) return;
		if (e.key === "Delete" && A(e)) {
			if (!xB(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && A(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!A(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${$z}`)).filter((e) => e !== null), a = Uc({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${qC}`);
		o !== null && this.select(n, OB(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || XC(t, "data-ui-undraggable") || E(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? JC(t).after(JC(i)) : JC(t).before(JC(i)), rw(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = EB(e);
		if (t === null) return;
		if (XC(t, "data-ui-undraggable") || E(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		zh(e, t.closest(`.${K}`) ?? t, t, aB, OB(t));
		let n = JC(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nB}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${aB}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${nB}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = JC(r), o = t.hasAttribute("data-ui-tab-pinned") ? vB(n, a) : null, s = o ?? JC(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && t.querySelector(`.${aB}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = EB(e);
		if (t === null) return;
		t.classList.remove(aB);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(JC(t), n.next);
			return;
		}
		let r = JC(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${K}`);
		i !== null && rw(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		pl(e, t, {
			attribute: zr,
			bindingAttribute: Rr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return dl(e, `.${qC}`, `.${K}`);
	}
};
function vB(e, t) {
	let n = null;
	for (let r of dl(e, `.${qC}`, `.${K}`)) {
		let e = JC(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function yB(e, t) {
	let n = !t.some((e) => !XC(e, ue));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(xe, n);
}
function bB(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !XC(t, "data-ui-unremovable");
}
function xB(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && bB(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !E(t);
}
function SB(e, t) {
	return dk(uk(e.getAttribute(Ce)), {
		pinned: t.hasAttribute(Vr),
		renamable: !XC(t, de),
		removable: e.hasAttribute("data-ui-tabs-removes") && bB(e, t)
	});
}
function CB(e) {
	let t = e.getAttribute(_);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function wB(e) {
	let t = e.querySelector(`[${v}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function TB(e) {
	return e.closest(`.${eB}`) !== null || uc(e) ? null : e.closest(`.${nB}`)?.querySelector(`:scope > .${$z}`) ?? null;
}
function EB(e) {
	return e.target instanceof Element ? e.target.closest(`.${nB}`)?.closest(".ui-tab-item") ?? null : null;
}
function DB(e) {
	return { pinned: e.hasAttribute(Vr) };
}
function OB(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var kB = "button.ui-text__fold-toggle", AB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(kB);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, jB = "ui-temporal-input__segments", MB = "ui-temporal-input__segment", NB = "ui-temporal-input__segment-literal", PB = "ui-temporal-input__segment--empty", FB = "data-ui-temporal-segment", IB = "data-ui-temporal-step-direction", LB = "data-ui-temporal-segments-of", RB = "--", zB = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${H}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ta(e.components, `.${H}`));
		}), R(this.root, `.${H}`, { attributeFilter: [...TT] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) DT(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${jB}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = OT(e), r = NT(e), i = U(e, VT(t));
		t.getAttribute(LB) !== n && (t.replaceChildren(...BB(n).map((e) => HB(e))), t.setAttribute(LB, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(FB);
			if (t === null) {
				n.textContent = WB(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = GB(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(PB, i === null), n.tabIndex = 0, KB(n, t, i, O(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !A(e, { shift: !0 })) return;
		let t = JB(e.target);
		if (t === null) return;
		let n = t.closest(`.${H}`), r = t.getAttribute(FB), i = qB(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), XB(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), qT(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = ZB(e.key, NT(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = JB(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = JB(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = L_(this.wheelTurn, I_(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${H}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(FB), n < 0 ? 1 : -1, qB(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${IB}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${IB}]`);
		if (t === null) return;
		let n = t.closest(`.${H}`);
		if (n === null || O(n)) return;
		e.preventDefault();
		let r = YB(n) ?? n.querySelector(`.${MB}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(FB), t.getAttribute(IB) === "up" ? 1 : -1, qB(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${MB}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${H}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = U(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, QT(e, $B(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = QB(t), o = AT(kT(e), a) * n, s = a === "hour" ? 24 : 60, c = ((jT(i, a) + o) % s + s) % s;
		this.write(e, QT(e, MT(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? MT(t, "hour", eV(l, t.getHours() >= 12)) : MT(t, QB(n), l), i);
		}
		u && XB(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, $B(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return U(e, t) ?? ZT(e);
	}
	write(e, t, n) {
		qT(e, t, n), YT(e), this.applySegments(e);
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
function BB(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Ca(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(VB(r)), n += r.length;
	}
	return t;
}
function VB(e) {
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
function HB(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = NB, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = MB, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(FB, e.unit), t.dataset.width = String(e.width), UB(t, e.unit), t;
}
function UB(e, t) {
	if (t === "meridiem") {
		T.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = QB(t);
	T.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function WB(e, t, n, r) {
	return t && n !== null ? va(n, e, r) : e;
}
function GB(e, t, n, r) {
	if (n === null) return RB;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Wa(n.getHours()) : jT(n, QB(e));
	return String(i).padStart(t, "0");
}
function KB(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? Wa(n.getHours()) : jT(n, QB(t))));
}
function qB(e) {
	return VT(e.closest(`.${jB}`));
}
function JB(e) {
	let t = e instanceof Element ? e.closest(`.${MB}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${H}`);
	return n === null || O(n) ? null : t;
}
function YB(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${MB}`) : null;
}
function XB(e, t, n) {
	Uc({
		key: n,
		items: [...e.querySelectorAll(`.${MB}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function ZB(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function QB(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function $B(e, t) {
	return MT(e, "hour", eV(Wa(e.getHours()), t === "pm"));
}
function eV(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var tV = "datetime", nV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${pt}`), T.temporal === null), T.onTable(() => this.apply(this.root.querySelectorAll(`.${pt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(ta(e.components, `.${pt}`))), R(this.root, `.${pt}`, {
			childList: !0,
			attributeFilter: [tV],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: T.temporal,
			language: T.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Ja(a.getAttribute(ht)), o = qa(a.getAttribute(tV)), s = a.querySelector(`.${mt}`);
			if (s === null || t && !rV(e, o, r)) continue;
			let c = o === null ? "" : Qa(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Ya(e) && o !== null;
		}
		i && Ao(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${pt}:is([${ht}="relative"], [${ht}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function rV(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && $a(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var iV = /* @__PURE__ */ new Map();
function aV(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${v}]`)) if (t.closest(b) === e) return t;
	return null;
}
function oV(e, t, n, r) {
	let i = sV(e, t);
	return i !== null && (iV.set(e, {
		key: t,
		block: n
	}), cV(e, i, n, r), !0);
}
function sV(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function cV(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Yc(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = lV(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function lV(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function uV(e) {
	let t = iV.get(e);
	if (t === void 0) return;
	let n = sV(e, t.key);
	if (n === null) {
		iV.delete(e);
		return;
	}
	cV(e, n, t.block, "auto");
}
function dV(e) {
	if (!(iV.size === 0 || !(e instanceof Node))) for (let t of [...iV.keys()]) (!t.isConnected || Yc(t).contains(e)) && iV.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var fV = "data-ui-scroll-anchor", pV = "End", mV = `[${fV}="${pV}"]`, hV = 4, gV = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], _V = /* @__PURE__ */ new WeakSet();
function vV(e) {
	_V.add(e);
}
function yV(e) {
	dV(e);
	for (let t = e.closest(mV); t !== null; t = t.parentElement?.closest(mV) ?? null) _V.delete(t);
}
var bV = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of gV) this.root.addEventListener(e, (e) => xV(e), {
			capture: !0,
			passive: !0
		});
		R(this.root, `[${fV}="${pV}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ut]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !CV(t) || this.pinned.set(t, _V.has(t) || TV(t) && !wV(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${fV}="${pV}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), _V.has(t)) {
				this.pinned.set(t, !0), SV(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (wV(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), SV(t);
			}
		}
	}
	watchRows(e) {
		if (this.resizes === null) return;
		this.watchedContainers.has(e) || (this.watchedContainers.add(e), this.resizes.observe(e));
		let t = this.watched.get(e), n = /* @__PURE__ */ new Set();
		for (let r of e.children) r.hasAttribute("data-ui-window-spacer") || (n.add(r), t?.has(r) !== !0 && this.resizes.observe(r));
		for (let e of t ?? []) n.has(e) || this.forget(e);
		this.watched.set(e, n);
	}
	handleResize(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = n.target;
			if (this.watchedContainers.has(e)) {
				this.followOwnBox(e);
				continue;
			}
			let r = e.parentElement;
			if (!e.isConnected || r === null || !CV(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? SV(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !CV(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && SV(e);
	}
	followsEnd(e) {
		return _V.has(e) || this.pinned.get(e) !== !1 && !wV(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function xV(e) {
	dV(e.target);
	let t = e.target instanceof Element ? e.target.closest(mV) : null;
	t !== null && _V.delete(t);
}
function SV(e) {
	e.scrollTop = e.scrollHeight;
}
function CV(e) {
	return e.getAttribute(fV) === pV;
}
function wV(e) {
	return qS(e, Rt);
}
function TV(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= hV;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var EV = `${Fc}, [role='menu'], [role='tab']`, DV = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? OV, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(EV) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function OV(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function kV(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = jV(e, a, n), s = jV(e, a + 1, n);
	return MV(t, o.top, s.top, o.line, s.line);
}
function AV(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = jV(e, a, n), s = jV(e, a + 1, n);
	return MV(t, o.line, s.line, o.top, s.top);
}
function jV(e, t, n) {
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
function MV(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var NV = 250, PV = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Ot);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < NV && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Ot}="${x(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Ot}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = FV(e, "data-ui-scroll-viewport") ?? IV(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? RV(e) : null, a = i === null ? null : RV(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = AV(a, kV(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? LV(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function FV(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function IV(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : FV(e, v);
	return t === null ? null : Yc(t);
}
function LV(e, t) {
	return t > 0 ? e / t : 0;
}
function RV(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${kt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${At}]`);
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
var zV = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", BV = `.${ri}, .ui-action, .${y}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${zV}`, VV = ".ui-expander--quiet > .ui-expander__header", HV = "ui-key-value-action__row", UV = `${BV}, ${`${gl}, .${HV}`}`, WV = "ui-pressing", GV = "ui-press-held", KV = "--ui-press-x", qV = "--ui-press-y", JV = "--ui-ripple-radius", YV = "--ui-ripple-opacity", XV = class {
	clicks;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		if (t === null || typeof t.animate != "function" || jf()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(KV, `${r}px`), t.style.setProperty(qV, `${i}px`), t.classList.add(WV, GV);
		let o = t.animate([{ [JV]: "0px" }, { [JV]: `${a}px` }], {
			duration: L.ripple,
			easing: L.ease,
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
		if (e.closest(".ui-tab-item__close, .ui-tab-item__rename") !== null) return null;
		let t = e.closest(zV) ?? e.closest(UV);
		if (t === null || E(t) || t.matches(VV)) return null;
		let n = e.closest(ei);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(BV) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Hc(t, e) !== null || D(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(N), r = n !== null && !e.classList.contains(HV) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && ts(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : P(e);
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
	finishAll() {
		for (let [e, t] of [...this.presses]) this.finish(e, t);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		n.element.classList.remove(GV);
		let r = Math.max(0, L.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, L.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [YV]: 1 }, { [YV]: 0 }], {
			duration: L.normal,
			delay: i,
			easing: L.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(WV, GV), this.presses.get(e) === t && this.presses.delete(e);
	}
}, ZV = "ui-overlay-scrollbar", QV = "ui-overlay-scrollbar__box", $V = "ui-overlay-scrollbar__thumb", eH = "ui-overlay-scrollbar--shown", tH = "ui-overlay-scrollbar__thumb--held", nH = "(hover: hover) and (forced-colors: none)", rH = "--ui-overlay-thumb", iH = 12, aH = 2, oH = 24, sH = 900, cH = 16, lH = class {
	doc;
	layer;
	bars;
	media;
	resized = new ResizeObserver(() => this.schedule());
	changed = new MutationObserver(() => this.schedule());
	active;
	target = null;
	point = null;
	pickTarget = !1;
	repick = !1;
	hovered = !1;
	drag = null;
	frame = 0;
	settle = 0;
	constructor(e = document) {
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = ZV, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), im((e) => e.includes(this.bars.y.thumb) ? this.bars.y.scroller : e.includes(this.bars.x.thumb) ? this.bars.x.scroller : null), this.media = window.matchMedia(nH), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
			capture: !0,
			passive: !0
		}), e.documentElement.addEventListener("pointerleave", () => this.leave()), e.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.schedule());
	}
	createBar(e, t) {
		let n = e.createElement("div"), r = e.createElement("div");
		return n.className = `${QV} ${QV}--${t}`, r.className = `${$V} ${$V}--${t}`, n.append(r), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
			box: n,
			thumb: r,
			scroller: null
		};
	}
	follow() {
		this.active = this.media.matches, this.drag = null, this.target = null, this.hovered = !1, this.forget(), this.active ? (this.raise(), this.schedule()) : this.layer.matches(":popover-open") && this.layer.hidePopover();
	}
	raise() {
		typeof this.layer.showPopover == "function" && (this.layer.matches(":popover-open") && this.layer.hidePopover(), this.layer.showPopover());
	}
	place(e) {
		if (e === null) return;
		let t = e.closest("dialog:modal"), n = t ?? this.doc.body;
		if (this.layer.parentElement !== n) {
			n.append(this.layer), t?.addEventListener("close", () => this.leaveDialog(t), { once: !0 }), this.raise();
			return;
		}
		e.closest(":popover-open") !== null && this.raise();
	}
	leaveDialog(e) {
		this.layer.parentElement === e && (this.forget(), this.doc.body.append(this.layer), this.active && this.raise(), this.schedule());
	}
	handlePointerMove(e) {
		if (!this.active || e.pointerType !== "mouse" || this.drag !== null) return;
		let t = e.target instanceof Element ? e.target : null;
		this.point = {
			x: e.clientX,
			y: e.clientY
		}, !(t === this.target || t !== null && this.layer.contains(t)) && (this.target = t, this.pickTarget = !0, this.schedule());
	}
	handleScroll(e) {
		if (!this.active) return;
		let t = e.target instanceof Element ? e.target : document.scrollingElement;
		if (t !== null) {
			if (t === this.bars.y.scroller || t === this.bars.x.scroller) {
				this.schedule(), !this.hovered && this.drag === null && this.settleLater();
				return;
			}
			if (this.hovered || this.drag !== null) {
				this.repick = this.hovered && this.drag === null, this.schedule();
				return;
			}
			this.pick(mH(t, "y") ? t : null, mH(t, "x") ? t : null, !1), this.settleLater(), this.schedule();
		}
	}
	pick(e, t, n) {
		let r = e !== this.bars.y.scroller || t !== this.bars.x.scroller;
		if (this.hovered = n && (e !== null || t !== null), r) {
			this.forget(), this.bars.y.scroller = e, this.bars.x.scroller = t;
			for (let n of e === t ? [e] : [e, t]) n !== null && (this.resized.observe(n), this.changed.observe(n, {
				childList: !0,
				subtree: !0
			}), n.firstElementChild !== null && this.resized.observe(n.firstElementChild));
			this.place(e ?? t);
		}
		this.hovered ? (window.clearTimeout(this.settle), this.settle = 0) : n && this.drag === null && this.settleLater();
	}
	forget() {
		this.resized.disconnect(), this.changed.disconnect(), this.bars.y.scroller = null, this.bars.x.scroller = null;
	}
	leave() {
		this.target = null, this.drag === null && (this.hovered = !1, this.settleLater());
	}
	settleLater() {
		window.clearTimeout(this.settle), this.settle = window.setTimeout(() => {
			this.settle = 0, !(this.hovered || this.drag !== null) && (this.forget(), this.schedule());
		}, sH);
	}
	schedule() {
		this.frame === 0 && (this.frame = window.requestAnimationFrame(() => this.drawFrame()));
	}
	drawFrame() {
		if (this.frame = 0, !this.active) return;
		this.layer.isConnected || (this.doc.body.append(this.layer), this.raise()), this.repick ? this.pickAt(this.point === null ? null : document.elementFromPoint(this.point.x, this.point.y)) : this.pickTarget && this.pickAt(this.target), this.repick = !1, this.pickTarget = !1;
		let e = this.measure("y"), t = this.measure("x");
		this.apply(this.bars.y, e), this.apply(this.bars.x, t);
	}
	pickAt(e) {
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(uH(e, "y"), uH(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !mH(t, e)) return null;
		let n = _H(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t;
		return {
			view: n,
			thumb: vH(t, e, hH(t), r)
		};
	}
	apply(e, t) {
		if (t === null) {
			e.box.classList.remove(eH);
			return;
		}
		let { view: n, thumb: r } = t;
		Object.assign(e.box.style, {
			left: `${n.left}px`,
			top: `${n.top}px`,
			width: `${n.width}px`,
			height: `${n.height}px`
		}), Object.assign(e.thumb.style, {
			left: `${r.left - n.left}px`,
			top: `${r.top - n.top}px`,
			width: `${r.width}px`,
			height: `${r.height}px`
		}), e.box.classList.add(eH);
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && SH(n), i = yH(n, t, hH(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		yV(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(tH), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: xH(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = bH(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = bH(t.scroll, n, t.ratio, t.rtl);
	}
	release(e) {
		this.drag !== null && e.pointerId === this.drag.pointerId && (this.endDrag(), this.point = {
			x: e.clientX,
			y: e.clientY
		}, this.repick = !0, this.schedule());
	}
	lose(e) {
		this.drag !== null && e.pointerId === this.drag.pointerId && (this.endDrag(), this.hovered = !1, this.settleLater());
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(tH), this.drag = null;
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * pH(e, n, "x"), a = e.deltaY * pH(e, n, "y"), o = dH(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (yV(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function uH(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (mH(n, t)) return n;
	return null;
}
function dH(e, t, n) {
	for (let r = e; r !== null; r = uH(r.parentElement, t)) if (mH(r, t) && fH(r, t, n)) return r;
	return null;
}
function fH(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = xH(e, t), a = t === "x" && SH(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function pH(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? cH : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function mH(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(rH).trim() !== "none";
}
function hH(e) {
	if (e === document.scrollingElement) return CH(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = gH(t.width, n?.offsetWidth), i = gH(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return CH(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function gH(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function _H(e) {
	let t = hH(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = wH(t, hH(n))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = wH(t, CH(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function vH(e, t, n, r) {
	let i = SH(e), a = yH(e, t, n, r, i), o = a.max > 0 ? xH(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - iH,
		top: a.start + o,
		width: iH,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - iH,
		width: a.thumb,
		height: iH
	};
}
function yH(e, t, n, r, i) {
	let a = (t === "y" ? n.top : n.left) + aH + (r && i && t === "x" ? iH : 0), o = (t === "y" ? n.height : n.width) - 4 - (r ? iH : 0), s = t === "y" ? e.clientHeight : e.clientWidth, c = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: a,
		length: o,
		thumb: Math.min(o, Math.max(oH, o * s / c)),
		max: c - s
	};
}
function bH(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function xH(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function SH(e) {
	return getComputedStyle(e).direction === "rtl";
}
function CH(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function wH(e, t) {
	return CH(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var TH = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), EH = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], DH = `.${Gr}, .${Kr}`, OH = RegExp(`(^|\\s)(${Gr}|${Kr})(\\s|$)`), kH = RegExp(`(^|\\s)${qr}(\\s|$)`), AH = "[type='range']", jH = /* @__PURE__ */ new WeakSet(), MH = /* @__PURE__ */ new WeakSet();
function NH(e = document) {
	let t = e === document ? window : e;
	for (let e of EH) t.addEventListener(e, VH, !0);
	t.addEventListener("keydown", UH, !0), t.addEventListener("change", WH, !0), t.addEventListener("pointerdown", GH, !0), t.addEventListener("mousedown", GH, !0), RH(e.querySelectorAll(DH)), IH(e.querySelectorAll(`[${Wr}]`)), FH(e.querySelectorAll(AH)), new MutationObserver((e) => {
		for (let t of e) PH(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Wr],
		attributeOldValue: !0
	});
}
function PH(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			LH(t, e.oldValue !== null);
			return;
		}
		let n = OH.test(e.oldValue ?? ""), r = t.matches(DH);
		n !== r && (zH(t, r), LH(t)), kH.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && FH(t.querySelectorAll(AH));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(DH) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && BH(n), n.matches(DH) && zH(n, !0), RH(n.querySelectorAll(DH)), LH(n), IH(n.querySelectorAll(`[${Wr}]`)), FH([n, ...n.querySelectorAll(AH)]));
}
function FH(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = O(t);
		e !== jH.has(t) && (e ? (jH.add(t), t.addEventListener("touchstart", GH, { passive: !1 })) : (jH.delete(t), t.removeEventListener("touchstart", GH)));
	}
}
function IH(e) {
	for (let t of e) LH(t);
}
function LH(e, t = !1) {
	let n = e.getAttribute(Wr);
	n === null && !t || (e.matches(DH) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Kg(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function RH(e) {
	for (let t of e) zH(t, !0);
}
function zH(e, t) {
	for (let n of e.children) t ? BH(n) : MH.has(n) && (MH.delete(n), n.removeAttribute("inert"));
}
function BH(e) {
	e.hasAttribute("inert") || (MH.add(e), e.setAttribute("inert", ""));
}
function VH(e) {
	e.target instanceof Element && (E(e.target) ? (e.type === "click" && dm(e), KH(e)) : e.type === "click" && HH(e.target) && e.preventDefault());
}
function HH(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && O(e);
}
function UH(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && E(e.target)) {
			KH(e);
			return;
		}
		!TH.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && O(e.target) && e.preventDefault();
	}
}
function WH(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && O(e.target) && e.stopImmediatePropagation();
}
function GH(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !O(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function KH(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var qH = /* @__PURE__ */ new WeakMap(), JH = /* @__PURE__ */ new WeakSet(), YH = /* @__PURE__ */ new WeakSet(), XH = new ah({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = qH.get(e);
		qH.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => JH.has(e),
	sheetOnPhone: ({ popup: e }) => YH.has(e)
});
function ZH(e) {
	return {
		open: (e, t, n) => QH(e, t, n, (e) => XH.open(e)),
		openList: $H,
		listKey: ED,
		followPointer: kD,
		focusReturn: (t) => Dd(t, e)
	};
}
function QH(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => XH.popupOf(i) === t;
	return qH.set(t, n.onDismiss), n.closesOnTab === !0 ? JH.add(t) : JH.delete(t), n.sheetOnPhone === !0 ? YH.add(t) : YH.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (qH.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && XH.reposition(i);
		},
		close: () => {
			a() && XH.close(i);
		}
	};
}
function $H(e, t, n) {
	return QH(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => TD(XH, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var eU = "--ui-color-series-count", tU = "--ui-color-series-", nU = 8;
function rU(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(eU));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : nU;
}
function iU(e, t) {
	return `var(${tU}${e % t + 1})`;
}
var aU = {
	count: rU,
	color: iU
};
//#endregion
//#region src/items/item-rows.ts
function oU(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: vC,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => eu(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(N);
			return t !== null && lu(t) ? fu(t, e) : [];
		},
		moveCursor: (e, t) => wu(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var sU = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? uU(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), dU(l, n, t);
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
		let i = lU(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: w(r),
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
			cU(n, e) && this.applyBoundAttribute(i, String(C(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = C(t.bindingId);
			e.push([t, `[${qe}${gi(n.propertyName)}="${x(r)}"]`]);
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
		let r = gU(t, n.templateKeyPropertyName);
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
		r !== void 0 && mC(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : pC(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Wo(u, () => this.metadata.isTranslatable(a) && !hC(l)), f = C(a.componentId), p = e.closest(`[${ae}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = yi(p, t, () => [e])[0] ?? null;
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
function cU(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = C(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function lU(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? yC(r, i.name) : wC(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return TC(r, i.key, n), e;
	let a = r;
	return a[xC(a, i.name)] = n, e;
}
function uU(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function dU(e, t, n) {
	e.setAttribute(_, t), hU(e, n), pU(e, n);
}
var fU = [
	["CanSelect", ce],
	["CanDrag", le],
	["CanRemove", ue],
	["CanRename", de],
	["CanShowContextMenu", fe]
];
function pU(e, t) {
	for (let [n, r] of fU) {
		let i = yC(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function mU(e, t) {
	let n = e.getAttribute(_), r = e.closest(`[${v}]`);
	if (pU(e, t), n !== null) for (let i of e.querySelectorAll(`[${_}="${x(n)}"]`)) i.closest("[data-ui-items-host]") === r && pU(i, t);
}
function hU(e, t) {
	let n = yC(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(xt, n.value) : e.removeAttribute(xt);
}
function gU(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = yC(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var _U = "Group", vU = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = C(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), R(e.root, `[${wt}="${Tt}"]`, { attributeFilter: [at] }, (e) => {
			for (let t of e) {
				let e = ra(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), R(e.root, `[${Et}="windowed"]`, { attributeFilter: [zt] }, (e) => {
			for (let t of e) {
				let e = ra(t);
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
			for (let [t, n] of e) t.isConnected && BR(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(C(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : CC(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${v}]`)) {
			if (B(r) !== "virtualized") continue;
			let i = r.closest(b);
			i === null || !this.drawsPatchedComponent(i, C(e.reference.componentId), t) || !yU(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(w(i), t) && this.sync(r, w(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${w(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? w(e) === n.scopeComponentId : w(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		BR(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${_}="${x(t)}"]`)].filter((t) => this.isItemRoot(t) && Xi(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${v}]`), i = r === null ? null : ra(r);
		if (r !== null && i !== null && B(r) === "virtualized") {
			let a = e.getAttribute(_);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = bU(_U, t);
		a && hU(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		fU.some(([e]) => bU(e, t)) && mU(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && bU(_U, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => bU(e.itemProperty, t)) || n.sorts.some((e) => bU(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${v}]`)) {
			let n = ra(t);
			n === e && this.sync(t, n);
		}
	}
};
function yU(e, t) {
	let n = Yi(e, Ji(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function bU(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var xU = "ui-table", SU = "ui-table--no-header";
function CU(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(xU)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(SU)) && (s ? o : a).push(t);
	a.forEach((e, t) => wU(e, t));
	for (let [e, n] of t) wU(e, a.length + n);
	n !== null && o.forEach((e, t) => wU(e, a.length + n + t)), TU(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function wU(e, t) {
	TU(e, "aria-rowindex", String(t + 1));
}
function TU(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var EU = 50, DU = 1, OU = .5, kU = 60, AU = "--ui-window-look", jU = "--ui-window-row", MU = "--ui-window-tile", NU = 3, PU = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	started = !1;
	forgotten = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	start() {
		let e = !this.started;
		this.started = !0;
		for (let t of this.hosts()) {
			let n = this.forgotten.delete(t) || e;
			if (this.layout(t), UU(t) === 0) {
				this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			if (n) {
				this.revealWindow(t);
				continue;
			}
			this.realign(t), this.considerRequest(t);
		}
	}
	forget(e) {
		for (let t of this.hosts()) {
			if (!e.contains(t)) continue;
			let n = this.states.get(t);
			n !== void 0 && n.scheduled !== 0 && window.clearTimeout(n.scheduled), this.states.delete(t), this.forgotten.add(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = KS(e, Ft);
		if (t !== null && CV(e) && qS(e, "data-ui-window-more-after")) {
			Qc(e, Math.max(0, this.windowBottom(e, t) - Zc(e).height));
			return;
		}
		t !== null && t !== 0 && Qc(e, qS(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = HU(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : el(n[n.length - 1]).bottom - el(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = KS(e, Ft), n = HU(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Zc(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		B(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${v}][${Et}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Xc(e.target);
		if (t === null || B(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, kU));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && UU(e) > 0) return;
		let n = HU(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = KS(e, Ft), i = qS(e, Lt), a = qS(e, Rt);
		if (r !== null) {
			let o = this.windowSize(e), s = Zc(e), c = Math.max(1, Math.round(s.height * DU / t.itemSize), Math.floor(o * OU)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, WU(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, WU(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Zc(e), s = Math.max(1, o.height * DU), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, WU(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, WU(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = KS(e, It);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ra(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(b);
		e.setAttribute(Mt, t.toLowerCase()), c?.setAttribute(Mt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && KS(e, "data-ui-window-total") === null && IU(e) && NR(e, MR, NU * this.rowSize(e));
		let l = KS(e, Ft) === null, u = l && t === "Before" ? zU(e) : null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: GU(e),
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
			o.pending = !1, e.removeAttribute(Mt), c?.removeAttribute(Mt), e.removeAttribute("aria-busy"), NR(e, MR, 0), this.layout(e), u !== null && VU(e, u), o.restless || l && RU(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = HU(e), r = KS(e, It), i = KS(e, Ft);
		if (CU(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			NR(e, "top", 0), NR(e, jR, 0);
			return;
		}
		if (n.length > 0) {
			let r = el(n[n.length - 1]).bottom - el(n[0]).top;
			if (r > 0) {
				let i = FU(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), LU(e, a > 1 ? (el(n[n.length - 1]).top - el(n[0]).top) / (a - 1) : r, i > 1 ? el(n[1]).left - el(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		NR(e, "top", a), NR(e, jR, o), uV(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(jU));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = KS(e, Pt);
		return t !== null && t > 0 ? t : EU;
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
function FU(e) {
	let t = el(e[0]).top, n = 1;
	for (; n < e.length && el(e[n]).top === t;) n++;
	return n;
}
function IU(e) {
	return getComputedStyle(e).getPropertyValue(AU).trim() === "skeleton";
}
function LU(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(jU) !== i && r.setProperty(jU, i), r.getPropertyValue(MU) !== a && (a.length === 0 ? r.removeProperty(MU) : r.setProperty(MU, a));
}
function RU(e, t, n) {
	let r = HU(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && WU(i) !== n;
}
function zU(e) {
	let t = HU(e)[0];
	return t === void 0 ? null : {
		row: t,
		at: BU(e, t)
	};
}
function BU(e, t) {
	return el(t).top + Zc(e).top;
}
function VU(e, t) {
	if (!t.row.isConnected) return;
	let n = BU(e, t.row) - t.at;
	n !== 0 && Qc(e, Zc(e).top + n);
}
function HU(e) {
	return [...e.children].filter((e) => e.hasAttribute(_));
}
function UU(e) {
	return HU(e).length;
}
function WU(e) {
	return e.getAttribute(_);
}
function GU(e) {
	let t = e.closest(b);
	return t === null ? [] : Yi(t, Ji(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var KU = [
	ae,
	oe,
	se
];
function qU(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, JU(c, e.itemRole);
	let l = XU(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = YU(l, t, n, a);
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
		d.className = l.wrapperClassName, JU(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), dU(d, r, n), c.appendChild(d);
	}
	return dU(c, r, n), o.registerItemScope(c, l, n), c;
}
function JU(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function YU(e, t, n, r) {
	let i = gU(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function XU(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of KU) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), w(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function ZU(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return QU(i.renderer.renderItem(e, t, n, r), a);
	let s = qU(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), QU(s, a);
}
function QU(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), qo(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var $U = 6, eW = 60, tW = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
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
	rangeKeysOf(e, t, n) {
		let r = this.states.get(e)?.projected.filter((e) => !e.header), i = r?.findIndex((e) => e.entry.key === t) ?? -1, a = r?.findIndex((e) => e.entry.key === n) ?? -1;
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => aW(e.entry) === !1).map((e) => e.entry.key);
	}
	shownKeysOf(e) {
		let t = this.states.get(e);
		if (t === void 0) return null;
		let n = [];
		for (let e of t.projected) e.header || n.push(e.entry.key);
		return n;
	}
	reveal(e, t, n) {
		let r = this.states.get(e), i = r === void 0 ? -1 : r.projected.findIndex((e) => !e.header && e.entry.key === t);
		if (r === void 0 || i < 0) return null;
		let a = r.projected[i].entry;
		if (!lW(e) && !sW(e)) return a.element;
		let o = getComputedStyle(e), s = fW(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = lW(e) ? uW(r.projected, c, r.across) : null, u = l === null ? i : cW(l.starts, i), d = l?.pitches ?? c, f = pW(o.paddingTop) + mW(d, 0, u), p = f + d[u] - s, m = Zc(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Qc(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = CV(e) && TV(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !TV(e) && (Qc(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Zd(t.item, o)) {
				i.push(t);
				continue;
			}
			t !== void 0 && (this.dropRow(e, t.element), a.push(n)), i.push({
				key: n,
				item: o,
				element: null,
				height: t?.height ?? null
			});
		}
		for (let e of r.values()) e.element?.remove(), a.push(e.key);
		return n.entries = i, a;
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = Ru(t);
		t.remove(), zu(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Lu(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Vu(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(Ne), l === void 0) {
			r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? su(r, V(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Pe, l.key);
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
		let i = n.entries[r].element, a = Lu(e), o = V(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Pu(a, o, i) : null;
		i?.remove(), n.entries.splice(r, 1), s?.();
	}
	replace(e, t, n, r, i) {
		let a = this.getState(e), o = a === null ? -1 : a.entries.findIndex((e) => e.key === t);
		if (a !== null) {
			if (o < 0) {
				this.insert(e, n, r, i);
				return;
			}
			this.dropRow(e, a.entries[o].element), a.entries[o] = {
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
		return i === null || a === void 0 ? !1 : (a.item = lU(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = DC(e), i = this.options.templates.getGroupTemplate(t.componentId), a = jC(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => kC(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => oW(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => NC(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = DR(o, oW, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => NC(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Xc(e.target);
		t !== null && B(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && B(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, eW));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = fW(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = lW(e) ? uW(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || sW(e)) && u > 0) {
			let i = pW(r.paddingTop), a = Zc(e), o = rW(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - $U), f = Math.min(u, f + $U);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), ee = [], g = [], te = -1, ne = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || te++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(oW(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), iW(t, i, null), ne = !0);
				continue;
			}
			if (o !== null) {
				i.header && AR(o, i.entry.key), ee.push(o), i.header || g.push([o, te]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || Bu(e, s), iW(t, i, s), ee.push(s), i.header || g.push([s, te]), ne = !0);
		}
		let re = new Set(ee);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ne = !0);
		for (let t of V(e)) re.has(t) || (this.dropRow(e, t), ne = !0);
		for (let t of e.querySelectorAll(`:scope > [${yt}]`)) re.has(t) || (t.remove(), ne = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let ie = mW(l, 0, d), ae = mW(l, f, u);
		PR(e, [...ee, ...oC(sC(e))]), NR(e, "top", ie > 0 ? ie - i : 0), NR(e, jR, ae > 0 ? ae - i : 0), cC(e, t.componentId, this.options.templates, this.options.renderer, o > 0), CU(e, g, te + 1), (ne || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = dW(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return ZU(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : kR(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(oW(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = el(o);
			s.height <= 0 || (nW(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(oW(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ia(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of V(e)) {
			let e = t.getAttribute(_);
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
			laidAcross: 1,
			firstLine: -1,
			lastLine: -1,
			across: 1,
			tileWidth: null,
			scheduled: 0,
			first: -1,
			last: -1
		};
		return this.states.set(e, c), this.resizes?.observe(e), c;
	}
};
function nW(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function rW(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Qc(e, a + l + o), a + l);
}
function iW(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = oW(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function aW(e) {
	let t = yC(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function oW(e) {
	let t = yC(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function sW(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function cW(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function lW(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function uW(e, t, n) {
	let r = [], i = [], a = 0;
	for (; a < e.length;) {
		if (r.push(a), e[a].header) {
			i.push(t[a]), a++;
			continue;
		}
		let o = 0;
		for (let r = 0; r < n && a < e.length && !e[a].header; r++, a++) o = Math.max(o, t[a]);
		i.push(o);
	}
	return {
		starts: r,
		pitches: i
	};
}
function dW(e, t, n) {
	let r = e.clientWidth - pW(t.paddingLeft) - pW(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = pW(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function fW(e) {
	return pW(e.rowGap);
}
function pW(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function mW(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var hW = "data-ui-template", gW = "default", _W = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? gW, r = this.findTemplate(e, n);
		return r === void 0 ? n === gW ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${hW}]`);
		for (let e of r) if (e.getAttribute(hW) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= vW(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, gt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, _t);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function vW(e) {
	let t = /* @__PURE__ */ new Set();
	return Uo(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(b)) {
			let n = w(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function yW(e, t) {
	let n = e.querySelector(`style[${br}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(br, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var bW = "script[type='application/json'][data-ui-metadata]";
function xW(e = document) {
	let t = e.querySelector(bW);
	if (t === null) return SW();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return SW();
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
function SW() {
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
var CW = "script[type='application/json'][data-ui-hydration]";
function wW(e) {
	return e !== null && (ho(e.title) || ho(e.changes));
}
function TW(e = document) {
	let t = e.querySelector(CW)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t), n = e.words;
		return {
			pageId: e.pageId ?? null,
			sequence: typeof e.sequence == "number" ? e.sequence : null,
			view: typeof e.view == "string" ? e.view : null,
			identity: Array.isArray(e.identity) ? e.identity.filter((e) => typeof e == "string") : [],
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
var EW = "reconnecting";
async function DW(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), EW;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function OW(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function kW(e, t, n) {
	e.addEventListener("message", (e) => {
		let r = e.data;
		r?.kind === "ne:which-window" ? e.ports[0]?.postMessage(t) : r?.kind === "ne:notification-click" && n({
			bringTo: typeof r.bringTo == "string" ? r.bringTo : void 0,
			action: typeof r.action == "string" ? r.action : void 0
		});
	}), e.startMessages();
}
//#endregion
//#region src/runtime/service-worker.ts
var AW = "/_ne/", jW = 3e3;
function MW(e, t, n) {
	let r = e.getAttribute(vr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (kW(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => PW(i.ready);
	let a = i.register(r, { scope: AW }).then(NW).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function NW(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function PW(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), jW))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var FW = "ne-standard-ui:reloaded-view";
function IW(e, t, n) {
	if (!t) return "no-cookie";
	if (zW(n) === e) return "asked-again";
	try {
		n?.setItem(FW, e);
	} catch {}
	return "reload";
}
function LW(e) {
	try {
		e?.removeItem(FW);
	} catch {}
}
function RW() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function zW(e) {
	try {
		return e?.getItem(FW) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var BW = 2e3, VW = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? BW, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Dr, "reconnecting"), this.notice = this.notifications.show({
			message: T.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Dr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Dr, "lost");
	}
}, HW = "/_ne/values", UW = 32768;
UW / 4;
var WW = 3e4;
function GW(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function KW(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function qW(e, t = null, n = WW) {
	if (e === void 0 || !KW(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${HW}/${encodeURIComponent(r)}${i}`, {
			credentials: "same-origin",
			signal: AbortSignal.timeout(n)
		});
		if (!a.ok) throw Error(`Fetching a staged value failed with status ${a.status}.`);
		let { valueToken: o, ...s } = e;
		return {
			...s,
			value: await a.json()
		};
	}));
	return {
		...e,
		updates: r
	};
}
async function JW(e) {
	let t = await fetch(HW, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(WW)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var YW = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(XW(ZW(e)));
	}
	async dispatchAsync(e) {
		let t = ZW(e), n = XW(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		let r = this.nextRequestId++, i = this.expect(r);
		try {
			let e = await this.sendAsync({
				...t,
				requestId: r
			});
			return e.accepted === !0 ? await i : e;
		} finally {
			this.awaited.delete(r), this.pendingKeys.delete(n);
		}
	}
	sendAsync(e) {
		let t = GW(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : JW(t), i = () => {}, a = new Promise((e) => {
			i = e;
		});
		return r?.catch(() => {}), this.staging = a, (async () => {
			try {
				await n;
				let t = r === null ? null : await r;
				return this.transport.processEventAsync(t === null ? e : {
					...e,
					dynamicParameters: [],
					dynamicParametersToken: t
				});
			} finally {
				i(), this.staging === a && (this.staging = null);
			}
		})();
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
function XW(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function ZW(e) {
	return e.action === void 0 ? {
		eventId: C(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/transport/inbound-order.ts
var QW = class {
	apply;
	constructor(e) {
		this.apply = e;
	}
	pushed(e) {
		return (t, n) => queueMicrotask(() => e(t, n));
	}
	answered(e, t, n, r) {
		return e.then(async (e) => (await this.apply(t(e), r), n(e)));
	}
};
async function $W(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var eG = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Zd(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = tG(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(nG([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(tG(e, t));
		let n = this.unplaced.get(nG(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = tG(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(nG([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = nG(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, nG(t.slice(0, e - 1)));
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
		return `${C(e.componentId)}:${e.propertyId}:${rG(t)}`;
	}
};
function tG(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function nG(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function rG(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var iG = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, aG = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, oG = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, sG = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, cG = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, lG = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, uG = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, dG = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, fG = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, pG = class {
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
}, q;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var mG = class {
	constructor() {}
	log(e, t) {}
};
mG.instance = new mG();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var hG = "10.0.11", J = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, Y = class e {
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
function gG(e, t) {
	let n = "";
	return vG(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${_G(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function _G(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function vG(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function yG(e, t, n, r, i, a) {
	let o = {}, [s, c] = CG();
	o[s] = c, e.log(q.Trace, `(${t} transport) sending data. ${gG(i, a.logMessageContent)}.`);
	let l = vG(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(q.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function bG(e) {
	return e === void 0 ? new SG(q.Information) : e === null ? mG.instance : e.log === void 0 ? new SG(e) : e;
}
var xG = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, SG = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${q[e]}: ${t}`;
			switch (e) {
				case q.Critical:
				case q.Error:
					this.out.error(n);
					break;
				case q.Warning:
					this.out.warn(n);
					break;
				case q.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function CG() {
	let e = "X-SignalR-User-Agent";
	return Y.isNode && (e = "User-Agent"), [e, wG(hG, TG(), DG(), EG())];
}
function wG(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function TG() {
	if (Y.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function EG() {
	if (Y.isNode) return process.versions.node;
}
function DG() {
	return Y.isNode ? "NodeJS" : "Browser";
}
function OG(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function kG() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var AG = class extends pG {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Y.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(kG());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new oG();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new oG();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(q.Warning, "Timeout from HTTP request."), n = new aG();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, vG(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(q.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new iG(await jG(i, "text") || i.statusText, i.status);
		let a = await jG(i, e.responseType);
		return new fG(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Y.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function jG(e, t) {
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
var MG = class extends pG {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new oG()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (vG(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new oG());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new fG(r.status, r.statusText, r.response || r.responseText)) : n(new iG(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(q.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new iG(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(q.Warning, "Timeout from HTTP request."), n(new aG());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, NG = class extends pG {
	constructor(e) {
		if (super(), typeof fetch < "u" || Y.isNode) this._httpClient = new AG(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new MG(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new oG()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, PG = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
PG.RecordSeparatorCode = 30, PG.RecordSeparator = String.fromCharCode(PG.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var FG = class {
	writeHandshakeRequest(e) {
		return PG.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (vG(e)) {
			let r = new Uint8Array(e), i = r.indexOf(PG.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(PG.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = PG.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, X;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(X ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var IG = class {
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
		return this.observers.push(e), new xG(this, e);
	}
}, LG = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			vG(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new RG(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, vG(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === X.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: X.Sequence,
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
			case X.Invocation:
			case X.StreamItem:
			case X.Completion:
			case X.StreamInvocation:
			case X.CancelInvocation: return !0;
			case X.Close:
			case X.Sequence:
			case X.Ping:
			case X.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: X.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, RG = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, zG = 3e4, BG = 15e3, VG = 1e5, Z;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Z ||= {});
var HG = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(q.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, J.isRequired(e, "connection"), J.isRequired(t, "logger"), J.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? zG, this.keepAliveIntervalInMilliseconds = a ?? BG, this._statefulReconnectBufferSize = o ?? VG, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new FG(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Z.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: X.Ping });
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
		if (this._connectionState !== Z.Disconnected && this._connectionState !== Z.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== Z.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = Z.Connecting, this._logger.log(q.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), Y.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = Z.Connected, this._connectionStarted = !0, this._logger.log(q.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = Z.Disconnected, this._logger.log(q.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(q.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(q.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new LG(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(q.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === Z.Disconnected) return this._logger.log(q.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === Z.Disconnecting) return this._logger.log(q.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = Z.Disconnecting, this._logger.log(q.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(q.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Z.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new oG("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new IG();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === X.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === X.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case X.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(q.Error, `Invoke client method threw error: ${OG(e)}`);
					});
					break;
				case X.StreamItem:
				case X.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === X.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(q.Error, `Stream callback threw error: ${OG(e)}`);
						}
					}
					break;
				}
				case X.Ping: break;
				case X.Close: {
					this._logger.log(q.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case X.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case X.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(q.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(q.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(q.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(q.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === Z.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === Z.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(q.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(q.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(q.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(q.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(q.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(q.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(q.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new oG("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Z.Disconnecting ? this._completeClose(e) : this._connectionState === Z.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Z.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = Z.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), Y.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(q.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(q.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = Z.Reconnecting, e ? this._logger.log(q.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(q.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(q.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== Z.Reconnecting) {
				this._logger.log(q.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(q.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== Z.Reconnecting) {
				this._logger.log(q.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = Z.Connected, this._logger.log(q.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(q.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(q.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== Z.Reconnecting) {
					this._logger.log(q.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === Z.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(q.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(q.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(q.Error, `Stream 'error' callback called with '${e}' threw error: ${OG(t)}`);
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
			type: X.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: X.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: X.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: X.Invocation
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
			type: X.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: X.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: X.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: X.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: X.Completion
		} : {
			invocationId: e,
			result: n,
			type: X.Completion
		};
	}
	_createCloseMessage() {
		return { type: X.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, UG = [
	0,
	2e3,
	1e4,
	3e4,
	null
], WG = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? UG : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, GG = class {};
GG.Authorization = "Authorization", GG.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var KG = class extends pG {
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
		e.headers ||= {}, this._accessToken ? e.headers[GG.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[GG.Authorization] && delete e.headers[GG.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, qG;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(qG ||= {});
var JG;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(JG ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var YG = class {
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
}, XG = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new YG(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, JG, "transferFormat"), this._url = e, this._logger.log(q.Trace, "(LongPolling transport) Connecting."), t === JG.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = CG(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === JG.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(q.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new iG(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(q.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(q.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(q.Trace, `(LongPolling transport) data received. ${gG(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new iG(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof aG ? this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(q.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(q.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? yG(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(q.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(q.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = CG();
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
			i ? i instanceof iG && (i.statusCode === 404 ? this._logger.log(q.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(q.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(q.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(q.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(q.Trace, e), this.onclose(this._closeError);
		}
	}
}, ZG = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, JG, "transferFormat"), this._logger.log(q.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== JG.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Y.isBrowser || Y.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = CG();
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
						this._logger.log(q.Trace, `(SSE transport) data received. ${gG(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(q.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? yG(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, QG = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, JG, "transferFormat"), this._logger.log(q.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Y.isNode || Y.isReactNative) {
				let t = {}, [r, i] = CG();
				t[r] = i, n && (t[GG.Authorization] = `Bearer ${n}`), o && (t[GG.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === JG.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(q.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(q.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(q.Trace, `(WebSockets transport) data received. ${gG(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(q.Trace, `(WebSockets transport) sending data. ${gG(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(q.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, $G = 100, eK = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, J.isRequired(t, "url"), this._logger = bG(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Y.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Y.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Y.isNode && !n.WebSocket && r && (n.WebSocket = r), !Y.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Y.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new KG(n.httpClient || new NG(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= JG.Binary, J.isIn(e, JG, "transferFormat"), this._logger.log(q.Debug, `Starting connection with transfer format '${JG[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(q.Error, e), await this._stopPromise, Promise.reject(new oG(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(q.Error, e), Promise.reject(new oG(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new nK(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(q.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(q.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(q.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(q.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === qG.WebSockets) this.transport = this._constructTransport(qG.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new oG("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < $G);
				if (r === $G && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof XG && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(q.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(q.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = CG();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(q.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new uG("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof iG && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(q.Error, t), Promise.reject(new uG(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(q.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(q.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new lG(`${n.transport} failed: ${e}`, qG[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(q.Debug, e), Promise.reject(new oG(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new dG(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case qG.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new QG(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case qG.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new ZG(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case qG.LongPolling: return new XG(this._httpClient, this._logger, this._options);
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
		let i = qG[e.transport];
		if (i == null) return this._logger.log(q.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (tK(t, i)) {
			if (e.transferFormats.map((e) => JG[e]).indexOf(n) >= 0) {
				if (i === qG.WebSockets && !this._options.WebSocket || i === qG.ServerSentEvents && !this._options.EventSource) return this._logger.log(q.Debug, `Skipping transport '${qG[i]}' because it is not supported in your environment.'`), new sG(`'${qG[i]}' is not supported in your environment.`, i);
				this._logger.log(q.Debug, `Selecting transport '${qG[i]}'.`);
				try {
					return this.features.reconnect = i === qG.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(q.Debug, `Skipping transport '${qG[i]}' because it does not support the requested transfer format '${JG[n]}'.`), /* @__PURE__ */ Error(`'${qG[i]}' does not support ${JG[n]}.`);
		}
		return this._logger.log(q.Debug, `Skipping transport '${qG[i]}' because it was disabled by the client.`), new cG(`'${qG[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(q.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(q.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(q.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(q.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(q.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(q.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(q.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!Y.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(q.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function tK(e, t) {
	return !e || (t & e) !== 0;
}
var nK = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new rK(), this._transportResult = new rK(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new rK(), this._transportResult.promise;
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
			this._sendBufferedData = new rK();
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
}, rK = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, iK = "json", aK = class {
	constructor() {
		this.name = iK, this.version = 2, this.transferFormat = JG.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = mG.instance);
		let n = PG.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case X.Invocation:
					this._isInvocationMessage(n);
					break;
				case X.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case X.Completion:
					this._isCompletionMessage(n);
					break;
				case X.Ping: break;
				case X.Close: break;
				case X.Ack:
					this._isAckMessage(n);
					break;
				case X.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(q.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return PG.write(JSON.stringify(e));
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
}, oK = {
	trace: q.Trace,
	debug: q.Debug,
	info: q.Information,
	information: q.Information,
	warn: q.Warning,
	warning: q.Warning,
	error: q.Error,
	critical: q.Critical,
	none: q.None
};
function sK(e) {
	let t = oK[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var cK = class {
	configureLogging(e) {
		if (J.isRequired(e, "logging"), lK(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = sK(e);
			this.logger = new SG(t);
		} else this.logger = new SG(e);
		return this;
	}
	withUrl(e, t) {
		return J.isRequired(e, "url"), J.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return J.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new WG(e) : e : new WG(), this;
	}
	withServerTimeout(e) {
		return J.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return J.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new eK(this.url, e);
		return HG.create(t, this.logger || mG.instance, this.protocol || new aK(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function lK(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var uK = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, dK = class {
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
	answered(e) {
		e.fresh === !0 || e.reload === !0 ? this.rearm() : this.markAttached();
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
}, fK = 500;
function pK(e) {
	let { changes: t, ...n } = e;
	return n;
}
function mK() {
	return {};
}
function hK(e) {
	return typeof e == "string" ? e : null;
}
var gK = class {
	windowId;
	connection;
	started = !1;
	gate = new dK();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new QW(t), this.connection = new cK().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(q.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.connection.state === Z.Reconnecting;
	}
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, hK(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, hK(n))));
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
		if (!(this.started || this.connection.state !== Z.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== Z.Disconnected && (await this.connection.stop(), this.started = !1);
	}
	close(e) {
		this.gate.close(e), this.stopAsync().catch((e) => s("stopping the lost connection failed.", e));
	}
	async attachAsync(e) {
		try {
			let t = await this.invokeCoreAsync("AttachAsync", [e]);
			return this.gate.answered(t), t;
		} catch (e) {
			throw this.gate.rearm(), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, pK));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, pK));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, pK));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, mK, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new uK(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
	}
	holdCalls() {
		this.gate.rearm();
	}
	async reportClientStateAsync(e) {
		await this.invokeAsync("ReportClientStateAsync", [e]);
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, mK));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), fK);
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
		if (this.connection.state !== Z.Connected) {
			if (this.connection.state === Z.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, _K = Promise.resolve(), vK = () => {}, yK = UW * 3 / 4, bK = 128, xK = class {
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
		if (this.handed >= this.given) return _K;
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
		for (; this.flight !== null;) await this.flight.catch(vK);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = GW(e.value), i = r === null ? null : JW(r);
		return i?.catch(vK), new Promise((a, o) => {
			let s = CK(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? SK(e) : SK({
				...e,
				value: void 0
			}) + bK;
			this.queue.push({
				field: s,
				sequence: u,
				update: e,
				bytes: d,
				body: r,
				staged: i,
				before: t,
				settles: l,
				suspect: !1
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
		let e = this.takeBatch(), t = this.queue.length === 0 ? this.given : Math.min(...this.queue.map((e) => e.sequence)) - 1, n = [], r = [];
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, wK(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof uK) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= yK);) t += this.queue[e].bytes, e++;
		return this.queue.splice(0, e);
	}
	requeue(e, t) {
		let n = [];
		for (let r of e) {
			if (t.byServerError && r.suspect) {
				for (let e of r.settles) e.reject(t.cause);
				continue;
			}
			let e = this.queue.findIndex((e) => e.field === r.field);
			if (e >= 0) {
				let t = this.queue[e];
				this.queue[e] = {
					...t,
					settles: [...r.settles, ...t.settles]
				};
				continue;
			}
			n.push({
				...r,
				staged: this.restage(r.body),
				suspect: r.suspect || t.byServerError
			});
		}
		n.length !== 0 && (this.queue.unshift(...n), this.given++);
	}
	restage(e) {
		if (e === null) return null;
		let t = this.transport.whenAttached().then(() => JW(e));
		return t.catch(vK), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function SK(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function CK(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function wK(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var TK = "content-fills", EK = "content", DK = "data-ui-root", OK = "--ui-height", kK = "var(--ui-fill-height";
function AK(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(DK)) return;
	let r = e.style.getPropertyValue(OK).trimStart().startsWith(kK);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(fn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var jK = "form-owner", MK = "ui-form-";
function NK(e) {
	return MK + e.replace(/[ \t\n\f\r]/g, "_");
}
function PK(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = NK(t);
	IK(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function FK(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(MK) && IK(e);
	}
}
function IK(e) {
	let t = LK();
	if (t.querySelector(`form[id="${x(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function LK() {
	let e = document.body.querySelector(`[${Ht}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(Ht, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var RK = document;
function zK() {
	try {
		return RK.execCommand("copy");
	} catch {
		return !1;
	}
}
function BK(e) {
	try {
		return typeof RK.execCommand == "function" && RK.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var VK = /* @__PURE__ */ new Map([
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
]), HK = [
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
function UK(e) {
	return $(e, HK);
}
var WK = [
	"small",
	"medium",
	"large"
], GK = ["default", "circle"], KK = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], qK = [
	"start",
	"center",
	"end",
	"justify"
], JK = ["nowrap", "wrap"], YK = /* @__PURE__ */ new Map([
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
	["muted", "--ui-text-muted"],
	["selected", "--ui-color-selected"],
	["focus-ring", "--ui-color-focus-ring"],
	["border", "--ui-color-border"],
	["shadow", "--ui-color-shadow"],
	["overlay", "--ui-color-overlay"],
	["mark", "--ui-color-mark"]
]), XK = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), ZK = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), QK = ["inline", "trailing"], $K = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], eq = [
	"small",
	"medium",
	"large"
], tq = [
	"small",
	"medium",
	"large"
], nq = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], rq = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], iq = [
	"filled",
	"tinted",
	"outline"
], aq = ["light", "dark"], oq = [
	"start",
	"center",
	"end",
	"stretch"
], sq = ["clip", "visible"], cq = [
	"visible",
	"hidden",
	"collapsed"
], lq = [
	"background",
	"raised",
	"tinted",
	"flat"
], uq = ["horizontal", "vertical"], dq = [
	"none",
	"gap",
	"rule"
], fq = [
	"none",
	"one",
	"many"
], pq = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], mq = ["stack", "wrap"], hq = ["end", "start"], gq = [
	"disabled",
	"auto",
	"always"
], _q = [
	"disabled",
	"proximity",
	"mandatory"
], vq = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], yq = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], bq = ["hex", "rgb"], xq = ["field", "swatch"], Sq = [
	"fill",
	"contain",
	"cover",
	"none"
], Cq = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], wq = ["default", "circle"], Tq = ["card", "quiet"], Eq = ["uniform", "vignette"], Dq = ["linear", "circular"], Oq = [
	"none",
	"vertical",
	"horizontal",
	"both"
], kq = [
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
], Aq = [
	"None",
	"Shade",
	"Tint"
], jq = /* @__PURE__ */ new Map();
function Mq(e) {
	return jq.get(e);
}
function Q(e, t, n) {
	return Fq(e, Nq(t, n), (e) => `${t}${$(e, n)}`);
}
function Nq(e, t) {
	return Pq(t.map((t) => `${e}${t}`));
}
function Pq(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function Fq(e, t, n) {
	return jq.set(e, t), [e, n];
}
function Iq(e, t, n) {
	return Pf.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var Lq = new Map([
	Q("colorClass", "ui-color--", HK),
	Fq("themeColorClass", Nq("ui-color--", HK), (e) => bJ(e)),
	Fq("iconClass", m_, (e) => h_(e)),
	["iconUrlCss", (e) => s_(e)],
	["safeUrl", (e) => qg(e)],
	["safeImageSource", (e) => n_(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : kA(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	Q("iconSizeClass", "ui-icon-size--", WK),
	Fq("iconShapeClass", Pq(["ui-icon--circle"]), (e) => $(e, GK) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", KK),
	Fq("textAppearanceClass", Nq("ui-text-type--", KK), (e) => kJ(e, "ui-text-type--")),
	Fq("textDescriptionTypeClass", Nq("ui-text--description-", KK), (e) => kJ(e, "ui-text--description-")),
	Q("textAlignmentClass", "ui-text--align-", qK),
	Q("textWrapClass", "ui-text--", JK),
	Q("buttonAlignmentClass", "ui-button--align-", qK),
	Q("textBadgePlacementHostClass", "ui-text--badge-", QK),
	Q("badgeStyleClass", "ui-badge-style--", rq),
	Q("badgeFillClass", "ui-badge-fill--", iq),
	Fq("badgeColoredClass", Pq(["ui-badge--colored"]), (e) => fJ(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => xJ(e)],
	Q("buttonClass", "ui-button--", nq),
	Q("surfaceStyleClass", "ui-surface--", lq),
	Q("orientationClass", "ui-orientation--", uq),
	Q("groupSeparatorClass", "ui-command-bar--separator-", dq),
	["selectionModeAttribute", (e) => $(e, fq)],
	["selectionBackgroundCss", (e) => fJ(lJ(e, "background"))],
	["selectionForegroundCss", (e) => fJ(lJ(e, "foreground"))],
	["selectionMarkColorCss", (e) => fJ(lJ(e, "markColor"))],
	["selectionMarkCss", (e) => dJ(lJ(e, "mark"))],
	["selectionFontWeightCss", (e) => uJ(lJ(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => fJ(lJ(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", mq),
	Q("dragHandlePlacementClass", "ui-drag-handle--", hq),
	Q("scrollXClass", "ui-scroll-x--", gq),
	Q("scrollYClass", "ui-scroll-y--", gq),
	["hostViewport", (e) => Qq(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", _q),
	Q("inputAppearanceClass", "ui-input--", $K),
	Q("inputSizeClass", "ui-input--", tq),
	Q("buttonSizeClass", "ui-button--", eq),
	Q("buttonGroupSizeClass", "ui-button-group--", eq),
	["textInputTypeAttribute", (e) => $(e, vq)],
	["inputModeAttribute", (e) => $(e, yq)],
	["colorTextFormatAttribute", (e) => $(e, bq)],
	["colorInputVariantAttribute", (e) => $(e, xq)],
	["themeNameCss", (e) => $(e, aq)],
	["alignmentCss", (e) => $(e, oq)],
	["alignmentStretchFallbackCss", (e) => $(e, oq) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, sq)],
	["layoutLengthCss", (e) => $q(e)],
	["thicknessCss", (e) => nJ(e)],
	Fq("borderNoneClass", Pq(["ui-border--none"]), (e) => iJ(e)),
	["radiusCss", (e) => aJ(e)],
	["gridUnitCss", (e) => oJ(e)],
	["pixelsCss", (e) => zJ(e)],
	["gridTemplateCss", (e) => sJ(e)],
	["colorVariantCss", (e) => NJ(e)],
	["themeColorCss", (e) => fJ(e)],
	["themeInkCss", (e) => mJ(e)],
	["roleInkCss", (e) => hJ(e)],
	["themeOnColorCss", (e) => _J(e)],
	["themeColorInlineCss", (e) => pJ(e) ? "" : fJ(e)],
	["themeColorCanonical", (e) => jJ(e)],
	["textAppearanceFontSizeCss", (e) => AJ(e, "size")],
	["textAppearanceFontWeightCss", (e) => AJ(e, "weight")],
	["textAppearanceLineHeightCss", (e) => AJ(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => AJ(e, "letterSpacing")],
	...Iq("responsiveLayoutLength", "Css", (e, t) => $q(Bf(e, t))),
	...Iq("responsiveWidth", "Css", (e, t) => eJ(Bf(e, t), "horizontal")),
	...Iq("responsiveHeight", "Css", (e, t) => eJ(Bf(e, t), "vertical")),
	...Iq("responsiveThickness", "Css", (e, t) => nJ(Bf(e, t))),
	...Iq("responsiveThicknessHorizontal", "Css", (e, t) => rJ(Bf(e, t), "horizontal")),
	...Iq("responsiveThicknessVertical", "Css", (e, t) => rJ(Bf(e, t), "vertical")),
	...Iq("responsiveRadius", "Css", (e, t) => aJ(Bf(e, t))),
	...Iq("responsivePixels", "Css", (e, t) => BJ(Bf(e, t))),
	...Iq("visibility", "Attribute", (e, t) => VJ(e, t)),
	...Iq("gridPlacement", "ColumnCss", (e, t) => cJ(Bf(e, t), "column")),
	...Iq("gridPlacement", "RowCss", (e, t) => cJ(Bf(e, t), "row")),
	...Iq("gridPlacement", "ColumnSpanCss", (e, t) => cJ(Bf(e, t), "columnSpan")),
	...Iq("gridPlacement", "RowSpanCss", (e, t) => cJ(Bf(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", Sq),
	Fq("expanderVariantClass", Pq(["ui-expander--quiet"]), (e) => $(e, Tq) === "quiet" ? "ui-expander--quiet" : ""),
	Fq("imageShapeClass", Pq(["ui-image--circle"]), (e) => $(e, wq) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => Hq(e)],
	["backgroundImageAttribute", (e) => Hq(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, Cq)],
	["backgroundImageDimCss", (e) => Uq(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, Eq) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => qq(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => qq(e) ? "" : void 0],
	["positiveCount", (e) => Wq(e)?.toString()],
	["nonNegativeCount", (e) => Gq(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => Gq(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => Kq(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => Kq(e, (e) => e >= 0)?.toString()],
	["share", (e) => Kq(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => Wq(e) === void 0 ? void 0 : ""],
	Fq("maxLinesClass", Pq(["ui-text--max-lines"]), (e) => Wq(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", Dq),
	["progressValueText", (e) => RJ(e)],
	["textAreaResizeCss", (e) => $(e, Oq)],
	Q("flyoutPlacementClass", "ui-flyout--", kq),
	["popupPlacementAttribute", (e) => $(e, kq)],
	["tabMenuEntriesAttribute", (e) => Bq(e)],
	["markedDaysAttribute", (e) => Vq(e)]
]);
function Rq(e) {
	let t = Lq.get("surfaceStyleClass");
	return lq.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var zq = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function Bq(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = zq.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function Vq(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function Hq(e) {
	return s_(e);
}
function Uq(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function Wq(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function Gq(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function Kq(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function qq(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var Jq = [
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
		13,
		"PulsarMagenta",
		200,
		60,
		160
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
		"NebulaLemon",
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
		23,
		"SolarGold",
		230,
		180,
		30
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
], Yq = new Map(Jq.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), Xq = new Map(Jq.map(([e, t]) => [e, t])), Zq = /* @__PURE__ */ new Map([[sq, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [Cq, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : Zq.get(t)?.get(e)) ?? VK.get(e) ?? gi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function Qq(e) {
	return e == null || $(e, gq) === "disabled" ? void 0 : "parent";
}
function $q(e) {
	if (e == null) return "";
	if (typeof e == "number") return zJ(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? zJ(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function eJ(e, t) {
	if (typeof e != "object" || !e) return $q(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? $q(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function tJ(e) {
	if (typeof e == "number") return {
		top: e,
		right: e,
		bottom: e,
		left: e
	};
	if (typeof e != "object" || !e) return;
	let t = e;
	return {
		top: t.top ?? 0,
		right: t.right ?? 0,
		bottom: t.bottom ?? 0,
		left: t.left ?? 0
	};
}
function nJ(e) {
	if (e == null) return "";
	let t = tJ(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function rJ(e, t) {
	let n = tJ(e);
	return n === void 0 ? "" : zJ(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function iJ(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return Pf.map((t) => Bf(e, t)).filter((e) => e != null).every((e) => iJ(e) !== "") ? "ui-border--none" : "";
	let t = tJ(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function aJ(e) {
	if (e == null) return "";
	if (typeof e == "number") return zJ(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? zJ(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function oJ(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return zJ(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function sJ(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return oJ(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return oJ(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${oJ(e[0])})` : e.map((e) => oJ(e)).join(" ");
}
function cJ(e, t) {
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
function lJ(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function uJ(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function dJ(e) {
	if (e == null) return "";
	switch ($(e, pq)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function fJ(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (MJ(e)) return NJ(e);
	let t = e, n = NJ(t.light), r = NJ(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = YK.get($(o, HK));
	return s ? `var(${s})` : "";
}
function pJ(e) {
	if (typeof e != "object" || !e || MJ(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function mJ(e) {
	if (pJ(e)) {
		let t = XK.get($(e.style, HK));
		if (t !== void 0) return `var(${t})`;
	}
	return fJ(e);
}
function hJ(e) {
	if (typeof e != "object" || !e || MJ(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? mJ(e) : "";
}
var gJ = /* @__PURE__ */ new Set(["background", "surface"]);
function _J(e) {
	if (typeof e != "object" || !e) return "";
	if (MJ(e)) return vJ(e) ? "initial" : yJ(e);
	let t = e, n = yJ(t.light ?? t.dark), r = yJ(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && vJ(t.light ?? t.dark) && vJ(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, HK);
	if (gJ.has(i)) return "initial";
	let a = ZK.get(i);
	return a ? `var(${a})` : "";
}
function vJ(e) {
	return PJ(e)?.[3] === 0;
}
function yJ(e) {
	let t = PJ(e);
	return t === void 0 ? "" : NI(t[0], t[1], t[2], t[3]);
}
function bJ(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, HK)}`;
}
function xJ(e) {
	let t = TJ(e == null ? "" : String(e).trim(), SJ + 1);
	return t > 0 && t <= SJ ? "compact" : "";
}
var SJ = 2, CJ = /[\u0300-\uFFFF]/, wJ = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function TJ(e, t) {
	if (!CJ.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of wJ.segment(e)) {
		if (n >= t) break;
		n += EJ(r) ? 2 : 1;
	}
	return n;
}
function EJ(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < DJ.length; e += 2) if (t >= DJ[e] && t <= DJ[e + 1]) return !0;
	return !1;
}
var DJ = [
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
function OJ(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ue, xJ(n)), e.setAttribute(We, "");
}
function kJ(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${$(r, KK)}`;
}
function AJ(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return zJ(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : zJ(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : zJ(e);
		}
		default: return "";
	}
}
function jJ(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = FJ(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${MI(r.rgb >> 16 & 255)}${MI(r.rgb >> 8 & 255)}${MI(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${MI(e)}`;
	}
	let i = IJ(r.name);
	return i === null ? "" : `${i}/${LJ(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function MJ(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function NJ(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = PJ(e);
	return t === void 0 ? "" : `#${MI(t[0])}${MI(t[1])}${MI(t[2])}${MI(t[3])}`;
}
function PJ(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = IJ(t.name), i = n ?? (r === null ? void 0 : Yq.get(r));
	if (!i) return;
	let a = LJ(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = G(c * (1 - o)), l = G(l * (1 - o)), u = G(u * (1 - o))) : a === "Tint" && (c = G(c + (255 - c) * o), l = G(l + (255 - l) * o), u = G(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function FJ(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = HK[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function IJ(e) {
	if (typeof e == "number") return Xq.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function LJ(e) {
	if (typeof e == "number") return Aq[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function RJ(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function zJ(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function BJ(e) {
	return e == null ? "" : zJ(e);
}
function VJ(e, t) {
	let n = Vf(e, t);
	if (n == null) return;
	let r = $(n, cq);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var HJ = "ui-announcer", UJ = 7e3, WJ = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : T.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), UJ), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${HJ}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = HJ, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, GJ = "ui-notification-host", KJ = "ui-notification", qJ = "ui-notification--leaving", JJ = "ui-notification__message", YJ = "ui-notification__title", XJ = "ui-notification__action", ZJ = "ui-notification__close", QJ = 5e3, $J = 8e3, eY = "ui-notification--connection", tY = "--ui-notification-lift", nY = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), rY = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? QJ, this.ensureHost(), this.announcer = new WJ(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = UK(e.severity), n = document.createElement("div");
		n.className = nY.has(t) ? `${KJ} ${KJ}--${t}` : KJ, n.classList.toggle(eY, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = JJ, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = YJ, T.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : T.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = ZJ, T.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(sY(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || k(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), iY(() => {
			if (n.classList.contains(qJ)) return;
			let t = this.ensureHost();
			aY(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : $J, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
			r || i || (window.clearTimeout(a), a = window.setTimeout(() => this.dismiss(e), n));
		};
		e.addEventListener("mouseenter", () => {
			r = !0, o();
		}), e.addEventListener("mouseleave", () => {
			r = !1, s();
		}), e.addEventListener("focusin", () => {
			i = !0, o();
		}), e.addEventListener("focusout", (t) => {
			t.relatedTarget instanceof Node && e.contains(t.relatedTarget) || (i = !1, s());
		});
	}
	dismiss(e) {
		if (!e.classList.contains(qJ) && (e.classList.add(qJ), e.isConnected)) {
			if (this.returnFocus(e), jf() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => oY(e), L.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(qJ));
		jd(Dd(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${ZJ}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${GJ}`), n = t ?? document.createElement("div");
		return n.classList.add(GJ), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function iY(e) {
	if (Uz(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		Uz(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function aY(e) {
	let t = window.innerHeight - zp(window.innerHeight);
	t > 0 ? e.style.setProperty(tY, `${Math.round(t)}px`) : e.style.removeProperty(tY);
}
function oY(e) {
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
		duration: L.fast,
		easing: L.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function sY(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${XJ} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : T.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		if (t !== null) {
			if (r = !0, n === void 0) {
				t();
				return;
			}
			n.then((e) => {
				e ? t() : r = !1;
			}, (e) => {
				r = !1, s("a notification's action failed.", e);
			});
		}
	}), n;
}
function cY(e, t) {
	let n = lY(e), r = e?.label;
	if (n !== void 0) {
		if (!uo(r) && !fo(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function lY(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function uY(e, t, n) {
	let r = e.itemKey === !0 ? dY(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = fY(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	pY(i, r);
}
function dY(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function fY(e) {
	if (Oc(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Oc(t)) return t;
	return null;
}
function pY(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || E(e) || O(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && BK(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function mY(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : hY(t, e.request?.parameters ?? null);
}
function hY(e, t) {
	let n = gY(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function gY(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, _Y(e));
	return t.toString();
}
function _Y(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function vY(e, t) {
	let n = bY([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return bY(r, t) ?? yY(t);
}
function yY(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && xY(t, e) ? t : null;
}
function bY(e, t) {
	let n = null;
	for (let r of e) if (Lk(r, t)) {
		if (xY(r, t)) return r;
		n ??= r;
	}
	return n;
}
function xY(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var SY = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	runAction;
	valueReaders;
	reportTheme;
	navigate;
	address;
	clientStateChanged;
	windowId;
	followNotificationClick;
	systemNotifications;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.runAction = e.runAction, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.address = e.address, this.clientStateChanged = e.clientStateChanged, this.windowId = e.windowId ?? "", this.followNotificationClick = e.followNotificationClick, this.systemNotifications = e.systemNotifications, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Fi(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Fi(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = mY(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Xg(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = zi(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(yr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = DY(e);
			t !== null && (yV(t), kY(t));
		}), this.register("ScrollTo", (e) => {
			let t = DY(e);
			if (t === null) return;
			let n = e.effect, r = Ii(n.behavior), i = Li(n.block);
			yV(t), t.scrollIntoView({
				behavior: OY(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = DY(e);
			if (t === null) return;
			let n = e.effect, r = aV(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Li(n.block);
			yV(Yc(r)), oV(r, n.key, i === "Unknown" ? "Start" : i, OY(Ii(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = DY(e);
			if (t === null) return;
			let n = e.effect, r = Bi(n.axis) !== "Horizontal", i = vY(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Ri(n.position), u;
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
			let d = OY(Ii(n.behavior));
			yV(i), r && l === "End" && CV(i) && vV(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			EY(DY(e), null);
		}), this.register("Hide", (e) => {
			EY(DY(e), "hidden");
		}), this.register("Collapse", (e) => {
			EY(DY(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = AY(e, this.valueReaders);
			t !== null && jY(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = DY(e);
			t !== null && uY(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = DY(e);
			t !== null && !yg(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Kg(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!uo(t.message) && !fo(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : cY(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			Wz() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!uo(t.message) && !fo(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Vi(t.politeness) === "Assertive" ? "assertive" : "polite");
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
	showSystemNotification(e) {
		let t = e.title;
		if (!uo(t) && !fo(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = uo(e.body) || fo(e.body) ? e.body : void 0, r = typeof e.address == "string" && Xg(e.address) ? e.address : void 0, i = () => {
			if (e.fallback === "None" || this.notifications === void 0) return;
			let i = this.fallbackAction(e, r);
			this.notifications.show(n === void 0 ? {
				message: t,
				action: i
			} : {
				title: t,
				message: n,
				action: i
			});
		};
		if (e.when !== "Always" && Uz(document.visibilityState)) {
			i();
			return;
		}
		let a = lY(e.action);
		Yz({
			title: CY(t),
			body: n === void 0 ? void 0 : CY(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Xg(e.icon) ? e.icon : wY(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? TY(),
			windowId: this.windowId,
			bringTo: r,
			action: a
		}, () => this.followNotificationClick?.({
			bringTo: r,
			action: a
		}), this.systemNotifications).then((e) => {
			e || i();
		});
	}
	fallbackAction(e, t) {
		let n = this.navigate;
		return t !== void 0 && n !== void 0 && Zz(t) ? {
			label: uo(e.addressLabel) || fo(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : cY(e.action, this.runAction);
	}
};
function CY(e) {
	return uo(e) ? T.translate(e.key, e.args) : fo(e) ? T.resolveText(e.text) : "";
}
function wY() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function TY() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function EY(e, t) {
	if (e === null) return;
	let n = tf();
	for (let n of Hr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && nf(n);
}
function DY(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(C(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function OY(e) {
	return e === "Smooth" && !jf() ? "smooth" : "auto";
}
function kY(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Wu))) {
		e.focus();
		return;
	}
	let t = fd(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function AY(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = DY(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Ws(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Rs(t.readHeld(r));
}
async function jY(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!MY(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function MY(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return zK();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var NY = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = fd(t), i = ad() && Oc(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = wd(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), PY(t) && this.swipes.set(e, Nm(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && jd(Dd(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${Kp}]:not([hidden])`)) {
			let t = e.getAttribute(Kp);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${Kp}="${x(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Jp}]`);
		if (n === null) return;
		let r = n.closest(`[${Kp}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Kp);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || k(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || tm(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !um() && !yc(e)) {
				let n = t.getAttribute(Kp);
				n !== null && (e.preventDefault(), this.dismiss(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && _d(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(b)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return $p(this.root);
	}
};
function PY(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var FY = "ui-leave", IY = new M_("data-ui-leave-part"), LY = "560px", RY = null, zY = null;
function BY(e, t) {
	RY ??= VY();
	let n = RY;
	n.isConnected || document.body.append(n), HY(n, "title", T.text("ui.leave.title")), HY(n, "message", T.text("ui.leave.message")), HY(n, "stay", T.text("ui.leave.stay")), HY(n, "leave", T.text("ui.leave.confirm")), zY = {
		dialogs: e,
		leave: t
	}, e.open(FY);
}
function VY() {
	let { dialog: e, surface: t } = j_({
		key: FY,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", LY);
	let n = IY.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = IY.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, IY.actions(IY.button("ui-button--outline", "stay"), IY.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = IY.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = zY;
		zY = null, n?.dialogs.close(FY), t === "leave" && n?.leave();
	}), e;
}
function HY(e, t, n) {
	let r = IY.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var UY = class {
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
	get asks() {
		return !this.released && (this.holds || this.options.pending());
	}
	navigate(e) {
		if (this.deciding || !this.asks) {
			this.leave(e);
			return;
		}
		this.decideAsync(e);
	}
	confirm(e) {
		this.options.confirm(e, () => this.leave(e));
	}
	leave(e) {
		this.options.follow?.(e) !== !0 && (this.release(), this.options.window.location.assign(e));
	}
	release() {
		this.released = !0, this.options.window.removeEventListener("beforeunload", this.beforeUnload);
	}
	rearm() {
		this.released = !1, this.guards && this.options.window.addEventListener("beforeunload", this.beforeUnload);
	}
	handlePress(e) {
		if (this.released) return;
		let t = WY(e, this.options.window.location.href);
		if (t !== null) {
			if (!this.holds && !this.options.pending()) {
				this.options.follow?.(t) === !0 && e.preventDefault();
				return;
			}
			e.preventDefault(), this.decideAsync(t);
		}
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
function WY(e, t) {
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
	return Xg(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var GY = "neEntry", KY = class {
	window;
	revisit;
	switchRuntime;
	load;
	route;
	search;
	entry;
	lastStep = null;
	undoing = !1;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = qY(e.window.history.state) ?? 0, qY(e.window.history.state) === null && e.window.history.replaceState({ [GY]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(hY(this.route, e), !1);
	}
	push(e) {
		let t = hY(this.route, e), n = this.window.location;
		this.write(t, t !== `${n.pathname}${n.search}`);
	}
	enter(e) {
		this.write(e, !0);
	}
	stepBack() {
		let e = this.lastStep;
		if (this.lastStep = null, e !== null) {
			if (e.step !== null && e.step !== 0) {
				this.undoing = !0, this.window.history.go(-e.step);
				return;
			}
			this.write(`${this.route}${e.previous}`, !0);
		}
	}
	write(e, t) {
		t ? (this.entry++, this.window.history.pushState({ [GY]: this.entry }, "", e)) : this.window.history.replaceState({ [GY]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = qY(this.window.history.state), n = t === null ? null : t - this.entry;
		if (this.entry = t ?? this.entry, this.undoing) {
			this.undoing = !1, this.search = e.search;
			return;
		}
		if (e.pathname !== this.route) {
			this.load();
			return;
		}
		if (e.search === this.search) return;
		let r = this.search;
		this.search = e.search, this.lastStep = {
			step: n,
			previous: r
		}, this.switchRuntime(e.search, r) || this.revisit(YY(e.search));
	}
};
function qY(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[GY];
	return typeof t == "number" ? t : null;
}
function JY(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => r.getAll(e).join(",") !== i.getAll(e).join(","));
}
function YY(e) {
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
var XY = class {
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
		!this.state.set(e, t, n, QY(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Wo(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Ye), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, QY(r[0]?.component)) ? {
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
			(typeof n == "string" || fo(n) ? this.addressResolver.isTranslatable(t.reference) : uo(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Je}${gi(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => yi(e, t, () => ZY(e, i)));
	}
	applyOperations(e, t, n) {
		for (let r of e.definition.operations) {
			let i = this.extensions.converters.convert(r.converter, t);
			for (let a of n(r)) this.operations.apply({
				resolved: e,
				operation: r,
				target: a,
				value: t,
				convertedValue: i,
				local: !0
			});
		}
	}
	applyToComponent(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return !1;
		let i = this.shownValue(t, n);
		return this.applyOperations(r, i, (e) => this.addressResolver.resolveOperationTargets(r, e)), this.notifyValueChanged({
			reference: t,
			propertyName: r.propertyName,
			dynamicParameters: [],
			value: i,
			local: !0,
			components: [e]
		}), !0;
	}
	writeBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ye))), r = e.closest(b);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ye)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			qs(e);
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
function ZY(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(b) === e) return [n];
	return [e];
}
function QY(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(b) ?? null, r = e === null ? 0 : w(e), i = n.getAttribute(_);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Yi(e, Ji(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var $Y = "EndValue", eX = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Pd) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = C(e.componentId), r = nX(n, e.propertyId), i = this.watchers.get(r);
		if (i === void 0) {
			i = /* @__PURE__ */ new Set(), this.watchers.set(r, i);
			let t = this.sourcesByComponent.get(n) ?? [];
			t.push(e), this.sourcesByComponent.set(n, t), this.recordShownValue(e);
		}
		return i.add(t), () => {
			i?.delete(t);
		};
	}
	recordShownValue(e) {
		let t = this.edits?.root.querySelector(`[data-ui-id="${C(e.componentId)}"]`) ?? null, n = t === null ? null : tX(e, this.edits?.metadata) ? t.querySelector(`[${Ct}]`) : Ws(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = ra(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Ct);
		for (let e of r) {
			if (t.metadata !== void 0 && tX(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = nX(C(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function tX(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === $Y;
}
function nX(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function rX(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : w(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var iX = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, aX(t));
	}
	apply(e) {
		let t = C(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Mi(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) oX(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) sX(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) cX(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) lX(n, t.key, t.newIndex);
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
function aX(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function oX(e, t) {
	typeof t.key == "string" && (sX(e, t.key), e.splice(uX(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function sX(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function cX(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		oX(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function lX(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(uX(n, e.length), 0, i);
}
function uX(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var dX = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, fX(e, "", t.map((e) => e.split("."))));
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
function fX(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : fX(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function pX(e) {
	let t = new dX();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(C(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var mX = class {
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
}, hX = class {
	transferer;
	waiting = /* @__PURE__ */ new Set();
	constructor(e) {
		this.transferer = e;
	}
	ahead(e, t, n, r) {
		let i = {
			source: e,
			target: t,
			index: r,
			rows: []
		};
		for (let t of n) {
			let n = this.transferer.take(e, t);
			n !== null && i.rows.push({
				key: t,
				taken: n,
				placed: null
			});
		}
		return i.rows.length === 0 ? null : (this.redo(i), this.waiting.add(i), i);
	}
	settle(e) {
		this.waiting.delete(e) && e.source.isConnected && e.target.isConnected && this.undo(e);
	}
	around(e, t) {
		let n = [...this.waiting].filter((t) => t.source === e || t.target === e);
		if (n.length === 0) {
			t();
			return;
		}
		for (let e = n.length - 1; e >= 0; e--) this.undo(n[e]);
		t();
		for (let e of n) {
			if (e.rows.splice(0, e.rows.length, ...e.rows.filter((t) => this.transferer.holds(e.source, t.key) && !this.transferer.holds(e.target, t.key))), e.rows.length === 0) {
				this.waiting.delete(e);
				continue;
			}
			for (let t of e.rows) {
				let n = this.transferer.take(e.source, t.key);
				n !== null && (t.taken = n);
			}
			this.redo(e);
		}
	}
	redo(e) {
		e.rows.forEach((t, n) => {
			t.placed = this.transferer.place(e.target, t.key, this.transferer.itemOf(t.taken.element), e.index + n);
		});
	}
	undo(e) {
		for (let t = e.rows.length - 1; t >= 0; t--) {
			let n = e.rows[t];
			n.placed !== null && (this.transferer.remove(e.target, n.placed), n.placed = null), this.transferer.restore(e.source, n.taken);
		}
	}
};
//#endregion
//#region src/updates/collection-refill.ts
function gX(e, t) {
	let n = _X(e[t], "Reset");
	if (n === null) return null;
	let r = C(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = _X(e[s], "Insert");
		if (t === null || C(t.component?.id) !== r || !Zd(i, t.component?.dynamicParameters ?? [])) break;
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
function _X(e, t) {
	if (e === void 0 || Pi(e) !== "CollectionChange") return null;
	let n = e;
	return Mi(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var vX = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function yX(e, t, n, r) {
	return {
		action: Mi(e.action),
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
var bX = [], xX = class {
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
	held = new iX();
	projections;
	moves = new mX({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new hX({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => DX(V(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = pX(e), this.projections.isEmpty || fC((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${v}]`)) {
			let e = ra(n);
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
			return n === void 0 && (n = OX(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = ia(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Pi(t) !== "CollectionChange") continue;
			let e = t;
			if (Mi(e.action) !== "Insert") continue;
			let r = C(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, EX(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of rX(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = ra(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = ra(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		BR(e, t, {
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
		let n = u() ? performance.now() : -1, r = tf();
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = gX(t, e);
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
		r !== null && nf(r), n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(it) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, bX, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (B(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = OX(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Zd(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Ru(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = B(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Ru(n) : null;
			n.remove(), zu(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), TX(e, i), o !== null && zu(e, o.row, o.held), c) for (let t of i) Bu(e, t);
		this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (Pi(e)) {
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
		let t = C(e.address?.component?.id), n = Ni(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (C(e.address?.component?.id) <= 0) {
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
		let t = C(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, yX(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Mi(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Mi(e.action) === "Move" ? CX(e.moves ?? []) : bX;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (B(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Mi(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				SX(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				wX(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), KC(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = ra(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = B(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : BC(e, V(e)).findIndex((e) => e.getAttribute(_) === t);
		return n < 0 ? null : n + GS(e);
	}
	moveRow(e, t, n) {
		let r = ra(e);
		if (r === null) return;
		let i = Math.max(0, n - GS(e));
		B(e) === "virtualized" ? this.virtualization.move(e, t, i) : wX(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = V(e), r = DX(n, t);
		if (r === null) return null;
		let i = BC(e, n), a = i.indexOf(r);
		return UC(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = BC(e, V(e));
		xw(t.element), e.insertBefore(t.element, HC(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = ra(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, HC(BC(e, V(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		UC(BC(e, V(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Mi(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Mi(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) {
			let e = aV(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = BC(e, V(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, HC(i, o, a.index ?? null)), Bu(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		return ZU(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = V(e), a = BC(e, i), o = OX(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Ru(c);
					GC(a, c, l), c.replaceWith(l), zu(e, l, t);
				} else e.insertBefore(l, HC(a, l, i.index ?? null));
			}
		}
	}
};
function SX(e, t) {
	let n = V(e), r = BC(e, n), i = OX(e, n), a = Lu(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Pu(a, o, n) : null;
		i.delete(t), UC(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function CX(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function wX(e, t) {
	let n = V(e), r = BC(e, n), i = OX(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = WC(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function TX(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? V(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function EX(e) {
	let t = w(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : w(n);
}
function DX(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function OX(e, t = V(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(_);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function kX(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return uo(n) || fo(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: jX(t.severity)
	} : void 0;
}
function AX(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = T.resolve(uo(t) || fo(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function jX(e) {
	let t = ki(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var MX = "ui-validation--warning", NX = "ui-validation--info", PX = "ui-validation-message--marker", FX = "top-end", IX = "right", LX = "--ui-validation-marker-host", RX = "ui-validation-mark", zX = "--ui-validation-presentation", BX = "--ui-validation-color", VX = "Validation", HX = /* @__PURE__ */ new Set(["Value", "EndValue"]), UX = /* @__PURE__ */ new Set(["Min", "Max"]), WX = `input:not([type='hidden']), textarea, select, .${ti}[role='combobox'], [role='spinbutton']`, GX = {
	Error: 0,
	Warning: 1,
	Info: 2
}, KX = {
	Error: pi,
	Warning: MX,
	Info: NX
}, qX = `.${pi}, .${MX}, .${NX}`, JX = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, YX = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, XX = {
	Error: `${RX}--error`,
	Warning: `${RX}--warning`,
	Info: `${RX}--info`
}, ZX = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, QX = class {
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
			e.target instanceof Element && (this.refusesBounds(e.target), this.applyEventTrigger(e, "Change"));
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(qX)), R(this.root, qX, { childList: !0 }, (e) => this.applyRenderedMessages(e)), T.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(qX)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), T.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(qX)) {
			let t = w(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? this.readRuleValue(i);
		if (o.length > 0) {
			this.touchedElements.add(i), this.evaluateAndApply(r, i, o, s);
			return;
		}
		a && this.applyCurrentState(r, i);
	}
	forgetJudgement(e) {
		let t = this.failingRulesByElement.delete(e), n = this.refusalByElement.delete(e), r = this.boundRefusalByElement.has(e);
		return this.forgetBoundRefusal(e), t || n || r;
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			rZ(t, tZ(t) === "Error");
			let e = t.querySelector(`:scope > [${mi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), iZ(this.markerMirrors, t, e, {
				message: n,
				severity: tZ(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(w(e), e) !== void 0)) return;
		let n = Bo(t), r = tZ(e);
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
		if (e.propertyName === VX) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = HX.has(e.propertyName), n = UX.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(w(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(w(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = C(e.reference.componentId), n = kX(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = C(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Oi(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = C(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = uo(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: jX(e.severity),
			content: e.content === !0,
			property: Ni(e.address?.property)
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
		let n = O(t) || E(t) ? null : $X(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return eZ(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Ws(e);
		return t === null ? null : this.readValue(t);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(w(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: ZX[t]
		}), this.applyCurrentState(w(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(w(e))) if (jX(r.severity) === "Error" && _f(t, r.operator, r.value) && !_f(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !_f(t, r.operator, r.value) && (n === null || GX[jX(r.severity)] < GX[jX(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: YX[jX(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, this.readRuleValue(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		nZ(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${C(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(AX).join("\n"), !0);
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
			severity: jX(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || GX[e.severity] < GX[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Oi(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Oi(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Vt}="${x(e)}"]`)) {
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			e !== null && (yield {
				field: t,
				component: e
			});
		}
	}
	discardForm(e) {
		for (let { component: { componentId: t, element: n } } of this.formFields(e)) this.forgetJudgement(n), this.touchedElements.delete(n), this.applyCurrentState(t, n);
	}
	focusFirstInvalid(e) {
		for (let { component: t } of this.formFields(e)) {
			if (!t.element.classList.contains("ui-invalid")) continue;
			let e = [...t.element.querySelectorAll(WX)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: jf() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && jX(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) _f(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function $X(e, t) {
	return RS(e, t) ?? (e.matches(nT) ? XT(e) : null);
}
function eZ(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : uo(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function tZ(e) {
	return e.classList.contains(MX) ? "Warning" : e.classList.contains(NX) ? "Info" : "Error";
}
function nZ(e, t, n) {
	for (let e of Object.values(KX)) t.classList.toggle(e, n !== void 0 && KX[n.severity] === e);
	rZ(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(BX) : r.style.setProperty(BX, `var(--ui-color-${JX[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Ro(i, null), i.textContent = String(n.message ?? "")) : T.writeValue(i, null, n?.message ?? null), iZ(e, r, i, n));
}
function rZ(e, t) {
	for (let n of e.querySelectorAll(WX)) {
		let r = n.closest(ei);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function iZ(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(zX).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(PX, o), aZ(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(LX).trim()), r !== void 0 && o) {
		n.setAttribute(Re, n.textContent ?? ""), n.setAttribute(ze, FX), n.setAttribute(Ve, YX[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? uM(n) : dM(n);
		return;
	}
	n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), dM(n);
}
function aZ(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : sZ(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && oZ(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${RX} ${XX[n.severity]}`, s.textContent = r, s.setAttribute(Re, r), s.setAttribute(ze, IX), s.setAttribute(Ve, YX[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (oZ(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), dM(s);
}
function oZ(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${RX}`) === null && t.removeAttribute(Be);
}
function sZ(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var cZ = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, lZ = "card-header-shown", uZ = `[${oi}], [${si}], [${ci}], [${li}], [${ui}]`;
function dZ(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(uZ);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(di, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var fZ = "menu-surface";
function pZ(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = Rq(e);
	n === null ? t.removeAttribute(Qt) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(Qt, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var mZ = "tooltip-name";
function hZ(e, t, n) {
	let r = kA(e.getAttribute(Re));
	if (Ro(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var gZ = /* @__PURE__ */ new WeakMap(), _Z = /* @__PURE__ */ new WeakMap(), vZ = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ai(e), t);
	}
	apply(e) {
		let t = Ai(e.operation.kind), n = this.handlers.get(t);
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
			let t = Rs(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Ro(e.target, null);
		}), this.register("Markup", (e) => {
			jA(e.target, zs(e.convertedValue) ? "" : Rs(e.convertedValue)), Ro(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = EZ(e.operation);
			if (Ro(e.target, t), e.operation.convertsNull !== !0 && zs(e.value) || zs(e.convertedValue)) {
				TZ(e.target, t);
				return;
			}
			wZ(e.target, t, Rs(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = EZ(e.operation);
			Ro(e.target, t), TZ(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = EZ(e.operation), n = e.operation.condition ?? "HasValue", r = !zs(e.value) && yZ(e.value, n), i = e.operation.value ?? (zs(e.convertedValue) || bZ(n) ? "" : Rs(e.convertedValue));
			xZ(e.target, CZ(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !zs(e.value) && yZ(e.value, e.operation.condition ?? "None") ? Rs(e.convertedValue).trim() : "";
			SZ(e.target, CZ(e), t, Mq(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = EZ(e.operation), n = !zs(e.value) && yZ(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Rs(e.convertedValue).trim() : "";
				SZ(e.target, CZ(e), t, Mq(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = EZ(e.operation), n = e.target;
			if (zs(e.value) || zs(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Rs(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(mZ, (e) => hZ(e.resolved.component, e.target, EZ(e.operation))), this.register(jK, (e) => PK(e.target, e.value)), this.register(lZ, (e) => dZ(e.resolved.component)), this.register(Go, (e) => Ko(e.target)), this.register(TK, (e) => AK(e.target)), this.register(CO, (e) => TO(e.target)), this.register(OO, (e) => jO(e.resolved.component)), this.register(fZ, (e) => pZ(e.target)), this.register("Property", (e) => {
			let t = EZ(e.operation), n = e.target, r = zs(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function yZ(e, t) {
	switch (ji(t)) {
		case "None": return !0;
		case "HasValue": return !zs(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !zs(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return h_(e).length > 0;
		default: return !zs(e);
	}
}
function bZ(e) {
	let t = ji(e);
	return t === "IsTrue" || t === "IsFalse";
}
function xZ(e, t, n, r, i) {
	let a = _Z.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), _Z.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), wZ(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && TZ(e, n);
}
function SZ(e, t, n, r) {
	let i = gZ.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), gZ.set(e, i));
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
function CZ(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function wZ(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function TZ(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function EZ(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var DZ = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Lq.has(e.name),
			convert: (e) => Lq.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = OZ(e.name), n = {
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
function OZ(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var kZ = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Hi(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Hi(e.domEventName) || t;
		this.definitions.set(t, {
			name: t,
			domEventName: n,
			attach: e.attach ?? ((e) => e.root.addEventListener(n, e.dispatch, {
				capture: !0,
				...e.options
			}))
		});
	}
	registerNative(e, t = e) {
		this.register({
			name: e,
			domEventName: t
		});
	}
	get(e) {
		return this.definitions.get(Hi(e));
	}
};
function AZ(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function jZ(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Mu, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => AZ(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => AZ(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var MZ = class {
	converters = new DZ();
	events = new kZ();
	operations = new vZ();
	valueReaders;
	collectionSinks = new vX();
	rowDecorators = new cZ();
	constructor(e, t, n, r) {
		jZ(this.events), this.valueReaders = new Vs(r);
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
}, NZ = "Submenu", PZ = "ui-menu__submenu", FZ = "Select", IZ = ["Header", "Separator"], LZ = {
	kind: "menu",
	decorate: RZ
};
function RZ(e) {
	if (IZ.includes(BZ(e.item, "Kind")) && e.row.setAttribute(Xt, ""), !zZ(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, NZ);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Gt, ""), BZ(e.item, "Kind") === FZ && e.row.setAttribute(Kt, ""), BZ(e.item, "Expanded") === !0 && e.row.setAttribute(qt, "");
	let r = document.createElement("div");
	r.className = PZ, r.appendChild(n), dU(r, e.key, e.item), e.row.appendChild(r);
}
function zZ(e) {
	let t = BZ(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function BZ(e, t) {
	let n = yC(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var VZ = {
	kind: "grip",
	decorate: HZ
};
function HZ(e) {
	e.row.append(UZ());
}
function UZ() {
	let e = document.createElement("span");
	return e.className = ye, e.setAttribute("role", "button"), T.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function WZ(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(KZ(n));
	for (let t of e.querySelectorAll(`[${st}]`)) GZ(t, ot, r), GZ(t, dt, i);
}
function GZ(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function KZ(e) {
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
var qZ = 2;
function JZ(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= qZ && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function YZ(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var XZ = "ne.standard.ui.windowId", ZZ = [
	500,
	1e3,
	2e3
], QZ = 3, $Z = [
	["refusal", ({ root: e }) => NH(e)],
	["file input", ({ root: e, validation: t }) => new Dg({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Mv({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Jv({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new yy({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new iy({ root: e })],
	["image fallback", ({ root: e }) => new Dy({ root: e })],
	["radio group sync", ({ root: e }) => new By({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Yb({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Zy({ root: e })],
	["debounced commit", ({ root: e }) => new fy({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new cx({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => dx() ? void 0 : new fx({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new oz({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new zx({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new cL({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new XE({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new SD({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new BD({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new zB({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new nV({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new vk({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new yF({ root: e })],
	["toggle button", ({ root: e }) => new ty({ root: e })],
	["button group", ({ root: e }) => new TF({ root: e })],
	["menu", ({ root: e }) => new bM({ root: e })],
	["action bar", ({ root: e, dom: t }) => new eA({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new uP({ root: e })],
	["menu group", ({ root: e }) => new qO({ root: e })],
	["menu search", ({ root: e }) => new jN({ root: e })],
	["side drawer", ({ root: e }) => new XN({ root: e })],
	["screen keyboard", () => new VN()],
	["grid splitter", ({ root: e }) => new wP({ root: e })],
	["pane container", ({ root: e }) => new YP({ root: e })],
	["accordion", ({ root: e }) => new kF({ root: e })],
	["tabs", ({ root: e }) => new eI({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new _B({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new mI({ root: e })],
	["breadcrumbs", ({ root: e }) => new OI({ root: e })],
	["scroll anchor", ({ root: e }) => new bV({ root: e })],
	["surface press", ({ root: e }) => new kL({ root: e })],
	["text selection", ({ root: e }) => new DV({ root: e })],
	["scroll group", ({ root: e }) => new PV({ root: e })],
	["flyout interaction", ({ root: e }) => new Nh({ root: e })],
	["text fold", ({ root: e }) => new AB({ root: e })],
	["tooltip", ({ root: e }) => Sj(e)]
], eQ = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new xi(xW());
	hydration = TW();
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
	address;
	clientState;
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	connection;
	heldRuntime = null;
	pageId = this.hydration?.pageId ?? null;
	runtimeSearch = window.location.search;
	inertContent = null;
	settleValues;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = oQ(e.windowIdStorageKey ?? XZ), this.dom = new na(this.root), T.load(this.root), T.setLanguage(document.documentElement.lang), e.strings !== void 0 && T.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : T.loadTableAsync(this.hydration.words.href)), this.extensions = new MZ(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(LZ), this.extensions.registerRowDecorator(VZ), this.extensions.registerRowDecorator(Ny);
		let t = new qi(this.dom, this.metadata), n = this.extensions.operations, r = new eG(), i = new XY(t, n, this.extensions, r);
		this.reactiveSources = new eX(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new NY({
			root: this.root,
			dom: this.dom
		}), this.notifications = new rY({
			root: this.root,
			dom: this.dom
		}), this.address = new KY({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => window.location.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => Xz(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = MW(document.documentElement, this.windowId, o);
		this.effects = new SY({
			address: this.address,
			dialogs: this.dialogs,
			notifications: this.notifications,
			runAction: a,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e),
			clientStateChanged: () => this.clientState.changed(),
			windowId: this.windowId,
			followNotificationClick: o,
			systemNotifications: Jz(u)
		});
		let d = new Tf(this.metadata), f, p = new df(d, i, new gf(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(C(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new _W(this.dom), h = new sU(this.metadata, m, this.extensions, n, r);
		this.virtualization = new tW({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new xX(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks), T.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), T.onMomentTick(this.rewriteMoments), new vU({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new gK(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new qz({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new YW(this.transport), T.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(bi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(bi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				yW(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && yW(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let ee = new xK(this.transport);
		f = new zd({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: ee,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => g.refusesBounds(e)
		}), i.setHeldTargets((e) => f?.isHeld(e) === !0), this.settleValues = async () => {
			uy(), await ee.whenAnsweredAsync();
		}, this.effects.register(bi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				g.discardForm(t);
			}
		}), this.leaveGuard = new UY({
			window,
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => BY(this.dialogs, t),
			pending: () => ly() || ee.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(bi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Xg(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let g = new QX({
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
			validation: g,
			dialogs: this.dialogs,
			heldRows: this.virtualization
		};
		for (let [e, t] of $Z) JZ(e, t, this.engineContext);
		JZ("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new IS({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), JZ("tree", ({ root: e, effects: t }) => new Fz({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), JZ("items reorder", ({ root: e }) => new sw({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), JZ("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new XV({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", w(e)) || p.hasEventForComponent("click", w(e))
		}) : void 0, this.engineContext), JZ("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new lH() : void 0, this.engineContext), this.eventPipeline = new qd({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: p,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: g,
			valueBinding: f
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(pB.name, pB.registration);
		let te = (e) => this.updateProcessor.resortHost(e), ne = iw({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: te
		});
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let re = hB(te);
		this.eventPipeline.addEvent(re.name, re.registration);
		let ie = Bw(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, ie);
		this.eventPipeline.addEvent(_y.name, _y.registration), JZ("shortcuts", ({ root: e, dom: t }) => new jM({
			root: e,
			viewShortcuts: MM(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), JZ("item drag", ({ root: e, dom: t }) => new Uw({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new uR({ root: this.root }), this.windows = new PU({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), JZ("pager", ({ root: e, dom: t }) => new mN({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: T,
			observeComponents: R,
			observeSize: hP,
			store: new xO(),
			numbers: hS,
			temporal: Ua,
			icons: { apply: f_ },
			badges: { writeCount: OJ },
			urls: {
				isImageSource: e_,
				asBrowserReads: $g,
				isSafeLink: Kg,
				isExternalLink: Yg
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => f?.hold(e),
				release: (e) => {
					f?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t),
				whenSettled: async (e) => {
					let t = this.dom.resolveNearestComponent(e, () => !0)?.element ?? e;
					await f?.whenSettled(t);
				}
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(b), a = r === null ? void 0 : this.metadata.getExposedProperty(w(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: lM,
			renames: { open: dc },
			tables: this.tables,
			rows: oU(m, h, this.virtualization),
			uploads: gg(g),
			selection: Il,
			popups: ZH(this.dom),
			roving: Gc,
			typeAhead: DD,
			focus: pd,
			states: as,
			validation: g,
			wheel: R_,
			colors: aU,
			shortcuts: jc,
			names: hi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			let { changes: n, ...r } = e;
			$W(() => this.applyChanges(n, void 0, t), () => {
				!this.holdsRuntime(t) || this.dispatcher.settle(r) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new VW({
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
		let t = Ws(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.readBound(t);
	}
	revisitRuntime(e, t) {
		if (!this.switchesTo(window.location.pathname, e, t)) return !1;
		if (this.leaveGuard.asks) {
			let t = `${window.location.pathname}${e}${window.location.hash}`;
			return this.address.stepBack(), this.leaveGuard.navigate(t), !0;
		}
		return this.switchRuntimeAsync(), !0;
	}
	followInPlace(e) {
		let t;
		try {
			t = new URL(e, window.location.href);
		} catch {
			return !1;
		}
		return t.origin !== window.location.origin || !this.switchesTo(t.pathname, t.search, window.location.search) ? !1 : (this.address.enter(`${t.pathname}${t.search}${t.hash}`), this.switchRuntimeAsync(), !0);
	}
	switchesTo(e, t, n) {
		let r = this.hydration?.identity ?? [];
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && cQ() === null && JY(t, n, r);
	}
	async switchRuntimeAsync() {
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = nQ();
		e !== null && !e.hasAttribute("inert") && (e.setAttribute("inert", ""), this.inertContent = e), await this.attachAsync();
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
		if (e === T.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		T.setRequested(e);
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
			if (n !== this.languageSwitches || i === T.language || !await T.switchToAsync(i, r)) return;
			T.notifyChanged();
		} finally {
			n === this.languageSwitches && T.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), T.language !== this.culturesLanguage && (this.culturesLanguage = T.language, Uo(this.root, (e) => WZ(e, T.number, T.temporal)));
		let i = n ? ho : void 0;
		T.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(T.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		T.language.length > 0 && document.documentElement.lang !== T.language && (document.documentElement.lang = T.language), d(n ? "page's moments written again" : "page's words written again", r, { language: T.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Uo(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = C(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ae}="${x(n)}"]`)) Zi(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Zi(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: T.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: T.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = IW(e, navigator.cookieEnabled, RW());
		if (t === "no-cookie") {
			this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`));
			return;
		}
		if (t === "asked-again") {
			this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`));
			return;
		}
		s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	reloadForFreshRuntime(e) {
		if (IW(e, navigator.cookieEnabled, RW()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		te(this, this.options.handlerGlobalKey), FK(this.root), await aQ();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Lo(this.root) || wW(this.hydration) || this.metadata.getWords().some((e) => ho(e.key)) || ho(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) JZ(YZ(t), t, this.pluginContext);
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
		T.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		JZ(YZ(e), e, this.pluginContext);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !KW(e)) {
			t?.(), this.holdsRuntime(n) && this.applyNow(e);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.holdsRuntime(n) && this.applyNow(await qW(e, r));
		}).catch((e) => {
			c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = i, i.then(() => {
			this.inbound === i && (this.inbound = null);
		}), i;
	}
	holdsRuntime(e) {
		return e == null || this.heldRuntime === null || e === this.heldRuntime;
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
			if (e >= QZ) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await DW(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, ZZ, iQ), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			LW(RW()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = nQ();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && rQ(o), this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.windows.start(), d("runtime attached", r, {
				windowId: this.windowId,
				instanceId: this.instanceId,
				answered: f(a - r),
				updates: i.initialChanges?.updates?.length ?? 0
			}), !0;
		} finally {
			n.release();
		}
	}
	createAttachRequest(e) {
		let t = cQ(), n = t === null && this.heldRuntime !== null && JY(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? YY(e) : t.parameters,
			timeZone: OW(),
			clientState: this.clientState.forAttach(),
			switchRuntime: n
		};
		return this.renderSequence = null, r;
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
			this.applyNow(KW(e) ? await qW(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
};
async function tQ(e = {}) {
	let t = performance.now(), n = new eQ(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function nQ() {
	return document.querySelector(`[${pn}="${EK}"]`);
}
function rQ(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) CV(t) && B(t) !== "windowed" ? (vV(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function iQ(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function aQ() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function oQ(e) {
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
	let n = sQ();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function sQ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function cQ() {
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
g(), tQ().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
