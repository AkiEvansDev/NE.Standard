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
var g = 4;
function _() {
	return ee();
}
function v(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ee();
	n.runtime = e, te(e, n);
}
function ee() {
	let e = window.NEStandardUI ?? {}, t = e.__pending ?? [], n = (e, n = !1) => {
		let r = window.NEStandardUI?.runtime;
		r === void 0 ? t.push({
			apply: e,
			engine: n
		}) : e(r);
	}, r = {
		...e,
		contractVersion: g,
		__pending: t,
		registerEvent(e, t = {}) {
			n((n) => n.addEvent(e, t));
		},
		registerConverter(e, t) {
			let r = re(e, t);
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
function te(e, t) {
	let n = t.__pending ?? [];
	t.__pending = [];
	for (let t of n) t.engine || ne(t, e);
	for (let t of n) t.engine && ne(t, e);
}
function ne(e, t) {
	try {
		e.apply(t);
	} catch (e) {
		c("a package registration failed.", e);
	}
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
var y = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", b = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-later", Te = "data-ui-context-menu-template", Ee = "data-ui-context-menu-use", De = "data-ui-action-bar", Oe = "data-ui-action-bar-key", ke = "data-ui-action-bar-rest", Ae = "data-ui-menu-left-out", je = "data-ui-in-action-bar", Me = "ui-action-bar", Ne = "data-ui-row-focus", Pe = "data-ui-row-cursor-waits", Fe = "data-ui-tab-out", Ie = "data-ui-cell-focus", Le = "ui-cell-key", Re = "data-ui-tooltip", ze = "data-ui-tooltip-placement", Be = "data-ui-tooltip-mark", Ve = "data-ui-tooltip-severity", He = "data-ui-tooltip-press", Ue = "data-ui-badge-text", We = "data-ui-badge-set", Ge = "data-ui-badge-icon", Ke = "data-ui-folds", qe = "data-ui-name", Je = "data-ui-bind-", Ye = "data-ui-into-", Xe = "data-ui-bind-value", Ze = (e) => `data-ui-no-${e}`, Qe = "data-ui-event-boundary", $e = "data-ui-image-caption", et = "data-ui-image-crop", tt = "data-ui-image-crop-size", nt = "ui-image", rt = "ui-image__picture", it = "ui-image--circle", at = "data-ui-fallback-src", ot = "data-ui-fallback-icon", st = "data-ui-image-failed", ct = "data-ui-icon-failed", x = "data-ui-items-host", lt = "data-ui-collection-sink", ut = "data-ui-items-query", dt = "data-ui-first-visible-key", ft = "data-ui-last-visible-key", pt = "data-ui-number-culture", mt = "data-ui-page-culture", ht = "data-ui-pager-target", gt = "data-ui-pager-page", _t = "data-ui-pager-size", vt = "data-ui-temporal-culture", yt = "data-ui-temporal", bt = "data-ui-awaits-draw", xt = "ui-timestamp", St = "ui-timestamp__text", Ct = "data-ui-timestamp-format", wt = "ui-file-tile", Tt = "ui-file-tile__glyph", Et = "ui-file-tile__name", Dt = "ui-file-tile__size", Ot = "data-ui-file-name", kt = "data-ui-file-type", At = "data-ui-file-size", jt = "data-ui-file-icon", Mt = "data-ui-empty-template", Nt = "data-ui-group-template", Pt = "data-ui-empty-placeholder", Ft = "data-ui-group-header", It = "data-ui-group-anchor", Lt = "data-ui-group", Rt = "data-ui-value-holder", zt = "data-ui-value-end", Bt = "data-ui-value-kind", Vt = "items-query", Ht = "first-visible-key", Ut = "last-visible-key", Wt = "data-ui-host-mode", Gt = "data-ui-host-viewport", Kt = "data-ui-scroll-group", qt = "data-ui-scroll-lines", Jt = "data-ui-source-line", Yt = "data-ui-window-spacer", Xt = "data-ui-window-pending", Zt = "data-ui-window-paged", Qt = "data-ui-window-size", $t = "data-ui-window-offset", en = "data-ui-window-total", tn = "data-ui-window-more-before", nn = "data-ui-window-more-after", rn = "data-ui-window-group-before", an = "data-ui-window-aggregates", on = "data-ui-form-id", sn = "data-ui-forms", cn = "data-ui-visibility", ln = "data-ui-collapsed", un = "data-ui-menu-group", dn = "data-ui-menu-select", fn = "data-ui-menu-open", pn = "data-ui-menu-holds-current", mn = "data-ui-menu-icons", hn = "data-ui-menu-passive", gn = "data-ui-menu-item-shortcut", _n = "data-ui-menu-surface", vn = "data-ui-menu-search", yn = "data-ui-menu-searching", bn = "data-ui-menu-unmatched", xn = "data-ui-drawer-toggle", Sn = "data-ui-drawer-open", Cn = "data-ui-drawer-switch", wn = "data-ui-drawer-switch-row", Tn = "data-ui-side-drawers", En = "data-ui-drawer-pin";
function Dn(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var On = "data-ui-bottom-bar", kn = "data-ui-rail-drawer", An = "data-ui-content-fills", jn = "data-ui-region", Mn = "data-ui-menu-item-kind", Nn = "ui-menu", S = "ui-menu-item", Pn = "ui-menu-item--checked", Fn = "ui-menu-item--selected", In = "ui-menu--rail", Ln = "ui-menu--nested", Rn = `[${Mn}="header"], [${Mn}="separator"]`, zn = `[${un}] > .${S}`, Bn = `.${S}:not(${Rn})`;
`${zn}${S}${Mn}`;
var Vn = "data-ui-shortcut", Hn = "data-ui-collapse-toggle", Un = "data-ui-folding", Wn = "data-ui-column-limits", Gn = "data-ui-row-limits", Kn = "data-ui-splitter-step", qn = "data-ui-splitter-position", Jn = "data-ui-pane-layout", Yn = "data-ui-pane", Xn = "data-ui-pane-columns", Zn = "data-ui-pane-rows", Qn = "data-ui-table-column", $n = "data-ui-table-hide-below", er = "data-ui-table-starts-hidden", tr = "data-ui-table-hidden", nr = "ui-table__row", rr = "ui-table__scroll", ir = "ui-table__header", ar = "ui-table__resizer", or = "ui-tree", sr = "ui-tree__row", cr = "ui-tree-node", lr = "data-ui-tree-drop", ur = "ui-tree__row--filtered", dr = "data-ui-table-last", fr = "data-ui-table-reordering", pr = "data-ui-table-dragging", mr = "data-ui-table-drop", hr = "data-ui-table-scrolled", gr = "data-ui-table-scrollbar", _r = "data-ui-no-row-select", vr = "data-ui-tree-parent", yr = "data-ui-tree-children", br = "data-ui-tree-folder", xr = "data-ui-tree-expanded", Sr = "data-ui-tree-title", Cr = "data-ui-tree-loading", wr = "data-ui-tree-drop-target", Tr = "data-ui-tree-boot", Er = "data-ui-tree-draggable", Dr = "data-ui-row-editing", Or = "data-ui-boxed-editor", kr = "data-ui-row-idle", Ar = "data-ui-step-collapsed", jr = "data-ui-step-end", Mr = "data-ui-row-bar", Nr = "data-ui-image-source", Pr = "data-ui-file-max-size", Fr = "data-ui-file-pick", Ir = "data-ui-file-drop-target-id", Lr = "data-ui-press-ripple", Rr = "data-ui-service-worker", zr = "data-ui-theme", Br = "data-ui-theme-colors", Vr = "data-ui-words", Hr = "data-ui-language-switcher", Ur = "data-ui-theme-switcher", Wr = "data-ui-theme-choice", Gr = "field", Kr = "data-ui-language", qr = "data-ui-splitting", Jr = "data-ui-keyboard-up", Yr = "data-ui-connection", Xr = "data-ui-pending", Zr = "data-ui-split-folded", Qr = "data-ui-split-edge", $r = "data-ui-pointer-focus", ei = "data-ui-focus-within", ti = "data-ui-popup-hover", ni = "data-ui-inner-pointer", ri = "data-ui-selection", ii = "data-ui-selected", ai = "data-ui-selected-key", oi = "data-ui-selected-keys", si = "data-ui-bind-selected-key", ci = "data-ui-tabs-selected", li = "data-ui-tab-caption", ui = "data-ui-tab-key", di = "data-ui-tab-page", fi = "data-ui-tab-actions", pi = "data-ui-tab-pinned", mi = [
	cn,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], hi = "data-ui-submit-form-id", C = `[${y}]`, gi = "data-ui-href", _i = "ui-disabled", vi = "ui-loading", yi = "ui-readonly", bi = "ui-hidden", xi = "ui-dialog__surface", Si = "ui-flyout__content", Ci = `.ui-context-menu, .ui-split-button__menu, .${Si}`, wi = "data-ui-focus-holder", Ti = "data-ui-owns-keys", Ei = "[role='listbox'], [role='menu'], [role='dialog']", Di = "ui-select__trigger", Oi = `.${Di}`, ki = "ui-button", Ai = `${ki} ui-button--ghost ui-button--small`, ji = "ui-select", Mi = "data-ui-text-title", Ni = "data-ui-text-description", Pi = "data-ui-plain-text", Fi = "data-ui-text-icon", Ii = "data-ui-text-badge-icon", Li = "data-ui-text-badge-text", Ri = "ui-card__header--empty", zi = "ui-text-input", Bi = "ui-invalid", Vi = "data-ui-validation-message", Hi = {
	componentId: y,
	key: b,
	selected: ii,
	selectedKey: ai,
	selectedKeys: oi,
	unselectable: oe,
	rowFocus: Ne,
	cellFocus: Ie,
	cellKey: Le,
	itemsHost: x,
	valueHolder: Rt,
	bindValue: Xe,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: Qe,
	focusHolder: wi,
	ownsKeys: Ti,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: Se,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: _i,
	loadingClass: vi,
	readOnlyClass: yi,
	hiddenClass: bi,
	buttonClass: ki,
	selectClass: ji,
	textInputClass: zi,
	invalidClass: Bi,
	validationMessage: Vi,
	sourceLine: Jt,
	textDescription: Ni,
	popupSelector: Ei,
	listTriggerSelector: Oi,
	tableRowClass: nr,
	tableScrollClass: rr,
	tableHeaderClass: ir,
	tableResizerClass: ar,
	tableHidden: tr,
	hostMode: Wt,
	windowOffset: $t,
	windowTotal: en,
	windowSize: Qt,
	windowMoreAfter: nn,
	windowAggregates: an,
	itemsQuery: ut,
	valueKind: Bt,
	itemsQueryKind: Vt,
	menuItemClass: S,
	menuItemKind: Mn,
	menuItemCheckedClass: Pn
};
function Ui(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Wi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Gi = 0;
function Ki(e, t) {
	return e.id.length === 0 && (Gi++, e.id = `${t}-${Gi}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function qi(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest("[data-ui-id]") === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Ji = {
	Navigate: "Navigate",
	NavigateBack: "NavigateBack",
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
	ShowSystemNotification: "ShowSystemNotification",
	ShowImage: "ShowImage"
}, Yi = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(w(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${w(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(w(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (w(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(ba(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(ba(e, ya(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(xa(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(va(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(va(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Sa(e, t))?.items ?? [];
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
		let t = w(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = w(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(ba(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(ba(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = va(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(xa(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = w(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = w(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = w(e.componentId);
		t > 0 && this.itemValuesByAddress.set(Sa(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = w(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function Xi(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Zi(e) {
	return Xi(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Qi(e) {
	return e == null ? "OneWay" : Xi(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function $i(e) {
	return Xi(e, ["Property", "Event"]);
}
function ea(e) {
	return e == null ? "SetProperty" : Xi(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function ta(e) {
	return Xi(e, [
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
function na(e) {
	return Xi(e, ["Ascending", "Descending"]);
}
function ra(e) {
	return Xi(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ia(e) {
	return Xi(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function aa(e) {
	return typeof e == "string" ? e : Xi(e, [
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
function oa(e) {
	return Xi(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function sa(e) {
	return Xi(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function w(e) {
	return e ?? 0;
}
function ca(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function la(e) {
	return typeof e == "string" ? e : "";
}
function ua(e) {
	return Xi(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function da(e) {
	return typeof e == "string" ? e.trim() : "";
}
function fa(e) {
	return Xi(e, ["Auto", "Smooth"]);
}
function pa(e) {
	return Xi(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ma(e) {
	return Xi(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function ha(e) {
	return Xi(e, ["Light", "Dark"]);
}
function ga(e) {
	return Xi(e, ["Horizontal", "Vertical"]);
}
function _a(e) {
	return Xi(e, ["Polite", "Assertive"]);
}
function va(e) {
	return e?.trim().toLowerCase() ?? "";
}
function ya(e) {
	return e?.trim() ?? "";
}
function ba(e, t) {
	return `${e}:${ya(t)}`;
}
function xa(e, t) {
	return `${e}:${va(t)}`;
}
function Sa(e, t) {
	return `${e}:${ca(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Ca = class {
	dom;
	metadata;
	bindingSelectors = /* @__PURE__ */ new Map();
	intoSelectors = /* @__PURE__ */ new Map();
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
		return this.dom.findAllComponents(w(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = w(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = w(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? this.bindingSelector(a, r.propertyName) : null;
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
	bindingSelector(e, t) {
		let n = this.bindingSelectors.get(e);
		return n === void 0 && (n = `[${Je}${Wi(t)}="${Ui(e)}"]`, this.bindingSelectors.set(e, n)), n;
	}
	resolvePropertyOn(e, t) {
		let n = w(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return qi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ye}${Wi(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function wa(e) {
	return Oa(e, ae);
}
function Ta(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Aa(r);
		if (e !== void 0) {
			let t = r.closest(ka);
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
function Ea(e, t) {
	let n = wa(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Ta(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Da(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Aa(r);
		if (e !== void 0) {
			let a = r.closest(ka);
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
function Oa(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var ka = `[${x}]`;
function Aa(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var ja = `[${Ft}]`, Ma = 64, Na = 256;
function Pa(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Fa = class {
	root;
	componentsById = /* @__PURE__ */ new Map();
	staticComponentsById = /* @__PURE__ */ new Map();
	keyedComponentsById = /* @__PURE__ */ new Map();
	indexed = /* @__PURE__ */ new Set();
	changedScopes = /* @__PURE__ */ new Set();
	unsettledIds = /* @__PURE__ */ new Set();
	patchedSincePrune = 0;
	prunedSize = 0;
	stale = !1;
	constructor(e) {
		this.root = e, this.rebuild();
	}
	invalidate(e) {
		this.stale || (e === void 0 || this.changedScopes.size >= Ma ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(C), t = this.root.querySelector(ja) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest(ja) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Ra(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Ki(e, t);
	}
	findComponentParts(e, t, n) {
		return Pa(this.findAllComponents(e, t), n);
	}
	findEveryComponent(e) {
		return e <= 0 ? [] : (this.sync(), [...this.liveComponents(e)]);
	}
	findAllComponents(e, t) {
		if (e <= 0) return [];
		if (this.sync(), t.length === 0) {
			let t = this.staticComponentsById.get(e);
			if (t !== void 0 && this.holds(t) && !this.unsettledIds.has(e)) return [t];
			let n = this.liveComponents(e), r = this.staticComponentsById.get(e);
			return r === void 0 ? [...n] : [r];
		}
		let n = this.keyedComponents(e).get(ca(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && Ea(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => Ea(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Na) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(ja) !== null) return;
		let t = e.querySelector(ja) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(C)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = T(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(ja) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Ra(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
	}
	prune() {
		for (let [e, t] of this.componentsById) this.settle(e, t);
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	liveComponents(e) {
		let t = this.componentsById.get(e);
		return t === void 0 ? [] : (this.settle(e, t), t);
	}
	settle(e, t) {
		let n = 0;
		for (let e = 0; e < t.length; e++) {
			let r = t[e];
			this.holds(r) ? t[n++] = r : this.indexed.delete(r);
		}
		let r = n < t.length, i = this.unsettledIds.delete(e);
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Va(t) && t.sort(Ba), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Ra(n)) {
			this.staticComponentsById.set(e, n);
			return;
		}
		this.staticComponentsById.delete(e);
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.liveComponents(e)) {
			let e = wa(n);
			if (e === 0) continue;
			let r = Ta(n, e);
			if (r.length !== e) continue;
			let i = ca(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return Ha(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(C);
			if (e === null || !Ha(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Ta(e, wa(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return Oa(e, y);
}
function Ia(e) {
	let t = e.closest(C), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function La(e) {
	let t = e.closest(C), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Ta(t, wa(t))
	};
}
function Ra(e) {
	return wa(e) === 0;
}
function za(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Ba(e, t) {
	return e === t ? 0 : za(e, t) ? -1 : 1;
}
function Va(e) {
	for (let t = 1; t < e.length; t++) if (!za(e[t - 1], e[t])) return !1;
	return !0;
}
function Ha(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ua = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Wa(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ua.includes(t.slice(0, n).toLowerCase());
}
function Ga(e) {
	return Wa(e) ? String(e) : void 0;
}
var Ka = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function qa(e) {
	let t = Za(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Ka.some((e) => n.startsWith(e));
}
function Ja(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Ya(e);
}
function Ya(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Xa(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Za(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Qa(e) {
	return $a(e) !== null;
}
function $a(e) {
	let t = Za(e), n = t.toLowerCase();
	return Ya(t) || Xa(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function eo(e) {
	return $a(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var to = "mask:", no = "ui-icon--image", ro = "ui-icon--mask";
function io(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(to) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? $a(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function ao(e) {
	let t = io(e);
	return t === null ? "" : oo(t.source);
}
function oo(e) {
	let t = "";
	for (let n of e) {
		let e = n.codePointAt(0) ?? 0;
		if (e < 32 || e === 127 || n === " ") t += "%20";
		else switch (n) {
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
var so = "ui-icon", co = "data-ui-icon", lo = "--ui-icon-url";
function uo(e, t) {
	e.classList.add(so);
	for (let t of Array.from(e.classList)) po(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(lo);
	let n = mo(t);
	if (n.length === 0) {
		e.removeAttribute(co);
		return;
	}
	e.setAttribute(co, ""), e.classList.add(n);
	let r = io(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(lo, oo(r.source));
}
var fo = "ui-icon-glyph--";
function po(e) {
	return e === no || e === ro || e.startsWith(fo);
}
function mo(e) {
	let t = io(e);
	return t === null ? ho(e) : t.tinted ? ro : no;
}
function ho(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = fo;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var go = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, _o = "\\", vo = "`", yo = "!", bo = "{", xo = "}", So = "ui-text__fold", Co = "ui-text__fold-toggle", wo = "ui-text__fold-content", To = 8;
function Eo(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Ro(new qo(e), 0, e.length, go.None, null, t, n), zo(t, n, go.None, null), t;
}
function Do(e) {
	return Eo(e).map((e) => Mo(e) ? `${e.fold} ${Do(e.text)}` : e.text).join("");
}
function Oo(e) {
	let t = "";
	for (let n of e) t += Xo(n) ? _o + n : n;
	return t;
}
function ko(e, t, n = {}) {
	let r = Eo(t), i = r.some(Mo);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ke, i), r.length === 0 ? e.textContent = "" : r.length === 1 && Ao(r[0]) ? e.textContent = r[0].text : e.replaceChildren(No(r, n));
}
function Ao(e) {
	return e.styles === go.None && e.url === null && !jo(e) && !Mo(e);
}
function jo(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Mo(e) {
	return e.fold !== null && e.fold !== void 0;
}
function No(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Po(r, t));
	return n;
}
function Po(e, t) {
	if (jo(e)) return Io(e.icon);
	let n = Mo(e) ? Fo(e, t) : document.createTextNode(e.text);
	if ((e.styles & go.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & go.Strikethrough) !== 0 && (n = Lo("s", n)), (e.styles & go.Underline) !== 0 && (n = Lo("u", n)), (e.styles & go.Italic) !== 0 && (n = Lo("em", n)), (e.styles & go.Bold) !== 0 && (n = Lo("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", qa(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Fo(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${So} ${So}--static` : So, r.className = Co, r.textContent = e.fold ?? "", i.className = wo, i.append(No(Eo(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Qe, ""), n.append(r, i), n);
}
function Io(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", uo(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Lo(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Ro(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === _o && c + 1 < n && Xo(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Bo(e, c, n);
		if (l !== null) {
			zo(a, o, r, i), Vo(s, c + 1, l, o), zo(a, o, r | go.Code, i), c = l + 1;
			continue;
		}
		let u = Wo(e, c, n);
		if (u !== null) {
			zo(a, o, r, i), Ro(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), zo(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Ho(e, c, n);
		if (d !== null) {
			zo(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Go(e, c, n) : null;
		if (f !== null) {
			zo(a, o, r, i), Ro(e, f.labelStart, f.labelEnd, r, f.url, a, o), zo(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Ko(e, c, n);
		p === null ? (o.value += t, c++) : (zo(a, o, r, i), a.push({
			text: s.slice(p.contentStart, p.contentEnd),
			styles: r,
			url: i,
			fold: p.caption
		}), c = p.contentEnd + 1);
	}
}
function zo(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Bo(e, t, n) {
	let r = e.text;
	if (r[t] !== vo) return null;
	let i = t + 1;
	if (i >= n || Zo(r[i])) return null;
	let a = e.findClosingMarker(i, n, vo, 1);
	return a > i ? a : null;
}
function Vo(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === _o && i + 1 < n && Xo(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function Ho(e, t, n) {
	let r = e.text;
	if (r[t] !== yo || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Uo(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Uo(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Wo(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = go.Bold, s = 2;
	else if (i === "*") o = go.Italic, s = 1;
	else if (i === "_" && a) o = go.Underline, s = 2;
	else if (i === "~" && a) o = go.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Zo(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Go(e, t, n) {
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
function Ko(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== bo || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > To) return null;
	let c = { value: "" };
	return Vo(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var qo = class {
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
		return this.closeBrackets ??= this.next("]", !0), Jo(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Jo(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Jo(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Jo(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Yo(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Zo(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Wa(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === _o && e[t - 1] === 0);
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
			if (this.text[r] === bo) n.push(r);
			else if (this.text[r] === xo && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Zo(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Jo(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Yo(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Xo(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === bo || e === xo || e === vo || e === _o;
}
function Zo(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/runtime/plural-rules.ts
function Qo(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = $o(n);
	switch (es(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : ts(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : ts(r, i) ? "many" : "other";
		case "ru":
		case "uk": return ns(r, i);
		case "pl": return rs(r, i);
		default: return "other";
	}
}
function $o(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function es(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function ts(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function ns(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function rs(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function is(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var as = {
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
function os(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return as;
	try {
		return {
			...as,
			...JSON.parse(t)
		};
	} catch {
		return as;
	}
}
var ss = [
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
function cs(e, t, n) {
	if (t == null || t.trim().length === 0) return `${hs(e.getFullYear(), 4)}-${hs(e.getMonth() + 1, 2)}-${hs(e.getDate(), 2)} ${hs(e.getHours(), 2)}:${hs(e.getMinutes(), 2)}:${hs(e.getSeconds(), 2)}`;
	let r = "", i = ls(t);
	for (let a = 0; a < t.length;) {
		let o = ps(t, a);
		o === null ? (r += t[a], a++) : (r += ms(o, e, n, i), a += o.length);
	}
	return r;
}
function ls(e) {
	for (let t = 0; t < e.length;) {
		let n = ps(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var us = /^[-./:,]$/, ds = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function fs(e) {
	for (let t = 0; t < e.length;) {
		let n = ps(e, t);
		if (n !== null && ds.has(n) || n === null && !us.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function ps(e, t) {
	for (let n of ss) if (e.startsWith(n, t)) return n;
	return null;
}
function ms(e, t, n, r) {
	let i = t.getHours(), a = Ps(i);
	switch (e) {
		case "yyyy": return hs(t.getFullYear(), 4);
		case "yy": return hs(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return hs(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return hs(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return hs(i, 2);
		case "H": return String(i);
		case "hh": return hs(a, 2);
		case "h": return String(a);
		case "mm": return hs(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return hs(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function hs(e, t) {
	return String(e).padStart(t, "0");
}
var gs = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function _s(e) {
	let t = gs.exec(e.trim());
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
function vs(e) {
	return ys(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function ys(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var bs = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function xs(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = ps(e, r);
		i === null ? (n += e[r], r++) : (n += Ss(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function Ss(e, t) {
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
function Cs(e, t, n) {
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
		let a = ps(t, e);
		if (a === null) {
			if (!ws(r, i, t[e])) return null;
			e++;
		} else {
			if (!Ts(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? Ms(i) : null;
}
function ws(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return us.test(n) ? t.position >= e.length || !us.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Ts(e, t, n, r) {
	switch (n) {
		case "yyyy": return Es(t, "year", ks(e, t, 4, 4));
		case "yy": return Es(t, "year", Ds(ks(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Es(t, "month", Os(As(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Es(t, "month", ks(e, t, 1, 2));
		case "dddd":
		case "ddd": return As(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Es(t, "day", ks(e, t, 1, 2));
		case "HH":
		case "H": return Es(t, "hour", ks(e, t, 1, 2));
		case "hh":
		case "h": return Es(t, "hour12", ks(e, t, 1, 2));
		case "mm":
		case "m": return Es(t, "minute", ks(e, t, 1, 2));
		case "ss":
		case "s": return Es(t, "second", ks(e, t, 1, 2));
		case "tt": return js(e, t, r);
		default: return !1;
	}
}
function Es(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Ds(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Os(e) {
	return e === null ? null : e + 1;
}
function ks(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function As(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function js(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ms(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > ys(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Ns = {
	readCulture: os,
	format: cs,
	parse: _s,
	toDate: vs
};
function Ps(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Fs = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Is = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ls(e) {
	let t = e?.trim() ?? "";
	if (!Is.test(t)) return null;
	let n = Date.parse(Fs.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Rs(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function zs(e) {
	return e === "relative" || e === "relative-date";
}
var Bs = {
	...as,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Vs(e, t, n, r) {
	if (t === "relative") return Qs(e - r, n.language);
	if (t === "relative-date") {
		let t = Us(e, r);
		if (t !== null) return Ks(n.language).format(t, "day");
	}
	let i = n.temporal ?? Bs, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : is(i, !1);
	return cs(new Date(e), a, i);
}
function Hs(e, t, n, r) {
	let i = Vs(e, t, n, r);
	return t === "relative-date" ? Ws(i, n.language) : i;
}
function Us(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Zs);
	return Math.abs(i) <= 1 ? i : null;
}
function Ws(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(qs(t)) + e.slice(1);
}
var Gs = /* @__PURE__ */ new Map();
function Ks(e) {
	let t = Gs.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(qs(e), { numeric: "auto" }), Gs.set(e, t)), t;
}
function qs(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Js = 1e3, Ys = 60 * Js, Xs = 60 * Ys, Zs = 24 * Xs;
function Qs(e, t) {
	let n = Ks(t), r = Math.abs(e);
	return r < 45 * Js ? n.format(0, "second") : r < 45 * Ys ? n.format(Math.round(e / Ys), "minute") : r < 22 * Xs ? n.format(Math.round(e / Xs), "hour") : r < 26 * Zs ? n.format(Math.round(e / Zs), "day") : r < 320 * Zs ? n.format(Math.round(e / (30.4375 * Zs)), "month") : n.format(Math.round(e / (365.25 * Zs)), "year");
}
//#endregion
//#region src/runtime/words.ts
var $s = "count";
function E(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ec(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var tc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function nc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Ls(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && tc.has(t.format));
}
function rc(e) {
	if (typeof e != "object" || !e) return !1;
	if (nc(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (rc(t)) return !0;
	return !1;
}
function ic(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function ac(e, t, n) {
	return E(e) ? cc(n, e.key, e.args) : ec(e) ? oc(n, e.text) : t && typeof e == "string" ? oc(n, e) : e;
}
function oc(e, t) {
	return t.trim().length === 0 || !sc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function sc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function cc(e, t, n, r = !1) {
	let i = n?.[$s];
	return lc(typeof i == "number" ? e.lookup(`${t}.${Qo(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ec(t) ? oc(e, t.text) : cc(e, t.key, t.args, r), e.writeMoment, r);
}
function lc(e, t, n, r = ic, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = uc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += fc(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function uc(e, t) {
	let n = t + 1;
	for (; n < e.length && dc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function dc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function fc(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? Oo(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (E(e)) return t === void 0 ? lc(e.key, e.args, void 0, n, r) : t(e);
	if (ec(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? Oo(n) : n;
	}
	return nc(e) ? n(Ls(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var pc = `script[type='application/json'][${yt}]`;
function mc(e) {
	let t = e.querySelector(pc)?.textContent?.trim() ?? "";
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
var hc = 15e3, gc = /* @__PURE__ */ new Set(), _c = null;
function vc(e) {
	gc.add(e), _c === null && (_c = setInterval(yc, hc));
}
function yc() {
	for (let e of [...gc]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || gc.delete(e);
	}
	gc.size === 0 && _c !== null && (clearInterval(_c), _c = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var bc = 256, xc = 512, Sc = "script[type='application/json'][data-ui-strings]", Cc = `[${Vr}*='"moment"']`, wc = class {
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
		this.tableLoaded || (this.currentTemporal = mc(e) ?? this.currentTemporal);
		let t = e.querySelector(Sc)?.textContent?.trim() ?? "";
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
	format(e, t, n = !1) {
		return this.lookup(e) === void 0 && this.text(e), cc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return cc(this, e, t, n);
	}
	writeMoment = (e, t) => (zs(t) && this.noteRelative(), Vs(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && vc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return ac(e, t, this);
	}
	resolveText(e) {
		return ac(e, !0, this);
	}
	write(e, t, n, r) {
		Mc(e, t, this.translate(n, r, jc(t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Mc(e, t, ac(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (E(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ec(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (Mc(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		Dc(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Nc(e, (e) => {
			for (let n of e.querySelectorAll(t ? Cc : `[${Vr}]`)) for (let [e, r] of Object.entries(Ac(n))) {
				if (t && !rc(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, jc(i));
				a !== null && Mc(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return ac(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > xc || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && sc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += bc) try {
			let a = await e(t, n.slice(r, r + bc));
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
function Tc(e) {
	let t = !1;
	return Nc(e, (e) => {
		t ||= e.querySelector(Cc) !== null;
	}), t;
}
function Ec(e, t) {
	e.hasAttribute("data-ui-words") && Dc(e, t, null);
}
function Dc(e, t, n) {
	let r = Ac(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Vr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Vr, a);
}
function Oc(e) {
	return kc(e, null);
}
function kc(e, t) {
	let n = Ac(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function Ac(e) {
	let t = e.getAttribute(Vr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function jc(e) {
	return e === Re;
}
function Mc(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Nc(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Nc(n.content, t);
}
var D = new wc();
function Pc(e, t) {
	let n = ec(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Fc = "row-idle";
function Ic(e) {
	let t = e.parentElement;
	t !== null && (Bc(t) ? Lc(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Bc(t.parentElement) && Lc(t.parentElement));
}
function Lc(e) {
	let t = Rc(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(kr, t);
}
function Rc(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if (zc(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && zc(e)) return !0;
	return !1;
}
function zc(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Bc(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Vc = `.${_i}, .${vi}, [inert]`;
function Hc(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var Uc = Hc(Vc), Wc = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Vc) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Vc) || e.querySelector(Uc) !== null;
}
function Gc(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Wc.get(t);
	return n === void 0 && (n = Hc(`[${t}]`), Wc.set(t, n)), e.querySelector(n) !== null;
}
function Kc(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var qc = `[${y}], .${yi}`;
function A(e) {
	return e.closest(qc)?.matches(`.${yi}`) === !0;
}
function Jc(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(_i, t), Ic(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Yc = {
	isInert: O,
	isReadOnly: A,
	setDisabled: Jc
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Xc(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function Zc(e) {
	let t = [];
	for (let n of el(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Zc(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Qc(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Qc(e) {
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
	if (n !== null) return $c({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return $c(r[3] === "fr" ? {
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
function $c(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function el(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function tl(e, t = "auto") {
	return e.map((e) => nl(e, t)).join(" ");
}
function nl(e, t) {
	switch (e.kind) {
		case "px": return `${rl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${rl(e.min)}px`}, ${rl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${rl(e.max)}px)` : `minmax(${rl(e.min)}px, auto)`;
	}
}
function rl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function il(e) {
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
function al(e, t) {
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
function ol(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = sl(r, e), o = sl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function sl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var cl = {
	sliver: 120,
	passFloors: !1
};
function ll(e, t, n, r, i = cl) {
	let a = fl(e, t, n.before), o = fl(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = dl(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = _l(n.before, e) + _l(n.after, e), r = a.total + o.total;
		pl(d, e, a, t * (a.total + u) / r), pl(d, e, o, t * (o.total - u) / r);
	} else f || ml(d, a, a.total + u), p || ml(d, o, o.total - u);
	return i.passFloors && (ul(d, a, a.total + u), ul(d, o, o.total - u)), d;
}
function ul(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function dl(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function fl(e, t, n) {
	let r = gl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function pl(e, t, n, r) {
	let i = _l(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function ml(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...hl(e[i])
		};
	}
}
function hl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function gl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function _l(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function vl(e, t) {
	return Math.round(yl(e, t) * 100);
}
function yl(e, t) {
	let n = gl(t.before, e), r = n + gl(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function bl(e, t, n) {
	let r = gl(t.before, e);
	return (r + gl(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function xl(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function Sl(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Cl = /* @__PURE__ */ new Set();
function wl(e, t, n, r) {
	let i = fl(e, t, n.before), a = fl(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Tl(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = fl(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function El(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Dl(e, t, n, r = Cl) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Ol(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function kl(e) {
	return e == null;
}
var Al = "data-ui-trim-input", jl = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Fl) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Bt);
		if (t === null) return Ml(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Al) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Pl(e);
		return t === null ? null : this.read(t);
	}
};
function Ml(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Nl = "input, textarea, select";
function Pl(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Nl) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Nl}`);
}
var Fl = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => xl(e.getAttribute(qn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(Jn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(ci)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(li)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(pi)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Sr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(ai)
	},
	{
		kind: "selected-keys",
		read: (e) => Il(e, oi)
	},
	{
		kind: Vt,
		read: (e) => Il(e, ut)
	},
	{
		kind: Ht,
		read: (e) => e.getAttribute(dt)
	},
	{
		kind: Ut,
		read: (e) => e.getAttribute(ft)
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
function Il(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Ll(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
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
		default: o = eu(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function zl(e, t, n = Jl()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Bl(e, t = Jl()) {
	let n = Wl(e.code, t);
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
function Vl(e, t = Jl()) {
	let n = Hl(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function Hl(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Ul[e] ?? e;
}
var Ul = {
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
	Backquote: "`"
};
function Wl(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Kl[e] : void 0) ?? Gl[e] ?? e;
}
var Gl = {
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
}, Kl = {
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
}, ql = null;
function Jl() {
	return ql === null && (ql = Yl()), ql;
}
function Yl() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Xl = {
	words(e) {
		let t = Rl(e);
		return t === null ? null : Bl(t);
	},
	aria(e) {
		let t = Rl(e);
		return t === null ? null : Vl(t);
	},
	matches(e, t) {
		let n = Rl(t);
		return n !== null && zl(n, e);
	},
	isComposing: j
}, Zl = 229;
function j(e) {
	return e.isComposing || e.keyCode === Zl;
}
function M(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !j(e);
}
var Ql = class {
	held = null;
	hold(e) {
		this.held = e;
	}
	release(e, t = () => !0) {
		if (!(e instanceof KeyboardEvent) || e.key !== " " || this.held === null) return;
		let n = this.held;
		this.held = null, e.target === n && t(n) && (e.preventDefault(), n.click());
	}
};
function $l(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function eu(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : tu[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : tu[t] ?? null;
}
var tu = {
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
}, nu = "data-ui-rename-field";
function ru(e) {
	return e instanceof Element && e.closest(`[${nu}]`) !== null;
}
function iu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(nu, ""), r.setAttribute(Qe, ""), r.value = e.value, au(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!j(e)) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function au(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = ou(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = su((r.left - i.left) / s - n.clientLeft), e.style.top = su((r.top - i.top) / s - n.clientTop), e.style.width = su(r.width / s), e.style.height = su(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function ou(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function su(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var cu = "data-ui-runs-on-escape", lu = "ui-key-value-action__row", uu = "ui-key-value-action__value-input", du = "ui-key-value-action__edit-action";
function fu(e) {
	return j(e) || pu(e.target) !== null;
}
function pu(e) {
	return e instanceof Element ? ru(e) || mu(e) ? e : e.closest("[data-ui-owns-keys]") ?? hu(e)?.cell ?? null : null;
}
function mu(e) {
	return e instanceof Element && e.hasAttribute(cu) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
}
function hu(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${uu}, .${du}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var gu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), _u = /* @__PURE__ */ new Set([
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
]), vu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), yu = /^F\d{1,2}$/;
function bu(e) {
	return e instanceof HTMLInputElement && gu.has(e.type);
}
function xu(e) {
	return bu(e) || e instanceof HTMLTextAreaElement;
}
function Su(e) {
	return xu(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Cu(e) {
	let t = e.target;
	if (!Su(t)) return !1;
	if (j(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || yu.test(n) || e.altKey ? !1 : n === "Enter" ? !bu(t) : e.ctrlKey || e.metaKey ? _u.has(n) || vu.has(e.code) : !0;
}
var wu = {
	...Xl,
	isFieldKey: Cu,
	isPlainKey: M,
	isEscapeClaimed: fu
}, Tu = "ui-draft-dropped";
function Eu(e) {
	e.dispatchEvent(new Event(Tu, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Du = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Di}, .ui-field-box`, Ou = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", ku = `${Ou}, ${Du}, ${Ei}, .${_e}`, Au = "button, a, summary, [role='button']";
function ju(e) {
	let t = [];
	for (let n of e.querySelectorAll(ku)) if (!(n.classList.contains("ui-row__grip") || !Pu(e, n) || Nu(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Au) ? n : null;
}
function Mu(e) {
	let t = [];
	for (let n of e.querySelectorAll(Ou)) Nu(e, n) && Pu(e, n) && t.push(n);
	return t;
}
function Nu(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function Pu(e, t) {
	let n = t.closest(Ei);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Fu(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ku);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Iu(e) {
	let t = Bu(e.key), n = Vu(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(P);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Lu(e, t) {
	return Bu(e) !== null || Vu(e, t) !== 0;
}
var Ru = {
	target: Iu,
	applyTabIndex: N
};
function N(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function zu(e, t) {
	t !== null && (N(e, t), t.focus());
}
function P(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function Bu(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Vu(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Hu(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Uu(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${Gt}]`) : null;
}
function Wu(e) {
	let t = Hu(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Ku(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Gu(e, t) {
	let n = Hu(e);
	n.scrollTop = n === e ? t : t + Ku(e, n);
}
function Ku(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function qu(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Ju(e) {
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
function Yu(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Xu(e, t) {
	return t !== null && e.length >= t;
}
function Zu(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Xu(e, n) ? null : [...e, t];
}
function Qu(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var $u = /[,\uFF0C\r\n]/;
function ed(e) {
	return $u.test(e);
}
function td(e) {
	return e.split($u).map((e) => e.trim()).filter((e) => e.length > 0);
}
function nd(e) {
	let t = e.split($u), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function rd(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Xu(a, n) ? r : i(a, t);
		c === null ? a = t : (o.push(e.text), s ??= c);
	}
	return {
		keys: a,
		refused: o,
		reason: s
	};
}
//#endregion
//#region src/interactions/own-descendants.ts
function id(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function ad(e) {
	return id(e, Bn, `.${Nn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function od(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function sd(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var cd = "data-ui-bind-selected-keys", F = `.ui-items-view, .ui-table, .${or}`, ld = `.ui-items-view__item, .${nr}, .${sr}`, ud = ".ui-items-view, .ui-table", dd = {
	shift: !1,
	ctrl: !1
}, fd = /* @__PURE__ */ new WeakMap();
function pd(e, t) {
	t !== null && !fd.has(e) && md(e, t);
}
function md(e, t) {
	let n = L(t);
	n.length > 0 && fd.set(e, n);
}
function hd(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function gd(e, t) {
	let n = hd(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function _d(e) {
	return !e.hasAttribute(_r);
}
function I(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function vd(e) {
	switch (e.getAttribute(ri)) {
		case "one": {
			let t = e.getAttribute(ai);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Dd(Od(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function yd(e, t) {
	let n = vd(e), r = e.getAttribute(ri), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(L(e));
		e.toggleAttribute(ii, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function bd(e) {
	return e.filter((e) => e.hasAttribute(ii));
}
function xd(e, t, n, r, i) {
	let a = L(n);
	if (!wd(n)) return !1;
	switch (e.getAttribute(ri)) {
		case "one": return od(e, a, {
			attribute: ai,
			bindingAttribute: si,
			apply: (e) => yd(e, t)
		}), !0;
		case "many": return Sd(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function Sd(e, t, n, r, i, a) {
	let o = Od(e);
	if (o === null) return;
	let s = Dd(o), c;
	if (i.shift) {
		let o = fd.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => L(e) === o) ?? n, d = l === null ? Ed(t, u, n).map(L) : Td(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], fd.set(e, r)) : (c = [r], fd.set(e, r));
	Cd(e, t, c);
}
function Cd(e, t, n) {
	let r = Od(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(oi, i), yd(e, t), r.hasAttribute(cd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function wd(e) {
	return L(e).length > 0 && !Gc(e, "data-ui-unselectable") && !k(e);
}
function Td(e, t) {
	let n = new Map(t.map((e) => [L(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || I(t) !== null && wd(t);
	});
}
function Ed(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => I(e) !== null && wd(e));
}
function Dd(e) {
	return Ju(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Od(e) {
	let t = e.closest(C);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(F) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function L(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var kd = {
	isSelected: (e) => e.hasAttribute(ii),
	toggle: Ad,
	setSelected: jd,
	setSelectedKeys: Md
};
function Ad(e) {
	let t = e.closest(F);
	t !== null && e instanceof HTMLElement && xd(t, Nd(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function jd(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(L(e));
	Md(e, r, n);
}
function Md(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Nd(e), i = new Set(r.filter((e) => !wd(e)).map(L)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...vd(e)].filter((e) => !a.has(e));
	Cd(e, r, n ? [...o, ...a] : o);
}
function Nd(e) {
	return id(e, ld, F);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Pd = "--ui-table-order-";
function Fd(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Id = "ui-table", Ld = `[${Qn}]:not(.${ar})`, Rd = `.${nr} > [aria-colspan]:not([${Qn}])`;
function zd(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Bd(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Ld}${o}, ${Rd}${o}`)) {
		if (t.closest(`.${Id}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Bd(t, "aria-colindex", "1"), Bd(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Qn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Bd(t, "aria-colindex", n);
	}
}
function Bd(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var Vd = ".ui-table[role='grid']", Hd = "gridcell", Ud = "aria-colspan", Wd = /* @__PURE__ */ new WeakMap();
function Gd(e) {
	let t = e.closest(F);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(ld);
	return n !== null && n.closest(F) === t ? {
		root: t,
		row: n
	} : null;
}
function Kd(e) {
	return e.target instanceof Element && !Cu(e) ? qd(e.target) : null;
}
function qd(e) {
	let t = Gd(e);
	if (t === null || t.row !== null && Fu(e, t.row) !== null) return null;
	let n = e.closest(`[${Ti}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Jd(e) {
	return e.filter(Yd);
}
function Yd(e) {
	return I(e) !== null && !k(e);
}
function Xd(e) {
	return Zd(e) ?? Jd(e)[0] ?? null;
}
function Zd(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function Qd(e) {
	return Zd(Nd(e));
}
function $d(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = Xd(t);
	n !== null && tf(e, t, n);
}
function ef(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Ki(t, "ui-row-name"));
}
function tf(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = nf(e, n, r);
	i && ((I(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && lf(e, n, a));
}
function nf(e, t, n) {
	let r = rf(e) ? af(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(F) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", Ki(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(Qn);
	return i !== null && Wd.set(e, i), e.setAttribute("aria-activedescendant", Ki(r, "ui-cell")), r;
}
function rf(e) {
	return e.matches(Vd);
}
function af(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Hd) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = of(t, n.getAttribute(Qn));
		if (e !== null) return e;
	}
	let r = sf(e, t), i = Wd.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Qn) === i);
	if (a !== void 0) return a;
	let o = Fd(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Qn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function of(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && cf(n)) return n;
	return null;
}
function sf(e, t) {
	let n = Fd(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && cf(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function cf(e) {
	return e.getAttribute("role") === Hd && !e.hasAttribute("data-ui-owns-keys");
}
function lf(e, t, n) {
	let r = e.querySelector(`:scope > .${rr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += uf(c.left, c.right, o, s);
}
function uf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function df(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function ff(e) {
	return Wd.get(e) ?? null;
}
function pf(e, t, n, r) {
	if (n !== null && gf(n)) return null;
	let i = sf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Qn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function mf(e, t, n, r) {
	let i = hf(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? af(e, t, null) : i[a];
}
function hf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && gf(e));
}
function gf(e) {
	return cf(e) && e.hasAttribute(Ud) && !e.hasAttribute("data-ui-table-column");
}
function _f(e) {
	let t = hf(e);
	return t[t.length - 1] ?? null;
}
function vf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Hd ? n : null;
}
function yf(e, t = null) {
	let n = e.closest(F);
	n !== null && e instanceof HTMLElement && tf(n, Nd(n), e, t);
}
function bf(e, t) {
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
function xf(e, t) {
	return Lu(e, t === "grid" ? "both" : t) || t !== "horizontal" && Sf(e);
}
function Sf(e) {
	return e === "PageDown" || e === "PageUp";
}
function Cf(e, t, n, r) {
	if (!xf(e, r)) return null;
	let i = Jd(t);
	if (Sf(e)) return wf(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Tf(i, n, e === "ArrowDown");
	let a = i.map((e) => I(e) ?? e), o = Iu({
		key: e,
		items: a,
		current: n === null ? null : I(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function wf(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (I(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Wu(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (I(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Tf(e, t, n) {
	let r = t === null ? null : I(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Ef(i), o = e.map((e) => ({
		row: e,
		rect: (I(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Ef(t.rect) - a) < Math.abs(Ef(e.rect) - a) ? t : e).row;
}
function Ef(e) {
	return e.left + e.width / 2;
}
var Df = "ui-row-press";
function Of(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function kf(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && Af(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = jf(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : tf(e, a, t, null, s);
	};
}
function Af(e) {
	let t = I(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = Hu(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function jf(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (Yd(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (Yd(e[n])) return e[n];
	return null;
}
function Mf(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || I(n) !== null) return;
	let r = jf(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Ne), df(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant")) : tf(e, t, r, null, !1);
}
function Nf(e) {
	let t = e.parentElement, n = t?.closest(F) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Pf(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function Ff(e, t, n) {
	let r = Nf(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Rf(r, t)));
}
function If(e, t) {
	let n = Nf(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Rf(n, t));
}
function Lf(e) {
	return e.getAttribute(Pe);
}
function Rf(e, t) {
	t.setAttribute(Ne, ""), nf(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var zf = "data-ui-active", Bf = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Vf = /* @__PURE__ */ new Set([
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
]), Hf = !1, Uf = !1, Wf = null, Gf = /* @__PURE__ */ new Set(), Kf = [], qf = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Jf(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Yf(e), !0), window.addEventListener("focus", (e) => Zf(e.target), !0), window.addEventListener("focusin", (e) => Zf(e.target), !0), window.addEventListener("focusout", (e) => Qf(e), !0), window.addEventListener("keydown", (e) => Xf(e)));
function Jf(e, t = "") {
	Hf = !0, Uf = t === "touch";
	let n = document.activeElement;
	Wf = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && rp(n, !$f(n)), ip(n);
}
function Yf(e) {
	if (!(e instanceof KeyboardEvent && Vf.has(e.key))) {
		Hf = !1;
		for (let e of [...Gf]) rp(e, !1);
		ip(document.activeElement);
	}
}
function Xf(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !M(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !$f(t) && rp(t, !0);
}
function Zf(e) {
	Hf && !$f(e) && rp(e, !0), e === document.activeElement && ip(document.activeElement);
}
function Qf(e) {
	e.target instanceof Element && e.target.hasAttribute(zf) || rp(e.target, !1), e.relatedTarget === null && queueMicrotask(() => ip(document.activeElement));
}
function $f(e) {
	return xu(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function ep() {
	return Hf && Wf instanceof HTMLElement && Wf !== document.body ? Wf : null;
}
function tp() {
	return Hf;
}
function np() {
	return Hf && Uf;
}
function rp(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Gf) e.isConnected || Gf.delete(e);
			Gf.add(e);
		} else Gf.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute($r, t), e === document.activeElement && ip(e);
	}
}
function ip(e) {
	let t = e === null || e === document.body || $f(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : ap(e);
	for (let e of Kf) n.includes(e) || e.removeAttribute(ei);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(ei, t);
	Kf = n;
}
function ap(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || op(n)); n = n.parentElement);
	return t;
}
function op(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Du) ?? null) !== null;
}
function R(e) {
	Zf(e), sp(e);
}
function sp(e) {
	ip(e), e.focus({ preventScroll: !0 }), ip(document.activeElement);
}
function cp(e) {
	rp(e, !0), sp(e);
}
function lp(e) {
	for (let t of e.querySelectorAll(Bf)) if (Kc(t)) return t;
	return null;
}
var up = {
	first: lp,
	stops: (e) => dp(e, document.activeElement),
	giveBack: (e) => yp(e),
	trapTab: mp
};
function dp(e, t) {
	let n = [...e.querySelectorAll(Bf)].filter((e) => e === t || e.tabIndex >= 0 && Kc(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = fp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !pp(n) && pp(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = fp(e);
		return t === null || r.get(t) === e;
	});
}
function fp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function pp(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function mp(e, t) {
	let n = dp(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = hp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function hp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && gp(n, a) ? i : r && gp(n, i) ? a : null;
}
function gp(e, t) {
	return e === t || fp(e) !== null && fp(e) === fp(t);
}
var _p = `.${xi}, .${Si}, [${wi}]`;
function vp(e) {
	let t = Gd(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(_p)) && n.hasAttribute("tabindex") && Kc(n)) return n;
	return null;
}
function yp(e, t = vp(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Gd(e);
	r?.root === t && r.row !== null && tf(t, Nd(t), r.row, vf(r.row, e)), R(t);
}
function bp(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? lp(e);
	return xp(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), R(r ?? e), n;
}
function xp(e) {
	Hf ? qf.add(e) : qf.delete(e);
}
function Sp(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? lp(e);
	return n !== null && Cp(e, n), bp(e, n);
}
function Cp(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function wp(e, t, n = !1) {
	if (xp(e), Hf) {
		N(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), R(e);
		return;
	}
	let r = t.filter(P), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (N(t, i), R(i));
}
function Tp(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Ep(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Bf}, [tabindex]`) && Kc(e)) return e;
	return n === null ? null : Dp(n);
}
function Ep(e, t) {
	if (t === null) return null;
	for (let n = e.closest(C); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Dp(e) {
	for (let t = e.closest(C); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (Kc(t)) return Op(t), t;
	return null;
}
function Op(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function kp(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (Ap(n, t) && rp(e, !$f(e)), R(e));
}
function Ap(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (qf.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var jp = "data-ui-clear", Mp = ["change", "toggle"], Np = [
	...Mp,
	"expand",
	"collapse",
	"open",
	"close"
];
function Pp(e) {
	let t = Qi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Fp(e) {
	return Qi(e) === "OnSubmit";
}
function Ip(e, t) {
	let n = e.getAttribute(Xe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Fp(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Pp(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Fp(i.mode)
		};
	}
	return null;
}
var Lp = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Mp) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Tu, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${jp}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		e.target instanceof Element && !this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && Ip(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
	}
	releaseDropped(e) {
		if (e.target instanceof Element) for (let t of [...this.bufferedElements]) (e.target.contains(t) || !t.isConnected) && this.bufferedElements.delete(t);
	}
	releaseForm(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) n.isConnected ? n.getAttribute("data-ui-form-id") === e && (this.bufferedElements.delete(n), t.push(n)) : this.bufferedElements.delete(n);
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
		let t = e.target.closest(`[${jp}]`);
		if (t === null) return;
		let n = t.closest(C), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Rp(r) || (Ll(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), xu(r) && document.activeElement !== r && R(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = Ip(e.target, this.options.metadata);
		t !== null && (e.type !== "change" || this.options.refuses?.(e.target) !== !0) && (t.buffered ? this.bufferValue(e.target) : (this.bufferedElements.delete(e.target), await this.syncValueAsync(e.target, t.bindingId)));
	}
	bufferValue(e) {
		e.getAttribute("data-ui-form-id") === null ? s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName }) : (this.bufferedElements.has(e) || this.pruneDetached(), this.bufferedElements.add(e));
	}
	pruneDetached() {
		for (let e of this.bufferedElements) e.isConnected || this.bufferedElements.delete(e);
	}
	async submitFormAsync(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) {
			if (n.getAttribute("data-ui-form-id") !== e || (this.bufferedElements.delete(n), !n.isConnected)) continue;
			let r = Ip(n, this.options.metadata);
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
		if (i === void 0 || !Pp(i.mode) || Fp(i.mode)) return;
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
function Rp(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function zp(e, t) {
	let n = e.closest(`[${Qe}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Bp = class {
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
}, Vp = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = va(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = va(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(va(e));
	}
	isAttached(e) {
		return this.attachments.has(va(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(va(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Hp = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Up = "aria-busy";
function Wp(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute(Xr, ""), r = !0, e.hasAttribute(Up) || (e.setAttribute(Up, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute(Xr), i && !e.classList.contains("ui-loading") && e.removeAttribute(Up));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var Gp = {
	dispatched: !1,
	success: !1
}, Kp = () => void 0, qp = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Jp = class {
	options;
	root;
	registry;
	requestFactory = new Hp();
	turns = new Bp();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Vp(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Xp(t, r.element) || zp(t.target, r.element)) return;
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
			let t = e instanceof qp, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return Gp;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Gp;
		let a = this.startPendingMark(e, n, r), o = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, o);
		} finally {
			o.done(), a();
		}
	}
	startPendingMark(e, t, n) {
		return e !== "click" || n.metadata?.showsPending === !1 ? Kp : Wp(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Zp(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Gp;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Gp;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new qp(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Np.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Ze(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Yp(e.preventDefault, t) && t.domEvent.preventDefault(), Yp(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Yp(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Xp(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Zp(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Qp(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && $p(e, t) : em(e, t);
}
function $p(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Qp(e[n], t[n])) return !1;
	return !0;
}
function em(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Qp(e[n], t[n]) : !tm(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !tm(t[n])) return !1;
	return !0;
}
function tm(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function nm() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function rm(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (im(e)) return am(e, () => rm(e)), null;
	let n = e;
	for (; n.parentElement !== null && !im(n.parentElement);) n = n.parentElement;
	let r = cm(n) ?? lm(n) ?? um();
	return r !== null && R(r), r;
}
function im(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function am(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => om(t) && sm(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function om(e) {
	return e.transitionProperty === "visibility";
}
function sm(e) {
	return e.effect?.target ?? null;
}
function cm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Bf) ?? null;
	return t !== null && im(t) ? t : null;
}
function lm(e) {
	let t = dp(e.closest(_p) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function um() {
	let e = document.querySelector(`[${jn}="content"]`);
	return e === null ? null : (Op(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var dm = class {
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
		for (let e of Mp) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = mm(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Qp(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Ip(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(w(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) ea(e.actionKind) === "CopyValue" && hm(e.target) && this.writeTarget(e.target, t.dynamicParameters, fm(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: w(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? mm(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = ea(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!hm(a)) return;
		let o = i === "CopyValue" ? fm(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = nm();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && rm(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: pm(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function fm(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function pm(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Ea(s, o)) return a === 0 ? e : {
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
function mm(e, t) {
	return JSON.stringify([w(e?.componentId), e?.propertyId ?? ""]) + ca(t);
}
function hm(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var gm = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return _m(t, e.operator, e.value);
	}
};
function _m(e, t, n) {
	let r = vm(e), i = vm(n);
	switch (ta(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return ym(r, i, (e) => e > 0);
		case "GreaterOrEqual": return ym(r, i, (e) => e >= 0);
		case "Less": return ym(r, i, (e) => e < 0);
		case "LessOrEqual": return ym(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return xm(r, i);
		case "RegexEach": return bm(r, i);
		default: return !1;
	}
}
function vm(e) {
	return E(e) ? e.key : ec(e) ? e.text : e;
}
function ym(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function bm(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => xm(vm(e), t)) : xm(e, t);
}
function xm(e, t) {
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
var Sm = "Value", Cm = "EndValue", wm = "Pressed", Tm = class {
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
		return this.eventNames.has(va(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Om(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(va(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(km(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Am(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Em(e)) {
			let t = w(e.sourceEvent?.componentId), n = va(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(km(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(km(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (Dm(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Am(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Am(t, n), r)), r.push(e), ea(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Sm || i === wm ? this.valueInteractions : i === Cm ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Em(e) {
	return $i(e.sourceKind) === "Event";
}
function Dm(e) {
	return $i(e.sourceKind) === "Property";
}
function Om(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function km(e, t) {
	return `${e}:${va(t)}`;
}
function Am(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var z = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function jm() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Mm(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Nm(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Pm = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Fm = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Im(e) {
	return `(min-width: ${Fm[e]}px)`;
}
var Lm = Im("sm");
function Rm(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Im(t))) return t;
	return "base";
}
function zm(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Bm(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Vm(e, t) {
	return Hm(t, (t) => Bm(e, t));
}
function Hm(e, t) {
	for (let n = Pm.indexOf(e); n >= 0; n--) {
		let e = t(Pm[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Um = /* @__PURE__ */ new Set([
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
function Wm(e) {
	return Um.has(e);
}
var Gm = 4, Km = 12, qm = /* @__PURE__ */ new Map(), Jm = !1, Ym = null, Xm = /* @__PURE__ */ new WeakMap(), Zm = "data-ui-popup-stood-in";
function Qm(e, t) {
	t === null ? Xm.delete(e) : Xm.set(e, t);
}
var $m = "--ui-popup-ground";
function eh(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue($m).trim() : "";
	n.length === 0 ? t.style.removeProperty($m) : t.style.setProperty($m, n);
}
function th(e, t, n) {
	qm.set(t, {
		anchor: e,
		options: n
	}), mh(), Ym?.observe(t), sh(e, t), gh(e, t, n);
}
var nh = "data-ui-popup-lifted", rh = "data-ui-sheet";
function ih() {
	return typeof matchMedia == "function" && !matchMedia(Lm).matches;
}
function ah(e) {
	return e.hasAttribute(rh);
}
function oh(e) {
	e.hasAttribute(nh) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(nh, ""), ch(e));
}
function sh(e, t) {
	(t.hasAttribute(nh) || lh(t) || e.closest(`[${nh}]`) !== null) && oh(t);
}
function ch(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function lh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var uh = z.normal * 5;
function dh(e, t) {
	e.hasAttribute(nh) && (e.matches(":popover-open") && e.hidePopover(), Nm(e, uh, () => {
		e.matches(":popover-open") || qm.has(e) || (e.removeAttribute("popover"), e.removeAttribute(nh), t?.());
	}));
}
function fh(e) {
	let t = qm.get(e);
	t !== void 0 && gh(t.anchor, e, t.options);
}
function ph(e) {
	e != null && (qm.delete(e), Ym?.unobserve(e), dh(e));
}
function mh() {
	Jm || (Jm = !0, document.addEventListener("scroll", (e) => hh(e.target), !0), window.addEventListener("resize", () => hh(null)), window.visualViewport?.addEventListener("resize", () => hh(null)), window.visualViewport?.addEventListener("scroll", () => hh(null)), Ym = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = qm.get(t.target);
			e !== void 0 && gh(e.anchor, t.target, e.options, !0);
		}
	}));
}
function hh(e) {
	for (let [t, n] of qm) t.isConnected ? e instanceof Node && t.contains(e) || gh(n.anchor, t, n.options) : ph(t);
}
function gh(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = bh(e), a = i !== e;
	t.hasAttribute(Zm) !== a && t.toggleAttribute(Zm, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(_h) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	yh(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = Ch(n.boundary), p = qm.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Th(l, d, m, u, f) ? m : wh(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Th(l, d, h, u, f) || (vh(t, h, kh(l, h, f) - u - Gm), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? Nh(t, h) : Mh, _ = Fh(l, c, d, h, u, g), v = Ih(l, c, d, h, u, g);
	n.arrow === !0 && (Oh(h) ? v = xh(v, c.left + c.width / 2, d.width) : _ = xh(_, c.top + c.height / 2, d.height));
	let ee = Rh();
	_ = ee.top + Hh(_ - ee.top, d.height, ee.bottom - ee.top), v = Hh(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Sh(t, c, d, h, _, v);
}
var _h = "data-ui-popup-capped";
function vh(e, t, n) {
	let r = Oh(t);
	e.setAttribute(_h, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function yh(e) {
	if (e.hasAttribute(_h)) {
		e.removeAttribute(_h);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function bh(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Zm)) return e;
		let n = Xm.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function xh(e, t, n) {
	let r = t - e;
	return r < Km ? e - (Km - r) : r > n - Km ? e + (r - (n - Km)) : e;
}
function Sh(e, t, n, r, i, a) {
	let o = Oh(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Km, Math.min(s, c - Km))}px`);
}
function Ch(e) {
	let t = Rh(), n = {
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
function wh(e, t, n, r, i) {
	let a = Ah(n);
	if (Th(e, t, n, r, i)) return n;
	if (Th(e, t, a, r, i)) return a;
	for (let a of Eh(n)) if (Th(e, t, a, r, i)) return a;
	return kh(e, a, i) > kh(e, n, i) ? a : n;
}
function Th(e, t, n, r, i) {
	return kh(e, n, i) >= Dh(t, n) + r;
}
function Eh(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Dh(e, t) {
	return Oh(t) ? e.height : e.width;
}
function Oh(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function kh(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Ah(e) {
	return e.startsWith("top") ? `bottom${jh(e)}` : e.startsWith("bottom") ? `top${jh(e)}` : e.startsWith("left") ? `right${jh(e)}` : `left${jh(e)}`;
}
function jh(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Mh = {
	start: 0,
	end: 0
};
function Nh(e, t) {
	let n = getComputedStyle(e);
	return Oh(t) ? {
		start: Ph(n.paddingLeft) + Ph(n.borderLeftWidth),
		end: Ph(n.paddingRight) + Ph(n.borderRightWidth)
	} : {
		start: Ph(n.paddingTop) + Ph(n.borderTopWidth),
		end: Ph(n.paddingBottom) + Ph(n.borderBottomWidth)
	};
}
function Ph(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Fh(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Lh(t.top, t.height, n.height, r, a);
}
function Ih(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Lh(t.left, t.width, n.width, r, a);
}
function Lh(e, t, n, r, i) {
	let a = jh(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Rh() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, zh(r))
	};
}
function zh(e) {
	let t = document.querySelector(`[${On}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Bh(e, t, n) {
	if (ah(e)) return;
	let r = e.getBoundingClientRect(), i = Rh();
	e.style.left = `${Vh(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Vh(n, r.height, i.top, i.bottom)}px`;
}
function Vh(e, t, n, r) {
	return e + t <= r - Gm ? e : e - t >= n + Gm ? e - t : n + Hh(e - n, t, r - n);
}
function Hh(e, t, n) {
	return Math.max(Gm, Math.min(e, n - t - Gm));
}
//#endregion
//#region src/interactions/press-wave.ts
var Uh = "ui-press-wave", Wh = "ui-press-wave__ink";
function Gh(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!Kh(t)) return !1;
	for (let t of e.removedNodes) if (!Kh(t)) return !1;
	return !0;
}
function Kh(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function qh(e) {
	return e.length > 0 && e.every(Gh);
}
function Jh(e) {
	for (let t of e.querySelectorAll(`.${Uh}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Yh = 32;
function B(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Xh(e, i.filter((e) => !Gh(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function Xh(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			Zh(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > Yh) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function Zh(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function Qh(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var $h = "data-ui-dialog", eg = "data-ui-dialog-modal", tg = "data-ui-dialog-backdrop", ng = "data-ui-dialog-close-backdrop", rg = "data-ui-dialog-close-escape", ig = `[${$h}]:not([hidden]), dialog[open]`, ag = "dialog:modal";
function og(e) {
	let t = e.querySelectorAll(`[${$h}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function sg(e) {
	let t = e.querySelectorAll(ag);
	if (t.length > 0) return t[t.length - 1];
	let n = og(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function cg(e) {
	let t = typeof document > "u" ? null : sg(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var lg = /* @__PURE__ */ new Set(), ug = null;
function dg(e) {
	ug = e;
}
function fg(e) {
	let t = e.composedPath(), n = ug?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var pg = /* @__PURE__ */ new Map(), mg = 0, hg = !1;
function gg() {
	hg || (hg = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || yg(pu(e.target)) && e.preventDefault();
	}, !0));
}
function _g() {
	for (let e of lg) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function vg(e) {
	for (let t of lg) t.hearRefusedClick(e);
}
function yg(e) {
	let t = [];
	for (let e of lg) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...pg.keys()]) n.has(e) || pg.delete(e);
	for (let { popup: e } of t) pg.has(e) || pg.set(e, ++mg);
	let r = bg(t, (e) => pg.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function bg(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var xg = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), lg.add(this), gg();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = fg(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = fg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = fg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? cg(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, Sg = /\p{M}/gu, Cg = ".ui-text__title";
function wg(e, t) {
	return Tg(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Tg(e, t) {
	return Og(e, Dg(t));
}
function Eg(e, t) {
	return t.every((t) => e.includes(t));
}
function Dg(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Og(e, t) {
	let n = e.normalize("NFD").replace(Sg, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function kg(e) {
	return e.querySelector(Cg)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Ag = class {
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
		if (t === null || O(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(qr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
		if (this.options.pinch !== void 0 && e.second === null && n.pointerId !== e.pointerId && e.handle.contains(t)) {
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, jg(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(qr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(qr);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function jg(e, t, n, r) {
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
function Mg() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function Ng(e, t) {
	let n = (e) => t.axis === "y" ? e.clientY : e.clientX, r = (e) => t.axis === "y" ? e.clientX : e.clientY, i = (e, r) => {
		let i = n(e) - r.startAlong;
		return t.oneWay === !0 ? Math.max(0, i) : i;
	}, a = null, o = (e) => {
		if (a = null, !e.isPrimary || e.button !== 0 || !t.begins(e)) return;
		let i = {
			at: n(e),
			time: e.timeStamp
		};
		a = {
			pointerId: e.pointerId,
			startAlong: n(e),
			startAcross: r(e),
			moving: !1,
			previous: i,
			last: i
		};
	}, s = (e) => {
		if (a !== null && e.pointerId === a.pointerId) {
			if (!a.moving) {
				let i = n(e) - a.startAlong, o = Math.abs(r(e) - a.startAcross);
				if (o > 6 && o > Math.abs(i) || t.oneWay === !0 && i < -6) {
					a = null;
					return;
				}
				if ((t.oneWay === !0 ? i : Math.abs(i)) <= 6) return;
				a.moving = !0, t.start(e);
			}
			a.previous = a.last, a.last = {
				at: n(e),
				time: e.timeStamp
			}, t.follow(i(e, a));
		}
	}, c = (e) => {
		if (a === null || e.pointerId !== a.pointerId) return;
		let n = a;
		if (a = null, !n.moving) return;
		Mg();
		let r = n.last.time - n.previous.time, o = r > 0 ? (n.last.at - n.previous.at) / r : 0;
		t.end(i(e, n), o, e.type === "pointerup");
	}, l = (e) => {
		let r = e.touches[0];
		if (a === null || !e.cancelable || r === void 0) return;
		let i = n(r) - a.startAlong;
		(a.moving || (t.oneWay === !0 ? i > 0 : i !== 0)) && e.preventDefault();
	};
	return e.addEventListener("pointerdown", o), e.addEventListener("pointermove", s), e.addEventListener("pointerup", c), e.addEventListener("pointercancel", c), t.holdsTouch === !0 && e.addEventListener("touchmove", l, { passive: !1 }), () => {
		a = null, e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), e.removeEventListener("pointerup", c), e.removeEventListener("pointercancel", c), e.removeEventListener("touchmove", l);
	};
}
//#endregion
//#region src/interactions/sheet-swipe.ts
var Pg = "data-ui-sheet-dragging", Fg = "--ui-sheet-drag", Ig = 24, Lg = 1 / 3;
function Rg(e, t, n) {
	return e > t * Lg || n > .5 && e > 6;
}
function zg(e, t, n) {
	e.style.removeProperty(Fg), e.removeAttribute(Pg);
	let r = Ng(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= Ig),
		start: (t) => {
			e.setAttribute(Pg, ""), Bg(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(Fg, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(Pg), i && Rg(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(Fg, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(Pg);
	};
}
function Bg(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Vg = "data-ui-sheet-covered", Hg = "ui-sheet-scrim", Ug = "data-ui-sheet-scrim-leaving", Wg = 400, Gg = "ui-sheet__back", Kg = "ui.sheet.back", qg = "ne-arrow-back", Jg = [], Yg = null, Xg = !1, Zg = !1;
function Qg(e, t) {
	if ($g(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : $g(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = ah(e);
	e.setAttribute(rh, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Mm(e));
	let a = null;
	e.querySelector(`:scope > .${Gg}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Vg, ""), a = e_(t), e.prepend(a)), n_(), oh(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: zg(e, e, () => r_(e))
	};
	Jg.push(o), i_(), queueMicrotask(() => o_(o));
}
function $g(e) {
	return Jg.find((t) => t.popup === e) ?? null;
}
function e_(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : kg(e.anchor).trim();
	return t.type = "button", t.className = Gg, t.tabIndex = -1, t.textContent = n, t.prepend(t_()), D.write(t, "aria-label", Kg, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function t_() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), uo(e, qg), e;
}
function n_() {
	Yg === null && (Yg = document.createElement("div"), Yg.className = Hg, Yg.setAttribute("aria-hidden", "true"), Yg.addEventListener("mousedown", (e) => e.preventDefault())), Yg.parentElement === null && document.body.appendChild(Yg), Yg.removeAttribute(Ug), oh(Yg);
}
function r_(e) {
	for (let t = $g(e); t !== null; t = t.parent) t.opening.close();
}
function i_() {
	Xg || (Xg = !0, window.addEventListener("pointerdown", () => {
		Zg = !0;
	}, !0), window.addEventListener("pointerup", a_, !0), window.addEventListener("pointercancel", a_, !0), window.addEventListener("keydown", (e) => {
		let t = Jg.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && mp(t.popup, e);
	}, !0), matchMedia(Lm).addEventListener("change", () => {
		for (let e of Jg.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function a_() {
	if (Zg = !1, Yg?.hasAttribute(Ug) !== !0) return;
	let e = () => {
		Yg?.hasAttribute(Ug) === !0 && Jg.length === 0 && (Yg.removeAttribute(Ug), Yg.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Wg);
}
function o_(e) {
	if (!Jg.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), R(t)), e.hidden = s_(t);
}
function s_(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== Yg && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function c_(e) {
	let t = $g(e);
	if (t !== null) {
		for (let e of [...Jg].reverse()) if (e === t || l_(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function l_(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function u_(e) {
	let t = $g(e);
	if (t !== null) {
		for (let e of Jg.filter((e) => e.parent === t)) e.opening.close(), u_(e.popup);
		c_(e), Jg.splice(Jg.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Vg), Jg.length === 0 && d_(), dh(e, () => {
			$g(e) === null && (e.removeAttribute(rh), e.removeAttribute(Vg), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function d_() {
	Yg?.matches(":popover-open") === !0 && (Zg ? Yg.setAttribute(Ug, "") : Yg.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function f_(e, t) {
	return e.isConnected && !O(e) && !(t && A(e));
}
var p_ = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new xg({
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
			isBehind: (e) => cg(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && h_(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && x_(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || tp() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		__(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, b_(t)) && !cg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!__(e)) return;
		let t = vp(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && f_(n.owner, this.closesWhenReadOnly) && !cg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !f_(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), S_(e, !0), M_(this), D_(e), e.focus !== void 0 && e.focus !== !1 && bp(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		ah(e.popup) || x_(this.options.sheetOnPhone, e) && ih() ? Qg(e.popup, {
			anchor: e.anchor,
			close: () => this.close(e.owner, "escape"),
			trapsTab: !x_(this.options.closesOnTab, e)
		}) : e.anchor !== void 0 && e.placement !== void 0 && th(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), O_(r.popup), c_(r.popup), r.popup.contains(document.activeElement) && kp(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), S_(r, !1), ah(r.popup) ? u_(r.popup) : ph(r.popup), this.entries.size === 0 && N_(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (f_(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !v_() && y_(e);
		}
	}
}, m_ = /* @__PURE__ */ new Set();
function h_(e) {
	m_.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !j(e) && e.target instanceof Node && g_(e.target);
	}, !0), m_.add(e);
}
function g_(e) {
	let t = [...m_].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of bg(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function __(e) {
	return e instanceof Element && e.isConnected && Kc(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function v_() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Kc(e);
}
function y_(e) {
	Op(e), R(e);
}
function b_(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function x_(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function S_(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var C_ = /* @__PURE__ */ new Map(), w_ = /* @__PURE__ */ new Set(), T_ = /* @__PURE__ */ new WeakSet(), E_ = [];
function D_(e) {
	let { popup: t } = e;
	C_.set(t, e.owner), !T_.has(t) && (T_.add(t), t.addEventListener("pointerenter", () => {
		C_.has(t) && (w_.add(t), k_());
	}), t.addEventListener("pointerleave", () => {
		w_.delete(t) && k_();
	}));
}
function O_(e) {
	C_.delete(e), w_.delete(e) && k_();
}
function k_() {
	let e = /* @__PURE__ */ new Set();
	for (let t of w_) {
		let n = C_.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of E_) e.has(t) || t.removeAttribute(ti);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(ti, "");
	E_ = [...e];
}
var A_ = /* @__PURE__ */ new Set(), j_ = null;
function M_(e) {
	A_.add(e), j_ === null && typeof MutationObserver == "function" && (j_ = new MutationObserver(() => {
		for (let e of [...A_]) e.closeStranded();
	}), j_.observe(document, {
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
function N_(e) {
	A_.delete(e), !(A_.size > 0 || j_ === null) && (j_.disconnect(), j_ = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var P_ = "ui-flyout", F_ = "ui-flyout--open", I_ = "ui-flyout__anchor", L_ = "data-ui-flyout-no-backdrop-close", R_ = "data-ui-flyout-no-escape-close", z_ = `${P_}--`, B_ = "bottom-start", V_ = class {
	root;
	flyouts = new p_({
		show: ({ owner: e }) => e.classList.add(F_),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? R_ : L_)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${P_}`)) this.place(e);
		B(this.root, `.${P_}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Si}`), n = e.querySelector(`:scope > .${I_}`);
		if (t === null) return;
		let r = H_(n, t);
		e.classList.contains(F_) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: W_(n) ?? e,
			placement: { placement: G_(e) },
			openers: r === null ? [] : [r],
			focus: !tp() || t
		}) || this.markClosed(e) : (this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	markClosed(e, t = !0) {
		e.classList.contains(F_) && (e.classList.remove(F_), U_(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${I_}`)?.closest(`.${P_}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(F_), this.place(t), this.flyouts.isOpen(t) && U_(t, !0)));
	}
};
function H_(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Bf) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Ki(t, "ui-flyout-content")), n;
}
function U_(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function W_(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function G_(e) {
	for (let t of e.classList) {
		if (!t.startsWith(z_)) continue;
		let e = t.slice(z_.length);
		if (Wm(e)) return e;
	}
	return B_;
}
//#endregion
//#region src/interactions/drag-picture.ts
var K_ = "ui-drag-picture", q_ = "data-ui-drag-part", J_ = ["::before", "::after"], Y_ = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", X_ = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), Z_ = null, Q_ = null;
typeof Image == "function" && ev();
function $_(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = ev();
	Q_?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), tv(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && Q_?.();
	}, 0));
}
function ev() {
	return Z_ === null && typeof Image == "function" && (Z_ = new Image(1, 1), Z_.src = Y_), Z_;
}
function tv(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = K_, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, rv(e, a, o);
	for (let [e, t] of [
		["position", "relative"],
		["inset", "auto"],
		["margin", "0"],
		["transform", "none"],
		["translate", "none"],
		["opacity", "1"]
	]) a.style.setProperty(e, t);
	if (o.length > 0) {
		let e = document.createElement("style");
		e.textContent = o.join("\n"), i.append(e);
	}
	i.append(a);
	let s = (e) => nv(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), Q_ === u && (Q_ = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), Q_ = u, nv(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function nv(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function rv(e, t, n) {
	let r = t.style;
	r !== void 0 && (sv(getComputedStyle(e), (e, t) => r.setProperty(e, t)), iv(e, r, "columns"), iv(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !X_.has(e.toLowerCase()) && t.removeAttribute(e);
	ov(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : rv(i, a, n);
	}
}
function iv(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, av(e, n).join(" "));
}
function av(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = av(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function ov(e, t, n) {
	for (let r of J_) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(q_) || t.setAttribute(q_, String(n.length));
		let a = [];
		sv(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${K_} [${q_}="${t.getAttribute(q_)}"]${r} { ${a.join(" ")} }`);
	}
}
function sv(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var cv = `:scope > :is(${Du}, .ui-image-input__surface)`;
function lv(e, t, n, r, i, a = [], o = "move") {
	uv(t, r), dv(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function uv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function dv(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && $_(e, e.dataTransfer, e.target));
}
function fv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function pv(e, t) {
	let n = t && e.querySelector(cv) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var mv = "data-ui-file-drop-over", hv = 120, gv = "refused", _v = !1;
function vv(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Sv();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => yv(e, t, n), !0);
	e.root.addEventListener("dragend", () => Ov(t.marked), !0), window.addEventListener("blur", () => Ov(t.marked)), e.root.addEventListener("paste", (t) => bv(e, t), !0);
}
function yv(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Ov(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Cv(n), n.type !== "dragleave" && Ov(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Dv(r, a) : t.leaving = window.setTimeout(() => Ov(r), hv);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = wv(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Dv(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : mv;
		r.set(a, o), a.setAttribute(o, t ? gv : ""), pv(a, o === mv);
		return;
	}
	Ov(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => kv(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function bv(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => kv(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function xv(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Ir}="${Ui(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Sv() {
	if (!_v) {
		_v = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Cv(e);
		});
	}
}
function Cv(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function wv(e, t) {
	let n = Tv(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Ev(t, e)));
}
function Tv(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Ev(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Dv(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), pv(t, !1);
}
function Ov(e) {
	for (let t of [...e.keys()]) Dv(e, t);
}
function kv(e, t) {
	let n = Tv(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Ev(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Av = "ne-picture-as-pdf", jv = "ne-text-snippet", Mv = "ne-description", Nv = "ne-table-chart", Pv = "ne-slideshow", Fv = "ne-folder-zip", Iv = "ne-audio-file", Lv = "ne-video-file", Rv = "ne-image", zv = "ne-code", Bv = "ne-draft", Vv = new Map([
	...Gv(Av, "pdf"),
	...Gv(jv, "txt", "md", "log"),
	...Gv(Mv, "doc", "docx", "odt", "rtf"),
	...Gv(Nv, "xls", "xlsx", "ods", "csv", "tsv"),
	...Gv(Pv, "ppt", "pptx", "odp", "key"),
	...Gv(Fv, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Gv(Iv, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Gv(Lv, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Gv(Rv, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Gv(zv, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Hv = /* @__PURE__ */ new Map([
	["application/pdf", Av],
	["text/csv", Nv],
	["application/msword", Mv],
	["application/rtf", Mv],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Mv],
	["application/vnd.oasis.opendocument.text", Mv],
	["application/vnd.ms-excel", Nv],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Nv],
	["application/vnd.oasis.opendocument.spreadsheet", Nv],
	["application/vnd.ms-powerpoint", Pv],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Pv],
	["application/vnd.oasis.opendocument.presentation", Pv],
	["application/zip", Fv],
	["application/x-zip-compressed", Fv],
	["application/x-7z-compressed", Fv],
	["application/vnd.rar", Fv],
	["application/x-rar-compressed", Fv],
	["application/x-tar", Fv],
	["application/gzip", Fv],
	["application/json", zv],
	["application/xml", zv],
	["text/xml", zv],
	["text/html", zv]
]), Uv = /* @__PURE__ */ new Map([
	["image", Rv],
	["audio", Iv],
	["video", Lv],
	["text", jv]
]);
function Wv(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Vv.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Hv.get(i) ?? (a < 0 ? void 0 : Uv.get(i.slice(0, a))) ?? Bv;
}
function Gv(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var Kv = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function qv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(wt), e.setAttribute("title", t.name), e.setAttribute(Ot, t.name), Jv(e, kt, t.type.length > 0 ? t.type : null), Jv(e, At, t.size === null ? null : String(t.size)), r.className = Tt, r.setAttribute("aria-hidden", "true"), i.className = Et, i.textContent = t.name, a.className = Dt, Xv(e, r, a, n), [
		r,
		i,
		a
	];
}
function Jv(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Yv(e, t) {
	let n = e.querySelector(`:scope > .${Tt}`), r = e.querySelector(`:scope > .${Dt}`);
	n !== null && r !== null && Xv(e, n, r, t);
}
function Xv(e, t, n, r) {
	let i = e.getAttribute(jt), a = i !== null && mo(i).length > 0 ? i : Wv(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(mo(a)) || i !== null) && uo(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? Zv(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function Zv(e, t) {
	let n = e, r = "byte";
	for (let e of Kv) {
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
//#endregion
//#region src/runtime/session-key.ts
var Qv = "SessionKey", $v = "/_ne/session/key", ey = 1e4, ty = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = ry) {
		this.trade = e;
	}
	start(e) {
		if (typeof e != "string" || e.length === 0 || e === this.lastToken) return;
		this.lastToken = e;
		let t = (this.pending ?? Promise.resolve()).then(() => this.trade(e)).catch((e) => c("trading a sign-in's token for its session key failed; the next page load is signed out.", e));
		this.pending = t, t.then(() => {
			this.pending === t && (this.pending = null);
		});
	}
	settled() {
		return this.pending ?? Promise.resolve();
	}
	load(e) {
		this.pending === null ? e() : this.pending.then(e);
	}
}();
function ny(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function ry(e) {
	let t = await fetch($v, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(ey)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var iy = "/_ne/files/upload", ay = "/_ne/files/selection/", oy = "/_ne/files/upload/", sy = /* @__PURE__ */ new Map(), cy = !1;
function ly(e, t, n, r) {
	let i = Number(e.getAttribute(Pr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return sy.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of sy.keys()) e.isConnected || sy.delete(e);
	return sy.set(e, c), uy(e, c), dy(), a;
}
function uy(e, t) {
	let n = Zv(t.limit, D.language);
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
function dy() {
	cy || (cy = !0, D.onChange(() => {
		for (let [e, t] of sy) e.isConnected ? uy(e, t) : sy.delete(e);
	}));
}
async function fy(e, t) {
	let n = [...e];
	return await ty.settled(), await py(n, t);
}
function py(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", iy), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && t(Math.round(e.loaded / e.total * 100));
		}), c.addEventListener("load", () => {
			if (c.status < 200 || c.status >= 300) {
				r(/* @__PURE__ */ Error(`Upload failed with status ${c.status}.`));
				return;
			}
			let e = c.response?.selectionId;
			e === void 0 || e.length === 0 ? r(/* @__PURE__ */ Error("Upload response carried no selection id.")) : (d(`uploaded ${s} file(s), ${o} bytes,`, a), n({ selectionId: e }));
		}), c.addEventListener("error", () => r(/* @__PURE__ */ Error("Upload failed."))), c.addEventListener("abort", () => r(/* @__PURE__ */ Error("Upload was aborted."))), c.send(i);
	});
}
async function my(e) {
	await ty.settled();
	let t = await fetch(`${ay}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function hy(e) {
	return `${oy}${encodeURIComponent(e)}`;
}
var gy = () => {};
function _y(e) {
	return {
		uploadAsync: (e, t) => fy(e, t ?? gy),
		accepts: kv,
		takeWithinSizeLimit: (t, n, r) => ly(t, n, r, e)
	};
}
function vy(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var yy = "ui-open-picker";
function by(e) {
	return !e.dispatchEvent(new Event(yy, {
		bubbles: !0,
		cancelable: !0
	}));
}
function xy(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Sy = "ui-file-input", Cy = "ui-file-input__row", wy = "ui-file-input__native", Ty = "ui-file-input__field", Ey = "ui-file-input__selection", Dy = "data-ui-file-dragging", Oy = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(yy, (e) => xy(e, {
			rootSelector: `.${Sy}`,
			nativeSelector: `.${wy}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), vv({
			root: this.root,
			draggingAttribute: Dy,
			resolveTarget: (e) => {
				let t = e.closest(`.${Cy}`)?.closest(`.${Sy}`) ?? null, n = t === null ? xv(this.root, e, `.${Sy}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${wy}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || A(r) || O(r)
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
		let t = e.target.closest(`[${Fr}], .${Cy}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Sy}`)?.querySelector(`.${wy}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(wy)) return;
		let t = e.target.closest(`.${Sy}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Ty}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = ly(e, t, e.querySelector(`.${wy}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await fy(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, ky(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => D.text("ui.file.failed")), this.publishSelection(e, "");
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
		vy(e.querySelector(`.${Ey}`), t);
	}
};
function ky(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
}
var Ay = 1024, jy = 16777216;
function My(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Ny(e, t) {
	let n = Uy(t.zoom, 1, 4), r = Hy(e) / n / 2;
	return {
		x: Uy(t.x, r, e.width - r),
		y: Uy(t.y, r, e.height - r),
		zoom: n
	};
}
function Py(e, t) {
	let n = Hy(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function Fy(e, t, n) {
	return t.zoom * n / Hy(e);
}
function Iy(e, t, n, r, i) {
	let a = Fy(e, t, n);
	return a > 0 ? Ny(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function Ly(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Uy(t.zoom * r, 1, 4), o = Fy(e, t, n), s = Fy(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Ny(e, {
		...t,
		zoom: a
	}) : Ny(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function Ry(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function zy(e, t) {
	return Math.min(1, t * 4 / Hy(e), Math.sqrt(jy / (e.width * e.height)));
}
function By(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Vy(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Hy(e) {
	return Math.min(e.width, e.height);
}
function Uy(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Wy(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute($h, e.key), t.setAttribute(eg, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(rg, ""), t.setAttribute(ng, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(tg, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? xi : `${xi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Gy = class {
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
}, Ky = 100 / 3, qy = 1, Jy = 2;
function Yy(e, t = Ky) {
	let n = e.deltaMode === qy ? Ky : e.deltaMode === Jy ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Xy(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Zy = {
	notch: 100,
	pixels: Yy
}, Qy = "ui-image-crop", $y = "ui-image-crop-title", eb = new Gy("data-ui-image-crop-part"), tb = "data-ui-image-crop-frame", nb = 10, rb = 1.2, ib = 380, ab = 100, ob = .92, V = null, sb = !1, cb = null, lb = !1;
async function ub(e, t, n, r = Sb) {
	if (V !== null || sb) return "cancelled";
	sb = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		sb = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		cb ??= db();
		let o = cb;
		o.dialog.isConnected || document.body.append(o.dialog), V = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: My(a),
			finish: (t) => {
				V = null, e.close(Qy), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(tb, n.frame), e.open(Qy), bb(o);
	});
}
function db() {
	let { dialog: e, surface: t } = Wy({
		key: Qy,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: $y,
		closesOnEscapeAndBackdrop: !1
	}), n = eb.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = $y;
	let r = eb.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = eb.element("canvas", "ui-image-crop__canvas"), a = eb.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = eb.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = eb.button("ui-button--ghost", "cancel"), c = eb.button("ui-button--primary", "apply");
	t.append(n, r, o, eb.actions(s, c));
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
		let t = eb.pressed(e);
		t === "cancel" ? V?.finish("cancelled") : t === "apply" && fb();
	}), new MutationObserver(() => {
		V !== null && e.hasAttribute("hidden") && V.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => pb(l, e)), o.addEventListener("input", () => vb(l, Number(o.value))), r.addEventListener("wheel", (e) => mb(l, e), { passive: !1 }), window.addEventListener("resize", () => xb(l)), new Ag({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => V === null ? null : {
			last: t,
			start: V.view
		},
		move: (e, t, n) => {
			e.last !== null && hb(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			V !== null && (V.view = t.start, bb(l));
		},
		pinch: (e, t) => {
			e.last = null, gb(l, t);
		}
	}), l;
}
async function fb() {
	let e = V;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Py(n, a), s = By(t.type), c = i.encodeAsync(n, o, Ry(o, r.size), s);
	V = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Vy(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function pb(e, t) {
	if (t.defaultPrevented || j(t) || V === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), V.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : nb;
	switch (t.key) {
		case "ArrowLeft":
			hb(e, -n, 0);
			break;
		case "ArrowRight":
			hb(e, n, 0);
			break;
		case "ArrowUp":
			hb(e, 0, -n);
			break;
		case "ArrowDown":
			hb(e, 0, n);
			break;
		case "+":
		case "=":
			_b(e, rb);
			break;
		case "-":
		case "_":
			_b(e, 1 / rb);
			break;
		case "Enter":
			fb();
			break;
		default: return;
	}
	t.preventDefault();
}
function mb(e, t) {
	if (V === null) return;
	t.preventDefault();
	let n = Yy(t, e.stage.clientHeight), r = t.ctrlKey ? ab : ib;
	_b(e, 2 ** (-n.y / r), yb(e, t.clientX, t.clientY));
}
function hb(e, t, n) {
	V !== null && (V.view = Iy(V.source, V.view, e.frame.clientWidth, t, n), bb(e));
}
function gb(e, t) {
	if (V === null) return;
	let n = Iy(V.source, V.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	V.view = Ly(V.source, n, e.frame.clientWidth, t.factor, yb(e, t.center.x, t.center.y)), bb(e);
}
function _b(e, t, n) {
	V !== null && (V.view = Ly(V.source, V.view, e.frame.clientWidth, t, n), bb(e));
}
function vb(e, t) {
	V !== null && Number.isFinite(t) && t > 0 && _b(e, t / V.view.zoom);
}
function yb(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function bb(e) {
	if (V === null) return;
	let t = V.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), xb(e);
}
function xb(e) {
	lb || V === null || (lb = !0, requestAnimationFrame(() => {
		if (lb = !1, V === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = V.view, a = Fy(V.source, i, t);
		V.imaging.paint(e.canvas, V.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: V.source.width * a,
			height: V.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var Sb = {
	decodeAsync: async (e, t) => {
		let n = await Cb(e);
		if (n === null) return null;
		let r = n, i = zy(r, t);
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
		o === null ? i(null) : (o.imageSmoothingQuality = "high", o.drawImage(e.image, t.x, t.y, t.side, t.side, 0, 0, n, n), a.toBlob((e) => {
			a.width = 0, a.height = 0, i(e);
		}, r, ob));
	})
};
async function Cb(e) {
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
var wb = "ui-image-input", Tb = "ui-image-input--multiple", Eb = "ui-image-input__surface", Db = "ui-image-input__native", Ob = "ui-image-input__picture", kb = "ui-image-input__text", Ab = "ui-image-input__selection", jb = "ui-image-input__selections", Mb = "ui-image-input__tiles", Nb = "ui-image-input__tile", Pb = "ui-image-input__remove", Fb = "ui-image-input__progress", Ib = "SelectionId", Lb = "--ui-image-progress", Rb = "data-ui-image-preview", zb = "data-ui-image-dragging", Bb = "data-ui-image-tiles", Vb = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${wb}`)), B(this.root, `.${wb}`, {
			childList: !0,
			attributeFilter: [
				Nr,
				$e,
				oi
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Ib && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Pa(e.components, `.${wb}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(yy, (e) => xy(e, {
			rootSelector: `.${wb}`,
			nativeSelector: `.${Db}`,
			pressed: (e) => e.querySelector(`.${Eb}`)
		})), this.root.addEventListener(Tu, (e) => this.handleDraftDropped(e)), vv({
			root: this.root,
			draggingAttribute: zb,
			resolveTarget: (e) => {
				let t = e.closest(`.${Eb}`), n = t?.closest(`.${wb}`) ?? null, r = n === null ? xv(this.root, e, `.${wb}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Eb}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Db}`)?.getAttribute("accept") ?? "",
					multiple: Hb(i),
					refused: A(i) || O(a)
				};
			},
			onFiles: (e, t) => void (Hb(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Hb(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Ob}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Zb(e, e.getAttribute("data-ui-image-caption") ?? ex(n)), $b(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(oi);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = t === null ? -1 : n.indexOf(t);
		if (r >= 0) {
			n.splice(0, r + 1);
			return;
		}
		let i = Kb(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Mb}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = Jb(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), Ub(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await my(n);
		} catch (e) {
			s("a file on the shelf could not be read back; it stays, as a file.", e), r = [];
		}
		if (!this.shelves.get(e)?.includes(t)) return;
		if (r === null) {
			s("a file on the shelf is gone from the server; it is taken off, and the controller told.", { selectionId: n }), this.dropTile(e, t), this.publishShelf(e);
			return;
		}
		let i = r.at(0), a = i === void 0 ? {
			name: "",
			type: "",
			size: null
		} : {
			name: i.fileName,
			type: i.contentType ?? "",
			size: i.size
		};
		Yb(t.element, a, i === void 0 ? "" : hy(i.fileId)), t.element.classList.remove(vi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Hb(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fr}]`), n = t?.closest(`.${wb}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${Db}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Pb}`), n = t?.closest(`.${wb}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Db)) return;
		let t = e.target.closest(`.${wb}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Hb(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${wb}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), vy(t.querySelector(`.${Ab}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Eb}`), r = e.querySelector(`.${Ob}`), i = e.querySelector(`.${Ab}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || ly(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Rb, ""), r.setAttribute("src", o.url), Zb(e, a.name), $b(e, !0), n.classList.add(vi);
		try {
			let t = await fy([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, vy(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (Qb(e), vy(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(vi);
		}
	}
	async cropAsync(e, t) {
		let n = Wb(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await ub(this.dialogs, t, {
				frame: n,
				size: Gb(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Mb}`), r = ly(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = qb(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await fy([t], (e) => r.element.style.setProperty(Lb, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(vi), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Ub(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), Ub(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${jb}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(oi, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Rb), t || Zb(e, ""));
	}
};
function Hb(e) {
	return e.classList.contains(Tb);
}
function Ub(e, t) {
	e.hasAttribute(Bb) !== t.length > 0 && e.toggleAttribute(Bb, t.length > 0);
}
function Wb(e) {
	let t = e.getAttribute(et);
	return t === "square" || t === "circle" ? t : null;
}
function Gb(e) {
	let t = Number(e.getAttribute(tt));
	return Number.isInteger(t) && t > 0 ? t : Ay;
}
function Kb(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function qb(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${Nb} ${vi}`, Yb(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function Jb(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${Nb} ${vi}`, n.type = "button", n.className = Pb, r.className = Fb, D.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function Yb(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = Pb, i.className = Fb, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, D.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...Xb(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...Xb(e, r, t), r, i);
}
function Xb(e, t, n) {
	return D.write(t, "aria-label", "ui.file.remove"), qv(e, n, D.language);
}
function Zb(e, t) {
	let n = e.querySelector(`.${kb}`);
	n !== null && (Ec(n, null), n.textContent !== t && (n.textContent = t));
}
function Qb(e) {
	let t = e.querySelector(`.${kb}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function $b(e, t) {
	let n = e.querySelector(`.${Eb}`);
	n !== null && D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function ex(e) {
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
var tx = "ui-key-value-action__value", nx = "ui-key-value-action--editable", rx = "ui-text__title", ix = "ui-row-form-", ax = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", ox = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${lu}`), !1), B(this.root, `.${lu}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Dr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && dx(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => ux(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), sx(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${du} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${ix}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${uu} [${Xe}]:not([${on}])`)) t.setAttribute(on, n);
		t.setAttribute(hi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${on}="${t}"], [${hi}="${t}"]`)) n.removeAttribute(on), n.removeAttribute(hi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${uu} [${Xe}]`)) {
			if (xu(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Eu(e), this.judge(e);
	}
	judge(e) {
		let t = lx(e);
		for (let n of e.querySelectorAll(`.${uu} [${Xe}]`)) this.options.validation.judgeShown(n, xu(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${uu} :is(input, textarea, select)`);
		if (n !== null) {
			if (xu(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = lx(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), bu(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && M(e)) {
			cx(e);
			return;
		}
		if (e.defaultPrevented || j(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = hu(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Ei), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${du} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function sx(e) {
	for (let t of e.querySelectorAll(`:scope > .${uu}`)) {
		let e = t.querySelector(ax) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Or, e);
	}
}
function cx(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${lu}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${nx}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Bf) ?? null;
	n === null || O(n) || (e.preventDefault(), n.click());
}
function lx(e) {
	return e.querySelector(`.${tx} .${rx}`)?.textContent?.trim() ?? "";
}
function ux(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function dx(e) {
	let t = e.closest(`.${du} button`), n = t?.closest(`.${du}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var fx = `.ui-button[${Bt}="pressed"]`, px = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(fx);
		t === null || O(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, mx = `${Ou}, [tabindex], [contenteditable], ${Ei}, [${Qe}]`, hx = ":scope > input.ui-field, :scope > textarea.ui-field", gx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Du);
		if (t === null || e.target !== t && e.target.closest(mx) !== null) return;
		let n = t.querySelector(hx);
		if (!xu(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, _x = "data-ui-input-debounce", vx = `input[${_x}], textarea[${_x}]`;
function yx(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(vx);
}
var bx = /* @__PURE__ */ new Set();
function xx() {
	for (let e of bx) if (e.waiting) return !0;
	return !1;
}
function Sx() {
	for (let e of bx) e.commitAll();
}
function Cx(e) {
	for (let t of bx) t.drop(e);
}
var wx = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), bx.add(this);
	}
	get waiting() {
		return this.waits.size > 0;
	}
	wait(e, t, n) {
		let r = this.waits.get(e);
		r !== void 0 && window.clearTimeout(r.timer);
		let i = {
			timer: 0,
			commit: n
		};
		i.timer = window.setTimeout(() => {
			this.composing.has(e) || (this.waits.delete(e), n());
		}, t), this.waits.set(e, i);
	}
	drop(e) {
		let t = this.waits.get(e);
		return t !== void 0 && (window.clearTimeout(t.timer), this.waits.delete(e), !0);
	}
	commitAll() {
		for (let [e, t] of [...this.waits]) window.clearTimeout(t.timer), this.waits.delete(e), t.commit();
	}
	mark(e, t) {
		e.target instanceof Element && (t ? this.composing.add(e.target) : this.composing.delete(e.target));
	}
}, Tx = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new wx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!yx(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(_x));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		yx(e.target) && this.pauses.drop(e.target);
	}
}, Ex = "data-ui-submit-on-enter", Dx = "data-ui-runs-on-enter", Ox = "enter", kx = "escape", Ax = {
	name: Ox,
	registration: { settlesValue: !0 }
}, jx = "ui-commit-in-place", Mx = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(jx, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), mu(t) ? this.runEscape(t, e) : this.leave(t)) : Nx(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Px(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : bu(t) && (e.preventDefault(), Nx(t, e) ? this.runEnter(t, e) : e.key === "Escape" && mu(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(Ox, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		Cx(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = vp(e);
		e.blur(), yp(e, n), e.dispatchEvent(new Event(kx, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(on);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${hi}="${Ui(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = vp(e);
		e.blur(), this.changes === t && this.commit(e), yp(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function Nx(e, t) {
	return Fx(t) && e.hasAttribute(Dx);
}
function Px(e, t) {
	return Fx(t) && e.hasAttribute(Ex) && !e.readOnly && !O(e);
}
function Fx(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/updates/icon-stand-in.ts
var Ix = "icon-stand-in", Lx = ".ui-icon.ui-icon--circle", Rx = "ne-person", zx = "ui-icon--circle", Bx = "ui-icon--image", Vx = "ui-icon-stand-in", Hx = `:scope > .${Vx}`, Ux = "missing", Wx = "failed", Gx = 512, Kx = /* @__PURE__ */ new Map(), qx = /* @__PURE__ */ new Map();
function Jx(e) {
	let t = e.getAttribute(ct), n = Yx(e);
	return n === null ? e.removeAttribute(ct) : t !== n && e.setAttribute(ct, n), $x(e, n !== null), n === Ux ? "show" : t === Ux ? "release" : "keep";
}
function Yx(e) {
	if (!e.classList.contains(zx)) return null;
	if (!e.className.split(" ").some(po)) return Ux;
	let t = e.classList.contains(Bx) ? Xx(e) : null;
	if (t === null) return null;
	let n = Kx.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (Zx(t, e), n === void 0 ? null : Wx) : n.loaded ? null : Wx;
}
function Xx(e) {
	let t = e.style.getPropertyValue(lo).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function Zx(e, t) {
	let n = qx.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	qx.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => Qx(e, !0)), r.addEventListener("error", () => Qx(e, !1)), r.src = e;
}
function Qx(e, t) {
	let n = qx.get(e);
	Kx.delete(e), Kx.set(e, {
		loaded: t,
		at: Date.now()
	}), qx.delete(e), Kx.size > Gx && Kx.delete(Kx.keys().next().value);
	for (let e of n ?? []) Jx(e);
}
function $x(e, t) {
	let n = e.querySelector(Hx);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(ot), i = r !== null && mo(r).length > 0 ? r : Rx;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(mo(i))) return;
	uo(n, i), n.classList.add(Vx);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var eS = `.${nt}`, tS = `img.${rt}`, nS = `:scope > ${tS}`, rS = "%238c8c8c", iS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${rS}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${rS}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${rS}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, aS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", oS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(tS)) (lS(e) || e.complete && e.naturalWidth === 0) && dS(e);
		for (let e of this.root.querySelectorAll(Lx)) Jx(e);
		B(this.root, `${eS}, ${Lx}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: sS
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? cS(t) : Jx(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(tS) && dS(t);
	}
};
function sS(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(tS) : t.matches(eS));
}
function cS(e) {
	let t = e.querySelector(nS);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (uS(t) ? t.getAttribute("src") !== pS(e) && fS(e, t) : (e.removeAttribute(st), $x(e, !1))), lS(t) && dS(t));
}
function lS(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function uS(e) {
	let t = e.getAttribute("src");
	return t === iS || t === aS;
}
function dS(e) {
	if (uS(e)) return;
	let t = e.getAttribute(at);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(st, ""), fS(n, e));
}
function fS(e, t) {
	t.setAttribute("src", pS(e)), $x(e, e.classList.contains(it));
}
function pS(e) {
	return e.classList.contains("ui-image--circle") ? aS : iS;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var mS = "ui-radio-group__input", hS = "ui-radio-group__dot", gS = {
	kind: "radio",
	decorate: _S
};
function _S(e) {
	let t = document.createElement("input");
	t.className = mS, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = hS, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var vS = "data-ui-radio-value", yS = "ui-radio-group", bS = "ui-radio-group__item", xS = "data-ui-radio-group-name", SS = "data-ui-radio-bind-value-id", CS = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${yS}`)]);
		for (let e of this.root.querySelectorAll(`.${yS}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${yS}`));
			else if (!Gh(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(wS));
			for (let e of new Set(t.map((e) => e.closest(`.${yS}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [vS, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${yS}`)) {
			let n = e.getAttribute(xS);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(xS), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(xS, a);
			for (let e of id(r, `.${mS}`, `.${yS}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${yS}`)) n.has(e.getAttribute(xS) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(vS), n = e.getAttribute(xS), r = e.getAttribute(SS);
		for (let i of id(e, `.${mS}`, `.${yS}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Xe, r), i.checked = i.value === t;
			let e = TS(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function wS(e) {
	return e.classList.contains(yS) ? [e] : [...e.querySelectorAll(`.${yS}`)];
}
function TS(e) {
	let t = e.closest(`.${bS}`);
	return t !== null && k(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function ES(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function DS(e) {
	return ES(e).toString(16).padStart(2, "0").toUpperCase();
}
function OS(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (kS(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function kS(e, t, n) {
	return .2126 * AS(e) + .7152 * AS(t) + .0722 * AS(n);
}
function AS(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var jS = "inlineMarkupPlainText", MS = /* @__PURE__ */ new Map([
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
]), NS = [
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
function PS(e) {
	return U(e, NS);
}
var FS = [
	"small",
	"medium",
	"large"
], IS = ["default", "circle"], LS = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], RS = [
	"start",
	"center",
	"end",
	"justify"
], zS = ["nowrap", "wrap"], BS = /* @__PURE__ */ new Map([
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
]), VS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), HS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), US = ["inline", "trailing"], WS = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], GS = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], KS = [
	"small",
	"medium",
	"large"
], qS = [
	"small",
	"medium",
	"large"
], JS = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], YS = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], XS = [
	"filled",
	"tinted",
	"outline"
], ZS = ["light", "dark"], QS = [
	"start",
	"center",
	"end",
	"stretch"
], $S = ["clip", "visible"], eC = [
	"visible",
	"hidden",
	"collapsed"
], tC = [
	"background",
	"raised",
	"tinted",
	"flat"
], nC = ["horizontal", "vertical"], rC = [
	"none",
	"gap",
	"rule"
], iC = [
	"none",
	"one",
	"many"
], aC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], oC = ["stack", "wrap"], sC = ["end", "start"], cC = [
	"disabled",
	"auto",
	"always"
], lC = [
	"disabled",
	"proximity",
	"mandatory"
], uC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], dC = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], fC = ["hex", "rgb"], pC = ["field", "swatch"], mC = [
	"fill",
	"contain",
	"cover",
	"none"
], hC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], gC = ["default", "circle"], _C = ["card", "quiet"], vC = ["uniform", "vignette"], yC = ["linear", "circular"], bC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], xC = [
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
], SC = [
	"None",
	"Shade",
	"Tint"
], CC = /* @__PURE__ */ new Map();
function wC(e) {
	return CC.get(e);
}
function H(e, t, n) {
	return DC(e, TC(t, n), (e) => `${t}${U(e, n)}`);
}
function TC(e, t) {
	return EC(t.map((t) => `${e}${t}`));
}
function EC(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function DC(e, t, n) {
	return CC.set(e, t), [e, n];
}
function OC(e, t, n) {
	return Pm.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var kC = new Map([
	H("colorClass", "ui-color--", NS),
	DC("themeColorClass", TC("ui-color--", NS), (e) => mw(e)),
	DC("iconClass", po, (e) => mo(e)),
	["iconUrlCss", (e) => ao(e)],
	["safeUrl", (e) => Ga(e)],
	["safeImageSource", (e) => eo(e)],
	[jS, (e) => e == null ? void 0 : Do(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	H("iconSizeClass", "ui-icon-size--", FS),
	DC("iconShapeClass", EC(["ui-icon--circle"]), (e) => U(e, IS) === "circle" ? "ui-icon--circle" : ""),
	H("textTypeClass", "ui-text-type--", LS),
	DC("textAppearanceClass", TC("ui-text-type--", LS), (e) => ww(e, "ui-text-type--")),
	DC("textDescriptionTypeClass", TC("ui-text--description-", LS), (e) => ww(e, "ui-text--description-")),
	H("textAlignmentClass", "ui-text--align-", RS),
	H("textWrapClass", "ui-text--", zS),
	H("buttonAlignmentClass", "ui-button--align-", RS),
	H("textBadgePlacementHostClass", "ui-text--badge-", US),
	H("badgeStyleClass", "ui-badge-style--", YS),
	H("badgeFillClass", "ui-badge-fill--", XS),
	DC("badgeColoredClass", EC(["ui-badge--colored"]), (e) => aw(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => hw(e)],
	H("buttonClass", "ui-button--", JS),
	H("surfaceStyleClass", "ui-surface--", tC),
	H("orientationClass", "ui-orientation--", nC),
	H("groupSeparatorClass", "ui-command-bar--separator-", rC),
	["selectionModeAttribute", (e) => U(e, iC)],
	["selectionBackgroundCss", (e) => aw(nw(e, "background"))],
	["selectionForegroundCss", (e) => aw(nw(e, "foreground"))],
	["selectionMarkColorCss", (e) => aw(nw(e, "markColor"))],
	["selectionMarkCss", (e) => iw(nw(e, "mark"))],
	["selectionFontWeightCss", (e) => rw(nw(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => aw(nw(e, "actionBarBackground"))],
	H("itemsViewLayoutClass", "ui-items-view--", oC),
	H("dragHandlePlacementClass", "ui-drag-handle--", sC),
	H("scrollXClass", "ui-scroll-x--", cC),
	H("scrollYClass", "ui-scroll-y--", cC),
	["hostViewport", (e) => WC(e)],
	H("scrollSnapClass", "ui-scroll-snap--", lC),
	H("inputAppearanceClass", "ui-input--", GS),
	H("inputSizeClass", "ui-input--", qS),
	H("buttonSizeClass", "ui-button--", KS),
	H("buttonGroupSizeClass", "ui-button-group--", KS),
	["textInputTypeAttribute", (e) => U(e, uC)],
	["inputModeAttribute", (e) => U(e, dC)],
	["colorTextFormatAttribute", (e) => U(e, fC)],
	["colorInputVariantAttribute", (e) => U(e, pC)],
	["themeNameCss", (e) => U(e, ZS)],
	["alignmentCss", (e) => U(e, QS)],
	["alignmentStretchFallbackCss", (e) => U(e, QS) === "stretch" ? "start" : ""],
	["overflowCss", (e) => U(e, $S)],
	["layoutLengthCss", (e) => GC(e)],
	["thicknessCss", (e) => JC(e)],
	DC("borderEdgeClass", TC("ui-border--", WS), (e) => {
		let t = ZC(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => QC(e)],
	["gridUnitCss", (e) => $C(e)],
	["pixelsCss", (e) => Pw(e)],
	["gridTemplateCss", (e) => ew(e)],
	["colorVariantCss", (e) => Ow(e)],
	["themeColorCss", (e) => aw(e)],
	["themeInkCss", (e) => sw(e)],
	["roleInkCss", (e) => cw(e)],
	["themeOnColorCss", (e) => uw(e)],
	["themeGroundCss", (e) => dw(e)],
	["themeColorInlineCss", (e) => ow(e) ? "" : aw(e)],
	["themeColorCanonical", (e) => Ew(e)],
	["textAppearanceFontSizeCss", (e) => Tw(e, "size")],
	["textAppearanceFontWeightCss", (e) => Tw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Tw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Tw(e, "letterSpacing")],
	...OC("responsiveLayoutLength", "Css", (e, t) => GC(Bm(e, t))),
	...OC("responsiveWidth", "Css", (e, t) => KC(Bm(e, t), "horizontal")),
	...OC("responsiveHeight", "Css", (e, t) => KC(Bm(e, t), "vertical")),
	...OC("responsiveThickness", "Css", (e, t) => JC(Bm(e, t))),
	...OC("responsivePadding", "Css", (e, t) => YC(Bm(e, t))),
	...OC("responsiveThicknessHorizontal", "Css", (e, t) => XC(Bm(e, t), "horizontal")),
	...OC("responsiveThicknessVertical", "Css", (e, t) => XC(Bm(e, t), "vertical")),
	...OC("responsiveRadius", "Css", (e, t) => QC(Bm(e, t))),
	...OC("responsivePixels", "Css", (e, t) => Fw(Bm(e, t))),
	...OC("visibility", "Attribute", (e, t) => Iw(e, t)),
	...OC("gridPlacement", "ColumnCss", (e, t) => tw(Bm(e, t), "column")),
	...OC("gridPlacement", "RowCss", (e, t) => tw(Bm(e, t), "row")),
	...OC("gridPlacement", "ColumnSpanCss", (e, t) => tw(Bm(e, t), "columnSpan")),
	...OC("gridPlacement", "RowSpanCss", (e, t) => tw(Bm(e, t), "rowSpan")),
	H("imageFitClass", "ui-image-fit--", mC),
	DC("expanderVariantClass", EC(["ui-expander--quiet"]), (e) => U(e, _C) === "quiet" ? "ui-expander--quiet" : ""),
	DC("imageShapeClass", EC(["ui-image--circle"]), (e) => U(e, gC) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => PC(e)],
	["backgroundImageAttribute", (e) => PC(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => U(e, hC)],
	["backgroundImageDimCss", (e) => FC(e)],
	["backgroundImageDimModeAttribute", (e) => U(e, vC) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => zC(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => zC(e) ? "" : void 0],
	["positiveCount", (e) => IC(e)?.toString()],
	["nonNegativeCount", (e) => LC(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => LC(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => RC(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => RC(e, (e) => e >= 0)?.toString()],
	["share", (e) => RC(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => IC(e) === void 0 ? void 0 : ""],
	DC("maxLinesClass", EC(["ui-text--max-lines"]), (e) => IC(e) === void 0 ? "" : "ui-text--max-lines"),
	H("progressVariantClass", "ui-progress--", yC),
	["progressValueText", (e) => Nw(e)],
	["textAreaResizeCss", (e) => U(e, bC)],
	H("flyoutPlacementClass", "ui-flyout--", xC),
	["popupPlacementAttribute", (e) => U(e, xC)],
	["tabMenuEntriesAttribute", (e) => MC(e)],
	["markedDaysAttribute", (e) => NC(e)]
]);
function AC(e) {
	let t = kC.get("surfaceStyleClass");
	return tC.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var jC = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function MC(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = jC.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function NC(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function PC(e) {
	return ao(e);
}
function FC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function IC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function LC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function RC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function zC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var BC = [
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
], VC = new Map(BC.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), HC = new Map(BC.map(([e, t]) => [e, t])), UC = /* @__PURE__ */ new Map([[$S, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [hC, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function U(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : UC.get(t)?.get(e)) ?? MS.get(e) ?? Wi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function WC(e) {
	return e == null || U(e, cC) === "disabled" ? void 0 : "parent";
}
function GC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Pw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Pw(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function KC(e, t) {
	if (typeof e != "object" || !e) return GC(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? GC(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function qC(e) {
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
function JC(e) {
	if (e == null) return "";
	let t = qC(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function YC(e) {
	let t = e == null ? void 0 : qC(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function XC(e, t) {
	let n = qC(e);
	return n === void 0 ? "" : Pw(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function ZC(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = Pm.map((t) => Bm(e, t)).filter((e) => e != null), n = new Set(t.map((e) => ZC(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = qC(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function QC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Pw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Pw(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function $C(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Pw(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function ew(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return $C(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return $C(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${$C(e[0])})` : e.map((e) => $C(e)).join(" ");
}
function tw(e, t) {
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
function nw(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function rw(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function iw(e) {
	if (e == null) return "";
	switch (U(e, aC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function aw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Dw(e)) return Ow(e);
	let t = e, n = Ow(t.light), r = Ow(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = BS.get(U(o, NS));
	return s ? `var(${s})` : "";
}
function ow(e) {
	if (typeof e != "object" || !e || Dw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function sw(e) {
	if (ow(e)) {
		let t = VS.get(U(e.style, NS));
		if (t !== void 0) return `var(${t})`;
	}
	return aw(e);
}
function cw(e) {
	if (typeof e != "object" || !e || Dw(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? sw(e) : "";
}
var lw = /* @__PURE__ */ new Set(["background", "surface"]);
function uw(e) {
	if (typeof e != "object" || !e) return "";
	if (Dw(e)) return fw(e) ? "initial" : pw(e);
	let t = e, n = pw(t.light ?? t.dark), r = pw(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && fw(t.light ?? t.dark) && fw(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = U(t.style, NS);
	if (lw.has(i)) return "initial";
	let a = HS.get(i);
	return a ? `var(${a})` : "";
}
function dw(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (Dw(e) ? fw(e) : fw(t.light ?? t.dark) && fw(t.dark ?? t.light)) return "inherit";
	}
	return aw(e);
}
function fw(e) {
	return kw(e)?.[3] === 0;
}
function pw(e) {
	let t = kw(e);
	return t === void 0 ? "" : OS(t[0], t[1], t[2], t[3]);
}
function mw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${U(n, NS)}`;
}
function hw(e) {
	let t = yw(e == null ? "" : String(e).trim(), gw + 1);
	return t > 0 && t <= gw ? "compact" : "";
}
var gw = 2, _w = /[\u0300-\uFFFF]/, vw = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function yw(e, t) {
	if (!_w.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of vw.segment(e)) {
		if (n >= t) break;
		n += bw(r) ? 2 : 1;
	}
	return n;
}
function bw(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < xw.length; e += 2) if (t >= xw[e] && t <= xw[e + 1]) return !0;
	return !1;
}
var xw = [
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
function Sw(e, t) {
	Cw(e, String(t));
}
function Cw(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ue, hw(t)), e.setAttribute(We, "");
}
function ww(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${U(r, LS)}`;
}
function Tw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Pw(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Pw(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Pw(e);
		}
		default: return "";
	}
}
function Ew(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Aw(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${DS(r.rgb >> 16 & 255)}${DS(r.rgb >> 8 & 255)}${DS(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${DS(e)}`;
	}
	let i = jw(r.name);
	return i === null ? "" : `${i}/${Mw(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Dw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Ow(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = kw(e);
	return t === void 0 ? "" : `#${DS(t[0])}${DS(t[1])}${DS(t[2])}${DS(t[3])}`;
}
function kw(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = jw(t.name), i = n ?? (r === null ? void 0 : VC.get(r));
	if (!i) return;
	let a = Mw(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = ES(c * (1 - o)), l = ES(l * (1 - o)), u = ES(u * (1 - o))) : a === "Tint" && (c = ES(c + (255 - c) * o), l = ES(l + (255 - l) * o), u = ES(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function Aw(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = NS[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function jw(e) {
	if (typeof e == "number") return HC.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Mw(e) {
	if (typeof e == "number") return SC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Nw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Pw(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Fw(e) {
	return e == null ? "" : Pw(e);
}
function Iw(e, t) {
	let n = Vm(e, t);
	if (n == null) return;
	let r = U(n, eC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Lw = "data-ui-search-debounce", Rw = "data-ui-search-min-length", zw = "data-ui-search-manual", Bw = "data-ui-search-answered", Vw = "ui-search__input", Hw = "ui-select__list", Uw = "ui-select__option", Ww = 300, Gw = "data-ui-search-waiting", Kw = "ui-search__field", qw = /* @__PURE__ */ new WeakMap(), Jw = {
	name: "search",
	registration: {
		started: (e) => Yw(e.domEvent.target),
		completed: (e) => Xw(e.domEvent.target)
	}
};
function Yw(e) {
	if (!(e instanceof Element)) return;
	let t = qw.get(e) ?? {
		asked: 0,
		timer: null
	};
	qw.set(e, t), !(t.asked++ > 0) && (Zw(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${Kw}`)?.setAttribute(Gw, "");
	}, 300));
}
function Xw(e) {
	if (!(e instanceof Element)) return;
	let t = qw.get(e);
	t === void 0 || --t.asked > 0 || (qw.delete(e), t.timer !== null && window.clearTimeout(t.timer), Zw(e)?.removeAttribute("aria-busy"), e.closest(`.${Kw}`)?.removeAttribute(Gw));
}
function Zw(e) {
	return e.closest(".ui-select")?.querySelector(`.${Hw}`) ?? null;
}
var Qw = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new wx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vw) || e.isComposing === !0) return;
		let t = e.target;
		eT(t);
		let n = t.getAttribute(Lw), r = n === null ? Ww : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : Ww, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || j(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vw)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(zw)) && $w(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function $w(e) {
	let t = Number(e.getAttribute(Rw) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function eT(e) {
	if (e.hasAttribute(Bw)) return;
	let t = e.closest(`.${ji}`), n = t?.querySelector(`.${Hw}`);
	if (t == null || n == null) return;
	let r = $w(e) ? wg(e.value, e) : [], i = tT(n, (e) => r.length === 0 || Eg(Tg(kg(e), e), r));
	iT(t, n, r.length > 0 && i === 0);
}
function tT(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && nT(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Uw)) continue;
		let e = t(a);
		nT(a, e), r ||= e, e && i++;
	}
	return n !== null && nT(n, r), i;
}
function nT(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function rT(e) {
	let t = e.querySelector(`.${Hw}`);
	t !== null && iT(e, t, tT(t, (e) => e.style.display !== "none") === 0);
}
function iT(e, t, n) {
	let r = t.querySelector(`:scope > [${Pt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Mt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Pt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var aT = 500, oT = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > aT) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Tg(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Tg(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function sT(e) {
	return j(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var cT = "data-ui-select-value", lT = "data-ui-select-placement", uT = "ui-select--open", dT = "ui-select__trigger-content", fT = "data-ui-select-content", pT = "ui-select__placeholder", mT = "ui-input__affix-icon--prefix", hT = "ui-select__popup", gT = "ui-select__list", _T = "ui-select__option", vT = "ui-select__value-input", yT = "data-ui-select-clear", bT = "ui-select--clearable", xT = "ui-search", ST = "ui-search__input", CT = "data-ui-active", wT = "data-ui-list-keyboard", TT = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), ET = "ui-multi-select", DT = "ui-multi-select__chips", OT = "ui-multi-select__chip", kT = "ui-multi-select__chip-label", AT = "ui-multi-select__chip-remove", jT = "ui-badge-select", MT = "ui-text__badge", NT = "ui-badge", PT = "ui-badge__icon", FT = "ui-badge__text", IT = "ui-badge-style--info ui-text-type--overline", LT = "ui-text-type--overline", RT = "data-ui-select-chip", zT = "data-ui-select-chips", BT = "data-ui-select-max", VT = "data-ui-select-free-text", HT = "ui-multi-select__entry", UT = "data-ui-select-tag-entry", WT = [
	cT,
	oi,
	BT
], GT = ["class", b], KT = [...GT, "style"];
function qT(e) {
	return e === null || A(e) || O(e);
}
function JT(e) {
	return e.classList.contains(ET);
}
function YT(e) {
	return e.classList.contains(xT);
}
function XT(e) {
	return YT(e) ? e.querySelector(`.${ST}`) : null;
}
function ZT(e) {
	return e.hasAttribute(VT) ? e.querySelector(`:scope > .${Di} .${HT}`) : null;
}
function QT(e) {
	return XT(e) ?? ZT(e);
}
function $T(e) {
	return ZT(e) ?? e.querySelector(".ui-select__trigger");
}
function eE(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(HT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function tE(e) {
	return id(e, `.${hT} .${_T}`, `.${ji}`);
}
function nE(e) {
	let t = tE(e).filter((e) => !k(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(CT)) ?? null;
}
function rE(e) {
	for (let t of id(e, `.${gT}`, `.${ji}`)) {
		let e = t.querySelector(`:scope > .${_T}[${CT}]:not([${$r}])`) !== null;
		t.hasAttribute(wT) !== e && t.toggleAttribute(wT, e);
	}
}
function iE(e) {
	return e === null ? null : kg(e);
}
function aE(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var oE = class {
	root;
	popups = new p_({
		show: ({ owner: e }) => e.classList.add(uT),
		hide: ({ owner: e }) => {
			e.classList.remove(uT), this.markActive(e, null);
			let t = e.querySelector(`.${hT}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => QT(e) === null
	});
	typeAhead = new oT();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Gh(n) || CE(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: WT,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${ji}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${yT}], .${AT}`) !== null || fE(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (qT(r)) return;
		this.releaseRefusal(r);
		let i = nd(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = eE(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !j(e) ? eE(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(UT) === "first-suggestion" && tE(t.select).some((e) => e.hasAttribute(CT)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = eE(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || qT(t.select) || !ed(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, td(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Ju(e.getAttribute(oi)), a = Yu(e.getAttribute(BT)), o = rd(i, n.map((t) => ({
			text: t,
			key: pE(e, t) ?? t
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
		eT(t);
		let n = t.value.trim().length > 0, r = n ? cE(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(UT) === "first-suggestion" && (this.markActive(e, i), i !== null && uE(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), rE(e), JT(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(cT);
		this.decorateOptions(e);
		let n = t === null ? null : tE(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${pT}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of tE(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${vT}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), rT(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(jT) ? KT : GT;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = Ju(e.getAttribute(oi)), n = new Set(t), r = Xu(t, Yu(e.getAttribute(BT)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = tE(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = ZT(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(jT);
		gE(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? mE(t) : void 0;
			return {
				key: e,
				label: hE(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== qT(e) && (o.readOnly = qT(e));
		let l = e.querySelector(`.${pT}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${vT}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(oi, d), rT(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Di}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${dT}`), a = i?.getAttribute(fT) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(fT), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && YT(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = dT;
			let e = r.querySelector(`:scope > .${mT}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return aE(s), Jh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of tE(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${_T}`);
		t === null || n === null || n.hasAttribute(CT) || k(n) || O(n) || n.closest(".ui-select") !== t || (QT(t) === null && (N(tE(t).filter((e) => !k(e)), n), cp(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${AT}`);
		if (t !== null) {
			let n = t.closest(`.${ji}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), qT(n) || this.removeChosen(n, t.closest(`.${OT}`)?.getAttribute(RT) ?? null));
			return;
		}
		let n = e.target.closest(`[${yT}]`);
		if (n !== null) {
			let t = n.closest(`.${ji}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), qT(t) || (this.clearValue(t), sE(t)));
			return;
		}
		let r = e.target.closest(`.${Di}`);
		if (r !== null) {
			let t = r.closest(`.${ji}`);
			if (qT(t)) return;
			e.preventDefault();
			let n = t === null ? null : ZT(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${_T}`);
		if (i === null) return;
		let a = i.closest(`.${ji}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(tE(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.openSelect !== null && rE(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_T}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${ji}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && M(e, { alt: !0 })) {
			e.preventDefault();
			let n = nE(t);
			return n !== null && !JT(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !TT.has(e.key) || !M(e) || (e.key === "Home" || e.key === "End") && xu(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = eE(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (qT(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? cE(r).find((e) => e.hasAttribute(CT)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, td(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, td(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${DT} > .${OT}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(RT)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = dE(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${AT}`) ?? (n === 1 ? $T(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		eT(t);
		let r = cE(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(AT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !JT(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), qT(n)) return !0;
				let r = dE(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(RT) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(RT) ?? null);
				let o = a === null ? null : dE(n).find((e) => e.getAttribute(RT) === a) ?? null;
				return o !== null && o.querySelector(`.${AT}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || qT(t)) return !1;
		e.preventDefault();
		let n = XT(t);
		n !== null && eT(n);
		let r = cE(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = sT(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(_T))) return !1;
		let r = n.closest(`.${ji}`), i = r !== null && r === this.openSelect;
		if (r === null || qT(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = XT(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = cE(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(CT)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => iE(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (N(tE(r).filter((e) => !k(e)), c), uE(r, c), R(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !M(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${ji}`);
		return t === null || t === this.openSelect || !t.classList.contains(bT) || qT(t) || e.target !== $T(t) || e.key === "Backspace" && JT(t) || (ZT(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !JT(t) || qT(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${DT} > .${OT}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(RT)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ST) || !t.contains(e.target) ? null : cE(t).find((e) => e.hasAttribute(CT)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = QT(e), i = ZT(e);
		r !== null && !t && eT(r), rT(e);
		let a = e.querySelector(`.${Di}`), o = e.querySelector(`.${hT}`), s = e.querySelector(`.${gT}`) ?? o, c = e.getAttribute(lT);
		if (a === null || o === null || s === null) return;
		let l = Ki(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Wm(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), wE(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = cE(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && tp()) {
			N(n, null), this.markActive(e, null), sE(e);
			return;
		}
		let i = r ?? n[0];
		N(n, i), this.markActive(e, i, tp()), uE(e, i), R(i);
	}
	initializeSearch(e, t, n, r) {
		let i = tE(e), a = cE(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || tp() ? null : a[0] ?? null);
		N(i, null), this.markActive(e, o, tp()), o !== null && uE(e, o), !np() && (R(t), t.select());
	}
	initializeEntry(e, t) {
		N(tE(e), null), this.markActive(e, t), t !== null && uE(e, t);
	}
	moveCurrent(e, t) {
		let n = tE(e).filter((e) => !k(e)), r = Cf(t, n, nE(e), "vertical");
		r !== null && (QT(e) === null ? zu(n, r) : uE(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of tE(e)) r === t ? r.setAttribute(CT, "") : r.hasAttribute(CT) && r.removeAttribute(CT), rp(r, r === t && n);
		rE(e);
		let r = QT(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Ki(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || qT(e)) return;
		if (JT(e)) {
			let r = Zu(Ju(e.getAttribute(oi)), n, Yu(e.getAttribute(BT)));
			this.markActive(e, t, tp()), r !== null && this.writeChosen(e, r);
			let i = ZT(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(cT) === n) {
			this.close();
			return;
		}
		e.setAttribute(cT, n), this.sync(e);
		let r = e.querySelector(`.${vT}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Qu(Ju(e.getAttribute(oi)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${OT}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && $T(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(oi) : e.setAttribute(oi, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${vT}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (JT(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(cT)) return;
		e.removeAttribute(cT), this.sync(e);
		let t = e.querySelector(`.${vT}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function sE(e) {
	let t = e.querySelector(`.${Di}`), n = $T(e);
	t !== null && n !== null && !t.contains(document.activeElement) && R(n);
}
function cE(e) {
	return tE(e).filter((e) => lE(e) && !k(e) && !O(e));
}
function lE(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function uE(e, t) {
	let n = e.querySelector(`.${gT}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function dE(e) {
	return [...e.querySelectorAll(`.${DT} > .${OT}`)];
}
function fE(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && ZT(t) !== null && !e.classList.contains(HT);
}
function pE(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of tE(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || iE(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function mE(e) {
	return e?.querySelector(`.${MT}`) ?? null;
}
function hE(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${FT}`)?.textContent ?? null : null) ?? iE(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function gE(e, t) {
	let n = e.querySelector(`.${DT}`);
	if (n === null) return;
	n.hasAttribute(zT) !== t.length > 0 && n.toggleAttribute(zT, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${OT}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(RT) === t[n].key && e.querySelector(`.${kT}`)?.textContent === t[n].label && (t[n].badge === void 0 || xE(e) === xE(t[n].badge ?? bE()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(_E));
	}
}
function _E(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? vE(e.label) : yE(e.label, e.badge);
	return n.classList.add(OT), n.setAttribute(RT, e.key), t.className = AT, t.type = "button", t.tabIndex = -1, D.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function vE(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = kT, n.textContent = e, t.append(n), t;
}
function yE(e, t) {
	let n = t === null ? bE() : t.cloneNode(!0);
	aE(n), n.classList.remove(MT);
	let r = n.querySelector(`:scope > .${FT}`);
	return r?.classList.add(kT), r !== null && !n.hasAttribute("data-ui-badge-text") && Cw(n, e), n;
}
function bE() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${NT} ${IT}`, t.className = `${PT} ui-icon`, n.className = `${FT} ${LT}`, e.append(t, n), e;
}
function xE(e) {
	let t = e.querySelector(`:scope > .${PT}`);
	return `${SE(e)}|${t === null ? "" : SE(t)}`;
}
function SE(e) {
	return `${[...e.classList].filter((e) => e !== OT && e !== MT).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ge)}`;
}
function CE(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${ji}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === cT || e.attributeName === "data-ui-selected-keys" || e.attributeName === BT)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(NT) !== !0) return;
	let r = n?.closest(`.${hT}`)?.closest(`.${ji}`);
	r != null && t.add(r);
}
function wE(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var TE = class {
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
		xu(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
	}
	handleChange(e) {
		let t = this.field;
		t !== null && e.target === t && (t.value === this.committed ? e.stopImmediatePropagation() : this.committed = t.value);
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
}, EE = "textarea.ui-text-area__field", DE = "data-ui-text-area-grow";
function OE() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var kE = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(EE) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(EE)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Pa(e.components, EE));
		}), B(this.root, EE, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [DE]
		}, (e) => {
			this.fitAll(Pa(e, EE));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(DE)) {
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
function AE(e) {
	let t = jE(e.getAttribute("min"), 0), n = jE(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, jE(r, 1))
	};
}
function jE(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function ME(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function NE(e, t) {
	return PE(t.min + e * (t.max - t.min), t);
}
function PE(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, FE(t.min + r * t.step, t);
}
function FE(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(IE(t.step), IE(t.min)))));
}
function IE(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function LE(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function RE(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return zE(o, i);
	let s = (o - i.min) / i.step;
	return zE(FE(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function zE(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var BE = "ui-slider__input", VE = "ui-slider__input--end", HE = "ui-slider__input--held", UE = "ui-slider__value", WE = "ui-slider__bubble", GE = "ui-slider__track", KE = "ui-slider__thumb-anchor", qE = "ui-slider", JE = "ui-slider--range", YE = "ui-orientation--vertical", XE = "--ui-slider-fraction", ZE = "--ui-slider-end-fraction", QE = 6, $E = "Value", eD = "EndValue", tD = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), nD = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Ag({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${JE} .${GE}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (tD.has(e.propertyName)) for (let t of Pa(e.components, `.${BE}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (iD(t) ? eD : $E) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = rD(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = rD(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = rD(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || sD(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(BE)) return;
		let t = e.target;
		if (this.cancelled.delete(t), sD(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = aD(t);
		if (n !== null) {
			let e = oD(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${BE}:not(.${VE})`), r = e.querySelector(`.${VE}`);
		if (n === null || r === null) return null;
		let i = NE(ME(e.getBoundingClientRect(), t, cD(e), lD(e)), AE(n)), a = LE(i, Number(n.value), Number(r.value));
		if (sD(n)) return R(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? R(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${GE}`);
		if (n === null) return;
		let r = NE(ME(n.getBoundingClientRect(), t, cD(n), lD(n)), AE(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(HE), R(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = aD(e), r = n === null ? String(t) : oD(e, t, n);
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
		e.held?.classList.remove(HE), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = uD(e);
		t !== null && th(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: QE
		});
	}
	releaseBubble(e) {
		ph(uD(e)?.bubble);
	}
	writeReadings(e) {
		let t = iD(e), n = e.closest(`.${GE}`)?.parentElement ?? e.parentElement, r = t ? `.${UE}--end, .${WE}--end` : `.${UE}:not(.${UE}--end), .${WE}:not(.${WE}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${GE}`)?.style.setProperty(t ? ZE : XE, String(dD(e))), e.matches(`:active, :focus-visible, .${HE}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function rD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(BE) ? e : null;
}
function iD(e) {
	return e.classList.contains(VE);
}
function aD(e) {
	return e.closest(`.${JE} .${GE}`)?.querySelector(iD(e) ? `.${BE}:not(.${VE})` : `.${VE}`) ?? null;
}
function oD(e, t, n) {
	let r = Number(e.closest(`.${qE}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(RE(t, iD(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, AE(e)));
}
function sD(e) {
	return A(e) || O(e);
}
function cD(e) {
	return e.closest(`.${qE}`)?.classList.contains(YE) === !0;
}
function lD(e) {
	let t = e.querySelector(`.${KE}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : cD(e) ? t.height : t.width;
}
function uD(e) {
	if (!(e instanceof Element) || !e.classList.contains(BE)) return null;
	let t = e.closest(`.${GE}`), n = iD(e), r = t?.querySelector(n ? `.${WE}--end` : `.${WE}:not(.${WE}--end)`) ?? null, i = t?.querySelector(n ? `.${KE}--end` : `.${KE}:not(.${KE}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: cD(e)
	};
}
function dD(e) {
	let { min: t, max: n } = AE(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var fD = {
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
}, pD = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], mD = [
	"$n",
	"n$",
	"$ n",
	"n $"
], hD = [
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
], gD = [
	"n %",
	"n%",
	"%n",
	"% n"
], _D = [
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
], vD = /[1-9]/;
function yD(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return fD;
	try {
		return {
			...fD,
			...JSON.parse(t)
		};
	} catch {
		return fD;
	}
}
function bD(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = SD(t);
	if (r === null) return CD(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = wD(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return xD(e, t) ? kD(pD[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = wD(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return xD(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = TD(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return xD(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = wD(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return kD(xD(e, t) ? hD[n.currencyNegativePattern] ?? "-$n" : mD[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = wD(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return kD(xD(e, t) ? _D[n.percentNegativePattern] ?? "-n %" : gD[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return CD(e, n);
	}
}
function xD(e, t) {
	return e < 0 && vD.test(t);
}
function SD(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function CD(e, t) {
	let { integer: n, fraction: r } = ED(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function wD(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = TD(e, t, n);
	return n === 0 ? OD(o, r, i) : `${OD(o, r, i)}${a}${s}`;
}
function TD(e, t, n) {
	let { integer: r, fraction: i } = ED(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? DD(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function ED(e, t) {
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
function DD(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function OD(e, t, n) {
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
function kD(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var AD = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function jD(e) {
	if (!AD.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var MD = {
	readCulture: yD,
	format: bD,
	parseInvariant: jD
}, ND = /^-?(\d+(\.\d*)?|\.\d+)$/;
function PD(e, t, n) {
	if (!ND.test(e)) return e;
	let r = n.thousands === !1 ? VD(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return bD(i, n.thousands === !0 ? FD(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return bD(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function FD(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function ID(e, t, n) {
	return ND.test(e) ? (BD(n) ? HD(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function LD(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = BD(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!ND.test(d)) return null;
	let f = a ? HD(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function RD(e, t, n, r, i) {
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
function zD(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function BD(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function VD(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function HD(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var UD = "ui-number-input", WD = "ui-number-input__field", GD = "data-ui-number-no-decimals", KD = "data-ui-number-no-negative", qD = "data-ui-number-thousands", JD = "data-ui-number-no-thousands", YD = "data-ui-number-trim-zeros", XD = "data-ui-number-step", ZD = "data-ui-number-min", QD = "data-ui-number-max", $D = "data-ui-number-step-direction", eO = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), tO = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${WD}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Pa(e.components, `.${WD}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${WD}`)));
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
		let t = nO(e);
		if (t !== null) return this.keptValue(t) ?? sO(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(YD) ? zD(t) : t, r = yD(e), i = e === document.activeElement ? ID(n, r, cO(e)) : aO(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = nO(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(GD), r = !t.hasAttribute(KD), i = t.selectionStart ?? t.value.length, a = RD(t.value, i, yD(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = nO(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = nO(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : sO(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(YD) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = zD(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = nO(e.target);
		if (t === null) return;
		let n = sO(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = nO(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = ID(t, yD(e), cO(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + $D + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${WD}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute($D) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = eO.get(e.key);
		if (t === void 0 || !M(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = nO(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(XD) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : sO(e) ?? "0") || 0) + n * t, i = e.getAttribute(ZD), a = e.getAttribute(QD);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, lO(r)), this.show(e);
	}
};
function nO(e) {
	return e instanceof HTMLInputElement && e.classList.contains(WD) ? e : null;
}
function rO(e, t) {
	let n = e.classList.contains(UD) ? e.querySelector(`.${WD}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = iO(n, ZD), a = iO(n, QD);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: aO(n, i, yD(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: aO(n, a, yD(n)) }
	} : null;
}
function iO(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function aO(e, t, n) {
	return PD(t, n, {
		format: cO(e),
		thousands: oO(e)
	});
}
function oO(e) {
	return e.hasAttribute(qD) ? !0 : !e.hasAttribute(JD) && null;
}
function sO(e) {
	return LD(e.value, yD(e), cO(e));
}
function cO(e) {
	return e.closest(`.${UD}`)?.getAttribute("data-ui-number-format") ?? null;
}
function lO(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function uO(e, t) {
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
function W(e) {
	switch (e.getAttribute(Wt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function dO(e) {
	let t = W(e) === "windowed" ? fO(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function fO(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function pO(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var mO = "application/x-ne-items", hO = null, gO = null;
function _O(e, t, n) {
	let r = e.getAttribute(pe), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(L),
		effects: i,
		source: e.getAttribute(me)
	};
}
function vO(e, t) {
	let n = bd(t);
	return n.includes(e) ? n.filter((t) => t === e || bO(t)) : [e];
}
function yO(e) {
	return !Gc(e, "data-ui-undraggable") && !k(e);
}
function bO(e) {
	return yO(e) && I(e) !== null;
}
function xO(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function SO(e, t, n = null) {
	hO = t, gO = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(mO, t.kind);
}
function CO(e) {
	return hO !== null && e.dataTransfer?.types.includes(mO) === !0 ? hO : null;
}
function wO() {
	let e = gO;
	hO = null, gO = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var TO = "data-ui-non-item";
function G(e) {
	let t = [];
	for (let n of e.children) EO(n) || t.push(n);
	return t;
}
function EO(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function DO(e) {
	return e === null ? [] : [e];
}
function OO(e) {
	return e.querySelector(`:scope > [${Pt}]`);
}
function kO(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(bi));
	let a = OO(e);
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
	c.setAttribute(Pt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var AO = { ok: !1 }, jO = {
	ok: !0,
	value: null
}, MO = null;
function NO(e) {
	MO = e;
}
function PO(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Zi(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Zi(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return AO;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return AO;
			let t = a[u];
			if (u++, Zi(t.kind) === "Dynamic") {
				let n = RO(e, t.componentId);
				if (!n.ok) return AO;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return AO;
				let e = GO(s, t.value);
				if (!e.ok) return AO;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return AO;
		if (l) {
			let e = VO(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? AO : {
		ok: !0,
		value: s,
		scope: c
	};
}
function FO(e, t, n) {
	for (let r of t ?? []) {
		if (Zi(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function IO(e) {
	let t = BO(e, "IsContent");
	return t.ok && t.value === !0;
}
var LO = /* @__PURE__ */ new Set();
function RO(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return LO.has(n) || (LO.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), AO;
}
function zO(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = BO(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function BO(e, t) {
	return VO(e, t, !0);
}
function VO(e, t, n) {
	if (e == null) return AO;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return AO;
	let r = e, i = HO(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? AO : (n && MO?.(r, t), jO);
}
function HO(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = UO(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function UO(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function WO(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Zi(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Zi(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = w(e.componentId);
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
function GO(e, t) {
	if (e == null || t == null) return AO;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : AO;
	if (typeof t != "string") return AO;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (qO(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return AO;
}
function KO(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (qO(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function qO(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var JO = /* @__PURE__ */ new WeakMap();
function YO(e) {
	let t = XO(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = JO.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = ZO(e, n);
	return JO.set(t, {
		text: n,
		query: i
	}), i;
}
function XO(e) {
	let t = e.closest(C);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function ZO(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function QO(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = YO(e);
	if (a === void 0 && o === null) for (let t of G(e)) t.classList.remove(bi);
	else for (let n of G(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(bi)) : n.classList.toggle(bi, !$O(a, e, i, o));
	}
}
function $O(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => ik(e, t, n)) && (r?.filters ?? []).every((e) => _m(zO(t, e.itemProperty), e.operator, e.value));
}
function ek(e, t, n = null) {
	return (e?.filters ?? []).some((e) => ak(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function tk(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => ak(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function nk(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => rk(n.getItemValue(e), n.getItemValue(r), t));
}
function rk(e, t, n) {
	for (let r of n) {
		let n = ok(vm(zO(e, r.itemProperty)), vm(zO(t, r.itemProperty)));
		if (n !== 0) return na(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function ik(e, t, n) {
	if (!ak(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return _m(zO(t, e.itemProperty), e.operator, r);
}
function ak(e, t, n, r) {
	return e == null || _m(r.get(e, []), t, n);
}
function ok(e, t) {
	if (e === t) return 0;
	let n = ck(e), r = ck(t);
	if (n !== r) return n - r;
	if (n === sk.Nothing) return 0;
	if (n === sk.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var sk = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function ck(e) {
	return e == null ? sk.Nothing : typeof e == "number" ? Number.isNaN(e) ? sk.Nothing : sk.Number : typeof e == "string" && e.trim().length === 0 ? sk.Nothing : Number.isNaN(Number(e)) ? sk.Text : sk.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var lk = /* @__PURE__ */ new WeakMap();
function uk(e, t) {
	let n = lk.get(e), r = n === void 0 ? [...t] : dk(n, t);
	return lk.set(e, r), r;
}
function dk(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function fk(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function pk(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function mk(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function hk(e, t, n) {
	return pk(e, t), fk(e, t, n);
}
function gk(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function _k(e, t) {
	lk.set(e, [...t]);
}
function vk(e) {
	lk.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var yk = "ui-announcer", bk = 7e3, xk = null;
function Sk(e, t = "polite") {
	(xk ?? Ck(document.body)).announce(e, t);
}
function Ck(e) {
	return xk = new Tk(e), xk;
}
function wk(e, t) {
	Sk({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var Tk = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), bk), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${yk}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = yk, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, Ek = "ui-tab-item";
function Dk(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Ok(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? Dk(e).parentElement : null;
}
function kk(e, t) {
	return Gc(Dk(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Ak = ".ui-items-view__item, .ui-table__row", jk = "ui-row--dragging", Mk = "--ui-row-drop-offset", Nk = "move", Pk = ".ui-items-view--wrap", Fk = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function Ik(e, t) {
	Of(e, Nk, { index: t });
}
function Lk(e) {
	return {
		name: Nk,
		registration: {
			dynamicParameters: (e) => {
				let t = Rk(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...uO((t) => e === void 0 ? null : zk(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function Rk(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function zk(e, t) {
	let n = Rk(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = Ok(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(Ak), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, L(i), n);
	return o === null ? null : { pending: o };
}
var Bk = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new Vk(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : I(t.row);
		if (t === null || n === null) return;
		let r = qk(t.root, t.row);
		if (r === null ? !Jk(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (tf(t.root, tA(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(ld), n = t?.parentElement ?? null, r = n?.closest(F) ?? null;
		if (t === null || n === null || r === null || !t.matches(Ak) || !n.hasAttribute("data-ui-items-host") || O(r) || !bO(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Ia(e);
		return this.services === void 0 || n === null ? !1 : tk(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, YO(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : I(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = _O(t.root, n, vO(t.row, tA(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => I(e) ?? e);
		lv(e, t.root, r, jk, L(t.row), a, xO(i, t.moves)), SO(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = Gk(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : $k(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && Zk(this.marked.place, i) && this.marked.offset === a) && (nA(t.root, i, a), this.marked = {
			view: n,
			place: i,
			offset: a
		});
	}
	dropView() {
		this.views.drop(), this.marked = null;
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n, r) {
		if (Yk(t) !== Yk(e.row)) return null;
		let i = Uk(r ?? Kk(e.host, this.services?.keysOf), L(e.row), L(t), n);
		return i === null ? null : i + dO(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && fv(e, t.host) && (nA(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = Gk(t.host, e.target, e, Xk(t.root, t.host), tA(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Ik(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (uv(e.root, jk), nA(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !M(e, { alt: !0 }) || !Fk.has(e.key) || !(e.target instanceof Element)) return;
		let t = Kd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Od(t.root), r = n === null ? null : Xk(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = tA(n), o = Xd(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(Pk) ? Tf(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (Ik(o, l), wk(l + 1, fO(n, "data-ui-window-total") ?? dO(n) + Kk(n, this.services?.keysOf).length));
	}
}, Vk = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = tA(t);
		return this.view = {
			host: t,
			flow: Xk(e, t),
			rows: n,
			boxes: n.map((e) => (I(e) ?? e).getBoundingClientRect()),
			order: Kk(t, this.keysOf)
		}, this.changes?.observe(t, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [
				"class",
				"hidden",
				Lt,
				"style"
			]
		}), this.view;
	}
	drop() {
		this.view = null, this.changes?.disconnect();
	}
	hear(e) {
		e.some(Hk) && this.drop();
	}
};
function Hk(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function Uk(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = Wk(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function Wk(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function Gk(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(ld);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(ld) ?? null;
	if (o ??= eA(i, n, a), o === null) return null;
	let s = (I(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && Qk(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function Kk(e, t) {
	switch (W(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(L)];
		case "windowed": return G(e).map(L);
		default: return uk(e, G(e)).map(L);
	}
}
function qk(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Jk(e, t) {
	return Fu(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Yk(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Xk(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function Zk(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function Qk(e, t, n) {
	if (Yk(e) !== Yk(t)) return !1;
	if (!n.across) return !0;
	let r = (I(e) ?? e).getBoundingClientRect(), i = (I(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function $k(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Qk(t.anchor, r, n)) return -1;
	let i = (I(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (I(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function eA(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (I(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function tA(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(ld) && I(e) !== null);
}
function nA(e, t, n = 0) {
	let r = t === null ? null : I(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Mk));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Mk) !== i && r.style.setProperty(Mk, i);
}
function rA(e) {
	e.classList.remove(jk), e.querySelector(`:scope > [${y}]`)?.classList.remove(jk);
}
//#endregion
//#region src/interactions/tree-drop.ts
var iA = "--ui-tree-drop-depth";
function aA(e) {
	return e.querySelector(`.${cr}`);
}
function oA(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute(br);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function sA(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || oA(n, aA(n));
}
function cA(e, t) {
	let n = aA(e);
	if (oA(e, n)) return L(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return sA(r, t) ? r : null;
}
function lA(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${lr}]`)) n !== t && (n.removeAttribute(lr), n.style.removeProperty(iA));
	t !== null && (t.setAttribute(lr, n), r === void 0 ? t.style.removeProperty(iA) : t.style.setProperty(iA, String(r)));
}
function uA(e, t, n) {
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
function dA(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = fA(e, r, n);
	return i === null || !pA(e, i.parent) ? null : i;
}
function fA(e, t, n) {
	if (n === "in") {
		let n = uA(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = uA(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: hA(e, n, t.parent, !1)
		};
	}
	let r = mA(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function pA(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function mA(e, t) {
	return e.filter((e) => e.parent === t);
}
function hA(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = mA(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function gA(e, t, n) {
	let r = mA(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? hA(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var _A = "drop:", vA = "ui-row--cut", yA = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, bA = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, xA = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function SA(e) {
	return {
		dynamicParameters: (e) => {
			let t = CA(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...uO((t) => wA(e, t), (t) => e?.settle(t))
	};
}
function CA(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function wA(e, t) {
	let n = CA(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var TA = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new Vk(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = CO(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = EA(t, r, DA(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || O(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Od(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? Gk(r, t, n, i.flow, i.rows, i.boxes) : OA(i.rows);
			return {
				index: ((a === null ? null : Wk(i.order, L(a.anchor), a.side)) ?? i.order.length) + dO(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : nA(e, a, $k(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = kA(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Od(e) : AA(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => lA(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), pv(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), pv(e, !1), e.matches(".ui-items-view, .ui-table") ? nA(e, null) : e.classList.contains("ui-tree") && lA(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && fv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), wO(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && W(e.host) === "plain" && W(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(_A + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), wO();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !j(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : Su(e.target) || (zl(xA, e) ? this.paste(e, e.target) : zl(yA, e) ? this.take(e, e.target, !0) : zl(bA, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (I(e) ?? e).classList.remove(vA);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : EA(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Gd(t), a = i === null ? null : Od(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = tA(a), s = i.row ?? Xd(o), c = s === null || !bO(s) ? null : _O(i.root, a, vO(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (I(e) ?? e).classList.add(vA);
	}
};
function EA(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function DA(e) {
	return Jl() ? e.altKey : e.ctrlKey;
}
function OA(e) {
	let t = Zd(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function kA(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : cA(n, (t) => AA(e, t));
}
function AA(e, t) {
	return e.querySelector(`.${sr}[${b}="${Ui(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function jA(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = IA(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < LA(e.start).getTime() ? {
		start: IA(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: IA(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function MA(e, t, n) {
	if (t === null || n === null) return !1;
	let r = LA(e).getTime();
	return r > LA(t).getTime() && r < LA(n).getTime();
}
function NA(e, t) {
	return !t && e.start !== null && e.end !== null && LA(e.start).getTime() < LA(e.end).getTime();
}
function PA(e, t, n) {
	return !n && MA(e, t.start, t.end);
}
function FA(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function IA(e, t) {
	return ys(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function LA(e) {
	return ys(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", RA = "ui-calendar", zA = `.${K}, .${RA}`, BA = "ui-temporal-input__value-input", VA = "ui-temporal-input__end-value-input", HA = "data-ui-temporal-range", UA = "data-ui-temporal-end", WA = "data-ui-temporal-mode", GA = "data-ui-temporal-format", KA = "data-ui-temporal-default-format", qA = "data-ui-temporal-min", JA = "data-ui-temporal-max", YA = "data-ui-temporal-step", XA = "data-ui-temporal-step-unit", ZA = "data-ui-temporal-marked-days", QA = "data-ui-temporal-marked-only", $A = "data-ui-temporal-page-culture", ej = "data-ui-temporal-months", tj = "data-ui-temporal-months-genitive", nj = "data-ui-temporal-months-short", rj = "data-ui-temporal-daynames", ij = "data-ui-temporal-weekdays", aj = "data-ui-temporal-first-day", oj = "data-ui-temporal-am", sj = "data-ui-temporal-pm", cj = /* @__PURE__ */ new Set([
	GA,
	KA,
	qA,
	JA,
	ej,
	oj,
	sj,
	ZA,
	QA
]), lj = 2e3;
function uj(e) {
	let t = e.getAttribute(WA);
	return t === "time" || t === "date-time" ? t : "date";
}
function dj(e) {
	let t = e.getAttribute(GA);
	return t === null || t.trim().length === 0 ? e.getAttribute(KA) ?? "" : t;
}
function fj(e) {
	let t = e.getAttribute(XA), n = Math.max(1, Math.trunc(Number(e.getAttribute(YA))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function pj(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function mj(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function hj(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function gj(e) {
	return {
		monthNames: _j(e, ej),
		monthGenitiveNames: _j(e, tj),
		abbreviatedMonthNames: _j(e, nj),
		dayNames: _j(e, rj),
		abbreviatedDayNames: _j(e, ij),
		amDesignator: e.getAttribute(oj) ?? "AM",
		pmDesignator: e.getAttribute(sj) ?? "PM"
	};
}
function _j(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function vj(e, t) {
	e.hasAttribute($A) && (Sj(e, tj, t.monthGenitiveNames.join("|")), Sj(e, nj, t.abbreviatedMonthNames.join("|")), Sj(e, rj, t.dayNames.join("|")), Sj(e, ij, t.abbreviatedDayNames.join("|")), Sj(e, ej, t.monthNames.join("|")), Sj(e, oj, t.amDesignator), Sj(e, sj, t.pmDesignator), Sj(e, KA, xj(uj(e), fj(e), t)));
}
function yj(e) {
	for (let t = 0; t < e.length;) {
		let n = ps(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function bj(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Ps(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function xj(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : is(n, r);
}
function Sj(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Cj(e) {
	return e.hasAttribute(HA);
}
function wj(e) {
	return e !== null && e.hasAttribute(UA);
}
function Tj(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = Ej(e, t);
	return n === null ? null : qj(n.value, uj(e));
}
function Ej(e, t) {
	return e.querySelector(`.${t ? VA : BA}`);
}
function Dj(e, t) {
	let n = e.getAttribute(t) ?? "", r = qj(n, uj(e)), i = Lj(n);
	if (r === null || i === null) return r;
	let a = Ij(e, !1), o = /* @__PURE__ */ new Date(Oj(r) - kj(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + kj(a) * 6e4);
		return ys(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return Aj(e) ? r : o;
}
function Oj(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function kj(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function Aj(e) {
	return (Ej(e, !1)?.value.trim() ?? "").length > 0 || (Ej(e, !0)?.value.trim() ?? "").length > 0;
}
function jj(e) {
	let t = Dj(e, qA), n = Dj(e, JA), r = (e.getAttribute(ZA) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : Jj(t, "date"),
		max: n === null ? null : Jj(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(QA)
	};
}
function Mj(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function Nj(e, t, n) {
	zj(e, t === null ? "" : Pj(e, t, n), n);
}
function Pj(e, t, n) {
	let r = uj(e), i = Jj(t, r);
	return r === "date-time" ? i + (Ij(e, n) ?? Rj(t)) : i;
}
var Fj = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function Ij(e, t) {
	return Lj(Ej(e, t)?.value ?? "") ?? Lj(Ej(e, !t)?.value ?? "");
}
function Lj(e) {
	return Fj.exec(e.trim())?.[1] ?? null;
}
function Rj(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${Yj(Math.floor(n / 60))}:${Yj(n % 60)}`;
}
function zj(e, t, n) {
	let r = Ej(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Bj(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Cs(n, dj(e), gj(e));
	return r === null ? n : Jj(vs(r), uj(e));
}
function Vj(e) {
	if (!Cj(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (FA(t) === t) return;
	let n = Ej(e, !1)?.value ?? "";
	zj(e, Ej(e, !0)?.value ?? "", !1), zj(e, n, !0);
}
function Hj(e) {
	let t = Dj(e, qA), n = Dj(e, JA);
	if (t === null && n === null) return null;
	for (let r of Cj(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: cs(t, dj(e), gj(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: cs(n, dj(e), gj(e)) }
		};
	}
	return null;
}
function Uj(e) {
	return Gj(e, Wj(e, /* @__PURE__ */ new Date()));
}
function Wj(e, t) {
	let n = Dj(e, qA), r = Dj(e, JA);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Gj(e, t) {
	let n = fj(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Kj = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function qj(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Kj.exec(n);
		return e === null ? null : new Date(lj, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = _s(n);
	return r === null ? null : vs(r);
}
function Jj(e, t) {
	let n = `${Yj(e.getHours())}:${Yj(e.getMinutes())}:${Yj(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Yj(e.getMonth() + 1)}-${Yj(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Yj(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var Xj = "ui-temporal-input__day", Zj = "ui-temporal-input__month", Qj = 3, $j = "data-ui-temporal-nav", eM = "data-ui-temporal-day", tM = 366;
function nM(e) {
	let t = Tj(e);
	return {
		view: EM(t ?? Wj(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function rM(e, t, n, r) {
	let i = TM("div", `${K}__calendar`), a = TM("div", `${K}__calendar-header`), o = jj(e), s = wM("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = iM(o, t, -1) === null, a.append(s);
	let c = wM("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = wM("next", "›", D.text("ui.picker.next"));
	return l.disabled = iM(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? cM(e, t, n, r, o) : lM(t, n, o)), i;
}
function iM(e, t, n) {
	let r = t.pane === "months", i = kM(t.view, n * (r ? 12 : 1));
	return oM(e, aM(i, r ? 4 : 7)) ? sM(e, i) : null;
}
function aM(e, t) {
	return Jj(e, "date").slice(0, t);
}
function oM(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function sM(e, t) {
	let n = aM(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : qj(r, "date");
	return i === null ? t : EM(i);
}
function cM(e, t, n, r, i) {
	let a = xM(e), o = TM("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = TM("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = TM("div", `${K}__days`), c = LA(/* @__PURE__ */ new Date()), l = Cj(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = l && NA({
		start: u,
		end: d
	}, t.choosingEnd), p = DM(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = OM(p, e), r = Jj(n, "date"), a = TM("button", Xj);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(eM, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${Xj}--outside`), AM(n, c) && (a.classList.add(`${Xj}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${Xj}--marked`);
		let o = u !== null && AM(n, u), m = d !== null && AM(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${Xj}--selected`), f && o && a.classList.add(`${Xj}--period-start`), f && m && a.classList.add(`${Xj}--period-end`), l && (o || m) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), PA(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${Xj}--within`), Mj(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = TM("div", `${K}__calendar-pane`);
	return m.append(o, s), m;
}
function lM(e, t, n) {
	let r = TM("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = TM("button", Zj);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute($j, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Zj}--selected`), a.setAttribute("aria-current", "true")), oM(n, aM(ys(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return N(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function uM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : dM(t, r % Qj);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function dM(e, t) {
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
			offset: Qj,
			step: Qj
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
function fM(e) {
	let t = TM("div", `${K}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function pM(e, t, n) {
	let r = jj(e);
	if (n.startsWith("month:")) {
		let i = ys(t.view.getFullYear(), Number(n.slice(6)), 1);
		return oM(r, aM(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = vM(r, _M(i, t.focusedDay ?? Tj(e) ?? Wj(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = iM(r, t, -1) ?? t.view, !0;
		case "next": return t.view = iM(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function mM(e, t, n) {
	if (Cj(e)) {
		hM(e, t, n);
		return;
	}
	let r = IA(n, Tj(e) ?? Uj(e));
	t.focusedDay = r, t.view = EM(r), Nj(e, r, !1);
}
function hM(e, t, n) {
	let r = jA({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, IA(n, Uj(e)));
	t.focusedDay = r.end ?? r.start, t.view = EM(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, Nj(e, r.end, !0), Nj(e, r.start, !1);
}
function gM(e, t, n, r = !1) {
	let i = yM(n), a = bM(t, n, xM(e), r);
	if (a === null) return null;
	let o = jj(e);
	if (i === 0) return vM(o, a);
	let s = a;
	for (let e = 0; e < tM; e++) {
		if (Mj(o, Jj(s, "date"))) return s;
		s = OM(s, i);
	}
	return t;
}
function _M(e, t) {
	let n = ys(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return ys(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function vM(e, t) {
	let n = Jj(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : qj(r, "date");
	return i === null ? t : IA(i, t);
}
function yM(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function bM(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return OM(e, -1);
		case "ArrowRight": return OM(e, 1);
		case "ArrowUp": return OM(e, -7);
		case "ArrowDown": return OM(e, 7);
		case "PageUp": return kM(e, r ? -12 : -1);
		case "PageDown": return kM(e, r ? 12 : 1);
		case "Home": return OM(e, -i);
		case "End": return OM(e, 6 - i);
		default: return null;
	}
}
function xM(e) {
	let t = Number(e.getAttribute(aj));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function SM(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Xj}`)];
	if (i.length === 0) return;
	let a = Jj(LA(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (N(i, o), r && R(o));
}
function CM(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && LA(r).getTime() > LA(n).getTime();
	for (let t of e.querySelectorAll(`.${Xj}`)) {
		let e = qj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${Xj}--preview`, i && e !== null && MA(e, n, OM(r, 1))), t.classList.toggle(`${Xj}--preview-start`, i && e !== null && AM(e, n)), t.classList.toggle(`${Xj}--preview-end`, i && e !== null && AM(e, r));
	}
}
function wM(e, t, n) {
	let r = TM("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute($j, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function TM(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function EM(e) {
	return ys(e.getFullYear(), e.getMonth(), 1);
}
function DM(e, t) {
	let n = EM(e);
	return OM(n, -((n.getDay() - t + 7) % 7));
}
function OM(e, t) {
	return ys(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function kM(e, t) {
	let n = ys(e.getFullYear(), e.getMonth() + t, 1), r = ys(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return ys(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function AM(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var jM = "ui-temporal-input__field", MM = "ui-temporal-input__popup", NM = "ui-temporal-input--open", PM = "ui-calendar__body", FM = "ui-temporal-input__time-cell", IM = "ui-temporal-input__time-column", LM = 140, RM = "data-ui-temporal-toggle", zM = "data-ui-temporal-unit", BM = "data-ui-temporal-cell", VM = "data-ui-temporal-centred", HM = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new p_({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(NM), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(NM);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(zA)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Pa(e.components, zA), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && UM(e) && this.states.set(e, nM(e)), this.isShowing(e) && this.renderSurface(e);
		}), B(this.root, zA, { attributeFilter: [...cj] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), B(this.root, zA, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) UM(e) && WM(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(zA)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) vj(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || UM(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${PM}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && WM(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = xs(dj(t), rN()), n = fs(dj(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${jM}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = Ej(t, wj(r))?.value ?? "", a = qj(i, uj(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = cs(a, dj(t), gj(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(jM)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : Ej(t, wj(e.target));
		if (t === null || n === null) return;
		let r = Bj(t, e.target.value), i = qj(r, uj(t)), a = i === null ? r : Pj(t, i, wj(e.target));
		if (GM(t, a)) {
			let n = q(t, wj(e.target));
			e.target.value = n === null ? "" : cs(n, dj(t), gj(t));
		} else wj(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Vj(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(jM)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && Cj(t) && (this.getState(t).activeEnd = wj(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Cj(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${eM}]`) : null, r = this.getState(t), i = n === null ? null : qj(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, CM(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${eM}], .${FM}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(FM) ? oN(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = WM(e), r = qj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, N([...n.querySelectorAll(`.${Xj}`)], t), cp(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(jM)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${RM}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${$j}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${eM}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${BM}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${zM}]`)?.getAttribute(zM);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(BM)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (pM(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, Uj(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Cj(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = qj(t, "date");
		if (n === null || A(e) || O(e) || !Mj(jj(e), t)) return;
		let r = this.getState(e);
		UM(e) && Cj(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = Ej(e, !1), a = `${i?.value ?? ""}|${Ej(e, !0)?.value ?? ""}`;
		mM(e, r, n), UM(e) && `${i?.value ?? ""}|${Ej(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Cj(e) && this.getState(e).activeEnd === "end", i = hj(q(e, r) ?? Uj(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Nj(e, t, n), Vj(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "ArrowDown" && M(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(jM)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), wj(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(FM)) {
			M(e) && cN(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			M(e) && sN(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !M(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = qj(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Jj(n, "date"));
			return;
		}
		let r = gM(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = EM(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${IM}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, LM)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${IM}`), n = t?.getAttribute(zM) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Xy(this.wheelTurns.get(n) ?? 0, Yy(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${FM}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${FM}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${FM}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(BM)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || A(e) || O(e)) return;
		let n = Number(t.getAttribute(VM));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(zM), i = QM(t);
		r === null || i === null || i.classList.contains(`${FM}--selected`) || (i.matches(":disabled") ? XM(e) : this.chooseTime(e, r, Number(i.getAttribute(BM))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${MM}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Cj(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? Tj(e);
		r.pane = "days", r.view = EM(i ?? Wj(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${RM}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => aN(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = nM(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = WM(e);
		if (n === null) return;
		let r = UM(e), i = uj(e), a = this.getState(e), o = gj(e), s = Cj(e), c = q(e, s && a.activeEnd === "end"), l = $M(n), u = eN(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(fM(a)), r) n.append(rM(e, a, o, c));
		else {
			let t = TM("div", `${K}__panes`);
			t.append(rM(e, a, o, c)), i === "date-time" && t.append(KM(e, c)), n.append(t, nN(i));
		}
		let f = u === null ? null : n.querySelector(`[${$j}="${Ui(u)}"]:not(:disabled)`);
		SM(n, a, c, t || d && l === null && f === null), CM(e, a), r || (YM(n), XM(n), tN(n, l)), f !== null && R(f), r || this.popups.reposition(e);
	}
};
function UM(e) {
	return e.classList.contains(RA);
}
function WM(e) {
	return e.querySelector(`.${UM(e) ? PM : MM}`);
}
function GM(e, t) {
	let n = jj(e), r = n.markedOnly ? qj(t, uj(e)) : null;
	return r !== null && !n.marked.has(Jj(r, "date"));
}
function KM(e, t) {
	let n = fj(e), r = TM("div", `${K}__time`), i = TM("div", `${K}__time-columns`);
	for (let r of qM(n)) i.append(JM(e, r, pj(n, r), t));
	return r.append(i), r;
}
function qM(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function JM(e, t, n, r) {
	let i = TM("div", IM);
	i.setAttribute(zM, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : mj(r, t), s = t === "hour" && yj(dj(e)), c = gj(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = TM("button", FM);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? bj(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(BM, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${FM}--selected`), fN(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function YM(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function XM(e) {
	for (let t of e.querySelectorAll(`.${IM}`)) {
		let e = t.querySelector(`.${FM}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, ZM(t, e), t.setAttribute(VM, String(t.scrollTop));
	}
}
function ZM(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function QM(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${FM}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function $M(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(FM) ? null : t.closest(`.${IM}`)?.getAttribute(zM) ?? null;
}
function eN(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute($j) : null;
}
function tN(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${IM}[${zM}="${t}"]`)?.querySelector(`.${FM}--selected`) ?? null;
	n !== null && R(n);
}
function nN(e) {
	let t = TM("div", `${K}__popup-footer`);
	return t.append(wM("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(wM("clear", D.text("ui.picker.clear"))), t.append(wM("done", D.text("ui.picker.done"))), t;
}
function rN() {
	return {
		year: iN("ui.picker.letter.year", bs.year),
		month: iN("ui.picker.letter.month", bs.month),
		day: iN("ui.picker.letter.day", bs.day),
		hour: iN("ui.picker.letter.hour", bs.hour),
		minute: iN("ui.picker.letter.minute", bs.minute),
		second: iN("ui.picker.letter.second", bs.second)
	};
}
function iN(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function aN(e, t) {
	for (let n of e.querySelectorAll(`.${jM}`)) if (wj(n) === t) return n;
	return e.querySelector(`.${jM}`);
}
function oN(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(FM) && cp(e);
}
function sN(e, t) {
	if (!Lu(e.key, "both")) return;
	e.preventDefault();
	let n = uM(t, e.key);
	zu([...n?.parentElement?.children ?? []], n);
}
function cN(e) {
	let t = e.target, n = t.closest(`.${IM}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? uN(n, e.key === "ArrowRight" ? 1 : -1) : lN(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), dN(r));
}
function lN(e, t, n) {
	let r = [...e.querySelectorAll(`.${FM}`)];
	return n === "PageUp" || n === "PageDown" ? Cf(n, r.filter(P), t, "vertical") ?? t : Iu({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function uN(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${IM}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${FM}--selected`) ?? r.querySelector(`.${FM}:not(:disabled)`);
}
function dN(e) {
	let t = e.closest(`.${IM}`);
	t !== null && (ZM(t, e), t.setAttribute(VM, String(t.scrollTop)));
}
function fN(e, t, n, r) {
	let i = Dj(e, qA), a = Dj(e, JA);
	if (i === null && a === null) return !1;
	let o = hj(r ?? Uj(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var pN = `[${Ur}="${Gr}"] [${Wr}]`, mN = "ui-theme-switcher__label-text--current";
function hN() {
	let e = document.documentElement.getAttribute(zr);
	return e === "light" || e === "dark" ? e : "auto";
}
function gN(e, t) {
	let n = e.getAttribute(Wr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(mN, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var _N = new oT();
function vN(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(P) ?? null);
	o !== null && N(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && wp(t.popup, n, i), s;
}
function yN(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = sT(e);
	if (r !== null) return e.preventDefault(), zu(t, xN(t, n, r)), !0;
	if (!Lu(e.key, "vertical") || !M(e)) return !1;
	let i = Iu({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), zu(t, i), !0;
}
var bN = {
	character: sT,
	entry: xN
};
function xN(e, t, n) {
	let r = e.filter(P), i = r[0]?.parentElement;
	return i == null ? null : _N.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: kg,
		context: i
	});
}
function SN(e, t) {
	e !== document.activeElement && P(e) && (N(t, e), cp(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var CN = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new p_({
			show: ({ owner: t }) => t.classList.add(e.openClass),
			hide: ({ owner: t }) => t.classList.remove(e.openClass),
			closesWhenReadOnly: !1,
			closesOnTab: !0,
			sheetOnPhone: !0
		});
	}
	switcherOf(e) {
		return e.closest(this.selector);
	}
	isField(e) {
		return e.getAttribute(this.parts.attribute) === Gr;
	}
	choicesOf(e) {
		return [...e.querySelectorAll(`:scope > .${this.parts.menuClass} > .${this.parts.choiceClass}`)];
	}
	chosenAttribute(e) {
		return this.isField(e) ? "aria-selected" : "aria-checked";
	}
	isOpen(e) {
		return this.menus.isOpen(e);
	}
	close(e) {
		this.menus.close(e);
	}
	toggle(e, t) {
		this.menus.isOpen(e) ? this.menus.close(e) : this.open(e, t);
	}
	open(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${this.parts.menuClass}`);
		if (r === null) return;
		let i = this.choicesOf(e), a = i.find((t) => t.getAttribute(this.chosenAttribute(e)) === "true") ?? null, o = this.isField(e) ? {
			anchor: t,
			placement: {
				placement: "bottom-start",
				minAnchorWidth: !0
			}
		} : {
			anchor: e,
			placement: { placement: "bottom-end" }
		};
		vN(this.menus, {
			owner: e,
			popup: r,
			...o,
			openers: [t]
		}, i, a, n);
	}
	handleKeyDown(e, t) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let n = this.switcherOf(e.target);
		if (n === null) return;
		let r = this.choicesOf(n), i = e.target.closest(this.parts.triggerSelector);
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && yN(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && SN(t, this.choicesOf(n));
	}
}, wN = `[${Ur}="${Gr}"]`, TN = "ui-theme-switcher__choice", EN = class {
	options;
	root;
	list = new CN({
		attribute: Ur,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: TN,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Di}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [zr]
		}), B(this.root, wN, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.showTheme(e)), this.showTheme();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.list.switcherOf(e.target);
		if (t === null) return;
		if (!this.list.isField(t)) {
			if (t.hasAttribute("disabled")) return;
			e.preventDefault(), this.apply(DN() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${TN}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Wr));
			return;
		}
		let r = e.target.closest(`.${Di}`);
		r === null || O(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: Ji.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = hN();
		if (e === void 0) for (let e of this.root.querySelectorAll(pN)) gN(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${Wr}]`)) gN(e, t);
	}
};
function DN() {
	let e = hN();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var ON = `.ui-language-switcher__trigger, .${Di}`, kN = "ui-language-switcher__label-text", AN = "ui-language-switcher__label-text--current", jN = "ui-language-switcher__label-text--page", MN = "ui-language-switcher__choice", NN = "ui.language.switch", PN = "ui.language.current", FN = class {
	options;
	root;
	list = new CN({
		attribute: Hr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: MN,
		openClass: "ui-language-switcher--open",
		triggerSelector: ON
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${MN}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Kr));
			return;
		}
		let r = e.target.closest(ON);
		if (r === null || O(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = D.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
		} else this.list.isOpen(n) ? this.list.close(n) : this.opensList(n, i) && this.list.open(n, r);
	}
	opensList(e, t) {
		return this.list.isField(e) ? t.length > 1 : t.length > 2;
	}
	choose(e, t) {
		this.list.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Ji.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Hr}]`)) {
			let n = t.querySelector(`:scope > :is(${ON})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${kN}`)) {
				let n = t.getAttribute(Kr) === e;
				t.classList.toggle(AN, n), t.classList.contains(jN) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = IN(kc(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [NN, {
				language: LN(r, e),
				code: RN(e),
				other: LN(r, o),
				otherCode: RN(o)
			}] : [PN, {
				language: LN(r, e),
				code: RN(e)
			}];
			D.write(n, "aria-label", s, c), a && D.write(t, Re, s, c);
		}
	}
};
function IN(e) {
	return E(e) && (e.key === NN || e.key === PN);
}
function LN(e, t) {
	let n = e.find((e) => e.getAttribute(Kr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return RN(t);
	}
}
function RN(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var zN = `${Me}__button`, BN = `${Me}__more`, VN = `${zN}--icon`, HN = "ui-text__icon", UN = `.ui-button__content .${HN}`, WN = ".ui-button__content .ui-text__title", GN = /* @__PURE__ */ new WeakMap();
function KN(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Bn)) qN(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function qN(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function JN(e, t) {
	let n = t.entries.map((e) => YN(e, t));
	return t.more && t.openMore !== void 0 && n.push(ZN(t.openMore)), e.replaceChildren(...n), n;
}
function YN(e, t) {
	let n = QN(zN), r = eP(e), i = XN(e);
	return i === null ? n.textContent = r : (n.classList.add(VN), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(_i), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), GN.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function XN(e) {
	let t = e.querySelector(UN);
	if (t === null || !t.className.split(" ").some(po)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(HN), n.setAttribute(co, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(lo);
	return r.length > 0 && n.style.setProperty(lo, r), n;
}
function ZN(e) {
	let t = QN(`${zN} ${BN}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function QN(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Ai}`, t.tabIndex = -1, t;
}
function $N(e) {
	return GN.get(e) ?? null;
}
function eP(e) {
	return e.querySelector(WN)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var tP = 500, nP = 150, rP = 10, iP = /* @__PURE__ */ new WeakSet(), aP = "ui-long-press-hold", oP = "ui-long-press-hold-end";
function sP(e) {
	return iP.has(e);
}
var cP = class {
	root;
	holds;
	answer;
	closeMenu;
	shows;
	press = null;
	shown = null;
	answered = null;
	openedAt = null;
	slid = !1;
	dragging = !1;
	constructor(e) {
		this.root = e.root, this.holds = e.holds, this.answer = e.answer, this.closeMenu = e.closeMenu ?? (() => void 0), this.shows = e.shows, e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), e.root.addEventListener("dragend", () => this.endDrag(), !0), e.root.addEventListener("drop", () => this.endDrag(), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.openedAt = null, this.slid = !1, this.dragging = !1, this.press !== null) {
			this.cancel();
			return;
		}
		if (t.pointerType !== "touch" || !(e.target instanceof Element) || !this.holds(e.target)) return;
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), nP);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), tP),
			shown: a
		};
	}
	showHold() {
		let e = this.press, t = e === null || !e.target.isConnected ? null : this.shows?.(e.target) ?? null;
		if (e === null || t === null) return;
		let n = {
			pointerId: e.pointerId,
			target: e.target,
			clientX: e.x,
			clientY: e.y,
			duration: 350
		};
		this.shown = {
			pointerId: e.pointerId,
			part: t
		}, t.dispatchEvent(new CustomEvent(aP, {
			bubbles: !0,
			detail: n
		}));
	}
	endHold(e) {
		let t = this.shown;
		if (t === null) return;
		this.shown = null;
		let n = {
			pointerId: t.pointerId,
			opened: e
		};
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(oP, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > rP && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > rP && this.cancel();
	}
	leaveMenuToDrag() {
		this.dragging = !1, this.openedAt = null, this.closeMenu();
	}
	cancel() {
		this.forget(), this.endHold(!1);
	}
	forget() {
		this.press !== null && (clearTimeout(this.press.timer), this.press.shown !== null && clearTimeout(this.press.shown), this.press = null);
	}
	fireHeld() {
		let e = this.press;
		this.forget(), e !== null && this.fire(e);
	}
	fire(e) {
		if (!e.target.isConnected) {
			this.endHold(!1);
			return;
		}
		if (this.answer !== void 0) {
			this.answered = this.answer(e.target) ? e.target : null, this.endHold(this.answered !== null);
			return;
		}
		let t = new MouseEvent("contextmenu", {
			bubbles: !0,
			cancelable: !0,
			button: 2,
			clientX: e.x,
			clientY: e.y
		});
		iP.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (iP.has(e)) return;
		if (this.answered !== null && e.target instanceof Node && this.answered.contains(e.target)) {
			e.preventDefault(), e.stopImmediatePropagation();
			return;
		}
		let t = this.press;
		this.answer !== void 0 && t !== null && e.target instanceof Node && t.target.contains(e.target) ? (e.preventDefault(), this.forget(), this.fire(t)) : t !== null && this.shown !== null && e.target instanceof Node && t.target.contains(e.target) ? (this.forget(), setTimeout(() => this.endHold(e.defaultPrevented))) : this.cancel();
	}
	handleDragStart(e) {
		let t = this.press, n = e.target;
		t !== null && n instanceof Node && (n.contains(t.target) || t.target.contains(n)) && setTimeout(() => {
			e.defaultPrevented || (this.press === t && this.forget(), this.fire(t), this.dragging = this.openedAt !== null);
		});
	}
	handleDragOver(e) {
		let t = e, n = this.openedAt;
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > rP && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, lP = [
	Im("md"),
	Im("xl"),
	Im("xxl")
], uP = {
	md: Im("md"),
	xl: Im("xl"),
	xxl: Im("xxl")
}, dP = Im("md");
function fP(e, t) {
	return pP(e) && !(e.hasAttribute(Dn(t)) && !hP(e, t) && mP(dP));
}
function pP(e) {
	let t = e.getAttribute(Tn);
	if (t === null) return !1;
	let n = uP[t];
	return n === void 0 || !mP(n);
}
function mP(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function hP(e, t) {
	return e.querySelector(`:scope > [${jn}="${Ui(t)}"][${On}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var gP = "ne.ui", _P = "boot", vP = /* @__PURE__ */ new Set(), yP = class {
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
		let r = this.resolveKey(e, _P);
		if (r !== null) try {
			let e = bP(window.localStorage.getItem(r));
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
		let n = e.getAttribute(qe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return vP.has(n) || (vP.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${gP}:${n}:${t}`;
	}
};
function bP(e) {
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
var xP = "menu-current", SP = `[${un}]`;
function CP(e) {
	for (let t = e.closest(SP); t !== null; t = t.parentElement?.closest(SP) ?? null) TP(t);
}
function wP(e) {
	for (let t of e.querySelectorAll(SP)) TP(t);
	CP(e);
}
function TP(e) {
	let t = e.querySelector(`.${Fn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(pn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var EP = "menu-icons", DP = "ui-menu__host", OP = `:scope > :not([${hn}]) > .${S}[${Fi}]`;
function kP(e) {
	let t = e.closest(`.${DP}`);
	t !== null && jP(t);
}
function AP(e) {
	for (let t of e.querySelectorAll(`.${DP}`)) jP(t);
}
function jP(e) {
	let t = e.querySelector(OP) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var MP = "ui-menu__submenu", NP = un, PP = fn, FP = "data-ui-menu-flyout", IP = `[${FP}], ${Ci}`, LP = "data-ui-menu-unfolded", RP = dn, zP = "data-ui-menu-rail-list", BP = "left-side", VP = "[data-ui-root]", HP = "menu-open-group", UP = z.normal * 5, WP = Ze("click"), GP = class {
	root;
	store = new yP();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new p_({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(PP, ""), t.setAttribute(FP, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(PP), queueMicrotask(() => Nm(t, UP, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(FP);
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
		let t = this.root.querySelectorAll(`.${Nn}`);
		XP(t), this.reconcileEach(t);
		for (let e of t) wP(e), AP(e);
		B(this.root, `.${Nn}`, {
			childList: !0,
			attributeFilter: [ln]
		}, (e) => {
			XP(e), this.reconcileEach(e);
			for (let t of e) wP(t), AP(t);
		});
		for (let e of this.root.querySelectorAll(`[${NP}]`)) KP(e);
		if (B(this.root, `[${NP}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [PP]
		}, (e) => {
			for (let t of e) KP(t);
		}), typeof matchMedia == "function") for (let e of lP) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		B(this.root, VP, { attributeFilter: [Dn(BP)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${kn}] .${Nn}`);
		XP(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = nF(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), qP(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(LP, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${NP}]`)) KP(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Fn}`), e);
		if (t !== null && !t.hasAttribute(RP)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, HP), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && ZP(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Nn}`);
		a !== null && (tF(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Ln);
		e.setAttribute(LP, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(PP) ? (t.removeAttribute(PP), n || this.store.write(e, HP, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, HP, t.getAttribute(b))) : t.toggleAttribute(PP);
	}
	openInline(e) {
		e.setAttribute(PP, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${NP}][${PP}]`)) t.hasAttribute(RP) || t.removeAttribute(PP);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		qP(e), this.closeGroups(e);
		let a = n.closest(IP) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${JP(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Nn}`);
		o !== null && !tp() && wp(o, QP(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${NP}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${NP}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${MP}`);
	}
};
function KP(e) {
	let t = e.querySelector(`:scope > .${S}`);
	t !== null && (t.setAttribute(WP, ""), t.setAttribute(Qe, ""), t.setAttribute("aria-expanded", e.hasAttribute(PP) ? "true" : "false"), tF(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function qP(e) {
	for (let t of e.querySelectorAll(`[${FP}]`)) t.removeAttribute(FP);
}
function JP(e) {
	return YP(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function YP(e) {
	let t = e.closest(`[${On}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && fP(t.parentElement, BP);
}
function XP(e) {
	for (let t of e) {
		let e = t.closest(`[${kn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(zP) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && fP(e.parentElement, BP);
		t.classList.toggle(In, !n), t.toggleAttribute(zP, n);
	}
}
function ZP(e) {
	let t = e.closest(`.${S}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !O(t);
}
function QP(e) {
	let t = [];
	for (let n of ad(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(PP) || tF(e) ? null : e.querySelector(`:scope > .${MP} > .${Nn}`);
		r !== null && t.push(...QP(r));
	}
	return t;
}
function $P(e) {
	let t = eF(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || tF(t) ? e : $P(n);
}
function eF(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(MP) && t.parentElement?.hasAttribute(NP) === !0 ? t.parentElement : null;
}
function tF(e) {
	let t = e.closest(`.${Nn}`);
	return e.hasAttribute(RP) || t !== null && nF(t);
}
function nF(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var rF = "tabs:rename", iF = "tabs:pin", aF = "tabs:unpin", oF = "tabs:close", sF = "tabs:delete";
function cF(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function lF(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[rF, e.rename && t.renamable],
		[iF, e.pin && !t.pinned],
		[aF, e.pin && t.pinned],
		[oF, e.close && !e.delete && n],
		[sF, e.delete && n]
	]);
}
function uF(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function dF(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var fF = Se, pF = "ui-context-menu--open", mF = `${Me}--strip`, hF = `.${Me}:not(.${mF}) > .${BN}`, gF = "ui-context-menu-opening", _F = null, vF = /* @__PURE__ */ new WeakSet();
function yF(e) {
	_F = e;
}
var bF = class {
	root;
	components;
	closed = null;
	menus = new p_({
		show: ({ popup: e }) => e.classList.add(pF),
		hide: ({ popup: e }, t) => {
			e.classList.remove(pF), this.closed = e, t === "outside" && BF();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new cP({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Su(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: CF
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !tp() && !sP(e), n = (t ? TF() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = xF(n);
		if (r === null) return;
		e.preventDefault();
		let i = NF(e) ? n : null, a = n.closest(hF), o = t ? EF(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		vF.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${mF}`)?.remove(), PF(t), i !== null && FF(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && LF(t), this.closed !== null && (Mm(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? ep(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : Tp(s, this.components)) ?? Tp(e, this.components)
		}) && (c === null && Bh(t, n, r), zF(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && ZP(e.target) && this.menus.close();
	}
};
function xF(e) {
	for (let t of SF(e)) {
		let n = OF(t, e).find((t) => jF(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* SF(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (kF(n, e) && !O(n)) {
			if (HF(n)) return;
			yield n;
		}
	}
}
function CF(e) {
	let t = SF(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(ld);
	return r !== null && r !== n && n.contains(r) ? I(r) ?? r : n;
}
var wF = `[${Ce}]`;
function TF() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Gd(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Qd(t.root);
	return n === null ? t.root : DF(n);
}
function EF(e) {
	let t = e.closest(ld);
	return t === null ? e : I(t) ?? t;
}
function DF(e) {
	if (e.matches(wF)) return e;
	for (let t of e.querySelectorAll(wF)) if (t.closest(ld) === e) return t;
	return e;
}
function OF(e, t) {
	return AF(e, t).map((t) => VF(e, t)).filter((e) => e !== null);
}
function kF(e, t) {
	return AF(e, t).some((t) => VF(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function AF(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function jF(e, t, n) {
	let r = new CustomEvent(gF, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function MF(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || O(n) || HF(n) || r !== null && n.contains(r) ? null : OF(n, e).find((n) => jF(n, e, t)) ?? null;
}
function NF(e) {
	let t = e.pointerType;
	return sP(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : np();
}
function PF(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function FF(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !OF(e, r).includes(t)) return;
	let { entries: i } = KN(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${mF}`, a.setAttribute("role", "group"), JN(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: IF
	}), t.insertBefore(a, t.firstElementChild);
}
function IF(e) {
	O(e) || e.click();
}
function LF(e) {
	let { entries: t } = KN(e), n = e.querySelector(`.${Nn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) RF(e);
	let r = id(n, `.${S}`, `.${Nn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && qN(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? RF(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Mn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	uF(a).forEach((e, t) => {
		a[t] === "rule" && !e && RF(i[t]);
	});
}
function RF(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function zF(e) {
	let t = e.querySelector(`.${Nn}`);
	t !== null && wp(e, QP(t));
}
function BF() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Bf}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function VF(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${fF}]`)) if ((n.getAttribute(fF) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || _F === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = _F(e);
	return r !== null && vF.add(r), r;
}
function HF(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Gc(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function UF(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function WF(e) {
	return getComputedStyle(e).display !== "none";
}
function GF(e) {
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
				if (e.overflowX !== "visible" && JF(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && JF(n, a, a + t.clientHeight, !1), YF(n)) return !0;
			}
			r = e.position;
		}
	}
	return JF(n, 0, window.innerWidth, !0), JF(n, 0, window.innerHeight, !1), YF(n);
}
function KF(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || UF(n, !1)) && (qF(e.overflowX) || qF(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function qF(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function JF(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function YF(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var XF = `[${De}]`, ZF = `.${Me}`, QF = `${Me}--out`, $F = `.ui-items-view__item, .${nr}`, eI = "ui-tree__node", tI = 6, nI = "--ui-action-bar-gap", rI = 400, iI = /* @__PURE__ */ new WeakMap(), aI = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...mi
], oI = class {
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
		if (n === null || n.closest(`${ZF}, [data-ui-context-menu]`) !== null) return;
		let r = sI(n), i = r !== null && r !== this.chosen && cI(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : mI(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? hI(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(ZF) === null && NF(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(ZF);
		n === null ? tp() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(fI(t)) : this.isHostedBar(n) && N(CI(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(ZF) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(F) && this.choose(fI(t));
			return;
		}
		let n = t.closest(ZF);
		if (n !== null && t.classList.contains(zN)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (fu(e)) return;
			let n = t.closest(ig);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
		} else if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(F)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(F) && this.choose(fI(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && DI(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Tp(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = CI(t), i = Iu({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), zu(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : mI(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = KF(e);
		if (t === void 0 || n === null || !UF(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + _I(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, fh(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : MF(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			qh(e) || this.scopeChanged();
		}), this.scopeObserver.observe(this.identity.scope, {
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
				this.chosen = hI(e), this.sync();
			}
			for (let e of this.shown.values()) fh(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = MF(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Qe, ""), n.setAttribute(fe, ""), !yI(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, SI(e)), th(e, n, {
			placement: gI(e),
			gap: _I(e),
			boundary: KF(e) ?? void 0
		}), n.classList.toggle(QF, GF(e));
		let r = new MutationObserver((t) => {
			qh(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: aI
		});
		let i = vI(e);
		i?.setAttribute(Mr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), iI.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : $N(r);
		if (!yI(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = CI(t.bar);
		zu(a, a.find((e) => $N(e) === i) ?? a.find(P) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || TI(t)) return;
		if (this.menuHost = e, EI(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		bI(n.bar, !0);
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
		bI(t.bar, !1);
		let n = document.activeElement;
		!tp() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && xI(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), ph(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Mr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(QF, GF(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : CI(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function sI(e) {
	let t = e.closest(XF);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(C);
	return n === null || r !== null && !r.contains(n) ? null : pI(n)[0] ?? null;
}
function cI(e, t) {
	let n = Fu(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !uI(n, t);
}
var lI = `[${Se}], .${Me}, ${Ei}`;
function uI(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = dI(e) - dI(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(lI)) return !1;
			t -= dI(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function dI(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function fI(e) {
	if (e instanceof HTMLElement && e.matches(F)) {
		let t = Qd(e), n = t === null ? void 0 : pI(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(XF);
}
function pI(e) {
	let t = [...e.querySelectorAll(XF)];
	return e.matches(XF) ? [e, ...t] : t;
}
function mI(e) {
	let t = e.getAttribute(Oe);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Oe,
		key: t,
		index: 0
	};
	let n = e.closest(`[${b}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: b,
		key: r,
		index: pI(n).indexOf(e)
	};
}
function hI(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return pI(t)[e.index] ?? null;
	return null;
}
function gI(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function _I(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(nI));
	return Number.isFinite(t) ? t : tI;
}
function vI(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches($F)) return t;
	let n = t.parentElement;
	return t.classList.contains(eI) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function yI(e, t, n, r) {
	let { entries: i, more: a } = KN(t);
	if (i.length === 0 && !a) return !1;
	let o = JN(e, {
		entries: i,
		more: a,
		role: "button",
		press: wI,
		openMore: n
	});
	return N(o, o.find((e) => !O(e)) ?? o[0] ?? null), bI(e, r), !0;
}
function bI(e, t) {
	xI(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function xI(e) {
	return CI(e).find((e) => $N(e) === null) ?? null;
}
function SI(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function CI(e) {
	return [...e.querySelectorAll(`:scope > .${zN}`)];
}
function wI(e, t) {
	if (O(t) || TI(t)) return;
	let n = MF(t, !1);
	n !== null && n.contains(e) && !O(e) && qN(e, n) && e.click();
}
function TI(e) {
	let t = e.closest(ZF), n = t === null ? void 0 : iI.get(t);
	return n !== void 0 && np() && Date.now() - n < rI;
}
function EI(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function DI(e) {
	return e.matches(Bf) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var OI = "ui-tooltip", kI = "ui-tooltip", AI = "ui-tooltip--visible", jI = "ui-tooltip--linked", MI = "[aria-haspopup][aria-expanded=\"true\"]", NI = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", PI = "top", FI = 250, II = 200, LI = 300, RI = 7, zI = null, BI = null, VI = null, HI = null, UI = null, WI = 0, GI = null, KI = 0, qI = 0, JI = !1, YI = /* @__PURE__ */ new Set();
function XI(e) {
	YI.add(e);
}
function ZI(e = document) {
	if (JI) return;
	JI = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", QI, !0), t.addEventListener("pointerout", tL, !0), t.addEventListener("focusin", rL, !0), t.addEventListener("focusout", iL, !0), t.addEventListener("scroll", eL, !0), t.addEventListener("pointerdown", oL, !0), t.addEventListener("click", uL, !0), new cP({
		root: t,
		first: window,
		holds: cL,
		answer: lL
	}), window.addEventListener("keydown", aL, !0), window.addEventListener("blur", PL);
}
function QI(e) {
	if ($I(), fL(e.target)) {
		window.clearTimeout(KI);
		return;
	}
	let t = pL(e.target);
	t !== null && t !== BI && vL(t);
}
function $I() {
	BI === null || BI.isConnected || PL();
}
function eL(e) {
	if ($I(), BI === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(BI) || GF(BI) && PL();
}
function tL(e) {
	if (HI !== null || UI !== null) return;
	let t = e.relatedTarget, n = BI ?? GI?.target ?? null, r = n === null ? null : nL(n);
	t instanceof Node && (r !== null && r.contains(t) || fL(t)) || (fL(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && FL(!1);
}
function nL(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && mL(t) === e ? t : e;
}
function rL(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = pL(e.target);
	t !== null && (HI = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, yL(t));
}
function iL(e) {
	pL(e.target) === BI && PL();
}
function aL(e) {
	e.key !== "Escape" || BI === null || e.defaultPrevented || (fu(e) || e.preventDefault(), PL());
}
function oL(e) {
	if (fL(e.target)) return;
	let t = dL(e.target);
	if (t !== null) {
		if (UI === t) {
			FL(!0);
			return;
		}
		PL(), yL(t), UI = BI;
	} else HI === null && FL(!0);
}
var sL = `[${Ce}]`;
function cL(e) {
	let t = e.closest(sL) === null && !Su(e) ? pL(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function lL(e) {
	let t = pL(e);
	return t !== null && (PL(), yL(t), UI = BI, !0);
}
function uL(e) {
	dL(e.target) !== null && e.preventDefault();
}
function dL(e) {
	let t = pL(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(NI);
	return n === null || n.contains(t) ? t : null;
}
function fL(e) {
	return zI !== null && e instanceof Node && zI.contains(e);
}
function pL(e) {
	if (!(e instanceof Element)) return null;
	let t = mL(e);
	for (let n of YI) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && _L(r).length > 0) return r;
	}
	return t;
}
function mL(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function hL(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + gL(e) : _L(e);
}
function gL(e) {
	let t = "";
	for (let n of YI) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function _L(e) {
	for (let t of YI) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function vL(e, t) {
	HI === null && UI === null && (window.clearTimeout(KI), GI !== null && GI.target === e ? GI.words = t : (window.clearTimeout(WI), GI = null, BI === null ? Date.now() - qI < LI ? yL(e, t) : (GI = {
		target: e,
		words: t
	}, WI = window.setTimeout(() => {
		let e = GI;
		GI = null, e !== null && yL(e.target, e.words);
	}, FI)) : (FL(!0), yL(e, t))));
}
function yL(e, t) {
	let n = (t ?? hL(e)).trim();
	if (n.length === 0 || !e.isConnected || !WF(e) || SL(e) || GF(e)) return;
	window.clearTimeout(WI), window.clearTimeout(KI), GI = null;
	let r = IL();
	ko(r, n, { staticFolds: !0 }), r.classList.toggle(jI, r.querySelector("a[href]") !== null), r.classList.add(AI), BI = e, wL(CL(e)), r.setAttribute("data-ui-tooltip-text", Do(n)), DL(r, e.getAttribute(Ve)), eh(e, r), th(e, r, {
		placement: NL(e),
		gap: RI,
		arrow: !0
	}), xL();
}
var bL = null;
function xL() {
	typeof MutationObserver < "u" && (bL ??= new MutationObserver($I), bL.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function SL(e) {
	return e.matches(MI) || e.querySelector(MI) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function CL(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function wL(e) {
	VI !== null && VI !== e && TL();
	let t = EL(e);
	t.includes(kI) || e.setAttribute("aria-describedby", [...t, kI].join(" ")), VI = e;
}
function TL() {
	if (VI === null) return;
	let e = EL(VI).filter((e) => e !== kI);
	e.length === 0 ? VI.removeAttribute("aria-describedby") : VI.setAttribute("aria-describedby", e.join(" ")), VI = null;
}
function EL(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function DL(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function OL(e, t, n) {
	let r = n?.plain === !0 ? Oo(t) : t;
	n?.delay === !0 && BI !== e ? vL(e, r) : yL(e, r);
}
function kL() {
	FL(!0);
}
var AL = {
	show: OL,
	hide: kL,
	escape: Oo
};
function jL(e) {
	HI = e, yL(e);
}
function ML(e) {
	BI === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? PL() : yL(e));
}
function NL(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of YI) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Wm(t) ? t : PI;
}
function PL() {
	HI = null, FL(!0);
}
function FL(e) {
	window.clearTimeout(WI), window.clearTimeout(KI), GI = null;
	let t = () => {
		BI !== null && (TL(), BI = null, UI = null, bL?.disconnect(), zI !== null && (zI.classList.remove(AI), ph(zI)), qI = Date.now());
	};
	e ? t() : KI = window.setTimeout(t, II);
}
function IL() {
	return zI !== null && zI.isConnected || (zI = document.createElement("div"), zI.id = kI, zI.className = OI, zI.setAttribute("role", "tooltip"), zI.setAttribute("aria-hidden", "true"), document.body.append(zI)), zI;
}
//#endregion
//#region src/interactions/menu-engine.ts
var LL = "ui-orientation--horizontal", RL = `.${In} > .ui-menu__host > .ui-menu__item > .${S}`, zL = `${RL}, ${`.ui-menu[${ln}] > .ui-menu__host > .ui-menu__item > .${S}`}`, BL = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", VL = "[role='menuitem'], [role='menuitemcheckbox']", HL = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new Ql();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, P), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), XI(KL), this.applyTabStops(this.root.querySelectorAll(`.${Nn}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) Gh(t) || qL(t, this.touched);
			this.touched.size > 0 && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [bn, fn]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1;
			let e = [...this.touched];
			this.touched.clear(), this.applyTabStops(e);
		}, 0));
	}
	applyTabStops(e) {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) n.isConnected && t.add($P(n));
		for (let e of t) {
			let t = QP(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && P(e));
			N(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && P(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(P) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Cu(e) || j(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = $P(n), i = QP(r), a = sT(e);
		if (a !== null) {
			e.preventDefault(), zu(i, xN(i, t, a));
			return;
		}
		let o = r.classList.contains(LL) || YP(r) ? "horizontal" : "vertical";
		if (!M(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(P) ? GL(r) : null, c = s ?? Iu({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && N(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : JP(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? zu([], UL(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !tF(a) ? a : WL(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), tF(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && M(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && P(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Nn}`);
		if (n === null) return;
		let r = QP(n), i = sT(e);
		if (i !== null) {
			e.preventDefault(), zu(r, xN(r, null, i));
			return;
		}
		let a = M(e) ? Iu({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(LL) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), zu(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && N(QP($P(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${S}`) : null;
		if (t === null || t === document.activeElement || !t.matches(VL) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !P(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && cp(t);
	}
};
function UL(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Nn}`);
	return t === null ? null : QP(t).find(P) ?? null;
}
function WL(e) {
	let t = e.closest(`.${Nn}`), n = t === null ? null : eF(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function GL(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var KL = {
	anchor: (e) => e.closest(zL),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(BL), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(RL) && t.scrollWidth <= t.clientWidth ? null : Oo(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Nn}`);
		return t === null ? null : JP(t);
	}
};
function qL(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Nn}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var JL = "shortcut:", YL = ":scope > .ui-menu-item__shortcut", XL = `[${Se}]`, ZL = `[${Vn}]`, QL = ".ui-text__title", $L = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), XI(oR), rR(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!qh(e)) {
				this.stale = !0;
				for (let t of e) nR(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Vn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Cu(e))) return;
		let t = sg(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !zl(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !P(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), tR(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= zl(t, e);
		let r = n ? TF() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = xF(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(ZL)].filter((t) => {
			let n = Rl(t.getAttribute(Vn));
			return n !== null && zl(n, e) && !O(t) && qN(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), tR(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(ZL)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Rl(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(XL) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set($l(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = Rl(e);
			t !== null && this.entryShortcuts.set($l(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Rl(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = $l(e.shortcut);
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
function eR(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(JL) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function tR(e) {
	xu(e.target) && e.target.dispatchEvent(new Event(jx, { bubbles: !0 }));
}
function nR(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && iR(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && rR(t);
}
function rR(e) {
	e instanceof HTMLElement && e.matches(ZL) && iR(e);
	for (let t of e.querySelectorAll(ZL)) iR(t);
}
function iR(e) {
	let t = e.querySelector(YL);
	if (t === null) return;
	let n = aR(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(gn, n.length > 0);
}
function aR(e) {
	let t = e.getAttribute(Vn), n = Rl(t);
	return n === null ? t?.trim() || null : Bl(n);
}
var oR = {
	anchor: (e) => {
		let t = e.closest(ZL);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(XL) !== null ? null : t;
	},
	words: (e) => {
		let t = aR(e), n = (e.getAttribute("aria-label") ?? e.querySelector(QL)?.textContent ?? "").trim();
		return t === null ? null : Oo(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = aR(e);
		return t === null ? null : Oo(`(${t})`);
	}
}, sR = 50, cR = 1, lR = 7;
function uR(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = fO(e, "data-ui-window-size") ?? 0;
	return {
		offset: fO(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : sR,
		total: fO(e, en),
		moreAfter: pO(e, nn)
	};
}
function dR(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function fR(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function pR(e, t) {
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
			let n = Number(t), r = fR(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === dR(e) ? null : (n - 1) * e.size;
		}
	}
}
function mR(e, t) {
	if (t <= lR) return gR(1, t);
	let n = Math.max(Math.min(e - cR, t - 2 - 2), 3), r = Math.min(Math.max(e + cR, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...gR(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function hR(e, t) {
	let n = mR(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function gR(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var _R = ".ui-pager", vR = "ui-pager__button", yR = "ui-pager__number", bR = "ui-pager__pages", xR = "ui-pager__gap", SR = "ui-pager__range", CR = "ui-pager__size", wR = "ui-pager__size--open", TR = "ui-pager__size-trigger", ER = "ui-pager__size-label", DR = "ui-pager__sizes", OR = "ui-pager__size-choice", kR = [
	vR,
	yR,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], AR = "ui.pager.page", jR = "ui.pager.range", MR = "ui.pager.rows", NR = "ui.pager.size", PR = [
	$t,
	en,
	nn,
	Qt,
	Zt
], FR = "page-size", IR = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new yP();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new p_({
		show: ({ owner: e }) => e.classList.add(wR),
		hide: ({ owner: e }) => e.classList.remove(wR),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), B(this.root, `${_R}, [${x}]`, {
			childList: !0,
			attributeFilter: PR,
			relevant: (e) => e.type === "attributes" || GR(e.target) || KR(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(_R)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(_R)) {
				t.add(r);
				continue;
			}
			let e = r.closest(C), i = e === null ? 0 : T(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(_R)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ht));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = WR(e);
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
		let i = uR(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = yD(e), l = (e) => bD(e, "N0", c);
		this.drawNumbers(e, o, c), RR(e, i, l), zR(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${vR}[${gt}]`)) Yc.setDisabled(t, pR(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		VR(e);
	}
	shownState(e, t = uR(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${bR}`);
		if (r === null) return;
		let i = dR(t), a = fR(t), o = a === null ? hR(i, t.moreAfter) : mR(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => LR(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(_R);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${OR}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(_t)));
			return;
		}
		let r = e.target.closest(`.${TR}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${gt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = pR(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), Wu(e).top > 0 && Gu(e, 0);
	}
	async requestPageAsync(e, t) {
		this.turning.set(e, t), this.syncPagersOf(e);
		try {
			await this.options.windows.requestOffsetAsync(e, t);
		} finally {
			this.turning.get(e) === t && (this.turning.delete(e), this.syncPagersOf(e));
		}
	}
	syncPagersOf(e) {
		for (let t of this.root.querySelectorAll(_R)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(_R);
		if (t === null) return;
		let n = e.target.closest(`.${CR}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${vR}, .${TR}`), i = BR(t);
		if (r === null || !i.includes(r) || !M(e)) return;
		let a = Iu({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), zu(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${TR}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && yN(e, UR(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${OR}`) : null, n = t?.closest(`.${CR}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && SN(t, UR(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${CR}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${DR}`);
		if (r === null) return;
		let i = UR(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		vN(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, FR), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!HR(e, i)) {
			this.store.write(t, FR, null);
			return;
		}
		let a = uR(n);
		i !== a.size && (n.setAttribute(Qt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${CR}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = uR(r.host);
		t !== i.size && (this.store.write(r.component, FR, String(t)), r.host.setAttribute(Qt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !M(e) || !(e.target instanceof Element)) return;
		let t = Kd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root)) return;
		let n = WR(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = pR(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Nd(e), i = Zd(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = Nd(e);
		o.length > 0 && tf(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function LR(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = xR, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = bD(e, "N0", n);
	return r.className = kR.join(" "), r.setAttribute("type", "button"), r.setAttribute(gt, String(e)), r.textContent = i, D.write(r, "aria-label", AR, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function RR(e, t, n) {
	let r = e.querySelector(`:scope > .${SR}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, MR, {
		from: i,
		to: a
	}) : D.write(r, null, jR, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function zR(e, t, n) {
	let r = e.querySelector(`:scope > .${CR}`), i = r?.querySelector(`.${ER}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, NR, { size: n(t.size) });
		for (let e of UR(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function BR(e) {
	return [...e.querySelectorAll(`.${vR}, .${TR}`)];
}
function VR(e) {
	let t = BR(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	N(t, n ?? r.find(P) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function HR(e, t) {
	let n = e.querySelector(`:scope > .${CR}`);
	return n !== null && UR(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function UR(e) {
	return [...e.querySelectorAll(`:scope > .${DR} > .${OR}`)];
}
function WR(e) {
	for (let t of e.querySelectorAll(`[${x}][${Wt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function GR(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function KR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(_R) || t.querySelector(_R) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var qR = `.${Nn}[${vn}]`, JR = ":scope > .ui-collapsible__bar", YR = ":scope > .ui-menu__host", XR = "ui-menu__item", ZR = `:scope > .${S}`, QR = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", $R = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), B(t, qR, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = ez(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(YR);
		if (n === null) return;
		let r = wg(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: tz(n)
		}), e.setAttribute(yn, ""), iT(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of nz(e)) {
			let e = rz(a);
			if (e === "header") {
				n !== null && az(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			az(a, o), r ||= o, i ||= o;
		}
		return n !== null && az(n, r), i;
	}
	match(e, t) {
		let n = Eg(iz(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(QR) : null;
		if (r === null) return n;
		if (n) return oz(r), e.removeAttribute(fn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(fn, i), i;
	}
	clear(e, t) {
		oz(t), e.removeAttribute(yn), nz(t).length > 0 && iT(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(ln);
		for (let e of t.querySelectorAll(`[${un}]:not([${dn}])`)) e.toggleAttribute(fn, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !M(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = ez(e.target), n = t === null ? void 0 : QP(t).find(P);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function ez(e) {
	let t = e.closest(qR), n = t?.querySelector(JR) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function tz(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${un}][${fn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function nz(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(XR));
}
function rz(e) {
	return e.querySelector(ZR)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function iz(e) {
	let t = e.querySelector(ZR);
	return t === null ? "" : Tg(kg(t), e);
}
function az(e, t) {
	e.toggleAttribute(bn, !t);
}
function oz(e) {
	for (let t of e.querySelectorAll(`[${bn}]`)) t.removeAttribute(bn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var sz = 120;
function cz(e) {
	return e.typing && e.tallest - e.height > sz;
}
var lz = class {
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
		let t = cz({
			height: e.height,
			tallest: this.tallest,
			typing: Su(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Jr, t);
	}
}, uz = "[data-ui-root]", dz = "a[href]", fz = "ui-collapsible", pz = "ui-collapsible__bar", mz = "right-side", hz = "ui-side--left", gz = "ui-side--right", _z = "pinned", vz = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new yP();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of lP) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(uz)) Tz(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xn}]`);
		if (t !== null) {
			let e = t.closest(uz), n = t.getAttribute(xn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${En}]`);
		if (n !== null) {
			let e = n.closest(uz), t = n.getAttribute(En);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(Dn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Hn}]`);
		if (r !== null && !e.defaultPrevented && Sz(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${dz}, .${S}`), a = i?.closest(`[${jn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && Cz(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || fu(e) || _g()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && mp(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${uz}[${Sn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = Ez(t, n);
			r !== null && !cg(r) && e.push({
				shell: t,
				drawer: r,
				modal: wz(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${uz}[${Sn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = Ez(e, t), r = this.openers.get(e);
			n === null || !fP(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = Ez(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && fP(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Sn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, wz(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, tp(), performance.now() + z.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(wi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", D.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = yz(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", D.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(pz) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(Cn), i.removeAttribute(wn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(Cn, ""), i.setAttribute(wn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = xz(r.left - e.offsetLeft, e.clientWidth - a.width), c = xz(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (bp(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = Ez(e, t);
		if (i === null || hP(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(Dn(t), n), Tz(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && R(n);
		}
		let o = i.querySelector(`[${qe}]`);
		o !== null && this.store.write(o, _z, n ? "true" : null, n ? {
			root: !0,
			attributes: { [Dn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${uz}[${Sn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Sn);
		if (e.removeAttribute(Sn), this.markToggles(e), n === null) return;
		let r = Ez(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? kp(t, r) : t !== null && R(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${xn}="${Ui(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Sn);
		for (let n of e.querySelectorAll(`[${xn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(xn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(wi), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function yz(e) {
	for (let t of e.querySelectorAll(`[${Hn}]`)) if (Sz(t) && t.checkVisibility() && bz(t.closest(`.${fz}`), e)) return t;
	return null;
}
function bz(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function xz(e, t) {
	return Math.max(0, Math.min(e, t));
}
function Sz(e) {
	let t = e.closest(`.${fz}`), n = t?.closest(`[${jn}]`), r = n?.getAttribute(jn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(uz) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === mz ? gz : hz);
}
function Cz(e) {
	return !e.classList.contains("ui-menu-item") || ZP(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function wz(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function Tz(e) {
	for (let t of e.querySelectorAll(`[${En}]`)) {
		let n = String(e.hasAttribute(Dn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function Ez(e, t) {
	return e.querySelector(`:scope > [${jn}="${Ui(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var Dz = "ui-collapsible", Oz = "ui-collapsible__content", kz = "ui-collapsible__bar", Az = "ui-collapsible__bar-content", jz = "collapsed", Mz = class {
	root;
	store = new yP();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Dz}`)), B(this.root, `.${Dz}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [ln]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) ? this.apply(t, t.hasAttribute(ln)) : (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, jz);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Hn}]`), n = t?.closest(`.${Dz}`) ?? null;
		if (t === null || n === null || Sz(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(ln), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = Pz(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, jz, r ? "true" : "false", r ? { attributes: { [ln]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(ln, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${Oz}`),
			bar: e.querySelector(`:scope > .${kz} > .${Az}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Hn}], :scope > .${kz} > [${Hn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || jm()) return;
		let i = Iz(Nz(e), n, Pz(e, t), r);
		if (i === null) return;
		e.setAttribute(Un, ""), e.offsetWidth;
		let a = {
			duration: z.normal,
			easing: z.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Un));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Un);
			for (let e of t) e.cancel();
		}
	}
};
function Nz(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Pz(e, t) {
	let n = Nz(e), r = Fz(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function Fz(e) {
	return e === "width" ? "height" : "width";
}
function Iz(e, t, n, r) {
	let i = Fz(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function Lz(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var Rz = "ui-grid-splitter", zz = "ui-container", Bz = "ui-orientation--vertical", Vz = 16, Hz = {
	sliver: 0,
	passFloors: !0
}, Uz = {
	sliver: 48,
	passFloors: !0
}, Wz = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Wn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Gz = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Gn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Kz = class {
	root;
	store = new yP();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ag({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Rz}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, Hz) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${Rz}`)), B(this.root, `.${Rz}`, { childList: !0 }, (e) => this.prepareEach(e)), B(this.root, `.${Rz}`, { attributeFilter: [qn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Yz(t);
			e !== null && (this.restore(e, Xz(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Pm) {
			let i = r[n], a = zm(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = rB(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && Qz(n.container, n.axis, n.tier) !== void 0)) return;
		let r = bl(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, Lz(e, () => {
			!e.isConnected || rB(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) rB(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Rm();
		for (let t of this.root.querySelectorAll(`.${Rz}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		let t = e.target.closest(`.${Rz}`);
		if (t === null || this.drag.active || O(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = aB(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Xc(r, i) * nB(e.key, n.axis);
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
		let n = Yz(e);
		if (n === null) return;
		let r = Xz(e);
		for (let e of Pm) n.style.removeProperty(zm(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(qn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = iB(yl($z(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(qn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Rz}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : wl(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, Hz);
	}
	putBack(e, t) {
		let n = zm(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = Uz) {
		let r = ll(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(zm(e.axis.split, e.tier), tl(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Pm) {
			let a = zm(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Yz(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Xz(e), r = Rm(), i = Zz(t, n, r), a = i === null ? null : Zc(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = al(a, il(t.getAttribute(n.limits))), s = $z(t, n), c = eB(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = ol(c, tB(t, n).map((e) => eB(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(zm(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = Yz(e);
		if (n === null) return;
		let r = Xz(e), i = eB(e, r), a = $z(n, r), o = tB(n, r).map((e) => eB(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : ol(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(vl(a, s)));
		let c = qz(a, s.before) ? "before" : qz(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(Qr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(Qr, c), Jz(n, t === void 0 ? null : {
			axis: r,
			tracks: Tl(t, a, s, 48)
		});
	}
};
function qz(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function Jz(e, t) {
	let n = [Wz, Gz].filter((t) => tB(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: $z(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(Rz) ? Xz(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Dl(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Zr, a);
	}
}
function Yz(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(zz) ? t : null;
}
function Xz(e) {
	return e.classList.contains(Bz) ? Wz : Gz;
}
function Zz(e, t, n) {
	let r = Qz(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function Qz(e, t, n) {
	return Hm(n, (n) => e.style.getPropertyValue(zm(t.split, n)).trim() || void 0);
}
function $z(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function eB(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function tB(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(Rz) && Xz(r) === t && n.push(r);
	return n;
}
function nB(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function rB(e) {
	return xl(e.getAttribute(qn));
}
function iB(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function aB(e) {
	let t = Number(e.getAttribute(Kn));
	return Number.isFinite(t) && t > 0 ? t : Vz;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var oB = "ui-pane-container", sB = "ui-pane-container__place", cB = "ui-pane-container__pane", lB = "ui-pane-container__grip", uB = "data-ui-pane-lifted", dB = "data-ui-pane-target", fB = "data-ui-pane-moving", pB = "data-ui-pane-near", mB = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", hB = "panes", gB = ",", _B = 32, vB = class {
	root;
	store = new yP();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ag({
			root: this.root,
			resolveHandle: (e) => bB(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.forgetNearTop(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${oB}`), !1), B(this.root, `.${oB}`, {
			childList: !0,
			attributeFilter: [Jn],
			relevant: TB
		}, (e) => this.arrangeEach(EB(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of DB(n)) {
					let t = e.querySelector(`:scope > .${cB} > .${lB}`);
					t !== null && SB(t);
				}
			}
			n.hasAttribute(fB) || jB(n, kB(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, hB);
		t !== null && e.setAttribute(Jn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || OB(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(uB, ""), i.setAttribute(fB, ""), {
			container: i,
			grip: e,
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, JB(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(dB), t?.setAttribute(dB, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${cB}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), MB(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), NB(e.pane), e.container.isConnected && jB(e.container, kB(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(dB), e.pane.removeAttribute(uB), e.container.removeAttribute(fB), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Ti);
	}
	keep(e) {
		let t = AB(e);
		e.setAttribute(Jn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, hB, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		this.dropStaleHold();
		let t = bB(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = yB[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = YB(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && Sk({
				key: "ui.pane.target",
				args: wB(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) Sk({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = wB(n.container, r);
				wk(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), Sk({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Ti, ""), Sk({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? bB(e.target) : null;
		t !== null && SB(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? xB(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < _B ? t : null);
	}
	forgetNearTop() {
		this.nearTop = null;
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(pB), e?.setAttribute(pB, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, yB = {
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
function bB(e) {
	let t = e.closest(`.${lB}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(oB) === !0 ? t : null;
}
function xB(e) {
	let t = e.closest(`.${cB}`);
	return t?.parentElement?.parentElement?.classList.contains(oB) === !0 ? t : null;
}
function SB(e) {
	let t = e.parentElement, n = t === null ? null : CB(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== D.translate(r, i) && D.write(e, "aria-label", r, i);
}
function CB(e) {
	for (let t of e.querySelectorAll(mB)) {
		let n = xB(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function wB(e, t) {
	let n = OB(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function TB(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(oB);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(oB) || t.querySelector(`.${oB}`) !== null)) return !0;
	return !1;
}
function EB(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${oB}`)) t.add(e);
	}
	return t;
}
function DB(e) {
	return Array.from(e.querySelectorAll(`:scope > .${sB}`));
}
function OB(e) {
	return DB(e).filter((e) => e.getClientRects().length > 0);
}
function kB(e) {
	return e.getAttribute(Jn);
}
function AB(e) {
	return DB(e).map((e) => e.querySelector(`:scope > .${cB}`)?.getAttribute("data-ui-pane") ?? "").join(gB);
}
function jB(e, t, n) {
	let r = DB(e), i = FB(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${cB}`), n = t?.getAttribute(Yn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && MB(e, o, n);
}
function MB(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (WB(e), !n || jm()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? PB(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: z.normal + 60,
			easing: z.ease
		});
	}
}
function NB(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || jm() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease
	});
}
function PB(e, t) {
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
function FB(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(gB).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function IB(e, t, n, r, i, a, o) {
	let s = e.map((e) => LB(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? RB(e, t, s, r, !0) : null,
		rowOrder: o ? RB(e, t, s, i, !1) : null
	};
}
function LB(e, t) {
	for (let n = t; n > 0; n--) {
		let t = e[n];
		if (t != null) return t;
	}
	return e[0] ?? {
		column: 1,
		row: 1,
		columnSpan: 24,
		rowSpan: 1
	};
}
function RB(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && HB(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => VB(a[e], i).start - VB(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && VB(a[u[s]], i).start === UB(a[u[s - 1]], i) || (s - d > 1 && (c = zB(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function zB(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = VB(i[e[0]], s).start, p = UB(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || BB(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = VB(i[l[t]], s);
		for (let e = 0; e < r; e++) m[h - 1 + e] = n - 1 + e;
		a[e] = s ? {
			...i[e],
			column: h,
			columnSpan: r
		} : {
			...i[e],
			row: h,
			rowSpan: r
		}, h += r;
	}), m;
}
function BB(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = VB(t, n).start, s = UB(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function VB(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function HB(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function UB(e, t) {
	let { start: n, span: r } = VB(e, t);
	return n + r;
}
function WB(e) {
	let t = KB(e.getAttribute(Xn)), n = KB(e.getAttribute(Zn));
	if (t === null && n === null) return;
	let r = DB(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${cB}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: KB(e.getAttribute("data-ui-pane-cells"), qB) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${cB}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	Pm.forEach((e, i) => {
		let l = IB(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(zm("--ui-placement-column", e), String(r.column)), t.style.setProperty(zm("--ui-placement-row", e), String(r.row)), t.style.setProperty(zm("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(zm("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), GB(e, "--ui-pane-columns", t, s), GB(e, "--ui-pane-rows", n, c);
}
function GB(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	Pm.forEach((a, o) => {
		i ? e.style.setProperty(zm(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(zm(t, a));
	});
}
function KB(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function qB(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function JB(e, t, n) {
	for (let r of OB(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function YB(e, t, n, r) {
	let i = OB(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = ZB(XB(a), i.map((e) => e.place === t || e.place === n ? null : XB(e.box)), r);
	return o === null ? null : i[o].place;
}
function XB(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function ZB(e, t, n) {
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
var QB = "ui-split-button", $B = "ui-split-button__main", eV = "ui-split-button__toggle", tV = "ui-split-button__menu", nV = "ui-split-button--open", rV = class {
	root;
	menus = new p_({
		show: ({ owner: e }) => e.classList.add(nV),
		hide: ({ owner: e }) => e.classList.remove(nV),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = iV(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${$B}`)?.closest(`.${QB}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !M(e)) return;
		let t = iV(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = aV(t), r = e.target.closest(`.${S}`);
		n !== null && r !== null && n.contains(r) && ZP(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = aV(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Wm(i) ? i : "bottom-end" },
			openers: oV(e)
		}) && wp(r, QP(r), t);
	}
};
function iV(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${eV}, .${$B}`), n = t?.closest(`.${QB}`) ?? null;
	return t === null || n === null || t.classList.contains($B) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function aV(e) {
	return e.querySelector(`:scope > .${tV}`);
}
function oV(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var sV = "ui-button-group", cV = "ui-button-group__item", lV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${sV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), B(this.root, `.${sV}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [ai]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = uV(i);
			i.toggleAttribute(ii, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		N(n, r ?? n.find(P) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cV}`), n = t?.closest(`.${sV}`) ?? null;
		if (t === null || n === null || t.closest(`.${sV}`) !== n || O(n)) return;
		let r = uV(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cV} > .${ki}`), n = t?.closest(`.${sV}`) ?? null;
		if (t === null || n === null || !M(e)) return;
		let r = this.ownItems(n).map(uV).filter((e) => e !== null), i = Iu({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${cV}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		od(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ai,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return id(e, `.${cV}`, `.${sV}`);
	}
};
function uV(e) {
	return e.querySelector(`:scope > .${ki}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var dV = "ui-accordion", fV = "details", pV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${dV}`)), B(this.root, `.${dV}`, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.normalizeAll(e));
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
		t instanceof HTMLDetailsElement && !t.open && this.closeSiblings(t);
	}
	handleToggle(e) {
		let t = e.target;
		t instanceof HTMLDetailsElement && t.open && this.closeSiblings(t);
	}
	closeSiblings(e) {
		let t = e.parentElement;
		if (t !== null && t.classList.contains(dV)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${fV}`)];
	}
}, mV = "ui-tab-overflow", hV = "ui-tab-overflow__menu", gV = "ui-tab-overflow__menu--open", _V = "ui-tab-overflow__entry", vV = "ui-tab-overflow__entry--current", yV = class {
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
		this.options = e, this.list = new SV(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : bV({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return xV(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function bV(e) {
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
function xV(e, t, n) {
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
var SV = class {
	menu;
	button = null;
	list = new p_({
		show: ({ popup: e }) => e.classList.add(gV),
		hide: ({ popup: e }) => {
			e.classList.remove(gV), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = hV, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(CV)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${vV}`);
		this.button = e, eh(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		vN(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_V}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || yN(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${_V}`) : null;
		t !== null && SN(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${_V}`));
	}
};
function CV(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${_V} ${Ai}`, t.classList.toggle(vV, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(_i), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var wV = "data-ui-caption-text", TV = ".ui-text__title";
function EV(e) {
	for (let t of e.querySelectorAll(TV)) {
		let e = t.textContent ?? "";
		t.getAttribute(wV) !== e && t.setAttribute(wV, e);
	}
}
function DV(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || jm()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease,
		pseudoElement: "::after"
	});
}
function OV(e) {
	if (!(e === null || jm())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: z.fast,
		easing: z.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var kV = "ui-tabs", AV = "ui-tab-caption", jV = "ui-tab-caption--selected", MV = "ui-tab-caption--overflowed", NV = "ui-tabs--overflowing", PV = "ui-tabs--no-overflow", FV = "ui-tabs__strip", IV = "ui-tabs__band", LV = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new yV({
			rootClass: kV,
			overflowingClass: NV,
			wraps: (e) => e.classList.contains(PV),
			hiddenClass: MV,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${kV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), B(this.root, `.${kV}`, {
			childList: !0,
			attributeFilter: [ci, ...mi],
			relevant: (e) => !Qh(e, `[${di}]`, `.${kV}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(RV), i = sd(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(jV)) ?? null, o = null;
		for (let n of id(e, `[${fi}]`, `.${kV}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(jV, n), e.setAttribute("aria-selected", n ? "true" : "false"), EV(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), DV(a, o), N(n.filter((e) => !e.classList.contains(MV)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && OV(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${FV}, :scope > .${IV} > .${FV}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute("data-ui-tab-key") ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(RV).map((e) => {
				let n = e.getAttribute("data-ui-tab-key") ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: O(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mV}`), n = t?.closest(`.${kV}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${kV}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${AV}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${kV}`), a = r.getAttribute(ui);
		i !== null && a !== null && r.closest(`.${kV}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Cu(e) || !M(e)) return;
		let t = e.target.closest(`.${AV}`), n = t?.closest(`.${kV}`) ?? null;
		if (t === null || n === null) return;
		let r = Iu({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		od(e, t, {
			attribute: ci,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return id(e, `.${AV}`, `.${kV}`);
	}
	ownPages(e) {
		return id(e, `[${di}]`, `.${kV}`);
	}
};
function RV(e) {
	return e.classList.contains(MV) || WF(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function zV(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function BV(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function VV(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var HV = "ui-command-bar", UV = "ui-command-bar__host", WV = "ui-command-bar__item", GV = "ui-command-bar__overflow", KV = "ui-command-bar--overflowing", qV = "ui-command-bar__overflowed", JV = "ui-orientation--vertical", YV = "ui-text__title", XV = `${Bf}, [${Fe}]`, ZV = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new yV({
			rootClass: HV,
			overflowingClass: KV,
			wraps: (e) => !nH(e),
			hiddenClass: qV,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${HV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), B(this.root, `.${HV}`, {
			childList: !0,
			addedOnly: !0,
			relevant: QV
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = $V(e), n = e.querySelector(`:scope > .${GV}`);
		if (t === null || n === null) return;
		let r = rH(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(KV) && iH(r);
		for (let e of r) Qm(e, e.classList.contains(qV) ? n : null);
		e.classList.contains(JV) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), eH(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${GV}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(HV) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !M(e) || Cu(e)) return;
		let t = e.target.closest(`.${HV}`), n = t === null ? [] : tH(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Iu({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(JV) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), eH(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${HV}`) ?? null;
		t !== null && n !== null && tH(n).includes(t) && eH(n, t);
	}
	entriesOf(e) {
		let t = $V(e), n = t === null ? [] : rH(t).filter((e) => e.classList.contains(WV) && e.classList.contains(qV)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: aH(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && oH(n).click();
	}
};
function QV(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(HV) || t.classList.contains(UV) || t.classList.contains(WV))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(HV) || t.querySelector(`.${HV}`) !== null)) return !0;
	return !1;
}
function $V(e) {
	return e.querySelector(`:scope > .${UV}`);
}
function eH(e, t) {
	let n = tH(e), r = n.find((e) => e.tabIndex >= 0 && P(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(P) ?? null;
	for (let e of n) e === i ? BV(e) : zV(e);
}
function tH(e) {
	let t = $V(e), n = [];
	for (let e of t === null ? [] : rH(t)) if (e.classList.contains(WV) && !e.classList.contains(qV)) for (let t of e.querySelectorAll(XV)) VV(t) && Pu(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${GV}`);
	return r !== null && e.classList.contains(KV) && n.push(r), n;
}
function nH(e) {
	let t = $V(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function rH(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(WV) ? n.querySelector(C) : null;
		e !== null && WF(e) && t.push(n);
	}
	return t;
}
function iH(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(WV) ? t ||= !r.classList.contains(qV) : t || r.classList.add(qV);
	}
}
function aH(e) {
	let t = oH(e), n = t.querySelector(`.${YV}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function oH(e) {
	return e.matches(Bf) ? e : e.querySelector(Bf) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var sH = "ui-breadcrumbs", cH = "ui-breadcrumbs__item", lH = "ui-breadcrumb", uH = "ui-breadcrumb--current", dH = "ui-hidden", fH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), B(this.root, `.${sH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ...mi]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${sH}`)) this.apply(e);
	}
	apply(e) {
		let t = id(e, `.${cH}`, `.${sH}`);
		pH(t);
		let n = t.filter((e) => !e.classList.contains(dH)).map((e) => e.querySelector(`.${lH}`)).filter((e) => e !== null && !e.classList.contains(dH)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(uH, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function pH(e) {
	let t = Pm.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Pm.map((e, t) => mH(r, t));
		if (hH(r, Ar, Pm.filter((e, t) => i[t])), hH(r, jr, Pm.filter((e, n) => !t[n])), !r.classList.contains(dH)) for (let e = 0; e < Pm.length; e++) t[e] ||= !i[e];
	}
}
function mH(e, t) {
	for (let n of e.children) if (n.getAttribute(mi[t]) === "collapsed") return !0;
	return !1;
}
function hH(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var gH = "ui-color-input", _H = "ui-color-input--open", vH = "ui-color-input__popup", yH = "ui-color-input__text", bH = "ui-color-input__row", xH = "ui-color-input__swatch--button", SH = "ui-color-input__value-input", CH = "ui-color-input__square-thumb", wH = "ui-color-input__hue-thumb", TH = "data-ui-color-toggle", EH = "data-ui-color-tab", DH = "data-ui-color-tab-selected", OH = "data-ui-color-pane", kH = "data-ui-color-pane-selected", AH = "data-ui-color-square", jH = "data-ui-color-hue", MH = "data-ui-color-hex", NH = "data-ui-color-channel", PH = "data-ui-color-factor", FH = "data-ui-color-opacity", IH = "data-ui-color-name", LH = "data-ui-color-name-selected", RH = "data-ui-color-format", zH = "data-ui-color-variant", BH = "data-ui-color-no-picker", VH = "data-ui-color-no-palette", HH = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new p_({
		show: ({ owner: e }) => e.classList.add(_H),
		hide: ({ owner: e }) => e.classList.remove(_H)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${gH}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Pa(e.components, `.${gH}`));
		}), B(this.root, `.${gH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				RH,
				zH,
				BH,
				VH
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Ag({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${AH}], [${jH}]`),
			begin: (e, t) => {
				let n = e.closest(`.${gH}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(AH) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${SH}`)?.value ?? null
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
		let t = qH(e), n = this.states.get(e), r = n?.paneChosen === !0 ? UH(e, n.pane) : WH(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? GH(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = tU(t);
			if (i === null) return n ?? GH(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && KH(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = iU(a, o, s);
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
			...n ?? GH(r),
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
			let [e, a, o] = iU(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), ZH(e, "--ui-color-input-color", t.held ? rU(n, r, i, t.opacity) : "transparent"), ZH(e, "--ui-color-input-solid", rU(n, r, i, 255)), ZH(e, "--ui-color-input-on-color", t.held ? OS(n, r, i, t.opacity) : "inherit"), XH(e, t.held ? YH(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${AH}]`), o = e.querySelector(`[${jH}]`), [s, c, l] = aU(t.hue, 1, 1);
		if (ZH(e, "--ui-color-input-hue", rU(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${CH}`);
			e !== null && (ZH(e, "left", `${t.saturation * 100}%`), ZH(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${wH}`);
			e !== null && ZH(e, "top", `${t.hue / 360 * 100}%`);
		}
		QH(e, `[${MH}]`, nU(n, r, i)), QH(e, `[${NH}="r"]`, String(n)), QH(e, `[${NH}="g"]`, String(r)), QH(e, `[${NH}="b"]`, String(i)), ZH(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), $H(e, `[${FH}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${IH}]`)) n.getAttribute(IH) === t.name ? n.setAttribute(LH, "") : n.removeAttribute(LH);
		let n = t.name === null ? null : e.querySelector(`[${IH}="${Ui(t.name)}"]`), r = n === null ? null : tU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		ZH(e, "--ui-color-input-base", r === null ? "transparent" : rU(r[0], r[1], r[2], 255)), $H(e, `[${PH}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${OH}]`)) n.getAttribute(OH) === t.pane ? n.setAttribute(kH, "") : n.removeAttribute(kH);
		for (let n of e.querySelectorAll(`[${EH}]`)) n.getAttribute(EH) === t.pane ? n.setAttribute(DH, "") : n.removeAttribute(DH);
	}
	resolveRgb(e, t) {
		if (t.name === null) return aU(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${IH}="${Ui(t.name)}"]`), r = n === null ? null : tU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? aU(t.hue, t.saturation, t.value) : eU([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${TH}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${gH}`));
			return;
		}
		let n = e.target.closest(`[${EH}]`), r = e.target.closest(`.${gH}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(EH), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${IH}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(IH)
			}));
			return;
		}
		let a = r.querySelector(`.${vH}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${gH}`);
		t !== null && (e.target.hasAttribute(PH) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(FH) && this.commit(t, (t) => ({
			...t,
			opacity: ES(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${gH}`);
		if (n === null) return;
		if (t.hasAttribute(PH) || t.hasAttribute(FH)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(MH)) {
			let e = tU(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = iU(e[0], e[1], e[2]);
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
		let r = t.getAttribute(NH);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = ES(Number(t.value));
		let [l, u, d] = iU(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${SH}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = oU((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = oU((t.x - a.left) / a.width), s = 1 - oU((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || A(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${SH}`);
		a !== null && (a.value = JH(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${SH}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(BH) && e.hasAttribute(VH)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${vH}`);
		if (t === null) return;
		let n = e.getAttribute(zH) === "swatch", r = n ? e.querySelector(`.${xH}`) : e.querySelector(`.${bH}`), i = n ? r : r?.querySelector(`[${TH}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${DH}]`) ?? !0
		});
	}
};
function UH(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? BH : VH))(t) ? t : t === "picker" ? "palette" : "picker";
}
function WH(e) {
	return UH(e, "picker");
}
function GH(e) {
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
function KH(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function qH(e) {
	return e.querySelector(`.${SH}`)?.value.trim() ?? "";
}
function JH(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = nU(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${DS(e.opacity)}`;
}
function YH(e, t, n, r, i) {
	if (e.getAttribute(RH) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = nU(t, n, r);
	return i === 255 ? a : `${a}${DS(i)}`;
}
function XH(e, t) {
	for (let n of e.querySelectorAll(`.${yH}`)) n.textContent !== t && (n.textContent = t);
}
function ZH(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function QH(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function $H(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function eU(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		ES(e[0] * (1 - n)),
		ES(e[1] * (1 - n)),
		ES(e[2] * (1 - n))
	] : [
		ES(e[0] + (255 - e[0]) * n),
		ES(e[1] + (255 - e[1]) * n),
		ES(e[2] + (255 - e[2]) * n)
	];
}
function tU(e) {
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
function nU(e, t, n) {
	return `#${DS(e)}${DS(t)}${DS(n)}`;
}
function rU(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function iU(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function aU(e, t, n) {
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
		ES((o + a) * 255),
		ES((s + a) * 255),
		ES((c + a) * 255)
	];
}
function oU(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var sU = `:is(.ui-surface, .ui-card, .${wt})[${y}]`, cU = "ui-surface--clickable", lU = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Ql();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), mU(t, ["hover", "press"], (e) => pU(e.closest(ku))), B(t, sU, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(sU));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(sU) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		e.classList.contains(cU) ? (this.pressable.add(e), gU(e, "role", fU(e) ? "group" : "button"), gU(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : dU(e) ? "-1" : "0")) : this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	handleKeyDown(e) {
		let t = uU(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function uU(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(cU) && t.hasAttribute("tabindex") ? t : null;
}
function dU(e) {
	let t = e.closest(ld);
	return t !== null && t.closest(F)?.matches(".ui-items-view, .ui-table") === !0 && ju(t) === e;
}
function fU(e) {
	for (let t of e.querySelectorAll(ku)) if (Pu(e, t)) return !0;
	return !1;
}
function pU(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${cU}`) ?? null; n !== null; n = n.parentElement?.closest(`.${cU}`) ?? null) t.push(n);
	return t;
}
function mU(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || hU(t, e, !1);
		for (let t of a) hU(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function hU(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), gU(e, ni, r.length === 0 ? null : r.sort().join(" "));
}
function gU(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var _U = "ui-table", vU = "ui-table--reorderable", yU = "ui-scroll-x--auto", bU = "ui-scroll-x--always", xU = `:scope > .${rr}`, SU = `.${ar}`, CU = "ui-table__header-cell", wU = `${CU}--pinned`, TU = `${xU} > .${ir} > .${CU}`, EU = `${TU}--pinned`, DU = "ui-table__host", OU = `${xU} > .${DU}`, kU = `.${_U}, .${nr}, [${Qn}]`, AU = "--ui-table-columns", jU = "--ui-table-sticky-top", MU = "--ui-table-sticky-bottom", NU = "--ui-table-sized-columns", PU = "--ui-table-pin-", FU = 64, IU = "data-ui-table-cell-hidden", LU = "data-ui-table-cell-last", RU = "columns", zU = "hidden", BU = "order", VU = "layout", HU = 32, UU = 16, WU = class {
	root;
	store = new yP();
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
		if (this.root = e.root ?? document, this.drag = new Ag({
			root: this.root,
			resolveHandle: (e) => e.closest(SU),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new Ag({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), mU(this.root, ["hover", "press"], (e) => {
			let t = e.closest(SU)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Pm) e !== "base" && matchMedia(Im(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${_U}`)), B(this.root, `.${_U}`, {
			childList: !0,
			relevant: YU
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), B(this.root, `.${_U}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(_U)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), B(this.root, `.${_U}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: XU
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(OU);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Lz(t, () => this.pin(t));
			let e = t.querySelector(xU);
			e !== null && Lz(e, () => GU(t, e));
			let n = t.querySelector(OU);
			n !== null && (this.markScrollbar(t, n), Lz(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, RU), r = n === null ? null : Zc(n);
		r !== null && r.length !== t.length ? (this.store.write(e, RU, null), this.store.writeBoot(e, VU, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, BU);
		i !== null && !QU(i, t) ? (this.store.write(e, BU, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(gr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${_U}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = ZU(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(yU) || e.classList.contains(bU);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(NU);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = El(t, n);
				e.style.setProperty(NU, tl(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Pd}${t}`, String(r[t])) : e.style.removeProperty(`${Pd}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(tr) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(tr, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(dr) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(dr, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(vU)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= FU) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Qn}]`)) {
				let r = Number(t.getAttribute(Qn));
				r >= FU && t.closest(`.${_U}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(IU, n.hidden.has(r)), t.toggleAttribute(LU, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), zd(e, ZU(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(TU)) {
			let e = Number(n.getAttribute(Qn)), r = n.getAttribute($n), i = n.classList.contains(wU) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: nW(r) ? r : null,
				startsHidden: n.hasAttribute(er),
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
		for (let e of t) (n[e.key] ?? tW(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, zU) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(AU).trim(), n = t.length === 0 ? null : Zc(t);
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
		n === null || i !== void 0 && n === tW(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, zU, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return ZU(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(EU).length;
		if (t < 2) return;
		let n = Sl(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${PU}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${_U}`)?.toggleAttribute(hr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(xU), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return qU(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && M(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(SU), n = t ?? (e.shiftKey ? KU(e.target) : null);
		if (n === null || this.drag.active || !M(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Xc(UU, i.sizes.reduce((e, t) => e + t, 0)) : UU;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${_U}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Qn)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = ZU(c.places).filter((e) => !c.hidden.has(e));
			wk(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(SU) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${_U}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = ll(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(HU, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, JU(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, RU, t === null ? null : tl(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(NU).trim(), n = e.getAttribute(tr), r = {};
		t.length > 0 && (r[NU] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, VU, null) : this.store.writeBoot(e, VU, {
			styles: r,
			attributes: {
				[tr]: n,
				[dr]: e.getAttribute(dr)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${_U}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = il(t.getAttribute(Wn)), a = al(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(Qn)), d = this.hiddenOf(t, s), f = ZU(c), p = (c[u] ?? -1) + 1;
		for (; p < f.length && d.has(f[p]);) p++;
		let m = p < f.length ? f[p] : -1;
		return !Number.isInteger(u) || u < 0 || m < 0 || l.length < a.length ? (this.warner.warn(t, "the handle's column could not be found in its table.", {
			index: u,
			tracks: a.length,
			sizes: l.length
		}), null) : {
			table: t,
			index: u,
			after: m,
			tracks: a,
			sizes: l,
			floors: o,
			before: n
		};
	}
	resolveCaption(e) {
		let t = e.closest(`.${CU}`), n = t?.closest(`.${_U}`) ?? null;
		return t === null || n === null || !n.classList.contains(vU) || e.closest(SU) !== null || t.classList.contains(wU) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${_U}`), r = Number(e.getAttribute(Qn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map($U), s = n.querySelector(xU), c = getComputedStyle(n).direction === "rtl";
		return n.setAttribute(fr, ""), e.setAttribute(pr, ""), {
			table: n,
			index: r,
			origin: t,
			places: i,
			middles: o,
			scroll: s,
			scrolledAt: s?.scrollLeft ?? 0,
			rightToLeft: c,
			from: a,
			target: a
		};
	}
	movableColumns(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = new Map(t.map((e) => [e.index, e])), i = [];
		for (let a of ZU(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, eW(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(mr, "after") : o.cell.setAttribute(mr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(pr), t.table.removeAttribute(fr), eW(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Mg(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = ZU(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, BU, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function GU(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${DU}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(jU, `${n}px`), e.style.setProperty(MU, `${r}px`);
}
function KU(e) {
	let t = e.matches(`.${CU}`) ? e.querySelector(`:scope > ${SU}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function qU(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function JU(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function YU(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(kU) || t.querySelector(kU) !== null)) return !0;
	return !1;
}
function XU(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(DU);
}
function ZU(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function QU(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function $U(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function eW(e) {
	for (let t of e.querySelectorAll(`[${mr}]`)) t.removeAttribute(mr);
}
function tW(e) {
	return e.startsHidden || e.hideBelow !== null && Pm.indexOf(Rm()) < Pm.indexOf(e.hideBelow);
}
function nW(e) {
	return e !== null && Pm.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var rW = /* @__PURE__ */ new WeakMap();
function iW(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(rn);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = aW(i, a) ?? oW(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) n.has(t) || t.remove();
}
function aW(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : rW.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function oW(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (uW(i, t.getAttribute(b)), rW.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function sW(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e);
		i === void 0 ? n.set(e, [r]) : i.push(r);
	}
	return {
		buckets: n,
		order: [...n.keys()]
	};
}
function cW(e) {
	return e.find((e) => !e.classList.contains(bi));
}
function lW(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return uW(o, r), o.appendChild(a), o;
}
function uW(e, t) {
	e.setAttribute(Ft, ""), t === null ? e.removeAttribute(It) : e.setAttribute(It, t);
}
var dW = "bottom", fW = "pending", pW = "focus";
function mW(e, t, n) {
	let r = hW(e, t);
	n <= 0 ? r?.remove() : (r ??= gW(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function hW(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function gW(e) {
	let t = document.createElement("div");
	return t.setAttribute(Yt, e), t.style.flexShrink = "0", t;
}
function _W(e, t) {
	let n = hW(e, pW);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? gW(pW);
	return r.style.height = `${t}px`, r;
}
function vW(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function yW(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var bW = /* @__PURE__ */ new WeakMap();
function xW(e) {
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) t.remove();
}
function SW(e, t, n, r, i, a) {
	let o = uk(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = tk(i.getItemsFilterSortMetadata(t), a, YO(e));
	if (c && !l && (xW(e), bW.delete(e)), o.length === 0) return;
	let d = OO(e);
	if (!l) {
		yW(e, [...nk(o, u, r), ...DO(d)]);
		return;
	}
	let { buckets: f, order: p } = sW(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = bW.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = nk(n, u, r));
		let i = t === "" ? void 0 : cW(n);
		if (i !== void 0) {
			let n = CW(e, h?.get(t), i) ?? lW(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) v.has(t) || t.remove();
	bW.set(e, g), yW(e, [..._, ...DO(d)]);
}
function CW(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return uW(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var wW = "ui-tree-rules", TW = `:scope > .${sr}:not(.${ur})`, EW = null;
function DW(e, t, n) {
	EW === null ? OW(e, t, n) : (EW.hosts.set(e, {
		componentId: t,
		context: n
	}), W(e) === "virtualized" && EW.drawing.add(e));
}
function OW(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(wW, { bubbles: !0 })), kO(e, t, n.templates, n.renderer, e.querySelector(TW) !== null);
	else switch (W(e)) {
		case "windowed":
			kO(e, t, n.templates, n.renderer), AW(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			QO(e, t, n.metadata, n.renderer, n.state), kW(e), kO(e, t, n.templates, n.renderer), SW(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function kW(e) {
	let t = Nf(e);
	t !== null && Mf(t, G(e).filter((e) => e instanceof HTMLElement));
}
function AW(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	iW(e, (e) => lW(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function jW(e) {
	if (EW !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	EW = t;
	try {
		e();
	} finally {
		EW = null;
		for (let [e, n] of t.hosts) MW(e, n);
	}
}
function MW(e, t) {
	try {
		e.isConnected && OW(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function NW(e) {
	if (EW !== null && EW.drawing.size !== 0) for (let t of EW.drawing) {
		let n = EW.hosts.get(t);
		n !== void 0 && e(t) && (EW.drawing.delete(t), EW.hosts.delete(t), MW(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var PW = "fold", FW = ["fold-hidden", "fold-shown"], IW = ".ui-table", LW = `:scope > .${rr} > .${ir} > [role='columnheader']`, RW = `:scope > .${ar}`, zW = "input:not([type='hidden']), button, select, textarea, a[href]", BW = /* @__PURE__ */ new WeakMap();
function VW(e) {
	for (let t of e.querySelectorAll(LW)) {
		let e = HW(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function HW(e) {
	let t = e.querySelector(zW);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(RW);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function UW(e, t = null) {
	let n = WW(e), r = BW.get(e), i = n.find((e) => t !== null && KW(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (GW(e, i), !0);
}
function WW(e) {
	let t = Fd(e), n = [];
	for (let r of e.querySelectorAll(LW)) {
		let e = HW(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && P(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function GW(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), BW.set(e, t), t.focus();
}
function KW(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function qW(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(IW) && HW(t) === e ? n : null;
}
function JW(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(KW(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Lu(e.key, "horizontal")) return !1;
	let r = Iu({
		key: e.key,
		items: WW(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && GW(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var YW = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), XW = ".ui-table", ZW = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), QW = `:scope > [${x}], :scope > .${rr}, :scope > .${rr} > [${x}]`, $W = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(F)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), B(this.root, F, { childList: !0 }, (e) => this.applyAll(e)), B(this.root, F, { attributeFilter: [
			ri,
			ai,
			oi,
			Xt
		] }, (e) => {
			for (let t of e) this.remark(t);
		}), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [Ne]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = Nd(e);
		yd(e, t);
		for (let t of e.querySelectorAll(QW)) tG(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(XW) && VW(e);
			for (let n of t) {
				let t = ju(n);
				t !== null && tG(t);
				for (let e of Mu(n)) tG(e);
				eG(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : Od(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = fO(r, en) !== null, a = n === "first" ? dO(r) === 0 && !pO(r, "data-ui-window-more-before") : !pO(r, nn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Cf(n === "first" ? "Home" : "End", t, null, lG(e));
		o !== null && (tf(e, t, o), e.getAttribute("data-ui-selection") === "one" && xd(e, t, o, dd));
	}
	remark(e) {
		let t = Nd(e);
		yd(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, F);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Nd(n);
		tf(n, i, r, e.target instanceof Element ? vf(r, e.target) : null), R(n), n.hasAttribute("data-ui-no-row-select") ? md(n, r) : xd(n, i, r, hd(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(ld), r = n?.closest(F) ?? null;
		return n === null || r === null || n.closest(F) !== r || !r.matches(t) || O(r) ? null : Fu(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Od(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, ud);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Of(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Cu(e)) return;
		let t = qW(e.target);
		if (t !== null && !O(t)) {
			JW(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Kd(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r) || rf(r) && nG(e) && this.handleCellKey(r, e)) return;
		let i = lG(r);
		if (!YW.has(e.key) && !xf(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Nd(r), o = Xd(a), s = Cf(e.key, a, Zd(a), i);
		if (s !== null) {
			e.preventDefault(), tf(r, a, s, e.key === "ArrowUp" && !e.shiftKey && rf(r) ? _f(s) : null), iG(r, a, o, s, gd(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(XW) && UW(r, ff(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = ju(o);
		switch (e.key) {
			case " ":
				aG(r, a, o, c);
				break;
			case "Enter":
				sG(r, a, o, c);
				break;
			case "Delete":
				if (!oG(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Nd(e), r = Zd(n);
		if (r === null || k(r)) return !1;
		let i = df(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = pf(e, r, i, t.key);
				return o !== null && tf(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? mf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), tf(e, n, r, o), !0);
			}
			default: return i !== null && rG(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Od(e) : null;
		if (n === null || W(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? dO(n) === 0 && !pO(n, "data-ui-window-more-before") : !pO(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Gu(n, r ? 0 : Wu(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Od(e);
		if (n === void 0 || r === null) return;
		let i = Lf(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Zd(Nd(e)) : null, o = i ?? (a === null ? null : L(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Od(e), n = Lf(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Nd(e), r = Zd(n) ?? Cf("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (tf(e, n, r, of(r, t)), e.getAttribute("data-ui-selection") === "one" && xd(e, n, r, dd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(QW)].includes(t)) {
			R(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(F) && e.target.matches(".ui-items-view, .ui-table") && !O(e.target) && !tp()) {
			$d(e.target, Nd(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(ld) : null, i = r?.closest(F) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && Fu(e.target, r) !== null && tf(i, Nd(i), r, e.target instanceof Element ? vf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && rp(n, !0);
			for (let e of n.querySelectorAll(QW)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) tG(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(ld)) continue;
			let n = e.closest(F);
			n !== null && n.matches(".ui-items-view, .ui-table") && eG(n, e, e.hasAttribute(Ne));
		}
	}
};
function eG(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(F) === e && BV(n);
	else for (let n of t.querySelectorAll(Bf)) n.tabIndex >= 0 && n.parentElement?.closest(F) === e && Pu(t, n) && zV(n);
}
function tG(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function nG(e) {
	return ZW.has(e.key) || sT(e) !== null;
}
function rG(e, t) {
	let n = t.key, r = sT(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && bf(e, t)) return !0;
	let a = ju(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !gf(e))) return !1;
	let o = lp(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function iG(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && pd(e, n), xd(e, t, r, i, a));
}
function aG(e, t, n, r) {
	xd(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || cG(n, r);
}
function oG(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = uG(t, n);
	for (let e of r) Of(e, "remove");
	return r.length > 0;
}
function sG(e, t, n, r) {
	_d(e) && !bd(t).includes(n) && xd(e, t, n, dd), cG(n, r), r === null && Of(n, "open");
}
function cG(e, t) {
	t === null ? Of(e, Df) : t.click();
}
function lG(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function uG(e, t) {
	let n = bd(e);
	return (n.includes(t) ? n.filter((e) => e === t || I(e) !== null) : [t]).filter((e) => !Gc(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var dG = "ui-tree__row--folded", fG = "ui-tree__row--dragging", pG = "ui-tree__loading", mG = "ui-tree__loading-ring", hG = "ui-tree-node__text", gG = "ui-tree-node__toggle", _G = "ui-tree-node__rename", vG = ".ui-text__title", yG = lr, bG = "--ui-tree-depth", xG = "expanded", SG = 200, CG = 600, wG = .25, TG = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, EG = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), DG = "ui-tree-unfold-settled", OG = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(DG, { bubbles: !0 }));
	} }
}, kG = class {
	root;
	store = new yP();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(wW, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${or}`) : null;
			t !== null && (this.layout(t), Mf(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(DG, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => L(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${or}`)), B(this.root, `.${or}`, {
			childList: !0,
			attributeFilter: [
				vr,
				yr,
				xr,
				Er
			],
			relevant: PG
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = aA(e)?.getAttribute(vr);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = L(e), r = aA(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(yr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(bG, String(u)), e.setAttribute("aria-level", String(u + 1)), ef(e, r?.querySelector(`:scope > .${hG}`) ?? null), e.classList.toggle(dG, !d), e.classList.toggle(ur, _), e.removeAttribute(Tr), e.draggable = i && yO(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Cr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Cr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Cr), d && g && !_), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: g,
				authoredShown: h
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return aA(e.row)?.hasAttribute(xr) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, PW, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of FW) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Ia(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = YO(t);
		if (r === void 0 && i === null) return null;
		let a = tk(r, this.rules.state, i), o = ek(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(L)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = aA(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => rk(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(L(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${pG}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = L(o), c = i.getItemValue(o);
			if (c === void 0 || $O(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = aA(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(pG) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? FG();
		o.style.setProperty(bG, String(t)), o.classList.toggle(dG, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${gG}`) !== null || Gc(r, "data-ui-unselectable") && Fu(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Fu(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Of(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${sr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !O(t) && !tp() && $d(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || !(e.target instanceof Element)) return;
		let t = Kd(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && M(e, { alt: !0 }) ? TG[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !EG.has(e.key) && !xf(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Xd(i), o = Cf(e.key, i, Zd(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, gd(n, e));
		else if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					aG(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Cf("ArrowDown", i, a, "vertical"), dd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), dd);
					break;
				case "Enter":
					sG(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !oG(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Xd(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = LG(n), a = L(r), o = dA(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => L(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		wk(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Gc(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = IG(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Er) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = vO(t, this.rowsOf(n)), o = _O(n, i, a);
		r ? lv(e, n, t, fG, L(t), a.filter((e) => e !== t), xO(o, !0)) : dv(e, L(t), xO(o, !1)), SO(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(fG));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${or}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${sr}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
			mark: "",
			place: {
				parent: "",
				before: null
			}
		} : this.dropAt(t, a, n, e.clientY);
		o === null ? (this.markDrop(t, null), this.springOpen(t, null)) : (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a ?? r, o.mark, o.depth), this.dropPlace = o.place, this.springOpen(t, a !== null && o.mark === "" ? a : null));
	}
	dropAt(e, t, n, r) {
		let i = this.parentKeysOf(e), a = L(t), o = (e) => n.some((t) => L(t) === e || NG(i, e, L(t))), s = oA(t, aA(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? wG : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = LG(f), m = Number(t.style.getPropertyValue(bG)) || 0, h = new Set(n.map(L)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : hA(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !sA(v.parent, (e) => f.find((t) => L(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), CG)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${or}`);
		t !== null && fv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${or}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${yG}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && NG(a, L(e), L(t)))), s = r.getAttribute(yG) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), uv(t, fG), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = gA(LG(this.rowsOf(e)), t.map(L), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = aA(e)?.querySelector(`.${hG}`) ?? null;
			r !== null && (r.setAttribute(wr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ik(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = IG(e)?.closest(".ui-tree") ?? null;
		t !== null && (uv(t, fG), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		lA(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(L(n), aA(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = L(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e), a = this.rowsOf(e);
		i.delete(r), i.set(r, n), AG(i, a);
		let o = n ? a.filter((e) => e.classList.contains(dG)) : [];
		this.store.writeJson(e, xG, [...i]), this.layout(e), MG(o.filter((e) => !e.classList.contains(dG)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = jG(this.store.readJson(e, xG)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Xd(r);
		tf(e, r, t), n !== null && iG(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = aA(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => L(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${or}`), n = aA(e), r = n?.querySelector(vG) ?? null;
		t === null || n === null || r === null || Gc(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), iu({
			container: n,
			title: r,
			className: _G,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Sr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function AG(e, t) {
	if (e.size <= SG) return;
	let n = new Set(t.map(L)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= SG) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function jG(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function MG(e) {
	if (!(e.length === 0 || jm())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: z.fast,
		easing: z.enter
	});
}
function NG(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function PG(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function FG() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = pG, e.setAttribute(TO, ""), e.setAttribute("aria-hidden", "true"), t.className = mG, e.append(t, D.text("ui.tree.loading")), e;
}
function IG(e) {
	return e.target instanceof Element ? e.target.closest(`.${sr}`) : null;
}
function LG(e) {
	return e.map((e) => ({
		key: L(e),
		parent: aA(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: oA(e, aA(e)),
		shown: !e.classList.contains(ur)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var RG = {
	visibilityState: () => document.visibilityState,
	notificationPermission: BG
};
function zG(e) {
	return e !== "hidden";
}
function BG() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var VG = 200;
function HG(e = RG) {
	return {
		visible: zG(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var UG = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? RG, this.settleMilliseconds = e.settleMilliseconds ?? VG;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = HG(this.source), this.held;
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
		let t = HG(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function WG(e) {
	return {
		permission: BG,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function GG(e, t, n = WG()) {
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
function KG(e, t, n, r = window.location) {
	e.bringTo !== void 0 && qG(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function qG(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function JG(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var J = "ui-tabs-view", YG = "ui-tab-item__label", XG = "ui-tab-item__close", ZG = "ui-tab-item__rename", QG = "ui-tab-item__caption", $G = "ui-tab-item__pin", eK = ".ui-text__title", tK = "ui-tab-item--dragging", nK = "ui-tab-item__caption--overflowed", rK = "ui-tabs-view--overflowing", iK = "ui-tabs-view--no-overflow", aK = "ui-tab-item__page", oK = "ui-tab-item--selected", sK = `.${S}`, cK = "tab-menu-entry", lK = {
	name: cK,
	registration: { dynamicParameters: (e) => dF(e.domEvent.detail?.entry, e.dynamicParameters) }
}, uK = "tab-pin";
function dK(e) {
	return {
		name: uK,
		registration: uO((e) => Ok(e.target), e)
	};
}
var fK = "--ui-tabs-view-strip", pK = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new yV({
			rootClass: J,
			overflowingClass: rK,
			wraps: (e) => e.classList.contains(iK),
			hiddenClass: nK,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => wK(e) === t.key))?.querySelector(`.${YG}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(gF, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), mU(this.root, ["press"], (e) => {
			let t = e.closest(`.${XG}`)?.closest(`.${QG}`) ?? null;
			return t === null ? [] : [t];
		}), B(this.root, `.${J}`, {
			childList: !0,
			attributeFilter: [
				ci,
				be,
				ce,
				...mi
			],
			relevant: (e) => !Qh(e, `.${aK}`, `.${J}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${J}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		hK(e, t);
		let n = t.filter(WF), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = sd(n, r, wK);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(oK))?.querySelector(`.${QG}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = wK(e) === r;
			e.classList.toggle(oK, t);
			let i = e.querySelector(`.${QG}`);
			i !== null && (i.draggable = a, EV(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${YG}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${aK}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${aK}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), DV(o, c), o !== null && o !== c && OV(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${YG}`);
			t === null || e.classList.contains(nK) || (u.push(t), e === c && (d = t));
		}
		N(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && R(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !WF(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(fK, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${mV}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => wK(e) === t)?.querySelector(`.${YG}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(WF).map((e) => ({
				key: wK(e),
				title: e.querySelector(`.${YG}`)?.textContent?.trim() ?? wK(e),
				current: wK(e) === t,
				disabled: O(e.querySelector(`.${YG}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${Ek}`);
		if (n === null || !n.classList.contains(J) || r === null || r.closest(`.${J}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = vK(n, r), a = bK(t), o = a.map((e) => {
			if (yK(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? WF(e) ? "shown" : "hidden";
		});
		uF(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: wK(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(sK);
		if (t === null || n === null || !n.classList.contains(J) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => wK(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(cK, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (vK(n, o).get(i) !== !0) return !0;
		switch (i) {
			case rF: {
				let e = o.querySelector(`.${YG}`);
				e !== null && this.startRename(e);
				break;
			}
			case iF:
			case aF:
				this.setPinned(n, o, i === iF);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${QG} > .${$G}`);
		t.toggleAttribute(pi, n), r !== null && (r.toggleAttribute(pi, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = JG(a.map(CK));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Dk(a[a.length - 1]).after(Dk(t)) : Dk(s).before(Dk(t)), t.dispatchEvent(new Event(uK, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${mV}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(J)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = xK(e.target), i = r?.closest(`.${J}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${Ek}`);
		a !== null && a.closest(`.${J}`) === i && (e.preventDefault(), this.select(i, wK(a)), document.activeElement !== r && R(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${XG}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${J}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), gK(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = xK(e.target), n = t?.closest(`.${J}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(eK) ?? e, r = e.closest(`.${Ek}`);
		t === null || r === null || kk(r, "data-ui-unrenamable") || iu({
			container: t,
			title: n,
			className: ZG,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(li, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => R(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Cu(e)) return;
		let t = e.target.closest(`.${YG}`), n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && M(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${Ek}`);
		if (r === null || r.closest(`.${J}`) !== n) return;
		if (e.key === "Delete" && M(e)) {
			if (!_K(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && M(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!M(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${YG}`)).filter((e) => e !== null), a = Iu({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${Ek}`);
		o !== null && this.select(n, wK(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || kk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? Dk(t).after(Dk(i)) : Dk(t).before(Dk(i)), Ik(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = SK(e);
		if (t === null) return;
		if (kk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		lv(e, t.closest(`.${J}`) ?? t, t, tK, wK(t));
		let n = Dk(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${QG}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${tK}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${QG}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Dk(r), o = t.hasAttribute("data-ui-tab-pinned") ? mK(n, a) : null, s = o ?? Dk(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${J}`);
		t !== null && t.querySelector(`.${tK}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = SK(e);
		if (t === null) return;
		t.classList.remove(tK);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Dk(t), n.next);
			return;
		}
		let r = Dk(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${J}`);
		i !== null && Ik(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		od(e, t, {
			attribute: ci,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return id(e, `.${Ek}`, `.${J}`);
	}
};
function mK(e, t) {
	let n = null;
	for (let r of id(e, `.${Ek}`, `.${J}`)) {
		let e = Dk(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function hK(e, t) {
	let n = !t.some((e) => !kk(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function gK(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !kk(t, "data-ui-unremovable");
}
function _K(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && gK(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !O(t);
}
function vK(e, t) {
	return lF(cF(e.getAttribute(xe)), {
		pinned: t.hasAttribute(pi),
		renamable: !kk(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && gK(e, t)
	});
}
function yK(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function bK(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function xK(e) {
	return e.closest(`.${XG}`) !== null || ru(e) ? null : e.closest(`.${QG}`)?.querySelector(`:scope > .${YG}`) ?? null;
}
function SK(e) {
	return e.target instanceof Element ? e.target.closest(`.${QG}`)?.closest(".ui-tab-item") ?? null : null;
}
function CK(e) {
	return { pinned: e.hasAttribute(pi) };
}
function wK(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var TK = "button.ui-text__fold-toggle", EK = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(TK);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, DK = "ui-temporal-input__segments", OK = "ui-temporal-input__segment", kK = "ui-temporal-input__segment-literal", AK = "ui-temporal-input__segment--empty", jK = "data-ui-temporal-segment", MK = "data-ui-temporal-step-direction", NK = "data-ui-temporal-segments-of", PK = "--", FK = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), IK = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Pa(e.components, `.${K}`));
		}), B(this.root, `.${K}`, { attributeFilter: [...cj] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) uj(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${DK}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = dj(e), r = gj(e), i = q(e, wj(t));
		t.getAttribute(NK) !== n && (t.replaceChildren(...LK(n).map((e) => zK(e))), t.setAttribute(NK, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(jK);
			t === null ? n.textContent = VK(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = HK(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(AK, i === null), n.tabIndex = 0, UK(n, t, i, A(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return;
		let t = GK(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute(jK), i = WK(t), a = FK.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), qK(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), Nj(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = JK(e.key, gj(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = GK(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = GK(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Xy(this.wheelTurn, Yy(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(jK), n < 0 ? 1 : -1, WK(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${MK}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${MK}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = KK(n) ?? n.querySelector(`.${OK}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(jK), t.getAttribute(MK) === "up" ? 1 : -1, WK(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${OK}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, Wj(e, XK(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = YK(t), o = pj(fj(e), a) * n, s = a === "hour" ? 24 : 60, c = ((mj(i, a) + o) % s + s) % s;
		this.write(e, Wj(e, hj(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? hj(t, "hour", ZK(l, t.getHours() >= 12)) : hj(t, YK(n), l), i);
		}
		u && qK(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, XK(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? Uj(e);
	}
	write(e, t, n) {
		Nj(e, t, n), Vj(e), this.applySegments(e);
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
function LK(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = ps(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(RK(r)), n += r.length);
	}
	return t;
}
function RK(e) {
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
function zK(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = kK, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = OK, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(jK, e.unit), t.dataset.width = String(e.width), BK(t, e.unit), t;
}
function BK(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = YK(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function VK(e, t, n, r) {
	return t && n !== null ? cs(n, e, r) : e;
}
function HK(e, t, n, r) {
	if (n === null) return PK;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Ps(n.getHours()) : mj(n, YK(e));
	return String(i).padStart(t, "0");
}
function UK(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? Ps(n.getHours()) : mj(n, YK(t))));
}
function WK(e) {
	return wj(e.closest(`.${DK}`));
}
function GK(e) {
	let t = e instanceof Element ? e.closest(`.${OK}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || A(n) ? null : t;
}
function KK(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${OK}`) : null;
}
function qK(e, t, n) {
	Iu({
		key: n,
		items: [...e.querySelectorAll(`.${OK}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function JK(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function YK(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function XK(e, t) {
	return hj(e, "hour", ZK(Ps(e.getHours()), t === "pm"));
}
function ZK(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var QK = "datetime", $K = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${xt}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${xt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Pa(e.components, `.${xt}`))), B(this.root, `.${xt}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [QK],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Rs(a.getAttribute(Ct)), o = Ls(a.getAttribute(QK)), s = a.querySelector(`.${St}`);
			if (s === null || t && !eq(e, o, r)) continue;
			let c = o === null ? "" : Hs(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= zs(e) && o !== null;
		}
		i && vc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${xt}:is([${Ct}="relative"], [${Ct}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function eq(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Us(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var tq = `.${wt}`, nq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), D.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => rq(Pa(e.components, tq))), B(this.root, tq, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				Ot,
				kt,
				At,
				jt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(tq) !== null)
		}, rq);
	}
	applyAll() {
		rq(this.root.querySelectorAll(tq));
	}
};
function rq(e) {
	let t = D.language || document.documentElement.lang;
	for (let n of e) Yv(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var iq = /* @__PURE__ */ new Map();
function aq(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function oq(e, t, n, r) {
	let i = sq(e, t);
	return i !== null && (iq.set(e, {
		key: t,
		block: n
	}), cq(e, i, n, r), !0);
}
function sq(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function cq(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Hu(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = lq(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function lq(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function uq(e) {
	let t = iq.get(e);
	if (t === void 0) return;
	let n = sq(e, t.key);
	n === null ? iq.delete(e) : cq(e, n, t.block, "auto");
}
function dq(e) {
	if (iq.size !== 0 && e instanceof Node) for (let t of [...iq.keys()]) (!t.isConnected || Hu(t).contains(e)) && iq.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var fq = "data-ui-scroll-anchor", pq = "End", mq = `[${fq}="${pq}"]`, hq = 4, gq = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], _q = /* @__PURE__ */ new WeakSet();
function vq(e) {
	_q.add(e);
}
function yq(e) {
	dq(e);
	for (let t = e.closest(mq); t !== null; t = t.parentElement?.closest(mq) ?? null) _q.delete(t);
}
var bq = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of gq) this.root.addEventListener(e, (e) => xq(e), {
			capture: !0,
			passive: !0
		});
		B(this.root, `[${fq}="${pq}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [cn]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && Cq(t) && this.pinned.set(t, _q.has(t) || Tq(t) && !wq(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${fq}="${pq}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), _q.has(t) ? (this.pinned.set(t, !0), Sq(t)) : this.pinned.get(t) !== !1 && (wq(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), Sq(t)));
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
			if (!e.isConnected || r === null || !Cq(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? Sq(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !Cq(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && Sq(e);
	}
	followsEnd(e) {
		return _q.has(e) || this.pinned.get(e) !== !1 && !wq(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function xq(e) {
	dq(e.target);
	let t = e.target instanceof Element ? e.target.closest(mq) : null;
	t !== null && _q.delete(t);
}
function Sq(e) {
	e.scrollTop = e.scrollHeight;
}
function Cq(e) {
	return e.getAttribute(fq) === pq;
}
function wq(e) {
	return pO(e, nn);
}
function Tq(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= hq;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var Eq = `${Ou}, [role='menu'], [role='tab']`, Dq = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? Oq, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(Eq) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function Oq(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function kq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = jq(e, a, n), s = jq(e, a + 1, n);
	return Mq(t, o.top, s.top, o.line, s.line);
}
function Aq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = jq(e, a, n), s = jq(e, a + 1, n);
	return Mq(t, o.line, s.line, o.top, s.top);
}
function jq(e, t, n) {
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
function Mq(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var Nq = 250, Pq = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Kt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < Nq && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Kt}="${Ui(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Kt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = Fq(e, "data-ui-scroll-viewport") ?? Iq(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? Rq(e) : null, a = i === null ? null : Rq(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Aq(a, kq(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? Lq(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function Fq(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function Iq(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : Fq(e, x);
	return t === null ? null : Hu(t);
}
function Lq(e, t) {
	return t > 0 ? e / t : 0;
}
function Rq(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${qt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Jt}]`);
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
var zq = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", Bq = `.${ki}, .ui-action, .${S}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${zq}`, Vq = ".ui-expander__header", Hq = "ui-key-value-action__row", Uq = `${Bq}, ${`${ld}, .${Hq}`}`, Wq = "ui-pressing", Gq = "ui-press-held", Kq = "ui-press-placed", qq = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(aP, (e) => this.handleHold(e)), t.addEventListener(oP, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, z.ripple, !1), t.classList.add(Gq));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !jm();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = Jq(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(Wq), t.append(u);
		let f = i === null ? null : d.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
			duration: i,
			easing: z.ease,
			fill: "forwards"
		});
		this.presses.set(e, {
			element: t,
			wave: u,
			grow: f,
			hold: a,
			fills: performance.now() + (i ?? 0),
			rate: 1,
			fade: null
		});
	}
	handleHold(e) {
		let t = e instanceof CustomEvent ? e.detail : null, n = e.target;
		if (t === null || !(n instanceof HTMLElement) || O(n) || t.target.closest(Vq) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(Kq));
	}
	retime(e, t) {
		let n = performance.now(), r = Math.max(0, e.fills - n) * e.rate;
		e.grow === null || r === 0 || t <= n || (e.rate = r / (t - n), e.fills = t, e.grow.updatePlaybackRate(e.rate));
	}
	handleHoldEnd(e) {
		let t = e instanceof CustomEvent ? e.detail : null, n = t === null ? void 0 : this.presses.get(t.pointerId);
		t !== null && n !== void 0 && n.fade === null && (t.opened || n.hold ? this.end(t.pointerId, !t.opened) : this.retime(n, performance.now() + Math.max(0, n.fills - performance.now()) * n.rate));
	}
	pressedElement(e) {
		if (e.closest(".ui-tab-item__close, .ui-tab-item__rename") !== null) return null;
		let t = e.closest(zq) ?? e.closest(Uq);
		if (t === null || O(t) || t.matches(Vq)) return null;
		let n = e.closest(Ei);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(Bq) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Fu(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(F), r = n !== null && !e.classList.contains(Hq) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Gc(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : I(e);
	}
	raisesClick(e, t) {
		for (let n = t; n !== null; n = n.parentElement) {
			if (n.hasAttribute("data-ui-id") && this.clicks(n)) return !0;
			if (n === e) return !1;
		}
		return !1;
	}
	release(e, t) {
		e instanceof PointerEvent && this.end(e.pointerId, t || this.presses.get(e.pointerId)?.hold === !0);
	}
	finishAll() {
		for (let [e, t] of [...this.presses]) this.finish(e, t);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		if (n.grow === null) {
			this.finish(e, n);
			return;
		}
		n.element.classList.remove(Gq);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, z.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: z.normal,
			delay: a,
			easing: z.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(Wq, Gq, Kq), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function Jq(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = Uh, r.setAttribute("aria-hidden", "true"), i.className = Wh, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var Yq = "ui-overlay-scrollbar", Xq = "ui-overlay-scrollbar__box", Zq = "ui-overlay-scrollbar__thumb", Qq = "ui-overlay-scrollbar--shown", $q = "ui-overlay-scrollbar__thumb--held", eJ = "ui-overlay-scrollbar__arrow", tJ = "ui-overlay-scrollbar--near", nJ = "(hover: hover) and (forced-colors: none)", rJ = "--ui-overlay-thumb", iJ = "--ui-scroll-hung", aJ = 12, oJ = 2, sJ = 24, cJ = 12, lJ = 80, uJ = 40, dJ = 400, fJ = 50, pJ = 900, mJ = 400, hJ = 16, gJ = class {
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
	stepping = null;
	repeat = 0;
	frame = 0;
	settle = 0;
	scrolling = !1;
	fade = 0;
	inputAt = -Infinity;
	constructor(e = document) {
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = Yq, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), dg((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia(nJ), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
			capture: !0,
			passive: !0
		}), e.documentElement.addEventListener("pointerleave", () => this.leave()), e.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		}), e.addEventListener("wheel", (e) => this.noteInput(e), {
			capture: !0,
			passive: !0
		}), e.addEventListener("keydown", (e) => this.noteInput(e), {
			capture: !0,
			passive: !0
		}), window.addEventListener("keydown", (e) => this.cancelDrag(e), !0), window.addEventListener("resize", () => this.schedule());
	}
	createBar(e, t) {
		let n = e.createElement("div"), r = e.createElement("div"), i = this.createArrow(e, t, -1), a = this.createArrow(e, t, 1);
		return n.className = `${Xq} ${Xq}--${t}`, r.className = `${Zq} ${Zq}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
			axis: t,
			box: n,
			thumb: r,
			back: i,
			forward: a,
			scroller: null,
			view: null,
			rtl: !1,
			near: !1
		};
	}
	createArrow(e, t, n) {
		let r = e.createElement("div");
		return r.className = `${eJ} ${eJ}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
	}
	follow() {
		this.active = this.media.matches, this.drag = null, this.stopStepping(), this.target = null, this.hovered = !1, this.scrolling = !1, this.bars.y.near = !1, this.bars.x.near = !1, window.clearTimeout(this.fade), this.forget(), this.active ? (this.raise(), this.schedule()) : this.layer.matches(":popover-open") && this.layer.hidePopover();
	}
	raise() {
		typeof this.layer.showPopover == "function" && (this.layer.matches(":popover-open") && this.layer.hidePopover(), this.layer.showPopover());
	}
	place(e) {
		if (e === null) return;
		let t = e.closest("dialog:modal"), n = t ?? this.doc.body;
		this.layer.parentElement === n ? e.closest(":popover-open") !== null && this.raise() : (n.append(this.layer), t?.addEventListener("close", () => this.leaveDialog(t), { once: !0 }), this.raise());
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
		}, this.approach(), !(t === this.target || t !== null && this.layer.contains(t)) && (this.target = t, this.pickTarget = !0, this.schedule());
	}
	handleScroll(e) {
		if (!this.active) return;
		let t = e.target instanceof Element ? e.target : document.scrollingElement;
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(SJ(t, "y") ? t : null, SJ(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < mJ;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, pJ), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && _J(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(Qq, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(tJ, e.view !== null && (e.near || t));
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
		this.target = null, this.point = null, this.approach(), this.drag === null && (this.hovered = !1, this.settleLater());
	}
	settleLater() {
		window.clearTimeout(this.settle), this.settle = window.setTimeout(() => {
			this.settle = 0, !(this.hovered || this.drag !== null) && (this.forget(), this.schedule());
		}, pJ);
	}
	schedule() {
		this.frame === 0 && (this.frame = window.requestAnimationFrame(() => this.drawFrame()));
	}
	drawFrame() {
		if (this.frame = 0, !this.active) return;
		this.layer.isConnected || (this.doc.body.append(this.layer), this.raise()), this.repick ? this.pickAt(this.point === null ? null : document.elementFromPoint(this.point.x, this.point.y)) : this.pickTarget && this.pickAt(this.target), this.repick = !1, this.pickTarget = !1;
		let e = this.measure("y"), t = this.measure("x");
		this.apply(this.bars.y, e), this.apply(this.bars.x, t), this.approach(), this.paint();
	}
	pickAt(e) {
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(vJ(e, "y"), vJ(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !SJ(t, e)) return null;
		let n = EJ(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? TJ(t) : CJ(t);
		return {
			view: n,
			thumb: OJ(t, e, i, r),
			arrows: kJ(t, e, i, r),
			rtl: PJ(t)
		};
	}
	apply(e, t) {
		if (e.view = t?.view ?? null, t === null) return;
		let { view: n, thumb: r, arrows: i } = t;
		e.rtl = t.rtl, Object.assign(e.box.style, {
			left: `${n.left}px`,
			top: `${n.top}px`,
			width: `${n.width}px`,
			height: `${n.height}px`
		}), FJ(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (FJ(e.back, i.back, n), FJ(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		yq(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * uJ } : { left: n * uJ }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, fJ);
		}, dJ);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && PJ(n), i = jJ(n, t, CJ(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		yq(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add($q), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: NJ(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = MJ(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = MJ(t.scroll, n, t.ratio, t.rtl);
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
	cancelDrag(e) {
		let t = this.drag;
		if (!(t === null || e.key !== "Escape" || e.defaultPrevented || j(e))) {
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = MJ(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = MJ(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove($q), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * xJ(e, n, "x"), a = e.deltaY * xJ(e, n, "y"), o = yJ(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (yq(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function _J(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function vJ(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (SJ(n, t)) return n;
	return null;
}
function yJ(e, t, n) {
	for (let r = e; r !== null; r = vJ(r.parentElement, t)) if (SJ(r, t) && bJ(r, t, n)) return r;
	return null;
}
function bJ(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = NJ(e, t), a = t === "x" && PJ(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function xJ(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? hJ : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function SJ(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(rJ).trim() !== "none";
}
function CJ(e) {
	if (e === document.scrollingElement) return IJ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = wJ(t.width, n?.offsetWidth), i = wJ(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return IJ(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function wJ(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function TJ(e) {
	let t = CJ(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(iJ));
	return n > 0 ? PJ(e) ? IJ(t.left - n, t.top, t.right, t.bottom) : IJ(t.left, t.top, t.right + n, t.bottom) : t;
}
function EJ(e) {
	let t = TJ(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = LJ(t, DJ(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = LJ(t, IJ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function DJ(e, t) {
	let n = CJ(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return IJ(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function OJ(e, t, n, r) {
	let i = PJ(e), a = jJ(e, t, n, r, i), o = a.max > 0 ? NJ(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - aJ,
		top: a.start + o,
		width: aJ,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - aJ,
		width: a.thumb,
		height: aJ
	};
}
function kJ(e, t, n, r) {
	if (AJ(n, t, r) === 0) return null;
	let i = PJ(e), a = jJ(e, t, n, r, i);
	if (t === "y") {
		let e = i ? n.left : n.right - aJ;
		return {
			back: {
				left: e,
				top: a.start - cJ,
				width: aJ,
				height: cJ
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: aJ,
				height: cJ
			}
		};
	}
	let o = n.bottom - aJ;
	return {
		back: {
			left: a.start - cJ,
			top: o,
			width: cJ,
			height: aJ
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: cJ,
			height: aJ
		}
	};
}
function AJ(e, t, n) {
	return (t === "y" ? e.height : e.width) - 4 - (n ? aJ : 0) >= lJ ? cJ : 0;
}
function jJ(e, t, n, r, i) {
	let a = AJ(n, t, r), o = (t === "y" ? n.top : n.left) + oJ + a + (r && i && t === "x" ? aJ : 0), s = (t === "y" ? n.height : n.width) - 4 - 2 * a - (r ? aJ : 0), c = t === "y" ? e.clientHeight : e.clientWidth, l = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: o,
		length: s,
		thumb: Math.min(s, Math.max(sJ, s * c / l)),
		max: l - c
	};
}
function MJ(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function NJ(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function PJ(e) {
	return getComputedStyle(e).direction === "rtl";
}
function FJ(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function IJ(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function LJ(e, t) {
	return IJ(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var RJ = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), zJ = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], BJ = `.${_i}, .${vi}`, VJ = RegExp(`(^|\\s)(${_i}|${vi})(\\s|$)`), HJ = RegExp(`(^|\\s)${yi}(\\s|$)`), UJ = "[type='range']", WJ = /* @__PURE__ */ new WeakSet(), GJ = /* @__PURE__ */ new WeakSet();
function KJ(e = document) {
	let t = e === document ? window : e;
	for (let e of zJ) t.addEventListener(e, eY, !0);
	t.addEventListener("keydown", nY, !0), t.addEventListener("change", rY, !0), t.addEventListener("pointerdown", iY, !0), t.addEventListener("mousedown", iY, !0), ZJ(e.querySelectorAll(BJ)), YJ(e.querySelectorAll(`[${gi}]`)), JJ(e.querySelectorAll(UJ)), new MutationObserver((e) => {
		for (let t of e) qJ(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", gi],
		attributeOldValue: !0
	});
}
function qJ(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			XJ(t, e.oldValue !== null);
			return;
		}
		let n = VJ.test(e.oldValue ?? ""), r = t.matches(BJ);
		n !== r && (QJ(t, r), XJ(t)), HJ.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && JJ(t.querySelectorAll(UJ));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(BJ) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && $J(n), n.matches(BJ) && QJ(n, !0), ZJ(n.querySelectorAll(BJ)), XJ(n), YJ(n.querySelectorAll(`[${gi}]`)), JJ([n, ...n.querySelectorAll(UJ)]));
}
function JJ(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== WJ.has(t) && (e ? (WJ.add(t), t.addEventListener("touchstart", iY, { passive: !1 })) : (WJ.delete(t), t.removeEventListener("touchstart", iY)));
	}
}
function YJ(e) {
	for (let t of e) XJ(t);
}
function XJ(e, t = !1) {
	let n = e.getAttribute(gi);
	(n !== null || t) && (e.matches(BJ) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Wa(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function ZJ(e) {
	for (let t of e) QJ(t, !0);
}
function QJ(e, t) {
	for (let n of e.children) t ? $J(n) : GJ.has(n) && (GJ.delete(n), n.removeAttribute("inert"));
}
function $J(e) {
	e.hasAttribute("inert") || (GJ.add(e), e.setAttribute("inert", ""));
}
function eY(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && vg(e), aY(e)) : e.type === "click" && tY(e.target) && e.preventDefault());
}
function tY(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function nY(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && O(e.target) ? aY(e) : RJ.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault());
}
function rY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function iY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function aY(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var oY = /* @__PURE__ */ new WeakMap(), sY = /* @__PURE__ */ new WeakSet(), cY = /* @__PURE__ */ new WeakSet(), lY = new p_({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = oY.get(e);
		oY.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => sY.has(e),
	sheetOnPhone: ({ popup: e }) => cY.has(e)
});
function uY(e) {
	return {
		open: (e, t, n) => dY(e, t, n, (e) => lY.open(e)),
		openList: fY,
		listKey: yN,
		followPointer: SN,
		focusReturn: (t) => Tp(t, e)
	};
}
function dY(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => lY.popupOf(i) === t;
	return oY.set(t, n.onDismiss), n.closesOnTab === !0 ? sY.add(t) : sY.delete(t), n.sheetOnPhone === !0 ? cY.add(t) : cY.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (oY.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && lY.reposition(i);
		},
		close: () => {
			a() && lY.close(i);
		}
	};
}
function fY(e, t, n) {
	return dY(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => vN(lY, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var pY = "--ui-color-series-count", mY = "--ui-color-series-", hY = 8;
function gY(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(pY));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : hY;
}
function _Y(e, t) {
	return `var(${mY}${e % t + 1})`;
}
var vY = {
	count: gY,
	color: _Y
}, yY = ".ui-items-view", bY = `:scope > [${x}]`, xY = `:scope > [${Ft}]`, SY = "ui-orientation--horizontal", CY = 1, wY = [{
	edge: "first",
	holder: `:scope > [${Bt}="${Ht}"]`,
	bound: `${Je}first-visible-key`,
	attribute: dt
}, {
	edge: "last",
	holder: `:scope > [${Bt}="${Ut}"]`,
	bound: `${Je}last-visible-key`,
	attribute: ft
}], TY = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, B(this.root, yY, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Bt}="${Ht}"], [${Bt}="${Ut}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) EY(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(bY), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = Lz(t, () => this.schedule(e)), i = new MutationObserver((n) => {
			n.some((e) => e.target.parentElement === t) && this.schedule(e);
		});
		i.observe(t, {
			subtree: !0,
			attributes: !0,
			attributeFilter: ["class"]
		}), this.sized.set(e, {
			host: t,
			stop: () => {
				r(), i.disconnect();
			}
		});
	}
	schedule(e) {
		let t = Date.now(), n = this.waiting.get(e), r = n?.since ?? t;
		n !== void 0 && clearTimeout(n.timer), t - r >= 1e3 ? (this.waiting.delete(e), this.report(e)) : this.waiting.set(e, {
			since: r,
			timer: setTimeout(() => {
				this.waiting.delete(e), this.report(e);
			}, 150)
		});
	}
	report(e) {
		let t = e.isConnected ? DY(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(bY);
		if (n === null || O(t[0].holder)) return;
		let r = kY(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = OY(r, n);
			t !== void 0 && t !== e.getAttribute(i) && (t === null ? e.removeAttribute(i) : e.setAttribute(i, t), e.dispatchEvent(new Event("change", { bubbles: !0 })));
		}
	}
	forget(e) {
		this.views.delete(e), this.sized.get(e)?.stop(), this.sized.delete(e);
		let t = this.waiting.get(e);
		t !== void 0 && (clearTimeout(t.timer), this.waiting.delete(e));
	}
	handleScroll(e) {
		if (this.views.size === 0) return;
		let t = e.target;
		for (let e of this.views) e.isConnected ? (!(t instanceof Element) || t.contains(e) || e.contains(t)) && this.schedule(e) : this.forget(e);
	}
};
function EY(e) {
	return DY(e).length > 0;
}
function DY(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of wY) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function OY(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= CY)) return (t === "first" ? IY(n, r) : LY(n, r)) ?? void 0;
}
function kY(e, t) {
	let n = e.classList.contains(SY), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = qu(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...AY(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: jY(t, n, r)
	} : null;
}
function AY(e, t, n) {
	return t ? n ? {
		start: -e.right,
		end: -e.left
	} : {
		start: e.left,
		end: e.right
	} : {
		start: e.top,
		end: e.bottom
	};
}
function jY(e, t, n) {
	let r = Hu(e), i = AY(MY(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = PY(i, AY(MY(e, null), t, n)));
	}
	return i = PY(i, AY({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), FY(e, i, t, n);
}
function MY(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + NY(t?.paddingLeft),
		top: i + NY(t?.paddingTop),
		right: r + e.clientWidth - NY(t?.paddingRight),
		bottom: i + e.clientHeight - NY(t?.paddingBottom)
	};
}
function NY(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function PY(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function FY(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(xY)) {
		let e = AY(t.getBoundingClientRect(), n, r);
		e.start <= i + CY && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function IY(e, t) {
	for (let n of e) if (RY(n, t)) return n.key;
	return null;
}
function LY(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (RY(e[n], t)) return e[n].key;
	return null;
}
function RY(e, t) {
	return e.key.length > 0 && e.end > t.start + CY && e.start < t.end - CY;
}
//#endregion
//#region src/items/item-rows.ts
function zY(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: zO,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => qd(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(F);
			return t !== null && rf(t) ? sf(t, e) : [];
		},
		moveCursor: (e, t) => yf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function BY(e, t) {
	let n = aa(e.kind);
	return n === "Markup" ? !t.hasAttribute(Pi) : n === "Attribute" && e.name === "data-ui-tooltip" || e.converter === "inlineMarkupPlainText";
}
var VY = class {
	phrase;
	converters;
	words = null;
	operation = null;
	converted;
	constructor(e, t) {
		this.phrase = e, this.converters = t;
	}
	get value() {
		return this.words ??= D.translate(this.phrase.key, this.phrase.args, !0), this.words;
	}
	convertedFor(e) {
		return this.operation !== e && (this.operation = e, this.converted = this.converters.convert(e.converter, this.value)), this.converted;
	}
};
function HY(e, t) {
	return E(e) ? new VY(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var UY = class {
	metadata;
	templates;
	extensions;
	operations;
	state;
	itemStackByRoot = /* @__PURE__ */ new WeakMap();
	unresolved = /* @__PURE__ */ new Set();
	translatableRowBindings = null;
	fillRow = null;
	componentSelectors = /* @__PURE__ */ new Map();
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? KY(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), qY(l, n, t);
		let u = c?.rowDecorator ?? null;
		return u !== null && u.length > 0 && this.decorateRow(u, l, t, n, e, r), l;
	}
	decorateRow(e, t, n, r, i, a) {
		let o = this.extensions.rowDecorators.get(e);
		o === void 0 ? s("row decorator is not registered.", {
			kind: e,
			componentId: i
		}) : o({
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
		let i = GY(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: T(r),
			item: t
		};
		return this.itemStackByRoot.set(r, i), this.fillRow?.(r), this.populateBoundElements(r, [...n, i]), r;
	}
	renderPart(e, t) {
		let n = e.content.cloneNode(!0).firstElementChild;
		return n === null ? (s("template is empty.", { template: e }), null) : (this.fillRow?.(n), this.populateBoundElements(n, this.stackOf(t)), n);
	}
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e, t) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [n, r] of this.translatableRowBindings) for (let i of e.querySelectorAll(r)) {
			let e = this.stackOf(i);
			WY(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Je}${Wi(n.propertyName)}="${Ui(r)}"]`]);
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
		let r = QY(t, n.templateKeyPropertyName);
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
		let r = Number(t), i = Number.isInteger(r) && r > 0 ? this.metadata.getBindingById(r) : void 0;
		i !== void 0 && !FO(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = w(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : PO(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = Pc(l, () => this.metadata.isTranslatable(t) && !IO(c)), d = HY(l, this.extensions.converters), f = w(t.componentId), p = e.closest(this.componentSelector(f));
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: t });
			return;
		}
		let m = {
			componentId: f,
			propertyId: t.propertyId,
			propertyName: a.propertyName,
			dynamicParameters: [],
			component: p,
			definition: a,
			address: {
				component: {
					id: f,
					dynamicParameters: []
				},
				property: a.propertyName
			},
			bindingId: i,
			bindingSelector: null
		};
		for (let t of a.operations) {
			let n = qi(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && BY(t, n) ? this.operations.apply({
				resolved: m,
				operation: t,
				target: n,
				value: d.value,
				convertedValue: d.convertedFor(t),
				local: !1
			}) : this.operations.apply({
				resolved: m,
				operation: t,
				target: n,
				value: u,
				convertedValue: this.extensions.converters.convert(t.converter, u),
				local: !1
			}));
		}
	}
	componentSelector(e) {
		let t = this.componentSelectors.get(e);
		return t === void 0 && (t = `[${y}="${e}"]`, this.componentSelectors.set(e, t)), t;
	}
};
function WY(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function GY(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? BO(r, i.name) : GO(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return KO(r, i.key, n), e;
	let a = r;
	return a[HO(a, i.name)] = n, e;
}
function KY(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function qY(e, t, n) {
	e.setAttribute(b, t), ZY(e, n), YY(e, n);
}
var JY = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function YY(e, t) {
	for (let [n, r] of JY) {
		let i = BO(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function XY(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if (YY(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${Ui(n)}"]`)) i.closest("[data-ui-items-host]") === r && YY(i, t);
}
function ZY(e, t) {
	let n = BO(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Lt, n.value) : e.removeAttribute(Lt);
}
function QY(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = BO(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var $Y = "Group", eX = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	readerHeld = /* @__PURE__ */ new Map();
	answering = [];
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = w(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), e.root.addEventListener("focusout", () => this.handleFocusOut(), !0), B(e.root, `[${Bt}="${Vt}"]`, { attributeFilter: [ut] }, (e) => {
			for (let t of e) {
				let e = Ia(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), B(e.root, `[${Wt}="windowed"]`, { attributeFilter: [rn] }, (e) => {
			for (let t of e) {
				let e = Ia(t);
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
			for (let [t, n] of e) t.isConnected && DW(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) tX(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
		});
	}
	awaitAnswer(e) {
		e.dynamicParameters.length > 0 && this.answering.push(e);
	}
	followAnswered(e) {
		if (this.answering.length === 0) return;
		let t = this.answering.splice(0);
		if (e === null) return;
		let n = e?.updates ?? [];
		for (let e of t) n.some((t) => nX(t, e)) || this.handleItemValueChange(e);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : WO(t);
		if (n === null) return;
		let r = this.findItemRootsAbove(e, n);
		if (!(r.length === 0 && this.applyVirtualizedItemValue(e, n))) for (let t of r.length > 0 ? r : this.findAddressedItemRoots(e.dynamicParameters)) this.applyItemValue(t, n, e.value);
	}
	findItemRootsAbove(e, t) {
		let n = [];
		for (let r of e.components) {
			let e = this.findItemRoot(r, t.scopeComponentId);
			e !== null && !n.includes(e) && n.push(e);
		}
		return n;
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n != "string") return !1;
		let r = !1;
		for (let i of this.options.virtualization.hosts()) {
			let a = i.closest(C);
			a !== null && this.drawsPatchedComponent(a, w(e.reference.componentId), t) && rX(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, T(a), n, t, e.value) || r);
		}
		return r;
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${T(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? T(e) === n.scopeComponentId : T(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
		}
		return this.drawnByHost.set(r, a), a;
	}
	applyVirtualizedValue(e, t, n, r, i) {
		if (!this.options.virtualization.updateValue(e, n, r.steps, i)) return !1;
		let a = this.options.virtualization.drawnRowOf(e, n);
		return a !== null && this.restampAbilities(a, r), this.redrawsVirtualized(e, t, r) && this.sync(e, t, a), !0;
	}
	redrawsVirtualized(e, t, n) {
		return n.steps.length === 0 || this.feedsRule(e, t, n);
	}
	sync(e, t, n = null) {
		if (this.dragged !== null && e.contains(this.dragged)) {
			this.deferred.set(e, t);
			return;
		}
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && tX(n) ? n : r !== null && tX(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), DW(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${Ui(t)}"]`)].filter((t) => this.isItemRoot(t) && Ea(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : Ia(r);
		if (r !== null && i !== null && W(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = iX($Y, t);
		a && ZY(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		JY.some(([e]) => iX(e, t)) && XY(e, this.options.renderer.getItemValue(e));
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
	feedsRule(e, t, n) {
		if (this.options.templates.getGroupTemplate(t) !== void 0 && iX($Y, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => iX(e.itemProperty, n)) || r.sorts.some((e) => iX(e.itemProperty, n)))) return !0;
		let i = YO(e);
		return (i?.filters ?? []).some((e) => iX(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => iX(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = Ia(t);
			n === e && this.sync(t, n);
		}
	}
};
function tX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function nX(e, t) {
	let n = ua(e), r = n === "Value" ? !Qp(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && w(i?.component?.id) === w(t.reference.componentId) && la(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function rX(e, t) {
	let n = Ta(e, wa(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function iX(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var aX = "ui-table", oX = "ui-table--no-header";
function sX(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(aX)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(oX)) && (s ? o : a).push(t);
	a.forEach((e, t) => cX(e, t));
	for (let [e, n] of t) cX(e, a.length + n);
	n !== null && o.forEach((e, t) => cX(e, a.length + n + t)), lX(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function cX(e, t) {
	lX(e, "aria-rowindex", String(t + 1));
}
function lX(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var uX = 50, dX = 1, fX = .5, pX = 60, mX = "--ui-window-look", hX = "--ui-window-row", gX = "--ui-window-tile", _X = 3, vX = "page", yX = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	started = !1;
	forgotten = /* @__PURE__ */ new WeakSet();
	held = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	start() {
		let e = !this.started;
		this.started = !0;
		for (let t of this.hosts()) {
			let n = this.forgotten.delete(t) || e;
			this.noteShownRow(t), this.layout(t), MX(t) === 0 ? this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
		}
	}
	forget(e) {
		for (let t of this.hosts()) {
			if (!e.contains(t)) continue;
			let n = this.states.get(t);
			n !== void 0 && n.scheduled !== 0 && window.clearTimeout(n.scheduled), this.states.delete(t), this.held.delete(t), this.forgotten.add(t);
		}
	}
	revealWindow(e) {
		let t = this.windowTop(e);
		t !== null && (Gu(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = fO(e, $t);
		return t !== null && Cq(e) && pO(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - Wu(e).height) : t === null || t === 0 ? null : pO(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = jX(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : qu(n[n.length - 1]).bottom - qu(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = kX(e, jX(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), this.getState(t).pending || this.realign(t));
	}
	realign(e) {
		let t = fO(e, $t), n = jX(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Wu(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && SX(t);
	}
	reconsider() {
		for (let e of this.hosts()) this.noteShownRow(e), this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		W(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${x}][${Wt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Uu(e.target);
		if (t === null || W(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, pX));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && MX(e) > 0) return;
		let n = jX(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = fO(e, $t), i = pO(e, tn), a = pO(e, nn);
		if (r !== null) {
			let o = this.windowSize(e), s = Wu(e), c = Math.max(1, Math.round(s.height * dX / t.itemSize), Math.floor(o * fX)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, NX(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, NX(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Wu(e), s = Math.max(1, o.height * dX), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, NX(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, NX(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = fO(e, en);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Ia(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", t === "Start" && SX(o);
		let c = e.closest(C), l = t.toLowerCase();
		e.setAttribute(Xt, l), c?.setAttribute(Xt, e.hasAttribute("data-ui-window-paged") ? vX : l), e.setAttribute("aria-busy", "true"), t === "After" && fO(e, "data-ui-window-total") === null && CX(e) && (mW(e, fW, _X * this.rowSize(e)), wX(e, o));
		let u = fO(e, $t) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: PX(e),
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
			o.pending = !1, e.removeAttribute(Xt), c?.removeAttribute(Xt), e.removeAttribute("aria-busy"), mW(e, fW, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1, o.restless || u && EX(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = jX(e), r = fO(e, en), i = fO(e, $t);
		if (sX(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			mW(e, "top", 0), mW(e, dW, 0);
			return;
		}
		if (n.length > 0) {
			let r = qu(n[n.length - 1]).bottom - qu(n[0]).top;
			if (r > 0) {
				let i = bX(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (SX(t), t.measuredWidth = e.clientWidth), xX(t, n, i), t.skeletonRow = a > 1 ? (qu(n[n.length - 1]).top - qu(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? qu(n[1]).left - qu(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		mW(e, "top", a), mW(e, dW, o), wX(e, t), (t.readingBefore || !DX(e)) && OX(e, n, t.shown), uq(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? TX(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = fO(e, Qt);
		return t !== null && t > 0 ? t : uX;
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			pending: !1,
			readingBefore: !1,
			restless: !1,
			itemSize: 32,
			shares: /* @__PURE__ */ new WeakMap(),
			sizes: {
				sum: 0,
				count: 0
			},
			measuredWidth: 0,
			shown: null,
			scheduled: 0,
			skeletonRow: 0,
			skeletonTile: null
		}, this.states.set(e, t), this.held.add(e)), t;
	}
};
function bX(e) {
	let t = qu(e[0]).top, n = 1;
	for (; n < e.length && qu(e[n]).top === t;) n++;
	return n;
}
function xX(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? qu(t[r]).height : 0 : qu(i).top - qu(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		vW(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function SX(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function CX(e) {
	return getComputedStyle(e).getPropertyValue(mX).trim() === "skeleton";
}
function wX(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${TX(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${TX(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Yt}]`)) {
		let e = t.style;
		e.getPropertyValue(hX) !== n && e.setProperty(hX, n), e.getPropertyValue(gX) !== r && (r.length === 0 ? e.removeProperty(gX) : e.setProperty(gX, r));
	}
}
function TX(e) {
	return Math.round(e * 100) / 100;
}
function EX(e, t, n) {
	let r = jX(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && NX(i) !== n;
}
function DX(e) {
	let t = fO(e, $t);
	return Wu(e).top <= 0 && (t === null ? !pO(e, "data-ui-window-more-before") : t === 0);
}
function OX(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => NX(e) === n.key);
	if (n === null || r === void 0) return;
	let i = qu(r);
	if (i.height <= 0) return;
	let a = Wu(e).top, o = i.top - AX(e) + a - n.at;
	Math.abs(o) >= .5 && Gu(e, a + o);
}
function kX(e, t) {
	let n = AX(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		qu(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : NX(a);
	if (a === void 0 || o === null) return null;
	let s = qu(a), c = Wu(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function AX(e) {
	let t = Hu(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function jX(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function MX(e) {
	return jX(e).length;
}
function NX(e) {
	return e.getAttribute(b);
}
function PX(e) {
	let t = e.closest(C);
	return t === null ? [] : Ta(t, wa(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var FX = [
	y,
	ie,
	ae
];
function IX(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, LX(c, e.itemRole);
	let l = zX(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = RX(l, t, n, a);
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
		d.className = l.wrapperClassName, LX(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), qY(d, r, n), c.appendChild(d);
	}
	return qY(c, r, n), o.registerItemScope(c, l, n), c;
}
function LX(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function RX(e, t, n, r) {
	let i = QY(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function zX(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of FX) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function BX(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return VX(i.renderer.renderItem(e, t, n, r), a);
	let s = IX(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), VX(s, a);
}
function VX(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), Lc(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var HX = 6, UX = 60, WX = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	held = /* @__PURE__ */ new Set();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	keptAsDrawn = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0);
	}
	itemsOf(e) {
		let t = this.states.get(e);
		if (t === void 0) return null;
		let n = [];
		for (let e of t.projected) e.header || n.push(e.entry.item);
		return n;
	}
	itemsVersion(e) {
		return this.states.get(e)?.version ?? null;
	}
	hosts() {
		return this.letGoOffPage(), [...this.held];
	}
	letGoOffPage() {
		for (let e of this.held) e.isConnected || this.held.delete(e);
	}
	drawnRowOf(e, t) {
		return this.states.get(e)?.byKey.get(t)?.element ?? null;
	}
	keysOf(e) {
		let t = this.states.get(e);
		return t === void 0 ? null : t.entries.map((e) => e.key);
	}
	rangeKeysOf(e, t, n) {
		let r = this.states.get(e)?.projected.filter((e) => !e.header), i = r?.findIndex((e) => e.entry.key === t) ?? -1, a = r?.findIndex((e) => e.entry.key === n) ?? -1;
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => JX(e.entry) === !1).map((e) => e.entry.key);
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
		if (!QX(e) && !XX(e)) return a.element;
		let o = getComputedStyle(e), s = tZ(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = QX(e) ? $X(r.projected, c, r.across) : null, u = l === null ? i : ZX(l.starts, i), d = l?.pitches ?? c, f = nZ(o.paddingTop) + rZ(d, 0, u), p = f + d[u] - s, m = Wu(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Gu(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = Cq(e) && Tq(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !Tq(e) && (Gu(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Qp(t.item, s)) {
				i.push(t), a.set(n, t);
				continue;
			}
			t !== void 0 && o.push(n);
			let c = {
				key: n,
				item: s,
				element: this.renewRow(e, t?.element ?? null),
				height: t?.height ?? null
			};
			i.push(c), a.set(n, c);
		}
		for (let e of r.values()) e.element?.remove(), o.push(e.key);
		return n.entries = i, n.byKey = a, n.version++, o;
	}
	renewRow(e, t) {
		return t === null ? null : GX(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = Pf(t);
		t.remove(), Ff(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Nf(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Lf(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Ne), l === void 0 ? (r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? tf(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant"));
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
		i.entries.splice(o, 0, a), i.byKey.set(t, a), i.version++;
	}
	remove(e, t) {
		let n = this.getState(e);
		if (n === null) return;
		let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
		for (let e of t) {
			let t = n.byKey.get(e);
			t !== void 0 && (n.byKey.delete(e), r.add(t), t.element !== null && i.add(t.element));
		}
		if (r.size === 0) return;
		let a = Nf(e), o = a === null || i.size === 0 ? null : kf(a, G(e), i);
		for (let e of i) e.remove();
		n.entries = n.entries.filter((e) => !r.has(e)), n.version++, o?.();
	}
	replace(e, t, n, r, i) {
		let a = this.getState(e), o = a?.byKey.get(t);
		if (a === null) return;
		if (o === void 0) {
			this.insert(e, n, r, i);
			return;
		}
		let s = {
			key: n,
			item: r,
			element: n === t ? this.renewRow(e, o.element) : null,
			height: o.height
		};
		n !== t && this.dropRow(e, o.element), a.entries[a.entries.indexOf(o)] = s, a.byKey.delete(t), a.byKey.set(n, s), a.version++;
	}
	move(e, t, n) {
		let r = this.getState(e), i = r === null ? -1 : r.entries.findIndex((e) => e.key === t);
		if (r === null || i < 0) return;
		let [a] = r.entries.splice(i, 1), o = n === null || n > r.entries.length ? r.entries.length : n;
		r.entries.splice(o, 0, a), r.version++;
	}
	reset(e) {
		let t = this.getState(e);
		if (t !== null) {
			for (let e of t.entries) e.element?.remove();
			t.entries = [], t.byKey.clear(), t.version++;
		}
	}
	updateValue(e, t, n, r) {
		let i = this.getState(e), a = i?.byKey.get(t);
		return i === null || a === void 0 ? !1 : (a.item = GY(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = YO(e), i = this.options.templates.getGroupTemplate(t.componentId), a = tk(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => $O(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => YX(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => rk(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = sW(o, YX), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => rk(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Uu(e.target);
		t !== null && W(t) === "virtualized" && this.relayout(t);
	}
	handleFocusOut(e) {
		for (let t = e.target instanceof Element ? e.target : null; t !== null; t = t.parentElement) {
			let e = t.parentElement, n = e === null ? void 0 : this.states.get(e);
			e === null || n === void 0 || t !== n.keptOutOfRange && !this.keptAsDrawn.has(t) || window.setTimeout(() => {
				e.isConnected && this.layout(e, n);
			});
		}
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && W(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, UX));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = tZ(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = QX(e) ? $X(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || XX(e)) && u > 0) {
			let i = nZ(r.paddingTop), a = Wu(e), o = KX(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - HX), f = Math.min(u, f + HX);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(YX(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), qX(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : ZX(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), qX(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && uW(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || If(e, l), qX(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = rZ(l, 0, y?.line ?? d), b = rZ(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? rZ(l, f, ne.line) : rZ(l, y.line + 1, d), se = _W(e, oe > 0 ? oe - i : 0);
		yW(e, [...y === null ? ie === null ? g : [
			...g,
			...DO(se),
			ie.element
		] : [
			y.element,
			...DO(se),
			...g
		], ...DO(OO(e))]), mW(e, "top", ae > 0 ? ae - i : 0), mW(e, dW, b > 0 ? b - i : 0), kO(e, t.componentId, this.options.templates, this.options.renderer, o > 0), sX(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = eZ(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return BX(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : lW(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(YX(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = qu(o);
			s.height <= 0 || (vW(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(YX(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = La(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of G(e)) {
			let e = t.getAttribute(b);
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
			byKey: new Map(i.map((e) => [e.key, e])),
			projected: [],
			version: 0,
			headers: /* @__PURE__ */ new Map(),
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
			last: -1,
			keptOutOfRange: null
		};
		return this.states.set(e, c), this.letGoOffPage(), this.held.add(e), this.resizes?.observe(e), c;
	}
};
function GX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function KX(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Gu(e, a + l + o), a + l);
}
function qX(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = YX(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function JX(e) {
	let t = BO(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function YX(e) {
	let t = BO(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function XX(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function ZX(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function QX(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function $X(e, t, n) {
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
function eZ(e, t, n) {
	let r = e.clientWidth - nZ(t.paddingLeft) - nZ(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = nZ(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function tZ(e) {
	return nZ(e.rowGap);
}
function nZ(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function rZ(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var iZ = "data-ui-template", aZ = "default", oZ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? aZ, r = this.findTemplate(e, n);
		return r === void 0 ? n === aZ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : sZ(n, iZ, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= cZ(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Mt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : sZ(n, t, null);
	}
};
function sZ(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function cZ(e) {
	let t = /* @__PURE__ */ new Set();
	return Nc(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(C)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var lZ = `:scope > ${`template[${Te}]`}`, uZ = class {
	options;
	shared = /* @__PURE__ */ new Map();
	components = /* @__PURE__ */ new Map();
	menuOf = /* @__PURE__ */ new Map();
	declared = /* @__PURE__ */ new Set();
	taken = /* @__PURE__ */ new WeakSet();
	writtenChords = /* @__PURE__ */ new Set();
	scanned = !1;
	heldVersion = 0;
	chordsVersion = -1;
	chordSet = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e;
	}
	scan() {
		this.scanned || (this.scanned = !0, this.scanContainer(this.options.root, [], null));
	}
	holds(e) {
		return this.scan(), this.components.has(e);
	}
	inOneMenu(e, t) {
		this.scan();
		let n = this.menuOf.get(e);
		return n !== void 0 && n === this.menuOf.get(t);
	}
	standsInRowsOf(e, t) {
		return this.scan(), this.components.get(e)?.includes(t) === !0;
	}
	heldChanged() {
		this.heldVersion++;
	}
	get version() {
		return this.heldVersion;
	}
	chords() {
		if (this.scan(), this.chordsVersion === this.heldVersion) return this.chordSet;
		this.chordsVersion = this.heldVersion, this.chordSet.clear();
		for (let e of this.writtenChords) this.chordSet.add(e);
		return this.options.heldRows((e, t) => {
			this.components.has(e) && fZ(t.item, this.chordSet);
		}), this.chordSet;
	}
	draw(e) {
		if (!e.hasAttribute("data-ui-context-menu-later")) return null;
		this.scan();
		let t = this.drawFrom(e) ?? this.drawAfterRescan(e);
		return e.removeAttribute(we), t === null ? (s("a row's context menu waits in no template.", { owner: e }), null) : (this.options.drawn(t), t);
	}
	drawAfterRescan(e) {
		return this.scanned = !1, this.scan(), this.drawFrom(e);
	}
	drawFrom(e) {
		let t = e.querySelector(lZ);
		if (t !== null) {
			let e = t.content.firstElementChild;
			return t.replaceWith(t.content), e;
		}
		let n = this.shared.get(T(e)), r = n === void 0 ? null : this.options.render(n, e);
		return r !== null && e.appendChild(r), r;
	}
	scanContainer(e, t, n) {
		for (let r of [...e.querySelectorAll("template")]) {
			if (this.taken.has(r)) continue;
			let e = [...t, ...dZ(r)];
			if (r.hasAttribute("data-ui-context-menu-template")) {
				this.takeMenu(r, e, n);
				continue;
			}
			let i = r.parentElement === null ? 0 : T(r.parentElement);
			this.scanContainer(r.content, i > 0 ? [...e, i] : e, n ?? r);
		}
	}
	takeMenu(e, t, n) {
		let r = Number(e.getAttribute(Te)), i = !this.declared.has(r);
		this.taken.add(e), this.declared.add(r), Nc(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(C)) this.components.set(T(n), t), this.menuOf.set(T(n), r);
			for (let t of e.querySelectorAll(`[${Vn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function dZ(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Ia(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function fZ(e, t) {
	let n = BO(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = BO(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) fZ(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function pZ(e, t) {
	let n = e.querySelector(`style[${Br}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Br, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var mZ = "script[type='application/json'][data-ui-metadata]";
function hZ(e = document) {
	let t = e.querySelector(mZ);
	if (t === null) return gZ();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return gZ();
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
function gZ() {
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
var _Z = "script[type='application/json'][data-ui-hydration]";
function vZ(e) {
	return e !== null && (rc(e.title) || rc(e.changes));
}
function yZ(e = document) {
	let t = e.querySelector(_Z)?.textContent?.trim() ?? "";
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
var bZ = "reconnecting";
async function xZ(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), bZ;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function SZ(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function CZ(e, t, n) {
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
var wZ = "/_ne/", TZ = 3e3;
function EZ(e, t, n) {
	let r = e.getAttribute(Rr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (CZ(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => OZ(i.ready);
	let a = i.register(r, { scope: wZ }).then(DZ).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function DZ(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function OZ(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), TZ))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var kZ = "ne-standard-ui:reloaded-view";
function AZ(e, t, n) {
	if (!t) return "no-cookie";
	if (NZ(n) === e) return "asked-again";
	try {
		n?.setItem(kZ, e);
	} catch {}
	return "reload";
}
function jZ(e) {
	try {
		e?.removeItem(kZ);
	} catch {}
}
function MZ() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function NZ(e) {
	try {
		return e?.getItem(kZ) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function PZ(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return FZ(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function FZ(e, t) {
	let n = t.create ?? VZ, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = RZ(i, e), s = n(), c = o !== null && o.length > 0 && RZ(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		zZ(i, e, c), zZ(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? IZ(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = LZ(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), IZ(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		BZ(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function IZ(e, t) {
	e?.postMessage(t);
}
function LZ(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function RZ(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function zZ(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function BZ(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function VZ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var HZ = 2e3, UZ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? HZ, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Yr, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Yr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Yr, "lost");
	}
}, WZ = "/_ne/values", GZ = 32768;
GZ / 4;
var KZ = 3e4;
function qZ(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function JZ(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function YZ(e, t = null, n = KZ) {
	if (e === void 0 || !JZ(e)) return e;
	await ty.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${WZ}/${encodeURIComponent(r)}${i}`, {
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
async function XZ(e) {
	await ty.settled();
	let t = await fetch(WZ, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(KZ)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var ZZ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(QZ($Z(e)));
	}
	async dispatchAsync(e) {
		let t = $Z(e), n = QZ(t);
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
		let t = qZ(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : XZ(t), i = () => {}, a = new Promise((e) => {
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
function QZ(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function $Z(e) {
	return e.action === void 0 ? {
		eventId: w(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/transport/inbound-order.ts
var eQ = class {
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
async function tQ(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var nQ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && Qp(a.value, n);
		if (o && !this.unplacedPathByEntry.has(i)) return !1;
		let s = typeof r == "function" ? r() : r;
		return s.length > 0 ? (this.recordRows(i, s), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), !o && (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = rQ(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ca([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(rQ(e, t));
		let n = this.unplaced.get(ca(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = rQ(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ca([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ca(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ca(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${ca(t)}`;
	}
};
function rQ(e, t) {
	return `${e}:${ca(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var iQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, aQ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, oQ = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, sQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, cQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, lQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, uQ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, dQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, fQ = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, pQ = class {
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
}, Y;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var mQ = class {
	constructor() {}
	log(e, t) {}
};
mQ.instance = new mQ();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var hQ = "10.0.11", X = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, Z = class e {
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
function gQ(e, t) {
	let n = "";
	return vQ(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${_Q(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function _Q(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function vQ(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function yQ(e, t, n, r, i, a) {
	let o = {}, [s, c] = CQ();
	o[s] = c, e.log(Y.Trace, `(${t} transport) sending data. ${gQ(i, a.logMessageContent)}.`);
	let l = vQ(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(Y.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function bQ(e) {
	return e === void 0 ? new SQ(Y.Information) : e === null ? mQ.instance : e.log === void 0 ? new SQ(e) : e;
}
var xQ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, SQ = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${Y[e]}: ${t}`;
			switch (e) {
				case Y.Critical:
				case Y.Error:
					this.out.error(n);
					break;
				case Y.Warning:
					this.out.warn(n);
					break;
				case Y.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function CQ() {
	let e = "X-SignalR-User-Agent";
	return Z.isNode && (e = "User-Agent"), [e, wQ(hQ, TQ(), DQ(), EQ())];
}
function wQ(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function TQ() {
	if (Z.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function EQ() {
	if (Z.isNode) return process.versions.node;
}
function DQ() {
	return Z.isNode ? "NodeJS" : "Browser";
}
function OQ(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function kQ() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var AQ = class extends pQ {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Z.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(kQ());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new oQ();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new oQ();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(Y.Warning, "Timeout from HTTP request."), n = new aQ();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, vQ(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(Y.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new iQ(await jQ(i, "text") || i.statusText, i.status);
		let a = await jQ(i, e.responseType);
		return new fQ(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Z.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function jQ(e, t) {
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
var MQ = class extends pQ {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new oQ()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (vQ(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new oQ());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new fQ(r.status, r.statusText, r.response || r.responseText)) : n(new iQ(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(Y.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new iQ(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(Y.Warning, "Timeout from HTTP request."), n(new aQ());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, NQ = class extends pQ {
	constructor(e) {
		if (super(), typeof fetch < "u" || Z.isNode) this._httpClient = new AQ(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new MQ(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new oQ()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, PQ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
PQ.RecordSeparatorCode = 30, PQ.RecordSeparator = String.fromCharCode(PQ.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var FQ = class {
	writeHandshakeRequest(e) {
		return PQ.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (vQ(e)) {
			let r = new Uint8Array(e), i = r.indexOf(PQ.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(PQ.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = PQ.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var IQ = class {
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
		return this.observers.push(e), new xQ(this, e);
	}
}, LQ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			vQ(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new RQ(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, vQ(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === Q.Sequence && (this._waitForSequenceMessage = !1, !0);
		if (!this._isInvocationMessage(e)) return !0;
		let t = this._nextReceivingSequenceId;
		return this._nextReceivingSequenceId++, t <= this._latestReceivedSequenceId ? (t === this._latestReceivedSequenceId && this._ackTimer(), !1) : (this._latestReceivedSequenceId = t, this._ackTimer(), !0);
	}
	_resetSequence(e) {
		e.sequenceId > this._nextReceivingSequenceId ? this._connection.stop(/* @__PURE__ */ Error("Sequence ID greater than amount of messages we've received.")) : this._nextReceivingSequenceId = e.sequenceId;
	}
	_disconnected() {
		this._reconnectInProgress = !0, this._waitForSequenceMessage = !0;
	}
	async _resend() {
		let e = this._messages.length === 0 ? this._totalMessageCount + 1 : this._messages[0]._id;
		await this._connection.send(this._protocol.writeMessage({
			type: Q.Sequence,
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
			case Q.Invocation:
			case Q.StreamItem:
			case Q.Completion:
			case Q.StreamInvocation:
			case Q.CancelInvocation: return !0;
			case Q.Close:
			case Q.Sequence:
			case Q.Ping:
			case Q.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: Q.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, RQ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, zQ = 3e4, BQ = 15e3, VQ = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var HQ = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(Y.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, X.isRequired(e, "connection"), X.isRequired(t, "logger"), X.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? zQ, this.keepAliveIntervalInMilliseconds = a ?? BQ, this._statefulReconnectBufferSize = o ?? VQ, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new FQ(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
		if (this._connectionState !== $.Disconnected && this._connectionState !== $.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== $.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = $.Connecting, this._logger.log(Y.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), Z.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = $.Connected, this._connectionStarted = !0, this._logger.log(Y.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = $.Disconnected, this._logger.log(Y.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(Y.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(Y.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new LQ(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(Y.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === $.Disconnected) return this._logger.log(Y.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === $.Disconnecting) return this._logger.log(Y.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = $.Disconnecting, this._logger.log(Y.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(Y.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new oQ("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new IQ();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			t ? o.error(t) : e && (e.type === Q.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				r ? t(r) : n && (n.type === Q.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
			};
			let r = this._sendWithProtocol(i).catch((e) => {
				t(e), delete this._callbacks[i.invocationId];
			});
			this._launchStreams(n, r);
		});
	}
	on(e, t) {
		e && t && (e = e.toLowerCase(), this._methods[e] || (this._methods[e] = []), this._methods[e].indexOf(t) === -1 && this._methods[e].push(t));
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
			for (let e of t) if (!this._messageBuffer || this._messageBuffer._shouldProcessMessage(e)) switch (e.type) {
				case Q.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(Y.Error, `Invoke client method threw error: ${OQ(e)}`);
					});
					break;
				case Q.StreamItem:
				case Q.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === Q.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(Y.Error, `Stream callback threw error: ${OQ(e)}`);
						}
					}
					break;
				}
				case Q.Ping: break;
				case Q.Close: {
					this._logger.log(Y.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case Q.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case Q.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(Y.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(Y.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(Y.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(Y.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === $.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === $.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(Y.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(Y.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(Y.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(Y.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(Y.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(Y.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(Y.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new oQ("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = $.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), Z.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(Y.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) this._logger.log(Y.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
		else {
			if (this._connectionState = $.Reconnecting, e ? this._logger.log(Y.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(Y.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
				try {
					this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
				} catch (t) {
					this._logger.log(Y.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
				}
				if (this._connectionState !== $.Reconnecting) {
					this._logger.log(Y.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
					return;
				}
			}
			for (; i !== null;) {
				if (this._logger.log(Y.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
					this._reconnectDelayHandle = setTimeout(e, i);
				}), this._reconnectDelayHandle = void 0, this._connectionState !== $.Reconnecting) {
					this._logger.log(Y.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
					return;
				}
				try {
					if (await this._startInternal(), this._connectionState = $.Connected, this._logger.log(Y.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
						this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
					} catch (e) {
						this._logger.log(Y.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
					}
					return;
				} catch (e) {
					if (this._logger.log(Y.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== $.Reconnecting) {
						this._logger.log(Y.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === $.Disconnecting && this._completeClose();
						return;
					}
					n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
				}
			}
			this._logger.log(Y.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
		}
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(Y.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(Y.Error, `Stream 'error' callback called with '${e}' threw error: ${OQ(t)}`);
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
			type: Q.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: Q.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: Q.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: Q.Invocation
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
			type: Q.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: Q.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: Q.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: Q.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: Q.Completion
		} : {
			invocationId: e,
			result: n,
			type: Q.Completion
		};
	}
	_createCloseMessage() {
		return { type: Q.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, UQ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], WQ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? UQ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, GQ = class {};
GQ.Authorization = "Authorization", GQ.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var KQ = class extends pQ {
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
		e.headers ||= {}, this._accessToken ? e.headers[GQ.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[GQ.Authorization] && delete e.headers[GQ.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, qQ;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(qQ ||= {});
var JQ;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(JQ ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var YQ = class {
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
}, XQ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new YQ(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, JQ, "transferFormat"), this._url = e, this._logger.log(Y.Trace, "(LongPolling transport) Connecting."), t === JQ.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = CQ(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === JQ.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(Y.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new iQ(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(Y.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(Y.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(Y.Trace, `(LongPolling transport) data received. ${gQ(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new iQ(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof aQ ? this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(Y.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(Y.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? yQ(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(Y.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(Y.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = CQ();
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
			i ? i instanceof iQ && (i.statusCode === 404 ? this._logger.log(Y.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(Y.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(Y.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(Y.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(Y.Trace, e), this.onclose(this._closeError);
		}
	}
}, ZQ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, JQ, "transferFormat"), this._logger.log(Y.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== JQ.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Z.isBrowser || Z.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = CQ();
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
						this._logger.log(Y.Trace, `(SSE transport) data received. ${gQ(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(Y.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? yQ(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, QQ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, JQ, "transferFormat"), this._logger.log(Y.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Z.isNode || Z.isReactNative) {
				let t = {}, [r, i] = CQ();
				t[r] = i, n && (t[GQ.Authorization] = `Bearer ${n}`), o && (t[GQ.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === JQ.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(Y.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(Y.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(Y.Trace, `(WebSockets transport) data received. ${gQ(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(Y.Trace, `(WebSockets transport) sending data. ${gQ(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(Y.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, $Q = 100, e$ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, X.isRequired(t, "url"), this._logger = bQ(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Z.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Z.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Z.isNode && !n.WebSocket && r && (n.WebSocket = r), !Z.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Z.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new KQ(n.httpClient || new NQ(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= JQ.Binary, X.isIn(e, JQ, "transferFormat"), this._logger.log(Y.Debug, `Starting connection with transfer format '${JQ[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(Y.Error, e), await this._stopPromise, Promise.reject(new oQ(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(Y.Error, e), Promise.reject(new oQ(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new n$(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(Y.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(Y.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(Y.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(Y.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === qQ.WebSockets) this.transport = this._constructTransport(qQ.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new oQ("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < $Q);
				if (r === $Q && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof XQ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(Y.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(Y.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = CQ();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(Y.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new uQ("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof iQ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(Y.Error, t), Promise.reject(new uQ(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(Y.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(Y.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new lQ(`${n.transport} failed: ${e}`, qQ[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(Y.Debug, e), Promise.reject(new oQ(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new dQ(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case qQ.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new QQ(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case qQ.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new ZQ(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case qQ.LongPolling: return new XQ(this._httpClient, this._logger, this._options);
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
		let i = qQ[e.transport];
		if (i == null) return this._logger.log(Y.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (t$(t, i)) {
			if (e.transferFormats.map((e) => JQ[e]).indexOf(n) >= 0) {
				if (i === qQ.WebSockets && !this._options.WebSocket || i === qQ.ServerSentEvents && !this._options.EventSource) return this._logger.log(Y.Debug, `Skipping transport '${qQ[i]}' because it is not supported in your environment.'`), new sQ(`'${qQ[i]}' is not supported in your environment.`, i);
				this._logger.log(Y.Debug, `Selecting transport '${qQ[i]}'.`);
				try {
					return this.features.reconnect = i === qQ.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(Y.Debug, `Skipping transport '${qQ[i]}' because it does not support the requested transfer format '${JQ[n]}'.`), /* @__PURE__ */ Error(`'${qQ[i]}' does not support ${JQ[n]}.`);
		}
		return this._logger.log(Y.Debug, `Skipping transport '${qQ[i]}' because it was disabled by the client.`), new cQ(`'${qQ[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(Y.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") this._logger.log(Y.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
		else {
			if (this._connectionState === "Connecting") throw this._logger.log(Y.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
			if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(Y.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(Y.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
				this._logger.log(Y.Error, `TransportSendQueue.stop() threw error '${e}'.`);
			}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
				this._connectionStarted = !1;
				try {
					this.onclose && this.onclose(e);
				} catch (t) {
					this._logger.log(Y.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
				}
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!Z.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(Y.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function t$(e, t) {
	return !e || (t & e) !== 0;
}
var n$ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new r$(), this._transportResult = new r$(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new r$(), this._transportResult.promise;
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
			this._sendBufferedData = new r$();
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
}, r$ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, i$ = "json", a$ = class {
	constructor() {
		this.name = i$, this.version = 2, this.transferFormat = JQ.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = mQ.instance);
		let n = PQ.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case Q.Invocation:
					this._isInvocationMessage(n);
					break;
				case Q.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case Q.Completion:
					this._isCompletionMessage(n);
					break;
				case Q.Ping: break;
				case Q.Close: break;
				case Q.Ack:
					this._isAckMessage(n);
					break;
				case Q.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(Y.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return PQ.write(JSON.stringify(e));
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
}, o$ = {
	trace: Y.Trace,
	debug: Y.Debug,
	info: Y.Information,
	information: Y.Information,
	warn: Y.Warning,
	warning: Y.Warning,
	error: Y.Error,
	critical: Y.Critical,
	none: Y.None
};
function s$(e) {
	let t = o$[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var c$ = class {
	configureLogging(e) {
		if (X.isRequired(e, "logging"), l$(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = s$(e);
			this.logger = new SQ(t);
		} else this.logger = new SQ(e);
		return this;
	}
	withUrl(e, t) {
		return X.isRequired(e, "url"), X.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return X.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new WQ(e) : e : new WQ(), this;
	}
	withServerTimeout(e) {
		return X.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return X.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new e$(this.url, e);
		return HQ.create(t, this.logger || mQ.instance, this.protocol || new a$(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function l$(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var u$ = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, d$ = class {
	gate;
	pending = !1;
	attached = !1;
	open = () => {};
	fail = () => {};
	closedBy = null;
	constructor() {
		this.gate = this.arm();
	}
	get reattaching() {
		return this.pending && this.attached;
	}
	get failure() {
		return this.closedBy;
	}
	wait() {
		return this.gate;
	}
	markAttached() {
		this.pending = !1, this.attached = !0, this.open();
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
}, f$ = 500;
function p$(e) {
	let { changes: t, ...n } = e;
	return n;
}
function m$() {
	return {};
}
function h$(e) {
	return typeof e == "string" ? e : null;
}
var g$ = class {
	windowId;
	connection;
	started = !1;
	gate = new d$();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new eQ(t), this.connection = new c$().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(Y.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.connection.state === $.Reconnecting;
	}
	get isReattaching() {
		return this.gate.reattaching;
	}
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, h$(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, h$(n))));
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
		if (!(this.started || this.connection.state !== $.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== $.Disconnected && (await this.connection.stop(), this.started = !1);
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, p$));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, p$));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, p$));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, m$, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new u$(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, m$));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), f$);
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
		if (this.connection.state !== $.Connected) {
			if (this.connection.state === $.Disconnected) this.started = !1, await this.startAsync();
			else throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, _$ = Promise.resolve(), v$ = () => {}, y$ = GZ * 3 / 4, b$ = 128, x$ = class {
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
		if (this.handed >= this.given) return _$;
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
		for (; this.flight !== null;) await this.flight.catch(v$);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = qZ(e.value), i = r === null ? null : XZ(r);
		return i?.catch(v$), new Promise((a, o) => {
			let s = C$(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? S$(e) : S$({
				...e,
				value: void 0
			}) + b$;
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
		for (let t of e) if (t.staged === null) n.push(t.update), r.push(t);
		else try {
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, w$(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof u$) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= y$);) t += this.queue[e].bytes, e++;
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
			} else n.push({
				...r,
				staged: this.restage(r.body),
				suspect: r.suspect || t.byServerError
			});
		}
		n.length !== 0 && (this.queue.unshift(...n), this.given++);
	}
	restage(e) {
		if (e === null) return null;
		let t = this.transport.whenAttached().then(() => XZ(e));
		return t.catch(v$), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function S$(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function C$(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function w$(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var T$ = "content-fills", E$ = "content", D$ = "data-ui-root", O$ = "--ui-height", k$ = "var(--ui-fill-height";
function A$(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(D$)) return;
	let r = e.style.getPropertyValue(O$).trimStart().startsWith(k$);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(An, r);
}
//#endregion
//#region src/updates/form-owner.ts
var j$ = "form-owner", M$ = "ui-form-";
function N$(e) {
	return M$ + e.replace(/[ \t\n\f\r]/g, "_");
}
function P$(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = N$(t);
	I$(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function F$(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(M$) && I$(e);
	}
}
function I$(e) {
	let t = L$();
	if (t.querySelector(`form[id="${Ui(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function L$() {
	let e = document.body.querySelector(`[${sn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(sn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var R$ = document;
function z$() {
	try {
		return R$.execCommand("copy");
	} catch {
		return !1;
	}
}
function B$(e) {
	try {
		return typeof R$.execCommand == "function" && R$.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var V$ = "ui-lightbox", H$ = "ui-lightbox-title", U$ = new Gy("data-ui-lightbox-part"), W$ = "data-ui-lightbox-set", G$ = "data-ui-lightbox-slot", K$ = "data-ui-lightbox-still", q$ = "--ui-lightbox-shift", J$ = 16, Y$ = 1 / 5, X$ = null, Z$ = null, Q$ = null;
function $$(e, t, n) {
	let r = t.filter((e) => $a(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	X$ ??= i1(e), (X$.dialog.hasAttribute("hidden") || !X$.dialog.isConnected) && document.body.append(X$.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => $a(e.source) === null).length;
	Q$ = null, Z$ = {
		pictures: r,
		index: r1(n - i, r.length)
	}, X$.dialog.toggleAttribute(W$, r.length > 1);
	for (let e of X$.neighbours) e.hidden = r.length < 2;
	return f1(X$), p1(X$, Z$), e.open(V$);
}
function e1(e, t, n) {
	let r = t1(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(n1)) {
		let n = t === e ? r : t1(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function t1(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = $a(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function n1(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function r1(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function i1(e) {
	let { dialog: t, surface: n } = Wy({
		key: V$,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: H$,
		closesOnEscapeAndBackdrop: !0
	}), r = U$.element("h2", "ui-lightbox__title"), i = o1("ui-lightbox__close", "close"), a = U$.element("div", "ui-lightbox__stage"), [o, s] = a1("previous"), [c, l] = a1("current"), [u, d] = a1("next"), f = U$.element("div", "ui-lightbox__nav"), p = o1("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = o1("ui-lightbox__step ui-lightbox__step--next", "next"), h = U$.element("span", "ui-lightbox__counter ui-text-type--caption"), g = U$.element("span", "ui-lightbox__count-room"), _ = U$.element("span", "ui-lightbox__count"), v = U$.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = H$, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), D.write(r, null, "ui.lightbox.label"), D.write(i, "aria-label", "ui.action.close"), D.write(p, "aria-label", "ui.lightbox.previous"), D.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (U$.pressed(t)) {
			case "close":
				e.dismiss(V$);
				break;
			case "previous":
				s1(-1);
				break;
			case "next": s1(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !M(e) || Z$ === null || Z$.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), s1(h1(t) ? -n : n));
	}), g1(t, a), {
		dialog: t,
		stage: a,
		current: c,
		picture: l,
		previousPicture: s,
		nextPicture: d,
		neighbours: [o, u],
		count: _,
		countRoom: g,
		caption: v
	};
}
function a1(e) {
	let t = U$.element("div", "ui-lightbox__figure"), n = U$.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(G$, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(st, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function o1(e, t) {
	let n = U$.element("button", e, t);
	return n.type = "button", n;
}
function s1(e) {
	if (X$ === null || Z$ === null || Z$.pictures.length < 2) return;
	let t = X$;
	if (u1(t), jm()) {
		d1(t, e), f1(t), p1(t, Z$);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = h1(t.dialog) ? -1 : 1;
	Q$ = n, t.stage.removeAttribute(K$), t.stage.style.setProperty(q$, `${-e * r * c1(t.stage)}px`), Nm(t.current, z.normal + 100, () => l1(t, n));
}
function c1(e) {
	return e.getBoundingClientRect().width + J$;
}
function l1(e, t) {
	if (Q$ !== t || t.landed) return;
	d1(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? u1(e) : n.then(() => {
		Q$ === t && u1(e);
	});
}
function u1(e) {
	let t = Q$;
	t !== null && Z$ !== null && (Q$ = null, t.landed || d1(e, t.by), f1(e), p1(e, Z$));
}
function d1(e, t) {
	if (Z$ === null) return;
	let n = Z$.pictures.length;
	Z$.index = ((Z$.index + t) % n + n) % n, m1(e.picture, Z$.pictures[Z$.index].source);
}
function f1(e) {
	e.stage.setAttribute(K$, ""), e.stage.style.setProperty(q$, "0px"), e.stage.getBoundingClientRect();
}
function p1(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	m1(e.picture, r.source), m1(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), m1(e.nextPicture, t.pictures[(t.index + 1) % n].source), D.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), D.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, D.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), D.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function m1(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(st), e.src = t);
}
function h1(e) {
	return getComputedStyle(e).direction === "rtl";
}
function g1(e, t) {
	Ng(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || X$ === null || Z$ === null || Z$.pictures.length < 2 ? !1 : (u1(X$), !0),
		start: () => t.setAttribute(K$, ""),
		follow: (e) => t.style.setProperty(q$, `${e}px`),
		end: (n, r, i) => {
			i && _1(n, window.innerWidth, r) ? s1((h1(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(K$), t.style.setProperty(q$, "0px"));
		}
	});
}
function _1(e, t, n) {
	return Math.abs(e) > t * Y$ || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var v1 = "ui-notification-host", y1 = "ui-notification", b1 = "ui-notification--leaving", x1 = "ui-notification__message", S1 = "ui-notification__title", C1 = "ui-notification__action", w1 = "ui-notification__close", T1 = 5e3, E1 = 8e3, D1 = "ui-notification--connection", O1 = "--ui-notification-lift", k1 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), A1 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? T1, this.ensureHost(), this.announcer = Ck(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = PS(e.severity), n = document.createElement("div");
		n.className = k1.has(t) ? `${y1} ${y1}--${t}` : y1, n.classList.toggle(D1, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = x1, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = S1, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${w1} ${Ai}`, D.write(i, "aria-label", "ui.action.close"), D.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(P1(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || j(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), j1(() => {
			if (n.classList.contains(b1)) return;
			let t = this.ensureHost();
			M1(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : E1, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(b1) || (e.classList.add(b1), e.isConnected && (this.returnFocus(e), jm() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => N1(e), z.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(b1));
		kp(Tp(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${w1}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${v1}`), n = t ?? document.createElement("div");
		return n.classList.add(v1), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function j1(e) {
	if (zG(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		zG(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function M1(e) {
	let t = window.innerHeight - zh(window.innerHeight);
	t > 0 ? e.style.setProperty(O1, `${Math.round(t)}px`) : e.style.removeProperty(O1);
}
function N1(e) {
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
		duration: z.fast,
		easing: z.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function P1(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${C1} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function F1(e, t) {
	let n = I1(e), r = e?.label;
	if (n !== void 0) {
		if (!E(r) && !ec(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function I1(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function L1(e, t, n) {
	let r = e.itemKey === !0 ? R1(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = z1(t);
	i === null ? s("insert text effect target holds no text field.", e) : B1(i, r);
}
function R1(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function z1(e) {
	if (xu(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (xu(t)) return t;
	return null;
}
function B1(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && B$(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function V1(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : H1(t, e.request?.parameters ?? null);
}
function H1(e, t) {
	let n = U1(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function U1(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, W1(e));
	return t.toString();
}
function W1(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function G1(e, t) {
	let n = q1([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return q1(r, t) ?? K1(t);
}
function K1(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && J1(t, e) ? t : null;
}
function q1(e, t) {
	let n = null;
	for (let r of e) if (UF(r, t)) {
		if (J1(r, t)) return r;
		n ??= r;
	}
	return n;
}
function J1(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var Y1 = class {
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
		this.handlers.set(da(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = da(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
		if (n === void 0) s("client effect kind is not supported.", {
			kind: e.effect?.kind,
			effect: e.effect
		});
		else try {
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
			let t = V1(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : Ja(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !Ja(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = ha(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(zr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = t0(e);
			t !== null && (yq(t), r0(t));
		}), this.register("ScrollTo", (e) => {
			let t = t0(e);
			if (t === null) return;
			let n = e.effect, r = fa(n.behavior), i = pa(n.block);
			yq(t), t.scrollIntoView({
				behavior: n0(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = t0(e);
			if (t === null) return;
			let n = e.effect, r = aq(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = pa(n.block);
			yq(Hu(r)), oq(r, n.key, i === "Unknown" ? "Start" : i, n0(fa(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = t0(e);
			if (t === null) return;
			let n = e.effect, r = ga(n.axis) !== "Horizontal", i = G1(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ma(n.position), u;
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
			let d = n0(fa(n.behavior));
			yq(i), r && l === "End" && Cq(i) && vq(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			e0(t0(e), null);
		}), this.register("Hide", (e) => {
			e0(t0(e), "hidden");
		}), this.register("Collapse", (e) => {
			e0(t0(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = i0(e, this.valueReaders);
			t !== null && a0(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = t0(e);
			t !== null && L1(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = t0(e);
			t !== null && !by(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				$$(this.dialogs, Z1(t.images), t.startIndex ?? 0);
				return;
			}
			let n = t0(e), r = n === null ? null : e1(n, t.rows === !0, (t) => e.dom.findEveryComponent(T(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : $$(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Wa(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			ty.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!E(t.message) && !ec(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : F1(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			BG() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!E(t.message) && !ec(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, _a(t.politeness) === "Assertive" ? "assertive" : "polite");
		});
	}
	leaveFor(e) {
		this.navigate === void 0 ? window.location.assign(e) : this.navigate(e);
	}
	writeAddress(e, t) {
		let n = e.effect.parameters;
		this.address === void 0 ? s(`${e.effect.kind} effect arrived but no address history is wired up.`, e.effect) : t(this.address, typeof n == "object" ? n : null);
	}
	applyDialogEffect(e, t, n) {
		let r = e.effect.dialogKey;
		r === void 0 || r.length === 0 ? s(`${t} effect carries no dialog key.`, e.effect) : this.dialogs === void 0 ? s(`${t} effect arrived but no dialog engine is wired up.`, r) : n(this.dialogs, r);
	}
	showSystemNotification(e) {
		let t = e.title;
		if (!E(t) && !ec(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = E(e.body) || ec(e.body) ? e.body : void 0, r = typeof e.address == "string" && Ja(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && zG(document.visibilityState)) {
			i();
			return;
		}
		let a = I1(e.action);
		GG({
			title: X1(t),
			body: n === void 0 ? void 0 : X1(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Ja(e.icon) ? e.icon : Q1(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? $1(),
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
		return t !== void 0 && n !== void 0 && qG(t) ? {
			label: E(e.addressLabel) || ec(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : F1(e.action, this.runAction);
	}
};
function X1(e) {
	return E(e) ? D.translate(e.key, e.args) : ec(e) ? D.resolveText(e.text) : "";
}
function Z1(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: E(n.caption) || ec(n.caption) ? n.caption : void 0,
		altText: E(n.altText) || ec(n.altText) ? n.altText : void 0
	});
	return t;
}
function Q1() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function $1() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function e0(e, t) {
	if (e === null) return;
	let n = nm();
	for (let n of mi) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && rm(n);
}
function t0(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function n0(e) {
	return e === "Smooth" && !jm() ? "smooth" : "auto";
}
function r0(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Bf))) {
		e.focus();
		return;
	}
	let t = lp(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function i0(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = t0(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Pl(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Ol(t.readHeld(r));
}
async function a0(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!o0(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function o0(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return z$();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var s0 = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => c0(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = lp(t), i = np() && xu(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Sp(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), l0(t) && this.swipes.set(e, zg(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && kp(Tp(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${$h}]:not([hidden])`)) {
			let t = e.getAttribute($h);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${$h}="${Ui(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${tg}]`);
		if (n === null) return;
		let r = n.closest(`[${$h}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute($h);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || cg(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !_g() && !fu(e)) {
				let n = t.getAttribute($h);
				n !== null && (e.preventDefault(), this.dismiss(n));
			} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && mp(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(C)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return og(this.root);
	}
};
function c0(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${tg}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function l0(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var u0 = "ui-leave", d0 = new Gy("data-ui-leave-part"), f0 = "560px", p0 = null, m0 = null;
function h0(e, t) {
	p0 ??= g0();
	let n = p0;
	n.isConnected || document.body.append(n), _0(n, "title", D.text("ui.leave.title")), _0(n, "message", D.text("ui.leave.message")), _0(n, "stay", D.text("ui.leave.stay")), _0(n, "leave", D.text("ui.leave.confirm")), m0 = {
		dialogs: e,
		leave: t
	}, e.open(u0);
}
function g0() {
	let { dialog: e, surface: t } = Wy({
		key: u0,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", f0);
	let n = d0.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = d0.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, d0.actions(d0.button("ui-button--ghost", "stay"), d0.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = d0.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = m0;
		m0 = null, n?.dialogs.close(u0), t === "leave" && n?.leave();
	}), e;
}
function _0(e, t, n) {
	let r = d0.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var v0 = class {
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
		this.deciding || !this.asks ? this.leave(e) : this.decideAsync(e);
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
		let t = y0(e, this.options.window.location.href);
		t !== null && (!this.holds && !this.options.pending() ? this.options.follow?.(t) === !0 && e.preventDefault() : (e.preventDefault(), this.decideAsync(t)));
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
function y0(e, t) {
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
	return Ja(s) ? s : null;
}
//#endregion
//#region src/interactions/navigation-progress.ts
var b0 = 200, x0 = 1e4, S0 = "ui-navigation-progress", C0 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? b0, this.givenUpAfter = e.givenUpAfterMilliseconds ?? x0, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		y0(e, this.window.location.href) !== null && this.start(e);
	}
	start(e = null) {
		let t = {};
		return this.clearTimer(), this.wait = t, this.isShown ? this.giveUpLater() : this.timer = this.window.setTimeout(() => this.show(e), this.shownAfter), () => {
			this.wait === t && this.stop();
		};
	}
	clearTimer() {
		this.timer !== null && (this.window.clearTimeout(this.timer), this.timer = null);
	}
	get isShown() {
		return this.bar?.isConnected === !0;
	}
	giveUpLater() {
		this.timer = this.window.setTimeout(() => this.stop(), this.givenUpAfter);
	}
	show(e) {
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= w0(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function w0() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${S0} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var T0 = "neEntry", E0 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = D0(e.window.history.state) ?? 0, D0(e.window.history.state) === null && e.window.history.replaceState({ [T0]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(H1(this.route, e), !1);
	}
	push(e) {
		let t = H1(this.route, e), n = this.window.location;
		this.write(t, t !== `${n.pathname}${n.search}`);
	}
	back() {
		return this.hasEntryBehind() ? (this.window.history.go(-1), !0) : !1;
	}
	hasEntryBehind() {
		let e = this.window.navigation;
		if (e !== void 0) return e.canGoBack;
		if (this.entry > 0) return !0;
		let t = this.window.document?.referrer ?? "", n = this.window.location.origin;
		return n !== void 0 && t.startsWith(`${n}/`);
	}
	enter(e) {
		this.write(e, !0);
	}
	stepBack() {
		let e = this.lastStep;
		this.lastStep = null, e !== null && (e.step !== null && e.step !== 0 ? (this.undoing = !0, this.window.history.go(-e.step)) : this.write(`${this.route}${e.previous}`, !0));
	}
	write(e, t) {
		t ? (this.entry++, this.window.history.pushState({ [T0]: this.entry }, "", e)) : this.window.history.replaceState({ [T0]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = D0(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(A0(e.search));
	}
};
function D0(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[T0];
	return typeof t == "number" ? t : null;
}
function O0(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => k0(r, e) !== k0(i, e));
}
function k0(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function A0(e) {
	let t = new URLSearchParams(e);
	if ([...t.keys()].length === 0) return null;
	let n = {};
	return t.forEach((e, t) => {
		if (Object.hasOwn(n, t)) {
			let r = n[t];
			n[t] = Array.isArray(r) ? [...r, e] : [r, e];
		} else n[t] = e;
	}), n;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var j0 = class {
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = HY(n, this.extensions.converters), c = !1;
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
			for (let l of i) {
				let i = this.addressResolver.resolveOperationTargets(l, t);
				if (i.length === 0) t.optional !== !0 && s("property operation target was not found.", {
					reference: e,
					operation: t
				});
				else for (let s of i) !r && !this.restoring && this.holdsProperty(s, e.propertyId) ? c = !0 : this.applyOperation(l, t, s, a, n, o, r);
			}
		}
		!this.state.set(e, t, n, () => N0(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Pc(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Xe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && BY(t, n) ? this.operations.apply({
			resolved: e,
			operation: t,
			target: n,
			value: a.value,
			convertedValue: a.convertedFor(t),
			local: o
		}) : this.operations.apply({
			resolved: e,
			operation: t,
			target: n,
			value: r,
			convertedValue: i,
			local: o
		});
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, () => N0(r[0]?.component)) ? {
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
			(typeof n == "string" || ec(n) ? this.addressResolver.isTranslatable(t.reference) : E(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ye}${Wi(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => qi(e, t, () => M0(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = HY(t, this.extensions.converters);
		for (let t of e.definition.operations) {
			let a = this.extensions.converters.convert(t.converter, n);
			for (let o of r(t)) this.applyOperation(e, t, o, n, a, i, !0);
		}
	}
	applyToComponent(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return !1;
		let i = this.shownValue(t, n);
		return this.applyOperations(r, n, i, (e) => this.addressResolver.resolveOperationTargets(r, e)), this.notifyValueChanged({
			reference: t,
			propertyName: r.propertyName,
			dynamicParameters: [],
			value: i,
			local: !0,
			components: [e]
		}), !0;
	}
	writeBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Xe))), r = e.closest(C);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Xe)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) Ll(e);
		else {
			this.restoring = !0;
			try {
				this.applyPropertyValue(r, t, this.state.get(r, t), !1);
			} finally {
				this.restoring = !1;
			}
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
function M0(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function N0(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Ta(e, wa(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var P0 = "EndValue", F0 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Mp) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = L0(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : I0(e, this.edits?.metadata) ? t.querySelector(`[${zt}]`) : Pl(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Ia(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(zt);
		for (let e of r) {
			if (t.metadata !== void 0 && I0(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = L0(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function I0(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === P0;
}
function L0(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function R0(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var z0 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, U0(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), B0(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(V0(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: U0(n)
		});
	}
	applyRow(e) {
		let t = w(e.component?.id), n = e.component?.dynamicParameters ?? [], r = V0(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), B0(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(V0(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && H0(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !H0(a.dynamicParameters, e)) continue;
			let o = a.rows.findIndex((e) => e.key === t);
			o < 0 || (a.rows[o] = {
				key: t,
				item: r(a.rows[o].item)
			}, i = !0);
		}
		return i;
	}
	forEachRow(e) {
		for (let [t, n] of this.collections) for (let r of n) e(t, r);
		for (let t of this.rowCollections.values()) for (let n of t.rows) e(t.componentId, n);
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
function B0(e, t) {
	switch (sa(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) W0(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) G0(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) K0(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) q0(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function V0(e, t) {
	return `${e}:${ca(t)}`;
}
function H0(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function U0(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function W0(e, t) {
	typeof t.key == "string" && (G0(e, t.key), e.splice(J0(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function G0(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function K0(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? W0(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function q0(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(J0(n, e.length), 0, i);
}
function J0(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var Y0 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, X0(e, "", t.map((e) => e.split("."))));
	}
	mark(e, t) {
		let n = this.byHost.get(e);
		if (n !== void 0) for (let e of t) this.markRecord(e.item, n);
	}
	markRecord(e, t) {
		if (typeof e == "object" && e) {
			if (Array.isArray(e)) for (let n of e) this.markRecord(n, t);
			else {
				this.records.set(e, t);
				for (let n of Object.keys(e)) {
					let r = t.members.get(n.toLowerCase());
					r != null && this.markRecord(e[n], r);
				}
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
function X0(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : X0(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function Z0(e) {
	let t = new Y0();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var Q0 = class {
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
		t === void 0 || n < 0 || (e.host.isConnected ? this.rebase(e.host, t, () => t.splice(n, 1)) : t.splice(n, 1));
	}
	around(e, t, n) {
		let r = this.waiting.get(e);
		r === void 0 || r.length === 0 ? n() : this.rebase(e, r, () => {
			n();
			for (let e of t) {
				let t = r.findIndex((t) => t.move.key === e);
				t >= 0 && r.splice(t, 1);
			}
		});
	}
	rebase(e, t, n) {
		for (let n = t.length - 1; n >= 0; n--) this.mover.move(e, t[n].move.key, t[n].from);
		try {
			n();
		} finally {
			this.restand(e, t);
		}
	}
	restand(e, t) {
		for (let n = 0; n < t.length;) {
			let r = t[n], i = this.mover.indexOf(e, r.move.key);
			i === null ? t.splice(n, 1) : (r.from = i, this.mover.move(e, r.move.key, r.move.index), n++);
		}
		t.length === 0 && this.waiting.delete(e);
	}
}, $0 = class {
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
		if (n.length === 0) t();
		else {
			for (let e = n.length - 1; e >= 0; e--) this.undo(n[e]);
			t();
			for (let e of n) if (e.rows.splice(0, e.rows.length, ...e.rows.filter((t) => this.transferer.holds(e.source, t.key) && !this.transferer.holds(e.target, t.key))), e.rows.length === 0) this.waiting.delete(e);
			else {
				for (let t of e.rows) {
					let n = this.transferer.take(e.source, t.key);
					n !== null && (t.taken = n);
				}
				this.redo(e);
			}
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
function e2(e, t) {
	let n = t2(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = t2(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !Qp(i, t.component?.dynamicParameters ?? [])) break;
		if (a === null) a = t.items ?? [];
		else {
			o ??= [...a];
			for (let e of t.items ?? []) o.splice(typeof e.index == "number" && e.index >= 0 && e.index < o.length ? e.index : o.length, 0, e);
			a = o;
		}
	}
	return a === null ? null : {
		componentId: r,
		dynamicParameters: i,
		items: a,
		length: s - t
	};
}
function t2(e, t) {
	if (e === void 0 || ua(e) !== "CollectionChange") return null;
	let n = e;
	return sa(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var n2 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function r2(e, t, n, r) {
	return {
		action: sa(e.action),
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
var i2 = [], a2 = class {
	metadata;
	propertyPatchEngine;
	state;
	itemsRenderer;
	itemsTemplates;
	dom;
	virtualization;
	sinks;
	rowMenus;
	validationHandlers = [];
	fullResyncHandlers = [];
	pageHandlers = [];
	windowRefillHandlers = [];
	held = new z0();
	projections;
	touched = null;
	changedHosts = null;
	moves = new Q0({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new $0({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => m2(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = Z0(e), this.projections.isEmpty || NO((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ia(n);
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
	holdsRowCollection(e, t) {
		return t.length > 0 && this.rowMenus.holds(e);
	}
	forEachHeldRow(e) {
		this.held.forEachRow(e);
	}
	fillDrawnPart(e) {
		this.dom.invalidate(e), this.registerRenderedRows(e);
		let t = /* @__PURE__ */ new Set();
		for (let n = f2(e, t); n !== null; n = f2(e, t)) {
			t.add(n);
			let e = La(n);
			if (e === null) continue;
			let r = e.dynamicParameters.length > 0 ? this.held.getRow(e.componentId, e.dynamicParameters) : this.held.takeWaiting(n) ?? this.held.get(e.componentId);
			r !== void 0 && this.refillHost(n, {
				componentId: e.componentId,
				dynamicParameters: e.dynamicParameters,
				items: r
			});
		}
	}
	writeHeldItemValue(e) {
		let t = w(e.reference.componentId), n = e.dynamicParameters;
		if (n.length < 2 || !this.rowMenus.holds(t)) return;
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : WO(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => GY(e, i.steps, a)) && this.rowMenus.heldChanged();
	}
	touch(e) {
		if (this.touched !== null) for (let t of e) this.touched.add(t);
	}
	forgetHeldRows(e, t, n) {
		let r = (t) => this.rowMenus.standsInRowsOf(t, e);
		if (n === null) this.held.forgetRows(t, r);
		else for (let e of n) this.held.forgetRows([...t, e], r);
	}
	registerServerRenderedItems(e) {
		let t = /* @__PURE__ */ new Map(), n = (e) => {
			let n = t.get(e);
			return n === void 0 && (n = h2(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (ua(t) !== "CollectionChange") continue;
			let e = t;
			if (sa(e.action) !== "Insert") continue;
			let r = w(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => h2(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = La(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, p2(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of R0(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = Ia(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Ia(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		DW(e, t, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer,
			state: this.state,
			virtualization: this.virtualization
		});
	}
	applyChangeSet(e) {
		let t = e?.updates;
		if (t === void 0 || t.length === 0) return [];
		let n = u() ? performance.now() : -1, r = nm(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			jW(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && rm(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				ua(n) !== "Value" && NW((e) => !o2(n, e));
				let r = e2(e, t);
				if (r === null || this.namesSink(r)) {
					this.applyUpdate(n);
					continue;
				}
				t += r.length - 1, this.applyCollectionRefill(r);
			} catch (e) {
				c("applying an update failed.", {
					update: n,
					error: e
				});
			}
		}
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(lt) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.holdsCollection(e.componentId, e.dynamicParameters), n = this.holdsRowCollection(e.componentId, e.dynamicParameters);
		t && this.held.hold(e.componentId, e.items), n && (this.held.holdRow(e.componentId, e.dynamicParameters, e.items), this.rowMenus.heldChanged());
		let r = this.findItemsHosts(e.componentId, e.dynamicParameters);
		if (r.length === 0) t || n ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
		else for (let n of r) t && this.held.isWaiting(n) || this.refillHost(n, e);
	}
	refillHost(e, t) {
		this.transfers.around(e, () => this.moves.around(e, i2, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		let n = W(e) === "virtualized";
		try {
			if (n) {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else if (this.reconcileRows(e, t), W(e) === "windowed") for (let t of this.windowRefillHandlers) t(e);
		} finally {
			this.afterRowsChanged(e, t.componentId, !n);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = h2(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Qp(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Pf(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = W(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Pf(n) : null;
			n.remove(), Ff(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), d2(e, i), _k(e, i), o !== null && Ff(e, o.row, o.held), c) for (let t of i) If(e, t);
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
	addWindowRefillHandler(e) {
		this.windowRefillHandlers.push(e);
	}
	applyUpdate(e) {
		switch (ua(e)) {
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
		let t = w(e.address?.component?.id), n = la(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
		if (t <= 0 || n.length === 0) {
			s("value update has an invalid address.", e);
			return;
		}
		let i = this.metadata.getBindingByComponentAndPropertyName(t, n);
		i === void 0 ? this.metadata.hasComponentBindings(t) ? l("no rendered binding for this property; nothing to patch.", {
			componentId: t,
			propertyName: n
		}) : s(`binding metadata was not found for component ${t} (${n}).`, e) : this.propertyPatchEngine.applyPropertyValue(e.content === !0 ? {
			...i,
			content: !0
		} : i, r, e.value ?? null, !1);
	}
	applyValidationUpdate(e) {
		if (w(e.address?.component?.id) <= 0) s("validation update has an invalid address.", e);
		else for (let t of this.validationHandlers) t(e);
	}
	applyFullResync() {
		this.state.clear(), l("full resync requested; re-attaching.");
		for (let e of this.fullResyncHandlers) queueMicrotask(e);
	}
	applyCollectionChangeUpdate(e) {
		let t = w(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, r2(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		this.forgetRowState(t, n, e);
		let a = this.holdsCollection(t, n), o = this.holdsRowCollection(t, n);
		a && this.held.apply(e), o && (this.held.applyRow(e), this.rowMenus.heldChanged());
		let c = this.findItemsHosts(t, n);
		if (c.length === 0) {
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (sa(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = sa(e.action) === "Move" ? l2(e.moves ?? []) : i2;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = W(e) === "virtualized", i = sa(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (sa(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				s2(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				u2(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), vk(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = W(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : uk(e, G(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + dO(e);
	}
	moveRow(e, t, n) {
		let r = Ia(e);
		if (r === null) return;
		let i = Math.max(0, n - dO(e));
		W(e) === "virtualized" ? this.virtualization.move(e, t, i) : u2(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = G(e), r = m2(n, t);
		if (r === null) return null;
		let i = uk(e, n), a = i.indexOf(r);
		return pk(i, r), r.remove(), this.afterRowsChanged(e, Ia(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = uk(e, G(e));
		rA(t.element), e.insertBefore(t.element, fk(n, t.element, t.index)), this.afterRowsChanged(e, Ia(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Ia(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, fk(uk(e, G(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		pk(uk(e, G(e)), t), t.remove(), this.afterRowsChanged(e, Ia(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (sa(n.action)) {
			case "Remove":
			case "Replace": {
				let r = (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string");
				this.state.forgetRows(e, t, r), this.forgetHeldRows(e, t, r);
				break;
			}
			case "Reset": this.state.forgetHost(e, t), this.forgetHeldRows(e, t, null);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (sa(t.action)) {
			case "Insert":
				for (let n of t.items ?? []) n.key !== null && n.key !== void 0 && this.virtualization.insert(e, n.key, n.item, n.index ?? null);
				break;
			case "Remove":
				this.virtualization.remove(e, (t.items ?? []).map((e) => e.key).filter((e) => typeof e == "string"));
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
			let e = aq(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = uk(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, fk(i, o, a.index ?? null)), If(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return BX(e, t, n, r, {
				metadata: this.metadata,
				templates: this.itemsTemplates,
				renderer: this.itemsRenderer
			});
		} catch (t) {
			return c("drawing an item row failed; the row is left out.", {
				componentId: e,
				key: n,
				error: t
			}), null;
		}
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = uk(e, i), o = h2(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Pf(c);
					gk(a, c, l), c.replaceWith(l), Ff(e, l, t);
				} else e.insertBefore(l, fk(a, l, i.index ?? null));
			}
		}
	}
};
function o2(e, t) {
	if (ua(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(C);
	return r !== null && T(r) === w(n?.id) && Ea(r, n?.dynamicParameters ?? []);
}
function s2(e, t, n) {
	let r = G(e), i = h2(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = Nf(e), c = o === null ? null : n ? c2(e, a) : kf(o, r, a);
	mk(uk(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function c2(e, t) {
	let n = [];
	for (let e of t) {
		let t = Pf(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) Ff(e, null, t);
	};
}
function l2(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function u2(e, t) {
	let n = G(e), r = uk(e, n), i = h2(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = hk(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function d2(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function f2(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function p2(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function m2(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function h2(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function g2(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return E(n) || ec(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: v2(t.severity)
	} : void 0;
}
function _2(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(E(t) || ec(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function v2(e) {
	let t = ia(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var y2 = "ui-validation--warning", b2 = "ui-validation--info", x2 = "ui-validation-message--marker", S2 = "top-end", C2 = "right", w2 = "--ui-validation-marker-host", T2 = "ui-validation-mark", E2 = "--ui-validation-presentation", D2 = "--ui-validation-color", O2 = "Validation", k2 = /* @__PURE__ */ new Set(["Value", "EndValue"]), A2 = /* @__PURE__ */ new Set(["Min", "Max"]), j2 = `input:not([type='hidden']), textarea, select, .${Di}[role='combobox'], [role='spinbutton']`, M2 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, N2 = {
	Error: Bi,
	Warning: y2,
	Info: b2
}, P2 = `.${Bi}, .${y2}, .${b2}`, F2 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, I2 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, L2 = {
	Error: `${T2}--error`,
	Warning: `${T2}--warning`,
	Info: `${T2}--info`
}, R2 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, z2 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(P2)), B(this.root, P2, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(P2)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(P2)) {
			let t = T(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? this.readRuleValue(i);
		o.length > 0 ? (this.touchedElements.add(i), this.evaluateAndApply(r, i, o, s)) : a && this.applyCurrentState(r, i);
	}
	forgetJudgement(e) {
		let t = this.failingRulesByElement.delete(e), n = this.refusalByElement.delete(e), r = this.boundRefusalByElement.has(e);
		return this.forgetBoundRefusal(e), t || n || r;
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			K2(t, W2(t) === "Error");
			let e = t.querySelector(`:scope > [${Vi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), q2(this.markerMirrors, t, e, {
				message: n,
				severity: W2(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = Oc(t), r = W2(e);
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
		e.propertyName === O2 ? this.applyBoundMessage(e) : (this.applyGivenValue(e), this.applyChangeTrigger(e));
	}
	applyGivenValue(e) {
		let t = k2.has(e.propertyName), n = A2.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(T(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(T(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = w(e.reference.componentId), n = g2(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => ra(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = E(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: v2(e.severity),
			content: e.content === !0,
			property: la(e.address?.property)
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
		let n = A(t) || O(t) ? null : H2(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return U2(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Pl(e);
		return t === null ? null : this.readValue(t);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(T(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: R2[t]
		}), this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) if (v2(r.severity) === "Error" && B2(t, r) && !B2(n, r)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !B2(t, r) && (n === null || M2[v2(r.severity)] < M2[v2(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: I2[v2(n.severity)],
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
		G2(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${w(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(_2).join("\n"), !0);
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
			severity: v2(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || M2[e.severity] < M2[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => ra(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => ra(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${on}="${Ui(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(j2)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: jm() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && v2(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) B2(r, e) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function B2(e, t) {
	return ta(t.operator) !== "Required" && V2(e) ? !0 : _m(e, t.operator, t.value);
}
function V2(e) {
	return e !== !1 && !_m(e, "Required", null);
}
function H2(e, t) {
	return rO(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? Hj(e) : null);
}
function U2(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : E(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function W2(e) {
	return e.classList.contains(y2) ? "Warning" : e.classList.contains(b2) ? "Info" : "Error";
}
function G2(e, t, n) {
	for (let e of Object.values(N2)) t.classList.toggle(e, n !== void 0 && N2[n.severity] === e);
	K2(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(D2) : r.style.setProperty(D2, `var(--ui-color-${F2[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Ec(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), q2(e, r, i, n));
}
function K2(e, t) {
	for (let n of e.querySelectorAll(j2)) {
		let r = n.closest(Ei);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function q2(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(E2).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(x2, o), J2(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(w2).trim()), r !== void 0 && o ? (n.setAttribute(Re, Oo(n.textContent ?? "")), n.setAttribute(ze, S2), n.setAttribute(Ve, I2[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? jL(n) : ML(n)) : (n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), ML(n));
}
function J2(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : X2(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && Y2(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${T2} ${L2[n.severity]}`, s.textContent = r, s.setAttribute(Re, Oo(r)), s.setAttribute(ze, C2), s.setAttribute(Ve, I2[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (Y2(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), ML(s);
}
function Y2(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${T2}`) === null && t.removeAttribute(Be);
}
function X2(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var Z2 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, Q2 = "card-header-shown", $2 = `[${Mi}], [${Ni}], [${Fi}], [${Ii}], [${Li}]`;
function e4(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches($2);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Ri, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var t4 = "menu-surface";
function n4(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = AC(e);
	n === null ? t.removeAttribute(_n) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(_n, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var r4 = "tooltip-name";
function i4(e, t, n) {
	let r = Do(e.getAttribute(Re));
	Ec(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var a4 = /* @__PURE__ */ new WeakMap(), o4 = /* @__PURE__ */ new WeakMap(), s4 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(aa(e), t);
	}
	apply(e) {
		let t = aa(e.operation.kind), n = this.handlers.get(t);
		if (n === void 0) s("DOM operation kind is not supported.", {
			kind: e.operation.kind,
			operation: e.operation
		});
		else try {
			n(e);
		} catch (t) {
			c("a DOM operation failed.", {
				kind: e.operation.kind,
				operation: e.operation,
				error: t
			});
		}
	}
	registerDefaults() {
		this.register("Text", (e) => c4(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? c4(e) : (ko(e.target, kl(e.convertedValue) ? "" : Ol(e.convertedValue)), Ec(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = g4(e.operation);
			Ec(e.target, t), e.operation.convertsNull !== !0 && kl(e.value) || kl(e.convertedValue) ? h4(e.target, t) : m4(e.target, t, Ol(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = g4(e.operation);
			Ec(e.target, t), h4(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = g4(e.operation), n = e.operation.condition ?? "HasValue", r = !kl(e.value) && l4(e.value, n), i = e.operation.value ?? (kl(e.convertedValue) || u4(n) ? "" : Ol(e.convertedValue));
			d4(e.target, p4(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !kl(e.value) && l4(e.value, e.operation.condition ?? "None") ? Ol(e.convertedValue).trim() : "";
			f4(e.target, p4(e), t, wC(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = g4(e.operation), n = !kl(e.value) && l4(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Ol(e.convertedValue).trim() : "";
				f4(e.target, p4(e), t, wC(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = g4(e.operation), n = e.target;
			if (kl(e.value) || kl(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Ol(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(r4, (e) => i4(e.resolved.component, e.target, g4(e.operation))), this.register(j$, (e) => P$(e.target, e.value)), this.register(Q2, (e) => e4(e.resolved.component)), this.register(Fc, (e) => Ic(e.target)), this.register(T$, (e) => A$(e.target)), this.register(xP, (e) => CP(e.target)), this.register(EP, (e) => kP(e.resolved.component)), this.register(Ix, (e) => {
			let t = Jx(e.target);
			t !== "keep" && d4(e.resolved.component, Ix, g4(e.operation), t === "show", "");
		}), this.register(t4, (e) => n4(e.target)), this.register("Property", (e) => {
			let t = g4(e.operation), n = e.target, r = kl(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function c4(e) {
	let t = Ol(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), Ec(e.target, null);
}
function l4(e, t) {
	switch (oa(t)) {
		case "None": return !0;
		case "HasValue": return !kl(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !kl(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return mo(e).length > 0;
		default: return !kl(e);
	}
}
function u4(e) {
	let t = oa(e);
	return t === "IsTrue" || t === "IsFalse";
}
function d4(e, t, n, r, i) {
	let a = o4.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), o4.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), m4(e, n, i)) : (o.delete(t), o.size === 0 && h4(e, n));
}
function f4(e, t, n, r) {
	let i = a4.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), a4.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function p4(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function m4(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function h4(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function g4(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var _4 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => kC.has(e.name),
			convert: (e) => kC.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = v4(e.name), n = {
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
		try {
			if (r !== void 0 && r.canConvert(i)) return r.convert(i);
			let e = this.converters.get("*");
			if (e !== void 0 && e.canConvert(i)) return e.convert(i);
		} catch (e) {
			return c("a converter failed; the value is written as it came.", {
				converter: n,
				value: t,
				error: e
			}), t;
		}
		return s("converter was not found.", { converter: n }), t;
	}
};
function v4(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var y4 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = va(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = va(e.domEventName) || t;
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
		return this.definitions.get(va(e));
	}
};
function b4(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function x4(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Df, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => b4(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => b4(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var S4 = class {
	converters = new _4();
	events = new y4();
	operations = new s4();
	valueReaders;
	collectionSinks = new n2();
	rowDecorators = new Z2();
	constructor(e, t, n, r) {
		x4(this.events), this.valueReaders = new jl(r);
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
}, C4 = "Submenu", w4 = "ui-menu__submenu", T4 = "Select", E4 = ["Header", "Separator"], D4 = {
	kind: "menu",
	decorate: O4
};
function O4(e) {
	if (E4.includes(A4(e.item, "Kind")) && e.row.setAttribute(hn, ""), !k4(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, C4);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(un, ""), A4(e.item, "Kind") === T4 && e.row.setAttribute(dn, ""), A4(e.item, "Expanded") === !0 && e.row.setAttribute(fn, "");
	let r = document.createElement("div");
	r.className = w4, r.appendChild(n), qY(r, e.key, e.item), e.row.appendChild(r);
}
function k4(e) {
	let t = A4(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function A4(e, t) {
	let n = BO(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var j4 = {
	kind: "grip",
	decorate: M4
};
function M4(e) {
	e.row.append(N4());
}
function N4() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function P4(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(I4(n));
	for (let t of e.querySelectorAll(`[${mt}]`)) F4(t, pt, r), F4(t, vt, i);
}
function F4(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function I4(e) {
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
//#region src/rendering/region-hold.ts
var L4 = `[${bt}]`;
function R4(e) {
	for (let t of e.querySelectorAll(L4)) t.removeAttribute(bt);
}
//#endregion
//#region src/runtime/engine-start.ts
var z4 = 2;
function B4(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= z4 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function V4(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var H4 = "ne.standard.ui.windowId", U4 = [
	500,
	1e3,
	2e3
], W4 = 3, G4 = [
	["refusal", ({ root: e }) => KJ(e)],
	["file input", ({ root: e, validation: t }) => new Oy({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Vb({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new ox({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Mx({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new gx({ root: e })],
	["image fallback", ({ root: e }) => new oS({ root: e })],
	["radio group sync", ({ root: e }) => new CS({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new oE({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Qw({ root: e })],
	["debounced commit", ({ root: e }) => new Tx({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new TE({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => OE() ? void 0 : new kE({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new $W({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new nD({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new HH({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new HM({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new EN({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new FN({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new IK({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new $K({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new nq({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new bF({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new rV({ root: e })],
	["toggle button", ({ root: e }) => new px({ root: e })],
	["button group", ({ root: e }) => new lV({ root: e })],
	["menu", ({ root: e }) => new HL({ root: e })],
	["action bar", ({ root: e, dom: t }) => new oI({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new Mz({ root: e })],
	["menu group", ({ root: e }) => new GP({ root: e })],
	["menu search", ({ root: e }) => new $R({ root: e })],
	["side drawer", ({ root: e }) => new vz({ root: e })],
	["screen keyboard", () => new lz()],
	["grid splitter", ({ root: e }) => new Kz({ root: e })],
	["pane container", ({ root: e }) => new vB({ root: e })],
	["accordion", ({ root: e }) => new pV({ root: e })],
	["tabs", ({ root: e }) => new LV({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new pK({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new ZV({ root: e })],
	["breadcrumbs", ({ root: e }) => new fH({ root: e })],
	["scroll anchor", ({ root: e }) => new bq({ root: e })],
	["visible keys", ({ root: e }) => new TY({ root: e })],
	["surface press", ({ root: e }) => new lU({ root: e })],
	["text selection", ({ root: e }) => new Dq({ root: e })],
	["scroll group", ({ root: e }) => new Pq({ root: e })],
	["flyout interaction", ({ root: e }) => new V_({ root: e })],
	["text fold", ({ root: e }) => new EK({ root: e })],
	["tooltip", ({ root: e }) => ZI(e)]
], K4 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Yi(hZ());
	hydration = yZ();
	renderSequence = this.hydration?.sequence ?? null;
	rewriteMoments;
	dom;
	transport;
	dispatcher;
	updateProcessor;
	ruleWatcher;
	rowMenus;
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
	navigationProgress = new C0({ window });
	sessionKey = ty;
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
	endSwitchProgress = null;
	settleValues;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = PZ(e.windowIdStorageKey ?? H4, (e) => this.reloadAsOwnTab(e)), this.dom = new Fa(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new S4(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(D4), this.extensions.registerRowDecorator(j4), this.extensions.registerRowDecorator(gS);
		let t = new Ca(this.dom, this.metadata), n = this.extensions.operations, r = new nQ(), i = new j0(t, n, this.extensions, r);
		this.reactiveSources = new F0(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new s0({
			root: this.root,
			dom: this.dom
		}), this.notifications = new A1({
			root: this.root,
			dom: this.dom
		}), this.address = new E0({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => KG(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = EZ(document.documentElement, this.windowId, o);
		this.effects = new Y1({
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
			systemNotifications: WG(u)
		});
		let d = new Tm(this.metadata), f, p = new dm(d, i, new gm(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new oZ(this.dom), h = new UY(this.metadata, m, this.extensions, n, r), g = new uZ({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), yF((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new WX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new a2(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), D.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), D.onMomentTick(this.rewriteMoments), this.ruleWatcher = new eX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new g$(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new UG({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new ZZ(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Ji.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Ji.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? pZ(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && pZ(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new x$(this.transport);
		f = new Lp({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: _,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => {
				let r = i.recordValue(e, t, n);
				r !== null && this.ruleWatcher.awaitAnswer(r);
			},
			refuses: (e) => v.refusesBounds(e)
		}), i.setHeldTargets((e) => f?.isHeld(e) === !0), this.settleValues = async () => {
			Sx(), await _.whenAnsweredAsync();
		}, this.effects.register(Ji.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new v0({
			window: {
				location: {
					get href() {
						return window.location.href;
					},
					assign: (e) => {
						this.navigationProgress.start(), this.sessionKey.load(() => window.location.assign(e));
					}
				},
				addEventListener: (e, t) => window.addEventListener(e, t),
				removeEventListener: (e, t) => window.removeEventListener(e, t)
			},
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => h0(this.dialogs, t),
			pending: () => xx() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Qv, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(Ji.ConfirmLeave, (e) => {
			let t = e.effect.target;
			Ja(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new z2({
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
			validation: v,
			dialogs: this.dialogs,
			heldRows: this.virtualization
		};
		for (let [e, t] of G4) B4(e, t, this.engineContext);
		B4("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new tO({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), B4("tree", ({ root: e, effects: t }) => new kG({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), B4("items reorder", ({ root: e }) => new Bk({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), B4("press ripple", ({ root: e }) => new qq({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || p.hasEventForComponent("click", T(e)),
			waves: document.documentElement.hasAttribute(Lr)
		}), this.engineContext), B4("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new gJ() : void 0, this.engineContext), this.eventPipeline = new Jp({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: p,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: v,
			valueBinding: f,
			isReattaching: () => this.transport.isReattaching
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(lK.name, lK.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = Lk({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = dK(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(OG.name, OG.registration);
		let re = SA(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(Ax.name, Ax.registration), this.eventPipeline.addEvent(Jw.name, Jw.registration), B4("shortcuts", ({ root: e, dom: t }) => new $L({
			root: e,
			viewShortcuts: eR(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), B4("item drag", ({ root: e, dom: t }) => new TA({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new WU({ root: this.root }), this.windows = new yX({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), B4("pager", ({ root: e, dom: t }) => new IR({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: B,
			observeSize: Lz,
			store: new yP(),
			numbers: MD,
			temporal: Ns,
			icons: { apply: uo },
			badges: { writeCount: Sw },
			urls: {
				isImageSource: Qa,
				asBrowserReads: Za,
				isSafeLink: Wa,
				isExternalLink: qa
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
				let r = e.closest(C), a = r === null ? void 0 : this.metadata.getExposedProperty(T(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: AL,
			renames: { open: iu },
			tables: this.tables,
			rows: zY(m, h, this.virtualization),
			uploads: _y(v),
			selection: kd,
			popups: uY(this.dom),
			roving: Ru,
			typeAhead: bN,
			focus: up,
			states: Yc,
			validation: v,
			wheel: Zy,
			colors: vY,
			shortcuts: wu,
			names: Hi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			ny(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			tQ(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new UZ({
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
		let t = Pl(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && Q4() === null && O0(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = J4();
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
		if (e === D.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		D.setRequested(e);
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
			if (n !== this.languageSwitches || i === D.language || !await D.switchToAsync(i, r)) return;
			D.notifyChanged();
		} finally {
			n === this.languageSwitches && D.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, Nc(this.root, (e) => P4(e, D.number, D.temporal)));
		let i = n ? rc : void 0;
		D.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(D.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		D.language.length > 0 && document.documentElement.lang !== D.language && (document.documentElement.lang = D.language), d(n ? "page's moments written again" : "page's words written again", r, { language: D.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Nc(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${Ui(n)}"]`)) Da(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Da(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost(), this.endSwitchProgress?.(), this.endSwitchProgress = null;
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: D.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: D.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), this.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = AZ(e, navigator.cookieEnabled, MZ());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		AZ(e, navigator.cookieEnabled, MZ()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), F$(this.root), await Z4();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), R4(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Tc(this.root) || vZ(this.hydration) || this.metadata.getWords().some((e) => rc(e.key)) || rc(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) B4(V4(t), t, this.pluginContext);
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
		D.register(e);
	}
	addEngine(e) {
		this.enginesAwaitingHydration === null ? B4(V4(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !JZ(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await YZ(e, r) : null);
		}).catch((e) => {
			this.ruleWatcher.followAnswered(null), c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = i, i.then(() => {
			this.inbound === i && (this.inbound = null);
		}), i;
	}
	applyAnswered(e) {
		let t = null;
		try {
			e !== null && (this.applyNow(e), t = e);
		} finally {
			this.ruleWatcher.followAnswered(t);
		}
	}
	holdsRuntime(e) {
		return e == null || this.heldRuntime === null || e === this.heldRuntime;
	}
	applyNow(e) {
		this.windows.noteShownRows(), this.windows.sync(this.updateProcessor.applyChangeSet(e));
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
			if (e >= W4) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await xZ(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, U4, X4), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			jZ(MZ()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = J4();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && Y4(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = Q4(), n = t === null && this.heldRuntime !== null && O0(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? A0(e) : t.parameters,
			timeZone: SZ(),
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
			let t = JZ(e) ? await YZ(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function q4(e = {}) {
	let t = performance.now(), n = new K4(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function J4() {
	return document.querySelector(`[${jn}="${E$}"]`);
}
function Y4(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) Cq(t) && !(W(t) === "windowed" && wq(t)) ? (vq(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function X4(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function Z4() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function Q4() {
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
_(), q4().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
