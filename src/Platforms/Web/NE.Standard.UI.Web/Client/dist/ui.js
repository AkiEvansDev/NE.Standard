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
var On = "data-ui-bottom-bar", kn = "data-ui-rail-drawer", An = "data-ui-content-fills", jn = "data-ui-region", Mn = "data-ui-menu-item-kind", Nn = "ui-menu", S = "ui-menu-item", Pn = "ui-menu-item--checked", Fn = "ui-menu-item--selected", In = "ui-menu--rail", Ln = "ui-menu--nested", Rn = `[${Mn}="header"], [${Mn}="separator"]`, zn = `[${un}] > .${S}`, Bn = `.${S}:not(${Rn})`, Vn = `${zn}, .${S}[${Mn}="check"]`, Hn = "data-ui-shortcut", Un = "data-ui-collapse-toggle", Wn = "data-ui-folding", Gn = "data-ui-column-limits", Kn = "data-ui-row-limits", qn = "data-ui-splitter-step", Jn = "data-ui-splitter-position", Yn = "data-ui-pane-layout", Xn = "data-ui-pane", Zn = "data-ui-table-column", Qn = "data-ui-table-hide-below", $n = "data-ui-table-starts-hidden", er = "data-ui-table-hidden", tr = "ui-table__row", nr = "ui-table__scroll", rr = "ui-table__header", ir = "ui-table__resizer", ar = "ui-tree", or = "ui-tree__row", sr = "ui-tree-node", cr = "data-ui-tree-drop", lr = "ui-tree__row--filtered", ur = "data-ui-table-last", dr = "data-ui-table-reordering", fr = "data-ui-table-dragging", pr = "data-ui-table-drop", mr = "data-ui-table-scrolled", hr = "data-ui-table-scrollbar", gr = "data-ui-no-row-select", _r = "data-ui-tree-parent", vr = "data-ui-tree-children", yr = "data-ui-tree-folder", br = "data-ui-tree-expanded", xr = "data-ui-tree-title", Sr = "data-ui-tree-loading", Cr = "data-ui-tree-drop-target", wr = "data-ui-tree-boot", Tr = "data-ui-tree-draggable", Er = "data-ui-row-editing", Dr = "data-ui-boxed-editor", Or = "data-ui-row-idle", kr = "data-ui-step-collapsed", Ar = "data-ui-step-end", jr = "data-ui-row-bar", Mr = "data-ui-image-source", Nr = "data-ui-file-max-size", Pr = "data-ui-file-pick", Fr = "data-ui-file-drop-target-id", Ir = "data-ui-service-worker", Lr = "data-ui-theme", Rr = "data-ui-theme-colors", zr = "data-ui-words", Br = "data-ui-language-switcher", Vr = "data-ui-theme-switcher", Hr = "data-ui-theme-choice", Ur = "field", Wr = "data-ui-language", Gr = "data-ui-splitting", Kr = "data-ui-keyboard-up", qr = "data-ui-connection", Jr = "data-ui-split-folded", Yr = "data-ui-split-edge", Xr = "data-ui-pointer-focus", Zr = "data-ui-focus-within", Qr = "data-ui-popup-hover", $r = "data-ui-inner-pointer", ei = "data-ui-selection", ti = "data-ui-selected", ni = "data-ui-selected-key", ri = "data-ui-selected-keys", ii = "data-ui-bind-selected-key", ai = "data-ui-tabs-selected", oi = "data-ui-tab-caption", si = "data-ui-tab-key", ci = "data-ui-tab-page", li = "data-ui-tab-actions", ui = "data-ui-tab-pinned", di = [
	cn,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], fi = "data-ui-submit-form-id", C = `[${y}]`, pi = "data-ui-href", mi = "ui-disabled", hi = "ui-loading", gi = "ui-readonly", _i = "ui-hidden", vi = "ui-dialog__surface", yi = "ui-flyout__content", bi = `.ui-context-menu, .ui-split-button__menu, .${yi}`, xi = "data-ui-focus-holder", Si = "data-ui-owns-keys", Ci = "[role='listbox'], [role='menu'], [role='dialog']", wi = "ui-select__trigger", Ti = `.${wi}`, Ei = "ui-button", Di = `${Ei} ui-button--ghost ui-button--small`, Oi = "ui-select", ki = "data-ui-text-title", Ai = "data-ui-text-description", ji = "data-ui-plain-text", Mi = "data-ui-text-icon", Ni = "data-ui-text-badge-icon", Pi = "data-ui-text-badge-text", Fi = "ui-card__header--empty", Ii = "ui-text-input", Li = "ui-invalid", Ri = "data-ui-validation-message", zi = {
	componentId: y,
	key: b,
	selected: ti,
	selectedKey: ni,
	selectedKeys: ri,
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
	focusHolder: xi,
	ownsKeys: Si,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: Se,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: mi,
	loadingClass: hi,
	readOnlyClass: gi,
	hiddenClass: _i,
	buttonClass: Ei,
	selectClass: Oi,
	textInputClass: Ii,
	invalidClass: Li,
	validationMessage: Ri,
	sourceLine: Jt,
	textDescription: Ai,
	popupSelector: Ci,
	listTriggerSelector: Ti,
	tableRowClass: tr,
	tableScrollClass: nr,
	tableHeaderClass: rr,
	tableResizerClass: ir,
	tableHidden: er,
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
function Bi(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Vi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Hi = 0;
function Ui(e, t) {
	return e.id.length === 0 && (Hi++, e.id = `${t}-${Hi}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Wi(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(C) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Gi = {
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
}, Ki = class {
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
		return this.bindingsByComponentAndPropertyId.get(_a(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(_a(e, ga(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(va(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(ha(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ha(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ya(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(_a(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(_a(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = ha(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(va(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(ya(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = w(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function qi(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Ji(e) {
	return qi(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Yi(e) {
	return e == null ? "OneWay" : qi(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Xi(e) {
	return qi(e, ["Property", "Event"]);
}
function Zi(e) {
	return e == null ? "SetProperty" : qi(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Qi(e) {
	return qi(e, [
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
function $i(e) {
	return qi(e, ["Ascending", "Descending"]);
}
function ea(e) {
	return qi(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ta(e) {
	return qi(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function na(e) {
	return typeof e == "string" ? e : qi(e, [
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
function ra(e) {
	return qi(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function ia(e) {
	return qi(e, [
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
function aa(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function oa(e) {
	return typeof e == "string" ? e : "";
}
function sa(e) {
	return qi(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function ca(e) {
	return typeof e == "string" ? e.trim() : "";
}
function la(e) {
	return qi(e, ["Auto", "Smooth"]);
}
function ua(e) {
	return qi(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function da(e) {
	return qi(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function fa(e) {
	return qi(e, ["Light", "Dark"]);
}
function pa(e) {
	return qi(e, ["Horizontal", "Vertical"]);
}
function ma(e) {
	return qi(e, ["Polite", "Assertive"]);
}
function ha(e) {
	return e?.trim().toLowerCase() ?? "";
}
function ga(e) {
	return e?.trim() ?? "";
}
function _a(e, t) {
	return `${e}:${ga(t)}`;
}
function va(e, t) {
	return `${e}:${ha(t)}`;
}
function ya(e, t) {
	return `${e}:${aa(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ba = class {
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
		return n === void 0 && (n = `[${Je}${Vi(t)}="${Bi(e)}"]`, this.bindingSelectors.set(e, n)), n;
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
		return Wi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ye}${Vi(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function xa(e) {
	return Ta(e, ae);
}
function Sa(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Da(r);
		if (e !== void 0) {
			let t = r.closest(Ea);
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
function Ca(e, t) {
	let n = xa(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Sa(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function wa(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Da(r);
		if (e !== void 0) {
			let a = r.closest(Ea);
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
function Ta(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var Ea = `[${x}]`;
function Da(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Oa = `[${Ft}]`, ka = 64, Aa = 256;
function ja(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Ma = class {
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
		if (!this.stale) {
			if (e === void 0 || this.changedScopes.size >= ka) {
				this.stale = !0, this.changedScopes.clear();
				return;
			}
			this.changedScopes.add(e);
		}
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(C), t = this.root.querySelector(Oa) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest(Oa) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Fa(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Ui(e, t);
	}
	findComponentParts(e, t, n) {
		return ja(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(aa(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && Ca(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => Ca(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) {
			this.rebuild();
			return;
		}
		if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Aa) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Oa) !== null) return;
		let t = e.querySelector(Oa) !== null;
		e.matches(C) && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(C)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = T(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Oa) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Fa(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Ra(t) && t.sort(La), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Fa(n)) {
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
			let e = xa(n);
			if (e === 0) continue;
			let r = Sa(n, e);
			if (r.length !== e) continue;
			let i = aa(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return za(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(C);
			if (e === null || !za(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Sa(e, xa(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return Ta(e, y);
}
function Na(e) {
	let t = e.closest(C), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function Pa(e) {
	let t = e.closest(C), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Sa(t, xa(t))
	};
}
function Fa(e) {
	return xa(e) === 0;
}
function Ia(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function La(e, t) {
	return e === t ? 0 : Ia(e, t) ? -1 : 1;
}
function Ra(e) {
	for (let t = 1; t < e.length; t++) if (!Ia(e[t - 1], e[t])) return !1;
	return !0;
}
function za(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ba = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Va(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ba.includes(t.slice(0, n).toLowerCase());
}
function Ha(e) {
	return Va(e) ? String(e) : void 0;
}
var Ua = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Wa(e) {
	let t = Ja(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Ua.some((e) => n.startsWith(e));
}
function Ga(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Ka(e);
}
function Ka(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function qa(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Ja(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Ya(e) {
	return Xa(e) !== null;
}
function Xa(e) {
	let t = Ja(e), n = t.toLowerCase();
	return Ka(t) || qa(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Za(e) {
	return Xa(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Qa = "mask:", $a = "ui-icon--image", eo = "ui-icon--mask";
function to(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Qa) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Xa(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function no(e) {
	let t = to(e);
	return t === null ? "" : ro(t.source);
}
function ro(e) {
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
var io = "ui-icon", ao = "data-ui-icon", oo = "--ui-icon-url";
function so(e, t) {
	e.classList.add(io);
	for (let t of Array.from(e.classList)) lo(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(oo);
	let n = uo(t);
	if (n.length === 0) {
		e.removeAttribute(ao);
		return;
	}
	e.setAttribute(ao, ""), e.classList.add(n);
	let r = to(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(oo, ro(r.source));
}
var co = "ui-icon-glyph--";
function lo(e) {
	return e === $a || e === eo || e.startsWith(co);
}
function uo(e) {
	let t = to(e);
	return t === null ? fo(e) : t.tinted ? eo : $a;
}
function fo(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = co;
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
var po = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, mo = "\\", ho = "`", go = "!", _o = "{", vo = "}", yo = "ui-text__fold", bo = "ui-text__fold-toggle", xo = "ui-text__fold-content", So = 8;
function Co(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Fo(new Wo(e), 0, e.length, po.None, null, t, n), Io(t, n, po.None, null), t;
}
function wo(e) {
	return Co(e).map((e) => ko(e) ? `${e.fold} ${wo(e.text)}` : e.text).join("");
}
function To(e) {
	let t = "";
	for (let n of e) t += qo(n) ? mo + n : n;
	return t;
}
function Eo(e, t, n = {}) {
	let r = Co(t), i = r.some(ko);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ke, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && Do(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Ao(r, n));
}
function Do(e) {
	return e.styles === po.None && e.url === null && !Oo(e) && !ko(e);
}
function Oo(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function ko(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Ao(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(jo(r, t));
	return n;
}
function jo(e, t) {
	if (Oo(e)) return No(e.icon);
	let n = ko(e) ? Mo(e, t) : document.createTextNode(e.text);
	if ((e.styles & po.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & po.Strikethrough) !== 0 && (n = Po("s", n)), (e.styles & po.Underline) !== 0 && (n = Po("u", n)), (e.styles & po.Italic) !== 0 && (n = Po("em", n)), (e.styles & po.Bold) !== 0 && (n = Po("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Wa(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Mo(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${yo} ${yo}--static` : yo, r.className = bo, r.textContent = e.fold ?? "", i.className = xo, i.append(Ao(Co(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Qe, ""), n.append(r, i), n);
}
function No(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", so(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Po(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Fo(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === mo && c + 1 < n && qo(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Lo(e, c, n);
		if (l !== null) {
			Io(a, o, r, i), Ro(s, c + 1, l, o), Io(a, o, r | po.Code, i), c = l + 1;
			continue;
		}
		let u = Vo(e, c, n);
		if (u !== null) {
			Io(a, o, r, i), Fo(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Io(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = zo(e, c, n);
		if (d !== null) {
			Io(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Ho(e, c, n) : null;
		if (f !== null) {
			Io(a, o, r, i), Fo(e, f.labelStart, f.labelEnd, r, f.url, a, o), Io(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Uo(e, c, n);
		if (p !== null) {
			Io(a, o, r, i), a.push({
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
function Io(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Lo(e, t, n) {
	let r = e.text;
	if (r[t] !== ho) return null;
	let i = t + 1;
	if (i >= n || Jo(r[i])) return null;
	let a = e.findClosingMarker(i, n, ho, 1);
	return a > i ? a : null;
}
function Ro(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === mo && i + 1 < n && qo(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function zo(e, t, n) {
	let r = e.text;
	if (r[t] !== go || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Bo(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Bo(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Vo(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = po.Bold, s = 2;
	else if (i === "*") o = po.Italic, s = 1;
	else if (i === "_" && a) o = po.Underline, s = 2;
	else if (i === "~" && a) o = po.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Jo(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Ho(e, t, n) {
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
function Uo(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== _o || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > So) return null;
	let c = { value: "" };
	return Ro(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Wo = class {
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
		return this.closeBrackets ??= this.next("]", !0), Go(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Go(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Go(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Go(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Ko(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Jo(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Va(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === mo && e[t - 1] === 0);
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
			if (this.text[r] === _o) n.push(r);
			else if (this.text[r] === vo && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Jo(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Go(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Ko(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function qo(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === _o || e === vo || e === ho || e === mo;
}
function Jo(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/runtime/plural-rules.ts
function Yo(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Xo(n);
	switch (Zo(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Qo(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Qo(r, i) ? "many" : "other";
		case "ru":
		case "uk": return $o(r, i);
		case "pl": return es(r, i);
		default: return "other";
	}
}
function Xo(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Zo(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Qo(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function $o(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function es(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ts(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var ns = {
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
function rs(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return ns;
	try {
		return {
			...ns,
			...JSON.parse(t)
		};
	} catch {
		return ns;
	}
}
var is = [
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
function as(e, t, n) {
	if (t == null || t.trim().length === 0) return `${fs(e.getFullYear(), 4)}-${fs(e.getMonth() + 1, 2)}-${fs(e.getDate(), 2)} ${fs(e.getHours(), 2)}:${fs(e.getMinutes(), 2)}:${fs(e.getSeconds(), 2)}`;
	let r = "", i = os(t);
	for (let a = 0; a < t.length;) {
		let o = us(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += ds(o, e, n, i), a += o.length;
	}
	return r;
}
function os(e) {
	for (let t = 0; t < e.length;) {
		let n = us(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var ss = /^[-./:,]$/, cs = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function ls(e) {
	for (let t = 0; t < e.length;) {
		let n = us(e, t);
		if (n !== null && cs.has(n) || n === null && !ss.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function us(e, t) {
	for (let n of is) if (e.startsWith(n, t)) return n;
	return null;
}
function ds(e, t, n, r) {
	let i = t.getHours(), a = js(i);
	switch (e) {
		case "yyyy": return fs(t.getFullYear(), 4);
		case "yy": return fs(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return fs(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return fs(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return fs(i, 2);
		case "H": return String(i);
		case "hh": return fs(a, 2);
		case "h": return String(a);
		case "mm": return fs(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return fs(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function fs(e, t) {
	return String(e).padStart(t, "0");
}
var ps = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function ms(e) {
	let t = ps.exec(e.trim());
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
function hs(e) {
	return gs(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function gs(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var _s = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function vs(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = us(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += ys(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function ys(e, t) {
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
function bs(e, t, n) {
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
		let a = us(t, e);
		if (a === null) {
			if (!xs(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Ss(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? ks(i) : null;
}
function xs(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return ss.test(n) ? t.position >= e.length || !ss.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Ss(e, t, n, r) {
	switch (n) {
		case "yyyy": return Cs(t, "year", Es(e, t, 4, 4));
		case "yy": return Cs(t, "year", ws(Es(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Cs(t, "month", Ts(Ds(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Cs(t, "month", Es(e, t, 1, 2));
		case "dddd":
		case "ddd": return Ds(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Cs(t, "day", Es(e, t, 1, 2));
		case "HH":
		case "H": return Cs(t, "hour", Es(e, t, 1, 2));
		case "hh":
		case "h": return Cs(t, "hour12", Es(e, t, 1, 2));
		case "mm":
		case "m": return Cs(t, "minute", Es(e, t, 1, 2));
		case "ss":
		case "s": return Cs(t, "second", Es(e, t, 1, 2));
		case "tt": return Os(e, t, r);
		default: return !1;
	}
}
function Cs(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function ws(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ts(e) {
	return e === null ? null : e + 1;
}
function Es(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Ds(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Os(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function ks(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > gs(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var As = {
	readCulture: rs,
	format: as,
	parse: ms,
	toDate: hs
};
function js(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Ms = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Ns = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ps(e) {
	let t = e?.trim() ?? "";
	if (!Ns.test(t)) return null;
	let n = Date.parse(Ms.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Fs(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Is(e) {
	return e === "relative" || e === "relative-date";
}
var Ls = {
	...ns,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Rs(e, t, n, r) {
	if (t === "relative") return Ys(e - r, n.language);
	if (t === "relative-date") {
		let t = Bs(e, r);
		if (t !== null) return Us(n.language).format(t, "day");
	}
	let i = n.temporal ?? Ls, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ts(i, !1);
	return as(new Date(e), a, i);
}
function zs(e, t, n, r) {
	let i = Rs(e, t, n, r);
	return t === "relative-date" ? Vs(i, n.language) : i;
}
function Bs(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Js);
	return Math.abs(i) <= 1 ? i : null;
}
function Vs(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Ws(t)) + e.slice(1);
}
var Hs = /* @__PURE__ */ new Map();
function Us(e) {
	let t = Hs.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Ws(e), { numeric: "auto" }), Hs.set(e, t)), t;
}
function Ws(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Gs = 1e3, Ks = 60 * Gs, qs = 60 * Ks, Js = 24 * qs;
function Ys(e, t) {
	let n = Us(t), r = Math.abs(e);
	return r < 45 * Gs ? n.format(0, "second") : r < 45 * Ks ? n.format(Math.round(e / Ks), "minute") : r < 22 * qs ? n.format(Math.round(e / qs), "hour") : r < 26 * Js ? n.format(Math.round(e / Js), "day") : r < 320 * Js ? n.format(Math.round(e / (30.4375 * Js)), "month") : n.format(Math.round(e / (365.25 * Js)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Xs = "count";
function E(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Zs(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Qs = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function $s(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Ps(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Qs.has(t.format));
}
function ec(e) {
	if (typeof e != "object" || !e) return !1;
	if ($s(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (ec(t)) return !0;
	return !1;
}
function tc(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function nc(e, t, n) {
	return E(e) ? ac(n, e.key, e.args) : Zs(e) ? rc(n, e.text) : t && typeof e == "string" ? rc(n, e) : e;
}
function rc(e, t) {
	return t.trim().length === 0 || !ic(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function ic(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function ac(e, t, n, r = !1) {
	let i = n?.[Xs];
	return oc(typeof i == "number" ? e.lookup(`${t}.${Yo(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Zs(t) ? rc(e, t.text) : ac(e, t.key, t.args, r), e.writeMoment, r);
}
function oc(e, t, n, r = tc, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = sc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += lc(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function sc(e, t) {
	let n = t + 1;
	for (; n < e.length && cc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function cc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function lc(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? To(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (E(e)) return t === void 0 ? oc(e.key, e.args, void 0, n, r) : t(e);
	if (Zs(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? To(n) : n;
	}
	return $s(e) ? n(Ps(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var uc = `script[type='application/json'][${yt}]`;
function dc(e) {
	let t = e.querySelector(uc)?.textContent?.trim() ?? "";
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
var fc = 15e3, pc = /* @__PURE__ */ new Set(), mc = null;
function hc(e) {
	pc.add(e), mc === null && (mc = setInterval(gc, fc));
}
function gc() {
	for (let e of [...pc]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || pc.delete(e);
	}
	pc.size === 0 && mc !== null && (clearInterval(mc), mc = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var _c = 256, vc = 512, yc = "script[type='application/json'][data-ui-strings]", bc = `[${zr}*='"moment"']`, xc = class {
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
		this.tableLoaded || (this.currentTemporal = dc(e) ?? this.currentTemporal);
		let t = e.querySelector(yc)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), ac(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return ac(this, e, t, n);
	}
	writeMoment = (e, t) => (Is(t) && this.noteRelative(), Rs(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && hc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return nc(e, t, this);
	}
	resolveText(e) {
		return nc(e, !0, this);
	}
	write(e, t, n, r) {
		kc(e, t, this.translate(n, r, Oc(t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		kc(e, t, nc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (E(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Zs(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		kc(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		wc(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Ac(e, (e) => {
			for (let n of e.querySelectorAll(t ? bc : `[${zr}]`)) for (let [e, r] of Object.entries(Dc(n))) {
				if (t && !ec(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, Oc(i));
				a !== null && kc(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return nc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > vc || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && ic(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += _c) try {
			let a = await e(t, n.slice(r, r + _c));
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
function Sc(e) {
	let t = !1;
	return Ac(e, (e) => {
		t ||= e.querySelector(bc) !== null;
	}), t;
}
function Cc(e, t) {
	e.hasAttribute("data-ui-words") && wc(e, t, null);
}
function wc(e, t, n) {
	let r = Dc(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(zr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(zr, a);
}
function Tc(e) {
	return Ec(e, null);
}
function Ec(e, t) {
	let n = Dc(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function Dc(e) {
	let t = e.getAttribute(zr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Oc(e) {
	return e === Re;
}
function kc(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ac(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Ac(n.content, t);
}
var D = new xc();
function jc(e, t) {
	let n = Zs(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Mc = "row-idle";
function Nc(e) {
	let t = e.parentElement;
	t !== null && (Lc(t) ? Pc(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Lc(t.parentElement) && Pc(t.parentElement));
}
function Pc(e) {
	let t = Fc(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(Or, t);
}
function Fc(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (Ic(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && Ic(e)) return !0;
	}
	return !1;
}
function Ic(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Lc(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Rc = `.${mi}, .${hi}, [inert]`;
function zc(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var Bc = zc(Rc), Vc = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Rc) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Rc) || e.querySelector(Bc) !== null;
}
function Hc(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Vc.get(t);
	return n === void 0 && (n = zc(`[${t}]`), Vc.set(t, n)), e.querySelector(n) !== null;
}
function Uc(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Wc = `[${y}], .${gi}`;
function A(e) {
	return e.closest(Wc)?.matches(`.${gi}`) === !0;
}
function Gc(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(mi, t), Nc(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Kc = {
	isInert: O,
	isReadOnly: A,
	setDisabled: Gc
};
//#endregion
//#region src/interactions/grid-tracks.ts
function qc(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function Jc(e) {
	let t = [];
	for (let n of Zc(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Jc(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Yc(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Yc(e) {
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
	if (n !== null) return Xc({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Xc(r[3] === "fr" ? {
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
function Xc(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Zc(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Qc(e, t = "auto") {
	return e.map((e) => $c(e, t)).join(" ");
}
function $c(e, t) {
	switch (e.kind) {
		case "px": return `${el(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${el(e.min)}px`}, ${el(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${el(e.max)}px)` : `minmax(${el(e.min)}px, auto)`;
	}
}
function el(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function tl(e) {
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
function nl(e, t) {
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
function rl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = il(r, e), o = il(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function il(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var al = {
	sliver: 120,
	passFloors: !1
};
function ol(e, t, n, r, i = al) {
	let a = ll(e, t, n.before), o = ll(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = cl(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = ml(n.before, e) + ml(n.after, e), r = a.total + o.total;
		ul(d, e, a, t * (a.total + u) / r), ul(d, e, o, t * (o.total - u) / r);
	} else f || dl(d, a, a.total + u), p || dl(d, o, o.total - u);
	return i.passFloors && (sl(d, a, a.total + u), sl(d, o, o.total - u)), d;
}
function sl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function cl(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function ll(e, t, n) {
	let r = pl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function ul(e, t, n, r) {
	let i = ml(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function dl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...fl(e[i])
		};
	}
}
function fl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function pl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function ml(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function hl(e, t) {
	return Math.round(gl(e, t) * 100);
}
function gl(e, t) {
	let n = pl(t.before, e), r = n + pl(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function _l(e, t, n) {
	let r = pl(t.before, e);
	return (r + pl(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function vl(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function yl(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var bl = /* @__PURE__ */ new Set();
function xl(e, t, n, r) {
	let i = ll(e, t, n.before), a = ll(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Sl(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = ll(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Cl(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function wl(e, t, n, r = bl) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Tl(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function El(e) {
	return e == null;
}
var Dl = "data-ui-trim-input", Ol = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Ml) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Bt);
		if (t === null) return kl(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Dl) ? t.trim() : t;
	}
	readHeld(e) {
		let t = jl(e);
		return t === null ? null : this.read(t);
	}
};
function kl(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Al = "input, textarea, select";
function jl(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Al) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Al}`);
}
var Ml = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => vl(e.getAttribute(Jn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(Yn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(ai)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(oi)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(ui)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(xr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(ni)
	},
	{
		kind: "selected-keys",
		read: (e) => Nl(e, ri)
	},
	{
		kind: Vt,
		read: (e) => Nl(e, ut)
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
function Nl(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Pl(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Fl(e) {
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
		default: o = Zl(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Il(e, t, n = Gl()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Ll(e, t = Gl()) {
	let n = Vl(e.code, t);
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
function Rl(e, t = Gl()) {
	let n = zl(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function zl(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Bl[e] ?? e;
}
var Bl = {
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
function Vl(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ul[e] : void 0) ?? Hl[e] ?? e;
}
var Hl = {
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
}, Ul = {
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
}, Wl = null;
function Gl() {
	return Wl === null && (Wl = Kl()), Wl;
}
function Kl() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var ql = {
	words(e) {
		let t = Fl(e);
		return t === null ? null : Ll(t);
	},
	aria(e) {
		let t = Fl(e);
		return t === null ? null : Rl(t);
	},
	matches(e, t) {
		let n = Fl(t);
		return n !== null && Il(n, e);
	},
	isComposing: j
}, Jl = 229;
function j(e) {
	return e.isComposing || e.keyCode === Jl;
}
function M(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !j(e);
}
var Yl = class {
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
function Xl(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Zl(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Ql[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Ql[t] ?? null;
}
var Ql = {
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
}, $l = "data-ui-rename-field";
function eu(e) {
	return e instanceof Element && e.closest(`[${$l}]`) !== null;
}
function tu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute($l, ""), r.setAttribute(Qe, ""), r.value = e.value, nu(r, n, t);
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
function nu(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = ru(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = iu((r.left - i.left) / s - n.clientLeft), e.style.top = iu((r.top - i.top) / s - n.clientTop), e.style.width = iu(r.width / s), e.style.height = iu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function ru(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function iu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var au = "data-ui-runs-on-escape", ou = "ui-key-value-action__row", su = "ui-key-value-action__value-input", cu = "ui-key-value-action__edit-action";
function lu(e) {
	return j(e) || uu(e.target) !== null;
}
function uu(e) {
	return e instanceof Element ? eu(e) || du(e) ? e : e.closest("[data-ui-owns-keys]") ?? fu(e)?.cell ?? null : null;
}
function du(e) {
	return e instanceof Element && e.hasAttribute(au) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
}
function fu(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${su}, .${cu}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var pu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), mu = /* @__PURE__ */ new Set([
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
]), hu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), gu = /^F\d{1,2}$/;
function _u(e) {
	return e instanceof HTMLInputElement && pu.has(e.type);
}
function vu(e) {
	return _u(e) || e instanceof HTMLTextAreaElement;
}
function yu(e) {
	return vu(e) || e instanceof HTMLElement && e.isContentEditable;
}
function bu(e) {
	let t = e.target;
	if (!yu(t)) return !1;
	if (j(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || gu.test(n) || e.altKey ? !1 : n === "Enter" ? !_u(t) : e.ctrlKey || e.metaKey ? mu.has(n) || hu.has(e.code) : !0;
}
var xu = {
	...ql,
	isFieldKey: bu,
	isPlainKey: M,
	isEscapeClaimed: lu
}, Su = "ui-draft-dropped";
function Cu(e) {
	e.dispatchEvent(new Event(Su, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var wu = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${wi}, .ui-field-box`, Tu = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Eu = `${Tu}, ${wu}, ${Ci}, .${_e}`, Du = "button, a, summary, [role='button']";
function Ou(e) {
	let t = [];
	for (let n of e.querySelectorAll(Eu)) if (!(n.classList.contains("ui-row__grip") || !ju(e, n) || Au(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Du) ? n : null;
}
function ku(e) {
	let t = [];
	for (let n of e.querySelectorAll(Tu)) Au(e, n) && ju(e, n) && t.push(n);
	return t;
}
function Au(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function ju(e, t) {
	let n = t.closest(Ci);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Mu(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Eu);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Nu(e) {
	let t = Lu(e.key), n = Ru(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(P);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Pu(e, t) {
	return Lu(e) !== null || Ru(e, t) !== 0;
}
var Fu = {
	target: Nu,
	applyTabIndex: N
};
function N(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Iu(e, t) {
	t !== null && (N(e, t), t.focus());
}
function P(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function Lu(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ru(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function zu(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Bu(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${Gt}]`) : null;
}
function Vu(e) {
	let t = zu(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Uu(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Hu(e, t) {
	let n = zu(e);
	n.scrollTop = n === e ? t : t + Uu(e, n);
}
function Uu(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Wu(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Gu(e) {
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
function Ku(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function qu(e, t) {
	return t !== null && e.length >= t;
}
function Ju(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : qu(e, n) ? null : [...e, t];
}
function Yu(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Xu = /[,\uFF0C\r\n]/;
function Zu(e) {
	return Xu.test(e);
}
function Qu(e) {
	return e.split(Xu).map((e) => e.trim()).filter((e) => e.length > 0);
}
function $u(e) {
	let t = e.split(Xu), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function ed(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = qu(a, n) ? r : i(a, t);
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
function td(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function nd(e) {
	return td(e, Bn, `.${Nn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function rd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function id(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var ad = "data-ui-bind-selected-keys", F = `.ui-items-view, .ui-table, .${ar}`, od = `.ui-items-view__item, .${tr}, .${or}`, sd = ".ui-items-view, .ui-table", cd = {
	shift: !1,
	ctrl: !1
}, ld = /* @__PURE__ */ new WeakMap();
function ud(e, t) {
	t !== null && !ld.has(e) && dd(e, t);
}
function dd(e, t) {
	let n = L(t);
	n.length > 0 && ld.set(e, n);
}
function fd(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function pd(e, t) {
	let n = fd(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function md(e) {
	return !e.hasAttribute(gr);
}
function I(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function hd(e) {
	switch (e.getAttribute(ei)) {
		case "one": {
			let t = e.getAttribute(ni);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(wd(Td(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function gd(e, t) {
	let n = hd(e), r = e.getAttribute(ei), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(L(e));
		e.toggleAttribute(ti, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function _d(e) {
	return e.filter((e) => e.hasAttribute(ti));
}
function vd(e, t, n, r, i) {
	let a = L(n);
	if (!xd(n)) return !1;
	switch (e.getAttribute(ei)) {
		case "one": return rd(e, a, {
			attribute: ni,
			bindingAttribute: ii,
			apply: (e) => gd(e, t)
		}), !0;
		case "many": return yd(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function yd(e, t, n, r, i, a) {
	let o = Td(e);
	if (o === null) return;
	let s = wd(o), c;
	if (i.shift) {
		let o = ld.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => L(e) === o) ?? n, d = l === null ? Cd(t, u, n).map(L) : Sd(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], ld.set(e, r)) : (c = [r], ld.set(e, r));
	bd(e, t, c);
}
function bd(e, t, n) {
	let r = Td(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(ri, i), gd(e, t), r.hasAttribute(ad) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function xd(e) {
	return L(e).length > 0 && !Hc(e, "data-ui-unselectable") && !k(e);
}
function Sd(e, t) {
	let n = new Map(t.map((e) => [L(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || I(t) !== null && xd(t);
	});
}
function Cd(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => I(e) !== null && xd(e));
}
function wd(e) {
	return Gu(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Td(e) {
	let t = e.closest(C);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(F) === e && n.closest(C) === t) return n;
	return null;
}
function L(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Ed = {
	isSelected: (e) => e.hasAttribute(ti),
	toggle: Dd,
	setSelected: Od,
	setSelectedKeys: kd
};
function Dd(e) {
	let t = e.closest(F);
	t !== null && e instanceof HTMLElement && vd(t, Ad(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Od(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(L(e));
	kd(e, r, n);
}
function kd(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Ad(e), i = new Set(r.filter((e) => !xd(e)).map(L)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...hd(e)].filter((e) => !a.has(e));
	bd(e, r, n ? [...o, ...a] : o);
}
function Ad(e) {
	return td(e, od, F);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var jd = "--ui-table-order-";
function Md(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Nd = "ui-table", Pd = `[${Zn}]:not(.${ir})`, Fd = `.${tr} > [aria-colspan]:not([${Zn}])`;
function Id(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Ld(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Pd}${o}, ${Fd}${o}`)) {
		if (t.closest(`.${Nd}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Ld(t, "aria-colindex", "1"), Ld(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Zn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Ld(t, "aria-colindex", n);
	}
}
function Ld(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var Rd = ".ui-table[role='grid']", zd = "gridcell", Bd = "aria-colspan", Vd = /* @__PURE__ */ new WeakMap();
function Hd(e) {
	let t = e.closest(F);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(od);
	return n !== null && n.closest(F) === t ? {
		root: t,
		row: n
	} : null;
}
function Ud(e) {
	return e.target instanceof Element && !bu(e) ? Wd(e.target) : null;
}
function Wd(e) {
	let t = Hd(e);
	if (t === null || t.row !== null && Mu(e, t.row) !== null) return null;
	let n = e.closest(`[${Si}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Gd(e) {
	return e.filter(Kd);
}
function Kd(e) {
	return I(e) !== null && !k(e);
}
function qd(e) {
	return Jd(e) ?? Gd(e)[0] ?? null;
}
function Jd(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function Yd(e) {
	return Jd(Ad(e));
}
function Xd(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = qd(t);
	n !== null && Qd(e, t, n);
}
function Zd(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Ui(t, "ui-row-name"));
}
function Qd(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = $d(e, n, r);
	i && ((I(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && of(e, n, a));
}
function $d(e, t, n) {
	let r = ef(e) ? tf(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(F) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", Ui(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(Zn);
	return i !== null && Vd.set(e, i), e.setAttribute("aria-activedescendant", Ui(r, "ui-cell")), r;
}
function ef(e) {
	return e.matches(Rd);
}
function tf(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === zd) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = nf(t, n.getAttribute(Zn));
		if (e !== null) return e;
	}
	let r = rf(e, t), i = Vd.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Zn) === i);
	if (a !== void 0) return a;
	let o = Md(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Zn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function nf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && af(n)) return n;
	return null;
}
function rf(e, t) {
	let n = Md(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && af(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function af(e) {
	return e.getAttribute("role") === zd && !e.hasAttribute("data-ui-owns-keys");
}
function of(e, t, n) {
	let r = e.querySelector(`:scope > .${nr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += sf(c.left, c.right, o, s);
}
function sf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function cf(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function lf(e) {
	return Vd.get(e) ?? null;
}
function uf(e, t, n, r) {
	if (n !== null && pf(n)) return null;
	let i = rf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Zn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function df(e, t, n, r) {
	let i = ff(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? tf(e, t, null) : i[a];
}
function ff(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && pf(e));
}
function pf(e) {
	return af(e) && e.hasAttribute(Bd) && !e.hasAttribute("data-ui-table-column");
}
function mf(e) {
	let t = ff(e);
	return t[t.length - 1] ?? null;
}
function hf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === zd ? n : null;
}
function gf(e, t = null) {
	let n = e.closest(F);
	n !== null && e instanceof HTMLElement && Qd(n, Ad(n), e, t);
}
function _f(e, t) {
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
function vf(e, t) {
	return Pu(e, t === "grid" ? "both" : t) || t !== "horizontal" && yf(e);
}
function yf(e) {
	return e === "PageDown" || e === "PageUp";
}
function bf(e, t, n, r) {
	if (!vf(e, r)) return null;
	let i = Gd(t);
	if (yf(e)) return xf(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Sf(i, n, e === "ArrowDown");
	let a = i.map((e) => I(e) ?? e), o = Nu({
		key: e,
		items: a,
		current: n === null ? null : I(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function xf(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (I(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Vu(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (I(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Sf(e, t, n) {
	let r = t === null ? null : I(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Cf(i), o = e.map((e) => ({
		row: e,
		rect: (I(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Cf(t.rect) - a) < Math.abs(Cf(e.rect) - a) ? t : e).row;
}
function Cf(e) {
	return e.left + e.width / 2;
}
var wf = "ui-row-press";
function Tf(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Ef(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && Df(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = Of(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : Qd(e, a, t, null, s);
	};
}
function Df(e) {
	let t = I(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = zu(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function Of(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (Kd(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (Kd(e[n])) return e[n];
	return null;
}
function kf(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || I(n) !== null) return;
	let r = Of(t, t.indexOf(n));
	if (r !== null) {
		Qd(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(Ne), cf(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant");
}
function Af(e) {
	let t = e.parentElement, n = t?.closest(F) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function jf(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function Mf(e, t, n) {
	let r = Af(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant");
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Ff(r, t);
	}
}
function Nf(e, t) {
	let n = Af(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Ff(n, t));
}
function Pf(e) {
	return e.getAttribute(Pe);
}
function Ff(e, t) {
	t.setAttribute(Ne, ""), $d(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var If = "data-ui-active", Lf = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Rf = /* @__PURE__ */ new Set([
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
]), zf = !1, Bf = !1, Vf = null, Hf = /* @__PURE__ */ new Set(), Uf = [], Wf = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Gf(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Kf(e), !0), window.addEventListener("focus", (e) => Jf(e.target), !0), window.addEventListener("focusin", (e) => Jf(e.target), !0), window.addEventListener("focusout", (e) => Yf(e), !0), window.addEventListener("keydown", (e) => qf(e)));
function Gf(e, t = "") {
	zf = !0, Bf = t === "touch";
	let n = document.activeElement;
	Vf = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && ep(n, !Xf(n)), tp(n);
}
function Kf(e) {
	if (!(e instanceof KeyboardEvent && Rf.has(e.key))) {
		zf = !1;
		for (let e of [...Hf]) ep(e, !1);
		tp(document.activeElement);
	}
}
function qf(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !M(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !Xf(t) && ep(t, !0);
}
function Jf(e) {
	zf && !Xf(e) && ep(e, !0), e === document.activeElement && tp(document.activeElement);
}
function Yf(e) {
	e.target instanceof Element && e.target.hasAttribute(If) || ep(e.target, !1), e.relatedTarget === null && queueMicrotask(() => tp(document.activeElement));
}
function Xf(e) {
	return vu(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Zf() {
	return zf && Vf instanceof HTMLElement && Vf !== document.body ? Vf : null;
}
function Qf() {
	return zf;
}
function $f() {
	return zf && Bf;
}
function ep(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Hf) e.isConnected || Hf.delete(e);
			Hf.add(e);
		} else Hf.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Xr, t), e === document.activeElement && tp(e);
	}
}
function tp(e) {
	let t = e === null || e === document.body || Xf(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : np(e);
	for (let e of Uf) n.includes(e) || e.removeAttribute(Zr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(Zr, t);
	Uf = n;
}
function np(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !rp(n))); n = n.parentElement);
	return t;
}
function rp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(wu) ?? null) !== null;
}
function R(e) {
	Jf(e), ip(e);
}
function ip(e) {
	tp(e), e.focus({ preventScroll: !0 }), tp(document.activeElement);
}
function ap(e) {
	ep(e, !0), ip(e);
}
function op(e) {
	for (let t of e.querySelectorAll(Lf)) if (Uc(t)) return t;
	return null;
}
var sp = {
	first: op,
	stops: (e) => cp(e, document.activeElement),
	giveBack: (e) => gp(e),
	trapTab: dp
};
function cp(e, t) {
	let n = [...e.querySelectorAll(Lf)].filter((e) => e === t || e.tabIndex >= 0 && Uc(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = lp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !up(n) && up(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = lp(e);
		return t === null || r.get(t) === e;
	});
}
function lp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function up(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function dp(e, t) {
	let n = cp(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = fp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function fp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && pp(n, a) ? i : r && pp(n, i) ? a : null;
}
function pp(e, t) {
	return e === t || lp(e) !== null && lp(e) === lp(t);
}
var mp = `.${vi}, .${yi}, [${xi}]`;
function hp(e) {
	let t = Hd(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(mp)) && n.hasAttribute("tabindex") && Uc(n)) return n;
	return null;
}
function gp(e, t = hp(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Hd(e);
	r?.root === t && r.row !== null && Qd(t, Ad(t), r.row, hf(r.row, e)), R(t);
}
function _p(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? op(e);
	return vp(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), R(r ?? e), n;
}
function vp(e) {
	zf ? Wf.add(e) : Wf.delete(e);
}
function yp(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? op(e);
	return n !== null && bp(e, n), _p(e, n);
}
function bp(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function xp(e, t, n = !1) {
	if (vp(e), zf) {
		N(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), R(e);
		return;
	}
	let r = t.filter(P), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (N(t, i), R(i));
}
function Sp(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Cp(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Lf}, [tabindex]`) && Uc(e)) return e;
	return n === null ? null : wp(n);
}
function Cp(e, t) {
	if (t === null) return null;
	for (let n = e.closest(C); n !== null; n = n.parentElement?.closest(C) ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function wp(e) {
	for (let t = e.closest(C); t !== null; t = t.parentElement?.closest(C) ?? null) if (Uc(t)) return Tp(t), t;
	return null;
}
function Tp(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Ep(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Dp(n, t) && ep(e, !Xf(e)), R(e));
}
function Dp(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Wf.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Op = "data-ui-clear", kp = ["change", "toggle"], Ap = [
	...kp,
	"expand",
	"collapse",
	"open",
	"close"
];
function jp(e) {
	let t = Yi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Mp(e) {
	return Yi(e) === "OnSubmit";
}
function Np(e, t) {
	let n = e.getAttribute(Xe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Mp(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && jp(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Mp(i.mode)
		};
	}
	return null;
}
var Pp = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of kp) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Su, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Op}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Np(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Op}]`);
		if (t === null) return;
		let n = t.closest(C), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Fp(r) || (Pl(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), vu(r) && document.activeElement !== r && R(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = Np(e.target, this.options.metadata);
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
			let r = Np(n, this.options.metadata);
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
		if (i === void 0 || !jp(i.mode) || Mp(i.mode)) return;
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
function Fp(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Ip(e, t) {
	let n = e.closest(`[${Qe}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Lp = class {
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
}, Rp = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = ha(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = ha(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(ha(e));
	}
	isAttached(e) {
		return this.attachments.has(ha(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(ha(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, zp = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Bp = {
	dispatched: !1,
	success: !1
}, Vp = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Hp = class {
	options;
	root;
	registry;
	requestFactory = new zp();
	turns = new Lp();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Rp(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Wp(t, r.element) || Ip(t.target, r.element)) return;
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
			let t = e instanceof Vp, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return Bp;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Bp;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Gp(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Bp;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Bp;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Vp(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ap.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		Up(e.preventDefault, t) && t.domEvent.preventDefault(), Up(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Up(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Wp(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Gp(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Kp(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && qp(e, t) : Jp(e, t);
}
function qp(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Kp(e[n], t[n])) return !1;
	return !0;
}
function Jp(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Kp(e[n], t[n]) : !Yp(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !Yp(t[n])) return !1;
	return !0;
}
function Yp(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function Xp() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function Zp(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (Qp(e)) return $p(e, () => Zp(e)), null;
	let n = e;
	for (; n.parentElement !== null && !Qp(n.parentElement);) n = n.parentElement;
	let r = nm(n) ?? rm(n) ?? im();
	return r !== null && R(r), r;
}
function Qp(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function $p(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => em(t) && tm(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function em(e) {
	return e.transitionProperty === "visibility";
}
function tm(e) {
	return e.effect?.target ?? null;
}
function nm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Lf) ?? null;
	return t !== null && Qp(t) ? t : null;
}
function rm(e) {
	let t = cp(e.closest(mp) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function im() {
	let e = document.querySelector(`[${jn}="content"]`);
	return e === null ? null : (Tp(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var am = class {
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
		for (let e of kp) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = cm(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Kp(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Np(e, this.options.metadata), r;
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
			for (let e of t.interactions) Zi(e.actionKind) === "CopyValue" && lm(e.target) && this.writeTarget(e.target, t.dynamicParameters, om(e, n), !0);
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
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? cm(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Zi(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!lm(a)) return;
		let o = i === "CopyValue" ? om(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = Xp();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && Zp(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: sm(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function om(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function sm(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Ca(s, o)) return a === 0 ? e : {
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
function cm(e, t) {
	return JSON.stringify([w(e?.componentId), e?.propertyId ?? ""]) + aa(t);
}
function lm(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var um = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return dm(t, e.operator, e.value);
	}
};
function dm(e, t, n) {
	let r = fm(e), i = fm(n);
	switch (Qi(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return pm(r, i, (e) => e > 0);
		case "GreaterOrEqual": return pm(r, i, (e) => e >= 0);
		case "Less": return pm(r, i, (e) => e < 0);
		case "LessOrEqual": return pm(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return hm(r, i);
		case "RegexEach": return mm(r, i);
		default: return !1;
	}
}
function fm(e) {
	return E(e) ? e.key : Zs(e) ? e.text : e;
}
function pm(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function mm(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => hm(fm(e), t)) : hm(e, t);
}
function hm(e, t) {
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
var gm = "Value", _m = "EndValue", vm = "Pressed", ym = class {
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
		return this.eventNames.has(ha(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Sm(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ha(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Cm(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(wm(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (bm(e)) {
			let t = w(e.sourceEvent?.componentId), n = ha(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Cm(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Cm(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (xm(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(wm(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(wm(t, n), r)), r.push(e), Zi(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === gm || i === vm ? this.valueInteractions : i === _m ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function bm(e) {
	return Xi(e.sourceKind) === "Event";
}
function xm(e) {
	return Xi(e.sourceKind) === "Property";
}
function Sm(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Cm(e, t) {
	return `${e}:${ha(t)}`;
}
function wm(e, t) {
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
function Tm() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Em(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Dm(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Om = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], km = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Am(e) {
	return `(min-width: ${km[e]}px)`;
}
var jm = Am("sm");
function Mm(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Am(t))) return t;
	return "base";
}
function Nm(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Pm(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Fm(e, t) {
	return Im(t, (t) => Pm(e, t));
}
function Im(e, t) {
	for (let n = Om.indexOf(e); n >= 0; n--) {
		let e = t(Om[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Lm = /* @__PURE__ */ new Set([
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
function Rm(e) {
	return Lm.has(e);
}
var zm = 4, Bm = 12, Vm = /* @__PURE__ */ new Map(), Hm = !1, Um = null, Wm = /* @__PURE__ */ new WeakMap(), Gm = "data-ui-popup-stood-in";
function Km(e, t) {
	t === null ? Wm.delete(e) : Wm.set(e, t);
}
var qm = "--ui-popup-ground";
function Jm(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(qm).trim() : "";
	n.length === 0 ? t.style.removeProperty(qm) : t.style.setProperty(qm, n);
}
function Ym(e, t, n) {
	Vm.set(t, {
		anchor: e,
		options: n
	}), ch(), Um?.observe(t), th(e, t), uh(e, t, n);
}
var Xm = "data-ui-popup-lifted", Zm = "data-ui-sheet";
function Qm() {
	return typeof matchMedia == "function" && !matchMedia(jm).matches;
}
function $m(e) {
	return e.hasAttribute(Zm);
}
function eh(e) {
	if (e.hasAttribute(Xm)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(Xm, ""), nh(e);
}
function th(e, t) {
	(t.hasAttribute(Xm) || rh(t) || e.closest(`[${Xm}]`) !== null) && eh(t);
}
function nh(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function rh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var ih = z.normal * 5;
function ah(e, t) {
	e.hasAttribute(Xm) && (e.matches(":popover-open") && e.hidePopover(), Dm(e, ih, () => {
		e.matches(":popover-open") || Vm.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Xm), t?.());
	}));
}
function oh(e) {
	let t = Vm.get(e);
	t !== void 0 && uh(t.anchor, e, t.options);
}
function sh(e) {
	e != null && (Vm.delete(e), Um?.unobserve(e), ah(e));
}
function ch() {
	Hm || (Hm = !0, document.addEventListener("scroll", (e) => lh(e.target), !0), window.addEventListener("resize", () => lh(null)), window.visualViewport?.addEventListener("resize", () => lh(null)), window.visualViewport?.addEventListener("scroll", () => lh(null)), Um = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Vm.get(t.target);
			e !== void 0 && uh(e.anchor, t.target, e.options, !0);
		}
	}));
}
function lh(e) {
	for (let [t, n] of Vm) {
		if (!t.isConnected) {
			sh(t);
			continue;
		}
		e instanceof Node && t.contains(e) || uh(n.anchor, t, n.options);
	}
}
function uh(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = mh(e), a = i !== e;
	t.hasAttribute(Gm) !== a && t.toggleAttribute(Gm, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(dh) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	ph(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = _h(n.boundary), p = Vm.get(t), m = r ? p?.side : void 0, h = m !== void 0 && yh(l, d, m, u, f) ? m : vh(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), yh(l, d, h, u, f) || (fh(t, h, Ch(l, h, f) - u - zm), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? Dh(t, h) : Eh, _ = kh(l, c, d, h, u, g), v = Ah(l, c, d, h, u, g);
	n.arrow === !0 && (Sh(h) ? v = hh(v, c.left + c.width / 2, d.width) : _ = hh(_, c.top + c.height / 2, d.height));
	let ee = Mh();
	_ = ee.top + Ih(_ - ee.top, d.height, ee.bottom - ee.top), v = Ih(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), gh(t, c, d, h, _, v);
}
var dh = "data-ui-popup-capped";
function fh(e, t, n) {
	let r = Sh(t);
	e.setAttribute(dh, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function ph(e) {
	if (e.hasAttribute(dh)) {
		e.removeAttribute(dh);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function mh(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Gm)) return e;
		let n = Wm.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function hh(e, t, n) {
	let r = t - e;
	return r < Bm ? e - (Bm - r) : r > n - Bm ? e + (r - (n - Bm)) : e;
}
function gh(e, t, n, r, i, a) {
	let o = Sh(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Bm, Math.min(s, c - Bm))}px`);
}
function _h(e) {
	let t = Mh(), n = {
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
function vh(e, t, n, r, i) {
	let a = wh(n);
	if (yh(e, t, n, r, i)) return n;
	if (yh(e, t, a, r, i)) return a;
	for (let a of bh(n)) if (yh(e, t, a, r, i)) return a;
	return Ch(e, a, i) > Ch(e, n, i) ? a : n;
}
function yh(e, t, n, r, i) {
	return Ch(e, n, i) >= xh(t, n) + r;
}
function bh(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function xh(e, t) {
	return Sh(t) ? e.height : e.width;
}
function Sh(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Ch(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function wh(e) {
	return e.startsWith("top") ? `bottom${Th(e)}` : e.startsWith("bottom") ? `top${Th(e)}` : e.startsWith("left") ? `right${Th(e)}` : `left${Th(e)}`;
}
function Th(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Eh = {
	start: 0,
	end: 0
};
function Dh(e, t) {
	let n = getComputedStyle(e);
	return Sh(t) ? {
		start: Oh(n.paddingLeft) + Oh(n.borderLeftWidth),
		end: Oh(n.paddingRight) + Oh(n.borderRightWidth)
	} : {
		start: Oh(n.paddingTop) + Oh(n.borderTopWidth),
		end: Oh(n.paddingBottom) + Oh(n.borderBottomWidth)
	};
}
function Oh(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function kh(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : jh(t.top, t.height, n.height, r, a);
}
function Ah(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : jh(t.left, t.width, n.width, r, a);
}
function jh(e, t, n, r, i) {
	let a = Th(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Mh() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Nh(r))
	};
}
function Nh(e) {
	let t = document.querySelector(`[${On}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Ph(e, t, n) {
	if ($m(e)) return;
	let r = e.getBoundingClientRect(), i = Mh();
	e.style.left = `${Fh(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Fh(n, r.height, i.top, i.bottom)}px`;
}
function Fh(e, t, n, r) {
	return e + t <= r - zm ? e : e - t >= n + zm ? e - t : n + Ih(e - n, t, r - n);
}
function Ih(e, t, n) {
	return Math.max(zm, Math.min(e, n - t - zm));
}
//#endregion
//#region src/interactions/press-wave.ts
var Lh = "ui-press-wave", Rh = "ui-press-wave__ink";
function zh(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!Bh(t)) return !1;
	for (let t of e.removedNodes) if (!Bh(t)) return !1;
	return !0;
}
function Bh(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function Vh(e) {
	return e.length > 0 && e.every(zh);
}
function Hh(e) {
	for (let t of e.querySelectorAll(`.${Lh}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Uh = 32;
function B(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Wh(e, i.filter((e) => !zh(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function Wh(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			Gh(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) {
			i.add(s);
			continue;
		}
		for (let e of t.querySelectorAll(n)) i.add(e);
		if (i.size > Uh) return new Set(e.querySelectorAll(n));
	}
	return i.size === 0 ? null : i;
}
function Gh(e, t, n) {
	for (let r of e) if (!(!(r instanceof Element) || !r.isConnected)) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function Kh(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var qh = "data-ui-dialog", Jh = "data-ui-dialog-modal", Yh = "data-ui-dialog-backdrop", Xh = "data-ui-dialog-close-backdrop", Zh = "data-ui-dialog-close-escape", Qh = `[${qh}]:not([hidden]), dialog[open]`, $h = "dialog:modal";
function eg(e) {
	let t = e.querySelectorAll(`[${qh}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function tg(e) {
	let t = e.querySelectorAll($h);
	if (t.length > 0) return t[t.length - 1];
	let n = eg(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function ng(e) {
	let t = typeof document > "u" ? null : tg(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var rg = /* @__PURE__ */ new Set(), ig = null;
function ag(e) {
	ig = e;
}
function og(e) {
	let t = e.composedPath(), n = ig?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var sg = /* @__PURE__ */ new Map(), cg = 0, lg = !1;
function ug() {
	lg || (lg = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || pg(uu(e.target)) && e.preventDefault();
	}, !0));
}
function dg() {
	for (let e of rg) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function fg(e) {
	for (let t of rg) t.hearRefusedClick(e);
}
function pg(e) {
	let t = [];
	for (let e of rg) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...sg.keys()]) n.has(e) || sg.delete(e);
	for (let { popup: e } of t) sg.has(e) || sg.set(e, ++cg);
	let r = mg(t, (e) => sg.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function mg(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var hg = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), rg.add(this), ug();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = og(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = og(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = og(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? ng(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, gg = /\p{M}/gu, _g = ".ui-text__title";
function vg(e, t) {
	return yg(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function yg(e, t) {
	return Sg(e, xg(t));
}
function bg(e, t) {
	return t.every((t) => e.includes(t));
}
function xg(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Sg(e, t) {
	let n = e.normalize("NFD").replace(gg, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Cg(e) {
	return e.querySelector(_g)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var wg = class {
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
		t.setAttribute(Gr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Tg(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Gr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Gr);
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
function Tg(e, t, n, r) {
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
function Eg() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function Dg(e, t) {
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
		Eg();
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
var Og = "data-ui-sheet-dragging", kg = "--ui-sheet-drag", Ag = 24, jg = 1 / 3;
function Mg(e, t, n) {
	return e > t * jg || n > .5 && e > 6;
}
function Ng(e, t, n) {
	e.style.removeProperty(kg), e.removeAttribute(Og);
	let r = Dg(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= Ag),
		start: (t) => {
			e.setAttribute(Og, ""), Pg(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(kg, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(Og), i && Mg(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(kg, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(Og);
	};
}
function Pg(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Fg = "data-ui-sheet-covered", Ig = "ui-sheet-scrim", Lg = "data-ui-sheet-scrim-leaving", Rg = 400, zg = "ui-sheet__back", Bg = "ui.sheet.back", Vg = "ne-arrow-back", Hg = [], Ug = null, Wg = !1, Gg = !1;
function Kg(e, t) {
	if (qg(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : qg(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = $m(e);
	e.setAttribute(Zm, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Em(e));
	let a = null;
	e.querySelector(`:scope > .${zg}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Fg, ""), a = Jg(t), e.prepend(a)), Xg(), eh(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Ng(e, e, () => Zg(e))
	};
	Hg.push(o), Qg(), queueMicrotask(() => e_(o));
}
function qg(e) {
	return Hg.find((t) => t.popup === e) ?? null;
}
function Jg(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Cg(e.anchor).trim();
	return t.type = "button", t.className = zg, t.tabIndex = -1, t.textContent = n, t.prepend(Yg()), D.write(t, "aria-label", Bg, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Yg() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), so(e, Vg), e;
}
function Xg() {
	Ug === null && (Ug = document.createElement("div"), Ug.className = Ig, Ug.setAttribute("aria-hidden", "true"), Ug.addEventListener("mousedown", (e) => e.preventDefault())), Ug.parentElement === null && document.body.appendChild(Ug), Ug.removeAttribute(Lg), eh(Ug);
}
function Zg(e) {
	for (let t = qg(e); t !== null; t = t.parent) t.opening.close();
}
function Qg() {
	Wg || (Wg = !0, window.addEventListener("pointerdown", () => {
		Gg = !0;
	}, !0), window.addEventListener("pointerup", $g, !0), window.addEventListener("pointercancel", $g, !0), window.addEventListener("keydown", (e) => {
		let t = Hg.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && dp(t.popup, e);
	}, !0), matchMedia(jm).addEventListener("change", () => {
		for (let e of Hg.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function $g() {
	if (Gg = !1, Ug?.hasAttribute(Lg) !== !0) return;
	let e = () => {
		Ug?.hasAttribute(Lg) === !0 && Hg.length === 0 && (Ug.removeAttribute(Lg), Ug.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Rg);
}
function e_(e) {
	if (!Hg.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), R(t)), e.hidden = t_(t);
}
function t_(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Ug || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function n_(e) {
	let t = qg(e);
	if (t !== null) {
		for (let e of [...Hg].reverse()) if (e === t || r_(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function r_(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function i_(e) {
	let t = qg(e);
	if (t !== null) {
		for (let e of Hg.filter((e) => e.parent === t)) e.opening.close(), i_(e.popup);
		n_(e), Hg.splice(Hg.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Fg), Hg.length === 0 && a_(), ah(e, () => {
			qg(e) === null && (e.removeAttribute(Zm), e.removeAttribute(Fg), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function a_() {
	Ug?.matches(":popover-open") === !0 && (Gg ? Ug.setAttribute(Lg, "") : Ug.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function o_(e, t) {
	return e.isConnected && !O(e) && !(t && A(e));
}
var s_ = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new hg({
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
			isBehind: (e) => ng(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && l_(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && h_(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || Qf() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		d_(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, m_(t)) && !ng(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!d_(e)) return;
		let t = hp(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && o_(n.owner, this.closesWhenReadOnly) && !ng(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !o_(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), g_(e, !0), E_(this), x_(e), e.focus !== void 0 && e.focus !== !1 && _p(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if ($m(e.popup) || h_(this.options.sheetOnPhone, e) && Qm()) {
			Kg(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !h_(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && Ym(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), S_(r.popup), n_(r.popup), r.popup.contains(document.activeElement) && Ep(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), g_(r, !1), $m(r.popup) ? i_(r.popup) : sh(r.popup), this.entries.size === 0 && D_(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (o_(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !f_() && p_(e);
		}
	}
}, c_ = /* @__PURE__ */ new Set();
function l_(e) {
	c_.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !j(e) && e.target instanceof Node && u_(e.target);
	}, !0), c_.add(e);
}
function u_(e) {
	let t = [...c_].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of mg(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function d_(e) {
	return e instanceof Element && e.isConnected && Uc(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function f_() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Uc(e);
}
function p_(e) {
	Tp(e), R(e);
}
function m_(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function h_(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function g_(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var __ = /* @__PURE__ */ new Map(), v_ = /* @__PURE__ */ new Set(), y_ = /* @__PURE__ */ new WeakSet(), b_ = [];
function x_(e) {
	let { popup: t } = e;
	__.set(t, e.owner), !y_.has(t) && (y_.add(t), t.addEventListener("pointerenter", () => {
		__.has(t) && (v_.add(t), C_());
	}), t.addEventListener("pointerleave", () => {
		v_.delete(t) && C_();
	}));
}
function S_(e) {
	__.delete(e), v_.delete(e) && C_();
}
function C_() {
	let e = /* @__PURE__ */ new Set();
	for (let t of v_) {
		let n = __.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of b_) e.has(t) || t.removeAttribute(Qr);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(Qr, "");
	b_ = [...e];
}
var w_ = /* @__PURE__ */ new Set(), T_ = null;
function E_(e) {
	w_.add(e), T_ === null && typeof MutationObserver == "function" && (T_ = new MutationObserver(() => {
		for (let e of [...w_]) e.closeStranded();
	}), T_.observe(document, {
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
function D_(e) {
	w_.delete(e), !(w_.size > 0 || T_ === null) && (T_.disconnect(), T_ = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var O_ = "ui-flyout", k_ = "ui-flyout--open", A_ = "ui-flyout__anchor", j_ = "data-ui-flyout-no-backdrop-close", M_ = "data-ui-flyout-no-escape-close", N_ = `${O_}--`, P_ = "bottom-start", F_ = class {
	root;
	flyouts = new s_({
		show: ({ owner: e }) => e.classList.add(k_),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? M_ : j_)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${O_}`)) this.place(e);
		B(this.root, `.${O_}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${yi}`), n = e.querySelector(`:scope > .${A_}`);
		if (t === null) return;
		let r = I_(n, t);
		if (!e.classList.contains(k_)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: R_(n) ?? e,
			placement: { placement: z_(e) },
			openers: r === null ? [] : [r],
			focus: !Qf() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(k_) && (e.classList.remove(k_), L_(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${A_}`)?.closest(`.${O_}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(k_), this.place(t), this.flyouts.isOpen(t) && L_(t, !0);
		}
	}
};
function I_(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Lf) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Ui(t, "ui-flyout-content")), n;
}
function L_(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function R_(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function z_(e) {
	for (let t of e.classList) {
		if (!t.startsWith(N_)) continue;
		let e = t.slice(N_.length);
		if (Rm(e)) return e;
	}
	return P_;
}
//#endregion
//#region src/interactions/drag-picture.ts
var B_ = "ui-drag-picture", V_ = "data-ui-drag-part", H_ = ["::before", "::after"], U_ = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", W_ = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), G_ = null, K_ = null;
typeof Image == "function" && J_();
function q_(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = J_();
	if (K_?.(), o === null || typeof n.showPopover != "function") {
		t.setDragImage(n, i, a);
		return;
	}
	t.setDragImage(o, 0, 0), Y_(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && K_?.();
	}, 0);
}
function J_() {
	return G_ === null && typeof Image == "function" && (G_ = new Image(1, 1), G_.src = U_), G_;
}
function Y_(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = B_, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, Z_(e, a, o);
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
	let s = (e) => X_(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), K_ === u && (K_ = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), K_ = u, X_(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function X_(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function Z_(e, t, n) {
	let r = t.style;
	r !== void 0 && (tv(getComputedStyle(e), (e, t) => r.setProperty(e, t)), Q_(e, r, "columns"), Q_(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !W_.has(e.toLowerCase()) && t.removeAttribute(e);
	ev(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : Z_(i, a, n);
	}
}
function Q_(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, $_(e, n).join(" "));
}
function $_(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = $_(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function ev(e, t, n) {
	for (let r of H_) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(V_) || t.setAttribute(V_, String(n.length));
		let a = [];
		tv(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${B_} [${V_}="${t.getAttribute(V_)}"]${r} { ${a.join(" ")} }`);
	}
}
function tv(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var nv = `:scope > :is(${wu}, .ui-image-input__surface)`;
function rv(e, t, n, r, i, a = [], o = "move") {
	iv(t, r), av(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function iv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function av(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && q_(e, e.dataTransfer, e.target));
}
function ov(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function sv(e, t) {
	let n = t && e.querySelector(nv) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var cv = "data-ui-file-drop-over", lv = 120, uv = "refused", dv = !1;
function fv(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	gv();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => pv(e, t, n), !0);
	e.root.addEventListener("dragend", () => Sv(t.marked), !0), window.addEventListener("blur", () => Sv(t.marked)), e.root.addEventListener("paste", (t) => mv(e, t), !0);
}
function pv(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Sv(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		_v(n), n.type !== "dragleave" && Sv(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || xv(r, a) : t.leaving = window.setTimeout(() => Sv(r), lv);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = vv(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && xv(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : cv;
		r.set(a, o), a.setAttribute(o, t ? uv : ""), sv(a, o === cv);
		return;
	}
	Sv(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Cv(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function mv(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Cv(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function hv(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Fr}="${Bi(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function gv() {
	if (!dv) {
		dv = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && _v(e);
		});
	}
}
function _v(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function vv(e, t) {
	let n = yv(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => bv(t, e)));
}
function yv(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function bv(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function xv(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), sv(t, !1);
}
function Sv(e) {
	for (let t of [...e.keys()]) xv(e, t);
}
function Cv(e, t) {
	let n = yv(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : bv(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var wv = "ne-picture-as-pdf", Tv = "ne-text-snippet", Ev = "ne-description", Dv = "ne-table-chart", Ov = "ne-slideshow", kv = "ne-folder-zip", Av = "ne-audio-file", jv = "ne-video-file", Mv = "ne-image", Nv = "ne-code", Pv = "ne-draft", Fv = new Map([
	...zv(wv, "pdf"),
	...zv(Tv, "txt", "md", "log"),
	...zv(Ev, "doc", "docx", "odt", "rtf"),
	...zv(Dv, "xls", "xlsx", "ods", "csv", "tsv"),
	...zv(Ov, "ppt", "pptx", "odp", "key"),
	...zv(kv, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...zv(Av, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...zv(jv, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...zv(Mv, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...zv(Nv, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Iv = /* @__PURE__ */ new Map([
	["application/pdf", wv],
	["text/csv", Dv],
	["application/msword", Ev],
	["application/rtf", Ev],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Ev],
	["application/vnd.oasis.opendocument.text", Ev],
	["application/vnd.ms-excel", Dv],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Dv],
	["application/vnd.oasis.opendocument.spreadsheet", Dv],
	["application/vnd.ms-powerpoint", Ov],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Ov],
	["application/vnd.oasis.opendocument.presentation", Ov],
	["application/zip", kv],
	["application/x-zip-compressed", kv],
	["application/x-7z-compressed", kv],
	["application/vnd.rar", kv],
	["application/x-rar-compressed", kv],
	["application/x-tar", kv],
	["application/gzip", kv],
	["application/json", Nv],
	["application/xml", Nv],
	["text/xml", Nv],
	["text/html", Nv]
]), Lv = /* @__PURE__ */ new Map([
	["image", Mv],
	["audio", Av],
	["video", jv],
	["text", Tv]
]);
function Rv(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Fv.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Iv.get(i) ?? (a < 0 ? void 0 : Lv.get(i.slice(0, a))) ?? Pv;
}
function zv(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var Bv = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function Vv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(wt), e.setAttribute("title", t.name), e.setAttribute(Ot, t.name), Hv(e, kt, t.type.length > 0 ? t.type : null), Hv(e, At, t.size === null ? null : String(t.size)), r.className = Tt, r.setAttribute("aria-hidden", "true"), i.className = Et, i.textContent = t.name, a.className = Dt, Wv(e, r, a, n), [
		r,
		i,
		a
	];
}
function Hv(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Uv(e, t) {
	let n = e.querySelector(`:scope > .${Tt}`), r = e.querySelector(`:scope > .${Dt}`);
	n !== null && r !== null && Wv(e, n, r, t);
}
function Wv(e, t, n, r) {
	let i = e.getAttribute(jt), a = i !== null && uo(i).length > 0 ? i : Rv(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(uo(a)) || i !== null) && so(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? Gv(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function Gv(e, t) {
	let n = e, r = "byte";
	for (let e of Bv) {
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
var Kv = "SessionKey", qv = "/_ne/session/key", Jv = 1e4, Yv = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = Zv) {
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
function Xv(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function Zv(e) {
	let t = await fetch(qv, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(Jv)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var Qv = "/_ne/files/upload", $v = "/_ne/files/selection/", ey = "/_ne/files/upload/", ty = /* @__PURE__ */ new Map(), ny = !1;
function ry(e, t, n, r) {
	let i = Number(e.getAttribute(Nr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return ty.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of ty.keys()) e.isConnected || ty.delete(e);
	return ty.set(e, c), iy(e, c), ay(), a;
}
function iy(e, t) {
	let n = Gv(t.limit, D.language);
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
function ay() {
	ny || (ny = !0, D.onChange(() => {
		for (let [e, t] of ty) e.isConnected ? iy(e, t) : ty.delete(e);
	}));
}
async function oy(e, t) {
	let n = [...e];
	return await Yv.settled(), await sy(n, t);
}
function sy(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Qv), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function cy(e) {
	await Yv.settled();
	let t = await fetch(`${$v}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function ly(e) {
	return `${ey}${encodeURIComponent(e)}`;
}
var uy = () => {};
function dy(e) {
	return {
		uploadAsync: (e, t) => oy(e, t ?? uy),
		accepts: Cv,
		takeWithinSizeLimit: (t, n, r) => ry(t, n, r, e)
	};
}
function fy(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var py = "ui-open-picker";
function my(e) {
	return !e.dispatchEvent(new Event(py, {
		bubbles: !0,
		cancelable: !0
	}));
}
function hy(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var gy = "ui-file-input", _y = "ui-file-input__row", vy = "ui-file-input__native", yy = "ui-file-input__field", by = "ui-file-input__selection", xy = "data-ui-file-dragging", Sy = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(py, (e) => hy(e, {
			rootSelector: `.${gy}`,
			nativeSelector: `.${vy}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), fv({
			root: this.root,
			draggingAttribute: xy,
			resolveTarget: (e) => {
				let t = e.closest(`.${_y}`)?.closest(`.${gy}`) ?? null, n = t === null ? hv(this.root, e, `.${gy}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${vy}`) ?? null;
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
		let t = e.target.closest(`[${Pr}], .${_y}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${gy}`)?.querySelector(`.${vy}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(vy)) return;
		let t = e.target.closest(`.${gy}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${yy}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = ry(e, t, e.querySelector(`.${vy}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await oy(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Cy(r)), this.publishSelection(e, t.selectionId);
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
		fy(e.querySelector(`.${by}`), t);
	}
};
function Cy(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
}
var wy = 1024, Ty = 16777216;
function Ey(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Dy(e, t) {
	let n = Ly(t.zoom, 1, 4), r = Iy(e) / n / 2;
	return {
		x: Ly(t.x, r, e.width - r),
		y: Ly(t.y, r, e.height - r),
		zoom: n
	};
}
function Oy(e, t) {
	let n = Iy(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function ky(e, t, n) {
	return t.zoom * n / Iy(e);
}
function Ay(e, t, n, r, i) {
	let a = ky(e, t, n);
	return a > 0 ? Dy(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function jy(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Ly(t.zoom * r, 1, 4), o = ky(e, t, n), s = ky(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Dy(e, {
		...t,
		zoom: a
	}) : Dy(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function My(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Ny(e, t) {
	return Math.min(1, t * 4 / Iy(e), Math.sqrt(Ty / (e.width * e.height)));
}
function Py(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Fy(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Iy(e) {
	return Math.min(e.width, e.height);
}
function Ly(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Ry(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(qh, e.key), t.setAttribute(Jh, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Zh, ""), t.setAttribute(Xh, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Yh, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? vi : `${vi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var zy = class {
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
}, By = 100 / 3, Vy = 1, Hy = 2;
function Uy(e, t = By) {
	let n = e.deltaMode === Vy ? By : e.deltaMode === Hy ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Wy(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Gy = {
	notch: 100,
	pixels: Uy
}, Ky = "ui-image-crop", qy = "ui-image-crop-title", Jy = new zy("data-ui-image-crop-part"), Yy = "data-ui-image-crop-frame", Xy = 10, Zy = 1.2, Qy = 380, $y = 100, eb = .92, V = null, tb = !1, nb = null, rb = !1;
async function ib(e, t, n, r = gb) {
	if (V !== null || tb) return "cancelled";
	tb = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		tb = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		nb ??= ab();
		let o = nb;
		o.dialog.isConnected || document.body.append(o.dialog), V = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: Ey(a),
			finish: (t) => {
				V = null, e.close(Ky), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Yy, n.frame), e.open(Ky), mb(o);
	});
}
function ab() {
	let { dialog: e, surface: t } = Ry({
		key: Ky,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: qy,
		closesOnEscapeAndBackdrop: !1
	}), n = Jy.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = qy;
	let r = Jy.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Jy.element("canvas", "ui-image-crop__canvas"), a = Jy.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Jy.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Jy.button("ui-button--ghost", "cancel"), c = Jy.button("ui-button--primary", "apply");
	t.append(n, r, o, Jy.actions(s, c));
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
		let t = Jy.pressed(e);
		t === "cancel" ? V?.finish("cancelled") : t === "apply" && ob();
	}), new MutationObserver(() => {
		V !== null && e.hasAttribute("hidden") && V.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => sb(l, e)), o.addEventListener("input", () => fb(l, Number(o.value))), r.addEventListener("wheel", (e) => cb(l, e), { passive: !1 }), window.addEventListener("resize", () => hb(l)), new wg({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => V === null ? null : {
			last: t,
			start: V.view
		},
		move: (e, t, n) => {
			e.last !== null && lb(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			V !== null && (V.view = t.start, mb(l));
		},
		pinch: (e, t) => {
			e.last = null, ub(l, t);
		}
	}), l;
}
async function ob() {
	let e = V;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Oy(n, a), s = Py(t.type), c = i.encodeAsync(n, o, My(o, r.size), s);
	V = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Fy(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function sb(e, t) {
	if (t.defaultPrevented || j(t) || V === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), V.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Xy;
	switch (t.key) {
		case "ArrowLeft":
			lb(e, -n, 0);
			break;
		case "ArrowRight":
			lb(e, n, 0);
			break;
		case "ArrowUp":
			lb(e, 0, -n);
			break;
		case "ArrowDown":
			lb(e, 0, n);
			break;
		case "+":
		case "=":
			db(e, Zy);
			break;
		case "-":
		case "_":
			db(e, 1 / Zy);
			break;
		case "Enter":
			ob();
			break;
		default: return;
	}
	t.preventDefault();
}
function cb(e, t) {
	if (V === null) return;
	t.preventDefault();
	let n = Uy(t, e.stage.clientHeight), r = t.ctrlKey ? $y : Qy;
	db(e, 2 ** (-n.y / r), pb(e, t.clientX, t.clientY));
}
function lb(e, t, n) {
	V !== null && (V.view = Ay(V.source, V.view, e.frame.clientWidth, t, n), mb(e));
}
function ub(e, t) {
	if (V === null) return;
	let n = Ay(V.source, V.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	V.view = jy(V.source, n, e.frame.clientWidth, t.factor, pb(e, t.center.x, t.center.y)), mb(e);
}
function db(e, t, n) {
	V !== null && (V.view = jy(V.source, V.view, e.frame.clientWidth, t, n), mb(e));
}
function fb(e, t) {
	V !== null && Number.isFinite(t) && t > 0 && db(e, t / V.view.zoom);
}
function pb(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function mb(e) {
	if (V === null) return;
	let t = V.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), hb(e);
}
function hb(e) {
	rb || V === null || (rb = !0, requestAnimationFrame(() => {
		if (rb = !1, V === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = V.view, a = ky(V.source, i, t);
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
var gb = {
	decodeAsync: async (e, t) => {
		let n = await _b(e);
		if (n === null) return null;
		let r = n, i = Ny(r, t);
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
		}, r, eb);
	})
};
async function _b(e) {
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
var vb = "ui-image-input", yb = "ui-image-input--multiple", bb = "ui-image-input__surface", xb = "ui-image-input__native", Sb = "ui-image-input__picture", Cb = "ui-image-input__text", wb = "ui-image-input__selection", Tb = "ui-image-input__selections", Eb = "ui-image-input__tiles", Db = "ui-image-input__tile", Ob = "ui-image-input__remove", kb = "ui-image-input__progress", Ab = "SelectionId", jb = "--ui-image-progress", Mb = "data-ui-image-preview", Nb = "data-ui-image-dragging", Pb = "data-ui-image-tiles", Fb = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${vb}`)), B(this.root, `.${vb}`, {
			childList: !0,
			attributeFilter: [
				Mr,
				$e,
				ri
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Ab && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(ja(e.components, `.${vb}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(py, (e) => hy(e, {
			rootSelector: `.${vb}`,
			nativeSelector: `.${xb}`,
			pressed: (e) => e.querySelector(`.${bb}`)
		})), this.root.addEventListener(Su, (e) => this.handleDraftDropped(e)), fv({
			root: this.root,
			draggingAttribute: Nb,
			resolveTarget: (e) => {
				let t = e.closest(`.${bb}`), n = t?.closest(`.${vb}`) ?? null, r = n === null ? hv(this.root, e, `.${vb}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${bb}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${xb}`)?.getAttribute("accept") ?? "",
					multiple: Ib(i),
					refused: A(i) || O(a)
				};
			},
			onFiles: (e, t) => void (Ib(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Ib(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Sb}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Gb(e, e.getAttribute("data-ui-image-caption") ?? Jb(n)), qb(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(ri);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = t === null ? -1 : n.indexOf(t);
		if (r >= 0) {
			n.splice(0, r + 1);
			return;
		}
		let i = Bb(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Eb}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = Hb(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), Lb(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await cy(n);
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
		Ub(t.element, a, i === void 0 ? "" : ly(i.fileId)), t.element.classList.remove(hi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Ib(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pr}]`), n = t?.closest(`.${vb}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${xb}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ob}`), n = t?.closest(`.${vb}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(xb)) return;
		let t = e.target.closest(`.${vb}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Ib(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${vb}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), fy(t.querySelector(`.${wb}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${bb}`), r = e.querySelector(`.${Sb}`), i = e.querySelector(`.${wb}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || ry(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Mb, ""), r.setAttribute("src", o.url), Gb(e, a.name), qb(e, !0), n.classList.add(hi);
		try {
			let t = await oy([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, fy(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (Kb(e), fy(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(hi);
		}
	}
	async cropAsync(e, t) {
		let n = Rb(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await ib(this.dialogs, t, {
				frame: n,
				size: zb(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Eb}`), r = ry(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Vb(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await oy([t], (e) => r.element.style.setProperty(jb, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(hi), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Lb(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), Lb(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${Tb}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(ri, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Mb), t || Gb(e, ""));
	}
};
function Ib(e) {
	return e.classList.contains(yb);
}
function Lb(e, t) {
	e.hasAttribute(Pb) !== t.length > 0 && e.toggleAttribute(Pb, t.length > 0);
}
function Rb(e) {
	let t = e.getAttribute(et);
	return t === "square" || t === "circle" ? t : null;
}
function zb(e) {
	let t = Number(e.getAttribute(tt));
	return Number.isInteger(t) && t > 0 ? t : wy;
}
function Bb(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function Vb(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${Db} ${hi}`, Ub(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function Hb(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${Db} ${hi}`, n.type = "button", n.className = Ob, r.className = kb, D.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function Ub(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = Ob, i.className = kb, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, D.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...Wb(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...Wb(e, r, t), r, i);
}
function Wb(e, t, n) {
	return D.write(t, "aria-label", "ui.file.remove"), Vv(e, n, D.language);
}
function Gb(e, t) {
	let n = e.querySelector(`.${Cb}`);
	n !== null && (Cc(n, null), n.textContent !== t && (n.textContent = t));
}
function Kb(e) {
	let t = e.querySelector(`.${Cb}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function qb(e, t) {
	let n = e.querySelector(`.${bb}`);
	n !== null && D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Jb(e) {
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
var Yb = "ui-key-value-action__value", Xb = "ui-key-value-action--editable", Zb = "ui-text__title", Qb = "ui-row-form-", $b = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", ex = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${ou}`), !1), B(this.root, `.${ou}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Er]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && ax(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => ix(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), tx(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${cu} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Qb}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${su} [${Xe}]:not([${on}])`)) t.setAttribute(on, n);
		t.setAttribute(fi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${on}="${t}"], [${fi}="${t}"]`)) n.removeAttribute(on), n.removeAttribute(fi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${su} [${Xe}]`)) {
			if (vu(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Cu(e), this.judge(e);
	}
	judge(e) {
		let t = rx(e);
		for (let n of e.querySelectorAll(`.${su} [${Xe}]`)) this.options.validation.judgeShown(n, vu(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${su} :is(input, textarea, select)`);
		if (n !== null) {
			if (vu(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = rx(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), _u(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && M(e)) {
			nx(e);
			return;
		}
		if (e.defaultPrevented || j(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = fu(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Ci), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${cu} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function tx(e) {
	for (let t of e.querySelectorAll(`:scope > .${su}`)) {
		let e = t.querySelector($b) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Dr, e);
	}
}
function nx(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${ou}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Xb}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Lf) ?? null;
	n === null || O(n) || (e.preventDefault(), n.click());
}
function rx(e) {
	return e.querySelector(`.${Yb} .${Zb}`)?.textContent?.trim() ?? "";
}
function ix(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function ax(e) {
	let t = e.closest(`.${cu} button`), n = t?.closest(`.${cu}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var ox = `.ui-button[${Bt}="pressed"]`, sx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ox);
		t === null || O(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, cx = `${Tu}, [tabindex], [contenteditable], ${Ci}, [${Qe}]`, lx = ":scope > input.ui-field, :scope > textarea.ui-field", ux = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(wu);
		if (t === null || e.target !== t && e.target.closest(cx) !== null) return;
		let n = t.querySelector(lx);
		if (!vu(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, dx = "data-ui-input-debounce", fx = `input[${dx}], textarea[${dx}]`;
function px(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(fx);
}
var mx = /* @__PURE__ */ new Set();
function hx() {
	for (let e of mx) if (e.waiting) return !0;
	return !1;
}
function gx() {
	for (let e of mx) e.commitAll();
}
function _x(e) {
	for (let t of mx) t.drop(e);
}
var vx = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), mx.add(this);
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
}, yx = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new vx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!px(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(dx));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		px(e.target) && this.pauses.drop(e.target);
	}
}, bx = "data-ui-submit-on-enter", xx = "data-ui-runs-on-enter", Sx = "enter", Cx = "escape", wx = {
	name: Sx,
	registration: { settlesValue: !0 }
}, Tx = "ui-commit-in-place", Ex = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(Tx, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), du(t) ? this.runEscape(t, e) : this.leave(t)) : Dx(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Ox(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (_u(t)) {
			if (e.preventDefault(), Dx(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && du(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(Sx, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		_x(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = hp(e);
		e.blur(), gp(e, n), e.dispatchEvent(new Event(Cx, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(on);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${fi}="${Bi(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = hp(e);
		e.blur(), this.changes === t && this.commit(e), gp(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function Dx(e, t) {
	return kx(t) && e.hasAttribute(xx);
}
function Ox(e, t) {
	return kx(t) && e.hasAttribute(bx) && !e.readOnly && !O(e);
}
function kx(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/updates/icon-stand-in.ts
var Ax = "icon-stand-in", jx = ".ui-icon.ui-icon--circle", Mx = "ne-person", Nx = "ui-icon--circle", Px = "ui-icon--image", Fx = "ui-icon-stand-in", Ix = `:scope > .${Fx}`, Lx = "missing", Rx = "failed", zx = 512, Bx = /* @__PURE__ */ new Map(), Vx = /* @__PURE__ */ new Map();
function Hx(e) {
	let t = e.getAttribute(ct), n = Ux(e);
	return n === null ? e.removeAttribute(ct) : t !== n && e.setAttribute(ct, n), qx(e, n !== null), n === Lx ? "show" : t === Lx ? "release" : "keep";
}
function Ux(e) {
	if (!e.classList.contains(Nx)) return null;
	if (!e.className.split(" ").some(lo)) return Lx;
	let t = e.classList.contains(Px) ? Wx(e) : null;
	if (t === null) return null;
	let n = Bx.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (Gx(t, e), n === void 0 ? null : Rx) : n.loaded ? null : Rx;
}
function Wx(e) {
	let t = e.style.getPropertyValue(oo).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function Gx(e, t) {
	let n = Vx.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	Vx.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => Kx(e, !0)), r.addEventListener("error", () => Kx(e, !1)), r.src = e;
}
function Kx(e, t) {
	let n = Vx.get(e);
	Bx.delete(e), Bx.set(e, {
		loaded: t,
		at: Date.now()
	}), Vx.delete(e), Bx.size > zx && Bx.delete(Bx.keys().next().value);
	for (let e of n ?? []) Hx(e);
}
function qx(e, t) {
	let n = e.querySelector(Ix);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(ot), i = r !== null && uo(r).length > 0 ? r : Mx;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(uo(i))) return;
	so(n, i), n.classList.add(Fx);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var Jx = `.${nt}`, Yx = `img.${rt}`, Xx = `:scope > ${Yx}`, Zx = "%238c8c8c", Qx = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${Zx}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${Zx}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${Zx}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, $x = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", eS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Yx)) (rS(e) || e.complete && e.naturalWidth === 0) && aS(e);
		for (let e of this.root.querySelectorAll(jx)) Hx(e);
		B(this.root, `${Jx}, ${jx}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: tS
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? nS(t) : Hx(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(Yx) && aS(t);
	}
};
function tS(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(Yx) : t.matches(Jx));
}
function nS(e) {
	let t = e.querySelector(Xx);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (iS(t) ? t.getAttribute("src") !== sS(e) && oS(e, t) : (e.removeAttribute(st), qx(e, !1))), rS(t) && aS(t));
}
function rS(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function iS(e) {
	let t = e.getAttribute("src");
	return t === Qx || t === $x;
}
function aS(e) {
	if (iS(e)) return;
	let t = e.getAttribute(at);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n === null || !n.classList.contains("ui-image") || (n.setAttribute(st, ""), oS(n, e));
}
function oS(e, t) {
	t.setAttribute("src", sS(e)), qx(e, e.classList.contains(it));
}
function sS(e) {
	return e.classList.contains("ui-image--circle") ? $x : Qx;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var cS = "ui-radio-group__input", lS = "ui-radio-group__dot", uS = {
	kind: "radio",
	decorate: dS
};
function dS(e) {
	let t = document.createElement("input");
	t.className = cS, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = lS, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var fS = "data-ui-radio-value", pS = "ui-radio-group", mS = "ui-radio-group__item", hS = "data-ui-radio-group-name", gS = "data-ui-radio-bind-value-id", _S = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${pS}`)]);
		for (let e of this.root.querySelectorAll(`.${pS}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${pS}`));
					continue;
				}
				if (!zh(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(vS));
			for (let e of new Set(t.map((e) => e.closest(`.${pS}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [fS, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${pS}`)) {
			let n = e.getAttribute(hS);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(hS), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(hS, a);
			for (let e of td(r, `.${cS}`, `.${pS}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${pS}`)) n.has(e.getAttribute(hS) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(fS), n = e.getAttribute(hS), r = e.getAttribute(gS);
		for (let i of td(e, `.${cS}`, `.${pS}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Xe, r), i.checked = i.value === t;
			let e = yS(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function vS(e) {
	return e.classList.contains(pS) ? [e] : [...e.querySelectorAll(`.${pS}`)];
}
function yS(e) {
	let t = e.closest(`.${mS}`);
	return t !== null && k(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function bS(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function xS(e) {
	return bS(e).toString(16).padStart(2, "0").toUpperCase();
}
function SS(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (CS(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function CS(e, t, n) {
	return .2126 * wS(e) + .7152 * wS(t) + .0722 * wS(n);
}
function wS(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var TS = "inlineMarkupPlainText", ES = /* @__PURE__ */ new Map([
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
]), DS = [
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
function OS(e) {
	return U(e, DS);
}
var kS = [
	"small",
	"medium",
	"large"
], AS = ["default", "circle"], jS = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], MS = [
	"start",
	"center",
	"end",
	"justify"
], NS = ["nowrap", "wrap"], PS = /* @__PURE__ */ new Map([
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
]), FS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), IS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), LS = ["inline", "trailing"], RS = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], zS = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], BS = [
	"small",
	"medium",
	"large"
], VS = [
	"small",
	"medium",
	"large"
], HS = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], US = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], WS = [
	"filled",
	"tinted",
	"outline"
], GS = ["light", "dark"], KS = [
	"start",
	"center",
	"end",
	"stretch"
], qS = ["clip", "visible"], JS = [
	"visible",
	"hidden",
	"collapsed"
], YS = [
	"background",
	"raised",
	"tinted",
	"flat"
], XS = ["horizontal", "vertical"], ZS = [
	"none",
	"gap",
	"rule"
], QS = [
	"none",
	"one",
	"many"
], $S = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], eC = ["stack", "wrap"], tC = ["end", "start"], nC = [
	"disabled",
	"auto",
	"always"
], rC = [
	"disabled",
	"proximity",
	"mandatory"
], iC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], aC = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], oC = ["hex", "rgb"], sC = ["field", "swatch"], cC = [
	"fill",
	"contain",
	"cover",
	"none"
], lC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], uC = ["default", "circle"], dC = ["card", "quiet"], fC = ["uniform", "vignette"], pC = ["linear", "circular"], mC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], hC = [
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
], gC = [
	"None",
	"Shade",
	"Tint"
], _C = /* @__PURE__ */ new Map();
function vC(e) {
	return _C.get(e);
}
function H(e, t, n) {
	return xC(e, yC(t, n), (e) => `${t}${U(e, n)}`);
}
function yC(e, t) {
	return bC(t.map((t) => `${e}${t}`));
}
function bC(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function xC(e, t, n) {
	return _C.set(e, t), [e, n];
}
function SC(e, t, n) {
	return Om.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var CC = new Map([
	H("colorClass", "ui-color--", DS),
	xC("themeColorClass", yC("ui-color--", DS), (e) => cw(e)),
	xC("iconClass", lo, (e) => uo(e)),
	["iconUrlCss", (e) => no(e)],
	["safeUrl", (e) => Ha(e)],
	["safeImageSource", (e) => Za(e)],
	[TS, (e) => e == null ? void 0 : wo(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	H("iconSizeClass", "ui-icon-size--", kS),
	xC("iconShapeClass", bC(["ui-icon--circle"]), (e) => U(e, AS) === "circle" ? "ui-icon--circle" : ""),
	H("textTypeClass", "ui-text-type--", jS),
	xC("textAppearanceClass", yC("ui-text-type--", jS), (e) => vw(e, "ui-text-type--")),
	xC("textDescriptionTypeClass", yC("ui-text--description-", jS), (e) => vw(e, "ui-text--description-")),
	H("textAlignmentClass", "ui-text--align-", MS),
	H("textWrapClass", "ui-text--", NS),
	H("buttonAlignmentClass", "ui-button--align-", MS),
	H("textBadgePlacementHostClass", "ui-text--badge-", LS),
	H("badgeStyleClass", "ui-badge-style--", US),
	H("badgeFillClass", "ui-badge-fill--", WS),
	xC("badgeColoredClass", bC(["ui-badge--colored"]), (e) => $C(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => lw(e)],
	H("buttonClass", "ui-button--", HS),
	H("surfaceStyleClass", "ui-surface--", YS),
	H("orientationClass", "ui-orientation--", XS),
	H("groupSeparatorClass", "ui-command-bar--separator-", ZS),
	["selectionModeAttribute", (e) => U(e, QS)],
	["selectionBackgroundCss", (e) => $C(XC(e, "background"))],
	["selectionForegroundCss", (e) => $C(XC(e, "foreground"))],
	["selectionMarkColorCss", (e) => $C(XC(e, "markColor"))],
	["selectionMarkCss", (e) => QC(XC(e, "mark"))],
	["selectionFontWeightCss", (e) => ZC(XC(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => $C(XC(e, "actionBarBackground"))],
	H("itemsViewLayoutClass", "ui-items-view--", eC),
	H("dragHandlePlacementClass", "ui-drag-handle--", tC),
	H("scrollXClass", "ui-scroll-x--", nC),
	H("scrollYClass", "ui-scroll-y--", nC),
	["hostViewport", (e) => RC(e)],
	H("scrollSnapClass", "ui-scroll-snap--", rC),
	H("inputAppearanceClass", "ui-input--", zS),
	H("inputSizeClass", "ui-input--", VS),
	H("buttonSizeClass", "ui-button--", BS),
	H("buttonGroupSizeClass", "ui-button-group--", BS),
	["textInputTypeAttribute", (e) => U(e, iC)],
	["inputModeAttribute", (e) => U(e, aC)],
	["colorTextFormatAttribute", (e) => U(e, oC)],
	["colorInputVariantAttribute", (e) => U(e, sC)],
	["themeNameCss", (e) => U(e, GS)],
	["alignmentCss", (e) => U(e, KS)],
	["alignmentStretchFallbackCss", (e) => U(e, KS) === "stretch" ? "start" : ""],
	["overflowCss", (e) => U(e, qS)],
	["layoutLengthCss", (e) => zC(e)],
	["thicknessCss", (e) => HC(e)],
	xC("borderEdgeClass", yC("ui-border--", RS), (e) => {
		let t = GC(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => KC(e)],
	["gridUnitCss", (e) => qC(e)],
	["pixelsCss", (e) => Ow(e)],
	["gridTemplateCss", (e) => JC(e)],
	["colorVariantCss", (e) => Sw(e)],
	["themeColorCss", (e) => $C(e)],
	["themeInkCss", (e) => tw(e)],
	["roleInkCss", (e) => nw(e)],
	["themeOnColorCss", (e) => iw(e)],
	["themeGroundCss", (e) => aw(e)],
	["themeColorInlineCss", (e) => ew(e) ? "" : $C(e)],
	["themeColorCanonical", (e) => bw(e)],
	["textAppearanceFontSizeCss", (e) => yw(e, "size")],
	["textAppearanceFontWeightCss", (e) => yw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => yw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => yw(e, "letterSpacing")],
	...SC("responsiveLayoutLength", "Css", (e, t) => zC(Pm(e, t))),
	...SC("responsiveWidth", "Css", (e, t) => BC(Pm(e, t), "horizontal")),
	...SC("responsiveHeight", "Css", (e, t) => BC(Pm(e, t), "vertical")),
	...SC("responsiveThickness", "Css", (e, t) => HC(Pm(e, t))),
	...SC("responsivePadding", "Css", (e, t) => UC(Pm(e, t))),
	...SC("responsiveThicknessHorizontal", "Css", (e, t) => WC(Pm(e, t), "horizontal")),
	...SC("responsiveThicknessVertical", "Css", (e, t) => WC(Pm(e, t), "vertical")),
	...SC("responsiveRadius", "Css", (e, t) => KC(Pm(e, t))),
	...SC("responsivePixels", "Css", (e, t) => kw(Pm(e, t))),
	...SC("visibility", "Attribute", (e, t) => Aw(e, t)),
	...SC("gridPlacement", "ColumnCss", (e, t) => YC(Pm(e, t), "column")),
	...SC("gridPlacement", "RowCss", (e, t) => YC(Pm(e, t), "row")),
	...SC("gridPlacement", "ColumnSpanCss", (e, t) => YC(Pm(e, t), "columnSpan")),
	...SC("gridPlacement", "RowSpanCss", (e, t) => YC(Pm(e, t), "rowSpan")),
	H("imageFitClass", "ui-image-fit--", cC),
	xC("expanderVariantClass", bC(["ui-expander--quiet"]), (e) => U(e, dC) === "quiet" ? "ui-expander--quiet" : ""),
	xC("imageShapeClass", bC(["ui-image--circle"]), (e) => U(e, uC) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => OC(e)],
	["backgroundImageAttribute", (e) => OC(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => U(e, lC)],
	["backgroundImageDimCss", (e) => kC(e)],
	["backgroundImageDimModeAttribute", (e) => U(e, fC) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => NC(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => NC(e) ? "" : void 0],
	["positiveCount", (e) => AC(e)?.toString()],
	["nonNegativeCount", (e) => jC(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => jC(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => MC(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => MC(e, (e) => e >= 0)?.toString()],
	["share", (e) => MC(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => AC(e) === void 0 ? void 0 : ""],
	xC("maxLinesClass", bC(["ui-text--max-lines"]), (e) => AC(e) === void 0 ? "" : "ui-text--max-lines"),
	H("progressVariantClass", "ui-progress--", pC),
	["progressValueText", (e) => Dw(e)],
	["textAreaResizeCss", (e) => U(e, mC)],
	H("flyoutPlacementClass", "ui-flyout--", hC),
	["popupPlacementAttribute", (e) => U(e, hC)],
	["tabMenuEntriesAttribute", (e) => EC(e)],
	["markedDaysAttribute", (e) => DC(e)]
]);
function wC(e) {
	let t = CC.get("surfaceStyleClass");
	return YS.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var TC = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function EC(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = TC.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function DC(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function OC(e) {
	return no(e);
}
function kC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function AC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function jC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function MC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function NC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var PC = [
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
], FC = new Map(PC.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), IC = new Map(PC.map(([e, t]) => [e, t])), LC = /* @__PURE__ */ new Map([[qS, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [lC, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function U(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : LC.get(t)?.get(e)) ?? ES.get(e) ?? Vi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function RC(e) {
	return e == null || U(e, nC) === "disabled" ? void 0 : "parent";
}
function zC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Ow(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Ow(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function BC(e, t) {
	if (typeof e != "object" || !e) return zC(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? zC(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function VC(e) {
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
function HC(e) {
	if (e == null) return "";
	let t = VC(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function UC(e) {
	let t = e == null ? void 0 : VC(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function WC(e, t) {
	let n = VC(e);
	return n === void 0 ? "" : Ow(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function GC(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = Om.map((t) => Pm(e, t)).filter((e) => e != null), n = new Set(t.map((e) => GC(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = VC(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function KC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Ow(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Ow(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function qC(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Ow(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function JC(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return qC(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return qC(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${qC(e[0])})` : e.map((e) => qC(e)).join(" ");
}
function YC(e, t) {
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
function XC(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function ZC(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function QC(e) {
	if (e == null) return "";
	switch (U(e, $S)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function $C(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (xw(e)) return Sw(e);
	let t = e, n = Sw(t.light), r = Sw(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = PS.get(U(o, DS));
	return s ? `var(${s})` : "";
}
function ew(e) {
	if (typeof e != "object" || !e || xw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function tw(e) {
	if (ew(e)) {
		let t = FS.get(U(e.style, DS));
		if (t !== void 0) return `var(${t})`;
	}
	return $C(e);
}
function nw(e) {
	if (typeof e != "object" || !e || xw(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? tw(e) : "";
}
var rw = /* @__PURE__ */ new Set(["background", "surface"]);
function iw(e) {
	if (typeof e != "object" || !e) return "";
	if (xw(e)) return ow(e) ? "initial" : sw(e);
	let t = e, n = sw(t.light ?? t.dark), r = sw(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && ow(t.light ?? t.dark) && ow(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = U(t.style, DS);
	if (rw.has(i)) return "initial";
	let a = IS.get(i);
	return a ? `var(${a})` : "";
}
function aw(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (xw(e) ? ow(e) : ow(t.light ?? t.dark) && ow(t.dark ?? t.light)) return "inherit";
	}
	return $C(e);
}
function ow(e) {
	return Cw(e)?.[3] === 0;
}
function sw(e) {
	let t = Cw(e);
	return t === void 0 ? "" : SS(t[0], t[1], t[2], t[3]);
}
function cw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${U(n, DS)}`;
}
function lw(e) {
	let t = pw(e == null ? "" : String(e).trim(), uw + 1);
	return t > 0 && t <= uw ? "compact" : "";
}
var uw = 2, dw = /[\u0300-\uFFFF]/, fw = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function pw(e, t) {
	if (!dw.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of fw.segment(e)) {
		if (n >= t) break;
		n += mw(r) ? 2 : 1;
	}
	return n;
}
function mw(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < hw.length; e += 2) if (t >= hw[e] && t <= hw[e + 1]) return !0;
	return !1;
}
var hw = [
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
function gw(e, t) {
	_w(e, String(t));
}
function _w(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ue, lw(t)), e.setAttribute(We, "");
}
function vw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${U(r, jS)}`;
}
function yw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Ow(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Ow(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Ow(e);
		}
		default: return "";
	}
}
function bw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = ww(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${xS(r.rgb >> 16 & 255)}${xS(r.rgb >> 8 & 255)}${xS(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${xS(e)}`;
	}
	let i = Tw(r.name);
	return i === null ? "" : `${i}/${Ew(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function xw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Sw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = Cw(e);
	return t === void 0 ? "" : `#${xS(t[0])}${xS(t[1])}${xS(t[2])}${xS(t[3])}`;
}
function Cw(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Tw(t.name), i = n ?? (r === null ? void 0 : FC.get(r));
	if (!i) return;
	let a = Ew(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = bS(c * (1 - o)), l = bS(l * (1 - o)), u = bS(u * (1 - o))) : a === "Tint" && (c = bS(c + (255 - c) * o), l = bS(l + (255 - l) * o), u = bS(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function ww(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = DS[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Tw(e) {
	if (typeof e == "number") return IC.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Ew(e) {
	if (typeof e == "number") return gC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Dw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Ow(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function kw(e) {
	return e == null ? "" : Ow(e);
}
function Aw(e, t) {
	let n = Fm(e, t);
	if (n == null) return;
	let r = U(n, JS);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var jw = "data-ui-search-debounce", Mw = "data-ui-search-min-length", Nw = "data-ui-search-manual", Pw = "data-ui-search-answered", Fw = "ui-search__input", Iw = "ui-select__list", Lw = "ui-select__option", Rw = 300, zw = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new vx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Fw) || e.isComposing === !0) return;
		let t = e.target;
		Vw(t);
		let n = t.getAttribute(jw), r = n === null ? Rw : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : Rw, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || j(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Fw)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(Nw)) && Bw(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Bw(e) {
	let t = Number(e.getAttribute(Mw) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function Vw(e) {
	if (e.hasAttribute(Pw)) return;
	let t = e.closest(`.${Oi}`), n = t?.querySelector(`.${Iw}`);
	if (t == null || n == null) return;
	let r = Bw(e) ? vg(e.value, e) : [], i = Hw(n, (e) => r.length === 0 || bg(yg(Cg(e), e), r));
	Gw(t, n, r.length > 0 && i === 0);
}
function Hw(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Uw(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Lw)) continue;
		let e = t(a);
		Uw(a, e), r ||= e, e && i++;
	}
	return n !== null && Uw(n, r), i;
}
function Uw(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Ww(e) {
	let t = e.querySelector(`.${Iw}`);
	t !== null && Gw(e, t, Hw(t, (e) => e.style.display !== "none") === 0);
}
function Gw(e, t, n) {
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
var Kw = 500, qw = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Kw) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += yg(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (yg(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function Jw(e) {
	return j(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var Yw = "data-ui-select-value", Xw = "data-ui-select-placement", Zw = "ui-select--open", Qw = "ui-select__trigger-content", $w = "data-ui-select-content", eT = "ui-select__placeholder", tT = "ui-input__affix-icon--prefix", nT = "ui-select__popup", rT = "ui-select__list", iT = "ui-select__option", aT = "ui-select__value-input", oT = "data-ui-select-clear", sT = "ui-select--clearable", cT = "ui-search", lT = "ui-search__input", uT = "data-ui-active", dT = "data-ui-list-keyboard", fT = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), pT = "ui-multi-select", mT = "ui-multi-select__chips", hT = "ui-multi-select__chip", gT = "ui-multi-select__chip-label", _T = "ui-multi-select__chip-remove", vT = "ui-badge-select", yT = "ui-text__badge", bT = "ui-badge", xT = "ui-badge__icon", ST = "ui-badge__text", CT = "ui-badge-style--info ui-text-type--overline", wT = "ui-text-type--overline", TT = "data-ui-select-chip", ET = "data-ui-select-chips", DT = "data-ui-select-max", OT = "data-ui-select-free-text", kT = "ui-multi-select__entry", AT = "data-ui-select-tag-entry", jT = [
	Yw,
	ri,
	DT
], MT = ["class", b], NT = [...MT, "style"];
function PT(e) {
	return e === null || A(e) || O(e);
}
function FT(e) {
	return e.classList.contains(pT);
}
function IT(e) {
	return e.classList.contains(cT);
}
function LT(e) {
	return IT(e) ? e.querySelector(`.${lT}`) : null;
}
function RT(e) {
	return e.hasAttribute(OT) ? e.querySelector(`:scope > .${wi} .${kT}`) : null;
}
function zT(e) {
	return LT(e) ?? RT(e);
}
function BT(e) {
	return RT(e) ?? e.querySelector(".ui-select__trigger");
}
function VT(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(kT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function HT(e) {
	return td(e, `.${nT} .${iT}`, `.${Oi}`);
}
function UT(e) {
	let t = HT(e).filter((e) => !k(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(uT)) ?? null;
}
function WT(e) {
	for (let t of td(e, `.${rT}`, `.${Oi}`)) {
		let e = t.querySelector(`:scope > .${iT}[${uT}]:not([${Xr}])`) !== null;
		t.hasAttribute(dT) !== e && t.toggleAttribute(dT, e);
	}
}
function GT(e) {
	return e === null ? null : Cg(e);
}
function KT(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var qT = class {
	root;
	popups = new s_({
		show: ({ owner: e }) => e.classList.add(Zw),
		hide: ({ owner: e }) => {
			e.classList.remove(Zw), this.markActive(e, null);
			let t = e.querySelector(`.${nT}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => zT(e) === null
	});
	typeAhead = new qw();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) zh(n) || uE(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: jT,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Oi}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${oT}], .${_T}`) !== null || $T(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (PT(r)) return;
		this.releaseRefusal(r);
		let i = $u(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = VT(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !j(e) ? VT(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(AT) !== "first-suggestion" || !HT(t.select).some((e) => e.hasAttribute(uT)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = VT(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || PT(t.select) || !Zu(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Qu(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Gu(e.getAttribute(ri)), a = Ku(e.getAttribute(DT)), o = ed(i, n.map((t) => ({
			text: t,
			key: eE(e, t) ?? t
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
		Vw(t);
		let n = t.value.trim().length > 0, r = n ? YT(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(AT) === "first-suggestion" && (this.markActive(e, i), i !== null && ZT(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), WT(e), FT(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(Yw);
		this.decorateOptions(e);
		let n = t === null ? null : HT(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${eT}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of HT(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${aT}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), Ww(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(vT) ? NT : MT;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = Gu(e.getAttribute(ri)), n = new Set(t), r = qu(t, Ku(e.getAttribute(DT)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = HT(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = RT(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(vT);
		rE(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? tE(t) : void 0;
			return {
				key: e,
				label: nE(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== PT(e) && (o.readOnly = PT(e));
		let l = e.querySelector(`.${eT}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${aT}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(ri, d), Ww(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${wi}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${Qw}`), a = i?.getAttribute($w) ?? null;
		if (i !== null && a !== null && (i.removeAttribute($w), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && IT(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = Qw;
			let e = r.querySelector(`:scope > .${tT}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return KT(s), Hh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of HT(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${iT}`);
		t === null || n === null || n.hasAttribute(uT) || k(n) || O(n) || n.closest(".ui-select") !== t || (zT(t) === null && (N(HT(t).filter((e) => !k(e)), n), ap(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_T}`);
		if (t !== null) {
			let n = t.closest(`.${Oi}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), PT(n) || this.removeChosen(n, t.closest(`.${hT}`)?.getAttribute(TT) ?? null));
			return;
		}
		let n = e.target.closest(`[${oT}]`);
		if (n !== null) {
			let t = n.closest(`.${Oi}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), PT(t) || (this.clearValue(t), JT(t)));
			return;
		}
		let r = e.target.closest(`.${wi}`);
		if (r !== null) {
			let t = r.closest(`.${Oi}`);
			if (PT(t)) return;
			e.preventDefault();
			let n = t === null ? null : RT(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${iT}`);
		if (i === null) return;
		let a = i.closest(`.${Oi}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(HT(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.openSelect !== null && WT(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${iT}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Oi}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && M(e, { alt: !0 })) {
			e.preventDefault();
			let n = UT(t);
			return n !== null && !FT(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !fT.has(e.key) || !M(e) || (e.key === "Home" || e.key === "End") && vu(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = VT(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (PT(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? YT(r).find((e) => e.hasAttribute(uT)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Qu(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Qu(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${mT} > .${hT}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(TT)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = QT(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${_T}`) ?? (n === 1 ? BT(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		Vw(t);
		let r = YT(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(_T) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !FT(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), PT(n)) return !0;
				let r = QT(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(TT) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(TT) ?? null);
				let o = a === null ? null : QT(n).find((e) => e.getAttribute(TT) === a) ?? null;
				return o !== null && o.querySelector(`.${_T}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || PT(t)) return !1;
		e.preventDefault();
		let n = LT(t);
		n !== null && Vw(n);
		let r = YT(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = Jw(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(iT))) return !1;
		let r = n.closest(`.${Oi}`), i = r !== null && r === this.openSelect;
		if (r === null || PT(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = LT(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = YT(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(uT)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => GT(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (N(HT(r).filter((e) => !k(e)), c), ZT(r, c), R(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !M(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Oi}`);
		return t === null || t === this.openSelect || !t.classList.contains(sT) || PT(t) || e.target !== BT(t) || e.key === "Backspace" && FT(t) || (RT(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !FT(t) || PT(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${mT} > .${hT}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(TT)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(lT) || !t.contains(e.target) ? null : YT(t).find((e) => e.hasAttribute(uT)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = zT(e), i = RT(e);
		r !== null && !t && Vw(r), Ww(e);
		let a = e.querySelector(`.${wi}`), o = e.querySelector(`.${nT}`), s = e.querySelector(`.${rT}`) ?? o, c = e.getAttribute(Xw);
		if (a === null || o === null || s === null) return;
		let l = Ui(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Rm(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), dE(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = YT(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Qf()) {
			N(n, null), this.markActive(e, null), JT(e);
			return;
		}
		let i = r ?? n[0];
		N(n, i), this.markActive(e, i, Qf()), ZT(e, i), R(i);
	}
	initializeSearch(e, t, n, r) {
		let i = HT(e), a = YT(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Qf() ? null : a[0] ?? null);
		N(i, null), this.markActive(e, o, Qf()), o !== null && ZT(e, o), !$f() && (R(t), t.select());
	}
	initializeEntry(e, t) {
		N(HT(e), null), this.markActive(e, t), t !== null && ZT(e, t);
	}
	moveCurrent(e, t) {
		let n = HT(e).filter((e) => !k(e)), r = bf(t, n, UT(e), "vertical");
		r !== null && (zT(e) === null ? Iu(n, r) : ZT(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of HT(e)) r === t ? r.setAttribute(uT, "") : r.hasAttribute(uT) && r.removeAttribute(uT), ep(r, r === t && n);
		WT(e);
		let r = zT(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Ui(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || PT(e)) return;
		if (FT(e)) {
			let r = Ju(Gu(e.getAttribute(ri)), n, Ku(e.getAttribute(DT)));
			this.markActive(e, t, Qf()), r !== null && this.writeChosen(e, r);
			let i = RT(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(Yw) === n) {
			this.close();
			return;
		}
		e.setAttribute(Yw, n), this.sync(e);
		let r = e.querySelector(`.${aT}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Yu(Gu(e.getAttribute(ri)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${hT}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && BT(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(ri) : e.setAttribute(ri, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${aT}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (FT(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(Yw)) return;
		e.removeAttribute(Yw), this.sync(e);
		let t = e.querySelector(`.${aT}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function JT(e) {
	let t = e.querySelector(`.${wi}`), n = BT(e);
	t !== null && n !== null && !t.contains(document.activeElement) && R(n);
}
function YT(e) {
	return HT(e).filter((e) => XT(e) && !k(e) && !O(e));
}
function XT(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function ZT(e, t) {
	let n = e.querySelector(`.${rT}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function QT(e) {
	return [...e.querySelectorAll(`.${mT} > .${hT}`)];
}
function $T(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && RT(t) !== null && !e.classList.contains(kT);
}
function eE(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of HT(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || GT(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function tE(e) {
	return e?.querySelector(`.${yT}`) ?? null;
}
function nE(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${ST}`)?.textContent ?? null : null) ?? GT(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function rE(e, t) {
	let n = e.querySelector(`.${mT}`);
	if (n === null) return;
	n.hasAttribute(ET) !== t.length > 0 && n.toggleAttribute(ET, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${hT}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(TT) === t[n].key && e.querySelector(`.${gT}`)?.textContent === t[n].label && (t[n].badge === void 0 || cE(e) === cE(t[n].badge ?? sE()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(iE));
	}
}
function iE(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? aE(e.label) : oE(e.label, e.badge);
	return n.classList.add(hT), n.setAttribute(TT, e.key), t.className = _T, t.type = "button", t.tabIndex = -1, D.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function aE(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = gT, n.textContent = e, t.append(n), t;
}
function oE(e, t) {
	let n = t === null ? sE() : t.cloneNode(!0);
	KT(n), n.classList.remove(yT);
	let r = n.querySelector(`:scope > .${ST}`);
	return r?.classList.add(gT), r !== null && !n.hasAttribute("data-ui-badge-text") && _w(n, e), n;
}
function sE() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${bT} ${CT}`, t.className = `${xT} ui-icon`, n.className = `${ST} ${wT}`, e.append(t, n), e;
}
function cE(e) {
	let t = e.querySelector(`:scope > .${xT}`);
	return `${lE(e)}|${t === null ? "" : lE(t)}`;
}
function lE(e) {
	return `${[...e.classList].filter((e) => e !== hT && e !== yT).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ge)}`;
}
function uE(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Oi}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === Yw || e.attributeName === "data-ui-selected-keys" || e.attributeName === DT)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(bT) !== !0) return;
	let r = n?.closest(`.${nT}`)?.closest(`.${Oi}`);
	r != null && t.add(r);
}
function dE(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var fE = class {
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
		!vu(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, pE = "textarea.ui-text-area__field", mE = "data-ui-text-area-grow";
function hE() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var gE = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(pE) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(pE)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(ja(e.components, pE));
		}), B(this.root, pE, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [mE]
		}, (e) => {
			this.fitAll(ja(e, pE));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(mE)) {
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
function _E(e) {
	let t = vE(e.getAttribute("min"), 0), n = vE(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, vE(r, 1))
	};
}
function vE(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function yE(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function bE(e, t) {
	return xE(t.min + e * (t.max - t.min), t);
}
function xE(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, SE(t.min + r * t.step, t);
}
function SE(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(CE(t.step), CE(t.min)))));
}
function CE(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function wE(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function TE(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return EE(o, i);
	let s = (o - i.min) / i.step;
	return EE(SE(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function EE(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var DE = "ui-slider__input", OE = "ui-slider__input--end", kE = "ui-slider__input--held", AE = "ui-slider__value", jE = "ui-slider__bubble", ME = "ui-slider__track", NE = "ui-slider__thumb-anchor", PE = "ui-slider", FE = "ui-slider--range", IE = "ui-orientation--vertical", LE = "--ui-slider-fraction", RE = "--ui-slider-end-fraction", zE = 6, BE = "Value", VE = "EndValue", HE = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), UE = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new wg({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${FE} .${ME}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (HE.has(e.propertyName)) for (let t of ja(e.components, `.${DE}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (GE(t) ? VE : BE) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = WE(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = WE(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = WE(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || JE(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(DE)) return;
		let t = e.target;
		if (this.cancelled.delete(t), JE(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = KE(t);
		if (n !== null) {
			let e = qE(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${DE}:not(.${OE})`), r = e.querySelector(`.${OE}`);
		if (n === null || r === null) return null;
		let i = bE(yE(e.getBoundingClientRect(), t, YE(e), XE(e)), _E(n)), a = wE(i, Number(n.value), Number(r.value));
		if (JE(n)) return R(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${ME}`);
		if (n === null) return;
		let r = bE(yE(n.getBoundingClientRect(), t, YE(n), XE(n)), _E(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(kE), R(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = KE(e), r = n === null ? String(t) : qE(e, t, n);
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
		e.held?.classList.remove(kE), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = ZE(e);
		t !== null && Ym(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: zE
		});
	}
	releaseBubble(e) {
		sh(ZE(e)?.bubble);
	}
	writeReadings(e) {
		let t = GE(e), n = e.closest(`.${ME}`)?.parentElement ?? e.parentElement, r = t ? `.${AE}--end, .${jE}--end` : `.${AE}:not(.${AE}--end), .${jE}:not(.${jE}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${ME}`)?.style.setProperty(t ? RE : LE, String(QE(e))), e.matches(`:active, :focus-visible, .${kE}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function WE(e) {
	return e instanceof HTMLInputElement && e.classList.contains(DE) ? e : null;
}
function GE(e) {
	return e.classList.contains(OE);
}
function KE(e) {
	return e.closest(`.${FE} .${ME}`)?.querySelector(GE(e) ? `.${DE}:not(.${OE})` : `.${OE}`) ?? null;
}
function qE(e, t, n) {
	let r = Number(e.closest(`.${PE}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(TE(t, GE(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, _E(e)));
}
function JE(e) {
	return A(e) || O(e);
}
function YE(e) {
	return e.closest(`.${PE}`)?.classList.contains(IE) === !0;
}
function XE(e) {
	let t = e.querySelector(`.${NE}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : YE(e) ? t.height : t.width;
}
function ZE(e) {
	if (!(e instanceof Element) || !e.classList.contains(DE)) return null;
	let t = e.closest(`.${ME}`), n = GE(e), r = t?.querySelector(n ? `.${jE}--end` : `.${jE}:not(.${jE}--end)`) ?? null, i = t?.querySelector(n ? `.${NE}--end` : `.${NE}:not(.${NE}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: YE(e)
	};
}
function QE(e) {
	let { min: t, max: n } = _E(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var $E = {
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
}, eD = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], tD = [
	"$n",
	"n$",
	"$ n",
	"n $"
], nD = [
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
], rD = [
	"n %",
	"n%",
	"%n",
	"% n"
], iD = [
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
], aD = /[1-9]/;
function oD(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return $E;
	try {
		return {
			...$E,
			...JSON.parse(t)
		};
	} catch {
		return $E;
	}
}
function sD(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = lD(t);
	if (r === null) return uD(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = dD(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return cD(e, t) ? gD(eD[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = dD(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return cD(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = fD(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return cD(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = dD(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return gD(cD(e, t) ? nD[n.currencyNegativePattern] ?? "-$n" : tD[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = dD(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return gD(cD(e, t) ? iD[n.percentNegativePattern] ?? "-n %" : rD[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return uD(e, n);
	}
}
function cD(e, t) {
	return e < 0 && aD.test(t);
}
function lD(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function uD(e, t) {
	let { integer: n, fraction: r } = pD(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function dD(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = fD(e, t, n);
	return n === 0 ? hD(o, r, i) : `${hD(o, r, i)}${a}${s}`;
}
function fD(e, t, n) {
	let { integer: r, fraction: i } = pD(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? mD(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function pD(e, t) {
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
function mD(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function hD(e, t, n) {
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
function gD(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var _D = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function vD(e) {
	if (!_D.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var yD = {
	readCulture: oD,
	format: sD,
	parseInvariant: vD
}, bD = /^-?(\d+(\.\d*)?|\.\d+)$/;
function xD(e, t, n) {
	if (!bD.test(e)) return e;
	let r = n.thousands === !1 ? OD(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return sD(i, n.thousands === !0 ? SD(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return sD(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function SD(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function CD(e, t, n) {
	return bD.test(e) ? (DD(n) ? kD(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function wD(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = DD(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!bD.test(d)) return null;
	let f = a ? kD(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function TD(e, t, n, r, i) {
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
function ED(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function DD(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function OD(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function kD(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var AD = "ui-number-input", jD = "ui-number-input__field", MD = "data-ui-number-no-decimals", ND = "data-ui-number-no-negative", PD = "data-ui-number-thousands", FD = "data-ui-number-no-thousands", ID = "data-ui-number-trim-zeros", LD = "data-ui-number-step", RD = "data-ui-number-min", zD = "data-ui-number-max", BD = "data-ui-number-step-direction", VD = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), HD = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${jD}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(ja(e.components, `.${jD}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${jD}`)));
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
		let t = UD(e);
		if (t !== null) return this.keptValue(t) ?? JD(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(ID) ? ED(t) : t, r = oD(e), i = e === document.activeElement ? CD(n, r, YD(e)) : KD(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = UD(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(MD), r = !t.hasAttribute(ND), i = t.selectionStart ?? t.value.length, a = TD(t.value, i, oD(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = UD(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = UD(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : JD(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(ID) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = ED(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = UD(e.target);
		if (t === null) return;
		let n = JD(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = UD(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = CD(t, oD(e), YD(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + BD + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${jD}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(BD) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = VD.get(e.key);
		if (t === void 0 || !M(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = UD(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(LD) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : JD(e) ?? "0") || 0) + n * t, i = e.getAttribute(RD), a = e.getAttribute(zD);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, XD(r)), this.show(e);
	}
};
function UD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(jD) ? e : null;
}
function WD(e, t) {
	let n = e.classList.contains(AD) ? e.querySelector(`.${jD}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = GD(n, RD), a = GD(n, zD);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: KD(n, i, oD(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: KD(n, a, oD(n)) }
	} : null;
}
function GD(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function KD(e, t, n) {
	return xD(t, n, {
		format: YD(e),
		thousands: qD(e)
	});
}
function qD(e) {
	return e.hasAttribute(PD) ? !0 : !e.hasAttribute(FD) && null;
}
function JD(e) {
	return wD(e.value, oD(e), YD(e));
}
function YD(e) {
	return e.closest(`.${AD}`)?.getAttribute("data-ui-number-format") ?? null;
}
function XD(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function ZD(e, t) {
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
function QD(e) {
	let t = W(e) === "windowed" ? $D(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function $D(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function eO(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var tO = "application/x-ne-items", nO = null, rO = null;
function iO(e, t, n) {
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
function aO(e, t) {
	let n = _d(t);
	return n.includes(e) ? n.filter((t) => t === e || sO(t)) : [e];
}
function oO(e) {
	return !Hc(e, "data-ui-undraggable") && !k(e);
}
function sO(e) {
	return oO(e) && I(e) !== null;
}
function cO(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function lO(e, t, n = null) {
	nO = t, rO = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(tO, t.kind);
}
function uO(e) {
	return nO !== null && e.dataTransfer?.types.includes(tO) === !0 ? nO : null;
}
function dO() {
	let e = rO;
	nO = null, rO = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var fO = "data-ui-non-item";
function G(e) {
	let t = [];
	for (let n of e.children) pO(n) || t.push(n);
	return t;
}
function pO(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function mO(e) {
	return e === null ? [] : [e];
}
function hO(e) {
	return e.querySelector(`:scope > [${Pt}]`);
}
function gO(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(_i));
	let a = hO(e);
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
var _O = { ok: !1 }, vO = {
	ok: !0,
	value: null
}, yO = null;
function bO(e) {
	yO = e;
}
function xO(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Ji(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Ji(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return _O;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return _O;
			let t = a[u];
			if (u++, Ji(t.kind) === "Dynamic") {
				let n = TO(e, t.componentId);
				if (!n.ok) return _O;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return _O;
				let e = MO(s, t.value);
				if (!e.ok) return _O;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return _O;
		if (l) {
			let e = OO(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? _O : {
		ok: !0,
		value: s,
		scope: c
	};
}
function SO(e, t, n) {
	for (let r of t ?? []) {
		if (Ji(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function CO(e) {
	let t = DO(e, "IsContent");
	return t.ok && t.value === !0;
}
var wO = /* @__PURE__ */ new Set();
function TO(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return wO.has(n) || (wO.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), _O;
}
function EO(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = DO(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function DO(e, t) {
	return OO(e, t, !0);
}
function OO(e, t, n) {
	if (e == null) return _O;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return _O;
	let r = e, i = kO(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? _O : (n && yO?.(r, t), vO);
}
function kO(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = AO(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function AO(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function jO(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Ji(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Ji(e.kind) !== "Dynamic") {
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
function MO(e, t) {
	if (e == null || t == null) return _O;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : _O;
	if (typeof t != "string") return _O;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (PO(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return _O;
}
function NO(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (PO(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function PO(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var FO = /* @__PURE__ */ new WeakMap();
function IO(e) {
	let t = LO(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = FO.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = RO(e, n);
	return FO.set(t, {
		text: n,
		query: i
	}), i;
}
function LO(e) {
	let t = e.closest(C);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function RO(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function zO(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = IO(e);
	if (a === void 0 && o === null) {
		for (let t of G(e)) t.classList.remove(_i);
		return;
	}
	for (let n of G(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(_i);
			continue;
		}
		n.classList.toggle(_i, !BO(a, e, i, o));
	}
}
function BO(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => GO(e, t, n)) && (r?.filters ?? []).every((e) => dm(EO(t, e.itemProperty), e.operator, e.value));
}
function VO(e, t, n = null) {
	return (e?.filters ?? []).some((e) => KO(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function HO(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => KO(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function UO(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => WO(n.getItemValue(e), n.getItemValue(r), t));
}
function WO(e, t, n) {
	for (let r of n) {
		let n = qO(fm(EO(e, r.itemProperty)), fm(EO(t, r.itemProperty)));
		if (n !== 0) return $i(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function GO(e, t, n) {
	if (!KO(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return dm(EO(t, e.itemProperty), e.operator, r);
}
function KO(e, t, n, r) {
	return e == null || dm(r.get(e, []), t, n);
}
function qO(e, t) {
	if (e === t) return 0;
	let n = YO(e), r = YO(t);
	if (n !== r) return n - r;
	if (n === JO.Nothing) return 0;
	if (n === JO.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var JO = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function YO(e) {
	return e == null ? JO.Nothing : typeof e == "number" ? Number.isNaN(e) ? JO.Nothing : JO.Number : typeof e == "string" && e.trim().length === 0 ? JO.Nothing : Number.isNaN(Number(e)) ? JO.Text : JO.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var XO = /* @__PURE__ */ new WeakMap();
function ZO(e, t) {
	let n = XO.get(e), r = n === void 0 ? [...t] : QO(n, t);
	return XO.set(e, r), r;
}
function QO(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function $O(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function ek(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function tk(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function nk(e, t, n) {
	return ek(e, t), $O(e, t, n);
}
function rk(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function ik(e, t) {
	XO.set(e, [...t]);
}
function ak(e) {
	XO.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var ok = "ui-announcer", sk = 7e3, ck = null;
function lk(e, t = "polite") {
	(ck ?? uk(document.body)).announce(e, t);
}
function uk(e) {
	return ck = new fk(e), ck;
}
function dk(e, t) {
	lk({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var fk = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), sk), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${ok}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = ok, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, pk = "ui-tab-item";
function mk(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function hk(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? mk(e).parentElement : null;
}
function gk(e, t) {
	return Hc(mk(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var _k = ".ui-items-view__item, .ui-table__row", vk = "ui-row--dragging", yk = "--ui-row-drop-offset", bk = "move", xk = ".ui-items-view--wrap", Sk = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function Ck(e, t) {
	Tf(e, bk, { index: t });
}
function wk(e) {
	return {
		name: bk,
		registration: {
			dynamicParameters: (e) => {
				let t = Tk(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...ZD((t) => e === void 0 ? null : Ek(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function Tk(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function Ek(e, t) {
	let n = Tk(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = hk(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(_k), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, L(i), n);
	return o === null ? null : { pending: o };
}
var Dk = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new Ok(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : I(t.row);
		if (t === null || n === null) return;
		let r = Pk(t.root, t.row);
		if (r === null ? !Fk(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Qd(t.root, Hk(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(od), n = t?.parentElement ?? null, r = n?.closest(F) ?? null;
		if (t === null || n === null || r === null || !t.matches(_k) || !n.hasAttribute("data-ui-items-host") || O(r) || !sO(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Na(e);
		return this.services === void 0 || n === null ? !1 : HO(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, IO(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : I(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = iO(t.root, n, aO(t.row, Hk(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => I(e) ?? e);
		rv(e, t.root, r, vk, L(t.row), a, cO(i, t.moves)), lO(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = Mk(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : Bk(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && Rk(this.marked.place, i) && this.marked.offset === a) && (Uk(t.root, i, a), this.marked = {
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
		if (Ik(t) !== Ik(e.row)) return null;
		let i = Ak(r ?? Nk(e.host, this.services?.keysOf), L(e.row), L(t), n);
		return i === null ? null : i + QD(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && ov(e, t.host) && (Uk(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = Mk(t.host, e.target, e, Lk(t.root, t.host), Hk(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Ck(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (iv(e.root, vk), Uk(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !M(e, { alt: !0 }) || !Sk.has(e.key) || !(e.target instanceof Element)) return;
		let t = Ud(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Td(t.root), r = n === null ? null : Lk(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = Hk(n), o = qd(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(xk) ? Sf(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (Ck(o, l), dk(l + 1, $D(n, "data-ui-window-total") ?? QD(n) + Nk(n, this.services?.keysOf).length));
	}
}, Ok = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = Hk(t);
		return this.view = {
			host: t,
			flow: Lk(e, t),
			rows: n,
			boxes: n.map((e) => (I(e) ?? e).getBoundingClientRect()),
			order: Nk(t, this.keysOf)
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
		e.some(kk) && this.drop();
	}
};
function kk(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function Ak(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = jk(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function jk(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function Mk(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(od);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(od) ?? null;
	if (o ??= Vk(i, n, a), o === null) return null;
	let s = (I(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && zk(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function Nk(e, t) {
	switch (W(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(L)];
		case "windowed": return G(e).map(L);
		default: return ZO(e, G(e)).map(L);
	}
}
function Pk(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Fk(e, t) {
	return Mu(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Ik(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Lk(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function Rk(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function zk(e, t, n) {
	if (Ik(e) !== Ik(t)) return !1;
	if (!n.across) return !0;
	let r = (I(e) ?? e).getBoundingClientRect(), i = (I(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Bk(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !zk(t.anchor, r, n)) return -1;
	let i = (I(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (I(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Vk(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (I(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function Hk(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(od) && I(e) !== null);
}
function Uk(e, t, n = 0) {
	let r = t === null ? null : I(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(yk));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(yk) !== i && r.style.setProperty(yk, i);
}
function Wk(e) {
	e.classList.remove(vk), e.querySelector(`:scope > [${y}]`)?.classList.remove(vk);
}
//#endregion
//#region src/interactions/tree-drop.ts
var Gk = "--ui-tree-drop-depth";
function Kk(e) {
	return e.querySelector(`.${sr}`);
}
function qk(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute(yr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Jk(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || qk(n, Kk(n));
}
function Yk(e, t) {
	let n = Kk(e);
	if (qk(e, n)) return L(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return Jk(r, t) ? r : null;
}
function Xk(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${cr}]`)) n !== t && (n.removeAttribute(cr), n.style.removeProperty(Gk));
	t !== null && (t.setAttribute(cr, n), r === void 0 ? t.style.removeProperty(Gk) : t.style.setProperty(Gk, String(r)));
}
function Zk(e, t, n) {
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
function Qk(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = $k(e, r, n);
	return i === null || !eA(e, i.parent) ? null : i;
}
function $k(e, t, n) {
	if (n === "in") {
		let n = Zk(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Zk(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: nA(e, n, t.parent, !1)
		};
	}
	let r = tA(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function eA(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function tA(e, t) {
	return e.filter((e) => e.parent === t);
}
function nA(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = tA(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function rA(e, t, n) {
	let r = tA(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? nA(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var iA = "drop:", aA = "ui-row--cut", oA = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, sA = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, cA = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function lA(e) {
	return {
		dynamicParameters: (e) => {
			let t = uA(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...ZD((t) => dA(e, t), (t) => e?.settle(t))
	};
}
function uA(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function dA(e, t) {
	let n = uA(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var fA = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new Ok(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = uO(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = pA(t, r, mA(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Td(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? Mk(r, t, n, i.flow, i.rows, i.boxes) : hA(i.rows);
			return {
				index: ((a === null ? null : jk(i.order, L(a.anchor), a.side)) ?? i.order.length) + QD(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : Uk(e, a, Bk(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = gA(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Td(e) : _A(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Xk(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), sv(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), sv(e, !1), e.matches(".ui-items-view, .ui-table") ? Uk(e, null) : e.classList.contains("ui-tree") && Xk(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && ov(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), dO(), this.drop(t.drag, t.target, t.effect, t.landing));
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
		t.dispatchEvent(new CustomEvent(iA + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), dO();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !j(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo());
				return;
			}
			yu(e.target) || (Il(cA, e) ? this.paste(e, e.target) : Il(oA, e) ? this.take(e, e.target, !0) : Il(sA, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (I(e) ?? e).classList.remove(aA);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : pA(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Hd(t), a = i === null ? null : Td(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = Hk(a), s = i.row ?? qd(o), c = s === null || !sO(s) ? null : iO(i.root, a, aO(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (I(e) ?? e).classList.add(aA);
	}
};
function pA(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function mA(e) {
	return Gl() ? e.altKey : e.ctrlKey;
}
function hA(e) {
	let t = Jd(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function gA(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Yk(n, (t) => _A(e, t));
}
function _A(e, t) {
	return e.querySelector(`.${or}[${b}="${Bi(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function vA(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = SA(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < CA(e.start).getTime() ? {
		start: SA(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: SA(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function yA(e, t, n) {
	if (t === null || n === null) return !1;
	let r = CA(e).getTime();
	return r > CA(t).getTime() && r < CA(n).getTime();
}
function bA(e, t, n) {
	return !n && yA(e, t.start, t.end);
}
function xA(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function SA(e, t) {
	return gs(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function CA(e) {
	return gs(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", wA = "ui-calendar", TA = `.${K}, .${wA}`, EA = "ui-temporal-input__value-input", DA = "ui-temporal-input__end-value-input", OA = "data-ui-temporal-range", kA = "data-ui-temporal-end", AA = "data-ui-temporal-mode", jA = "data-ui-temporal-format", MA = "data-ui-temporal-default-format", NA = "data-ui-temporal-min", PA = "data-ui-temporal-max", FA = "data-ui-temporal-step", IA = "data-ui-temporal-step-unit", LA = "data-ui-temporal-marked-days", RA = "data-ui-temporal-marked-only", zA = "data-ui-temporal-page-culture", BA = "data-ui-temporal-months", VA = "data-ui-temporal-months-genitive", HA = "data-ui-temporal-months-short", UA = "data-ui-temporal-daynames", WA = "data-ui-temporal-weekdays", GA = "data-ui-temporal-first-day", KA = "data-ui-temporal-am", qA = "data-ui-temporal-pm", JA = /* @__PURE__ */ new Set([
	jA,
	MA,
	NA,
	PA,
	BA,
	KA,
	qA,
	LA,
	RA
]), YA = 2e3;
function XA(e) {
	let t = e.getAttribute(AA);
	return t === "time" || t === "date-time" ? t : "date";
}
function ZA(e) {
	let t = e.getAttribute(jA);
	return t === null || t.trim().length === 0 ? e.getAttribute(MA) ?? "" : t;
}
function QA(e) {
	let t = e.getAttribute(IA), n = Math.max(1, Math.trunc(Number(e.getAttribute(FA))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function $A(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function ej(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function tj(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function nj(e) {
	return {
		monthNames: rj(e, BA),
		monthGenitiveNames: rj(e, VA),
		abbreviatedMonthNames: rj(e, HA),
		dayNames: rj(e, UA),
		abbreviatedDayNames: rj(e, WA),
		amDesignator: e.getAttribute(KA) ?? "AM",
		pmDesignator: e.getAttribute(qA) ?? "PM"
	};
}
function rj(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function ij(e, t) {
	e.hasAttribute(zA) && (cj(e, VA, t.monthGenitiveNames.join("|")), cj(e, HA, t.abbreviatedMonthNames.join("|")), cj(e, UA, t.dayNames.join("|")), cj(e, WA, t.abbreviatedDayNames.join("|")), cj(e, BA, t.monthNames.join("|")), cj(e, KA, t.amDesignator), cj(e, qA, t.pmDesignator), cj(e, MA, sj(XA(e), QA(e), t)));
}
function aj(e) {
	for (let t = 0; t < e.length;) {
		let n = us(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function oj(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(js(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function sj(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ts(n, r);
}
function cj(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function lj(e) {
	return e.hasAttribute(OA);
}
function uj(e) {
	return e !== null && e.hasAttribute(kA);
}
function dj(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = fj(e, t);
	return n === null ? null : Nj(n.value, XA(e));
}
function fj(e, t) {
	return e.querySelector(`.${t ? DA : EA}`);
}
function pj(e, t) {
	let n = e.getAttribute(t) ?? "", r = Nj(n, XA(e)), i = Cj(n);
	if (r === null || i === null) return r;
	let a = Sj(e, !1), o = /* @__PURE__ */ new Date(mj(r) - hj(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + hj(a) * 6e4);
		return gs(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return gj(e) ? r : o;
}
function mj(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function hj(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function gj(e) {
	return (fj(e, !1)?.value.trim() ?? "").length > 0 || (fj(e, !0)?.value.trim() ?? "").length > 0;
}
function _j(e) {
	let t = pj(e, NA), n = pj(e, PA), r = (e.getAttribute(LA) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : Pj(t, "date"),
		max: n === null ? null : Pj(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(RA)
	};
}
function vj(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function yj(e, t, n) {
	Tj(e, t === null ? "" : bj(e, t, n), n);
}
function bj(e, t, n) {
	let r = XA(e), i = Pj(t, r);
	return r === "date-time" ? i + (Sj(e, n) ?? wj(t)) : i;
}
var xj = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function Sj(e, t) {
	return Cj(fj(e, t)?.value ?? "") ?? Cj(fj(e, !t)?.value ?? "");
}
function Cj(e) {
	return xj.exec(e.trim())?.[1] ?? null;
}
function wj(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${Fj(Math.floor(n / 60))}:${Fj(n % 60)}`;
}
function Tj(e, t, n) {
	let r = fj(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ej(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : bs(n, ZA(e), nj(e));
	return r === null ? n : Pj(hs(r), XA(e));
}
function Dj(e) {
	if (!lj(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (xA(t) === t) return;
	let n = fj(e, !1)?.value ?? "";
	Tj(e, fj(e, !0)?.value ?? "", !1), Tj(e, n, !0);
}
function Oj(e) {
	let t = pj(e, NA), n = pj(e, PA);
	if (t === null && n === null) return null;
	for (let r of lj(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: as(t, ZA(e), nj(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: as(n, ZA(e), nj(e)) }
		};
	}
	return null;
}
function kj(e) {
	return jj(e, Aj(e, /* @__PURE__ */ new Date()));
}
function Aj(e, t) {
	let n = pj(e, NA), r = pj(e, PA);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function jj(e, t) {
	let n = QA(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Mj = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Nj(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Mj.exec(n);
		return e === null ? null : new Date(YA, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = ms(n);
	return r === null ? null : hs(r);
}
function Pj(e, t) {
	let n = `${Fj(e.getHours())}:${Fj(e.getMinutes())}:${Fj(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Fj(e.getMonth() + 1)}-${Fj(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Fj(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var Ij = "ui-temporal-input__day", Lj = "ui-temporal-input__month", Rj = 3, zj = "data-ui-temporal-nav", Bj = "data-ui-temporal-day", Vj = 366;
function Hj(e) {
	let t = dj(e);
	return {
		view: fM(t ?? Aj(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Uj(e, t, n, r) {
	let i = dM("div", `${K}__calendar`), a = dM("div", `${K}__calendar-header`), o = _j(e), s = uM("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = Wj(o, t, -1) === null, a.append(s);
	let c = uM("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = uM("next", "›", D.text("ui.picker.next"));
	return l.disabled = Wj(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Jj(e, t, n, r, o) : Yj(t, n, o)), i;
}
function Wj(e, t, n) {
	let r = t.pane === "months", i = hM(t.view, n * (r ? 12 : 1));
	return Kj(e, Gj(i, r ? 4 : 7)) ? qj(e, i) : null;
}
function Gj(e, t) {
	return Pj(e, "date").slice(0, t);
}
function Kj(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function qj(e, t) {
	let n = Gj(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : Nj(r, "date");
	return i === null ? t : fM(i);
}
function Jj(e, t, n, r, i) {
	let a = sM(e), o = dM("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = dM("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = dM("div", `${K}__days`), c = CA(/* @__PURE__ */ new Date()), l = lj(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = pM(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = mM(f, e), r = Pj(n, "date"), a = dM("button", Ij);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(Bj, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${Ij}--outside`), gM(n, c) && (a.classList.add(`${Ij}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${Ij}--marked`);
		let o = u !== null && gM(n, u), p = d !== null && gM(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${Ij}--selected`), l && (o || p) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), bA(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${Ij}--within`), vj(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = dM("div", `${K}__calendar-pane`);
	return p.append(o, s), p;
}
function Yj(e, t, n) {
	let r = dM("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = dM("button", Lj);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(zj, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Lj}--selected`), a.setAttribute("aria-current", "true")), Kj(n, Gj(gs(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return N(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function Xj(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : Zj(t, r % Rj);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function Zj(e, t) {
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
			offset: Rj,
			step: Rj
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
function Qj(e) {
	let t = dM("div", `${K}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function $j(e, t, n) {
	let r = _j(e);
	if (n.startsWith("month:")) {
		let i = gs(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Kj(r, Gj(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = iM(r, rM(i, t.focusedDay ?? dj(e) ?? Aj(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = Wj(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Wj(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function eM(e, t, n) {
	if (lj(e)) {
		tM(e, t, n);
		return;
	}
	let r = SA(n, dj(e) ?? kj(e));
	t.focusedDay = r, t.view = fM(r), yj(e, r, !1);
}
function tM(e, t, n) {
	let r = vA({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, SA(n, kj(e)));
	t.focusedDay = r.end ?? r.start, t.view = fM(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, yj(e, r.end, !0), yj(e, r.start, !1);
}
function nM(e, t, n, r = !1) {
	let i = aM(n), a = oM(t, n, sM(e), r);
	if (a === null) return null;
	let o = _j(e);
	if (i === 0) return iM(o, a);
	let s = a;
	for (let e = 0; e < Vj; e++) {
		if (vj(o, Pj(s, "date"))) return s;
		s = mM(s, i);
	}
	return t;
}
function rM(e, t) {
	let n = gs(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return gs(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function iM(e, t) {
	let n = Pj(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : Nj(r, "date");
	return i === null ? t : SA(i, t);
}
function aM(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function oM(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return mM(e, -1);
		case "ArrowRight": return mM(e, 1);
		case "ArrowUp": return mM(e, -7);
		case "ArrowDown": return mM(e, 7);
		case "PageUp": return hM(e, r ? -12 : -1);
		case "PageDown": return hM(e, r ? 12 : 1);
		case "Home": return mM(e, -i);
		case "End": return mM(e, 6 - i);
		default: return null;
	}
}
function sM(e) {
	let t = Number(e.getAttribute(GA));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function cM(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Ij}`)];
	if (i.length === 0) return;
	let a = Pj(CA(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (N(i, o), r && R(o));
}
function lM(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Ij}`)) {
		let e = Nj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${Ij}--preview`, e !== null && n !== null && r !== null && yA(e, n, mM(r, 1)));
	}
}
function uM(e, t, n) {
	let r = dM("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(zj, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function dM(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function fM(e) {
	return gs(e.getFullYear(), e.getMonth(), 1);
}
function pM(e, t) {
	let n = fM(e);
	return mM(n, -((n.getDay() - t + 7) % 7));
}
function mM(e, t) {
	return gs(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function hM(e, t) {
	let n = gs(e.getFullYear(), e.getMonth() + t, 1), r = gs(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return gs(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function gM(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var _M = "ui-temporal-input__field", vM = "ui-temporal-input__popup", yM = "ui-temporal-input--open", bM = "ui-calendar__body", xM = "ui-temporal-input__time-cell", SM = "ui-temporal-input__time-column", CM = 140, wM = "data-ui-temporal-toggle", TM = "data-ui-temporal-unit", EM = "data-ui-temporal-cell", DM = "data-ui-temporal-centred", OM = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new s_({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(yM), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(yM);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(TA)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = ja(e.components, TA), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && kM(e) && this.states.set(e, Hj(e)), this.isShowing(e) && this.renderSurface(e);
		}), B(this.root, TA, { attributeFilter: [...JA] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), B(this.root, TA, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) kM(e) && AM(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(TA)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) ij(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || kM(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${bM}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && AM(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = vs(ZA(t), UM()), n = ls(ZA(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${_M}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = fj(t, uj(r))?.value ?? "", a = Nj(i, XA(t));
				if (a !== null) {
					r.value = as(a, ZA(t), nj(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(_M)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : fj(t, uj(e.target));
		if (t === null || n === null) return;
		let r = Ej(t, e.target.value), i = Nj(r, XA(t)), a = i === null ? r : bj(t, i, uj(e.target));
		if (jM(t, a)) {
			let n = q(t, uj(e.target));
			e.target.value = n === null ? "" : as(n, ZA(t), nj(t));
			return;
		}
		uj(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Dj(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(_M)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && lj(t) && (this.getState(t).activeEnd = uj(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !lj(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Bj}]`) : null, r = this.getState(t), i = n === null ? null : Nj(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, lM(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${Bj}], .${xM}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(xM) ? KM(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = AM(e), r = Nj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, N([...n.querySelectorAll(`.${Ij}`)], t), ap(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(_M)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${wM}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${zj}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${Bj}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${EM}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${TM}]`)?.getAttribute(TM);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(EM)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if ($j(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, kj(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), lj(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = Nj(t, "date");
		if (n === null || A(e) || O(e) || !vj(_j(e), t)) return;
		let r = this.getState(e);
		kM(e) && lj(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = fj(e, !1), a = `${i?.value ?? ""}|${fj(e, !0)?.value ?? ""}`;
		eM(e, r, n), kM(e) && `${i?.value ?? ""}|${fj(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = lj(e) && this.getState(e).activeEnd === "end", i = tj(q(e, r) ?? kj(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		yj(e, t, n), Dj(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "ArrowDown" && M(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(_M)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), uj(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(xM)) {
			M(e) && JM(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			M(e) && qM(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !M(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = Nj(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Pj(n, "date"));
			return;
		}
		let r = nM(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = fM(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${SM}`);
		n === null || !t.contains(n) || (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, CM)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${SM}`), n = t?.getAttribute(TM) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Wy(this.wheelTurns.get(n) ?? 0, Uy(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${xM}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${xM}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${xM}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(EM)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || A(e) || O(e)) return;
		let n = Number(t.getAttribute(DM));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(TM), i = RM(t);
		if (!(r === null || i === null || i.classList.contains(`${xM}--selected`))) {
			if (i.matches(":disabled")) {
				IM(e);
				return;
			}
			this.chooseTime(e, r, Number(i.getAttribute(EM)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${vM}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = lj(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? dj(e);
		r.pane = "days", r.view = fM(i ?? Aj(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${wM}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => GM(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Hj(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = AM(e);
		if (n === null) return;
		let r = kM(e), i = XA(e), a = this.getState(e), o = nj(e), s = lj(e), c = q(e, s && a.activeEnd === "end"), l = zM(n), u = BM(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Qj(a)), r) n.append(Uj(e, a, o, c));
		else {
			let t = dM("div", `${K}__panes`);
			t.append(Uj(e, a, o, c)), i === "date-time" && t.append(MM(e, c)), n.append(t, HM(i));
		}
		let f = u === null ? null : n.querySelector(`[${zj}="${Bi(u)}"]:not(:disabled)`);
		cM(n, a, c, t || d && l === null && f === null), lM(e, a), r || (FM(n), IM(n), VM(n, l)), f !== null && R(f), r || this.popups.reposition(e);
	}
};
function kM(e) {
	return e.classList.contains(wA);
}
function AM(e) {
	return e.querySelector(`.${kM(e) ? bM : vM}`);
}
function jM(e, t) {
	let n = _j(e), r = n.markedOnly ? Nj(t, XA(e)) : null;
	return r !== null && !n.marked.has(Pj(r, "date"));
}
function MM(e, t) {
	let n = QA(e), r = dM("div", `${K}__time`), i = dM("div", `${K}__time-columns`);
	for (let r of NM(n)) i.append(PM(e, r, $A(n, r), t));
	return r.append(i), r;
}
function NM(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function PM(e, t, n, r) {
	let i = dM("div", SM);
	i.setAttribute(TM, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : ej(r, t), s = t === "hour" && aj(ZA(e)), c = nj(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = dM("button", xM);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? oj(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(EM, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${xM}--selected`), QM(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function FM(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function IM(e) {
	for (let t of e.querySelectorAll(`.${SM}`)) {
		let e = t.querySelector(`.${xM}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, LM(t, e), t.setAttribute(DM, String(t.scrollTop));
	}
}
function LM(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function RM(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${xM}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function zM(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(xM) ? null : t.closest(`.${SM}`)?.getAttribute(TM) ?? null;
}
function BM(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(zj) : null;
}
function VM(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${SM}[${TM}="${t}"]`)?.querySelector(`.${xM}--selected`) ?? null;
	n !== null && R(n);
}
function HM(e) {
	let t = dM("div", `${K}__popup-footer`);
	return t.append(uM("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(uM("clear", D.text("ui.picker.clear"))), t.append(uM("done", D.text("ui.picker.done"))), t;
}
function UM() {
	return {
		year: WM("ui.picker.letter.year", _s.year),
		month: WM("ui.picker.letter.month", _s.month),
		day: WM("ui.picker.letter.day", _s.day),
		hour: WM("ui.picker.letter.hour", _s.hour),
		minute: WM("ui.picker.letter.minute", _s.minute),
		second: WM("ui.picker.letter.second", _s.second)
	};
}
function WM(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function GM(e, t) {
	for (let n of e.querySelectorAll(`.${_M}`)) if (uj(n) === t) return n;
	return e.querySelector(`.${_M}`);
}
function KM(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(xM) && ap(e);
}
function qM(e, t) {
	if (!Pu(e.key, "both")) return;
	e.preventDefault();
	let n = Xj(t, e.key);
	Iu([...n?.parentElement?.children ?? []], n);
}
function JM(e) {
	let t = e.target, n = t.closest(`.${SM}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? XM(n, e.key === "ArrowRight" ? 1 : -1) : YM(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), ZM(r));
}
function YM(e, t, n) {
	let r = [...e.querySelectorAll(`.${xM}`)];
	return n === "PageUp" || n === "PageDown" ? bf(n, r.filter(P), t, "vertical") ?? t : Nu({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function XM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${SM}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${xM}--selected`) ?? r.querySelector(`.${xM}:not(:disabled)`);
}
function ZM(e) {
	let t = e.closest(`.${SM}`);
	t !== null && (LM(t, e), t.setAttribute(DM, String(t.scrollTop)));
}
function QM(e, t, n, r) {
	let i = pj(e, NA), a = pj(e, PA);
	if (i === null && a === null) return !1;
	let o = tj(r ?? kj(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var $M = `[${Vr}="${Ur}"] [${Hr}]`, eN = "ui-theme-switcher__label-text--current";
function tN() {
	let e = document.documentElement.getAttribute(Lr);
	return e === "light" || e === "dark" ? e : "auto";
}
function nN(e, t) {
	let n = e.getAttribute(Hr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(eN, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var rN = new qw();
function iN(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(P) ?? null);
	o !== null && N(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && xp(t.popup, n, i), s;
}
function aN(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = Jw(e);
	if (r !== null) return e.preventDefault(), Iu(t, sN(t, n, r)), !0;
	if (!Pu(e.key, "vertical") || !M(e)) return !1;
	let i = Nu({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Iu(t, i), !0;
}
var oN = {
	character: Jw,
	entry: sN
};
function sN(e, t, n) {
	let r = e.filter(P), i = r[0]?.parentElement;
	return i == null ? null : rN.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Cg,
		context: i
	});
}
function cN(e, t) {
	e === document.activeElement || !P(e) || (N(t, e), ap(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var lN = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new s_({
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
		return e.getAttribute(this.parts.attribute) === Ur;
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
		iN(this.menus, {
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
		if (i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e)) {
			e.preventDefault(), this.open(n, i, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(n) && aN(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && cN(t, this.choicesOf(n));
	}
}, uN = `[${Vr}="${Ur}"]`, dN = "ui-theme-switcher__choice", fN = class {
	options;
	root;
	list = new lN({
		attribute: Vr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: dN,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${wi}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Lr]
		}), B(this.root, uN, {
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
			e.preventDefault(), this.apply(pN() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${dN}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Hr));
			return;
		}
		let r = e.target.closest(`.${wi}`);
		r === null || O(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: Gi.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = tN();
		if (e === void 0) {
			for (let e of this.root.querySelectorAll($M)) nN(e, t);
			return;
		}
		for (let n of e) for (let e of n.querySelectorAll(`[${Hr}]`)) nN(e, t);
	}
};
function pN() {
	let e = tN();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var mN = `.ui-language-switcher__trigger, .${wi}`, hN = "ui-language-switcher__label-text", gN = "ui-language-switcher__label-text--current", _N = "ui-language-switcher__label-text--page", vN = "ui-language-switcher__choice", yN = "ui.language.switch", bN = "ui.language.current", xN = class {
	options;
	root;
	list = new lN({
		attribute: Br,
		menuClass: "ui-language-switcher__menu",
		choiceClass: vN,
		openClass: "ui-language-switcher--open",
		triggerSelector: mN
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vN}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Wr));
			return;
		}
		let r = e.target.closest(mN);
		if (r === null || O(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = D.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.list.isOpen(n) ? this.list.close(n) : this.opensList(n, i) && this.list.open(n, r);
	}
	opensList(e, t) {
		return this.list.isField(e) ? t.length > 1 : t.length > 2;
	}
	choose(e, t) {
		this.list.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Gi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Br}]`)) {
			let n = t.querySelector(`:scope > :is(${mN})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${hN}`)) {
				let n = t.getAttribute(Wr) === e;
				t.classList.toggle(gN, n), t.classList.contains(_N) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = SN(Ec(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [yN, {
				language: CN(r, e),
				code: wN(e),
				other: CN(r, o),
				otherCode: wN(o)
			}] : [bN, {
				language: CN(r, e),
				code: wN(e)
			}];
			D.write(n, "aria-label", s, c), a && D.write(t, Re, s, c);
		}
	}
};
function SN(e) {
	return E(e) && (e.key === yN || e.key === bN);
}
function CN(e, t) {
	let n = e.find((e) => e.getAttribute(Wr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return wN(t);
	}
}
function wN(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var TN = `${Me}__button`, EN = `${Me}__more`, DN = `${TN}--icon`, ON = "ui-text__icon", kN = `.ui-button__content .${ON}`, AN = ".ui-button__content .ui-text__title", jN = /* @__PURE__ */ new WeakMap();
function MN(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Bn)) NN(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(zn) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function NN(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function PN(e, t) {
	let n = t.entries.map((e) => FN(e, t));
	return t.more && t.openMore !== void 0 && n.push(LN(t.openMore)), e.replaceChildren(...n), n;
}
function FN(e, t) {
	let n = RN(TN), r = BN(e), i = IN(e);
	return i === null ? n.textContent = r : (n.classList.add(DN), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(mi), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), jN.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function IN(e) {
	let t = e.querySelector(kN);
	if (t === null || !t.className.split(" ").some(lo)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(ON), n.setAttribute(ao, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(oo);
	return r.length > 0 && n.style.setProperty(oo, r), n;
}
function LN(e) {
	let t = RN(`${TN} ${EN}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function RN(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Di}`, t.tabIndex = -1, t;
}
function zN(e) {
	return jN.get(e) ?? null;
}
function BN(e) {
	return e.querySelector(AN)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var VN = 500, HN = 10, UN = /* @__PURE__ */ new WeakSet();
function WN(e) {
	return UN.has(e);
}
var GN = class {
	holds;
	answer;
	closeMenu;
	press = null;
	answered = null;
	openedAt = null;
	slid = !1;
	dragging = !1;
	constructor(e) {
		this.holds = e.holds, this.answer = e.answer, this.closeMenu = e.closeMenu ?? (() => void 0), e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), e.root.addEventListener("dragend", () => this.endDrag(), !0), e.root.addEventListener("drop", () => this.endDrag(), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.openedAt = null, this.slid = !1, this.dragging = !1, this.press !== null) {
			this.cancel();
			return;
		}
		if (t.pointerType !== "touch" || !(e.target instanceof Element) || !this.holds(e.target)) return;
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0;
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), VN)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > HN && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > HN && this.cancel();
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
		if (this.answer !== void 0) {
			this.answered = this.answer(e.target) ? e.target : null;
			return;
		}
		let t = new MouseEvent("contextmenu", {
			bubbles: !0,
			cancelable: !0,
			button: 2,
			clientX: e.x,
			clientY: e.y
		});
		UN.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (UN.has(e)) return;
		if (this.answered !== null && e.target instanceof Node && this.answered.contains(e.target)) {
			e.preventDefault(), e.stopImmediatePropagation();
			return;
		}
		let t = this.press;
		if (this.answer !== void 0 && t !== null && e.target instanceof Node && t.target.contains(e.target)) {
			e.preventDefault(), this.cancel(), this.fire(t);
			return;
		}
		this.cancel();
	}
	handleDragStart(e) {
		let t = this.press, n = e.target;
		t === null || !(n instanceof Node) || !(n.contains(t.target) || t.target.contains(n)) || setTimeout(() => {
			e.defaultPrevented || (this.press === t && this.cancel(), this.fire(t), this.dragging = this.openedAt !== null);
		});
	}
	handleDragOver(e) {
		let t = e, n = this.openedAt;
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > HN && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, KN = [
	Am("md"),
	Am("xl"),
	Am("xxl")
], qN = {
	md: Am("md"),
	xl: Am("xl"),
	xxl: Am("xxl")
}, JN = Am("md");
function YN(e, t) {
	return XN(e) && !(e.hasAttribute(Dn(t)) && !QN(e, t) && ZN(JN));
}
function XN(e) {
	let t = e.getAttribute(Tn);
	if (t === null) return !1;
	let n = qN[t];
	return n === void 0 || !ZN(n);
}
function ZN(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function QN(e, t) {
	return e.querySelector(`:scope > [${jn}="${Bi(t)}"][${On}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var $N = "ne.ui", eP = "boot", tP = /* @__PURE__ */ new Set(), nP = class {
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
		let r = this.resolveKey(e, eP);
		if (r !== null) try {
			let e = rP(window.localStorage.getItem(r));
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
			return tP.has(n) || (tP.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${$N}:${n}:${t}`;
	}
};
function rP(e) {
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
var iP = "menu-current", aP = `[${un}]`;
function oP(e) {
	for (let t = e.closest(aP); t !== null; t = t.parentElement?.closest(aP) ?? null) cP(t);
}
function sP(e) {
	for (let t of e.querySelectorAll(aP)) cP(t);
	oP(e);
}
function cP(e) {
	let t = e.querySelector(`.${Fn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(pn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var lP = "menu-icons", uP = "ui-menu__host", dP = `:scope > :not([${hn}]) > .${S}[${Mi}]`;
function fP(e) {
	let t = e.closest(`.${uP}`);
	t !== null && mP(t);
}
function pP(e) {
	for (let t of e.querySelectorAll(`.${uP}`)) mP(t);
}
function mP(e) {
	let t = e.querySelector(dP) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var hP = "ui-menu__submenu", gP = un, _P = fn, vP = "data-ui-menu-flyout", yP = `[${vP}], ${bi}`, bP = "data-ui-menu-unfolded", xP = dn, SP = "data-ui-menu-rail-list", CP = "left-side", wP = "[data-ui-root]", TP = "menu-open-group", EP = z.normal * 5, DP = Ze("click"), OP = class {
	root;
	store = new nP();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new s_({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(_P, ""), t.setAttribute(vP, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(_P), queueMicrotask(() => Dm(t, EP, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(vP);
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
		NP(t), this.reconcileEach(t);
		for (let e of t) sP(e), pP(e);
		B(this.root, `.${Nn}`, {
			childList: !0,
			attributeFilter: [ln]
		}, (e) => {
			NP(e), this.reconcileEach(e);
			for (let t of e) sP(t), pP(t);
		});
		for (let e of this.root.querySelectorAll(`[${gP}]`)) kP(e);
		if (B(this.root, `[${gP}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [_P]
		}, (e) => {
			for (let t of e) kP(t);
		}), typeof matchMedia == "function") for (let e of KN) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		B(this.root, wP, { attributeFilter: [Dn(CP)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${kn}] .${Nn}`);
		NP(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = zP(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), AP(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(bP, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${gP}]`)) kP(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Fn}`), e);
		if (t !== null && !t.hasAttribute(xP)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, TP), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && PP(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Nn}`);
		a !== null && (RP(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Ln);
		if (e.setAttribute(bP, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(_P);
			return;
		}
		if (t.hasAttribute(_P)) {
			t.removeAttribute(_P), n || this.store.write(e, TP, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, TP, t.getAttribute(b));
	}
	openInline(e) {
		e.setAttribute(_P, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${gP}][${_P}]`)) t.hasAttribute(xP) || t.removeAttribute(_P);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		AP(e), this.closeGroups(e);
		let a = n.closest(yP) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${jP(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Nn}`);
		o !== null && !Qf() && xp(o, FP(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${gP}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(zn) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${gP}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${hP}`);
	}
};
function kP(e) {
	let t = e.querySelector(`:scope > .${S}`);
	t !== null && (t.setAttribute(DP, ""), t.setAttribute(Qe, ""), t.setAttribute("aria-expanded", e.hasAttribute(_P) ? "true" : "false"), RP(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function AP(e) {
	for (let t of e.querySelectorAll(`[${vP}]`)) t.removeAttribute(vP);
}
function jP(e) {
	return MP(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function MP(e) {
	let t = e.closest(`[${On}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && YN(t.parentElement, CP);
}
function NP(e) {
	for (let t of e) {
		let e = t.closest(`[${kn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(SP) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && YN(e.parentElement, CP);
		t.classList.toggle(In, !n), t.toggleAttribute(SP, n);
	}
}
function PP(e) {
	let t = e.closest(`.${S}`);
	return t !== null && t.matches(Bn) && !t.matches(Vn) && !O(t);
}
function FP(e) {
	let t = [];
	for (let n of nd(e)) {
		t.push(n);
		let e = n.matches(zn) ? n.parentElement : null, r = e === null || !e.hasAttribute(_P) || RP(e) ? null : e.querySelector(`:scope > .${hP} > .${Nn}`);
		r !== null && t.push(...FP(r));
	}
	return t;
}
function IP(e) {
	let t = LP(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || RP(t) ? e : IP(n);
}
function LP(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(hP) && t.parentElement?.hasAttribute(gP) === !0 ? t.parentElement : null;
}
function RP(e) {
	let t = e.closest(`.${Nn}`);
	return e.hasAttribute(xP) || t !== null && zP(t);
}
function zP(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var BP = "tabs:rename", VP = "tabs:pin", HP = "tabs:unpin", UP = "tabs:close", WP = "tabs:delete";
function GP(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function KP(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[BP, e.rename && t.renamable],
		[VP, e.pin && !t.pinned],
		[HP, e.pin && t.pinned],
		[UP, e.close && !e.delete && n],
		[WP, e.delete && n]
	]);
}
function qP(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function JP(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var YP = Se, XP = "ui-context-menu--open", ZP = `${Me}--strip`, QP = `.${Me}:not(.${ZP}) > .${EN}`, $P = "ui-context-menu-opening", eF = null, tF = /* @__PURE__ */ new WeakSet();
function nF(e) {
	eF = e;
}
var rF = class {
	root;
	components;
	closed = null;
	menus = new s_({
		show: ({ popup: e }) => e.classList.add(XP),
		hide: ({ popup: e }, t) => {
			e.classList.remove(XP), this.closed = e, t === "outside" && xF();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new GN({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !yu(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !Qf() && !WN(e), n = (t ? oF() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = iF(n);
		if (r === null) return;
		e.preventDefault();
		let i = mF(e) ? n : null, a = n.closest(QP), o = t ? sF(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		tF.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${ZP}`)?.remove(), hF(t), i !== null && gF(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && vF(t), this.closed !== null && (Em(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Zf(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : Sp(s, this.components)) ?? Sp(e, this.components)
		}) && (c === null && Ph(t, n, r), bF(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && PP(e.target) && this.menus.close();
	}
};
function iF(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		if (!uF(n, e) || O(n)) continue;
		if (CF(n)) return null;
		let r = lF(n, e).find((t) => fF(t, e, !1));
		if (r !== void 0) return {
			owner: n,
			menu: r
		};
	}
	return null;
}
var aF = `[${Ce}]`;
function oF() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Hd(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Yd(t.root);
	return n === null ? t.root : cF(n);
}
function sF(e) {
	let t = e.closest(od);
	return t === null ? e : I(t) ?? t;
}
function cF(e) {
	if (e.matches(aF)) return e;
	for (let t of e.querySelectorAll(aF)) if (t.closest(od) === e) return t;
	return e;
}
function lF(e, t) {
	return dF(e, t).map((t) => SF(e, t)).filter((e) => e !== null);
}
function uF(e, t) {
	return dF(e, t).some((t) => SF(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function dF(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function fF(e, t, n) {
	let r = new CustomEvent($P, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function pF(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || O(n) || CF(n) || r !== null && n.contains(r) ? null : lF(n, e).find((n) => fF(n, e, t)) ?? null;
}
function mF(e) {
	let t = e.pointerType;
	return WN(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : $f();
}
function hF(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function gF(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !lF(e, r).includes(t)) return;
	let { entries: i } = MN(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${ZP}`, a.setAttribute("role", "group"), PN(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: _F
	}), t.insertBefore(a, t.firstElementChild);
}
function _F(e) {
	O(e) || e.click();
}
function vF(e) {
	let { entries: t } = MN(e), n = e.querySelector(`.${Nn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) yF(e);
	let r = td(n, `.${S}`, `.${Nn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && NN(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Rn)) ? yF(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Mn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	qP(a).forEach((e, t) => {
		a[t] === "rule" && !e && yF(i[t]);
	});
}
function yF(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function bF(e) {
	let t = e.querySelector(`.${Nn}`);
	t !== null && xp(e, FP(t));
}
function xF() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Lf}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function SF(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${YP}]`)) if ((n.getAttribute(YP) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || eF === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = eF(e);
	return r !== null && tF.add(r), r;
}
function CF(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Hc(n, "data-ui-no-context-menu") || t.closest(C)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function wF(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function TF(e) {
	return getComputedStyle(e).display !== "none";
}
function EF(e) {
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
				if (e.overflowX !== "visible" && kF(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && kF(n, a, a + t.clientHeight, !1), AF(n)) return !0;
			}
			r = e.position;
		}
	}
	return kF(n, 0, window.innerWidth, !0), kF(n, 0, window.innerHeight, !1), AF(n);
}
function DF(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !wF(n, !1)) && (OF(e.overflowX) || OF(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function OF(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function kF(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function AF(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var jF = `[${De}]`, MF = `.${Me}`, NF = `${Me}--out`, PF = `.ui-items-view__item, .${tr}`, FF = "ui-tree__node", IF = 6, LF = "--ui-action-bar-gap", RF = 400, zF = /* @__PURE__ */ new WeakMap(), BF = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...di
], VF = class {
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
		if (n === null || n.closest(`${MF}, [data-ui-context-menu]`) !== null) return;
		let r = HF(n), i = r !== null && r !== this.chosen && UF(n, r) ? null : r;
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: i,
				identity: i === null ? null : YF(i)
			};
			return;
		}
		if ((t.button ?? 0) !== 0) {
			r !== this.chosen && this.choose(null);
			return;
		}
		i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? XF(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(MF) === null && mF(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(MF);
		if (n !== null) {
			this.isHostedBar(n) && N(iI(n), t);
			return;
		}
		Qf() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(qF(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(MF) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(F) && this.choose(qF(t));
			return;
		}
		let n = t.closest(MF);
		if (n !== null && t.classList.contains(TN)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (lu(e)) return;
			let n = t.closest(Qh);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(F)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(F) && this.choose(qF(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && cI(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Sp(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = iI(t), i = Nu({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Iu(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : YF(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = DF(e);
		if (t === void 0 || n === null || !wF(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + QF(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, oh(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		pF(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			Vh(e) || this.scopeChanged();
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
				this.chosen = XF(e), this.sync();
			}
			for (let e of this.shown.values()) oh(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = pF(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Qe, ""), n.setAttribute(fe, ""), !eI(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, rI(e)), Ym(e, n, {
			placement: ZF(e),
			gap: QF(e),
			boundary: DF(e) ?? void 0
		}), n.classList.toggle(NF, EF(e));
		let r = new MutationObserver((t) => {
			Vh(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: BF
		});
		let i = $F(e);
		i?.setAttribute(jr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), zF.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : zN(r);
		if (!eI(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = iI(t.bar);
		Iu(a, a.find((e) => zN(e) === i) ?? a.find(P) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || oI(t)) return;
		if (this.menuHost = e, sI(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		tI(n.bar, !0);
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
		tI(t.bar, !1);
		let n = document.activeElement;
		!Qf() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && nI(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), sh(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(jr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(NF, EF(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : iI(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function HF(e) {
	let t = e.closest(jF);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(C);
	return n === null || r !== null && !r.contains(n) ? null : JF(n)[0] ?? null;
}
function UF(e, t) {
	let n = Mu(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !GF(n, t);
}
var WF = `[${Se}], .${Me}, ${Ci}`;
function GF(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = KF(e) - KF(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(WF)) return !1;
			t -= KF(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function KF(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function qF(e) {
	if (e instanceof HTMLElement && e.matches(F)) {
		let t = Yd(e), n = t === null ? void 0 : JF(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(jF);
}
function JF(e) {
	let t = [...e.querySelectorAll(jF)];
	return e.matches(jF) ? [e, ...t] : t;
}
function YF(e) {
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
		index: JF(n).indexOf(e)
	};
}
function XF(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return JF(t)[e.index] ?? null;
	return null;
}
function ZF(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function QF(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(LF));
	return Number.isFinite(t) ? t : IF;
}
function $F(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(PF)) return t;
	let n = t.parentElement;
	return t.classList.contains(FF) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function eI(e, t, n, r) {
	let { entries: i, more: a } = MN(t);
	if (i.length === 0 && !a) return !1;
	let o = PN(e, {
		entries: i,
		more: a,
		role: "button",
		press: aI,
		openMore: n
	});
	return N(o, o.find((e) => !O(e)) ?? o[0] ?? null), tI(e, r), !0;
}
function tI(e, t) {
	nI(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function nI(e) {
	return iI(e).find((e) => zN(e) === null) ?? null;
}
function rI(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function iI(e) {
	return [...e.querySelectorAll(`:scope > .${TN}`)];
}
function aI(e, t) {
	if (O(t) || oI(t)) return;
	let n = pF(t, !1);
	n === null || !n.contains(e) || O(e) || !NN(e, n) || e.click();
}
function oI(e) {
	let t = e.closest(MF), n = t === null ? void 0 : zF.get(t);
	return n !== void 0 && $f() && Date.now() - n < RF;
}
function sI(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function cI(e) {
	return e.matches(Lf) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var lI = "ui-tooltip", uI = "ui-tooltip", dI = "ui-tooltip--visible", fI = "ui-tooltip--linked", pI = "[aria-haspopup][aria-expanded=\"true\"]", mI = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", hI = "top", gI = 250, _I = 200, vI = 300, yI = 7, bI = null, xI = null, SI = null, CI = null, wI = null, TI = 0, EI = null, DI = 0, OI = 0, kI = !1, AI = /* @__PURE__ */ new Set();
function jI(e) {
	AI.add(e);
}
function MI(e = document) {
	if (kI) return;
	kI = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", NI, !0), t.addEventListener("pointerout", II, !0), t.addEventListener("focusin", RI, !0), t.addEventListener("focusout", zI, !0), t.addEventListener("scroll", FI, !0), t.addEventListener("pointerdown", VI, !0), t.addEventListener("click", GI, !0), new GN({
		root: t,
		first: window,
		holds: UI,
		answer: WI
	}), window.addEventListener("keydown", BI, !0), window.addEventListener("blur", hL);
}
function NI(e) {
	if (PI(), qI(e.target)) {
		window.clearTimeout(DI);
		return;
	}
	let t = JI(e.target);
	t !== null && t !== xI && $I(t);
}
function PI() {
	xI === null || xI.isConnected || hL();
}
function FI(e) {
	if (PI(), xI === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(xI) || EF(xI) && hL();
}
function II(e) {
	if (CI !== null || wI !== null) return;
	let t = e.relatedTarget, n = xI ?? EI?.target ?? null, r = n === null ? null : LI(n);
	t instanceof Node && (r !== null && r.contains(t) || qI(t)) || (qI(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && gL(!1);
}
function LI(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && YI(t) === e ? t : e;
}
function RI(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = JI(e.target);
	t !== null && (CI = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, eL(t));
}
function zI(e) {
	JI(e.target) === xI && hL();
}
function BI(e) {
	e.key !== "Escape" || xI === null || e.defaultPrevented || (lu(e) || e.preventDefault(), hL());
}
function VI(e) {
	if (qI(e.target)) return;
	let t = KI(e.target);
	if (t !== null) {
		if (wI === t) {
			gL(!0);
			return;
		}
		hL(), eL(t), wI = xI;
		return;
	}
	CI === null && gL(!0);
}
var HI = `[${Ce}]`;
function UI(e) {
	let t = e.closest(HI) === null && !yu(e) ? JI(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function WI(e) {
	let t = JI(e);
	return t !== null && (hL(), eL(t), wI = xI, !0);
}
function GI(e) {
	KI(e.target) !== null && e.preventDefault();
}
function KI(e) {
	let t = JI(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(mI);
	return n === null || n.contains(t) ? t : null;
}
function qI(e) {
	return bI !== null && e instanceof Node && bI.contains(e);
}
function JI(e) {
	if (!(e instanceof Element)) return null;
	let t = YI(e);
	for (let n of AI) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && QI(r).length > 0) return r;
	}
	return t;
}
function YI(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function XI(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + ZI(e) : QI(e);
}
function ZI(e) {
	let t = "";
	for (let n of AI) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function QI(e) {
	for (let t of AI) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function $I(e, t) {
	if (CI === null && wI === null) {
		if (window.clearTimeout(DI), EI !== null && EI.target === e) {
			EI.words = t;
			return;
		}
		if (window.clearTimeout(TI), EI = null, xI !== null) {
			gL(!0), eL(e, t);
			return;
		}
		if (Date.now() - OI < vI) {
			eL(e, t);
			return;
		}
		EI = {
			target: e,
			words: t
		}, TI = window.setTimeout(() => {
			let e = EI;
			EI = null, e !== null && eL(e.target, e.words);
		}, gI);
	}
}
function eL(e, t) {
	let n = (t ?? XI(e)).trim();
	if (n.length === 0 || !e.isConnected || !TF(e) || rL(e) || EF(e)) return;
	window.clearTimeout(TI), window.clearTimeout(DI), EI = null;
	let r = _L();
	Eo(r, n, { staticFolds: !0 }), r.classList.toggle(fI, r.querySelector("a[href]") !== null), r.classList.add(dI), xI = e, aL(iL(e)), r.setAttribute("data-ui-tooltip-text", wo(n)), cL(r, e.getAttribute(Ve)), Jm(e, r), Ym(e, r, {
		placement: mL(e),
		gap: yI,
		arrow: !0
	}), nL();
}
var tL = null;
function nL() {
	typeof MutationObserver > "u" || (tL ??= new MutationObserver(PI), tL.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function rL(e) {
	return e.matches(pI) || e.querySelector(pI) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function iL(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function aL(e) {
	SI !== null && SI !== e && oL();
	let t = sL(e);
	t.includes(uI) || e.setAttribute("aria-describedby", [...t, uI].join(" ")), SI = e;
}
function oL() {
	if (SI === null) return;
	let e = sL(SI).filter((e) => e !== uI);
	e.length === 0 ? SI.removeAttribute("aria-describedby") : SI.setAttribute("aria-describedby", e.join(" ")), SI = null;
}
function sL(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function cL(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function lL(e, t, n) {
	let r = n?.plain === !0 ? To(t) : t;
	n?.delay === !0 && xI !== e ? $I(e, r) : eL(e, r);
}
function uL() {
	gL(!0);
}
var dL = {
	show: lL,
	hide: uL,
	escape: To
};
function fL(e) {
	CI = e, eL(e);
}
function pL(e) {
	if (xI === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			hL();
			return;
		}
		eL(e);
	}
}
function mL(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of AI) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Rm(t) ? t : hI;
}
function hL() {
	CI = null, gL(!0);
}
function gL(e) {
	window.clearTimeout(TI), window.clearTimeout(DI), EI = null;
	let t = () => {
		xI !== null && (oL(), xI = null, wI = null, tL?.disconnect(), bI !== null && (bI.classList.remove(dI), sh(bI)), OI = Date.now());
	};
	e ? t() : DI = window.setTimeout(t, _I);
}
function _L() {
	return bI !== null && bI.isConnected ? bI : (bI = document.createElement("div"), bI.id = uI, bI.className = lI, bI.setAttribute("role", "tooltip"), bI.setAttribute("aria-hidden", "true"), document.body.append(bI), bI);
}
//#endregion
//#region src/interactions/menu-engine.ts
var vL = "ui-orientation--horizontal", yL = `.${In} > .ui-menu__host > .ui-menu__item > .${S}`, bL = `${yL}, ${`.ui-menu[${ln}] > .ui-menu__host > .ui-menu__item > .${S}`}`, xL = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", SL = "[role='menuitem'], [role='menuitemcheckbox']", CL = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new Yl();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, P), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), jI(DL), this.applyTabStops(this.root.querySelectorAll(`.${Nn}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) zh(t) || OL(t, this.touched);
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
		for (let n of e) n.isConnected && t.add(IP(n));
		for (let e of t) {
			let t = FP(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && P(e));
			N(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && P(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(P) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || bu(e) || j(e) || !(e.target instanceof Element)) return;
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
		let r = IP(n), i = FP(r), a = Jw(e);
		if (a !== null) {
			e.preventDefault(), Iu(i, sN(i, t, a));
			return;
		}
		let o = r.classList.contains(vL) || MP(r) ? "horizontal" : "vertical";
		if (!M(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(P) ? EL(r) : null, c = s ?? Nu({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && N(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : jP(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(zn) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Iu([], wL(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !RP(a) ? a : TL(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), RP(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !M(e, { shift: !0 }) || t.matches(Rn) || !P(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Nn}`);
		if (n === null) return;
		let r = FP(n), i = Jw(e);
		if (i !== null) {
			e.preventDefault(), Iu(r, sN(r, null, i));
			return;
		}
		let a = M(e) ? Nu({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(vL) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Iu(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && N(FP(IP(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${S}`) : null;
		if (t === null || t === document.activeElement || !t.matches(SL) || t.matches(Rn) || !P(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && ap(t);
	}
};
function wL(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Nn}`);
	return t === null ? null : FP(t).find(P) ?? null;
}
function TL(e) {
	let t = e.closest(`.${Nn}`), n = t === null ? null : LP(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function EL(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var DL = {
	anchor: (e) => e.closest(bL),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(xL), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(yL) && t.scrollWidth <= t.clientWidth ? null : To(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Nn}`);
		return t === null ? null : jP(t);
	}
};
function OL(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Nn}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var kL = "shortcut:", AL = ":scope > .ui-menu-item__shortcut", jL = `[${Se}]`, ML = `[${Hn}]`, NL = ".ui-text__title", PL = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), jI(VL), RL(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!Vh(e)) {
				this.stale = !0;
				for (let t of e) LL(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Hn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || bu(e))) return;
		let t = tg(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Il(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !P(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), IL(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Il(t, e);
		let r = n ? oF() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = iF(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(ML)].filter((t) => {
			let n = Fl(t.getAttribute(Hn));
			return n !== null && Il(n, e) && !O(t) && NN(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), IL(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(ML)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Fl(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(jL) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Xl(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = Fl(e);
			t !== null && this.entryShortcuts.set(Xl(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Fl(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Xl(e.shortcut);
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
function FL(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(kL) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function IL(e) {
	vu(e.target) && e.target.dispatchEvent(new Event(Tx, { bubbles: !0 }));
}
function LL(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && zL(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && RL(t);
}
function RL(e) {
	e instanceof HTMLElement && e.matches(ML) && zL(e);
	for (let t of e.querySelectorAll(ML)) zL(t);
}
function zL(e) {
	let t = e.querySelector(AL);
	if (t === null) return;
	let n = BL(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(gn, n.length > 0);
}
function BL(e) {
	let t = e.getAttribute(Hn), n = Fl(t);
	return n === null ? t?.trim() || null : Ll(n);
}
var VL = {
	anchor: (e) => {
		let t = e.closest(ML);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(jL) !== null ? null : t;
	},
	words: (e) => {
		let t = BL(e), n = (e.getAttribute("aria-label") ?? e.querySelector(NL)?.textContent ?? "").trim();
		return t === null ? null : To(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = BL(e);
		return t === null ? null : To(`(${t})`);
	}
}, HL = 50, UL = 1, WL = 7;
function GL(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = $D(e, "data-ui-window-size") ?? 0;
	return {
		offset: $D(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : HL,
		total: $D(e, en),
		moreAfter: eO(e, nn)
	};
}
function KL(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function qL(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function JL(e, t) {
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
			let n = Number(t), r = qL(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === KL(e) ? null : (n - 1) * e.size;
		}
	}
}
function YL(e, t) {
	if (t <= WL) return ZL(1, t);
	let n = Math.max(Math.min(e - UL, t - 2 - 2), 3), r = Math.min(Math.max(e + UL, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...ZL(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function XL(e, t) {
	let n = YL(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function ZL(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var QL = ".ui-pager", $L = "ui-pager__button", eR = "ui-pager__number", tR = "ui-pager__pages", nR = "ui-pager__gap", rR = "ui-pager__range", iR = "ui-pager__size", aR = "ui-pager__size--open", oR = "ui-pager__size-trigger", sR = "ui-pager__size-label", cR = "ui-pager__sizes", lR = "ui-pager__size-choice", uR = [
	$L,
	eR,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], dR = "ui.pager.page", fR = "ui.pager.range", pR = "ui.pager.rows", mR = "ui.pager.size", hR = [
	$t,
	en,
	nn,
	Qt,
	Zt
], gR = "page-size", _R = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new nP();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new s_({
		show: ({ owner: e }) => e.classList.add(aR),
		hide: ({ owner: e }) => e.classList.remove(aR),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), B(this.root, `${QL}, [${x}]`, {
			childList: !0,
			attributeFilter: hR,
			relevant: (e) => e.type === "attributes" || ER(e.target) || DR(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(QL)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(QL)) {
				t.add(r);
				continue;
			}
			let e = r.closest(C), i = e === null ? 0 : T(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(QL)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ht));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = TR(e);
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
		let i = GL(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = oD(e), s = (e) => sD(e, "N0", o);
		this.drawNumbers(e, i, o), yR(e, i, s), bR(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${$L}[${gt}]`)) Kc.setDisabled(t, JL(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		SR(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${tR}`);
		if (r === null) return;
		let i = KL(t), a = qL(t), o = a === null ? XL(i, t.moreAfter) : YL(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => vR(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(QL);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${lR}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(_t)));
			return;
		}
		let r = e.target.closest(`.${oR}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${gt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = JL(GL(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Vu(e).top > 0 && Hu(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(QL);
		if (t === null) return;
		let n = e.target.closest(`.${iR}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${$L}, .${oR}`), i = xR(t);
		if (r === null || !i.includes(r) || !M(e)) return;
		let a = Nu({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Iu(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${oR}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && aN(e, wR(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${lR}`) : null, n = t?.closest(`.${iR}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && cN(t, wR(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${iR}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${cR}`);
		if (r === null) return;
		let i = wR(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		iN(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, gR), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!CR(e, i)) {
			this.store.write(t, gR, null);
			return;
		}
		let a = GL(n);
		i !== a.size && (n.setAttribute(Qt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${iR}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = GL(r.host);
		t !== i.size && (this.store.write(r.component, gR, String(t)), r.host.setAttribute(Qt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !M(e) || !(e.target instanceof Element)) return;
		let t = Ud(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root)) return;
		let n = TR(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = JL(GL(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Ad(e), i = Jd(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = Ad(e);
		o.length > 0 && Qd(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function vR(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = nR, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = sD(e, "N0", n);
	return r.className = uR.join(" "), r.setAttribute("type", "button"), r.setAttribute(gt, String(e)), r.textContent = i, D.write(r, "aria-label", dR, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function yR(e, t, n) {
	let r = e.querySelector(`:scope > .${rR}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, pR, {
		from: i,
		to: a
	}) : D.write(r, null, fR, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function bR(e, t, n) {
	let r = e.querySelector(`:scope > .${iR}`), i = r?.querySelector(`.${sR}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, mR, { size: n(t.size) });
		for (let e of wR(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function xR(e) {
	return [...e.querySelectorAll(`.${$L}, .${oR}`)];
}
function SR(e) {
	let t = xR(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	N(t, n ?? r.find(P) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function CR(e, t) {
	let n = e.querySelector(`:scope > .${iR}`);
	return n !== null && wR(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function wR(e) {
	return [...e.querySelectorAll(`:scope > .${cR} > .${lR}`)];
}
function TR(e) {
	for (let t of e.querySelectorAll(`[${x}][${Wt}="windowed"]`)) if (t.closest(C) === e) return t;
	return null;
}
function ER(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function DR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(QL) || t.querySelector(QL) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var OR = `.${Nn}[${vn}]`, kR = ":scope > .ui-collapsible__bar", AR = ":scope > .ui-menu__host", jR = "ui-menu__item", MR = `:scope > .${S}`, NR = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", PR = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), B(t, OR, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = FR(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(AR);
		if (n === null) return;
		let r = vg(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: IR(n)
		}), e.setAttribute(yn, ""), Gw(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of LR(e)) {
			let e = RR(a);
			if (e === "header") {
				n !== null && BR(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			BR(a, o), r ||= o, i ||= o;
		}
		return n !== null && BR(n, r), i;
	}
	match(e, t) {
		let n = bg(zR(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(NR) : null;
		if (r === null) return n;
		if (n) return VR(r), e.removeAttribute(fn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(fn, i), i;
	}
	clear(e, t) {
		VR(t), e.removeAttribute(yn), LR(t).length > 0 && Gw(e, t, !1);
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
		let t = FR(e.target), n = t === null ? void 0 : FP(t).find(P);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function FR(e) {
	let t = e.closest(OR), n = t?.querySelector(kR) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function IR(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${un}][${fn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function LR(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(jR));
}
function RR(e) {
	return e.querySelector(MR)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function zR(e) {
	let t = e.querySelector(MR);
	return t === null ? "" : yg(Cg(t), e);
}
function BR(e, t) {
	e.toggleAttribute(bn, !t);
}
function VR(e) {
	for (let t of e.querySelectorAll(`[${bn}]`)) t.removeAttribute(bn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var HR = 120;
function UR(e) {
	return e.typing && e.tallest - e.height > HR;
}
var WR = class {
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
		let t = UR({
			height: e.height,
			tallest: this.tallest,
			typing: yu(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Kr, t);
	}
}, GR = "[data-ui-root]", KR = "a[href]", qR = "ui-collapsible", JR = "ui-collapsible__bar", YR = "right-side", XR = "ui-side--left", ZR = "ui-side--right", QR = "pinned", $R = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new nP();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of KN) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(GR)) oz(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xn}]`);
		if (t !== null) {
			let e = t.closest(GR), n = t.getAttribute(xn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${En}]`);
		if (n !== null) {
			let e = n.closest(GR), t = n.getAttribute(En);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(Dn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Un}]`);
		if (r !== null && !e.defaultPrevented && rz(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${KR}, .${S}`), a = i?.closest(`[${jn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && iz(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || lu(e) || dg()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && dp(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${GR}[${Sn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = sz(t, n);
			r !== null && !ng(r) && e.push({
				shell: t,
				drawer: r,
				modal: az(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${GR}[${Sn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = sz(e, t), r = this.openers.get(e);
			n === null || !YN(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = sz(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !YN(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Sn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, az(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, Qf(), performance.now() + z.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(xi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", D.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = ez(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", D.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(JR) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(Cn), i.removeAttribute(wn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(Cn, ""), i.setAttribute(wn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = nz(r.left - e.offsetLeft, e.clientWidth - a.width), c = nz(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (_p(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = sz(e, t);
		if (i === null || QN(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(Dn(t), n), oz(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && R(n);
		}
		let o = i.querySelector(`[${qe}]`);
		o !== null && this.store.write(o, QR, n ? "true" : null, n ? {
			root: !0,
			attributes: { [Dn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${GR}[${Sn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Sn);
		if (e.removeAttribute(Sn), this.markToggles(e), n === null) return;
		let r = sz(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Ep(t, r) : t !== null && R(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${xn}="${Bi(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Sn);
		for (let n of e.querySelectorAll(`[${xn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(xn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(xi), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function ez(e) {
	for (let t of e.querySelectorAll(`[${Un}]`)) if (rz(t) && t.checkVisibility() && tz(t.closest(`.${qR}`), e)) return t;
	return null;
}
function tz(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function nz(e, t) {
	return Math.max(0, Math.min(e, t));
}
function rz(e) {
	let t = e.closest(`.${qR}`), n = t?.closest(`[${jn}]`), r = n?.getAttribute(jn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(GR) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === YR ? ZR : XR);
}
function iz(e) {
	return !e.classList.contains("ui-menu-item") || PP(e) && e.closest(bi) === null;
}
function az(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function oz(e) {
	for (let t of e.querySelectorAll(`[${En}]`)) {
		let n = String(e.hasAttribute(Dn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function sz(e, t) {
	return e.querySelector(`:scope > [${jn}="${Bi(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var cz = "ui-collapsible", lz = "ui-collapsible__content", uz = "ui-collapsible__bar", dz = "ui-collapsible__bar-content", fz = "collapsed", pz = class {
	root;
	store = new nP();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${cz}`)), B(this.root, `.${cz}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [ln]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(ln));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, fz);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Un}]`), n = t?.closest(`.${cz}`) ?? null;
		if (t === null || n === null || rz(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(ln), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = hz(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, fz, r ? "true" : "false", r ? { attributes: { [ln]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(ln, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${lz}`),
			bar: e.querySelector(`:scope > .${uz} > .${dz}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Un}], :scope > .${uz} > [${Un}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Tm()) return;
		let i = _z(mz(e), n, hz(e, t), r);
		if (i === null) return;
		e.setAttribute(Wn, ""), e.offsetWidth;
		let a = {
			duration: z.normal,
			easing: z.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Wn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Wn);
			for (let e of t) e.cancel();
		}
	}
};
function mz(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function hz(e, t) {
	let n = mz(e), r = gz(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function gz(e) {
	return e === "width" ? "height" : "width";
}
function _z(e, t, n, r) {
	let i = gz(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function vz(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var yz = "ui-grid-splitter", bz = "ui-container", xz = "ui-orientation--vertical", Sz = 16, Cz = {
	sliver: 0,
	passFloors: !0
}, wz = {
	sliver: 48,
	passFloors: !0
}, Tz = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Gn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Ez = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Kn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Dz = class {
	root;
	store = new nP();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new wg({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${yz}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, Cz) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${yz}`)), B(this.root, `.${yz}`, { childList: !0 }, (e) => this.prepareEach(e)), B(this.root, `.${yz}`, { attributeFilter: [Jn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Az(t);
			e !== null && (this.restore(e, jz(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Om) {
			let i = r[n], a = Nm(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = Rz(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && Nz(n.container, n.axis, n.tier) !== void 0)) return;
		let r = _l(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, vz(e, () => {
			!e.isConnected || Rz(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) Rz(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Mm();
		for (let t of this.root.querySelectorAll(`.${yz}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		let t = e.target.closest(`.${yz}`);
		if (t === null || this.drag.active || O(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Bz(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = qc(r, i) * Lz(e.key, n.axis);
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
		let n = Az(e);
		if (n === null) return;
		let r = jz(e);
		for (let e of Om) n.style.removeProperty(Nm(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Jn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = zz(gl(Pz(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Jn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${yz}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : xl(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, Cz);
	}
	putBack(e, t) {
		let n = Nm(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = wz) {
		let r = ol(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(Nm(e.axis.split, e.tier), Qc(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Om) {
			let a = Nm(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Az(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = jz(e), r = Mm(), i = Mz(t, n, r), a = i === null ? null : Jc(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = nl(a, tl(t.getAttribute(n.limits))), s = Pz(t, n), c = Fz(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = rl(c, Iz(t, n).map((e) => Fz(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(Nm(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = Az(e);
		if (n === null) return;
		let r = jz(e), i = Fz(e, r), a = Pz(n, r), o = Iz(n, r).map((e) => Fz(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : rl(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(hl(a, s)));
		let c = Oz(a, s.before) ? "before" : Oz(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(Yr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(Yr, c), kz(n, t === void 0 ? null : {
			axis: r,
			tracks: Sl(t, a, s, 48)
		});
	}
};
function Oz(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function kz(e, t) {
	let n = [Tz, Ez].filter((t) => Iz(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: Pz(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(yz) ? jz(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && wl(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Jr, a);
	}
}
function Az(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(bz) ? t : null;
}
function jz(e) {
	return e.classList.contains(xz) ? Tz : Ez;
}
function Mz(e, t, n) {
	let r = Nz(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function Nz(e, t, n) {
	return Im(n, (n) => e.style.getPropertyValue(Nm(t.split, n)).trim() || void 0);
}
function Pz(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Fz(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Iz(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(yz) && jz(r) === t && n.push(r);
	return n;
}
function Lz(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function Rz(e) {
	return vl(e.getAttribute(Jn));
}
function zz(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function Bz(e) {
	let t = Number(e.getAttribute(qn));
	return Number.isFinite(t) && t > 0 ? t : Sz;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var Vz = "ui-pane-container", Hz = "ui-pane-container__place", Uz = "ui-pane-container__pane", Wz = "ui-pane-container__grip", Gz = "data-ui-pane-lifted", Kz = "data-ui-pane-target", qz = "data-ui-pane-moving", Jz = "data-ui-pane-near", Yz = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", Xz = "panes", Zz = ",", Qz = 32, $z = class {
	root;
	store = new nP();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new wg({
			root: this.root,
			resolveHandle: (e) => tB(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.forgetNearTop(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${Vz}`), !1), B(this.root, `.${Vz}`, {
			childList: !0,
			attributeFilter: [Yn],
			relevant: oB
		}, (e) => this.arrangeEach(sB(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of cB(n)) {
					let t = e.querySelector(`:scope > .${Uz} > .${Wz}`);
					t !== null && rB(t);
				}
			}
			n.hasAttribute(qz) || fB(n, uB(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, Xz);
		t !== null && e.setAttribute(Yn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || lB(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(Gz, ""), i.setAttribute(qz, ""), {
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, _B(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(Kz), t?.setAttribute(Kz, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${Uz}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), pB(i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), mB(e.pane), e.container.isConnected && fB(e.container, uB(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(Kz), e.pane.removeAttribute(Gz), e.container.removeAttribute(qz), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Si);
	}
	keep(e) {
		let t = dB(e);
		e.setAttribute(Yn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, Xz, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		this.dropStaleHold();
		let t = tB(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = eB[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = vB(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && lk({
				key: "ui.pane.target",
				args: aB(n.container, t)
			}), this.mark(n, t);
			return;
		}
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) lk({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = aB(n.container, r);
				dk(e, t);
			}
			t.focus({ preventScroll: !0 });
			return;
		}
		e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), lk({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Si, ""), lk({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t === null || !(e.target instanceof Element) || e.target.parentElement !== t.pane || (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? tB(e.target) : null;
		t !== null && rB(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? nB(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < Qz ? t : null);
	}
	forgetNearTop() {
		this.nearTop = null;
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(Jz), e?.setAttribute(Jz, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, eB = {
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
function tB(e) {
	let t = e.closest(`.${Wz}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(Vz) === !0 ? t : null;
}
function nB(e) {
	let t = e.closest(`.${Uz}`);
	return t?.parentElement?.parentElement?.classList.contains(Vz) === !0 ? t : null;
}
function rB(e) {
	let t = e.parentElement, n = t === null ? null : iB(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== D.translate(r, i) && D.write(e, "aria-label", r, i);
}
function iB(e) {
	for (let t of e.querySelectorAll(Yz)) {
		let n = nB(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function aB(e, t) {
	let n = lB(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function oB(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(Vz);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(Vz) || t.querySelector(`.${Vz}`) !== null)) return !0;
	return !1;
}
function sB(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${Vz}`)) t.add(e);
	}
	return t;
}
function cB(e) {
	return Array.from(e.querySelectorAll(`:scope > .${Hz}`));
}
function lB(e) {
	return cB(e).filter((e) => e.getClientRects().length > 0);
}
function uB(e) {
	return e.getAttribute(Yn);
}
function dB(e) {
	return cB(e).map((e) => e.querySelector(`:scope > .${Uz}`)?.getAttribute("data-ui-pane") ?? "").join(Zz);
}
function fB(e, t, n) {
	let r = cB(e), i = gB(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${Uz}`), n = t?.getAttribute(Xn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && pB(o, n);
}
function pB(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || Tm()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? hB(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: z.normal + 60,
			easing: z.ease
		});
	}
}
function mB(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Tm() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease
	});
}
function hB(e, t) {
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
function gB(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(Zz).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function _B(e, t, n) {
	for (let r of lB(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function vB(e, t, n, r) {
	let i = lB(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = bB(yB(a), i.map((e) => e.place === t || e.place === n ? null : yB(e.box)), r);
	return o === null ? null : i[o].place;
}
function yB(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function bB(e, t, n) {
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
var xB = "ui-split-button", SB = "ui-split-button__main", CB = "ui-split-button__toggle", wB = "ui-split-button__menu", TB = "ui-split-button--open", EB = class {
	root;
	menus = new s_({
		show: ({ owner: e }) => e.classList.add(TB),
		hide: ({ owner: e }) => e.classList.remove(TB),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = DB(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${SB}`)?.closest(`.${xB}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !M(e)) return;
		let t = DB(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = OB(t), r = e.target.closest(`.${S}`);
		n !== null && r !== null && n.contains(r) && PP(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = OB(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Rm(i) ? i : "bottom-end" },
			openers: kB(e)
		}) && xp(r, FP(r), t);
	}
};
function DB(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${CB}, .${SB}`), n = t?.closest(`.${xB}`) ?? null;
	return t === null || n === null || t.classList.contains(SB) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function OB(e) {
	return e.querySelector(`:scope > .${wB}`);
}
function kB(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var AB = "ui-button-group", jB = "ui-button-group__item", MB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${AB}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), B(this.root, `.${AB}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [ni]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = NB(i);
			i.toggleAttribute(ti, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		N(n, r ?? n.find(P) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jB}`), n = t?.closest(`.${AB}`) ?? null;
		if (t === null || n === null || t.closest(`.${AB}`) !== n || O(n)) return;
		let r = NB(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jB} > .${Ei}`), n = t?.closest(`.${AB}`) ?? null;
		if (t === null || n === null || !M(e)) return;
		let r = this.ownItems(n).map(NB).filter((e) => e !== null), i = Nu({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${jB}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		rd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ni,
			bindingAttribute: ii,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return td(e, `.${jB}`, `.${AB}`);
	}
};
function NB(e) {
	return e.querySelector(`:scope > .${Ei}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var PB = "ui-accordion", FB = "details", IB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${PB}`)), B(this.root, `.${PB}`, {
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
		!(t instanceof HTMLDetailsElement) || t.open || this.closeSiblings(t);
	}
	handleToggle(e) {
		let t = e.target;
		!(t instanceof HTMLDetailsElement) || !t.open || this.closeSiblings(t);
	}
	closeSiblings(e) {
		let t = e.parentElement;
		if (!(t === null || !t.classList.contains(PB))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${FB}`)];
	}
}, LB = "ui-tab-overflow", RB = "ui-tab-overflow__menu", zB = "ui-tab-overflow__menu--open", BB = "ui-tab-overflow__entry", VB = "ui-tab-overflow__entry--current", HB = class {
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
		this.options = e, this.list = new GB(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : UB({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return WB(e, this.options.hiddenClass, t);
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
function UB(e) {
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
function WB(e, t, n) {
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
var GB = class {
	menu;
	button = null;
	list = new s_({
		show: ({ popup: e }) => e.classList.add(zB),
		hide: ({ popup: e }) => {
			e.classList.remove(zB), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = RB, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(KB)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${VB}`);
		this.button = e, Jm(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		iN(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${BB}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || aN(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${BB}`) : null;
		t !== null && cN(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${BB}`));
	}
};
function KB(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${BB} ${Di}`, t.classList.toggle(VB, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(mi), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var qB = "data-ui-caption-text", JB = ".ui-text__title";
function YB(e) {
	for (let t of e.querySelectorAll(JB)) {
		let e = t.textContent ?? "";
		t.getAttribute(qB) !== e && t.setAttribute(qB, e);
	}
}
function XB(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Tm()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease,
		pseudoElement: "::after"
	});
}
function ZB(e) {
	if (!(e === null || Tm())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: z.fast,
		easing: z.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var QB = "ui-tabs", $B = "ui-tab-caption", eV = "ui-tab-caption--selected", tV = "ui-tab-caption--overflowed", nV = "ui-tabs--overflowing", rV = "ui-tabs--no-overflow", iV = "ui-tabs__strip", aV = "ui-tabs__band", oV = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HB({
			rootClass: QB,
			overflowingClass: nV,
			wraps: (e) => e.classList.contains(rV),
			hiddenClass: tV,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${QB}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), B(this.root, `.${QB}`, {
			childList: !0,
			attributeFilter: [ai, ...di],
			relevant: (e) => !Kh(e, `[${ci}]`, `.${QB}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(sV), i = id(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(eV)) ?? null, o = null;
		for (let n of td(e, `[${li}]`, `.${QB}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(eV, n), e.setAttribute("aria-selected", n ? "true" : "false"), YB(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), XB(a, o), N(n.filter((e) => !e.classList.contains(tV)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && ZB(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${iV}, :scope > .${aV} > .${iV}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(sV).map((e) => {
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
		let t = e.target.closest(`.${LB}`), n = t?.closest(`.${QB}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${QB}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${$B}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${QB}`), a = r.getAttribute(si);
		i !== null && a !== null && r.closest(`.${QB}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || bu(e) || !M(e)) return;
		let t = e.target.closest(`.${$B}`), n = t?.closest(`.${QB}`) ?? null;
		if (t === null || n === null) return;
		let r = Nu({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		rd(e, t, {
			attribute: ai,
			bindingAttribute: ii,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return td(e, `.${$B}`, `.${QB}`);
	}
	ownPages(e) {
		return td(e, `[${ci}]`, `.${QB}`);
	}
};
function sV(e) {
	return e.classList.contains(tV) || TF(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function cV(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function lV(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function uV(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var dV = "ui-command-bar", fV = "ui-command-bar__host", pV = "ui-command-bar__item", mV = "ui-command-bar__overflow", hV = "ui-command-bar--overflowing", gV = "ui-command-bar__overflowed", _V = "ui-orientation--vertical", vV = "ui-text__title", yV = `${Lf}, [${Fe}]`, bV = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HB({
			rootClass: dV,
			overflowingClass: hV,
			wraps: (e) => !TV(e),
			hiddenClass: gV,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${dV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), B(this.root, `.${dV}`, {
			childList: !0,
			addedOnly: !0,
			relevant: xV
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = SV(e), n = e.querySelector(`:scope > .${mV}`);
		if (t === null || n === null) return;
		let r = EV(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(hV) && DV(r);
		for (let e of r) Km(e, e.classList.contains(gV) ? n : null);
		e.classList.contains(_V) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), CV(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mV}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(dV) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !M(e) || bu(e)) return;
		let t = e.target.closest(`.${dV}`), n = t === null ? [] : wV(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Nu({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(_V) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), CV(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${dV}`) ?? null;
		t !== null && n !== null && wV(n).includes(t) && CV(n, t);
	}
	entriesOf(e) {
		let t = SV(e), n = t === null ? [] : EV(t).filter((e) => e.classList.contains(pV) && e.classList.contains(gV)).map((e) => e.querySelector(C) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: OV(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && kV(n).click();
	}
};
function xV(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(dV) || t.classList.contains(fV) || t.classList.contains(pV))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(dV) || t.querySelector(`.${dV}`) !== null)) return !0;
	return !1;
}
function SV(e) {
	return e.querySelector(`:scope > .${fV}`);
}
function CV(e, t) {
	let n = wV(e), r = n.find((e) => e.tabIndex >= 0 && P(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(P) ?? null;
	for (let e of n) e === i ? lV(e) : cV(e);
}
function wV(e) {
	let t = SV(e), n = [];
	for (let e of t === null ? [] : EV(t)) if (!(!e.classList.contains(pV) || e.classList.contains(gV))) for (let t of e.querySelectorAll(yV)) uV(t) && ju(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${mV}`);
	return r !== null && e.classList.contains(hV) && n.push(r), n;
}
function TV(e) {
	let t = SV(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function EV(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(pV) ? n.querySelector(C) : null;
		e !== null && TF(e) && t.push(n);
	}
	return t;
}
function DV(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(pV) ? t ||= !r.classList.contains(gV) : t || r.classList.add(gV);
	}
}
function OV(e) {
	let t = kV(e), n = t.querySelector(`.${vV}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function kV(e) {
	return e.matches(Lf) ? e : e.querySelector(Lf) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var AV = "ui-breadcrumbs", jV = "ui-breadcrumbs__item", MV = "ui-breadcrumb", NV = "ui-breadcrumb--current", PV = "ui-hidden", FV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), B(this.root, `.${AV}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ...di]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${AV}`)) this.apply(e);
	}
	apply(e) {
		let t = td(e, `.${jV}`, `.${AV}`);
		IV(t);
		let n = t.filter((e) => !e.classList.contains(PV)).map((e) => e.querySelector(`.${MV}`)).filter((e) => e !== null && !e.classList.contains(PV)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(NV, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function IV(e) {
	let t = Om.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Om.map((e, t) => LV(r, t));
		if (RV(r, kr, Om.filter((e, t) => i[t])), RV(r, Ar, Om.filter((e, n) => !t[n])), !r.classList.contains(PV)) for (let e = 0; e < Om.length; e++) t[e] ||= !i[e];
	}
}
function LV(e, t) {
	for (let n of e.children) if (n.getAttribute(di[t]) === "collapsed") return !0;
	return !1;
}
function RV(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var zV = "ui-color-input", BV = "ui-color-input--open", VV = "ui-color-input__popup", HV = "ui-color-input__text", UV = "ui-color-input__row", WV = "ui-color-input__swatch--button", GV = "ui-color-input__value-input", KV = "ui-color-input__square-thumb", qV = "ui-color-input__hue-thumb", JV = "data-ui-color-toggle", YV = "data-ui-color-tab", XV = "data-ui-color-tab-selected", ZV = "data-ui-color-pane", QV = "data-ui-color-pane-selected", $V = "data-ui-color-square", eH = "data-ui-color-hue", tH = "data-ui-color-hex", nH = "data-ui-color-channel", rH = "data-ui-color-factor", iH = "data-ui-color-opacity", aH = "data-ui-color-name", oH = "data-ui-color-name-selected", sH = "data-ui-color-format", cH = "data-ui-color-variant", lH = "data-ui-color-no-picker", uH = "data-ui-color-no-palette", dH = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new s_({
		show: ({ owner: e }) => e.classList.add(BV),
		hide: ({ owner: e }) => e.classList.remove(BV)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${zV}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ja(e.components, `.${zV}`));
		}), B(this.root, `.${zV}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				sH,
				cH,
				lH,
				uH
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new wg({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${$V}], [${eH}]`),
			begin: (e, t) => {
				let n = e.closest(`.${zV}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute($V) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${GV}`)?.value ?? null
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
		let t = gH(e), n = this.states.get(e), r = n?.paneChosen === !0 ? fH(e, n.pane) : pH(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? mH(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = wH(t);
			if (i === null) return n ?? mH(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && hH(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = DH(a, o, s);
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
			...n ?? mH(r),
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
			let [e, a, o] = DH(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), bH(e, "--ui-color-input-color", t.held ? EH(n, r, i, t.opacity) : "transparent"), bH(e, "--ui-color-input-solid", EH(n, r, i, 255)), bH(e, "--ui-color-input-on-color", t.held ? SS(n, r, i, t.opacity) : "inherit"), yH(e, t.held ? vH(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${$V}]`), o = e.querySelector(`[${eH}]`), [s, c, l] = OH(t.hue, 1, 1);
		if (bH(e, "--ui-color-input-hue", EH(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${KV}`);
			e !== null && (bH(e, "left", `${t.saturation * 100}%`), bH(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${qV}`);
			e !== null && bH(e, "top", `${t.hue / 360 * 100}%`);
		}
		xH(e, `[${tH}]`, TH(n, r, i)), xH(e, `[${nH}="r"]`, String(n)), xH(e, `[${nH}="g"]`, String(r)), xH(e, `[${nH}="b"]`, String(i)), bH(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), SH(e, `[${iH}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${aH}]`)) n.getAttribute(aH) === t.name ? n.setAttribute(oH, "") : n.removeAttribute(oH);
		let n = t.name === null ? null : e.querySelector(`[${aH}="${Bi(t.name)}"]`), r = n === null ? null : wH(n.style.getPropertyValue("--ui-color-input-chip").trim());
		bH(e, "--ui-color-input-base", r === null ? "transparent" : EH(r[0], r[1], r[2], 255)), SH(e, `[${rH}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${ZV}]`)) n.getAttribute(ZV) === t.pane ? n.setAttribute(QV, "") : n.removeAttribute(QV);
		for (let n of e.querySelectorAll(`[${YV}]`)) n.getAttribute(YV) === t.pane ? n.setAttribute(XV, "") : n.removeAttribute(XV);
	}
	resolveRgb(e, t) {
		if (t.name === null) return OH(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${aH}="${Bi(t.name)}"]`), r = n === null ? null : wH(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? OH(t.hue, t.saturation, t.value) : CH([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${JV}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${zV}`));
			return;
		}
		let n = e.target.closest(`[${YV}]`), r = e.target.closest(`.${zV}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(YV), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${aH}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(aH)
			}));
			return;
		}
		let a = r.querySelector(`.${VV}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${zV}`);
		if (t !== null) {
			if (e.target.hasAttribute(rH)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(iH) && this.commit(t, (t) => ({
				...t,
				opacity: bS(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${zV}`);
		if (n === null) return;
		if (t.hasAttribute(rH) || t.hasAttribute(iH)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(tH)) {
			let e = wH(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = DH(e[0], e[1], e[2]);
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
		let r = t.getAttribute(nH);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = bS(Number(t.value));
		let [l, u, d] = DH(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${GV}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = kH((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = kH((t.x - a.left) / a.width), s = 1 - kH((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${GV}`);
		a !== null && (a.value = _H(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${GV}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(lH) && e.hasAttribute(uH)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${VV}`);
		if (t === null) return;
		let n = e.getAttribute(cH) === "swatch", r = n ? e.querySelector(`.${WV}`) : e.querySelector(`.${UV}`), i = n ? r : r?.querySelector(`[${JV}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${XV}]`) ?? !0
		});
	}
};
function fH(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? lH : uH))(t) ? t : t === "picker" ? "palette" : "picker";
}
function pH(e) {
	return fH(e, "picker");
}
function mH(e) {
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
function hH(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function gH(e) {
	return e.querySelector(`.${GV}`)?.value.trim() ?? "";
}
function _H(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = TH(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${xS(e.opacity)}`;
}
function vH(e, t, n, r, i) {
	if (e.getAttribute(sH) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = TH(t, n, r);
	return i === 255 ? a : `${a}${xS(i)}`;
}
function yH(e, t) {
	for (let n of e.querySelectorAll(`.${HV}`)) n.textContent !== t && (n.textContent = t);
}
function bH(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function xH(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function SH(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function CH(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		bS(e[0] * (1 - n)),
		bS(e[1] * (1 - n)),
		bS(e[2] * (1 - n))
	] : [
		bS(e[0] + (255 - e[0]) * n),
		bS(e[1] + (255 - e[1]) * n),
		bS(e[2] + (255 - e[2]) * n)
	];
}
function wH(e) {
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
function TH(e, t, n) {
	return `#${xS(e)}${xS(t)}${xS(n)}`;
}
function EH(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function DH(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function OH(e, t, n) {
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
		bS((o + a) * 255),
		bS((s + a) * 255),
		bS((c + a) * 255)
	];
}
function kH(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var AH = `:is(.ui-surface, .ui-card, .${wt})[${y}]`, jH = "ui-surface--clickable", MH = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Yl();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), LH(t, ["hover", "press"], (e) => IH(e.closest(Eu))), B(t, AH, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(AH));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(AH) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(jH)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), zH(e, "role", FH(e) ? "group" : "button"), zH(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : PH(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = NH(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function NH(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(jH) && t.hasAttribute("tabindex") ? t : null;
}
function PH(e) {
	let t = e.closest(od);
	return t !== null && t.closest(F)?.matches(".ui-items-view, .ui-table") === !0 && Ou(t) === e;
}
function FH(e) {
	for (let t of e.querySelectorAll(Eu)) if (ju(e, t)) return !0;
	return !1;
}
function IH(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${jH}`) ?? null; n !== null; n = n.parentElement?.closest(`.${jH}`) ?? null) t.push(n);
	return t;
}
function LH(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || RH(t, e, !1);
		for (let t of a) RH(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function RH(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), zH(e, $r, r.length === 0 ? null : r.sort().join(" "));
}
function zH(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var BH = "ui-table", VH = "ui-table--reorderable", HH = "ui-scroll-x--auto", UH = "ui-scroll-x--always", WH = `:scope > .${nr}`, GH = `.${ir}`, KH = "ui-table__header-cell", qH = `${KH}--pinned`, JH = `${WH} > .${rr} > .${KH}`, YH = `${JH}--pinned`, XH = "ui-table__host", ZH = `${WH} > .${XH}`, QH = `.${BH}, .${tr}, [${Zn}]`, $H = "--ui-table-columns", eU = "--ui-table-sticky-top", tU = "--ui-table-sticky-bottom", nU = "--ui-table-sized-columns", rU = "--ui-table-pin-", iU = 64, aU = "data-ui-table-cell-hidden", oU = "data-ui-table-cell-last", sU = "columns", cU = "hidden", lU = "order", uU = "layout", dU = 32, fU = 16, pU = class {
	root;
	store = new nP();
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
		if (this.root = e.root ?? document, this.drag = new wg({
			root: this.root,
			resolveHandle: (e) => e.closest(GH),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new wg({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), LH(this.root, ["hover", "press"], (e) => {
			let t = e.closest(GH)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Om) e !== "base" && matchMedia(Am(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${BH}`)), B(this.root, `.${BH}`, {
			childList: !0,
			relevant: vU
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), B(this.root, `.${BH}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(BH)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), B(this.root, `.${BH}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: yU
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(ZH);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), vz(t, () => this.pin(t));
			let e = t.querySelector(WH);
			e !== null && vz(e, () => mU(t, e));
			let n = t.querySelector(ZH);
			n !== null && (this.markScrollbar(t, n), vz(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, sU), r = n === null ? null : Jc(n);
		r !== null && r.length !== t.length ? (this.store.write(e, sU, null), this.store.writeBoot(e, uU, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, lU);
		if (i !== null && !xU(i, t)) {
			this.store.write(e, lU, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(hr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${BH}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = bU(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(HH) || e.classList.contains(UH);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(nU);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Cl(t, n);
				e.style.setProperty(nU, Qc(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${jd}${t}`, String(r[t])) : e.style.removeProperty(`${jd}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(er) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(er, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(ur) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(ur, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(VH)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= iU) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Zn}]`)) {
				let r = Number(t.getAttribute(Zn));
				!(r >= iU) || t.closest(`.${BH}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(aU, n.hidden.has(r)), t.toggleAttribute(oU, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Id(e, bU(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(JH)) {
			let e = Number(n.getAttribute(Zn)), r = n.getAttribute(Qn), i = n.classList.contains(qH) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: TU(r) ? r : null,
				startsHidden: n.hasAttribute($n),
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
		for (let e of t) (n[e.key] ?? wU(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, cU) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue($H).trim(), n = t.length === 0 ? null : Jc(t);
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
		n === null || i !== void 0 && n === wU(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, cU, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return bU(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(YH).length;
		if (t < 2) return;
		let n = yl(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${rU}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${BH}`)?.toggleAttribute(mr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(WH), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return gU(e) ? n.slice(1) : n;
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
		let t = e.target.closest(GH), n = t ?? (e.shiftKey ? hU(e.target) : null);
		if (n === null || this.drag.active || !M(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? qc(fU, i.sizes.reduce((e, t) => e + t, 0)) : fU;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${BH}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Zn)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = bU(c.places).filter((e) => !c.hidden.has(e));
			dk(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(GH) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${BH}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = ol(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(dU, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, _U(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, sU, t === null ? null : Qc(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(nU).trim(), n = e.getAttribute(er), r = {};
		t.length > 0 && (r[nU] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, uU, null);
			return;
		}
		this.store.writeBoot(e, uU, {
			styles: r,
			attributes: {
				[er]: n,
				[ur]: e.getAttribute(ur)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${BH}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = tl(t.getAttribute(Gn)), a = nl(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(Zn)), d = this.hiddenOf(t, s), f = bU(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${KH}`), n = t?.closest(`.${BH}`) ?? null;
		return t === null || n === null || !n.classList.contains(VH) || e.closest(GH) !== null || t.classList.contains(qH) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${BH}`), r = Number(e.getAttribute(Zn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(SU), s = n.querySelector(WH), c = getComputedStyle(n).direction === "rtl";
		return n.setAttribute(dr, ""), e.setAttribute(fr, ""), {
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
		for (let a of bU(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, CU(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(pr, "after") : o.cell.setAttribute(pr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(fr), t.table.removeAttribute(dr), CU(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Eg(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = bU(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, lU, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function mU(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${XH}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(eU, `${n}px`), e.style.setProperty(tU, `${r}px`);
}
function hU(e) {
	let t = e.matches(`.${KH}`) ? e.querySelector(`:scope > ${GH}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function gU(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function _U(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function vU(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(QH) || t.querySelector(QH) !== null)) return !0;
	return !1;
}
function yU(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(XH);
}
function bU(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function xU(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function SU(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function CU(e) {
	for (let t of e.querySelectorAll(`[${pr}]`)) t.removeAttribute(pr);
}
function wU(e) {
	return e.startsHidden || e.hideBelow !== null && Om.indexOf(Mm()) < Om.indexOf(e.hideBelow);
}
function TU(e) {
	return e !== null && Om.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var EU = /* @__PURE__ */ new WeakMap();
function DU(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(rn);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = OU(i, a) ?? kU(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) n.has(t) || t.remove();
}
function OU(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : EU.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function kU(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (NU(i, t.getAttribute(b)), EU.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function AU(e, t) {
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
function jU(e) {
	return e.find((e) => !e.classList.contains(_i));
}
function MU(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return NU(o, r), o.appendChild(a), o;
}
function NU(e, t) {
	e.setAttribute(Ft, ""), t === null ? e.removeAttribute(It) : e.setAttribute(It, t);
}
var PU = "bottom", FU = "pending", IU = "focus";
function LU(e, t, n) {
	let r = RU(e, t);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r ??= zU(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
function RU(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function zU(e) {
	let t = document.createElement("div");
	return t.setAttribute(Yt, e), t.style.flexShrink = "0", t;
}
function BU(e, t) {
	let n = RU(e, IU);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? zU(IU);
	return r.style.height = `${t}px`, r;
}
function VU(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function HU(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var UU = /* @__PURE__ */ new WeakMap();
function WU(e) {
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) t.remove();
}
function GU(e, t, n, r, i, a) {
	let o = ZO(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = HO(i.getItemsFilterSortMetadata(t), a, IO(e));
	if (c && !l && (WU(e), UU.delete(e)), o.length === 0) return;
	let d = hO(e);
	if (!l) {
		HU(e, [...UO(o, u, r), ...mO(d)]);
		return;
	}
	let { buckets: f, order: p } = AU(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = UU.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = UO(n, u, r));
		let i = t === "" ? void 0 : jU(n);
		if (i !== void 0) {
			let n = KU(e, h?.get(t), i) ?? MU(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) v.has(t) || t.remove();
	UU.set(e, g), HU(e, [..._, ...mO(d)]);
}
function KU(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return NU(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var qU = "ui-tree-rules", JU = `:scope > .${or}:not(.${lr})`, YU = null;
function XU(e, t, n) {
	if (YU !== null) {
		YU.hosts.set(e, {
			componentId: t,
			context: n
		}), W(e) === "virtualized" && YU.drawing.add(e);
		return;
	}
	ZU(e, t, n);
}
function ZU(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(qU, { bubbles: !0 })), gO(e, t, n.templates, n.renderer, e.querySelector(JU) !== null);
		return;
	}
	switch (W(e)) {
		case "windowed":
			gO(e, t, n.templates, n.renderer), $U(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			zO(e, t, n.metadata, n.renderer, n.state), QU(e), gO(e, t, n.templates, n.renderer), GU(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function QU(e) {
	let t = Af(e);
	t !== null && kf(t, G(e).filter((e) => e instanceof HTMLElement));
}
function $U(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	DU(e, (e) => MU(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function eW(e) {
	if (YU !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	YU = t;
	try {
		e();
	} finally {
		YU = null;
		for (let [e, n] of t.hosts) tW(e, n);
	}
}
function tW(e, t) {
	try {
		e.isConnected && ZU(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function nW(e) {
	if (YU !== null && YU.drawing.size !== 0) for (let t of YU.drawing) {
		let n = YU.hosts.get(t);
		n === void 0 || !e(t) || (YU.drawing.delete(t), YU.hosts.delete(t), tW(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var rW = "fold", iW = ["fold-hidden", "fold-shown"], aW = ".ui-table", oW = `:scope > .${nr} > .${rr} > [role='columnheader']`, sW = `:scope > .${ir}`, cW = "input:not([type='hidden']), button, select, textarea, a[href]", lW = /* @__PURE__ */ new WeakMap();
function uW(e) {
	for (let t of e.querySelectorAll(oW)) {
		let e = dW(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function dW(e) {
	let t = e.querySelector(cW);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(sW);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function fW(e, t = null) {
	let n = pW(e), r = lW.get(e), i = n.find((e) => t !== null && hW(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (mW(e, i), !0);
}
function pW(e) {
	let t = Md(e), n = [];
	for (let r of e.querySelectorAll(oW)) {
		let e = dW(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && P(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function mW(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), lW.set(e, t), t.focus();
}
function hW(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function gW(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(aW) && dW(t) === e ? n : null;
}
function _W(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(hW(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Pu(e.key, "horizontal")) return !1;
	let r = Nu({
		key: e.key,
		items: pW(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && mW(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var vW = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), yW = ".ui-table", bW = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), xW = `:scope > [${x}], :scope > .${nr}, :scope > .${nr} > [${x}]`, SW = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(F)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), B(this.root, F, { childList: !0 }, (e) => this.applyAll(e)), B(this.root, F, { attributeFilter: [
			ei,
			ni,
			ri,
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
		let t = Ad(e);
		gd(e, t);
		for (let t of e.querySelectorAll(xW)) wW(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(yW) && uW(e);
			for (let n of t) {
				let t = Ou(n);
				t !== null && wW(t);
				for (let e of ku(n)) wW(e);
				CW(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : Td(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = $D(r, en) !== null, a = n === "first" ? QD(r) === 0 && !eO(r, "data-ui-window-more-before") : !eO(r, nn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = bf(n === "first" ? "Home" : "End", t, null, MW(e));
		o !== null && (Qd(e, t, o), e.getAttribute("data-ui-selection") === "one" && vd(e, t, o, cd));
	}
	remark(e) {
		let t = Ad(e);
		gd(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, F);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Ad(n);
		if (Qd(n, i, r, e.target instanceof Element ? hf(r, e.target) : null), R(n), n.hasAttribute("data-ui-no-row-select")) {
			dd(n, r);
			return;
		}
		vd(n, i, r, fd(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(od), r = n?.closest(F) ?? null;
		return n === null || r === null || n.closest(F) !== r || !r.matches(t) || O(r) ? null : Mu(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Td(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, sd);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Tf(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || bu(e)) return;
		let t = gW(e.target);
		if (t !== null && !O(t)) {
			_W(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Ud(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r) || ef(r) && TW(e) && this.handleCellKey(r, e)) return;
		let i = MW(r);
		if (!vW.has(e.key) && !vf(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Ad(r), o = qd(a), s = bf(e.key, a, Jd(a), i);
		if (s !== null) {
			e.preventDefault(), Qd(r, a, s, e.key === "ArrowUp" && !e.shiftKey && ef(r) ? mf(s) : null), DW(r, a, o, s, pd(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(yW) && fW(r, lf(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = Ou(o);
		switch (e.key) {
			case " ":
				OW(r, a, o, c);
				break;
			case "Enter":
				AW(r, a, o, c);
				break;
			case "Delete":
				if (!kW(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Ad(e), r = Jd(n);
		if (r === null || k(r)) return !1;
		let i = cf(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = uf(e, r, i, t.key);
				return o !== null && Qd(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? df(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), Qd(e, n, r, o), !0);
			}
			default: return i !== null && EW(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Td(e) : null;
		if (n === null || W(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? QD(n) === 0 && !eO(n, "data-ui-window-more-before") : !eO(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Hu(n, r ? 0 : Vu(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Td(e);
		if (n === void 0 || r === null) return;
		let i = Pf(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Jd(Ad(e)) : null, o = i ?? (a === null ? null : L(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Td(e), n = Pf(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Ad(e), r = Jd(n) ?? bf("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (Qd(e, n, r, nf(r, t)), e.getAttribute("data-ui-selection") === "one" && vd(e, n, r, cd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(xW)].includes(t)) {
			R(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(F) && e.target.matches(".ui-items-view, .ui-table") && !O(e.target) && !Qf()) {
			Xd(e.target, Ad(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(od) : null, i = r?.closest(F) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || Mu(e.target, r) === null || Qd(i, Ad(i), r, e.target instanceof Element ? hf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && ep(n, !0);
			for (let e of n.querySelectorAll(xW)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) wW(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(od)) continue;
			let n = e.closest(F);
			n !== null && n.matches(".ui-items-view, .ui-table") && CW(n, e, e.hasAttribute(Ne));
		}
	}
};
function CW(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(F) === e && lV(n);
		return;
	}
	for (let n of t.querySelectorAll(Lf)) n.tabIndex >= 0 && n.parentElement?.closest(F) === e && ju(t, n) && cV(n);
}
function wW(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function TW(e) {
	return bW.has(e.key) || Jw(e) !== null;
}
function EW(e, t) {
	let n = t.key, r = Jw(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && _f(e, t)) return !0;
	let a = Ou(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !pf(e))) return !1;
	let o = op(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function DW(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && ud(e, n), vd(e, t, r, i, a));
}
function OW(e, t, n, r) {
	vd(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || jW(n, r);
}
function kW(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = NW(t, n);
	for (let e of r) Tf(e, "remove");
	return r.length > 0;
}
function AW(e, t, n, r) {
	md(e) && !_d(t).includes(n) && vd(e, t, n, cd), jW(n, r), r === null && Tf(n, "open");
}
function jW(e, t) {
	t === null ? Tf(e, wf) : t.click();
}
function MW(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function NW(e, t) {
	let n = _d(e);
	return (n.includes(t) ? n.filter((e) => e === t || I(e) !== null) : [t]).filter((e) => !Hc(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var PW = "ui-tree__row--folded", FW = "ui-tree__row--dragging", IW = "ui-tree__loading", LW = "ui-tree__loading-ring", RW = "ui-tree-node__text", zW = "ui-tree-node__toggle", BW = "ui-tree-node__rename", VW = ".ui-text__title", HW = cr, UW = "--ui-tree-depth", WW = "expanded", GW = 200, KW = 600, qW = .25, JW = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, YW = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), XW = "ui-tree-unfold-settled", ZW = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(XW, { bubbles: !0 }));
	} }
}, QW = class {
	root;
	store = new nP();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(qU, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${ar}`) : null;
			t !== null && (this.layout(t), kf(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(XW, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => L(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${ar}`)), B(this.root, `.${ar}`, {
			childList: !0,
			attributeFilter: [
				_r,
				vr,
				br,
				Tr
			],
			relevant: rG
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Kk(e)?.getAttribute(_r);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = L(e), r = Kk(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(vr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(UW, String(u)), e.setAttribute("aria-level", String(u + 1)), Zd(e, r?.querySelector(`:scope > .${RW}`) ?? null), e.classList.toggle(PW, !d), e.classList.toggle(lr, _), e.removeAttribute(wr), e.draggable = i && oO(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Sr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Sr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Sr), d && g && !_), s.set(n, {
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
		return Kk(e.row)?.hasAttribute(br) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, rW, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of iW) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Na(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = IO(t);
		if (r === void 0 && i === null) return null;
		let a = HO(r, this.rules.state, i), o = VO(r, this.rules.state, i);
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
			let t = Kk(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => WO(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(L(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${IW}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = L(o), c = i.getItemValue(o);
			if (c === void 0 || BO(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Kk(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(IW) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? iG();
		o.style.setProperty(UW, String(t)), o.classList.toggle(PW, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${zW}`) === null && (!Hc(r, "data-ui-unselectable") || Mu(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Mu(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Tf(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${or}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || O(t) || Qf() || Xd(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || !(e.target instanceof Element)) return;
		let t = Ud(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && M(e, { alt: !0 }) ? JW[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !YW.has(e.key) && !vf(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = qd(i), o = bf(e.key, i, Jd(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, pd(n, e));
			return;
		}
		if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					OW(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, bf("ArrowDown", i, a, "vertical"), cd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), cd);
					break;
				case "Enter":
					AW(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !kW(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = qd(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = oG(n), a = L(r), o = Qk(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => L(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		dk(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Hc(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = aG(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Tr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = aO(t, this.rowsOf(n)), o = iO(n, i, a);
		r ? rv(e, n, t, FW, L(t), a.filter((e) => e !== t), cO(o, !0)) : av(e, L(t), cO(o, !1)), lO(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(FW));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ar}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${or}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = L(t), o = (e) => n.some((t) => L(t) === e || nG(i, e, L(t))), s = qk(t, Kk(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? qW : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = oG(f), m = Number(t.style.getPropertyValue(UW)) || 0, h = new Set(n.map(L)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : nA(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !Jk(v.parent, (e) => f.find((t) => L(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), KW)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ar}`);
		t !== null && ov(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ar}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${HW}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && nG(a, L(e), L(t)))), s = r.getAttribute(HW) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), iv(t, FW), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = rA(oG(this.rowsOf(e)), t.map(L), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = Kk(e)?.querySelector(`.${RW}`) ?? null;
			r !== null && (r.setAttribute(Cr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ck(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = aG(e)?.closest(".ui-tree") ?? null;
		t !== null && (iv(t, FW), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Xk(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(L(n), Kk(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		i.delete(r), i.set(r, n), $W(i, a);
		let o = n ? a.filter((e) => e.classList.contains(PW)) : [];
		this.store.writeJson(e, WW, [...i]), this.layout(e), tG(o.filter((e) => !e.classList.contains(PW)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = eG(this.store.readJson(e, WW)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = qd(r);
		Qd(e, r, t), n !== null && DW(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = Kk(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => L(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${ar}`), n = Kk(e), r = n?.querySelector(VW) ?? null;
		t === null || n === null || r === null || Hc(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), tu({
			container: n,
			title: r,
			className: BW,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(xr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function $W(e, t) {
	if (e.size <= GW) return;
	let n = new Set(t.map(L)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= GW) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function eG(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function tG(e) {
	if (!(e.length === 0 || Tm())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: z.fast,
		easing: z.enter
	});
}
function nG(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function rG(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function iG() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = IW, e.setAttribute(fO, ""), e.setAttribute("aria-hidden", "true"), t.className = LW, e.append(t, D.text("ui.tree.loading")), e;
}
function aG(e) {
	return e.target instanceof Element ? e.target.closest(`.${or}`) : null;
}
function oG(e) {
	return e.map((e) => ({
		key: L(e),
		parent: Kk(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: qk(e, Kk(e)),
		shown: !e.classList.contains(lr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var sG = {
	visibilityState: () => document.visibilityState,
	notificationPermission: lG
};
function cG(e) {
	return e !== "hidden";
}
function lG() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var uG = 200;
function dG(e = sG) {
	return {
		visible: cG(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var fG = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? sG, this.settleMilliseconds = e.settleMilliseconds ?? uG;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = dG(this.source), this.held;
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
		let t = dG(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function pG(e) {
	return {
		permission: lG,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function mG(e, t, n = pG()) {
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
function hG(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && gG(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function gG(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function _G(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var J = "ui-tabs-view", vG = "ui-tab-item__label", yG = "ui-tab-item__close", bG = "ui-tab-item__rename", xG = "ui-tab-item__caption", SG = "ui-tab-item__pin", CG = ".ui-text__title", wG = "ui-tab-item--dragging", TG = "ui-tab-item__caption--overflowed", EG = "ui-tabs-view--overflowing", DG = "ui-tabs-view--no-overflow", OG = "ui-tab-item__page", kG = "ui-tab-item--selected", AG = `.${S}`, jG = "tab-menu-entry", MG = {
	name: jG,
	registration: { dynamicParameters: (e) => JP(e.domEvent.detail?.entry, e.dynamicParameters) }
}, NG = "tab-pin";
function PG(e) {
	return {
		name: NG,
		registration: ZD((e) => hk(e.target), e)
	};
}
var FG = "--ui-tabs-view-strip", IG = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HB({
			rootClass: J,
			overflowingClass: EG,
			wraps: (e) => e.classList.contains(DG),
			hiddenClass: TG,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => qG(e) === t.key))?.querySelector(`.${vG}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener($P, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), LH(this.root, ["press"], (e) => {
			let t = e.closest(`.${yG}`)?.closest(`.${xG}`) ?? null;
			return t === null ? [] : [t];
		}), B(this.root, `.${J}`, {
			childList: !0,
			attributeFilter: [
				ai,
				be,
				ce,
				...di
			],
			relevant: (e) => !Kh(e, `.${OG}`, `.${J}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${J}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		RG(e, t);
		let n = t.filter(TF), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = id(n, r, qG);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(kG))?.querySelector(`.${xG}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = qG(e) === r;
			e.classList.toggle(kG, t);
			let i = e.querySelector(`.${xG}`);
			i !== null && (i.draggable = a, YB(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${vG}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${OG}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${OG}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), XB(o, c), o !== null && o !== c && ZB(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${vG}`);
			t === null || e.classList.contains(TG) || (u.push(t), e === c && (d = t));
		}
		N(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && R(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !TF(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(FG, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${LB}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => qG(e) === t)?.querySelector(`.${vG}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(TF).map((e) => ({
				key: qG(e),
				title: e.querySelector(`.${vG}`)?.textContent?.trim() ?? qG(e),
				current: qG(e) === t,
				disabled: O(e.querySelector(`.${vG}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${pk}`);
		if (n === null || !n.classList.contains(J) || r === null || r.closest(`.${J}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = VG(n, r), a = UG(t), o = a.map((e) => {
			if (HG(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? TF(e) ? "shown" : "hidden";
		});
		if (qP(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: qG(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(AG);
		if (t === null || n === null || !n.classList.contains(J) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => qG(e) === a.key);
		if (i.length === 0 || r.matches(`${zn}, ${Rn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(jG, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (VG(n, o).get(i) !== !0) return !0;
		switch (i) {
			case BP: {
				let e = o.querySelector(`.${vG}`);
				e !== null && this.startRename(e);
				break;
			}
			case VP:
			case HP:
				this.setPinned(n, o, i === VP);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${xG} > .${SG}`);
		t.toggleAttribute(ui, n), r !== null && (r.toggleAttribute(ui, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = _G(a.map(KG));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? mk(a[a.length - 1]).after(mk(t)) : mk(s).before(mk(t)), t.dispatchEvent(new Event(NG, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${LB}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(J)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = WG(e.target), i = r?.closest(`.${J}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${pk}`);
		a !== null && a.closest(`.${J}`) === i && (e.preventDefault(), this.select(i, qG(a)), document.activeElement !== r && R(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${yG}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${J}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), zG(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = WG(e.target), n = t?.closest(`.${J}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(CG) ?? e, r = e.closest(`.${pk}`);
		t === null || r === null || gk(r, "data-ui-unrenamable") || tu({
			container: t,
			title: n,
			className: bG,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(oi, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => R(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || bu(e)) return;
		let t = e.target.closest(`.${vG}`), n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && M(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${pk}`);
		if (r === null || r.closest(`.${J}`) !== n) return;
		if (e.key === "Delete" && M(e)) {
			if (!BG(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${vG}`)).filter((e) => e !== null), a = Nu({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${pk}`);
		o !== null && this.select(n, qG(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || gk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? mk(t).after(mk(i)) : mk(t).before(mk(i)), Ck(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = GG(e);
		if (t === null) return;
		if (gk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		rv(e, t.closest(`.${J}`) ?? t, t, wG, qG(t));
		let n = mk(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${xG}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${wG}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${xG}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = mk(r), o = t.hasAttribute("data-ui-tab-pinned") ? LG(n, a) : null, s = o ?? mk(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${J}`);
		t !== null && t.querySelector(`.${wG}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = GG(e);
		if (t === null) return;
		t.classList.remove(wG);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(mk(t), n.next);
			return;
		}
		let r = mk(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${J}`);
		i !== null && Ck(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		rd(e, t, {
			attribute: ai,
			bindingAttribute: ii,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return td(e, `.${pk}`, `.${J}`);
	}
};
function LG(e, t) {
	let n = null;
	for (let r of td(e, `.${pk}`, `.${J}`)) {
		let e = mk(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function RG(e, t) {
	let n = !t.some((e) => !gk(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function zG(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !gk(t, "data-ui-unremovable");
}
function BG(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && zG(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !O(t);
}
function VG(e, t) {
	return KP(GP(e.getAttribute(xe)), {
		pinned: t.hasAttribute(ui),
		renamable: !gk(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && zG(e, t)
	});
}
function HG(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function UG(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function WG(e) {
	return e.closest(`.${yG}`) !== null || eu(e) ? null : e.closest(`.${xG}`)?.querySelector(`:scope > .${vG}`) ?? null;
}
function GG(e) {
	return e.target instanceof Element ? e.target.closest(`.${xG}`)?.closest(".ui-tab-item") ?? null : null;
}
function KG(e) {
	return { pinned: e.hasAttribute(ui) };
}
function qG(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var JG = "button.ui-text__fold-toggle", YG = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(JG);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, XG = "ui-temporal-input__segments", ZG = "ui-temporal-input__segment", QG = "ui-temporal-input__segment-literal", $G = "ui-temporal-input__segment--empty", eK = "data-ui-temporal-segment", tK = "data-ui-temporal-step-direction", nK = "data-ui-temporal-segments-of", rK = "--", iK = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), aK = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ja(e.components, `.${K}`));
		}), B(this.root, `.${K}`, { attributeFilter: [...JA] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) XA(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${XG}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = ZA(e), r = nj(e), i = q(e, uj(t));
		t.getAttribute(nK) !== n && (t.replaceChildren(...oK(n).map((e) => cK(e))), t.setAttribute(nK, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(eK);
			if (t === null) {
				n.textContent = uK(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = dK(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle($G, i === null), n.tabIndex = 0, fK(n, t, i, A(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return;
		let t = mK(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute(eK), i = pK(t), a = iK.get(e.key);
		if (a !== void 0) {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), gK(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), yj(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = _K(e.key, nj(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = mK(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = mK(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Wy(this.wheelTurn, Uy(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(eK), n < 0 ? 1 : -1, pK(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${tK}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${tK}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = hK(n) ?? n.querySelector(`.${ZG}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(eK), t.getAttribute(tK) === "up" ? 1 : -1, pK(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${ZG}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, Aj(e, yK(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = vK(t), o = $A(QA(e), a) * n, s = a === "hour" ? 24 : 60, c = ((ej(i, a) + o) % s + s) % s;
		this.write(e, Aj(e, tj(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? tj(t, "hour", bK(l, t.getHours() >= 12)) : tj(t, vK(n), l), i);
		}
		u && gK(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, yK(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? kj(e);
	}
	write(e, t, n) {
		yj(e, t, n), Dj(e), this.applySegments(e);
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
function oK(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = us(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(sK(r)), n += r.length;
	}
	return t;
}
function sK(e) {
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
function cK(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = QG, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = ZG, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(eK, e.unit), t.dataset.width = String(e.width), lK(t, e.unit), t;
}
function lK(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = vK(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function uK(e, t, n, r) {
	return t && n !== null ? as(n, e, r) : e;
}
function dK(e, t, n, r) {
	if (n === null) return rK;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? js(n.getHours()) : ej(n, vK(e));
	return String(i).padStart(t, "0");
}
function fK(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? js(n.getHours()) : ej(n, vK(t))));
}
function pK(e) {
	return uj(e.closest(`.${XG}`));
}
function mK(e) {
	let t = e instanceof Element ? e.closest(`.${ZG}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || A(n) ? null : t;
}
function hK(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${ZG}`) : null;
}
function gK(e, t, n) {
	Nu({
		key: n,
		items: [...e.querySelectorAll(`.${ZG}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function _K(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function vK(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function yK(e, t) {
	return tj(e, "hour", bK(js(e.getHours()), t === "pm"));
}
function bK(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var xK = "datetime", SK = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${xt}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${xt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(ja(e.components, `.${xt}`))), B(this.root, `.${xt}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [xK],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Fs(a.getAttribute(Ct)), o = Ps(a.getAttribute(xK)), s = a.querySelector(`.${St}`);
			if (s === null || t && !CK(e, o, r)) continue;
			let c = o === null ? "" : zs(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Is(e) && o !== null;
		}
		i && hc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${xt}:is([${Ct}="relative"], [${Ct}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function CK(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Bs(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var wK = `.${wt}`, TK = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), D.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => EK(ja(e.components, wK))), B(this.root, wK, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				Ot,
				kt,
				At,
				jt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(wK) !== null)
		}, EK);
	}
	applyAll() {
		EK(this.root.querySelectorAll(wK));
	}
};
function EK(e) {
	let t = D.language || document.documentElement.lang;
	for (let n of e) Uv(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var DK = /* @__PURE__ */ new Map();
function OK(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest(C) === e) return t;
	return null;
}
function kK(e, t, n, r) {
	let i = AK(e, t);
	return i !== null && (DK.set(e, {
		key: t,
		block: n
	}), jK(e, i, n, r), !0);
}
function AK(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function jK(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = zu(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = MK(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function MK(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function NK(e) {
	let t = DK.get(e);
	if (t === void 0) return;
	let n = AK(e, t.key);
	if (n === null) {
		DK.delete(e);
		return;
	}
	jK(e, n, t.block, "auto");
}
function PK(e) {
	if (!(DK.size === 0 || !(e instanceof Node))) for (let t of [...DK.keys()]) (!t.isConnected || zu(t).contains(e)) && DK.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var FK = "data-ui-scroll-anchor", IK = "End", LK = `[${FK}="${IK}"]`, RK = 4, zK = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], BK = /* @__PURE__ */ new WeakSet();
function VK(e) {
	BK.add(e);
}
function HK(e) {
	PK(e);
	for (let t = e.closest(LK); t !== null; t = t.parentElement?.closest(LK) ?? null) BK.delete(t);
}
var UK = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of zK) this.root.addEventListener(e, (e) => WK(e), {
			capture: !0,
			passive: !0
		});
		B(this.root, `[${FK}="${IK}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [cn]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !KK(t) || this.pinned.set(t, BK.has(t) || JK(t) && !qK(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${FK}="${IK}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), BK.has(t)) {
				this.pinned.set(t, !0), GK(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (qK(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), GK(t);
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
			if (!e.isConnected || r === null || !KK(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? GK(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !KK(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && GK(e);
	}
	followsEnd(e) {
		return BK.has(e) || this.pinned.get(e) !== !1 && !qK(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function WK(e) {
	PK(e.target);
	let t = e.target instanceof Element ? e.target.closest(LK) : null;
	t !== null && BK.delete(t);
}
function GK(e) {
	e.scrollTop = e.scrollHeight;
}
function KK(e) {
	return e.getAttribute(FK) === IK;
}
function qK(e) {
	return eO(e, nn);
}
function JK(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= RK;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var YK = `${Tu}, [role='menu'], [role='tab']`, XK = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? ZK, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(YK) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function ZK(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function QK(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = eq(e, a, n), s = eq(e, a + 1, n);
	return tq(t, o.top, s.top, o.line, s.line);
}
function $K(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = eq(e, a, n), s = eq(e, a + 1, n);
	return tq(t, o.line, s.line, o.top, s.top);
}
function eq(e, t, n) {
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
function tq(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var nq = 250, rq = class {
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
		if (n !== void 0 && t - n.at < nq && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Kt}="${Bi(e)}"]`)];
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
		let n = iq(e, "data-ui-scroll-viewport") ?? aq(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? sq(e) : null, a = i === null ? null : sq(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = $K(a, QK(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? oq(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function iq(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function aq(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : iq(e, x);
	return t === null ? null : zu(t);
}
function oq(e, t) {
	return t > 0 ? e / t : 0;
}
function sq(e) {
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
var cq = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", lq = `.${Ei}, .ui-action, .${S}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${cq}`, uq = ".ui-expander__header", dq = "ui-key-value-action__row", fq = `${lq}, ${`${od}, .${dq}`}`, pq = "ui-pressing", mq = "ui-press-held", hq = class {
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
		if (t === null || typeof t.animate != "function" || Tm()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i)), { wave: o, ink: s } = gq(r - t.clientLeft, i - t.clientTop, a);
		t.classList.add(pq, mq), t.append(o);
		let c = s.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
			duration: z.ripple,
			easing: z.ease,
			fill: "forwards"
		});
		this.presses.set(e.pointerId, {
			element: t,
			wave: o,
			started: performance.now(),
			grow: c,
			fade: null
		});
	}
	pressedElement(e) {
		if (e.closest(".ui-tab-item__close, .ui-tab-item__rename") !== null) return null;
		let t = e.closest(cq) ?? e.closest(fq);
		if (t === null || O(t) || t.matches(uq)) return null;
		let n = e.closest(Ci);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(lq) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Mu(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(F), r = n !== null && !e.classList.contains(dq) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Hc(e, "data-ui-unselectable");
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
		e instanceof PointerEvent && this.end(e.pointerId, t);
	}
	finishAll() {
		for (let [e, t] of [...this.presses]) this.finish(e, t);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		n.element.classList.remove(mq);
		let r = Math.max(0, z.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, z.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: z.normal,
			delay: i,
			easing: z.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(pq, mq), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function gq(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = Lh, r.setAttribute("aria-hidden", "true"), i.className = Rh, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var _q = "ui-overlay-scrollbar", vq = "ui-overlay-scrollbar__box", yq = "ui-overlay-scrollbar__thumb", bq = "ui-overlay-scrollbar--shown", xq = "ui-overlay-scrollbar__thumb--held", Sq = "(hover: hover) and (forced-colors: none)", Cq = "--ui-overlay-thumb", wq = "--ui-scroll-hung", Tq = 12, Eq = 2, Dq = 24, Oq = 900, kq = 400, Aq = 16, jq = class {
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
	scrolling = !1;
	fade = 0;
	inputAt = -Infinity;
	constructor(e = document) {
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = _q, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), ag((e) => e.includes(this.bars.y.thumb) ? this.bars.y.scroller : e.includes(this.bars.x.thumb) ? this.bars.x.scroller : null), this.media = window.matchMedia(Sq), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		let n = e.createElement("div"), r = e.createElement("div");
		return n.className = `${vq} ${vq}--${t}`, r.className = `${yq} ${yq}--${t}`, n.append(r), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
			axis: t,
			box: n,
			thumb: r,
			scroller: null,
			view: null,
			rtl: !1,
			near: !1
		};
	}
	follow() {
		this.active = this.media.matches, this.drag = null, this.target = null, this.hovered = !1, this.scrolling = !1, this.bars.y.near = !1, this.bars.x.near = !1, window.clearTimeout(this.fade), this.forget(), this.active ? (this.raise(), this.schedule()) : this.layer.matches(":popover-open") && this.layer.hidePopover();
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
		}, this.approach(), !(t === this.target || t !== null && this.layer.contains(t)) && (this.target = t, this.pickTarget = !0, this.schedule());
	}
	handleScroll(e) {
		if (!this.active) return;
		let t = e.target instanceof Element ? e.target : document.scrollingElement;
		if (t !== null) {
			if (t === this.bars.y.scroller || t === this.bars.x.scroller) {
				(this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater();
				return;
			}
			if (this.hovered || this.drag !== null) {
				this.repick = this.hovered && this.drag === null, this.schedule();
				return;
			}
			this.readerScrolled(e) && (this.pick(Lq(t, "y") ? t : null, Lq(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule());
		}
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < kq;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, Oq), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && Mq(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) e.box.classList.toggle(bq, e.view !== null && (this.scrolling || e.near || this.drag?.axis === e.axis));
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
		}, Oq);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(Nq(e, "y"), Nq(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !Lq(t, e)) return null;
		let n = Vq(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t;
		return {
			view: n,
			thumb: Uq(t, e, e === "y" ? Bq(t) : Rq(t), r),
			rtl: qq(t)
		};
	}
	apply(e, t) {
		if (e.view = t?.view ?? null, t === null) return;
		let { view: n, thumb: r } = t;
		e.rtl = t.rtl, Object.assign(e.box.style, {
			left: `${n.left}px`,
			top: `${n.top}px`,
			width: `${n.width}px`,
			height: `${n.height}px`
		}), Object.assign(e.thumb.style, {
			left: `${r.left - n.left}px`,
			top: `${r.top - n.top}px`,
			width: `${r.width}px`,
			height: `${r.height}px`
		});
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && qq(n), i = Wq(n, t, Rq(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		HK(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(xq), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: Kq(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = Gq(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = Gq(t.scroll, n, t.ratio, t.rtl);
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
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = Gq(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = Gq(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(xq), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * Iq(e, n, "x"), a = e.deltaY * Iq(e, n, "y"), o = Pq(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (HK(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function Mq(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function Nq(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (Lq(n, t)) return n;
	return null;
}
function Pq(e, t, n) {
	for (let r = e; r !== null; r = Nq(r.parentElement, t)) if (Lq(r, t) && Fq(r, t, n)) return r;
	return null;
}
function Fq(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = Kq(e, t), a = t === "x" && qq(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function Iq(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? Aq : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function Lq(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(Cq).trim() !== "none";
}
function Rq(e) {
	if (e === document.scrollingElement) return Jq(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = zq(t.width, n?.offsetWidth), i = zq(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return Jq(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function zq(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function Bq(e) {
	let t = Rq(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(wq));
	return n > 0 ? qq(e) ? Jq(t.left - n, t.top, t.right, t.bottom) : Jq(t.left, t.top, t.right + n, t.bottom) : t;
}
function Vq(e) {
	let t = Bq(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = Yq(t, Hq(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = Yq(t, Jq(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function Hq(e, t) {
	let n = Rq(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return Jq(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function Uq(e, t, n, r) {
	let i = qq(e), a = Wq(e, t, n, r, i), o = a.max > 0 ? Kq(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - Tq,
		top: a.start + o,
		width: Tq,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - Tq,
		width: a.thumb,
		height: Tq
	};
}
function Wq(e, t, n, r, i) {
	let a = (t === "y" ? n.top : n.left) + Eq + (r && i && t === "x" ? Tq : 0), o = (t === "y" ? n.height : n.width) - 4 - (r ? Tq : 0), s = t === "y" ? e.clientHeight : e.clientWidth, c = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: a,
		length: o,
		thumb: Math.min(o, Math.max(Dq, o * s / c)),
		max: c - s
	};
}
function Gq(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function Kq(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function qq(e) {
	return getComputedStyle(e).direction === "rtl";
}
function Jq(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function Yq(e, t) {
	return Jq(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var Xq = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), Zq = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], Qq = `.${mi}, .${hi}`, $q = RegExp(`(^|\\s)(${mi}|${hi})(\\s|$)`), eJ = RegExp(`(^|\\s)${gi}(\\s|$)`), tJ = "[type='range']", nJ = /* @__PURE__ */ new WeakSet(), rJ = /* @__PURE__ */ new WeakSet();
function iJ(e = document) {
	let t = e === document ? window : e;
	for (let e of Zq) t.addEventListener(e, fJ, !0);
	t.addEventListener("keydown", mJ, !0), t.addEventListener("change", hJ, !0), t.addEventListener("pointerdown", gJ, !0), t.addEventListener("mousedown", gJ, !0), lJ(e.querySelectorAll(Qq)), sJ(e.querySelectorAll(`[${pi}]`)), oJ(e.querySelectorAll(tJ)), new MutationObserver((e) => {
		for (let t of e) aJ(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", pi],
		attributeOldValue: !0
	});
}
function aJ(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			cJ(t, e.oldValue !== null);
			return;
		}
		let n = $q.test(e.oldValue ?? ""), r = t.matches(Qq);
		n !== r && (uJ(t, r), cJ(t)), eJ.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && oJ(t.querySelectorAll(tJ));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(Qq) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && dJ(n), n.matches(Qq) && uJ(n, !0), lJ(n.querySelectorAll(Qq)), cJ(n), sJ(n.querySelectorAll(`[${pi}]`)), oJ([n, ...n.querySelectorAll(tJ)]));
}
function oJ(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== nJ.has(t) && (e ? (nJ.add(t), t.addEventListener("touchstart", gJ, { passive: !1 })) : (nJ.delete(t), t.removeEventListener("touchstart", gJ)));
	}
}
function sJ(e) {
	for (let t of e) cJ(t);
}
function cJ(e, t = !1) {
	let n = e.getAttribute(pi);
	n === null && !t || (e.matches(Qq) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Va(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function lJ(e) {
	for (let t of e) uJ(t, !0);
}
function uJ(e, t) {
	for (let n of e.children) t ? dJ(n) : rJ.has(n) && (rJ.delete(n), n.removeAttribute("inert"));
}
function dJ(e) {
	e.hasAttribute("inert") || (rJ.add(e), e.setAttribute("inert", ""));
}
function fJ(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && fg(e), _J(e)) : e.type === "click" && pJ(e.target) && e.preventDefault());
}
function pJ(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function mJ(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && O(e.target)) {
			_J(e);
			return;
		}
		!Xq.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault();
	}
}
function hJ(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function gJ(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !A(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function _J(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var vJ = /* @__PURE__ */ new WeakMap(), yJ = /* @__PURE__ */ new WeakSet(), bJ = /* @__PURE__ */ new WeakSet(), xJ = new s_({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = vJ.get(e);
		vJ.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => yJ.has(e),
	sheetOnPhone: ({ popup: e }) => bJ.has(e)
});
function SJ(e) {
	return {
		open: (e, t, n) => CJ(e, t, n, (e) => xJ.open(e)),
		openList: wJ,
		listKey: aN,
		followPointer: cN,
		focusReturn: (t) => Sp(t, e)
	};
}
function CJ(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => xJ.popupOf(i) === t;
	return vJ.set(t, n.onDismiss), n.closesOnTab === !0 ? yJ.add(t) : yJ.delete(t), n.sheetOnPhone === !0 ? bJ.add(t) : bJ.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (vJ.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && xJ.reposition(i);
		},
		close: () => {
			a() && xJ.close(i);
		}
	};
}
function wJ(e, t, n) {
	return CJ(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => iN(xJ, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var TJ = "--ui-color-series-count", EJ = "--ui-color-series-", DJ = 8;
function OJ(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(TJ));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : DJ;
}
function kJ(e, t) {
	return `var(${EJ}${e % t + 1})`;
}
var AJ = {
	count: OJ,
	color: kJ
}, jJ = ".ui-items-view", MJ = `:scope > [${x}]`, NJ = `:scope > [${Ft}]`, PJ = "ui-orientation--horizontal", FJ = 1, IJ = [{
	edge: "first",
	holder: `:scope > [${Bt}="${Ht}"]`,
	bound: `${Je}first-visible-key`,
	attribute: dt
}, {
	edge: "last",
	holder: `:scope > [${Bt}="${Ut}"]`,
	bound: `${Je}last-visible-key`,
	attribute: ft
}], LJ = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, B(this.root, jJ, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Bt}="${Ht}"], [${Bt}="${Ut}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) RJ(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(MJ), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = vz(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		if (n !== void 0 && clearTimeout(n.timer), t - r >= 1e3) {
			this.waiting.delete(e), this.report(e);
			return;
		}
		this.waiting.set(e, {
			since: r,
			timer: setTimeout(() => {
				this.waiting.delete(e), this.report(e);
			}, 150)
		});
	}
	report(e) {
		let t = e.isConnected ? zJ(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(MJ);
		if (n === null || O(t[0].holder)) return;
		let r = VJ(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = BJ(r, n);
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
function RJ(e) {
	return zJ(e).length > 0;
}
function zJ(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of IJ) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function BJ(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= FJ)) return (t === "first" ? JJ(n, r) : YJ(n, r)) ?? void 0;
}
function VJ(e, t) {
	let n = e.classList.contains(PJ), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = Wu(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...HJ(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: UJ(t, n, r)
	} : null;
}
function HJ(e, t, n) {
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
function UJ(e, t, n) {
	let r = zu(e), i = HJ(WJ(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = KJ(i, HJ(WJ(e, null), t, n)));
	}
	return i = KJ(i, HJ({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), qJ(e, i, t, n);
}
function WJ(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + GJ(t?.paddingLeft),
		top: i + GJ(t?.paddingTop),
		right: r + e.clientWidth - GJ(t?.paddingRight),
		bottom: i + e.clientHeight - GJ(t?.paddingBottom)
	};
}
function GJ(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function KJ(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function qJ(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(NJ)) {
		let e = HJ(t.getBoundingClientRect(), n, r);
		e.start <= i + FJ && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function JJ(e, t) {
	for (let n of e) if (XJ(n, t)) return n.key;
	return null;
}
function YJ(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (XJ(e[n], t)) return e[n].key;
	return null;
}
function XJ(e, t) {
	return e.key.length > 0 && e.end > t.start + FJ && e.start < t.end - FJ;
}
//#endregion
//#region src/items/item-rows.ts
function ZJ(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: EO,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Wd(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(F);
			return t !== null && ef(t) ? rf(t, e) : [];
		},
		moveCursor: (e, t) => gf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function QJ(e, t) {
	let n = na(e.kind);
	return n === "Markup" ? !t.hasAttribute(ji) : n === "Attribute" && e.name === "data-ui-tooltip" || e.converter === "inlineMarkupPlainText";
}
var $J = class {
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
function eY(e, t) {
	return E(e) ? new $J(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var tY = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? iY(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), aY(l, n, t);
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
		let i = rY(r.item, t, n);
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
			nY(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Je}${Vi(n.propertyName)}="${Bi(r)}"]`]);
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
		let r = uY(t, n.templateKeyPropertyName);
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
		i !== void 0 && !SO(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = w(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : xO(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = jc(l, () => this.metadata.isTranslatable(t) && !CO(c)), d = eY(l, this.extensions.converters), f = w(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = Wi(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && QJ(t, n) ? this.operations.apply({
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
function nY(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function rY(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? DO(r, i.name) : MO(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return NO(r, i.key, n), e;
	let a = r;
	return a[kO(a, i.name)] = n, e;
}
function iY(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function aY(e, t, n) {
	e.setAttribute(b, t), lY(e, n), sY(e, n);
}
var oY = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function sY(e, t) {
	for (let [n, r] of oY) {
		let i = DO(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function cY(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if (sY(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${Bi(n)}"]`)) i.closest("[data-ui-items-host]") === r && sY(i, t);
}
function lY(e, t) {
	let n = DO(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Lt, n.value) : e.removeAttribute(Lt);
}
function uY(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = DO(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var dY = "Group", fY = class {
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
				let e = Na(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), B(e.root, `[${Wt}="windowed"]`, { attributeFilter: [rn] }, (e) => {
			for (let t of e) {
				let e = Na(t);
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
			for (let [t, n] of e) t.isConnected && XU(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) pY(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) n.some((t) => mY(t, e)) || this.handleItemValueChange(e);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : jO(t);
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
			a === null || !this.drawsPatchedComponent(a, w(e.reference.componentId), t) || !hY(a, e.dynamicParameters) || (r = this.applyVirtualizedValue(i, T(a), n, t, e.value) || r);
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && pY(n) ? n : r !== null && pY(r) ? r : null;
		if (i !== null) {
			this.readerHeld.set(e, {
				componentId: t,
				row: i
			});
			return;
		}
		this.readerHeld.delete(e), XU(e, t, this.options);
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${Bi(t)}"]`)].filter((t) => this.isItemRoot(t) && Ca(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : Na(r);
		if (r !== null && i !== null && W(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = gY(dY, t);
		a && lY(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(r, i, t) || this.sync(r, i, e));
	}
	restampAbilities(e, t) {
		oY.some(([e]) => gY(e, t)) && cY(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && gY(dY, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => gY(e.itemProperty, n)) || r.sorts.some((e) => gY(e.itemProperty, n)))) return !0;
		let i = IO(e);
		return (i?.filters ?? []).some((e) => gY(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => gY(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = Na(t);
			n === e && this.sync(t, n);
		}
	}
};
function pY(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function mY(e, t) {
	let n = sa(e), r = n === "Value" ? !Kp(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && w(i?.component?.id) === w(t.reference.componentId) && oa(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function hY(e, t) {
	let n = Sa(e, xa(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function gY(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var _Y = "ui-table", vY = "ui-table--no-header";
function yY(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(_Y)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(vY)) && (s ? o : a).push(t);
	a.forEach((e, t) => bY(e, t));
	for (let [e, n] of t) bY(e, a.length + n);
	n !== null && o.forEach((e, t) => bY(e, a.length + n + t)), xY(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function bY(e, t) {
	xY(e, "aria-rowindex", String(t + 1));
}
function xY(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var SY = 50, CY = 1, wY = .5, TY = 60, EY = "--ui-window-look", DY = "--ui-window-row", OY = "--ui-window-tile", kY = 3, AY = class {
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
			if (this.noteShownRow(t), this.layout(t), UY(t) === 0) {
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
			n !== void 0 && n.scheduled !== 0 && window.clearTimeout(n.scheduled), this.states.delete(t), this.held.delete(t), this.forgotten.add(t);
		}
	}
	revealWindow(e) {
		let t = this.windowTop(e);
		t !== null && (Hu(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = $D(e, $t);
		return t !== null && KK(e) && eO(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - Vu(e).height) : t === null || t === 0 ? null : eO(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = HY(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Wu(n[n.length - 1]).bottom - Wu(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = BY(e, HY(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), this.getState(t).pending || this.realign(t));
	}
	realign(e) {
		let t = $D(e, $t), n = HY(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Vu(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && NY(t);
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
		let t = Bu(e.target);
		if (t === null || W(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, TY));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && UY(e) > 0) return;
		let n = HY(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = $D(e, $t), i = eO(e, tn), a = eO(e, nn);
		if (r !== null) {
			let o = this.windowSize(e), s = Vu(e), c = Math.max(1, Math.round(s.height * CY / t.itemSize), Math.floor(o * wY)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, WY(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, WY(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Vu(e), s = Math.max(1, o.height * CY), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, WY(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, WY(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = $D(e, en);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Na(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", t === "Start" && NY(o);
		let c = e.closest(C);
		e.setAttribute(Xt, t.toLowerCase()), c?.setAttribute(Xt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && $D(e, "data-ui-window-total") === null && PY(e) && (LU(e, FU, kY * this.rowSize(e)), FY(e, o));
		let l = $D(e, $t) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: GY(e),
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
			o.pending = !1, e.removeAttribute(Xt), c?.removeAttribute(Xt), e.removeAttribute("aria-busy"), LU(e, FU, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1, o.restless || l && LY(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = HY(e), r = $D(e, en), i = $D(e, $t);
		if (yY(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			LU(e, "top", 0), LU(e, PU, 0);
			return;
		}
		if (n.length > 0) {
			let r = Wu(n[n.length - 1]).bottom - Wu(n[0]).top;
			if (r > 0) {
				let i = jY(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (NY(t), t.measuredWidth = e.clientWidth), MY(t, n, i), t.skeletonRow = a > 1 ? (Wu(n[n.length - 1]).top - Wu(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? Wu(n[1]).left - Wu(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		LU(e, "top", a), LU(e, PU, o), FY(e, t), (t.readingBefore || !RY(e)) && zY(e, n, t.shown), NK(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? IY(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = $D(e, Qt);
		return t !== null && t > 0 ? t : SY;
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
function jY(e) {
	let t = Wu(e[0]).top, n = 1;
	for (; n < e.length && Wu(e[n]).top === t;) n++;
	return n;
}
function MY(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? Wu(t[r]).height : 0 : Wu(i).top - Wu(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		VU(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function NY(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function PY(e) {
	return getComputedStyle(e).getPropertyValue(EY).trim() === "skeleton";
}
function FY(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${IY(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${IY(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Yt}]`)) {
		let e = t.style;
		e.getPropertyValue(DY) !== n && e.setProperty(DY, n), e.getPropertyValue(OY) !== r && (r.length === 0 ? e.removeProperty(OY) : e.setProperty(OY, r));
	}
}
function IY(e) {
	return Math.round(e * 100) / 100;
}
function LY(e, t, n) {
	let r = HY(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && WY(i) !== n;
}
function RY(e) {
	let t = $D(e, $t);
	return Vu(e).top <= 0 && (t === null ? !eO(e, "data-ui-window-more-before") : t === 0);
}
function zY(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => WY(e) === n.key);
	if (n === null || r === void 0) return;
	let i = Wu(r);
	if (i.height <= 0) return;
	let a = Vu(e).top, o = i.top - VY(e) + a - n.at;
	Math.abs(o) >= .5 && Hu(e, a + o);
}
function BY(e, t) {
	let n = VY(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		Wu(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : WY(a);
	if (a === void 0 || o === null) return null;
	let s = Wu(a), c = Vu(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function VY(e) {
	let t = zu(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function HY(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function UY(e) {
	return HY(e).length;
}
function WY(e) {
	return e.getAttribute(b);
}
function GY(e) {
	let t = e.closest(C);
	return t === null ? [] : Sa(t, xa(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var KY = [
	y,
	ie,
	ae
];
function qY(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, JY(c, e.itemRole);
	let l = XY(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = YY(l, t, n, a);
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
		d.className = l.wrapperClassName, JY(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), aY(d, r, n), c.appendChild(d);
	}
	return aY(c, r, n), o.registerItemScope(c, l, n), c;
}
function JY(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function YY(e, t, n, r) {
	let i = uY(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function XY(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of KY) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function ZY(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return QY(i.renderer.renderItem(e, t, n, r), a);
	let s = qY(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), QY(s, a);
}
function QY(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), Pc(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var $Y = 6, eX = 60, tX = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => aX(e.entry) === !1).map((e) => e.entry.key);
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
		if (!lX(e) && !sX(e)) return a.element;
		let o = getComputedStyle(e), s = fX(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = lX(e) ? uX(r.projected, c, r.across) : null, u = l === null ? i : cX(l.starts, i), d = l?.pitches ?? c, f = pX(o.paddingTop) + mX(d, 0, u), p = f + d[u] - s, m = Vu(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Hu(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = KK(e) && JK(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !JK(e) && (Hu(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Kp(t.item, s)) {
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
		return t === null ? null : nX(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = jf(t);
		t.remove(), Mf(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Af(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Pf(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(Ne), l === void 0) {
			r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant");
			return;
		}
		if (l.element instanceof HTMLElement) {
			Qd(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1);
			return;
		}
		r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant");
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
		let a = Af(e), o = a === null || i.size === 0 ? null : Ef(a, G(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = rY(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = IO(e), i = this.options.templates.getGroupTemplate(t.componentId), a = HO(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => BO(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => oX(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => WO(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = AU(o, oX), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => WO(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Bu(e.target);
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
		}, eX));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = fX(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = lX(e) ? uX(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || sX(e)) && u > 0) {
			let i = pX(r.paddingTop), a = Vu(e), o = rX(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - $Y), f = Math.min(u, f + $Y);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(oX(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), iX(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : cX(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), iX(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && NU(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || Nf(e, l), iX(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = mX(l, 0, y?.line ?? d), b = mX(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? mX(l, f, ne.line) : mX(l, y.line + 1, d), se = BU(e, oe > 0 ? oe - i : 0);
		HU(e, [...y === null ? ie === null ? g : [
			...g,
			...mO(se),
			ie.element
		] : [
			y.element,
			...mO(se),
			...g
		], ...mO(hO(e))]), LU(e, "top", ae > 0 ? ae - i : 0), LU(e, PU, b > 0 ? b - i : 0), gO(e, t.componentId, this.options.templates, this.options.renderer, o > 0), yY(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = dX(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return ZY(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : MU(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(oX(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Wu(o);
			s.height <= 0 || (VU(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(oX(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = Pa(e);
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
function nX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function rX(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Hu(e, a + l + o), a + l);
}
function iX(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = oX(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function aX(e) {
	let t = DO(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function oX(e) {
	let t = DO(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function sX(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function cX(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function lX(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function uX(e, t, n) {
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
function dX(e, t, n) {
	let r = e.clientWidth - pX(t.paddingLeft) - pX(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = pX(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function fX(e) {
	return pX(e.rowGap);
}
function pX(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function mX(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var hX = "data-ui-template", gX = "default", _X = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? gX, r = this.findTemplate(e, n);
		return r === void 0 ? n === gX ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : vX(n, hX, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= yX(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Mt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : vX(n, t, null);
	}
};
function vX(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function yX(e) {
	let t = /* @__PURE__ */ new Set();
	return Ac(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(C)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var bX = `:scope > ${`template[${Te}]`}`, xX = class {
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
			this.components.has(e) && CX(t.item, this.chordSet);
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
		let t = e.querySelector(bX);
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
			let e = [...t, ...SX(r)];
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
		this.taken.add(e), this.declared.add(r), Ac(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(C)) this.components.set(T(n), t), this.menuOf.set(T(n), r);
			for (let t of e.querySelectorAll(`[${Hn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function SX(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Na(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function CX(e, t) {
	let n = DO(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = DO(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) CX(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function wX(e, t) {
	let n = e.querySelector(`style[${Rr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Rr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var TX = "script[type='application/json'][data-ui-metadata]";
function EX(e = document) {
	let t = e.querySelector(TX);
	if (t === null) return DX();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return DX();
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
function DX() {
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
var OX = "script[type='application/json'][data-ui-hydration]";
function kX(e) {
	return e !== null && (ec(e.title) || ec(e.changes));
}
function AX(e = document) {
	let t = e.querySelector(OX)?.textContent?.trim() ?? "";
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
var jX = "reconnecting";
async function MX(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), jX;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function NX(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function PX(e, t, n) {
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
var FX = "/_ne/", IX = 3e3;
function LX(e, t, n) {
	let r = e.getAttribute(Ir);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (PX(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => zX(i.ready);
	let a = i.register(r, { scope: FX }).then(RX).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function RX(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function zX(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), IX))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var BX = "ne-standard-ui:reloaded-view";
function VX(e, t, n) {
	if (!t) return "no-cookie";
	if (WX(n) === e) return "asked-again";
	try {
		n?.setItem(BX, e);
	} catch {}
	return "reload";
}
function HX(e) {
	try {
		e?.removeItem(BX);
	} catch {}
}
function UX() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function WX(e) {
	try {
		return e?.getItem(BX) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function GX(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return KX(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function KX(e, t) {
	let n = t.create ?? QX, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = YX(i, e), s = n(), c = o !== null && o.length > 0 && YX(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		XX(i, e, c), XX(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? qX(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = JX(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), qX(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		ZX(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function qX(e, t) {
	e?.postMessage(t);
}
function JX(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function YX(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function XX(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function ZX(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function QX() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var $X = 2e3, eZ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? $X, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(qr, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(qr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(qr, "lost");
	}
}, tZ = "/_ne/values", nZ = 32768;
nZ / 4;
var rZ = 3e4;
function iZ(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function aZ(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function oZ(e, t = null, n = rZ) {
	if (e === void 0 || !aZ(e)) return e;
	await Yv.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${tZ}/${encodeURIComponent(r)}${i}`, {
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
async function sZ(e) {
	await Yv.settled();
	let t = await fetch(tZ, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(rZ)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var cZ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(lZ(uZ(e)));
	}
	async dispatchAsync(e) {
		let t = uZ(e), n = lZ(t);
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
		let t = iZ(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : sZ(t), i = () => {}, a = new Promise((e) => {
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
function lZ(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function uZ(e) {
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
var dZ = class {
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
async function fZ(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var pZ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && Kp(a.value, n);
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
		let r = mZ(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(aa([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(mZ(e, t));
		let n = this.unplaced.get(aa(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = mZ(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(aa([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = aa(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, aa(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${aa(t)}`;
	}
};
function mZ(e, t) {
	return `${e}:${aa(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var hZ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, gZ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, _Z = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, vZ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, yZ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, bZ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, xZ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, SZ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, CZ = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, wZ = class {
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
var TZ = class {
	constructor() {}
	log(e, t) {}
};
TZ.instance = new TZ();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var EZ = "10.0.11", X = class {
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
function DZ(e, t) {
	let n = "";
	return kZ(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${OZ(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function OZ(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function kZ(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function AZ(e, t, n, r, i, a) {
	let o = {}, [s, c] = PZ();
	o[s] = c, e.log(Y.Trace, `(${t} transport) sending data. ${DZ(i, a.logMessageContent)}.`);
	let l = kZ(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function jZ(e) {
	return e === void 0 ? new NZ(Y.Information) : e === null ? TZ.instance : e.log === void 0 ? new NZ(e) : e;
}
var MZ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, NZ = class {
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
function PZ() {
	let e = "X-SignalR-User-Agent";
	return Z.isNode && (e = "User-Agent"), [e, FZ(EZ, IZ(), RZ(), LZ())];
}
function FZ(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function IZ() {
	if (Z.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function LZ() {
	if (Z.isNode) return process.versions.node;
}
function RZ() {
	return Z.isNode ? "NodeJS" : "Browser";
}
function zZ(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function BZ() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var VZ = class extends wZ {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Z.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(BZ());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new _Z();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new _Z();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(Y.Warning, "Timeout from HTTP request."), n = new gZ();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, kZ(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new hZ(await HZ(i, "text") || i.statusText, i.status);
		let a = await HZ(i, e.responseType);
		return new CZ(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Z.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function HZ(e, t) {
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
var UZ = class extends wZ {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new _Z()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (kZ(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new _Z());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new CZ(r.status, r.statusText, r.response || r.responseText)) : n(new hZ(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(Y.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new hZ(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(Y.Warning, "Timeout from HTTP request."), n(new gZ());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, WZ = class extends wZ {
	constructor(e) {
		if (super(), typeof fetch < "u" || Z.isNode) this._httpClient = new VZ(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new UZ(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new _Z()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, GZ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
GZ.RecordSeparatorCode = 30, GZ.RecordSeparator = String.fromCharCode(GZ.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var KZ = class {
	writeHandshakeRequest(e) {
		return GZ.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (kZ(e)) {
			let r = new Uint8Array(e), i = r.indexOf(GZ.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(GZ.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = GZ.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var qZ = class {
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
		return this.observers.push(e), new MZ(this, e);
	}
}, JZ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			kZ(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new YZ(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, kZ(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, YZ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, XZ = 3e4, ZZ = 15e3, QZ = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var $Z = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(Y.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, X.isRequired(e, "connection"), X.isRequired(t, "logger"), X.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? XZ, this.keepAliveIntervalInMilliseconds = a ?? ZZ, this._statefulReconnectBufferSize = o ?? QZ, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new KZ(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new JZ(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(Y.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(Y.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new _Z("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new qZ();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === Q.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === Q.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case Q.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(Y.Error, `Invoke client method threw error: ${zZ(e)}`);
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
							this._logger.log(Y.Error, `Stream callback threw error: ${zZ(e)}`);
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
		this._logger.log(Y.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new _Z("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
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
		if (i === null) {
			this._logger.log(Y.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
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
				this._logger.log(Y.Error, `Stream 'error' callback called with '${e}' threw error: ${zZ(t)}`);
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
}, eQ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], tQ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? eQ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, nQ = class {};
nQ.Authorization = "Authorization", nQ.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var rQ = class extends wZ {
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
		e.headers ||= {}, this._accessToken ? e.headers[nQ.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[nQ.Authorization] && delete e.headers[nQ.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, iQ;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(iQ ||= {});
var aQ;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(aQ ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var oQ = class {
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
}, sQ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new oQ(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, aQ, "transferFormat"), this._url = e, this._logger.log(Y.Trace, "(LongPolling transport) Connecting."), t === aQ.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = PZ(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === aQ.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(Y.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new hZ(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(Y.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(Y.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(Y.Trace, `(LongPolling transport) data received. ${DZ(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new hZ(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof gZ ? this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(Y.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(Y.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? AZ(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(Y.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(Y.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = PZ();
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
			i ? i instanceof hZ && (i.statusCode === 404 ? this._logger.log(Y.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(Y.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(Y.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, cQ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, aQ, "transferFormat"), this._logger.log(Y.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== aQ.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Z.isBrowser || Z.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = PZ();
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
						this._logger.log(Y.Trace, `(SSE transport) data received. ${DZ(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? AZ(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, lQ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, aQ, "transferFormat"), this._logger.log(Y.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Z.isNode || Z.isReactNative) {
				let t = {}, [r, i] = PZ();
				t[r] = i, n && (t[nQ.Authorization] = `Bearer ${n}`), o && (t[nQ.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === aQ.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(Y.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(Y.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(Y.Trace, `(WebSockets transport) data received. ${DZ(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(Y.Trace, `(WebSockets transport) sending data. ${DZ(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, uQ = 100, dQ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, X.isRequired(t, "url"), this._logger = jZ(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Z.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Z.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Z.isNode && !n.WebSocket && r && (n.WebSocket = r), !Z.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Z.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new rQ(n.httpClient || new WZ(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= aQ.Binary, X.isIn(e, aQ, "transferFormat"), this._logger.log(Y.Debug, `Starting connection with transfer format '${aQ[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(Y.Error, e), await this._stopPromise, Promise.reject(new _Z(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(Y.Error, e), Promise.reject(new _Z(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new pQ(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === iQ.WebSockets) this.transport = this._constructTransport(iQ.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new _Z("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < uQ);
				if (r === uQ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof sQ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(Y.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(Y.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = PZ();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new xZ("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof hZ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(Y.Error, t), Promise.reject(new xZ(t));
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
					if (this._logger.log(Y.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new bZ(`${n.transport} failed: ${e}`, iQ[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(Y.Debug, e), Promise.reject(new _Z(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new SZ(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case iQ.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new lQ(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case iQ.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new cQ(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case iQ.LongPolling: return new sQ(this._httpClient, this._logger, this._options);
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
		let i = iQ[e.transport];
		if (i == null) return this._logger.log(Y.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (fQ(t, i)) {
			if (e.transferFormats.map((e) => aQ[e]).indexOf(n) >= 0) {
				if (i === iQ.WebSockets && !this._options.WebSocket || i === iQ.ServerSentEvents && !this._options.EventSource) return this._logger.log(Y.Debug, `Skipping transport '${iQ[i]}' because it is not supported in your environment.'`), new vZ(`'${iQ[i]}' is not supported in your environment.`, i);
				this._logger.log(Y.Debug, `Selecting transport '${iQ[i]}'.`);
				try {
					return this.features.reconnect = i === iQ.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(Y.Debug, `Skipping transport '${iQ[i]}' because it does not support the requested transfer format '${aQ[n]}'.`), /* @__PURE__ */ Error(`'${iQ[i]}' does not support ${aQ[n]}.`);
		}
		return this._logger.log(Y.Debug, `Skipping transport '${iQ[i]}' because it was disabled by the client.`), new yZ(`'${iQ[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(Y.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(Y.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
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
function fQ(e, t) {
	return !e || (t & e) !== 0;
}
var pQ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new mQ(), this._transportResult = new mQ(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new mQ(), this._transportResult.promise;
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
			this._sendBufferedData = new mQ();
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
}, mQ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, hQ = "json", gQ = class {
	constructor() {
		this.name = hQ, this.version = 2, this.transferFormat = aQ.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = TZ.instance);
		let n = GZ.parse(e), r = [];
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
		return GZ.write(JSON.stringify(e));
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
}, _Q = {
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
function vQ(e) {
	let t = _Q[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var yQ = class {
	configureLogging(e) {
		if (X.isRequired(e, "logging"), bQ(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = vQ(e);
			this.logger = new NZ(t);
		} else this.logger = new NZ(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new tQ(e) : e : new tQ(), this;
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
		let t = new dQ(this.url, e);
		return $Z.create(t, this.logger || TZ.instance, this.protocol || new gQ(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function bQ(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var xQ = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, SQ = class {
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
}, CQ = 500;
function wQ(e) {
	let { changes: t, ...n } = e;
	return n;
}
function TQ() {
	return {};
}
function EQ(e) {
	return typeof e == "string" ? e : null;
}
var DQ = class {
	windowId;
	connection;
	started = !1;
	gate = new SQ();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new dZ(t), this.connection = new yQ().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, EQ(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, EQ(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, wQ));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, wQ));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, wQ));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, TQ, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new xQ(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, TQ));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), CQ);
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
			if (this.connection.state === $.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, OQ = Promise.resolve(), kQ = () => {}, AQ = nZ * 3 / 4, jQ = 128, MQ = class {
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
		if (this.handed >= this.given) return OQ;
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
		for (; this.flight !== null;) await this.flight.catch(kQ);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = iZ(e.value), i = r === null ? null : sZ(r);
		return i?.catch(kQ), new Promise((a, o) => {
			let s = PQ(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? NQ(e) : NQ({
				...e,
				value: void 0
			}) + jQ;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, FQ(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof xQ) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= AQ);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => sZ(e));
		return t.catch(kQ), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function NQ(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function PQ(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function FQ(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var IQ = "content-fills", LQ = "content", RQ = "data-ui-root", zQ = "--ui-height", BQ = "var(--ui-fill-height";
function VQ(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(RQ)) return;
	let r = e.style.getPropertyValue(zQ).trimStart().startsWith(BQ);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(An, r);
}
//#endregion
//#region src/updates/form-owner.ts
var HQ = "form-owner", UQ = "ui-form-";
function WQ(e) {
	return UQ + e.replace(/[ \t\n\f\r]/g, "_");
}
function GQ(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = WQ(t);
	qQ(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function KQ(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(UQ) && qQ(e);
	}
}
function qQ(e) {
	let t = JQ();
	if (t.querySelector(`form[id="${Bi(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function JQ() {
	let e = document.body.querySelector(`[${sn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(sn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var YQ = document;
function XQ() {
	try {
		return YQ.execCommand("copy");
	} catch {
		return !1;
	}
}
function ZQ(e) {
	try {
		return typeof YQ.execCommand == "function" && YQ.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var QQ = "ui-lightbox", $Q = "ui-lightbox-title", e$ = new zy("data-ui-lightbox-part"), t$ = "data-ui-lightbox-set", n$ = "data-ui-lightbox-slot", r$ = "data-ui-lightbox-still", i$ = "--ui-lightbox-shift", a$ = 16, o$ = 1 / 5, s$ = null, c$ = null, l$ = null;
function u$(e, t, n) {
	let r = t.filter((e) => Xa(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	s$ ??= h$(e), (s$.dialog.hasAttribute("hidden") || !s$.dialog.isConnected) && document.body.append(s$.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => Xa(e.source) === null).length;
	l$ = null, c$ = {
		pictures: r,
		index: m$(n - i, r.length)
	}, s$.dialog.toggleAttribute(t$, r.length > 1);
	for (let e of s$.neighbours) e.hidden = r.length < 2;
	return C$(s$), w$(s$, c$), e.open(QQ);
}
function d$(e, t, n) {
	let r = f$(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(p$)) {
		let n = t === e ? r : f$(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function f$(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = Xa(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function p$(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function m$(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function h$(e) {
	let { dialog: t, surface: n } = Ry({
		key: QQ,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: $Q,
		closesOnEscapeAndBackdrop: !0
	}), r = e$.element("h2", "ui-lightbox__title"), i = _$("ui-lightbox__close", "close"), a = e$.element("div", "ui-lightbox__stage"), [o, s] = g$("previous"), [c, l] = g$("current"), [u, d] = g$("next"), f = e$.element("div", "ui-lightbox__nav"), p = _$("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = _$("ui-lightbox__step ui-lightbox__step--next", "next"), h = e$.element("span", "ui-lightbox__counter ui-text-type--caption"), g = e$.element("span", "ui-lightbox__count-room"), _ = e$.element("span", "ui-lightbox__count"), v = e$.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = $Q, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), D.write(r, null, "ui.lightbox.label"), D.write(i, "aria-label", "ui.action.close"), D.write(p, "aria-label", "ui.lightbox.previous"), D.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (e$.pressed(t)) {
			case "close":
				e.dismiss(QQ);
				break;
			case "previous":
				v$(-1);
				break;
			case "next": v$(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !M(e) || c$ === null || c$.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), v$(E$(t) ? -n : n));
	}), D$(t, a), {
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
function g$(e) {
	let t = e$.element("div", "ui-lightbox__figure"), n = e$.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(n$, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(st, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function _$(e, t) {
	let n = e$.element("button", e, t);
	return n.type = "button", n;
}
function v$(e) {
	if (s$ === null || c$ === null || c$.pictures.length < 2) return;
	let t = s$;
	if (x$(t), Tm()) {
		S$(t, e), C$(t), w$(t, c$);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = E$(t.dialog) ? -1 : 1;
	l$ = n, t.stage.removeAttribute(r$), t.stage.style.setProperty(i$, `${-e * r * y$(t.stage)}px`), Dm(t.current, z.normal + 100, () => b$(t, n));
}
function y$(e) {
	return e.getBoundingClientRect().width + a$;
}
function b$(e, t) {
	if (l$ !== t || t.landed) return;
	S$(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? x$(e) : n.then(() => {
		l$ === t && x$(e);
	});
}
function x$(e) {
	let t = l$;
	t !== null && c$ !== null && (l$ = null, t.landed || S$(e, t.by), C$(e), w$(e, c$));
}
function S$(e, t) {
	if (c$ === null) return;
	let n = c$.pictures.length;
	c$.index = ((c$.index + t) % n + n) % n, T$(e.picture, c$.pictures[c$.index].source);
}
function C$(e) {
	e.stage.setAttribute(r$, ""), e.stage.style.setProperty(i$, "0px"), e.stage.getBoundingClientRect();
}
function w$(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	T$(e.picture, r.source), T$(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), T$(e.nextPicture, t.pictures[(t.index + 1) % n].source), D.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), D.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, D.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), D.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function T$(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(st), e.src = t);
}
function E$(e) {
	return getComputedStyle(e).direction === "rtl";
}
function D$(e, t) {
	Dg(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || s$ === null || c$ === null || c$.pictures.length < 2 ? !1 : (x$(s$), !0),
		start: () => t.setAttribute(r$, ""),
		follow: (e) => t.style.setProperty(i$, `${e}px`),
		end: (n, r, i) => {
			if (i && O$(n, window.innerWidth, r)) {
				v$((E$(e) ? n > 0 : n < 0) ? 1 : -1);
				return;
			}
			t.removeAttribute(r$), t.style.setProperty(i$, "0px");
		}
	});
}
function O$(e, t, n) {
	return Math.abs(e) > t * o$ || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var k$ = "ui-notification-host", A$ = "ui-notification", j$ = "ui-notification--leaving", M$ = "ui-notification__message", N$ = "ui-notification__title", P$ = "ui-notification__action", F$ = "ui-notification__close", I$ = 5e3, L$ = 8e3, R$ = "ui-notification--connection", z$ = "--ui-notification-lift", B$ = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), V$ = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? I$, this.ensureHost(), this.announcer = uk(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = OS(e.severity), n = document.createElement("div");
		n.className = B$.has(t) ? `${A$} ${A$}--${t}` : A$, n.classList.toggle(R$, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = M$, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = N$, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${F$} ${Di}`, D.write(i, "aria-label", "ui.action.close"), D.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(G$(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || j(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), H$(() => {
			if (n.classList.contains(j$)) return;
			let t = this.ensureHost();
			U$(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : L$, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(j$) && (e.classList.add(j$), e.isConnected)) {
			if (this.returnFocus(e), Tm() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => W$(e), z.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(j$));
		Ep(Sp(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${F$}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${k$}`), n = t ?? document.createElement("div");
		return n.classList.add(k$), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function H$(e) {
	if (cG(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		cG(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function U$(e) {
	let t = window.innerHeight - Nh(window.innerHeight);
	t > 0 ? e.style.setProperty(z$, `${Math.round(t)}px`) : e.style.removeProperty(z$);
}
function W$(e) {
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
function G$(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${P$} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function K$(e, t) {
	let n = q$(e), r = e?.label;
	if (n !== void 0) {
		if (!E(r) && !Zs(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function q$(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function J$(e, t, n) {
	let r = e.itemKey === !0 ? Y$(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = X$(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	Z$(i, r);
}
function Y$(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function X$(e) {
	if (vu(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (vu(t)) return t;
	return null;
}
function Z$(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && ZQ(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function Q$(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : $$(t, e.request?.parameters ?? null);
}
function $$(e, t) {
	let n = e1(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function e1(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, t1(e));
	return t.toString();
}
function t1(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function n1(e, t) {
	let n = i1([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return i1(r, t) ?? r1(t);
}
function r1(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && a1(t, e) ? t : null;
}
function i1(e, t) {
	let n = null;
	for (let r of e) if (wF(r, t)) {
		if (a1(r, t)) return r;
		n ??= r;
	}
	return n;
}
function a1(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var o1 = class {
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
		this.handlers.set(ca(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = ca(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = Q$(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Ga(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			if (typeof t != "string" || !Ga(t)) {
				s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = fa(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Lr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = f1(e);
			t !== null && (HK(t), m1(t));
		}), this.register("ScrollTo", (e) => {
			let t = f1(e);
			if (t === null) return;
			let n = e.effect, r = la(n.behavior), i = ua(n.block);
			HK(t), t.scrollIntoView({
				behavior: p1(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = f1(e);
			if (t === null) return;
			let n = e.effect, r = OK(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = ua(n.block);
			HK(zu(r)), kK(r, n.key, i === "Unknown" ? "Start" : i, p1(la(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = f1(e);
			if (t === null) return;
			let n = e.effect, r = pa(n.axis) !== "Horizontal", i = n1(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = da(n.position), u;
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
			let d = p1(la(n.behavior));
			HK(i), r && l === "End" && KK(i) && VK(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			d1(f1(e), null);
		}), this.register("Hide", (e) => {
			d1(f1(e), "hidden");
		}), this.register("Collapse", (e) => {
			d1(f1(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = h1(e, this.valueReaders);
			t !== null && g1(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = f1(e);
			t !== null && J$(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = f1(e);
			t !== null && !my(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				u$(this.dialogs, c1(t.images), t.startIndex ?? 0);
				return;
			}
			let n = f1(e), r = n === null ? null : d$(n, t.rows === !0, (t) => e.dom.findEveryComponent(T(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : u$(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Va(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			Yv.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!E(t.message) && !Zs(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : K$(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			lG() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!E(t.message) && !Zs(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, ma(t.politeness) === "Assertive" ? "assertive" : "polite");
		});
	}
	leaveFor(e) {
		this.navigate === void 0 ? window.location.assign(e) : this.navigate(e);
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
		if (!E(t) && !Zs(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = E(e.body) || Zs(e.body) ? e.body : void 0, r = typeof e.address == "string" && Ga(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && cG(document.visibilityState)) {
			i();
			return;
		}
		let a = q$(e.action);
		mG({
			title: s1(t),
			body: n === void 0 ? void 0 : s1(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Ga(e.icon) ? e.icon : l1(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? u1(),
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
		return t !== void 0 && n !== void 0 && gG(t) ? {
			label: E(e.addressLabel) || Zs(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : K$(e.action, this.runAction);
	}
};
function s1(e) {
	return E(e) ? D.translate(e.key, e.args) : Zs(e) ? D.resolveText(e.text) : "";
}
function c1(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: E(n.caption) || Zs(n.caption) ? n.caption : void 0,
		altText: E(n.altText) || Zs(n.altText) ? n.altText : void 0
	});
	return t;
}
function l1() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function u1() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function d1(e, t) {
	if (e === null) return;
	let n = Xp();
	for (let n of di) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && Zp(n);
}
function f1(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function p1(e) {
	return e === "Smooth" && !Tm() ? "smooth" : "auto";
}
function m1(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Lf))) {
		e.focus();
		return;
	}
	let t = op(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function h1(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = f1(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : jl(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Tl(t.readHeld(r));
}
async function g1(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!_1(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function _1(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return XQ();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var v1 = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => y1(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = op(t), i = $f() && vu(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = yp(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), b1(t) && this.swipes.set(e, Ng(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Ep(Sp(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${qh}]:not([hidden])`)) {
			let t = e.getAttribute(qh);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${qh}="${Bi(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Yh}]`);
		if (n === null) return;
		let r = n.closest(`[${qh}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(qh);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || ng(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !dg() && !lu(e)) {
				let n = t.getAttribute(qh);
				n !== null && (e.preventDefault(), this.dismiss(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && dp(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(C)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return eg(this.root);
	}
};
function y1(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${Yh}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function b1(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var x1 = "ui-leave", S1 = new zy("data-ui-leave-part"), C1 = "560px", w1 = null, T1 = null;
function E1(e, t) {
	w1 ??= D1();
	let n = w1;
	n.isConnected || document.body.append(n), O1(n, "title", D.text("ui.leave.title")), O1(n, "message", D.text("ui.leave.message")), O1(n, "stay", D.text("ui.leave.stay")), O1(n, "leave", D.text("ui.leave.confirm")), T1 = {
		dialogs: e,
		leave: t
	}, e.open(x1);
}
function D1() {
	let { dialog: e, surface: t } = Ry({
		key: x1,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", C1);
	let n = S1.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = S1.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, S1.actions(S1.button("ui-button--ghost", "stay"), S1.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = S1.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = T1;
		T1 = null, n?.dialogs.close(x1), t === "leave" && n?.leave();
	}), e;
}
function O1(e, t, n) {
	let r = S1.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var k1 = class {
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
		let t = A1(e, this.options.window.location.href);
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
function A1(e, t) {
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
	return Ga(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var j1 = "neEntry", M1 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = N1(e.window.history.state) ?? 0, N1(e.window.history.state) === null && e.window.history.replaceState({ [j1]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write($$(this.route, e), !1);
	}
	push(e) {
		let t = $$(this.route, e), n = this.window.location;
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
		if (this.lastStep = null, e !== null) {
			if (e.step !== null && e.step !== 0) {
				this.undoing = !0, this.window.history.go(-e.step);
				return;
			}
			this.write(`${this.route}${e.previous}`, !0);
		}
	}
	write(e, t) {
		t ? (this.entry++, this.window.history.pushState({ [j1]: this.entry }, "", e)) : this.window.history.replaceState({ [j1]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = N1(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(I1(e.search));
	}
};
function N1(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[j1];
	return typeof t == "number" ? t : null;
}
function P1(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => F1(r, e) !== F1(i, e));
}
function F1(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function I1(e) {
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
var L1 = class {
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = eY(n, this.extensions.converters), c = !1;
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
				if (i.length === 0) {
					t.optional !== !0 && s("property operation target was not found.", {
						reference: e,
						operation: t
					});
					continue;
				}
				for (let s of i) {
					if (!r && !this.restoring && this.holdsProperty(s, e.propertyId)) {
						c = !0;
						continue;
					}
					this.applyOperation(l, t, s, a, n, o, r);
				}
			}
		}
		!this.state.set(e, t, n, () => z1(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return jc(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Xe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && QJ(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => z1(r[0]?.component)) ? {
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
			(typeof n == "string" || Zs(n) ? this.addressResolver.isTranslatable(t.reference) : E(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ye}${Vi(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => Wi(e, t, () => R1(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = eY(t, this.extensions.converters);
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
		if (!this.state.has(r, t)) {
			Pl(e);
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
function R1(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(C) === e) return [n];
	return [e];
}
function z1(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(C) ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Sa(e, xa(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var B1 = "EndValue", V1 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of kp) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = U1(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : H1(e, this.edits?.metadata) ? t.querySelector(`[${zt}]`) : jl(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Na(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(zt);
		for (let e of r) {
			if (t.metadata !== void 0 && H1(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = U1(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function H1(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === B1;
}
function U1(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function W1(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var G1 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, Y1(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), K1(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(q1(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: Y1(n)
		});
	}
	applyRow(e) {
		let t = w(e.component?.id), n = e.component?.dynamicParameters ?? [], r = q1(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), K1(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(q1(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && J1(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !J1(a.dynamicParameters, e)) continue;
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
function K1(e, t) {
	switch (ia(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) X1(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) Z1(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) Q1(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) $1(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function q1(e, t) {
	return `${e}:${aa(t)}`;
}
function J1(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function Y1(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function X1(e, t) {
	typeof t.key == "string" && (Z1(e, t.key), e.splice(e0(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function Z1(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function Q1(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		X1(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function $1(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(e0(n, e.length), 0, i);
}
function e0(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var t0 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, n0(e, "", t.map((e) => e.split("."))));
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
function n0(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : n0(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function r0(e) {
	let t = new t0();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var i0 = class {
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
		try {
			n();
		} finally {
			this.restand(e, t);
		}
	}
	restand(e, t) {
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
}, a0 = class {
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
function o0(e, t) {
	let n = s0(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = s0(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !Kp(i, t.component?.dynamicParameters ?? [])) break;
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
function s0(e, t) {
	if (e === void 0 || sa(e) !== "CollectionChange") return null;
	let n = e;
	return ia(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var c0 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function l0(e, t, n, r) {
	return {
		action: ia(e.action),
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
var u0 = [], d0 = class {
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
	held = new G1();
	projections;
	touched = null;
	changedHosts = null;
	moves = new i0({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new a0({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => b0(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = r0(e), this.projections.isEmpty || bO((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Na(n);
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
		for (let n = v0(e, t); n !== null; n = v0(e, t)) {
			t.add(n);
			let e = Pa(n);
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
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : jO(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => rY(e, i.steps, a)) && this.rowMenus.heldChanged();
	}
	touch(e) {
		if (this.touched !== null) for (let t of e) this.touched.add(t);
	}
	forgetHeldRows(e, t, n) {
		let r = (t) => this.rowMenus.standsInRowsOf(t, e);
		if (n === null) {
			this.held.forgetRows(t, r);
			return;
		}
		for (let e of n) this.held.forgetRows([...t, e], r);
	}
	registerServerRenderedItems(e) {
		let t = /* @__PURE__ */ new Map(), n = (e) => {
			let n = t.get(e);
			return n === void 0 && (n = x0(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (sa(t) !== "CollectionChange") continue;
			let e = t;
			if (ia(e.action) !== "Insert") continue;
			let r = w(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => x0(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Pa(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, y0(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of W1(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = Na(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Na(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		XU(e, t, {
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
		let n = u() ? performance.now() : -1, r = Xp(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			eW(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && Zp(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				sa(n) !== "Value" && nW((e) => !f0(n, e));
				let r = o0(e, t);
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
		if (r.length === 0) {
			t || n ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
			return;
		}
		for (let n of r) t && this.held.isWaiting(n) || this.refillHost(n, e);
	}
	refillHost(e, t) {
		this.transfers.around(e, () => this.moves.around(e, u0, () => this.refillHostRows(e, t)));
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
		let n = this.itemsRenderer.getAncestorStack(e), r = x0(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Kp(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = jf(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = W(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? jf(n) : null;
			n.remove(), Mf(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), _0(e, i), ik(e, i), o !== null && Mf(e, o.row, o.held), c) for (let t of i) Nf(e, t);
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
		switch (sa(e)) {
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
		let t = w(e.address?.component?.id), n = oa(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (w(e.address?.component?.id) <= 0) {
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
		let t = w(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, l0(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (ia(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = ia(e.action) === "Move" ? h0(e.moves ?? []) : u0;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = W(e) === "virtualized", i = ia(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (ia(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				p0(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				g0(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), ak(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = W(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : ZO(e, G(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + QD(e);
	}
	moveRow(e, t, n) {
		let r = Na(e);
		if (r === null) return;
		let i = Math.max(0, n - QD(e));
		W(e) === "virtualized" ? this.virtualization.move(e, t, i) : g0(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = G(e), r = b0(n, t);
		if (r === null) return null;
		let i = ZO(e, n), a = i.indexOf(r);
		return ek(i, r), r.remove(), this.afterRowsChanged(e, Na(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = ZO(e, G(e));
		Wk(t.element), e.insertBefore(t.element, $O(n, t.element, t.index)), this.afterRowsChanged(e, Na(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Na(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, $O(ZO(e, G(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		ek(ZO(e, G(e)), t), t.remove(), this.afterRowsChanged(e, Na(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (ia(n.action)) {
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
		switch (ia(t.action)) {
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
			let e = OK(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = ZO(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, $O(i, o, a.index ?? null)), Nf(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return ZY(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = ZO(e, i), o = x0(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = jf(c);
					rk(a, c, l), c.replaceWith(l), Mf(e, l, t);
				} else e.insertBefore(l, $O(a, l, i.index ?? null));
			}
		}
	}
};
function f0(e, t) {
	if (sa(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(C);
	return r !== null && T(r) === w(n?.id) && Ca(r, n?.dynamicParameters ?? []);
}
function p0(e, t, n) {
	let r = G(e), i = x0(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		i.delete(t), a.add(n);
	}
	if (a.size === 0) return;
	let o = Af(e), c = o === null ? null : n ? m0(e, a) : Ef(o, r, a);
	tk(ZO(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function m0(e, t) {
	let n = [];
	for (let e of t) {
		let t = jf(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) Mf(e, null, t);
	};
}
function h0(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function g0(e, t) {
	let n = G(e), r = ZO(e, n), i = x0(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = nk(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function _0(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function v0(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function y0(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function b0(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function x0(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function S0(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return E(n) || Zs(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: w0(t.severity)
	} : void 0;
}
function C0(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(E(t) || Zs(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function w0(e) {
	let t = ta(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var T0 = "ui-validation--warning", E0 = "ui-validation--info", D0 = "ui-validation-message--marker", O0 = "top-end", k0 = "right", A0 = "--ui-validation-marker-host", j0 = "ui-validation-mark", M0 = "--ui-validation-presentation", N0 = "--ui-validation-color", P0 = "Validation", F0 = /* @__PURE__ */ new Set(["Value", "EndValue"]), I0 = /* @__PURE__ */ new Set(["Min", "Max"]), L0 = `input:not([type='hidden']), textarea, select, .${wi}[role='combobox'], [role='spinbutton']`, R0 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, z0 = {
	Error: Li,
	Warning: T0,
	Info: E0
}, B0 = `.${Li}, .${T0}, .${E0}`, V0 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, H0 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, U0 = {
	Error: `${j0}--error`,
	Warning: `${j0}--warning`,
	Info: `${j0}--info`
}, W0 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, G0 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(B0)), B(this.root, B0, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(B0)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(B0)) {
			let t = T(e);
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
			Q0(t, X0(t) === "Error");
			let e = t.querySelector(`:scope > [${Ri}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), $0(this.markerMirrors, t, e, {
				message: n,
				severity: X0(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = Tc(t), r = X0(e);
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
		if (e.propertyName === P0) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = F0.has(e.propertyName), n = I0.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(T(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(T(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = w(e.reference.componentId), n = S0(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => ea(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = E(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: w0(e.severity),
			content: e.content === !0,
			property: oa(e.address?.property)
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
		let n = A(t) || O(t) ? null : J0(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return Y0(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = jl(e);
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
			severity: W0[t]
		}), this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) if (w0(r.severity) === "Error" && K0(t, r) && !K0(n, r)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !K0(t, r) && (n === null || R0[w0(r.severity)] < R0[w0(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: H0[w0(n.severity)],
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
		Z0(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(C0).join("\n"), !0);
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
			severity: w0(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || R0[e.severity] < R0[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => ea(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => ea(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${on}="${Bi(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(L0)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Tm() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && w0(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) K0(r, e) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function K0(e, t) {
	return Qi(t.operator) !== "Required" && q0(e) ? !0 : dm(e, t.operator, t.value);
}
function q0(e) {
	return e !== !1 && !dm(e, "Required", null);
}
function J0(e, t) {
	return WD(e, t) ?? (e.matches(TA) ? Oj(e) : null);
}
function Y0(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : E(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function X0(e) {
	return e.classList.contains(T0) ? "Warning" : e.classList.contains(E0) ? "Info" : "Error";
}
function Z0(e, t, n) {
	for (let e of Object.values(z0)) t.classList.toggle(e, n !== void 0 && z0[n.severity] === e);
	Q0(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(N0) : r.style.setProperty(N0, `var(--ui-color-${V0[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Cc(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), $0(e, r, i, n));
}
function Q0(e, t) {
	for (let n of e.querySelectorAll(L0)) {
		let r = n.closest(Ci);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function $0(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(M0).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(D0, o), e2(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(A0).trim()), r !== void 0 && o) {
		n.setAttribute(Re, To(n.textContent ?? "")), n.setAttribute(ze, O0), n.setAttribute(Ve, H0[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? fL(n) : pL(n);
		return;
	}
	n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), pL(n);
}
function e2(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : n2(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && t2(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${j0} ${U0[n.severity]}`, s.textContent = r, s.setAttribute(Re, To(r)), s.setAttribute(ze, k0), s.setAttribute(Ve, H0[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (t2(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), pL(s);
}
function t2(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${j0}`) === null && t.removeAttribute(Be);
}
function n2(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var r2 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, i2 = "card-header-shown", a2 = `[${ki}], [${Ai}], [${Mi}], [${Ni}], [${Pi}]`;
function o2(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(a2);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Fi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var s2 = "menu-surface";
function c2(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = wC(e);
	n === null ? t.removeAttribute(_n) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(_n, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var l2 = "tooltip-name";
function u2(e, t, n) {
	let r = wo(e.getAttribute(Re));
	if (Cc(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var d2 = /* @__PURE__ */ new WeakMap(), f2 = /* @__PURE__ */ new WeakMap(), p2 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(na(e), t);
	}
	apply(e) {
		let t = na(e.operation.kind), n = this.handlers.get(t);
		if (n === void 0) {
			s("DOM operation kind is not supported.", {
				kind: e.operation.kind,
				operation: e.operation
			});
			return;
		}
		try {
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
		this.register("Text", (e) => m2(e)), this.register("Markup", (e) => {
			if (e.target.hasAttribute("data-ui-plain-text")) {
				m2(e);
				return;
			}
			Eo(e.target, El(e.convertedValue) ? "" : Tl(e.convertedValue)), Cc(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = S2(e.operation);
			if (Cc(e.target, t), e.operation.convertsNull !== !0 && El(e.value) || El(e.convertedValue)) {
				x2(e.target, t);
				return;
			}
			b2(e.target, t, Tl(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = S2(e.operation);
			Cc(e.target, t), x2(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = S2(e.operation), n = e.operation.condition ?? "HasValue", r = !El(e.value) && h2(e.value, n), i = e.operation.value ?? (El(e.convertedValue) || g2(n) ? "" : Tl(e.convertedValue));
			_2(e.target, y2(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !El(e.value) && h2(e.value, e.operation.condition ?? "None") ? Tl(e.convertedValue).trim() : "";
			v2(e.target, y2(e), t, vC(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = S2(e.operation), n = !El(e.value) && h2(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Tl(e.convertedValue).trim() : "";
				v2(e.target, y2(e), t, vC(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = S2(e.operation), n = e.target;
			if (El(e.value) || El(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Tl(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(l2, (e) => u2(e.resolved.component, e.target, S2(e.operation))), this.register(HQ, (e) => GQ(e.target, e.value)), this.register(i2, (e) => o2(e.resolved.component)), this.register(Mc, (e) => Nc(e.target)), this.register(IQ, (e) => VQ(e.target)), this.register(iP, (e) => oP(e.target)), this.register(lP, (e) => fP(e.resolved.component)), this.register(Ax, (e) => {
			let t = Hx(e.target);
			t !== "keep" && _2(e.resolved.component, Ax, S2(e.operation), t === "show", "");
		}), this.register(s2, (e) => c2(e.target)), this.register("Property", (e) => {
			let t = S2(e.operation), n = e.target, r = El(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function m2(e) {
	let t = Tl(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), Cc(e.target, null);
}
function h2(e, t) {
	switch (ra(t)) {
		case "None": return !0;
		case "HasValue": return !El(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !El(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return uo(e).length > 0;
		default: return !El(e);
	}
}
function g2(e) {
	let t = ra(e);
	return t === "IsTrue" || t === "IsFalse";
}
function _2(e, t, n, r, i) {
	let a = f2.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), f2.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), b2(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && x2(e, n);
}
function v2(e, t, n, r) {
	let i = d2.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), d2.set(e, i));
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
function y2(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function b2(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function x2(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function S2(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var C2 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => CC.has(e.name),
			convert: (e) => CC.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = w2(e.name), n = {
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
function w2(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var T2 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = ha(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = ha(e.domEventName) || t;
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
		return this.definitions.get(ha(e));
	}
};
function E2(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function D2(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(wf, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => E2(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => E2(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var O2 = class {
	converters = new C2();
	events = new T2();
	operations = new p2();
	valueReaders;
	collectionSinks = new c0();
	rowDecorators = new r2();
	constructor(e, t, n, r) {
		D2(this.events), this.valueReaders = new Ol(r);
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
}, k2 = "Submenu", A2 = "ui-menu__submenu", j2 = "Select", M2 = ["Header", "Separator"], N2 = {
	kind: "menu",
	decorate: P2
};
function P2(e) {
	if (M2.includes(I2(e.item, "Kind")) && e.row.setAttribute(hn, ""), !F2(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, k2);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(un, ""), I2(e.item, "Kind") === j2 && e.row.setAttribute(dn, ""), I2(e.item, "Expanded") === !0 && e.row.setAttribute(fn, "");
	let r = document.createElement("div");
	r.className = A2, r.appendChild(n), aY(r, e.key, e.item), e.row.appendChild(r);
}
function F2(e) {
	let t = I2(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function I2(e, t) {
	let n = DO(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var L2 = {
	kind: "grip",
	decorate: R2
};
function R2(e) {
	e.row.append(z2());
}
function z2() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function B2(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(H2(n));
	for (let t of e.querySelectorAll(`[${mt}]`)) V2(t, pt, r), V2(t, vt, i);
}
function V2(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function H2(e) {
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
var U2 = `[${bt}]`;
function W2(e) {
	for (let t of e.querySelectorAll(U2)) t.removeAttribute(bt);
}
//#endregion
//#region src/runtime/engine-start.ts
var G2 = 2;
function K2(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= G2 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function q2(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var J2 = "ne.standard.ui.windowId", Y2 = [
	500,
	1e3,
	2e3
], X2 = 3, Z2 = [
	["refusal", ({ root: e }) => iJ(e)],
	["file input", ({ root: e, validation: t }) => new Sy({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Fb({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new ex({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Ex({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new ux({ root: e })],
	["image fallback", ({ root: e }) => new eS({ root: e })],
	["radio group sync", ({ root: e }) => new _S({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new qT({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new zw({ root: e })],
	["debounced commit", ({ root: e }) => new yx({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new fE({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => hE() ? void 0 : new gE({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new SW({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new UE({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new dH({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new OM({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new fN({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new xN({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new aK({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new SK({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new TK({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new rF({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new EB({ root: e })],
	["toggle button", ({ root: e }) => new sx({ root: e })],
	["button group", ({ root: e }) => new MB({ root: e })],
	["menu", ({ root: e }) => new CL({ root: e })],
	["action bar", ({ root: e, dom: t }) => new VF({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new pz({ root: e })],
	["menu group", ({ root: e }) => new OP({ root: e })],
	["menu search", ({ root: e }) => new PR({ root: e })],
	["side drawer", ({ root: e }) => new $R({ root: e })],
	["screen keyboard", () => new WR()],
	["grid splitter", ({ root: e }) => new Dz({ root: e })],
	["pane container", ({ root: e }) => new $z({ root: e })],
	["accordion", ({ root: e }) => new IB({ root: e })],
	["tabs", ({ root: e }) => new oV({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new IG({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new bV({ root: e })],
	["breadcrumbs", ({ root: e }) => new FV({ root: e })],
	["scroll anchor", ({ root: e }) => new UK({ root: e })],
	["visible keys", ({ root: e }) => new LJ({ root: e })],
	["surface press", ({ root: e }) => new MH({ root: e })],
	["text selection", ({ root: e }) => new XK({ root: e })],
	["scroll group", ({ root: e }) => new rq({ root: e })],
	["flyout interaction", ({ root: e }) => new F_({ root: e })],
	["text fold", ({ root: e }) => new YG({ root: e })],
	["tooltip", ({ root: e }) => MI(e)]
], Q2 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Ki(EX());
	hydration = AX();
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
	sessionKey = Yv;
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
		this.options = e, this.root = e.root ?? document, this.windowId = GX(e.windowIdStorageKey ?? J2, (e) => this.reloadAsOwnTab(e)), this.dom = new Ma(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new O2(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(N2), this.extensions.registerRowDecorator(L2), this.extensions.registerRowDecorator(uS);
		let t = new ba(this.dom, this.metadata), n = this.extensions.operations, r = new pZ(), i = new L1(t, n, this.extensions, r);
		this.reactiveSources = new V1(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new v1({
			root: this.root,
			dom: this.dom
		}), this.notifications = new V$({
			root: this.root,
			dom: this.dom
		}), this.address = new M1({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => hG(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = LX(document.documentElement, this.windowId, o);
		this.effects = new o1({
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
			systemNotifications: pG(u)
		});
		let d = new ym(this.metadata), f, p = new am(d, i, new um(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new _X(this.dom), h = new tY(this.metadata, m, this.extensions, n, r), g = new xX({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), nF((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new tX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new d0(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), D.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), D.onMomentTick(this.rewriteMoments), this.ruleWatcher = new fY({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new DQ(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new fG({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new cZ(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Gi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Gi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				wX(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && wX(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new MQ(this.transport);
		f = new Pp({
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
			gx(), await _.whenAnsweredAsync();
		}, this.effects.register(Gi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new k1({
			window: {
				location: {
					get href() {
						return window.location.href;
					},
					assign: (e) => this.sessionKey.load(() => window.location.assign(e))
				},
				addEventListener: (e, t) => window.addEventListener(e, t),
				removeEventListener: (e, t) => window.removeEventListener(e, t)
			},
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => E1(this.dialogs, t),
			pending: () => hx() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Kv, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(Gi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Ga(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let v = new G0({
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
		for (let [e, t] of Z2) K2(e, t, this.engineContext);
		K2("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new HD({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), K2("tree", ({ root: e, effects: t }) => new QW({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), K2("items reorder", ({ root: e }) => new Dk({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), K2("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new hq({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || p.hasEventForComponent("click", T(e))
		}) : void 0, this.engineContext), K2("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new jq() : void 0, this.engineContext), this.eventPipeline = new Hp({
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
			valueBinding: f
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(MG.name, MG.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = wk({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = PG(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(ZW.name, ZW.registration);
		let re = lA(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(wx.name, wx.registration), K2("shortcuts", ({ root: e, dom: t }) => new PL({
			root: e,
			viewShortcuts: FL(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), K2("item drag", ({ root: e, dom: t }) => new fA({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new pU({ root: this.root }), this.windows = new AY({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), K2("pager", ({ root: e, dom: t }) => new _R({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: B,
			observeSize: vz,
			store: new nP(),
			numbers: yD,
			temporal: As,
			icons: { apply: so },
			badges: { writeCount: gw },
			urls: {
				isImageSource: Ya,
				asBrowserReads: Ja,
				isSafeLink: Va,
				isExternalLink: Wa
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
			tooltips: dL,
			renames: { open: tu },
			tables: this.tables,
			rows: ZJ(m, h, this.virtualization),
			uploads: dy(v),
			selection: Ed,
			popups: SJ(this.dom),
			roving: Fu,
			typeAhead: oN,
			focus: sp,
			states: Kc,
			validation: v,
			wheel: Gy,
			colors: AJ,
			shortcuts: xu,
			names: zi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			Xv(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			fZ(() => this.applyChanges(n, void 0, t), () => {
				!this.holdsRuntime(t) || this.dispatcher.settle(r) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new eZ({
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
		let t = jl(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && i4() === null && P1(t, n, r);
	}
	async switchRuntimeAsync() {
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = e4();
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
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, Ac(this.root, (e) => B2(e, D.number, D.temporal)));
		let i = n ? ec : void 0;
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
		Ac(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${Bi(n)}"]`)) wa(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => wa(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
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
		let t = VX(e, navigator.cookieEnabled, UX());
		if (t === "no-cookie") {
			this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`));
			return;
		}
		if (t === "asked-again") {
			this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`));
			return;
		}
		s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload();
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		if (VX(e, navigator.cookieEnabled, UX()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload();
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), KQ(this.root), await r4();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), W2(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Sc(this.root) || kX(this.hydration) || this.metadata.getWords().some((e) => ec(e.key)) || ec(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) K2(q2(t), t, this.pluginContext);
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
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		K2(q2(e), e, this.pluginContext);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !aZ(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await oZ(e, r) : null);
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
			if (e >= X2) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await MX(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, Y2, n4), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			HX(UX()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = e4();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && t4(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = i4(), n = t === null && this.heldRuntime !== null && P1(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? I1(e) : t.parameters,
			timeZone: NX(),
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
			let t = aZ(e) ? await oZ(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null;
	}
};
async function $2(e = {}) {
	let t = performance.now(), n = new Q2(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function e4() {
	return document.querySelector(`[${jn}="${LQ}"]`);
}
function t4(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) KK(t) && !(W(t) === "windowed" && qK(t)) ? (VK(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function n4(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function r4() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function i4() {
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
_(), $2().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
