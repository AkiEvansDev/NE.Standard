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
], hi = "data-ui-submit-form-id", C = `[${y}]`, gi = "data-ui-href", _i = "ui-disabled", vi = "ui-loading", yi = "ui-readonly", bi = "ui-hidden", xi = "ui-dialog__surface", Si = "ui-flyout__content", Ci = `.ui-context-menu, .ui-split-button__menu, .${Si}`, wi = "data-ui-focus-holder", Ti = "data-ui-owns-keys", Ei = "[role='listbox'], [role='menu'], [role='dialog']", Di = "ui-select__trigger", Oi = `.${Di}`, ki = "ui-button", Ai = "ui-button--ghost", ji = "ui-button--small", Mi = `${ki} ${Ai} ${ji}`, Ni = "ui-select", Pi = "data-ui-text-title", Fi = "data-ui-text-description", Ii = "data-ui-plain-text", Li = "data-ui-text-icon", Ri = "data-ui-text-badge-icon", zi = "data-ui-text-badge-text", Bi = "ui-card__header--empty", Vi = "ui-text-input", Hi = "ui-invalid", Ui = "data-ui-validation-message", Wi = {
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
	ghostButtonClass: Ai,
	smallButtonClass: ji,
	selectClass: Ni,
	textInputClass: Vi,
	invalidClass: Hi,
	validationMessage: Ui,
	sourceLine: Jt,
	textDescription: Fi,
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
function Gi(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Ki(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var qi = 0;
function Ji(e, t) {
	return e.id.length === 0 && (qi++, e.id = `${t}-${qi}`), e.id;
}
function w(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/addressing/operation-targets.ts
function Yi(e, t, n) {
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
var Xi = {
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
}, Zi = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(T(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${T(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(T(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (T(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Sa(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Sa(e, xa(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ca(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(ba(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ba(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(wa(e, t))?.items ?? [];
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
		let t = T(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = T(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Sa(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Sa(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = ba(e.eventName), n = T(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ca(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = T(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = T(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = T(e.componentId);
		t > 0 && this.itemValuesByAddress.set(wa(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = T(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function Qi(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function $i(e) {
	return Qi(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ea(e) {
	return e == null ? "OneWay" : Qi(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ta(e) {
	return Qi(e, ["Property", "Event"]);
}
function na(e) {
	return e == null ? "SetProperty" : Qi(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function ra(e) {
	return Qi(e, [
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
function ia(e) {
	return Qi(e, ["Ascending", "Descending"]);
}
function aa(e) {
	return Qi(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function oa(e) {
	return Qi(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function sa(e) {
	return typeof e == "string" ? e : Qi(e, [
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
function ca(e) {
	return Qi(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function la(e) {
	return Qi(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function T(e) {
	return e ?? 0;
}
function ua(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function da(e) {
	return typeof e == "string" ? e : "";
}
function fa(e) {
	return Qi(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function pa(e) {
	return typeof e == "string" ? e.trim() : "";
}
function ma(e) {
	return Qi(e, ["Auto", "Smooth"]);
}
function ha(e) {
	return Qi(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ga(e) {
	return Qi(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function _a(e) {
	return Qi(e, ["Light", "Dark"]);
}
function va(e) {
	return Qi(e, ["Horizontal", "Vertical"]);
}
function ya(e) {
	return Qi(e, ["Polite", "Assertive"]);
}
function ba(e) {
	return e?.trim().toLowerCase() ?? "";
}
function xa(e) {
	return e?.trim() ?? "";
}
function Sa(e, t) {
	return `${e}:${xa(t)}`;
}
function Ca(e, t) {
	return `${e}:${ba(t)}`;
}
function wa(e, t) {
	return `${e}:${ua(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Ta = class {
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
		return this.dom.findAllComponents(T(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = T(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = T(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? this.bindingSelector(a, r.propertyName) : null;
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
		return n === void 0 && (n = `[${Je}${Ki(t)}="${Gi(e)}"]`, this.bindingSelectors.set(e, n)), n;
	}
	resolvePropertyOn(e, t) {
		let n = T(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Yi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ye}${Ki(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ea(e) {
	return Aa(e, ae);
}
function Da(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Ma(r);
		if (e !== void 0) {
			let t = r.closest(ja);
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
function Oa(e, t) {
	let n = Ea(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Da(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function ka(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Ma(r);
		if (e !== void 0) {
			let a = r.closest(ja);
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
function Aa(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var ja = `[${x}]`;
function Ma(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Na = `[${Ft}]`, Pa = 64, Fa = 256;
function Ia(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var La = class {
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
		this.stale || (e === void 0 || this.changedScopes.size >= Pa ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(C), t = this.root.querySelector(Na) !== null;
		for (let n of e) {
			let e = E(n);
			if (e <= 0 || t && n.closest(Na) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Ba(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Ji(e, t);
	}
	findComponentParts(e, t, n) {
		return Ia(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ua(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && Oa(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => Oa(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Fa) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Na) !== null) return;
		let t = e.querySelector(Na) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(C)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = E(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Na) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Ba(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Ua(t) && t.sort(Ha), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Ba(n)) {
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
			let e = Ea(n);
			if (e === 0) continue;
			let r = Da(n, e);
			if (r.length !== e) continue;
			let i = ua(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return Wa(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(C);
			if (e === null || !Wa(this.root, e)) return null;
			let r = E(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Da(e, Ea(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function E(e) {
	return Aa(e, y);
}
function Ra(e) {
	let t = e.closest(C), n = t === null ? 0 : E(t);
	return n > 0 ? n : null;
}
function za(e) {
	let t = e.closest(C), n = t === null ? 0 : E(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Da(t, Ea(t))
	};
}
function Ba(e) {
	return Ea(e) === 0;
}
function Va(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Ha(e, t) {
	return e === t ? 0 : Va(e, t) ? -1 : 1;
}
function Ua(e) {
	for (let t = 1; t < e.length; t++) if (!Va(e[t - 1], e[t])) return !1;
	return !0;
}
function Wa(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ga = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Ka(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ga.includes(t.slice(0, n).toLowerCase());
}
function qa(e) {
	return Ka(e) ? String(e) : void 0;
}
var Ja = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Ya(e) {
	let t = $a(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Ja.some((e) => n.startsWith(e));
}
function Xa(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Za(e);
}
function Za(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Qa(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function $a(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function eo(e) {
	return to(e) !== null;
}
function to(e) {
	let t = $a(e), n = t.toLowerCase();
	return Za(t) || Qa(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function no(e) {
	return to(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var ro = "mask:", io = "ui-icon--image", ao = "ui-icon--mask";
function oo(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(ro) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? to(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function so(e) {
	let t = oo(e);
	return t === null ? "" : co(t.source);
}
function co(e) {
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
var lo = "ui-icon", uo = "data-ui-icon", fo = "--ui-icon-url";
function po(e, t) {
	e.classList.add(lo);
	for (let t of Array.from(e.classList)) ho(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(fo);
	let n = go(t);
	if (n.length === 0) {
		e.removeAttribute(uo);
		return;
	}
	e.setAttribute(uo, ""), e.classList.add(n);
	let r = oo(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(fo, co(r.source));
}
var mo = "ui-icon-glyph--";
function ho(e) {
	return e === io || e === ao || e.startsWith(mo);
}
function go(e) {
	let t = oo(e);
	return t === null ? _o(e) : t.tinted ? ao : io;
}
function _o(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = mo;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var vo = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, yo = "\\", bo = "`", xo = "!", So = "{", Co = "}", wo = "ui-text__fold", To = "ui-text__fold-toggle", Eo = "ui-text__fold-content", Do = 8;
function Oo(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Bo(new Yo(e), 0, e.length, vo.None, null, t, n), Vo(t, n, vo.None, null), t;
}
function ko(e) {
	return Oo(e).map((e) => Po(e) ? `${e.fold} ${ko(e.text)}` : e.text).join("");
}
function Ao(e) {
	let t = "";
	for (let n of e) t += Qo(n) ? yo + n : n;
	return t;
}
function jo(e, t, n = {}) {
	let r = Oo(t), i = r.some(Po);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ke, i), r.length === 0 ? e.textContent = "" : r.length === 1 && Mo(r[0]) ? e.textContent = r[0].text : e.replaceChildren(Fo(r, n));
}
function Mo(e) {
	return e.styles === vo.None && e.url === null && !No(e) && !Po(e);
}
function No(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Po(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Fo(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Io(r, t));
	return n;
}
function Io(e, t) {
	if (No(e)) return Ro(e.icon);
	let n = Po(e) ? Lo(e, t) : document.createTextNode(e.text);
	if ((e.styles & vo.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & vo.Strikethrough) !== 0 && (n = zo("s", n)), (e.styles & vo.Underline) !== 0 && (n = zo("u", n)), (e.styles & vo.Italic) !== 0 && (n = zo("em", n)), (e.styles & vo.Bold) !== 0 && (n = zo("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Ya(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Lo(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${wo} ${wo}--static` : wo, r.className = To, r.textContent = e.fold ?? "", i.className = Eo, i.append(Fo(Oo(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Qe, ""), n.append(r, i), n);
}
function Ro(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", po(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function zo(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Bo(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === yo && c + 1 < n && Qo(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Ho(e, c, n);
		if (l !== null) {
			Vo(a, o, r, i), Uo(s, c + 1, l, o), Vo(a, o, r | vo.Code, i), c = l + 1;
			continue;
		}
		let u = Ko(e, c, n);
		if (u !== null) {
			Vo(a, o, r, i), Bo(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Vo(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Wo(e, c, n);
		if (d !== null) {
			Vo(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? qo(e, c, n) : null;
		if (f !== null) {
			Vo(a, o, r, i), Bo(e, f.labelStart, f.labelEnd, r, f.url, a, o), Vo(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Jo(e, c, n);
		p === null ? (o.value += t, c++) : (Vo(a, o, r, i), a.push({
			text: s.slice(p.contentStart, p.contentEnd),
			styles: r,
			url: i,
			fold: p.caption
		}), c = p.contentEnd + 1);
	}
}
function Vo(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Ho(e, t, n) {
	let r = e.text;
	if (r[t] !== bo) return null;
	let i = t + 1;
	if (i >= n || $o(r[i])) return null;
	let a = e.findClosingMarker(i, n, bo, 1);
	return a > i ? a : null;
}
function Uo(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === yo && i + 1 < n && Qo(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function Wo(e, t, n) {
	let r = e.text;
	if (r[t] !== xo || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Go(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Go(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Ko(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = vo.Bold, s = 2;
	else if (i === "*") o = vo.Italic, s = 1;
	else if (i === "_" && a) o = vo.Underline, s = 2;
	else if (i === "~" && a) o = vo.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || $o(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function qo(e, t, n) {
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
function Jo(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== So || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Do) return null;
	let c = { value: "" };
	return Uo(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Yo = class {
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
		return this.closeBrackets ??= this.next("]", !0), Xo(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Xo(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Xo(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Xo(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Zo(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !$o(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Ka(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === yo && e[t - 1] === 0);
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
			if (this.text[r] === So) n.push(r);
			else if (this.text[r] === Co && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || $o(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Xo(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Zo(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Qo(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === So || e === Co || e === bo || e === yo;
}
function $o(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/runtime/plural-rules.ts
function es(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = ts(n);
	switch (ns(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : rs(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : rs(r, i) ? "many" : "other";
		case "ru":
		case "uk": return is(r, i);
		case "pl": return as(r, i);
		default: return "other";
	}
}
function ts(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function ns(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function rs(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function is(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function as(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function os(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var ss = {
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
function cs(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return ss;
	try {
		return {
			...ss,
			...JSON.parse(t)
		};
	} catch {
		return ss;
	}
}
var ls = [
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
function us(e, t, n) {
	if (t == null || t.trim().length === 0) return `${_s(e.getFullYear(), 4)}-${_s(e.getMonth() + 1, 2)}-${_s(e.getDate(), 2)} ${_s(e.getHours(), 2)}:${_s(e.getMinutes(), 2)}:${_s(e.getSeconds(), 2)}`;
	let r = "", i = ds(t);
	for (let a = 0; a < t.length;) {
		let o = hs(t, a);
		o === null ? (r += t[a], a++) : (r += gs(o, e, n, i), a += o.length);
	}
	return r;
}
function ds(e) {
	for (let t = 0; t < e.length;) {
		let n = hs(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var fs = /^[-./:,]$/, ps = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function ms(e) {
	for (let t = 0; t < e.length;) {
		let n = hs(e, t);
		if (n !== null && ps.has(n) || n === null && !fs.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function hs(e, t) {
	for (let n of ls) if (e.startsWith(n, t)) return n;
	return null;
}
function gs(e, t, n, r) {
	let i = t.getHours(), a = Is(i);
	switch (e) {
		case "yyyy": return _s(t.getFullYear(), 4);
		case "yy": return _s(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return _s(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return _s(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return _s(i, 2);
		case "H": return String(i);
		case "hh": return _s(a, 2);
		case "h": return String(a);
		case "mm": return _s(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return _s(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function _s(e, t) {
	return String(e).padStart(t, "0");
}
var vs = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function ys(e) {
	let t = vs.exec(e.trim());
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
function bs(e) {
	return xs(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function xs(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Ss = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Cs(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = hs(e, r);
		i === null ? (n += e[r], r++) : (n += ws(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function ws(e, t) {
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
function Ts(e, t, n) {
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
		let a = hs(t, e);
		if (a === null) {
			if (!Es(r, i, t[e])) return null;
			e++;
		} else {
			if (!Ds(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? Ps(i) : null;
}
function Es(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return fs.test(n) ? t.position >= e.length || !fs.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Ds(e, t, n, r) {
	switch (n) {
		case "yyyy": return Os(t, "year", js(e, t, 4, 4));
		case "yy": return Os(t, "year", ks(js(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Os(t, "month", As(Ms(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Os(t, "month", js(e, t, 1, 2));
		case "dddd":
		case "ddd": return Ms(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Os(t, "day", js(e, t, 1, 2));
		case "HH":
		case "H": return Os(t, "hour", js(e, t, 1, 2));
		case "hh":
		case "h": return Os(t, "hour12", js(e, t, 1, 2));
		case "mm":
		case "m": return Os(t, "minute", js(e, t, 1, 2));
		case "ss":
		case "s": return Os(t, "second", js(e, t, 1, 2));
		case "tt": return Ns(e, t, r);
		default: return !1;
	}
}
function Os(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function ks(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function As(e) {
	return e === null ? null : e + 1;
}
function js(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Ms(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Ns(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ps(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > xs(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Fs = {
	readCulture: cs,
	format: us,
	parse: ys,
	toDate: bs
};
function Is(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Ls = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Rs = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function zs(e) {
	let t = e?.trim() ?? "";
	if (!Rs.test(t)) return null;
	let n = Date.parse(Ls.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Bs(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Vs(e) {
	return e === "relative" || e === "relative-date";
}
var Hs = {
	...ss,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Us(e, t, n, r) {
	if (t === "relative") return ec(e - r, n.language);
	if (t === "relative-date") {
		let t = Gs(e, r);
		if (t !== null) return Js(n.language).format(t, "day");
	}
	let i = n.temporal ?? Hs, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : os(i, !1);
	return us(new Date(e), a, i);
}
function Ws(e, t, n, r) {
	let i = Us(e, t, n, r);
	return t === "relative-date" ? Ks(i, n.language) : i;
}
function Gs(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / $s);
	return Math.abs(i) <= 1 ? i : null;
}
function Ks(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Ys(t)) + e.slice(1);
}
var qs = /* @__PURE__ */ new Map();
function Js(e) {
	let t = qs.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Ys(e), { numeric: "auto" }), qs.set(e, t)), t;
}
function Ys(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Xs = 1e3, Zs = 60 * Xs, Qs = 60 * Zs, $s = 24 * Qs;
function ec(e, t) {
	let n = Js(t), r = Math.abs(e);
	return r < 45 * Xs ? n.format(0, "second") : r < 45 * Zs ? n.format(Math.round(e / Zs), "minute") : r < 22 * Qs ? n.format(Math.round(e / Qs), "hour") : r < 26 * $s ? n.format(Math.round(e / $s), "day") : r < 320 * $s ? n.format(Math.round(e / (30.4375 * $s)), "month") : n.format(Math.round(e / (365.25 * $s)), "year");
}
//#endregion
//#region src/runtime/words.ts
var tc = "count";
function D(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function nc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var rc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function ic(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && zs(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && rc.has(t.format));
}
function ac(e) {
	if (typeof e != "object" || !e) return !1;
	if (ic(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (ac(t)) return !0;
	return !1;
}
function oc(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function sc(e, t, n) {
	return D(e) ? uc(n, e.key, e.args) : nc(e) ? cc(n, e.text) : t && typeof e == "string" ? cc(n, e) : e;
}
function cc(e, t) {
	return t.trim().length === 0 || !lc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function lc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function uc(e, t, n, r = !1) {
	let i = n?.[tc];
	return dc(typeof i == "number" ? e.lookup(`${t}.${es(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => nc(t) ? cc(e, t.text) : uc(e, t.key, t.args, r), e.writeMoment, r);
}
function dc(e, t, n, r = oc, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = fc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += mc(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function fc(e, t) {
	let n = t + 1;
	for (; n < e.length && pc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function pc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function mc(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? Ao(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (D(e)) return t === void 0 ? dc(e.key, e.args, void 0, n, r) : t(e);
	if (nc(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? Ao(n) : n;
	}
	return ic(e) ? n(zs(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var hc = `script[type='application/json'][${yt}]`;
function gc(e) {
	let t = e.querySelector(hc)?.textContent?.trim() ?? "";
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
var _c = 15e3, vc = /* @__PURE__ */ new Set(), yc = null;
function bc(e) {
	vc.add(e), yc === null && (yc = setInterval(xc, _c));
}
function xc() {
	for (let e of [...vc]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || vc.delete(e);
	}
	vc.size === 0 && yc !== null && (clearInterval(yc), yc = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Sc = 256, Cc = 512, wc = "script[type='application/json'][data-ui-strings]", Tc = `[${Vr}*='"moment"']`, Ec = class {
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
		this.tableLoaded || (this.currentTemporal = gc(e) ?? this.currentTemporal);
		let t = e.querySelector(wc)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), uc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return uc(this, e, t, n);
	}
	writeMoment = (e, t) => (Vs(t) && this.noteRelative(), Us(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && bc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return sc(e, t, this);
	}
	resolveText(e) {
		return sc(e, !0, this);
	}
	write(e, t, n, r) {
		Pc(e, t, this.translate(n, r, Nc(t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Pc(e, t, sc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (D(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = nc(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (Pc(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		kc(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Fc(e, (e) => {
			for (let n of e.querySelectorAll(t ? Tc : `[${Vr}]`)) for (let [e, r] of Object.entries(Mc(n))) {
				if (t && !ac(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, Nc(i));
				a !== null && Pc(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return sc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Cc || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && lc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += Sc) try {
			let a = await e(t, n.slice(r, r + Sc));
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
function Dc(e) {
	let t = !1;
	return Fc(e, (e) => {
		t ||= e.querySelector(Tc) !== null;
	}), t;
}
function Oc(e, t) {
	e.hasAttribute("data-ui-words") && kc(e, t, null);
}
function kc(e, t, n) {
	let r = Mc(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	w(e, Vr, Object.keys(r).length === 0 ? null : a);
}
function Ac(e) {
	return jc(e, null);
}
function jc(e, t) {
	let n = Mc(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function Mc(e) {
	let t = e.getAttribute(Vr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Nc(e) {
	return e === Re;
}
function Pc(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Fc(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Fc(n.content, t);
}
var O = new Ec();
function Ic(e, t) {
	let n = nc(e) ? e.text : e;
	return O.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Lc = "row-idle";
function Rc(e) {
	let t = e.parentElement;
	t !== null && (Hc(t) ? zc(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Hc(t.parentElement) && zc(t.parentElement));
}
function zc(e) {
	let t = Bc(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(kr, t);
}
function Bc(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if (Vc(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && Vc(e)) return !0;
	return !1;
}
function Vc(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Hc(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Uc = `.${_i}, .${vi}, [inert]`;
function Wc(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var Gc = Wc(Uc), Kc = /* @__PURE__ */ new Map();
function k(e) {
	return e.closest(Uc) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function A(e) {
	return e.matches(Uc) || e.querySelector(Gc) !== null;
}
function qc(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Kc.get(t);
	return n === void 0 && (n = Wc(`[${t}]`), Kc.set(t, n)), e.querySelector(n) !== null;
}
function Jc(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Yc = `[${y}], .${yi}`;
function j(e) {
	return e.closest(Yc)?.matches(`.${yi}`) === !0;
}
function Xc(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(_i, t), Rc(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Zc = {
	isInert: k,
	isReadOnly: j,
	setDisabled: Xc
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Qc(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function $c(e) {
	let t = [];
	for (let n of nl(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = $c(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = el(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function el(e) {
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
	if (n !== null) return tl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return tl(r[3] === "fr" ? {
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
function tl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function nl(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function rl(e, t = "auto") {
	return e.map((e) => il(e, t)).join(" ");
}
function il(e, t) {
	switch (e.kind) {
		case "px": return `${al(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${al(e.min)}px`}, ${al(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${al(e.max)}px)` : `minmax(${al(e.min)}px, auto)`;
	}
}
function al(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ol(e) {
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
function sl(e, t) {
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
function cl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = ll(r, e), o = ll(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function ll(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var ul = {
	sliver: 120,
	passFloors: !1
};
function dl(e, t, n, r, i = ul) {
	let a = ml(e, t, n.before), o = ml(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = pl(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = yl(n.before, e) + yl(n.after, e), r = a.total + o.total;
		hl(d, e, a, t * (a.total + u) / r), hl(d, e, o, t * (o.total - u) / r);
	} else f || gl(d, a, a.total + u), p || gl(d, o, o.total - u);
	return i.passFloors && (fl(d, a, a.total + u), fl(d, o, o.total - u)), d;
}
function fl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function pl(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function ml(e, t, n) {
	let r = vl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function hl(e, t, n, r) {
	let i = yl(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function gl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			..._l(e[i])
		};
	}
}
function _l(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function vl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function yl(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function bl(e, t) {
	return Math.round(xl(e, t) * 100);
}
function xl(e, t) {
	let n = vl(t.before, e), r = n + vl(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Sl(e, t, n) {
	let r = vl(t.before, e);
	return (r + vl(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function Cl(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function wl(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Tl = /* @__PURE__ */ new Set();
function El(e, t, n, r) {
	let i = ml(e, t, n.before), a = ml(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Dl(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = ml(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Ol(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function kl(e, t, n, r = Tl) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Al(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function jl(e) {
	return e == null;
}
var Ml = "data-ui-trim-input", Nl = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Ll) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Bt);
		if (t === null) return Pl(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Ml) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Il(e);
		return t === null ? null : this.read(t);
	}
};
function Pl(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Fl = "input, textarea, select";
function Il(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Fl) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Fl}`);
}
var Ll = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => Cl(e.getAttribute(qn))
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
		read: (e) => Rl(e, oi)
	},
	{
		kind: Vt,
		read: (e) => Rl(e, ut)
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
function Rl(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function zl(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Bl(e) {
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
		default: o = nu(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Vl(e, t, n = Xl()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Hl(e, t = Xl()) {
	let n = Kl(e.code, t);
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
function Ul(e, t = Xl()) {
	let n = Wl(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function Wl(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Gl[e] ?? e;
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
	Backquote: "`"
};
function Kl(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Jl[e] : void 0) ?? ql[e] ?? e;
}
var ql = {
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
}, Jl = {
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
}, Yl = null;
function Xl() {
	return Yl === null && (Yl = Zl()), Yl;
}
function Zl() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Ql = {
	words(e) {
		let t = Bl(e);
		return t === null ? null : Hl(t);
	},
	aria(e) {
		let t = Bl(e);
		return t === null ? null : Ul(t);
	},
	matches(e, t) {
		let n = Bl(t);
		return n !== null && Vl(n, e);
	},
	isComposing: M
}, $l = 229;
function M(e) {
	return e.isComposing || e.keyCode === $l;
}
function N(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !M(e);
}
var eu = class {
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
function tu(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function nu(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : ru[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : ru[t] ?? null;
}
var ru = {
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
}, iu = "data-ui-rename-field";
function au(e) {
	return e instanceof Element && e.closest(`[${iu}]`) !== null;
}
function ou(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(iu, ""), r.setAttribute(Qe, ""), r.value = e.value, su(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!M(e)) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function su(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = cu(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = lu((r.left - i.left) / s - n.clientLeft), e.style.top = lu((r.top - i.top) / s - n.clientTop), e.style.width = lu(r.width / s), e.style.height = lu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function cu(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function lu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var uu = "data-ui-runs-on-escape", du = "ui-key-value-action__row", fu = "ui-key-value-action__value-input", pu = "ui-key-value-action__edit-action";
function mu(e) {
	return M(e) || hu(e.target) !== null;
}
function hu(e) {
	return e instanceof Element ? au(e) || gu(e) ? e : e.closest("[data-ui-owns-keys]") ?? _u(e)?.cell ?? null : null;
}
function gu(e) {
	return e instanceof Element && e.hasAttribute(uu) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !k(e);
}
function _u(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${fu}, .${pu}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var vu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), yu = /* @__PURE__ */ new Set([
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
]), bu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), xu = /^F\d{1,2}$/;
function Su(e) {
	return e instanceof HTMLInputElement && vu.has(e.type);
}
function Cu(e) {
	return Su(e) || e instanceof HTMLTextAreaElement;
}
function wu(e) {
	return Cu(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Tu(e) {
	let t = e.target;
	if (!wu(t)) return !1;
	if (M(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || xu.test(n) || e.altKey ? !1 : n === "Enter" ? !Su(t) : e.ctrlKey || e.metaKey ? yu.has(n) || bu.has(e.code) : !0;
}
var Eu = {
	...Ql,
	isFieldKey: Tu,
	isPlainKey: N,
	isEscapeClaimed: mu
}, Du = "ui-draft-dropped";
function Ou(e) {
	e.dispatchEvent(new Event(Du, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var ku = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Di}, .ui-field-box`, Au = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", ju = `${Au}, ${ku}, ${Ei}, .${_e}`, Mu = "button, a, summary, [role='button']";
function Nu(e) {
	let t = [];
	for (let n of e.querySelectorAll(ju)) if (!(n.classList.contains("ui-row__grip") || !Iu(e, n) || Fu(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Mu) ? n : null;
}
function Pu(e) {
	let t = [];
	for (let n of e.querySelectorAll(Au)) Fu(e, n) && Iu(e, n) && t.push(n);
	return t;
}
function Fu(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function Iu(e, t) {
	let n = t.closest(Ei);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Lu(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ju);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Ru(e) {
	let t = Hu(e.key), n = Uu(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(F);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function zu(e, t) {
	return Hu(e) !== null || Uu(e, t) !== 0;
}
var Bu = {
	target: Ru,
	applyTabIndex: P
};
function P(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Vu(e, t) {
	t !== null && (P(e, t), t.focus());
}
function F(e) {
	return e.getClientRects().length > 0 && !k(e);
}
function Hu(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Uu(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Wu(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Gu(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${Gt}]`) : null;
}
function Ku(e) {
	let t = Wu(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Ju(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function qu(e, t) {
	let n = Wu(e);
	n.scrollTop = n === e ? t : t + Ju(e, n);
}
function Ju(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Yu(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Xu(e) {
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
function Zu(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Qu(e, t) {
	return t !== null && e.length >= t;
}
function $u(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Qu(e, n) ? null : [...e, t];
}
function ed(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var td = /[,\uFF0C\r\n]/;
function nd(e) {
	return td.test(e);
}
function rd(e) {
	return e.split(td).map((e) => e.trim()).filter((e) => e.length > 0);
}
function id(e) {
	let t = e.split(td), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function ad(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Qu(a, n) ? r : i(a, t);
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
function od(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function sd(e) {
	return od(e, Bn, `.${Nn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function cd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function ld(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var ud = "data-ui-bind-selected-keys", I = `.ui-items-view, .ui-table, .${or}`, dd = `.ui-items-view__item, .${nr}, .${sr}`, fd = ".ui-items-view, .ui-table", pd = {
	shift: !1,
	ctrl: !1
}, md = /* @__PURE__ */ new WeakMap();
function hd(e, t) {
	t !== null && !md.has(e) && gd(e, t);
}
function gd(e, t) {
	let n = R(t);
	n.length > 0 && md.set(e, n);
}
function _d(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function vd(e, t) {
	let n = _d(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function yd(e) {
	return !e.hasAttribute(_r);
}
function L(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function bd(e) {
	switch (e.getAttribute(ri)) {
		case "one": {
			let t = e.getAttribute(ai);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(kd(Ad(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function xd(e, t) {
	let n = bd(e), r = e.getAttribute(ri), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(R(e));
		e.toggleAttribute(ii, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function Sd(e) {
	return e.filter((e) => e.hasAttribute(ii));
}
function Cd(e, t, n, r, i) {
	let a = R(n);
	if (!Ed(n)) return !1;
	switch (e.getAttribute(ri)) {
		case "one": return cd(e, a, {
			attribute: ai,
			bindingAttribute: si,
			apply: (e) => xd(e, t)
		}), !0;
		case "many": return wd(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function wd(e, t, n, r, i, a) {
	let o = Ad(e);
	if (o === null) return;
	let s = kd(o), c;
	if (i.shift) {
		let o = md.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => R(e) === o) ?? n, d = l === null ? Od(t, u, n).map(R) : Dd(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], md.set(e, r)) : (c = [r], md.set(e, r));
	Td(e, t, c);
}
function Td(e, t, n) {
	let r = Ad(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(oi, i), xd(e, t), r.hasAttribute(ud) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ed(e) {
	return R(e).length > 0 && !qc(e, "data-ui-unselectable") && !A(e);
}
function Dd(e, t) {
	let n = new Map(t.map((e) => [R(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || L(t) !== null && Ed(t);
	});
}
function Od(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => L(e) !== null && Ed(e));
}
function kd(e) {
	return Xu(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Ad(e) {
	let t = e.closest(C);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(I) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function R(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var jd = {
	isSelected: (e) => e.hasAttribute(ii),
	toggle: Md,
	setSelected: Nd,
	setSelectedKeys: Pd
};
function Md(e) {
	let t = e.closest(I);
	t !== null && e instanceof HTMLElement && Cd(t, Fd(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Nd(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(R(e));
	Pd(e, r, n);
}
function Pd(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Fd(e), i = new Set(r.filter((e) => !Ed(e)).map(R)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...bd(e)].filter((e) => !a.has(e));
	Td(e, r, n ? [...o, ...a] : o);
}
function Fd(e) {
	return od(e, dd, I);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Id = "--ui-table-order-";
function Ld(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Rd = "ui-table", zd = `[${Qn}]:not(.${ar})`, Bd = `.${nr} > [aria-colspan]:not([${Qn}])`;
function Vd(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	w(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${zd}${o}, ${Bd}${o}`)) {
		if (t.closest(`.${Rd}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			w(t, "aria-colindex", "1"), w(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Qn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : w(t, "aria-colindex", n);
	}
}
//#endregion
//#region src/interactions/row-cursor.ts
var Hd = ".ui-table[role='grid']", Ud = "gridcell", Wd = "aria-colspan", Gd = /* @__PURE__ */ new WeakMap();
function Kd(e) {
	let t = e.closest(I);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(dd);
	return n !== null && n.closest(I) === t ? {
		root: t,
		row: n
	} : null;
}
function qd(e) {
	return e.target instanceof Element && !Tu(e) ? Jd(e.target) : null;
}
function Jd(e) {
	let t = Kd(e);
	if (t === null || t.row !== null && Lu(e, t.row) !== null) return null;
	let n = e.closest(`[${Ti}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Yd(e) {
	return e.filter(Xd);
}
function Xd(e) {
	return L(e) !== null && !A(e);
}
function Zd(e) {
	return Qd(e) ?? Yd(e)[0] ?? null;
}
function Qd(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !A(e)) ?? null;
}
function $d(e) {
	return Qd(Fd(e));
}
function ef(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = Zd(t);
	n !== null && nf(e, t, n);
}
function tf(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Ji(t, "ui-row-name"));
}
function nf(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = rf(e, n, r);
	i && ((L(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && uf(e, n, a));
}
function rf(e, t, n) {
	let r = af(e) ? of(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(I) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", Ji(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(Qn);
	return i !== null && Gd.set(e, i), e.setAttribute("aria-activedescendant", Ji(r, "ui-cell")), r;
}
function af(e) {
	return e.matches(Hd);
}
function of(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Ud) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = sf(t, n.getAttribute(Qn));
		if (e !== null) return e;
	}
	let r = cf(e, t), i = Gd.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Qn) === i);
	if (a !== void 0) return a;
	let o = Ld(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Qn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function sf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && lf(n)) return n;
	return null;
}
function cf(e, t) {
	let n = Ld(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && lf(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function lf(e) {
	return e.getAttribute("role") === Ud && !e.hasAttribute("data-ui-owns-keys");
}
function uf(e, t, n) {
	let r = e.querySelector(`:scope > .${rr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += df(c.left, c.right, o, s);
}
function df(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function ff(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function pf(e) {
	return Gd.get(e) ?? null;
}
function mf(e, t, n, r) {
	if (n !== null && _f(n)) return null;
	let i = cf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Qn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function hf(e, t, n, r) {
	let i = gf(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? of(e, t, null) : i[a];
}
function gf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && _f(e));
}
function _f(e) {
	return lf(e) && e.hasAttribute(Wd) && !e.hasAttribute("data-ui-table-column");
}
function vf(e) {
	let t = gf(e);
	return t[t.length - 1] ?? null;
}
function yf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Ud ? n : null;
}
function bf(e, t = null) {
	let n = e.closest(I);
	n !== null && e instanceof HTMLElement && nf(n, Fd(n), e, t);
}
function xf(e, t) {
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
function Sf(e, t) {
	return zu(e, t === "grid" ? "both" : t) || t !== "horizontal" && Cf(e);
}
function Cf(e) {
	return e === "PageDown" || e === "PageUp";
}
function wf(e, t, n, r) {
	if (!Sf(e, r)) return null;
	let i = Yd(t);
	if (Cf(e)) return Tf(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Ef(i, n, e === "ArrowDown");
	let a = i.map((e) => L(e) ?? e), o = Ru({
		key: e,
		items: a,
		current: n === null ? null : L(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Tf(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (L(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Ku(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (L(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Ef(e, t, n) {
	let r = t === null ? null : L(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Df(i), o = e.map((e) => ({
		row: e,
		rect: (L(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Df(t.rect) - a) < Math.abs(Df(e.rect) - a) ? t : e).row;
}
function Df(e) {
	return e.left + e.width / 2;
}
var Of = "ui-row-press";
function kf(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Af(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && jf(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = Mf(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : nf(e, a, t, null, s);
	};
}
function jf(e) {
	let t = L(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = Wu(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function Mf(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (Xd(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (Xd(e[n])) return e[n];
	return null;
}
function Nf(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || L(n) !== null) return;
	let r = Mf(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Ne), ff(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant")) : nf(e, t, r, null, !1);
}
function Pf(e) {
	let t = e.parentElement, n = t?.closest(I) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Ff(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function If(e, t, n) {
	let r = Pf(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || zf(r, t)));
}
function Lf(e, t) {
	let n = Pf(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || zf(n, t));
}
function Rf(e) {
	return e.getAttribute(Pe);
}
function zf(e, t) {
	t.setAttribute(Ne, ""), rf(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Bf = "data-ui-active", Vf = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Hf = /* @__PURE__ */ new Set([
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
]), Uf = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"PageDown",
	"PageUp"
]), Wf = !1, Gf = !1, Kf = null, qf = /* @__PURE__ */ new Set(), Jf = [], Yf = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Xf(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Zf(e), !0), window.addEventListener("focus", (e) => ep(e.target), !0), window.addEventListener("focusin", (e) => ep(e.target), !0), window.addEventListener("focusout", (e) => tp(e), !0), window.addEventListener("keydown", (e) => $f(e)));
function Xf(e, t = "") {
	Wf = !0, Gf = t === "touch";
	let n = document.activeElement;
	Kf = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && op(n, !np(n)), sp(n);
}
function Zf(e) {
	if (!(e instanceof KeyboardEvent && (Hf.has(e.key) || Wf && Qf(e)))) {
		Wf = !1;
		for (let e of [...qf]) op(e, !1);
		sp(document.activeElement);
	}
}
function Qf(e) {
	return !np(e.target) || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey ? !1 : !(Uf.has(e.key) && e.target instanceof Element && e.target.getAttribute("role") === "combobox");
}
function $f(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !N(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !np(t) && op(t, !0);
}
function ep(e) {
	Wf && !np(e) && op(e, !0), e === document.activeElement && sp(document.activeElement);
}
function tp(e) {
	e.target instanceof Element && e.target.hasAttribute(Bf) || op(e.target, !1), e.relatedTarget === null && queueMicrotask(() => sp(document.activeElement));
}
function np(e) {
	return Cu(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function rp() {
	return Wf && Kf instanceof HTMLElement && Kf !== document.body ? Kf : null;
}
function ip() {
	return Wf;
}
function ap() {
	return Wf && Gf;
}
function op(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of qf) e.isConnected || qf.delete(e);
			qf.add(e);
		} else qf.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute($r, t), e === document.activeElement && sp(e);
	}
}
function sp(e) {
	let t = e === null || e === document.body || np(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : cp(e);
	for (let e of Jf) n.includes(e) || e.removeAttribute(ei);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(ei, t);
	Jf = n;
}
function cp(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || lp(n)); n = n.parentElement);
	return t;
}
function lp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(ku) ?? null) !== null;
}
function z(e) {
	ep(e), up(e);
}
function up(e) {
	sp(e), e.focus({ preventScroll: !0 }), sp(document.activeElement);
}
function dp(e) {
	op(e, !0), up(e);
}
function fp(e) {
	for (let t of e.querySelectorAll(Vf)) if (Jc(t)) return t;
	return null;
}
var pp = {
	first: fp,
	stops: (e) => mp(e, document.activeElement),
	giveBack: (e) => Sp(e),
	trapTab: _p
};
function mp(e, t) {
	let n = [...e.querySelectorAll(Vf)].filter((e) => e === t || e.tabIndex >= 0 && Jc(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = hp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !gp(n) && gp(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = hp(e);
		return t === null || r.get(t) === e;
	});
}
function hp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function gp(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function _p(e, t) {
	let n = mp(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = vp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function vp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && yp(n, a) ? i : r && yp(n, i) ? a : null;
}
function yp(e, t) {
	return e === t || hp(e) !== null && hp(e) === hp(t);
}
var bp = `.${xi}, .${Si}, [${wi}]`;
function xp(e) {
	let t = Kd(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(bp)) && n.hasAttribute("tabindex") && Jc(n)) return n;
	return null;
}
function Sp(e, t = xp(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Kd(e);
	r?.root === t && r.row !== null && nf(t, Fd(t), r.row, yf(r.row, e)), z(t);
}
function Cp(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? fp(e);
	return wp(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), z(r ?? e), n;
}
function wp(e) {
	Wf ? Yf.add(e) : Yf.delete(e);
}
function Tp(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? fp(e);
	return n !== null && Ep(e, n), Cp(e, n);
}
function Ep(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Dp(e, t, n = !1) {
	if (wp(e), Wf) {
		P(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), z(e);
		return;
	}
	let r = t.filter(F), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (P(t, i), z(i));
}
function Op(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : kp(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Vf}, [tabindex]`) && Jc(e)) return e;
	return n === null ? null : Ap(n);
}
function kp(e, t) {
	if (t === null) return null;
	for (let n = e.closest(C); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(E(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Ap(e) {
	for (let t = e.closest(C); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (Jc(t)) return jp(t), t;
	return null;
}
function jp(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Mp(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (Np(n, t) && op(e, !np(e)), z(e));
}
function Np(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Yf.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Pp = "data-ui-clear", Fp = ["change", "toggle"], Ip = [
	...Fp,
	"expand",
	"collapse",
	"open",
	"close"
];
function Lp(e) {
	let t = ea(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Rp(e) {
	return ea(e) === "OnSubmit";
}
function zp(e, t) {
	let n = e.getAttribute(Xe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Rp(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Lp(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Rp(i.mode)
		};
	}
	return null;
}
var Bp = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Fp) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Du, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Pp}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		e.target instanceof Element && !this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && zp(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Pp}]`);
		if (t === null) return;
		let n = t.closest(C), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Vp(r) || (zl(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Cu(r) && document.activeElement !== r && z(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (j(e.target) || k(e.target))) return;
		let t = zp(e.target, this.options.metadata);
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
			let r = zp(n, this.options.metadata);
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
		if (i === void 0 || !Lp(i.mode) || Rp(i.mode)) return;
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
function Vp(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Hp(e, t) {
	let n = e.closest(`[${Qe}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Up = class {
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
}, Wp = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = ba(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = ba(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(ba(e));
	}
	isAttached(e) {
		return this.attachments.has(ba(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(ba(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Gp = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: T(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Kp = "aria-busy";
function qp(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute(Xr, ""), r = !0, e.hasAttribute(Kp) || (e.setAttribute(Kp, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute(Xr), i && !e.classList.contains("ui-loading") && e.removeAttribute(Kp));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var Jp = {
	dispatched: !1,
	success: !1
}, Yp = () => void 0, Xp = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Zp = class {
	options;
	root;
	registry;
	requestFactory = new Gp();
	turns = new Up();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Wp(e.eventCatalog), this.addEvent("click");
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
		if (r === null || $p(t, r.element) || Hp(t.target, r.element)) return;
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
			let t = e instanceof Xp, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && k(r.domEvent.target)) return Jp;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Jp;
		let a = this.startPendingMark(e, n, r), o = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, o);
		} finally {
			o.done(), a();
		}
	}
	startPendingMark(e, t, n) {
		return e !== "click" || n.metadata?.showsPending === !1 ? Yp : qp(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? em(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Jp;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Jp;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Xp(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ip.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		Qp(e.preventDefault, t) && t.domEvent.preventDefault(), Qp(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Qp(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function $p(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function em(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function tm(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && nm(e, t) : rm(e, t);
}
function nm(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!tm(e[n], t[n])) return !1;
	return !0;
}
function rm(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !tm(e[n], t[n]) : !im(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !im(t[n])) return !1;
	return !0;
}
function im(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function am() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function om(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (sm(e)) return cm(e, () => om(e)), null;
	let n = e;
	for (; n.parentElement !== null && !sm(n.parentElement);) n = n.parentElement;
	let r = dm(n) ?? fm(n) ?? pm();
	return r !== null && z(r), r;
}
function sm(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function cm(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => lm(t) && um(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function lm(e) {
	return e.transitionProperty === "visibility";
}
function um(e) {
	return e.effect?.target ?? null;
}
function dm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Vf) ?? null;
	return t !== null && sm(t) ? t : null;
}
function fm(e) {
	let t = mp(e.closest(bp) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function pm() {
	let e = document.querySelector(`[${jn}="content"]`);
	return e === null ? null : (jp(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var mm = class {
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
		for (let e of Fp) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = _m(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && tm(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = zp(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(T(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) na(e.actionKind) === "CopyValue" && vm(e.target) && this.writeTarget(e.target, t.dynamicParameters, hm(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: T(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(T(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? _m(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = na(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!vm(a)) return;
		let o = i === "CopyValue" ? hm(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = am();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && om(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: gm(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function hm(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function gm(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = T(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Oa(s, o)) return a === 0 ? e : {
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
function _m(e, t) {
	return JSON.stringify([T(e?.componentId), e?.propertyId ?? ""]) + ua(t);
}
function vm(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var ym = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return bm(t, e.operator, e.value);
	}
};
function bm(e, t, n) {
	let r = xm(e), i = xm(n);
	switch (ra(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Sm(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Sm(r, i, (e) => e >= 0);
		case "Less": return Sm(r, i, (e) => e < 0);
		case "LessOrEqual": return Sm(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return wm(r, i);
		case "RegexEach": return Cm(r, i);
		default: return !1;
	}
}
function xm(e) {
	return D(e) ? e.key : nc(e) ? e.text : e;
}
function Sm(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Cm(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => wm(xm(e), t)) : wm(e, t);
}
function wm(e, t) {
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
var Tm = "Value", Em = "EndValue", Dm = "Pressed", Om = class {
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
		return this.eventNames.has(ba(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) jm(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ba(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Mm(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Nm(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (km(e)) {
			let t = T(e.sourceEvent?.componentId), n = ba(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Mm(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Mm(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (Am(e)) {
			let t = T(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Nm(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Nm(t, n), r)), r.push(e), na(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Tm || i === Dm ? this.valueInteractions : i === Em ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function km(e) {
	return ta(e.sourceKind) === "Event";
}
function Am(e) {
	return ta(e.sourceKind) === "Property";
}
function jm(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Mm(e, t) {
	return `${e}:${ba(t)}`;
}
function Nm(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var B = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function Pm() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Fm(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Im(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Lm = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Rm = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function zm(e) {
	return `(min-width: ${Rm[e]}px)`;
}
var Bm = zm("sm");
function Vm(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(zm(t))) return t;
	return "base";
}
function Hm(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Um(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Wm(e, t) {
	return Gm(t, (t) => Um(e, t));
}
function Gm(e, t) {
	for (let n = Lm.indexOf(e); n >= 0; n--) {
		let e = t(Lm[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Km = /* @__PURE__ */ new Set([
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
function qm(e) {
	return Km.has(e);
}
var Jm = 4, Ym = 12, Xm = /* @__PURE__ */ new Map(), Zm = !1, Qm = null, $m = /* @__PURE__ */ new WeakMap(), eh = "data-ui-popup-stood-in";
function th(e, t) {
	t === null ? $m.delete(e) : $m.set(e, t);
}
var nh = "--ui-popup-ground";
function rh(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(nh).trim() : "";
	n.length === 0 ? t.style.removeProperty(nh) : t.style.setProperty(nh, n);
}
function ih(e, t, n) {
	Xm.set(t, {
		anchor: e,
		options: n
	}), _h(), Qm?.observe(t), uh(e, t), yh(e, t, n);
}
var ah = "data-ui-popup-lifted", oh = "data-ui-sheet";
function sh() {
	return typeof matchMedia == "function" && !matchMedia(Bm).matches;
}
function ch(e) {
	return e.hasAttribute(oh);
}
function lh(e) {
	e.hasAttribute(ah) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(ah, ""), dh(e));
}
function uh(e, t) {
	(t.hasAttribute(ah) || fh(t) || e.closest(`[${ah}]`) !== null) && lh(t);
}
function dh(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function fh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var ph = B.normal * 5;
function mh(e, t) {
	e.hasAttribute(ah) && (e.matches(":popover-open") && e.hidePopover(), Im(e, ph, () => {
		e.matches(":popover-open") || Xm.has(e) || (e.removeAttribute("popover"), e.removeAttribute(ah), t?.());
	}));
}
function hh(e) {
	let t = Xm.get(e);
	t !== void 0 && yh(t.anchor, e, t.options);
}
function gh(e) {
	e != null && (Xm.delete(e), Qm?.unobserve(e), mh(e));
}
function _h() {
	Zm || (Zm = !0, document.addEventListener("scroll", (e) => vh(e.target), !0), window.addEventListener("resize", () => vh(null)), window.visualViewport?.addEventListener("resize", () => vh(null)), window.visualViewport?.addEventListener("scroll", () => vh(null)), Qm = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Xm.get(t.target);
			e !== void 0 && yh(e.anchor, t.target, e.options, !0);
		}
	}));
}
function vh(e) {
	for (let [t, n] of Xm) t.isConnected ? e instanceof Node && t.contains(e) || yh(n.anchor, t, n.options) : gh(t);
}
function yh(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = Ch(e), a = i !== e;
	t.hasAttribute(eh) !== a && t.toggleAttribute(eh, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(bh) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Sh(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = Eh(n.boundary), p = Xm.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Oh(l, d, m, u, f) ? m : Dh(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Oh(l, d, h, u, f) || (xh(t, h, Mh(l, h, f) - u - Jm), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? Ih(t, h) : Fh, _ = Rh(l, c, d, h, u, g), v = zh(l, c, d, h, u, g);
	n.arrow === !0 && (jh(h) ? v = wh(v, c.left + c.width / 2, d.width) : _ = wh(_, c.top + c.height / 2, d.height));
	let ee = Vh();
	_ = ee.top + Gh(_ - ee.top, d.height, ee.bottom - ee.top), v = Gh(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Th(t, c, d, h, _, v);
}
var bh = "data-ui-popup-capped";
function xh(e, t, n) {
	let r = jh(t);
	e.setAttribute(bh, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Sh(e) {
	if (e.hasAttribute(bh)) {
		e.removeAttribute(bh);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function Ch(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(eh)) return e;
		let n = $m.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function wh(e, t, n) {
	let r = t - e;
	return r < Ym ? e - (Ym - r) : r > n - Ym ? e + (r - (n - Ym)) : e;
}
function Th(e, t, n, r, i, a) {
	let o = jh(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Ym, Math.min(s, c - Ym))}px`);
}
function Eh(e) {
	let t = Vh(), n = {
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
function Dh(e, t, n, r, i) {
	let a = Nh(n);
	if (Oh(e, t, n, r, i)) return n;
	if (Oh(e, t, a, r, i)) return a;
	for (let a of kh(n)) if (Oh(e, t, a, r, i)) return a;
	return Mh(e, a, i) > Mh(e, n, i) ? a : n;
}
function Oh(e, t, n, r, i) {
	return Mh(e, n, i) >= Ah(t, n) + r;
}
function kh(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Ah(e, t) {
	return jh(t) ? e.height : e.width;
}
function jh(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Mh(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Nh(e) {
	return e.startsWith("top") ? `bottom${Ph(e)}` : e.startsWith("bottom") ? `top${Ph(e)}` : e.startsWith("left") ? `right${Ph(e)}` : `left${Ph(e)}`;
}
function Ph(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Fh = {
	start: 0,
	end: 0
};
function Ih(e, t) {
	let n = getComputedStyle(e);
	return jh(t) ? {
		start: Lh(n.paddingLeft) + Lh(n.borderLeftWidth),
		end: Lh(n.paddingRight) + Lh(n.borderRightWidth)
	} : {
		start: Lh(n.paddingTop) + Lh(n.borderTopWidth),
		end: Lh(n.paddingBottom) + Lh(n.borderBottomWidth)
	};
}
function Lh(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Rh(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Bh(t.top, t.height, n.height, r, a);
}
function zh(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Bh(t.left, t.width, n.width, r, a);
}
function Bh(e, t, n, r, i) {
	let a = Ph(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Vh() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Hh(r))
	};
}
function Hh(e) {
	let t = document.querySelector(`[${On}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Uh(e, t, n) {
	if (ch(e)) return;
	let r = e.getBoundingClientRect(), i = Vh();
	e.style.left = `${Wh(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Wh(n, r.height, i.top, i.bottom)}px`;
}
function Wh(e, t, n, r) {
	return e + t <= r - Jm ? e : e - t >= n + Jm ? e - t : n + Gh(e - n, t, r - n);
}
function Gh(e, t, n) {
	return Math.max(Jm, Math.min(e, n - t - Jm));
}
//#endregion
//#region src/interactions/press-wave.ts
var Kh = "ui-press-wave", qh = "ui-press-wave__ink";
function Jh(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!Yh(t)) return !1;
	for (let t of e.removedNodes) if (!Yh(t)) return !1;
	return !0;
}
function Yh(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function Xh(e) {
	return e.length > 0 && e.every(Jh);
}
function Zh(e) {
	for (let t of e.querySelectorAll(`.${Kh}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Qh = 32;
function V(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = $h(e, i.filter((e) => !Jh(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function $h(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			eg(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > Qh) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function eg(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function tg(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var ng = "data-ui-dialog", rg = "data-ui-dialog-modal", ig = "data-ui-dialog-backdrop", ag = "data-ui-dialog-close-backdrop", og = "data-ui-dialog-close-escape", sg = `[${ng}]:not([hidden]), dialog[open]`, cg = "dialog:modal";
function lg(e) {
	let t = e.querySelectorAll(`[${ng}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ug(e) {
	let t = e.querySelectorAll(cg);
	if (t.length > 0) return t[t.length - 1];
	let n = lg(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function dg(e) {
	let t = typeof document > "u" ? null : ug(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var fg = /* @__PURE__ */ new Set(), pg = null;
function mg(e) {
	pg = e;
}
function hg(e) {
	let t = e.composedPath(), n = pg?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var gg = /* @__PURE__ */ new Map(), _g = 0, vg = !1;
function yg() {
	vg || (vg = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || Sg(hu(e.target)) && e.preventDefault();
	}, !0));
}
function bg() {
	for (let e of fg) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function xg(e) {
	for (let t of fg) t.hearRefusedClick(e);
}
function Sg(e) {
	let t = [];
	for (let e of fg) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...gg.keys()]) n.has(e) || gg.delete(e);
	for (let { popup: e } of t) gg.has(e) || gg.set(e, ++_g);
	let r = Cg(t, (e) => gg.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function Cg(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var wg = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), fg.add(this), yg();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = hg(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = hg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = hg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? dg(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, Tg = /\p{M}/gu, Eg = ".ui-text__title";
function Dg(e, t) {
	return Og(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Og(e, t) {
	return jg(e, Ag(t));
}
function kg(e, t) {
	return t.every((t) => e.includes(t));
}
function Ag(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function jg(e, t) {
	let n = e.normalize("NFD").replace(Tg, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Mg(e) {
	return e.querySelector(Eg)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Ng = class {
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
		if (t === null || k(t)) return;
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Pg(r, i, t.point, t.second.point));
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
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(qr);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function Pg(e, t, n, r) {
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
function Fg() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function Ig(e, t) {
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
		Fg();
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
var Lg = "data-ui-sheet-dragging", Rg = "--ui-sheet-drag", zg = 24, Bg = 1 / 3;
function Vg(e, t, n) {
	return e > t * Bg || n > .5 && e > 6;
}
function Hg(e, t, n) {
	e.style.removeProperty(Rg), e.removeAttribute(Lg);
	let r = Ig(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= zg),
		start: (t) => {
			e.setAttribute(Lg, ""), Ug(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(Rg, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(Lg), i && Vg(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(Rg, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(Lg);
	};
}
function Ug(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Wg = "data-ui-sheet-covered", Gg = "ui-sheet-scrim", Kg = "data-ui-sheet-scrim-leaving", qg = 400, Jg = "ui-sheet__back", Yg = "ui.sheet.back", Xg = "ne-arrow-back", Zg = [], Qg = null, $g = !1, e_ = !1;
function t_(e, t) {
	if (n_(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : n_(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = ch(e);
	e.setAttribute(oh, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Fm(e));
	let a = null;
	e.querySelector(`:scope > .${Jg}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Wg, ""), a = r_(t), e.prepend(a)), a_(), lh(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Hg(e, e, () => o_(e))
	};
	Zg.push(o), s_(), queueMicrotask(() => l_(o));
}
function n_(e) {
	return Zg.find((t) => t.popup === e) ?? null;
}
function r_(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Mg(e.anchor).trim();
	return t.type = "button", t.className = Jg, t.tabIndex = -1, t.textContent = n, t.prepend(i_()), O.write(t, "aria-label", Yg, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function i_() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), po(e, Xg), e;
}
function a_() {
	Qg === null && (Qg = document.createElement("div"), Qg.className = Gg, Qg.setAttribute("aria-hidden", "true"), Qg.addEventListener("mousedown", (e) => e.preventDefault())), Qg.parentElement === null && document.body.appendChild(Qg), Qg.removeAttribute(Kg), lh(Qg);
}
function o_(e) {
	for (let t = n_(e); t !== null; t = t.parent) t.opening.close();
}
function s_() {
	$g || ($g = !0, window.addEventListener("pointerdown", () => {
		e_ = !0;
	}, !0), window.addEventListener("pointerup", c_, !0), window.addEventListener("pointercancel", c_, !0), window.addEventListener("keydown", (e) => {
		let t = Zg.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && _p(t.popup, e);
	}, !0), matchMedia(Bm).addEventListener("change", () => {
		for (let e of Zg.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function c_() {
	if (e_ = !1, Qg?.hasAttribute(Kg) !== !0) return;
	let e = () => {
		Qg?.hasAttribute(Kg) === !0 && Zg.length === 0 && (Qg.removeAttribute(Kg), Qg.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, qg);
}
function l_(e) {
	if (!Zg.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), z(t)), e.hidden = u_(t);
}
function u_(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== Qg && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function d_(e) {
	let t = n_(e);
	if (t !== null) {
		for (let e of [...Zg].reverse()) if (e === t || f_(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function f_(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function p_(e) {
	let t = n_(e);
	if (t !== null) {
		for (let e of Zg.filter((e) => e.parent === t)) e.opening.close(), p_(e.popup);
		d_(e), Zg.splice(Zg.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Wg), Zg.length === 0 && m_(), mh(e, () => {
			n_(e) === null && (e.removeAttribute(oh), e.removeAttribute(Wg), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function m_() {
	Qg?.matches(":popover-open") === !0 && (e_ ? Qg.setAttribute(Kg, "") : Qg.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function h_(e, t) {
	return e.isConnected && !k(e) && !(t && j(e));
}
var g_ = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new wg({
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
			isBehind: (e) => dg(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && v_(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && w_(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || ip() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		b_(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, C_(t)) && !dg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!b_(e)) return;
		let t = xp(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && h_(n.owner, this.closesWhenReadOnly) && !dg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !h_(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), T_(e, !0), F_(this), A_(e), e.focus !== void 0 && e.focus !== !1 && Cp(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		ch(e.popup) || w_(this.options.sheetOnPhone, e) && sh() ? t_(e.popup, {
			anchor: e.anchor,
			close: () => this.close(e.owner, "escape"),
			trapsTab: !w_(this.options.closesOnTab, e)
		}) : e.anchor !== void 0 && e.placement !== void 0 && ih(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), j_(r.popup), d_(r.popup), r.popup.contains(document.activeElement) && Mp(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), T_(r, !1), ch(r.popup) ? p_(r.popup) : gh(r.popup), this.entries.size === 0 && I_(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (h_(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !x_() && S_(e);
		}
	}
}, __ = /* @__PURE__ */ new Set();
function v_(e) {
	__.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !M(e) && e.target instanceof Node && y_(e.target);
	}, !0), __.add(e);
}
function y_(e) {
	let t = [...__].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of Cg(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function b_(e) {
	return e instanceof Element && e.isConnected && Jc(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function x_() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Jc(e);
}
function S_(e) {
	jp(e), z(e);
}
function C_(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function w_(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function T_(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var E_ = /* @__PURE__ */ new Map(), D_ = /* @__PURE__ */ new Set(), O_ = /* @__PURE__ */ new WeakSet(), k_ = [];
function A_(e) {
	let { popup: t } = e;
	E_.set(t, e.owner), !O_.has(t) && (O_.add(t), t.addEventListener("pointerenter", () => {
		E_.has(t) && (D_.add(t), M_());
	}), t.addEventListener("pointerleave", () => {
		D_.delete(t) && M_();
	}));
}
function j_(e) {
	E_.delete(e), D_.delete(e) && M_();
}
function M_() {
	let e = /* @__PURE__ */ new Set();
	for (let t of D_) {
		let n = E_.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of k_) e.has(t) || t.removeAttribute(ti);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(ti, "");
	k_ = [...e];
}
var N_ = /* @__PURE__ */ new Set(), P_ = null;
function F_(e) {
	N_.add(e), P_ === null && typeof MutationObserver == "function" && (P_ = new MutationObserver(() => {
		for (let e of [...N_]) e.closeStranded();
	}), P_.observe(document, {
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
function I_(e) {
	N_.delete(e), !(N_.size > 0 || P_ === null) && (P_.disconnect(), P_ = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var L_ = "ui-flyout", R_ = "ui-flyout--open", z_ = "ui-flyout__anchor", B_ = "data-ui-flyout-no-backdrop-close", V_ = "data-ui-flyout-no-escape-close", H_ = `${L_}--`, U_ = "bottom-start", W_ = class {
	root;
	flyouts = new g_({
		show: ({ owner: e }) => e.classList.add(R_),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? V_ : B_)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${L_}`)) this.place(e);
		V(this.root, `.${L_}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Si}`), n = e.querySelector(`:scope > .${z_}`);
		if (t === null) return;
		let r = G_(n, t);
		e.classList.contains(R_) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: q_(n) ?? e,
			placement: { placement: J_(e) },
			openers: r === null ? [] : [r],
			focus: !ip() || t
		}) || this.markClosed(e) : (this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	markClosed(e, t = !0) {
		e.classList.contains(R_) && (e.classList.remove(R_), K_(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${z_}`)?.closest(`.${L_}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(R_), this.place(t), this.flyouts.isOpen(t) && K_(t, !0)));
	}
};
function G_(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Vf) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Ji(t, "ui-flyout-content")), n;
}
function K_(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function q_(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function J_(e) {
	for (let t of e.classList) {
		if (!t.startsWith(H_)) continue;
		let e = t.slice(H_.length);
		if (qm(e)) return e;
	}
	return U_;
}
//#endregion
//#region src/interactions/drag-picture.ts
var Y_ = "ui-drag-picture", X_ = "data-ui-drag-part", Z_ = ["::before", "::after"], Q_ = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", $_ = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), ev = null, tv = null;
typeof Image == "function" && rv();
function nv(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = rv();
	tv?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), iv(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && tv?.();
	}, 0));
}
function rv() {
	return ev === null && typeof Image == "function" && (ev = new Image(1, 1), ev.src = Q_), ev;
}
function iv(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = Y_, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, ov(e, a, o);
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
	let s = (e) => av(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), tv === u && (tv = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), tv = u, av(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function av(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function ov(e, t, n) {
	let r = t.style;
	r !== void 0 && (uv(getComputedStyle(e), (e, t) => r.setProperty(e, t)), sv(e, r, "columns"), sv(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !$_.has(e.toLowerCase()) && t.removeAttribute(e);
	lv(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : ov(i, a, n);
	}
}
function sv(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, cv(e, n).join(" "));
}
function cv(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = cv(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function lv(e, t, n) {
	for (let r of Z_) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(X_) || t.setAttribute(X_, String(n.length));
		let a = [];
		uv(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${Y_} [${X_}="${t.getAttribute(X_)}"]${r} { ${a.join(" ")} }`);
	}
}
function uv(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var dv = `:scope > :is(${ku}, .ui-image-input__surface)`;
function fv(e, t, n, r, i, a = [], o = "move") {
	pv(t, r), mv(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function pv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function mv(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && nv(e, e.dataTransfer, e.target));
}
function hv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function gv(e, t) {
	let n = t && e.querySelector(dv) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var _v = "data-ui-file-drop-over", vv = 120, yv = "refused", bv = !1;
function xv(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Tv();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Sv(e, t, n), !0);
	e.root.addEventListener("dragend", () => jv(t.marked), !0), window.addEventListener("blur", () => jv(t.marked)), e.root.addEventListener("paste", (t) => Cv(e, t), !0);
}
function Sv(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && jv(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Ev(n), n.type !== "dragleave" && jv(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Av(r, a) : t.leaving = window.setTimeout(() => jv(r), vv);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Dv(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Av(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : _v;
		r.set(a, o), a.setAttribute(o, t ? yv : ""), gv(a, o === _v);
		return;
	}
	jv(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Mv(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Cv(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Mv(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function wv(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Ir}="${Gi(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Tv() {
	if (!bv) {
		bv = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Ev(e);
		});
	}
}
function Ev(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Dv(e, t) {
	let n = Ov(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => kv(t, e)));
}
function Ov(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function kv(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Av(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), gv(t, !1);
}
function jv(e) {
	for (let t of [...e.keys()]) Av(e, t);
}
function Mv(e, t) {
	let n = Ov(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : kv(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Nv = "ne-picture-as-pdf", Pv = "ne-text-snippet", Fv = "ne-description", Iv = "ne-table-chart", Lv = "ne-slideshow", Rv = "ne-folder-zip", zv = "ne-audio-file", Bv = "ne-video-file", Vv = "ne-image", Hv = "ne-code", Uv = "ne-draft", Wv = new Map([
	...Jv(Nv, "pdf"),
	...Jv(Pv, "txt", "md", "log"),
	...Jv(Fv, "doc", "docx", "odt", "rtf"),
	...Jv(Iv, "xls", "xlsx", "ods", "csv", "tsv"),
	...Jv(Lv, "ppt", "pptx", "odp", "key"),
	...Jv(Rv, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Jv(zv, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Jv(Bv, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Jv(Vv, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Jv(Hv, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Gv = /* @__PURE__ */ new Map([
	["application/pdf", Nv],
	["text/csv", Iv],
	["application/msword", Fv],
	["application/rtf", Fv],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Fv],
	["application/vnd.oasis.opendocument.text", Fv],
	["application/vnd.ms-excel", Iv],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Iv],
	["application/vnd.oasis.opendocument.spreadsheet", Iv],
	["application/vnd.ms-powerpoint", Lv],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Lv],
	["application/vnd.oasis.opendocument.presentation", Lv],
	["application/zip", Rv],
	["application/x-zip-compressed", Rv],
	["application/x-7z-compressed", Rv],
	["application/vnd.rar", Rv],
	["application/x-rar-compressed", Rv],
	["application/x-tar", Rv],
	["application/gzip", Rv],
	["application/json", Hv],
	["application/xml", Hv],
	["text/xml", Hv],
	["text/html", Hv]
]), Kv = /* @__PURE__ */ new Map([
	["image", Vv],
	["audio", zv],
	["video", Bv],
	["text", Pv]
]);
function qv(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Wv.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Gv.get(i) ?? (a < 0 ? void 0 : Kv.get(i.slice(0, a))) ?? Uv;
}
function Jv(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var Yv = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function Xv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(wt), e.setAttribute("title", t.name), e.setAttribute(Ot, t.name), Zv(e, kt, t.type.length > 0 ? t.type : null), Zv(e, At, t.size === null ? null : String(t.size)), r.className = Tt, r.setAttribute("aria-hidden", "true"), i.className = Et, i.textContent = t.name, a.className = Dt, $v(e, r, a, n), [
		r,
		i,
		a
	];
}
function Zv(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Qv(e, t) {
	let n = e.querySelector(`:scope > .${Tt}`), r = e.querySelector(`:scope > .${Dt}`);
	n !== null && r !== null && $v(e, n, r, t);
}
function $v(e, t, n, r) {
	let i = e.getAttribute(jt), a = i !== null && go(i).length > 0 ? i : qv(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(go(a)) || i !== null) && po(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? ey(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function ey(e, t) {
	let n = e, r = "byte";
	for (let e of Yv) {
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
var ty = "SessionKey", ny = "/_ne/session/key", ry = 1e4, iy = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = oy) {
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
function ay(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function oy(e) {
	let t = await fetch(ny, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(ry)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var sy = "/_ne/files/upload", cy = "/_ne/files/selection/", ly = "/_ne/files/upload/", uy = /* @__PURE__ */ new Map(), dy = !1;
function fy(e, t, n, r) {
	let i = Number(e.getAttribute(Pr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return uy.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of uy.keys()) e.isConnected || uy.delete(e);
	return uy.set(e, c), py(e, c), my(), a;
}
function py(e, t) {
	let n = ey(t.limit, O.language);
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
function my() {
	dy || (dy = !0, O.onChange(() => {
		for (let [e, t] of uy) e.isConnected ? py(e, t) : uy.delete(e);
	}));
}
async function hy(e, t) {
	let n = [...e];
	return await iy.settled(), await gy(n, t);
}
function gy(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", sy), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function _y(e) {
	await iy.settled();
	let t = await fetch(`${cy}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function vy(e) {
	return `${ly}${encodeURIComponent(e)}`;
}
var yy = () => {};
function by(e) {
	return {
		uploadAsync: (e, t) => hy(e, t ?? yy),
		accepts: Mv,
		takeWithinSizeLimit: (t, n, r) => fy(t, n, r, e)
	};
}
function xy(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var Sy = "ui-open-picker";
function Cy(e) {
	return !e.dispatchEvent(new Event(Sy, {
		bubbles: !0,
		cancelable: !0
	}));
}
function wy(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || j(n) || k(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Ty = "ui-file-input", Ey = "ui-file-input__row", Dy = "ui-file-input__native", Oy = "ui-file-input__field", ky = "ui-file-input__selection", Ay = "data-ui-file-dragging", jy = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, O.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(Sy, (e) => wy(e, {
			rootSelector: `.${Ty}`,
			nativeSelector: `.${Dy}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), xv({
			root: this.root,
			draggingAttribute: Ay,
			resolveTarget: (e) => {
				let t = e.closest(`.${Ey}`)?.closest(`.${Ty}`) ?? null, n = t === null ? wv(this.root, e, `.${Ty}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Dy}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || j(r) || k(r)
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
		let t = e.target.closest(`[${Fr}], .${Ey}`);
		if (t === null || k(t) || j(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Ty}`)?.querySelector(`.${Dy}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Dy)) return;
		let t = e.target.closest(`.${Ty}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Oy}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = fy(e, t, e.querySelector(`.${Dy}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await hy(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => O.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, My(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => O.text("ui.file.failed")), this.publishSelection(e, "");
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
		xy(e.querySelector(`.${ky}`), t);
	}
};
function My(e) {
	return e.length === 1 ? e[0].name : () => O.format("ui.file.count", { count: e.length });
}
var Ny = 1024, Py = 16777216;
function Fy(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Iy(e, t) {
	let n = Ky(t.zoom, 1, 4), r = Gy(e) / n / 2;
	return {
		x: Ky(t.x, r, e.width - r),
		y: Ky(t.y, r, e.height - r),
		zoom: n
	};
}
function Ly(e, t) {
	let n = Gy(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function Ry(e, t, n) {
	return t.zoom * n / Gy(e);
}
function zy(e, t, n, r, i) {
	let a = Ry(e, t, n);
	return a > 0 ? Iy(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function By(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Ky(t.zoom * r, 1, 4), o = Ry(e, t, n), s = Ry(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Iy(e, {
		...t,
		zoom: a
	}) : Iy(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function Vy(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Hy(e, t) {
	return Math.min(1, t * 4 / Gy(e), Math.sqrt(Py / (e.width * e.height)));
}
function Uy(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Wy(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Gy(e) {
	return Math.min(e.width, e.height);
}
function Ky(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function qy(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(ng, e.key), t.setAttribute(rg, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(og, ""), t.setAttribute(ag, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(ig, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? xi : `${xi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Jy = class {
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
}, Yy = 100 / 3, Xy = 1, Zy = 2;
function Qy(e, t = Yy) {
	let n = e.deltaMode === Xy ? Yy : e.deltaMode === Zy ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function $y(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var eb = {
	notch: 100,
	pixels: Qy
}, tb = "ui-image-crop", nb = "ui-image-crop-title", rb = new Jy("data-ui-image-crop-part"), ib = "data-ui-image-crop-frame", ab = 10, ob = 1.2, sb = 380, cb = 100, lb = .92, H = null, ub = !1, db = null, fb = !1;
async function pb(e, t, n, r = Tb) {
	if (H !== null || ub) return "cancelled";
	ub = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		ub = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		db ??= mb();
		let o = db;
		o.dialog.isConnected || document.body.append(o.dialog), H = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: Fy(a),
			finish: (t) => {
				H = null, e.close(tb), a.release(), i(t);
			}
		}, O.write(o.title, null, "ui.crop.title"), O.write(o.stage, "aria-label", "ui.crop.frame"), O.write(o.zoom, "aria-label", "ui.crop.zoom"), O.write(o.cancel, null, "ui.crop.cancel"), O.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(ib, n.frame), e.open(tb), Cb(o);
	});
}
function mb() {
	let { dialog: e, surface: t } = qy({
		key: tb,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: nb,
		closesOnEscapeAndBackdrop: !1
	}), n = rb.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = nb;
	let r = rb.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = rb.element("canvas", "ui-image-crop__canvas"), a = rb.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = rb.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = rb.button("ui-button--ghost", "cancel"), c = rb.button("ui-button--primary", "apply");
	t.append(n, r, o, rb.actions(s, c));
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
		let t = rb.pressed(e);
		t === "cancel" ? H?.finish("cancelled") : t === "apply" && hb();
	}), new MutationObserver(() => {
		H !== null && e.hasAttribute("hidden") && H.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => gb(l, e)), o.addEventListener("input", () => xb(l, Number(o.value))), r.addEventListener("wheel", (e) => _b(l, e), { passive: !1 }), window.addEventListener("resize", () => wb(l)), new Ng({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => H === null ? null : {
			last: t,
			start: H.view
		},
		move: (e, t, n) => {
			e.last !== null && vb(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			H !== null && (H.view = t.start, Cb(l));
		},
		pinch: (e, t) => {
			e.last = null, yb(l, t);
		}
	}), l;
}
async function hb() {
	let e = H;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Ly(n, a), s = Uy(t.type), c = i.encodeAsync(n, o, Vy(o, r.size), s);
	H = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Wy(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function gb(e, t) {
	if (t.defaultPrevented || M(t) || H === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), H.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || !N(t, { shift: !0 })) return;
	let n = t.shiftKey ? 50 : ab;
	switch (t.key) {
		case "ArrowLeft":
			vb(e, -n, 0);
			break;
		case "ArrowRight":
			vb(e, n, 0);
			break;
		case "ArrowUp":
			vb(e, 0, -n);
			break;
		case "ArrowDown":
			vb(e, 0, n);
			break;
		case "+":
		case "=":
			bb(e, ob);
			break;
		case "-":
		case "_":
			bb(e, 1 / ob);
			break;
		case "Enter":
			hb();
			break;
		default: return;
	}
	t.preventDefault();
}
function _b(e, t) {
	if (H === null) return;
	t.preventDefault();
	let n = Qy(t, e.stage.clientHeight), r = t.ctrlKey ? cb : sb;
	bb(e, 2 ** (-n.y / r), Sb(e, t.clientX, t.clientY));
}
function vb(e, t, n) {
	H !== null && (H.view = zy(H.source, H.view, e.frame.clientWidth, t, n), Cb(e));
}
function yb(e, t) {
	if (H === null) return;
	let n = zy(H.source, H.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	H.view = By(H.source, n, e.frame.clientWidth, t.factor, Sb(e, t.center.x, t.center.y)), Cb(e);
}
function bb(e, t, n) {
	H !== null && (H.view = By(H.source, H.view, e.frame.clientWidth, t, n), Cb(e));
}
function xb(e, t) {
	H !== null && Number.isFinite(t) && t > 0 && bb(e, t / H.view.zoom);
}
function Sb(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Cb(e) {
	if (H === null) return;
	let t = H.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), wb(e);
}
function wb(e) {
	fb || H === null || (fb = !0, requestAnimationFrame(() => {
		if (fb = !1, H === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = H.view, a = Ry(H.source, i, t);
		H.imaging.paint(e.canvas, H.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: H.source.width * a,
			height: H.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var Tb = {
	decodeAsync: async (e, t) => {
		let n = await Eb(e);
		if (n === null) return null;
		let r = n, i = Hy(r, t);
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
		}, r, lb));
	})
};
async function Eb(e) {
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
var Db = "ui-image-input", Ob = "ui-image-input--multiple", kb = "ui-image-input__surface", Ab = "ui-image-input__native", jb = "ui-image-input__picture", Mb = "ui-image-input__text", Nb = "ui-image-input__selection", Pb = "ui-image-input__selections", Fb = "ui-image-input__tiles", Ib = "ui-image-input__tile", Lb = "ui-image-input__remove", Rb = "ui-image-input__progress", zb = "SelectionId", Bb = "--ui-image-progress", Vb = "data-ui-image-preview", Hb = "data-ui-image-dragging", Ub = "data-ui-image-tiles", Wb = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Db}`)), V(this.root, `.${Db}`, {
			childList: !0,
			attributeFilter: [
				Nr,
				$e,
				oi
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === zb && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Ia(e.components, `.${Db}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Sy, (e) => wy(e, {
			rootSelector: `.${Db}`,
			nativeSelector: `.${Ab}`,
			pressed: (e) => e.querySelector(`.${kb}`)
		})), this.root.addEventListener(Du, (e) => this.handleDraftDropped(e)), xv({
			root: this.root,
			draggingAttribute: Hb,
			resolveTarget: (e) => {
				let t = e.closest(`.${kb}`), n = t?.closest(`.${Db}`) ?? null, r = n === null ? wv(this.root, e, `.${Db}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${kb}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Ab}`)?.getAttribute("accept") ?? "",
					multiple: Gb(i),
					refused: j(i) || k(a)
				};
			},
			onFiles: (e, t) => void (Gb(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Gb(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${jb}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || ex(e, e.getAttribute("data-ui-image-caption") ?? rx(n)), nx(e, n.length > 0);
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
		let i = Yb(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Fb}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = Zb(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), Kb(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await _y(n);
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
		Qb(t.element, a, i === void 0 ? "" : vy(i.fileId)), t.element.classList.remove(vi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Gb(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fr}]`), n = t?.closest(`.${Db}`) ?? null;
		t === null || n === null || j(n) || k(t) || n.querySelector(`.${Ab}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lb}`), n = t?.closest(`.${Db}`) ?? null;
		if (t === null || n === null || j(n) || k(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ab)) return;
		let t = e.target.closest(`.${Db}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Gb(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Db}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), xy(t.querySelector(`.${Nb}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${kb}`), r = e.querySelector(`.${jb}`), i = e.querySelector(`.${Nb}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || fy(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Vb, ""), r.setAttribute("src", o.url), ex(e, a.name), nx(e, !0), n.classList.add(vi);
		try {
			let t = await hy([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, xy(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (tx(e), xy(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(vi);
		}
	}
	async cropAsync(e, t) {
		let n = qb(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await pb(this.dialogs, t, {
				frame: n,
				size: Jb(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Fb}`), r = fy(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Xb(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await hy([t], (e) => r.element.style.setProperty(Bb, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(vi), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Kb(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), Kb(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${Pb}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(oi, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Vb), t || ex(e, ""));
	}
};
function Gb(e) {
	return e.classList.contains(Ob);
}
function Kb(e, t) {
	e.hasAttribute(Ub) !== t.length > 0 && e.toggleAttribute(Ub, t.length > 0);
}
function qb(e) {
	let t = e.getAttribute(et);
	return t === "square" || t === "circle" ? t : null;
}
function Jb(e) {
	let t = Number(e.getAttribute(tt));
	return Number.isInteger(t) && t > 0 ? t : Ny;
}
function Yb(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function Xb(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${Ib} ${vi}`, Qb(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function Zb(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${Ib} ${vi}`, n.type = "button", n.className = Lb, r.className = Rb, O.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function Qb(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = Lb, i.className = Rb, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, O.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...$b(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...$b(e, r, t), r, i);
}
function $b(e, t, n) {
	return O.write(t, "aria-label", "ui.file.remove"), Xv(e, n, O.language);
}
function ex(e, t) {
	let n = e.querySelector(`.${Mb}`);
	n !== null && (Oc(n, null), n.textContent !== t && (n.textContent = t));
}
function tx(e) {
	let t = e.querySelector(`.${Mb}`);
	t !== null && O.write(t, null, "ui.file.failed");
}
function nx(e, t) {
	let n = e.querySelector(`.${kb}`);
	n !== null && O.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function rx(e) {
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
var ix = "ui-key-value-action__value", ax = "ui-key-value-action--editable", ox = "ui-text__title", sx = "ui-row-form-", cx = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", lx = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${du}`), !1), V(this.root, `.${du}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Dr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && mx(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => px(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), ux(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${pu} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${sx}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${fu} [${Xe}]:not([${on}])`)) t.setAttribute(on, n);
		t.setAttribute(hi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${on}="${t}"], [${hi}="${t}"]`)) n.removeAttribute(on), n.removeAttribute(hi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${fu} [${Xe}]`)) {
			if (Cu(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ou(e), this.judge(e);
	}
	judge(e) {
		let t = fx(e);
		for (let n of e.querySelectorAll(`.${fu} [${Xe}]`)) this.options.validation.judgeShown(n, Cu(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${fu} :is(input, textarea, select)`);
		if (n !== null) {
			if (Cu(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = fx(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Su(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && N(e)) {
			dx(e);
			return;
		}
		if (e.defaultPrevented || M(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = _u(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Ei), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${pu} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !k(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function ux(e) {
	for (let t of e.querySelectorAll(`:scope > .${fu}`)) {
		let e = t.querySelector(cx) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Or, e);
	}
}
function dx(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${du}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${ax}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Vf) ?? null;
	n === null || k(n) || (e.preventDefault(), n.click());
}
function fx(e) {
	return e.querySelector(`.${ix} .${ox}`)?.textContent?.trim() ?? "";
}
function px(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function mx(e) {
	let t = e.closest(`.${pu} button`), n = t?.closest(`.${pu}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var hx = `.ui-button[${Bt}="pressed"]`, gx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(hx);
		t === null || k(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, _x = `${Au}, [tabindex], [contenteditable], ${Ei}, [${Qe}]`, vx = ":scope > input.ui-field, :scope > textarea.ui-field", yx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(ku);
		if (t === null || e.target !== t && e.target.closest(_x) !== null) return;
		let n = t.querySelector(vx);
		if (!Cu(n) || n.readOnly || k(n) || j(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, bx = "data-ui-input-debounce", xx = `input[${bx}], textarea[${bx}]`;
function Sx(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(xx);
}
var Cx = /* @__PURE__ */ new Set();
function wx() {
	for (let e of Cx) if (e.waiting) return !0;
	return !1;
}
function Tx() {
	for (let e of Cx) e.commitAll();
}
function Ex(e) {
	for (let t of Cx) t.drop(e);
}
var Dx = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), Cx.add(this);
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
}, Ox = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Dx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Sx(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(bx));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		Sx(e.target) && this.pauses.drop(e.target);
	}
}, kx = "data-ui-submit-on-enter", Ax = "data-ui-runs-on-enter", jx = "enter", Mx = "escape", Nx = {
	name: jx,
	registration: { settlesValue: !0 }
}, Px = "ui-commit-in-place", Fx = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(Px, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), gu(t) ? this.runEscape(t, e) : this.leave(t)) : Ix(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Lx(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : Su(t) && (e.preventDefault(), Ix(t, e) ? this.runEnter(t, e) : e.key === "Escape" && gu(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || k(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(jx, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		Ex(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = xp(e);
		e.blur(), Sp(e, n), e.dispatchEvent(new Event(Mx, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(on);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${hi}="${Gi(t)}"]`);
		n !== null && !k(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = xp(e);
		e.blur(), this.changes === t && this.commit(e), Sp(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function Ix(e, t) {
	return Rx(t) && e.hasAttribute(Ax);
}
function Lx(e, t) {
	return Rx(t) && e.hasAttribute(kx) && !e.readOnly && !k(e);
}
function Rx(e) {
	return e.key === "Enter" && N(e);
}
//#endregion
//#region src/updates/icon-stand-in.ts
var zx = "icon-stand-in", Bx = ".ui-icon.ui-icon--circle", Vx = "ne-person", Hx = "ui-icon--circle", Ux = "ui-icon--image", Wx = "ui-icon-stand-in", Gx = `:scope > .${Wx}`, Kx = "missing", qx = "failed", Jx = 512, Yx = /* @__PURE__ */ new Map(), Xx = /* @__PURE__ */ new Map();
function Zx(e) {
	let t = e.getAttribute(ct), n = Qx(e);
	return n === null ? e.removeAttribute(ct) : t !== n && e.setAttribute(ct, n), nS(e, n !== null), n === Kx ? "show" : t === Kx ? "release" : "keep";
}
function Qx(e) {
	if (!e.classList.contains(Hx)) return null;
	if (!e.className.split(" ").some(ho)) return Kx;
	let t = e.classList.contains(Ux) ? $x(e) : null;
	if (t === null) return null;
	let n = Yx.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (eS(t, e), n === void 0 ? null : qx) : n.loaded ? null : qx;
}
function $x(e) {
	let t = e.style.getPropertyValue(fo).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function eS(e, t) {
	let n = Xx.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	Xx.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => tS(e, !0)), r.addEventListener("error", () => tS(e, !1)), r.src = e;
}
function tS(e, t) {
	let n = Xx.get(e);
	Yx.delete(e), Yx.set(e, {
		loaded: t,
		at: Date.now()
	}), Xx.delete(e), Yx.size > Jx && Yx.delete(Yx.keys().next().value);
	for (let e of n ?? []) Zx(e);
}
function nS(e, t) {
	let n = e.querySelector(Gx);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(ot), i = r !== null && go(r).length > 0 ? r : Vx;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(go(i))) return;
	po(n, i), n.classList.add(Wx);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var rS = `.${nt}`, iS = `img.${rt}`, aS = `:scope > ${iS}`, oS = "%238c8c8c", sS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${oS}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${oS}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${oS}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, cS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", lS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(iS)) (fS(e) || e.complete && e.naturalWidth === 0) && mS(e);
		for (let e of this.root.querySelectorAll(Bx)) Zx(e);
		V(this.root, `${rS}, ${Bx}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: uS
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? dS(t) : Zx(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(iS) && mS(t);
	}
};
function uS(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(iS) : t.matches(rS));
}
function dS(e) {
	let t = e.querySelector(aS);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (pS(t) ? t.getAttribute("src") !== gS(e) && hS(e, t) : (e.removeAttribute(st), nS(e, !1))), fS(t) && mS(t));
}
function fS(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function pS(e) {
	let t = e.getAttribute("src");
	return t === sS || t === cS;
}
function mS(e) {
	if (pS(e)) return;
	let t = e.getAttribute(at);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(st, ""), hS(n, e));
}
function hS(e, t) {
	t.setAttribute("src", gS(e)), nS(e, e.classList.contains(it));
}
function gS(e) {
	return e.classList.contains("ui-image--circle") ? cS : sS;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var _S = "ui-radio-group__input", vS = "ui-radio-group__dot", yS = {
	kind: "radio",
	decorate: bS
};
function bS(e) {
	let t = document.createElement("input");
	t.className = _S, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = vS, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var xS = "data-ui-radio-value", SS = "ui-radio-group", CS = "ui-radio-group__item", wS = "data-ui-radio-group-name", TS = "data-ui-radio-bind-value-id", ES = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${SS}`)]);
		for (let e of this.root.querySelectorAll(`.${SS}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${SS}`));
			else if (!Jh(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(DS));
			for (let e of new Set(t.map((e) => e.closest(`.${SS}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [xS, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${SS}`)) {
			let n = e.getAttribute(wS);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(wS), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(wS, a);
			for (let e of od(r, `.${_S}`, `.${SS}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${SS}`)) n.has(e.getAttribute(wS) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(xS), n = e.getAttribute(wS), r = e.getAttribute(TS);
		for (let i of od(e, `.${_S}`, `.${SS}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Xe, r), i.checked = i.value === t;
			let e = OS(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function DS(e) {
	return e.classList.contains(SS) ? [e] : [...e.querySelectorAll(`.${SS}`)];
}
function OS(e) {
	let t = e.closest(`.${CS}`);
	return t !== null && A(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function kS(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function AS(e) {
	return kS(e).toString(16).padStart(2, "0").toUpperCase();
}
function jS(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (MS(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function MS(e, t, n) {
	return .2126 * NS(e) + .7152 * NS(t) + .0722 * NS(n);
}
function NS(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var PS = "inlineMarkupPlainText", FS = /* @__PURE__ */ new Map([
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
]), IS = [
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
function LS(e) {
	return W(e, IS);
}
var RS = [
	"small",
	"medium",
	"large"
], zS = ["default", "circle"], BS = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], VS = [
	"start",
	"center",
	"end",
	"justify"
], HS = ["nowrap", "wrap"], US = /* @__PURE__ */ new Map([
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
]), WS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), GS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), KS = ["inline", "trailing"], qS = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], JS = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], YS = [
	"small",
	"medium",
	"large"
], XS = [
	"small",
	"medium",
	"large"
], ZS = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], QS = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], $S = [
	"filled",
	"tinted",
	"outline"
], eC = ["light", "dark"], tC = [
	"start",
	"center",
	"end",
	"stretch"
], nC = ["clip", "visible"], rC = [
	"visible",
	"hidden",
	"collapsed"
], iC = [
	"background",
	"raised",
	"tinted",
	"flat"
], aC = ["horizontal", "vertical"], oC = [
	"none",
	"gap",
	"rule"
], sC = [
	"none",
	"one",
	"many"
], cC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], lC = ["stack", "wrap"], uC = ["end", "start"], dC = [
	"disabled",
	"auto",
	"always"
], fC = [
	"disabled",
	"proximity",
	"mandatory"
], pC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], mC = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], hC = ["hex", "rgb"], gC = ["field", "swatch"], _C = [
	"fill",
	"contain",
	"cover",
	"none"
], vC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], yC = ["default", "circle"], bC = ["card", "quiet"], xC = ["uniform", "vignette"], SC = ["linear", "circular"], CC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], wC = [
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
], TC = [
	"None",
	"Shade",
	"Tint"
], EC = /* @__PURE__ */ new Map();
function DC(e) {
	return EC.get(e);
}
function U(e, t, n) {
	return AC(e, OC(t, n), (e) => `${t}${W(e, n)}`);
}
function OC(e, t) {
	return kC(t.map((t) => `${e}${t}`));
}
function kC(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function AC(e, t, n) {
	return EC.set(e, t), [e, n];
}
function jC(e, t, n) {
	return Lm.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var MC = new Map([
	U("colorClass", "ui-color--", IS),
	AC("themeColorClass", OC("ui-color--", IS), (e) => _w(e)),
	AC("iconClass", ho, (e) => go(e)),
	["iconUrlCss", (e) => so(e)],
	["safeUrl", (e) => qa(e)],
	["safeImageSource", (e) => no(e)],
	[PS, (e) => e == null ? void 0 : ko(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	U("iconSizeClass", "ui-icon-size--", RS),
	AC("iconShapeClass", kC(["ui-icon--circle"]), (e) => W(e, zS) === "circle" ? "ui-icon--circle" : ""),
	U("textTypeClass", "ui-text-type--", BS),
	AC("textAppearanceClass", OC("ui-text-type--", BS), (e) => Dw(e, "ui-text-type--")),
	AC("textDescriptionTypeClass", OC("ui-text--description-", BS), (e) => Dw(e, "ui-text--description-")),
	U("textAlignmentClass", "ui-text--align-", VS),
	U("textWrapClass", "ui-text--", HS),
	U("buttonAlignmentClass", "ui-button--align-", VS),
	U("textBadgePlacementHostClass", "ui-text--badge-", KS),
	U("badgeStyleClass", "ui-badge-style--", QS),
	U("badgeFillClass", "ui-badge-fill--", $S),
	AC("badgeColoredClass", kC(["ui-badge--colored"]), (e) => cw(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => vw(e)],
	U("buttonClass", "ui-button--", ZS),
	U("surfaceStyleClass", "ui-surface--", iC),
	U("orientationClass", "ui-orientation--", aC),
	U("groupSeparatorClass", "ui-command-bar--separator-", oC),
	["selectionModeAttribute", (e) => W(e, sC)],
	["selectionBackgroundCss", (e) => cw(aw(e, "background"))],
	["selectionForegroundCss", (e) => cw(aw(e, "foreground"))],
	["selectionMarkColorCss", (e) => cw(aw(e, "markColor"))],
	["selectionMarkCss", (e) => sw(aw(e, "mark"))],
	["selectionFontWeightCss", (e) => ow(aw(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => cw(aw(e, "actionBarBackground"))],
	U("itemsViewLayoutClass", "ui-items-view--", lC),
	U("dragHandlePlacementClass", "ui-drag-handle--", uC),
	U("scrollXClass", "ui-scroll-x--", dC),
	U("scrollYClass", "ui-scroll-y--", dC),
	["hostViewport", (e) => qC(e)],
	U("scrollSnapClass", "ui-scroll-snap--", fC),
	U("inputAppearanceClass", "ui-input--", JS),
	U("inputSizeClass", "ui-input--", XS),
	U("buttonSizeClass", "ui-button--", YS),
	U("buttonGroupSizeClass", "ui-button-group--", YS),
	["textInputTypeAttribute", (e) => W(e, pC)],
	["inputModeAttribute", (e) => W(e, mC)],
	["colorTextFormatAttribute", (e) => W(e, hC)],
	["colorInputVariantAttribute", (e) => W(e, gC)],
	["themeNameCss", (e) => W(e, eC)],
	["alignmentCss", (e) => W(e, tC)],
	["alignmentStretchFallbackCss", (e) => W(e, tC) === "stretch" ? "start" : ""],
	["overflowCss", (e) => W(e, nC)],
	["layoutLengthCss", (e) => JC(e)],
	["thicknessCss", (e) => ZC(e)],
	AC("borderEdgeClass", OC("ui-border--", qS), (e) => {
		let t = ew(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => tw(e)],
	["gridUnitCss", (e) => nw(e)],
	["pixelsCss", (e) => Lw(e)],
	["gridTemplateCss", (e) => rw(e)],
	["colorVariantCss", (e) => jw(e)],
	["themeColorCss", (e) => cw(e)],
	["themeInkCss", (e) => uw(e)],
	["roleInkCss", (e) => dw(e)],
	["themeOnColorCss", (e) => pw(e)],
	["themeGroundCss", (e) => mw(e)],
	["themeColorInlineCss", (e) => lw(e) ? "" : cw(e)],
	["themeColorCanonical", (e) => kw(e)],
	["textAppearanceFontSizeCss", (e) => Ow(e, "size")],
	["textAppearanceFontWeightCss", (e) => Ow(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Ow(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Ow(e, "letterSpacing")],
	...jC("responsiveLayoutLength", "Css", (e, t) => JC(Um(e, t))),
	...jC("responsiveWidth", "Css", (e, t) => YC(Um(e, t), "horizontal")),
	...jC("responsiveHeight", "Css", (e, t) => YC(Um(e, t), "vertical")),
	...jC("responsiveThickness", "Css", (e, t) => ZC(Um(e, t))),
	...jC("responsivePadding", "Css", (e, t) => QC(Um(e, t))),
	...jC("responsiveThicknessHorizontal", "Css", (e, t) => $C(Um(e, t), "horizontal")),
	...jC("responsiveThicknessVertical", "Css", (e, t) => $C(Um(e, t), "vertical")),
	...jC("responsiveRadius", "Css", (e, t) => tw(Um(e, t))),
	...jC("responsivePixels", "Css", (e, t) => Rw(Um(e, t))),
	...jC("visibility", "Attribute", (e, t) => zw(e, t)),
	...jC("gridPlacement", "ColumnCss", (e, t) => iw(Um(e, t), "column")),
	...jC("gridPlacement", "RowCss", (e, t) => iw(Um(e, t), "row")),
	...jC("gridPlacement", "ColumnSpanCss", (e, t) => iw(Um(e, t), "columnSpan")),
	...jC("gridPlacement", "RowSpanCss", (e, t) => iw(Um(e, t), "rowSpan")),
	U("imageFitClass", "ui-image-fit--", _C),
	AC("expanderVariantClass", kC(["ui-expander--quiet"]), (e) => W(e, bC) === "quiet" ? "ui-expander--quiet" : ""),
	AC("imageShapeClass", kC(["ui-image--circle"]), (e) => W(e, yC) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => LC(e)],
	["backgroundImageAttribute", (e) => LC(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => W(e, vC)],
	["backgroundImageDimCss", (e) => RC(e)],
	["backgroundImageDimModeAttribute", (e) => W(e, xC) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => HC(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => HC(e) ? "" : void 0],
	["positiveCount", (e) => zC(e)?.toString()],
	["nonNegativeCount", (e) => BC(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => BC(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => VC(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => VC(e, (e) => e >= 0)?.toString()],
	["share", (e) => VC(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => zC(e) === void 0 ? void 0 : ""],
	AC("maxLinesClass", kC(["ui-text--max-lines"]), (e) => zC(e) === void 0 ? "" : "ui-text--max-lines"),
	AC("textAreaGrowClass", kC(["ui-text-area--grow"]), (e) => zC(e) === void 0 ? "" : "ui-text-area--grow"),
	U("progressVariantClass", "ui-progress--", SC),
	["progressValueText", (e) => Iw(e)],
	["textAreaResizeCss", (e) => W(e, CC)],
	U("flyoutPlacementClass", "ui-flyout--", wC),
	["popupPlacementAttribute", (e) => W(e, wC)],
	["tabMenuEntriesAttribute", (e) => FC(e)],
	["markedDaysAttribute", (e) => IC(e)]
]);
function NC(e) {
	let t = MC.get("surfaceStyleClass");
	return iC.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var PC = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function FC(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = PC.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function IC(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function LC(e) {
	return so(e);
}
function RC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function zC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function BC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function VC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function HC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var UC = [
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
], WC = new Map(UC.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), GC = new Map(UC.map(([e, t]) => [e, t])), KC = /* @__PURE__ */ new Map([[nC, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [vC, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function W(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : KC.get(t)?.get(e)) ?? FS.get(e) ?? Ki(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function qC(e) {
	return e == null || W(e, dC) === "disabled" ? void 0 : "parent";
}
function JC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Lw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Lw(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function YC(e, t) {
	if (typeof e != "object" || !e) return JC(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? JC(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function XC(e) {
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
function ZC(e) {
	if (e == null) return "";
	let t = XC(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function QC(e) {
	let t = e == null ? void 0 : XC(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function $C(e, t) {
	let n = XC(e);
	return n === void 0 ? "" : Lw(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function ew(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = Lm.map((t) => Um(e, t)).filter((e) => e != null), n = new Set(t.map((e) => ew(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = XC(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function tw(e) {
	if (e == null) return "";
	if (typeof e == "number") return Lw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Lw(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function nw(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Lw(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function rw(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return nw(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return nw(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${nw(e[0])})` : e.map((e) => nw(e)).join(" ");
}
function iw(e, t) {
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
function aw(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function ow(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function sw(e) {
	if (e == null) return "";
	switch (W(e, cC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function cw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Aw(e)) return jw(e);
	let t = e, n = jw(t.light), r = jw(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = US.get(W(o, IS));
	return s ? `var(${s})` : "";
}
function lw(e) {
	if (typeof e != "object" || !e || Aw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function uw(e) {
	if (lw(e)) {
		let t = WS.get(W(e.style, IS));
		if (t !== void 0) return `var(${t})`;
	}
	return cw(e);
}
function dw(e) {
	if (typeof e != "object" || !e || Aw(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? uw(e) : "";
}
var fw = /* @__PURE__ */ new Set(["background", "surface"]);
function pw(e) {
	if (typeof e != "object" || !e) return "";
	if (Aw(e)) return hw(e) ? "initial" : gw(e);
	let t = e, n = gw(t.light ?? t.dark), r = gw(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && hw(t.light ?? t.dark) && hw(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = W(t.style, IS);
	if (fw.has(i)) return "initial";
	let a = GS.get(i);
	return a ? `var(${a})` : "";
}
function mw(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (Aw(e) ? hw(e) : hw(t.light ?? t.dark) && hw(t.dark ?? t.light)) return "inherit";
	}
	return cw(e);
}
function hw(e) {
	return Mw(e)?.[3] === 0;
}
function gw(e) {
	let t = Mw(e);
	return t === void 0 ? "" : jS(t[0], t[1], t[2], t[3]);
}
function _w(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${W(n, IS)}`;
}
function vw(e) {
	let t = Sw(e == null ? "" : String(e).trim(), yw + 1);
	return t > 0 && t <= yw ? "compact" : "";
}
var yw = 2, bw = /[\u0300-\uFFFF]/, xw = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Sw(e, t) {
	if (!bw.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of xw.segment(e)) {
		if (n >= t) break;
		n += Cw(r) ? 2 : 1;
	}
	return n;
}
function Cw(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < ww.length; e += 2) if (t >= ww[e] && t <= ww[e + 1]) return !0;
	return !1;
}
var ww = [
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
function Tw(e, t) {
	Ew(e, String(t));
}
function Ew(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ue, vw(t)), e.setAttribute(We, "");
}
function Dw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${W(r, BS)}`;
}
function Ow(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Lw(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Lw(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Lw(e);
		}
		default: return "";
	}
}
function kw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Nw(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${AS(r.rgb >> 16 & 255)}${AS(r.rgb >> 8 & 255)}${AS(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${AS(e)}`;
	}
	let i = Pw(r.name);
	return i === null ? "" : `${i}/${Fw(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Aw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function jw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = Mw(e);
	return t === void 0 ? "" : `#${AS(t[0])}${AS(t[1])}${AS(t[2])}${AS(t[3])}`;
}
function Mw(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Pw(t.name), i = n ?? (r === null ? void 0 : WC.get(r));
	if (!i) return;
	let a = Fw(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = kS(c * (1 - o)), l = kS(l * (1 - o)), u = kS(u * (1 - o))) : a === "Tint" && (c = kS(c + (255 - c) * o), l = kS(l + (255 - l) * o), u = kS(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function Nw(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = IS[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Pw(e) {
	if (typeof e == "number") return GC.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Fw(e) {
	if (typeof e == "number") return TC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Iw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Lw(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Rw(e) {
	return e == null ? "" : Lw(e);
}
function zw(e, t) {
	let n = Wm(e, t);
	if (n == null) return;
	let r = W(n, rC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Bw = "data-ui-search-debounce", Vw = "data-ui-search-min-length", Hw = "data-ui-search-manual", Uw = "data-ui-search-answered", Ww = "ui-search__input", Gw = "ui-select__list", Kw = "ui-select__option", qw = 300, Jw = "data-ui-search-waiting", Yw = "ui-search__field", Xw = /* @__PURE__ */ new WeakMap(), Zw = {
	name: "search",
	registration: {
		started: (e) => Qw(e.domEvent.target),
		completed: (e) => $w(e.domEvent.target)
	}
};
function Qw(e) {
	if (!(e instanceof Element)) return;
	let t = Xw.get(e) ?? {
		asked: 0,
		timer: null
	};
	Xw.set(e, t), !(t.asked++ > 0) && (eT(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${Yw}`)?.setAttribute(Jw, "");
	}, 300));
}
function $w(e) {
	if (!(e instanceof Element)) return;
	let t = Xw.get(e);
	t === void 0 || --t.asked > 0 || (Xw.delete(e), t.timer !== null && window.clearTimeout(t.timer), eT(e)?.removeAttribute("aria-busy"), e.closest(`.${Yw}`)?.removeAttribute(Jw));
}
function eT(e) {
	return e.closest(".ui-select")?.querySelector(`.${Gw}`) ?? null;
}
var tT = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Dx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ww) || e.isComposing === !0) return;
		let t = e.target;
		rT(t);
		let n = t.getAttribute(Bw), r = n === null ? qw : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : qw, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || M(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ww)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(Hw)) && nT(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function nT(e) {
	let t = Number(e.getAttribute(Vw) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function rT(e) {
	if (e.hasAttribute(Uw)) return;
	let t = e.closest(`.${Ni}`), n = t?.querySelector(`.${Gw}`);
	if (t == null || n == null) return;
	let r = nT(e) ? Dg(e.value, e) : [], i = iT(n, (e) => r.length === 0 || kg(Og(Mg(e), e), r));
	sT(t, n, r.length > 0 && i === 0);
}
function iT(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && aT(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Kw)) continue;
		let e = t(a);
		aT(a, e), r ||= e, e && i++;
	}
	return n !== null && aT(n, r), i;
}
function aT(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function oT(e) {
	let t = e.querySelector(`.${Gw}`);
	t !== null && sT(e, t, iT(t, (e) => e.style.display !== "none") === 0);
}
function sT(e, t, n) {
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
var cT = 500, lT = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > cT) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Og(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Og(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function uT(e) {
	return M(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var dT = "data-ui-select-value", fT = "data-ui-select-placement", pT = "ui-select--open", mT = "ui-select__trigger-content", hT = "data-ui-select-content", gT = "ui-select__placeholder", _T = "ui-input__affix-icon--prefix", vT = "ui-select__popup", yT = "ui-select__list", bT = "ui-select__option", xT = "ui-select__value-input", ST = "data-ui-select-clear", CT = "ui-select--clearable", wT = "ui-search", TT = "ui-search__input", ET = "data-ui-active", DT = "data-ui-list-keyboard", OT = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), kT = "ui-multi-select", AT = "ui-multi-select__chips", jT = "ui-multi-select__chip", MT = "ui-multi-select__chip-label", NT = "ui-multi-select__chip-remove", PT = "ui-badge-select", FT = "ui-text__badge", IT = "ui-badge", LT = "ui-badge__icon", RT = "ui-badge__text", zT = "ui-badge-style--info ui-text-type--overline", BT = "ui-text-type--overline", VT = "data-ui-select-chip", HT = "data-ui-select-chips", UT = "data-ui-select-max", WT = "data-ui-select-free-text", GT = "ui-multi-select__entry", KT = "data-ui-select-tag-entry", qT = [
	dT,
	oi,
	UT
], JT = ["class", b], YT = [...JT, "style"];
function XT(e) {
	return e === null || j(e) || k(e);
}
function ZT(e) {
	return e.classList.contains(kT);
}
function QT(e) {
	return e.classList.contains(wT);
}
function $T(e) {
	return QT(e) ? e.querySelector(`.${TT}`) : null;
}
function eE(e) {
	return e.hasAttribute(WT) ? e.querySelector(`:scope > .${Di} .${GT}`) : null;
}
function tE(e) {
	return $T(e) ?? eE(e);
}
function nE(e) {
	return eE(e) ?? e.querySelector(".ui-select__trigger");
}
function rE(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(GT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function iE(e) {
	return od(e, `.${vT} .${bT}`, `.${Ni}`);
}
function aE(e) {
	let t = iE(e).filter((e) => !A(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(ET)) ?? null;
}
function oE(e) {
	for (let t of od(e, `.${yT}`, `.${Ni}`)) {
		let e = t.querySelector(`:scope > .${bT}[${ET}]:not([${$r}])`) !== null;
		t.hasAttribute(DT) !== e && t.toggleAttribute(DT, e);
	}
}
function sE(e) {
	return e === null ? null : Mg(e);
}
function cE(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var lE = class {
	root;
	popups = new g_({
		show: ({ owner: e }) => e.classList.add(pT),
		hide: ({ owner: e }) => {
			e.classList.remove(pT), this.markActive(e, null);
			let t = e.querySelector(`.${vT}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => tE(e) === null
	});
	typeAhead = new lT();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Jh(n) || EE(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: qT,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Ni}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${ST}], .${NT}`) !== null || hE(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (XT(r)) return;
		this.releaseRefusal(r);
		let i = id(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = rE(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !M(e) ? rE(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(KT) === "first-suggestion" && iE(t.select).some((e) => e.hasAttribute(ET)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = rE(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || XT(t.select) || !nd(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, rd(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Xu(e.getAttribute(oi)), a = Zu(e.getAttribute(UT)), o = ad(i, n.map((t) => ({
			text: t,
			key: gE(e, t) ?? t
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
		rT(t);
		let n = t.value.trim().length > 0, r = n ? dE(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(KT) === "first-suggestion" && (this.markActive(e, i), i !== null && pE(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), oE(e), ZT(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(dT);
		this.decorateOptions(e);
		let n = t === null ? null : iE(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${gT}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of iE(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${xT}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), oT(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(PT) ? YT : JT;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = Xu(e.getAttribute(oi)), n = new Set(t), r = Qu(t, Zu(e.getAttribute(UT)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = iE(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = eE(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(PT);
		yE(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? _E(t) : void 0;
			return {
				key: e,
				label: vE(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== XT(e) && (o.readOnly = XT(e));
		let l = e.querySelector(`.${gT}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${xT}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(oi, d), oT(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Di}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${mT}`), a = i?.getAttribute(hT) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(hT), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && QT(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = mT;
			let e = r.querySelector(`:scope > .${_T}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return cE(s), Zh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of iE(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = A(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${bT}`);
		t === null || n === null || n.hasAttribute(ET) || A(n) || k(n) || n.closest(".ui-select") !== t || (tE(t) === null && (P(iE(t).filter((e) => !A(e)), n), dp(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${NT}`);
		if (t !== null) {
			let n = t.closest(`.${Ni}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), XT(n) || this.removeChosen(n, t.closest(`.${jT}`)?.getAttribute(VT) ?? null));
			return;
		}
		let n = e.target.closest(`[${ST}]`);
		if (n !== null) {
			let t = n.closest(`.${Ni}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), XT(t) || (this.clearValue(t), uE(t)));
			return;
		}
		let r = e.target.closest(`.${Di}`);
		if (r !== null) {
			let t = r.closest(`.${Ni}`);
			if (XT(t)) return;
			e.preventDefault();
			let n = t === null ? null : eE(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${bT}`);
		if (i === null) return;
		let a = i.closest(`.${Ni}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(iE(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || (this.openSelect !== null && oE(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bT}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ni}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && N(e, { alt: !0 })) {
			e.preventDefault();
			let n = aE(t);
			return n !== null && !ZT(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !OT.has(e.key) || !N(e) || (e.key === "Home" || e.key === "End") && Cu(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = rE(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (XT(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? dE(r).find((e) => e.hasAttribute(ET)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, rd(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, rd(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${AT} > .${jT}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(VT)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = mE(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${NT}`) ?? (n === 1 ? nE(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		rT(t);
		let r = dE(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(NT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !ZT(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), XT(n)) return !0;
				let r = mE(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(VT) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(VT) ?? null);
				let o = a === null ? null : mE(n).find((e) => e.getAttribute(VT) === a) ?? null;
				return o !== null && o.querySelector(`.${NT}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || XT(t)) return !1;
		e.preventDefault();
		let n = $T(t);
		n !== null && rT(n);
		let r = dE(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = uT(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(bT))) return !1;
		let r = n.closest(`.${Ni}`), i = r !== null && r === this.openSelect;
		if (r === null || XT(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = $T(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = dE(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(ET)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => sE(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (P(iE(r).filter((e) => !A(e)), c), pE(r, c), z(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !N(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Ni}`);
		return t === null || t === this.openSelect || !t.classList.contains(CT) || XT(t) || e.target !== nE(t) || e.key === "Backspace" && ZT(t) || (eE(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !ZT(t) || XT(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${AT} > .${jT}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(VT)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(TT) || !t.contains(e.target) ? null : dE(t).find((e) => e.hasAttribute(ET)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = tE(e), i = eE(e);
		r !== null && !t && rT(r), oT(e);
		let a = e.querySelector(`.${Di}`), o = e.querySelector(`.${vT}`), s = e.querySelector(`.${yT}`) ?? o, c = e.getAttribute(fT);
		if (a === null || o === null || s === null) return;
		let l = Ji(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && qm(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), DE(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = dE(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && ip()) {
			P(n, null), this.markActive(e, null), uE(e);
			return;
		}
		let i = r ?? n[0];
		P(n, i), this.markActive(e, i, ip()), pE(e, i), z(i);
	}
	initializeSearch(e, t, n, r) {
		let i = iE(e), a = dE(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || ip() ? null : a[0] ?? null);
		P(i, null), this.markActive(e, o, ip()), o !== null && pE(e, o), !ap() && (z(t), t.select());
	}
	initializeEntry(e, t) {
		P(iE(e), null), this.markActive(e, t), t !== null && pE(e, t);
	}
	moveCurrent(e, t) {
		let n = iE(e).filter((e) => !A(e)), r = wf(t, n, aE(e), "vertical");
		r !== null && (tE(e) === null ? Vu(n, r) : pE(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of iE(e)) r === t ? r.setAttribute(ET, "") : r.hasAttribute(ET) && r.removeAttribute(ET), op(r, r === t && n);
		oE(e);
		let r = tE(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Ji(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || A(t) || XT(e)) return;
		if (ZT(e)) {
			let r = $u(Xu(e.getAttribute(oi)), n, Zu(e.getAttribute(UT)));
			this.markActive(e, t, ip()), r !== null && this.writeChosen(e, r);
			let i = eE(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(dT) === n) {
			this.close();
			return;
		}
		e.setAttribute(dT, n), this.sync(e);
		let r = e.querySelector(`.${xT}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : ed(Xu(e.getAttribute(oi)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${jT}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && nE(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(oi) : e.setAttribute(oi, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${xT}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (ZT(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(dT)) return;
		e.removeAttribute(dT), this.sync(e);
		let t = e.querySelector(`.${xT}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function uE(e) {
	let t = e.querySelector(`.${Di}`), n = nE(e);
	t !== null && n !== null && !t.contains(document.activeElement) && z(n);
}
function dE(e) {
	return iE(e).filter((e) => fE(e) && !A(e) && !k(e));
}
function fE(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function pE(e, t) {
	let n = e.querySelector(`.${yT}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function mE(e) {
	return [...e.querySelectorAll(`.${AT} > .${jT}`)];
}
function hE(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && eE(t) !== null && !e.classList.contains(GT);
}
function gE(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of iE(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !A(t) && (e.toLocaleLowerCase() === n || sE(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function _E(e) {
	return e?.querySelector(`.${FT}`) ?? null;
}
function vE(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${RT}`)?.textContent ?? null : null) ?? sE(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function yE(e, t) {
	let n = e.querySelector(`.${AT}`);
	if (n === null) return;
	n.hasAttribute(HT) !== t.length > 0 && n.toggleAttribute(HT, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${jT}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(VT) === t[n].key && e.querySelector(`.${MT}`)?.textContent === t[n].label && (t[n].badge === void 0 || wE(e) === wE(t[n].badge ?? CE()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(bE));
	}
}
function bE(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? xE(e.label) : SE(e.label, e.badge);
	return n.classList.add(jT), n.setAttribute(VT, e.key), t.className = NT, t.type = "button", t.tabIndex = -1, O.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function xE(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = MT, n.textContent = e, t.append(n), t;
}
function SE(e, t) {
	let n = t === null ? CE() : t.cloneNode(!0);
	cE(n), n.classList.remove(FT);
	let r = n.querySelector(`:scope > .${RT}`);
	return r?.classList.add(MT), r !== null && !n.hasAttribute("data-ui-badge-text") && Ew(n, e), n;
}
function CE() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${IT} ${zT}`, t.className = `${LT} ui-icon`, n.className = `${RT} ${BT}`, e.append(t, n), e;
}
function wE(e) {
	let t = e.querySelector(`:scope > .${LT}`);
	return `${TE(e)}|${t === null ? "" : TE(t)}`;
}
function TE(e) {
	return `${[...e.classList].filter((e) => e !== jT && e !== FT).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ge)}`;
}
function EE(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ni}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === dT || e.attributeName === "data-ui-selected-keys" || e.attributeName === UT)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(IT) !== !0) return;
	let r = n?.closest(`.${vT}`)?.closest(`.${Ni}`);
	r != null && t.add(r);
}
function DE(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var OE = class {
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
		Cu(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
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
}, kE = "textarea.ui-text-area__field", AE = "data-ui-text-area-grow";
function jE() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var ME = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(kE) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(kE)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Ia(e.components, kE));
		}), V(this.root, kE, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [AE]
		}, (e) => {
			this.fitAll(Ia(e, kE));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(AE)) {
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
function NE(e) {
	let t = PE(e.getAttribute("min"), 0), n = PE(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, PE(r, 1))
	};
}
function PE(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function FE(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function IE(e, t) {
	return LE(t.min + e * (t.max - t.min), t);
}
function LE(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, RE(t.min + r * t.step, t);
}
function RE(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(zE(t.step), zE(t.min)))));
}
function zE(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function BE(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function VE(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return HE(o, i);
	let s = (o - i.min) / i.step;
	return HE(RE(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function HE(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var UE = "ui-slider__input", WE = "ui-slider__input--end", GE = "ui-slider__input--held", KE = "ui-slider__value", qE = "ui-slider__bubble", JE = "ui-slider__track", YE = "ui-slider__thumb-anchor", XE = "ui-slider", ZE = "ui-slider--range", QE = "ui-orientation--vertical", $E = "--ui-slider-fraction", eD = "--ui-slider-end-fraction", tD = 6, nD = "Value", rD = "EndValue", iD = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), aD = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Ng({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ZE} .${JE}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (iD.has(e.propertyName)) for (let t of Ia(e.components, `.${UE}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (sD(t) ? rD : nD) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = oD(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = oD(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = oD(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || uD(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(UE)) return;
		let t = e.target;
		if (this.cancelled.delete(t), uD(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = cD(t);
		if (n !== null) {
			let e = lD(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${UE}:not(.${WE})`), r = e.querySelector(`.${WE}`);
		if (n === null || r === null) return null;
		let i = IE(FE(e.getBoundingClientRect(), t, dD(e), fD(e)), NE(n)), a = BE(i, Number(n.value), Number(r.value));
		if (uD(n)) return z(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? z(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${JE}`);
		if (n === null) return;
		let r = IE(FE(n.getBoundingClientRect(), t, dD(n), fD(n)), NE(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(GE), z(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = cD(e), r = n === null ? String(t) : lD(e, t, n);
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
		e.held?.classList.remove(GE), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = pD(e);
		t !== null && ih(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: tD
		});
	}
	releaseBubble(e) {
		gh(pD(e)?.bubble);
	}
	writeReadings(e) {
		let t = sD(e), n = e.closest(`.${JE}`)?.parentElement ?? e.parentElement, r = t ? `.${KE}--end, .${qE}--end` : `.${KE}:not(.${KE}--end), .${qE}:not(.${qE}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${JE}`)?.style.setProperty(t ? eD : $E, String(mD(e))), e.matches(`:active, :focus-visible, .${GE}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function oD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(UE) ? e : null;
}
function sD(e) {
	return e.classList.contains(WE);
}
function cD(e) {
	return e.closest(`.${ZE} .${JE}`)?.querySelector(sD(e) ? `.${UE}:not(.${WE})` : `.${WE}`) ?? null;
}
function lD(e, t, n) {
	let r = Number(e.closest(`.${XE}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(VE(t, sD(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, NE(e)));
}
function uD(e) {
	return j(e) || k(e);
}
function dD(e) {
	return e.closest(`.${XE}`)?.classList.contains(QE) === !0;
}
function fD(e) {
	let t = e.querySelector(`.${YE}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : dD(e) ? t.height : t.width;
}
function pD(e) {
	if (!(e instanceof Element) || !e.classList.contains(UE)) return null;
	let t = e.closest(`.${JE}`), n = sD(e), r = t?.querySelector(n ? `.${qE}--end` : `.${qE}:not(.${qE}--end)`) ?? null, i = t?.querySelector(n ? `.${YE}--end` : `.${YE}:not(.${YE}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: dD(e)
	};
}
function mD(e) {
	let { min: t, max: n } = NE(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var hD = {
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
}, gD = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], _D = [
	"$n",
	"n$",
	"$ n",
	"n $"
], vD = [
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
], yD = [
	"n %",
	"n%",
	"%n",
	"% n"
], bD = [
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
], xD = /[1-9]/;
function SD(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return hD;
	try {
		return {
			...hD,
			...JSON.parse(t)
		};
	} catch {
		return hD;
	}
}
function CD(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = TD(t);
	if (r === null) return ED(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = DD(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return wD(e, t) ? MD(gD[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = DD(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return wD(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = OD(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return wD(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = DD(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return MD(wD(e, t) ? vD[n.currencyNegativePattern] ?? "-$n" : _D[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = DD(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return MD(wD(e, t) ? bD[n.percentNegativePattern] ?? "-n %" : yD[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return ED(e, n);
	}
}
function wD(e, t) {
	return e < 0 && xD.test(t);
}
function TD(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function ED(e, t) {
	let { integer: n, fraction: r } = kD(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function DD(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = OD(e, t, n);
	return n === 0 ? jD(o, r, i) : `${jD(o, r, i)}${a}${s}`;
}
function OD(e, t, n) {
	let { integer: r, fraction: i } = kD(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? AD(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function kD(e, t) {
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
function AD(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function jD(e, t, n) {
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
function MD(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var ND = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function PD(e) {
	if (!ND.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var FD = {
	readCulture: SD,
	format: CD,
	parseInvariant: PD
}, ID = /^-?(\d+(\.\d*)?|\.\d+)$/;
function LD(e, t, n) {
	if (!ID.test(e)) return e;
	let r = n.thousands === !1 ? WD(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return CD(i, n.thousands === !0 ? RD(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return CD(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function RD(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function zD(e, t, n) {
	return ID.test(e) ? (UD(n) ? GD(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function BD(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = UD(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!ID.test(d)) return null;
	let f = a ? GD(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function VD(e, t, n, r, i) {
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
function HD(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function UD(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function WD(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function GD(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var KD = "ui-number-input", qD = "ui-number-input__field", JD = "data-ui-number-no-decimals", YD = "data-ui-number-no-negative", XD = "data-ui-number-thousands", ZD = "data-ui-number-no-thousands", QD = "data-ui-number-trim-zeros", $D = "data-ui-number-step", eO = "data-ui-number-min", tO = "data-ui-number-max", nO = "data-ui-number-step-direction", rO = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), iO = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${qD}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Ia(e.components, `.${qD}`));
		}), O.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${qD}`)));
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
		let t = aO(e);
		if (t !== null) return this.keptValue(t) ?? uO(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(QD) ? HD(t) : t, r = SD(e), i = e === document.activeElement ? zD(n, r, dO(e)) : cO(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = aO(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(JD), r = !t.hasAttribute(YD), i = t.selectionStart ?? t.value.length, a = VD(t.value, i, SD(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = aO(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = aO(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : uO(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(QD) && !j(t) && !k(t)) {
			let e = this.values.get(t) ?? "", n = HD(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = aO(e.target);
		if (t === null) return;
		let n = uO(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = aO(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = zD(t, SD(e), dO(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + nO + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${qD}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(nO) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = rO.get(e.key);
		if (t === void 0 || !N(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = aO(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute($D) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : uO(e) ?? "0") || 0) + n * t, i = e.getAttribute(eO), a = e.getAttribute(tO);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, fO(r)), this.show(e);
	}
};
function aO(e) {
	return e instanceof HTMLInputElement && e.classList.contains(qD) ? e : null;
}
function oO(e, t) {
	let n = e.classList.contains(KD) ? e.querySelector(`.${qD}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = sO(n, eO), a = sO(n, tO);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: cO(n, i, SD(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: cO(n, a, SD(n)) }
	} : null;
}
function sO(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function cO(e, t, n) {
	return LD(t, n, {
		format: dO(e),
		thousands: lO(e)
	});
}
function lO(e) {
	return e.hasAttribute(XD) ? !0 : !e.hasAttribute(ZD) && null;
}
function uO(e) {
	return BD(e.value, SD(e), dO(e));
}
function dO(e) {
	return e.closest(`.${KD}`)?.getAttribute("data-ui-number-format") ?? null;
}
function fO(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function pO(e, t) {
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
function G(e) {
	switch (e.getAttribute(Wt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function mO(e) {
	let t = G(e) === "windowed" ? hO(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function hO(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function gO(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var _O = "application/x-ne-items", vO = null, yO = null;
function bO(e, t, n) {
	let r = e.getAttribute(pe), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(R),
		effects: i,
		source: e.getAttribute(me)
	};
}
function xO(e, t) {
	let n = Sd(t);
	return n.includes(e) ? n.filter((t) => t === e || CO(t)) : [e];
}
function SO(e) {
	return !qc(e, "data-ui-undraggable") && !A(e);
}
function CO(e) {
	return SO(e) && L(e) !== null;
}
function wO(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function TO(e, t, n = null) {
	vO = t, yO = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(_O, t.kind);
}
function EO(e) {
	return vO !== null && e.dataTransfer?.types.includes(_O) === !0 ? vO : null;
}
function DO() {
	let e = yO;
	vO = null, yO = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var OO = "data-ui-non-item";
function K(e) {
	let t = [];
	for (let n of e.children) kO(n) || t.push(n);
	return t;
}
function kO(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function AO(e) {
	return e === null ? [] : [e];
}
function jO(e) {
	return e.querySelector(`:scope > [${Pt}]`);
}
function MO(e, t, n, r, i) {
	i ??= K(e).some((e) => !e.classList.contains(bi));
	let a = jO(e);
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
var NO = { ok: !1 }, PO = {
	ok: !0,
	value: null
}, FO = null;
function IO(e) {
	FO = e;
}
function LO(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => $i(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) $i(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return NO;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return NO;
			let t = a[u];
			if (u++, $i(t.kind) === "Dynamic") {
				let n = VO(e, t.componentId);
				if (!n.ok) return NO;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return NO;
				let e = JO(s, t.value);
				if (!e.ok) return NO;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return NO;
		if (l) {
			let e = WO(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? NO : {
		ok: !0,
		value: s,
		scope: c
	};
}
function RO(e, t, n) {
	for (let r of t ?? []) {
		if ($i(r.kind) !== "Dynamic") continue;
		let t = T(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function zO(e) {
	let t = UO(e, "IsContent");
	return t.ok && t.value === !0;
}
var BO = /* @__PURE__ */ new Set();
function VO(e, t) {
	let n = T(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return BO.has(n) || (BO.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), NO;
}
function HO(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = UO(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function UO(e, t) {
	return WO(e, t, !0);
}
function WO(e, t, n) {
	if (e == null) return NO;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return NO;
	let r = e, i = GO(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? NO : (n && FO?.(r, t), PO);
}
function GO(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = KO(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function KO(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function qO(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => $i(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, $i(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = T(e.componentId);
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
function JO(e, t) {
	if (e == null || t == null) return NO;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : NO;
	if (typeof t != "string") return NO;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (XO(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return NO;
}
function YO(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (XO(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function XO(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var ZO = /* @__PURE__ */ new WeakMap();
function QO(e) {
	let t = $O(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = ZO.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = ek(e, n);
	return ZO.set(t, {
		text: n,
		query: i
	}), i;
}
function $O(e) {
	let t = e.closest(C);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function ek(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function tk(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = QO(e);
	if (a === void 0 && o === null) for (let t of K(e)) t.classList.remove(bi);
	else for (let n of K(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(bi)) : n.classList.toggle(bi, !nk(a, e, i, o));
	}
}
function nk(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => sk(e, t, n)) && (r?.filters ?? []).every((e) => bm(HO(t, e.itemProperty), e.operator, e.value));
}
function rk(e, t, n = null) {
	return (e?.filters ?? []).some((e) => ck(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function ik(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => ck(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function ak(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => ok(n.getItemValue(e), n.getItemValue(r), t));
}
function ok(e, t, n) {
	for (let r of n) {
		let n = lk(xm(HO(e, r.itemProperty)), xm(HO(t, r.itemProperty)));
		if (n !== 0) return ia(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function sk(e, t, n) {
	if (!ck(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return bm(HO(t, e.itemProperty), e.operator, r);
}
function ck(e, t, n, r) {
	return e == null || bm(r.get(e, []), t, n);
}
function lk(e, t) {
	if (e === t) return 0;
	let n = dk(e), r = dk(t);
	if (n !== r) return n - r;
	if (n === uk.Nothing) return 0;
	if (n === uk.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var uk = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function dk(e) {
	return e == null ? uk.Nothing : typeof e == "number" ? Number.isNaN(e) ? uk.Nothing : uk.Number : typeof e == "string" && e.trim().length === 0 ? uk.Nothing : Number.isNaN(Number(e)) ? uk.Text : uk.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var fk = /* @__PURE__ */ new WeakMap();
function pk(e, t) {
	let n = fk.get(e), r = n === void 0 ? [...t] : mk(n, t);
	return fk.set(e, r), r;
}
function mk(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function hk(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function gk(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function _k(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function vk(e, t, n) {
	return gk(e, t), hk(e, t, n);
}
function yk(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function bk(e, t) {
	fk.set(e, [...t]);
}
function xk(e) {
	fk.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var Sk = "ui-announcer", Ck = 7e3, wk = null;
function Tk(e, t = "polite") {
	(wk ?? Ek(document.body)).announce(e, t);
}
function Ek(e) {
	return wk = new Ok(e), wk;
}
function Dk(e, t) {
	Tk({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var Ok = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : O.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), Ck), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Sk}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Sk, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, kk = "ui-tab-item";
function Ak(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function jk(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? Ak(e).parentElement : null;
}
function Mk(e, t) {
	return qc(Ak(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Nk = ".ui-items-view__item, .ui-table__row", Pk = "ui-row--dragging", Fk = "--ui-row-drop-offset", Ik = "move", Lk = ".ui-items-view--wrap", Rk = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function zk(e, t) {
	kf(e, Ik, { index: t });
}
function Bk(e) {
	return {
		name: Ik,
		registration: {
			dynamicParameters: (e) => {
				let t = Vk(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...pO((t) => e === void 0 ? null : Hk(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function Vk(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function Hk(e, t) {
	let n = Vk(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = jk(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(Nk), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, R(i), n);
	return o === null ? null : { pending: o };
}
var Uk = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new Wk(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : L(t.row);
		if (t === null || n === null) return;
		let r = Xk(t.root, t.row);
		if (r === null ? !Zk(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (nf(t.root, iA(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(dd), n = t?.parentElement ?? null, r = n?.closest(I) ?? null;
		if (t === null || n === null || r === null || !t.matches(Nk) || !n.hasAttribute("data-ui-items-host") || k(r) || !CO(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Ra(e);
		return this.services === void 0 || n === null ? !1 : ik(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, QO(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : L(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = bO(t.root, n, xO(t.row, iA(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => L(e) ?? e);
		fv(e, t.root, r, Pk, R(t.row), a, wO(i, t.moves)), TO(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = Jk(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : nA(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && eA(this.marked.place, i) && this.marked.offset === a) && (aA(t.root, i, a), this.marked = {
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
		if (Qk(t) !== Qk(e.row)) return null;
		let i = Kk(r ?? Yk(e.host, this.services?.keysOf), R(e.row), R(t), n);
		return i === null ? null : i + mO(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && hv(e, t.host) && (aA(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = Jk(t.host, e.target, e, $k(t.root, t.host), iA(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && zk(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (pv(e.root, Pk), aA(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !N(e, { alt: !0 }) || !Rk.has(e.key) || !(e.target instanceof Element)) return;
		let t = qd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Ad(t.root), r = n === null ? null : $k(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = iA(n), o = Zd(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(Lk) ? Ef(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (zk(o, l), Dk(l + 1, hO(n, "data-ui-window-total") ?? mO(n) + Yk(n, this.services?.keysOf).length));
	}
}, Wk = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = iA(t);
		return this.view = {
			host: t,
			flow: $k(e, t),
			rows: n,
			boxes: n.map((e) => (L(e) ?? e).getBoundingClientRect()),
			order: Yk(t, this.keysOf)
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
		e.some(Gk) && this.drop();
	}
};
function Gk(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function Kk(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = qk(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function qk(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function Jk(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(dd);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(dd) ?? null;
	if (o ??= rA(i, n, a), o === null) return null;
	let s = (L(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && tA(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function Yk(e, t) {
	switch (G(e)) {
		case "virtualized": return [...t?.(e) ?? K(e).map(R)];
		case "windowed": return K(e).map(R);
		default: return pk(e, K(e)).map(R);
	}
}
function Xk(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Zk(e, t) {
	return Lu(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Qk(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function $k(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function eA(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function tA(e, t, n) {
	if (Qk(e) !== Qk(t)) return !1;
	if (!n.across) return !0;
	let r = (L(e) ?? e).getBoundingClientRect(), i = (L(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function nA(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !tA(t.anchor, r, n)) return -1;
	let i = (L(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (L(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function rA(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (L(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function iA(e) {
	return K(e).filter((e) => e instanceof HTMLElement && e.matches(dd) && L(e) !== null);
}
function aA(e, t, n = 0) {
	let r = t === null ? null : L(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Fk));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Fk) !== i && r.style.setProperty(Fk, i);
}
function oA(e) {
	e.classList.remove(Pk), e.querySelector(`:scope > [${y}]`)?.classList.remove(Pk);
}
//#endregion
//#region src/interactions/tree-drop.ts
var sA = "--ui-tree-drop-depth";
function cA(e) {
	return e.querySelector(`.${cr}`);
}
function lA(e, t) {
	if (A(e)) return !1;
	let n = t?.getAttribute(br);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function uA(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || lA(n, cA(n));
}
function dA(e, t) {
	let n = cA(e);
	if (lA(e, n)) return R(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return uA(r, t) ? r : null;
}
function fA(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${lr}]`)) n !== t && (n.removeAttribute(lr), n.style.removeProperty(sA));
	t !== null && (t.setAttribute(lr, n), r === void 0 ? t.style.removeProperty(sA) : t.style.setProperty(sA, String(r)));
}
function pA(e, t, n) {
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
function mA(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = hA(e, r, n);
	return i === null || !gA(e, i.parent) ? null : i;
}
function hA(e, t, n) {
	if (n === "in") {
		let n = pA(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = pA(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: vA(e, n, t.parent, !1)
		};
	}
	let r = _A(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function gA(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function _A(e, t) {
	return e.filter((e) => e.parent === t);
}
function vA(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = _A(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function yA(e, t, n) {
	let r = _A(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? vA(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var bA = "drop:", xA = "ui-row--cut", SA = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, CA = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, wA = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function TA(e) {
	return {
		dynamicParameters: (e) => {
			let t = EA(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...pO((t) => DA(e, t), (t) => e?.settle(t))
	};
}
function EA(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function DA(e, t) {
	let n = EA(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var OA = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new Wk(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = EO(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = kA(t, r, AA(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || k(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Ad(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? Jk(r, t, n, i.flow, i.rows, i.boxes) : jA(i.rows);
			return {
				index: ((a === null ? null : qk(i.order, R(a.anchor), a.side)) ?? i.order.length) + mO(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : aA(e, a, nA(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = MA(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Ad(e) : NA(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => fA(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), gv(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), gv(e, !1), e.matches(".ui-items-view, .ui-table") ? aA(e, null) : e.classList.contains("ui-tree") && fA(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && hv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), DO(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && G(e.host) === "plain" && G(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(bA + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), DO();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !M(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : wu(e.target) || (Vl(wA, e) ? this.paste(e, e.target) : Vl(SA, e) ? this.take(e, e.target, !0) : Vl(CA, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (L(e) ?? e).classList.remove(xA);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : kA(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Kd(t), a = i === null ? null : Ad(i.root);
		if (i === null || a === null || k(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = iA(a), s = i.row ?? Zd(o), c = s === null || !CO(s) ? null : bO(i.root, a, xO(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (L(e) ?? e).classList.add(xA);
	}
};
function kA(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function AA(e) {
	return Xl() ? e.altKey : e.ctrlKey;
}
function jA(e) {
	let t = Qd(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function MA(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : dA(n, (t) => NA(e, t));
}
function NA(e, t) {
	return e.querySelector(`.${sr}[${b}="${Gi(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function PA(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = zA(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < BA(e.start).getTime() ? {
		start: zA(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: zA(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function FA(e, t, n) {
	if (t === null || n === null) return !1;
	let r = BA(e).getTime();
	return r > BA(t).getTime() && r < BA(n).getTime();
}
function IA(e, t) {
	return !t && e.start !== null && e.end !== null && BA(e.start).getTime() < BA(e.end).getTime();
}
function LA(e, t, n) {
	return !n && FA(e, t.start, t.end);
}
function RA(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function zA(e, t) {
	return xs(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function BA(e) {
	return xs(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var q = "ui-temporal-input", VA = "ui-calendar", HA = `.${q}, .${VA}`, UA = "ui-temporal-input__value-input", WA = "ui-temporal-input__end-value-input", GA = "data-ui-temporal-range", KA = "data-ui-temporal-end", qA = "data-ui-temporal-mode", JA = "data-ui-temporal-format", YA = "data-ui-temporal-default-format", XA = "data-ui-temporal-min", ZA = "data-ui-temporal-max", QA = "data-ui-temporal-step", $A = "data-ui-temporal-step-unit", ej = "data-ui-temporal-marked-days", tj = "data-ui-temporal-marked-only", nj = "data-ui-temporal-page-culture", rj = "data-ui-temporal-months", ij = "data-ui-temporal-months-genitive", aj = "data-ui-temporal-months-short", oj = "data-ui-temporal-daynames", sj = "data-ui-temporal-weekdays", cj = "data-ui-temporal-first-day", lj = "data-ui-temporal-am", uj = "data-ui-temporal-pm", dj = /* @__PURE__ */ new Set([
	JA,
	YA,
	XA,
	ZA,
	rj,
	lj,
	uj,
	ej,
	tj
]), fj = 2e3;
function pj(e) {
	let t = e.getAttribute(qA);
	return t === "time" || t === "date-time" ? t : "date";
}
function mj(e) {
	let t = e.getAttribute(JA);
	return t === null || t.trim().length === 0 ? e.getAttribute(YA) ?? "" : t;
}
function hj(e) {
	let t = e.getAttribute($A), n = Math.max(1, Math.trunc(Number(e.getAttribute(QA))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function gj(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function _j(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function vj(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function yj(e) {
	return {
		monthNames: bj(e, rj),
		monthGenitiveNames: bj(e, ij),
		abbreviatedMonthNames: bj(e, aj),
		dayNames: bj(e, oj),
		abbreviatedDayNames: bj(e, sj),
		amDesignator: e.getAttribute(lj) ?? "AM",
		pmDesignator: e.getAttribute(uj) ?? "PM"
	};
}
function bj(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function xj(e, t) {
	e.hasAttribute(nj) && (w(e, ij, t.monthGenitiveNames.join("|")), w(e, aj, t.abbreviatedMonthNames.join("|")), w(e, oj, t.dayNames.join("|")), w(e, sj, t.abbreviatedDayNames.join("|")), w(e, rj, t.monthNames.join("|")), w(e, lj, t.amDesignator), w(e, uj, t.pmDesignator), w(e, YA, wj(pj(e), hj(e), t)));
}
function Sj(e) {
	for (let t = 0; t < e.length;) {
		let n = hs(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Cj(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Is(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function wj(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : os(n, r);
}
function Tj(e) {
	return e.hasAttribute(GA);
}
function Ej(e) {
	return e !== null && e.hasAttribute(KA);
}
function Dj(e) {
	return J(e, !1);
}
function J(e, t) {
	let n = Oj(e, t);
	return n === null ? null : Yj(n.value, pj(e));
}
function Oj(e, t) {
	return e.querySelector(`.${t ? WA : UA}`);
}
function kj(e, t) {
	let n = e.getAttribute(t) ?? "", r = Yj(n, pj(e)), i = zj(n);
	if (r === null || i === null) return r;
	let a = Rj(e, !1), o = /* @__PURE__ */ new Date(Aj(r) - jj(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + jj(a) * 6e4);
		return xs(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return Mj(e) ? r : o;
}
function Aj(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function jj(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function Mj(e) {
	return (Oj(e, !1)?.value.trim() ?? "").length > 0 || (Oj(e, !0)?.value.trim() ?? "").length > 0;
}
function Nj(e) {
	let t = kj(e, XA), n = kj(e, ZA), r = (e.getAttribute(ej) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : Xj(t, "date"),
		max: n === null ? null : Xj(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(tj)
	};
}
function Pj(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function Fj(e, t, n) {
	Vj(e, t === null ? "" : Ij(e, t, n), n);
}
function Ij(e, t, n) {
	let r = pj(e), i = Xj(t, r);
	return r === "date-time" ? i + (Rj(e, n) ?? Bj(t)) : i;
}
var Lj = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function Rj(e, t) {
	return zj(Oj(e, t)?.value ?? "") ?? zj(Oj(e, !t)?.value ?? "");
}
function zj(e) {
	return Lj.exec(e.trim())?.[1] ?? null;
}
function Bj(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${Zj(Math.floor(n / 60))}:${Zj(n % 60)}`;
}
function Vj(e, t, n) {
	let r = Oj(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Hj(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Ts(n, mj(e), yj(e));
	return r === null ? n : Xj(bs(r), pj(e));
}
function Uj(e) {
	if (!Tj(e)) return;
	let t = {
		start: J(e, !1),
		end: J(e, !0)
	};
	if (RA(t) === t) return;
	let n = Oj(e, !1)?.value ?? "";
	Vj(e, Oj(e, !0)?.value ?? "", !1), Vj(e, n, !0);
}
function Wj(e) {
	let t = kj(e, XA), n = kj(e, ZA);
	if (t === null && n === null) return null;
	for (let r of Tj(e) ? [!1, !0] : [!1]) {
		let i = J(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: us(t, mj(e), yj(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: us(n, mj(e), yj(e)) }
		};
	}
	return null;
}
function Gj(e) {
	return qj(e, Kj(e, /* @__PURE__ */ new Date()));
}
function Kj(e, t) {
	let n = kj(e, XA), r = kj(e, ZA);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function qj(e, t) {
	let n = hj(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Jj = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Yj(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Jj.exec(n);
		return e === null ? null : new Date(fj, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = ys(n);
	return r === null ? null : bs(r);
}
function Xj(e, t) {
	let n = `${Zj(e.getHours())}:${Zj(e.getMinutes())}:${Zj(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Zj(e.getMonth() + 1)}-${Zj(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Zj(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var Qj = "ui-temporal-input__day", $j = "ui-temporal-input__month", eM = 3, tM = "data-ui-temporal-nav", nM = "data-ui-temporal-day", rM = 366;
function iM(e) {
	let t = Dj(e);
	return {
		view: OM(t ?? Kj(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function aM(e, t, n, r) {
	let i = DM("div", `${q}__calendar`), a = DM("div", `${q}__calendar-header`), o = Nj(e), s = EM("previous", "‹", O.text("ui.picker.previous"));
	s.disabled = oM(o, t, -1) === null, a.append(s);
	let c = EM("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${q}__calendar-label`), a.append(c);
	let l = EM("next", "›", O.text("ui.picker.next"));
	return l.disabled = oM(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? uM(e, t, n, r, o) : dM(t, n, o)), i;
}
function oM(e, t, n) {
	let r = t.pane === "months", i = jM(t.view, n * (r ? 12 : 1));
	return cM(e, sM(i, r ? 4 : 7)) ? lM(e, i) : null;
}
function sM(e, t) {
	return Xj(e, "date").slice(0, t);
}
function cM(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function lM(e, t) {
	let n = sM(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : Yj(r, "date");
	return i === null ? t : OM(i);
}
function uM(e, t, n, r, i) {
	let a = CM(e), o = DM("div", `${q}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = DM("span", `${q}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = DM("div", `${q}__days`), c = BA(/* @__PURE__ */ new Date()), l = Tj(e), u = l ? J(e, !1) : r, d = l ? J(e, !0) : null, f = l && IA({
		start: u,
		end: d
	}, t.choosingEnd), p = kM(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = AM(p, e), r = Xj(n, "date"), a = DM("button", Qj);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(nM, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${Qj}--outside`), MM(n, c) && (a.classList.add(`${Qj}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${Qj}--marked`);
		let o = u !== null && MM(n, u), m = d !== null && MM(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${Qj}--selected`), f && o && a.classList.add(`${Qj}--period-start`), f && m && a.classList.add(`${Qj}--period-end`), l && (o || m) && a.setAttribute("aria-description", O.text(o ? "ui.picker.start" : "ui.picker.end")), LA(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${Qj}--within`), Pj(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = DM("div", `${q}__calendar-pane`);
	return m.append(o, s), m;
}
function dM(e, t, n) {
	let r = DM("div", `${q}__months`);
	for (let i = 0; i < 12; i++) {
		let a = DM("button", $j);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(tM, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${$j}--selected`), a.setAttribute("aria-current", "true")), cM(n, sM(xs(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return P(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function fM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : pM(t, r % eM);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function pM(e, t) {
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
			offset: eM,
			step: eM
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
function mM(e) {
	let t = DM("div", `${q}__period-caption`);
	return t.textContent = O.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function hM(e, t, n) {
	let r = Nj(e);
	if (n.startsWith("month:")) {
		let i = xs(t.view.getFullYear(), Number(n.slice(6)), 1);
		return cM(r, sM(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = bM(r, yM(i, t.focusedDay ?? Dj(e) ?? Kj(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = oM(r, t, -1) ?? t.view, !0;
		case "next": return t.view = oM(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function gM(e, t, n) {
	if (Tj(e)) {
		_M(e, t, n);
		return;
	}
	let r = zA(n, Dj(e) ?? Gj(e));
	t.focusedDay = r, t.view = OM(r), Fj(e, r, !1);
}
function _M(e, t, n) {
	let r = PA({
		start: J(e, !1),
		end: J(e, !0)
	}, t.activeEnd, zA(n, Gj(e)));
	t.focusedDay = r.end ?? r.start, t.view = OM(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, Fj(e, r.end, !0), Fj(e, r.start, !1);
}
function vM(e, t, n, r = !1) {
	let i = xM(n), a = SM(t, n, CM(e), r);
	if (a === null) return null;
	let o = Nj(e);
	if (i === 0) return bM(o, a);
	let s = a;
	for (let e = 0; e < rM; e++) {
		if (Pj(o, Xj(s, "date"))) return s;
		s = AM(s, i);
	}
	return t;
}
function yM(e, t) {
	let n = xs(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return xs(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function bM(e, t) {
	let n = Xj(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : Yj(r, "date");
	return i === null ? t : zA(i, t);
}
function xM(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function SM(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return AM(e, -1);
		case "ArrowRight": return AM(e, 1);
		case "ArrowUp": return AM(e, -7);
		case "ArrowDown": return AM(e, 7);
		case "PageUp": return jM(e, r ? -12 : -1);
		case "PageDown": return jM(e, r ? 12 : 1);
		case "Home": return AM(e, -i);
		case "End": return AM(e, 6 - i);
		default: return null;
	}
}
function CM(e) {
	let t = Number(e.getAttribute(cj));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function wM(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Qj}`)];
	if (i.length === 0) return;
	let a = Xj(BA(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (P(i, o), r && z(o));
}
function TM(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? J(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && BA(r).getTime() > BA(n).getTime();
	for (let t of e.querySelectorAll(`.${Qj}`)) {
		let e = Yj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${Qj}--preview`, i && e !== null && FA(e, n, AM(r, 1))), t.classList.toggle(`${Qj}--preview-start`, i && e !== null && MM(e, n)), t.classList.toggle(`${Qj}--preview-end`, i && e !== null && MM(e, r));
	}
}
function EM(e, t, n) {
	let r = DM("button", `${q}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(tM, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function DM(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function OM(e) {
	return xs(e.getFullYear(), e.getMonth(), 1);
}
function kM(e, t) {
	let n = OM(e);
	return AM(n, -((n.getDay() - t + 7) % 7));
}
function AM(e, t) {
	return xs(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function jM(e, t) {
	let n = xs(e.getFullYear(), e.getMonth() + t, 1), r = xs(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return xs(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function MM(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var NM = "ui-temporal-input__field", PM = "ui-temporal-input__popup", FM = "ui-temporal-input--open", IM = "ui-calendar__body", LM = "ui-temporal-input__time-cell", RM = "ui-temporal-input__time-column", zM = 140, BM = "data-ui-temporal-toggle", VM = "data-ui-temporal-unit", HM = "data-ui-temporal-cell", UM = "data-ui-temporal-centred", WM = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new g_({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(FM), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(FM);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(HA)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Ia(e.components, HA), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && GM(e) && this.states.set(e, iM(e)), this.isShowing(e) && this.renderSurface(e);
		}), V(this.root, HA, { attributeFilter: [...dj] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), V(this.root, HA, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), O.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) GM(e) && KM(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(HA)], t = O.temporal;
		if (t !== null && O.language !== this.drawnLanguage) {
			this.drawnLanguage = O.language;
			for (let n of e) xj(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || GM(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${IM}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && KM(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Cs(mj(t), aN()), n = ms(mj(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${NM}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = Oj(t, Ej(r))?.value ?? "", a = Yj(i, pj(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = us(a, mj(t), yj(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(NM)) return;
		let t = e.target.closest(`.${q}`), n = t === null ? null : Oj(t, Ej(e.target));
		if (t === null || n === null) return;
		let r = Hj(t, e.target.value), i = Yj(r, pj(t)), a = i === null ? r : Ij(t, i, Ej(e.target));
		if (qM(t, a)) {
			let n = J(t, Ej(e.target));
			e.target.value = n === null ? "" : us(n, mj(t), yj(t));
		} else Ej(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Uj(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(NM)) return;
		let t = e.target.closest(`.${q}`);
		t !== null && Tj(t) && (this.getState(t).activeEnd = Ej(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Tj(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${nM}]`) : null, r = this.getState(t), i = n === null ? null : Yj(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, TM(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${nM}], .${LM}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(LM) ? cN(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = KM(e), r = Yj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, P([...n.querySelectorAll(`.${Qj}`)], t), dp(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(NM)) return;
		let t = e.target.closest(`.${q}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${BM}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${q}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${tM}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${nM}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${HM}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${VM}]`)?.getAttribute(VM);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(HM)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (hM(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, Gj(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Tj(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = Yj(t, "date");
		if (n === null || j(e) || k(e) || !Pj(Nj(e), t)) return;
		let r = this.getState(e);
		GM(e) && Tj(e) && !r.choosingEnd && J(e, !1) !== null && J(e, !0) !== null && (r.activeEnd = "start");
		let i = Oj(e, !1), a = `${i?.value ?? ""}|${Oj(e, !0)?.value ?? ""}`;
		gM(e, r, n), GM(e) && `${i?.value ?? ""}|${Oj(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Tj(e) && this.getState(e).activeEnd === "end", i = vj(J(e, r) ?? Gj(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Fj(e, t, n), Uj(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "ArrowDown" && N(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(NM)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${q}`), Ej(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(LM)) {
			N(e) && uN(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			N(e) && lN(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !N(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = Yj(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Xj(n, "date"));
			return;
		}
		let r = vM(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = OM(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${RM}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, zM)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${RM}`), n = t?.getAttribute(VM) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = $y(this.wheelTurns.get(n) ?? 0, Qy(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${LM}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${LM}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${LM}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(HM)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || j(e) || k(e)) return;
		let n = Number(t.getAttribute(UM));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(VM), i = eN(t);
		r === null || i === null || i.classList.contains(`${LM}--selected`) || (i.matches(":disabled") ? QM(e) : this.chooseTime(e, r, Number(i.getAttribute(HM))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${PM}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Tj(e) ? t ?? (J(e, !1) === null ? "start" : J(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = J(e, r.activeEnd === "end") ?? Dj(e);
		r.pane = "days", r.view = OM(i ?? Kj(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${BM}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => sN(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = iM(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = KM(e);
		if (n === null) return;
		let r = GM(e), i = pj(e), a = this.getState(e), o = yj(e), s = Tj(e), c = J(e, s && a.activeEnd === "end"), l = tN(n), u = nN(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(mM(a)), r) n.append(aM(e, a, o, c));
		else {
			let t = DM("div", `${q}__panes`);
			t.append(aM(e, a, o, c)), i === "date-time" && t.append(JM(e, c)), n.append(t, iN(i));
		}
		let f = u === null ? null : n.querySelector(`[${tM}="${Gi(u)}"]:not(:disabled)`);
		wM(n, a, c, t || d && l === null && f === null), TM(e, a), r || (ZM(n), QM(n), rN(n, l)), f !== null && z(f), r || this.popups.reposition(e);
	}
};
function GM(e) {
	return e.classList.contains(VA);
}
function KM(e) {
	return e.querySelector(`.${GM(e) ? IM : PM}`);
}
function qM(e, t) {
	let n = Nj(e), r = n.markedOnly ? Yj(t, pj(e)) : null;
	return r !== null && !n.marked.has(Xj(r, "date"));
}
function JM(e, t) {
	let n = hj(e), r = DM("div", `${q}__time`), i = DM("div", `${q}__time-columns`);
	for (let r of YM(n)) i.append(XM(e, r, gj(n, r), t));
	return r.append(i), r;
}
function YM(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function XM(e, t, n, r) {
	let i = DM("div", RM);
	i.setAttribute(VM, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", O.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : _j(r, t), s = t === "hour" && Sj(mj(e)), c = yj(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = DM("button", LM);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Cj(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(HM, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${LM}--selected`), mN(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function ZM(e) {
	let t = e.querySelector(`.${q}__calendar`), n = e.querySelector(`.${q}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function QM(e) {
	for (let t of e.querySelectorAll(`.${RM}`)) {
		let e = t.querySelector(`.${LM}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, $M(t, e), t.setAttribute(UM, String(t.scrollTop));
	}
}
function $M(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function eN(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${LM}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function tN(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(LM) ? null : t.closest(`.${RM}`)?.getAttribute(VM) ?? null;
}
function nN(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(tM) : null;
}
function rN(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${RM}[${VM}="${t}"]`)?.querySelector(`.${LM}--selected`) ?? null;
	n !== null && z(n);
}
function iN(e) {
	let t = DM("div", `${q}__popup-footer`);
	return t.append(EM("now", O.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(EM("clear", O.text("ui.picker.clear"))), t.append(EM("done", O.text("ui.picker.done"))), t;
}
function aN() {
	return {
		year: oN("ui.picker.letter.year", Ss.year),
		month: oN("ui.picker.letter.month", Ss.month),
		day: oN("ui.picker.letter.day", Ss.day),
		hour: oN("ui.picker.letter.hour", Ss.hour),
		minute: oN("ui.picker.letter.minute", Ss.minute),
		second: oN("ui.picker.letter.second", Ss.second)
	};
}
function oN(e, t) {
	let n = O.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function sN(e, t) {
	for (let n of e.querySelectorAll(`.${NM}`)) if (Ej(n) === t) return n;
	return e.querySelector(`.${NM}`);
}
function cN(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(LM) && dp(e);
}
function lN(e, t) {
	if (!zu(e.key, "both")) return;
	e.preventDefault();
	let n = fM(t, e.key);
	Vu([...n?.parentElement?.children ?? []], n);
}
function uN(e) {
	let t = e.target, n = t.closest(`.${RM}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? fN(n, e.key === "ArrowRight" ? 1 : -1) : dN(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), pN(r));
}
function dN(e, t, n) {
	let r = [...e.querySelectorAll(`.${LM}`)];
	return n === "PageUp" || n === "PageDown" ? wf(n, r.filter(F), t, "vertical") ?? t : Ru({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function fN(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${RM}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${LM}--selected`) ?? r.querySelector(`.${LM}:not(:disabled)`);
}
function pN(e) {
	let t = e.closest(`.${RM}`);
	t !== null && ($M(t, e), t.setAttribute(UM, String(t.scrollTop)));
}
function mN(e, t, n, r) {
	let i = kj(e, XA), a = kj(e, ZA);
	if (i === null && a === null) return !1;
	let o = vj(r ?? Gj(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var hN = `[${Ur}="${Gr}"] [${Wr}]`, gN = "ui-theme-switcher__label-text--current";
function _N() {
	let e = document.documentElement.getAttribute(zr);
	return e === "light" || e === "dark" ? e : "auto";
}
function vN(e, t) {
	let n = e.getAttribute(Wr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(gN, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var yN = new lT();
function bN(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(F) ?? null);
	o !== null && P(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Dp(t.popup, n, i), s;
}
function xN(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = uT(e);
	if (r !== null) return e.preventDefault(), Vu(t, CN(t, n, r)), !0;
	if (!zu(e.key, "vertical") || !N(e)) return !1;
	let i = Ru({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Vu(t, i), !0;
}
var SN = {
	character: uT,
	entry: CN
};
function CN(e, t, n) {
	let r = e.filter(F), i = r[0]?.parentElement;
	return i == null ? null : yN.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Mg,
		context: i
	});
}
function wN(e, t) {
	e !== document.activeElement && F(e) && (P(t, e), dp(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var TN = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new g_({
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
		bN(this.menus, {
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
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && xN(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && wN(t, this.choicesOf(n));
	}
}, EN = `[${Ur}="${Gr}"]`, DN = "ui-theme-switcher__choice", ON = class {
	options;
	root;
	list = new TN({
		attribute: Ur,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: DN,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Di}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [zr]
		}), V(this.root, EN, {
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
			e.preventDefault(), this.apply(kN() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${DN}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Wr));
			return;
		}
		let r = e.target.closest(`.${Di}`);
		r === null || k(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: Xi.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = _N();
		if (e === void 0) for (let e of this.root.querySelectorAll(hN)) vN(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${Wr}]`)) vN(e, t);
	}
};
function kN() {
	let e = _N();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var AN = `.ui-language-switcher__trigger, .${Di}`, jN = "ui-language-switcher__label-text", MN = "ui-language-switcher__label-text--current", NN = "ui-language-switcher__label-text--page", PN = "ui-language-switcher__choice", FN = "ui.language.switch", IN = "ui.language.current", LN = class {
	options;
	root;
	list = new TN({
		attribute: Hr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: PN,
		openClass: "ui-language-switcher--open",
		triggerSelector: AN
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), O.onChange(() => this.showLanguage(O.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${PN}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Kr));
			return;
		}
		let r = e.target.closest(AN);
		if (r === null || k(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = O.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
		} else this.list.isOpen(n) ? this.list.close(n) : this.opensList(n, i) && this.list.open(n, r);
	}
	opensList(e, t) {
		return this.list.isField(e) ? t.length > 1 : t.length > 2;
	}
	choose(e, t) {
		this.list.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Xi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Hr}]`)) {
			let n = t.querySelector(`:scope > :is(${AN})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${jN}`)) {
				let n = t.getAttribute(Kr) === e;
				t.classList.toggle(MN, n), t.classList.contains(NN) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = RN(jc(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [FN, {
				language: zN(r, e),
				code: BN(e),
				other: zN(r, o),
				otherCode: BN(o)
			}] : [IN, {
				language: zN(r, e),
				code: BN(e)
			}];
			O.write(n, "aria-label", s, c), a && O.write(t, Re, s, c);
		}
	}
};
function RN(e) {
	return D(e) && (e.key === FN || e.key === IN);
}
function zN(e, t) {
	let n = e.find((e) => e.getAttribute(Kr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return BN(t);
	}
}
function BN(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var VN = `${Me}__button`, HN = `${Me}__more`, UN = `${VN}--icon`, WN = "ui-text__icon", GN = `.ui-button__content .${WN}`, KN = ".ui-button__content .ui-text__title", qN = /* @__PURE__ */ new WeakMap();
function JN(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Bn)) YN(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function YN(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function XN(e, t) {
	let n = t.entries.map((e) => ZN(e, t));
	return t.more && t.openMore !== void 0 && n.push($N(t.openMore)), e.replaceChildren(...n), n;
}
function ZN(e, t) {
	let n = eP(VN), r = nP(e), i = QN(e);
	return i === null ? n.textContent = r : (n.classList.add(UN), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), k(e) && (n.classList.add(_i), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), qN.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function QN(e) {
	let t = e.querySelector(GN);
	if (t === null || !t.className.split(" ").some(ho)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(WN), n.setAttribute(uo, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(fo);
	return r.length > 0 && n.style.setProperty(fo, r), n;
}
function $N(e) {
	let t = eP(`${VN} ${HN}`);
	return t.setAttribute("aria-haspopup", "menu"), O.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function eP(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Mi}`, t.tabIndex = -1, t;
}
function tP(e) {
	return qN.get(e) ?? null;
}
function nP(e) {
	return e.querySelector(KN)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var rP = 500, iP = 150, aP = 10, oP = /* @__PURE__ */ new WeakSet(), sP = "ui-long-press-hold", cP = "ui-long-press-hold-end";
function lP(e) {
	return oP.has(e);
}
var uP = class {
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
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), iP);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), rP),
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
		}, t.dispatchEvent(new CustomEvent(sP, {
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
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(cP, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > aP && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > aP && this.cancel();
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
		oP.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (oP.has(e)) return;
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
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > aP && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, dP = [
	zm("md"),
	zm("xl"),
	zm("xxl")
], fP = {
	md: zm("md"),
	xl: zm("xl"),
	xxl: zm("xxl")
}, pP = zm("md");
function mP(e, t) {
	return hP(e) && !(e.hasAttribute(Dn(t)) && !_P(e, t) && gP(pP));
}
function hP(e) {
	let t = e.getAttribute(Tn);
	if (t === null) return !1;
	let n = fP[t];
	return n === void 0 || !gP(n);
}
function gP(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function _P(e, t) {
	return e.querySelector(`:scope > [${jn}="${Gi(t)}"][${On}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var vP = "ne.ui", yP = "boot", bP = /* @__PURE__ */ new Set(), xP = class {
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
		let r = this.resolveKey(e, yP);
		if (r !== null) try {
			let e = SP(window.localStorage.getItem(r));
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
			return bP.has(n) || (bP.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${vP}:${n}:${t}`;
	}
};
function SP(e) {
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
var CP = "menu-current", wP = `[${un}]`;
function TP(e) {
	for (let t = e.closest(wP); t !== null; t = t.parentElement?.closest(wP) ?? null) DP(t);
}
function EP(e) {
	for (let t of e.querySelectorAll(wP)) DP(t);
	TP(e);
}
function DP(e) {
	let t = e.querySelector(`.${Fn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(pn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var OP = "menu-icons", kP = "ui-menu__host", AP = `:scope > :not([${hn}]) > .${S}[${Li}]`;
function jP(e) {
	let t = e.closest(`.${kP}`);
	t !== null && NP(t);
}
function MP(e) {
	for (let t of e.querySelectorAll(`.${kP}`)) NP(t);
}
function NP(e) {
	let t = e.querySelector(AP) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var PP = "ui-menu__submenu", FP = un, IP = fn, LP = "data-ui-menu-flyout", RP = `[${LP}], ${Ci}`, zP = "data-ui-menu-unfolded", BP = dn, VP = "data-ui-menu-rail-list", HP = "left-side", UP = "[data-ui-root]", WP = "menu-open-group", GP = B.normal * 5, KP = Ze("click"), qP = class {
	root;
	store = new xP();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new g_({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(IP, ""), t.setAttribute(LP, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(IP), queueMicrotask(() => Im(t, GP, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(LP);
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
		QP(t), this.reconcileEach(t);
		for (let e of t) EP(e), MP(e);
		V(this.root, `.${Nn}`, {
			childList: !0,
			attributeFilter: [ln]
		}, (e) => {
			QP(e), this.reconcileEach(e);
			for (let t of e) EP(t), MP(t);
		});
		for (let e of this.root.querySelectorAll(`[${FP}]`)) JP(e);
		if (V(this.root, `[${FP}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [IP]
		}, (e) => {
			for (let t of e) JP(t);
		}), typeof matchMedia == "function") for (let e of dP) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		V(this.root, UP, { attributeFilter: [Dn(HP)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${kn}] .${Nn}`);
		QP(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = iF(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), YP(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(zP, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${FP}]`)) JP(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Fn}`), e);
		if (t !== null && !t.hasAttribute(BP)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, WP), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && $P(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Nn}`);
		a !== null && (rF(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Ln);
		e.setAttribute(zP, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(IP) ? (t.removeAttribute(IP), n || this.store.write(e, WP, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, WP, t.getAttribute(b))) : t.toggleAttribute(IP);
	}
	openInline(e) {
		e.setAttribute(IP, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${FP}][${IP}]`)) t.hasAttribute(BP) || t.removeAttribute(IP);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		YP(e), this.closeGroups(e);
		let a = n.closest(RP) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${XP(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Nn}`);
		o !== null && !ip() && Dp(o, eF(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${FP}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${FP}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${PP}`);
	}
};
function JP(e) {
	let t = e.querySelector(`:scope > .${S}`);
	t !== null && (t.setAttribute(KP, ""), t.setAttribute(Qe, ""), t.setAttribute("aria-expanded", e.hasAttribute(IP) ? "true" : "false"), rF(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function YP(e) {
	for (let t of e.querySelectorAll(`[${LP}]`)) t.removeAttribute(LP);
}
function XP(e) {
	return ZP(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function ZP(e) {
	let t = e.closest(`[${On}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && mP(t.parentElement, HP);
}
function QP(e) {
	for (let t of e) {
		let e = t.closest(`[${kn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(VP) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && mP(e.parentElement, HP);
		t.classList.toggle(In, !n), t.toggleAttribute(VP, n);
	}
}
function $P(e) {
	let t = e.closest(`.${S}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !k(t);
}
function eF(e) {
	let t = [];
	for (let n of sd(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(IP) || rF(e) ? null : e.querySelector(`:scope > .${PP} > .${Nn}`);
		r !== null && t.push(...eF(r));
	}
	return t;
}
function tF(e) {
	let t = nF(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || rF(t) ? e : tF(n);
}
function nF(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(PP) && t.parentElement?.hasAttribute(FP) === !0 ? t.parentElement : null;
}
function rF(e) {
	let t = e.closest(`.${Nn}`);
	return e.hasAttribute(BP) || t !== null && iF(t);
}
function iF(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var aF = "tabs:rename", oF = "tabs:pin", sF = "tabs:unpin", cF = "tabs:close", lF = "tabs:delete";
function uF(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function dF(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[aF, e.rename && t.renamable],
		[oF, e.pin && !t.pinned],
		[sF, e.pin && t.pinned],
		[cF, e.close && !e.delete && n],
		[lF, e.delete && n]
	]);
}
function fF(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function pF(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var mF = Se, hF = "ui-context-menu--open", gF = `${Me}--strip`, _F = `.${Me}:not(.${gF}) > .${HN}`, vF = "ui-context-menu-opening", yF = null, bF = /* @__PURE__ */ new WeakSet();
function xF(e) {
	yF = e;
}
var SF = class {
	root;
	components;
	closed = null;
	menus = new g_({
		show: ({ popup: e }) => e.classList.add(hF),
		hide: ({ popup: e }, t) => {
			e.classList.remove(hF), this.closed = e, t === "outside" && HF();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new uP({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !wu(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: TF
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !ip() && !lP(e), n = (t ? DF() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = CF(n);
		if (r === null) return;
		e.preventDefault();
		let i = FF(e) ? n : null, a = n.closest(_F), o = t ? OF(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		bF.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${gF}`)?.remove(), IF(t), i !== null && LF(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && zF(t), this.closed !== null && (Fm(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? rp(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : Op(s, this.components)) ?? Op(e, this.components)
		}) && (c === null && Uh(t, n, r), VF(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && $P(e.target) && this.menus.close();
	}
};
function CF(e) {
	for (let t of wF(e)) {
		let n = AF(t, e).find((t) => NF(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* wF(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (jF(n, e) && !k(n)) {
			if (WF(n)) return;
			yield n;
		}
	}
}
function TF(e) {
	let t = wF(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(dd);
	return r !== null && r !== n && n.contains(r) ? L(r) ?? r : n;
}
var EF = `[${Ce}]`;
function DF() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Kd(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? $d(t.root);
	return n === null ? t.root : kF(n);
}
function OF(e) {
	let t = e.closest(dd);
	return t === null ? e : L(t) ?? t;
}
function kF(e) {
	if (e.matches(EF)) return e;
	for (let t of e.querySelectorAll(EF)) if (t.closest(dd) === e) return t;
	return e;
}
function AF(e, t) {
	return MF(e, t).map((t) => UF(e, t)).filter((e) => e !== null);
}
function jF(e, t) {
	return MF(e, t).some((t) => UF(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function MF(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function NF(e, t, n) {
	let r = new CustomEvent(vF, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function PF(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || k(n) || WF(n) || r !== null && n.contains(r) ? null : AF(n, e).find((n) => NF(n, e, t)) ?? null;
}
function FF(e) {
	let t = e.pointerType;
	return lP(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : ap();
}
function IF(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function LF(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !AF(e, r).includes(t)) return;
	let { entries: i } = JN(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${gF}`, a.setAttribute("role", "group"), XN(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: RF
	}), t.insertBefore(a, t.firstElementChild);
}
function RF(e) {
	k(e) || e.click();
}
function zF(e) {
	let { entries: t } = JN(e), n = e.querySelector(`.${Nn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) BF(e);
	let r = od(n, `.${S}`, `.${Nn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && YN(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? BF(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Mn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	fF(a).forEach((e, t) => {
		a[t] === "rule" && !e && BF(i[t]);
	});
}
function BF(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function VF(e) {
	let t = e.querySelector(`.${Nn}`);
	t !== null && Dp(e, eF(t));
}
function HF() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Vf}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function UF(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${mF}]`)) if ((n.getAttribute(mF) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || yF === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = yF(e);
	return r !== null && bF.add(r), r;
}
function WF(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return qc(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function GF(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function KF(e) {
	return getComputedStyle(e).display !== "none";
}
function qF(e) {
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
				if (e.overflowX !== "visible" && XF(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && XF(n, a, a + t.clientHeight, !1), ZF(n)) return !0;
			}
			r = e.position;
		}
	}
	return XF(n, 0, window.innerWidth, !0), XF(n, 0, window.innerHeight, !1), ZF(n);
}
function JF(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || GF(n, !1)) && (YF(e.overflowX) || YF(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function YF(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function XF(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function ZF(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var QF = `[${De}]`, $F = `.${Me}`, eI = `${Me}--out`, tI = `.ui-items-view__item, .${nr}`, nI = "ui-tree__node", rI = 6, iI = "--ui-action-bar-gap", aI = 400, oI = /* @__PURE__ */ new WeakMap(), sI = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...mi
], cI = class {
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
		if (n === null || n.closest(`${$F}, [data-ui-context-menu]`) !== null) return;
		let r = lI(n), i = r !== null && r !== this.chosen && uI(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : gI(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? _I(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && (this.chosen.isConnected && !this.shown.has(this.chosen) || dg(this.chosen)) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest($F) === null && FF(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest($F);
		n === null ? ip() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(mI(t)) : this.isHostedBar(n) && P(TI(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest($F) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(I) && this.choose(mI(t));
			return;
		}
		let n = t.closest($F);
		if (n !== null && t.classList.contains(VN)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (mu(e)) return;
			let n = t.closest(sg);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
		} else if (e.key === "Tab" && N(e) && t.matches(I)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(I) && this.choose(mI(t));
	}
	handleBarKey(e, t, n) {
		if (!N(e, { shift: !0 })) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && kI(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Op(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = TI(t), i = Ru({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Vu(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : gI(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = JF(e);
		if (t === void 0 || n === null || !GF(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + yI(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, hh(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : PF(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			Xh(e) || this.scopeChanged();
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
				this.chosen = _I(e), this.sync();
			}
			for (let e of this.shown.values()) hh(e.bar);
			this.markOut();
		}
	}
	sync() {
		this.chosen !== null && dg(this.chosen) && (this.chosen = null, this.identity = null, this.watchScope());
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = PF(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), O.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Qe, ""), n.setAttribute(fe, ""), !xI(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, wI(e)), ih(e, n, {
			placement: vI(e),
			gap: yI(e),
			boundary: JF(e) ?? void 0
		}), n.classList.toggle(eI, qF(e));
		let r = new MutationObserver((t) => {
			Xh(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: sI
		});
		let i = bI(e);
		i?.setAttribute(Mr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), oI.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : tP(r);
		if (!xI(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = TI(t.bar);
		Vu(a, a.find((e) => tP(e) === i) ?? a.find(F) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || DI(t)) return;
		if (this.menuHost = e, OI(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		SI(n.bar, !0);
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
		SI(t.bar, !1);
		let n = document.activeElement;
		!ip() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && CI(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), gh(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Mr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(eI, qF(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : TI(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function lI(e) {
	let t = e.closest(QF);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(C);
	return n === null || r !== null && !r.contains(n) ? null : hI(n)[0] ?? null;
}
function uI(e, t) {
	let n = Lu(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !fI(n, t);
}
var dI = `[${Se}], .${Me}, ${Ei}`;
function fI(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = pI(e) - pI(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(dI)) return !1;
			t -= pI(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function pI(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function mI(e) {
	if (e instanceof HTMLElement && e.matches(I)) {
		let t = $d(e), n = t === null ? void 0 : hI(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(QF);
}
function hI(e) {
	let t = [...e.querySelectorAll(QF)];
	return e.matches(QF) ? [e, ...t] : t;
}
function gI(e) {
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
		index: hI(n).indexOf(e)
	};
}
function _I(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return hI(t)[e.index] ?? null;
	return null;
}
function vI(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function yI(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(iI));
	return Number.isFinite(t) ? t : rI;
}
function bI(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(tI)) return t;
	let n = t.parentElement;
	return t.classList.contains(nI) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function xI(e, t, n, r) {
	let { entries: i, more: a } = JN(t);
	if (i.length === 0 && !a) return !1;
	let o = XN(e, {
		entries: i,
		more: a,
		role: "button",
		press: EI,
		openMore: n
	});
	return P(o, o.find((e) => !k(e)) ?? o[0] ?? null), SI(e, r), !0;
}
function SI(e, t) {
	CI(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function CI(e) {
	return TI(e).find((e) => tP(e) === null) ?? null;
}
function wI(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function TI(e) {
	return [...e.querySelectorAll(`:scope > .${VN}`)];
}
function EI(e, t) {
	if (k(t) || DI(t)) return;
	let n = PF(t, !1);
	n !== null && n.contains(e) && !k(e) && YN(e, n) && e.click();
}
function DI(e) {
	let t = e.closest($F), n = t === null ? void 0 : oI.get(t);
	return n !== void 0 && ap() && Date.now() - n < aI;
}
function OI(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function kI(e) {
	return e.matches(Vf) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var AI = "ui-tooltip", jI = "ui-tooltip", MI = "ui-tooltip--visible", NI = "ui-tooltip--linked", PI = "[aria-haspopup][aria-expanded=\"true\"]", FI = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", II = "top", LI = 250, RI = 200, zI = 300, BI = 7, VI = null, HI = null, UI = null, WI = null, GI = null, KI = 0, qI = null, JI = 0, YI = 0, XI = !1, ZI = /* @__PURE__ */ new Set();
function QI(e) {
	ZI.add(e);
}
function $I(e = document) {
	if (XI) return;
	XI = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", eL, !0), t.addEventListener("pointerout", rL, !0), t.addEventListener("focusin", aL, !0), t.addEventListener("focusout", oL, !0), t.addEventListener("scroll", nL, !0), t.addEventListener("pointerdown", cL, !0), t.addEventListener("click", fL, !0), new uP({
		root: t,
		first: window,
		holds: uL,
		answer: dL
	}), window.addEventListener("keydown", sL, !0), window.addEventListener("blur", IL);
}
function eL(e) {
	if (tL(), mL(e.target)) {
		window.clearTimeout(JI);
		return;
	}
	let t = hL(e.target);
	t !== null && t !== HI && bL(t);
}
function tL() {
	HI === null || HI.isConnected || IL();
}
function nL(e) {
	if (tL(), HI === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(HI) || qF(HI) && IL();
}
function rL(e) {
	if (WI !== null || GI !== null) return;
	let t = e.relatedTarget, n = HI ?? qI?.target ?? null, r = n === null ? null : iL(n);
	t instanceof Node && (r !== null && r.contains(t) || mL(t)) || (mL(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && LL(!1);
}
function iL(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && gL(t) === e ? t : e;
}
function aL(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = hL(e.target);
	t !== null && (WI = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, xL(t));
}
function oL(e) {
	hL(e.target) === HI && IL();
}
function sL(e) {
	e.key !== "Escape" || HI === null || e.defaultPrevented || (mu(e) || e.preventDefault(), IL());
}
function cL(e) {
	if (mL(e.target)) return;
	let t = pL(e.target);
	if (t !== null) {
		if (GI === t) {
			LL(!0);
			return;
		}
		IL(), xL(t), GI = HI;
	} else WI === null && LL(!0);
}
var lL = `[${Ce}]`;
function uL(e) {
	let t = e.closest(lL) === null && !wu(e) ? hL(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function dL(e) {
	let t = hL(e);
	return t !== null && (IL(), xL(t), GI = HI, !0);
}
function fL(e) {
	pL(e.target) !== null && e.preventDefault();
}
function pL(e) {
	let t = hL(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(FI);
	return n === null || n.contains(t) ? t : null;
}
function mL(e) {
	return VI !== null && e instanceof Node && VI.contains(e);
}
function hL(e) {
	if (!(e instanceof Element)) return null;
	let t = gL(e);
	for (let n of ZI) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && yL(r).length > 0) return r;
	}
	return t;
}
function gL(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function _L(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + vL(e) : yL(e);
}
function vL(e) {
	let t = "";
	for (let n of ZI) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function yL(e) {
	for (let t of ZI) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function bL(e, t) {
	WI === null && GI === null && (window.clearTimeout(JI), qI !== null && qI.target === e ? qI.words = t : (window.clearTimeout(KI), qI = null, HI === null ? Date.now() - YI < zI ? xL(e, t) : (qI = {
		target: e,
		words: t
	}, KI = window.setTimeout(() => {
		let e = qI;
		qI = null, e !== null && xL(e.target, e.words);
	}, LI)) : (LL(!0), xL(e, t))));
}
function xL(e, t) {
	let n = (t ?? _L(e)).trim();
	if (n.length === 0 || !e.isConnected || !KF(e) || wL(e) || qF(e)) return;
	window.clearTimeout(KI), window.clearTimeout(JI), qI = null;
	let r = RL();
	jo(r, n, { staticFolds: !0 }), r.classList.toggle(NI, r.querySelector("a[href]") !== null), r.classList.add(MI), HI = e, EL(TL(e)), r.setAttribute("data-ui-tooltip-text", ko(n)), kL(r, e.getAttribute(Ve)), rh(e, r), ih(e, r, {
		placement: FL(e),
		gap: BI,
		arrow: !0
	}), CL();
}
var SL = null;
function CL() {
	typeof MutationObserver < "u" && (SL ??= new MutationObserver(tL), SL.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function wL(e) {
	return e.matches(PI) || e.querySelector(PI) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function TL(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function EL(e) {
	UI !== null && UI !== e && DL();
	let t = OL(e);
	t.includes(jI) || e.setAttribute("aria-describedby", [...t, jI].join(" ")), UI = e;
}
function DL() {
	if (UI === null) return;
	let e = OL(UI).filter((e) => e !== jI);
	e.length === 0 ? UI.removeAttribute("aria-describedby") : UI.setAttribute("aria-describedby", e.join(" ")), UI = null;
}
function OL(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function kL(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function AL(e, t, n) {
	let r = n?.plain === !0 ? Ao(t) : t;
	n?.delay === !0 && HI !== e ? bL(e, r) : xL(e, r);
}
function jL() {
	LL(!0);
}
var ML = {
	show: AL,
	hide: jL,
	escape: Ao
};
function NL(e) {
	WI = e, xL(e);
}
function PL(e) {
	HI === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? IL() : xL(e));
}
function FL(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of ZI) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && qm(t) ? t : II;
}
function IL() {
	WI = null, LL(!0);
}
function LL(e) {
	window.clearTimeout(KI), window.clearTimeout(JI), qI = null;
	let t = () => {
		HI !== null && (DL(), HI = null, GI = null, SL?.disconnect(), VI !== null && (VI.classList.remove(MI), gh(VI)), YI = Date.now());
	};
	e ? t() : JI = window.setTimeout(t, RI);
}
function RL() {
	return VI !== null && VI.isConnected || (VI = document.createElement("div"), VI.id = jI, VI.className = AI, VI.setAttribute("role", "tooltip"), VI.setAttribute("aria-hidden", "true"), document.body.append(VI)), VI;
}
//#endregion
//#region src/interactions/menu-engine.ts
var zL = "ui-orientation--horizontal", BL = `.${In} > .ui-menu__host > .ui-menu__item > .${S}`, VL = `${BL}, ${`.ui-menu[${ln}] > .ui-menu__host > .ui-menu__item > .${S}`}`, HL = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", UL = "[role='menuitem'], [role='menuitemcheckbox']", WL = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new eu();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, F), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), QI(JL), this.applyTabStops(this.root.querySelectorAll(`.${Nn}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) Jh(t) || YL(t, this.touched);
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
		for (let n of e) n.isConnected && t.add(tF(n));
		for (let e of t) {
			let t = eF(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && F(e));
			P(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && F(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(F) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Tu(e) || M(e) || !(e.target instanceof Element)) return;
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
		let r = tF(n), i = eF(r), a = uT(e);
		if (a !== null) {
			e.preventDefault(), Vu(i, CN(i, t, a));
			return;
		}
		let o = r.classList.contains(zL) || ZP(r) ? "horizontal" : "vertical";
		if (!N(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(F) ? qL(r) : null, c = s ?? Ru({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && P(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : XP(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Vu([], GL(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !rF(a) ? a : KL(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), rF(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && N(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && F(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Nn}`);
		if (n === null) return;
		let r = eF(n), i = uT(e);
		if (i !== null) {
			e.preventDefault(), Vu(r, CN(r, null, i));
			return;
		}
		let a = N(e) ? Ru({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(zL) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Vu(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && P(eF(tF(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${S}`) : null;
		if (t === null || t === document.activeElement || !t.matches(UL) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !F(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && dp(t);
	}
};
function GL(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Nn}`);
	return t === null ? null : eF(t).find(F) ?? null;
}
function KL(e) {
	let t = e.closest(`.${Nn}`), n = t === null ? null : nF(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function qL(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var JL = {
	anchor: (e) => e.closest(VL),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(HL), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(BL) && t.scrollWidth <= t.clientWidth ? null : Ao(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Nn}`);
		return t === null ? null : XP(t);
	}
};
function YL(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Nn}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var XL = "shortcut:", ZL = ":scope > .ui-menu-item__shortcut", QL = `[${Se}]`, $L = `[${Vn}]`, eR = ".ui-text__title", tR = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), QI(cR), aR(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!Xh(e)) {
				this.stale = !0;
				for (let t of e) iR(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Vn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Tu(e))) return;
		let t = ug(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Vl(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !F(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), rR(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Vl(t, e);
		let r = n ? DF() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = CF(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll($L)].filter((t) => {
			let n = Bl(t.getAttribute(Vn));
			return n !== null && Vl(n, e) && !k(t) && YN(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), rR(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll($L)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Bl(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(QL) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(tu(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = Bl(e);
			t !== null && this.entryShortcuts.set(tu(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Bl(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = tu(e.shortcut);
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
function nR(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(XL) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function rR(e) {
	Cu(e.target) && e.target.dispatchEvent(new Event(Px, { bubbles: !0 }));
}
function iR(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && oR(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && aR(t);
}
function aR(e) {
	e instanceof HTMLElement && e.matches($L) && oR(e);
	for (let t of e.querySelectorAll($L)) oR(t);
}
function oR(e) {
	let t = e.querySelector(ZL);
	if (t === null) return;
	let n = sR(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(gn, n.length > 0);
}
function sR(e) {
	let t = e.getAttribute(Vn), n = Bl(t);
	return n === null ? t?.trim() || null : Hl(n);
}
var cR = {
	anchor: (e) => {
		let t = e.closest($L);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(QL) !== null ? null : t;
	},
	words: (e) => {
		let t = sR(e), n = (e.getAttribute("aria-label") ?? e.querySelector(eR)?.textContent ?? "").trim();
		return t === null ? null : Ao(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = sR(e);
		return t === null ? null : Ao(`(${t})`);
	}
}, lR = 50, uR = 1, dR = 7;
function fR(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = hO(e, "data-ui-window-size") ?? 0;
	return {
		offset: hO(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : lR,
		total: hO(e, en),
		moreAfter: gO(e, nn)
	};
}
function pR(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function mR(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function hR(e, t) {
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
			let n = Number(t), r = mR(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === pR(e) ? null : (n - 1) * e.size;
		}
	}
}
function gR(e, t) {
	if (t <= dR) return vR(1, t);
	let n = Math.max(Math.min(e - uR, t - 2 - 2), 3), r = Math.min(Math.max(e + uR, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...vR(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function _R(e, t) {
	let n = gR(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function vR(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var yR = ".ui-pager", bR = "ui-pager__button", xR = "ui-pager__number", SR = "ui-pager__pages", CR = "ui-pager__gap", wR = "ui-pager__range", TR = "ui-pager__size", ER = "ui-pager__size--open", DR = "ui-pager__size-trigger", OR = "ui-pager__size-label", kR = "ui-pager__sizes", AR = "ui-pager__size-choice", jR = [
	bR,
	xR,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], MR = "ui.pager.page", NR = "ui.pager.range", PR = "ui.pager.rows", FR = "ui.pager.size", IR = [
	$t,
	en,
	nn,
	Qt,
	Zt
], LR = "page-size", RR = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new xP();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new g_({
		show: ({ owner: e }) => e.classList.add(ER),
		hide: ({ owner: e }) => e.classList.remove(ER),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), V(this.root, `${yR}, [${x}]`, {
			childList: !0,
			attributeFilter: IR,
			relevant: (e) => e.type === "attributes" || qR(e.target) || JR(e)
		}, (e) => this.syncFound(e)), O.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(yR)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(yR)) {
				t.add(r);
				continue;
			}
			let e = r.closest(C), i = e === null ? 0 : E(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(yR)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ht));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = KR(e);
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
		let i = fR(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = SD(e), l = (e) => CD(e, "N0", c);
		this.drawNumbers(e, o, c), BR(e, i, l), VR(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${bR}[${gt}]`)) Zc.setDisabled(t, hR(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		UR(e);
	}
	shownState(e, t = fR(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${SR}`);
		if (r === null) return;
		let i = pR(t), a = mR(t), o = a === null ? _R(i, t.moreAfter) : gR(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => zR(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(yR);
		if (t === null || k(e.target)) return;
		let n = e.target.closest(`.${AR}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(_t)));
			return;
		}
		let r = e.target.closest(`.${DR}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${gt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = hR(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), Ku(e).top > 0 && qu(e, 0);
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
		for (let t of this.root.querySelectorAll(yR)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(yR);
		if (t === null) return;
		let n = e.target.closest(`.${TR}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${bR}, .${DR}`), i = HR(t);
		if (r === null || !i.includes(r) || !N(e)) return;
		let a = Ru({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Vu(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${DR}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && xN(e, GR(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${AR}`) : null, n = t?.closest(`.${TR}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && wN(t, GR(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${TR}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${kR}`);
		if (r === null) return;
		let i = GR(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		bN(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, LR), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!WR(e, i)) {
			this.store.write(t, LR, null);
			return;
		}
		let a = fR(n);
		i !== a.size && (n.setAttribute(Qt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${TR}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = fR(r.host);
		t !== i.size && (this.store.write(r.component, LR, String(t)), r.host.setAttribute(Qt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !N(e) || !(e.target instanceof Element)) return;
		let t = qd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || k(t.root)) return;
		let n = KR(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = hR(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Fd(e), i = Qd(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = Fd(e);
		o.length > 0 && nf(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function zR(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = CR, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = CD(e, "N0", n);
	return r.className = jR.join(" "), r.setAttribute("type", "button"), r.setAttribute(gt, String(e)), r.textContent = i, O.write(r, "aria-label", MR, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function BR(e, t, n) {
	let r = e.querySelector(`:scope > .${wR}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? O.write(r, null, PR, {
		from: i,
		to: a
	}) : O.write(r, null, NR, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function VR(e, t, n) {
	let r = e.querySelector(`:scope > .${TR}`), i = r?.querySelector(`.${OR}`) ?? null;
	if (r !== null && i !== null) {
		O.write(i, null, FR, { size: n(t.size) });
		for (let e of GR(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function HR(e) {
	return [...e.querySelectorAll(`.${bR}, .${DR}`)];
}
function UR(e) {
	let t = HR(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	P(t, n ?? r.find(F) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function WR(e, t) {
	let n = e.querySelector(`:scope > .${TR}`);
	return n !== null && GR(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function GR(e) {
	return [...e.querySelectorAll(`:scope > .${kR} > .${AR}`)];
}
function KR(e) {
	for (let t of e.querySelectorAll(`[${x}][${Wt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function qR(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function JR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(yR) || t.querySelector(yR) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var YR = `.${Nn}[${vn}]`, XR = ":scope > .ui-collapsible__bar", ZR = ":scope > .ui-menu__host", QR = "ui-menu__item", $R = `:scope > .${S}`, ez = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", tz = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), V(t, YR, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = nz(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(ZR);
		if (n === null) return;
		let r = Dg(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: rz(n)
		}), e.setAttribute(yn, ""), sT(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of iz(e)) {
			let e = az(a);
			if (e === "header") {
				n !== null && sz(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			sz(a, o), r ||= o, i ||= o;
		}
		return n !== null && sz(n, r), i;
	}
	match(e, t) {
		let n = kg(oz(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(ez) : null;
		if (r === null) return n;
		if (n) return cz(r), e.removeAttribute(fn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(fn, i), i;
	}
	clear(e, t) {
		cz(t), e.removeAttribute(yn), iz(t).length > 0 && sT(e, t, !1);
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
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !N(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = nz(e.target), n = t === null ? void 0 : eF(t).find(F);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function nz(e) {
	let t = e.closest(YR), n = t?.querySelector(XR) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function rz(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${un}][${fn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function iz(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(QR));
}
function az(e) {
	return e.querySelector($R)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function oz(e) {
	let t = e.querySelector($R);
	return t === null ? "" : Og(Mg(t), e);
}
function sz(e, t) {
	e.toggleAttribute(bn, !t);
}
function cz(e) {
	for (let t of e.querySelectorAll(`[${bn}]`)) t.removeAttribute(bn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var lz = 120;
function uz(e) {
	return e.typing && e.tallest - e.height > lz;
}
var dz = class {
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
		let t = uz({
			height: e.height,
			tallest: this.tallest,
			typing: wu(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Jr, t);
	}
}, fz = "[data-ui-root]", pz = "a[href]", mz = "ui-collapsible", hz = "ui-collapsible__bar", gz = "right-side", _z = "ui-side--left", vz = "ui-side--right", yz = "pinned", bz = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new xP();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of dP) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(fz)) Dz(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xn}]`);
		if (t !== null) {
			let e = t.closest(fz), n = t.getAttribute(xn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${En}]`);
		if (n !== null) {
			let e = n.closest(fz), t = n.getAttribute(En);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(Dn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Hn}]`);
		if (r !== null && !e.defaultPrevented && wz(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${pz}, .${S}`), a = i?.closest(`[${jn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && Tz(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || mu(e) || bg()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && _p(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${fz}[${Sn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = Oz(t, n);
			r !== null && !dg(r) && e.push({
				shell: t,
				drawer: r,
				modal: Ez(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${fz}[${Sn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = Oz(e, t), r = this.openers.get(e);
			n === null || !mP(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = Oz(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && mP(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Sn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, Ez(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, ip(), performance.now() + B.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(wi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", O.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = xz(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", O.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(hz) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(Cn), i.removeAttribute(wn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(Cn, ""), i.setAttribute(wn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = Cz(r.left - e.offsetLeft, e.clientWidth - a.width), c = Cz(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Cp(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = Oz(e, t);
		if (i === null || _P(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(Dn(t), n), Dz(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && z(n);
		}
		let o = i.querySelector(`[${qe}]`);
		o !== null && this.store.write(o, yz, n ? "true" : null, n ? {
			root: !0,
			attributes: { [Dn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${fz}[${Sn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Sn);
		if (e.removeAttribute(Sn), this.markToggles(e), n === null) return;
		let r = Oz(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Mp(t, r) : t !== null && z(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${xn}="${Gi(t)}"]`)];
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
function xz(e) {
	for (let t of e.querySelectorAll(`[${Hn}]`)) if (wz(t) && t.checkVisibility() && Sz(t.closest(`.${mz}`), e)) return t;
	return null;
}
function Sz(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function Cz(e, t) {
	return Math.max(0, Math.min(e, t));
}
function wz(e) {
	let t = e.closest(`.${mz}`), n = t?.closest(`[${jn}]`), r = n?.getAttribute(jn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(fz) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === gz ? vz : _z);
}
function Tz(e) {
	return !e.classList.contains("ui-menu-item") || $P(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function Ez(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function Dz(e) {
	for (let t of e.querySelectorAll(`[${En}]`)) {
		let n = String(e.hasAttribute(Dn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function Oz(e, t) {
	return e.querySelector(`:scope > [${jn}="${Gi(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var kz = "ui-collapsible", Az = "ui-collapsible__content", jz = "ui-collapsible__bar", Mz = "ui-collapsible__bar-content", Nz = "collapsed", Pz = class {
	root;
	store = new xP();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${kz}`)), V(this.root, `.${kz}`, {
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
		let t = this.store.read(e, Nz);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Hn}]`), n = t?.closest(`.${kz}`) ?? null;
		if (t === null || n === null || wz(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(ln), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = Iz(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Nz, r ? "true" : "false", r ? { attributes: { [ln]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(ln, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${Az}`),
			bar: e.querySelector(`:scope > .${jz} > .${Mz}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Hn}], :scope > .${jz} > [${Hn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Pm()) return;
		let i = Rz(Fz(e), n, Iz(e, t), r);
		if (i === null) return;
		e.setAttribute(Un, ""), e.offsetWidth;
		let a = {
			duration: B.normal,
			easing: B.ease
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
function Fz(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Iz(e, t) {
	let n = Fz(e), r = Lz(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function Lz(e) {
	return e === "width" ? "height" : "width";
}
function Rz(e, t, n, r) {
	let i = Lz(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function zz(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var Bz = "ui-grid-splitter", Vz = "ui-container", Hz = "ui-orientation--vertical", Uz = 16, Wz = {
	sliver: 0,
	passFloors: !0
}, Gz = {
	sliver: 48,
	passFloors: !0
}, Kz = {
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
}, qz = {
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
}, Jz = class {
	root;
	store = new xP();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ng({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Bz}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, Wz) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${Bz}`)), V(this.root, `.${Bz}`, { childList: !0 }, (e) => this.prepareEach(e)), V(this.root, `.${Bz}`, { attributeFilter: [qn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Zz(t);
			e !== null && (this.restore(e, Qz(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Lm) {
			let i = r[n], a = Hm(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = aB(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && eB(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Sl(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, zz(e, () => {
			!e.isConnected || aB(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) aB(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Vm();
		for (let t of this.root.querySelectorAll(`.${Bz}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		let t = e.target.closest(`.${Bz}`);
		if (t === null || this.drag.active || k(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = sB(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Qc(r, i) * iB(e.key, n.axis);
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
		let n = Zz(e);
		if (n === null) return;
		let r = Qz(e);
		for (let e of Lm) n.style.removeProperty(Hm(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(qn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = oB(xl(tB(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(qn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Bz}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : El(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, Wz);
	}
	putBack(e, t) {
		let n = Hm(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = Gz) {
		let r = dl(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(Hm(e.axis.split, e.tier), rl(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Lm) {
			let a = Hm(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Zz(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Qz(e), r = Vm(), i = $z(t, n, r), a = i === null ? null : $c(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = sl(a, ol(t.getAttribute(n.limits))), s = tB(t, n), c = nB(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = cl(c, rB(t, n).map((e) => nB(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(Hm(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = Zz(e);
		if (n === null) return;
		let r = Qz(e), i = nB(e, r), a = tB(n, r), o = rB(n, r).map((e) => nB(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : cl(i, o, a.length);
		s !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(bl(a, s))), w(e, Qr, Yz(a, s.before) ? "before" : Yz(a, s.after) ? "after" : null), Xz(n, t === void 0 ? null : {
			axis: r,
			tracks: Dl(t, a, s, 48)
		}));
	}
};
function Yz(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function Xz(e, t) {
	let n = [Kz, qz].filter((t) => rB(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: tB(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(Bz) ? Qz(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && kl(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Zr, a);
	}
}
function Zz(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(Vz) ? t : null;
}
function Qz(e) {
	return e.classList.contains(Hz) ? Kz : qz;
}
function $z(e, t, n) {
	let r = eB(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function eB(e, t, n) {
	return Gm(n, (n) => e.style.getPropertyValue(Hm(t.split, n)).trim() || void 0);
}
function tB(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function nB(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function rB(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(Bz) && Qz(r) === t && n.push(r);
	return n;
}
function iB(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function aB(e) {
	return Cl(e.getAttribute(qn));
}
function oB(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function sB(e) {
	let t = Number(e.getAttribute(Kn));
	return Number.isFinite(t) && t > 0 ? t : Uz;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var cB = "ui-pane-container", lB = "ui-pane-container__place", uB = "ui-pane-container__pane", dB = "ui-pane-container__grip", fB = "data-ui-pane-lifted", pB = "data-ui-pane-target", mB = "data-ui-pane-moving", hB = "data-ui-pane-near", gB = "data-ui-pane-raised", _B = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", vB = "panes", yB = ",", bB = 32, xB = class {
	root;
	store = new xP();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	raised = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ng({
			root: this.root,
			resolveHandle: (e) => CB(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.handleScroll(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${cB}`), !1), V(this.root, `.${cB}`, {
			childList: !0,
			attributeFilter: [Jn],
			relevant: OB
		}, (e) => this.arrangeEach(kB(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of AB(n)) {
					let t = e.querySelector(`:scope > .${uB} > .${dB}`);
					t !== null && TB(t);
				}
			}
			n.hasAttribute(mB) || PB(n, MB(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, vB);
		t !== null && e.setAttribute(Jn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || jB(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		n.setAttribute(fB, ""), i.setAttribute(mB, "");
		let a = {
			container: i,
			grip: e,
			pane: n,
			origin: r,
			start: t,
			target: null
		};
		return this.raise(a), a;
	}
	dropStaleHold() {
		let e = this.held;
		e === null || e.pane.isConnected || (this.held = null, this.settle(e));
	}
	raise(e) {
		let { pane: t, origin: n } = e;
		if (typeof t.showPopover != "function") return;
		let r = n.getBoundingClientRect();
		n.style.minWidth = `${r.width}px`, n.style.minHeight = `${r.height}px`, t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, t.style.width = `${r.width}px`, t.style.height = `${r.height}px`, t.setAttribute("popover", "manual"), t.setAttribute(gB, ""), t.showPopover(), this.raised = e;
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, ZB(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(pB), t?.setAttribute(pB, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${uB}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), FB(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), IB(e.pane), e.container.isConnected && PB(e.container, MB(e.container), !0);
	}
	settle(e) {
		this.lower(e), e.target?.removeAttribute(pB), e.pane.removeAttribute(fB), e.container.removeAttribute(mB), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Ti);
	}
	lower(e) {
		let { pane: t, origin: n } = e;
		if (this.raised === e && (this.raised = null), t.hasAttribute(gB)) {
			t.matches(":popover-open") && t.hidePopover(), t.removeAttribute("popover"), t.removeAttribute(gB);
			for (let e of [
				"left",
				"top",
				"width",
				"height"
			]) t.style[e] = "";
			n.style.minWidth = "", n.style.minHeight = "";
		}
	}
	keep(e) {
		let t = NB(e);
		e.setAttribute(Jn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, vB, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		this.dropStaleHold();
		let t = CB(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = SB[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = QB(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && Tk({
				key: "ui.pane.target",
				args: DB(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) Tk({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = DB(n.container, r);
				Dk(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), Tk({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Ti, ""), Tk({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? CB(e.target) : null;
		t !== null && TB(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? wB(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < bB ? t : null);
	}
	handleScroll() {
		this.forgetNearTop();
		let e = this.raised;
		if (e === null) return;
		let t = e.origin.getBoundingClientRect();
		e.pane.style.left = `${t.left}px`, e.pane.style.top = `${t.top}px`;
	}
	forgetNearTop() {
		this.nearTop = null;
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(hB), e?.setAttribute(hB, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, SB = {
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
function CB(e) {
	let t = e.closest(`.${dB}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(cB) === !0 ? t : null;
}
function wB(e) {
	let t = e.closest(`.${uB}`);
	return t?.parentElement?.parentElement?.classList.contains(cB) === !0 ? t : null;
}
function TB(e) {
	let t = e.parentElement, n = t === null ? null : EB(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== O.translate(r, i) && O.write(e, "aria-label", r, i);
}
function EB(e) {
	for (let t of e.querySelectorAll(_B)) {
		let n = wB(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function DB(e, t) {
	let n = jB(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function OB(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(cB);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(cB) || t.querySelector(`.${cB}`) !== null)) return !0;
	return !1;
}
function kB(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${cB}`)) t.add(e);
	}
	return t;
}
function AB(e) {
	return Array.from(e.querySelectorAll(`:scope > .${lB}`));
}
function jB(e) {
	return AB(e).filter((e) => e.getClientRects().length > 0);
}
function MB(e) {
	return e.getAttribute(Jn);
}
function NB(e) {
	return AB(e).map((e) => e.querySelector(`:scope > .${uB}`)?.getAttribute("data-ui-pane") ?? "").join(yB);
}
function PB(e, t, n) {
	let r = AB(e), i = RB(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${uB}`), n = t?.getAttribute(Yn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && FB(e, o, n);
}
function FB(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (qB(e), !n || Pm()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? LB(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: B.normal + 60,
			easing: B.ease
		});
	}
}
function IB(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Pm() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease
	});
}
function LB(e, t) {
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
function RB(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(yB).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function zB(e, t, n, r, i, a, o) {
	let s = e.map((e) => BB(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? VB(e, t, s, r, !0) : null,
		rowOrder: o ? VB(e, t, s, i, !1) : null
	};
}
function BB(e, t) {
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
function VB(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && GB(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => WB(a[e], i).start - WB(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && WB(a[u[s]], i).start === KB(a[u[s - 1]], i) || (s - d > 1 && (c = HB(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function HB(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = WB(i[e[0]], s).start, p = KB(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || UB(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = WB(i[l[t]], s);
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
function UB(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = WB(t, n).start, s = KB(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function WB(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function GB(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function KB(e, t) {
	let { start: n, span: r } = WB(e, t);
	return n + r;
}
function qB(e) {
	let t = YB(e.getAttribute(Xn)), n = YB(e.getAttribute(Zn));
	if (t === null && n === null) return;
	let r = AB(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${uB}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: YB(e.getAttribute("data-ui-pane-cells"), XB) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${uB}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	Lm.forEach((e, i) => {
		let l = zB(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(Hm("--ui-placement-column", e), String(r.column)), t.style.setProperty(Hm("--ui-placement-row", e), String(r.row)), t.style.setProperty(Hm("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(Hm("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), JB(e, "--ui-pane-columns", t, s), JB(e, "--ui-pane-rows", n, c);
}
function JB(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	Lm.forEach((a, o) => {
		i ? e.style.setProperty(Hm(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(Hm(t, a));
	});
}
function YB(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function XB(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function ZB(e, t, n) {
	for (let r of jB(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function QB(e, t, n, r) {
	let i = jB(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = eV($B(a), i.map((e) => e.place === t || e.place === n ? null : $B(e.box)), r);
	return o === null ? null : i[o].place;
}
function $B(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function eV(e, t, n) {
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
var tV = "ui-split-button", nV = "ui-split-button__main", rV = "ui-split-button__toggle", iV = "ui-split-button__menu", aV = "ui-split-button--open", oV = class {
	root;
	menus = new g_({
		show: ({ owner: e }) => e.classList.add(aV),
		hide: ({ owner: e }) => e.classList.remove(aV),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = sV(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${nV}`)?.closest(`.${tV}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !N(e)) return;
		let t = sV(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = cV(t), r = e.target.closest(`.${S}`);
		n !== null && r !== null && n.contains(r) && $P(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = cV(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: qm(i) ? i : "bottom-end" },
			openers: lV(e)
		}) && Dp(r, eF(r), t);
	}
};
function sV(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${rV}, .${nV}`), n = t?.closest(`.${tV}`) ?? null;
	return t === null || n === null || t.classList.contains(nV) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function cV(e) {
	return e.querySelector(`:scope > .${iV}`);
}
function lV(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var uV = "ui-button-group", dV = "ui-button-group__item", fV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${uV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), V(this.root, `.${uV}`, {
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
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = pV(i);
			i.toggleAttribute(ii, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		P(n, r ?? n.find(F) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dV}`), n = t?.closest(`.${uV}`) ?? null;
		if (t === null || n === null || t.closest(`.${uV}`) !== n || k(n)) return;
		let r = pV(t);
		r !== null && k(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dV} > .${ki}`), n = t?.closest(`.${uV}`) ?? null;
		if (t === null || n === null || !N(e)) return;
		let r = this.ownItems(n).map(pV).filter((e) => e !== null), i = Ru({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${dV}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		cd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ai,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return od(e, `.${dV}`, `.${uV}`);
	}
};
function pV(e) {
	return e.querySelector(`:scope > .${ki}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var mV = "ui-accordion", hV = "details", gV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${mV}`)), V(this.root, `.${mV}`, {
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
		if (t !== null && t.classList.contains(mV)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${hV}`)];
	}
}, _V = "ui-tab-overflow", vV = "ui-tab-overflow__menu", yV = "ui-tab-overflow__menu--open", bV = "ui-tab-overflow__entry", xV = "ui-tab-overflow__entry--current", SV = class {
	options;
	list;
	fittedWidths = /* @__PURE__ */ new WeakMap();
	wraps = /* @__PURE__ */ new WeakMap();
	spacings = /* @__PURE__ */ new WeakMap();
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
		for (let n of e) n.target instanceof HTMLElement && (this.wraps.get(n.target) !== this.options.wraps(n.target) || this.spacingChanged(n.target)) && t.add(n.target);
		for (let e of t) this.options.refit(e);
	}) : null;
	constructor(e) {
		this.options = e, this.list = new EV(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class", "style"] });
		let n = this.options.wraps(e), r = t.captions[0]?.parentElement ?? null;
		if (this.wraps.set(e, n), this.spacings.set(e, {
			host: r,
			spacing: CV(r)
		}), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let i = () => e.classList.add(this.options.overflowingClass), a = this.options.trailing === !0 ? this.fitTrailing(t, i) : wV({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: i
		});
		e.classList.toggle(this.options.overflowingClass, a), a || this.closeListOf(e);
	}
	spacingChanged(e) {
		let t = this.spacings.get(e);
		return t !== void 0 && CV(t.host) !== t.spacing;
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return TV(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function CV(e) {
	return e === null ? "" : getComputedStyle(e).columnGap ?? "";
}
function wV(e) {
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
function TV(e, t, n) {
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
var EV = class {
	menu;
	button = null;
	list = new g_({
		show: ({ popup: e }) => e.classList.add(yV),
		hide: ({ popup: e }) => {
			e.classList.remove(yV), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = vV, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(DV)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${xV}`);
		this.button = e, rh(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		bN(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bV}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || k(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || xN(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${bV}`) : null;
		t !== null && wN(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${bV}`));
	}
};
function DV(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${bV} ${Mi}`, t.classList.toggle(xV, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(_i), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var OV = "data-ui-caption-text", kV = ".ui-text__title";
function AV(e) {
	for (let t of e.querySelectorAll(kV)) {
		let e = t.textContent ?? "";
		t.getAttribute(OV) !== e && t.setAttribute(OV, e);
	}
}
function jV(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Pm()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease,
		pseudoElement: "::after"
	});
}
function MV(e) {
	if (!(e === null || Pm())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: B.fast,
		easing: B.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var NV = "ui-tabs", PV = "ui-tab-caption", FV = "ui-tab-caption--selected", IV = "ui-tab-caption--overflowed", LV = "ui-tabs--overflowing", RV = "ui-tabs--no-overflow", zV = "ui-tabs__strip", BV = "ui-tabs__band", VV = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new SV({
			rootClass: NV,
			overflowingClass: LV,
			wraps: (e) => e.classList.contains(RV),
			hiddenClass: IV,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${NV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), V(this.root, `.${NV}`, {
			childList: !0,
			attributeFilter: [ci, ...mi],
			relevant: (e) => !tg(e, `[${di}]`, `.${NV}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(HV), i = ld(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(FV)) ?? null, o = null;
		for (let n of od(e, `[${fi}]`, `.${NV}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(FV, n), e.setAttribute("aria-selected", n ? "true" : "false"), AV(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), jV(a, o), P(n.filter((e) => !e.classList.contains(IV)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && MV(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${zV}, :scope > .${BV} > .${zV}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(HV).map((e) => {
				let n = e.getAttribute("data-ui-tab-key") ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: k(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_V}`), n = t?.closest(`.${NV}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${NV}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${PV}`);
		if (r === null || k(r)) return;
		let i = r.closest(`.${NV}`), a = r.getAttribute(ui);
		i !== null && a !== null && r.closest(`.${NV}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Tu(e) || !N(e)) return;
		let t = e.target.closest(`.${PV}`), n = t?.closest(`.${NV}`) ?? null;
		if (t === null || n === null) return;
		let r = Ru({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		cd(e, t, {
			attribute: ci,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return od(e, `.${PV}`, `.${NV}`);
	}
	ownPages(e) {
		return od(e, `[${di}]`, `.${NV}`);
	}
};
function HV(e) {
	return e.classList.contains(IV) || KF(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function UV(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function WV(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function GV(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var KV = "ui-command-bar", qV = "ui-command-bar__host", JV = "ui-command-bar__item", YV = "ui-command-bar__overflow", XV = "ui-command-bar--overflowing", ZV = "ui-command-bar__overflowed", QV = "ui-orientation--vertical", $V = "ui-text__title", eH = `${Vf}, [${Fe}]`, tH = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new SV({
			rootClass: KV,
			overflowingClass: XV,
			wraps: (e) => !oH(e),
			hiddenClass: ZV,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${KV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), V(this.root, `.${KV}`, {
			childList: !0,
			addedOnly: !0,
			relevant: nH
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = rH(e), n = e.querySelector(`:scope > .${YV}`);
		if (t === null || n === null) return;
		let r = sH(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(XV) && cH(r);
		for (let e of r) th(e, e.classList.contains(ZV) ? n : null);
		e.classList.contains(QV) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), iH(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${YV}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(KV) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !N(e) || Tu(e)) return;
		let t = e.target.closest(`.${KV}`), n = t === null ? [] : aH(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Ru({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(QV) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), iH(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${KV}`) ?? null;
		t !== null && n !== null && aH(n).includes(t) && iH(n, t);
	}
	entriesOf(e) {
		let t = rH(e), n = t === null ? [] : sH(t).filter((e) => e.classList.contains(JV) && e.classList.contains(ZV)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: lH(e),
			current: !1,
			disabled: k(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !k(n) && uH(n).click();
	}
};
function nH(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(KV) || t.classList.contains(qV) || t.classList.contains(JV))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(KV) || t.querySelector(`.${KV}`) !== null)) return !0;
	return !1;
}
function rH(e) {
	return e.querySelector(`:scope > .${qV}`);
}
function iH(e, t) {
	let n = aH(e), r = n.find((e) => e.tabIndex >= 0 && F(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(F) ?? null;
	for (let e of n) e === i ? WV(e) : UV(e);
}
function aH(e) {
	let t = rH(e), n = [];
	for (let e of t === null ? [] : sH(t)) if (e.classList.contains(JV) && !e.classList.contains(ZV)) for (let t of e.querySelectorAll(eH)) GV(t) && Iu(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${YV}`);
	return r !== null && e.classList.contains(XV) && n.push(r), n;
}
function oH(e) {
	let t = rH(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function sH(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(JV) ? n.querySelector(C) : null;
		e !== null && KF(e) && t.push(n);
	}
	return t;
}
function cH(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(JV) ? t ||= !r.classList.contains(ZV) : t || r.classList.add(ZV);
	}
}
function lH(e) {
	let t = uH(e), n = t.querySelector(`.${$V}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function uH(e) {
	return e.matches(Vf) ? e : e.querySelector(Vf) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var dH = "ui-breadcrumbs", fH = "ui-breadcrumbs__item", pH = "ui-breadcrumb", mH = "ui-breadcrumb--current", hH = "ui-hidden", gH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), V(this.root, `.${dH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ...mi]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${dH}`)) this.apply(e);
	}
	apply(e) {
		let t = od(e, `.${fH}`, `.${dH}`);
		_H(t);
		let n = t.filter((e) => !e.classList.contains(hH)).map((e) => e.querySelector(`.${pH}`)).filter((e) => e !== null && !e.classList.contains(hH)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(mH, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function _H(e) {
	let t = Lm.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Lm.map((e, t) => vH(r, t));
		if (yH(r, Ar, Lm.filter((e, t) => i[t])), yH(r, jr, Lm.filter((e, n) => !t[n])), !r.classList.contains(hH)) for (let e = 0; e < Lm.length; e++) t[e] ||= !i[e];
	}
}
function vH(e, t) {
	for (let n of e.children) if (n.getAttribute(mi[t]) === "collapsed") return !0;
	return !1;
}
function yH(e, t, n) {
	let r = n.join(" ");
	w(e, t, r.length === 0 ? null : r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var bH = "ui-color-input", xH = "ui-color-input--open", SH = "ui-color-input__popup", CH = "ui-color-input__text", wH = "ui-color-input__row", TH = "ui-color-input__swatch--button", EH = "ui-color-input__value-input", DH = "ui-color-input__square-thumb", OH = "ui-color-input__hue-thumb", kH = "data-ui-color-toggle", AH = "data-ui-color-tab", jH = "data-ui-color-tab-selected", MH = "data-ui-color-pane", NH = "data-ui-color-pane-selected", PH = "data-ui-color-square", FH = "data-ui-color-hue", IH = "data-ui-color-hex", LH = "data-ui-color-channel", RH = "data-ui-color-factor", zH = "data-ui-color-opacity", BH = "data-ui-color-name", VH = "data-ui-color-name-selected", HH = "data-ui-color-format", UH = "data-ui-color-variant", WH = "data-ui-color-no-picker", GH = "data-ui-color-no-palette", KH = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new g_({
		show: ({ owner: e }) => e.classList.add(xH),
		hide: ({ owner: e }) => e.classList.remove(xH)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${bH}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ia(e.components, `.${bH}`));
		}), V(this.root, `.${bH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				HH,
				UH,
				WH,
				GH
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Ng({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${PH}], [${FH}]`),
			begin: (e, t) => {
				let n = e.closest(`.${bH}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(PH) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${EH}`)?.value ?? null
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
		let t = ZH(e), n = this.states.get(e), r = n?.paneChosen === !0 ? qH(e, n.pane) : JH(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? YH(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = aU(t);
			if (i === null) return n ?? YH(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && XH(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = cU(a, o, s);
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
			...n ?? YH(r),
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
			let [e, a, o] = cU(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), tU(e, "--ui-color-input-color", t.held ? sU(n, r, i, t.opacity) : "transparent"), tU(e, "--ui-color-input-solid", sU(n, r, i, 255)), tU(e, "--ui-color-input-on-color", t.held ? jS(n, r, i, t.opacity) : "inherit"), eU(e, t.held ? $H(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${PH}]`), o = e.querySelector(`[${FH}]`), [s, c, l] = lU(t.hue, 1, 1);
		if (tU(e, "--ui-color-input-hue", sU(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${DH}`);
			e !== null && (tU(e, "left", `${t.saturation * 100}%`), tU(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${OH}`);
			e !== null && tU(e, "top", `${t.hue / 360 * 100}%`);
		}
		nU(e, `[${IH}]`, oU(n, r, i)), nU(e, `[${LH}="r"]`, String(n)), nU(e, `[${LH}="g"]`, String(r)), nU(e, `[${LH}="b"]`, String(i)), tU(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), rU(e, `[${zH}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${BH}]`)) n.getAttribute(BH) === t.name ? n.setAttribute(VH, "") : n.removeAttribute(VH);
		let n = t.name === null ? null : e.querySelector(`[${BH}="${Gi(t.name)}"]`), r = n === null ? null : aU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		tU(e, "--ui-color-input-base", r === null ? "transparent" : sU(r[0], r[1], r[2], 255)), rU(e, `[${RH}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${MH}]`)) n.getAttribute(MH) === t.pane ? n.setAttribute(NH, "") : n.removeAttribute(NH);
		for (let n of e.querySelectorAll(`[${AH}]`)) n.getAttribute(AH) === t.pane ? n.setAttribute(jH, "") : n.removeAttribute(jH);
	}
	resolveRgb(e, t) {
		if (t.name === null) return lU(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${BH}="${Gi(t.name)}"]`), r = n === null ? null : aU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? lU(t.hue, t.saturation, t.value) : iU([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${kH}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${bH}`));
			return;
		}
		let n = e.target.closest(`[${AH}]`), r = e.target.closest(`.${bH}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(AH), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${BH}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(BH)
			}));
			return;
		}
		let a = r.querySelector(`.${SH}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${bH}`);
		t !== null && (e.target.hasAttribute(RH) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(zH) && this.commit(t, (t) => ({
			...t,
			opacity: kS(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${bH}`);
		if (n === null) return;
		if (t.hasAttribute(RH) || t.hasAttribute(zH)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(IH)) {
			let e = aU(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = cU(e[0], e[1], e[2]);
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
		let r = t.getAttribute(LH);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = kS(Number(t.value));
		let [l, u, d] = cU(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${EH}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = uU((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = uU((t.x - a.left) / a.width), s = 1 - uU((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || j(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${EH}`);
		a !== null && (a.value = QH(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		j(e) || e.querySelector(`.${EH}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(WH) && e.hasAttribute(GH)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${SH}`);
		if (t === null) return;
		let n = e.getAttribute(UH) === "swatch", r = n ? e.querySelector(`.${TH}`) : e.querySelector(`.${wH}`), i = n ? r : r?.querySelector(`[${kH}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${jH}]`) ?? !0
		});
	}
};
function qH(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? WH : GH))(t) ? t : t === "picker" ? "palette" : "picker";
}
function JH(e) {
	return qH(e, "picker");
}
function YH(e) {
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
function XH(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function ZH(e) {
	return e.querySelector(`.${EH}`)?.value.trim() ?? "";
}
function QH(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = oU(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${AS(e.opacity)}`;
}
function $H(e, t, n, r, i) {
	if (e.getAttribute(HH) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = oU(t, n, r);
	return i === 255 ? a : `${a}${AS(i)}`;
}
function eU(e, t) {
	for (let n of e.querySelectorAll(`.${CH}`)) n.textContent !== t && (n.textContent = t);
}
function tU(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function nU(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function rU(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function iU(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		kS(e[0] * (1 - n)),
		kS(e[1] * (1 - n)),
		kS(e[2] * (1 - n))
	] : [
		kS(e[0] + (255 - e[0]) * n),
		kS(e[1] + (255 - e[1]) * n),
		kS(e[2] + (255 - e[2]) * n)
	];
}
function aU(e) {
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
function oU(e, t, n) {
	return `#${AS(e)}${AS(t)}${AS(n)}`;
}
function sU(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function cU(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function lU(e, t, n) {
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
		kS((o + a) * 255),
		kS((s + a) * 255),
		kS((c + a) * 255)
	];
}
function uU(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var dU = `:is(.ui-surface, .ui-card, .${wt})[${y}]`, fU = "ui-surface--clickable", pU = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new eu();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), vU(t, ["hover", "press"], (e) => _U(e.closest(ju))), V(t, dU, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(dU));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(dU) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		e.classList.contains(fU) ? (this.pressable.add(e), w(e, "role", gU(e) ? "group" : "button"), w(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : hU(e) ? "-1" : "0")) : this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	handleKeyDown(e) {
		let t = mU(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function mU(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(fU) && t.hasAttribute("tabindex") ? t : null;
}
function hU(e) {
	let t = e.closest(dd);
	return t !== null && t.closest(I)?.matches(".ui-items-view, .ui-table") === !0 && Nu(t) === e;
}
function gU(e) {
	for (let t of e.querySelectorAll(ju)) if (Iu(e, t)) return !0;
	return !1;
}
function _U(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${fU}`) ?? null; n !== null; n = n.parentElement?.closest(`.${fU}`) ?? null) t.push(n);
	return t;
}
function vU(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || yU(t, e, !1);
		for (let t of a) yU(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function yU(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), w(e, ni, r.length === 0 ? null : r.sort().join(" "));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var bU = "ui-table", xU = "ui-table--reorderable", SU = "ui-scroll-x--auto", CU = "ui-scroll-x--always", wU = `:scope > .${rr}`, TU = `.${ar}`, EU = "ui-table__header-cell", DU = `${EU}--pinned`, OU = `${wU} > .${ir} > .${EU}`, kU = `${OU}--pinned`, AU = "ui-table__host", jU = `${wU} > .${AU}`, MU = `.${bU}, .${nr}, [${Qn}]`, NU = "--ui-table-columns", PU = "--ui-table-sticky-top", FU = "--ui-table-sticky-bottom", IU = "--ui-table-sized-columns", LU = "--ui-table-pin-", RU = 64, zU = "data-ui-table-cell-hidden", BU = "data-ui-table-cell-last", VU = "columns", HU = "hidden", UU = "order", WU = "layout", GU = 32, KU = 16, qU = class {
	root;
	store = new xP();
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
		if (this.root = e.root ?? document, this.drag = new Ng({
			root: this.root,
			resolveHandle: (e) => e.closest(TU),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new Ng({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), vU(this.root, ["hover", "press"], (e) => {
			let t = e.closest(TU)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Lm) e !== "base" && matchMedia(zm(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${bU}`)), V(this.root, `.${bU}`, {
			childList: !0,
			relevant: QU
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), V(this.root, `.${bU}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(bU)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), V(this.root, `.${bU}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: $U
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(jU);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), zz(t, () => this.pin(t));
			let e = t.querySelector(wU);
			e !== null && zz(e, () => JU(t, e));
			let n = t.querySelector(jU);
			n !== null && (this.markScrollbar(t, n), zz(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, VU), r = n === null ? null : $c(n);
		r !== null && r.length !== t.length ? (this.store.write(e, VU, null), this.store.writeBoot(e, WU, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, UU);
		i !== null && !tW(i, t) ? (this.store.write(e, UU, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(gr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${bU}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = eW(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(SU) || e.classList.contains(CU);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(IU);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Ol(t, n);
				e.style.setProperty(IU, rl(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Id}${t}`, String(r[t])) : e.style.removeProperty(`${Id}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		w(e, tr, c.length === 0 ? null : c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(dr) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(dr, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(xU)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= RU) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Qn}]`)) {
				let r = Number(t.getAttribute(Qn));
				r >= RU && t.closest(`.${bU}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(zU, n.hidden.has(r)), t.toggleAttribute(BU, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), Vd(e, eW(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(OU)) {
			let e = Number(n.getAttribute(Qn)), r = n.getAttribute($n), i = n.classList.contains(DU) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: aW(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? iW(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, HU) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(NU).trim(), n = t.length === 0 ? null : $c(t);
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
		n === null || i !== void 0 && n === iW(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, HU, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return eW(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(kU).length;
		if (t < 2) return;
		let n = wl(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${LU}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${bU}`)?.toggleAttribute(hr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(wU), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return XU(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && N(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(TU), n = t ?? (e.shiftKey ? YU(e.target) : null);
		if (n === null || this.drag.active || !N(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Qc(KU, i.sizes.reduce((e, t) => e + t, 0)) : KU;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${bU}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Qn)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = eW(c.places).filter((e) => !c.hidden.has(e));
			Dk(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(TU) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${bU}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = dl(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(GU, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, ZU(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, VU, t === null ? null : rl(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(IU).trim(), n = e.getAttribute(tr), r = {};
		t.length > 0 && (r[IU] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, WU, null) : this.store.writeBoot(e, WU, {
			styles: r,
			attributes: {
				[tr]: n,
				[dr]: e.getAttribute(dr)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${bU}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = ol(t.getAttribute(Wn)), a = sl(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(Qn)), d = this.hiddenOf(t, s), f = eW(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${EU}`), n = t?.closest(`.${bU}`) ?? null;
		return t === null || n === null || !n.classList.contains(xU) || e.closest(TU) !== null || t.classList.contains(DU) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${bU}`), r = Number(e.getAttribute(Qn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(nW), s = n.querySelector(wU), c = getComputedStyle(n).direction === "rtl";
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
		for (let a of eW(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, rW(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(mr, "after") : o.cell.setAttribute(mr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(pr), t.table.removeAttribute(fr), rW(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Fg(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = eW(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, UU, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function JU(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${AU}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(PU, `${n}px`), e.style.setProperty(FU, `${r}px`);
}
function YU(e) {
	let t = e.matches(`.${EU}`) ? e.querySelector(`:scope > ${TU}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function XU(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function ZU(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function QU(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(MU) || t.querySelector(MU) !== null)) return !0;
	return !1;
}
function $U(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(AU);
}
function eW(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function tW(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function nW(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function rW(e) {
	for (let t of e.querySelectorAll(`[${mr}]`)) t.removeAttribute(mr);
}
function iW(e) {
	return e.startsHidden || e.hideBelow !== null && Lm.indexOf(Vm()) < Lm.indexOf(e.hideBelow);
}
function aW(e) {
	return e !== null && Lm.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var oW = /* @__PURE__ */ new WeakMap();
function sW(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(rn);
	for (let i of K(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = cW(i, a) ?? lW(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) n.has(t) || t.remove();
}
function cW(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : oW.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function lW(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (pW(i, t.getAttribute(b)), oW.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function uW(e, t) {
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
function dW(e) {
	return e.find((e) => !e.classList.contains(bi));
}
function fW(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return pW(o, r), o.appendChild(a), o;
}
function pW(e, t) {
	e.setAttribute(Ft, ""), t === null ? e.removeAttribute(It) : e.setAttribute(It, t);
}
var mW = "bottom", hW = "pending", gW = "focus";
function _W(e, t, n) {
	let r = vW(e, t);
	n <= 0 ? r?.remove() : (r ??= yW(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function vW(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function yW(e) {
	let t = document.createElement("div");
	return t.setAttribute(Yt, e), t.style.flexShrink = "0", t;
}
function bW(e, t) {
	let n = vW(e, gW);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? yW(gW);
	return r.style.height = `${t}px`, r;
}
function xW(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function SW(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var CW = /* @__PURE__ */ new WeakMap();
function wW(e) {
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) t.remove();
}
function TW(e, t, n, r, i, a) {
	let o = pk(e, K(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = ik(i.getItemsFilterSortMetadata(t), a, QO(e));
	if (c && !l && (wW(e), CW.delete(e)), o.length === 0) return;
	let d = jO(e);
	if (!l) {
		SW(e, [...ak(o, u, r), ...AO(d)]);
		return;
	}
	let { buckets: f, order: p } = uW(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = CW.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = ak(n, u, r));
		let i = t === "" ? void 0 : dW(n);
		if (i !== void 0) {
			let n = EW(e, h?.get(t), i) ?? fW(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) v.has(t) || t.remove();
	CW.set(e, g), SW(e, [..._, ...AO(d)]);
}
function EW(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return pW(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var DW = "ui-tree-rules", OW = `:scope > .${sr}:not(.${ur})`, kW = null;
function AW(e, t, n) {
	kW === null ? jW(e, t, n) : (kW.hosts.set(e, {
		componentId: t,
		context: n
	}), G(e) === "virtualized" && kW.drawing.add(e));
}
function jW(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(DW, { bubbles: !0 })), MO(e, t, n.templates, n.renderer, e.querySelector(OW) !== null);
	else switch (G(e)) {
		case "windowed":
			MO(e, t, n.templates, n.renderer), NW(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			tk(e, t, n.metadata, n.renderer, n.state), MW(e), MO(e, t, n.templates, n.renderer), TW(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function MW(e) {
	let t = Pf(e);
	t !== null && Nf(t, K(e).filter((e) => e instanceof HTMLElement));
}
function NW(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	sW(e, (e) => fW(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function PW(e) {
	if (kW !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	kW = t;
	try {
		e();
	} finally {
		kW = null;
		for (let [e, n] of t.hosts) FW(e, n);
	}
}
function FW(e, t) {
	try {
		e.isConnected && jW(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function IW(e) {
	if (kW !== null && kW.drawing.size !== 0) for (let t of kW.drawing) {
		let n = kW.hosts.get(t);
		n !== void 0 && e(t) && (kW.drawing.delete(t), kW.hosts.delete(t), FW(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var LW = "fold", RW = ["fold-hidden", "fold-shown"], zW = ".ui-table", BW = `:scope > .${rr} > .${ir} > [role='columnheader']`, VW = `:scope > .${ar}`, HW = "input:not([type='hidden']), button, select, textarea, a[href]", UW = /* @__PURE__ */ new WeakMap();
function WW(e) {
	for (let t of e.querySelectorAll(BW)) {
		let e = GW(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function GW(e) {
	let t = e.querySelector(HW);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(VW);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function KW(e, t = null) {
	let n = qW(e), r = UW.get(e), i = n.find((e) => t !== null && YW(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (JW(e, i), !0);
}
function qW(e) {
	let t = Ld(e), n = [];
	for (let r of e.querySelectorAll(BW)) {
		let e = GW(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && F(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function JW(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), UW.set(e, t), t.focus();
}
function YW(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function XW(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(zW) && GW(t) === e ? n : null;
}
function ZW(e, t, n) {
	if (!N(e) || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(YW(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!zu(e.key, "horizontal")) return !1;
	let r = Ru({
		key: e.key,
		items: qW(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && JW(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var QW = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), $W = ".ui-table", eG = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), tG = `:scope > [${x}], :scope > .${rr}, :scope > .${rr} > [${x}]`, nG = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(I)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), V(this.root, I, { childList: !0 }, (e) => this.applyAll(e)), V(this.root, I, { attributeFilter: [
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
		let t = Fd(e);
		xd(e, t);
		for (let t of e.querySelectorAll(tG)) iG(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches($W) && WW(e);
			for (let n of t) {
				let t = Nu(n);
				t !== null && iG(t);
				for (let e of Pu(n)) iG(e);
				rG(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : Ad(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = hO(r, en) !== null, a = n === "first" ? mO(r) === 0 && !gO(r, "data-ui-window-more-before") : !gO(r, nn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = wf(n === "first" ? "Home" : "End", t, null, fG(e));
		o !== null && (nf(e, t, o), e.getAttribute("data-ui-selection") === "one" && Cd(e, t, o, pd));
	}
	remark(e) {
		let t = Fd(e);
		xd(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, I);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Fd(n);
		nf(n, i, r, e.target instanceof Element ? yf(r, e.target) : null), z(n), n.hasAttribute("data-ui-no-row-select") ? gd(n, r) : Cd(n, i, r, _d(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(dd), r = n?.closest(I) ?? null;
		return n === null || r === null || n.closest(I) !== r || !r.matches(t) || k(r) ? null : Lu(e.target, n) === null && !A(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Ad(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, fd);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), kf(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Tu(e)) return;
		let t = XW(e.target);
		if (t !== null && !k(t)) {
			ZW(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = qd(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || k(r) || af(r) && aG(e) && this.handleCellKey(r, e)) return;
		let i = fG(r);
		if (!QW.has(e.key) && !Sf(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Fd(r), o = Zd(a), s = wf(e.key, a, Qd(a), i);
		if (s !== null) {
			e.preventDefault(), nf(r, a, s, e.key === "ArrowUp" && !e.shiftKey && af(r) ? vf(s) : null), sG(r, a, o, s, vd(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && N(e, { alt: !0 }) && r.matches($W) && KW(r, pf(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || A(o)) return;
		let c = Nu(o);
		switch (e.key) {
			case " ":
				cG(r, a, o, c);
				break;
			case "Enter":
				uG(r, a, o, c);
				break;
			case "Delete":
				if (!lG(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Fd(e), r = Qd(n);
		if (r === null || A(r)) return !1;
		let i = ff(r), a = N(t, { alt: !0 });
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = mf(e, r, i, t.key);
				return o !== null && nf(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? hf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), nf(e, n, r, o), !0);
			}
			default: return i !== null && oG(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Ad(e) : null;
		if (n === null || G(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? mO(n) === 0 && !gO(n, "data-ui-window-more-before") : !gO(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), qu(n, r ? 0 : Ku(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Ad(e);
		if (n === void 0 || r === null) return;
		let i = Rf(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Qd(Fd(e)) : null, o = i ?? (a === null ? null : R(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Ad(e), n = Rf(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Fd(e), r = Qd(n) ?? wf("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (nf(e, n, r, sf(r, t)), e.getAttribute("data-ui-selection") === "one" && Cd(e, n, r, pd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(tG)].includes(t)) {
			z(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(I) && e.target.matches(".ui-items-view, .ui-table") && !k(e.target) && !ip()) {
			ef(e.target, Fd(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(dd) : null, i = r?.closest(I) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && Lu(e.target, r) !== null && nf(i, Fd(i), r, e.target instanceof Element ? yf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && op(n, !0);
			for (let e of n.querySelectorAll(tG)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) iG(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(dd)) continue;
			let n = e.closest(I);
			n !== null && n.matches(".ui-items-view, .ui-table") && rG(n, e, e.hasAttribute(Ne));
		}
	}
};
function rG(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(I) === e && WV(n);
	else for (let n of t.querySelectorAll(Vf)) n.tabIndex >= 0 && n.parentElement?.closest(I) === e && Iu(t, n) && UV(n);
}
function iG(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function aG(e) {
	return eG.has(e.key) || uT(e) !== null;
}
function oG(e, t) {
	let n = t.key, r = uT(t) !== null, i = N(t, { shift: !0 });
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && xf(e, t)) return !0;
	let a = Nu(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !_f(e))) return !1;
	let o = fp(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function sG(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && hd(e, n), Cd(e, t, r, i, a));
}
function cG(e, t, n, r) {
	Cd(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || dG(n, r);
}
function lG(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = pG(t, n);
	for (let e of r) kf(e, "remove");
	return r.length > 0;
}
function uG(e, t, n, r) {
	yd(e) && !Sd(t).includes(n) && Cd(e, t, n, pd), dG(n, r), r === null && kf(n, "open");
}
function dG(e, t) {
	t === null ? kf(e, Of) : t.click();
}
function fG(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function pG(e, t) {
	let n = Sd(e);
	return (n.includes(t) ? n.filter((e) => e === t || L(e) !== null) : [t]).filter((e) => !qc(e, "data-ui-unremovable") && !A(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var mG = "ui-tree__row--folded", hG = "ui-tree__row--dragging", gG = "ui-tree__loading", _G = "ui-tree__loading-ring", vG = "ui-tree-node__text", yG = "ui-tree-node__toggle", bG = "ui-tree-node__rename", xG = ".ui-text__title", SG = lr, CG = "--ui-tree-depth", wG = "expanded", TG = 200, EG = 600, DG = .25, OG = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, kG = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), AG = "ui-tree-unfold-settled", jG = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(AG, { bubbles: !0 }));
	} }
}, MG = class {
	root;
	store = new xP();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(DW, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${or}`) : null;
			t !== null && (this.layout(t), Nf(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(AG, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => R(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${or}`)), V(this.root, `.${or}`, {
			childList: !0,
			attributeFilter: [
				vr,
				yr,
				xr,
				Er
			],
			relevant: LG
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = cA(e)?.getAttribute(vr);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = R(e), r = cA(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(yr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(CG, String(u)), e.setAttribute("aria-level", String(u + 1)), tf(e, r?.querySelector(`:scope > .${vG}`) ?? null), e.classList.toggle(mG, !d), e.classList.toggle(ur, _), e.removeAttribute(Tr), e.draggable = i && SO(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Cr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Cr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Cr), d && g && !_), s.set(n, {
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
		return cA(e.row)?.hasAttribute(xr) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, LW, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of RW) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Ra(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = QO(t);
		if (r === void 0 && i === null) return null;
		let a = ik(r, this.rules.state, i), o = rk(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(R)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = cA(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => ok(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(R(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${gG}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = R(o), c = i.getItemValue(o);
			if (c === void 0 || nk(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = cA(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(gG) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? RG();
		o.style.setProperty(CG, String(t)), o.classList.toggle(mG, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${yG}`) !== null || qc(r, "data-ui-unselectable") && Lu(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Lu(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : kf(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${sr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || A(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !k(t) && !ip() && ef(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || !(e.target instanceof Element)) return;
		let t = qd(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || k(n)) return;
		let r = e.altKey && N(e, { alt: !0 }) ? OG[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !kG.has(e.key) && !Sf(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Zd(i), o = wf(e.key, i, Qd(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, vd(n, e));
		else if (!(a === null || A(a))) {
			switch (e.key) {
				case " ":
					cG(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, wf("ArrowDown", i, a, "vertical"), pd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), pd);
					break;
				case "Enter":
					uG(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !lG(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Zd(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = BG(n), a = R(r), o = mA(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => R(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		Dk(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !qc(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = zG(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Er) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (A(t)) {
			e.preventDefault();
			return;
		}
		let a = xO(t, this.rowsOf(n)), o = bO(n, i, a);
		r ? fv(e, n, t, hG, R(t), a.filter((e) => e !== t), wO(o, !0)) : mv(e, R(t), wO(o, !1)), TO(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(hG));
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
		let i = this.parentKeysOf(e), a = R(t), o = (e) => n.some((t) => R(t) === e || IG(i, e, R(t))), s = lA(t, cA(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? DG : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = BG(f), m = Number(t.style.getPropertyValue(CG)) || 0, h = new Set(n.map(R)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : vA(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !uA(v.parent, (e) => f.find((t) => R(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), EG)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${or}`);
		t !== null && hv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${or}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${SG}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && IG(a, R(e), R(t)))), s = r.getAttribute(SG) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), pv(t, hG), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = yA(BG(this.rowsOf(e)), t.map(R), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = cA(e)?.querySelector(`.${vG}`) ?? null;
			r !== null && (r.setAttribute(wr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), zk(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = zG(e)?.closest(".ui-tree") ?? null;
		t !== null && (pv(t, hG), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		fA(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(R(n), cA(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = R(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e), a = this.rowsOf(e);
		i.delete(r), i.set(r, n), NG(i, a);
		let o = n ? a.filter((e) => e.classList.contains(mG)) : [];
		this.store.writeJson(e, wG, [...i]), this.layout(e), FG(o.filter((e) => !e.classList.contains(mG)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = PG(this.store.readJson(e, wG)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Zd(r);
		nf(e, r, t), n !== null && sG(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = cA(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => R(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${or}`), n = cA(e), r = n?.querySelector(xG) ?? null;
		t === null || n === null || r === null || qc(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), ou({
			container: n,
			title: r,
			className: bG,
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
function NG(e, t) {
	if (e.size <= TG) return;
	let n = new Set(t.map(R)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= TG) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function PG(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function FG(e) {
	if (!(e.length === 0 || Pm())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: B.fast,
		easing: B.enter
	});
}
function IG(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function LG(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function RG() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = gG, e.setAttribute(OO, ""), e.setAttribute("aria-hidden", "true"), t.className = _G, e.append(t, O.text("ui.tree.loading")), e;
}
function zG(e) {
	return e.target instanceof Element ? e.target.closest(`.${sr}`) : null;
}
function BG(e) {
	return e.map((e) => ({
		key: R(e),
		parent: cA(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: lA(e, cA(e)),
		shown: !e.classList.contains(ur)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var VG = {
	visibilityState: () => document.visibilityState,
	notificationPermission: UG
};
function HG(e) {
	return e !== "hidden";
}
function UG() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var WG = 200;
function GG(e = VG) {
	return {
		visible: HG(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var KG = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? VG, this.settleMilliseconds = e.settleMilliseconds ?? WG;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = GG(this.source), this.held;
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
		let t = GG(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function qG(e) {
	return {
		permission: UG,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function JG(e, t, n = qG()) {
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
function YG(e, t, n, r = window.location) {
	e.bringTo !== void 0 && XG(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function XG(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function ZG(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var Y = "ui-tabs-view", QG = "ui-tab-item__label", $G = "ui-tab-item__close", eK = "ui-tab-item__rename", tK = "ui-tab-item__caption", nK = "ui-tab-item__pin", rK = ".ui-text__title", iK = "ui-tab-item--dragging", aK = "ui-tab-item__caption--overflowed", oK = "ui-tabs-view--overflowing", sK = "ui-tabs-view--no-overflow", cK = "ui-tab-item__page", lK = "ui-tab-item--selected", uK = `.${S}`, dK = "tab-menu-entry", fK = {
	name: dK,
	registration: { dynamicParameters: (e) => pF(e.domEvent.detail?.entry, e.dynamicParameters) }
}, pK = "tab-pin";
function mK(e) {
	return {
		name: pK,
		registration: pO((e) => jk(e.target), e)
	};
}
var hK = "--ui-tabs-view-strip", gK = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new SV({
			rootClass: Y,
			overflowingClass: oK,
			wraps: (e) => e.classList.contains(sK),
			hiddenClass: aK,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => DK(e) === t.key))?.querySelector(`.${QG}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(vF, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), vU(this.root, ["press"], (e) => {
			let t = e.closest(`.${$G}`)?.closest(`.${tK}`) ?? null;
			return t === null ? [] : [t];
		}), V(this.root, `.${Y}`, {
			childList: !0,
			attributeFilter: [
				ci,
				be,
				ce,
				...mi
			],
			relevant: (e) => !tg(e, `.${cK}`, `.${Y}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Y}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		vK(e, t);
		let n = t.filter(KF), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = ld(n, r, DK);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(lK))?.querySelector(`.${tK}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = DK(e) === r;
			e.classList.toggle(lK, t);
			let i = e.querySelector(`.${tK}`);
			i !== null && (i.draggable = a, AV(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${QG}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${cK}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${cK}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), jV(o, c), o !== null && o !== c && MV(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${QG}`);
			t === null || e.classList.contains(aK) || (u.push(t), e === c && (d = t));
		}
		P(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && z(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !KF(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(hK, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${_V}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => DK(e) === t)?.querySelector(`.${QG}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(KF).map((e) => ({
				key: DK(e),
				title: e.querySelector(`.${QG}`)?.textContent?.trim() ?? DK(e),
				current: DK(e) === t,
				disabled: k(e.querySelector(`.${QG}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${kk}`);
		if (n === null || !n.classList.contains(Y) || r === null || r.closest(`.${Y}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = xK(n, r), a = CK(t), o = a.map((e) => {
			if (SK(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? KF(e) ? "shown" : "hidden";
		});
		fF(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: DK(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(uK);
		if (t === null || n === null || !n.classList.contains(Y) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => DK(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(dK, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (xK(n, o).get(i) !== !0) return !0;
		switch (i) {
			case aF: {
				let e = o.querySelector(`.${QG}`);
				e !== null && this.startRename(e);
				break;
			}
			case oF:
			case sF:
				this.setPinned(n, o, i === oF);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${tK} > .${nK}`);
		t.toggleAttribute(pi, n), r !== null && (r.toggleAttribute(pi, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = ZG(a.map(EK));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Ak(a[a.length - 1]).after(Ak(t)) : Ak(s).before(Ak(t)), t.dispatchEvent(new Event(pK, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${_V}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(Y)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = wK(e.target), i = r?.closest(`.${Y}`) ?? null;
		if (r === null || i === null || k(r)) return;
		let a = r.closest(`.${kk}`);
		a !== null && a.closest(`.${Y}`) === i && (e.preventDefault(), this.select(i, DK(a)), document.activeElement !== r && z(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${$G}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${Y}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), yK(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = wK(e.target), n = t?.closest(`.${Y}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(rK) ?? e, r = e.closest(`.${kk}`);
		t === null || r === null || Mk(r, "data-ui-unrenamable") || ou({
			container: t,
			title: n,
			className: eK,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(li, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => z(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Tu(e)) return;
		let t = e.target.closest(`.${QG}`), n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && N(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${kk}`);
		if (r === null || r.closest(`.${Y}`) !== n) return;
		if (e.key === "Delete" && N(e)) {
			if (!bK(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && N(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!N(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${QG}`)).filter((e) => e !== null), a = Ru({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${kk}`);
		o !== null && this.select(n, DK(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || Mk(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? Ak(t).after(Ak(i)) : Ak(t).before(Ak(i)), zk(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = TK(e);
		if (t === null) return;
		if (Mk(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		fv(e, t.closest(`.${Y}`) ?? t, t, iK, DK(t));
		let n = Ak(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${tK}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${iK}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${tK}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Ak(r), o = t.hasAttribute("data-ui-tab-pinned") ? _K(n, a) : null, s = o ?? Ak(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y}`);
		t !== null && t.querySelector(`.${iK}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = TK(e);
		if (t === null) return;
		t.classList.remove(iK);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Ak(t), n.next);
			return;
		}
		let r = Ak(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${Y}`);
		i !== null && zk(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		cd(e, t, {
			attribute: ci,
			bindingAttribute: si,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return od(e, `.${kk}`, `.${Y}`);
	}
};
function _K(e, t) {
	let n = null;
	for (let r of od(e, `.${kk}`, `.${Y}`)) {
		let e = Ak(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function vK(e, t) {
	let n = !t.some((e) => !Mk(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function yK(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !Mk(t, "data-ui-unremovable");
}
function bK(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && yK(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !k(t);
}
function xK(e, t) {
	return dF(uF(e.getAttribute(xe)), {
		pinned: t.hasAttribute(pi),
		renamable: !Mk(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && yK(e, t)
	});
}
function SK(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function CK(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function wK(e) {
	return e.closest(`.${$G}`) !== null || au(e) ? null : e.closest(`.${tK}`)?.querySelector(`:scope > .${QG}`) ?? null;
}
function TK(e) {
	return e.target instanceof Element ? e.target.closest(`.${tK}`)?.closest(".ui-tab-item") ?? null : null;
}
function EK(e) {
	return { pinned: e.hasAttribute(pi) };
}
function DK(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var OK = "button.ui-text__fold-toggle", kK = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(OK);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, AK = "ui-temporal-input__segments", jK = "ui-temporal-input__segment", MK = "ui-temporal-input__segment-literal", NK = "ui-temporal-input__segment--empty", PK = "data-ui-temporal-segment", FK = "data-ui-temporal-step-direction", IK = "data-ui-temporal-segments-of", LK = "--", RK = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), zK = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${q}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ia(e.components, `.${q}`));
		}), V(this.root, `.${q}`, { attributeFilter: [...dj] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) pj(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${AK}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = mj(e), r = yj(e), i = J(e, Ej(t));
		t.getAttribute(IK) !== n && (t.replaceChildren(...BK(n).map((e) => HK(e))), t.setAttribute(IK, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(PK);
			t === null ? n.textContent = WK(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = GK(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(NK, i === null), n.tabIndex = 0, KK(n, t, i, j(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return;
		let t = JK(e.target);
		if (t === null) return;
		let n = t.closest(`.${q}`), r = t.getAttribute(PK), i = qK(t), a = RK.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), XK(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), Fj(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = ZK(e.key, yj(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = JK(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = JK(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = $y(this.wheelTurn, Qy(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${q}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(PK), n < 0 ? 1 : -1, qK(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${FK}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${FK}]`);
		if (t === null) return;
		let n = t.closest(`.${q}`);
		if (n === null || j(n)) return;
		e.preventDefault();
		let r = YK(n) ?? n.querySelector(`.${jK}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(PK), t.getAttribute(FK) === "up" ? 1 : -1, qK(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${jK}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${q}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = J(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, Kj(e, $K(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = QK(t), o = gj(hj(e), a) * n, s = a === "hour" ? 24 : 60, c = ((_j(i, a) + o) % s + s) % s;
		this.write(e, Kj(e, vj(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? vj(t, "hour", eq(l, t.getHours() >= 12)) : vj(t, QK(n), l), i);
		}
		u && XK(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, $K(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return J(e, t) ?? Gj(e);
	}
	write(e, t, n) {
		Fj(e, t, n), Uj(e), this.applySegments(e);
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
function BK(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = hs(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(VK(r)), n += r.length);
	}
	return t;
}
function VK(e) {
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
function HK(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = MK, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = jK, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(PK, e.unit), t.dataset.width = String(e.width), UK(t, e.unit), t;
}
function UK(e, t) {
	if (t === "meridiem") {
		O.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = QK(t);
	O.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function WK(e, t, n, r) {
	return t && n !== null ? us(n, e, r) : e;
}
function GK(e, t, n, r) {
	if (n === null) return LK;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Is(n.getHours()) : _j(n, QK(e));
	return String(i).padStart(t, "0");
}
function KK(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? Is(n.getHours()) : _j(n, QK(t))));
}
function qK(e) {
	return Ej(e.closest(`.${AK}`));
}
function JK(e) {
	let t = e instanceof Element ? e.closest(`.${jK}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${q}`);
	return n === null || j(n) ? null : t;
}
function YK(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${jK}`) : null;
}
function XK(e, t, n) {
	Ru({
		key: n,
		items: [...e.querySelectorAll(`.${jK}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function ZK(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function QK(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function $K(e, t) {
	return vj(e, "hour", eq(Is(e.getHours()), t === "pm"));
}
function eq(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var tq = "datetime", nq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${xt}`), O.temporal === null), O.onTable(() => this.apply(this.root.querySelectorAll(`.${xt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Ia(e.components, `.${xt}`))), V(this.root, `.${xt}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [tq],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: O.temporal,
			language: O.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Bs(a.getAttribute(Ct)), o = zs(a.getAttribute(tq)), s = a.querySelector(`.${St}`);
			if (s === null || t && !rq(e, o, r)) continue;
			let c = o === null ? "" : Ws(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Vs(e) && o !== null;
		}
		i && bc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${xt}:is([${Ct}="relative"], [${Ct}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function rq(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Gs(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var iq = `.${wt}`, aq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), O.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => oq(Ia(e.components, iq))), V(this.root, iq, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				Ot,
				kt,
				At,
				jt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(iq) !== null)
		}, oq);
	}
	applyAll() {
		oq(this.root.querySelectorAll(iq));
	}
};
function oq(e) {
	let t = O.language || document.documentElement.lang;
	for (let n of e) Qv(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var sq = /* @__PURE__ */ new Map();
function cq(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function lq(e, t, n, r) {
	let i = uq(e, t);
	return i !== null && (sq.set(e, {
		key: t,
		block: n
	}), dq(e, i, n, r), !0);
}
function uq(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function dq(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Wu(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = fq(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function fq(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function pq(e) {
	let t = sq.get(e);
	if (t === void 0) return;
	let n = uq(e, t.key);
	n === null ? sq.delete(e) : dq(e, n, t.block, "auto");
}
function mq(e) {
	if (sq.size !== 0 && e instanceof Node) for (let t of [...sq.keys()]) (!t.isConnected || Wu(t).contains(e)) && sq.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var hq = "data-ui-scroll-anchor", gq = "End", _q = `[${hq}="${gq}"]`, vq = 4, yq = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], bq = /* @__PURE__ */ new WeakSet();
function xq(e) {
	bq.add(e);
}
function Sq(e) {
	mq(e);
	for (let t = e.closest(_q); t !== null; t = t.parentElement?.closest(_q) ?? null) bq.delete(t);
}
var Cq = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of yq) this.root.addEventListener(e, (e) => wq(e), {
			capture: !0,
			passive: !0
		});
		V(this.root, `[${hq}="${gq}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [cn]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && Eq(t) && this.pinned.set(t, bq.has(t) || Oq(t) && !Dq(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${hq}="${gq}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), bq.has(t) ? (this.pinned.set(t, !0), Tq(t)) : this.pinned.get(t) !== !1 && (Dq(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), Tq(t)));
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
			if (!e.isConnected || r === null || !Eq(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? Tq(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !Eq(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && Tq(e);
	}
	followsEnd(e) {
		return bq.has(e) || this.pinned.get(e) !== !1 && !Dq(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function wq(e) {
	mq(e.target);
	let t = e.target instanceof Element ? e.target.closest(_q) : null;
	t !== null && bq.delete(t);
}
function Tq(e) {
	e.scrollTop = e.scrollHeight;
}
function Eq(e) {
	return e.getAttribute(hq) === gq;
}
function Dq(e) {
	return gO(e, nn);
}
function Oq(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= vq;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var kq = `${Au}, [role='menu'], [role='tab']`, Aq = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? jq, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(kq) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function jq(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function Mq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Pq(e, a, n), s = Pq(e, a + 1, n);
	return Fq(t, o.top, s.top, o.line, s.line);
}
function Nq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Pq(e, a, n), s = Pq(e, a + 1, n);
	return Fq(t, o.line, s.line, o.top, s.top);
}
function Pq(e, t, n) {
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
function Fq(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var Iq = 250, Lq = class {
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
		if (n !== void 0 && t - n.at < Iq && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Kt}="${Gi(e)}"]`)];
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
		let n = Rq(e, "data-ui-scroll-viewport") ?? zq(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? Vq(e) : null, a = i === null ? null : Vq(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Nq(a, Mq(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? Bq(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function Rq(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function zq(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : Rq(e, x);
	return t === null ? null : Wu(t);
}
function Bq(e, t) {
	return t > 0 ? e / t : 0;
}
function Vq(e) {
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
var Hq = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", Uq = `.${ki}, .ui-action, .${S}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${Hq}`, Wq = ".ui-expander__header", Gq = "ui-key-value-action__row", Kq = `${Uq}, ${`${dd}, .${Gq}`}`, qq = "ui-pressing", Jq = "ui-press-held", Yq = "ui-press-placed", Xq = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(sP, (e) => this.handleHold(e)), t.addEventListener(cP, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, B.ripple, !1), t.classList.add(Jq));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !Pm();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = Zq(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(qq), t.append(u);
		let f = i === null ? null : d.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
			duration: i,
			easing: B.ease,
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
		if (t === null || !(n instanceof HTMLElement) || k(n) || t.target.closest(Wq) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(Yq));
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
		let t = e.closest(Hq) ?? e.closest(Kq);
		if (t === null || k(t) || t.matches(Wq)) return null;
		let n = e.closest(Ei);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(Uq) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Lu(t, e) !== null || A(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(I), r = n !== null && !e.classList.contains(Gq) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && qc(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : L(e);
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
		n.element.classList.remove(Jq);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, B.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: B.normal,
			delay: a,
			easing: B.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(qq, Jq, Yq), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function Zq(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = Kh, r.setAttribute("aria-hidden", "true"), i.className = qh, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var Qq = "ui-overlay-scrollbar", $q = "ui-overlay-scrollbar__box", eJ = "ui-overlay-scrollbar__thumb", tJ = "ui-overlay-scrollbar--shown", nJ = "ui-overlay-scrollbar__thumb--held", rJ = "ui-overlay-scrollbar__arrow", iJ = "ui-overlay-scrollbar--near", aJ = "(hover: hover) and (forced-colors: none)", oJ = "--ui-overlay-thumb", sJ = "--ui-scroll-hung", cJ = 12, lJ = 2, uJ = 24, dJ = 12, fJ = 80, pJ = 40, mJ = 400, hJ = 50, gJ = 900, _J = 400, vJ = 16, yJ = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = Qq, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), mg((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia(aJ), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${$q} ${$q}--${t}`, r.className = `${eJ} ${eJ}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
		return r.className = `${rJ} ${rJ}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
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
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(TJ(t, "y") ? t : null, TJ(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < _J;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, gJ), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && bJ(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(tJ, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(iJ, e.view !== null && (e.near || t));
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
		}, gJ);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(xJ(e, "y"), xJ(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !TJ(t, e)) return null;
		let n = kJ(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? OJ(t) : EJ(t);
		return {
			view: n,
			thumb: jJ(t, e, i, r),
			arrows: MJ(t, e, i, r),
			rtl: RJ(t)
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
		}), zJ(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (zJ(e.back, i.back, n), zJ(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		Sq(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * pJ } : { left: n * pJ }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, hJ);
		}, mJ);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && RJ(n), i = PJ(n, t, EJ(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		Sq(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(nJ), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: LJ(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = IJ(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = IJ(t.scroll, n, t.ratio, t.rtl);
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
		if (!(t === null || e.key !== "Escape" || e.defaultPrevented || M(e))) {
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = IJ(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = IJ(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(nJ), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * wJ(e, n, "x"), a = e.deltaY * wJ(e, n, "y"), o = SJ(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (Sq(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function bJ(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function xJ(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (TJ(n, t)) return n;
	return null;
}
function SJ(e, t, n) {
	for (let r = e; r !== null; r = xJ(r.parentElement, t)) if (TJ(r, t) && CJ(r, t, n)) return r;
	return null;
}
function CJ(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = LJ(e, t), a = t === "x" && RJ(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function wJ(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? vJ : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function TJ(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(oJ).trim() !== "none";
}
function EJ(e) {
	if (e === document.scrollingElement) return BJ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = DJ(t.width, n?.offsetWidth), i = DJ(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return BJ(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function DJ(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function OJ(e) {
	let t = EJ(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(sJ));
	return n > 0 ? RJ(e) ? BJ(t.left - n, t.top, t.right, t.bottom) : BJ(t.left, t.top, t.right + n, t.bottom) : t;
}
function kJ(e) {
	let t = OJ(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = VJ(t, AJ(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = VJ(t, BJ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function AJ(e, t) {
	let n = EJ(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return BJ(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function jJ(e, t, n, r) {
	let i = RJ(e), a = PJ(e, t, n, r, i), o = a.max > 0 ? LJ(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - cJ,
		top: a.start + o,
		width: cJ,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - cJ,
		width: a.thumb,
		height: cJ
	};
}
function MJ(e, t, n, r) {
	let i = RJ(e), a = PJ(e, t, n, r, i);
	if (a.arrow === 0) return null;
	if (t === "y") {
		let e = i ? n.left : n.right - cJ;
		return {
			back: {
				left: e,
				top: a.start - dJ,
				width: cJ,
				height: dJ
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: cJ,
				height: dJ
			}
		};
	}
	let o = n.bottom - cJ;
	return {
		back: {
			left: a.start - dJ,
			top: o,
			width: dJ,
			height: cJ
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: dJ,
			height: cJ
		}
	};
}
function NJ(e, t, n, r) {
	return (t === "y" ? e.height : e.width) - r - 4 - (n ? cJ : 0) >= fJ ? dJ : 0;
}
function PJ(e, t, n, r, i) {
	let a = t === "y" ? FJ(e) : {
		top: 0,
		bottom: 0
	}, o = NJ(n, t, r, a.top + a.bottom), s = (t === "y" ? n.top + a.top : n.left) + lJ + o + (r && i && t === "x" ? cJ : 0), c = (t === "y" ? n.height - a.top - a.bottom : n.width) - 4 - 2 * o - (r ? cJ : 0), l = t === "y" ? e.clientHeight : e.clientWidth, u = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: s,
		length: c,
		thumb: Math.min(c, Math.max(uJ, c * l / u)),
		max: u - l,
		arrow: o
	};
}
function FJ(e) {
	if (e === document.scrollingElement) return {
		top: 0,
		bottom: 0
	};
	let t = getComputedStyle(e);
	return {
		top: Number.parseFloat(t.scrollPaddingTop) || 0,
		bottom: Number.parseFloat(t.scrollPaddingBottom) || 0
	};
}
function IJ(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function LJ(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function RJ(e) {
	return getComputedStyle(e).direction === "rtl";
}
function zJ(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function BJ(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function VJ(e, t) {
	return BJ(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var HJ = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), UJ = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], WJ = `.${_i}, .${vi}`, GJ = RegExp(`(^|\\s)(${_i}|${vi})(\\s|$)`), KJ = RegExp(`(^|\\s)${yi}(\\s|$)`), qJ = "[type='range']", JJ = /* @__PURE__ */ new WeakSet(), YJ = /* @__PURE__ */ new WeakSet();
function XJ(e = document) {
	let t = e === document ? window : e;
	for (let e of UJ) t.addEventListener(e, iY, !0);
	t.addEventListener("keydown", oY, !0), t.addEventListener("change", sY, !0), t.addEventListener("pointerdown", cY, !0), t.addEventListener("mousedown", cY, !0), tY(e.querySelectorAll(WJ)), $J(e.querySelectorAll(`[${gi}]`)), QJ(e.querySelectorAll(qJ)), new MutationObserver((e) => {
		for (let t of e) ZJ(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", gi],
		attributeOldValue: !0
	});
}
function ZJ(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			eY(t, e.oldValue !== null);
			return;
		}
		let n = GJ.test(e.oldValue ?? ""), r = t.matches(WJ);
		n !== r && (nY(t, r), eY(t)), KJ.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && QJ(t.querySelectorAll(qJ));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(WJ) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && rY(n), n.matches(WJ) && nY(n, !0), tY(n.querySelectorAll(WJ)), eY(n), $J(n.querySelectorAll(`[${gi}]`)), QJ([n, ...n.querySelectorAll(qJ)]));
}
function QJ(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = j(t);
		e !== JJ.has(t) && (e ? (JJ.add(t), t.addEventListener("touchstart", cY, { passive: !1 })) : (JJ.delete(t), t.removeEventListener("touchstart", cY)));
	}
}
function $J(e) {
	for (let t of e) eY(t);
}
function eY(e, t = !1) {
	let n = e.getAttribute(gi);
	(n !== null || t) && (e.matches(WJ) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Ka(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function tY(e) {
	for (let t of e) nY(t, !0);
}
function nY(e, t) {
	for (let n of e.children) t ? rY(n) : YJ.has(n) && (YJ.delete(n), n.removeAttribute("inert"));
}
function rY(e) {
	e.hasAttribute("inert") || (YJ.add(e), e.setAttribute("inert", ""));
}
function iY(e) {
	e.target instanceof Element && (k(e.target) ? (e.type === "click" && xg(e), lY(e)) : e.type === "click" && aY(e.target) && e.preventDefault());
}
function aY(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && j(e);
}
function oY(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && k(e.target) ? lY(e) : HJ.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && j(e.target) && e.preventDefault());
}
function sY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && j(e.target) && e.stopImmediatePropagation();
}
function cY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && j(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function lY(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var uY = /* @__PURE__ */ new WeakMap(), dY = /* @__PURE__ */ new WeakSet(), fY = /* @__PURE__ */ new WeakSet(), pY = new g_({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = uY.get(e);
		uY.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => dY.has(e),
	sheetOnPhone: ({ popup: e }) => fY.has(e)
});
function mY(e) {
	return {
		open: (e, t, n) => hY(e, t, n, (e) => pY.open(e)),
		openList: gY,
		listKey: xN,
		followPointer: wN,
		focusReturn: (t) => Op(t, e)
	};
}
function hY(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => pY.popupOf(i) === t;
	return uY.set(t, n.onDismiss), n.closesOnTab === !0 ? dY.add(t) : dY.delete(t), n.sheetOnPhone === !0 ? fY.add(t) : fY.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (uY.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && pY.reposition(i);
		},
		close: () => {
			a() && pY.close(i);
		}
	};
}
function gY(e, t, n) {
	return hY(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => bN(pY, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var _Y = "--ui-color-series-count", vY = "--ui-color-series-", yY = 8;
function bY(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(_Y));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : yY;
}
function xY(e, t) {
	return `var(${vY}${e % t + 1})`;
}
var SY = {
	count: bY,
	color: xY
}, CY = ".ui-items-view", wY = `:scope > [${x}]`, TY = `:scope > [${Ft}]`, EY = "ui-orientation--horizontal", DY = 1, OY = [{
	edge: "first",
	holder: `:scope > [${Bt}="${Ht}"]`,
	bound: `${Je}first-visible-key`,
	attribute: dt
}, {
	edge: "last",
	holder: `:scope > [${Bt}="${Ut}"]`,
	bound: `${Je}last-visible-key`,
	attribute: ft
}], kY = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, V(this.root, CY, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Bt}="${Ht}"], [${Bt}="${Ut}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) AY(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(wY), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = zz(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? jY(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(wY);
		if (n === null || k(t[0].holder)) return;
		let r = NY(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = MY(r, n);
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
function AY(e) {
	return jY(e).length > 0;
}
function jY(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of OY) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function MY(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= DY)) return (t === "first" ? BY(n, r) : VY(n, r)) ?? void 0;
}
function NY(e, t) {
	let n = e.classList.contains(EY), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = Yu(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...PY(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: FY(t, n, r)
	} : null;
}
function PY(e, t, n) {
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
function FY(e, t, n) {
	let r = Wu(e), i = PY(IY(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = RY(i, PY(IY(e, null), t, n)));
	}
	return i = RY(i, PY({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), zY(e, i, t, n);
}
function IY(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + LY(t?.paddingLeft),
		top: i + LY(t?.paddingTop),
		right: r + e.clientWidth - LY(t?.paddingRight),
		bottom: i + e.clientHeight - LY(t?.paddingBottom)
	};
}
function LY(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function RY(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function zY(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(TY)) {
		let e = PY(t.getBoundingClientRect(), n, r);
		e.start <= i + DY && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function BY(e, t) {
	for (let n of e) if (HY(n, t)) return n.key;
	return null;
}
function VY(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (HY(e[n], t)) return e[n].key;
	return null;
}
function HY(e, t) {
	return e.key.length > 0 && e.end > t.start + DY && e.start < t.end - DY;
}
//#endregion
//#region src/items/item-rows.ts
function UY(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: HO,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Jd(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(I);
			return t !== null && af(t) ? cf(t, e) : [];
		},
		moveCursor: (e, t) => bf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function WY(e, t) {
	let n = sa(e.kind);
	return n === "Markup" ? !t.hasAttribute(Ii) : n === "Attribute" && e.name === "data-ui-tooltip" || e.converter === "inlineMarkupPlainText";
}
var GY = class {
	phrase;
	converters;
	words = null;
	operation = null;
	converted;
	constructor(e, t) {
		this.phrase = e, this.converters = t;
	}
	get value() {
		return this.words ??= O.translate(this.phrase.key, this.phrase.args, !0), this.words;
	}
	convertedFor(e) {
		return this.operation !== e && (this.operation = e, this.converted = this.converters.convert(e.converter, this.value)), this.converted;
	}
};
function KY(e, t) {
	return D(e) ? new GY(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var qY = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? XY(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), ZY(l, n, t);
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
		let i = YY(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: E(r),
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
			JY(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = T(t.bindingId);
			e.push([t, `[${Je}${Ki(n.propertyName)}="${Gi(r)}"]`]);
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
		let r = nX(t, n.templateKeyPropertyName);
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
		i !== void 0 && !RO(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = T(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : LO(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = Ic(l, () => this.metadata.isTranslatable(t) && !zO(c)), d = KY(l, this.extensions.converters), f = T(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = Yi(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && WY(t, n) ? this.operations.apply({
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
function JY(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = T(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function YY(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? UO(r, i.name) : JO(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return YO(r, i.key, n), e;
	let a = r;
	return a[GO(a, i.name)] = n, e;
}
function XY(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function ZY(e, t, n) {
	e.setAttribute(b, t), tX(e, n), $Y(e, n);
}
var QY = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function $Y(e, t) {
	for (let [n, r] of QY) {
		let i = UO(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function eX(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if ($Y(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${Gi(n)}"]`)) i.closest("[data-ui-items-host]") === r && $Y(i, t);
}
function tX(e, t) {
	let n = UO(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Lt, n.value) : e.removeAttribute(Lt);
}
function nX(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = UO(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var rX = "Group", iX = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	readerHeld = /* @__PURE__ */ new Map();
	answering = [];
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = T(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), e.root.addEventListener("focusout", () => this.handleFocusOut(), !0), V(e.root, `[${Bt}="${Vt}"]`, { attributeFilter: [ut] }, (e) => {
			for (let t of e) {
				let e = Ra(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), V(e.root, `[${Wt}="windowed"]`, { attributeFilter: [rn] }, (e) => {
			for (let t of e) {
				let e = Ra(t);
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
			for (let [t, n] of e) t.isConnected && AW(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) aX(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) n.some((t) => oX(t, e)) || this.handleItemValueChange(e);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(T(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : qO(t);
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
			a !== null && this.drawsPatchedComponent(a, T(e.reference.componentId), t) && sX(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, E(a), n, t, e.value) || r);
		}
		return r;
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${E(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? E(e) === n.scopeComponentId : E(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && aX(n) ? n : r !== null && aX(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), AW(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${Gi(t)}"]`)].filter((t) => this.isItemRoot(t) && Oa(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : Ra(r);
		if (r !== null && i !== null && G(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = cX(rX, t);
		a && tX(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		QY.some(([e]) => cX(e, t)) && eX(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && cX(rX, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => cX(e.itemProperty, n)) || r.sorts.some((e) => cX(e.itemProperty, n)))) return !0;
		let i = QO(e);
		return (i?.filters ?? []).some((e) => cX(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => cX(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = Ra(t);
			n === e && this.sync(t, n);
		}
	}
};
function aX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function oX(e, t) {
	let n = fa(e), r = n === "Value" ? !tm(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && T(i?.component?.id) === T(t.reference.componentId) && da(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function sX(e, t) {
	let n = Da(e, Ea(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function cX(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var lX = "ui-table", uX = "ui-table--no-header";
function dX(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(lX)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(uX)) && (s ? o : a).push(t);
	a.forEach((e, t) => fX(e, t));
	for (let [e, n] of t) fX(e, a.length + n);
	n !== null && o.forEach((e, t) => fX(e, a.length + n + t)), w(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function fX(e, t) {
	w(e, "aria-rowindex", String(t + 1));
}
//#endregion
//#region src/items/items-window-engine.ts
var pX = 50, mX = 1, hX = .5, gX = 60, _X = "--ui-window-look", vX = "--ui-window-row", yX = "--ui-window-tile", bX = 3, xX = "page", SX = class {
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
			this.noteShownRow(t), this.layout(t), FX(t) === 0 ? this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
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
		t !== null && (qu(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = hO(e, $t);
		return t !== null && Eq(e) && gO(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - Ku(e).height) : t === null || t === 0 ? null : gO(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = PX(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Yu(n[n.length - 1]).bottom - Yu(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = MX(e, PX(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), this.getState(t).pending || this.realign(t));
	}
	realign(e) {
		let t = hO(e, $t), n = PX(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Ku(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && TX(t);
	}
	reconsider() {
		for (let e of this.hosts()) this.noteShownRow(e), this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		G(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${x}][${Wt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Gu(e.target);
		if (t === null || G(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, gX));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && FX(e) > 0) return;
		let n = PX(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = hO(e, $t), i = gO(e, tn), a = gO(e, nn);
		if (r !== null) {
			let o = this.windowSize(e), s = Ku(e), c = Math.max(1, Math.round(s.height * mX / t.itemSize), Math.floor(o * hX)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, IX(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, IX(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Ku(e), s = Math.max(1, o.height * mX), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, IX(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, IX(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = hO(e, en);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Ra(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", t === "Start" && TX(o);
		let c = e.closest(C), l = t.toLowerCase();
		e.setAttribute(Xt, l), c?.setAttribute(Xt, e.hasAttribute("data-ui-window-paged") ? xX : l), e.setAttribute("aria-busy", "true"), t === "After" && hO(e, "data-ui-window-total") === null && EX(e) && (_W(e, hW, bX * this.rowSize(e)), DX(e, o));
		let u = hO(e, $t) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: LX(e),
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
			o.pending = !1, e.removeAttribute(Xt), c?.removeAttribute(Xt), e.removeAttribute("aria-busy"), _W(e, hW, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1, o.restless || u && kX(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = PX(e), r = hO(e, en), i = hO(e, $t);
		if (dX(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			_W(e, "top", 0), _W(e, mW, 0);
			return;
		}
		if (n.length > 0) {
			let r = Yu(n[n.length - 1]).bottom - Yu(n[0]).top;
			if (r > 0) {
				let i = CX(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (TX(t), t.measuredWidth = e.clientWidth), wX(t, n, i), t.skeletonRow = a > 1 ? (Yu(n[n.length - 1]).top - Yu(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? Yu(n[1]).left - Yu(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		_W(e, "top", a), _W(e, mW, o), DX(e, t), (t.readingBefore || !AX(e)) && jX(e, n, t.shown), pq(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? OX(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = hO(e, Qt);
		return t !== null && t > 0 ? t : pX;
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
function CX(e) {
	let t = Yu(e[0]).top, n = 1;
	for (; n < e.length && Yu(e[n]).top === t;) n++;
	return n;
}
function wX(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? Yu(t[r]).height : 0 : Yu(i).top - Yu(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		xW(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function TX(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function EX(e) {
	return getComputedStyle(e).getPropertyValue(_X).trim() === "skeleton";
}
function DX(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${OX(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${OX(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Yt}]`)) {
		let e = t.style;
		e.getPropertyValue(vX) !== n && e.setProperty(vX, n), e.getPropertyValue(yX) !== r && (r.length === 0 ? e.removeProperty(yX) : e.setProperty(yX, r));
	}
}
function OX(e) {
	return Math.round(e * 100) / 100;
}
function kX(e, t, n) {
	let r = PX(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && IX(i) !== n;
}
function AX(e) {
	let t = hO(e, $t);
	return Ku(e).top <= 0 && (t === null ? !gO(e, "data-ui-window-more-before") : t === 0);
}
function jX(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => IX(e) === n.key);
	if (n === null || r === void 0) return;
	let i = Yu(r);
	if (i.height <= 0) return;
	let a = Ku(e).top, o = i.top - NX(e) + a - n.at;
	Math.abs(o) >= .5 && qu(e, a + o);
}
function MX(e, t) {
	let n = NX(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		Yu(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : IX(a);
	if (a === void 0 || o === null) return null;
	let s = Yu(a), c = Ku(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function NX(e) {
	let t = Wu(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function PX(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function FX(e) {
	return PX(e).length;
}
function IX(e) {
	return e.getAttribute(b);
}
function LX(e) {
	let t = e.closest(C);
	return t === null ? [] : Da(t, Ea(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var RX = [
	y,
	ie,
	ae
];
function zX(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, BX(c, e.itemRole);
	let l = HX(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = VX(l, t, n, a);
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
		d.className = l.wrapperClassName, BX(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), ZY(d, r, n), c.appendChild(d);
	}
	return ZY(c, r, n), o.registerItemScope(c, l, n), c;
}
function BX(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function VX(e, t, n, r) {
	let i = nX(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function HX(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of RX) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), E(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function UX(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return WX(i.renderer.renderItem(e, t, n, r), a);
	let s = zX(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), WX(s, a);
}
function WX(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), zc(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var GX = 6, KX = 60, qX = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => ZX(e.entry) === !1).map((e) => e.entry.key);
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
		if (!tZ(e) && !$X(e)) return a.element;
		let o = getComputedStyle(e), s = iZ(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = tZ(e) ? nZ(r.projected, c, r.across) : null, u = l === null ? i : eZ(l.starts, i), d = l?.pitches ?? c, f = aZ(o.paddingTop) + oZ(d, 0, u), p = f + d[u] - s, m = Ku(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && qu(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = Eq(e) && Oq(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !Oq(e) && (qu(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && tm(t.item, s)) {
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
		return t === null ? null : JX(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = Ff(t);
		t.remove(), If(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Pf(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Rf(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Ne), l === void 0 ? (r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? nf(r, K(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant"));
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
		let a = Pf(e), o = a === null || i.size === 0 ? null : Af(a, K(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = YY(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = QO(e), i = this.options.templates.getGroupTemplate(t.componentId), a = ik(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => nk(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => QX(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => ok(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = uW(o, QX), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => ok(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Gu(e.target);
		t !== null && G(t) === "virtualized" && this.relayout(t);
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
			e.isConnected && G(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, KX));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = iZ(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = tZ(e) ? nZ(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || $X(e)) && u > 0) {
			let i = aZ(r.paddingTop), a = Ku(e), o = YX(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - GX), f = Math.min(u, f + GX);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(QX(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), XX(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : eZ(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), XX(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && pW(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || Lf(e, l), XX(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of K(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = oZ(l, 0, y?.line ?? d), b = oZ(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? oZ(l, f, ne.line) : oZ(l, y.line + 1, d), se = bW(e, oe > 0 ? oe - i : 0);
		SW(e, [...y === null ? ie === null ? g : [
			...g,
			...AO(se),
			ie.element
		] : [
			y.element,
			...AO(se),
			...g
		], ...AO(jO(e))]), _W(e, "top", ae > 0 ? ae - i : 0), _W(e, mW, b > 0 ? b - i : 0), MO(e, t.componentId, this.options.templates, this.options.renderer, o > 0), dX(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = rZ(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return UX(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : fW(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(QX(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Yu(o);
			s.height <= 0 || (xW(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(QX(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = za(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of K(e)) {
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
function JX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function YX(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (qu(e, a + l + o), a + l);
}
function XX(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = QX(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function ZX(e) {
	let t = UO(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function QX(e) {
	let t = UO(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function $X(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function eZ(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function tZ(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function nZ(e, t, n) {
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
function rZ(e, t, n) {
	let r = e.clientWidth - aZ(t.paddingLeft) - aZ(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = aZ(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function iZ(e) {
	return aZ(e.rowGap);
}
function aZ(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function oZ(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var sZ = "data-ui-template", cZ = "default", lZ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? cZ, r = this.findTemplate(e, n);
		return r === void 0 ? n === cZ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : uZ(n, sZ, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= dZ(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Mt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : uZ(n, t, null);
	}
};
function uZ(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function dZ(e) {
	let t = /* @__PURE__ */ new Set();
	return Fc(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(C)) {
			let n = E(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var fZ = `:scope > ${`template[${Te}]`}`, pZ = class {
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
			this.components.has(e) && hZ(t.item, this.chordSet);
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
		let t = e.querySelector(fZ);
		if (t !== null) {
			let e = t.content.firstElementChild;
			return t.replaceWith(t.content), e;
		}
		let n = this.shared.get(E(e)), r = n === void 0 ? null : this.options.render(n, e);
		return r !== null && e.appendChild(r), r;
	}
	scanContainer(e, t, n) {
		for (let r of [...e.querySelectorAll("template")]) {
			if (this.taken.has(r)) continue;
			let e = [...t, ...mZ(r)];
			if (r.hasAttribute("data-ui-context-menu-template")) {
				this.takeMenu(r, e, n);
				continue;
			}
			let i = r.parentElement === null ? 0 : E(r.parentElement);
			this.scanContainer(r.content, i > 0 ? [...e, i] : e, n ?? r);
		}
	}
	takeMenu(e, t, n) {
		let r = Number(e.getAttribute(Te)), i = !this.declared.has(r);
		this.taken.add(e), this.declared.add(r), Fc(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(C)) this.components.set(E(n), t), this.menuOf.set(E(n), r);
			for (let t of e.querySelectorAll(`[${Vn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function mZ(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Ra(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function hZ(e, t) {
	let n = UO(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = UO(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) hZ(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function gZ(e, t) {
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
var _Z = "script[type='application/json'][data-ui-metadata]";
function vZ(e = document) {
	let t = e.querySelector(_Z);
	if (t === null) return yZ();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return yZ();
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
function yZ() {
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
var bZ = "script[type='application/json'][data-ui-hydration]";
function xZ(e) {
	return e !== null && (ac(e.title) || ac(e.changes));
}
function SZ(e = document) {
	let t = e.querySelector(bZ)?.textContent?.trim() ?? "";
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
var CZ = "reconnecting";
async function wZ(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), CZ;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function TZ(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function EZ(e, t, n) {
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
var DZ = "/_ne/", OZ = 3e3;
function kZ(e, t, n) {
	let r = e.getAttribute(Rr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (EZ(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => jZ(i.ready);
	let a = i.register(r, { scope: DZ }).then(AZ).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function AZ(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function jZ(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), OZ))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var MZ = "ne-standard-ui:reloaded-view";
function NZ(e, t, n) {
	if (!t) return "no-cookie";
	if (IZ(n) === e) return "asked-again";
	try {
		n?.setItem(MZ, e);
	} catch {}
	return "reload";
}
function PZ(e) {
	try {
		e?.removeItem(MZ);
	} catch {}
}
function FZ() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function IZ(e) {
	try {
		return e?.getItem(MZ) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function LZ(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return RZ(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function RZ(e, t) {
	let n = t.create ?? WZ, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = VZ(i, e), s = n(), c = o !== null && o.length > 0 && VZ(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		HZ(i, e, c), HZ(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? zZ(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = BZ(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), zZ(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		UZ(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function zZ(e, t) {
	e?.postMessage(t);
}
function BZ(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function VZ(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function HZ(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function UZ(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function WZ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var GZ = 2e3, KZ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? GZ, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Yr, "reconnecting"), this.notice = this.notifications.show({
			message: O.text("ui.connection.reconnecting"),
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
}, qZ = "/_ne/values", JZ = 32768;
JZ / 4;
var YZ = 3e4;
function XZ(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function ZZ(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function QZ(e, t = null, n = YZ) {
	if (e === void 0 || !ZZ(e)) return e;
	await iy.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${qZ}/${encodeURIComponent(r)}${i}`, {
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
async function $Z(e) {
	await iy.settled();
	let t = await fetch(qZ, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(YZ)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var eQ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(tQ(nQ(e)));
	}
	async dispatchAsync(e) {
		let t = nQ(e), n = tQ(t);
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
		let t = XZ(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : $Z(t), i = () => {}, a = new Promise((e) => {
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
function tQ(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function nQ(e) {
	return e.action === void 0 ? {
		eventId: T(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/transport/inbound-order.ts
var rQ = class {
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
async function iQ(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var aQ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && tm(a.value, n);
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
		let r = oQ(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ua([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(oQ(e, t));
		let n = this.unplaced.get(ua(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = oQ(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ua([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ua(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ua(t.slice(0, e - 1)));
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
		return `${T(e.componentId)}:${e.propertyId}:${ua(t)}`;
	}
};
function oQ(e, t) {
	return `${e}:${ua(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var sQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, cQ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, lQ = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, uQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, dQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, fQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, pQ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, mQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, hQ = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, gQ = class {
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
}, X;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(X ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var _Q = class {
	constructor() {}
	log(e, t) {}
};
_Q.instance = new _Q();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var vQ = "10.0.11", Z = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, yQ = class e {
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
function bQ(e, t) {
	let n = "";
	return SQ(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${xQ(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function xQ(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function SQ(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function CQ(e, t, n, r, i, a) {
	let o = {}, [s, c] = DQ();
	o[s] = c, e.log(X.Trace, `(${t} transport) sending data. ${bQ(i, a.logMessageContent)}.`);
	let l = SQ(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(X.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function wQ(e) {
	return e === void 0 ? new EQ(X.Information) : e === null ? _Q.instance : e.log === void 0 ? new EQ(e) : e;
}
var TQ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, EQ = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${X[e]}: ${t}`;
			switch (e) {
				case X.Critical:
				case X.Error:
					this.out.error(n);
					break;
				case X.Warning:
					this.out.warn(n);
					break;
				case X.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function DQ() {
	let e = "X-SignalR-User-Agent";
	return yQ.isNode && (e = "User-Agent"), [e, OQ(vQ, kQ(), jQ(), AQ())];
}
function OQ(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function kQ() {
	if (yQ.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function AQ() {
	if (yQ.isNode) return process.versions.node;
}
function jQ() {
	return yQ.isNode ? "NodeJS" : "Browser";
}
function MQ(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function NQ() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var PQ = class extends gQ {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || yQ.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(NQ());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new lQ();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new lQ();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(X.Warning, "Timeout from HTTP request."), n = new cQ();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, SQ(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(X.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new sQ(await FQ(i, "text") || i.statusText, i.status);
		let a = await FQ(i, e.responseType);
		return new hQ(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return yQ.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function FQ(e, t) {
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
var IQ = class extends gQ {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new lQ()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (SQ(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new lQ());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new hQ(r.status, r.statusText, r.response || r.responseText)) : n(new sQ(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(X.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new sQ(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(X.Warning, "Timeout from HTTP request."), n(new cQ());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, LQ = class extends gQ {
	constructor(e) {
		if (super(), typeof fetch < "u" || yQ.isNode) this._httpClient = new PQ(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new IQ(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new lQ()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, RQ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
RQ.RecordSeparatorCode = 30, RQ.RecordSeparator = String.fromCharCode(RQ.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var zQ = class {
	writeHandshakeRequest(e) {
		return RQ.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (SQ(e)) {
			let r = new Uint8Array(e), i = r.indexOf(RQ.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(RQ.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = RQ.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var BQ = class {
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
		return this.observers.push(e), new TQ(this, e);
	}
}, VQ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			SQ(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new HQ(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, SQ(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, HQ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, UQ = 3e4, WQ = 15e3, GQ = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var KQ = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(X.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, Z.isRequired(e, "connection"), Z.isRequired(t, "logger"), Z.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? UQ, this.keepAliveIntervalInMilliseconds = a ?? WQ, this._statefulReconnectBufferSize = o ?? GQ, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new zQ(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
		this._connectionState = $.Connecting, this._logger.log(X.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), yQ.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = $.Connected, this._connectionStarted = !0, this._logger.log(X.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = $.Disconnected, this._logger.log(X.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(X.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(X.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new VQ(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(X.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === $.Disconnected) return this._logger.log(X.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === $.Disconnecting) return this._logger.log(X.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = $.Disconnecting, this._logger.log(X.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(X.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new lQ("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new BQ();
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
						this._logger.log(X.Error, `Invoke client method threw error: ${MQ(e)}`);
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
							this._logger.log(X.Error, `Stream callback threw error: ${MQ(e)}`);
						}
					}
					break;
				}
				case Q.Ping: break;
				case Q.Close: {
					this._logger.log(X.Information, "Close message received from server.");
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
				default: this._logger.log(X.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(X.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(X.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(X.Debug, "Server handshake complete."), this._handshakeResolver(), n;
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
			this._logger.log(X.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(X.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(X.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(X.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(X.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(X.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(X.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new lQ("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = $.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), yQ.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(X.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) this._logger.log(X.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
		else {
			if (this._connectionState = $.Reconnecting, e ? this._logger.log(X.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(X.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
				try {
					this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
				} catch (t) {
					this._logger.log(X.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
				}
				if (this._connectionState !== $.Reconnecting) {
					this._logger.log(X.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
					return;
				}
			}
			for (; i !== null;) {
				if (this._logger.log(X.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
					this._reconnectDelayHandle = setTimeout(e, i);
				}), this._reconnectDelayHandle = void 0, this._connectionState !== $.Reconnecting) {
					this._logger.log(X.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
					return;
				}
				try {
					if (await this._startInternal(), this._connectionState = $.Connected, this._logger.log(X.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
						this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
					} catch (e) {
						this._logger.log(X.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
					}
					return;
				} catch (e) {
					if (this._logger.log(X.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== $.Reconnecting) {
						this._logger.log(X.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === $.Disconnecting && this._completeClose();
						return;
					}
					n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
				}
			}
			this._logger.log(X.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
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
			return this._logger.log(X.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(X.Error, `Stream 'error' callback called with '${e}' threw error: ${MQ(t)}`);
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
}, qQ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], JQ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? qQ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, YQ = class {};
YQ.Authorization = "Authorization", YQ.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var XQ = class extends gQ {
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
		e.headers ||= {}, this._accessToken ? e.headers[YQ.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[YQ.Authorization] && delete e.headers[YQ.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, ZQ;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(ZQ ||= {});
var QQ;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(QQ ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var $Q = class {
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
}, e$ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new $Q(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, QQ, "transferFormat"), this._url = e, this._logger.log(X.Trace, "(LongPolling transport) Connecting."), t === QQ.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = DQ(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === QQ.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(X.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new sQ(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(X.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(X.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(X.Trace, `(LongPolling transport) data received. ${bQ(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new sQ(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof cQ ? this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(X.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(X.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? CQ(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(X.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(X.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = DQ();
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
			i ? i instanceof sQ && (i.statusCode === 404 ? this._logger.log(X.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(X.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(X.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(X.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(X.Trace, e), this.onclose(this._closeError);
		}
	}
}, t$ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, QQ, "transferFormat"), this._logger.log(X.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== QQ.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (yQ.isBrowser || yQ.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = DQ();
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
						this._logger.log(X.Trace, `(SSE transport) data received. ${bQ(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(X.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? CQ(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, n$ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, QQ, "transferFormat"), this._logger.log(X.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (yQ.isNode || yQ.isReactNative) {
				let t = {}, [r, i] = DQ();
				t[r] = i, n && (t[YQ.Authorization] = `Bearer ${n}`), o && (t[YQ.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === QQ.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(X.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(X.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(X.Trace, `(WebSockets transport) data received. ${bQ(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(X.Trace, `(WebSockets transport) sending data. ${bQ(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(X.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, r$ = 100, i$ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, Z.isRequired(t, "url"), this._logger = wQ(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (yQ.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!yQ.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : yQ.isNode && !n.WebSocket && r && (n.WebSocket = r), !yQ.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : yQ.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new XQ(n.httpClient || new LQ(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= QQ.Binary, Z.isIn(e, QQ, "transferFormat"), this._logger.log(X.Debug, `Starting connection with transfer format '${QQ[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(X.Error, e), await this._stopPromise, Promise.reject(new lQ(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(X.Error, e), Promise.reject(new lQ(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new o$(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(X.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(X.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(X.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(X.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === ZQ.WebSockets) this.transport = this._constructTransport(ZQ.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new lQ("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < r$);
				if (r === r$ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof e$ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(X.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(X.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = DQ();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(X.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new pQ("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof sQ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(X.Error, t), Promise.reject(new pQ(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(X.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(X.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new fQ(`${n.transport} failed: ${e}`, ZQ[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(X.Debug, e), Promise.reject(new lQ(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new mQ(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case ZQ.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new n$(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case ZQ.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new t$(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case ZQ.LongPolling: return new e$(this._httpClient, this._logger, this._options);
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
		let i = ZQ[e.transport];
		if (i == null) return this._logger.log(X.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (a$(t, i)) {
			if (e.transferFormats.map((e) => QQ[e]).indexOf(n) >= 0) {
				if (i === ZQ.WebSockets && !this._options.WebSocket || i === ZQ.ServerSentEvents && !this._options.EventSource) return this._logger.log(X.Debug, `Skipping transport '${ZQ[i]}' because it is not supported in your environment.'`), new uQ(`'${ZQ[i]}' is not supported in your environment.`, i);
				this._logger.log(X.Debug, `Selecting transport '${ZQ[i]}'.`);
				try {
					return this.features.reconnect = i === ZQ.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(X.Debug, `Skipping transport '${ZQ[i]}' because it does not support the requested transfer format '${QQ[n]}'.`), /* @__PURE__ */ Error(`'${ZQ[i]}' does not support ${QQ[n]}.`);
		}
		return this._logger.log(X.Debug, `Skipping transport '${ZQ[i]}' because it was disabled by the client.`), new dQ(`'${ZQ[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(X.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") this._logger.log(X.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
		else {
			if (this._connectionState === "Connecting") throw this._logger.log(X.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
			if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(X.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(X.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
				this._logger.log(X.Error, `TransportSendQueue.stop() threw error '${e}'.`);
			}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
				this._connectionStarted = !1;
				try {
					this.onclose && this.onclose(e);
				} catch (t) {
					this._logger.log(X.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
				}
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!yQ.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(X.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function a$(e, t) {
	return !e || (t & e) !== 0;
}
var o$ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new s$(), this._transportResult = new s$(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new s$(), this._transportResult.promise;
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
			this._sendBufferedData = new s$();
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
}, s$ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, c$ = "json", l$ = class {
	constructor() {
		this.name = c$, this.version = 2, this.transferFormat = QQ.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = _Q.instance);
		let n = RQ.parse(e), r = [];
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
					t.log(X.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return RQ.write(JSON.stringify(e));
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
}, u$ = {
	trace: X.Trace,
	debug: X.Debug,
	info: X.Information,
	information: X.Information,
	warn: X.Warning,
	warning: X.Warning,
	error: X.Error,
	critical: X.Critical,
	none: X.None
};
function d$(e) {
	let t = u$[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var f$ = class {
	configureLogging(e) {
		if (Z.isRequired(e, "logging"), p$(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = d$(e);
			this.logger = new EQ(t);
		} else this.logger = new EQ(e);
		return this;
	}
	withUrl(e, t) {
		return Z.isRequired(e, "url"), Z.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return Z.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new JQ(e) : e : new JQ(), this;
	}
	withServerTimeout(e) {
		return Z.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return Z.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new i$(this.url, e);
		return KQ.create(t, this.logger || _Q.instance, this.protocol || new l$(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function p$(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var m$ = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, h$ = class {
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
}, g$ = 500;
function _$(e) {
	let { changes: t, ...n } = e;
	return n;
}
function v$() {
	return {};
}
function y$(e) {
	return typeof e == "string" ? e : null;
}
var b$ = class {
	windowId;
	connection;
	started = !1;
	gate = new h$();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new rQ(t), this.connection = new f$().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(X.Warning).build();
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, y$(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, y$(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, _$));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, _$));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, _$));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, v$, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new m$(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, v$));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), g$);
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
}, x$ = Promise.resolve(), S$ = () => {}, C$ = JZ * 3 / 4, w$ = 128, T$ = class {
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
		if (this.handed >= this.given) return x$;
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
		for (; this.flight !== null;) await this.flight.catch(S$);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = XZ(e.value), i = r === null ? null : $Z(r);
		return i?.catch(S$), new Promise((a, o) => {
			let s = D$(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? E$(e) : E$({
				...e,
				value: void 0
			}) + w$;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, O$(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof m$) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= C$);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => $Z(e));
		return t.catch(S$), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function E$(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function D$(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function O$(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var k$ = "content-fills", A$ = "content", j$ = "data-ui-root", M$ = "--ui-height", N$ = "var(--ui-fill-height";
function P$(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(j$)) return;
	let r = e.style.getPropertyValue(M$).trimStart().startsWith(N$);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(An, r);
}
//#endregion
//#region src/updates/form-owner.ts
var F$ = "form-owner", I$ = "ui-form-";
function L$(e) {
	return I$ + e.replace(/[ \t\n\f\r]/g, "_");
}
function R$(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = L$(t);
	B$(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function z$(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(I$) && B$(e);
	}
}
function B$(e) {
	let t = V$();
	if (t.querySelector(`form[id="${Gi(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function V$() {
	let e = document.body.querySelector(`[${sn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(sn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var H$ = document;
function U$() {
	try {
		return H$.execCommand("copy");
	} catch {
		return !1;
	}
}
function W$(e) {
	try {
		return typeof H$.execCommand == "function" && H$.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var G$ = "ui-lightbox", K$ = "ui-lightbox-title", q$ = new Jy("data-ui-lightbox-part"), J$ = "data-ui-lightbox-set", Y$ = "data-ui-lightbox-slot", X$ = "data-ui-lightbox-still", Z$ = "--ui-lightbox-shift", Q$ = 16, $$ = 1 / 5, e1 = null, t1 = null, n1 = null;
function r1(e, t, n) {
	let r = t.filter((e) => to(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	e1 ??= c1(e), (e1.dialog.hasAttribute("hidden") || !e1.dialog.isConnected) && document.body.append(e1.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => to(e.source) === null).length;
	n1 = null, t1 = {
		pictures: r,
		index: s1(n - i, r.length)
	}, e1.dialog.toggleAttribute(J$, r.length > 1);
	for (let e of e1.neighbours) e.hidden = r.length < 2;
	return g1(e1), _1(e1, t1), e.open(G$);
}
function i1(e, t, n) {
	let r = a1(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(o1)) {
		let n = t === e ? r : a1(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function a1(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = to(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function o1(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function s1(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function c1(e) {
	let { dialog: t, surface: n } = qy({
		key: G$,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: K$,
		closesOnEscapeAndBackdrop: !0
	}), r = q$.element("h2", "ui-lightbox__title"), i = u1("ui-lightbox__close", "close"), a = q$.element("div", "ui-lightbox__stage"), [o, s] = l1("previous"), [c, l] = l1("current"), [u, d] = l1("next"), f = q$.element("div", "ui-lightbox__nav"), p = u1("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = u1("ui-lightbox__step ui-lightbox__step--next", "next"), h = q$.element("span", "ui-lightbox__counter ui-text-type--caption"), g = q$.element("span", "ui-lightbox__count-room"), _ = q$.element("span", "ui-lightbox__count"), v = q$.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = K$, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), O.write(r, null, "ui.lightbox.label"), O.write(i, "aria-label", "ui.action.close"), O.write(p, "aria-label", "ui.lightbox.previous"), O.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (q$.pressed(t)) {
			case "close":
				e.dismiss(G$);
				break;
			case "previous":
				d1(-1);
				break;
			case "next": d1(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !N(e) || t1 === null || t1.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), d1(y1(t) ? -n : n));
	}), b1(t, a), {
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
function l1(e) {
	let t = q$.element("div", "ui-lightbox__figure"), n = q$.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(Y$, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(st, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function u1(e, t) {
	let n = q$.element("button", e, t);
	return n.type = "button", n;
}
function d1(e) {
	if (e1 === null || t1 === null || t1.pictures.length < 2) return;
	let t = e1;
	if (m1(t), Pm()) {
		h1(t, e), g1(t), _1(t, t1);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = y1(t.dialog) ? -1 : 1;
	n1 = n, t.stage.removeAttribute(X$), t.stage.style.setProperty(Z$, `${-e * r * f1(t.stage)}px`), Im(t.current, B.normal + 100, () => p1(t, n));
}
function f1(e) {
	return e.getBoundingClientRect().width + Q$;
}
function p1(e, t) {
	if (n1 !== t || t.landed) return;
	h1(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? m1(e) : n.then(() => {
		n1 === t && m1(e);
	});
}
function m1(e) {
	let t = n1;
	t !== null && t1 !== null && (n1 = null, t.landed || h1(e, t.by), g1(e), _1(e, t1));
}
function h1(e, t) {
	if (t1 === null) return;
	let n = t1.pictures.length;
	t1.index = ((t1.index + t) % n + n) % n, v1(e.picture, t1.pictures[t1.index].source);
}
function g1(e) {
	e.stage.setAttribute(X$, ""), e.stage.style.setProperty(Z$, "0px"), e.stage.getBoundingClientRect();
}
function _1(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	v1(e.picture, r.source), v1(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), v1(e.nextPicture, t.pictures[(t.index + 1) % n].source), O.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), O.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, O.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), O.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function v1(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(st), e.src = t);
}
function y1(e) {
	return getComputedStyle(e).direction === "rtl";
}
function b1(e, t) {
	Ig(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || e1 === null || t1 === null || t1.pictures.length < 2 ? !1 : (m1(e1), !0),
		start: () => t.setAttribute(X$, ""),
		follow: (e) => t.style.setProperty(Z$, `${e}px`),
		end: (n, r, i) => {
			i && x1(n, window.innerWidth, r) ? d1((y1(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(X$), t.style.setProperty(Z$, "0px"));
		}
	});
}
function x1(e, t, n) {
	return Math.abs(e) > t * $$ || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var S1 = "ui-notification-host", C1 = "ui-notification", w1 = "ui-notification--leaving", T1 = "ui-notification__message", E1 = "ui-notification__title", D1 = "ui-notification__action", O1 = "ui-notification__close", k1 = 5e3, A1 = 8e3, j1 = "ui-notification--connection", M1 = "--ui-notification-lift", N1 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), P1 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? k1, this.ensureHost(), this.announcer = Ek(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = LS(e.severity), n = document.createElement("div");
		n.className = N1.has(t) ? `${C1} ${C1}--${t}` : C1, n.classList.toggle(j1, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = T1, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = E1, O.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : O.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${O1} ${Mi}`, O.write(i, "aria-label", "ui.action.close"), O.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(R1(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || M(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), F1(() => {
			if (n.classList.contains(w1)) return;
			let t = this.ensureHost();
			I1(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : A1, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(w1) || (e.classList.add(w1), e.isConnected && (this.returnFocus(e), Pm() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => L1(e), B.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(w1));
		Mp(Op(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${O1}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${S1}`), n = t ?? document.createElement("div");
		return n.classList.add(S1), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function F1(e) {
	if (HG(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		HG(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function I1(e) {
	let t = window.innerHeight - Hh(window.innerHeight);
	t > 0 ? e.style.setProperty(M1, `${Math.round(t)}px`) : e.style.removeProperty(M1);
}
function L1(e) {
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
		duration: B.fast,
		easing: B.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function R1(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${D1} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : O.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function z1(e, t) {
	let n = B1(e), r = e?.label;
	if (n !== void 0) {
		if (!D(r) && !nc(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function B1(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function V1(e, t, n) {
	let r = e.itemKey === !0 ? H1(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = U1(t);
	i === null ? s("insert text effect target holds no text field.", e) : W1(i, r);
}
function H1(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function U1(e) {
	if (Cu(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Cu(t)) return t;
	return null;
}
function W1(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || k(e) || j(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && W$(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function G1(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : K1(t, e.request?.parameters ?? null);
}
function K1(e, t) {
	let n = q1(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function q1(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, J1(e));
	return t.toString();
}
function J1(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function Y1(e, t) {
	let n = Z1([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return Z1(r, t) ?? X1(t);
}
function X1(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && Q1(t, e) ? t : null;
}
function Z1(e, t) {
	let n = null;
	for (let r of e) if (GF(r, t)) {
		if (Q1(r, t)) return r;
		n ??= r;
	}
	return n;
}
function Q1(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var $1 = class {
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
		this.handlers.set(pa(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = pa(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = G1(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : Xa(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !Xa(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = _a(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(zr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = a0(e);
			t !== null && (Sq(t), s0(t));
		}), this.register("ScrollTo", (e) => {
			let t = a0(e);
			if (t === null) return;
			let n = e.effect, r = ma(n.behavior), i = ha(n.block);
			Sq(t), t.scrollIntoView({
				behavior: o0(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = a0(e);
			if (t === null) return;
			let n = e.effect, r = cq(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = ha(n.block);
			Sq(Wu(r)), lq(r, n.key, i === "Unknown" ? "Start" : i, o0(ma(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = a0(e);
			if (t === null) return;
			let n = e.effect, r = va(n.axis) !== "Horizontal", i = Y1(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ga(n.position), u;
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
			let d = o0(ma(n.behavior));
			Sq(i), r && l === "End" && Eq(i) && xq(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			i0(a0(e), null);
		}), this.register("Hide", (e) => {
			i0(a0(e), "hidden");
		}), this.register("Collapse", (e) => {
			i0(a0(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = c0(e, this.valueReaders);
			t !== null && l0(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = a0(e);
			t !== null && V1(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = a0(e);
			t !== null && !Cy(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				r1(this.dialogs, t0(t.images), t.startIndex ?? 0);
				return;
			}
			let n = a0(e), r = n === null ? null : i1(n, t.rows === !0, (t) => e.dom.findEveryComponent(E(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : r1(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Ka(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			iy.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!D(t.message) && !nc(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : z1(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			UG() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!D(t.message) && !nc(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, ya(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!D(t) && !nc(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = D(e.body) || nc(e.body) ? e.body : void 0, r = typeof e.address == "string" && Xa(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && HG(document.visibilityState)) {
			i();
			return;
		}
		let a = B1(e.action);
		JG({
			title: e0(t),
			body: n === void 0 ? void 0 : e0(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Xa(e.icon) ? e.icon : n0(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? r0(),
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
		return t !== void 0 && n !== void 0 && XG(t) ? {
			label: D(e.addressLabel) || nc(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : z1(e.action, this.runAction);
	}
};
function e0(e) {
	return D(e) ? O.translate(e.key, e.args) : nc(e) ? O.resolveText(e.text) : "";
}
function t0(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: D(n.caption) || nc(n.caption) ? n.caption : void 0,
		altText: D(n.altText) || nc(n.altText) ? n.altText : void 0
	});
	return t;
}
function n0() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function r0() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function i0(e, t) {
	if (e === null) return;
	let n = am();
	for (let n of mi) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && om(n);
}
function a0(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(T(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function o0(e) {
	return e === "Smooth" && !Pm() ? "smooth" : "auto";
}
function s0(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Vf))) {
		e.focus();
		return;
	}
	let t = fp(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function c0(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = a0(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Il(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Al(t.readHeld(r));
}
async function l0(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!u0(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function u0(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return U$();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var d0 = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => f0(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = fp(t), i = ap() && Cu(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Tp(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), p0(t) && this.swipes.set(e, Hg(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Mp(Op(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${ng}]:not([hidden])`)) {
			let t = e.getAttribute(ng);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${ng}="${Gi(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${ig}]`);
		if (n === null) return;
		let r = n.closest(`[${ng}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(ng);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || dg(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !bg() && !mu(e)) {
				let n = t.getAttribute(ng);
				n !== null && (e.preventDefault(), this.dismiss(n));
			} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && _p(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(C)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return lg(this.root);
	}
};
function f0(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${ig}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function p0(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var m0 = "ui-leave", h0 = new Jy("data-ui-leave-part"), g0 = "560px", _0 = null, v0 = null;
function y0(e, t) {
	_0 ??= b0();
	let n = _0;
	n.isConnected || document.body.append(n), x0(n, "title", O.text("ui.leave.title")), x0(n, "message", O.text("ui.leave.message")), x0(n, "stay", O.text("ui.leave.stay")), x0(n, "leave", O.text("ui.leave.confirm")), v0 = {
		dialogs: e,
		leave: t
	}, e.open(m0);
}
function b0() {
	let { dialog: e, surface: t } = qy({
		key: m0,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", g0);
	let n = h0.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = h0.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, h0.actions(h0.button("ui-button--ghost", "stay"), h0.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = h0.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = v0;
		v0 = null, n?.dialogs.close(m0), t === "leave" && n?.leave();
	}), e;
}
function x0(e, t, n) {
	let r = h0.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var S0 = class {
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
		let t = C0(e, this.options.window.location.href);
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
function C0(e, t) {
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
	return Xa(s) ? s : null;
}
//#endregion
//#region src/interactions/navigation-progress.ts
var w0 = 200, T0 = 1e4, E0 = "ui-navigation-progress", D0 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? w0, this.givenUpAfter = e.givenUpAfterMilliseconds ?? T0, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		C0(e, this.window.location.href) !== null && this.start(e);
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
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= O0(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function O0() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${E0} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var k0 = "neEntry", A0 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = j0(e.window.history.state) ?? 0, j0(e.window.history.state) === null && e.window.history.replaceState({ [k0]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(K1(this.route, e), !1);
	}
	push(e) {
		let t = K1(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [k0]: this.entry }, "", e)) : this.window.history.replaceState({ [k0]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = j0(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(P0(e.search));
	}
};
function j0(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[k0];
	return typeof t == "number" ? t : null;
}
function M0(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => N0(r, e) !== N0(i, e));
}
function N0(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function P0(e) {
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
var F0 = class {
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = KY(n, this.extensions.converters), c = !1;
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
		!this.state.set(e, t, n, () => L0(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Ic(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Xe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && WY(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => L0(r[0]?.component)) ? {
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
			(typeof n == "string" || nc(n) ? this.addressResolver.isTranslatable(t.reference) : D(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ye}${Ki(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => Yi(e, t, () => I0(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = KY(t, this.extensions.converters);
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
		if (!this.state.has(r, t)) zl(e);
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
function I0(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function L0(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : E(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Da(e, Ea(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var R0 = "EndValue", z0 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Fp) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = T(e.componentId), r = V0(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${T(e.componentId)}"]`) ?? null, n = t === null ? null : B0(e, this.edits?.metadata) ? t.querySelector(`[${zt}]`) : Il(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Ra(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(zt);
		for (let e of r) {
			if (t.metadata !== void 0 && B0(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = V0(T(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function B0(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === R0;
}
function V0(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function H0(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : E(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var U0 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, q0(t));
	}
	apply(e) {
		let t = T(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), W0(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(G0(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: q0(n)
		});
	}
	applyRow(e) {
		let t = T(e.component?.id), n = e.component?.dynamicParameters ?? [], r = G0(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), W0(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(G0(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && K0(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !K0(a.dynamicParameters, e)) continue;
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
function W0(e, t) {
	switch (la(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) J0(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) Y0(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) X0(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) Z0(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function G0(e, t) {
	return `${e}:${ua(t)}`;
}
function K0(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function q0(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function J0(e, t) {
	typeof t.key == "string" && (Y0(e, t.key), e.splice(Q0(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function Y0(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function X0(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? J0(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function Z0(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(Q0(n, e.length), 0, i);
}
function Q0(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var $0 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, e2(e, "", t.map((e) => e.split("."))));
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
function e2(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : e2(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function t2(e) {
	let t = new $0();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(T(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var n2 = class {
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
}, r2 = class {
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
function i2(e, t) {
	let n = a2(e[t], "Reset");
	if (n === null) return null;
	let r = T(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = a2(e[s], "Insert");
		if (t === null || T(t.component?.id) !== r || !tm(i, t.component?.dynamicParameters ?? [])) break;
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
function a2(e, t) {
	if (e === void 0 || fa(e) !== "CollectionChange") return null;
	let n = e;
	return la(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var o2 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function s2(e, t, n, r) {
	return {
		action: la(e.action),
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
var c2 = [], l2 = class {
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
	held = new U0();
	projections;
	touched = null;
	changedHosts = null;
	moves = new n2({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new r2({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => v2(K(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = t2(e), this.projections.isEmpty || IO((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ra(n);
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
		for (let n = g2(e, t); n !== null; n = g2(e, t)) {
			t.add(n);
			let e = za(n);
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
		let t = T(e.reference.componentId), n = e.dynamicParameters;
		if (n.length < 2 || !this.rowMenus.holds(t)) return;
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : qO(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => YY(e, i.steps, a)) && this.rowMenus.heldChanged();
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
			return n === void 0 && (n = y2(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (fa(t) !== "CollectionChange") continue;
			let e = t;
			if (la(e.action) !== "Insert") continue;
			let r = T(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => y2(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = za(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, _2(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of H0(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = Ra(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Ra(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		AW(e, t, {
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
		let n = u() ? performance.now() : -1, r = am(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			PW(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && om(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				fa(n) !== "Value" && IW((e) => !u2(n, e));
				let r = i2(e, t);
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
		this.transfers.around(e, () => this.moves.around(e, c2, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		let n = G(e) === "virtualized";
		try {
			if (n) {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else if (this.reconcileRows(e, t), G(e) === "windowed") for (let t of this.windowRefillHandlers) t(e);
		} finally {
			this.afterRowsChanged(e, t.componentId, !n);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = y2(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && tm(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Ff(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = G(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Ff(n) : null;
			n.remove(), If(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), h2(e, i), bk(e, i), o !== null && If(e, o.row, o.held), c) for (let t of i) Lf(e, t);
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
		switch (fa(e)) {
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
		let t = T(e.address?.component?.id), n = da(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (T(e.address?.component?.id) <= 0) s("validation update has an invalid address.", e);
		else for (let t of this.validationHandlers) t(e);
	}
	applyFullResync() {
		this.state.clear(), l("full resync requested; re-attaching.");
		for (let e of this.fullResyncHandlers) queueMicrotask(e);
	}
	applyCollectionChangeUpdate(e) {
		let t = T(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, s2(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (la(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = la(e.action) === "Move" ? p2(e.moves ?? []) : c2;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = G(e) === "virtualized", i = la(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (la(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				d2(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				m2(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), xk(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = G(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : pk(e, K(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + mO(e);
	}
	moveRow(e, t, n) {
		let r = Ra(e);
		if (r === null) return;
		let i = Math.max(0, n - mO(e));
		G(e) === "virtualized" ? this.virtualization.move(e, t, i) : m2(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = K(e), r = v2(n, t);
		if (r === null) return null;
		let i = pk(e, n), a = i.indexOf(r);
		return gk(i, r), r.remove(), this.afterRowsChanged(e, Ra(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = pk(e, K(e));
		oA(t.element), e.insertBefore(t.element, hk(n, t.element, t.index)), this.afterRowsChanged(e, Ra(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Ra(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, hk(pk(e, K(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		gk(pk(e, K(e)), t), t.remove(), this.afterRowsChanged(e, Ra(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (la(n.action)) {
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
		switch (la(t.action)) {
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
			let e = cq(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = pk(e, K(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, hk(i, o, a.index ?? null)), Lf(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return UX(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = K(e), a = pk(e, i), o = y2(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Ff(c);
					yk(a, c, l), c.replaceWith(l), If(e, l, t);
				} else e.insertBefore(l, hk(a, l, i.index ?? null));
			}
		}
	}
};
function u2(e, t) {
	if (fa(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(C);
	return r !== null && E(r) === T(n?.id) && Oa(r, n?.dynamicParameters ?? []);
}
function d2(e, t, n) {
	let r = K(e), i = y2(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = Pf(e), c = o === null ? null : n ? f2(e, a) : Af(o, r, a);
	_k(pk(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function f2(e, t) {
	let n = [];
	for (let e of t) {
		let t = Ff(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) If(e, null, t);
	};
}
function p2(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function m2(e, t) {
	let n = K(e), r = pk(e, n), i = y2(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = vk(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function h2(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? K(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function g2(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function _2(e) {
	let t = E(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : E(n);
}
function v2(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function y2(e, t = K(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function b2(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return D(n) || nc(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: S2(t.severity)
	} : void 0;
}
function x2(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = O.resolve(D(t) || nc(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function S2(e) {
	let t = oa(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var C2 = "ui-validation--warning", w2 = "ui-validation--info", T2 = "ui-validation-message--marker", E2 = "top-end", D2 = "right", O2 = "--ui-validation-marker-host", k2 = "ui-validation-mark", A2 = "--ui-validation-presentation", j2 = "--ui-validation-color", M2 = "Validation", N2 = /* @__PURE__ */ new Set(["Value", "EndValue"]), P2 = /* @__PURE__ */ new Set(["Min", "Max"]), F2 = `input:not([type='hidden']), textarea, select, .${Di}[role='combobox'], [role='spinbutton']`, I2 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, L2 = {
	Error: Hi,
	Warning: C2,
	Info: w2
}, R2 = `.${Hi}, .${C2}, .${w2}`, z2 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, B2 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, V2 = {
	Error: `${k2}--error`,
	Warning: `${k2}--warning`,
	Info: `${k2}--info`
}, H2 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, U2 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(R2)), V(this.root, R2, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), O.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(R2)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), O.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(R2)) {
			let t = E(e);
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
			X2(t, J2(t) === "Error");
			let e = t.querySelector(`:scope > [${Ui}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), Z2(this.markerMirrors, t, e, {
				message: n,
				severity: J2(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(E(e), e) !== void 0)) return;
		let n = Ac(t), r = J2(e);
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
		e.propertyName === M2 ? this.applyBoundMessage(e) : (this.applyGivenValue(e), this.applyChangeTrigger(e));
	}
	applyGivenValue(e) {
		let t = N2.has(e.propertyName), n = P2.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(E(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(E(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = T(e.reference.componentId), n = b2(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = T(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => aa(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = T(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = D(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: S2(e.severity),
			content: e.content === !0,
			property: da(e.address?.property)
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
		let n = j(t) || k(t) ? null : K2(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return q2(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Il(e);
		return t === null ? null : this.readValue(t);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(E(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: H2[t]
		}), this.applyCurrentState(E(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(E(e))) if (S2(r.severity) === "Error" && W2(t, r) && !W2(n, r)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !W2(t, r) && (n === null || I2[S2(r.severity)] < I2[S2(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: B2[S2(n.severity)],
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
		Y2(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${T(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(x2).join("\n"), !0);
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
			severity: S2(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || I2[e.severity] < I2[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => aa(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => aa(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${on}="${Gi(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(F2)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Pm() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && S2(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) W2(r, e) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function W2(e, t) {
	return ra(t.operator) !== "Required" && G2(e) ? !0 : bm(e, t.operator, t.value);
}
function G2(e) {
	return e !== !1 && !bm(e, "Required", null);
}
function K2(e, t) {
	return oO(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? Wj(e) : null);
}
function q2(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : D(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function J2(e) {
	return e.classList.contains(C2) ? "Warning" : e.classList.contains(w2) ? "Info" : "Error";
}
function Y2(e, t, n) {
	for (let e of Object.values(L2)) t.classList.toggle(e, n !== void 0 && L2[n.severity] === e);
	X2(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(j2) : r.style.setProperty(j2, `var(--ui-color-${z2[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Oc(i, null), i.textContent = String(n.message ?? "")) : O.writeValue(i, null, n?.message ?? null), Z2(e, r, i, n));
}
function X2(e, t) {
	for (let n of e.querySelectorAll(F2)) {
		let r = n.closest(Ei);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function Z2(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(A2).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(T2, o), Q2(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(O2).trim()), r !== void 0 && o ? (n.setAttribute(Re, Ao(n.textContent ?? "")), n.setAttribute(ze, E2), n.setAttribute(Ve, B2[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? NL(n) : PL(n)) : (n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), PL(n));
}
function Q2(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : e4(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && $2(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${k2} ${V2[n.severity]}`, s.textContent = r, s.setAttribute(Re, Ao(r)), s.setAttribute(ze, D2), s.setAttribute(Ve, B2[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && ($2(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), PL(s);
}
function $2(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${k2}`) === null && t.removeAttribute(Be);
}
function e4(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var t4 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, n4 = "card-header-shown", r4 = `[${Pi}], [${Fi}], [${Li}], [${Ri}], [${zi}]`;
function i4(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(r4);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Bi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var a4 = "menu-surface";
function o4(e) {
	let t = e.parentElement;
	t !== null && t.matches(".ui-context-menu, .ui-split-button__menu") && w(t, _n, NC(e));
}
//#endregion
//#region src/updates/tooltip-name.ts
var s4 = "tooltip-name";
function c4(e, t, n) {
	let r = ko(e.getAttribute(Re));
	Oc(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var l4 = /* @__PURE__ */ new WeakMap(), u4 = /* @__PURE__ */ new WeakMap(), d4 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(sa(e), t);
	}
	apply(e) {
		let t = sa(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => f4(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? f4(e) : (jo(e.target, jl(e.convertedValue) ? "" : Al(e.convertedValue)), Oc(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = v4(e.operation);
			Oc(e.target, t), e.operation.convertsNull !== !0 && jl(e.value) || jl(e.convertedValue) ? w(e.target, t, null) : w(e.target, t, Al(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = v4(e.operation);
			Oc(e.target, t), w(e.target, t, null);
		}), this.register("ToggleAttribute", (e) => {
			let t = v4(e.operation), n = e.operation.condition ?? "HasValue", r = !jl(e.value) && p4(e.value, n), i = e.operation.value ?? (jl(e.convertedValue) || m4(n) ? "" : Al(e.convertedValue));
			h4(e.target, _4(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !jl(e.value) && p4(e.value, e.operation.condition ?? "None") ? Al(e.convertedValue).trim() : "";
			g4(e.target, _4(e), t, DC(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = v4(e.operation), n = !jl(e.value) && p4(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Al(e.convertedValue).trim() : "";
				g4(e.target, _4(e), t, DC(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = v4(e.operation), n = e.target;
			if (jl(e.value) || jl(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Al(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(s4, (e) => c4(e.resolved.component, e.target, v4(e.operation))), this.register(F$, (e) => R$(e.target, e.value)), this.register(n4, (e) => i4(e.resolved.component)), this.register(Lc, (e) => Rc(e.target)), this.register(k$, (e) => P$(e.target)), this.register(CP, (e) => TP(e.target)), this.register(OP, (e) => jP(e.resolved.component)), this.register(zx, (e) => {
			let t = Zx(e.target);
			t !== "keep" && h4(e.resolved.component, zx, v4(e.operation), t === "show", "");
		}), this.register(a4, (e) => o4(e.target)), this.register("Property", (e) => {
			let t = v4(e.operation), n = e.target, r = jl(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function f4(e) {
	let t = Al(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), Oc(e.target, null);
}
function p4(e, t) {
	switch (ca(t)) {
		case "None": return !0;
		case "HasValue": return !jl(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !jl(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return go(e).length > 0;
		default: return !jl(e);
	}
}
function m4(e) {
	let t = ca(e);
	return t === "IsTrue" || t === "IsFalse";
}
function h4(e, t, n, r, i) {
	let a = u4.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), u4.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), w(e, n, i)) : (o.delete(t), o.size === 0 && w(e, n, null));
}
function g4(e, t, n, r) {
	let i = l4.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), l4.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function _4(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function v4(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var y4 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => MC.has(e.name),
			convert: (e) => MC.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = b4(e.name), n = {
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
function b4(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var x4 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = ba(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = ba(e.domEventName) || t;
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
		return this.definitions.get(ba(e));
	}
};
function S4(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function C4(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Of, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => S4(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => S4(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var w4 = class {
	converters = new y4();
	events = new x4();
	operations = new d4();
	valueReaders;
	collectionSinks = new o2();
	rowDecorators = new t4();
	constructor(e, t, n, r) {
		C4(this.events), this.valueReaders = new Nl(r);
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
}, T4 = "Submenu", E4 = "ui-menu__submenu", D4 = "Select", O4 = ["Header", "Separator"], k4 = {
	kind: "menu",
	decorate: A4
};
function A4(e) {
	if (O4.includes(M4(e.item, "Kind")) && e.row.setAttribute(hn, ""), !j4(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, T4);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(un, ""), M4(e.item, "Kind") === D4 && e.row.setAttribute(dn, ""), M4(e.item, "Expanded") === !0 && e.row.setAttribute(fn, "");
	let r = document.createElement("div");
	r.className = E4, r.appendChild(n), ZY(r, e.key, e.item), e.row.appendChild(r);
}
function j4(e) {
	let t = M4(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function M4(e, t) {
	let n = UO(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var N4 = {
	kind: "grip",
	decorate: P4
};
function P4(e) {
	e.row.append(F4());
}
function F4() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), O.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function I4(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(R4(n));
	for (let t of e.querySelectorAll(`[${mt}]`)) L4(t, pt, r), L4(t, vt, i);
}
function L4(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function R4(e) {
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
var z4 = `[${bt}]`;
function B4(e) {
	for (let t of e.querySelectorAll(z4)) t.removeAttribute(bt);
}
//#endregion
//#region src/runtime/engine-start.ts
var V4 = 2;
function H4(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= V4 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function U4(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var W4 = "ne.standard.ui.windowId", G4 = [
	500,
	1e3,
	2e3
], K4 = 3, q4 = [
	["refusal", ({ root: e }) => XJ(e)],
	["file input", ({ root: e, validation: t }) => new jy({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Wb({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new lx({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Fx({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new yx({ root: e })],
	["image fallback", ({ root: e }) => new lS({ root: e })],
	["radio group sync", ({ root: e }) => new ES({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new lE({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new tT({ root: e })],
	["debounced commit", ({ root: e }) => new Ox({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new OE({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => jE() ? void 0 : new ME({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new nG({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new aD({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new KH({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new WM({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new ON({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new LN({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new zK({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new nq({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new aq({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new SF({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new oV({ root: e })],
	["toggle button", ({ root: e }) => new gx({ root: e })],
	["button group", ({ root: e }) => new fV({ root: e })],
	["menu", ({ root: e }) => new WL({ root: e })],
	["action bar", ({ root: e, dom: t }) => new cI({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new Pz({ root: e })],
	["menu group", ({ root: e }) => new qP({ root: e })],
	["menu search", ({ root: e }) => new tz({ root: e })],
	["side drawer", ({ root: e }) => new bz({ root: e })],
	["screen keyboard", () => new dz()],
	["grid splitter", ({ root: e }) => new Jz({ root: e })],
	["pane container", ({ root: e }) => new xB({ root: e })],
	["accordion", ({ root: e }) => new gV({ root: e })],
	["tabs", ({ root: e }) => new VV({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new gK({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new tH({ root: e })],
	["breadcrumbs", ({ root: e }) => new gH({ root: e })],
	["scroll anchor", ({ root: e }) => new Cq({ root: e })],
	["visible keys", ({ root: e }) => new kY({ root: e })],
	["surface press", ({ root: e }) => new pU({ root: e })],
	["text selection", ({ root: e }) => new Aq({ root: e })],
	["scroll group", ({ root: e }) => new Lq({ root: e })],
	["flyout interaction", ({ root: e }) => new W_({ root: e })],
	["text fold", ({ root: e }) => new kK({ root: e })],
	["tooltip", ({ root: e }) => $I(e)]
], J4 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Zi(vZ());
	hydration = SZ();
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
	navigationProgress = new D0({ window });
	sessionKey = iy;
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
		this.options = e, this.root = e.root ?? document, this.windowId = LZ(e.windowIdStorageKey ?? W4, (e) => this.reloadAsOwnTab(e)), this.dom = new La(this.root), O.load(this.root), O.setLanguage(document.documentElement.lang), e.strings !== void 0 && O.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : O.loadTableAsync(this.hydration.words.href)), this.extensions = new w4(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(k4), this.extensions.registerRowDecorator(N4), this.extensions.registerRowDecorator(yS);
		let t = new Ta(this.dom, this.metadata), n = this.extensions.operations, r = new aQ(), i = new F0(t, n, this.extensions, r);
		this.reactiveSources = new z0(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new d0({
			root: this.root,
			dom: this.dom
		}), this.notifications = new P1({
			root: this.root,
			dom: this.dom
		}), this.address = new A0({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => YG(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = kZ(document.documentElement, this.windowId, o);
		this.effects = new $1({
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
			systemNotifications: qG(u)
		});
		let d = new Om(this.metadata), f, p = new mm(d, i, new ym(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(T(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new lZ(this.dom), h = new qY(this.metadata, m, this.extensions, n, r), g = new pZ({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), xF((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new qX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new l2(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), O.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), O.onMomentTick(this.rewriteMoments), this.ruleWatcher = new iX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new b$(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new KG({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new eQ(this.transport), O.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Xi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Xi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? gZ(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && gZ(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new T$(this.transport);
		f = new Bp({
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
			Tx(), await _.whenAnsweredAsync();
		}, this.effects.register(Xi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new S0({
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
			confirm: (e, t) => y0(this.dialogs, t),
			pending: () => wx() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(ty, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(Xi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			Xa(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new U2({
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
		for (let [e, t] of q4) H4(e, t, this.engineContext);
		H4("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new iO({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), H4("tree", ({ root: e, effects: t }) => new MG({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), H4("items reorder", ({ root: e }) => new Uk({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), H4("press ripple", ({ root: e }) => new Xq({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", E(e)) || p.hasEventForComponent("click", E(e)),
			waves: document.documentElement.hasAttribute(Lr)
		}), this.engineContext), H4("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new yJ() : void 0, this.engineContext), this.eventPipeline = new Zp({
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
		this.eventPipeline.addEvent(fK.name, fK.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = Bk({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = mK(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(jG.name, jG.registration);
		let re = TA(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(Nx.name, Nx.registration), this.eventPipeline.addEvent(Zw.name, Zw.registration), H4("shortcuts", ({ root: e, dom: t }) => new tR({
			root: e,
			viewShortcuts: nR(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), H4("item drag", ({ root: e, dom: t }) => new OA({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new qU({ root: this.root }), this.windows = new SX({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), H4("pager", ({ root: e, dom: t }) => new RR({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: O,
			observeComponents: V,
			observeSize: zz,
			store: new xP(),
			numbers: FD,
			temporal: Fs,
			icons: { apply: po },
			badges: { writeCount: Tw },
			urls: {
				isImageSource: eo,
				asBrowserReads: $a,
				isSafeLink: Ka,
				isExternalLink: Ya
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
				let r = e.closest(C), a = r === null ? void 0 : this.metadata.getExposedProperty(E(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: ML,
			renames: { open: ou },
			tables: this.tables,
			rows: UY(m, h, this.virtualization),
			uploads: by(v),
			selection: jd,
			popups: mY(this.dom),
			roving: Bu,
			typeAhead: SN,
			focus: pp,
			states: Zc,
			validation: v,
			wheel: eb,
			colors: SY,
			shortcuts: Eu,
			names: Wi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			ay(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			iQ(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new KZ({
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
		let t = Il(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && e3() === null && M0(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = X4();
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
		if (e === O.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		O.setRequested(e);
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
			if (n !== this.languageSwitches || i === O.language || !await O.switchToAsync(i, r)) return;
			O.notifyChanged();
		} finally {
			n === this.languageSwitches && O.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), O.language !== this.culturesLanguage && (this.culturesLanguage = O.language, Fc(this.root, (e) => I4(e, O.number, O.temporal)));
		let i = n ? ac : void 0;
		O.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(O.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		O.language.length > 0 && document.documentElement.lang !== O.language && (document.documentElement.lang = O.language), d(n ? "page's moments written again" : "page's words written again", r, { language: O.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Fc(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = T(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${Gi(n)}"]`)) ka(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => ka(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost(), this.endSwitchProgress?.(), this.endSwitchProgress = null;
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: O.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: O.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), this.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = NZ(e, navigator.cookieEnabled, FZ());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		NZ(e, navigator.cookieEnabled, FZ()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), z$(this.root), await $4();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), B4(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Dc(this.root) || xZ(this.hydration) || this.metadata.getWords().some((e) => ac(e.key)) || ac(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) H4(U4(t), t, this.pluginContext);
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
		O.register(e);
	}
	addEngine(e) {
		this.enginesAwaitingHydration === null ? H4(U4(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !ZZ(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await QZ(e, r) : null);
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
			if (e >= K4) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await wZ(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, G4, Q4), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			PZ(FZ()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = X4();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && Z4(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = e3(), n = t === null && this.heldRuntime !== null && M0(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? P0(e) : t.parameters,
			timeZone: TZ(),
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
			let t = ZZ(e) ? await QZ(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function Y4(e = {}) {
	let t = performance.now(), n = new J4(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function X4() {
	return document.querySelector(`[${jn}="${A$}"]`);
}
function Z4(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) Eq(t) && !(G(t) === "windowed" && Dq(t)) ? (xq(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function Q4(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function $4() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function e3() {
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
_(), Y4().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
